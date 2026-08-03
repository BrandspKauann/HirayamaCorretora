import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useArticles } from "@/hooks/useArticles";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import type { Article } from "@/types/article";

const ConsorcioBlogPreview = () => {
  const { data: articles, isLoading, isError } = useArticles();
  const navigate = useNavigate();

  const visibleArticles = (articles || []).slice(0, 3);

  const openArticle = (article: Article) => {
    const slugOrId = article.slug || article.id;
    navigate(`/conteudo/${slugOrId}`);
  };

  if (isError) {
    // Se o blog estiver fora do ar, só esconde a dobra para não quebrar a home
    return null;
  }

  return (
    <section id="blog" className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedSection animationType="slide-up">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="flex justify-center mb-4">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              Conteúdos sobre consórcio
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Veja os últimos artigos da nossa biblioteca sobre consórcio automóvel, imobiliário e empresarial.
            </p>
          </div>
        </AnimatedSection>

        {isLoading && (
          <AnimatedSection animationType="fade">
            <div className="flex justify-center py-12 text-muted-foreground text-sm">
              Carregando conteúdos...
            </div>
          </AnimatedSection>
        )}

        {!isLoading && visibleArticles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {visibleArticles.map((article, index) => (
              <AnimatedSection key={article.id} animationType="fade" delay={(index + 1) * 80}>
                <Card className="h-full border border-border/60 shadow-card bg-card/80 backdrop-blur-sm flex flex-col overflow-hidden">
                  <CardContent className="p-6 sm:p-7 flex flex-col h-full">
                    <button
                      className="text-left"
                      onClick={() => openArticle(article)}
                      aria-label={`Abrir ${article.title}`}
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2 font-semibold">
                        {article.category || "Artigo"}
                      </p>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                    </button>

                    <p
                      className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: article.description }}
                    />

                    <div className="flex items-center justify-between pt-2">
                      {article.read_time && (
                        <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          {article.read_time}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto px-0 text-primary hover:text-primary-foreground hover:bg-primary"
                        onClick={() => openArticle(article)}
                      >
                        Ler artigo
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        )}

        {!isLoading && visibleArticles.length === 0 && (
          <AnimatedSection animationType="fade">
            <div className="text-center py-12 text-muted-foreground text-sm">
              Ainda não há artigos publicados. Volte em breve.
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection animationType="fade" delay={120}>
          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => navigate("/conteudo")}
            >
              Ver todos os artigos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ConsorcioBlogPreview;

