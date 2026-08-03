import { Card, CardContent } from "./ui/card";
import { Search, CheckCircle2, ShoppingCart, Shield, ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-trust-blue" />,
      title: "Análise do CNPJ",
      description: "A seguradora analisa o CNPJ do cliente do seu cliente",
      number: 1
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-trust-blue" />,
      title: "Limite aprovado",
      description: "Define um limite de crédito aprovado",
      number: 2
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-trust-blue" />,
      title: "Venda segura",
      description: "Sua empresa vende com segurança",
      number: 3
    },
    {
      icon: <Shield className="h-8 w-8 text-trust-blue" />,
      title: "Proteção garantida",
      description: "Se o cliente não pagar → a seguradora indeniza",
      number: 4
    }
  ];

  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({
    threshold: 0.05,
    rootMargin: "0px 0px -15% 0px",
    triggerOnce: false,
  });

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div 
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 max-w-4xl mx-auto scroll-animate-slide-up ${headerVisible ? "visible" : ""}`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 tracking-tight">
            Como o Seguro de Crédito funciona
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Fluxo simples de operação para proteger suas vendas
          </p>
        </div>

        {/* Fluxo visual */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step, index) => (
              <AnimatedSection 
                key={index}
                animationType="slide-up" 
                delay={index * 100}
                className="h-full"
              >
                <div className="relative h-full">
                  <Card className="bg-card border border-border/50 shadow-card hover:shadow-premium transition-all duration-500 h-full group hover:-translate-y-1">
                    <CardContent className="p-6 sm:p-8 text-center h-full flex flex-col">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-trust-blue/10 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-trust-blue/20 transition-colors">
                          {step.icon}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-md">
                          <span className="text-sm font-bold text-foreground">{step.number}</span>
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-grow">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* Seta conectando os passos */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 z-10">
                      <div className="w-8 h-8 bg-background border-2 border-trust-blue/30 rounded-full flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-trust-blue" />
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

