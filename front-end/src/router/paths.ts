/**
 * Centralized Application Route Paths
 * Single source of truth for routing across the entire application.
 */
export const PATHS = {
	ROOT: '/',
	TRELLO: {
		ROOT: '/trello',
		BOARDS: '/trello/boards',
		HOME: '/trello/home'
	},
	ECOMMERCE: {
		ROOT: '/ecommerce'
	}
} as const;

export type PlatformKey = 'trello' | 'ecommerce';

export const PLATFORM_ROUTES: Record<PlatformKey, string> = {
	trello: PATHS.TRELLO.ROOT,
	ecommerce: PATHS.ECOMMERCE.ROOT
};
