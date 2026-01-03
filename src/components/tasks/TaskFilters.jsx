import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const TaskFilters = ({ filters, setFilters }) => {
  const handleStatusChange = (value) => {
    setFilters({ ...filters, status: value === 'all' ? '' : value });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleReset = () => {
    setFilters({ status: '', search: '' });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6" data-testid="task-filters">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <Select
            value={filters.status || 'all'}
            onValueChange={handleStatusChange}
            data-testid="status-filter-select"
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="All Tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={handleSearchChange}
              data-testid="search-input"
              className="pl-10 h-11"
            />
          </div>
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={handleReset}
            data-testid="reset-filters-button"
            className="w-full md:w-auto border-slate-200 text-slate-700 hover:bg-slate-50 h-11"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
