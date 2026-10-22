import React, { useState } from 'react';
import {
  Clock,
  HelpCircle,
  Volume2,
  VolumeX,
  History,
  TrendingUp,
  Award,
  Wallet,
  ArrowLeft,
  X,
  Minus,
  Plus,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../utils/sound';

interface WingoGameProps {
  onBack: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export const WingoGame: React.FC<WingoGameProps> = ({ onBack, onOpenDeposit, onOpenWithdraw }) => {
  const {
    currentUser,
    wingoTimeRemaining,
    currentWingoPeriod,
    wingoHistory,
    placeWingoBet,
    userBets,
    soundMuted,
    toggleSound,
    toast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'30s' | '1m' | '3m' | '5m'>('30s');
  const [timer1m, setTimer1m] = useState(60);
  const [timer3m, setTimer3m] = useState(180);
  const [timer5m, setTimer5m] = useState(300);

  const [demoWinner, setDemoWinner] = useState({ uid: '592817', amount: 450, game: 'WinGo 1 Min' });

  React.useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer1m((p) => (p <= 1 ? 60 : p - 1));
      setTimer3m((p) => (p <= 1 ? 180 : p - 1));
      setTimer5m((p) => (p <= 1 ? 300 : p - 1));
    }, 1000);

    const winnerInterval = setInterval(() => {
      const uids = ['719284', '528912', '891024', '349102', '627189', '491023', '819203'];
      const games = ['WinGo 30s', 'WinGo 1 Min', 'WinGo 3 Min', 'WinGo 5 Min', 'Aviator'];
      const amounts = [350, 450, 800, 1250, 2400, 520, 1500, 3100];
      setDemoWinner({
        uid: uids[Math.floor(Math.random() * uids.length)],
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        game: games[Math.floor(Math.random() * games.length)],
      });
    }, 3500);

    return () => {
      clearInterval(timerInterval);
      clearInterval(winnerInterval);
    };
  }, []);

  const activeTime =
    activeTab === '30s'
      ? wingoTimeRemaining
      : activeTab === '1m'
      ? timer1m
      : activeTab === '3m'
      ? timer3m
      : timer5m;

  const minutes = Math.floor(activeTime / 60);
  const seconds = activeTime % 60;
  const minTens = Math.floor(minutes / 10);
  const minOnes = minutes % 10;
  const secTens = Math.floor(seconds / 10);
  const secOnes = seconds % 10;

  const [selectedBetType, setSelectedBetType] = useState<string | null>(null);
  const [selectedBetTitle, setSelectedBetTitle] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Bet Slip state strictly matching screenshot IMG_2540
  const [baseBalance, setBaseBalance] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [agreedRules, setAgreedRules] = useState<boolean>(true);
  const [historySubTab, setHistorySubTab] = useState<'game' | 'chart' | 'my'>('game');

  const openBetModal = (type: string, title: string) => {
    sounds.playChipBet();
    setSelectedBetType(type);
    setSelectedBetTitle(title);
    setQuantity(1);
    setMultiplier(1);
    setIsModalOpen(true);
  };

  const handleConfirmBet = () => {
    if (!selectedBetType) return;
    if (!agreedRules) {
      toast('Please agree to Pre-sale rules', 'error');
      return;
    }
    const unitAmount = baseBalance * quantity;
    const res = placeWingoBet(unitAmount, selectedBetType, multiplier);
    if (res.success) {
      sounds.playChipBet();
      setIsModalOpen(false);
    } else if (res.error) {
      toast(res.error, 'error');
    }
  };

  const totalBetAmount = baseBalance * quantity * multiplier;

  const numbers = [
    { num: 0, color: 'split-violet-red' },
    { num: 1, color: 'green' },
    { num: 2, color: 'red' },
    { num: 3, color: 'green' },
    { num: 4, color: 'red' },
    { num: 5, color: 'split-violet-green' },
    { num: 6, color: 'red' },
    { num: 7, color: 'green' },
    { num: 8, color: 'red' },
    { num: 9, color: 'green' },
  ];

  const recentFive = wingoHistory.slice(0, 5);

  return (
    <div className="space-y-3 pb-24 text-neutral-100 relative">
      {/* ================= 3-2-1 COME DOWN COUNTDOWN OVERLAY ================= */}
      {wingoTimeRemaining <= 3 && wingoTimeRemaining >= 1 && (
        <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center pointer-events-none animate-in fade-in duration-100">
          <div className="flex flex-col items-center">
            {/* Pulsing countdown number circle */}
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-rose-600 via-amber-500 to-rose-500 border-4 border-white shadow-[0_0_50px_rgba(255,100,50,0.9)] flex items-center justify-center animate-ping">
              <span className="text-7xl font-black text-white font-mono drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                {wingoTimeRemaining}
              </span>
            </div>
            <div className="text-xl font-black text-amber-300 mt-4 tracking-widest uppercase drop-shadow animate-pulse">
              Drawing Results...
            </div>
          </div>
        </div>
      )}

      {/* Wallet Balance Card matching screenshot IMG_2538 */}
      <div className="bg-gradient-to-r from-[#441117] via-[#330c11] to-[#250609] p-3.5 rounded-2xl border border-rose-900/60 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm">👜</span>
            <div>
              <div className="text-[11px] text-neutral-400">Wallet balance</div>
              <div className="text-xl font-black text-white">
                ₹{currentUser ? currentUser.balance.toFixed(2) : '0.00'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSound}
              className="w-8 h-8 rounded-full bg-[#3b0f15] border border-rose-900/60 flex items-center justify-center text-amber-400 hover:text-white"
              title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenWithdraw}
              className="px-3.5 py-1.5 rounded-full bg-rose-700/80 hover:bg-rose-600 text-white font-bold text-xs shadow"
            >
              Withdraw
            </button>
            <button
              onClick={onOpenDeposit}
              className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
            >
              Deposit
            </button>
          </div>
        </div>
      </div>

      {/* Speaker notice ticker matching IMG_2538 */}
      <div className="flex items-center space-x-2 bg-[#2d090f] px-3 py-1.5 rounded-xl border border-rose-900/40 text-xs">
        <span className="text-amber-400">📢</span>
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee text-[11px] text-rose-200/90 font-medium">
            Dear User, welcome to ROX.WIN! Fast withdrawals and certified fair draws active. Good luck!
          </div>
        </div>
        <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
          Detail
        </span>
      </div>

      {/* Timer Modes: 30sec, 1 Min, 3 Min, 5 Min (IMG_2538) */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#240609] rounded-2xl border border-rose-900/40">
        {[
          { id: '30s' as const, label: 'WinGo 30sec' },
          { id: '1m' as const, label: 'WinGo 1 Min' },
          { id: '3m' as const, label: 'WinGo 3 Min' },
          { id: '5m' as const, label: 'WinGo 5 Min' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              sounds.playChipBet();
              setActiveTab(t.id);
            }}
            className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all ${
              activeTab === t.id
                ? 'bg-gradient-to-b from-[#ff8d75] to-[#ff5d46] text-rose-950 shadow-md font-black'
                : 'text-neutral-400 hover:text-white bg-[#300a10]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 mx-auto mb-0.5" />
            <span className="text-[10px] block leading-tight">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Countdown Card matching screenshot IMG_2538 */}
      <div className="p-3.5 bg-gradient-to-r from-[#3e1017] via-[#2f0b10] to-[#250609] rounded-2xl border border-rose-900/60 shadow-md relative">
        <div className="flex items-center justify-between pb-2 border-b border-rose-900/40">
          <div className="flex items-center space-x-1.5">
            <span className="px-2 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-[10px] text-amber-300 font-bold">
              📖 How to play
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block">Time remaining</span>
            <div className="flex items-center space-x-1 justify-end font-mono">
              <span className="w-5 h-6 rounded bg-[#170305] border border-rose-800 flex items-center justify-center font-black text-amber-400 text-xs">
                {minTens}
              </span>
              <span className="w-5 h-6 rounded bg-[#170305] border border-rose-800 flex items-center justify-center font-black text-amber-400 text-xs">
                {minOnes}
              </span>
              <span className="text-rose-400 font-bold">:</span>
              <span className="w-5 h-6 rounded bg-[#170305] border border-rose-800 flex items-center justify-center font-black text-amber-400 text-xs">
                {secTens}
              </span>
              <span className="w-5 h-6 rounded bg-[#170305] border border-rose-800 flex items-center justify-center font-black text-amber-400 text-xs">
                {secOnes}
              </span>
            </div>
          </div>
        </div>

        {/* Demo Player Winning Notification Banner */}
        <div className="mt-2.5 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-xs">
          <span className="text-emerald-400 font-bold">🏆 Winner:</span>
          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee text-emerald-200 font-medium text-[11px]">
              Player UID {demoWinner.uid} won ₹{demoWinner.amount.toLocaleString()} on {demoWinner.game}! • Real-time winners active.
            </div>
          </div>
        </div>

        {/* Period number & Recent 5 balls */}
        <div className="flex items-center justify-between pt-2.5">
          <div className="flex items-center space-x-1">
            {recentFive.map((r, i) => (
              <span
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shadow ${
                  r.color === 'green'
                    ? 'bg-emerald-600 text-white'
                    : r.color === 'red'
                    ? 'bg-rose-600 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-rose-600 text-white'
                }`}
              >
                {r.number}
              </span>
            ))}
          </div>
          <span className="text-[11px] font-mono text-amber-300/90 font-bold">
            {currentWingoPeriod}
          </span>
        </div>
      </div>

      {/* 24/7 ALL-TIME BETTING STATUS & QUICK CHIP SELECTOR (1, 5, 10, 20, 50, 100, 1000) */}
      <div className="bg-[#240609] p-2.5 rounded-2xl border border-rose-900/50 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-emerald-400">24/7 All-Time Betting Active</span>
          </div>
          {wingoTimeRemaining <= 3 ? (
            <span className="font-mono text-[11px] text-amber-300 font-bold animate-pulse">
              Drawing results... Next bets queue for #{(BigInt(currentWingoPeriod) + 1n).toString().slice(-4)}
            </span>
          ) : (
            <span className="font-mono text-[11px] text-neutral-400">
              Round: #{currentWingoPeriod.slice(-4)}
            </span>
          )}
        </div>

        {/* Quick Chip Row (1, 5, 10, 20, 50, 100, 1000) */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
            <span>Quick Chip:</span>
            <span className="text-amber-400 font-bold">₹{baseBalance}</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[1, 5, 10, 20, 50, 100, 1000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  sounds.playChipBet();
                  setBaseBalance(amt);
                  toast(`Chip selected: ₹${amt}`, 'info');
                }}
                className={`py-1.5 rounded-lg text-center font-black text-xs transition-all border ${
                  baseBalance === amt
                    ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-rose-950 border-amber-300 shadow-md scale-105'
                    : 'bg-[#3b0f15] text-rose-200 border-rose-900/60 hover:bg-[#4d141c]'
                }`}
              >
                ₹{amt >= 1000 ? '1K' : amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BIG 3 COLOR BET BUTTONS (Green, Violet, Red) matching IMG_2538 */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => openBetModal('green', 'Green (2X)')}
          className="py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 active:scale-95 text-white font-black text-sm shadow-lg shadow-emerald-950/60"
        >
          Green
        </button>
        <button
          onClick={() => openBetModal('violet', 'Violet (4.5X)')}
          className="py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-500 hover:brightness-110 active:scale-95 text-white font-black text-sm shadow-lg shadow-purple-950/60"
        >
          Violet
        </button>
        <button
          onClick={() => openBetModal('red', 'Red (2X)')}
          className="py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:brightness-110 active:scale-95 text-white font-black text-sm shadow-lg shadow-rose-950/60"
        >
          Red
        </button>
      </div>

      {/* 0-9 NUMBER BALLS GRID matching screenshot IMG_2538 */}
      <div className="p-3.5 bg-[#2b080d] rounded-2xl border border-rose-900/60 relative">
        <div className="grid grid-cols-5 gap-3">
          {numbers.map((item) => {
            const isSplitRed = item.color === 'split-violet-red';
            const isSplitGreen = item.color === 'split-violet-green';
            return (
              <button
                key={item.num}
                onClick={() => openBetModal(item.num.toString(), `Number ${item.num} (9X)`)}
                className="relative aspect-square rounded-full flex items-center justify-center font-black text-xl text-white shadow-lg border-2 border-white/20 hover:scale-105 active:scale-95 transition-all overflow-hidden"
                style={{
                  background: isSplitRed
                    ? 'linear-gradient(135deg, #7c3aed 50%, #dc2626 50%)'
                    : isSplitGreen
                    ? 'linear-gradient(135deg, #7c3aed 50%, #16a34a 50%)'
                    : item.color === 'green'
                    ? '#16a34a'
                    : '#dc2626',
                }}
              >
                <span className="drop-shadow-md z-10">{item.num}</span>
                <span className="absolute inset-0 bg-white/10 rounded-full" />
              </button>
            );
          })}
        </div>

        {/* Floating dragon badge on right matching screenshot */}
        <div className="absolute -top-3 -right-2 w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 border border-white shadow-xl flex items-center justify-center text-rose-950 font-black text-sm pointer-events-none">
          ⚡
        </div>
      </div>

      {/* BIG / SMALL BUTTONS matching screenshot IMG_2538 */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => openBetModal('big', 'Big (2X)')}
          className="py-3 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:brightness-110 text-white font-black text-sm shadow-md active:scale-95 transition-all"
        >
          Big (5-9)
        </button>
        <button
          onClick={() => openBetModal('small', 'Small (2X)')}
          className="py-3 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:brightness-110 text-white font-black text-sm shadow-md active:scale-95 transition-all"
        >
          Small (0-4)
        </button>
      </div>

      {/* ================= EXACT BET SLIP MODAL MATCHING SCREENSHOT IMG_2540 ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#250609] rounded-t-3xl border-t border-rose-900/80 shadow-2xl overflow-hidden text-neutral-100 animate-in slide-in-from-bottom duration-200">
            {/* Top Amber Ribbon Banner matching IMG_2540 */}
            <div className="bg-gradient-to-r from-[#fea076] to-[#ff7360] p-4 text-center text-rose-950 relative">
              <div className="text-xs font-bold opacity-90">
                {activeTab === '30s' ? 'WinGo 30sec' : 'WinGo 1 Min'}
              </div>
              <div className="mt-1 bg-white py-1.5 px-4 rounded-lg inline-block text-sm font-black text-neutral-900 shadow">
                Select {selectedBetTitle}
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Balance base unit selector matching prompt: 1, 5, 10, 20, 50, 100, 1000 */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-semibold">Balance Unit</span>
                  <span className="text-amber-400 font-bold">Selected: ₹{baseBalance}</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[1, 5, 10, 20, 50, 100, 1000].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        sounds.playChipBet();
                        setBaseBalance(b);
                      }}
                      className={`py-1.5 rounded-lg font-black text-center text-xs border transition-all ${
                        baseBalance === b
                          ? 'bg-gradient-to-b from-amber-400 to-amber-500 border-amber-300 text-rose-950 shadow scale-105'
                          : 'bg-[#3b0f15] border-rose-900/60 text-neutral-300 hover:bg-[#4d141c]'
                      }`}
                    >
                      ₹{b >= 1000 ? '1K' : b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity stepper matching IMG_2540: - [ 1 ] + */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-semibold">Quantity</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      sounds.playChipBet();
                      setQuantity((q) => Math.max(1, q - 1));
                    }}
                    className="w-7 h-7 rounded-lg bg-amber-500 text-rose-950 font-black flex items-center justify-center hover:bg-amber-400"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-mono font-bold text-sm bg-[#170305] py-1 rounded border border-rose-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => {
                      sounds.playChipBet();
                      setQuantity((q) => q + 1);
                    }}
                    className="w-7 h-7 rounded-lg bg-amber-500 text-rose-950 font-black flex items-center justify-center hover:bg-amber-400"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Multiplier pills matching IMG_2540: X1, X5, X10, X20, X50, X100 */}
              <div className="flex justify-between space-x-1">
                {[1, 5, 10, 20, 50, 100].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      sounds.playChipBet();
                      setMultiplier(m);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      multiplier === m
                        ? 'bg-amber-500 border-amber-300 text-rose-950 shadow font-black'
                        : 'bg-[#3b0f15] border-rose-900/60 text-neutral-300 hover:bg-[#4d141c]'
                    }`}
                  >
                    X{m}
                  </button>
                ))}
              </div>

              {/* Agreement Checkbox matching IMG_2540 */}
              <div className="flex items-center space-x-2 text-xs text-neutral-300 pt-1">
                <input
                  type="checkbox"
                  id="presaleRules"
                  checked={agreedRules}
                  onChange={(e) => setAgreedRules(e.target.checked)}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
                <label htmlFor="presaleRules" className="cursor-pointer">
                  I agree <span className="text-rose-400">《Pre-sale rules》</span>
                </label>
              </div>

              {/* Footer action buttons matching IMG_2540 */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 rounded-full border border-rose-800 text-rose-300 font-bold text-sm bg-transparent hover:bg-rose-950/40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBet}
                  className="py-3 rounded-full bg-gradient-to-r from-[#fea076] to-[#ff7360] text-rose-950 font-black text-sm shadow-lg hover:brightness-105 active:scale-95 transition-all"
                >
                  Total amount ₹{totalBetAmount.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tabs matching IMG_2539 */}
      <div className="bg-[#260509] rounded-2xl border border-rose-900/50 p-3 space-y-3">
        <div className="flex rounded-xl bg-[#170305] p-1 border border-rose-950 text-xs font-bold">
          <button
            onClick={() => setHistorySubTab('game')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              historySubTab === 'game' ? 'bg-[#3e0f16] text-white shadow' : 'text-neutral-400'
            }`}
          >
            Game history
          </button>
          <button
            onClick={() => setHistorySubTab('chart')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              historySubTab === 'chart' ? 'bg-[#3e0f16] text-white shadow' : 'text-neutral-400'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setHistorySubTab('my')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              historySubTab === 'my' ? 'bg-[#3e0f16] text-white shadow' : 'text-neutral-400'
            }`}
          >
            My history
          </button>
        </div>

        {/* Dynamic Tab Views: Game history, Chart, My history */}
        {historySubTab === 'game' && (
          <div className="space-y-1 text-xs">
            <div className="grid grid-cols-4 text-[10px] text-neutral-400 font-bold px-2 py-1 border-b border-rose-950">
              <span>Period</span>
              <span className="text-center">Number</span>
              <span className="text-center">Big Small</span>
              <span className="text-right">Color</span>
            </div>

            {wingoHistory.slice(0, 10).map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-4 items-center bg-[#300a10] px-2 py-2 rounded-lg text-[11px]"
              >
                <span className="font-mono text-neutral-300">{r.period.slice(-7)}</span>
                <span className="text-center font-black text-amber-300 font-mono text-xs">
                  {r.number}
                </span>
                <span className="text-center font-bold text-neutral-200 capitalize">
                  {r.size}
                </span>
                <div className="flex justify-end">
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${
                      r.color === 'green'
                        ? 'bg-emerald-500'
                        : r.color === 'red'
                        ? 'bg-rose-500'
                        : 'bg-purple-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {historySubTab === 'chart' && (
          <div className="space-y-3 text-xs">
            {/* Statistic Statistics Table matching IMG_2567 */}
            <div className="bg-[#1e0407] rounded-xl p-2.5 border border-rose-950 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 border-b border-rose-950 pb-1.5">
                <span className="font-bold text-rose-200">Statistic</span>
                <span>(last 100 Periods)</span>
              </div>

              {/* Winning numbers header */}
              <div className="grid grid-cols-11 gap-1 text-center font-mono text-[10px]">
                <span className="text-left text-neutral-400 font-sans col-span-2">Winning</span>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <span key={n} className="w-5 h-5 rounded-full bg-rose-900/60 border border-rose-700 text-white font-bold flex items-center justify-center mx-auto text-[9px]">
                    {n}
                  </span>
                ))}
              </div>

              {/* Missing */}
              <div className="grid grid-cols-11 gap-1 text-center font-mono text-[10px] text-neutral-300">
                <span className="text-left text-neutral-400 font-sans col-span-2">Missing</span>
                {[13, 0, 6, 5, 2, 25, 10, 3, 15, 9].map((val, idx) => (
                  <span key={idx}>{val}</span>
                ))}
              </div>

              {/* Avg missing */}
              <div className="grid grid-cols-11 gap-1 text-center font-mono text-[10px] text-neutral-300">
                <span className="text-left text-neutral-400 font-sans col-span-2">Avg missing</span>
                {[9, 10, 6, 8, 4, 8, 8, 6, 19, 10].map((val, idx) => (
                  <span key={idx}>{val}</span>
                ))}
              </div>

              {/* Frequency */}
              <div className="grid grid-cols-11 gap-1 text-center font-mono text-[10px] text-neutral-300">
                <span className="text-left text-neutral-400 font-sans col-span-2">Frequency</span>
                {[9, 8, 12, 10, 16, 10, 10, 13, 4, 8].map((val, idx) => (
                  <span key={idx}>{val}</span>
                ))}
              </div>

              {/* Max consecutive */}
              <div className="grid grid-cols-11 gap-1 text-center font-mono text-[10px] text-neutral-300">
                <span className="text-left text-neutral-400 font-sans col-span-2">Max consec</span>
                {[1, 2, 3, 2, 2, 3, 1, 2, 1, 1].map((val, idx) => (
                  <span key={idx}>{val}</span>
                ))}
              </div>
            </div>

            {/* Trend Dot Grid matching IMG_2567 */}
            <div className="space-y-2 pt-1">
              {wingoHistory.slice(0, 12).map((item, idx) => (
                <div key={idx} className="bg-[#300a10] p-2 rounded-xl flex items-center justify-between text-[11px]">
                  <span className="font-mono text-neutral-300">{item.period.slice(-7)}</span>
                  <div className="flex space-x-1.5 items-center">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                      const isWinning = n === item.number;
                      return (
                        <div
                          key={n}
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] font-mono ${
                            isWinning
                              ? n === 0
                                ? 'bg-purple-600 text-white shadow-md ring-2 ring-amber-400'
                                : n === 5
                                ? 'bg-purple-500 text-white shadow-md ring-2 ring-amber-400'
                                : [1, 3, 7, 9].includes(n)
                                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-amber-400'
                                : 'bg-rose-600 text-white shadow-md ring-2 ring-amber-400'
                              : 'bg-black/40 text-neutral-600 border border-neutral-800'
                          }`}
                        >
                          {isWinning ? n : '·'}
                        </div>
                      );
                    })}
                    <span
                      className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center text-white ${
                        item.size === 'big' ? 'bg-amber-600' : 'bg-blue-600'
                      }`}
                    >
                      {item.size === 'big' ? 'B' : 'S'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {historySubTab === 'my' && (
          <div className="space-y-2 text-xs">
            <div className="text-[11px] text-neutral-400 px-1 font-bold">My Betting History</div>
            {userBets.length === 0 ? (
              <div className="p-6 text-center text-neutral-400 text-xs bg-[#300a10] rounded-xl border border-rose-950">
                No bets placed yet. Place a bet on WinGo to see history!
              </div>
            ) : (
              userBets.slice(0, 10).map((b) => (
                <div key={b.id} className="p-2.5 bg-[#300a10] rounded-xl flex items-center justify-between text-[11px]">
                  <div>
                    <div className="font-bold text-white capitalize">
                      {b.game} • Bet on <span className="text-amber-300">{b.betOn}</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">Amount: ₹{b.amount.toFixed(2)} • {b.timestamp}</div>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.status === 'won'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : b.status === 'lost'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                      }`}
                    >
                      {b.status === 'won' ? `+₹${b.winAmount?.toFixed(2)}` : b.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
