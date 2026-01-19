
import { EarningsCategory } from '@/types'

type WalletType = 'general' | 'personal'

interface RateConfig {
    max: number // Upper bound of the range (exclusive, or effectively inclusive depending on logic). Using strictly less logic usually.
    percent: number
}

// Helper to define open-ended last tier by using Infinity?
// Or just check logic. "Up to 1000", "Over 1000 to 6000".
// I'll stick to: if amount <= max, use percent. 
// Ordered list. First match wins.

const createTiers = (tiers: [number, number][]): RateConfig[] => {
    return tiers.map(([max, percent]) => ({ max, percent: percent / 100 }))
}

// 2.3.x - General Wallet
const GENERAL_RATES: Record<string, RateConfig[]> = {
    // 2.3.2 Memecoins (non-deving)
    memecoins_regular: createTiers([
        [1000, 30],
        [6000, 40],
        [12000, 50],
        [Infinity, 60]
    ]),
    // 2.3.3 Memecoins (deving)
    memecoins_deving: createTiers([
        [10000, 15],
        [20000, 20],
        [30000, 25],
        [60000, 30],
        [Infinity, 40]
    ]),
    // 2.3.4 Polymarket
    polymarket: createTiers([
        [1000, 30],
        [6000, 40],
        [12000, 50],
        [Infinity, 60]
    ]),
    // 2.3.5 NFT
    nft: createTiers([
        [1000, 25],
        [6000, 35],
        [12000, 40],
        [20000, 50],
        [Infinity, 60]
    ]),
    // 2.3.6 Staking
    staking: createTiers([
        [1000, 15],
        [3000, 20],
        [5000, 25],
        [10000, 35],
        [Infinity, 40]
    ]),
    // 2.3.7 Spot
    spot: createTiers([
        [1000, 20],
        [5000, 25],
        [20000, 35],
        [50000, 45],
        [Infinity, 60]
    ]),
    // 2.3.8 Futures
    futures: createTiers([
        [1000, 15],
        [5000, 25],
        [20000, 35],
        [50000, 50],
        [Infinity, 60]
    ]),
    // 2.3.9 AirDrop
    airdrop: createTiers([
        [1000, 25],
        [3000, 30],
        [5000, 35],
        [10000, 40],
        [Infinity, 50]
    ])
}

// 2.2.x - Personal Wallet
const PERSONAL_RATES: Record<string, RateConfig[]> = {
    // 2.2.1 Memecoins (non-deving)
    memecoins_regular: createTiers([
        [1000, 15],
        [3000, 20],
        [5000, 25],
        [10000, 30],
        [Infinity, 35]
    ]),
    // 2.2.2 Memecoins (deving)
    memecoins_deving: createTiers([
        [10000, 15],
        [20000, 20],
        [30000, 25],
        [60000, 30],
        [Infinity, 40] // Same as general? Yes 2.2.2.5 says 40.
    ]),
    // 2.2.3 Polymarket
    polymarket: createTiers([
        [1000, 25],
        [3000, 30],
        [5000, 35],
        [10000, 40],
        [Infinity, 45]
    ]),
    // 2.2.4 NFT
    nft: createTiers([
        [1000, 15],
        [3000, 20],
        [5000, 25],
        [10000, 30],
        [Infinity, 40]
    ]),
    // 2.2.5 Staking
    staking: createTiers([
        [1000, 10],
        [3000, 15],
        [5000, 20],
        [10000, 25],
        [Infinity, 30]
    ]),
    // 2.2.6 Spot
    spot: createTiers([
        [1000, 10],
        [5000, 15],
        [20000, 20],
        [50000, 25],
        [Infinity, 30]
    ]),
    // 2.2.7 Futures
    futures: createTiers([
        [1000, 10],
        [5000, 15],
        [20000, 20],
        [50000, 25],
        [Infinity, 30]
    ]),
    // 2.2.8 AirDrop
    airdrop: createTiers([
        [1000, 15],
        [3000, 20],
        [5000, 25],
        [10000, 30],
        [Infinity, 40]
    ])
}

const getRateKey = (category: EarningsCategory, isDeving: boolean): string => {
    if (category === 'memecoins') {
        return isDeving ? 'memecoins_deving' : 'memecoins_regular'
    }
    return category
}

export const calculatePoolShare = (
    amount: number,
    category: EarningsCategory,
    walletType: WalletType,
    isDeving: boolean = false
): { poolShare: number; percent: number } => {
    if (amount <= 0) return { poolShare: 0, percent: 0 }

    const rates = walletType === 'general' ? GENERAL_RATES : PERSONAL_RATES
    const key = getRateKey(category, isDeving)
    const tiers = rates[key] || rates['other']

    if (!tiers) {
        // Fallback if 'other' or unknown. Default to basic logic or 0? 
        // Assuming 45% as in old logic if strict match fails, but we should cover all.
        // 'other' was not in the new spec.
        return { poolShare: amount * 0.45, percent: 0.45 }
    }

    // Find the matching tier
    const tier = tiers.find(t => amount <= t.max) || tiers[tiers.length - 1]

    return {
        poolShare: amount * tier.percent,
        percent: tier.percent
    }
}

export const calculateTotalEarnings = (
    mainAmount: number,
    walletType: WalletType,
    copyWalletsCount: number = 0,
    extraWalletsAmount: number = 0
): number => {
    if (walletType === 'general') {
        return mainAmount + (copyWalletsCount * mainAmount)
    } else {
        return mainAmount + extraWalletsAmount
    }
}
