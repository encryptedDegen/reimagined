'use client'

import React from 'react'
import { useAccount } from 'wagmi';
import UserInfo from './components/user-info';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Home = () => {
  const { address: connectedAddress } = useAccount()

  return (
    <div className="flex flex-col items-center justify-center">
      {connectedAddress ? <UserInfo connectedAddress={connectedAddress} /> : <ConnectButton />}
    </div>
  )
}

export default Home;
