import tensorflow as tf
import numpy as np
import json
import pickle
import os
import random
from datetime import datetime

class WebDevChatbot:
    def __init__(self, model_dir="models", model_name="webdev_chatbot"):
        self.model_name = model_name
        self.model_dir = model_dir
        self.model = None
        self.tokenizer = None
        self.label_encoder = None
        self.training_data = None
        self.max_sequence_length = 50
        self.conversation_history = []

    def load_model(self):
        """Load the trained model and components"""
        try:
            # Load model
            model_path = os.path.join(self.model_dir, f"{self.model_name}.h5")
            self.model = tf.keras.models.load_model(model_path)

            # Load tokenizer
            tokenizer_path = os.path.join(self.model_dir, f"{self.model_name}_tokenizer.pickle")
            with open(tokenizer_path, 'rb') as f:
                self.tokenizer = pickle.load(f)

            # Load label encoder
            encoder_path = os.path.join(self.model_dir, f"{self.model_name}_label_encoder.pickle")
            with open(encoder_path, 'rb') as f:
                self.label_encoder = pickle.load(f)

            # Load training data for responses
            data_path = os.path.join(self.model_dir, f"{self.model_name}_training_data.json")
            with open(data_path, 'r', encoding='utf-8') as f:
                self.training_data = json.load(f)

            print("Model loaded successfully!")
            return True

        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return False

    def preprocess_text(self, text):
        """Preprocess input text (same as training)"""
        import nltk
        from nltk.tokenize import word_tokenize
        from nltk.corpus import stopwords

        try:
            stop_words = set(stopwords.words('english'))
        except:
            nltk.download('punkt')
            nltk.download('stopwords')
            stop_words = set(stopwords.words('english'))

        # Tokenize and clean
        tokens = word_tokenize(text.lower())
        tokens = [token for token in tokens if token.isalpha() and token not in stop_words]

        return ' '.join(tokens)

    def predict_intent(self, user_input):
        """Predict intent from user input"""
        if not self.model or not self.tokenizer:
            raise ValueError("Model not loaded. Call load_model() first.")

        # Preprocess input
        processed_input = self.preprocess_text(user_input)

        # Convert to sequence
        sequence = self.tokenizer.texts_to_sequences([processed_input])
        sequence = tf.keras.preprocessing.sequence.pad_sequences(
            sequence, maxlen=self.max_sequence_length
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
                return random.choice(intent_data['responses'])

        return "I'm not sure how to respond to that. Could you please rephrase your question?"

    def chat(self, user_input, confidence_threshold=0.5):
        """Main chat function"""
        if not user_input.strip():
            return "Please enter a message."

        try:
            # Predict intent
            intent, confidence = self.predict_intent(user_input)

            # Store conversation history
            self.conversation_history.append({
                'user_input': user_input,
                'predicted_intent': intent,
                'confidence': confidence,
                'timestamp': datetime.now().isoformat()
            })

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
            return {
                'response': f"I'm experiencing technical difficulties. Please try again later.",
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

        return random.choice(fallback_responses)

    def get_conversation_history(self, limit=10):
        """Get recent conversation history"""
        return self.conversation_history[-limit:] if self.conversation_history else []

    def reset_conversation(self):
        """Reset conversation history"""
        self.conversation_history = []
        return "Conversation history cleared."

# Example usage and testing
if __name__ == "__main__":
    # Initialize chatbot
    chatbot = WebDevChatbot()

    # Load model
    if not chatbot.load_model():
        print("Failed to load model. Make sure you've trained it first by running train_model.py")
        exit(1)

    print("Chatbot loaded successfully!")
    print("Type 'quit' to exit, 'history' to see conversation history")
    print("-" * 50)

    # Interactive chat loop
    while True:
        user_input = input("You: ").strip()

        if user_input.lower() in ['quit', 'exit', 'bye']:
            print("Chatbot: Goodbye! Thanks for chatting!")
            break
        elif user_input.lower() == 'history':
            history = chatbot.get_conversation_history()
            print("\nConversation History:")
            for i, entry in enumerate(history, 1):
                print(f"{i}. User: {entry['user_input']}")
                print(f"   Bot: {entry['predicted_intent']} (confidence: {entry['confidence']:.2f})")
            print("-" * 50)
            continue
        elif user_input.lower() == 'reset':
            chatbot.reset_conversation()
            print("Chatbot: Conversation history cleared!")
            continue

        if user_input:
            response_data = chatbot.chat(user_input)
            print(f"Chatbot: {response_data['response']}")
            print(f"(Intent: {response_data['intent']}, Confidence: {response_data['confidence']:.2f})")
        else:
            print("Chatbot: Please enter a message.")
