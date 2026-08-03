import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Download, 
  MessageCircle, 
  CheckCircle2, 
  Building2, 
  Users, 
  Smartphone, 
  DollarSign,
  Shield,
  GraduationCap,
  Heart,
  FileText,
  ArrowRight,
  Calendar,
  TrendingUp
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

const SalaryFits = () => {
  const whatsappLink = "https://wa.link/3gwhbl";
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Tentar diferentes nomes de arquivo possíveis (incluindo o nome real do arquivo)
      const possibleFiles = [
        '/pdfs/Apresentação SalaryFits_Hirayama_2024.pdf',
        '/pdfs/salaryfits-informacoes.pdf',
        '/pdfs/salaryfits.pdf',
        '/pdfs/informacoes-salaryfits.pdf',
        '/salaryfits-informacoes.pdf',
        '/salaryfits.pdf'
      ];
      
      let fileFound = false;
      for (const filePath of possibleFiles) {
        try {
          // Usar URL absoluta em produção para evitar problemas com rewrites
          const baseUrl = window.location.origin;
          const fullUrl = `${baseUrl}${filePath}`;
          
          // Usar GET para buscar o arquivo
          const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/pdf'
            }
          });
          
          if (response.ok) {
            // Verificar se a resposta é realmente um PDF (não HTML)
            const contentType = response.headers.get('content-type') || '';
            const blob = await response.blob();
            
            // Verificar se é PDF: Content-Type deve ser application/pdf E o blob deve ser grande o suficiente
            const isPDF = contentType.includes('application/pdf') || 
                          (blob.type === 'application/pdf' && blob.size > 10000) ||
                          (blob.size > 10000 && !contentType.includes('text/html'));
            
            if (isPDF) {
              const url = window.URL.createObjectURL(blob);
              
              // Criar link para download
              const link = document.createElement('a');
              link.href = url;
              link.download = filePath.split('/').pop() || 'salaryfits-informacoes.pdf';
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();
              
              // Limpar
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
              
              fileFound = true;
              console.log(`✅ PDF baixado com sucesso: ${filePath}`);
              break;
            } else {
              console.log(`❌ Resposta não é PDF: ${filePath} (Content-Type: ${contentType}, tipo blob: ${blob.type}, tamanho: ${blob.size})`);
            }
          } else {
            console.log(`❌ Resposta não OK: ${filePath} (status: ${response.status})`);
          }
        } catch (e) {
          console.log(`❌ Erro ao buscar arquivo: ${filePath}`, e);
          continue;
        }
      }
      
      if (!fileFound) {
        alert('Arquivo PDF não encontrado. Por favor, verifique se o arquivo está na pasta public/pdfs/');
      }
    } catch (error) {
      console.error('Erro ao fazer download do PDF:', error);
      alert('Erro ao fazer download do PDF. Por favor, tente novamente.');
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
      }, 1000);
    }
  };

  const handleConsultorClick = () => {
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  const beneficios = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Adiantamento de Salário",
      description: "Sem burocracia, com acesso rápido ao dinheiro quando você precisa"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Cartão Multibenefícios",
      description: "Um único cartão para múltiplos benefícios corporativos"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Descontos em Compras",
      description: "Acesso a descontos exclusivos em diversas categorias"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Terapias Online",
      description: "Cuidado com a saúde mental acessível e conveniente"
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Educação",
      description: "Acesso a cursos e pós-graduações com condições especiais"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Assistência à Saúde e Seguros",
      description: "Proteção completa para você e sua família"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 md:pt-24 pb-12 md:pb-16 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <img 
                src="/salaryfits.png" 
                alt="SalaryFits Logo" 
                className="h-24 w-24 md:h-32 md:w-32 object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  // Tentar JPG se PNG não existir
                  const img = e.target as HTMLImageElement;
                  if (img.src.includes('.png')) {
                    img.src = '/salaryfits.jpg';
                  } else {
                    img.src = '/logo.jpg';
                  }
                }}
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              SalaryFits
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-2">
              Bem-estar financeiro e benefícios para funcionários
            </p>
            <p className="text-sm text-muted-foreground italic mb-8">
              Plataforma tecnológica (fintech + HRTech) que integra empresas, colaboradores e instituições financeiras
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isDownloading ? (
                  <>
                    <Download className="mr-2 h-5 w-5 animate-spin" />
                    Baixando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Mais Informações (PDF)
                  </>
                )}
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleConsultorClick}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar com Consultor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* O que é e como funciona */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              O que é e como funciona
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Benefícios Financeiros</h3>
                      <p className="text-muted-foreground">
                        A SalaryFits disponibiliza produtos e serviços comuns em benefícios corporativos, 
                        mas com foco em melhorar a gestão financeira do colaborador.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Plataforma Digital</h3>
                      <p className="text-muted-foreground">
                        Tudo é acessado por meio de um app e portal digital — o colaborador escolhe 
                        os produtos que quer usar e a forma de pagamento é, grande parte das vezes, 
                        por meio de integração com a folha de pagamento.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Sem Custo para a Empresa</h3>
                      <p className="text-muted-foreground">
                        Para as empresas clientes, a plataforma é gratuita — SalaryFits costuma gerar 
                        receita por meio de parcerias com instituições financeiras e fornecedores, 
                        que pagam pela conexão com os colaboradores.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Disponíveis */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
              Benefícios Disponíveis
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Conheça os principais produtos e serviços oferecidos pela plataforma
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {beneficios.map((beneficio, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {beneficio.icon}
                      </div>
                      <h3 className="text-lg font-semibold">{beneficio.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {beneficio.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Para quem é
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-semibold">Empresas e RH</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    A solução ajuda departamentos de Recursos Humanos a atrair, reter e engajar talentos, 
                    oferecendo benefícios financeiros modernos e flexíveis sem custos adicionais na folha.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Atração de talentos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Retenção de colaboradores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Engajamento da equipe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Sem custos adicionais</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-semibold">Colaboradores</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Os funcionários ganham acesso a serviços que podem ajudar no planejamento financeiro, 
                    evitando apertos de caixa sem recorrer a crédito caro no mercado tradicional.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Planejamento financeiro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Acesso rápido ao dinheiro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Evita crédito caro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Múltiplos benefícios em um só lugar</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Origem e aquisição */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Origem e Aquisição
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">Fundação</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Fundada em <strong>2015 no Brasil</strong> (Nova Lima, Minas Gerais) e operando como 
                    fintech focada em bem-estar financeiro e benefícios via integração com salários.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">Aquisição</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Em <strong>2024 a empresa foi adquirida pela Serasa Experian</strong>, expandindo sua 
                    presença e integrando soluções de crédito e dados à plataforma.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Reputação e mercado */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Reputação e Mercado
            </h2>
            
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Alcance Nacional e Internacional</h3>
                      <p className="text-muted-foreground">
                        A SalaryFits atende milhares de funcionários e várias empresas no Brasil e em outros países, 
                        conectando soluções financeiras diretamente ao salário dos colaboradores.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Boa Reputação</h3>
                      <p className="text-muted-foreground">
                        No site de avaliações Reclame Aqui, a empresa possui respostas para reclamações e 
                        avaliação média razoável, com boa taxa de resolução.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resumo e CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Em Resumo
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              SalaryFits é uma solução moderna que combina tecnologia, benefícios financeiros e integração 
              com empresas para entregar mais controle, economia e bem-estar financeiro aos colaboradores — 
              tudo via um app e portal digital que simplificam e potencializam a experiência do funcionário.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isDownloading ? (
                  <>
                    <Download className="mr-2 h-5 w-5 animate-spin" />
                    Baixando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Baixar Mais Informações
                  </>
                )}
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleConsultorClick}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar com Consultor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SalaryFits;
