// Simple JavaScript-based AI Chatbot
// This runs entirely in the browser without requiring Python or TensorFlow

class SimpleBrowserAI {
    constructor() {
        this.trainingData = this.getTrainingData();
        this.responses = this.buildResponseMap();
        this.conversationHistory = [];
        this.keywordWeights = this.buildKeywordWeights();
    }

    getTrainingData() {
        return {
            greetings: {
                patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'what\'s up', 'how are you'],
                responses: [
                    "Hello! I'm here to help you with web development questions.",
                    "Hi there! How can I assist you with your web development needs today?",
                    "Greetings! I'm your web development AI assistant. What can I help you with?"
                ]
            },
            webDevelopment: {
                patterns: ['web development', 'website', 'build', 'create', 'develop', 'frontend', 'backend', 'full stack', 'react', 'javascript'],
                responses: [
                    "Web development involves creating websites and web applications using technologies like HTML, CSS, JavaScript, React, Node.js, and databases.",
                    "We specialize in modern web development using React, Vue.js, Node.js, and cloud technologies. What specific aspect interests you?",
                    "Building great websites involves planning, design, development, testing, and deployment. Our team can guide you through each step."
                ]
            },
            services: {
                patterns: ['services', 'what do you offer', 'what can you build', 'offerings', 'solutions', 'help', 'do'],
                responses: [
                    "We offer custom website development, e-commerce solutions, web applications, mobile-responsive design, and ongoing maintenance.",
                    "Our services include React/Vue.js frontend development, Node.js/Python backend development, database design, and cloud deployment.",
                    "We build everything from simple business websites to complex web applications, e-commerce stores, and progressive web apps."
                ]
            },
            pricing: {
                patterns: ['cost', 'price', 'pricing', 'budget', 'how much', 'quote', 'estimate', 'expensive', 'cheap'],
                responses: [
                    "Our pricing varies based on project complexity. Basic websites start at $2,000, while complex applications range from $10,000+.",
                    "We offer competitive pricing with transparent quotes. Contact us for a detailed estimate based on your requirements.",
                    "Pricing depends on features, complexity, and timeline. We provide free consultations to discuss your budget."
                ]
            },
            technologies: {
                patterns: ['technology', 'tech stack', 'programming', 'languages', 'tools', 'framework', 'library'],
                responses: [
                    "We use modern technologies including React, Vue.js, Node.js, Python, PostgreSQL, MongoDB, AWS, and Docker.",
                    "Our tech stack includes frontend frameworks like React/Vue, backend technologies like Node.js/Python, and cloud platforms.",
                    "We stay current with the latest web technologies to ensure your project uses industry best practices."
                ]
            },
            contact: {
                patterns: ['contact', 'reach', 'phone', 'email', 'meeting', 'consultation', 'talk'],
                responses: [
                    "You can contact us through our contact form, email us directly, or schedule a free consultation call.",
                    "Reach out via our website's contact page or send us an email. We typically respond within 24 hours.",
                    "We're here to help! Use our contact form or email us to discuss your project requirements."
                ]
            },
            goodbye: {
                patterns: ['bye', 'goodbye', 'see you', 'thanks', 'thank you', 'that\'s all', 'done'],
                responses: [
                    "Goodbye! Feel free to reach out anytime for web development assistance.",
                    "Thanks for chatting! Don't hesitate to contact us for your web development needs.",
                    "Have a great day! We're here whenever you need web development support."
                ]
            }
        };
    }

    buildResponseMap() {
        const responses = {};
        Object.keys(this.trainingData).forEach(intent => {
            responses[intent] = this.trainingData[intent].responses;
        });
        return responses;
    }

    buildKeywordWeights() {
        const weights = {};
        Object.keys(this.trainingData).forEach(intent => {
            this.trainingData[intent].patterns.forEach(pattern => {
                const words = pattern.toLowerCase().split(' ');
                words.forEach(word => {
                    if (!weights[word]) weights[word] = {};
                    if (!weights[word][intent]) weights[word][intent] = 0;
                    weights[word][intent] += 1;
                });
            });
        });
        return weights;
    }

    preprocessText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .trim()
            .split(/\s+/)
            .filter(word => word.length > 2); // Remove very short words
    }

    calculateIntentScores(words) {
        const scores = {};
        const intents = Object.keys(this.trainingData);

        // Initialize scores
        intents.forEach(intent => scores[intent] = 0);

        // Calculate scores based on keyword matching
        words.forEach(word => {
            if (this.keywordWeights[word]) {
                Object.keys(this.keywordWeights[word]).forEach(intent => {
                    scores[intent] += this.keywordWeights[word][intent];
                });
            }
        });

        // Boost scores for exact phrase matches
        const originalText = words.join(' ');
        intents.forEach(intent => {
            this.trainingData[intent].patterns.forEach(pattern => {
                if (originalText.includes(pattern.toLowerCase()) ||
                    pattern.toLowerCase().includes(originalText)) {
                    scores[intent] += 5; // Boost for phrase matches
                }
            });
        });

        return scores;
    }

    predictIntent(userInput) {
        const words = this.preprocessText(userInput);
        if (words.length === 0) {
            return { intent: 'unknown', confidence: 0 };
        }

        const scores = this.calculateIntentScores(words);

        // Find the intent with the highest score
        let maxScore = 0;
        let bestIntent = 'unknown';

        Object.keys(scores).forEach(intent => {
            if (scores[intent] > maxScore) {
                maxScore = scores[intent];
                bestIntent = intent;
            }
        });

        // Calculate confidence (normalized score)
        const totalWords = words.length;
        const confidence = Math.min(maxScore / (totalWords * 2), 1); // Normalize to 0-1

        return { intent: bestIntent, confidence };
    }

    generateResponse(intent, confidence, userInput) {
        const confidenceThreshold = 0.3;

        if (confidence < confidenceThreshold || !this.responses[intent]) {
            return this.getFallbackResponse(userInput);
        }

        const possibleResponses = this.responses[intent];
        const randomIndex = Math.floor(Math.random() * possibleResponses.length);
        return possibleResponses[randomIndex];
    }

    getFallbackResponse(userInput) {
        const fallbackResponses = [
            "I'm not entirely sure I understand. Could you please rephrase that?",
            "Could you be more specific about what you're looking for?",
            "I want to make sure I give you the right information. Can you ask that differently?",
            "Let me connect you with our team for detailed assistance. Meanwhile, feel free to browse our services!",
            "That's an interesting question! For the most accurate information, please contact our team directly."
        ];

        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    chat(userInput) {
        if (!userInput || typeof userInput !== 'string' || !userInput.trim()) {
            return {
                response: "Please enter a message.",
                intent: 'empty',
                confidence: 0,
                timestamp: new Date().toISOString()
            };
        }

        const { intent, confidence } = this.predictIntent(userInput);
        const response = this.generateResponse(intent, confidence, userInput);

        // Store conversation history
        this.conversationHistory.push({
            userInput,
            intent,
            confidence,
            response,
            timestamp: new Date().toISOString()
        });

        // Keep only last 50 conversations to prevent memory issues
        if (this.conversationHistory.length > 50) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }

        return {
            response,
            intent,
            confidence,
            timestamp: new Date().toISOString()
        };
    }

    getConversationHistory(limit = 10) {
        return this.conversationHistory.slice(-limit);
    }

    resetConversation() {
        this.conversationHistory = [];
        return "Conversation history cleared.";
    }

    // Method to retrain/update the AI with new patterns
    addTrainingData(intent, patterns, responses) {
        if (!this.trainingData[intent]) {
            this.trainingData[intent] = { patterns: [], responses: [] };
        }

        this.trainingData[intent].patterns.push(...patterns);
        this.trainingData[intent].responses.push(...responses);

        // Rebuild the keyword weights and response map
        this.keywordWeights = this.buildKeywordWeights();
        this.responses = this.buildResponseMap();

        return `Added training data for intent: ${intent}`;
    }
}

// Export for use in React components
export default SimpleBrowserAI;
