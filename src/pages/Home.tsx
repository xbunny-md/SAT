import { ChevronRight, Search, PlayCircle, Flame, Tv } from "lucide-react";
import { Link } from "react-router-dom";
import { useBetSlipStore } from "../store/betSlipStore";
import { useMatchesStore } from "../store/matchesStore";
import { useEffect } from "react";
import clsx from "clsx";

export default function Home() {
  const { addSelection, selections } = useBetSlipStore();
  const { matches, startPolling, stopPolling } = useMatchesStore();

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

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Sub-navigation */}
      <div className="flex items-center gap-4 px-4 py-3 overflow-x-auto scrollbar-hide bg-[#F0F2F5] sticky top-16 z-30">
        <button className="px-5 py-1.5 bg-white text-gray-900 rounded-full font-semibold shadow-sm text-sm whitespace-nowrap">
          Top
        </button>
        <button className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap">
          Live
        </button>
        <button className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap">
          Upcoming
        </button>
        <button className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap flex items-center gap-1.5">
          <span className="bg-[#ff4e00] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">NEW</span>
          TOP Bets
        </button>
        <button className="px-3 py-1.5 text-gray-600 hover:text-gray-900 font-medium text-sm whitespace-nowrap">
          Esports
        </button>
        <button className="ml-auto p-1 text-gray-900">
          <Search size={22} />
        </button>
      </div>

      <div className="px-4 space-y-6 pb-6">
        
        {/* Hero Banner */}
        <section className="relative rounded-[24px] overflow-hidden bg-gradient-to-r from-[#202735] to-[#404c5e] shadow-md mt-2">
          {/* We use a placeholder image for Luis Suarez, or a generic soccer player */}
          <div className="absolute inset-0 bg-cover bg-right" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop')", opacity: 0.4, mixBlendMode: 'overlay' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#202735] via-[#202735]/80 to-transparent"></div>
          
          <div className="relative z-10 p-6 max-w-sm">
            <h1 className="text-[22px] font-bold text-white leading-tight mb-1">
              Bonus from Somadian
            </h1>
            <p className="text-gray-200 text-sm mb-6 max-w-[200px] leading-tight">
              Wager-free FB for a multiple bet
            </p>
            <button className="bg-white text-gray-900 font-bold py-2.5 px-5 rounded-xl text-sm shadow-sm transition-transform active:scale-95">
              More details
            </button>
          </div>
        </section>

        {/* Quick Links Circles */}
        <section className="flex items-start gap-4 overflow-x-auto scrollbar-hide py-1">
          {[
            { name: "TOP Bets", icon: "⚽", bg: "bg-gradient-to-b from-blue-400 to-blue-600", border: "border-blue-500" },
            { name: "Barca vs Feyenoord", icon: "⚔️", bg: "bg-gradient-to-b from-red-500 to-red-700", border: "border-red-500" },
            { name: "Liverpool Atletico", icon: "🔴", bg: "bg-gradient-to-b from-gray-700 to-gray-900", border: "border-gray-500" },
            { name: "Champions League", icon: "🏆", bg: "bg-gradient-to-b from-blue-800 to-blue-900", border: "border-blue-800" },
            { name: "Champions League CAF", icon: "🌍", bg: "bg-gradient-to-b from-yellow-500 to-yellow-600", border: "border-yellow-500" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer">
              <div className={clsx("w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-sm border-[3px] bg-white p-0.5", item.border)}>
                <div className={clsx("w-full h-full rounded-full flex items-center justify-center text-white", item.bg)}>
                  {item.icon}
                </div>
              </div>
              <span className="text-xs font-medium text-gray-800 text-center leading-tight w-[72px]">{item.name}</span>
            </div>
          ))}
        </section>

        {/* Top Live Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[20px] font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#ff0044] text-white">
                <Activity size={14} />
              </span>
              Top Live
            </h2>
            <Link to="/live" className="bg-[#007AFF] hover:bg-blue-600 text-white font-semibold text-sm px-4 py-1.5 rounded-lg transition-colors">
              View all
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {liveMatches.map((match) => (
              <div key={match.id} className="min-w-[300px] max-w-[320px] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden shrink-0">
                {/* Card Header */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                   <div className="w-5 h-5 rounded-full bg-[#ff4e00] flex items-center justify-center text-white shrink-0">
                     <Flame size={12} />
                   </div>
                   <div className="flex items-center gap-1 text-xs font-semibold text-gray-800 truncate">
                      <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-[8px]">🌍</span>
                      <span className="truncate">Europe. {match.league}</span>
                   </div>
                </div>

                {/* Match Status & Teams */}
                <div className="p-4 pb-2">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="flex items-center gap-1 text-[#ff0044] text-xs font-bold bg-[#ff0044]/10 px-2 py-0.5 rounded-full">
                       <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff0044] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff0044]"></span>
                       </span>
                       {match.current_minute}'
                     </div>
                     <div className="bg-gray-100 p-1 rounded">
                       <Tv size={12} className="text-gray-500" />
                     </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-800">{match.home_short[0]}</div>
                        <span className="font-bold text-gray-900 text-sm">{match.home}</span>
                      </div>
                      <span className="font-bold text-gray-900 bg-gray-100 w-6 h-6 flex items-center justify-center rounded">{match.home_score}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-[10px] font-bold text-red-800">{match.away_short[0]}</div>
                        <span className="font-bold text-gray-900 text-sm">{match.away}</span>
                      </div>
                      <span className="font-bold text-gray-900 bg-gray-100 w-6 h-6 flex items-center justify-center rounded">{match.away_score}</span>
                    </div>
                  </div>
                </div>
                
                {/* Odds */}
                <div className="px-4 py-3 mt-auto">
                   <div className="text-xs text-gray-500 mb-1.5">Match Winner</div>
                   <div className="flex items-center gap-2">
                      {['1', 'X', '2'].map(outcome => {
                        const odds = match.odds?.["Match Winner"]?.[outcome] || 1.1;
                        const isSel = isSelected(match.id, "Match Winner", outcome);
                        return (
                          <button 
                            key={outcome}
                            onClick={() => handleAddBet(match.id, `${match.home} vs ${match.away}`, "Match Winner", outcome, odds)}
                            className={clsx(
                              "flex-1 flex justify-between items-center px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
                              isSel ? "bg-[#007AFF] text-white" : "bg-[#F0F2F5] text-gray-900 hover:bg-gray-200"
                            )}
                          >
                             <span>{outcome}</span>
                             <span>{odds.toFixed(2)}</span>
                          </button>
                        )
                      })}
                   </div>
                </div>
              </div>
            ))}
            
            {/* If there are no live matches, show upcoming as fallback */}
            {liveMatches.length === 0 && (
               <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500 w-full border border-gray-100">
                  No live matches right now. Check back later!
               </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
