import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FlaskConical,
  Brain,
  Zap,
  Layers,
  Target,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Code2,
  Cpu,
  Network,
  X
} from 'lucide-react';
import TransformerVisualizer from '../components/demos/TransformerVisualizer';
import LossFunctionPlayground from '../components/demos/LossFunctionPlayground';
import RLMaze from '../components/demos/RLMaze';
import ModelArchitectureExplorer from '../components/demos/ModelArchitectureExplorer';

gsap.registerPlugin(ScrollTrigger);

// Interactive demos
const demos = [
  {
    id: 'transformer',
    title: 'Transformer Visualizer',
    description: 'Interactive attention mechanism visualization. See how Transformers process sequences word by word with real-time attention heatmaps.',
    icon: Network,
    color: 'from-blue-500 to-cyan-500',
    component: TransformerVisualizer,
  },
  {
    id: 'loss-functions',
    title: 'Loss Function Playground',
    description: 'Compare MSE, MAE, Huber, and Cross-Entropy loss functions with live training visualization and parameter tuning.',
    icon: Target,
    color: 'from-purple-500 to-pink-500',
    component: LossFunctionPlayground,
  },
  {
    id: 'rl-maze',
    title: 'Reinforcement Learning Maze',
    description: 'Watch an AI agent learn to navigate a maze using Q-Learning in real-time. Adjust learning rate and exploration.',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    component: RLMaze,
  },
  {
    id: 'efficientnet',
    title: 'Model Architecture Explorer',
    description: 'Visualize EfficientNetV2, MobileNet, and ResNet architectures. Click layers to see detailed information.',
    icon: Layers,
    color: 'from-green-500 to-emerald-500',
    component: ModelArchitectureExplorer,
  },
];

// Medium articles
const articles = [
  {
    title: 'Build your own Transformer from scratch using PyTorch',
    date: 'Apr 26, 2023',
    reads: '795',
    url: 'https://arjun-sarkar786.medium.com/build-your-own-transformer-from-scratch-using-pytorch-84c850470dcb',
  },
  {
    title: 'Implementation of all Loss Functions in NumPy, TensorFlow, and PyTorch',
    date: 'Mar 17, 2023',
    reads: '153',
    url: 'https://arjun-sarkar786.medium.com/implementation-of-all-loss-functions-deep-learning-in-numpy-tensorflow-and-pytorch-e20e72626ebd',
  },
  {
    title: 'Reinforcement Learning for Beginners',
    date: 'Mar 9, 2023',
    reads: '94',
    url: 'https://arjun-sarkar786.medium.com/reinforcement-learning-for-beginners-introduction-concepts-algorithms-and-applications-3f805cbd7f92',
  },
  {
    title: 'EfficientNetV2 — faster, smaller, and higher accuracy',
    date: 'Oct 8, 2022',
    reads: '500',
    url: 'https://arjun-sarkar786.medium.com/efficientnetv2-faster-smaller-and-higher-accuracy-than-vision-transformers-98e23587bf04',
  },
  {
    title: 'All you need to know about Attention and Transformers — Part 2',
    date: 'Sep 13, 2022',
    reads: '906',
    url: 'https://arjun-sarkar786.medium.com/all-you-need-to-know-about-attention-and-transformers-in-depth-understanding-part-2-bf2403804ada',
  },
  {
    title: 'All you need to know about Attention and Transformers — Part 1',
    date: 'Feb 15, 2022',
    reads: '2K',
    url: 'https://arjun-sarkar786.medium.com/all-you-need-to-know-about-attention-and-transformers-in-depth-understanding-part-1-552f0b41d021',
  },
];

