import { Progress } from '@/components/ui/progress';
import Lottie from 'lottie-react';
import tickAnimation from '../lotties/tick.json';
import usbAnimation from '../lotties/tick.json'; // Add this animation
import completedAnimation from '../lotties/tick.json'; // Add this animation
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Shield, Database, Lock, Check, Cpu, Dna, Network, Download, Usb } from 'lucide-react';
import { useEffect, useState, useCallback, useRef, JSX } from 'react';
import Confetti from 'react-confetti';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, ISourceOptions } from '@tsparticles/engine';

interface ConversionModalProps {
  videoSrc: string;
  progressBar?: number;
  showAnimation?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  conversionType: 'dna' | 'graphene' | 'brain';
  onGenerateUSB?: () => Promise<void>; // Add callback for USB generation
}

interface ProgressStage {
  stage: string;
  icon: JSX.Element;
  subTask: string;
  description: string;
  details: string[];
}

const getProgressStage = (progress: number, type: 'dna' | 'graphene' | 'brain'): ProgressStage => {
  const stages: Record<'dna' | 'graphene' | 'brain', ProgressStage[]> = {
    dna: [
      {
        stage: 'Initializing DNA Scan',
        icon: <Dna className="text-cyan-400 w-6 h-6" />,
        subTask: 'Reading genetic sequence',
        description: 'Analyzing nucleotide patterns and base pairs.',
        details: ['Scanning base pairs', 'Mapping codons', 'Validating helix structure', 'Calibrating sensors'],
      },
      {
        stage: 'Encoding DNA Data',
        icon: <Database className="text-blue-400 w-6 h-6" />,
        subTask: 'Converting to digital format',
        description: 'Encoding genetic information for secure storage.',
        details: ['Compressing sequence data', 'Applying error correction codes', 'Optimizing for Synthis Network'],
      },
      {
        stage: 'Encrypting DNA Sequence',
        icon: <Lock className="text-purple-400 w-6 h-6" />,
        subTask: 'Securing genetic data',
        description: 'Applying quantum-resistant encryption protocols.',
        details: ['Generating AES-256 encryption keys', 'Encrypting nucleotide blocks', 'Verifying data integrity hash'],
      },
      {
        stage: 'Distributing to Synthis',
        icon: <Shield className="text-teal-400 w-6 h-6" />,
        subTask: 'Storing in decentralized vault',
        description: 'Uploading encrypted data to the Synthis Network.',
        details: ['Sharding encrypted data packets', 'Distributing shards to network nodes', 'Verifying shard replication'],
      },
      {
        stage: 'Network Synchronization',
        icon: <Network className="text-emerald-400 w-6 h-6" />,
        subTask: 'Syncing with global nodes',
        description: 'Ensuring data consistency across the network.',
        details: ['Pinging global network nodes', 'Confirming data synchronization', 'Finalizing metadata records'],
      },
      {
        stage: 'Finalizing DNA Conversion',
        icon: <Check className="text-green-500 w-6 h-6" />,
        subTask: 'Completing process',
        description: 'Verifying conversion integrity and archiving.',
        details: ['Running final checksum verification', 'Generating conversion report', 'Securely archiving metadata'],
      },
    ],
    graphene: [
      {
        stage: 'Initializing Graphene Analysis',
        icon: <Sparkles className="text-cyan-400 w-6 h-6" />,
        subTask: 'Scanning lattice structure',
        description: 'Analyzing carbon bonds and material properties.',
        details: ['Mapping hexagonal lattice points', 'Detecting structural defects', 'Measuring layer thickness'],
      },
      {
        stage: 'Processing Graphene Data',
        icon: <Cpu className="text-blue-400 w-6 h-6" />,
        subTask: 'Converting to digital model',
        description: 'Encoding material properties into a digital format.',
        details: ['Simulating electronic conductivity', 'Modeling material strength', 'Optimizing data for Synthis'],
      },
      {
        stage: 'Encrypting Material Data',
        icon: <Lock className="text-purple-400 w-6 h-6" />,
        subTask: 'Securing graphene model',
        description: 'Applying advanced encryption to the material data.',
        details: ['Generating quantum-resistant keys', 'Encrypting lattice data segments', 'Verifying security protocols'],
      },
      {
        stage: 'Storing in Synthis Vault',
        icon: <Shield className="text-teal-400 w-6 h-6" />,
        subTask: 'Uploading to decentralized storage',
        description: 'Distributing encrypted model globally via Synthis.',
        details: ['Sharding material data blocks', 'Replicating across network nodes', 'Ensuring data redundancy'],
      },
      {
        stage: 'Network Propagation',
        icon: <Network className="text-emerald-400 w-6 h-6" />,
        subTask: 'Syncing with Synthis Network',
        description: 'Ensuring global consistency of the stored model.',
        details: ['Broadcasting updates to nodes', 'Verifying network synchronization', 'Updating metadata ledger'],
      },
      {
        stage: 'Finalizing Graphene Conversion',
        icon: <Check className="text-green-500 w-6 h-6" />,
        subTask: 'Completing process',
        description: 'Verifying material data integrity and archiving.',
        details: ['Running validation checks on model', 'Generating final report', 'Archiving conversion data'],
      },
    ],
    brain: [
      {
        stage: 'Initializing Neural Scan',
        icon: <Cpu className="text-cyan-400 w-6 h-6" />,
        subTask: 'Mapping neural signals',
        description: 'Analyzing brain activity and electrical patterns.',
        details: ['Capturing EEG/fMRI data streams', 'Processing raw neural patterns', 'Filtering environmental noise'],
      },
      {
        stage: 'Encoding Neural Data',
        icon: <Database className="text-blue-400 w-6 h-6" />,
        subTask: 'Converting signals to digital',
        description: 'Encoding complex neural patterns into a secure format.',
        details: ['Compressing signal data streams', 'Normalizing input parameters', 'Optimizing for Synthis storage'],
      },
      {
        stage: 'Encrypting Neural Signals',
        icon: <Lock className="text-purple-400 w-6 h-6" />,
        subTask: 'Securing brain data',
        description: 'Applying neural-grade encryption for maximum privacy.',
        details: ['Generating bio-metric secure keys', 'Encrypting signal data packets', 'Ensuring data privacy compliance'],
      },
      {
        stage: 'Storing in Synthis Network',
        icon: <Shield className="text-teal-400 w-6 h-6" />,
        subTask: 'Uploading to secure vault',
        description: 'Distributing encrypted neural data across Synthis.',
        details: ['Sharding neural pattern data', 'Replicating shards globally', 'Verifying secure storage nodes'],
      },
      {
        stage: 'Neural Network Sync',
        icon: <Network className="text-emerald-400 w-6 h-6" />,
        subTask: 'Syncing with global nodes',
        description: 'Ensuring data consistency and accessibility.',
        details: ['Pinging neural network nodes', 'Confirming data synchronization', 'Updating access metadata'],
      },
      {
        stage: 'Finalizing Neural Conversion',
        icon: <Check className="text-green-500 w-6 h-6" />,
        subTask: 'Completing process',
        description: 'Verifying neural data integrity and final archiving.',
        details: ['Running comprehensive validation checks', 'Generating neural conversion report', 'Archiving all data securely'],
      },
    ],
  };

   
  // Fallback stage for invalid type or unexpected progress values
  const fallbackStage: ProgressStage = {
    stage: 'Processing Error',
    icon: <X className="text-red-500 w-6 h-6" />,
    subTask: 'An issue occurred',
    description: 'Invalid conversion type or progress value.',
    details: ['Please check the conversion parameters.', 'Contact support if the issue persists.'],
  };

  // Validate conversion type
  if (!(type in stages)) {
    console.error(`Invalid conversion type: ${type}. Expected 'dna', 'graphene', or 'brain'.`);
    return fallbackStage;
  }

  // Determine current stage based on progress
  // Progress thresholds: 0-19, 20-39, 40-59, 60-79, 80-99, 100
  const stageIndex = Math.floor(progress / 20);
  
  // Ensure stageIndex is within bounds of the specific type's stages array
  const currentStagesForType = stages[type];
  if (stageIndex >= 0 && stageIndex < currentStagesForType.length) {
    return currentStagesForType[stageIndex];
  }
  
  // If progress is 100 or more, return the last stage
  if (progress >= 100) {
    return currentStagesForType[currentStagesForType.length - 1];
  }

  // Fallback if stageIndex is out of expected range (e.g. negative progress)
  console.warn(`Progress value ${progress} resulted in an unexpected stageIndex: ${stageIndex} for type ${type}.`);
  return fallbackStage; 
};

