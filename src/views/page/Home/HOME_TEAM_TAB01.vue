<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
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
                    class="pl-form type-middle is-md"
                    placeholder="선택"
                    v-model="SRCH_PARAMS_TOP.SRCH_CENTER"
                    return-object
                    :items="mixin_ognz_list_center(common_ognz_list, 'CUSL', '' )"
                    @change="SRCH_PARAMS_TOP.SRCH_DEPT={}"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline" v-if="computedUserType === 'ETC_ADMIN' || computedUserType === 'LEADER'">
              <span class="pl-label">
                소속
              </span>
              <div class="pl-desc">
                <v-autocomplete
                    class="pl-form type-middle is-md"
                    v-model="SRCH_PARAMS_TOP.SRCH_DEPT"
                    :items="mixin_ognz_list_detail(common_ognz_list, SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID, '전체' ,'Y'/*콜센터여부,없으면전체*/)"
                    placeholder="조직을 검색하세요"
                    return-object
                    no-data-text="결과 없음"
                    :disabled="SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                재직여부
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle is-sm"
                  placeholder="전체"
                  v-model="SRCH_PARAMS_TOP.SRCH_USER_STTS_CD"
                  :items="mixin_common_code_get(common_code,'USER_STTS_CD','전체')"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                직무
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle is-sm"
                  placeholder="전체"
                  v-model="SRCH_PARAMS_TOP.SRCH_DUTY_GROUP_CD"
                  :items="mixin_common_code_get_global(common_code_global, 'JOB_CL', SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID, '전체' )"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                평가대상
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  style="width: 155px;"
                  v-model="SRCH_PARAMS_TOP.SRCH_TRGT_KEY"
                  :items="[{text:'전체', value:''},{text:'업무능력 평가대상', value:'TASKEVL'},{text:'상담품질 평가대상', value:'EVL'}]"
                  @change="changeDUTY_CD"
                  placeholder="전체"
                ></v-select>
              </div>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle is-sm"
                  v-model="SRCH_PARAMS_TOP.SRCH_EVL_TRGT_YN"
                  :items="EVL_YN_LIST"
                  placeholder="전체"
                ></v-select>
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
                  @keydown.enter="selectUserList"
                  placeholder="성명입력" />
              </div>
            </div>
            <!-- 버튼 -->
            <div>
              <v-btn class="pl-btn is-icon" @click="selectUserList">
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
            </div>
          </div>
        </div>
        <!-- grid top -->
        <div class="pl-grid-top is-border-top pt-2">
          <div class="pl-grid-top-left spacing-wrap sp-16">
            <span class="pl-bullet-txt is-green">재직 ({{ USER_STTS_CD_WORK_CNT }})</span>
            <span class="pl-bullet-txt is-blue">휴직 ({{ USER_STTS_CD_LOA_CNT }})</span>
            <span class="pl-bullet-txt is-yellow">병가 ({{ USER_STTS_CD_SL_CNT }})</span>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ USER_GRID_ITEMS_TOT_CNT }})</em> 명</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-tooltip-btn
              TitleProp="엑셀 다운로드"
              ClassProp="pl-tooltip-btn "
              IconProp="pl-icon20 exceldown"
              TooltipPositionProp="bottom"
              @btnClick="customExcelDown"
            ></compo-tooltip-btn>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s has-img is-hover"
          :headers="headers"
          :items="USER_GRID_ITEMS"
          fixed-header
          item-key="index"
          height="calc(100vh - 288px)"
          hide-default-header
          hide-default-footer
	        no-data-text="등록된 데이터가 없습니다."
          @click:row="selectUserRow"
          @dblclick:row="showUserDetail"
          :items-per-page="-1"
          :loading="mixin_loadding"
          loading-text="조회중입니다." >
          <template v-slot:header>
            <thead class="v-data-table-header multi-row">
              <tr>
                <th rowspan="2" width="5%" class="text-center"><span>번호</span></th>
                <th rowspan="2" width="10%" class="text-center"><span>성명</span></th>
                <th rowspan="2" width="10%" class="text-center"><span>소속</span></th>
                <!-- <th rowspan="2" width="10%" class="text-center"><span>권한그룹</span></th> -->
                <th rowspan="2" width="10%" class="text-center"><span>직무</span></th>
                <th rowspan="2" width="8%" class="text-center"><span>직급</span></th>
                <th rowspan="2" width="5%" class="text-center"><span>근무<br>형태</span></th>

                <th  colspan="2" width="15%" class="text-center"><span>사번</span></th>
                <th  colspan="2" width="15%" class="text-center"><span>입사일</span></th>
                <th  rowspan="2" width="5%" class="text-center"><span>재직<br>여부</span></th>
                <th  rowspan="2" width="8%" class="text-center"><span>퇴사일</span></th>

                <th  colspan="2" width="15%" class="text-center"><span>근속 개월</span></th>
                <th  rowspan="2" width="6%" class="text-center"><span>업무능력<br>평가대상</span></th>
                <th  rowspan="2" width="6%" class="text-center"><span>상담품질<br>평가대상</span></th>
                <th  rowspan="2" width="10%" class="text-center"><span>비고</span></th>
              </tr>
              <tr>
                <th class="text-center"><span >LHCS</span></th>
                <th class="text-center"><span >LH포털</span></th>
                <th class="text-center"><span >LH콜센터</span></th>
                <th class="text-center"><span >LHCS</span></th>
                <th class="text-center"><span >LH콜센터</span></th>
                <th class="text-center"><span >LHCS</span></th>
              </tr>
            </thead>
          </template>
          <!-- <template v-slot:item.USER_NM="{ item }">
            <img :src="item.IMG" :alt="item.USER_NM" class="pl-grid-portrait" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
            <strong class="ml-1">{{ item.USER_NM }}</strong>
          </template> -->
          <!-- <template v-slot:item.EVL_TRGT_YN="{ item }">
            <strong :class="`${item.EVL_TRGT_YN !== 'Y' ? 'is-txt-red' : ''}`">{{ item.EVL_TRGT_YN }}</strong>
          </template> -->
          <!-- <template v-slot:item.USER_STTS_CD_NM="{ item }">
            <strong v-if="item.USER_STTS_CD === 'WORK'/*재직*/" :class="`is-txt-green`">{{ item.USER_STTS_CD_NM }}</strong>
            <strong v-if="item.USER_STTS_CD === 'LOA'/*휴직*/" :class="`is-txt-blue`">{{ item.USER_STTS_CD_NM }}</strong>
            <strong v-if="item.USER_STTS_CD === 'SL'/*병가*/" :class="`is-txt-yellow`">{{ item.USER_STTS_CD_NM }}</strong>
            <strong v-if="item.USER_STTS_CD === 'RTRM'/*퇴직*/" :class="`is-txt-red`">{{ item.USER_STTS_CD_NM }}</strong>
          </template> -->

          <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
            <template v-if="header.value === 'USER_NM'">
              <img :src="item['IMG']" :alt="item['USER_NM']" class="pl-grid-portrait" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
              <strong class="ml-1">{{ item['USER_NM'] }}</strong>
            </template>
            <template v-else-if="header.value === 'EVL_TRGT_YN'">
              <strong :class="`${item['EVL_TRGT_YN'] !== 'Y' ? 'is-txt-red' : ''}`">{{ item['EVL_TRGT_YN'] }}</strong>
            </template>
            <template v-else-if="header.value === 'USER_STTS_CD_NM'">
              <strong v-if="item['USER_STTS_CD'] === 'WORK'/*재직*/" :class="`is-txt-green`">{{ item['USER_STTS_CD_NM'] }}</strong>
              <strong v-if="item['USER_STTS_CD'] === 'LOA'/*휴직*/" :class="`is-txt-blue`">{{ item['USER_STTS_CD_NM'] }}</strong>
              <strong v-if="item['USER_STTS_CD'] === 'SL'/*병가*/" :class="`is-txt-yellow`">{{ item['USER_STTS_CD_NM'] }}</strong>
              <strong v-if="item['USER_STTS_CD'] === 'RTRM'/*퇴직*/" :class="`is-txt-red`">{{ item['USER_STTS_CD_NM'] }}</strong>
            </template>
            <template v-else-if="header.value === 'EVL_TRGT_EXL_RSN'">
              <div v-html="mixin_isEmpty(item['SHORT_WORK_CN']) ? item['EVL_TRGT_EXL_RSN'] :(item['EVL_TRGT_EXL_RSN'] + (mixin_isEmpty(item['EVL_TRGT_EXL_RSN'])?'':'<br>') + item['SHORT_WORK_CN'])"></div>
            </template>
            <template v-else>{{ item[header.value] }}</template>
          </template>
        </v-data-table>
        <!-- dialog detail -->
        <v-dialog
          persistent
          v-model="dialogUserDetail"
          content-class="pl-top-profile-dialog type-center is-nopadding"
          width="700" >
          <compo-dialog
            header-title="상세 정보"
            @hide="eventUserDialog('close')"
          >
            <template slot="body">
              <HOME_TEAM_TAB01_DETAIL ref="dialogUserDetailRef" :PROPS_TAB_INDEX=0 :PROPS_USER_INFO="USER_SEL_ROW" @Refresh="selectUserList" @Close="closeModal" />
            </template>
            <template slot="footer">
              <v-btn class="pl-btn is-trans" @click="eventUserDialog('close')">닫기</v-btn>
              <v-btn class="pl-btn" v-if="DETAIL_SAVE_BTN_VIEW" @click="eventUserDialog('save')">저장</v-btn>
            </template>
          </compo-dialog>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import HOME_TEAM_TAB01_DETAIL from './HOME_TEAM_TAB01_DETAIL'
