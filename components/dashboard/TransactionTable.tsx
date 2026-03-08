import React from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Transaction {
  id: number;
  puuName: string;
  puuId: number;
  Weight: number;
  tag_id: string | null;
  tag_date: string | null;      // "YYYY-MM-DD HH:MM:SS" формат
  created_at: string;           // "YYYY-MM-DD HH:MM:SS"
  containers: Containers;
}

interface Containers {
  conR1: Container | null;
  conL1: Container | null;
  conR2: Container | null;
  conL2: Container | null;
  conR3: Container | null;
  conL3: Container | null;
  conR4: Container | null;
  conL4: Container | null;
}

interface Container {
  id: number;
  container_id: string | null;
  date: string | null;           // "YYYY-MM-DD HH:MM:SS"
  control_digit: string | null;
  readconfidence: number | null;
  plateImage: string | null;
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
      
      <div className='w-full overflow-x-auto'>
        <table className="w-full min-w-[900px] table-auto">
          <thead>
            <tr className="bg-[#252f3f] ">
              <th className="px-4 py-3 text-center text-gray-400 ">Weight (kg)</th>
              <th className="px-4 py-3 text-center text-gray-400 ">RFID</th>
              <th className="px-4 py-3 text-center text-gray-400 ">RFID date</th>
              <th className="px-2 py-1 text-center text-gray-400 ">C1</th>
              <th className="px-2 py-1 text-center text-gray-400 ">C2</th>
              <th className="px-2 py-1 text-center text-gray-400 ">C3</th>
              <th className="px-2 py-1 text-center text-gray-400 ">C4</th>
              <th className="px-4 py-3 text-center text-gray-400 ">Timestamp</th>
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
                <td className="px-4 py-3 text-right text-gray-300">{tx.Weight}</td>
                <td className="px-4 py-3 text-right text-gray-300">{tx.tag_id}</td>
                <td className="px-4 py-3 text-right text-gray-300">{tx.tag_date}</td>
                <td className="px-4 py-3 text-right text-gray-300">
                  <p>
                    {(tx?.containers?.conR1?.container_id || '').toLocaleString()}
                  </p>
                  <p>
                    {(tx?.containers?.conL1?.container_id || '').toLocaleString()}
                  </p>
                </td>
                <td className="px-4 py-3 text-right text-gray-300">
                  <p>
                    {(tx?.containers?.conR2?.container_id || '').toLocaleString()}
                  </p>
                  <p>
                    {(tx?.containers?.conL2?.container_id || '').toLocaleString()}
                  </p>
                </td>
                <td className="px-4 py-3 text-right text-gray-300">
                  <p>
                    {(tx?.containers?.conR3?.container_id || '').toLocaleString()}
                  </p>
                  <p>
                    {(tx?.containers?.conL3?.container_id || '').toLocaleString()}
                  </p>
                </td>
                <td className="px-2 py-3 text-right text-gray-300">
                  <p>
                    {(tx?.containers?.conR4?.container_id || '').toLocaleString()}
                  </p>
                  <p>
                    {(tx?.containers?.conL4?.container_id || '').toLocaleString()}
                  </p>
                </td>
                <td className="px-4 py-3 text-right  text-gray-300">
                  {tx.created_at}
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
