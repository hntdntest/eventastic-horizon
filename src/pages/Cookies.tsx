
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/useLanguage';

const Cookies: React.FC = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="hero-gradient text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Cookie Policy</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Learn about how we use cookies and similar technologies on our website.
            </p>
          </div>
        </div>

        <div className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
              <div>
                <p className="text-gray-600 mb-6">
                  <strong>Last updated:</strong> January 1, 2024
                </p>
                <p className="text-gray-600">
                  This Cookie Policy explains how Eventomorrow uses cookies and similar technologies when you visit our website or use our services.
                </p>
              </div>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">What Are Cookies?</h2>
                <p className="text-gray-600">
                  Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners about how users interact with their sites.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Use Cookies</h2>
                <p className="text-gray-600 mb-4">We use cookies for several purposes:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Essential cookies:</strong> These are necessary for the website to function properly</li>
                  <li><strong>Performance cookies:</strong> These help us understand how visitors interact with our website</li>
                  <li><strong>Functionality cookies:</strong> These enable enhanced functionality and personalization</li>
                  <li><strong>Targeting cookies:</strong> These are used to deliver relevant advertisements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Essential Cookies</h3>
                    <p className="text-gray-600 mb-2">These cookies are strictly necessary for the operation of our website. They include:</p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>Authentication cookies that remember you're logged in</li>
                      <li>Security cookies that detect authentication abuses</li>
                      <li>Load balancing cookies that help distribute traffic</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Performance and Analytics Cookies</h3>
                    <p className="text-gray-600 mb-2">These help us understand how our website is performing:</p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>Google Analytics cookies to measure website usage</li>
                      <li>Performance monitoring cookies</li>
                      <li>Error tracking cookies</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Functionality Cookies</h3>
                    <p className="text-gray-600 mb-2">These enhance your experience on our website:</p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>Language preference cookies</li>
                      <li>Theme preference cookies</li>
                      <li>Location cookies for finding nearby events</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Marketing and Advertising Cookies</h3>
                    <p className="text-gray-600 mb-2">These are used to show you relevant advertisements:</p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                      <li>Social media cookies for sharing content</li>
                      <li>Advertising network cookies</li>
                      <li>Remarketing cookies</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Third-Party Cookies</h2>
                <p className="text-gray-600 mb-4">We may also use third-party services that set cookies on our website:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li><strong>Payment processors:</strong> For secure payment processing</li>
                  <li><strong>Social media platforms:</strong> For social sharing functionality</li>
                  <li><strong>Customer support tools:</strong> For providing customer service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Managing Your Cookie Preferences</h2>
                <div className="space-y-4 text-gray-600">
                  <p>You have several options for managing cookies:</p>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Browser Settings</h3>
                    <p className="mb-2">You can control cookies through your browser settings:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Block all cookies</li>
                      <li>Block third-party cookies only</li>
                      <li>Delete cookies when you close your browser</li>
                      <li>Get a warning before cookies are stored</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Opt-Out Tools</h3>
                    <p>You can opt out of certain types of cookies using these tools:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Google Analytics opt-out browser add-on</li>
                      <li>Industry opt-out pages for advertising cookies</li>
                      <li>Your Online Choices (for EU users)</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookie Consent</h2>
                <p className="text-gray-600">
                  When you first visit our website, we will ask for your consent to use non-essential cookies. You can change your preferences at any time by clicking the "Cookie Settings" link in our website footer.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Impact of Disabling Cookies</h2>
                <p className="text-gray-600 mb-4">If you choose to disable cookies, some features of our website may not work properly:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>You may need to log in repeatedly</li>
                  <li>Your preferences may not be saved</li>
                  <li>Some functionality may be limited</li>
                  <li>Personalized content may not be available</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Updates to This Policy</h2>
                <p className="text-gray-600">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please revisit this page regularly to stay informed about our use of cookies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
                <p className="text-gray-600">
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    Email: privacy@eventomorrow.com<br />
                    Address: 123 Event Street, City, State 12345
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cookies;
