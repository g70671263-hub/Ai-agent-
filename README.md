# Aegis OmniAutomate — Autonomous AI Mobile OS Controller

A military-grade Autonomous AI Mobile Operating System agent with full root-level smartphone capabilities and a strict **100% Human-in-the-Loop Permission Protocol**.

---

## 🚀 Key Features

### 1. 🛡️ Strict Human-in-the-Loop Permission Architecture
- **Zero Autonomous Execution Without Consent**: The agent has root access to all mobile subsystems, but every operation (calls, messages, scripts, browser navigation, hardware toggles, and file access) halts for explicit human confirmation.
- **Detailed Permission Cards**: Displays target app, formal Android/iOS permission identifier (`android.permission.CALL_PHONE`, `os.terminal.EXECUTE_SHELL`, etc.), and security risk rating (**Low**, **Medium**, **High**, **Critical**).
- **Interactive Parameter Inspection**: View and edit payload parameters (phone numbers, message drafts, script code, search URLs) before authorizing.
- **Hardware Kill Switch**: Instant emergency cutoff that blocks all automation actions across the device.
- **Immutable Security Audit Log**: Complete historical record of all authorizations, denials, timestamps, and execution outputs, exportable as JSON.

### 2. 🧠 Multi-Model AI Brain Core
Switch between frontier Gemini intelligence engines based on task complexity:
- **Gemini 3.8 Flash**: Default high-throughput multimodal agent (300ms latency).
- **Gemini 4 Argon**: Deep STEM reasoning, complex multi-step coding, and architectural planning.
- **Gemini 3.1 Flash Lite**: Ultra-low latency edge assistant for quick device intent parsing (120ms).
- **Local Neural NPU**: 0ms on-device rule heuristic engine with zero network dependencies.

### 3. 🌐 Multimodal Intake in Any Language
- **Text in Any Language**: Automatic detection and conversational responses in English, Hindi, Spanish, Arabic, Bengali, French, Japanese, German, Chinese, and more.
- **Voice Recognition**: Real-time Web Speech recognition with live listening waveform visualization.
- **File & Media Analysis**: Upload documents (PDF, CSV, code, JSON), camera snapshots with visual OCR bounding boxes, and video clips.

### 4. 📱 Real Mobile Device Connection & Hardware Bridge
- **QR Code & Pairing PIN**: Scan from your phone camera to run the app as a Progressive Web App (PWA) on your mobile screen.
- **Native Hardware APIs**:
  - `RealDeviceBridge.dial(number)`: Triggers native smartphone phone dialer (`tel:`).
  - `RealDeviceBridge.sendMessage(to, text, app)`: Dispatches via native mobile Share Sheet, SMS, or WhatsApp.
  - `RealDeviceBridge.vibrate()`: Physical haptic feedback in your hand on approval/rejection.
  - `RealDeviceBridge.getCurrentLocation()`: Live GPS sensor telemetry.
  - `RealDeviceBridge.getBatteryStatus()`: Real battery percentage and charging state.

### 5. 💻 Interactive Mobile OS Simulator
- **Phone App**: Live dialer, contact directory, and active in-call screen with audio waveform animation.
- **Messaging Hub**: SMS, WhatsApp, and Telegram threads with draft auto-completion and delivery checks.
- **Code Studio & Terminal**: Python, JavaScript, and Bash script editor with sandboxed ARM64 execution.
- **Web Browser**: Headless browser sandbox with live DOM extraction and link navigation.
- **Camera & AI Vision**: Viewfinder, photo gallery, and object detection overlay.
- **Files Explorer**: File hierarchy (`/storage/emulated/0`), storage gauge, and file content reader.
- **Settings**: Hardware radio toggles (5G, Wi-Fi 6E, Bluetooth 5.4, GPS, Flashlight, Battery Saver, DND).

---

## 🛠️ Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Web Audio API procedural sound synthesizer.
- **Backend**: Node.js, Express, `@google/genai` TypeScript SDK (Gemini 3.8 Flash & Gemini 4 Argon).
- **Mobile/PWA**: Web Share API, Geolocation API, Battery API, Web Speech API, Vibration API.
- **Deployment**: Vercel Serverless Functions (`vercel.json`, `api/index.ts`).

---

## 📦 Getting Started

### Prerequisites
- Node.js 20+
- A Google Gemini API Key (`GEMINI_API_KEY`)

### Installation
```bash
# Clone the repository
git clone https://github.com/sarfraz123january/aegis-mobile-ai.git
cd aegis-mobile-ai

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Add your GEMINI_API_KEY in .env

# Run development server
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

---

## ☁️ Deploy to Vercel

### Method 1: Vercel CLI (1-Click)
```bash
npm install -g vercel
vercel --prod
```

### Method 2: Git Integration
1. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/sarfraz123january/aegis-mobile-ai.git
   git branch -M main
   git push -u origin main
   ```
2. Import the repository in [Vercel](https://vercel.com/new).
3. Under **Project Settings > Environment Variables**, add:
   - `GEMINI_API_KEY` = `your-api-key-here`
4. Deploy!
