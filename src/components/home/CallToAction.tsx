
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/useLanguage';

const CallToAction: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">{t('home.cta.title')}</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          {t('home.cta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
            <Link to="/get-started">
              {t('home.cta.button.start')}
            </Link>
          </Button>
          <Button size="lg" asChild className="bg-white text-oceanBlue hover:bg-gray-100">
            <Link to="/for-organizers">
              For Organizers
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
