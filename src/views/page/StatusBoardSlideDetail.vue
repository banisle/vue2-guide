<template>
  <div style="display: contents">
    <div
      style="flex: 0 0 calc(100% - 146px)"
      class="pl-quick-layer-body pa-0">
      <div class="d-flex flex-column ">
        <!-- 상담사 -->
        <div class="pl-quick-layer-header">
          <img :src="PropData['ICON_URL'] !== '/'? '/upload/' + PropData['ICON_URL'] : require('@/assets/img/@manager_profile_default.png')" :alt="PropData['CUSL_NM']"  style="max-width: 35px; max-height: 35px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
          <div class="ml-3">
            <div>
              <strong style="font-size: 14px">{{ PropData['CUSL_NM'] }}</strong>
              <span class="ml-2 is-txt-sub">{{ PropData['FULL_DEPT_NM'] }}</span>
              <compo-tooltip-btn
                TitleProp="상담내용 보기"
                ClassProp="pl-tooltip-btn ml-1"
                IconProp="pl-icon20 board-docu"
                TooltipPositionProp="bottom"
                @btnClick="clickCsDetailBtn"
                v-if="!mixin_isEmpty(PropData.PHN_CUTT_ID) && (PropType === 'black' || PropType === 'history' || PropType === 'history2')"
              ></compo-tooltip-btn>
            </div>
            <div >
              <strong>요청일시 </strong><span class="ml-1">{{ mixin_convertDate(PropData['REG_DT'], 'yyyy-MM-dd HH:mm:ss') }}</span>
              <template v-if="PropType === 'request'">
                <span class="ml-2">제보유형 <strong>({{ PropData['GVIFMT_TYPE_NM'] }})</strong></span>
              </template>
            </div>
          </div>
          <div class="ml-auto mt-2">
            <template v-if="PropType === 'request' || PropType === 'excptnRequest'">
              <span
                style="min-width: 40px;"
                :class="`pl-badge ${ mixin_displayStatus(PropData['STTS_NM'], 'PropStat') }`">
                {{ PropData['STTS_NM'] }}</span>
            </template>
            <template v-else>
              <span
                style="min-width: 40px;"
                :class="`pl-badge ${ mixin_displayStatus(PropData['CAUTION_CUST_STTS_NM'], 'PropStat') }`">
                {{ PropData['CAUTION_CUST_STTS_NM'] }}</span>
            </template>
          </div>
        </div>
        <!-- 고객정보 -->
        <div class="px-5 py-3">
          <div class="">
            <div>
              <v-icon class="pl-icon20 today-date"></v-icon>
              <strong class="ml-1 d-inline-flex" style="width: 70px">접수일시</strong>
              <span class="ml-2">{{ mixin_convertDate(PropData['REG_DT'], 'yyyy-MM-dd HH:mm:ss') }}</span>
            </div>
            <div class="mt-1 pl-vertical-list type-2 is-border-sub-top mt-2 pt-2">
              <div
                class="pl-vertical-list--unit px-0"
                v-for="item in PropData.CUST_INFO"
                :key="item.id">
                <v-icon :class="`pl-icon20 ${ item.icon }`"></v-icon>
                <strong class="ml-1" style="flex: 0 0 70px">{{ item.title }}</strong>
                <span class="ml-2">{{ (item.val) ? item.telYn ? mixin_setPhoneNo(item.val.replace(/[^0-9]/g, '')) : item.val : '' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 상담 상세내역 -->
        <div class="px-5 py-3 is-border-top">
          <template v-if="PropType === 'excptnRequest'"><!--고객 특이사항 신청 현황-->
            <div class="d-flex align-center">
              <h3 class="pl-subtit">고객 특이사항</h3>
            </div>
          </template>
          <template v-else>
            <div class="d-flex align-center">
              <h3 class="pl-subtit">상담 상세내역</h3>
              <!-- <v-btn
                class="pl-btn is-esp is-sm ml-auto"
                @click="editCsLog()"
                >수정</v-btn> -->
            </div>
            <!-- audio -->
            <div class="d-flex align-center is-mt-s">
              <CompoAudioWave
                :AudioProp=CUTT_INFO
                :WidthProp=220
              />
            </div>
          </template>
          <!-- 칭찬 시간 -->
          <template v-if="PropType === 'request'">
            <div class="is-mt-m d-flex align-center">
              <v-icon class="pl-icon20 timer"></v-icon>
              <strong class="ml-1">칭찬 시간</strong>
              <span class="ml-6">{{ PropData.GVIFMT_CN }}</span>
            </div>
          </template>
          <!-- text -->
          <template v-if="PropType === 'excptnRequest'"><!--고객 특이사항 신청 현황-->
            <!-- 특이내용 -->
            <div class="is-mt-m ">
              <div class="d-flex align-center">
                <v-icon class="pl-icon20 person-part"></v-icon>
                <strong class="ml-1">고객 특이사항</strong>
              </div>
              <div class="is-mt-s" >
                <v-textarea
                  v-model="PropData.EXCPTN_CN"
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  :readonly="true"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <!-- 상담내용 -->
            <div class="is-mt-m ">
              <div class="d-flex align-center">
                <v-icon class="pl-icon20 person-part"></v-icon>
                <strong class="ml-1">상담 내용</strong>
              </div>
              <div class="is-mt-s" >
                <v-textarea
                  v-model="CUTT_CN"
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  :readonly="true"
                />
              </div>
            </div>
          </template>
          <!-- case: 제보요청 -->
          <template v-if="PropType === 'request' || PropType === 'excptnRequest'">
            <!-- 승인/반려 사유 -->
            <div class="is-mt-m ">
              <div class="d-flex align-center">
                <v-icon class="pl-icon20 person-edit"></v-icon>
                <strong class="ml-1">승인/반려 사유</strong>
              </div>
              <v-textarea
                v-model="PropData.RSN"
                class="pl-form is-noresize is-mt-s"
                :spellcheck="false"
                :readonly="PropData.PRCR_ID?true:false"
              />
            </div>
            <!-- 처리자 -->
            <div class="is-mt-m " v-if="PropData.PRCR_ID">
              <div class="d-flex align-center">
                <v-icon class="pl-icon20 person-chk"></v-icon>
                <strong class="ml-1 d-inline-flex" style="width: 70px">처리자</strong>
                <span >{{ PropData.PRCR_NM }}({{ mixin_convertDate(PropData.PRCS_DT, 'yyyy-MM-dd HH:mm:ss') }})</span>
              </div>
            </div>
          </template>
          <!-- 관심문구 -->
          <template v-if="PropType === 'black' || PropType === 'history' || PropType === 'history2'">
            <div class="is-mt-m">
              <div class="d-flex align-center">
                <v-icon class="pl-icon20 macro"></v-icon>
                <strong class="ml-1">관심 문구</strong>
                <!--팀장(부팀장)인 경우만 관심 문구 저장 가능-->
                <v-btn
                  v-if="computedUserDetailType === 'CENTER_LEADER' || computedUserDetailType === 'TEAM_LEADER'"
                  class="pl-btn is-esp is-sm ml-auto"
                  @click="custCautionCnConfirm"
                  >저장</v-btn>
              </div>

              <div class="is-mt-s" >
                <v-textarea
                  v-model="CAUTION_CN"
                  class="pl-form is-noresize"
                  :value="PropData"
                  :spellcheck="false"
                  :disabled="computedUserDetailType === 'CENTER_LEADER' || computedUserDetailType === 'TEAM_LEADER'?false:true"
                />
              </div>
            </div>
          </template>

          <!-- tab : 처리정보, 배려고객 이력-->
          <template v-if="PropType === 'history' || PropType === 'black' || PropType === 'history2'">
            <div class="is-border-bottom is-mt-m">
              <v-tabs v-model="tabs2" slider-size="2" class="pl-tabs is-noborder">
                <CompoTabItems :TabsList=tabsList2 >
                </CompoTabItems>
              </v-tabs>
            </div>
            <v-tabs-items v-model="tabs2">
              <div class="fill-height" >
                <template
                  v-for="(item, index) in tabsList2">
                  <v-tab-item :key="index">
                    <div
                      :class="`fill-height tab-contents`">
                      <component :is="item.content" :PropData="CUST_CUTT_INFO" :PHN_CUTT_ID="PHN_CUTT_ID" @setCautionCn="setCautionCn" @closeModal="closeModal"></component>
                    </div>
                  </v-tab-item>
                </template>
              </div>
            </v-tabs-items>
          </template>
        </div>
      </div>
    </div>
    <!-- footer -->
    <div class="pl-quick-layer-footer">
      <div class="pl-btn-wrap ml-auto">

        <!-- case: 배려고객 현황, 배려고객 관리 -->
        <template v-if="PropType === 'black' || PropType === 'history'">
          <v-btn class="pl-btn is-trans" @click="closeModal">닫기</v-btn>
          <!--팀장(부팀장)인 경우 임시차단 상태인 것만 -->
          <template v-if="computedUserDetailType === 'CENTER_LEADER' || computedUserDetailType === 'TEAM_LEADER'">
            <v-btn class="pl-btn" v-if="PropData.STTS_CD === 'REQ01'" @click="$eventBus.$emit('custCautionReqConfrim')">저장</v-btn>
          </template>
          <!--시스템관리자, 인재개발관리자, 센터운영개발관리자인 경우 요청에 대한 처리를 진행-->
          <template v-else-if="computedUserDetailType === 'SUPER_ADMIN' || computedUserDetailType === 'SYS_ADMIN' || computedUserDetailType === 'SYS_HUMAN' || computedUserDetailType === 'SYS_MANAGER'">
            <template v-if="PropData.STTS_CD === 'REQ01'"><!--임시차단인 경우-->
              <v-btn class="pl-btn" @click="$eventBus.$emit('custCautionWithdrawalConfrim')">철회</v-btn>
            </template>
            <template v-else>
              <v-btn class="pl-btn" @click="$eventBus.$emit('custCautionConfrim')">저장</v-btn>
            </template>
          </template>
        </template>
        <template v-else>
          <v-btn class="pl-btn is-trans" @click="closeModal">닫기</v-btn>
          <template v-if="computedUserDetailType !== 'MANAGER'"><!--상담사가 아닌 경우-->
            <v-btn class="pl-btn is-trans is-icon" v-if="PropData.STTS_CD === 'RCAP0'" @click="cuttGvifmtConfrim('RCAP2')"><!--요청인 경우만-->
              <v-icon class="pl-icon20 return"></v-icon>
              반려</v-btn>
            <v-btn class="pl-btn" v-if="PropData.STTS_CD === 'RCAP0'" @click="cuttGvifmtConfrim('RCAP1')">승인</v-btn><!--요청인 경우만-->
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import CompoAudioWave from '@/components/CompoAudioWave'
import CompoTabItems from '@/components/CompoTabItems.vue';
import StatusBoardSlideDetail_TAB_01 from '@/views/page/StatusBoardSlideDetail_TAB_01.vue';
// import StatusBoardSlideDetail_TAB_01_BLACK from '@/views/page/StatusBoardSlideDetail_TAB_01_BLACK.vue';
import StatusBoardSlideDetail_TAB_02 from '@/views/page/StatusBoardSlideDetail_TAB_02.vue';
import { readonly } from 'vue';


export default {
  name: "StatusBoardSlideDetail", //name은 'MENU_' + 파일명 조합
  components: {
    CompoAudioWave,
    CompoTabItems,
    StatusBoardSlideDetail_TAB_01,
    StatusBoardSlideDetail_TAB_02,
    // StatusBoardSlideDetail_TAB_01_BLACK,
  },
  props:{
    PropData: {
      type: Object,
    },
    CUTT_GVIFMT_HSTRY_ID: {
      type: String,
    },
    CUST_EXCPTN_CN_ID: {
      type: String,
    },
    PHN_CUTT_ID: {
      type: String,
    },
    PropStat: {
      type: Array,
    },
    PropType: {
      type: String,
      default: 'black' //black: 배려고객 요청, history: 배려고객 관리, request: 제보 요청
    }
  },
  data() {
    return {
      // tab
      tabs2: null,
      tabsList2: [
        { title: '처리 정보', content: 'StatusBoardSlideDetail_TAB_01', badge: false},
        { title: '배려고객 이력', content: 'StatusBoardSlideDetail_TAB_02', badge: true},
      ],
      // tabsList_black: [
      //   { title: '처리 정보', content: 'StatusBoardSlideDetail_TAB_01_BLACK', badge: false},
      //   { title: '배려고객 이력', content: 'StatusBoardSlideDetail_TAB_02', badge: true},
      // ],

      CUTT_INFO : {}, //상담정보
      CUTT_CN : '', //상담메모
      CAUTION_CN : '', //관심문구
      CUST_CUTT_INFO : {}, //고객 상담 정보
    }
  },
  computed: {
    // computedTablist(){
    //   return this.PropType === 'history' ? this.tabsList2 :this.tabsList_black
    // }
  },
  watch: {
    PHN_CUTT_ID() {
      if(this.PHN_CUTT_ID) this.cuttSelect();
    },
    PropData(){
      this.CUST_CUTT_INFO = this.PropData;
    }
  },
  mounted() {
    
  },
  async created() {
    this.CUST_CUTT_INFO = this.PropData;

    if(this.PHN_CUTT_ID) this.cuttSelect(); //상담 정보 조회
  },
  methods: {
    closeModal(){
      this.$emit('Close')
    },
    //상담 정보 조회
    async cuttSelect(){
      if(this.PHN_CUTT_ID === '-1'){
        this.CUTT_CN = '상담사가 상담메모를 기재하고 있습니다.\n조금 후 다시 확인 부탁 드립니다.';
      }else{
        let postParam = {
          SCH_CUSTCO_ID : this.PropData.CUSTCO_ID
          , PHN_CUTT_ID : this.PHN_CUTT_ID
        };
  
        let headParam = {head: {}};
        const response = await this.common_postCall("/phone-api/cutt/selectCuttHistDetail", postParam, headParam);
  
        if(response && !response.HEADER.ERROR_FLAG) {
          if(response.DATA.length > 0){
            this.CUTT_INFO = response.DATA[0];
            this.CUTT_CN = response.DATA[0].CUTT_CN; //상담메모
          }
        }
      }
    },

    //제보 승인/반려 처리 Confrim
    async cuttGvifmtConfrim(sSttsCd){
      if(!this.PropData.RSN.trim()){
        this.showAlertInfo({msg : '승인/반려 사유를 입력해 주세요.'});
        return;
      }

      let sMsg = '반려 처리 하시겠습니까?';
      if(sSttsCd === 'RCAP1') sMsg = '승인 처리 하시겠습니까?';

      this.showConfirmInfo({msg: sMsg
        , callYes : ()=>{
          if(this.PropType === 'excptnRequest'){
            this.custExcptnCnProc(sSttsCd); //고객 특이사항 승인/반려 처리
          }else{
            this.cuttGvifmtProc(sSttsCd); //제보 승인/반려 처리
          }
        }
        , callNo : this.closeAlert
      });
    },

    //제보 승인/반려 처리
    async cuttGvifmtProc(sSttsCd){
      let postParam = {
        CUTT_GVIFMT_HSTRY_ID : this.CUTT_GVIFMT_HSTRY_ID
        , STTS_CD : sSttsCd
        , RSN : this.PropData.RSN
        , GVIFMT_CN : this.PropData.GVIFMT_CN
        , SRCH_USER_ID : this.PropData.CUSL_ID //가점 처리를 위한 상담사 ID
      };
      let headParam = {head: {}};
      const response = await this.common_postCall("/phone-api/cutt/cuttGvifmtProc", postParam, headParam);

      if(response && !response.HEADER.ERROR_FLAG) {
        this.showAlertInfo({msg : '처리 되었습니다.'});
        this.PropData.STTS_CD = sSttsCd;
        this.$emit('setChgData', this.PropData);
        this.mixin_reloadCuttStat('USER_APLY_PROC_STAT');
        return;
      }
    },

    //고객 특이사항 승인/반려 처리
    async custExcptnCnProc(sSttsCd){
      let postParam = {
        CUST_EXCPTN_CN_ID : this.CUST_EXCPTN_CN_ID
        , STTS_CD : sSttsCd
        , RSN : this.PropData.RSN
      };
      let headParam = {head: {}};
      const response = await this.common_postCall("/api/cust/custExcptnCnProc", postParam, headParam);

      if(response && !response.HEADER.ERROR_FLAG) {
        this.showAlertInfo({msg : '처리 되었습니다.'});
        this.PropData.STTS_CD = sSttsCd;
        this.$emit('setChgData', this.PropData);
        this.mixin_reloadCuttStat('USER_APLY_PROC_STAT');
        return;
      }
    },

    //관심 문구 저장 Confirm
    custCautionCnConfirm(){
      if(this.mixin_isEmpty(this.CAUTION_CN.trim())){
        this.showAlertInfo({msg : '관심 문구 내용을 입력해 주세요.'});
        return;
      }else{
        this.showConfirmInfo({
          msg : '관심 문구를 저장 하시겠습니까?'
          ,callYes : ()=> {
            this.custCautionCnSave();
          }
          ,callNo : this.closeAlert
        });
      }
    },

    //관심 문구 저장
    async custCautionCnSave(){
      let postParam = {
        CUST_ID : this.PropData.CUST_ID
        , PHN_CUTT_ID : this.PHN_CUTT_ID
        , CAUTION_CN : this.CAUTION_CN
      }
      let headParam = {head: {
        ns:'lhcs.cust.dao.CustMapper'
      }};

      const response = await this.common_postCall("/api/biz/common/update/custCautionProc", postParam, headParam);

      if(response && !response.HEADER.ERROR_FLAG) {
        this.showAlertInfo({msg : '정상 처리 되었습니다.'});
        this.closeAlert();
        return;
      }
    },

    setCautionCn(data){
      this.CAUTION_CN = data;
    },

    clickCsDetailBtn(){
      if(this.mixin_isEmpty(this.PropData.PHN_CUTT_ID)) return false;
      this.mixin_openWindow( 'LayoutPopup', '1600', '850', {compo_name : 'CSL_M0100_DETAIL', callback : 'getPopData', title: '상담이력 상세보기', popData: this.CUTT_INFO, CUSTCO_ID: this.CUTT_INFO.CUSTCO_ID});
    },
  },
};
</script>

<style lang="scss" scoped>

</style>