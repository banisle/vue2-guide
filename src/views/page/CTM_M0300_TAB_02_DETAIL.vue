<template>
  <div style="display: contents;">
    <div class="pl-quick-layer-body px-0" style="flex: 0 0 calc(100% - 217px);">
      <div class="d-flex flex-column px-5">
        <!-- 상담사 -->
        <div class="d-flex" style="position: relative;">
          <div style="flex: 0 0 40px">
            <img :src="CVLCPT_DATA.REG_USER_IMG" :alt="CVLCPT_DATA.REG_USER_NM" style="width: 100%; max-height: 40px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
          </div>
          <div class="ml-4">
            <div >
              <strong style="font-size: 14px">{{ CVLCPT_DATA.REG_USER_NM }}</strong>
              <span class="ml-1 is-txt-sub">{{ CVLCPT_DATA.REG_UP_DEPT_NM }} - {{ CVLCPT_DATA.REG_DEPT_NM }}</span></div>
            <div class="">
              <strong>민원 접수일</strong> : {{ CVLCPT_DATA.REG_DT }} <span v-if="!mixin_isEmpty(CVLCPT_DATA.REG_PHN_CUTT_ID)"> - <strong >접수 상담번호</strong> : ({{ CVLCPT_DATA.REG_PHN_CUTT_ID }})</span>
              <compo-tooltip-btn
                TitleProp="상담내용 보기"
                ClassProp="pl-tooltip-btn ml-1"
                IconProp="pl-icon20 board-docu"
                :MinWidthProp="22"
                :HeightProp="22"
                TooltipPositionProp="bottom"
                @btnClick="clickCsDetailBtn('REG_PHN_CUTT_ID')"
                v-if="!mixin_isEmpty(CVLCPT_DATA.REG_PHN_CUTT_ID)"
              ></compo-tooltip-btn>
            </div>
          </div>
          <div style="position: absolute; right: 0; top: 0;">
            <span class="pl-badge green" v-if="isFinish">종결</span>
            <span class="pl-badge red" v-else>진행중</span>
          </div>
        </div>
        <!-- 민원 접수 정보 -->
        <div class="is-mt-l">
          <div class="pl-subtit">민원 접수 정보</div>
          <div class="pt-3 is-mt-s is-border-sub-top">
            <div class="pl-form-inline-wrap label-80" >
              <div class="pl-form-inline" style="flex: 0 0 calc(50% - 8px);">
                <span class="pl-label">
                  민원 구분
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle"
                    :items="DROP_VOC_DV"
                    v-model="CVLCPT_DATA.CVLCPT_SE_CD"
                    placeholder="선택"
                    :disabled="isFinish"
                    @change="changeCvlcptSeCd"
                  />
                </div>
              </div>
              <div class="pl-form-inline" style="flex: 0 0 calc(50% - 8px);">
                <span class="pl-label">
                  접수 경로
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle"
                    :items="DROP_RCPT_PATH"
                    v-model="CVLCPT_DATA.CVLCPT_RCPT_PATH_CD"
                    placeholder="선택"
                    :disabled="isFinish"
                  />
                </div>
              </div>
            </div>
            <div class="pl-form-inline-wrap label-80 mt-2" >
              <div class="pl-form-inline" style="flex: 0 0 calc(50% - 8px);">
                <span class="pl-label">
                  접수일
                </span>
                <div class="pl-desc">
                  <compo-date-picker
                    DateType="dateTime"
                    :DateProp.sync="CVLCPT_DATA.REG_DATE"
                    :TimesProp.sync='CVLCPT_DATA.REG_TIME'
                    StyleProp="flex: 1"
                    :DisabledProp="isFinish"
                    />
                </div>
              </div>
              <div class="pl-form-inline" style="flex: 0 0 calc(50% - 8px);">
                <span class="pl-label">
                  접수센터
                </span>
                <div class="pl-desc">
                  <v-select
                    v-model="CVLCPT_DATA.CENTER"
                    return-object
                    class="pl-form type-middle"
                    :items="DROP_CENTER_ID"
                    placeholder="선택"
                    @change="changeCenter"
                    :disabled="isFinish"
                  ></v-select>
                </div>
              </div>
              <!-- <div class="pl-form-inline" style="flex: 0 0 calc(50% - 8px);">
                <span class="pl-label">
                  접수 유형
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle"
                    :items="mixin_common_code_get(list_common_code, 'VOC_REGTP', '선택')"
                    v-model="CVLCPT_DATA.CVLCPT_RCPT_TYPE_CD"
                    placeholder="선택"
                    :disabled="CVLCPT_DATA.CVLCPT_SE_CD != 'OVOC' || isFinish"
                  />
                </div>
              </div> -->
            </div>
            <div class="pl-form-inline-wrap label-80 mt-2" >
              <div class="pl-form-inline" style="flex: 0 0 calc(50% - 8px);">
                <span class="pl-label">
                  소속
                </span>
                <div class="pl-desc">
                  <v-select
                    v-model="CVLCPT_DATA.RCPT_DEPT_ID"
                    class="pl-form type-middle"
                    :items="DROP_DEPT_ID"
                    placeholder="선택"
                    @change="changeDept"
                    :disabled="isFinish"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline" style="flex: 0 0 calc(50% - 8px);">
                <span class="pl-label">
                  상담사
                </span>
                <div class="pl-desc">
                  <template v-if="!isFinish">
                    <v-autocomplete
                      v-model="CVLCPT_DATA.CUSL_ID"
                      :items="userList"
                      class="pl-form type-middle"
                      placeholder="선택"
                      no-data-text="결과 없음"
                      :disabled="isFinish"
                      auto-select-first
                    ></v-autocomplete>
                  </template>
                  <template v-else>
                    <v-text-field
                      class="pl-form type-middle"
                      v-model="CVLCPT_DATA.CUSL_NM"
                      disabled
                    />
                  </template>
                </div>
              </div>
            </div>
            <div class="pl-form-inline-wrap label-80 mt-2" >
              <div class="pl-form-inline" style="flex: 0 0 calc(50% - 8px);">
                <span class="pl-label">
                  고객 연락처
                </span>
                <div class="d-flex align-center">
                  <v-text-field
                    v-model="CVLCPT_DATA.CUST_PHN_NO"
                    class="pl-form type-middle"
                    oninput="this.value=this.value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)"
                    maxlength="20"
                    :disabled="isFinish"
                    />
                  <compo-tooltip-btn
                    TitleProp="전화 걸기"
                    ClassProp="pl-tooltip-btn ml-1 flex-grow-0"
                    IconProp="pl-icon20 td-in-call"
                    TooltipPositionProp="bottom"
                    :MinWidthProp=22
                    :HeightProp=22
                    @btnClick="clickCallBtn"
                    :DisabledProp="isFinish"
                  ></compo-tooltip-btn>
                </div>
              </div>
              <div class="pl-form-inline" style="flex: 0 0 calc(50% - 8px);">
                <span class="pl-label">
                  고객명
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form type-middle"
                    v-model="CVLCPT_DATA.CUST_NM"
                    :disabled="isFinish"
                    />
                </div>
              </div>
            </div>
            <div class="pl-form-inline-wrap label-80 mt-2" >
              <div class="pl-form-inline" style="flex: 0 0 calc(50% - 8px);">
                <span class="pl-label">
                  상담번호
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="CVLCPT_DATA.PHN_CUTT_ID"
                    class="pl-form type-middle is-sm"
                    oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                    :disabled="isFinish"
                    />
                  <compo-tooltip-btn
                    TitleProp="상담내용 보기"
                    ClassProp="pl-tooltip-btn flex-grow-0"
                    IconProp="pl-icon20 board-docu"
                    TooltipPositionProp="bottom"
                    @btnClick="clickCsDetailBtn('PHN_CUTT_ID')"
                  ></compo-tooltip-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- tab -->
      <div class="is-mt-m">
        <div class="is-border-bottom">
          <v-tabs v-model="tabs2" slider-size="2" class="pl-tabs is-noborder">
            <CompoTabItems :TabsList=tabsList2>
            </CompoTabItems>
          </v-tabs>
        </div>
        <v-tabs-items v-model="tabs2">
          <div class="" >
            <template v-for="(item, index) in tabsList2" >
              <v-tab-item :key="index">
                <div
                  :class="`tab-contents`">
                  <component :is="item.content" :ref="item.content" :CVLCPT_DATA="CVLCPT_DATA" :CVLCPT_CUTT_LIST="CVLCPT_CUTT_LIST" :isFinish="isFinish" :FILE_GROUP_KEY="CVLCPT_DATA.FILE_GROUP_KEY"></component>
                </div>
              </v-tab-item>
            </template>
          </div>
        </v-tabs-items>
      </div>
    </div>
    <div class="pl-quick-layer-footer">
      <div class="pl-btn-wrap ml-auto">
        <v-btn class="pl-btn is-trans" @click="$emit('Close')">닫기</v-btn>
        <v-btn class="pl-btn is-trans is-icon" @click="clickDeleteBtn" v-if="!isFinish && !mixin_isEmpty(CVLCPT_DATA.CVLCPT_RCPT_MNG_ID)">
          <v-icon class="pl-icon20 trash"></v-icon>
          삭제
        </v-btn>
        <v-btn class="pl-btn" @click="clickSaveBtn" v-if="!isFinish || ADMIN_YN">저장</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CTM_M0300_TAB_02_DETAIL_TAB_01 from '@/views/page/CTM_M0300_TAB_02_DETAIL_TAB_01'
