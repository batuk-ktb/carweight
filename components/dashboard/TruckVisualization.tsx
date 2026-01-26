import React from 'react';
import { Truck, Box } from 'lucide-react';

interface TruckVisualizationProps {
  containerId1: string;
  containerId2: string;
}

const TruckVisualization: React.FC<TruckVisualizationProps> = ({
  containerId1,
  containerId2
}) => {
  return (
    <div className="relative bg-gradient-to-b from-[#1a2332] to-[#0d1117] rounded-lg p-6 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      {/* Truck illustration */}
      <div className="relative flex items-center justify-center">
        <div className="flex items-end gap-1">
          {/* Truck cab */}
          <div className="relative">
            <div className="w-20 h-16 bg-gradient-to-b from-gray-600 to-gray-700 rounded-t-lg rounded-bl-lg border-2 border-gray-500">
              <div className="absolute top-2 left-2 w-6 h-4 bg-blue-400 rounded opacity-70"></div>
              <div className="absolute bottom-0 left-2 w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="flex gap-1 mt-1">
              <div className="w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-600"></div>
              <div className="w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-600"></div>
            </div>
          </div>
          
          {/* Container 1 */}
          <div className="relative">
            <div className="w-32 h-20 bg-gradient-to-b from-gray-500 to-gray-600 rounded border-2 border-gray-400 flex items-center justify-center">
              <div className="absolute inset-1 border border-gray-400 border-dashed opacity-30"></div>
              <Box className="w-8 h-8 text-gray-300 opacity-50" />
            </div>
            <div className="flex justify-between px-2 mt-1">
              <div className="w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600"></div>
              <div className="w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600"></div>
            </div>
            {/* Container ID label */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1a2332] border border-gray-600 rounded px-2 py-1">
              <span className="text-yellow-500 font-mono text-xs whitespace-nowrap">CICU {containerId1}</span>
            </div>
          </div>
          
          {/* Container 2 */}
          <div className="relative">
            <div className="w-32 h-20 bg-gradient-to-b from-gray-500 to-gray-600 rounded border-2 border-gray-400 flex items-center justify-center">
              <div className="absolute inset-1 border border-gray-400 border-dashed opacity-30"></div>
              <Box className="w-8 h-8 text-gray-300 opacity-50" />
            </div>
            <div className="flex justify-between px-2 mt-1">
              <div className="w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600"></div>
              <div className="w-5 h-5 bg-gray-800 rounded-full border-2 border-gray-600"></div>
            </div>
            {/* Container ID label */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1a2332] border border-gray-600 rounded px-2 py-1">
              <span className="text-yellow-500 font-mono text-xs whitespace-nowrap">CICU {containerId2}</span>
            </div>
            {/* Connection line to label */}
            <div className="absolute -top-12 right-0 w-px h-4 bg-red-500"></div>
            <div className="absolute -top-12 right-0 w-16 h-px bg-red-500"></div>
          </div>
        </div>
      </div>
      
      {/* Motion indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-blue-900/50 rounded-full px-3 py-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-blue-300 text-xs">In motion vehicle</span>
      </div>
      
      {/* Weighing platform indicator */}
      <div className="mt-4 flex justify-center">
        <div className="w-80 h-2 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-full shadow-lg shadow-yellow-500/30"></div>
      </div>
      <p className="text-center text-gray-500 text-xs mt-2">WIM Sensor Platform</p>
    </div>
  );
};

export default TruckVisualization;
