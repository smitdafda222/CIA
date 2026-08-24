import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios.get('/api/v1/restaurants')
      .then(response => {
        if (response.data && response.data.data) {
          setRestaurants(response.data.data);
        } else {
          setRestaurants(response.data || []);
        }
      })
      .catch(err => {
        console.error('Failed to fetch restaurants:', err);
        setError('Failed to load restaurant data from server.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Client-side search filter (filters name or cuisine without new API request)
  const filteredRestaurants = restaurants.filter(r => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (r.name && r.name.toLowerCase().includes(query)) ||
      (r.cuisine && r.cuisine.toLowerCase().includes(query))
    );
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 min-h-[85vh]">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-white mb-6">
        Featured Restaurants
      </h1>

      {/* Client-side Search Input (Task 4 requirement) */}
      <div className="mb-8 max-w-xl">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by restaurant name or cuisine..."
          className="w-full bg-[#1b1c22] border border-[#2d2e38] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors shadow-inner"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xs font-semibold">Loading restaurants from server...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-rose-950/60 border border-rose-800 text-rose-300 text-xs p-4 rounded-xl mb-6">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Data Rendered via RestaurantCard */}
      {!loading && !error && (
        <>
          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-16 bg-[#1b1c22] rounded-2xl border border-[#2b2c36]">
              <p className="text-sm font-medium text-gray-400">No restaurants match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant._id || restaurant.id || restaurant.name}
                  name={restaurant.name}
                  cuisine={restaurant.cuisine}
                  rating={restaurant.rating}
                  isOpen={restaurant.isOpen}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantsPage;
