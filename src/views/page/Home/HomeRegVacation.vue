<template>
  <div class="">
    <!-- top -->
    <div class="d-flex">
      <div class="">
        <img :src="USER_PROFILE.IMG" :alt="USER_PROFILE.USER_NM" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}" style="width: 100%;max-width: 40px; border-radius: 50%;" />
      </div>
      <div class="pl-top-profile-dialog-desc-wrap ml-3">
        <strong style="font-size: 15px">{{ USER_PROFILE.USER_NM }}</strong>
        <span class="is-txt-sub ml-1">{{ (USER_PROFILE.JBPS_CD_NM!= '' && USER_PROFILE.JBPS_CD_NM!= '-')?USER_PROFILE.JBPS_CD_NM:USER_PROFILE.atrtGroupNm }}</span>
        <div>
          <span v-if="USER_PROFILE.DEPT_NM === USER_PROFILE.CUSTCO_NM"> {{ USER_PROFILE.DEPT_NM }} </span>
          <span v-if="USER_PROFILE.DEPT_NM !== USER_PROFILE.CUSTCO_NM"> {{ USER_PROFILE.CUSTCO_NM }}-{{ USER_PROFILE.DEPT_NM }} </span>
        </div>
      </div>
      <v-btn @click="closeModal()" plain min-width="22" height="22" class="pl-tooltip-btn ml-auto" >
        <v-icon
          small
          class="pl-icon20 dialog-close-black">
        </v-icon>
      </v-btn>
    </div>
    <!-- content -->
    <div class="is-border-sub-top py-3 mt-3">
      <div class="spacing-wrap sp-8 flex-column">
        <div class="d-flex align-center">
          <v-icon class="pl-icon20 document" style="flex: 0 0 20px"></v-icon>
          <strong class="ml-1" style="flex: 0 0 80px">휴가 유형</strong>
          <div class="spacing-wrap sp-4">
            <v-select class="pl-form type-middle"
                      v-model="FORMDATA.WKATTD_ARTCL_CLSF_CD"
                      :items="common_vocation_clsf_code"
                      placeholder="선택"
            />
            <v-select class="pl-form type-middle"
                      style="width: auto;"
                      v-model="FORMDATA.WKATTD_ARTCL_CD"
                      return-object
                      :items="mixin_wkattd_code_get(common_vocation_wkattd_code, FORMDATA.WKATTD_ARTCL_CLSF_CD, '')"
                      placeholder="선택" ></v-select>
          </div>
        </div>
        <div class="d-flex align-center">
          <v-icon style="flex: 0 0 20px" class="pl-icon20 date-simple"></v-icon>
          <strong class="ml-1" style="flex: 0 0 80px">신청일</strong>
          <compo-date-range-picker
              :IsViewDropPickerProp=false
              :StartDayProp.sync="FORMDATA.BGNG_YMD"
              :EndDayProp.sync="FORMDATA.END_YMD"
              @startDayChange="mixin_testLog(FORMDATA.BGNG_YMD)"
              @endDayChange="mixin_testLog(FORMDATA.END_YMD)"
          />
        </div>
        <div class="is-border-sub-top mt-1 pt-3">
          <div class="spacing-wrap sp-8 flex-column">
            <div class="d-flex ">
              <v-icon class="pl-icon20 tit-paragraph" style="flex: 0 0 20px"></v-icon>
              <strong style="flex: 0 0 80px;">사유</strong>
              <v-textarea
                class="pl-form is-noresize"
                :spellcheck="false"
                v-model="FORMDATA.DMND_RSN"
                placeholder="사유를 입력하세요."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeRegVacation', //휴가신청
  components: {
  },
  data() {
    return {

      common_code:[],
      common_vocation_clsf_code:[], //근태유형_휴가용 추출.
      common_vocation_wkattd_code:[], //근태코드
      USER_PROFILE:this.$store.getters["userStore/GE_USER_ROLE"],
      FORMDATA:{
        WKATTD_ARTCL_CLSF_CD:'',
        WKATTD_ARTCL_CD:'',
        BGNG_YMD:this.$moment(new Date()).format('YYYY-MM-DD'),
        END_YMD:this.$moment(new Date()).format('YYYY-MM-DD'),
        DMND_RSN:'',
        STTS_CD:'',
      },

      date1: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      timeStep1: '05:50',
      timeAmpm1: '오후',
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      timeStep2: '05:50',
      timeAmpm2: '오후',

    }
  },
  methods: {
    initData() {
      this.FORMDATA = {
        WKATTD_ARTCL_CLSF_CD:'',
        WKATTD_ARTCL_CD:'',
        BGNG_YMD:this.$moment(new Date()).format('YYYY-MM-DD'),
        END_YMD:this.$moment(new Date()).format('YYYY-MM-DD'),
        DMND_RSN:'',
        STTS_CD:'',
      };
    },

    eventCloseModal() {
      this.closeModal();
    },
    closeModal(){
      this.initData();
      this.$store.commit("alertStore/hideAlert");
      this.$emit('Close');
    },
    async eventSaveVacationInfo() {
      console.log("eventSaveVacationInfo");
      if( this.mixin_isEmpty(this.FORMDATA.WKATTD_ARTCL_CLSF_CD) || this.mixin_isEmpty(this.FORMDATA.WKATTD_ARTCL_CD) ) {
        this.showAlertCaution({msg : '휴가 유형을 선택하세요.'});
        return;
      }
      if( this.mixin_isEmpty(this.FORMDATA.BGNG_YMD) || this.mixin_isEmpty(this.FORMDATA.END_YMD)) {
        this.showAlertCaution({msg : '신청일을 선택하세요.'});
        return;
      }
      if( this.mixin_isEmpty(this.FORMDATA.DMND_RSN) ) {
        this.showAlertCaution({msg : '사유를 입력하세요.'});
        return;
      }

      //신청테이블에 같은날짜에 요청이 있는경우
      let responseAply = await this.checkAplyInVacation();
      if (responseAply.HEADER.TOT_COUNT > 0) {
        let msg = '신청기간내에  "' + responseAply.DATA[0].WKATTD_ARTCL_NM + '('+ responseAply.DATA[0].BGNG_YMD +'~'+responseAply.DATA[0].END_YMD+')" 이 신청되어 있습니다.\n 휴가신청현황에서 요청을 회수하고 다시 신청하시기 바랍니다.';
        this.showAlertCaution({msg : msg});
        return

      }

      let responseAtndn = await this.checkAtndnInVacation();
      if (responseAtndn.HEADER.TOT_COUNT > 0) {
        let msg = '"' + responseAtndn.DATA[0].APLCN_YMD_DD +'" 에 "' + responseAtndn.DATA[0].WKATTD_ARTCL_NM + '" 이 근태정보에 등록되어 있습니다.\n무시하고 신청하시겠습니까?\n주의) 승인되는경우 현재내용으로 덮어씁니다.';
        if( responseAtndn.HEADER.TOT_COUNT > 1) {
          msg = '신청기간내에 "' + responseAtndn.DATA[0].APLCN_YMD_DD +' , ' + responseAtndn.DATA[0].WKATTD_ARTCL_NM + '" 외 '+ (responseAtndn.HEADER.TOT_COUNT - 1) +'건이 근태정보에 등록되어 있습니다.\n무시하고 신청하시겠습니까?\n주의) 승인되는경우 현재내용으로 덮어씁니다.';
        }
        this.showConfirmInfo({msg: msg
          , callYes: this.saveVacationInfoProcess
          , callNo: this.closeAlert});

      }else {
        this.showConfirmInfo({msg: '신청 하시겠습니까?\n 주의) 선택한 신청일은 ('+ this.FORMDATA.BGNG_YMD +'~'+this.FORMDATA.END_YMD+') 입니다. '
          , callYes: this.saveVacationInfoProcess
          , callNo: this.closeAlert});
      }
    },

    //근태에 해당일자에 휴가관련여부 확인.
    async checkAtndnInVacation() {

      let sURL = '/api/biz/common/select/selectAtndnInVacation';
      let postParam = {};
      postParam.SRCH_USER_ID = this.user_id;
      postParam.BGNG_YMD = this.FORMDATA.BGNG_YMD.replaceAll("-","");
      postParam.END_YMD = this.FORMDATA.END_YMD.replaceAll("-","");

      let headParam = {head: {"ns": 'lhcs.system.user.dao.AtndnMapper'}};
      return await this.common_postCall(sURL, postParam, headParam);
    },

    //신청테이블에 해당일자에 휴가관련여부 확인.
    async checkAplyInVacation() {

      let sURL = '/api/biz/common/select/selectAplyInVacation';
      let postParam = {};
      postParam.SRCH_USER_ID = this.user_id;
      postParam.BGNG_YMD = this.FORMDATA.BGNG_YMD.replaceAll("-","");
      postParam.END_YMD = this.FORMDATA.END_YMD.replaceAll("-","");

      let headParam = {head: {"ns": 'lhcs.system.user.dao.AtndnMapper'}};
      return await this.common_postCall(sURL, postParam, headParam);

    },

    async saveVacationInfoProcess() {
      let sURL = '/api/lhcs/system/user/hldyaply/insertUserHldyAply';
      let postParam = {};
      postParam.SRCH_USER_ID = this.user_id;
      postParam.SRCH_USER_NM = this.user_name;
      postParam.SRCH_DEPT_ID = this.computedUserDeptId;
      postParam.SRCH_CENTER_DEPT_ID = this.computedUserCenterDeptId;
      postParam.WKATTD_ARTCL_CD = this.FORMDATA.WKATTD_ARTCL_CD.value;
      postParam.WKATTD_ARTCL_NM = this.FORMDATA.WKATTD_ARTCL_CD.text;
      postParam.BGNG_YMD = this.FORMDATA.BGNG_YMD.replaceAll("-","");
      postParam.END_YMD = this.FORMDATA.END_YMD.replaceAll("-","");
      postParam.DMND_RSN = this.FORMDATA.DMND_RSN;
      postParam.STTS_CD = 'ISMAMVST001'; //MVST :: ISMAMVST001:요청, ISMAMVST002:완료, ISMAMVST003:반려

      let headParam = {};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg : '정상적으로 신청하였습니다. 승인완료된 경우에는 근태에서 확인할 수 있습니다.' , type:'bottom' , callAfter : ()=>{
            this.closeModal();
            this.mixin_reloadCuttStat('USER_APLY_PROC_STAT');
        }});
      }
    },

    //휴가코드 조회
    async vocationClsfCode( codes ) {
      let responseData = [];
      if (codes && typeof codes === "object") {
        for (let i = 0; i < codes.length; i++) {
          if (codes[i].group_cd === 'ATDC_TP') {
            for (let a = 0; a < codes[i].group_value.length; a++) {
              if (codes[i].group_value[a].CD_VL4 === 'Y') {
                responseData.push({
                  text: this.mixin_decode(codes[i].group_value[a].CD_NM), //공통코드명 특수문자 decode
                  value: codes[i].group_value[a].CD,
                  cd_vl: codes[i].group_value[a].CD_VL,
                  cd_vl1: codes[i].group_value[a].CD_VL1,
                  cd_vl2: codes[i].group_value[a].CD_VL2,
                  cd_vl3: codes[i].group_value[a].CD_VL3,
                  cd_vl4: codes[i].group_value[a].CD_VL4,
                });
              }
            }
          }
        }
      }
      return responseData;
    }
  },
  mounted() {

  },
  async created() {
    //공통코드설정
    let codeName = ['ATDC_TP'/* 근태그룹코드 */];
    this.common_code = await this.mixin_common_code_get_all(codeName);
    this.common_vocation_clsf_code = await this.vocationClsfCode( this.common_code );
    this.common_vocation_wkattd_code = await this.mixin_wkattd_code_list(); //근태코드
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>