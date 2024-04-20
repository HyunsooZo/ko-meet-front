import { IChat, IChatRoom, IJobPost, IPost, ISearchResult, IUserInfo } from './interface.ts'

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

export interface IApiChatRoom extends IApiResponse {
  data: IPagenation<IChatRoom>
}

export interface IApiChatRoomList extends IApiResponse {
  data: IChatRoom[]
}

export interface IApiChat extends IApiResponse {
  data: IPagenation<IChat>
}

export interface IApiSearchResult extends IApiResponse {
  data: IPagenation<ISearchResult>
}

export interface IApiJobPost extends IApiResponse {
  data: IPagenation<IJobPost>
}

export interface IImage {
  imageUrl: string[]
}

// 게시글 리스트 인터페이스
export interface IApiPosts extends IApiResponse {
  status: number
  message: string
  data: IPagenation<IPost>
}

export interface IApiUserInfo extends IApiResponse {
  data: IUserInfo
}

export interface IApiImage extends IApiResponse {
  data: {
    imageUrl: string[]
  }
}

export interface IApiLocation extends IApiResponse {
  data: {
    country: string
    region: string
  }
}

export interface IApiBoolean extends IApiResponse {
  data: boolean
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
