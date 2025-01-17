import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-purple-600 mb-4 text-center">Contact Us</h1>
        <p className="text-gray-600 text-center mb-6">
          Have questions or need assistance? We'd love to hear from you! Fill out the form below or use the provided contact details to reach us.
        </p>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your Email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your Message"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Send Message
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Or contact us directly at{' '}
            <a href="mailto:support@vitiligodetect.com" className="text-purple-600 underline">
              support@vitiligodetect.com
            </a>
          </p>
          <p className="text-gray-600 mt-2">
            Phone: <span className="font-medium">+1 234 567 890</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;