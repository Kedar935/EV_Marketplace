import React from 'react';

export const VehicleCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 animate-pulse">
    <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-2" />
    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4" />
    <div className="grid grid-cols-2 gap-2 mb-4">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded" />
    </div>
    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
  </div>
);

export const GridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <VehicleCardSkeleton key={i} />
    ))}
  </div>
);

export const DetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="w-full h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);
