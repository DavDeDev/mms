"use client";

export default function PricingPage() {
  // Function to handle plan selection
  const handlePlanSelection = (plan: string) => {
    alert(`You selected the ${plan} plan!`); // Replace this with your desired action
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-extrabold mb-6 text-orange-600">Our Pricing</h1>
      <p className="text-lg text-gray-700 mb-8">
        Choose the plan that best suits your institution’s needs:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        {/* Basic Plan */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900">Basic Plan</h2>
          <p className="text-gray-600 mt-2">$49/month</p>
          <p className="text-gray-600 mt-2">Access to core features.</p>
          <button
            onClick={() => handlePlanSelection("Basic")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
          >
            Select Basic
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-orange-50 shadow-lg p-6 rounded-lg border-2 border-orange-600">
          <h2 className="text-2xl font-bold text-orange-600">Pro Plan</h2>
          <p className="text-gray-600 mt-2">$99/month</p>
          <p className="text-gray-600 mt-2">Includes advanced analytics.</p>
          <button
            onClick={() => handlePlanSelection("Pro")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
          >
            Select Pro
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900">Enterprise Plan</h2>
          <p className="text-gray-600 mt-2">Custom pricing</p>
          <p className="text-gray-600 mt-2">Contact us for tailored solutions.</p>
          <button
            onClick={() => handlePlanSelection("Enterprise")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
          >
            Select Enterprise
          </button>
        </div>
      </div>
    </main>
  );
}
