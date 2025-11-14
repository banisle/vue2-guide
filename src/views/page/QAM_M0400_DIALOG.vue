<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            그룹
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              v-model="searchParams.CENTER"
              :items="DROP_CENTER_LIST"
              placeholder="선택"
              @change="changeCenter"
              return-object
              disabled
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            소속
          </span>
          <div class="pl-desc">
            <v-select
              multiple
              class="pl-form type-middle"
              placeholder="전체"
              :items="DROP_DEPT_LIST"
              v-model="searchParams.DEPT_ID"
              @change="changeDept"/>
          </div>
        </div>
        <div class="pl-form-inline">
          <v-checkbox
              v-for="(chk, index) in chkTypes"
              v-model="srchEvalTrgrIsALL"
              :key="index"
              :label="chk.text"
              item-value="chk.value"
              class="pl-check "
          ></v-checkbox>
        </div>
        <div >
          <v-btn
            class="pl-btn is-icon flex-grow-0"
            @click="selectQaTargetList"
            >
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="clickResetIcon"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>
    <!-- grid -->
    <div class="pl-cols is-border-sub-top mt-3">
      <div class="is-col-fix" style="width: 55%;">
        <div class="pl-grid-top pt-2">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <div>
                <strong class="pl-bullet-txt is-blue">대상자/선택 수</strong>
                <em class="pl-1 is-txt-blue">({{ qaTgtList.length }} / {{ checkedTgtList.length }})</em>
              </div>
              <div>
                <strong class="pl-bullet-txt is-green">매칭 수</strong>
                <em class="pl-1 is-txt-blue">{{ matchCnt }}</em>
              </div>
            </div>
          </div>
        </div>
        <v-data-table
          class="pl-grid is-mt-s has-control"
          :headers="gridheaders1"
          :items="qaTgtList"
          v-model="checkedTgtList"
          show-select
          fixed-header
          item-key="ROW_NUM"
          height="360px"
          disable-pagination
          hide-default-footer
          :loading="loading"
          loading-text="조회중입니다."
          no-data-text="등록된 데이터가 없습니다."
          >
          <template v-slot:item.EVL_TRGT_YN="{ item }">
            {{ item.EVL_TRGT_YN == "Y" ? "대상" : "미대상" }}
          </template>
          <template v-slot:item.TGT_EMP_NM="{ item }">
            <img :src="item.IMG" :alt="item.TGT_EMP_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
            <strong class="ml-1">{{ item.TGT_EMP_NM }}</strong>
          </template>
        </v-data-table>
      </div>
      <div class="ml-6">
        <div class="pl-grid-top pt-2">
          <div class="pl-form-inline-wrap flex-grow-1">
            <div class="pl-form-inline flex-grow-1">
              <div class="pl-label">
                <strong class="pl-bullet-txt is-blue">배정인원 입력 </strong>
              </div>
              <div class="pl-desc">
                <v-select
                  v-model="divParams.DIV_TYPE"
                  :items="DROP_DIV_TYPE"
                  class="pl-form type-middle is-sm"
                  @change="changeDivType"
                ></v-select>
                <v-text-field
                  class="pl-form type-middle is-xss flex-grow-0"
                  v-model="divParams.DIV_CNT"
                  :disabled="!isDivCnt"
                  oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                  maxlength="5"
                />
                <v-btn class="pl-btn is-esp" @click="clickSetTargtCnt">입력</v-btn>
                <v-checkbox
                  class="pl-check"
                  label="삭제 후 재분배"
                  v-model="divParams.DIV_CLEAR"
                ></v-checkbox>
                <div class="ml-auto pl-btn-wrap">
                  <v-btn class="pl-btn is-esp ml-auto" @click="clickResetBtn">초기화</v-btn>
                  <v-btn class="pl-btn is-esp" @click="clickMatchBtn">일괄 배정</v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
        <v-data-table
          class="pl-grid is-mt-s"
          :headers="gridheaders2"
          :items="qaPlanMngrList"
          fixed-header
          item-key="ROW_NUM"
          height="360px"
          disable-pagination
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다."
          >
          <template v-slot:item.TGT_EMP_CNT="{ item }">
             <v-text-field
              v-model="item.TGT_EMP_CNT"
              oninput="this.value=this.value.replace(/[^0-9]/g,'')"
              class="pl-form text-center"
             ></v-text-field>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'QAM_M0400_DIALOG', //평가대상자 일괄 배정
  components: {
  },
  props: {
    propsQaPlanData:{
      type: Object,
      default: () => {},
    },
    propsQaMngrList:{
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      gridheaders1: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '55px',sortable: true },
        { text: '그룹', value: 'UP_DEPT_NM', align: '', width: '100px',sortable: true },
        { text: '소속', value: 'DEPT_NM', align: '', width: '100px',sortable: true },
        { text: '성명', value: 'TGT_EMP_NM', align: '', width: '90px', sortable: true },
        { text: '상담품질평가', value: 'EVL_TRGT_YN', align: 'center', width: '90px',sortable: true },
        { text: '근무일수', value: 'WORK_DT', align: 'right', width: '90px', sortable: true },
        { text: '평가자 매칭', value: 'MGR_EMP_NM', align: '', width: '85px', sortable: true },
      ],
      
      gridheaders2: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '55px',sortable: true },
        { text: '그룹', value: 'UP_DEPT_NM', align: '', width: '',sortable: true },
        { text: '소속', value: 'DEPT_NM', align: '', width: '25%',sortable: true },
        { text: '평가자', value: 'MGR_EMP_NM', align: '', width: '20%', sortable: true },
        { text: '배정 인원', value: 'TGT_EMP_CNT', align: '', width: '15%', sortable: true },
      ],

      DROP_DIV_TYPE: [
        {text:"균등배정", value:"A"}
        , {text:"일괄배정", value:"I"}
      ],

      // 평가정보
      qaPlanData:{},

      // 평가대상자 목록
      allTgtList:[],
      qaTgtList:[],
      checkedTgtList:[],

      loading: false,

      // 평가자 목록
      qaPlanMngrList:[],
      checkedMngrList:[],
      matchCnt: 0,

      // 사용자 조회 조건
      searchParams:{
        CENTER:{},
        DEPT_ID: [],
      },

      // 배정 조건
      divParams:{
        DIV_TYPE: "A"
        , DIV_CNT:""
        , DIV_CLEAR: false,
      },

      // 일괄배정인 경우
      isDivCnt: false,

      // 소속 전체선택 여부
      isAllCheck: false,

      common_ognz_list: [],
      DROP_CENTER_LIST: [],
      DROP_DEPT_LIST:[],
      
      // 근무일수 미달 
      srchEvalTrgrIsALL: false,
      chkTypes: [
        {text: "근무일수 미달 포함",value : 'ALL', selected: false,},
      ],

      MESSAGE: {
        CONFIRM: {
          SAVE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '저장하시겠습니까?', callYes: this.insertQaPlanTgt, callNo: this.closeAlert, },
        },
        ALERT:{
          MATCH_FAIL:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '모든 평가자의 배정 인원을 입력해주세요.' },
          SET_CNT_FAIL:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '인원수를 입력해주세요.' },
        },
        TOAST : {
          SAVE_DONE : {  msg: '평가대상자가 추가되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {

    async selectQaTargetList(){
      // 초기화
      this.checkedTgtList = [];
      this.selectedPlan = {};

      // let sUrl = '/phone-api/qa/selectQaTargetList';
      let sUrl = '/api/biz/common/select/selectQaTargetList';

      let postParam = {
        CENTER_ID: this.qaPlanData.CENTER_ID
        , STD_MT: this.qaPlanData.STD_MT.replaceAll("-","")
        , STD_MT_ORD: this.qaPlanData.STD_MT_ORD
        , PAPER_ID: this.qaPlanData.PAPER_ID
        , YR: this.qaPlanData.STD_MT.substr(0, 4)
        , MM: this.qaPlanData.STD_MT.substr(4, 5)
        , TRGT_IS_ALL: this.srchEvalTrgrIsALL?'Y':'N'
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlPlanManageMapper'
        , sn : 'selectQaTargetList'
      }};

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        // 전체 평가대상자 원본
        this.allTgtList = response.DATA.map(row=>{
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');
          return row;
        });

        // 그리드에 표시할 목록
        this.qaTgtList = response.DATA;

        // 평가자가 매칭된 경우 선택 처리
        this.checkedTgtList = this.qaTgtList.filter(row=>{return !this.mixin_isEmpty(row.MGR_EMP_NO)});

        // 매칭 수
        this.matchCnt = this.checkedTgtList.length;

        // 소속 필터링
        this.changeDept();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading = false;
    },

    // 저장 버튼 클릭 
    clickSaveBtn(){
      if(this.propsQaPlanData.PROC_STAT == "CLOSED"){
        this.showAlertInfo({msg:"평가 계획이 마감되었습니다."});
        return;
      }
      
      let addTgtList = this.checkedTgtList.filter(row=>{return row.MGR_EMP_NO != ""});

      if(addTgtList.length <= 0) {
        this.showAlertInfo({msg:"매칭된 평가 대상자가 없습니다."});
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.SAVE);
    },

    // 평가대상자 저장
    async insertQaPlanTgt(){
      this.closeAlert();

      let addTgtList = this.checkedTgtList.filter(row=>{return row.MGR_EMP_NO != ""});

      let sUrl = '/phone-api/qa/insertQaPlanTgt';
      // let sUrl = '/api/biz/common/select/insertQaPlanTgt';

      let postParam = {
        CENTER_ID: this.qaPlanData.CENTER_ID
        , STD_MT: this.qaPlanData.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.qaPlanData.STD_MT_ORD
        , PAPER_ID: this.qaPlanData.PAPER_ID
        , mngrList: this.qaPlanMngrList.map(row=>{return {MGR_EMP_NO: row.MGR_EMP_NO}})
        , addTgtList: addTgtList.map(row=>{return {TGT_EMP_NO: row.TGT_EMP_NO, MGR_EMP_NO: row.MGR_EMP_NO}})
        , USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID
        , CLEAR_YN: this.divParams.DIV_CLEAR ? "Y" : "N"
      };

      let headParam = { head : {
        DATA_OBJECT: "addTgtList,mngrList"
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.$emit("select", "");
        this.showToast(this.MESSAGE.TOAST.SAVE_DONE);
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

    },

    // 입력 버튼 클릭 이벤트
    clickSetTargtCnt(){
      if(this.divParams.DIV_TYPE == "A"){ // 균등배분
        let checkCnt = this.checkedTgtList.length;

        let calc = Math.floor(checkCnt/this.qaPlanMngrList.length);
        let rest = checkCnt - (calc * this.qaPlanMngrList.length);

        this.qaPlanMngrList.forEach((item, index)=>{
          if(rest > index){
            item.TGT_EMP_CNT = calc + 1;
          }else{
            item.TGT_EMP_CNT = calc;
          }
        });
      }else{  // 일괄입력
        if(this.mixin_isEmpty(this.divParams.DIV_CNT)){
          this.showAlert(this.MESSAGE.ALERT.SET_CNT_FAIL);
          return ;
        }

        this.qaPlanMngrList.forEach(row=>{
          row.TGT_EMP_CNT = this.divParams.DIV_CNT;
        });
      }
    },

    // 일괄배정 버튼
    clickMatchBtn(){

      if(this.checkedTgtList.length <= 0){
        this.showAlertInfo({msg:"평가대상자를 선택해주세요."});
        return;
      }

      if(this.qaPlanMngrList.filter(row=>{return row.TGT_EMP_CNT == ""}).length > 0 ){
        this.showAlert(this.MESSAGE.ALERT.MATCH_FAIL);
        return;
      }

      this.matchTgtMgrList();

      // ASIS 일괄배정
      // if(this.divParams.DIV_CLEAR){
      //   // 삭제 후 재분배 체크 시
      //   this.qaTgtList.forEach(row=>{ 
      //     row.MGR_EMP_NO = "";
      //     row.MGR_EMP_NM = "";
      //   });
      // }

      // let mngrList = this.qaPlanMngrList.filter(()=>{return true});

      // this.checkedTgtList.forEach((item)=>{
      //   if(item.MGR_EMP_NO == ""){
      //     let mngr;

      //     while(mngrList.length > 0){
      //       mngr = _.sample(mngrList);
      //       let mngrEmpCnt = this.checkedTgtList.filter(row=>{return row.MGR_EMP_NO == mngr.MGR_EMP_NO}).length;
            
      //       if(mngr.TGT_EMP_CNT > mngrEmpCnt){
      //         item.MGR_EMP_NO = mngr.MGR_EMP_NO;
      //         item.MGR_EMP_NM = mngr.MGR_EMP_NM;
      //         break;
      //       } else{
      //         mngrList = mngrList.filter(row=>{return row.MGR_EMP_NO != mngr.MGR_EMP_NO});
      //       }
      //     }
      //   }
      // });
    },

    // 일괄배정
    async matchTgtMgrList(){
      this.closeAlert();

      let chkTgtList = this.checkedTgtList.map(row=>{
        return { TGT_EMP_NO: row.TGT_EMP_NO
            , TGT_EMP_NM: row.TGT_EMP_NM
            , MGR_EMP_NO: row.MGR_EMP_NO
            , MGR_EMP_NM: row.MGR_EMP_NM
      }});

      if(this.divParams.DIV_CLEAR){
        // 삭제 후 재분배 체크 시
        chkTgtList.map(row=>{ 
          row.MGR_EMP_NO = "";
          row.MGR_EMP_NM = "";
          return row;
        });
      }

      let sUrl = '/phone-api/qa/matchTgtMgrList';
      // let sUrl = '/api/biz/common/select/matchTgtMgrList';

      let postParam = {
        CENTER_ID: this.qaPlanData.CENTER_ID
        , STD_MT: this.qaPlanData.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.qaPlanData.STD_MT_ORD
        , PAPER_ID: this.qaPlanData.PAPER_ID
        , mgrList: this.qaPlanMngrList.map(row=>{return {MGR_EMP_NO: row.MGR_EMP_NO, MGR_EMP_NM: row.MGR_EMP_NM, TGT_EMP_CNT: row.TGT_EMP_CNT}})
        , chkTgtList: chkTgtList
        , USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID
        , CLEAR_YN: this.divParams.DIV_CLEAR ? "Y" : "N"
      };

      let headParam = { head : {
        DATA_OBJECT: "chkTgtList,mgrList"
      }};
      
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      
      if(!response.HEADER.ERROR_FLAG) {
        let mapList = response.DATA;
        
        // 평가자 매칭 정보 초기화
        this.checkedTgtList = this.checkedTgtList.map(row=>{
          row.MGR_EMP_NO = "";
          row.MGR_EMP_NM = "";
          return row;
        });

        if(mapList.length > 0){
          for(let i=0; i<this.checkedTgtList.length; i++){
            let temp = mapList.filter(row=>{return this.checkedTgtList[i].TGT_EMP_NO == row.TGT_EMP_NO});
            if(temp.length > 0) {
              this.checkedTgtList[i].MGR_EMP_NO = temp[0].MGR_EMP_NO;
              this.checkedTgtList[i].MGR_EMP_NM = temp[0].MGR_EMP_NM;
            }
          }

          this.checkedTgtList = this.checkedTgtList.filter(row=>{return !this.mixin_isEmpty(row.MGR_EMP_NO)});
        }
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    //그룹(센터) 변경 이벤트
    changeCenter(){
      this.DROP_DEPT_LIST = this.mixin_ognz_list_detail(this.common_ognz_list, this.searchParams.CENTER.DEPT_ID, "" );
      this.DROP_DEPT_LIST.unshift({value:"ALL_CHECK", text:"전체"});
      this.searchParams.DEPT_ID = [];
    },

    // 소속 변경 이벤트
    changeDept(){
      this.checkDeptList();

      this.$nextTick(() => {
        if(this.searchParams.DEPT_ID.length > 0){
          this.qaTgtList = this.allTgtList.filter(row=>{return this.searchParams.DEPT_ID.indexOf(row.DEPT_ID) >= 0});
        }else{
          this.qaTgtList = this.allTgtList.filter(()=>{return true});
        }
      });
    },

    // 전체 선택 처리
    checkDeptList(){
      let isCheck = this.searchParams.DEPT_ID.includes("ALL_CHECK");
      
      if(!this.isAllCheck && isCheck){
        this.isAllCheck = true;
        this.searchParams.DEPT_ID = this.DROP_DEPT_LIST.map(row=>{ return row.value});
      }else if(this.isAllCheck && !isCheck){
        this.isAllCheck = false;
        this.searchParams.DEPT_ID = [];
      }else if(this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"}).length == this.DROP_DEPT_LIST.filter(row=>{return row.value != "ALL_CHECK"}).length){
        this.isAllCheck = true;
        this.searchParams.DEPT_ID = this.DROP_DEPT_LIST.map(row=>{ return row.value});
      }else if(this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"}).length != this.DROP_DEPT_LIST.filter(row=>{return row.value != "ALL_CHECK"}).length){
        this.isAllCheck = false;
        this.searchParams.DEPT_ID = this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"});
      }
    },

    // 배정 방법 변경 이벤트
    changeDivType(){
      if(this.divParams.DIV_TYPE == "A"){
        this.isDivCnt = false;
        this.divParams.DIV_CNT = "";
      }else{
        this.isDivCnt = true;
      }
    },

    // 초기화 버튼
    clickResetBtn(){
      this.showConfirmCaution({
        msg: "평가 대상자 배정 정보를 초기화 하시겠습니까?<br>"
          + "(평가 결과가 존재하는 대상자는 제외됩니다.)"
        , callYes: ()=>{
          this.closeAlert();
          this.resetTgtMatchData();
        }
        , callNo: ()=>{
          this.closeAlert();
        }
      })
    },

    async resetTgtMatchData(){
      let sUrl = '/phone-api/qa/resetTgtMatchData';
      // let sUrl = '/api/biz/common/delete/resetTgtMatchData';

      let postParam = {
        CENTER_ID: this.qaPlanData.CENTER_ID
        , STD_MT: this.qaPlanData.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.qaPlanData.STD_MT_ORD
        , PAPER_ID: this.qaPlanData.PAPER_ID
        , USER_ID: this.$store.getters['userStore/GE_USER_ROLE'].USER_ID
      };

      let headParam = { head : {}};

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      
      if(!response.HEADER.ERROR_FLAG) {
        this.showToastSuccess({msg : '정상 처리되었습니다.'});
        this.$emit("select", "");
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 리셋 아이콘 클릭 이벤트
    clickResetIcon(){
      this.searchParams.DEPT_ID = [];
      this.srchEvalTrgrIsALL = false;
      this.changeDept();
      this.selectQaTargetList();
    },

    initData(){
      this.allTgtList = [];
      this.qaTgtList = [];
      this.checkedTgtList = [];

      this.qaPlanMngrList = [];
      this.checkedMngrList = [];

      this.matchCnt = 0;

      this.searchParams.DEPT_ID = [];
      this.divParams.DIV_TYPE = "A";
      this.divParams.DIV_CNT = "";
      this.divParams.DIV_CLEAR = false;
      
      this.isDivCnt = false;
    },

    setQaPlanData(obj, list){

      this.initData();

      this.qaPlanData = JSON.parse(JSON.stringify(obj));
      
      if(!this.mixin_isEmpty(list)){
        for(let i=0; i<list.length; i++){
          this.qaPlanMngrList[i] = JSON.parse(JSON.stringify(list[i]));
        }
      }

      // 평가자 목록 셋팅
      this.setQaPlanMngrList(list);
      
      // 그룹/센터 선택처리
      let temp = this.DROP_CENTER_LIST.filter(row=>{return row.CUSTCO_ID == this.qaPlanData.CENTER_ID});
      if(temp.length > 0) this.searchParams.CENTER = temp[0];
      this.changeCenter();

      // 평가대상자 조회
      this.selectQaTargetList();
    },

    // 평가자 목록 셋팅(복사)
    setQaPlanMngrList(list){
      if(!this.mixin_isEmpty(list)){
        for(let i=0; i<list.length; i++){
          this.qaPlanMngrList[i] = JSON.parse(JSON.stringify(list[i]));
        }
      }
    },
  },
  async mounted() {

    this.checkedTgtList = [];
    this.checkedMngrList = [];

    //조직
    this.common_ognz_list = await this.mixin_ognz_list();
    this.DROP_CENTER_LIST = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '전체' );

    this.setQaPlanData(this.propsQaPlanData, this.propsQaMngrList);
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