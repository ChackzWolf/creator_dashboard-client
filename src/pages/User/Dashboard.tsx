import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCredits } from '../../hooks/useCredits';
import { useFeed } from '../../hooks/useFeed';
import { UserActivity } from '../../types/credits';
import Layout from '../../components/User/layout/Layout';
import CreditStats from '../../components/User/dashboard/CreditStats';
import RecentActivity from '../../components/User/dashboard/RecentActivity';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { creditStats, isLoading: isLoadingCredits } = useCredits();
  const { 
    fetchSavedItems, 
    // savedItems, 
    // items, 
    isLoading: isLoadingFeed 
  } = useFeed();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  useEffect(() => {
    // fetchSavedItems();
      console.log(isLoadingFeed)

    // Fetch recent activities (mock for now)
    setTimeout(() => {
      // This would be an API call in a real application
      const mockActivities: UserActivity[] = [
        {
          id: '1',
          userId: user?._id || '',
          type: 'login',
          metadata: {},
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          userId: user?._id || '',
          type: 'profile_update',
          metadata: { description: 'Updated profile picture' },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          userId: user?._id || '',
          type: 'saved_post',
          metadata: { source: 'twitter' },
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      setActivities(mockActivities);
      setIsLoadingActivities(false);
    }, 1000);
  }, [fetchSavedItems, user?._id]);

  // const savedFeedItems = items.filter(item => savedItems.includes(item.id));

  return (
    <Layout requireAuth>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Credits Stats */}
          <div className="lg:col-span-2">
            {creditStats && (
              <CreditStats 
                stats={creditStats} 
                isLoading={isLoadingCredits} 
              />
            )}
          </div>
          
          {/* Saved Feed Items */}
          <div className="lg:col-span-1">
            {/* <SavedFeeds 
              items={savedFeedItems}
              isLoading={isLoadingFeed}
              onUnsave={unsaveItem}
            /> */}
          </div>
          
          {/* Recent Activity */}
          <div className="lg:col-span-3">
            <RecentActivity 
              activities={activities}
              isLoading={isLoadingActivities}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;