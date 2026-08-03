import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { 
  Download, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Smartphone,
  Users,
  DollarSign
} from "lucide-react";
import { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { MaterialRequestModal } from "./MaterialRequestModal";

const SalaryFitsSection = () => {
  const whatsappLink = "https://wa.link/3gwhbl";
  const [materialModalOpen, setMaterialModalOpen] = useState(false);

  const beneficios = [
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Adiantamento de Salário",
      description: "Acesso rápido quando você precisa"
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Plataforma Digital",
      description: "App e portal para colaboradores"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Sem Custo para Empresa",
      description: "Gratuito para empresas com 500+ vidas"
    }
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animationType="fade">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src="/salaryfits.png" 
                  alt="SalaryFits Logo" 
                  className="h-24 w-24 md:h-32 md:w-32 object-contain rounded-xl shadow-lg bg-white p-3 border-2 border-primary/20"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img.src.includes('.png')) {
                      img.src = '/salaryfits.jpg';
                    } else {
                      img.src = '/logo.jpg';
                    }
                  }}
                />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-secondary">Salary</span>
              <span className="text-primary">Fits</span>
            </h2>
            <p className="text-lg md:text-xl font-semibold max-w-3xl mx-auto mb-2" style={{ color: '#1a1a1a' }}>
              Bem-estar financeiro e benefícios para funcionários
            </p>
            <p className="text-base max-w-2xl mx-auto" style={{ color: '#2a2a2a' }}>
              Plataforma tecnológica que integra empresas, colaboradores e instituições financeiras
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          <AnimatedSection animationType="slide-right" delay={100}>
            <Card className="border border-primary/20 shadow-md bg-gradient-to-br from-primary/5 to-transparent h-full">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
                  O que é e como funciona
                </h3>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  A SalaryFits reduz o trabalho operacional do seu RH, permitindo que você foque em estratégia e desenvolvimento de pessoas.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">Plataforma digital completa via app e portal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">Benefícios financeiros inteligentes para colaboradores</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">Integração com folha de pagamento</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animationType="slide-left" delay={200}>
            <Card className="border border-primary/20 shadow-md bg-gradient-to-br from-primary/5 to-transparent h-full">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
                  Benefícios Disponíveis
                </h3>
                <div className="space-y-4">
                  {beneficios.map((beneficio, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-primary/10">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <div className="text-primary">
                          {beneficio.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{beneficio.title}</h4>
                        <p className="text-sm text-foreground/70">{beneficio.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        <AnimatedSection animationType="fade" delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setMaterialModalOpen(true)}
              variant="default"
              className="shadow-md hover:shadow-lg transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Informações (PDF)
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.open(whatsappLink, '_blank')}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Falar com Consultor
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </AnimatedSection>

        <MaterialRequestModal
          open={materialModalOpen}
          onOpenChange={setMaterialModalOpen}
          materialName="SalaryFits (PDF)"
          origem="material_salaryfits"
          metadata={{ product: "salaryfits", channel: "pdf" }}
        />
      </div>
    </section>
  );
};

export default SalaryFitsSection;
