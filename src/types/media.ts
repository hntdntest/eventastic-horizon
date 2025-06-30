export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'presentation';
  size: number;
  url?: string;
  file?: File;
}
