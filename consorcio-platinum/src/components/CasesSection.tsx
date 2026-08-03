import { Card, CardContent } from "./ui/card";
import { TrendingUp, Shield, DollarSign, Building2, Award } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const CasesSection = () => {
  const cases = [
    {
      icon: <Building2 className="h-8 w-8 text-trust-blue" />,
      title: "Indústria Nacional",
      subtitle: "Cliente em RJ",
      result: "90%",
      description: "Indenização de 90%, fluxo de caixa preservado",
      impact: "Empresa manteve operações sem interrupção"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-trust-blue" />,
      title: "Exportador",
      subtitle: "Atraso de 120 dias",
      result: "87%",
      description: "Indenização antecipada de 87%, exportações mantidas",
      impact: "Continuidade nas vendas internacionais"
    },
    {
      icon: <Shield className="h-8 w-8 text-trust-blue" />,
      title: "Caso Americanas",
      subtitle: "Crise de grande magnitude",
      result: "80%",
      description: "Clientes segurados recuperaram até 80% das perdas",
      impact: "Proteção em meio à maior crise do varejo"
    }
  ];

  return (
    <section id="casos" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection animationType="slide-up">
          <div className="text-center mb-16 sm:mb-20 md:mb-24 max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Award className="h-12 w-12 text-secondary" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 sm:mb-8">
              Casos Reais de Sucesso
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-corporate-gray leading-relaxed mb-4">
              Histórias reais de empresas que protegeram seu fluxo de caixa com o Seguro de Crédito Coface.
            </p>
            <p className="text-base sm:text-lg md:text-xl font-semibold text-trust-blue">
              Mesmo empresas centenárias podem cair. Sua empresa está preparada?
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {cases.map((case_, index) => (
            <AnimatedSection 
              key={index}
              animationType="scale" 
              delay={index * 75}
            >
              <Card className="bg-gradient-card shadow-card hover:shadow-premium transition-all duration-300 border-0 overflow-hidden group hover:-translate-y-2">
                <CardContent className="p-0">
                  {/* Header with Result */}
                  <div className="bg-gradient-hero p-6 sm:p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                        {case_.icon}
                      </div>
                      <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-secondary mb-2">
                        {case_.result}
                      </div>
                      <div className="text-sm sm:text-base text-primary-foreground/90 font-medium">
                        de recuperação
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2 sm:mb-3">
                      {case_.title}
                    </h3>
                    <p className="text-sm sm:text-base text-trust-blue font-semibold mb-4 sm:mb-5">
                      {case_.subtitle}
                    </p>
                    <p className="text-sm sm:text-base text-corporate-gray mb-4 sm:mb-6 leading-relaxed">
                      {case_.description}
                    </p>
                    <div className="bg-trust-blue/10 rounded-xl p-4 border-l-4 border-trust-blue">
                      <p className="text-xs sm:text-sm font-semibold text-trust-blue leading-relaxed">
                        {case_.impact}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CasesSection;
