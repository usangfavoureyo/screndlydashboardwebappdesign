import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Trash2, Edit } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  channelId: string;
  active: boolean;
  videoCount: number;
}

export function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([
    { id: '1', name: 'Warner Bros. Pictures', channelId: '@warnerbros', active: true, videoCount: 234 },
    { id: '2', name: 'Marvel Entertainment', channelId: '@marvel', active: true, videoCount: 189 },
    { id: '3', name: 'Universal Pictures', channelId: '@universalpictures', active: true, videoCount: 156 },
    { id: '4', name: 'Sony Pictures', channelId: '@sonypictures', active: false, videoCount: 142 },
    { id: '5', name: 'Paramount Pictures', channelId: '@paramountpictures', active: true, videoCount: 98 },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelId, setNewChannelId] = useState('');

  const toggleChannel = (id: string) => {
    setChannels(channels.map(ch => ch.id === id ? { ...ch, active: !ch.active } : ch));
  };

  const deleteChannel = (id: string) => {
    setChannels(channels.filter(ch => ch.id !== id));
  };

  const addChannel = () => {
    if (newChannelName && newChannelId) {
      const newChannel: Channel = {
        id: Date.now().toString(),
        name: newChannelName,
        channelId: newChannelId,
        active: true,
        videoCount: 0,
      };
      setChannels([...channels, newChannel]);
      setNewChannelName('');
      setNewChannelId('');
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#111827] dark:text-white mb-2">Channels</h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">Manage YouTube channels to monitor for new trailers.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#F45247] hover:bg-[#E04238] text-white rounded-xl gap-2">
              <Plus className="w-4 h-4" />
              Add Channel
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add New Channel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="channel-name">Channel Name</Label>
                <Input
                  id="channel-name"
                  placeholder="e.g., Warner Bros. Pictures"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel-id">Channel ID / Handle</Label>
                <Input
                  id="channel-id"
                  placeholder="e.g., @warnerbros"
                  value={newChannelId}
                  onChange={(e) => setNewChannelId(e.target.value)}
                  className="rounded-lg"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addChannel}
                  className="rounded-lg"
                >
                  Add Channel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="bg-[#1F2937] rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-white mb-1">{channel.name}</h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]">{channel.channelId}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-white">{channel.videoCount}</p>
                  <p className="text-[#9CA3AF]">videos</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={channel.active}
                    onCheckedChange={() => toggleChannel(channel.id)}
                  />
                  <span className="text-[#9CA3AF]">
                    {channel.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-[#9CA3AF] hover:text-[#F45247] rounded-lg">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteChannel(channel.id)}
                    className="text-[#9CA3AF] hover:text-[#EF4444] rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}