from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import pickle
import json
import os
import sys
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class WebDevChatbot:
    def __init__(self, model_dir="models"):
        self.model_dir = model_dir
        self.model = None
        self.tokenizer = None
        self.label_encoder = None
        self.training_data = None
        self.max_sequence_length = 50
        self.is_loaded = False

    def load_model(self):
        """Load the trained model and components"""
        try:
            # Get the directory where this script is located
            script_dir = os.path.dirname(os.path.abspath(__file__))
            model_dir = os.path.join(script_dir, "..", "ai-training", "models")

            # Load model
            model_path = os.path.join(model_dir, "webdev_chatbot.h5")
            if os.path.exists(model_path):
                self.model = tf.keras.models.load_model(model_path)
                logger.info("Model loaded successfully!")
            else:
                logger.error(f"Model file not found: {model_path}")
                return False

            # Load tokenizer
            tokenizer_path = os.path.join(model_dir, "webdev_chatbot_tokenizer.pickle")
            if os.path.exists(tokenizer_path):
                with open(tokenizer_path, 'rb') as f:
                    self.tokenizer = pickle.load(f)
                logger.info("Tokenizer loaded successfully!")
            else:
                logger.error(f"Tokenizer file not found: {tokenizer_path}")
                return False

            # Load label encoder
            encoder_path = os.path.join(model_dir, "webdev_chatbot_label_encoder.pickle")
            if os.path.exists(encoder_path):
                with open(encoder_path, 'rb') as f:
                    self.label_encoder = pickle.load(f)
                logger.info("Label encoder loaded successfully!")
            else:
                logger.error(f"Label encoder file not found: {encoder_path}")
                return False

            # Load training data for responses
            data_path = os.path.join(model_dir, "webdev_chatbot_training_data.json")
            if os.path.exists(data_path):
                with open(data_path, 'r', encoding='utf-8') as f:
                    self.training_data = json.load(f)
                logger.info("Training data loaded successfully!")
            else:
                logger.error(f"Training data file not found: {data_path}")
                return False

            self.is_loaded = True
            return True

        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            return False

    def preprocess_text(self, text):
        """Preprocess input text (same as training)"""
        try:
            import nltk
            from nltk.tokenize import word_tokenize
            from nltk.corpus import stopwords

            # Download required NLTK data if not present
            try:
                stop_words = set(stopwords.words('english'))
            except:
                nltk.download('punkt')
                nltk.download('punkt_tab')
                nltk.download('stopwords')
                stop_words = set(stopwords.words('english'))

            # Tokenize and clean
            tokens = word_tokenize(text.lower())
            tokens = [token for token in tokens if token.isalnum() and token not in stop_words]

            return ' '.join(tokens)
        except Exception as e:
            logger.error(f"Error in text preprocessing: {str(e)}")
            # Fallback preprocessing
            return text.lower().strip()

    def predict_intent(self, user_input):
        """Predict intent from user input"""
        if not self.is_loaded:
            raise ValueError("Model not loaded. Call load_model() first.")

        # Preprocess input
        processed_input = self.preprocess_text(user_input)

        # Convert to sequence
        sequence = self.tokenizer.texts_to_sequences([processed_input])
        sequence = tf.keras.preprocessing.sequence.pad_sequences(
            sequence, maxlen=self.max_sequence_length, padding='post'
        )

        # Make prediction
        prediction = self.model.predict(sequence, verbose=0)
        predicted_class = np.argmax(prediction[0])
        confidence = float(prediction[0][predicted_class])

        # Get intent name
        intent = self.label_encoder.inverse_transform([predicted_class])[0]

        return intent, confidence

    def get_response(self, intent):
        """Get response based on predicted intent"""
        if not self.training_data:
            return "I'm sorry, I'm having trouble accessing my knowledge base."

        # Find the intent in training data
        for intent_data in self.training_data['intents']:
            if intent_data['tag'] == intent:
                import random
                return random.choice(intent_data['responses'])

        return "I'm not sure how to respond to that. Could you please rephrase your question?"

    def chat(self, user_input, confidence_threshold=0.7):
        """Main chat function"""
        if not user_input.strip():
            return {
                'response': "Please enter a message.",
                'intent': 'empty',
                'confidence': 0.0,
                'timestamp': datetime.now().isoformat()
            }

        try:
            # Predict intent
            intent, confidence = self.predict_intent(user_input)

            # Generate response based on confidence
            if confidence >= confidence_threshold:
                response = self.get_response(intent)
            else:
                response = self.handle_low_confidence(user_input, intent, confidence)

            return {
                'response': response,
                'intent': intent,
                'confidence': confidence,
                'timestamp': datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Chat error: {str(e)}")
            return {
                'response': "I'm experiencing technical difficulties. Please try again later or contact us directly.",
                'intent': 'error',
                'confidence': 0.0,
                'timestamp': datetime.now().isoformat(),
                'error': str(e)
            }

    def handle_low_confidence(self, user_input, intent, confidence):
        """Handle low confidence predictions"""
        fallback_responses = [
            "I'm not entirely sure I understand. Could you please rephrase that?",
            "Could you be more specific about what you're looking for?",
            "I want to make sure I give you the right information. Can you ask that in a different way?",
            "Let me connect you with our team for more detailed assistance. In the meantime, feel free to browse our services on the website."
        ]

        import random
        return random.choice(fallback_responses)

# Initialize chatbot
chatbot = WebDevChatbot()

@app.before_first_request
def initialize_chatbot():
    """Initialize the chatbot when the server starts"""
    try:
        success = chatbot.load_model()
        if success:
            logger.info("Chatbot initialized successfully!")
        else:
            logger.error("Failed to initialize chatbot")
    except Exception as e:
        logger.error(f"Error initializing chatbot: {str(e)}")

@app.route('/')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'AI Chatbot API is running',
        'model_loaded': chatbot.is_loaded,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({
                'error': 'Message is required',
                'timestamp': datetime.now().isoformat()
            }), 400

        user_message = data['message'].strip()

        if not user_message:
            return jsonify({
                'error': 'Message cannot be empty',
                'timestamp': datetime.now().isoformat()
            }), 400

        # Get chat response
        response_data = chatbot.chat(user_message)

        return jsonify(response_data)

    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        return jsonify({
            'response': "I'm experiencing technical difficulties. Please try again later.",
            'intent': 'error',
            'confidence': 0.0,
            'timestamp': datetime.now().isoformat(),
            'error': str(e)
        }), 500

@app.route('/api/chat/status', methods=['GET'])
def chat_status():
    """Check chatbot status"""
    return jsonify({
        'model_loaded': chatbot.is_loaded,
        'status': 'ready' if chatbot.is_loaded else 'not_ready',
        'timestamp': datetime.now().isoformat()
    })

# Initialize chatbot on startup
try:
    chatbot.load_model()
except Exception as e:
    logger.error(f"Failed to load chatbot on startup: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True)
