import { useNotificationStore } from '@/stores/notificationStore';

export const Notifications = () => {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            minWidth: '300px',
            backgroundColor:
              notification.type === 'success'
                ? '#22c55e'
                : notification.type === 'error'
                  ? '#ef4444'
                  : notification.type === 'warning'
                    ? '#f59e0b'
                    : '#3b82f6',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => removeNotification(notification.id)}
        >
          <div style={{ fontWeight: 'bold' }}>{notification.title}</div>
          {notification.message && (
            <div style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9 }}>
              {notification.message}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
