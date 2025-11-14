<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  NoBorderProp />
      <!-- sub content -->
      <HOME_TEAM_TAB06 ></HOME_TEAM_TAB06>
    </div>
  </div>
</template>

<script>
/* 코칭 */
import HOME_TEAM_TAB06 from '@/views/page/Home/HOME_TEAM_TAB06.vue'
export default {
  name: "MENU_CTM_M0900", //name은 'MENU_' + 파일명 조합
  components: {
    HOME_TEAM_TAB06,
  },
  data() {
    return {}
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
<style lang="scss" scoped></style>