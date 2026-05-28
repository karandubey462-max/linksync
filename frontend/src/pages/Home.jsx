import React from 'react';
import { Link } from 'react-router-dom';
import { Link2, Lock, QrCode, Sparkles, User } from 'lucide-react';

const features = [
  ['Create your profile', 'Add your name, bio, photo, and colors.'],
  ['Add your links', 'Save all important links in one public page.'],
  ['Share your page', 'Copy your profile link or use a QR code.'],
];

const Home = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-950">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">LinkSync</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-full px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/10">
              Sign in
            </Link>
            <Link to="/signup" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">Bio link builder</p>
          <h1 className="mt-5 font-display text-5xl font-bold leading-tight md:text-6xl">
            One simple page for all your links.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Create an account, add your profile details, save your links, and share your public LinkSync page.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950">
              Create account
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white">
              Login
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
          <div className="rounded-2xl bg-white p-5 text-slate-950">
            <div className="mx-auto max-w-xs rounded-3xl bg-slate-950 p-5 text-white">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-300 text-slate-950">
                <User className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-center font-display text-2xl font-bold">Your Profile</h2>
              <p className="mt-2 text-center text-sm text-slate-300">Your own links appear here.</p>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold">Portfolio</div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold">Social link</div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold">Contact</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-slate-950">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-slate-200 p-6">
                <Link2 className="h-6 w-6 text-cyan-700" />
                <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-6">
              <Lock className="h-6 w-6 text-cyan-700" />
              <h3 className="mt-5 font-display text-xl font-bold">Saved with MongoDB</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Your signup and profile data stay saved after you log out.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <QrCode className="h-6 w-6 text-cyan-700" />
              <h3 className="mt-5 font-display text-xl font-bold">QR sharing</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Generate a QR code for your profile from the dashboard.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
