import torch
import json
from model import NeuralNet 

# 1. Load data bawaan
FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]

# 2. Extract Metadata ke JSON biar Django gak butuh PyTorch buat ngebaca kata
metadata = {
    "input_size": input_size,
    "all_words": data["all_words"],
    "tags": data["tags"]
}
with open("metadata.json", "w") as f:
    json.dump(metadata, f, indent=4)
print("✅ metadata.json berhasil dibuat!")

# 3. Load Model PyTorch
model_nn = NeuralNet(input_size, hidden_size, output_size)
model_nn.load_state_dict(data["model_state"])
model_nn.eval()

# 4. Bikin dummy input buat mancing modelnya
dummy_input = torch.zeros(1, input_size)

# 5. Export ke ONNX
torch.onnx.export(
    model_nn,
    dummy_input,
    "chatbot_model.onnx",
    export_params=True,
    opset_version=11,
    input_names=['input'],
    output_names=['output'],
    dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
)
print("🚀 Convert sukses! chatbot_model.onnx berhasil dibuat!")