export default function ContactPage() {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-5xl font-extrabold mb-6 text-orange-600">Contact Us</h1>
        <p className="text-lg text-gray-700 mb-8">
          Have questions? Get in touch with us:
        </p>
        <div className="bg-white shadow-lg p-6 rounded-lg max-w-2xl w-full">
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
      </main>
    );
  }
  