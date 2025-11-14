<template>
  <div>
    <div class="is-border-bottom">
        <v-tabs v-model="tabs2" slider-size="2" class="pl-tabs px-5 is-noborder">
          <CompoTabItems :TabsList=tabsList2>
          </CompoTabItems>
          <div class="d-flex align-center ml-auto">
            <compo-date-picker
              StyleProp="width: 110px"
              ClassProp="is-trans font-weight-bold"
              DateType="dateInput"
              :DateProp.sync="DAY_TASK.RPT_DAY"
              @dateChange="changeReportDt"
              :DisabledProp="isPreview"/>
            <span class="pl-badge is-blue ml-2" style="width: 40px;" v-if="DAY_TASK.LAST_RPT_YN == 'Y'">보고됨</span>
            <span class="pl-badge is-red ml-2" style="width: 40px;" v-else>미보고</span>
          </div>
        </v-tabs>
      </div>
      <!-- tab -->
      <v-tabs-items v-model="tabs2">
        <div class="" >
          <template v-for="(item, index) in tabsList2">
            <v-tab-item :key="index">
              <div :class="`tab-contents`" style="height: 740px;">
                <component :is="item.content" :ref="item.content" :DAY_TASK="DAY_TASK" :isPreview="isPreview" :DAY_TASK_ETC="DAY_TASK_ETC" :EMP_CNT_LIST="EMP_CNT_LIST" :EMP_WORK_LIST="EMP_WORK_LIST" :CVLCPT_LIST="CVLCPT_LIST"></component>
              </div>
            </v-tab-item>
          </template>
        </div>
      </v-tabs-items>
      <template slot="footer">
        <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('Report')">닫기</v-btn>
        <v-btn class="pl-btn is-esp" @click="mixin_hideDialog('Report')">최종보고</v-btn>
        <v-btn class="pl-btn" @click="mixin_hideDialog('Report')">저장</v-btn>
      </template>
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CSM_M0200_DIALOG_TAB_01 from '@/views/page/CSM_M0200_DIALOG_TAB_01'
import CSM_M0200_DIALOG_TAB_02 from '@/views/page/CSM_M0200_DIALOG_TAB_02'
import CSM_M0200_DIALOG_TAB_03 from '@/views/page/CSM_M0200_DIALOG_TAB_03'

