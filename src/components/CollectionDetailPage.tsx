import React, { useEffect } from 'react';
import { ArrowLeft, Check, Sparkles, Compass, ShieldCheck, ChevronRight, MessageCircle } from 'lucide-react';
import { COLLECTIONS_DATA, CollectionItem } from '../data/collectionsData';

interface CollectionDetailPageProps {
  collectionId: 'smart' | 'signature' | 'bespoke';
  onBack: () => void;
  onSelectCollection: (id: 'smart' | 'signature' | 'bespoke') => void;
  onSelectSpace: (slug: string) => void;
  onEnquire: (collectionName: string) => void;
}

export const CollectionDetailPage: React.FC<CollectionDetailPageProps> = ({
  collectionId,
  onBack,
  onSelectCollection,
  onSelectSpace,
  onEnquire,
}) => {
  const collection: CollectionItem = COLLECTIONS_DATA[collectionId];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [collectionId]);

  const otherCollections = (['smart', 'signature', 'bespoke'] as const).filter(id => id !== collectionId);

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#3a3532] pt-6 pb-24 animate-fadeIn">
      {/* Top sticky navigation bar */}
      <div className="sticky top-0 z-40 bg-[#f7f5f2]/95 backdrop-blur-md border-b border-[#eae6df] px-6 md:px-12 py-4">
        <div className="max-w-[1300px] mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest font-semibold text-[#3a3532] hover:text-[#b3957b] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Living Concepts
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500">
            <span>Living Concepts</span>
            <span>/</span>
            <span className="font-semibold text-[#b3957b]">{collection.name}</span>
          </div>

          <button
            onClick={() => onEnquire(collection.name)}
            className="bg-[#3a3532] text-white hover:bg-[#b3957b] text-xs uppercase tracking-widest px-4 py-2 rounded-full transition-all duration-300 font-medium"
          >
            Enquire Now
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <section className="px-6 md:px-12 max-w-[1300px] mx-auto pt-10 md:pt-16 mb-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#b3957b] bg-[#e3ddd5]/60 px-3 py-1 rounded-full">
                COLLECTION {collection.number} / 03
              </span>
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                {collection.badge}
              </span>
            </div>

            <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl md:text-6xl text-[#1a1a1a] mb-4 leading-tight">
              {collection.name}
            </h1>
            <p className="font-['Playfair_Display',serif] text-xl md:text-2xl text-[#8c735d] italic mb-6">
              “{collection.tagline}”
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
              {collection.shortDesc}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => onEnquire(collection.name)}
                className="bg-[#3a3532] text-white hover:bg-[#b3957b] px-8 py-3.5 rounded-full text-xs md:text-sm uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
              >
                Enquire About {collection.name.replace('NRB ', '')}
              </button>
              <a
                href="#gallery"
                className="border border-[#b3957b] text-[#3a3532] hover:bg-[#b3957b] hover:text-white px-7 py-3.5 rounded-full text-xs md:text-sm uppercase tracking-widest font-medium transition-all duration-300"
              >
                View Project Gallery
              </a>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group">
              <img
                src={collection.heroImage}
                alt={collection.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 md:p-8">
                <div className="text-white">
                  <span className="text-xs uppercase tracking-widest opacity-80 block mb-1">Featured Environment</span>
                  <h3 className="font-['Playfair_Display',serif] text-xl md:text-2xl font-medium">
                    {collection.name} Signature Aesthetic
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Experience & Ideal For Section */}
      <section className="px-6 md:px-12 max-w-[1300px] mx-auto mb-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* The Experience */}
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f4f0eb] flex items-center justify-center text-[#b3957b]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="font-['Playfair_Display',serif] text-2xl md:text-3xl text-[#1a1a1a]">
                The {collection.name} Experience
              </h2>
            </div>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {collection.experience}
            </p>
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs uppercase tracking-widest font-bold text-stone-500 mb-3">
                Homeowners value this collection for:
              </h4>
              <ul className="space-y-2.5">
                {collection.homeownerValues.map((val, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#b3957b] shrink-0 mt-0.5" />
                    <span>{val}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What Defines This Collection */}
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f4f0eb] flex items-center justify-center text-[#b3957b]">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="font-['Playfair_Display',serif] text-2xl md:text-3xl text-[#1a1a1a]">
                What Defines This Collection?
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Every detail is engineered to align with our hallmark Kolkata turnkey execution standards.
            </p>
            <ul className="space-y-3">
              {collection.whatDefines.map((def, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-[#3a3532] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span>{def}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Key Specifications & Material Highlights */}
      <section className="px-6 md:px-12 max-w-[1300px] mx-auto mb-20">
        <div className="bg-[#242321] text-white p-8 md:p-12 rounded-2xl shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#c5a46d] font-bold block mb-2">
              TECHNICAL & MATERIAL SCOPE
            </span>
            <h2 className="font-['Playfair_Display',serif] text-2xl md:text-4xl">
              Specification Highlights for {collection.name}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.keyHighlights.map((highlight, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-xl backdrop-blur-sm">
                <span className="text-xs uppercase tracking-wider text-[#c5a46d] font-semibold block mb-1">
                  {highlight.label}
                </span>
                <p className="text-sm text-stone-300 font-light leading-relaxed">
                  {highlight.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Project Gallery */}
      <section id="gallery" className="px-6 md:px-12 max-w-[1300px] mx-auto mb-20 scroll-mt-24">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#b3957b] font-bold block mb-2">
            DESIGN REALIZATION
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl text-[#1a1a1a]">
            {collection.name} Visual Showcase
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
            Explore how the {collection.name} design philosophy translates across living rooms, modular kitchens, bedrooms and tailored spaces.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collection.gallery.map((img, idx) => (
            <div
              key={idx}
              onClick={() => onSelectSpace(img.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectSpace(img.slug);
                }
              }}
              className="bg-white rounded-xl overflow-hidden border border-stone-200/80 hover:border-[#b3957b] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer text-left"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#b3957b] font-semibold block mb-1">
                    {img.category}
                  </span>
                  <h3 className="font-['Playfair_Display',serif] text-base md:text-lg text-[#1a1a1a] group-hover:text-[#b3957b] transition-colors mb-1.5 font-medium">
                    {img.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {img.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-[#3a3532] group-hover:text-[#b3957b] transition-colors">
                  <span>Explore Space</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation Banner for this collection */}
      <section className="px-6 md:px-12 max-w-[1100px] mx-auto mb-20">
        <div className="bg-[#fbf9f6] border border-[#eae6df] p-8 md:p-14 rounded-3xl text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#b3957b]/10 rounded-full blur-3xl -z-10"></div>
          
          <span className="text-xs uppercase tracking-[0.25em] text-[#b3957b] font-bold block mb-3">
            NEXT STEP
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-5xl text-[#1a1a1a] mb-4">
            Let's discuss your home.
          </h2>
          <p className="text-sm md:text-base text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
            Share your requirements and our team will help you understand whether <strong className="text-[#1a1a1a]">{collection.name}</strong> is the right fit for your layout, lifestyle, and investment plan.
          </p>

          <button
            onClick={() => onEnquire(collection.name)}
            className="bg-[#3a3532] text-white hover:bg-[#b3957b] px-10 py-4 rounded-full text-xs md:text-sm uppercase tracking-widest font-semibold transition-all duration-300 shadow-xl hover:scale-105 cursor-pointer inline-flex items-center gap-3"
          >
            <span>Enquire About {collection.name}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Switcher to other collections */}
      <section className="px-6 md:px-12 max-w-[1300px] mx-auto border-t border-[#eae6df] pt-16">
        <div className="text-center mb-8">
          <h3 className="text-xs uppercase tracking-[0.2em] text-stone-500 font-bold">
            Explore Other Collections
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {otherCollections.map(id => {
            const other = COLLECTIONS_DATA[id];
            return (
              <div
                key={id}
                onClick={() => onSelectCollection(id)}
                className="bg-white p-6 rounded-xl border border-stone-200/80 hover:border-[#b3957b] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#b3957b] font-semibold block mb-1">
                    COLLECTION {other.number}
                  </span>
                  <h4 className="font-['Playfair_Display',serif] text-xl text-[#1a1a1a] group-hover:text-[#b3957b] transition-colors font-medium">
                    {other.name}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                    {other.tagline}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#f4f0eb] group-hover:bg-[#b3957b] group-hover:text-white flex items-center justify-center text-[#3a3532] transition-colors shrink-0 ml-4">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
