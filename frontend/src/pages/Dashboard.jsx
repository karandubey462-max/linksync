import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Navbar from '../components/Navbar';
import DashboardEditor from '../components/DashboardEditor';
import LivePreview from '../components/LivePreview';
import { LayoutDashboard, Eye, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [links, setLinks] = useState([]);
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    bio: '',
    avatar: '',
    accentColor: '#6366f1',
    selectedTheme: 'minimal',
  });
  const [loading, setLoading] = useState(true);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mobileView, setMobileView] = useState('edit'); // 'edit' or 'preview'
  const [dashboardTheme, setDashboardTheme] = useState(() => localStorage.getItem('linksync-dashboard-theme') || 'light');
  const isDark = dashboardTheme === 'dark';

  // Initialize local profile state once user is fetched from AuthContext
  useEffect(() => {
    if (user) {
      const savedTheme = localStorage.getItem('linksync-theme');

      setProfileData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        accentColor: user.accentColor || '#6366f1',
        selectedTheme: savedTheme || user.selectedTheme || 'minimal',
      });
    }
  }, [user]);

  // Fetch link records on load
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await API.get('/links');
        if (response.data.success) {
          setLinks(response.data.links);
        }
      } catch (error) {
        console.error('Error fetching links:', error);
        setErrorMessage('Failed to load links from database.');
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  // Handler for profile changes in local state
  const handleProfileChange = (key, value) => {
    setProfileData((prev) => {
      const updated = { ...prev, [key]: value };
      
      // Auto-save theme and accentColor changes immediately
      if (key === 'selectedTheme' || key === 'accentColor') {
        if (key === 'selectedTheme') {
          localStorage.setItem('linksync-theme', value);
        }
        saveImmediateProfileField(key, value);
      }
      
      return updated;
    });
  };

  const toggleDashboardTheme = () => {
    setDashboardTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('linksync-dashboard-theme', next);
      return next;
    });
  };

  // Helper to save specific profile fields (like theme/color) immediately on click
  const saveImmediateProfileField = async (key, value) => {
    try {
      await updateProfile({ [key]: value });
    } catch (error) {
      console.error(`Failed to auto-save field ${key}:`, error);
    }
  };

  // Handler to manually save text profile adjustments (Name, Username, Bio)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsProfileSaving(true);
    setErrorMessage('');
    
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setIsProfileSaved(true);
        setTimeout(() => setIsProfileSaved(false), 2000);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Server error updating profile details.');
    } finally {
      setIsProfileSaving(false);
    }
  };

  // Handler to add a new link
  const handleAddLink = async (title, url) => {
    try {
      const response = await API.post('/links', { title: title.trim(), url: url.trim() });
      if (response.data.success) {
        setLinks((prev) => [...prev, response.data.link]);
        return true;
      }
    } catch (error) {
      console.error('Error adding link:', error);
      return false;
    }
    return false;
  };

  // Handler to update link fields (active status, title, URL, etc.)
  const handleUpdateLink = async (linkId, updatedFields) => {
    const previousLinks = links;

    try {
      const sanitizedFields = { ...updatedFields };
      if (typeof sanitizedFields.title === 'string') {
        sanitizedFields.title = sanitizedFields.title.trim();
      }
      if (typeof sanitizedFields.url === 'string') {
        sanitizedFields.url = sanitizedFields.url.trim();
      }

      // Optimistically update local state
      setLinks((prev) =>
        prev.map((link) => (link._id === linkId ? { ...link, ...sanitizedFields } : link))
      );

      const response = await API.put(`/links/${linkId}`, sanitizedFields);
      return response.data.success;
    } catch (error) {
      console.error('Error updating link:', error);
      setLinks(previousLinks);
      setErrorMessage('Failed to sync link updates.');
      return false;
    }
  };

  // Handler to delete a link
  const handleDeleteLink = async (linkId) => {
    const confirm = window.confirm('Are you sure you want to delete this link?');
    if (!confirm) return;

    const previousLinks = links;

    try {
      // Optimistically update local state
      setLinks((prev) => prev.filter((link) => link._id !== linkId));
      
      const response = await API.delete(`/links/${linkId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting link:', error);
      setLinks(previousLinks);
      setErrorMessage('Failed to delete link.');
      return false;
    }
  };

  const handleResetStats = async () => {
    const confirm = window.confirm('Reset click stats for all links?');
    if (!confirm) return false;

    const previousLinks = links;

    try {
      setLinks((prev) => prev.map((link) => ({ ...link, clicks: 0 })));
      const response = await API.patch('/links/reset-clicks');
      return response.data.success;
    } catch (error) {
      console.error('Error resetting click stats:', error);
      setLinks(previousLinks);
      setErrorMessage('Failed to reset click stats.');
      return false;
    }
  };

  // Handler to move link indices (reorder)
  const handleMoveLink = async (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= links.length) return;

    const updatedLinks = [...links];
    const temp = updatedLinks[fromIndex];
    updatedLinks[fromIndex] = updatedLinks[toIndex];
    updatedLinks[toIndex] = temp;

    const orderedLinks = updatedLinks.map((link, index) => ({ ...link, order: index + 1 }));
    setLinks(orderedLinks);

    try {
      await Promise.all(orderedLinks.map((link) => API.put(`/links/${link._id}`, { order: link.order })));
    } catch (error) {
      console.error('Error saving link order:', error);
      setErrorMessage('Failed to sync link ordering updates.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-500">Loading your profile dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen overflow-x-hidden flex flex-col transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar isDark={isDark} onToggleTheme={toggleDashboardTheme} />

      {/* Mobile-Only Tab Segmented Control */}
      <div className={`lg:hidden sticky top-16 z-30 w-full border-b py-2.5 px-3 flex gap-2 justify-center ${isDark ? 'border-slate-800 bg-slate-950/95' : 'border-slate-200 bg-white'}`}>
        <button
          onClick={() => setMobileView('edit')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            mobileView === 'edit'
              ? isDark ? 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
              : isDark ? 'text-slate-400 border border-transparent' : 'text-slate-500 border border-transparent'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            mobileView === 'preview'
              ? isDark ? 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
              : isDark ? 'text-slate-400 border border-transparent' : 'text-slate-500 border border-transparent'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Preview</span>
        </button>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        {errorMessage && (
          <div className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 text-sm ${isDark ? 'border-rose-500/20 bg-rose-500/10 text-rose-100' : 'border-rose-100 bg-rose-50 text-rose-700'}`}>
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dashboard split content */}
        <div className="grid min-w-0 grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-8 items-start">
          
          {/* Left Panel: Editor (Shown on edit view for mobile, and always on desktop) */}
          <div className={`safe-panel lg:col-span-6 space-y-6 ${mobileView === 'edit' ? 'block' : 'hidden lg:block'}`}>
            <div className={`rounded-3xl border p-4 shadow-sm sm:p-6 ${isDark ? 'border-slate-800 bg-slate-900 shadow-black/20' : 'border-slate-200/80 bg-white'}`}>
              <DashboardEditor
                profileData={profileData}
                links={links}
                onProfileChange={handleProfileChange}
                onSaveProfile={handleSaveProfile}
                onAddLink={handleAddLink}
                onUpdateLink={handleUpdateLink}
                onDeleteLink={handleDeleteLink}
                onMoveLink={handleMoveLink}
                onResetStats={handleResetStats}
                isProfileSaving={isProfileSaving}
                isProfileSaved={isProfileSaved}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Right Panel: Mobile Preview (Shown on preview view for mobile, and always on desktop) */}
          <div className={`safe-panel lg:col-span-4 lg:sticky lg:top-24 lg:self-start ${mobileView === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <div className={`rounded-3xl border p-4 shadow-sm sm:p-5 ${isDark ? 'border-slate-800 bg-slate-900 shadow-black/20' : 'border-slate-200/80 bg-white'}`}>
              <div className="text-center mb-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                  Real-time Preview
                </span>
              </div>
              <LivePreview profileData={profileData} links={links} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
