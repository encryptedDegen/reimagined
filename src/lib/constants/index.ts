import type { FollowSortType } from '#/types/requests'
import type { ProfileTableTitleType, ProfileTabType } from '#/types/common'

export const APP_NAME = 'Reimagined'
export const APP_NAME_SHORT = 'ReIm'
export const APP_DESCRIPTION = 'A web3 app reimagined for the future.'
export const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4321'
export const ENS_SUBGRAPH_URL = `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_ENS_SUBGRAPH_API_KEY}/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH`

export const FETCH_LIMIT_PARAM = 12
export const LEADERBOARD_CHUNK_SIZE = 20
export const RECOMMENDED_PROFILES_LIMIT = 10
export const LEADERBOARD_FETCH_LIMIT_PARAM = 60

export const SECOND = 1_000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR

export const PROFILE_TABS: ProfileTabType[] = ['following', 'followers']
export const BLOCKED_MUTED_TABS: ProfileTableTitleType[] = ['Blocked/Muted', 'Blocked/Muted By']

export const DEFAULT_TAGS = ['no tag']
export const BLOCKED_MUTED_TAGS = ['block', 'mute']
export const DEFAULT_TAGS_TO_ADD = ['irl', 'bff', 'based', 'degen', 'top8']

export const SORT_OPTIONS: FollowSortType[] = ['follower count', 'latest first', 'earliest first']

export const DEFAULT_FALLBACK_AVATAR = 'https://ethfollow.xyz/assets/art/default-avatar.svg'

export const THEMES = ['light', 'dark']
