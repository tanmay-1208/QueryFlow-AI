import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-[#131313] p-6 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Title bar */}
      <div className="h-5 bg-white/5 rounded-xl mb-6 w-3/4 animate-pulse" />

      {/* Cost and Market point */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
          <div className="h-2 bg-white/5 rounded w-1/2 mb-2 animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
        </div>
        <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
          <div className="h-2 bg-white/5 rounded w-1/2 mb-2 animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
        </div>
      </div>

      {/* Stock bar */}
      <div className="flex justify-between items-center bg-black/40 px-5 py-3 rounded-2xl mb-6 border border-white/5">
        <div className="h-3 bg-white/5 rounded w-1/4 animate-pulse" />
        <div className="h-6 bg-white/5 rounded w-1/6 animate-pulse" />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <div className="flex-1 h-10 bg-white/5 rounded-xl animate-pulse" />
        <div className="flex-1 h-10 bg-white/5 rounded-xl animate-pulse" />
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;