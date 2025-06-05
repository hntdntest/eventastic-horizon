
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/useLanguage';

const GetStarted: React.FC = () => {
  const { t } = useLanguage();

  const benefits = [
    "Create and manage unlimited events",
    "Sell tickets online with low processing fees",
    "Connect with your attendees",
    "Access powerful analytics tools",
    "Send automated email notifications",
    "Mobile-friendly event pages"
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="hero-gradient text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Get Started for Free</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Join thousands of event creators who trust Eventomorrow to bring their events to life.
            </p>
          </div>
        </div>

        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Steps Section */}
              <div className="mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
                  Create Your First Event in Minutes
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Step 1 */}
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold text-xl">1</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
                    <p className="text-gray-600">
                      Sign up with your email address or social media account. It takes less than a minute.
                    </p>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold text-xl">2</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Create Your Event</h3>
                    <p className="text-gray-600">
                      Add your event details, upload images, set ticket types, and customize your event page.
                    </p>
                  </div>
                  
                  {/* Step 3 */}
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold text-xl">3</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Publish & Share</h3>
                    <p className="text-gray-600">
                      Publish your event and share it with your audience through email, social media, or your website.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                  Everything You Need to Succeed
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-lg text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-white rounded-xl p-10 shadow-md border border-gray-100 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Ready to Create Your First Event?
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Join our community of event creators and start planning your next successful event today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/register">
                      Sign Up for Free
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/contact">
                      Contact Sales
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GetStarted;
