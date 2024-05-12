import { IUserInfo } from '@/types/interface.ts'
import { defineStore } from 'pinia'

interface UserInfoState {
  userSeq: number | null
  accessToken: string | null
  refreshToken: string | null
  userNickname: string | null
  userEmail: string | null
  userCountry: string | null
  userRegion: string | null
  userProfileUrl: string | null
  isLocationMatch: boolean
}

export const useUserInfoStore = defineStore('userInfo', {
  state: (): UserInfoState => ({
    userSeq: null,
    accessToken: null,
    refreshToken: null,
    userNickname: null,
    userEmail: null,
    userCountry: null,
    userRegion: null,
    userProfileUrl: null,
    isLocationMatch: false
  }),
  actions: {
    setUserInfo(userInfo: IUserInfo | null | undefined): void {
      if (!userInfo) {
        return
      }
      this.userSeq = userInfo.userSeq
      this.accessToken = userInfo.accessToken
      this.refreshToken = userInfo.refreshToken
      this.userNickname = userInfo.nickname
      this.userEmail = userInfo.email
      this.userCountry = userInfo.country
      this.userRegion = userInfo.region
      this.userProfileUrl = userInfo.userProfileUrl
      this.isLocationMatch = userInfo.isLocationMatch
    },
    signOut(): void {
      this.userSeq = null
      this.accessToken = null
      this.refreshToken = null
      this.userNickname = null
      this.userEmail = null
      this.userCountry = null
      this.userRegion = null
      this.userProfileUrl = null
      this.isLocationMatch = false
    }
  }
})
