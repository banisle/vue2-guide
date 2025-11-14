<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
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
            :DateProp.sync="searchParams.STD_MT"/>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          센터
        </span>
        <div class="pl-desc">
          <v-select
            v-model="searchParams.CENTER"
            :items="DROP_CENTER_LIST"
            class="pl-form type-middle"
            placeholder="선택"
            return-object
            @change="changeCenter"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          소속
        </span>
        <div class="pl-desc">
          <v-select
            multiple
            :items="DROP_DEPT_LIST"
            v-model="searchParams.DEPT_ID"
            class="pl-form type-middle"
            placeholder="전체"
            @change="changeDept"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          회차
        </span>
        <div class="pl-desc">
          <v-select
            v-model="searchParams.STD_MT_ORD"
            :items="DROP_STD_ORD_LIST"
            class="pl-form type-middle"
            placeholder="선택"
            no-data-text="결과 없음"
            @change="changeStdMtOrd"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          평가지
        </span>
        <div class="pl-desc">
          <v-select
            v-model="searchParams.PAPER_ID"
            :items="DROP_STD_PAPER_LIST"
            class="pl-form type-middle"
            placeholder="선택"
            no-data-text="결과 없음"
            style="width: 500px;"
            @change="changePaper"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          구분
        </span>
        <div class="pl-desc">
          <v-select
            v-model="searchParams.SEARCH_TYPE"
            :items="DROP_SEARCH_TYPE"
            class="pl-form type-middle"
            placeholder="선택"
            return-object
            @change="changeSearchType"
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
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <!-- grid top -->
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left spacing-wrap sp-16 ">
          <div class="spacing-wrap sp-8">
            <div>
              <strong class="pl-bullet-txt is-blue">
                <span class="is-txt-blue">({{searchParams.SEARCH_TYPE.text}})</span>
                <span class="ml-1">평가 결과 현황</span>
              </strong>
            </div>
          </div>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ gridDataText.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <CompoExceldownOpt 
            :RadioGroupProp="excelDownOptList" 
            ref="CompoExceldownOpt"
            @downloadSelected="(data)=>{excelDownOpt(data)}"
          />
          <!-- <CompoExceldownOpt :RadioGroupProp="excelDownOptList" ref="CompoExceldownOpt" v-if="SEARCH_TYPE == 'TGT_EMP_NO'"/> -->
          <!-- <compo-excel
            TypeProp="Download"
            :DataHeaderProp="gridDataHeaders"
            :DataBodyProp="gridDataText"
            :FileNameProp="fileName"
            SheetNameProp="QA보고서 상세결과"
            v-else
          /> -->
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-hover"
        :style="`${computedUserType !== 'ETC_ADMIN' ? 'max-width: calc(100vw - 405px);' : 'max-width: calc(100vw - 290px);'}`"
        :headers="gridDataHeaders"
        :items="gridDataText"
        ref="dataTable01"
        fixed-header
        item-key="ROW_NUM"
        height="calc(-360px + 100vh)"
        disable-pagination
        hide-default-header
        hide-default-footer
        :loading="loading"
        loading-text="조회중입니다."
        no-data-text="등록된 데이터가 없습니다.">
        <!-- header -->
        <template v-slot:header>
          <thead class="v-data-table-header multi-row">
            <tr>
              <!-- 회차별 -->
              <template v-if="searchParams.SEARCH_TYPE.value === 'STD_MT_ORD'">
                <th rowspan="2" width="50px" class="text-center"><span>번호</span></th>
                <th rowspan="2" width="70px" class="text-center"><span>회차</span></th>
                <th rowspan="2" width="80px" class="text-center"><span>총점 ({{month}}월)</span></th>
              </template>
              <!-- 팀별 -->
              <template v-if="searchParams.SEARCH_TYPE.value === 'DEPT_ID'">
                <th rowspan="2" width="50px" class="text-center"><span>번호</span></th>
                <th rowspan="2" width="110px" class=""><span>센터</span></th>
                <th rowspan="2" width="120px" class=""><span>팀</span></th>
                <th rowspan="2" width="80px" class="text-center"><span>총점 ({{month}}월)</span></th>
              </template>
              <!-- 개인별 -->
              <template v-if="searchParams.SEARCH_TYPE.value === 'TGT_EMP_NO'">
                <th rowspan="2" width="50px" class="text-center"><span>번호</span></th>
                <th rowspan="2" width="110px" class=""><span>센터</span></th>
                <th rowspan="2" width="120px" class=""><span>팀</span></th>
                <th rowspan="2" width="90px" class=""><span>대상자</span></th>
                <th rowspan="2" width="90px" class="text-center"><span>사번</span></th>
                <th rowspan="2" width="80px" class="text-center"><span>총점 ({{month}}월)</span></th>
              </template>
              <!-- 근속연수별 -->
              <template v-if="searchParams.SEARCH_TYPE.value === 'YEAR_OF_SERV'">
                <th rowspan="2" width="50px" class="text-center"><span>번호</span></th>
                <th rowspan="2" width="90px" class="text-center"><span>근속연수</span></th>
                <th rowspan="2" width="80px" class="text-center"><span>총점 ({{month}}월)</span></th>
              </template>
              <template v-for="item in lcdList">
                <th :colspan="item.CNT" :style="`${mcdList.length > 8 ? 'width: '+(item.CNT*210)+'px' : ''}`" class="text-center"><span>{{ item.QA_LCD_NM }}</span></th>
              </template>
            </tr>
            <tr>
              <template v-for="item in mcdList">
                <th class="text-center py-1"><span>{{ item.QA_MCD_NM }}</span></th>
              </template>
            </tr>
          </thead>
        </template>

        <!-- 대상자 -->
        <template v-slot:item.TGT_EMP_NM="{ item }">
          <img :src="item.IMG" :alt="item.TGT_EMP_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
          <span class="ml-1">{{ item.TGT_EMP_NM }}</span>
        </template>

        <!-- 전체평균 -->
        <!-- <template slot="body.append">
          <tr class="pl-grid-sum" style="position: sticky; bottom: 0; z-index: 1; background-color: white;">
            <template v-if="searchParams.SEARCH_TYPE.value === 'DEPT_ID'">
              <td colspan="3" class="pl-grid-sum-head text-center">전체평균</td>
            </template>
            <template v-else-if="searchParams.SEARCH_TYPE.value === 'TGT_EMP_NO'">
              <td colspan="5" class="pl-grid-sum-head text-center">전체평균</td>
            </template>
            <template v-else>
              <td colspan="2" class="pl-grid-sum-head text-center">전체평균</td>
            </template>
            <td class="text-center">
                {{ getAvgScore("STD_SCORE") }}
              </td>
            <template v-for="item in mcdList">
              <td class="text-center">
                {{ getAvgScore(item.QA_LMCD) }}
              </td>
            </template>
          </tr>
        </template> -->

        <template slot="footer">
          <div class="pl-grid-sum" id="sumTable">
            <table>
              <colgroup>
                <col v-for="(col, index) in gridDataHeaders" :key="index" :width=col.width />
              </colgroup>
              <tbody>
                <tr>
                  <template v-if="searchParams.SEARCH_TYPE.value === 'DEPT_ID'">
                    <td colspan="3" class="pl-grid-sum-head text-center">전체평균</td>
                  </template>
                  <template v-else-if="searchParams.SEARCH_TYPE.value === 'TGT_EMP_NO'">
                    <td colspan="5" class="pl-grid-sum-head text-center">전체평균</td>
                  </template>
                  <template v-else>
                    <td colspan="2" class="pl-grid-sum-head text-center">전체평균</td>
                  </template>
                  <td class="text-center">
                      {{ getAvgScore("STD_SCORE") }}
                    </td>
                  <template v-for="item in mcdList">
                    <td class="text-center">
                      {{ getAvgScore(item.QA_LMCD) }}
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import CompoExceldownOpt from '@/components/CompoExceldownOpt';

