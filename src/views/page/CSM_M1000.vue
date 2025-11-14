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
              <div class="pl-desc">
                <v-checkbox
                    v-model="srchParam.srchFloorplanYn"
                    class="pl-check "
                    label="등록된 평면도만 보기"
                ></v-checkbox>
              </div>
            </div>
            <div>
              <v-btn
                  class="pl-btn is-icon"
                  @click="getFloorplanList(false)"
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
              <strong class="pl-bullet-txt is-blue">단지별 평면도 등록 현황</strong>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ totCnt }})</em> 건</span>
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
              :items="floorplanList"
              fixed-header
              item-key="index"
              height="calc(-306px + 100vh)"
              :loading="isLoading"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
              @click:row="rowSelect"
              :item-class="isActiveRow"
              :page.sync="page"
              @page-count="pageCount = $event">
            <!-- 스크립트명 툴팁 -->
            <template v-slot:item.type02="{ item }">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                <span
                    v-bind="attrs"
                    v-on="on">
                {{ item.type02 }}</span>
                </template>
                <span>{{ item.type02 }}</span>
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
            보기 {{ mixin_getPagePeriod(floorplanList, page) }} / {{ floorplanList.length }}
            <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
                @btnClick="getFloorplanList(true)"
                :DisabledProp="nextDisabled"
            ></compo-tooltip-btn>
          </span>
          </div>
        </div>
        <!-- right -->
        <div class="">
          <div class="pl-card">
            <h2 class="pl-subtit">평면도 상세 정보</h2>
            <div class="pl-subdesc">
              <p>업로드 가능한 확장자는 “PNG, JPG, JPEG, GIF” 입니다.</p>
            </div>
          </div>
          <div class=" d-flex flex-column">
            <v-form ref="form">
              <div class="pl-card">
                <div class="pl-form-inline-wrap vertical label-100">
                  <div class="pl-form-inline">
                <span class="pl-label">
                  지역본부
                </span>
                    <div class="pl-desc">
                      <v-text-field
                          v-model="detailParam.ARA_HDQ_NM"
                          disabled
                          class="pl-form type-middle"
                      />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                <span class="pl-label">
                  단지 명
                </span>
                    <div class="pl-desc">
                      <v-text-field
                          v-model="detailParam.MGOF_NM"
                          disabled
                          class="pl-form type-middle"
                      />
                    </div>
                  </div>
                </div>
                <div class="is-border-sub-top mt-3">
                  <compo-file-grid
                      TitleProp="배치도"
                      SmallTitleProp
                      :FilesProp="detailParam.SP"
                      :DisabledProp="fileUpdDisable"
                      :DelData="[]"
                      @addFile="clickAddFiles('sp')"
                      @removeFile="deleteProc"
                  >
                  </compo-file-grid>
                  <input ref="spFileUpload" type="file" multiple @change="handleFileUpload($event, 'LHAT03')"
                         style="display: none"/>
                  <compo-file-grid
                      TitleProp="평면도"
                      SmallTitleProp
                      :FilesProp="detailParam.BV"
                      :DisabledProp="fileUpdDisable"
                      :DelData="DEL_FILE"
                      @input="DEL_FILE = $event"
                      @addFile="clickAddFiles('bv')"
                      @removeFile="deleteProc"
                  >
                  </compo-file-grid>
                  <input ref="bvFileUpload" type="file" multiple @change="handleFileUpload($event, 'LHAT04')"
                         style="display: none"/>
                </div>

              </div>
            </v-form>
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
  </div>
</template>

<script>

