import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Home from "./pages/Home";
import { Wallet } from "./pages/Wallet";
import { Live } from "./pages/Live";
import { Football } from "./pages/Football";
import { Profile } from "./pages/Profile";
import { MatchDetails } from "./pages/MatchDetails";
import { MyBets } from "./pages/MyBets";

// Placeholder pages for Phase 1
const Settings = () => <div className="p-8 text-white">Settings Coming Soon</div>;

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<Live />} />
          <Route path="/football" element={<Football />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/match/:id" element={<MatchDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/responsible" element={<Settings />} />
          <Route path="/notifications" element={<Settings />} />
          <Route path="/favorites" element={<div className="p-8 text-white">Favorites Coming Soon</div>} />
          <Route path="/my-bets" element={<MyBets />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
