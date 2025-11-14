<template>
  <div style="display: contents">
    <!-- 평가 일정 계획 -->
    <div>
      <h3 class="pl-subtit is-h3 is-mt-l">
        <strong class="pl-card-intop--title ">평가 일정 계획</strong>
        <v-btn
          @click="showExamSheet"
          class="pl-btn is-esp ml-auto">평가참여 현황</v-btn>
      </h3>
      <div class="is-mt-s d-flex flex-column pl-rounded-box px-5 py-3" >
        <div
          :class="`d-flex ${index !== 0 ? 'is-border-sub-top pt-2 is-mt-s' : ''}`"
          v-for="item,index in EVAL_INFO"
          >
          <span>{{ item.title }}</span>
          <template v-if="index === 0 && CS_QUALITY_LIST.length > 0">
            <!-- 단지별 특이사항 마크 -->
            <v-menu
              min-width="230"
              top
              left
              offset-y
              :close-on-content-click=false
              content-class="pl-menu-drop pa-2"
              v-model="dropQaPlan"
              >
              <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                <v-icon
                  v-bind="menuAttrs"
                  v-on="menuOn"
                  class="pl-icon20 hover-up ml-1"></v-icon>
              </template>
              <div class="px-3 py-2">
                <div class="d-flex">
                  <h3 style="font-size: 16px">상담품질 평가 일정</h3>
                  <v-btn
                    @click="dropQaPlan = false"
                    plain
                    min-width="22"
                    height="22"
                    class="pl-tooltip-btn ml-auto"
                    >
                    <v-icon
                      small
                      class="pl-icon20 dialog-close-black">
                    </v-icon>
                  </v-btn>

                </div>
                <!-- 링크정보 -->
                <div class="is-mt-m">
                  <!--  list -->
                  <div class="spacing-wrap sp-8 flex-column" >
                    <div v-for="item in CS_QUALITY_LIST">
                      <span class="pl-badge is-cyan">{{ item.TITLE }}</span>
                      <span class="ml-2">{{ item.STD_DATE }}</span>
                    </div>
                  </div>
                </div>

              </div>
            </v-menu>
          </template>
          <span :class="`ml-auto ${ item.class }`" v-html="item.desc"></span>
        </div>
      </div>
    </div>

    <!-- 평가 이의제기 현황 -->
    <div>
      <h3 class="pl-subtit is-h3 is-mt-l">
        <strong class="pl-card-intop--title ">평가 이의제기 현황 </strong>
      </h3>
      <div class="is-mt-s d-flex flex-column pl-rounded-box px-5 py-3" style="gap: 4px">
        <div
          class="d-flex align-center hover-bold"
          v-for="(item, index) in LEADER_OBJT_STAT"
          :key="index">
          <span @click="activateTab(item.TRGT_KEY)">{{ item.title }}</span>
          <strong :class="`ml-auto ${ Number(item.count) > 0 ? 'is-txt-red': '' }`">{{ item.count }}</strong>
        </div>
      </div>
    </div>

    <!-- side panel : 평가 진행현황-->
    <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer type-side"
        :style="tempCenterStyle"
        v-if=" dialogDetail === true ">
        <div class="pl-quick-layer-header">
          <h1>평가 진행현황</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="closeExamSheet"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body pa-0">
          <HomeSideExamStatus />
        </div>
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import HomeSideExamStatus from '@/views/page/Home/HomeSideExamStatus'
export default {
  name: 'HomeSideExam', //평가 일정계획, 평가 이의제기 현황
  components: {
    HomeSideExamStatus
  },
  data() {
    return {
      OBJT_INFO:[
        { TITLE: '상담품질 평가', CNT: 0, CLASS: '' , EVL_SE_CD: "ARGUDV01"}
        , { TITLE: '업무능력 평가', CNT: 0, CLASS: '', EVL_SE_CD: "ARGUDV02" }
      ],

      EVAL_INFO:[
        { index: 1, title: '상담품질 평가', desc: '일정이 없습니다.', },
        { index: 2, title: '업무능력 평가', desc: '일정이 없습니다.',  },
      ],

      // 상담품질평가 상세
      dropQaPlan: false,
      CS_QUALITY_LIST: [],

      dialogDetail: false,

      evalPlanCustList:[],
      selectTodayEvalPlanCustCnt:0,
    }
  },
  methods: {

    // 평가참여 현황
    async selectTodayEvalPlanList(){

      let sUrl = '/phone-api/qt/selectTodayEvalPlanList';
      let postParam = {
         CENTER_ID: this.computedUserCenter
        , DEPT_ID: this.computedUserDetailType != "CENTER_LEADER" ? this.computedUserDeptId : ""
      };
      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      this.evalPlanCustList = [];
      this.selectTodayEvalPlanCustCnt = 0;

      if (!this.mixin_isEmpty(response)) {
        this.evalPlanCustList = response.DATA;
        this.evalPlanCustList = [...new Map(response.DATA.map(item => [item.EVAL_ID, item])).values()];
        this.selectTodayEvalPlanCustCnt = this.evalPlanCustList.length;
        if(this.selectTodayEvalPlanCustCnt > 0){
          this.EVAL_INFO[1].desc = "("+ this.selectTodayEvalPlanCustCnt+')건의 시험이 있습니다.';
        }
      }else {
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    async selectHomeRlsQaPlanList(){
      // let sUrl = '/phone-api/qa/selectHomeRlsQaPlanList';
      let sUrl = '/api/biz/common/select/selectHomeRlsQaPlanList';

      let postParam = {
        CENTER_ID: this.computedUserCenter
      };

      let headParam = { head : {
         ns : 'lhcs.phone.qa.dao.xml.PhoneQaCommMapper'
        , sn : 'selectHomeRlsQaPlanList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.CS_QUALITY_LIST = response.DATA;

        if(this.CS_QUALITY_LIST.length > 0) this.EVAL_INFO[0].desc = this.CS_QUALITY_LIST[0].STD_ST_DD + " 부터<br>" + this.CS_QUALITY_LIST[0].STD_EN_DD + " 까지"
        else this.EVAL_INFO.desc = "일정이 없습니다.";
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    async selectHomeApplyObjtCnt(){
      // let sUrl = '/phone-api/qa/selectHomeApplyObjtCnt';
      let sUrl = '/api/biz/common/select/selectHomeApplyObjtCnt';

      let postParam = {
        CENTER_ID: this.computedUserCenter
        , DEPT_ID: this.computedUserDetailType != "CENTER_LEADER" ? this.computedUserDeptId : ""
      };

      let headParam = { head : {
         ns : 'lhcs.phone.qa.dao.xml.PhoneQaCommMapper'
        , sn : 'selectHomeApplyObjtCnt'
      }};

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.OBJT_INFO = response.DATA.map(row=>{
          row.CLASS = Number(row.CNT) > 0 ? "is-txt-red" : "";
          return row;
        });
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    activateTab(type) {
      if(type == "ARGUDV01"){ // 상담품질평가
        this.$store.dispatch('commonStore/AC_COMMON_LEADER_HOME_TAB', 10);
      }else{
        this.$store.dispatch('commonStore/AC_COMMON_LEADER_HOME_TAB', 9);
      }
    },

    // 평가참여 현황
    async showExamSheet(){
      this.mixin_reloadCuttStat('LEADER_OBJT_STAT');
      let sUrl = '/phone-api/qt/selectTodayEvalPlanCnt';
      let postParam = {
         CENTER_ID: this.computedUserCenter
        , DEPT_ID: this.computedUserDetailType != "CENTER_LEADER" ? this.computedUserDeptId : ""
      };

      let headParam = {};
      let evalPlanListCnt = [];

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        evalPlanListCnt = response.DATA;

        if(evalPlanListCnt[0].EVAL_CNT > 0){
          this.dialogDetail = true;
        }else{
          this.showAlert({
            alertDialogToggle: true,
            msg: '금일은 평가가 없습니다.',
            iconClass: 'is-caution',
            type: 'default'
          });
        }

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

    },

    closeExamSheet(){
      this.dialogDetail = false
    },

  },
  mounted() {
    // 상담품질평가 일정
    this.selectHomeRlsQaPlanList();
    // 이의제기 현황
    // this.selectHomeApplyObjtCnt();

    //평가 일정 건수
    this.selectTodayEvalPlanList();
  },
  created() {
    this.mixin_reloadCuttStat('LEADER_OBJT_STAT');
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>