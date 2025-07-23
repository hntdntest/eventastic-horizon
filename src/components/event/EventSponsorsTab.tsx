import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Trash2, Image, Upload, Plus, Users } from "lucide-react";
import { RichTextEditor } from "../ui/rich-text-editor";

interface Sponsor {
  id: string;
  name: MultilingualText;
  level: string;
  website?: string;
  description?: MultilingualText;
  logoUrl?: string;
}

interface EventData {
  sponsors: Sponsor[];
}

interface MultilingualText {
  [languageCode: string]: string;
}

interface Tier {
  id: string;
  name: MultilingualText;
}


interface EventSponsorsTabProps {
  eventData: EventData;
  tiers: Tier[];
  setTiers: React.Dispatch<React.SetStateAction<Tier[]>>;
  newTier: MultilingualText;
  setNewTier: React.Dispatch<React.SetStateAction<MultilingualText>>;
  handleAddTier: () => void;
  handleDeleteTier: (tierId: string) => void;
  newSponsor: Omit<Sponsor, 'id'>;
  setNewSponsor: React.Dispatch<React.SetStateAction<Omit<Sponsor, 'id'>>>;
  handleAddSponsor: () => void;
  handleRemoveSponsor: (sponsorId: string) => void;
  handleImageUpload: (entityType: string, field: string, value: string) => void;
  currentLanguage: string;
  t: (key: string) => string;
  navigateToTab: (tab: string) => void;
}

