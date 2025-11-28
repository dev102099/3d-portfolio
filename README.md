# 🌑 The Abyss | Immersive 3D Portfolio

> "We live on a placid island of ignorance in the midst of black seas of infinity..."

**The Abyss** is a high-performance, immersive 3D developer portfolio built with **Next.js** and **React Three Fiber**. It moves beyond standard web design, placing the user in a mysterious, atmospheric ocean world where professional experience is carved into ancient stone artifacts.

🔗 **Live Demo:** https://dev-parpyani-porfolio.vercel.app/

---

## 🛠️ Tech Stack

**Core:**

- ![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white) **Next.js 14+** (App Router)
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React 18/19**
- ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS**

**3D & Graphics:**

- **React Three Fiber (R3F)** - The React renderer for Three.js.
- **Drei** - Useful helpers for clouds, text, and cameras.
- **React Three Postprocessing** - For the bloom/glow effects.
- **GLSL Shaders** - Custom shaders for the fire rings, golden particles, and parallax mapping.

**Animation & Logic:**

- ![GSAP](https://img.shields.io/badge/GSAP-GreenSock-green) **GSAP** - For smooth camera flights and UI pop-up physics.
- **Framer Motion** - For UI transitions.

**Assets:**

- **Blender** - Used for modeling, UV unwrapping, and texture baking (High-to-Low poly).

---

## ✨ Key Features

### 1. 🌊 Atmospheric Environment

- A custom infinite ocean shader.
- Volumetric clouds using instanced rendering for performance.
- Custom GLSL "Golden Particles" system with lifecycle management (fade in/out).

### 2. 🗿 Parallax Stone Tablets

- Low-poly stone models that look high-poly using **Parallax Occlusion Mapping (POM)** shaders.
- Custom shader material handles `.exr` height maps to create fake depth on flat surfaces without adding geometry.

### 3. 🔥 Visual Effects

- **Fire Rings:** Procedural noise shaders creating a "Ring of Fire" effect.
- **Selective Bloom:** Using emissive materials to trigger HDR glow on specific elements (Particles, Fire, Text).

### 4. 🎥 Cinematic Navigation

- **Snap-Scroll Logic:** Custom event listener coupled with GSAP to "fly" the camera between sections (Landing -> Work -> Projects -> Skills).
- **Intro Sequence:** A cinematic fly-in animation from the clouds to the first stone slab.

### 5. 🖱️ Interactive Hotspots

- Hybrid 3D/HTML architecture.
- Clicking/Hovering over stone engravings reveals detailed HTML overlays.
- Hotspots track 3D position but render in the DOM for accessibility and crisp text.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repository
git clone [https://github.com/yourusername/3d-portfolio.git](https://github.com/yourusername/3d-portfolio.git)

# 2. Install dependencies
# Note: Use legacy-peer-deps if using React 19 with older 3D libraries
npm install --legacy-peer-deps

# 3. Run the development server
npm run dev
```
