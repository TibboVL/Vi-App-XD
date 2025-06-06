# Vi Frontend Application

Welcome to the Vi frontend repository! This React Native application requires native modules and therefore cannot run in Expo Go.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+)
- Android Studio with SDK configured
- Java Development Kit (JDK 17)

### Environment Setup

1. Clone this repository
2. Create these environment files in the project root:
   - `.env.development`
   - `.env.production` (corrected from ".end.production")
3. Install dependencies:
   ```bash
   npm install
   ```

## 🔧 Development

### Running the app

Due to dependencies requiring native modules, we cannot use Expo Go. Instead run:
`npm run android`

## 📦 Creating Test Builds (APK)

To avoid long EAS build times, generate APKs locally using Gradle:

### Production APK Build

1. Set production environment (Windows PowerShell):

   ```powershell
   $env:NODE_ENV="production
   ```

   For macOS/Linux:

   ```bash
   export NODE_ENV=production
   ```

2. Build the APK:
   `cd android`
   `./gradlew assembleRelease`
3. Find the APK:
   `android/app/build/outputs/apk/release/app-release.apk`
