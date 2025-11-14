<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top placeholder="전체"-->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
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
                평가연도
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="modelDateY"
                  :items="mixin_evl_crtr_list_combo(evl_crtr_code, 'year',null,'전체')"
                  class="pl-form type-middle is-sm"/>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                평가지 상태
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle is-sm"
                  placeholder="전체"
                  :items="mixin_common_code_get(this.allCodeList, 'EVST', '전체')"
                  v-model="searchParams.PROC_STAT"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                평가지 제목
              </span>
              <div class="pl-desc">
               <v-text-field
                class="pl-form type-middle is-lg"
                placeholder="검색어 입력"
                v-model="searchParams.SRCH_PAPER_TITLE"
                @keyup.enter="changeSearchParams"
               ></v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
              <v-checkbox
                  v-model="CHECK_EVAL_YEAR"
                  class="pl-check"
                  label="미사용 평가지 포함"
                  input-value="true"></v-checkbox>
            </div>
            <div>
              <v-btn class="pl-btn is-icon" @click="clickSearchBtn('')" >
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
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left">
            <v-btn class="pl-btn is-icon is-trans" @click="click_strg">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-trans" @click="deletePaperItems">
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
            <v-btn class="pl-btn is-icon is-trans" @click="excelUpload">
              <span class="pl-icon20 upload-all"></span>
              일괄 업로드
            </v-btn>
            <v-btn class="pl-btn is-icon is-trans" @click="templeteExcelDown">
              <span class="pl-icon20 template"></span>
              업로드 템플릿
            </v-btn>
            <v-btn class="pl-btn is-icon is-trans" @click="paperDownload">
              <span class="pl-icon20 template"></span>
              평가지 다운로드
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ evalQstnPaperList.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼
            <compo-tooltip-btn
              TitleProp="엑셀 다운로드"
              ClassProp="pl-tooltip-btn "
              IconProp="pl-icon20 exceldown"
              TooltipPositionProp="bottom"
              @btnClick="mixin_testLog('엑셀 다운로드')"
            ></compo-tooltip-btn>-->

            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="headers"
              :DataBodyProp="evalQstnPaperList"
              :FileNameProp="fileName"
              SheetNameProp="평가지 관리 현황"
            />
          </div>
        </div>
        <!-- grid v-model="checkedQtTypeList" -->
        <v-data-table
          class="pl-grid is-mt-s is-hover has-control"
          :headers="headers"
          :items="evalQstnPaperList"
          v-model="checkedQtTypeList"
          show-select
          single-select
          fixed-header
          item-key="ROW_NUM"
          height="calc(-306px + 100vh)"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          @dblclick:row="selRow"
          no-data-text="등록된 데이터가 없습니다."
          :page.sync="page"
          @page-count="pageCount = $event">
          <!-- 문제수  mixin_showDialog('ManageQuestion') -->
           <!-- @click="click_strg2(item.PAPER_TITLE, item.PAPER_ID, item.QSTN_NO, item.CENTER_ID)"                -->
          <template v-slot:item.QSTN_CNT="{ item }" >
            <v-btn
              @click="click_strg3({ item })"
              class="pl-btn is-sm is-esp">{{ item.QSTN_CNT }}  </v-btn>
          </template>
          <!-- 평가지 확정 -->
          <template v-slot:item.PROC_STAT_NM="{ item }">
            <span
              :class="`pl-badge is-${mixin_displayStatus(item.PROC_STAT_NM, 'STAT_LIST')}`"
              style="width: 60px;"
              >
            {{ item.PROC_STAT_NM }}</span>
          </template>
        </v-data-table>
        <div class="pl-pager">
        <div class="pl-pager-row">
          <span>페이지당 항목 수</span>
          <v-select
            class="pl-form"
            :value="ROW_PER_PAGE"
            :items="perPage"
            :item-text="toString(ROW_PER_PAGE)"
            @change="ROW_PER_PAGE = parseInt($event, 10);"
          ></v-select>
        </div>
        <v-pagination
          v-model="page"
          :length="pageCount"
          circle
          :total-visible="7">
        </v-pagination>

        <!-- 더보기 다음 있을때만 노출 -->
        <span class="pl-pager-period">
          보기 {{ mixin_getPagePeriod(evalQstnPaperList, page) }} / {{ evalQstnPaperList.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            :DisabledProp = "nextDisabled"
            @btnClick="clickSearchBtn('next')"
          ></compo-tooltip-btn>
        </span>
      </div>
      </div>
    </div>

    <!-- dialog:평가지 정보 등록 -->
    <v-dialog
      v-model="dialogShowDetail"
      v-if="dialogShowDetail"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="평가지 정보"
        @hide="mixin_hideDialog('ShowDetail')"
        @submit="submitDialog('ShowDetail')"
      >
        <template slot="body">
          <!-- <QTM_M0100_DIALOG_DETAIL /> -->
          <div>
            <p>평가계획은 센터를 기준으로 수립할 수 있으며, 평가 계획에 설정한 문항 개수와 총점은 평가지에 문항 등록 시 적용됩니다. 평가 시행 후에는 수정/삭제할 수 없습니다. </p>

            <v-form ref="form">
              <div class="pl-form-inline-wrap vertical label-80 gap-8 is-mt-s">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    센터
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form type-middle"
                      placeholder="선택"
                      :items="DROP_CENTER_LIST"
                      :rules="validateRules.CENTER_ID"
                      v-model="CENTER_ID"
                      :disabled="true"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    평가지 제목
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form type-middle"
                      placeholder="평가지명 입력"
                      :rules="validateRules.PAPER_TITLE"
                      v-model="PAPER_TITLE"
                      :disabled="!isConfirm"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    평가 종류
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form type-middle"
                      placeholder="선택"
                      :items="mixin_common_code_get(this.allCodeList, 'TEST_DV', '')"
                      :rules="validateRules.EVAL_MNG"
                      v-model="EVAL_MNG"
                      :disabled="!isConfirm"
                    ></v-select>
                  </div>
                  <span class="pl-label">
                    문제 배열
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form type-middle"
                      placeholder="선택"
                      :items="mixin_common_code_get(this.allCodeList, 'PAPER_ORD', '')"
                      :rules="validateRules.QSTN_ARR"
                      v-model="QSTN_ARR"
                      :disabled="!isConfirm"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    문항 개수
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form type-middle"
                      type="number"
                      oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                       :rules="validateRules.QSTN_CNT"
                       v-model="QSTN_CNT"
                       :disabled="!isConfirm"
                    />
                  </div>
                  <span class="pl-label">
                    총 점수
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form type-middle"
                      type="number"
                      oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                      :rules="validateRules.TOT_SCORE"
                      v-model="TOT_SCORE"
                      :disabled="!isConfirm"

                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    평가지 설명
                  </span>
                  <div class="pl-desc">
                    <v-textarea
                      class="pl-form is-noresize"
                      :spellcheck="false"
                      placeholder="평가지 설명 입력"
                      height="150"
                      v-model="RMRK"
                      :disabled="!isConfirm"
                    />
                  </div>
                </div>
              </div>
            </v-form>

          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="()=>{
            mixin_hideDialog('ShowDetail')
            isConfirm = true
          }">닫기</v-btn>
          <v-btn class="pl-btn" @click="clickSaveBtn()" :disabled="!isConfirm">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- dialog:평가지 문항 관리 hide-overlay -->
    <v-dialog
      v-model="dialogManageQuestion"
      v-if="dialogManageQuestion"
      content-class="dialog-draggable is-nopadding is-maxHeight"
      width="1500"
      :retain-focus="false"
      >
      <div class="draggable-area " >drag area</div>
      <compo-dialog
        header-title="평가지 문항 관리"
        @hide="mixin_hideDialog('ManageQuestion')"
        @submit="submitDialog('ManageQuestion')"
      >
        <template slot="body" >
          <QTM_M0100_DIALOG_MANAGE
            :propsQstnPaperData="qstnPaperData"
            ref="QTM_M0100_DIALOG_MANAGE"
            @Tabchange="ManageStat"            
            @closeFn003="closeFn003"
            @closeFn001="closeFn001"
            @refresh="closeRefresh"
            />
        </template>
        <template slot="footer">
          <div class="spacing-wrap sp-4">
            <!-- v-btn class="pl-btn is-esp">평가지 저장</!-->
            <template v-if="manage_stat === 0">
              <v-btn class="pl-btn is-esp2" @click="confirmSaveFn()" v-if="qstnPaperData.PROC_STAT !== 'ISMHEVST003'">평가지 확정</v-btn>
              <v-btn class="pl-btn is-esp3" @click="confirmCanFn()" :disabled="!qstnPaperData.isConfirm" v-if="qstnPaperData.PROC_STAT === 'ISMHEVST003'">평가지 확정 취소</v-btn>
              <v-btn class="pl-btn" @click="clickCopyBtn()">평가지 복사</v-btn>
            </template>
          </div>
           <v-btn class="pl-btn is-trans ml-auto"  @click="mixin_hideDialog('ManageQuestion')">닫기</v-btn>
          <v-btn class="pl-btn "  @click="saveFn()" :disabled="qstnPaperData.PROC_STAT !== 'ISMHEVST001'">문항 저장</v-btn> <!--평가중, 평가지 확정 상태는 disabled -->
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- dialog 일괄 업로드: -->
    <v-dialog
      v-model="dialogUploadAll"
      content-class="dialog-draggable "
      width="1600"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="평가지 문항 일괄 업로드"
        @hide="mixin_hideDialog('UploadAll')"
        @submit="submitDialog('UploadAll')"
      >
        <template slot="body">
          <QTM_M0100_DIALOG_UPLOAD
          ref="QTM_M0100_DIALOG_UPLOAD"
          @close="mixin_hideDialog('UploadAll')"
          :propsQstnPaperData="this.qstnPaperData"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('UploadAll')">닫기</v-btn>
          <v-btn class="pl-btn" @click="excelUploadSave()">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
 </div>
</template>

<script>
import QTM_M0100_DIALOG_DETAIL from '@/views/page/QTM_M0100_DIALOG_DETAIL'
import QTM_M0100_DIALOG_UPLOAD from '@/views/page/QTM_M0100_DIALOG_UPLOAD'
import QTM_M0100_DIALOG_MANAGE from '@/views/page/QTM_M0100_DIALOG_MANAGE'
//import QTM_M0100_DIALOG_MANAGE from './QTM_M0100_DIALOG_MANAGE'

import axios from "axios";

export default {
  name: "MENU_QTM_M0100", // 평가지 관리
  components: {
    QTM_M0100_DIALOG_DETAIL,
    QTM_M0100_DIALOG_UPLOAD,
    QTM_M0100_DIALOG_MANAGE,
  },
  data() {
    return {
      // top
      modelTopCenter: '마이홈센터',
      itemsTopCenter: ['마이홈센터'],
      modelCheckType: '자유배점',
      itemsCheckType: ['자유배점'],
      modelEnable: '사용',
      itemsEnable: ['사용'],

      manage_stat: 0,

      // 공통코드
      allCodeList: [],
      // 센터
      DROP_CENTER_LIST: [],
      qstnPaperData:{},

      // grid
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
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '평가연도', value: 'EVAL_YYYY', align: 'left', width: '5%',sortable: true },
        { text: '센터', value: 'CENTER_NM', align: 'left', width: '8%',sortable: true },
        { text: '평가지 제목 ', value: 'PAPER_TITLE', align: 'left', width: '', sortable: true },
        { text: '평가 시작일', value: 'EVAL_ST_DD', align: 'center', width: '10%', sortable: true },
        { text: '평가 종료일', value: 'EVAL_EN_DD', align: 'center', width: '10%', sortable: true },
        { text: '평가 종류', value: 'EVAL_MNG_NM', align: 'center', width: '5%', sortable: true },
        { text: '문제 수', value: 'QSTN_CNT', align: 'center', width: '5%', sortable: true },
        { text: '총점', value: 'TOT_SCORE', align: 'center', width: '5%', sortable: true },
        { text: '문제배열', value: 'QSTN_ARR_NM', align: 'center', width: '5%', sortable: true },
        { text: '평가지 상태', value: 'PROC_STAT_NM', align: 'center px-0', width: '6%', sortable: true },
        { text: '등록자', value: 'REG_EMP_NM', align: 'left', width: '5%', sortable: true },
        { text: '등록일', value: 'REG_DT', align: 'left', width: '6%', sortable: true },
      ],

      STAT_LIST: [
        { code: '미확정', value: 'red'},
        { code: '평가지확정', value: 'green'},
      ],

      searchParams:{
        //CUSTCO_ID: "",
        CENTER_ID: "",
        QSTN_TYPE: "",
        USE_YN: "",
        SRCH_PAPER_TITLE: "",
        PROC_STAT:""
      },

      // 선택 분류유형
      checkedQtTypeList:[],
      // 평가지 목록
      evalQstnPaperList:[],
      selectedGridItem:[],
      // 신규 등록 여부
      isNew: true,
      //확정 여부
      isConfirm: true,

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          DELETE_PAPER: { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가지 를 삭제하시겠습니까?', callYes: this.deletePaperItemsAct, callNo: this.closeAlert }
        },
        ALERT : {
          REG_SUCCESS : { alertDialogToggle: true, msg: '평가지 정보가 등록되었습니다', iconClass: 'is-done', type: 'default' }
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
          , DEL_FAIL01:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '삭제할 평가지를 선택해주세요.' }
          , EXCEL_ITEM:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '엑셀 업로드할 평가지를 선택해주세요.' }
          , EXCEL_UP_F:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가확정및 진행중인 평가지는 수정이 불가능합니다.' }
          , EXCEL_Down_ITEM:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '엑셀 다운로드할 평가지를 선택해주세요.' }
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {
          REG_SUCCESS: {  msg: '평가지 정보가 등록되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
      },

      // 평가지 정보 등록
      PAPER_ID: "",
      CENTER_ID: "",
      PAPER_TITLE: "",
      QSTN_CNT: "", // 문제 갯수
      QSTN_ARR: "", // 문제 배열
      PROC_STAT: "", //진행상태
      EVAL_MNG: "", // 문제 주관   // 평가 종류
      TOT_SCORE: "", //총점
      REG_EMP_NO: "",
      RMRK: "", // 비고 , 설명

      initData(){
        this.PAPER_TITLE =  "";
        this.CENTER_ID = "";
        this.QSTN_CNT= "";
        this.QSTN_ARR= "";
        this.PROC_STAT= "";
        this.EVAL_MNG= "";
        this.TOT_SCORE= "";
        this.RMRK= "";
      },

      vaild : true,
      // validate
      validateRules:{
        PAPER_TITLE: [
          v => !!v || '평가지 제목은 필수 입력 항목입니다.',
        ],
        QSTN_CNT: [
          v => !!v|| '문항 개수은 필수 입력 항목입니다.',
        ],
        TOT_SCORE: [
          v => !!v || '총 점수는 필수 입력 항목입니다.',
        ],
        QSTN_ARR: [
          v => !!v || '문제 배열은 필수 입력 항목입니다.',
        ],
        EVAL_MNG: [
          v => !!v || '평가 종류는 필수 입력 항목입니다.',
        ],
        CENTER_ID: [
          v => !!v || '센터 정보는 필수 입력 항목입니다.',
        ]
      },

      // detail
      dialogShowDetail: false,
      dialogManageQuestion: false,
      dialogUploadAll: false,

      modelDateY: this.$moment(new Date()).format('YYYY'),
      evl_crtr_code:[],//평가기준 년월

      fileName:"",

      CHECK_EVAL_YEAR:true,

    }
  },
  methods: {

    closeFn003(){      
      //this.mixin_hideDialog('ManageQuestion');      
      this.selectEvalQstnPaperList();
      this.qstnPaperData.PROC_STAT = "ISMHEVST003";
    },

    closeFn001(){            
      this.selectEvalQstnPaperList();
      this.qstnPaperData.PROC_STAT = "ISMHEVST001";
    },

    closeRefresh(){
      this.dialogManageQuestion = false;
      this.selectEvalQstnPaperList();
    },

    // 템플릿 엑셀다운로드 
    async templeteExcelDown() {

      let sUrl = '/phone-api/qt/templeteExcelDown';
      const postParam = {};

      try {
        const response = await axios.post(sUrl, postParam, {
          responseType: "blob", // 파일 데이터 수신 설정
        });
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // 다운로드 링크 생성 및 클릭
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "templete.xlsx"; // 파일명 설정
        link.click();

        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Excel download failed:", error);
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가지를 엑셀형식으로 다운로드 한다
    async paperDownload() {

      if (this.checkedQtTypeList.length === 0) {
        this.showAlert(this.MESSAGE.ALERT.EXCEL_Down_ITEM);
        return;
      }

      const selectedItem = this.checkedQtTypeList[0];

      let sUrl = '/phone-api/qt/evalQstnExcelDownProc';
      const postParam = {
        PAPER_ID: selectedItem.PAPER_ID,
        CENTER_ID: selectedItem.CENTER_ID
      };

      try {
        const response = await axios.post(sUrl, postParam, {
          responseType: "blob", // 파일 데이터 수신 설정
        });
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // 다운로드 링크 생성 및 클릭
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = selectedItem.PAPER_TITLE+".xlsx"; // 파일명 설정
        link.click();

        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Excel download failed:", error);
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    excelUploadSave(){
      if(this.$refs.QTM_M0100_DIALOG_UPLOAD) this.$refs.QTM_M0100_DIALOG_UPLOAD.uploadSave_VALID();
    },

    // 엑셀 일괄 업로드
    excelUpload(){
      // 선택된 항목이 없는 경우
      if (this.checkedQtTypeList.length === 0) {
        this.showAlert(this.MESSAGE.ALERT.EXCEL_ITEM);
        return;
      }

      if(this.checkedQtTypeList[0].PROC_STAT != 'ISMHEVST001'){
        this.showAlert(this.MESSAGE.ALERT.EXCEL_UP_F);
        return;
      }

      this.qstnPaperData = {
        PAPER_TITLE :  this.checkedQtTypeList[0].PAPER_TITLE,
        CENTER_ID : this.checkedQtTypeList[0].CENTER_ID,
        PAPER_ID : this.checkedQtTypeList[0].PAPER_ID,
        QSTN_NO : this.checkedQtTypeList[0].QSTN_NO,
        PAPER_QSTN_CNT : this.checkedQtTypeList[0].QSTN_CNT,
        TOT_SCORE: this.checkedQtTypeList[0].TOT_SCORE,
        PROC_STAT: this.checkedQtTypeList[0].PROC_STAT, // 평가지 진행 상태
        PLAN_USE_CNT: this.checkedQtTypeList[0].PLAN_USE_CNT,  // 평가계획 등록된 여부
      }

      if(this.$refs.QTM_M0100_DIALOG_UPLOAD) this.$refs.QTM_M0100_DIALOG_UPLOAD.excelInit();

      this.mixin_showDialog('UploadAll');
    },

    async deletePaperItems() {
      // 선택된 항목이 없는 경우
      if (this.checkedQtTypeList.length === 0) {
        this.showAlert(this.MESSAGE.ALERT.DEL_FAIL01);
        return;
      }
      // 선택된 항목이 확정 상태인지 확인
      const selectedItem = this.checkedQtTypeList[0];
      if (selectedItem.PROC_STAT === 'ISMHEVST003') { // 확정 상태 코드
        this.showAlert({
          alertDialogToggle: true,
          msg: '확정된 평가지는 삭제할 수 없습니다.',
          iconClass: 'is-caution',
          type: 'default'
        });
        return;
      }
      this.showAlert(this.MESSAGE.CONFIRM.DELETE_PAPER);
    },
    async deletePaperItemsAct() {
      const selectedItem = this.checkedQtTypeList[0];

      let sUrl = '/phone-api/qt/deleteEvalPaper';
      let postParam = {
        PAPER_ID: selectedItem.PAPER_ID,
        CENTER_ID: selectedItem.CENTER_ID
      };

      let headParam = { head: {} };
      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.closeAlert();
        this.showToast({
          msg: '평가지가 삭제되었습니다.',
          class: 'success',
          hasToastIcon: true,
          icon: 'mdi-checkbox-marked-circle',
          time: 2000
        });
        this.checkedQtTypeList = []; // 선택 초기화
        this.selectEvalQstnPaperList(); // 목록 새로고침
      } else {
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    searchParamsReset(){
      this.searchParams.SRCH_PAPER_TITLE = '';
      this.searchParams.PROC_STAT ='';
      this.modelDateY = '';
      this.checkedQtTypeList = [];
      this.selectEvalQstnPaperList();
    },
    
    // 센터 조건 변경 시 이벤트
    changeCenter(){
      this.selectEvalQstnPaperList();
    },

    // 조회버튼 클릭
    clickSearchBtn(){
      this.selectEvalQstnPaperList();
    },

    // 평가지 조회
    async selectEvalQstnPaperList(next){

      // 초기화
      this.evalQstnPaperList = [];
      this.checkedQtTypeList = [];

      if (next == 'next'){
        //
      } else {
        this.evalQstnPaperList = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let sUrl = '/phone-api/qt/selectEvalQstnPaperList';
      let postParam = {
        //CUSTCO_ID: this.searchParams.CUSTCO_ID,
        CENTER_ID: this.searchParams.CENTER_ID,
        SRCH_PAPER_TITLE : this.searchParams.SRCH_PAPER_TITLE,
        PROC_STAT: this.searchParams.PROC_STAT,
        EVAL_YEAR: this.modelDateY,
        //USE_YN: this.searchParams.USE_YN
        CHECK_EVAL_YEAR: this.CHECK_EVAL_YEAR == true ? '1' : '',
      };

      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.evalQstnPaperList = response.DATA;
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        this.fileName = "평가지 관리 현황";

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 조회 조건 변경 재조회
    changeSearchParams(){
      this.selectEvalQstnPaperList();
    },

    // 평가지 정보 등록
    async clickSaveBtn(){
      if (!this.validate()) {
        this.$store.commit("alertStore/hideAlert");
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }

      let sUrl = '/phone-api/qt/insertEvalQstn';
      let postParam = {

        isNew: this.isNew ? 'Y':'N',
        //CUSTCO_ID: this.searchParams.CUSTCO_ID,
        CENTER_ID: this.CENTER_ID,
        PAPER_TITLE : this.PAPER_TITLE,
        PAPER_ID : this.PAPER_ID,
        QSTN_CNT: this.QSTN_CNT, // 문제 갯수
        QSTN_ARR: this.QSTN_ARR, // 문제 배열
        PROC_STAT: this.PROC_STAT, //진행상태
        EVAL_MNG: this.EVAL_MNG, // 문제 주관   // 평가 종류
        TOT_SCORE: this.TOT_SCORE, //총점
        REG_EMP_NO: this.searchParams.USER_ID,
        RMRK: this.RMRK, // 비고 , 설명
      };

      let headParam = { head : {} };
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG){
          this.showToast(this.MESSAGE.TOAST.REG_SUCCESS); //등록완료 알림창
          this.mixin_hideDialog('ShowDetail');   //등록창 닫기
          this.selectEvalQstnPaperList();
          //this.closeMsg();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
      // 필수값 확인
      //if(!this.validate()) return;
      // return this.$refs.form.validate();
    },

    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },
     //필수값 체크
    validate(){
      return this.$refs.form.validate();
    },

    ManageStat(tab){
      this.manage_stat = tab
      console.log("🚀 ~ ManageStat ~ tab:", tab)
    },

    //평가지 등록시 초기 설정
    click_strg(){
      this.isNew = true;
      this.PAPER_TITLE= "",
      // this.CENTER_ID= "",
      this.QSTN_CNT= "", // 문제 갯수
      this.QSTN_ARR= "", // 문제 배열
      this.PROC_STAT= "", //진행상태
      this.EVAL_MNG= "", // 문제 주관   // 평가 종류
      this.TOT_SCORE= "", //총점
      this.RMRK= "" // 비고 , 설명
      this.isConfirm = true;
      this.mixin_showDialog('ShowDetail');
    },

     // 수정
     selRow(event, {item}) {

      this.isNew = false,
      this.PAPER_ID= item.PAPER_ID,
      this.CENTER_ID= item.CENTER_ID,
      this.PAPER_TITLE= item.PAPER_TITLE,
      this.QSTN_CNT= item.QSTN_CNT,
      this.QSTN_ARR= item.QSTN_ARR,
      this.PROC_STAT= item.PROC_STAT,
      this.EVAL_MNG= item.EVAL_MNG,
      this.TOT_SCORE= item.TOT_SCORE,
      this.RMRK= item.RMRK
      this.isConfirm = this.PROC_STAT === 'ISMHEVST003' ? false : true ;

      this.mixin_showDialog('ShowDetail');
    },

    // 문항지 등록 화면
    click_strg3({item}) {
      this.qstnPaperData = {
        PAPER_TITLE :  item.PAPER_TITLE,
        CENTER_ID : item.CENTER_ID,
        PAPER_ID : item.PAPER_ID,
        QSTN_NO : item.QSTN_NO,
        PAPER_QSTN_CNT : item.QSTN_CNT,
        TOT_SCORE: item.TOT_SCORE,
        PROC_STAT: item.PROC_STAT, // 평가지 진행 상태
        PLAN_USE_CNT: item.PLAN_USE_CNT,  // 평가계획 등록된 여부
        isConfirm: item.PROC_STAT === 'ISMHEVST003' ? true : false ,
      }
      //this.isConfirm = item.PROC_STAT === 'ISMHEVST003' ? false : true ;
      //this.$refs.QTM_M0100_DIALOG_MANAGE.setQstnData(this.qstnData);
      this.mixin_showDialog('ManageQuestion');
    },

    // 문항 저장
    saveFn(){
      this.$refs.QTM_M0100_DIALOG_MANAGE.saveMaFn();
    },
    //평가지 확정
    confirmSaveFn(){
      this.$refs.QTM_M0100_DIALOG_MANAGE.confirmSaveFn();
    },

    confirmCanFn(){
      this.$refs.QTM_M0100_DIALOG_MANAGE.confirmCanFn();
    },

    clickCopyBtn(){
      this.$refs.QTM_M0100_DIALOG_MANAGE.clickCopyBtn();
    },

  },

  async mounted() {

    let codeList = ['EVST', 'TEST_DV', 'PAPER_ORD'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    // 사용자 센터
    //this.searchParams.CUSTCO_ID = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;

    // 사용자 정보
    this.searchParams.USER_ID = this.$store.getters["userStore/GE_USER_ROLE"].userId;

    // 센터목록 조회
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo();
    let centerId = this.$store.getters["userStore/GE_USER_ROLE"].company.CD;
    if(this.DROP_CENTER_LIST.length > 0){
      //this.searchParams.CUSTCO_ID = this.DROP_CENTER_LIST.find(row=> {return row.value == centerId}) ? centerId : this.DROP_CENTER_LIST[0].value;
      this.searchParams.CENTER_ID = this.DROP_CENTER_LIST.find(row=> {return row.value == centerId}) ? centerId : this.DROP_CENTER_LIST[0].value;
      this.CENTER_ID = this.DROP_CENTER_LIST.find(row=> {return row.value == centerId}) ? centerId : this.DROP_CENTER_LIST[0].value;
    }

    this.selectEvalQstnPaperList();

  },
  async created() {
    //평가기준년월 콤보용
    this.evl_crtr_code = await this.mixin_evl_crtr_list();
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
    // 검색조건으로 설정한 센터에만 등록할 수 있어야 해서 기존의 select box disable처리 하고 검색영역 선택영역과 동일하게 CENTER_ID 맞춰줌
    "searchParams.CENTER_ID" : {
      handler(){
        if(!this.mixin_isEmpty(this.searchParams.CENTER_ID)){
          this.CENTER_ID = this.searchParams.CENTER_ID
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>