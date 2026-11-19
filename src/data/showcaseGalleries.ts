import kitchhImage from '../../kitchh.jpg';
import wardImage from '../../ward.jpg';
import dressImage from '../../dress.jpg';
import tvunitImage from '../../tvunit.jpg';
import crockImage from '../../crock.jpg';
import barrImage from '../../barr.jpg';
import wallImage from '../../wall.jpg';
import washroomPhoto from '../../washroom.png';
import roomPhoto from '../../room.png';
import livingPhoto from '../../living.png';
import intPhoto from '../../int.jpg';
import p1Image from '../../P1.png';
import p3Image from '../../P3.png';
import p4Image from '../../P4.png';
import p5Image from '../../P5.png';
import p6Image from '../../P6.jpeg';

import budgetPlannerHero from '../assets/images/budget_planner_hero_1794732665670.jpg';
import washroomMarbleVanity from '../assets/images/washroom_marble_vanity_1795073153991.jpg';
import washroomSpaSuite from '../assets/images/washroom_spa_suite_1795073154168.jpg';
import washroomPowderRoom from '../assets/images/washroom_powder_room_1795073155072.jpg';
import hydraulicBedSuite from '../assets/images/hydraulic_bed_suite_1795073154171.jpg';
import crockeryBarShowcase from '../assets/images/crockery_bar_showcase_1795073154280.jpg';
import kitchenIslandOak from '../assets/images/kitchen_island_oak_1795073206735.jpg';
import wardrobeWalkinGlass from '../assets/images/wardrobe_walkin_glass_1795073205660.jpg';
import dressingTableVanity from '../assets/images/dressing_table_vanity_1795073206502.jpg';
import barCabinetLounge from '../assets/images/bar_cabinet_lounge_1795073205791.jpg';

export type ShowcaseCategorySlug =
  | 'kitchen'
  | 'hydraulic-bed'
  | 'wardrobe'
  | 'dressing-table'
  | 'washroom'
  | 'living-decor'
  | 'tv-unit'
  | 'crockery-unit'
  | 'bar-cabinet'
  | 'wall-decor';

export interface GalleryPhotoItem {
  url: string;
  title: string;
  caption: string;
  finish: string;
}

export interface ShowcaseGalleryCategory {
  slug: ShowcaseCategorySlug;
  title: string;
  subtitle: string;
  overview: string;
  coverImage: string;
  highlights: string[];
  photos: GalleryPhotoItem[];
}

