import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AnimatedSectionProps {
  children: ReactNode;
  animationType?: "fade" | "slide-up" | "slide-left" | "slide-right" | "scale" | "default";
  delay?: number;
  className?: string;
}

const AnimatedSection = ({ 
  children, 
  animationType = "slide-up",
  delay = 0,
  className = "" 
}: AnimatedSectionProps) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.05, // Threshold menor para detectar mais cedo
    rootMargin: "0px 0px -15% 0px", // Desaparece quando 15% do elemento sai da viewport (mais rápido)
    triggerOnce: false, // Permite animação reversível - aparece e desaparece conforme scroll
  });

  const getAnimationClass = () => {
    if (animationType === "default") return "scroll-animate";
    return `scroll-animate-${animationType}`;
  };

  const getDelayClass = () => {
    if (delay <= 0) return "";
    const delayMs = Math.min(Math.round(delay / 50) * 50, 300); // Delays menores e mais rápidos
    return `delay-${delayMs}`;
  };

  // Aplicar estilo inline para delay quando necessário - delays reduzidos
  const delayStyle = delay > 0 && delay <= 300 
    ? { transitionDelay: `${delay * 0.6}ms` } // Reduz delay em 40% para mais velocidade
    : {};

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClass()} ${getDelayClass()} ${isVisible ? "visible" : ""} ${className}`}
      style={delayStyle}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;

