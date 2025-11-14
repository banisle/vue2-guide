<template>
  <div>
    <div class="d-flex align-center">
      <strong class="pl-card-intop--title">실적 평가</strong>
      <div class="d-flex align-center ml-auto">
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          :MinWidthProp=22
          :HeightProp=22
        ></compo-tooltip-btn>
      </div>
    </div>
    <div class="pl-rounded-box is-mt-s ">
      <div class="d-flex pa-5">
        <strong class="pl-subtit">2024년 <strong class="is-txt-cyan">(06)</strong>월 실적평가 </strong>
      </div>
      <div
        class="d-flex flex-column px-5 py-1 is-border-top"
        style=" padding-bottom: 9px !important;">
        <div
          :class="`d-flex flexalign-center py-3 ${ index !== 0 ? 'is-border-sub-top' : ''}`"
          v-for="item,index in RESULT_LIST"
          :key="item.id">
          <span>{{ item.title }}</span>
          <span class="ml-auto text-center" style="flex: 0 0 120px">{{ item.date }}</span>
          <span :class="`pl-bullet-txt type-dot ml-10 ${ item.stat ? 'is-stat-wait' : 'is-stat-out' }`">
            {{ item.stat ? '확정' : '진행' }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { result } from 'lodash';

export default {
  name: 'HomeAdminAccomplishment', //실적 평가
  components: {
  },
  data() {
    return {
      RESULT_LIST: [
        { title: '마이홈센터', stat: true, date: '2024-06-20 17:07:44'},
        { title: '바로처리센터', stat: false,  date: '-'},
        { title: '전세임대센터', stat: true,  date: '2024-06-20 17:07:44'},
        { title: '주택지원센터', stat: true,  date: '2024-06-20 17:07:44'},
      ],

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