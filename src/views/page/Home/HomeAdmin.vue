<template>
  <div
      class="pl-card pa-0 pt-3 d-flex flex-column is-nopadding"
      style="flex: 1 1 calc(100% - 394px); ">
      <div class="pl-cols fill-height px-8" style="gap: 24px">
        <div class="py-4  fill-height">
          <div class="d-flex flex-column " style="flex: 1 1 calc(100% - 698px); gap: 24px">
            <div class="pl-cols" style="gap: 24px">
              <!-- 배려고객 현황 -->
              <HomeAdminBlack class="is-col-fix" style="width: 40%;"/>
              <!-- 대/내외 민원 현황 -->
              <HomeAdminRequest />
            </div>
            <!-- 일일업무 보고 현황 -->
            <HomeAdminDaily />

          </div>
        </div>
        <!-- 현항 -->
        <div class="d-flex flex-column is-col-fix py-4" style="width: 400px; gap: 24px">
          <!-- 실적 평가 -->
          <HomeAdminAccomplishment />
          <!-- 공지사항 -->
          <!-- <HomeAdminNotice /> -->
          <!-- 지식정보 -->
          <HomeAdminKms />
        </div>

      </div>

  </div>
</template>

<script>
import HomeAdminBlack from '@/views/page/Home/HomeAdminBlack'
import HomeAdminRequest from '@/views/page/Home/HomeAdminRequest'
import HomeAdminDaily from '@/views/page/Home/HomeAdminDaily'
import HomeAdminAccomplishment from '@/views/page/Home/HomeAdminAccomplishment'
import HomeAdminNotice from '@/views/page/Home/HomeAdminNotice'
import HomeAdminKms from '@/views/page/Home/HomeAdminKms'

export default {
  name: 'HomeAdmin', //운영개발팀 홈
  components: {
    HomeAdminBlack,
    HomeAdminRequest,
    HomeAdminDaily,
    HomeAdminAccomplishment,
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