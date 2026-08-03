import { Car, Home, Building2, TrendingUp } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";

const WHATSAPP_LINK = "https://wa.link/3gwhbl";

const types = [
  {
    icon: Car,
    title: "Consórcio automóvel",
    description: "Carro, moto ou caminhão com planejamento sem juros.",
  },
  {
    icon: Home,
    title: "Consórcio imobiliário",
    description: "Casa ou apartamento com estratégia de aquisição inteligente.",
  },
  {
    icon: Building2,
    title: "Consórcio empresarial",
    description: "Equipamentos, veículos e estrutura para seu negócio.",
  },
  {
    icon: TrendingUp,
    title: "Consórcio para investimento",
    description: "Diversificação e planejamento patrimonial estruturado.",
  },
];

const ConsorcioTypes = () => {
  return (
    <section id="tipos" className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection animationType="slide-up">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tipos de consórcio
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Encontre a modalidade ideal para o seu objetivo.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {types.map((item, index) => (
            <AnimatedSection key={index} animationType="scale" delay={(index + 1) * 60}>
              <div className="group bg-card border-2 border-primary/20 hover:border-primary rounded-xl p-6 sm:p-8 shadow-card hover:shadow-premium transition-all duration-300 h-full flex flex-col">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base flex-1 mb-6">
                  {item.description}
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  className="relative w-full sm:w-auto mt-auto overflow-hidden border-primary/60 text-primary hover:text-primary-foreground"
                  onClick={() => window.open(WHATSAPP_LINK, "_blank")}
                >
                  <span className="relative z-10">Saber mais</span>
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                </Button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsorcioTypes;
