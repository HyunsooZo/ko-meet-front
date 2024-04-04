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

// 게시글 리스트 인터페이스
export interface IPostList {
  status: number
  message: string
  data: {
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
  list: null | any[] // list 필드 추가 (실제 사용 여부에 따라 타입 조정 필요)
}
// 공통 API 응답 인터페이스
export interface IApiResponse<T> {
  status: number
  message: string
  data: T
  list: stiring[] | null
}

//
export interface IApiResponsePageable<T> {
  status: number
  message: string
  data: IPostList
  list: stiring[] | null
}
