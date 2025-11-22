import { Switch } from '../ui/switch';

interface NotificationsSettingsProps {
  settings: any;
  updateSetting: (key: string, value: any) => void;
  onBack: () => void;
}

export function NotificationsSettings({ settings, updateSetting, onBack }: NotificationsSettingsProps) {
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
        <h2 className="text-gray-900 dark:text-white text-xl">Notifications</h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[#9CA3AF]">Email Notifications</span>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#9CA3AF]">Push Notifications</span>
          <Switch
            checked={settings.pushNotifications}
            onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
          />
        </div>
      </div>
    </div>
  );
}