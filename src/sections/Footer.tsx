import { ArrowUpRight, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell">
        <p className="eyebrow">LET’S CONNECT</p>
        <div className="footer-invitation"><h2>Good work starts<br />with a conversation.</h2><a href="mailto:arjun.sarkar786@gmail.com" className="primary-action">Get in touch <ArrowUpRight size={19} /></a></div>
        <div className="footer-bottom"><a href="#about" className="nav-wordmark" aria-label="Back to top">as<span>.</span></a><span>© {new Date().getFullYear()} Arjun Sarkar · Germany</span><div><a href="https://www.linkedin.com/in/arjun-sarkar-9a051777/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a><a href="https://github.com/as4401s" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18} /></a><a href="https://arjun-sarkar786.medium.com/" target="_blank" rel="noopener noreferrer">Medium <ArrowUpRight size={14} /></a></div></div>
      </div>
    </footer>
  );
}
