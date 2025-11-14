<template>
  <div
    class="pl-card pa-0 d-flex flex-column is-nopadding"
    style="flex: 1 1 calc(100% - 394px); ">
    <!-- <div class="pt-5 px-8 d-flex">
      <h2 class="pl-subtit is-lg " style="width: auto ;cursor: pointer">
        {{ selectModel01 }} - {{ dropItems01 }}
        <v-icon class="pl-icon20 arrow-up ml-2 "></v-icon>
      </h2>
      <div class="ml-auto pl-btn-wrap">
        <v-icon class="pl-icon20 total-manager"></v-icon>
        <strong class="is-txt-black">
          총원
          <span class="is-txt-blue">{{ MANAGER_STAT.total }}</span>
        </strong>
        <span class="is-txt-black">
          ( 풀타임 {{ MANAGER_STAT.fulltime }} / 파트타임 {{ MANAGER_STAT.parttime }} )
        </span>

      </div>
    </div> -->
    <!-- tabs -->
    <div class="is-border-bottom px-8 pt-3">
      <v-tabs
        v-model="leader_home_tab_index"
        class="pl-tabs is-noborder is-mt-s">
        <CompoTabItems
          @update:leader_home_tab_index="changeTab"
          :TabsList=tabsList1
          class="mt-0" />
      </v-tabs>
    </div>
    <!-- content -->
    <div style="height: 100%" >
      <v-tabs-items
        v-model="leader_home_tab_index"
        class="fill-height"
        style="background: transparent"
        >
        <CompoTabContent
          StyleProp="margin-top: 0 !important"
          :TabsList=tabsList1 />
      </v-tabs-items>

    </div>
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CompoTabContent from '@/components/CompoTabContent.vue';

export default {
  name: "HomeLeaderBoard", //name은 'MENU_' + 파일명 조합
  components: {
    CompoTabItems,
    CompoTabContent,
  },
  data() {
    return {
      MANAGER_STAT: {
        total: 30,
        fulltime: 25,
        parttime: 5,
      },
      selectModel01: '마이홈센터',
      dropItems01: '마이홈1팀',

      // tabsList1
      tabsList1: [
        { title: '대시보드', content: 'HOME_TEAM_TAB_DASHBOARD', badge: false},
        { title: '직원정보', content: 'HOME_TEAM_TAB01', badge: false},
        { title: '상담콜 현황', content: 'HOME_TEAM_TAB011', badge: false},
        { title: '상담 현황', content: 'HOME_TEAM_TAB02', badge: false},
        { title: '근태', content: 'HOME_TEAM_TAB03', badge: false},
        { title: '근무시간', content: 'HOME_TEAM_TAB031', badge: false},
        { title: '가감점', content: 'HOME_TEAM_TAB04', badge: false},
        { title: '보정시간', content: 'HOME_TEAM_TAB05', badge: false},
        { title: '코칭', content: 'HOME_TEAM_TAB06', badge: false},
        { title: '업무평가', content: 'HOME_TEAM_TAB07', badge: false},
        { title: '상담품질평가', content: 'HOME_TEAM_TAB08', badge: false},
        { title: '실적표', content: 'HOME_TEAM_TAB09', badge: false},
        { title: '모니터링', content: 'HOME_TEAM_TAB010', badge: false},
      ],

      // 팀관리
      tabs2: null,
      tabsList: [
      ],
    }
  },
  computed: {
    leader_home_tab_index: {
      get(){
        return this.$store.getters['commonStore/GE_COMMON_LEADER_HOME_TAB'];
      },
      set(data){
        this.$store.dispatch('commonStore/AC_COMMON_LEADER_HOME_TAB', data);
      },
    },
  },
  watch: {
  },
  mounted() {
  },
  async created() {
  },
  methods: {
    changeTab(index) {
      this.$eventBus.$emit('clearVSlideXreverse');
      this.$store.dispatch('commonStore/AC_COMMON_LEADER_HOME_TAB', index);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>