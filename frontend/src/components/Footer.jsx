import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Truck, Headphones, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-900">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">Verified Sellers & Warranty</h4>
              <p className="text-xs text-slate-400">All EV listings undergo multi-point battery & chassis inspection.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">Doorstep Flatbed Delivery</h4>
              <p className="text-xs text-slate-400">Direct zero-emission flatbed transport to your home or office.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">Charging & Range Support</h4>
              <p className="text-xs text-slate-400">24/7 dedicated EV specialist support and home charger installation.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-extrabold text-white">
                EV<span className="text-teal-400">Market</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Marketplace</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/vehicles" className="hover:text-teal-400 transition-colors">Explore All EVs</Link></li>
              <li><Link to="/compare" className="hover:text-teal-400 transition-colors">Vehicle Comparison</Link></li>
              <li><Link to="/tools" className="hover:text-teal-400 transition-colors">Range & Charging Calculators</Link></li>
              <li><Link to="/recommendations" className="hover:text-teal-400 transition-colors">AI Vehicle Recommendation</Link></li>
            </ul>
          </div>

          {/* Vendor & Admin */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">For Sellers</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/register?role=VENDOR" className="hover:text-teal-400 transition-colors">Become a Vendor</Link></li>
              <li><Link to="/vendor/dashboard" className="hover:text-teal-400 transition-colors">Vendor Dashboard</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-teal-400 transition-colors">Admin Portal</Link></li>
              <li><Link to="/login" className="hover:text-teal-400 transition-colors">Account Sign In</Link></li>
            </ul>
          </div>

          {/* Assistance */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Support & Trust</h5>
            <p className="text-xs text-slate-400 mb-2">Toll Free: 1800-419-3838</p>
            <p className="text-xs text-slate-400 mb-4">Email: support@evmarketplace.demo</p>
            <div className="inline-block px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium">
              Stripe Secured & Verified
            </div>
          </div>
        </div>

        {/* Professional Developer Credit Line */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {SITE_CONFIG.year} {SITE_CONFIG.name} · Built & Developed by{' '}
            <a
              href={SITE_CONFIG.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 font-semibold hover:underline hover:text-teal-300 transition-colors"
            >
              {SITE_CONFIG.developer}
            </a>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <span>Powering sustainable zero-emission electric mobility</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
