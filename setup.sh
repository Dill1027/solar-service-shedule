#!/bin/bash

# Solar Service Tracker Setup Script
echo "🌞 Setting up Solar Service Tracker..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to v14 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Create server .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "🔧 Creating server environment file..."
    cat > server/.env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/solar-tracker
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
EOL
    echo "✅ Created server/.env file"
fi

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure MongoDB is running on your system"
echo "2. Run 'npm run dev' to start both server and client"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "🚀 Available commands:"
echo "  npm run dev       - Start both server and client"
echo "  npm run server    - Start only the server"
echo "  npm run client    - Start only the client"
echo "  npm run build     - Build the client for production"