import CTM_M0300_TAB_02_DETAIL_TAB_02 from '@/views/page/CTM_M0300_TAB_02_DETAIL_TAB_02'
import CTM_M0300_TAB_02_DETAIL_TAB_03 from '@/views/page/CTM_M0300_TAB_02_DETAIL_TAB_03'

export default {
  name: 'CTM_M0300_TAB_02_DETAIL', //민원분류 관리 상세
  components: {
    CompoTabItems,
    CTM_M0300_TAB_02_DETAIL_TAB_01,
    CTM_M0300_TAB_02_DETAIL_TAB_02,
    CTM_M0300_TAB_02_DETAIL_TAB_03
  },
  props:{
    popData:{
      type: Object
      , default: ()=>{}
    }
  },
  data() {
    return {
      // tab
      tabs2: null,
      tabsList2: [
        { title: '민원 내용/처리결과 ', content: 'CTM_M0300_TAB_02_DETAIL_TAB_01', badge: false},
        { title: '진행 사항', content: 'CTM_M0300_TAB_02_DETAIL_TAB_02', badge: false},
        { title: '첨부파일', content: 'CTM_M0300_TAB_02_DETAIL_TAB_03', badge: false},
      ],

      // 공통코드
      list_common_code:[],
      DROP_RCPT_PATH: [{text:"선택", value:""}], // 접수경로
      DROP_VOC_DV:[],  // 민원구분

      // 조직정보
      common_ognz_list: [],
      DROP_CENTER_ID: [],
      DROP_DEPT_ID: [],
      userList:[],

      // 민원 상세정보
      CVLCPT_DATA:{
        REG_DT : ""                         // 등록일시
        , REG_DATE: this.$moment().format("YYYY-MM-DD")  // 등록일자
        , REG_TIME: this.$moment().format("HH:mm")       // 등록시간
        , REG_UP_DEPT_NM: ""                // 등록자 센터명
        , REG_DEPT_NM: ""                   // 등록자 부서명
        , REG_USER_NM: ""                   // 등록자명
        , REG_USER_IMG: require('@/assets/img/@manager_profile_default.png')
        , REG_PHN_CUTT_ID: ""               // 접수상담번호
        , CVLCPT_RCPT_MNG_ID : ""           // 민원_접수_관리_ID
        , CVLCPT_SE_CD : ""                 // 민원_구분_코드
        , CVLCPT_RCPT_PATH_CD : ""          // 민원_접수_경로_코드
        , CVLCPT_RCPT_TYPE_CD : ""          // 민원_접수_유형_코드
        , CUST_PHN_NO : ""                  // 고객_전화_번호
        , CUST_NM : ""                      // 고객_명
        , RCPT_CUSTCO_ID : ""               // 접수_고객사_ID
        , RCPT_DEPT_ID : ""                 // 접수_부서_ID
        , CUSL_ID : ""                      // 상담사_ID
        , CUSL_NM: ""                       // 상담사명
        , PHN_CUTT_ID : ""                  // 전화_상담_ID
        , CVLCPT_CLSF_ID : ""               // 민원_분류_ID 3레벨
        , CVLCPT_CLSF_ID1: ""
        , CVLCPT_CLSF_ID2: ""
        , CVLCPT_CLSF_ID3: ""
        , CVLCPT_CLSF_FULL_PATH_ID: ""      // 민원_분류
        , CVLCPT_CN : ""                    // 민원_내용
        , CPST_YN : false                   // 보상_여부
        , CPST_CN : ""                      // 보상_내용
        , CAUTION_CUST_YN : false           // 주의_고객_여부
        , CAUTION_CUST_DOC_NO : ""          // 주의_고객_문서_번호
        , PRGRS_STTS_CD : "P"               // 진행_상태_코드
        , PRCS_RSLT_CN : ""                 // 처리_결과_내용
        , IPRVMT_CN : ""                    // 개선_내용
        , LAST_PRCS_DT : ""                 // 최종_처리_일시
        , LAST_PRCS_DATE: ""                // 최종_처리_일자
        , LAST_PRCS_TIME: ""                // 최종_처리_시간
        , LAST_PRCR_ID : ""                 // 최종_처리자_ID
        , LAST_PRCR_NM : ""                 // 최종_처리자명_ID
        , CENTER:{}
        , FILE_GROUP_KEY: ""
      },

      // 민원 상담이력 목록
      CVLCPT_CUTT_LIST: [],

      // 종결여부
      isFinish: false,

      // 윈도우 팝업 여부
      isWindow: false,

      // 관리자 여부
      ADMIN_YN: false,
    }
  },
  methods: {

    // 민원 상담이력 조회
    async selectCvlcptData() {

      // let sUrl = '/phone-api/cvlcpt/selectCvlcptData';
      let sUrl = '/api/biz/common/select/selectCvlcptData';

      let postParam = {
        CVLCPT_RCPT_MNG_ID: this.CVLCPT_DATA.CVLCPT_RCPT_MNG_ID
      };

      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper",
          sn: "selectCvlcptData"
        }
      };

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        let data = response.DATA.map(row=>{
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');
          return row;
        });

        if(data.length > 0) this.setCvlcptData(data[0]);
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },


    // 민원 상담이력 조회
    async selectCvlcptCuttList() {

      // let sUrl = '/phone-api/cvlcpt/selectCvlcptCuttList';
      let sUrl = '/api/biz/common/select/selectCvlcptCuttList';

      let postParam = {
        CVLCPT_RCPT_MNG_ID: this.CVLCPT_DATA.CVLCPT_RCPT_MNG_ID
      };

      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper",
          sn: "selectCvlcptCuttList"
        }
      };

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.CVLCPT_CUTT_LIST = response.DATA.map(row=>{
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');
          row.FULL_DEPT_NM = row.UP_DEPT_NM + "-" + row.DEPT_NM;
          row.isExpand = this.mixin_isEmpty(row.CUTT_SUM)? true : false;
          row.editable = this.mixin_isEmpty(row.CUTT_SUM)? true : false;
          return row;
        });
        if(this.CVLCPT_CUTT_LIST.length > 0) this.tabsList2[1].badge = true;
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    clickCsDetailBtn(col){
      if(this.mixin_isEmpty(this.CVLCPT_DATA[col])){
        this.showAlertInfo({msg:"상담번호가 없습니다."});
        return;
      }

      // 상담이력 상세정보 조회 및 팝업 열기
      this.selectCvlcptCuttHist(this.CVLCPT_DATA[col]);
    },

    // 민원 상담이력 상세정보 조회
    async selectCvlcptCuttHist(data) {

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
          if(this.isWindow){
            this.$parent.mixin_openWindow( 'LayoutPopup', '1600', '850', {compo_name : 'CSL_M0100_DETAIL', callback : 'getPopData', title: '상담이력 상세보기', popData: response.DATA[0], CUSTCO_ID: response.DATA[0].CUSTCO_ID});
          }else{
            this.mixin_openWindow( 'LayoutPopup', '1600', '850', {compo_name : 'CSL_M0100_DETAIL', callback : 'getPopData', title: '상담이력 상세보기', popData: response.DATA[0], CUSTCO_ID: response.DATA[0].CUSTCO_ID});
          }
        }
        else this.showAlertInfo({msg:"상담이력이 존재하지 않습니다."});
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    // 상담번호 민원 등록여부 확인
    async checkCvlcptPhnCuttId() {
      let obj = {
        RCPT_PHN_CUTT_ID: ""
        , CUTT_PHN_CUTT_ID: ""
        , REG_YN: "N"
        , CUTT_YN: "N"
      };

      // let sUrl = '/phone-api/cvlcpt/checkCvlcptPhnCuttId';
      let sUrl = '/api/biz/common/select/checkCvlcptPhnCuttId';

      let postParam = {
        PHN_CUTT_ID: this.CVLCPT_DATA.PHN_CUTT_ID
      };

      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper",
          sn: "checkCvlcptPhnCuttId"
        }
      };

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA.length > 0)  obj = response.DATA[0];
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }

      return obj;
    },


    // 저장 버튼 클릭 이벤트
    async clickSaveBtn(){
      if(this.mixin_isEmpty(this.CVLCPT_DATA.CVLCPT_SE_CD)){
        this.showAlertInfo({msg:"민원 구분을 선택해주세요."});
        return;
      }

      if(this.mixin_isEmpty(this.CVLCPT_DATA.CVLCPT_RCPT_PATH_CD)){
        this.showAlertInfo({msg:"접수 경로를 선택해주세요."});
        return;
      }

      if(this.computedRegDt.length != 12){
        this.showAlertInfo({msg:"접수일자를 정확히 입력해주세요."});
        return;
      }

      if(this.mixin_isEmpty(this.CVLCPT_DATA.CVLCPT_RCPT_PATH_CD)){
        this.showAlertInfo({msg:"접수 경로를 선택해주세요."});
        return;
      }

      // 대외민원인 경우 접수경로 필수 선택
      // if(this.mixin_isEmpty(this.CVLCPT_DATA.CVLCPT_RCPT_TYPE_CD) && this.CVLCPT_DATA.CVLCPT_SE_CD == "OVOC"){
      //   this.showAlertInfo({msg:"접수 유형을 선택해주세요."});
      //   return;
      // }

      if(this.mixin_isEmpty(this.CVLCPT_DATA.CUST_PHN_NO)){
        this.showAlertInfo({msg:"고객 연락처를 입력해주세요."});
        return;
      }

      if(this.mixin_isEmpty(this.CVLCPT_DATA.CUST_NM)){
        this.showAlertInfo({msg:"고객명을 입력해주세요."});
        return;
      }

      if(this.mixin_isEmpty(this.CVLCPT_DATA.CENTER.CUSTCO_ID)){
        this.showAlertInfo({msg:"접수센터를 입력해주세요."});
        return;
      }

      if(this.mixin_isEmpty(this.CVLCPT_DATA.RCPT_DEPT_ID)){
        this.showAlertInfo({msg:"소속을 입력해주세요."});
        return;
      }

      if(this.mixin_isEmpty(this.CVLCPT_DATA.CUSL_ID)){
        this.showAlertInfo({msg:"상담사를 선택해주세요."});
        return;
      }

      if(this.mixin_isEmpty(this.CVLCPT_DATA.PHN_CUTT_ID)){
        this.showAlertInfo({msg:"상담번호를 입력해주세요."});
        return;
      }

      let chkObj = await this.checkCvlcptPhnCuttId();

      // 등록된 상담이력인지 확인인
      if(chkObj.CUTT_YN == "N"){
        this.showAlertInfo({msg:"존재하지 않는 상담번호입니다."});
        return;
      }

      if(chkObj.REG_YN == "Y" && (chkObj.RCPT_CVLCPT_RCPT_MNG_ID != this.CVLCPT_DATA.CVLCPT_RCPT_MNG_ID)){
        this.showAlertInfo({msg:"해당 상담번호로 등록된 민원이 존재합니다."});
        return;
      }

      if(this.mixin_isEmpty(this.CVLCPT_DATA.CVLCPT_CLSF_ID)){
        this.showAlertInfo({msg:"민원분류를 선택해주세요."});
        return;
      }

      if(this.mixin_isEmpty(this.CVLCPT_DATA.CVLCPT_CN)){
        this.showAlertInfo({msg:"민원내용을 입력해주세요."});
        return;
      }

      if(this.mixin_isEmpty(this.CVLCPT_DATA.CPST_CN) && this.CVLCPT_DATA.CPST_YN){
        this.showAlertInfo({msg:"보상내용을 입력해주세요."});
        return;
      }

      if(this.mixin_isEmpty(this.CVLCPT_DATA.CAUTION_CUST_DOC_NO) && this.CVLCPT_DATA.CAUTION_CUST_YN){
        this.showAlertInfo({msg:"참조 기안번호를 입력해주세요."});
        return;
      }

      // 종결처리 시
      if(this.CVLCPT_DATA.PRGRS_STTS_CD == "E"){
        if(this.mixin_isEmpty(this.CVLCPT_DATA.PRCS_RSLT_CN)){
          this.showAlertInfo({msg:"처리 결과를 입력해주세요."});
          return;
        }

        if(this.mixin_isEmpty(this.CVLCPT_DATA.IPRVMT_CN)){
          this.showAlertInfo({msg:"개선 방안을 입력해주세요."});
          return;
        }

        if(this.computedLastPrcsDt.length != 12){
          this.showAlertInfo({msg:"최종 처리일을 정확히 입력해주세요."});
          return;
        }

        // if(this.mixin_isEmpty(this.CVLCPT_DATA.LAST_PRCR_ID)){
        //   this.showAlertInfo({msg:"최종 처리자를 입력해주세요."});
        //   return;
        // }
      }

      this.showConfirmInfo({
        msg:'저장하시겠습니까?'
        , callYes: () => {
          this.closeAlert();
          if(!this.isFinish){
            this.saveCvlcptMng();
          }else{
            this.updateCvlcptClsfId();
          }
        }
        , callNo: this.closeAlert
      });
    },

    // 대내외 민원 저장
    async saveCvlcptMng(){
      
      // 첨부파일
      if(this.$refs.CTM_M0300_TAB_02_DETAIL_TAB_03 != undefined){
        let filelist = [];

        let fileOk = await this.$refs.CTM_M0300_TAB_02_DETAIL_TAB_03[0].fileGroupKeyUnity();
        if(fileOk){
          filelist = this.$refs.CTM_M0300_TAB_02_DETAIL_TAB_03[0].FORM_DATA.filelist;
          this.CVLCPT_DATA.FILE_GROUP_KEY = filelist.length > 0 ? filelist[0].fileGroupKey : "";
        }
      }

      let sUrl = '/phone-api/cvlcpt/saveCvlcptMng';
      // let sUrl = '/api/biz/common/insert/saveCvlcptMng';

      let postParam = {
        CVLCPT_RCPT_MNG_ID : this.CVLCPT_DATA.CVLCPT_RCPT_MNG_ID
        , CVLCPT_SE_CD : this.CVLCPT_DATA.CVLCPT_SE_CD
        , CVLCPT_RCPT_PATH_CD : this.CVLCPT_DATA.CVLCPT_RCPT_PATH_CD
        // , CVLCPT_RCPT_TYPE_CD : this.CVLCPT_DATA.CVLCPT_RCPT_TYPE_CD
        , CUST_PHN_NO : this.CVLCPT_DATA.CUST_PHN_NO.replace(/[^0-9]/g, '')
        , CUST_NM : this.CVLCPT_DATA.CUST_NM
        , RCPT_CUSTCO_ID : this.CVLCPT_DATA.CENTER.CUSTCO_ID
        , RCPT_DEPT_ID : this.CVLCPT_DATA.RCPT_DEPT_ID
        , CUSL_ID : this.CVLCPT_DATA.CUSL_ID
        , PHN_CUTT_ID : this.CVLCPT_DATA.PHN_CUTT_ID
        , CVLCPT_CLSF_ID : this.CVLCPT_DATA.CVLCPT_CLSF_ID
        , CVLCPT_CN : this.CVLCPT_DATA.CVLCPT_CN
        , CPST_YN : this.CVLCPT_DATA.CPST_YN ? "Y" : "N"
        , CPST_CN : this.CVLCPT_DATA.CPST_CN
        , CAUTION_CUST_YN : this.CVLCPT_DATA.CAUTION_CUST_YN ? "Y" : "N"
        , CAUTION_CUST_DOC_NO : this.CVLCPT_DATA.CAUTION_CUST_DOC_NO
        , PRGRS_STTS_CD : this.CVLCPT_DATA.PRGRS_STTS_CD
        , PRCS_RSLT_CN : this.CVLCPT_DATA.PRCS_RSLT_CN
        , IPRVMT_CN : this.CVLCPT_DATA.IPRVMT_CN
        , REG_DT : this.computedRegDt
        , LAST_PRCS_DT : this.computedLastPrcsDt
        , LAST_PRCR_ID : this.CVLCPT_DATA.LAST_PRCR_ID
        , FILE_GROUP_KEY: this.CVLCPT_DATA.FILE_GROUP_KEY
      };

      let headParam = {head: {}};

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.CVLCPT_DATA.CVLCPT_RCPT_MNG_ID = response.HEADER.CVLCPT_RCPT_MNG_ID;
        this.showToastSuccess({msg:'저장되었습니다.'});
        // this.selectCvlcptData();
        this.refresh();
        this.$emit('Close');
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    // 민원 분류만 업데이트
    async updateCvlcptClsfId(){
      // let sUrl = '/phone-api/cvlcpt/updateCvlcptClsfId';
      let sUrl = '/api/biz/common/update/updateCvlcptClsfId';

      let postParam = {
        CVLCPT_RCPT_MNG_ID : this.CVLCPT_DATA.CVLCPT_RCPT_MNG_ID
        , CVLCPT_CLSF_ID : this.CVLCPT_DATA.CVLCPT_CLSF_ID
      };

      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper",
          sn: "updateCvlcptClsfId"
        }
      };

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.showToastSuccess({msg:'저장되었습니다.'});
        this.refresh();
        this.$emit('Close');
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    // 삭제
    clickDeleteBtn(){

      if(this.mixin_isEmpty(this.CVLCPT_DATA.CVLCPT_RCPT_MNG_ID)) return false;
      if(this.CVLCPT_DATA.PRGRS_STTS_CD == "E"){
        this.showAlertInfo({msg:"종결된 민원은 삭제할 수 업습니다."});
        return false;
      }

      this.showConfirmCaution({
        msg:'해당 민원은 영구 삭제됩니다. \n정말 삭제하시겠습니까?'
        , callYes: () => {
          this.deleteCvlcptData();
          this.closeAlert();
        }
        , callNo: this.closeAlert
      });
    },

    async deleteCvlcptData(){
      let sUrl = '/phone-api/cvlcpt/deleteCvlcptData';
      // let sUrl = '/api/biz/common/delete/deleteCvlcptData';

      let postParam = {
        LIST: this.CVLCPT_DATA.CVLCPT_RCPT_MNG_ID
      };

      let headParam = { head: {} };

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.showToastSuccess({msg:"삭제되었습니다."});
        this.refresh();
        this.$emit('Close');
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    // 민원 접수 목록 재조회
    refresh(){
      if(this.isWindow) this.$parent.sendDataToParent("cvlcptRcptList");
      else this.$emit("refresh");
    },

    // 민원 구분 변경 이벤트
    changeCvlcptSeCd(){
      if(this.CVLCPT_DATA.CVLCPT_SE_CD == "IVOC"){
        // 대내민원
        if(this.mixin_isEmpty(this.CVLCPT_DATA.CVLCPT_SE_CD)) this.DROP_RCPT_PATH = [{text:"선택", value:""}];
        else this.DROP_RCPT_PATH = this.mixin_common_code_get(this.list_common_code, 'VOC_PATH', '선택');
      }else if(!this.mixin_isEmpty(this.CVLCPT_DATA.CVLCPT_SE_CD)){
        // 대외민원
        this.DROP_RCPT_PATH = this.mixin_common_code_get(this.list_common_code, 'VOC_OSD', '선택');
      }else{
        this.DROP_RCPT_PATH = [{text:"선택", value:""}];
      }

      this.CVLCPT_DATA.CVLCPT_RCPT_PATH_CD = "";
      // this.CVLCPT_DATA.CVLCPT_RCPT_TYPE_CD = "";
    },

    // 센터 변경 이벤트
    changeCenter(){
      this.DROP_DEPT_ID = this.mixin_ognz_list_detail(this.common_ognz_list, this.CVLCPT_DATA.CENTER.DEPT_ID, '선택' ,'Y'/*콜센터여부,없으면전체*/);
      this.CVLCPT_DATA.RCPT_DEPT_ID = "";
      this.userList = [{text:"선택", value:""}];
      this.CVLCPT_DATA.CUSL_ID = "";
    },

    // 소속 변경 이벤트
    async changeDept(){
      // 소속 사용자 리스트 조회
      this.userList = await this.mixin_get_cusl_list_combo(this.CVLCPT_DATA.RCPT_DEPT_ID);
      this.CVLCPT_DATA.CUSL_ID = "";

      if(this.mixin_isEmpty(this.CVLCPT_DATA.RCPT_DEPT_ID)) this.userList = [];
      else this.getUserList();
    },

    // 사용자 조회
    async getUserList() {
      this.userList = [];

      let postParam = {
        SCH_TYPE : 'CUSL',
        SCH_GROUP_ID : this.CVLCPT_DATA.CENTER.DEPT_ID,
        SCH_DEPT_ID : this.CVLCPT_DATA.RCPT_DEPT_ID,
      };
      let headParam = {
        head: {
          ns: "palette3.common.user.dao.UserCmmnMapper",
          sn: "selectUserList"
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/selectUserList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.userList = response.DATA.map(row=>{
          row.value = row.USER_ID;
          row.text = row.USER_NM;
          return row;
        });
      }

      this.userList.unshift({value:"", text:"선택"});
    },

    // 걸기버튼
    clickCallBtn(){
      if(this.mixin_isEmpty(this.CVLCPT_DATA.CUST_PHN_NO)){
        this.showAlertInfo({msg:"고객 연락처를 입력해주세요."});
        return;
      }

      if(this.mixin_isEmpty(this.CVLCPT_DATA.CVLCPT_RCPT_MNG_ID)){
        this.showAlertInfo({msg:"민원 등록 후 진행해주세요."});
        return;
      }

      // 윈도우 팝업인 경우
      if(this.isWindow){
        // LayoutPopup
        this.$parent.item.popData = this.CVLCPT_DATA;
        this.$emit("sendDataToParent");
      }else{
        this.$eventBus.$emit('topOutCall', {CUST_PHN_NO:this.CVLCPT_DATA.CUST_PHN_NO, CVLCPT_RCPT_MNG_ID:this.CVLCPT_DATA.CVLCPT_RCPT_MNG_ID});
      }
    },

    // 민원정보 셋팅
    async setCvlcptData(data){
      // 신규 민원 등록
      if(this.mixin_isEmpty(data)){
        // 로그인 사용자 프로필 정보 셋팅
        let img = this.$store.getters["userStore/GE_USER_ROLE"].ICON_IMG_URI;
        this.CVLCPT_DATA.REG_UP_DEPT_NM = this.computedUserCenterDeptNm;
        this.CVLCPT_DATA.REG_DEPT_NM = this.computedUserDeptNm;
        this.CVLCPT_DATA.REG_USER_NM = this.$store.getters["userStore/GE_USER_ROLE"].userName;
        this.CVLCPT_DATA.REG_USER_IMG = img !== "/" ? "/upload/"+img : require('@/assets/img/@manager_profile_default.png');
      }else{
        //민원정보 셋팅
        this.CVLCPT_DATA.CVLCPT_RCPT_MNG_ID = data.CVLCPT_RCPT_MNG_ID;
        this.CVLCPT_DATA.REG_DT = this.$moment(data.REG_DT, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss");
        this.CVLCPT_DATA.REG_DATE = this.$moment(data.REG_DT, "YYYYMMDDHHmmss").format("YYYY-MM-DD");
        this.CVLCPT_DATA.REG_TIME = this.$moment(data.REG_DT, "YYYYMMDDHHmmss").format("HH:mm");
        this.CVLCPT_DATA.REG_UP_DEPT_NM = data.REG_UP_DEPT_NM;
        this.CVLCPT_DATA.REG_DEPT_NM = data.REG_DEPT_NM;
        this.CVLCPT_DATA.REG_USER_NM = data.REG_USER_NM;
        this.CVLCPT_DATA.REG_USER_IMG = data.REG_ICON_IMG_URI !== "/" ? "/upload/"+data.REG_ICON_IMG_URI : require('@/assets/img/@manager_profile_default.png');
        this.CVLCPT_DATA.REG_PHN_CUTT_ID = data.REG_PHN_CUTT_ID;
        this.CVLCPT_DATA.CVLCPT_SE_CD = data.CVLCPT_SE_CD;
        this.changeCvlcptSeCd();
        this.CVLCPT_DATA.CVLCPT_RCPT_PATH_CD = data.CVLCPT_RCPT_PATH_CD;
        // this.CVLCPT_DATA.CVLCPT_RCPT_TYPE_CD = data.CVLCPT_RCPT_TYPE_CD;
        this.CVLCPT_DATA.CUST_PHN_NO = this.mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, ''));
        this.CVLCPT_DATA.CUST_NM = data.CUST_NM;
        this.CVLCPT_DATA.RCPT_CUSTCO_ID = data.RCPT_CUSTCO_ID;
        let center = this.DROP_CENTER_ID.filter(row=>{return row.CUSTCO_ID == data.RCPT_CUSTCO_ID});
        this.CVLCPT_DATA.CENTER = center.length > 0 ? center[0] : {};
        await this.changeCenter();
        this.CVLCPT_DATA.RCPT_DEPT_ID = data.RCPT_DEPT_ID;
        await this.changeDept();
        this.CVLCPT_DATA.CUSL_ID = data.CUSL_ID;
        this.CVLCPT_DATA.CUSL_NM = data.CUSL_NM;
        this.CVLCPT_DATA.PHN_CUTT_ID = data.PHN_CUTT_ID;
        this.CVLCPT_DATA.CVLCPT_CLSF_FULL_PATH_ID = data.CVLCPT_CLSF_FULL_PATH_ID;
        this.CVLCPT_DATA.CVLCPT_CLSF_ID = data.CVLCPT_CLSF_ID;
        this.CVLCPT_DATA.CVLCPT_CLSF_ID1 = data.CVLCPT_CLSF_ID1;
        this.CVLCPT_DATA.CVLCPT_CLSF_ID2 = data.CVLCPT_CLSF_ID2;
        this.CVLCPT_DATA.CVLCPT_CLSF_ID3 = data.CVLCPT_CLSF_ID3;
        this.CVLCPT_DATA.CVLCPT_CN = data.CVLCPT_CN;
        this.CVLCPT_DATA.CPST_YN = data.CPST_YN == "Y" ? true : false;
        this.CVLCPT_DATA.CPST_CN = data.CPST_CN;
        this.CVLCPT_DATA.CAUTION_CUST_YN = data.CAUTION_CUST_YN == "Y" ? true : false;
        this.CVLCPT_DATA.CAUTION_CUST_DOC_NO = data.CAUTION_CUST_DOC_NO;
        this.CVLCPT_DATA.PRGRS_STTS_CD = data.PRGRS_STTS_CD;
        this.isFinish = data.PRGRS_STTS_CD == "E" ? true : false;
        this.CVLCPT_DATA.PRCS_RSLT_CN = data.PRCS_RSLT_CN;
        this.CVLCPT_DATA.IPRVMT_CN = data.IPRVMT_CN;
        this.CVLCPT_DATA.LAST_PRCS_DT = data.LAST_PRCS_DT;
        this.CVLCPT_DATA.LAST_PRCS_DATE = this.mixin_isEmpty(data.LAST_PRCS_DT) ? "" : this.$moment(data.LAST_PRCS_DT, "YYYYMMDDHHmmss").format("YYYY-MM-DD");
        this.CVLCPT_DATA.LAST_PRCS_TIME = this.mixin_isEmpty(data.LAST_PRCS_DT) ? "" : this.$moment(data.LAST_PRCS_DT, "YYYYMMDDHHmmss").format("HH:mm");
        this.CVLCPT_DATA.LAST_PRCR_ID = data.LAST_PRCR_ID;
        this.CVLCPT_DATA.LAST_PRCR_NM = data.LAST_PRCR_NM;
        this.CVLCPT_DATA.FILE_GROUP_KEY = data.FILE_GROUP_KEY;
        this.selectCvlcptCuttList();
      }

      if(!this.mixin_isEmpty(this.CVLCPT_DATA.FILE_GROUP_KEY)) this.tabsList2[2].badge = true;
    },
  },
  async mounted() {
    //공통코드설정
    let codeName = ["VOC_DV", "VOC_PATH", "VOC_OSD", "VOC_REGTP"]; //민원 구분
    this.list_common_code = await this.mixin_common_code_get_all(codeName);

    // 민원구분
    let vocDv = this.mixin_common_code_get(this.list_common_code, 'VOC_DV', '선택');
    if((this.computedUserType == "ETC_ADMIN" && this.mixin_isEmpty(this.popData.CVLCPT_RCPT_MNG_ID)) || (this.popData.CVLCPT_SE_CD != 'IVOC')){
      //인재개발 대외민원
      this.DROP_VOC_DV = vocDv.filter((row=>{ return row.value == "" || row.cd_vl1 != "Y"}));
    }else{
      // 센터 대내민원
      this.DROP_VOC_DV = vocDv.filter((row=>{ return (row.value == "" || row.cd_vl1 == "Y") && row.value != 'CALLVOC'}));
    }

    this.ADMIN_YN = this.computedUserType == "ETC_ADMIN";

    // 조직정보
    this.common_ognz_list =  await this.mixin_ognz_list();
    this.DROP_CENTER_ID = this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '선택' );
    this.changeCenter();

    if(this.popData != undefined && this.popData.isWindow) this.isWindow = true;

    if(this.popData != undefined && !this.mixin_isEmpty(this.popData.CVLCPT_RCPT_MNG_ID)){
      this.CVLCPT_DATA.CVLCPT_RCPT_MNG_ID = this.popData.CVLCPT_RCPT_MNG_ID;
      this.selectCvlcptData();
    }else{
      this.setCvlcptData();
    }
  },
  created() {
  },
  computed: {
    computedRegDt(){
      return (this.CVLCPT_DATA.REG_DATE+this.CVLCPT_DATA.REG_TIME).replaceAll(/[^0-9]/g,'');
    },

    computedLastPrcsDt(){
      return (this.CVLCPT_DATA.LAST_PRCS_DATE+this.CVLCPT_DATA.LAST_PRCS_TIME).replaceAll(/[^0-9]/g,'');
    }
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>