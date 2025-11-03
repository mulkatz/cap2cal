import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from '../posthog';

/**
 * Custom hook to track page views on route changes
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      path: location.pathname,
    });
  }, [location]);
}
