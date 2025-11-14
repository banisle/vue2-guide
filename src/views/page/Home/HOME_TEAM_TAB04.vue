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
                :items="mixin_ognz_list_detail(common_ognz_list, SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID, '전체' ,'Y'/*콜센터여부,없으면전체*/)"
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
      <div class="pl-grid-top-center">
        <span class="is-blue">※ 가로 스크롤 하시면 모든항목 확인 가능합니다.</span>
      </div>
      <div class="pl-grid-top-utils">
        <v-checkbox v-model="SRCH_PARAMS_TOP.SRCH_EVL_APLCN_YN" label="평가적용항목만표시" class="pl-check" @change="changeSrchEvlAplcnYn"></v-checkbox> |
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ GRID.ITEMS_TOT_CNT }})</em> 명</span>
        <!-- 엑셀 다운로드 버튼
        <compo-tooltip-btn
          TitleProp="엑셀 다운로드"
          ClassProp="pl-tooltip-btn "
          IconProp="pl-icon20 exceldown"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('엑셀 다운로드')"
        ></compo-tooltip-btn> -->

        <compo-excel
            ref="compoExcel"
            TypeProp="Download"
            :DataHeaderProp="GRID.HEADERS"
            :DataBodyProp="GRID.ITEMS"
            :FileNameProp="fileName"
            SheetNameProp="가감점 현황"
            style="display: none;"
          />

        <CompoExceldownOpt
          ref="CompoExceldownOpt"
          @downloadSelected="(data)=>{downloadSelected(data)}"
        />
      </div>
    </div>
    <v-data-table
        class="pl-grid has-img is-mt-s is-header-lg table-container"
        :style="`${computedUserType !== 'ETC_ADMIN' ? 'max-width: calc(100vw - 405px)' : 'max-width: calc(100vw - 290px)'}`"
        :headers="GRID.HEADERS"
        :items="GRID.ITEMS"
        fixed-header
        item-key="ROW_NUMBER"
        height="calc(100vh - 288px)"
        hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
        :items-per-page="-1"
        :loading="mixin_loadding">

        <template v-slot:item.USER_NM="{ item }">
          <img :src="item.IMG" :alt="item.USER_NM" class="pl-grid-portrait" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
          <strong class="ml-1">{{ item.USER_NM }}</strong>
        </template>
        <template v-slot:item.ADORSUB_TOTAL="{ item }">
          <td
            style="box-shadow: inset 1px 0px 0 0px var(--primary-color), inset -1px 0px 0 0px var(--primary-color) !important;"
            :style="GRID.ITEMS.length == item.ROW_NUMBER && 'box-shadow: inset 1px 0px 0 0px var(--primary-color), inset -1px -1px 0 0px var(--primary-color) !important'"
            @dblclick="dialogAborsubTotalDetail(item)" class="text-center is-hover">
            <strong>{{item.ADORSUB_TOTAL}}</strong>
          </td>
        </template>
        <template v-slot:[`item.${header.ADORSUB_ARTCL_CD}`]="{ item }" v-for="(header, idx) in common_aborsub_list">
          <td @dblclick="dialogAborsubDetail(header, item)" class="text-center is-hover">
            {{item[`${header.ADORSUB_ARTCL_CD}`]}}
          </td>
        </template>
    </v-data-table>

    <!-- dialog detail -->
    <v-dialog
        persistent
      v-model="dialogDetail"
      content-class="pl-top-profile-dialog type-center is-nopadding dialog-draggable"
      width="600">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="상세 정보"
        @hide="mixin_hideDialog('Detail')"
      >
        <template slot="body">
          <!-- 데이터 있을때 -->
          <template >
            <div class="">
              <!-- top -->
              <div class="d-flex px-6 py-4">
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
                  @click="mixin_hideDialog('Detail')"
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
              <!-- grid -->
              <div class="px-6 pb-4">
                <div class="pl-grid-top">
                  <div class="pl-grid-top-left">
                    <span class="pl-subtit d-flex align-center">
                      <v-icon class="pl-icon20 document"></v-icon>
                      <span class="ml-1" v-if="GRID.CLICK_DATA.STRT_YN === 'N'">가점<span class="is-txt-blue">({{ GRID.CLICK_DATA.ARTCL_NM }})</span></span>
                      <span class="ml-1" v-if="GRID.CLICK_DATA.STRT_YN === 'Y'">감점<span class="is-txt-red">({{ GRID.CLICK_DATA.ARTCL_NM }})</span></span>
                      <span class="pl-badge is-bg-blueGray ml-2 mt-1 px-2">총 {{ dialogItemsTotScore }}점</span>
                    </span>
                  </div>
                  <div class="pl-grid-top-utils">
                    {{SRCH_PARAMS_TOP.SRCH_ST}} ~ {{SRCH_PARAMS_TOP.SRCH_END}} ,
                    <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ dialogItems.length }})</em> 건</span>
                  </div>
                </div>
                <v-data-table
                  class="pl-grid is-mt-s"
                  :headers="dialogHeaders"
                  :items="dialogItems"
                  fixed-header
                  item-key="index"
                  height="170px"
                  hide-default-footer
		              no-data-text="등록된 데이터가 없습니다."
                  :item-class="isDialogActiveRow"
                  @click:row="selectDialogRow"
                  :items-per-page="-1">
                  <template v-slot:item.RSN="{item}">
                    <v-tooltip content-class="pl-tooltip " bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                          {{ item.RSN }}
                        </span>
                      </template>
                      <span>{{ item.RSN }}</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
                <div class="pt-3">
                  <div class="d-flex align-center">
                    <span class="pl-subtit">가감점 상세 내용</span>
                    <div class="ml-auto">
                      <compo-tooltip-btn
                        TitleProp="추가"
                        ClassProp="pl-tooltip-btn"
                        IconProp="pl-icon20 circle-plus"
                        TooltipPositionProp="bottom"
                        @btnClick="initHrCrtnSchdForm"
                      ></compo-tooltip-btn>
                      <compo-tooltip-btn
                        TitleProp="삭제"
                        ClassProp="pl-tooltip-btn ml-1"
                        IconProp="pl-icon20 trash"
                        TooltipPositionProp="bottom"
                        @btnClick="deleteAdorsubHstry"
                      ></compo-tooltip-btn>
                    </div>
                  </div>
                  <!-- form -->
                  <div class="pl-form-inline-wrap vertical label-100 gap-8 is-mt-s pt-3 is-border-sub-top">
                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 parts-date"></v-icon>
                        <span class="ml-1">등록일</span>
                      </span>
                      <div class="pl-desc">
                        <compo-date-picker
                          StyleProp="flex: 0 0 115px"
                          DateType="dateInput"
                          :DateProp.sync="dialogItemsClickData.APLCN_YMD"/>
                        <v-text-field
                          style="flex: 0 0 170px"
                          class="pl-form type-middle "
                          v-model="GRID.CLICK_DATA.DEPT_NM"
                          disabled
                        />
                        <v-text-field
                          class="pl-form type-middle is-sm"
                          v-model="GRID.CLICK_DATA.USER_NM"
                          disabled
                        />
                      </div>
                    </div>

                    <div class="pl-form-inline type-multi">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 board-docu"></v-icon>
                        <span class="ml-1">가감점 항목</span>
                      </span>
                      <div class="pl-desc d-flex">
                        <v-select
                          v-model="dialogItemsClickData.STRT_YN"
                          class="pl-form type-middle "
                          :items="dialogSTRT_YN"
                          placeholder="선택"
                        ></v-select>
                        <v-select
                          class="pl-form type-middle"
                          style="flex: 0 0 155px"
                          v-model="dialogItemsClickData.ADORSUB_ARTCL_OBJ"
                          :items="combo_aborsub_list( dialogItemsClickData.STRT_YN, '선택')"
                          return-object
                          placeholder="선택"
                          @change="dialogItemsClickData.SCR = dialogItemsClickData.ADORSUB_ARTCL_OBJ.SCR"
                        ></v-select>
                        <span class="pl-label" style="flex: 0 0 40px !important">
                          <span class="ml-1">점수</span>
                        </span>
                        <v-text-field
                          style="flex: 0 0 76px"
                          class="pl-form type-middle"
                          v-model="dialogItemsClickData.SCR"
                          disabled
                        />
                      </div>
                    </div>

                    <div class="pl-form-inline">
                      <span class="pl-label">
                        <v-icon class="pl-icon20 tit-paragraph"></v-icon>
                        <span class="ml-1">내용</span>
                      </span>
                      <div class="pl-desc">
                        <v-text-field
                          class="pl-form type-middle"
                          v-model="dialogItemsClickData.RSN"
                          placeholder="내용 입력"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="dialogDetail = false">닫기</v-btn>
          <v-btn class="pl-btn" @click="saveAdorsubInfo">{{ mixin_isEmpty(dialogItemsClickData.USER_ADORSUB_HSTRY_ID) ? '저장' : '수정' }}</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <v-dialog
        persistent
        v-model="dialogTotalDetail"
        content-class="pl-top-profile-dialog type-center is-nopadding dialog-draggable"
        width="600" >
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="상세 정보"
          @hide="mixin_hideDialog('TotalDetail')"
      >
        <template slot="body">
          <!-- 데이터 있을때 -->
          <template >
            <div style="height:480px">
              <!-- top -->
              <div class="d-flex px-6 py-4">
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
                    @click="mixin_hideDialog('TotalDetail')"
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
              <!-- grid -->
              <div class="px-6 pb-4">
                <div class="pl-grid-top">
                  <div class="pl-grid-top-left">
                    <span class="pl-subtit d-flex align-center">
                      <span class="pl-badge is-bg-blueGray ml-2 mt-1 px-2">총 {{ dialogTotalItemsTotScore }}점</span>
                    </span>
                  </div>
                  <div class="pl-grid-top-utils">
                    {{SRCH_PARAMS_TOP.SRCH_ST}} ~ {{SRCH_PARAMS_TOP.SRCH_END}} ,
                    <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ dialogTotalItems.length }})</em> 건</span>
                  </div>
                </div>
                <v-data-table
                    class="pl-grid is-mt-s"
                    :headers="dialogTotalHeaders"
                    :items="dialogTotalItems"
                    fixed-header
                    item-key="index"
                    height="350px"
                    hide-default-footer
                    no-data-text="등록된 데이터가 없습니다."
                    :items-per-page="-1">
                  <template v-slot:item.RSN="{item}">
                    <v-tooltip content-class="pl-tooltip " bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                          {{ item.RSN }}
                        </span>
                      </template>
                      <span>{{ item.RSN }}</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </div>
            </div>
          </template>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="dialogTotalDetail = false">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoExceldownOpt from '@/components/CompoExceldownOpt'
