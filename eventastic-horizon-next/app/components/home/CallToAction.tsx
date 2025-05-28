import React from 'react';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/app/contexts/useLanguage';

const CallToAction: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-[hsl(var(--heading))]">{t('home.cta.title')}</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90 text-[hsl(var(--heading))]">
          {t('home.cta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            asChild
            className="hover:bg-gray-100 border border-white transition duration-200 hover:shadow-lg hover:scale-105"
          >
            <Link href="/signup" className="text-[hsl(var(--heading))]">
              {t('home.cta.button.start')}
            </Link>
          </Button>
          <Button
            size="lg"
            asChild
            variant="outline"
            className="hover:bg-gray-100 border border-white transition duration-200 hover:shadow-lg hover:scale-105"
          >
            <Link href="/contact" className="text-white">
              {t('home.cta.button.contact')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