export default {
  name: "HOME_TEAM_TAB01", //name은 'MENU_' + 파일명 조합
  components: {
    HOME_TEAM_TAB01_DETAIL
  },
  data() {
    return {
      common_ognz_list:[], //조직
      common_code:[], //공통코드
      common_code_global:[], //공통코드
      SRCH_PARAMS_TOP:{
        SRCH_CENTER: {},  //센터
        SRCH_DEPT: {},
        SRCH_DEPT_DISABLED:false,
        SRCH_DUTY_GROUP_CD: '',  //직무
        SRCH_DUTY_CD: '',  //직급
        SRCH_TRGT_KEY: '', //평가대상 유형
        SRCH_EVL_TRGT_YN: '',  //평가대상
        SRCH_USER_STTS_CD: '',
        SRCH_USER_NM: '',
      },

      dialogUserDetail: false,

      // grid
      headers: [
        { text: '번호', value: 'index', align: 'center', width: '', sortable: false },
        { text: '성명', value: 'USER_NM', align: 'center', width: '', sortable: false },
        { text: '소속', value: 'DEPT_NM', align: 'center', width: '', sortable: false },
        // { text: '권한그룹', value: 'AUTHOR_GROUP_NM_LIST', align: 'center', width: '', sortable: false },
        { text: '직무', value: 'DUTY_GROUP_NM', align: 'center', width: '', sortable: false },
        { text: '직급', value: 'DUTY_CD_NM', align: 'center', width: '', sortable: false },
        { text: '근무 형태', value: 'WORK_STTS_CD_NM', align: 'center', width: '', sortable: false },
        { text: 'LH 주거복지정보', value: 'LHCS_EMP_NO', align: 'center', width: '', sortable: false },
        { text: 'LH 포털', value: 'EMP_NO', align: 'center', width: '', sortable: false },
        { text: 'LH 콜센터', value: 'JNCMP_YMD_DD', align: 'center', width: '', sortable: false },
        { text: 'LH 주거복지정보', value: 'LHCS_JNCMP_YMD_DD', align: 'center', width: '', sortable: false },
        { text: '재직 여부', value: 'USER_STTS_CD_NM', align: 'center', width: '', sortable: false },
        { text: '퇴사일', value: 'RSGNTN_YMD_DD', align: 'center', width: '', sortable: false },
        { text: 'LH 콜센터', value: 'JNCMP_YMD_M_DIFF', align: 'center', width: '', sortable: false },
        { text: 'LH 주거복지정보', value: 'LHCS_JNCMP_YMD_M_DIFF', align: 'center', width: '120px', sortable: false },
        { text: '업무능력 평가대상', value: 'TASKEVL_TRGT_YN', align: 'center', width: '', sortable: false },
        { text: '상담품질 평가대상', value: 'EVL_TRGT_YN', align: 'center', width: '', sortable: false },
        { text: '비고', value: 'EVL_TRGT_EXL_RSN', align: 'center', width: '', sortable: false },
      ],
      USER_GRID_ITEMS:[],
      USER_SEL_ROW:{},           //선택한 로우 데이터
      USER_GRID_ITEMS_TOT_CNT:0,

      USER_STTS_CD_WORK_CNT:0, //재직 count
      USER_STTS_CD_LOA_CNT:0, //휴직 count
      USER_STTS_CD_SL_CNT:0, //병가 count
      USER_STTS_CD_RTRM_CNT:0, //퇴직 count

      EVL_YN_LIST: [
        { text:'전체', value:''},
        { text:'Y', value:'Y'},
        { text:'N', value: 'N'},
      ],

      DETAIL_SAVE_BTN_VIEW : true,
    }
  },
  beforeDestroy(){
    this.$eventBus.$off("detailSaveBtnControl"); //eventBus 중복방지를 위해 off
  },
  async created() {
    console.log( "created()" );

    this.$eventBus.$on("detailSaveBtnControl", (tabIdx) => {
      if(tabIdx === 3) this.DETAIL_SAVE_BTN_VIEW = false;
      else this.DETAIL_SAVE_BTN_VIEW = true;
    });

    //조직
    this.common_ognz_list = await this.mixin_ognz_list();

    if( this.computedUserType === 'LEADER' ) {
      this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID = this.computedUserCenter;
      this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = this.computedUserCenterDeptId;
      if( this.computedUserDetailType.indexOf("CENTER_LEADER") === -1) {  //센터장이 아닌경우 자기자신부서만.
        this.SRCH_PARAMS_TOP.SRCH_DEPT.value = this.computedUserDeptId;
        this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = this.computedUserDeptId;
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = true;
      }else {
        let first_obj = this.mixin_ognz_list_detail_first(this.common_ognz_list, this.computedUserCenterDeptId);
        if( first_obj ) { //첫번째 부서세팅.
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = first_obj.DEPT_ID;
          this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = first_obj.DEPT_ID;
        }else {
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = '';
        }
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = false;
      }
    }else if( this.computedUserType === 'ETC_ADMIN' ) {
      this.SRCH_PARAMS_TOP.SRCH_CENTER.value = "1000";
      this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = "1000";
      this.SRCH_PARAMS_TOP.SRCH_DEPT.value = '10004'; //마이홈1팀
      this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = '10004';
    }

    //공통코드설정
    let codeName = ['USE_WT', 'T203'/*직위*/, 'T207'/*직급*/, 'USER_STTS_CD'/* 재직 */];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    let codeNameGloal = ['JOB_CL'/*근무유형(CUSTCO별)*/, 'WT'/*근무유형(CUSTCO별)*/];
    this.common_code_global = await this.mixin_common_code_get_all_global( codeNameGloal );

    await this.selectUserList();
  },
  async mounted() {
    console.log( "mounted()" );
  },
  methods: {

    // 엑셀형식으로 다운로드 한다 
    async customExcelDown() {   

      let sUrl = '/api/biz/common/excel/selectUserList';
      const postParam = {};

      postParam.ITEMS = this.USER_GRID_ITEMS;

      this.mixin_loadding = true;

      try {
        const response = await axios.post(sUrl, postParam, {
          responseType: "blob", // 파일 데이터 수신 설정
        });        
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // 다운로드 링크 생성 및 클릭
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "직원정보.xlsx"; // 파일명 설정
        link.click();
        
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Excel download failed:", error);
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
      this.mixin_loadding = false;
    },

    async selectUserList() {
      if( (this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === '')
        && (this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === '') ) {
        return;
      }
      this.mixin_loadding = true;
      let sURL = '/api/biz/common/select/selectUserList';
      let postParam = {};
      postParam.SRCH_TYPE = 'CUSL';
      if(this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== undefined && this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== '') {
        console.log("this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID >" + this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID + "<");
        postParam.SRCH_DEPT_ID = this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID;
      }else {
        postParam.SRCH_GROUP_ID = this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID;
      }
      postParam.SRCH_DUTY_GROUP_CD = this.SRCH_PARAMS_TOP.SRCH_DUTY_GROUP_CD;
      postParam.SRCH_DUTY_CD = this.SRCH_PARAMS_TOP.SRCH_DUTY_CD;
      postParam.SRCH_TRGT_KEY = this.SRCH_PARAMS_TOP.SRCH_TRGT_KEY;
      postParam.SRCH_EVL_TRGT_YN = this.SRCH_PARAMS_TOP.SRCH_EVL_TRGT_YN;
      postParam.SRCH_USER_STTS_CD = this.SRCH_PARAMS_TOP.SRCH_USER_STTS_CD;
      postParam.SRCH_USER_NM = this.SRCH_PARAMS_TOP.SRCH_USER_NM;

      let headParam = {head: {"ns": 'lhcs.system.user.dao.UserMapper'}};
      let resData = await this.common_postCall(sURL, postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {
        this.USER_GRID_ITEMS = [];
        let response = resData.DATA;
        let i = 0;
        let idx = this.USER_GRID_ITEMS.length + 1
        response.map(item => {
          response[i]["index"] = idx++;
          if( item.ICON_IMG_URI !== '/' ) {
            response[i]["IMG"] = '/upload/' + item.ICON_IMG_URI;
          }else {
            response[i]["IMG"] = require('@/assets/img/@manager_profile_default.png');
          }
          if( item.USER_STTS_CD === 'WORK' ) this.USER_STTS_CD_WORK_CNT = item.USER_STTS_CD_CNT; //재직 count
          if( item.USER_STTS_CD === 'LOA' ) this.USER_STTS_CD_LOA_CNT = item.USER_STTS_CD_CNT; //휴직 count
          if( item.USER_STTS_CD === 'SL' ) this.USER_STTS_CD_SL_CNT = item.USER_STTS_CD_CNT; //병가 count
          if( item.USER_STTS_CD === 'RTRM' ) this.USER_STTS_CD_RTRM_CNT = item.USER_STTS_CD_CNT; //퇴직 count

          return i++;
        });

        this.USER_GRID_ITEMS = [...this.USER_GRID_ITEMS, ...response];
        this.USER_GRID_ITEMS_TOT_CNT = resData.HEADER.TOT_COUNT;
      }else {
        this.USER_GRID_ITEMS = [];
      }
      this.mixin_loadding = false;
    },
    selectUserRow( item ){
      this.USER_SEL_ROW = item;
    },
    showUserDetail(){
      this.dialogUserDetail = true;
    },
    changeDUTY_CD(item) {
      console.log( item )
    },
    eventUserDialog(type) {
      if( type === 'save' ) {
        this.$refs.dialogUserDetailRef.saveTaskInfo();
      }else if( type === 'close' ) {
        this.$refs.dialogUserDetailRef.eventCloseModal();
      }
    },
    closeModal(){
      this.mixin_hideDialog('UserDetail')
    }
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>
table {
  table-layout: fixed;
}
</style>