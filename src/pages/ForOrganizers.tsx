
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  CreditCard, 
  Mail, 
  MapPin, 
  Share2, 
  Smartphone, 
  Users 
} from 'lucide-react';
import { useLanguage } from '@/contexts/useLanguage';

const ForOrganizers: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Calendar,
      title: "Event Management",
      description: "Create and manage events of any size, from small meetups to large conferences."
    },
    {
      icon: CreditCard,
      title: "Ticketing & Registration",
      description: "Sell tickets online, track sales, and manage check-ins with our powerful tools."
    },
    {
      icon: Users,
      title: "Attendee Management",
      description: "Keep track of your attendees, communicate with them, and manage their information."
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Get valuable insights into your event performance with our comprehensive analytics tools."
    },
    {
      icon: Mail,
      title: "Marketing & Communication",
      description: "Reach your audience with targeted marketing campaigns and automated notifications."
    },
    {
      icon: Smartphone,
      title: "Mobile Experience",
      description: "Provide a seamless mobile experience for your attendees with our responsive platform."
    },
    {
      icon: MapPin,
      title: "Venue Management",
      description: "Manage your venue details, seating arrangements, and capacity planning all in one place."
    },
    {
      icon: Share2,
      title: "Social Integration",
      description: "Integrate with social media platforms to increase your event's reach and engagement."
    }
  ];

  const testimonials = [
    {
      quote: "Eventomorrow has transformed how we manage our conferences. The platform is intuitive, and the support team is always there when we need them.",
      author: "Sarah Johnson",
      company: "Tech Conferences Inc."
    },
    {
      quote: "We've seen a 40% increase in ticket sales since switching to Eventomorrow. The analytics tools help us make better decisions for our events.",
      author: "Michael Chen",
      company: "Global Events Network"
    },
    {
      quote: "The ease of setting up and managing events on Eventomorrow has saved us countless hours. I wouldn't use any other platform.",
      author: "Emma Rodriguez",
      company: "Community Gatherings"
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="hero-gradient text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">For Event Organizers</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Powerful tools to create, manage, and grow your events with ease.
            </p>
            <Button size="lg" className="mt-8 bg-white text-primary hover:bg-gray-100" asChild>
              <Link to="/register">Get Started Now</Link>
            </Button>
          </div>
        </div>

        <div className="py-20">
          <div className="container mx-auto px-4">
            {/* Features Section */}
            <div className="mb-20">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Everything You Need to Succeed</h2>
                <p className="text-lg text-gray-600">
                  Our comprehensive platform provides all the tools you need to create and manage successful events.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="h-full">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">What Organizers Say</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="h-full">
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg">★</span>
                        ))}
                      </div>
                      <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold text-gray-800">{testimonial.author}</p>
                        <p className="text-gray-500 text-sm">{testimonial.company}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pricing CTA */}
            <div className="bg-white rounded-xl p-10 shadow-md border border-gray-100 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Ready to Elevate Your Events?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of successful event organizers who trust Eventomorrow to power their events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/register">
                    Start for Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">
                    Talk to Sales
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ForOrganizers;
