/**
 * Floatcap — Payout Delay Cost Calculator Math
 *
 * The formulas live here so the same logic can be reused in other surfaces
 * without coupling calculations to any specific DOM implementation.
 */

const DAYS_IN_MONTH = 30;
const DAYS_IN_YEAR = 365;

export const DEFAULT_CALCULATOR_INPUTS = {
    monthlyRevenue: 200000,
    payoutDelayDays: 60,
    monthlyInferenceCost: 60000,
    otherVariableCosts: 20000,
    internalReturnPercent: 18,
    financingRatePercent: null,
};

export const CASE_STUDY_INPUTS = {
    monthlyRevenue: 100000,
    payoutDelayDays: 45,
    monthlyInferenceCost: 35000,
    otherVariableCosts: 10000,
    internalReturnPercent: 20,
    financingRatePercent: null,
};

function clampNumber(value, { min = 0, max = Number.POSITIVE_INFINITY, fallback = 0 } = {}) {
    const parsed = Number.parseFloat(value);

    if (!Number.isFinite(parsed)) return fallback;

    return Math.min(Math.max(parsed, min), max);
}

function normaliseOptionalRate(value) {
    if (value === '' || value === null || value === undefined) return null;

    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;

    return Math.min(parsed, 100);
}

export function sanitiseCalculatorInputs(inputs = {}) {
    return {
        monthlyRevenue: clampNumber(inputs.monthlyRevenue),
        payoutDelayDays: clampNumber(inputs.payoutDelayDays, { max: DAYS_IN_YEAR, fallback: 0 }),
        monthlyInferenceCost: clampNumber(inputs.monthlyInferenceCost),
        otherVariableCosts: clampNumber(inputs.otherVariableCosts),
        internalReturnPercent: clampNumber(inputs.internalReturnPercent, { max: 100, fallback: 0 }),
        financingRatePercent: normaliseOptionalRate(inputs.financingRatePercent),
    };
}

export function calculatePayoutDelayMetrics(inputs = {}) {
    const normalised = sanitiseCalculatorInputs(inputs);
    const internalReturn = normalised.internalReturnPercent / 100;
    const financingRate = normalised.financingRatePercent === null
        ? null
        : normalised.financingRatePercent / 100;

    // Revenue is assumed to accrue evenly across a 30-day month.
    const dailyRevenue = normalised.monthlyRevenue / DAYS_IN_MONTH;

    // Capital tied up is the receivable balance created by the payout delay.
    const capitalTiedUp = dailyRevenue * normalised.payoutDelayDays;

    // Variable delivery costs capture compute plus any other usage-linked costs.
    const monthlyVariableCostBase = normalised.monthlyInferenceCost + normalised.otherVariableCosts;

    // The working capital gap estimates costs that must be covered before cash arrives.
    const workingCapitalGap = Math.max(
        0,
        monthlyVariableCostBase * (normalised.payoutDelayDays / DAYS_IN_MONTH)
    );

    // Opportunity cost estimates the annual value of redeploying trapped cash.
    const annualOpportunityCost = capitalTiedUp * internalReturn;

    // Financing cost is a secondary comparison when a rate is supplied.
    const estimatedFinancingCost = financingRate === null
        ? null
        : capitalTiedUp * financingRate * (normalised.payoutDelayDays / DAYS_IN_YEAR);

    // Translate trapped cash into operating runway against current delivery costs.
    const growthCapacityMonths = monthlyVariableCostBase > 0
        ? capitalTiedUp / monthlyVariableCostBase
        : 0;
    const growthCapacityDays = growthCapacityMonths * DAYS_IN_MONTH;

    return {
        inputs: normalised,
        internalReturn,
        financingRate,
        dailyRevenue,
        capitalTiedUp,
        monthlyVariableCostBase,
        workingCapitalGap,
        annualOpportunityCost,
        estimatedFinancingCost,
        growthCapacityMonths,
        growthCapacityDays,
    };
}
