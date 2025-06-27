
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Image, Video, FileText, File, X, Play, Download } from 'lucide-react';
import { cn } from "@/lib/utils";

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'presentation';
  size: number;
  url?: string;
  file?: File;
}

interface MediaUploadProps {
  onFilesChange?: (files: MediaFile[]) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onFilesChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const getFileType = (file: File): MediaFile['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) return 'document';
    if (file.type.includes('presentation') || file.type.includes('powerpoint') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) return 'presentation';
    return 'document';
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles: MediaFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: getFileType(file),
      size: file.size,
      url: URL.createObjectURL(file),
      file
    }));

    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== id);
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <Image className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'presentation': return <FileText className="h-5 w-5" />;
      case 'document': return <File className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const filterFilesByType = (type: MediaFile['type']) => {
    return uploadedFiles.filter(file => file.type === type);
  };

  const FilePreview: React.FC<{ file: MediaFile }> = ({ file }) => (
    <Card className="relative group">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {file.type === 'image' && file.url ? (
              <img src={file.url} alt={file.name} className="w-12 h-12 object-cover rounded" />
            ) : file.type === 'video' && file.url ? (
              <div className="relative w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                <Play className="h-4 w-4 text-gray-600" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                {getFileIcon(file.type)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFile(file.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const UploadArea = ({ acceptedTypes, title, description }: { acceptedTypes: string; title: string; description: string }) => (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        dragOver ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <input
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
        id={`file-upload-${title.toLowerCase().replace(' ', '-')}`}
      />
      <Button asChild>
        <label htmlFor={`file-upload-${title.toLowerCase().replace(' ', '-')}`} className="cursor-pointer">
          Choose Files
        </label>
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Files ({uploadedFiles.length})</TabsTrigger>
          <TabsTrigger value="images">Images ({filterFilesByType('image').length})</TabsTrigger>
          <TabsTrigger value="videos">Videos ({filterFilesByType('video').length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({filterFilesByType('document').length})</TabsTrigger>
          <TabsTrigger value="presentations">Presentations ({filterFilesByType('presentation').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <UploadArea
            acceptedTypes="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
            title="Upload Any Media"
            description="Drag and drop files here, or click to select files. Supports images, videos, documents, and presentations."
          />
          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-1 gap-3">
              {uploadedFiles.map(file => (
                <FilePreview key={file.id} file={file} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <UploadArea
            acceptedTypes="image/*"
            title="Upload Images"
            description="Upload event photos, logos, banners, and other images (JPG, PNG, GIF, etc.)"
          />
          {filterFilesByType('image').length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filterFilesByType('image').map(file => (
                <Card key={file.id} className="relative group">
                  <CardContent className="p-2">
                    <img src={file.url} alt={file.name} className="w-full h-32 object-cover rounded" />
                    <p className="text-xs text-gray-600 mt-2 truncate">{file.name}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <UploadArea
            acceptedTypes="video/*"
            title="Upload Videos"
            description="Upload event videos, trailers, promotional clips (MP4, AVI, MOV, etc.)"
          />
          {filterFilesByType('video').length > 0 && (
            <div className="grid grid-cols-1 gap-3">
              {filterFilesByType('video').map(file => (
                <FilePreview key={file.id} file={file} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <UploadArea
            acceptedTypes=".pdf,.doc,.docx,.txt"
            title="Upload Documents"
            description="Upload event schedules, terms, information sheets (PDF, DOC, TXT, etc.)"
          />
          {filterFilesByType('document').length > 0 && (
            <div className="grid grid-cols-1 gap-3">
              {filterFilesByType('document').map(file => (
                <FilePreview key={file.id} file={file} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="presentations" className="space-y-4">
          <UploadArea
            acceptedTypes=".ppt,.pptx"
            title="Upload Presentations"
            description="Upload speaker presentations, event slideshows (PPT, PPTX)"
          />
          {filterFilesByType('presentation').length > 0 && (
            <div className="grid grid-cols-1 gap-3">
              {filterFilesByType('presentation').map(file => (
                <FilePreview key={file.id} file={file} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaUpload;