/* Sketch protocol economics — single source of truth for fee numbers
   shown in the UI. Must match the fee-collector contract when it ships. */

// Uniswap V3 pool fee tier every token launches with (1%)
export const POOL_FEE = 0.01;

// LP fee split: 60% platform treasury / 40% creator
export const PLATFORM_FEE_SHARE = 0.6;
export const CREATOR_FEE_SHARE = 0.4;

export const CREATOR_FEE_PCT = `${CREATOR_FEE_SHARE * 100}%`;
export const PLATFORM_FEE_PCT = `${PLATFORM_FEE_SHARE * 100}%`;
