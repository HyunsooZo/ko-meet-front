<template>
	<div class="content">
		<!-- 상단 고정 영역 -->
		<div class="sticky-wrap" :class="{ active: isStickyWrap }">
			<SearchBar />
			<!-- 탭 메뉴 -->
			<div class="menu-wrap">
				<ul class="menu__inner">
					<li v-for="(menu, index) in menus" :key="index" :class="{ active: menu.active.value }" class="menu__list">
						<button @click="selectMenu(menu)" type="button" class="button"
							:aria-selected="menu.active.value ? 'true' : 'false'">
							{{ menu.label }}
						</button>
					</li>
				</ul>
				<span class="menu__bar" :style="{ left: menuBarLeft, width: menuBarWidth }"></span>
			</div>
		</div>

		<div class="list-top-wrap">
			<!-- 서브 메뉴 -->
			<SubMenuList :subMenus="countries" @select:country="setCountry" />
			<!-- 카테고리 및 정렬 옵션 -->
			<div class="fnc-wrap">
				<div class="category__list">
					<button type="button" class="button--select" @click="openCategorySelect">
						<span>{{ t(selectCategoryValue.name) }}</span>
					</button>
				</div>
				<div class="sort__list">
					<button type="button" class="button--select sort" @click="openSortingSelect">
						<span>{{ t(selectSortingValue.name) }}</span>
					</button>
				</div>
			</div>
		</div>

		<!-- 게시글 목록 -->
		<div class="list-wrap">
			<!-- 글쓰기 버튼 -->
			<button type="button" class="button-icon button--post _sticky" :class="{ active: isStickyButton }"
				:style="{ top: isStickyButton ? StickyWrapHeight + 'px' : '' }" @click="openPostModal">
				<svg viewBox="0 0 16 16">
					<path :d="postBtn.first" />
					<path :d="postBtn.second" />
				</svg>
				<i class="blind">글쓰기</i>
			</button>
			<NoContent v-if="state.pagination.sort && state.posts.length === 0" :item="t('homeView.post')" />
			<BoardContent v-for="(item, index) in state.posts" :key="index" :post="item" :showAd="showAd(index)" />
		</div>
	</div>
	<LoadingModal v-if="isLoading" />
	<PostModal v-if="onPostModal" :isJobBoard=false @onPostModal:value="closePostModal" />
	<SelectDialog v-if="isCategorySelectClicked || isSortingSelectClicked" :title="selectTitle" :list="selectList"
		@close="closeSelect" @select:value="selectedValue" />
</template>

<script setup lang="ts">
import type { IPost, ISelectItem, IState } from '@/types/interface';
import type { IApiPosts } from '@/types/api-interface';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import { postBtn } from '@/utils/icons.ts';
import { sortingList, categoryList } from '@/utils/selectItems.ts';
import { showAd } from '@/utils/showAd.ts';
import { useI18n } from 'vue-i18n';
import { countries } from '@/utils/selectItems.ts';
import { useHomeCategoryStore } from '@/stores/category.ts';
import { useHomeSortingStore } from '@/stores/sorting.ts';
import { AxiosResponse } from 'axios';
import SearchBar from '@/components/search/SearchBar.vue';
import SelectDialog from '@/components/selections/SelectDialog.vue';
import BoardContent from '@/components/board/BoardContent.vue';
import PostModal from '@/components/board/PostModal.vue';
import NoContent from '@/components/board/NoContent.vue';
import LoadingModal from '@/components/loading/LoadingModal.vue';
import SubMenuList from '@/components/selections/SubMenuList.vue';
import api from '@/api';

const { t } = useI18n();

const router = useRouter();

const homeCategory = useHomeCategoryStore();
const homeSorting = useHomeSortingStore();

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
	document.body.classList.add('inactive');
};
const modalCloseClass = () => {
	document.body.classList.remove('inactive');
};

// 스크롤 관련 상태 및 이벤트 핸들러
const isStickyWrap = ref(false);
const isStickyButton = ref(false);
const StickyWrapHeight = ref(0);
const handleScrollEvent = () => {
	window.addEventListener('scroll', handleStickyWrap);

	// '.list-top-wrap' 요소의 높이를 가져오기 (높이가 없다면 0으로 처리)
	const listTopHeight: number = document.querySelector('.list-top-wrap')?.getBoundingClientRect().height || 0;

	// handleStickyButton에 listTopHeight 인자 전달
	window.addEventListener('scroll', () => handleStickyButton(listTopHeight));

	// 이벤트 제거를 위한 함수 반환
	return () => {
		window.removeEventListener('scroll', handleStickyWrap);
		window.removeEventListener('scroll', () => handleStickyButton(listTopHeight));
	};
};
const handleStickyWrap = () => {
	isStickyWrap.value = window.scrollY > 0;
	if (isStickyButton.value) {
		const stickyWrapElement = document.querySelector('.sticky-wrap');
		StickyWrapHeight.value =
			(stickyWrapElement?.getBoundingClientRect().height || 0) + 5;
	}
};
const handleStickyButton = (listTopHeight: number) => {
	isStickyButton.value = window.scrollY > listTopHeight;
};

const menuBarLeft = ref('0px');
const menuBarWidth = ref('0px');

// 게시글 목록 관련 반응형 객체
const state = ref<IState>({
	posts: [],
	pagination: {
		sort: {
			sorted: false,
			unsorted: true,
			empty: true,
		},
		pageSize: 10,
		pageNumber: 0,
		offset: 0,
		paged: true,
		unpaged: false,
	},
	last: false,
	loading: false,
});

