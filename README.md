# AI Data Scientist Portfolio

A modern, interactive portfolio website showcasing AI/ML expertise, research publications, and hands-on demos. Built with React, TypeScript, and advanced web technologies to deliver a smooth, engaging user experience.

![Portfolio Preview](https://img.shields.io/badge/React-19.2-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-7.3-purple?logo=vite)

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
- Large interactive portrait with a movable computer-vision lens: seven edge/feature views, interactive object annotations, and imaging-inspired illustrations
- Mouse, touch, and keyboard lens controls, original-image toggle, and reduced-motion support
- Inter body text, Manrope headings, and a grouped education/toolkit section
- Accessible experiment tabs, step controls, and inline career details
- Responsive desktop and mobile layouts
- Subtle section reveals and scroll progress

### Performance Optimizations
- **Bounded image processing**: Filters run on a 576 × 576 canvas; lens movement updates only the clipping position
- **Image optimization**: 87% reduction in image sizes (489KB → 60KB)
- **Code splitting**: Separate vendor bundles for React and GSAP; no Three.js in the homepage bundle
- **GPU acceleration**: Hardware-accelerated transforms and animations
- **Lazy loading**: On-demand component rendering
- **Build optimization**: ESBuild minification with tree-shaking

## 🛠️ Tech Stack

### Core Technologies
- **React 19.2** - Modern UI framework with hooks
- **TypeScript 5.9** - Type-safe development
- **Vite 7.3** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework

### Animation & image processing
- **Canvas 2D** - Local portrait filtering and a CSS-clipped lens
- **GSAP 3.14** - Professional-grade animation library
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

## 🎨 Key Features Explained

### Interactive Portrait Lens
Move or tap the portrait to compare Sobel, Prewitt, Laplacian, Canny-style, horizontal/vertical edges, and HOG-style orientation features. Keyboard users can move the lens with arrow keys and reset with Home.

- **Detect:** curated hover/tap annotations for person, shirt, face, hair, glasses, and watch. Nested regions prioritize the smallest object under the pointer. Buttons and arrow keys make every annotation available without a mouse.
- **Imaging:** pre-generated X-ray, CT, and MRI-inspired illustrations, with a movable lens and full-image view. These are clearly labeled conceptual illustrations, not actual scans or inferred anatomy.

All assets ship with the website. No model downloads, live model inference, upload controls, or image uploads are used. Edge calculations run on a bounded local canvas; annotations and illustrations are prepared in advance.

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
- Responsive portrait and controls with vertical touch scrolling preserved
- Stacked content and accessible experiment tabs on narrow screens
- Reduced-motion preferences respected by entrance and section animations
- No continuously running animation loop for the portrait

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
- Animations powered by GSAP
- Icons from Lucide React
- Fonts from Google Fonts (Inter, Manrope)

## 🤝 Contributing

While this is a personal portfolio, suggestions and feedback are welcome! Feel free to:
- Open an issue for bugs or suggestions
- Fork the repository and submit pull requests
- Share your thoughts on the interactive demos

---

**Built with ❤️ ** | © 2026 Arjun Sarkar

## Lab calculation checks

With Node.js 22.18 or newer, run `node --test scripts/verify-lab.mjs scripts/verify-vision.mjs`.
The checks cover numerical backpropagation gradients, XOR convergence, each loss
function's derivative, Adam moment updates, convolution padding, fact integrity, and portrait filter calculations.
`npm run build` and `npm run lint` validate the application.
