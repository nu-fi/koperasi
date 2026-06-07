import json
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

# Import file dari project lu
from model import NeuralNet
from nltk_utils import tokenize, case_folding, clean_punct, stopwords_removal, correction, stemmingIndo, bag_of_words

# 1. BACA DATA
with open('intents.json', 'r') as f:
    intents = json.load(f)

all_words = []
tags = []
xy = []

print("⚙️ Memulai proses NLP Pipeline. Tunggu sebentar...")

# 2. PROSES NLP (Membersihkan kata)
for intent in intents:
    tag = intent['tag']
    tags.append(tag)
    for pattern in intent['patterns']:
        # Sesuai dengan pipeline NLP lu
        sentence = case_folding(pattern)
        sentence = clean_punct(sentence)
        words = tokenize(sentence)
        words = stopwords_removal(words)
        
        # Koreksi Ejaan & Stemming
        wordss = [correction(w) for w in words]
        w = [stemmingIndo(word) for word in wordss]
        
        all_words.extend(w)
        xy.append((w, tag))

# 3. FILTERING KOSAKATA
all_words = sorted(set(all_words))
tags = sorted(set(tags))

# 4. BIKIN DATA TRAINING (Angka/Matrix)
X_train = []
y_train = []

for (pattern_sentence, tag) in xy:
    bag = bag_of_words(pattern_sentence, all_words)
    X_train.append(bag)
    label = tags.index(tag)
    y_train.append(label)

X_train = np.array(X_train)
y_train = np.array(y_train)

# 5. PENGATURAN MESIN (Hyperparameters)
num_epochs = 1000  # Jumlah perulangan belajar
batch_size = 8
learning_rate = 0.001
input_size = len(X_train[0])
hidden_size = 8
output_size = len(tags)

# 6. SETUP PYTORCH
class ChatDataset(Dataset):
    def __init__(self):
        self.n_samples = len(X_train)
        self.x_data = X_train
        self.y_data = y_train

    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    def __len__(self):
        return self.n_samples

dataset = ChatDataset()
train_loader = DataLoader(dataset=dataset, batch_size=batch_size, shuffle=True, num_workers=0)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = NeuralNet(input_size, hidden_size, output_size).to(device)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

print(f"🚀 Mulai Training Model pada {device}...")

# 7. PROSES TRAINING (Belajar)
for epoch in range(num_epochs):
    for (words, labels) in train_loader:
        words = words.to(device)
        labels = labels.to(dtype=torch.long).to(device)
        
        # Forward pass
        outputs = model(words)
        loss = criterion(outputs, labels)
        
        # Backward pass & optimasi
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
    if (epoch+1) % 100 == 0:
        print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')

print(f'✅ Final loss: {loss.item():.4f}')

# 8. SIMPAN HASIL KE data.pth
data = {
    "model_state": model.state_dict(),
    "input_size": input_size,
    "hidden_size": hidden_size,
    "output_size": output_size,
    "all_words": all_words,
    "tags": tags
}

FILE = "data.pth"
torch.save(data, FILE)
print(f'🎉 Training Selesai! Otak AI berhasil disimpan di file: {FILE}')