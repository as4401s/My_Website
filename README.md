# AI Data Scientist Portfolio

A modern, interactive portfolio website showcasing AI/ML expertise, research publications, and hands-on demos. Built with React, TypeScript, and advanced web technologies to deliver a smooth, engaging user experience.

![Portfolio Preview](https://img.shields.io/badge/React-18.3-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-7.3-purple?logo=vite) ![Three.js](https://img.shields.io/badge/Three.js-0.172-black?logo=three.js)

## 🚀 Features

### Interactive AI Demos
7 interactive browser-based AI experiments:
- **Neural Network Playground** - Train a real XOR network with backpropagation, inspect predictions, and adjust hidden layers
- **Convolution Explorer** - Paint an image and inspect blur, sharpening, and edge-detection kernels pixel by pixel
- **Gradient Descent Visualizer** - Compare SGD, Momentum, and Adam optimizers on different loss landscapes
- **Transformer Visualizer** - Explore normalized illustrative attention weights
- **Loss Function Playground** - Compare MSE, MAE, Huber, and Cross-Entropy functions
- **Reinforcement Learning Maze** - Watch Q-Learning agents learn in real-time
- **Model Architecture Explorer** - Compare simplified EfficientNetV2, MobileNet, and ResNet diagrams
- **AI field notes** - 144 educational facts across 12 filterable topics

### Modern UI/UX
- Restrained dark palette, editorial typography, and spacious layouts
- Three.js neural-network hero with animated forward-pass signals
- Pause controls, reduced-motion support, and a static WebGL fallback
- Accessible experiment tabs, step controls, and inline career details
- Responsive desktop and mobile layouts
- Subtle section reveals and scroll progress

### Performance Optimizations
- **Mobile-first optimizations**: Reduced particle count, optimized blur effects
- **Image optimization**: 87% reduction in image sizes (489KB → 60KB)
- **Code splitting**: Separate vendor bundles for React, Three.js, and GSAP
- **GPU acceleration**: Hardware-accelerated transforms and animations
- **Lazy loading**: On-demand component rendering
- **Build optimization**: ESBuild minification with tree-shaking

## 🛠️ Tech Stack

### Core Technologies
- **React 18.3** - Modern UI framework with hooks
- **TypeScript 5.6** - Type-safe development
- **Vite 7.3** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework

### Animation & 3D
- **Three.js 0.172** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **GSAP 3.12** - Professional-grade animation library
- **ScrollTrigger** - Scroll-based animations

### UI Components
- **Lucide React** - Beautiful icon library
- **Framer Motion** (via Tailwind) - Animation utilities

### Visualization
- **Victory** - Data visualization for React
- **Canvas API** - Custom chart and network visualizations

## 📂 Project Structure

```
my-website/
├── src/
│   ├── components/
│   │   ├── demos/              # Interactive AI demos
│   │   │   ├── NeuralNetworkPlayground.tsx
│   │   │   ├── GradientDescentVisualizer.tsx
│   │   │   ├── TransformerVisualizer.tsx
│   │   │   ├── LossFunctionPlayground.tsx
│   │   │   ├── RLMaze.tsx
│   │   │   └── ModelArchitectureExplorer.tsx
│   │   ├── ParticleBackground.tsx   # Three.js particle system
│   │   ├── ScrollProgress.tsx       # Scroll indicator
│   │   └── ui/                      # Reusable UI components
│   ├── sections/
│   │   ├── Hero.tsx                 # Landing section
│   │   ├── Experience.tsx           # Work experience timeline
│   │   ├── Skills.tsx               # Tech stack with proficiency bars
│   │   ├── Publications.tsx         # Research publications
│   │   ├── Lab.tsx                  # AI demos showcase
│   │   ├── Hobbies.tsx              # Personal interests
│   │   ├── Navigation.tsx           # Header navigation
│   │   └── Footer.tsx               # Footer section
│   ├── App.tsx                      # Main application component
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles and animations
├── public/                          # Static assets
├── dist/                            # Production build output
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm (or yarn/pnpm)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/as4401s/My_Website.git
   cd My_Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The site will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ (Performance)
- **First Contentful Paint**: < 1.2s
- **Time to Interactive**: < 2.5s
- **Bundle Size**:
  - Main: ~374KB (gzipped: ~111KB)
  - Three.js vendor: ~879KB (gzipped: ~237KB)
  - React vendor: ~11KB (gzipped: ~4KB)

## 🎨 Key Features Explained

### Animated Skill Proficiency Bars
Visual representation of technical skills with animated progress bars that fill on scroll, showing proficiency percentages for each technology.

### Interactive Neural Network Playground
Users can:
- Add/remove hidden layers
- Adjust neuron counts per layer
- Choose activation functions (ReLU, Sigmoid, Tanh)
- Watch real-time training on the XOR problem
- See live loss and epoch metrics

### Gradient Descent Visualizer
Demonstrates optimization algorithms navigating loss landscapes with:
- 3 optimizers: SGD, Momentum, Adam
- 3 loss functions: Quadratic, Rosenbrock, Himmelblau
- Interactive contour plots
- Animated optimization paths
- Adjustable learning rates

### Mobile Optimizations
Automatic detection and optimization for mobile devices:
- Reduced particle count (60 → 20)
- Disabled expensive animations
- Reduced blur radius (128px → 40px)
- Lower device pixel ratio for 3D rendering
- Simplified visual effects

## 🌐 Deployment

This site is optimized for deployment on:
- **Netlify** (recommended)
- **Vercel**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- Any static hosting service

### Netlify Deployment

The repository includes a `netlify.toml` configuration file for automatic deployment:

```bash
# Deploy to Netlify
npm run build
netlify deploy --prod
```

## 📝 About

**Arjun Sarkar** - AI Data Scientist
Ph.D. in Applied Systems Biology
Specializing in Deep Learning, Computer Vision, LLM, and AI Agents

- 💼 LinkedIn: [linkedin.com/in/arjun-sarkar-9a051777](https://www.linkedin.com/in/arjun-sarkar-9a051777/)
- 🐙 GitHub: [github.com/as4401s](https://github.com/as4401s)
- 📝 Medium: [arjun-sarkar786.medium.com](https://arjun-sarkar786.medium.com/)
- 🔬 ORCID: [0000-0001-8835-8020](https://orcid.org/0000-0001-8835-8020)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- UI Design inspired by modern portfolio best practices
- Animations powered by GSAP and Three.js
- Icons from Lucide React
- Fonts from Google Fonts (Inter, Space Grotesk)

## 🤝 Contributing

While this is a personal portfolio, suggestions and feedback are welcome! Feel free to:
- Open an issue for bugs or suggestions
- Fork the repository and submit pull requests
- Share your thoughts on the interactive demos

---

**Built with ❤️ ** | © 2026 Arjun Sarkar

## Lab calculation checks

With Node.js 22.18 or newer, run `node --test scripts/verify-lab.mjs`.
The checks cover numerical backpropagation gradients, XOR convergence, each loss
function's derivative, Adam moment updates, convolution padding, and fact integrity.
`npm run build` and `npm run lint` validate the application.
