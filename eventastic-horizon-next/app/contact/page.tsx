"use client";
import MainLayout from '@/app/components/layout/MainLayout';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with real API integration
    setSubmitted(true);
  };

  return (
    <MainLayout>
      <section className="py-20 bg-white min-h-[60vh]">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-oceanBlue drop-shadow-sm">Contact Us</h1>
          <p className="mb-10 text-gray-700 text-lg">We'd love to hear from you! Please fill out the form below and our team will get back to you as soon as possible.</p>
          <div className="bg-gray-50 rounded-xl shadow p-8">
            {submitted ? (
              <div className="text-center py-10">
                <h2 className="text-2xl font-semibold text-oceanBlue mb-2">Thank you!</h2>
                <p className="text-gray-700">Your message has been sent. We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oceanBlue"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oceanBlue"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oceanBlue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oceanBlue"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-oceanBlue text-white font-semibold py-3 rounded-lg shadow hover:bg-oceanBlue/90 transition duration-200"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
