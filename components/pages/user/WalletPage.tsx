
import React, { useState, useEffect } from 'react';
import { Transaction } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { getTransactions } from '../../../services/mockApi';

const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user) {
        const data = await getTransactions(user.id);
        setTransactions(data);
      }
    };
    fetchTransactions();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Wallet</h2>
      
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary-variant p-6 rounded-lg shadow-lg mb-6 text-center">
        <p className="text-sm text-gray-300">Current Balance</p>
        <p className="text-4xl font-bold mt-2">₹{user?.walletBalance.toFixed(2)}</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button className="flex-1 bg-brand-success text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors">
          <i className="fa-solid fa-plus mr-2"></i>Add Money
        </button>
        <button className="flex-1 bg-brand-danger text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">
          <i className="fa-solid fa-arrow-down mr-2"></i>Withdraw
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-3">Transaction History</h3>
      <div className="space-y-3">
        {transactions.length > 0 ? (
            transactions.map(tx => (
                <div key={tx.id} className="bg-brand-surface p-3 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-semibold">{tx.description}</p>
                        <p className="text-xs text-brand-text-secondary">{new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                    <p className={`font-bold text-lg ${tx.type === 'credit' ? 'text-brand-success' : 'text-brand-danger'}`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                    </p>
                </div>
            ))
        ) : (
            <p className="text-center text-brand-text-secondary mt-8">No transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
