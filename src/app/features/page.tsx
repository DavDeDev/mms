import React from 'react';

const features = [
  {
    title: 'Mentor-Mentee Matching',
    description:
      'Utilize advanced algorithms to connect mentors and mentees effectively, ensuring alignment of goals, interests, and expertise for a successful mentorship journey.',
    icon: '👥',
  },
  {
    title: 'Session Scheduling',
    description:
      'Effortlessly schedule and manage mentorship sessions with our intuitive calendar. Features include automated reminders, conflict resolution, and integration with popular calendar apps.',
    icon: '📅',
  },
  {
    title: 'Progress Tracking',
    description:
      'Gain insights into your mentorship program with real-time analytics and comprehensive reporting tools. Track milestones and analyze progress to optimize outcomes.',
    icon: '📈',
  },
  {
    title: 'Resource Library',
    description:
      'Access a rich repository of high-quality resources, including templates, articles, and videos, to support ongoing learning and development for both mentors and mentees.',
    icon: '📖',
  },
  {
    title: 'Feedback System',
    description:
      'Encourage open communication with an effective feedback platform. Gather, evaluate, and implement suggestions to continuously improve the mentorship experience.',
    icon: '💬',
  },
  {
    title: 'Quick Actions',
    description:
      'Boost productivity with a streamlined interface that allows you to perform frequent tasks, such as rescheduling sessions or updating progress, with just a few clicks.',
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
