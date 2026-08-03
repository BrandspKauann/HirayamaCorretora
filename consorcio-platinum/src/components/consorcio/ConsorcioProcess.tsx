import { Search, FileCheck, Users, Target } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const steps = [
  {
    number: "1",
    icon: Search,
    title: "Entendimento do objetivo",
    description: "Conversamos para entender o que você deseja conquistar.",
  },
  {
    number: "2",
    icon: FileCheck,
    title: "Escolha do consórcio ideal",
    description: "Selecionamos o grupo que melhor se encaixa no seu perfil.",
  },
  {
    number: "3",
    icon: Users,
    title: "Entrada no grupo",
    description: "Processo simples e acompanhado em cada etapa.",
  },
  {
    number: "4",
    icon: Target,
    title: "Estratégia de contemplação",
    description: "Orientação até você ser contemplado.",
  },
];

const ConsorcioProcess = () => {
  return (
    <section id="processo" className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection animationType="slide-up">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Processo simples
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Do primeiro contato até a contemplação, com clareza em cada etapa.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((item, index) => (
            <AnimatedSection key={index} animationType="slide-up" delay={(index + 1) * 60}>
              <div className="relative">
                <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-card h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {item.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsorcioProcess;
