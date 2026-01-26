import React from 'react';
import { RefreshCw, Camera, Save } from 'lucide-react';

interface ControlPanelProps {
  onNewTruck: () => void;
  onCaptureCamera: () => void;
  onSaveTransaction: () => void;
  isCapturing: boolean;
  isSaving: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onNewTruck,
  onCaptureCamera,
  onSaveTransaction,
  isCapturing,
  isSaving
}) => {
  return (
    <div className="bg-[#1a2332] rounded-lg p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        <span className="text-white font-semibold">Control Panel</span>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={onNewTruck}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-200 font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          New Truck
        </button>
        
        <button
          onClick={onCaptureCamera}
          disabled={isCapturing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-200 font-medium"
        >
          <Camera className="w-4 h-4" />
          {isCapturing ? 'Capturing...' : 'Capture Cameras'}
        </button>
        
        <button
          onClick={onSaveTransaction}
          disabled={isSaving}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-200 font-medium"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Transaction'}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
