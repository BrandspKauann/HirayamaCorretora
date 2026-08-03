import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.05, // Threshold menor para detecção mais rápida
    rootMargin = "0px 0px -20% 0px", // Elemento desaparece quando 20% sai da viewport (mais responsivo)
    triggerOnce = false, // Mudado para false para permitir animação reversível
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Quando entra na viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else {
          // Quando sai da viewport - animação reversível
          if (!triggerOnce) {
            setIsVisible(false);
          }
        }
      },
      {
        threshold: threshold,
        rootMargin: rootMargin,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { elementRef, isVisible };
};

export default useScrollAnimation;

