'use client'

import {
  rabbyWallet,
  rainbowWallet,
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
  safeWallet
} from '@rainbow-me/rainbowkit/wallets'
import { mainnet, optimism, base } from 'wagmi/chains'
import { type Chain, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { http, fallback, createStorage, cookieStorage, createConfig } from 'wagmi'

import { APP_DESCRIPTION, APP_NAME, APP_URL } from '#/lib/constants'

// Define the connectors for the app
// Purposely using only these for now because of a localStorage error with the Coinbase Wallet connector
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        coinbaseWallet,
        rainbowWallet,
        metaMaskWallet,
        rabbyWallet,
        safeWallet,
        walletConnectWallet,
        injectedWallet
      ]
    }
  ],
  {
    appName: APP_NAME,
    // @ts-expect-error WalletConnect project ID is parsed as an environment variable
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    appDescription: APP_DESCRIPTION,
    appUrl: APP_URL,
    appIcon: 'https://ethfollow.xyz/logo.png'
  }
)

export type ChainWithDetails = Chain & {
  iconBackground?: string
  iconUrl?: string
  custom: {
    chainDetail?: string
    gasFeeDetail?: string
  }
}

const config = createConfig({
  ssr: true,
  connectors,
  chains: [mainnet, optimism, base],
  storage: createStorage({
    storage: cookieStorage
  }),
  transports: {
    [mainnet.id]: fallback([
      http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_MAINNET_ALCHEMY_ID}`, {
        batch: true
      }),
      http(
        `https://smart-cosmological-telescope.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_ID}`,
        {
          batch: true
        }
      ),
      http(`https://mainnet.infura.io/v3/`, {
        batch: true
      })
    ]),
    // [sepolia.id]: fallback([
    //   http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_SEPOLIA_ALCHEMY_ID}`, {
    //     batch: true
    //   }),
    //   http(
    //     `https://smart-cosmological-telescope.ethereum-sepolia.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_ID}`,
    //     {
    //       batch: true
    //     }
    //   )
    // ]),
    [optimism.id]: fallback([
      http(`https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_OPTIMISM_ALCHEMY_ID}`, {
        batch: true
      }),
      http(
        `https://smart-cosmological-telescope.optimism.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_ID}`,
        {
          batch: true
        }
      ),
      http(`https://mainnet.optimism.io`, {
        batch: true
      })
    ]),
    // [optimismSepolia.id]: fallback([
    //   http(
    //     `https://opt-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_OP_SEPOLIA_ALCHEMY_ID}`,
    //     {
    //       batch: true
    //     }
    //   ),
    //   http(
    //     `https://smart-cosmological-telescope.optimism-sepolia.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_ID}`,
    //     {
    //       batch: true
    //     }
    //   ),
    //   http('https://sepolia.optimism.io', { batch: true })
    // ]),
    [base.id]: fallback([
      http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_BASE_ALCHEMY_ID}`, {
        batch: true
      }),
      http(
        `https://smart-cosmological-telescope.base-mainnet.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_ID}`,
        {
          batch: true
        }
      ),
      http('https://mainnet.base.org/', { batch: true })
    ])
    // [baseSepolia.id]: fallback([
    //   http(
    //     `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_BASE_SEPOLIA_ALCHEMY_ID}`,
    //     {
    //       batch: true
    //     }
    //   ),
    //   http(
    //     `https://smart-cosmological-telescope.base-sepolia.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_ID}`,
    //     {
    //       batch: true
    //     }
    //   ),
    //   http('https://sepolia.base.org', { batch: true })
    // ])
  }
})

export default config
