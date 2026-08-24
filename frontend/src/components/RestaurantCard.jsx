import React from 'react';

const RestaurantCard = ({ name, cuisine, rating, isOpen }) => {
  return (
    <div className="bg-[#1b1c22] border border-[#2a2b34] rounded-xl p-5 shadow-lg hover:border-orange-500/40 transition-all">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-white tracking-wide capitalize">{name}</h3>
      </div>
      
      <div className="space-y-1.5 text-xs text-gray-300">
        <p className="flex items-center gap-1.5">
          <span className="font-semibold text-gray-400">Cuisine:</span> 
          <span>{cuisine}</span>
        </p>
        
        <p className="flex items-center gap-1.5">
          <span className="font-semibold text-gray-400">Rating:</span> 
          <span className="inline-flex items-center text-amber-400 font-bold gap-1">
            ★ {rating}
          </span>
        </p>
        
        <p className="flex items-center gap-1.5 pt-2">
          <span className="font-semibold text-gray-400">Status:</span> 
          {isOpen ? (
            <span className="bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
              Open Now
            </span>
          ) : (
            <span className="bg-rose-900/60 border border-rose-500/40 text-rose-400 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
              Closed
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;
