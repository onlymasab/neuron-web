import { Progress } from '@/components/ui/progress';
import Lottie from 'lottie-react';
import tickAnimation from '../lotties/tick.json';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Shield, Database, Lock, Globe, Check } from 'lucide-react';
import { useEffect, useState, useCallback, JSX, useRef } from 'react';
import Confetti from 'react-confetti';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, ISourceOptions } from '@tsparticles/engine';

interface ConversionModalProps {
  videoSrc: string; // Now required since you have video
  progressBar?: number;
  showAnimation?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  animationClass?: string;
  estimatedTime?: number;
}

interface ProgressStage {
  stage: string;
  icon: JSX.Element;
  subTask: string;
  description: string;
}

const getProgressStage = (progress: number): ProgressStage => {
  if (progress < 20)
    return {
      stage: 'Initializing Scan',
      icon: <Sparkles className="text-cyan-400" />,
      subTask: 'Scanning nodes',
      description: 'Analyzing your data structure'
    };
  if (progress < 40)
    return {
      stage: 'Validating Data',
      icon: <Database className="text-blue-400" />,
      subTask: 'Verifying integrity',
      description: 'Ensuring data meets standards'
    };
  if (progress < 60)
    return {
      stage: 'Encrypting',
      icon: <Lock className="text-purple-400" />,
      subTask: 'Applying encryption',
      description: 'Securing with AES-256'
    };
  if (progress < 80)
    return {
      stage: 'Storing in Synthis',
      icon: <Shield className="text-teal-400" />,
      subTask: 'Uploading to vault',
      description: 'Distributing globally'
    };
  if (progress < 100)
    return {
      stage: 'Network Sync',
      icon: <Globe className="text-emerald-400" />,
      subTask: 'Linking network',
      description: 'Connecting decentralized nodes'
    };
  return {
    stage: 'Finalizing',
    icon: <Check className="text-green-400" />,
    subTask: 'Completing process',
    description: 'Final checks'
  };
};

