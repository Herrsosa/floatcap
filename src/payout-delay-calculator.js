import {
    calculatePayoutDelayMetrics,
    CASE_STUDY_INPUTS,
    DEFAULT_CALCULATOR_INPUTS,
} from './payout-delay-math.js';
import {
    formatCurrency,
    formatNumber,
    formatPercent,
    getDefaultCurrency,
} from './formatters.js';

const CURRENCY_SYMBOLS = {
    GBP: '£',
    USD: '$',
};

function createInputField({
    id,
    label,
    type = 'number',
    value = '',
    step = '1',
    min = '0',
    optional = false,
    helpText = '',
}) {
    return `
        <div class="calculator-field">
            <label for="${id}">${label}${optional ? ' <span>(optional)</span>' : ''}</label>
            ${helpText ? `<p class="calculator-field-help" id="${id}Help">${helpText}</p>` : ''}
            <input
                id="${id}"
                name="${id}"
                type="${type}"
                inputmode="decimal"
                min="${min}"
                step="${step}"
                value="${value}"
                ${helpText ? `aria-describedby="${id}Help"` : ''}
            >
        </div>
    `;
}

function getCaseStudyMarkup() {
    return `
        <article class="calculator-case-study" data-reveal data-reveal-delay="2" aria-labelledby="calculator-case-study-heading">
            <div class="calculator-case-study-top">
                <div>
                    <p class="calculator-case-study-eyebrow">Worked case</p>
                    <h3 id="calculator-case-study-heading">How a healthy AI company can still end up short on cash</h3>
                    <p class="calculator-case-study-intro">Worked example using a healthy AI company with delayed collections and immediate compute spend.</p>
                </div>
                <button class="calculator-case-study-load" id="loadCaseStudyButton" type="button">Load this example</button>
            </div>
            <p class="calculator-case-study-inputs" id="caseStudyInputs"></p>
            <div class="calculator-case-study-metrics">
                <div class="calculator-case-study-metric">
                    <span>Capital tied up</span>
                    <strong id="caseStudyCapitalTiedUpValue"></strong>
                </div>
                <div class="calculator-case-study-metric">
                    <span>Working capital gap</span>
                    <strong id="caseStudyWorkingCapitalGapValue"></strong>
                </div>
                <div class="calculator-case-study-metric">
                    <span>Annual opportunity cost</span>
                    <strong id="caseStudyAnnualOpportunityCostValue"></strong>
                </div>
            </div>
            <p class="calculator-case-study-copy">Despite healthy revenue, the company must fund compute and delivery costs weeks before collections arrive, creating a recurring working-capital gap.</p>
        </article>
    `;
}

