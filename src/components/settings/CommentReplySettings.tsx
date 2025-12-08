import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Slider } from '../ui/slider';
import { haptics } from '../../utils/haptics';
import { toast } from 'sonner@2.0.3';

interface CommentReplySettingsProps {
  settings: any;
  updateSetting: (key: string, value: any) => void;
  onBack: () => void;
}

export function CommentReplySettings({ settings, updateSetting, onBack }: CommentReplySettingsProps) {
  return (
    <div className="fixed top-0 right-0 bottom-0 w-full lg:w-[600px] bg-white dark:bg-[#000000] z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-[#333333] p-4 flex items-center gap-4 z-10">
        <button 
          className="text-gray-900 dark:text-white hover:text-[#ec1e24] p-2 -ml-2" 
          onClick={() => {
            haptics.light();
            onBack();
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12H2M9 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="text-2xl text-gray-900 dark:text-white">Comment Automation</h2>
      </div>

      <div className="p-6 space-y-4">
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

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-[#333333]"></div>

        {/* Reply Generation Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 dark:text-white mb-1">Reply Generation (Comment Automation)</h3>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">
              AI-powered reply generation for user comments across platforms
            </p>
          </div>

          {/* Reply AI Model */}
          <div>
            <Label htmlFor="comment-reply-model" className="text-[#9CA3AF]">Reply AI Model</Label>
            <Select
              value={settings.commentReplyModel || 'gpt-4o'}
              onValueChange={(value) => {
                haptics.light();
                updateSetting('commentReplyModel', value);
                toast.success(`Reply AI Model changed to ${value}`);
              }}
            >
              <SelectTrigger id="comment-reply-model" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              GPT-4o balances creativity and cost for engaging comment replies
            </p>
          </div>

          {/* Reply Creativity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-[#9CA3AF]">Reply Creativity (Temperature)</Label>
              <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">
                {settings.commentReplyTemperature || 0.7} - Balanced
              </span>
            </div>
            <Slider
              value={[settings.commentReplyTemperature || 0.7]}
              onValueChange={(value) => {
                haptics.light();
                updateSetting('commentReplyTemperature', value[0]);
              }}
              min={0}
              max={1}
              step={0.1}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-2">
              Recommended: 0.7 — Balanced creativity for engaging yet relevant replies
            </p>
          </div>

          {/* Reply Tone */}
          <div>
            <Label htmlFor="comment-reply-tone" className="text-[#9CA3AF]">Reply Tone</Label>
            <Select
              value={settings.commentReplyTone || 'Friendly'}
              onValueChange={(value) => {
                haptics.light();
                updateSetting('commentReplyTone', value);
              }}
            >
              <SelectTrigger id="comment-reply-tone" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Friendly">Friendly (Recommended)</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Informative">Informative</SelectItem>
                <SelectItem value="Witty">Witty</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              Sets the overall tone and style for generated replies
            </p>
          </div>

          {/* Max Reply Length */}
          <div>
            <Label htmlFor="comment-reply-length" className="text-[#9CA3AF]">Max Reply Length (Characters)</Label>
            <Input
              id="comment-reply-length"
              type="number"
              value={settings.commentReplyMaxLength || 280}
              onChange={(e) => {
                haptics.light();
                updateSetting('commentReplyMaxLength', parseInt(e.target.value));
              }}
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              280 for X/Twitter compatibility, 500 for most platforms
            </p>
          </div>

          {/* Reply Generation Prompt */}
          <div>
            <Label htmlFor="comment-reply-prompt" className="text-[#9CA3AF]">Reply Generation Prompt</Label>
            <textarea
              id="comment-reply-prompt"
              value={settings.commentReplyPrompt || `You are an AI social media manager for Screen Render, responding to audience comments on movie/TV trailer posts. Your goal is to provide helpful, accurate, engaging, and human-like replies.

CONTEXT AWARENESS:
• You will receive the POST CAPTION and VIDEO TITLE for context about what the audience is commenting on
• Use this context to make your replies relevant and specific to the content
• Reference specific details from the post when appropriate

SEARCH CAPABILITY:
• For questions requiring current information, facts, release dates, cast details, or external knowledge:
  - Determine if the question needs a web search for accurate answers
  - Use search only when necessary (e.g., "When does it come out?", "Who's directing?", "Is this based on a true story?")
  - Cite factual information naturally without saying "According to search results..."
  - If search is unavailable or fails, respond with what you know or suggest where to find the answer

REPLY STYLE & TONE:
• Be warm, friendly, conversational, and genuinely helpful
• Write like a real person, not a corporate bot
• Use contractions, casual phrasing, and light humor when appropriate
• Keep replies concise (1-2 sentences max, unless explaining something complex)
• Match the energy level of the commenter

BEHAVIOR RULES:
• DO NOT use greetings ("Hi!", "Hey there!") or sign-offs
• DO NOT ask follow-up questions unless genuinely helpful
• DO reply to "thanks" with brief responses ("You're welcome!", "Anytime! 🙌")
• DO reply to emoji-only comments with a relevant emoji or brief reaction
• DO verify movie/TV show titles and facts before responding
• DO NOT reply to your own previous responses in a chain
• DO NOT use marketing language, promotional speak, or sales tactics
• DO NOT make up information - if you don't know, say so honestly

RESPONSE EXAMPLES:
Comment: "When does this drop?"
Reply: "Hitting theaters November 22! 🎬"

Comment: "Is this a sequel or reboot?"
Reply: "It's a standalone story, but set in the same universe as the original!"

Comment: "Who's in the cast?"
Reply: "Starring Timothée Chalamet, Zendaya, and Austin Butler. The ensemble is incredible! ⭐"

Comment: "Can't wait! 🔥🔥🔥"
Reply: "🔥🎥"

Keep all replies authentic, helpful, and end-to-end human.`}
              onChange={(e) => {
                haptics.light();
                updateSetting('commentReplyPrompt', e.target.value);
              }}
              rows={24}
              className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white font-mono mt-1 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              Instructions for AI to generate context-aware, intelligent replies
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-[#333333] my-4"></div>

          {/* Internet Search Settings */}
          <div className="space-y-4">
            <div>
              <h4 className="text-gray-900 dark:text-white mb-1">Internet Search Integration</h4>
              <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">
                Enable AI to search the internet for accurate, up-to-date information when answering questions that require external knowledge
              </p>
            </div>

            {/* Google Search API Toggle */}
            <div className="flex items-start justify-between gap-4 p-4 bg-white dark:bg-[#000000] rounded-xl border border-gray-200 dark:border-[#333333]">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-gray-900 dark:text-white">Use Google Search API</Label>
                </div>
                <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">
                  Uses Google's Custom Search API for comprehensive web searches. Requires Google Search API key configured in API Keys settings.
                </p>
              </div>
              <Switch
                checked={settings.commentUseGoogleSearch || false}
                onCheckedChange={(checked) => {
                  haptics.medium();
                  updateSetting('commentUseGoogleSearch', checked);
                  toast.success(checked ? 'Google Search API enabled for comment replies' : 'Google Search API disabled');
                }}
              />
            </div>

            {/* Serper Toggle */}
            <div className="flex items-start justify-between gap-4 p-4 bg-white dark:bg-[#000000] rounded-xl border border-gray-200 dark:border-[#333333]">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-gray-900 dark:text-white">Use Serper API</Label>
                </div>
                <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">
                  Uses Serper.dev for fast, accurate web searches. Requires Serper API key configured in API Keys settings.
                </p>
              </div>
              <Switch
                checked={settings.commentUseSerper || false}
                onCheckedChange={(checked) => {
                  haptics.medium();
                  updateSetting('commentUseSerper', checked);
                  toast.success(checked ? 'Serper API enabled for comment replies' : 'Serper API disabled');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}