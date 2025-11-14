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
                :items="mixin_ognz_list_detail(common_ognz_list, SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID, '전체','Y'/*콜센터여부,없으면전체*/ )"
                placeholder="조직을 검색하세요"
                return-object
                no-data-text="결과 없음"
                :disabled="SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            기준
          </span>
          <div class="pl-desc">
            <v-select
                v-model="modelBaseDate"
                :items="['조회기간','평가기준']"
                class="pl-form type-middle is-sm"
                placeholder="조회기간"/>
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
        <div class="pl-form-inline">
          <span class="pl-label">
            성명
          </span>
          <div class="pl-desc">
            <v-text-field
                class="pl-form type-middle"
                v-model="SRCH_PARAMS_TOP.SRCH_USER_NM"
                @keydown.enter="selectGridList"
                placeholder="성명입력" />
          </div>
        </div>
        <!-- 버튼 -->
        <div>
          <v-btn class="pl-btn is-icon" @click="selectGridList">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
        </div>
      </div>
    </div>
    <!-- grid top -->
    <div class="pl-grid-top is-border-top pt-2">
      <div class="pl-grid-top-left">
        <span class="pl-bullet-txt is-blue">{{modelBaseDate}} 근무 일수 <strong class="ml-1">({{ WORK_DAY_COUNT }}일)</strong></span>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ GRID.ITEMS_TOT_CNT }})</em> 명</span>
        <!-- 엑셀 다운로드 버튼  mixin_testLog('엑셀 다운로드')  -->
        <compo-tooltip-btn
            TitleProp="엑셀 다운로드"
            ClassProp="pl-tooltip-btn "
            IconProp="pl-icon20 exceldown"
            TooltipPositionProp="bottom"
            @btnClick="customExcelDown"
        ></compo-tooltip-btn>