export function createPayoutDelayCalculatorSection(currency = getDefaultCurrency()) {
    const symbol = CURRENCY_SYMBOLS[currency] || '$';

    return `
        <section class="section-pad-sm calculator-section" id="calculator" aria-labelledby="calculator-heading">
            <div class="container">
                <div class="section-head" data-reveal>
                    <span class="eyebrow">Finance tool</span>
                    <h2 id="calculator-heading">Payout Delay Cost Calculator</h2>
                    <p>See how much cash is trapped between inference spend today and revenue collected later.</p>
                </div>

                <div class="calculator-shell">
                    <form class="calculator-card calculator-inputs" data-reveal novalidate aria-label="Payout delay cost calculator inputs">
                        <div class="calculator-card-head">
                            <div>
                                <p class="calculator-kicker">Inputs</p>
                                <h3>Set the operating assumptions</h3>
                            </div>
                            <div class="calculator-currency" role="group" aria-label="Select currency">
                                <button class="currency-toggle ${currency === 'GBP' ? 'active' : ''}" type="button" data-currency="GBP" aria-pressed="${currency === 'GBP'}">£</button>
                                <button class="currency-toggle ${currency === 'USD' ? 'active' : ''}" type="button" data-currency="USD" aria-pressed="${currency === 'USD'}">$</button>
                            </div>
                        </div>

                        <div class="calculator-input-grid">
                            ${createInputField({
                                id: 'monthlyRevenue',
                                label: `Monthly revenue (${symbol})`,
                                value: DEFAULT_CALCULATOR_INPUTS.monthlyRevenue,
                                step: '1000',
                            })}
                            ${createInputField({
                                id: 'payoutDelayDays',
                                label: 'Average payout delay (days)',
                                value: DEFAULT_CALCULATOR_INPUTS.payoutDelayDays,
                                step: '1',
                            })}
                            ${createInputField({
                                id: 'monthlyInferenceCost',
                                label: `Monthly compute cost (${symbol})`,
                                value: DEFAULT_CALCULATOR_INPUTS.monthlyInferenceCost,
                                step: '1000',
                            })}
                            ${createInputField({
                                id: 'otherVariableCosts',
                                label: `Other variable delivery costs (${symbol})`,
                                value: DEFAULT_CALCULATOR_INPUTS.otherVariableCosts,
                                step: '1000',
                                optional: true,
                            })}
                            <div class="calculator-field calculator-field-wide">
                                <div class="calculator-label-row">
                                    <label for="internalReturnPercent">Expected annual redeployment return (%)</label>
                                    <button type="button" class="calculator-tooltip-trigger" aria-describedby="internalReturnTooltip" aria-label="Explain expected annual redeployment return">i</button>
                                    <span class="calculator-tooltip" id="internalReturnTooltip" role="tooltip">Expected return if trapped cash could be reinvested in growth, sales, or product</span>
                                </div>
                                <input id="internalReturnPercent" name="internalReturnPercent" type="number" inputmode="decimal" min="0" max="100" step="0.5" value="${DEFAULT_CALCULATOR_INPUTS.internalReturnPercent}">
                            </div>
                        </div>

                        <details class="calculator-advanced">
                            <summary>Advanced assumptions</summary>
                            <div class="calculator-advanced-body">
                                ${createInputField({
                                    id: 'financingRatePercent',
                                    label: 'Optional financing rate (%)',
                                    value: '',
                                    step: '0.1',
                                    optional: true,
                                })}
                            </div>
                        </details>
                    </form>

                    <div class="calculator-card calculator-results" data-reveal data-reveal-delay="1" aria-labelledby="calculator-results-heading">
                        <div class="calculator-card-head calculator-results-head">
                            <div>
                                <p class="calculator-kicker">Illustrative estimate</p>
                                <h3 id="calculator-results-heading">Cash tied up by payout delays</h3>
                            </div>
                            <p class="calculator-results-note">Illustrative estimate only — not a lending offer or credit decision.</p>
                        </div>

                        <div class="calculator-scenario-summary" aria-live="polite" aria-atomic="true">
                            <span class="calculator-summary-label">How your assumptions translate</span>
                            <p id="scenarioSummaryPrimary"></p>
                            <p id="scenarioSummarySecondary"></p>
                        </div>

                        <div class="calculator-headline-metric">
                            <span class="metric-label">Capital tied up</span>
                            <strong id="capitalTiedUpValue" role="status" aria-live="polite" aria-atomic="true"></strong>
                            <p id="capitalTiedUpContext">Cash trapped by payout terms before collection clears.</p>
                        </div>

                        <div class="calculator-metric-grid">
                            <article class="calculator-metric-card">
                                <span>Monthly working capital gap</span>
                                <strong id="workingCapitalGapValue"></strong>
                                <p>Estimated variable delivery cost exposure during the delay window.</p>
                            </article>
                            <article class="calculator-metric-card">
                                <span>Annual opportunity cost</span>
                                <strong id="annualOpportunityCostValue"></strong>
                                <p id="annualOpportunityCostContext"></p>
                            </article>
                            <article class="calculator-metric-card">
                                <span>Additional operating days funded</span>
                                <strong id="operatingDaysFundedValue"></strong>
                                <p id="operatingDaysFundedContext"></p>
                            </article>
                        </div>

                        <div class="calculator-financing-compare" id="financingComparison" hidden>
                            <span>Estimated financing cost comparison</span>
                            <strong id="estimatedFinancingCostValue"></strong>
                            <p id="estimatedFinancingCostContext"></p>
                        </div>

                        <details class="calculator-methodology">
                            <summary>How we calculate this</summary>
                            <div class="calculator-methodology-body">
                                <div class="calculator-method-row">
                                    <span>Capital tied up</span>
                                    <p id="capitalFormula"></p>
                                </div>
                                <div class="calculator-method-row">
                                    <span>Working capital gap</span>
                                    <p id="gapFormula"></p>
                                </div>
                                <div class="calculator-method-row">
                                    <span>Opportunity cost</span>
                                    <p id="opportunityFormula"></p>
                                </div>
                                <p class="calculator-method-note">Assumes revenue and variable delivery costs accrue evenly across a 30-day month.</p>
                            </div>
                        </details>

                        <div class="calculator-actions">
                            <a href="#waitlist" class="btn-gold">See if Floatcap can fund this gap</a>
                            <a href="mailto:hello@floatcap.co?subject=Floatcap%20working%20capital%20gap" class="btn-outline">Talk to us</a>
                        </div>
                    </div>
                </div>

                ${getCaseStudyMarkup()}
            </div>
        </section>
    `;
}

