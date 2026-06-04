import React, { useState } from 'react';
import { Lock, LogIn } from 'lucide-react';
import { useSimpleAuth } from '../../auth/SimpleAuthProvider';

const PasswordForm = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useSimpleAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small delay to simulate authentication check
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = signIn(password);
    
    if (!result.success) {
      setError(result.error);
      setPassword('');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/v2_watermarked-c61d724a-368d-4f77-bc38-7ab06ebfda59.mp4" type="video/mp4" />
      </video>
      
      {/* Minimal overlay for glass effect */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 lg:px-8">
        <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-white/10 p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-3 sm:mb-4 shadow-lg">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">Bilisa Archive</h2>
            <p className="text-sm sm:text-base text-white/90 mt-2 drop-shadow-md">Enter password to access your notes</p>
          </div>

          {error && (
            <div className="bg-red-500/80 backdrop-blur-md border border-red-400/50 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 shadow-lg text-sm sm:text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white/90 mb-1 sm:mb-2 drop-shadow-md">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-white/50 text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/30 dark:bg-white/20 backdrop-blur-md border border-white/50 dark:border-white/30 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-white/40 dark:hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  Access Archive
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordForm;
