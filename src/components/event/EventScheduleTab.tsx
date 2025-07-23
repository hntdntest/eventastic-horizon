import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, List } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';

interface MultilingualText {
  [languageCode: string]: string;
}


export interface Activity {
  id: string;
  title: MultilingualText;
  description?: MultilingualText;
  startTime: string;
  endTime: string;
  type: string;
  location?: MultilingualText;
  speakerIds?: string[];
}

export interface EventDay {
  id: string;
  date: string;
  activities: Activity[];
}


export interface Speaker {
  id: string;
  name: MultilingualText;
  avatarUrl?: string;
}

interface Props {
  eventData: { days: EventDay[]; speakers: Speaker[] };
  currentLanguage: string;
  newActivity: Omit<Activity, 'id'>;
  setNewActivity: React.Dispatch<React.SetStateAction<Omit<Activity, 'id'>>>;
  selectedDayId: string | null;
  setSelectedDayId: (id: string | null) => void;
  handleActivityChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleAddActivity: () => void;
  handleRemoveActivity: (dayId: string, activityId: string) => void;
  handleActivitySpeakerChange: (selected: string[]) => void;
  sortActivitiesByTime: (activities: Activity[]) => Activity[];
  formatTime: (time: string) => string;
  t: (key: string) => string;
  navigateToTab: (tab: string) => void;
}

