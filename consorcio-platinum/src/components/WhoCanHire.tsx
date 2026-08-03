import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Building2, TrendingUp, Globe, Users, CheckCircle, ArrowRight, AlertCircle } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const WhoCanHire = () => {
  const whatsappLink = "https://wa.link/3gwhbl";
  
  const criteria = [
    {
      icon: <TrendingUp className="h-7 w-7 text-trust-blue" />,
      title: "Faturam acima de R$ 10 milhões/ano",
      description: "Empresas com faturamento anual mínimo"
    },
    {
      icon: <Globe className="h-7 w-7 text-trust-blue" />,
      title: "Exportam a partir de US$ 2 milhões/ano",
      description: "Exportadores com volume significativo"
    },
    {
      icon: <Building2 className="h-7 w-7 text-trust-blue" />,
      title: "Realizam vendas B2B a prazo",
      description: "Vendas de 30 a 120 dias para empresas"
    },
    {
      icon: <Users className="h-7 w-7 text-trust-blue" />,
      title: "Concentram receita em poucos clientes",
      description: "Grande parte da receita vem de poucos clientes"
    }
  ];

  const benefits = [
    {
      profile: "CFO / Diretor Financeiro",
      benefits: "Previsibilidade de caixa, proteção contra inadimplência e melhor análise de risco"
    },
    {
      profile: "Diretor Comercial", 
      benefits: "Segurança para ampliar prazos, abrir mercados e conquistar novos clientes"
    },
    {
      profile: "Conselho / Governança",
      benefits: "Reforço de compliance, solidez financeira e credibilidade junto a bancos e investidores"
    }
  ];

  const { elementRef: altRef, isVisible: altVisible } = useScrollAnimation({
    threshold: 0.05,
    rootMargin: "0px 0px -15% 0px",
    triggerOnce: false,
  });

  return (
    <section id="beneficios" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Who Can Hire */}
        <div className="mb-20 sm:mb-24 md:mb-28">
          <AnimatedSection animationType="slide-up">
            <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 sm:mb-8">
                Quem Pode Contratar
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-corporate-gray leading-relaxed">
                Esse produto é exclusivo para empresas que:
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {criteria.map((criterion, index) => (
              <AnimatedSection 
                key={index}
                animationType="slide-up" 
                delay={index * 75}
              >
                <Card className="bg-gradient-card shadow-card hover:shadow-premium transition-all duration-300 border-0 group hover:-translate-y-1">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-start space-x-4 sm:space-x-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-trust-blue/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-trust-blue/20 transition-colors">
                        {criterion.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">
                          {criterion.title}
                        </h3>
                        <p className="text-sm sm:text-base text-corporate-gray leading-relaxed">
                          {criterion.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          {/* Alternative Solution */}
          <div 
            ref={altRef}
            className={`bg-gradient-to-br from-muted/50 to-muted/30 rounded-3xl p-8 sm:p-10 md:p-12 text-center border border-border/50 scroll-animate-scale ${altVisible ? "visible" : ""}`}
          >
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-secondary" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-4 sm:mb-6">
                Sua empresa ainda não se encaixa nesses critérios?
              </h3>
              <p className="text-base sm:text-lg text-corporate-gray mb-6 sm:mb-8 leading-relaxed">
                A Coface oferece o <span className="font-semibold text-trust-blue">BI (URBA360)</span> – 
                birô global para análise de clientes e fornecedores.
              </p>
              <Button 
                variant="trust" 
                size="lg"
                onClick={() => window.open(whatsappLink, '_blank')}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                Conheça o BI Coface
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Benefits by Role */}
        <div>
          <AnimatedSection animationType="fade">
            <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 sm:mb-8">
                Benefícios para o Decisor
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-corporate-gray leading-relaxed">
                Vantagens específicas para cada perfil de decisor na empresa
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <AnimatedSection 
                key={index}
                animationType="scale" 
                delay={index * 100}
              >
                <Card className="bg-gradient-card shadow-card hover:shadow-premium transition-all duration-300 border-0 group hover:-translate-y-2">
                  <CardContent className="p-6 sm:p-8 text-center h-full flex flex-col">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform">
                      <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">
                      {benefit.profile}
                    </h3>
                    <p className="text-sm sm:text-base text-corporate-gray leading-relaxed flex-grow">
                      {benefit.benefits}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoCanHire;
