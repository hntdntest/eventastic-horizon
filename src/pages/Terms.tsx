
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/useLanguage';

const Terms: React.FC = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="hero-gradient text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Please read these terms carefully before using our services.
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
                  These Terms of Service ("Terms") govern your use of the Eventomorrow website and services ("Service") operated by Eventomorrow ("us", "we", or "our").
                </p>
              </div>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using our Service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Use License</h2>
                <div className="space-y-4 text-gray-600">
                  <p>Permission is granted to temporarily use our Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>modify or copy the materials</li>
                    <li>use the materials for any commercial purpose or for any public display</li>
                    <li>attempt to reverse engineer any software contained on our Service</li>
                    <li>remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                  <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">User Accounts</h2>
                <div className="space-y-4 text-gray-600">
                  <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Safeguarding the password that you use to access the Service</li>
                    <li>All activities that occur under your account</li>
                    <li>Immediately notifying us of any unauthorized uses of your account</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Creation and Management</h2>
                <div className="space-y-4 text-gray-600">
                  <p>As an event organizer, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate and complete information about your events</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Respect the intellectual property rights of others</li>
                    <li>Not create events that promote illegal activities, hate speech, or discrimination</li>
                    <li>Honor your commitments to event attendees</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Terms</h2>
                <div className="space-y-4 text-gray-600">
                  <p>For paid events:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Payment processing fees may apply</li>
                    <li>Refunds are subject to the organizer's refund policy</li>
                    <li>We are not responsible for refund disputes between organizers and attendees</li>
                    <li>All payments are processed securely through our payment partners</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Prohibited Uses</h2>
                <div className="space-y-4 text-gray-600">
                  <p>You may not use our Service:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                    <li>To upload or transmit viruses or any other type of malicious code</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Disclaimer</h2>
                <p className="text-gray-600">
                  The information on this Service is provided on an 'as is' basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms related to our Service and the use of this Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitations</h2>
                <p className="text-gray-600">
                  In no event shall Eventomorrow or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use our Service, even if we have been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Governing Law</h2>
                <p className="text-gray-600">
                  These terms and conditions are governed by and construed in accordance with the laws of the State and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to Terms</h2>
                <p className="text-gray-600">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    Email: legal@eventomorrow.com<br />
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

export default Terms;