function updateCurrencyLabels(section, currency) {
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    const labelMap = new Map([
        ['monthlyRevenue', `Monthly revenue (${symbol})`],
        ['monthlyInferenceCost', `Monthly compute cost (${symbol})`],
        ['otherVariableCosts', `Other variable delivery costs (${symbol}) <span>(optional)</span>`],
    ]);

    labelMap.forEach((label, inputId) => {
        const input = section.querySelector(`#${inputId}`);
        const fieldLabel = input?.closest('.calculator-field')?.querySelector('label');
        if (fieldLabel) fieldLabel.innerHTML = label;
    });
}

function readInputs(section) {
    const read = (selector) => section.querySelector(selector)?.value ?? '';

    return {
        monthlyRevenue: read('#monthlyRevenue'),
        payoutDelayDays: read('#payoutDelayDays'),
        monthlyInferenceCost: read('#monthlyInferenceCost'),
        otherVariableCosts: read('#otherVariableCosts'),
        internalReturnPercent: read('#internalReturnPercent'),
        financingRatePercent: read('#financingRatePercent'),
    };
}

function syncClampedInputs(section, metrics) {
    const { inputs } = metrics;

    section.querySelector('#monthlyRevenue').value = inputs.monthlyRevenue;
    section.querySelector('#payoutDelayDays').value = inputs.payoutDelayDays;
    section.querySelector('#monthlyInferenceCost').value = inputs.monthlyInferenceCost;
    section.querySelector('#otherVariableCosts').value = inputs.otherVariableCosts;
    section.querySelector('#internalReturnPercent').value = inputs.internalReturnPercent;
    section.querySelector('#financingRatePercent').value = inputs.financingRatePercent ?? '';
}

function writeInputs(section, values) {
    const metrics = calculatePayoutDelayMetrics(values);
    syncClampedInputs(section, metrics);
}

function updateCaseStudy(section, currency) {
    const metrics = calculatePayoutDelayMetrics(CASE_STUDY_INPUTS);

    section.querySelector('#caseStudyInputs').textContent = `${formatCurrency(CASE_STUDY_INPUTS.monthlyRevenue, currency)} monthly revenue · ${CASE_STUDY_INPUTS.payoutDelayDays} day payout delay · ${formatCurrency(CASE_STUDY_INPUTS.monthlyInferenceCost, currency)} compute cost · ${formatCurrency(CASE_STUDY_INPUTS.otherVariableCosts, currency)} other variable costs · ${CASE_STUDY_INPUTS.internalReturnPercent}% redeployment return`;
    section.querySelector('#caseStudyCapitalTiedUpValue').textContent = formatCurrency(metrics.capitalTiedUp, currency);
    section.querySelector('#caseStudyWorkingCapitalGapValue').textContent = formatCurrency(metrics.workingCapitalGap, currency);
    section.querySelector('#caseStudyAnnualOpportunityCostValue').textContent = formatCurrency(metrics.annualOpportunityCost, currency);
}

