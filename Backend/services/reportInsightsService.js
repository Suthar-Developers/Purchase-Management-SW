const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
}).format(Number(value || 0));

// Rule-based insights generated from report analytics.
// Add new business rules here for budget risk, vendor risk, duplicate purchases, etc.
const buildInsights = ({ overview, analytics }) => {
    const insights = [];
    const vendors = analytics.charts.vendorWise || [];
    const rates = analytics.charts.itemRates || [];
    const projects = analytics.charts.projectWise || [];

    const topVendor = vendors[0];
    if (topVendor) {
        // Flags when one vendor dominates purchase value.
        insights.push({
            type: 'vendor-dependency-risk',
            severity: vendors.length > 1 && topVendor.value > vendors.slice(1).reduce((sum, item) => sum + Number(item.value || 0), 0) ? 'high' : 'medium',
            title: 'Vendor dependency check',
            message: `${topVendor.label} currently has the highest purchase value at ${formatCurrency(topVendor.value)}.`,
            recommendation: 'Compare at least two alternate vendors for high-value repeat materials.'
        });
    }

    const volatileRate = rates.find((item) => Number(item.highestRate || 0) > Number(item.lowestRate || 0) * 1.12);
    if (volatileRate) {
        // Flags items where the rate spread is more than 12%.
        const saving = (Number(volatileRate.highestRate) - Number(volatileRate.lowestRate)) * Number(volatileRate.quantity || 0);
        insights.push({
            type: 'items-with-rising-prices',
            severity: 'high',
            title: 'Material rate movement detected',
            message: `${volatileRate.label} moved between ${formatCurrency(volatileRate.lowestRate)} and ${formatCurrency(volatileRate.highestRate)}.`,
            recommendation: `Benchmark vendors before the next order. Lowest historical pricing indicates possible savings of ${formatCurrency(saving)}.`
        });
    }

    const largestProject = projects[0];
    if (largestProject) {
        // Highlights the highest-spend project for quick budget review.
        insights.push({
            type: 'budget-risk',
            severity: 'medium',
            title: 'Project spend concentration',
            message: `${largestProject.label} is the highest consuming project with ${formatCurrency(largestProject.value)} spend.`,
            recommendation: 'Review remaining budget and approval cycle before releasing new purchase orders.'
        });
    }

    if (Number(overview.summary.pendingPO || 0) > Number(overview.summary.approvedPO || 0)) {
        insights.push({
            type: 'slow-procurement-process',
            severity: 'medium',
            title: 'Pending approvals require attention',
            message: `${overview.summary.pendingPO} purchase orders are still pending.`,
            recommendation: 'Use approval analytics to identify approver bottlenecks and long pending POs.'
        });
    }

    if (!insights.length) {
        insights.push({
            type: 'healthy-procurement',
            severity: 'low',
            title: 'No major procurement risk detected',
            message: 'Current purchase activity is balanced across available reporting dimensions.',
            recommendation: 'Continue monitoring vendor rates and project-wise spend weekly.'
        });
    }

    return insights;
};

module.exports = { buildInsights };
