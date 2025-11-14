<template>
  <div>
    <!-- 단지 상세 정보 -->
    <div class="pl-header is-no-boredr">
      <v-icon class="pl-icon20 square-title" style="margin-top: 2px;"></v-icon>
      <div class="pl-subtit ml-1">단지 상세 정보</div>
    </div>
    <div class="is-mt-s">
      <div class="pl-cols">
        <div class="is-col-fix" style="width: calc(70% - 24px)">
          <table class="pl-tbl-detail">
            <colgroup>
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
                  <span class="pl-value-txt">{{MGOF_INFO.ARA_HDQ_NM}}</span>
                </td>
                <th scope="row">
                  <span class="pl-label">
                    단지명
                  </span>
                </th>
                <td >
                  <span class="pl-value-txt">{{ MGOF_INFO.MGOF_NM }}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    주소
                  </span>
                </th>
                <td colspan="3">
                  <span class="pl-value-txt">{{ MGOF_INFO.MGOF_ADR }}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    단지유형
                  </span>
                </th>
                <td >
                  <span class="pl-value-txt">{{ MGOF_INFO.MGOF_TP_NM }}</span>
                </td>
                <th scope="row">
                  <span class="pl-label">
                    세대수
                  </span>
                </th>
                <td >
                  <span class="pl-value-txt">{{ MGOF_INFO.ALL_HSH_CNT }}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    준공일
                  </span>
                </th>
                <td >
                  <span class="pl-value-txt">{{ MGOF_INFO.CCW_DT }}</span>
                </td>
                <th scope="row">
                  <span class="pl-label">
                    사업 승인일
                  </span>
                </th>
                <td >
                  <span class="pl-value-txt">{{ MGOF_INFO.US_APV_DT }}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    입주지정 시작
                  </span>
                </th>
                <td >
                  <span class="pl-value-txt">{{ MGOF_INFO.MVIN_ASGM_ST_DT }}</span>
                </td>
                <th scope="row">
                  <span class="pl-label">
                    입주지정 종료
                  </span>
                </th>
                <td >
                  <span class="pl-value-txt">{{ MGOF_INFO.MVIN_ASGM_ED_DT }}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    관리소장 명
                  </span>
                </th>
                <td >
                  <span class="pl-value-txt">{{ MGOF_INFO.ADM_HCH_NM }}</span>
                </td>
                <th scope="row">
                  <span class="pl-label">
                    대표 전화번호
                  </span>
                </th>
                <td >
                  <span class="pl-value-txt">{{ MGOF_INFO.TLNO }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ml-6">
          <table class="pl-tbl-detail">
            <colgroup>
              <col width="127px" />
              <col width="" />
            </colgroup>
            <tbody>
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    관리업체
                  </span>
                </th>
                <td >
                  <span class="pl-value-txt">{{ FRM_INFO.CO_NM }}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    업체 전화번호
                  </span>
                </th>
                <td >
                  <span class="pl-value-txt">{{ FRM_INFO.TLNO }}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    관리소장 명
                  </span>
                </th>
                <td >
                  <span class="pl-value-txt">{{ FRM_INFO.ADM_HCH_NM }}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    관리소 대표전화
                  </span>
                </th>
                <td >
                  <span class="pl-value-txt">{{ FRM_INFO.MGOF_TELNO }}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    관리업체 주소
                  </span>
                </th>
                <td style="height: 60px;">
                  <span class="pl-value-txt">{{ FRM_INFO.HDOF_ADR }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 단지내 동별 정보 -->
    <div class="pl-header is-no-boredr is-mt-l">
      <v-icon class="pl-icon20 square-title" style="margin-top: 2px;"></v-icon>
      <div class="pl-subtit ml-1">단지내 동별 정보 </div>
    </div>
    <div class="is-mt-s">
      <v-data-table
        class="pl-grid"
        :headers="headers"
        :items="BLDG_LIST"
        fixed-header
        item-key="index"
        height="390px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다."
        :loading="isLoading"
        loading-text="조회중입니다."
        >
      </v-data-table>

    </div>

  </div>
</template>

<script>
export default {
  name: 'CompoAsMgofInfo_TAB02', //단지정보
  components: {
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
      MGOF_CD: '',

      //단지정보
      MGOF_INFO: [],
      //업체정보
      FRM_INFO: {},
      //동 목록
      BLDG_LIST: [],

      isLoading: false,
      ROW_PER_PAGE: 15,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false, },
        { text: '동', value: 'BLDG_NO', align: 'center', width: '5%', sortable: false, },
        { text: '세대수', value: 'DNG_HSH_CNT', align: 'center', width: '5%', sortable: false, },
        { text: '타입', value: 'DNG_HSH_TYP', align: 'center', width: '8%', sortable: false, },
        { text: '난방방식', value: 'HTN_FMLA_NM', align: 'center', width: '8%', sortable: false, },
        { text: '상가여부', value: 'SST_YN', align: 'center', width: '8%', sortable: false, },
        { text: '코아 유형', value: 'CORE_TP_DS_NM', align: 'center', width: '8%', sortable: false, },
        { text: '복도창 설치', value: 'LBY_WND_ISTL_DS_NM', align: 'center', width: '8%', sortable: false, },
        { text: '복도창 적용여부', value: 'LBY_WND_APL_YN', align: 'center', width: '8%', sortable: false, },
        { text: '안전등급', value: 'SFT_GD_DS_NM', align: 'center', width: '8%', sortable: false, },
        { text: '15층 초과여부', value: 'FIV_FLR_OV_YN', align: 'center', width: '8%', sortable: false, },
        { text: '승강기 대수', value: 'ELV_CNT', align: 'center', width: '8%', sortable: false, },
        { text: 'S/P 적용여부', value: 'SP_APP_YN_FMLA_NM', align: 'center', width: '8%', sortable: false, },
        { text: '제연설비 적용여부', value: 'SMK_CTRL_SYS_FMLA_NM', align: 'center', width: '10%', sortable: false, },
      ],
      items: [
        {
          index: 1,
          type01: '101',
          type02: '208',
          type03: '',
          type04: '',
          type05: '미해당',
          type06: '복도형',
          type07: '설치',
          type08: '적용',
          type09: 'A등급',
          type10: '미초과',
          type11: 3,
          type12: '전층적용',
          type13: '적용',
        },
        { index: 2, type01: '101', type02: '208', type03: '', type04: '', type05: '미해당', type06: '복도형', type07: '설치', type08: '적용', type09: 'A등급', type10: '미초과', type11: 2, type12: '전층적용', type13: '적용', },
        { index: 3, type01: '101', type02: '208', type03: '', type04: '', type05: '미해당', type06: '복도형', type07: '설치', type08: '적용', type09: 'A등급', type10: '미초과', type11: 4, type12: '전층적용', type13: '적용', },
        { index: 4, type01: '101', type02: '208', type03: '', type04: '', type05: '미해당', type06: '복도형', type07: '설치', type08: '적용', type09: 'A등급', type10: '미초과', type11: 2, type12: '전층적용', type13: '적용', },
        { index: 5, type01: '101', type02: '208', type03: '', type04: '', type05: '미해당', type06: '복도형', type07: '설치', type08: '적용', type09: 'A등급', type10: '미초과', type11: 3, type12: '전층적용', type13: '적용', },
        { index: 6, type01: '101', type02: '208', type03: '', type04: '', type05: '미해당', type06: '복도형', type07: '설치', type08: '적용', type09: 'A등급', type10: '미초과', type11: 4, type12: '전층적용', type13: '적용', },
        { index: 7, type01: '101', type02: '208', type03: '', type04: '', type05: '미해당', type06: '복도형', type07: '설치', type08: '적용', type09: 'A등급', type10: '미초과', type11: 2, type12: '전층적용', type13: '적용', },
        { index: 8, type01: '101', type02: '208', type03: '', type04: '', type05: '미해당', type06: '복도형', type07: '설치', type08: '적용', type09: 'A등급', type10: '미초과', type11: 2, type12: '전층적용', type13: '적용', },
        { index: 9, type01: '101', type02: '208', type03: '', type04: '', type05: '미해당', type06: '복도형', type07: '설치', type08: '미적용', type09: 'A등급', type10: '미초과', type11: 4, type12: '전층적용', type13: '적용', },
        { index: 10, type01: '101', type02: '208', type03: '', type04: '', type05: '미해당', type06: '', type07: '', type08: '적용', type09: '', type10: '미초과', type11: 2, type12: '전층적용', type13: '적용', },
        { index: 11, type01: '101', type02: '208', type03: '', type04: '', type05: '미해당', type06: '복도형', type07: '설치', type08: '적용', type09: 'A등급', type10: '미초과', type11: 2, type12: '전층적용', type13: '적용', },
        { index: 12, type01: '101', type02: '208', type03: '', type04: '', type05: '미해당', type06: '복도형', type07: '설치', type08: '적용', type09: 'A등급', type10: '미초과', type11: 0, type12: '전층적용', type13: '적용', },
      ],

    }
  },
  mounted() {
  },
  async created() {
    this.MGOF_CD = this.DataProp && this.DataProp.MGOF_CD ? this.DataProp.MGOF_CD : '';
    if(this.MGOF_CD != '') {
      this.getMgofDetail();
      this.getMgofFrm();
      this.getMgofBldgList();
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {

    //단지 상세 정보 조회
    async getMgofDetail() {
        const postParam = {
          MGOF_CD: this.MGOF_CD
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectMgofDetail", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          this.MGOF_INFO = response.DATA[0];
        }
    },

    //임대관리소업체 정보 조회
    async getMgofFrm() {
        const postParam = {
          MGOF_CD: this.MGOF_CD
        };
        const headParam = {head: {}};
        //업체 전화번호 암호화 처리 되어있음.
        const response = await this.common_postCall("/phone-api/as/common/selectMgofFrm", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          this.FRM_INFO = response.DATA[0];
        }
    },

    //동 목록 조회
    async getMgofBldgList() {
        const postParam = {
          MGOF_CD: this.MGOF_CD
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        this.isLoading = true;
        const response = await this.common_postCall("/api/biz/common/external/select/selectMgofBldgList", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          this.BLDG_LIST = response.DATA;
          this.BLDG_LIST.map(item => {
            item.SST_YN = item.SST_YN == "Y" ? "해당" : "미해당";
            item.LBY_WND_APL_YN = item.LBY_WND_APL_YN == "Y" ? "적용" : "미적용";
            item.FIV_FLR_OV_YN = item.FIV_FLR_OV_YN == "Y" ? "초과" : "미초과";
          })
        }
        this.isLoading = false;
    },

  },
};
</script>

<style lang="scss" scoped>

</style>