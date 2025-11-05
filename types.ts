
export enum AlcoholType {
  Whiskey = 'Whiskey',
  Vodka = 'Vodka',
  Gin = 'Gin',
  Rum = 'Rum',
  Tequila = 'Tequila',
  Brandy = 'Brandy',
  Liqueur = 'Liqueur',
  Wine = 'Wine',
}

export enum AlcoholCategory {
  Premium = 'Premium',
  Standard = 'Standard',
}

export interface Alcohol {
  id: number;
  name: string;
  brand: string;
  type: AlcoholType;
  price: number;
  category: AlcoholCategory;
  imageUrl: string;
  description: string;
  rating: number; // This can be seen as the "expert" or initial rating
  origin: string;
  abv: number; // Alcohol By Volume
  tastingNotes: string[];
}

export interface User {
  email: string;
  // In a real app, you would not store the password here.
  // This is for simulation purposes only.
  password?: string;
}

export interface Review {
  id: number;
  alcoholId: number;
  userEmail: string;
  rating: number; // 1-5 stars
  comment: string;
  tags: string[];
  date: string;
}

export interface Collection {
    id: string;
    slug: string;
    title: string;
    description: string;
    alcoholIds: number[];
    imageUrl: string;
}

export interface Guide {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string; // Markdown content
    imageUrl: string;
}

export interface NewsArticle {
    id: number;
    title: string;
    url: string;
    source: string;
    date: string; // ISO 8601 format
    snippet: string;
}

export interface CocktailRecipe {
  name: string;
  description: string;
  alcoholType: AlcoholType;
  ingredients: string[];
  instructions: string[];
}
