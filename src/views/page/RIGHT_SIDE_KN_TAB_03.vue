<template>
  <div>
    <!-- search -->
    <div class="pl-card pb-0 px-6">
      <div class="pl-rounded-box">
        <div class="pl-form-inline-wrap px-5 pt-3">
          <div class="pl-form-inline">
            <span class="pl-label" style="flex: 0 0 44px">
              등록일
            </span>
            <div class="pl-desc">
              <compo-date-range-picker
                  ParentStyleProp="width: 300px"
                  :StartDayProp.sync="srchParam.srchStartDt"
                  :EndDayProp.sync="srchParam.srchEndDt"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              자료분류
            </span>
            <div class="pl-desc">
              <v-select
                  class="pl-form type-middle is-sm"
                  v-model="srchParam.srchDataCd"
                  :items="mixin_common_code_get(this.commonCode, 'T305', '전체')"
                  placeholder="전체"/>
            </div>
          </div>
        </div>
        <div class="pl-form-inline-wrap px-5 py-3 is-border-top">
          <div class="pl-form-inline">
            <span class="pl-label">
              담당본부
            </span>
            <div class="pl-desc">
              <v-select
                  class="pl-form type-middle"
                  :items="mixin_common_code_get(this.commonCode, 'T304', '전체')"
                  v-model="srchParam.srchHeadCd"
                  placeholder="전체"/>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              상담유형
            </span>
            <div class="pl-desc">
              <v-select
                  v-model="srchParam.srchDivCd"
                  :items="mixin_common_code_get(this.commonCode, 'CD', '전체')"
                  class="pl-form type-middle"
                  placeholder="전체"/>
            </div>
          </div>
          <div>
            <v-btn class="pl-btn"
                   @click="getCuttDataList(false)"
            >조회
            </v-btn>
            <!-- 필터 팝업 -->
            <v-tooltip content-class="pl-tooltip bottom" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-menu
                    min-width="380"
                    bottom
                    left
                    offset-y
                    rounded="lg"
                    content-class="pa-4 pl-menu-drop"
                    :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                    <v-btn
                        v-bind="menuAttrs"
                        v-on="menuOn"
                        class="pl-tooltip-btn ml-auto"
                        min-width="30"
                        height="30"
                        plain
                    >
                      <v-icon
                          v-bind="attrs"
                          v-on="on"
                          class="pl-icon20 detail"></v-icon>
                    </v-btn>
                  </template>
                  <div class="">
                    <div class="pl-form-inline-wrap vertical label-80 gap-8">
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <span class="ml-1">공고일</span>
                        </span>
                        <div class="pl-desc">
                          <compo-date-picker
                              DateType="dateInput"
                              :DateProp.sync="srchParam.srchNoticeDt"
                              @dateChange="validateDt"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <span class="ml-1">제목</span>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                              class="pl-form type-middle"
                              placeholder="검색어 입력"
                              v-model="srchParam.srchTtl"
                          ></v-text-field>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <span class="ml-1">특이사항 </span>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                              class="pl-form type-middle"
                              placeholder="검색어 입력"
                              v-model="srchParam.srchUnusual"
                          ></v-text-field>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <span class="ml-1">내용</span>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                              class="pl-form type-middle"
                              placeholder="검색어 입력"
                              v-model="srchParam.srchCntnt"
                          ></v-text-field>
                        </div>
                      </div>
                    </div>
                    <div class="pl-btn-wrap is-mt-s">
                      <v-btn class="pl-btn is-sm ml-auto"
                             @click="getCuttDataList(false)"
                      >조회
                      </v-btn>
                    </div>
                  </div>
                </v-menu>
              </template>
              <span>필터</span>
            </v-tooltip>
          </div>
        </div>
      </div>
    </div>
    <!-- list top -->
    <div class="d-flex align-center is-mt-s px-6">
      <span class="pl-label">전체 (<span class="is-txt-blue">{{ mixin_convertNumToComma(totCnt) }}</span>)건</span>
