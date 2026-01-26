import React from 'react';
import { Box } from 'lucide-react';

interface ContainerInfoProps {
  containerId: string;
  label: string;
}

const ContainerInfo: React.FC<ContainerInfoProps> = ({ containerId, label }) => {
  return (
    <div className="bg-[#1a2332] border border-gray-700 rounded px-3 py-2 flex items-center gap-2">
      <Box className="w-4 h-4 text-yellow-500" />
      <span className="text-white font-mono text-sm">{label}</span>
      <span className="text-yellow-500 font-mono font-bold">{containerId}</span>
    </div>
  );
};

export default ContainerInfo;
