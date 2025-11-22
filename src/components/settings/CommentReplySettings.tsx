import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface CommentReplySettingsProps {
  settings: any;
  updateSetting: (key: string, value: any) => void;
  onBack: () => void;
}

export function CommentReplySettings({ settings, updateSetting, onBack }: CommentReplySettingsProps) {
  return (
    <div className="fixed top-0 right-0 bottom-0 w-full lg:w-[600px] bg-white dark:bg-[#000000] z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-[#333333] p-4 flex items-center gap-3">
        <button 
          className="text-gray-900 dark:text-white p-1" 
          onClick={onBack}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="text-gray-900 dark:text-white text-xl">Comment Automation</h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[#9CA3AF]">Active</span>
          <Switch
            checked={settings.commentRepliesActive}
            onCheckedChange={(checked) => updateSetting('commentRepliesActive', checked)}
          />
        </div>

        <div>
          <Label className="text-[#9CA3AF]">Reply Frequency</Label>
          <Select
            value={settings.commentReplyFrequency}
            onValueChange={(value) => updateSetting('commentReplyFrequency', value)}
          >
            <SelectTrigger className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="5min">5 minutes</SelectItem>
              <SelectItem value="15min">15 minutes</SelectItem>
              <SelectItem value="30min">30 minutes</SelectItem>
              <SelectItem value="1hr">1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-[#9CA3AF]">Usage Throttle</Label>
            <span className="text-xs text-gray-500 dark:text-[#6B7280] capitalize">{settings.commentThrottle}</span>
          </div>
          {/* Throttle indicator bar */}
          <div className="flex gap-1 h-2">
            <div className={`flex-1 rounded-full transition-all ${
              settings.commentThrottle === 'low' || settings.commentThrottle === 'medium' || settings.commentThrottle === 'high'
                ? 'bg-[#ec1e24]'
                : 'bg-gray-200 dark:bg-[#1A1A1A]'
            }`} />
            <div className={`flex-1 rounded-full transition-all ${
              settings.commentThrottle === 'medium' || settings.commentThrottle === 'high'
                ? 'bg-[#ec1e24]'
                : 'bg-gray-200 dark:bg-[#1A1A1A]'
            }`} />
            <div className={`flex-1 rounded-full transition-all ${
              settings.commentThrottle === 'high'
                ? 'bg-[#ec1e24]'
                : 'bg-gray-200 dark:bg-[#1A1A1A]'
            }`} />
          </div>
          <div className="flex justify-between mt-1">
            <button
              onClick={() => updateSetting('commentThrottle', 'low')}
              className="text-xs text-gray-500 dark:text-[#6B7280] hover:text-[#ec1e24]"
            >
              Low
            </button>
            <button
              onClick={() => updateSetting('commentThrottle', 'medium')}
              className="text-xs text-gray-500 dark:text-[#6B7280] hover:text-[#ec1e24]"
            >
              Medium
            </button>
            <button
              onClick={() => updateSetting('commentThrottle', 'high')}
              className="text-xs text-gray-500 dark:text-[#6B7280] hover:text-[#ec1e24]"
            >
              High
            </button>
          </div>
        </div>

        {/* X Platform Settings */}
        <div className="pt-4 border-t border-gray-200 dark:border-[#1F1F1F]">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-[#9CA3AF]">X (Twitter) Settings</Label>
            <Switch
              checked={settings.xCommentBlacklist.active}
              onCheckedChange={(checked) => updateSetting('xCommentBlacklist', { ...settings.xCommentBlacklist, active: checked })}
            />
          </div>
          <div className="space-y-3 pl-4 border-l-2 border-gray-200 dark:border-[#1F1F1F]">
            <div>
              <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Blacklist Usernames</Label>
              <Textarea
                value={settings.xCommentBlacklist.usernames}
                onChange={(e) => updateSetting('xCommentBlacklist', { ...settings.xCommentBlacklist, usernames: e.target.value })}
                placeholder="spam_user, troll_account"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1 min-h-[60px]"
              />
            </div>
            <div>
              <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Blacklist Keywords</Label>
              <Textarea
                value={settings.xCommentBlacklist.keywords}
                onChange={(e) => updateSetting('xCommentBlacklist', { ...settings.xCommentBlacklist, keywords: e.target.value })}
                placeholder="spam, badword"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1 min-h-[60px]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Do not reply to emoji-only comments</span>
              <Switch
                checked={settings.xCommentBlacklist.noEmojiOnly}
                onCheckedChange={(checked) => updateSetting('xCommentBlacklist', { ...settings.xCommentBlacklist, noEmojiOnly: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Do not reply to comments containing links</span>
              <Switch
                checked={settings.xCommentBlacklist.noLinks}
                onCheckedChange={(checked) => updateSetting('xCommentBlacklist', { ...settings.xCommentBlacklist, noLinks: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Pause replies on older posts</span>
              <Switch
                checked={settings.xCommentBlacklist.pauseOldPosts}
                onCheckedChange={(checked) => updateSetting('xCommentBlacklist', { ...settings.xCommentBlacklist, pauseOldPosts: checked })}
              />
            </div>
            {settings.xCommentBlacklist.pauseOldPosts && (
              <div>
                <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Pause replies for posts older than (hours)</Label>
                <Input
                  type="number"
                  value={settings.xCommentBlacklist.pauseAfterHours}
                  onChange={(e) => updateSetting('xCommentBlacklist', { ...settings.xCommentBlacklist, pauseAfterHours: e.target.value })}
                  className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* Threads Platform Settings */}
        <div className="pt-4 border-t border-gray-200 dark:border-[#1F1F1F]">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-[#9CA3AF]">Threads Settings</Label>
            <Switch
              checked={settings.threadsCommentBlacklist.active}
              onCheckedChange={(checked) => updateSetting('threadsCommentBlacklist', { ...settings.threadsCommentBlacklist, active: checked })}
            />
          </div>
          <div className="space-y-3 pl-4 border-l-2 border-gray-200 dark:border-[#1F1F1F]">
            <div>
              <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Blacklist Usernames</Label>
              <Textarea
                value={settings.threadsCommentBlacklist.usernames}
                onChange={(e) => updateSetting('threadsCommentBlacklist', { ...settings.threadsCommentBlacklist, usernames: e.target.value })}
                placeholder="spam_user, troll_account"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1 min-h-[60px]"
              />
            </div>
            <div>
              <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Blacklist Keywords</Label>
              <Textarea
                value={settings.threadsCommentBlacklist.keywords}
                onChange={(e) => updateSetting('threadsCommentBlacklist', { ...settings.threadsCommentBlacklist, keywords: e.target.value })}
                placeholder="spam, badword"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1 min-h-[60px]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Do not reply to emoji-only comments</span>
              <Switch
                checked={settings.threadsCommentBlacklist.noEmojiOnly}
                onCheckedChange={(checked) => updateSetting('threadsCommentBlacklist', { ...settings.threadsCommentBlacklist, noEmojiOnly: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Do not reply to comments containing links</span>
              <Switch
                checked={settings.threadsCommentBlacklist.noLinks}
                onCheckedChange={(checked) => updateSetting('threadsCommentBlacklist', { ...settings.threadsCommentBlacklist, noLinks: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Pause replies on older posts</span>
              <Switch
                checked={settings.threadsCommentBlacklist.pauseOldPosts}
                onCheckedChange={(checked) => updateSetting('threadsCommentBlacklist', { ...settings.threadsCommentBlacklist, pauseOldPosts: checked })}
              />
            </div>
            {settings.threadsCommentBlacklist.pauseOldPosts && (
              <div>
                <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Pause replies for posts older than (hours)</Label>
                <Input
                  type="number"
                  value={settings.threadsCommentBlacklist.pauseAfterHours}
                  onChange={(e) => updateSetting('threadsCommentBlacklist', { ...settings.threadsCommentBlacklist, pauseAfterHours: e.target.value })}
                  className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* Facebook Platform Settings */}
        <div className="pt-4 border-t border-gray-200 dark:border-[#1F1F1F]">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-[#9CA3AF]">Facebook Settings</Label>
            <Switch
              checked={settings.facebookCommentBlacklist.active}
              onCheckedChange={(checked) => updateSetting('facebookCommentBlacklist', { ...settings.facebookCommentBlacklist, active: checked })}
            />
          </div>
          <div className="space-y-3 pl-4 border-l-2 border-gray-200 dark:border-[#1F1F1F]">
            <div>
              <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Blacklist Usernames</Label>
              <Textarea
                value={settings.facebookCommentBlacklist.usernames}
                onChange={(e) => updateSetting('facebookCommentBlacklist', { ...settings.facebookCommentBlacklist, usernames: e.target.value })}
                placeholder="spam_user, troll_account"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1 min-h-[60px]"
              />
            </div>
            <div>
              <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Blacklist Keywords</Label>
              <Textarea
                value={settings.facebookCommentBlacklist.keywords}
                onChange={(e) => updateSetting('facebookCommentBlacklist', { ...settings.facebookCommentBlacklist, keywords: e.target.value })}
                placeholder="spam, badword"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1 min-h-[60px]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Do not reply to emoji-only comments</span>
              <Switch
                checked={settings.facebookCommentBlacklist.noEmojiOnly}
                onCheckedChange={(checked) => updateSetting('facebookCommentBlacklist', { ...settings.facebookCommentBlacklist, noEmojiOnly: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Do not reply to comments containing links</span>
              <Switch
                checked={settings.facebookCommentBlacklist.noLinks}
                onCheckedChange={(checked) => updateSetting('facebookCommentBlacklist', { ...settings.facebookCommentBlacklist, noLinks: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Pause replies on older posts</span>
              <Switch
                checked={settings.facebookCommentBlacklist.pauseOldPosts}
                onCheckedChange={(checked) => updateSetting('facebookCommentBlacklist', { ...settings.facebookCommentBlacklist, pauseOldPosts: checked })}
              />
            </div>
            {settings.facebookCommentBlacklist.pauseOldPosts && (
              <div>
                <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Pause replies for posts older than (hours)</Label>
                <Input
                  type="number"
                  value={settings.facebookCommentBlacklist.pauseAfterHours}
                  onChange={(e) => updateSetting('facebookCommentBlacklist', { ...settings.facebookCommentBlacklist, pauseAfterHours: e.target.value })}
                  className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* Instagram Platform Settings */}
        <div className="pt-4 border-t border-gray-200 dark:border-[#1F1F1F]">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-[#9CA3AF]">Instagram Settings</Label>
            <Switch
              checked={settings.instagramCommentBlacklist.active}
              onCheckedChange={(checked) => updateSetting('instagramCommentBlacklist', { ...settings.instagramCommentBlacklist, active: checked })}
            />
          </div>
          <div className="space-y-3 pl-4 border-l-2 border-gray-200 dark:border-[#1F1F1F]">
            <div>
              <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Blacklist Usernames</Label>
              <Textarea
                value={settings.instagramCommentBlacklist.usernames}
                onChange={(e) => updateSetting('instagramCommentBlacklist', { ...settings.instagramCommentBlacklist, usernames: e.target.value })}
                placeholder="spam_user, troll_account"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1 min-h-[60px]"
              />
            </div>
            <div>
              <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Blacklist Keywords</Label>
              <Textarea
                value={settings.instagramCommentBlacklist.keywords}
                onChange={(e) => updateSetting('instagramCommentBlacklist', { ...settings.instagramCommentBlacklist, keywords: e.target.value })}
                placeholder="spam, badword"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1 min-h-[60px]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Do not reply to emoji-only comments</span>
              <Switch
                checked={settings.instagramCommentBlacklist.noEmojiOnly}
                onCheckedChange={(checked) => updateSetting('instagramCommentBlacklist', { ...settings.instagramCommentBlacklist, noEmojiOnly: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Do not reply to comments containing links</span>
              <Switch
                checked={settings.instagramCommentBlacklist.noLinks}
                onCheckedChange={(checked) => updateSetting('instagramCommentBlacklist', { ...settings.instagramCommentBlacklist, noLinks: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Pause replies on older posts</span>
              <Switch
                checked={settings.instagramCommentBlacklist.pauseOldPosts}
                onCheckedChange={(checked) => updateSetting('instagramCommentBlacklist', { ...settings.instagramCommentBlacklist, pauseOldPosts: checked })}
              />
            </div>
            {settings.instagramCommentBlacklist.pauseOldPosts && (
              <div>
                <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Pause replies for posts older than (hours)</Label>
                <Input
                  type="number"
                  value={settings.instagramCommentBlacklist.pauseAfterHours}
                  onChange={(e) => updateSetting('instagramCommentBlacklist', { ...settings.instagramCommentBlacklist, pauseAfterHours: e.target.value })}
                  className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* YouTube Platform Settings */}
        <div className="pt-4 border-t border-gray-200 dark:border-[#1F1F1F]">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-[#9CA3AF]">YouTube Settings</Label>
            <Switch
              checked={settings.youtubeCommentBlacklist.active}
              onCheckedChange={(checked) => updateSetting('youtubeCommentBlacklist', { ...settings.youtubeCommentBlacklist, active: checked })}
            />
          </div>
          <div className="space-y-3 pl-4 border-l-2 border-gray-200 dark:border-[#1F1F1F]">
            <div>
              <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Blacklist Usernames</Label>
              <Textarea
                value={settings.youtubeCommentBlacklist.usernames}
                onChange={(e) => updateSetting('youtubeCommentBlacklist', { ...settings.youtubeCommentBlacklist, usernames: e.target.value })}
                placeholder="spam_user, troll_account"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1 min-h-[60px]"
              />
            </div>
            <div>
              <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Blacklist Keywords</Label>
              <Textarea
                value={settings.youtubeCommentBlacklist.keywords}
                onChange={(e) => updateSetting('youtubeCommentBlacklist', { ...settings.youtubeCommentBlacklist, keywords: e.target.value })}
                placeholder="spam, badword"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1 min-h-[60px]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Do not reply to emoji-only comments</span>
              <Switch
                checked={settings.youtubeCommentBlacklist.noEmojiOnly}
                onCheckedChange={(checked) => updateSetting('youtubeCommentBlacklist', { ...settings.youtubeCommentBlacklist, noEmojiOnly: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Do not reply to comments containing links</span>
              <Switch
                checked={settings.youtubeCommentBlacklist.noLinks}
                onCheckedChange={(checked) => updateSetting('youtubeCommentBlacklist', { ...settings.youtubeCommentBlacklist, noLinks: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF]">Pause replies on older posts</span>
              <Switch
                checked={settings.youtubeCommentBlacklist.pauseOldPosts}
                onCheckedChange={(checked) => updateSetting('youtubeCommentBlacklist', { ...settings.youtubeCommentBlacklist, pauseOldPosts: checked })}
              />
            </div>
            {settings.youtubeCommentBlacklist.pauseOldPosts && (
              <div>
                <Label className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Pause replies for posts older than (hours)</Label>
                <Input
                  type="number"
                  value={settings.youtubeCommentBlacklist.pauseAfterHours}
                  onChange={(e) => updateSetting('youtubeCommentBlacklist', { ...settings.youtubeCommentBlacklist, pauseAfterHours: e.target.value })}
                  className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}