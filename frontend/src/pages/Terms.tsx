import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <header className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowRight className="rotate-180 h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2"><FileText className="h-8 w-8 text-blue-600"/> Terms & Conditions</h1>
          <p className="text-gray-500 mt-1">Last updated: September 15, 2026</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using the AI Vessel Chartering Command Center (the "Service"), you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
          <p>The Service provides AI-powered freight rate forecasting, port compatibility checks, vessel recommendations, and market intelligence for maritime logistics. Predictions provided by our machine learning models are estimates and should not be construed as guaranteed financial advice.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account, including your Aadhar and PAN details provided during KYC. You agree to accept responsibility for all activities that occur under your account.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Limitation of Liability</h2>
          <p>In no event shall the platform providers be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
        </section>
      </div>
    </div>
  );
}
