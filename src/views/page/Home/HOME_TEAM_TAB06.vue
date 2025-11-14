<template>
  <div class="px-6">
    <!-- search -->
    <div class="pl-search-form is-mt-m">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline" v-if="computedUserType === 'ETC_ADMIN'">
          <span class="pl-label">
            센터
          </span>
          <div class="pl-desc">
            <v-select
                style="width:130px"
                class="pl-form type-middle is-md"
                placeholder="선택"
                v-model="SRCH_PARAMS_TOP.SRCH_CENTER"
                return-object
                :items="mixin_ognz_list_center(common_ognz_list, 'CUSL', '' )"
                @change="SRCH_PARAMS_TOP.SRCH_DEPT.value=''"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline" v-if="computedUserType === 'ETC_ADMIN' || computedUserType === 'LEADER'">
          <span class="pl-label">
            소속
          </span>
          <div class="pl-desc">
            <v-autocomplete
                style="width:130px"
                class="pl-form type-middle is-md"
                v-model="SRCH_PARAMS_TOP.SRCH_DEPT"
                :items="mixin_ognz_list_detail(common_ognz_list, SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID, '전체', 'Y'/*콜센터여부,없으면전체*/ )"
                placeholder="조직을 검색하세요"
                return-object
                no-data-text="결과 없음"
                :disabled="SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            조회 기간
          </span>
          <div class="pl-desc">
            <compo-date-range-picker
                ParentStyleProp="width: 300px"
                :StartDayProp.sync="SRCH_PARAMS_TOP.SRCH_ST"
                :EndDayProp.sync="SRCH_PARAMS_TOP.SRCH_END"
                @startDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_ST)"
                @endDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_END)"
            />
          </div>
        </div>
        <div class="pl-form-inline" v-if="computedUserType !== 'ETC_ADMIN'">
          <span class="pl-label">
            내/외구분
          </span>
          <div class="pl-desc">
            <v-select
                style="width:80px"
                class="pl-form type-middle is-sm"
                :items="OUTSIDE_YN_LIST"
                v-model="SRCH_PARAMS_TOP.SRCH_OUTSIDE_YN"
                placeholder="전체"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            확인여부
          </span>
          <div class="pl-desc">
            <v-select
                style="width:80px"
                class="pl-form type-middle is-sm"
                :items="YN_LIST"
                v-model="SRCH_PARAMS_TOP.SRCH_IDNTY_YN"
                placeholder="전체"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            상담유형
          </span>
          <div class="pl-desc">
            <compo-cutt-type-combo
                :FormSeProp="'SRCH_DEPTH_1'"
                :SRCH_DEPTH_1_HEADTEXT="'전체'"
                :CustcoProp="computedUserCenter"
                :DisabledProp="false"
                @EMIT_CUTT_TYPE="setCuttType"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            상담번호
          </span>
          <div class="pl-desc">
            <v-text-field
                style="width:90px"
                class="pl-form type-middle"
                v-model="SRCH_PARAMS_TOP.SRCH_PHN_CUTT_ID"
                @keydown.enter="selectGridList"
                placeholder="상담번호" />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            성명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle"
              v-model="SRCH_PARAMS_TOP.SRCH_USER_NM"
              @keydown.enter="selectGridList"
              placeholder="성명입력" />
          </div>
        </div>
        <!-- 버튼 -->
        <div>
          <v-btn class="pl-btn is-icon" @click="selectGridList">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
        </div>
      </div>
    </div>
    <!-- grid top -->
    <div class="pl-grid-top is-border-top pt-2">
      <div class="pl-grid-top-left spacing-wrap sp-16">
        <span class="pl-bullet-txt is-green">확인 <strong>({{ countByConfirm['확인'] }})</strong></span>
        <span class="pl-bullet-txt is-red">미확인 <strong>({{ countByConfirm['미확인'] }})</strong></span>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ GRID.ITEMS_TOT_CNT }})</em> 명</span>
        <!-- 엑셀 다운로드 버튼
        <compo-tooltip-btn
          TitleProp="엑셀 다운로드"
          ClassProp="pl-tooltip-btn "
          IconProp="pl-icon20 exceldown"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('엑셀 다운로드')"
        ></compo-tooltip-btn>  -->
        <compo-excel
              TypeProp="Download"
              :DataHeaderProp="GRID.HEADERS"
              :DataBodyProp="GRID.ITEMS"
              :FileNameProp="fileName"
              SheetNameProp="코칭 현황"
            />
      </div>
    </div>
    <v-data-table
      class="pl-grid has-img is-mt-s is-header-lg is-hover"
      :headers="GRID.HEADERS"
      :items="GRID.ITEMS"
      fixed-header
      item-key="ROW_NUMBER"
      :height="gridHeightProp"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      @dblclick:row="showCoatchingDetail"
      :items-per-page="-1"
      :loading="mixin_loadding">
      <template v-slot:item.USER_NM="{ item }">
        <img :src="item.IMG" :alt="item.USER_NM" class="pl-grid-portrait" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
        <strong class="ml-1">{{ item.USER_NM }}</strong>
      </template>
      <template v-slot:item.INQ_DT="{ item }">
        <span v-if="item.IDNTY_YN === 'Y'">{{ item.INQ_DT }}</span>
        <span class="pl-badge is-bg-red ml-2" v-if="item.IDNTY_YN !== 'Y'">확인안함</span>
      </template>
      <!-- 코멘트 버튼 -->
      <template v-slot:item.PRCS_CN="{ item }">
        <!-- 코멘트  -->
        <v-menu
          v-model="item.PRCS_CN_SHOW"
          max-width="350"
          bottom
          left
          content-class="pl-menu-drop">
          <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
            <v-icon
              v-show="item.PRCS_CN === ''?false:true"
              v-bind="menuAttrs"
              v-on="menuOn"
              class="pl-icon20 board-docu"></v-icon>
          </template>
          <!-- 코멘트 v-menu -->
          <div class="px-8 py-2" style="width:300px">
            <!-- header -->
            <div class="d-flex">
              <h3 style="font-size: 16px">상담사 피드백 내용 </h3>
              <v-btn
                @click="item.PRCS_CN_SHOW = false"
                plain
                min-width="22"
                height="22"
                class="pl-tooltip-btn ml-auto"
                >
                <v-icon
                  small
                  class="pl-icon20 dialog-close-black">
                </v-icon>
              </v-btn>
            </div>
            <!-- form -->
            <div class="pl-form-inline-wrap vertical is-mt-s gap-8">
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 60px">
                  등록일시
                </span>
                <div class="pl-desc">
                  {{ item.PRCS_REG_DT }}
                </div>
              </div>
              <div class="pl-form-inline">
                <p style="white-space: pre-line; width:300px; height: 120px" class="is-bg-light pl-scroll-body rounded-lg">
                  {{ item.PRCS_CN }}
                </p>
              </div>
            </div>
            <div class="pl-btn-wrap is-mt-m">
              <v-btn
                class="pl-btn is-trans ml-auto"
                @click="item.type10 = false">닫기</v-btn>
            </div>
          </div>
        </v-menu>
      </template>

      <!-- 구분 -->
      <template v-slot:item.OUTSIDE_YN="{ item }">
        <span :class="`is-txt-${mixin_displayStatus(item.OUTSIDE_YN, 'STAT_LIST')}`" > {{ item.OUTSIDE_YN }}</span>
      </template>

    </v-data-table>
  </div>
