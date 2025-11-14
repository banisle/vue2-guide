<template>
  <div>
    <!-- 스케쥴러 정보 -->
    <CompoAsSchedulerMobile_INFO
      :IsExpandSchListProp="isExpandSchList"
      :IsHideSchInfoProp="isHideSchInfo"
      @toggleExpandSchList="toggleExpandSchList"
      @toggleHideSchInfo="toggleHideSchInfo"
      />

    <!-- 상세 grid -->
    <CompoAsSchedulerMobile_GRID
      :IsExpandSchListProp="isExpandSchList"
      :IsHideSchInfoProp="isHideSchInfo"
    />

    <!-- 상세 table -->
    <CompoAsSchedulerMobile_DETAIL />

  </div>
</template>

<script>
import CompoAsSchedulerMobile_INFO from '@/components/csl/CompoAsSchedulerMobile_INFO.vue'
import CompoAsSchedulerMobile_GRID from '@/components/csl/CompoAsSchedulerMobile_GRID.vue'
import CompoAsSchedulerMobile_DETAIL from '@/components/csl/CompoAsSchedulerMobile_DETAIL.vue'

export default {
  name: "CompoAsSchedulerMobile", //바로처리센터 스케쥴러 모바일(수도권)
  components: {
    CompoAsSchedulerMobile_INFO,
    CompoAsSchedulerMobile_GRID,
    CompoAsSchedulerMobile_DETAIL
  },
  data() {
    return {
      //스케줄러 목록 확장 여부
      isExpandSchList: false,
      //검색 영역 숨김 여부
      isHideSchInfo: false,
    }
  },
  methods: {
    toggleExpandSchList(val){
      this.isExpandSchList = !val
    },
    toggleHideSchInfo(val){
      this.isHideSchInfo = !val
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