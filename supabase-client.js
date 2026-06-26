/**
 * Rise Jobs - Supabase Client Configuration
 * Handles all database and auth interactions
 */

(function() {
  'use strict';

  // Supabase configuration
  const SUPABASE_URL = 'https://0ec90b57d6e95fcbda19832f.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

  // Initialize Supabase client
  const { createClient } = window.supabase;
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Make client globally available
  window.supabaseClient = supabase;

  // ===== AUTH HELPER FUNCTIONS =====

  /**
   * Sign up a new user with email and password
   */
  window.signUp = async function(email, password, name = '') {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) throw error;

      // Store user info in session
      if (data.user) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userData', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: name || email.split('@')[0]
        }));
      }

      return { success: true, data };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Sign in an existing user
   */
  window.signIn = async function(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      // Store user info in session
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userData', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.email.split('@')[0],
        avatar: profile?.avatar_url
      }));
      sessionStorage.setItem('userEmail', email);

      return { success: true, data };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Sign out the current user
   */
  window.signOut = async function(e) {
    if (e) e.preventDefault();

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear session storage
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('userEmail');
      localStorage.removeItem('rise_user_token');

      // Redirect to home
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local storage even if server signout fails
      sessionStorage.clear();
      window.location.href = 'index.html';
    }
  };

  /**
   * Get the current session
   */
  window.getCurrentSession = async function() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  };

  /**
   * Get the current user
   */
  window.getCurrentUser = async function() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  };

  // ===== SAVED JOBS FUNCTIONS =====

  /**
   * Save a job to user's saved list
   */
  window.saveJob = async function(job) {
    try {
      const user = await window.getCurrentUser();
      if (!user) {
        throw new Error('Please sign in to save jobs');
      }

      const { data, error } = await supabase
        .from('saved_jobs')
        .insert({
          job_id: job._id || job.id,
          job_title: job.title,
          company_name: job.owner?.companyName || job.companyName,
          company_logo: job.owner?.photo || job.photo,
          job_url: job.url || `single-job.html?id=${job._id}`,
          location: job.locationAddress || job.location?.address || 'Remote',
          job_type: job.type || job.jobType || 'Hybrid'
        });

      if (error) {
        // Check if it's a duplicate error
        if (error.code === '23505') {
          return { success: false, error: 'Job already saved' };
        }
        throw error;
      }

      // Update local storage for offline access
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      savedJobs.push({
        _id: job._id || job.id,
        title: job.title,
        companyName: job.owner?.companyName || job.companyName
      });
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));

      // Update badge
      if (window.updateBadge) {
        window.updateBadge('saved', savedJobs.length);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Save job error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Remove a job from saved list
   */
  window.unsaveJob = async function(jobId) {
    try {
      const user = await window.getCurrentUser();
      if (!user) {
        throw new Error('Please sign in to manage saved jobs');
      }

      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('job_id', jobId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local storage
      let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      savedJobs = savedJobs.filter(j => (j._id || j.id) !== jobId);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));

      // Update badge
      if (window.updateBadge) {
        window.updateBadge('saved', savedJobs.length);
      }

      return { success: true };
    } catch (error) {
      console.error('Unsave job error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Get all saved jobs for current user
   */
  window.getSavedJobs = async function() {
    try {
      const user = await window.getCurrentUser();
      if (!user) {
        // Return local storage data if not signed in
        return JSON.parse(localStorage.getItem('savedJobs') || '[]');
      }

      const { data, error } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Get saved jobs error:', error);
      // Fallback to local storage
      return JSON.parse(localStorage.getItem('savedJobs') || '[]');
    }
  };

  /**
   * Check if a job is saved
   */
  window.isJobSaved = async function(jobId) {
    try {
      const user = await window.getCurrentUser();
      if (!user) {
        // Check local storage
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        return savedJobs.some(j => (j._id || j.id) === jobId);
      }

      const { data, error } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('job_id', jobId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Check saved job error:', error);
      return false;
    }
  };

  // ===== USER SETTINGS FUNCTIONS =====

  /**
   * Get user settings
   */
  window.getUserSettings = async function() {
    try {
      const user = await window.getCurrentUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get settings error:', error);
      return null;
    }
  };

  /**
   * Update user settings
   */
  window.updateUserSettings = async function(settings) {
    try {
      const user = await window.getCurrentUser();
      if (!user) throw new Error('Please sign in to update settings');

      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings
        }, {
          onConflict: 'user_id'
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      // Apply theme if changed
      if (settings.theme && window.applyTheme) {
        window.applyTheme(settings.theme);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Update settings error:', error);
      return { success: false, error: error.message };
    }
  };

  // ===== PAYMENT FUNCTIONS =====

  /**
   * Save payment to history
   */
  window.savePayment = async function(paymentData) {
    try {
      const user = await window.getCurrentUser();
      if (!user) {
        // Store locally if not signed in
        const payments = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
        payments.push({
          ...paymentData,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('paymentHistory', JSON.stringify(payments));
        return { success: true };
      }

      const { data, error } = await supabase
        .from('payment_history')
        .insert({
          user_id: user.id,
          ...paymentData
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Save payment error:', error);
      return { success: false, error: error.message };
    }
  };

  // ===== INITIALIZATION =====

  // Check and restore session on page load
  supabase.auth.onAuthStateChange((event, session) => {
    (async () => {
      console.log('Auth state changed:', event);

      if (event === 'SIGNED_IN' && session) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userData', JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          name: profile?.name || session.user.email.split('@')[0],
          avatar: profile?.avatar_url
        }));
        sessionStorage.setItem('userEmail', session.user.email);

        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('userSignedIn', { detail: session.user }));
      }

      if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('userEmail');
        window.dispatchEvent(new CustomEvent('userSignedOut'));
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
      }
    })();
  });

  // Initial session check
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Restore user data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userData', JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          name: profile?.name || session.user.email.split('@')[0],
          avatar: profile?.avatar_url
        }));
        sessionStorage.setItem('userEmail', session.user.email);

        // Sync saved jobs from server to local storage
        const savedJobs = await window.getSavedJobs();
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs.map(j => ({
          _id: j.job_id,
          title: j.job_title,
          companyName: j.company_name
        }))));

        if (window.updateBadge) {
          window.updateBadge('saved', savedJobs.length);
        }
      }
    } catch (error) {
      console.warn('Session check error:', error);
    }
  });

  console.log('Supabase client initialized');

})();
