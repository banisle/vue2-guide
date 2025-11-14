<template>
  <div class="pl-container type-home2">
    <template v-if="computedUserType !== 'ETC_ADMIN'">
      <!-- left: 매니저 정보-->
      <HomeProfile />
      <template v-if="computedUserType === 'MANAGER'">
        <HomeManagerBoard />
      </template>
      <!-- 센터장or팀장(부팀장) 대쉬보드 -->
      <template v-if="computedUserType === 'LEADER'">
        <HomeLeaderBoard />
      </template>
    </template>
    <!-- 관리자 -->
    <template v-else-if="computedUserDetailType === 'SYS_ADMIN'">
      <SYS_M0201 style="width: 100%"/>
    </template>
    <template v-else>
      <template v-if="computedUserDetailType === 'SYS_HUMAN'">
        <!-- 인재개발관리자 -->
        <HomeAdminTalent />
      </template>
      <template v-else>
        <!-- 센터운영관리자 -->
        <HomeAdmin />
      </template>

    </template>

  </div>
</template>

<script>
import HomeProfile from './Home/HomeProfile.vue'
import HomeManagerBoard from './Home/HomeManagerBoard.vue'
import HomeLeaderBoard from './Home/HomeLeaderBoard.vue'
import HomeAdmin from './Home/HomeAdmin.vue'
import HomeAdminTalent from './Home/HomeAdminTalent.vue'
import SYS_M0201 from '@/views/page/SYS_M0201.vue'

export default {
  name: "MENU_home", //name은 'MENU_' + 파일명 조합
  components: {
    HomeProfile,
    HomeLeaderBoard,
    HomeManagerBoard,
    HomeAdmin,
    HomeAdminTalent,
    SYS_M0201
  },
  data() {
    return {
    }
  },
  computed: {

  },
  watch: {
  },
  mounted() {
  },
  beforeDestroy(){
  },
  async created() {
    console.log('computedUserDetailType : ', this.computedUserDetailType);
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>

</style>