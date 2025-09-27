import React, { useState, useCallback, useEffect } from 'react';
import { GameState, IngredientName, Ingredient } from './types';

// --- SVG Ingredient Components ---
const BottomBun: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 30" className={className}><path d="M 5 15 C 5 5, 95 5, 95 15 L 95 25 L 5 25 Z" fill="#D97706" stroke="#8A2C0D" strokeWidth="1"/></svg>
);
const Patty: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 20" className={className}><ellipse cx="50" cy="10" rx="48" ry="8" fill="#5A3A22" stroke="#3D2A1B" strokeWidth="1"/></svg>
);
const Cheese: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 10" className={className}><path d="M 2 5 L 50 8 L 98 5 L 50 2 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.5"/></svg>
);
const Lettuce: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 15" className={className}><path d="M 5 10 C 15 0, 30 2, 40 8 C 50 2, 65 0, 80 5 C 90 2, 95 8, 95 8 L 90 12 C 80 15, 60 12, 50 14 C 40 16, 20 15, 10 12 Z" fill="#84CC16" stroke="#4D7C0F" strokeWidth="0.5"/></svg>
);
const Tomato: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 15" className={className}>
    <ellipse cx="30" cy="7" rx="15" ry="6" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.5"/>
    <ellipse cx="70" cy="7" rx="15" ry="6" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.5"/>
  </svg>
);
const Pickles: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg viewBox="0 0 100 12" className={className}>
      <ellipse cx="25" cy="6" rx="10" ry="4" fill="#22C55E" stroke="#15803D" strokeWidth="0.5"/>
      <ellipse cx="50" cy="6" rx="10" ry="4" fill="#22C55E" stroke="#15803D" strokeWidth="0.5"/>
      <ellipse cx="75" cy="6" rx="10" ry="4" fill="#22C55E" stroke="#15803D" strokeWidth="0.5"/>
    </svg>
);
const TopBun: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 40" className={className}><path d="M 5 30 C 5 5, 95 5, 95 30 Z" fill="#F97316" stroke="#8A2C0D" strokeWidth="1"/>
    <circle cx="30" cy="18" r="1.5" fill="#FDE68A" />
    <circle cx="45" cy="12" r="2" fill="#FDE68A" />
    <circle cx="60" cy="15" r="1.5" fill="#FDE68A" />
    <circle cx="70" cy="22" r="2" fill="#FDE68A" />
  </svg>
);


// --- Ingredient Data ---
const INGREDIENTS: Record<IngredientName, Ingredient> = {
  [IngredientName.BOTTOM_BUN]: { name: IngredientName.BOTTOM_BUN, label: 'Bottom Bun', component: BottomBun, height: 20 },
  [IngredientName.PATTY]: { name: IngredientName.PATTY, label: 'Patty', component: Patty, height: 15 },
  [IngredientName.CHEESE]: { name: IngredientName.CHEESE, label: 'Cheese', component: Cheese, height: 5 },
  [IngredientName.LETTUCE]: { name: IngredientName.LETTUCE, label: 'Lettuce', component: Lettuce, height: 10 },
  [IngredientName.TOMATO]: { name: IngredientName.TOMATO, label: 'Tomato', component: Tomato, height: 10 },
  [IngredientName.PICKLES]: { name: IngredientName.PICKLES, label: 'Pickles', component: Pickles, height: 8 },
  [IngredientName.TOP_BUN]: { name: IngredientName.TOP_BUN, label: 'Top Bun', component: TopBun, height: 25 },
};

const ALL_INGREDIENTS = Object.values(INGREDIENTS);
const FILLER_INGREDIENTS = [IngredientName.PATTY, IngredientName.CHEESE, IngredientName.LETTUCE, IngredientName.TOMATO, IngredientName.PICKLES];


// --- Helper Components ---
const StartScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-white/70 rounded-2xl shadow-2xl backdrop-blur-sm">
    <h1 className="text-6xl md:text-8xl font-display text-amber-600 drop-shadow-lg">Burger Simulator</h1>
    <p className="mt-4 text-xl text-slate-700 max-w-md">The customer is waiting! Can you build the burger of their dreams? Click Start to fire up the grill.</p>
    <button onClick={onStart} className="mt-8 px-10 py-4 bg-green-500 text-white text-2xl font-display rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-transform duration-200">
      Start Game
    </button>
  </div>
);

const ResultScreen: React.FC<{ success: boolean; onPlayAgain: () => void }> = ({ success, onPlayAgain }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-white/70 rounded-2xl shadow-2xl backdrop-blur-sm">
    {success ? (
        <>
            <h2 className="text-7xl font-display text-green-600 drop-shadow-lg">Order Up!</h2>
            <p className="mt-4 text-2xl text-slate-700">Delicious! You made the perfect burger. The customer is thrilled!</p>
        </>
    ) : (
        <>
            <h2 className="text-7xl font-display text-red-600 drop-shadow-lg">Whoops!</h2>
            <p className="mt-4 text-2xl text-slate-700">That's not quite right. Let's give it another try.</p>
        </>
    )}
    <button onClick={onPlayAgain} className="mt-8 px-10 py-4 bg-blue-500 text-white text-2xl font-display rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-transform duration-200">
      Play Again
    </button>
  </div>
);

