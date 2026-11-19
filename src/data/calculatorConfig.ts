import heroImg from '../assets/images/budget_planner_hero_1794732665670.jpg';
import apartmentImg from '../assets/images/property_apartment_1794732666449.jpg';
import duplexImg from '../assets/images/property_duplex_1794732666909.jpg';
import villaImg from '../assets/images/property_villa_1794732667225.jpg';
import penthouseImg from '../assets/images/property_penthouse_1795075583390.jpg';

export type PropertyType = 'apartment' | 'duplex' | 'villa' | 'other';
export type BhkOption = '1bhk' | '2bhk' | '3bhk' | '4bhk' | '5bhk+';
export type PropertyLocation = 'Kolkata' | 'New Town' | 'Rajarhat' | 'Salt Lake' | 'Howrah' | 'Other';
export type PropertyStatus = 'new-possession' | 'under-construction' | 'existing-home';
export type ProjectType = 'complete-new' | 'partial' | 'renovation';

export type KitchenShape = 'straight' | 'l-shape' | 'u-shape' | 'parallel' | 'island';
export type KitchenFinishOption =
  | 'laminate-matt'
  | 'laminate-gloss'
  | 'membrane'
  | 'anti-scratch-acrylic'
  | 'pu-finish';

export type BedTypeOption = 'none' | 'queen' | 'king' | 'single' | 'hydraulic-king';
export type CeilingProfileOption = 'normal' | 'peripheral';
export type CeilingDesignOption = 'plain' | 'design';
export type WashroomRenovationOption = 'none' | 'wall-tiles' | 'floor-tiles' | 'both';

export type AdditionalServiceId =
  | 'flooring'
  | 'plumbing'
  | 'civil'
  | 'custom-furniture';

export interface RoomSelections {
  kitchen: {
    enabled: boolean;
    shape: KitchenShape;
    finish: KitchenFinishOption;
    structure: {
      wallUnit: boolean;
      baseUnit: boolean;
      loft: boolean;
      dadoTiles: boolean;
      counterTop: boolean;
      chimney: boolean;
      hob: boolean;
      sink: boolean;
      aquaguard: boolean;
    };
  };
  rooms: {
    enabled: boolean;
    counts: {
      masterRoom: number;
      kidsRoom: number;
      pujaRoom: number;
      guestRoom: number;
    };
    bedType: BedTypeOption;
    items: {
      sideTable: boolean;
      wardrobe: boolean;
      tvUnit: boolean;
      dressingUnit: boolean;
      consoleTable: boolean;
      studyUnit: boolean;
    };
  };
  paint: {
    enabled: boolean;
    fullHousePaint: boolean;
  };
  falseCeiling: {
    enabled: boolean;
    areas: {
      living: boolean;
      dining: boolean;
      rooms: boolean;
      washroom: boolean;
    };
    profile: CeilingProfileOption;
    design: CeilingDesignOption;
  };
  electrical: {
    enabled: boolean;
    items: {
      ceilingLights: boolean;
      cabinetLights: boolean;
      wallLights: boolean;
      fan: boolean;
    };
  };
  washroom: {
    enabled: boolean;
    count: number;
    vanity: boolean;
    ledMirrorWithStorage: boolean;
    renovation: WashroomRenovationOption;
    showerPartition: boolean;
    sanitaryFittings: boolean;
  };
  living: {
    enabled: boolean;
    chairsCount: number;
    items: {
      tvUnit: boolean;
      sofa: boolean;
      crockery: boolean;
      shoeCabinet: boolean;
      accentWall: boolean;
      centreTable: boolean;
      diningTable: boolean;
      chairs: boolean;
      barCabinet: boolean;
      bookShelf: boolean;
    };
  };
}

export interface PlannerState {
  // Step 1 — Home
  propertyType: PropertyType;
  bhk: BhkOption;
  carpetArea: number;
  location: PropertyLocation;
  customLocation: string;
  propertyStatus: PropertyStatus;
  projectType: ProjectType;
  // Step 2 — Spaces
  rooms: RoomSelections;
  // Step 3 — Services
  additionalServices: Record<AdditionalServiceId, boolean>;
  plumbingWashrooms: number;
  needDesignGuidance: boolean;
}

