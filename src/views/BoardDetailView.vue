<template>
  <TheHeader />
  <div class="content">
    <!-- 글 상세 -->
    <div class="list-wrap">
      <div class="list__title">
        <span class="title">{{ t('postCategories.' + post.category) }}</span>
      </div>
      <BoardContent :post="post" :detail="true" :jobPost="emptyJobPost" :isJobBoard="false">
      </BoardContent>
      <!-- //.item -->
    </div>
    <ReplyModal v-if="replyDetailModal" :post="post" :commentIndex="Number(replyIndex)" :postIndex="Number(postSeq)"
      @close="closeReplyModal" />
    <!-- 댓글 기능버튼 -->
    <div class="fnc-wrap">
      <div class="button__list">
        <button type="button" class="button-icon__s button--post" @click="openCommentWrite">
          <svg viewBox="0 0 16 16">
            <path :d="writeReply.first" />
            <path :d="writeReply.second" />
          </svg>
          <span>{{ t('boardDetailView.writeComment') }}</span>
        </button>
      </div>
      <div class="sort__list">
        <button type="button" class="button-icon__s last-reply" @click="goToDown">
          <svg viewBox="0 0 16 16">
            <path :d="lastReply" />
          </svg>
          <span>{{ t('boardDetailView.seeLastComments') }}</span>
        </button>
      </div>
    </div>
    <!-- 댓글 -->
    <div class="list-wrap reply" v-if="post.comments.length === 0">
      <NoContent :item="'댓글'" />
    </div>
    <div class="list-wrap reply" v-for="(comment, index) in post.comments" :key="comment.seq">
      <!-- <div class="item item--blind"> -->
      <!-- 댓글 신고로 숨김처리 시 -->
      <!-- <div class="blind__text">
					<p class="text__item">신고에 의해 숨김처리 되었습니다.</p>
				</div> -->
      <!-- </div> -->
      <div class="item">
        <div class="info__wrap">
          <div class="item__fnc">
            <div class="list__item">
              <button type="button" class="list__item_button user"
                :class="{ 'user--author': isAuthor(comment.user.seq) }" @click="onUserProfileDetail">
                <!-- //원글작성자 댓글 .user--author -->
                <em>{{ comment.user.country }}</em>
                <strong>{{ comment.user.nickName }}</strong>
              </button>
            </div>
          </div>
          <div class="item__fnc">
            <button type="button" class="list__item_button more">
              <i class="blind">더보기</i>
            </button>
          </div>
        </div>
        <div class="text__wrap">
          <div class="list__item">
            <div class="text__item">
              <p class="text">{{ comment.content }}</p>
            </div>
          </div>
        </div>
        <div class="util__wrap">
          <div class="item__fnc">
            <button type="button" class="list__item_button like"
              :class="{ active: comment.likeUsers.includes(userSeq ? userSeq : 0) }"
              @click="likeComment(comment.seq, index)">
              <!-- //활성화 .active -->
              <i class="blind">좋아요</i>
              <span class="item__count">{{ comment.upVotes }}</span>
            </button>
            <button type="button" class="list__item cmt" @click="openReplyWrite(index, null)">
              <span class="item__count">{{ comment.replies.length }}</span>
            </button>
            <p class="list__item past">
              <i class="blind">작성시간</i>
              <span class="item__count">{{ timeCalculation(comment.createdAt).time
                }}{{ t(timeCalculation(comment.createdAt).text) }}</span>
            </p>
          </div>
        </div>
      </div>
      <!-- 대댓글 -->
      <div class="re--reply" v-for="(reply, replyIndex) in comment.replies.slice(0, 3)" :key="reply.seq">
        <div class="item">
          <div class="info__wrap">
            <div class="item__fnc">
              <div class="list__item">
                <button type="button" class="list__item_button user"
                  :class="{ 'user--author': isAuthor(reply.user.seq) }" @click="onUserProfileDetail">
                  <!-- //원글작성자 댓글 .user--author -->
                  <em>{{ reply.user.country }}</em>
                  <strong>{{ reply.user.nickName }}</strong>
                </button>
              </div>
            </div>
            <div class="item__fnc">
              <button type="button" class="list__item_button more">
                <i class="blind">더보기</i>
              </button><!-- //공유, 신고, 본인글인 경우 추가 :수정, 삭제 -->
            </div>
          </div>
          <div class="text__wrap">
            <div class="list__item">
              <div class="text__item">
                <p class="text">
                  <span class="comment__user" v-if="extractAtWordAndRest(reply.content).atWord">{{
                    extractAtWordAndRest(reply.content).atWord
                    }}</span>
                  {{ extractAtWordAndRest(reply.content).restText }}
                </p>
              </div>
            </div>
          </div>
          <div class="util__wrap">
            <div class="item__fnc">
              <button type="button" class="list__item_button like" :class="{
                active: post.comments[index].replies[replyIndex].likeUsers.includes(
                  userSeq ? userSeq : 0
                )
              }" @click="likeReply(index, replyIndex)">
                <!-- //활성화 .active -->
                <i class="blind">좋아요</i>
                <span class="item__count">{{ reply.upVotes }}</span>
              </button>
              <button type="button" class="list__item cmt" @click="openReplyWrite(index, reply.user.nickName)"></button>
              <p class="list__item past">
                <i class="blind">작성시간</i>
                <span class="item__count">
                  {{ timeCalculation(reply.createdAt).time }}
                  {{ t(timeCalculation(reply.createdAt).text) }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <!-- //.item -->
      </div>
      <!-- n개 이상 대댓글 더보기 -->
      <div class="item item__more" v-if="comment.replyCount > 3">
        <button type="button" class="list__item_button button-text" @click="openReplyModal(index)">
          <span>{{ comment.replyCount - 3 }}{{ t('boardDetailView.multipleComments') }}</span>
        </button>
      </div>
    </div>
  </div>
  <ReplyWrite v-if="isCommentWriteClicked" :postSeq="post.seq" :isPostComment="true" @close="closeCommentWrite"
    @select:value="selectedValue" />
  <ReplyWrite v-if="isReplyWriteClicked" :commentSeq="post.comments[replyIndex].seq" :isPostComment="false"
    :taggedUser="taggedUser" @close="closeReplyWrite" @select:value="selectedValue" />
  <LoadingModal v-if="isLoading" />
  <!-- <MoreModalForPost v-if="onMorePostModal" :posetSeq="post.seq" @close="closeMoreModal" @edit="editPost"
    @delete="deletePost" /> -->
  <UserProfileDetail :userProfile="postAuthorInfo" @close="offUserProfileDetail" v-if="isUserProfileDetailOn" />
</template>

<script setup lang="ts">
import type { IPost, IComment, IOtherUserInfo } from '@/types/interface'
import { AxiosResponse } from 'axios'
import { emptyJobPost } from '@/utils/emptyObjects'
import { extractAtWordAndRest } from '@/utils/comment.ts'
import { likeApi, postBookmark } from '@/services/post.ts'
import { writeReply, lastReply } from '@/utils/icons.ts'
import { timeCalculation } from '@/utils/date-time.ts'
import { applicationJson, applicationJsonWithToken } from '@/utils/header'
import { useUserInfoStore } from '@/stores/userInfo.ts'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import BoardContent from '@/components/board/BoardContent.vue'
import NoContent from '@/components/board/NoContent.vue'
import UserProfileDetail from '@/components/board/UserProfileDetail.vue'
import ReplyWrite from '@/components/comment/ReplyWrite.vue'
import ReplyModal from '@/components/comment/ReplyModal.vue'
import LoadingModal from '@/components/loading/LoadingModal.vue'
import MoreModalForPost from '@/components/modal/MoreModalForPost.vue'
import TheHeader from '@/components/layouts/TheHeader.vue'

const { t } = useI18n()

// modal open/close 시 body 컨트롤
const isModalOpen = () => {
  document.body.classList.add('inactive')
}
const isModalClose = () => {
  document.body.classList.remove('inactive')
}

// 프로필 보기
const isUserProfileDetailOn = ref(false)
const onUserProfileDetail = () => {
  if (post.value.userSeq === userInfo.userSeq) {
    router.push('/my-page')
  } else {
    isUserProfileDetailOn.value = true
    isModalOpen()
  }
}
const offUserProfileDetail = () => {
  isUserProfileDetailOn.value = false
  isModalClose()
}

const isAuthor = (userSeq: number) => {
  return userSeq === post.value.userSeq
}
const router = useRouter()

const route = useRoute()
const isLoading = ref(false)

const replyDetailModal = ref(false)

const openReplyModal = (index: number) => {
  replyIndex.value = index
  replyDetailModal.value = true
  isModalOpen()
}

const closeReplyModal = () => {
  replyDetailModal.value = false
  isModalClose()
}

// 댓글쓰기
const isReplyWriteClicked = ref(false)
const isCommentWriteClicked = ref(false)
const replyIndex = ref()
const taggedUser = ref('')
const openReplyWrite = (index: any, nickName: string | null) => {
  replyIndex.value = index
  isReplyWriteClicked.value = true
  taggedUser.value = nickName ? nickName : ''
  isModalOpen()
}
const closeReplyWrite = () => {
  isReplyWriteClicked.value = false
  taggedUser.value = ''
  isModalClose()
  setTimeout(() => {
    detailBoard()
  }, 1500)
}
const openCommentWrite = () => {
  isCommentWriteClicked.value = true
  isModalOpen()
}
const closeCommentWrite = () => {
  isCommentWriteClicked.value = false
  isModalClose()
  setTimeout(() => {
    detailBoard()
  }, 500)
}
const postSeq = route.params.postId

const post = ref<IPost>({
  seq: 0,
  title: '',
  content: '',
  userSeq: 0,
  userProfileUrl: '',
  userNickName: '',
  comments: [],
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  tags: [],
  attachments: [],
  likeUsers: [],
  bookmarkUsers: [],
  isPublic: '',
  country: '',
  region: '',
  status: '',
  category: '',
  createdAt: ''
})

const userInfo = useUserInfoStore()
const userSeq = ref(userInfo.userSeq)
const likeUsers = ref(post.value.likeUsers)
const likeCount = ref(post.value.likeCount)
const bookmarkUsers = ref(post.value.bookmarkUsers)
const isBookmarked = computed(() => {
  return bookmarkUsers.value.includes(userSeq.value ? userSeq.value : 0)
})

const likePost = async () => {
  const updatedPost = JSON.parse(JSON.stringify(post.value))
  if (updatedPost.likeUsers.includes(userSeq.value)) {
    updatedPost.likeCount--
    const userIndex = updatedPost.likeUsers.indexOf(userSeq.value)
    updatedPost.likeUsers.splice(userIndex, 1)
  } else {
    updatedPost.likeCount++
    updatedPost.likeUsers.push(userSeq.value)
  }
  post.value = updatedPost

  const response = await api.patch(
    `posts/${post.value.seq}/like`,
    {},
    applicationJsonWithToken(userInfo.accessToken)
  )
  if (response.status === 401) {
    router.push('/sign-in')
  } else if (response.status !== 204) {
    console.log('좋아요 실패')
  }
}
const likeComment = async (seq: any, index: string | number) => {
  const updatedPost = JSON.parse(JSON.stringify(post.value))
  const comment = updatedPost.comments[index]
  if (comment.likeUsers.includes(userSeq.value)) {
    comment.upVotes--
    const userIndex = comment.likeUsers.indexOf(userSeq.value)
    comment.likeUsers.splice(userIndex, 1)
  } else {
    comment.upVotes++
    comment.likeUsers.push(userSeq.value)
  }

  // 반응형 시스템이 변경을 감지할 수 있도록 post 업데이트
  post.value = updatedPost

  const response = await likeApi('comments', post.value.comments[index as number].seq)
  if (response.status === 401) {
    router.push('/sign-in')
  } else if (response.status !== 201) {
    console.log('좋아요 실패')
  }
}

const likeReply = async (index: string | number, replyIndex: string | number) => {
  const updatedPost = JSON.parse(JSON.stringify(post.value))
  const comment = updatedPost.comments[index]
  const reply = comment.replies[replyIndex]
  if (reply.likeUsers.includes(userSeq.value)) {
    reply.upVotes--
    const userIndex = reply.likeUsers.indexOf(userSeq.value)
    reply.likeUsers.splice(userIndex, 1)
  } else {
    reply.upVotes++
    reply.replies[replyIndex].likeUsers.push(userSeq.value)
  }

  // 반응형 시스템이 변경을 감지할 수 있도록 post 업데이트
  post.value = updatedPost
  const response = await likeApi(
    'replies',
    post.value.comments[index as number].replies[replyIndex as number].seq
  )
  if (response.status === 401) {
    router.push('/sign-in')
  } else if (response.status !== 201) {
    console.log('좋아요 실패')
  }
}

const detailBoard = async () => {
  try {
    const response = await api.get(`/posts/${route.params.postId}`, applicationJson)
    if (response.status === 200) {
      post.value = response.data.data
      console.log(post.value)
      likeCount.value = response.data.data.likeCount
      likeUsers.value = response.data.data.likeUsers
      bookmarkUsers.value = response.data.data.bookmarkUsers
    }
  } catch (error) {
    console.log(error)
  }
}

const goToDown = () => {
  window.scrollTo(0, document.body.scrollHeight)
}

// <-- 더보기 모달 관련
const onMorePostModal = ref(false)

const openMoreModal = () => {
  onMorePostModal.value = true
}

const closeMoreModal = () => {
  onMorePostModal.value = false
}
// -->

const selectedValue = ref(null)

const postAuthorInfo = ref<IOtherUserInfo>({
  userSeq: post.value.userSeq,
  userProfileUrl: post.value.userProfileUrl,
  userNickName: post.value.userNickName,
  country: post.value.country,
  region: post.value.region
})

const bookmarkApi = async () => {
  checkIfTokenExists()
  changeBookmark()
  try {
    postBookmark(post.value.seq)
  } catch (error) {
    console.log(error)
  }
}

const changeBookmark = () => {
  if (isBookmarked.value) {
    const index = userSeq.value !== null ? bookmarkUsers.value.indexOf(userSeq.value) : -1
    if (index !== -1) {
      bookmarkUsers.value.splice(index, 1)
    }
  } else {
    if (userSeq.value !== null) {
      bookmarkUsers.value.push(userSeq.value)
    }
  }
}

const checkIfTokenExists = () => {
  if (!userInfo.accessToken) {
    router.push('/sign-in')
  }
}

onMounted(() => {
  if (!userInfo.accessToken) {
    router.push('/sign-in')
  }
  detailBoard()
})
</script>
