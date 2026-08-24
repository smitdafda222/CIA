import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [rating, setRating] = useState(4.0);
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchRestaurants = () => {
    axios.get('/api/v1/restaurants')
      .then(res => {
        setRestaurants(res.data?.data || []);
      })
      .catch(err => console.error('Failed to fetch restaurants:', err));
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAddRestaurant = (e) => {
    e.preventDefault();
    if (!name || !cuisine) {
      setMessage({ type: 'error', text: 'Name and cuisine are required.' });
      return;
    }

    axios.post('/api/v1/restaurants', {
      name,
      cuisine,
      rating: Number(rating),
      isOpen
    })
      .then(res => {
        setMessage({ type: 'success', text: `Restaurant '${name}' added successfully!` });
        setName('');
        setCuisine('');
        setRating(4.0);
        setIsOpen(true);
        fetchRestaurants();
      })
      .catch(err => {
        console.error('Failed to add restaurant:', err);
        setMessage({ type: 'error', text: 'Failed to add restaurant.' });
      });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 min-h-[85vh]">
      <h1 className="text-3xl font-extrabold text-white mb-8">
        Admin Dashboard
      </h1>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-xs font-semibold ${
          message.type === 'success' ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300' : 'bg-rose-950/80 border border-rose-700 text-rose-300'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add New Restaurant Form */}
        <div className="bg-[#1a1b21] border border-[#2b2c36] rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-5">
            Add New Restaurant
          </h2>

          <form onSubmit={handleAddRestaurant} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Restaurant Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Spice Hub"
                className="w-full bg-[#131418] border border-[#2a2b34] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Cuisine Type</label>
              <input
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g. Italian / Chinese / Punjabi"
                className="w-full bg-[#131418] border border-[#2a2b34] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Rating (0.0 to 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-[#131418] border border-[#2a2b34] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isOpenCheck"
                checked={isOpen}
                onChange={(e) => setIsOpen(e.target.checked)}
                className="rounded bg-[#131418] border-[#2a2b34] text-orange-500 focus:ring-0"
              />
              <label htmlFor="isOpenCheck" className="text-gray-300 font-semibold cursor-pointer">
                Open for Orders Now
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-lg shadow-md transition-all text-xs"
            >
              Add Restaurant
            </button>
          </form>
        </div>

        {/* Current Restaurant Statuses Table */}
        <div className="bg-[#1a1b21] border border-[#2b2c36] rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-5">
            Current Restaurant Statuses
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-400 border-b border-[#292a34]">
                <tr>
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Cuisine</th>
                  <th className="pb-3 font-semibold">Rating</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23242e] text-gray-300">
                {restaurants.map((r, i) => (
                  <tr key={r._id || i} className="hover:bg-[#1f2027]">
                    <td className="py-3 font-bold text-white capitalize">{r.name}</td>
                    <td className="py-3">{r.cuisine}</td>
                    <td className="py-3 font-semibold text-amber-400">★ {r.rating}</td>
                    <td className="py-3">
                      {r.isOpen ? (
                        <span className="bg-emerald-900/60 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                          Open
                        </span>
                      ) : (
                        <span className="bg-rose-900/60 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-500/40">
                          Closed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