<!--      <compo-tooltip-btn-->
<!--          v-if="false"-->
<!--          :DisabledProp="true"-->
<!--          TitleProp="등록"-->
<!--          ClassProp="pl-tooltip-btn ml-auto"-->
<!--          IconProp="pl-icon20 circle-plus"-->
<!--          TooltipPositionProp="bottom"-->
<!--          @btnClick="mixin_showDialog('WriteNotice')"-->
<!--      ></compo-tooltip-btn>-->
      <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn ml-auto"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="getCuttDataList(false)"
      ></compo-tooltip-btn>
    </div>
    <!-- list -->
    <div
        style="height: 569px;"
        class="is-mt-s pl-notice-list type-acco is-border-top pl-scroll-body"
        v-if="!mixin_isEmpty(cuttDataList)"
    >
      <div
          class="pl-notice-list--unit"
          v-for="item in cuttDataList"
          :key="item.id">
        <div
            @click="activeItem(item)"
            :class="`d-flex align-center acco-title active-${item.ACTIVE}`">
          <div class="">
            <div class="d-flex align-center">
              <strong>{{ item.DATA_TTL }}</strong>
              <span v-if="item.TODAY" class="pl-badge is-new ml-1">Today</span>
            </div>
            <div class="d-flex align-center is-txt-sub mt-1" style="font-size: 12px; gap: 4px">
              <span v-if="item.DATA_DIV_CD_NM">{{ item.DATA_DIV_CD_NM }}</span>
              <span v-if="item.HEAD_NM">&bull; {{ item.HEAD_NM }} ( {{ item.RGTR_NM }} )</span>
              <span v-if="item.NOTICE_DT">&bull; 공고일 {{ item.NOTICE_DT }}</span>
            </div>
          </div>
        </div>
        <!-- active -->
        <div v-if="item.ACTIVE"
             class="pl-notice-list--content d-flex flex-column is-mt-s py-3"
        >
          <div>
            <span class="pl-badge is-lg is-cyan" style="width: 70px;">내 용</span>
            <div style="white-space: pre-wrap;" class="is-mt-s"
            >
              <span v-html="restoreXSS(item.DATA_CNTNT)"></span>
            </div>
          </div>
          <div class="is-mt-s" v-if="item.UNUSUAL">
            <span class="pl-badge is-lg is-cyan" style="width: 70px;">특이사항</span>
            <div style="white-space: pre-wrap;" class="is-mt-s" >{{ item.UNUSUAL }}</div>
          </div>
          <div class="pl-file-list pt-3" v-if="item.IS_EXIST_FILE ==='Y'">
            <div
                class="pl-file-list--unit"
                v-for="file in item.fileList"
                :key="file.id">
              <div
                  class="d-flex align-center justify-center"
                  :style="`width: 30px; height: 30px; background-color: ${ getExtColor(file.FILE_EXTN) }`">
                <v-icon :class="`pl-icon30 ${ getExtName(file.FILE_EXTN) }`"></v-icon>
              </div>
              <div class="ml-2">
                <span>{{ file.ACTL_FILE_NM }}</span>
              </div>
              <v-icon
                  @click="mixin_fileDownload(file, file.TASK_TYPE_CD, file.PATH_TYPE_CD)"
                  class="pl-icon30 file-down-arrow ml-auto"></v-icon>
            </div>

          </div>
        </div>
      </div>
      <!-- 더보기 -->
      <div class="d-flex justify-center is-mt-m pb-3">
        <v-btn class="pl-btn is-round is-sub px-4"
               v-if="!nextDisabled"
               @click="getCuttDataList(true)"
        >더보기</v-btn>
      </div>
    </div>
    <div
        style="height: 569px;"
        class="is-mt-s pl-notice-list type-acco is-border-top pl-scroll-body"
        v-else
    >
      <div class="pl-list-nodata">
        <span>등록된 데이터가 없습니다.</span>
      </div>
    </div>
    <!-- dialog: 데일리 등록 -->
    <v-dialog
        v-model="dialogWriteNotice"
        width="900"
        content-class="dialog-draggable is-maxHeight"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="데일리 등록"
          @hide="mixin_hideDialog('WriteNotice')"
          @submit="submitDialog('WriteNotice')"
      >
        <template slot="body">
          <CompoNoticeWrtie
              TypeProp="daily"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('WriteNotice')">닫기</v-btn>
          <v-btn class="pl-btn" @click="mixin_hideDialog('WriteNotice')">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'RIGHT_SIDE_KN_TAB_03', //상담자료
  components: {},
  props : {
  },
  data() {
    return {
      commonCode: [],
      today : this.$moment(new Date()).format('YYYY-MM-DD'),

      srchParam: {
        selectedRange: 'REG_DT',
        srchStartDt: this.$moment(new Date()).subtract(60, 'days').format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchDivCd: '',
        srchHeadCd: '',
        srchDataCd: '',
        srchNoticeDt: null,
        srchTtl: '',
        srchUnusual: '',
        srchCntnt: '',
      },
      cuttDataList: [],
      totCnt : 0,
      // 공지 등록
      dialogWriteNotice: false,

      pagination: {
        page: 1,
        rowsPerPage: 10,
      },
      nextDisabled : false,

      // file color
      fileExtList: [
        {name: 'file-pdf', color: '#AE0C00'},
        {name: 'file-hwp', color: '#35AEE7'},
        {name: 'file-xlsx', color: '#017338'},
      ],
      firstLoad : false,

    }
  },
  async created() {

    await this.setCommCd();
    this.$eventBus.$on('refreshCuttData' , () => {
      this.getCuttDataList(false);
    })
  },
  mounted() {
    this.getCuttDataList(false);
    if(!this.firstLoad){
      this.$emit('loadComplete')
      this.firstLoad = true
    }
  },
  methods: {
    async setCommCd(){
      let codeName = ['T304', 'CD', 'T305'] // T304 - 지역본부 , CD - 상담유형 , T305 - 자료구분
      this.commonCode = await this.mixin_common_code_get_all(codeName);
    },
    getExtName(ext) {
      let extList = this.fileExtList

      for (let i = 0; i < extList.length; i++) {
        if (extList[i].name.split('-')[1] === ext) {
          return extList[i].name;
        }
      }
    },
    getExtColor(ext) {
      let extList = this.fileExtList

      for (let i = 0; i < extList.length; i++) {
        if (extList[i].name.split('-')[1] === ext) {
          return extList[i].color;
        }
      }
    },
    async getCuttDataList(next) {
      this.chkCuttDataList = []
      if (!next) {
        this.cuttDataList = [];
        this.pagination.page = 1
        this.nextDisabled = true;
      }
      // console.log("this.saveParam", this.saveParam)
      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-', '') + '000000'
        , SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-', '') + '235959'
        , SRCH_NOTICE_DT : this.mixin_isEmpty(this.srchParam.srchNoticeDt) ? '' : this.srchParam.srchNoticeDt.replaceAll('-', '')+ '000000'
        , SRCH_DATA_DIV_CD: this.srchParam.srchDivCd
        , SRCH_HEAD_CD: this.srchParam.srchHeadCd
        , SRCH_CNSLT_DATA_CD: this.srchParam.srchDataCd
        , SRCH_TTL: this.srchParam.srchTtl
        , SRCH_UNUSUAL: this.srchParam.srchUnusual
        , SRCH_CNTNT: this.srchParam.srchCntnt
      }

      let headParam = {
        head: {
          ns: 'lhcs.phone.cuttMng.data.dao.PhoneCuttDataMngMapper'
          , sn: 'selectCuttDataList'
          , ROW_CNT: this.pagination.rowsPerPage
          , PAGES_CNT: this.pagination.page
          , PAGING: "Y"
        }
      }

      const response = await this.common_postCall('/api/biz/common/select/selectCuttDataList', postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        this.totCnt = response.HEADER.TOT_COUNT;
        response.DATA.map((item) => {

              item.REG_DT = this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd')
              item.TODAY = this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd') == this.today ? true: false
              item.MDFCN_DT = this.mixin_convertDate(item.MDFCN_DT, 'yyyy-MM-dd')
              item.NOTICE_DT = this.mixin_convertDate(item.NOTICE_DT, 'yyyy-MM-dd')
              item.ACTIVE = false
              this.cuttDataList.push(item)
              // console.log("this.mixin_decode(item.DATA_CNTNT)",item.DATA_CNTNT);
              // console.log("this.mixin_decode(item.DATA_CNTNT)",item.DATA_CNTNT.replaceAll('\r', '<br/>'));
              // console.log("this.mixin_decode(item.DATA_CNTNT)", this.mixin_decode(item.DATA_CNTNT));
            }
        )
        this.cuttDataList.map(obj=>{
          if(obj.TODAY){
            this.$emit('newBadge','RIGHT_SIDE_KN_TAB_03')
          }
        })
        if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
          if (response.HEADER.next === true) {
            this.nextDisabled = false //버튼 활성화
          } else {
            this.nextDisabled = true  //버튼 비활성화
          }
        }
        this.pagination.page += 1;
      }
    },
    validateDt(){
      if(!this.mixin_isEmpty(this.srchParam.srchNoticeDt)){
        let noti = this.srchParam.srchNoticeDt.replaceAll('-', '');
        let start = this.srchParam.srchStartDt.replaceAll('-', '');
        let end = this.srchParam.srchEndDt.replaceAll('-', '');

        if (noti < start) {
          this.showToast({msg: '공고일 조회는 조회기간 내에서만 가능합니다.'})
          this.srchParam.srchNoticeDt = this.srchParam.srchStartDt
        } else if (noti > end) {
          this.showToast({msg: '공고일 조회는 조회기간 내에서만 가능합니다'})
          this.srchParam.srchNoticeDt = this.srchParam.srchEndDt
        }
      }
    },
    async activeItem(item){
      item.ACTIVE = !item.ACTIVE
      this.$set(item, "fileList", await this.mixin_getFileList(item.FILE_GROUP_KEY))
      // item.fileList = await this.mixin_getFileList(item.FILE_GROUP_KEY);
    }
  },
  computed: {},
  watch: {
  },
  beforeDestroy(){
    this.$eventBus.$off('refreshCuttData');
  }
};
</script>

<style lang="scss" scoped>

</style>