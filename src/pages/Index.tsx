
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import EventTypes from '../components/home/EventTypes';
import EventList from '../components/events/EventList';
import CallToAction from '../components/home/CallToAction';
import { featuredEvents } from '../data/sampleEvents';

const Index: React.FC = () => {
  return (
    <MainLayout>
      <Hero />
      <div className="container mx-auto px-4">
        <EventList 
          title="Featured Events" 
          events={featuredEvents} 
        />
      </div>
      <Features />
      <div className="container mx-auto px-4">
        <EventTypes />
      </div>
      <CallToAction />
    </MainLayout>
  );
};

export default Index;
