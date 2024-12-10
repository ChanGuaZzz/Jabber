import React from 'react';
import { Globe, Users, MessageCircle, Languages } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Globe className="h-6 w-6 text-[#fd5000]" />,
      title: 'Global Connection',
      description: 'Connect with people from different countries and cultures instantly.'
    },
    {
      icon: <Languages className="h-6 w-6 text-[#fd5000]" />,
      title: 'Language Practice',
      description: 'Practice new languages with native speakers in real-time conversations.'
    },
    {
      icon: <Users className="h-6 w-6 text-[#fd5000]" />,
      title: 'Community Rooms',
      description: 'Join themed chat rooms based on your interests and preferences.'
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-[#fd5000]" />,
      title: 'Real-time Chat',
      description: 'Enjoy seamless, instant messaging with modern chat features.'
    }
  ];

  return (
    <div className="py-16 bg-gray-800" id='features'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Why Choose Jabber?
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Experience the best way to connect with people globally
          </p>
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="pt-6">
                <div className="flow-root bg-gray-900 rounded-lg px-6 pb-8 h-full border border-gray-700">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-md shadow-lg border border-gray-700">
                      {feature.icon}
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-white tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}