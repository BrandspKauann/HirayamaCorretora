import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { ArrowRight, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const DiagnosticSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const whatsappLink = "https://wa.link/3gwhbl";

  const questions = [
    {
      question: "Qual o faturamento anual da sua empresa?",
      options: [
        { value: "below-10", label: "Abaixo de R$ 10 milhões" },
        { value: "10-50", label: "R$ 10 a 50 milhões" },
        { value: "50-200", label: "R$ 50 a 200 milhões" },
        { value: "above-200", label: "Acima de R$ 200 milhões" }
      ]
    },
    {
      question: "Qual o prazo médio de recebimento?",
      options: [
        { value: "0-30", label: "0 a 30 dias" },
        { value: "30-60", label: "30 a 60 dias" },
        { value: "60-90", label: "60 a 90 dias" },
        { value: "90-120", label: "90 a 120 dias" },
        { value: "above-120", label: "Acima de 120 dias" }
      ]
    },
    {
      question: "Qual o ticket médio por cliente?",
      options: [
        { value: "below-10k", label: "Abaixo de R$ 10 mil" },
        { value: "10k-50k", label: "R$ 10 mil a 50 mil" },
        { value: "50k-200k", label: "R$ 50 mil a 200 mil" },
        { value: "above-200k", label: "Acima de R$ 200 mil" }
      ]
    },
    {
      question: "Quantos clientes ativos você possui?",
      options: [
        { value: "below-10", label: "Menos de 10" },
        { value: "10-50", label: "10 a 50" },
        { value: "50-200", label: "50 a 200" },
        { value: "above-200", label: "Mais de 200" }
      ]
    },
    {
      question: "Qual % da receita vem dos 5 maiores clientes?",
      options: [
        { value: "below-30", label: "Menos de 30%" },
        { value: "30-50", label: "30% a 50%" },
        { value: "50-70", label: "50% a 70%" },
        { value: "above-70", label: "Mais de 70%" }
      ]
    },
    {
      question: "Sua empresa exporta?",
      options: [
        { value: "no", label: "Não" },
        { value: "below-2m", label: "Sim, menos de US$ 2 milhões/ano" },
        { value: "above-2m", label: "Sim, acima de US$ 2 milhões/ano" }
      ]
    },
    {
      question: "Já tiveram perdas relevantes por inadimplência?",
      options: [
        { value: "no", label: "Não" },
        { value: "occasional", label: "Ocasionalmente" },
        { value: "frequent", label: "Frequentemente" },
        { value: "major-loss", label: "Sim, perdas significativas" }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    setShowResult(true);
  };

  const isEligible = () => {
    const faturamento = answers[0];
    const exports = answers[5];
    
    return (faturamento === "10-50" || faturamento === "50-200" || faturamento === "above-200") ||
           (exports === "above-2m");
  };

  const resetDiagnostic = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  if (showResult) {
    const eligible = isEligible();
    
    return (
      <section id="diagnostico" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <AnimatedSection animationType="scale">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-gradient-card shadow-premium border-0">
                <CardHeader className="text-center pb-6 sm:pb-8">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    eligible ? 'bg-trust-blue/10' : 'bg-secondary/10'
                  }`}>
                    {eligible ? (
                      <CheckCircle className="h-10 w-10 text-trust-blue" />
                    ) : (
                      <AlertCircle className="h-10 w-10 text-secondary" />
                    )}
                  </div>
                  <CardTitle className={`text-2xl sm:text-3xl md:text-4xl ${eligible ? 'text-trust-blue' : 'text-primary'}`}>
                    {eligible ? 'Parabéns! Sua empresa tem perfil' : 'Sua empresa ainda não tem o perfil ideal'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  {eligible ? (
                    <div className="space-y-6">
                      <p className="text-base sm:text-lg text-corporate-gray leading-relaxed">
                        Com base no diagnóstico, sua empresa atende aos critérios para contratar 
                        o Seguro de Crédito Empresarial da Coface.
                      </p>
                      <div className="space-y-4">
                        <Button 
                          variant="hero" 
                          size="lg" 
                          className="w-full shadow-lg hover:shadow-xl transition-shadow"
                          onClick={() => window.open(whatsappLink, '_blank')}
                        >
                          Agende sua sessão estratégica com a Hirayama Corretora
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button 
                          variant="trust" 
                          size="lg" 
                          className="w-full"
                          onClick={() => window.open(whatsappLink, '_blank')}
                        >
                          Receba uma análise gratuita do perfil da sua empresa
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-base sm:text-lg text-corporate-gray leading-relaxed">
                        Sua empresa ainda não atende aos critérios mínimos para o Seguro de Crédito, 
                        mas a Coface oferece outras soluções que podem ajudar.
                      </p>
                      <div className="space-y-4">
                        <Button 
                          variant="secondary" 
                          size="lg" 
                          className="w-full shadow-md hover:shadow-lg transition-shadow"
                          onClick={() => window.open(whatsappLink, '_blank')}
                        >
                          Conheça o BI Coface (URBA360)
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button 
                          variant="trust" 
                          size="lg" 
                          className="w-full"
                          onClick={() => window.open(whatsappLink, '_blank')}
                        >
                          Falar com especialista
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    onClick={resetDiagnostic}
                    className="mt-6 text-corporate-gray hover:text-primary"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refazer diagnóstico
                  </Button>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section id="diagnostico" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <AnimatedSection animationType="slide-up">
          <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 sm:mb-8">
              Diagnóstico Online
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-corporate-gray leading-relaxed">
              Descubra em 2 minutos se sua empresa tem perfil para o Seguro de Crédito
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animationType="scale" delay={100}>
          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-card shadow-card border-0">
              <CardHeader className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl text-primary">
                    Pergunta {currentQuestion + 1} de {questions.length}
                  </CardTitle>
                  <div className="text-sm sm:text-base text-corporate-gray font-semibold">
                    {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                  </div>
                </div>
                <div className="w-full bg-border rounded-full h-3">
                  <div 
                    className="bg-gradient-cta h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary mb-6 sm:mb-8">
                  {questions[currentQuestion].question}
                </h3>
                
                <RadioGroup
                  value={answers[currentQuestion] || ""}
                  onValueChange={handleAnswer}
                  className="space-y-3 sm:space-y-4"
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-trust-blue hover:bg-muted/50 transition-all cursor-pointer"
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label 
                        htmlFor={option.value} 
                        className="flex-1 cursor-pointer text-sm sm:text-base text-corporate-gray hover:text-primary transition-colors font-medium"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between mt-8 sm:mt-10 gap-4">
                  <Button 
                    variant="ghost" 
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className="text-corporate-gray"
                  >
                    Anterior
                  </Button>
                  <Button 
                    variant="hero" 
                    onClick={nextQuestion}
                    disabled={!answers[currentQuestion]}
                    className="shadow-md hover:shadow-lg transition-shadow"
                  >
                    {currentQuestion === questions.length - 1 ? 'Ver Resultado' : 'Próxima'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default DiagnosticSection;
