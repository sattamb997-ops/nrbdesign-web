import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  HelpCircle,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  User,
} from 'lucide-react';
import {
  db,
  collection,
  addDoc,
  serverTimestamp,
  OperationType,
  handleFirestoreError,
} from '../firebase';
import {
  ADDITIONAL_SERVICES_LIST,
  AdditionalServiceId,
  BED_TYPE_OPTIONS,
  BHK_PRESETS,
  BhkOption,
  BedTypeOption,
  CeilingDesignOption,
  CeilingProfileOption,
  KITCHEN_FINISH_OPTIONS,
  KITCHEN_SHAPE_INFO,
  KitchenFinishOption,
  KitchenShape,
  LOCATION_OPTIONS,
  PLANNER_MEDIA,
  PROJECT_TYPE_OPTIONS,
  PROPERTY_STATUS_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  PlannerState,
  WASHROOM_RENOVATION_OPTIONS,
  WashroomRenovationOption,
  calculateHomeBudget,
  createInitialPlannerState,
  formatINRFull,
  formatINRLakhs,
} from '../data/calculatorConfig';
import { generateBudgetPdf } from '../utils/generateBudgetPdf';

import p2Image from '../../P2.png';
import p3Image from '../../P3.png';
import p5Image from '../../P5.png';
import kitchhImage from '../../kitchh.jpg';
import intImage from '../../int.jpg';
import roomImage from '../../room.png';
import paintImage from '../../paint.png';
import falseCeilingImage from '../../false ceiling.png';
import electricalImage from '../../electrical.png';
import washroomImage from '../../washroom.png';
import livingImage from '../../living.png';

interface BudgetCalculatorProps {
  onBookWithEstimate: (
    summaryText: string,
    contact?: { name: string; phone: string; email: string }
  ) => void;
}

const STEP_META = [
  { num: 1, code: '01', label: 'Home' },
  { num: 2, code: '02', label: 'Spaces' },
  { num: 3, code: '03', label: 'Services' },
  { num: 4, code: '04', label: 'Estimate' },
];

const SERVICE_IMAGES: Record<AdditionalServiceId, string> = {
  flooring: p2Image,
  plumbing: p3Image,
  civil: intImage,
  'custom-furniture': p5Image,
};

