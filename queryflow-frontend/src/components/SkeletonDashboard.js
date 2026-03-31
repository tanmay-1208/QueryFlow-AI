import React from "react";

const SkeletonDashboard = () => {
  return (
    <div className="space-y-10">

      {/* TOP METRICS */}
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-panel p-8 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="absolute top-0 left-0 w-1 h-full bg-white/10" />
            <div className="h-2 bg-white/5 rounded w-1/2 mb-3 animate-pulse" />
            <div className="h-6 bg-white/5 rounded w-3/4 animate-pulse" />
          </div>
        ))}
      </div>

      {/* PERFORMANCE GRAPH */}
      <div className="glass-panel p-10 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="h-3 bg-white/5 rounded w-1/4 mb-8 animate-pulse" />
        <div className="grid grid-cols-2 gap-10">
          <div>
            <div className="h-2 bg-white/5 rounded w-1/3 mb-6 animate-pulse" />
            <div className="flex items-end gap-2 h-40">
              {[60, 40, 80, 30, 90, 50, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-white/5 rounded-t-sm animate-pulse"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="h-2 bg-white/5 rounded w-1/3 mb-6 animate-pulse" />
            <div className="space-y-4 flex flex-col justify-center h-40">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 bg-white/5 rounded w-16 animate-pulse" />
                  <div className="flex-1 bg-white/5 rounded-full h-2 animate-pulse" />
                  <div className="h-3 bg-white/5 rounded w-10 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM DATA */}
      <div className="grid grid-cols-2 gap-8">
        <div className="glass-panel p-10 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="h-2 bg-white/5 rounded w-1/3 mb-8 animate-pulse" />
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-3 bg-white/5 rounded w-1/3 animate-pulse" />
                <div className="flex-1 mx-4 border-b border-white/5 border-dashed" />
                <div className="h-3 bg-white/5 rounded w-1/6 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel p-10 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="h-2 bg-white/5 rounded w-1/3 mb-6 animate-pulse" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* SELL HISTORY */}
      <div className="glass-panel p-10 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="h-2 bg-white/5 rounded w-1/4 mb-8 animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <div className="h-3 bg-white/5 rounded w-32 mb-2 animate-pulse" />
                <div className="h-2 bg-white/5 rounded w-24 animate-pulse" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-3 bg-white/5 rounded w-16 animate-pulse" />
                <div className="h-8 bg-white/5 rounded-xl w-16 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SkeletonDashboard;