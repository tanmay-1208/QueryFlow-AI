const SkeletonDashboard = () => (
  <div className="space-y-10 animate-pulse">

    {/* TOP METRICS */}
    <div className="grid grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-panel p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-white/5" />
          <div className="h-2 bg-white/5 rounded w-1/2 mb-4" />
          <div className="h-7 bg-white/5 rounded w-3/4" />
        </div>
      ))}
    </div>

    {/* GRAPH */}
    <div className="glass-panel p-6 md:p-10">
      <div className="h-3 bg-white/5 rounded w-1/4 mb-8" />
      <div className="grid grid-cols-2 gap-6 md:p-10">
        <div>
          <div className="h-2 bg-white/5 rounded w-1/3 mb-6" />
          <div className="flex items-end gap-2 h-40">
            {[60, 30, 80, 45, 90, 55, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-white/5 rounded-t-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="h-2 bg-white/5 rounded w-1/3 mb-6" />
          <div className="space-y-4 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-2 bg-white/5 rounded w-16 shrink-0" />
                <div className="flex-1 bg-white/5 rounded-full h-2" />
                <div className="h-2 bg-white/5 rounded w-10 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* BOTTOM DATA */}
    <div className="grid grid-cols-2 gap-8">
      <div className="glass-panel p-6 md:p-10">
        <div className="h-2 bg-white/5 rounded w-1/3 mb-8" />
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-3 bg-white/5 rounded w-1/3" />
              <div className="flex-1 mx-4 border-b border-white/5 border-dashed" />
              <div className="h-3 bg-white/5 rounded w-1/6" />
            </div>
          ))}
        </div>
      </div>
      <div className="glass-panel p-6 md:p-10 space-y-4">
        <div className="h-2 bg-white/5 rounded w-1/3 mb-6" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-3 bg-white/5 rounded w-full" />
        ))}
      </div>
    </div>

    {/* SELL HISTORY */}
    <div className="glass-panel p-6 md:p-10">
      <div className="h-2 bg-white/5 rounded w-1/4 mb-8" />
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <div className="h-3 bg-white/5 rounded w-32 mb-2" />
              <div className="h-2 bg-white/5 rounded w-24" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-4 bg-white/5 rounded w-16" />
              <div className="h-8 bg-white/5 rounded-xl w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
);

export default SkeletonDashboard;