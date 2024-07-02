import React, { useState, useEffect } from 'react';
import './App.css';
import { binanceLogo, dailyCipher, dailyCombo, dailyReward, tonlingoCoin, hamsterCoin } from './images';
import Info from './icons/Info';
import Settings from './icons/Settings';
import Mine from './icons/Mine';
import Friends from './icons/Friends';
import Coins from './icons/Coins';

const App: React.FC = () => {
  const levelNames = [
    "Bronze",    // From 0 to 4999 coins
    "Silver",    // From 5000 coins to 24,999 coins
    "Gold",      // From 25,000 coins to 99,999 coins
    "Platinum",  // From 100,000 coins to 999,999 coins
    "Diamond",   // From 1,000,000 coins to 2,000,000 coins
    "Epic",      // From 2,000,000 coins to 10,000,000 coins
    "Legendary", // From 10,000,000 coins to 50,000,000 coins
    "Master",    // From 50,000,000 coins to 100,000,000 coins
    "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
    "Lord"       // From 1,000,000,000 coins to ∞
  ];

  const levelMinPoints = [
    0,        // Bronze
    5000,     // Silver
    25000,    // Gold
    100000,   // Platinum
    1000000,  // Diamond
    2000000,  // Epic
    10000000, // Legendary
    50000000, // Master
    100000000,// GrandMaster
    1000000000// Lord
  ];

  const [levelIndex, setLevelIndex] = useState(6);
  const [points, setPoints] = useState(22749365);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 100;
  const profitPerHour = 126420;

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const questions = [
    { question: "अर्थ 'संगीत' का क्या है?", correctAnswer: "A. Music", options: ["A. Music", "B. Dance", "C. Painting", "D. Drama"] },
    { question: "अर्थ 'साहसी' का क्या है?", correctAnswer: "C. Courageous", options: ["A. Lazy", "B. Weak", "C. Courageous", "D. Cowardly"] },
    { question: "अर्थ 'प्रकाश' का क्या है?", correctAnswer: "D. Light", options: ["A. Darkness", "B. Night", "C. Shadow", "D. Light"] },
    { question: "अर्थ 'मित्र' का क्या है?", correctAnswer: "B. Friend", options: ["A. Enemy", "B. Friend", "C. Stranger", "D. Neighbor"] },
    { question: "अर्थ 'कला' का क्या है?", correctAnswer: "C. Art", options: ["A. Science", "B. History", "C. Art", "D. Literature"] },
    { question: "अर्थ 'आशावादी' का क्या है?", correctAnswer: "A. Optimistic", options: ["A. Optimistic", "B. Pessimistic", "C. Neutral", "D. Doubtful"] },
    { question: "अर्थ 'संवाद' का क्या है?", correctAnswer: "B. Dialogue", options: ["A. Monologue", "B. Dialogue", "C. Lecture", "D. Speech"] },
    { question: "अर्थ 'विचार' का क्या है?", correctAnswer: "D. Thought", options: ["A. Dream", "B. Idea", "C. Memory", "D. Thought"] },
    { question: "अर्थ 'शांति' का क्या है?", correctAnswer: "A. Peace", options: ["A. Peace", "B. War", "C. Conflict", "D. Chaos"] },
    { question: "अर्थ 'संपूर्ण' का क्या है?", correctAnswer: "B. Complete", options: ["A. Partial", "B. Complete", "C. Incomplete", "D. Fragmented"] },
    { question: "अर्थ 'समर्पण' का क्या है?", correctAnswer: "C. Surrender", options: ["A. Fight", "B. Resist", "C. Surrender", "D. Attack"] }
]; 

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
  
    // Check if the selected answer is correct
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setMessage("Correct!");
      setPoints(points + pointsToAdd);
    } else {
      setMessage("Wrong answer");
    }
  
    // Delay before navigating to the next question (adjust as needed)
    setTimeout(() => {
      setSelectedAnswer(null);
      setMessage(null);
      setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
    }, 300); // Adjust the delay (in milliseconds) for swifter navigation
  };

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              {/* Removed Hamster Icon */}
            </div>
            <div>
              <p className="text-sm"> Nakshatra (CEO)</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="pt-1">
              <p className="text-gray-400 text-xs">
                Level {levelIndex + 1}: {levelNames[levelIndex]}
              </p>
              <div className="relative bg-gray-600 h-2 rounded-lg w-44">
                <div className="absolute top-0 left-0 bg-[#ffbf00] h-2 rounded-lg" style={{ width: `${calculateProgress()}%` }}></div>
              </div>
            </div>
            <div className="flex space-x-1 items-center">
              <Info className="w-8 h-8" />
              <Settings className="w-8 h-8" />
            </div>
          </div>
          <div className="pt-2">
            <p className="text-sm text-gray-400">
              <span className="text-green-500">{formatProfitPerHour(profitPerHour)}</span> coins per hour
            </p>
          </div>
        </div>
        <div className="bg-[#1d2025] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="px-4 mt-6 flex justify-between gap-2">
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <img src={dailyReward} alt="Daily Reward" className="mx-auto w-12 h-12" />
                <p className="text-[10px] text-center text-white mt-1">Daily reward</p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyRewardTimeLeft}</p>
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <img src={dailyCipher} alt="Daily Cipher" className="mx-auto w-12 h-12" />
                <p className="text-[10px] text-center text-white mt-1">Daily cipher</p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyCipherTimeLeft}</p>
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                <div className="dot"></div>
                <img src={dailyCombo} alt="Daily Combo" className="mx-auto w-12 h-12" />
                <p className="text-[10px] text-center text-white mt-1">Daily combo</p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyComboTimeLeft}</p>
              </div>
            </div>

            <div className="px-4 mt-4 flex justify-center">
              <div className="px-4 py-2 flex items-center space-x-2">
                <img src={tonlingoCoin} alt="TonLingo Coin" className="w-10 h-10" />
                <p className="text-4xl text-white">{points.toLocaleString()}</p>
              </div>
            </div>

            <div className="px-4 mt-4 flex justify-center">
              {/* New Question and Options Box */}
              <div className="bg-[#272a2f] rounded-lg p-4 w-full max-w-sm">
                <p className="text-white text-center font-bold mb-4">{questions[currentQuestionIndex].question}</p>
                <div className="space-y-2">
                  {questions[currentQuestionIndex].options.map((option) => (
                    <button
                      key={option}
                      className={`w-full py-2 ${selectedAnswer === option ? "bg-[#1c1f24]" : "bg-[#272a2f]"} text-white rounded-lg`}
                      onClick={() => handleAnswerClick(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {message && <p className="text-white text-center mt-4">{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fixed div */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
        <div className="text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl">
          <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Exchange</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <Mine className="w-8 h-8 mx-auto" />
          <p className="mt-1">Mine</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <Friends className="w-8 h-8 mx-auto" />
          <p className="mt-1">Friends</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <Coins className="w-8 h-8 mx-auto" />
          <p className="mt-1">Earn</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5">
          <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Airdrop</p>
        </div>
      </div>

      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
          style={{
            top: `${click.y - 42}px`,
            left: `${click.x - 28}px`,
            animation: `float 1s ease-out`
          }}
          onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          {pointsToAdd}
        </div>
      ))}
    </div>
  );
};

export default App;