const OrderDisplay: React.FC<{ order: IngredientName[] }> = ({ order }) => (
  <div className="w-full p-4 bg-white rounded-lg shadow-md border-2 border-slate-200">
    <h3 className="text-xl font-display text-slate-800 text-center border-b-2 pb-2 mb-2">Customer's Order</h3>
    <ul className="space-y-1 text-center">
      {order.map((name, index) => (
        <li key={`${name}-${index}`} className="text-slate-600 font-semibold capitalize">
          {INGREDIENTS[name].label}
        </li>
      ))}
    </ul>
  </div>
);

const BurgerStack: React.FC<{ burger: IngredientName[] }> = ({ burger }) => {
  let accumulatedHeight = 0;
  return (
    <div className="relative w-64 h-96 flex-shrink-0">
      {burger.map((name, index) => {
        const ingredient = INGREDIENTS[name];
        const Component = ingredient.component;
        const bottom = accumulatedHeight;
        accumulatedHeight += ingredient.height * 0.7; // Overlap ingredients slightly
        return (
          <div
            key={`${name}-${index}`}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full transition-all duration-300 ease-out"
            style={{ bottom: `${bottom}px`, zIndex: index }}
          >
            <Component className="w-full h-auto drop-shadow-lg" />
          </div>
        );
      })}
    </div>
  );
};

const IngredientPanel: React.FC<{ onClick: (name: IngredientName) => void }> = ({ onClick }) => (
  <div className="grid grid-cols-2 gap-4">
    {ALL_INGREDIENTS.map(ingredient => (
      <button 
        key={ingredient.name}
        onClick={() => onClick(ingredient.name)}
        className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-yellow-100 border-2 border-slate-200 transition-all duration-200 transform hover:-translate-y-1"
      >
        <ingredient.component className="w-16 h-10"/>
        <span className="mt-2 font-semibold text-slate-700">{ingredient.label}</span>
      </button>
    ))}
  </div>
);


// --- Main App Component ---
const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [order, setOrder] = useState<IngredientName[]>([]);
  const [playerBurger, setPlayerBurger] = useState<IngredientName[]>([]);

  const generateOrder = useCallback(() => {
    const burgerSize = Math.floor(Math.random() * 3) + 2; // 2 to 4 filler ingredients
    const newOrder: IngredientName[] = [IngredientName.BOTTOM_BUN];
    for (let i = 0; i < burgerSize; i++) {
      const randomIndex = Math.floor(Math.random() * FILLER_INGREDIENTS.length);
      newOrder.push(FILLER_INGREDIENTS[randomIndex]);
    }
    newOrder.push(IngredientName.TOP_BUN);
    setOrder(newOrder);
  }, []);

  const startGame = useCallback(() => {
    generateOrder();
    setPlayerBurger([]);
    setGameState(GameState.PLAYING);
  }, [generateOrder]);

  const handleIngredientClick = (name: IngredientName) => {
    setPlayerBurger(prev => [...prev, name]);
  };

  const handleSubmit = () => {
    const isCorrect = order.length === playerBurger.length && order.every((ing, i) => ing === playerBurger[i]);
    setGameState(isCorrect ? GameState.SUCCESS : GameState.FAILURE);
  };
  
  const handleClear = () => {
    setPlayerBurger([]);
  };

  useEffect(() => {
    // Preload SVGs logic can go here if needed, but modern browsers are fast.
  }, []);

  return (
    <div className="min-h-screen bg-amber-100 bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center p-4">
      <main className="w-full max-w-4xl mx-auto">
        {gameState === GameState.START && <StartScreen onStart={startGame} />}
        
        {gameState === GameState.PLAYING && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 items-center p-6 bg-white/60 rounded-2xl shadow-xl backdrop-blur-sm">
            <div className="md:col-span-1 flex flex-col gap-4">
              <OrderDisplay order={order} />
              <div className="flex gap-2">
                 <button onClick={handleClear} className="w-full px-4 py-2 bg-red-500 text-white font-display rounded-lg shadow-md hover:bg-red-600 transition-colors">Clear</button>
                 <button onClick={handleSubmit} className="w-full px-4 py-2 bg-green-500 text-white font-display rounded-lg shadow-md hover:bg-green-600 transition-colors">Submit</button>
              </div>
            </div>
            <div className="md:col-span-1 flex justify-center items-end">
              <BurgerStack burger={playerBurger} />
            </div>
            <div className="md:col-span-1">
              <IngredientPanel onClick={handleIngredientClick} />
            </div>
          </div>
        )}

        {(gameState === GameState.SUCCESS || gameState === GameState.FAILURE) && (
            <ResultScreen success={gameState === GameState.SUCCESS} onPlayAgain={startGame} />
        )}
      </main>
    </div>
  );
};

export default App;
