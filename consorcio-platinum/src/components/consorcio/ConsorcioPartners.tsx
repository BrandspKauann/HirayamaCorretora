import { useEffect, useRef } from "react";
import { ArrowRight, BadgeCheck, ShieldCheck } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";

const partners = [
  {
    name: "Porto Consórcio",
    logo: "/imagens/porto.jpg",
    title: "Segurança e tradição",
    description:
      "Uma administradora reconhecida pela solidez e pela confiança construída ao longo do tempo.",
    highlights: ["Marca forte", "Processo seguro", "Estrutura consolidada"],
  },
  {
    name: "Rodobens",
    logo: "/imagens/rodobens.png",
    title: "Flexibilidade e escala",
    description:
      "Uma opção estratégica para quem busca variedade de planos e atuação nacional com credibilidade.",
    highlights: ["Planos flexíveis", "Atuação nacional", "Histórico sólido"],
  },
];

const ConsorcioPartners = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7440/ingest/cb724e8d-923b-4dae-b7fe-74472b594e5f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'23d6a3'},body:JSON.stringify({sessionId:'23d6a3',location:'ConsorcioPartners.tsx:26',message:'Partners section mounted',data:{partnerCount:partners.length},timestamp:Date.now(),runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
  }, []);
  // #endregion

  // #region agent log
  useEffect(() => {
    const el = sectionRef.current;
    fetch('http://127.0.0.1:7440/ingest/cb724e8d-923b-4dae-b7fe-74472b594e5f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'23d6a3'},body:JSON.stringify({sessionId:'23d6a3',location:'ConsorcioPartners.tsx:31',message:'Partners section layout metrics',data:{exists:Boolean(el),top:el?.getBoundingClientRect().top ?? null,height:el?.getBoundingClientRect().height ?? null,display:el ? getComputedStyle(el).display : null,visibility:el ? getComputedStyle(el).visibility : null},timestamp:Date.now(),runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
  }, []);
  // #endregion

  return (
    <section ref={sectionRef} id="parceiros" className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-muted/30">

      <div className="container mx-auto px-4 sm:px-6 relative">
        <AnimatedSection animationType="slide-up">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Parceiros
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Administradoras selecionadas para reforçar confiança, solidez e opções de estratégia no seu planejamento.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {partners.map((partner, index) => (
            <AnimatedSection key={partner.name} animationType="scale" delay={(index + 1) * 80}>
              <div className="group relative h-full overflow-hidden rounded-3xl border-2 border-primary/35 bg-card shadow-premium transition-all duration-300 hover:-translate-y-1 hover:border-primary">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex h-full flex-col p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                        {partner.name}
                      </h3>
                      <p className="mt-1 text-sm sm:text-base text-muted-foreground">
                        {partner.title}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-primary/10 px-3 py-2 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="space-y-4">
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {partner.description}
                      </p>
                      <ul className="space-y-2">
                        {partner.highlights.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-foreground">
                            <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm sm:text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-center md:justify-end">
                      <div className="rounded-2xl border border-primary/15 bg-background/80 p-3 shadow-card">
                        <img
                          src={partner.logo}
                          alt={`Logo ${partner.name}`}
                          className="h-24 w-24 sm:h-28 sm:w-28 object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    <Button
                      size="lg"
                      className="group/btn bg-primary text-primary-foreground hover:bg-primary-hover"
                    >
                      Conhecer {partner.name}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsorcioPartners;