export interface BreakdownLine {
  id: string;
  label: string;
  detail: string;
  pricingBasis: string;
  minAmount: number;
  maxAmount: number;
}

export interface EstimateOutput {
  minTotal: number;
  maxTotal: number;
  timeline: string;
  breakdown: BreakdownLine[];
  includedItems: string[];
  excludedItems: string[];
  scopeSummary: { label: string; value: string }[];
  summaryText: string;
}

export const PLANNER_MEDIA = {
  hero: heroImg,
  apartment: apartmentImg,
  duplex: duplexImg,
  villa: villaImg,
};

export const PROPERTY_TYPE_OPTIONS: {
  id: PropertyType;
  label: string;
  subtitle: string;
  image?: string;
}[] = [
  {
    id: 'apartment',
    label: 'Apartment',
    subtitle: 'Urban flats & high-rise residences',
    image: apartmentImg,
  },
  {
    id: 'duplex',
    label: 'Duplex',
    subtitle: 'Two-level interconnected residences',
    image: duplexImg,
  },
  {
    id: 'villa',
    label: 'Villa',
    subtitle: 'Independent houses & bungalows',
    image: villaImg,
  },
  {
    id: 'other',
    label: 'Other / Penthouse',
    subtitle: 'Custom layouts & studio residences',
    image: penthouseImg,
  },
];

export const BHK_PRESETS: Record<
  BhkOption,
  {
    label: string;
    defaultArea: number;
    masterCount: number;
    kidsCount: number;
    guestCount: number;
    bathroomCount: number;
    timeline: string;
  }
> = {
  '1bhk': {
    label: '1 BHK',
    defaultArea: 600,
    masterCount: 1,
    kidsCount: 0,
    guestCount: 0,
    bathroomCount: 1,
    timeline: '35–45 Days Delivery',
  },
  '2bhk': {
    label: '2 BHK',
    defaultArea: 1000,
    masterCount: 1,
    kidsCount: 1,
    guestCount: 0,
    bathroomCount: 2,
    timeline: '45–60 Days Delivery',
  },
  '3bhk': {
    label: '3 BHK',
    defaultArea: 1450,
    masterCount: 1,
    kidsCount: 1,
    guestCount: 1,
    bathroomCount: 2,
    timeline: '60–75 Days Delivery',
  },
  '4bhk': {
    label: '4 BHK',
    defaultArea: 2050,
    masterCount: 1,
    kidsCount: 2,
    guestCount: 1,
    bathroomCount: 3,
    timeline: '75–90 Days Delivery',
  },
  '5bhk+': {
    label: '5 BHK+',
    defaultArea: 2800,
    masterCount: 2,
    kidsCount: 2,
    guestCount: 1,
    bathroomCount: 4,
    timeline: '90+ Days Delivery',
  },
};

export const LOCATION_OPTIONS: PropertyLocation[] = [
  'Kolkata',
  'New Town',
  'Rajarhat',
  'Salt Lake',
  'Howrah',
  'Other',
];

export const PROPERTY_STATUS_OPTIONS: { id: PropertyStatus; label: string }[] = [
  { id: 'new-possession', label: 'New possession' },
  { id: 'under-construction', label: 'Under construction' },
  { id: 'existing-home', label: 'Existing home' },
];

export const PROJECT_TYPE_OPTIONS: { id: ProjectType; label: string }[] = [
  { id: 'complete-new', label: 'Complete new interior' },
  { id: 'partial', label: 'Partial interior' },
  { id: 'renovation', label: 'Renovation' },
];

export const KITCHEN_FINISH_OPTIONS: Record<
  KitchenFinishOption,
  { label: string; baseCost: number }
> = {
  'laminate-matt': { label: 'Laminate (Matt)', baseCost: 15000 },
  'laminate-gloss': { label: 'Laminate (Gloss)', baseCost: 15000 },
  membrane: { label: 'Membrane', baseCost: 25000 },
  'anti-scratch-acrylic': { label: 'Anti-Scratch Acrylic', baseCost: 30000 },
  'pu-finish': { label: 'PU Finish', baseCost: 40000 },
};

export const BED_TYPE_OPTIONS: Record<
  BedTypeOption,
  { label: string; unitCost: number }
