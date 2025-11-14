<template>
  <div class="pl-cols fill-height">
    <div class="is-vrt py-4 px-8 fill-height">
      <!-- <div class="d-flex flex-column" style="flex: 1 1 calc(100% - 698px); gap: 24px"> -->
      <div class="d-flex flex-column" style="flex: 1 1 calc(100% - 698px); gap: 24px">
        <!-- center: 주간 상담 현황 -->
        <HomeStatMyCs />

        <!-- blank -->
        <div style="flex: 1 1 26%;">
          <HomeManagerMy />
        </div>

        <!-- 공지 -->
        <HomeStatNotice />

      </div>
    </div>
    <!-- right:  제보요청, 배려 고객 요청, 업무 현황-->
    <!-- <div class="d-flex flex-column is-col-fix py-4 px-8" style="width: 320px;">
      <HomeSide />
    </div> -->

  </div>
</template>

<script>
import HomeSide from './HomeSide.vue'
import HomeStatMyCs from './HomeStatMyCs.vue'
import HomeStatNotice from './HomeStatNotice.vue'
import HomeStatWeekly from './HomeStatWeekly.vue'
import HomeManagerMy from './HomeManagerMy.vue'

export default {
  name: "HOME_MANAGER_TAB_DASHBOARD", //name은 'MENU_' + 파일명 조합
  components: {
    HomeSide,
    HomeStatMyCs,
    HomeStatWeekly,
    HomeStatNotice,
    HomeManagerMy
  },
  data() {
    return {

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