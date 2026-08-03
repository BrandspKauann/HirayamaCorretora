import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Phone, CheckCircle2, ArrowRight, TrendingDown, FileText, Users, MessageCircle, Zap } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { LeadFormModal } from "./LeadFormModal";
import { useState } from "react";

const PartnershipSection = () => {
  const whatsappLink = "https://wa.link/3gwhbl";
  const calendlyLink = "https://calendly.com/ewertonhirayama/consultoria-em-cartoes-de-vale-refeicao-e-alimentacao";
  const [showForm, setShowForm] = useState(false);
  
  const services = [
    {
      icon: <TrendingDown className="h-6 w-6 text-primary" />,
      title: "Comparativos reais entre operadoras",
      description: "Análise detalhada de VR, Flash e Caju para sua empresa"
    },
    {
      icon: <ArrowRight className="h-6 w-6 text-primary" />,
      title: "Portabilidade de benefícios",
      description: "Ajudamos na migração entre operadoras quando necessário"
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Orientação sobre PAT",
      description: "Suporte completo em questões de Programa de Alimentação do Trabalhador"
    },
    {
      icon: <TrendingDown className="h-6 w-6 text-primary" />,
      title: "Redução de custos e carga tributária",
      description: "Otimização fiscal e redução de custos operacionais"
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Integração com a folha de pagamento",
      description: "Facilidade na integração com sistemas de RH"
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Gestão de ponto e vale-transporte",
      description: "Parceria com Solides para controle de ponto e gestão de vale-transporte"
    }
  ];

  const differentials = [
    "Atendimento humanizado",
    "Otimização de carga e impostos",
    "Resolução rápida de problemas",
    "Integração com folha de pagamento",
    "Suporte direto via WhatsApp"
  ];

  const { elementRef: ctaRef, isVisible: ctaVisible } = useScrollAnimation({
    threshold: 0.05,
    rootMargin: "0px 0px -15% 0px",
    triggerOnce: false,
  });

  return (
    <section id="parceria" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <AnimatedSection animationType="slide-up">
          <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 sm:mb-8">
              Muito mais que um fornecedor.
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary mb-4 sm:mb-6">
              Somos parceiros da sua empresa.
            </p>
            <p className="text-lg sm:text-xl text-foreground/85 leading-relaxed">
              Aqui você não recebe apenas cartões — recebe consultoria estratégica em benefícios corporativos.
            </p>
          </div>
        </AnimatedSection>

        <div className="mb-16 sm:mb-20">
          <AnimatedSection animationType="fade" delay={100}>
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">
                Ajudamos sua empresa com:
              </h3>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {services.map((service, index) => (
              <AnimatedSection 
                key={index}
                animationType="slide-up" 
                delay={index * 100}
              >
                <Card className="bg-card border border-border/50 shadow-card hover:shadow-premium transition-all duration-500 h-full group hover:-translate-y-1">
                  <CardContent className="p-5 sm:p-6 md:p-8 h-full flex flex-col">
                    <div className="flex items-start gap-3 sm:gap-4 justify-center md:justify-start">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25 transition-colors border border-primary/20">
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2">
                          {service.title}
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-foreground/75 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection animationType="fade" delay={200}>
          <div className="max-w-3xl mx-auto mb-12 sm:mb-16 text-center">
            <p className="text-lg sm:text-xl text-foreground/85 leading-relaxed mb-6 sm:mb-8">
              Do cadastro ao pós-venda, nosso time apoia o RH com simplicidade, agilidade e resultado.
            </p>
            
            <div className="mb-8 sm:mb-12">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-6 md:mb-8">
                Diferenciais que fazem a diferença
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {differentials.map((differential, index) => (
                      <div key={index} className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start text-center md:text-left">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm sm:text-base md:text-lg text-foreground/80">{differential}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <div 
          ref={ctaRef}
          className={`bg-gradient-hero rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-center shadow-premium relative overflow-hidden scroll-animate-fade ${ctaVisible ? "visible" : ""}`}
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4 sm:mb-6">
              Fale com nosso time comercial
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/90 mb-6 sm:mb-8 leading-relaxed">
              Quer pedir cartões, comparar operadoras ou entender qual solução faz mais sentido para sua empresa?
            </p>
            <div className="mb-6 sm:mb-8">
              <p className="text-lg sm:text-xl text-secondary font-semibold mb-4 drop-shadow-sm">
                📅 Agende uma reunião com um consultor
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => setShowForm(true)}
                className="bg-secondary text-foreground hover:bg-secondary-hover shadow-lg hover:shadow-xl transition-all border-2 border-secondary/30"
              >
                Agendar reunião
                <Phone className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <LeadFormModal
        open={showForm}
        onOpenChange={setShowForm}
        title="Agendar Reunião"
        description="Preencha o formulário e entraremos em contato para agendar sua reunião com um consultor."
        origem="partnership_section"
      />
    </section>
  );
};

export default PartnershipSection;

