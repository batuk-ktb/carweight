import React, { useEffect, useState } from 'react';

interface WeightDisplayProps {
  weight: number;
  isLive?: boolean;
}

const WeightDisplay: React.FC<WeightDisplayProps> = ({ weight, isLive = false }) => {
  const [displayWeight, setDisplayWeight] = useState(weight);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (weight !== displayWeight) {
      setIsAnimating(true);
      const diff = weight - displayWeight;
      const steps = 20;
      const stepValue = diff / steps;
      let current = displayWeight;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        current += stepValue;
        setDisplayWeight(Math.round(current));
        
        if (step >= steps) {
          clearInterval(interval);
          setDisplayWeight(weight);
          setIsAnimating(false);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [weight]);

  const formattedWeight = displayWeight.toLocaleString();

  return (
    <div className="relative">
      <div className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight transition-all duration-300 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
        <span className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
          {formattedWeight}
        </span>
        <span className="text-red-500 text-4xl md:text-5xl lg:text-6xl ml-1">KG</span>
      </div>
      {isLive && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-green-500 text-xs font-medium">LIVE</span>
        </div>
      )}
    </div>
  );
};

export default WeightDisplay;
