<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top is-mt-m">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            단지명
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="MGOF_NM"
              class="pl-form type-middle is-lg"
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
            공종
          </span>
          <div class="pl-desc">
            <v-select
              v-model="MNTN_RPSN_CSTP_CD"
              :items="MNTN_CSTP_CD_LIST"
              class="pl-form type-middle"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            보증기간
          </span>
          <div class="pl-desc">
            <v-select
              v-model="FLW_ASR_TR"
              :items="FLW_ASR_TR_LIST"
              class="pl-form type-middle"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            업체구분
          </span>
          <div class="pl-desc">
            <v-select
              v-model="MNTN_FRM_DS_CD"
              :items="MNTN_FRM_DS_CD_LIST"
              class="pl-form type-middle"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0" 
            @click="searchAsrInfo">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>
    <!-- grid -->
    <div class="is-mt-s">
      <v-data-table
        class="pl-grid is-hover"
        :headers="headers"
        :items="ASR_INFO_LIST"
        fixed-header
        item-key="ROW_NUMBER"
        height="450px"
        :items-per-page="ROW_PER_PAGE"
        @click:row="rowClick"
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다."
        :loading="isLoading"
        loading-text="조회중입니다."
        >
        <!-- 단지 명 -->
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
        <!-- 보증내용 -->
        <template v-slot:item.FLW_ASR_CTS="{ item }">
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on">
              {{ item.FLW_ASR_CTS }}</span>
            </template>
            <span>{{ item.FLW_ASR_CTS }}</span>
          </v-tooltip>
        </template>
        <!-- 비고 -->
        <template v-slot:item.FLW_ASR_RMK="{ item }">
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on">
              {{ item.FLW_ASR_RMK }}</span>
            </template>
            <span>{{ item.FLW_ASR_RMK }}</span>
          </v-tooltip>
        </template>

      </v-data-table>
    </div>

    <!-- 보증 상세 정보 -->
    <div class="pl-header is-no-boredr is-mt-l">
      <v-icon class="pl-icon20 square-title" style="margin-top: 2px;"></v-icon>
      <div class="pl-subtit ml-1">보증 상세 정보</div>
    </div>
    <div class="is-mt-s">
      <table class="pl-tbl-detail">
        <colgroup>
          <col width="127px" />
          <col width="" />
          <col width="127px" />
          <col width="" />
          <col width="127px" />
          <col width="" />
          <col width="127px" />
          <col width="" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">
              <span class="pl-label">
                지역본부
              </span>
            </th>
            <td >
              <span class="pl-value-txt">{{ ASR_INFO_DETAIL.ARA_HDQ_NM }}</span>
            </td>
            <th scope="row">
              <span class="pl-label">
                보증 시작일
              </span>
            </th>
            <td >
              <span class="pl-value-txt">{{ ASR_INFO_DETAIL.FLW_ASR_ST_DT }}</span>
            </td>
            <th scope="row">
              <span class="pl-label">
                보증사
              </span>
            </th>
            <td >
              <span class="pl-value-txt">{{ ASR_INFO_DETAIL.FLW_ASR_INS_CO_NM }}</span>
            </td>
            <th scope="row">
              <span class="pl-label">
                보증기간
              </span>
            </th>
            <td >
              <span class="pl-value-txt">{{ ASR_INFO_DETAIL.FLW_ASR_TR }}</span>
            </td>
          </tr>
          <tr>
            <th scope="row">
              <span class="pl-label">
                단지명
              </span>
            </th>
            <td >
              <span class="pl-value-txt">{{ ASR_INFO_DETAIL.MGOF_NM }}</span>
            </td>
            <th scope="row">
              <span class="pl-label">
                보증 종료일
              </span>
            </th>
            <td >
              <span class="pl-value-txt">{{ ASR_INFO_DETAIL.FLW_ASR_ED_DT }}</span>
            </td>
            <th scope="row">
              <span class="pl-label">
                보증지점
              </span>
            </th>
            <td >
              <span class="pl-value-txt">{{ ASR_INFO_DETAIL.FLW_ASR_INS_CO_BRH }}</span>
            </td>
            <th scope="row">
              <span class="pl-label">
                업체구분
              </span>
            </th>
            <td >
              <span class="pl-value-txt">{{ ASR_INFO_DETAIL.MNTN_FRM_DS_NM }}</span>
            </td>
          </tr>
          <tr>
            <th scope="row">
              <span class="pl-label">
                공종
              </span>
            </th>
            <td >
              <span class="pl-value-txt">{{ ASR_INFO_DETAIL.MNTN_RPSN_CSTP_NM }}</span>
            </td>
            <th scope="row">
              <span class="pl-label">
                보증 해제일
              </span>
            </th>
            <td >
              <span class="pl-value-txt">{{ ASR_INFO_DETAIL.FLW_ASR_RLS_DT }}</span>
            </td>
            <th scope="row">
              <span class="pl-label">
                증권번호
              </span>
            </th>
            <td >
              <span class="pl-value-txt">{{ ASR_INFO_DETAIL.FLW_ASR_COS_NO }}</span>
            </td>
            <th scope="row">
              <span class="pl-label">
                업체
              </span>
            </th>
            <td >
              <span class="pl-value-txt">{{ ASR_INFO_DETAIL.FRM_NM }}</span>
            </td>
          </tr>
          <tr>
            <th scope="row"><span class="pl-label">AS 보증 내용</span></th>
            <td colspan="3">
              <span class="pl-value-txt">{{ ASR_INFO_DETAIL.FLW_ASR_CTS }}</span>
            </td>
            <th scope="row"><span class="pl-label">비고</span></th>
            <td colspan="3">{{ ASR_INFO_DETAIL.FLW_ASR_RMK }}</td>
          </tr>

        </tbody>
      </table>
    </div>

    <!-- dialog: 단지명 검색 -->
    <v-dialog
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
            @closeDialog="mixin_hideDialog('FindAsMgof')"/>
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
import CompoFindAsMgof from '@/components/CompoFindAsMgof.vue'
export default {
  name: 'CompoAsMgofInfo_TAB04', //보증정보
  components: {
    CompoFindAsMgof
  },
  props: {
    TabProp: {
      type: Number,
      default: null,
    },
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      dialogFindAsMgof: false,

      ARA_HDQ_CD: '',
      MGOF_CD: '',
      MGOF_NM: '',
      MNTN_RPSN_CSTP_CD: '', //공종 코드
      MNTN_CSTP_CD_LIST: [],  //공종 목록
      MNTN_FRM_DS_CD: '', //업체 구분 코드
      MNTN_FRM_DS_CD_LIST: [],  //업체 구분 목록
      FLW_ASR_TR: '',
      //보증 기간 목록
      FLW_ASR_TR_LIST: [
        { text: "선택", value: "" },
        { text: "1년", value: "1" },
        { text: "2년", value: "2" },
        { text: "3년", value: "3" },
        { text: "4년", value: "4" },
        { text: "5년", value: "5" },
        { text: "10년", value: "10" },
      ],

      ASR_INFO_DETAIL: {},  //클릭 시 하단 상세

      ASR_INFO_LIST: [],  //하자보증정보 목록
      SEL_ROW: {},
      isLoading: false,
      ROW_PER_PAGE: -1,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false, },
        { text: '단지명', value: 'MGOF_NM', align: '', width: '10%', sortable: false, },
        { text: '공종', value: 'MNTN_RPSN_CSTP_NM', align: 'center', width: '5%', sortable: false, },
        { text: '업체구분', value: 'MNTN_FRM_DS_NM', align: '', width: '8%', sortable: false, },
        { text: '업체', value: 'FRM_NM', align: '', width: '20%', sortable: false, },
        { text: '보증기간', value: 'FLW_ASR_TR', align: 'center', width: '5%', sortable: false, },
        { text: '보증시작일', value: 'FLW_ASR_ST_DT', align: 'center', width: '8%', sortable: false, },
        { text: '보증 종료일', value: 'FLW_ASR_ED_DT', align: 'center', width: '8%', sortable: false, },
        { text: '보증 해제일', value: 'FLW_ASR_RLS_DT', align: 'center', width: '8%', sortable: false, },
        { text: '보증내용', value: 'FLW_ASR_CTS', align: '', width: '20%', sortable: false, },
        { text: '비고', value: 'FLW_ASR_RMK', align: '', width: '8%', sortable: false, },
      ],
      items: [
        {
          index: 60,
          type01: '파주운정3 A37BL(물향기1)',
          type02: '건축',
          type03: '지급자재업체',
          type04: '주식회사 온리정보통신',
          type05: 3,
          type06: '2023-04-25',
          type07: '2026-04-24',
          type08: '2026-04-24',
          type09: '입주지정기간 말일의 다음날부터 가산하여 적용',
          type10: '업체부도 확인, 하자 예수금 설정예정',
        },
        { index: 61, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '업체부도 확인, 하자 예수금 설정예정', },
        { index: 62, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 63, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 64, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 65, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 66, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 67, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 68, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 69, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 70, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 71, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 72, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 73, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 74, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 75, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 76, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '', },
        { index: 77, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '지급자재업체', type04: '주식회사 온리정보통신', type05: 3, type06: '2023-04-25', type07: '2026-04-24', type08: '2026-04-24', type09: '입주지정기간 말일의 다음날부터 가산하여 적용', type10: '업체부도 확인, 하자 예수금 설정예정', },
        { index: 78, type01: '파주운정3 A37BL(물향기1)', type02: '건축', type03: '수급업체', type04: '(주)모동건설', type05: 5, type06: '2023-04-25', type07: '2026-04-24', type08: '', type09: '주장(도배, 장판, 부대시설 마루)', type10: '', },
      ],

    }
  },
  mounted() {
  },
  async created() {
    this.ARA_HDQ_CD = this.DataProp && this.DataProp.ARA_HDQ_CD ? this.DataProp.ARA_HDQ_CD : '';  //단지코드
    this.MGOF_CD = this.DataProp && this.DataProp.MGOF_CD ? this.DataProp.MGOF_CD : '';  //단지코드
    this.MGOF_NM = this.DataProp && this.DataProp.MGOF_NM ? this.DataProp.MGOF_NM : '';  //단지명
    //공종 목록
    this.MNTN_CSTP_CD_LIST = await this.getAsMntnCstpCdList();
    //업체 구분 목록
    this.MNTN_FRM_DS_CD_LIST = await this.getAsMntnFrmDsCdList();

    if(this.MGOF_CD != '') {
      this.searchAsrInfo();
    }
    

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
    
    //공종 코드 목록 조회
    async getAsMntnCstpCdList() {
        const postParam = {
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnCstpCdList", postParam, headParam);
        return this.getResponseData(response);
    },

    //업체 구분 목록 조회
    async getAsMntnFrmDsCdList() {
      const postParam = {
            GRP_CD: 'MNTN_FRM_DS_CD',
            USE_YN: "Y",
        };
        const headParam = {head: {}};
        const response = await this.common_postCall("/phone-api/as/common/selectCotisCmnCdList", postParam, headParam);
        return this.getResponseData(response);
    },


    //하자보증정보 목록 조회
    async searchAsrInfo() {
      const postParam = {
        ARA_HDQ_CD: this.ARA_HDQ_CD,
	   		MGOF_CD : this.MGOF_CD,
	   		MNTN_RPSN_CSTP_CD : this.MNTN_RPSN_CSTP_CD,
	   		MNTN_FRM_DS_CD : this.MNTN_FRM_DS_CD,
	   		FLW_ASR_TR : this.FLW_ASR_TR
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
      }};
      this.isLoading = true;
      const response = await this.common_postCall("/api/biz/common/external/select/selectAsrInfoList", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.ASR_INFO_LIST = response.DATA;
      }
      this.isLoading = false;
    },

    rowClick(item) {
      this.SEL_ROW = item;
      this.ASR_INFO_DETAIL = {
        ARA_HDQ_NM : this.SEL_ROW.ARA_HDQ_NM, //지역본부
        MGOF_NM : this.SEL_ROW.MGOF_NM, //단지명
        MNTN_RPSN_CSTP_NM : this.SEL_ROW.MNTN_RPSN_CSTP_NM, //공종
        FRM_NM : this.SEL_ROW.FRM_NM, //업체명
        MNTN_FRM_DS_NM : this.SEL_ROW.MNTN_FRM_DS_NM, //업체구분
        FLW_ASR_TR : this.SEL_ROW.FLW_ASR_TR, //보증기간
        FLW_ASR_ST_DT : this.SEL_ROW.FLW_ASR_ST_DT, //보증시작일
        FLW_ASR_ED_DT : this.SEL_ROW.FLW_ASR_ED_DT, //보증종료일
        FLW_ASR_INS_CO_NM : this.SEL_ROW.FLW_ASR_INS_CO_NM, //보증사
        FLW_ASR_INS_CO_BRH : this.SEL_ROW.FLW_ASR_INS_CO_BRH, //보증지점
        FLW_ASR_COS_NO : this.SEL_ROW.FLW_ASR_COS_NO, //증권번호
        FLW_ASR_RLS_DT : this.SEL_ROW.FLW_ASR_RLS_DT, //보증해제일
        FLW_ASR_CTS : this.SEL_ROW.FLW_ASR_CTS, //AS보증내용
        FLW_ASR_RMK : this.SEL_ROW.FLW_ASR_RMK, //비고
      }

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