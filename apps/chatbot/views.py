import os
import json
import random
import numpy as np
import onnxruntime as ort
from django.conf import settings
from django.db.models import Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

# Import model koperasi dan utilitas NLP Anda
from apps.loans.models import ActiveLoan, LoanRepayment
from .nltk_utils import tokenize, case_folding, clean_punct, stopwords_removal, correction, stemmingIndo, bag_of_words

# --- SETUP PATH & LOADING DATA ---
BASE_DIR = settings.BASE_DIR
# Sesuaikan 'api' dengan nama folder aplikasi Django Anda tempat menyimpan file-file ini
INTENTS_FILE = os.path.join(BASE_DIR, 'apps/chatbot', 'intents.json')
METADATA_FILE = os.path.join(BASE_DIR, 'apps/chatbot', 'metadata.json')
ONNX_MODEL_FILE = os.path.join(BASE_DIR, 'apps/chatbot', 'chatbot_model.onnx')

# Membaca data intents yang berbentuk list/array
with open(INTENTS_FILE, 'r') as f:
    intents = json.load(f)

with open(METADATA_FILE, 'r') as f:
    metadata = json.load(f)

all_words = metadata['all_words']
tags = metadata['tags']

# Menyalakan session ONNX Runtime
ort_session = ort.InferenceSession(ONNX_MODEL_FILE)

def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=1, keepdims=True)


# --- ENDPOINT API CHATBOT ---
@api_view(['POST'])
@permission_classes([AllowAny]) # <-- Sekarang API ini terbuka untuk umum (publik)
def chatbot_response(request):
    msg = request.data.get('message', '')
    if not msg:
        return Response({'reply': 'Pesan kosong, ada yang bisa saya bantu?'}, status=400)

    # NLP Pipeline & ONNX Inference...
    sentence = case_folding(msg)
    sentence = clean_punct(sentence)
    words = tokenize(sentence)
    words = stopwords_removal(words)
    wordss = [correction(w) for w in words]
    w = [stemmingIndo(word) for word in wordss]

    X = bag_of_words(w, all_words)
    X = X.reshape(1, X.shape[0]).astype(np.float32)

    ort_inputs = {ort_session.get_inputs()[0].name: X}
    ort_outs = ort_session.run(None, ort_inputs)
    output = ort_outs[0]

    def softmax(x):
        e_x = np.exp(x - np.max(x))
        return e_x / e_x.sum(axis=1, keepdims=True)

    probs = softmax(output)
    predicted_idx = np.argmax(output, axis=1)[0]
    
    tag = tags[predicted_idx]
    prob = probs[0][predicted_idx]   

    bot_reply = "Maaf, saya tidak mengerti pertanyaan Anda. Bisa diulangi dengan kalimat lain?"
    
    if prob > 0.75:
        # =================================================================
        # 🔹 BLOK DINAMIS (Butuh Verifikasi Login)
        # =================================================================
        
        if tag == "cek_sisa_pinjaman":
            # 3. CEK APAKAH USER LOGIN SEBELUM NARIK DATA
            if request.user.is_authenticated:
                pinjaman_aktif = ActiveLoan.objects.filter(member__user=request.user, is_fully_paid=False).first()
                
                if pinjaman_aktif:
                    total_dibayar = pinjaman_aktif.repayments.filter(is_verified=True).aggregate(
                        Sum('amount_paid')
                    )['amount_paid__sum'] or 0.00
                    
                    sisa_hutang = float(pinjaman_aktif.total_repayment) - float(total_dibayar)
                    tempo = pinjaman_aktif.due_date.strftime("%d %B %Y") if pinjaman_aktif.due_date else "Bulan ini"
                    
                    bot_reply = f"Halo {request.user.first_name}, Anda memiliki pinjaman aktif. Sisa kewajiban Anda saat ini adalah Rp {sisa_hutang:,.0f}. Jangan lupa jatuh tempo pada {tempo} ya."
                else:
                    bot_reply = f"Halo {request.user.first_name}, saat ini Anda tidak memiliki catatan pinjaman aktif."
            else:
                # Balasan jika tamu (guest) nanya sisa pinjaman
                bot_reply = "🔒 Untuk mengecek sisa pinjaman secara spesifik, silakan **Login** terlebih dahulu ke akun Koperasi Anda."

        # elif tag == "cek_total_simpanan":
        #     # 3. CEK APAKAH USER LOGIN
        #     if request.user.is_authenticated:
        #         # Ganti model Simpanan sesuai nama model asli lu
        #         # total_simpanan = Simpanan.objects.filter(member__user=request.user).aggregate(Sum('saldo'))['saldo__sum']
        #         total_simpanan = 0 # Dummy sementara, ganti dengan query asli lu
        #         bot_reply = f"Total saldo simpanan Anda di koperasi saat ini adalah Rp {total_simpanan:,.0f}."
        #     else:
        #         # Balasan jika tamu (guest) nanya total simpanan
        #         bot_reply = "🔒 Untuk melihat total saldo tabungan, Anda harus **Login** terlebih dahulu."

        # =================================================================
        # 🔸 BLOK STATIS (Bebas Diakses Siapa Saja)
        # =================================================================
        else:
            for intent in intents:
                if tag == intent["tag"]:
                    bot_reply = random.choice(intent['responses'])
                    break

    return Response({'reply': bot_reply})