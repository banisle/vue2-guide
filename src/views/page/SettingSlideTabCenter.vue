<template>
  <div>
    <h2 class="pl-subtit is-mt-l">
    <v-icon class="pl-icon20 swap-manage"></v-icon>
    <span class="ml-1">팀장 권한 위임</span></h2>
    <div class="d-flex ml-6">
      <p class="is-txt-sub mt-1">타 팀의 팀장권한을 위임하여 관리할 수 있습니다.</p>
    </div>

    <!-- grid -->
    <div class="pl-grid-top is-mt-m">
      <div class="pl-grid-top-left">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ GRID.ITEMS.length }})</em> 건</span>
      </div>
      <div class="pl-grid-top-utils">
        <compo-tooltip-btn
          TitleProp="추가"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 circle-plus"
          TooltipPositionProp="bottom"
          @btnClick="regForm"
        ></compo-tooltip-btn>
        <compo-tooltip-btn
          TitleProp="초기화"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="selectGridList"
        ></compo-tooltip-btn>
      </div>
    </div>
    <v-data-table
        class="pl-grid is-mt-s is-hover"
        :headers="GRID.HEADERS"
        :items="GRID.ITEMS"
        fixed-header
        item-key="USER_AUTHRT_DLGT_ID"
        :item-class="isSelectRow"
        height="180px"
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다."
        @click:row="selectGridRow"
        :items-per-page="-1"
        :loading="grid_loading"
        loading-text="조회중입니다."
    >
      <template v-slot:item.BGNG_END="{ item }">
          {{item.BGNG_DT_DD}}~{{item.END_DT_DD}}
          <span style="color:green" v-if="item.IS_ALIVE === 'Y'">★</span>
      </template>
    </v-data-table>

    <!-- 위임 상세정보 -->
     <div class="is-mt-l">
      <h2 class="pl-subtit ">위임상세정보</h2>
      <div class="pl-form-inline-wrap vertical gap-8 label-80 is-mt-m">
        <div class="pl-form-inline">
          <span class="pl-label">
            위임자
          </span>
          <div class="pl-desc">
            <v-select v-model="SELECTED_ROW.DLGT_USER_ID"
              class="pl-form type-middle"
              placeholder="선택"
              :disabled="(!mixin_isEmpty(SELECTED_ROW.USER_AUTHRT_DLGT_ID)) || ( this.selectDesabled1 )"
              :items="comboTeamLeaderList('선택')"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            위임 받는자
          </span>
          <div class="pl-desc">
            <v-select v-model="SELECTED_ROW.USER_ID"
              class="pl-form type-middle"
              placeholder="선택"
              :disabled="!mixin_isEmpty(SELECTED_ROW.USER_AUTHRT_DLGT_ID)"
              :items="comboTeamLeaderList('선택')"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            위임 기간
          </span>
          <div class="pl-desc">
            <compo-date-range-picker
              :StartDayProp.sync="SELECTED_ROW.BGNG_DT_DD"
              :EndDayProp.sync="SELECTED_ROW.END_DT_DD"
              @startDayChange="mixin_testLog(SELECTED_ROW.BGNG_DT_DD)"
              @endDayChange="mixin_testLog(SELECTED_ROW.END_DT_DD)"
              ParentStyleProp="width: 302px"
            />
          </div>
        </div>
      </div>
      <div class="pl-btn-wrap is-mt-m">
        <v-btn class="pl-btn is-esp3" @click="del" v-if="user_id === SELECTED_ROW.RGTR_USER_ID/*등록자만*/">삭제</v-btn>
        <v-btn class="pl-btn ml-auto" @click="save" v-if="(SELECTED_ROW.USER_AUTHRT_DLGT_ID === '') || (user_id === SELECTED_ROW.RGTR_USER_ID/*등록자만*/)">{{ mixin_isEmpty(SELECTED_ROW.USER_AUTHRT_DLGT_ID) ? '저장' : '수정' }}</v-btn>
      </div>
     </div>
  </div>
</template>

