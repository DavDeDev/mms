import React from "react";

const About = () => {
  return (
    <div className="container mx-auto px-6 py-10">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-orange-500">About Us</h1>
        <p className="text-lg text-gray-700 mt-4">
          Our mentorship management system empowers schools and colleges to
          effectively manage and scale mentorship programs. We believe in
          fostering growth and success through strong mentor-mentee
          connections.
        </p>
      </div>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Mission */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Mission</h2>
          <p className="text-gray-700">
            To create a seamless and innovative platform that enables
            educational institutions to empower students and mentors through
            structured and meaningful mentorship programs. By fostering
            engagement, collaboration, and growth, we aim to inspire personal
            and professional development for all participants. Our mission is
            to bridge the gap between aspirations and achievements, ensuring
            every mentee has access to invaluable guidance and every mentor
            finds fulfillment in making a lasting impact.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Vision</h2>
          <p className="text-gray-700">
            To revolutionize the way mentorship programs are managed by becoming
            the most trusted and scalable platform for schools, colleges, and
            organizations worldwide. We envision a future where mentorship is
            universally accessible, fostering a global community of lifelong
            learners and leaders. By leveraging cutting-edge technology and
            personalized solutions, our vision is to empower institutions to
            nurture talent, unlock potential, and drive progress for a brighter,
            more connected future.
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold text-gray-800">
          Ready to transform your mentorship program?
        </h3>
        <p className="text-gray-600 mt-2">
          Learn more about how MMS can help your institution achieve its goals.
        </p>
        <button className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default About;
