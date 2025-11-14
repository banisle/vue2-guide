<template>
  <div>
    <!-- search form -->
    <div>
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            처리상태
          </span>
          <div class="pl-desc">
            <div class="spacing-wrap sp-4">
              <v-select
                v-model="FLW_PGRS_SS_CD"
                :items="FLW_PGRS_SS_CD_LIST"
                class="pl-form type-middle is-md"
                placeholder="선택"
              ></v-select>
              <v-text-field
                v-model="MGOF_NM"
                readonly
                class="pl-form type-middle"
                style="flex: 0 0 220px"
                placeholder="단지명 입력"
                @click="initMgof">
                <template v-slot:append>
                  <v-btn
                    @click="mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '569', {compo_name : 'CompoFindAsBldgAdr', callback : 'setBldgAdr', title: '단지/동주소', popData: {}})"
                    class="pl-btn has-icon-only">
                    <span class="pl-icon20 in-search"></span>
                  </v-btn>
                </template>
              </v-text-field>
              <v-select
                v-model="DT_TYPE2"
                :items="DT_TYPE2_LIST"
                class="pl-form type-middle is-sm"
                placeholder="통화예정일"
              ></v-select>
              <compo-date-picker
                StyleProp="flex: 0 0 110px;"
                DateType="dateInput"
                :DateProp.sync="START_DT"/>
              <v-select
                v-model="DT_TYPE3"
                :items="DT_TYPE3_LIST"
                class="pl-form type-middle is-sm"
                placeholder="보수지시일"
              ></v-select>
              <compo-date-picker
                StyleProp="flex: 0 0 110px;"
                DateType="dateInput"
                :DateProp.sync="END_DT"/>

              <v-select
                v-model="SRCH_TYPE2"
                :items="SRCH_TYPE2_LIST"
                class="pl-form type-middle is-sm"
                placeholder="연락처"
              ></v-select>

              <v-text-field
                v-model="SRCH_TEXT2"
                class="pl-form type-middle"
                placeholder=""
                />
              <v-text-field
                v-model="FRM_NM"
                class="pl-form type-middle"
                placeholder="업체명 검색"
                @keyup.enter="searchSchedulerList"
                />
            </div>
          </div>
          <div class="spacing-wrap sp-4">
            <v-btn 
              class="pl-btn is-icon flex-grow-0" 
              @click="searchSchedulerList"
            >
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
    </div>
    <!-- temp grid -->
    <v-data-table
      v-model="SELECTED_ITEMS"
      class="pl-grid is-mt-s is-hover has-control"
      :headers="headers"
      :items="SCHEDULER_LIST"
      show-select
      fixed-header
      item-key="ROW_NUM"
      height="330px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :loading="isLoading"
      loading-text="조회중입니다."
      >
      <!-- 업체명 -->
      <template v-slot:item.FRM_NM="{ item }">
        <div>
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                {{ item.FRM_NM }}
              </span>
            </template>
            <span>{{ item.FRM_NM }}</span>
          </v-tooltip>
        </div>
      </template>

      <!-- 단지/동주소 -->
      <template v-slot:item.MGOF_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              {{ item.MGOF_NM }}
            </span>
          </template>
          <span>{{ item.MGOF_NM }}</span>
        </v-tooltip>
      </template>

       <!-- 공종 -->
       <template v-slot:item.MCLS_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              {{ item.MCLS_NM }}
            </span>
          </template>
          <span>{{ item.MCLS_NM }}</span>
        </v-tooltip>
      </template>

      <!-- 메모 -->
      <template v-slot:item.RSRV_CNTNT="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              {{ item.RSRV_CNTNT }}
            </span>
          </template>
          <span>{{ item.RSRV_CNTNT }}</span>
        </v-tooltip>
      </template>

    </v-data-table>

  </div>
</template>

<script>

