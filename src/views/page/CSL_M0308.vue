<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <!-- {{ mixin_getCustcoSrvcStat('RSVT') }} -->
              <span class="pl-label">
                조회 기간
              </span>
              <div class="pl-desc">
                <compo-date-range-picker
                    :StartDayProp.sync="startDate"
                    :EndDayProp.sync="endDate"
                    @startDayChange=""
                    @endDayChange=""
                />
              </div>
            </div>
            <!-- <div class="pl-form-inline">
              <span class="pl-label">
                제품 유형
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="dropProd"
                  class="pl-form"
                  :items="dropProdItems"
                  placeholder="선택하세요"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                진행 상태
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="dropProgress"
                  class="pl-form"
                  :items="dropProgressItems"
                  placeholder="선택하세요"
                />
              </div>
            </div> -->
            <div class="pl-form-inline">
              <span class="pl-label">
                예약처리결과
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="dropProgress"
                  class="pl-form"
                  :items="mixin_common_code_get(this.list_common_code, 'RSVT_RS', '전체')"
                  placeholder="선택하세요"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                <v-select
                v-model="SCH_KEY"
                class="pl-form"
                :items="mixin_common_code_get(this.list_common_code, 'CUTT_HIST_SRCH')"
                placeholder="선택하세요"
                />
              </span>
              <div class="pl-desc">
                <v-text-field
                v-model="SCH_KEYWORD"
                class="pl-form "
                placeholder="검색어 입력"
                @keyup.enter="schCuttHistList('')"
              />
              </div>
            </div>
            <div class="d-flex">
              <v-btn
                class="pl-btn is-icon"
                @click="getRsvtList()"
                >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <v-btn
              class="pl-btn is-icon is-sub"
              @click="selectDetail()"
              >
              <span class="pl-icon20 document"></span>
              선택항목 상세
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-tooltip-btn
              TitleProp="엑셀 다운로드"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 exceldown"
              TooltipPositionProp="bottom"
              :DisabledProp="items.length > 0?false:true"
              @btnClick="showExceldownFilter()"
            ></compo-tooltip-btn>
          </div>
        </div>
        <v-data-table
          class="pl-grid has-img has-control"
          show-select
          :headers="headers"
          :items="items"
          :item-class="isActiveRow"
          fixed-header
          item-key="index"
          height="562px"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
          :page.sync="page"
          @page-count="pageCount = $event"
          no-data-text="등록된 데이터가 없습니다."
          @click:row="rowClick"
          @dblclick:row="selectDetail"
          >
          <!-- 상담직원 -->
          <template v-slot:item.USER_NM="{ item }">
            <img
              v-if="item.USER_NM"
              :src="item.USER_ICON ? item.USER_ICON : require('@/assets/img/@profile_user.png')"
              :alt="`${ item.USER_NM  }`"
              class="pl-grid-portrait"
              @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
            >
            <span class="ml-3">{{ item.USER_NM }}</span>
          </template>
          <!-- 상태 -->
          <template v-slot:item.RSVT_RS="{ item }">
            <span :class="`pl-round-chip is-sm ${ mixin_displayStatus(item.RSVT_RS_CD, `statList`) }`">
              {{ item.RSVT_RS_NM }}
            </span>
          </template>
          <!-- 결제정보 -->
          <template v-slot:item.STLM_YN="{ item }">
            <div
              :class="`is-txt-${ item.STLM_YN == 'Y' ? 'error' : 'disable' }`">
              {{ item.STLM_YN == 'Y' ? '있음' : '없음'}}
            </div>
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

          <span class="pl-pager-period">
            보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp = "nextDisabled"
              @btnClick="getRsvtList('next')"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>
    <!-- 모달 : 예약내역(sw전용!!!!!) -->
    <v-slide-x-reverse-transition>
      <div class="pl-quick-layer" v-if=" detailModal === true ">
        <div class="pl-quick-layer-header"><h1>상담 상세 정보</h1>
          <compo-tooltip-btn
              TitleProp="닫기"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 dialog-close"
              TooltipPositionProp="bottom"
              @btnClick="detailModal = false"
          ></compo-tooltip-btn>
        </div>
        <div class="pl-quick-layer-body">
          <!-- info -->
          <div class="pl-form-box-list">
            <div class="pl-form-box-list-unit">
              <div class="d-flex flex-column pa-3" style="row-gap: 4px;">
                <div class="d-flex px-4">
                  <span class="col-3 pa-0">예약 일시</span>
                  <strong class="is-txt-blue">{{ selectedRow.NEW_RSVT_DT }}</strong>
                  <span class="pl-round-chip is-sm chat-stat-wait ml-1">
                    {{ selectedRow.DRWI_SE_NM }}
                  </span>
                </div>
                <div class="d-flex px-4">
                  <span class="col-3 pa-0">고객명</span>
                  <strong>{{ selectedRow.CUST_NM }}</strong>
                </div>
                <div class="d-flex px-4">
                  <span class="col-3 pa-0">결제정보</span>
                  <strong>{{ selectedRow.STLM_YN == 'Y' ? '있음' : '없음' }}</strong>
                </div>
              </div>
            </div>
          </div>
          <!-- 상담 배정 정보 -->
          <div class="is-mt-l">
            <h2 class="pl-subtit">상담 배정 정보</h2>
            <ul class="pl-line-list is-border type-left is-mt-m">
              <li class="">
                <span class="keyTitle">배정 일시</span>
                <strong>{{ selectedRow.NEW_ALTMNT_DT }}</strong>
              </li>
              <li>
                <span class="keyTitle">상담사</span>
                <div>
                  <img
                    v-if="selectedRow.USER_NM"
                    :src="selectedRow.USER_ICON ? selectedRow.USER_ICON : require('@/assets/img/@profile_user.png')""
                    :alt="`${ selectedRow.USER_NM  }`"
                    style="width: 35px; height: 35px; border-radius: 50px; vertical-align: middle;"
                    @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}"
                  >
                  <strong class="ml-3">{{ selectedRow.USER_NM }}</strong>
                </div>
                <v-btn 
                  class="pl-btn is-sub is-sm ml-auto"
                  :disabled="selectedRow.USER_NM && !selectedRow.RSVT_RS ? false : true"
                  @click="mixin_showDialog('UserFind');"
                  >
                  상담사 변경
                </v-btn>
              </li>
              <li>
                <span class="keyTitle">상담 결과</span>
                <span :class="`pl-round-chip is-sm ${ mixin_displayStatus(selectedRow.RSVT_RS_CD, `statList`) }`">
                  {{ selectedRow.RSVT_RS_NM }}
                </span>
              </li>
              <li>
                <span class="keyTitle">통화 시작시간</span>
                <strong>{{ selectedRow.NEW_CUTT_BGNG_DT }}</strong>
              </li>
              <li>
                <span class="keyTitle">통화 종료시간</span>
                <strong>{{ selectedRow.NEW_CUTT_END_DT }}</strong>
              </li>
              <li>
                <span class="keyTitle">통화시간</span>
                <strong>{{ selectedRow.PHN_HR }}</strong>
              </li>
            </ul>
          </div>
          <!-- 녹취 내용 -->
          <div class="is-mt-l">
            <h2 class="pl-subtit">녹취 내용</h2>
            <div class="is-mt-m">
              <compo-audio
                :audioProp="REC_TEMP_DATA"
                AudioType="playOnlyNoTtl"
              />
            </div>
          </div>
          <!-- 상담 내용 -->
          <div class="is-mt-l">
            <h2 class="pl-subtit">상담 내용</h2>
            <v-textarea
              class="pl-form is-noresize is-mt-m"
              :spellcheck="false"
              disabled
            />
          </div>
        </div>
      </div>
    </v-slide-x-reverse-transition>
    <!-- //상담직원 찾기 모달 -->
    <v-dialog
      v-model="dialogUserFind"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="사용자 찾기"
        @hide="mixin_hideDialog('UserFind')"
      >
        <template slot="body">
          <!-- component -->
          <compo-find-cus
            SearchTitleProp="사용자 찾기"
            :SearchDataProp="DropUser"
            :SearchInputProp.sync="searchUsername"
            :DataHeaderProp="HeadersFindCus"
            :DataBodyProp="ItemsFindCus"
            :FindData="SRCH_USER"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('UserFind')">닫기</v-btn>
          <v-btn class="pl-btn" @click="setCuslAltmnt('UserFind')">변경</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
   name:"MENU_CSL_M0308", //name은 'MENU_' + 파일명 조합

