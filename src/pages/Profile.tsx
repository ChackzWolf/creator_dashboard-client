import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../api/auth';
import { FaSquareReddit } from "react-icons/fa6";
import api from '../utils/api';


const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [linkedPlatforms , setLinkedPlatforms] = useState<string[]>([])
  const REDDIT_CLIENT_ID = import.meta.env.VITE_REDDIT_CLIENT_ID
  const REDDIT_REDIRECT_URI = import.meta.env.VITE_REDDIT_REDIRECT_URI;
  const redditLoginUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=random123&redirect_uri=${REDDIT_REDIRECT_URI}&duration=permanent&scope=identity history read`;
  useEffect(()=> {
    const checkLinkedSocialAccount = async()=> {
      const response = await api.get('/user/linkedAccounts')
      console.log(response.data.data, 'linked accounts');
      const data = response.data.data
      const getPlatforms = data.map((obj:any)=> obj.platform as string )
      setLinkedPlatforms(getPlatforms)
    }
    checkLinkedSocialAccount()
  },[])

  console.log('linked', linkedPlatforms)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err:any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      profilePicture: user?.profilePicture || '',
    });
    setIsEditing(false);
    setError('');
  };

  const handleRedditRedirect = () => {
    window.location.href = redditLoginUrl;
  };

  return (
    <Layout requireAuth>
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="flex items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mr-6">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl text-indigo-600">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-indigo-600 text-white rounded-lg ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profile Status</p>
                <p className="font-medium">
                  {user?.profileCompleted ? (
                    <span className="text-green-600">Completed</span>
                  ) : (
                    <span className="text-yellow-600">Incomplete</span>
                  )}
                </p>
              </div>
            </div>
            <div className='w-full'>
                
                  <button onClick={handleRedditRedirect} disabled={linkedPlatforms.includes('reddit')} className={`text-4xl ${linkedPlatforms.includes('reddit') ? 'text-violet-900': 'text-gray-500 cursor-pointer'} `}>
                      <FaSquareReddit />
                  </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;