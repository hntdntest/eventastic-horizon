from fastapi import FastAPI, Request
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import uvicorn

app = FastAPI()

# Load model (bạn có thể đổi sang model khác nếu muốn)
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

class EmbeddingRequest(BaseModel):
    text: str

class EmbeddingResponse(BaseModel):
    embedding: list

@app.post("/embedding", response_model=EmbeddingResponse)
def get_embedding(req: EmbeddingRequest):
    emb = model.encode(req.text)
    return {"embedding": emb.tolist()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
