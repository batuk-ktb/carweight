import React from 'react';

interface SystemDiagramProps {
  imageUrl: string;
}

const SystemDiagram: React.FC<SystemDiagramProps> = ({ imageUrl }) => {
  return (
    <div className="relative">
      {/* JRP Logo */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-blue-400">JRP</span>
          <svg className="w-6 h-6 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <span className="text-xs text-gray-400">JRP-WIM Scale</span>
      </div>
      
      {/* Main diagram image */}
      <img 
        src={imageUrl} 
        alt="WIM Scale System Diagram" 
        className="w-full h-auto rounded-lg"
      />
    </div>
  );
};

export default SystemDiagram;
