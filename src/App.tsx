/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Hexagon, MessageCircle, MapPin, Phone, CheckCircle2, Star, Instagram, BrickWall, Layers, Hammer, Armchair, LampCeiling, Feather, Menu, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, serverTimestamp } from './firebase';
import { DesignCollections } from './components/DesignCollections';
import { CollectionDetailPage } from './components/CollectionDetailPage';
import { SpaceDetailPage } from './components/SpaceDetailPage';
import { ShowcaseGalleryPage } from './components/ShowcaseGalleryPage';
import { SpaceShowcaseCarousel } from './components/SpaceShowcaseCarousel';
import { BudgetCalculator } from './components/BudgetCalculator';
import { ScrollIntroHero } from './components/ScrollIntroHero';
import { ShowcaseCategorySlug, getShowcaseGalleryBySlug } from './data/showcaseGalleries';
import ownerImage from '../Soham.png';
import coFounderImage from '../Sattam.jpeg';
import logoImage from '../logo.jpeg';
import p1Image from '../P1.png';
import p2Image from '../P2.png';
import p3Image from '../P3.png';
import p4Image from '../P4.png';
import p5Image from '../P5.png';
import p6Image from '../P6.jpeg';



const brands = [
  { name: "EVARA", className: "font-serif tracking-widest font-bold uppercase text-3xl" },
  { name: "KOHLER", className: "font-sans font-black tracking-widest uppercase text-3xl" },
  { name: "ebco", className: "font-sans font-bold lowercase tracking-wide italic text-4xl" },
  { name: "Greenply", className: "font-serif italic font-bold text-3xl" },
  { name: "Hettich", className: "font-sans font-bold text-3xl" },
  { name: "HAVELLS", className: "font-sans font-black uppercase tracking-wider text-3xl" },
  { name: "asianpaints", className: "font-sans font-semibold lowercase tracking-tight text-3xl" },
  { name: "PHILIPS", className: "font-sans font-black uppercase tracking-widest text-3xl" },
  { name: "Jaquar", className: "font-sans font-semibold tracking-wide uppercase text-3xl" },
  { name: "Kajaria", className: "font-serif font-black uppercase text-3xl" },
  { name: "CenturyPly", className: "font-sans font-bold tracking-tight text-3xl" },
  { name: "Hafele", className: "font-sans font-black tracking-widest uppercase text-3xl" },
  { name: "Saint-Gobain", className: "font-sans font-bold tracking-wider uppercase text-3xl" },
  { name: "Cera", className: "font-sans font-black uppercase italic text-4xl" },
];

