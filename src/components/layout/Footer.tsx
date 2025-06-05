
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from "lucide-react";
import { useLanguage } from '@/contexts/useLanguage';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
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
                <Link to="/events" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  {t('footer.browseEvents')}
                </Link>
              </li>
              <li>
                <Link to="/for-organizers" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  For Organizers
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-oceanBlue transition-colors">
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
                <Link to="/login" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  {t('footer.login')}
                </Link>
              </li>
              <li>
                <Link to="/get-started" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/for-organizers" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  {t('footer.forOrganizers')}
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-600 hover:text-oceanBlue transition-colors">
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
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-oceanBlue transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-oceanBlue transition-colors">
                {t('footer.termsOfService')}
              </Link>
              <Link to="/cookies" className="text-sm text-gray-600 hover:text-oceanBlue transition-colors">
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