// Fun facts about AI
const funFacts = [
  'The first neural network was created in 1943 by Warren McCulloch and Walter Pitts.',
  'GPT-3 has 175 billion parameters — that\'s more than the number of neurons in a hamster brain!',
  'The term "Deep Learning" was first used in 1986 by Rina Dechter.',
  'AlphaGo used reinforcement learning to beat the world champion at Go.',
  'Transformers were introduced in the "Attention Is All You Need" paper in 2017.',
  'The first CNN architecture, LeNet, was created in 1989 by Yann LeCun.',
  'The AI market is estimated to be worth over $184 billion in 2024.',
  'Global artificial intelligence market valuation is projected to hit $1.81 trillion by 2030.',
  '77% of consumers use some form of AI technology today.',
  'Over 8 billion digital voice assistants are projected to be in use globally by the end of 2024.',
  'In 2025, AI transition started shifting from productivity gains to custom-built advanced applications.',
  'Multimodal AI can process diverse data types like text, images, video, and audio simultaneously.',
  'Emotionally intelligent AI agents can now analyze tone and pace of speech to infer human emotions.',
  'OpenAI\'s "Stargate" supercomputer project is projected to cost over $100 billion by 2028.',
  'Google\'s Gemini 1.5 Pro features a context window of up to 2 million tokens.',
  'NVIDIA\'s "Blackwell" architecture represents a massive leap in AI compute performance for 2024.',
  'AI-powered diagnostics are now achieving accuracy levels comparable to human doctors in early disease detection.',
  'Generative AI delivered up to 10.3x ROI in financial services sectors during 2024.',
  'Sustainable AI research focuses on architectures that use up to 70% less energy for training.',
  'Self-supervised learning allows models to learn from unlabeled data, mimicking human curiosity.',
  'The Turing Test was proposed by Alan Turing in 1950 to judge machine intelligence.',
  'John McCarthy coined the term "Artificial Intelligence" in 1956 at the Dartmouth Conference.',
  'IBM\'s Deep Blue was the first computer to beat a reigning world chess champion in 1997.',
  'The "AI Winter" refers to periods of reduced funding and interest in AI research (1970s and 1980s).',
  'ELIZA, created in 1966, was one of the first programs capable of natural language processing.',
  'Reinforcement Learning is based on the psychological concept of operant conditioning.',
  'The "Backpropagation" algorithm for training neural networks was popularized in 1986.',
  'Deepmind\'s AlphaFold has predicted structures for nearly all proteins known to science.',
  'Large Language Models use "Next Token Prediction" as their fundamental training objective.',
  'Llama 3, released in 2024, set new benchmarks for open-source large language models.',
  'Apple Intelligence, introduced in 2024, integrates generative AI deeply into the OS level.',
  'Claude 3.5 Sonnet is widely praised for its human-like reasoning and coding capabilities.',
  'Sora, OpenAI\'s video generation model, can create highly realistic 60-second scenes from text.',
  'The concept of "Prompt Engineering" became a recognized skill set with the rise of LLMs.',
  'Vector databases (like Pinecone) are essential for efficient AI "Long-Term Memory" Retrieval.',
  'RAG (Retrieval-Augmented Generation) helps LLMs access real-time or private information.',
  'Fine-tuning allows a general model to become an expert in a specific domain.',
  'Quantization is a technique to shrink AI models so they can run on mobile devices.',
  'The "Deadly Triad" in RL refers to issues with function approximation, bootstrapping, and off-policy learning.',
  'Gradient Descent is the primary optimization algorithm used to train most modern AI.',
  'The "Vanishing Gradient" problem once made it very difficult to train deep neural networks.',
  'A "Neuron" in a neural network is essentially a mathematical function with weights and biases.',
  'ReLU (Rectified Linear Unit) is the most commonly used activation function today.',
  'Overfitting happens when a model "memorizes" the training data instead of learning patterns.',
  'The "Dropout" technique prevents overfitting by randomly "turning off" neurons during training.',
  'Computer Vision systems use "Kernels" or "Filters" to detect edges and shapes in images.',
  'GANs (Generative Adversarial Networks) consist of two networks: a generator and a discriminator.',
  'StyleGAN is the technology behind sites like "This Person Does Not Exist."',
  'Tesla\'s FSD (Full Self-Driving) uses an "occupancy network" to create 3D maps in real-time.',
  'Whisper is an open-source speech-to-text model that supports 99 languages.',
  'Stable Diffusion brought high-quality image generation to local consumer-grade hardware.',
  'The "Attention" mechanism allowed models to focus on specific parts of an input sequence.',
  'Positional Encoding is how Transformers understand the order of words without recurrence.',
  'Swin Transformers brought the power of self-attention to computer vision tasks.',
  'MoE (Mixture of Experts) allows models to have more parameters while keeping compute costs low.',
  'GPT-4 is rumored to be a Mixture of Experts model with 1.8 trillion parameters.',
  'AutoGPT and BabyAGI were early experiments in autonomous AI agents.',
  'Chain-of-Thought prompting encourages models to "think out loud" before answering.',
  'Few-shot learning allows a model to learn a new task from just 2 or 3 examples.',
  'Zero-shot learning is when a model performs a task it was never explicitly trained for.',
  'The "Stochastic Parrots" paper raised important ethical questions about LLMs.',
  'Hallucination in LLMs occurs when a model generates confident but false information.',
  'RLHF (Reinforcement Learning from Human Feedback) aligns AI behavior with human values.',
  'DPO (Direct Preference Optimization) is a newer, simpler alternative to RLHF.',
  'Evo-Labs\'s Gen-3 Alpha is a competitor to Sora in the high-end video generation space.',
  'Groq uses LPU (Language Processing Unit) technology to achieve ultra-fast LLM inference.',
  'Perplexity AI pioneered the "Search Engine + LLM" hybrid model.',
  'Mistral Large (2024) proved that European companies could compete at the frontier of AI.',
  'Grokk-3 is rumored to be training on one of the world\'s largest GPU clusters.',
  'AGI (Artificial General Intelligence) is AI that can do any intellectual task a human can.',
  'The "Singularity" is the theoretical point where AI exceeds human intelligence recursively.',
  'AI is currently used to optimize the flight paths of thousands of commercial aircraft daily.',
  'Modern weather forecasting relies heavily on AI to process massive climate datasets.',
  'AI agents are now being used to discover new materials for batteries and solar panels.',
  'The "Dead Internet Theory" suggests a large portion of web content is now AI-generated.',
  'Deepfakes use GANs to replace one person\'s likeness with another in videos.',
  'Synthetic Data is data generated by AI to train other AI models.',
  'Robotaxis (like Waymo) have already logged millions of miles on public roads without drivers.',
  'The "Paperclip Maximizer" is a thought experiment about AI goals leading to catastrophe.',
  'Asimov\'s Three Laws of Robotics are early examples of AI alignment theory.',
  'AI "Bias" often stems from historical prejudices present in the training datasets.',
  'The EU AI Act (2024) is the world\'s first comprehensive legal framework for AI.',
  'Explorable Explanation (like the Lab!) is a key method for teaching complex AI concepts.',
  'Transfer Learning allows models trained on millions of images to be "re-used" for niche tasks.',
  'YOLO (You Only Look Once) is a famous algorithm for real-time object detection.',
  'A "Latent Space" is a multi-dimensional map where AI organizes concepts and features.',
  'DALL-E 3 can understand complex spatial instructions better than its predecessors.',
  'Gemini 1.5 Flash is designed for speed and efficiency in high-frequency AI tasks.',
  'Microsoft Research identified that AI disruption might impact high-skill jobs the most by 2026.',
  'Amazon\'s "Q" is a generative AI-powered assistant for businesses and developers.',
  'The number of AI startup unicorns (valued at $1B+) has exploded in 2024-2025.',
  'Microsoft Copilot integrates AI directly into Excel, Word, and PowerPoint.',
  'Figjam\'s AI can generate entire whiteboards and brainstorming sessions from a prompt.',
  'Gamma.app uses AI to generate complete presentations and websites in seconds.',
  'Devin (2024) was introduced as the world\'s first AI software engineer.',
  'Hugging Face is often called the "GitHub of AI" for sharing models and datasets.',
  'GitHub Copilot uses OpenAI\'s Codex model to suggest code in real-time.',
  'Cursor is an AI-first code editor that has gained massive popularity in 2024.',
  'Anthropic was founded by former OpenAI employees focusing on "AI Safety."',
  'Cohere specializes in enterprise-grade LLMs for businesses and developers.',
  'The "Reversal Curse" is a phenomenon where LLMs fail to reverse facts they know.',
  'Scaling Laws suggest that more data and more compute predictably lead to better models.',
  'Data Centers for AI are driving a massive increase in demand for clean energy.',
  'The concept of "Agentic Workflows" uses AI to plan and execute multi-step tasks.',
  'AI "Constitutions" (like in Claude) are sets of rules the model must follow.',
  'World Models (like Wayve) allow AI to understand the physics of the real world.',
  'Medical AI models (GMAI) in 2025 can analyze scans and patient history simultaneously.',
  'NVIDIA\'s Market Cap surpassed $3 Trillion in 2024, largely due to the AI boom.',
  'Training GPT-4 took several months and cost tens of millions of dollars.',
  'The first "Art" generated by AI was auctioned at Christie\'s for $432,500 in 2018.',
  'AI can now translate lost ancient languages by finding patterns in inscriptions.',
  'AI-powered wearable devices (like Meta Glasses) use "Multimodal" AI to see what you see.',
  'The world\'s most powerful supercomputers are now essentially massive AI clusters.',
  'AI research is moving towards "Sparse" models that don\'t activate all parts at once.',
  'Federated Learning allows AI to train on private data without it ever leaving the device.',
  'AI agents are expected to handle up to 70% of customer service inquiries by 2025.',
  'The "Wait Calculation" for AGI suggests it might arrive sooner than many expect.',
  'Deepmind\'s Gato (2022) was an early "Generalist" model that could play games and chat.',
  'OpenAI\'s CEO Sam Altman once suggested 2024 would be the "year of the agent."',
  'Every fact you just read was selected to inspire your own AI journey!',
];

