import { Activity, BarChart2 } from 'lucide-react';
import { useMatchesStore } from '../store/matchesStore';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useBetSlipStore } from '../store/betSlipStore';

export function Live() {
  const { matches, startPolling, stopPolling, loading } = useMatchesStore();
  const { addSelection, selections } = useBetSlipStore();

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const liveMatches = matches.filter(m => m.status === 'live' || m.status === 'half-time');

  const handleAddBet = (matchId: string, matchName: string, marketName: string, outcome: string, odds: number) => {
    addSelection({ id: `${matchId}_${marketName}_${outcome}`, matchId, matchName, marketName, outcome, odds });
  };

  const isSelected = (matchId: string, marketName: string, outcome: string) => {
    return selections.some(s => s.matchId === matchId && s.marketName === marketName && s.outcome === outcome);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex items-center justify-center">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full relative"></div>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Live Matches</h1>
        <span className="bg-gray-800 text-gray-400 font-bold px-3 py-1 rounded-lg ml-2">{liveMatches.length}</span>
      </div>

      {liveMatches.length === 0 && !loading ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-600">
            <Activity size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Live Matches</h2>
          <p className="text-gray-400 max-w-sm">
            There are currently no live football matches. Check the upcoming matches section to see what's starting soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {liveMatches.map((match) => (
            <div key={match.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors group shadow-sm">
              <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <span className="text-red-500 font-bold">{match.current_minute}'</span>
                  <span>{match.league}</span>
                </div>
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer z-10 relative">
                  <BarChart2 size={14} /> Stats
                </button>
              </div>
              <div className="p-4 relative">
                <Link to={`/match/${match.id}`} className="absolute inset-0 z-0"></Link>
                <div className="space-y-3 relative z-10 pointer-events-none">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">{match.home_short?.[0]}</div>
                      <span className="font-bold text-gray-100">{match.home}</span>
                    </div>
                    <span className="font-bold text-lg text-white">{match.home_score}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">{match.away_short?.[0]}</div>
                      <span className="font-bold text-gray-100">{match.away}</span>
                    </div>
                    <span className="font-bold text-lg text-white">{match.away_score}</span>
                  </div>
                </div>
                
                <div className="mt-5 grid grid-cols-3 gap-2 relative z-10">
                  <button 
                    onClick={() => handleAddBet(match.id, `${match.home} vs ${match.away}`, "Match Winner", "1", match.odds?.["Match Winner"]?.["1"] || 1.1)}
                    className={clsx(
                      "p-2 rounded-lg text-center flex flex-col items-center justify-center transition-all",
                      isSelected(match.id, "Match Winner", "1") ? "bg-blue-600 border-blue-500 text-white" : "bg-gray-800 hover:bg-gray-700 text-blue-400 border border-transparent"
                    )}
                  >
                    <span className={clsx("text-[10px] uppercase font-semibold mb-0.5", isSelected(match.id, "Match Winner", "1") ? "text-blue-200" : "text-gray-500")}>1</span>
                    <span className={clsx("font-bold text-sm", isSelected(match.id, "Match Winner", "1") ? "text-white" : "text-blue-400")}>{(match.odds?.["Match Winner"]?.["1"] || 1.1).toFixed(2)}</span>
                  </button>
                  <button 
                    onClick={() => handleAddBet(match.id, `${match.home} vs ${match.away}`, "Match Winner", "X", match.odds?.["Match Winner"]?.["X"] || 1.1)}
                    className={clsx(
                      "p-2 rounded-lg text-center flex flex-col items-center justify-center transition-all",
                      isSelected(match.id, "Match Winner", "X") ? "bg-blue-600 border-blue-500 text-white" : "bg-gray-800 hover:bg-gray-700 text-blue-400 border border-transparent"
                    )}
                  >
                    <span className={clsx("text-[10px] uppercase font-semibold mb-0.5", isSelected(match.id, "Match Winner", "X") ? "text-blue-200" : "text-gray-500")}>X</span>
                    <span className={clsx("font-bold text-sm", isSelected(match.id, "Match Winner", "X") ? "text-white" : "text-blue-400")}>{(match.odds?.["Match Winner"]?.["X"] || 1.1).toFixed(2)}</span>
                  </button>
                  <button 
                    onClick={() => handleAddBet(match.id, `${match.home} vs ${match.away}`, "Match Winner", "2", match.odds?.["Match Winner"]?.["2"] || 1.1)}
                    className={clsx(
                      "p-2 rounded-lg text-center flex flex-col items-center justify-center transition-all",
                      isSelected(match.id, "Match Winner", "2") ? "bg-blue-600 border-blue-500 text-white" : "bg-gray-800 hover:bg-gray-700 text-blue-400 border border-transparent"
                    )}
                  >
                    <span className={clsx("text-[10px] uppercase font-semibold mb-0.5", isSelected(match.id, "Match Winner", "2") ? "text-blue-200" : "text-gray-500")}>2</span>
                    <span className={clsx("font-bold text-sm", isSelected(match.id, "Match Winner", "2") ? "text-white" : "text-blue-400")}>{(match.odds?.["Match Winner"]?.["2"] || 1.1).toFixed(2)}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
