import { useState, useEffect } from 'react';

const MOBILE_TABLET_BREAKPOINT = 1024;

/**
 * Returns true when the viewport width is <= 1024px (tablet/mobile).
 * Uses `window.matchMedia` so it reacts to resize / orientation changes.
 */
export const useIsMobile = (
	breakpoint = MOBILE_TABLET_BREAKPOINT
): boolean => {
	const [isMobile, setIsMobile] = useState(() =>
		typeof window !== 'undefined'
			? window.innerWidth <= breakpoint
			: false
	);

	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);

		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

		// Set initial value from the media query
		setIsMobile(mql.matches);

		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	}, [breakpoint]);

	return isMobile;
};
