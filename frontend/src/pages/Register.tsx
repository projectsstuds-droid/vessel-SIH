import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../lib/api';
import { Ship } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { token } = await register(email, password);
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="p-4 bg-green-600 rounded-full text-white mb-4 shadow-lg"><Ship size={40} /></div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => { localStorage.setItem('token', 'dev-bypass-token'); navigate('/'); }}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Dev Bypass
              </button>
            </div>
            
            <div className="text-sm text-center mt-4 text-gray-500">
              Already have an account? <span onClick={() => navigate('/login')} className="text-blue-600 cursor-pointer hover:underline font-medium">Sign in</span>
            </div>

            <div className="text-xs text-center mt-6 text-gray-600 border-t border-green-100 pt-3 pb-2 bg-green-50/50 rounded-lg px-2">
              By registering, you agree to our <span onClick={() => navigate('/terms')} className="text-green-700 font-bold hover:text-green-900 cursor-pointer underline">Terms & Conditions</span> and <span onClick={() => navigate('/privacy')} className="text-green-700 font-bold hover:text-green-900 cursor-pointer underline">Privacy Policy</span>.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
