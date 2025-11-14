<template>
  <div class="pl-container type-mainphone2">
    <!-- //mark: - 공통(마이홈, 공가해소, 전세임대, 주택지원센터) Start-->
    <template v-if="(SCH_CUSTCO_ID === '1' || SCH_CUSTCO_ID === '2' || SCH_CUSTCO_ID === '3' || SCH_CUSTCO_ID === '5')">
      <div class="d-flex flex-wrap" style="gap: 24px">
        <div class="d-flex flex-column" style="flex: 1 1 45%; gap: 15px">
          <!-- //mark: 고객정보 -->
          <CompoInfoCust :popData = "popData" @setCustInfo="setCustInfo" @allReSet="allReSet" :RESET_ABLE="RESET_ABLE" :detailYn="detailYn" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"/>
          <!-- //mark: 계약정보 -->
          <CompoInfoAsContract :RESET_ABLE="RESET_ABLE" :detailYn="detailYn" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"/>
        </div>
        <!-- 상담정보 -->
        <CompoInfoCutt
          :popData = "popData"
          :CUST_INFO = "popData"
          :CHG_CUTT_CN="CUTT_CN"
          :RESET_ABLE="RESET_ABLE"
          :detailYn="detailYn"
          :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
          @sendCuttCn="getCuttCn"
          @setCuttFormEditAble="cuttFormStat"/>
      </div>
      <!-- //mark: 관심지역  -->
      <CSL_M0100_FAVORITE
        @toggleEvt = "toggleFav"
        :propToggle="favToggle"
        :cuttEditAble="editAble"
        :CUTT_CN="CUTT_CN"
        :RESET_ABLE="RESET_ABLE"
        :detailYn="detailYn"
        :popData = "popData"
        @addCuttCn="addCuttCn" />
      <!-- //mark: 상담이력 grid -->
      <CompoInfoHist
        :class="`is-mt-l flex-grow-1 favToggle-${favToggle}`"
        :RESET_ABLE="RESET_ABLE"
        :detailYn="detailYn"
        :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
      />
    </template>
    <!-- //mark: - 공통(마이홈, 공가해소, 전세임대, 주택지원센터) End -->

    <!-- //mark: 바로처리센터(인바운드) Start -->
    <template v-if="SCH_CUSTCO_ID === '4'">
      <div class="d-flex flex-wrap" style="gap: 24px">
        <div class="d-flex flex-column" style="flex: 1 1 45%; gap: 16px">
          <!-- //mark: 고객정보 -->
          <CompoInfoCust :popData = "popData" @setCustInfo="setCustInfo" @allReSet="allReSet" :RESET_ABLE="RESET_ABLE" :detailYn="detailYn" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"/>
          <!-- //mark: 계약정보 -->
          <CompoInfoAsContract :RESET_ABLE="RESET_ABLE" :detailYn="detailYn" :SCH_CUSTCO_ID="SCH_CUSTCO_ID"/>
        </div>
        <!-- //mark: 상담정보 -->
        <CompoInfoAsCutt
          @setSavedAsCuttInfo="setSavedAsCuttInfo"
          :RESET_ABLE="RESET_ABLE"
          :DataProp="popData"
          :detailYn="detailYn"
        />
      </div>
      <!-- //mark: AS 접수 -->
      <CompoInfoAsFlwAcp
        class="is-mt-l"
        :SavedAsCuttInfoProp="SAVED_AS_CUTT_INFO"
        :RESET_ABLE="RESET_ABLE"
        :detailYn="detailYn"
        />
      <!-- //mark: 상담이력 grid -->
      <CompoInfoHist
        :class="`is-mt-l flex-grow-1 favToggle-${favToggle}`"
        :RESET_ABLE="RESET_ABLE"
        :detailYn="detailYn"
        :SCH_CUSTCO_ID="SCH_CUSTCO_ID"
        />
    </template>
    <!-- //mark: 바로처리센터(인바운드) End -->
  </div>
</template>
<script>
// 컴포넌트
import CompoAsScheduler from '@/components/csl/CompoAsScheduler.vue'
import CompoAsSchedulerMobile from '@/components/csl/CompoAsSchedulerMobile.vue'
import CompoInfoCust from '@/components/csl/CompoInfoCust.vue'
import CompoInfoAsContract from '@/components/csl/CompoInfoAsContract.vue'
import CompoInfoCutt from '@/components/csl/CompoInfoCutt.vue'
import CSL_M0100_FAVORITE from './CSL_M0100_FAVORITE.vue'
import CompoInfoHist from '@/components/csl/CompoInfoHist.vue'
import CompoInfoAsCutt from '@/components/csl/CompoInfoAsCutt.vue'
import CompoInfoAsFlwAcp from '@/components/csl/CompoInfoAsFlwAcp.vue'


export default {
  name: "MENU_CSL_M0100_DETAIL", // 전화상담
  props: {
    popData: {
      type: Object,
    },
    SCH_CUSTCO_ID: {
      type: String,
      default: '1'
    }
  },
  components: {
    CompoAsScheduler,
    CompoAsSchedulerMobile,
    CompoInfoCust,
    CompoInfoAsContract,
    CompoInfoCutt,
    CSL_M0100_FAVORITE,
    CompoInfoHist,
    CompoInfoAsCutt,
    CompoInfoAsFlwAcp,
  },
  data(){
    return{
      USER_ID: this.$store.getters["userStore/GE_USER_ROLE"].userId,

      // 관심지역 toggle
      // favToggle: true,
      favToggle: this.$store.getters["commonStore/GE_COMMON_CUTT_FAVORIT_HIDE_SHOW"],

      //상담 등록 가능 여부
      editAble : false,

      //입력된 상담메모
      CUTT_CN : '',

      //바로처리 상담 저장 정보
      SAVED_AS_CUTT_INFO: {},

      // 실시간 대화록
      isRealtimeScroll:true,
      dialogRealTalkLog: false,
      RTtoggle: false,

      CUST_INFO : {}, //선택된 고객 정보
      RESET_ABLE : false, //전체 초기화 여부

      detailYn : true, //상세보기
    }
  },
  computed: {
  },
  watch: {
  },
  mounted(){
  },
  beforeDestroy(){
    this.$eventBus.$off("setChgCustcoId");
  },
  async created() {
    this.$eventBus.$on("setChgCustcoId", (CUSTCO_ID) => {
      this.SCH_CUSTCO_ID = CUSTCO_ID;
    });
  },
  methods: {
    toggleFav(){
      this.favToggle = !this.favToggle
    },
    //상담정보 입력 폼 입력 가능 여부 셋
    cuttFormStat(data){
      this.editAble = data;
    },
    //관심지역 등록, 수정시 상담정보 입력 폼 상담메모 내용 추가
    addCuttCn(data){
      this.CUTT_CN = data;
    },
    //상담메모 input 이벤트
    getCuttCn(data){
      this.CUTT_CN = data;
    },

    //바로처리 상담 저장 후, 상담 저장 정보를 AS 접수 컴포넌트로 전송
    setSavedAsCuttInfo(item) {
      this.SAVED_AS_CUTT_INFO = item;
    },

    //선택된 고객 정보 Set
    setCustInfo(item) {
      this.CUST_INFO = item;
    },

    //전체 초기화
    allReSet() {
      this.RESET_ABLE = !this.RESET_ABLE;
    }
  }

}
</script>

<style lang="scss" scoped>

</style>