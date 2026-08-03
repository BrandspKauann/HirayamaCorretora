import type { Article } from "@/types/article";

/**
 * Normaliza texto para comparação (remove acentos, converte para minúsculas, remove caracteres especiais)
 */
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s]/g, " ") // Remove caracteres especiais
    .replace(/\s+/g, " ") // Normaliza espaços
    .trim();
};

/**
 * Extrai palavras-chave de um texto
 */
const extractKeywords = (text: string): Set<string> => {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/).filter((word) => word.length > 2); // Remove palavras muito curtas
  return new Set(words);
};

/**
 * Extrai palavras-chave de uma string de palavras-chave separadas por vírgula
 */
const extractKeywordsFromString = (keywords?: string): Set<string> => {
  if (!keywords) return new Set();
  return new Set(
    keywords
      .split(",")
      .map((k) => normalizeText(k.trim()))
      .filter((k) => k.length > 2)
  );
};

/**
 * Calcula similaridade de Jaccard entre dois conjuntos
 */
const jaccardSimilarity = (set1: Set<string>, set2: Set<string>): number => {
  if (set1.size === 0 && set2.size === 0) return 0;
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
};

/**
 * Calcula similaridade de palavras-chave entre dois artigos
 */
const calculateKeywordSimilarity = (article1: Article, article2: Article): number => {
  const keywords1 = extractKeywordsFromString(article1.seo_keywords);
  const keywords2 = extractKeywordsFromString(article2.seo_keywords);

  // Se ambos têm palavras-chave, calcula similaridade
  if (keywords1.size > 0 && keywords2.size > 0) {
    return jaccardSimilarity(keywords1, keywords2);
  }

  // Se não têm palavras-chave, extrai do título e descrição
  const titleKeywords1 = extractKeywords(article1.title);
  const titleKeywords2 = extractKeywords(article2.title);
  const descKeywords1 = extractKeywords(article1.description);
  const descKeywords2 = extractKeywords(article2.description);

  const titleSim = jaccardSimilarity(titleKeywords1, titleKeywords2);
  const descSim = jaccardSimilarity(descKeywords1, descKeywords2);

  return (titleSim * 0.6 + descSim * 0.4); // Título tem mais peso
};

/**
 * Calcula similaridade de texto usando palavras em comum
 */
const calculateTextSimilarity = (text1: string, text2: string): number => {
  const words1 = extractKeywords(text1);
  const words2 = extractKeywords(text2);
  return jaccardSimilarity(words1, words2);
};

/**
 * Extrai palavras-chave do conteúdo (primeiras 500 palavras para performance)
 */
const extractContentKeywords = (content?: string): Set<string> => {
  if (!content) return new Set();
  // Remove markdown e HTML tags
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, "") // Remove blocos de código
    .replace(/`[^`]+`/g, "") // Remove código inline
    .replace(/<[^>]+>/g, "") // Remove tags HTML
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove links markdown, mantém texto
    .replace(/#{1,6}\s+/g, "") // Remove headers markdown
    .replace(/\*\*([^\*]+)\*\*/g, "$1") // Remove negrito
    .replace(/\*([^\*]+)\*/g, "$1") // Remove itálico
    .substring(0, 2000); // Limita para performance
  
  return extractKeywords(cleanContent);
};

/**
 * Calcula score de similaridade entre dois artigos
 */
const calculateArticleSimilarity = (article1: Article, article2: Article): number => {
  let score = 0;
  let weightSum = 0;

  // 1. Similaridade de palavras-chave (peso: 35%)
  const keywordSim = calculateKeywordSimilarity(article1, article2);
  score += keywordSim * 0.35;
  weightSum += 0.35;

  // 2. Similaridade de título (peso: 20%)
  const titleSim = calculateTextSimilarity(article1.title, article2.title);
  score += titleSim * 0.2;
  weightSum += 0.2;

  // 3. Similaridade de descrição (peso: 15%)
  const descSim = calculateTextSimilarity(article1.description, article2.description);
  score += descSim * 0.15;
  weightSum += 0.15;

  // 4. Similaridade de conteúdo (peso: 15%) - se ambos tiverem conteúdo
  if (article1.content && article2.content) {
    const contentKeywords1 = extractContentKeywords(article1.content);
    const contentKeywords2 = extractContentKeywords(article2.content);
    const contentSim = jaccardSimilarity(contentKeywords1, contentKeywords2);
    score += contentSim * 0.15;
    weightSum += 0.15;
  }

  // 5. Mesma categoria (peso: 10%)
  if (article1.category && article2.category) {
    const category1 = normalizeText(article1.category);
    const category2 = normalizeText(article2.category);
    if (category1 === category2) {
      score += 0.1;
    }
  }
  weightSum += 0.1;

  // 6. Tags em comum (peso: 5%)
  if (article1.tags && article2.tags && article1.tags.length > 0 && article2.tags.length > 0) {
    const tags1 = new Set(article1.tags.map((t) => normalizeText(t)));
    const tags2 = new Set(article2.tags.map((t) => normalizeText(t)));
    const tagSim = jaccardSimilarity(tags1, tags2);
    score += tagSim * 0.05;
  }
  weightSum += 0.05;

  // Normaliza o score
  return weightSum > 0 ? score / weightSum : 0;
};

/**
 * Encontra artigos relacionados baseado em similaridade inteligente
 * @param currentArticle Artigo atual
 * @param allArticles Lista de todos os artigos
 * @param maxResults Número máximo de resultados (padrão: 3)
 * @returns Array de artigos relacionados ordenados por relevância
 */
export const findRelatedArticles = (
  currentArticle: Article | null | undefined,
  allArticles: Article[] | undefined,
  maxResults: number = 3
): Article[] => {
  if (!currentArticle || !allArticles || allArticles.length === 0) {
    return [];
  }

  // Filtra artigos publicados e exclui o artigo atual
  const candidates = allArticles.filter(
    (article) => article.id !== currentArticle.id && article.published
  );

  if (candidates.length === 0) {
    return [];
  }

  // Calcula similaridade para cada candidato
  const articlesWithScore = candidates.map((article) => ({
    article,
    score: calculateArticleSimilarity(currentArticle, article),
  }));

  // Ordena por score (maior primeiro) e pega os top N
  return articlesWithScore
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0) // Remove artigos sem similaridade
    .slice(0, maxResults)
    .map((item) => item.article);
};

