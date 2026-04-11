const fs = require('fs');
const file = '/Users/mac/Downloads/demo/queryflow-frontend/src/components/EditAssetModal.js';
let content = fs.readFileSync(file, 'utf8');

// Replace standard state. Note that if `priceGroups` exists, we need to extract from it if possible
content = content.replace(
  `const [amount, setAmount] = useState(asset?.price || '');`,
  `const [amount, setAmount] = useState(asset?.priceGroups?.RETAIL || asset?.price || '');
  const [dealerPrice, setDealerPrice] = useState(asset?.priceGroups?.DEALER || asset?.price || '');
  const [wholesalePrice, setWholesalePrice] = useState(asset?.priceGroups?.WHOLESALE || asset?.price || '');`
);

// We should update useEffect
content = content.replace(
  `setAmount(asset.price || '');`,
  `setAmount(asset.priceGroups?.RETAIL || asset.price || '');
      setDealerPrice(asset.priceGroups?.DEALER || asset.price || '');
      setWholesalePrice(asset.priceGroups?.WHOLESALE || asset.price || '');`
);

// Payload logic updates
content = content.replace(
  `          price: Number(amount) || 0,\n          cost_price: Number(costPrice) || 0,\n`,
  `          price: Number(amount) || 0,
          cost_price: Number(costPrice) || 0,
          priceGroups: {
            RETAIL: Number(amount) || 0,
            DEALER: Number(            DEALER:                    DEALER: Number(            DEALER:              ;


           DEALER: Number(            DEALER:                    DEALER: Number(        ace-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Buy Price</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-bold">$</span>
                </div>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-5 text-white placeholder-gray-600 focus:outline-none focus:border-[#4182ff]/50 focus:ring-1 focus:ring-[#4182ff]/50 transition-all font-medium"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Sell Price</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="text-gray-5                  <span className="text-gray-5                  <span className="text-gray-5    be                  <span className="text-gray-5                  <sp =                  <spva                  <sp   className="w-full bg-black/50 border border-white/10 rounded-xl px-                  <span className="text-gray-5                 s:border-[#4182ff]/50 focus:ring-1 focus:ring-[#4182ff]/50 transition-all font-medium"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>`;

const newInputs = `<div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase               <label className="text-x>
              <label className="text-xs font-bold text-gray-400 uppercase               <label className="text-x>ms              <label className="text-xs font-   <span className="text-gray-500 font-bold">$</span>
                </div>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#4182ff]/50 focus:ring-1 focus:ring-[#4182ff]/50 transition-all font-medium"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-[#4182ff] uppercase tracking-wider block">Retail Price</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-bold">$</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target                  onC                    onChange={(e]                   onChange={(e) =>-x                  onChange={(e) => setAmount(e.target           focus:border-[#4182ff]/50 focus:ring-1 focus:ring-[#4182ff]/50 transition-all font-medium"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-xs font-bold text-purple-400 uppercase tracking-wider block">Dealer Price</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-bold">$</span>
                </div>
                <input
                  type="number"
                  value={dealerPrice}
                  onChange={(e) => setDealerPrice(e.target.value)}
                  onChange={(e)fu                  onChange={(e)fu                  onChange={(e)fu                  onChange={(e)fu                  onChange={(e)fu                  onChange={(e)fu                  onChange={(e)fu                  onChange={eholder="0.00"
                  required
                />
                                                                          -y-4">
                                 ext-xs font-bold text-emerald-400 uppercase tracking-wider block">Wholesale Price</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-bold">$</span>
                </div>
                <input
                  type="number"
                  value={wholesalePrice}
                  onChange={(e                  onChange={(et.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>`;

contencontencontencontencooldInpucontencontenconte//contencontencontencontencooldInpucontencontenconte//contencontencontencontencoo grid-cols-2 gap-6 mb-8">`,
  `<div className="grid grid-cols-2 gap-6 mb-8">`
);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched Edit!");
