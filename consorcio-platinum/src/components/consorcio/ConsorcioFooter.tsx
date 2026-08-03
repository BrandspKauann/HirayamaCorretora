import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MessageCircle, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { LeadFormModal } from "@/components/LeadFormModal";
import { SimulacaoConsorcioModal } from "@/components/SimulacaoConsorcioModal";

const WHATSAPP_LINK = "https://wa.link/3gwhbl";
const PHONE = "+5511972896857";
const EMAIL = "ewerton@hirayamacorretora.com.br";
const LOCATION = "São Paulo, SP";

const ConsorcioFooter = () => {
  const [showForm, setShowForm] = useState(false);
  const [showSimulacao, setShowSimulacao] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 relative z-10">
        <AnimatedSection animationType="fade">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-10 sm:mb-12 md:mb-16 text-center md:text-left">
            <div className="lg:col-span-2">
              <div className="mb-5 sm:mb-6 md:mb-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 justify-center md:justify-start">
                  <div className="inline-flex flex-col items-end leading-none">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl whitespace-nowrap">
                      <span className="font-light bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                        Consórcio{" "}
                      </span>
                      <span className="font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                        Platinum
                      </span>
                    </h3>
                    <p className="text-[10px] sm:text-xs text-primary-foreground/70 font-medium tracking-wide -mt-0.5">
                      By Hirayama
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-primary-foreground/80 mb-3 sm:mb-4 text-center md:text-left">
                  Consórcio Platinum com visão patrimonial e método
                </p>
              </div>
              <p className="text-primary-foreground/90 mb-5 sm:mb-6 md:mb-8 leading-relaxed max-w-md mx-auto md:mx-0 text-xs sm:text-sm md:text-base">
                Consultoria especializada em consórcio automóvel, imobiliário e empresarial.
              </p>
              <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                <div className="flex items-center space-x-2 sm:space-x-3 justify-center md:justify-start">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                  </div>
                  <a 
                    href={`mailto:${EMAIL}`} 
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm md:text-base break-all"
                  >
                    {EMAIL}
                  </a>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 justify-center md:justify-start">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                  </div>
                  <a 
                    href={`tel:${PHONE.replace(/\D/g, "")}`} 
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-xs sm:text-sm md:text-base"
                  >
                    (11) 97289-6857
                  </a>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 justify-center md:justify-start">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                  </div>
                  <span className="text-primary-foreground/80 text-xs sm:text-sm md:text-base">{LOCATION}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6 md:mb-8 text-yellow-400">Links Rápidos</h4>
              <ul className="space-y-2.5 sm:space-y-3 md:space-y-4 flex flex-col items-center md:items-start">
                <li>
                  <button 
                    onClick={() => scrollToSection("#tipos")} 
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm sm:text-base"
                  >
                    Tipos de consórcio
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("#parceiros")} 
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm sm:text-base"
                  >
                    Parceiros
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("#depoimentos")} 
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm sm:text-base"
                  >
                    Depoimentos
                  </button>
                </li>
                <li>
                  <a 
                    href="/conteudo" 
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm sm:text-base"
                  >
                    Blog da Consultoria
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => window.open(WHATSAPP_LINK, '_blank')} 
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm sm:text-base"
                  >
                    WhatsApp
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg sm:text-xl font-semibold mb-6 sm:mb-8 text-yellow-400">Serviços</h4>
              <ul className="space-y-3 sm:space-y-4 flex flex-col items-center md:items-start">
                <li><span className="text-primary-foreground/80 text-sm sm:text-base">Comparativos entre operadoras</span></li>
                <li><span className="text-primary-foreground/80 text-sm sm:text-base">Portabilidade de benefícios</span></li>
                <li><span className="text-primary-foreground/80 text-sm sm:text-base">Orientação sobre PAT</span></li>
                <li><span className="text-primary-foreground/80 text-sm sm:text-base">Redução de custos</span></li>
                <li><span className="text-primary-foreground/80 text-sm sm:text-base">Integração com folha</span></li>
              </ul>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animationType="scale" delay={100}>
          <div className="bg-primary-hover rounded-3xl p-8 sm:p-10 md:p-12 mb-12 sm:mb-16 text-center shadow-xl border border-primary-foreground/10">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-yellow-400">
                Pronto para otimizar seus benefícios?
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-primary-foreground/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                Agende uma reunião com um consultor e descubra como sua empresa pode 
                economizar, ganhar eficiência fiscal e cuidar melhor dos colaboradores.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => setShowForm(true)}
                  className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  Agendar reunião
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm bg-white/5 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                  onClick={() => window.open(WHATSAPP_LINK, '_blank')}
                >
                  Falar com um consultor
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animationType="fade" delay={200}>
          <div className="border-t border-primary-foreground/20 pt-8 text-center">
            <p className="text-primary-foreground/70 text-sm sm:text-base mb-2">
              Site institucional
            </p>
            <p className="text-primary-foreground/60 text-xs sm:text-sm mb-2">
              Criado por Ewerton Hirayama
            </p>
            <p className="text-primary-foreground/60 text-xs sm:text-sm">
              Todos os direitos reservados.
            </p>
          </div>
        </AnimatedSection>
      </div>

      <SimulacaoConsorcioModal open={showSimulacao} onOpenChange={setShowSimulacao} />
      <LeadFormModal
        open={showForm}
        onOpenChange={setShowForm}
        title="Solicitar simulação"
        description="Preencha o formulário e entraremos em contato para apresentar as melhores opções."
        origem="footer"
      />
    </footer>
  );
};

export default ConsorcioFooter;
