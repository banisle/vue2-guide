<template>
  <div class="py-5">
    <v-tabs
      v-model="tabs1"
      hide-slider
      class="pl-tabs type-fill tab-grow px-5">
      <v-tab>이첩 요청</v-tab>
      <v-tab>이첩 접수</v-tab>
      <v-tab>이첩 반려</v-tab>
      <v-tab>이첩 회수</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs1">
      <!-- 이첩 요청 -->
      <v-tab-item >
        <StatusBoardTrans_TAB_01 :callEvt="callEvt[0]"/>
      </v-tab-item>
      <!-- 이첩 접수 -->
      <v-tab-item >
        <StatusBoardTrans_TAB_02 :callEvt="callEvt[1]"/>
      </v-tab-item>
      <!-- 이첩 반려 -->
      <v-tab-item >
        <StatusBoardTrans_TAB_03 :callEvt="callEvt[2]"/>
      </v-tab-item>
      <!-- 이첩 회수 -->
      <v-tab-item >
        <StatusBoardTrans_TAB_04 :callEvt="callEvt[3]"/>
      </v-tab-item>

    </v-tabs-items>
  </div>
</template>

<script>
import StatusBoardTrans_TAB_01 from '@/views/page/StatusBoardTrans_TAB_01'
import StatusBoardTrans_TAB_02 from '@/views/page/StatusBoardTrans_TAB_02'
import StatusBoardTrans_TAB_03 from '@/views/page/StatusBoardTrans_TAB_03'
import StatusBoardTrans_TAB_04 from '@/views/page/StatusBoardTrans_TAB_04'

export default {
  name: "StatusBoardTrans", //name은 'MENU_' + 파일명 조합
  components: {
    StatusBoardTrans_TAB_01,
    StatusBoardTrans_TAB_02,
    StatusBoardTrans_TAB_03,
    StatusBoardTrans_TAB_04,
  },
  props:{
    TabProp: {
      type: Number,
      default: 1,
    }
  },
  data() {
    return {
      tabs1: 0,
      callEvt: new Array(4)

    }
  },
  computed: {
  },
  watch: {
    TabProp() {
      this.tabs1 = this.TabProp - 1;
    },
    tabs1() {
      this.callEvt.forEach((data, idx) => {
        data = false;
      });
      this.callEvt[this.tabs1] = true;
    }
  },
  mounted() {
  },
  created() {
    this.tabs1 = this.TabProp - 1;
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>

</style>