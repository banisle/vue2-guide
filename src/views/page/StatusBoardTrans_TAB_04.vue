<template>
  <div>
    <!-- list top -->
    <div class="d-flex align-center is-mt-s px-5">
      <span class="pl-label">이첩회수 (<span class="is-txt-blue">{{ TRANS_TOT_CNT }}</span>)건</span>
      <compo-tooltip-btn
        TitleProp="새로고침"
        ClassProp="pl-tooltip-btn ml-auto"
        IconProp="pl-icon20 refresh"
        TooltipPositionProp="bottom"
        @btnClick="trnsfStatList"
      ></compo-tooltip-btn>
    </div>
    <!-- list -->
    <div
      style="height: calc(-262px + 100vh);"
      class="is-mt-s pl-notice-list is-border-top pl-scroll-body">
      <div
        class="pl-notice-list--unit"
        v-for="item in TRANS_LIST"
        @click="setCustCuttInfo(item)"
        :key="item.id">
        <div class="d-flex align-center">
          <!-- <img :src="item.img" :alt="item.name" style="max-width: 35px; max-height: 35px"> -->
          <img :src="item['ICON_URL'] !== '/'? '/upload/' + item['ICON_URL'] : require('@/assets/img/@manager_profile_default.png')" :alt="item['CUSL_NM']"  style="border-radius: 50%; max-width: 35px; max-height: 35px" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
          <div class="d-flex align-center flex-grow-1">
            <div class="ml-3">
              <div>
                <strong style="font-size: 14px">{{ item.CUSL_NM }}</strong>
                <span class="ml-2 is-txt-sub">{{ item.DEPT_NM }}</span>
              </div>
              <div >
                <span>회수일시 {{ mixin_convertDate(item.REG_DT, 'yyyy-MM-dd HH:mm:ss') }}</span>
              </div>
              <div v-if="item.CUST_NM">
                <span>고객정보 {{ (item.LAST_PHN_NO?mixin_setPhoneNo(item.LAST_PHN_NO.replace(/[^0-9]/g, "")):'') + (item.CUST_NM?'(' + item.CUST_NM + ')':'') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pl-list-nodata" v-if="TRANS_LIST.length === 0">
        <span>등록된 데이터가 없습니다.</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusBoardTrans_TAB_04', //이첩 회수
  components: {
  },
  data() {
    return {
      TRANS_LIST: [],
      TRANS_TOT_CNT : 0
    }
  },
  computed: {
  },
  watch: {
    callEvt() {
    }
  },
  mounted() {
  },
  created() {
    this.trnsfStatList();
  },
  methods: {
    async trnsfStatList(sState) {
      let postParam = {
        REQ_YN : 'N' //요청 여부(요청과 접수가 동일 코드 이기 때문에)
        , TRANS_TYPE : 'ISMATRDV003' //이첩회수
      };

      let headParam = {
        head: {
          ns: "lhcs.phone.cutt.dao.PhoneCuttMapper",
          sn: "trnsfStatList"
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/trnsfStatList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.TRANS_LIST = response.DATA;
        this.TRANS_TOT_CNT = response.HEADER.TOT_COUNT;
      }
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
          item.TEL_NO = item.LAST_PHN_NO;
          this.$eventBus.$emit('setCuttUnProcCustInfo', item);
        }, !m0100?1000:10);
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>