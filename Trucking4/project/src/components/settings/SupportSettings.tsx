import React from 'react';
import { HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react';

const SupportSettings = () => {
  return (
    <div className="space-y-6">
      {/* Help & Support */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Help & Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Email Support</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Get help via email. We typically respond within 24 hours.
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Send Email
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Phone Support</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Speak directly with our support team. Available 24/7.
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Call Support
            </button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              question: 'How do I update my profile information?',
              answer: 'You can update your profile information in the Profile & Company section of the settings page.',
            },
            {
              question: 'How do I reset my password?',
              answer: 'Go to the Security section in settings and click on "Update Password" to change your password.',
            },
            {
              question: 'How do I contact support?',
              answer: 'You can reach our support team via email, phone, or live chat 24/7.',
            },
          ].map((faq, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Chat */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <h2 className="text-xl font-semibold text-gray-900">Live Chat</h2>
          </div>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Online
          </span>
        </div>
        <p className="text-gray-600 mb-4">
          Chat with our support team in real-time for immediate assistance.
        </p>
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Start Chat
        </button>
      </div>
    </div>
  );
};

export default SupportSettings;