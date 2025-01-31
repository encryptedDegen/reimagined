/**
 * @typedef {import('next').NextConfig} NextConfig
 * @typedef {Array<((config: NextConfig & any) => NextConfig)>} NextConfigPlugins
 * @typedef {import('webpack').Configuration} WebpackConfiguration
 */

import million from 'million/compiler'

/** @type {NextConfig} */
const nextConfig = {
  cleanDistDir: true,
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    useLightningcss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'euc.li',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'rainbow.mypinata.cloud',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: 'api.ethfollow.xyz',
        port: '',
        pathname: '/*',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  /** @param {WebpackConfiguration} config */
  webpack: (config, context) => {
    if (config.name === 'server' && config.optimization) {
      config.optimization.concatenateModules = false
    }
    /* WalletConnect x wagmi needed configuration */
    if (config.resolve) config.resolve.fallback = { fs: false, net: false, tls: false }
    if (Array.isArray(config.externals)) {
      config.externals.push('lokijs', 'pino-pretty', 'encoding')
    }
    if (config.plugins) {
      config.plugins.push(
        new context.webpack.IgnorePlugin({
          resourceRegExp: /^(lokijs|pino-pretty|encoding)$/,
        }),
        new context.webpack.NormalModuleReplacementPlugin(
          /node:/,
          (/** @type {{ request: string; }} */ resource) => {
            resource.request = resource.request.replace(/^node:/, '')
          }
        )
      )
    }

    return config
  },
}

export default million.next(nextConfig, { auto: { rsc: true } })
