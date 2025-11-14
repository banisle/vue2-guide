<template>
  <div class="pl-rounded-box is-mt-s">
    <div class="px-5 py-3">
      <div class="pl-form-inline-wrap label-80" style="display: grid; grid-template-columns: 350px repeat(4, 1fr);">
        <div class="pl-form-inline">
          <span class="pl-label">
            접수일자
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
            AS 접수번호
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="V_FLW_ACP_SN"
              class="pl-form type-middle"
              placeholder="접수번호 입력"
              @keyup="setPatternText(V_FLW_ACP_SN)"
            />
          </div>
        </div>
        <div class="pl-form-inline flex-grow-1">
          <span class="pl-label">
            지역본부
          </span>
          <div class="pl-desc">
            <v-select
              v-model="ARA_HDQ_CD"
              :items="ARA_HDQ_CD_LIST"
              class="pl-form type-middle"
              placeholder="선택"
            />
          </div>
        </div>
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
            단지유형
          </span>
          <div class="pl-desc">
            <v-select
              v-model="MNTN_LS_TP_CD"
              :items="MNTN_LS_TP_CD_LIST"
              class="pl-form type-middle"
              placeholder="선택"
            />
          </div>
        </div>
      </div>
      <div class="pl-form-inline-wrap label-80 mt-2" style="display: grid; grid-template-columns: 350px repeat(4, 1fr);">
        <div class="pl-form-inline">
          <span class="pl-label">
            접수채널
          </span>
          <div class="pl-desc">
            <v-select
              v-model="ACP_CHNL_CD"
              :items="ACP_CHNL_CD_LIST"
              class="pl-form type-middle"
              placeholder="선택"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            처리상태
          </span>
          <div class="pl-desc">
            <v-select
              v-model="FLW_PGRS_SS_CD"
              :items="FLW_PGRS_SS_CD_LIST"
              class="pl-form type-middle"
              placeholder="선택"
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
              placeholder="선택"
            />
          </div>
        </div>
        <div class="pl-form-inline flex-grow-1">
          <span class="pl-label">
            보수구분
          </span>
          <div class="pl-desc">
            <v-select
              v-model="FLW_DTL_DS_CD"
              :items="FLW_DTL_DS_CD_LIST"
              class="pl-form type-middle"
              placeholder="선택"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            처리 담당자
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="PRCR_NM"
              class="pl-form is-search type-middle"
              placeholder="담당자 찾기"
              @click="checkFindIcpr"
              readonly
              >
              <template v-slot:append>
                <v-btn
                  @click="mixin_showDialog('FindAsIcpr')"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 in-search"></span>
                </v-btn>
              </template>
            </v-text-field>
          </div>
        </div>


      </div>
      <div class="pl-form-inline-wrap label-80 mt-2" style="display: grid; grid-template-columns: 350px repeat(4, 1fr);">
        <div class="pl-form-inline">
          <span class="pl-label">
            상담사
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="ICPR_NM"
              class="pl-form is-search type-middle"
              placeholder="상담사 찾기"
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
        <div class="pl-form-inline ">
          <span class="pl-label">
            시설구분
          </span>
          <div class="pl-desc" style="width: 186px;">
            <v-select
              v-model="LCLS_CD"
              :items="LCLS_CD_LIST"
              @change="changeLclsCd"
              class="pl-form type-middle is-sm"
              placeholder="선택"
            />
            <v-text-field
              v-model="BLDG_NO"
              class="pl-form type-middle"
              style="flex: 1;"
              placeholder="동 입력"
            />
          </div>
        </div>
        <div class="pl-form-inline ">
          <span class="pl-label">
            담당자 부서
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="ICPR_DEP_NM"
              class="pl-form is-search type-middle"
              placeholder="담당자 부서 찾기"
              @click="checkFindDep"
              readonly
              >
              <template v-slot:append>
                <v-btn
                  @click="mixin_showDialog('FindAsDep')"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 in-search"></span>
                </v-btn>
              </template>
            </v-text-field>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            대상여부
          </span>
          <div class="pl-desc">
            <v-select
              v-model="TARGET_YN"
              :items="TARGET_YN_LIST"
              class="pl-form type-middle"
              placeholder="선택"
            />
          </div>
        </div>


      </div>
      <div class="pl-form-inline-wrap label-80" style="display: grid; grid-template-columns: 350px 278px 1fr;">
        <div class="pl-form-inline">
          <span class="pl-label">
            공간구분
          </span>
          <div class="pl-desc">
            <v-select
              v-model="SPCE_CD"
              :items="SPCE_CD_LIST"
              class="pl-form type-middle"
              placeholder="선택"
              @change="changeSpceCd"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            공종구분
          </span>
          <div class="pl-desc">
            <v-select
              v-model="MNTN_RPSN_CSTP_CD"
              :items="MNTN_CSTP_CD_LIST"
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

    <!-- dialog: 담당자 정보 -->
    <v-dialog
      v-if="dialogFindAsIcpr"
      v-model="dialogFindAsIcpr"
      width="1410"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="담당자 검색"
        @hide="mixin_hideDialog('FindAsIcpr')"
        >
        <template slot="body">
          <CompoFindAsIcpr 
            :DataProp="{ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, MGOF_NM: MGOF_NM}"
            @setItem="setIcpr"
            @closeDialog="mixin_hideDialog('FindAsIcpr')"
          />
        </template>
      </compo-dialog>
    </v-dialog>

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

    <!-- dialog: 부서 조회 -->
    <v-dialog
      v-if="dialogFindAsDep"
      v-model="dialogFindAsDep"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="담당자부서 검색"
        @hide="mixin_hideDialog('FindAsDep')"
        @submit="submitDialog('FindAsDep')"
        >
        <template slot="body">
          <CompoFindAsDep 
            @setItem="setDep"
            @closeDialog="mixin_hideDialog('FindAsDep')"
          />
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoFindAsIcpr from '@/components/CompoFindAsIcpr.vue';
import CompoFindCusl from '@/components/CompoFindCusl.vue';
import CompoFindAsDep from '@/components/CompoFindAsDep.vue';

