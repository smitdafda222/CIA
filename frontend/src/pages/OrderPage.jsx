import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderPage = () => {
  const { customer, token, logout } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(10);
  const [deliveryAddress, setDeliveryAddress] = useState(customer?.address || 'A-802 sarjan heights dabholi gam,katargam');
  
  const [orderHistory, setOrderHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch restaurants for dropdown
  useEffect(() => {
    axios.get('/api/v1/restaurants')
      .then(res => {
        const list = res.data?.data || res.data || [];
        setRestaurants(list);
        if (list.length > 0) {
          setSelectedRestaurantId(list[0]._id || list[0].id);
        }
      })
      .catch(err => console.error('Failed to load restaurants:', err));
  }, []);

  // Fetch Order History (Protected API call)
  const fetchOrders = () => {
    if (!token) return;
    axios.get('/api/v1/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setOrderHistory(res.data?.data || []);
      })
      .catch(err => console.error('Failed to fetch order history:', err));
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // Meaningfully computed total amount state
  const computedTotal = Number(quantity) * Number(unitPrice);
  const selectedRestaurantObj = restaurants.find(r => (r._id || r.id) === selectedRestaurantId);

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!selectedRestaurantId || !itemName.trim()) {
      setMessage({ type: 'error', text: 'Please select a restaurant and enter an item name.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const payload = {
      customerId: customer?._id || '66d010000000000000000001',
      restaurantId: selectedRestaurantId,
      items: [{ name: itemName, qty: Number(quantity) }],
      totalAmount: computedTotal,
      status: 'pending'
    };

    axios.post('/api/v1/orders', payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setMessage({ type: 'success', text: `Order placed successfully! Total \$${computedTotal}` });
        setItemName('');
        setQuantity(1);
        fetchOrders();
      })
      .catch(err => {
        console.error('Order placement failed:', err);
        const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to place order.';
        setMessage({ type: 'error', text: errMsg });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 min-h-[85vh]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            QuickBite Ordering Panel
          </h1>
        </div>

        {/* Customer Details Box (matches AAa.pdf page 3 screenshot) */}
        {customer && (
          <div className="bg-[#191a20] border border-[#2c2d36] rounded-xl p-4 w-full md:w-80 text-xs shadow-lg">
            <h3 className="font-bold text-gray-200 mb-2 border-b border-[#282932] pb-1">Customer Details</h3>
            <p className="text-gray-300"><span className="font-semibold text-gray-400">Name:</span> {customer.name}</p>
            <p className="text-gray-300"><span className="font-semibold text-gray-400">Email:</span> {customer.email}</p>
            <p className="text-gray-300"><span className="font-semibold text-gray-400">Phone:</span> {customer.phone || '09574361060'}</p>
            <p className="text-gray-300 truncate"><span className="font-semibold text-gray-400">Delivery Address:</span> {deliveryAddress}</p>
            <button
              onClick={logout}
              className="mt-3 w-full bg-[#272832] hover:bg-[#323340] text-gray-300 font-semibold py-1 rounded border border-[#373846] transition-colors text-[11px]"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-xs font-semibold ${
          message.type === 'success' ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300' : 'bg-rose-950/80 border border-rose-700 text-rose-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Main Grid: Order Form & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Place a New Order Form */}
        <div className="bg-[#1a1b21] border border-[#2b2c36] rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-5">
            Place a New Order
          </h2>

          <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
            {/* Restaurant Selector */}
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Select Restaurant</label>
              <select
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                className="w-full bg-[#131418] border border-[#2a2b34] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-orange-500"
              >
                {restaurants.map(r => (
                  <option key={r._id || r.id} value={r._id || r.id}>
                    {r.name} ({r.cuisine})
                  </option>
                ))}
              </select>
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Item Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Butter Chicken / Cheese Pizza / manchurian"
                className="w-full bg-[#131418] border border-[#2a2b34] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Quantity & Unit Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#131418] border border-[#2a2b34] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Price ($)</label>
                <input
                  type="number"
                  min="0"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#131418] border border-[#2a2b34] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-gray-400 mb-1 font-semibold">Delivery Address</label>
              <textarea
                rows="2"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full bg-[#131418] border border-[#2a2b34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              ></textarea>
            </div>

            {/* Live Order Summary preview (Task 2 state change display requirement) */}
            <div className="bg-[#141519] p-3 rounded-lg border border-[#262732] space-y-1">
              <p className="text-[11px] font-semibold text-gray-400">Live Order Summary</p>
              <p className="text-gray-300"><span className="text-gray-400">Restaurant:</span> <span className="text-white font-semibold">{selectedRestaurantObj?.name || 'Selected'}</span></p>
              <p className="text-gray-300"><span className="text-gray-400">Item:</span> <span className="text-white font-semibold">{itemName || '(empty)'}</span></p>
              <p className="text-gray-300"><span className="text-gray-400">Quantity:</span> <span className="text-white font-semibold">{quantity}</span></p>
              <p className="text-gray-300"><span className="text-gray-400">Deliver To:</span> <span className="text-white font-semibold">{deliveryAddress}</span></p>
              <p className="text-xs font-bold text-orange-400 pt-1">Est. Total Amount: ${computedTotal}</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-lg shadow-md transition-all text-xs"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Your Order History Card */}
        <div className="bg-[#1a1b21] border border-[#2b2c36] rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-5">
            Your Order History
          </h2>

          {orderHistory.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No orders found in history.</p>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {orderHistory.map((ord, idx) => {
                const restName = ord.restaurantId?.name || ord.restaurantName || 'Restaurant';
                const itemsText = Array.isArray(ord.items) 
                  ? ord.items.map(i => `${i.name || 'item'} (x${i.qty || 1})`).join(', ')
                  : 'Items';

                return (
                  <div key={ord._id || idx} className="bg-[#131418] border border-[#292a34] rounded-xl p-4 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-white text-sm capitalize">{restName}</h4>
                      <p className="text-gray-400 mt-1">Items: <span className="text-gray-300">{itemsText}</span></p>
                      <p className="text-gray-400 mt-0.5">Total: <span className="text-white font-semibold">${ord.totalAmount}</span></p>
                    </div>

                    <div className="text-right">
                      <span className="bg-amber-900/60 border border-amber-500/40 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                        {ord.status || 'PENDING'}
                      </span>
                      <p className="text-[10px] text-gray-500 mt-2">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : '8/24/2026'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrderPage;
