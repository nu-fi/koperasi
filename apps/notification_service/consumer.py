import pika
import json
import os
import sys
from dotenv import load_dotenv
from whatsapp import send_whatsapp_msg


# --- KONFIGURASI URL ---
load_dotenv()
RABBITMQ_URL = os.getenv('CLOUDAMQP_URL')
# -----------------------

def callback(ch, method, properties, body):
    print(" [x] Menerima Pesan...")
    try:
        data = json.loads(body)
        phone = data.get('phone')
        message = data.get('message')
        
        print(f"     Target: {phone}")
        print(f"     Pesan: {message}")
        
        # Simulasi kirim WA sukses
        if phone and message:
            success = send_whatsapp_msg(phone, message)
            if success:
                print("[x] Done. Whatsapp sent.")
                ch.basic_ack(delivery_tag=method.delivery_tag)
            else:
                print("[!] Failed to send Whatsapp.")
                ch.basic_nack(delivery_tag=method.delivery_tag)
        
    except Exception as e:
        print(f" [!] Error memproses pesan: {e}")

def start_worker():
    # 1. Cek apakah URL sudah diisi
    if not RABBITMQ_URL or "ganti_ini" in RABBITMQ_URL:
        print("Error: RABBITMQ_URL belum diisi dengan benar di consumer.py")
        return

    print(f" [*] Menghubungkan ke RabbitMQ...")
    
    try:
        # 2. Koneksi ke RabbitMQ
        params = pika.URLParameters(RABBITMQ_URL)
        connection = pika.BlockingConnection(params)
        channel = connection.channel()

        # 3. Pastikan Queue ada
        channel.queue_declare(queue='whatsapp_notifications', durable=True)
        
        # Agar worker tidak overload, kerjakan 1 per 1
        channel.basic_qos(prefetch_count=1)
        
        # 4. Mulai mendengarkan (Listening)
        channel.basic_consume(queue='whatsapp_notifications', on_message_callback=callback)

        print(' [*] Worker Berjalan. Menunggu pesan... (Tekan CTRL+C untuk stop)')
        channel.start_consuming()
        
    except Exception as e:
        print(f"Error Koneksi: {e}")
        print("Pastikan URL benar dan internet lancar (jika pakai CloudAMQP)")

if __name__ == '__main__':
    try:
        start_worker()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)