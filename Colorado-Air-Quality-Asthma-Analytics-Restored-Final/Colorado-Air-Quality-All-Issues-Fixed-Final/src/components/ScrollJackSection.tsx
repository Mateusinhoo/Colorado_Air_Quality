import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollJackSectionProps {
  darkMode?: boolean;
}

const ScrollJackSection: React.FC<ScrollJackSectionProps> = ({ darkMode = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lungRef = useRef<HTMLDivElement>(null);
  const moleculeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !lungRef.current || !moleculeRef.current) return;

    // Create scroll-jack timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          updateAnimationProgress(progress);
        }
      }
    });

    // Animation sequence
    tl.to(lungRef.current, {
      scale: 1.5,
      rotation: 10,
      duration: 1,
      ease: "power2.inOut"
    })
    .to(moleculeRef.current, {
      scale: 2,
      rotation: 360,
      x: 100,
      y: -50,
      duration: 1,
      ease: "power2.inOut"
    }, 0.3)
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    }, 0.8)
    .to(lungRef.current, {
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: "power2.inOut"
    }, 1.5)
    .to(moleculeRef.current, {
      scale: 1,
      rotation: 720,
      x: 0,
      y: 0,
      duration: 1,
      ease: "power2.inOut"
    }, 1.5);

    const updateAnimationProgress = (progress: number) => {
      // Create breathing effect based on scroll progress
      const breathingScale = 1 + Math.sin(progress * Math.PI * 4) * 0.05;
      gsap.set(lungRef.current, { scale: breathingScale });

      // Rotate molecules continuously
      const moleculeRotation = progress * 720;
      gsap.set(moleculeRef.current, { rotation: moleculeRotation });
    };

    // Create floating molecules
    createFloatingMolecules();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const createFloatingMolecules = () => {
    const molecules = containerRef.current?.querySelectorAll('.floating-molecule');
    
    molecules?.forEach((molecule, index) => {
      gsap.to(molecule, {
        y: "+=30",
        x: "+=20",
        rotation: "+=180",
        duration: 3 + index,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.5
      });
    });
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden ${
        darkMode ? 'bg-gradient-to-br from-gray-900 to-blue-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`floating-molecule absolute w-2 h-2 rounded-full ${
              i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-red-400' : 'bg-green-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.6
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Lung visualization */}
          <div ref={lungRef} className="relative z-20">
            <svg
              width="300"
              height="300"
              viewBox="0 0 300 300"
              className={`${darkMode ? 'text-white' : 'text-gray-800'}`}
            >
              {/* Lung outline */}
              <path
                d="M150 50 C120 50, 100 70, 100 100 L100 200 C100 230, 120 250, 150 250 C180 250, 200 230, 200 200 L200 100 C200 70, 180 50, 150 50 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="animate-pulse"
              />
              
              {/* Bronchi */}
              <path
                d="M150 80 L130 120 M150 80 L170 120 M130 120 L120 150 M130 120 L140 150 M170 120 L160 150 M170 120 L180 150"
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-70"
              />
              
              {/* Alveoli clusters */}
              {[...Array(12)].map((_, i) => (
                <circle
                  key={i}
                  cx={120 + (i % 4) * 20}
                  cy={160 + Math.floor(i / 4) * 25}
                  r="3"
                  fill="currentColor"
                  className="opacity-50 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </svg>
          </div>

          {/* Molecule visualization */}
          <div ref={moleculeRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
            <svg width="100" height="100" viewBox="0 0 100 100">
              {/* O2 molecule */}
              <circle cx="30" cy="50" r="15" fill="#3b82f6" opacity="0.8" />
              <circle cx="70" cy="50" r="15" fill="#3b82f6" opacity="0.8" />
              <line x1="45" y1="50" x2="55" y2="50" stroke="#1e40af" strokeWidth="3" />
              
              {/* PM2.5 particles */}
              <circle cx="20" cy="20" r="3" fill="#ef4444" opacity="0.9" />
              <circle cx="80" cy="80" r="4" fill="#f97316" opacity="0.9" />
              <circle cx="80" cy="20" r="2" fill="#dc2626" opacity="0.9" />
              <circle cx="20" cy="80" r="3" fill="#ea580c" opacity="0.9" />
              
              {/* Labels */}
              <text x="50" y="35" textAnchor="middle" className="text-xs font-bold fill-blue-600">O₂</text>
              <text x="15" y="15" textAnchor="middle" className="text-xs font-bold fill-red-600">PM2.5</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Text overlay */}
      <div 
        ref={textRef}
        className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center opacity-0 translate-y-10 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        <h2 className="text-4xl font-bold mb-4">The Journey of Air</h2>
        <p className="text-xl max-w-2xl">
          Watch how clean oxygen and harmful pollutants travel through your respiratory system
        </p>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className={`w-64 h-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: '0%' }}
            id="scroll-progress"
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollJackSection;

