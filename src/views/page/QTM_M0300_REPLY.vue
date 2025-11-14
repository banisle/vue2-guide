<template>
  <div>
    <div class="d-flex" style="position: relative;">
      <div style="flex: 0 0 40px">
        <!-- img :src="MANAGER_PROFILE.img" :alt="MANAGER_PROFILE.name" style="width: 100%" -->
        <img :src="USER_PROFILE[0].IMG" :alt="USER_PROFILE[0].USER_NM" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
         style="width: 100%; max-height: 60px; border-radius: 50%;" />

        <!--img :src="testResultDataInfo.IMG" :alt="testResultDataInfo[0].EVAL_EMP_NM" style="width: 100%"-->
      </div>

      <div class="ml-4">
        <div >
          <strong style="font-size: 14px">{{ USER_PROFILE[0].CENTER_NM }}</strong>
          <span class="ml-2 is-txt-sub">{{ USER_PROFILE[0].DEPT_NM }}</span></div>
        <div class="spacing-wrap sp-16">
            <strong>사번</strong>
            <span class="ml-2">{{USER_PROFILE[0].USER_ID }}</span>
            <strong>직무</strong>
            <span class="ml-2">{{USER_PROFILE[0].DUTY_GROUP_NM }}</span>
            <strong>직급</strong>
            <span class="ml-2">{{USER_PROFILE[0].JBPS_CD_NM }}</span><!-- -->
            <strong>응시자</strong>
            <span class="ml-2">{{USER_PROFILE[0].USER_NM }}</span>
            <!--
            <strong>근무형태</strong>
            <span class="ml-2">{{USER_PROFILE[0].WORK_TYPE_CD_NM }}</span>-->

          <!-- div v-for="item in MANAGER_PROFILE.subdata" :key="item.id">
            <strong>{{ item.key }}</strong>
            <span class="ml-2">{{ item.value }}</span>
          </! -->
        </div>
       
      </div>
    </div>
    <!-- search form -->
    <div class="is-mt-m">
      <table class="pl-tbl-detail">
        <colgroup>
          <col width="80px" />
          <col width="" />
          <col width="130px" />
          <col width="130px" />
          <col width="80px" />
          <col width="80px" />
          <col width="80px" />
        </colgroup>
        <thead>
          <th scope="col" class="px-0">평가 종류</th>
          <th scope="col" class="px-0">평가 제목</th>
          <th scope="col" class="px-0">평가 동의 일시</th>
          <th scope="col" class="px-0">답안 제출 일시</th>
          <th scope="col" class="px-0">맞은 문항 수</th>
          <th scope="col" class="px-0">틀린 문항 수</th>
          <th scope="col" class="px-0">총점</th>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">{{ this.qstnEvalData.EVAL_MNG_NM }}</td>
            <td class="text-center">{{ this.qstnEvalData.EVAL_TITLE }}</td>
            <td class="text-center">{{ this.qstnEvalData.LAST_AGREE_DT }}</td>
            <td class="text-center">{{ this.qstnEvalData.PROC_DT }}</td>
            <td class="text-center">{{ this.qstnEvalData.sucCnt }}</td>
            <td class="text-center">{{ this.qstnEvalData.failCnt }}</td>
            <td class="text-center font-weight-bold">{{ this.qstnEvalData.EVAL_SCORE }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 응시자 정보 -->
    <div class="pl-grid-top is-mt-m">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">응시자 답안 정보</strong>
      </div>
      <div class="pl-grid-top-utils">
        <v-btn class="pl-btn is-esp" @click="offProcFn"  v-if="( !this.EvalCustUserResult || this.EvalCustUserResult.length === 0 ) && isPastEvalStartDate">수기입력</v-btn>
        <v-btn class="pl-btn is-esp" @click="saveRe">저장</v-btn>
      </div>
    </div>
    <v-data-table
      class="pl-grid is-mt-s "
      :headers="headers"
      :items="EvalCustUserResult"
      v-model="editEvalCustUserResult"
      fixed-header
      item-key="ROW_NUM"
      height="330px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      >
      <!-- 정/오 -->
      <template v-slot:item.CRTANS_YN="{ item }">
        <v-select
          v-model="item.CRTANS_YN"
          class="pl-form"
          :items="dropItemsOX"
          placeholder="선택"
          @input="handleInputEvalQstnScore(item)"
          >
          <!-- 선택된 항목을 커스텀 -->
          <template v-slot:selection="{ item }">
            <v-icon :class="`pl-icon20 ${ item.icon }`">{{ item.icon }}</v-icon>
          </template>

          <!-- list -->
          <template v-slot:item = "{ item, on, attrs }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-icon :class="`pl-icon20 ${ item.icon }`">{{ item.icon }}</v-icon>
            </v-list-item>
          </template>

        </v-select>

      </template>

      <!-- 제출 답안 -->
      <template v-slot:item.ANSW="{ item }">

        <template v-if="offMode === 'true'">
          <td class="">
            <v-text-field
              v-model="item.ANSW"
              class="pl-form text-center"           
              @input="handleInputEvalAnswOff(item)"                 
            ></v-text-field>
          </td>
        </template>
        <template v-else>
          <td class="is-bg-light text-center font-weight-bold">{{ item.ANSW }}</td>          
        </template>
      </template>

    

      <!-- 점수      정/오 처리시 해당 항목  배점 or 0 처리  
      <template v-slot:item.EVAL_QSTN_SCORE="{ item }">
        <td class="">
          <v-text-field
            v-model="item.EVAL_QSTN_SCORE"
            class="pl-form text-center"
            @input="handleInputEvalQstnScore(item)"
            type="number"            
            oninput="this.value=this.value.replace(/[^0-9]/g,'')"
            :disabled="item.QSTN_TYPE === 'S'"
          ></v-text-field>
        </td>
      </template>-->

      <!-- 점수      정/오 처리시 해당 항목  배점 or 0 처리  -->
      <template v-slot:item.QSTN_TYPE="{ item }">
        <template v-if="item.QSTN_TYPE === 'S'">
          <td class="is-bg-light text-center font-weight-bold">{{ item.EVAL_QSTN_SCORE }}</td>
        </template>
        <template v-else>  
          <td class="">
            <v-text-field
              v-model="item.EVAL_QSTN_SCORE"
              class="pl-form text-center"
              @input="handleInputEvalQstnScore(item)"
              type="number"            
              oninput="this.value=this.value.replace(/[^0-9]/g,'')"            
            ></v-text-field>
          </td>
        </template>
      </template>

      <!-- 정답 -->
      <template v-slot:item.QSTN_ANSW="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.QSTN_ANSW }}</span>
          </template>
          <span>{{ item.QSTN_ANSW }}</span>
        </v-tooltip>
      </template>      

    </v-data-table>


  </div>
</template>

<script>
export default {
  name: 'QTM_M0300_REPLY', //응시자 제출 답안
  components: {
  },
  props: {
    propsQstnEvalData:{
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      // search
      modelCenter: '경기북부지역본부',
      dropItems: ['경기북부지역본부'],
      dropItemsOX: [
        { icon: 'test-circle', value: 'Y' },
        { icon: 'test-cross', value: 'N' },
      ],

      // 상담원 정보
      MANAGER_PROFILE: {
        name: '우성아',
        img: require('@/assets/img/@manager_profile2.png'),
        part: '마이홈센터 - 마이홈1팀',
        subdata: [
          { key: '사번', value: '800001'},
          { key: '직무', value: '인바운드'},
          { key: '직급', value: '6급'},
          { key: '근무형태', value: '풀타임'},
        ],
      },

      ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때

      headers: [
        { text: '문제 번호', value: 'EVAL_QSTN_SORT', align: 'center font-weight-bold', width: '80px', sortable: false },
        { text: '문제 형식', value: 'QSTN_TYPE_NM', align: 'center', width: '8%', sortable: false },
        { text: '답안 형식', value: 'ANSW_TYPE_NM', align: 'center', width: '8%',sortable: false },
        { text: '난이도', value: 'QSTN_LEVEL_NM', align: 'center', width: '8%',sortable: false },
        { text: '범주', value: 'EXAM_CATE_CD_NM', align: 'center', width: '',sortable: false },
        { text: '배점', value: 'QSTN_SCORE', align: 'center', width: '8%',sortable: false },
        { text: '정답', value: 'QSTN_ANSW', align: 'center', width: '18%',sortable: false },
        { text: '제출 답안', value: 'ANSW', align: 'center font-weight-bold ', width: '18%',sortable: false },
        { text: '정/오', value: 'CRTANS_YN', align: 'center font-weight-bold', width: '10%',sortable: false },
        { text: '점수', value: 'EVAL_QSTN_SCORE', align: 'center', width: '8%',sortable: false },
      ],
      items: [],
      STAT_LIST: [
        { code: '미응시', value: 'org'},
      ],

      qstnEvalData: {},
      USER_PROFILE: {},
      EvalCustUserResult: [],      
      editEvalCustUserResult: [],
      editedRowList: [],
      offMode : 'false',

      //알림창 메시지
      MESSAGE: {
        CONFIRM: {
          SAVE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '점수를 수정하시겠습니까?', callYes: this.saveFn, callNo: this.closeAlert, },
          ME_SAVE:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '수기로 정보를 입력하시겠습니까?<br> 입력후 수정이 불가능합니다. ', callYes: this.saveFn, callNo: this.closeAlert, },
          OFF_ME:{ alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '수기로 정보를 입력하시겠습니까?', callYes: this.offProc, callNo: this.closeAlert, },
        },
        ALERT:{          
          SAVE_FAIL01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '문항 배점보다 높게 수정 할 수 없습니다.' },    
          SAVE_FAIL02:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '점수를 입력 해주세요.' },   
          SAVE_FAIL03:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '수기 제출 답안을 입력 해주세요.' },     
          SAVE_FAIL04:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '수기 제출 답안과 정답 정보를 비교 해주세요.' },     
        },
        TOAST : {
          SAVE_DONE : {  msg: '수정 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },

    }
  },
  methods: {

    offProcFn(){
      this.showAlert(this.MESSAGE.CONFIRM.OFF_ME);
      
    },

    async offProc(){      

      this.closeAlert();
      
      this.EvalCustUserResult= [];      
      let sUrl = '/phone-api/qt/selectEvalCustUserOffLine';
      let postParam = {         
        CENTER_ID : this.qstnEvalData.CENTER_ID,           
        EVAL_ID: this.qstnEvalData.EVAL_ID,       
        EVAL_EMP_NO: this.qstnEvalData.EVAL_EMP_NO,  
      };      
      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.EvalCustUserResult = response.DATA;   
        this.offMode = 'true';
       
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);        
      }             

    },

    // 점수,정답 수정시 
    handleInputEvalQstnScore(item){      

      // 정답 여부에 따른 점수 처리
      if (item.CRTANS_YN === 'Y') {
        item.EVAL_QSTN_SCORE = item.QSTN_SCORE;
      } else {
        item.EVAL_QSTN_SCORE = 0;
      }

      const findRowIndex = this.editedRowList.findIndex(
          (rowItem) => rowItem.ANSW_SEQ_NO === item.ANSW_SEQ_NO,
      );      
      if (findRowIndex > -1) {
          this.$set(this.editedRowList, findRowIndex, item);
      } else {
          this.editedRowList.push(item);
      }
    },

    // 오프 정답처리 수정시 
    handleInputEvalAnswOff(item){      

      // 정답 여부에 따른 점수 처리
      if (item.CRTANS_YN === 'Y') {
        item.EVAL_QSTN_SCORE = item.QSTN_SCORE;
      } else {
        item.EVAL_QSTN_SCORE = 0;
      }

      const findRowIndex = this.editedRowList.findIndex(
          (rowItem) => rowItem.EVAL_QSTN_SORT === item.EVAL_QSTN_SORT,
      );      
      if (findRowIndex > -1) {
          this.$set(this.editedRowList, findRowIndex, item);
      } else {
          this.editedRowList.push(item);
      }
    },


    saveRe(){
      if(this.offMode ==='true'){
        for(let s in this.EvalCustUserResult){ 
          if(this.mixin_isEmpty(this.EvalCustUserResult[s].ANSW) ){            
            this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL03); 
            return;          
          }         

          if(this.EvalCustUserResult[s].QSTN_TYPE_NM === '객관식'){
            if (this.EvalCustUserResult[s].QSTN_ANSW != this.EvalCustUserResult[s].ANSW) {
              if (this.EvalCustUserResult[s].CRTANS_YN === 'Y') {
                this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL04); 
                return;                 
              }
            }
          }   
        }
        this.showAlert(this.MESSAGE.CONFIRM.ME_SAVE);
      }else{
        this.saveAct();
      }

    },
   
    
    // 점수,정답 수정시 체크 
    saveAct(){        
      
      for(let i in this.editedRowList){        

        if(this.editedRowList[i].EVAL_QSTN_SCORE.length === 0 ){
          this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL02); 
          return;          
        }
        
        if( parseInt(this.editedRowList[i].EVAL_QSTN_SCORE) > parseInt(this.editedRowList[i].QSTN_SCORE) ){          
          this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL01); 
          return;          
        }              

      }      
      this.showAlert(this.MESSAGE.CONFIRM.SAVE);      
    },

    // 점수,정답 수정시 저장 처리
    async saveFn(){

      let sUrl = '/phone-api/qt/updateEvalCustUserResultInfo';
     
      let postParam = {        
        CENTER_ID : this.qstnEvalData.CENTER_ID,    
        EVAL_ID: this.qstnEvalData.EVAL_ID,       
        EVAL_EMP_NO: this.qstnEvalData.EVAL_EMP_NO,  
        editedRowList : this.editedRowList
      };      

      if(this.offMode ==='true'){
        sUrl = '/phone-api/qt/offLineEvalCustUserResultInfo';
        postParam.editedRowList = this.EvalCustUserResult
      }
      let headParam = { head : {
        DATA_OBJECT: "editedRowList"
      }};
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.SAVE_DONE);

        // 목록 재조회
        this.$emit("Select");

        // 상세 팝업 닫기
        this.$emit("Close");

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

    },

    // 사용자 기본 정보 가져오기 
    async selectEvalCustUserInfo(){
      this.USER_PROFILE= {};      
      let sUrl = '/phone-api/qt/selectEvalCustUserInfo';
      let postParam = {        
        CENTER_ID : this.qstnEvalData.CENTER_ID,    
        EVAL_ID: this.qstnEvalData.EVAL_ID,       
        EVAL_EMP_NO: this.qstnEvalData.EVAL_EMP_NO,  
      };      
      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        //this.USER_PROFILE = response.DATA;           

        this.USER_PROFILE = response.DATA.map((row) => {
            if (row.ICON_IMG_URI !== "/")
                row.IMG = "/upload/" + row.ICON_IMG_URI;
            else
                row.IMG = require("@/assets/img/@manager_profile_default.png");
            return row;
        });  

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 사용자 답변 채점 상세 정보 가져오기 
    async selectEvalCustUserResultInfo(){
      this.EvalCustUserResult= [];      
      let sUrl = '/phone-api/qt/selectEvalCustUserResultInfo';
      let postParam = {         
        CENTER_ID : this.qstnEvalData.CENTER_ID,           
        EVAL_ID: this.qstnEvalData.EVAL_ID,       
        EVAL_EMP_NO: this.qstnEvalData.EVAL_EMP_NO,  
      };      
      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        //this.EvalCustUserResult = response.DATA;   

        this.EvalCustUserResult = response.DATA.map((row) => {
            if (row.ICON_IMG_URI !== "/")
                row.IMG = "/upload/" + row.ICON_IMG_URI;
            else
                row.IMG = require("@/assets/img/@manager_profile_default.png");
            return row;
        });

        //const filterArray = this.EvalCustUserResult.filter( (item) => item.EVAL_QSTN_SCORE == 0);
        //const sucCnt = this.qstnEvalData.QSTN_CNT - filterArray.length;         
        //this.qstnEvalData.sucCnt = sucCnt;        
        //this.qstnEvalData.failCnt = filterArray.length;

        this.qstnEvalData.sucCnt = this.EvalCustUserResult[0].OK_CNT;
        this.qstnEvalData.failCnt = this.qstnEvalData.QSTN_CNT - parseInt(this.qstnEvalData.sucCnt) ;

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    closeMsg(){
      this.$store.commit("alertStore/hideAlert");
    },

  },
  async mounted() {
    this.qstnEvalData = JSON.parse(JSON.stringify(this.propsQstnEvalData));

    this.selectEvalCustUserInfo();
    this.selectEvalCustUserResultInfo();
    this.editedRowList = [];
  },
  created() {
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
    isPastEvalStartDate() {
      const evalStartDate = new Date(this.qstnEvalData.EVAL_ST_DD);
      const currentDate = new Date();
      return currentDate > evalStartDate;
    },
  },
  watch: {
    EvalCustUserResult:function(val){
      //console.info('EvalCustUserResult  ::::  '+val);

    }
  },
};
</script>

<style lang="scss" scoped>

</style>
