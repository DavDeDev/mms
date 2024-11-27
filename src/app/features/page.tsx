import React from 'react';

const features = [
  {
    title: 'Mentor-Mentee Matching',
    description: 'Intelligent algorithm to pair mentors with mentees based on goals and interests.',
    icon: '👥',
  },
  {
    title: 'Session Scheduling',
    description: 'Easy-to-use calendar for scheduling and managing mentorship sessions.',
    icon: '📅',
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor and analyze the impact of your mentorship program with detailed reports.',
    icon: '📈',
  },
  {
    title: 'Resource Library',
    description: 'Curated collection of materials to support mentors and mentees throughout their journey.',
    icon: '📖',
  },
  {
    title: 'Feedback System',
    description: 'Collect and analyze feedback from mentors and mentees to continuously improve the program.',
    icon: '💬',
  },
  {
    title: 'Quick Actions',
    description: 'Streamlined interface for common tasks to save time and increase efficiency.',
    icon: '⚡',
  },
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-center text-4xl font-bold text-black mb-8">Key Features</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-6xl text-orange-500 mb-4">{feature.icon}</div>
            <h2 className="text-xl font-semibold text-black mb-2">{feature.title}</h2>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
