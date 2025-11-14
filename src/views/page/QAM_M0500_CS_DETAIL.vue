<template>
  <div style="display: contents">
    <div class="pl-quick-layer-header flex-column pb-0">
      <div class="d-flex" style="position: relative; width: 100%">
        <div style="flex: 0 0 40px">
          <img :src="qaBaseData.IMG" :alt="qaBaseData.TGT_EMP_NM" style="width: 100%; height: 40px; border-radius: 50%;"  @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
        </div>
        <div class="ml-4">
          <div >
            <strong style="font-size: 14px">{{ qaBaseData.TGT_EMP_NM }}</strong>
            <span class="ml-2 is-txt-sub">{{ qaBaseData.FULL_DEPT_NM }}</span>
            <compo-tooltip-btn
              TitleProp="상담내용 보기"
              ClassProp="pl-tooltip-btn flex-grow-0"
              IconProp="pl-icon20 board-docu"
              TooltipPositionProp="bottom"
              @btnClick="clickCsDetailBtn"
            ></compo-tooltip-btn>
          </div>
          <div class="spacing-wrap sp-16">
            <div>
              <strong>평가월</strong>
              <span class="ml-2">{{ qaBaseData.FULL_STD_MT }}</span>
            </div>
            <div>
              <strong class="ml-1">평가상태</strong>
              <span class="ml-2 pl-badge is-bg-blue">{{ qaBaseData.COMPLETE_YN_NM }}</span>
            </div>
            <div>
              <strong class="ml-1">결과공개</strong>
              <span class="ml-2 pl-badge is-bg-yellow">{{ qaBaseData.APPLY_YN_NM }}</span>
            </div>
          </div>
        </div>
        <compo-tooltip-btn
          TitleProp="닫기"
          ClassProp="pl-tooltip-btn ml-auto"
          IconProp="pl-icon20 dialog-close"
          StyleProp="position: absolute; right: 0; top: 0;"
          TooltipPositionProp="bottom"
          @btnClick="close()"
        ></compo-tooltip-btn>
      </div>
      <!-- tab -->
      <v-tabs v-model="tabKey" slider-size="2" class="pl-tabs is-noborder">
        <CompoTabItems :TabsList=tabsList ref="CompoTabItems">
        </CompoTabItems>
      </v-tabs>
    </div>
    <!-- tab content -->
    <v-tabs-items
      v-model="tabKey">
      <div class="fill-height">
        <template v-for="(item, index) in tabsList" >
          <v-tab-item :key="index">
            <div
              :class="`fill-height tab-contents`">
              <component
                :is="item.content"
                :ref="item.content"
                :qaBaseData="qaBaseData"
                :propsData="qaObjtBaseData"
                :qaExecHistList="qaExecHistList"
                @close="close" @refresh="refresh"></component>
            </div>
          </v-tab-item>
        </template>
      </div>
    </v-tabs-items>
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import QAM_M0500_CS_DETAIL_01 from '@/views/page/QAM_M0500_CS_DETAIL_01';
import QAM_M0500_CS_DETAIL_02 from '@/views/page/QAM_M0500_CS_DETAIL_02';
import QAM_M0500_CS_DETAIL_03 from '@/views/page/QAM_M0500_CS_DETAIL_03';
import CompoObjectionRequest from '@/components/CompoObjectionRequest';


