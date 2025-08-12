@echo off
echo 🚀 Setting up AI Training Environment for Windows...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is required but not installed.
    echo Please install Python 3.8 or higher from https://python.org
    pause
    exit /b 1
)

echo ✅ Python found
python --version

REM Navigate to AI training directory
cd /d "%~dp0"

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv ai_env

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call ai_env\Scripts\activate

REM Upgrade pip
echo ⬆️ Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo 📚 Installing Python dependencies...
pip install -r requirements.txt

REM Create models directory
if not exist "models" mkdir models

echo 🧠 Training AI model from scratch...
python train_model.py

if %errorlevel% equ 0 (
    echo ✅ Model training completed successfully!
    echo 🔄 Testing the trained model...

    echo ✅ Model testing completed!
    echo.
    echo 🎉 AI Training Setup Complete!
    echo 📝 Next steps:
    echo    1. Run 'npm run ai:start' to start the AI API server
    echo    2. Run 'npm run dev' to start your React app
    echo    3. The AI chatbot will appear in the bottom-right corner
    echo.
    echo 🔧 Available commands:
    echo    - npm run ai:train     # Retrain the model
    echo    - npm run ai:start     # Start AI API server
    echo    - npm run ai:test      # Test the model interactively
) else (
    echo ❌ Model training failed
    pause
    exit /b 1
)

pause
