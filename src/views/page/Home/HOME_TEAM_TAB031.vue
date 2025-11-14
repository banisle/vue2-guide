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
                class="pl-form type-middle is-md"
                v-model="SRCH_PARAMS_TOP.SRCH_DEPT"
                :items="mixin_ognz_list_detail(common_ognz_list, SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID, '전체','Y'/*콜센터여부,없으면전체*/ )"
                placeholder="조직을 검색하세요"
                return-object
                no-data-text="결과 없음"
                :disabled="SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            근무 일자
          </span>
          <div class="pl-desc">
            <compo-date-picker
              DateType="dateInput"
              :DateProp.sync="SRCH_PARAMS_TOP.SRCH_DATE"
              @dateChange="selectGridList"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            근태 구분
          </span>
          <div class="pl-desc">
            <div class="spacing-wrap sp-4">
              <v-select
                class="pl-form type-middle"
                placeholder="전체"
                v-model="SRCH_PARAMS_TOP.SRCH_WKATTD_ARTCL_CD"
                :items="mixin_wkattd_code_get(wkattd_code, null, '')"
              ></v-select>
            </div>
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
        ></compo-tooltip-btn> -->
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
      class="pl-grid has-img is-mt-s is-header-lg"
      :headers="GRID.HEADERS"
      :items="GRID.ITEMS"
      fixed-header
      item-key="ROW_NUMBER"
      height="calc(100vh - 288px)"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :items-per-page="-1"
      :loading="mixin_loadding">
      <template v-slot:item.USER_NM="{ item }">
        <img :src="item.IMG" :alt="item.IMG" class="pl-grid-portrait" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
        <strong class="ml-1">{{ item.USER_NM }}</strong>
      </template>
      <!-- 로그아웃 시간 -->
      <template v-slot:item.LGT_DT_TM="{ item }">
        <template v-if="item.LGN_DT_TM && !item.LGT_DT_TM && (SRCH_PARAMS_TOP.SRCH_DATE === $moment(new Date()).format('YYYY-MM-DD'))">
          <v-btn class="pl-btn is-sm is-esp" @click="executeLogout(item.USER_NM, item.USER_ID, item.CUSTCO_ID)">로그아웃</v-btn>
        </template>
        <template v-else>
          <strong>{{ item.LGT_DT_TM }}</strong>
        </template>
      </template>
      <template v-slot:item.SHORT_WORK_TYPE_CD_NM="{ item }">
        <strong class="ml-1" v-if="item.SHORT_WORK_TYPE_CD_NM !== ''" >{{ item.SHORT_WORK_TYPE_CD_NM }}({{ item.SHORT_WORK_HR_CD_NM }})</strong>
      </template>
      <template v-slot:item.DMND_RSN="{item}">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                {{ item.DMND_RSN }}
              </span>
          </template>
          <span>{{ item.DMND_RSN }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>

export default {
  name: "HOME_TEAM_TAB031", //근무시간
  components: {
  },
  data() {
    return {

      common_ognz_list:[], //조직
      common_code:[], //공통코드
      common_code_global:[], //공통코드
      wkattd_code:[], //근태코드
      SRCH_PARAMS_TOP:{
        SRCH_CENTER: {},  //센터
        SRCH_DEPT: {},
        SRCH_DEPT_DISABLED:false,
        SRCH_DATE: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_TODAY: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_USER_NM:'',
        SRCH_WKATTD_ARTCL_CD: '',
      },
      GRID : {
        HEADERS:[
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
          { text: '성명', value: 'USER_NM', align: 'center', width: '120px', sortable: false, },
          { text: '소속', value: 'DEPT_NM', align: 'center', width: '130px', sortable: false, },
          { text: '직무', value: 'DUTY_GROUP_NM', align: 'center', width: '120px', sortable: false, },
          { text: '직급', value: 'DUTY_CD_NM', align: 'center', width: '80px', sortable: false, },
          { text: '근무형태', value: 'WORK_STTS_CD_NM', align: 'center', width: '120px', sortable: false },
          { text: '로그인 시간', value: 'LGN_DT_TM', align: 'center', width: '150px', sortable: false },
          { text: '로그아웃 시간', value: 'LGT_DT_TM', align: 'center', width: '150px', sortable: false },
          { text: '근태 구분', value: 'WKATTD_ARTCL_NM', align: '', width: '150px', sortable: false },
          { text: '사유', value: 'DMND_RSN', align: '', width: '285px', sortable: false },
          { text: '단축 근무', value: 'SHORT_WORK_TYPE_CD_NM', align: '', width: '150px', sortable: false },
        ],
        ITEMS:[],
        ITEMS_TOT_CNT:0,
      },

      fileName: '근무시간 현황',
    }
  },
  methods: {
    async selectGridList() {
      if( (this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === '')
          && (this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === '') ) {
        return;
      }
      this.GRID.ITEMS = [];
      this.mixin_loadding = true;
      let sURL = '/api/biz/common/select/selectEmpWorkTimeUserList';
      let postParam = {};
      postParam.SRCH_TYPE = 'CUSL';
      if(this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== undefined && this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== '') {
        console.log("this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID >" + this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID + "<");
        postParam.SRCH_DEPT_ID = this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID;
      }else {
        postParam.SRCH_GROUP_ID = this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID;
      }
      postParam.SRCH_USER_NM = this.SRCH_PARAMS_TOP.SRCH_USER_NM;
      postParam.SRCH_WKATTD_ARTCL_CD = this.SRCH_PARAMS_TOP.SRCH_WKATTD_ARTCL_CD;
      postParam.SRCH_APLCN_YMD = this.SRCH_PARAMS_TOP.SRCH_DATE.replaceAll("-","");

      let headParam = {head: {"ns": 'lhcs.system.user.dao.UserMapper'}};
      let resData = await this.common_postCall(sURL, postParam, headParam)
      if (!this.mixin_isEmpty(resData)) {
        let response = resData.DATA;
        let i = 0;
        let idx = this.GRID.ITEMS.length + 1
        response.map(item => {
          response[i]["index"] = idx++;
          if( item.ICON_IMG_URI !== '/' ) {
            response[i]["IMG"] = '/upload/' + item.ICON_IMG_URI;
          }else {
            response[i]["IMG"] = require('@/assets/img/@manager_profile_default.png');
          }
          return i++;
        });

        this.GRID.ITEMS = [...this.GRID.ITEMS, ...response];
        this.GRID.ITEMS_TOT_CNT = resData.HEADER.TOT_COUNT;
      }
      this.mixin_loadding = false;
    },
    executeLogout(user_name, user_id, custco_id) {
      this.showConfirmInfo({
        msg: '선택한 사용자('+user_name+') 를 로그아웃 하시겠습니까? ', callYes: () => {this.executeLogoutProcess(user_id, custco_id); }, callNo: () => {
          this.$store.commit("alertStore/hideAlert")
        }
      })
    },
    //강제로그아웃 처리.
    async executeLogoutProcess(p_user_id, p_custco_id) {
      let sURL = '/api/lhcs/system/user/emp/executeLogout';
      let postParam = {};
      postParam.EXEC_USER_ID = this.user_id;
      postParam.SRCH_USER_ID = p_user_id;
      postParam.SRCH_CUSTCO_ID = p_custco_id;
      postParam.SRCH_APLCN_YMD  = this.SRCH_PARAMS_TOP.SRCH_DATE.replaceAll("-","");
      let response = await this.common_postCall(sURL, postParam, {})
      if (!response.HEADER.ERROR_FLAG){
        this.showToastInfo({msg:'정상 처리 되었습니다.', callAfter:()=>{
            this.selectGridList();
            this.$store.commit("alertStore/hideAlert");
          }}
        );
      }else {
        this.$store.commit("alertStore/hideAlert");
      }
    },
  },
  mounted() {
  },
  async created() {
    console.log( "created()" );
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
    let codeName = ['ATDC_TP'/* 근태그룹코드 */];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.wkattd_code = await this.mixin_wkattd_code_list();

    //목록조회
    await this.selectGridList();
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>