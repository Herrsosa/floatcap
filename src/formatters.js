/**
 * Floatcap — Shared formatting helpers
 */

const CURRENCY_LOCALE_MAP = {
    GBP: 'en-GB',
    USD: 'en-US',
};

export function getPreferredLocale() {
    const documentLocale = document.documentElement.lang?.trim();
    return documentLocale || navigator.language || 'en-US';
}

export function getDefaultCurrency() {
    const locale = (document.documentElement.lang || navigator.language || 'en-US').toLowerCase();
    return locale.includes('gb') ? 'GBP' : 'USD';
}

export function formatCurrency(value, currency = 'USD') {
    const locale = CURRENCY_LOCALE_MAP[currency] || getPreferredLocale();

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatPercent(value, digits = 0) {
    return new Intl.NumberFormat(getPreferredLocale(), {
        style: 'percent',
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
    }).format(value);
}

export function formatNumber(value, digits = 0) {
    return new Intl.NumberFormat(getPreferredLocale(), {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
    }).format(value);
}
