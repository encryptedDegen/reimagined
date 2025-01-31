import type { Metadata } from 'next'

export const metadataBaseUrl = new URL('https://ethfollow.xyz')

export const metadataTitle = 'Reimagined'
export const metadataSiteName = 'Reimagined'
export const metadataDescription = 'Web3 reimagined'

export const sharedMetadataIcons: Metadata['icons'] = [
  {
    rel: 'icon',
    url: 'https://reimagined.xyz/assets/favicon.ico',
  },
]

export const sharedMetadataOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  title: metadataTitle,
  description: metadataDescription,
  locale: 'en_US',
  siteName: metadataSiteName,
  url: 'https://reimagined.xyz',
  emails: ['contact@reimagined.xyz'],
  // images: [
  //   {
  //     url: 'https://ethfollow.xyz/assets/banner.png'
  //   }
  // ]
}

export const sharedMetadataTwitter: Metadata['twitter'] = {
  card: 'summary_large_image',
  site: '@reimagined',
  creator: '@reimagined',
  description: metadataDescription,
  // images: 'https://reimagined.xyz/assets/banner.png'
}

export const sharedMetadata: Metadata = {
  title: metadataTitle,
  description: metadataDescription,
  applicationName: metadataSiteName,
  keywords: ['reimagined', 'web3', 'blockchain'],
  icons: sharedMetadataIcons,
  openGraph: sharedMetadataOpenGraph,
  authors: {
    name: 'Reimagined',
    url: 'https://reimagined.xyz',
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    notranslate: false,
  },
  metadataBase: metadataBaseUrl,
}