export const SHOWCASE_GALLERIES: ShowcaseGalleryCategory[] = [
  {
    slug: 'kitchen',
    title: 'Kitchen',
    subtitle: 'Ergonomic Modular Culinary Spaces',
    overview:
      'Engineered around Indian cooking workflows with moisture-resistant BWR/BWP carcasses, seamless quartz countertops, tall pantry towers, and effortless soft-close hardware.',
    coverImage: kitchhImage,
    highlights: [
      'BWR & Marine-Grade Plywood Carcasses',
      'Laminate, Membrane, Acrylic & PU Shutters',
      'Concealed Under-Cabinet Profile Lighting',
      'Integrated Chimney, Hob & Tall Appliance Towers',
    ],
    photos: [
      {
        url: kitchhImage,
        title: 'Warm Neutral L-Shaped Modular Kitchen',
        caption: 'Floor-to-ceiling loft cabinetry paired with black granite worktop, built-in hob, and warm profile lighting.',
        finish: 'High-Gloss Champagne Laminate · Granite Counter',
      },
      {
        url: kitchenIslandOak,
        title: 'Sage & Warm Oak Culinary Suite',
        caption: 'Handleless sage shutters balanced with natural oak tall oven housing and veined marble backsplash.',
        finish: 'Matte Anti-Scratch Acrylic · Engineered Quartz',
      },
      {
        url: budgetPlannerHero,
        title: 'Open-Plan Kitchen with Marble Island',
        caption: 'Seamless kitchen-to-living flow anchored by a fluted marble dining island and tall oak pantry millwork.',
        finish: 'Veneer Oak · Fluted Stone Island',
      },
      {
        url: '/intro-frames/frame_105.webp',
        title: 'Contemporary Apartment Kitchenette & Dining Transition',
        caption: 'Coordinated neutral finishes uniting kitchen joinery, dining zone, and recessed architectural ceiling lights.',
        finish: 'Satin PU · Warm Cove Illumination',
      },
    ],
  },
  {
    slug: 'hydraulic-bed',
    title: 'Hydraulic Bed',
    subtitle: 'Restful Suites with Concealed Storage',
    overview:
      'Custom upholstered and timber beds featuring smooth heavy-duty hydraulic lift mechanisms, acoustic-soft headboards, and floating bedside joinery.',
    coverImage: hydraulicBedSuite,
    highlights: [
      'Heavy-Duty Gas-Spring Hydraulic Lift',
      'Custom King & Queen Sizing with Full Box Storage',
      'Fluted Timber & Cushioned Headboard Paneling',
      'Integrated Bedside Switches & Warm Pendant Lighting',
    ],
    photos: [
      {
        url: hydraulicBedSuite,
        title: 'Emerald Velvet Hydraulic Master Bed',
        caption: 'Plush upholstered hydraulic storage bed framed by fluted walnut slats and warm backlit headboard panels.',
        finish: 'Velvet Upholstery · Fluted Walnut & Cove LED',
      },
      {
        url: roomPhoto,
        title: 'Botanical Cove Bedroom Suite',
        caption: 'Beige upholstered hydraulic bed paired with backlit botanical feature paneling and under-bed ambient glow.',
        finish: 'Linen Weave Fabric · Warm Recessed LED',
      },
      {
        url: intPhoto,
        title: 'Sculptural Arch Headboard Suite',
        caption: 'Curved architectural wall relief and upholstered king platform bed illuminated by globe pendants.',
        finish: 'Matte Fabric · Sculpted Plaster & Timber Slats',
      },
      {
        url: p3Image,
        title: 'Geometric Brass-Inlaid Headboard Bed',
        caption: 'Custom quilted headboard with brushed brass geometric inlays and floating veneer side drawers.',
        finish: 'Quilted Leatherette · Brass Trim & Oak Veneer',
      },
    ],
  },
  {
    slug: 'wardrobe',
    title: 'Wardrobe',
    subtitle: 'Floor-to-Ceiling Tailored Storage',
    overview:
      'Built up to the ceiling to maximize every vertical inch, combining hinged, sliding, or tinted glass shutters with customized drawer organizers and sensor lighting.',
    coverImage: wardImage,
    highlights: [
      'Floor-to-Ceiling Loft Integration',
      'Fluted, Matte Laminate & Tinted Glass Shutters',
      'Motion-Sensor Internal Strip Lighting',
      'Dedicated Accessory Trays, Locker & Saree Racks',
    ],
    photos: [
      {
        url: wardImage,
        title: 'Sage Fluted & Brass-Trimmed Wardrobe',
        caption: 'Full-height sage shutters accented with CNC-grooved patterns, slim brass handles, and lit open display niches.',
        finish: 'Matte PU Sage · Brushed Brass Profiles',
      },
      {
        url: wardrobeWalkinGlass,
        title: 'Smoked Glass Walk-In Closet System',
        caption: 'Champagne aluminum-framed tinted glass sliding wardrobe revealing warm walnut drawers and backlit shelving.',
        finish: 'Fluted Smoked Glass · Walnut Carcass',
      },
      {
        url: roomPhoto,
        title: 'Seamless High-Gloss Bedroom Wardrobe',
        caption: 'Cream mirror-gloss wardrobe seamlessly integrated beside a sunlit window bay seating bench.',
        finish: 'High-Gloss Acrylic · Warm Champagne Handles',
      },
      {
        url: dressingTableVanity,
        title: 'Integrated Dressing & Closet Suite',
        caption: 'Minimalist bedroom passage linking concealed full-height closets with a floating fluted dressing vanity.',
        finish: 'Matte Architectural Finish · Fluted Oak',
      },
    ],
  },
  {
    slug: 'dressing-table',
    title: 'Dressing Table',
    subtitle: 'Illuminated Vanities & Grooming Nooks',
    overview:
      'Refined dressing corners crafted with backlit mirrors, velvet-lined jewelry drawers, hidden wire routing, and compact footprints tailored to bedroom layouts.',
    coverImage: dressImage,
    highlights: [
      'Backlit Pill, Arch & Full-Length Mirrors',
      'Concealed Behind-Mirror & Drawer Storage',
      'Fluted Timber & Marble Countertop Surfaces',
      'Warm Face-Flattering 3000K Task Lighting',
    ],
    photos: [
      {
        url: dressImage,
        title: 'Circular Backlit Vanity with Fluted Backdrop',
        caption: 'Warm walnut slatted wall panel behind an asymmetric backlit mirror and twin-drawer vanity console.',
        finish: 'Warm Oak Laminate · Warm Halo LED',
      },
      {
        url: dressingTableVanity,
        title: 'Floating Fluted Oak Dressing Console',
        caption: 'Curved fluted wooden drawers topped with veined marble, paired with an oval backlit mirror and bouclé stool.',
        finish: 'Fluted White Oak · Carrara Top & Brass Sconce',
      },
      {
        url: p3Image,
        title: 'Full-Length Integrated Bedside Mirror',
        caption: 'Seamless tall LED mirror tucked beside the headboard wall to expand light and double as a dressing station.',
        finish: 'Warm Strip Backlighting · Walnut Louvers',
      },
      {
        url: washroomMarbleVanity,
        title: 'Marble & Walnut Vanity Detailing',
        caption: 'Precision vertical timber fluting and backlit circular mirror hardware adapted across dressing and bath zones.',
        finish: 'Walnut Veneer · Brushed Brass Accents',
      },
    ],
  },
  {
    slug: 'washroom',
    title: 'Washroom',
    subtitle: 'Spa-Grade Vanities, Partitions & Tiling',
    overview:
      'Complete wet-area transformations featuring waterproof floating vanities, backlit storage mirrors, toughened glass shower partitions, and concealed sanitary fittings.',
    coverImage: washroomMarbleVanity,
    highlights: [
      'HDHMR & Waterproof Vanity Cabinetry',
      'Toughened Frameless & Fluted Glass Partitions',
      'LED Mirrors with Concealed Storage',
      'Concealed Diverters, Wall-Hung WCs & Tile Renovation',
    ],
    photos: [
      {
        url: washroomMarbleVanity,
        title: 'Warm Walnut Vanity & Brass Shower Enclosure',
        caption: 'Floating fluted walnut vanity topped with stone, paired with a circular LED mirror and walk-in glass shower.',
        finish: 'Fluted Walnut · Brushed Brass & Travertine Tiles',
      },
      {
        url: washroomPhoto,
        title: 'Master Bath with Illuminated Wall Niches',
        caption: 'Soft stone-veined tiles, floating drawer vanity with under-glow, backlit shelves, and brass-framed shower cubicle.',
        finish: 'Taupe Stone Porcelain · Champagne Brass Hardware',
      },
      {
        url: washroomSpaSuite,
        title: 'Fluted Glass Partition Spa Bathroom',
        caption: 'Minimalist matte black fixtures, terrazzo floor tiles, recessed shower niche lighting, and a fluted glass divider.',
        finish: 'Matte Black Sanitaryware · Terrazzo & Reeded Glass',
      },
      {
        url: washroomPowderRoom,
        title: 'Sculpted Travertine Powder Room',
        caption: 'Statement dark veined marble backdrop featuring a fluted travertine pedestal basin and backlit arch mirror.',
        finish: 'Fluted Travertine · Noir Marble & Warm Sconces',
      },
    ],
  },
  {
    slug: 'living-decor',
    title: 'Living Decor',
    subtitle: 'Welcoming Lounges & Layered Interiors',
    overview:
      'Balanced living and dining environments uniting bespoke seating, false ceiling cove lighting, curated wall treatments, and unobstructed family circulation.',
    coverImage: livingPhoto,
    highlights: [
      'Peripheral & Designer False Ceilings',
      'Custom Sofas, Accent Walls & Centre Tables',
      'Layered Ambient, Cove & Pendant Lighting',
      'Coordinated Living-to-Dining Flow',
    ],
    photos: [
      {
        url: livingPhoto,
        title: 'Champagne Chandelier Living Lounge',
        caption: 'Warm neutral L-shaped sectional paired with brass-accented marble coffee table and illuminated media wall.',
        finish: 'Textured Bouclé · Onyx Marble & Cove Ceiling',
      },
      {
        url: budgetPlannerHero,
        title: 'Sunlit Open Living & Dining Concept',
        caption: 'Curved bouclé sofa, organic travertine coffee table, and sculptural curved ceiling cove overlooking greenery.',
        finish: 'Natural Travertine · Oak & Soft Plaster',
      },
      {
        url: p6Image,
        title: 'Full-Length Living & Dining Execution',
        caption: 'Completed Kolkata residence featuring dual-level perimeter cove ceiling, dining space, and bright marble flooring.',
        finish: 'Recessed Cove Gypsum · Italian-Look Vitrified Tile',
      },
      {
        url: '/intro-frames/frame_105.webp',
        title: 'Architectural Panelled Living Room',
        caption: 'Warm timber louvers, backlit stone media backdrop, curved seating, and architectural pendant rings.',
        finish: 'Walnut Louvers · Statuario Stone & Warm LED',
      },
    ],
  },
  {
    slug: 'tv-unit',
    title: 'TV Unit',
    subtitle: 'Focal Entertainment Walls & Consoles',
    overview:
      'Clean architectural media walls combining fluted louvers, stone or marble-finish panels, floating drawer consoles, and completely concealed wiring.',
    coverImage: tvunitImage,
    highlights: [
      'Concealed Wiring & Set-Top Box Routing',
      'Marble Laminate, Fluted Louvers & Backlit Panels',
      'Floating Base Consoles for Easy Floor Cleaning',
      'Integrated Open Display & Curio Shelving',
    ],
    photos: [
      {
        url: tvunitImage,
        title: 'Fluted Oak & Floating Slate Media Wall',
        caption: 'Asymmetric wood slat paneling with vertical strip lighting, slate-grey console drawers, and open display shelves.',
        finish: 'Natural Oak Louvers · Matte Charcoal Laminate',
      },
      {
        url: p5Image,
        title: 'Onyx & Brass-Inlaid TV Backdrop',
        caption: 'Completed Kolkata project pairing golden fluted paneling, backlit onyx stone board, and rounded floating console.',
        finish: 'Backlit Onyx Laminate · Gold Fluted Panel',
      },
      {
        url: livingPhoto,
        title: 'Full-Wall Living Room Entertainment Unit',
        caption: 'Floor-to-ceiling marble-veined media wall flanked by backlit open curio shelves and under-lit base cabinetry.',
        finish: 'Veined Marble Slab · Warm Oak Shelving',
      },
      {
        url: '/intro-frames/frame_100.webp',
        title: 'Architectural Media & Living Feature Wall',
        caption: 'Balanced media paneling seamlessly extending into warm timber wall treatments and minimalist floating storage.',
        finish: 'Textured Stone · Concealed Profile LED',
      },
    ],
  },
  {
    slug: 'crockery-unit',
    title: 'Crockery Unit',
    subtitle: 'Illuminated Dining Storage & Display',
    overview:
      'Sophisticated dining cabinets blending clear or fluted glass upper display shutters with deep lower drawers for dinnerware, serving platters, and appliances.',
    coverImage: crockImage,
    highlights: [
      'Fluted, Clear & Tinted Glass Shutters',
      'Warm Internal Cabinet LED Strips',
      'Dedicated Serving Counter Niche',
      'Soft-Close Cutlery & Platter Drawers',
    ],
    photos: [
      {
        url: crockImage,
        title: 'Classic Lit Glass-Front Crockery Showcase',
        caption: 'Warm illuminated glass shelves showcasing fine tableware above deep closed lower storage cabinets.',
        finish: 'Walnut Woodgrain · Clear Tempered Glass',
      },
      {
        url: crockeryBarShowcase,
        title: 'Fluted Glass Dining Crockery & Bar Partition',
        caption: 'Full-height smoked fluted glass display tower framing a central lit marble serving counter beside dining.',
        finish: 'Tinted Reeded Glass · Matte Oak & Brass Trim',
      },
      {
        url: p6Image,
        title: 'Coordinated Dining Zone Cabinetry',
        caption: 'Open dining spatial planning with warm overhead lighting, marble flooring, and seamless storage integration.',
        finish: 'Satin Laminate · Warm Cove Ceiling',
      },
      {
        url: budgetPlannerHero,
        title: 'Integrated Oak Dining Storage Wall',
        caption: 'Floor-to-ceiling timber pantry and crockery cabinetry keeping the dining nook calm and clutter-free.',
        finish: 'Natural Oak Veneer · Handleless Joinery',
      },
    ],
  },
  {
    slug: 'bar-cabinet',
    title: 'Bar Cabinet',
    subtitle: 'Bespoke Home Bars & Entertaining Counters',
    overview:
      'Custom entertaining units featuring stemware racks, bottle organizers, backlit stone backsplashes, tinted mirror accents, and compact or full-lounge layouts.',
    coverImage: barrImage,
    highlights: [
      'Backlit Onyx & Stone Counter Niches',
      'Overhead Brass Stemware Hanging Racks',
      'Smoked Mirror & Fluted Timber Backdrops',
      'Pull-Out Wine & Mixer Storage Drawers',
    ],
    photos: [
      {
        url: barCabinetLounge,
        title: 'Fluted Walnut & Backlit Onyx Home Bar',
        caption: 'Full entertaining counter with dark fluted walnut paneling, glowing onyx backsplash, brass glass rack, and velvet stools.',
        finish: 'Fluted Walnut · Backlit Onyx & Smoked Mirror',
      },
      {
        url: barrImage,
        title: 'Compact Corner Living Room Bar Cabinet',
        caption: 'Space-smart tall bar cabinet with integrated bottle compartments, lit display niche, and concealed lower storage.',
        finish: 'Matte Charcoal · Warm Oak Interior Glow',
      },
      {
        url: crockeryBarShowcase,
        title: 'Dual Dining Crockery & Beverage Station',
        caption: 'Floor-to-ceiling fluted glass showcase with brass sink prep niche and illuminated spirits shelving.',
        finish: 'Reeded Glass · Marble Prep Counter',
      },
      {
        url: livingPhoto,
        title: 'Evening Lounge Entertaining Setup',
        caption: 'Warm architectural lighting and plush seating crafted to anchor sophisticated evening hosting.',
        finish: 'Warm Gold Lighting · Textured Neutrals',
      },
    ],
  },
  {
    slug: 'wall-decor',
    title: 'Wall Decor',
    subtitle: 'Accent Walls, Mouldings & Sculptural Panels',
    overview:
      'Signature focal walls crafted with classic French mouldings, fluted wood louvers, custom wallpapers, 3D sculptural reliefs, and grazing architectural light.',
    coverImage: wallImage,
    highlights: [
      'Classic Wall Moulding & Wainscoting',
      '3D Sculptural & CNC-Cut Accent Panels',
      'WPC / Timber Louvers & Stone Veneers',
      'Wall Sconces & Grazing Strip Illumination',
    ],
    photos: [
      {
        url: wallImage,
        title: 'Textured Louver & Concealed-Light Feature Wall',
        caption: 'Architectural wall paneling combining vertical flutes, warm indirect LED grazing, and minimalist styling.',
        finish: 'Timber Louvers · Warm Indirect LED',
      },
      {
        url: p1Image,
        title: '3D Gold Geometric & Fluted Foyer Wall',
        caption: 'Completed Kolkata foyer featuring 3D faceted gold tiles, vertical cream louvers, and crisp timber ceiling slats.',
        finish: '3D Metallic Faceted Tiles · Fluted Panel & Cove',
      },
      {
        url: p4Image,
        title: 'Classic Wall Mouldings & Botanical Wallpaper',
        caption: 'Custom wall beading framing a delicate floral accent panel flanked by warm amber glass wall sconces.',
        finish: 'Ivory Moulding Frames · Designer Wallpaper',
      },
      {
        url: intPhoto,
        title: 'Backlit Sculptural Floral Relief Wall',
        caption: 'Curved backlit plaster arch with delicate gold botanical relief flowing into vertical fluted wall paneling.',
        finish: '3D Plaster Relief · Brushed Gold & Timber Slats',
      },
    ],
  },
];

export const getShowcaseGalleryBySlug = (slug: string | null): ShowcaseGalleryCategory | null => {
  if (!slug) return null;
  return SHOWCASE_GALLERIES.find((item) => item.slug === slug) || null;
};
