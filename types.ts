import type React from 'react';

export enum IngredientName {
  BOTTOM_BUN = 'bottom-bun',
  PATTY = 'patty',
  CHEESE = 'cheese',
  LETTUCE = 'lettuce',
  TOMATO = 'tomato',
  PICKLES = 'pickles',
  TOP_BUN = 'top-bun',
}

export interface Ingredient {
  name: IngredientName;
  label: string;
  component: React.FC<{ className?: string }>;
  height: number;
}

export enum GameState {
  START = 'start',
  PLAYING = 'playing',
  SUCCESS = 'success',
  FAILURE = 'failure',
}
