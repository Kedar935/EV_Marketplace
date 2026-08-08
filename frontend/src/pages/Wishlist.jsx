import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import { GridSkeleton } from '../components/SkeletonLoader';

const Wishlist = () => {
  const { wishlist, loading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 flex items-center justify-center">
        <EmptyState
          icon={Heart}
          title="Sign in to view your wishlist"
          description="Save your favorite electric vehicles and access them anywhere across your devices."
          actionText="Sign In Now"
          actionLink="/login"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              My Saved Wishlist
            </h1>
            <p className="text-xs text-slate-500 mt-1">{wishlist.length} Saved Electric Vehicles</p>
          </div>
        </div>

        {loading ? (
          <GridSkeleton count={3} />
        ) : wishlist.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Explore our marketplace and click the heart icon on any vehicle card to save it for later."
            actionText="Explore EVs"
            actionLink="/vehicles"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((v) => (
              <div
                key={v._id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-slate-800">
                    <img
                      src={v.images?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleWishlist(v._id)}
                      className="absolute top-3 right-3 p-2.5 rounded-full bg-red-500 text-white shadow-lg z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xs font-semibold text-slate-400">{v.brand} • {v.year}</span>
                  <Link to={`/vehicles/${v._id}`}>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white hover:text-teal-500 transition-colors line-clamp-1 mb-2">
                      {v.title}
                    </h3>
                  </Link>

                  <div className="text-xl font-black text-teal-600 dark:text-teal-400 mb-4">
                    ₹{(v.price / 100000).toFixed(2)} Lakh
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      addToCart(v._id, 1);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                  <Link
                    to={`/vehicles/${v._id}`}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
