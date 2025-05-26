import React from 'react';
import Link from 'next/link';
import { Calendar } from "lucide-react";
import { useLanguage } from '@/app/contexts/useLanguage';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-oceanBlue" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-oceanBlue to-oceanBlue-dark">
                Eventomorrow
              </span>
            </Link>
            <p className="mt-4 text-gray-600 max-w-md">
              {t('footer.description')}
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">{t('footer.quickLinks')}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/events" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  {t('footer.browseEvents')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  {t('footer.faqs')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Account */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">{t('footer.account')}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/login" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  {t('footer.login')}
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  {t('footer.signup')}
                </Link>
              </li>
              <li>
                <Link href="/organizers" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  {t('footer.forOrganizers')}
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  {t('footer.helpCenter')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              {t('footer.copyright').replace('{year}', currentYear.toString())}
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-oceanBlue transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-oceanBlue transition-colors">
                {t('footer.termsOfService')}
              </Link>
              <Link href="/cookies" className="text-sm text-gray-600 hover:text-oceanBlue transition-colors">
                {t('footer.cookiePolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
