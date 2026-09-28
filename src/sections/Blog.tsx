import { ArrowUpRight } from 'lucide-react';

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
  return (
    <section id="blog"><div className="section-shell">
      <div className="section-heading"><div><p className="eyebrow">05 / WRITING</p><h2>Making complex ideas clearer.</h2></div><p>Practical notes on neural networks, the mathematics behind them, and building from scratch.</p></div>
      <div className="research-list">{articles.map((article, index) => <a className="research-row" key={article.url} href={article.url} target="_blank" rel="noopener noreferrer"><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{article.title}</h3><p>{article.date} · Medium</p></div><ArrowUpRight aria-label="Read article" /></a>)}</div>
      <a className="section-link" href="https://arjun-sarkar786.medium.com/" target="_blank" rel="noopener noreferrer">All writing on Medium <ArrowUpRight size={16} /></a>
    </div></section>
  );
}
