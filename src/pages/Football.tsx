import { Dribbble, Clock, Calendar } from 'lucide-react';
import { useMatchesStore } from '../store/matchesStore';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useBetSlipStore } from '../store/betSlipStore';

export function Football() {
  const { matches, startPolling, stopPolling } = useMatchesStore();
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');
  const { addSelection, selections } = useBetSlipStore();

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const upcomingMatches = matches.filter(m => m.status === 'upcoming');

  const filteredMatches = upcomingMatches.filter(match => {
    if (filter === 'all') return true;
    const matchDate = new Date(match.start_time);
    const today = new Date();
    const isToday = matchDate.getDate() === today.getDate() && matchDate.getMonth() === today.getMonth();
    
    if (filter === 'today') return isToday;
    if (filter === 'upcoming') return !isToday;
    return true;
  });

  const handleAddBet = (matchId: string, matchName: string, marketName: string, outcome: string, odds: number) => {
    addSelection({ id: `${matchId}_${marketName}_${outcome}`, matchId, matchName, marketName, outcome, odds });
  };

  const isSelected = (matchId: string, marketName: string, outcome: string) => {
    return selections.some(s => s.matchId === matchId && s.marketName === marketName && s.outcome === outcome);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Dribbble className="text-[#007AFF]" size={28} />
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Football</h1>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setFilter('all')}
          className={clsx("px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all border shadow-sm", filter === 'all' ? "bg-white text-[#007AFF] border-transparent" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")}
        >
          All Matches
        </button>
        <button 
          onClick={() => setFilter('today')}
          className={clsx("px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all border flex items-center gap-2 shadow-sm", filter === 'today' ? "bg-white text-[#007AFF] border-transparent" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")}
        >
          <Clock size={16} /> Today
        </button>
        <button 
          onClick={() => setFilter('upcoming')}
          className={clsx("px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all border flex items-center gap-2 shadow-sm", filter === 'upcoming' ? "bg-white text-[#007AFF] border-transparent" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")}
        >
          <Calendar size={16} /> Upcoming
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mt-6">
        {filteredMatches.length === 0 ? (
           <div className="text-gray-500 text-center py-12">
             No matches found for this filter.
           </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMatches.map((match) => (
              <div key={match.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors relative group">
                <Link to={`/match/${match.id}`} className="absolute inset-0 z-0"></Link>
                <div className="col-span-1 md:col-span-5 relative z-10 pointer-events-none">
                  <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#007AFF]"></span>
                    {new Date(match.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {match.league}
                  </div>
                  <div className="font-bold text-gray-900 text-sm">{match.home}</div>
                  <div className="font-bold text-gray-900 text-sm mt-0.5">{match.away}</div>
                </div>
                
                <div className="col-span-1 md:col-span-7 flex gap-2 md:grid md:grid-cols-3 md:gap-4 relative z-10">
                  <button 
                    onClick={() => handleAddBet(match.id, `${match.home} vs ${match.away}`, "Match Winner", "1", match.odds?.["Match Winner"]?.["1"] || 1.1)}
                    className={clsx(
                      "flex-1 md:w-full py-2.5 rounded-xl text-center font-bold text-sm transition-all border",
                      isSelected(match.id, "Match Winner", "1") ? "bg-[#007AFF] border-transparent text-white shadow-sm" : "bg-[#F0F2F5] hover:bg-gray-200 text-gray-900 border-transparent"
                    )}
                  >
                    <div className="text-[10px] text-gray-500 mb-0.5">1</div>
                    {(match.odds?.["Match Winner"]?.["1"] || 1.1).toFixed(2)}
                  </button>
                  <button 
                    onClick={() => handleAddBet(match.id, `${match.home} vs ${match.away}`, "Match Winner", "X", match.odds?.["Match Winner"]?.["X"] || 1.1)}
                    className={clsx(
                      "flex-1 md:w-full py-2.5 rounded-xl text-center font-bold text-sm transition-all border",
                      isSelected(match.id, "Match Winner", "X") ? "bg-[#007AFF] border-transparent text-white shadow-sm" : "bg-[#F0F2F5] hover:bg-gray-200 text-gray-900 border-transparent"
                    )}
                  >
                    <div className="text-[10px] text-gray-500 mb-0.5">X</div>
                    {(match.odds?.["Match Winner"]?.["X"] || 1.1).toFixed(2)}
                  </button>
                  <button 
                    onClick={() => handleAddBet(match.id, `${match.home} vs ${match.away}`, "Match Winner", "2", match.odds?.["Match Winner"]?.["2"] || 1.1)}
                    className={clsx(
                      "flex-1 md:w-full py-2.5 rounded-xl text-center font-bold text-sm transition-all border",
                      isSelected(match.id, "Match Winner", "2") ? "bg-[#007AFF] border-transparent text-white shadow-sm" : "bg-[#F0F2F5] hover:bg-gray-200 text-gray-900 border-transparent"
                    )}
                  >
                    <div className="text-[10px] text-gray-500 mb-0.5">2</div>
                    {(match.odds?.["Match Winner"]?.["2"] || 1.1).toFixed(2)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
