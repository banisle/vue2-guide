<template>
  <div class="pl-container type-mainphone2">
    <!-- //mark: - 공통(마이홈, 공가해소, 전세임대, 주택지원센터) Start-->
    <template v-if="(computedUserCenter === '1' || computedUserCenter === '2' || computedUserCenter === '3' || computedUserCenter === '5')">
      <div class="d-flex flex-wrap" style="gap: 24px">
        <div class="d-flex flex-column" style="flex: 1 1 45%; gap: 15px">
          <!-- //mark: 고객정보 -->
          <CompoInfoCust />
          <!-- //mark: 계약정보 -->
          <CompoInfoAsContract />
        </div>
        <!-- 상담정보 -->
        <CompoInfoCutt />
      </div>
      <!-- //mark: 관심지역  -->
      <CSL_M0100_FAVORITE
        @toggleEvt = "toggleFav" 
        :propToggle="favToggle"
        :cuttEditAble="editAble"
        :CUTT_CN="CUTT_CN"
        :RESET_ABLE="RESET_ABLE"
        @addCuttCn="addCuttCn"
      />
      <!-- //mark: 상담이력 grid -->
      <CompoInfoHist
        :class="`is-mt-l flex-grow-1 favToggle-${favToggle}`"
        :RESET_ABLE="RESET_ABLE"
      />
    </template>

    <!-- //mark: 바로처리센터(인바운드) Start -->
    <template v-if="computedUserCenter === '4'">
      <div class="d-flex flex-wrap" style="gap: 24px">
        <div class="d-flex flex-column" style="flex: 1 1 45%; gap: 16px">
          <!-- //mark: 고객정보 -->
          <CompoInfoCust />
          <!-- //mark: 계약정보 -->
          <CompoInfoAsContract />
        </div>
        <CompoInfoAsCutt />
      </div>
      <!-- //mark: AS 접수 -->
      <CompoInfoAsFlwAcp class="is-mt-l"/>

      <!-- //mark: 상담예약 grid -->
      <CompoInfoHist
        :class="`is-mt-l flex-grow-1 favToggle-${favToggle}`" />
    </template>

    <!-- temp: 실시간 대화록 버튼 -->
    <CompoAnimBtn
      v-if="RTtoggle"
      StyleProp="position: fixed; top: calc(100vh - 50px); left: 260px; z-index: 10"
      :DataProp="animBtnData"
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
            <h1>[성명미상]님과의 실시간 대화록</h1>
            <span class="ml-2">010-1004-1004</span>
            <span
              style="width: 54px"
              class="ml-2 pl-badge is-green">대화중</span>
          </div>
          <v-switch class="ml-auto pl-switch type-first-label" input-value="true">
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
          :DataProp="talk_data"
          @Close="dialogRealTalkLog = false"
          @RealTalkHide="shrinkRealTalk"
        />
      </div>
    </v-slide-x-transition>

  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

import CompoAnimBtn from '@/components/CompoAnimBtn.vue'
import CompoRealTalkLog from '@/components/CompoRealTalkLog.vue'

// 컴포넌트
import CompoInfoCust from '@/components/csl/CompoInfoCust.vue'
import CompoInfoAsContract from '@/components/csl/CompoInfoAsContract.vue'
import CompoInfoCutt from '@/components/csl/CompoInfoCutt.vue'
import CSL_M0100_FAVORITE from './CSL_M0100_FAVORITE.vue'
import CompoInfoHist from '@/components/csl/CompoInfoHist.vue'
import CompoInfoAsCutt from '@/components/csl/CompoInfoAsCutt.vue'
import CompoInfoAsFlwAcp from '@/components/csl/CompoInfoAsFlwAcp.vue'


export default {
  name: "MENU_CSL_M0200", // 특수채널상담
  components: {
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
      // 관심지역 toggle
      favToggle: true,

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
      dialogRealTalkLog: false,
      talk_data: [
        {
          img: require('@/assets/img/@leader_portrait.png'),
          name: '우성아',
          date: '2024-06-10 13:20:45',
          text: '안녕하십니까. 마이홈센터 우성아입니다. 무엇을 도와드릴까요?',
          type: 'manager',
        },
        {
          img: require('@/assets/img/@manager_profile_default.png'),
          name: '고객',
          date: '2024-06-10 13:20:58',
          text: '네 국민임대주택에 대해 문의 드립니다.',
          type: 'cs',
          modelVoc: false,
          modelReuqest: false,
        },
        {
          img: require('@/assets/img/@leader_portrait.png'),
          name: '우성아',
          date: '2024-06-10 13:21:02',
          text: '네, 그러시군요. 그럼 어느 지역의 국민임대 주택을 안내해 드릴까요?',
          type: 'manager'
        },
        {
          img: require('@/assets/img/@manager_profile_default.png'),
          name: '고객',
          date: '2024-06-10 13:21:05',
          text: '음... 화성시 비봉이요.',
          type: 'cs',
          isBlack: true,
          isBmk: true,
          modelVoc: false,
          modelReuqest: false,
        },
        {
          img: require('@/assets/img/@leader_portrait.png'),
          name: '우성아',
          date: '2024-06-10 13:21:09',
          text: '네에, 그러 시군요 잠시만 기다려 주시면 해당 지역 공고 확인 후 곧바로 안내해 드리겠습니다.',
          type: 'manager'
        },
        {
          img: require('@/assets/img/@leader_portrait.png'),
          name: '우성아',
          date: '2024-06-10 13:21:17',
          text: '기다려 주셔서 감사합니다. 조금전에 문의 주신 화성시 비봉 국민임대주택에 대해 안내 드리기에 앞서 죄송 하오나, 안내전에 몇가지 질문 후 도와드리도록 하겠습니다.',
          type: 'manager'
        },
        {
          img: require('@/assets/img/@leader_portrait.png'),
          name: '우성아',
          date: '2024-06-10 13:21:37',
          text: '본인 확인을 위해 성함과 연락처를 말씀해 주십시오',
          type: 'manager'
        },
      ],
      RTtoggle: true,

      RESET_ABLE : false, //전체 초기화 여부
    }
  },
  computed: {
    ...mapGetters({
    }),
  },
  methods: {
    toggleFav(){
      this.favToggle = !this.favToggle
    },
    
    expandRealTalk(){
      this.dialogRealTalkLog = true
      this.RTtoggle = false
    },

    shrinkRealTalk(){
      this.dialogRealTalkLog = false
      this.RTtoggle = true
    },

    //관심지역 등록, 수정시 상담정보 입력 폼 상담메모 내용 추가
    addCuttCn(data){
      this.CUTT_CN = data;
    },

  }

}
</script>

<style lang="scss" scoped>

</style>