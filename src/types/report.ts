

export interface Report {
  reportedBy: string; 
  reportedUser: string; 
  postId: string; 
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}