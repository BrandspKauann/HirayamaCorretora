import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, Home, TrendingUp } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { SimulacaoConsorcioModal } from "@/components/SimulacaoConsorcioModal";

const ConsorcioHero = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* Background image with green overlay */}
      <div className="absolute inset-0">
        <img
          src="/consorcio/imagens/fundo_consorcio.jpg"
          alt="Clientes comemorando conquistas com consórcio"
          className="w-full h-full object-cover"
          style={{ opacity: 0.45 }}
          loading="lazy"
        />
      </div>
      {/* Green overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-primary/80" />
      
      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-[url('/consorcio/grid.svg')] opacity-5" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative z-10">
        <AnimatedSection animationType="slide-up">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex flex-col items-end mx-auto mb-4 sm:mb-5 leading-none">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-none whitespace-nowrap">
                <span className="font-light">Consórcio </span>
                <span className="font-bold">Platinum</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/80 tracking-wide -mt-1 sm:-mt-1.5">
                By Hirayama
              </p>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium mb-6 sm:mb-8 max-w-2xl mx-auto">
              Estratégia inteligente para construir patrimônio sem depender de financiamento tradicional.
            </p>

            {/* CTA - Mobile first: botão grande */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="w-full sm:w-auto min-h-[56px] sm:min-h-[60px] text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-white text-primary hover:bg-white/95 font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                onClick={() => setShowModal(true)}
              >
                Simular consórcio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Ícones ilustrativos */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-10 sm:mt-12 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Home className="h-5 w-5" />
                </div>
                <span className="text-sm sm:text-base">Imóveis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Car className="h-5 w-5" />
                </div>
                <span className="text-sm sm:text-base">Automóveis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-sm sm:text-base">Investimentos</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <SimulacaoConsorcioModal open={showModal} onOpenChange={setShowModal} />

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center animate-bounce">
          <div className="w-1.5 h-3 bg-white/80 rounded-full mt-2" />
        </div>
        <span className="text-white/70 text-xs sm:hidden">↓</span>
      </div>
    </section>
  );
};

export default ConsorcioHero;
