
import React from 'react';
import EventCard, { EventProps } from './EventCard';

interface EventListProps {
  events: EventProps[];
  title?: string;
}

const EventList: React.FC<EventListProps> = ({ events, title }) => {
  return (
    <section className="py-10">
      {title && (
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div key={event.id} className="animated-element" style={{ animationDelay: `${index * 0.1}s` }}>
            <EventCard {...event} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventList;
