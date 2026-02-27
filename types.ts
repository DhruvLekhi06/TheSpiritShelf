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
  detailedDescription: string;
  rating: number; // This can be seen as the "expert" or initial rating
  origin: string;
  abv: number; // Alcohol By Volume
  tastingNotes: string[];
}

export interface User {
  email: string;
  password?: string;
  provider?: 'password' | 'google';
}

export interface Review {
  id: number;
  alcoholId: number;
  userEmail: string;
  rating: number; // Overall average rating
  comment: string;
  tags: string[];
  date: string;
  // New detailed ratings
  priceWorth: number;
  aroma: number;
  taste: number;
  heavenly: number;
  drinkAgain: number;
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
    id: number | string;
    title: string;
    url: string;
    source: string;
    date: string; // ISO 8601 format
    snippet: string;
}

export interface Cocktail {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  compatibleWith: AlcoholType[];
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}


export type PriceBracketKey = 'all' | 'std1' | 'std2' | 'prm1' | 'prm2' | 'prm3';