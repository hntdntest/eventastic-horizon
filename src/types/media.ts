export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'presentation';
  size: number;
  url?: string;
  file?: File;
}

export type Sponsor = {
  id: string;
  name: string;
  level: string; // Cho phép mọi giá trị tier động
  website?: string;
  description?: string;
  logoUrl?: string;
};