const ConversionModal = ({
  videoSrc,
  progressBar: externalProgressBar,
  showAnimation: externalShowAnimation = true,
  onClose,
  onCancel,
  animationClass = '',
  estimatedTime = 60
}: ConversionModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isParticlesLoaded, setIsParticlesLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [internalProgress, setInternalProgress] = useState(0);
  const [showAnimation, setShowAnimation] = useState(externalShowAnimation);
  const [timeRemaining, setTimeRemaining] = useState(estimatedTime);
  const { stage, icon, subTask, description } = getProgressStage(internalProgress);
  const doneButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Respect prefers-reduced-motion
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShowAnimation(false);
    }
  }, []);

  // Simulate progress animation
  useEffect(() => {
    if (!externalShowAnimation || !showAnimation) return;

    const totalDuration = estimatedTime * 1000;
    const startTime = Date.now();
    const endTime = startTime + totalDuration;

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, endTime - now);
      const progress = Math.min((elapsed / totalDuration) * 100, 100);
      
      setInternalProgress(progress);
      setTimeRemaining(Math.ceil(remaining / 1000));

      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setShowAnimation(false);
      }
    };

    requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(updateProgress as any);
  }, [showAnimation, externalShowAnimation, estimatedTime]);

  // Trigger confetti and focus on success
  useEffect(() => {
    if (!showAnimation && internalProgress >= 100) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      doneButtonRef.current?.focus();
      return () => clearTimeout(timer);
    }
  }, [showAnimation, internalProgress]);

  // Particle initialization
  const particlesInit = useCallback(async (engine: Engine) => {
    try {
      await loadSlim(engine);
      setIsParticlesLoaded(true);
    } catch (error) {
      console.error('Failed to initialize particles:', error);
    }
  }, []);

  const particlesOptions: ISourceOptions = {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 800 } },
      color: { value: ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981'] },
      shape: { type: 'circle' },
      opacity: { value: 0.4, random: true },
      size: { value: { min: 1, max: 3 }, random: true },
      move: {
        enable: true,
        speed: { min: 0.5, max: 1.5 },
        direction: 'none',
        random: true,
        outModes: { default: 'out' },
        trail: {
          enable: true,
          length: 10,
          fillColor: '#000000'
        }
      }
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
        onClick: { enable: true, mode: 'push' }
      }
    },
    retina_detect: true
  };

  const progressColor = () => {
    if (internalProgress < 30) return '#06b6d4';
    if (internalProgress < 70) return '#3b82f6';
    if (internalProgress < 90) return '#8b5cf6';
    return '#10b981';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDoneClick = () => {
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="conversion-modal-title"
      aria-modal="true"
    >
      <AnimatePresence>
        {showAnimation ? (
          <motion.div
            key="progress"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative w-full max-w-3xl mx-4 p-6 rounded-2xl bg-gray-800/90 border border-gray-700 shadow-xl overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/80" />
              
              {/* Animated grid pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <pattern
                    id="grid-pattern"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>
              </div>
              
              {/* Particles */}
              {isParticlesLoaded && (
                <Particles
                  id="tsparticles"
                  init={particlesInit}
                  options={particlesOptions}
                  className="absolute inset-0 opacity-20"
                />
              )}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="p-2 rounded-full bg-gray-700/50 backdrop-blur-sm"
                  >
                    {icon}
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-200">{stage}</h2>
                    <p className="text-sm text-gray-400">{subTask}</p>
                  </div>
                </motion.div>
                
                {onCancel && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onCancel}
                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 transition-colors"
                    aria-label="Cancel conversion"
                  >
                    <X size={20} />
                  </motion.button>
                )}
              </div>

              {/* Video Player - Added above progress bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative rounded-lg overflow-hidden bg-black aspect-video"
              >
                <video
                  ref={videoRef}
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  onError={() => setVideoError(true)}
                />
                {videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500">
                    Video unavailable
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900/80 to-transparent" />
              </motion.div>

              {/* Progress bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Progress</span>
                  <span>{internalProgress.toFixed(0)}%</span>
                </div>
                <motion.div
                  initial={{ scaleX: 0.95, opacity: 0.8 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Progress
                    value={internalProgress}
                    className="h-2.5 bg-gray-700/50"
                    indicatorClassName={`bg-gradient-to-r from-${progressColor().replace('#', '')} to-${progressColor().replace('#', '')}/80 transition-all duration-300`}
                  />
                </motion.div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{description}</span>
                  <span>ETA: {formatTime(timeRemaining)}</span>
                </div>
              </div>

              {/* Stage visualization */}
              <div className="relative pt-2">
                <div className="absolute top-0 left-0 h-1 w-full bg-gray-700/50 rounded-full" />
                <div className="flex justify-between relative z-10">
                  {[0, 20, 40, 60, 80, 100].map((point) => (
                    <motion.div
                      key={point}
                      initial={{ scale: 0.8 }}
                      animate={{ 
                        scale: internalProgress >= point ? 1.1 : 0.9,
                        backgroundColor: internalProgress >= point ? progressColor() : 'rgba(55, 65, 81, 0.5)'
                      }}
                      transition={{ type: 'spring', stiffness: 500 }}
                      className={`w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center ${internalProgress >= point ? 'shadow-md' : ''}`}
                    >
                      {internalProgress >= point && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Check size={12} className="text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative w-full max-w-md mx-4 p-8 rounded-2xl bg-gray-800/90 border border-gray-700 shadow-xl overflow-hidden text-center"
          >
            {/* Confetti */}
            {showConfetti && (
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={400}
                colors={['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6']}
                gravity={0.2}
                opacity={0.8}
              />
            )}

            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/80" />
              {isParticlesLoaded && (
                <Particles
                  id="tsparticles-success"
                  init={particlesInit}
                  options={{
                    ...particlesOptions,
                    particles: {
                      ...particlesOptions.particles,
                      number: { value: 60 },
                      move: { speed: { min: 0.8, max: 2 } },
                      color: { value: ['#10b981', '#06b6d4'] }
                    }
                  }}
                  className="absolute inset-0 opacity-30"
                />
              )}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center space-y-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center backdrop-blur-sm">
                  <Lottie
                    animationData={tickAnimation}
                    loop={false}
                    className="w-16 h-16"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <h2 className="text-2xl font-bold text-emerald-400">Conversion Complete!</h2>
                <p className="text-gray-300">
                  Your data is now securely stored in the Synthis Network.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full pt-4"
              >
                <Button
                  ref={doneButtonRef}
                  onClick={handleDoneClick}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Continue
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConversionModal;