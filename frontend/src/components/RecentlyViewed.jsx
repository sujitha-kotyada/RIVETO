import { useContext, useEffect, useState, useCallback } from 'react';
import { FaHistory, FaTrash, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import apiConfig from '../utils/apiConfig';
import { shopDataContext } from '../context/ShopContext';
import { userDataContext } from '../context/UserContext';
import {
  getGuestViewedIds,
  removeGuestViewedId,
  clearGuestViewHistory,
} from '../utils/guestViewHistory';
import Card from './Card';

function RecentlyViewed() {
  const { userData } = useContext(userDataContext);
  const { product, compareList, toggleCompare } = useContext(shopDataContext);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentlyViewed = useCallback(async () => {
    setLoading(true);
    try {
      if (userData) {
        const res = await apiConfig.get('/user/recently-viewed?limit=8', {
          skipGlobalErrorToast: true,
        });
        if (res.data?.success) {
          setItems(res.data.products || []);
        }
      } else {
        // Guests: hydrate locally-stored product ids against the already-loaded
        // product catalog so the section can render before sign-in.
        const ids = getGuestViewedIds();
        const matched = ids
          .map((id) => (product || []).find((p) => p._id === id))
          .filter(Boolean);
        setItems(matched);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [userData, product]);

  useEffect(() => {
    fetchRecentlyViewed();
  }, [fetchRecentlyViewed]);

  const handleClearHistory = async () => {
    try {
      if (userData) {
        await apiConfig.delete('/user/recently-viewed');
      } else {
        clearGuestViewHistory();
      }
      setItems([]);
      toast.info('Viewing history cleared');
    } catch {
      // Error toast is already handled by the apiConfig interceptor.
    }
  };

  // Dismiss a single card via its "✕" button. Optimistic — removes it from
  // the UI immediately, then syncs the removal in the background.
  const handleRemoveOne = async (productId) => {
    setItems((prev) => prev.filter((item) => item._id !== productId));
    try {
      if (userData) {
        await apiConfig.delete(`/user/recently-viewed/${productId}`, {
          skipGlobalErrorToast: true,
        });
      } else {
        removeGuestViewedId(productId);
      }
    } catch {
      // Non-critical — worst case it reappears next time the list refreshes.
    }
  };

  // Hide the whole section for first-time visitors with no history yet.
  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-10 sm:py-14 md:py-20 px-3 sm:px-4 md:px-8 relative overflow-hidden bg-white dark:bg-[#0B0F1A]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center shadow-lg">
                <FaHistory className="text-white text-lg" />
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Recently Viewed
              </h2>
            </div>
            <p
              className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-md"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Pick up where you left off
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="group flex items-center gap-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 font-semibold text-sm md:text-base transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <FaTrash className="text-xs group-hover:scale-110 transition-transform duration-200" />
              Clear history
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-hidden pb-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 sm:w-72 h-80 rounded-2xl bg-gray-100 dark:bg-[#121826] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item) => (
              <div
                key={item._id}
                className="relative flex-shrink-0 w-64 sm:w-72 snap-start"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveOne(item._id)}
                  className="absolute -top-2 -right-2 z-20 w-7 h-7 rounded-full bg-gray-900/90 dark:bg-gray-700 text-white flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors duration-200"
                  aria-label={`Remove ${item.name} from recently viewed`}
                >
                  <FaTimes className="text-xs" />
                </button>
                <Card
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  image={item.image1}
                  onCompare={() => toggleCompare(item)}
                  isCompared={compareList?.some((p) => p._id === item._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RecentlyViewed;
