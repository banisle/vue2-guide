<template>
    <div class="pl-card">
      <CompoAsSchedulerMobile_GRID
      :IsExpandSchListProp="true"
      :IsHideSchInfoProp="false"
      :IsPopupProp="true"
    />
    </div>
  </template>
  
  <script>
  import CompoAsSchedulerMobile_GRID from '@/components/csl/CompoAsSchedulerMobile_GRID.vue'

  export default {
    name: 'CompoAsPopScheduler', //스케줄러 팝업으로 보기
    components: {
      CompoAsSchedulerMobile_GRID
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