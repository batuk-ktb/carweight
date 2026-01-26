import React, { useState } from 'react';
import { X, Truck, Box, Scale } from 'lucide-react';

interface NewTruckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TruckFormData) => void;
}

export interface TruckFormData {
  plateNumber: string;
  material: string;
  containerId1: string;
  containerId2: string;
  tareWeight: number;
}

const materials = ['Coal', 'Iron Ore', 'Copper', 'Gold Ore', 'Sand', 'Gravel', 'Limestone', 'Other'];

const NewTruckModal: React.FC<NewTruckModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<TruckFormData>({
    plateNumber: '',
    material: 'Coal',
    containerId1: '',
    containerId2: '',
    tareWeight: 15000
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      plateNumber: '',
      material: 'Coal',
      containerId1: '',
      containerId2: '',
      tareWeight: 15000
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-[#1a2332] rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-white" />
            <h2 className="text-white font-bold text-lg">New Truck Entry</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Plate Number</label>
            <input
              type="text"
              value={formData.plateNumber}
              onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
              placeholder="e.g., 1234 УБХ"
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">Material</label>
            <select
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            >
              {materials.map((mat) => (
                <option key={mat} value={mat}>{mat}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                <Box className="w-4 h-4" />
                Container 1 ID
              </label>
              <input
                type="text"
                value={formData.containerId1}
                onChange={(e) => setFormData({ ...formData, containerId1: e.target.value })}
                placeholder="e.g., 2565480"
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                <Box className="w-4 h-4" />
                Container 2 ID
              </label>
              <input
                type="text"
                value={formData.containerId2}
                onChange={(e) => setFormData({ ...formData, containerId2: e.target.value })}
                placeholder="e.g., 2565481"
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-all font-mono"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Tare Weight (kg)
            </label>
            <input
              type="number"
              value={formData.tareWeight}
              onChange={(e) => setFormData({ ...formData, tareWeight: parseInt(e.target.value) || 0 })}
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono"
              min={0}
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Start Weighing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTruckModal;
