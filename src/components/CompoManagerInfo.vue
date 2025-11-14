<template>
  <div class="d-flex flex-column">
    <!-- 상담사 -->
    <template v-if="TypeProp === 'CS'">
      <div class="d-flex" style="position: relative;">
        <div style="flex: 0 0 40px">
          <img :src="CUSL_INFO.IMG" :alt="CUSL_INFO.USER_NM" style="border-radius: 50%;width: 45px;height:45px" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}" />
        </div>
        <div class="ml-4">
          <div >
            <strong style="font-size: 14px">{{ CUSL_INFO.CUSL_NM }}</strong>
            <span class="ml-2 is-txt-sub">{{ CUSL_INFO.CUSL_CUSTCO_NM + '-' + CUSL_INFO.CUSL_DEPT_NM }}</span></div>
          <div class="spacing-wrap sp-16">
            <div>
              <strong>접수일</strong>
              <span class="ml-2">{{ CUSL_INFO.REG_DT ? mixin_convertDate(CUSL_INFO.REG_DT.replace(/[^0-9]/g, ''), 'yyyy-MM-dd HH:mm:ss') : '' }}</span>
            </div>
            <div>
              <strong>처리일</strong>
              <span class="ml-2">{{ CUSL_INFO.PRCS_DT ? mixin_convertDate(CUSL_INFO.PRCS_DT.replace(/[^0-9]/g, ''), 'yyyy-MM-dd HH:mm:ss') : '' }}</span>
            </div>
          </div>
        </div>
        <div style="position: absolute; right: 0; top: 0;" v-if="!mixin_isEmpty(mixin_isEmpty(CUSL_INFO.PRCS_STTS_NM)?CUSL_INFO.PRCS_CHN_NM:CUSL_INFO.PRCS_STTS_NM)">
          <!-- <span :class="`pl-badge ${ DataProp.PROFILE.statusColor }`">{{ DataProp.PROFILE.status }}</span> -->
          <span class="pl-badge is-bg-green">{{ mixin_isEmpty(CUSL_INFO.PRCS_STTS_NM)?CUSL_INFO.PRCS_CHN_NM:CUSL_INFO.PRCS_STTS_NM }}</span>
        </div>
      </div>
    </template>
    <template v-if="TypeProp === 'COACH'">
      <div class="d-flex" style="position: relative;">
        <div style="flex: 0 0 40px">
          <img :src="CUSL_INFO.ICON_IMG_URI" :alt="CUSL_INFO.USER_NM" style="border-radius: 50%;width: 100%" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}" />
        </div>
        <div class="ml-4">
          <div >
            <strong style="font-size: 14px">{{ CUSL_INFO.CUSL_NM }}</strong>
            <span class="ml-1 is-txt-sub">{{ CUSL_INFO.CUSL_CUSTCO_NM + '-' + CUSL_INFO.CUSL_DEPT_NM }}</span></div>
          <div class="spacing-wrap sp-16">
            <div>
              <strong>코칭일시</strong>
              <span class="ml-2">{{ DataProp.PROFILE.coach_date }}</span>
            </div>
            <div>
              <strong>확인일시</strong>
              <span class="ml-2">{{ DataProp.PROFILE.confirm_date }}</span>
            </div>
          </div>
        </div>
        <div style="position: absolute; right: 0; top: 0;">
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close-black"
            TooltipPositionProp="bottom"
            @btnClick="close()"
          ></compo-tooltip-btn>
        </div>
      </div>
    </template>

    <!-- 고객정보 -->
    <div class="is-mt-m pt-4 is-border-sub-top">
      <h3 class="pl-subtit ">고객정보&nbsp;&nbsp;&nbsp;&nbsp;
        <!-- <v-btn class="pl-btn is-sub is-sm" @click="setCustCuttInfo(CUSL_INFO)">상담이력 보기</v-btn> -->
      </h3>
      
      <div class="is-mt-m">
        <div class="pl-vertical-list type-2">
          <div
            class="pl-vertical-list--unit px-0"
            v-for="item in CUST_INFO"
            :key="item.id">
            <v-icon :class="`pl-icon20 ${ item.icon }`"></v-icon>
            <strong class="ml-1" style="flex: 0 0 70px">{{ item.title }}</strong>
            <span class="ml-2">{{ (item.val) ? item.telYn ? mixin_setPhoneNo(item.val) : item.val : '' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "CompoManagerInfo", //name은 'MENU_' + 파일명 조합
  components: {
  },
  props: {
    DataProp : {
      type: Object,
    },
    TypeProp: {
      type: String,
      default: 'CS'
    },
    popData : {
      type: Object,
    }
  },
  data() {
    return {
      CUST_INFO : [], //고객정보
      CUSL_INFO : {}, //상담사 정보
    }
  },
  computed: {
  },
  watch: {
    DataProp() {
      this.setCustInfo(this.DataProp);
    },
    popData() {
      this.setCustInfo(this.popData);
    }
  },
  mounted() {
  },
  beforeDestroy(){
    this.$eventBus.$off("setCuslCustInfo"); //eventBus 중복방지를 위해 off
  },
  created() {
    if(this.DataProp) this.setCustInfo(this.DataProp);
    
    if(this.popData) this.setCustInfo(this.popData);
    
    //상담 상세보기 DATA
    this.$eventBus.$on("setCuslCustInfo", (CUSL_CUST_INFO) => {
      this.setCustInfo(CUSL_CUST_INFO);
    });
    
  },
  methods: {
    close(){
      this.$emit('Close')
    },

    setCustInfo(CUSL_CUST_INFO){
      this.CUST_INFO = [
        { title:'인입번호', icon: 'cs-phone', val: CUSL_CUST_INFO.CUST_PHN_NO, telYn : true },
        { title:'휴대전화', val: CUSL_CUST_INFO.CUST_PHN_NO, telYn : true },
        { title:'전화번호1', val: CUSL_CUST_INFO.CUST_PHN_NO1, telYn : true },
        { title:'전화번호2', val: CUSL_CUST_INFO.CUST_PHN_NO2, telYn : true },
        { title:'전화번호3', val: CUSL_CUST_INFO.CUST_PHN_NO3, telYn : true },
        { title:'이메일', val: CUSL_CUST_INFO.EML },
        { title:'고객 ID', icon: 'cs-black', val: CUSL_CUST_INFO.CUST_IDNTF_NO },
        { title:'고객명', val: CUSL_CUST_INFO.CUST_NM },
      ]
      this.CUSL_INFO = CUSL_CUST_INFO;
    },

    setCustCuttInfo(item){
      item.CUST_NO = item.CUST_ID;
      item.PHN_CUTT_ID = '';
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
    }
  },
};
</script>

<style lang="scss" scoped>

</style>