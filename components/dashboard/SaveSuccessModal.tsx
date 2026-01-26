import React from 'react';
import { CheckCircle, X, Download, Printer } from 'lucide-react';

interface SaveSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  netWeight: number;
}

const SaveSuccessModal: React.FC<SaveSuccessModalProps> = ({
  isOpen,
  onClose,
  transactionId,
  netWeight
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const data = `Transaction ID: ${transactionId}\nNet Weight: ${netWeight.toLocaleString()} kg\nDate: ${new Date().toLocaleString()}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction_${transactionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-[#1a2332] rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <h2 className="text-white font-bold text-xl mb-2">Transaction Saved!</h2>
          <p className="text-gray-400 mb-6">Your weighing data has been recorded successfully.</p>
          
          <div className="bg-[#0d1117] rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Transaction ID</span>
              <span className="text-white font-mono">{transactionId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Net Weight</span>
              <span className="text-yellow-500 font-bold font-mono">{netWeight.toLocaleString()} kg</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveSuccessModal;
