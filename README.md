# MobileSolutions - AI Skill Generation System

Eine mobile App für Skill-Management mit KI-gestützter Generierung und Gamification.

## 🚀 Quick Start

### 1. Repository klonen

```bash
git clone <repository-url>
cd MobileSolutions
```

### 2. Backend-Umgebung konfigurieren

```bash
cp backend/.env.example backend/.env
```

Öffne `backend/.env` und füge deinen OpenAI API Key hinzu:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Backend mit Docker starten

```bash
docker-compose up --build
```

### 4. Frontend Dependencies installieren

```bash
cd frontend
npm install
```

### 5. Expo App starten

```bash
npx expo start
```

### Alternativ IOS Simulator

```bash
npm run ios
```

## ✅ Fertig!

- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Mobile App**: Scanne den QR-Code mit der Expo Go App

## 📋 Voraussetzungen

- Docker & Docker Compose
- Node.js 18+
- OpenAI API Key