const EventSponsorsTab: React.FC<EventSponsorsTabProps> = ({
  eventData,
  tiers,
  setTiers,
  newTier,
  setNewTier,
  handleAddTier,
  handleDeleteTier,
  newSponsor,
  setNewSponsor,
  handleAddSponsor,
  handleRemoveSponsor,
  handleImageUpload,
  currentLanguage,
  t,
  navigateToTab,
}) => {
  // Ensure newTier has a value for the current language, but do not reset other language values
  React.useEffect(() => {
    setNewTier(prev => {
      if (prev[currentLanguage] === undefined) {
        return { ...prev, [currentLanguage]: '' };
      }
      return prev;
    });
    // Do not reset newSponsor fields on language change, only update level if needed
  }, [currentLanguage]);

  // Auto-select the first sponsorship level when tiers are updated and newSponsor.level is empty
  React.useEffect(() => {
    if (tiers.length > 0 && !newSponsor.level) {
      setNewSponsor(prev => ({ ...prev, level: tiers[0].name?.[currentLanguage] || '' }));
    }
  }, [tiers, currentLanguage, newSponsor.level, setNewSponsor]);

  return (
    <CardContent className="py-6">
      <div className="space-y-8">
        <h3 className="text-lg font-medium mb-4">{t('organizer.sponsors.title')}</h3>
        {/* Sponsorship Levels management UI */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('organizer.sponsors.levelsTitle') || 'Sponsorship Levels'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTier[currentLanguage] || ''}
                onChange={e => setNewTier(prev => ({ ...prev, [currentLanguage]: e.target.value }))}
                placeholder={t('organizer.sponsors.levelsInputPlaceholder') || 'Enter new sponsorship level'}
                className="w-48"
              />
              <Button onClick={handleAddTier} variant="default">{t('organizer.sponsors.addLevel') || 'Add'}</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tiers.map((tier) => (
                <div key={tier.id} className="flex items-center bg-gray-100 rounded px-3 py-1">
                  <span>{tier.name[currentLanguage] || ''}</span>
                  <Button size="icon" variant="ghost" className="ml-1" onClick={() => handleDeleteTier(tier.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              {tiers.length === 0 && <span className="text-gray-400">{t('organizer.sponsors.noLevels') || 'No sponsorship levels yet.'}</span>}
            </div>
          </CardContent>
        </Card>
        {/* Add new sponsor form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-md">{t('organizer.sponsors.addSponsor')}</CardTitle>
          </CardHeader>
          <CardContent>
            {tiers.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800 text-sm text-center">
                {t('organizer.sponsors.addTierFirst') || 'Please add a sponsorship level before adding sponsors.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-full h-32 bg-slate-100 rounded-md flex items-center justify-center overflow-hidden">
                    {newSponsor.logoUrl ? (
                      <img
                        src={newSponsor.logoUrl}
                        alt="Sponsor logo preview"
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <Image className="h-8 w-8 text-slate-400" />
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleImageUpload('sponsor', 'logoUrl', 'some-url')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {t('organizer.sponsors.uploadLogo')}
                  </Button>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="sponsorName">{t('organizer.sponsors.name')} ({currentLanguage.toUpperCase()})</Label>
                      <Input
                        id="sponsorName"
                        value={newSponsor.name?.[currentLanguage] || ''}
                        onChange={e => setNewSponsor(prev => ({
                          ...prev,
                          name: {
                            ...(prev.name || {}),
                            [currentLanguage]: e.target.value
                          }
                        }))}
                        placeholder={t('organizer.sponsors.name.placeholder')}
                        disabled={tiers.length === 0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sponsorLevel">{t('organizer.sponsors.sponsorLevel') || 'Sponsorship Level'}</Label>
                      <select
                        id="sponsorLevel"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        value={newSponsor.level}
                        onChange={e => setNewSponsor(prev => ({ ...prev, level: e.target.value }))}
                        disabled={tiers.length === 0}
                      >
                        {tiers.map(tier => (
                          <option key={tier.id} value={tier.name[currentLanguage] || ''}>{tier.name[currentLanguage] || ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="sponsorWebsite">{t('organizer.sponsors.website')}</Label>
                      <Input
                        id="sponsorWebsite"
                        value={newSponsor.website}
                        onChange={e => setNewSponsor(prev => ({ ...prev, website: e.target.value }))}
                        placeholder={t('organizer.sponsors.website.placeholder') || 'https://'}
                        disabled={tiers.length === 0}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="sponsorDescription">{t('organizer.sponsors.description')} ({currentLanguage.toUpperCase()})</Label>
                    <RichTextEditor
                      key={`sponsorDescription-${currentLanguage}`}
                      value={newSponsor.description?.[currentLanguage] || ''}
                      onChange={val => setNewSponsor(prev => ({
                        ...prev,
                        description: {
                          ...(prev.description || {}),
                          [currentLanguage]: val
                        }
                      }))}
                      placeholder={t('organizer.sponsors.description.placeholder')}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={() => navigateToTab("tickets")}> 
              {t('organizer.cancel')}
            </Button>
            <Button onClick={handleAddSponsor} className="flex items-center gap-2" disabled={tiers.length === 0 || !newSponsor.level}>
              <Plus size={16} /> {t('organizer.sponsors.add')}
            </Button>
          </CardFooter>
        </Card>
        {/* List sponsors below the add form, in a group card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('organizer.sponsors.listTitle') || t('organizer.sponsors.title') || 'Sponsors'}</CardTitle>
          </CardHeader>
          <CardContent>
            {eventData.sponsors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eventData.sponsors.map(sponsor => (
                  <Card key={sponsor.id} className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 text-destructive opacity-0 group-hover:opacity-100"
                      onClick={() => handleRemoveSponsor(sponsor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardContent className="pt-6 flex items-start gap-4">
                      <div className="w-20 h-20 flex items-center justify-center bg-slate-100 rounded-md overflow-hidden">
                        {sponsor.logoUrl ? (
                          <img src={sponsor.logoUrl} alt={sponsor.name?.[currentLanguage] || ''} className="object-contain w-full h-full" />
                        ) : (
                          <Image className="h-8 w-8 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-base">{sponsor.name?.[currentLanguage] || ''}</span>
                          {sponsor.level && (
                            <Badge variant="outline" className="text-xs">{sponsor.level}</Badge>
                          )}
                        </div>
                        {sponsor.website && (
                          <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline block truncate max-w-xs">{sponsor.website}</a>
                        )}
                        {sponsor.description?.[currentLanguage] && (
                          <div
                            className="text-sm mt-1 text-muted-foreground line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: sponsor.description[currentLanguage] }}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed mt-4">
                <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">{t('organizer.sponsors.noSponsors') || 'No sponsors yet.'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CardContent>
  );
};

export default EventSponsorsTab;
