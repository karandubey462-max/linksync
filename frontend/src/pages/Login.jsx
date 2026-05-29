import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        {/* Logo/Brand Icon */}
        <div className="mb-8 text-center">
          <Link to="/" className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
            <Sparkles className="h-7 w-7" />
          </Link>
          <Link to="/" className="mt-4 block font-display text-lg font-bold text-slate-200">
            LinkSync
          </Link>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Log in to manage your LinkSync profile
          </p>
          </div>

        {/* Card Frame */}
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 flex items-start gap-3 rounded-2xl bg-rose-500/10 p-4 border border-rose-500/20 text-rose-200 text-sm"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3.5 pl-10 pr-4 text-white placeholder-slate-500 transition focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3.5 pl-10 pr-4 text-white placeholder-slate-500 transition focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 font-semibold text-slate-950 transition-all hover:bg-slate-100 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Log In to Dashboard</span>
                  <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="mt-8 text-center text-sm text-slate-300">
            Do not have an account?{' '}
            <Link
              to="/signup"
              className="inline-flex items-center gap-1 font-semibold text-cyan-300 hover:text-cyan-200 hover:underline"
            >
              <span>Create one free</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
