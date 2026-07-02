import { useContext, useEffect, useState, useCallback } from 'react';
import { FaMagic, FaTimes } from 'react-icons/fa';
import apiConfig from '../utils/apiConfig';
import { shopDataContext } from '../context/ShopContext';
import { userDataContext } from '../context/UserContext';
import Card from './Card';

function PicksForYou() {
  const { userData } = useContext(userDataContext);
  const { compareList, toggleCompare } = useContext(shopDataContext);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPicks = useCallback(async () => {
    // Personalized picks require an account (wishlist/cart/view-history signals
    // live on the user). Guests simply don't see this section yet.
    if (!userData) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await apiConfig.get('/user/picks-for-you?limit=8', {
        skipGlobalErrorToast: true,
      });
      if (res.data?.success) {
        setItems(res.data.products || []);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    fetchPicks();
  }, [fetchPicks]);

  // Dismiss a single pick via its "✕" button. Optimistic — removes it from
  // the UI immediately, then tells the backend to stop recommending it.
  const handleDismiss = async (productId) => {
    setItems((prev) => prev.filter((item) => item._id !== productId));
    try {
      await apiConfig.delete(`/user/picks-for-you/${productId}`, {
        skipGlobalErrorToast: true,
      });
    } catch {
      // Non-critical — worst case it reappears next time picks refresh.
    }
  };

  // Render only if there's actually something to show.
  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-10 sm:py-14 md:py-20 px-3 sm:px-4 md:px-8 relative overflow-hidden bg-white dark:bg-[#0B0F1A]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <FaMagic className="text-white text-lg" />
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Picks For You
              </h2>
            </div>
            <p
              className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-md"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Based on what you&apos;ve viewed, saved, and loved
            </p>
          </div>
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
                  onClick={() => handleDismiss(item._id)}
                  className="absolute -top-2 -right-2 z-20 w-7 h-7 rounded-full bg-gray-900/90 dark:bg-gray-700 text-white flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors duration-200"
                  aria-label={`Remove ${item.name} from picks for you`}
                >
                  <FaTimes className="text-xs" />
                </button>
                <Card
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  image={item.image1}
                  badge="PICK"
                  badgeColor="from-purple-500 to-pink-500"
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

export default PicksForYou;