export default {
  name: 'CSM_M0200_DIALOG', //일일 업무 관리
  components: {
    CompoTabItems,
    CSM_M0200_DIALOG_TAB_01,
    CSM_M0200_DIALOG_TAB_02,
    CSM_M0200_DIALOG_TAB_03,
  },
  props:{
    propsData:{ 
      type: Object,
      default: {}
    },
    isPreview:{
      type:Boolean,
      default: false,
    },
  },
  data() {
    return {
      // tab
      tabs2: null,
      tabsList2: [
        { title: '근무 현황', content: 'CSM_M0200_DIALOG_TAB_01', badge: false },
        { title: '상담 이슈 사항', content: 'CSM_M0200_DIALOG_TAB_02', badge: false },
        { title: '시스템 장애/교육 사항 ', content: 'CSM_M0200_DIALOG_TAB_03', badge: false },
      ],

      // 일일업무 상세정보
      DAY_TASK:{
        TASK_CUSTCO_ID: ""          // 고객사ID
        , RPT_DAY: ""               // 보고일자
        , WKATTD_EXCPTNMTTR: ""     // 근태 특이사항(근무인원 이슈 및 참고사항)
        , ETC_CUTT_RMRK: ""         // 기타 상담 비고
        , CUTT_EXCPTNMTTR1: ""      // 상담 특이사항1(이슈사항)
        , CUTT_EXCPTNMTTR2: ""      // 상담 특이사항2(자체 대응 사항)
        , CUTT_EXCPTNMTTR3: ""      // 상담 특이사항3(익일 또는 차주 상담 이슈 예측 사항)
        , SYS_DSBLTY_RSN: ""        // 시스템 장애 사유
        , EDU_CN: ""                // 교육 내용
        , LAST_RPT_YN: "N"          // 최종 보고 여부
        , LAST_RPT_DT: ""           // 최종 보고 일시
      },

      // 기타 상담 현황
      DAY_TASK_ETC:[],

      // 인원 현황
      EMP_CNT_LIST:[],

      // 휴/복직 및 단축 근무 현황
      EMP_WORK_LIST:[],

      // 민원 현황
      CVLCPT_LIST:[],
    }
  },
  methods: {
    // 일일업무 보고서 상세 조회
    async selectDayTaskReport(){

      let sUrl = '/phone-api/task/selectDayTaskReport';
      // let sUrl = '/api/biz/common/select/selectDayTaskReport';

      let postParam = {
        RPT_DAY: this.DAY_TASK.RPT_DAY.replaceAll("-", "")
        , SRCH_CUSTCO_ID: this.DAY_TASK.TASK_CUSTCO_ID
      };

      let headParam = { head : {}};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        if(response.DAY_TASK.length > 0) this.DAY_TASK = response.DAY_TASK[0];
        else{
          this.DAY_TASK = {
            TASK_CUSTCO_ID: this.DAY_TASK.TASK_CUSTCO_ID
            , RPT_DAY: this.DAY_TASK.RPT_DAY
            , WKATTD_EXCPTNMTTR: ""
            , ETC_CUTT_RMRK: ""
            , CUTT_EXCPTNMTTR1: ""
            , CUTT_EXCPTNMTTR2: ""
            , CUTT_EXCPTNMTTR3: ""
            , SYS_DSBLTY_RSN: ""
            , EDU_CN: ""
            , LAST_RPT_YN: "N"
            , LAST_RPT_DT: ""
          }
        }
        this.DAY_TASK_ETC = response.DAY_TASK_ETC;
        this.EMP_CNT_LIST = response.EMP_CNT_LIST;
        this.EMP_WORK_LIST = response.EMP_WORK_LIST;
        this.CVLCPT_LIST = response.CVLCPT_LIST.map(row=>{
          let cvlcptClsf = row.CVLCPT_CLSF_FULL_PATH.split(">");
          for(let i in cvlcptClsf){
            row["CVLCPT_CLSF_NM" + i] = cvlcptClsf[i];
          }
          return row;          
        });
        console.log(this.CVLCPT_LIST);
        this.$emit("setBtn", this.DAY_TASK.LAST_RPT_YN);
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    // 최종보고 버튼 클릭
    clickFinalBtn(){
      this.showConfirmInfo({
        msg:'최종보고하시겠습니까?'
        , callYes: () => {
          this.closeAlert();
          this.saveDayTaskReport("Y");
        }
        , callNo: this.closeAlert
      });
    },

    // 저장 버튼 클릭
    clickSaveBtn(){
      this.showConfirmInfo({
        msg:'저장하시겠습니까?'
        , callYes: () => {
          this.closeAlert();
          this.saveDayTaskReport("N");
        }
        , callNo: this.closeAlert
      });
    },

    async saveDayTaskReport(finalYn){
      let sUrl = '/phone-api/task/saveDayTaskReport';
      // let sUrl = '/api/biz/common/insert/saveDayTaskReport';

      let postParam = {
       TASK_CUSTCO_ID: this.DAY_TASK.TASK_CUSTCO_ID
       , RPT_DAY: this.DAY_TASK.RPT_DAY.replaceAll("-", "")
       , WKATTD_EXCPTNMTTR: this.DAY_TASK.WKATTD_EXCPTNMTTR
       , ETC_CUTT_RMRK: this.DAY_TASK.ETC_CUTT_RMRK
       , CUTT_EXCPTNMTTR1: this.DAY_TASK.CUTT_EXCPTNMTTR1
       , CUTT_EXCPTNMTTR2: this.DAY_TASK.CUTT_EXCPTNMTTR2
       , CUTT_EXCPTNMTTR3: this.DAY_TASK.CUTT_EXCPTNMTTR3
       , SYS_DSBLTY_RSN: this.DAY_TASK.SYS_DSBLTY_RSN
       , EDU_CN: this.DAY_TASK.EDU_CN
       , LAST_RPT_YN: finalYn
       , DAY_TASK_ETC: this.DAY_TASK_ETC.filter(row=>{return !this.mixin_isEmpty(row.CUTT_CNT)})
      };

      let headParam = { head : {
        DATA_OBJECT: "DAY_TASK_ETC"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.DAY_TASK.LAST_RPT_YN = finalYn;
        this.showToastSuccess({msg: finalYn == "Y" ? "최종보고되었습니다." : "저장되었습니다." });
        this.$emit("setBtn", this.DAY_TASK.LAST_RPT_YN);
        this.$emit("refresh");
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    changeReportDt(){
      if(this.DAY_TASK.RPT_DAY.replaceAll("-", "").length >= 8){
        if(this.DAY_TASK.RPT_DAY.replaceAll("-", "").length != 8){
          this.showAlertInfo({msg:"기준일을 정확히 입력해주세요"});
          return false;
        }
        
        this.selectDayTaskReport();
      }
    },
  },
  mounted() {
    this.DAY_TASK.RPT_DAY = this.mixin_nvl(this.propsData.RPT_DAY, this.$moment().format("YYYY-MM-DD"));
    this.DAY_TASK.TASK_CUSTCO_ID = this.mixin_nvl(this.propsData.SRCH_CUSTCO_ID, this.computedUserCenter);

    // 일일업무 상세정보 조회
    this.selectDayTaskReport();
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