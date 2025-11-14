<template>
  <div class="pl-leave-cover" >
    <div class="pl-leave-cover--time">{{ CUSL_STAT_TIME }}</div>
    <div class="pl-leave-cover--img-wrap is-mt-l">
      <div :class="`pl-leave-cover--img-wrap-img type-${moveStatInfo(moveStatTxt, 'type')}`"></div>
    </div>
    <h1
      class="is-mt-l pl-leave-cover--text"
      :data-text="`지금은 ${moveStatTxt} 중 입니다.`">지금은 <span class="is-txt-yellow">{{ moveStatTxt }}</span> 중 입니다.</h1>
    <div class="is-mt-s pl-leave-cover--content is-txt-white">{{ moveStatInfo(moveStatTxt, 'subText') }}</div>
    <div style="margin-top: 40px;">
      <v-btn class="" rounded flat large @click="$emit('Hide')">복귀</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompoLeaveCover', //이석 화면보호기
  props: {
    moveStatTxt: {
      type: String,
      default: '' //휴식,교육
    },
  },
  components: {
  },
  data() {
    return {
      CUSL_STAT_TIME: '00:00:00',
      moveStatList: [
        {
          text: '식사',
          type: 'launch',
          subText: '항상 친절한 목소리로 응대해 주는 당신께 늘 감사드립니다.^^'
        },
        {
          text: '휴식',
          type: 'rest',
          subText: '탕비실에 맛있는 커피가 있어요. 잠깐의 여유를 가져보세요!!'
        },
        {
          text: '교육',
          type: 'edu',
          subText: '주위의 동료에게 가끔 따뜻한 말 한마디와 격려는 서로에게 힘이 된답니다.'
        },
      ],
    }
  },
  methods: {
    setStatTime(){
      let setSeconds = 0;
      this.CTI_CALL_TIMER = setInterval(() => {
        this.CUSL_STAT_TIME = this.mixin_seconds_toHHMMSS(setSeconds++);
      }, 1000);
    },
    moveStatInfo(stat, key) {
      const statItem = this.moveStatList.find(item => item.text === stat);
      return statItem ? statItem[key] : undefined;
    }
  },
  mounted() {
  },
  created() {
    this.setStatTime(); //CTI OFF 타이머 시작
  },
  computed: {

  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>