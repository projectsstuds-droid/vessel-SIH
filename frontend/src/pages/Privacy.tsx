import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowRight className="rotate-180 h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2"><ShieldCheck className="h-8 w-8 text-green-600"/> Privacy & Data Protection</h1>
          <p className="text-gray-500 mt-1">How we manage and secure your personal data</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6 text-gray-700 leading-relaxed">
        <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 mb-6">
          <strong>Our Commitment:</strong> We adhere strictly to the Digital Personal Data Protection (DPDP) Act of India, ensuring your KYC data and corporate intelligence remain highly secure.
        </div>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
          <p>We collect personal identifiers such as your Name, Email, Aadhar Card, and PAN Card strictly for Know Your Customer (KYC) and regulatory compliance. We also collect industry details like your organization and preferred cargo to personalize AI recommendations.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Manage Your Data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Encryption:</strong> All sensitive data (including Aadhar and PAN) is encrypted at rest using AES-256 and transmitted via secure TLS protocols.</li>
            <li><strong>Anonymization:</strong> When our Machine Learning models train on historical cargo routes, your identity and corporate affiliation are completely stripped and anonymized.</li>
            <li><strong>Access Control:</strong> Only authorized security personnel have access to the raw identity database.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Your Rights</h2>
          <p>You have the right to access, correct, or permanently delete your personal data. You can delete your account and wipe your data from our servers at any time using the "Danger Zone" in your Profile settings.</p>
        </section>
      </div>
    </div>
  );
}
