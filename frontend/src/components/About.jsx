import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-purple-600 text-center mb-6">
          About Us
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Empowering Early Detection of Vitiligo
          </h2>
          <p className="text-gray-600 mb-4">
            VitiligoDetect is a cutting-edge platform dedicated to simplifying the early detection and management of vitiligo through advanced technology. 
            Our mission is to empower individuals by providing accurate and accessible tools for identifying this condition at its earliest stages.
          </p>
          <p className="text-gray-600 mb-4">
            With a team of passionate experts and a focus on innovation, we strive to make healthcare more inclusive and efficient. At VitiligoDetect, 
            we combine AI-driven analysis with user-friendly designs to ensure that everyone has the resources they need for better skin health and care.
          </p>
          <p className="text-gray-600">
            Join us on our journey to bring hope, awareness, and solutions to individuals and families worldwide.
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Our Core Values</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              <strong>Empathy:</strong> Understanding the unique needs of every individual.
            </li>
            <li>
              <strong>Innovation:</strong> Leveraging the latest technology for better outcomes.
            </li>
            <li>
              <strong>Accessibility:</strong> Making healthcare tools available to everyone.
            </li>
            <li>
              <strong>Integrity:</strong> Providing reliable and accurate information.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;