export default {
  name: "QAM_M0500_CS_DETAIL", //평가 실행 관리 - 상담이력 상세
  props: {
    // 평가대상자 정보
    propsQaBaseData:{
      type: Object,
      default: ()=>{}
    },

    // 미리보기 여부
    isPreview : {
      type: Boolean,
      default: false
    },

    // 평가결과 여부
    isResult: {
      type: Boolean,
      default: false
    },
  },
  components: {
    CompoTabItems,
    QAM_M0500_CS_DETAIL_01,
    QAM_M0500_CS_DETAIL_02,
    QAM_M0500_CS_DETAIL_03,
    CompoObjectionRequest,
  },
  data() {
    return {

      tabKey: null,
      tabsList: [
        { title: '평가결과', content: 'QAM_M0500_CS_DETAIL_01', badge: false, isPreview: true, isResult: false},
        { title: '상담내용', content: 'QAM_M0500_CS_DETAIL_02', badge: false, isPreview: false, isResult: false},
        { title: '평가이력', content: 'QAM_M0500_CS_DETAIL_03', badge: false, isPreview: false, isResult: true},
        { title: '이의제기', content: 'CompoObjectionRequest', badge: false, isPreview: false, isResult: true},
      ],

      data: {
        PROFILE: {
          name: '김미정',
          img: require('@/assets/img/@manager_profile5.png'),
          part: '바로처리센터 - 마이홈1팀',
          test_date: '2024-06-20 09:30:25',
          test_stat: '평가완료',
          test_assign: '적용',
        },
      },

      STAT_LIST: [
        { code: 'Y', value: 'is-bg-blue'},
        { code: 'N', value: 'is-bg-yellow'},
      ],

      // 평가대상자 상세정보
      qaBaseData:{},

      // 이의제기 정보
      qaObjtBaseData:{
        EVL_SE_CD : "ARGUDV01"
        , CENTER_ID : ""
        , STD_ID : ""
        , CUSL_ID : ""
      },

      // 평가이력 목록
      qaExecHistList:[],

      // 상담이력 상세정보
      CS_INFO:{},

      MESSAGE: {
        CONFIRM: {
        },
        ALERT:{
        },
        TOAST : {
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {

    // 평가이력 조회
    async selectQaExecuteHistList(){
      // let sUrl = '/phone-api/qa/selectQaExecuteHistList';
      let sUrl = '/api/biz/common/select/selectQaExecuteHistList';

      let postParam = {
        CENTER_ID: this.qaBaseData.CENTER_ID
        , STD_MT: this.qaBaseData.STD_MT
        , STD_MT_ORD: this.qaBaseData.STD_MT_ORD
        , PAPER_ID: this.qaBaseData.PAPER_ID
        , STD_ID: this.qaBaseData.STD_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaExecuteManageMapper'
        , sn : 'selectQaExecuteHistList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaExecHistList = response.DATA;
        if(this.qaExecHistList.length > 0) {
          this.tabsList[2].badge = true;
        }
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    close(){
      this.$emit('Close');
    },

    refresh(){
      this.$emit('Refresh');
    },

    clickCsDetailBtn(){
      if(this.mixin_isEmpty(this.qaBaseData.PHN_CUTT_ID)){
        this.showAlertInfo({msg:"상담번호가 없습니다."});
        return;
      }

      // 상담이력 상세정보 조회 및 팝업 열기
      this.selectCuttHistDtl(this.qaBaseData.PHN_CUTT_ID);
    },

    // 평가대상자 상담이력 정보 조회
    async selectCuttHistDtl(data) {

      // let sUrl = '/phone-api/cvlcpt/selectCvlcptCuttHist';
      let sUrl = '/api/biz/common/select/selectCvlcptCuttHist';

      let postParam = {
        PHN_CUTT_ID: data
      };

      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper",
          sn: "selectCvlcptCuttHist"
        }
      };

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA.length > 0) {
          // 윈도우 팝업인 경우
          this.mixin_openWindow( 'LayoutPopup', '1600', '850', {compo_name : 'CSL_M0100_DETAIL', callback : 'getPopData', title: '상담이력 상세보기', popData: response.DATA[0], CUSTCO_ID: response.DATA[0].CUSTCO_ID});
        }
        else this.showAlertInfo({msg:"상담이력이 존재하지 않습니다."});
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },
  },
  async mounted() {
    this.qaBaseData = JSON.parse(JSON.stringify(this.propsQaBaseData));
    this.qaBaseData.isPreview = this.isPreview;
    this.qaBaseData.isResult = this.isResult;
    this.qaBaseData.FULL_STD_MT = this.$moment(this.qaBaseData.STD_MT).format("YYYY-MM") + "("+this.mixin_nvl(this.qaBaseData.STD_MT_ORD, "0")+"회차)"

    this.qaObjtBaseData.CENTER_ID = this.qaBaseData.CENTER_ID;
    this.qaObjtBaseData.CUSL_ID = this.qaBaseData.TGT_EMP_NO;
    this.qaObjtBaseData.STD_ID = this.qaBaseData.STD_ID;

    if(this.isPreview && !this.isResult){
      // 미리보기인 경우
      let centerList = await this.mixin_getCenterCombo();
      let centerInfo = centerList.filter(row=>{return row.value == this.qaBaseData.CENTER_ID});
      this.qaBaseData.TGT_EMP_NM = "대상자";
      this.qaBaseData.FULL_DEPT_NM = centerInfo.length > 0 ? centerInfo[0].text+"-팀명" : "센터-팀명";
      this.qaBaseData.COMPLETE_YN_NM = "평가중";
      this.qaBaseData.COMPLETE_YN = "N";
      this.qaBaseData.APPLY_YN_NM = "미공개";
      this.qaBaseData.APPLY_YN = "N";
      this.qaBaseData.IMG = require('@/assets/img/@manager_profile_default.png');

      this.tabsList = this.tabsList.filter(tab=>{return tab.isPreview == true;});
    }else if(this.mixin_isEmpty(this.qaBaseData.STD_ID)){
      this.tabsList = this.tabsList.filter(tab=>{return tab.isResult == false;});
    }

    if(!this.mixin_isEmpty(this.qaBaseData.STD_ID) && !this.mixin_isEmpty(this.qaBaseData.OBJT_ID)) this.tabsList[3].badge = true;

    if(!this.mixin_isEmpty(this.qaBaseData.STD_ID)) this.selectQaExecuteHistList();
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