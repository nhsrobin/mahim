
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from './types';
import Cake from './components/Cake';
import Modal from './components/Modal';

// Using the locally uploaded sound.mp3 for generic button clicks
const CLICK_SOUND_URL = './sound.mp3';
// Red alert sound for the exposed section
const ALERT_SOUND_URL = 'https://assets.mixkit.co/sfx/preview/mixkit-emergency-alert-alarm-1007.mp3';
// Celebration sound for the cake cutting
const CELEBRATION_SOUND_URL = 'https://assets.mixkit.co/sfx/preview/mixkit-cheering-crowd-loud-602.mp3';

// The images provided for the "Expose" section
const EXPOSE_IMAGES = [
  "image1.png",
  "input_file_1.png"
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('INITIAL');
  const [timeLeft, setTimeLeft] = useState(10);
  const alertAudioRef = useRef<HTMLAudioElement | null>(null);

  // Function to play the custom sound.mp3 for generic clicks
  const playSound = useCallback(() => {
    const audio = new Audio(CLICK_SOUND_URL);
    audio.volume = 0.6;
    audio.play().catch(err => console.debug("Click sound blocked:", err));
  }, []);

  // Function to play celebration sound
  const playCelebration = useCallback(() => {
    const audio = new Audio(CELEBRATION_SOUND_URL);
    audio.volume = 0.5;
    audio.play().catch(err => console.debug("Celebration sound blocked:", err));
  }, []);

  // Effect to handle the red alert sound and shaking state
  useEffect(() => {
    if (appState === 'EXPOSED') {
      if (!alertAudioRef.current) {
        alertAudioRef.current = new Audio(ALERT_SOUND_URL);
        alertAudioRef.current.loop = true;
        alertAudioRef.current.volume = 0.4;
      }
      alertAudioRef.current.play().catch(err => console.debug("Alert sound blocked:", err));
    } else {
      if (alertAudioRef.current) {
        alertAudioRef.current.pause();
        alertAudioRef.current.currentTime = 0;
      }
    }

    return () => {
      if (alertAudioRef.current) {
        alertAudioRef.current.pause();
      }
    };
  }, [appState]);

  const triggerConfetti = useCallback((type: 'celebration' | 'bomb') => {
    if (typeof window.confetti !== 'function') return;

    if (type === 'celebration') {
      window.confetti({
        particleCount: 150,
        spread: 70,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#3b82f6', '#fbbf24']
      });
    } else {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        window.confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        window.confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, []);

  const handleCutCake = () => {
    playCelebration(); // Specific celebration sound for cake
    setAppState('CELEBRATING');
    triggerConfetti('celebration');
    triggerConfetti('bomb');
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (appState === 'CELEBRATING') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setAppState('GIFT_PENDING');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [appState]);

  const handleClaimGift = () => {
    playSound();
    setAppState('PRANK');
  };

  const handleNowClick = () => {
    playSound();
    setAppState('EXPOSED');
    // Smooth scroll to gallery
    setTimeout(() => {
      document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGoNowClick = () => {
    playSound();
  };

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col items-center selection:bg-pink-500/30 transition-colors duration-500 ${appState === 'EXPOSED' ? 'bg-red-950 shake-it' : 'bg-slate-950'}`}>
      
      {/* Header Section */}
      <header className="pt-20 pb-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter glow-text leading-tight">
          Happy 18th Birthday, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500">Mahim!</span>
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-slate-400 uppercase tracking-widest">
          5th February • The Legend Turns 18
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl px-6 flex flex-col items-center justify-start py-10 space-y-16">
        
        {/* Cake Section */}
        <section className="flex flex-col items-center space-y-10">
          <Cake isCut={appState !== 'INITIAL'} />
          
          {appState === 'INITIAL' && (
            <button
              onClick={handleCutCake}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xl font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300"
            >
              Cut the Cake 🎂
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            </button>
          )}

          {appState === 'CELEBRATING' && (
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-500 animate-pulse mb-2">🎉 Party in Progress! 🎉</p>
              <div className="text-4xl font-black bg-slate-800 px-6 py-2 rounded-2xl border border-slate-700">
                00:{timeLeft.toString().padStart(2, '0')}
              </div>
            </div>
          )}
        </section>

        {/* Gift Modal (First Popup) */}
        <Modal isOpen={appState === 'GIFT_PENDING'} title="Special Delivery! 🎈">
          <p className="text-center mb-8">
            Mahim, the wait is over! Your legendary 18th birthday gift is ready for pickup. 
          </p>
          <button
            onClick={handleClaimGift}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-xl shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all"
          >
            Claim Birth Gift 🎁
          </button>
        </Modal>

        {/* Prank Modal (The 18+ Twist) */}
        <Modal isOpen={appState === 'PRANK'} title="Welcome to Adulthood! 🔞">
          <div className="space-y-6">
            <p className="text-center italic text-slate-400">
              "Congratz Mahim! Now that you are 18+, you are officially licensed to visit the 'Adult World'. To keep you safe, here is your Premium VPN access!"
            </p>
            
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2 font-mono text-sm">
              <p><span className="text-blue-400">Service:</span> Proton VPN Premium</p>
              <p><span className="text-blue-400">Email:</span> darkvau@proton.me</p>
              <p><span className="text-blue-400">Pass:</span> #@mdjahidhasan76</p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="https://xnxx.tv"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleGoNowClick}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-center rounded-lg font-semibold transition-all"
              >
                Go Now
              </a>
              <button
                onClick={handleNowClick}
                className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-center rounded-lg font-semibold transition-all shadow-md shadow-pink-900/20"
              >
                Now Click
              </button>
            </div>
          </div>
        </Modal>

        {/* Final Gallery Section */}
        {appState === 'EXPOSED' && (
          <section id="gallery-section" className="w-full animate-in slide-in-from-bottom duration-1000">
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="w-8 h-8 bg-red-600 rounded-full animate-ping"></div>
              <h2 className="text-4xl md:text-5xl font-black text-center text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                SYSTEM BREACH: EXPOSED! 🕵️‍♂️
              </h2>
              <div className="w-8 h-8 bg-red-600 rounded-full animate-ping"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {EXPOSE_IMAGES.map((imgUrl, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl aspect-square bg-slate-800 border-4 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                  <img 
                    src={imgUrl} 
                    alt={`Mahim Memories ${i + 1}`}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-black text-2xl uppercase tracking-tighter bg-black/80 px-4 py-2">LEAKED 🚨</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center py-12">
              <p 
                onClick={playSound}
                className="text-4xl md:text-6xl font-black pulsate text-white cursor-pointer uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,1)] select-none"
              >
                Give Treat Or Mahim'll be Exposed! 🔥
              </p>
              <p className="mt-8 text-slate-400 text-sm font-bold">WARNING: SQUAD IS WATCHING. TREAT IS MANDATORY.</p>
              <p className="mt-2 text-slate-500 text-xs">© 2024 Mahim's Birthday Squad. No Mahims were harmed during the making of this prank.</p>
            </div>
          </section>
        )}
      </main>

      {/* Floating Particles Background (CSS only) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className={`absolute rounded-full blur-xl animate-pulse ${appState === 'EXPOSED' ? 'bg-red-500/10' : 'bg-white/5'}`}
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
