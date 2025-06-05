
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/useLanguage';

const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account?",
          answer: "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details and choose whether you want to be an attendee or organizer."
        },
        {
          question: "What's the difference between attendee and organizer accounts?",
          answer: "Attendee accounts are for those who want to discover and attend events. Organizer accounts provide tools to create, manage, and promote events. You can switch between roles at any time."
        },
        {
          question: "Is Eventomorrow free to use?",
          answer: "Yes! Creating an account and browsing events is completely free. Organizers may pay fees for premium features or processing payments for paid events."
        }
      ]
    },
    {
      category: "For Event Organizers",
      questions: [
        {
          question: "How do I create my first event?",
          answer: "After creating an organizer account, go to your dashboard and click 'Create Event'. Fill in the event details, set your pricing, and publish when ready."
        },
        {
          question: "Can I sell tickets through Eventomorrow?",
          answer: "Yes! Our platform supports both free and paid events. You can set ticket prices, manage inventory, and process payments securely."
        },
        {
          question: "How do I promote my event?",
          answer: "Events published on Eventomorrow are automatically listed in our event directory. You can also share your event link on social media and use our promotional tools."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, and other popular payment methods. Payments are processed securely through our payment partners."
        }
      ]
    },
    {
      category: "For Attendees",
      questions: [
        {
          question: "How do I find events near me?",
          answer: "Use our search and filter options on the Events page. You can filter by location, date, category, and price to find events that interest you."
        },
        {
          question: "How do I register for an event?",
          answer: "Click on any event to view its details, then click 'Register' or 'Buy Tickets'. Follow the prompts to complete your registration."
        },
        {
          question: "Can I get a refund if I can't attend?",
          answer: "Refund policies are set by individual event organizers. Check the event details for specific refund terms before purchasing tickets."
        },
        {
          question: "Will I receive a confirmation after registering?",
          answer: "Yes! You'll receive an email confirmation with your ticket details and any additional information from the organizer."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "I'm having trouble logging in. What should I do?",
          answer: "Try resetting your password using the 'Forgot Password' link. If you continue having issues, contact our support team."
        },
        {
          question: "The website isn't working properly. How can I report a bug?",
          answer: "Please contact our support team with details about the issue, including what browser you're using and what you were trying to do when the problem occurred."
        },
        {
          question: "Can I use Eventomorrow on my mobile device?",
          answer: "Yes! Our website is fully responsive and works great on mobile devices. We're also working on dedicated mobile apps."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="hero-gradient text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Find answers to common questions about using Eventomorrow
            </p>
          </div>
        </div>

        <div className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Search */}
            <div className="relative mb-12">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3"
              />
            </div>

            {/* FAQ Categories */}
            {filteredFaqs.length > 0 ? (
              <div className="space-y-8">
                {filteredFaqs.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{category.category}</h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem
                          key={faqIndex}
                          value={`${categoryIndex}-${faqIndex}`}
                          className="bg-white rounded-lg border shadow-sm"
                        >
                          <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4 text-gray-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No FAQs found matching your search.</p>
              </div>
            )}

            {/* Contact Support */}
            <div className="mt-16 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <button
                onClick={() => window.location.href = '/contact'}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQ;
