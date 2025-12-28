# 🛡️ Backend Server Setup

This project now includes a dedicated backend server for secure API key management and proxying requests to Hugging Face.

## ✅ Prerequisites

1. **Node.js** (v18 or higher recommended)
2. **MongoDB** (running locally or a cloud URI)

## 📦 Installation

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

## ⚙️ Configuration

Create a `.env` file in the `server` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sentioasis
HUGGINGFACE_API_KEY=your_hugging_face_api_key_here
```

## 🚀 Running the Server

Start the server:

```bash
npm start
```

## 🔐 API Usage

### 1. Generate an API Key

**Endpoint:** `POST /api/auth/generate-key`
**Body:** `{ "name": "My App" }`

**Response:**
```json
{
  "apiKey": "your_generated_uuid_key",
  "name": "My App",
  "message": "Store this key safely. It will not be shown again."
}
```

### 2. Analyze Sentiment

**Endpoint:** `POST /api/sentiment`
**Headers:**
- `Content-Type: application/json`
- `x-api-key: your_generated_uuid_key`

**Body:**
```json
{
  "text": "I love using SentiOasis!",
  "modelId": "cardiffnlp/twitter-roberta-base-sentiment-latest"
}
```

## 🔄 Frontend Integration

To use this backend from the frontend:
1. Update your frontend environment to point to this server (e.g. `VITE_API_BASE_URL=http://localhost:3000/api`).
2. Update the `HuggingFaceService` in the frontend to call this API instead of calling Hugging Face directly.