export default {
  name: "MENU_CSM_M1000", //평면도 관리
  components: {

  },
  data() {
    return {
      srchParam: {
        srchAraHdqCd: '',
        srchMgofNm: '',
        srchMgofCd: '',
        srchMemoCn: '',
        srchFloorplanYn: true,
      },

      detailParam: {
        ARA_HDQ_CD: '',
        ARA_HDQ_NM: '',
        MGOF_CD: '',
        MGOF_NM: '',
        FLOOR_REG_USER_NM: '',
        SP: [],
        BV: [],
      },

      totCnt: 0,

      ARA_HDQ_CD_LIST: [],
      ORG_ARR: [],
      floorplanList: [],
      fileUpdDisable: true,
      DEL_FILE: [],

      dropDetail: false,

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
      isLoading: false,
      progressBar: false,
      headers: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '지역본부', value: 'ARA_HDQ_NM', align: 'left', width: '15%', sortable: false},
        {text: '단지명', value: 'MGOF_NM', align: 'left', width: '', sortable: true},
        {text: '등록자', value: 'FLOOR_REG_USER_NM', align: 'left', width: '10%', sortable: true},
        {text: '등록일', value: 'FLOOR_REG_DT', align: 'center', width: '10%', sortable: false},
      ],
      headersExcel: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '지역본부코드', value: 'ARA_HDQ_CD', align: 'left', width: '150px', sortable: false},
        {text: '지역본부', value: 'ARA_HDQ_NM', align: 'left', width: '150px', sortable: false},
        {text: '단지코드', value: 'MGOF_CD', align: 'left', width: '150px', sortable: true},
        {text: '단지명', value: 'MGOF_NM', align: 'left', width: '150px', sortable: true},
        {text: '파일그룹키', value: 'FILE_GROUP_KEY', align: 'left', width: '300px', sortable: true},
        {text: '평면도 등록자', value: 'FLOOR_REG_USER_NM', align: 'left', width: '100px', sortable: true},
        {text: '평면도 등록일', value: 'FLOOR_REG_DT', align: 'center', width: '150px', sortable: false},
      ],
      items: [
        {index: 1861, type01: '경기남부지역본부', type02: '(NHF제10호)고덕국제도시 A-10블럭(그랑비체)', type03: '우성아', type04: '2024-06-20',},
        {index: 1862, type01: '경기남부지역본부', type02: '(NHF제10호)고덕국제도시 A-10블럭(그랑비체)', type03: '우성아', type04: '2024-06-20',},
        {index: 1863, type01: '경기남부지역본부', type02: '(NHF제10호)고덕국제도시 A-10블럭(그랑비체)', type03: '우성아', type04: '2024-06-20',},
        {index: 1864, type01: '경기남부지역본부', type02: '(NHF제10호)고덕국제도시 A-10블럭(그랑비체)', type03: '우성아', type04: '2024-06-20',},
        {index: 1865, type01: '경기남부지역본부', type02: '(NHF제10호)고덕국제도시 A-10블럭(그랑비체)', type03: '우성아', type04: '2024-06-20',},
      ],

      //detail
      modelLocalCenter: '경기남부지역본부',
      modelArea: '(NHF제10호)고덕국제도시 A-10블럭(23단지 센트럴써밋)',

      filelist: [
        {
          filename: '포인트 업종별 적립율 상세 정보.pdf',
          filesize: '1024KB',
          download: '',
          count: 0
        },
        {
          filename: '22포인트 업종별 적립율 상세 정보.pdf',
          filesize: '12024KB',
          download: '',
          count: 0
        },
      ],

    }
  },
  created() {
    this.mixinAsGetAsAraHdqCdList();
    this.getFloorplanList(false)
  },
  mounted() {
  },
  methods: {
    initSrchParam() {
      this.srchParam = {
        srchAraHdqCd: '',
        srchMgofNm: '',
        srchMgofCd: '',
        srchMemoCn: '',
        srchFloorplanYn: true,
      }
    },
    initDtlParam() {
      this.detailParam = {
        ARA_HDQ_CD: '',
        ARA_HDQ_NM: '',
        MGOF_CD: '',
        MGOF_NM: '',
        FLOOR_REG_USER_NM: '',
        SP: [],
        BV: [],
      }
    },
    rowSelect(item) {
      this.selectedRow = item;
      this.setDetailParam();
    },
    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },
    setDetailParam() {
      if (!this.mixin_isEmpty(this.selectedRow)) this.fileUpdDisable = false
      this.detailParam = {
        ARA_HDQ_CD: this.selectedRow.ARA_HDQ_CD,
        ARA_HDQ_NM: this.selectedRow.ARA_HDQ_NM,
        MGOF_CD: this.selectedRow.MGOF_CD,
        FILE_GROUP_KEY: this.selectedRow.FILE_GROUP_KEY,
        MGOF_NM: this.selectedRow.MGOF_NM,
        FLOOR_REG_USER_NM: this.selectedRow.FLOOR_REG_USER_NM,
        SP: [],
        BV: [],
      }
      if (!this.mixin_isEmpty(this.detailParam.FILE_GROUP_KEY)) this.getFloorplanFiles();
    },
    async getFloorplanList(next) {
      this.initDtlParam();
      this.nextDisabled = true;
      this.fileUpdDisable = true;
      this.isLoading = true;
      if (!next) {
        this.floorplanList = []
        this.pagination.page = 1;
        this.nextDisabled = false;
      }
      let sUrl = '/api/biz/common/select/selectFloorplanList'
      let postParam = {
        SRCH_ARA_HDQ_CD: this.srchParam.srchAraHdqCd,
        SRCH_MGOF_CD: this.srchParam.srchMgofCd,
        SRCH_FLOORPLAN_YN: this.srchParam.srchFloorplanYn ? 'Y' : 'N',
      }
      let headParam = {
        head: {
          ns: 'lhcs.phone.cuttMng.dao.PhoneCuttMngFloorplanMapper',
          sn: 'selectFloorplanList',
          ROW_CNT: this.pagination.rowsPerPage,
          PAGES_CNT: this.pagination.page,
          PAGING: "Y",
        }
      }

      const response = await this.common_postCall(sUrl, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        this.totCnt = response.HEADER.TOT_COUNT;
        response.DATA.map(item => {
          this.floorplanList.push({
            ROW_NUMBER: item.ROW_NUMBER,
            ARA_HDQ_CD: item.ARA_HDQ_CD,
            ARA_HDQ_NM: item.ARA_HDQ_NM,
            MGOF_CD: item.MGOF_CD,
            MGOF_NM: item.MGOF_NM,
            FILE_GROUP_KEY: item.FILE_GROUP_KEY,
            FLOOR_REG_DT: this.mixin_convertDate(item.FLOOR_REG_DT, 'yyyy-MM-dd'),
            FLOOR_REG_EMP_NO: item.FLOOR_REG_EMP_NO,
            FLOOR_REG_USER_NM: item.FLOOR_REG_USER_NM,
          })
        })
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
    // 상세 클릭 시 파일 목록 조회
    async getFloorplanFiles() {
      this.detailParam.SP = [];

      this.detailParam.BV = [];
      const response = await this.mixin_getFileList(this.detailParam.FILE_GROUP_KEY);
      if (!this.mixin_isEmpty(response)) {
        response.map((item) => {
          if (item.TASK_TYPE_CD == 'LHAT03') { // 배치도
            this.detailParam.SP.push({
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
          } else if (item.TASK_TYPE_CD == 'LHAT04') { // 조감도
            this.detailParam.BV.push({
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
    clickAddFiles(type) {
      this.$refs[`${type}FileUpload`].click();
    },
    handleFileUpload(event, taskType) {
      const files = event.target.files;

      //파일 제한 체크 (프론트에서 체크하고 업로드 로직 실행x)
      if (files.length > 0 && this.isValidFiles(files)) {
        // 파일 업로드
        this.uploadFiles(files, taskType);
      }
    },

    //파일개수 제한(파일개수 체크)
    isValidFiles(files) {
      // 파일 개수 제한을 설정
      const maxFileCount = 5;
      if (files.length > maxFileCount) {
        this.showAlertInfo({msg: `최대 ${maxFileCount}건 씩 업로드할 수 있습니다.`});
        return false;
      }

      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      const maxFileSize = 50 * 1024 * 1024; // 50MB
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedFileTypes.includes(file.type)) {
          alert('지원하지 않는 파일 형식입니다.');
          return false;
        }
        if (file.size > maxFileSize) {
          alert('파일 크기가 허용 범위를 초과합니다.');
          return false;
        }
      }

      return true;
    },

    //파일 업로드
    async uploadFiles(files, taskType) {
      this.progressBar = true;
      let fileGroupKey = '';
      let mgofCd = this.detailParam.MGOF_CD;

      if (!this.mixin_isEmpty(this.detailParam.FILE_GROUP_KEY)){
        fileGroupKey = this.detailParam.FILE_GROUP_KEY;
      }else{
        fileGroupKey = await this.mixin_getFileGroupKey();
      }

      const result = await this.mixin_uploadFiles_proc(fileGroupKey, files, taskType, 'images')

      result.param.map(item=>{
        this.insertFloorplan(mgofCd, item.FILE_GROUP_KEY, taskType)
      })
      // 서버로 파일 업로드 요청을 보냅니다.
      this.afterUpload()
      this.progressBar = false;
    },
    afterUpload(arrError) {
      this.showToastInfo({msg: '정상 처리되었습니다.'})
      this.getFloorplanList(false);
      this.getFloorplanFiles();
    },

    async insertFloorplan(mgofCd, fileGroupKey, taskType) {
      let postParam = {
        MGOF_CD: mgofCd,
        ATTACH_DIV_CD: taskType,
        FILE_GROUP_KEY: fileGroupKey
      }
      let headParam = {
        head: {
          ns: 'lhcs.phone.cuttMng.dao.PhoneCuttMngFloorplanMapper',
          sn: 'insertFloorplan',
        }
      }
      const response = await this.common_postCall('/api/biz/common/insert/insertFloorplan', postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        return response.HEADER.ERROR_FLAG;
      } else {
        return response.HEADER.ERROR_FLAG;
      }
    },
    async deleteProc(files) {
      let arrError = []
      await files.FILE_LIST.map(item => {
        try {
          this.deleteFile(item.fileGroupKey, item.fileKey)
          this.deleteFloorplan(item)
        } catch (e) {
          this.showToastCaution({msg: '삭제 중 오류가 발생했습니다.'})
        }
      })
      if (arrError.includes(true)) {
        this.showToastCaution({msg: '삭제 중 오류가 발생했습니다.'})
      } else {
        this.showToastInfo({msg: '정상 처리되었습니다.'})
        this.getFloorplanFiles();
      }
    },
    async deleteFloorplan(file) {
      let postParam = {
        MGOF_CD: this.detailParam.MGOF_CD,
        FILE_GROUP_KEY: file.fileGroupKey,
        ATTACH_DIV_CD: file.busiType
      }
      let headParam = {
        head: {
          ns: 'lhcs.phone.cuttMng.dao.PhoneCuttMngFloorplanMapper',
          sn: 'deleteFloorplan',
        }
      }
      const response = await this.common_postCall('/api/biz/common/delete/deleteFloorplan', postParam, headParam)
      return response.HEADER.ERROR_FLAG
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
        SRCH_FLOORPLAN_YN: this.srchParam.srchFloorplanYn ? 'Y' : 'N',

        sFileName: '평면도_등록_현황_'+this.$moment(new Date()).format('YYYYMMDDHHmmss'),
        sTitleName: '평면도_현황',
        iExcelLimitRowCnt: 100000,
        serviceNm: 'kr.co.hkcloud.lhcs.phone.cuttMng.dao.PhoneCuttMngFloorplanMapper',
        sqlId: 'selectFloorplanList',
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
      }, '평면도__'+this.$moment(new Date()).format('YYYYMMDDHHmmss'));

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
