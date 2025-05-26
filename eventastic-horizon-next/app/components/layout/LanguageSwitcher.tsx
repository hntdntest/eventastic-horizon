import React from 'react';
import { Button } from "@/app/components/ui/button";
import { useLanguage } from '@/app/contexts/useLanguage';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  // Function to handle language change
  const handleLanguageChange = (lang: 'en' | 'vi') => {
    setLanguage(lang);
    // Force reload translations by updating localStorage
    localStorage.setItem('language', lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="flex items-center">
          <Globe size={18} />
          <span className="ml-1 md:inline hidden">{language === 'en' ? 'EN' : 'VI'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          <span className={`${language === 'en' ? 'font-bold' : ''}`}>{t('language.en')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('vi')}>
          <span className={`${language === 'vi' ? 'font-bold' : ''}`}>{t('language.vi')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
