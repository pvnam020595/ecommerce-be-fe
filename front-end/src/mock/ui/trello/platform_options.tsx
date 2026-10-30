import type { PlatformKey } from '@router/paths';

export interface PlatformOption {
	key: PlatformKey;
	label: string;
	btnClass: string;
}

export const PLATFORM_OPTIONS: PlatformOption[] = [
	{ key: 'trello', label: 'Trello', btnClass: 'btn-primary' },
	{ key: 'ecommerce', label: 'Ecommerce', btnClass: 'btn-success' }
];

export default PLATFORM_OPTIONS;
