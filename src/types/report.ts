export interface Report {
    id: string;
    userId: string;
    feedItemId: string;
    reason: string;
    status: 'pending' | 'reviewed' | 'resolved';
    createdAt: string;
  }