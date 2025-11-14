<template>
  <div class="clock">{{ dateTime }}</div>
</template>

<script>

export default {
  name: "DateClock",
  props: {
    format: { type: String, default: "y/MM/DD (dddd) H:mm:ss" }
  },
  data() {
    return {
      dateTime: null
    };
  },
  mounted() {
    this.$moment.lang('ko', {
      weekdays: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],     //영문명이던 날짜를 한글로 변환
      weekdaysShort: ["일","월","화","수","목","금","토"],
    });
    let callback = () => this.dateTime = this.$moment().format(this.format)
    callback();
    this.timerId = setInterval(callback, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timerId);
  }
}

</script>

<style scoped>
.clock{
  line-height: 0;
}
</style>