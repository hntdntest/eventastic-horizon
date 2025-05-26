import React from 'react';
import { Calendar, Users, Search } from 'lucide-react';
import { useLanguage } from '@/app/contexts/useLanguage';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-primary" />, 
      title: t('features.feature1.title'),
      description: t('features.feature1.desc'),
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />, 
      title: t('features.feature2.title'),
      description: t('features.feature2.desc'),
    },
    {
      icon: <Search className="h-6 w-6 text-primary" />, 
      title: t('features.feature3.title'),
      description: t('features.feature3.desc'),
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('features.title')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="animated-element" style={{ animationDelay: `${index * 0.1}s` }}>
              <Feature {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