<script>
export default {
  name: 'SettingSlideTabCenter', //환경설정 센터 설정
  components: {
  },
  data() {
    return {
      grid_loading:false,
      regMode:false,
      combo_leader_list:[],
      selectDesabled1: false,
      GRID: {
        HEADERS: [
          {text: '위임자', value: 'DLGT_USER_NM', align: 'center', width: '65px', sortable: false},
          {text: '위임받는자', value: 'USER_NM', align: 'center', width: '75px', sortable: false},
          {text: '위임 기간', value: 'BGNG_END', align: '', width: '', sortable: false},
          {text: '등록자', value: 'RGTR_USER_NM', align: 'center', width: '65px', sortable: false},
        ],
        ITEMS: [],
        ITEMS_TOT_COUNT: 0,
      },
      SELECTED_ROW:{
        USER_AUTHRT_DLGT_ID:'',
        USER_ID: '', /* 위임받은자 */
        DLGT_USER_ID: '', /* 위임자 */
        BGNG_DT_DD:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), /* 위임시작일 */
        END_DT_DD: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), /* 위임시작일 */
      },
    }
  },
  mounted() {
  },
  async created() {
    this.combo_leader_list = await this.selectTeamLeaderList();
    await this.selectGridList();
    this.initForm();
    if( this.computedUserDetailType === 'TEAM_LEADER' ) {
      this.SELECTED_ROW.DLGT_USER_ID = this.user_id;
      this.selectDesabled1 = true;
    }
  },
  methods: {
    initForm() {
      this.SELECTED_ROW = {
        USER_AUTHRT_DLGT_ID:'',
        USER_ID: '', /* 위임받은자 */
        DLGT_USER_ID: '', /* 위임자 */
        BGNG_DT_DD:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), /* 위임시작일 */
        END_DT_DD: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), /* 위임시작일 */
      };

    },
    async selectGridList() {
      this.grid_loading = true;
      this.GRID.ITEMS = [];
      let sURL = '/api/biz/common/select/selectUserAuthrtDlgtMngList';
      let postParam = {SRCH_USER_ID: this.user_id};
      let headParam = {head: {"ns": 'lhcs.system.user.dao.UserMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.GRID.ITEMS = response.DATA;
        this.GRID.ITEMS_TOT_COUNT = response.HEADER.TOT_COUNT;
      }else {
        this.GRID.ITEMS = [];
      }
      this.grid_loading = false;
    },
    isSelectRow(item) {
      const activeClass = item.USER_AUTHRT_DLGT_ID === this.SELECTED_ROW.USER_AUTHRT_DLGT_ID ? "active" : "";
      return activeClass;
    },
    selectGridRow( item ) {
      this.SELECTED_ROW = JSON.parse(JSON.stringify(item))/*DeepCopy*/;
      console.log( "***** this.SELECTED_ROW::",this.SELECTED_ROW );
    },
    regForm() {
      this.initForm();
      if( this.computedUserDetailType === 'TEAM_LEADER' ) {
        this.SELECTED_ROW.DLGT_USER_ID = this.user_id;
        this.selectDesabled1 = true;
      }else {
        this.selectDesabled1 = false;
      }
    },
    del() {
      if( this.mixin_isEmpty(this.SELECTED_ROW.USER_AUTHRT_DLGT_ID) ) {
        this.showAlertCaution({msg:'삭제할 목록을 선택하세요.'});
        return;
      }
      this.showConfirmInfo({msg : '선택한 위임정보를 삭제하시겠습니까?', callYes: ()=>{
          this.delProcess();
          this.closeAlert();
        },
        callNo: this.closeAlert
      })
    },
    async delProcess() {
      let sUrl = '/api/biz/common/update/deleteUserAuthrtDlgt';
      let headParam = {head:{ns : 'lhcs.system.user.dao.UserMapper'}};
      let postParam = this.SELECTED_ROW;
      const response = await this.common_postCall(sUrl, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg:'처리되었습니다.'});
        this.initForm();
        this.selectGridList();
      }else {
        this.showToastInfo({msg:'실패하였습니다.'});
      }
    },
    save() {
      if( this.mixin_isEmpty(this.SELECTED_ROW.DLGT_USER_ID) ) {
        this.showAlertCaution({msg:'위임자를 선택하세요.'});
        return;
      }
      if( this.mixin_isEmpty(this.SELECTED_ROW.USER_ID) ) {
        this.showAlertCaution({msg:'위임 받는자를 선택하세요.'});
        return;
      }
      if( this.mixin_isEmpty(this.SELECTED_ROW.BGNG_DT_DD) || this.mixin_isEmpty(this.SELECTED_ROW.END_DT_DD) ) {
        this.showAlertCaution({msg:'위임기간을 선택하세요.'});
        return;
      }

      let msg = "수정하시겠습니까?";
      if( this.mixin_isEmpty(this.SELECTED_ROW.USER_AUTHRT_DLGT_ID) ) msg = "선택한 기간동안 권한이 위임됩니다. 저장하시겠습니까?";
      this.showConfirmInfo({msg : msg, callYes: ()=>{
          this.saveProcess();
          this.closeAlert();
        },
        callNo: this.closeAlert
      })

    },
    async saveProcess() {
      let sUrl = '/api/biz/common/update/updateUserAuthrtDlgt';
      if( this.mixin_isEmpty(this.SELECTED_ROW.USER_AUTHRT_DLGT_ID) ) sUrl = '/api/biz/common/insert/insertUserAuthrtDlgt';
      let headParam = {head:{ns : 'lhcs.system.user.dao.UserMapper',seq_key : 'USER_AUTHRT_DLGT_ID'}};
      let postParam = this.SELECTED_ROW;
      postParam.BGNG_DT_DD = postParam.BGNG_DT_DD.replaceAll("-","")+"000000";
      postParam.END_DT_DD = postParam.END_DT_DD.replaceAll("-","")+"235959";
      const response = await this.common_postCall(sUrl, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg:'처리되었습니다.'});
        this.initForm();
        this.selectGridList();
      }else {
        this.showToastInfo({msg:'실패하였습니다.'});
      }
    },
    async selectTeamLeaderList() {
      let responseData = [];
      let sURL ='/api/biz/common/select/selectUserAuthrtDlgtMngTeamLEader';
      let postParam = {}
      let headParam = {head : {ns : 'lhcs.system.user.dao.UserMapper'}}
      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        responseData = response.DATA;
      }
      return responseData;
    },
    comboTeamLeaderList(strHeadText) {
      let responseData = [];
      if (strHeadText != "" && strHeadText != undefined) {
        responseData.push({ text: strHeadText, value: "" });
      }
      for (let i = 0; i < this.combo_leader_list.length; i++) {
        responseData.push({
          text: this.combo_leader_list[i].USER_NM + " ("+ this.combo_leader_list[i].DEPT_NM +")",
          value: this.combo_leader_list[i].USER_ID,
        });
      }
      return responseData;
    },
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>