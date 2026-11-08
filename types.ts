/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Language } from './i18n';

export interface ProductColorOption {
  id: string;
  nameEn: string;
  nameAr: string;
  hex: string;
  textColor?: string;
  typeNoteEn?: string;
  typeNoteAr?: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  category: 'Audio' | 'Wearable' | 'Mobile' | 'Home' | 'Apparel' | 'Equipment' | 'Accessories' | 'Footwear';
  imageUrl: string;
  gallery?: string[];
  features: string[];
  colors?: ProductColorOption[];
  selectedColor?: string;
  genders?: ('men' | 'women')[];
  selectedGender?: 'men' | 'women';
  size?: string;
  menEditionDetailEn?: string;
  menEditionDetailAr?: string;
  womenEditionDetailEn?: string;
  womenEditionDetailAr?: string;
  menImageUrl?: string;
  womenImageUrl?: string;
  isWomenOnly?: boolean;
  isMenOnly?: boolean;
  isUnisex?: boolean;
}

export interface JournalArticle {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: React.ReactNode;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'product', product: Product; previousView?: 'products' | 'options' | 'home' }
  | { type: 'journal', article: JournalArticle }
  | { type: 'checkout' }
  | { type: 'profile' }
  | { type: 'auraVisualizer' }
  | { type: 'yardEngine' }
  | { type: 'arena' }
  | { type: 'aiCoach' }
  | { type: 'products' }
  | { type: 'leaderboard' }
  | { type: 'about' }
  | { type: 'tickets' }
  | { type: 'options' }
  | { type: 'sleepStudies' }
  | { type: 'injuryPrediction' }
  | { type: 'subscriberTiers' }
  | { type: 'championStory' }
  | { type: 'customClub' }
  | { type: 'yardCamp' }
  | { type: 'bazaruto' }
  | { type: 'ownerDashboard'; initialTab?: 'photos' | 'sections' | 'payments' | 'videos' | 'articles' };

export interface FitnessDataPoint {
  day: string;
  powerLevel: number;
  calories: number;
  workoutMinutes: number;
  auraScore: number;
}

export interface AttributeData {
  attribute: string;
  score: number;
  fullMark: number;
}

