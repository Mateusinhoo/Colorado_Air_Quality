import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollJackSection from './ScrollJackSection';
import { 
  getMobileOptimizedSettings, 
  setMobileOptimizedGSAP, 
  getMobileAnimationPreset,
  addMobileFriendlyHover,
  createPerformantScrollTrigger
} from './MobileOptimizedAnimations';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface AsthmaEducationProps {
  darkMode?: boolean;
  onNavigateToMap?: () => void;
}

const AsthmaEducation: React.FC<AsthmaEducationProps> = ({ darkMode = false, onNavigateToMap }) => {
  const [visibleBoxes, setVisibleBoxes] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lungRef = useRef<HTMLDivElement>(null);
  const airflowRef = useRef<SVGSVGElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !lungRef.current || !airflowRef.current) return;

    // Initialize mobile optimizations
    setMobileOptimizedGSAP();
    const mobileSettings = getMobileOptimizedSettings();

    // Create organic airflow animations with mobile optimization
    const createAirflowAnimations = () => {
      const airflowPaths = airflowRef.current?.querySelectorAll('.airflow-path');
      const pollutantPaths = airflowRef.current?.querySelectorAll('.pollutant-path');
      const particles = particlesRef.current?.querySelectorAll('.particle');

      // Get mobile-optimized animation presets
      const airflowPreset = getMobileAnimationPreset('airflow') as any;
      const pollutantPreset = getMobileAnimationPreset('pollutant') as any;
      const particlePreset = getMobileAnimationPreset('particle') as any;

      // Clean airflow animation (mobile optimized)
      airflowPaths?.forEach((path, index) => {
        gsap.fromTo(path, 
          { 
            strokeDasharray: "0 1000",
            opacity: 0 
          },
          {
            strokeDasharray: "1000 0",
            opacity: airflowPreset.opacity,
            duration: airflowPreset.duration,
            ease: airflowPreset.ease,
            delay: index * 0.3
          }
        );

        // Continuous breathing effect (disabled on mobile for performance)
        if (mobileSettings.enableContinuousAnimations) {
          gsap.to(path, {
            opacity: airflowPreset.opacity * 0.5,
            duration: 3,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 2 + index * 0.3
          });
        }
      });

      // Pollutant paths (mobile optimized)
      pollutantPaths?.forEach((path, index) => {
        gsap.fromTo(path,
          {
            strokeDasharray: "0 800",
            opacity: 0
          },
          {
            strokeDasharray: "800 0",
            opacity: pollutantPreset.opacity,
            duration: pollutantPreset.duration,
            ease: pollutantPreset.ease,
            delay: 0.8 + index * 0.2
          }
        );

        // Chaotic pulsing effect (simplified on mobile)
        if (mobileSettings.enableContinuousAnimations) {
          gsap.to(path, {
            opacity: pollutantPreset.opacity * 0.4,
            strokeWidth: pollutantPreset.strokeWidth,
            duration: 1.5,
            ease: "power2.inOut", // Simplified ease for mobile
            repeat: -1,
            yoyo: true,
            delay: 2.5 + index * 0.2
          });
        }
      });

      // Enhanced particle animations (mobile optimized)
      particles?.forEach((particle, index) => {
        if (index >= mobileSettings.particleCount) return; // Limit particles on mobile
        
        const isCleanAir = index < 3;
        
        gsap.fromTo(particle,
          {
            scale: 0,
            opacity: 0,
            rotation: 0
          },
          {
            scale: (isCleanAir ? 1 : 1.2) * particlePreset.scale,
            opacity: isCleanAir ? 0.6 : 0.8,
            rotation: 360,
            duration: particlePreset.duration,
            ease: particlePreset.ease,
            delay: 1.5 + index * 0.15
          }
        );

        // Continuous floating motion (simplified on mobile)
        if (mobileSettings.enableContinuousAnimations) {
          gsap.to(particle, {
            y: isCleanAir ? "+=10" : "+=15", // Reduced movement on mobile
            x: isCleanAir ? "+=5" : "+=10",
            rotation: isCleanAir ? "+=90" : "+=180", // Reduced rotation on mobile
            duration: isCleanAir ? 3 : 2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 2 + index * 0.2
          });
        }

        // Pulsing glow effect (disabled on mobile for performance)
        if (mobileSettings.enableGlow) {
          gsap.to(particle, {
            boxShadow: isCleanAir 
              ? "0 0 15px rgba(59, 130, 246, 0.4)" 
              : "0 0 20px rgba(239, 68, 68, 0.6)",
            duration: 2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 3 + index * 0.1
          });
        }
      });
    };

    // Enhanced scroll-triggered animations (mobile optimized)
    const createScrollAnimations = () => {
      const boxes = containerRef.current?.querySelectorAll('.info-box');
      const infoBoxPreset = getMobileAnimationPreset('infoBox') as any;
      
      boxes?.forEach((box, index) => {
        gsap.fromTo(box,
          {
            y: infoBoxPreset.y,
            opacity: 0,
            scale: infoBoxPreset.scale[0],
            rotationY: infoBoxPreset.rotationY
          },
          {
            y: 0,
            opacity: 1,
            scale: infoBoxPreset.scale[1],
            rotationY: 0,
            duration: infoBoxPreset.duration,
            ease: infoBoxPreset.ease,
            scrollTrigger: {
              trigger: box,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
              onEnter: () => {
                // Trigger box-specific particle burst (only on desktop)
                if (mobileSettings.enableParticleBurst) {
                  createParticleBurst(box);
                }
              }
            }
          }
        );

        // Add mobile-friendly hover effects
        addMobileFriendlyHover(box);
      });
    };

    // Create particle burst effect (desktop only)
    const createParticleBurst = (box: Element) => {
      if (!mobileSettings.enableParticleBurst) return;
      
      const rect = box.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (!containerRect) return;

      // Create fewer particles for better performance
      for (let i = 0; i < 4; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-blue-400 rounded-full pointer-events-none';
        particle.style.left = `${((rect.left + rect.width / 2 - containerRect.left) / containerRect.width) * 100}%`;
        particle.style.top = `${((rect.top + rect.height / 2 - containerRect.top) / containerRect.height) * 100}%`;
        particle.style.zIndex = '50';
        
        containerRef.current?.appendChild(particle);

        gsap.to(particle, {
          x: (Math.random() - 0.5) * 60, // Reduced range for mobile
          y: (Math.random() - 0.5) * 60,
          opacity: 0,
          scale: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => particle.remove()
        });
      }
    };

    // Lung breathing animation (simplified on mobile)
    const createLungBreathingAnimation = () => {
      if (!lungRef.current || !mobileSettings.enableContinuousAnimations) return;

      gsap.to(lungRef.current, {
        scale: 1.01, // Reduced scale change for mobile
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "center center"
      });
    };

    // Use performant scroll trigger
    createPerformantScrollTrigger(containerRef.current, () => {
      createAirflowAnimations();
      createLungBreathingAnimation();
    });

    createScrollAnimations();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf("*"); // Clean up all animations
    };
  }, []);

  const informationBoxes = [
    {
      id: 1,
      title: "Airways Narrow",
      content: "During an asthma attack, the airways in your lungs become inflamed and narrow, making it difficult to breathe.",
      color: "from-red-400 to-red-600",
      position: "top-left",
      lineColor: "#ef4444"
    },
    {
      id: 2,
      title: "Inflammation",
      content: "Air pollution triggers inflammation in the respiratory system, worsening asthma symptoms and increasing sensitivity.",
      color: "from-orange-400 to-orange-600",
      position: "top-right",
      lineColor: "#f97316"
    },
    {
      id: 3,
      title: "Mucus Production",
      content: "Pollutants cause increased mucus production, further blocking airways and making breathing more difficult.",
      color: "from-yellow-400 to-yellow-600",
      position: "middle-left",
      lineColor: "#eab308"
    },
    {
      id: 4,
      title: "Breathing Difficulty",
      content: "Poor air quality can trigger asthma attacks, leading to wheezing, coughing, and shortness of breath.",
      color: "from-green-400 to-green-600",
      position: "middle-right",
      lineColor: "#22c55e"
    },
    {
      id: 5,
      title: "Environmental Triggers",
      content: "PM2.5 particles and ozone are major asthma triggers that can penetrate deep into the lungs.",
      color: "from-blue-400 to-blue-600",
      position: "bottom-left",
      lineColor: "#3b82f6"
    },
    {
      id: 6,
      title: "Prevention & Treatment",
      content: "Monitoring air quality, using inhalers, and avoiding high pollution days can help manage asthma effectively.",
      color: "from-purple-400 to-purple-600",
      position: "bottom-right",
      lineColor: "#a855f7"
    }
  ];

  const getBoxPosition = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'absolute top-4 left-4';
      case 'top-right':
        return 'absolute top-4 right-4';
      case 'middle-left':
        return 'absolute top-1/2 left-4 transform -translate-y-1/2';
      case 'middle-right':
        return 'absolute top-1/2 right-4 transform -translate-y-1/2';
      case 'bottom-left':
        return 'absolute bottom-4 left-4';
      case 'bottom-right':
        return 'absolute bottom-4 right-4';
      default:
        return 'absolute top-4 left-4';
    }
  };

  const getCurvedLinePath = (position: string) => {
    // Lung center coordinates (percentage of container)
    const lungCenterX = 50;
    const lungCenterY = 50;
    
    // Create curved paths from inside the lungs to the boxes
    switch (position) {
      case 'top-left':
        return `M ${lungCenterX - 8},${lungCenterY - 12} Q ${lungCenterX - 20},${lungCenterY - 25} ${lungCenterX - 35},${lungCenterY - 35} Q 20,20 15,15`;
      case 'top-right':
        return `M ${lungCenterX + 8},${lungCenterY - 12} Q ${lungCenterX + 20},${lungCenterY - 25} ${lungCenterX + 35},${lungCenterY - 35} Q 80,20 85,15`;
      case 'middle-left':
        return `M ${lungCenterX - 12},${lungCenterY} Q ${lungCenterX - 25},${lungCenterY - 5} ${lungCenterX - 35},${lungCenterY} Q 20,${lungCenterY} 15,${lungCenterY}`;
      case 'middle-right':
        return `M ${lungCenterX + 12},${lungCenterY} Q ${lungCenterX + 25},${lungCenterY - 5} ${lungCenterX + 35},${lungCenterY} Q 80,${lungCenterY} 85,${lungCenterY}`;
      case 'bottom-left':
        return `M ${lungCenterX - 8},${lungCenterY + 12} Q ${lungCenterX - 20},${lungCenterY + 25} ${lungCenterX - 35},${lungCenterY + 35} Q 20,80 15,85`;
      case 'bottom-right':
        return `M ${lungCenterX + 8},${lungCenterY + 12} Q ${lungCenterX + 20},${lungCenterY + 25} ${lungCenterX + 35},${lungCenterY + 35} Q 80,80 85,85`;
      default:
        return `M ${lungCenterX},${lungCenterY} Q 30,30 15,15`;
    }
  };

  return (
    <div ref={containerRef} className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} py-16`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Understanding Asthma
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Learn how asthma affects your lungs and how air pollution can trigger symptoms
          </p>
        </div>

        {/* Enhanced Interactive Lung Visualization */}
        <div className="relative w-full max-w-7xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-8 overflow-hidden" style={{ height: '900px' }}>
          
          {/* Animated Airflow and Pollutant SVG */}
          <svg 
            ref={airflowRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            {/* Clean Airflow Paths (Organic, Smooth) */}
            <path 
              className="airflow-path"
              d="M 10,20 Q 30,15 50,25 Q 70,35 90,30"
              stroke="#3b82f6"
              strokeWidth="0.3"
              fill="none"
              opacity="0"
            />
            <path 
              className="airflow-path"
              d="M 15,40 Q 35,35 55,45 Q 75,55 85,50"
              stroke="#06b6d4"
              strokeWidth="0.25"
              fill="none"
              opacity="0"
            />
            <path 
              className="airflow-path"
              d="M 20,60 Q 40,55 60,65 Q 80,75 90,70"
              stroke="#0ea5e9"
              strokeWidth="0.2"
              fill="none"
              opacity="0"
            />

            {/* Pollutant Paths (Chaotic, Jagged) */}
            <path 
              className="pollutant-path"
              d="M 5,25 L 12,22 L 18,28 L 25,24 L 32,30 L 40,26 L 48,32 L 55,28"
              stroke="#ef4444"
              strokeWidth="0.4"
              fill="none"
              opacity="0"
            />
            <path 
              className="pollutant-path"
              d="M 8,45 L 15,42 L 22,48 L 28,44 L 35,50 L 42,46 L 50,52"
              stroke="#f97316"
              strokeWidth="0.35"
              fill="none"
              opacity="0"
            />
            <path 
              className="pollutant-path"
              d="M 12,65 L 19,62 L 26,68 L 33,64 L 40,70 L 47,66 L 55,72"
              stroke="#dc2626"
              strokeWidth="0.3"
              fill="none"
              opacity="0"
            />

            {/* Curved lines to information boxes */}
            {informationBoxes.map((box) => (
              visibleBoxes.includes(box.id) && (
                <path
                  key={`line-${box.id}`}
                  d={getCurvedLinePath(box.position)}
                  stroke={box.lineColor}
                  strokeWidth="0.4"
                  strokeDasharray="3,2"
                  fill="none"
                  className="animate-pulse"
                  style={{
                    filter: darkMode ? 'brightness(1.3) drop-shadow(0 0 2px rgba(255,255,255,0.3))' : 'brightness(0.9) drop-shadow(0 0 2px rgba(0,0,0,0.2))'
                  }}
                />
              )
            ))}
          </svg>

          {/* Floating Particles */}
          <div ref={particlesRef} className="absolute inset-0 pointer-events-none z-15">
            {/* Clean air particles */}
            <div className="particle absolute w-2 h-2 bg-blue-400 rounded-full" style={{ top: '20%', left: '15%' }}></div>
            <div className="particle absolute w-1.5 h-1.5 bg-cyan-400 rounded-full" style={{ top: '35%', left: '25%' }}></div>
            <div className="particle absolute w-2 h-2 bg-sky-400 rounded-full" style={{ top: '50%', left: '20%' }}></div>
            
            {/* Pollutant particles */}
            <div className="particle absolute w-3 h-3 bg-red-500 rounded-full" style={{ top: '25%', left: '10%' }}></div>
            <div className="particle absolute w-2.5 h-2.5 bg-orange-500 rounded-full" style={{ top: '45%', left: '12%' }}></div>
            <div className="particle absolute w-2 h-2 bg-red-600 rounded-full" style={{ top: '65%', left: '15%' }}></div>
          </div>

          {/* Central Lung Figure */}
          <div ref={lungRef} className="absolute inset-0 flex items-center justify-center z-20">
            <div className="relative">
              <img
                src="/person-lungs-outline.png"
                alt="Human figure with lungs highlighted"
                className={`w-[600px] h-[600px] object-contain transition-all duration-300 ${
                  darkMode 
                    ? 'filter brightness-110 contrast-110 drop-shadow-lg' 
                    : 'drop-shadow-lg'
                }`}
                style={{
                  filter: darkMode 
                    ? 'invert(1) brightness(0.9) contrast(1.1) drop-shadow(0 4px 8px rgba(255,255,255,0.1))' 
                    : 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                }}
              />
            </div>
          </div>

          {/* Information Boxes with Enhanced Animation */}
          {informationBoxes.map((box) => (
            <div
              key={box.id}
              className={`info-box ${getBoxPosition(box.position)} w-80 z-30 transition-all duration-700 transform ${
                visibleBoxes.includes(box.id)
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-4 scale-95'
              }`}
            >
              <div className={`
                ${darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white shadow-2xl' 
                  : 'bg-white border-gray-200 text-gray-900 shadow-2xl'
                } 
                rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-3xl
              `}
              style={{
                borderColor: box.lineColor,
                boxShadow: darkMode 
                  ? `0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px ${box.lineColor}40`
                  : `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px ${box.lineColor}40`
              }}
              >
                <div className={`w-full h-3 bg-gradient-to-r ${box.color} rounded-full mb-4`}></div>
                <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {box.title}
                </h3>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {box.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll-Jack Animation Section */}
        <ScrollJackSection darkMode={darkMode} />

        {/* Comprehensive Asthma Information Section */}
        <div className="mt-20 max-w-6xl mx-auto">
          {/* What is Asthma Section */}
          <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'} rounded-2xl p-8 shadow-xl mb-12`}>
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              What is Asthma?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Asthma is a chronic respiratory condition that affects the airways in your lungs. When you have asthma, your airways become inflamed, narrow, and produce extra mucus, making it difficult to breathe.
                </p>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  In Colorado, approximately <strong>8% of adults and 7.2% of children</strong> have asthma, affecting over 400,000 residents statewide.
                </p>
              </div>
              <div className={`${darkMode ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200'} rounded-xl p-6`}>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                  Key Statistics
                </h3>
                <ul className={`space-y-2 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                  <li>• 25 million Americans have asthma</li>
                  <li>• Leading cause of school absences</li>
                  <li>• 3,500+ asthma deaths annually in the US</li>
                  <li>• $82 billion in annual healthcare costs</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Symptoms Section */}
          <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'} rounded-2xl p-8 shadow-xl mb-12`}>
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Asthma Symptoms
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`${darkMode ? 'bg-red-900 border border-red-700' : 'bg-red-50 border border-red-200'} rounded-xl p-6`}>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-red-300' : 'text-red-900'}`}>
                  Common Symptoms
                </h3>
                <ul className={`space-y-2 ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
                  <li>• Shortness of breath</li>
                  <li>• Chest tightness</li>
                  <li>• Wheezing</li>
                  <li>• Persistent cough</li>
                  <li>• Difficulty sleeping</li>
                </ul>
              </div>
              <div className={`${darkMode ? 'bg-orange-900 border border-orange-700' : 'bg-orange-50 border border-orange-200'} rounded-xl p-6`}>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-orange-300' : 'text-orange-900'}`}>
                  Warning Signs
                </h3>
                <ul className={`space-y-2 ${darkMode ? 'text-orange-200' : 'text-orange-800'}`}>
                  <li>• Increased rescue inhaler use</li>
                  <li>• Worsening symptoms</li>
                  <li>• Peak flow readings drop</li>
                  <li>• Symptoms interfere with activities</li>
                  <li>• Nighttime awakening</li>
                </ul>
              </div>
              <div className={`${darkMode ? 'bg-red-900 border border-red-700' : 'bg-red-50 border border-red-200'} rounded-xl p-6`}>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-red-300' : 'text-red-900'}`}>
                  Emergency Signs
                </h3>
                <ul className={`space-y-2 ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
                  <li>• Severe breathing difficulty</li>
                  <li>• Can't speak in full sentences</li>
                  <li>• Blue lips or fingernails</li>
                  <li>• Rescue inhaler not helping</li>
                  <li>• Peak flow below 50%</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Triggers Section */}
          <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'} rounded-2xl p-8 shadow-xl mb-12`}>
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Common Asthma Triggers
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Environmental Triggers
                </h3>
                <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 text-lg">•</span>
                    <strong>Air Pollution:</strong> PM2.5, ozone, vehicle emissions
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 text-lg">•</span>
                    <strong>Allergens:</strong> Pollen, dust mites, pet dander
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2 text-lg">•</span>
                    <strong>Weather:</strong> Cold air, humidity changes
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg">•</span>
                    <strong>Irritants:</strong> Smoke, strong odors, chemicals
                  </li>
                </ul>
              </div>
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Personal Triggers
                </h3>
                <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 text-lg">•</span>
                    <strong>Exercise:</strong> Especially in cold, dry air
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 text-lg">•</span>
                    <strong>Stress:</strong> Emotional stress and anxiety
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2 text-lg">•</span>
                    <strong>Infections:</strong> Respiratory viruses
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2 text-lg">•</span>
                    <strong>Medications:</strong> Aspirin, beta-blockers
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Management Section */}
          <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'} rounded-2xl p-8 shadow-xl mb-12`}>
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Asthma Management
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Daily Management
                </h3>
                <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Take controller medications as prescribed</li>
                  <li>• Monitor symptoms and peak flow</li>
                  <li>• Avoid known triggers</li>
                  <li>• Follow your asthma action plan</li>
                  <li>• Regular check-ups with healthcare provider</li>
                </ul>
              </div>
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Emergency Preparedness
                </h3>
                <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>• Always carry rescue inhaler</li>
                  <li>• Know your emergency action plan</li>
                  <li>• Recognize warning signs</li>
                  <li>• Have emergency contacts ready</li>
                  <li>• Know when to seek immediate help</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsthmaEducation;