import axios from "axios";
export default {
  name: "HOME_TEAM_TAB04", //name은 'MENU_' + 파일명 조합
  components: {
    CompoExceldownOpt,
  },
  data() {
    return {
      common_ognz_list:[], //조직
      common_code:[], //공통코드
      common_code_global:[], //공통코드
      common_aborsub_list:[],
      evl_crtr_code:[], //평가기준 년월

      SRCH_PARAMS_TOP:{
        SRCH_CENTER: {},  //센터
        SRCH_DEPT: {},
        SRCH_DEPT_DISABLED:false,
        SRCH_ST: this.$moment(new Date()).subtract(14,'days').format('YYYY-MM-DD'),
        SRCH_END: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_TODAY: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_USER_NM:'',
        SRCH_STRT_YN:'',  /* 감점여부 */
        SRCH_EVL_APLCN_YN: false,
      },
      WORK_DAY_COUNT:0, /* 조회기간 근무일수 */
      GRID : {
        INIT_HEADERS:[
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '70px', sortable: false, cellClass: 'is-no-click' },
          { text: '성명', value: 'USER_NM', align: 'center', width: '130px', cellClass: 'is-no-click' },
          { text: '소속', value: 'DEPT_NM', align: 'center', width: '120px', sortable: false, cellClass: 'is-no-click' },
          { text: '직무', value: 'DUTY_GROUP_NM', align: 'center', width: '90px', sortable: false, cellClass: 'is-no-click' },
          { text: '직급', value: 'DUTY_CD_NM', align: 'center', width: '60px', sortable: false, cellClass: 'is-no-click' },
          { text: '가/감점', value: 'ADORSUB_TOTAL', align: 'center type-border', width: '70px', sortable: false , cellClass: 'is-no-click'},
        ],
        HEADERS:[],
        ITEMS:[],
        ITEMS_TOT_CNT:0,
        CLICK_DATA:[],
      },

      modelBaseDate: '조회기간',
      modelDateY: this.$moment(new Date()).format('YYYY'),
      modelDateM: {},

      // dialgo sample
      dialogTotalDetail: false,
      dialogTotalHeaders: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '등록일', value: 'APLCN_YMD', align: 'center', width: '90px', sortable: false },
        { text: '등록자', value: 'MDFR_NM', align: 'center', width: '70px', sortable: false },
        { text: '항목', value: 'ARTCL_NM', align: 'center', width: '90px', sortable: false },
        { text: '내용', value: 'RSN', align: '', width: '', sortable: false },
        { text: '점수', value: 'SCR', align: 'center', width: '50px', sortable: false },
      ],
      dialogTotalItems: [],
      dialogTotalItemsTotScore: 0,

      dialogDetail: false,
      dialogHeaders: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '등록일', value: 'APLCN_YMD', align: 'center', width: '90px', sortable: false },
        { text: '등록자', value: 'MDFR_NM', align: 'center', width: '70px', sortable: false },
        { text: '내용', value: 'RSN', align: '', width: '', sortable: false },
        { text: '점수', value: 'SCR', align: 'center', width: '50px', sortable: false },
      ],

      dialogItems: [],
      dialogItemsClickData:{
        APLCN_YMD: this.$moment(new Date()).format('YYYY-MM-DD'),
      },
      dialogItemsClickDataBefore:{},
      dialogItemsTotScore: 0,
      dialogSTRT_YN: [
        { text:'가점', value: 'N'},
        { text:'감점', value:'Y'},
      ],
      dialogSTRT_YN_ARTCL_OBJ: [],
      editMode: false,
      modelDialog01: '교육',
      modelDialog02: '가점',
      modelDialog03: '칭찬콜',

      selectedDownloadOption: null,
      fileName: '가감점 현황',
    }
  },
  methods: {
    closeModal(){
      this.$store.commit("alertStore/hideAlert");
      this.GRID.CLICK_DATA = {};
      this.selectGridList();
    },
    //조회기간에따른 헤더 업데이트
    async updateGridHeaders() {
      this.GRID.HEADERS = Object.assign([], this.GRID.INIT_HEADERS);
      this.common_aborsub_list.map(data => {
         this.GRID.HEADERS.push({text: data.ARTCL_NM, value: data.ADORSUB_ARTCL_CD, align: 'center', width: '64px', sortable: false, cellClass: "is-hover"});
      });
    },

    async selectGridList() {
      if( (this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === '')
          && (this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === '') ) {
        return;
      }
      this.GRID.ITEMS = [];
      this.mixin_loadding = true;
      this.updateGridHeaders(); //조회기간에따른 헤더 업데이트

      let sURL = '/api/lhcs/system/user/adorsub/selectEmpAdorsubList';
      let postParam = {};

      if(this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== undefined && this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== '') {
        postParam.SRCH_DEPT_ID = this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID;
      }else {
        postParam.SRCH_GROUP_ID = this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID;
      }
      postParam.SRCH_USER_NM = this.SRCH_PARAMS_TOP.SRCH_USER_NM;
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");
      if( this.SRCH_PARAMS_TOP.SRCH_EVL_APLCN_YN ) {
        postParam.SRCH_EVL_APLCN_YN = 'Y';
      }


      let headParam = {};
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG){
        let responseData = response.DATA;
        this.WORK_DAY_COUNT = responseData[0].WORK_DAY_COUNT;  //조회기간근무일수
        let i = 0;
        responseData.map(item => {
          if( item.ICON_IMG_URI !== '/' ) {
            responseData[i]["IMG"] = '/upload/' + item.ICON_IMG_URI;
          }else {
            responseData[i]["IMG"] = require('@/assets/img/@manager_profile_default.png');
          }
          return i++;
        });
        this.GRID.ITEMS = [...this.GRID.ITEMS, ...responseData];
        this.GRID.ITEMS_TOT_CNT = response.HEADER.TOT_COUNT;
      }else {
        this.GRID.ITEMS = [];
      }
      this.mixin_loadding = false;
    },
    async selectAdorsubCodeList() {
      var responseData = [];
      let sURL = '/api/lhcs/system/user/adorsub/selectAdorsubCodeList';
      let postParam = {};
      postParam.SRCH_STRT_YN = this.SRCH_PARAMS_TOP.SRCH_STRT_YN;
      if( this.SRCH_PARAMS_TOP.SRCH_EVL_APLCN_YN ) {
        postParam.SRCH_EVL_APLCN_YN = 'Y';
      }

      let headParam = {};
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG){
        responseData = response.DATA;
      }
      return responseData;
    },
    async dialogAborsubTotalDetail(itemObj) {
      this.GRID.CLICK_DATA = {};
      this.GRID.CLICK_DATA = JSON.parse(JSON.stringify(itemObj)) /*DeepCopy*/;
      this.mixin_showDialog('TotalDetail');
      this.dialogAborsubTotalDetailList();
    },
    async dialogAborsubTotalDetailList() {
      this.initDialogItemsClickData();
      let sURL = '/api/biz/common/select/selectAdorsubTotalDetail';
      let postParam = {};
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");
      postParam.SRCH_USER_ID = this.GRID.CLICK_DATA.USER_ID;
      if( this.SRCH_PARAMS_TOP.SRCH_EVL_APLCN_YN ) {
        postParam.SRCH_EVL_APLCN_YN = 'Y';
      }
      let headParam = {head: {"ns": 'lhcs.system.user.dao.AdorsubMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.dialogTotalItems = response.DATA;
        this.dialogTotalItemsTotScore = response.DATA[0].ADORSUB_CD_TOTAL;
      }else {
        this.dialogTotalItems = [];
      }
    },

    async dialogAborsubDetail(headerObj, itemObj) {
      this.GRID.CLICK_DATA = {};
      this.GRID.CLICK_DATA = JSON.parse(JSON.stringify(itemObj))/*DeepCopy*/;
      this.GRID.CLICK_DATA.STRT_YN = headerObj.STRT_YN; /* 가감점여부 */
      this.GRID.CLICK_DATA.ARTCL_NM = headerObj.ARTCL_NM; /* 항목명 */
      this.GRID.CLICK_DATA.ADORSUB_ARTCL_CD = headerObj.ADORSUB_ARTCL_CD;
      this.GRID.CLICK_DATA.SCR = headerObj.SCR;
      this.GRID.CLICK_DATA.EXPLN = headerObj.EXPLN;
      this.mixin_showDialog('Detail');
      this.dialogAborsubDetailList();
    },
    async dialogAborsubDetailList() {
      this.initDialogItemsClickData();
      let sURL = '/api/biz/common/select/selectAdorsubDetail';
      let postParam = {};
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");
      postParam.SRCH_ADORSUB_ARTCL_CD = this.GRID.CLICK_DATA.ADORSUB_ARTCL_CD;
      postParam.SRCH_USER_ID = this.GRID.CLICK_DATA.USER_ID;
      let headParam = {head: {"ns": 'lhcs.system.user.dao.AdorsubMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (response.HEADER.COUNT > 0) {
        this.dialogItems = response.DATA;
        this.dialogItemsTotScore = response.DATA[0].ADORSUB_CD_TOTAL;
      }
    },

    isDialogActiveRow(item) {
      const activeClass = item.USER_ADORSUB_HSTRY_ID === this.dialogItemsClickData.USER_ADORSUB_HSTRY_ID ? "active" : "";
      return activeClass;
    },
    async selectDialogRow( item ) {
      this.dialogItemsClickData = JSON.parse(JSON.stringify(item))/*DeepCopy*/;
      this.dialogItemsClickData.ADORSUB_ARTCL_OBJ = item.ADORSUB_ARTCL_CD;
      this.dialogItemsClickDataBefore = Object.assign({}, this.dialogItemsClickData);
    },

    combo_aborsub_list(strt_yn, strHeadText) {

      var responseData = [];
      if (strHeadText != "" && strHeadText != undefined) {
        responseData.push({ text: strHeadText, value: "" });
      }
      for (var i = 0; i < this.common_aborsub_list.length; i++) {
        let item = this.common_aborsub_list[i];
        item.text = item.ARTCL_NM
        item.value = item.ADORSUB_ARTCL_CD;
        if (item.STRT_YN === strt_yn) {
          responseData.push(item);
        }
      }
      this.dialogSTRT_YN_ARTCL_OBJ = responseData;
      return responseData;
    },

    async saveAdorsubInfo() {
      if (this.mixin_isEmpty(this.dialogItemsClickData.STRT_YN) ) {
        this.showAlertCaution({msg: '가감점항목을 선택하세요.'});
        return;
      }

      let tmpArtclCD = "";
      if( this.dialogItemsClickData.ADORSUB_ARTCL_OBJ.ADORSUB_ARTCL_CD != undefined) {
        tmpArtclCD = this.dialogItemsClickData.ADORSUB_ARTCL_OBJ.ADORSUB_ARTCL_CD;
      }else {
        tmpArtclCD = this.dialogItemsClickData.ADORSUB_ARTCL_OBJ;
      }
      if (this.mixin_isEmpty(tmpArtclCD) ) {
        this.showAlertCaution({msg: '가감점항목을 선택하세요.'});
        return;
      }

      let defaultMsg = "입력한 정보를 저장하시겠습니까?";
      if( !this.mixin_isEmpty( this.dialogItemsClickData.USER_ADORSUB_HSTRY_ID) ) {
        defaultMsg = "입력한 정보를 수정하시겠습니까?";
        if( this.dialogItemsClickData.APLCN_YMD === this.dialogItemsClickDataBefore.APLCN_YMD &&
            this.dialogItemsClickData.ADORSUB_ARTCL_CD !== this.dialogItemsClickDataBefore.ADORSUB_ARTCL_CD){
          this.showConfirmCaution({
            msg: "가감점 항목이 변경되었습니다. 수정하시겠습니까?", callYes: this.saveAdorsubInfoProcess, callNo: () => {
              this.$store.commit("alertStore/hideAlert")
            }
          })
        }
      }
      this.showConfirmInfo({
        msg: defaultMsg, callYes: this.saveAdorsubInfoProcess, callNo: () => {
          this.$store.commit("alertStore/hideAlert")
        }
      })
    },
    async saveAdorsubInfoProcess() {

      let sURL = '/api/biz/common/update/updateUserAdorsubHstry';
      if( this.mixin_isEmpty( this.dialogItemsClickData.USER_ADORSUB_HSTRY_ID ) ) {
        sURL = '/api/biz/common/insert/insertUserAdorsubHstry';
      }
      let headParam = {head:{ns : 'lhcs.system.user.dao.AdorsubMapper',seq_key : 'USER_ADORSUB_HSTRY_ID'}};
      let postParam = {};
      postParam.SRCH_USER_ADORSUB_HSTRY_ID = this.dialogItemsClickData.USER_ADORSUB_HSTRY_ID;
      postParam.SRCH_USER_ID = this.GRID.CLICK_DATA.USER_ID;
      postParam.EXEC_USER_ID = this.user_id;
      postParam.APLCN_YMD = this.dialogItemsClickData.APLCN_YMD.replaceAll("-","");
      postParam.SCR = this.dialogItemsClickData.SCR;
      postParam.RSN = this.dialogItemsClickData.RSN;
      if( this.dialogItemsClickData.ADORSUB_ARTCL_OBJ.ADORSUB_ARTCL_CD != undefined) {
        postParam.ADORSUB_ARTCL_CD = this.dialogItemsClickData.ADORSUB_ARTCL_OBJ.ADORSUB_ARTCL_CD;
      }else {
        postParam.ADORSUB_ARTCL_CD = this.dialogItemsClickData.ADORSUB_ARTCL_OBJ;
      }
      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.dialogAborsubDetailList();
        this.selectGridList();
      }
      this.$store.commit("alertStore/hideAlert");
    },

    async initHrCrtnSchdForm() {
      this.dialogItemsClickData.STRT_YN = '';
      this.dialogItemsClickData.ADORSUB_ARTCL_OBJ = '';
      this.dialogItemsClickData.SCR = '';
      this.dialogItemsClickData.RSN = '';
      this.dialogItemsClickData.USER_ADORSUB_HSTRY_ID = '';

      if( this.common_aborsub_list.length === 0 ) {
        this.common_aborsub_list = await this.selectAdorsubCodeList();// 가감점 코드목록.
      }
    },

    async deleteAdorsubHstry() {
      if( this.mixin_isEmpty( this.dialogItemsClickData.USER_ADORSUB_HSTRY_ID) ) {
        this.showAlertCaution({msg: '삭제하고자 하는 목록을 선택하세요.'});
        return;
      }

      this.showConfirmInfo({
        msg: '선택한 항목을 삭제하시겠습니까?'
        , callYes: this.deleteAdorsubHstryProcess
        , callNo: () => {
          this.$store.commit("alertStore/hideAlert")
        }
      })

    },
    async deleteAdorsubHstryProcess() {
      let sURL = '/api/biz/common/delete/deleteUserAdorsubHstry';
      let postParam = {};
      postParam.EXEC_USER_ID = this.user_id;
      postParam.SRCH_USER_ADORSUB_HSTRY_ID = this.dialogItemsClickData.USER_ADORSUB_HSTRY_ID;

      let headParam = {head: {"ns": 'lhcs.system.user.dao.AdorsubMapper',}}
      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){

        if( !this.mixin_isEmpty( this.dialogItemsClickData.ADORSUB_TRGT_CD ) && this.dialogItemsClickData.ADORSUB_TRGT_CD === 'CUTT_COACHING') {
          //코칭에 감점적용여부 N 으로 업데이트
          sURL = '/api/biz/common/update/updateCuttCoachingStrtAplcnYn';
          headParam = {head: {"ns": 'lhcs.phone.cutt.dao.PhoneCuttCoachingMapper',}}
          postParam.STRT_APLCN_YN = 'N'
          postParam.CUTT_COACHING_ID = this.dialogItemsClickData.ADORSUB_TRGT_VL; //외부에서 가감점을 주었을경우 해당 키값
          await this.common_postCall(sURL, postParam, headParam);
        }

        this.showToastInfo({msg:'삭제 처리 되었습니다.', callAfter:()=>{
            this.dialogAborsubDetailList();
            this.selectGridList();
          }}
        );
      }
      this.$store.commit("alertStore/hideAlert");
    },
    initDialogItemsClickData() {

      this.dialogItems= [];
      this.dialogItemsClickData = { APLCN_YMD: this.$moment(new Date()).format('YYYY-MM-DD') };
      this.dialogItemsClickDataBefore = {};
      this.dialogItemsTotScore = 0;

      this.dialogTotalItems = [];
      this.dialogTotalItemsTotScore = [];
    },
    changeCrtrListCombo() {
      if( typeof this.modelDateM === "object") {
        this.SRCH_PARAMS_TOP.SRCH_ST = this.modelDateM.EVL_BGNG_DAY_DD;
        this.SRCH_PARAMS_TOP.SRCH_END = this.modelDateM.EVL_END_DAY_DD;
        this.selectGridList();
      }else {
        this.showToastCaution({msg : '평가기준정보가 없습니다.'})
      }
    },
    async changeSrchEvlAplcnYn() {
      this.common_aborsub_list = await this.selectAdorsubCodeList();// 가감점 코드목록.
      this.selectGridList();
    },

    // 커스텀 요청 엑셀형식으로 다운로드 한다
    async customExcelDown() {

      let sUrl = '/phone-api/qt/selectAdorsubList_CustomExcelDown';
      const postParam = {};

      if(this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== undefined && this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== '') {
        postParam.SRCH_DEPT_ID = this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID;
      }else {
        postParam.SRCH_GROUP_ID = this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID;
      }
      postParam.SRCH_USER_NM = this.SRCH_PARAMS_TOP.SRCH_USER_NM;
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");
      if( this.SRCH_PARAMS_TOP.SRCH_EVL_APLCN_YN ) {
        postParam.SRCH_EVL_APLCN_YN = 'Y';
      }

      this.mixin_loadding = true;

      try {
        const response = await axios.post(sUrl, postParam, {
          responseType: "blob", // 파일 데이터 수신 설정
        });
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // 다운로드 링크 생성 및 클릭
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "가.감점 관리 대장.xlsx"; // 파일명 설정
        link.click();

        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Excel download failed:", error);
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
      this.mixin_loadding = false;
    },

    handleDownloadOption(option) {
      switch (option) {
        case 'C':
          // 현재 기준 다운로드 처리 로직
          console.log('현재 기준 다운로드를 선택했습니다.');
          const downloadButton = this.$refs.compoExcel.$el.querySelector('button'); // 다운로드 버튼 선택
          if (downloadButton) {
            downloadButton.click(); // 버튼 클릭
          } else {
            console.error('다운로드 버튼을 찾을 수 없습니다.');
          }
          break;
        case 'D':
          // 상세 기준 다운로드 처리 로직
          console.log('상세 기준 다운로드를 선택했습니다.');
          this.customExcelDown();
          break;
        default:
          console.log('알 수 없는 옵션입니다.');
          break;
      }
    },

    downloadSelected(selected){
      this.selectedDownloadOption = selected;
      this.handleDownloadOption(selected);
    }
  },
  mounted() {
    console.log("mounted");
  },
  async created() {
    console.log( "created()" );

    this.common_ognz_list = await this.mixin_ognz_list();//조직
    this.common_aborsub_list = await this.selectAdorsubCodeList();// 가감점 코드목록.

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

    //목록조회
    await this.selectGridList();

  },
  beforeDestroy() {
    
  },
  computed: {
  },
  watch: {
    dialogDetail() {
      this.initDialogItemsClickData();
    },
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
    },
  },
};
</script>
<style lang="scss" scoped>
.table-container { width:100%; overflow-x:auto; white-space: nowrap; }
.table-container table{ width:auto; }
</style>