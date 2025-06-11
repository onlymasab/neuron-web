"use client";
import { useState, useEffect } from 'react';
import { FiHome, FiUsers, FiPieChart, FiDollarSign, FiSettings, FiMenu, FiX } from 'react-icons/fi';

export default function AdminLayout({
  children,
  header
}: Readonly<{
  children: React.ReactNode;
  header?: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rotationAngle, setRotationAngle] = useState(0);

  // Gradient rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Apple-like gradient colors
  const gradientColors = [
    'rgba(255, 179, 186, 0.8)',  // Soft pink
    'rgba(255, 223, 186, 0.8)',  // Peach
    'rgba(255, 255, 186, 0.8)',  // Light yellow
    'rgba(186, 255, 201, 0.8)',  // Mint
    'rgba(186, 225, 255, 0.8)',  // Sky blue
    'rgba(225, 186, 255, 0.8)',  // Lavender
  ];

  // Dynamic gradient background
  const dynamicGradient = {
    background: `linear-gradient(${rotationAngle}deg, 
      ${gradientColors[0]} 0%, 
      ${gradientColors[1]} 20%, 
      ${gradientColors[2]} 40%, 
      ${gradientColors[3]} 60%, 
      ${gradientColors[4]} 80%, 
      ${gradientColors[5]} 100%)`,
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated gradient background with blur */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={dynamicGradient}
      />
      
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-[100px] bg-white/10" />
      
      {/* Main layout */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/20">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mr-4 text-gray-700 hover:text-black transition-colors"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Neuron
            </h1>
          </div>
          
          {header || (
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
            </div>
          )}
        </header>

        {/* Horizontal layout */}
        <div className="flex flex-1 overflow-hidden">
          

          {/* Main content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-8xl mx-auto">
              {/* Floating glass panel */}
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}