<template>
  <div class="pl-cols fill-height">
    <div class="is-vrt py-4 px-8 fill-height">
      <div class="d-flex flex-column"
      style="flex: 1 1 calc(100% - 698px); gap: 24px">
        <!-- 시간별 응대 현황 -->
        <HomeLeaderStatTime />

        <!--팀 주간 상담 현황 -->
        <HomeLeaderStatCS />

        <!-- 공지 -->
        <HomeStatNotice />

      </div>
    </div>
    <!-- 현항 -->
    <div class="d-flex flex-column is-col-fix py-4 px-8" style="width: 400px;">
      <!-- 근태 현황 -->
      <HomeLeaderStatWork />

      <!-- side 현황 -->
      <HomeLeaderStatUndone />
    </div>

  </div>
</template>

<script>
import HomeLeaderStatTime from './HomeLeaderStatTime.vue'
import HomeLeaderStatCS from './HomeLeaderStatCS.vue'
import HomeStatNotice from './HomeStatNotice.vue'
import HomeLeaderStatWork from './HomeLeaderStatWork.vue'
import HomeLeaderStatUndone from './HomeLeaderStatUndone.vue'


export default {
  name: "HOME_TEAM_TAB_DASHBOARD", //name은 'MENU_' + 파일명 조합
  components: {
    HomeLeaderStatCS,
    HomeLeaderStatWork,
    HomeLeaderStatUndone,
    HomeLeaderStatTime,
    HomeStatNotice
  },
  created() {
  }

}
</script>

<style lang="scss" scoped>

</style>