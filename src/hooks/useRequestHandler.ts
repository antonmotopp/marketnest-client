import { useState } from 'react';
import { AxiosError } from 'axios';
import { useNotifications } from '@/hooks/index.ts';

interface RequestHandlerOptions<T> {
  disableErrorNotification?: boolean;
  disableSuccessNotification?: boolean;
  successMessage?: string;
  onSuccess?: (data: T) => Promise<void> | void;
  onError?: (error: unknown) => Promise<void> | void;
  onFinally?: () => Promise<void> | void;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.detail || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export const useRequestHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const notifications = useNotifications();

  const requestHandler = async <T>(
    callback: () => Promise<T>,
    options: RequestHandlerOptions<T> = {}
  ): Promise<T | null> => {
    if (isLoading) return null;

    setIsLoading(true);

    try {
      const result = await callback();

      if (options.onSuccess) {
        await options.onSuccess(result);
      }

      if (!options.disableSuccessNotification && options.successMessage) {
        notifications.success(options.successMessage);
      }

      return result;
    } catch (error) {
      if (options.onError) {
        await options.onError(error);
      }

      if (!options.disableErrorNotification) {
        notifications.error('Error', getErrorMessage(error));
      }

      return null;
    } finally {
      if (options.onFinally) {
        await options.onFinally();
      }
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    requestHandler,
  };
};
