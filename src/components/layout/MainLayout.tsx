import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Home as HomeIcon, Dribbble, DollarSign, Activity, Bell, ChevronRight, X, Trash2, Wallet } from "lucide-react";
import clsx from "clsx";
import { useBetSlipStore } from "../../store/betSlipStore";
import { useAuthStore } from "../../store/authStore";
import { AuthModal } from "../auth/AuthModal";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [authModalConfig, setAuthModalConfig] = useState<{isOpen: boolean, mode: 'login' | 'register'}>({ isOpen: false, mode: 'login' });
  const location = useLocation();
  
  const { selections, stake, isOpen: isBetSlipOpen, setIsOpen: setBetSlipOpen, removeSelection, clearSelections, setStake } = useBetSlipStore();
  const { isAuthenticated, user, logout } = useAuthStore();

  const totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1);
  const potentialWin = selections.length > 0 ? stake * totalOdds : 0;

  const bottomNavItems = [
    { name: "Menu", path: "/menu", icon: Menu },
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Casino", path: "/casino", icon: Dribbble },
    { name: "Free money", path: "/promos", icon: DollarSign },
    { name: "Sports", path: "/football", icon: Activity },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F2F5] text-gray-900 overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0B1014] z-50 flex items-center justify-between px-3 md:px-6 shadow-md">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-white italic tracking-tight">
              1<span className="font-bold font-sans not-italic text-sm ml-1">win</span>
            </span>
            <span className="text-xs text-gray-400 hidden sm:inline-block ml-2 border-l border-gray-700 pl-2">Somadian BET Swin</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center text-white">
                <span className="text-xs text-gray-400 mr-1">TZS</span>
                <span className="font-bold text-sm">{(user?.balance || 0).toFixed(2)}</span>
                <ChevronRight size={14} className="text-gray-400 rotate-90 ml-1" />
              </div>
              <button className="bg-[#00C966] hover:bg-[#00b058] text-white text-sm font-bold px-4 py-1.5 rounded transition-colors shadow-sm">
                Deposit
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAuthModalConfig({ isOpen: true, mode: 'login' })}
                className="text-white text-sm font-bold px-3 py-1.5 transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => setAuthModalConfig({ isOpen: true, mode: 'register' })}
                className="bg-[#00C966] hover:bg-[#00b058] text-white text-sm font-bold px-4 py-1.5 rounded transition-colors shadow-sm"
              >
                Register
              </button>
            </div>
          )}
          
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#ff7a00] rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto mt-16 pb-20 relative">
        <div className="max-w-7xl mx-auto w-full h-full">
          {children}
        </div>
      </main>

      {/* Bottom Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#161B21] border-t border-[#262c33] z-40 pb-safe">
        <div className="flex items-center justify-around px-1 py-1">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name}
                to={item.path}
                className={clsx(
                  "flex flex-col items-center justify-center w-16 py-1.5 transition-colors gap-1",
                  isActive ? "text-[#007AFF]" : "text-gray-400 hover:text-gray-200"
                )}
              >
                <item.icon size={22} className={isActive ? "text-[#007AFF]" : "text-gray-400"} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bet Slip (Keep as sidebar or modal) */}
      <aside className={clsx(
        "fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl",
        isBetSlipOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            Bet Slip <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full ml-1">{selections.length}</span>
          </h3>
          <div className="flex items-center gap-2">
            {selections.length > 0 && (
              <button onClick={clearSelections} className="text-gray-400 hover:text-red-500 p-1 transition-colors">
                <Trash2 size={18} />
              </button>
            )}
            <button onClick={() => setBetSlipOpen(false)} className="text-gray-500 hover:text-gray-900 p-1">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 flex flex-col custom-scrollbar bg-gray-50">
          {selections.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4 text-gray-400">
                <Activity size={24} />
              </div>
              <p className="text-gray-600 font-medium mb-1">Your bet slip is empty</p>
              <p className="text-xs text-gray-500">Click on odds to add selections.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selections.map((sel) => (
                <div key={sel.id} className="bg-white border border-gray-200 rounded-xl p-3 relative group shadow-sm">
                  <button 
                    onClick={() => removeSelection(sel.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  <div className="text-xs text-gray-500 mb-1">{sel.marketName}</div>
                  <div className="flex justify-between items-center mb-1.5 pr-6">
                    <span className="font-bold text-gray-900">{sel.outcome}</span>
                    <span className="font-bold text-blue-600">{sel.odds.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-600 truncate">{sel.matchName}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-white shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-2">
              <span className="text-gray-600 text-sm pl-2">Stake $</span>
              <input 
                type="number"
                value={stake}
                onChange={(e) => setStake(Number(e.target.value) || 0)}
                className="bg-transparent text-right text-gray-900 font-bold w-24 focus:outline-none"
                min="1"
              />
            </div>
            <div className="flex justify-between text-sm px-1">
              <span className="text-gray-600">Total Odds</span>
              <span className="font-bold text-gray-900">{totalOdds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm px-1">
              <span className="text-gray-600">Potential Win</span>
              <span className="font-bold text-[#00C966]">${potentialWin.toFixed(2)}</span>
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
              // ... existing bet logic
            }}
            disabled={selections.length === 0} 
            className="w-full py-3 bg-[#007AFF] hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-lg font-bold transition-all disabled:cursor-not-allowed"
          >
            Place Bet
          </button>
        </div>
      </aside>

      {/* Floating Action Button for Betslip */}
      <button 
        onClick={() => setBetSlipOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-[#007AFF] text-white rounded-full flex items-center justify-center shadow-lg z-30 transition-transform hover:scale-105"
      >
        <Activity size={24} />
        {selections.length > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#ff7a00] rounded-full text-xs font-bold flex items-center justify-center border-2 border-white text-white">
            {selections.length}
          </span>
        )}
      </button>

      {isBetSlipOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setBetSlipOpen(false)}
        />
      )}

      <AuthModal 
        isOpen={authModalConfig.isOpen} 
        mode={authModalConfig.mode}
        onClose={() => setAuthModalConfig({ ...authModalConfig, isOpen: false })} 
      />
    </div>
  );
}
