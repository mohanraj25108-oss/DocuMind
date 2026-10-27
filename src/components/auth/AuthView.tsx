import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthViewProps {
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onBackToLanding }) => {
  const { updateProfile } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }

    if (mode === 'forgot') {
      setSuccessMsg(`A password reset link has been dispatched to ${email}`);
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters');
      return;
    }

    if (mode === 'signup' && fullName.trim()) {
      updateProfile({ name: fullName.trim(), email: email.trim() });
    } else if (email.trim()) {
      updateProfile({ email: email.trim() });
    }

    onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#08080D] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle violet ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#8B5CF6]/15 via-[#6D28D9]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <button
        onClick={onBackToLanding}
        className="mb-6 inline-flex items-center space-x-2 text-xs font-bold text-[#85859A] hover:text-[#F8FAFC] transition-colors relative z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>← Back to DocuMind Pro</span>
      </button>

      <div className="w-full max-w-md bg-[#15151F] rounded-3xl border border-[#272733] shadow-2xl p-8 sm:p-10 relative z-10">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#A855F7] text-white flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.35)]">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base text-[#F8FAFC] block leading-tight">DocuMind</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/40 uppercase tracking-wider">PRO</span>
            </div>
            <span className="text-[11px] text-[#85859A]">Personal Document Vault</span>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-[#F8FAFC]">
          {mode === 'signin' && 'Sign in to your vault'}
          {mode === 'signup' && 'Create your personal account'}
          {mode === 'forgot' && 'Reset your password'}
        </h2>
        <p className="text-xs text-[#B8B8C8] mt-1 mb-6">
          {mode === 'signin' && 'Enter your credentials to access your devices and receipts.'}
          {mode === 'signup' && 'Start organizing your warranties and documents today.'}
          {mode === 'forgot' && "Enter your email address and we'll send a reset link."}
        </p>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-[#EF4444]/15 text-[#F87171] text-xs font-semibold border border-[#EF4444]/30">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-[#10B981]/15 text-[#34D399] text-xs font-semibold border border-[#10B981]/30">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-[#B8B8C8] mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                required
                className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#B8B8C8] mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] placeholder-[#85859A] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#B8B8C8]">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-[#A78BFA] hover:text-[#C4B5FD] hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#101018] border border-[#272733] rounded-xl text-sm text-[#F8FAFC] placeholder-[#85859A] pr-10 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#85859A] hover:text-[#F8FAFC]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] text-[#F8FAFC] rounded-xl text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_28px_rgba(139,92,246,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 border border-[#A78BFA]/30"
          >
            {mode === 'signin' && 'Sign In to Vault'}
            {mode === 'signup' && 'Create Free Account'}
            {mode === 'forgot' && 'Send Reset Instructions'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 pt-5 border-t border-[#20202B] text-center text-xs text-[#85859A]">
          {mode === 'signin' && (
            <p>
              New to DocuMind?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-[#A78BFA] hover:text-[#C4B5FD] font-bold hover:underline"
              >
                Create your account
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-[#A78BFA] hover:text-[#C4B5FD] font-bold hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <p>
              Remembered your password?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-[#A78BFA] hover:text-[#C4B5FD] font-bold hover:underline"
              >
                Back to Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
