<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            응시 여부
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="선택"
              v-model="searchParams.PROC_YN"
              :items="mixin_common_code_get(this.allCodeList, 'EXAMIN_WT', '전체')"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            성명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle"
              placeholder="성명 입력" 
              v-model="searchParams.SRCH_USER_NM"
              @keyup.enter="changeSearchParams"              
              />
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0"  @click="clickSearchBtn()">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="searchParamsReset()"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>
    <div class="is-border-top pt-3 mt-3">
      <div class="pl-grid-top">
        <div class="pl-grid-top-left">
          <strong class="pl-bullet-txt is-blue">평가 정보</strong>
        </div>
      </div>
      <table class="pl-tbl-detail">
        <colgroup>
          <col width="110px" />
          <col width="90px" />
          <col width="" />
          <col width="130px" />
          <col width="130px" />
          <col width="90px" />
          <col width="90px" />
          <col width="90px" />
          <col width="90px" />
        </colgroup>
        <thead>
          <th scope="col">센터</th>
          <th scope="col">평가 종류</th>
          <th scope="col">평가 제목</th>
          <th scope="col">평가 시작일</th>
          <th scope="col">평가 종료일</th>
          <th scope="col">평가시간</th>
          <th scope="col">문제 수</th>
          <th scope="col">대상자</th>
          <th scope="col">응시현황</th>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">{{this.qstnPlanResultInfoData[0].CENTER_NM}}</td>
            <td class="text-center">{{this.qstnPlanResultInfoData[0].EVAL_MNG_NM}}</td>
            <td class="text-center">{{this.qstnPlanResultInfoData[0].EVAL_TITLE}}</td>
            <td class="text-center">{{this.qstnPlanResultInfoData[0].EVAL_ST_DD}}</td>
            <td class="text-center">{{this.qstnPlanResultInfoData[0].EVAL_EN_DD}}</td>
            <td class="text-center">{{this.qstnPlanResultInfoData[0].EVAL_TIME}}분</td>
            <td class="text-center">{{this.qstnPlanResultInfoData[0].QSTN_CNT}}</td>
            <td class="text-center">{{this.qstnPlanResultInfoData[0].TOT_CUST}}</td>
            <td class="text-center">{{this.qstnPlanResultInfoData[0].PROC_CUST}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 응시자 정보 -->
    <div class="pl-grid-top is-mt-m">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">응시자 정보</strong>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qstnPlanResultCustListData.length }})</em> 건</span>
        <!-- 엑셀 다운로드 버튼 -->
        <compo-tooltip-btn
          TitleProp="엑셀 다운로드"
          ClassProp="pl-tooltip-btn "
          IconProp="pl-icon20 exceldown"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('엑셀 다운로드')"
        ></compo-tooltip-btn>
      </div>
    </div>
    <v-data-table
      class="pl-grid is-mt-s has-control"
      :headers="headers"
      :items="qstnPlanResultCustListData"      
      fixed-header
      item-key="index"
      height="390px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      >

      <!-- 대상자 -->
      <template v-slot:item.EVAL_EMP_NM="{ item }">
          <img
              :src="item.IMG"
              :alt="item.EVAL_EMP_NM"
              class="pl-grid-portrait"
              style="width: 20px; height: 20px"
              @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}"
          />
          <span class="ml-1">{{ item.EVAL_EMP_NM }}</span>
      </template>
      <!-- 응시 여부 -->
      <template v-slot:item.PROC_YN="{ item }">
        <span
          :class="`is-txt-${mixin_displayStatus(item.PROC_YN, 'STAT_LIST')}`"
          >{{ item.PROC_YN_NM }}</span>
      </template>

      <!-- 제출 답안 -->
      <template v-slot:item.type09="{ item }">
        <v-btn
          @click="showUserDetail({item})"
          class="pl-btn is-sm is-esp">보기</v-btn>
      </template>

    </v-data-table>
    <!-- dialog:평가 응시 현황 상세 -->
    <v-dialog
      v-model="dialogReplyDetail"
      v-if="dialogReplyDetail"
      content-class="dialog-draggable"
      width="1080"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="응시자 제출 답안"
        @hide="mixin_hideDialog('ReplyDetail')"
        @submit="submitDialog('ReplyDetail')"
      >
        <template slot="body">
          <QTM_M0300_REPLY 
          ref="QTM_M0300_REPLY"
          :propsQstnEvalData="qstnEvalData"
          @Close="dialogReplyDetail = false"
          @Select="selectEvalPlanResultCustList"
          />
        </template>
      </compo-dialog>
    </v-dialog>


  </div>
</template>

<script>
import QTM_M0300_REPLY from '@/views/page/QTM_M0300_REPLY'

