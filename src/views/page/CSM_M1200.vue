<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
            <span class="pl-label">
              지역본부
            </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    :items="ARA_HDQ_CD_LIST"
                    ref="srchParam.srchAraHdqCd"
                    v-model="srchParam.srchAraHdqCd"
                    placeholder="전체"/>
              </div>
            </div>

            <div class="pl-form-inline">
            <span class="pl-label">
              단지명
            </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form is-search type-middle is-lg"
                    placeholder="검색어 입력"
                    v-model="srchParam.srchMgofNm"
                    :disabled="!this.mixin_isEmpty(srchParam.srchMgofCd)"
                    @keydown.enter="openSrchMgof"
                >
                  <template v-slot:append>
                    <v-btn
                        @click="openSrchMgof"
                        class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
            <span class="pl-label">
              특이사항
            </span>
              <div class="pl-desc">
                <v-text-field
                    v-model="srchParam.srchMemoCn"
                    class="pl-form type-middle is-lg"
                    placeholder="단지 특이사항 입력"
                    @keydown.enter="getMngMgofMemo(false)"
                />
              </div>
            </div>
            <div>
              <v-btn
                  class="pl-btn is-icon"
                  @click="getMngMgofMemo(false)"
              >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
              <compo-tooltip-btn
                  TitleProp="초기화"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                  @btnClick="initSrchParam"
              ></compo-tooltip-btn>
            </div>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols fill-height">
        <!-- left -->
        <div class="pl-card-body is-col-fix is-vrt" style="width: 60%;">
          <!-- grid top -->
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left spacing-wrap sp-16 ">
              <strong class="pl-bullet-txt is-blue">단지별 특이사항 등록 현황 </strong>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ mixin_convertNumToComma(totCnt) }})</em> 건</span>
              <!-- 엑셀 다운로드 버튼 -->
              <compo-tooltip-btn
                  TitleProp="엑셀 다운로드"
                  ClassProp="pl-tooltip-btn "
                  IconProp="pl-icon20 exceldown"
                  TooltipPositionProp="bottom"
                  @btnClick="downloadExcel"
              ></compo-tooltip-btn>
            </div>
          </div>
          <!-- grid -->
          <v-data-table
              class="pl-grid is-mt-s has-control"
              :headers="headers"
              :items="mngMgofMemoList"
              fixed-header
              item-key="ROW_NUMBER"
              height="calc(-306px + 100vh)"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
              :loading="isLoading"
              loading-text="조회 중 입니다."
              @click:row="rowSelect"
              :item-class="isActiveRow"
              :page.sync="page"
              @page-count="pageCount = $event">
            <!-- 스크립트명 툴팁 -->
            <template v-slot:item.MGOF_NM="{ item }">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                <span
                    v-bind="attrs"
                    v-on="on">
                {{ item.MGOF_NM }}</span>
                </template>
                <span>{{ item.MGOF_NM }}</span>
              </v-tooltip>
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
            보기 {{ mixin_getPagePeriod(mngMgofMemoList, page) }} / {{ mixin_convertNumToComma(mngMgofMemoList.length) }}
            <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
                @btnClick="getMngMgofMemo(true)"
                :DisabledProp="nextDisabled"
            ></compo-tooltip-btn>
          </span>
          </div>
        </div>
        <!-- right -->
        <div class="d-flex flex-column">
          <div class="pl-card">
            <h2 class="pl-subtit">특이사항 상세 정보 </h2>
            <div class="pl-subdesc">
              <p>특이사항을 입력 후 [저장] 버튼을 클릭 하십시오. </p>
            </div>
          </div>
          <v-tabs class="pl-tabs">
            <v-tab>단지 특이사항</v-tab>
            <v-tab :disabled="this.mixin_isEmpty(saveParam.REG_EMP_NO)">이력 보기</v-tab>
            <!-- 단지 특이사항 -->
            <v-tab-item>
              <div>
                <v-form ref="form" class="pl-card flex-grow-1">
                  <div class="">
                    <div class="pl-form-inline-wrap vertical label-100">
                      <div class="pl-form-inline">
                      <span class="pl-label">
                        특이 사항
                      </span>
                        <div class="pl-desc">
                          <v-textarea
                              class="pl-form is-noresize"
                              v-model="saveParam.MGOF_MEMO"
                              :spellcheck="false"
                              height="300"
                              placeholder="특이사항 입력"
                              :disabled="this.mixin_isEmpty(selectedRow)"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                      <span class="pl-label">
                        현장 단지명
                      </span>
                        <div class="pl-desc">
                          <v-text-field
                              class="pl-form type-middle"
                              v-model="saveParam.FIELD_MGOF_NM"
                              :disabled="this.mixin_isEmpty(selectedRow)"
                              placeholder="현장 단지명 입력"/>
                        </div>
                      </div>
                    </div>
                    <div class="is-border-sub-top mt-3">
                      <compo-file-grid
                          SmallTitleProp
                          :FilesProp="saveParam.files"
                          :DisabledProp="mixin_isEmpty(saveParam.REG_EMP_NO)"
                          :DelData="DEL_FILE"
                          @addFile="clickAddFiles"
                          @removeFile="deleteProc"
                      >
                      </compo-file-grid>
                      <v-file-input
                          style="display: none"
                          ref="fileUpload"
                          @change="handleFileUpload"
                          multiple
                          label="파일을 선택하세요"
                      />
                    </div>

                  </div>
                </v-form>
                <div class="pl-card is-border text-right">
                  <v-btn
                      :disabled="this.mixin_isEmpty(selectedRow)"
                      @click="beforeSave"
                      class="pl-btn"
                  >저장
                  </v-btn>
                </div>
              </div>
            </v-tab-item>
            <!-- 이력 보기 -->
            <v-tab-item>
              <div>
                <!-- list top -->
                <div class="d-flex align-center is-mt-s px-5">
                  <span class="pl-label">전체 (<span class="is-txt-blue">{{ mgofHstList.length }}</span>)건</span>
                </div>
                <!-- list -->
                <div
                    v-if="mgofHstList.length > 0"
                    style="height: calc(100vh - 350px);"
                    class="is-mt-s pl-notice-list is-border-top pl-scroll-body no-hover no-link">
                  <div
                      class="pl-notice-list--unit"
                      v-for="item in mgofHstList"
                      :key="item.id">
                    <div class="d-flex ">
                      <div class="flex-grow-1">
                        <div>
                          <div>
                            <strong>등록자 </strong><span class="ml-1">{{ item.name }}</span>
                            <span class="pl-unit is-txt-sub">&bull;</span>
                            <strong>등록일 </strong><span class="ml-1">{{ item.date }}</span>
                          </div>
                          <div class="d-flex" v-if="item.place">
                            <strong class="flex-shrink-0">현장단지</strong>
                            <span class="ml-2">{{ item.place }}</span>
                          </div>
                          <div class="d-flex">
                            <p class="ml-2" style="white-space: pre-line;">{{ item.memo }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else style="height: calc(100vh - 350px);"
                     class="is-mt-s pl-notice-list is-border-top pl-scroll-body no-hover no-link">
                  <div class="pl-list-nodata">
                    <span>등록된 데이터가 없습니다.</span>
                  </div>
                </div>

              </div>
            </v-tab-item>
          </v-tabs>
        </div>
      </div>
      
    </div>
    <div class="text-center">
      <v-dialog v-if="progressBar" v-model="progressBar" persistent content-class="common-progress-dialog">
        <div class="loader-wrap">
          <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script>

export default {
  name: "MENU_CSM_M1200", //단지 특이사항 관리
  components: {

  },
  data() {
    return {
      ARA_HDQ_CD_LIST: [],


      srchParam: {
        srchAraHdqCd: '',
        srchMgofCd: '',
        srchMgofNm: '',
        srchMemoCn: '',
      },

      saveParam: {
        MGOF_CD: '',
        MGOF_MEMO: '',
        FIELD_MGOF_NM: '',
        REG_EMP_NO : '',
        UPD_EMP_NO : '',
        FILE_GROUP_KEY : '',
        files: [],
      },

      totCnt : 0,
      mngMgofMemoList: [],
      selectedRow: {},
      mgofHstList: [],

      dropDetail: false,
      isLoading: false,

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 30,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      nextDisabled: false,
      headers: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '지역본부', value: 'ARA_HDQ_NM', align: 'left', width: '15%', sortable: false},
        {text: '단지명', value: 'MGOF_NM', align: 'left', width: '', sortable: true},
        {text: '등록자', value: 'REG_USER_NM', align: 'left', width: '10%', sortable: false},
        {text: '등록일', value: 'REG_DT', align: 'center', width: '10%', sortable: false},
      ],
      headersExcel: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '지역본부', value: 'ARA_HDQ_NM', align: 'left', width: '200px', sortable: false},
        {text: '단지명', value: 'MGOF_NM', align: 'left', width: '200px', sortable: true},
        {text: '현장단지명', value: 'FIELD_MGOF_NM', align: 'left', width: '200px', sortable: false},
        {text: '특이사항', value: 'MGOF_MEMO', align: 'left', width: '200px', sortable: false},
        {text: '등록자', value: 'REG_USER_NM', align: 'left', width: '100px', sortable: false},
        {text: '등록일', value: 'REG_DT', align: 'center', width: '100px', sortable: false},
      ],

      // 이력보기
      LOG_LIST: [],
      DEL_FILE: [],

      progressBar: false,

    }
  },
  created() {
    this.mixinAsGetAsAraHdqCdList();
    this.getMngMgofMemo(false);
  },
  mounted() {
  },
  methods: {
    initSrchParam() {
      this.srchParam = {
        srchAraHdqCd: '',
        srchMgofCd: '',
        srchMgofNm: '',
        srchMemoCn: '',
      }
    },
    initSaveParam() {
      this.selectedRow = {};
      this.saveParam = {
        MGOF_CD: '',
        MGOF_MEMO: '',
        FIELD_MGOF_NM: '',
        REG_EMP_NO: '',
        UPD_EMP_NO: '',
        FILE_GROUP_KEY: '',
        files: [],
      }
      this.mgofHstList = [];
    },
    openSrchMgof() {
      if (this.mixin_isEmpty(this.srchParam.srchAraHdqCd)) {
        this.setDropDown('srchParam.srchAraHdqCd');
      } else {
        this.mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '569', {compo_name : 'CompoFindAsBldgAdr', callback : 'setBldgAdr', title: '단지/동주소', popData: {ARA_HDQ_CD : this.srchParam.srchAraHdqCd ,MGOF_NM : this.srchParam.srchMgofNm}})
      }
    },
    setBldgAdr(item) {
      this.srchParam.srchMgofCd = item.MGOF_CD;
      this.srchParam.srchMgofNm = item.MGOF_NM;
    },
    rowSelect(item) {
      console.log("item", item)
      this.selectedRow = item;
      this.setSaveParam(this.selectedRow)
    },
    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },
    setSaveParam(item) {
      this.initSaveParam();
      this.selectedRow = item;
      this.saveParam = {
        MGOF_CD: item.MGOF_CD,
        mgofNm: item.MGOF_NM,
        MGOF_MEMO : this.mixin_decode(item.MGOF_MEMO),
        REG_EMP_NO : item.REG_EMP_NO,
        UPD_EMP_NO : item.UPD_EMP_NO,
        FILE_GROUP_KEY : item.FILE_GROUP_KEY,
        FIELD_MGOF_NM: this.mixin_decode(item.FIELD_MGOF_NM),
        files: [],
      }
      if( !this.mixin_isEmpty(item.MGOF_MEMO)){
        this.getMgofMemoHst(item.MGOF_CD);
      }
      if( !this.mixin_isEmpty(item.FILE_GROUP_KEY)){
        this.getMgofMemoFiles(item.FILE_GROUP_KEY);
      }
    },
    async getMngMgofMemo(next) {
      this.initSaveParam();
      this.isLoading = true;
      this.nextDisabled = true;
      if (!next) {
        this.mngMgofMemoList = []
        this.pagination.page = 1
        this.nextDisabled = false;
      }
      let postParam = {
        SRCH_ARA_HDQ_CD: this.srchParam.srchAraHdqCd,
        SRCH_MGOF_CD: this.srchParam.srchMgofCd,
        SRCH_MGOF_MEMO: this.srchParam.srchMemoCn
      }

      let headParam = {
        head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper',
          sn: 'selectMngMgofMemo',
          ROW_CNT: this.pagination.rowsPerPage,
          PAGES_CNT: this.pagination.page,
          PAGING: "Y",
        }
      }
      const response = await this.common_postCall('/api/biz/common/select/selectMngMgofMemo', postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        this.totCnt = response.HEADER.TOT_COUNT;
        response.DATA.map((item) => {
            item.REG_DT = this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd')
          this.mngMgofMemoList.push(item)
        })
      } else {
        this.showToastCaution({msg: '조회 중 오류가 발생했습니다.'})
      }

      if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
        if (response.HEADER.next) {
          this.nextDisabled = false //버튼 활성화
        } else {
          this.nextDisabled = true  //버튼 비활성화
        }
      }
      this.pagination.page += 1;
      this.isLoading = false;
    },
    async getMgofMemoFiles(FILE_GROUP_KEY) {
      const response = await this.mixin_getFileList(FILE_GROUP_KEY);
      if (!this.mixin_isEmpty(response)) {
        response.map((item) => {
          if (item.TASK_TYPE_CD == 'LHAT05') {
            this.saveParam.files.push({
              filename: item.ACTL_FILE_NM,
              filesize: this.mixin_isEmpty(item.FILE_SZ) ? '0' : this.mixin_format_bytes(item.FILE_SZ),
              download: item.FILE_PATH,
              count: this.mixin_isEmpty(item.DWNLD_CNT) ? 0 : item.DWNLD_CNT,
              busiType: item.TASK_TYPE_CD,
              pathType: item.PATH_TYPE_CD,
              fileGroupKey: item.FILE_GROUP_KEY,
              fileKey: item.FILE_KEY,
              STRG_FILE_NM: item.STRG_FILE_NM,
              FILE_PATH: item.FILE_PATH,
              FILE_EXTN: item.FILE_EXTN,
              FILE_URL: item.FILE_URL,
            })
          }
        });
      }
    },
    async getMgofMemoHst(mgofCd) {
      let postParam = {
        MGOF_CD: mgofCd
      };
      let headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper'
        }};
      let response = await this.common_postCall("/api/biz/common/select/selectMgofMemoHst", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        response.DATA.map(item =>{
          this.mgofHstList.push({
              name : item.UPD_EMP_NM,
              date : this.mixin_convertDate(item.UPD_DT, 'yyyy-MM-dd  HH:mm'),
              place : this.mixin_isEmpty(item.FIELD_MGOF_NM) ? '': item.FIELD_MGOF_NM,
              memo: item.MGOF_MEMO
          });
        })
      }
    },
    beforeSave(){
      if( this.mixin_isEmpty(this.saveParam.REG_EMP_NO) && this.mixin_isEmpty(this.saveParam.UPD_EMP_NO)){
        this.showConfirmInfo({msg : '해당 단지의 특이사항을 등록하시겠습니까?', callYes:()=>{
          this.save('N')
          }, callNo : this.closeAlert})
      }else{
        this.showConfirmInfo({msg : '해당 단지의 특이사항을 수정하시겠습니까?', callYes: ()=>{
            this.save('Y')
          }
          , callNo : this.closeAlert})
      }
    },
    async save(updateYn){
      let sUrl = '/phone-api/as/common/mergeMgofInfo'

      let postParam = {
        UPDATE_YN : updateYn,
        MGOF_CD : this.saveParam.MGOF_CD,
        FIELD_MGOF_NM : this.saveParam.FIELD_MGOF_NM,
        MGOF_MEMO : this.saveParam.MGOF_MEMO,
        FILE_GROUP_KEY : this.saveParam.FILE_GROUP_KEY
      }
      let headParam = {head:{}}

      const response = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg : '정상 처리 되었습니다.', callAfter : ()=>{
          this.closeAlert()
          this.getMngMgofMemo()
          this.initSaveParam()
          }})
      }
    },
    clickAddFiles() {
      this.$refs.fileUpload.$refs.input.value = null;
      this.$refs.fileUpload.$refs.input.click()
    },
    async handleFileUpload( files ) {
      await
          this.mixin_handleFileUpload(
              files,
              {fileGroupKey : this.saveParam.FILE_GROUP_KEY ,busiType: 'LHAT05', pathType: 'files', maxFileCount: 3, maxFileSize: 50 * 1024 * 1024},
              this.callbackHandleFileUpload
          );
    },
    async callbackHandleFileUpload(resultObj) {
      if(this.mixin_isEmpty(this.saveParam.REG_EMP_NO)){
        this.save('N')
      }else{
        this.save('Y')
      }
    },
    afterUpload(arrError) {
      this.showToastInfo({msg: '정상 처리되었습니다.'})
      // this.getFloorplanList(false);
      // this.getFloorplanFiles();
    },
    async deleteProc(files) {
      console.log(files)
      let arrError = []
      await files.FILE_LIST.map(item => {
        try {
          this.deleteFile(item.fileGroupKey, item.fileKey)
        } catch (e) {
          this.showToastCaution({msg: '삭제 중 오류가 발생했습니다.'})
        }
      })
      if (arrError.includes(true)) {
        this.showToastCaution({msg: '삭제 중 오류가 발생했습니다.'})
      } else {
        this.showToastInfo({msg: '정상 처리되었습니다.'})
        // this.getFloorplanFiles();
      }
    },
    async downloadExcel(){

      let sHeaderData = '';
      let makeHeader = []
      this.headersExcel.map((item)=>{
        let str = `${item.value}^${item.text}`
        makeHeader.push(str)
      })
      sHeaderData = makeHeader.join(',');

      let sURL = '/api/biz/common/cmmExcelDwnld';
      let postParams = {

        SRCH_ARA_HDQ_CD: this.srchParam.srchAraHdqCd,
        SRCH_MGOF_CD: this.srchParam.srchMgofCd,
        SRCH_MGOF_MEMO: this.srchParam.srchMemoCn,

        sFileName: '단지특이사항현황_'+this.$moment(new Date()).format('YYYYMMDDHHmmss'),
        sTitleName: '단지특이사항_현황',
        iExcelLimitRowCnt: 100000,
        serviceNm: 'kr.co.hkcloud.lhcs.phone.as.dao.PhoneAsCommonMapper',
        sqlId: 'selectMngMgofMemo',
        sHeaderData: sHeaderData,
      };
      let headParams = {
        head: '',
      }
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      this.requestServerExcelDownloadApi({
        url: sURL, // required
        headers: {
          // required
          Authorization: "",
        },
        callback: (data) => {
          this.$store.commit("alertStore/hideAlert");
        },
        data: postParams,
      }, '단지특이사항_현황_'+this.$moment(new Date()).format('YYYYMMDDHHmmss'));

    }
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>

</style>
