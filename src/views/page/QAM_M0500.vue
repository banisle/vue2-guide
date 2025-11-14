<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <v-form ref="form">
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <span class="pl-label">
                  센터
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle"
                    :items="DROP_CENTER_LIST"
                    v-model="searchParams.CENTER_ID"
                    placeholder="선택"
                    @change="changeCenter"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  평가년월
                </span>
                <div class="pl-desc">
                  <compo-date-picker
                    NoTitleProp
                    PickerType="month"
                    DateType="dateInput"
                    StyleProp="width: 100px"
                    @dateChange="changeStdMt"
                    :DateProp.sync="searchParams.STD_MT"/>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  회차
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle"
                    :items="DROP_STD_ORD_LIST"
                    v-model="searchParams.STD_MT_ORD"
                    placeholder="전체"
                    style="width: 100px"
                    @change="changeStdMtOrd"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  평가자
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle"
                    :items="DROP_MGR_EMP_LIST"
                    v-model="searchParams.MGR_EMP_NO"
                    placeholder="전체"
                    style="width: 100px"
                  ></v-select>
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
          </v-form>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <!-- tab -->
      <div class="tab-fill-height">
        <div class="is-border-bottom">
          <v-tabs v-model="tabKey" slider-size="2" class="pl-tabs px-4 is-noborder">
            <CompoTabItems :TabsList=tabsList >
            </CompoTabItems>
          </v-tabs>
        </div>
        <v-tabs-items
          v-model="tabKey">
          <div class="fill-height">
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
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import QAM_M0500_TAB_01 from '@/views/page/QAM_M0500_TAB_01'
import QAM_M0500_TAB_02 from '@/views/page/QAM_M0500_TAB_02'

export default {
  name: 'MENU_QAM_M0500', //평가 실행 관리
  components: {
    CompoTabItems,
    QAM_M0500_TAB_01,
    QAM_M0500_TAB_02,
  },
  data() {
    return {
      // tab
      tabKey: null,
      tabsList: [
        { title: '상담콜 조회', content: 'QAM_M0500_TAB_01', badge: false},
        { title: '평가콜 조회', content: 'QAM_M0500_TAB_02', badge: false},
      ],

      // 센터 목록
      DROP_CENTER_LIST: [],

      // 회차 목록
      DROP_STD_ORD_LIST: [{text:"전체", value:""}],

      // 평가자 목록
      DROP_MGR_EMP_LIST: [{text:"전체", value:""}],

      //  조회 조건
      searchParams:{
        CENTER_ID: ""
        , STD_MT: this.$moment().format('YYYY-MM')
        , STD_MT_ORD: ""
        , MGR_EMP_NO: ""
      },
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

      if(this.$refs.QAM_M0500_TAB_01) this.$refs.QAM_M0500_TAB_01[0].setSearchParams(this.searchParams);
      if(this.$refs.QAM_M0500_TAB_02) this.$refs.QAM_M0500_TAB_02[0].setSearchParams(this.searchParams);
    },

    // 평가자 콤보 박스 조회
    async selectMgrEmpNoList(){
      // let sUrl = '/phone-api/qa/selectMgrEmpNoList';
      let sUrl = '/api/biz/common/select/selectMgrEmpNoList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID
        , STD_MT: this.searchParams.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.searchParams.STD_MT_ORD
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaCommMapper'
        , sn : 'selectMgrEmpNoList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_MGR_EMP_LIST = response.DATA.map(row=>{
          row.text = row.MGR_EMP_NM;
          row.value = row.MGR_EMP_NO;
          return row;
        });

        let userId = this.$store.getters["userStore/GE_USER_ROLE"].userId;
        this.searchParams.MGR_EMP_NO = this.DROP_MGR_EMP_LIST.filter(row=>{return row.value == userId}).length > 0 ? userId : "";

        this.DROP_MGR_EMP_LIST.unshift({text:"전체", value:""});

      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    async changeCenter(){
      await this.selectQaStdMtOrdList();
      await this.selectMgrEmpNoList();
      this.clickSearchBtn();
    },

    // 평가년월 변경 시 평가자 목록 재조회
    async changeStdMt(){
      let yyyy_mm = RegExp(/^\d{4}-(0[1-9]|1[012])$/);
      this.searchParams.STD_MT = this.searchParams.STD_MT.replace(/^(\d{4})(\d{2})$/, '$1-$2');
      this.DROP_MGR_EMP_LIST = [{text:"전체", value:""}];

      await this.selectQaStdMtOrdList();

      // YYYY-MM 포맷인지 확인
      if(yyyy_mm.test(this.searchParams.STD_MT)){
        this.selectMgrEmpNoList();
      }
    }, 

    changeStdMtOrd(){
      let yyyy_mm = RegExp(/^\d{4}-(0[1-9]|1[012])$/);
      this.searchParams.STD_MT = this.searchParams.STD_MT.replace(/^(\d{4})(\d{2})$/, '$1-$2');

      // YYYY-MM 포맷인지 확인
      if(yyyy_mm.test(this.searchParams.STD_MT)){
        this.selectMgrEmpNoList();
      }
    },

    // 회차 정보 조회
    async selectQaStdMtOrdList(){
      if(this.mixin_isEmpty(this.searchParams.STD_MT)) return;
      this.searchParams.STD_MT_ORD = "";
      this.DROP_STD_ORD_LIST = [];

      let sUrl = '/api/biz/common/select/selectQaStdMtOrdList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID
        , STD_MT: this.searchParams.STD_MT.replaceAll("-","")
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlReportManageMapper'
        , sn : 'selectQaStdMtOrdList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_STD_ORD_LIST = response.DATA.map(row=>{
          row.value = row.STD_MT_ORD;
          row.text = row.STD_MT_ORD_NM;
          return row;
        });
      }else{
        // this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
      this.DROP_STD_ORD_LIST.unshift({text:"전체", value:""});
    },
  },
  async mounted() {
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();

    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if(this.DROP_CENTER_LIST.length > 0){  
      this.searchParams.CENTER_ID = this.DROP_CENTER_LIST.find(row=> { return row.value == centerId}) ? centerId : this.DROP_CENTER_LIST[0].value;
    }

    // 회차 정보
    await this.selectQaStdMtOrdList();

    console.log(this.DROP_STD_ORD_LIST)

    // 평가자 정보 조회
    await this.selectMgrEmpNoList();

    this.clickSearchBtn();
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
.tab-fill-height{
  height: calc(100% - 150px);
  .v-tabs-items{
    height: 100%;
  }
}
</style>