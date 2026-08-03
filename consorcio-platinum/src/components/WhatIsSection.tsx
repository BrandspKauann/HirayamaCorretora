import { Card, CardContent } from "./ui/card";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const WhatIsSection = () => {
  const { elementRef: statRef, isVisible: statVisible } = useScrollAnimation({
    threshold: 0.05,
    rootMargin: "0px 0px -15% 0px",
    triggerOnce: false,
  });

  return (
    <section id="o-que-e" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">

        {/* Definição Visual */}
        <div className="max-w-5xl mx-auto mb-16 sm:mb-20">
          <AnimatedSection animationType="fade" delay={100}>
            <Card className="bg-gradient-to-br from-trust-blue/10 via-primary/5 to-background border-2 border-trust-blue/20 shadow-premium overflow-hidden">
              <CardContent className="p-8 sm:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-trust-blue to-primary rounded-3xl flex items-center justify-center shadow-lg">
                      <Shield className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                      Proteção para suas vendas a prazo
                    </h3>
                    <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-4">
                      Se um cliente não pagar, a seguradora indeniza
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-3xl sm:text-4xl font-bold text-trust-blue">
                      <span>até 90%</span>
                      <span className="text-muted-foreground text-xl">do valor</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        {/* Comparação Visual: Cobrança sem seguro vs com seguro */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <AnimatedSection animationType="slide-up" delay={200}>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8 sm:mb-12">
              Cobrança sem seguro vs Cobrança com seguro
            </h3>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Cobrança sem seguro */}
            <AnimatedSection animationType="slide-up" delay={300}>
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-2 border-orange-500/30 shadow-card h-full hover:shadow-premium transition-all duration-500">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-bold text-foreground">Cobrança sem seguro</h4>
                      <p className="text-sm text-muted-foreground">Ação reativa</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-muted-foreground">Após o problema acontecer</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-muted-foreground">Sem garantia de recebimento</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-muted-foreground">Tentativa de recuperação</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Cobrança com seguro */}
            <AnimatedSection animationType="slide-up" delay={400}>
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 border-green-500/30 shadow-card h-full hover:shadow-premium transition-all duration-500">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-bold text-foreground">Cobrança com seguro</h4>
                      <p className="text-sm text-muted-foreground">Proteção preventiva</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-muted-foreground">Análise antes da venda</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-muted-foreground">Garantia de recebimento</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-muted-foreground">Indenização automática</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>


        {/* Stat Highlight */}
        <div 
          ref={statRef}
          className={`max-w-4xl mx-auto bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-2xl p-6 sm:p-8 border-l-4 border-red-500 shadow-card scroll-animate-scale ${statVisible ? "visible delay-200" : ""}`}
        >
          <div className="text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-foreground mb-3">
              Segundo dados da Coface:
            </h4>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-red-600">40%</span>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                das empresas no Brasil têm relação direta com inadimplência em suas operações comerciais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsSection;
