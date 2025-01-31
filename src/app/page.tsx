// import type { Metadata } from 'next'

import Home from "#/components/home"

// export const metadata: Metadata = {
//   title: 'Reimagined',
//   openGraph: {
//     title: 'Reimagined',
//     siteName: 'Reimagined',
//     description: 'Reimagined',
//     url: 'https://reimagined.xyz',
//     images: [
//       {
//         url: 'https://reimagined.xyz/assets/banners/home.png'
//       }
//     ]
//   },
//   twitter: {
//     images: 'https://reimagined.xyz/assets/banners/home.png'
//   }
// }

const HomePage = () => {
  return (
    <main className="mx-auto bg-transparent overflow-hidden flex min-h-screen w-full flex-col items-center">
      <Home />
    </main>
  )
}

export default HomePage
