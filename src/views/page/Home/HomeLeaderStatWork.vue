<template>
  <div class="" style="">
    <h3 class="pl-subtit is-h3">
      <strong class="pl-card-intop--title ">오늘의 근태</strong>
      <compo-tooltip-btn
        TitleProp="새로고침"
        ClassProp="pl-tooltip-btn ml-auto"
        IconProp="pl-icon20 refresh"
        TooltipPositionProp="bottom"
        :MinWidthProp=22
        :HeightProp=22
        @btnClick="mixin_reloadCuttStat('TODAY_USER_WKATTD_STAT')"
      ></compo-tooltip-btn>
    </h3>
    <div class="pl-rounded-box is-mt-s px-5 py-3">
      <div class="d-flex align-center">
        <div class="pl-rounded-box pa-1 is-bg-light">
          <v-icon class="pl-icon20 stat-undone"></v-icon>
        </div>
        <div class="flex-grow-1 ml-2">
          <div class="d-flex align-center">
            <strong>출근 </strong>
            <strong class="ml-1"><span class="is-txt-green">{{ TODAY_ATDC_CNT }}</span> / {{TODAY_ATDC_TOTCNT}}</strong>
            <strong class="ml-auto">{{ TODAY_ATDC_RT }}</strong>%
          </div>
          <div class="pl-monitor-progress mt-1">
            <div class="pl-monitor-progress-bar is-bg-green" :style="`width: ${ TODAY_ATDC_RT }%`"></div>
          </div>
        </div>

      </div>
      <div
        style="cursor: pointer;"
        class="pl-vertical-list type-2 is-mt-m is-border-sub-top pt-3"
        >
        <div
          @click="showSlide('slideTodayWkattd')"
          class="pl-vertical-list--unit hover-bold"
          v-for="item in TODAY_USER_WKATTD_STAT"
          :key="item.STTS_KEY_CD">
          <span>{{ item.title }}</span>
          <strong :class="`ml-auto ${ item.class }`">{{ item.count }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HomeSideTodayWkattd from './HomeSideTodayWkattd'
export default {
  name: "HomeLeaderStatWork", //name은 'MENU_' + 파일명 조합
  components: {
    HomeSideTodayWkattd
  },
  data() {
    return {
      TODAY_ATDC_RT: 0,
      TODAY_ATDC_CNT: 0,
      TODAY_ATDC_TOTCNT: 0,
    }
  },
  methods: {
    showSlide(slide, tabNum){
      this.$eventBus.$emit('showVSlideXreverse', {slide : slide, tabNum : tabNum})
    },
    selectTodayAtntRt() {

      if( this.TODAY_USER_WKATTD_STAT.length > 0){
        let totalEmp = 0;
        let atndCnt = 0;
        this.TODAY_USER_WKATTD_STAT.forEach((item, idx) => {
          if( idx === 0 ) totalEmp = item.countBase;
          if( item.STTS_KEY_CD === 'ATDC'/*출근*/ || item.STTS_KEY_CD === 'LATE'/*지각*/ ) atndCnt += parseInt(item.count);
        });

        this.TODAY_ATDC_TOTCNT = totalEmp;
        this.TODAY_ATDC_CNT = atndCnt;
        this.TODAY_ATDC_RT = ((this.TODAY_ATDC_CNT / this.TODAY_ATDC_TOTCNT) * 100).toFixed(2);

        this.TODAY_USER_WKATTD_STAT.forEach((item, idx) => {
          if(item.STTS_KEY_CD === 'ATDC' /*출근*/) item.count = atndCnt;
        });
      }
    }
  },
  mounted() {},
  created() {
    this.selectTodayAtntRt();
  },
  computed: {
  },
  watch: {
    TODAY_USER_WKATTD_STAT() {
      this.selectTodayAtntRt();
    }
  },
};
</script>

<style lang="scss" scoped>

</style>