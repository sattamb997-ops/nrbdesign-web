import React from 'react';
import { ArrowRight, Check, Compass, ShieldCheck, Sparkles, SlidersHorizontal } from 'lucide-react';
import { COLLECTIONS_DATA, CollectionItem } from '../data/collectionsData';

interface DesignCollectionsProps {
  onSelectCollection: (id: 'smart' | 'signature' | 'bespoke') => void;
  onEnquireGeneral: () => void;
}

export const DesignCollections: React.FC<DesignCollectionsProps> = ({
  onSelectCollection,
  onEnquireGeneral,
}) => {
  const collectionsList: CollectionItem[] = [
    COLLECTIONS_DATA.smart,
    COLLECTIONS_DATA.signature,
    COLLECTIONS_DATA.bespoke,
  ];

  return (
    <section id="design-collections" className="py-20 md:py-28 px-4 md:px-12 max-w-[1350px] mx-auto scroll-mt-20">
      {/* 01 — Introduction */}
      <div className="text-center max-w-[900px] mx-auto mb-16 md:mb-20">
        <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] mb-4 leading-tight">
          The NRB Living Concepts
        </h2>
        <p className="font-['Playfair_Display',serif] text-lg sm:text-xl md:text-2xl text-[#8c735d] italic mb-6">
          Three Ways to Make Your Home, Truly Yours.
        </p>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6">
          Every homeowner has a different vision, lifestyle and way of living. That's why NRB DESIGN offers three thoughtfully developed living concepts—each designed to bring your idea of home to life in its own way.
        </p>
        <div className="inline-block py-2 px-5 bg-white border border-[#eae6df] rounded-full shadow-sm">
          <p className="text-[11px] sm:text-xs tracking-[0.18em] uppercase font-semibold text-[#8c735d]">
            THOUGHTFULLY PLANNED. PERSONALLY DESIGNED. PROFESSIONALLY EXECUTED.
          </p>
        </div>
      </div>

      {/* 02 — The Three Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 mb-20 md:mb-28">
        {collectionsList.map((col) => (
          <div
            key={col.id}
            className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col group hover:-translate-y-1.5"
          >
            {/* Visual Header Image */}
            <div className="relative aspect-[16/11] overflow-hidden bg-stone-100">
              <img
                src={col.heroImage}
                alt={col.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] uppercase tracking-widest font-medium">
                {col.number} — {col.name.replace('NRB ', '')}
              </div>
              <div
                className={
                  col.id === 'bespoke'
                    ? 'absolute bottom-4 left-4 right-4 bg-white border border-stone-200 px-4 py-2 rounded-md text-xs font-semibold tracking-wide text-[#1a1a1a] shadow-md antialiased'
                    : 'absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-semibold text-[#1a1a1a] shadow-sm line-clamp-1'
                }
              >
                {col.tagline}
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1a1a1a]">
                    {col.name}
                  </h3>
                  <span className="text-[11px] uppercase tracking-wider text-[#b3957b] font-semibold bg-[#fbf9f6] px-2.5 py-1 rounded">
                    {col.id === 'smart' ? 'Practical Living' : col.id === 'signature' ? 'Refined Living' : 'Individual Living'}
                  </span>
                </div>

                <p className="text-xs text-stone-500 font-medium uppercase tracking-wider mb-4">
                  {col.badge}
                </p>

                <p className="text-sm text-gray-700 leading-relaxed mb-5">
                  {col.shortDesc}
                </p>

                <div className="pt-4 border-t border-stone-100">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-bold block mb-1">
                    Ideal for:
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {col.idealFor}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectCollection(col.id)}
                className="w-full bg-[#fbf9f6] hover:bg-[#3a3532] text-[#1a1a1a] hover:text-white border border-[#eae6df] hover:border-[#3a3532] py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2 group-hover:bg-[#3a3532] group-hover:text-white cursor-pointer shadow-sm"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 03 — Comparison Section */}
      <div className="bg-[#fbf9f6] border border-[#eae6df] rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm mb-20">
        <div className="text-center max-w-[700px] mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#b3957b] font-bold block mb-2">
            DESIGN COMPARISON
          </span>
          <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl md:text-4xl text-[#1a1a1a] mb-3">
            Find the design approach that fits you.
          </h3>
          <p className="text-sm text-gray-600">
            Compare personalisation, space planning, material choices, and design scope across our three collections.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b-2 border-stone-300">
                <th className="py-4 px-4 text-xs uppercase tracking-wider font-bold text-stone-500 w-[25%]">
                  Design Consideration
                </th>
                <th className="py-4 px-4 text-sm font-['Playfair_Display',serif] font-bold text-[#1a1a1a] w-[25%] bg-stone-100/50 rounded-t-lg">
                  NRB SMART
                </th>
                <th className="py-4 px-4 text-sm font-['Playfair_Display',serif] font-bold text-[#8c735d] w-[25%] bg-[#b3957b]/10 rounded-t-lg">
                  NRB SIGNATURE
                </th>
                <th className="py-4 px-4 text-sm font-['Playfair_Display',serif] font-bold text-[#1a1a1a] w-[25%] bg-stone-200/50 rounded-t-lg">
                  NRB BESPOKE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-xs sm:text-sm">
              <tr>
                <td className="py-4 px-4 font-semibold text-[#1a1a1a]">Design approach</td>
                <td className="py-4 px-4 text-gray-700 bg-stone-100/30">Practical &amp; functional</td>
                <td className="py-4 px-4 text-gray-800 bg-[#b3957b]/5 font-medium">Refined &amp; personalised</td>
                <td className="py-4 px-4 text-gray-700 bg-stone-200/30">Highly customised</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-semibold text-[#1a1a1a]">Space planning</td>
                <td className="py-4 px-4 text-gray-700 bg-stone-100/30">Requirement-led</td>
                <td className="py-4 px-4 text-gray-800 bg-[#b3957b]/5 font-medium">More design-led</td>
                <td className="py-4 px-4 text-gray-700 bg-stone-200/30">Individually developed</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-semibold text-[#1a1a1a]">Material selection</td>
                <td className="py-4 px-4 text-gray-700 bg-stone-100/30">Value-conscious</td>
                <td className="py-4 px-4 text-gray-800 bg-[#b3957b]/5 font-medium">Refined selections</td>
                <td className="py-4 px-4 text-gray-700 bg-stone-200/30">Specially curated</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-semibold text-[#1a1a1a]">Detailing</td>
                <td className="py-4 px-4 text-gray-700 bg-stone-100/30">Essential detailing</td>
                <td className="py-4 px-4 text-gray-800 bg-[#b3957b]/5 font-medium">Enhanced detailing</td>
                <td className="py-4 px-4 text-gray-700 bg-stone-200/30">Custom detailing</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-semibold text-[#1a1a1a]">Design identity</td>
                <td className="py-4 px-4 text-gray-700 bg-stone-100/30">Clean &amp; functional</td>
                <td className="py-4 px-4 text-gray-800 bg-[#b3957b]/5 font-medium">Distinctive &amp; refined</td>
                <td className="py-4 px-4 text-gray-700 bg-stone-200/30">Unique to the homeowner</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Brand Promise Message */}
        <div className="mt-10 pt-8 border-t border-stone-200/80 text-center max-w-[800px] mx-auto space-y-3">
          <p className="font-['Playfair_Display',serif] text-base sm:text-lg md:text-xl text-[#8c735d] font-semibold italic">
            “Different design experiences. The same commitment to quality, care and trust.”
          </p>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Even if BESPOKE is positioned as the most premium collection, SMART customers receive the same uncompromising craftsmanship, transparency, and warranty standards. The differences lie in the level of customisation, finish selection, and detailing—never in our professional integrity.
          </p>
        </div>
      </div>

      {/* 04 — Final Consultation CTA */}
      <div className="text-center bg-[#242321] text-white p-8 md:p-14 rounded-3xl shadow-xl max-w-[1000px] mx-auto relative overflow-hidden">
        <div className="max-w-[700px] mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#c5a46d] font-bold block">
            GET STARTED
          </span>
          <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl md:text-4xl text-white">
            Let's Find the Right Design Experience for Your Home.
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Every home is personal. Speak with our lead interior designers to discuss your floor plan, design vision, and recommended collection.
          </p>
          <div className="pt-4">
            <button
              onClick={onEnquireGeneral}
              className="bg-[#c5a46d] hover:bg-[#b3957b] text-[#1a1a1a] font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:scale-105 cursor-pointer"
            >
              Discuss Your Project With Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
