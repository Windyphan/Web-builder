#!/bin/bash

# AI Training Setup Script
echo "🚀 Setting up AI Training Environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3.8 or higher from https://python.org"
    exit 1
fi

echo "✅ Python found: $(python3 --version)"

# Navigate to AI training directory
cd ai-training

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv ai_env

# Activate virtual environment (Windows)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source ai_env/Scripts/activate
else
    # Unix/Linux/macOS
    source ai_env/bin/activate
fi

# Upgrade pip
echo "⬆️ Upgrading pip..."
python -m pip install --upgrade pip

# Install requirements
echo "📚 Installing Python dependencies..."
pip install -r requirements.txt

# Create models directory
mkdir -p models

echo "🧠 Training AI model from scratch..."
python train_model.py

if [ $? -eq 0 ]; then
    echo "✅ Model training completed successfully!"
    echo "🔄 Testing the trained model..."
    python chatbot.py <<< "quit"

    if [ $? -eq 0 ]; then
        echo "✅ Model testing completed!"
        echo ""
        echo "🎉 AI Training Setup Complete!"
        echo "📝 Next steps:"
        echo "   1. Run 'npm run ai:start' to start the AI API server"
        echo "   2. Run 'npm run dev' to start your React app"
        echo "   3. The AI chatbot will appear in the bottom-right corner"
        echo ""
        echo "🔧 Available commands:"
        echo "   - npm run ai:train     # Retrain the model"
        echo "   - npm run ai:start     # Start AI API server"
        echo "   - npm run ai:test      # Test the model interactively"
    else
        echo "❌ Model testing failed"
        exit 1
    fi
else
    echo "❌ Model training failed"
    exit 1
fi
