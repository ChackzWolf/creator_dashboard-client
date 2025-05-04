import { User } from "./auth";

export interface UserWithStats extends User {
    creditBalance: number;
    lastLogin: string;
    activityCount: number;
    savedPosts: number;
  }
  
  export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalCreditsIssued: number;
    reportsCount: number;
  }
  