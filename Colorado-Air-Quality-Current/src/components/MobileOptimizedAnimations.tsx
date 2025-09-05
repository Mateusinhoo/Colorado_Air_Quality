import { gsap } from 'gsap';

// Mobile detection utility
export const isMobile = (): boolean => {
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Performance optimization for mobile
export const getMobileOptimizedSettings = () => {
  const mobile = isMobile();
  
  return {
    // Reduce animation complexity on mobile
    particleCount: mobile ? 6 : 12,
    animationDuration: mobile ? 1.5 : 2.5,
    easeType: mobile ? "power2.out" : "back.out(1.7)",
    
    // Disable heavy effects on mobile
    enableGlow: !mobile,
    enableParticleBurst: !mobile,
    enableContinuousAnimations: !mobile,
    
    // Simplified paths for mobile
    pathComplexity: mobile ? 'simple' : 'complex',
    
    // Reduced frame rate for mobile
    refreshRate: mobile ? 30 : 60
  };
};

// Optimized GSAP settings for mobile
export const setMobileOptimizedGSAP = () => {
  if (isMobile()) {
    // Reduce GSAP's ticker frame rate on mobile
    gsap.ticker.fps(30);
    
    // Use will-change CSS property for better mobile performance
    gsap.set("*", { willChange: "auto" });
  }
};

// Simplified animation presets for mobile
export const getMobileAnimationPreset = (animationType: string) => {
  const mobile = isMobile();
  
  const presets = {
    airflow: {
      duration: mobile ? 1.5 : 2.5,
      ease: mobile ? "power2.inOut" : "power2.inOut",
      opacity: mobile ? 0.6 : 0.8,
      strokeWidth: mobile ? "0.2" : "0.3"
    },
    
    pollutant: {
      duration: mobile ? 1.2 : 1.8,
      ease: mobile ? "power2.out" : "power3.out",
      opacity: mobile ? 0.7 : 0.9,
      strokeWidth: mobile ? "0.3" : "0.4"
    },
    
    particle: {
      duration: mobile ? 0.8 : 1.2,
      ease: mobile ? "power2.out" : "back.out(1.7)",
      scale: mobile ? 0.8 : 1,
      enableGlow: !mobile,
      opacity: mobile ? 0.6 : 0.8
    },
    
    infoBox: {
      duration: mobile ? 0.6 : 1.2,
      ease: mobile ? "power2.out" : "back.out(1.7)",
      y: mobile ? 30 : 80,
      scale: mobile ? [0.9, 1] : [0.7, 1],
      rotationY: mobile ? 0 : 15,
      opacity: 1
    }
  };
  
  return presets[animationType as keyof typeof presets] || presets.airflow;
};

// Touch-friendly hover effects for mobile
export const addMobileFriendlyHover = (element: Element) => {
  if (isMobile()) {
    // Use touch events instead of hover on mobile
    element.addEventListener('touchstart', () => {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out"
      });
    });
    
    element.addEventListener('touchend', () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    });
  } else {
    // Standard hover for desktop
    element.addEventListener('mouseenter', () => {
      gsap.to(element, {
        scale: 1.08,
        y: -5,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  }
};

// Intersection Observer for performance
export const createPerformantScrollTrigger = (element: Element, callback: () => void) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );
    
    observer.observe(element);
    return observer;
  } else {
    // Fallback for older browsers
    callback();
    return null;
  }
};

// Memory cleanup utility
export const cleanupAnimations = (elements: Element[]) => {
  elements.forEach(element => {
    gsap.killTweensOf(element);
  });
  
  // Clear any remaining timers
  gsap.globalTimeline.clear();
};

