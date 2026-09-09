import { PlayCircle, TrendingUp, ShieldCheck, Flame, ChevronRight, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useBetSlipStore, BetSelection } from "../store/betSlipStore";
import { useMatchesStore } from "../store/matchesStore";
import { useEffect } from "react";
import clsx from "clsx";

export default function Home() {
  const { addSelection, selections } = useBetSlipStore();
  const { matches, startPolling, stopPolling, loading } = useMatchesStore();

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const handleAddBet = (matchId: string, matchName: string, marketName: string, outcome: string, odds: number) => {
    addSelection({
      id: `${matchId}_${marketName}_${outcome}`,
      matchId,
      matchName,
      marketName,
      outcome,
      odds
    });
  };

  const isSelected = (matchId: string, marketName: string, outcome: string) => {
    return selections.some(s => s.matchId === matchId && s.marketName === marketName && s.outcome === outcome);
  };

  const liveMatches = matches.filter(m => m.status === 'live' || m.status === 'half-time');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');

  return (
    <div className="p-4 lg:p-6 space-y-8 animate-in fade-in duration-500">
      {/* Hero / Promotions Banner */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border border-blue-800/50 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 p-8 w-1/2 h-full hidden md:block">
          <div className="w-full h-full bg-gradient-to-l from-transparent to-indigo-900/0 flex items-center justify-end">
            <ShieldCheck size={120} className="text-blue-500/20 rotate-12" />
          </div>
        </div>
        
        <div className="relative z-10 p-6 md:p-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Flame size={14} /> New Season Offer
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
            100% Welcome Bonus <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Up to $500</span>
          </h1>
          <p className="text-blue-100/80 mb-8 max-w-md text-sm md:text-base">
            Join SOMADIAN BET today and double your first deposit. Experience the ultimate AI-driven sportsbook.
          </p>
          <div className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-blue-600/30 transition-all active:scale-95">
              Claim Bonus
            </button>
            <button className="bg-gray-800/50 hover:bg-gray-800 text-white border border-gray-700 font-bold py-3 px-6 rounded-lg transition-all active:scale-95 flex items-center gap-2 backdrop-blur-sm">
              <PlayCircle size={18} /> How to play
            </button>
          </div>
        </div>
      </section>

      {/* Live Matches Widget */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </div>
            Live Football
          </h2>
          <Link to="/live" className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 group">
            View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
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
      </section>

      {/* Popular Upcoming */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Trending Matches
          </h2>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          {/* List Header */}
          <div className="grid grid-cols-12 gap-4 p-3 border-b border-gray-800 bg-gray-800/40 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:grid">
            <div className="col-span-5">Match</div>
            <div className="col-span-7 flex justify-end gap-2 grid grid-cols-3 gap-4 text-center">
              <div className="w-full text-center">1</div>
              <div className="w-full text-center">X</div>
              <div className="w-full text-center">2</div>
            </div>
          </div>
          
          {/* List Items */}
          <div className="divide-y divide-gray-800">
            {upcomingMatches.map((match) => (
              <div key={match.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-gray-800/30 transition-colors relative group">
                <Link to={`/match/${match.id}`} className="absolute inset-0 z-0"></Link>
                <div className="col-span-1 md:col-span-5 relative z-10 pointer-events-none">
                  <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {new Date(match.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {match.league}
                  </div>
                  <div className="font-bold text-gray-200 group-hover:text-white transition-colors text-sm">{match.home}</div>
                  <div className="font-bold text-gray-200 group-hover:text-white transition-colors text-sm mt-0.5">{match.away}</div>
                </div>
                
                <div className="col-span-1 md:col-span-7 flex gap-2 md:grid md:grid-cols-3 md:gap-4 relative z-10">
                  <button 
                    onClick={() => handleAddBet(match.id, `${match.home} vs ${match.away}`, "Match Winner", "1", match.odds?.["Match Winner"]?.["1"] || 1.1)}
                    className={clsx(
                      "flex-1 md:w-full py-2 rounded-lg text-center font-bold text-sm transition-all border",
                      isSelected(match.id, "Match Winner", "1") ? "bg-blue-600 border-blue-500 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300 border-transparent hover:border-gray-600"
                    )}
                  >
                    {(match.odds?.["Match Winner"]?.["1"] || 1.1).toFixed(2)}
                  </button>
                  <button 
                    onClick={() => handleAddBet(match.id, `${match.home} vs ${match.away}`, "Match Winner", "X", match.odds?.["Match Winner"]?.["X"] || 1.1)}
                    className={clsx(
                      "flex-1 md:w-full py-2 rounded-lg text-center font-bold text-sm transition-all border",
                      isSelected(match.id, "Match Winner", "X") ? "bg-blue-600 border-blue-500 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300 border-transparent hover:border-gray-600"
                    )}
                  >
                    {(match.odds?.["Match Winner"]?.["X"] || 1.1).toFixed(2)}
                  </button>
                  <button 
                    onClick={() => handleAddBet(match.id, `${match.home} vs ${match.away}`, "Match Winner", "2", match.odds?.["Match Winner"]?.["2"] || 1.1)}
                    className={clsx(
                      "flex-1 md:w-full py-2 rounded-lg text-center font-bold text-sm transition-all border",
                      isSelected(match.id, "Match Winner", "2") ? "bg-blue-600 border-blue-500 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300 border-transparent hover:border-gray-600"
                    )}
                  >
                    {(match.odds?.["Match Winner"]?.["2"] || 1.1).toFixed(2)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