<!--
         <compo-excel
              TypeProp="Download"
              :DataHeaderProp="GRID.HEADERS_EXCEL"
              :DataBodyProp="GRID.ITEMS"
              :FileNameProp="fileName"
              SheetNameProp="근태관리현황"
            /> -->
      </div>
    </div>
    <!-- grid -->
    <v-data-table
        class="pl-grid has-img is-mt-s table-container"
        :style="`${computedUserType !== 'ETC_ADMIN' ? 'max-width: calc(100vw - 400px)' : 'max-width: calc(100vw - 290px)'}`"
        :headers="GRID.HEADERS"
        :items="GRID.ITEMS"
        fixed-header
        item-key="ROW_NUMBER"
        height="calc(100vh - 288px)"
        hide-default-header
        hide-default-footer
	no-data-text="등록된 데이터가 없습니다."
        :items-per-page="-1"
        :loading="mixin_loadding">
      <template v-slot:header>
        <thead class="v-data-table-header multi-row">
        <tr>
          <th rowspan="2" width="50px" class="text-center"><span>번호</span></th>
          <th rowspan="2" width="100px" class="text-center"><span>성명</span></th>
          <th rowspan="2" width="90px" class="text-center"><span>소속</span></th>
          <th rowspan="2" width="100px" class="text-center"><span>직무</span></th>
          <th rowspan="2" width="50px" class="text-center"><span>직급</span></th>
          <th
              rowspan="2"
              width="75px"
              style="box-shadow: inset 1px 1px 0 0px var(--primary-color) !important;"
              class="text-center"><span>근무일수</span></th>
          <th
              rowspan="2"
              width="65px"
              style="box-shadow: inset -1px 1px 0 0px var(--primary-color) !important;"
              class="text-center"><span>휴가일수</span></th>

          <th v-for="item in GRID.DATE_RANGE" width="49px" class="text-center"><span>{{ item.MMDD }}</span></th>
        </tr>
        <tr>
          <th v-for="item in GRID.DATE_RANGE" width="49px" class="text-center">
              <span>
                  <strong v-if="item.HLDY ==='Y'" class="is-txt-red">{{ item.W }}</strong>
                  <strong v-if="item.HLDY !=='Y'" class="is-txt-black">{{ item.W }}</strong>
                  <strong v-if="SRCH_PARAMS_TOP.SRCH_TODAY.replaceAll('-','') === item.YYYYMMDD" class="is-txt-yellow">(*)</strong>
              </span>
          </th>
        </tr>
        </thead>
      </template>
      <template v-slot:item.USER_NM="{ item }">
        <img :src="item.IMG" :alt="item.USER_NM" class="pl-grid-portrait"  @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}" style="border-radius: 50%;">
        <strong class="ml-1">{{ item.USER_NM }}</strong>
      </template>
      <!-- 실근무일수 -->
      <template v-slot:item.USER_WORK_DAY_COUNT="{ item }">
        <td
          style="box-shadow: inset 1px 0px 0 0px var(--primary-color) !important;"
          :style="GRID.ITEMS.length == item.ROW_NUMBER && 'box-shadow: inset 1px 0px 0 0px var(--primary-color), inset 0px -1px 0 0px var(--primary-color) !important'"
          class="text-center">
          {{item.USER_WORK_DAY_COUNT}}
          </td>
      </template>
      <!-- 휴가일수 -->
      <template v-slot:item.RFLT_RT_TOTAL="{ item }">
        <td
          style="box-shadow: inset -1px 0px 0 0px var(--primary-color) !important;"
          :style="GRID.ITEMS.length == item.ROW_NUMBER && 'box-shadow: inset -1px -1px 0 0px var(--primary-color) !important'"
          class="text-center">
          {{item.RFLT_RT_TOTAL}}
          </td>
      </template>

      <template v-slot:[`item.H_${header.YYYYMMDD}`]="{ item }" v-for="(header, idx) in GRID.DATE_RANGE">
        <td @dblclick="dialogAtndnDetail(header.YYYYMMDD, item, item[`H_${header.YYYYMMDD}_ID`])" :class="`${ item[`H_${header.YYYYMMDD}_HLDY`] ==='Y' ? 'is-bg-light  text-center is-hover':'text-center is-hover' }`">
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                {{item[`H_${header.YYYYMMDD}`]}}
              </span>
            </template>
            <span>{{item[`H_${header.YYYYMMDD}_NM`]}}</span>
          </v-tooltip>
        </td>
      </template>
    </v-data-table>
    <!-- temp: 사용자 정보 모달 -->
    <v-dialog
        v-model="dialogProfile"
        width="420"
        content-class="pl-top-profile-dialog type-center"
        persistent>
      <compo-dialog
          header-title="개인 정보"
          :HideCloseProp=false
          @hide="mixin_hideDialog('Profile')"
      >
        <template slot="body">
          <!-- 데이터 있을때 -->
          <template >
            <div class="">
              <!-- top -->
              <div class="d-flex ">
                <div class="">
                  <img
                      :src="GRID.CLICK_DATA.IMG"
                      :alt="GRID.CLICK_DATA.USER_NM"
                      style="width: 35px; max-height: 40px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}" />
                </div>
                <div class="pl-top-profile-dialog-desc-wrap ml-3">
                  <strong style="font-size: 15px">{{ GRID.CLICK_DATA.USER_NM }}</strong><span class="is-txt-sub">({{ GRID.CLICK_DATA.USER_ID }})</span>
                  <span class="is-txt-sub ml-1">{{GRID.CLICK_DATA.JBPS_CD_NM}}</span>
                  <div>
                    {{GRID.CLICK_DATA.CUSTCO_NM}} - {{GRID.CLICK_DATA.DEPT_NM}}
                  </div>
                </div>
                <v-btn
                    @click="dialogProfile = false"
                    plain
                    min-width="22"
                    height="22"
                    class="pl-tooltip-btn ml-auto"
                >
                  <v-icon
                      small
                      class="pl-icon20 dialog-close-black">
                  </v-icon>
                </v-btn>
              </div>
              <div class=" py-3">
                <div class="is-border-sub-top pt-3 ">
                  <div class="spacing-wrap sp-8 flex-column">
                    <div class="d-flex align-center">
                      <v-icon class="pl-icon20 document"></v-icon>
                      <strong class="ml-1" style="flex: 0 0 80px">근태유형</strong>
                      <span >{{ GRID.CLICK_DATA.WKATTD_ARTCL_NM }}</span>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon class="pl-icon20 date-simple"></v-icon>
                      <strong class="ml-1" style="flex: 0 0 80px">적용일시</strong>
                      <span class="is-txt-sub">{{ GRID.CLICK_DATA.APLCN_YMD_DD }}</span>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon class="pl-icon20 date-simple"></v-icon>
                      <strong class="ml-1" style="flex: 0 0 80px">로그인시간</strong>
                      <span class="is-txt-sub">{{ GRID.CLICK_DATA.LGN_DT_TM }}</span>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon class="pl-icon20 tit-paragraph"></v-icon>
                      <strong class="ml-1" style="flex: 0 0 80px">사유</strong>
                      <span class="">{{GRID.CLICK_DATA.DMND_RSN}}</span>
                    </div>
                    <div class="is-border-sub-top mt-1 pt-3">
                      <div class="spacing-wrap sp-8 flex-column">
                        <div class="d-flex align-center">
                          <v-icon class="pl-icon20 person-chk"></v-icon>
                          <strong class="ml-1" style="flex: 0 0 80px">처리자</strong>
                          <span class="">{{GRID.CLICK_DATA.MDFR_NM}}</span>
                        </div>
                        <div class="d-flex align-center">
                          <strong style="flex: 0 0 80px; margin-left: 23px">처리일시</strong>
                          <span class="is-txt-sub">{{GRID.CLICK_DATA.MDFCN_DT}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans ml-auto" @click="mixin_hideDialog('Profile')">닫기</v-btn>
          <v-btn class="pl-btn" @click="[mixin_hideDialog('Profile'), dialogAtndnDetail(GRID.CLICK_DATA.APLCN_YMD, GRID.CLICK_DATA, '' )]">수정</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- temp: 사용자 정보 모달  - 정상출근 -->
    <v-dialog
        v-model="dialogProfileEdit"
        width="420"
        content-class="pl-top-profile-dialog type-center"
        persistent>
      <compo-dialog
          header-title="개인 정보"
          :HideCloseProp=false
          @hide="mixin_hideDialog('ProfileEdit')"
      >
        <template slot="body">
          <!-- 데이터 있을때 -->
          <template >
            <div class="">
              <!-- top -->
              <div class="d-flex ">
                <div class="">
                  <img
                      :src="GRID.CLICK_DATA.IMG"
                      :alt="GRID.CLICK_DATA.USER_NM"
                      @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}"
                      style="max-width: 40px;border-radius: 50%;" />
                </div>
                <div class="pl-top-profile-dialog-desc-wrap ml-3">
                  <strong style="font-size: 15px">{{ GRID.CLICK_DATA.USER_NM }}</strong><span class="is-txt-sub">({{ GRID.CLICK_DATA.USER_ID }})</span>
                  <span class="is-txt-sub ml-1">{{GRID.CLICK_DATA.JBPS_CD_NM}}</span>
                  <div>
                    {{GRID.CLICK_DATA.CUSTCO_NM}} - {{GRID.CLICK_DATA.DEPT_NM}}
                  </div>
                </div>
                <v-btn
                    @click="dialogProfileEdit = false"
                    plain
                    min-width="22"
                    height="22"
                    class="pl-tooltip-btn ml-auto"
                >
                  <v-icon
                      small
                      class="pl-icon20 dialog-close-black">
                  </v-icon>
                </v-btn>
              </div>
              <div class=" py-3">
                <div class="is-border-sub-top pt-3">
                  <div class="spacing-wrap sp-8 flex-column">
                    <div class="d-flex align-center">
                      <v-icon class="pl-icon20 document"></v-icon>
                      <strong class="ml-1" style="flex: 0 0 80px">근태유형</strong>
                      <div class="spacing-wrap sp-4">
                        <v-select
                            class="pl-form type-middle is-sm"
                            v-model="GRID.CLICK_DATA.WKATTD_ARTCL_CLSF_CD"
                            :items="mixin_common_code_get(common_code,'ATDC_TP','')"
                            placeholder="선택"
                            @change="GRID.CLICK_DATA.WKATTD_ARTCL_CD = ''"
                        ></v-select>
                        <v-select
                            style="flex: 0 0 152px"
                            class="pl-form type-middle"
                            v-model="GRID.CLICK_DATA.WKATTD_ARTCL_CD"
                            :items="mixin_wkattd_code_get(wkattd_code, GRID.CLICK_DATA.WKATTD_ARTCL_CLSF_CD, '')"
                            placeholder="선택"
                        ></v-select>
                      </div>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon
                          style="flex: 0 0 20px"
                          class="pl-icon20 date-simple"></v-icon>
                      <strong class="ml-1" style="flex: 0 0 80px">적용일자</strong>
                      {{ GRID.CLICK_DATA.APLCN_YMD_DD }}
                    </div>
                    <div class="is-border-sub-top mt-1 pt-3">
                      <div class="spacing-wrap sp-8 flex-column">
                        <div class="d-flex align-center">
                          <v-icon class="pl-icon20 person-chk"></v-icon>
                          <strong class="ml-1" style="flex: 0 0 80px">처리자</strong>
                          <span class="">{{this.user_name}}</span><span class="is-txt-sub">({{ this.user_id }})</span>
                        </div>
                        <div class="d-flex ">
                          <strong style="flex: 0 0 80px; margin-left: 23px">처리사유</strong>
                          <v-textarea
                              height="80"
                              class="pl-form is-noresize"
                              v-model="GRID.CLICK_DATA.DMND_RSN"
                              :spellcheck="false"
                              placeholder="사유를 입력하세요."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans ml-auto" @click="mixin_hideDialog('ProfileEdit')">닫기</v-btn>
          <v-btn class="pl-btn" @click="saveAtndnInfo">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HOME_TEAM_TAB03", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {

      common_ognz_list:[], //조직
      common_code:[], //공통코드
      common_code_global:[], //공통코드
      wkattd_code:[], //근태코드
      evl_crtr_code:[], //평가기준 년월
      SRCH_PARAMS_TOP:{
        SRCH_CENTER: {},  //센터
        SRCH_DEPT: {},
        SRCH_DEPT_DISABLED:false,
        SRCH_ST: this.$moment(new Date()).subtract(14,'days').format('YYYY-MM-DD'),
        SRCH_END: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_TODAY: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_USER_NM:'',
      },
      WORK_DAY_COUNT:0, /* 조회기간 근무일수 */

      modelBaseDate: '조회기간',
      modelDateY: this.$moment(new Date()).format('YYYY'),
      modelDateM: {},

      dialogProfile: false,
      dialogProfileEdit: false,

      // grid
      GRID : {
        INIT_HEADERS:[
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '70px', sortable: false },
          { text: '성명', value: 'USER_NM', align: 'center', width: '130px' },
          { text: '소속', value: 'DEPT_NM', align: 'center', width: '90px', sortable: false },
          { text: '직무', value: 'DUTY_GROUP_NM', align: 'center', width: '90px', sortable: false },
          { text: '직급', value: 'DUTY_CD_NM', align: 'center', width: '60px', sortable: false },
          { text: '근무일수', value: 'USER_WORK_DAY_COUNT', align: 'center', width: '70px', sortable: false },
          { text: '휴가 일수', value: 'RFLT_RT_TOTAL', align: 'center', width: '60px', sortable: false },
        ],
        HEADERS:[],
        DATE_RANGE:[],
        ITEMS:[],
        ITEMS_TOT_CNT:0,
        CLICK_DATA:[],
        CLICK_DATA_BEFORE:[],
        CLICK_DATA_WKATTD_CODE: [],

        HEADERS_EXCEL:[],
      },

      fileName:"근태관리현황",
    }
  },
  methods: {
    closeModal(){
      this.$store.commit("alertStore/hideAlert");
      this.GRID.CLICK_DATA = {};
      this.selectGridList();
    },


    // 엑셀형식으로 다운로드 한다
    async customExcelDown() {

      if( (this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === '')
          && (this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === '') ) {
        return;
      }

      let sUrl = '/api/lhcs/system/user/selectEmpAtndnOgnzList_Excel';
      const postParam = {};

      postParam.SRCH_TYPE = 'CUSL';
      if(this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== undefined && this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== '') {
        postParam.SRCH_DEPT_ID = this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID;
      }else {
        postParam.SRCH_GROUP_ID = this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID;
      }
      postParam.SRCH_USER_NM = this.SRCH_PARAMS_TOP.SRCH_USER_NM;
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");

      postParam.ITEMS = this.GRID.ITEMS;

      this.mixin_loadding = true;

      try {
        const response = await axios.post(sUrl, postParam, {
          responseType: "blob", // 파일 데이터 수신 설정
        });
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // 다운로드 링크 생성 및 클릭
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "근태 관리 대장.xlsx"; // 파일명 설정
        link.click();

        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Excel download failed:", error);
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
      this.mixin_loadding = false;
    },

    //조회기간에따른 헤더 업데이트
    updateGridHeaders() {

      this.GRID.HEADERS = JSON.parse(JSON.stringify(this.GRID.INIT_HEADERS))/*DeepCopy*/;
      this.GRID.DATE_RANGE = this.mixin_getDateRange(this.SRCH_PARAMS_TOP.SRCH_ST , this.SRCH_PARAMS_TOP.SRCH_END); //조회기간의 날짜배열
      this.GRID.DATE_RANGE.map(data => {
        this.GRID.HEADERS.push({text: data.W, value: 'H_' + data.YYYYMMDD, align: 'center', width: '60px', sortable: false});
      });
    },
    async selectGridList() {
      if( (this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === '')
          && (this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === '') ) {
        return;
      }
      this.GRID.ITEMS = [];
      this.mixin_loadding = true;
      await this.updateGridHeaders(); //조회기간에따른 헤더 업데이트

      let sURL = '/api/lhcs/system/user/selectEmpAtndnOgnzList';
      let postParam = {};
      postParam.SRCH_TYPE = 'CUSL';
      if(this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== undefined && this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== '') {
        postParam.SRCH_DEPT_ID = this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID;
      }else {
        postParam.SRCH_GROUP_ID = this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID;
      }
      postParam.SRCH_USER_NM = this.SRCH_PARAMS_TOP.SRCH_USER_NM;
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");

      let headParam = {};
      let resData = await this.common_postCall(sURL, postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {
        let response = resData.DATA;
        let responseAtndn = resData.ATNDN_DATA;

        this.WORK_DAY_COUNT = responseAtndn[0].WORK_DAY_COUNT;  //조회기간근무일수

        let i = 0;
        response.map(item => {
          if( item.ICON_IMG_URI !== '/' ) {
            response[i]["IMG"] = '/upload/' + item.ICON_IMG_URI;
          }else {
            response[i]["IMG"] = require('@/assets/img/@manager_profile_default.png');
          }
          this.GRID.DATE_RANGE.map(data => {
            let srchDateUser = this.searchAtndnObj(responseAtndn, data.YYYYMMDD, item.USER_ID);
            if( !this.mixin_isEmpty(srchDateUser.USER_WKATTD_ID)  ) {

              response[i]["USER_WORK_DAY_COUNT"] = srchDateUser.USER_WORK_DAY_COUNT;  //개인 근무일수
              response[i]["RFLT_RT_TOTAL"] = srchDateUser.RFLT_RT_TOTAL;  //휴가수

              data.HLDY = srchDateUser.HLDY;
              response[i]["H_" + data.YYYYMMDD] = srchDateUser.WKATTD_ARTCL_SHORT_NM;
              response[i]["H_" + data.YYYYMMDD+"_NM"] = srchDateUser.WKATTD_ARTCL_NM;
              response[i]["H_" + data.YYYYMMDD+"_ID"] = srchDateUser.USER_WKATTD_ID;
              response[i]["H_" + data.YYYYMMDD+"_HLDY"] = data.HLDY;
              response[i]["H_" + data.YYYYMMDD+"_W"] = data.W;

            }else {
              data.HLDY = this.searchAtndnHldy(responseAtndn, data.YYYYMMDD);
              response[i]["H_" + data.YYYYMMDD] = '';
              response[i]["H_" + data.YYYYMMDD+"_ID"] = '';
              response[i]["H_" + data.YYYYMMDD+"_HLDY"] = data.HLDY;
              response[i]["H_" + data.YYYYMMDD+"_W"] = data.W;
            }
          });
          return i++;
        });
        this.GRID.ITEMS = [...this.GRID.ITEMS, ...response];
        this.GRID.ITEMS_TOT_CNT = resData.HEADER.TOT_COUNT;
      }else {
        this.GRID.ITEMS = [];
      }
      this.mixin_loadding = false;
    },
    searchAtndnHldy(atndnData, srchDate) {
      let returnHldy = 'N';
      for( var i=0; i<atndnData.length; i++) {
        if( atndnData[i].SRCH_DATE === srchDate ) {
          returnHldy = atndnData[i].HLDY;
          break;
        }
      }
      return returnHldy;
    },
    searchAtndnObj(atndnData, srchDate, userId) {
      let returnObj = {};
      for( var i=0; i<atndnData.length; i++) {
        if( atndnData[i].SRCH_DATE === srchDate && atndnData[i].USER_ID === userId ) {
          returnObj = atndnData[i];
          break;
        }
      }
      return returnObj;
    },

    async dialogAtndnDetail(srchDate, obj, id) {
      this.GRID.CLICK_DATA = {};
      this.GRID.CLICK_DATA_BEFORE = {};
      if( this.mixin_isEmpty(id) ){
        this.GRID.CLICK_DATA = JSON.parse(JSON.stringify(obj))/*DeepCopy*/;
        this.GRID.CLICK_DATA.APLCN_YMD_DD = srchDate.substring(0,4) + "-" + srchDate.substring(4,6) + "-" + srchDate.substring(6,8);
        this.mixin_showDialog('ProfileEdit');
      }else {
        this.mixin_showDialog('Profile');
      }

      let sURL = '/api/biz/common/select/selectEmpAtndnDetail';
      let postParam = {};
      if( this.mixin_isEmpty(id) ) {
        postParam.SRCH_USER_ID = obj.USER_ID;
        postParam.SRCH_DATE = srchDate;
      }else {
        postParam.SRCH_USER_WKATTD_ID = id;
      }

      let headParam = {head: {"ns": 'lhcs.system.user.dao.AtndnMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (response.HEADER.COUNT > 0) {
        this.GRID.CLICK_DATA_BEFORE = JSON.parse(JSON.stringify(response.DATA[0]))/*DeepCopy*/;
        this.GRID.CLICK_DATA = JSON.parse(JSON.stringify(response.DATA[0]))/*DeepCopy*/;
        this.GRID.CLICK_DATA.IMG = obj.IMG;
        this.GRID.CLICK_DATA.USER_NM = obj.USER_NM;
        this.GRID.CLICK_DATA.JBPS_CD_NM = obj.JBPS_CD_NM;
        this.GRID.CLICK_DATA.CUSTCO_NM = obj.CUSTCO_NM;
        this.GRID.CLICK_DATA.DEPT_NM = obj.DEPT_NM;
      }
    },

    async saveAtndnInfo() {

      console.log(" ==> ");
      console.log( this.GRID.CLICK_DATA_BEFORE.WKATTD_ARTCL_CD + '==' + this.GRID.CLICK_DATA.WKATTD_ARTCL_CD );

      if (this.mixin_isEmpty(this.GRID.CLICK_DATA.WKATTD_ARTCL_CLSF_CD) ) {
        this.showAlertCaution({msg: '근무유형을 선택하세요.'});
        return;
      }
      if (this.mixin_isEmpty(this.GRID.CLICK_DATA.WKATTD_ARTCL_CD) ) {
        this.showAlertCaution({msg: '근무유형을 선택하세요.'});
        return;
      }

      if (this.mixin_isEmpty(this.GRID.CLICK_DATA.DMND_RSN) ) {
        this.showAlertCaution({msg: '사유를 입력하세요'});
        return;
      }
      this.showConfirmInfo({
        msg: '정보를 저장하시겠습니까?', callYes: this.saveAtndnInfoProcess, callNo: () => {
          this.$store.commit("alertStore/hideAlert")
        }
      })
    },
    async saveAtndnInfoProcess() {
      let sURL = '/api/lhcs/system/user/saveEmpAtndnInfo';
      let postParam = this.GRID.CLICK_DATA;
      postParam.BEFORE_WKATTD_ARTCL_CD = this.GRID.CLICK_DATA_BEFORE.WKATTD_ARTCL_CD;
      postParam.SRCH_USER_ID = this.GRID.CLICK_DATA.USER_ID;
      postParam.APLCN_YMD = this.GRID.CLICK_DATA.APLCN_YMD_DD.replaceAll("-","");
      postParam.EXEC_USER_ID = this.user_id;
      let headParam = {}
      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.mixin_hideDialog('ProfileEdit');
        this.closeModal();
      }
    },

    changeCrtrListCombo() {
      console.log("changeCrtrListCombo");
      console.log( this.modelDateM );
      if( typeof this.modelDateM === "object") {
        this.SRCH_PARAMS_TOP.SRCH_ST = this.modelDateM.EVL_BGNG_DAY_DD;
        this.SRCH_PARAMS_TOP.SRCH_END = this.modelDateM.EVL_END_DAY_DD;
        this.selectGridList();
      }else {
        this.showToastCaution({msg : '평가기준정보가 없습니다.'})
      }
    }
  },
  async mounted() {
    console.log( "mounted()" );
  },
  beforeDestroy() {
    this.$eventBus.$off("reloadHomeTab3Search"); //eventBus 중복방지를 위해 off
  },
  async created() {
    console.log( "created()" );
    //조직
    this.common_ognz_list = await this.mixin_ognz_list();

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

    //휴가 처리 후 재조회
    this.$eventBus.$on("reloadHomeTab3Search", (custInfo) => {
      this.selectGridList();
    });

    //공통코드설정
    let codeName = ['ATDC_TP'/* 근태그룹코드 */];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.wkattd_code = await this.mixin_wkattd_code_list(); //근태코드

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

    //목록조회
    await this.selectGridList();
  },
  computed: {
  },
  watch: {
    modelBaseDate() {
      if( this.modelBaseDate === '조회기간') {
        this.GRID.ITEMS = [];
        this.GRID.ITEMS_TOT_CNT = 0;
        this.SRCH_PARAMS_TOP.SRCH_ST = this.$moment(new Date()).subtract(14,'days').format('YYYY-MM-DD');
        this.SRCH_PARAMS_TOP.SRCH_END = this.$moment(new Date()).format('YYYY-MM-DD');
        this.selectGridList();
      }else if( this.modelBaseDate === '평가기준') {
        this.GRID.ITEMS = [];
        this.GRID.ITEMS_TOT_CNT = 0;
        this.changeCrtrListCombo();
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.table-container { width:100%; overflow-x:auto; white-space: nowrap; }
.table-container table{ width:auto; }
</style>