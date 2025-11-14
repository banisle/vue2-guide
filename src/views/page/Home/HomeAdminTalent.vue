<template>
  <div
      class="pl-card pa-0 pt-3 d-flex flex-column is-nopadding"
      style="flex: 1 1 calc(100% - 394px); ">
      <div class="pl-cols fill-height px-8" style="gap: 24px">
        <div class="py-4  fill-height">
          <div class="d-flex flex-column" style="flex: 1 1 calc(100% - 698px); gap: 24px">
            <!-- 상담품질 평가 진행 현황 -->
            <HomeAdminQualityTest />
            <!-- 업무능력 평가 진행 현황 -->
            <HomeAdminWorkTest />

          </div>
        </div>
        <!-- 현항 -->
        <div class="d-flex flex-column is-col-fix py-4" style="width: 400px; gap: 24px">
          <!-- 이의제기 현황 -->
          <HomeAdminObjection />
          <!-- 공지사항 -->
          <!-- <HomeAdminNotice /> -->
          <!-- 지식정보 -->
          <HomeAdminKms />
        </div>

      </div>

  </div>
</template>

<script>
import HomeAdminQualityTest from '@/views/page/Home/HomeAdminQualityTest'
import HomeAdminWorkTest from '@/views/page/Home/HomeAdminWorkTest'
import HomeAdminObjection from '@/views/page/Home/HomeAdminObjection'
import HomeAdminNotice from '@/views/page/Home/HomeAdminNotice'
import HomeAdminKms from '@/views/page/Home/HomeAdminKms'

export default {
  name: 'HomeAdminTalent', //인재개발팀 홈
  components: {
    HomeAdminQualityTest,
    HomeAdminWorkTest,
    HomeAdminObjection,
    HomeAdminNotice,
    HomeAdminKms
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
    console.log("HomeAdmin");
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>