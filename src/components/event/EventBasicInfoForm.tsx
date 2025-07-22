import React from 'react';
import { CardContent } from '@/components/ui/card';
import LanguageSelector from '@/components/organizer/LanguageSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/useLanguage';


interface MultilingualText {
  [languageCode: string]: string;
}

interface EventData {
  title: MultilingualText;
  description: MultilingualText;
  category: string;
  location: MultilingualText;
  startDate: string;
  endDate: string;
  isFreeEvent: boolean;
  // ...other fields as needed
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  eventData: EventData;
  currentLanguage: string;
  selectedLanguages: string[];
  onLanguageChange: (langs: string[]) => void;
  onCurrentLanguageChange: (lang: string) => void;
  handleBasicInfoChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleMultilingualInputChange: (field: string, value: string, lang: string) => void;
  handleCoverImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  coverImage: File | null;
  categoryLoading: boolean;
  categories: Category[];
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleFreeEvent: (checked: boolean) => void;
}

const EventBasicInfoForm: React.FC<Props> = ({
  eventData,
  currentLanguage,
  selectedLanguages,
  onLanguageChange,
  onCurrentLanguageChange,
  handleBasicInfoChange,
  handleMultilingualInputChange,
  handleCoverImageChange,
  coverImage,
  categoryLoading,
  categories,
  handleDateChange,
  handleToggleFreeEvent,
}) => {
  const { t } = useLanguage();
  return (
    <CardContent className="pt-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">{t('organizer.basic.eventName')} ({currentLanguage.toUpperCase()})</Label>
        <Input
          id="title"
          placeholder={t('organizer.basic.eventName.placeholder')}
          value={eventData.title?.[currentLanguage] || ''}
          onChange={handleBasicInfoChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('organizer.basic.description')} ({currentLanguage.toUpperCase()})</Label>
        <RichTextEditor
          value={eventData.description?.[currentLanguage] || ''}
          onChange={val => handleMultilingualInputChange('description', val, currentLanguage)}
          placeholder={t('organizer.basic.description.placeholder')}
        />
      </div>

      <div>
        <Label htmlFor="cover-image">{t('organizer.basic.coverImage')}</Label>
        <div className="mt-2">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="cover-image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              {coverImage ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">{coverImage.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="mb-2 text-gray-400">📷</span>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">{t('organizer.basic.coverImage.upload')}</span>
                  </p>
                  <p className="text-xs text-gray-500">{t('organizer.basic.coverImage.tip')}</p>
                </div>
              )}
              <input
                id="cover-image"
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
            </label>
          </div>
          {coverImage && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(coverImage)}
                alt={t('organizer.basic.coverImage.preview')}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">{t('organizer.basic.category')}</Label>
          <select
            id="category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
            value={eventData.category}
            onChange={handleBasicInfoChange}
            disabled={categoryLoading}
          >
            {categoryLoading ? (
              <option value="">{t('loading')}</option>
            ) : (
              categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))
            )}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">{t('organizer.basic.location')} ({currentLanguage.toUpperCase()})</Label>
          <Input
            id="location"
            placeholder={t('organizer.basic.location.placeholder')}
            value={eventData.location?.[currentLanguage] || ''}
            onChange={handleBasicInfoChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">{t('organizer.basic.startDate')}</Label>
          <Input
            id="startDate"
            type="date"
            value={eventData.startDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">{t('organizer.basic.endDate')}</Label>
          <Input
            id="endDate"
            type="date"
            value={eventData.endDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isFreeEvent"
          checked={eventData.isFreeEvent}
          onCheckedChange={handleToggleFreeEvent}
        />
        <Label htmlFor="isFreeEvent" className="cursor-pointer">{t('organizer.basic.isFreeEvent')}</Label>
      </div>
    </CardContent>
  );
};

export default EventBasicInfoForm;