const createSessionId = () =>
  `nrb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({ onBookWithEstimate }) => {
  const [state, setState] = useState<PlannerState>(() => createInitialPlannerState('2bhk'));
  const [step, setStep] = useState<number>(1);
  const [kitchenStructureOpen, setKitchenStructureOpen] = useState(true);
  const [kitchenFinishOpen, setKitchenFinishOpen] = useState(true);

  // Mandatory Client Contact Details (Required to use & advance in the Budget Calculator)
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [contactError, setContactError] = useState('');

  // Step 4 Inline Quotation Lead Form state
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [leadNotes, setLeadNotes] = useState('');
  const [leadConsent, setLeadConsent] = useState(true);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState('');

  const wizardRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const sessionIdRef = useRef<string>(createSessionId());
  const lastSavedSignatureRef = useRef<string>('');
  const hasInteractedRef = useRef<boolean>(false);

  const estimate = useMemo(() => calculateHomeBudget(state), [state]);

  const validateContact = useCallback(
    (nameVal = clientName, phoneVal = clientPhone): {
      valid: boolean;
      error: string;
      focusField: 'name' | 'phone' | null;
    } => {
      const trimmedName = nameVal.trim();
      const digitsOnly = phoneVal.replace(/\D/g, '');

      if (trimmedName.length < 2) {
        return {
          valid: false,
          error: 'Please enter your full name (at least 2 characters) to use the budget calculator.',
          focusField: 'name',
        };
      }
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return {
          valid: false,
          error: 'Please enter a valid 10-digit mobile / WhatsApp number to use the budget calculator.',
          focusField: 'phone',
        };
      }
      return { valid: true, error: '', focusField: null };
    },
    [clientName, clientPhone]
  );

  const savePlannerSnapshot = useCallback(
    async (stage: string, force = false) => {
      const check = validateContact();
      if (!check.valid) return;

      const normalizedCarpetArea = Math.round(
        Math.max(100, Math.min(20000, Number(state.carpetArea) || 950))
      );
      const normalizedWashrooms = Math.round(
        Math.max(1, Math.min(20, Number(state.plumbingWashrooms) || 2))
      );

      const coreSnapshot = {
        name: clientName.trim().slice(0, 120),
        phone: clientPhone.trim().slice(0, 30),
        email: clientEmail.trim().slice(0, 160),
        notes: leadNotes.trim().slice(0, 1000),
        homeProfile: {
          propertyType: state.propertyType,
          bhk: state.bhk,
          carpetArea: normalizedCarpetArea,
          location: state.location,
          customLocation: state.customLocation.trim().slice(0, 120),
          propertyStatus: state.propertyStatus,
          projectType: state.projectType,
        },
        rooms: state.rooms,
        additionalServices: state.additionalServices,
        plumbingWashrooms: normalizedWashrooms,
        needDesignGuidance: Boolean(state.needDesignGuidance),
      };

      const signature = JSON.stringify({
        ...coreSnapshot,
        milestone: force ? stage : 'sync',
      });

      if (!force && signature === lastSavedSignatureRef.current) {
        return;
      }
      lastSavedSignatureRef.current = signature;

      const payload = {
        sessionId: sessionIdRef.current.slice(0, 80),
        stage: stage.slice(0, 50),
        ...coreSnapshot,
        estimate: {
          minTotal: estimate.minTotal,
          maxTotal: estimate.maxTotal,
          timeline: estimate.timeline.slice(0, 120),
          scopeSummary: estimate.scopeSummary.slice(0, 30),
          breakdown: estimate.breakdown.slice(0, 30),
          summaryText: estimate.summaryText.slice(0, 6000),
        },
        createdAt: serverTimestamp(),
      };

      try {
        await addDoc(collection(db, 'budget_calculations'), payload);
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.CREATE, 'budget_calculations');
        } catch {
          // Non-blocking background persistence log
        }
      }
    },
    [clientName, clientPhone, clientEmail, leadNotes, state, estimate, validateContact]
  );

  // Automatically persist selection updates after 2.5s whenever valid Name & Phone are filled
  useEffect(() => {
    if (!hasInteractedRef.current && step === 1) return;
    const check = validateContact();
    if (!check.valid) return;

    const timer = window.setTimeout(() => {
      void savePlannerSnapshot(`step${step}-auto-saved`, false);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [state, clientName, clientPhone, clientEmail, step, validateContact, savePlannerSnapshot]);

  const scrollToWizard = () => {
    wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const focusContactSection = (focusField: 'name' | 'phone' | null = 'name') => {
    setStep(1);
    setTimeout(() => {
      contactSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (focusField === 'phone') {
        phoneInputRef.current?.focus();
      } else {
        nameInputRef.current?.focus();
      }
    }, 60);
  };

  const goToStep = (nextStep: number) => {
    const clamped = Math.max(1, Math.min(4, nextStep));

    if (clamped > 1) {
      const check = validateContact();
      if (!check.valid) {
        setContactError(check.error);
        focusContactSection(check.focusField);
        return;
      }
      setContactError('');
      hasInteractedRef.current = true;
      if (step === 1) {
        void savePlannerSnapshot('step1-completed', true);
      } else if (clamped === 4) {
        void savePlannerSnapshot('estimate-viewed', true);
      } else {
        void savePlannerSnapshot(`step${clamped}-entered`, false);
      }
    } else if (step > 1 && validateContact().valid) {
      void savePlannerSnapshot(`step${step}-updated`, false);
    }

    setStep(clamped);
    setTimeout(() => {
      wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 40);
  };

  const handleSelectBhk = (bhk: BhkOption) => {
    hasInteractedRef.current = true;
    const preset = BHK_PRESETS[bhk];
    setState((prev) => ({
      ...prev,
      bhk,
      carpetArea: preset.defaultArea,
      plumbingWashrooms: preset.bathroomCount,
      rooms: {
        ...prev.rooms,
        rooms: {
          ...prev.rooms.rooms,
          counts: {
            ...prev.rooms.rooms.counts,
            masterRoom: preset.masterCount,
            kidsRoom: preset.kidsCount,
            guestRoom: preset.guestCount,
          },
        },
        washroom: {
          ...prev.rooms.washroom,
          count: preset.bathroomCount,
        },
      },
    }));
  };

  const handleReset = () => {
    setState(createInitialPlannerState('2bhk'));
    setStep(1);
    setKitchenStructureOpen(true);
    setKitchenFinishOpen(true);
    setLeadSuccess(false);
    setLeadError('');
    setContactError('');
    setShowQuoteForm(false);
    sessionIdRef.current = createSessionId();
    lastSavedSignatureRef.current = '';
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateContact();
    if (!check.valid) {
      setLeadError(check.error);
      return;
    }
    if (!leadConsent) {
      setLeadError('Please confirm permission for NRB DESIGN to contact you.');
      return;
    }

    setLeadSubmitting(true);
    setLeadError('');

    const fullMessage = [
      `[NRB HOME BUDGET PLANNER - DETAILED QUOTATION REQUEST]`,
      estimate.summaryText,
      leadNotes.trim() ? `Client Notes: ${leadNotes.trim()}` : '',
      `Consent to contact via Phone/WhatsApp: Yes`,
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      await savePlannerSnapshot('quote-submitted', true);
      await addDoc(collection(db, 'consultations'), {
        name: clientName.trim().slice(0, 120),
        email: clientEmail.trim().slice(0, 160) || 'Not provided',
        phone: clientPhone.trim().slice(0, 30),
        message: fullMessage.slice(0, 5000),
        createdAt: serverTimestamp(),
      });
      setLeadSuccess(true);
      setLeadNotes('');
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, 'consultations');
      } catch {
        // Caught after logging structured FirestoreErrorInfo
      }
      setLeadError('Unable to submit right now. Please try WhatsApp or the consultation form below.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const contactDetailsPrefix = clientName.trim()
    ? `Name: ${clientName.trim()} | Phone: ${clientPhone.trim()}\n`
    : '';
  const whatsappUrl = `https://wa.me/918240019657?text=${encodeURIComponent(
    `${contactDetailsPrefix}${estimate.summaryText}`
  )}`;

  const selectedSpacesCount = [
    state.rooms.kitchen.enabled,
    state.rooms.rooms.enabled,
    state.rooms.paint.enabled,
    state.rooms.falseCeiling.enabled,
    state.rooms.electrical.enabled,
    state.rooms.washroom.enabled,
    state.rooms.living.enabled,
  ].filter(Boolean).length;

  const selectedServicesCount = Object.values(state.additionalServices).filter(Boolean).length;

  const activeLocationLabel =
    state.location === 'Other' && state.customLocation.trim()
      ? state.customLocation.trim()
      : state.location;

  return (
    <section
      id="budget-calculator"
      className="py-20 md:py-28 px-4 md:px-10 bg-[#f7f5f2] border-t border-[#eae6df] scroll-mt-16"
    >
      <div className="max-w-[1280px] mx-auto space-y-12 md:space-y-16">
        {/* HERO ENTRY BANNER */}
        <div className="bg-[#242321] text-[#f7f5f2] rounded-2xl overflow-hidden border border-[#3a3532] shadow-lg">
          <div className="grid lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-6 p-8 sm:p-10 md:p-14 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.26em] text-[#c5a46d] font-bold">
                  NRB DESIGN PRESENTS
                </p>
                <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl md:text-5xl text-white leading-tight text-balance">
                  NRB HOME BUDGET PLANNER
                </h2>
                <p className="font-['Playfair_Display',serif] text-lg sm:text-xl text-[#ebd59d] italic">
                  Plan Your Dream Home. Understand Your Investment.
                </p>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed pt-2 max-w-xl">
                  A smarter way to plan your home interiors. Select your requirements, explore design collections and discover an indicative investment tailored for your home in Kolkata &amp; beyond.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    scrollToWizard();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#c5a46d] hover:bg-[#b3957b] text-[#1a1817] font-bold text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-xl transition-colors cursor-pointer whitespace-nowrap min-h-[48px]"
                >
                  <span>CALCULATE YOUR HOME BUDGET</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#c5a46d]/90 font-semibold">
                  SMART · SIGNATURE · BESPOKE
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] lg:min-h-full bg-[#1a1817]">
              <img
                src={PLANNER_MEDIA.hero}
                alt="NRB DESIGN Modern Residential Interior"
                className="w-full h-full object-cover"
              />
              <div className="hidden lg:block absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#242321] to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* INTERACTIVE 4-STEP WIZARD */}
        <div
          ref={wizardRef}
          id="nrb-planner-wizard"
          className="bg-white rounded-2xl border border-[#eae6df] shadow-sm overflow-hidden scroll-mt-20"
        >
          {/* Progress Header */}
          <div className="bg-[#fbf9f6] border-b border-[#eae6df] px-5 sm:px-8 py-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8c735d] tabular-nums">
                    Step {String(step).padStart(2, '0')} of 04
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs text-stone-500 font-medium">
                    {step === 1 && 'Tell Us About Your Home'}
                    {step === 2 && 'Select the Spaces You Want to Design'}
                    {step === 3 && 'Add Additional Services'}
                    {step === 4 && 'Your Estimated Home Budget'}
                  </span>
                </div>
                <div className="w-full lg:w-[340px] h-1.5 bg-[#eae6df] rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-[#b3957b] transition-all duration-300"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
                {step > 1 && clientName.trim() && (
                  <button
                    type="button"
                    onClick={() => focusContactSection('name')}
                    className="inline-flex items-center gap-2 text-xs text-[#3a3532] bg-white px-3.5 py-2 rounded-lg border border-[#d9cec0] hover:border-[#242321] transition-colors cursor-pointer min-h-[40px]"
                    title="Update your name or phone number"
                  >
                    <User className="w-3.5 h-3.5 text-[#8c735d] shrink-0" />
                    <span className="font-semibold truncate max-w-[160px]">{clientName.trim()}</span>
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-600 tabular-nums">{clientPhone.trim()}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#8c735d] underline ml-1">
                      Update
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-500 hover:text-[#1a1a1a] px-3 py-2 rounded-lg border border-[#eae6df] hover:bg-white transition-colors cursor-pointer min-h-[40px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Step Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-[#eae6df]">
              {STEP_META.map((item) => {
                const isActive = step === item.num;
                const isDone = step > item.num;
                return (
                  <button
                    key={item.num}
                    type="button"
                    onClick={() => goToStep(item.num)}
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap min-h-[42px] border ${
                      isActive
                        ? 'bg-[#242321] text-white border-[#242321]'
                        : isDone
                        ? 'bg-[#f3eee8] text-[#3a3532] border-[#d9cec0] hover:border-[#b3957b]'
                        : 'bg-white text-stone-500 border-[#eae6df] hover:text-[#1a1a1a]'
                    }`}
                  >
                    <span className="tabular-nums opacity-75">{item.code}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP CONTENT BODY */}
          <div className="p-5 sm:p-8 md:p-10">
            {/* ============================================================== */}
            {/* STEP 1 — TELL US ABOUT YOUR HOME                               */}
            {/* ============================================================== */}
            {step === 1 && (
              <div className="space-y-10">
                <div>
                  <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl text-[#1a1a1a] mb-2">
                    Let&apos;s start with your details &amp; home.
                  </h3>
                  <p className="text-sm text-stone-600">
                    Enter your name and phone number first, then share your property profile so we can prepare and save your customised budget estimate.
                  </p>
                </div>

                {/* Mandatory Client Contact Details Gate */}
                <div
                  ref={contactSectionRef}
                  className={`p-5 sm:p-6 rounded-xl border transition-colors space-y-4 ${
                    contactError
                      ? 'bg-red-50/60 border-red-300'
                      : 'bg-[#fbf9f6] border-[#d9cec0]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] font-bold text-[#3a3532]">
                        Your Contact Details (Required)
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Required before selecting spaces and generating your personalised budget estimate.
                      </p>
                    </div>
                    {validateContact().valid && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#242321] bg-[#f3eee8] border border-[#d9cec0] px-3 py-1 rounded-md self-start sm:self-auto">
                        <Check className="w-3.5 h-3.5 text-[#8c735d]" />
                        <span>Details Ready</span>
                      </span>
                    )}
                  </div>

                  {contactError && (
                    <p className="text-xs font-semibold text-red-700 bg-red-100/80 border border-red-200 px-3.5 py-2.5 rounded-lg">
                      {contactError}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#3a3532] mb-1.5">
                        <User className="w-3.5 h-3.5 text-[#8c735d]" />
                        <span>Full Name *</span>
                      </label>
                      <input
                        ref={nameInputRef}
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => {
                          hasInteractedRef.current = true;
                          setClientName(e.target.value);
                          if (contactError) setContactError('');
                        }}
                        placeholder="e.g. Anirban Sen"
                        className="w-full border border-[#d9cec0] rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#1a1a1a] focus:outline-none focus:border-[#242321]"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#3a3532] mb-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#8c735d]" />
                        <span>Phone / WhatsApp Number *</span>
                      </label>
                      <input
                        ref={phoneInputRef}
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => {
                          hasInteractedRef.current = true;
                          setClientPhone(e.target.value);
                          if (contactError) setContactError('');
                        }}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full border border-[#d9cec0] rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#1a1a1a] focus:outline-none focus:border-[#242321]"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#8c735d]" />
                        <span>Email (Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => {
                          hasInteractedRef.current = true;
                          setClientEmail(e.target.value);
                        }}
                        placeholder="you@example.com"
                        className="w-full border border-[#d9cec0] rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#1a1a1a] focus:outline-none focus:border-[#242321]"
                      />
                    </div>
                  </div>
                </div>

                {/* 1A. Property Type Cards */}
                <div className="space-y-3">
                  <label className="block text-xs uppercase tracking-[0.18em] font-bold text-[#3a3532]">
                    What type of property are you planning to design?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PROPERTY_TYPE_OPTIONS.map((opt) => {
                      const active = state.propertyType === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setState((p) => ({ ...p, propertyType: opt.id }))}
                          className={`group text-left rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col ${
                            active
                              ? 'border-[#242321] ring-1 ring-[#242321] bg-[#fbf9f6]'
                              : 'border-[#eae6df] hover:border-[#b3957b] bg-white'
                          }`}
                        >
                          <div className="aspect-[4/3] w-full bg-[#eeebe8] overflow-hidden relative">
                            {opt.image ? (
                              <img
                                src={opt.image}
                                alt={opt.label}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#f3eee8] text-[#8c735d]">
                                <Building2 className="w-10 h-10 stroke-1" />
                              </div>
                            )}
                            {active && (
                              <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#242321] text-white flex items-center justify-center">
                                <Check className="w-4 h-4" />
                              </span>
                            )}
                          </div>
                          <div className="p-4">
                            <p className="font-semibold text-sm text-[#1a1a1a]">{opt.label}</p>
                            <p className="text-xs text-stone-500 mt-1">{opt.subtitle}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-[#eae6df] pt-8 grid lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* 1B. BHK Configuration */}
                  <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-[0.18em] font-bold text-[#3a3532]">
                      What is your home configuration?
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {(Object.keys(BHK_PRESETS) as BhkOption[]).map((bhkKey) => {
                        const active = state.bhk === bhkKey;
                        return (
                          <button
                            key={bhkKey}
                            type="button"
                            onClick={() => handleSelectBhk(bhkKey)}
                            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer min-h-[44px] whitespace-nowrap ${
                              active
                                ? 'bg-[#242321] text-white border-[#242321]'
                                : 'bg-[#fbf9f6] text-[#3a3532] border-[#eae6df] hover:border-[#b3957b]'
                            }`}
                          >
                            {BHK_PRESETS[bhkKey].label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 1C. Carpet Area */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs uppercase tracking-[0.18em] font-bold text-[#3a3532]">
                        Approximate carpet area (sq. ft.)
                      </label>
                      <div className="flex items-center gap-1.5 border border-[#d9cec0] rounded-lg px-3 py-1.5 bg-[#fbf9f6]">
                        <input
                          type="number"
                          min={300}
                          max={6000}
                          step={25}
                          value={state.carpetArea}
                          onChange={(e) => {
                            const val = Math.max(300, Math.min(6000, Number(e.target.value) || 300));
                            setState((p) => ({ ...p, carpetArea: val }));
                          }}
                          className="w-20 text-right font-bold text-sm text-[#1a1a1a] bg-transparent focus:outline-none tabular-nums"
                        />
                        <span className="text-xs text-stone-500">sq. ft.</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={350}
                      max={4500}
                      step={50}
                      value={Math.min(4500, state.carpetArea)}
                      onChange={(e) => setState((p) => ({ ...p, carpetArea: Number(e.target.value) }))}
                      className="w-full accent-[#b3957b] cursor-pointer"
                    />
                    <p className="text-xs text-stone-500">
                      Carpet area is used as the primary baseline rather than super built-up area for realistic estimation.
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#eae6df] pt-8 grid lg:grid-cols-3 gap-8">
                  {/* 1D. Location */}
                  <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-[0.18em] font-bold text-[#3a3532]">
                      Where is your property located?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {LOCATION_OPTIONS.map((loc) => {
                        const active = state.location === loc;
                        return (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setState((p) => ({ ...p, location: loc }))}
                            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer min-h-[40px] ${
                              active
                                ? 'bg-[#242321] text-white border-[#242321]'
                                : 'bg-[#fbf9f6] text-[#3a3532] border-[#eae6df] hover:border-[#b3957b]'
                            }`}
                          >
                            {loc}
                          </button>
                        );
                      })}
                    </div>
                    {state.location === 'Other' && (
                      <input
                        type="text"
                        value={state.customLocation}
                        onChange={(e) => setState((p) => ({ ...p, customLocation: e.target.value }))}
                        placeholder="Enter city or locality (e.g., Ballygunge, Siliguri)"
                        className="w-full border border-[#d9cec0] rounded-lg px-3.5 py-2.5 text-sm bg-[#fbf9f6] focus:outline-none focus:border-[#242321]"
                      />
                    )}
                  </div>

                  {/* 1E. Property Status */}
                  <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-[0.18em] font-bold text-[#3a3532]">
                      Property status
                    </label>
                    <div className="flex flex-col gap-2">
                      {PROPERTY_STATUS_OPTIONS.map((st) => {
                        const active = state.propertyStatus === st.id;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setState((p) => ({ ...p, propertyStatus: st.id }))}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer min-h-[42px] ${
                              active
                                ? 'bg-[#242321] text-white border-[#242321]'
                                : 'bg-[#fbf9f6] text-[#3a3532] border-[#eae6df] hover:border-[#b3957b]'
                            }`}
                          >
                            <span>{st.label}</span>
                            {active && <Check className="w-3.5 h-3.5 text-[#c5a46d]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 1F. Project Type */}
                  <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-[0.18em] font-bold text-[#3a3532]">
                      Project type
                    </label>
                    <div className="flex flex-col gap-2">
                      {PROJECT_TYPE_OPTIONS.map((pt) => {
                        const active = state.projectType === pt.id;
                        return (
                          <button
                            key={pt.id}
                            type="button"
                            onClick={() => setState((p) => ({ ...p, projectType: pt.id }))}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer min-h-[42px] ${
                              active
                                ? 'bg-[#242321] text-white border-[#242321]'
                                : 'bg-[#fbf9f6] text-[#3a3532] border-[#eae6df] hover:border-[#b3957b]'
                            }`}
                          >
                            <span>{pt.label}</span>
                            {active && <Check className="w-3.5 h-3.5 text-[#c5a46d]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 2 — SPACES (MODULAR KITCHEN, ROOMS, PAINT, CEILING,       */}
            {/*                  ELECTRICAL, WASHROOM, LIVING)                 */}
            {/* ============================================================== */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl text-[#1a1a1a] mb-2">
                      Spaces
                    </h3>
                    <p className="text-sm text-stone-600">
                      Configure your Modular Kitchen, Rooms, Paint, False Ceiling, Electrical, Washroom and Living requirements.
                    </p>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8c735d] tabular-nums whitespace-nowrap">
                    {selectedSpacesCount} of 7 Sections Included
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* -------------------------------------------------------- */}
                  {/* 3.1 MODULAR KITCHEN (Structure & Finish Dropdowns)       */}
                  {/* -------------------------------------------------------- */}
                  <div
                    className={`rounded-xl border overflow-hidden transition-colors ${
                      state.rooms.kitchen.enabled
                        ? 'border-[#242321] bg-[#fbf9f6]'
                        : 'border-[#eae6df] bg-white'
                    }`}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-stone-100">
                      <img src={kitchhImage} alt="Modular Kitchen" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1a1a1a]">
                            Modular Kitchen
                          </h4>
                          <p className="text-xs text-stone-500">Structure &amp; Finish specification</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              rooms: {
                                ...p.rooms,
                                kitchen: { ...p.rooms.kitchen, enabled: !p.rooms.kitchen.enabled },
                              },
                            }))
                          }
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer min-h-[42px] whitespace-nowrap ${
                            state.rooms.kitchen.enabled
                              ? 'bg-[#242321] text-white border-[#242321]'
                              : 'bg-white text-[#3a3532] border-[#d9cec0]'
                          }`}
                        >
                          {state.rooms.kitchen.enabled ? <Check className="w-3.5 h-3.5 text-[#c5a46d]" /> : null}
                          <span>{state.rooms.kitchen.enabled ? 'Included' : 'Include Kitchen'}</span>
                        </button>
                      </div>

                      {state.rooms.kitchen.enabled && (
                        <div className="pt-4 border-t border-[#eae6df] space-y-3">
                          {/* DROPDOWN 1: STRUCTURE */}
                          <div className="rounded-lg border border-[#d9cec0] bg-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() => setKitchenStructureOpen((o) => !o)}
                              className="w-full px-4 py-3 flex items-center justify-between text-left bg-[#f7f5f2] hover:bg-[#f0ece6] transition-colors cursor-pointer"
                            >
                              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#1a1a1a]">
                                Structure
                              </span>
                              {kitchenStructureOpen ? (
                                <ChevronUp className="w-4 h-4 text-[#8c735d]" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#8c735d]" />
                              )}
                            </button>

                            {kitchenStructureOpen && (
                              <div className="p-4 space-y-4 border-t border-[#eae6df]">
                                {/* Shape */}
                                <div>
                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                                    Shape
                                  </label>
                                  <select
                                    value={state.rooms.kitchen.shape}
                                    onChange={(e) => {
                                      const sh = e.target.value as KitchenShape;
                                      setState((p) => ({
                                        ...p,
                                        rooms: {
                                          ...p.rooms,
                                          kitchen: {
                                            ...p.rooms.kitchen,
                                            shape: sh,
                                          },
                                        },
                                      }));
                                    }}
                                    className="w-full border border-[#d9cec0] rounded-lg px-3 py-2 text-xs font-semibold text-[#1a1a1a] bg-[#fbf9f6] focus:outline-none focus:border-[#242321] min-h-[40px]"
                                  >
                                    {(Object.keys(KITCHEN_SHAPE_INFO) as KitchenShape[]).map((sh) => (
                                      <option key={sh} value={sh}>
                                        {KITCHEN_SHAPE_INFO[sh].label}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* Structure Checkboxes */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#f0ece6]">
                                  {(
                                    [
                                      ['wallUnit', 'Wall unit'],
                                      ['baseUnit', 'Base unit'],
                                      ['loft', 'Loft'],
                                      ['dadoTiles', 'Dado tiles'],
                                      ['counterTop', 'Counter top'],
                                      ['chimney', 'Chimney'],
                                      ['hob', 'Hob'],
                                      ['sink', 'Sink'],
                                      ['aquaguard', 'Aquaguard'],
                                    ] as const
                                  ).map(([key, label]) => (
                                    <label
                                      key={key}
                                      className="flex items-center gap-2 text-xs text-[#3a3532] cursor-pointer py-1"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={state.rooms.kitchen.structure[key]}
                                        onChange={(e) =>
                                          setState((p) => ({
                                            ...p,
                                            rooms: {
                                              ...p.rooms,
                                              kitchen: {
                                                ...p.rooms.kitchen,
                                                structure: {
                                                  ...p.rooms.kitchen.structure,
                                                  [key]: e.target.checked,
                                                },
                                              },
                                            },
                                          }))
                                        }
                                        className="w-4 h-4 accent-[#242321] rounded cursor-pointer"
                                      />
                                      <span>{label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* DROPDOWN 2: FINISH */}
                          <div className="rounded-lg border border-[#d9cec0] bg-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() => setKitchenFinishOpen((o) => !o)}
                              className="w-full px-4 py-3 flex items-center justify-between text-left bg-[#f7f5f2] hover:bg-[#f0ece6] transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#1a1a1a]">
                                  Finish
                                </span>
                                <span className="text-xs text-[#8c735d] font-medium">
                                  · {KITCHEN_FINISH_OPTIONS[state.rooms.kitchen.finish].label}
                                </span>
                              </div>
                              {kitchenFinishOpen ? (
                                <ChevronUp className="w-4 h-4 text-[#8c735d]" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#8c735d]" />
                              )}
                            </button>

                            {kitchenFinishOpen && (
                              <div className="p-4 border-t border-[#eae6df] space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                                  Select Kitchen Shutter Finish
                                </label>
                                <select
                                  value={state.rooms.kitchen.finish}
                                  onChange={(e) => {
                                    const fin = e.target.value as KitchenFinishOption;
                                    setState((p) => ({
                                      ...p,
                                      rooms: {
                                        ...p.rooms,
                                        kitchen: { ...p.rooms.kitchen, finish: fin },
                                      },
                                    }));
                                  }}
                                  className="w-full border border-[#d9cec0] rounded-lg px-3 py-2.5 text-xs font-semibold text-[#1a1a1a] bg-[#fbf9f6] focus:outline-none focus:border-[#242321] min-h-[42px]"
                                >
                                  <option value="laminate-matt">Laminate (Matt)</option>
                                  <option value="laminate-gloss">Laminate (Gloss)</option>
                                  <option value="membrane">Membrane</option>
                                  <option value="anti-scratch-acrylic">Anti-scratch Acrylic</option>
                                  <option value="pu-finish">PU Finish</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* 3.2 ROOMS                                                */}
                  {/* -------------------------------------------------------- */}
                  <div
                    className={`rounded-xl border overflow-hidden transition-colors ${
                      state.rooms.rooms.enabled
                        ? 'border-[#242321] bg-[#fbf9f6]'
                        : 'border-[#eae6df] bg-white'
                    }`}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-stone-100">
                      <img src={roomImage} alt="Rooms and Furniture" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1a1a1a]">
                            Rooms
                          </h4>
                          <p className="text-xs text-stone-500">
                            Master, kids, puja &amp; guest rooms, beds &amp; wardrobes
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              rooms: {
                                ...p.rooms,
                                rooms: { ...p.rooms.rooms, enabled: !p.rooms.rooms.enabled },
                              },
                            }))
                          }
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer min-h-[42px] whitespace-nowrap ${
                            state.rooms.rooms.enabled
                              ? 'bg-[#242321] text-white border-[#242321]'
                              : 'bg-white text-[#3a3532] border-[#d9cec0]'
                          }`}
                        >
                          {state.rooms.rooms.enabled ? <Check className="w-3.5 h-3.5 text-[#c5a46d]" /> : null}
                          <span>{state.rooms.rooms.enabled ? 'Included' : 'Include Rooms'}</span>
                        </button>
                      </div>

                      {state.rooms.rooms.enabled && (
                        <div className="pt-4 border-t border-[#eae6df] space-y-4">
                          {/* Room Count Steppers */}
                          <div className="space-y-2">
                            <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                              Number of Rooms
                            </span>
                            <div className="grid grid-cols-2 gap-2.5">
                              {(
                                [
                                  ['masterRoom', 'Master Room'],
                                  ['kidsRoom', 'Kids Room'],
                                  ['pujaRoom', 'Puja Room'],
                                  ['guestRoom', 'Guest Room'],
                                ] as const
                              ).map(([roomKey, roomLabel]) => (
                                <div
                                  key={roomKey}
                                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-[#eae6df]"
                                >
                                  <span className="text-xs font-medium text-[#3a3532]">{roomLabel}</span>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setState((p) => ({
                                          ...p,
                                          rooms: {
                                            ...p.rooms,
                                            rooms: {
                                              ...p.rooms.rooms,
                                              counts: {
                                                ...p.rooms.rooms.counts,
                                                [roomKey]: Math.max(0, p.rooms.rooms.counts[roomKey] - 1),
                                              },
                                            },
                                          },
                                        }))
                                      }
                                      className="w-7 h-7 rounded border border-[#d9cec0] bg-[#fbf9f6] flex items-center justify-center cursor-pointer"
                                      aria-label={`Decrease ${roomLabel}`}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-5 text-center text-xs font-bold tabular-nums">
                                      {state.rooms.rooms.counts[roomKey]}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setState((p) => ({
                                          ...p,
                                          rooms: {
                                            ...p.rooms,
                                            rooms: {
                                              ...p.rooms.rooms,
                                              counts: {
                                                ...p.rooms.rooms.counts,
                                                [roomKey]: Math.min(4, p.rooms.rooms.counts[roomKey] + 1),
                                              },
                                            },
                                          },
                                        }))
                                      }
                                      className="w-7 h-7 rounded border border-[#d9cec0] bg-[#fbf9f6] flex items-center justify-center cursor-pointer"
                                      aria-label={`Increase ${roomLabel}`}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Type of Bed Dropdown */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end pt-2 border-t border-[#eae6df]">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                                Type of Bed
                              </label>
                              <select
                                value={state.rooms.rooms.bedType}
                                onChange={(e) =>
                                  setState((p) => ({
                                    ...p,
                                    rooms: {
                                      ...p.rooms,
                                      rooms: {
                                        ...p.rooms.rooms,
                                        bedType: e.target.value as BedTypeOption,
                                      },
                                    },
                                  }))
                                }
                                className="w-full border border-[#d9cec0] rounded-lg px-3 py-2 text-xs font-semibold text-[#1a1a1a] bg-white focus:outline-none focus:border-[#242321] min-h-[40px]"
                              >
                                {(Object.keys(BED_TYPE_OPTIONS) as BedTypeOption[]).map((bKey) => (
                                  <option key={bKey} value={bKey}>
                                    {BED_TYPE_OPTIONS[bKey].label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <label className="flex items-center gap-2.5 text-xs font-medium text-[#3a3532] cursor-pointer px-3 py-2.5 rounded-lg bg-white border border-[#eae6df] min-h-[40px]">
                              <input
                                type="checkbox"
                                checked={state.rooms.rooms.items.sideTable}
                                onChange={(e) =>
                                  setState((p) => ({
                                    ...p,
                                    rooms: {
                                      ...p.rooms,
                                      rooms: {
                                        ...p.rooms.rooms,
                                        items: {
                                          ...p.rooms.rooms.items,
                                          sideTable: e.target.checked,
                                        },
                                      },
                                    },
                                  }))
                                }
                                className="w-4 h-4 accent-[#242321] rounded cursor-pointer"
                              />
                              <span>Side Table</span>
                            </label>
                          </div>

                          {/* Wardrobe, TV Unit, Dressing Unit, Console Table, Study Unit */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#eae6df]">
                            {(
                              [
                                ['wardrobe', 'Wardrobe'],
                                ['tvUnit', 'TV Unit'],
                                ['dressingUnit', 'Dressing Unit'],
                                ['consoleTable', 'Console Table'],
                                ['studyUnit', 'Study Unit'],
                              ] as const
                            ).map(([key, label]) => (
                              <label
                                key={key}
                                className="flex items-center gap-2 text-xs text-[#3a3532] cursor-pointer py-1"
                              >
                                <input
                                  type="checkbox"
                                  checked={state.rooms.rooms.items[key]}
                                  onChange={(e) =>
                                    setState((p) => ({
                                      ...p,
                                      rooms: {
                                        ...p.rooms,
                                        rooms: {
                                          ...p.rooms.rooms,
                                          items: {
                                            ...p.rooms.rooms.items,
                                            [key]: e.target.checked,
                                          },
                                        },
                                      },
                                    }))
                                  }
                                  className="w-4 h-4 accent-[#242321] rounded cursor-pointer"
                                />
                                <span>{label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* 3.3 PAINT                                                */}
                  {/* -------------------------------------------------------- */}
                  <div
                    className={`rounded-xl border overflow-hidden transition-colors ${
                      state.rooms.paint.enabled
                        ? 'border-[#242321] bg-[#fbf9f6]'
                        : 'border-[#eae6df] bg-white'
                    }`}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-stone-100">
                      <img src={paintImage} alt="Paint" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1a1a1a]">
                            Paint
                          </h4>
                          <p className="text-xs text-stone-500">Interior wall preparation &amp; painting</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              rooms: {
                                ...p.rooms,
                                paint: { ...p.rooms.paint, enabled: !p.rooms.paint.enabled },
                              },
                            }))
                          }
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer min-h-[42px] whitespace-nowrap ${
                            state.rooms.paint.enabled
                              ? 'bg-[#242321] text-white border-[#242321]'
                              : 'bg-white text-[#3a3532] border-[#d9cec0]'
                          }`}
                        >
                          {state.rooms.paint.enabled ? <Check className="w-3.5 h-3.5 text-[#c5a46d]" /> : null}
                          <span>{state.rooms.paint.enabled ? 'Included' : 'Include Paint'}</span>
                        </button>
                      </div>

                      {state.rooms.paint.enabled && (
                        <div className="pt-4 border-t border-[#eae6df]">
                          <label className="flex items-center justify-between p-3.5 rounded-lg bg-white border border-[#eae6df] cursor-pointer">
                            <div>
                              <span className="text-xs font-bold text-[#1a1a1a] block">
                                Full House Paint
                              </span>
                              <span className="text-[11px] text-stone-500">
                                Complete putty, primer &amp; emulsion finish across {state.carpetArea.toLocaleString('en-IN')} sq. ft. carpet area
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={state.rooms.paint.fullHousePaint}
                              onChange={(e) =>
                                setState((p) => ({
                                  ...p,
                                  rooms: {
                                    ...p.rooms,
                                    paint: { ...p.rooms.paint, fullHousePaint: e.target.checked },
                                  },
                                }))
                              }
                              className="w-4 h-4 accent-[#242321] rounded cursor-pointer shrink-0 ml-3"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* 3.4 FALSE CEILING                                        */}
                  {/* -------------------------------------------------------- */}
                  <div
                    className={`rounded-xl border overflow-hidden transition-colors ${
                      state.rooms.falseCeiling.enabled
                        ? 'border-[#242321] bg-[#fbf9f6]'
                        : 'border-[#eae6df] bg-white'
                    }`}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-stone-100">
                      <img src={falseCeilingImage} alt="False Ceiling" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1a1a1a]">
                            False Ceiling
                          </h4>
                          <p className="text-xs text-stone-500">Living, dining, rooms &amp; washroom ceilings</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              rooms: {
                                ...p.rooms,
                                falseCeiling: {
                                  ...p.rooms.falseCeiling,
                                  enabled: !p.rooms.falseCeiling.enabled,
                                },
                              },
                            }))
                          }
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer min-h-[42px] whitespace-nowrap ${
                            state.rooms.falseCeiling.enabled
                              ? 'bg-[#242321] text-white border-[#242321]'
                              : 'bg-white text-[#3a3532] border-[#d9cec0]'
                          }`}
                        >
                          {state.rooms.falseCeiling.enabled ? <Check className="w-3.5 h-3.5 text-[#c5a46d]" /> : null}
                          <span>{state.rooms.falseCeiling.enabled ? 'Included' : 'Include Ceiling'}</span>
                        </button>
                      </div>

                      {state.rooms.falseCeiling.enabled && (
                        <div className="pt-4 border-t border-[#eae6df] space-y-4">
                          <div>
                            <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                              Select Areas
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {(
                                [
                                  ['living', 'Living'],
                                  ['dining', 'Dining'],
                                  ['rooms', 'Rooms'],
                                  ['washroom', 'Washroom'],
                                ] as const
                              ).map(([areaKey, areaLabel]) => (
                                <label
                                  key={areaKey}
                                  className="flex items-center gap-2 text-xs text-[#3a3532] cursor-pointer py-1"
                                >
                                  <input
                                    type="checkbox"
                                    checked={state.rooms.falseCeiling.areas[areaKey]}
                                    onChange={(e) =>
                                      setState((p) => ({
                                        ...p,
                                        rooms: {
                                          ...p.rooms,
                                          falseCeiling: {
                                            ...p.rooms.falseCeiling,
                                            areas: {
                                              ...p.rooms.falseCeiling.areas,
                                              [areaKey]: e.target.checked,
                                            },
                                          },
                                        },
                                      }))
                                    }
                                    className="w-4 h-4 accent-[#242321] rounded cursor-pointer"
                                  />
                                  <span>{areaLabel}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#eae6df]">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                                Profile Type
                              </label>
                              <select
                                value={state.rooms.falseCeiling.profile}
                                onChange={(e) =>
                                  setState((p) => ({
                                    ...p,
                                    rooms: {
                                      ...p.rooms,
                                      falseCeiling: {
                                        ...p.rooms.falseCeiling,
                                        profile: e.target.value as CeilingProfileOption,
                                      },
                                    },
                                  }))
                                }
                                className="w-full border border-[#d9cec0] rounded-lg px-3 py-2 text-xs font-semibold text-[#1a1a1a] bg-white focus:outline-none focus:border-[#242321] min-h-[40px]"
                              >
                                <option value="normal">Normal</option>
                                <option value="peripheral">Peripheral</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                                Ceiling Style
                              </label>
                              <select
                                value={state.rooms.falseCeiling.design}
                                onChange={(e) =>
                                  setState((p) => ({
                                    ...p,
                                    rooms: {
                                      ...p.rooms,
                                      falseCeiling: {
                                        ...p.rooms.falseCeiling,
                                        design: e.target.value as CeilingDesignOption,
                                      },
                                    },
                                  }))
                                }
                                className="w-full border border-[#d9cec0] rounded-lg px-3 py-2 text-xs font-semibold text-[#1a1a1a] bg-white focus:outline-none focus:border-[#242321] min-h-[40px]"
                              >
                                <option value="plain">Plain</option>
                                <option value="design">Design False Ceiling</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* 3.5 ELECTRICAL                                           */}
                  {/* -------------------------------------------------------- */}
                  <div
                    className={`rounded-xl border overflow-hidden transition-colors ${
                      state.rooms.electrical.enabled
                        ? 'border-[#242321] bg-[#fbf9f6]'
                        : 'border-[#eae6df] bg-white'
                    }`}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-stone-100">
                      <img src={electricalImage} alt="Electrical and Lighting" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1a1a1a]">
                            Electrical
                          </h4>
                          <p className="text-xs text-stone-500">Ceiling lights, cabinet lights, wall lights &amp; fans</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              rooms: {
                                ...p.rooms,
                                electrical: {
                                  ...p.rooms.electrical,
                                  enabled: !p.rooms.electrical.enabled,
                                },
                              },
                            }))
                          }
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer min-h-[42px] whitespace-nowrap ${
                            state.rooms.electrical.enabled
                              ? 'bg-[#242321] text-white border-[#242321]'
                              : 'bg-white text-[#3a3532] border-[#d9cec0]'
                          }`}
                        >
                          {state.rooms.electrical.enabled ? <Check className="w-3.5 h-3.5 text-[#c5a46d]" /> : null}
                          <span>{state.rooms.electrical.enabled ? 'Included' : 'Include Electrical'}</span>
                        </button>
                      </div>

                      {state.rooms.electrical.enabled && (
                        <div className="pt-4 border-t border-[#eae6df] grid grid-cols-2 gap-2.5">
                          {(
                            [
                              ['ceilingLights', 'Ceiling Lights'],
                              ['cabinetLights', 'Cabinet Lights'],
                              ['wallLights', 'Wall Lights'],
                              ['fan', 'Fan'],
                            ] as const
                          ).map(([elKey, elLabel]) => (
                            <label
                              key={elKey}
                              className="flex items-center gap-2.5 text-xs font-medium text-[#3a3532] cursor-pointer px-3 py-2.5 rounded-lg bg-white border border-[#eae6df]"
                            >
                              <input
                                type="checkbox"
                                checked={state.rooms.electrical.items[elKey]}
                                onChange={(e) =>
                                  setState((p) => ({
                                    ...p,
                                    rooms: {
                                      ...p.rooms,
                                      electrical: {
                                        ...p.rooms.electrical,
                                        items: {
                                          ...p.rooms.electrical.items,
                                          [elKey]: e.target.checked,
                                        },
                                      },
                                    },
                                  }))
                                }
                                className="w-4 h-4 accent-[#242321] rounded cursor-pointer"
                              />
                              <span>{elLabel}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* 3.6 WASHROOM                                             */}
                  {/* -------------------------------------------------------- */}
                  <div
                    className={`rounded-xl border overflow-hidden transition-colors ${
                      state.rooms.washroom.enabled
                        ? 'border-[#242321] bg-[#fbf9f6]'
                        : 'border-[#eae6df] bg-white'
                    }`}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-stone-100">
                      <img src={washroomImage} alt="Washroom" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1a1a1a]">
                            Washroom
                          </h4>
                          <p className="text-xs text-stone-500">Vanity, LED mirror, tiling &amp; sanitary fittings</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              rooms: {
                                ...p.rooms,
                                washroom: {
                                  ...p.rooms.washroom,
                                  enabled: !p.rooms.washroom.enabled,
                                },
                              },
                            }))
                          }
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer min-h-[42px] whitespace-nowrap ${
                            state.rooms.washroom.enabled
                              ? 'bg-[#242321] text-white border-[#242321]'
                              : 'bg-white text-[#3a3532] border-[#d9cec0]'
                          }`}
                        >
                          {state.rooms.washroom.enabled ? <Check className="w-3.5 h-3.5 text-[#c5a46d]" /> : null}
                          <span>{state.rooms.washroom.enabled ? 'Included' : 'Include Washroom'}</span>
                        </button>
                      </div>

                      {state.rooms.washroom.enabled && (
                        <div className="pt-4 border-t border-[#eae6df] space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-600">Number of washrooms</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setState((p) => ({
                                    ...p,
                                    rooms: {
                                      ...p.rooms,
                                      washroom: {
                                        ...p.rooms.washroom,
                                        count: Math.max(1, p.rooms.washroom.count - 1),
                                      },
                                    },
                                  }))
                                }
                                className="w-8 h-8 rounded border border-[#d9cec0] bg-white flex items-center justify-center cursor-pointer"
                                aria-label="Decrease washroom count"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-bold tabular-nums">
                                {state.rooms.washroom.count}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setState((p) => ({
                                    ...p,
                                    rooms: {
                                      ...p.rooms,
                                      washroom: {
                                        ...p.rooms.washroom,
                                        count: Math.min(5, p.rooms.washroom.count + 1),
                                      },
                                    },
                                  }))
                                }
                                className="w-8 h-8 rounded border border-[#d9cec0] bg-white flex items-center justify-center cursor-pointer"
                                aria-label="Increase washroom count"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(
                              [
                                ['vanity', 'Vanity'],
                                ['ledMirrorWithStorage', 'LED Mirror with Storage'],
                                ['showerPartition', 'Shower Partition'],
                                ['sanitaryFittings', 'Sanitary Fittings'],
                              ] as const
                            ).map(([wKey, wLabel]) => (
                              <label
                                key={wKey}
                                className="flex items-center gap-2.5 text-xs text-[#3a3532] cursor-pointer py-1"
                              >
                                <input
                                  type="checkbox"
                                  checked={state.rooms.washroom[wKey]}
                                  onChange={(e) =>
                                    setState((p) => ({
                                      ...p,
                                      rooms: {
                                        ...p.rooms,
                                        washroom: {
                                          ...p.rooms.washroom,
                                          [wKey]: e.target.checked,
                                        },
                                      },
                                    }))
                                  }
                                  className="w-4 h-4 accent-[#242321] rounded cursor-pointer"
                                />
                                <span>{wLabel}</span>
                              </label>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-[#eae6df]">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                              Renovation (Wall Tiles / Floor Tiles / Both)
                            </label>
                            <select
                              value={state.rooms.washroom.renovation}
                              onChange={(e) =>
                                setState((p) => ({
                                  ...p,
                                  rooms: {
                                    ...p.rooms,
                                    washroom: {
                                      ...p.rooms.washroom,
                                      renovation: e.target.value as WashroomRenovationOption,
                                    },
                                  },
                                }))
                              }
                              className="w-full border border-[#d9cec0] rounded-lg px-3 py-2 text-xs font-semibold text-[#1a1a1a] bg-white focus:outline-none focus:border-[#242321] min-h-[40px]"
                            >
                              {(Object.keys(WASHROOM_RENOVATION_OPTIONS) as WashroomRenovationOption[]).map(
                                (rKey) => (
                                  <option key={rKey} value={rKey}>
                                    {WASHROOM_RENOVATION_OPTIONS[rKey].label}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* 3.7 LIVING                                               */}
                  {/* -------------------------------------------------------- */}
                  <div
                    className={`rounded-xl border overflow-hidden transition-colors lg:col-span-2 ${
                      state.rooms.living.enabled
                        ? 'border-[#242321] bg-[#fbf9f6]'
                        : 'border-[#eae6df] bg-white'
                    }`}
                  >
                    <div className="aspect-[16/7] overflow-hidden bg-stone-100">
                      <img src={livingImage} alt="Living Area" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1a1a1a]">
                            Living
                          </h4>
                          <p className="text-xs text-stone-500">
                            TV unit, sofa, crockery, shoe cabinet, accent wall, tables, chairs, bar &amp; bookshelf
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setState((p) => ({
                              ...p,
                              rooms: {
                                ...p.rooms,
                                living: {
                                  ...p.rooms.living,
                                  enabled: !p.rooms.living.enabled,
                                },
                              },
                            }))
                          }
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer min-h-[42px] whitespace-nowrap ${
                            state.rooms.living.enabled
                              ? 'bg-[#242321] text-white border-[#242321]'
                              : 'bg-white text-[#3a3532] border-[#d9cec0]'
                          }`}
                        >
                          {state.rooms.living.enabled ? <Check className="w-3.5 h-3.5 text-[#c5a46d]" /> : null}
                          <span>{state.rooms.living.enabled ? 'Included' : 'Include Living'}</span>
                        </button>
                      </div>

                      {state.rooms.living.enabled && (
                        <div className="pt-4 border-t border-[#eae6df] space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                            {(
                              [
                                ['tvUnit', 'TV Unit'],
                                ['sofa', 'Sofa'],
                                ['crockery', 'Crockery'],
                                ['shoeCabinet', 'Shoe Cabinet'],
                                ['accentWall', 'Accent Wall / Design Wall'],
                                ['centreTable', 'Centre Table'],
                                ['diningTable', 'Dining Table'],
                                ['chairs', 'Chairs'],
                                ['barCabinet', 'Bar Cabinet'],
                                ['bookShelf', 'Book Shelf'],
                              ] as const
                            ).map(([lvKey, lvLabel]) => (
                              <label
                                key={lvKey}
                                className="flex items-center gap-2.5 text-xs font-medium text-[#3a3532] cursor-pointer px-3 py-2.5 rounded-lg bg-white border border-[#eae6df]"
                              >
                                <input
                                  type="checkbox"
                                  checked={state.rooms.living.items[lvKey]}
                                  onChange={(e) =>
                                    setState((p) => ({
                                      ...p,
                                      rooms: {
                                        ...p.rooms,
                                        living: {
                                          ...p.rooms.living,
                                          items: {
                                            ...p.rooms.living.items,
                                            [lvKey]: e.target.checked,
                                          },
                                        },
                                      },
                                    }))
                                  }
                                  className="w-4 h-4 accent-[#242321] rounded cursor-pointer shrink-0"
                                />
                                <span>{lvLabel}</span>
                              </label>
                            ))}
                          </div>

                          {state.rooms.living.items.chairs && (
                            <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-white border border-[#d9cec0]">
                              <div>
                                <span className="text-xs font-semibold text-[#1a1a1a]">
                                  Number of Dining / Accent Chairs
                                </span>
                                <span className="block text-[11px] text-stone-500">
                                  Select quantity for your dining or living seating
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setState((p) => ({
                                      ...p,
                                      rooms: {
                                        ...p.rooms,
                                        living: {
                                          ...p.rooms.living,
                                          chairsCount: Math.max(1, p.rooms.living.chairsCount - 1),
                                        },
                                      },
                                    }))
                                  }
                                  className="w-8 h-8 rounded border border-[#d9cec0] bg-[#fbf9f6] flex items-center justify-center cursor-pointer"
                                  aria-label="Decrease chair count"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-6 text-center text-sm font-bold tabular-nums">
                                  {state.rooms.living.chairsCount}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setState((p) => ({
                                      ...p,
                                      rooms: {
                                        ...p.rooms,
                                        living: {
                                          ...p.rooms.living,
                                          chairsCount: Math.min(12, p.rooms.living.chairsCount + 1),
                                        },
                                      },
                                    }))
                                  }
                                  className="w-8 h-8 rounded border border-[#d9cec0] bg-[#fbf9f6] flex items-center justify-center cursor-pointer"
                                  aria-label="Increase chair count"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 3 — ADD ADDITIONAL SERVICES                               */}
            {/* ============================================================== */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <h3 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl text-[#1a1a1a] mb-2">
                      Would you like to include any additional work?
                    </h3>
                    <p className="text-sm text-stone-600">
                      Add complementary civil, flooring, plumbing or custom furniture scopes beyond the spaces already configured in Step 2.
                    </p>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8c735d] tabular-nums whitespace-nowrap">
                    {selectedServicesCount} Additional {selectedServicesCount === 1 ? 'Work' : 'Works'} Added
                  </p>
                </div>

                <div className="divide-y divide-[#eae6df] border border-[#eae6df] rounded-xl overflow-hidden bg-white">
                  {ADDITIONAL_SERVICES_LIST.map((svc) => {
                    const added = state.additionalServices[svc.id];
                    return (
                      <div
                        key={svc.id}
                        className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                          added ? 'bg-[#fbf9f6]' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={SERVICE_IMAGES[svc.id]}
                            alt={svc.label}
                            className="w-16 h-16 sm:w-20 sm:h-16 rounded-lg object-cover shrink-0 bg-stone-100"
                          />
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base text-[#1a1a1a]">
                              {svc.label}
                            </h4>
                            <p className="text-xs text-stone-600 mt-0.5">{svc.description}</p>
                            <p className="text-[11px] text-stone-400 mt-1">{svc.pricingBasis}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                          {svc.id === 'plumbing' && (
                            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#d9cec0] bg-white">
                              <span className="text-[11px] font-semibold text-stone-600 whitespace-nowrap">
                                Washrooms:
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setState((p) => ({
                                    ...p,
                                    additionalServices: {
                                      ...p.additionalServices,
                                      plumbing: true,
                                    },
                                    plumbingWashrooms: Math.max(1, p.plumbingWashrooms - 1),
                                  }))
                                }
                                className="w-7 h-7 rounded border border-[#d9cec0] bg-[#fbf9f6] flex items-center justify-center cursor-pointer"
                                aria-label="Decrease plumbing washroom count"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-4 text-center text-xs font-bold tabular-nums text-[#1a1a1a]">
                                {state.plumbingWashrooms}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setState((p) => ({
                                    ...p,
                                    additionalServices: {
                                      ...p.additionalServices,
                                      plumbing: true,
                                    },
                                    plumbingWashrooms: Math.min(8, p.plumbingWashrooms + 1),
                                  }))
                                }
                                className="w-7 h-7 rounded border border-[#d9cec0] bg-[#fbf9f6] flex items-center justify-center cursor-pointer"
                                aria-label="Increase plumbing washroom count"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setState((p) => ({
                                ...p,
                                additionalServices: {
                                  ...p.additionalServices,
                                  [svc.id]: !p.additionalServices[svc.id],
                                },
                              }))
                            }
                            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer min-h-[42px] whitespace-nowrap shrink-0 ${
                              added
                                ? 'bg-[#242321] text-white border-[#242321]'
                                : 'bg-[#fbf9f6] text-[#3a3532] border-[#d9cec0] hover:border-[#242321]'
                            }`}
                          >
                            {added ? <Check className="w-3.5 h-3.5 text-[#c5a46d]" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>{added ? 'Added' : 'Add'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setState((p) => ({ ...p, needDesignGuidance: !p.needDesignGuidance }))}
                  className={`w-full text-left p-5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                    state.needDesignGuidance
                      ? 'bg-[#242321] text-white border-[#242321]'
                      : 'bg-[#fbf9f6] text-[#3a3532] border-[#d9cec0] hover:border-[#b3957b]'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <HelpCircle
                      className={`w-5 h-5 shrink-0 mt-0.5 sm:mt-0 ${
                        state.needDesignGuidance ? 'text-[#c5a46d]' : 'text-[#8c735d]'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        Not sure what you need? Let NRB DESIGN guide you.
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${
                          state.needDesignGuidance ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        Our senior design coordinator will assess your site condition and recommend only the essential civil or MEP upgrades.
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3.5 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider shrink-0 ${
                      state.needDesignGuidance
                        ? 'bg-[#c5a46d] text-[#1a1817]'
                        : 'bg-white border border-[#d9cec0] text-[#3a3532]'
                    }`}
                  >
                    {state.needDesignGuidance ? 'Guidance Requested' : 'Request Guidance'}
                  </span>
                </button>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 4 — YOUR ESTIMATED HOME BUDGET                            */}
            {/* ============================================================== */}
            {step === 4 && (
              <div className="space-y-10">
                {estimate.breakdown.length === 0 ? (
                  <div className="p-8 rounded-xl bg-[#fbf9f6] border border-[#eae6df] text-center space-y-4">
                    <p className="font-['Playfair_Display',serif] text-2xl text-[#1a1a1a]">
                      No spaces or services selected yet
                    </p>
                    <p className="text-sm text-stone-600 max-w-md mx-auto">
                      Go back to Step 2 or Step 3 to select at least one room or service so we can compute your indicative budget.
                    </p>
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="inline-flex items-center gap-2 bg-[#242321] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Select Spaces
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-[#242321] text-[#f7f5f2] rounded-2xl p-6 sm:p-8 md:p-10 space-y-8 border border-[#3a3532]">
                      <div className="text-center space-y-2 pb-6 border-b border-[#b3957b]/40">
                        <p className="text-[11px] uppercase tracking-[0.26em] text-[#c5a46d] font-bold">
                          YOUR NRB HOME BUDGET ESTIMATE
                        </p>
                        <p className="font-['Playfair_Display',serif] text-3xl sm:text-4xl md:text-5xl font-bold text-white tabular-nums">
                          {estimate.minTotal === estimate.maxTotal
                            ? formatINRFull(estimate.minTotal)
                            : `${formatINRFull(estimate.minTotal)} – ${formatINRFull(estimate.maxTotal)}`}
                        </p>
                        <p className="text-xs text-stone-300">
                          {BHK_PRESETS[state.bhk].label}{' '}
                          {PROPERTY_TYPE_OPTIONS.find((p) => p.id === state.propertyType)?.label} ·{' '}
                          {state.carpetArea.toLocaleString('en-IN')} sq. ft. · {activeLocationLabel}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          Indicative estimate only · Not an actual NRB quotation
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-base sm:text-lg text-white">
                            Your selected requirements
                          </h4>
                          <span className="text-xs uppercase tracking-wider text-[#c5a46d] font-semibold">
                            {estimate.timeline}
                          </span>
                        </div>

                        <div className="divide-y divide-white/10">
                          {estimate.breakdown.map((line) => (
                            <div
                              key={line.id}
                              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div className="space-y-0.5 max-w-2xl">
                                <p className="text-sm font-medium text-white">{line.label}</p>
                                <p className="text-xs text-stone-400">{line.detail}</p>
                                <p className="text-[11px] text-stone-500">Basis: {line.pricingBasis}</p>
                              </div>
                              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#c5a46d] whitespace-nowrap">
                                <Check className="w-3.5 h-3.5" />
                                <span>Included</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-5 border-t border-[#b3957b]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-base sm:text-lg font-semibold text-white">
                          Estimated Investment
                        </span>
                        <span className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#c5a46d] tabular-nums">
                          {estimate.minTotal === estimate.maxTotal
                            ? formatINRLakhs(estimate.minTotal)
                            : `${formatINRLakhs(estimate.minTotal)}–${formatINRLakhs(estimate.maxTotal)}`}
                        </span>
                      </div>

                      <p className="text-xs text-stone-400 leading-relaxed">
                        This is an indicative budget estimate based on preliminary inputs. The final quotation will depend on site measurements, design finalisation, material specifications and the confirmed scope of work.
                      </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="p-6 rounded-xl bg-[#fbf9f6] border border-[#eae6df] space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-['Playfair_Display',serif] text-xl text-[#1a1a1a] flex items-center gap-2">
                            <Layers className="w-4 h-4 text-[#8c735d]" />
                            <span>Selected Home &amp; Scope Summary</span>
                          </h4>
                          <button
                            type="button"
                            onClick={() => goToStep(2)}
                            className="text-xs font-semibold text-[#8c735d] hover:text-[#1a1a1a] underline cursor-pointer"
                          >
                            Edit Spaces
                          </button>
                        </div>
                        <div className="divide-y divide-[#eae6df] text-xs">
                          {estimate.scopeSummary.map((m) => (
                            <div key={m.label} className="py-2.5 flex justify-between gap-4">
                              <span className="text-stone-500 font-medium">{m.label}</span>
                              <span className="text-[#1a1a1a] font-semibold text-right">{m.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 rounded-xl bg-[#fbf9f6] border border-[#eae6df] space-y-5">
                        <div>
                          <h4 className="font-['Playfair_Display',serif] text-xl text-[#1a1a1a] mb-3">
                            What&apos;s Included vs. Excluded
                          </h4>
                          <p className="text-[11px] uppercase tracking-wider font-bold text-[#8c735d] mb-2">
                            Included in Estimate
                          </p>
                          <ul className="space-y-1.5 text-xs text-stone-700">
                            {estimate.includedItems.map((inc) => (
                              <li key={inc} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-[#8c735d] shrink-0 mt-0.5" />
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-3 border-t border-[#eae6df]">
                          <p className="text-[11px] uppercase tracking-wider font-bold text-stone-500 mb-2">
                            Typically Excluded
                          </p>
                          <ul className="space-y-1.5 text-xs text-stone-600">
                            {estimate.excludedItems.map((exc) => (
                              <li key={exc} className="flex items-start gap-2">
                                <ShieldAlert className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                                <span>{exc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 rounded-2xl bg-[#fbf9f6] border border-[#d9cec0] space-y-6">
                      <div>
                        <h4 className="font-['Playfair_Display',serif] text-2xl text-[#1a1a1a]">
                          Ready to move from estimate to a tailored design plan?
                        </h4>
                        <p className="text-xs sm:text-sm text-stone-600 mt-1">
                          Save your indicative breakdown as a PDF, send it on WhatsApp, or schedule a complimentary site visit &amp; quote with NRB DESIGN.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            void savePlannerSnapshot('pdf-downloaded', true);
                            generateBudgetPdf(state, estimate, {
                              name: clientName,
                              phone: clientPhone,
                              email: clientEmail,
                            });
                          }}
                          className="inline-flex items-center justify-center gap-2 bg-[#242321] hover:bg-[#3a3532] text-white px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer min-h-[48px]"
                        >
                          <Download className="w-4 h-4 shrink-0" />
                          <span>Download Estimate PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowQuoteForm((prev) => !prev)}
                          className="inline-flex items-center justify-center gap-2 bg-[#c5a46d] hover:bg-[#b3957b] text-[#1a1817] px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer min-h-[48px]"
                        >
                          <Sparkles className="w-4 h-4 shrink-0" />
                          <span>Request Detailed Quote</span>
                          {showQuoteForm ? (
                            <ChevronUp className="w-4 h-4 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 shrink-0" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            void savePlannerSnapshot('consultation-clicked', true);
                            onBookWithEstimate(estimate.summaryText, {
                              name: clientName,
                              phone: clientPhone,
                              email: clientEmail,
                            });
                          }}
                          className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#f3eee8] text-[#1a1a1a] border border-[#d9cec0] px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer min-h-[48px]"
                        >
                          <MapPin className="w-4 h-4 shrink-0 text-[#8c735d]" />
                          <span>Book a Consultation</span>
                        </button>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => void savePlannerSnapshot('whatsapp-clicked', true)}
                          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors min-h-[48px]"
                        >
                          <MessageCircle className="w-4 h-4 shrink-0" />
                          <span>Send on WhatsApp</span>
                        </a>
                      </div>

                      {showQuoteForm && (
                        <div className="pt-6 border-t border-[#eae6df]">
                          {leadSuccess ? (
                            <div className="p-6 rounded-xl bg-white border border-[#d9cec0] text-center space-y-3">
                              <div className="w-10 h-10 rounded-full bg-[#242321] text-[#c5a46d] flex items-center justify-center mx-auto">
                                <Check className="w-5 h-5" />
                              </div>
                              <h5 className="font-['Playfair_Display',serif] text-xl text-[#1a1a1a]">
                                Detailed Quotation Request Received
                              </h5>
                              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
                                Your complete {BHK_PRESETS[state.bhk].label} ({state.carpetArea} sq. ft.) estimate breakdown has been sent to the NRB DESIGN team in Kolkata. Our design lead will reach out shortly.
                              </p>
                              <button
                                type="button"
                                onClick={() => setLeadSuccess(false)}
                                className="text-xs font-bold uppercase tracking-wider text-[#8c735d] hover:text-[#1a1a1a] underline cursor-pointer"
                              >
                                Send another request
                              </button>
                            </div>
                          ) : (
                            <form
                              onSubmit={handleLeadSubmit}
                              className="p-5 sm:p-6 rounded-xl bg-white border border-[#eae6df] space-y-4"
                            >
                              <div>
                                <h5 className="font-['Playfair_Display',serif] text-lg text-[#1a1a1a]">
                                  Get a Site Visit &amp; Detailed Quotation from NRB DESIGN
                                </h5>
                                <p className="text-xs text-stone-500 mt-0.5">
                                  Your selected rooms, materials, and indicative range will be attached automatically.
                                </p>
                              </div>

                              {leadError && (
                                <p className="text-xs text-red-600 font-medium">{leadError}</p>
                              )}

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                                    Full Name *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={clientName}
                                    onChange={(e) => {
                                      hasInteractedRef.current = true;
                                      setClientName(e.target.value);
                                    }}
                                    placeholder="Your name"
                                    className="w-full border border-[#d9cec0] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#242321]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                                    Mobile Number *
                                  </label>
                                  <input
                                    type="tel"
                                    required
                                    value={clientPhone}
                                    onChange={(e) => {
                                      hasInteractedRef.current = true;
                                      setClientPhone(e.target.value);
                                    }}
                                    placeholder="+91 98XXX XXXXX"
                                    className="w-full border border-[#d9cec0] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#242321]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                                    Email (Optional)
                                  </label>
                                  <input
                                    type="email"
                                    value={clientEmail}
                                    onChange={(e) => {
                                      hasInteractedRef.current = true;
                                      setClientEmail(e.target.value);
                                    }}
                                    placeholder="you@example.com"
                                    className="w-full border border-[#d9cec0] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#242321]"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                                  Project Notes / Preferred Possession Date (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={leadNotes}
                                  onChange={(e) => setLeadNotes(e.target.value)}
                                  placeholder="e.g., Floor plan available, possession in November"
                                  className="w-full border border-[#d9cec0] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#242321]"
                                />
                              </div>

                              <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={leadConsent}
                                  onChange={(e) => setLeadConsent(e.target.checked)}
                                  className="w-4 h-4 mt-0.5 accent-[#242321] cursor-pointer"
                                />
                                <span>
                                  I authorise NRB DESIGN to contact me via phone call or WhatsApp regarding this interior budget estimate.
                                </span>
                              </label>

                              <div className="flex justify-end">
                                <button
                                  type="submit"
                                  disabled={leadSubmitting}
                                  className="bg-[#242321] hover:bg-[#b3957b] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer disabled:bg-stone-400"
                                >
                                  {leadSubmitting ? 'Submitting...' : 'Submit Quotation Request'}
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* BOTTOM WIZARD NAVIGATION */}
          <div className="bg-[#fbf9f6] border-t border-[#eae6df] px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => goToStep(step - 1)}
              disabled={step === 1}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-[#d9cec0] bg-white text-[#3a3532] hover:border-[#242321] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="hidden sm:block text-xs text-stone-500">
              {step < 4
                ? 'All selections update your indicative estimate automatically.'
                : 'Modify any step above to explore alternative room or service combinations.'}
            </div>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => goToStep(step + 1)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#242321] hover:bg-[#b3957b] text-white transition-colors cursor-pointer min-h-[44px]"
              >
                <span>{step === 3 ? 'View Estimated Budget' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-white border border-[#d9cec0] hover:border-[#242321] text-[#3a3532] transition-colors cursor-pointer min-h-[44px]"
              >
                <span>Adjust Home Details</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
