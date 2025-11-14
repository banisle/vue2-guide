<template>
  <div class="pl-container">
   <div class="pl-card-wrap">
    <!-- sub top -->
    <compo-sub-layout-top  >
      <template slot="search">
        <div class="pl-form-inline-wrap">
          <div class="pl-form-inline">
            <span class="pl-label">
              발송일
            </span>
            <div class="pl-desc">
              <compo-date-range-picker
                :StartDayProp.sync="START_DT"
                :EndDayProp.sync="END_DT"
                ParentStyleProp="width: 306px"
              />
            </div>
          </div>

          <div class="pl-form-inline">
            <span class="pl-label">
              수신번호
            </span>
            <div class="pl-desc">
              <v-text-field
                v-model="PHONE_NUM"
                class="pl-form type-middle"
                placeholder="전화번호 입력" />
            </div>
          </div>
          <div>
            <v-btn
              class="pl-btn is-icon"
              @click="getHistSendAtalkList"
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
       <!-- grid top -->
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left spacing-wrap sp-16 ">
          <strong class="pl-bullet-txt is-blue">카카오 알림톡 발송 목록</strong>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ totalCount }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-tooltip-btn
            TitleProp="엑셀 다운로드"
            ClassProp="pl-tooltip-btn "
            IconProp="pl-icon20 exceldown"
            TooltipPositionProp="bottom"
            @btnClick="excelDown"
          ></compo-tooltip-btn>
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-hover"
        :headers="headers"
        :items="HIST_SEND_ATALK"
        fixed-header
        item-key="ROW_NUMBER"
        height="calc(-306px + 100vh)"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
        :item-class="isActiveRow"
        @click:row="rowClick"
        @dblclick:row="showDetail()"
        :loading="isLoading"
        loading-text="조회중입니다."
        :page.sync="page"
        @page-count="pageCount = $event">

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
          보기 {{ mixin_getPagePeriod(HIST_SEND_ATALK, page) }} / {{ totalCount }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            :DisabledProp = "nextDisabled"
            @btnClick="getHistSendAtalkList('next')"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>

   </div>
   <!-- side panel : 상세 정보-->
   <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer "
        style="width: 550px"
        :style="tempCenterStyle"
        v-if=" dialogSmsDetail === true ">
        <div class="pl-quick-layer-header"><h1>알림톡 발송 상세 정보</h1>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogSmsDetail = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
        <CompoSmsLog
          :DataProp="SEL_ROW"
          SmsTypeProp="ATALK"
          :PagingProp="false"
          @Close="closeSlide" />
      </div>
    </v-slide-x-reverse-transition>
 </div>
</template>

<script>
import CompoSmsLog from '@/components/CompoSmsLog.vue'

export default {
  name: "MENU_CSL_M0602", //알림톡 발송 이력
  components: {
    CompoSmsLog
  },
  data() {
    return {
      // search
      START_DT: (new Date(Date.now() - (7 * 24 * 60 * 60 * 1000) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      END_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dropDetail: false,

      PHONE_NUM: '',

      HIST_SEND_ATALK: [],

      SEL_ROW: {},

      // grid
      isLoading: false,

      totalCount: 0,
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30, //페이징 없이 전체 화면 뿌릴때
      pagination: {
        page: 1,
        rowsPerPage: 500,
      },
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '전화번호', value: 'RECEIVER', align: 'left', width: '135px', sortable: false },
        { text: '성공유무', value: 'RSLT_NM', align: 'left', width: '12%', sortable: false },
        { text: '제목', value: 'SUBJECT', align: 'left', width: '20%', sortable: false },
        { text: '내용', value: 'MSG', align: 'left', width: '', sortable: false },
        { text: '발송 시스템', value: 'REQ_DEPT_NM', align: 'left', width: '10%', sortable: false },
        { text: '발송일자', value: 'RG_DATE', align: 'left', width: '15%', sortable: true },
      ],
      items: [
        { index: 301, type01: '101-1004-1004', type02: '성공', type03: '담당 배정 알림', type04: '★ 고객님께서 접수하신 보수 건이 희망건설㈜ 보수 담당자에게 접수', type05: '콜센터', type06: '2024-06-20 09:30:45', },
        { index: 302, type01: '101-1004-1004', type02: '성공', type03: 'AS 진행정보 조회안내', type04: '★ 고객님께서 접수하신 보수 건이 희망건설㈜ 보수 담당자에게 접수', type05: '콜센터', type06: '2024-06-20 09:30:45', },
        { index: 303, type01: '101-1004-1004', type02: '성공', type03: '담당 배정 알림', type04: '★ 고객님께서 접수하신 보수 건이 희망건설㈜ 보수 담당자에게 접수', type05: '콜센터', type06: '2024-06-20 09:30:45', },
        { index: 304, type01: '101-1004-1004', type02: '성공', type03: 'AS 진행정보 조회안내', type04: '★ 고객님께서 접수하신 보수 건이 희망건설㈜ 보수 담당자에게 접수', type05: '콜센터', type06: '2024-06-20 09:30:45', },
        { index: 305, type01: '101-1004-1004', type02: '성공', type03: '담당 배정 알림', type04: '★ 고객님께서 접수하신 보수 건이 희망건설㈜ 보수 담당자에게 접수', type05: '콜센터', type06: '2024-06-20 09:30:45', },
        { index: 306, type01: '101-1004-1004', type02: '수신번호 형식 오류', type03: '담당 배정 알림', type04: '★ 고객님께서 접수하신 보수 건이 희망건설㈜ 보수 담당자에게 접수', type05: 'COTIS', type06: '2024-06-20 09:30:45', },
      ],

      //dialog
      dialogSmsDetail: false,
      data: {
        PROFILE: {
          name: '한소미',
          img: require('@/assets/img/@manager_profile6.png'),
          part: '마이홈센터 - 마이홈1팀',
          send_date: '2024-06-20 09:30:25',
          send_system: '콜센터',
        },
        SMS_DATA: {
          rcv_phone: '010-1004-1004',
          text: `★ 고객님께서 접수하신 보수 건이 희망건설㈜ 보수담당자에게 배정되었습니다.

▶ 접수번호
  240620-41-00001

▶ 접수내용
  건축 / 현관 / 도어록 / 작동불량

★ 추가 문의사항은 오른쪽 하단 노란색 버튼을 눌러 “카톡상담”을 요청하거나 “바로처리센터 [1670-8572]”로 문의주시면 답변 드리겠습니다.`
        }
      },


      //엑셀 다운로드 관련
      table_head: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '전화번호', value: 'RECEIVER', align: 'left', width: '200px', sortable: false },
        { text: '성공유무', value: 'RSLT_NM', align: 'left', width: '100px', sortable: false },
        { text: '제목', value: 'SUBJECT', align: 'left', width: '200px', sortable: false },
        { text: '내용', value: 'MSG', align: 'left', width: '500px', sortable: false },
        { text: '발송 시스템', value: 'REQ_DEPT_NM', align: 'left', width: '150px', sortable: false },
        { text: '발송일자', value: 'RG_DATE', align: 'left', width: '180px', sortable: true },
      ],
      table_body: [],
      file_name: '',
      sheet_name: "알림톡발송이력",
      header_color: "EFF5FC"



    }
  },
  methods: {
    //로우 클릭시 색상 변경
    isActiveRow(item){
      const activeClass = item === this.SEL_ROW ? "active" : "";
      return activeClass;
    },

    rowClick(item) {
      this.SEL_ROW = item;
    },

    showDetail(){
      this.dialogSmsDetail = true
    },
    closeSlide(){
      this.dialogSmsDetail = false
    },


    //바로처리 상담 이력 조회
    async getHistSendAtalkList(next = '') {
        //다음버튼 클릭 유무
        if (next == 'next'){
        } else {
          this.HIST_SEND_ATALK = [];
          this.pagination.page = 1; //페이징 처리 초기화
          this.nextDisabled = true;  //버튼 비활성화
        }


        let postParam = {
          START_DT: this.START_DT.replace(/-/gi, "") + '000000',
          END_DT: this.END_DT.replace(/-/gi, "") + '235959',
          PHONE_NUM: this.PHONE_NUM.replace(/[^0-9]/g, ''),
          PAGE_CNT: this.pagination.rowsPerPage,
          PAGE: this.pagination.page,
        };
        let headParam = {
          head: {
            ns: "lhcs.phone.as.dao.PhoneAsCommonMapper_Atalk",
          }
        };
        this.isLoading = true;
        let responseCnt = await this.common_postCall("/api/biz/common/external/select/selectHistSendAtalkCnt", postParam, headParam);
        if(responseCnt && !responseCnt.HEADER.ERROR_FLAG) {
          this.totalCount = responseCnt.DATA[0].TOT_COUNT;
        }

        let response = await this.common_postCall("/api/biz/common/external/select/selectHistSendAtalkPaging", postParam, headParam);

        if(response && !response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
            item.RECEIVER = this.mixin_setPhoneNo(item.RECEIVER);
          })
          this.HIST_SEND_ATALK = [...this.HIST_SEND_ATALK, ...response.DATA];

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
        this.isLoading = false;
      },

    // 엑셀형식으로 다운로드 한다 
    async excelDown() {   

      let postParam = {
        START_DT: this.START_DT.replace(/-/gi, "") + '000000',
        END_DT: this.END_DT.replace(/-/gi, "") + '235959',
        PHONE_NUM: this.PHONE_NUM.replace(/[^0-9]/g, ''),
      };
      let headParam = {
        head: {
          ns: "lhcs.phone.as.dao.PhoneAsCommonMapper_Atalk",
        }
      };

      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      const response = await this.common_postCall("/api/biz/common/external/select/selectHistSendAtalkPaging", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
        const table_b = response.DATA;
        this.sheet_name = "알림톡발송이력";//mixin_common_exportExcel_all 에서 초기화 하여 다시 선언.
        const table_h = this.table_head;

        this.file_name = this.sheet_name + "-" + this.$moment(new Date()).format('YYYYMMDDHHmmss');
        const isMulti = false;


        // 헤더에 없는 body filter
        let tempBodyObj = [];
        tempBodyObj = table_b.map(row=>{
          let tempBodyJson = {};
          if(isMulti){
            let headerKey = table_h[table_h.length-1].map(el=> {return el.value});
            for(let i in headerKey){
              tempBodyJson[headerKey[i]] = this.mixin_nvl(row[headerKey[i]], "");
            }
          }else{
          let headerKey = table_h.map(el=> {return el.value});
            for(let i in headerKey){
              tempBodyJson[headerKey[i]] = this.mixin_nvl(row[headerKey[i]], "");
            }
          }
          return tempBodyJson
        });

        this.table_body = tempBodyObj;

        this.mixin_common_exportExcel_all(this.table_head, this.table_body, this.file_name, this.sheet_name, this.header_color);
      }
    },
  },
  mounted() {
  },
  created() {
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>
