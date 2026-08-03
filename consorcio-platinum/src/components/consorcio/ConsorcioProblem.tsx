import { AlertCircle, Percent, Calendar, HelpCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const problems = [
  {
    icon: Percent,
    title: "Juros altos estão destruindo o seu dinheiro",
    description:
      "Financiamentos parecem acessíveis no começo, mas no final você pode pagar o dobro ou mais pelo mesmo bem.",
  },
  {
    icon: Calendar,
    title: "Falta de planejamento custa anos da sua vida",
    description:
      "Sem estratégia, você entra em dívidas longas, compromete a renda e adia conquistas que poderiam vir muito antes.",
  },
  {
    icon: HelpCircle,
    title: "A maioria está fazendo tudo no escuro",
    description:
      "Escolhe consórcio errado, entra em grupos ruins, não sabe quando dar lance e demora mais do que o necessário.",
  },
];

const ConsorcioProblem = () => {
  return (
    <section id="problema" className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection animationType="slide-up">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Por que cada vez mais pessoas estão abandonando o financiamento?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              A verdade é simples: quem ainda financia do jeito tradicional está pagando caro — e muitas vezes sem perceber.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {problems.map((item, index) => (
            <AnimatedSection
              key={index}
              animationType="scale"
              delay={(index + 1) * 80}
            >
              <div className="relative bg-card border-2 border-primary/40 hover:border-primary rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-premium hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base flex-1">
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

export default ConsorcioProblem;
