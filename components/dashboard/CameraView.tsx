import React from 'react';
import { Camera, Image } from 'lucide-react';

interface CameraViewProps {
  title: string;
  cameraId: string;   // cam1, cam2 гэх мэт (MediaMTX path)
  isCapturing?: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  title, 
  cameraId,
  isCapturing = false 
}) => {

  const streamUrl = `http://127.0.0.1:8888/${cameraId}/`;
  // ↑ 192.168.1.10 = MediaMTX ажиллаж байгаа PC

  return (
    <div className="bg-[#1a2332] rounded-lg overflow-hidden shadow-xl">
      <div className="bg-[#252f3f] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium">{title}</span>
        </div>
        <span className="text-gray-400 text-sm font-mono">{cameraId}</span>
      </div>
      
      <div className="aspect-video bg-[#0d1117] flex items-center justify-center relative">
        {isCapturing ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400 text-sm">Connecting...</span>
          </div>
        ) : (
          <iframe
            src={streamUrl}
            className="w-full h-full"
            allow="autoplay"
            style={{ border: 'none' }}
          />
        )}

        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border border-gray-800 opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default CameraView;