const ConversionModal = ({
  videoSrc,
  progressBar: externalProgressBar,
  showAnimation: externalShowAnimation = true,
  onClose,
  onCancel,
  conversionType,
  onGenerateUSB
}: ConversionModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isParticlesLoaded, setIsParticlesLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [internalProgress, setInternalProgress] = useState(externalProgressBar !== undefined ? externalProgressBar : 0);
  const [showAnimation, setShowAnimation] = useState(externalShowAnimation);
  const [timeRemaining, setTimeRemaining] = useState(240);
  const [usbGenerating, setUsbGenerating] = useState(false);
  const [usbGenerated, setUsbGenerated] = useState(false);
  const [showCompletionSequence, setShowCompletionSequence] = useState(false);

  const { stage, icon, subTask, description, details } = getProgressStage(internalProgress, conversionType);

  const doneButtonRef = useRef<HTMLButtonElement>(null);
  const usbButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeRemainingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ... (keep your existing useEffect hooks) ...

  // Enhanced completion handler
  useEffect(() => {
    if (internalProgress >= 100) {
      setShowAnimation(false);
      
      // Start completion sequence
      setShowCompletionSequence(true);
      
      // Show confetti after a slight delay
      const confettiTimer = setTimeout(() => {
        setShowConfetti(true);
      }, 500);

      // Hide confetti after 5 seconds
      const hideConfettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 6000);

      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(hideConfettiTimer);
      };
    }
  }, [internalProgress]);

  // Handle USB generation
  const handleGenerateUSB = async () => {
    if (!onGenerateUSB) return;
    
    setUsbGenerating(true);
    try {
      await onGenerateUSB();
      setUsbGenerated(true);
      
      // Auto-focus the done button after generation
      setTimeout(() => {
        doneButtonRef.current?.focus();
      }, 300);
    } catch (error) {
      console.error("USB generation failed:", error);
    } finally {
      setUsbGenerating(false);
    }
  };

  
  // Log for debugging conversionType on mount and change
  useEffect(() => {
    console.log('ConversionModal mounted/updated. Type:', conversionType, "Initial Progress:", internalProgress, "Show Animation:", showAnimation);
  }, [conversionType, internalProgress, showAnimation]);

  // Sync internal state with external props
  useEffect(() => {
    setShowAnimation(externalShowAnimation);
  }, [externalShowAnimation]);

  useEffect(() => {
    if (externalProgressBar !== undefined) {
      setInternalProgress(externalProgressBar);
    }
  }, [externalProgressBar]);


  // Respect prefers-reduced-motion: if user prefers reduced motion, disable animations
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      if (mediaQuery.matches) {
        setShowAnimation(false); // Turn off animation if user prefers reduced motion
        // setShowConfetti(false); // Also consider turning off confetti
      } else {
        setShowAnimation(externalShowAnimation); // Re-enable if prop allows
      }
    };
    handleChange(); // Initial check
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [externalShowAnimation]);


  // Progress simulation and time remaining countdown
  useEffect(() => {
    // Clear any existing intervals first
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (timeRemainingIntervalRef.current) clearInterval(timeRemainingIntervalRef.current);

    // Only run if animation is shown and no external progress bar is controlling
    if (showAnimation && externalProgressBar === undefined) {
      const totalDurationMs = 240 * 1000; // 4 minutes in milliseconds
      const updateIntervalMs = 100; // Update progress more frequently for smoother UI
      const increment = (100 / totalDurationMs) * updateIntervalMs;

      setInternalProgress(0); // Reset progress if internally managed
      setTimeRemaining(totalDurationMs / 1000); // Reset time

      progressIntervalRef.current = setInterval(() => {
        setInternalProgress(prev => {
          const newProgress = prev + increment;
          if (newProgress >= 100) {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
           setShowAnimation(false); // This is handled by the completion effect
            return 100;
          }
          return newProgress;
        });
      }, updateIntervalMs);

      timeRemainingIntervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - (updateIntervalMs / 1000);
          if (newTime <= 0) {
            if (timeRemainingIntervalRef.current) clearInterval(timeRemainingIntervalRef.current);
            return 0;
          }
          return newTime;
        });
      }, updateIntervalMs);
    } else if (!showAnimation && externalProgressBar === undefined) {
        // If animation is off and internally managed, set to 100% or initial state
        setInternalProgress(prev => prev < 100 ? 0 : 100); // Or some other logic
        setTimeRemaining(0);
    }


    return () => { // Cleanup intervals on unmount or dependency change
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (timeRemainingIntervalRef.current) clearInterval(timeRemainingIntervalRef.current);
    };
  }, [showAnimation, externalProgressBar]); // Rerun if showAnimation or externalProgressBar presence changes


  // Handle completion effects (confetti, focus)
  useEffect(() => {
    if (internalProgress >= 100) {
      setShowAnimation(false); // Ensure animation stops
      setShowConfetti(true);
      const confettiTimer = setTimeout(() => setShowConfetti(false), 7000); // Confetti for 7 seconds
      
      // Focus the "Done" button for accessibility
      const focusTimer = setTimeout(() => { // Add a slight delay for elements to render
        doneButtonRef.current?.focus();
      }, 100);

      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(focusTimer);
      };
    }
  }, [internalProgress]);





  // Particle system initialization
  const particlesInit = useCallback(async (engine: Engine) => {
    try {
      await loadSlim(engine); // Loads the slim version of tsparticles
      setIsParticlesLoaded(true);
      console.log('Particles initialized successfully');
    } catch (error) {
      console.error('Failed to initialize particles:', error);
      setIsParticlesLoaded(false); // Ensure state reflects failure
    }
  }, []); // Empty dependency array, this function doesn't change

  // Particle system options - memoize for performance
  const particlesOptions: ISourceOptions = {
    fpsLimit: 60, // Cap FPS for performance
    particles: {
      number: { value: 40, density: { enable: true, value_area: 800 } }, // Reduced number
      color: { value: ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'] },
      shape: { type: ['circle', 'triangle'] }, // Simpler shapes
      opacity: { value: {min: 0.3, max: 0.7}, animation: { enable: true, speed: 0.5, minimumValue: 0.1, sync: false } },
      size: { value: { min: 1, max: 3 }, animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false } },
      move: {
        enable: true,
        speed: { min: 0.5, max: 1.5 }, // Slower speed
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' },
        trail: { // Subtle trail effect
          enable: true,
          length: 5,
          fillColor: '#111827', // Dark trail
        },
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' }, // Repulse on hover
        onClick: { enable: true, mode: 'push' }, // Push on click
      },
      modes: {
        repulse: { distance: 80, duration: 0.4 },
        push: { quantity: 2 }, // Push fewer particles
      },
    },
    detectRetina: true, // For high-DPI displays
    background: {
      color: 'transparent', // Make background transparent
    }
  };

  // Dynamically set progress bar color based on percentage
  const progressColor = () => {
    if (internalProgress < 30) return 'bg-cyan-500'; // Tailwind class for cyan
    if (internalProgress < 60) return 'bg-blue-500'; // Tailwind class for blue
    if (internalProgress < 90) return 'bg-purple-500'; // Tailwind class for purple
    return 'bg-green-500'; // Tailwind class for green
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handler for the "Done" button
  const handleDoneClick = () => {
    if (onClose) onClose();
  };

  // Handler for the "Cancel" button
  const handleCancelClick = () => {
    if (onCancel) onCancel();
    else if (onClose) onClose(); // Fallback to onClose if no specific onCancel
  };

  // Video error handler
  const handleVideoError = () => {
    setVideoError(true);
    setVideoLoaded(false); // Ensure loader is not shown if video fails
    console.error("Video loading error for src:", videoSrc);
  }

  // Video loaded data handler
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    setVideoError(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/80 backdrop-blur-md p-4">
      <AnimatePresence mode="wait">
        {showAnimation ? (
          <motion.div
            key="progress-view"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
            className="relative w-full max-w-3xl mx-auto p-6 sm:p-8 rounded-xl bg-gray-800 border border-gray-700 shadow-2xl overflow-hidden"
          >
            {/* Particle Background - only if loaded */}
            {isParticlesLoaded && (
              <Particles
                id="tsparticles-progress"
                init={particlesInit} // Use init prop
                options={particlesOptions}
                className="absolute inset-0 z-0 opacity-20" // Ensure particles are behind content
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-800/30 z-[-1]" />


            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col space-y-6">
              {/* Header with Icon, Title, and Cancel Button */}
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 15, -10, 5, 0, 360] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: Math.random() }}
                    className="p-2.5 rounded-full bg-gray-700/60 backdrop-blur-sm shadow-md"
                  >
                    {icon} {/* Icon from getProgressStage */}
                  </motion.div>
                  <div>
                    <h2 id="conversion-modal-title" className="text-xl sm:text-2xl font-semibold text-gray-100">{stage}</h2>
                    <p className="text-xs sm:text-sm text-gray-400">{subTask}</p>
                  </div>
                </div>
                {onCancel && (
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(75, 85, 99, 0.7)' }} // bg-gray-600/70
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelClick}
                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-100 transition-colors"
                    aria-label="Cancel conversion"
                  >
                    <X size={20} />
                  </motion.button>
                )}
              </div>

              {/* Video Player Section */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="relative rounded-lg overflow-hidden bg-black aspect-video shadow-lg border border-gray-700/50"
              >
                {!videoLoaded && !videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-8 h-8 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-sm">Loading visualization...</p>
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline // Important for iOS
                  className={`w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onError={handleVideoError}
                  onLoadedData={handleVideoLoaded}
                  onCanPlay={() => videoRef.current?.play().catch(e => console.warn("Autoplay prevented:", e))}
                />
                {videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-red-400 p-4 text-center">
                    <X size={24} className="mr-2"/> Unable to load visualization.
                  </div>
                )}
                {/* Subtle gradient overlay at the bottom of the video */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-800/80 via-gray-800/40 to-transparent pointer-events-none" />
              </motion.div>

              {/* Progress Bar and Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline text-sm">
                  <span className="font-medium text-gray-200">Overall Progress</span>
                  <span className="font-mono text-cyan-400 text-lg">{internalProgress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                        className={`h-2.5 rounded-full ${progressColor()}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${internalProgress}%` }}
                        transition={{ duration: 0.3, ease: "linear" }} // Smoother transition for progress
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{description}</span>
                  {externalProgressBar === undefined && <span>ETA: {formatTime(timeRemaining)}</span>}
                </div>
              </div>

              {/* Detailed Sub-tasks */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="bg-gray-700/40 rounded-md p-4 max-h-32 overflow-y-auto custom-scrollbar" // Max height and scroll
              >
                <h3 className="text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">Current Operations:</h3>
                <ul className="space-y-1.5">
                  {details.map((detail, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + index * 0.05, duration: 0.2 }}
                      className="flex items-center space-x-2 text-xs text-gray-300"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                        className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"
                      />
                      <span>{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        ) : showCompletionSequence ? (
          // Enhanced Success View with completion sequence
          <motion.div
            key="success-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'circOut' }}
            className="relative w-full max-w-md mx-auto p-8 sm:p-10 rounded-xl bg-gray-800 border border-green-500/30 shadow-2xl overflow-hidden text-center"
          >
            {/* Confetti Effect */}
            {showConfetti && (
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={400}
                gravity={0.12}
                initialVelocityY={15}
                colors={['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b']}
                opacity={0.9}
                className="!fixed !inset-0 !w-full !h-full z-[110]"
              />
            )}

            {/* Particle Background */}
            {isParticlesLoaded && (
              <Particles
                id="tsparticles-success"
                init={particlesInit}
                options={{
                  ...particlesOptions,
                  particles: {
                    ...particlesOptions.particles,
                    number: { value: 80 },
                    move: { speed: { min: 1, max: 2.5 } },
                    color: { value: ['#10b981', '#34d399', '#06b6d4'] },
                    size: { value: { min: 1, max: 4 } }
                  }
                }}
                className="absolute inset-0 z-0 opacity-25"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-gray-800/40 z-[-1]" />

            {/* Completion Sequence */}
            <div className="relative z-10 flex flex-col items-center space-y-8">
              {/* Initial Checkmark Animation */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="relative"
              >
                <div className="absolute -inset-2 rounded-full bg-green-500/20 animate-pulse" />
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center backdrop-blur-sm p-2">
                  <Lottie
                    animationData={tickAnimation}
                    loop={false}
                    className="w-full h-full"
                  />
                </div>
              </motion.div>

              {/* "Successfully Completed" Animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="w-full max-w-xs"
              >
                <Lottie
                  animationData={completedAnimation}
                  loop={false}
                  className="w-full"
                />
              </motion.div>

              {/* Title and Description */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.3 }}
                className="space-y-3"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-green-400">
                  {conversionType === 'dna'
                    ? 'DNA Secured in Synthis'
                    : conversionType === 'graphene'
                    ? 'Graphene Matrix Stored'
                    : 'Neural Map Archived'}
                </h2>
                <p className="text-gray-300 text-sm sm:text-base">
                  Your {conversionType} data is now protected by quantum encryption and distributed across the Synthis network.
                </p>
              </motion.div>

              {/* USB Generation Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.3 }}
                className="w-full space-y-4"
              >
                {!usbGenerated ? (
                  <Button
                    ref={usbButtonRef}
                    onClick={handleGenerateUSB}
                    disabled={usbGenerating}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out shadow-lg hover:shadow-blue-500/30 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    {usbGenerating ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Download size={18} />
                        <span>Generate Synthis USB</span>
                      </div>
                    )}
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center space-y-3 p-4 bg-gray-700/40 rounded-lg border border-green-500/30"
                  >
                    <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full">
                      <Lottie
                        animationData={usbAnimation}
                        loop={false}
                        className="w-12 h-12"
                      />
                    </div>
                    <p className="text-green-400 font-medium">USB Ready for Download</p>
                    <p className="text-xs text-gray-400">Your Synthis drive contains encrypted {conversionType} data</p>
                  </motion.div>
                )}

                <Button
                  ref={doneButtonRef}
                  onClick={handleDoneClick}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out shadow-lg hover:shadow-gray-500/20 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  {usbGenerated ? 'Continue to Dashboard' : 'View in Synthis'}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ConversionModal;