export default {
  name: 'CSL_M0503', //AS 이력조회
  components: {
    CompoFindAsIcpr,
    CompoFindCusl,
    CompoFindAsDep,
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
      //담당자 다이얼로그
      dialogFindAsIcpr: false,
      //상담사 다이얼로그
      dialogFindCusl: false,
      //담당자부서 다이얼로그
      dialogFindAsDep: false,
      // 검색
      dropDetail: false,

      //이력 유형(신,구)
      HIST_TYPE: '',
      
      //검색영역
      ACP_FROM_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), //접수일자 - 시작일
      ACP_TO_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), //접수일자 - 종료일

      V_FLW_ACP_SN: '', //AS 접수번호
      ARA_HDQ_CD: '', //지역본부
      ARA_HDQ_CD_LIST: [], //지역본부 목록
      MGOF_CD: '',  //단지코드
      MGOF_NM: '',  //단지명
      FLW_DS_CD: '',  //AS구분
      FLW_DS_CD_LIST: [], //AS구분 목록
      ACP_CHNL_CD: '',  //접수채널
      ACP_CHNL_CD_LIST: [],  //접수채널 목록
      FLW_PGRS_SS_CD: '', //처리상태
      FLW_PGRS_SS_CD_LIST: [],  //처리상태 목록
      MNTN_LS_TP_CD: '',  //단지유형
      MNTN_LS_TP_CD_LIST: [],  //단지유형 목록
      FLW_DTL_DS_CD: '',  //보수구분
      FLW_DTL_DS_CD_LIST: [
        {text: '선택', value: ''},
      ], //보수구분 목록
      PRCR_ID: '',  //처리담당자 아이디
      PRCR_NM: '',  //처리담당자
      ICPR_EMPNO: '', //상담사 번호
      ICPR_NM: '',  //상담사
      CVPR_NM: '',  //민원인
      LCLS_CD: '',  //시설구분
      LCLS_CD_LIST: [], //시설구분 목록
      BLDG_NO: '',  //동
      ICPR_DEP_CD: '',  //담당자부서 코드
      ICPR_DEP_NM: '',  //담당자부서
      TARGET_YN: '', //대상여부
      TARGET_YN_LIST: [
        {text: '선택', value: ''},
        {text: '대상', value: 'Y'},
        {text: '미대상', value: 'N'}
      ],
      SPCE_CD: '',//공간구분
      SPCE_CD_LIST: [
        {text: '선택', value: ''},
      ], //공간구분 목록
      MNTN_RPSN_CSTP_CD: '',  //공종구분
      MNTN_CSTP_CD_LIST: [], //공종구분 목록

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
    //처리상태 목록
    this.getFlwPgrsSsCdList();
    //단지유형 목록
    this.getMntnLsTpCdList();

    //시설구분 목록
    this.mixinAsGetLclsCode();
    
    //(구) 이력조회 - 공간구분 목록
    if(this.HIST_TYPE == "OLD") {
      this.getOldSpceCdList();
    }
    
    //공종 목록
    this.mixinAsGetAsMntnCstpCdList();

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

    //처리상태 코드 목록 조회
    async getFlwPgrsSsCdList() {
      this.FLW_PGRS_SS_CD_LIST = await this.mixinAsGetCommonCode("FLW_PGRS_SS_CD", [], "선택");
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

    //공간 선택 시, 공종 목록 조회
    async changeSpceCd(item) {
      this.MNTN_RPSN_CSTP_CD = '';
      this.MNTN_CSTP_CD_LIST = [];

      //시설, 공간 필수 항목 조회
      if(this.LCLS_CD == '' || this.SPCE_CD == '') {
        return;
      }
      //시설구분 + 공간 값으로 공종 조회.
      let postParam = {
        LCLS_CD: this.LCLS_CD,
        MNTN_SPCE_CD: this.SPCE_CD
      };
      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
      }};
      
      //MMA_유지하자분류관리(공종) 코드 조회
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnFlwCsCdList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.MNTN_CSTP_CD_LIST = response.DATA;
        this.MNTN_CSTP_CD_LIST.map(item => {
          item.text = item.REON_MTRL_NM + ' - ' + item.MNTN_FLW_TP_NM + ' - ' + item.MNTN_CSTP_NM + ' - ' + item.MNTN_CON_NM;
          item.value = item.MNTN_FLW_CS_CD;
        })
      }
    },

    //동주소 검색 다이얼로그 - 단지명 선택 시, 
    setBldgAdr(item) {
      this.ARA_HDQ_CD = item.ARA_HDQ_CD;
      this.MGOF_CD = item.MGOF_CD;
      if (item.BLDG_ADR && item.BLDG_ADR != '') {
        this.MGOF_NM = item.BLDG_ADR;
        this.BLDG_NO = item.BLDG_NO;
      } else {
        this.MGOF_NM = item.MGOF_NM;
        this.BLDG_NO = '';
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
            this.BLDG_NO = '';
            this.closeAlert();
          }
          , callNo : this.closeAlert
        })
      } else {
        this.mixin_showDialog('FindAsBldgAdr')
      }
    },

    //담당자 검색 다이얼로그 - 더블클릭으로 선택 시
    setIcpr(item) {
      this.PRCR_ID = item.USR_ID;
      this.PRCR_NM = item.USR_NM;
      this.mixin_hideDialog('FindAsIcpr')
    },
    //처리 담당자 초기화
    checkFindIcpr() {
      if(this.PRCR_NM != '') {
        this.showConfirmInfo({msg: '처리담당자 정보를 초기화 하시겠습니까?'
          , callYes : ()=> {  
            this.PRCR_ID = '';
            this.PRCR_NM = '';
            this.closeAlert();
          }
          , callNo : this.closeAlert
        })
      } else {
        this.mixin_showDialog('FindAsIcpr')
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

    //담당자부서 다이얼로그 - 부서 선택 시,
    setDep(item) {
			this.ICPR_DEP_CD = item.DEP_CD;
			this.ICPR_DEP_NM = item.DEP_NM;
      this.mixin_hideDialog('FindAsDep')
    },
    //담당자부서 초기화
    checkFindDep() {
      if(this.ICPR_DEP_NM != '') {
        this.showConfirmInfo({msg: '담당자 부서 정보를 초기화 하시겠습니까?'
          , callYes : ()=> {  
            this.ICPR_DEP_CD = '';
            this.ICPR_DEP_NM = '';
            this.closeAlert();
          }
          , callNo : this.closeAlert
        })
      } else {
        this.mixin_showDialog('FindAsDep')
      }
    },

    btnSearch() {
      if(this.HIST_TYPE == "NEW") {
        if (this.V_FLW_ACP_SN == "") {
          // 접수일자
          if (this.ACP_TO_DT < this.ACP_FROM_DT) {
            this.showAlertInfo({msg: "접수일자를 확인해주세요."})
            return;
          }
          // 지역본부
          else if (this.ARA_HDQ_CD == "") {
            this.showAlertInfo({msg: "지역본부를 선택하세요."})
            return;
          }
          // 당일건, 전일건이 아닐 경우 또는 접수번호로 검색하는 건이 아닐 경우 체크
          if (this.ACP_TO_DT != this.ACP_FROM_DT) {
            // 단지명
            if (this.MGOF_NM == "") {
              this.showAlertInfo({msg: "단지명을 입력하세요."})
              return;
            }
          }
        }
      } else if(this.HIST_TYPE == "OLD") {
        if (this.ACP_TO_DT != this.ACP_FROM_DT) {
          if (this.ACP_TO_DT < this.ACP_FROM_DT) {
            this.showAlertInfo({msg: "접수일자를 확인해주세요."})
            return;
          }
          // 지역본부
          else if (this.ARA_HDQ_CD == "") {
            this.showAlertInfo({msg: "지역본부를 선택하세요."})
            return;
          }
          else if (this.MGOF_NM == "") {
            this.showAlertInfo({msg: "단지명을 입력하세요."})
            return;
          }
        }
      }
      
      const searchCondition = {
        HIST_TYPE: this.HIST_TYPE,
        ACP_FROM_DT: this.ACP_FROM_DT.replace(/\D/g, ""), //접수일자 - 시작일
        ACP_TO_DT: this.ACP_TO_DT.replace(/\D/g, ""), //접수일자 - 종료일
        V_FLW_ACP_SN: this.V_FLW_ACP_SN, //AS 접수번호
        ARA_HDQ_CD: this.ARA_HDQ_CD, //지역본부
        MGOF_CD: this.MGOF_CD,  //단지코드
        MGOF_NM: this.MGOF_NM,  //단지명
        FLW_DS_CD: this.FLW_DS_CD,  //AS구분
        ACP_CHNL_CD: this.ACP_CHNL_CD,  //접수채널
        FLW_PGRS_SS_CD: this.FLW_PGRS_SS_CD, //처리상태
        MNTN_LS_TP_CD: this.MNTN_LS_TP_CD,  //단지유형
        FLW_DTL_DS_CD: this.FLW_DTL_DS_CD,  //보수구분
        PRCR_ID: this.PRCR_ID,  //처리담당자 아이디
        PRCR_NM: this.PRCR_NM,  //처리담당자
        ICPR_EMPNO: this.ICPR_EMPNO, //상담사 번호
        ICPR_NM: this.ICPR_NM,  //상담사
        CVPR_NM: this.CVPR_NM,  //민원인
        LCLS_CD: this.LCLS_CD,  //시설구분
        BLDG_NO: this.BLDG_NO,  //동
        ICPR_DEP_CD: this.ICPR_DEP_CD,  //담당자부서 코드
        ICPR_DEP_NM: this.ICPR_DEP_NM,  //담당자부서
        TARGET_YN: this.TARGET_YN, //대상여부
        SPCE_CD: this.SPCE_CD,//공간구분
        MNTN_RPSN_CSTP_CD: this.MNTN_RPSN_CSTP_CD  //공종구분
      }
      this.$emit("search", searchCondition);
    },

    //검색 조건 초기화.
    initSrchCondition() {
      this.ACP_FROM_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10) //접수일자 - 시작일
      this.ACP_TO_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10) //접수일자 - 종료일
      this.V_FLW_ACP_SN = '' //AS 접수번호
      this.ARA_HDQ_CD = '' //지역본부
      this.MGOF_CD = ''  //단지코드
      this.MGOF_NM = ''  //단지명
      this.FLW_DS_CD = ''  //AS구분
      this.ACP_CHNL_CD = ''  //접수채널
      this.FLW_PGRS_SS_CD = '' //처리상태
      this.MNTN_LS_TP_CD = ''  //단지유형
      this.FLW_DTL_DS_CD = ''  //보수구분
      this.FLW_DTL_DS_CD_LIST = [
        {text: '선택', value: ''},
      ]
      this.PRCR_ID = ''  //처리담당자 아이디
      this.PRCR_NM = ''  //처리담당자
      this.ICPR_EMPNO = '' //상담사 번호
      this.ICPR_NM = ''  //상담사
      this.CVPR_NM = ''  //민원인
      this.LCLS_CD = ''  //시설구분
      this.BLDG_NO = ''  //동
      this.ICPR_DEP_CD = ''  //담당자부서 코드
      this.ICPR_DEP_NM = ''  //담당자부서
      this.TARGET_YN = '' //대상여부
      this.SPCE_CD = ''//공간구분
      if(this.HIST_TYPE == "NEW") {
        this.SPCE_CD_LIST = [
          {text: '선택', value: ''},
        ]
      }
      this.MNTN_RPSN_CSTP_CD = ''  //공종구분
    },

    //연락처, AS접수번호 검색 시, 패턴 적용.
    setPatternText(val) {
      this.V_FLW_ACP_SN = this.mixinAsSetAsVFlwAcpSn(val);
    },
    
  },
};
</script>

<style lang="scss" scoped>

</style>