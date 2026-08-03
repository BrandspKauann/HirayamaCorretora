import { useEffect, useState } from "react";
import { UserCheck, Target, Zap, Award } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const benefits = [
  {
    icon: UserCheck,
    title: "Análise de perfil",
    description:
      "Cada cliente possui objetivos, prazos e capacidades diferentes. A partir disso, estruturamos uma estratégia alinhada ao seu momento e às suas metas.",
  },
  {
    icon: Target,
    title: "Escolha do grupo ideal",
    description:
      "A escolha do grupo impacta diretamente no tempo e na eficiência da contemplação. Por isso, selecionamos opções que estejam coerentes com o seu planejamento financeiro.",
  },
  {
    icon: Zap,
    title: "Estratégia de lance",
    description:
      "A contemplação não deve ser tratada como acaso. Definimos, com critério, o melhor momento e a melhor abordagem para aumentar suas chances de antecipação.",
  },
  {
    icon: Award,
    title: "Acompanhamento até contemplação",
    description:
      "Nosso trabalho não termina na contratação. Acompanhamos cada etapa, oferecendo suporte contínuo até a conquista do seu bem.",
  },
];

const ConsorcioSolution = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);

  // Auto-avança os cards para a direita em loop
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section id="solucao" className="py-16 sm:py-20 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection animationType="slide-up">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Assessoria estratégica do início ao fim
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Não é só um consórcio. É um plano patrimonial estruturado, com acompanhamento até você pegar o bem.
            </p>
          </div>
        </AnimatedSection>

        <Carousel
          className="w-full"
          opts={{
            align: "center",
            loop: true,
            dragFree: true,
          }}
          setApi={setApi}
        >
          <CarouselContent>
            {benefits.map((item, index) => (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-3/4 md:basis-1/2 lg:basis-1/3"
              >
                <AnimatedSection animationType="slide-up" delay={(index + 1) * 80}>
                  <div className="bg-card rounded-xl p-6 sm:p-8 shadow-card border-2 border-primary/30 hover:border-primary transition-all h-full flex flex-col">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default ConsorcioSolution;
