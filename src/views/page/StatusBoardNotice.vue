<template>
  <div>
    <div class="pl-quick-layer-header" v-if="this.DataProp === null/*팝업호출인경우는 제거.*/">
      <h1>
        {{ BBS_TITLE }}
      </h1>
      <compo-tooltip-btn
          TitleProp="윈도우 팝업 열기"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 openPop"
          TooltipPositionProp="bottom"
          @btnClick="layoutPopup"
      ></compo-tooltip-btn>
      <compo-tooltip-btn
          TitleProp="닫기"
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 dialog-close"
          TooltipPositionProp="bottom"
          @btnClick="closeSlide"
      ></compo-tooltip-btn>
    </div>
    <template v-if="!detailMode">
      <div class="pa-5 px-6">
        <v-tabs
          v-model="SELECT_TAB"
          hide-slider
          class="pl-tabs type-fill tab-grow">
          <v-tab style="min-width:120px;" v-for="item in GRID.TABS">{{ item.TAB_NM }}</v-tab>
        </v-tabs>
      </div>
    </template>
    <v-tabs-items v-model="SELECT_TAB">
      <v-tab-item v-for="(list,index) in GRID.TABS">
        <template v-if="!detailMode">
          <div class="px-6 pt-0">
            <!-- search -->
            <div class="pl-rounded-box">
              <div class="pl-form-inline-wrap px-5 pt-3">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    등록일
                  </span>
                  <div class="pl-desc">
                    <compo-date-range-picker
                      ParentStyleProp="width: 300px"
                      :StartDayProp.sync="SRCH_ST"
                      :EndDayProp.sync="SRCH_END"
                      @startDayChange="mixin_testLog(SRCH_ST)"
                      @endDayChange="mixin_testLog(SRCH_END)"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    유형
                  </span>
                  <div class="pl-desc">
                    <v-select
                      v-model="GRID.SRCH[SELECT_TAB].SRCH_PST_TYPE_CD"
                      class="pl-form type-middle is-sm"
                      :items="mixin_common_code_get_global(common_code_global, 'NE', GRID.TABS[SELECT_TAB].CUSTCO_ID, '전체' )"
                      placeholder="선택"
                      :disabled="(GRID.TABS[SELECT_TAB].BBS_TYPE_CD ==='EMRG_NTC' || GRID.TABS[SELECT_TAB].BBS_TYPE_CD ==='GNRL_BBS')?true:false"
                    ></v-select>
                  </div>
                </div>
              </div>
              <div class="pl-form-inline-wrap px-5 py-3 is-border-top">
                <div class="pl-form-inline">
                  <template v-if="GRID.TABS[SELECT_TAB].BBS_TYPE_CD === 'EMRG_NTC'/*긴급공지인경우*/">
                    <span class="pl-label">
                      센터
                    </span>
                    <div class="pl-desc">
                      <v-select
                        class="pl-form type-middle"
                        placeholder="선택"
                        v-model="GRID.SRCH[SELECT_TAB].SRCH_CENTER"
                        :disabled="GRID.SRCH[SELECT_TAB].SRCH_CENTER_DISABLED"
                        return-object
                        :items="mixin_ognz_list_center(common_ognz_list, 'CUSL', '전체' )"
                      ></v-select>
                    </div>
                  </template>
                  <template v-if="GRID.TABS[SELECT_TAB].BBS_TYPE_CD == 'GNRL_NTC'/*일반공지*/ || GRID.TABS[SELECT_TAB].BBS_TYPE_CD == 'DAYLY_NTC' ">
                    <span class="pl-label">
                        조직
                    </span>
                    <div class="pl-desc">
                      <v-select
                        class="pl-form type-middle"
                        v-model="GRID.SRCH[SELECT_TAB].SRCH_DEPT"
                        :items="bbs_ognz_list_detail(GRID.TABS[SELECT_TAB], common_ognz_list, GRID.SRCH[SELECT_TAB].SRCH_CENTER.DEPT_ID, '전체' ,'Y'/*콜센터여부,없으면전체*/)"
                        placeholder="조직을 검색하세요"
                        clearable
                        return-object
                        no-data-text="결과 없음"
                        :disabled="GRID.SRCH[SELECT_TAB].SRCH_DEPT_DISABLED"
                      />
                    </div>
                  </template>
