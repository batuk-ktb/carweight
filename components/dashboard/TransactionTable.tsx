import React from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Transaction {
  id: string;
  plateNumber: string;
  material: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  containerWeights: {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
  };
  timestamp: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="bg-[#1a2332] rounded-lg shadow-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-400" />
        <span className="text-white font-semibold">Recent Transactions</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-[#252f3f]">
              <th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">ID</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">Plate Number</th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">Material</th>
              <th className="px-4 py-3 text-right text-gray-400 font-medium text-sm">Gross (kg)</th>
              <th className="px-4 py-3 text-right text-gray-400 font-medium text-sm">Tare (kg)</th>
              <th className="px-4 py-3 text-right text-gray-400 font-medium text-sm">Net (kg)</th>
              <th className="px-4 py-3 text-center text-gray-400 font-medium text-sm" colSpan={4}>
                Container Weights (kg)
              </th>
              <th className="px-4 py-3 text-left text-gray-400 font-medium text-sm">Timestamp</th>
            </tr>
            <tr className="bg-[#1e2836]">
              <th colSpan={6}></th>
              <th className="px-2 py-1 text-center text-gray-500 font-normal text-xs">C1</th>
              <th className="px-2 py-1 text-center text-gray-500 font-normal text-xs">C2</th>
              <th className="px-2 py-1 text-center text-gray-500 font-normal text-xs">C3</th>
              <th className="px-2 py-1 text-center text-gray-500 font-normal text-xs">C4</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr 
                key={tx.id}
                className={`border-b border-gray-800 hover:bg-[#252f3f] transition-colors ${
                  index % 2 === 0 ? 'bg-[#1a2332]' : 'bg-[#1e2836]'
                }`}
              >
                <td className="px-4 py-3 text-white font-mono text-sm">{tx.id}</td>
                <td className="px-4 py-3 text-white font-bold">{tx.plateNumber}</td>
                <td className="px-4 py-3 text-gray-300">{tx.material}</td>
                <td className="px-4 py-3 text-right text-gray-300 font-mono">
                  {tx.grossWeight.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-gray-300 font-mono">
                  {tx.tareWeight.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-yellow-500 font-mono font-bold">
                  {tx.netWeight.toLocaleString()}
                </td>
                <td className="px-2 py-3 text-center text-gray-300 font-mono text-sm">
                  {tx.containerWeights.c1.toLocaleString()}
                </td>
                <td className="px-2 py-3 text-center text-gray-300 font-mono text-sm">
                  {tx.containerWeights.c2.toLocaleString()}
                </td>
                <td className="px-2 py-3 text-center text-gray-300 font-mono text-sm">
                  {tx.containerWeights.c3.toLocaleString()}
                </td>
                <td className="px-2 py-3 text-center text-gray-300 font-mono text-sm">
                  {tx.containerWeights.c4.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-400 text-sm whitespace-nowrap">
                  {tx.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
        <span className="text-gray-400 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded bg-[#252f3f] text-gray-400 hover:text-white hover:bg-[#2d3a4f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded bg-[#252f3f] text-gray-400 hover:text-white hover:bg-[#2d3a4f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Scrollbar indicator */}
      <div className="px-4 pb-3">
        <div className="h-2 bg-[#252f3f] rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
