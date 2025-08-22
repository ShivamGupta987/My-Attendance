import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { scheduleBackgroundSync, storeOfflineData, getOfflineData, clearSyncedOfflineData } from '../lib/pwaRegistration';

interface OfflineAction {
  id: string;
  type: 'attendance' | 'timetable' | 'subject';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  synced: boolean;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Attempt to sync pending actions when coming back online
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending actions from localStorage
    loadPendingActions();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPendingActions = () => {
    if (!user) return;
    
    const stored = getOfflineData(`pending_actions_${user.id}`);
    if (stored && Array.isArray(stored.data)) {
      setPendingActions(stored.data.filter((action: OfflineAction) => !action.synced));
    }
  };

  const addOfflineAction = (action: Omit<OfflineAction, 'id' | 'timestamp' | 'synced'>) => {
    if (!user) return;

    const newAction: OfflineAction = {
      ...action,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      synced: false,
    };

    const updatedActions = [...pendingActions, newAction];
    setPendingActions(updatedActions);
    
    // Store in localStorage
    storeOfflineData(`pending_actions_${user.id}`, updatedActions);

    // Schedule background sync if possible
    if (isOnline) {
      scheduleBackgroundSync(`${action.type}-sync`);
    }

    return newAction.id;
  };

  const syncPendingActions = async () => {
    if (!user || !isOnline || pendingActions.length === 0) return;

    const actionsToSync = pendingActions.filter(action => !action.synced);
    
    for (const action of actionsToSync) {
      try {
        await syncSingleAction(action);
        markActionAsSynced(action.id);
      } catch (error) {
        console.error('Failed to sync action:', action, error);
      }
    }
  };

  const syncSingleAction = async (action: OfflineAction): Promise<void> => {
    // This would typically make API calls to Supabase
    // For now, we'll just log the action
    console.log('Syncing action:', action);
    
    // In a real implementation, you would:
    // 1. Make the appropriate Supabase API call based on action.type and action.action
    // 2. Handle the response and update local state
    // 3. Remove the action from pending list if successful
    
    return new Promise((resolve) => {
      setTimeout(resolve, 1000); // Simulate API call
    });
  };

  const markActionAsSynced = (actionId: string) => {
    const updatedActions = pendingActions.map(action =>
      action.id === actionId ? { ...action, synced: true } : action
    );
    
    setPendingActions(updatedActions.filter(action => !action.synced));
    
    if (user) {
      storeOfflineData(`pending_actions_${user.id}`, updatedActions.filter(action => !action.synced));
    }
  };

  const clearAllSyncedActions = () => {
    if (!user) return;
    
    const unsyncedActions = pendingActions.filter(action => !action.synced);
    setPendingActions(unsyncedActions);
    storeOfflineData(`pending_actions_${user.id}`, unsyncedActions);
  };

  return {
    isOnline,
    pendingActions: pendingActions.filter(action => !action.synced),
    addOfflineAction,
    syncPendingActions,
    clearAllSyncedActions,
  };
};