export interface CreditTransaction {
    id: string;
    userId: string;
    amount: number;
    reason: 'daily_login' | 'profile_completion' | 'feed_interaction' | 'admin_adjustment';
    description: string;
    createdAt: string;
  }
  
  export interface CreditStats {
    total: number;
    thisWeek: number;
    thisMonth: number;
    transactions: CreditTransaction[];
  }
  
  export interface UserActivity {
    id: string;
    userId: string;
    type: 'login' | 'profile_update' | 'saved_post' | 'shared_post' | 'reported_post';
    metadata: Record<string, any>;
    createdAt: string;
  }

  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }