<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- <compo-sub-layout-top  NoBorderProp /> -->
      <!-- <HOME_TEAM_TAB01></HOME_TEAM_TAB01> -->
      <AdminLeaderBoard />
    </div>
  </div>
</template>

<script>
// import HOME_TEAM_TAB01 from '@/views/page/Home/HOME_TEAM_TAB01.vue'
import AdminLeaderBoard from './Home/AdminLeaderBoard.vue'

export default {
  name: "MENU_CTM_M0100", //name은 'MENU_' + 파일명 조합
  components: {
    // HOME_TEAM_TAB01,
    AdminLeaderBoard,
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