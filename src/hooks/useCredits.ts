import { useState, useEffect, useCallback } from 'react';
import { getCreditStats, getTransactions, getUserCreditStats, adjustUserCredits } from '../api/credits';
import { CreditStats, CreditTransaction } from '../types/credits';
import { useAuth } from './useAuth';

interface UseCreditsReturn {
  creditStats: CreditStats | null;
  transactions: CreditTransaction[];
  isLoading: boolean;
  error: string | null;
  fetchUserCredits: (userId?: string) => Promise<CreditStats | null>;
  adjustCredits: (userId: string, amount: number, reason: string) => Promise<boolean>;
  refetchCredits: () => Promise<void>;
}

export const useCredits = (): UseCreditsReturn => {
  const [creditStats, setCreditStats] = useState<CreditStats | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  const fetchCredits = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const stats = await getCreditStats();
      const txns = await getTransactions();
      
      setCreditStats(stats);
      setTransactions(txns);
    } catch (err:any) {
      setError(err.message || 'Failed to fetch credit information');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchUserCredits = useCallback(async (userId?: string): Promise<CreditStats | null> => {
    if (!isAuthenticated || (!user?.role.includes('admin') && userId)) {
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const stats = userId 
        ? await getUserCreditStats(userId)
        : await getCreditStats();
        
      return stats;
    } catch (err:any) {
      setError(err.message || 'Failed to fetch credit information');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const adjustCredits = useCallback(async (
    userId: string, 
    amount: number, 
    reason: string
  ): Promise<boolean> => {
    if (!isAuthenticated || !user?.role.includes('admin')) {
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await adjustUserCredits(userId, amount, reason);
      // If we successfully adjusted credits for the current user, refresh their stats
      if (result && user._id === userId) {
        fetchCredits();
      }
      return result;
    } catch (err:any) {
      setError(err.message || 'Failed to adjust credits');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, fetchCredits]);

  // Fetch credits on initial load
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    creditStats,
    transactions,
    isLoading,
    error,
    fetchUserCredits,
    adjustCredits,
    refetchCredits: fetchCredits
  };
};