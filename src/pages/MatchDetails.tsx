import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, BarChart2, ChevronRight } from 'lucide-react';
import { MatchData } from '../store/matchesStore';
import { useBetSlipStore } from '../store/betSlipStore';
import clsx from 'clsx';

export function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const { addSelection, selections } = useBetSlipStore();

  useEffect(() => {
    let interval: any;
    
    const fetchMatch = async () => {
      try {
        const res = await fetch(`/api/matches/${id}`);
        const data = await res.json();
        if (res.ok) setMatch(data.match);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
    interval = setInterval(fetchMatch, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading match data...</div>;
  if (!match) return <div className="p-8 text-center text-gray-500">Match not found</div>;

  const isLive = match.status === 'live' || match.status === 'half-time';
  
  const handleAddBet = (marketName: string, outcome: string, odds: number) => {
    addSelection({
      id: `${match.id}_${marketName}_${outcome}`,
      matchId: match.id,
      matchName: `${match.home} vs ${match.away}`,
      marketName,
      outcome,
      odds
    });
  };

  const isSelected = (marketName: string, outcome: string) => {
    return selections.some(s => s.matchId === match.id && s.marketName === marketName && s.outcome === outcome);
  };

  return (
    <div className="animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 sticky top-16 z-20 shadow-sm flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="font-semibold text-sm">Back to Sports</span>
        </Link>
        <div className="text-sm font-bold text-gray-300">{match.league}</div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 px-4">
        {/* Scoreboard */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl mb-8 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="p-6 md:p-10 flex flex-col items-center relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/80 border border-gray-700 text-xs font-bold text-gray-300">
              {isLive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-red-400">{match.current_minute}'</span>
                </>
              ) : (
                <>
                  <Clock size={14} className="text-blue-500" />
                  {new Date(match.start_time).toLocaleString()}
                </>
              )}
            </div>

            <div className="flex items-center justify-between w-full max-w-lg">
              <div className="flex flex-col items-center gap-3 w-1/3">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded-full flex items-center justify-center text-xl font-black text-white shadow-lg border border-gray-700">
                  {match.home_short[0]}
                </div>
                <span className="font-bold text-white text-center md:text-lg leading-tight">{match.home}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center w-1/3">
                <div className="text-4xl md:text-5xl font-black text-white tracking-tighter tabular-nums drop-shadow-md">
                  {isLive ? `${match.home_score} - ${match.away_score}` : "vs"}
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 w-1/3">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded-full flex items-center justify-center text-xl font-black text-white shadow-lg border border-gray-700">
                  {match.away_short[0]}
                </div>
                <span className="font-bold text-white text-center md:text-lg leading-tight">{match.away}</span>
              </div>
            </div>
          </div>
          
          {isLive && (
            <div className="bg-gray-950/50 p-4 border-t border-gray-800/50 flex justify-center">
               <button className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
                 <BarChart2 size={16} /> View Match Statistics <ChevronRight size={16} />
               </button>
            </div>
          )}
        </div>

        {/* Markets */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-1">
             <h2 className="text-xl font-black text-white tracking-tight">All Markets</h2>
          </div>
          
          {Object.entries(match.odds || {}).map(([marketName, outcomes]: [string, any]) => (
            <div key={marketName} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-800 bg-gray-800/30 flex items-center justify-between">
                <h3 className="font-bold text-gray-200">{marketName}</h3>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(outcomes).map(([outcome, odds]: [string, any]) => (
                  <button 
                    key={outcome}
                    onClick={() => handleAddBet(marketName, outcome, odds)}
                    className={clsx(
                      "p-3 rounded-xl flex justify-between items-center transition-all border",
                      isSelected(marketName, outcome) 
                        ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20 text-white" 
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300 border-transparent hover:border-gray-600"
                    )}
                  >
                    <span className={clsx("font-semibold text-sm", isSelected(marketName, outcome) ? "text-blue-100" : "text-gray-400")}>{outcome}</span>
                    <span className="font-bold">{odds.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