<!--                    <v-text-field-->
<!--                      class="pl-form type-middle is-xs"-->
<!--                      v-model="GRID.SRCH[SELECT_TAB].SRCH_USER_NM"-->
<!--                      @keydown.enter="selectHomeBbsList"-->
<!--                      placeholder="등록자"-->
<!--                    />-->
                    <v-select
                      v-model="GRID.SRCH[SELECT_TAB].SRCH_CONT_TYPE"
                      :items="['제목+내용', '제목', '내용', '등록자']"
                      class="pl-form type-middle is-mt"
                      placeholder="제목"
                    ></v-select>
                    <v-text-field
                      class="pl-form type-middle flex-grow-1 is-md"
                      v-model="GRID.SRCH[SELECT_TAB].SRCH_CONT"
                      @keydown.enter="selectHomeBbsList"
                      placeholder="검색어 입력"
                    />
                    <v-btn class="pl-btn" @click="selectHomeBbsList">조회</v-btn>
                  </div>
                </div>
              </div>
          </div>
          <div class="d-flex align-center is-mt-s px-6">
            <span class="pl-label">전체 (<span class="is-txt-blue">{{ GRID.SRCH[SELECT_TAB].ITEMS_TOT_CNT }}</span>)건</span>

            <v-checkbox
                class="pl-check ml-3"
                label="읽지않은"
                v-model="GRID.SRCH[SELECT_TAB].IS_UNREAD"
                @change="selectHomeBbsList"
            ></v-checkbox>
            <v-checkbox
                class="pl-check ml-3"
                label="열람만료포함"
                v-model="GRID.SRCH[SELECT_TAB].IS_LAST_PERIOD"
                @change="selectHomeBbsList"
            ></v-checkbox>
            <v-checkbox
                class="pl-check ml-3"
                label="나의게시물"
                v-model="GRID.SRCH[SELECT_TAB].IS_MY_PST"
                @change="selectHomeBbsList"
            ></v-checkbox>

            <v-checkbox
                class="pl-check ml-3"
                label="고정글우선제외"
                v-model="GRID.SRCH[SELECT_TAB].IS_FIX_PST"
                @change="selectHomeBbsList"
            ></v-checkbox>

            <compo-tooltip-btn
                v-if="GRID.SRCH[SELECT_TAB].IS_WRITE_AUTH === true?true:false"
                TitleProp="공지 등록"
                ClassProp="pl-tooltip-btn ml-auto"
                IconProp="pl-icon20 circle-plus"
                TooltipPositionProp="bottom"
                @btnClick="showWriteNotice"
            ></compo-tooltip-btn>
            <compo-tooltip-btn
                TitleProp="새로고침"
                :ClassProp="`pl-tooltip-btn ${ GRID.SRCH[SELECT_TAB].IS_WRITE_AUTH === false?'ml-auto':'ml-1' }`"
                IconProp="pl-icon20 refresh"
                TooltipPositionProp="bottom"
                :ProgressProp="isloading"
                @btnClick="selectHomeBbsList"
            ></compo-tooltip-btn>
          </div>
          <!-- list -->
            <template v-if="GRID.ITEMS[index].length === 0">
              <div class="is-mt-s pl-notice-list is-border-top pl-list-nodata">
                <span>조회된 정보가 없습니다.</span>
              </div>
            </template>
            <template v-else>
            <!-- list -->
            <div
              :style="`${DataProp === null ? 'height: calc(100vh - 400px);' : 'height: calc(100vh - 330px);'}`"
              class="is-mt-s pl-notice-list is-border-top pl-scroll-body"> <!-- 레이어팝업인경우 와 아닌경우 세로사이즈 조정. -->
              <div
                @click="selectBbsDetail(item)"
                class="pl-notice-list--unit"
                v-for="item in GRID.ITEMS[index]"
                :key="item.id">
                <div class="d-flex align-center">
                  <strong class="is-ellips" style="width: auto;">{{item.NO}}. <span v-if="item.POPUP_YN === 'Y'"><span class="pl-badge is-new ml-1" >고정</span></span> {{ item.PST_TTL }}</strong>
                  <span
                    v-if="item.IS_NEW === 'Y'"
                    class="pl-badge is-new ml-1">N</span>
                </div>
                <div class="d-flex align-center is-txt-sub mt-1" style="font-size: 12px; gap: 4px">
                  <template v-if="GRID.TABS[index].BBS_TYPE_CD !=='EMRG_NTC'">
                    <template v-if="item.BBS_TYPE_CD ==='GNRL_BBS' &&  item.BBS_USE_SE_CD !=='A'">
                      <span v-if="item.DEPT_NM">{{ item.DEPT_NM }}</span>
                    </template>
                    <template v-else>
                      <span v-if="item.PST_TYPE_CD_NM">{{ item.PST_TYPE_CD_NM }}</span>
                      <span v-if="item.DEPT_NM">&bull; {{ item.DEPT_NM }}</span>
                    </template>
                  </template>
                  <span v-if="item.RGTR_ID_NM">&bull; {{ item.RGTR_ID_NM }}({{ item.RGTR_DEPT_NM }})</span>
                  <span v-if="item.REG_DT_DD">&bull; {{ item.REG_DT_DD }}</span>
                  <span v-if="item.READ_CNT">&bull;조회 {{ item.READ_CNT }}</span>
                  <span v-if="item.FILE_GROUP_KEY">&bull; <v-icon class="pl-icon20 file"></v-icon></span>
                  <template v-if="GRID.TABS[index].BBS_TYPE_CD === 'GNRL_NTC'/*일반공지인경우*/ || GRID.TABS[index].BBS_TYPE_CD === 'DAYLY_NTC'/*일일공지인경우*/">
                    &bull; 열람:~ {{item.PSTG_END_DT_DD}}
                  </template>
                </div>
              </div>
              <template v-if="isloading">
                <div class="is-mt-s pl-notice-list pl-list-nodata">
                  <div class="loading loading03">
                    <span>조</span>
                    <span>회</span>
                    <span>중</span>
                    <span>입</span>
                    <span>니</span>
                    <span>다</span>
                  </div>
                </div>
              </template>
              <!-- 더보기 -->
              <div class="d-flex justify-center is-mt-m pb-3">
                <v-btn :disabled="GRID.PAGINATION[index].nextDisabled" class="pl-btn is-round is-sub px-4" @click="selectHomeBbsList('next')">더보기</v-btn>
              </div>
            </div>
          </template>
        </template>
        <!-- detail -->
        <template v-else>
          <div class="d-flex flex-column" style="height: calc(100vh - 154px)">
            <!-- header -->
            <div class="px-6 py-2 d-flex align-center is-border-bottom">
              <!-- 뒤로 버튼 -->
              <compo-tooltip-btn
                TitleProp="뒤로 가기"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 back-arrow"
                TooltipPositionProp="bottom"
                @btnClick="detailMode = false"
              ></compo-tooltip-btn>
              <div class="ml-3">
                <div class="d-flex align-center">
                  <span >
                    <strong style="font-size: 14px;" >{{ GRID.ITEMS_DETAIL[SELECT_TAB].NO }}. <span v-if="GRID.ITEMS_DETAIL[SELECT_TAB].POPUP_YN === 'Y'"><span class="pl-badge is-new ml-1" >고정</span></span> {{ restoreXSS_CrossEditor(GRID.ITEMS_DETAIL[SELECT_TAB].PST_TTL) }}</strong>
                  </span>
                </div>
                <div class="d-flex align-center is-txt-sub" style="gap: 4px">
                  <template v-if="GRID.ITEMS_DETAIL[SELECT_TAB].BBS_TYPE_CD !=='EMRG_NTC'">
                    <template v-if="GRID.ITEMS_DETAIL[SELECT_TAB].BBS_TYPE_CD ==='GNRL_BBS' &&  GRID.ITEMS_DETAIL[SELECT_TAB].BBS_USE_SE_CD !=='A'">
                      <span v-if="GRID.ITEMS_DETAIL[SELECT_TAB].DEPT_NM">{{ GRID.ITEMS_DETAIL[SELECT_TAB].DEPT_NM }}</span>
                    </template>
                    <template v-else>
                      <span v-if="GRID.ITEMS_DETAIL[SELECT_TAB].PST_TYPE_CD_NM">{{ GRID.ITEMS_DETAIL[SELECT_TAB].PST_TYPE_CD_NM }}</span>
                      <span v-if="GRID.ITEMS_DETAIL[SELECT_TAB].DEPT_NM"> &bull; {{ GRID.ITEMS_DETAIL[SELECT_TAB].DEPT_NM }}</span>
                    </template>
                  </template>
                  <span v-if="GRID.ITEMS_DETAIL[SELECT_TAB].RGTR_ID_NM">&bull; {{ GRID.ITEMS_DETAIL[SELECT_TAB].RGTR_ID_NM }}({{ GRID.ITEMS_DETAIL[SELECT_TAB].RGTR_DEPT_NM }})</span>
                  <span v-if="GRID.ITEMS_DETAIL[SELECT_TAB].REG_DT_DD">&bull; {{ GRID.ITEMS_DETAIL[SELECT_TAB].REG_DT }}</span>
                  <span v-if="GRID.ITEMS_DETAIL[SELECT_TAB].READ_CNT">&bull; 조회 {{ GRID.ITEMS_DETAIL[SELECT_TAB].READ_CNT }}</span>
                  <span v-if="GRID.ITEMS_DETAIL[SELECT_TAB].FILE_GROUP_KEY">&bull; <v-icon class="pl-icon20 file"></v-icon></span>

                </div>
              </div>
            </div>
            <!-- content -->

            <div class="pl-scroll-body flex-grow-1 flex-shrink-1" >
              <div class="d-flex pl-btn-wrap pt-2" v-if="GRID.ITEMS_DETAIL[SELECT_TAB].RGTR_ID === user_id/*본인작성게시물*/ || computedUserDetailType === 'SUPER_ADMIN' /*시스템슈퍼관리자*/ || computedUserDetailType === 'SYS_ADMIN'/*시스템관리자*/">
                <!-- 수정 버튼 -->
                <compo-tooltip-btn
                    TitleProp="수정"
                    ClassProp="pl-tooltip-btn ml-auto"
                    IconProp="pl-icon20 edit"
                    TooltipPositionProp="bottom"
                    @btnClick="modifyPst"
                ></compo-tooltip-btn>
                <!-- 삭제 버튼 -->
                <compo-tooltip-btn
                    TitleProp="삭제"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 trash"
                    TooltipPositionProp="bottom"
                    @btnClick="deletePst"
                ></compo-tooltip-btn>
              </div>
              <div
                class="px-6 py-3 "
                style="white-space: pre-wrap; font-size: 13px; min-height:250px">
                <span v-html="restoreXSS_CrossEditor(GRID.ITEMS_DETAIL[SELECT_TAB].PST_CN)"></span>
              </div>
              <div class="pl-file-list px-6 py-3">
                <div
                  class="pl-file-list--unit"
                  v-for="file in GRID.ITEMS_DETAIL[SELECT_TAB].filelist"
                  :key="file.FILE_KEY">
                  <div
                    class="d-flex align-center justify-center"
                    :style="`width: 50px; height: 50px; background-color: `">
                    <img width="20px" height="20px" :src="`/image/file_ext_icon/${ file.FILE_EXTN.toUpperCase() }.png`" @error="function(e){e.target.src='/image/file_ext_icon/Default.png'}">
