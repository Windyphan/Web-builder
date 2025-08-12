from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import sys
from datetime import datetime
import logging

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from chatbot import WebDevChatbot

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize chatbot
chatbot = WebDevChatbot()

@app.before_first_request
def initialize_chatbot():
    """Initialize the chatbot when the server starts"""
    try:
        success = chatbot.load_model()
        if success:
            logger.info("Chatbot model loaded successfully!")
        else:
            logger.error("Failed to load chatbot model")
    except Exception as e:
        logger.error(f"Error initializing chatbot: {str(e)}")

@app.route('/')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'AI Chatbot API is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({
                'error': 'Missing message in request body'
            }), 400

        user_message = data['message']
        confidence_threshold = data.get('confidence_threshold', 0.5)

        # Get response from chatbot
        response_data = chatbot.chat(user_message, confidence_threshold)

        return jsonify({
            'success': True,
            'data': response_data
        })

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/chat/history', methods=['GET'])
def get_chat_history():
    """Get conversation history"""
    try:
        limit = request.args.get('limit', 10, type=int)
        history = chatbot.get_conversation_history(limit)

        return jsonify({
            'success': True,
            'data': history
        })

    except Exception as e:
        logger.error(f"Error getting chat history: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/chat/reset', methods=['POST'])
def reset_chat():
    """Reset conversation history"""
    try:
        chatbot.reset_conversation()

        return jsonify({
            'success': True,
            'message': 'Conversation history reset successfully'
        })

    except Exception as e:
        logger.error(f"Error resetting chat: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/model/status', methods=['GET'])
def model_status():
    """Check model status"""
    try:
        model_loaded = chatbot.model is not None
        tokenizer_loaded = chatbot.tokenizer is not None

        return jsonify({
            'success': True,
            'data': {
                'model_loaded': model_loaded,
                'tokenizer_loaded': tokenizer_loaded,
                'ready': model_loaded and tokenizer_loaded,
                'model_name': chatbot.model_name
            }
        })

    except Exception as e:
        logger.error(f"Error checking model status: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/model/retrain', methods=['POST'])
def retrain_model():
    """Retrain the model (development endpoint)"""
    try:
        from train_model import ChatbotTrainer

        trainer = ChatbotTrainer()

        # Train with custom parameters if provided
        data = request.get_json() or {}
        epochs = data.get('epochs', 50)
        batch_size = data.get('batch_size', 32)

        logger.info(f"Starting model retraining with epochs={epochs}, batch_size={batch_size}")

        # Train the model
        history = trainer.train_model(epochs=epochs, batch_size=batch_size)

        # Save the model
        trainer.save_model()

        # Reload the model in the chatbot
        chatbot.load_model()

        logger.info("Model retrained and reloaded successfully!")

        return jsonify({
            'success': True,
            'message': 'Model retrained successfully',
            'training_history': {
                'epochs': len(history.history['loss']),
                'final_accuracy': float(history.history['accuracy'][-1]),
                'final_loss': float(history.history['loss'][-1])
            }
        })

    except Exception as e:
        logger.error(f"Error retraining model: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

    logger.info(f"Starting Flask server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
