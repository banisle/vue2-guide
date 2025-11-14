<template>
  <div
    class="pa-0 d-flex flex-column"
    style="flex: 1 1 calc(100% - 394px); ">
    <!-- <div class="pt-5 px-8 d-flex">
      <h2 class="pl-subtit is-lg " style="width: auto ;cursor: pointer">
        {{ selectModel01 }} - {{ dropItems01 }}
        <v-icon class="pl-icon20 arrow-up ml-2 "></v-icon>
      </h2>
    </div> -->
    <!-- tabs -->
    <div class="is-border-bottom px-8 pt-3">
      <v-tabs
        v-model="manager_home_tab_index"
        class="pl-tabs is-noborder is-mt-s">
        <CompoTabItems
          @update:manager_home_tab_index
          :TabsList=tabsList1
          class="mt-0" />
      </v-tabs>
    </div>
    <!-- content -->
    <div style="height: 100%" >
      <v-tabs-items
        v-model="manager_home_tab_index"
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
import { mapGetters, mapState } from 'vuex';
import CompoTabItems from '@/components/CompoTabItems.vue';
import CompoTabContent from '@/components/CompoTabContent.vue';

export default {
  name: "HomeManagerBoard", //name은 'MENU_' + 파일명 조합
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

      tabs1: null,
      // tabsList1
      tabsList1: [
        { title: 'My 홈', content: 'HOME_MANAGER_TAB_DASHBOARD', badge: false},
        { title: '근태', content: 'HOME_MANAGER_TAB01', badge: false},
        { title: '가감점', content: 'HOME_MANAGER_TAB02', badge: false},
        { title: '보정시간', content: 'HOME_MANAGER_TAB03', badge: false},
        { title: '코칭', content: 'HOME_MANAGER_TAB04', badge: false},
        { title: '업무평가', content: 'HOME_MANAGER_TAB05', badge: false},
        { title: '상담품질평가', content: 'HOME_MANAGER_TAB06', badge: false},
        { title: '실적표', content: 'HOME_MANAGER_TAB07', badge: false},
      ],

    }
  },
  methods: {
    changeTab(index) {
      console.log( "changeTab > " +  index );
      this.$store.dispatch('commonStore/AC_COMMON_MANAGER_HOME_TAB', index);
    }
  },
  mounted() {
  },
  created() {
  },
  computed: {
    manager_home_tab_index: {
      get(){
        return this.$store.getters['commonStore/GE_COMMON_MANAGER_HOME_TAB'];
      },
      set(data){
        console.log("manager_home_tab_index : " + data);
        this.$store.dispatch('commonStore/AC_COMMON_MANAGER_HOME_TAB', data);
      },
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>