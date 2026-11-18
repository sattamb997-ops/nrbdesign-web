import React, { useEffect } from 'react';
import { ArrowLeft, Check, Layers, Sparkles, ChevronRight } from 'lucide-react';
import { COLLECTIONS_DATA, CollectionImage, CollectionItem } from '../data/collectionsData';

interface SpaceDetailPageProps {
  collectionId: 'smart' | 'signature' | 'bespoke';
  spaceSlug: string;
  onBackToCollection: () => void;
  onBackToAllCollections: () => void;
  onSelectSpace: (slug: string) => void;
  onEnquire: (subject: string) => void;
}

export const SpaceDetailPage: React.FC<SpaceDetailPageProps> = ({
  collectionId,
  spaceSlug,
  onBackToCollection,
  onBackToAllCollections,
  onSelectSpace,
  onEnquire,
}) => {
  const collection: CollectionItem = COLLECTIONS_DATA[collectionId];
  const space: CollectionImage =
    collection.gallery.find((item) => item.slug === spaceSlug) || collection.gallery[0];

  const otherSpaces = collection.gallery.filter((item) => item.slug !== space.slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [collectionId, spaceSlug]);

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#3a3532] pt-6 pb-24 animate-fadeIn">
      {/* Top sticky navigation bar */}
      <div className="sticky top-0 z-40 bg-[#f7f5f2]/95 backdrop-blur-md border-b border-[#eae6df] px-6 md:px-12 py-4">
        <div className="max-w-[1300px] mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBackToCollection}
            className="flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest font-semibold text-[#3a3532] hover:text-[#b3957b] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to {collection.name}
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500">
            <button
              onClick={onBackToAllCollections}
              className="hover:text-[#b3957b] transition-colors cursor-pointer"
            >
              Living Concepts
            </button>
            <span>/</span>
            <button
              onClick={onBackToCollection}
              className="hover:text-[#b3957b] transition-colors cursor-pointer"
            >
              {collection.name}
            </button>
            <span>/</span>
            <span className="font-semibold text-[#b3957b] truncate max-w-[220px]">{space.title}</span>
          </div>

          <button
            onClick={() => onEnquire(`${collection.name} — ${space.title}`)}
            className="bg-[#3a3532] text-white hover:bg-[#b3957b] text-xs uppercase tracking-widest px-4 py-2 rounded-full transition-all duration-300 font-medium cursor-pointer shrink-0"
          >
            Enquire Now
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <section className="px-6 md:px-12 max-w-[1300px] mx-auto pt-10 md:pt-16 mb-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          <div className="flex-1">
            <div className="inline-flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs uppercase tracking-[0.22em] font-bold text-[#b3957b] bg-[#e3ddd5]/60 px-3 py-1 rounded-full">
                {collection.name}
              </span>
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                {space.category}
              </span>
            </div>

            <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl md:text-5xl text-[#1a1a1a] mb-5 leading-tight">
              {space.title}
            </h1>

            <p className="font-['Playfair_Display',serif] text-lg md:text-xl text-[#8c735d] italic mb-6">
              {space.description}
            </p>

            <div className="space-y-4 text-sm md:text-base text-gray-700 leading-relaxed mb-8">
              {space.fullDescription.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => onEnquire(`${collection.name} — ${space.title}`)}
                className="bg-[#3a3532] text-white hover:bg-[#b3957b] px-8 py-3.5 rounded-full text-xs md:text-sm uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
              >
                Discuss This Space
              </button>
              <a
                href="#space-gallery"
                className="border border-[#b3957b] text-[#3a3532] hover:bg-[#b3957b] hover:text-white px-7 py-3.5 rounded-full text-xs md:text-sm uppercase tracking-widest font-medium transition-all duration-300"
              >
                Explore Photos
              </a>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group">
              <img
                src={space.url}
                alt={space.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 md:p-8">
                <div className="text-white">
                  <span className="text-xs uppercase tracking-widest opacity-80 block mb-1">
                    {collection.name} · {space.category}
                  </span>
                  <h3 className="font-['Playfair_Display',serif] text-xl md:text-2xl font-medium">
                    {space.title}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Elements & Specifications */}
      <section className="px-6 md:px-12 max-w-[1300px] mx-auto mb-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Key Design Elements */}
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-stone-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f4f0eb] flex items-center justify-center text-[#b3957b]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="font-['Playfair_Display',serif] text-2xl md:text-3xl text-[#1a1a1a]">
                Design & Planning Highlights
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              Thoughtfully tailored elements included in our {collection.name} approach for this space:
            </p>
            <ul className="space-y-3.5 pt-2">
              {space.designElements.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                  <Check className="w-4 h-4 text-[#b3957b] shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div className="bg-[#242321] text-white p-8 md:p-10 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#c5a46d]">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="font-['Playfair_Display',serif] text-2xl md:text-3xl">
                  Material & Finish Specifications
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 mb-6">
                Built to NRB DESIGN's quality and durability benchmarks for Kolkata residences.
              </p>

              <div className="space-y-4">
                {space.specifications.map((spec, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                    <span className="text-[11px] uppercase tracking-widest text-[#c5a46d] font-semibold block mb-1">
                      {spec.label}
                    </span>
                    <p className="text-sm text-stone-200 font-light">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Photo Gallery */}
      <section id="space-gallery" className="px-6 md:px-12 max-w-[1300px] mx-auto mb-20 scroll-mt-24">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#b3957b] font-bold block mb-2">
            VISUAL GALLERY
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl text-[#1a1a1a]">
            {space.title} Inspiration
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
            Closer views illustrating layout composition, material finishes, and lighting harmony.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {space.galleryPhotos.map((photo, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-md group flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 md:p-6">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation Call to Action */}
      <section className="px-6 md:px-12 max-w-[1100px] mx-auto mb-20">
        <div className="bg-[#fbf9f6] border border-[#eae6df] p-8 md:p-14 rounded-3xl text-center shadow-lg">
          <span className="text-xs uppercase tracking-[0.25em] text-[#b3957b] font-bold block mb-3">
            PERSONALIZED CONSULTATION
          </span>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl text-[#1a1a1a] mb-4">
            Want this aesthetic for your home?
          </h2>
          <p className="text-sm md:text-base text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
            Share your floor plan and preferences with our designers to customize{' '}
            <strong className="text-[#1a1a1a]">{space.title}</strong> under the{' '}
            <strong className="text-[#1a1a1a]">{collection.name}</strong> collection.
          </p>
          <button
            onClick={() => onEnquire(`${collection.name} — ${space.title}`)}
            className="bg-[#3a3532] text-white hover:bg-[#b3957b] px-10 py-4 rounded-full text-xs md:text-sm uppercase tracking-widest font-semibold transition-all duration-300 shadow-xl hover:scale-105 cursor-pointer inline-flex items-center gap-3"
          >
            <span>Enquire About {space.title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Other Spaces in This Collection */}
      <section className="px-6 md:px-12 max-w-[1300px] mx-auto border-t border-[#eae6df] pt-16">
        <div className="text-center mb-8">
          <h3 className="text-xs uppercase tracking-[0.2em] text-stone-500 font-bold">
            More Spaces in {collection.name}
          </h3>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {otherSpaces.map((other) => (
            <div
              key={other.slug}
              onClick={() => onSelectSpace(other.slug)}
              className="bg-white rounded-xl overflow-hidden border border-stone-200/80 hover:border-[#b3957b] transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer group flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={other.url}
                  alt={other.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#b3957b] font-semibold block mb-1">
                    {other.category}
                  </span>
                  <h4 className="font-['Playfair_Display',serif] text-base text-[#1a1a1a] group-hover:text-[#b3957b] transition-colors font-medium">
                    {other.title}
                  </h4>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#f4f0eb] group-hover:bg-[#b3957b] group-hover:text-white flex items-center justify-center text-[#3a3532] transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