export default {
  name: 'CompoFindAsMultiSave', //담당자 검색
  components: {
  },
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      // dialog
      dialogFindAsBldgAdr: false,

      SRCH_FROM: 'NORMAL',  //일반(NORMAL), TAG, 다른 경로(OTHER)
      SRCH_TYPE: 'FRM_NM',  //검색유형
      SCH_STAT_TYPE: 'N', //완료유형
      

      FLW_PGRS_SS_CD_LIST: [],
      DT_TYPE2_LIST: [
        {text: '통화예정일', value: 'RSRV'},
        {text: '분배일', value: 'DIST'},
      ],
      DT_TYPE3_LIST: [
        {text: '보수지시일', value: 'RPR'},
      ],
      SRCH_TYPE2_LIST: [
        {text: '연락처', value: 'MBL_NO'},
        {text: 'AS접수번호', value: 'V_FLW_ACP_SN'},
      ],

      ARA_HDQ_CD: '',
      MGOF_CD: '',
      MGOF_NM: '',
      FRM_CD: '',
      SEL_FLW_DTL_FULL_SN: '',
      EMP_NO: '',
      //업체명
      FRM_NM: '',


      //처리상태
      FLW_PGRS_SS_CD: '',
      //통화예정일
      DT_TYPE2: 'RSRV',
      
      START_DT: '',
      //보수지시일
      DT_TYPE3: 'RPR',
      
      END_DT: '',
      //연락처/AS접수번호
      SRCH_TYPE2: 'MBL_NO',
      
      SRCH_TEXT2: '',
      


      // search
      date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      SCHEDULER_LIST: [],
      SELECTED_ITEMS: [],
      isLoading: false,

      ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      // ROW_PER_PAGE: 14, //페이징 없이 전체 화면 뿌릴때

      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '업체명', value: 'FRM_NM', width: '10%', sortable: false},
        { text: '시설구분', value: 'LCLS_NM', align: 'left', width: '4.5%', sortable: false },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: 'left', width: '5%', sortable: false },
        { text: '단지/동주소', value: 'MGOF_NM', align: 'left', width: '7%', sortable: false },
        { text: '동', value: 'BLDG_NO', align: 'left', width: '3.5%', sortable: false },
        { text: '호', value: 'HS_NO', align: 'left', width: '3.5%', sortable: false },
        { text: '공종', value: 'MCLS_NM', align: 'left', width: '6%', sortable: false },
        { text: '처리상태', value: 'FLW_PGRS_SS_NM', align: 'left', width: '6%', sortable: false },
        { text: 'AS접수번호', value: 'V_FLW_ACP_SN', align: 'left', width: '120px', sortable: false },

        { text: '진행현황', value: 'MSTATUS', align: 'center', width: '65px', sortable: false },
        { text: '제외사유', value: 'EXCATE', align: 'left', width: '65px', sortable: false },
        { text: '보수지시일', value: 'RPR_NSTC_DT', align: 'center', width: '6%', sortable: false },

        { text: '분배일자', value: 'ASSGN_YMD', align: 'left', width: '6%', sortable: false },
        { text: '통화예정일', value: 'RSRV_YMD', align: 'left', width: '6%', sortable: false },
        { text: '업체', value: 'FRM_CNT', align: 'center', width: '3.5%', sortable: false },
        { text: '고객', value: 'CUST_CNT', align: 'center', width: '3.5%', sortable: false },
        { text: '관리소', value: 'MGOF_CNT', align: 'center', width: '4%', sortable: false },
        { text: '최종접촉일', value: 'REG_DT', align: 'left', width: '6%', sortable: false },
        { text: '완료', value: 'SCH_STAT_NM', align: 'left', width: '6%', sortable: false },
        { text: '메모', value: 'RSRV_CNTNT', align: 'left', width: '5%', sortable: false },
      ],
    }
  },
  mounted() {
  },
  created() {
    this.MGOF_CD = this.DataProp.MGOF_CD;
    this.MGOF_NM = this.DataProp.MGOF_NM;
    // this.BLDG_NO = this.DataProp.BLDG_NO;
    // this.HS_NO = this.DataProp.HS_NO;
    this.FRM_CD = this.DataProp.FRM_CD;
    this.FRM_NM = this.DataProp.FRM_NM;
    this.SEL_FLW_DTL_FULL_SN = this.DataProp.SEL_FLW_DTL_FULL_SN;
    this.EMP_NO = this.DataProp.EMP_NO;



    //처리상태 코드 목록 조회
    this.getFlwPgrsSsCdList();

    this.searchSchedulerList();

  },
  computed: {
  },
  watch: {
  },
  methods: {

    //처리상태 코드 목록 조회
    async getFlwPgrsSsCdList() {
      this.FLW_PGRS_SS_CD_LIST = await this.mixinAsGetCommonCode("FLW_PGRS_SS_CD", [], "선택");
    },

    //검색 조건 초기화.
    initSrchCondition() {
      this.ARA_HDQ_CD = '';
      this.MGOF_CD = '';
      this.MGOF_NM = '';
      this.FRM_CD = '';
      this.FRM_NM = '';
      this.FLW_PGRS_SS_CD = '';
      this.DT_TYPE2 = 'RSRV';
      this.START_DT = '';
      this.DT_TYPE3 = 'RPR';
      this.END_DT = '';
      this.SRCH_TYPE2 = 'MBL_NO';
      this.SRCH_TEXT2 = '';
      this.SCHEDULER_LIST = [];
      this.SELECTED_ITEMS = [];
    },

    async searchSchedulerList() {
      this.SCHEDULER_LIST = [];
      let postParam = {
        MOBILE_YN: 'Y',
        SRCH_FROM: this.SRCH_FROM,
        SCH_STAT_TYPE: this.SCH_STAT_TYPE,
        SRCH_TYPE: this.SRCH_TYPE, 
        SRCH_TEXT: this.FRM_NM, 
        EMP_NO: this.EMP_NO,
        SEL_FLW_DTL_FULL_SN: this.SEL_FLW_DTL_FULL_SN, 

        SRCH_TYPE2: this.SRCH_TYPE2, 
        SRCH_TEXT2: this.SRCH_TEXT2, 
        FLW_PGRS_SS_CD: this.FLW_PGRS_SS_CD, 
        MGOF_CD: this.MGOF_CD, 
        DT_TYPE2: this.DT_TYPE2, 
        START_DT: this.START_DT, 
        DT_TYPE3: this.DT_TYPE3, 
        END_DT: this.END_DT, 
      };
      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsSchedulerMapper'
      }};
      this.isLoading = true;
      const response = await this.common_postCall("/api/biz/common/select/selectSchedulerList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.SCHEDULER_LIST = response.DATA;
      }
      this.isLoading = false;
    },

    async setItem() {
      if(this.SELECTED_ITEMS.length ==0) {
        this.showAlertInfo({msg: "선택된 건이 없습니다."});
        return
      }

      let hnoIn = [];
      this.SELECTED_ITEMS.map(item => {
        hnoIn.push(item.HNO)
      })

      let postParam = {
        CANCLEYN: "N",
        HNO_IN: hnoIn
      }
      const headParam = {head: {}};
      console.log("/phone-api/as/flwacp/selectFlwAcpCustByHno", this.SELECTED_ITEMS, postParam)

      const response = await this.common_postCall("/phone-api/as/flwacp/selectFlwAcpCustByHno", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        const custList = response.DATA;
        custList.map(item => {
          this.SELECTED_ITEMS.map(item2 => {
            if(item.HNO == item2.HNO) {
              item2.CUST_ID = item.CUST_ID
            }
          })
        })
      }


      this.$emit("setItem", this.SELECTED_ITEMS);
    },

    //단지명 초기화
    initMgof() {
      if(this.MGOF_NM != '') {
        this.showAlert({alertDialogToggle: true, msg: '단지 정보를 초기화 하시겠습니까?', iconClass: 'is-info', type: 'confirm',
        callYes: () => {
          this.MGOF_CD = '';
          this.MGOF_NM = '';
          this.SCHEDULER_LIST = [];
          this.SELECTED_ITEMS = [];
          this.closeAlert();
        },
        callNo: this.closeAlert})
      } else {
        this.mixin_showDialog('FindAsBldgAdr')
      }
    },

    //동주소 검색 다이얼로그 - 단지/동주소 선택 시,
    setBldgAdr(item) {
      this.MGOF_CD = item.MGOF_CD;
      this.MGOF_NM = item.MGOF_NM;
      this.mixin_hideDialog('FindAsBldgAdr')
    },

  },
};
</script>

<style lang="scss" scoped>

</style>