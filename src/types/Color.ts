export interface ColorCollection {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Color {
  id: string;
  name: string;
  ncsCode: string;
  colorCode: string;
  rgbCode: string;
  hexColor: string;
  category: string;
  collectionId: string;
  collection?: ColorCollection;
  createdAt: Date;
  updatedAt: Date;
} 