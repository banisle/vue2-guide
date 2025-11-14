<template>
  <div class="pl-container">
   <div class="pl-card-wrap">
    <!-- sub top -->
    <compo-sub-layout-top  NoBorderProp>

    </compo-sub-layout-top>
    <!-- sub content -->
    <HOME_TEAM_TAB02 gridHeightProp="calc(-345px + 100vh)" :layoutSub="true"/>

   </div>

 </div>
</template>

<script>
import HOME_TEAM_TAB02 from '@/views/page/Home/HOME_TEAM_TAB02.vue' //상담 현황

export default {
  name: "MENU_CSL_M0501", //상담이력 조회
  components: {
    HOME_TEAM_TAB02
  },
  data() {
    return {


    }
  },
  watch: {
  },
  computed: {
  },
  mounted() {
  },
  async created() {
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>