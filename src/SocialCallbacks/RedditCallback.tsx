import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

// Global processing flag to handle component remounts
const processingCodes = new Set();

const RedditCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    console.log(state, code, "state & code");

    if (!code) {
      setError("Missing code from Reddit");
      setLoading(false);
      return;
    }

    // Check if we've already processed this code
    const processedCodes = JSON.parse(localStorage.getItem('processedRedditCodes') || '[]');
    if (processedCodes.includes(code)) {
      console.log("This code has already been processed, skipping");
      setLoading(false);
      navigate('/dashboard');
      return;
    }

    // Check if this code is currently being processed (survives remounts)
    if (processingCodes.has(code)) {
      console.log("This code is currently being processed, waiting...");
      return;
    }

    // Mark this code as being processed
    processingCodes.add(code);

    const getAccessToken = async () => {
      try {
        console.log("Starting API call to exchange code for token...");
        
        const res = await api.post('/socialAuth/reddit/token', { 
          code, 
          userId 
        });
        
        console.log("✅ Access Token Response:", res.data);
        
        // Store the tokens regardless of component mount state
        if (res.data?.data?.access_token) {
          console.log("Storing access token in localStorage");
          localStorage.setItem('reddit_token', res.data.data.access_token);
        }
        
        if (res.data?.data?.refresh_token) {
          console.log("Storing refresh token in localStorage");
          localStorage.setItem('reddit_refresh_token', res.data.data.refresh_token);
        }
        
        // Mark code as processed 
        processedCodes.push(code);
        localStorage.setItem('processedRedditCodes', JSON.stringify(processedCodes));
        
        // Update component state and navigate
        setLoading(false);
        navigate('/dashboard');
      } catch (err) {
        console.error("❌ Token error:", err);
        setError("Failed to get Reddit token");
        setLoading(false);
      } finally {
        // Always remove from processing set
        processingCodes.delete(code);
      }
    };

    // Execute token exchange
    getAccessToken();

    // No cleanup needed for the global Set
  }, [searchParams, navigate, userId]);

  if (loading) return <p className="p-4">Loading Reddit login...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return <p className="p-4 text-green-500">Reddit login successful!</p>;
};

export default RedditCallback;