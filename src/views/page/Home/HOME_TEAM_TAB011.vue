<template>
  <div class="px-6">
    <!-- search -->
    <div class="pl-search-form is-mt-m">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline" v-if="computedUserType === 'ETC_ADMIN'">
          <span class="pl-label">
            센터
          </span>
          <div class="pl-desc">
            <v-select
                class="pl-form type-middle is-md"
                placeholder="선택"
                v-model="SRCH_PARAMS_TOP.SRCH_CENTER"
                return-object
                :items="mixin_ognz_list_center(common_ognz_list, 'CUSL', '' )"
                @change="SRCH_PARAMS_TOP.SRCH_DEPT={}"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline" v-if="computedUserType === 'ETC_ADMIN' || computedUserType === 'LEADER'">
          <span class="pl-label">
            소속
          </span>
          <div class="pl-desc">
            <v-autocomplete
              class="pl-form type-middle is-md"
              v-model="SRCH_PARAMS_TOP.SRCH_DEPT"
              :items="mixin_ognz_list_detail(common_ognz_list, SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID, '전체', 'Y'/*콜센터여부,없으면전체*/ )"
              placeholder="조직을 검색하세요"
              return-object
              no-data-text="결과 없음"
              :disabled="SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            조회 기준
          </span>
          <div class="pl-desc">
            <v-select
              v-model="modelBaseDate"
              :items="['조회기간','평가기준']"
              class="pl-form type-middle is-sm"
              placeholder="조회기간"
            ></v-select>
            <template v-if="modelBaseDate === '평가기준'">
              <v-select
                  v-model="modelDateY"
                  :items="mixin_evl_crtr_list_combo(evl_crtr_code, 'year',null,undefined)"
                  class="pl-form type-middle is-sm"/>
              <v-select
                  v-model="modelDateM"
                  :items="mixin_evl_crtr_list_combo(evl_crtr_code, 'month',modelDateY,undefined)"
                  class="pl-form type-middle is-sm"
                  @change="changeCrtrListCombo"
                  return-object/>
            </template>
            <compo-date-range-picker
              ParentStyleProp="width: 300px"
              :StartDayProp.sync="SRCH_PARAMS_TOP.SRCH_ST"
              :EndDayProp.sync="SRCH_PARAMS_TOP.SRCH_END"
              @startDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_ST)"
              @endDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_END)"
            />
          </div>
        </div>
        <div class="pl-form-inline" >
          <span class="pl-label">
            성명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle"
              v-model="SRCH_PARAMS_TOP.SRCH_USER_NM"
              @keydown.enter="getCtiStaticList"
              placeholder="성명입력" />
          </div>
        </div>
        <!-- 버튼 -->
        <div>
          <v-btn class="pl-btn is-icon" @click="getCtiStaticList">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
        </div>
      </div>
    </div>
    <!-- grid top -->
    <div class="pl-grid-top is-border-top pt-2">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">{{modelBaseDate}} 근무 일수 <strong class="ml-1">({{ WORK_DAY_COUNT }}일)</strong></strong>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ gridTotalCnt }})</em> 명</span>
        <!-- 엑셀 다운로드 버튼 -->
        <compo-tooltip-btn
          TitleProp="엑셀 다운로드"
          ClassProp="pl-tooltip-btn "
          IconProp="pl-icon20 exceldown"
          TooltipPositionProp="bottom"
          @btnClick="customExcelDown"
        ></compo-tooltip-btn> 
        <!--
        <compo-excel
          ref="compoExcel"
          TypeProp="Download"
          :DataHeaderProp="headers"
          :DataBodyProp="items"
          :FileNameProp="fileName"
          SheetNameProp="상담콜 현황"
        />-->
      </div>
    </div>
    <v-data-table
      class="pl-grid has-img is-mt-s is-rowspan is-header-lg table-container"
      :headers="headers"
      :items="items"
      fixed-header
      item-key="RNUM"
      :style="`${computedUserType !== 'ETC_ADMIN' ? 'max-width: calc(100vw - 400px)' : 'max-width: calc(100vw - 290px)'}`"
      height="calc(-369px + 100vh)"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :item-class="isActiveRow"
      :items-per-page="-1"
      :loading="mixin_loadding"
      loading-text="조회중입니다."
      >
      <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
        <template v-if="header.value === 'REG_DT'">
          {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template v-else-if="header.value === 'USER_NM'">
          <img :src="'/upload/'+item['ICON_IMG_URI']" :alt="item[header.value]" class="pl-grid-portrait" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
          <strong class="ml-1">{{ item[header.value] }}</strong>
        </template>
        <template v-else>
          <template v-if="header.timeYn">
            {{ mixin_seconds_toHHMMSS(item[header.value]) }}
          </template>
          <template v-else>{{ item[header.value] }}</template>
        </template>
      </template>

      <!-- 합계 -->
      <template slot="footer">
        <div class="pl-grid-sum">
          <table >
            <colgroup>
              <col v-for="(col, index) in headers" :key="index" :width=col.width />
            </colgroup>
            <tbody >
              <tr >
                <td class="is-bg-light-green2 pl-grid-sum-head text-center" colspan="4" >합계</td>
                <td class="is-bg-light-green2 pl-0 text-center"> {{ TOTAL_RSPD_CNT }} </td>
                <td class="is-bg-light-green2 pl-0 text-center"> {{ TOTAL_DSPTCH_CTPV_CNT }} </td>
                <td class="is-bg-light-green2 pl-0 text-center"> {{ TOTAL_DSPTCH_SCS_CNT }} </td>
                <td class="is-bg-light-green2 pl-0 text-center"> {{ TOTAL_HOLD_CNT }} </td>
                <td class="is-bg-light-green2 pl-0 text-center"> {{ TOTAL_TRANSPHN_CNT }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_IB_CALL_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_OB_CALL_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_WHOL_CALL_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_IB_AFTPRCS_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_OB_AFTPRCS_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_WHOL_AFTPRCS_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_EDU_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_SPRT_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_RDY_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_HOLD_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_WORK_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_REST_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_MEAL_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_ETC_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_AVG_RING_HR) }} </td>
                <td class="is-bg-light-green2 pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(TOTAL_AVG_RDY_HR) }} </td>
              </tr>
              <tr >
                <td class="pl-grid-sum-head text-center " colspan="4" >평균</td>
                <td class="pl-0 text-center"> {{ isNaN((TOTAL_RSPD_CNT/gridTotalCnt/WORK_DAY_COUNT).toFixed(2)) ? 0 : (TOTAL_RSPD_CNT/gridTotalCnt/WORK_DAY_COUNT).toFixed(2) }}</td>
                <td class="pl-0 text-center">{{ isNaN((TOTAL_DSPTCH_CTPV_CNT/gridTotalCnt/WORK_DAY_COUNT).toFixed(2)) ? 0 : (TOTAL_DSPTCH_CTPV_CNT/gridTotalCnt/WORK_DAY_COUNT).toFixed(2) }} </td>
                <td class="pl-0 text-center">{{ isNaN((TOTAL_DSPTCH_SCS_CNT/gridTotalCnt/WORK_DAY_COUNT).toFixed(2)) ? 0 : (TOTAL_DSPTCH_SCS_CNT/gridTotalCnt/WORK_DAY_COUNT).toFixed(2) }} </td>
                <td class="pl-0 text-center">{{ isNaN((TOTAL_HOLD_CNT/gridTotalCnt/WORK_DAY_COUNT).toFixed(2)) ? 0 : (TOTAL_HOLD_CNT/gridTotalCnt/WORK_DAY_COUNT).toFixed(2) }} </td>
                <td class="pl-0 text-center">{{ isNaN((TOTAL_TRANSPHN_CNT/gridTotalCnt/WORK_DAY_COUNT).toFixed(2)) ? 0 : (TOTAL_TRANSPHN_CNT/gridTotalCnt/WORK_DAY_COUNT).toFixed(2) }} </td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_IB_CALL_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_IB_CALL_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_OB_CALL_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_OB_CALL_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_WHOL_CALL_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_WHOL_CALL_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_IB_AFTPRCS_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_IB_AFTPRCS_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_OB_AFTPRCS_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_OB_AFTPRCS_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_WHOL_AFTPRCS_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_WHOL_AFTPRCS_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_EDU_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_EDU_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_SPRT_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_SPRT_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_RDY_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_RDY_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_HOLD_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_HOLD_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_WORK_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_WORK_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_REST_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_REST_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_MEAL_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_MEAL_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_ETC_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_ETC_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_AVG_RING_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_AVG_RING_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
                <td class="pl-0 pr-1 text-center"> {{ mixin_seconds_toHHMMSS(isNaN(TOTAL_AVG_RDY_HR/gridTotalCnt/WORK_DAY_COUNT) ? 0 : TOTAL_AVG_RDY_HR/gridTotalCnt/WORK_DAY_COUNT) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

    </v-data-table>

  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HOME_TEAM_TAB011", //상담콜 현황
  components: {
  },
  data() {
    return {
      common_ognz_list:[], //조직
      common_code:[], //공통코드
      common_code_global:[], //공통코드
      evl_crtr_code:[], //평가기준 년월
      
      // search
      SRCH_PARAMS_TOP:{
        SRCH_CENTER: {},  //센터
        SRCH_DEPT: {},
        SRCH_DEPT_DISABLED:false,
        SRCH_ST: this.$moment(new Date()).subtract(1,'days').format('YYYY-MM-DD'),
        SRCH_END: this.$moment(new Date()).subtract(1,'days').format('YYYY-MM-DD'),
        SRCH_TODAY: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_USER_NM:'',
      },

      dropDetail: false,
      dialogFindAsBldgAdr : false,
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      modelBaseDate: '조회기간',
      modelDateY: this.$moment(new Date()).format('YYYY'),
      modelDateM: {},

      // grid
      fileName : '상담콜 현황',
      gridTotalCnt : 0,
      page: 1,
      pageCount: 0,
      perPage: [20,30,50,100],
      ROW_PER_PAGE: 20,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      nextDisabled : false,
      selectedRow : {},
      WORK_DAY_COUNT:0, /* 조회기간 근무일수 */

      headers: [
        { text: '번호', value: 'RNUM', align: 'center', width: '50px', sortable: false },
        { text: '성명', value: 'USER_NM', align: ' ', width: '95px', sortable: false },
        { text: '소속', value: 'DEPT_NM', align: 'center pa-0 ', width: '100px', sortable: false },
        { text: '직무', value: 'DUTY_GROUP_NM', align: 'center pa-0 ', width: '7%', sortable: false },
        { text: '응대호', value: 'RSPD_CNT', align: 'center pa-0 ', width: '6%', sortable: false },
        { text: '발신\n시도', value: 'DSPTCH_CTPV_CNT', align: 'center pa-0 ', width: '6%', sortable: false },
        { text: '발신\n성공', value: 'DSPTCH_SCS_CNT', align: 'center pa-0 ', width: '6%', sortable: false },
        { text: '보류건', value: 'HOLD_CNT', align: 'center pa-0 ', width: '6%', sortable: false },
        { text: '호전환', value: 'TRANSPHN_CNT', align: 'center pa-0 ', width: '6%', sortable: false },
        { text: 'IB통화\n시간', value: 'IB_CALL_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: 'OB통화\n시간', value: 'OB_CALL_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: '총 통화\n시간', value: 'WHOL_CALL_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: 'IB후처리\n시간', value: 'IB_AFTPRCS_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: 'OB후처리\n시간', value: 'OB_AFTPRCS_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: '총 후처리\n시간', value: 'WHOL_AFTPRCS_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: '교육시간', value: 'EDU_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: '지원시간', value: 'SPRT_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: '대기시간', value: 'RDY_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: '보류시간', value: 'HOLD_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: '근무시간', value: 'WORK_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: '휴식시간', value: 'REST_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: '식사시간', value: 'MEAL_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: '기타시간', value: 'ETC_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: '평균\n링시간', value: 'AVG_RING_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
        { text: '평균\n대기시간', value: 'AVG_RDY_HR', align: 'center pa-0 ', width: '6%', sortable: false, timeYn : true },
      ],
      items: [],

      // 합계
      TOTAL_RSPD_CNT : 0,
      TOTAL_DSPTCH_CTPV_CNT : 0,
      TOTAL_DSPTCH_SCS_CNT : 0,
      TOTAL_HOLD_CNT : 0,
      TOTAL_TRANSPHN_CNT : 0,
      TOTAL_IB_CALL_HR : 0,
      TOTAL_OB_CALL_HR : 0,
      TOTAL_WHOL_CALL_HR : 0,
      TOTAL_IB_AFTPRCS_HR : 0,
      TOTAL_OB_AFTPRCS_HR : 0,
      TOTAL_WHOL_AFTPRCS_HR : 0,
      TOTAL_EDU_HR : 0,
      TOTAL_SPRT_HR : 0,
      TOTAL_RDY_HR : 0,
      TOTAL_HOLD_HR : 0,
      TOTAL_WORK_HR : 0,
      TOTAL_REST_HR : 0,
      TOTAL_MEAL_HR : 0,
      TOTAL_ETC_HR : 0,
      TOTAL_AVG_RING_HR : 0,
      TOTAL_AVG_RDY_HR : 0,

    }
  },
  computed: {
  },
  watch: {
    modelBaseDate() {
      if( this.modelBaseDate === '조회기간') {
        this.clearItems();
        this.SRCH_PARAMS_TOP.SRCH_ST = this.$moment(new Date()).subtract(1,'days').format('YYYY-MM-DD');
        this.SRCH_PARAMS_TOP.SRCH_END = this.$moment(new Date()).subtract(1,'days').format('YYYY-MM-DD');
        this.getCtiStaticList();
      }else if( this.modelBaseDate === '평가기준') {
        this.clearItems();
        this.changeCrtrListCombo();
      }
    }
  },
  beforeDestroy(){
  },
  async created() {
    this.common_ognz_list = await this.mixin_ognz_list();//조직

    //평가기준년월 콤보용
    this.evl_crtr_code = await this.mixin_evl_crtr_list();
    //현재년월 세팅.
    let modelDateMObj = await this.evl_crtr_code.find((item) => (item.YR === this.$moment(new Date()).format('YYYY') && item.MM === this.$moment(new Date()).format('MM') ));
    if( modelDateMObj ) {
      this.modelDateM = {
        text: modelDateMObj.MM_TEXT,
        value: modelDateMObj.MM,
        MM: modelDateMObj.MM,
        EVL_BGNG_DAY: modelDateMObj.EVL_BGNG_DAY,
        EVL_END_DAY: modelDateMObj.EVL_END_DAY,
        EVL_BGNG_DAY_DD: modelDateMObj.EVL_BGNG_DAY_DD,
        EVL_END_DAY_DD: modelDateMObj.EVL_END_DAY_DD,
        WORK_DAY: modelDateMObj.WORK_DAY,
      };
    }

    if( this.computedUserType === 'LEADER' ) {
      this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID = this.computedUserCenter;
      this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = this.computedUserCenterDeptId;
      if( this.computedUserDetailType.indexOf("CENTER_LEADER") === -1) {  //센터장이 아닌경우 자기자신부서만.
        this.SRCH_PARAMS_TOP.SRCH_DEPT.value = this.computedUserDeptId;
        this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = this.computedUserDeptId;
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = true;
      }else {
        let first_obj = this.mixin_ognz_list_detail_first(this.common_ognz_list, this.computedUserCenterDeptId);
        if( first_obj ) { //첫번째 부서세팅.
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = first_obj.DEPT_ID;
          this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = first_obj.DEPT_ID;
        }else {
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = '';
        }
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = false;
      }
    }else if( this.computedUserType === 'ETC_ADMIN' ) {
      this.SRCH_PARAMS_TOP.SRCH_CENTER.value = "1000";
      this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = "1000";
      this.SRCH_PARAMS_TOP.SRCH_DEPT.value = '10004'; //마이홈1팀
      this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = '10004';
    }

    this.getCtiStaticList(); //상담콜 현황 조회
  },
  methods: {

    // 엑셀형식으로 다운로드 한다 
    async customExcelDown() {   

      let sUrl = '/api/biz/common/excel/ctiStaticList';
      const postParam = {};

      postParam.ITEMS = this.items;

      this.mixin_loadding = true;

      try {
        const response = await axios.post(sUrl, postParam, {
          responseType: "blob", // 파일 데이터 수신 설정
        });        
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // 다운로드 링크 생성 및 클릭
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "상담콜 현황.xlsx"; // 파일명 설정
        link.click();
        
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Excel download failed:", error);
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
      this.mixin_loadding = false;
    },
    //상담콜 현황 조회
    async getCtiStaticList() {
      if( (this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === '')
          && (this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === '') ) {
        return;
      }

      this.clearItems();

      this.mixin_loadding = true;

      let sURL = '/api/biz/common/select/ctiStaticList';
      let postParam = {};
      if(this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== undefined && this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== '') {
        postParam.SRCH_DEPT_ID = this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID;
      }else {
        postParam.SRCH_GROUP_ID = this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID;
      }
      postParam.SRCH_USER_NM = this.SRCH_PARAMS_TOP.SRCH_USER_NM;
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");

      let headParam = {head:{ns:'lhcs.statistics.dao.xml.StaticticsUserMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG){
        let responseData = response.DATA;

        response.DATA.forEach((item, idx) => {
          if('RSPD_CNT' in item) this.TOTAL_RSPD_CNT += Number(item.RSPD_CNT);
          if('DSPTCH_CTPV_CNT' in item) this.TOTAL_DSPTCH_CTPV_CNT += Number(item.DSPTCH_CTPV_CNT);
          if('DSPTCH_SCS_CNT' in item) this.TOTAL_DSPTCH_SCS_CNT += Number(item.DSPTCH_SCS_CNT);
          if('HOLD_CNT' in item) this.TOTAL_HOLD_CNT += Number(item.HOLD_CNT);
          if('TRANSPHN_CNT' in item) this.TOTAL_TRANSPHN_CNT += Number(item.TRANSPHN_CNT);
          if('IB_CALL_HR' in item) this.TOTAL_IB_CALL_HR += Number(item.IB_CALL_HR);
          if('OB_CALL_HR' in item) this.TOTAL_OB_CALL_HR += Number(item.OB_CALL_HR);
          if('WHOL_CALL_HR' in item) this.TOTAL_WHOL_CALL_HR += Number(item.WHOL_CALL_HR);
          if('IB_AFTPRCS_HR' in item) this.TOTAL_IB_AFTPRCS_HR += Number(item.IB_AFTPRCS_HR);
          if('OB_AFTPRCS_HR' in item) this.TOTAL_OB_AFTPRCS_HR += Number(item.OB_AFTPRCS_HR);
          if('WHOL_AFTPRCS_HR' in item) this.TOTAL_WHOL_AFTPRCS_HR += Number(item.WHOL_AFTPRCS_HR);
          if('EDU_HR' in item) this.TOTAL_EDU_HR += Number(item.EDU_HR);
          if('SPRT_HR' in item) this.TOTAL_SPRT_HR += Number(item.SPRT_HR);
          if('RDY_HR' in item) this.TOTAL_RDY_HR += Number(item.RDY_HR);
          if('HOLD_HR' in item) this.TOTAL_HOLD_HR += Number(item.HOLD_HR);
          if('WORK_HR' in item) this.TOTAL_WORK_HR += Number(item.WORK_HR);
          if('REST_HR' in item) this.TOTAL_REST_HR += Number(item.REST_HR);
          if('MEAL_HR' in item) this.TOTAL_MEAL_HR += Number(item.MEAL_HR);
          if('ETC_HR' in item) this.TOTAL_ETC_HR += Number(item.ETC_HR);
          if('AVG_RING_HR' in item) this.TOTAL_AVG_RING_HR += Number(item.AVG_RING_HR);
          if('AVG_RDY_HR' in item) this.TOTAL_AVG_RDY_HR += Number(item.AVG_RDY_HR);
        });


        this.items = responseData;
        this.WORK_DAY_COUNT = responseData[0].WORK_DAY_COUNT;  //조회기간근무일수

        this.gridTotalCnt = response.HEADER.TOT_COUNT;
      }else {
        this.clearItems();
      }
      this.mixin_loadding = false;
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    clearItems(){
      this.gridTotalCnt = 0;
      this.items = [];
      this.TOTAL_RSPD_CNT = 0;
      this.TOTAL_DSPTCH_CTPV_CNT = 0;
      this.TOTAL_DSPTCH_SCS_CNT = 0;
      this.TOTAL_HOLD_CNT = 0;
      this.TOTAL_TRANSPHN_CNT = 0;
      this.TOTAL_IB_CALL_HR = 0;
      this.TOTAL_OB_CALL_HR = 0;
      this.TOTAL_WHOL_CALL_HR = 0;
      this.TOTAL_IB_AFTPRCS_HR = 0;
      this.TOTAL_OB_AFTPRCS_HR = 0;
      this.TOTAL_WHOL_AFTPRCS_HR = 0;
      this.TOTAL_EDU_HR = 0;
      this.TOTAL_SPRT_HR = 0;
      this.TOTAL_RDY_HR = 0;
      this.TOTAL_HOLD_HR = 0;
      this.TOTAL_WORK_HR = 0;
      this.TOTAL_REST_HR = 0;
      this.TOTAL_MEAL_HR = 0;
      this.TOTAL_ETC_HR = 0;
      this.TOTAL_AVG_RING_HR = 0;
      this.TOTAL_AVG_RDY_HR = 0;
    },

    changeCrtrListCombo() {
      if( typeof this.modelDateM === "object") {
        this.SRCH_PARAMS_TOP.SRCH_ST = this.modelDateM.EVL_BGNG_DAY_DD;
        this.SRCH_PARAMS_TOP.SRCH_END = this.modelDateM.EVL_END_DAY_DD;
        this.getCtiStaticList();
      }else {
        this.showToastCaution({msg : '평가기준정보가 없습니다.'});
      }
    }
  },
};
</script>
<style lang="scss" scoped>

</style>