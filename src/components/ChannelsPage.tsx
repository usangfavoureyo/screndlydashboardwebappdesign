import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Plus, Trash2, Edit } from 'lucide-react';
import { haptics } from '../utils/haptics';
import { youtubePoller } from '../utils/youtube-poller';
import { toast } from 'sonner@2.0.3';
import type { Channel } from '../utils/youtube-rss';
import { useUndo } from './UndoContext';

export function ChannelsPage() {
  const { showUndo } = useUndo();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [pollInterval] = useState(2);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelId, setNewChannelId] = useState('');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [editChannelName, setEditChannelName] = useState('');
  const [editChannelId, setEditChannelId] = useState('');

  // Load channels on mount
  useEffect(() => {
    const loadedChannels = youtubePoller.getChannels();
    
    // If no channels loaded from poller, use mock data
    if (loadedChannels.length === 0) {
      const mockChannels: Channel[] = [
        { id: '1', name: 'Universal Pictures', channelId: '@UniversalPictures', active: true, videoCount: 234, lastChecked: null, lastVideoId: null },
        { id: '2', name: 'Prime Video', channelId: '@PrimeVideo', active: true, videoCount: 312, lastChecked: null, lastVideoId: null },
        { id: '3', name: 'Studio Canal', channelId: '@STUDIOCANAL', active: true, videoCount: 156, lastChecked: null, lastVideoId: null },
        { id: '4', name: 'Warner Bros. Pictures', channelId: '@warnerbros', active: true, videoCount: 428, lastChecked: null, lastVideoId: null },
        { id: '5', name: 'Netflix', channelId: '@Netflix', active: true, videoCount: 567, lastChecked: null, lastVideoId: null },
        { id: '6', name: 'Sony Pictures', channelId: '@SonyPictures', active: true, videoCount: 289, lastChecked: null, lastVideoId: null },
        { id: '7', name: 'A24', channelId: '@A24', active: true, videoCount: 178, lastChecked: null, lastVideoId: null },
        { id: '8', name: 'Skydance', channelId: '@skydance', active: true, videoCount: 92, lastChecked: null, lastVideoId: null },
        { id: '9', name: 'Paramount Pictures', channelId: '@ParamountPictures', active: true, videoCount: 345, lastChecked: null, lastVideoId: null },
        { id: '10', name: '20th Century Studios', channelId: '@20thcenturystudios', active: true, videoCount: 267, lastChecked: null, lastVideoId: null },
        { id: '11', name: 'Marvel Entertainment', channelId: '@Marvel', active: true, videoCount: 523, lastChecked: null, lastVideoId: null },
        { id: '12', name: 'Lionsgate', channelId: '@Lionsgate', active: true, videoCount: 198, lastChecked: null, lastVideoId: null },
        { id: '13', name: 'Apple TV', channelId: '@AppleTV', active: true, videoCount: 156, lastChecked: null, lastVideoId: null },
        { id: '14', name: 'Pixar', channelId: '@Pixar', active: true, videoCount: 134, lastChecked: null, lastVideoId: null },
        { id: '15', name: 'Disney', channelId: '@Disney', active: true, videoCount: 445, lastChecked: null, lastVideoId: null },
        { id: '16', name: 'Max', channelId: '@StreamOnMax', active: true, videoCount: 234, lastChecked: null, lastVideoId: null },
      ];
      
      // Add mock channels to poller
      mockChannels.forEach(ch => {
        youtubePoller.addChannel(ch.channelId, ch.name);
      });
      
      setChannels(youtubePoller.getChannels());
    } else {
      setChannels(loadedChannels);
    }
    
    // Start polling if there are active channels
    const currentChannels = youtubePoller.getChannels();
    if (currentChannels.some(ch => ch.active)) {
      youtubePoller.startPolling(pollInterval);
      setIsPolling(true);
    }
    
    // Set up notification callback
    youtubePoller.setNotificationCallback((notification) => {
      toast.success(notification.title, {
        description: notification.message,
      });
    });
    
    // Refresh channels list every 5 seconds
    const refreshInterval = setInterval(() => {
      setChannels([...youtubePoller.getChannels()]);
    }, 5000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [pollInterval]);

  const toggleChannel = (id: string) => {
    haptics.light();
    youtubePoller.toggleChannel(id);
    setChannels([...youtubePoller.getChannels()]);
    
    // Restart polling if needed
    const activeChannels = youtubePoller.getChannels().filter(ch => ch.active);
    if (activeChannels.length > 0 && !isPolling) {
      youtubePoller.startPolling(pollInterval);
      setIsPolling(true);
    } else if (activeChannels.length === 0) {
      youtubePoller.stopPolling();
      setIsPolling(false);
    }
  };

  const deleteChannel = (id: string) => {
    haptics.medium();
    
    // Find the channel and its index to delete
    const channelIndex = channels.findIndex(ch => ch.id === id);
    const deletedChannel = channels.find(ch => ch.id === id);
    if (!deletedChannel || channelIndex === -1) return;
    
    // Store the original index
    const originalIndex = channelIndex;
    
    // Temporarily remove from poller
    youtubePoller.removeChannel(id);
    setChannels([...youtubePoller.getChannels()]);
    
    // Show undo toast
    showUndo({
      id,
      itemName: deletedChannel.name,
      onUndo: () => {
        // Restore the channel at its original position
        youtubePoller.restoreChannel(deletedChannel, originalIndex);
        setChannels([...youtubePoller.getChannels()]);
      },
      onConfirm: () => {
        // Show final confirmation
        toast.success('Channel removed');
      }
    });
  };

  const addChannel = async () => {
    if (newChannelName && newChannelId) {
      haptics.success();
      youtubePoller.addChannel(newChannelId, newChannelName);
      setChannels([...youtubePoller.getChannels()]);
      setNewChannelName('');
      setNewChannelId('');
      setIsAddDialogOpen(false);
      toast.success(`Added ${newChannelName} to monitoring`);
      
      // Start polling if not already
      if (!isPolling) {
        youtubePoller.startPolling(pollInterval);
        setIsPolling(true);
      }
    }
  };

  const openEditDialog = (channel: Channel) => {
    haptics.light();
    setEditingChannel(channel);
    setEditChannelName(channel.name);
    setEditChannelId(channel.channelId);
    setIsEditDialogOpen(true);
  };

  const editChannel = () => {
    if (editingChannel && editChannelName && editChannelId) {
      haptics.success();
      youtubePoller.updateChannel(editingChannel.id, {
        name: editChannelName,
        channelId: editChannelId,
      });
      setChannels([...youtubePoller.getChannels()]);
      setEditingChannel(null);
      setEditChannelName('');
      setEditChannelId('');
      setIsEditDialogOpen(false);
      toast.success('Channel updated');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#111827] dark:text-white mb-2">Channels</h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">Monitor YouTube channels for new 16:9 landscape trailers.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => haptics.light()}
              className="bg-[#ec1e24] hover:bg-[#d11b20] text-white rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Channel
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl" hideCloseButton>
            <DialogHeader>
              <DialogTitle>Add New Channel</DialogTitle>
              <DialogDescription>Enter the channel name and ID to add a new channel.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="channel-name">Channel Name</Label>
                <Input
                  id="channel-name"
                  placeholder="e.g., Warner Bros. Pictures"
                  value={newChannelName}
                  onFocus={() => haptics.light()}
                  onChange={(e) => {
                    haptics.light();
                    setNewChannelName(e.target.value);
                  }}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel-id">Channel ID / Handle</Label>
                <Input
                  id="channel-id"
                  placeholder="e.g., @warnerbros or UCjmJDM5pRKbUlVIzDYYWb6g"
                  value={newChannelId}
                  onFocus={() => haptics.light()}
                  onChange={(e) => {
                    haptics.light();
                    setNewChannelId(e.target.value);
                  }}
                  className="rounded-lg"
                />
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  You can use @handle or the channel ID (starts with UC)
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    haptics.light();
                    setIsAddDialogOpen(false);
                  }}
                  className="rounded-lg bg-white dark:bg-[#000000]"
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-2xl" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Edit Channel</DialogTitle>
            <DialogDescription>Update the channel name and ID.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-channel-name">Channel Name</Label>
              <Input
                id="edit-channel-name"
                placeholder="e.g., Warner Bros. Pictures"
                value={editChannelName}
                onFocus={() => haptics.light()}
                onChange={(e) => {
                  haptics.light();
                  setEditChannelName(e.target.value);
                }}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-channel-id">Channel ID / Handle</Label>
              <Input
                id="edit-channel-id"
                placeholder="e.g., @warnerbros"
                value={editChannelId}
                onFocus={() => haptics.light()}
                onChange={(e) => {
                  haptics.light();
                  setEditChannelId(e.target.value);
                }}
                className="rounded-lg"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  haptics.light();
                  setIsEditDialogOpen(false);
                }}
                className="rounded-lg bg-white dark:bg-[#000000]"
              >
                Cancel
              </Button>
              <Button
                onClick={editChannel}
                className="rounded-lg bg-[#ec1e24] hover:bg-[#d11b20] text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-4">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-white mb-1">{channel.name}</h3>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]">{channel.channelId}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-left lg:text-right">
                  <p className="text-gray-900 dark:text-white">{channel.videoCount}</p>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF]">videos</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={channel.active}
                    onCheckedChange={() => toggleChannel(channel.id)}
                  />
                  <span className="text-[#6B7280] dark:text-[#9CA3AF]">
                    {channel.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(channel)}
                    className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#ec1e24] rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteChannel(channel.id)}
                    className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#EF4444] rounded-lg"
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