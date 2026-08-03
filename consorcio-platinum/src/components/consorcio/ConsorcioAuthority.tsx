import { Award, CheckCircle2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const certifications = [
  "Certificação oficial em consórcios",
  "Formação em planejamento patrimonial",
  "Estratégias avançadas de contemplação",
  "Reconhecimentos e prêmios na área",
];

const ConsorcioAuthority = () => {
  return (
    <section id="autoridade" className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Background com gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" aria-hidden />
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <AnimatedSection animationType="slide-up">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
              Especialistas certificados
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Parcerias com grandes administradoras, certificações reconhecidas e atuação alinhada às melhores práticas do mercado.
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-10 sm:space-y-12 max-w-4xl mx-auto">
          {/* Ewerton Hirayama - especialista */}
          <AnimatedSection animationType="slide-up" delay={50}>
            <div className="relative bg-gradient-to-br from-card to-primary/5 rounded-2xl px-5 py-4 sm:px-6 sm:py-5 shadow-premium border-2 border-primary/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                      <Award className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                        Ewerton Hirayama
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Especialista em consórcios e planejamento patrimonial
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {certifications.map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-foreground font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-shrink-0 self-center">
                  <img
                    src="/consorcio/imagens/hirayama.jpg"
                    alt="Foto de Ewerton Hirayama"
                    className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl object-cover shadow-card border border-primary/20"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ConsorcioAuthority;
