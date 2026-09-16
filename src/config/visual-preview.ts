// Review annotations must never appear in a production build.
export const visualPreview = process.env.CONTEXT !== 'production';
