import { useContext } from 'react';
import { FeedContext } from '../context/FeedContext';

export const useFeed = () => {
  return useContext(FeedContext);
};