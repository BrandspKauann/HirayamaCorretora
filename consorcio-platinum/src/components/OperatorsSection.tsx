import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle2, Building2, TrendingUp, Zap } from "lucide-react";
// Logos das operadoras
const flashLogo = "/flash.png";
const vrLogo = "/vr.jpg";
const cajuLogo = "/caju.jpg";
import AnimatedSection from "./AnimatedSection";
import { LeadFormModal } from "./LeadFormModal";
import { useState } from "react";

const OperatorsSection = () => {
  const whatsappLink = "https://wa.link/3gwhbl";
  const [showForm, setShowForm] = useState(false);
  
  const operators = [
    {
      icon: flashLogo,
      iconComponent: <Zap className="h-8 w-8 text-secondary" />,
      title: "Flash Benefícios",
      description: "Uma operadora moderna e inovadora que oferece soluções rápidas e eficientes em benefícios corporativos. Com tecnologia de ponta e atendimento ágil, o Flash é ideal para empresas que buscam praticidade e modernidade.",
      features: [
        "Tecnologia moderna e ágil",
        "Atendimento rápido e eficiente",
        "Soluções práticas para empresas"
      ],
      cta: "Saiba mais",
      variant: "premium" as const
    },
    {
      icon: vrLogo,
      iconComponent: <TrendingUp className="h-8 w-8 text-secondary" />,
      title: "VR Benefícios",
      description: "Mais de 40 anos de história no mercado de benefícios corporativos. Somos parceiros da VR há mais de 7 anos, entregando soluções confiáveis para RHs que precisam de controle e previsibilidade.",
      features: [
        "Rede fechada",
        "Foco em controle, economia e cashback"
      ],
      cta: "Saiba mais",
      variant: "trust" as const
    },
    {
      icon: cajuLogo,
      iconComponent: <Zap className="h-8 w-8 text-secondary" />,
      title: "Caju Benefícios",
      description: "Uma startup inovadora que mudou a forma de usar benefícios corporativos. Cartão bandeirado VISA, saldo único e liberdade total para o colaborador.",
      features: [
        "Tecnologia e flexibilidade",
        "Wellhub* integrado",
        "Experiência moderna para o time"
      ],
      cta: "Saiba mais",
      variant: "secondary" as const
    }
  ];

  return (
    <section id="operadoras" className="py-16 sm:py-20 md:py-24 lg:py-28" style={{ backgroundColor: '#2d1b4e' }}>
      <div className="container mx-auto px-4">
        <AnimatedSection animationType="slide-up">
          <div className="text-center mb-8 sm:mb-12 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8" style={{ color: '#ffffff' }}>
              Trabalhamos com as melhores marcas do mercado
            </h2>
            <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#e9d5ff' }}>
                Consultoria especializada em cartões de vale refeição. Trabalhamos com operadoras de rede aberta e fechada para encontrar a melhor solução para sua empresa.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {operators.map((operator, index) => (
            <AnimatedSection 
              key={index}
              animationType="scale" 
              delay={index * 75}
            >
              <Card className="shadow-card hover:shadow-premium transition-all duration-300 border-2 h-full flex flex-col group hover:-translate-y-2" style={{ borderColor: '#7c3aed', backgroundColor: '#3d1f6d' }}>
                <CardContent className="p-5 sm:p-6 md:p-8 h-full flex flex-col items-center text-center">
                  <div className="w-full mb-4 sm:mb-6">
                    <div className="relative inline-block mb-3 sm:mb-4">
                      <img 
                        src={operator.icon} 
                        alt={`${operator.title} logo`}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto rounded-xl object-contain border-2 shadow-md group-hover:shadow-lg bg-white p-2"
                        style={{ borderColor: '#7c3aed' }}
                      />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3" style={{ color: '#ffffff' }}>
                      {operator.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed mx-auto px-2 sm:px-0" style={{ color: '#e9d5ff' }}>
                      {operator.description}
                    </p>
                  </div>

                  <div className="flex-grow mb-4 sm:mb-6 w-full">
                    <ul className="space-y-1.5 sm:space-y-2 flex flex-col items-center">
                      {operator.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center justify-center text-xs sm:text-sm w-full px-2 sm:px-0" style={{ color: '#e9d5ff' }}>
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 flex-shrink-0" style={{ color: '#fbbf24' }} />
                          <span className="text-left">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <Button 
                      className="w-full shadow-md hover:shadow-lg transition-shadow group/btn font-semibold text-sm sm:text-base py-5 sm:py-6"
                      style={{ 
                        backgroundColor: '#fbbf24', 
                        color: '#4c1aa3',
                        border: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f59e0b';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fbbf24';
                      }}
                      onClick={() => {
                        const partnershipSection = document.getElementById('parceria');
                        if (partnershipSection) {
                          partnershipSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                    >
                      {operator.cta}
                      <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-full text-xs sm:text-sm font-semibold py-4 sm:py-5"
                      style={{
                        borderColor: '#fbbf24',
                        color: '#fbbf24',
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fbbf24';
                        e.currentTarget.style.color = '#4c1aa3';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#fbbf24';
                      }}
                      onClick={() => setShowForm(true)}
                    >
                      Quero conversar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      <LeadFormModal
        open={showForm}
        onOpenChange={setShowForm}
        title="Saiba Mais"
        description="Preencha o formulário e entraremos em contato para fornecer mais informações."
        origem="operators_section"
      />
    </section>
  );
};

export default OperatorsSection;