components: {
},
data() {
  return {
    //공통코드 설정
    list_common_code : [],
    common_code : [],

    dialogUserFind: false, //사용자 검색 모달
    HeadersFindCus: [],
    ItemsFindCus:[],
    SRCH_USER:[], //상담사 정보

    DropUser: {},
    searchUsername: '',   //사용자 이름 검색
    
    SCH_KEY : 'CUST_NM', // 검색 구분
    SCH_KEYWORD : '', //검색어

    // top search
    startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    dropProd: '',
    dropProdItems: [
      '전체',
      '에어컨',
      '냉난방기',
      '전문가전',
      '시스템에어컨',
      '보일러',
      '냉동공조시스템',
    ],
    dropName: '',
    dropNameItems: [
      '고객 이름',
      'AS기사 이름',
      '상담직원 이름',
    ],
    dropProgress: '',
    dropProgressItems: [
      '전체',
      '배정',
      '완료',
      '취소',
    ],

    // grid
    page: 1,
    pageCount: 0,
    perPage: [15,30,50,100],
    ROW_PER_PAGE: 15,
    pagination: {
      page: 1,
      rowsPerPage: 500,
      sortBy: "REG_DT",
      descending: "DESC"
    }, //그리드 페이지속성정의
    nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
    headers: [
      { text: '번호', value: 'index', align: 'center', width: '60px', sortable : false },
      { text: '예약일시', value: 'NEW_RSVT_DT', align: 'left', width: '150px', sortable : true },
      { text: '고객명', value: 'CUST_NM', align: 'left', width: '100px', sortable : false },
      { text: '고객 전화번호', value: 'CUST_PHN_NO', align: 'left', width: '120px', sortable : false },
      { text: '분석 형태', value: 'DRWI_SE_NM', align: 'left', width: '100px', sortable : false },
      { text: '결제정보', value: 'STLM_YN', align: 'left', width: '100px', sortable : false },
      { text: '배정자', value: 'ALTMNT_NM', align: 'left', width: '100px', sortable : false },
      { text: '배정일시', value: 'NEW_ALTMNT_DT', align: 'left', width: '150px', sortable : false },
      { text: '상담사', value: 'USER_NM', align: 'left', width: '140px', sortable : false },
      { text: '지점', value: 'BRANCH_NM', align: 'left', width: '140px', sortable : false },
      { text: '처리결과', value: 'RSVT_RS', align: 'left', width: '100px', sortable : false },
      { text: '통화 시작시간', value: 'NEW_CUTT_BGNG_DT', align: 'left', width: '150px', sortable : false },
      { text: '통화 종료시간', value: 'NEW_CUTT_END_DT', align: 'left', width: '150px', sortable : false },
      { text: '통화 시간', value: 'PHN_HR', align: 'left', width: '90px', sortable : false },
    ],
    items: [
      {
        index: 1,
        type01: '2024-05-21 10:20',
        type02: '김창렬',
        type03: '010-5303-4545',
        type04: '건강고민',
        type05: '시스템',
        type06: '나준영',
        type07: '2024-05-21 11:25',
        type08: '박승주',
        type08_img: require('@/assets/img/@profile_user.png'),
        type09: '협력사',
        type010: '메디콕',
        type011: '상담대기',
        type012: true,
        type013: '2024-05-21',
        type014: '2024-05-21',
        type015: '00:00:00',
      },

    ],
    selectedRow:{},
    statList: [
      { name: '상담대기', code:'WAIT', value: 'chat-stat-cs' },
      { name: '상담완료', code:'CMPL', value: 'chat-stat-done' },
      { name: '예약취소', code:'CANCEL', value: 'chat-stat-wait' },
      { name: '예약파기', code:'DESTRUCT', value: 'chat-stat-after' },
      { name: '상담거부', code:'REJECT', value: 'chat-stat-error' },
    ],

    // detail Modal
    detailModal: false,
    //녹취 파일
    REC_TEMP_DATA: {
      "CUST_ID":"1132",
      "REC_FILE_NM":"20240119/1002-20240119-161248-IB-01047123585-1705648368.2626",
    },

  }
},

  watch: {
  },

  computed: {

  },

  beforeDestroy(){
  },

  async created() {
    //공통코드설정
    let codeName = ['RSVT_RS','CUTT_HIST_SRCH'];
    this.list_common_code = await this.mixin_common_code_get_all(codeName);

    this.getRsvtList();
  },

  mounted() {

  },

  methods: {
    rowClick(data){
      this.selectedRow = data
      this.REC_TEMP_DATA = {
        CUST_ID:data.CUST_ID,
        REC_FILE_NM: data.REC_FILE_NM
      }
    },

    selectDetail(data){
      this.detailModal = true;
    },

    async getRsvtList(next){
      this.selectedRow = {};
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let convertSchKeyword = this.SCH_KEYWORD;
      if(this.SCH_KEY === 'CUST_PHN_NO') convertSchKeyword = convertSchKeyword.replace(/[^0-9]/g, '');

      let sUrl = '/api/rsvt/getRsvtList';
      let postParam = {
        RSVT_RS: this.dropProgress
        , SCH_ST_DT : this.startDate.replace(/-/gi, '')
        , SCH_END_DT : this.endDate.replace(/-/gi, '')
        , SCH_KEY : this.SCH_KEY
        , SCH_KEYWORD : convertSchKeyword
      }

      let headParam = {
        head : {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : "Y",
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        console.log("response.DATA",response.DATA);
        //데이터 가공 영역
        response.DATA.forEach((data, idx) => {
          data.NEW_CUTT_BGNG_DT = this.mixin_convertDate(data.CUTT_BGNG_DT, 'yyyy-MM-dd HH:mm:ss');
          data.NEW_CUTT_END_DT = this.mixin_convertDate(data.CUTT_END_DT, 'yyyy-MM-dd HH:mm:ss');
          data.PHN_HR = (data.PHN_HR?this.mixin_seconds_toHHMMSS(data.PHN_HR):'');
          data.CUST_PHN_NO = this.mixin_setPhoneNo(data.CUST_PHN_NO.replace(/[^0-9]/g, ""));
          data.NEW_RSVT_DT = this.mixin_convertDate(data.RSVT_DT, 'yyyy-MM-dd HH:mm:ss');
          data.NEW_ALTMNT_DT = this.mixin_convertDate(data.ALTMNT_DT, 'yyyy-MM-dd HH:mm:ss');
        });

        let tempDataText = response.DATA;
        let idx = this.items.length + 1;
        for(let i in tempDataText){
          tempDataText[i]["index"]= idx++;
        }

        this.items = [...this.items, ...tempDataText]
        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        this.pagination.page += 1;
      }
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item.RSVT_ID === this.selectedRow.RSVT_ID ? "active" : "";
      return activeClass;
    },

    //배정상담사 변경
    async setCuslAltmnt(){
      this.mixin_hideDialog('UserFind')
      let sUrl = '/api/rsvt/setCuslAltmnt';
      let postParam = {
        RSVT_ID: this.selectedRow.RSVT_ID,
        CUSL_ID: this.SRCH_USER.USER_ID
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        let selected = this.selectedRow;
        this.getRsvtList();
        this.selectedRow = selected;
        this.selectedRow.USER_ID = this.SRCH_USER.USER_ID;
        this.selectedRow.USER_NM = this.SRCH_USER.USER_NM;
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>