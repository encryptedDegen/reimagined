"use client";

import {
  useState,
  useEffect,
  useContext,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  useQuery,
  useInfiniteQuery,
  type InfiniteData,
  type RefetchOptions,
  type QueryObserverResult,
  type FetchNextPageOptions,
  type InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { useAccount, useChains } from "wagmi";

import type {
  ENSProfile,
  ProfileRoles,
  StatsResponse,
  FollowSortType,
  FollowerResponse,
  FollowingResponse,
  ProfileDetailsResponse,
  FollowingTagsResponse,
} from "#/types/requests";
import { useCart } from "./cart-context";
import { DEFAULT_CHAIN } from "#/lib/constants/chains";
import type { ProfileTableTitleType } from "#/types/common";
import { coreEfpContracts } from "#/lib/constants/contracts";
import { fetchProfileRoles } from "#/api/profile/fetch-profile-roles";
import { fetchProfileStats } from "#/api/profile/fetch-profile-stats";
import { fetchProfileDetails } from "#/api/profile/fetch-profile-details";
import { fetchProfileFollowers } from "#/api/followers/fetch-profile-followers";
import { fetchProfileFollowing } from "#/api/following/fetch-profile-following";
import { fetchFollowerTags, nullFollowerTags } from "#/api/followers/fetch-follower-tags";
import { fetchFollowingTags, nullFollowingTags } from "#/api/following/fetch-following-tags";
import { BLOCKED_MUTED_TAGS, DEFAULT_TAGS_TO_ADD, FETCH_LIMIT_PARAM } from "#/lib/constants";

// Define the type for the profile context
type UserContextType = {
  profile?: ProfileDetailsResponse | null;
  stats?: StatsResponse | null;
  followingTags?: FollowingTagsResponse;
  followerTags?: FollowingTagsResponse;
  followers: FollowerResponse[];
  following: FollowingResponse[];
  roles?: ProfileRoles;
  topEight: {
    address: `0x${string}`;
    ens: ENSProfile | undefined;
  }[];
  topEightIsLoading: boolean;
  topEightIsRefetching: boolean;
  profileIsLoading: boolean;
  statsIsLoading: boolean;
  followingTagsLoading: boolean;
  followerTagsLoading: boolean;
  followersIsLoading: boolean;
  followingIsLoading: boolean;
  isFetchingMoreFollowers: boolean;
  isFetchingMoreFollowing: boolean;
  isEndOfFollowers: boolean;
  isEndOfFollowing: boolean;
  fetchMoreFollowers: (options?: FetchNextPageOptions) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<
        {
          followers: FollowerResponse[];
          nextPageParam: number;
        },
        unknown
      >,
      Error
    >
  >;
  fetchMoreFollowing: (options?: FetchNextPageOptions) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<
        {
          following: FollowingResponse[];
          nextPageParam: number;
        },
        unknown
      >,
      Error
    >
  >;
  refetchProfile: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<ProfileDetailsResponse | null, Error>>;
  refetchStats: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<StatsResponse | null, Error>>;
  refetchFollowingTags: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<FollowingTagsResponse | undefined, Error>>;
  refetchFollowerTags: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<FollowingTagsResponse | undefined, Error>>;
  refetchFollowers: (
    options?: RefetchOptions | undefined
  ) => Promise<
    QueryObserverResult<
      InfiniteData<{ followers: FollowerResponse[]; nextPageParam: number }, unknown>,
      Error
    >
  >;
  refetchFollowing: (
    options?: RefetchOptions | undefined
  ) => Promise<
    QueryObserverResult<
      InfiniteData<{ following: FollowingResponse[]; nextPageParam: number }, unknown>,
      Error
    >
  >;
  refetchRoles: (options?: RefetchOptions) => Promise<QueryObserverResult<ProfileRoles, Error>>;
  refetchTopEight: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<FollowingResponse[], Error>>;
  recentTags: string[];
  followingTagsFilter: string[];
  followersTagsFilter: string[];
  followingSort: FollowSortType;
  followersSort: FollowSortType;
  addRecentTag: (tag: string) => void;
  toggleTag: (tab: ProfileTableTitleType, tag: string) => void;
  setFollowingSort: (option: FollowSortType) => void;
  setFollowersSort: (option: FollowSortType) => void;
  setFollowingSearch: (value: string) => void;
  setFollowersSearch: (value: string) => void;
  setFollowingTagsFilter: Dispatch<SetStateAction<string[]>>;
  setFollowersTagsFilter: Dispatch<SetStateAction<string[]>>;
  fetchFreshStats: boolean;
  fetchFreshProfile: boolean;
  setFetchFreshProfile: (state: boolean) => void;
  setFetchFreshStats: (state: boolean) => void;
  setIsRefetchingProfile: (state: boolean) => void;
  setIsRefetchingFollowing: (state: boolean) => void;
};

type Props = {
  children: React.ReactNode;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<Props> = ({ children }) => {
  const [isRefetchingProfile, setIsRefetchingProfile] = useState(false);
  const [isRefetchingFollowing, setIsRefetchingFollowing] = useState(false);
  const [fetchFreshProfile, setFetchFreshProfile] = useState(false);
  const [fetchFreshStats, setFetchFreshStats] = useState(false);
  const [followingSearch, setFollowingSearch] = useState<string>("");
  const [followersSearch, setFollowersSearch] = useState<string>("");
  const [followingTagsFilter, setFollowingTagsFilter] = useState<string[]>([]);
  const [followersTagsFilter, setFollowersTagsFilter] = useState<string[]>([]);
  const [followingSort, setFollowingSort] = useState<FollowSortType>("follower count");
  const [followersSort, setFollowersSort] = useState<FollowSortType>("follower count");

  const [recentTags, setRecentTags] = useState(DEFAULT_TAGS_TO_ADD);

  const chains = useChains();
  const { resetCart } = useCart();
  const { address: userAddress } = useAccount();

  const {
    data: profile,
    isLoading: profileIsLoading,
    refetch: refetchProfile,
    isRefetching: isRefetchingProfileQuery,
  } = useQuery({
    queryKey: ["profile", userAddress, fetchFreshProfile],
    queryFn: async () => {
      if (!userAddress) {
        setIsRefetchingProfile(false);
        return null;
      }

      const fetchedProfile = await fetchProfileDetails(userAddress, undefined, fetchFreshProfile);

      setIsRefetchingProfile(false);

      return fetchedProfile;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const {
    data: stats,
    isLoading: statsIsLoading,
    refetch: refetchStats,
    isRefetching: isRefetchingStatsQuery,
  } = useQuery({
    queryKey: ["stats", userAddress, fetchFreshStats],
    queryFn: async () => {
      if (!userAddress) return null;

      const fetchedStats = await fetchProfileStats(userAddress, undefined, fetchFreshStats);

      return fetchedStats;
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: followerTags,
    refetch: refetchFollowerTags,
    isLoading: followerTagsLoading,
    isRefetching: isRefetchingFollowerTagsQuery,
  } = useQuery({
    queryKey: ["follower tags", userAddress,],
    queryFn: async () => {
      if (!userAddress) return nullFollowerTags;

      const fetchedTags = await fetchFollowerTags(userAddress,);
      return fetchedTags;
    },
  });

  const [isEndOfFollowers, setIsEndOfFollowers] = useState(false);
  // Fetch followings depending on the selected list
  const {
    data: fetchedFollowers,
    refetch: refetchFollowers,
    isLoading: followersIsLoading,
    fetchNextPage: fetchMoreFollowers,
    isRefetching: isRefetchingFollowersQuery,
    isFetchingNextPage: isFetchingMoreFollowers,
  } = useInfiniteQuery({
    queryKey: [
      "followers",
      userAddress,
      ,
      followersSort,
      followersTagsFilter,
      followersSearch.length > 2 ? followersSearch : undefined,
    ],
    queryFn: async ({ pageParam = 0 }) => {
      setIsEndOfFollowers(false);

      if (!userAddress) {
        return {
          followers: [],
          nextPageParam: pageParam,
        };
      }

      const fetchedFollowers = await fetchProfileFollowers({
        addressOrName: userAddress,
        limit: FETCH_LIMIT_PARAM,
        sort: followersSort,
        tags: followersTagsFilter,
        search: followersSearch,
        pageParam,
      });

      if (fetchedFollowers.followers.length === 0) setIsEndOfFollowers(true);

      return fetchedFollowers;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  });

  const {
    data: followingTags,
    isLoading: followingTagsLoading,
    refetch: refetchFollowingTags,
    isRefetching: isRefetchingFollowingTagsQuery,
  } = useQuery({
    queryKey: ["following tags", userAddress, , fetchFreshStats],
    queryFn: async () => {
      if (!userAddress) return nullFollowingTags;

      const fetchedProfile = await fetchFollowingTags(userAddress, undefined, fetchFreshStats);
      return fetchedProfile;
    },
    refetchOnWindowFocus: false,
  });

  const [isEndOfFollowing, setIsEndOfFollowing] = useState(false);
  // fetch followers depending on list for the user of the list you are viewing or show connected address followers if no list is selected
  const {
    data: fetchedFollowing,
    isLoading: followingIsLoading,
    fetchNextPage: fetchMoreFollowing,
    isFetchingNextPage: isFetchingMoreFollowing,
    refetch: refetchFollowing,
    isRefetching: isRefetchingFollowingQuery,
  } = useInfiniteQuery({
    queryKey: [
      "following",
      userAddress,
      followingSort,
      followingTagsFilter,
      followingSearch.length > 2 ? followingSearch : undefined,
      fetchFreshStats,
    ],
    queryFn: async ({ pageParam = 0 }) => {
      setIsEndOfFollowing(false);

      if (!userAddress) {
        setIsRefetchingFollowing(false);
        return {
          following: [],
          nextPageParam: pageParam,
        };
      }

      const fetchedFollowing = await fetchProfileFollowing({
        addressOrName: userAddress,
        limit: FETCH_LIMIT_PARAM,
        sort: followingSort,
        tags: followingTagsFilter,
        search: followingSearch,
        pageParam,
        fresh: fetchFreshStats,
      });

      if (fetchedFollowing?.following?.length === 0) setIsEndOfFollowing(true);
      setIsRefetchingFollowing(false);

      return fetchedFollowing;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  });

  const followers = fetchedFollowers
    ? fetchedFollowers.pages.reduce(
      (acc, el) => [...acc, ...el.followers],
      [] as FollowerResponse[]
    )
    : [];

  const following = fetchedFollowing
    ? fetchedFollowing.pages.reduce(
      (acc, el) => [...acc, ...el.following],
      [] as FollowingResponse[]
    )
    : [];

  const {
    data: topEightFetched,
    refetch: refetchTopEight,
    isLoading: topEightIsLoading,
    isRefetching: topEightIsRefetching,
  } = useQuery({
    queryKey: ["top8", userAddress, , fetchFreshStats],
    queryFn: async () => {
      if (!userAddress) return [];

      const fetchedFollowing = await fetchProfileFollowing({
        addressOrName: userAddress,
        limit: 100,
        pageParam: 0,
        tags: ["top8"],
        sort: "latest first",
        fresh: fetchFreshStats,
      });

      return fetchedFollowing.following;
    },
    staleTime: 300000,
  });

  const topEight =
    topEightFetched?.map((profile) => ({ address: profile.address, ens: profile.ens })) || [];

  useEffect(() => {
    const cartAddress = localStorage.getItem("cart address");
    if ((userAddress?.toLowerCase() === cartAddress?.toLowerCase() || !userAddress))
      return;
    resetCart();
  }, [userAddress]);

  const toggleTag = (tab: ProfileTableTitleType, tag: string) => {
    if (tab === "following") {
      if (followingTagsFilter.includes(tag)) {
        setFollowingTagsFilter(followingTagsFilter.filter((item) => item !== tag));
      } else {
        setFollowingTagsFilter([...followingTagsFilter, tag]);
      }
    }

    if (tab === "followers") {
      if (followersTagsFilter.includes(tag)) {
        setFollowersTagsFilter(followersTagsFilter.filter((item) => item !== tag));
      } else {
        setFollowersTagsFilter([...followersTagsFilter, tag]);
      }
    }
  };

  const addRecentTag = (tag: string) => {
    setRecentTags([tag, ...recentTags.filter((recentTag) => recentTag !== tag)].slice(0, 5));
  };

  useEffect(() => {
    if (followingTags?.tagCounts && followingTags?.tagCounts.length > 0) {
      const appliedTags = followingTags?.tagCounts
        ?.sort((a, b) => b.count - a.count)
        .map((tag) => tag.tag)
        .filter((tag) => !BLOCKED_MUTED_TAGS.includes(tag));

      setRecentTags([...appliedTags, ...recentTags].slice(0, 5));
    }
  }, [followingTags]);

  const { data: roles, refetch: refetchRoles } = useQuery({
    queryKey: ["userRoles", userAddress],
    queryFn: async () => {
      if (!(userAddress && profile?.primary_list))
        return {
          isOwner: true,
          isManager: true,
          isUser: true,
          listChainId: DEFAULT_CHAIN.id,
          listRecordsContract: coreEfpContracts.EFPListRecords,
          listSlot: BigInt(0),
        };

      const fetchedRoles = await fetchProfileRoles({
        list: profile?.primary_list,
        chains,
        userAddress,
      });

      return fetchedRoles;
    },
  });

  return (
    <UserContext.Provider
      value={{
        stats,
        profile,
        followerTags,
        followingTags,
        followers,
        following,
        roles,
        topEight,
        topEightIsLoading,
        topEightIsRefetching,
        followerTagsLoading: followerTagsLoading || isRefetchingFollowerTagsQuery,
        followingTagsLoading: followingTagsLoading || isRefetchingFollowingTagsQuery,
        profileIsLoading:
          isRefetchingProfile || profileIsLoading || isRefetchingProfileQuery,
        statsIsLoading: statsIsLoading || isRefetchingStatsQuery,
        followingIsLoading:
          isRefetchingFollowing ||
          followingIsLoading ||
          isRefetchingFollowingQuery,
        followersIsLoading: followersIsLoading || isRefetchingFollowersQuery,
        isFetchingMoreFollowers: !isEndOfFollowers && isFetchingMoreFollowers,
        isFetchingMoreFollowing: !isEndOfFollowing && isFetchingMoreFollowing,
        isEndOfFollowers,
        isEndOfFollowing,
        fetchMoreFollowers,
        fetchMoreFollowing,
        refetchStats,
        refetchProfile,
        refetchFollowers,
        refetchFollowing,
        refetchFollowerTags,
        refetchFollowingTags,
        setFollowingSearch,
        setFollowersSearch,
        refetchRoles,
        refetchTopEight,
        recentTags,
        followingTagsFilter,
        followersTagsFilter,
        followingSort,
        followersSort,
        addRecentTag,
        toggleTag,
        setFollowingSort: (option: FollowSortType) => {
          setFollowingSort(option);
        },
        setFollowersSort: (option: FollowSortType) => {
          setFollowersSort(option);
        },
        setFollowingTagsFilter,
        setFollowersTagsFilter,
        fetchFreshStats,
        fetchFreshProfile,
        setFetchFreshStats,
        setFetchFreshProfile,
        setIsRefetchingProfile,
        setIsRefetchingFollowing,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};
