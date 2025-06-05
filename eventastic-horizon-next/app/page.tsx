"use client";

import MainLayout from "./components/layout/MainLayout";
import Hero from "./components/home/Hero";
import Features from "./components/home/Features";
import EventTypes from "./components/home/EventTypes";
import EventList from "./components/events/EventList";
import CallToAction from "./components/home/CallToAction";
import { featuredEvents } from "./data/sampleEvents";
import { useLanguage } from "@/app/contexts/useLanguage";

export default function Home() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <Hero />
      <div className="container mx-auto px-4">
        <EventList title={t("events.featured")} events={featuredEvents} />
      </div>
      <Features />
      <div className="container mx-auto px-4">
        <EventTypes />
      </div>
      <CallToAction />
      <div className="bg-primary text-primary-foreground p-6 rounded mb-4">
        Test màu primary
      </div>
      <div className="bg-background text-foreground p-6 rounded mb-4">
        Test màu background
      </div>
      <div className="hero-gradient text-white p-6 rounded mb-4">
        Test Hero Gradient
      </div>

    </MainLayout>

  );
}