export default {
  name: 'QTM_M0300_DETAIL', //평가 응시현황 상세
  components: {
    QTM_M0300_REPLY
  },
  props: {    
    propsQstnPlanResultData:{
      type: Object,
      default: () => {},
    }    
  },  
  data() {
    return {
      // search
      modelCenter: '경기북부지역본부',
      dropItems: ['경기북부지역본부'],

      // 공통코드
      allCodeList: [],

      ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      // ROW_PER_PAGE: 14, //페이징 없이 전체 화면 뿌릴때

      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '성명', value: 'EVAL_EMP_NM', align: ' font-weight-bold', width: '80px', sortable: false },
        { text: '사번', value: 'EVAL_EMP_NO', align: '', width: '9%',sortable: false },
        { text: '소속', value: 'EVAL_DEPT_NM', align: '', width: '9%',sortable: true },
        { text: '직무', value: 'DUTY_GROUP_NM', align: '', width: '9%',sortable: false },
        { text: '응시 여부', value: 'PROC_YN_NM', align: 'center', width: '9%',sortable: false },
        { text: '평가 동의 일시', value: 'LAST_AGREE_DT', align: 'center', width: '15%',sortable: false },
        { text: '답안 제출 일시', value: 'PROC_DT', align: 'center', width: '15%',sortable: false },
        { text: '점수', value: 'EVAL_SCORE', align: 'center font-weight-bold', width: '8%',sortable: false },
        { text: '제출 답안', value: 'type09', align: 'center', width: '8%',sortable: false },
      ],
      items: [       
      ],
      STAT_LIST: [
        { code: 'N', value: 'org'},
        { code: 'Y', value: ''},
      ],

      STAT_LIST_: [
        { value: 'N', TEXT: '미응시'},
        { value: 'Y', TEXT: '응시완료'},
      ],

      searchParams:{
        PROC_YN:"",
        EVAL_ID:"",    
        SRCH_USER_NM:"",            
      },

      // dialog
      dialogReplyDetail: false,

      qstnEvalData: {},

      qstnPlanResultData: {},
      qstnPlanResultInfoData: {},
      qstnPlanResultCustListData: [],
    }
  },
  methods: {

    searchParamsReset(){
      this.searchParams.PROC_YN = '';
      this.searchParams.SRCH_USER_NM = '';      
    },

    // 조회버튼 클릭
    clickSearchBtn(){
      this.selectEvalPlanResultCustList();
    },

    // 조회 조건 변경 재조회
    changeSearchParams(){
      this.selectEvalPlanResultCustList();
    },

    // 기본 정보 가져오기 
    async selectEvalPlanResultInfo(){
      this.qstnPlanResultInfoData= [];      
      let sUrl = '/phone-api/qt/selectEvalPlanResultInfo';
      let postParam = {        
        CENTER_ID : this.searchParams.CENTER_ID,    
        EVAL_ID: this.qstnPlanResultData.EVAL_ID,           
      };      
      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.qstnPlanResultInfoData = response.DATA;   
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }      

    },

    // 평가 응시 대상자  정보 가져오기 
    async selectEvalPlanResultCustList(){
      this.qstnPlanResultCustListData= [];      
      let sUrl = '/phone-api/qt/selectEvalPlanResultCustList';
      let postParam = {        
        CENTER_ID : this.qstnPlanResultData.CENTER_ID,    
        EVAL_ID: this.qstnPlanResultData.EVAL_ID,   
        SRCH_USER_NM: this.searchParams.SRCH_USER_NM,        
        PROC_YN: this.searchParams.PROC_YN
      };      
      let headParam = {};
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        //this.qstnPlanResultCustListData = response.DATA;   
        this.qstnPlanResultCustListData = response.DATA.map((row) => {
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

    // 평가 대상 사용자  
    showUserDetail({item}){
      this.qstnEvalData = {
        CENTER_ID : item.CENTER_ID
        , EVAL_ID : item.EVAL_ID       
        , EVAL_EMP_NO : item.EVAL_EMP_NO     
        , EVAL_SCORE: item.EVAL_SCORE
        , EVAL_TITLE: this.qstnPlanResultInfoData[0].EVAL_TITLE 
        , EVAL_MNG_NM: this.qstnPlanResultInfoData[0].EVAL_MNG_NM   
        , QSTN_CNT: this.qstnPlanResultInfoData[0].QSTN_CNT
        , LAST_AGREE_DT: item.LAST_AGREE_DT
        , PROC_DT: item.PROC_DT
        , EVAL_ST_DD : this.qstnPlanResultInfoData[0].EVAL_ST_DD
      }; 
      this.mixin_showDialog('ReplyDetail');            
    },

  },
  async mounted() {

    this.qstnPlanResultData = JSON.parse(JSON.stringify(this.propsQstnPlanResultData));

    let codeList = ['EXAMIN_WT'];   
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    this.selectEvalPlanResultInfo();

    this.selectEvalPlanResultCustList();

  },
  created() {
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>