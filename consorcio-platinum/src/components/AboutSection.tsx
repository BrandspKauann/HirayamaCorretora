import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { 
  CheckCircle2, 
  Building2, 
  TrendingDown, 
  Users, 
  FileText,
  ArrowRight,
  Target,
  Briefcase,
  Zap
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { LeadFormModal } from "./LeadFormModal";
import { useState } from "react";

const AboutSection = () => {
  const whatsappLink = "https://wa.link/3gwhbl";
  const [showForm, setShowForm] = useState(false);

  const quemSomos = {
    title: "Quem Somos",
    description: "Somos uma consultoria especializada em benefícios corporativos, focada em transformar o RH operacional em estratégico. Não somos apenas fornecedores - somos parceiros que entendem suas necessidades e trabalham para otimizar seus processos.",
    icon: <Building2 className="h-8 w-8 text-primary" />
  };

  const oQueResolvemos = [
    {
      icon: <FileText className="h-6 w-6 text-secondary" />,
      title: "Gestão de Vale Refeição (VR)",
      description: "Análise completa e gestão otimizada do seu programa de alimentação"
    },
    {
      icon: <Briefcase className="h-6 w-6 text-secondary" />,
      title: "Gestão de Vale Transporte (VT)",
      description: "Soluções completas para gestão de transporte dos colaboradores"
    },
    {
      icon: <Target className="h-6 w-6 text-secondary" />,
      title: "Análise de Necessidades",
      description: "Entendemos profundamente as necessidades da sua empresa antes de propor soluções"
    },
    {
      icon: <TrendingDown className="h-6 w-6 text-secondary" />,
      title: "Comparativos entre Operadoras",
      description: "Análise detalhada e comparativo real entre VR, Flash, Caju e outras operadoras"
    },
    {
      icon: <Zap className="h-6 w-6 text-secondary" />,
      title: "Otimização Fiscal",
      description: "Redução de carga tributária e maximização de benefícios fiscais"
    },
    {
      icon: <Users className="h-6 w-6 text-secondary" />,
      title: "Redução de Trabalho Operacional do RH",
      description: "Tire o RH do operacional e leve para o estratégico - menos burocracia, mais resultados"
    }
  ];

  return (
    <section id="quem-somos" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Quem Somos */}
          <AnimatedSection animationType="slide-up">
            <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-primary/10 rounded-xl sm:rounded-2xl">
                  {quemSomos.icon}
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-4 sm:mb-6 md:mb-8">
                {quemSomos.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
                {quemSomos.description}
              </p>
            </div>
          </AnimatedSection>

          {/* O que Resolvemos */}
          <AnimatedSection animationType="fade" delay={100}>
            <div className="mb-10 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 sm:mb-8 md:mb-12 text-center">
                O que Resolvemos
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12">
                {oQueResolvemos.map((item, index) => (
                  <AnimatedSection 
                    key={index}
                    animationType="scale" 
                    delay={index * 50}
                  >
                    <Card className="h-full border-2 border-border/50 shadow-card hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-5 sm:p-6 md:p-8">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="p-2.5 sm:p-3 bg-secondary/10 rounded-lg flex-shrink-0">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary mb-2">
                              {item.title}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection animationType="fade" delay={400}>
            <Card className="border-2 border-primary shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-6 sm:p-8 md:p-12 text-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4 sm:mb-6">
                  Pronto para transformar seu RH?
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0">
                  Vamos analisar as necessidades da sua empresa e encontrar a melhor solução em benefícios corporativos.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button 
                    size="lg" 
                    variant="hero"
                    onClick={() => setShowForm(true)}
                    className="shadow-lg hover:shadow-xl transition-all text-sm sm:text-base w-full sm:w-auto"
                  >
                    Quero uma análise gratuita
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => window.open(whatsappLink, '_blank')}
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-sm sm:text-base w-full sm:w-auto"
                  >
                    Falar com consultor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>

      {/* Form Modal */}
      <LeadFormModal
        open={showForm}
        onOpenChange={setShowForm}
        title="Análise Gratuita"
        description="Preencha o formulário e entraremos em contato para fazer uma análise completa das necessidades da sua empresa."
        origem="about_section"
      />
    </section>
  );
};

export default AboutSection;
