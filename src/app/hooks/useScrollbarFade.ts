import { useEffect } from 'react';

/**
 * useScrollbarFade — tüm scroll olaylarını yakalayıp .jw-scrolling class'ı ekler/kaldırır.
 * CSS transition fade-in/out'u halleder; bu hook yalnızca class yönetimini yapar.
 * Event delegation: tek bir capture listener, tüm DOM'u kapsar.
 */
export function useScrollbarFade() {
  useEffect(() => {
    // WeakMap: element silinince timer referansı otomatik temizlenir
    const timers = new WeakMap<Element, ReturnType<typeof setTimeout>>();

    const handleScroll = (e: Event) => {
      const target = e.target as Element | null;
      if (!target || typeof target.classList === 'undefined') return;

      // Fade-in: class ekle
      target.classList.add('jw-scrolling');

      // Önceki timer varsa iptal et (debounce)
      const existing = timers.get(target);
      if (existing !== undefined) clearTimeout(existing);

      // 800ms sonra class kaldır → CSS fade-out başlar
      const timer = setTimeout(() => {
        target.classList.remove('jw-scrolling');
      }, 800);

      timers.set(target, timer);
    };

    document.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    return () => {
      document.removeEventListener('scroll', handleScroll, { capture: true } as EventListenerOptions);
    };
  }, []);
}
