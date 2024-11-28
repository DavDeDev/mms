"use client";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Your message has been sent! We'll get back to you shortly.");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-extrabold mb-6 text-orange-600">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-8">
        Have questions? Get in touch with us:
      </p>

      {/* Side-by-Side Layout */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
        {/* Contact Details */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Reach Out</h2>
          <p className="text-gray-600 mt-4">
            <strong>Email:</strong> support@mentorshipprogram.com
          </p>
          <p className="text-gray-600 mt-2">
            <strong>Phone:</strong> (123) 456-7890
          </p>
          <p className="text-gray-600 mt-2">
            <strong>Address:</strong> 123 Main Street, Springfield, USA
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-lg p-6 rounded-lg flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-left font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-left font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Your email"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-left font-medium text-gray-700"
              >
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Subject"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-left font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Your message"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
