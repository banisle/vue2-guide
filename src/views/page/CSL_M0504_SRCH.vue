<template>
  <div class="pl-rounded-box is-mt-s">
    <div class="px-5 py-3">
      <div class="pl-form-inline-wrap label-80" style="display: grid; grid-template-columns: 450px repeat(3, 1fr);">
        <div class="pl-form-inline">
          <span class="pl-label">
            <v-select
              v-model="DT_SET"
              :items="DT_SET_LIST"
              class="pl-form type-middle is-sm"
              placeholder="선택"
            />
          </span>
          <div class="pl-desc">
            <compo-date-range-picker
              :StartDayProp.sync="ACP_FROM_DT"
              :EndDayProp.sync="ACP_TO_DT"
              @startDayChange="mixin_testLog(ACP_FROM_DT)"
              @endDayChange="mixin_testLog(ACP_TO_DT)"
              ParentStyleProp="width: 266px"
              styleProp="flex: 0 0 110px"
            />

          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            지역본부
          </span>
          <div class="pl-desc">
            <v-select
              v-model="ARA_HDQ_CD"
              :items="ARA_HDQ_CD_LIST"
              class="pl-form type-middle"
              placeholder="전체"
            />
          </div>
        </div>
        <div class="pl-form-inline flex-grow-1">
          <span class="pl-label">
            AS 구분
          </span>
          <div class="pl-desc">
            <v-select
              v-model="FLW_DS_CD"
              :items="FLW_DS_CD_LIST"
              @change="changeFlwDsCd"
              class="pl-form type-middle"
              placeholder="전체"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            보수구분
          </span>
          <div class="pl-desc">
            <v-select
              v-model="FLW_DTL_DS_CD"
              :items="FLW_DTL_DS_CD_LIST"
              class="pl-form type-middle"
              placeholder="전체"
            />
          </div>
        </div>
      </div>
      <div class="pl-form-inline-wrap label-80 mt-2" style="display: grid; grid-template-columns: 450px repeat(3, 1fr);">
        <div class="pl-form-inline">
          <span class="pl-label">
            단지명
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="MGOF_NM"
              class="pl-form is-search type-middle"
              @click="checkFindBldgAdr"
              readonly
              >
              <template v-slot:append>
                <v-btn
                  @click="mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '569', {compo_name : 'CompoFindAsBldgAdr', callback : 'setBldgAdr', title: '단지/동주소', popData: {ARA_HDQ_CD: ARA_HDQ_CD}})"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 in-search"></span>
                </v-btn>
              </template>
            </v-text-field>
          </div>
        </div>
        <div class="pl-form-inline flex-grow-1">
          <span class="pl-label">
            미대상 사유
          </span>
          <div class="pl-desc">
            <v-select
              v-model="FLW_PGRS_SS_CD"
              :items="FLW_PGRS_SS_CD_LIST"
              class="pl-form type-middle"
              placeholder="전체"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            접수채널
          </span>
          <div class="pl-desc">
            <v-select
              v-model="ACP_CHNL_CD"
              :items="ACP_CHNL_CD_LIST"
              class="pl-form type-middle"
              placeholder="전체"
            />
          </div>
        </div>
        <div class="pl-form-inline flex-grow-1">
          <span class="pl-label">
            단지유형
          </span>
          <div class="pl-desc">
            <v-select
              v-model="MNTN_LS_TP_CD"
              :items="MNTN_LS_TP_CD_LIST"
              class="pl-form type-middle"
              placeholder="전체"
            />
          </div>
        </div>
      </div>
      <div class="pl-form-inline-wrap label-80 mt-2" style="display: grid; grid-template-columns: 450px repeat(3, 1fr);">
        <div class="pl-form-inline">
          <span class="pl-label">
            시설구분
          </span>
          <div class="pl-desc">
            <v-select
              v-model="LCLS_CD"
              :items="LCLS_CD_LIST"
              @change="changeLclsCd"
              class="pl-form type-middle is-sm"
              placeholder="선택"
            />
          </div>
        </div>
        <div class="pl-form-inline ">
          <span class="pl-label">
            공간구분
          </span>
          <div class="pl-desc" >
            <v-select
              v-model="SPCE_CD"
              :items="SPCE_CD_LIST"
              class="pl-form type-middle"
              placeholder="선택"
            />
          </div>
        </div>
        <div class="pl-form-inline ">
          <span class="pl-label">
            상담사
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="ICPR_NM"
              class="pl-form is-search type-middle"
              placeholder=""
              readonly
              @click="checkFindCusl"
              >
              <template v-slot:append>
                <v-btn
                  @click="mixin_showDialog('FindCusl')"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 in-search"></span>
                </v-btn>
              </template>
            </v-text-field>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            민원인
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="CVPR_NM"
              class="pl-form type-middle"
              placeholder="민원인 입력"
            />
          </div>
        </div>
      </div>
      <div class="pl-form-inline-wrap label-80" style="display: grid; grid-template-columns: 450px repeat(3, 1fr);">
        <div class="pl-form-inline">
          <span class="pl-label">
            AS 접수번호
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="V_FLW_ACP_SN"
              class="pl-form type-middle"
              placeholder="접수번호 입력"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            통보여부
          </span>
          <div class="pl-desc">
            <v-select
              v-model="NOTICE_YN"
              :items="NOTICE_YN_LIST"
              class="pl-form type-middle"
              placeholder="선택"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            분배여부
          </span>
          <div class="pl-desc">
            <v-select
              v-model="ASSGN_STAT_CDS"
              :items="ASSGN_STAT_CDS_LIST"
              class="pl-form type-middle"
              placeholder="선택"
            />
          </div>
        </div>
        <!-- 버튼 -->
        <div class="ml-auto">
          <v-btn class="pl-btn is-icon" @click="btnSearch">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="initSrchCondition()"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>

    <!-- dialog: 상담사 조회 -->
    <v-dialog
      v-if="dialogFindCusl"
      v-model="dialogFindCusl"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="직원 찾기"
          @hide="mixin_hideDialog('FindCusl')"
          @submit="submitDialog('FindCusl')"
        >
        <template slot="body">
          <CompoFindCusl
              ref="CompoFindCusl"
              :PAGING_PROP="true"
              :CHK_YN_PROP="false"
              @hideDialog="mixin_hideDialog('FindCusl')"
          />
          <!-- PAGING_PROP(Boolean)         : 페이징 사용여부 -->
          <!-- chkYnProp(Boolean)           : 체크박스 사용여부 / true : array , false : object 리턴-->
          <!-- USER_PROP(Array)             : 사용자 목록 PROP - array형태로 보내면 컴포넌트의 userList에서 USER_ID를 찾아 체크  -->
          <!-- SEARCH_INPUT_PROP(Object)    : 검색할 직원/상담사(USER_NM 필수)  -->
          <!-- CUSTCO_ID_PROP(String)       : 선택 고객사ID - 해당 되는 고객사만 조회(센터) -->
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('FindCusl')">닫기</v-btn>
          <v-btn class="pl-btn" v-if="false" @click="submitDialog">선택</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
