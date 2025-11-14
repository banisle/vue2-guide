<template>
  <div>
    <div class="d-flex align-center">
      <strong class="pl-card-intop--title">상담품질 평가 진행 현황</strong>
      <div class="d-flex align-center ml-auto">
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          :MinWidthProp=22
          :HeightProp=22
          @btnClick="selectHomeQaPlanList"
        ></compo-tooltip-btn>
      </div>
    </div>
    <div class="pl-rounded-box pb-3 is-mt-s">
      <!-- tabs -->
      <div class="is-border-bottom ">
        <v-tabs
          v-model="tabs1"
          class="pl-tabs is-noborder is-mt-s">
          <CompoTabItems :TabsList=tabsList1 class="mt-0" />
        </v-tabs>
      </div>
      <!-- content -->
      <div style="height: 250px" >
        <v-tabs-items v-model="tabs1">
          <div class="fill-height">
            <template v-for="(item, index) in tabsList1" >
              <v-tab-item :key="index">
                <div
                  class="fill-height tab-contents">
                  <component :is="item.content" :list="getGridDataText(item.content)" :loading="loading"></component>
                </div>
              </v-tab-item>
            </template>
          </div>
        </v-tabs-items>
      </div>

    </div>

  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import HomeAdminQualityTest_TAB01 from '@/views/page/Home/HomeAdminQualityTest_TAB01.vue'
import HomeAdminQualityTest_TAB02 from '@/views/page/Home/HomeAdminQualityTest_TAB02.vue'
import HomeAdminQualityTest_TAB03 from '@/views/page/Home/HomeAdminQualityTest_TAB03.vue'
import HomeAdminQualityTest_TAB04 from '@/views/page/Home/HomeAdminQualityTest_TAB04.vue'
import HomeAdminQualityTest_TAB05 from '@/views/page/Home/HomeAdminQualityTest_TAB05.vue'


export default {
  name: 'HomeAdminQualityTest', //상담품질 평가 진행 현황
  components: {
    CompoTabItems,
    HomeAdminQualityTest_TAB01,
    HomeAdminQualityTest_TAB02,
    HomeAdminQualityTest_TAB03,
    HomeAdminQualityTest_TAB04,
    HomeAdminQualityTest_TAB05,
  },
  data() {
    return {

      tabs1: null,
      // tabsList1
      tabsList1: [
        { title: '마이홈센터', content: 'HomeAdminQualityTest_TAB01', badge: false},
        { title: '바로처리센터', content: 'HomeAdminQualityTest_TAB02', badge: false},
        { title: '전세임대센터', content: 'HomeAdminQualityTest_TAB03', badge: false},
        { title: '공가해소센터', content: 'HomeAdminQualityTest_TAB04', badge: false},
        { title: '주택지원센터', content: 'HomeAdminQualityTest_TAB05', badge: false},
      ],

      // 센터별 평가계획 목록
      gridDataText1: [],  // 마이홈센터
      gridDataText2: [],  // 공가해소센터
      gridDataText3: [],  // 전세임대센터
      gridDataText4: [],  // 바로처리센터
      gridDataText5: [],  // 주택지원센터

      loading: false,

    }
  },
  methods: {
    async selectHomeQaPlanList(){
      // let sUrl = '/phone-api/qa/selectHomeQaPlanList';
      let sUrl = '/api/biz/common/select/selectHomeQaPlanList';

      let postParam = {};

      let headParam = { head : {
         ns : 'lhcs.phone.qa.dao.xml.PhoneQaCommMapper'
        , sn : 'selectHomeQaPlanList'
      }};

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        let list = response.DATA;
        
        this.gridDataText1 = list.filter(row=>{return row.CENTER_ID == '1'}); // 마이홈센터
        this.gridDataText2 = list.filter(row=>{return row.CENTER_ID == '2'}); // 공가해소센터
        this.gridDataText3 = list.filter(row=>{return row.CENTER_ID == '3'}); // 전세임대센터
        this.gridDataText4 = list.filter(row=>{return row.CENTER_ID == '4'}); // 바로처리센터
        this.gridDataText5 = list.filter(row=>{return row.CENTER_ID == '5'}); // 주택지원센터

      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
      this.loading = false;
    },

    getGridDataText(name){
      if(name == "HomeAdminQualityTest_TAB01") return this.gridDataText1;
      else if(name == "HomeAdminQualityTest_TAB02") return this.gridDataText4;
      else if(name == "HomeAdminQualityTest_TAB03") return this.gridDataText3;
      else if(name == "HomeAdminQualityTest_TAB04") return this.gridDataText2;
      else if(name == "HomeAdminQualityTest_TAB05") return this.gridDataText5;
      else return [];
    },
  },
  mounted() {
    this.selectHomeQaPlanList();
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