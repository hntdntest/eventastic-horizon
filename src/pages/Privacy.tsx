
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/useLanguage';

const Privacy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="hero-gradient text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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
                  This Privacy Policy describes how Eventomorrow ("we," "our," or "us") collects, uses, and shares your personal information when you use our website and services.
                </p>
              </div>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Information We Collect</h2>
                <div className="space-y-4 text-gray-600">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Information You Provide</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Account information (name, email address, password)</li>
                      <li>Profile information (bio, profile picture, preferences)</li>
                      <li>Event information when you create events</li>
                      <li>Payment information when you purchase tickets</li>
                      <li>Communications with us (support requests, feedback)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Information We Collect Automatically</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Device information (IP address, browser type, operating system)</li>
                      <li>Usage information (pages visited, time spent, interactions)</li>
                      <li>Location information (if you enable location services)</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Provide and maintain our services</li>
                  <li>Process transactions and send confirmations</li>
                  <li>Communicate with you about your account and our services</li>
                  <li>Personalize your experience and recommend relevant events</li>
                  <li>Improve our services and develop new features</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Share Your Information</h2>
                <div className="space-y-4 text-gray-600">
                  <p>We may share your information in the following situations:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>With event organizers:</strong> When you register for events, your information is shared with the organizer</li>
                    <li><strong>With service providers:</strong> Third-party companies that help us operate our platform</li>
                    <li><strong>For legal reasons:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                    <li><strong>With your consent:</strong> When you explicitly agree to share your information</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Security</h2>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Rights</h2>
                <p className="text-gray-600 mb-4">Depending on your location, you may have the following rights:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your personal information</li>
                  <li>Restrict processing of your information</li>
                  <li>Data portability</li>
                  <li>Object to processing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookies</h2>
                <p className="text-gray-600">
                  We use cookies and similar tracking technologies to improve your experience on our website. You can control cookies through your browser settings, but disabling cookies may affect the functionality of our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Policy</h2>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
                <p className="text-gray-600">
                  If you have questions about this Privacy Policy, please contact us at:
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

export default Privacy;
