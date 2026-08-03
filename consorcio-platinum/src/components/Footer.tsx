import { Button } from "./ui/button";
import { Mail, Phone, MapPin, ArrowRight, Sparkles, MessageCircle } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { LeadFormModal } from "./LeadFormModal";
import { useState } from "react";

const Footer = () => {
  const whatsappLink = "https://wa.link/3gwhbl";
  const calendlyLink = "https://calendly.com/ewertonhirayama/consultoria-em-cartoes-de-vale-refeicao-e-alimentacao";
  const [showForm, setShowForm] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(180deg,#0f5b43_0%,#0b3d2d_100%)] text-primary-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_30%)] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

      <div className="container mx-auto px-4 py-14 sm:py-16 md:py-20 relative z-10">
        <AnimatedSection animationType="slide-up">
          <div className="mb-10 sm:mb-12 rounded-[2rem] border border-white/10 bg-white/8 backdrop-blur-md shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="p-7 sm:p-10 lg:p-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  Estratégia inteligente para conquistar patrimônio
                </div>

                <div className="mt-6 max-w-2xl">
                  <div className="inline-flex flex-col items-end leading-none">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-white whitespace-nowrap">
                      <span className="font-light">Consórcio </span>
                      <span className="font-semibold">Platinum</span>
                    </h3>
                    <p className="text-sm sm:text-base font-normal text-white/75 tracking-wide -mt-1">
                      By Hirayama
                    </p>
                  </div>
                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/85">
                    Planejamento patrimonial com foco em status, segurança e acompanhamento real do início ao fim.
                  </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => setShowForm(true)}
                    className="w-full sm:w-auto bg-white text-primary hover:bg-white/95 shadow-lg hover:shadow-xl"
                  >
                    Solicitar simulação
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-2 border-white/35 bg-white/5 text-white hover:bg-white/12 backdrop-blur-sm"
                    onClick={() => window.open(whatsappLink, "_blank")}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>
              </div>

              <div className="border-t border-white/10 lg:border-t-0 lg:border-l bg-black/10 p-7 sm:p-10 lg:p-12">
                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm uppercase tracking-[0.18em] text-white/60 mb-3">Contato direto</h4>
                    <div className="space-y-3">
                      <a
                        href={`mailto:${EMAIL}`}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white/90 transition-colors hover:bg-white/12"
                      >
                        <Mail className="h-5 w-5 text-secondary" />
                        <span className="break-all">{EMAIL}</span>
                      </a>
                      <a
                        href={`tel:${PHONE.replace(/\D/g, "")}`}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white/90 transition-colors hover:bg-white/12"
                      >
                        <Phone className="h-5 w-5 text-secondary" />
                        <span>{PHONE}</span>
                      </a>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white/90">
                        <MapPin className="h-5 w-5 text-secondary" />
                        <span>{LOCATION}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/15 bg-white/8 text-white hover:bg-white/15"
                      onClick={() => scrollToSection("#tipos")}
                    >
                      Tipos
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/15 bg-white/8 text-white hover:bg-white/15"
                      onClick={() => scrollToSection("#parceiros")}
                    >
                      Parceiros
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/15 bg-white/8 text-white hover:bg-white/15"
                      onClick={() => scrollToSection("#depoimentos")}
                    >
                      Depoimentos
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/15 bg-white/8 text-white hover:bg-white/15"
                      onClick={() => window.open(whatsappLink, "_blank")}
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animationType="fade" delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/6 p-6 sm:p-8 backdrop-blur-sm">
              <h4 className="text-lg font-semibold mb-4 text-white">Serviços</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/85">
                <li className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">Comparativos entre operadoras</li>
                <li className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">Portabilidade de benefícios</li>
                <li className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">Orientação sobre PAT</li>
                <li className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">Redução de custos</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-primary/15 p-6 sm:p-8 backdrop-blur-sm">
              <h4 className="text-lg font-semibold mb-4 text-white">Atendimento</h4>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6">
                Agende uma reunião com um consultor e descubra como sua empresa pode ganhar eficiência, previsibilidade e suporte de ponta.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => setShowForm(true)}
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/95"
                >
                  Solicitar simulação
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm bg-white/5"
                  onClick={() => window.open(whatsappLink, "_blank")}
                >
                  Falar com consultor
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animationType="fade" delay={200}>
          <div className="border-t border-white/15 pt-8 mt-12 text-center text-white/70">
            <p className="text-sm sm:text-base mb-1">
              <span className="font-light">Consórcio </span>
              <span className="font-semibold">Platinum</span>
              <span className="text-white/70"> · By Hirayama</span>
            </p>
            <p className="text-xs sm:text-sm">Criado por Ewerton Hirayama • Todos os direitos reservados.</p>
          </div>
        </AnimatedSection>
      </div>

      {/* Form Modal */}
      <LeadFormModal
        open={showForm}
        onOpenChange={setShowForm}
        title="Agendar Reunião"
        description="Preencha o formulário e entraremos em contato para agendar sua reunião."
        origem="footer"
      />
    </footer>
  );
};

export default Footer;
