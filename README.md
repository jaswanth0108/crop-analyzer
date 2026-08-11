# 🌱 AgriShield - AI-Assisted Crop Health Analyzer

![AgriShield Hero](https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200&auto=format&fit=crop)

AgriShield is a state-of-the-art agricultural web application that utilizes artificial intelligence to analyze crop images, detect diseases, estimate severity, and provide actionable recommendations for farmers and agricultural experts. 

Built with **Next.js 15**, **React 19**, and a premium **Tailwind CSS v4** design system, AgriShield delivers a highly responsive, animated, and dark-themed user experience tailored for modern agricultural diagnostics.

---

## ✨ Key Features

### 🔍 AI-Powered Disease Detection
- Fast, highly accurate classification of plant diseases.
- Supports **Mock Mode** for MVP demonstration and **Real Mode** for integration with Python-based ML backends (e.g., EfficientNet/U-Net).
- Secure, client-side image validation (checks for image blur using pixel variance, file size limits, and supported formats).

### 🌾 Supported Crops & Conditions
AgriShield is explicitly trained and validated for 13 specific conditions across 3 major crops:
1. **Rice / Paddy (Primary)**: Healthy, Bacterial Leaf Blight, Brown Spot, Leaf Blast, Sheath Blight.
2. **Tomato (Secondary)**: Healthy, Early Blight, Late Blight, Bacterial Spot, Leaf Mold.
3. **Potato (Secondary)**: Healthy, Early Blight, Late Blight.

### 📊 Advanced Diagnostics
- **Grad-CAM Heatmaps**: Visualizes exactly which parts of the leaf the AI focused on to make its prediction, building trust and transparency.
- **Severity Estimation**: Calculates the percentage of the leaf area affected by lesions. *(Currently available exclusively for Rice diseases; unsupported crops display graceful unavailability states).*
- **Confidence Scoring**: Dynamic confidence gauges ensure the system never forces a prediction on low-confidence data.

### 📋 Actionable Recommendation Engine
Automatically maps the predicted disease and severity to a categorized action plan:
- **Immediate Actions**: High-priority steps to prevent immediate crop loss.
- **Treatments**: Specific chemical or organic treatment guidelines.
- **Prevention**: Long-term structural or environmental advice to prevent recurrence.

### 🕒 Scan History & Analytics
- **Local Persistence**: All scans, results, and base64-encoded thumbnails are securely saved to browser `localStorage`.
- **Trend Analysis**: Interactive line charts built with `recharts` allow users to track model confidence trends over time, filterable by crop.
- **Detailed Log**: A scrollable history feed to revisit past diagnoses.

### 📖 Uncompromising Transparency
- Dedicated **Datasets & Models** page outlining the exact datasets used (Paddy Doctor, PlantVillage, PlantDoc, ICAR, Rice Segmentation), their limitations, and licenses.
- Dedicated **Supported Crops** page providing a clear matrix of what the AI can and cannot do.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend Library**: [React 19](https://react.dev/)
- **Styling**: Vanilla CSS Modules + [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Architecture**: Pluggable Strategy Pattern for Inference Backend (`MockInferenceService` vs `RealInferenceService`)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and npm installed.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/jaswanth0108/crop-analyzer.git
   cd "crop-analyzer/agrishield"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.local.example` to `.env.local` (or create one):
   ```env
   # Set to "mock" for frontend-only MVP, or "real" to connect to a Python backend
   NEXT_PUBLIC_INFERENCE_MODE="mock"
   
   # If using real mode, point this to your Python ML server
   INFERENCE_SERVER_URL="http://localhost:8000"
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment (Vercel)

Deploying AgriShield to Vercel is seamless. Because the app relies entirely on standard Next.js features, you can deploy it with zero configuration:

1. Push your code to GitHub.
2. Log into [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import this repository.
4. If you are running the MVP, you do not need to add any environment variables (it defaults to `mock`). 
5. Click **Deploy**.

*Note: If you build a real Python ML backend in the future, you must host the Python backend on a platform like Render, AWS, or GCP, and add `NEXT_PUBLIC_INFERENCE_MODE=real` and `INFERENCE_SERVER_URL=<your-backend-url>` to your Vercel Environment Variables.*

---

## 🎨 Design System Note

This project uses a highly customized, dark-themed CSS architecture (`src/app/globals.css`). It intentionally avoids standard generic colors, opting instead for a cohesive palette of `var(--bg-base)` (Deep Navy/Black), `var(--bg-elevated)` (Slate), and `var(--accent-primary)` (Emerald/Lime gradients). 

Features like glassmorphism (blur backdrops), smooth entry animations (`fade-in-up`), and hover micro-interactions are hardcoded into the global tokens to ensure the app feels premium and alive.

---

## ⚖️ Disclaimer
*AgriShield provides AI-assisted crop health analysis. Results may be incorrect and should be confirmed by a qualified agricultural expert before making treatment decisions. Always follow local regulations when applying chemical treatments.*
