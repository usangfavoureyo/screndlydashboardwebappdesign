import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Filter, Trash2, Play, Pause, RefreshCw, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { useJobsStore, UploadJob } from '../../store/useJobsStore';
import { haptics } from '../../utils/haptics';
import { JobTable } from './JobTable';
import { TaskInspector } from './TaskInspector';
import { ErrorModal } from './ErrorModal';
import { SystemLogViewer } from './SystemLogViewer';
import { EmptyState } from './EmptyStates';

interface UploadManagerPageProps {
  onBack: () => void;
}

export function UploadManagerPage({ onBack }: UploadManagerPageProps) {
  const {
    jobs,
    isPolling,
    startPolling,
    stopPolling,
    clearCompletedJobs,
    clearFailedJobs,
    clearAllJobs,
    getActiveJobs,
    getFailedJobs,
    getJobsByStatus,
    addJob,
    retryJob,
    duplicateJob,
  } = useJobsStore();

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [errorModalJob, setErrorModalJob] = useState<UploadJob | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'failed' | 'logs'>('all');
  const [loading, setLoading] = useState(true);

  // Start polling on mount
  useEffect(() => {
    startPolling();
    
    // Simulate initial load
    const timer = setTimeout(() => setLoading(false), 800);
    
    return () => {
      stopPolling();
      clearTimeout(timer);
    };
  }, []);

  const activeJobs = getActiveJobs();
  const failedJobs = getFailedJobs();
  const completedJobs = getJobsByStatus('completed');

  const getFilteredJobs = () => {
    switch (activeTab) {
      case 'active':
        return activeJobs;
      case 'completed':
        return completedJobs;
      case 'failed':
        return failedJobs;
      default:
        return jobs;
    }
  };

  const filteredJobs = getFilteredJobs();

  const handleAddMockJob = () => {
    haptics.medium();
    
    const mockFileNames = [
      'Dune_Part_Three_Official_Trailer.mp4',
      'Gladiator_II_Final_Trailer.mp4',
      'Avatar_3_Teaser.mp4',
      'Wicked_Part_Two_Trailer.mp4',
      'Mission_Impossible_8_Trailer.mp4',
    ];

    const randomFileName = mockFileNames[Math.floor(Math.random() * mockFileNames.length)];
    const randomSize = Math.floor(Math.random() * 500000000) + 50000000; // 50MB - 500MB

    addJob({
      fileName: randomFileName,
      fileSize: randomSize,
      status: 'pending',
      stage: 'queued',
      progress: 0,
      metadata: {
        thumbnailAvailable: false,
      },
    });
  };

  const handleClearJobs = () => {
    haptics.medium();
    
    if (activeTab === 'completed') {
      if (confirm(`Clear all ${completedJobs.length} completed jobs?`)) {
        clearCompletedJobs();
      }
    } else if (activeTab === 'failed') {
      if (confirm(`Clear all ${failedJobs.length} failed jobs?`)) {
        clearFailedJobs();
      }
    } else {
      if (confirm(`Clear all ${jobs.length} jobs? This cannot be undone.`)) {
        clearAllJobs();
      }
    }
  };

  const handleViewDetails = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handleShowError = (job: UploadJob) => {
    setErrorModalJob(job);
  };

  const handleRetryError = () => {
    if (errorModalJob) {
      retryJob(errorModalJob.id);
    }
  };

  const handleDuplicateError = () => {
    if (errorModalJob) {
      duplicateJob(errorModalJob.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              haptics.light();
              onBack();
            }}
            className="text-gray-600 dark:text-[#9CA3AF] hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-gray-900 dark:text-white">Upload Manager</h1>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF] mt-1">
              Manage video uploads and processing pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Polling Status */}
          <Badge
            variant="outline"
            className={
              isPolling
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                : 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800'
            }
          >
            {isPolling ? 'Auto-polling active' : 'Polling paused'}
          </Badge>

          {/* Polling Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              haptics.medium();
              isPolling ? stopPolling() : startPolling();
            }}
            className="border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#111111]"
          >
            {isPolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          {/* Add Mock Job (for demo) */}
          <Button
            onClick={handleAddMockJob}
            variant="outline"
            size="sm"
            className="border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#111111]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Job (Demo)
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Total Jobs</p>
              <p className="text-2xl text-gray-900 dark:text-white mt-1">{jobs.length}</p>
            </div>
            <Upload className="w-8 h-8 text-gray-400 dark:text-[#666666]" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Active</p>
              <p className="text-2xl text-gray-900 dark:text-white mt-1">{activeJobs.length}</p>
            </div>
            <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-500" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Completed</p>
              <p className="text-2xl text-gray-900 dark:text-white mt-1">{completedJobs.length}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <span className="text-green-600 dark:text-green-500 text-lg">✓</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Failed</p>
              <p className="text-2xl text-gray-900 dark:text-white mt-1">{failedJobs.length}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <span className="text-red-600 dark:text-red-500 text-lg">✕</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-gray-100 dark:bg-[#111111]">
            <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#000000]">
              All ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#000000]">
              Active ({activeJobs.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#000000]">
              Completed ({completedJobs.length})
            </TabsTrigger>
            <TabsTrigger value="failed" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#000000]">
              Failed ({failedJobs.length})
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#000000]">
              System Logs
            </TabsTrigger>
          </TabsList>

          {activeTab !== 'logs' && filteredJobs.length > 0 && (
            <Button
              onClick={handleClearJobs}
              variant="outline"
              size="sm"
              className="border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#111111]"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear {activeTab === 'all' ? 'All' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Button>
          )}
        </div>

        {/* All Jobs */}
        <TabsContent value="all" className="mt-6">
          {jobs.length === 0 ? (
            <EmptyState type="no-jobs" onAction={handleAddMockJob} />
          ) : (
            <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg overflow-hidden">
              <JobTable
                jobs={filteredJobs}
                loading={loading}
                onViewDetails={handleViewDetails}
                onShowError={handleShowError}
              />
            </div>
          )}
        </TabsContent>

        {/* Active Jobs */}
        <TabsContent value="active" className="mt-6">
          {activeJobs.length === 0 ? (
            <EmptyState type="no-results" />
          ) : (
            <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg overflow-hidden">
              <JobTable
                jobs={filteredJobs}
                loading={loading}
                onViewDetails={handleViewDetails}
                onShowError={handleShowError}
              />
            </div>
          )}
        </TabsContent>

        {/* Completed Jobs */}
        <TabsContent value="completed" className="mt-6">
          {completedJobs.length === 0 ? (
            <EmptyState type="no-completed" />
          ) : (
            <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg overflow-hidden">
              <JobTable
                jobs={filteredJobs}
                loading={loading}
                onViewDetails={handleViewDetails}
                onShowError={handleShowError}
              />
            </div>
          )}
        </TabsContent>

        {/* Failed Jobs */}
        <TabsContent value="failed" className="mt-6">
          {failedJobs.length === 0 ? (
            <EmptyState type="no-failed" />
          ) : (
            <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg overflow-hidden">
              <JobTable
                jobs={filteredJobs}
                loading={loading}
                onViewDetails={handleViewDetails}
                onShowError={handleShowError}
              />
            </div>
          )}
        </TabsContent>

        {/* System Logs */}
        <TabsContent value="logs" className="mt-6">
          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-6">
            <SystemLogViewer />
          </div>
        </TabsContent>
      </Tabs>

      {/* Task Inspector */}
      {selectedJobId && (
        <TaskInspector
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
        />
      )}

      {/* Error Modal */}
      {errorModalJob && errorModalJob.error && (
        <ErrorModal
          isOpen={true}
          onClose={() => setErrorModalJob(null)}
          error={errorModalJob.error}
          jobId={errorModalJob.id}
          fileName={errorModalJob.fileName}
          onRetry={handleRetryError}
          onDuplicate={handleDuplicateError}
        />
      )}
    </div>
  );
}
