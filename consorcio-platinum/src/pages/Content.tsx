import { useAllPublishedArticles } from "@/hooks/useArticles";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Article } from "@/types/article";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Content = () => {
  const { data: articles, isLoading, error, isError } = useAllPublishedArticles();
  const navigate = useNavigate();
  const hasArticles = Boolean(articles && articles.length > 0);
  const showEmpty = !isLoading && !isError && !hasArticles;

  const openArticle = (article: Article) => {
    const slugOrId = article.slug || article.id;
    navigate(`/conteudo/${slugOrId}`);
  };

  return (
    <>
      <SEO 
        title="Blog | Consórcio Platinum"
        description="Artigos e conteúdos sobre consórcio automóvel, imobiliário, empresarial e planejamento patrimonial."
        keywords="blog consórcio, artigos consórcio, planejamento patrimonial, consórcio automóvel, consórcio imobiliário"
        url="/conteudo"
      />
      <div className="min-h-screen bg-background">
        <Header />
        <section className="min-h-screen bg-background pt-16 md:pt-20">
          <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24">
            <ErrorBoundary
              fallback={
                <div className="text-center py-20 space-y-4">
                  <p className="text-muted-foreground">Erro ao carregar o blog.</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Recarregar
                  </Button>
                </div>
              }
            >
              <AnimatedSection animationType="slide-up">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                  <div className="flex justify-center mb-6">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4 font-semibold">
                    Blog Consórcio Platinum
                  </p>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                    Conteúdos sobre consórcio e planejamento patrimonial
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Artigos, dicas e guias para você entender consórcio automóvel, imobiliário e empresarial.
                  </p>
                </div>
              </AnimatedSection>

              {isLoading && (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {isError && (
                <div className="text-center py-20 space-y-4">
                  <p className="text-muted-foreground">Não foi possível carregar os conteúdos.</p>
                  <p className="text-sm text-muted-foreground">
                    {error instanceof Error ? error.message : "Erro desconhecido"}
                  </p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Tentar novamente
                  </Button>
                </div>
              )}

              {hasArticles && articles && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {articles.map((article, index) => (
                    <AnimatedSection key={article.id} animationType="fade" delay={index * 50}>
                      <Card className="border border-border/50 shadow-card bg-card transition-all duration-500 h-full flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-lg cursor-pointer group">
                        {article.image_url && (
                          <div className="w-full overflow-hidden bg-muted" style={{ aspectRatio: "8/3" }}>
                            <img
                              src={article.image_url}
                              alt={article.title}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-out"
                            />
                          </div>
                        )}
                        <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                          <button
                            className="text-left"
                            onClick={() => openArticle(article)}
                            aria-label={`Abrir ${article.title}`}
                          >
                            <h2 className="text-xl sm:text-2xl font-bold text-foreground hover:text-primary transition-colors duration-300 mb-4">
                              {article.title}
                            </h2>
                          </button>

                          <p
                            className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow [&_strong]:font-semibold [&_strong]:text-foreground [&_b]:font-semibold [&_b]:text-foreground"
                            dangerouslySetInnerHTML={{ __html: article.description }}
                          />

                          <Button
                            variant="ghost"
                            className="justify-start px-0 text-primary hover:text-primary/90 mt-auto font-semibold"
                            onClick={() => openArticle(article)}
                          >
                            Ler mais
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                          </Button>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  ))}
                </div>
              )}

              {showEmpty && (
                <div className="text-center py-20 text-muted-foreground">
                  <p>Ainda não há artigos publicados. Volte em breve.</p>
                </div>
              )}
            </ErrorBoundary>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Content;

