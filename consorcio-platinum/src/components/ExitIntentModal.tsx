import { useEffect, useState, useRef } from 'react';
import { LeadFormModal } from './LeadFormModal';

export const ExitIntentModal = () => {
  const [showModal, setShowModal] = useState(false);
  const hasShownRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Rastreamento de engajamento
  const pageLoadTimeRef = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);
  const lastScrollTimeRef = useRef<number>(Date.now());
  const hasScrolledRef = useRef<boolean>(false);
  const mouseInTopZoneRef = useRef<boolean>(false);

  useEffect(() => {
    // Verificar se já mostrou hoje
    const lastShown = localStorage.getItem('exit_intent_shown');
    const today = new Date().toDateString();
    
    // Descomente para ativar verificação diária
    // if (lastShown === today) {
    //   hasShownRef.current = true;
    //   return;
    // }

    // Rastrear scroll para medir engajamento
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      maxScrollRef.current = Math.max(maxScrollRef.current, scrollPercent);
      lastScrollTimeRef.current = Date.now();
      
      if (scrollPercent > 5) {
        hasScrolledRef.current = true;
      }
    };

    // Verificar se pode mostrar o modal (critérios de engajamento)
    const canShowModal = (): boolean => {
      const timeOnPage = (Date.now() - pageLoadTimeRef.current) / 1000; // segundos
      const timeSinceLastScroll = (Date.now() - lastScrollTimeRef.current) / 1000; // segundos
      
      // Critérios mínimos:
      // 1. Pelo menos 30 segundos na página
      // 2. Usuário precisa ter rolado pelo menos 25% da página (ou 5% se a página for muito curta)
      // 3. Não acabou de rolar (pelo menos 2 segundos desde o último scroll)
      // 4. Pelo menos 10 segundos desde que entrou (evitar disparo imediato)
      
      const minTimeOnPage = 30; // 30 segundos
      const minScrollPercent = Math.max(25, maxScrollRef.current > 0 ? 25 : 5); // 25% ou 5% mínimo
      const minTimeSinceScroll = 2; // 2 segundos
      const minTimeSinceEntry = 10; // 10 segundos
      
      const meetsTimeRequirement = timeOnPage >= minTimeOnPage;
      const meetsScrollRequirement = maxScrollRef.current >= minScrollPercent || hasScrolledRef.current;
      const meetsScrollDelay = timeSinceLastScroll >= minTimeSinceScroll;
      const meetsEntryDelay = timeOnPage >= minTimeSinceEntry;
      
      const canShow = meetsTimeRequirement && meetsScrollRequirement && meetsScrollDelay && meetsEntryDelay;
      
      if (!canShow) {
        console.log('⏳ Critérios não atendidos:', {
          timeOnPage: Math.round(timeOnPage),
          scrollPercent: Math.round(maxScrollRef.current),
          timeSinceScroll: Math.round(timeSinceLastScroll),
          meetsTime: meetsTimeRequirement,
          meetsScroll: meetsScrollRequirement,
          meetsDelay: meetsScrollDelay,
          meetsEntry: meetsEntryDelay
        });
      }
      
      return canShow;
    };

    const triggerModal = () => {
      if (!hasShownRef.current && canShowModal()) {
        console.log('🚀 Exit Intent disparado! (critérios atendidos)');
        hasShownRef.current = true;
        setShowModal(true);
        localStorage.setItem('exit_intent_shown', today);
      } else if (!hasShownRef.current) {
        console.log('⏸️ Exit Intent bloqueado - usuário ainda não se engajou o suficiente');
      }
    };

    // Método principal: Detectar mouse saindo pelo topo (quando vai para o X)
    const handleMouseLeave = (e: MouseEvent) => {
      // clientY <= 0 significa que o mouse saiu pela parte superior
      if (e.clientY <= 0 && !hasShownRef.current) {
        console.log('🖱️ Mouse saiu pelo topo - verificando critérios...');
        triggerModal();
      }
    };

    // Detectar quando mouse entra na zona do topo (área do X)
    const handleMouseMove = (e: MouseEvent) => {
      const isInTopZone = e.clientY <= 50; // Primeiros 50 pixels (zona do X)
      
      if (isInTopZone && !mouseInTopZoneRef.current) {
        // Mouse entrou na zona do topo
        mouseInTopZoneRef.current = true;
        console.log('🖱️ Mouse entrou na zona do topo');
        
        // Limpar timeout anterior
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Aguardar 300ms para confirmar que está realmente indo para o X
        timeoutRef.current = setTimeout(() => {
          if (mouseInTopZoneRef.current && !hasShownRef.current) {
            console.log('✅ Mouse confirmado na zona do X - verificando critérios...');
            triggerModal();
          }
        }, 300);
      } else if (!isInTopZone && mouseInTopZoneRef.current) {
        // Mouse saiu da zona do topo
        mouseInTopZoneRef.current = false;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    // Cancelar se mouse voltar
    const handleMouseEnter = () => {
      mouseInTopZoneRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    // Adicionar listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);

    console.log('✅ Exit Intent listeners adicionados (modo inteligente)');

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <LeadFormModal
      open={showModal}
      onOpenChange={setShowModal}
      title="Espere! Descubra como estruturar seu patrimônio"
      description="Receba uma simulação gratuita e descubra qual consórcio ideal para você. Preencha o formulário e entraremos em contato!"
      origem="exit_intent"
    />
  );
};
