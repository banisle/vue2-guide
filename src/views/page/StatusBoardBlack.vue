<template>
  <div class="py-5">
    <div class="px-5 pt-0">
      <!-- search -->
      <div class="pl-rounded-box">
        <div class="px-5 py-3">
          <div class="pl-form-inline-wrap label-80">
            <div class="pl-form-inline flex-grow-1">
              <span class="pl-label">
                요청구분
              </span>
              <div class="pl-desc">
                <div class="pl-selection-row">
                  <v-checkbox
                    v-model="chk01.selected"
                    v-for="(chk01, index) in STTS_CD_LIST"
                    v-if="index < 3"
                    :key="index"
                    :label="chk01.text"
                    class="pl-check "
                    @change="getCustCautionList('')"
                  ></v-checkbox>
                </div>
              </div>
            </div>
          </div>
          <div class="pl-form-inline-wrap label-80 mt-2">
            <div class="pl-form-inline flex-grow-1">
              <span class="pl-label">
                처리결과
              </span>
              <div class="pl-desc">
                <div class="pl-selection-row">
                  <v-checkbox
                    v-model="chk01.selected"
                    v-for="(chk01, index) in STTS_CD_LIST"
                    v-if="index > 2 && index < 6"
                    :key="index"
                    :label="chk01.text"
                    class="pl-check "
                    @change="getCustCautionList('')"
                  ></v-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class=" px-5 py-3 is-border-top">
          <div class="pl-form-inline-wrap label-80">
            <div class="pl-form-inline">
              <span class="pl-label">
                조회기간
              </span>
              <div class="pl-desc">
                <compo-date-range-picker
                  styleProp="flex: 0 0 120px"
                  ParentStyleProp="width: 280px"
                  :StartDayProp.sync="SCH_ST_DTS"
                  :EndDayProp.sync="SCH_END_DTS"
                  @startDayChange="mixin_testLog(SCH_ST_DTS)"
                  @endDayChange="mixin_testLog(SCH_END_DTS)"
                />
              </div>
              <v-btn class="pl-btn" @click="getCustCautionList('')">조회</v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- list top -->
    <div class="d-flex align-center is-mt-s px-5">
      <span class="pl-label">전체 (<span class="is-txt-blue">{{ CAUTION_CUST_TOT_CNT }}</span>)건</span>
      <!-- 필터 팝업 -->
      <v-tooltip content-class="pl-tooltip bottom" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-menu
            min-width="300"
            bottom
            left
            offset-y
            rounded="lg"
            content-class="pa-4 pl-menu-drop"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
              <v-btn
                v-bind="menuAttrs"
                v-on="menuOn"
                class="pl-tooltip-btn ml-auto"
                min-width="30"
                height="30"
                plain
                >
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  class="pl-icon20 filter"></v-icon>
              </v-btn>
            </template>
            <div class="">
              <div class="pl-form-inline-wrap vertical label-100 gap-8">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    <v-icon class="pl-icon20 person-part"></v-icon>
                    <span class="ml-1">부서(팀)</span>
                  </span>
                  <div class="pl-desc">
                    <v-select
                      v-model="SCH_DEPT_ID"
                      class="pl-form type-middle"
                      :items="mixin_ognz_list_detail(common_ognz_list, computedUserCenterDeptId, '전체' )"
                      placeholder="전체"
                      :disabled="computedUserDetailType === 'TEAM_LEADER' || computedUserDetailType === 'MANAGER'?true:false"
                      @change="computedUserDetailType === 'TEAM_LEADER' || computedUserDetailType === 'MANAGER'?'':getUserList()"
                    ></v-select>
                  </div>
                </div>
              </div>
              <div class="pl-form-inline-wrap vertical label-100 is-border-top pt-3 gap-8">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    <v-icon class="pl-icon20 cs-phone"></v-icon>
                    <span class="ml-1">고객 전화번호</span>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      v-model="SCH_CUST_PHN_NO"
                      class="pl-form type-middle"
                      placeholder="전화번호 입력"
                      maxlength="14"
                      hide-spin-buttons
                      type="text"
                      @keyup="setPhoneNo('SCH_CUST_PHN_NO')"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                    ></v-text-field>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    <v-icon class="pl-icon20 nametag"></v-icon>
                    <span class="ml-1">고객 ID</span>
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      v-model="SCH_CUST_IDNTF_NO"
                      class="pl-form type-middle"
                      placeholder="아이디 입력"
                    ></v-text-field>
                  </div>
                </div>
              </div>
              <div class="pl-btn-wrap is-mt-s">
                <v-btn class="pl-btn is-sm ml-auto" @click="getCustCautionList('')">조회</v-btn>
              </div>
            </div>
          </v-menu>
        </template>
        <span>필터</span>
      </v-tooltip>
      <compo-tooltip-btn
        TitleProp="새로고침"
        ClassProp="pl-tooltip-btn ml-1"
        IconProp="pl-icon20 refresh"
        TooltipPositionProp="bottom"
        @btnClick="reFresh"
      ></compo-tooltip-btn>
    </div>
    <!-- list -->
    <div
      style="height: 596px;"
      class="is-mt-s pl-notice-list no-link is-border-top pl-scroll-body">
      <div
        @click="selecteList(item)"
        :class="`pl-notice-list--unit ${ item.active ? 'selected' : ''}`"
        v-for="item in CAUTION_CUST_LIST"
        :key="item.id">
        <div class="d-flex align-center">
          <img :src="item['ICON_URL'] !== '/'? '/upload/' + item['ICON_URL'] : require('@/assets/img/@manager_profile_default.png')" :alt="item['CUSL_NM']"  style="max-width: 35px; max-height: 35px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
          <div class="ml-3">
            <div>
              <strong style="font-size: 14px">{{ item.CUSL_NM }}</strong>
              <span class="ml-2 is-txt-sub">{{ item.FULL_DEPT_NM }}</span>
            </div>
            <div >
              <span>요청일시 {{ mixin_convertDate(item.REG_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
            </div>
          </div>
          <div class="ml-auto mt-2">
            <span
              style="width: 70px;"
              :class="`pl-badge ${ mixin_displayStatus(item.ORG_CAUTION_CUST_STTS_CD, 'STAT_LIST') }`">
              {{ item.ORG_CAUTION_CUST_STTS_NM }}</span>
          </div>
        </div>
      </div>
      <!-- 더보기 -->
      <div v-if="!nextDisabled" class="d-flex justify-center is-mt-m pb-3">
        <v-btn class="pl-btn is-round is-sub px-4" @click="getCustCautionList('next')">더보기</v-btn>
      </div>
      <div class="pl-list-nodata" v-if="CAUTION_CUST_LIST.length === 0">
        <span>등록된 데이터가 없습니다.</span>
      </div>
    </div>
    <!-- detail modal -->
    <v-slide-x-reverse-transition>
      <div
        style="position: fixed; z-index: 0; top: 90px; right: 610px; width: 630px;"
        class="pl-quick-layer "
        v-if=" slideDetail === true ">
        <StatusBoardSlideDetail
          :PropData="selectedItem"
          :CUTT_GVIFMT_HSTRY_ID="selectedItem.CUTT_GVIFMT_HSTRY_ID"
          :PHN_CUTT_ID="selectedItem.PHN_CUTT_ID"
          :PropStat="STAT_LIST"
          PropType="black"
          @Close="closeSlide"
          @setChgData="setChgData"
        />

      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import StatusBoardSlideDetail from './StatusBoardSlideDetail'

export default {
  name: "StatusBoardBlack", //name은 'MENU_' + 파일명 조합
  components: {
    StatusBoardSlideDetail
  },
  props:{
    SCH_ST_DT: {
      type: String,
      default: '',
    },
    SCH_END_DT: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      common_ognz_list:[], //조직정보
      list_common_code : [],
      startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      SCH_ST_DTS : this.$moment(this.startDate).subtract(7,'days').format('YYYY-MM-DD'), //통화 시작 일자
      SCH_END_DTS : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), //통화 시작 일자

      STTS_CD_LIST: [], //배려고객 상태 코드 목록
      userList : [{USER_NM : '전체', USER_ID : ''}], //사용자 목록

      //검색
      SCH_STTS_CD: [], //제보 상태 코드
      SCH_DEPT_ID : '',
      SCH_CUSL_ID : '', //상담사
      SCH_CUST_PHN_NO : '',//고객 전화번호
      SCH_CUST_IDNTF_NO : '',//고객 ID

      pagination : {
        page: 1
        , rowsPerPage: 10
        , sortBy: ""
        , descending: ""
      },//그리드 페이지속성정의
      nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      CAUTION_CUST_TOT_CNT : 0,
      CAUTION_CUST_LIST : [],

      STAT_LIST: [
        { code: 'REQ01', value: 'is-blueGray'},
        { code: 'REQ02', value: 'is-blue'},
        { code: 'REQ03', value: 'is-org'},
        { code: 'REQ04', value: 'is-red'},
        { code: 'REQ05', value: 'is-green'},
        { code: 'REQ06', value: 'is-org'},
      ],

      selectedItem: {},
      slideDetail: false,
    }
  },
  computed: {
  },
  watch: {
    // SCH_ST_DTS() {
    //   this.SCH_ST_DTS = this.mixin_convertDate(this.SCH_ST_DT, 'yyyy-MM-dd');
    //   this.SCH_END_DTS = this.mixin_convertDate(this.SCH_END_DT, 'yyyy-MM-dd');
    // }
  },
  mounted() {
  },
  beforeDestroy(){
    this.$eventBus.$off("getCustCautionList"); //eventBus 중복방지를 위해 off
  },
  async created() {
    //공통코드설정
    let codeName = ['VOC_REQ']; //배려고객 상태
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);
    this.common_ognz_list =  await this.mixin_ognz_list();

    this.STTS_CD_LIST = this.mixin_common_code_get_global(this.list_common_code, 'VOC_REQ', this.computedUserCenter);
    this.STTS_CD_LIST.forEach((item, idx) => {
      if(idx === 0) item.selected = true;
      else item.selected = false;
    });

    if(this.computedUserDetailType === 'TEAM_LEADER' || this.computedUserDetailType === 'MANAGER'){ //팀장(부팀장), 상담사
      this.SCH_DEPT_ID = this.computedUserDeptId;
    }

    this.SCH_ST_DTS = this.mixin_convertDate(this.SCH_ST_DT, 'yyyy-MM-dd');
    this.SCH_END_DTS = this.mixin_convertDate(this.SCH_END_DT, 'yyyy-MM-dd');

    this.$eventBus.$on("getCustCautionList", () => {
      this.getCustCautionList(''); //배려고객 요청 목록
    });

    this.getUserList(); //상담사 목록
    this.getCustCautionList(''); //배려고객 요청 목록
  },
  methods: {
    //배려고객 요청 목록
    async getCustCautionList(next) {
      let postParam = {
        SCH_CUSTCO_ID : this.computedUserCenter
        , SCH_ST_DTS : this.SCH_ST_DTS.replace(/[^0-9]/g, '') //검색 시작 일자
        , SCH_END_DTS : this.SCH_END_DTS.replace(/[^0-9]/g, '') //검색 종료 일자
        , USER_DTL_TYPE : this.computedUserDetailType
        , CUSL_ID : this.SCH_CUSL_ID
        , CUST_PHN_NO : this.SCH_CUST_PHN_NO.replace(/[^0-9]/g, '')
        , CUST_IDNTF_NO : this.SCH_CUST_IDNTF_NO
      };

      this.SCH_STTS_CD = [];
      this.STTS_CD_LIST.forEach((item, idx) => {
        if(item.selected) this.SCH_STTS_CD.push({STTS_CD : item.value});
      });

      if(this.SCH_STTS_CD.length > 0){
        let arrSttsCd = [];
        this.SCH_STTS_CD.forEach((data, idx) => {
          arrSttsCd.push(data);
          if(data.STTS_CD === 'REQ01') arrSttsCd.push({STTS_CD : 'REQ08'});
        });

        this.SCH_STTS_CD = arrSttsCd;

        postParam.SCH_STTS_CD = JSON.stringify(this.SCH_STTS_CD);
      }

      if(this.computedUserDetailType === 'TEAM_LEADER' || this.computedUserDetailType === 'MANAGER'){ //팀장(부팀장), 상담사
        postParam.DEPT_ID = this.computedUserDeptId;
      }else{//센터장
          postParam.DEPT_ID = this.SCH_DEPT_ID;
      }

      //다음버튼 클릭 유무
      if (next == 'next'){
      } else {
        this.pagination.page = 1; //페이징 처리 초기화
        this.CAUTION_CUST_LIST = [];
        this.nextDisabled = true;  //버튼 비활성화
      }

      let headParam = {
        head: {
          ROW_CNT : this.pagination.rowsPerPage,
          PAGES_CNT : this.pagination.page,
          PAGING : 'Y',
        }
      };

      const response = await this.common_postCall("/api/cust/custCautionList", postParam, headParam);
      
      if (!response.HEADER.ERROR_FLAG){
        let tempDataText = response.DATA;
        this.CAUTION_CUST_LIST = [...this.CAUTION_CUST_LIST, ...tempDataText];

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        if(this.CAUTION_CUST_LIST.length > 0) this.CAUTION_CUST_TOT_CNT = response.HEADER.TOT_COUNT;
        else this.CAUTION_CUST_TOT_CNT = 0;

        this.pagination.page += 1;
      }
    },

    //상담사 목록 조회
    async getUserList() {
      let postParam = {
        SCH_TYPE : 'CUSL',
        SCH_GROUP_ID : this.computedUserCenterDeptId,
        SCH_DEPT_ID : this.SCH_DEPT_ID,
      };

      let headParam = {
        head: {
          ns: "palette3.common.user.dao.UserCmmnMapper",
          sn: "selectUserList"
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/selectUserList", postParam, headParam);
      
      if (!response.HEADER.ERROR_FLAG){
        this.userList = [{USER_NM : '전체', USER_ID : ''}];
        this.userList = [...this.userList, ...response.DATA];
      }
    },

    //전화번호 하이픈 추가
    setPhoneNo(sTarget){
      let res = this.mixin_setPhoneNo(this[sTarget].replace(/[^0-9]/g, ""));
      this[sTarget] = res;
    },

    //새로고침
    reFresh(){
      if(this.computedUserDetailType === 'TEAM_LEADER' || this.computedUserDetailType === 'MANAGER'){ //팀장(부팀장), 상담사
        this.SCH_DEPT_ID = this.computedUserDeptId;
        this.SCH_CUSL_ID = '';
      }else{
        this.SCH_DEPT_ID = '';
        this.SCH_CUSL_ID = '';
      }

      this.SCH_CUST_PHN_NO = '';
      this.SCH_CUST_IDNTF_NO = '';

      this.getCustCautionList('');
    },

    setCustCuttInfo(item){
      if(Number(this.CTI_CALL_STAT.replace('stat', '')) === 5){
        this.showAlertInfo({msg : '대기 중에는 다른 업무를 수행할 수 없습니다.'});
        return;
      }else if(Number(this.CTI_CALL_STAT.replace('stat', '')) === 6){
        this.showAlertInfo({msg : '콜 상담 중에는 다른 업무를 수행할 수 없습니다.<br>상담을 먼저 처리해주세요.'});
        return;
      }else{
        //전화상담탭이 있는지 확인
        let m0100 = false;
        if(this.$store.getters['commonStore/GE_COMMON_ACTIVE_TAB'].id === 'CSL_M0100') m0100 = true;

        if(!m0100) this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
        setTimeout(() => {
          this.$eventBus.$emit('setCuttUnProcCustInfo', item);
        }, !m0100?1000:10);
      }
    },

    deActiveItem(){
      let arr = this.CAUTION_CUST_LIST
      for (let index = 0; index < arr.length; index++) {
        arr[index].active = false
      }
    },
    selecteList(item){
      item.CUST_INFO = [
        { title:'인입번호', icon: 'cs-phone', val: item.CUST_PHN_NO, telYn : true },
        { title:'휴대전화', val: item.CUST_PHN_NO, telYn : true },
        { title:'전화번호1', val: item.CUST_PHN_NO1, telYn : true },
        { title:'전화번호2', val: item.CUST_PHN_NO2, telYn : true },
        { title:'전화번호3', val: item.CUST_PHN_NO3, telYn : true },
        { title:'이메일', val: item.EML },
        { title:'고객 ID', icon: 'cs-black', val: item.CUST_IDNTF_NO },
        { title:'고객명', val: item.CUST_NM },
      ];

      item.STTS_CD = item.CAUTION_CUST_STTS_CD;
      this.selectedItem = item
      this.slideDetail = true
      this.deActiveItem()
      item.active = true
    },
    closeSlide(){
      this.deActiveItem()
      this.slideDetail = false
    },
    setChgData(data){
      this.closeSlide();
      this.getCustCautionList('');
    }
  },
};
</script>

<style lang="scss" scoped>

</style>