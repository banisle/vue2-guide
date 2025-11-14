<template>
  <div class="" >
    <!-- 오늘의 일정 -->
    <div>
      <h3 class="pl-subtit is-h3 ">
        <strong class="pl-card-intop--title ">오늘의 일정</strong>
      </h3>
      <div class="is-mt-s pl-rounded-box px-5 py-3 spacing-wrap sp-4 align-center" >
        <div
          @click="mixin_showDialog('TodaySchedule' )"
          class="hover-bold"
          v-for="item in TODAY_SCH"
          :key="item.id">
          {{ item.title }}
          <strong class="is-txt-cyan">({{ item.value }})</strong>
        </div>
        <div class="ml-auto">
          <compo-tooltip-btn
            TitleProp="자세히보기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 arrow-link"
            TooltipPositionProp="bottom"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>

    <!-- 데일리 -->
    <div>
      <h3 class="pl-subtit is-h3 is-mt-l">
        <strong class="pl-card-intop--title ">데일리</strong>
        <div class="d-flex align-center ml-auto">
          <compo-tooltip-btn
            TitleProp="자세히 보기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 plus"
            TooltipPositionProp="bottom"
            :MinWidthProp=22
            :HeightProp=22
          ></compo-tooltip-btn>
        </div>
      </h3>
      <div class="is-mt-s is-border-sub-top" >
        <ul class="pl-list-dot is-no-border spacing-wrap sp-8 flex-column">
          <li
            @click="slideDaily = true"
            v-for="item in DAILY_LIST"
            class="d-flex align-center hover-bold"
            :key="item.id">
            <span class="is-ellips" style="width: auto;">{{ item.text }}</span>
            <span
              v-if="item.new"
              class="pl-badge is-new">N</span>
          </li>
        </ul>
      </div>
    </div>


    <!-- 상담 자료 -->
    <div>
      <h3 class="pl-subtit is-h3 is-mt-l">
        <strong class="pl-card-intop--title ">상담 자료</strong>
        <div class="d-flex align-center ml-auto">
          <compo-tooltip-btn
            TitleProp="자세히 보기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 plus"
            TooltipPositionProp="bottom"
            :MinWidthProp=22
            :HeightProp=22
          ></compo-tooltip-btn>
        </div>
      </h3>
      <div class="is-mt-s is-border-sub-top" >
        <ul class="pl-list-dot is-no-border spacing-wrap sp-8 flex-column">
          <li
            @click="showSlide('dialogknInfo', 2)"
            v-for="item in COUNSEL_LIST"
            class="d-flex align-center hover-bold"
            :key="item.id">
            <span class="is-ellips" style="width: auto;">{{ item.text }}</span>
            <span
              v-if="item.new"
              class="pl-badge is-new">N</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 평가일정 -->
    <HomeSideExam />

    <!-- dialog: 오늘의 일정 -->
    <v-dialog
      v-model="dialogTodaySchedule"
      content-class="dialog-draggable is-maxHeight"
      width="1750"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="오늘의 일정"
        @hide="mixin_hideDialog('TodaySchedule')"
        @submit="submitDialog('TodaySchedule')"
        :FooterProp="false"
        :OpenPopProp="true"
      >
        <template slot="body">
          <HomeTodaySchedule />
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- slide: 데일리 -->
    <v-slide-x-reverse-transition>
      <div v-if=" slideDaily === true "
        class="pl-quick-layer"
        style="width: 600px;"
        >
        <div class="pl-quick-layer-header"><h1>데일리</h1>
          <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick=""
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideDaily = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0" >
          <HomeSideDaily />
        </div>
      </div>
    </v-slide-x-reverse-transition>



  </div>
</template>

<script>
import HomeSideExam from '@/views/page/Home/HomeSideExam'
import HomeTodaySchedule from './HomeTodaySchedule'
import HomeSideDaily from './HomeSideDaily'

export default {
  name: "HomeSide", //name은 'MENU_' + 파일명 조합
  components: {
    HomeSideExam,
    HomeTodaySchedule,
    HomeSideDaily,
  },
  data() {
    return {

      // 오늘의 일정
      TODAY_SCH: [
        { title: '오늘', value: 0 },
        { title: '어제', value: 2 },
        { title: '최근 일주일', value: 12 }
      ],
      dialogTodaySchedule: false,

      // 데일리
      slideDaily: false,
      DAILY_LIST: [
        { text: '관심지역 알리미 등록 관련', new: true, },
        { text: '정읍시 행복주택 예비입주자 모집_현장접수 공고일', new: true, },
        { text: '2024년 7월 행복주택 예비입주자 통합 정례모집 사전 안내' },
        { text: '순천시, 광양시 국민임대주택 예비입주자 모집공고' },
        { text: '양주 옥정 A8BL 영구임대주택 입주자격 완화 예비입주자 모집' },
      ],

      // 상담자료
      COUNSEL_LIST: [
        { text: '주택공급 확대 방안 발표자료(8.8) 및', new: true},
        { text: '[인천광역시] 기존주택 등 매일임대주', },
        { text: '서울잠실, LH수서2(수서역세권 A2BL)행복주택', },
        { text: '대구광역시 북구 기존주택 등 매입임대주택', },
        { text: '예산군청(행복) 단지 예비자 계약 안내문 및', },
      ],

    }
  },
  methods: {
    showSlide(slide, tabNum){
      this.$eventBus.$emit('showRightSlide', {ACT_NM: slide, active:false, tabNum: tabNum});
    },
  },
  mounted() {
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>