<template>
  <div class="pl-container type-mainphone2">
    <!-- //mark: - 공통(마이홈, 공가해소, 전세임대, 주택지원센터) Start-->
    <template v-if="(computedUserCenter === '1' || computedUserCenter === '2' || computedUserCenter === '3' || computedUserCenter === '5')">
      <div class="d-flex flex-wrap" style="gap: 24px">
        <div class="d-flex flex-column" style="flex: 1 1 45%; gap: 15px">
          <!-- //mark: 고객정보 -->
          <CompoInfoCust @setCustInfo="setCustInfo" @allReSet="allReSet" :RESET_ABLE="RESET_ABLE" :readOnly="readOnly" :SCH_CUSTCO_ID="computedUserCenter"/>
          <!-- //mark: 계약정보 -->
          <CompoInfoAsContract :RESET_ABLE="RESET_ABLE" :readOnly="readOnly" :SCH_CUSTCO_ID="computedUserCenter"/>
        </div>
        <!-- 상담정보 -->
        <CompoInfoCutt v-if="!readOnly"
          :CUST_INFO = "CUST_INFO"
          :CHG_CUTT_CN="CUTT_CN"
          :RESET_ABLE="RESET_ABLE"
          :SCH_CUSTCO_ID="computedUserCenter"
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
        :SCH_CUSTCO_ID="computedUserCenter"
        :readOnly="readOnly"
        @addCuttCn="addCuttCn" />
      <!-- //mark: 상담이력 grid -->
      <CompoInfoHist
        :class="`is-mt-l flex-grow-1 favToggle-${favToggle}`"
        :RESET_ABLE="RESET_ABLE"
        :SCH_CUSTCO_ID="computedUserCenter"
        :readOnly="readOnly"
      />
    </template>
    <!-- //mark: - 공통(마이홈, 공가해소, 전세임대, 주택지원센터) End -->

    <!-- //mark: 바로처리센터(인바운드) Start -->
    <template v-if="computedUserCenter === '4' && userDefaultCuttTask === 'IBND'">
      <div class="d-flex flex-wrap" style="gap: 24px">
        <div class="d-flex flex-column" style="flex: 1 1 45%; gap: 16px">
          <!-- //mark: 고객정보 -->
          <CompoInfoCust @setCustInfo="setCustInfo" @allReSet="allReSet" :RESET_ABLE="RESET_ABLE" :readOnly="readOnly" :SCH_CUSTCO_ID="computedUserCenter"/>
          <!-- //mark: 계약정보 -->
          <CompoInfoAsContract :RESET_ABLE="RESET_ABLE" :readOnly="readOnly" :SCH_CUSTCO_ID="computedUserCenter"/>
        </div>
        <!-- //mark: 상담정보 -->
        <CompoInfoAsCutt v-if="!readOnly"
          @setSavedAsCuttInfo="setSavedAsCuttInfo"
          :RESET_ABLE="RESET_ABLE"
          :SCH_CUSTCO_ID="computedUserCenter"
          :readOnly="readOnly"
        />
      </div>
      <!-- //mark: AS 접수 -->
      <CompoInfoAsFlwAcp
        class="is-mt-l"
        :SavedAsCuttInfoProp="SAVED_AS_CUTT_INFO"
        :RESET_ABLE="RESET_ABLE"
        :SCH_CUSTCO_ID="computedUserCenter"
        :readOnly="readOnly"
        />
      <!-- //mark: 상담이력 grid -->
      <CompoInfoHist
        :class="`is-mt-l flex-grow-1 favToggle-${favToggle}`"
        :RESET_ABLE="RESET_ABLE"
        :SCH_CUSTCO_ID="computedUserCenter"
        :readOnly="readOnly"
        />
    </template>
    <!-- //mark: 바로처리센터(인바운드) End -->

    <!-- 바로처리센터(스케줄러) -->
    <template v-if="computedUserCenter === '4' && userDefaultCuttTask === 'SHDL' ">
      <div class="d-flex flex-wrap" style="gap: 24px">
        <!-- 바로처리센터 (스케쥴러) -->
        <CompoAsScheduler :RESET_ABLE="RESET_ABLE" :readOnly="readOnly" :SCH_CUSTCO_ID="computedUserCenter"/>
      </div>
      <!-- //mark: 상담이력 grid -->
      <CompoInfoHist
        :class="`is-mt-l flex-grow-1 favToggle-${favToggle} mb-6`"
        :RESET_ABLE="RESET_ABLE"
        :SCH_CUSTCO_ID="computedUserCenter"
        :readOnly="readOnly"
        />
    </template>

    <!-- 바로처리센터(모바일 스케줄러) -->
    <template v-if="computedUserCenter === '4' && userDefaultCuttTask === 'M_SHDL' ">
      <div class="d-flex flex-wrap" style="gap: 24px">
        <!-- 바로처리센터 (스케쥴러) -->
        <CompoAsSchedulerMobile :RESET_ABLE="RESET_ABLE" :readOnly="readOnly" :SCH_CUSTCO_ID="computedUserCenter"/>
      </div>
      <!-- //mark: 상담이력 grid -->
      <CompoInfoHist
        :class="`is-mt-l flex-grow-1 favToggle-${favToggle} mb-6`"
        :RESET_ABLE="RESET_ABLE"
        :SCH_CUSTCO_ID="computedUserCenter"
        :readOnly="readOnly"
        />
    </template>


    <!-- temp: 실시간 대화록 버튼 -->
    <CompoAnimBtn
      v-if="RTtoggle || Number(this.CTI_CALL_STAT.replace('stat', '')) === 6"
      StyleProp="position: fixed; top: calc(100vh - 50px); left: 260px; z-index: 10"
      :DataProp="animBtnData"
      :RESET_ABLE="RESET_ABLE"
      @TriggerEvt="expandRealTalk()"
      />
    <!-- side panel : 실시간 대화록 보기-->
    <v-slide-x-transition>
      <div v-if=" dialogRealTalkLog === true "
        class="pl-quick-layer type-left "
        style="width: 975px"
        >
        <div class="pl-quick-layer-header is-noborder pb-0">
          <div class="d-flex align-center">
            <h1>[{{ CUST_INFO?mixin_isEmpty(CUST_INFO.CUST_NM)?'성명미상':CUST_INFO.CUST_NM:'성명미상' }}]님과의 실시간 대화록</h1>
            <span class="ml-2">{{ mixin_setPhoneNo(CUST_INFO.CUST_PHN_NO) }}</span>
            <span style="width: 54px" class="ml-2 pl-badge is-green" v-if="Number(CTI_CALL_STAT.replace('stat', '')) === 6">대화중</span>
          </div>
          <v-switch class="ml-auto pl-switch type-first-label" v-model="isRealtimeScroll">
            <template v-slot:label>
              <span class="pl-label">스크롤</span>
            </template>
          </v-switch>
          <compo-tooltip-btn
            TitleProp="화면 숨기기"
            ClassProp="pl-tooltip-btn ml-4"
            IconProp="pl-icon20 shrink"
            TooltipPositionProp="bottom"
            @btnClick="shrinkRealTalk()"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogRealTalkLog = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
        <CompoRealTalkLog
          :isRealtimeScroll="isRealtimeScroll"
          :RESET_ABLE="RESET_ABLE"
          @Close="dialogRealTalkLog = false" />
      </div>
    </v-slide-x-transition>
  </div>