function updateResults(section, currency) {
    const metrics = calculatePayoutDelayMetrics(readInputs(section));
    syncClampedInputs(section, metrics);
    const payoutDelayText = `${formatNumber(metrics.inputs.payoutDelayDays)}-day`;
    const monthlyVariableCostBase = formatCurrency(metrics.monthlyVariableCostBase, currency);

    section.querySelector('#capitalTiedUpValue').textContent = formatCurrency(metrics.capitalTiedUp, currency);
    section.querySelector('#workingCapitalGapValue').textContent = formatCurrency(metrics.workingCapitalGap, currency);
    section.querySelector('#annualOpportunityCostValue').textContent = formatCurrency(metrics.annualOpportunityCost, currency);
    section.querySelector('#operatingDaysFundedValue').textContent = `${formatNumber(metrics.growthCapacityDays)} days`;

    section.querySelector('#annualOpportunityCostContext').textContent = `${formatPercent(metrics.internalReturn)} annual redeployment return applied to trapped cash.`;
    section.querySelector('#operatingDaysFundedContext').textContent = `Equivalent to roughly ${formatNumber(metrics.growthCapacityMonths, 1)} months of current compute and delivery spend.`;
    section.querySelector('#scenarioSummaryPrimary').textContent = `Based on ${formatCurrency(metrics.inputs.monthlyRevenue, currency)} monthly revenue and ${payoutDelayText} payout terms, about ${formatCurrency(metrics.capitalTiedUp, currency)} is tied up before collection clears.`;
    section.querySelector('#scenarioSummarySecondary').textContent = `With ${monthlyVariableCostBase} of monthly compute and delivery cost exposure, the estimated working capital gap across that delay window is ${formatCurrency(metrics.workingCapitalGap, currency)}.`;
    section.querySelector('#capitalFormula').textContent = `${formatCurrency(metrics.inputs.monthlyRevenue, currency)} ÷ 30 × ${formatNumber(metrics.inputs.payoutDelayDays)} days = ${formatCurrency(metrics.capitalTiedUp, currency)}.`;
    section.querySelector('#gapFormula').textContent = `${monthlyVariableCostBase} × (${formatNumber(metrics.inputs.payoutDelayDays)} ÷ 30) = ${formatCurrency(metrics.workingCapitalGap, currency)}.`;
    section.querySelector('#opportunityFormula').textContent = `${formatCurrency(metrics.capitalTiedUp, currency)} × ${formatPercent(metrics.internalReturn)} = ${formatCurrency(metrics.annualOpportunityCost, currency)} per year.`;

    const financingComparison = section.querySelector('#financingComparison');
    const financingValue = section.querySelector('#estimatedFinancingCostValue');
    const financingContext = section.querySelector('#estimatedFinancingCostContext');

    if (metrics.estimatedFinancingCost === null) {
        financingComparison.hidden = true;
        financingValue.textContent = '';
        financingContext.textContent = '';
    } else {
        financingComparison.hidden = false;
        financingValue.textContent = formatCurrency(metrics.estimatedFinancingCost, currency);
        financingContext.textContent = `${formatPercent(metrics.financingRate)} annualised financing rate applied across a ${formatNumber(metrics.inputs.payoutDelayDays)} day collection period.`;
    }
}

export function initPayoutDelayCalculator() {
    const mountPoint = document.getElementById('payoutDelayCalculatorMount');
    if (!mountPoint) return;

    let activeCurrency = getDefaultCurrency();
    if (!CURRENCY_SYMBOLS[activeCurrency]) activeCurrency = 'USD';

    mountPoint.innerHTML = createPayoutDelayCalculatorSection(activeCurrency);

    const section = mountPoint.querySelector('.calculator-section');
    if (!section) return;

    const toggleButtons = section.querySelectorAll('.currency-toggle');
    const inputs = section.querySelectorAll('input');
    const loadCaseStudyButton = section.querySelector('#loadCaseStudyButton');

    const render = () => {
        updateCurrencyLabels(section, activeCurrency);
        toggleButtons.forEach((button) => {
            const isActive = button.dataset.currency === activeCurrency;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });

        updateResults(section, activeCurrency);
        updateCaseStudy(section, activeCurrency);
    };

    toggleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activeCurrency = button.dataset.currency || activeCurrency;
            render();
        });
    });

    inputs.forEach((input) => {
        input.addEventListener('input', render);
        input.addEventListener('blur', render);
    });

    loadCaseStudyButton?.addEventListener('click', () => {
        writeInputs(section, CASE_STUDY_INPUTS);
        render();
    });

    render();
}
