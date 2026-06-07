from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import string

app = Flask(__name__)
CORS(app)  # Ye line frontend connection ke liye zaroori hai

# Model load karo (path check kar lena)
model = joblib.load('models/lr.pkl')
vectorizer = joblib.load('models/vectorizer.pkl')

def wordopt(text):
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+|\[.*?\]|[%s]' % re.escape(string.punctuation), ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        news_text = data['text']
        cleaned_text = wordopt(news_text)
        text_vectorized = vectorizer.transform([cleaned_text])
        prediction = model.predict(text_vectorized)
        result = "Real News" if prediction[0] == 1 else "Fake News"
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)