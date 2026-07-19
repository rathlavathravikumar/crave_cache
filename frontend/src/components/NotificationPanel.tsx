import { useEffect, useState } from 'react';
import api from '../api';
import type { NotificationItem } from '../types';

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get('/notifications');
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error('Failed to load notifications', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="card">
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification._id} className="card" style={{ marginTop: '0.75rem' }}>
            <strong>{notification.title}</strong>
            <p>{notification.message}</p>
            <small>{notification.isRead ? 'Read' : 'Unread'}</small>
          </div>
        ))
      )}
    </div>
  );
}
