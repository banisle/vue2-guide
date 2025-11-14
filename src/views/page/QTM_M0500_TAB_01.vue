<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          평가연도
        </span>
        <div class="pl-desc">
          <v-select
            v-model="modelDateY"
            :items="mixin_evl_crtr_list_combo(evl_crtr_code, 'year',null,undefined)"
            class="pl-form type-middle is-sm"/>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          센터
        </span>
        <div class="pl-desc">
          <v-select
            v-model="searchParams.CENTER_ID"
            :items="DROP_CENTER_LIST"
            class="pl-form type-middle"
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
              v-model="searchParams.SRCH_DEPT_ID"
              :items="DEPT_ITEMS"
              item-text="DEPT_NM"
              item-value="DEPT_ID"
              class="pl-form type-middle"
              placeholder="전체"
              @change="selectUserList"
            ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          성명
        </span>
        <div class="pl-desc">
          <!-- <v-select
              v-model="searchParams.SRCH_USER_ID"
              :items="USER_GRID_ITEMS"
              item-text="USER_NM"
              item-value="USER_ID"
              class="pl-form type-middle"
              placeholder="전체"
            ></v-select> -->
            <v-text-field
              class="pl-form type-middle"
              v-model="searchParams.SRCH_USER_NM"
              @keyup.enter="clickSearchBtn"
            ></v-text-field>
        </div>
      </div>
      <div class="pl-form-inline">
        <v-checkbox
            v-model="USER_STTS_CD"
            class="pl-check"
            label="퇴직자 제외"
            input-value="true"></v-checkbox>
      </div>
      <!--
      <div class="pl-form-inline">
        <v-radio-group
            v-model="USER_STTS_CD"
            row
            class="pl-radio-group"
          >
            <template v-slot:label>
              <span class="pl-label">재직여부</span>
            </template>
            <v-radio
              v-for="(rad01, index) in radioGroup3"
              :key="radioGroup[index].text"
              :label="rad01.text"
              :value="rad01.value"
              class="pl-radio"
              @click="clickSearchBtn"
            >
            </v-radio>
          </v-radio-group>
      </div>-->

      <div>
        <v-btn
          class="pl-btn is-icon"
          @click="clickSearchBtn()"
          >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
        <compo-tooltip-btn
          TitleProp="초기화 "
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="searchParamsReset()"
        ></compo-tooltip-btn>
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <!-- grid top -->
      <div class="pl-grid-top pt-3">
        <div class="pl-grid-top-left">
          <v-radio-group
            v-model="group_type"
            row
            class="pl-radio-group"
          >
            <template v-slot:label>
              <span class="pl-label">그룹 유형</span>
            </template>
            <v-radio
              v-for="(rad01, index) in radioGroup"
              :key="radioGroup[index].text"
              :label="rad01.text"
              :value="rad01.value"
              class="pl-radio"
              @click="clickSearchBtn"
            >
            </v-radio>
          </v-radio-group>
          <v-radio-group
            v-model="improve_type"
            row
            class="pl-radio-group"
            @change="changeFileName"
          >
            <template v-slot:label>
              <span class="pl-label">향상도</span>
            </template>
            <v-radio
              v-for="(rad01, index) in radioGroup2"
              :key="radioGroup[index].text"
              :label="rad01.text"
              :value="rad01.value"

              class="pl-radio"
            >
            </v-radio>
          </v-radio-group>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ evaluationReportList.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
              TypeProp="Download"
              :DataHeaderProp="computedHeaders"
              :DataBodyProp="processedReports"
              :FileNameProp="fileName"
              SheetNameProp="평가 결과 보고서 월별 현황"
            />

        </div>
      </div>
      <!-- grid -->
      <template >
        <v-data-table
          class="pl-grid is-mt-s "
          :headers="computedHeaders"
          :style="computedUserType === 'ETC_ADMIN' ? 'max-width: calc(100vw - 294px)' : 'max-width: calc(100vw - 354px)' "
          :items="processedReports"
          fixed-header
          hide-default-header
          item-key="index"
          :height="group_type === 'team' ? 'calc(-360px + 100vh)' : 'calc(-330px + 100vh)'"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
          >
          <template v-slot:header="{props, on}">
            <thead class="v-data-table-header multi-row">
              <tr>
                <th rowspan="2" width="50px" :class="'text-center sortable active '+(props.options.sortBy[0] == 'RANK' && props.options.sortDesc[0]?'desc':'asc')"
                  @click="on.sort('RANK')"
                ><span>순위</span>
                <i aria-hidden="true" class="v-icon notranslate v-data-table-header__icon mdi mdi-arrow-up theme--light" style="font-size: 18px;"></i>
                </th>
                <template v-if="group_type === 'emp'">
                  <th rowspan="2" width="80px" :class="'text-center sortable active '+(props.options.sortBy[0] == 'EVAL_EMP_NM' && props.options.sortDesc[0]?'desc':'asc')" @click="on.sort('EVAL_EMP_NM')"
                    ><span>성명</span>
                    <i aria-hidden="true" class="v-icon notranslate v-data-table-header__icon mdi mdi-arrow-up theme--light" style="font-size: 18px;"></i>
                  </th>
                  <th rowspan="2" width="70px" class="text-center" :class="'text-center sortable active '+(props.options.sortBy[0] == 'EVAL_EMP_NO' && props.options.sortDesc[0]?'desc':'asc')" @click="on.sort('EVAL_EMP_NO')"
                    ><span>사번</span>
                    <i aria-hidden="true" class="v-icon notranslate v-data-table-header__icon mdi mdi-arrow-up theme--light" style="font-size: 18px;"></i>
                  </th>
                  <th rowspan="2" width="" :class="'text-center sortable active '+(props.options.sortBy[0] == 'EVAL_DEPT_NM' && props.options.sortDesc[0]?'desc':'asc')" @click="on.sort('EVAL_DEPT_NM')"
                    ><span>부서</span>
                    <i aria-hidden="true" class="v-icon notranslate v-data-table-header__icon mdi mdi-arrow-up theme--light" style="font-size: 18px;"></i>
                  </th>
                </template>

                <template v-if="group_type === 'team'">
                  <th rowspan="2" width="" :class="'text-center sortable active '+(props.options.sortBy[0] == 'EVAL_DEPT_NM' && props.options.sortDesc[0]?'desc':'asc')" @click="on.sort('EVAL_DEPT_NM')"
                    ><span>부서</span>
                    <i aria-hidden="true" class="v-icon notranslate v-data-table-header__icon mdi mdi-arrow-up theme--light" style="font-size: 18px;"></i>
                  </th>
                </template>

                <template v-if="group_type === 'work'">
                  <th rowspan="2" width="" :class="'text-center sortable active '+(props.options.sortBy[0] == 'TERM_SORT' && props.options.sortDesc[0]?'desc':'asc')" @click="on.sort('TERM_SORT')"
                    ><span>근속시간</span>
                    <i aria-hidden="true" class="v-icon notranslate v-data-table-header__icon mdi mdi-arrow-up theme--light" style="font-size: 18px;"></i>
                  </th>
                </template>
                <template v-for="month in 12">
                  <th :key="`month-header-${month}`" colspan="2" width="110px" class="text-center">
                    <span>{{ month }}월</span>
                  </th>
                </template>
                <th rowspan="2" width="60px" :class="'text-center sortable active '+(props.options.sortBy[0] == 'Y_SCORE_AVG' && props.options.sortDesc[0]?'desc':'asc')" @click="on.sort('Y_SCORE_AVG')"
                  ><span>평균</span>
                  <i aria-hidden="true" class="v-icon notranslate v-data-table-header__icon mdi mdi-arrow-up theme--light" style="font-size: 18px;"></i>
                </th>
              </tr>
              <tr>
                <template v-for="month in 12">
                  <th :key="`month-score-${month}`" :class="'px-0 text-center sortable active '+(props.options.sortBy[0] == 'SCORE_'+month && props.options.sortDesc[0]?'desc':'asc')" @click="on.sort('SCORE_'+month)"
                    ><span>점수</span>
                    <i aria-hidden="true" class="v-icon notranslate v-data-table-header__icon mdi mdi-arrow-up theme--light" style="font-size: 18px;"></i>
                  </th>
                  <th :key="`month-improvement-${month}`" :class="'px-0 text-center sortable active '+(props.options.sortBy[0] == 'PROVE_'+month && props.options.sortDesc[0]?'desc':'asc')" @click="on.sort('PROVE_'+month)"
                    ><span>향상도</span>
                    <i aria-hidden="true" class="v-icon notranslate v-data-table-header__icon mdi mdi-arrow-up theme--light" style="font-size: 18px;"></i>
                  </th>
                </template>
              </tr>
            </thead>
          </template>
          <!-- 대상자
          <template v-slot:item.type01="{ item }">
            <img :src="item.img" :alt="item.type01" class="pl-grid-portrait" style="width: 20px; height: 20px;">
            <span class="ml-1">{{ item.type01 }}</span>
          </template> -->

          <!-- Row template for items :key="q.index" -->
          <!--template v-for="(item, index) in processedReports" -->
          <template v-slot:item="{item, index}">
            <tr :key="`processed-item-${index}`">
              <td class="text-center">{{ item.RANK }}</td>

              <template v-if="group_type === 'emp'">
                <td>
                  <img :src="item.IMG" :alt="item.EVAL_EMP_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
                  <span class="ml-1">{{ item.EVAL_EMP_NM }}</span>
                </td>
                <td>{{ item.EVAL_EMP_NO }}</td>
                <td class="text-center">{{ item.EVAL_DEPT_NM }}</td>
              </template>
              <template v-if="group_type === 'team'">
                <td class="text-center">{{ item.EVAL_DEPT_NM }}</td>
              </template>
              <template v-if="group_type === 'work'">
                <td class="text-center">{{ item.EVAL_DEPT_NM }}</td>
              </template>

              <template v-for="month in 12">
                <td :key="`month-score-data-${month}-${item.index}`" class="text-center px-0">
                  <span
                      v-if="group_type === 'emp'"
                      @click="openDialog( item.EVAL_EMP_NO, month, modelDateY  )"
                      style="cursor: pointer" class="text-center px-0 is-txt-blue"
                    >
                      {{ item[`SCORE_${month}`] }}                    </span>
                    <template v-else>
                      {{ item[`SCORE_${month}`] }}
                    </template>
                </td>
                <td :key="`month-improvement-data-${month}-${item.index}`" class="text-center px-0">{{ item[`PROVE_${month}`] }}</td>
              </template>
              <td class="text-center px-0">{{ item.Y_SCORE_AVG }}</td>
            </tr>
          </template>

          <!--  팀별 조회시 -->
          <template v-slot:footer v-if="group_type === 'team'">
            <div class="pl-grid-sum">
              <table >
                <!-- <colgroup>
                  <col v-for="(col, index) in computedHeaders" :key="index" :style="`width: ${col.width}`" />
                </colgroup> -->
                <tbody >
                  <tr>
                    <td colspan="2" class="pl-grid-sum-head text-center px-0">센터평균</td>
                    <template v-for="month in 12">
                      <td :key="`footer-score-${month}`" style="width: 55px !important" class="pa-0 text-center font-weight-bold">
                        {{ processedReports[0][`TOT_SCORE_${month}`] }}
                      </td>
                      <td :key="`footer-prove-${month}`" style="width: 55px !important" class="pa-0 text-center font-weight-bold">
                        {{ processedReports[0][`TOT_PROVE_${month}`] }}
                      </td>
                    </template>
                    <td  class="pa-0 text-center font-weight-bold" style="width: 60px !important">
                        {{ processedReports[0].TOT_Y_SCORE_AVG }}
                    </td>
                  </tr>
                 </tbody>
              </table>
            </div>
          </template>

        </v-data-table>
      </template>

    </div>
    <!-- side panel : 상담 상세정보-->
    <v-slide-x-reverse-transition>
      <div v-if=" dialogDetail === true "
        class="pl-quick-layer"
        :style="tempCenterStyle"
        style="width: 800px"
              >
        <QTM_M0400_TEST_DETAIL
          :qstnPaperData="qstnPaperData"
          @Close="closeSlide()"
        />
      </div>
    </v-slide-x-reverse-transition>
  </div>

