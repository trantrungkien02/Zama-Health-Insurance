# 🏥 ZAMA Health Insurance App

This is a modern Next.js web application demonstrating **secure health insurance eligibility checks** using **Fully Homomorphic Encryption (FHE)** on the Ethereum Virtual Machine (FHEVM).

Your health data remains **100% private** — encrypted end-to-end — even while being processed by a smart contract.

---

## 🚀 Features

- 🔐 **Client-side Encryption** of Age, Blood Pressure, and Blood Sugar
- 📦 **Smart Contract Simulation** for Insurance Eligibility
- ✅ **End-to-End Privacy**: No real health data ever leaves your device in plaintext
- 🎯 **FHE Logic Emulation**: Age > 60 OR Blood Pressure > 140 OR Blood Sugar > 180
- 💡 **Step-by-Step UI Flow** with visual indicators
- 🖼️ Beautifully styled using inline CSS and animation effects

---

## 🧠 Technologies Used

- **Next.js** (React Framework)
- **TypeScript**
- **Zama FHEVM Mock Functions**
- **Smart Contract Logic Simulation**
- **Privacy & Encrypted Display Components**

---

## 📸 Screenshots

| Health Input | Smart Contract | Result |
|--------------|----------------|--------|
| ✅ Age, BP, BS input | ✅ Encrypted FHE logic | ✅ Encrypted eligibility result |

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/health-insurance-fhevm.git
cd health-insurance-fhevm
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Run the Development Server
```bash
npm run dev
# or
yarn dev
```
The app will run at http://localhost:3000

### 🧪 Testing Instructions
1. Run the app locally
2. Connect your wallet (mocked button)
3. Input values:
- Age: e.g., 65
- BP: e.g., 150
- Sugar: e.g., 160
4. Click "Check Insurance Eligibility"
5. Watch each step animate through encryption → contract → decryption
6. View result: "Eligible" or "Not Eligible"

### 🔐 Privacy by Design
- Your data is never stored or viewable by the app
- All computation happens on encrypted inputs
- Mimics a real FHEVM pipeline using mock services

### 📄 License
MIT © TranTrungKien02
