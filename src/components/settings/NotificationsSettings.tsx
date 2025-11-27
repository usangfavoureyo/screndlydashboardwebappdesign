import { Switch } from '../ui/switch';
import { Bell, BellOff, Clock, Filter } from 'lucide-react';
import { haptics } from '../../utils/haptics';
import { desktopNotifications } from '../../utils/desktopNotifications';

interface NotificationsSettingsProps {
  settings: any;
  updateSetting: (key: string, value: any) => void;
  onBack: () => void;
}

export function NotificationsSettings({ settings, updateSetting, onBack }: NotificationsSettingsProps) {
  const handleDesktopNotificationToggle = async (checked: boolean) => {
    haptics.medium();
    
    if (checked) {
      // Request permission
      const granted = await desktopNotifications.requestPermission();
      if (granted) {
        updateSetting('desktopNotifications', true);
        // Send test notification
        desktopNotifications.sendTyped(
          'success',
          'Desktop Notifications Enabled',
          'You\'ll now receive notifications on your desktop'
        );
      } else {
        // Permission denied
        updateSetting('desktopNotifications', false);
      }
    } else {
      updateSetting('desktopNotifications', false);
    }
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 w-full lg:w-[600px] bg-white dark:bg-[#000000] z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-[#333333] p-4 flex items-center gap-3">
        <button 
          className="text-gray-900 dark:text-white p-1" 
          onClick={onBack}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12H2M9 19l-7-7 7-7"/>
          </svg>
        </button>
        <Bell className="w-5 h-5 text-[#ec1e24]" />
        <h2 className="text-gray-900 dark:text-white text-xl">Notifications</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* General Settings */}
        <div>
          <h3 className="text-sm text-gray-900 dark:text-white mb-3">General</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#6B7280]" />
                <div>
                  <span className="text-sm text-gray-900 dark:text-white block">In-App Notifications</span>
                  <span className="text-xs text-[#6B7280]">Show notifications in the app</span>
                </div>
              </div>
              <Switch
                checked={settings.inAppNotifications ?? true}
                onCheckedChange={(checked) => {
                  haptics.light();
                  updateSetting('inAppNotifications', checked);
                }}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#6B7280]" />
                <div>
                  <span className="text-sm text-gray-900 dark:text-white block">Desktop Notifications</span>
                  <span className="text-xs text-[#6B7280]">Push notifications to your desktop</span>
                </div>
              </div>
              <Switch
                checked={settings.desktopNotifications ?? false}
                onCheckedChange={handleDesktopNotificationToggle}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
              <div className="flex items-center gap-3">
                <BellOff className="w-5 h-5 text-[#6B7280]" />
                <div>
                  <span className="text-sm text-gray-900 dark:text-white block">Sound</span>
                  <span className="text-xs text-[#6B7280]">Play sound for notifications</span>
                </div>
              </div>
              <Switch
                checked={settings.notificationSound ?? true}
                onCheckedChange={(checked) => {
                  haptics.light();
                  updateSetting('notificationSound', checked);
                }}
              />
            </div>
          </div>
        </div>

        {/* Notification Categories */}
        <div>
          <h3 className="text-sm text-gray-900 dark:text-white mb-3">Categories</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
              <div>
                <span className="text-sm text-gray-900 dark:text-white block">Upload Notifications</span>
                <span className="text-xs text-[#6B7280]">Video uploads and processing</span>
              </div>
              <Switch
                checked={settings.notifyUploads ?? true}
                onCheckedChange={(checked) => {
                  haptics.light();
                  updateSetting('notifyUploads', checked);
                }}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
              <div>
                <span className="text-sm text-gray-900 dark:text-white block">RSS Feed Notifications</span>
                <span className="text-xs text-[#6B7280]">New trailer feeds detected</span>
              </div>
              <Switch
                checked={settings.notifyRSS ?? true}
                onCheckedChange={(checked) => {
                  haptics.light();
                  updateSetting('notifyRSS', checked);
                }}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
              <div>
                <span className="text-sm text-gray-900 dark:text-white block">TMDb Notifications</span>
                <span className="text-xs text-[#6B7280]">Movie/TV updates from TMDb</span>
              </div>
              <Switch
                checked={settings.notifyTMDb ?? true}
                onCheckedChange={(checked) => {
                  haptics.light();
                  updateSetting('notifyTMDb', checked);
                }}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
              <div>
                <span className="text-sm text-gray-900 dark:text-white block">Video Studio Notifications</span>
                <span className="text-xs text-[#6B7280]">Video generation and processing</span>
              </div>
              <Switch
                checked={settings.notifyVideoStudio ?? true}
                onCheckedChange={(checked) => {
                  haptics.light();
                  updateSetting('notifyVideoStudio', checked);
                }}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
              <div>
                <span className="text-sm text-gray-900 dark:text-white block">System Notifications</span>
                <span className="text-xs text-[#6B7280]">App updates and maintenance</span>
              </div>
              <Switch
                checked={settings.notifySystem ?? true}
                onCheckedChange={(checked) => {
                  haptics.light();
                  updateSetting('notifySystem', checked);
                }}
              />
            </div>
          </div>
        </div>

        {/* Notification Timing */}
        <div>
          <h3 className="text-sm text-gray-900 dark:text-white mb-3">Timing</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#6B7280]" />
                <div>
                  <span className="text-sm text-gray-900 dark:text-white block">Auto-dismiss Toasts</span>
                  <span className="text-xs text-[#6B7280]">Automatically close toast notifications</span>
                </div>
              </div>
              <Switch
                checked={settings.autoDismissToasts ?? true}
                onCheckedChange={(checked) => {
                  haptics.light();
                  updateSetting('autoDismissToasts', checked);
                }}
              />
            </div>

            <div className="p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
              <label className="text-sm text-gray-900 dark:text-white block mb-2">
                Toast Duration
              </label>
              <select
                value={settings.toastDuration ?? 5000}
                onChange={(e) => {
                  haptics.light();
                  updateSetting('toastDuration', parseInt(e.target.value));
                }}
                className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
              >
                <option value={3000}>3 seconds</option>
                <option value={5000}>5 seconds</option>
                <option value={7000}>7 seconds</option>
                <option value={10000}>10 seconds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Do Not Disturb */}
        <div>
          <h3 className="text-sm text-gray-900 dark:text-white mb-3">Do Not Disturb</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
              <div className="flex items-center gap-3">
                <BellOff className="w-5 h-5 text-[#6B7280]" />
                <div>
                  <span className="text-sm text-gray-900 dark:text-white block">Enable Do Not Disturb</span>
                  <span className="text-xs text-[#6B7280]">Mute all notifications during set hours</span>
                </div>
              </div>
              <Switch
                checked={settings.doNotDisturb ?? false}
                onCheckedChange={(checked) => {
                  haptics.light();
                  updateSetting('doNotDisturb', checked);
                }}
              />
            </div>

            {settings.doNotDisturb && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
                  <label className="text-xs text-[#6B7280] block mb-2">Start Time</label>
                  <input
                    type="time"
                    value={settings.dndStartTime ?? '22:00'}
                    onChange={(e) => {
                      haptics.light();
                      updateSetting('dndStartTime', e.target.value);
                    }}
                    className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div className="p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
                  <label className="text-xs text-[#6B7280] block mb-2">End Time</label>
                  <input
                    type="time"
                    value={settings.dndEndTime ?? '08:00'}
                    onChange={(e) => {
                      haptics.light();
                      updateSetting('dndEndTime', e.target.value);
                    }}
                    className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}