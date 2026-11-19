import { jsPDF } from 'jspdf';
import {
  BHK_PRESETS,
  EstimateOutput,
  PlannerState,
  PROJECT_TYPE_OPTIONS,
  PROPERTY_STATUS_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from '../data/calculatorConfig';

function formatPdfINR(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString('en-IN')}`;
}

function formatPdfLakhs(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    const trimmed = Number.isInteger(lakhs * 10) ? lakhs.toFixed(1) : lakhs.toFixed(2);
    return `Rs. ${trimmed}L`;
  }
  return formatPdfINR(amount);
}

export function generateBudgetPdf(
  state: PlannerState,
  estimate: EstimateOutput,
  clientInfo?: { name?: string; phone?: string; email?: string }
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  const charcoal: [number, number, number] = [36, 35, 33];
  const gold: [number, number, number] = [179, 149, 123];
  const ivory: [number, number, number] = [247, 245, 242];
  const mutedText: [number, number, number] = [105, 98, 92];
  const darkText: [number, number, number] = [38, 34, 31];
  const lineColor: [number, number, number] = [226, 220, 212];

  // Header Banner
  doc.setFillColor(...charcoal);
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setTextColor(235, 213, 157);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('NRB DESIGN', margin, 15);

  doc.setTextColor(247, 245, 242);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('NRB HOME BUDGET PLANNER  |  INDICATIVE INVESTMENT ESTIMATE', margin, 22);

  doc.setTextColor(197, 186, 174);
  doc.setFontSize(8);
  doc.text('23, Kalidas Patitundi Ln, Kalighat, Kolkata - 700026   |   +91-8240019657', margin, 30);

  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  doc.text(`Generated: ${generatedDate}`, pageWidth - margin, 15, { align: 'right' });

  let y = 48;

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // Property Summary Card
  const propLabel = PROPERTY_TYPE_OPTIONS.find((p) => p.id === state.propertyType)?.label ?? 'Apartment';
  const bhkLabel = BHK_PRESETS[state.bhk].label;
  const locationDisplay =
    state.location === 'Other' && state.customLocation.trim()
      ? state.customLocation.trim()
      : state.location;
  const statusLabel =
    PROPERTY_STATUS_OPTIONS.find((s) => s.id === state.propertyStatus)?.label ?? '';
  const projectLabel =
    PROJECT_TYPE_OPTIONS.find((p) => p.id === state.projectType)?.label ?? '';

  const hasClient = Boolean(clientInfo?.name?.trim() || clientInfo?.phone?.trim());
  const cardHeight = hasClient ? 35 : 30;

  doc.setFillColor(...ivory);
  doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'F');
  doc.setDrawColor(...lineColor);
  doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'S');

  doc.setTextColor(...mutedText);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('PROPERTY PROFILE', margin + 5, y + 6);
  doc.text('EXECUTION TIMELINE & SCOPE', margin + contentWidth / 2 + 4, y + 6);

  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(`${bhkLabel} ${propLabel} · ${state.carpetArea.toLocaleString('en-IN')} sq. ft.`, margin + 5, y + 13);
  doc.text(estimate.timeline, margin + contentWidth / 2 + 4, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...mutedText);
  doc.text(`Location: ${locationDisplay}`, margin + 5, y + 19.5);
  doc.text(`Status: ${statusLabel} · ${projectLabel}`, margin + 5, y + 25);
  doc.text(`${estimate.breakdown.length} selected space/service sections`, margin + contentWidth / 2 + 4, y + 19.5);
  if (state.needDesignGuidance) {
    doc.text('Requested NRB DESIGN expert guidance on scope', margin + contentWidth / 2 + 4, y + 25);
  }
  if (hasClient) {
    const clientLine = [clientInfo?.name?.trim(), clientInfo?.phone?.trim()].filter(Boolean).join(' · ');
    doc.text(`Prepared for: ${clientLine}`, margin + 5, y + 30.5);
  }

  y += cardHeight + 8;

  // Indicative Total Highlight Box
  doc.setFillColor(...charcoal);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

  doc.setTextColor(...gold);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('INDICATIVE INVESTMENT ESTIMATE (EXCL. GST & LOOSE APPLIANCES)', margin + 6, y + 7);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  const totalDisplay =
    estimate.minTotal === estimate.maxTotal
      ? formatPdfINR(estimate.minTotal)
      : `${formatPdfINR(estimate.minTotal)}  -  ${formatPdfINR(estimate.maxTotal)}`;
  doc.text(totalDisplay, margin + 6, y + 16.5);

  doc.setTextColor(235, 213, 157);
  doc.setFontSize(11);
  const totalLakhsDisplay =
    estimate.minTotal === estimate.maxTotal
      ? formatPdfLakhs(estimate.minTotal)
      : `${formatPdfLakhs(estimate.minTotal)} - ${formatPdfLakhs(estimate.maxTotal)}`;
  doc.text(totalLakhsDisplay, pageWidth - margin - 6, y + 16.5, { align: 'right' });

  y += 33;

  // Scope & Room Breakdown Table
  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Scope & Component-Wise Breakdown', margin, y);
  y += 5;

  doc.setFillColor(238, 234, 228);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFontSize(8);
  doc.setTextColor(...mutedText);
  doc.text('SPACE / COMPONENT', margin + 3, y + 5.5);
  doc.text('SCOPE STATUS', pageWidth - margin - 3, y + 5.5, { align: 'right' });
  y += 10;

  estimate.breakdown.forEach((line) => {
    const detailLines = doc.splitTextToSize(`${line.detail}  [${line.pricingBasis}]`, contentWidth - 40);
    const rowHeight = Math.max(11, 6 + detailLines.length * 4.2);
    ensureSpace(rowHeight + 2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(...darkText);
    doc.text(line.label, margin + 3, y + 4);

    doc.text('Included', pageWidth - margin - 3, y + 4, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(...mutedText);
    doc.text(detailLines, margin + 3, y + 8.5);

    y += rowHeight;
    doc.setDrawColor(...lineColor);
    doc.line(margin, y, pageWidth - margin, y);
    y += 2.5;
  });

  y += 5;

  // Project Scope Summary
  ensureSpace(42);
  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Selected Home & Scope Summary', margin, y);
  y += 5;

  estimate.scopeSummary.forEach((item) => {
    ensureSpace(7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(...mutedText);
    doc.text(item.label, margin + 3, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text(item.value, margin + 52, y + 4);

    y += 6.2;
  });

  y += 6;

  // Included vs Excluded
  ensureSpace(40);
  const colW = (contentWidth - 6) / 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...darkText);
  doc.text('Included in Scope', margin, y);
  doc.text('Typically Excluded', margin + colW + 6, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedText);

  let leftY = y;
  estimate.includedItems.forEach((inc) => {
    const wrapped = doc.splitTextToSize(`• ${inc}`, colW);
    doc.text(wrapped, margin, leftY);
    leftY += wrapped.length * 4 + 1.2;
  });

  let rightY = y;
  estimate.excludedItems.forEach((exc) => {
    const wrapped = doc.splitTextToSize(`• ${exc}`, colW);
    doc.text(wrapped, margin + colW + 6, rightY);
    rightY += wrapped.length * 4 + 1.2;
  });

  y = Math.max(leftY, rightY) + 6;

  // Official Disclaimer Box
  ensureSpace(26);
  doc.setFillColor(...ivory);
  doc.roundedRect(margin, y, contentWidth, 21, 2, 2, 'F');
  doc.setDrawColor(...gold);
  doc.roundedRect(margin, y, contentWidth, 21, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...darkText);
  doc.text('IMPORTANT DISCLAIMER', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(...mutedText);
  const disclaimer =
    'This document provides an indicative budget estimate based on your preliminary inputs and NRB DESIGN standard allowances. It is not a final quotation. The confirmed project quote will depend on on-site measurements, finalised 2D/3D designs, confirmed brand/material codes, and approved scope of work.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth - 8);
  doc.text(disclaimerLines, margin + 4, y + 10.5);

  doc.save('NRB_Home_Budget_Estimate.pdf');
}
