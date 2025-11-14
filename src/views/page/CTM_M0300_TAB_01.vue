<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          조회 기간
        </span>
        <div class="pl-desc">
          <compo-date-range-picker
            :StartDayProp.sync="SCH_ST_DTS"
            :EndDayProp.sync="SCH_END_DTS"
            styleProp="flex: 0 0 110px"
            ParentStyleProp="width: 260px"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          민원구분
        </span>
        <div class="pl-desc">
          <v-select
            v-model="SCH_CVLCPT_SE_CD"
            class="pl-form is-sm type-middle"
            :items="DROP_VOC_DV"
            placeholder="전체"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          민원분류
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle is-sm"
            v-model="CVLCPT_CLSF_ID1"
            :items="DROP_CVLCPT_CLS1"
            @change="changeCvlcpltCls('1')"
            placeholder="선택"
          />
          <v-select
            class="pl-form type-middle is-sm"
            v-model="CVLCPT_CLSF_ID2"
            :items="DROP_CVLCPT_CLS2"
            @change="changeCvlcpltCls('2')"
            placeholder="선택"
          />
          <v-select
            class="pl-form type-middle is-sm"
            v-model="CVLCPT_CLSF_ID3"
            :items="DROP_CVLCPT_CLS3"
            placeholder="선택"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          진행상태
        </span>
        <div class="pl-desc">
          <v-select
            v-model="SCH_PRGRS_STTS_CD"
            class="pl-form is-sm type-middle"
            :items="PRGRS_STTS_LIST"
            placeholder="전체"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          센터
        </span>
        <div class="pl-desc">
          <v-select
            v-model="SCH_CUSTCO_ID"
            class="pl-form type-middle is-sm"
            :items="DROP_CENTER_LIST"
            placeholder="전체"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          연락처
        </span>
        <div class="pl-desc">
          <v-text-field
            v-model="SCH_CUST_PHN_NO"
            class="pl-form is-sm type-middle"
            style="width: 70px;"
            @keyup.enter="selectCvlcptList('')"
          ></v-text-field>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          상담사
        </span>
        <div class="pl-desc">
          <v-text-field
            v-model="SCH_CUSL_NM"
            class="pl-form is-sm type-middle"
            style="width: 70px;"
            @keyup.enter="selectCvlcptList('')"
          ></v-text-field>
        </div>
      </div>
      <div>
        <v-btn
          class="pl-btn is-icon"
          @click="selectCvlcptList('')"
          >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="clickResetBtn"
        ></compo-tooltip-btn>
      </div>

    </div>
    <!-- <div class="pl-card-body py-3">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            조회 기간
          </span>
          <div class="pl-desc">
            <compo-date-range-picker
              :StartDayProp.sync="SCH_ST_DTS"
              :EndDayProp.sync="SCH_END_DTS"
              @startDayChange="mixin_testLog(SCH_ST_DTS)"
              @endDayChange="mixin_testLog(SCH_END_DTS)"
              ParentStyleProp="width: 306px"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            센터
          </span>
          <div class="pl-desc">
            <v-select
              v-model="SCH_CUSTCO_ID"
              class="pl-form type-middle"
              :items="DROP_CENTER_LIST"
              placeholder="전체"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            고객 연락처
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="SCH_CUST_PHN_NO"
              class="pl-form is-sm type-middle"
            ></v-text-field>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            상담사
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="SCH_CUSL_NM"
              class="pl-form is-sm type-middle"
            ></v-text-field>
          </div>
        </div>
      </div>
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            민원구분
          </span>
          <div class="pl-desc">
            <v-select
              v-model="SCH_CVLCPT_SE_CD"
              class="pl-form is-sm type-middle"
              :items="mixin_common_code_get(list_common_code, 'VOC_DV', '전체')"
              placeholder="전체"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            민원분류
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle is-sm"
              v-model="CVLCPT_CLSF_ID1"
              :items="DROP_CVLCPT_CLS1"
              @change="changeCvlcpltCls('1')"
              placeholder="선택"
            />
            <v-select
              class="pl-form type-middle is-sm"
              v-model="CVLCPT_CLSF_ID2"
              :items="DROP_CVLCPT_CLS2"
              @change="changeCvlcpltCls('2')"
              placeholder="선택"
            />
            <v-select
              class="pl-form type-middle"
              v-model="CVLCPT_CLSF_ID3"
              :items="DROP_CVLCPT_CLS3"
              placeholder="선택"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            진행상태
          </span>
          <div class="pl-desc">
            <v-select
              v-model="SCH_PRGRS_STTS_CD"
              class="pl-form is-sm type-middle"
              :items="PRGRS_STTS_LIST"
              placeholder="전체"
            ></v-select>
          </div>
        </div>
        <div>
          <v-btn
            class="pl-btn is-icon"
            @click="selectCvlcptList('')"
            >
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <compo-tooltip-btn
            TitleProp="새로고침"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="clickResetBtn"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div> -->
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <!-- grid top -->
      <div class="pl-grid-top pt-2">
        <div class="pl-grid-top-left ">
          <v-btn class="pl-btn is-icon is-trans" @click="showDetail({})">
            <span class="pl-icon20 circle-plus"></span>
            등록
          </v-btn>
          <v-btn class="pl-btn is-icon is-trans" @click="clickDeleteBtn">
            <span class="pl-icon20 trash"></span>
            삭제
          </v-btn>
        </div>
        <div class="pl-grid-top-utils">
          <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ items.length }})</em> 건</span>
          <!-- 엑셀 다운로드 버튼 -->
          <compo-excel
            TypeProp="Download"
            :DataHeaderProp="headers"
            :DataBodyProp="items"
            FileNameProp="대내외 민원 관리대장"
            SheetNameProp="대내외 민원 관리대장"
          />
        </div>
      </div>
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-hover has-control"
        :headers="headers"
        :items="items"
        v-model="checkedItem"
        show-select
        fixed-header
        item-key="RNUM"
        height="calc(-360px + 100vh)"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
        @click:row="rowClick"
        @dblclick:row="rowDblClick"
        :page.sync="page"
        @page-count="pageCount = $event"
        :loading="loading"
        loading-text="조회중입니다."
        >
        <!-- 민원구분 -->
        <template v-slot:item.CVLCPT_SE_NM="{ item }">
          <span :class="item.CVLCPT_SE_CD != 'IVOC' ? 'is-txt-org' : ''">{{ item.CVLCPT_SE_NM }}</span>
        </template>

        <template v-slot:item.PRGRS_STTS_CD_NM="{ item }">
          <span
            :class="`pl-badge is-${mixin_displayStatus(item.PRGRS_STTS_CD_NM, 'STAT_LIST')}`"
            style="width: 40px;"
            >
          {{ item.PRGRS_STTS_CD_NM }}</span>
        </template>
        <template v-slot:item.CVLCPT_CLSF_NM2="{ item }">
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on">
              {{ item.CVLCPT_CLSF_NM2 }}</span>
            </template>
            <span>{{ item.CVLCPT_CLSF_NM2 }}</span>
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
          보기 {{ mixin_getPagePeriod(items, page) }} / {{ items.length }}
          <compo-tooltip-btn
            TitleProp="다음 검색"
            ClassProp="pl-tooltip-btn is-line"
            IconProp="pl-icon20 arrow-next-paging"
            TooltipPositionProp="bottom"
            :DisabledProp = "nextDisabled"
            @btnClick="selectCvlcptList('next')"
          ></compo-tooltip-btn>
        </span>
      </div>
    </div>

    <!-- side panel : 상세 정보-->
  <v-slide-x-reverse-transition>
    <div
      class="pl-quick-layer "
      style="width: 550px"
      :style="tempCenterStyle"
      v-if=" dialogDetail === true ">
      <div class="pl-quick-layer-header"><h1>민원 상세 정보</h1>
        <!-- <compo-tooltip-btn
          TitleProp="윈도우 팝업 열기"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 openPop"
          TooltipPositionProp="bottom"
          @btnClick="clickOpenBtn"
        ></compo-tooltip-btn> -->
        <compo-tooltip-btn
          TitleProp="닫기"
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 dialog-close"
          TooltipPositionProp="bottom"
          @btnClick="dialogDetail = false"
        ></compo-tooltip-btn>
      </div>
      <!-- component -->
      <CTM_M0300_TAB_02_DETAIL refs="CTM_M0300_TAB_02_DETAIL" @Close="dialogDetail = false" :popData="popData" @refresh="selectCvlcptList"/>
    </div>
   </v-slide-x-reverse-transition>

  </div>
