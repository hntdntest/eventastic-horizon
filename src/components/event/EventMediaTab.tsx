import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Image } from "lucide-react";
import MediaUpload from "@/components/organizer/MediaUpload";

interface EventData {
  media?: string[];
}

type MediaFile = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'presentation';
  size: number;
  url?: string;
  file?: File;
};

interface EventMediaTabProps {
  eventData: EventData;
  handleMediaFilesChange: (files: MediaFile[]) => void;
  t: (key: string) => string;
}

const EventMediaTab: React.FC<EventMediaTabProps> = ({ eventData, handleMediaFilesChange, t }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          {t('organizer.media.title') || 'Event Media'}
        </CardTitle>
        <CardDescription>
          {t('organizer.media.description') || 'Upload images, videos, documents, and presentations for your event'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MediaUpload onFilesChange={handleMediaFilesChange} />
      </CardContent>
    </Card>
  );
};

export default EventMediaTab;
