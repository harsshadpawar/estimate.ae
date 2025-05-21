import React, { lazy, Suspense, ComponentType } from 'react';
import LoadingFallback from '@/components/loadingFallback';
import RouteErrorBoundary from '@/utils/routeErrorBoundary';

interface LazyComponentOptions {
  loadingMessage?: string;
  errorRedirectPath?: string;
  showHomeButton?: boolean;
  routeName?: string;
  customFallback?: React.ReactNode;
}

/**
 * Custom hook for creating lazy-loaded components with customizable 
 * loading and error handling
 * 
 * @param factory - The import function for the component
 * @param options - Customization options for loading and error states
 * @returns A wrapped component with Suspense and ErrorBoundary
 */
function useLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
) {
  const {
    loadingMessage = 'Loading...',
    errorRedirectPath,
    showHomeButton = true,
    routeName,
    customFallback
  } = options;

  const LazyComponent = lazy(factory);

  const WrappedComponent = (props: React.ComponentProps<T>) => (
    <RouteErrorBoundary
      redirectPath={errorRedirectPath}
      showHome={showHomeButton}
      routeName={routeName}
    >
      <Suspense fallback={customFallback || <LoadingFallback message={loadingMessage} />}>
        <LazyComponent {...props} />
      </Suspense>
    </RouteErrorBoundary>
  );

  return WrappedComponent;
}

export default useLazyComponent;