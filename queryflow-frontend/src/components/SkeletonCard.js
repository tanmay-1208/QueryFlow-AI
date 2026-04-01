const SkeletonCard = () => (
  <div className="bg-[#131313] p-6 rounded-[2.5rem] border border-white/5 shadow-xl animate-pulse">
    <div className="flex justify-between items-start mb-6 pr-16">
      <div className="w-full">
        <div className="h-5 bg-white/5 rounded-xl w-3/4 mb-3" />
        <div className="h-3 bg-white/5 rounded-xl w-1/3" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
        <div className="h-2 bg-white/5 rounded w-1/2 mb-2" />
        <div className="h-4 bg-white/5 rounded w-2/3" />
      </div>
      <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
        <div className="h-2 bg-white/5 rounded w-1/2 mb-2" />
        <div className="h-4 bg-white/5 rounded w-2/3" />
      </div>
    </div>
    <div className="flex justify-between items-center bg-black/40 px-5 py-3 rounded-2xl mb-6 border border-white/5">
      <div className="h-3 bg-white/5 rounded w-1/4" />
      <div className="h-6 bg-white/5 rounded w-1/6" />
    </div>
    <div className="flex gap-3">
      <div className="flex-1 h-10 bg-white/5 rounded-xl" />
      <div className="flex-1 h-10 bg-white/5 rounded-xl" />
    </div>
  </div>
);

export default SkeletonCard;