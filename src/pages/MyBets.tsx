import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

export function MyBets() {
  const { token, isAuthenticated } = useAuthStore();
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBets();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchBets = async () => {
    try {
      const res = await fetch('/api/bets/my-bets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setBets(data.bets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Clock size={32} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign in required</h2>
        <p className="text-gray-400">Please log in to view your bets.</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="text-blue-500" size={28} />
        <h1 className="text-3xl font-black text-white tracking-tight">My Bets</h1>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : bets.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-500 shadow-sm">
            You haven't placed any bets yet.
          </div>
        ) : (
          bets.map((bet) => (
            <div key={bet.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-800/30">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-500">ID: {bet.id.substring(0, 8)}</span>
                  <span className="text-xs text-gray-400">{new Date(bet.created_at).toLocaleString()}</span>
                </div>
                <div className={clsx(
                  "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5",
                  bet.status === 'won' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                  bet.status === 'lost' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                  "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                )}>
                  {bet.status === 'won' && <CheckCircle size={14} />}
                  {bet.status === 'lost' && <XCircle size={14} />}
                  {bet.status === 'pending' && <Clock size={14} />}
                  {bet.status.toUpperCase()}
                </div>
              </div>
              <div className="p-4 bg-gray-950 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-1">Stake</div>
                  <div className="text-lg font-bold text-white">${bet.stake.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 font-medium mb-1">Potential Win</div>
                  <div className={clsx("text-lg font-bold", bet.status === 'won' ? "text-green-500" : "text-white")}>
                    ${bet.potential_win.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
