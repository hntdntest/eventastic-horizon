import React from 'react';
import { Button } from '@/app/components/ui/button';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/app/contexts/useLanguage';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="hero-gradient py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in text-[hsl(var(--heading))]">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in text-[hsl(var(--heading))]" style={{ animationDelay: '0.2s' }}>
            {t('home.hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              asChild
              className="hover:bg-gray-100 border border-white transition duration-200 hover:shadow-lg hover:scale-105"
            >
              <Link href="/events" className="text-[hsl(var(--heading))]">
                <Search className="mr-2 h-4 w-4" />
                {t('home.hero.button.explore')}
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              variant="outline"
              className="border-white text-white bg-white hover:bg-white/90 transition duration-200 hover:shadow-lg hover:scale-105"
            >
              <Link href="/create" className="text-[hsl(var(--heading))]">
                {t('home.hero.button.create')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
