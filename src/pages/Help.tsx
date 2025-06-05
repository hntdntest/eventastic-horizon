
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Book, MessageCircle, Video, FileText, Users, Headphones } from 'lucide-react';
import { useLanguage } from '@/contexts/useLanguage';

const Help: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const helpCategories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of using Eventomorrow",
      articles: [
        "Creating your first account",
        "Understanding user roles",
        "Setting up your profile",
        "Navigating the dashboard"
      ]
    },
    {
      icon: Users,
      title: "For Event Organizers",
      description: "Everything you need to know about organizing events",
      articles: [
        "Creating your first event",
        "Managing event settings",
        "Processing payments",
        "Tracking attendees"
      ]
    },
    {
      icon: MessageCircle,
      title: "For Attendees",
      description: "How to find and attend events",
      articles: [
        "Finding events near you",
        "Registering for events",
        "Managing your tickets",
        "Getting event updates"
      ]
    },
    {
      icon: FileText,
      title: "Account Management",
      description: "Managing your account and preferences",
      articles: [
        "Updating your profile",
        "Changing your password",
        "Managing notifications",
        "Privacy settings"
      ]
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      articles: [
        "Platform overview",
        "Creating events",
        "Managing attendees",
        "Using analytics"
      ]
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "Technical issues and troubleshooting",
      articles: [
        "Common login issues",
        "Payment problems",
        "Browser compatibility",
        "Mobile app support"
      ]
    }
  ];

  const quickActions = [
    {
      title: "Contact Support",
      description: "Get help from our support team",
      action: () => window.location.href = '/contact',
      buttonText: "Contact Us"
    },
    {
      title: "Frequently Asked Questions",
      description: "Find answers to common questions",
      action: () => window.location.href = '/faq',
      buttonText: "View FAQs"
    },
    {
      title: "Community Forum",
      description: "Connect with other users",
      action: () => window.open('https://community.eventomorrow.com', '_blank'),
      buttonText: "Join Forum"
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="hero-gradient text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Help Center</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 mb-8">
              Find answers, get support, and learn how to make the most of Eventomorrow
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-4 text-lg bg-white text-gray-800"
              />
            </div>
          </div>
        </div>

        <div className="py-20">
          <div className="container mx-auto px-4">
            {/* Quick Actions */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {quickActions.map((action, index) => (
                  <Card key={index} className="text-center h-full">
                    <CardHeader>
                      <CardTitle className="text-xl">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={action.action} className="w-full">
                        {action.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Help Categories */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Browse Help Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {helpCategories.map((category, index) => (
                  <Card key={index} className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <category.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.articles.map((article, articleIndex) => (
                          <li key={articleIndex}>
                            <button className="text-left text-primary hover:underline text-sm">
                              {article}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Popular Articles */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Popular Articles</h2>
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "How to create your first event",
                    "Setting up payment processing",
                    "Managing event attendees",
                    "Understanding analytics dashboard",
                    "Customizing event pages",
                    "Handling refunds and cancellations"
                  ].map((article, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                      <h3 className="font-semibold text-gray-800 mb-2">{article}</h3>
                      <p className="text-gray-600 text-sm">Learn how to {article.toLowerCase()} with step-by-step instructions.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Still Need Help */}
            <div className="mt-20 text-center">
              <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto shadow-sm">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Still need help?</h3>
                <p className="text-gray-600 mb-6">
                  Can't find what you're looking for? Our support team is here to help you get the most out of Eventomorrow.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => window.location.href = '/contact'}>
                    Contact Support
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/faq'}>
                    View All FAQs
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

export default Help;
