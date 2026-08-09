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
          actionText="Sign In"
          actionLink="/login"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            My Wishlist
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{wishlist.length} Saved Electric Vehicles</p>
        </div>

        {loading ? (
          <GridSkeleton count={3} />
        ) : wishlist.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No saved EVs yet"
            description="Save vehicles here to compare or purchase them later."
            actionText="Explore EVs"
            actionLink="/vehicles"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlist.map((v) => (
              <div
                key={v._id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3 bg-slate-800">
                    <img
                      src={v.images?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleWishlist(v._id)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-red-600 transition-colors z-10"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 block mb-0.5">{v.brand} · {v.year}</span>
                  <Link to={`/vehicles/${v._id}`}>
                    <h3 className="font-semibold text-base text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-1 mb-2">
                      {v.title}
                    </h3>
                  </Link>

                  <div className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    ₹{(v.price / 100000).toFixed(2)} Lakh
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      addToCart(v._id, 1);
                    }}
                    className="py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                  <Link
                    to={`/vehicles/${v._id}`}
                    className="py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