import CompoFindCusl from '@/components/CompoFindCusl.vue';

export default {
  name: 'CSL_M0503', //AS 이력조회
  components: {
    CompoFindCusl,
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
      //단지명 다이얼로그
      dialogFindAsBldgAdr: false,
      //상담사 다이얼로그
      dialogFindCusl: false,
      // 검색
      dropDetail: false,

      //이력 유형(신,구)
      HIST_TYPE: '',

      
      //검색영역
      DT_SET: 'tdn_dt_set',
      DT_SET_LIST : [
        {text: '반려일자', value: 'tdn_dt_set'},
        {text: '수정일자', value: 'reg_dt_set'}
      ],
      ACP_FROM_DT: (new Date(Date.now() - (7 * 24 * 60 * 60 * 1000) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), // 반려일자 - 시작일 : 현재일 기준 7일 이전 날짜 계산
      ACP_TO_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), //반려일자 - 종료일

      V_FLW_ACP_SN: '', //AS 접수번호
      ARA_HDQ_CD: '', //지역본부
      ARA_HDQ_CD_LIST: [], //지역본부 목록
      MGOF_CD: '',  //단지코드
      MGOF_NM: '',  //단지명
      FLW_DS_CD: '',  //AS구분
      FLW_PGRS_SS_CD: '',//미대상 사유
      FLW_PGRS_SS_CD_LIST: [],//미대상 사유 목록
      FLW_PGRS_SS_CD_ALL : ["25","70","91","99","11","80"],//미대상 사유 전체 코드 목록 - 선택 안할 시 이 목록을 in 문으로 조회함.
      FLW_DS_CD_LIST: [], //AS구분 목록
      ACP_CHNL_CD: 'CA',  //접수채널
      ACP_CHNL_CD_LIST: [],  //접수채널 목록
      MNTN_LS_TP_CD: '',  //단지유형
      MNTN_LS_TP_CD_LIST: [],  //단지유형 목록
      FLW_DTL_DS_CD: '',  //보수구분
      FLW_DTL_DS_CD_LIST: [
        {text: '선택', value: ''},
      ], //보수구분 목록
      ICPR_EMPNO: '', //상담사 번호
      ICPR_NM: '',  //상담사
      CVPR_NM: '',  //민원인
      LCLS_CD: '',  //시설구분
      LCLS_CD_LIST: [], //시설구분 목록
      
      SPCE_CD: '',//공간구분
      SPCE_CD_LIST: [
        {text: '선택', value: ''},
      ], //공간구분 목록

      NOTICE_YN: 'N',
      NOTICE_YN_LIST: [
        {text: '선택', value: ''},
        {text: '통보', value: 'Y'},
        {text: '미통보', value: 'N'}
      ],
      ASSGN_STAT_CDS: '',
      ASSGN_STAT_CDS_LIST: [
        {text: '선택', value: ''},
        {text: '분배완료', value: 'CLLBCKSTAT08'},
        {text: '미분배', value: 'CLLBCKSTAT09,CLLBCKSTAT99'}
      ],
    }
  },
 
  mounted() {
  },
  created() {
    this.HIST_TYPE = this.DataProp.HIST_TYPE;

    // 직원 정보 수신
    this.$eventBus.$on('setCuslInfo',(cuslInfo)=> {
      this.setCuslInfo(cuslInfo);
    });

    //지역본부 목록
    this.mixinAsGetAsAraHdqCdList();
    //AS구분 목록
    this.getFlwDsCdList();
    //접수채널 목록
    this.getAcpChnlCdList();
    //미대상사유 코드 목록 조회
    this.getFlwPgrsSsCdList();
    //단지유형 목록
    this.getMntnLsTpCdList();

    //시설구분 목록
    this.mixinAsGetLclsCode();
    
    //(구) 이력조회 - 공간구분 목록
    if(this.HIST_TYPE == "OLD") {
      this.getOldSpceCdList();
    }

  },
  beforeDestroy() {
    // 직원 정보 수신 이벤트 - eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCuslInfo");
  },
  computed: {
  },
  watch: {
  },
  methods: {
    //AS 구분 코드 목록 조회
    async getFlwDsCdList() {
      this.FLW_DS_CD_LIST = await this.mixinAsGetCommonCode("FLW_DS_CD", ['10','20','60']);
    },

    //접수채널 목록 조회
    async getAcpChnlCdList() {
      this.ACP_CHNL_CD_LIST = await this.mixinAsGetCommonCode("ACP_CHNL_CD");
    },

    //미대상사유 코드 목록 조회
    async getFlwPgrsSsCdList() {
      this.FLW_PGRS_SS_CD_LIST = await this.mixinAsGetCommonCode("FLW_PGRS_SS_CD", this.FLW_PGRS_SS_CD_ALL, "선택");
    },

    //단지유형 코드 목록 조회
    async getMntnLsTpCdList() {
      this.MNTN_LS_TP_CD_LIST = await this.mixinAsGetCommonCode("MNTN_LS_TP_CD");
    },

    //(구) 이력조회 - 공간구분 목록
    async getOldSpceCdList() {
      this.SPCE_CD_LIST = await this.mixinAsGetCommonCode("MNTN_RPSN_CSTP_CD");
    },

    //AS구분 변경 시 이벤트(선택 항목별 보수구분 조회, 시공사 하자 선택 시 보수지시 다이얼로그 오픈)
    async changeFlwDsCd(item) {
      this.FLW_DTL_DS_CD = '';
      this.FLW_DTL_DS_CD_LIST = [];

      //보수구분 조회
      if(item == '20') {
        const cdGrp = ["60","70","80"]
        this.FLW_DTL_DS_CD_LIST = await this.mixinAsGetCommonCode("FLW_DTL_DS_CD", cdGrp)
      } else if(item != '') {
        const tmpList = await this.mixinAsGetCommonCode("FLW_DTL_DS_CD")
        this.FLW_DTL_DS_CD_LIST = tmpList.filter(item => item.value != '60' && item.value != '70' && item.value != '80')
      }
    },

    //시설구분 변경 시 공간 코드 조회
    async changeLclsCd(item) {
      if(this.HIST_TYPE == "OLD") {
        return
      }
      this.SPCE_CD = '';
      this.MNTN_FLW_CS_CD = '';
      this.mixinAsGetMntnSpceCode(item)
    },

    //동주소 검색 다이얼로그 - 단지명 선택 시, 
    setBldgAdr(item) {
      this.ARA_HDQ_CD = item.ARA_HDQ_CD;
      this.MGOF_CD = item.MGOF_CD;
      if (item.BLDG_ADR && item.BLDG_ADR != '') {
        this.MGOF_NM = item.BLDG_ADR;
      } else {
        this.MGOF_NM = item.MGOF_NM;
      }
      this.mixin_hideDialog('FindAsBldgAdr')
    },
    //단지명 초기화
    checkFindBldgAdr() {
      if(this.MGOF_NM != '') {
        this.showConfirmInfo({msg: '단지 정보를 초기화 하시겠습니까?'
          , callYes : ()=> { 
            this.MGOF_CD = '';
            this.MGOF_NM = '';
            this.closeAlert();
          }
          , callNo : this.closeAlert
        })
      } else {
        this.mixin_showDialog('FindAsBldgAdr')
      }
    },

    //상담사 다이얼로그 - 상담사 선택 시,
    setCuslInfo(cuslInfo) {
      //console.log("setCuslInfo", cuslInfo)
      this.ICPR_EMPNO = cuslInfo.EMP_NO;
      this.ICPR_NM = cuslInfo.USER_NM;
    },
    //상담사 초기화
    checkFindCusl() {
      if(this.ICPR_NM != '') {
        this.showConfirmInfo({msg: '상담사 정보를 초기화 하시겠습니까?'
          , callYes : ()=> {  
            this.ICPR_EMPNO = '';
            this.ICPR_NM = '';
            this.closeAlert();
          }
          , callNo : this.closeAlert
        })
      } else {
        this.mixin_showDialog('FindCusl')
      }
    },


    btnSearch() {
     
      // 당일건, 전일건이 아닐 경우 또는 접수번호로 검색하는 건이 아닐 경우 체크
      if (this.ACP_TO_DT != this.ACP_FROM_DT) {
        if (this.V_FLW_ACP_SN == "") {
          // 접수일자
          if (this.ACP_TO_DT < this.ACP_FROM_DT) {
            this.showAlertInfo({msg: "접수일자를 확인해주세요."})
            return;
          } else if (this.ACP_CHNL_CD == "") {
            this.showAlertInfo({msg: "접수채널을 선택하세요."})
            return;
          }
        }
      }
      
      const searchCondition = {
        HIST_TYPE: this.HIST_TYPE,
        DT_SET: this.DT_SET,
        ACP_FROM_DT: this.ACP_FROM_DT.replace(/\D/g, ""), //접수일자 - 시작일
        ACP_TO_DT: this.ACP_TO_DT.replace(/\D/g, ""), //접수일자 - 종료일
        V_FLW_ACP_SN: this.V_FLW_ACP_SN, //AS 접수번호
        ARA_HDQ_CD: this.ARA_HDQ_CD, //지역본부
        MGOF_CD: this.MGOF_CD,  //단지코드
        MGOF_NM: this.MGOF_NM,  //단지명
        FLW_DS_CD: this.FLW_DS_CD,  //AS구분
        ACP_CHNL_CD: this.ACP_CHNL_CD,  //접수채널
        MNTN_LS_TP_CD: this.MNTN_LS_TP_CD,  //단지유형
        FLW_DTL_DS_CD: this.FLW_DTL_DS_CD,  //보수구분
        PRCR_NM: this.PRCR_NM,  //처리담당자
        ICPR_EMPNO: this.ICPR_EMPNO, //상담사 번호
        ICPR_NM: this.ICPR_NM,  //상담사
        CVPR_NM: this.CVPR_NM,  //민원인
        LCLS_CD: this.LCLS_CD,  //시설구분
        SPCE_CD: this.SPCE_CD,//공간구분
        FLW_PGRS_SS_CD: this.FLW_PGRS_SS_CD,
        FLW_PGRS_SS_CD_ALL: this.FLW_PGRS_SS_CD_ALL.join(","),
        NOTICE_YN: this.NOTICE_YN,
        ASSGN_STAT_CDS: this.ASSGN_STAT_CDS
      }
      this.$emit("search", searchCondition);
    },

    //검색 조건 초기화.
    initSrchCondition() {
      this.DT_SET = 'tdn_dt_set'
      this.ACP_FROM_DT = (new Date(Date.now() - (7 * 24 * 60 * 60 * 1000) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10) // 반려일자 - 시작일 : 현재일 기준 7일 이전 날짜 계산
      this.ACP_TO_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10) //접수일자 - 종료일
      this.V_FLW_ACP_SN = '' //AS 접수번호
      this.ARA_HDQ_CD = '' //지역본부
      this.MGOF_CD = ''  //단지코드
      this.MGOF_NM = ''  //단지명
      this.FLW_DS_CD = ''  //AS구분
      this.ACP_CHNL_CD = 'CA'  //접수채널
      this.MNTN_LS_TP_CD = ''  //단지유형
      this.FLW_DTL_DS_CD = ''  //보수구분
      this.FLW_DTL_DS_CD_LIST = [
        {text: '선택', value: ''},
      ],
      this.ICPR_EMPNO = '' //상담사 번호
      this.ICPR_NM = ''  //상담사
      this.CVPR_NM = ''  //민원인
      this.LCLS_CD = ''  //시설구분
      this.SPCE_CD = ''//공간구분
      this.FLW_PGRS_SS_CD = ''
      this.NOTICE_YN = 'N'
      this.ASSGN_STAT_CDS = ''
      if(this.HIST_TYPE == "NEW") {
        this.SPCE_CD_LIST = [
          {text: '선택', value: ''},
        ]
      }
    },
    
  },
};
</script>

<style lang="scss" scoped>

</style>