</template>

<script>
import HOME_TEST_DETAIL from '@/views/page/Home/HOME_TEST_DETAIL'
import QTM_M0400_TEST_DETAIL from "@/views/page/QTM_M0400_TEST_DETAIL";

export default {
  name: 'QTM_M0500_TAB_01', //평가보고서 - 월별 현황
  components: {
    HOME_TEST_DETAIL,
    QTM_M0400_TEST_DETAIL
  },
  data() {
    return {
      // top
      modelTopCenter: '마이홈센터',
      itemsTopCenter: ['마이홈센터'],

      //radioGroupSelected: "상담사별",
      radioGroup: [
        { text: "상담사별", value:'emp'},
        { text: "팀별",     value: 'team'},
        { text: "근속년수별", value:'work'},
      ],
      //radioGroupSelected2: "직전 평가대비",
      radioGroup2: [
        { text: "직전 평가대비", value:'E' },
        { text: "전월대비", value:'M'},
        { text: "전년도 평균대비", value:'Y'},
      ],

      radioGroup3: [
        { text: "전체", value:'WORK' },
        { text: "퇴직제외", value:'RTRM'},
      ],

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 2000000,

      // 상담사별 grid
      headers: [
        { text: '순위', value: 'RANK', align: 'center', width: '50px', sortable: false },
      ],
      items: [],

      // dialog
      dialogDetail: false,
      evaluationReportList: [],

      searchParams: {
        CENTER_ID: "",
        SRCH_DEPT_ID: '',
        SRCH_USER_ID: '',
        SRCH_USER_NM: '',
      },

      improve_type: 'E',   // M, E ,Y    // 직전대비... 전월대비,  전년도평균대비
      group_type: 'emp',   // emp, work( 근속연수), team  팀별
      USER_STTS_CD: true,

      evl_crtr_code:[],//평가기준 년월

      DEPT_ITEMS:[],
      modelDateY: this.$moment(new Date()).format('YYYY'),
      USER_GRID_ITEMS: [],

      qstnPaperData:{},
      DROP_CENTER_LIST:{},
      USER_REPORT_ITEMS:[],
      fileName:"평가보고서 월별 현황",
    }
  },
  methods: {

    test(props){
      console.log("props ::: ", props);
    },

    changeFileName(newValue){
      let subFileName = this.group_type == 'emp' ? '상담사별' : this.group_type == 'team' ? '팀별' : '근속연수';
      let subFileName2 = this.improve_type == 'E' ? '직전 평가대비' : this.improve_type == 'M' ? '전월대비' : '전년도 평균대비';
      this.fileName = this.modelDateY+"년 평가 결과보고서 ["+subFileName+"]_["+subFileName2+"]";
    },

    searchParamsReset(){
      this.searchParams.SRCH_USER_ID = '';
      this.searchParams.SRCH_DEPT_ID = '';
      this.modelDateY= this.$moment(new Date()).format('YYYY');
      this.USER_STTS_CD = 'WORK';
      this.group_type= 'emp';
      this.improve_type= 'E';
      this.searchParams.CENTER_ID = '1';
    },

    async openDialog(EVAL_EMP_NO, month, modelDateY ) {
      var date = modelDateY;
      if(month < 10){
        date += '0' + month;
      }else{
        date += month;
      }

      let sUrl = '/phone-api/qt/selectUserEvaluationReport';
      let postParam = {
        EVAL_EMP_NO: EVAL_EMP_NO,
        EVAL_DATE: date,
        EXPLAIN_SHOW_YN: "Y",
      };

      let headParam = {head: {}};
      let resData = await this.common_postCall(sUrl, postParam, headParam)

      if(!resData.HEADER.ERROR_FLAG) {

        if (!this.mixin_isEmpty(resData.DATA)) {
          this.USER_REPORT_ITEMS = [];
          this.USER_REPORT_ITEMS = resData.DATA;

          this.qstnPaperData = {
            CENTER_ID: this.USER_REPORT_ITEMS[0].CENTER_ID,
            EVAL_ID: this.USER_REPORT_ITEMS[0].EVAL_ID,
            USER_ID: this.USER_REPORT_ITEMS[0].EVAL_EMP_NO,
          };
          this.dialogDetail = true;

        }else {
          this.USER_REPORT_ITEMS = [];
          this.showAlert({alertDialogToggle: true, msg: '평가 결과 없습니다.', iconClass: 'is-info', type: 'default'});
          return;
        }

      }else{
        this.USER_REPORT_ITEMS = [];
        this.showAlert({alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-info', type: 'default'});
        return;
      }

    },

    changeCenter(){
      this.selectDeptList();
    },

    //  사용자 검색
    async selectUserList() {

      if( (this.searchParams.CENTER_ID === undefined || this.searchParams.CENTER_ID === '') ) {
        return;
      }
      let sUrl = '/phone-api/qt/selectUserList';
      let postParam = {};
      postParam.SRCH_DEPT_ID = this.searchParams.SRCH_DEPT_ID;
      postParam.CENTER_ID = this.searchParams.CENTER_ID;
      postParam.SRCH_USER_STTS_CD =  this.USER_STTS_CD == true ? 'WORK' : 'RTRM';  //   'WORK'; // 재직상태 'WORK', 퇴직 : RTRM

      let headParam = {head: {}};
      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {
        this.USER_GRID_ITEMS = [];
        this.USER_GRID_ITEMS = resData.DATA;
      }else {
        this.USER_GRID_ITEMS = [];
      }
    },

    async selectDeptList() {
      console.info("selectDeptList #### ");
      let sUrl = '/phone-api/qt/selectDeptList';
      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID,
      };

      let headParam = {head: {}};
      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {
        this.DEPT_ITEMS = [];
        this.DEPT_ITEMS = resData.DATA ;

        //this.searchParams.SRCH_DEPT_ID = this.DEPT_ITEMS[1].value;
        //this.DEPT_ITEMS.push({ DEPT_ID: "",  DEPT_NM: "전체",})
      }else {
        this.DEPT_ITEMS = [];
      }
      this.DEPT_ITEMS.unshift({ DEPT_ID: "",  DEPT_NM: "전체",})
    },

    // 조회버튼 클릭
    clickSearchBtn() {
      this.selectEvaluationReportList();
    },

    // 조회
    async selectEvaluationReportList() {
        console.info("selectEvaluationReportList");
        // 초기화
        this.evaluationReportList = [];

        let sUrl = "/phone-api/qt/selectEvaluationReportList";
        let postParam = {
            CENTER_ID: this.searchParams.CENTER_ID,
            P_EVAL_YYYY: parseInt(this.modelDateY) -1,
            EVAL_YYYY: this.modelDateY,
            group_type: this.group_type,
            SRCH_DEPT_ID: this.searchParams.SRCH_DEPT_ID,
            SRCH_USER_ID: this.searchParams.SRCH_USER_ID,
            SRCH_USER_NM: this.searchParams.SRCH_USER_NM,
            //SRCH_USER_STTS_CD: this.USER_STTS_CD,
            SRCH_USER_STTS_CD :  this.USER_STTS_CD == true ? 'WORK' : 'RTRM',
        };

        let headParam = {};

        let response = await this.common_postCall(
            sUrl,
            postParam,
            headParam,
        );
        if (!response.HEADER.ERROR_FLAG) {
            this.evaluationReportList = response.DATA.map((row) => {
                if (row.ICON_IMG_URI !== "/")
                    row.IMG = "/upload/" + row.ICON_IMG_URI;
                else
                    row.IMG = require("@/assets/img/@manager_profile_default.png");
                return row;
            });

            console.log("evaluationReportList ::: ",this.evaluationReportList)

            if(this.evaluationReportList.length > 0){
              this.changeFileName();
            }

        } else {
            this.showAlert(this.MESSAGE.ERROR.ERROR);
        }
    },

    getPreviousScore(employee, month) {
      if (month === 1) return employee.X_SCORE_12 !== "" ? parseFloat(employee.X_SCORE_12) : null;
      if (month === 2) return employee.SCORE_1 !== "" ? parseFloat(employee.SCORE_1) : (employee.X_SCORE_12 !== "" ? parseFloat(employee.X_SCORE_12) : null);
      if (month === 3) return employee.SCORE_2 !== "" ? parseFloat(employee.SCORE_2) : (employee.SCORE_1 !== "" ? parseFloat(employee.SCORE_1) : null);

      return employee[`SCORE_${month - 1}`] !== ""
        ? parseFloat(employee[`SCORE_${month - 1}`])
        : (employee[`SCORE_${month - 2}`] !== ""
          ? parseFloat(employee[`SCORE_${month - 2}`])
          : (employee[`SCORE_${month - 3}`] !== "" ? parseFloat(employee[`SCORE_${month - 3}`]) : null));
    },

    getPreviousScore_team(employee, month) {
      if (month === 1) return employee.TOT_X_SCORE_12 !== "" ? parseFloat(employee.TOT_X_SCORE_12) : null;
      if (month === 2) return employee.TOT_SCORE_1 !== "" ? parseFloat(employee.TOT_SCORE_1) : (employee.TOT_X_SCORE_12 !== "" ? parseFloat(employee.TOT_X_SCORE_12) : null);
      if (month === 3) return employee.TOT_SCORE_2 !== "" ? parseFloat(employee.TOT_SCORE_2) : (employee.TOT_SCORE_1 !== "" ? parseFloat(employee.TOT_SCORE_1) : null);

      return employee[`TOT_SCORE_${month - 1}`] !== ""
        ? parseFloat(employee[`TOT_SCORE_${month - 1}`])
        : (employee[`TOT_SCORE_${month - 2}`] !== ""
          ? parseFloat(employee[`TOT_SCORE_${month - 2}`])
          : (employee[`TOT_SCORE_${month - 3}`] !== "" ? parseFloat(employee[`TOT_SCORE_${month - 3}`]) : null));
    },

    calculateProve(score, p_score) {
      if (p_score === 0) {
        return `${(Math.round(score * 100) / 100).toFixed(2)}%`;
      } else if (p_score) {
        let prove = ((score / p_score - 1) * 100);
        return `${(Math.round(prove * 100) / 100).toFixed(2)}%`;
      } else {
        return '-';
      }
    },

    calculateProve_team(score, p_score) {
      if (p_score === 0) {
        return `${(Math.round(score * 100) / 100).toFixed(2)}%`;
      } else if (p_score) {
        let prove = ((score / p_score - 1) * 100);
        return `${(Math.round(prove * 100) / 100).toFixed(2)}%`;
      } else {
        return '-';
      }
    },

    closeSlide(){
      this.dialogDetail = false
    }
  },
  async mounted() {

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if (this.DROP_CENTER_LIST.length > 0) {
        this.searchParams.CENTER_ID = this.DROP_CENTER_LIST.find((row) => {return row.value == centerId; }) ? centerId : this.DROP_CENTER_LIST[0].value;
    }

    this.selectDeptList();
    this.selectEvaluationReportList();
  },

  async created() {
    //평가기준년월 콤보용
    this.evl_crtr_code = await this.mixin_evl_crtr_list();
  },

  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },

    processedReports() {
      return this.evaluationReportList.map((employee) => {
        let processedEmployee = { ...employee };

        for (let j = 1; j <= 12; j++) {
          const scoreKey = `SCORE_${j}`;
          const score = employee[scoreKey] !== "" && employee[scoreKey] !== null ? parseFloat(employee[scoreKey]) : null;
          let p_score, prove;

          if (score !== null) {
            switch (this.improve_type) {
              case 'M':
                p_score = j === 1
                  ? (employee.X_SCORE_12 !== "" && employee.X_SCORE_12 !== null ? parseFloat(employee.X_SCORE_12) : null)
                  : (employee[`SCORE_${j - 1}`] !== "" && employee[`SCORE_${j - 1}`] !== null ? parseFloat(employee[`SCORE_${j - 1}`]) : null);
                break;
              case 'E':
                p_score = this.getPreviousScore(employee, j);
                break;
              case 'Y':
                p_score = employee.X_SCORE_AVG !== "" && employee.X_SCORE_AVG !== null ? parseFloat(employee.X_SCORE_AVG) : null;
                break;
            }

            prove = this.calculateProve(score, p_score);
          } else {
            prove = '-';
          }

          processedEmployee[scoreKey] = score !== null ? score.toFixed(2) : '-';
          //processedEmployee[`y_score_avg`] = parseFloat(employee.SCORE_AVG || 0).toFixed(2);
          //obj[i]['y_score_avg'] = Math.round(parseFloat(obj[i].SCORE_AVG) * 100) / 100.0;
          processedEmployee['Y_SCORE_AVG'] = Math.round(parseFloat(employee.SCORE_AVG) * 100) / 100.0;
          processedEmployee[`PROVE_${j}`] = prove;
        }

        if(this.group_type === 'team'){
          for (let j = 1; j <= 12; j++) {
            const tot_scoreKey = `TOT_SCORE_${j}`;
            const tot_score = employee[tot_scoreKey] !== "" && employee[tot_scoreKey] !== null ? parseFloat(employee[tot_scoreKey]) : null;
            let tot_p_score, tot_prove;

            if (tot_score !== null) {
              switch (this.improve_type) {
                case 'M':
                  tot_p_score = j === 1
                    ? (employee.TOT_X_SCORE_12 !== "" && employee.TOT_X_SCORE_12 !== null ? parseFloat(employee.TOT_X_SCORE_12) : null)
                    : (employee[`TOT_SCORE_${j - 1}`] !== "" && employee[`TOT_SCORE_${j - 1}`] !== null ? parseFloat(employee[`TOT_SCORE_${j - 1}`]) : null);
                  break;
                case 'E':
                  tot_p_score = this.getPreviousScore_team(employee, j);
                  break;
                case 'Y':
                  tot_p_score = employee.TOT_X_SCORE_AVG !== "" && employee.TOT_X_SCORE_AVG !== null ? parseFloat(employee.TOT_X_SCORE_AVG) : null;
                  break;
              }

              tot_prove = this.calculateProve_team(tot_score, tot_p_score);

            } else {
              tot_prove = '-';
            }
            processedEmployee[tot_scoreKey] = tot_score !== null ? tot_score.toFixed(2) : '-';
            processedEmployee['TOT_Y_SCORE_AVG'] = Math.round(parseFloat(employee.TOT_SCORE_AVG) * 100) / 100.0;
            processedEmployee[`TOT_PROVE_${j}`] = tot_prove;
          }
        }

        if(this.group_type === 'work'){
          var term = employee.TERM_TYPE;
					var term_nm = term === 'term1' ? '10년이상' : term === 'term2' ? '5년~10년' : term === 'term3' ? '3년~5년' : term === 'term4' ? '2년~3년' :
										term === 'term5' ? '1년~2년' : term === 'term6' ? '6개월~1년' : term === 'term7' ? '3개월~6개월' : term === 'term8' ? '3개월미만' : '기타';
          var term_sort = term === 'term1' ? '8' : term === 'term2' ? '7' : term === 'term3' ? '6' : term === 'term4' ? '5' :
          term === 'term5' ? '4' : term === 'term6' ? '3' : term === '2' ? '3개월~6개월' : term === '1' ? '3개월미만' : '0';
          processedEmployee['TERM_SORT'] = term_sort;
          processedEmployee[`EVAL_DEPT_NM`] = term_nm;
        }

        return processedEmployee;
      });
    },

    computedHeaders() {
      const baseHeaders = [
        { text: '순위', value: 'RANK', align: 'center', width: '50px', sortable: false }
      ];

      let typeSpecificHeaders = [];
      if (this.group_type === 'emp') {
        typeSpecificHeaders = [
          { text: '성명', value: 'EVAL_EMP_NM', align: 'left', width: '80px', sortable: true },
          { text: '사번', value: 'EVAL_EMP_NO', align: 'left', width: '70px', sortable: true },
          { text: '소속', value: 'EVAL_DEPT_NM', align: 'left', width: '100px', sortable: true }
        ];
      } else if (this.group_type === 'team') {
        typeSpecificHeaders = [
          { text: '소속', value: 'EVAL_DEPT_NM', align: 'left', width: '100px', sortable: false }
        ];
      } else if (this.group_type === 'work') {
        typeSpecificHeaders = [
          { text: '소속', value: 'EVAL_DEPT_NM', align: 'left', width: '100px', sortable: false }
        ];
      }
      const monthlyHeaders = Array.from({ length: 12 }, (_, i) => [
        { text: `${i + 1}월 점수`, value: `SCORE_${i + 1}`, align: 'center px-0 is-txt-blue', width: '60px', sortable: false },
        { text: `${i + 1}월 향상도`, value: `PROVE_${i + 1}`, align: 'center px-0', width: '60px', sortable: false }
      ]).flat();

      const averageHeader = [{ text: '평균', value: 'Y_SCORE_AVG', align: 'center px-0', width: '60px', sortable: false }];

      return baseHeaders.concat(typeSpecificHeaders, monthlyHeaders, averageHeader);
    },

  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>