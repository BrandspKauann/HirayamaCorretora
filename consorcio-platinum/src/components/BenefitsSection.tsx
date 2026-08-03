import { Card, CardContent } from "./ui/card";
import { Shield, TrendingUp, BarChart3, Users, Clock, Target, Zap, FileCheck, CheckCircle2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Shield className="h-6 w-6 text-trust-blue" />,
      title: "Proteção contra inadimplência",
      description: "Garante o recebimento mesmo se o cliente não pagar"
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-trust-blue" />,
      title: "Garantia de pagamento",
      description: "Até 90% do valor é indenizado pela seguradora"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-trust-blue" />,
      title: "Crescimento seguro das vendas",
      description: "Amplie suas vendas com segurança e confiança"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-trust-blue" />,
      title: "Redução de risco comercial",
      description: "Diminua significativamente os riscos nas operações"
    },
    {
      icon: <FileCheck className="h-6 w-6 text-trust-blue" />,
      title: "Acesso a análises de crédito profissionais",
      description: "Análises especializadas da Coface para seus clientes"
    },
    {
      icon: <Clock className="h-6 w-6 text-trust-blue" />,
      title: "Mais capacidade de oferecer prazos maiores",
      description: "Negocie prazos estendidos com segurança"
    },
    {
      icon: <Target className="h-6 w-6 text-trust-blue" />,
      title: "Mais competitividade no mercado",
      description: "Diferencie-se oferecendo condições mais atrativas"
    },
    {
      icon: <Zap className="h-6 w-6 text-trust-blue" />,
      title: "Previsibilidade financeira",
      description: "Planeje melhor com fluxo de caixa previsível"
    },
    {
      icon: <Users className="h-6 w-6 text-trust-blue" />,
      title: "Apoio ao time comercial",
      description: "Dê mais segurança e ferramentas para sua equipe"
    }
  ];

  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({
    threshold: 0.05,
    rootMargin: "0px 0px -15% 0px",
    triggerOnce: false,
  });

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div 
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 max-w-4xl mx-auto scroll-animate-slide-up ${headerVisible ? "visible" : ""}`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 tracking-tight">
            Benefícios
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Os principais benefícios do Seguro de Crédito para sua empresa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => (
            <AnimatedSection 
              key={index}
              animationType="slide-up" 
              delay={index * 50}
              className="h-full"
            >
              <Card className="bg-card border border-border/50 shadow-card hover:shadow-premium transition-all duration-500 h-full group hover:-translate-y-1">
                <CardContent className="p-6 sm:p-8 h-full flex flex-col">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-trust-blue/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-trust-blue/20 transition-colors">
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

