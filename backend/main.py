from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_cpp import Llama
import os
import re

# Inisialisasi FastAPI
app = FastAPI()

# Konfigurasi CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ubah ke ['http://localhost:3000'] untuk keamanan di produksi
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tambahkan endpoint root agar tidak 404
@app.get("/")
def read_root():
    return {
        "message": "✅ API is running. Use POST /chat with JSON {'message': 'your prompt here'}"
    }

# Path ke model GGUF
MODEL_PATH = os.path.join("models", "TinyLlama-1.1B-Chat-v1.0.Q4_K_M.gguf")

# Inisialisasi LLaMA model
llm = Llama(
    model_path=MODEL_PATH,
    n_ctx=512,
    n_threads=12,  # Sesuaikan jumlah core CPU-mu
    verbose=False
)

# Schema input request
class Message(BaseModel):
    message: str

# Endpoint utama untuk interaksi dengan chatbot
@app.post("/chat")
async def chat(message: Message):
    user_msg = message.message.strip()
    prompt = f"<|im_start|>user\n{user_msg}<|im_end|>\n<|im_start|>assistant\n"

    try:
        output = llm(
            prompt,
            max_tokens=256,
            temperature=0.7,
            stop=["</s>"],
            echo=False
        )

        # Ambil hasil respon model
        raw_text = output["choices"][0]["text"]

        # Bersihkan teks dari tag dan noise
        cleaned_reply = re.sub(r'\[INST\].*?\[/INST\]', '', raw_text, flags=re.DOTALL)
        cleaned_reply = cleaned_reply.replace('<|user|>', '').replace('<|assistant|>', '').strip()

        # Jika kosong, fallback ke pesan default
        return {
            "reply": cleaned_reply if cleaned_reply else "Maaf, saya tidak yakin apa jawabannya."
        }

    except Exception as e:
        print("⚠️ LLM Error:", e)
        return {"reply": "⚠️ Terjadi kesalahan saat memproses respons dari model."}
