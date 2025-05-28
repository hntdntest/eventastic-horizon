'use client';
import MainLayout from '@/app/components/layout/MainLayout';

export default function AboutPage() {
  return (
    <MainLayout>
      <section className="py-20 bg-white min-h-[60vh]">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-oceanBlue drop-shadow-sm">
            About Eventastic Horizon
          </h1>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-2/3">
              <p className="text-lg mb-6 text-gray-800 leading-relaxed">
                <span className="font-semibold text-oceanBlue">Eventastic Horizon</span> is a cutting-edge platform designed to help you discover, create, and manage events effortlessly. Whether you are an event enthusiast or an organizer, our mission is to connect people through meaningful experiences and empower communities to thrive.
              </p>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-primary">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed">
                  We strive to make event management seamless, enjoyable, and accessible for everyone. By providing powerful tools and a user-friendly interface, we enable organizers to focus on what matters most: creating memorable moments.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2 text-primary">Our Vision</h2>
                <p className="text-gray-700 leading-relaxed">
                  To become the go-to destination for event discovery and management, fostering a vibrant community where ideas and passions come to life.
                </p>
              </div>
            </div>
            <div className="md:w-1/3 flex flex-col gap-6">
              <div className="bg-gray-50 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-2 text-oceanBlue">Contact Us</h3>
                <p className="text-gray-700 mb-2">
                  Have questions, suggestions, or need support? We’re here to help!
                </p>
                <a
                  href="mailto:contact@eventastic.com"
                  className="text-blue-600 underline font-medium"
                >
                  contact@eventastic.com
                </a>
              </div>
              <div className="bg-gray-50 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold mb-2 text-oceanBlue">Join Our Community</h3>
                <p className="text-gray-700">
                  Follow us on social media to stay updated with the latest events and features.
                </p>
                <div className="flex gap-3 mt-2 justify-center md:justify-start">
                  <a href="#" className="text-blue-500 hover:text-blue-700 font-bold">Facebook</a>
                  <a href="#" className="text-blue-400 hover:text-blue-600 font-bold">Twitter</a>
                  <a href="#" className="text-pink-500 hover:text-pink-700 font-bold">Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
