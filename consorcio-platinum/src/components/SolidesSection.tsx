import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { 
  Download, 
  MessageCircle, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Bus,
  Shield,
  FileText
} from "lucide-react";
import { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { MaterialRequestModal } from "./MaterialRequestModal";

const SolidesSection = () => {
  const whatsappLink = "https://wa.link/3gwhbl";
  const [materialModalOpen, setMaterialModalOpen] = useState(false);

  const solucoes = [
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Controle de Ponto Digital",
      description: "Web, app, totem ou reconhecimento facial"
    },
    {
      icon: <Bus className="h-5 w-5" />,
      title: "Gestão de Vale-Transporte",
      description: "Automatizada e integrada com controle de ponto"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Folha Digital",
      description: "100% digital e na nuvem"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Adequação à NR-1",
      description: "Conformidade com riscos psicossociais (maio 2025)"
    }
  ];

  const resultados = [
    "80% redução de custos com horas extras",
    "50% economia com papel",
    "-43% redução de turnover",
    "+78% ganho de produtividade"
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 relative overflow-hidden" style={{ backgroundColor: '#2d1b4e' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection animationType="fade">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img 
                  src="/solides.jpg" 
                  alt="Solides Logo" 
                  className="h-24 w-24 md:h-32 md:w-32 object-contain rounded-xl shadow-lg bg-white p-3 border-2"
                  style={{ borderColor: '#7c3aed' }}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img.src.includes('.jpg')) {
                      img.src = '/solides.png';
                    } else {
                      const div = document.createElement('div');
                      div.className = 'h-24 w-24 md:h-32 md:w-32 rounded-xl shadow-lg bg-white p-3 flex items-center justify-center border-2';
                      div.style.borderColor = '#7c3aed';
                      div.innerHTML = '<svg class="h-14 w-14 md:h-18 md:w-18 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>';
                      img.parentNode?.replaceChild(div, img);
                    }
                  }}
                />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6" style={{ color: '#fbbf24' }} />
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span style={{ color: '#fbbf24' }}>Solides</span>
            </h2>
            <p className="text-lg md:text-xl mb-2" style={{ color: '#e9d5ff' }}>
              Controle de Ponto e Vale-Transporte Digital
            </p>
            <p className="text-base text-foreground/80 max-w-2xl mx-auto" style={{ color: '#ddd6fe' }}>
              A maior HR Tech do Brasil com mais de 40 mil empresas clientes
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          <AnimatedSection animationType="slide-right" delay={100}>
            <Card className="border-2 shadow-md h-full" style={{ borderColor: '#7c3aed', backgroundColor: '#3d1f6d' }}>
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>
                  Soluções Principais
                </h3>
                <div className="space-y-4">
                  {solucoes.map((solucao, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#4c1aa3' }}>
                      <div className="p-2 rounded-lg bg-primary/20">
                        <div style={{ color: '#ffffff' }}>
                          {solucao.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1" style={{ color: '#ffffff' }}>{solucao.title}</h4>
                        <p className="text-sm" style={{ color: '#e9d5ff' }}>{solucao.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animationType="slide-left" delay={200}>
            <Card className="border-2 shadow-md h-full" style={{ borderColor: '#7c3aed', backgroundColor: '#3d1f6d' }}>
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>
                  Resultados Comprovados
                </h3>
                <p className="text-foreground/80 mb-4" style={{ color: '#e9d5ff' }}>
                  Plataforma completa que transforma o RH em área estratégica com dados e automação.
                </p>
                <ul className="space-y-3">
                  {resultados.map((resultado, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
                      <span style={{ color: '#e9d5ff' }}>{resultado}</span>
                    </li>
                  ))}
                </ul>
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
              className="bg-white hover:bg-gray-100 shadow-md hover:shadow-lg transition-all font-semibold"
              style={{ color: '#4c1aa3' }}
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Informações (PDF)
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.open(whatsappLink, '_blank')}
              className="border-2 shadow-md hover:shadow-lg transition-all font-semibold"
              style={{ borderColor: '#ffffff', color: '#ffffff', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#4c1aa3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#ffffff';
              }}
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
          materialName="Solides (PDF)"
          origem="material_solides"
          metadata={{ product: "solides", channel: "pdf" }}
        />
      </div>
    </section>
  );
};

export default SolidesSection;
