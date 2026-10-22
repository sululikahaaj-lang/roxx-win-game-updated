import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, RotateCcw, Flame, ShieldAlert, Sparkles, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../utils/sound';

interface ChickenRoadGameProps {
  onBack: () => void;
  onOpenDeposit: () => void;
}

export const ChickenRoadGame: React.FC<ChickenRoadGameProps> = ({ onBack, onOpenDeposit }) => {
  const { currentUser, placeGenericBet, settleGenericWin, settleGenericLoss, adminSettings, toast } = useApp();

  const [betAmount, setBetAmount] = useState<number>(50.0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'busted' | 'cashed'>('idle');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.0);
  const [laneObstacles, setLaneObstacles] = useState<number[]>([]);

  const multipliers = [1.25, 1.55, 1.95, 2.50, 3.20, 4.20, 5.80, 8.00, 12.00];

  const startChickenGame = () => {
    if (!currentUser) {
      toast('Please log in first', 'error');
      return;
    }
    const betRes = placeGenericBet('aviator', betAmount); // Using generic bet with error-free deduction
    if (!betRes.success) {
      if (betRes.error) toast(betRes.error, 'error');
      return;
    }

    // Generate random obstacle lane (0 to 8) where chicken might get hit
    // Bot loss rate config
    const isHighLoss = Math.random() * 100 < (adminSettings.botLossRate || 75);
    const crashLane = isHighLoss ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 7) + 1;

    setCurrentStep(0);
    setCurrentMultiplier(1.0);
    setGameState('playing');
    setLaneObstacles([crashLane]);
    sounds.playChipBet();
  };

  const handleStepForward = () => {
    if (gameState !== 'playing') return;

    const nextStep = currentStep + 1;
    const isHit = laneObstacles.includes(nextStep) || (Math.random() * 100 < (adminSettings.botLossRate || 75) && nextStep >= 3);

    if (isHit) {
      // Hit obstacle!
      setGameState('busted');
      sounds.playCrash();
      settleGenericLoss('aviator', betAmount, currentMultiplier);
    } else {
      // Safe step!
      sounds.playDiamondChime();
      const mult = multipliers[Math.min(nextStep, multipliers.length - 1)];
      setCurrentStep(nextStep);
      setCurrentMultiplier(mult);

      if (nextStep >= multipliers.length - 1) {
        // Reached the end! Auto cashout
        handleCashOut(mult);
      }
    }
  };

  const handleCashOut = (mult = currentMultiplier) => {
    if (gameState !== 'playing') return;
    setGameState('cashed');
    const winAmount = Number((betAmount * mult).toFixed(2));
    sounds.playCashout();
    settleGenericWin('aviator', betAmount, winAmount, mult);
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#1b4332] via-[#2d6a4f] to-[#081c15] text-white flex flex-col justify-between p-3 rounded-2xl shadow-2xl relative overflow-hidden font-sans">
      {/* Background road grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffd166_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Balance Capsule */}
        <div className="flex items-center bg-[#1b4332]/90 border border-emerald-500/40 rounded-full px-3.5 py-1 space-x-1.5 shadow-md">
          <span className="text-amber-300 font-bold text-sm">🪙</span>
          <span className="text-white text-xs font-bold font-mono">
            ₹{currentUser ? currentUser.balance.toFixed(2) : '0.00'}
          </span>
          <button
            onClick={onOpenDeposit}
            className="w-4 h-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs flex items-center justify-center ml-1"
          >
            +
          </button>
        </div>

        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-rose-950 text-sm shadow font-bold">
          🐔
        </div>
      </div>

      {/* Game Title */}
      <div className="text-center my-1 z-10">
        <h1 className="text-xl font-black text-amber-300 tracking-wider drop-shadow">
          CHICKEN ROAD 🐔
        </h1>
        <p className="text-[10px] text-emerald-200">Cross the Traffic &amp; Multiply Your Win!</p>
      </div>

      {/* Main Road Crossing Canvas Area */}
      <div className="flex-1 my-2 bg-black/50 rounded-2xl border-2 border-emerald-500/50 p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
        {/* Active Multiplier & Status Banner */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 bg-emerald-950/80 px-4 py-2 rounded-xl border border-emerald-500/40">
          <div className="text-xs font-bold text-emerald-300">
            Lane Step: <span className="text-white">{currentStep} / {multipliers.length - 1}</span>
          </div>
          <div className="text-base font-black text-amber-400 font-mono">
            {currentMultiplier.toFixed(2)}x
          </div>
        </div>

        {/* Chicken Crossing Lanes View */}
        <div className="w-full max-w-xs space-y-2 my-auto">
          {multipliers.slice(0, 7).reverse().map((m, revIdx) => {
            const laneIndex = 7 - revIdx;
            const isCurrent = currentStep === laneIndex;
            const isPassed = currentStep > laneIndex;
            return (
              <div
                key={m}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  isCurrent
                    ? 'bg-amber-500/30 border-amber-400 shadow-lg scale-105'
                    : isPassed
                    ? 'bg-emerald-900/40 border-emerald-600/40 opacity-75'
                    : 'bg-[#0f291e] border-emerald-900/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-600 flex items-center justify-center font-bold text-[10px] text-emerald-300">
                    {laneIndex}
                  </span>
                  <span className="font-bold text-white">Lane {laneIndex}</span>
                  {isCurrent && <span className="text-base animate-bounce">🐔</span>}
                  {isPassed && <span className="text-xs">✅</span>}
                </div>
                <div className="font-black text-amber-300 font-mono text-sm">
                  {m.toFixed(2)}x
                </div>
              </div>
            );
          })}
        </div>

        {gameState === 'busted' && (
          <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in">
            <span className="text-5xl mb-2">💥🚚</span>
            <div className="text-xl font-black text-white">Hit by Traffic!</div>
            <div className="text-xs text-rose-300 mt-1">Better luck next cross</div>
          </div>
        )}

        {gameState === 'cashed' && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in">
            <span className="text-5xl mb-2">🎉🏆</span>
            <div className="text-xl font-black text-amber-300">Successful Crossing!</div>
            <div className="text-sm font-bold text-white mt-1">Won +₹{(betAmount * currentMultiplier).toFixed(2)}</div>
          </div>
        )}
      </div>

      {/* Betting Control Frame */}
      <div className="bg-[#0f291e] border-2 border-emerald-600/60 p-3.5 rounded-2xl space-y-3 shadow-xl z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-200">Bet Amount (₹)</span>
          <div className="flex space-x-1">
            {[20, 50, 100, 500].map((amt) => (
              <button
                key={amt}
                onClick={() => setBetAmount(amt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  betAmount === amt ? 'bg-amber-500 text-rose-950' : 'bg-[#1b4332] text-emerald-200'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
            className="w-9 h-9 rounded-xl bg-[#1b4332] border border-emerald-600/60 flex items-center justify-center text-white font-bold"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 py-2 bg-black/40 border border-emerald-600/40 rounded-xl text-center font-mono font-black text-base text-amber-300">
            ₹{betAmount.toFixed(2)}
          </div>
          <button
            onClick={() => setBetAmount(betAmount + 50)}
            className="w-9 h-9 rounded-xl bg-[#1b4332] border border-emerald-600/60 flex items-center justify-center text-white font-bold"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {gameState === 'idle' || gameState === 'busted' || gameState === 'cashed' ? (
          <button
            onClick={startChickenGame}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 text-rose-950 font-black text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            START CROSSING (BET ₹{betAmount})
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleStepForward}
              className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-rose-950 font-black text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
            >
              <span>🐔 STEP FORWARD</span>
            </button>
            <button
              onClick={() => handleCashOut()}
              className="py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-black text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              CASH OUT (₹{(betAmount * currentMultiplier).toFixed(2)})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