export default function Lab() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const [currentFact, setCurrentFact] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      const titleTrigger = ScrollTrigger.create({
        trigger: '.lab-title',
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            '.lab-title',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }
          );
        },
        once: true,
      });
      triggersRef.current.push(titleTrigger);

      // Demos animation
      const demosTrigger = ScrollTrigger.create({
        trigger: '.demos-grid',
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            '.demo-card',
            { opacity: 0, y: 60, rotateX: 15 },
            { opacity: 1, y: 0, rotateX: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1 }
          );
        },
        once: true,
      });
      triggersRef.current.push(demosTrigger);

      // Articles animation
      const articlesTrigger = ScrollTrigger.create({
        trigger: '.articles-section',
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            '.article-card',
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out', stagger: 0.08 }
          );
        },
        once: true,
      });
      triggersRef.current.push(articlesTrigger);

      // Fun fact animation
      const factTrigger = ScrollTrigger.create({
        trigger: '.fun-fact-section',
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            '.fun-fact-box',
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
          );
        },
        once: true,
      });
      triggersRef.current.push(factTrigger);
    }, sectionRef);

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, []);

  const nextFact = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    gsap.to('.fact-text', {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        setCurrentFact((prev) => (prev + 1) % funFacts.length);
        gsap.fromTo(
          '.fact-text',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3, onComplete: () => setIsAnimating(false) }
        );
      },
    });
  };

  const activeDemoData = demos.find(d => d.id === activeDemo);
  const ActiveDemoComponent = activeDemoData?.component;

  return (
    <section
      id="lab"
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-brand-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="lab-title text-center mb-16 opacity-0">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-card border-brand-accent/30 mb-6">
            <FlaskConical className="w-5 h-5 text-brand-accent" />
            <span className="text-brand-accent text-sm font-medium">Interactive Learning</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
            The <span className="text-gradient">AI Lab</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Play, learn, and experiment with AI concepts. Real interactive demos —
            no redirects, just pure browser-based visualization.
          </p>
        </div>

        {/* Interactive Demos Grid */}
        <div className="demos-grid grid md:grid-cols-2 gap-6 mb-12">
          {demos.map((demo) => {
            const Icon = demo.icon;
            const isActive = activeDemo === demo.id;

            return (
              <div key={demo.id}>
                {/* Demo Card */}
                <div
                  className={`demo-card glass-card p-6 rounded-2xl transition-all duration-300 ${isActive
                      ? 'border-brand-accent bg-brand-accent/5'
                      : 'hover:border-brand-accent/50 hover:bg-brand-accent/5 cursor-pointer'
                    }`}
                  onClick={() => setActiveDemo(isActive ? null : demo.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${demo.color} flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-xl font-bold transition-colors ${isActive ? 'text-brand-accent' : 'text-white'}`}>
                          {demo.title}
                        </h3>
                        {isActive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDemo(null);
                            }}
                            className="p-1 rounded-full hover:bg-white/10 transition-colors"
                          >
                            <X className="w-5 h-5 text-gray-400" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed mt-2">
                        {demo.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-brand-accent text-sm">
                        <span>{isActive ? 'Click to collapse' : 'Click to try demo'}</span>
                        <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Demo */}
                {isActive && ActiveDemoComponent && (
                  <div className="mt-4 glass-card p-6 rounded-2xl border-brand-accent/30 animate-in fade-in slide-in-from-top-2 duration-300">
                    <ActiveDemoComponent />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Fun Fact Section */}
        <div className="fun-fact-section mb-16">
          <div className="fun-fact-box glass-card p-8 rounded-2xl text-center max-w-2xl mx-auto border-brand-accent/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium uppercase tracking-wider">Did You Know?</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="fact-text text-xl text-white font-medium min-h-[3rem] flex items-center justify-center">
              {funFacts[currentFact]}
            </p>
            <button
              onClick={nextFact}
              className="mt-6 px-6 py-2 rounded-full bg-brand-accent/20 text-brand-accent text-sm font-medium hover:bg-brand-accent/30 transition-colors flex items-center gap-2 mx-auto"
            >
              <Brain className="w-4 h-4" />
              <span>Next Fact</span>
            </button>
          </div>
        </div>

        {/* Articles Section */}
        <div className="articles-section">
          <div className="flex items-center justify-center gap-3 mb-8">
            <BookOpen className="w-6 h-6 text-brand-accent" />
            <h3 className="text-2xl font-display font-bold text-white">From the Blog</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="article-card glass-card p-5 rounded-xl group hover:border-brand-accent/50 hover:bg-brand-accent/5 transition-all duration-300"
              >
                <h4 className="text-sm font-medium text-white group-hover:text-brand-accent transition-colors line-clamp-2 mb-3">
                  {article.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.date}</span>
                  <div className="flex items-center gap-3">
                    <span>{article.reads} reads</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-8">
            <a
              href="https://arjun-sarkar786.medium.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-accent hover:text-white transition-colors group"
            >
              <span>View all articles on Medium</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, value: '10+', label: 'Articles Published' },
            { icon: Cpu, value: '3.3K', label: 'Medium Followers' },
            { icon: Code2, value: '50K+', label: 'Total Reads' },
            { icon: Network, value: '4', label: 'Interactive Demos' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 rounded-xl text-center hover:border-brand-accent/30 transition-colors"
              >
                <Icon className="w-6 h-6 text-brand-accent mx-auto mb-3" />
                <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
