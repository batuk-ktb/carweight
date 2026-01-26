import React from 'react';
import { TrendingUp, Package, Scale, BarChart3 } from 'lucide-react';

interface StatsPanelProps {
  totalTransactions: number;
  totalNetWeight: number;
  averageLoad: number;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  totalTransactions,
  totalNetWeight,
  averageLoad
}) => {
  return (
    <div className="bg-[#1a2332] rounded-lg p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-green-500" />
        <span className="text-white font-semibold">Today's Stats</span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Total Transactions</span>
          </div>
          <span className="text-white font-bold text-lg">{totalTransactions}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Total Net Weight</span>
          </div>
          <span className="text-yellow-500 font-bold text-lg">{totalNetWeight.toFixed(1)} t</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Average Load</span>
          </div>
          <span className="text-yellow-500 font-bold text-lg">{averageLoad.toFixed(1)} t</span>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
