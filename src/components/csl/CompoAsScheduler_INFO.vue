<template>
  <div>
    <div class="pl-header">
      <div class="pl-header--title">스케줄러 정보 </div>
      <div class="spacing-wrap sp-4 ml-auto">
        <v-btn class="pl-btn is-sub is-sm">전체 초기화 </v-btn>
        <v-btn
          class="pl-btn is-sub is-sm"
          @click="mixin_openWindow( 'LayoutPopup', '1600', '850', {compo_name : 'CSL_M0100', callback : 'getPopData', title: '조회전용', popData: {userDefaultCuttTask: 'IBND'}, readOnly: true})"
        >조회전용 </v-btn>
        <!-- 스케줄러 목록 확장 버튼 -->
        <compo-tooltip-btn
          :TitleProp="computedSchListText"
          :IconProp="computedSchListClass"
          ClassProp="pl-tooltip-btn is-line"
          TooltipPositionProp="bottom"
          :MinWidthProp=30
          :HeightProp=22
          @btnClick="toggleExpandSchList(IsExpandSchListProp)"
        ></compo-tooltip-btn>
        <!-- 스케줄러 정보  보기 버튼 -->
        <compo-tooltip-btn
          :TitleProp="computedSchInfoText"
          :IconProp="computedSchInfoClass"
          ClassProp="pl-tooltip-btn is-line"
          TooltipPositionProp="bottom"
          :MinWidthProp=30
          :HeightProp=22
          @btnClick="toggleHideSchInfo(IsHideSchInfoProp)"
        ></compo-tooltip-btn>
      </div>
    </div>
    <template>
      <!-- 현재 다른 경로를 통해 조회 중 입니다. 일반 조회를 하시려면 이 영역을 클릭해 주세요. -->
      <div
        @click="searchNormal"
        :class="`is-mt-s pl-scheduler-isSearching-${ SRCH_FROM }`"
        :style="`display: ${IsHideSchInfoProp ? 'none' : 'block'} `">
        <table class="pl-tbl-detail">
          <colgroup>
            <col width="8%" />
            <col width="16%" />
            <col width="8%" />
            <col width="" />
            <col width="8%" />
            <col width="16%" />
            <col width="8%" />
            <col width="" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  처리상태
                </span>
              </th>
              <td >
                <v-select
                  v-model="FLW_PGRS_SS_CD"
                  :items="FLW_PGRS_SS_CD_LIST"
                  multiple
                  @change="changeFlwPgrsSsCd"
                  class="pl-form is-auto"
                  placeholder="전체선택"
                ></v-select>
              </td>
              <th scope="row">
                <span class="pl-label">
                  지역본부
                </span>
              </th>
              <td>
                <v-select
                  v-model="ARA_HDQ_CD"
                  :items="ARA_HDQ_CD_LIST"
                  class="pl-form is-auto"
                  placeholder="선택"
                ></v-select>
              </td>
              <th scope="row">
                <span class="pl-label">
                  업체명
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="FRM_NM"
                  class="pl-form is-search is-auto"
                  placeholder="검색어 입력"
                  @keydown.enter="mixin_showDialog('FindAsFrm')"
                >
                  <template v-slot:append>
                    <v-btn
                      @click="mixin_showDialog('FindAsFrm')"
                      class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  상담사
                </span>
              </th>
              <td>
                <div class="spacing-wrap sp-4">
                  <v-text-field
                    v-model="EMP_NM"
                    class="pl-form is-search is-auto"
                    placeholder="검색어 입력"
                    @click="initEmp"
                    readonly
                  >
                    <template v-slot:append>
                      <v-btn
                        @click="openDialog"
                        class="pl-btn has-icon-only">
                        <span class="pl-icon20 in-search"></span>
                      </v-btn>
                    </template>
                  </v-text-field>
                  <v-btn class="pl-btn is-sm" @click="searchSchedulerListPaging()">조회</v-btn>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  보수구분
                </span>
              </th>
              <td colspan="3">
                <div class="spacing-wrap sp-4">
                  <v-select
                    v-model="FLW_DTL_DS_CD"
                    :items="FLW_DTL_DS_CD_LIST"
                    style="flex: 0 0 242px"
                    class="pl-form"
                    placeholder="선택"
                  ></v-select>
                  <v-select
                    v-model="SRCH_TYPE"
                    :items="SRCH_TYPE_LIST"
                    class="pl-form is-auto"
                    placeholder="선택"
                  ></v-select>
                  <v-text-field
                    v-model="SRCH_TEXT"
                    class="pl-form is-auto"
                  ></v-text-field>

                </div>
              </td>
              <th scope="row">
                <span class="pl-label">
                  완료 유형
                </span>
              </th>
              <td>
                <v-select
                  v-model="SCH_STAT_TYPE"
                  :items="SCH_STAT_TYPE_LIST"
                  class="pl-form is-auto"
                  placeholder="선택"
                ></v-select>
              </td>
              <th scope="row">
                <span class="pl-label">
                  제외 유형
                </span>
              </th>
              <td>
                <v-select
                  v-model="WORK_TYPE"
                  :items="WORK_TYPE_LIST"
                  class="pl-form is-auto"
                  placeholder="선택"
                ></v-select>
              </td>

            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  경과일
                </span>
              </th>
              <td colspan="3">
                <div class="spacing-wrap sp-4">
                  <v-select
                    v-model="DT_TYPE3"
                    :items="DT_TYPE3_LIST"
                    style="flex: 0 0 242px"
                    class="pl-form "
                    placeholder="선택"
                  ></v-select>
                  <span class="pl-label font-weight-light  ml-2">기준</span>
                  <v-text-field
                    v-model="DAY"
                    class="pl-form is-xss ml-1"
                  ></v-text-field>
                  <span class="pl-label font-weight-light ">일 초과 </span>

                </div>
              </td>
              <th scope="row">
                <span class="pl-label">
                  단지명
                </span>
              </th>
              <td colspan="3">
                <div class="spacing-wrap sp-4">
                  <v-text-field
                    v-model="MGOF_NM"
                    style="flex: 0 0 372px"
                    class="pl-form is-search is-auto"
                    placeholder="검색어 입력"
                    @click="mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '569', {compo_name : 'CompoFindAsBldgAdr', callback : 'setBldgAdr', title: '단지/동주소', popData: {MGOF_NM:MGOF_NM}})"
                    readonly
                    >
                    <template v-slot:append>
                      <v-btn
                        @click="mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '569', {compo_name : 'CompoFindAsBldgAdr', callback : 'setBldgAdr', title: '단지/동주소', popData: {MGOF_NM:MGOF_NM}})"
                        class="pl-btn has-icon-only">
                        <span class="pl-icon20 in-search"></span>
                      </v-btn>
                    </template>
                  </v-text-field>
                  <v-checkbox
                    v-model="VST_DT_REG_YN"
                    class="pl-check"
                    label="방문예정일 등록 리스트 "
                    input-value="true"
                  ></v-checkbox>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  <v-select
                    style="flex: 0 0 242px"
                    v-model="DT_TYPE"
                    :items="DT_TYPE_LIST"
                    class="pl-form "
                    placeholder="선택"
                  ></v-select>
                </span>
              </th>
              <td colspan="3">
                <div class="spacing-wrap sp-4 align-center">

                  <compo-date-range-picker
                    :ClassProp=null
                    :StartDayProp.sync="START_DT"
                    :EndDayProp.sync="END_DT"
                    @startDayChange="mixin_testLog(START_DT)"
                    @endDayChange="mixin_testLog(END_DT)"
                    :WidthProp=22
                    :HeightProp=22
                  />

                </div>
              </td>
              <th scope="row">
                <span class="pl-label">
                  통화 예정일
                </span>
              </th>
              <td colspan="3">
                <compo-date-picker
                  :ClassProp=null
                  DateType="dateInput"
                  :DateProp.sync="RSRV_YMD"/>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pl-scheduler-isSearching--text">현재 다른 경로를 통해 조회 중 입니다. 일반 조회를 하시려면 이 영역을 클릭해 주세요.</div>
      </div>
    </template>
    
    <!-- dialog: 업체명 조회 -->
    <v-dialog
      v-if="dialogFindAsFrm"
      v-model="dialogFindAsFrm"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="업체 조회"
        @hide="mixin_hideDialog('FindAsFrm')"
        @submit="submitDialog('FindAsFrm')"
        >
        <template slot="body">
          <CompoFindAsFrm
            @setItem="setFrm"
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
          @hide="[mixin_hideDialog('FindCusl'), initFindMng()]"
          @submit="submitDialog('FindCusl')"
        >
        <template slot="body">
          <CompoFindCusl
              ref="CompoFindCusl"
              :PAGING_PROP="pagingProp"
              :CHK_YN_PROP="chkYnProp"
              @hideDialog="mixin_hideDialog('FindCusl')"
          />
          <!-- PAGING_PROP(Boolean)         : 페이징 사용여부 -->
          <!-- chkYnProp(Boolean)           : 체크박스 사용여부 / true : array , false : object 리턴-->
          <!-- USER_PROP(Array)             : 사용자 목록 PROP - array형태로 보내면 컴포넌트의 userList에서 USER_ID를 찾아 체크  -->
          <!-- SEARCH_INPUT_PROP(Object)    : 검색할 직원/상담사(USER_NM 필수)  -->
          <!-- CUSTCO_ID_PROP(String)       : 선택 고객사ID - 해당 되는 고객사만 조회(센터) -->
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="[mixin_hideDialog('FindCusl'), initFindMng()]">닫기</v-btn>
          <v-btn class="pl-btn" v-if="chkYnProp" @click="submitDialog">선택</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoFindAsBldgAdr from '@/components/CompoFindAsBldgAdr.vue';
