
import React from 'react';

interface CakeProps {
  isCut: boolean;
}

const Cake: React.FC<CakeProps> = ({ isCut }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center transition-all duration-1000 ${isCut ? 'scale-110' : ''}`}>
      {/* Candles */}
      <div className="flex gap-4 mb-[-10px] z-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative flex flex-col items-center">
            {!isCut && (
              <div className="w-3 h-5 bg-orange-400 rounded-full animate-pulse blur-[1px] mb-1">
                <div className="w-2 h-3 bg-yellow-200 rounded-full mx-auto mt-1"></div>
              </div>
            )}
            <div className="w-2 h-8 bg-pink-500 rounded-sm border-b-2 border-pink-700 shadow-md"></div>
          </div>
        ))}
      </div>

      {/* Cake Top Layer */}
      <div className={`w-48 h-16 bg-pink-400 rounded-t-xl border-b-4 border-pink-600 shadow-lg relative overflow-hidden ${isCut ? 'opacity-90 blur-[0.5px]' : ''}`}>
         <div className="absolute top-0 w-full flex justify-around opacity-40">
            <div className="w-8 h-8 bg-white rounded-full mt-[-4px]"></div>
            <div className="w-8 h-8 bg-white rounded-full mt-[-4px]"></div>
            <div className="w-8 h-8 bg-white rounded-full mt-[-4px]"></div>
         </div>
      </div>

      {/* Cake Bottom Layer */}
      <div className={`w-56 h-20 bg-pink-300 rounded-t-lg shadow-xl border-b-8 border-pink-500 relative ${isCut ? 'opacity-90' : ''}`}>
        <div className="flex justify-between px-4 mt-2">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="w-4 h-4 bg-white rounded-full opacity-30"></div>
           ))}
        </div>
      </div>

      {/* Plate */}
      <div className="w-64 h-4 bg-slate-200 rounded-full shadow-2xl mt-[-2px]"></div>
      
      {isCut && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <span className="text-6xl animate-ping opacity-50">🎂</span>
        </div>
      )}
    </div>
  );
};

export default Cake;
