import { useState, useEffect } from 'react';
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpToLine, History, Activity } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Wallet() {
  const { user, token, isAuthenticated } = useAuthStore();
  const [amount, setAmount] = useState<string>('50');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(user?.balance || 0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance();
    }
  }, [isAuthenticated]);

  const fetchBalance = async () => {
    try {
      const res = await fetch('/api/wallet', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
        useAuthStore.setState(state => ({
          user: state.user ? { ...state.user, balance: data.balance } : null
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Invalid amount");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(amount) })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert("Deposit successful!");
        setAmount('50');
        fetchBalance();
      } else {
        alert(data.error || "Deposit failed");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <WalletIcon size={32} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in required</h2>
        <p className="text-gray-400">Please log in to manage your wallet.</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <WalletIcon className="text-blue-500" size={28} />
        <h1 className="text-3xl font-black text-white tracking-tight">Wallet</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <h2 className="text-gray-400 font-medium mb-2 uppercase text-xs tracking-wider">Total Balance</h2>
          <div className="text-4xl font-black text-white mb-6">
            ${balance.toFixed(2)}
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg border border-gray-700 flex items-center justify-center gap-2 transition-colors">
              <ArrowUpToLine size={18} /> Withdraw
            </button>
          </div>
        </div>

        {/* Deposit Area */}
        <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ArrowDownToLine size={20} className="text-green-500" />
            Quick Deposit
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-4 pl-8 pr-4 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  min="10"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {['20', '50', '100', '500'].map(val => (
                <button 
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`py-2 rounded-lg font-bold text-sm transition-all border ${amount === val ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700'}`}
                >
                  ${val}
                </button>
              ))}
            </div>

            <button 
              onClick={handleDeposit}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-800 disabled:text-gray-500 text-gray-900 font-black py-4 rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-95 text-lg mt-4"
            >
              {loading ? 'Processing...' : `Deposit $${amount || '0'}`}
            </button>
          </div>
        </div>
      </div>
      
      {/* Transaction History (Mock for now) */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mt-8">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-bold text-white flex items-center gap-2">
            <History size={18} /> Recent Transactions
          </h2>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Activity size={32} className="mx-auto mb-3 opacity-20" />
          <p>Full transaction history will appear here.</p>
        </div>
      </div>
    </div>
  );
}
