<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                센터
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="searchParams.CENTER_ID"
                  :items="DROP_CENTER_LIST"
                  class="pl-form type-middle"
                  placeholder="선택"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                평가 년월
              </span>
              <div class="pl-desc">
                <compo-date-picker
                  NoTitleProp
                  PickerType="month"
                  DateType="dateInput"
                  StyleProp="width: 90px"
                  :DateProp.sync="searchParams.STD_MT"/>
              </div>
            </div>

            <div>
              <v-btn
                class="pl-btn is-icon"
                @click="clickSearchBtn"
                >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <!-- tab -->
      <div class="is-border-bottom">
        <v-tabs v-model="tabKey" slider-size="2" class="pl-tabs px-4 is-noborder">
          <CompoTabItems :TabsList=tabsList >
          </CompoTabItems>
        </v-tabs>
      </div>
      <v-tabs-items v-model="tabKey">
        <div class="pl-card-body fill-height">
          <template v-for="(item, index) in tabsList" >
            <v-tab-item :key="index" eager>
              <div
                :class="`fill-height tab-contents`">
                <component :is="item.content" :ref="item.content" :propsSearchParams="searchParams" eager></component>
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
import QAM_M0800_TAB_01 from '@/views/page/QAM_M0800_TAB_01'
import QAM_M0800_TAB_02 from '@/views/page/QAM_M0800_TAB_02'

export default {
  name: 'MENU_QAM_M0800', // 평가 진행 관리
  components: {
    CompoTabItems,
    QAM_M0800_TAB_01,
    QAM_M0800_TAB_02
  },
  data() {
    return {
      // tab
      tabKey: null,
      tabsList: [
        { title: '평가 진행 현황', content: 'QAM_M0800_TAB_01', badge: false},
        { title: '평가 마감 결과', content: 'QAM_M0800_TAB_02', badge: false},
      ],

      // 센터정보
      DROP_CENTER_LIST:[],

      // 조회 조건
      searchParams: {
        CENTER_ID: ""
        , STD_MT: this.$moment().format("YYYY-MM")
      }
    }
  },
  methods: {
    // 조회 버튼 클릭
    clickSearchBtn(){
      if(this.mixin_isEmpty(this.searchParams.CENTER_ID)) return;

      if(this.mixin_isEmpty(this.searchParams.STD_MT)){
        this.showAlertInfo({msg:"평가년월을 입력해주세요."});
        return ;
      }

      if(this.$refs.QAM_M0800_TAB_01) this.$refs.QAM_M0800_TAB_01[0].setSearchParams(this.searchParams);
      if(this.$refs.QAM_M0800_TAB_02) this.$refs.QAM_M0800_TAB_02[0].setSearchParams(this.searchParams);
    },
  },
  async mounted() {

    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();

    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if(this.DROP_CENTER_LIST.length > 0){  
      this.searchParams.CENTER_ID = this.DROP_CENTER_LIST.find(row=> { return row.value == centerId}) ? centerId : this.DROP_CENTER_LIST[0].value;
    }

    this.clickSearchBtn();

  },
  created() {
  },
  computed: {
    reversedItems() {
      return this.items2.slice().reverse();
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>