<!--                    <v-icon :class="`pl-icon30 file-${ file.FILE_EXTN }`"></v-icon>-->
                  </div>
                  <div class="ml-2">
                    <span>{{ file.ACTL_FILE_NM }}</span>
                    <div >
                      {{ mixin_getFileSize(file.FILE_SZ) }}
                    </div>
                  </div>
                  <v-icon class="pl-icon30 file-down-arrow ml-auto" @click="mixin_fileDownload(file, file.TASK_TYPE_CD, file.PATH_TYPE_CD)"></v-icon>
                </div>
              </div>
            </div>
            <!-- footer -->
            <div class="pl-quick-layer-footer" style="flex: 0 0 55px">
              <div class="d-flex align-center">
                <div class="ml-2 spacing-wrap sp-4">
                  <v-btn
                    :disabled="GRID.ITEMS_DETAIL[SELECT_TAB].BEFO_PST_ID === '-1'"
                    class="pl-btn is-trans is-icon"
                    @click="moveDetail(GRID.ITEMS_DETAIL[SELECT_TAB].BEFO_PST_ID)"
                  >
                    <span class="pl-icon20 arrow-down"></span>이전
                  </v-btn>
                  <v-btn
                    :disabled="GRID.ITEMS_DETAIL[SELECT_TAB].NEXT_PST_ID === '-1'"
                    class="pl-btn is-trans is-icon"
                    @click="moveDetail(GRID.ITEMS_DETAIL[SELECT_TAB].NEXT_PST_ID)"
                  >
                    <span class="pl-icon20 arrow-up"></span>다음
                  </v-btn>
                </div>
              </div>
              <div class="pl-btn-wrap ml-auto">
                <v-btn class="pl-btn" @click="detailMode = false">목록</v-btn>
              </div>
            </div>
          </div>
        </template>
      </v-tab-item>
    </v-tabs-items>
    <!-- dialog: 공지 등록 -->
    <v-dialog
      v-if="dialogWriteNotice"
      v-model="dialogWriteNotice"
      content-class="dialog-draggable is-lg is-maxHeight"
      persistent
      :retain-focus="false"
      >
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="BBS_TITLE"
        @hide="eventWriteFormDialog('close')"
        @submit="submitDialog('WriteNotice')"
      >
        <template slot="body">
          <CompoNoticeWrtie :DataSet="modifyDataSet" ref="dialogWriteFormRef" @Refresh="selectBbsDetail" @Close="closeModal"/>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="closeModal">닫기</v-btn>
          <v-btn class="pl-btn" @click="eventWriteFormDialog('save')">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoNoticeWrtie from '@/components/CompoNoticeWrtie'