import CompoFindAsFrm from '@/components/CompoFindAsFrm.vue';
import CompoFindCusl from '@/components/CompoFindCusl.vue';

export default {
  name: "CompoAsScheduler_INFO", //스케쥴러 정보
  props: {
    IsExpandSchListProp: {
      type: Boolean,
      default: false
    },
    IsHideSchInfoProp: {
      type: Boolean,
      default: false
    },
  },
  components: {
    CompoFindAsBldgAdr,
    CompoFindAsFrm,
    CompoFindCusl,

  },
  data() {
    return {
      //사용자 권한
      USER_TYPE: this.$store.getters["userStore/GE_USER_ROLE"].USER_TYPE,
      USER_DETAIL_TYPE: this.$store.getters["userStore/GE_USER_ROLE"].USER_DETAIL_TYPE,
      USER_ID: this.$store.getters["userStore/GE_USER_ROLE"].userId,
      USER_NM: this.$store.getters["userStore/GE_USER_ROLE"].userName,
      DEPT_ID: this.$store.getters["userStore/GE_USER_ROLE"].DEPT_ID,


      // dialog
      dialogFindAsBldgAdr: false,
      dialogFindAsFrm: false,

      dialogFindCusl: false,
      schRoleProp: 'CUSL', //조회 업무 구분
      chkYnProp: false, //체크박스사용여무
      pagingProp: false, //페이징여부

      common_code: [],


      SRCH_FROM: 'NORMAL',// 일반(NORMAL), TAG, 다른 경로(OTHER)

      //처리상태
      FLW_PGRS_SS_CD: [],
      FLW_PGRS_SS_CD_LIST: [],
      //처리상태 전체 체크 여부
      isAllCheckFlwPgrsSsCd: false,

      //지역본부
      ARA_HDQ_CD: '',
      ARA_HDQ_CD_LIST: [],

      //업체명
      FRM_NM: '',
      // FRM_CD: '',

      //상담사
      EMP_NM: '',
      EMP_NO: '',

      //보수구분
      FLW_DTL_DS_CD: '',
      FLW_DTL_DS_CD_LIST: [],

      //검색 유형
      SRCH_TYPE: 'MBL_NO',
      SRCH_TYPE_LIST: [
        {text: "연락처", value: "MBL_NO"},
        {text: "민원인명", value: "CVPR_NM"},
        {text: "AS접수번호", value: "V_FLW_ACP_SN"},
      ],
      //검색어
      SRCH_TEXT: '',

      //완료 유형
      SCH_STAT_TYPE: '',
      //초기화 데이터 + 코드 테이블에서 가지고 온 값
      SCH_STAT_TYPE_LIST: [
        {text: "선택", value: ""},
        {text: "미완료", value: "N"},
      ],

      //제외유형
      WORK_TYPE: '',
      WORK_TYPE_LIST: [],

      //경과일
      DT_TYPE3: 'FLW_RGS_DT',
      DT_TYPE3_LIST: [
        {text: "접수일", value: "FLW_RGS_DT"},
        {text: "보수지시일", value: "RPR_NSTC_DT"},
      ],
      //일 초과
      DAY:'',

      //단지명
      MGOF_NM: '',
      MGOF_CD: '',

      //방문예정일 등록 리스트
      VST_DT_REG_YN: false,

      //검색 날짜 유형
      DT_TYPE: 'DIST',
      DT_TYPE_LIST: [
        {text: "분배일", value: "DIST"},
        {text: "보수지시일", value: "RPR"},
        {text: "방문확정일", value: "VISIT"},
      ],

      //시작일
      START_DT: (new Date(Date.now() - (1 * 24 * 60 * 60 * 1000) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      //종료일
      END_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      //통화예정일
      RSRV_YMD: '',


    }
  },

  mounted() {
    this.$eventBus.$emit("setAsSchedulerSearchCondition", this.searchCondition);
  },
  async created() {
    console.log("USER_TYPE", this.USER_TYPE);
    console.log("USER_DETAIL_TYPE", this.USER_DETAIL_TYPE);
    console.log("USER_ID", this.USER_ID);
    console.log("DEPT_ID", this.DEPT_ID);

    // 직원 정보 수신
    this.$eventBus.$on('setCuslInfo',(cuslInfo)=> {
      this.setCuslInfo(cuslInfo);
    });
    //검색 유형 변경.
    this.$eventBus.$on('setSchedulerSrchFrom',(srchFrom)=> {
      this.SRCH_FROM = srchFrom;
    });

    //처리상태 코드 목록 조회
    this.getFlwPgrsSsCdList();

    //지역본부 목록 - ARA_HDQ_CD_LIST에 설정함.
    this.mixinAsGetAsAraHdqCdList();

    //보수구분 코드 목록 조회
    this.getFlwDtlDsCdList();

    //상담AP 공통코드 조회 - 제외유형(WP)
    this.getCommonCodeList();

    this.initSearchCondition();

  },
  beforeDestroy() {
    // 직원 정보 수신 이벤트 - eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCuslInfo");
    this.$eventBus.$off("setSchedulerSrchFrom");
  },
  computed: {
    computedSchInfoClass() {
      return this.IsHideSchInfoProp === true ? 'pl-icon20 eye-off' : 'pl-icon20 eye-on'
    },
    computedSchInfoText() {
      return this.IsHideSchInfoProp === true ? '스케줄러 정보 감추기' : '스케줄러 정보  보기'
    },
    computedSchListClass() {
      return this.IsExpandSchListProp === true ? 'pl-icon20 list-expand' : 'pl-icon20 list-shrink'
    },
    computedSchListText() {
      return this.IsExpandSchListProp === true ? '스케줄러 목록 축소' : '스케줄러 목록 확장'
    },
  },
  watch: {
  },
  methods: {
    toggleExpandSchList(val){
      this.$emit('toggleExpandSchList',val)
    },
    toggleHideSchInfo(val){
      this.$emit('toggleHideSchInfo',val)
    },

    initSearchCondition() {
      if(this.USER_TYPE != "ETC_ADMIN") {
        this.EMP_NO = this.USER_ID;
        this.EMP_NM = this.USER_NM;
      }
    },

    initEmp() {
      if(this.EMP_NO != '') {
        this.showAlert({alertDialogToggle: true, msg: '상담사 정보를 초기화 하시겠습니까?', iconClass: 'is-info', type: 'confirm',
        callYes: () => {
          this.EMP_NO = '';
          this.EMP_NM = '';
          this.closeMsg();
        },
        callNo: this.closeMsg})
      } else {
        this.mixin_showDialog('FindCusl')
      }

    },

    //처리상태 코드 목록 조회
    async getFlwPgrsSsCdList() {
      this.FLW_PGRS_SS_CD_LIST = await this.mixinAsGetCommonCode("FLW_PGRS_SS_CD", [], "[전체선택]");
    },

    //보수구분 코드 목록 조회
    async getFlwDtlDsCdList() {
      this.FLW_DTL_DS_CD_LIST = await this.mixinAsGetCommonCode("FLW_DTL_DS_CD")
    },

    async getCommonCodeList() {
      const codeName = ['WP', 'SST9']; //상담채널
      this.common_code = await this.mixin_common_code_get_all(codeName);
      this.WORK_TYPE_LIST = this.mixin_common_code_get(this.common_code, 'WP', '선택');
      const schStatTypeList = this.mixin_common_code_get(this.common_code, 'SST9', '');
      this.SCH_STAT_TYPE_LIST = [...this.SCH_STAT_TYPE_LIST, ...schStatTypeList];
    },


    //스케줄러 목록 검색
    async searchSchedulerListPaging() {
      console.log("searchSchedulerListPaging")

      // 경과일 조건 미입력 시에만 조회조건 체크
      if (this.DAY == "") {
				// AS접수번호 검색이 아니면 지역본부 필수
				if ((this.SRCH_TYPE == "V_FLW_ACP_SN" && this.SRCH_TEXT == "") && this.ARA_HDQ_CD == "") {
          this.showAlertInfo({msg: "지역본부를 선택하세요."})
					return ;
				}

				// 검색기간 입력여부 체크
				if (this.START_DT == "" || this.END_DT == "" || this.END_DT < this.START_DT) {
          this.showAlertInfo({msg: "검색 기간을 확인해주세요."})
					return;
				}
				// 검색기간 최장 90일 체크 31로 변경
				else if (this.mixin_diffDate(this.START_DT, this.END_DT) > 60) {
          this.showAlertInfo({msg: "검색 기간은 60일 이내로 조회 바랍니다."})
					return;
				}
			}

      const searchCondition = {
        SRCH_FROM: this.SRCH_FROM,
        MULTI_FLW_PGRS_SS_CD: this.FLW_PGRS_SS_CD[0] == "" ? "" : this.FLW_PGRS_SS_CD.join(","),

        ARA_HDQ_CD: this.ARA_HDQ_CD,  //지역본부
        FRM_NM: this.FRM_NM, //업체명
        EMP_NO: this.EMP_NO, //상담사

        FLW_DTL_DS_CD: this.FLW_DTL_DS_CD,  //보수구분
        SRCH_TYPE: this.SRCH_TYPE,  //검색 유형
        SRCH_TEXT: this.SRCH_TEXT,  //검색어
        SCH_STAT_TYPE: this.SCH_STAT_TYPE,  //완료 유형
        WORK_TYPE: this.WORK_TYPE,  //제외유형

        DT_TYPE3: this.DT_TYPE3,  //경과일
        DAY: this.DAY,  //일 초과
        MGOF_CD: this.MGOF_CD,  //단지명
        VST_DT_REG_YN: this.VST_DT_REG_YN ? 'Y' : 'N', //방문예정일 등록 리스트

        //검색 날짜 유형
        DT_TYPE: this.DT_TYPE,
        //시작일
        START_DT: this.START_DT,
        //종료일
        END_DT: this.END_DT,
        //통화예정일
        RSRV_YMD: this.RSRV_YMD,
      }

      this.$eventBus.$emit('searchSchedulerListPaging', searchCondition);

    },


    // 처리상태 변경 이벤트
    changeFlwPgrsSsCd(){
      let isCheck = this.FLW_PGRS_SS_CD.includes("");

      if(!this.isAllCheckFlwPgrsSsCd && isCheck){
        this.isAllCheckFlwPgrsSsCd = true;
        this.FLW_PGRS_SS_CD = this.FLW_PGRS_SS_CD_LIST.map(row=>{ return row.value});
      }else if(this.isAllCheckFlwPgrsSsCd && !isCheck){
        this.isAllCheckFlwPgrsSsCd = false;
        this.FLW_PGRS_SS_CD = [];
      }else if(this.FLW_PGRS_SS_CD.filter(row=>{return row != ""}).length == this.FLW_PGRS_SS_CD_LIST.filter(row=>{return row.value != ""}).length){
        this.isAllCheckFlwPgrsSsCd = true;
        this.FLW_PGRS_SS_CD = this.FLW_PGRS_SS_CD_LIST.map(row=>{ return row.value});
      }else if(this.FLW_PGRS_SS_CD.filter(row=>{return row != ""}).length != this.FLW_PGRS_SS_CD_LIST.filter(row=>{return row.value != ""}).length){
        this.isAllCheckFlwPgrsSsCd = false;
        this.FLW_PGRS_SS_CD = this.FLW_PGRS_SS_CD.filter(row=>{return row != ""});
      }
    },


    // 직원 찾기 초기화 이벤트 송신
    initFindMng(){
      this.$eventBus.$emit('initFindMng');
    },
    openDialog(){
      this.mixin_showDialog('FindCusl')
      //this.$eventBus.$emit('findCusl', this.EMP_NM);
    },
    // 체크박스 사용 시 선택 이벤트
    submitDialog(){
      this.$refs.CompoFindCusl.submitData();
    },

    //상담사 다이얼로그 - 상담사 선택 시,
    setCuslInfo(cuslInfo) {
      //console.log("setCuslInfo", cuslInfo)
      this.EMP_NO = cuslInfo.EMP_NO;
      this.EMP_NM = cuslInfo.USER_NM;
    },

    //동주소 검색 다이얼로그 - 단지/동주소 선택 시,
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

    //업체명 검색 다이얼로그 - 업체 선택 시,
    setFrm(item) {
      this.FRM_NM = item.FRM_NM;
      this.mixin_hideDialog('FindAsFrm')
    },

    searchNormal() {
      if(this.SRCH_FROM != "NORMAL") {
        this.SRCH_FROM = "NORMAL";
        this.searchSchedulerListPaging();
      }
    },

    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },

  },
};
</script>

<style lang="scss" scoped>

</style>