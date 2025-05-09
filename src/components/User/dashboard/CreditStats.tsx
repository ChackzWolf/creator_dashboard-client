import React from 'react';
import { CreditStats as CreditStatsType } from '../../types/credits';

interface CreditStatsProps {
  stats: CreditStatsType;
  isLoading: boolean;
}

const CreditStats: React.FC<CreditStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex flex-wrap">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full md:w-1/3 px-2 mb-4">
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Credit Statistics</h3>
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/3 px-2 mb-4">
          <div className="bg-indigo-50 p-4 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Total Credits</p>
            <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
          </div>
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-gray-500 text-sm">This Week</p>
            <p className="text-3xl font-bold text-green-600">+{stats.thisWeek}</p>
          </div>
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-gray-500 text-sm">This Month</p>
            <p className="text-3xl font-bold text-blue-600">+{stats.thisMonth}</p>
          </div>
        </div>
      </div>
      
      <h4 className="text-md font-semibold mt-6 mb-3">Recent Transactions</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stats.transactions.slice(0, 5).map((transaction) => (
              <tr key={transaction.id}>
                <td className="py-2 px-4 whitespace-nowrap text-sm">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </td>
                <td className={`py-2 px-4 whitespace-nowrap text-sm font-medium ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-sm">{transaction.description}</td>
              </tr>
            ))}
            {stats.transactions.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  No recent transactions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreditStats;