import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, ExternalLink, ArrowRight, Cpu, Code2, Network } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

export default function Blog() {
    const sectionRef = useRef<HTMLElement>(null);
    const triggersRef = useRef<ScrollTrigger[]>([]);

    useEffect(() => {
        if (window.innerWidth < 768) return;
        const ctx = gsap.context(() => {
            // Title animation
            const titleTrigger = ScrollTrigger.create({
                trigger: '.blog-title',
                start: 'top 80%',
                onEnter: () => {
                    gsap.fromTo(
                        '.blog-title',
                        { opacity: 0, y: 50 },
                        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }
                    );
                },
                once: true,
            });
            triggersRef.current.push(titleTrigger);

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
        }, sectionRef);

        return () => {
            triggersRef.current.forEach(trigger => trigger.kill());
            triggersRef.current = [];
            ctx.revert();
        };
    }, []);

    return (
        <section
            id="blog"
            ref={sectionRef}
            className="py-24 relative overflow-hidden"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Title */}
                <h2 className="blog-title text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-20 text-center md:opacity-0">
                    From the <span className="text-gradient">Blog</span>
                </h2>

                {/* Articles Section */}
                <div className="articles-section">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {articles.map((article, index) => (
                            <a
                                key={index}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="article-card md:opacity-0 glass-card p-5 rounded-xl group hover:border-brand-accent/50 hover:bg-brand-accent/5 transition-all duration-300"
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
                        { icon: Network, value: '6', label: 'Interactive Demos' },
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
