
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Award, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/useLanguage';

const About: React.FC = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe in bringing people together through meaningful events and experiences."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We constantly innovate to provide the best event management platform for organizers and attendees."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our platform and customer service."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We are passionate about creating memorable experiences and helping events succeed."
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="hero-gradient text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About Eventomorrow</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Empowering event organizers and connecting communities through innovative event management solutions.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Eventomorrow, we believe that great events have the power to bring people together, 
                create lasting memories, and build stronger communities. Our mission is to provide event 
                organizers with the tools they need to create exceptional experiences while making it 
                easy for attendees to discover and participate in events they love.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {values.map((value, index) => (
                <Card key={index} className="text-center h-full">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Story Section */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
              <div className="prose prose-lg mx-auto text-gray-600">
                <p>
                  Founded in 2024, Eventomorrow was born from the realization that event management 
                  shouldn't be complicated. Our founders, experienced event organizers themselves, 
                  understood the challenges of coordinating successful events and wanted to create 
                  a platform that would simplify the entire process.
                </p>
                <p>
                  From small community gatherings to large-scale conferences, we've designed our 
                  platform to scale with your needs. Whether you're organizing your first event 
                  or your hundredth, Eventomorrow provides the tools, insights, and support you 
                  need to succeed.
                </p>
                <p>
                  Today, thousands of organizers trust Eventomorrow to power their events, and 
                  we're proud to be part of their success stories. We continue to innovate and 
                  improve our platform based on feedback from our community of organizers and attendees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
