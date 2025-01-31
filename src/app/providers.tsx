'use client'

import React from 'react'
import { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { useTheme } from 'next-themes'
import { useIsClient } from '@uidotdev/usehooks'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'

import wagmiConfig from '#/lib/wagmi'
import { DAY, MINUTE } from '#/lib/constants'
import { UserProvider } from '#/contexts/user-context'
import { CartProvider } from '#/contexts/cart-context'
import { ActionsProvider } from '#/contexts/actions-context'

type ProviderProps = {
  children: React.ReactNode
}

const darkThemes = ['dark', 'halloween']

const Providers: React.FC<ProviderProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { gcTime: 1 * DAY, staleTime: 1 * MINUTE }
        }
      })
  )

  const isClient = useIsClient()
  const { resolvedTheme } = useTheme()

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        <WagmiProvider config={wagmiConfig}>
          <RainbowKitProvider
            coolMode={true}
            theme={
              isClient && darkThemes.includes(resolvedTheme || 'dark') ? darkTheme() : undefined
            }
          >
            <CartProvider>
              <UserProvider>
                <ActionsProvider>{children}</ActionsProvider>
              </UserProvider>
            </CartProvider>
          </RainbowKitProvider>
        </WagmiProvider>
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default Providers
