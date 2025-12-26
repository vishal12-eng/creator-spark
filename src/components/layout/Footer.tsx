import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Youtube, Instagram, Github } from 'lucide-react';
import creatorAiLogo from '@/assets/creator-ai-logo.png';

const footerLinks = {
  product: [
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'How It Works', href: '/#how-it-works' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Tutorials', href: '/tutorials' },
    { name: 'Documentation', href: '/docs' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'YouTube', href: 'https://youtube.com', icon: Youtube },
  { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { name: 'GitHub', href: 'https://github.com', icon: Github },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-ice-blue/10 bg-deep-navy-900/80 backdrop-blur-xl">
      {/* Subtle top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ice-blue/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <img 
                src={creatorAiLogo} 
                alt="Creator AI" 
                className="h-8 w-auto transition-all duration-300 group-hover:opacity-80"
              />
            </Link>
            <p className="text-sm text-ice-blue/60 mb-6 max-w-xs leading-relaxed">
              The AI-powered platform that helps content creators grow faster with high-CTR thumbnails, viral ideas, and data-driven insights.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-ice-blue/5 border border-ice-blue/10 hover:bg-ice-blue/10 hover:border-ice-blue/20 transition-all duration-300 text-ice-blue/50 hover:text-ice-blue"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm text-ice-blue/90 mb-5 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-ice-blue/50 hover:text-ice-blue transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-ice-blue/90 mb-5 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-ice-blue/50 hover:text-ice-blue transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-ice-blue/90 mb-5 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-ice-blue/50 hover:text-ice-blue transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-ice-blue/90 mb-5 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-ice-blue/50 hover:text-ice-blue transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-ice-blue/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ice-blue/40">
            © {new Date().getFullYear()} Creator AI. All rights reserved.
          </p>
          <p className="text-sm text-ice-blue/40">
            Made with passion for content creators worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};
