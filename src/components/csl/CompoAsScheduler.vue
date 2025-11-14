<template>
  <div>
    <!-- 스케쥴러 정보 -->
    <CompoAsScheduler_INFO
      :IsExpandSchListProp="isExpandSchList"
      :IsHideSchInfoProp="isHideSchInfo"
      @toggleExpandSchList="toggleExpandSchList"
      @toggleHideSchInfo="toggleHideSchInfo"
      />

    <!-- 상세 grid -->
    <CompoAsScheduler_GRID
      :IsExpandSchListProp="isExpandSchList"
      :IsHideSchInfoProp="isHideSchInfo"
    />

    <!-- 상세 table -->
    <CompoAsScheduler_DETAIL />

  </div>
</template>

<script>
import CompoAsScheduler_INFO from '@/components/csl/CompoAsScheduler_INFO.vue'
import CompoAsScheduler_GRID from '@/components/csl/CompoAsScheduler_GRID.vue'
import CompoAsScheduler_DETAIL from '@/components/csl/CompoAsScheduler_DETAIL.vue'

export default {
  name: "CompoAsScheduler", //바로처리센터 스케쥴러
  components: {
    CompoAsScheduler_INFO,
    CompoAsScheduler_GRID,
    CompoAsScheduler_DETAIL
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