import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Truck, Headphones, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-teal-950/60 text-teal-400 border border-teal-800/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-0.5">Verified Sellers & Inspection</h4>
              <p className="text-xs text-slate-400">All EV listings undergo multi-point battery & chassis inspection.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-teal-950/60 text-teal-400 border border-teal-800/40 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-0.5">Flatbed Transport</h4>
              <p className="text-xs text-slate-400">Direct zero-emission flatbed transport to your home or office.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-teal-950/60 text-teal-400 border border-teal-800/40 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-0.5">EV Support & Warranty</h4>
              <p className="text-xs text-slate-400">Dedicated EV specialist support and home charger guidance.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-teal-600 text-white flex items-center justify-center font-bold">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="text-lg font-bold text-white">
                EV<span className="text-teal-400">Market</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Explore</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/vehicles" className="hover:text-teal-400 transition-colors">Explore All EVs</Link></li>
              <li><Link to="/compare" className="hover:text-teal-400 transition-colors">Compare EVs</Link></li>
              <li><Link to="/tools" className="hover:text-teal-400 transition-colors">EV Calculators</Link></li>
              <li><Link to="/recommendations" className="hover:text-teal-400 transition-colors">AI Finder</Link></li>
            </ul>
          </div>

          {/* Vendor & Admin */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Sell & Portal</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/register?role=VENDOR" className="hover:text-teal-400 transition-colors">Become a Vendor</Link></li>
              <li><Link to="/vendor/dashboard" className="hover:text-teal-400 transition-colors">Vendor Dashboard</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-teal-400 transition-colors">Admin Portal</Link></li>
              <li><Link to="/login" className="hover:text-teal-400 transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Assistance */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Support</h5>
            <p className="text-xs text-slate-400 mb-1">Toll Free: 1800-419-3838</p>
            <p className="text-xs text-slate-400 mb-3">Email: support@evmarketplace.demo</p>
            <span className="inline-block px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-teal-400 text-[11px] font-medium">
              Stripe Verified Platform
            </span>
          </div>
        </div>

        {/* Developer Credit Line */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            © {SITE_CONFIG.year} {SITE_CONFIG.name} · Built & Developed by{' '}
            <a
              href={SITE_CONFIG.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 font-medium hover:underline hover:text-teal-300 transition-colors"
            >
              {SITE_CONFIG.developer}
            </a>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <span>Electric Vehicle Marketplace Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
