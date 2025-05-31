import { Progress } from '@/components/ui/progress';
import Lottie from 'lottie-react';
import tickAnimation from '../lotties/tick.json';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Shield, Database, Lock, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';
import { Engine } from 'tsparticles-engine';

interface ConversionModalProps {
  videoSrc?: string; // Optional video source for background
  progressBar: number; // 0–100
  showAnimation?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  animationClass?: string;
}

const getProgressStage = (progress: number) => {
  if (progress < 20)
    return {
      stage: 'Initializing Scan...',
      icon: <Sparkles size={20} />,
      subProgress: progress * 5,
      subTask: 'Scanning nodes',
    };
  if (progress < 40)
    return {
      stage: 'Validating Data...',
      icon: <Database size={20} />,
      subProgress: (progress - 20) * 5,
      subTask: 'Verifying integrity',
    };
  if (progress < 60)
    return {
      stage: 'Encrypting & Securing...',
      icon: <Lock size={20} />,
      subProgress: (progress - 40) * 5,
      subTask: 'Applying quantum encryption',
    };
  if (progress < 80)
    return {
      stage: 'Storing in Synthis...',
      icon: <Shield size={20} />,
      subProgress: (progress - 60) * 5,
      subTask: 'Uploading to secure vault',
    };
  if (progress < 100)
    return {
      stage: 'Connecting to Synthis Network...',
      icon: <Globe size={20} />,
      subProgress: (progress - 80) * 5,
      subTask: 'Establishing network link',
    };
  return {
    stage: 'Finalizing...',
    icon: <Sparkles size={20} />,
    subProgress: 100,
    subTask: 'Completing process',
  };
};

