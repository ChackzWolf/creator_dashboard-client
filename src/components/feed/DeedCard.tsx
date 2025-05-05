import React, { useState } from 'react';
import { FeedItem } from '../../types/feed';

interface FeedCardProps {
  item: FeedItem;
  onSave: (itemId: string) => void;
  onUnsave: (itemId: string) => void;
  onShare: (itemId: string) => void;
  onReport: (itemId: string) => void;
  compact?: boolean;
}

const FeedCard: React.FC<FeedCardProps> = ({
  item,
  onSave,
  onUnsave,
  onShare,
  onReport,
  compact = false,
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleReport = () => {
    if (reportReason.trim()) {
      onReport(item.id);
      setShowReportModal(false);
      setReportReason('');
    }
  };

  const getSourceIcon = (source: FeedItem['source']) => {
    switch (source) {
      case 'twitter':
        return '🐦';
      case 'reddit':
        return '📢';
      case 'linkedin':
        return '💼';
      default:
        return '📱';
    }
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow-sm ${compact ? 'p-3' : 'p-6'} hover:shadow-md transition-shadow`}>
        <div className="flex items-start space-x-3">
          {item.author.avatar && (
            <img
              src={item.author.avatar}
              alt={item.author.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{item.author.name}</p>
                {item.author.username && (
                  <p className="text-sm text-gray-500">@{item.author.username}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span className="text-lg">{getSourceIcon(item.source)}</span>
              </div>
            </div>
            
            <p className={`mt-2 text-gray-900 ${compact ? 'line-clamp-2' : ''}`}>
              {item.content}
            </p>
            
            {item.media && item.media.length > 0 && (
              <div className="mt-3 space-y-2">
                {item.media.map((media, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden">
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt=""
                        className="w-full object-cover"
                      />
                    ) : (
                      <video
                        src={media.url}
                        controls
                        className="w-full"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>❤️ {item.likes}</span>
                <span>💬 {item.comments}</span>
                <span>🔄 {item.shares}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {item.isSaved ? (
                  <button
                    onClick={() => onUnsave(item.id)}
                    className="p-2 text-yellow-500 hover:text-yellow-600"
                    title="Unsave"
                  >
                    ★
                  </button>
                ) : (
                  <button
                    onClick={() => onSave(item.id)}
                    className="p-2 text-gray-400 hover:text-yellow-500"
                    title="Save"
                  >
                    ☆
                  </button>
                )}
                
                <button
                  onClick={() => onShare(item.id)}
                  className="p-2 text-gray-400 hover:text-blue-500"
                  title="Share"
                >
                  🔗
                </button>
                
                <button
                  onClick={() => setShowReportModal(true)}
                  className="p-2 text-gray-400 hover:text-red-500"
                  title="Report"
                >
                  🚩
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Report Content</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for reporting this content:
            </p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
              rows={3}
              placeholder="Enter reason..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedCard;