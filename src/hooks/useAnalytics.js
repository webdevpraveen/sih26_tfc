import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Only run in production or if we want to log dev too (we will log dev for this demo)
    const logVisit = async () => {
      const path = location.pathname;
      const sessionKey = `visited_${path}`;

      // Prevent spamming: only log once per session per path
      if (!sessionStorage.getItem(sessionKey)) {
        try {
          await addDoc(collection(db, 'visits'), {
            path,
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
          });
          sessionStorage.setItem(sessionKey, 'true');
        } catch (error) {
          console.error("Error logging visit:", error);
        }
      }
    };

    logVisit();
  }, [location.pathname]);
}
