from flask import Flask, jsonify, abort, request
import os
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)

model = SentenceTransformer('bert-base-nli-mean-tokens')

@app.route('/', methods=["POST"])
def index():
    inputs = request.get_json(True)
    if "authorization_token" not in inputs or inputs['authorization_token'] != os.environ.get("AUTH_TOKEN"): 
        abort(401)
    embeddingOriginal = model.encode(inputs['original'])
    embeddingCompare = model.encode(inputs['answer'])
    cosine_score = util.cos_sim(embeddingOriginal, embeddingCompare)
    response = dict(score=cosine_score.item())
    return jsonify(response)