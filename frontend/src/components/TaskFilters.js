import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import { setFilters } from '../store/tasksSlice';

export const TaskFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.tasks);

  const handleStatusChange = (value) => {
    dispatch(setFilters({ status: value === 'ALL' ? '' : value }));
  };

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const clearFilters = () => {
    dispatch(setFilters({ status: '', search: '' }));
  };

  return (
    <div
      className="rounded-xl border bg-card p-6 space-y-4"
      data-testid="task-filters"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        {(filters.status || filters.search) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            data-testid="clear-filters-button"
          >
            <X size={16} className="mr-2" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status-filter" className="text-sm font-medium">
            Status
          </Label>
          <Select
            value={filters.status || 'ALL'}
            onValueChange={handleStatusChange}
            data-testid="status-filter-select"
          >
            <SelectTrigger id="status-filter" data-testid="status-filter-trigger">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" data-testid="status-option-all">All</SelectItem>
              <SelectItem value="OPEN" data-testid="status-option-open">Open</SelectItem>
              <SelectItem value="IN_PROGRESS" data-testid="status-option-in-progress">In Progress</SelectItem>
              <SelectItem value="DONE" data-testid="status-option-done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="search-filter" className="text-sm font-medium">
            Search
          </Label>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="search-filter"
              data-testid="search-filter-input"
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};