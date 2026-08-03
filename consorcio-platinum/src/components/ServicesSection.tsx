import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Globe, Phone, ArrowRight, Shield, Database, TrendingUp } from "lucide-react";
import protectionIcon from "@/assets/protection-icon.jpg";
import intelligenceIcon from "@/assets/intelligence-icon.jpg";
import collectionIcon from "@/assets/collection-icon.jpg";
import AnimatedSection from "./AnimatedSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { LeadFormModal } from "./LeadFormModal";
import { useState } from "react";

const ServicesSection = () => {
  const whatsappLink = "https://wa.link/3gwhbl";
  const [showForm, setShowForm] = useState(false);
  
  const services = [
    {
      icon: protectionIcon,
      iconComponent: <Shield className="h-8 w-8 text-trust-blue" />,
      title: "Seguro de Crédito",
      description: "Proteção das vendas a prazo. Se um cliente não pagar, a seguradora indeniza até 90% do valor e assume a cobrança.",
      features: [
        "Cobertura de até 90%",
        "Indenização em até 30 dias",
        "Indenização antecipada em atrasos prolongados",
        "Cobrança especializada incluída"
      ],
      cta: "Solicitar Análise",
      variant: "premium" as const
    },
    {
      icon: intelligenceIcon,
      iconComponent: <Database className="h-8 w-8 text-trust-blue" />,
      title: "Business Information (URBA360)",
      description: "Banco de dados global em mais de 200 países. O 'Serasa internacional' para validar clientes e fornecedores.",
      features: [
        "Dados de empresas em 200+ países",
        "Análise de risco em tempo real",
        "Relatórios detalhados",
        "Monitoramento contínuo"
      ],
      cta: "Conhecer BI",
      variant: "trust" as const
    },
    {
      icon: collectionIcon,
      iconComponent: <TrendingUp className="h-8 w-8 text-trust-blue" />,
      title: "Debt Collection",
      description: "Cobrança nacional e internacional com estrutura própria da Coface. Expertise global em recuperação de créditos.",
      features: [
        "Cobrança nacional e internacional",
        "Estrutura própria Coface",
        "Expertise em recuperação",
        "Processo transparente"
      ],
      cta: "Saiba Mais",
      variant: "secondary" as const
    }
  ];

  const { elementRef: ctaRef, isVisible: ctaVisible } = useScrollAnimation({
    threshold: 0.05,
    rootMargin: "0px 0px -15% 0px",
    triggerOnce: false,
  });

  return (
    <section id="servicos" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection animationType="slide-up">
          <div className="text-center mb-16 sm:mb-20 md:mb-24 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-6 sm:mb-8">
              Serviços Coface
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-corporate-gray leading-relaxed">
              Além do seguro de crédito, a Coface oferece uma gama completa de soluções 
              para proteger e fortalecer o seu negócio.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {services.map((service, index) => (
            <AnimatedSection 
              key={index}
              animationType="scale" 
              delay={index * 75}
            >
              <Card className="bg-gradient-card shadow-card hover:shadow-premium transition-all duration-300 border-0 h-full flex flex-col group hover:-translate-y-2">
                <CardContent className="p-6 sm:p-8 h-full flex flex-col">
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="relative inline-block mb-4 sm:mb-6">
                      <img 
                        src={service.icon} 
                        alt={`${service.title} icon`}
                        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl object-cover border-2 border-border group-hover:border-trust-blue transition-colors"
                      />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4">
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base text-corporate-gray leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex-grow mb-6 sm:mb-8">
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm sm:text-base text-corporate-gray">
                          <div className="w-2 h-2 bg-trust-blue rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    variant={service.variant} 
                    className="w-full shadow-md hover:shadow-lg transition-shadow group/btn"
                    onClick={() => {
                      if (service.cta === "Saiba Mais") {
                        setShowForm(true);
                      } else {
                        window.open(whatsappLink, '_blank');
                      }
                    }}
                  >
                    {service.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        {/* Partnership CTA */}
        <div 
          ref={ctaRef}
          className={`bg-gradient-hero rounded-3xl p-8 sm:p-10 md:p-12 text-center shadow-premium relative overflow-hidden scroll-animate-fade ${ctaVisible ? "visible" : ""}`}
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4 sm:mb-6">
              Parceria oficial com a Coface
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/90 mb-6 sm:mb-8 leading-relaxed">
              Líder mundial em seguro de crédito e inteligência de riscos, 
              a Coface está presente em mais de 100 países e protege empresas há mais de 70 anos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => window.open(whatsappLink, '_blank')}
                className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all"
              >
                Falar com Especialista
                <Phone className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white/90 text-white hover:bg-white/10 backdrop-blur-sm bg-white/5 shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.open("https://www.coface.com.br/sobre-nos/coface-no-brasil", '_blank')}
              >
                Mais sobre a Coface
                <Globe className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <LeadFormModal
        open={showForm}
        onOpenChange={setShowForm}
        title="Saiba Mais"
        description="Preencha o formulário e entraremos em contato para fornecer mais informações sobre nossos serviços."
        origem="services_section"
      />
    </section>
  );
};

export default ServicesSection;
