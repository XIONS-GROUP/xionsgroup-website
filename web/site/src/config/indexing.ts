const isProductionDeploy = process.env.CONTEXT === 'production';
const productionIndexingEnabled = process.env.ALLOW_INDEXING === 'true';

export const allowIndexing = isProductionDeploy && productionIndexingEnabled;
export const robotsDirective = allowIndexing ? 'index, follow' : 'noindex, nofollow';
