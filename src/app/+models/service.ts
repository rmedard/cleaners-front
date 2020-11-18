export interface Service {
  id?: number;
  title: string;
  description: string;
  category: Category;
}

export enum Category {
  INTERIOR = 'Interieur', EXTERIOR = 'Exterieur'
}
