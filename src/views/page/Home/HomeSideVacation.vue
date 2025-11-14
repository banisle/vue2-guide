<template>
  <div>
    <!-- list top -->
    <div class="pl-card pb-0">
      <!-- search -->
      <div class="pl-rounded-box">
        <div class="pl-form-inline-wrap px-5 pt-3">
          <div class="pl-selection-row">
            <v-checkbox v-model="SRCH_PARAMS_TOP.SRCH_ISMAMVST001" :label="`요청 (${ countBySttsCd['요청'] })`" class="pl-check" @change="selectGridList"></v-checkbox>
            <v-checkbox v-model="SRCH_PARAMS_TOP.SRCH_ISMAMVST002" :label="`승인완료 (${ countBySttsCd['승인완료'] })`" class="pl-check" @change="selectGridList"></v-checkbox>
            <v-checkbox v-model="SRCH_PARAMS_TOP.SRCH_ISMAMVST003" :label="`반려 (${ countBySttsCd['반려'] })`"  class="pl-check" @change="selectGridList"></v-checkbox>
          </div>
        </div>
        <div class="pl-form-inline-wrap px-5 py-3 is-border-top">
          <div class="pl-form-inline">
            <span class="pl-label">
              조회 기간
            </span>
            <div class="pl-desc">
              <compo-date-range-picker
                :StartDayProp.sync="SRCH_PARAMS_TOP.SRCH_ST"
                :EndDayProp.sync="SRCH_PARAMS_TOP.SRCH_END"
                @startDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_ST)"
                @endDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_END)"
              />
            </div>
            <v-btn class="pl-btn" @click="selectGridList">조회</v-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex align-center is-mt-s px-5">
      <span class="pl-label">전체 (<span class="is-txt-blue">{{ GRID.ITEMS.length }}</span>)건</span>
      <compo-tooltip-btn
        TitleProp="새로고침"
        ClassProp="pl-tooltip-btn ml-auto"
        IconProp="pl-icon20 refresh"
        TooltipPositionProp="bottom"
        @btnClick="selectGridList"
      ></compo-tooltip-btn>
    </div>
    <!-- list -->
    <div
      style="height: calc(100vh - 320px);"
      class="pl-notice-list is-mt-s type-acco is-border-top pl-scroll-body">
      <div
        class="pl-notice-list--unit"
        v-for="item in GRID.ITEMS"
        :key="item.ID">
        <div
          @click="item.active = !item.active"
          :class="`d-flex align-center acco-title active-${item.active}`">
          <img :src="item.IMG" :alt="item.USER_NM" style="width: 30px; max-height: 35px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
          <div class="ml-3">
            <div class="d-flex align-center">
              <strong style="font-size: 14px">{{ item.USER_NM }}</strong>
              <span class="ml-2 is-txt-sub pr-2 is-border-sub-right">{{ item.CUSTCO_NM }} - {{ item.DEPT_NM }}</span>
              <div class="ml-2">
                <strong>{{ item.WKATTD_ARTCL_NM }}</strong>
              </div>
            </div>
            <div class="d-flex align-center">
              <v-icon class="pl-icon20 calendar-date"></v-icon>
              <span class="ml-1">신청일:{{ item.BGNG_YMD_DD }} ~ {{ item.END_YMD_DD }}</span>
              <span class="ml-2 is-txt-sub pr-2 is-border-sub-right">(요청일:{{ item.REG_DT }})</span>
            </div>
            <div class="d-flex ">
              <v-icon
                class="flex-shrink-0 pl-icon20 tit-paragraph"></v-icon>
              <span class="ml-1">{{ item.DMND_RSN }}</span>
              <span class="is-pl-25">
                 <v-btn v-if="item.STTS_CD === 'ISMAMVST001' && user_id === item.USER_ID" class="pl-btn is-sub is-sm " width="62" @click="confirmRejectAply( 'delete', item )">회수하기</v-btn>
              </span>
            </div>
          </div>
          <div class="ml-auto">
            <span
              style="min-width: 62px;"
              :class="`pl-badge ${ mixin_displayStatus(item.STTS_CD_NM, 'STAT_LIST') }`">
              {{ item.STTS_CD_NM }}</span>
          </div>
        </div>
        <div v-if="item.active"
          class="d-flex align-center is-mt-s ml-11 mr-2"
          >
          <div style="flex: 0 1 370px">
            <v-textarea v-if="item.STTS_CD === 'ISMAMVST001' && computedUserType !== 'MANAGER'"
              class="pl-form is-noresize" :spellcheck="false" v-model="item.RJCT_RSN"
              placeholder="승인 또는 반려 사유를 입력하십시오."
            />

            <span v-if="item.STTS_CD !== 'ISMAMVST001'" >
              <span class="ml-1">처리자 메모 : {{ item.RJCT_RSN }}</span><br/>
              <span class="ml-1">
                처리자 : {{item.PRCR_ID_NM}}
                <span class="ml-2 is-txt-sub pr-2 is-border-sub-right">({{ item.PRCS_DT }})</span>
              </span>

            </span>
          </div>
          <div class="d-flex flex-column align-center flex-grow-1 ml-2 " v-if="item.STTS_CD === 'ISMAMVST001' && computedUserType !== 'MANAGER'">
            <v-btn class="pl-btn is-esp is-sm" width="62" @click="confirmRejectAply( 'confirm',item )">승인</v-btn>
            <v-btn class="pl-btn is-sub is-sm is-mt-s" width="62" @click="confirmRejectAply( 'reject', item )">반려</v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "HomeSideVacation", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      SRCH_PARAMS_TOP : {
        SRCH_ISMAMVST001: true,
        SRCH_ISMAMVST002: true,
        SRCH_ISMAMVST003: true,
        SRCH_ST: this.$moment(new Date()).subtract(365,'days').format('YYYY-MM-DD'),
        SRCH_END: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_TODAY: this.$moment(new Date()).format('YYYY-MM-DD'),
      },
      GRID:{
        ITEMS:[],
      },
      STAT_LIST: [
        { code: '요청', value: 'is-yellow'},
        { code: '승인완료', value: 'is-green'},
        { code: '반려', value: 'is-red'},
      ],
    }
  },
  methods: {
    async selectGridList() {
      //리더 - 휴가신청현황조회
      let sURL = '/api/lhcs/system/user/hldyaply/selectTeamLeaderHldyAplyList';
      let postParam = {};
      postParam.SRCH_USER_DETAIL_TYPE = this.computedUserDetailType;
      postParam.SRCH_CUSTCO_ID = this.computedUserCenter;
      postParam.SRCH_USER_ID = this.user_id;
      postParam.SRCH_DEPT_ID = this.computedUserDeptId;
      postParam.SRCH_STTS_CDS = '';
      if( this.SRCH_PARAMS_TOP.SRCH_ISMAMVST001 ) postParam.SRCH_STTS_CDS += ",ISMAMVST001";
      if( this.SRCH_PARAMS_TOP.SRCH_ISMAMVST002 ) postParam.SRCH_STTS_CDS += ",ISMAMVST002";
      if( this.SRCH_PARAMS_TOP.SRCH_ISMAMVST003 ) postParam.SRCH_STTS_CDS += ",ISMAMVST003";
      if( this.mixin_isEmpty( postParam.SRCH_STTS_CDS ) ) {
        this.showAlertCaution({msg: '검색구분 하나이상을 선택하세요.'});
        return;
      }
      postParam.SRCH_STTS_CDS = postParam.SRCH_STTS_CDS.substring(1);

      console.log( postParam.SRCH_STTS_CDS );

      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");

      let headParam = {};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        let responseData = response.DATA;
        let i = 0;
        responseData.map(item => {
          if( item.ICON_IMG_URI !== '/' ) {
            responseData[i]["IMG"] = '/upload/' + item.ICON_IMG_URI;
          }else {
            responseData[i]["IMG"] = require('@/assets/img/@manager_profile_default.png');
          }
          responseData[i]["active"] = false;

          return i++;
        });
        this.GRID.ITEMS = [];
        this.GRID.ITEMS = [...this.GRID.ITEMS, ...responseData];
      }
    },

    async confirmRejectAply( type, obj ) {
      let msg = "승인처리 하시겠습니까?";
      if( type === 'reject' ) {
        msg = "반려처리 하시겠습니까?";
      }else if( type === 'delete' ) {
        msg = "선택한 신청정보를 회수처리 하시겠습니까?";
      }

      this.showConfirmInfo({msg: msg, callYes:()=>{this.confirmRejectAplyProcess( type, obj)}, callNo:()=>{this.$store.commit("alertStore/hideAlert")}});
    },
    async confirmRejectAplyProcess( type, obj ) {
      let sURL = '/api/lhcs/system/user/hldyaply/confirmRejectUserHldyAply';
      let postParam = {};
      postParam.SRCH_CENTER_DEPT_ID = this.computedUserCenterDeptId;
      postParam.SRCH_DEPT_ID = this.computedUserDeptId;
      postParam.USER_HLDY_APLY_ID = obj.USER_HLDY_APLY_ID;
      postParam.WKATTD_ARTCL_CD = obj.WKATTD_ARTCL_CD;
      postParam.WKATTD_ARTCL_NM = obj.WKATTD_ARTCL_NM;
      postParam.SRCH_USER_ID = obj.USER_ID;
      postParam.SRCH_USER_NM = obj.USER_NM;
      postParam.SRCH_ST = obj.BGNG_YMD;
      postParam.SRCH_END = obj.END_YMD;
      if( type === 'reject' ) {
        postParam.STTS_CD = 'ISMAMVST003';
      }else if( type === 'delete' ) {
        postParam.STTS_CD = 'delete'; //회수
      }else {
        postParam.STTS_CD = 'ISMAMVST002';
      }
      postParam.RJCT_RSN = obj.RJCT_RSN;
      postParam.PRCR_ID = this.user_id;

      let headParam = {};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg : '정상 처리 되었습니다. ', type:'bottom'});
        this.selectGridList();
        this.mixin_reloadCuttStat('USER_APLY_PROC_STAT');
        this.$eventBus.$emit('reloadHomeTab3Search');
        this.$store.commit("alertStore/hideAlert");
      }else {
        this.$store.commit("alertStore/hideAlert");
      }
    },
  },
  mounted() {
  },
  created() {
    this.selectGridList();

    //상담사 event
    this.$eventBus.$on("eventSideVacation", (e) => {
      if (e !== undefined || !this.mixin_isEmpty(e)) {
        this.selectGridList(); //신청현황 조회
      }
    });
  },
  beforeDestroy(){
    this.$eventBus.$off("eventSideVacation"); //eventBus 중복방지를 위해 off
  },
  computed: {
    countBySttsCd() {
      const statCount = this.GRID.ITEMS.reduce((acc, item) => {
        if (item.STTS_CD_NM === '요청') {
          acc['요청']++;
        }else if (item.STTS_CD_NM === '승인완료') {
          acc['승인완료']++;
        }else {
          acc['반려']++;
        }
        return acc;
      }, { 요청: 0, 승인완료: 0, 반려: 0 });
      return statCount;
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>