> = {
  none: { label: 'No Bed Required', unitCost: 0 },
  single: { label: 'Single / Kids Bed', unitCost: 40000 },
  queen: { label: 'Queen Size Bed', unitCost: 60000 },
  king: { label: 'King Size Bed', unitCost: 65000 },
  'hydraulic-king': { label: 'King Hydraulic Storage Bed', unitCost: 75000 },
};

export const WASHROOM_RENOVATION_OPTIONS: Record<
  WashroomRenovationOption,
  { label: string; perBathCost: number }
> = {
  none: { label: 'No Civil Tile Renovation', perBathCost: 0 },
  'wall-tiles': { label: 'Wall Tiles Only', perBathCost: 36000 },
  'floor-tiles': { label: 'Floor Tiles Only', perBathCost: 24000 },
  both: { label: 'Both (Wall & Floor Tiles)', perBathCost: 60000 },
};

export const ADDITIONAL_SERVICES_LIST: {
  id: AdditionalServiceId;
  label: string;
  description: string;
  pricingBasis: string;
}[] = [
  {
    id: 'flooring',
    label: 'Flooring',
    description: 'Vitrified tiles, SPC, and wooden flooring replacement',
    pricingBasis: 'Calculated based on total carpet area',
  },
  {
    id: 'plumbing',
    label: 'Plumbing',
    description: 'Pipe routing, concealed cisterns and pressure fittings',
    pricingBasis: 'Calculated based on number of washrooms',
  },
  {
    id: 'civil',
    label: 'Civil & Renovation Work',
    description: 'Demolition, masonry modifications & debris disposal',
    pricingBasis: 'Calculated based on property size & scope',
  },
  {
    id: 'custom-furniture',
    label: 'Custom Furniture',
    description: 'Handcrafted accent seating & bespoke solid-wood pieces',
    pricingBasis: 'Calculated based on bespoke furniture scope',
  },
];

export const KITCHEN_SHAPE_INFO: Record<KitchenShape, { label: string }> = {
  straight: { label: 'Straight' },
  'l-shape': { label: 'L-Shape' },
  'u-shape': { label: 'U-Shape' },
  parallel: { label: 'Parallel' },
  island: { label: 'Island' },
};

export function createInitialPlannerState(bhk: BhkOption = '2bhk'): PlannerState {
  const preset = BHK_PRESETS[bhk];
  return {
    propertyType: 'apartment',
    bhk,
    carpetArea: preset.defaultArea,
    location: 'Kolkata',
    customLocation: '',
    propertyStatus: 'new-possession',
    projectType: 'complete-new',
    rooms: {
      kitchen: {
        enabled: true,
        shape: 'l-shape',
        finish: 'laminate-matt',
        structure: {
          wallUnit: true,
          baseUnit: true,
          loft: true,
          dadoTiles: true,
          counterTop: true,
          chimney: true,
          hob: true,
          sink: true,
          aquaguard: false,
        },
      },
      rooms: {
        enabled: true,
        counts: {
          masterRoom: preset.masterCount,
          kidsRoom: preset.kidsCount,
          pujaRoom: 0,
          guestRoom: preset.guestCount,
        },
        bedType: 'queen',
        items: {
          sideTable: true,
          wardrobe: true,
          tvUnit: true,
          dressingUnit: true,
          consoleTable: false,
          studyUnit: false,
        },
      },
      paint: {
        enabled: true,
        fullHousePaint: true,
      },
      falseCeiling: {
        enabled: true,
        areas: {
          living: true,
          dining: true,
          rooms: true,
          washroom: false,
        },
        profile: 'normal',
        design: 'plain',
      },
      electrical: {
        enabled: true,
        items: {
          ceilingLights: true,
          cabinetLights: true,
          wallLights: true,
          fan: true,
        },
      },
      washroom: {
        enabled: true,
        count: preset.bathroomCount,
        vanity: true,
        ledMirrorWithStorage: true,
        renovation: 'none',
        showerPartition: false,
        sanitaryFittings: false,
      },
      living: {
        enabled: true,
        chairsCount: 4,
        items: {
          tvUnit: true,
          sofa: true,
          crockery: bhk !== '1bhk',
          shoeCabinet: true,
          accentWall: true,
          centreTable: true,
          diningTable: false,
          chairs: false,
          barCabinet: false,
          bookShelf: false,
        },
      },
    },
    additionalServices: {
      flooring: false,
      plumbing: false,
      civil: false,
      'custom-furniture': false,
    },
    plumbingWashrooms: preset.bathroomCount,
    needDesignGuidance: false,
  };
}

