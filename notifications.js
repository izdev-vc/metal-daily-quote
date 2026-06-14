import * as Notifications from 'expo-notifications';
import { supabase } from './services/supabase';

function getLocalDateString(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function setupDailyNotification() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    await Notifications.setNotificationChannelAsync('default', {
      name: 'Daily Band',
      importance: Notifications.AndroidImportance.HIGH,
      sound: true,
      vibrationPattern: [0, 250, 250, 250],
    });

    await Notifications.cancelAllScheduledNotificationsAsync();

    const today = new Date();

    // Schedule next 7 days so notifications keep firing even if the user doesn't open the app daily
    const futureDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i + 1);
      return getLocalDateString(d);
    });

    const { data } = await supabase
      .from('bands')
      .select('name, active_date')
      .in('active_date', futureDates);

    const bandByDate = new Map(
      (data ?? []).map((b) => [b.active_date, b.name])
    );

    for (const dateStr of futureDates) {
      const [year, month, day] = dateStr.split('-').map(Number);
      // Construct 9 AM in LOCAL time to avoid UTC offset issues
      const fireDate = new Date(year, month - 1, day, 9, 0, 0, 0);
      if (fireDate <= today) continue;

      const bandName = bandByDate.get(dateStr);
      const body = bandName
        ? `Today's band: ${bandName}`
        : "Today's metal band is waiting for you!";

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🤘 Daily Metal Band',
          body,
          sound: true,
          channelId: 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: fireDate,
        },
      });
    }
  } catch (e) {
    console.error('Failed to schedule daily notification:', e);
  }
}
