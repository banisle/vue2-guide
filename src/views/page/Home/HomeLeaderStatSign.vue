<template>
  <div class="py-3 is-border-sub-top" style="flex: 1 1 calc(15%);">
    <h3 class="pl-subtit is-h3">
      <v-icon class="pl-icon20 stat-sign"></v-icon>
      <span class="ml-1">신청 현황</span>
      <compo-tooltip-btn
        TitleProp="새로고침"
        ClassProp="pl-tooltip-btn ml-auto"
        IconProp="pl-icon20 refresh"
        TooltipPositionProp="bottom"
        :MinWidthProp=22
        :HeightProp=22
      ></compo-tooltip-btn>
    </h3>
    <div class="is-mt-m d-flex flex-column" style="gap: 4px">
      <div
        class="d-flex align-center hover-bold"
        @click="index === 0 ? sideVacation = true : index === 1 ? slideBlack = true : index === 2 ? slideRequest = true : ''"
        v-for="item,index in STAT"
        :key="item.id">
        <span>{{ item.title }}</span>
        <strong class="ml-auto">{{ item.countC }}/{{ item.countM }}</strong>
      </div>
    </div>
    <!-- slide: 휴가 신청 현황 -->
    <v-slide-x-reverse-transition>
      <div
        style="width: 550px;"
        class="pl-quick-layer "
        v-if=" sideVacation === true ">
        <div class="pl-quick-layer-header"><h1>휴가 신청 현황</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="sideVacation = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <HomeSideVacation />
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- slide: 배려고객 현황 -->
    <v-slide-x-reverse-transition>
      <div
        style="width: 550px;"
        class="pl-quick-layer "
        v-if=" slideBlack === true ">
        <div class="pl-quick-layer-header"><h1>배려고객 현황</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideBlack = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <StatusBoardBlack />
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- slide: 제보요청 현황 -->
    <v-slide-x-reverse-transition>
      <div
        style="width: 550px;"
        class="pl-quick-layer type-side"
        v-if=" slideRequest === true ">
        <div class="pl-quick-layer-header"><h1>제보요청 현황</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideRequest = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <StatusBoardRequest />
        </div>
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import HomeSideVacation from './HomeSideVacation'
import StatusBoardBlack from '@/views/page/StatusBoardBlack'
import StatusBoardRequest from '@/views/page/StatusBoardRequest'

export default {
  name: "HomeLeaderStatSign", //name은 'MENU_' + 파일명 조합
  components: {
    HomeSideVacation,
    StatusBoardBlack,
    StatusBoardRequest
  },
  data() {
    return {
      sideVacation: false,
      slideBlack: false,
      slideRequest: false,

      STAT: [
        { title: '휴가 신청 현황', countC: 3, countM: 2 },
        { title: '배려고객 요청 현황', countC: 11, countM: 9},
        { title: '제보 신청 현황', countC: 25, countM: 17 },
      ]

    }
  },
  methods: {
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