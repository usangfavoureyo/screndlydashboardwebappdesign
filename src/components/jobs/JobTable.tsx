import { useState } from 'react';
import { UploadJob } from '../../store/useJobsStore';
import { JobRow } from './JobRow';
import { JobTableSkeleton } from './JobTableSkeleton';
import { ScrollArea } from '../ui/scroll-area';

interface JobTableProps {
  jobs: UploadJob[];
  loading?: boolean;
  onViewDetails: (jobId: string) => void;
  onShowError: (job: UploadJob) => void;
}

export function JobTable({ jobs, loading, onViewDetails, onShowError }: JobTableProps) {
  if (loading) {
    return <JobTableSkeleton />;
  }

  return (
    <ScrollArea className="w-full">
      <div className="min-w-full">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-[#111111] border-b border-gray-200 dark:border-[#333333]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#6B7280] uppercase tracking-wider">
                File
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#6B7280] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#6B7280] uppercase tracking-wider">
                Stage
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#6B7280] uppercase tracking-wider">
                Progress
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#6B7280] uppercase tracking-wider">
                Metadata
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#6B7280] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#000000] divide-y divide-gray-200 dark:divide-[#333333]">
            {jobs.map(job => (
              <JobRow
                key={job.id}
                job={job}
                onViewDetails={onViewDetails}
                onShowError={onShowError}
              />
            ))}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
}
