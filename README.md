# 🌿 GreenGuard: AI-Powered Deforestation Detection & Monitoring System (Frontend)

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green.svg)](https://leafletjs.com/)

The official frontend web application for **GreenGuard**, an AI-powered bi-temporal satellite deforestation detection and environmental analysis platform.

Built to seamlessly interface with the [GreenGuard Backend & Geospatial AI Engine](https://github.com/bilalfarid-1/deforestation-project).

---

## 🚀 Key Features

1. **Interactive Geospatial Study Area (Margalla Hills AOI)**:
   - Built on Leaflet with dynamic layer switching (`Satellite`, `Terrain`, `Street`).
   - 3D terrain elevation hillshade support with auto-flattening during polygon drawing.
   - Restored smooth mouse/touch dragging, pan navigation, and instant AOI boundary framing.

2. **Visual Drift Temporal Comparison**:
   - High-fidelity interactive before/after image slider.
   - Displays genuine high-resolution bitemporal satellite orthomosaics ($T_1$ baseline vs $T_2$ current).
   - Luminous crimson alert overlay showing AI-detected deforestation clusters.
   - Formatted decimal percentage metrics (`Number.toFixed(1)`).

3. **Historical Analysis Records**:
   - Audit trail of past scans with persisted satellite before/after imagery, canopy delta statistics, and localized sub-sector risk scores (`Critical`, `Warning`, `Stable`).

4. **Environmental Watchdog & Community Hub**:
   - Community forum with category filters, thread discussions, and official environmental authority complaint reporting.

---

## 🛠️ Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm start
```
Runs the application at `http://localhost:3000`.

Make sure the backend is active at `http://localhost:5000` (from `deforestation-project`).

---

## 📖 System Architecture & Integration Guide
For the complete technical breakdown of how the frontend, backend, and PyTorch deep learning models communicate—along with post-mortems of resolved integration bugs—see [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md).

---

## 👥 Project Team & Contributions

| Member | Focus Area | Technical Deliverables |
| :--- | :--- | :--- |
| **Bilal Farid** | Full-Stack Integration & Geospatial ML Engineering | • Built Node.js/TypeScript backend API<br>• Real-time Esri satellite mosaic tile pipeline<br>• ML inference optimization & timeout resolution<br>• Frontend map drag, AOI framing, & visual drift bug fixes |
| **Ayesha** | Deep Learning Model Training & Weights | • Trained Attention U-Net & U-Net++ neural networks<br>• Model weight optimization (`attn_unet_best.pth`, `unetpp_best.pth`) |
| **Mahnoor** | ML Research & Training Pipeline | • Jupyter training notebooks, band preprocessing, and loss functions |
| **Waniah** | Frontend Development & UI/UX | • React application architecture (`green-guard`)<br>• UI layout, report dashboards, and page navigation |

---

## 🛡️ License
MIT License. Built for environmental protection and sustainable forest management.
