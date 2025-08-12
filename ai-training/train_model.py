import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import json
import pickle
import os
from datetime import datetime

# Download required NLTK data
try:
    nltk.download('punkt')
    nltk.download('punkt_tab')
    nltk.download('stopwords')
except:
    pass

class ChatbotTrainer:
    def __init__(self, model_name="webdev_chatbot"):
        self.model_name = model_name
        self.tokenizer = None
        self.model = None
        self.label_encoder = LabelEncoder()
        self.max_sequence_length = 50
        self.vocab_size = 10000

    def prepare_training_data(self, data_path=None):
        """Prepare training data for the chatbot"""
        if data_path and os.path.exists(data_path):
            # Load custom data
            with open(data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            # Use default web development chatbot data
            data = self.get_default_training_data()

        # Extract questions and answers
        questions = []
        answers = []
        intents = []

        for intent in data['intents']:
            intent_name = intent['tag']
            for pattern in intent['patterns']:
                questions.append(pattern.lower())
                intents.append(intent_name)

        return questions, intents

    def get_default_training_data(self):
        """Default training data for web development chatbot"""
        return {
            "intents": [
                {
                    "tag": "greeting",
                    "patterns": [
                        "Hi", "Hello", "Good morning", "Good afternoon", "Good evening",
                        "Hey there", "Greetings", "What's up", "How are you", "Hi there",
                        "Hey", "Howdy", "Good day", "Salutations", "Yo", "What's good",
                        "How's it going", "Nice to meet you", "Pleasure to meet you",
                        "Hello there", "Good to see you", "Hiya", "Sup", "How do you do"
                    ],
                    "responses": [
                        "Hello! I'm here to help you with web development questions.",
                        "Hi there! How can I assist you with your web development needs today?",
                        "Greetings! I'm your web development AI assistant. What can I help you with?",
                        "Welcome! I'm excited to help you with your web development project.",
                        "Hey! Ready to build something amazing together?"
                    ]
                },
                {
                    "tag": "web_development",
                    "patterns": [
                        "What is web development", "Tell me about web development",
                        "How to build a website", "Website development process",
                        "Frontend vs backend", "Full stack development", "What is frontend",
                        "What is backend", "How websites work", "Web development basics",
                        "Learn web development", "Getting started with web dev",
                        "Modern web development", "Web development technologies",
                        "Responsive web design", "Mobile-first development",
                        "Progressive web apps", "Single page applications",
                        "Web application development", "API development",
                        "Database integration", "Cloud deployment"
                    ],
                    "responses": [
                        "Web development involves creating websites and web applications using technologies like HTML, CSS, JavaScript, React, Node.js, and databases.",
                        "Web development includes frontend (user interface) and backend (server-side) development. We specialize in modern frameworks like React, Vue, and Node.js.",
                        "Building a website involves planning, design, development, testing, and deployment. Our team can help you through each step.",
                        "Modern web development focuses on creating fast, responsive, and user-friendly applications using cutting-edge technologies.",
                        "We build everything from simple landing pages to complex enterprise applications with modern frameworks and best practices."
                    ]
                },
                {
                    "tag": "services",
                    "patterns": [
                        "What services do you offer", "Your services", "What can you build",
                        "Website types", "E-commerce development", "Custom web applications",
                        "Web design services", "Mobile app development", "UI UX design",
                        "Logo design", "Branding services", "SEO optimization",
                        "Website maintenance", "Technical support", "Consulting services",
                        "Digital marketing", "Content management systems", "CMS development",
                        "WordPress development", "Shopify development", "Custom solutions",
                        "Enterprise solutions", "Startup packages", "Small business websites"
                    ],
                    "responses": [
                        "We offer custom website development, e-commerce solutions, web applications, mobile-responsive design, and ongoing maintenance.",
                        "Our services include React/Vue.js frontend development, Node.js/Python backend development, database design, and cloud deployment.",
                        "We build everything from simple business websites to complex web applications, e-commerce stores, and progressive web apps.",
                        "Our comprehensive services cover the entire digital journey: design, development, deployment, and ongoing support.",
                        "From startups to enterprises, we provide tailored web solutions that grow with your business needs."
                    ]
                },
                {
                    "tag": "pricing",
                    "patterns": [
                        "How much does it cost", "Pricing", "Website cost", "Development cost",
                        "Budget", "Quote", "Estimate", "Price range", "Cost breakdown",
                        "Affordable websites", "Cheap web development", "Premium pricing",
                        "Enterprise pricing", "Startup pricing", "Monthly payments",
                        "Payment plans", "Free consultation", "Cost calculator",
                        "Investment in website", "ROI of website", "Value pricing"
                    ],
                    "responses": [
                        "Our pricing varies based on project complexity. Basic websites start at $2,000, while complex web applications can range from $10,000+.",
                        "We offer competitive pricing with transparent quotes. Contact us for a detailed estimate based on your specific requirements.",
                        "Pricing depends on features, complexity, and timeline. We provide free consultations to discuss your budget and requirements.",
                        "We believe in transparent pricing with no hidden costs. Every project gets a detailed quote with clear deliverables.",
                        "Investment in a quality website pays for itself through increased business growth and customer engagement."
                    ]
                },
                {
                    "tag": "technologies",
                    "patterns": [
                        "What technologies do you use", "Tech stack", "Programming languages",
                        "React development", "Node.js", "Database technologies", "Vue.js",
                        "Angular", "Python", "JavaScript", "TypeScript", "HTML CSS",
                        "MongoDB", "PostgreSQL", "MySQL", "AWS", "Vercel", "Netlify",
                        "Docker", "Git", "API development", "GraphQL", "REST API",
                        "Microservices", "Serverless", "JAMstack", "Headless CMS"
                    ],
                    "responses": [
                        "We use modern technologies including React, Vue.js, Node.js, Python, PostgreSQL, MongoDB, AWS, and Docker.",
                        "Our tech stack includes frontend frameworks like React/Vue, backend technologies like Node.js/Python, and cloud platforms like AWS/Vercel.",
                        "We stay current with the latest web technologies to ensure your project is built with industry best practices.",
                        "Our technology choices are driven by performance, scalability, and maintainability to ensure long-term success.",
                        "We specialize in the JavaScript ecosystem but are flexible to use the best tools for each specific project."
                    ]
                },
                {
                    "tag": "timeline",
                    "patterns": [
                        "How long does it take", "Project timeline", "Development time",
                        "When will it be ready", "Rush projects", "Quick turnaround",
                        "Project duration", "Delivery time", "Milestones", "Project phases",
                        "Fast development", "Urgent website", "Launch date", "Go live"
                    ],
                    "responses": [
                        "Project timelines vary based on complexity. Simple websites take 2-4 weeks, while complex applications can take 2-6 months.",
                        "We provide detailed project timelines with clear milestones to keep you informed throughout the development process.",
                        "Rush projects are possible with additional resources. We'll work with you to meet your launch deadlines.",
                        "Quality takes time, but we're efficient. We balance speed with thorough testing and quality assurance."
                    ]
                },
                {
                    "tag": "support",
                    "patterns": [
                        "Technical support", "Website maintenance", "Bug fixes", "Updates",
                        "Ongoing support", "Help after launch", "Website issues", "Troubleshooting",
                        "Emergency support", "24/7 support", "Support packages", "Maintenance plans"
                    ],
                    "responses": [
                        "We provide comprehensive post-launch support including bug fixes, updates, and ongoing maintenance.",
                        "Our support packages ensure your website stays secure, updated, and performing optimally.",
                        "We're here for you after launch with technical support and guidance as your business grows.",
                        "Peace of mind comes with our reliable support - we've got your back!"
                    ]
                },
                {
                    "tag": "contact",
                    "patterns": [
                        "How to contact you", "Contact information", "Get in touch",
                        "Phone number", "Email", "Schedule meeting", "Book consultation",
                        "Reach out", "Connect with you", "Contact form", "Call you",
                        "Meeting request", "Free consultation", "Discuss project"
                    ],
                    "responses": [
                        "You can contact us through our contact form, email us directly, or schedule a free consultation call.",
                        "Reach out via our website's contact page or send us an email. We typically respond within 24 hours.",
                        "We're here to help! Use our contact form or email us to discuss your project requirements.",
                        "Ready to get started? Contact us for a free consultation to discuss your vision and requirements."
                    ]
                },
                {
                    "tag": "portfolio",
                    "patterns": [
                        "Show me your work", "Portfolio", "Previous projects", "Examples",
                        "Case studies", "Client work", "Your websites", "Past projects",
                        "Success stories", "Testimonials", "References", "Sample work"
                    ],
                    "responses": [
                        "Check out our portfolio section to see examples of our recent work across various industries.",
                        "We've helped businesses of all sizes achieve their digital goals. Our portfolio showcases our diverse expertise.",
                        "Our case studies demonstrate real results - increased traffic, better user engagement, and business growth.",
                        "From e-commerce platforms to corporate websites, our portfolio reflects our commitment to quality and innovation."
                    ]
                },
                {
                    "tag": "goodbye",
                    "patterns": [
                        "Bye", "Goodbye", "See you later", "Thanks", "Thank you", "That's all",
                        "Farewell", "Take care", "Until next time", "Catch you later",
                        "Peace out", "Have a good day", "Talk to you later", "Signing off"
                    ],
                    "responses": [
                        "Goodbye! Feel free to reach out anytime for web development assistance.",
                        "Thanks for chatting! Don't hesitate to contact us for your web development needs.",
                        "Have a great day! We're here whenever you need web development support.",
                        "Take care! Looking forward to helping you build something amazing.",
                        "Until next time! Remember, we're just a message away for any web development questions."
                    ]
                }
            ]
        }

    def preprocess_text(self, texts):
        """Preprocess text data"""
        processed_texts = []
        stop_words = set(stopwords.words('english'))

        for text in texts:
            # Tokenize
            tokens = word_tokenize(text.lower())
            # Remove stopwords and punctuation
            tokens = [token for token in tokens if token.isalnum() and token not in stop_words]
            processed_texts.append(' '.join(tokens))

        return processed_texts

    def create_tokenizer(self, texts):
        """Create and fit tokenizer"""
        self.tokenizer = tf.keras.preprocessing.text.Tokenizer(
            num_words=self.vocab_size,
            oov_token="<OOV>"
        )
        self.tokenizer.fit_on_texts(texts)

    def texts_to_sequences(self, texts):
        """Convert texts to sequences"""
        sequences = self.tokenizer.texts_to_sequences(texts)
        return tf.keras.preprocessing.sequence.pad_sequences(
            sequences,
            maxlen=self.max_sequence_length,
            padding='post'
        )

    def create_model(self, num_classes):
        """Create the neural network model with improved architecture"""
        model = tf.keras.Sequential([
            tf.keras.layers.Embedding(
                self.vocab_size,
                256,  # Increased embedding dimensions
                input_length=self.max_sequence_length,
                mask_zero=True  # Handle padding
            ),
            tf.keras.layers.SpatialDropout1D(0.2),  # Better dropout for embeddings

            # Bidirectional LSTM layers for better context understanding
            tf.keras.layers.Bidirectional(
                tf.keras.layers.LSTM(128, return_sequences=True, dropout=0.3, recurrent_dropout=0.3)
            ),
            tf.keras.layers.Bidirectional(
                tf.keras.layers.LSTM(64, dropout=0.3, recurrent_dropout=0.3)
            ),

            # Dense layers with batch normalization
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.4),

            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.3),

            tf.keras.layers.Dense(num_classes, activation='softmax')
        ])

        # Use a more sophisticated optimizer
        optimizer = tf.keras.optimizers.Adam(
            learning_rate=0.001,
            beta_1=0.9,
            beta_2=0.999,
            epsilon=1e-07
        )

        model.compile(
            optimizer=optimizer,
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )

        return model

    def augment_training_data(self, questions, intents):
        """Data augmentation to increase training examples"""
        augmented_questions = []
        augmented_intents = []

        # Original data
        augmented_questions.extend(questions)
        augmented_intents.extend(intents)

        # Simple augmentation techniques
        for question, intent in zip(questions, intents):
            # Add variations with different punctuation
            if not question.endswith('?'):
                augmented_questions.append(question + '?')
                augmented_intents.append(intent)

            # Add variations with extra spaces removed
            clean_question = ' '.join(question.split())
            if clean_question != question:
                augmented_questions.append(clean_question)
                augmented_intents.append(intent)

        return augmented_questions, augmented_intents

    def train(self, epochs=150, validation_split=0.2):
        """Train the chatbot model with improved training process"""
        print("Starting chatbot training...")

        # Prepare data
        questions, intents = self.prepare_training_data()

        # Data augmentation
        questions, intents = self.augment_training_data(questions, intents)
        print(f"Loaded {len(questions)} training examples (including augmented) with {len(set(intents))} intent classes")

        # Preprocess text
        processed_questions = self.preprocess_text(questions)

        # Create tokenizer
        self.create_tokenizer(processed_questions)

        # Convert texts to sequences
        X = self.texts_to_sequences(processed_questions)

        # Encode labels
        y = self.label_encoder.fit_transform(intents)

        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=validation_split, random_state=42, stratify=y
        )

        # Create model
        self.model = self.create_model(len(self.label_encoder.classes_))
        print("Model architecture created")
        print(self.model.summary())

        # Callbacks for better training
        callbacks = [
            tf.keras.callbacks.EarlyStopping(
                monitor='val_accuracy',
                patience=15,
                restore_best_weights=True,
                verbose=1
            ),
            tf.keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=8,
                min_lr=1e-6,
                verbose=1
            ),
            tf.keras.callbacks.ModelCheckpoint(
                filepath=f"models/{self.model_name}_best.h5",
                monitor='val_accuracy',
                save_best_only=True,
                verbose=1
            )
        ]

        # Train model
        history = self.model.fit(
            X_train, y_train,
            batch_size=16,  # Smaller batch size for better gradient updates
            epochs=epochs,
            validation_data=(X_val, y_val),
            callbacks=callbacks,
            verbose=1
        )

        # Evaluate model
        val_loss, val_accuracy = self.model.evaluate(X_val, y_val, verbose=0)
        print(f"Final Validation Accuracy: {val_accuracy:.4f}")

        # Save model and components
        self.save_model()

        return history

    def save_model(self):
        """Save the trained model and components"""
        # Create models directory
        models_dir = "models"
        os.makedirs(models_dir, exist_ok=True)

        # Save model
        model_path = os.path.join(models_dir, f"{self.model_name}.h5")
        self.model.save(model_path)
        print(f"Model saved to {model_path}")

        # Save tokenizer
        tokenizer_path = os.path.join(models_dir, f"{self.model_name}_tokenizer.pickle")
        with open(tokenizer_path, 'wb') as f:
            pickle.dump(self.tokenizer, f)
        print(f"Tokenizer saved to {tokenizer_path}")

        # Save label encoder
        label_encoder_path = os.path.join(models_dir, f"{self.model_name}_label_encoder.pickle")
        with open(label_encoder_path, 'wb') as f:
            pickle.dump(self.label_encoder, f)
        print(f"Label encoder saved to {label_encoder_path}")

        # Save training data for reference
        training_data_path = os.path.join(models_dir, f"{self.model_name}_training_data.json")
        with open(training_data_path, 'w', encoding='utf-8') as f:
            json.dump(self.get_default_training_data(), f, indent=2, ensure_ascii=False)
        print(f"Training data saved to {training_data_path}")

def main():
    """Main training function"""
    print("Web Development Chatbot Training")
    print("=" * 40)

    # Initialize trainer
    trainer = ChatbotTrainer("webdev_chatbot")

    # Train the model
    try:
        history = trainer.train(epochs=50)
        print("\nTraining completed successfully!")
        print("Model files saved in the 'models' directory")
    except Exception as e:
        print(f"Training failed with error: {str(e)}")
        raise

if __name__ == "__main__":
    main()