const ConversionModal = ({
  videoSrc,
  progressBar,
  showAnimation = true,
  onClose,
  onCancel,
  animationClass = '',
}: ConversionModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { stage, icon, subProgress, subTask } = getProgressStage(progressBar);

  // Trigger confetti when progress reaches 100
  useEffect(() => {
    if (progressBar === 100 && !showAnimation) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [progressBar, showAnimation]);

  const progressColor = progressBar < 50 ? '#06b6d4' : progressBar < 90 ? '#c084fc' : '#10b981';

  // Particle initialization
  const particlesInit = async (engine: Engine) => {
    await loadFull(engine);
  };

  const particlesOptions = {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: ['#06b6d4', '#c084fc', '#10b981', '#f472b6'] },
      shape: { type: ['circle', 'triangle'], polygon: { nb_sides: 6 } },
      opacity: { value: 0.6, random: true },
      size: { value: 2.5, random: true },
      move: {
        enable: true,
        speed: 1.5,
        direction: 'none',
        random: true,
        out_mode: 'bounce',
      },
      line_linked: {
        enable: true,
        distance: 100,
        color: '#06b6d4',
        opacity: 0.3,
        width: 1,
      },
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: false } },
    },
    retina_detect: true,
  };

  const handleDoneClick = () => {
    console.log('Done button clicked, triggering onClose');
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-lg transition-all duration-500"
      role="dialog"
      aria-labelledby="conversion-modal-title"
      aria-modal="true"
      style={{ fontFamily: "'Orbitron', sans-serif" }}
    >
      <AnimatePresence>
        {showAnimation ? (
          <motion.div
            key="progress"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-[720px] h-[720px] max-w-[90vw] max-h-[90vh] p-6 sm:p-10 rounded-3xl bg-white/90 shadow-[0_0_30px_rgba(0,255,255,0.2)] overflow-hidden"
          >
            {/* Background Video or Fallback Animation */}
            {videoSrc ? (
              <video
                preload="auto"
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/50 to-magenta-200/50 opacity-40 animate-pulse" />
            )}

            {/* Circuit Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L0 20v40l40 20 40-20V20L40 0z' fill='%2306b6d4' fill-opacity='0.3'/%3E%3Cpath d='M40 10L10 25v30l30 15 30-15V25L40 10z' fill='none' stroke='%23c084fc' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '80px 80px',
              }}
            />

            {/* Data Stream Animation */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute w-full h-1 bg-cyan-400/50 animate-data-stream" />
              <div className="absolute w-full h-1 bg-purple-400/50 animate-data-stream-delayed" style={{ top: '50%' }} />
            </div>

            {/* Particles */}
            <Particles
              id="tsparticles"
              init={particlesInit}
              options={particlesOptions}
              className="absolute inset-0 z-0"
            />

            {/* Double Gradient Border */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div
                className="absolute inset-[-3px] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient-border"
                style={{ animation: 'gradient-border 2s linear infinite' }}
              />
              <div
                className="absolute inset-[-1px] bg-gradient-to-r from-cyan-300/50 via-purple-300/50 to-pink-300/50 animate-gradient-border-reverse"
                style={{ animation: 'gradient-border-reverse 2s linear infinite' }}
              />
            </div>

            {/* Cancel Button */}
            {onCancel && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-gray-600 hover:text-cyan-400 focus:ring-2 focus:ring-cyan-400 bg-white/70 rounded-full shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                onClick={onCancel}
                aria-label="Cancel conversion"
              >
                <X size={20} />
              </Button>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
              <motion.div
                className="flex items-center gap-3 mb-6"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-cyan-400" aria-hidden="true">{icon}</span>
                <span className="text-cyan-400 text-lg font-medium tracking-wide">
                  Stage {Math.floor(progressBar / 20) + 1}/5
                </span>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.h2
                  key={stage}
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  id="conversion-modal-title"
                  className={`text-2xl sm:text-3xl font-bold text-gray-800 mb-4 tracking-wide text-shadow-[0_0_5px_rgba(0,255,255,0.5)] ${animationClass}`}
                >
                  {stage}
                </motion.h2>
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-600 mb-6 flex items-center gap-2"
                title={`Sub-task: ${subTask}`}
                aria-label={`Sub-task: ${subTask}, ${subProgress.toFixed(0)}% complete`}
              >
                <span>{subTask}</span>
                <span className="text-cyan-500 font-medium">{subProgress.toFixed(0)}%</span>
              </motion.div>

              <div className="w-full max-w-[80%] sm:max-w-[450px] relative">
                {/* Circular Progress Ring */}
                <svg className="absolute -top-5 -left-5 w-16 h-16">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke={progressColor}
                    strokeWidth="4"
                    strokeDasharray="175.92"
                    strokeDashoffset={175.92 * (1 - subProgress / 100)}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 175.92 }}
                    animate={{ strokeDashoffset: 175.92 * (1 - subProgress / 100) }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>

                {/* Main Progress Bar */}
                <Progress
                  value={progressBar}
                  className="h-5 bg-gray-200/40 rounded-full overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]"
                  indicatorClassName={`transition-all duration-500 ${progressColor} shadow-[0_0_15px_${progressColor},0_0_25px_${progressColor}] animate-pulse`}
                />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900 tracking-wide"
                >
                  {progressBar}%
                </motion.span>

                {/* Sub-Progress Bar */}
                <Progress
                  value={subProgress}
                  className="h-2 bg-gray-300/50 rounded-full mt-2"
                  indicatorClassName={`transition-all duration-500 ${progressColor} opacity-70`}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-[720px] h-[720px] max-w-[90vw] max-h-[90vh] p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-gray-900/95 to-black/95 border border-green-700/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] backdrop-blur-sm overflow-hidden"
          >
            {/* Particles */}
            <Particles
              id="tsparticles-success"
              init={particlesInit}
              options={{
                ...particlesOptions,
                particles: { ...particlesOptions.particles, number: { value: 40 }, line_linked: { enable: false } },
              }}
              className="absolute inset-0 z-0"
            />

            {/* Circuit Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L0 20v40l40 20 40-20V20L40 0z' fill='%2310b981' fill-opacity='0.3'/%3E%3Cpath d='M40 10L10 25v30l30 15 30-15V25L40 10z' fill='none' stroke='%23c084fc' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '80px 80px',
              }}
            />

            {showConfetti && (
              <Confetti
                width={window.innerWidth}
                height={720}
                recycle={false}
                numberOfPieces={200}
                tweenDuration={8000}
                colors={['#10b981', '#06b6d4', '#c084fc', '#f472b6']}
              />
            )}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 1, ease: 0.2 }}
            >
              <Lottie
                animationData={tickAnimation}
                loop={false}
                autoplay
                className="w-[min(20vw,160px)] h-[min(20vw,160px)] mx-auto mt-10 sm:mt-14"
              />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-400 mt-6 text-center tracking-wide text-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
              Data Ready!
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mt-4 mb-8 text-center px-4">
              Your conversion is complete. Synthis system is now connected, and data is securely stored.
            </p>
            <Button
              variant="secondary"
              className="w-full py-3 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-lg transition-all focus:ring-2 focus:ring-green-400 shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)] animate-pulse"
              onClick={handleDoneClick}
              aria-label="Close modal and continue"
            >
              Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

        @keyframes gradient-border {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes gradient-border-reverse {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes data-stream {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes data-stream-delayed {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-gradient-border {
          filter: blur(3px);
        }
        .animate-gradient-border-reverse {
          filter: blur(2px);
        }
        .animate-data-stream {
          animation: data-stream 3s linear infinite;
        }
        .animate-data-stream-delayed {
          animation: data-stream-delayed 3s linear infinite 1.5s;
        }
        .font-sans {
          font-family: 'Orbitron', sans-serif;
        }
        .text-shadow-[0_0_5px_rgba(0,255,255,0.5)] {
          text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
        }
        .text-shadow-[0_0_5px_rgba(16,185,129,0.5)] {
          text-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ConversionModal;