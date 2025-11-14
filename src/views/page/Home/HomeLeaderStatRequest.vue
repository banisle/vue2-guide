<template>
  <div class="py-3 is-border-sub-top" style="flex: 1 1 calc(18%);">
    <h3 class="pl-subtit is-h3">
      <v-icon class="pl-icon20 stat-request"></v-icon>
      <span class="ml-1">업무 협조 현황</span>
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
        @click="showSlide('slideTrans', index)"
        v-for="item,index in STAT"
        :key="item.id">
        <span>{{ item.title }}</span>
        <strong class="ml-auto">{{ item.count }}</strong>
      </div>
    </div>
     <!-- slide: 상담내용 이첩 현황 -->
     <v-slide-x-reverse-transition>
      <div class="pl-quick-layer type-side" v-if=" slideTrans === true ">
        <div class="pl-quick-layer-header"><h1>상담내용 이첩 현황</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="slideTrans = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <StatusBoardTrans :TabProp="tabNum" />
        </div>
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import StatusBoardTrans from '@/views/page/StatusBoardTrans'
export default {
  name: "HomeLeaderStatRequest", //name은 'MENU_' + 파일명 조합
  components: {
    StatusBoardTrans
  },
  data() {
    return {
      slideTrans: false,
      STAT: [
        { title: '이첩 요청', count: 5 },
        { title: '이첩 접수', count: 2 },
        { title: '이첩 반려', count: 1 },
        { title: '이첩 회수', count: 0 },
      ]
    }
  },
  methods: {
    showSlide(slide, tabNum){
      this[`${slide}`] = true
      this.tabNum = tabNum
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