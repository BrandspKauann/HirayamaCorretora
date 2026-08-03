import { Quote, Star } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const testimonials = [
  {
    quote: "A assessoria fez toda a diferença. Consegui ser contemplada no consórcio imobiliário com orientação estratégica.",
    author: "Katia Souza",
  },
  {
    quote: "Atendimento profissional e acompanhamento em cada etapa. Recomendo para quem busca planejamento sério.",
    author: "Marcos Marinho",
  },
];

const ConsorcioSocialProof = () => {
  return (
    <section id="depoimentos" className="py-16 sm:py-20 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection animationType="slide-up">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Experiências reais de quem escolheu planejamento inteligente.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {testimonials.map((item, index) => (
            <AnimatedSection key={index} animationType="scale" delay={(index + 1) * 80}>
              <div className="bg-card rounded-xl p-6 sm:p-8 shadow-card border border-border">
                <Quote className="h-10 w-10 text-primary/30 mb-4" />
                <p className="text-foreground text-base sm:text-lg mb-4 italic">
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">— {item.author}</span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animationType="fade" delay={200}>
          <p className="text-center text-muted-foreground text-sm mt-8">
            Anos de experiência em planejamento patrimonial com consórcio.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ConsorcioSocialProof;