</template>
<script>
import CompoAnimBtn from '@/components/CompoAnimBtn.vue'
import CompoRealTalkLog from '@/components/CompoRealTalkLog.vue'
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
  name: "MENU_CSL_M0100", // 전화상담
  props: {
    readOnly: {
      type: Boolean,
      default : false
    },
    popData: {
      type: Object,
      default : null
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
    CompoAnimBtn,
    CompoRealTalkLog,
  },
  data(){
    return{
      userDefaultCuttTask: this.computedUserDefaultCuttTask,

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

      // animation button
      animBtnData: {
        title: '실시간 대화록',
        preIcon: '',
        appendIcon: 'pl-icon20 expand-white',
      },

      // 실시간 대화록
      isRealtimeScroll:true,
      dialogRealTalkLog: false,
      RTtoggle: false,

      CUST_INFO : {}, //선택된 고객 정보
      RESET_ABLE : false, //전체 초기화 여부
    }
  },
  computed: {
  },
  watch: {
  },
  beforeDestroy(){
    this.$eventBus.$off("setRealTimeSpeakTxt"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("allReSet"); //eventBus 중복방지를 위해 off
  },
  async created() {
    //바로처리 스케줄러에서 조회전용 화면 띄우기 위함.(스케줄러 조회 전용 화면은 인바운드 조회 전용 화면과 같음.)
    if(this.popData != null) {
      if(this.popData.userDefaultCuttTask) {
        this.userDefaultCuttTask = this.popData.userDefaultCuttTask;
      } else {
        this.userDefaultCuttTask = this.computedUserDefaultCuttTask
      }
    } else {
      this.userDefaultCuttTask = this.computedUserDefaultCuttTask
    }
    console.log("this.userDefaultCuttTask", this.userDefaultCuttTask)
    if(this.computedUserCenter === '-1'){
      this.showAlertInfo({msg : '좌측 상단의 센터 선택 후 이용해 주세요.'});
      return;
    }

    this.$eventBus.$on("setRealTimeSpeakTxt", (CallInfo) => {
      this.$eventBus.$emit('setSttCallId', CallInfo);
      this.RTtoggle = true;
    });
    
    //전체 초기화
    this.$eventBus.$on("allReSet", (CallInfo) => {
      this.allReSet();
    });

    this.$store.commit("statusStore/MU_FAVORIT_HIDDEN", !this.favToggle);
  },
  methods: {
    toggleFav(){
      this.favToggle = !this.favToggle;

      this.$store.commit("statusStore/MU_FAVORIT_HIDDEN", !this.favToggle);
    },
    expandRealTalk(){
      this.dialogRealTalkLog = true
      this.RTtoggle = false
    },
    shrinkRealTalk(){
      this.dialogRealTalkLog = false
      this.RTtoggle = true
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