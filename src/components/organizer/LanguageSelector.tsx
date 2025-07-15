import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Plus, X } from 'lucide-react';
import { useLanguage } from '@/contexts/useLanguage';

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onLanguageChange: (languages: string[]) => void;
  currentLanguage: string;
  onCurrentLanguageChange: (language: string) => void;
}

const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguages,
  onLanguageChange,
  currentLanguage,
  onCurrentLanguageChange
}) => {
  const { t } = useLanguage();

  const addLanguage = (langCode: string) => {
    if (!selectedLanguages.includes(langCode)) {
      const newLanguages = [...selectedLanguages, langCode];
      onLanguageChange(newLanguages);
      if (selectedLanguages.length === 0) {
        onCurrentLanguageChange(langCode);
      }
    }
  };

  const removeLanguage = (langCode: string) => {
    const newLanguages = selectedLanguages.filter(lang => lang !== langCode);
    onLanguageChange(newLanguages);
    if (currentLanguage === langCode && newLanguages.length > 0) {
      onCurrentLanguageChange(newLanguages[0]);
    }
  };

  const getLanguageName = (code: string) => {
    return availableLanguages.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return availableLanguages.find(lang => lang.code === code)?.flag || '🌐';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Event Languages</h3>
      </div>

      {/* Selected Languages */}
      {selectedLanguages.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.map((langCode) => (
              <Badge
                key={langCode}
                variant={currentLanguage === langCode ? "default" : "secondary"}
                className="cursor-pointer flex items-center gap-1"
                onClick={() => onCurrentLanguageChange(langCode)}
              >
                <span>{getLanguageFlag(langCode)}</span>
                <span>{getLanguageName(langCode)}</span>
                {currentLanguage === langCode && (
                  <span className="text-xs ml-1">(editing)</span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLanguage(langCode);
                  }}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground">
            Click on a language to edit its content. Remove languages by clicking the X.
          </div>
        </div>
      )}

      {/* Add Language Dropdown */}
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => {
            // Simple dropdown toggle - in a real app you might use a proper dropdown
            const dropdown = document.getElementById('language-dropdown');
            if (dropdown) {
              dropdown.classList.toggle('hidden');
            }
          }}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Language
        </Button>

        <div id="language-dropdown" className="hidden border rounded-md p-2 bg-background shadow-md">
          <div className="grid grid-cols-2 gap-1">
            {availableLanguages
              .filter(lang => !selectedLanguages.includes(lang.code))
              .map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    addLanguage(lang.code);
                    document.getElementById('language-dropdown')?.classList.add('hidden');
                  }}
                  className="flex items-center gap-2 p-2 text-xs hover:bg-muted rounded text-left"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
          </div>
        </div>
      </div>

      {selectedLanguages.length === 0 && (
        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          Add at least one language to start creating your multilingual event content.
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;