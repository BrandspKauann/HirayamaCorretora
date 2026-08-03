import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Play, FileText, BookOpen, Loader2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useArticles } from "@/hooks/useArticles";
import type { Article } from "@/types/article";
import { useNavigate } from "react-router-dom";

const BlogSection = () => {
  const whatsappLink = "https://wa.link/3gwhbl";
  const { data: articles, isLoading, error } = useArticles();
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    return type === "video" ? <Play className="h-5 w-5" /> : <FileText className="h-5 w-5" />;
  };

  const handleArticleClick = (article: Article) => {
    const slugOrId = article.slug || article.id;
    navigate(`/conteudo/${slugOrId}`);
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection animationType="slide-up">
          <div className="text-center mb-16 sm:mb-20 md:mb-24 max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <BookOpen className="h-12 w-12 text-secondary" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 sm:mb-8">
              📌 Blog da Consultoria
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
              Conteúdos práticos sobre benefícios corporativos, legislação, PAT e gestão de RH.
            </p>
          </div>
        </AnimatedSection>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-foreground/80 mb-4">
              Erro ao carregar artigos. Por favor, tente novamente.
            </p>
            <p className="text-sm text-foreground/70">
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
          </div>
        )}

        {articles && articles.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
              {articles.map((article, index) => (
                <AnimatedSection 
                  key={article.id}
                  animationType="fade" 
                  delay={index * 50}
                >
                  <Card 
                    className="bg-card shadow-card transition-all duration-500 border border-border/50 cursor-pointer group h-full flex flex-col hover:-translate-y-1 overflow-hidden hover:shadow-[0_25px_80px_-10px_hsl(280_45%_20%_/_0.6),_0_12px_32px_-6px_hsl(280_45%_20%_/_0.5),_0_4px_16px_-2px_hsl(280_45%_20%_/_0.4)]"
                    onClick={() => handleArticleClick(article)}
                  >
                    <CardContent className="p-0 h-full flex flex-col">
                      {article.image_url && (
                        <div className="w-full overflow-hidden bg-muted" style={{ aspectRatio: '8/3' }}>
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        </div>
                      )}
                      <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4 group-hover:text-secondary transition-colors duration-300 leading-tight">
                          {article.title}
                        </h3>
                      
                        <p 
                          className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6 flex-grow [&_strong]:font-semibold [&_strong]:text-foreground [&_b]:font-semibold [&_b]:text-foreground"
                          dangerouslySetInnerHTML={{ __html: article.description }}
                        />

                        <div className="flex items-center text-secondary font-semibold text-xs sm:text-sm md:text-base group-hover:text-secondary/80 transition-colors duration-300 mt-auto">
                          <span>Ler mais</span>
                          <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/conteudo")}
                className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                Ver mais artigos
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}

        {articles && articles.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-foreground/80">
              Nenhum artigo disponível no momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
