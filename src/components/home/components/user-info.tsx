'use client'

import { useUser } from "#/contexts/user-context";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Avatar, DEFAULT_FALLBACK_AVATAR, LoadingCell, ProfileStats } from "ethereum-identity-kit";

interface UserInfoProps {
  connectedAddress: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ connectedAddress }) => {
  const { profile, profileIsLoading } = useUser();

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <ConnectButton />
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="rounded-full overflow-hidden">
          {profileIsLoading ? <LoadingCell className="w-[100px] h-[100px] rounded-full" /> : <Avatar src={profile?.ens.avatar} fallback={DEFAULT_FALLBACK_AVATAR} style={{ width: 100, height: 100 }} address={profile?.address || connectedAddress} />}
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xl font-bold">{profile?.ens.name}</p>
          <p className="text-neutral-500">{profile?.address}</p>
        </div>
      </div>
      <ProfileStats addressOrName={connectedAddress} />
    </div>
  );
};

export default UserInfo;