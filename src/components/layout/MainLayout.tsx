import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, User, Wallet, Bell, ChevronRight, Activity, Trophy, Clock, Star, Dribbble, Home, LayoutDashboard, X, Trash2, LogOut } from "lucide-react";
import clsx from "clsx";
import { useBetSlipStore } from "../../store/betSlipStore";
import { useAuthStore } from "../../store/authStore";
import { AuthModal } from "../auth/AuthModal";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [authModalConfig, setAuthModalConfig] = useState<{isOpen: boolean, mode: 'login' | 'register'}>({ isOpen: false, mode: 'login' });
  const location = useLocation();
  
  const { selections, stake, isOpen: isBetSlipOpen, setIsOpen: setBetSlipOpen, removeSelection, clearSelections, setStake } = useBetSlipStore();
  const { isAuthenticated, user, logout } = useAuthStore();

  const totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1);
  const potentialWin = selections.length > 0 ? stake * totalOdds : 0;

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Live", path: "/live", icon: Activity },
    { name: "Football", path: "/football", icon: Dribbble },
    { name: "Favorites", path: "/favorites", icon: Star },
    { name: "My Bets", path: "/my-bets", icon: Clock },
    { name: "Wallet", path: "/wallet", icon: Wallet },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-gray-200 overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 z-50 flex items-center justify-between px-4 lg:px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
          >
            <Menu size={20} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-bold text-white text-sm">SB</span>
            </div>
            <span className="text-xl font-black text-white tracking-tight hidden sm:block">
              SOMADIAN <span className="text-blue-500">BET</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 max-w-xl px-6 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search matches, teams, leagues..."
              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors relative">
            <Bell size={20} />
            {isAuthenticated && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-gray-900"></span>}
          </button>
          
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 rounded-full pl-3 pr-1 py-1">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 font-medium">Balance</span>
                  <span className="text-sm font-bold text-white leading-none">${(user?.balance || 0).toFixed(2)}</span>
                </div>
                <Link to="/wallet" className="w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-blue-500/20 text-white">
                  <Wallet size={16} />
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/profile" className="w-9 h-9 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <User size={18} className="text-gray-300" />
                </Link>
                <button onClick={logout} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAuthModalConfig({ isOpen: true, mode: 'login' })}
                className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => setAuthModalConfig({ isOpen: true, mode: 'register' })}
                className="px-4 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16 w-full h-full relative">
        {/* Left Sidebar */}
        <aside className={clsx(
          "absolute lg:static inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 z-40 transform transition-transform duration-300 ease-in-out flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20 lg:items-center"
        )}>
          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
            <div className="px-3 space-y-1 mb-6">
              <div className={clsx("px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2", !isSidebarOpen && "lg:hidden")}>Menu</div>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                      isActive ? "bg-blue-600/10 text-blue-500 font-medium" : "text-gray-400 hover:bg-gray-800/50 hover:text-white",
                      !isSidebarOpen && "lg:justify-center lg:px-0"
                    )}
                  >
                    <item.icon size={20} className={clsx(isActive ? "text-blue-500" : "text-gray-400 group-hover:text-white")} />
                    <span className={clsx(!isSidebarOpen && "lg:hidden")}>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="px-3 space-y-1">
              <div className={clsx("px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2", !isSidebarOpen && "lg:hidden")}>Popular Leagues</div>
              {[
                { name: "Premier League", flag: "🇬🇧" },
                { name: "La Liga", flag: "🇪🇸" },
                { name: "Serie A", flag: "🇮🇹" },
                { name: "Bundesliga", flag: "🇩🇪" },
                { name: "Champions League", flag: "🇪🇺" }
              ].map((league) => (
                <Link
                  key={league.name}
                  to={`/football/league/${league.name.toLowerCase().replace(' ', '-')}`}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all",
                    !isSidebarOpen && "lg:justify-center lg:px-0"
                  )}
                >
                  <span className="text-lg">{league.flag}</span>
                  <span className={clsx("text-sm", !isSidebarOpen && "lg:hidden")}>{league.name}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className={clsx("p-4 border-t border-gray-800", !isSidebarOpen && "lg:hidden")}>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl -mr-10 -mt-10"></div>
              <h4 className="text-white font-bold text-sm mb-1 relative z-10">Responsible Gambling</h4>
              <p className="text-xs text-gray-400 relative z-10">Set your limits and play safely.</p>
              <Link to="/settings/responsible" className="text-xs text-blue-400 hover:text-blue-300 font-medium mt-2 inline-block relative z-10">Manage Limits &rarr;</Link>
            </div>
          </div>
        </aside>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 relative">
          <div className="max-w-6xl mx-auto min-h-full pb-20 lg:pb-8">
            {children}
          </div>
        </main>

        {/* Right Sidebar (Bet Slip) */}
        <aside className={clsx(
          "absolute lg:static inset-y-0 right-0 w-80 bg-gray-900 border-l border-gray-800 z-40 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none",
          isBetSlipOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}>
          <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/95 backdrop-blur">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Bet Slip <span className="bg-blue-600/20 text-blue-500 text-xs px-2 py-0.5 rounded-full ml-1">{selections.length}</span>
            </h3>
            <div className="flex items-center gap-2">
              {selections.length > 0 && (
                <button onClick={clearSelections} className="text-gray-500 hover:text-red-400 p-1">
                  <Trash2 size={16} />
                </button>
              )}
              <button onClick={() => setBetSlipOpen(false)} className="lg:hidden text-gray-400 hover:text-white p-1">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 flex flex-col custom-scrollbar">
            {selections.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 text-gray-600">
                  <Activity size={24} />
                </div>
                <p className="text-gray-400 font-medium mb-1">Your bet slip is empty</p>
                <p className="text-xs text-gray-500">Click on odds to add selections to your bet slip.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selections.map((sel) => (
                  <div key={sel.id} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 relative group">
                    <button 
                      onClick={() => removeSelection(sel.id)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <div className="text-xs text-gray-400 mb-1">{sel.marketName}</div>
                    <div className="flex justify-between items-center mb-1.5 pr-4">
                      <span className="font-bold text-white">{sel.outcome}</span>
                      <span className="font-bold text-blue-400">{sel.odds.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">{sel.matchName}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-800 bg-gray-900 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.5)]">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center bg-gray-800 border border-gray-700 rounded-lg p-2">
                <span className="text-gray-400 text-sm pl-2">Stake $</span>
                <input 
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(Number(e.target.value) || 0)}
                  className="bg-transparent text-right text-white font-bold w-24 focus:outline-none"
                  min="1"
                />
              </div>
              <div className="flex justify-between text-sm px-1">
                <span className="text-gray-400">Total Odds</span>
                <span className="font-bold text-white">{totalOdds.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm px-1">
                <span className="text-gray-400">Potential Win</span>
                <span className="font-bold text-green-500">${potentialWin.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={async () => {
                if (!isAuthenticated) {
                  setAuthModalConfig({ isOpen: true, mode: 'login' });
                  return;
                }
                if (stake <= 0) {
                  alert("Please enter a valid stake amount.");
                  return;
                }
                try {
                  const res = await fetch('/api/bets', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${useAuthStore.getState().token}`
                    },
                    body: JSON.stringify({
                      stake,
                      selections: selections.map(s => ({
                        matchId: s.matchId,
                        marketName: s.marketName,
                        outcome: s.outcome,
                        odds: s.odds
                      }))
                    })
                  });
                  const data = await res.json();
                  if (res.ok) {
                    alert('Bet placed successfully!');
                    clearSelections();
                    
                    // Optimistically update wallet balance
                    const walletRes = await fetch('/api/wallet', {
                      headers: { 'Authorization': `Bearer ${useAuthStore.getState().token}` }
                    });
                    if (walletRes.ok) {
                      const walletData = await walletRes.json();
                      useAuthStore.setState(state => ({
                        user: state.user ? { ...state.user, balance: walletData.balance } : null
                      }));
                    }
                  } else {
                    alert(data.error || 'Error placing bet');
                  }
                } catch (err: any) {
                  alert(err.message || 'Network error');
                }
              }}
              disabled={selections.length === 0} 
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              Place Bet
            </button>
          </div>
        </aside>

        {/* Mobile Floating Bet Slip Button */}
        <button 
          onClick={() => setBetSlipOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-900/50 z-30 transition-transform hover:scale-105"
        >
          <Activity size={24} />
          {selections.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-gray-950">
              {selections.length}
            </span>
          )}
        </button>

        {/* Mobile Overlay */}
        {(isSidebarOpen || isBetSlipOpen) && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => {
              setSidebarOpen(false);
              setBetSlipOpen(false);
            }}
          />
        )}
      </div>

      <AuthModal 
        isOpen={authModalConfig.isOpen} 
        mode={authModalConfig.mode}
        onClose={() => setAuthModalConfig({ ...authModalConfig, isOpen: false })} 
      />
    </div>
  );
}
