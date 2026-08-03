import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { LeadFormModal } from "@/components/LeadFormModal";
import { SimulacaoConsorcioModal } from "@/components/SimulacaoConsorcioModal";

const ConsorcioCTA = () => {
  const [showForm, setShowForm] = useState(false);
  const [showSimulacao, setShowSimulacao] = useState(false);

  return (
    <section id="cta" className="py-16 sm:py-20 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection animationType="scale">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Descubra qual consórcio ideal para você
            </h2>
            <p className="text-primary-foreground/90 text-base sm:text-lg mb-8">
              Estruture seu patrimônio com planejamento assertivo e acompanhamento especializado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto min-h-[56px] text-base sm:text-lg px-8 py-6 bg-white text-primary hover:bg-white/95 font-semibold shadow-xl"
                onClick={() => setShowSimulacao(true)}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-h-[56px] text-base sm:text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10"
                onClick={() => setShowForm(true)}
              >
                <Mail className="mr-2 h-5 w-5" />
                Simulação
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <SimulacaoConsorcioModal open={showSimulacao} onOpenChange={setShowSimulacao} />
      <LeadFormModal
        open={showForm}
        onOpenChange={setShowForm}
        title="Solicitar simulação"
        description="Preencha o formulário e entraremos em contato para apresentar as melhores opções de consórcio para você."
        origem="consorcio_cta"
      />
    </section>
  );
};

export default ConsorcioCTA;