export default {
  name: "StatusBoardNotice", //name은 'MENU_' + 파일명 조합
  components: {
    CompoNoticeWrtie,
  },
  props:{
    DataProp:{
      type: Object,
      default:null
    },
    TabProp: {
      type: Number,
      default: null,
    },
    injectionObj: {
      type: Object,
      default:null
    }
  },
  data() {
    return {
      popupMessage: '', // 팝업에서 받은 메시지

      BBS_TITLE : '',
      common_code_global:[],
      common_ognz_list:[],

      detailMode: false,
      // dropMiniProfile: false, //미니 프로필
      // 공지 등록
      dialogWriteNotice: false,
      modifyDataSet: null,
      isloading:true,

      SELECT_TAB: this.TabProp,
      GRID: {
        ROWS_PER_PAGES: 15,
        TABS: [],
        ITEMS:[],
        ITEMS_DETAIL:[],
        SRCH:[],
        PAGINATION:[],
      },
      SRCH_ST: this.$moment(new Date()).subtract(12,'months').format('YYYY-MM-DD'),
      SRCH_END: this.$moment(new Date()).format('YYYY-MM-DD'),
      fileExtList: [
        { name: 'file-pdf', color: '#AE0C00'},
        { name: 'file-hwp', color: '#35AEE7'},
        { name: 'file-xlsx', color: '#017338'},
      ],

    }
  },
  methods: {
    saveEvent() {
      this.$ref.dialogWriteFormRef
    },
    async showWriteNotice(){
      if( this.modifyDataSet === null ) {
        this.modifyDataSet = {};
        this.modifyDataSet = this.GRID.TABS[this.SELECT_TAB];
        this.modifyDataSet.filelist = await this.mixin_getFileList( 'xxxx' );
      }
      this.mixin_showDialog('WriteNotice')
    },
    async selectHomeHeaderBbsList() {
      let sURL = '/api/biz/common/select/selectHomeHeaderBbsList';
      let postParam = {
        SRCH_DEPT_ID: this.computedUserDeptId
        , SRCH_CENTER_DEPT_ID: this.computedUserCenterDeptId
        , SRCH_CUSTCO_ID: this.computedUserCenter
      };
      let headParam = {head:{ns : 'lhcs.system.bbs.dao.BbsMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG){
        this.GRID.TABS = [];  //슬라이드게시판 탭관련
        this.GRID.ITEMS = []; //탭별 게시물
        this.GRID.ITEMS_DETAIL = [];  //탭별 게시물상세
        this.GRID.SRCH = [];  // 탭별 검색조건
        this.GRID.PAGINATION = []; // 탭별 페이징조건
        this.GRID.TABS = response.DATA;
        for( let i=0; i<this.GRID.TABS.length;i++ ) {
          this.GRID.ITEMS[i] = [];  //게시물목록
          this.GRID.ITEMS_DETAIL[i] = {}; //게시물상세
          this.GRID.SRCH[i] = {
            ITEMS_TOT_CNT/*전체건수*/:0,
            IS_UNREAD/*읽지않은게시물*/: false,
            IS_LAST_PERIOD/*게시기간지난*/: false,
            IS_MY_PST/*내가작성한*/: false,
            IS_FIX_PST/*고정숨기기*/: false,

            IS_WRITE_AUTH: this.checkAuthWriteBtn(this.GRID.TABS[i]),
            SRCH_CENTER: {},  //센터
            SRCH_DEPT: {},
            SRCH_CENTER_DISABLED:false,
            SRCH_DEPT_DISABLED:false,
            SRCH_CONT_TYPE: '제목+내용'
          };
          this.GRID.PAGINATION[i] = { page: 1, rowsPerPage: this.GRID.ROWS_PER_PAGES, sortBy: "", descending: "", nextDisabled:false }; //페이징속성정의

          if( this.GRID.TABS[i].BBS_TYPE_CD === 'EMRG_NTC'/*긴급공지인경우*/ ) {
            this.GRID.SRCH[i].SRCH_CENTER.CUSTCO_ID = this.GRID.TABS[i].CUSTCO_ID;
            this.GRID.SRCH[i].SRCH_CENTER.value = '';
            this.GRID.SRCH[i].SRCH_CENTER.DEPT_ID = this.GRID.TABS[i].DEPT_ID;
            this.GRID.SRCH[i].SRCH_DEPT.value = this.GRID.TABS[i].DEPT_ID;
            this.GRID.SRCH[i].SRCH_DEPT.DEPT_ID = this.GRID.TABS[i].DEPT_ID;
            this.GRID.SRCH[i].SRCH_CENTER_DISABLED = true;
          }else if( (this.GRID.TABS[i].BBS_TYPE_CD === 'GNRL_NTC'/*일반공지인경우*/ ) && this.GRID.TABS[i].BBS_GB === '' /*전체*/ ) {
            this.GRID.SRCH[i].SRCH_CENTER.CUSTCO_ID = this.GRID.TABS[i].CUSTCO_ID;
            this.GRID.SRCH[i].SRCH_CENTER.DEPT_ID = this.GRID.TABS[i].DEPT_ID;
            this.GRID.SRCH[i].SRCH_DEPT.value = this.GRID.TABS[i].DEPT_ID;
            this.GRID.SRCH[i].SRCH_DEPT.DEPT_ID = this.GRID.TABS[i].DEPT_ID;
            this.GRID.SRCH[i].SRCH_DEPT_DISABLED = true;
          }else if( this.GRID.TABS[i].BBS_TYPE_CD === 'GNRL_NTC'/*일반공지인경우*/ &&  this.GRID.TABS[i].BBS_GB === 'T' /*팀*/ ) {
            this.GRID.SRCH[i].SRCH_CENTER.CUSTCO_ID = this.GRID.TABS[i].CUSTCO_ID;
            this.GRID.SRCH[i].SRCH_CENTER.DEPT_ID = this.GRID.TABS[i].DEPT_ID;
            if( this.computedUserDetailType === 'CENTER_LEADER') {
              this.GRID.SRCH[i].SRCH_DEPT.value = '';
              this.GRID.SRCH[i].SRCH_DEPT.DEPT_ID = '';
              this.GRID.SRCH[i].SRCH_DEPT_DISABLED = false;
            }else {
              this.GRID.SRCH[i].SRCH_DEPT.value = this.computedUserDeptId;
              this.GRID.SRCH[i].SRCH_DEPT.DEPT_ID = this.computedUserDeptId;
              this.GRID.SRCH[i].SRCH_DEPT_DISABLED = false;
            }
          }else if(this.GRID.TABS[i].BBS_TYPE_CD === 'DAYLY_NTC'/*일일공지인경우*/ ) {
            this.GRID.SRCH[i].SRCH_CENTER.CUSTCO_ID = this.GRID.TABS[i].CUSTCO_ID;
            this.GRID.SRCH[i].SRCH_CENTER.DEPT_ID = this.GRID.TABS[i].DEPT_ID;
            if( this.computedUserDetailType === 'CENTER_LEADER') {
              this.GRID.SRCH[i].SRCH_DEPT.value = '';
              this.GRID.SRCH[i].SRCH_DEPT.DEPT_ID = '';
              this.GRID.SRCH[i].SRCH_DEPT_DISABLED = false;
            }else {
              // this.GRID.SRCH[i].SRCH_DEPT.value = this.computedUserDeptId;
              // this.GRID.SRCH[i].SRCH_DEPT.DEPT_ID = this.computedUserDeptId;
              this.GRID.SRCH[i].SRCH_DEPT.value = '';
              this.GRID.SRCH[i].SRCH_DEPT.DEPT_ID = '';
              this.GRID.SRCH[i].SRCH_DEPT_DISABLED = false;
            }
          }else if(this.GRID.TABS[i].BBS_TYPE_CD === 'GNRL_BBS'/* 일반게시판. */  &&  this.GRID.TABS[i].BBS_USE_SE_CD === 'CT' /* 일반게시판 C + T*/ ) {
            this.GRID.SRCH[i].SRCH_CENTER.CUSTCO_ID = this.GRID.TABS[i].CUSTCO_ID;
            this.GRID.SRCH[i].SRCH_CENTER.DEPT_ID = this.GRID.TABS[i].DEPT_ID;
            this.GRID.SRCH[i].SRCH_DEPT.value = '';
            this.GRID.SRCH[i].SRCH_DEPT.DEPT_ID = '';
            this.GRID.SRCH[i].SRCH_DEPT_DISABLED = false;
          }else if(this.GRID.TABS[i].BBS_TYPE_CD === 'GNRL_BBS'/* 일반게시판. */  &&  this.GRID.TABS[i].BBS_USE_SE_CD === 'T' /* 일반게시판 팀T*/ ) {
            this.GRID.SRCH[i].SRCH_CENTER.CUSTCO_ID = this.GRID.TABS[i].CUSTCO_ID;
            this.GRID.SRCH[i].SRCH_CENTER.DEPT_ID = this.GRID.TABS[i].DEPT_ID;
            this.GRID.SRCH[i].SRCH_DEPT.value = this.GRID.TABS[i].DEPT_ID;
            this.GRID.SRCH[i].SRCH_DEPT.DEPT_ID = this.GRID.TABS[i].DEPT_ID;
            this.GRID.SRCH[i].SRCH_DEPT_DISABLED = true;

          }else if(this.GRID.TABS[i].BBS_TYPE_CD === 'GNRL_BBS'/* 일반게시판. */  &&  this.GRID.TABS[i].BBS_USE_SE_CD === 'A' /* 일반게시판 전체 */ ) {
            this.GRID.SRCH[i].SRCH_CENTER.CUSTCO_ID = this.GRID.TABS[i].CUSTCO_ID;
            this.GRID.SRCH[i].SRCH_CENTER.value = this.GRID.TABS[i].CUSTCO_ID;
            this.GRID.SRCH[i].SRCH_CENTER.DEPT_ID = this.GRID.TABS[i].DEPT_ID;
            this.GRID.SRCH[i].SRCH_DEPT.value = this.GRID.TABS[i].DEPT_ID;
            this.GRID.SRCH[i].SRCH_DEPT.DEPT_ID = this.GRID.TABS[i].DEPT_ID;
            this.GRID.SRCH[i].SRCH_CENTER_DISABLED = true;
          }
        }
        this.selectHomeBbsList();
      }
    },
    async selectHomeBbsList(next) {
      this.isloading = true;
      if (next !== undefined && next === 'next'){
        this.GRID.PAGINATION[this.SELECT_TAB].page += 1;
      } else {
        this.GRID.ITEMS[this.SELECT_TAB] = [];
        this.GRID.PAGINATION[this.SELECT_TAB].page = 1; //페이징 처리 초기화
      }
      let obj = this.GRID.TABS[ this.SELECT_TAB ];

      let sURL = '/api/biz/common/select/selectSlideBbsList';
      let postParam = {};
      postParam.SRCH_ROWNUM = this.GRID.ROWS_PER_PAGES;
      postParam.SRCH_DEPT_ID = this.GRID.SRCH[this.SELECT_TAB].SRCH_DEPT.value;
      postParam.SRCH_CENTER_DEPT_ID = this.GRID.SRCH[this.SELECT_TAB].SRCH_CENTER.DEPT_ID;
      postParam.SRCH_ST = this.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_END.replaceAll("-","");
      postParam.SRCH_USER_NM = this.GRID.SRCH[this.SELECT_TAB].SRCH_USER_NM;
      postParam.SRCH_PST_TYPE_CD = this.GRID.SRCH[this.SELECT_TAB].SRCH_PST_TYPE_CD;
      if( this.GRID.SRCH[this.SELECT_TAB].SRCH_CONT_TYPE === '제목' ) {
        postParam.SRCH_CONT_TYPE = 'TTL';
      }else if( this.GRID.SRCH[this.SELECT_TAB].SRCH_CONT_TYPE === '내용' ) {
        postParam.SRCH_CONT_TYPE = 'CONT';
      }else if( this.GRID.SRCH[this.SELECT_TAB].SRCH_CONT_TYPE === '등록자' ) {
        postParam.SRCH_CONT_TYPE = 'REG_USER_NM';
      }else if(this.GRID.SRCH[this.SELECT_TAB].SRCH_CONT_TYPE === '제목+내용'){
        postParam.SRCH_CONT_TYPE = 'TTLCONT';
      }
      postParam.SRCH_CONT = this.GRID.SRCH[this.SELECT_TAB].SRCH_CONT;
      postParam.SRCH_IS_UNREAD = (this.GRID.SRCH[this.SELECT_TAB].IS_UNREAD)?'Y':'N'; //읽지않은게시물
      postParam.SRCH_IS_LAST_PERIOD = (this.GRID.SRCH[this.SELECT_TAB].IS_LAST_PERIOD)?'Y':'N'; //기간만료(게시기간) 게시물
      postParam.SRCH_IS_MY_PST = (this.GRID.SRCH[this.SELECT_TAB].IS_MY_PST)?'Y':'N'; //내가작성한 게시물
      postParam.SRCH_IS_FIX_PST = (this.GRID.SRCH[this.SELECT_TAB].IS_FIX_PST)?'Y':'N'; //고정우선제외

      postParam.SRCH_BBS_TYPE_CD = obj.BBS_TYPE_CD;
      postParam.SRCH_BBS_GB = obj.BBS_GB;
      postParam.SRCH_BBS_ID = obj.BBS_ID;
      postParam.SRCH_BBS_USE_SE_CD = obj.BBS_USE_SE_CD;

      let headParam = {
        head: {
          ROW_CNT : this.GRID.PAGINATION[this.SELECT_TAB].rowsPerPage,
          PAGES_CNT : this.GRID.PAGINATION[this.SELECT_TAB].page,
          PAGING : 'Y',
          ns: "lhcs.system.bbs.dao.BbsMapper"
        }
      };
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        let responseData = response.DATA;

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.GRID.PAGINATION[this.SELECT_TAB].nextDisabled = false //버튼 활성화
          }else{
            this.GRID.PAGINATION[this.SELECT_TAB].nextDisabled = true  //버튼 비활성화
          }
        }

        if(responseData.length > 0) this.GRID.SRCH[this.SELECT_TAB].ITEMS_TOT_CNT = response.HEADER.TOT_COUNT;
        else this.GRID.SRCH[this.SELECT_TAB].ITEMS_TOT_CNT = 0;

        responseData.map((item,idx) => {
          item.NO = response.HEADER.TOT_COUNT - ((this.GRID.PAGINATION[this.SELECT_TAB].page-1) * this.GRID.PAGINATION[this.SELECT_TAB].rowsPerPage) - idx;
          item.PST_TTL = this.restoreXSS_CrossEditor( item.PST_TTL );
          item.SELECT_TAB = this.SELECT_TAB;
          item.BBS_TYPE_CD = obj.BBS_TYPE_CD;
          item.BBS_GB = obj.BBS_GB;
          item.BBS_USE_SE_CD = obj.BBS_USE_SE_CD;
        });
        this.GRID.ITEMS[this.SELECT_TAB] = [...this.GRID.ITEMS[this.SELECT_TAB], ...responseData];
        this.GRID.ITEMS.splice(this.SELECT_TAB,1, this.GRID.ITEMS[this.SELECT_TAB]);

      }
      this.isloading = false;
      console.log( "selectHomeBbsList() end ");
    },
    async selectBbsDetail(item){
      if( item !== undefined ) this.GRID.ITEMS_DETAIL.splice(this.SELECT_TAB,1, JSON.parse(JSON.stringify(item))/*DeepCopy*/);

      let obj = this.GRID.ITEMS_DETAIL[this.SELECT_TAB];
      this.detailMode = true;

      let postParam = {SRCH_BBS_ID:obj.BBS_ID, SRCH_PST_ID:obj.PST_ID};
      let response = await this.common_postCall("/system-api/bbs/selectPstCn", postParam, {});
      if (!response.HEADER.ERROR_FLAG){
        this.GRID.ITEMS_DETAIL[this.SELECT_TAB].PST_CN = response.DATA[0].PST_CN;
        if( item !== undefined )  item.IS_NEW = 'N';
        // 미니전광판(긴급+공지+팀공지+코칭) 리로드
        if( window.opener && !window.opener.closed ) {
          window.opener.receiveDataFromPopup({BIZ_TYPE:'BBS', MESSAGE:{REFRESH_TARGET:'BOARD_STAT'} }); // 부모 창의 메서드 호출
        }else {
          this.mixin_reloadCuttStat('BOARD_STAT');  // 미니전광판(긴급+공지+팀공지+코칭) 리로드
        }
      }
      if( !this.mixin_isEmpty( obj.FILE_GROUP_KEY ) ) {
        this.GRID.ITEMS_DETAIL[this.SELECT_TAB].filelist = await this.mixin_getFileList( obj.FILE_GROUP_KEY );
      }else {
        this.GRID.ITEMS_DETAIL[this.SELECT_TAB].filelist = await this.mixin_getFileList( 'xxxx' );
      }
      this.GRID.ITEMS_DETAIL.splice(this.SELECT_TAB,1, this.GRID.ITEMS_DETAIL[this.SELECT_TAB]);
    },
    async moveDetail( pstId ) {
      console.log( pstId );
      let item = this.GRID.ITEMS[this.SELECT_TAB].find((item) => item.PST_ID === pstId);
      if( item !== undefined ) {
        await this.selectBbsDetail( item );
      }else {
        await this.selectHomeBbsList('next');
        item = this.GRID.ITEMS[this.SELECT_TAB].find((item) => item.PST_ID === pstId);
        if( item !== undefined ) {
          await this.selectBbsDetail( item );
        }
      }
    },

    async modifyPst() {
      this.modifyDataSet = JSON.parse(JSON.stringify(this.GRID.ITEMS_DETAIL[this.SELECT_TAB]))/*DeepCopy*/;
      this.mixin_showDialog('WriteNotice');
    },
    async deletePst() {

      console.log( ">>>>>>>>" + this.GRID.ITEMS_DETAIL[this.SELECT_TAB].BBS_ID );

      this.showConfirmInfo({msg: '게시물을 삭제 하시겠습니까?'
        , callYes : ()=>{ this.deletePstProcess() }
        , callNo : this.closeAlert
      })
    },
    async deletePstProcess() {
      let sUrl = '/system-api/bbs/pstDelete';
      let response = await this.common_postCall(sUrl, { BBS_ID:this.GRID.ITEMS_DETAIL[this.SELECT_TAB].BBS_ID, PST_ID:this.GRID.ITEMS_DETAIL[this.SELECT_TAB].PST_ID }, {});

      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg : '정상 처리되었습니다.', callAfter : ()=>{
            this.$eventBus.$emit('reloadBoardList');
            this.detailMode = false;
          }});
      }else {
        this.showToastCaution({msg: response.HEADER.ERROR_MSG});
      }
      this.closeAlert();
    },

    /* 등록버튼 제어( true:권한있음, false:권한없음 ) */
    checkAuthWriteBtn( tabItem) {
      let result = false;
      let writeAuth = tabItem.WRITE_AUTHRT;
      let groupCds = this.computedUserGroupCd.split(",");
      if( tabItem.WRITE_AUTHRT !== undefined ) {
        let writeAuths = writeAuth.split(",");
        if( writeAuths.indexOf("ALL") > -1) { //로그인한 사용자 전체 쓰기권한
          result = true;
        }else {
          for (let i = 0; i < groupCds.length; i++) {
            if (writeAuths.indexOf(groupCds[i]) > -1) {
              result = true;
              break;
            }
          }
        }
      }
      return result;
    },
    eventWriteFormDialog(type) {
      if( type === 'save' ) {
        this.$refs.dialogWriteFormRef.saveTaskInfo();
      }else if( type === 'close' ) {
        this.$refs.dialogWriteFormRef.closeModal();
        this.closeModal();
      }
    },
    closeModal(){
      this.modifyDataSet = null;
      this.mixin_hideDialog('WriteNotice');

    },
    closeSlide() {
      this.$emit('Close');
    },
    bbs_ognz_list_detail(obj, all_code, dept_id, strHeadText, CL_CNTR_YN/*콜센터여부*/) {
      var responseData = [];
      if (strHeadText != "" && strHeadText != undefined) {
        responseData.push({ text: strHeadText, value: "" });
      }
      if (all_code && typeof all_code === "object") {
        for (var i = 0; i < all_code.length; i++) {
          let item = all_code[i];
          item.value = item.DEPT_ID;
          if (item.LVL > 3) {
            // 3레벨 이상은 루트>그룹> 제외된 full path 표기
            item.text = item.FULL_PATH.replace(/[^>]+>[^>]+>/, "")
          } else {
            item.text = this.mixin_decode(item.DEPT_NM); //공통코드명 특수문자 decode
          }
          if (obj.BBS_TYPE_CD === 'GNRL_NTC'/*일반공지인경우*/ && obj.BBS_GB === 'T' /*팀*/) {
            if( item.DEPT_ID !== dept_id ) {  // 팀게시판인경우는 센터제외
              if (item.FULL_DEPT_PATH.startsWith('1>' + dept_id)) {
                if (CL_CNTR_YN) {
                  if (item.CL_CNTR_YN === CL_CNTR_YN) {  //조직정보에 콜센터여부 에따른 조회인경우.
                    responseData.push(item);
                  }
                }
              }
            }
          }else {
            if (item.FULL_DEPT_PATH.startsWith('1>' + dept_id)) {
              if (CL_CNTR_YN) {
                if (item.CL_CNTR_YN === CL_CNTR_YN) {  //조직정보에 콜센터여부 에따른 조회인경우.
                  responseData.push(item);
                }
              }
            }
          }
        }
      }
      return responseData;
    },

    layoutPopup() {
      this.GRID.TABS[this.SELECT_TAB].SELECT_TAB = this.SELECT_TAB;
      this.mixin_openWindow( 'LayoutPopup', '675', '785', {title:'게시판', compo_name : 'StatusBoardNotice', injectionObj: this.GRID.TABS[this.SELECT_TAB] })
    },
  },
  mounted() {
    console.log("** StatusBoardNotice.vue.mounted()");
  },
  async created() {

    //조직
    this.common_ognz_list = await this.mixin_ognz_list();

    if( this.DataProp !== null && this.DataProp.injectionObj !== undefined ) {
      // Layout팝업으로 호출된경우.
      this.injectionObj = this.DataProp.injectionObj;
      this.SELECT_TAB = this.DataProp.injectionObj.SELECT_TAB;

      console.log("Layout팝업으로 호출된경우. >> ");
      console.log("this.injectionObj >> ", this.injectionObj);
      console.log("this.SELECT_TAB >> ", this.SELECT_TAB);
    }

    await this.selectHomeHeaderBbsList();

    if( this.injectionObj != null && this.injectionObj.PST_ID !== undefined ) { //외부에서 게시물상세 조회시
      this.GRID.ITEMS_DETAIL[this.SELECT_TAB] = JSON.parse(JSON.stringify(this.injectionObj))/*DeepCopy*/;
      this.selectBbsDetail();
    }

    let codeNameGloal = ['NE'/*게시물유형*/];
    this.common_code_global = await this.mixin_common_code_get_all_global( codeNameGloal );
    this.BBS_TITLE = ((this.GRID.TABS[this.SELECT_TAB] !== undefined && this.GRID.TABS[this.SELECT_TAB].BBS_GB === 'T')?'팀':'') +
        ((this.GRID.TABS[this.SELECT_TAB] !== undefined && this.GRID.TABS[this.SELECT_TAB].BBS_NM !== undefined)?this.GRID.TABS[this.SELECT_TAB].BBS_NM:'');

    this.$eventBus.$on('reloadBoardList', (type)=>{
      console.log("StatusBoardNotice.reloadBoardList");
      this.selectHomeBbsList();
    });
    this.$eventBus.$on('reloadBoardDetail', (item)=>{
      console.log("this.$eventBus reloadBoardDetail 1 :: " , item );
      this.GRID.ITEMS_DETAIL[this.SELECT_TAB] = JSON.parse(JSON.stringify(item))/*DeepCopy*/;
      console.log("this.$eventBus reloadBoardDetail 2 :: " , this.GRID.ITEMS_DETAIL[this.SELECT_TAB].filelist );
      this.selectBbsDetail();
      console.log("this.$eventBus reloadBoardDetail 3 :: " );
    });

  },
  beforeDestroy() {
    this.$eventBus.$off("reloadBoardList");
  },
  computed: {
  },
  watch: {
    SELECT_TAB() {
      this.detailMode = false;
      if( this.SELECT_TAB !== undefined ) {
        if( this.GRID.ITEMS[this.SELECT_TAB] !== undefined && this.GRID.ITEMS[this.SELECT_TAB].length === 0) {
          this.selectHomeBbsList();
        }
        this.BBS_TITLE = ((this.GRID.TABS[this.SELECT_TAB] !== undefined && this.GRID.TABS[this.SELECT_TAB].BBS_GB === 'T')?'팀':'') +
            ((this.GRID.TABS[this.SELECT_TAB] !== undefined && this.GRID.TABS[this.SELECT_TAB].BBS_NM !== undefined)?this.GRID.TABS[this.SELECT_TAB].BBS_NM:'');
      }
    },
    detailMode() {
      if( this.detailMode === false) this.GRID.ITEMS_DETAIL[this.SELECT_TAB] = {}; //초기화
    },
    injectionObj() {
      if( this.SELECT_TAB !== this.injectionObj.tabNum) {
        this.SELECT_TAB = this.injectionObj.tabNum;
      }else {
        if (this.injectionObj.PST_ID !== undefined) { //외부에서 게시물상세 조회시
          console.log("watch.injectionObj :: 1 ");
          this.GRID.ITEMS_DETAIL[this.SELECT_TAB] = JSON.parse(JSON.stringify(this.injectionObj))/*DeepCopy*/;
          this.selectBbsDetail();
          this.detailMode = true;
        } else {
          console.log("watch.injectionObj :: 2 ");
          this.GRID.ITEMS[this.SELECT_TAB] = [];
          this.selectHomeBbsList();
          this.detailMode = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>