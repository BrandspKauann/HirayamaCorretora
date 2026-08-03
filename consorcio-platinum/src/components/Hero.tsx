import { Button } from "./ui/button";
import { ArrowRight, Shield, TrendingUp, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Fundos disponíveis para o Hero
const heroBackground = "/fundo4.png";

const Hero = () => {
  const whatsappLink = "https://wa.link/3gwhbl";
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          setScrollY(Math.max(0, window.scrollY));
        }
      }
    };

    handleScroll(); // Initial call
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    "Atendimento humano",
    "Comparativos reais",
    "Zero dor de cabeça"
  ];

  const parallaxOffset = Math.min(scrollY * 0.3, 200);
  const contentOffset = Math.min(scrollY * 0.15, 100);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[85vh] flex items-center bg-gradient-hero overflow-hidden"
    >
      {/* Background Image with Overlay - Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div 
          style={{ transform: `translateY(${parallaxOffset}px)` }}
          className="absolute inset-0 transition-transform duration-300 ease-out"
        >
          <img 
            src={heroBackground} 
            alt="Consultoria em Vale Refeição" 
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/65 via-primary/60 to-primary/55"></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Content */}
      <div 
        className="container mx-auto px-4 sm:px-4 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 relative z-10"
        style={{ transform: `translateY(${contentOffset}px)` }}
      >
        <div className="max-w-5xl mx-auto text-center sm:text-left">
          {/* Badge - Hidden on mobile */}
          <div className="hidden sm:flex items-center space-x-2 mb-6 sm:mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-secondary/25 rounded-full border border-secondary/30">
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
            <span className="text-secondary font-semibold text-sm sm:text-base bg-secondary/15 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary/20 shadow-md">
              Benefícios corporativos com quem entende do assunto
            </span>
          </div>
          
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-4 sm:mb-4 md:mb-6 lg:mb-8 leading-[1.15] sm:leading-[1.2] tracking-tight px-2 sm:px-0">
            Consultoria em
            <span className="block text-secondary mt-2 sm:mt-2 md:mt-3">Gestão de Pessoas e RH</span>
          </h1>
          
          {/* Slogan */}
          <p className="text-base sm:text-lg md:text-xl text-secondary font-semibold mb-3 sm:mb-4 md:mb-5 italic">
          </p>
          
          {/* Purpose - Clear explanation */}
          <p className="text-sm sm:text-base md:text-lg text-primary-foreground mb-4 sm:mb-4 md:mb-5 max-w-3xl mx-auto sm:mx-0 leading-relaxed font-medium px-2 sm:px-0">
            Transformamos o RH operacional em estratégico. Oferecemos soluções completas em benefícios corporativos, gestão de ponto, vale-transporte e desenvolvimento de pessoas.
          </p>
          
          {/* Brief text - Visible on mobile */}
          <p className="text-sm sm:text-base md:text-lg text-primary-foreground/90 mb-6 sm:mb-4 md:mb-5 max-w-3xl mx-auto sm:mx-0 leading-relaxed px-2 sm:px-0">
            Ajudamos sua empresa a economizar, otimizar processos, reduzir custos e engajar colaboradores com tecnologia e consultoria especializada.
          </p>
          
          {/* CTA Button - Mobile first */}
          <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center sm:justify-start px-2 sm:px-0">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-base sm:text-base md:text-lg px-8 sm:px-8 md:px-10 py-6 sm:py-6 md:py-7 w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white"
              onClick={() => window.open(whatsappLink, '_blank')}
            >
              Falar com um consultor
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          
          {/* Features - Hidden on mobile, shown on larger screens */}
          <div className="hidden sm:flex flex-wrap items-center gap-3 sm:gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 sm:space-x-3 bg-white/20 backdrop-blur-lg rounded-full px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-secondary/40 shadow-lg">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                <span className="text-primary-foreground text-sm sm:text-base font-semibold">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Visible on all devices */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center animate-bounce shadow-lg">
          <div className="w-1.5 h-3 bg-white rounded-full mt-2"></div>
        </div>
        <p className="text-white/80 text-xs sm:text-sm font-medium animate-pulse hidden sm:block">
          Role para ver mais
        </p>
        <p className="text-white/80 text-xs font-medium animate-pulse sm:hidden">
          ↓
        </p>
      </div>

    </section>
  );
};

export default Hero;
