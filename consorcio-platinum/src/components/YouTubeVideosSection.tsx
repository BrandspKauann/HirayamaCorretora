import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Play, Youtube, Loader2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

// Função para extrair ID do YouTube de qualquer formato
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Função para normalizar URL do YouTube
const normalizeYouTubeUrl = (url: string): string => {
  const id = extractYouTubeId(url);
  if (!id) return url;
  return `https://www.youtube.com/watch?v=${id}`;
};

interface VideoInfo {
  title: string;
  thumbnail_url: string;
  author_name: string;
}

interface Video {
  id: string;
  url: string;
  title?: string;
  thumbnail: string;
  embedUrl: string;
  author?: string;
  isLoading?: boolean;
}

interface YouTubeVideosSectionProps {
  videoUrls: string[]; // Array de URLs do YouTube
  title?: string;
  description?: string;
}

const YouTubeVideosSection = ({
  videoUrls,
  title = "Vídeos em Destaque",
  description = "Confira nossos conteúdos em vídeo",
}: YouTubeVideosSectionProps) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Busca informações dos vídeos via oEmbed do YouTube
  useEffect(() => {
    const fetchVideoInfo = async () => {
      setIsLoading(true);
      const videoPromises = videoUrls.map(async (url) => {
        const normalizedUrl = normalizeYouTubeUrl(url.trim());
        const id = extractYouTubeId(normalizedUrl);
        
        if (!id) {
          console.error(`Não foi possível extrair ID do YouTube da URL: ${url}`);
          return null;
        }
        
        console.log(`Processando vídeo YouTube - ID: ${id}, URL: ${normalizedUrl}`);

        // Inicializa com dados básicos - thumbnail padrão do YouTube
        const initialVideo: Video = {
          id,
          url: normalizedUrl,
          thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
          embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1`,
          isLoading: true,
        };

        try {
          // Busca informações via oEmbed do YouTube
          // Usa noembed.com como proxy para evitar problemas de CORS
          const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(normalizedUrl)}`;
          const response = await fetch(oembedUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (response.ok) {
            const data: VideoInfo = await response.json();
            // Sempre usa a URL padrão do YouTube para garantir que funcione
            // O oEmbed pode retornar URLs que não carregam em alguns casos
            return {
              ...initialVideo,
              title: data.title,
              thumbnail: initialVideo.thumbnail, // Sempre usa URL padrão do YouTube
              author: data.author_name,
              isLoading: false,
            };
          } else {
            console.warn(`oEmbed retornou status ${response.status} para vídeo ${id}`);
          }
        } catch (error) {
          console.warn(`Erro ao buscar info do vídeo ${id}:`, error);
          // Continua com dados básicos mesmo se falhar
        }

        // Se falhar, retorna com dados básicos (thumbnail padrão do YouTube sempre funciona)
        return {
          ...initialVideo,
          isLoading: false,
        };
      });

      const results = await Promise.all(videoPromises);
      setVideos(results.filter((v): v is Video => v !== null));
      setIsLoading(false);
    };

    fetchVideoInfo();
  }, [videoUrls]);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  if (isLoading && videos.length === 0) {
    return (
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) return null;

  return (
    <>
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection animationType="slide-up">
            <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <Youtube className="h-12 w-12 text-secondary" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">
                {title}
              </h2>
              <p className="text-base sm:text-lg text-foreground/80">
                {description}
              </p>
            </div>
          </AnimatedSection>

          <Carousel
            opts={{
              align: "start",
              loop: videos.length > 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {videos.map((video, index) => (
                <CarouselItem
                  key={video.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <AnimatedSection
                    animationType="fade"
                    delay={index * 50}
                  >
                    <Card
                      className="overflow-hidden cursor-pointer group border-border/50 hover:border-secondary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_80px_-10px_hsl(280_45%_20%_/_0.6)]"
                      onClick={() => !video.isLoading && handleVideoClick(video)}
                    >
                      <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                        {video.isLoading ? (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                          </div>
                        ) : (
                          <>
                            {/* Thumbnail do YouTube - sempre usa URL padrão garantida */}
                            <img
                              src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                              alt={video.title || "Vídeo do YouTube"}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="eager"
                              crossOrigin="anonymous"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                // Fallback sequencial para diferentes qualidades
                                const target = e.currentTarget;
                                const currentSrc = target.src;
                                
                                console.log(`Thumbnail falhou: ${currentSrc}, tentando fallback...`);
                                
                                if (currentSrc.includes('maxresdefault')) {
                                  target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                                } else if (currentSrc.includes('hqdefault')) {
                                  target.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
                                } else if (currentSrc.includes('mqdefault')) {
                                  target.src = `https://img.youtube.com/vi/${video.id}/default.jpg`;
                                } else {
                                  // Se todos falharem, mostra placeholder
                                  console.warn(`Todas as thumbnails falharam para vídeo ${video.id}`);
                                  target.style.display = 'none';
                                  const placeholder = target.parentElement?.querySelector('.thumbnail-placeholder');
                                  if (placeholder) {
                                    (placeholder as HTMLElement).style.display = 'flex';
                                  }
                                }
                              }}
                              onLoad={() => {
                                console.log(`Thumbnail carregada com sucesso para vídeo ${video.id}`);
                              }}
                            />
                            {/* Placeholder caso todas as thumbnails falhem */}
                            <div className="thumbnail-placeholder hidden absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                              <Youtube className="h-16 w-16 text-primary/50" />
                            </div>
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 group-hover:bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white ml-1" fill="white" />
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 sm:p-5">
                              <p className="text-white text-sm sm:text-base font-semibold line-clamp-2 mb-1">
                                {video.title || "Assistir vídeo"}
                              </p>
                              {video.author && (
                                <p className="text-white/80 text-xs sm:text-sm">
                                  {video.author}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  </AnimatedSection>
                </CarouselItem>
              ))}
            </CarouselContent>
            {videos.length > 1 && (
              <>
                <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-12" />
                <CarouselNext className="hidden sm:flex -right-4 lg:-right-12" />
              </>
            )}
          </Carousel>
        </div>
      </section>

      {/* Modal do Vídeo */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {selectedVideo?.title || "Vídeo do YouTube"}
            </DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={selectedVideo.embedUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YouTubeVideosSection;
