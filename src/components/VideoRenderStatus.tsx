import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Download, Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

interface VideoRenderStatusProps {
  renderId: string;
  onComplete?: (videoUrl: string) => void;
  onError?: (error: string) => void;
}

export function VideoRenderStatus({ renderId, onComplete, onError }: VideoRenderStatusProps) {
  const [status, setStatus] = useState<'queued' | 'rendering' | 'done' | 'failed'>('queued');
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkStatus = async () => {
      try {
        // Mock status check - in production, call Shotstack API
        // const response = await fetch(`/api/shotstack/status/${renderId}`);
        // const data = await response.json();
        
        // Simulate progression for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (status === 'queued') {
          setStatus('rendering');
          setProgress(10);
        } else if (status === 'rendering') {
          const newProgress = Math.min(progress + Math.random() * 20, 95);
          setProgress(newProgress);
          
          // Simulate completion after reaching ~90%
          if (newProgress >= 90) {
            setStatus('done');
            setProgress(100);
            const mockUrl = `https://cdn.shotstack.io/videos/${renderId}.mp4`;
            setVideoUrl(mockUrl);
            if (onComplete) onComplete(mockUrl);
          }
        }
      } catch (err) {
        setStatus('failed');
        const errorMsg = 'Failed to render video';
        setError(errorMsg);
        if (onError) onError(errorMsg);
      }
    };
    
    if (status === 'queued' || status === 'rendering') {
      interval = setInterval(checkStatus, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [renderId, status, progress, onComplete, onError]);

  const getStatusIcon = () => {
    switch (status) {
      case 'queued':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'rendering':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'done':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'queued':
        return 'Video queued for rendering...';
      case 'rendering':
        return 'Rendering your video...';
      case 'done':
        return 'Video ready!';
      case 'failed':
        return 'Render failed';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'queued':
      case 'rendering':
        return 'bg-blue-50 border-blue-200';
      case 'done':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div className={`${getStatusColor()} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">{getStatusText()}</h4>
            {status === 'rendering' && (
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            )}
          </div>
          
          {status === 'rendering' && (
            <Progress value={progress} className="mb-2" />
          )}
          
          {status === 'queued' && (
            <p className="text-sm text-gray-600">
              Your video is in the queue. This usually takes 1-2 minutes.
            </p>
          )}
          
          {status === 'rendering' && (
            <p className="text-sm text-gray-600">
              Processing video with AI-selected hooks and audio choreography...
            </p>
          )}
          
          {status === 'done' && videoUrl && (
            <div className="space-y-2">
              <p className="text-sm text-green-700">
                Your video has been rendered successfully!
              </p>
              <Button
                size="sm"
                onClick={() => window.open(videoUrl, '_blank')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Video
              </Button>
            </div>
          )}
          
          {status === 'failed' && error && (
            <p className="text-sm text-red-700">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