export default {
  name: 'QAM_M0700_TAB_04', //상세결과
  components: {
    CompoExceldownOpt
  },
  data() {
    return {
      common_ognz_list:[],
      DROP_CENTER_LIST:[],
      DROP_DEPT_LIST:[],
      DROP_STD_ORD_LIST:[],
      DROP_STD_PAPER_LIST:[],
      DROP_YEAR:[],
      DROP_SEARCH_TYPE:[
        { text: '회차별', value:"STD_MT_ORD"},
        { text: '팀별',  value:"DEPT_ID"},
        { text: '개인별',  value:"TGT_EMP_NO"},
        { text: '근속연수별',  value:"YEAR_OF_SERV"},
      ],

      searchParams:{
        CENTER:{}
        , DEPT_ID:[]
        , STD_MT: this.$moment().format("YYYY-MM")
        , STD_MT_ORD:""
        , PAPER_ID:""
        , TGT_EMP_NM:""
        , SEARCH_TYPE:{ text: '회차별', value:"STD_MT_ORD"}
      },

      isAllCheck: false,
      fileName:"",

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 20,

      // 문항헤더
      lcdList:[],
      mcdList:[],
      qstnList:[],
      gridQstnDataHeader:[],

      // 헤더
      gridDataHeaders:[],
      gridDataText: [],

      // 회차별
      gridDataHeaders1: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '회차', value: 'STD_ORD', align: 'center', width: '70px',sortable: false },
        { text: '총점', value: 'STD_SCORE', align: 'center', width: '80px',sortable: true },
      ],

      // 팀별
      gridDataHeaders2: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '센터', value: 'UP_DEPT_NM', align: '', width: '110px',sortable: false },
        { text: '팀', value: 'DEPT_NM', align: '', width: '120px',sortable: true },
        { text: '총점', value: 'STD_SCORE', align: 'center', width: '80px',sortable: true },
      ],
      // 개인별
      gridDataHeaders3: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '센터', value: 'UP_DEPT_NM', align: '', width: '110px',sortable: false },
        { text: '팀', value: 'DEPT_NM', align: '', width: '120px',sortable: true },
        { text: '대상자', value: 'TGT_EMP_NM', align: '', width: '90px',sortable: true },
        { text: '사번', value: 'TGT_EMP_NO', align: 'center', width: '90px',sortable: true },
        { text: '총점', value: 'STD_SCORE', align: 'center', width: '80px',sortable: true },
      ],

      // 근속연수별
      gridDataHeaders4: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '근속연수', value: 'YEAR_OF_SERV_NM', align: 'center', width: '90px',sortable: false },
        { text: '총점', value: 'STD_SCORE', align: 'center', width: '80px',sortable: true },
      ],

      month: parseInt(this.$moment().format("MM")),

      loading: false,
      
      // 엑셀다운로드 옵션
      excelDownOptList: [
        { text: "현재 기준 다운로드", value: "C" },
        { text: "소분류 기준 다운로드", value: "S" },
      ],
    }
  },
  methods: {

    clickSearchBtn(){
      if(this.mixin_isEmpty(this.searchParams.PAPER_ID)){
        this.showAlertInfo({msg:"회차와 평가지를 선택해주세요."});
        return false;
      }

      this.selectQaResultDetailReport();
    },

    // 평가보고서 - 회차별
    async selectQaResultDetailReport(){

      this.gridDataText = [];

      // 엑셀 파일명 셋팅
      this.setExcelFileName();

      let sUrl = '/phone-api/qa/selectQaResultDetailReport';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER.CUSTCO_ID
        , STD_MT: this.searchParams.STD_MT.replaceAll("-","")
        , STD_MT_ORD: this.searchParams.STD_MT_ORD
        , PAPER_ID: this.searchParams.PAPER_ID
        , DEPT_ID: this.searchParams.DEPT_ID.filter(row=>{return row != "ALL_CHECK"}).join(",")
        , SEARCH_TYPE: this.searchParams.SEARCH_TYPE.value
      };

      let headParam = { head : {}};

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.gridDataText = response.DATA.map(row=>{
          let qaLmcdList = row.QA_LMCD_LIST.split(",");
          let mcdScoreList = row.MCD_SCORE_LIST.split(",");
          let qaLmscdList = row.QA_LMSCD_LIST.split(",");
          let scoreList = row.SCORE_LIST.split(",");
          let mgrComtList = [];

          // 개인별인 경우
          if(this.searchParams.SEARCH_TYPE.value == "TGT_EMP_NO"){
            // 코멘트
            mgrComtList = row.MGR_COMT_LIST.split(",");

            // 프로필 이미지
            if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
            else row.IMG = require('@/assets/img/@manager_profile_default.png');
          }

          // 대중
          for(let i=0; i<qaLmcdList.length;i++){
            row[qaLmcdList[i]] = parseFloat(mcdScoreList[i]).toFixed(2);
          }

          // 대중소
          for(let i=0; i<qaLmscdList.length;i++){
            row[qaLmscdList[i]] = parseFloat(scoreList[i]).toFixed(2);
            if(this.searchParams.SEARCH_TYPE.value == "TGT_EMP_NO") row[qaLmscdList[i]+"_MGR_COMT"] = (mgrComtList[i] == " " ? '' : mgrComtList[i]);
          }

          row.STD_ORD = row.STD_ORD+"차";
          row.STD_SCORE = parseFloat(row.STD_SCORE).toFixed(2);

          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading = false;
    },

    // 평가지 문항 헤더 조회
    async selectQaPaperQstnHeader(){
      this.gridDataText = [];

      // let sUrl = '/phone-api/qa/selectQaPaperQstnHeader';
      let sUrl = '/api/biz/common/select/selectQaPaperQstnHeader';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER.CUSTCO_ID
        , PAPER_ID: this.searchParams.PAPER_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlReportManageMapper'
        , sn : 'selectQaPaperQstnHeader'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qstnList = response.DATA;
        this.gridQstnDataHeader = [];
        this.lcdList = [];
        this.mcdList = [];

        for(let i=0; i<this.qstnList.length;i++){
          this.qstnList[i].QA_LCD_NM = this.qstnList[i].QA_LCD_NM + " (" + this.qstnList[i].QA_LCD_SCORE + ")";
          this.qstnList[i].QA_MCD_NM = this.qstnList[i].QA_MCD_NM + " (" + this.qstnList[i].QA_MCD_SCORE + ")";
          this.qstnList[i].QA_SCD_NM = this.qstnList[i].QA_SCD_NM + " (" + this.qstnList[i].QA_SCD_SCORE + ")";
          this.qstnList[i].align="center";
          this.qstnList[i].width="150px";
          this.qstnList[i].value = this.qstnList[i].QA_LMSCD;
          this.qstnList[i].text = this.qstnList[i].QA_SCD_NM;

          if(i==0){
            let obj = {...this.qstnList[i]};
            obj.CNT = this.qstnList.filter(row=>{return row.QA_LMCD == obj.QA_LMCD}).length;
            this.mcdList.push(obj);
          }else{
            let obj = {...this.qstnList[i]};
            if(this.qstnList[i-1].QA_LMCD != this.qstnList[i].QA_LMCD){
              obj.CNT = this.qstnList.filter(row=>{return row.QA_LMCD == obj.QA_LMCD}).length;
              this.mcdList.push(obj);
            }
          }
        }

        for(let i=0; i<this.mcdList.length;i++){
          if(i==0){
            let obj = {...this.mcdList[i]};
            obj.CNT = this.mcdList.filter(row=>{return row.QA_LCD == obj.QA_LCD}).length;
            this.lcdList.push(obj);
          }else{
            let obj = {...this.mcdList[i]};
            if(this.mcdList[i-1].QA_LCD != this.mcdList[i].QA_LCD){
              obj.CNT = this.mcdList.filter(row=>{return row.QA_LCD == obj.QA_LCD}).length;
              this.lcdList.push(obj);
            }
          }

          this.gridQstnDataHeader.push(
            { text: this.mcdList[i].QA_MCD_NM, value: this.mcdList[i].QA_LMCD, align: 'center', width: this.mcdList.length > 8 ? "210px": "", sortable: false },
          );
        }
        this.setGridDataHeader();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    setGridDataHeader(){
      this.gridDataHeaders = [];
      if(this.searchParams.SEARCH_TYPE.value == "STD_MT_ORD") this.gridDataHeaders.push(...this.gridDataHeaders1);
      if(this.searchParams.SEARCH_TYPE.value == "DEPT_ID") this.gridDataHeaders.push(...this.gridDataHeaders2);
      if(this.searchParams.SEARCH_TYPE.value == "TGT_EMP_NO") this.gridDataHeaders.push(...this.gridDataHeaders3);
      if(this.searchParams.SEARCH_TYPE.value == "YEAR_OF_SERV") this.gridDataHeaders.push(...this.gridDataHeaders4);

      this.gridDataHeaders.push(...this.gridQstnDataHeader);
    },

    // 회차 정보 조회
    async selectQaStdMtOrdList(){
      if(this.mixin_isEmpty(this.searchParams.STD_MT)) return;
      this.searchParams.STD_MT_ORD = "";
      this.DROP_STD_PAPER_LIST = [];

      // let sUrl = '/phone-api/qa/selectQaStdMtOrdList';
      let sUrl = '/api/biz/common/select/selectQaStdMtOrdList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER.CUSTCO_ID
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

        if(this.DROP_STD_ORD_LIST.length > 0) {
          this.searchParams.STD_MT_ORD = this.DROP_STD_ORD_LIST[0].value;
          this.selectQaStdMtOrdPaperList();
        }
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가지 정보 조회
    async selectQaStdMtOrdPaperList(){
      this.gridDataText = [];

      // let sUrl = '/phone-api/qa/selectQaStdMtOrdPaperList';
      let sUrl = '/api/biz/common/select/selectQaStdMtOrdPaperList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER.CUSTCO_ID
        , STD_MT: this.searchParams.STD_MT.replaceAll("-","")
        , STD_MT_ORD: this.searchParams.STD_MT_ORD
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaEvlReportManageMapper'
        , sn : 'selectQaStdMtOrdPaperList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_STD_PAPER_LIST = response.DATA.map(row=>{
          row.value = row.PAPER_ID;
          row.text = row.PAPER_NM;
          return row;
        });

        if(this.DROP_STD_PAPER_LIST.length > 0) {
          this.searchParams.PAPER_ID = this.DROP_STD_PAPER_LIST[0].value;
          this.selectQaPaperQstnHeader();
        }
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    //그룹(센터) 변경 이벤트
    changeCenter(){
      // 소속
      this.DROP_DEPT_LIST = this.mixin_ognz_list_detail(this.common_ognz_list, this.searchParams.CENTER.DEPT_ID, "" );
      this.DROP_DEPT_LIST.unshift({value:"ALL_CHECK", text:"전체"});
      this.searchParams.DEPT_ID = [];
      this.searchParams.STD_MT_ORD = "";
      this.searchParams.PAPER_ID = "";

      // 회차
      this.selectQaStdMtOrdList();
    },

    // 소속 변경 이벤트
    changeDept(){
      this.checkDeptList();
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

    // 평가년월 변경
    changeStdMt(){
      this.month = parseInt(this.searchParams.STD_MT.slice(-2, this.searchParams.STD_MT.length));

      // 회차
      this.selectQaStdMtOrdList();
    },

    // 회차 변경
    changeStdMtOrd(){
      if(!this.mixin_isEmpty(this.searchParams.STD_MT_ORD)){
        this.selectQaStdMtOrdPaperList();
      }
    },

    // 평가지 변경
    changePaper(){
      if(!this.mixin_isEmpty(this.searchParams.PAPER_ID)){
        this.selectQaPaperQstnHeader();
      }
    },

    // 조회 구분 변경
    changeSearchType(){
      this.$nextTick(() => {
        this.gridDataText = [];
        this.setGridDataHeader();
      });
    },

    setExcelFileName(){
      let type = this.searchParams.SEARCH_TYPE.text;
      let paperNm = this.DROP_STD_PAPER_LIST.filter(row=>{return row.value == this.searchParams.PAPER_ID})[0].PAPER_NM;
      this.fileName = this.searchParams.STD_MT+"_"+this.searchParams.STD_MT_ORD+"차_["+paperNm+"]_"+type+"_QA상세결과";
    },

    // 평균
    getAvgScore(group){
      let sum = 0;
      let avg = 0;

      this.gridDataText.forEach(row=>{
        sum += parseFloat(row[group]);
      });

      avg = this.gridDataText.length > 0 ? sum/this.gridDataText.length : 0;

      return avg.toFixed(2);
    },

    getBaseHeader(){
      if(this.searchParams.SEARCH_TYPE.value == "STD_MT_ORD") return this.gridDataHeaders1;
      if(this.searchParams.SEARCH_TYPE.value == "DEPT_ID") return this.gridDataHeaders2;
      if(this.searchParams.SEARCH_TYPE.value == "TGT_EMP_NO") return this.gridDataHeaders3;
      if(this.searchParams.SEARCH_TYPE.value == "YEAR_OF_SERV") return this.gridDataHeaders4;
    },

    getExcelHeader(type){
      let baseHeader = this.getBaseHeader();
      let excelHeader = [];

      // 고정 헤더 셋팅
      excelHeader.push(JSON.parse(JSON.stringify(baseHeader)));
      excelHeader.push(JSON.parse(JSON.stringify(baseHeader)));

      if(type == "S"){  // 소분류 기준 다운로드드
        // 개인별
        if(this.searchParams.SEARCH_TYPE.value == "TGT_EMP_NO"){
          excelHeader.push(JSON.parse(JSON.stringify(baseHeader)));
          excelHeader.push(JSON.parse(JSON.stringify(baseHeader)));
          excelHeader[0] = excelHeader[0].map(row=>{
            row.rowspan = (excelHeader.length - 1);
            return row;
          });

          // 마지막 헤더 셋팅 문항별 점수/코멘트 열 추가
          let lastHeader = [];
          for(let i=0; i<this.qstnList.length;i++){
            let obj1 = {...this.qstnList[i]};
            let obj2 = {...this.qstnList[i]};
            obj1.value = obj1.QA_LMSCD;
            obj1.text = "점수";
            obj2.value = obj2.QA_LMSCD+"_MGR_COMT";
            obj2.text = "코멘트";
            lastHeader.push(obj1);
            lastHeader.push(obj2);
          }

          // console.log("lastHeader :::", lastHeader);

          let lcd = [];
          let mcd = [];
          let scd = [];

          // 마지막 헤더를 기준으로 가변 헤더 셋팅
          for(let i=0; i<lastHeader.length;i++){
            if(i==0){
              let lcdObj = {...lastHeader[i]};
              let mcdObj = {...lastHeader[i]};
              let scdObj = {...lastHeader[i]};

              lcdObj.text = lcdObj.QA_LCD_NM;
              mcdObj.text = mcdObj.QA_MCD_NM;
              scdObj.text = scdObj.QA_SCD_NM;

              let colspan1 = (lastHeader.filter(row=>{return row.QA_LCD == lcdObj.QA_LCD}).length-1);
              let colspan2 = (lastHeader.filter(row=>{return row.QA_LMCD == mcdObj.QA_LMCD}).length-1);
              let colspan3 = (lastHeader.filter(row=>{return row.QA_LMSCD == scdObj.QA_LMSCD}).length-1);

              if(colspan1 > 0) lcdObj.colspan = colspan1;
              if(colspan2 > 0) mcdObj.colspan = colspan2;
              if(colspan3 > 0) scdObj.colspan = colspan3;
              
              lcd.push(lcdObj);
              mcd.push(mcdObj);
              scd.push(scdObj);
            }else{
              excelHeader[0] = excelHeader[0].map(row=>{
                row.rowspan = (excelHeader.length - 1);
                return row;
              });
              
              let lcdObj = {...lastHeader[i]};
              let mcdObj = {...lastHeader[i]};
              let scdObj = {...lastHeader[i]};

              if(lastHeader[i-1].QA_LCD != lastHeader[i].QA_LCD){
                lcdObj.text = lcdObj.QA_LCD_NM;
                let colspan1 = (lastHeader.filter(row=>{return row.QA_LCD == lcdObj.QA_LCD}).length-1);
                if(colspan1 > 0) lcdObj.colspan = colspan1;
              }else{
                lcdObj.text = "";
              }

              if(lastHeader[i-1].QA_LMCD != lastHeader[i].QA_LMCD){
                mcdObj.text = mcdObj.QA_MCD_NM;
                let colspan2 = (lastHeader.filter(row=>{return row.QA_LMCD == mcdObj.QA_LMCD}).length-1);
                if(colspan2 > 0) mcdObj.colspan = colspan2;
              }else{
                mcdObj.text = "";
              }

              if(lastHeader[i-1].QA_LMSCD != lastHeader[i].QA_LMSCD){
                scdObj.text = scdObj.QA_SCD_NM;
                let colspan3 = (lastHeader.filter(row=>{return row.QA_LMSCD == scdObj.QA_LMSCD}).length-1);
                if(colspan3 > 0) scdObj.colspan = colspan3;
              }else{
                scdObj.text = "";
              }

              lcd.push(lcdObj);
              mcd.push(mcdObj);
              scd.push(scdObj);
            }
          }

          excelHeader[0] = [...excelHeader[0], ...lcd];
          excelHeader[1] = [...excelHeader[1], ...mcd];
          excelHeader[2] = [...excelHeader[2], ...scd];
          excelHeader[3] = [...excelHeader[3], ...lastHeader];
        }else{
          excelHeader.push(JSON.parse(JSON.stringify(baseHeader)));
          excelHeader[0] = excelHeader[0].map(row=>{
            row.rowspan = (excelHeader.length - 1);
            return row;
          });

          let lcd = [];
          let mcd = [];

          for(let i=0; i<this.qstnList.length;i++){
            if(i==0){
              let lcdObj = {...this.qstnList[i]};
              let mcdObj = {...this.qstnList[i]};

              lcdObj.text = lcdObj.QA_LCD_NM;
              mcdObj.text = mcdObj.QA_MCD_NM;

              let colspan1 = (this.qstnList.filter(row=>{return row.QA_LCD == lcdObj.QA_LCD}).length-1);
              let colspan2 = (this.qstnList.filter(row=>{return row.QA_LMCD == mcdObj.QA_LMCD}).length-1);

              if(colspan1 > 0) lcdObj.colspan = colspan1;
              if(colspan2 > 0) mcdObj.colspan = colspan2;

              lcd.push(lcdObj);
              mcd.push(mcdObj);
            }else{
              let lcdObj = {...this.qstnList[i]};
              let mcdObj = {...this.qstnList[i]};

              // 대분류류
              if(this.qstnList[i-1].QA_LCD != this.qstnList[i].QA_LCD){
                lcdObj.text = lcdObj.QA_LCD_NM;
                let colspan1 = (this.qstnList.filter(row=>{return row.QA_LCD == lcdObj.QA_LCD}).length-1);
                if(colspan1 > 0) lcdObj.colspan = colspan1;
              }else{
                lcdObj.text = "";
              }

              // 중분류
              if(this.qstnList[i-1].QA_LMCD != this.qstnList[i].QA_LMCD){
                mcdObj.text = mcdObj.QA_MCD_NM;
                let colspan2 = (this.qstnList.filter(row=>{return row.QA_LMCD == mcdObj.QA_LMCD}).length-1);
                if(colspan2 > 0) mcdObj.colspan = colspan2;
              }else{
                mcdObj.text = "";
              }

              lcd.push(lcdObj);
              mcd.push(mcdObj);
            }
          }

          excelHeader[0] = [...excelHeader[0], ...lcd];
          excelHeader[1] = [...excelHeader[1], ...mcd];
          excelHeader[2] = [...excelHeader[2], ...this.qstnList];
        }
      }else{
        // 현재 기준 다운로드
        // 고정헤더 rowspan
        excelHeader[0] = excelHeader[0].map(row=>{
          row.rowspan = (excelHeader.length - 1);
          return row;
        });

        // 가변 헤더 셋팅
        // 마지막 헤더를 기준으로 value 값 셋팅
        let lcd = [];
        for(let i=0; i<this.mcdList.length;i++){
          this.mcdList[i].value = this.mcdList[i].QA_LMCD;
          this.mcdList[i].text = this.mcdList[i].QA_MCD_NM;
          if(i==0){
            let obj = {...this.mcdList[i]};
            obj.text = obj.QA_LCD_NM;

            let colspan = this.mcdList.filter(row=>{return row.QA_LCD == obj.QA_LCD}).length-1;
            if(colspan > 0) obj.colspan = colspan;
            
            lcd.push(obj);
          }else{
            let obj = {...this.mcdList[i]};
            if(this.mcdList[i-1].QA_LCD != this.mcdList[i].QA_LCD){
              obj.text = obj.QA_LCD_NM;

              let colspan = this.mcdList.filter(row=>{return row.QA_LCD == obj.QA_LCD}).length-1;
              if(colspan > 0) obj.colspan = colspan;
            }else{
              obj.text = "";
            }
            lcd.push(obj);
          }
        }
        excelHeader[0] = [...excelHeader[0], ...lcd];
        excelHeader[1] = [...excelHeader[1], ...this.mcdList.map(row=>{
          row.value = row.QA_LMCD;
          row.text = row.QA_MCD_NM;
          return row;
        })];
      }

      // console.log("excelHeader ::: ", excelHeader);

      return excelHeader;
    },
    
    excelDownOpt(type){
      let excelHeader = [];
      let excelData = [...this.gridDataText];

      excelHeader = this.getExcelHeader(type);
      
      // console.log("type ::: ", type);
      // console.log("excelHeader ::: ", excelHeader);
      this.$refs.CompoExceldownOpt.DownloadExcel_All_reasonChk(excelHeader, excelData, this.fileName, "QA보고서 상세결과", "", "", true);
    },
  },
  async mounted() {

    //조직
    this.common_ognz_list = await this.mixin_ognz_list();
    this.DROP_CENTER_LIST = await this.mixin_ognz_list_center(this.common_ognz_list, 'CUSL', '' );

    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;

    let temp = this.DROP_CENTER_LIST.filter(row=>{return row.CUSTCO_ID == centerId});
    if(temp.length > 0) this.searchParams.CENTER = temp[0];
    else this.searchParams.CENTER = this.DROP_CENTER_LIST[0];

    this.changeCenter();

    // 스크롤 처리
    this.$refs.dataTable01.$el.querySelector("div.v-data-table__wrapper").style.overflowX = "hidden";
    this.$refs.dataTable01.$el.querySelector("#sumTable").addEventListener("scroll", ()=>{
      this.$refs.dataTable01.$el.querySelector("div.v-data-table__wrapper").scrollLeft = this.$refs.dataTable01.$el.querySelector("#sumTable").scrollLeft;
    });
  },
  beforeDestroy() {

  },
  created() {
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
    "searchParams.STD_MT"(){
      this.searchParams.STD_MT = this.searchParams.STD_MT.replace(/^(\d{4})(\d{2})$/, '$1-$2');
      if(this.searchParams.STD_MT.length >= 7){
        this.changeStdMt();
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>