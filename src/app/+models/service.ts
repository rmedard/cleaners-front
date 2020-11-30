export interface Service {
  id?: number;
  title: string;
  description: string;
  category: Category;
  isActive: boolean;
}

export enum Category {
  INTERIOR = 'Interieur', EXTERIOR = 'Exterieur'
}
