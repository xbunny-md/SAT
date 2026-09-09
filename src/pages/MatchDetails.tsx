import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, BarChart2, ChevronRight, Tv } from 'lucide-react';
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
      <div className="bg-white border-b border-gray-100 p-4 sticky top-16 z-20 shadow-sm flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-semibold text-sm">Back to Sports</span>
        </Link>
        <div className="text-sm font-bold text-gray-800">{match.league}</div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 px-4">
        {/* Scoreboard */}
        <div className="bg-gradient-to-br from-blue-900 to-gray-900 rounded-2xl overflow-hidden shadow-md mb-8 relative">
          
          <div className="p-6 md:p-10 flex flex-col items-center relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-bold text-white">
              {isLive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#ff0044] animate-pulse"></span>
                  <span>{match.current_minute}'</span>
                </>
              ) : (
                <>
                  <Clock size={14} className="text-blue-400" />
                  {new Date(match.start_time).toLocaleString()}
                </>
              )}
            </div>

            <div className="flex items-center justify-between w-full max-w-lg">
              <div className="flex flex-col items-center gap-3 w-1/3">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center text-xl font-black text-blue-900 shadow-md">
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
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center text-xl font-black text-red-900 shadow-md">
                  {match.away_short[0]}
                </div>
                <span className="font-bold text-white text-center md:text-lg leading-tight">{match.away}</span>
              </div>
            </div>
          </div>
          
          {isLive && (
            <div className="bg-black/20 p-4 flex justify-center backdrop-blur-sm">
               <button className="flex items-center gap-2 text-sm font-bold text-blue-200 hover:text-white transition-colors">
                 <BarChart2 size={16} /> View Match Statistics <ChevronRight size={16} />
               </button>
            </div>
          )}
        </div>

        {/* Markets */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2">
             <h2 className="text-xl font-black text-gray-900 tracking-tight">All Markets</h2>
          </div>
          
          {Object.entries(match.odds || {}).map(([marketName, outcomes]: [string, any]) => (
            <div key={marketName} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">{marketName}</h3>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(outcomes).map(([outcome, odds]: [string, any]) => (
                  <button 
                    key={outcome}
                    onClick={() => handleAddBet(marketName, outcome, odds)}
                    className={clsx(
                      "p-3 rounded-xl flex justify-between items-center transition-all border",
                      isSelected(marketName, outcome) 
                        ? "bg-[#007AFF] border-transparent shadow-sm text-white" 
                        : "bg-[#F0F2F5] hover:bg-gray-200 text-gray-900 border-transparent"
                    )}
                  >
                    <span className={clsx("font-semibold text-sm", isSelected(marketName, outcome) ? "text-blue-100" : "text-gray-500")}>{outcome}</span>
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
