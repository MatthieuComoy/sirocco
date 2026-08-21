import { readable } from 'svelte/store';

export type Density = 'mobile' | 'tablet' | 'desktop';

const TABLET_QUERY = '(min-width: 640px)';
const DESKTOP_QUERY = '(min-width: 1024px)';

function computeDensity(): Density {
  if (typeof window === 'undefined') return 'desktop';
  if (window.matchMedia(DESKTOP_QUERY).matches) return 'desktop';
  if (window.matchMedia(TABLET_QUERY).matches) return 'tablet';
  return 'mobile';
}

/** Current layout density profile — drives which sub-components mount, not just their size. */
export const density = readable<Density>(computeDensity(), (set) => {
  if (typeof window === 'undefined') return;

  const tabletMql = window.matchMedia(TABLET_QUERY);
  const desktopMql = window.matchMedia(DESKTOP_QUERY);
  const update = () => set(computeDensity());

  tabletMql.addEventListener('change', update);
  desktopMql.addEventListener('change', update);

  return () => {
    tabletMql.removeEventListener('change', update);
    desktopMql.removeEventListener('change', update);
  };
});
