import { useEffect, useState } from 'react';
import { generateSitemap } from '@/utils/generateSitemap';

const Sitemap = () => {
  const [sitemap, setSitemap] = useState<string>('');

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const xml = await generateSitemap();
        setSitemap(xml);
      } catch (error) {
        console.error('Erro ao gerar sitemap:', error);
      }
    };

    fetchSitemap();
  }, []);

  // Retorna o XML como texto
  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
      {sitemap}
    </pre>
  );
};

export default Sitemap;