export default function App() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [scrolledHeader, setScrolledHeader] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const parseCollectionHash = (hash: string): { collection: 'smart' | 'signature' | 'bespoke' | null; space: string | null } => {
    const match = hash.match(/^#collection-(smart|signature|bespoke)(?:\/(.+))?$/);
    if (match) {
      return {
        collection: match[1] as 'smart' | 'signature' | 'bespoke',
        space: match[2] || null,
      };
    }
    return { collection: null, space: null };
  };

  const parseGalleryHash = (hash: string): ShowcaseCategorySlug | null => {
    const match = hash.match(/^#gallery\/([a-z0-9-]+)$/);
    if (match && getShowcaseGalleryBySlug(match[1])) {
      return match[1] as ShowcaseCategorySlug;
    }
    return null;
  };

  const [selectedCollection, setSelectedCollection] = useState<'smart' | 'signature' | 'bespoke' | null>(() => {
    if (typeof window !== 'undefined') {
      return parseCollectionHash(window.location.hash).collection;
    }
    return null;
  });

  const [selectedSpaceSlug, setSelectedSpaceSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return parseCollectionHash(window.location.hash).space;
    }
    return null;
  });

  const [selectedGallerySlug, setSelectedGallerySlug] = useState<ShowcaseCategorySlug | null>(() => {
    if (typeof window !== 'undefined') {
      return parseGalleryHash(window.location.hash);
    }
    return null;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const parsedGallery = parseGalleryHash(hash);
      if (parsedGallery) {
        setSelectedGallerySlug(parsedGallery);
        setSelectedCollection(null);
        setSelectedSpaceSlug(null);
        return;
      }

      const parsed = parseCollectionHash(hash);
      if (parsed.collection) {
        setSelectedGallerySlug(null);
        setSelectedCollection(parsed.collection);
        setSelectedSpaceSlug(parsed.space);
      } else {
        setSelectedGallerySlug(null);
        if (hash === '#design-collections' || !hash.startsWith('#collection-')) {
          setSelectedCollection(null);
          setSelectedSpaceSlug(null);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const heroEl = document.getElementById('home');
      if (heroEl) {
        setScrolledHeader(window.scrollY > heroEl.offsetHeight - window.innerHeight * 0.9);
      } else {
        setScrolledHeader(window.scrollY > 80);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSelectShowcaseGallery = (slug: ShowcaseCategorySlug) => {
    setSelectedCollection(null);
    setSelectedSpaceSlug(null);
    setSelectedGallerySlug(slug);
    window.location.hash = `gallery/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromGallery = () => {
    setSelectedGallerySlug(null);
    window.location.hash = 'space-showcase';
    setTimeout(() => {
      const target = document.getElementById('space-showcase');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const handleEnquireFromGallery = (spaceTitle: string) => {
    setSelectedGallerySlug(null);
    setFormData((prev) => ({
      ...prev,
      message: `Hello NRB DESIGN, I would like to enquire about a custom ${spaceTitle} design for my home.`,
    }));
    window.location.hash = 'consultation';
    setTimeout(() => {
      const target = document.getElementById('consultation');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSelectCollection = (id: 'smart' | 'signature' | 'bespoke') => {
    setSelectedGallerySlug(null);
    setSelectedCollection(id);
    setSelectedSpaceSlug(null);
    window.location.hash = `collection-${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSpace = (slug: string) => {
    if (!selectedCollection) return;
    setSelectedSpaceSlug(slug);
    window.location.hash = `collection-${selectedCollection}/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCollection = () => {
    if (!selectedCollection) return;
    setSelectedSpaceSlug(null);
    window.location.hash = `collection-${selectedCollection}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromCollection = () => {
    setSelectedCollection(null);
    setSelectedSpaceSlug(null);
    window.location.hash = 'design-collections';
    setTimeout(() => {
      const target = document.getElementById('design-collections');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleEnquireCollection = (collectionName: string) => {
    setSelectedGallerySlug(null);
    setSelectedCollection(null);
    setSelectedSpaceSlug(null);
    setFormData(prev => ({
      ...prev,
      message: `Hello NRB DESIGN, I would like to enquire about ${collectionName} for my home in Kolkata.`
    }));
    window.location.hash = 'consultation';
    setTimeout(() => {
      const target = document.getElementById('consultation');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
    };
    if (!trimmed.name || !trimmed.email || !trimmed.phone || !trimmed.message) {
      setSubmitError('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await addDoc(collection(db, 'consultations'), {
        ...trimmed,
        createdAt: serverTimestamp(),
      });
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Error adding document: ', err);
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTargetId = (targetId: string) => {
    setMobileMenuOpen(false);
    if (selectedCollection || selectedSpaceSlug) {
      setSelectedCollection(null);
      setSelectedSpaceSlug(null);
    }
    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 950;
      let start: number | null = null;

      const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t * t + b;
        t -= 2;
        return (c / 2) * (t * t * t + 2) + b;
      };

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          window.scrollTo(0, targetPosition);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    scrollToTargetId(href.substring(1));
  };

  const activeGallery = getShowcaseGalleryBySlug(selectedGallerySlug);

  if (activeGallery) {
    return (
      <ShowcaseGalleryPage
        category={activeGallery}
        onBackHome={handleBackFromGallery}
        onSelectCategory={handleSelectShowcaseGallery}
        onBookConsultation={handleEnquireFromGallery}
      />
    );
  }

  if (selectedCollection && selectedSpaceSlug) {
    return (
      <SpaceDetailPage
        collectionId={selectedCollection}
        spaceSlug={selectedSpaceSlug}
        onBackToCollection={handleBackToCollection}
        onBackToAllCollections={handleBackFromCollection}
        onSelectSpace={handleSelectSpace}
        onEnquire={handleEnquireCollection}
      />
    );
  }

  if (selectedCollection) {
    return (
      <CollectionDetailPage
        collectionId={selectedCollection}
        onBack={handleBackFromCollection}
        onSelectCollection={handleSelectCollection}
        onSelectSpace={handleSelectSpace}
        onEnquire={handleEnquireCollection}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#3a3532] font-['Lato',sans-serif] font-light relative">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolledHeader
            ? 'bg-[#1a1817]/92 backdrop-blur-md border-b border-white/10 shadow-md'
            : 'bg-gradient-to-b from-black/55 via-black/20 to-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-14 h-16 md:h-20 flex items-center justify-between gap-4 text-white">
          <a
            href="#home"
            onClick={handleSmoothScroll}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white p-0.5 overflow-hidden shadow-md border border-white/20 shrink-0">
              <img src={logoImage} alt="NRB DESIGN Logo" className="w-full h-full object-contain scale-[1.16]" />
            </div>
            <span className="font-['Playfair_Display',serif] text-base md:text-lg tracking-[0.18em] text-[#ebd59d] font-medium whitespace-nowrap">
              NRB DESIGN
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-[11px] tracking-[0.16em] uppercase font-normal">
            <a href="#home" onClick={handleSmoothScroll} className="hover:text-[#ebd59d] transition-colors whitespace-nowrap">Home</a>
            <a href="#about-us" onClick={handleSmoothScroll} className="hover:text-[#ebd59d] transition-colors whitespace-nowrap">About Us</a>
            <a href="#portfolio" onClick={handleSmoothScroll} className="hover:text-[#ebd59d] transition-colors whitespace-nowrap">Portfolio</a>
            <a href="#design-collections" onClick={handleSmoothScroll} className="hover:text-[#ebd59d] transition-colors font-medium whitespace-nowrap">Living Concepts</a>
            <a href="#budget-calculator" onClick={handleSmoothScroll} className="hover:text-[#ebd59d] transition-colors whitespace-nowrap">Budget Calculator</a>
            <a href="#services" onClick={handleSmoothScroll} className="hover:text-[#ebd59d] transition-colors whitespace-nowrap">Services</a>
            <a href="#location" onClick={handleSmoothScroll} className="hover:text-[#ebd59d] transition-colors whitespace-nowrap">Location</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#consultation"
              onClick={handleSmoothScroll}
              className="hidden sm:inline-flex items-center justify-center bg-[#b3957b] hover:bg-[#c5a46d] text-[#1a1817] font-bold text-[11px] uppercase tracking-[0.14em] px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Book a Consultation
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#1a1817]/95 backdrop-blur-md border-t border-white/10 px-6 py-5 space-y-3 text-white">
            <div className="grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.14em]">
              <a href="#home" onClick={handleSmoothScroll} className="py-2 hover:text-[#ebd59d]">Home</a>
              <a href="#about-us" onClick={handleSmoothScroll} className="py-2 hover:text-[#ebd59d]">About Us</a>
              <a href="#portfolio" onClick={handleSmoothScroll} className="py-2 hover:text-[#ebd59d]">Portfolio</a>
              <a href="#design-collections" onClick={handleSmoothScroll} className="py-2 hover:text-[#ebd59d]">Living Concepts</a>
              <a href="#budget-calculator" onClick={handleSmoothScroll} className="py-2 hover:text-[#ebd59d]">Budget Calculator</a>
              <a href="#services" onClick={handleSmoothScroll} className="py-2 hover:text-[#ebd59d]">Services</a>
              <a href="#location" onClick={handleSmoothScroll} className="py-2 hover:text-[#ebd59d]">Location</a>
              <a href="#consultation" onClick={handleSmoothScroll} className="py-2 text-[#ebd59d] font-semibold">Consultation</a>
            </div>
          </div>
        )}
      </header>

      {/* 1. Scroll-Driven Architectural Intro Hero */}
      <ScrollIntroHero
        onBookConsultation={() => scrollToTargetId('consultation')}
        onExploreCalculator={() => scrollToTargetId('budget-calculator')}
      />

      {/* About Us Section */}
      <section id="about-us" className="px-4 md:px-12 max-w-[1000px] mx-auto pt-16 md:pt-24 mb-16 md:mb-24">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl text-[#3a3532]">About Us</h2>
          <p className="font-['Playfair_Display',serif] text-base sm:text-lg md:text-xl text-[#8c735d] tracking-widest uppercase font-semibold mt-3 max-w-2xl mx-auto">
            THOUGHTFULLY DESIGNED SPACES. BEAUTIFULLY EXECUTED HOMES.
          </p>
        </div>

        <div className="space-y-5 text-sm md:text-base text-gray-700 leading-relaxed text-justify">
          <p>
            NRB DESIGN is an Interior design &amp; turnkey execution company in Kolkata, West Bengal. Dedicated to transforming houses &amp; apartments into functional , comfortable &amp; beautifully designed living spaces.
          </p>
          <p>
            We Believe that a home should reflect the people who live in it- their lifestyle, personality , aspirations &amp; everyday needs. Our approach combines thoughtful space planning, aesthetic design, practical material selection &amp; coordinated execution to help homeowners create spaces that feel personal, purposeful and lasting.
          </p>
          <p>
            From complete home interiors &amp; modular kitchens to wardrobes, false ceilings, lighting, custom furniture &amp; home renovation , NRB DESIGN aims to make the interior design journey more organized , transparent &amp; convenient.
          </p>

          <div className="my-8 py-6 px-6 md:px-8 bg-white/80 rounded-xl border border-stone-200/80 shadow-sm text-center space-y-4">
            <p className="text-xs sm:text-sm md:text-base tracking-[0.12em] uppercase font-semibold text-[#3a3532]">
              OUR PHILOSOPHY IS SIMPLE: YOUR HOME, YOUR LIFESTYLE, YOUR DESIGN WITH A TEAM THAT WORKS ALONGSIDE YOU AT EVERY STEP.
            </p>
            <div className="w-16 h-px bg-[#b3957b] mx-auto"></div>
            <p className="font-['Playfair_Display',serif] text-sm sm:text-base md:text-lg text-[#8c735d] tracking-wide uppercase italic">
              LUXURY IS NOT ABOUT ADDING MORE . IT IS ABOUT CHOOSING BETTER .
            </p>
            <p className="text-xs sm:text-sm tracking-[0.2em] uppercase font-bold text-[#1a1a1a]">
              DESIGNED AROUND YOU , DEFINED BY STANDARDS
            </p>
          </div>
        </div>
      </section>


      {/* 2. Portfolio Section */}
      <section id="portfolio" className="px-4 md:px-12 max-w-[1400px] mx-auto mb-16 md:mb-24">
        <div className="text-center mb-10">
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl text-[#3a3532]">Portfolio</h2>
          <p className="text-sm mt-3 text-gray-600 max-w-xl mx-auto">A selection of our recent interior projects, blending modern aesthetics with timeless comfort.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          <img src={p1Image} alt="Interior 1" className="w-full h-[200px] md:h-[300px] lg:h-[400px] object-cover hover:opacity-90 transition-opacity" />
          <img src={p2Image} alt="Interior 2" className="w-full h-[200px] md:h-[300px] lg:h-[400px] object-cover hover:opacity-90 transition-opacity" />
          <img src={p3Image} alt="Interior 3" className="w-full h-[200px] md:h-[300px] lg:h-[400px] object-cover hover:opacity-90 transition-opacity" />
          <img src={p4Image} alt="Interior 4" className="w-full h-[200px] md:h-[300px] lg:h-[400px] object-cover hover:opacity-90 transition-opacity" />
          <img src={p5Image} alt="Interior 5" className="w-full h-[200px] md:h-[300px] lg:h-[400px] object-cover hover:opacity-90 transition-opacity" />
          <img src={p6Image} alt="Interior 6" className="w-full h-[200px] md:h-[300px] lg:h-[400px] object-cover hover:opacity-90 transition-opacity" />
        </div>
      </section>

      {/* 2.5 3D Curved Radial Spotlight Spaces Showcase */}
      <SpaceShowcaseCarousel onSelectCategory={handleSelectShowcaseGallery} />

      {/* Refined Living & Thoughtful Design Section */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-[#fbf9f6] border-y border-[#eae6df]">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1a1a1a] mb-10 md:mb-14 leading-tight tracking-wide">
            NRB DESIGN — WHERE REFINED LIVING MEETS THOUGHTFUL DESIGN.
          </h2>

          <div className="space-y-6 text-sm md:text-base text-gray-700 leading-relaxed text-center md:text-justify max-w-[820px] mx-auto">
            <p>
              At NRB DESIGN we believe a home should be more than beautiful. It should reflect the people who live in it and their aspirations, their individuality, their standards &amp; their way of life .
            </p>
            <p>
              We are an Interior design &amp; Turnkey Execution Brand in India, creating thoughtfully designed residential spaces for home owners who appreciate refined aesthetics, considered functionality, quality materials &amp; attention to detail.
            </p>
          </div>

          {/* Philosophy Card */}
          <div className="mt-12 mb-10 py-8 px-6 md:px-10 bg-white/90 rounded-2xl border border-stone-200/80 shadow-md max-w-[820px] mx-auto space-y-4">
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#8c735d] font-bold">
              OUR PHILOSOPHY
            </span>
            <div className="w-12 h-px bg-[#b3957b] mx-auto"></div>
            <h3 className="font-['Playfair_Display',serif] text-xl sm:text-2xl md:text-3xl text-[#1a1a1a] font-medium tracking-wide italic">
              LUXURY IS NOT ABOUT ADDING MORE. IT IS ABOUT CHOOSING BETTER.
            </h3>
          </div>

          <div className="max-w-[820px] mx-auto text-sm md:text-base text-gray-700 leading-relaxed text-center md:text-justify mb-10">
            <p>
              From the first design conversations to the final handover, we approach every project with a commitment to purposeful design, material clarity, meticulous co-ordination considered execution. Every layout, finish, texture &amp; detail should have a reason to be there &amp; every decision should contribute to a home that feels distinctly yours.
            </p>
          </div>

          <div className="pt-2">
            <p className="font-['Playfair_Display',serif] text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase font-bold text-[#1a1a1a]">
              (DESIGNED AROUND YOU. DEFINED BY) STANDARDS
            </p>
          </div>
        </div>
      </section>

      {/* 3.5 All Under One Roof */}
      <section id="services" className="py-16 md:py-24 px-6 md:px-12 bg-[#eeebe8]">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="font-sans font-normal text-3xl md:text-4xl text-[#1a1a1a] mb-16">All Under One Roof</h2>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
            <div className="flex flex-col items-center group cursor-pointer">
              <Feather className="w-10 h-10 md:w-12 md:h-12 text-gray-800 mb-4 stroke-1 group-hover:scale-110 group-hover:text-[#b3957b] transition-all duration-300" />
              <p className="text-[#1a1a1a] font-medium text-sm md:text-base group-hover:text-[#b3957b] transition-colors">Design</p>
            </div>
            <div className="flex flex-col items-center group cursor-pointer">
              <BrickWall className="w-10 h-10 md:w-12 md:h-12 text-gray-800 mb-4 stroke-1 group-hover:scale-110 group-hover:text-[#b3957b] transition-all duration-300" />
              <p className="text-[#1a1a1a] font-medium text-sm md:text-base group-hover:text-[#b3957b] transition-colors">Civil Work</p>
            </div>
            <div className="flex flex-col items-center group cursor-pointer">
              <Layers className="w-10 h-10 md:w-12 md:h-12 text-gray-800 mb-4 stroke-1 group-hover:scale-110 group-hover:text-[#b3957b] transition-all duration-300" />
              <p className="text-[#1a1a1a] font-medium text-sm md:text-base group-hover:text-[#b3957b] transition-colors">Modular</p>
            </div>
            <div className="flex flex-col items-center group cursor-pointer">
              <Hammer className="w-10 h-10 md:w-12 md:h-12 text-gray-800 mb-4 stroke-1 group-hover:scale-110 group-hover:text-[#b3957b] transition-all duration-300" />
              <p className="text-[#1a1a1a] font-medium text-sm md:text-base group-hover:text-[#b3957b] transition-colors">Carpentry</p>
            </div>
            <div className="flex flex-col items-center group cursor-pointer">
              <Armchair className="w-10 h-10 md:w-12 md:h-12 text-gray-800 mb-4 stroke-1 group-hover:scale-110 group-hover:text-[#b3957b] transition-all duration-300" />
              <p className="text-[#1a1a1a] font-medium text-sm md:text-base group-hover:text-[#b3957b] transition-colors">Furnishing</p>
            </div>
            <div className="flex flex-col items-center group cursor-pointer">
              <LampCeiling className="w-10 h-10 md:w-12 md:h-12 text-gray-800 mb-4 stroke-1 group-hover:scale-110 group-hover:text-[#b3957b] transition-all duration-300" />
              <p className="text-[#1a1a1a] font-medium text-sm md:text-base group-hover:text-[#b3957b] transition-colors">Lighting</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The NRB Design Collections Section */}
      <DesignCollections
        onSelectCollection={handleSelectCollection}
        onEnquireGeneral={() => {
          const target = document.getElementById('consultation');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* 4.2 Interactive Budget Calculator Section */}
      <BudgetCalculator
        onBookWithEstimate={(summaryText, contact) => {
          setSubmitSuccess(false);
          setSubmitError('');
          setFormData((prev) => ({
            ...prev,
            name: contact?.name?.trim() || prev.name,
            phone: contact?.phone?.trim() || prev.phone,
            email: contact?.email?.trim() || prev.email,
            message: summaryText,
          }));
          const target = document.getElementById('consultation');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* 4.5 Global Brands Section */}
      <section className="py-20 md:py-28 overflow-hidden border-y border-[#eae6df] bg-[#fbf9f6]">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-sans font-normal text-3xl md:text-4xl text-[#1a1a1a]">Our Preferred Global Brands</h2>
        </div>
        
        <div className="flex w-max animate-scroll group-hover:pause group items-center">
          <div className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24">
            {brands.map((brand, idx) => (
              <div key={`brand-first-${idx}`} className={`shrink-0 text-gray-800 ${brand.className} hover:text-[#b3957b] transition-colors duration-300 cursor-default`}>
                {brand.name}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-16 md:gap-24 pr-16 md:pr-24">
            {brands.map((brand, idx) => (
              <div key={`brand-second-${idx}`} className={`shrink-0 text-gray-800 ${brand.className} hover:text-[#b3957b] transition-colors duration-300 cursor-default`}>
                {brand.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#fbf9f6]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl text-[#3a3532]">Client Words</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 shadow-sm border border-[#eae6df] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex gap-1 mb-4 text-[#b3957b]">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm text-gray-600 mb-6 italic">"NRB DESIGN completely transformed our living room. Soham has an incredible eye for detail and understood exactly what we wanted before we even did."</p>
              <p className="text-xs font-bold uppercase tracking-wider">- Gourab C.</p>
            </div>
            <div className="bg-white p-8 shadow-sm border border-[#eae6df] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex gap-1 mb-4 text-[#b3957b]">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm text-gray-600 mb-6 italic">"Professional, punctual, and highly creative. The entire process from consultation to execution was seamless."</p>
              <p className="text-xs font-bold uppercase tracking-wider">- Kaberi D.</p>
            </div>
            <div className="bg-white p-8 shadow-sm border border-[#eae6df] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex gap-1 mb-4 text-[#b3957b]">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm text-gray-600 mb-6 italic">"Soham managed to make our small apartment feel incredibly spacious and luxurious. Highly recommend NRB DESIGN!"</p>
              <p className="text-xs font-bold uppercase tracking-wider">- S T Sarkar</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Founders Section */}
      <section className="bg-[#b3957b] text-[#f7f5f2] py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-[1060px] mx-auto space-y-16 md:space-y-20">
          <div className="text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.26em] text-[#f7f5f2]/80 font-bold">
              Leadership
            </p>
            <h2 className="font-['Playfair_Display',serif] text-3xl md:text-5xl">
              Meet the Founders
            </h2>
          </div>

          {/* Founder — Soham Bhattacharyya */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="flex justify-center md:justify-end">
              <div className="w-[280px] h-[360px] md:w-[320px] md:h-[420px] overflow-hidden rounded-sm shadow-lg hover:shadow-2xl transition-shadow duration-500 group">
                <img
                  src={ownerImage}
                  alt="Soham Bhattacharyya - Founder, NRB DESIGN"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="max-w-md mx-auto md:mx-0 text-center md:text-left">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#f7f5f2]/80 font-bold mb-2">
                Founder · Design &amp; Execution
              </p>
              <h3 className="text-2xl md:text-3xl font-['Playfair_Display',serif] mb-4">
                Soham Bhattacharyya
              </h3>
              <p className="text-xs md:text-sm opacity-90 mb-4 leading-relaxed">
                With a passion for creating spaces that resonate with the people who inhabit them, Soham Bhattacharyya founded NRB DESIGN to bring thoughtful, curated interior design to Kolkata and beyond.
              </p>
              <p className="text-xs md:text-sm opacity-90 leading-relaxed">
                Believing that good design is a balance of aesthetics and functionality, Soham works closely with clients to transform their visions into beautiful, livable realities.
              </p>
            </div>
          </div>

          <div className="border-t border-white/20" />

          {/* Co-Founder — Sattam Bhattacharyya */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 md:order-1 max-w-md mx-auto md:ml-auto md:mr-0 text-center md:text-right">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#f7f5f2]/80 font-bold mb-2">
                Co-Founder · Strategy &amp; Systems
              </p>
              <h3 className="text-2xl md:text-3xl font-['Playfair_Display',serif] mb-4">
                Sattam Bhattacharyya
              </h3>
              <p className="text-xs md:text-sm opacity-90 mb-4 leading-relaxed">
                A B.Tech graduate in Artificial Intelligence &amp; Machine Learning (AIML), Sattam Bhattacharyya worked with Infosys while shaping the foundational idea behind NRB DESIGN — bringing structured engineering thinking and operational clarity to home interiors.
              </p>
              <p className="text-xs md:text-sm opacity-90 leading-relaxed">
                Bridging analytical precision with modern homeowner needs, Sattam drives NRB DESIGN&apos;s digital planning experience, transparent estimation workflows, and process discipline so every project moves seamlessly from concept to handover.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center md:justify-start">
              <div className="w-[280px] h-[360px] md:w-[320px] md:h-[420px] overflow-hidden rounded-sm shadow-lg hover:shadow-2xl transition-shadow duration-500 group bg-[#a4866c]">
                <img
                  src={coFounderImage}
                  alt="Sattam Bhattacharyya - Co-Founder, NRB DESIGN"
                  className="w-full h-full object-cover object-[50%_24%] scale-[1.28] origin-[50%_30%] group-hover:scale-[1.33] transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6.5 Location Section */}
      <section id="location" className="pt-16 md:pt-24 bg-[#eeebe8]">
        <div className="max-w-[1200px] mx-auto text-center px-6 md:px-12 mb-12">
           <h2 className="font-['Lato',sans-serif] text-xl md:text-3xl lg:text-4xl text-[#1a1a1a] leading-snug font-normal">
             23, Kalidas Patitundi Ln, Kalighat, Kolkata, West Bengal 700026, India
           </h2>
        </div>
        <div className="w-full h-[50vh] min-h-[450px] relative grayscale hover:grayscale-0 transition-all duration-1000">
          <iframe
            src="https://maps.google.com/maps?q=22.522778,88.343778+(NRB+Design)&t=&z=17&ie=UTF8&iwloc=&output=embed"
            className="absolute top-0 left-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-md px-5 py-3.5 shadow-xl rounded-lg border border-stone-200/80 flex items-center gap-3 max-w-[90%] sm:max-w-auto">
            <div className="w-9 h-9 rounded-full bg-[#3a3532] flex items-center justify-center text-[#b3957b] shrink-0 shadow-sm">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Playfair_Display',serif] font-bold text-base text-[#1a1a1a] leading-tight">NRB Design</h3>
              <p className="text-xs text-stone-600 mt-0.5">23, Kalidas Patitundi Ln, Kalighat, Kolkata - 700026</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Book Free Consultation Section */}
      <section id="consultation" className="py-20 md:py-32 px-6 bg-[#3a3532] text-[#f7f5f2]">
        <div className="max-w-[1000px] mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-['Playfair_Display',serif] text-3xl md:text-5xl mb-6">Book a Free Consultation</h2>
            <p className="text-sm opacity-80 mb-10 leading-relaxed max-w-sm">
              Ready to start your design journey? Get in touch with us to schedule a complimentary consultation and discuss your space.
            </p>
            
            <div className="space-y-6 text-sm opacity-90">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 shrink-0 text-[#b3957b]" />
                <p>23, Kalidas Patitundi Ln, Kalighat<br/>Kolkata, West Bengal<br/>India, Pin - 700026</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 shrink-0 text-[#b3957b]" />
                <p>+91-8240019657</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 text-[#3a3532]">
            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
                <h3 className="text-xl font-['Playfair_Display',serif]">Request Sent!</h3>
                <p className="text-sm opacity-80">We will get back to you shortly.</p>
                <button onClick={() => setSubmitSuccess(false)} className="mt-4 text-xs font-bold uppercase tracking-wider text-[#b3957b] hover:text-[#3a3532] transition-colors">Submit Another</button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleConsultationSubmit}>
                {submitError && <div className="text-red-500 text-sm">{submitError}</div>}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#3a3532] transition-colors bg-transparent" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#3a3532] transition-colors bg-transparent" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#3a3532] transition-colors bg-transparent" placeholder="+91 00000 00000" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Message</label>
                  <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#3a3532] transition-colors bg-transparent resize-none h-20" placeholder="Tell us about your project..."></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-[#3a3532] hover:bg-[#b3957b]'} text-[#f7f5f2] py-3 text-sm transition-colors mt-4`}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Floating Social Buttons */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col gap-4">
        {/* Instagram Button */}
        <a 
          href="https://www.instagram.com/craftingwithnrb?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center group"
          aria-label="Follow us on Instagram"
        >
          <Instagram className="w-6 h-6 md:w-8 md:h-8" />
          {/* Tooltip */}
          <span className="absolute right-full mr-4 bg-white text-gray-800 text-xs px-3 py-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Follow on Instagram
          </span>
        </a>

        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/918240019657" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center group"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />
          {/* Tooltip */}
          <span className="absolute right-full mr-4 bg-white text-gray-800 text-xs px-3 py-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with us
          </span>
        </a>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#1a1817] text-white py-8 text-center text-xs opacity-80">
        <p>&copy; {new Date().getFullYear()} NRB DESIGN. All rights reserved.</p>
      </footer>
    </div>
  );
}