export function formatINRFull(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatINRLakhs(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    const trimmed = Number.isInteger(lakhs * 10) ? lakhs.toFixed(1) : lakhs.toFixed(2);
    return `₹${trimmed}L`;
  }
  return formatINRFull(amount);
}

export function calculateHomeBudget(state: PlannerState): EstimateOutput {
  const breakdown: BreakdownLine[] = [];
  const addLine = (
    id: string,
    label: string,
    detail: string,
    pricingBasis: string,
    exactCost: number
  ) => {
    if (exactCost <= 0) return;
    const rounded = Math.round(exactCost);
    breakdown.push({
      id,
      label,
      detail,
      pricingBasis,
      minAmount: rounded,
      maxAmount: rounded,
    });
  };

  // 1. MODULAR KITCHEN (Fixed unit pricing)
  const kitchenFinishInfo = KITCHEN_FINISH_OPTIONS[state.rooms.kitchen.finish];
  if (state.rooms.kitchen.enabled) {
    const k = state.rooms.kitchen;
    let kitchenCost = 0;
    const parts: string[] = [];

    if (k.structure.wallUnit) {
      kitchenCost += 30000;
      parts.push('Wall unit');
    }
    if (k.structure.baseUnit) {
      kitchenCost += 40000;
      parts.push('Base unit');
    }
    if (k.structure.loft) {
      kitchenCost += 10000;
      parts.push('Loft');
    }
    if (k.structure.counterTop) {
      kitchenCost += 20000;
      parts.push('Granite / Counter top');
    }
    if (k.structure.dadoTiles) {
      kitchenCost += 12000;
      parts.push('Dado tiles');
    }
    if (k.structure.chimney) {
      kitchenCost += 25000;
      parts.push('Chimney');
    }
    if (k.structure.hob) {
      kitchenCost += 35000;
      parts.push('Hob');
    }
    if (k.structure.sink) {
      kitchenCost += 12000;
      parts.push('Sink');
    }
    if (k.structure.aquaguard) {
      kitchenCost += 20000;
      parts.push('Aquaguard');
    }

    // Apply Shutter Finish cost (Laminate 15k, Membrane 25k, Acrylic 30k, PU 40k)
    const hasCabinetry = k.structure.wallUnit || k.structure.baseUnit || k.structure.loft;
    if (hasCabinetry) {
      kitchenCost += kitchenFinishInfo.baseCost;
    }

    if (kitchenCost > 0) {
      addLine(
        'kitchen',
        'Modular Kitchen',
        `${KITCHEN_SHAPE_INFO[k.shape].label} · ${kitchenFinishInfo.label} — ${parts.join(', ')}`,
        'Structure units + kitchen finish allowance',
        kitchenCost
      );
    }
  }

  // 2. ROOMS (Bed 60k, Wardrobe 40k, TV Unit 25k, Dressing Unit 20k, Console 10k, Study 25k, Side Table 10k)
  if (state.rooms.rooms.enabled) {
    const rm = state.rooms.rooms;
    const sleepingRooms = rm.counts.masterRoom + rm.counts.kidsRoom + rm.counts.guestRoom;
    const totalRooms = sleepingRooms + rm.counts.pujaRoom;
    let roomsCost = 0;
    const roomCountLabels: string[] = [];
    const itemLabels: string[] = [];

    if (rm.counts.masterRoom > 0) roomCountLabels.push(`${rm.counts.masterRoom} Master`);
    if (rm.counts.kidsRoom > 0) roomCountLabels.push(`${rm.counts.kidsRoom} Kids`);
    if (rm.counts.pujaRoom > 0) roomCountLabels.push(`${rm.counts.pujaRoom} Puja`);
    if (rm.counts.guestRoom > 0) roomCountLabels.push(`${rm.counts.guestRoom} Guest`);

    if (rm.counts.pujaRoom > 0) {
      roomsCost += rm.counts.pujaRoom * 25000;
    }

    if (rm.bedType !== 'none' && sleepingRooms > 0) {
      const bedInfo = BED_TYPE_OPTIONS[rm.bedType];
      roomsCost += sleepingRooms * bedInfo.unitCost;
      itemLabels.push(`${bedInfo.label} (×${sleepingRooms})`);
    }
    if (rm.items.sideTable && sleepingRooms > 0) {
      roomsCost += sleepingRooms * 10000;
      itemLabels.push(`Side table (×${sleepingRooms})`);
    }
    if (rm.items.wardrobe && sleepingRooms > 0) {
      roomsCost += sleepingRooms * 40000;
      itemLabels.push(`Wardrobe (×${sleepingRooms})`);
    }
    if (rm.items.tvUnit) {
      roomsCost += 25000;
      itemLabels.push('TV unit');
    }
    if (rm.items.dressingUnit) {
      const dressCount = Math.max(1, rm.counts.masterRoom || 1);
      roomsCost += dressCount * 20000;
      itemLabels.push('Dressing unit');
    }
    if (rm.items.consoleTable) {
      roomsCost += 10000;
      itemLabels.push('Console table');
    }
    if (rm.items.studyUnit) {
      const studyCount = Math.max(1, rm.counts.kidsRoom || 1);
      roomsCost += studyCount * 25000;
      itemLabels.push('Study unit');
    }

    if (roomsCost > 0 && totalRooms > 0) {
      addLine(
        'rooms',
        'Rooms & Furniture',
        `${roomCountLabels.join(', ')}${itemLabels.length ? ` — ${itemLabels.join(', ')}` : ''}`,
        'Per room furniture & woodwork units',
        roomsCost
      );
    }
  }

  // 3. PAINT (₹150 per sq. ft. internal calculation)
  if (state.rooms.paint.enabled && state.rooms.paint.fullHousePaint) {
    addLine(
      'paint',
      'Paint — Full House Paint',
      `${state.carpetArea.toLocaleString('en-IN')} sq. ft. (putty, primer & emulsion finish)`,
      'Full house wall & ceiling paint coverage',
      state.carpetArea * 150
    );
  }

  // 4. FALSE CEILING (₹142 per sq. ft. internal calculation)
  if (state.rooms.falseCeiling.enabled) {
    const fc = state.rooms.falseCeiling;
    let ceilingSqft = 0;
    const areaLabels: string[] = [];

    if (fc.areas.living) {
      ceilingSqft += Math.round(state.carpetArea * 0.3);
      areaLabels.push('Living');
    }
    if (fc.areas.dining) {
      ceilingSqft += Math.round(state.carpetArea * 0.15);
      areaLabels.push('Dining');
    }
    if (fc.areas.rooms) {
      ceilingSqft += Math.round(state.carpetArea * 0.45);
      areaLabels.push('Rooms');
    }
    if (fc.areas.washroom) {
      ceilingSqft += Math.round(state.carpetArea * 0.1);
      areaLabels.push('Washroom');
    }

    if (ceilingSqft > 0) {
      const profileFactor = fc.profile === 'peripheral' ? 0.9 : 1.0;
      const designFactor = fc.design === 'design' ? 1.15 : 1.0;
      const rate = Math.round(142 * profileFactor * designFactor);
      const ceilingCost = ceilingSqft * rate;

      addLine(
        'false-ceiling',
        'False Ceiling',
        `${areaLabels.join(', ')} (~${ceilingSqft.toLocaleString('en-IN')} sq. ft.) · ${
          fc.profile === 'peripheral' ? 'Peripheral' : 'Normal'
        } · ${fc.design === 'design' ? 'Design False Ceiling' : 'Plain'}`,
        'Selected ceiling coverage & design profile',
        ceilingCost
      );
    }
  }

  // 5. ELECTRICAL (₹135 per sq. ft. internal calculation)
  if (state.rooms.electrical.enabled) {
    const el = state.rooms.electrical.items;
    let ratePerSqft = 0;
    const elParts: string[] = [];

    if (el.ceilingLights) {
      ratePerSqft += 45;
      elParts.push('Ceiling lights');
    }
    if (el.cabinetLights) {
      ratePerSqft += 30;
      elParts.push('Cabinet lights');
    }
    if (el.wallLights) {
      ratePerSqft += 30;
      elParts.push('Wall lights');
    }
    if (el.fan) {
      ratePerSqft += 30;
      elParts.push('Fan');
    }

    if (ratePerSqft > 0) {
      addLine(
        'electrical',
        'Electrical & Lighting Fixtures',
        `${elParts.join(', ')} (${state.carpetArea.toLocaleString('en-IN')} sq. ft.)`,
        'Selected lighting & fan fixtures',
        state.carpetArea * ratePerSqft
      );
    }
  }

  // 6. WASHROOM
  if (state.rooms.washroom.enabled && state.rooms.washroom.count > 0) {
    const wr = state.rooms.washroom;
    let perBath = 0;
    const wrParts: string[] = [];

    if (wr.vanity) {
      perBath += 20000;
      wrParts.push('Vanity');
    }
    if (wr.ledMirrorWithStorage) {
      perBath += 5000;
      wrParts.push('LED mirror with storage');
    }
    if (wr.renovation !== 'none') {
      perBath += WASHROOM_RENOVATION_OPTIONS[wr.renovation].perBathCost;
      wrParts.push(`Tile renovation: ${WASHROOM_RENOVATION_OPTIONS[wr.renovation].label}`);
    }
    if (wr.showerPartition) {
      perBath += 20000;
      wrParts.push('Shower partition');
    }
    if (wr.sanitaryFittings) {
      perBath += 50000;
      wrParts.push('Sanitary fittings');
    }

    if (perBath > 0) {
      addLine(
        'washroom',
        `Washroom (${wr.count} ${wr.count === 1 ? 'Unit' : 'Units'})`,
        wrParts.join(', '),
        'Per washroom units, tiling & fittings',
        perBath * wr.count
      );
    }
  }

  // 7. LIVING
  if (state.rooms.living.enabled) {
    const lv = state.rooms.living.items;
    let livingCost = 0;
    const lvParts: string[] = [];

    if (lv.tvUnit) {
      livingCost += 30000;
      lvParts.push('TV Unit');
    }
    if (lv.sofa) {
      livingCost += 35000;
      lvParts.push('Sofa');
    }
    if (lv.crockery) {
      livingCost += 35000;
      lvParts.push('Crockery');
    }
    if (lv.shoeCabinet) {
      livingCost += 15000;
      lvParts.push('Shoe Cabinet');
    }
    if (lv.accentWall) {
      livingCost += 25000;
      lvParts.push('Accent Wall / Design Wall');
    }
    if (lv.centreTable) {
      livingCost += 10000;
      lvParts.push('Centre Table');
    }
    if (lv.diningTable) {
      livingCost += 30000;
      lvParts.push('Dining Table');
    }
    if (lv.chairs) {
      const chCount = Math.max(1, state.rooms.living.chairsCount || 4);
      livingCost += chCount * 5000;
      lvParts.push(`Chairs (×${chCount})`);
    }
    if (lv.barCabinet) {
      livingCost += 30000;
      lvParts.push('Bar Cabinet');
    }
    if (lv.bookShelf) {
      livingCost += 20000;
      lvParts.push('Book Shelf');
    }

    if (livingCost > 0) {
      addLine(
        'living',
        'Living Area',
        lvParts.join(', '),
        'Per unit cabinetry, paneling & furniture',
        livingCost
      );
    }
  }

  // 8. ADDITIONAL SERVICES (Step 3)
  const area = state.carpetArea;
  const svc = state.additionalServices;

  if (svc.flooring) {
    addLine(
      'svc-flooring',
      'Flooring Replacement / SPC',
      `${area.toLocaleString('en-IN')} sq. ft. tiling / wooden / SPC flooring`,
      'Carpet area flooring scope',
      area * 180
    );
  }

  if (svc.plumbing) {
    const washroomCount = Math.max(1, state.plumbingWashrooms || 1);
    addLine(
      'svc-plumbing',
      `Plumbing (${washroomCount} ${washroomCount === 1 ? 'Washroom' : 'Washrooms'})`,
      `Pipe routing, concealed lines & pressure fittings across ${washroomCount} washroom(s)`,
      'Per washroom plumbing scope',
      washroomCount * 20000
    );
  }

  if (svc.civil) {
    const civilCost = Math.round((area * 100) / 5000) * 5000;
    addLine(
      'svc-civil',
      'Civil & Renovation Work',
      `Demolition, masonry modifications & debris disposal (${area.toLocaleString('en-IN')} sq. ft.)`,
      'Civil & structural modification scope',
      civilCost
    );
  }

  if (svc['custom-furniture']) {
    addLine(
      'svc-custom-furniture',
      'Custom Furniture',
      'Handcrafted bespoke seating, tables & accent pieces',
      'Bespoke furniture scope',
      85000
    );
  }

  const minTotal = breakdown.reduce((acc, item) => acc + item.minAmount, 0);
  const maxTotal = breakdown.reduce((acc, item) => acc + item.maxAmount, 0);

  const locationDisplay =
    state.location === 'Other' && state.customLocation.trim()
      ? state.customLocation.trim()
      : state.location;

  const propLabel =
    PROPERTY_TYPE_OPTIONS.find((p) => p.id === state.propertyType)?.label ?? 'Apartment';
  const statusLabel =
    PROPERTY_STATUS_OPTIONS.find((s) => s.id === state.propertyStatus)?.label ?? '';
  const projectLabel =
    PROJECT_TYPE_OPTIONS.find((p) => p.id === state.projectType)?.label ?? '';
  const timeline = BHK_PRESETS[state.bhk].timeline;

  const scopeSummary = [
    { label: 'Property Profile', value: `${BHK_PRESETS[state.bhk].label} ${propLabel}` },
    { label: 'Carpet Area', value: `${state.carpetArea.toLocaleString('en-IN')} sq. ft.` },
    { label: 'Location', value: locationDisplay },
    { label: 'Project Status', value: `${statusLabel} · ${projectLabel}` },
    {
      label: 'Kitchen Finish',
      value: state.rooms.kitchen.enabled
        ? `${KITCHEN_SHAPE_INFO[state.rooms.kitchen.shape].label} · ${kitchenFinishInfo.label}`
        : 'Not included',
    },
    {
      label: 'Plumbing Washrooms',
      value: svc.plumbing ? `${state.plumbingWashrooms} washroom(s)` : 'Not selected',
    },
    { label: 'Estimated Timeline', value: timeline },
  ];

  const includedItems = [
    'Space planning, layout options & 3D interior visualization',
    'Factory-precision modular woodwork & on-site supervision',
    'Specified installation, civil/MEP coordination & quality inspection',
    'Dedicated Kolkata site coordinator through handover',
  ];

  const excludedItems = [
    'Loose electronics/appliances (refrigerator, TV, AC) unless noted',
    'Applicable GST as per prevailing government regulations',
    'Society security deposits, lift usage fees, or external structural changes',
    ...(state.needDesignGuidance ? ['Pending on-site assessment for optional civil/MEP scope'] : []),
  ];

  const selectedRoomLabels = breakdown.map((b) => b.label).join(', ');

  const summaryText = [
    `Hello NRB DESIGN, I completed the NRB Home Budget Planner and would like a consultation:`,
    `• Home: ${BHK_PRESETS[state.bhk].label} ${propLabel} (${state.carpetArea} sq. ft.) in ${locationDisplay}`,
    `• Status / Type: ${statusLabel} · ${projectLabel}`,
    `• Selected Spaces & Works: ${selectedRoomLabels || 'Custom scope'}`,
    state.rooms.kitchen.enabled ? `• Kitchen Finish: ${kitchenFinishInfo.label} (${KITCHEN_SHAPE_INFO[state.rooms.kitchen.shape].label})` : '',
    svc.plumbing ? `• Plumbing Scope: ${state.plumbingWashrooms} washroom(s)` : '',
    state.needDesignGuidance ? `• Requested Guidance: Not sure about additional services — would like NRB DESIGN guidance.` : '',
    `• Indicative Budget Estimate: ${formatINRFull(minTotal)} (${formatINRLakhs(minTotal)})`,
  ]
    .filter(Boolean)
    .join('\n');

  return {
    minTotal,
    maxTotal,
    timeline,
    breakdown,
    includedItems,
    excludedItems,
    scopeSummary,
    summaryText,
  };
}
