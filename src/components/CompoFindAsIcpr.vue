<template>
  <div :class="isPopup ? 'pl-quick-layer-body pb-0' : ''">
    <!-- search form -->
    <div>
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            지역본부
          </span>
          <div class="pl-desc">
            <v-select
              v-model="ARA_HDQ_CD"
              :items="ARA_HDQ_CD_LIST"
              class="pl-form type-middle is-md"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            단지명
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="MGOF_NM"
              disabled
              class="pl-form type-middle"
              style="width: 195px"
              value="파주운정3 A37BL(물향기1)"
              placeholder="단지명 입력"
              @keyup.enter="mixin_showDialog('FindAsMgof')">
              <template v-slot:append>
                <v-btn
                  @click="mixin_showDialog('FindAsMgof')"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 in-search"></span>
                </v-btn>
              </template>
            </v-text-field>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            업체명
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="FRM_NM"
              class="pl-form type-middle is-sm"
              placeholder="업체명 입력"
              @keydown.enter="searchIcprList()"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            담당자 구분
          </span>
          <div class="pl-desc">
            <v-select
              v-model="MNTN_USR_DS_CD"
              :items="MNTN_USR_DS_CD_LIST"
              class="pl-form type-middle is-xs"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            담당자 이름
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="USR_NM"
              class="pl-form type-middle is-xs"
              placeholder="이름 입력"
              @keydown.enter="searchIcprList()"
              />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            담당자 사번
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="USR_ID"
              class="pl-form type-middle is-xs"
              placeholder="이름 입력"
              @keydown.enter="searchIcprList()"
              />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            공종
          </span>
          <div class="pl-desc">
            <v-select
              v-model="MNTN_RPSN_CSTP_CD"
              :items="MNTN_CSTP_CD_LIST"
              class="pl-form type-middle is-xs"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0" 
            @click="searchIcprList()">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="initSrchCondition()"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>
    <!-- temp grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover"
      :headers="headers"
      :items="ICPR_LIST"
      fixed-header
      item-key="ROW_NUMBER"
      height="390px"
      :items-per-page="ROW_PER_PAGE"
      @click:row="rowClick"
      @dblclick:row="rowDblClick"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :loading="isLoading"
      loading-text="조회중입니다."
      :page.sync="page"
      @page-count="pageCount = $event"
      >
      <!-- 단지명 -->
      <template v-slot:item.MNTN_MGOF_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.MNTN_MGOF_NM }}</span>
          </template>
          <span>{{ item.MNTN_MGOF_NM }}</span>
        </v-tooltip>
      </template>
      <!-- 업체명 -->
      <template v-slot:item.FRM_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.FRM_NM }}</span>
          </template>
          <span>{{ item.FRM_NM }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.MBL_NO="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on"
              @click="setTelType('MBL_NO')">
            {{ item.MBL_NO }}</span>
          </template>
          <span>{{ item.MBL_NO }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.SPPB_TLNO="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on"
              @click="setTelType('SPPB_TLNO')">
            {{ item.SPPB_TLNO }}</span>
          </template>
          <span>{{ item.SPPB_TLNO }}</span>
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
        :total-visible="10">
      </v-pagination>

      <!-- 더보기 다음 있을때만 노출 -->
      <span class="pl-pager-period">
        보기 {{ mixin_getPagePeriod(ICPR_LIST, page) }} / {{ totalCount }}
        <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          :DisabledProp = "nextDisabled"
          @btnClick="searchIcprList('next')"
        ></compo-tooltip-btn>
      </span>
    </div>

    <!-- dialog: 단지명 검색 -->
    <v-dialog
      v-if="dialogFindAsMgof"
      v-model="dialogFindAsMgof"
      content-class="dialog-draggable"
      width="800"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="단지명 검색"
        @hide="mixin_hideDialog('FindAsMgof')"
        @submit="submitDialog('FindAsMgof')"
        >
        <template slot="body">
          <CompoFindAsMgof 
            @setItem="setMgof"
            @closeDialog="mixin_hideDialog('FindAsMgof')"
          />
        </template>
      </compo-dialog>
    </v-dialog>


  </div>
</template>

<script>
import CompoFindAsMgof from '@/components/CompoFindAsMgof.vue'
export default {
  name: 'CompoFindAsIcpr', //AS 접수 담당자 검색
  components: {
    CompoFindAsMgof
  },
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //지역본부 목록
      ARA_HDQ_CD_LIST: [],
      //담당자 구분 목록
      MNTN_USR_DS_CD_LIST: [],
      //공종 목록
      MNTN_CSTP_CD_LIST: [],


      // search
      ARA_HDQ_CD: '',
      MGOF_CD: '',
      MGOF_NM: '',
      MNTN_USR_DS_CD: '',
      MNTN_CSTP_CD: '',
      FRM_NM: '',
      USR_NM: '',
      USR_ID: '',
      MNTN_RPSN_CSTP_CD: '',


      dialogFindAsMgof: false,

      ICPR_LIST: [],
      SEL_ROW: {},
      selType: '',

      isLoading: false,

      totalCount: 0,
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      // ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      ROW_PER_PAGE: 15, //페이징 없이 전체 화면 뿌릴때
      pagination: {
        page: 1,
        rowsPerPage: 500,
      },
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '지역본부', value: 'DEP_NM',  width: '140px', sortable: false },
        { text: '담당자 구분', value: 'MNTN_USR_DS_NM',  width: '120px', sortable: false },
        { text: '단지명', value: 'MNTN_MGOF_NM', align: '', width: '200px',sortable: false },
        { text: '공종', value: 'MNTN_RPSN_CSTP_NM', align: '', width: '60px', sortable: false },
        { text: '이름', value: 'USR_NM', align: '', width: '80px' , sortable: false},
        { text: '업체명', value: 'FRM_NM', align: '', width: '160px', sortable: false },
        { text: '지급자재 분류', value: 'PAY_MATR_GRP_NM',  width: '160px', sortable: false },
        { text: '핸드폰', value: 'MBL_NO', align: 'center', width: '120px', sortable: false },
        { text: '현장 전화번호', value: 'SPPB_TLNO', align: 'center', width: '120px', sortable: false },
        { text: '비고', value: 'RMK',  width: '', sortable: false },
      ],
      items: [
        { index: 1, type1: '경기북부지역본부', type2: '지역본부담당자', type3: '파주운정3 A37BL(물향기1)', type4: '건축', type5: '나담당', type6: '', type7: '', type8: '010-1004-1004', type9: '031-1234-4321', type10: '',},
        { index: 2, type1: '경기북부지역본부', type2: '지역본부담당자', type3: '파주운정3 A37BL(물향기1)', type4: '건축', type5: '나담당', type6: '', type7: '', type8: '010-1004-1004', type9: '031-1234-4321', type10: '',},
        { index: 3, type1: '경기북부지역본부', type2: '지역본부담당자', type3: '파주운정3 A37BL(물향기1)', type4: '건축', type5: '나담당', type6: '', type7: '', type8: '010-1004-1004', type9: '031-1234-4321', type10: '',},
        { index: 4, type1: '경기북부지역본부', type2: '지역본부담당자', type3: '파주운정3 A37BL(물향기1)', type4: '건축', type5: '나담당', type6: '', type7: '', type8: '010-1004-1004', type9: '031-1234-4321', type10: '',},
        { index: 5, type1: '경기북부지역본부', type2: '지역본부담당자', type3: '파주운정3 A37BL(물향기1)', type4: '건축', type5: '나담당', type6: '', type7: '', type8: '010-1004-1004', type9: '031-1234-4321', type10: '',},
        { index: 6, type1: '경기북부지역본부', type2: '지역본부담당자', type3: '파주운정3 A37BL(물향기1)', type4: '건축', type5: '나담당', type6: '', type7: '', type8: '010-1004-1004', type9: '031-1234-4321', type10: '',},
        { index: 7, type1: '경기북부지역본부', type2: '지역본부담당자', type3: '파주운정3 A37BL(물향기1)', type4: '건축', type5: '나담당', type6: '', type7: '', type8: '010-1004-1004', type9: '031-1234-4321', type10: '',},
        { index: 8, type1: '경기북부지역본부', type2: '지역본부담당자', type3: '파주운정3 A37BL(물향기1)', type4: '건축', type5: '나담당', type6: '', type7: '', type8: '010-1004-1004', type9: '031-1234-4321', type10: '',},
        { index: 9, type1: '경기북부지역본부', type2: '지역본부담당자', type3: '파주운정3 A37BL(물향기1)', type4: '건축', type5: '나담당', type6: '', type7: '', type8: '010-1004-1004', type9: '031-1234-4321', type10: '',},
        { index: 10, type1: '경기북부지역본부', type2: '지역본부담당자', type3: '파주운정3 A37BL(물향기1)', type4: '건축', type5: '나담당', type6: '㈜미래에이브앰', type7: '', type8: '010-1004-1004', type9: '031-1234-4321', type10: '',},
        { index: 11, type1: '경기북부지역본부', type2: '지역본부담당자', type3: '파주운정3 A37BL(물향기1)', type4: '건축', type5: '나담당', type6: '대성엔지니어링', type7: '', type8: '010-1004-1004', type9: '031-1234-4321', type10: '',},
        { index: 12, type1: '경기북부지역본부', type2: '지역본부담당자', type3: '파주운정3 A37BL(물향기1)', type4: '건축', type5: '나담당', type6: '㈜위브건설', type7: '', type8: '010-1004-1004', type9: '031-1234-4321', type10: '',},
        { index: 13, type1: '경기북부지역본부', type2: '지역본부담당자', type3: '파주운정3 A37BL(물향기1)', type4: '건축', type5: '나담당', type6: '㈜에스엠구조안전진단', type7: '', type8: '010-1004-1004', type9: '031-1234-4321', type10: '',},
      ],
    }
  },
  
  mounted() {
  },
  async created() {
    this.ARA_HDQ_CD = this.DataProp.ARA_HDQ_CD ? this.DataProp.ARA_HDQ_CD : ''; 
    this.MGOF_CD = this.DataProp.MGOF_CD ? this.DataProp.MGOF_CD : '';
    this.MGOF_NM = this.DataProp.MGOF_NM ? this.DataProp.MGOF_NM : '';
    this.MNTN_USR_DS_CD = this.DataProp.MNTN_USR_DS_CD ? this.DataProp.MNTN_USR_DS_CD : ''; 
    this.FRM_NM = this.DataProp.FRM_NM ? this.DataProp.FRM_NM : '';
    //지역본부 목록
    this.mixinAsGetAsAraHdqCdList();
    //담당자 구분 목록
    this.getAsMntnUsrDsCdList();
    //공종 목록 - MNTN_CSTP_CD_LIST에 설정
    this.mixinAsGetAsMntnCstpCdList();

    //담당자 조회
    this.searchIcprList();

  },
  computed: {
  },
  watch: {
  },
  methods: {
    getResponseData (response, strHeadText = '선택') {
      let responseData = [];
      if(!response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
              responseData.push({text: item.CD_NM, value: item.CD})
          });
      }
      
      //전체, 선택 등 값이 있다면 추가.
      if (strHeadText != "" && strHeadText != undefined) {
          responseData.unshift({ text: strHeadText, value: "" });
      }
      return responseData;
    },


    //지역본부 목록 조회
    async getAsAraHdqCdList() {
        const postParam = {
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectCotisAraHdqCdList", postParam, headParam);
        const responseData = this.getResponseData(response);
        return responseData;
    },


    //담당자 구분 목록 조회
    async getAsMntnUsrDsCdList() {
      const responseData = await this.mixinAsGetCommonCode("MNTN_USR_DS_CD")
     
      if(responseData.length > 0) {
        responseData.push({text: '지역본부/공단/일반관리소담당자', value: 'bothcd'})
      }

      this.MNTN_USR_DS_CD_LIST = responseData;
    },


    //공종 코드 목록 조회
    async getAsMntnCstpCdList() {
        const postParam = {
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnCstpCdList", postParam, headParam);
        const responseData = this.getResponseData(response);
        return responseData;
    },


    //담당자 조회
    async searchIcprList(next = '') {
      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.ICPR_LIST = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }
      
      let postParam = {
        ARA_HDQ_CD : this.ARA_HDQ_CD,
        MGOF_CD : this.MGOF_CD,
        MGOF_NM : this.MGOF_NM,
        MNTN_USR_DS_CD : this.MNTN_USR_DS_CD,
        MNTN_CSTP_CD : this.MNTN_CSTP_CD,
        FRM_NM : this.FRM_NM,
        USR_NM : this.USR_NM,
        USR_ID : this.USR_ID,
        MNTN_RPSN_CSTP_CD : this.MNTN_RPSN_CSTP_CD,
      };
      let headParam = {head: {
        "ROW_CNT" : this.pagination.rowsPerPage,
        "PAGES_CNT" : this.pagination.page,
        "PAGING" : "Y",
      }};
      this.isLoading = true;
      const response = await this.common_postCall("/phone-api/as/common/selectCotisIcprList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.ICPR_LIST =  [...this.ICPR_LIST, ...response.DATA];
        this.totalCount = response.HEADER.TOT_COUNT;

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

    //검색 조건 초기화.
    initSrchCondition() {
      this.ARA_HDQ_CD = '';
      this.MGOF_CD = '';
      this.MGOF_NM = '';
      this.MNTN_USR_DS_CD = '';
      this.MNTN_CSTP_CD = '';
      this.FRM_NM = '';
      this.USR_NM = '';
      this.USR_ID = '';
      this.MNTN_RPSN_CSTP_CD = '';
    },

    //핸드폰 클릭 시, 연락처에 핸드폰번호 입력됨
    //현장 전화번호  클릭 시, 연락처에 핸드폰번호 입력됨
    setTelType(selType) {
      this.selType = selType
    },

    rowClick(item) {
      this.SEL_ROW = item;
    },

    //로우 더블클릭
    rowDblClick() {
      this.SEL_ROW.SEL_CALLER_TEL = this.selType == 'SPPB_TLNO' ? this.SEL_ROW.SPPB_TLNO : this.SEL_ROW.MBL_NO;
      this.$emit("setItem", this.SEL_ROW);
      this.$emit("sendDataToParent", this.SEL_ROW);
      this.$eventBus.$emit('closeSearchPopup');
    },

    //단지명 검색 다이얼로그 - 더블클릭으로 선택 시
    setMgof(item) {
      this.ARA_HDQ_CD = item.ARA_HDQ_CD;
      this.MGOF_CD = item.MGOF_CD;
      this.MGOF_NM = item.COTIS_MGOF_NM;

      this.mixin_hideDialog('FindAsMgof')
    },
  },
};
</script>

<style lang="scss" scoped>

</style>