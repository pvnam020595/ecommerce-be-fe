export interface MockProduct {
	id: string;
	name: string;
	price: number;
	category: string;
	image: string;
	description: string;
	rating: number;
}

export const mockProducts: MockProduct[] = [
	{
		id: 'prod-1',
		name: 'Wireless Noise-Canceling Headphones',
		price: 199.99,
		category: 'Electronics',
		image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
		description:
			'Premium wireless headphones with industry-leading active noise cancellation.',
		rating: 4.8
	},
	{
		id: 'prod-2',
		name: 'Mechanical Gaming Keyboard',
		price: 129.5,
		category: 'Accessories',
		image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
		description:
			'RGB backlit mechanical keyboard with tactile blue switches.',
		rating: 4.6
	},
	{
		id: 'prod-3',
		name: 'Ultra-Slim Smartwatch',
		price: 249.0,
		category: 'Wearables',
		image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
		description:
			'Fitness tracking smartwatch with AMOLED display and 7-day battery life.',
		rating: 4.7
	}
];

export default mockProducts;
