import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Calendar, Zap, Users, MessageSquare, BarChart, Clock } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-500" />
            <span className="ml-2 text-xl font-bold text-black">MMS</span>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="#features" className="text-gray-600 hover:text-black">Features</Link>
            <Link to="#pricing" className="text-gray-600 hover:text-black">Pricing</Link>
            <Link to="#about" className="text-gray-600 hover:text-black">About</Link>
            <Link to="#contact" className="text-gray-600 hover:text-black">Contact</Link>
            <Link
              to="/auth?mode=signin"
              className="text-gray-600 hover:text-black px-4 py-2 rounded-md border border-gray-200 hover:border-gray-300 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/auth?mode=signup"
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block mb-4 px-3 py-1 bg-orange-50 rounded-full">
          <span className="text-sm font-medium text-orange-500">Beta</span>
        </div>
        <h1 className="text-6xl font-bold tracking-tight mb-4">
          Empower Your College's
          <br />
          <span className="text-orange-500">Mentorship Program</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          MMS helps schools effortlessly manage and scale their mentorship
          programs, fostering growth and success for every student.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/auth?mode=signup"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            View your Cohorts
          </Link>
          <Link
            to="#demo"
            className="bg-white text-black px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Request a Demo
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Mentor-Mentee Matching</h3>
            <p className="text-gray-600">
              Intelligent algorithm to pair mentors with mentees based on goals and interests.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Session Scheduling</h3>
            <p className="text-gray-600">
              Easy-to-use calendar for scheduling and managing mentorship sessions.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <BarChart className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor and analyze the impact of your mentorship program with detailed reports.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Book className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Resource Library</h3>
            <p className="text-gray-600">
              Curated collection of materials to support mentors and mentees throughout their journey.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Feedback System</h3>
            <p className="text-gray-600">
              Collect and analyze feedback from mentors and mentees to continuously improve the program.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick Actions</h3>
            <p className="text-gray-600">
              Streamlined interface for common tasks to save time and increase efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Transform Your School's Mentorship Program?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join the growing community of schools using MMS to nurture student growth and success.
        </p>
        <Link
          to="#demo"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Request a Demo
        </Link>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center border-t">
        <div className="text-sm text-gray-600">
          © 2024 MMS. All rights reserved.
        </div>
        <div className="flex space-x-6 text-sm text-gray-600">
          <Link to="#terms" className="hover:text-black">Terms of Service</Link>
          <Link to="#privacy" className="hover:text-black">Privacy</Link>
          <Link to="#docs" className="hover:text-black">
            <Book className="h-4 w-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}