// select 관련 메소드 (초기화)
const initializeState = () => {
	state.value.posts = [];
	state.value.pagination = {
		sort: {
			sorted: false,
			unsorted: false,
			empty: false
		},
		pageSize: 0,
		pageNumber: 0,
		offset: 0,
		paged: false,
		unpaged: false,
	};
	state.value.last = false;
	currentPage.value = 0;
};

// select 관련 메소드 (국가 선택)
const setCountry = (value: { name: string; code: string; }) => {
	selectCountry.value = value;
	initializeState();
	fetchBoardList(selectSortingValue.value.code, currentPage.value);
};

// select 관련 상태 및 메소드
const selectTitle = ref('');
const selectList = ref<ISelectItem[]>([]);
const isCategorySelectClicked = ref(false);
const isSortingSelectClicked = ref(false);
const selectCategoryValue = ref<ISelectItem>({
	name: homeCategory.name ? homeCategory.name : 'selectItems.allCategories',
	code: homeCategory.code ? homeCategory.code : 'ALL',
});
const selectSortingValue = ref<ISelectItem>({
	name: homeSorting.name ? homeSorting.name : 'selectItems.sortByRecent',
	code: homeSorting.code ? homeSorting.code : 'CREATED_DATE',
});
const selectCountry = ref({ name: '전체', code: 'ALL' });

// select 관련 메소드 (메뉴)
const selectMenu = (selectedMenu: { active: any; label?: string; }) => {
	selectedMenu.active.value = true;
	menus
		.filter(menu => menu !== selectedMenu)
		.forEach(menu => {
			menu.active.value = false;
		});
	nextTick(() => {
		updateMenuBar();
	});
};

// select 관련 메소드 (카테고리 및 정렬)
const openCategorySelect = () => {
	nextTick(() => {
		selectTitle.value = t('subMenuList.category');
		selectList.value = categoryList;
		isCategorySelectClicked.value = true;
	});
	modalOpenClass();
};

// select 관련 메소드 (정렬)
const openSortingSelect = () => {
	nextTick(() => {
		selectTitle.value = t('subMenuList.sorting');
		selectList.value = sortingList;
		isSortingSelectClicked.value = true;
	});
	modalOpenClass();
};

// select 관련 메소드 (닫기)
const closeSelect = () => {
	isCategorySelectClicked.value = false;
	isSortingSelectClicked.value = false;
	modalCloseClass();
};

// select 관련 메소드 (선택된 값 처리)
const selectedValue = (value: ISelectItem) => {
	if (categoryList.some(c => c.code === value.code)) {
		selectCategoryValue.value = value;
		homeCategory.setCategory(value)
	} else if (sortingList.some(s => s.code === value.code)) {
		selectSortingValue.value = value;
		homeSorting.setSorting(value);
	}
	initializeState();
	fetchBoardList(selectSortingValue.value.code, currentPage.value);
};

// 게시글 목록 관련 상태
let menus = [
	{ label: t('homeView.recentPost'), active: ref(true) },
	{ label: t('homeView.popularPost'), active: ref(false) },
];

// 메뉴바 관련 메소드
const updateMenuBar = () => {
	const activeButton = document.querySelector('.menu__list.active .button') as HTMLElement | null;
	menuBarLeft.value = activeButton ? `${activeButton.offsetLeft}px` : '0px';
	menuBarWidth.value = activeButton ? `${activeButton.offsetWidth}px` : '0px';
};

// 게시글 목록 관련 페이징 값
const currentPage = ref(0);

// 게시글 목록 호출 메서드
const fetchBoardList = async (sortingMethod: string, nextPage: number) => {
	state.value.loading = true;
	try {
		const response: AxiosResponse<IApiPosts> = await api.get(
			`/posts?country=${selectCountry.value.code}
			&sortingMethod=${sortingMethod}
			&isPublic=Y&category=${selectCategoryValue.value.code}
			&page=${nextPage}`, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (response.data.status === 200) {
			state.value.last = response.data.data.last;
			response.data.data.content.forEach((item: IPost) => {
				state.value.posts.push(item);
			});
			state.value.pagination = response.data.data.pageable;
		}
	} catch (error: unknown) {
		console.error(error);
	} finally {
		setTimeout(() => {
			state.value.loading = false;
		}, 1000);
	}
};


// 무한 스크롤 관련 메소드 (스크롤 핸들링)
const handleScroll = () => {
	const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
	if (scrollTop + clientHeight >= scrollHeight - 10) {
		loadMoreData();
	}
};

// 무한 스크롤 관련 메소드 (데이터 추가 호출)
const loadMoreData = async () => {
	if (!state.value.last && !state.value.loading) {
		state.value.loading = true;
		currentPage.value += 1;
		await fetchBoardList(selectSortingValue.value.code, currentPage.value);
		state.value.loading = false; // fetchBoardList 호출 후 loading 상태 변경
	}
};

// <-- PostModal 오픈 및 닫기
const onPostModal = ref(false);
const openPostModal = () => {
	onPostModal.value = true;
	modalOpenClass();
};
const closePostModal = () => {
	state.value.posts = [];
	fetchBoardList(selectSortingValue.value.code, currentPage.value);
	onPostModal.value = false;
	modalCloseClass();
};
// -->

// 로딩화면 관련 상태
const isLoading = ref(false);

onMounted(async () => {
	updateMenuBar();
	handleScrollEvent();
	if (useUserInfoStore().userSeq === null) {
		isLoading.value = true;
		setTimeout(() => {
			fetchBoardList('CREATED_DATE', 0);
			setTimeout(() => {
				isLoading.value = false;
			}, 1000);
		}, 4000);
	} else {
		fetchBoardList('CREATED_DATE', 0);
	}
	window.addEventListener('scroll', handleScroll);
});

const test = () => {
	api.get(
		`/replies/test`
	);
}


onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
});
</script>
