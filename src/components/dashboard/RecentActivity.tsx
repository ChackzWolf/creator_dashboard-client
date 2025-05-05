import React from 'react';
import { UserActivity } from '../../types/credits';

interface RecentActivityProps {
  activities: UserActivity[];
  isLoading: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: UserActivity['type']) => {
    switch (type) {
      case 'login':
        return '🔑';
      case 'profile_update':
        return '✏️';
      case 'saved_post':
        return '💾';
      case 'shared_post':
        return '🔗';
      case 'reported_post':
        return '🚩';
      default:
        return '📝';
    }
  };

  const getActivityText = (activity: UserActivity) => {
    switch (activity.type) {
      case 'login':
        return 'Logged in successfully';
      case 'profile_update':
        return 'Updated profile information';
      case 'saved_post':
        return `Saved a post from ${activity.metadata.source || 'feed'}`;
      case 'shared_post':
        return `Shared a post from ${activity.metadata.source || 'feed'}`;
      case 'reported_post':
        return `Reported a post from ${activity.metadata.source || 'feed'}`;
      default:
        return 'Performed an action';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.slice(0, 10).map((activity) => (
          <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 mr-3 bg-indigo-100 rounded-full p-2">
              <span className="text-xl">{getActivityIcon(activity.type)}</span>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-700">{getActivityText(activity)}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
              {activity.metadata.description && (
                <p className="text-sm text-gray-500 mt-1">{activity.metadata.description}</p>
              )}
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">No recent activity</div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;