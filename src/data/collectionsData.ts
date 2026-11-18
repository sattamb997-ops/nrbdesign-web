export interface SpaceGalleryPhoto {
  caption: string;
  url: string;
}

export interface CollectionImage {
  slug: string;
  category: string;
  title: string;
  description: string;
  url: string;
  fullDescription: string[];
  designElements: string[];
  specifications: { label: string; value: string }[];
  galleryPhotos: SpaceGalleryPhoto[];
}

export interface CollectionItem {
  id: 'smart' | 'signature' | 'bespoke';
  number: string;
  name: string;
  tagline: string;
  badge: string;
  shortDesc: string;
  idealFor: string;
  heroImage: string;
  experience: string;
  whatDefines: string[];
  homeownerValues: string[];
  keyHighlights: { label: string; detail: string }[];
  gallery: CollectionImage[];
  comparison: {
    approach: string;
    spacePlanning: string;
    materials: string;
    detailing: string;
    identity: string;
  };
}

export const COLLECTIONS_DATA: Record<'smart' | 'signature' | 'bespoke', CollectionItem> = {
  smart: {
    id: 'smart',
    number: '01',
    name: 'NRB SMART',
    tagline: 'Designed around practical living.',
    badge: 'Budget-conscious / Practical & Functional',
    shortDesc: 'For homeowners who want beautiful, functional and well-planned interiors. The focus is on space utilisation, practical material selection and smart design decisions based on their requirements.',
    idealFor: 'Homeowners looking for high-utility, space-efficient, and budget-conscious interiors without compromising on quality or aesthetics.',
    heroImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    experience: 'A thoughtfully planned interior experience focused on ergonomic layout, intelligent storage, and smart material choices. Every corner of your home is optimized to feel open, airy, and effortlessly organized.',
    whatDefines: [
      'Ergonomic space planning for 1BHK, 2BHK and 3BHK compact & medium apartments',
      'Value-conscious branded materials with dependable warranties',
      'Modular kitchen solutions engineered for daily Indian cooking',
      'Sleek modular wardrobes with customizable organizers and hanging spaces',
      'Clean modern aesthetics with essential, purposeful detailing',
      'Guaranteed 45-day turnkey project delivery and price-lock guarantee'
    ],
    homeownerValues: [
      'Smart spatial utilisation and decluttered living',
      'Reliable, durable materials with easy everyday maintenance',
      'Transparent budgeting with zero hidden costs',
      'Professional project coordination and timely handover'
    ],
    keyHighlights: [
      { label: 'Space Planning', detail: 'Requirement-led & high-utility layout' },
      { label: 'Core Material', detail: 'High-density moisture-resistant boards & BWR plywood' },
      { label: 'Hardware', detail: 'Branded soft-close hinges & telescopic channel runners' },
      { label: 'Finishes', detail: 'Anti-scratch matt laminates & easy-clean acrylic surfaces' },
      { label: 'Warranty', detail: '10 to 15 Years structural & hardware backing' }
    ],
    gallery: [
      {
        slug: 'open-living-smart-storage',
        category: 'Living Room & Storage',
        title: 'Open Living & Smart Storage',
        description: 'Multi-functional TV console and concealed cabinets creating a spacious ambiance.',
        url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
        fullDescription: [
          'In modern Kolkata apartments, the living room often serves as the heart of daily family life, guest entertaining, and relaxation. Under the NRB SMART collection, our Open Living & Smart Storage concept focuses on maximizing floor visibility while keeping clutter completely out of sight.',
          'By combining floating media consoles with sleek vertical cabinetry and warm neutral palettes, we create an airy spatial flow that makes compact and mid-sized living rooms feel noticeably larger, brighter, and effortlessly organized.'
        ],
        designElements: [
          'Floating TV console with concealed wire routing and hidden set-top box storage',
          'Full-height foyer shoe & utility cabinet seamlessly blended into the wall tone',
          'Space-saving nesting coffee tables and modular sofa layouts tailored to movement paths',
          'Durable anti-scratch laminate surfaces designed for effortless everyday cleaning'
        ],
        specifications: [
          { label: 'Core Carcass', value: 'IS 303 BWR Plywood & High-Density Moisture Resistant Board' },
          { label: 'Surface Finish', value: 'Matte textured laminates in warm oak & ivory tones' },
          { label: 'Hardware', value: 'Branded soft-close hinges & concealed drawer channels' },
          { label: 'Lighting', value: 'Recessed LED downlights with warm console accent strip' }
        ],
        galleryPhotos: [
          {
            caption: 'Open-plan living room featuring streamlined cabinetry and abundant natural light',
            url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Floating entertainment console with concealed cable management and display shelves',
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Smart entryway storage bench paired with clean vertical wall paneling',
            url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Light-toned upholstery and compact seating proportions for unobstructed circulation',
            url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80'
          }
        ]
      },
      {
        slug: 'ergonomic-modular-kitchen',
        category: 'Modular Kitchen',
        title: 'Ergonomic Modular Kitchen',
        description: 'Durable, stain-resistant counter surfaces and stainless steel pull-out baskets.',
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        fullDescription: [
          'Designed specifically for the demands of everyday Indian cooking, the NRB SMART Ergonomic Modular Kitchen brings precision workflow planning into your home. We structure every kitchen around the golden work triangle—sink, hob, and refrigerator—to reduce unnecessary movement and make meal preparation effortless.',
          'Every cabinet and drawer is engineered with moisture-resistant substrates, stain-resistant worktops, and heavy-duty stainless steel pull-out accessories that keep spices, utensils, and dry groceries neatly accessible.'
        ],
        designElements: [
          'Efficient L-shaped, U-shaped, or parallel layout optimized for natural ventilation',
          'SS 304 grade cutlery organizers, bottle pull-outs, and deep thali baskets',
          'Loft cabinets extending up to the ceiling for seasonal storage without dust traps',
          'Easy-wipe glossy or satin laminate shutters paired with a stain-proof granite/quartz counter'
        ],
        specifications: [
          { label: 'Core Material', value: 'Boiling Water Resistant (BWR) Plywood / Marine Grade near sink zone' },
          { label: 'Countertop', value: 'Stain-resistant Black Galaxy Granite or Engineered Quartz' },
          { label: 'Hardware & Baskets', value: 'Soft-close telescopic channels & SS 304 rust-proof baskets' },
          { label: 'Backsplash', value: 'Seamless ceramic or vitrified easy-clean wall tiles' }
        ],
        galleryPhotos: [
          {
            caption: 'Bright ergonomic kitchen layout maximizing counter workspace and overhead storage',
            url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Streamlined upper cabinetry with integrated under-cabinet task lighting',
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Deep pantry drawers and clean modern hardware built for daily heavy usage',
            url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Compact breakfast edge and durable backsplash engineered for easy cleaning',
            url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80'
          }
        ]
      },
      {
        slug: 'master-bedroom-storage',
        category: 'Master Bedroom',
        title: 'Master Bedroom with Floor-to-Ceiling Storage',
        description: 'Seamless wardrobe design with integrated dresser and bed storage.',
        url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
        fullDescription: [
          'A calm, restorative bedroom begins with smart organization. The NRB SMART Master Bedroom integrates full-height floor-to-ceiling wardrobes with built-in loft compartments, eliminating visual clutter and maximizing every square inch of vertical wall space.',
          'Paired with a hydraulic lift-up storage bed and a compact integrated dressing unit, the room maintains generous walking clearance around the bed while effortlessly storing clothing, linens, and travel luggage.'
        ],
        designElements: [
          'Floor-to-ceiling sliding or hinged wardrobe with internal drawer locks & hanging zones',
          'Hydraulic storage bed with smooth gas-spring lift mechanism for seasonal bedding',
          'Integrated side tables and compact mirror dresser with concealed cosmetic shelves',
          'Soothing neutral color palette designed to encourage rest and visual spaciousness'
        ],
        specifications: [
          { label: 'Wardrobe Structure', value: 'BWR Plywood carcass with internal white liner finish' },
          { label: 'External Finish', value: 'Matte woodgrain & pastel solid laminates with edge-banding' },
          { label: 'Bed Mechanism', value: 'Heavy-duty hydraulic box lift with cushioned headboard' },
          { label: 'Hardware', value: 'Soft-close hinges, full-extension wardrobe drawers & aluminum profiles' }
        ],
        galleryPhotos: [
          {
            caption: 'Calm master bedroom featuring clean-lined bed frame and warm layered lighting',
            url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Seamless floor-to-ceiling wardrobe with integrated loft cabinetry',
            url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Smart bedside storage paired with soft warm ambient lamps',
            url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Space-efficient integrated vanity dresser tucked cleanly alongside wardrobe',
            url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
          }
        ]
      },
      {
        slug: 'compact-work-study-nook',
        category: 'Work & Study',
        title: 'Compact Work & Study Nook',
        description: 'Floating desk and concealed cable management for smart hybrid work.',
        url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
        fullDescription: [
          'With hybrid work and home study now an essential part of daily life, carving out a dedicated, distraction-free workspace inside an apartment requires thoughtful planning. Our NRB SMART Work & Study Nook turns underutilized corners or bedroom niches into highly productive home offices.',
          'Featuring a wall-mounted floating desk, overhead open-and-closed book storage, and hidden power-strip routing, it preserves floor space while offering ergonomic comfort throughout the workday.'
        ],
        designElements: [
          'Wall-mounted floating study desk keeping the floor area open and easy to clean',
          'Concealed wire channel and flush desk grommet for clutter-free laptop & monitor setup',
          'Overhead modular bookshelf combining open display cubbies with closed file cabinets',
          'Pin-board or magnetic backdrop panel with dedicated warm task lighting'
        ],
        specifications: [
          { label: 'Desk Construction', value: '25mm thickened laminated BWR board with ABS edge protection' },
          { label: 'Storage', value: 'Two soft-close stationery drawers + overhead lift-up cabinet' },
          { label: 'Electrical Integration', value: 'Concealed power sockets, USB ports & cable tray' },
          { label: 'Finish Options', value: 'Natural ash wood laminate & matte sage/charcoal accents' }
        ],
        galleryPhotos: [
          {
            caption: 'Clean floating desk setup with overhead storage and natural daylight',
            url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Dedicated apartment work corner designed with calm wood tones',
            url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Built-in vertical shelving keeping books and work files neatly organized',
            url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Ergonomic seating and streamlined desktop layout for focused productivity',
            url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
          }
        ]
      }
    ],
    comparison: {
      approach: 'Practical & functional',
      spacePlanning: 'Requirement-led',
      materials: 'Value-conscious',
      detailing: 'Essential detailing',
      identity: 'Clean & functional'
    }
  },

  signature: {
    id: 'signature',
    number: '02',
    name: 'NRB SIGNATURE',
    tagline: 'Refined living, personalised for you.',
    badge: 'Mid-premium / Refined & Personalised',
    shortDesc: 'For homeowners who appreciate refined finishes, thoughtful detailing and personalised design. The focus is on creating the right balance between aesthetics, comfort and functionality.',
    idealFor: 'Homeowners who value distinctive aesthetic choices, warm layered lighting, premium textures, and a harmonious balance of comfort, aesthetics and functionality.',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    experience: 'A thoughtfully curated interior experience that brings together refined aesthetics, functional planning and personal design preferences. Every room features tailored accent walls, bespoke millwork, and sophisticated finishes that reflect your personal taste.',
    whatDefines: [
      'Personalised space planning with comprehensive 3D photorealistic visualizations',
      'Refined material and finish selection including fluted panels, veneers, and quartz surfaces',
      'Carefully considered design details: profile cove lighting, hidden handles, and accent niches',
      'Custom-designed TV feature walls, illuminated bar units, and prayer/mandir setups',
      'Premium European hardware (Hettich / Hafele) for ultra-smooth movement',
      'Coordinated interior execution with dedicated on-site site supervisor'
    ],
    homeownerValues: [
      'A distinctive home with signature focal points and sophisticated mood lighting',
      'Considered design choices that strike the perfect equilibrium between beauty and daily comfort',
      'High-grade textures and acoustic/visual warmth throughout the residence',
      'Stress-free turnkey management from design inception to final accessorization'
    ],
    keyHighlights: [
      { label: 'Space Planning', detail: 'Design-led with zone demarcation and lifestyle alignment' },
      { label: 'Core Material', detail: 'Calibrated BWP marine plywood & high-grade HDHMR' },
      { label: 'Hardware', detail: 'Hettich / Hafele soft-close Quadro runners & tandem boxes' },
      { label: 'Finishes', detail: 'Textured synchronized laminates, fluted charcoal louvers, PU/Duco highlights' },
      { label: 'Ceilings & Lighting', detail: 'Architectural false ceiling with magnetic track and COB warm accents' }
    ],
    gallery: [
      {
        slug: 'contemporary-living-salon',
        category: 'Living Room',
        title: 'Contemporary Living Salon',
        description: 'Fluted wall paneling, brushed brass inserts, and cove illumination.',
        url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
        fullDescription: [
          'The NRB SIGNATURE Contemporary Living Salon elevates everyday entertaining with architectural wall treatments, warm metallic accents, and layered ambient illumination. Rather than relying on heavy ornamentation, we create depth through tactile contrast—pairing fluted charcoal or walnut louvers with smooth matte plaster and subtle brushed brass T-profiles.',
          'Our false ceiling designs integrate recessed cove lighting and glare-free COB spotlights so you can shift effortlessly from bright daytime living to an intimate, warm evening ambiance.'
        ],
        designElements: [
          'Feature TV wall crafted with fluted wood louvers, stone-finish cladding, and brass inlays',
          'Architectural gypsum false ceiling with multi-circuit warm LED cove & magnetic tracks',
          'Custom-proportioned console credenza with fluted glass and handle-less push-to-open drawers',
          'Curated upholstery textures, sheer-and-blackout drapery pelmets, and decorative accent lighting'
        ],
        specifications: [
          { label: 'Wall Paneling', value: 'HDHMR fluted louvers, synchronized wood veneer & brass metal inlays' },
          { label: 'False Ceiling', value: 'Saint-Gobain Gyproc board with concealed pelmet & profile LEDs' },
          { label: 'Hardware', value: 'Hettich / Hafele soft-close hinges & Quadro channel drawers' },
          { label: 'Paint & Finish', value: 'Asian Paints Royale Aspira / Matte PU satin accents' }
        ],
        galleryPhotos: [
          {
            caption: 'Contemporary living room anchored by warm wood tones and architectural wall detailing',
            url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Refined seating lounge with layered pendant and recessed ceiling illumination',
            url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Custom media feature wall blending stone textures, concealed storage, and warm lighting',
            url: 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Harmonious neutral palette with plush furnishings and curated art framing',
            url: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80'
          }
        ]
      },
      {
        slug: 'luxury-modular-kitchen-island',
        category: 'Modular Kitchen',
        title: 'Luxury Modular Kitchen with Breakfast Island',
        description: 'Quartz worktops, seamless acrylic finishes, and integrated pantry pullouts.',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        fullDescription: [
          'The NRB SIGNATURE Kitchen transforms culinary prep into a refined social experience. Featuring a sleek breakfast island or peninsula counter, it seamlessly connects the kitchen with your dining area while keeping heavy cooking clutter thoughtfully zoned.',
          'Outfitted with European tandem box drawers, tall pull-out pantry units, and high-gloss acrylic or anti-fingerprint matte PU shutters, every movement feels whisper-quiet, balanced, and deeply satisfying.'
        ],
        designElements: [
          'Central or peninsula breakfast counter with waterfall quartz edge and pendant lighting',
          'Tall larder pantry unit with multi-tier pull-out racks and built-in appliance tower',
          'Profile handle-less Gola shutters in anti-fingerprint matte acrylic or PU finish',
          'Corner magic-pullout systems ensuring zero wasted cabinet depth'
        ],
        specifications: [
          { label: 'Core Material', value: 'Calibrated BWP Marine Plywood (IS 710) & Moisture-Proof HDHMR' },
          { label: 'Shutters', value: 'German high-gloss / super-matte acrylic or lacquered PU finishes' },
          { label: 'Hardware', value: 'Hettich Innotech / Hafele Matrix tandem drawers & lift-up wall flaps' },
          { label: 'Counter & Sink', value: '20mm Engineered Quartz stone with undermount quartz/SS sink' }
        ],
        galleryPhotos: [
          {
            caption: 'Open modular kitchen with quartz island counter and designer pendant lights',
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Seamless handle-less cabinetry paired with built-in oven and microwave tower',
            url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Refined marble-veined quartz backsplash and warm under-cabinet illumination',
            url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Precision internal drawer partitioning and tandem storage engineering',
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80'
          }
        ]
      },
      {
        slug: 'signature-master-suite',
        category: 'Master Bedroom',
        title: 'Signature Master Suite',
        description: 'Bespoke upholstered acoustic headboard and glass-tinted sliding wardrobe.',
        url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
        fullDescription: [
          'Crafted as a serene personal sanctuary, the NRB SIGNATURE Master Suite blends tactile comfort with boutique-hotel elegance. An expansive floor-to-ceiling cushioned headboard wall—framed with warm wood paneling and suspended bedside pendant lights—creates an unmistakable focal point.',
          'Adjacent to the sleeping zone, bronze or smoked-tinted glass wardrobe shutters with sensor-activated internal LED strips allow you to view and access your wardrobe collection effortlessly.'
        ],
        designElements: [
          'Custom upholstered fabric/suede headboard wall with vertical brass & veneer framing',
          'Aluminum-framed tinted fluted/clear glass wardrobe with motion-sensor internal lighting',
          'Dedicated dressing niche with backlit arch/oval vanity mirror and velvet jewelry drawer',
          'Suspended bedside warm pendants with independent two-way bedside dimmer switches'
        ],
        specifications: [
          { label: 'Wardrobe Shutters', value: 'Slim black/champagne aluminum profile with tinted toughened glass' },
          { label: 'Internal Accessories', value: 'Pull-out trouser rack, velvet-lined organizer & soft-close drawers' },
          { label: 'Bed & Backdrop', value: 'Acoustic suede/linen paneling with BWP plywood frame' },
          { label: 'Hardware', value: 'Hettich / Hafele soft-close sliding track mechanisms' }
        ],
        galleryPhotos: [
          {
            caption: 'Signature master bedroom featuring tailored upholstered wall and soft bedside glow',
            url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Tinted glass wardrobe system with illuminated interior shelving',
            url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Custom backlit vanity mirror and floating dresser drawers',
            url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Warm textured wall finishes and luxury drapery pelmets for restful sleep',
            url: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=1200&q=80'
          }
        ]
      },
      {
        slug: 'dining-lounge-curated-bar',
        category: 'Dining & Bar',
        title: 'Dining Lounge & Curated Bar Console',
        description: 'Designer crockery display with warm LED glass shelving and wine storage.',
        url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
        fullDescription: [
          'The dining space is where memories are shared over meals and celebrations. In the NRB SIGNATURE collection, we elevate the dining lounge with a sculptural crockery and bar console that acts as both functional storage and a glowing architectural centerpiece.',
          'Fluted glass vitrines, integrated LED shelf lighting, stemware racks, and quartz-topped serving counters transform how you host friends and family in your Kolkata home.'
        ],
        designElements: [
          'Floor-to-ceiling crockery display featuring bronze-tinted or fluted glass doors',
          'Warm recessed LED shelf strips highlighting glassware, ceramics, and collectibles',
          'Dedicated bar counter section with wine bottle cubbies and hanging stemware holders',
          'Coordinated dining table backdrop with statement chandelier and textured wall molding'
        ],
        specifications: [
          { label: 'Display Shutters', value: 'Anodized champagne aluminum frames with 5mm fluted/tinted glass' },
          { label: 'Counter Surface', value: 'Polished quartz or stone-finish serving ledge' },
          { label: 'Lighting', value: '3000K warm recessed profile LED strips inside vitrine cabinets' },
          { label: 'Lower Storage', value: 'Deep soft-close drawers & compartmentalized cutlery trays' }
        ],
        galleryPhotos: [
          {
            caption: 'Warm dining lounge anchored by statement chandelier and custom wall detailing',
            url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Illuminated crockery & bar unit with tinted glass doors and warm interior shelving',
            url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Sleek dining sideboard and minimalist decorative styling',
            url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Seamless flow between formal dining area and contemporary living space',
            url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
          }
        ]
      }
    ],
    comparison: {
      approach: 'Refined & personalised',
      spacePlanning: 'More design-led',
      materials: 'Refined selections',
      detailing: 'Enhanced detailing',
      identity: 'Distinctive & refined'
    }
  },

  bespoke: {
    id: 'bespoke',
    number: '03',
    name: 'NRB BESPOKE',
    tagline: 'Your vision, uniquely crafted.',
    badge: 'High-end / Custom & Distinctive',
    shortDesc: 'For homeowners who want to give their homes a completely individual design identity. The focus is on custom design elements, distinctive materials and design development based on their specific requirements.',
    idealFor: 'Homeowners who desire a one-of-a-kind home with bespoke architectural elements, exotic stones, handcrafted artisan furniture, and couture finishes.',
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    experience: 'An elite, bespoke design journey where boundaries of standard catalog items are left behind. Every joinery, piece of furniture, ceiling detail, and stone element is custom-commissioned and handcrafted specifically for your home.',
    whatDefines: [
      'Individually developed architectural space planning and custom spatial geometry',
      'Specially curated luxury materials: Italian bookmatched marble, natural wood veneers, and brass inlays',
      'Artisan-crafted furniture pieces tailored to your exact ergonomic and aesthetic vision',
      'Custom architectural lighting schemes with integrated smart home automation controls',
      'Luxury walk-in boutique closets with sensor lighting, velvet trays, and tinted aluminum doors',
      'Dedicated project lead, white-glove site management, and concierge handover'
    ],
    homeownerValues: [
      'Unrivaled individuality—a home unlike any other in the city',
      'Impeccable craftsmanship, master joinery, and rare organic materials',
      'End-to-end luxury consulting from structural nuances to artwork curation',
      'An uncompromising standard of permanence, grace, and architectural prestige'
    ],
    keyHighlights: [
      { label: 'Space Planning', detail: 'Individually developed architectural couture layout' },
      { label: 'Core Material', detail: 'Boiling Waterproof IS 710 Marine Grade with zero-void guarantees' },
      { label: 'Hardware', detail: 'Imported Blum / Salice soft-close systems with electronic push-to-open' },
      { label: 'Finishes', detail: 'Natural smoked veneers, PU high-gloss/matt lacquer, Italian Statuario marble' },
      { label: 'Craftsmanship', detail: 'Master artisan handcrafted detailing, custom metal trims & bespoke upholstery' }
    ],
    gallery: [
      {
        slug: 'grand-living-salon-atrium',
        category: 'Grand Living',
        title: 'Grand Living Salon & Double-Height Atrium',
        description: 'Italian bookmatched marble wall, bespoke crystal chandelier, and custom metalwork.',
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
        fullDescription: [
          'The NRB BESPOKE Grand Living Salon is conceived as an architectural statement piece—crafted from the ground up with custom spatial proportions, bookmatched Italian Statuario or Travertine marble feature walls, and handcrafted brass or bronze partitioning screens.',
          'Every element—from bespoke curved sofas upholstered in Belgian linen to programmable smart mood-lighting scenes—is tailored exclusively for your residence so your home carries an unmistakable signature of timeless grandeur.'
        ],
        designElements: [
          'Full-height bookmatched natural Italian marble cladding with concealed structural framing',
          'Handcrafted PVD brushed-brass metal jaali screens and custom architectural archways',
          'Bespoke artisan-built seating, solid marble coffee tables, and statement sculptural chandeliers',
          'Integrated Lutron / smart scene automation controlling blinds, dimmers, and cove lighting'
        ],
        specifications: [
          { label: 'Stone & Cladding', value: 'Bookmatched Italian marble, natural travertine & smoked teak veneers' },
          { label: 'Metalwork', value: 'Laser-cut SS 304 PVD Champagne Gold / Aged Brass architectural trims' },
          { label: 'Automation', value: 'Scene-programmable smart lighting & motorized sheer drapery tracks' },
          { label: 'Bespoke Furniture', value: 'Hand-built solid teak frames with performance boucle & leather upholstery' }
        ],
        galleryPhotos: [
          {
            caption: 'Expansive living salon featuring floor-to-ceiling natural stone and sculptural lighting',
            url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Bespoke architectural proportions connecting indoor living with terrace greenery',
            url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Handcrafted artisan furniture and custom veneer wall millwork',
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Warm gallery-style lighting accentuating curated stone textures and art pieces',
            url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
          }
        ]
      },
      {
        slug: 'couture-chef-kitchen-island',
        category: 'Couture Kitchen',
        title: 'Couture Chef Kitchen & Island',
        description: 'Monolithic quartz waterfall island with integrated induction, touch cabinetry, and wine cellar.',
        url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
        fullDescription: [
          'Our Couture Chef Kitchen is engineered for homeowners who view culinary design as an art form. Built around a monolithic waterfall stone island, it pairs sculptural Italian minimalism with commercial-grade culinary precision.',
          'Integrated concealed appliances, electronic touch-to-open cabinetry, sintered-stone counters, and climate-controlled wine storage come together seamlessly to create a kitchen worthy of private chef entertaining.'
        ],
        designElements: [
          'Monolithic waterfall island clad in bookmatched sintered stone or exotic quartzite',
          'Fully integrated built-in refrigeration, dishwasher, combi-steam oven, and wine chiller',
          'Pocket-door breakfast & coffee bar station that conceals completely when closed',
          'Imported Blum Servo-Drive electronic touch-open drawers and Legrabox inner partitioning'
        ],
        specifications: [
          { label: 'Core & Joinery', value: 'Calibrated IS 710 Marine Grade Plywood with zero-void precision' },
          { label: 'Hardware', value: 'Imported Austrian Blum Legrabox & Servo-Drive electronic systems' },
          { label: 'Surfaces', value: '12mm Sintered Porcelain / Quartzite & hand-rubbed PU lacquer / wood veneer' },
          { label: 'Appliance Integration', value: 'Flush-mounted induction, downdraft hood & built-in pantry fridge' }
        ],
        galleryPhotos: [
          {
            caption: 'Monolithic waterfall island kitchen designed for gourmet prep and hosting',
            url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Floor-to-ceiling veneer cabinetry housing concealed built-in appliances',
            url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Minimalist stone countertop detailing with integrated architectural lighting',
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Seamless wet-and-dry kitchen zoning tailored for effortless entertaining',
            url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80'
          }
        ]
      },
      {
        slug: 'presidential-master-suite-boutique',
        category: 'Master Suite & Closet',
        title: 'Presidential Master Suite & Walk-in Boutique',
        description: 'Smoked oak veneers, fluted brass accents, and custom illumination throughout.',
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
        fullDescription: [
          'The NRB BESPOKE Presidential Master Suite is designed as a multi-zone private sanctuary—combining a serene sleeping lounge, an intimate reading alcove, and a luxury walk-in boutique closet.',
          'Natural smoked oak veneers, leather-wrapped drawer pulls, velvet-lined watch and jewelry island chests, and architectural ceiling coves deliver a five-star residential experience crafted around your daily rituals.'
        ],
        designElements: [
          'Dedicated walk-in dressing boutique with central glass-top island for watches & jewelry',
          'Custom-tailored headboard architecture featuring natural veneer, fluted stone & brass',
          'Full-height bronze glass wardrobe doors with sensor-triggered vertical shelf illumination',
          'Integrated hidden doorway leading seamlessly into the master spa bathroom'
        ],
        specifications: [
          { label: 'Veneers & Finishes', value: 'Natural Quarter-Cut Smoked Oak Veneer with dead-matte PU coating' },
          { label: 'Walk-in Closet', value: 'Custom aluminum glass partitions, leather-lined trays & sensor LEDs' },
          { label: 'Hardware', value: 'Blum / Salice soft-close & concealed push-latch mechanisms' },
          { label: 'Upholstery', value: 'Bespoke Italian leatherette & Belgian woven fabric paneling' }
        ],
        galleryPhotos: [
          {
            caption: 'Presidential master bedroom showcasing warm natural veneers and bespoke tailoring',
            url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Boutique walk-in wardrobe system with illuminated glass shelving and central chest',
            url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Bespoke upholstered lounge corner inside the master suite',
            url: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Architectural headboard wall with integrated warm brass reading lights',
            url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80'
          }
        ]
      },
      {
        slug: 'private-lounge-onyx-bar',
        category: 'Private Lounge & Bar',
        title: 'Private Lounge & Onyx Bar',
        description: 'Back-lit semi-precious stone counter with custom leather stools and brass wine racks.',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        fullDescription: [
          'Crafted for private evenings and distinguished entertaining, the NRB BESPOKE Private Lounge & Onyx Bar brings museum-grade craftsmanship into your home. A translucent, back-lit honey or white Onyx stone counter glows gently from within, becoming an unforgettable centerpiece.',
          'Flanked by custom-fabricated brass wine shelving, leather-upholstered bar seating, and acoustic wood-slatted wall paneling, the space sets an atmosphere of quiet sophistication.'
        ],
        designElements: [
          'Translucent back-lit natural Onyx marble bar counter with dimmable LED light-box backing',
          'Custom brass-and-walnut suspended bottle display and stemware rack',
          'Acoustic leather and wood slat wall paneling tailored for home theatre or lounge clarity',
          'Concealed mini-bar chiller, ice-maker, and custom fluted-glass spirit cabinets'
        ],
        specifications: [
          { label: 'Bar Counter', value: 'Translucent Natural Onyx Stone with diffused 2700K dimmable backlight' },
          { label: 'Joinery & Shelving', value: 'Solid walnut & PVD brushed brass custom structural racks' },
          { label: 'Seating', value: 'Custom stitched full-grain leather bar stools with brass footrests' },
          { label: 'Acoustics', value: 'Perforated acoustic wood paneling & plush textured wall coverings' }
        ],
        galleryPhotos: [
          {
            caption: 'Private luxury lounge designed for intimate evening gatherings and entertaining',
            url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Illuminated custom stone bar counter with warm ambient lighting and wine display',
            url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Custom wood-and-brass architectural shelving and curated lounge seating',
            url: 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1200&q=80'
          },
          {
            caption: 'Refined evening atmosphere pairing natural stone textures with warm gold highlights',
            url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
          }
        ]
      }
    ],
    comparison: {
      approach: 'Highly customised',
      spacePlanning: 'Individually developed',
      materials: 'Specially curated',
      detailing: 'Custom detailing',
      identity: 'Unique to the homeowner'
    }
  }
};
