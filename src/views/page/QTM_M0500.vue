<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top NoBorderProp></compo-sub-layout-top>
      <!-- sub content -->

      <div class="is-border-bottom">
        <v-tabs v-model="tabs2" slider-size="2" class="pl-tabs px-5 is-noborder">
          <CompoTabItems :TabsList=tabsList2>
          </CompoTabItems>
          <!--div class="pl-form-inline-wrap ml-auto">
            <div class="pl-form-inline">
              <span class="pl-label">
                소속
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  placeholder="전체"
                ></v-select>
                <v-text-field
                  class="pl-form type-middle"
                  placeholder="성명 입력"
                />
              </div>
              <v-btn class="pl-btn ">조회</v-btn>
            </div>
          </!div-->
        </v-tabs>
      </div>
      <!-- tab -->
      <v-tabs-items v-model="tabs2">
        <div class="fill-height">
          <template v-for="(item, index) in tabsList2">
            <v-tab-item :key="index">
              <div :class="`fill-height tab-contents`">
                <component :is="item.content"></component>
              </div>
            </v-tab-item>
          </template>
        </div>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import QTM_M0500_TAB_01 from '@/views/page/QTM_M0500_TAB_01'
import QTM_M0500_TAB_02 from '@/views/page/QTM_M0500_TAB_02'
import QTM_M0500_TAB_03 from '@/views/page/QTM_M0500_TAB_03'

export default {
  name: "MENU_QTM_M0500", // 평가 보고서
  components: {
    CompoTabItems,
    QTM_M0500_TAB_01,
    QTM_M0500_TAB_02,
    QTM_M0500_TAB_03,
  },
  data() {
    return {
      // tab
      tabs2: null,
      tabsList2: [
        { title: '월별 현황', content: 'QTM_M0500_TAB_01', badge: false },
        { title: '팀별 평균 추이', content: 'QTM_M0500_TAB_02', badge: false },
        { title: '근속 연수별', content: 'QTM_M0500_TAB_03', badge: false },
      ],


      DROP_CENTER_LIST: [],
      searchParams: {
        CENTER_ID: "",
        SRCH_DEPT: {},
        SRCH_USER_NM: '',
        QSTN_TYPE: "",
        USE_YN: "",
        SRCH_PAPER_TITLE: "",
        PROC_STAT: "",
        USER_ID: "",
        ST_DT: "",
        END_DT: "",
      },


    }
  },

  methods: {

  },
  async mounted() {

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if (this.DROP_CENTER_LIST.length > 0) {
      this.searchParams.CENTER_ID = this.DROP_CENTER_LIST.find((row) => { return row.value == centerId; }) ? centerId : this.DROP_CENTER_LIST[0].value;
    }
  },
  created() {
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped></style>