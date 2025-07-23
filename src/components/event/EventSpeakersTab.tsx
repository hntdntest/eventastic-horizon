
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Users, Upload, Plus, Trash2 } from "lucide-react";


interface MultilingualText {
  [languageCode: string]: string;
}

interface Speaker {
  id: string;
  name: MultilingualText;
  title: MultilingualText;
  bio?: MultilingualText;
  avatarUrl?: string;
}

interface NewSpeaker {
  name: MultilingualText;
  title: MultilingualText;
  bio?: MultilingualText;
  avatarUrl?: string;
}


interface EventData {
  speakers: Speaker[];
}


interface EventSpeakersTabProps {
  eventData: EventData;
  newSpeaker: NewSpeaker;
  setNewSpeaker: (cb: (prev: NewSpeaker) => NewSpeaker) => void;
  handleRemoveSpeaker: (id: string) => void;
  handleImageUpload: (entityType: string, field: string, value: string) => void;
  handleAddSpeaker: () => void;
  currentLanguage: string;
  t: (key: string) => string;
  navigateToTab: (tab: string) => void;
}

const EventSpeakersTab: React.FC<EventSpeakersTabProps> = ({
  eventData,
  newSpeaker,
  setNewSpeaker,
  handleRemoveSpeaker,
  handleImageUpload,
  handleAddSpeaker,
  currentLanguage,
  t,
  navigateToTab
}) => {
  return (
    <CardContent className="pt-6">
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">{t('organizer.speakers.title')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {eventData.speakers.map((speaker: Speaker) => (
            <Card key={speaker.id} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 text-destructive"
                onClick={() => handleRemoveSpeaker(speaker.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardContent className="pt-6 flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={speaker.avatarUrl} alt={speaker.name?.[currentLanguage] || ''} />
                  <AvatarFallback>{(speaker.name?.[currentLanguage] || '').substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{speaker.name?.[currentLanguage] || ''}</p>
                  <p className="text-sm text-muted-foreground">{speaker.title?.[currentLanguage] || ''}</p>
                  {speaker.bio?.[currentLanguage] && (
                    <div
                      className="text-sm mt-2"
                      dangerouslySetInnerHTML={{ __html: speaker.bio[currentLanguage] }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add new speaker form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-md">{t('organizer.speakers.addSpeaker')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col items-center justify-center gap-2">
                <Avatar className="h-20 w-20">
                  {newSpeaker.avatarUrl ? (
                    <AvatarImage src={newSpeaker.avatarUrl} alt="Speaker avatar" />
                  ) : (
                    <AvatarFallback>
                      <Users className="h-8 w-8" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleImageUpload('speaker', 'avatarUrl', 'some-url')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('organizer.speakers.uploadPhoto')}
                </Button>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="speakerName">{t('organizer.speakers.name')} ({currentLanguage.toUpperCase()})</Label>
                    <Input
                      id="speakerName"
                      value={newSpeaker.name?.[currentLanguage] || ''}
                      onChange={e => setNewSpeaker(prev => ({
                        ...prev,
                        name: { ...prev.name, [currentLanguage]: e.target.value }
                      }))}
                      placeholder={t('organizer.speakers.name.placeholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="speakerTitle">{t('organizer.speakers.title')} ({currentLanguage.toUpperCase()})</Label>
                    <Input
                      id="speakerTitle"
                      value={newSpeaker.title?.[currentLanguage] || ''}
                      onChange={e => setNewSpeaker(prev => ({
                        ...prev,
                        title: { ...prev.title, [currentLanguage]: e.target.value }
                      }))}
                      placeholder={t('organizer.speakers.title.placeholder')}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="speakerBio">{t('organizer.speakers.bio')} ({currentLanguage.toUpperCase()})</Label>
                  <RichTextEditor
                    key={`speakerBio-${currentLanguage}`}
                    value={newSpeaker.bio?.[currentLanguage] || ''}
                    onChange={val => setNewSpeaker(prev => ({
                      ...prev,
                      bio: { ...prev.bio, [currentLanguage]: val }
                    }))}
                    placeholder={t('organizer.speakers.bio.placeholder')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={() => navigateToTab("tickets")}> 
              {t('organizer.cancel')}
            </Button>
            <Button onClick={handleAddSpeaker} className="flex items-center gap-2">
              <Plus size={16} /> {t('organizer.speakers.add')}
            </Button>
          </CardFooter>
        </Card>

        {/* <div className="flex justify-end pt-4">
          <Button onClick={() => navigateToTab("schedule")}> 
            {t('organizer.basic.saveContinue')}
          </Button>
        </div> */}
      </div>
    </CardContent>
  );
};

export default EventSpeakersTab;
