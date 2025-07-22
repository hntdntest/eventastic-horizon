import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Image, Upload, Trash2, Plus } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface ExhibitionBooth {
  id?: string;
  name: string;
  company: string;
  description?: string;
  location?: string;
  coverImageUrl?: string;
}

interface EventBoothsTabProps {
  eventData: { booths: ExhibitionBooth[] };
  newBooth: ExhibitionBooth;
  setNewBooth: React.Dispatch<React.SetStateAction<ExhibitionBooth>>;
  handleAddBooth: () => void;
  handleRemoveBooth: (id: string) => void;
  handleImageUpload: (entityType: string, field: string, value: string) => void;
  currentLanguage: string;
  t: (key: string) => string;
}

const EventBoothsTab: React.FC<EventBoothsTabProps> = ({
  eventData,
  newBooth,
  setNewBooth,
  handleAddBooth,
  handleRemoveBooth,
  handleImageUpload,
  currentLanguage,
  t
}) => {
  return (
    <CardContent className="py-6">
      <div className="space-y-8">
        <h3 className="text-lg font-medium mb-4">{t('organizer.booths.title')}</h3>

        {/* Display exhibition booths */}
        {eventData.booths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eventData.booths.map(booth => (
              <Card key={booth.id} className="relative overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 text-destructive z-10 bg-white/80 hover:bg-white"
                  onClick={() => handleRemoveBooth(booth.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="w-full h-36 relative">
                  <img
                    src={booth.coverImageUrl || "/placeholder.svg"}
                    alt={booth.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="pt-4">
                  <h4 className="font-semibold">{booth.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{booth.company}</p>
                  {booth.location && (
                    <p className="text-xs flex items-center gap-1 mb-2">
                      <Building className="h-3 w-3" /> {booth.location}
                    </p>
                  )}
                  {booth.description && <p className="text-sm">{booth.description}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed">
            <Building className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {t('organizer.booths.noBooths')}
            </p>
          </div>
        )}

        {/* Add new booth form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-md">{t('organizer.booths.addBooth')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-full h-32 bg-slate-100 rounded-md flex items-center justify-center overflow-hidden">
                  {newBooth.coverImageUrl ? (
                    <img
                      src={newBooth.coverImageUrl}
                      alt="Booth cover preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Image className="h-8 w-8 text-slate-400" />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleImageUpload('booth', 'coverImageUrl', 'some-url')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('organizer.booths.uploadCover')}
                </Button>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="boothName">{t('organizer.booths.boothName')} ({currentLanguage.toUpperCase()})</Label>
                    <Input 
                      id="boothName" 
                      value={newBooth.name} 
                      onChange={(e) => setNewBooth(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('organizer.booths.boothName.placeholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="boothCompany">{t('organizer.booths.company')} ({currentLanguage.toUpperCase()})</Label>
                    <Input 
                      id="boothCompany" 
                      value={newBooth.company} 
                      onChange={(e) => setNewBooth(prev => ({ ...prev, company: e.target.value }))}
                      placeholder={t('organizer.booths.company.placeholder')}
                    />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="boothLocation">{t('organizer.booths.location')}</Label>
                  <Input
                    id="boothLocation"
                    value={newBooth.location}
                    onChange={(e) => setNewBooth(prev => ({ ...prev, location: e.target.value }))}
                    placeholder={t('organizer.booths.location.placeholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="boothDescription">{t('organizer.booths.description')} ({currentLanguage.toUpperCase()})</Label>
                  <RichTextEditor
                    key={`boothDescription-${currentLanguage}`}
                    value={newBooth.description}
                    onChange={val => setNewBooth(prev => ({ ...prev, description: val }))}
                    placeholder={t('organizer.booths.description.placeholder')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button onClick={handleAddBooth} className="flex items-center gap-2">
              <Plus size={16} /> {t('organizer.booths.add')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </CardContent>
  );
};

export default EventBoothsTab;