</template>

<script>
import CompoCuttTypeCombo from "@/components/CompoCuttTypeCombo.vue";
import CompoTooltipBtn from "@/components/CompoTooltipBtn.vue";

export default {
  name: "HOME_TEAM_TAB06", //name은 'MENU_' + 파일명 조합
  props: {
    gridHeightProp:{
      type: String,
      default: 'calc(100vh - 288px)'
    }
  },
  components: {
    CompoTooltipBtn,
    CompoCuttTypeCombo,
  },
  data() {
    return {
      common_ognz_list:[], //조직
      common_code:[], //공통코드
      SRCH_PARAMS_TOP:{
        SRCH_CENTER: {},  //센터
        SRCH_DEPT: {},
        SRCH_DEPT_DISABLED:false,
        SRCH_ST: this.$moment(new Date()).subtract(60,'days').format('YYYY-MM-DD'),
        SRCH_END: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_TODAY: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_USER_NM:'',
        SRCH_PHN_CUTT_ID:'',
        SRCH_CNSLT_DIV_CD_1:'', //상담유형 대분류
        SRCH_IDNTY_YN: '',  //확인여부
        SRCH_OUTSIDE_YN: '',  //구분 내부I, 외부E
      },
      GRID: {
        HEADERS: [
          {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
          {text: '상담사', value: 'USER_NM', align: 'center', width: '100px', sortable: false,},
          {text: '소속', value: 'DEPT_NM', align: 'center', width: '120px', sortable: false,},
          {text: '직무', value: 'DUTY_GROUP_NM', align: 'center', width: '100px', sortable: false,},
          {text: '직급', value: 'DUTY_CD_NM', align: 'center', width: '60px', sortable: false,},
          {text: '구분', value: 'OUTSIDE_YN', align: 'center', width: '60px', sortable: false},
          {text: '코칭 일시', value: 'COACHING_REG_DT', align: 'center', width: '130px', sortable: false},
          {text: '상담번호', value: 'PHN_CUTT_ID', align: 'center', width: '100px', sortable: false},
          {text: '인입번호', value: 'LAST_PHN_NO', align: 'center', width: '120px', sortable: false},
          {text: '접속정보', value: 'ARS_INFO', align: 'center', width: '150px', sortable: false},
          {text: '상담일시', value: 'CUTT_REG_DT', align: 'center', width: '130px', sortable: false},
          {text: '통화시간', value: 'PHN_HR_FMT', align: 'center', width: '70px', sortable: false},
          {text: '확인일시', value: 'INQ_DT', align: 'center', width: '130px', sortable: false,},
          {text: '코칭 확인내용 및\n상담사 확인내용', value: 'PRCS_CN', align: 'center', width: '110px', sortable: false,},
          {text: '감점여부', value: 'STRT_APLCN_YN', align: 'center', width: '70px', sortable: false,},
        ],
        ITEMS : [],
        ITEMS_TOT_CNT:0,
      },
      OUTSIDE_YN_LIST:[
        {text: "전체", value: ''},
        {text: "내부", value: 'I'},
        {text: "외부", value: 'E'},
      ],
      YN_LIST: [
        {text: "전체", value: ''},
        {text: "Y", value: 'Y'},
        {text: "N", value: 'N'},
      ],
       // 상태 컬러
       STAT_LIST: [
        { code: '외부', value: 'red'},
      ],

      fileName: '코칭 현황',
    }
  },
  methods: {
    initSrch(){

    },
    async selectGridList() {
      if( (this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === '')
          && (this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === '') ) {
        return;
      }
      this.GRID.ITEMS = [];
      this.mixin_loadding = true;

      let sURL = '/api/biz/common/select/selectPhnCuttCoachingList';
      let postParam = {};
      if(this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== undefined && this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== '') {
        postParam.SRCH_DEPT_ID = this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID;
      }else {
        postParam.SRCH_GROUP_ID = this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID;
      }
      postParam.SRCH_USER_NM = this.SRCH_PARAMS_TOP.SRCH_USER_NM;
      postParam.SRCH_PHN_CUTT_ID = this.SRCH_PARAMS_TOP.SRCH_PHN_CUTT_ID;
      postParam.SRCH_CNSLT_DIV_CD_1 = this.SRCH_PARAMS_TOP.SRCH_CNSLT_DIV_CD_1; //상담유형대분류
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");
      postParam.SRCH_IDNTY_YN = this.SRCH_PARAMS_TOP.SRCH_IDNTY_YN;
      if( this.computedUserType !== 'ETC_ADMIN' ) {
        postParam.SRCH_OUTSIDE_YN = this.SRCH_PARAMS_TOP.SRCH_OUTSIDE_YN;
      }else {
        postParam.SRCH_OUTSIDE_YN = 'E';  //센터운영의경우 외부(E)만.
      }

      let headParam = {head: {"ns": 'lhcs.phone.cutt.dao.PhoneCuttCoachingMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG){
        let responseData = response.DATA;
        let i = 0;
        responseData.map(item => {
          item.FULL_CUTT_TYPE_NM = item.FULL_CUTT_TYPE_NM.replaceAll("&gt;","");
          if( item.OUTSIDE_YN === 'E') {
            responseData[i]["OUTSIDE_YN"] = '외부'
          }else if( item.OUTSIDE_YN === 'I') {
            responseData[i]["OUTSIDE_YN"] = '내부'
          }else {
            responseData[i]["OUTSIDE_YN"] = '-'
          }
          responseData[i]["PRCS_CN_SHOW"] = false;
          return i++;
        });
        this.GRID.ITEMS = [...this.GRID.ITEMS, ...responseData];
        this.GRID.ITEMS_TOT_CNT = response.HEADER.TOT_COUNT;
      }else {
        this.GRID.ITEMS = [];
      }
      this.mixin_loadding = false;
    },

    setCuttType(data){
      this.SRCH_PARAMS_TOP.SRCH_CNSLT_DIV_CD_1 = data;
    },
    showCoatchingDetail(event, {item}){
      this.mixin_showCoach(item.PHN_CUTT_ID, item.CUSTCO_ID);
    },
  },
  mounted() {
  },
  async created() {
    this.common_ognz_list = await this.mixin_ognz_list();//조직

    if( this.computedUserType === 'LEADER' ) {
      this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID = this.computedUserCenter;
      this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = this.computedUserCenterDeptId;
      if( this.computedUserDetailType.indexOf("CENTER_LEADER") === -1) {  //센터장이 아닌경우 자기자신부서만.
        this.SRCH_PARAMS_TOP.SRCH_DEPT.value = this.computedUserDeptId;
        this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = this.computedUserDeptId;
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = true;
      }else {
        this.SRCH_PARAMS_TOP.SRCH_DEPT.value = '';
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = false;
      }
    }else if( this.computedUserType === 'ETC_ADMIN' ) {
      this.SRCH_PARAMS_TOP.SRCH_CENTER.value = "1000";
      this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = "1000";
    }

    //목록조회
    await this.selectGridList();

    // 코칭추가시 or 상담사확인시 호출됨. 필요시추가
    this.$eventBus.$on("refreshCoachingGridList", (item) => {
      this.selectGridList()
    });

    // 내/외구분 용.
    this.$eventBus.$on("initOutSideYn", (item) => {
      console.log( item );
      this.SRCH_PARAMS_TOP.SRCH_OUTSIDE_YN = item.OUTSIDE_YN;
      this.SRCH_PARAMS_TOP.SRCH_ST = this.mixin_convertDate(item.SCH_ST_DT, 'yyyy-MM-dd');
      this.SRCH_PARAMS_TOP.SRCH_END = this.mixin_convertDate(item.SCH_END_DT, 'yyyy-MM-dd');
      this.SRCH_PARAMS_TOP.SRCH_IDNTY_YN = 'N';
      this.selectGridList();
    });
  },
  beforeDestroy(){
    this.$eventBus.$off("refreshCoachingGridList"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("initOutSideYn"); //eventBus 중복방지를 위해 off
  },
  computed: {
    countByConfirm() {
      const statCount = this.GRID.ITEMS.reduce((acc, item) => {
        if (item.IDNTY_YN === 'Y') {
          acc['확인']++;
        }else {
          acc['미확인']++;
        }
        return acc;
      }, { 확인: 0, 미확인: 0 });
      return statCount;
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>