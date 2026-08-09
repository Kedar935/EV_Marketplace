import React from 'react';

export const VehicleCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 animate-pulse">
    <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-lg mb-3" />
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-2" />
    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3" />
    <div className="grid grid-cols-2 gap-2 mb-3">
      <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded" />
    </div>
    <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
  </div>
);

export const GridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <VehicleCardSkeleton key={i} />
    ))}
  </div>
);

export const DetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="w-full h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);
