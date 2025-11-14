<template>
  <div>
    <div class="pl-card">
      <table class="pl-tbl-detail">
        <colgroup>
          <col width="127px" />
          <col width="" />
          <col width="127px" />
          <col width="" />
          <col width="127px" />
          <col width="" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">
              <span class="pl-label">
                접수센터
              </span>
            </th>
            <td class="text-center">
              <span class="pl-value-txt ">{{ this.PHN_CVLCPT_DATA.REG_CUSTCO_NM }}</span>
            </td>
            <th scope="row">
              <span class="pl-label">
                접수자
              </span>
            </th>
            <td class="text-center">
              <span class="pl-value-txt ">{{ this.PHN_CVLCPT_DATA.RGTR_NM }}</span>
            </td>
            <th scope="row">
              <span class="pl-label">
                접수일시
              </span>
            </th>
            <td class="text-center">
              <span class="pl-value-txt ">{{ this.PHN_CVLCPT_DATA.REG_DT }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 민원인정보 -->
      <div class="is-mt-m">
        <strong class="pl-bullet-txt is-blue">민원인 정보</strong> <span> <strong>(성명:</strong> 반드시 기재, <strong>연락처:</strong> <span>연락가능 전화번호 1개이상 기재, <strong>주소:</strong> <span>실거주지 기재)</span></span></span>
        <table class="pl-tbl-detail is-mt-s">
          <colgroup>
            <col width="127px" />
            <col width="" />
            <col width="127px" />
            <col width="" />
            <col width="127px" />
            <col width="" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  성명
                </span>
              </th>
              <td >
                <v-text-field
                  class="pl-form"
                  v-model="PHN_CVLCPT_DATA.CUST_NM"
                  v-byte-counter="100"
                  :disabled="isDisabled"
                  />
              </td>
              <th scope="row">
                <span class="pl-label">
                  핸드폰
                </span>
              </th>
              <td >
                <v-text-field
                  class="pl-form"
                  v-model="PHN_CVLCPT_DATA.CUST_PHN_NO"
                  v-byte-counter="60"
                  oninput="this.value=this.value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)"
                  :disabled="isDisabled"
                  />
              </td>
              <th scope="row">
                <span class="pl-label">
                  유선전화
                </span>
              </th>
              <td >
                <v-text-field
                  class="pl-form"
                  v-model="PHN_CVLCPT_DATA.CUST_PHN_NO2"
                  v-byte-counter="60"
                  oninput="this.value=this.value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)"
                  :disabled="isDisabled"
                  />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  주소
                </span>
              </th>
              <td colspan="5">
                <v-text-field
                  class="pl-form is-auto"
                  placeholder="실거주지 기재"
                  v-model="PHN_CVLCPT_DATA.CUST_ADDR"
                  v-byte-counter="1000"
                  :disabled="isDisabled"
                  />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 민원내용 -->
      <div class="is-mt-m">
        <strong class="pl-bullet-txt is-blue">민원 내용</strong>
        <table class="pl-tbl-detail is-mt-s" id="excelDown">
          <colgroup>
            <col width="127px" />
            <col width="40%" />
            <col width="127px" />
            <col width="" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  민원 발생지
                </span>
              </th>
              <td >
                <v-text-field
                  class="pl-form is-auto"
                  placeholder="주택 주소 · 동호/보상 · 건설현장 지구 명칭 등 기재"
                  v-model="PHN_CVLCPT_DATA.CVLCPT_OCRN_RGN"
                  v-byte-counter="500"
                  :disabled="isDisabled"
                  />
              </td>
              <th scope="row">
                <span class="pl-label">
                  LH 담당부서
                </span>
              </th>
              <td >
                <v-text-field
                  class="pl-form is-auto"
                  placeholder="확인 가능한 경우 기재"
                  v-model="PHN_CVLCPT_DATA.LH_TKCG_DEPT_NM"
                  v-byte-counter="500"
                  :disabled="isDisabled"
                  />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  민원 대상
                </span>
              </th>
              <td >
                <v-select
                  v-model="PHN_CVLCPT_DATA.CVLCPT_TRGT_CD"
                  :items="DROP_VOC_CALL_TP"
                  class="pl-form is-auto"
                  placeholder="선택"
                  @change="changeCvlcptTrgtCd"
                  :disabled="computedUserType != 'ETC_ADMIN'"
                  />
              </td>
              <th scope="row">
                <span class="pl-label">
                  민원 분류
                </span>
              </th>
              <td >
                <v-select
                  v-model="PHN_CVLCPT_DATA.CVLCPT_CLSF_CD"
                  :items="DROP_VOC_CALL"
                  class="pl-form is-auto"
                  placeholder="선택"
                  :disabled="computedUserType != 'ETC_ADMIN'"
                  />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  민원 제목
                </span>
              </th>
              <td colspan="3">
                <v-text-field
                  class="pl-form is-auto"
                  v-model="PHN_CVLCPT_DATA.CVLCPT_TTL"
                  v-byte-counter="200"
                  :disabled="isDisabled"
                  />
              </td>
            </tr>
            <tr>
              <td colspan="4" class="has-textarea">
                <v-textarea
                  class="pl-form is-noresize"
                  rows="9"
                  :spellcheck="false"
                  placeholder="민원 내용 기재"
                  v-model="PHN_CVLCPT_DATA.CVLCPT_CN"
                  v-byte-counter="4000"
                  :disabled="isDisabled"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  특이사항
                </span>
              </th>
              <td colspan="3" class="has-textarea">
                <v-textarea
                  v-model="PHN_CVLCPT_DATA.RMRK"
                  class="pl-form is-noresize"
                  rows="2"
                  :spellcheck="false"
                  placeholder="고객이 제3자에게 정보유출 금지요청서 'LH담당자 외 개인정보 유출 금지' 기재"
                  v-byte-counter="4000"
                  :disabled="isDisabled"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 민원 회신 방법 -->
      <div class="is-mt-m">
        <strong class="pl-bullet-txt is-blue">민원 회신 방법</strong> <span>2가지 방법 중 1개 이상 선택</span>
        <table class="pl-tbl-detail is-mt-s">
          <colgroup>
            <col width="30%" />
            <col width="" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">우편(서신)</th>
              <th scope="col">이메일</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td >
                <div class="text-center">
                  <v-checkbox
                    v-model="PHN_CVLCPT_DATA.PRCS_MTHD_ZIP_YN"
                    class="pl-check "
                    style="display: inline-block; width: auto;"
                    input-value="true"
                    :disabled="isDisabled"
                    >
                    <template v-slot:label>
                      <span class="pl-label">우편(서신) 회신</span>
                    </template>
                  </v-checkbox>
                </div>
              </td>
              <td >
                <div class="spacing-wrap sp-8 align-center">
                  <span>
                    <v-checkbox
                      v-model="PHN_CVLCPT_DATA.PRCS_MTHD_EML_YN"
                      class="pl-check"
                      input-value="true"
                      :disabled="isDisabled"
                      >
                      <template v-slot:label>
                        <span class="pl-label">이메일 회신</span>
                      </template>
                    </v-checkbox>
                  </span>
                  <v-text-field
                    class="pl-form is-auto"
                    placeholder="이메일 주소 입력"
                    v-model="PHN_CVLCPT_DATA.EML"
                    v-byte-counter="200"
                    :disabled="isDisabled || !PHN_CVLCPT_DATA.PRCS_MTHD_EML_YN"
                   />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="pl-cols pl-card is-border-top mt-auto">
      <div class="is-col-fix" style="width:200px">
      <div class="pl-btn-wrap justify-start">
        <v-btn class="pl-btn is-icon is-trans" 
          @click="phnCvlcptExcelDown()" 
          v-if="this.computedUserType != 'MANAGER'">
          <span class="pl-icon20 template"></span> 엑셀 다운로드
        </v-btn>
      </div>
    </div>
    <div class="pl-btn-wrap justify-end">
      <v-btn class="pl-btn is-trans " @click="closePop()">닫기</v-btn>
      <v-btn class="pl-btn is-icon is-trans" 
        @click="clickSaveBtn('REJECT')"
        v-if="PHN_CVLCPT_DATA.PRGRS_STTS_CD === '01' && (computedUserType === 'LEADER' || computedUserDetailType === 'SUPER_ADMIN')">
        <span class="pl-icon20 reject"></span>
        반려
      </v-btn>
      <v-btn class="pl-btn" 
        @click="clickSaveBtn('ACCEPT')"
        v-if="PHN_CVLCPT_DATA.PRGRS_STTS_CD === '01' && (computedUserType === 'LEADER' || computedUserDetailType === 'SUPER_ADMIN')">승인</v-btn>
      <v-btn class="pl-btn" v-if="!isDisabled && (computedUserType == 'ETC_ADMIN')" @click="clickSaveBtn('SAVE')">저장</v-btn>
    </div>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx-color";

export default {
  name: 'CSM_M1600_POP', //전화민원 접수(민원 이송) 팝업
  components: {
  },
  props:{
    popData:{
      type: Object
      , default: ()=>{}
    }
  },
  data() {
    return {
      list_common_code:[],  // 공통코드
      DROP_VOC_CALL_TP:[{text:"선택", value:""}],  // 민원대상
      DROP_VOC_CALL:[{text:"선택", value:""}],     // 민원분류
      VOC_CALL_LIST:{       
        VOC_CALL_01: []
        , VOC_CALL_02: []
        , VOC_CALL_03: []
        , VOC_CALL_04: []
        , VOC_CALL_99: []
      },     

      // 종합민원 상세정보
      PHN_CVLCPT_DATA:{
        PHN_CVLCPT_ID: "",
        REG_CUSTCO_ID: "",
        REG_CUSTCO_NM: "",
        CUST_NM: "",
        CUST_PHN_NO: "",
        CUST_PHN_NO2: "",
        CUST_ADDR: "",
        CVLCPT_OCRN_RGN: "",
        LH_TKCG_DEPT_NM: "",
        CVLCPT_TRGT_CD: "",
        CVLCPT_TRGT_CD_NM: "",
        CVLCPT_CLSF_CD: "",
        CVLCPT_CLSF_CD_NM: "",
        CVLCPT_TTL: "",
        CVLCPT_CN: "",
        RMRK: "",
        PRCS_MTHD_ZIP_YN: false,
        PRCS_MTHD_EML_YN: false,
        EML: "",
        PRGRS_STTS_CD: "",
        RGTR_ID: "",
        RGTR_NM: "",
        REG_DT: "",
      },

      isDisabled: false,
    }
  },
  methods: {

    // 저장 버튼 클릭
    clickSaveBtn(type){
      let confirmMsg = "";

      if(this.mixin_isEmpty(this.PHN_CVLCPT_DATA.CUST_NM)){
        this.showAlertInfo({msg: '성명을 입력해주세요.'});
        return false;
      }

      if(this.mixin_isEmpty(this.PHN_CVLCPT_DATA.CUST_PHN_NO) && this.mixin_isEmpty(this.PHN_CVLCPT_DATA.CUST_PHN_NO2)){
        this.showAlertInfo({msg: '핸드폰, 유선전화 중 1개 이상 입력해주세요.'});
        return false;
      }

      if(this.mixin_isEmpty(this.PHN_CVLCPT_DATA.CVLCPT_TRGT_CD) && this.computedUserGroupCd === 'SYS_MANAGER'){
        this.showAlertInfo({msg: '민원 대상을 선택해주세요.'});
        return false;
      }

      if(this.mixin_isEmpty(this.PHN_CVLCPT_DATA.CVLCPT_CLSF_CD) && this.computedUserGroupCd === 'SYS_MANAGER'){
        this.showAlertInfo({msg: '민원 분류를 선택해주세요.'});
        return false;
      }

      if(this.mixin_isEmpty(this.PHN_CVLCPT_DATA.CVLCPT_TTL)){
        this.showAlertInfo({msg: '민원 제목을 입력해주세요.'});
        return false;
      }

      if(this.mixin_isEmpty(this.PHN_CVLCPT_DATA.CVLCPT_CN)){
        this.showAlertInfo({msg: '민원 내용을 입력해주세요.'});
        return false;
      }

      if(!this.PHN_CVLCPT_DATA.PRCS_MTHD_ZIP_YN && !this.PHN_CVLCPT_DATA.PRCS_MTHD_EML_YN){
        this.showAlertInfo({msg: '민원 회신 방법을 1개 이상 선택해주세요.'});
        return false;
      }

      if(this.PHN_CVLCPT_DATA.PRCS_MTHD_EML_YN){
        if(this.mixin_isEmpty(this.PHN_CVLCPT_DATA.EML)){
          this.showAlertInfo({msg: '이메일 주소를 입력해주세요.'});
          return false;
        }

        const EmlPattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
        if(!EmlPattern.test(this.PHN_CVLCPT_DATA.EML)){
          this.showAlertInfo({msg: '이메일 형식에 맞지 않습니다.'});
          return false;
        }
      }

      if(type === "SAVE"){
        confirmMsg = "저장하시겠습니까?";
        // 신규 등록인 경우 01
        if(this.mixin_isEmpty(this.PHN_CVLCPT_DATA.PHN_CVLCPT_ID)) this.PHN_CVLCPT_DATA.PRGRS_STTS_CD = "01";
      }else if(type === "ACCEPT"){
        confirmMsg = "승인하시겠습니까?";
        this.PHN_CVLCPT_DATA.PRGRS_STTS_CD = "02";
      }else if(type === "REJECT"){
        confirmMsg = "반려하시겠습니까?";
        this.PHN_CVLCPT_DATA.PRGRS_STTS_CD = "03";
      }

      this.showConfirmInfo({
        msg: confirmMsg
        , callYes: () => {
          console.log(type)
          this.closeAlert();
          this.savePhnCvlcptData(type);
        }
        , callNo: this.closeAlert
      });

    },

    // 종합민원 이송 접수
    async savePhnCvlcptData(type){
      let sUrl = '/phone-api/cvlcpt/savePhnCvlcptData';
      // let sUrl = '/api/biz/common/insert/savePhnCvlcptData';

      // 상담사가 아닌 사용자가 등록 시 자동 승인처리
      if(this.computedUserType != "MANAGER" && this.mixin_isEmpty(this.PHN_CVLCPT_DATA.PHN_CVLCPT_ID)){
        this.PHN_CVLCPT_DATA.PRGRS_STTS_CD = "02"
      }

      let postParam = {
        PHN_CVLCPT_ID: this.PHN_CVLCPT_DATA.PHN_CVLCPT_ID
        , REG_CUSTCO_ID: this.PHN_CVLCPT_DATA.REG_CUSTCO_ID
        , CUST_NM: this.PHN_CVLCPT_DATA.CUST_NM
        , CUST_PHN_NO: this.PHN_CVLCPT_DATA.CUST_PHN_NO.replace(/[^0-9]/g, "")
        , CUST_PHN_NO2: this.PHN_CVLCPT_DATA.CUST_PHN_NO2.replace(/[^0-9]/g, "")
        , CUST_ADDR: this.PHN_CVLCPT_DATA.CUST_ADDR
        , CVLCPT_OCRN_RGN: this.PHN_CVLCPT_DATA.CVLCPT_OCRN_RGN
        , LH_TKCG_DEPT_NM: this.PHN_CVLCPT_DATA.LH_TKCG_DEPT_NM
        , CVLCPT_TRGT_CD: this.PHN_CVLCPT_DATA.CVLCPT_TRGT_CD
        , CVLCPT_CLSF_CD: this.PHN_CVLCPT_DATA.CVLCPT_CLSF_CD
        , CVLCPT_TTL: this.PHN_CVLCPT_DATA.CVLCPT_TTL
        , CVLCPT_CN: this.PHN_CVLCPT_DATA.CVLCPT_CN
        , RMRK: this.PHN_CVLCPT_DATA.RMRK
        , PRCS_MTHD_ZIP_YN: this.PHN_CVLCPT_DATA.PRCS_MTHD_ZIP_YN ? "Y" : "N"
        , PRCS_MTHD_EML_YN: this.PHN_CVLCPT_DATA.PRCS_MTHD_EML_YN ? "Y" : "N"
        , EML: this.PHN_CVLCPT_DATA.EML
        , PRGRS_STTS_CD: this.PHN_CVLCPT_DATA.PRGRS_STTS_CD
        , RGTR_ID: this.PHN_CVLCPT_DATA.RGTR_ID
        , RGTR_NM: this.PHN_CVLCPT_DATA.RGTR_NM
        , REG_DT: this.PHN_CVLCPT_DATA.REG_DT.replace(/[^0-9]/g, "")
        , SAVE_TYPE: type
      };

      let headParam = {head: {}};

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(this.mixin_isEmpty(this.PHN_CVLCPT_DATA.PHN_CVLCPT_ID)) this.PHN_CVLCPT_DATA.PHN_CVLCPT_ID = response.HEADER.PHN_CVLCPT_ID;
        this.$parent.rtnItem = {PHN_CVLCPT_ID : this.PHN_CVLCPT_DATA.PHN_CVLCPT_ID};
        this.$emit("sendDataToParent");
        this.showToastSuccess({msg:'정상적으로 처리되었습니다.'});
        this.selectPhnCvlcptData();
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    // 종합민원 상세정보 조회
    async selectPhnCvlcptData(){
      // let sUrl = '/phone-api/cvlcpt/selectPhnCvlcptData';
      let sUrl = '/api/biz/common/select/selectPhnCvlcptData';

      let postParam = {
        PHN_CVLCPT_ID: this.PHN_CVLCPT_DATA.PHN_CVLCPT_ID
      };

      let headParam = {head: {
        ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper",
        sn: "selectPhnCvlcptData"
      }};

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA.length > 0){
          for(let key in response.DATA[0]){
            if(key === "PRCS_MTHD_ZIP_YN" || key === "PRCS_MTHD_EML_YN") this.PHN_CVLCPT_DATA[key] = response.DATA[0][key] == "Y";
            else if(key === "CUST_PHN_NO" || key === "CUST_PHN_NO2") this.PHN_CVLCPT_DATA[key] = response.DATA[0][key].replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
            else this.PHN_CVLCPT_DATA[key] = response.DATA[0][key];
            
            if(key == 'CVLCPT_TRGT_CD'){
              this.changeCvlcptTrgtCd();
            }
          }

          // 승인/반려인 경우 민원 대상, 민원 분류 제외 비활성화 처리
          this.isDisabled = (this.PHN_CVLCPT_DATA.PRGRS_STTS_CD === "02" || this.PHN_CVLCPT_DATA.PRGRS_STTS_CD === "03") && this.computedUserType != "ETC_ADMIN";
        }
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    // 민원 대상 변경 시 호출
    changeCvlcptTrgtCd(){
      this.PHN_CVLCPT_DATA.CVLCPT_CLSF_CD = "";
      if(this.mixin_isEmpty(this.PHN_CVLCPT_DATA.CVLCPT_TRGT_CD)) this.DROP_VOC_CALL = [{text:"선택", value:""}];
      else this.DROP_VOC_CALL = [...this.VOC_CALL_LIST[this.PHN_CVLCPT_DATA.CVLCPT_TRGT_CD]];
    },

    // 종합미누언 이송 접수 엑셀 다운로드
    phnCvlcptExcelDown(){
      
      let sheetName = "종합민원 이송 접수";

      let zip = this.PHN_CVLCPT_DATA.PRCS_MTHD_ZIP_YN ? "√ 우편(서신) 회신" : "";
      let mail = this.PHN_CVLCPT_DATA.PRCS_MTHD_EML_YN? "√ 이메일 회신 : "+this.PHN_CVLCPT_DATA.EML : "";

      let data = [
        { CELL1:"종합민원 이송 접수", CELL2:"", CELL3:"", CELL4:"", CELL5:"", CELL6:""}
        , { CELL1:"접수센터", CELL2:this.PHN_CVLCPT_DATA.REG_CUSTCO_NM, CELL3:"", CELL4:"접수일시", CELL5:this.PHN_CVLCPT_DATA.REG_DT, CELL6:""}
        , { CELL1:"▣ 민원인 정보 (성명: 반드시 기재, 연락처: 연락가능 전화번호 1개이상 기재, 주소: 실거주지 기재)", CELL2:"", CELL3:"", CELL4:"", CELL5:"", CELL6:""}
        , { CELL1:"성명", CELL2:this.PHN_CVLCPT_DATA.CUST_NM, CELL3:"핸드폰", CELL4:this.PHN_CVLCPT_DATA.CUST_PHN_NO, CELL5:"유선전화", CELL6:this.PHN_CVLCPT_DATA.CUST_PHN_NO2}
        , { CELL1:"주소", CELL2:this.PHN_CVLCPT_DATA.CUST_ADDR, CELL3:"", CELL4:"", CELL5:"", CELL6:""}
        , { CELL1:"▣ 민원 내용", CELL2:"", CELL3:"", CELL4:"", CELL5:"", CELL6:""}
        , { CELL1:"민원 발생지", CELL2:this.PHN_CVLCPT_DATA.CVLCPT_OCRN_RGN, CELL3:"", CELL4:"", CELL5:"LH 담당부서", CELL6:this.PHN_CVLCPT_DATA.LH_TKCG_DEPT_NM}
        , { CELL1:"민원 대상", CELL2:this.PHN_CVLCPT_DATA.CVLCPT_TRGT_CD_NM, CELL3:"", CELL4:"", CELL5:"민원 분류", CELL6:this.PHN_CVLCPT_DATA.CVLCPT_CLSF_CD_NM}
        , { CELL1:"민원 제목", CELL2:this.PHN_CVLCPT_DATA.CVLCPT_TTL, CELL3:"", CELL4:"", CELL5:"", CELL6:""}
        , { CELL1:this.PHN_CVLCPT_DATA.CVLCPT_CN.replace("\r\n", "\n"), CELL2:"", CELL3:"", CELL4:"", CELL5:"", CELL6:""}
        , { CELL1:"특이사항", CELL2:this.PHN_CVLCPT_DATA.RMRK, CELL3:"", CELL4:"", CELL5:"", CELL6:""}
        , { CELL1:"▣ 민원 회신 방법(2가지 방법 중 1개 이상 선택)", CELL2:"", CELL3:"", CELL4:"", CELL5:"", CELL6:""}
        , { CELL1:"우편서신", CELL2:"", CELL3:"이메일", CELL4:"", CELL5:"", CELL6:""}
        , { CELL1:zip, CELL2:"", CELL3:mail, CELL4:"", CELL5:"", CELL6:""}
      ];

      let merges = [
        {s:{r:0, c:0}, e:{r:0, c:5}}
        , {s:{r:1, c:1}, e:{r:1, c:2}}
        , {s:{r:1, c:4}, e:{r:1, c:5}}
        , {s:{r:2, c:0}, e:{r:2, c:5}}
        , {s:{r:4, c:1}, e:{r:4, c:5}}
        , {s:{r:5, c:0}, e:{r:5, c:5}}
        , {s:{r:6, c:1}, e:{r:6, c:3}}
        , {s:{r:7, c:1}, e:{r:7, c:3}}
        , {s:{r:8, c:1}, e:{r:8, c:5}}
        , {s:{r:9, c:0}, e:{r:9, c:5}}
        , {s:{r:10, c:1}, e:{r:10, c:5}}
        , {s:{r:11, c:0}, e:{r:11, c:5}}
        , {s:{r:12, c:0}, e:{r:12, c:1}}
        , {s:{r:12, c:2}, e:{r:12, c:5}}
        , {s:{r:13, c:0}, e:{r:13, c:1}}
        , {s:{r:13, c:2}, e:{r:13, c:5}}
      ];
      
      let workBook = XLSX.utils.book_new();
      let excelData = XLSX.utils.json_to_sheet(data, {defval:""});
      excelData["!merges"] = merges;
      excelData["!cols"] = [
        {wch:20}
        , {wch:20}
        , {wch:20}
        , {wch:20}
        , {wch:20}
        , {wch:20}
      ];
      excelData["!rows"] = [
        {hpt:60}
        , {hpt:15}
        , {hpt:30}
        , {hpt:15}
        , {hpt:15}
        , {hpt:30}
        , {hpt:15}
        , {hpt:15}
        , {hpt:15}
        , {hpt:120}
        , {hpt:60}
        , {hpt:30}
        , {hpt:15}
        , {hpt:15}
      ];

      XLSX.utils.sheet_add_json(excelData, data, { origin: 'A2', skipHeader: true });

      // 기본헤더 삭제
      let variable = XLSX.utils.decode_range(excelData["!ref"])
      for(let R = 0; R < variable.e.r; ++R){
        for(let C = variable.s.c; C <= variable.e.c; ++C){
          excelData[XLSX.utils.encode_cell({r:R,c:C})] = excelData[XLSX.utils.encode_cell({r:R+1,c:C})];
        }
      }
      variable.e.r--
      excelData['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);

      XLSX.utils.book_append_sheet(workBook, excelData, sheetName);

      // 테두리 색상
      let borderColor = "FF808080"; 

      // for(let i=0; i<6; i++){
      //   workBook.Sheets[sheetName][String.fromCharCode(65+i)+"1"].s = {
      //     // fill: { patternType: 'solid', fgColor: { rgb: "EFF5FC" }}
      //     font:{ bold:true }
      //     , alignment: {horizontal: "center", vertical: "center"}
      //     , border: {
      //       right: { style: 'thin', color: { rgb: borderColor }}
      //       , left: {style: 'thin',color: { rgb: borderColor }}
      //       , top: {style: 'thin', color: { rgb: borderColor }}
      //       , bottom: {style: 'thin', color: { rgb: borderColor }}
      //     }
      //   }
      // }

      // 스타일 적용
      for(let cell in workBook.Sheets[sheetName]){
        if(cell == "!ref") break;
        if(workBook.Sheets[sheetName][cell] == undefined) continue;

        if("A2,D2,A4,C4,E4,A5,A7,E7,A8,E8,A9,A11,A13,C13".indexOf(cell) > -1){
          workBook.Sheets[sheetName][cell].s = {
            fill: { patternType: 'solid', fgColor: { rgb: "EFF5FC" }}
            , alignment: {horizontal: "center", vertical: "center"}
            , border: {
              right: { style: 'thin', color: { rgb: borderColor }}
              , left: {style: 'thin',color: { rgb: borderColor }}
              , top: {style: 'thin', color: { rgb: borderColor }}
              , bottom: {style: 'thin', color: { rgb: borderColor }}
            }
          }
        }else if("A3,A6,A12".indexOf(cell)<=-1){
          workBook.Sheets[sheetName][cell].s = {
            alignment: {horizontal: "left", vertical: "top", wrapText: true}
            , border: {
              right: { style: 'thin', color: { rgb: borderColor }}
              , left: {style: 'thin',color: { rgb: borderColor }}
              , top: {style: 'thin', color: { rgb: borderColor }}
              , bottom: {style: 'thin', color: { rgb: borderColor }}
            }
          }
        }
      }
      
      XLSX.writeFile(workBook, '종합민원_이송_접수.xlsx');
    },

    closePop() {
      window.close();
    },
  },
  async mounted() {
    // 공통코드
    let codeName = ["VOC_CALL_TP", "VOC_CALL_01", "VOC_CALL_02", "VOC_CALL_03", "VOC_CALL_04", "VOC_CALL_99"];
    this.list_common_code = await this.mixin_common_code_get_all(codeName);
    this.DROP_VOC_CALL_TP = this.mixin_common_code_get(this.list_common_code, 'VOC_CALL_TP', '선택');
    this.VOC_CALL_LIST.VOC_CALL_01 = this.mixin_common_code_get(this.list_common_code, 'VOC_CALL_01', '선택');
    this.VOC_CALL_LIST.VOC_CALL_02 = this.mixin_common_code_get(this.list_common_code, 'VOC_CALL_02', '선택');
    this.VOC_CALL_LIST.VOC_CALL_03 = this.mixin_common_code_get(this.list_common_code, 'VOC_CALL_03', '선택');
    this.VOC_CALL_LIST.VOC_CALL_04 = this.mixin_common_code_get(this.list_common_code, 'VOC_CALL_04', '선택');
    this.VOC_CALL_LIST.VOC_CALL_99 = this.mixin_common_code_get(this.list_common_code, 'VOC_CALL_99', '선택');

    if(!this.mixin_isEmpty(this.popData.PHN_CVLCPT_ID)){
      this.PHN_CVLCPT_DATA.PHN_CVLCPT_ID = this.popData.PHN_CVLCPT_ID;

      // 종합민원 이송 상세정보 조회
      this.selectPhnCvlcptData();
    }else{
      // 신규 접수
      // console.log(this.computedUserDeptId)
      this.PHN_CVLCPT_DATA.REG_CUSTCO_ID = this.computedUserCenter;
      // this.PHN_CVLCPT_DATA.REG_CUSTCO_ID = this.computedUserDeptId; // CUSTCO_ID : -1 중복으로 DEPT_ID로 변경
      this.PHN_CVLCPT_DATA.REG_CUSTCO_NM = this.computedUserCenterDeptNm;
      this.PHN_CVLCPT_DATA.RGTR_ID = this.$store.getters['userStore/GE_USER_ROLE'].userId;
      this.PHN_CVLCPT_DATA.RGTR_NM = this.$store.getters['userStore/GE_USER_ROLE'].userName;
      this.PHN_CVLCPT_DATA.REG_DT = this.$moment().format("YYYY-MM-DD HH:mm:ss");
    }
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