const EventScheduleTab: React.FC<Props> = ({
  eventData,
  currentLanguage,
  newActivity,
  setNewActivity,
  selectedDayId,
  setSelectedDayId,
  handleActivityChange,
  handleAddActivity,
  handleRemoveActivity,
  handleActivitySpeakerChange,
  sortActivitiesByTime,
  formatTime,
  t,
  navigateToTab,
}) => {
  React.useEffect(() => {
    setNewActivity(prev => {
      const titleObj = typeof prev.title === 'object' && prev.title !== null ? { ...prev.title } : {};
      const descObj = typeof prev.description === 'object' && prev.description !== null ? { ...prev.description } : {};
      const locObj = typeof prev.location === 'object' && prev.location !== null ? { ...prev.location } : {};
      if (titleObj[currentLanguage] === undefined) titleObj[currentLanguage] = '';
      if (descObj[currentLanguage] === undefined) descObj[currentLanguage] = '';
      if (locObj[currentLanguage] === undefined) locObj[currentLanguage] = '';
      return {
        ...prev,
        title: titleObj,
        description: descObj,
        location: locObj,
      };
    });
  }, [currentLanguage, setNewActivity]);

  return (
    <CardContent className="py-6">
      {eventData.days.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">{t('organizer.schedule.setUpTitle')}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('organizer.schedule.dateInfo')}
          </p>
          <Button
            className="mt-4"
            onClick={() => navigateToTab('basic')}
          >
            {t('organizer.schedule.backToBasic')}
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Event schedule by day */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t('organizer.schedule.dayTabs')}</h3>
            <Tabs
              value={selectedDayId || undefined}
              onValueChange={(value) => setSelectedDayId(value)}
              className="mb-6"
            >
              {/* Render day tabs here if needed */}
            </Tabs>
            {eventData.days.map(day => (
              <div key={day.id} className={selectedDayId === day.id ? '' : 'hidden'}>
                {day.activities.length > 0 ? (
                  <div className="space-y-4">
                    {sortActivitiesByTime(day.activities).map(activity => (
                      <Card key={activity.id} className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-destructive"
                          onClick={() => handleRemoveActivity(day.id, activity.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{activity.title && activity.title[currentLanguage]}</p>
                            <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                          </div>
                          {activity.location && (
                            <p className="text-xs text-muted-foreground">{activity.location?.[currentLanguage] || ''}</p>
                          )}
                          {activity.description && activity.description[currentLanguage] && (
                            <div className="text-sm mt-2 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: activity.description[currentLanguage] }} />
                          )}
                          {activity.speakerIds && activity.speakerIds.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-sm font-medium">{t('organizer.schedule.speakers')}:</p>
                              <div className="flex flex-wrap gap-1">
                                {activity.speakerIds.map(speakerId => {
                                  const speaker = eventData.speakers.find(s => s.id === speakerId);
                                  return speaker ? (
                                    <div key={speakerId} className="flex items-center gap-1">
                                      <Avatar className="h-6 w-6 mr-1">
                                        <AvatarImage src={speaker.avatarUrl} alt={speaker.name?.[currentLanguage] || ''} />
                                        <AvatarFallback>{(speaker.name?.[currentLanguage] || '').substring(0, 2).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <Badge variant="secondary" className="mr-1 mb-1">
                                        {speaker.name?.[currentLanguage] || ''}
                                      </Badge>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed">
                    <List className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t('organizer.schedule.noActivities')}
                    </p>
                  </div>
                )}

                {/* Form to add new activity */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-md">{t('organizer.schedule.addActivity')}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t('organizer.schedule.addActivityInfo')}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="activityTitle">{t('organizer.schedule.activityName')} ({currentLanguage.toUpperCase()})</Label>
                        <Input
                          id="activityTitle"
                          name="title"
                          value={newActivity.title[currentLanguage] || ''}
                          onChange={e => setNewActivity(prev => ({
                            ...prev,
                            title: { ...prev.title, [currentLanguage]: e.target.value }
                          }))}
                          placeholder={t('organizer.schedule.activityName.placeholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activityType">{t('organizer.schedule.type')}</Label>
                        <select
                          id="activityType"
                          name="type"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          value={newActivity.type}
                          onChange={handleActivityChange}
                        >
                          <option value="workshop">{t('organizer.schedule.workshop')}</option>
                          <option value="meeting">{t('organizer.schedule.meeting')}</option>
                          <option value="exhibit">{t('organizer.schedule.exhibit')}</option>
                          <option value="networking">{t('organizer.schedule.networking')}</option>
                          <option value="other">{t('organizer.schedule.other')}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="activityStartTime">{t('organizer.schedule.startTime')}</Label>
                        <Input
                          id="activityStartTime"
                          name="startTime"
                          type="time"
                          value={newActivity.startTime}
                          onChange={handleActivityChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activityEndTime">{t('organizer.schedule.endTime')}</Label>
                        <Input
                          id="activityEndTime"
                          name="endTime"
                          type="time"
                          value={newActivity.endTime}
                          onChange={handleActivityChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <Label htmlFor="activityLocation">{t('organizer.schedule.location')} ({currentLanguage.toUpperCase()})</Label>
                          <Input
                            id="activityLocation"
                            name="location"
                            value={newActivity.location?.[currentLanguage] || ''}
                            onChange={e => setNewActivity(prev => ({
                              ...prev,
                              location: { ...prev.location, [currentLanguage]: e.target.value }
                            }))}
                            placeholder={t('organizer.schedule.location.placeholder')}
                          />
                    </div>

                    <div className="space-y-2 mb-4">
                      <Label htmlFor="activityDescription">{t('organizer.schedule.description')} ({currentLanguage.toUpperCase()})</Label>
                      <RichTextEditor
                        key={`activityDescription-${currentLanguage}`}
                        value={newActivity.description[currentLanguage] || ''}
                        onChange={val => setNewActivity(prev => ({
                          ...prev,
                          description: { ...prev.description, [currentLanguage]: val }
                        }))}
                        placeholder={t('organizer.schedule.description.placeholder')}
                      />
                    </div>

                    {eventData.speakers.length > 0 && (
                      <div className="space-y-2">
                        <Label>{t('organizer.schedule.speakers')}</Label>
                        <div className="flex flex-wrap gap-2">
                          {eventData.speakers.map(speaker => (
                            <Badge
                              variant={newActivity.speakerIds?.includes(speaker.id) ? 'default' : 'outline'}
                              key={speaker.id}
                              className="cursor-pointer flex items-center gap-1"
                              onClick={() => {
                                const isSelected = newActivity.speakerIds?.includes(speaker.id);
                                const updated = isSelected
                                  ? newActivity.speakerIds?.filter(id => id !== speaker.id)
                                  : [...(newActivity.speakerIds || []), speaker.id];
                                handleActivitySpeakerChange(updated);
                              }}
                            >
                              <Avatar className="h-4 w-4 mr-1">
                                <AvatarImage src={speaker.avatarUrl} alt={speaker.name?.[currentLanguage] || ''} />
                                <AvatarFallback>{(speaker.name?.[currentLanguage] || '').substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              {speaker.name?.[currentLanguage] || ''}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" onClick={() => navigateToTab('speakers')}>
                      {t('organizer.speakers.backToSpeakers')}
                    </Button>
                    <Button onClick={handleAddActivity} className="flex items-center gap-2">
                      <Plus size={16} /> {t('organizer.schedule.addActivity')}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>

          {/* Overall agenda view */}
          <Separator className="my-8" />
          <div>
            <h3 className="text-lg font-medium mb-4">{t('organizer.schedule.overallAgenda')}</h3>
            {eventData.days.map(day => (
              <div key={day.id} className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Calendar className="h-5 w-5 text-purple-700" />
                  </div>
                  <h4 className="font-medium">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h4>
                </div>
                {day.activities.length > 0 ? (
                  <div className="pl-12 border-l border-gray-200 ml-5 space-y-4">
                    {sortActivitiesByTime(day.activities).map(activity => (
                      <div key={activity.id} className="relative">
                        <div className="absolute -left-[42px] bg-white p-1 rounded border border-gray-200">
                          <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex gap-3 items-start">
                          <div className="bg-slate-50 py-1 px-2 rounded text-xs font-medium text-slate-600 whitespace-nowrap">
                            {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium">{activity.title && activity.title[currentLanguage]}</p>
                              <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                            </div>
                            {activity.location && (
                              <p className="text-xs text-muted-foreground">{activity.location?.[currentLanguage] || ''}</p>
                            )}
                            {activity.description && activity.description[currentLanguage] && (
                              <div className="text-sm mt-2 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: activity.description[currentLanguage] }} />
                            )}
                            {activity.speakerIds && activity.speakerIds.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {activity.speakerIds.map(speakerId => {
                                  const speaker = eventData.speakers.find(s => s.id === speakerId);
                                  return speaker ? (
                                    <div key={speakerId} className="flex items-center">
                                      <Avatar className="h-4 w-4 mr-1">
                                        <AvatarImage src={speaker.avatarUrl} alt={speaker.name?.[currentLanguage] || ''} />
                                        <AvatarFallback>{(speaker.name?.[currentLanguage] || '').substring(0, 2).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <Badge key={speakerId} variant="secondary" className="text-xs">
                                        {speaker.name?.[currentLanguage] || ''}
                                      </Badge>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground ml-12">
                    {t('organizer.schedule.noActivities')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  );
};

export default EventScheduleTab;
