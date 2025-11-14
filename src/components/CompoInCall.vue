<template>
  <div class="pl-call-dialog">
    <div class="pl-call-dialog-portrait type-in">
      <vLottiePlayer
        name="lottieInbound"
        :autoplay=true
        :loop=true
        width="120px"
        height="120px"
        :animationData="require('@/assets/lottie/animation_inbound.json')"
      />
    </div>
    <div class="pl-call-dialog-info is-mt-m">
      <!-- <span>{{ computedUserCenterDeptNm }}</span> -->

      <div class="pl-form-inline-wrap vertical type-auto is-mt-s gap-8">
        <template v-if="DataProp.otherdn.indexOf('T') > -1">
          <div class="pl-form-inline">
            <span class="pl-label align-self-center pt-0 pl-sub-tit">
              발신번호
            </span>
            <div class="pl-desc">
              <div class="pl-text-box is-txt-black justify-start" style="width:133px;">{{ this.mixin_setPhoneNo(DataProp.UEI01[0].replace(/[^0-9]/g, '')) }}</div>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label align-self-center pt-0 pl-sub-tit">
              접속정보
            </span>
            <div class="pl-desc">
              <div class="pl-text-box is-txt-black justify-start">{{ DataProp.UEI20[0] }}</div>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label align-self-center pt-0 pl-sub-tit">
              대기시간
            </span>
            <div class="pl-desc">
              <div class="pl-text-box is-txt-black justify-start">{{ getTimeDifference(DataProp.datetime, DataProp.UEI39[0]) }}</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="pl-form-inline">
            <span class="pl-label align-self-center pt-0 pl-sub-tit">
              소속 정보
            </span>
            <div class="pl-desc">
              <div class="pl-text-box is-txt-black justify-start">{{ DataProp.CUSTCO_NM[0] + ' - ' + DataProp.DEPT_NM[0]}}</div>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label align-self-center pt-0 pl-sub-tit">
              상담사명
            </span>
            <div class="pl-desc">
              <div class="pl-text-box is-txt-black justify-start">{{ DataProp.USER_NM[0]}}</div>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label align-self-center pt-0 pl-sub-tit">
              내선 번호
            </span>
            <div class="pl-desc">
              <div class="pl-text-box is-txt-black justify-start">{{ DataProp.EXT_NO[0] }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="pl-btn-wrap is-mt-m pb-6">
      <v-btn class="pl-btn type-call" @click="inCall()">전화 받기</v-btn>
    </div>
  </div>
</template>

<script>
  import { eventBus } from "@/store/eventBus.js";           //Event Bus

  export default {
    name: 'CompoInCall',
    props: {
      DataProp: {
        type: Object,
      },
    },
    data() {
      return {
        diffSec : 0
      }
    },
    computed: {
    },
    watch: {
    },
    async created() {
    },
    mounted() {
    },
    methods: {
      //전화 받기
      inCall(){
        this.$emit("inCall", this.DataProp);
      },

      parseDate(dateStr) {
          const year = parseInt(dateStr.substring(0, 4), 10);
          const month = parseInt(dateStr.substring(4, 6), 10) - 1; // 월은 0부터 시작
          const day = parseInt(dateStr.substring(6, 8), 10);
          const hours = parseInt(dateStr.substring(8, 10), 10);
          const minutes = parseInt(dateStr.substring(10, 12), 10);
          const seconds = parseInt(dateStr.substring(12, 14), 10);
          
          return new Date(year, month, day, hours, minutes, seconds);
      },

      getTimeDifference(dateStr1, dateStr2) {
          const date1 = this.parseDate(dateStr1);
          const date2 = this.parseDate(dateStr2);

          // 두 날짜의 차이 (밀리초 단위)
          const diffInMilliseconds = Math.abs(date2 - date1);

          // 밀리초를 일, 시간, 분, 초로 변환
          const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
          const diffInMinutes = Math.floor(diffInSeconds / 60);
          const diffInHours = Math.floor(diffInMinutes / 60);
          const diffInDays = Math.floor(diffInHours / 24);

          // 남은 시간, 분, 초
          const remainingHours = diffInHours % 24;
          const remainingMinutes = diffInMinutes % 60;
          const remainingSeconds = diffInSeconds % 60;

          let rst = '';
          if(diffInDays > 0 ) rst += diffInDays + '일 ';
          if(remainingHours > 0 ) rst += remainingHours + '시간 ';
          if(remainingMinutes > 0 ) rst += remainingMinutes + '분 ';
          if(remainingSeconds > 0 ) rst += remainingSeconds + '초';
          return rst;
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>