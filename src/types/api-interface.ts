// 사용자 인터페이스
export interface IUser {
  seq: number
  nickName: string
  email: string
  profileImage: string
  reportedCount: number | null
  reportedDate: string | null
  country: string
  region: string
  userRole: string
  userStatus: string
}

// 댓글 인터페이스
export interface IComment {
  seq: number
  user: IUser
  content: string
  replies: IComment[]
  upVotes: number
  downVotes: number
  likeUsers: number[]
  status: string
  createdAt: string
}

// 게시글 인터페이스
export interface IPost {
  seq: number
  title: string
  content: string
  userSeq: number
  userProfileUrl: string
  userNickName: string
  comments: IComment[]
  viewCount: number
  likeCount: number
  tags: string[]
  attachments: string[]
  likeUsers: number[]
  bookmarkUsers: number[]
  isPublic: string
  country: string
  region: string
  category: string
  status: string
  createdAt: string
}

export interface IChatRoom {
  seq: number
  sender: IUser
  recipient: IUser
  lastChat: string
  unreadCountForSender: number
  unreadCountForRecipient: number
  lastChatTime: string
}

// 채팅 인터페이스
export interface IChat {
  id: number
  chatRoomSeq: number
  content: string
  sender: IUser
  recipient: IUser
  readStatus: boolean
  attachments: string[]
  createdAt: string
}

// 정렬 정보 인터페이스
export interface ISortInfo {
  sorted: boolean
  unsorted: boolean
  empty: boolean
}

// 페이징 정보 인터페이스
export interface IPageable {
  sort: ISortInfo
  pageSize: number
  pageNumber: number
  offset: number
  paged: boolean
  unpaged: boolean
}

// 검색결과 인터페이스
export interface ISearchResult {
  seq: number
  title: string
  content: string
  userSeq: number
  likeCount: number
  viewCount: number
  isPublic: string
  userProfileUrl: string
  userNickName: string
  commentCounts: number
  tags: string[]
  attachments: string[]
  likeUsers: number[]
  bookmarkUsers: number[]
  country: string
  region: string
  category: string
  status: string
  keyword: string
  createdAt: string
}

// 구인구직 인터페이스
export interface IJobPost {
  seq: number
  title: string
  content: string
  user: IUser
  viewCount: number
  likeCount: number
  tags: string[]
  attachments: string[]
  likeUsers: number[]
  bookmarkUsers: number[]
  country: string
  region: string
  industry: string
  deadline: string | Date
  experience: string
  salary: string
  company: string
  companyEmail: string
  companyPhone: string
  companyAddress: string
  companyHomepage: string
  companyLogo: string
  status: string
  createdAt: string | Date
}

export interface IImage {
  imageUrl: string[]
}

// 게시글 리스트 인터페이스
export interface IApiPosts<T> extends IApiResponse {
  status: number
  message: string
  data: IPagenation<T>
}

export interface IApiUserInfo extends IApiResponse {
  data: {
    userSeq: number | null
    accessToken: string | null
    refreshToken: string | null
    nickname: string | null
    email: string | null
    country: string | null
    region: string | null
    userProfile: string | null
    isLocationMatch: boolean
  }
}

export interface IApiImage extends IApiResponse {
  data: {
    imageUrl: string[]
  }
}

export interface IApiLocation {
  country: string
  region: string
}

export interface IPostSearchResult {
  seq: number
  title: string
  content: string
  userSeq: number
  likeCount: number
  viewCount: number
  isPublic: string
  userProfileUrl: string
  userNickName: string
  commentCounts: number
  tags: string[]
  attachments: string[]
  likeUsers: number[]
  bookmarkUsers: number[]
  country: string
  region: string
  category: string
  status: string
  keyword: string
  createdAt: string
}

// 공통 API 응답 인터페이스
export interface IApiResponse {
  status: number
  message: string
}

export interface IPagenation<T> {
  content: T[]
  pageable: IPageable
  last: boolean
  totalPages: number
  totalElements: number
  sort: ISortInfo
  first: boolean
  number: number
  numberOfElements: number
  size: number
  empty: boolean
}