</template>

<script>
import CTM_M0300_TAB_02_DETAIL from '@/views/page/CTM_M0300_TAB_02_DETAIL'

export default {
  name: 'CTM_M0300_TAB_01', //대내/외 민원 관리대장
  components: {
    CTM_M0300_TAB_02_DETAIL

  },
  data() {
    return {
      list_common_code : [],
      DROP_CENTER_LIST: [],
      PRGRS_STTS_LIST : [
        {text:'전체', value: ''}
        , {text:'진행중', value: 'P'}
        , {text:'종결', value: 'E'}
      ],

      cvlcptClsList:[],
      DROP_CVLCPT_CLS1:[],
      DROP_CVLCPT_CLS2:[],
      DROP_CVLCPT_CLS3:[],
      DROP_VOC_DV:[],

      // search
      SCH_ST_DTS : this.$moment().format("YYYY-MM-DD"), //접수 시작 일자
      SCH_END_DTS : this.$moment().format("YYYY-MM-DD"), //접수 종료 일자
      SCH_CVLCPT_SE_CD : '', //민원 구분 코드
      SCH_PRGRS_STTS_CD : '', //진행 상태 코드(P:진행중, E:종결)
      SCH_CUST_PHN_NO : '', //고객 연락처
      SCH_CUSL_NM : '', //상담사 명
      SCH_CUSTCO_ID: '', // 접수센터
      CVLCPT_CLSF_ID1: "",
      CVLCPT_CLSF_ID2: "",
      CVLCPT_CLSF_ID3: "",

      // grid
      loading:false,
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 30,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      },
      nextDisabled : false,
      headers: [
        { text: '번호', value: 'RNUM', align: 'center', width: '50px', sortable: true },
        { text: '민원구분', value: 'CVLCPT_SE_NM', align: 'center', width: '95px',sortable: true },
        { text: '접수일', value: 'REG_DT', align: 'center', width: '80px',sortable: true },
        { text: '상담일', value: 'CUTT_DT', align: 'center', width: '80px', sortable: true },
        { text: '센터', value: 'RCPT_CUSTCO_NM', align: 'left', width: '100px', sortable: true },
        { text: '소속', value: 'RCPT_DEPT_NM', align: 'left', width: '100px', sortable: true },
        { text: '상담사', value: 'CUSL_NM', align: 'left', width: '70px', sortable: true },
        { text: '접수경로', value: 'CVLCPT_RCPT_PATH_NM', align: 'left', width: '100px', sortable: true },
        { text: '고객명', value: 'CUST_NM', align: 'center', width: '70px', sortable: true },
        { text: '고객 연락처', value: 'CUST_PHN_NO', align: 'center', width: '110px', sortable: true },
        { text: '민원분류1', value: 'CVLCPT_CLSF_NM0', align: 'left', width: '80px', sortable: true },
        { text: '민원분류2', value: 'CVLCPT_CLSF_NM1', align: 'left', width: '80px', sortable: true },
        { text: '세부유형', value: 'CVLCPT_CLSF_NM2', align: 'left', width: '120px', sortable: true },
        { text: '보상여부', value: 'CPST_YN_NM', align: 'center', width: '70px', sortable: true },
        { text: '블컨 여부', value: 'CAUTION_CUST_YN_NM', align: 'center', width: '75px', sortable: true },
        { text: '진행상태', value: 'PRGRS_STTS_CD_NM', align: 'center', width: '70px', sortable: true },
        { text: '최종 처리일', value: 'LAST_PRCS_DT', align: 'left', width: '90px', sortable: true },
        { text: '최종 처리자', value: 'LAST_PRCR_NM', align: 'left', width: '90px', sortable: true },
      ],

      items: [],
      checkedItem:[],
      gridTotalCnt : 0,

      STAT_LIST: [
        { code: '진행중', value: 'red'},
        { code: '종결', value: 'green'},
      ],
      // slide
      dialogDetail: false,

      popData:{},

    }
  },
  methods: {
    //민원 접수 목록
    async selectCvlcptList(next) {

      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
        this.checkedItem = [];
      }

      let postParam = {
        SCH_ST_DTS : this.SCH_ST_DTS.replace(/[^0-9]/g, '') //접수 시작 일자
        , SCH_END_DTS : this.SCH_END_DTS.replace(/[^0-9]/g, '') //접수 종료 일자
        , CVLCPT_SE_CD : this.SCH_CVLCPT_SE_CD //민원 구분 코드
        , PRGRS_STTS_CD : this.SCH_PRGRS_STTS_CD //진행 상태 코드(P:진행중, E:종결)
        , CUST_PHN_NO : this.SCH_CUST_PHN_NO.replace(/[^0-9]/g, '') //고객 연락처
        , SCH_CUSL_NM : this.SCH_CUSL_NM //상담사 명
        , SCH_CUSTCO_ID: this.SCH_CUSTCO_ID
        , CVLCPT_CLSF_ID1: this.CVLCPT_CLSF_ID1
        , CVLCPT_CLSF_ID2: this.CVLCPT_CLSF_ID2
        , CVLCPT_CLSF_ID3: this.CVLCPT_CLSF_ID3
        , ADMIN_YN: "Y"
      };

      let headParam = {
        head: {
          ROW_CNT : this.pagination.rowsPerPage
          , PAGES_CNT : this.pagination.page
          , PAGING : 'Y'
          , ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper",
        }
      };

      this.loading = true;
      const response = await this.common_postCall("/api/biz/common/select/selectCvlcptList", postParam, headParam);

      if(response && !response.HEADER.ERROR_FLAG) {
        let tempDataText = response.DATA.map(row=>{
          row.CPST_YN_NM = row.CPST_YN == "Y" ? "있음" : "-";
          row.CAUTION_CUST_YN_NM = row.CAUTION_CUST_YN == "Y" ? "있음" : "-";
          row.PRGRS_STTS_CD_NM = row.PRGRS_STTS_CD == "E" ? "종결" : "진행중";
          row.CUST_PHN_NO = this.mixin_setPhoneNo(row.CUST_PHN_NO);
          let cvlcptClsf = row.CVLCPT_CLSF_FULL_PATH.split(">");
          if(cvlcptClsf.length > 0){
            for(let i in cvlcptClsf){
              row["CVLCPT_CLSF_NM" + i] = cvlcptClsf[i];
            }
          }
          return row;
        });
        this.items = [...this.items, ...tempDataText];

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }
        if(this.items.length > 0) this.gridTotalCnt = response.HEADER.TOT_COUNT;

        this.pagination.page += 1;
      }

      this.loading = false;
    },

    // 삭제
    clickDeleteBtn(){
      if(this.checkedItem.length <= 0){
        this.showAlertInfo({msg:"삭제할 민원을 선택해주세요."});
        return false;
      }

      for(let i=0; i<this.checkedItem.length;i++){
        if(this.checkedItem[i].PRGRS_STTS_CD == "E"){
          this.showAlertInfo({msg:"종결된 민원은 삭제할 수 업습니다."});
          return false;
        }
      }

      this.showConfirmCaution({
        msg:'선택한 민원은 영구 삭제됩니다. \n정말 삭제하시겠습니까?'
        , callYes: () => {
          this.deleteCvlcptData();
          this.closeAlert();
        }
        , callNo: this.closeAlert
      });
    },

    async deleteCvlcptData(){
      let sUrl = '/phone-api/cvlcpt/deleteCvlcptData';
      // let sUrl = '/api/biz/common/delete/deleteCvlcptData';

      let postParam = {
        LIST: this.checkedItem.map(row=>{return row.CVLCPT_RCPT_MNG_ID}).join(",")
      };

      let headParam = { head: {} };

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.showToastSuccess({msg:"삭제되었습니다."});
        this.selectCvlcptList();
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    async selectCvlcptClsfList(){
      this.cvlcptClsList = [];

      // let sUrl = '/phone-api/cvlcpt/selectCvlcptClsfList';
      let sUrl = '/api/biz/common/select/selectCvlcptClsfList';

      let postParam = {};
      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper",
          sn: "selectCvlcptClsfList"
        }
      };

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.cvlcptClsList = response.DATA.map(row=>{
          row.text = row.CVLCPT_CLSF_NM;
          row.value = row.CVLCPT_CLSF_ID;
          return row;
        });
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },

    // 민원분류 변경
    changeCvlcpltCls(type){
      if(type == "1"){
        this.CVLCPT_CLSF_ID2 = "";
        this.CVLCPT_CLSF_ID3 = "";
        this.DROP_CVLCPT_CLS2 = this.CVLCPT_CLSF_ID1 != "" ? [...[{text:"선택", value:""}], ...this.cvlcptClsList.filter(row=>{return row.UP_CVLCPT_CLSF_ID == this.CVLCPT_CLSF_ID1})] : [{text:"선택", value:""}];
        this.DROP_CVLCPT_CLS3 = [{text:"선택", value:""}];
      }else if(type == "2"){
        this.CVLCPT_CLSF_ID3 = "";
        this.DROP_CVLCPT_CLS3 = this.CVLCPT_CLSF_ID2 != "" ? [...[{text:"선택", value:""}], ...this.cvlcptClsList.filter(row=>{return row.UP_CVLCPT_CLSF_ID == this.CVLCPT_CLSF_ID2})] : [{text:"선택", value:""}];
      }else{
        this.CVLCPT_CLSF_ID1 = "";
        this.CVLCPT_CLSF_ID2 = "";
        this.CVLCPT_CLSF_ID3 = "";
        this.DROP_CVLCPT_CLS1 = [...[{text:"선택", value:""}], ...this.cvlcptClsList.filter(row=>{return row.UP_CVLCPT_CLSF_ID == ""})];
        this.DROP_CVLCPT_CLS2 = [{text:"선택", value:""}];
        this.DROP_CVLCPT_CLS3 = [{text:"선택", value:""}];
      }
    },

    // 민원 윈도우 팝업
    clickOpenBtn(){
      this.popData.isWindow = true;
      this.mixin_openWindow( 'LayoutPopup', '550', '900', {compo_name : 'CTM_M0300_TAB_02_DETAIL', callback : 'outCall', title: '민원 상세 정보', popData:this.popData});
      this.dialogDetail = false;
    },

    rowClick(item) {
      this.selectedRow = item;
    },

    rowDblClick(e, {item}){
      this.showDetail(item);
    },

    // 민원 상세정보 윈도우 오픈 시 걸기 이벤트
    outCall(item){
      this.$eventBus.$emit('topOutCall', {CUST_PHN_NO:item.popData.CUST_PHN_NO, CVLCPT_RCPT_MNG_ID:item.popData.CVLCPT_RCPT_MNG_ID});
    },

    clickResetBtn(){
      this.SCH_ST_DTS = this.$moment().format("YYYY-MM-DD");
      this.SCH_END_DTS = this.$moment().format("YYYY-MM-DD");
      this.SCH_CVLCPT_SE_CD = "";
      this.SCH_PRGRS_STTS_CD = "";
      this.SCH_CUST_PHN_NO = "";
      this.SCH_CUSL_NM = "";
    },

    showDetail(item){
      this.dialogDetail = false;
      this.$eventBus.$emit('clearVSlideXreverse');

      this.$nextTick(() => {
        this.popData = item;
        this.popData.isWindow = false;
        this.dialogDetail = true;
      });
    },
  },
  async mounted() {
    //공통코드설정
    let codeName = ['VOC_DV']; //민원 구분
    this.list_common_code = await this.mixin_common_code_get_all(codeName);
    this.DROP_CENTER_LIST = await this.mixin_getCenterCombo("전체");

    let vocDv = this.mixin_common_code_get(this.list_common_code, 'VOC_DV', '전체');
    this.DROP_VOC_DV = vocDv.filter(row=>{ return row.value != 'CALLVOC'});

    this.selectCvlcptList(''); //민원 접수 목록
    await this.selectCvlcptClsfList();
    this.changeCvlcpltCls();
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>