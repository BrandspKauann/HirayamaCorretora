import { useQuery } from "@tanstack/react-query";
import type { Article } from "@/types/article";

/** Conteúdo do blog não usa mais backend; lista vazia até haver fonte estática/CMS. */
export const useArticles = () => {
  return useQuery({
    queryKey: ["articles", "published", "featured"],
    queryFn: async (): Promise<Article[]> => [],
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllPublishedArticles = () => {
  return useQuery({
    queryKey: ["articles", "published", "all"],
    queryFn: async (): Promise<Article[]> => [],
    staleTime: 5 * 60 * 1000,
  });
};

export const useArticleBySlug = (rawSlug?: string) => {
  const normalized = rawSlug?.trim();

  return useQuery({
    queryKey: ["articles", "detail", normalized],
    enabled: Boolean(normalized),
    queryFn: async (): Promise<Article | null> => null,
  });
};
