<template>
  <div class="fill-height">
    <template v-for="(item, index) in TabsList" >
      <v-tab-item :key="index">
        <div
          :style="StyleProp"
          :class="`fill-height tab-contents mt-2 TAB_NAME_${item.content}`">
          <component
            :popData=DataProp
            :SelectedProp="SelectedProp"
            @ChangeTabView="chageView()"
            :KeywordProp="KeywordProp"
            :is="item.content"></component>
        </div>
      </v-tab-item>
    </template>
  </div>
</template>

<script>

// HOME 팀관리
import HOME_TEAM_TAB_DASHBOARD from '@/views/page/Home/HOME_TEAM_TAB_DASHBOARD'
import HOME_TEAM_TAB01 from '@/views/page/Home/HOME_TEAM_TAB01.vue' //직원정보
import HOME_TEAM_TAB011 from '@/views/page/Home/HOME_TEAM_TAB011.vue' //상담콜 현황
import HOME_TEAM_TAB02 from '@/views/page/Home/HOME_TEAM_TAB02.vue' //상담 현황
import HOME_TEAM_TAB03 from '@/views/page/Home/HOME_TEAM_TAB03.vue' //근태
import HOME_TEAM_TAB031 from '@/views/page/Home/HOME_TEAM_TAB031.vue' //근무시간
import HOME_TEAM_TAB04 from '@/views/page/Home/HOME_TEAM_TAB04.vue' //가감점
import HOME_TEAM_TAB05 from '@/views/page/Home/HOME_TEAM_TAB05.vue' //보정시간
import HOME_TEAM_TAB06 from '@/views/page/Home/HOME_TEAM_TAB06.vue' //코칭
import HOME_TEAM_TAB07 from '@/views/page/Home/HOME_TEAM_TAB07.vue' //업무평가
import HOME_TEAM_TAB08 from '@/views/page/Home/HOME_TEAM_TAB08.vue' //상담품질
import HOME_TEAM_TAB09 from '@/views/page/Home/HOME_TEAM_TAB09.vue' //실적표
import HOME_TEAM_TAB010 from '@/views/page/Home/HOME_TEAM_TAB010.vue' //모니터링

import HOME_MANAGER_TAB_DASHBOARD from '@/views/page/Home/HOME_MANAGER_TAB_DASHBOARD.vue' //대시보드
import HOME_MANAGER_TAB01 from '@/views/page/Home/HOME_MANAGER_TAB01.vue' //근태
import HOME_MANAGER_TAB02 from '@/views/page/Home/HOME_MANAGER_TAB02.vue' //가감점
import HOME_MANAGER_TAB03 from '@/views/page/Home/HOME_MANAGER_TAB03.vue' //보정시간
import HOME_MANAGER_TAB04 from '@/views/page/Home/HOME_MANAGER_TAB04.vue' //코칭
import HOME_MANAGER_TAB05 from '@/views/page/Home/HOME_MANAGER_TAB05.vue' //업무평가
import HOME_MANAGER_TAB06 from '@/views/page/Home/HOME_MANAGER_TAB06.vue' //상담품질
import HOME_MANAGER_TAB07 from '@/views/page/Home/HOME_MANAGER_TAB07.vue' //실적표

// 실시간 대화록
import CompoRealTalkTab01 from '@/components/CompoRealTalkTab01.vue' //상담 어드바이저
import CompoRealTalkTab02 from '@/components/CompoRealTalkTab02.vue' //필수 안내사항
import CompoRealTalkTab03 from '@/components/CompoRealTalkTab03.vue' //대화태깅
import CompoRealTalkTab04 from '@/components/CompoRealTalkTab04.vue' //긍정/부정
import CompoRealTalkTab05 from '@/components/CompoRealTalkTab05.vue' //상담요약

// 채팅 패널
import CHATPANEL_TAB_01 from '@/views/page/Chat/CHATPANEL_TAB_01.vue' //채널 목록
import CHATPANEL_TAB_02 from '@/views/page/Chat/CHATPANEL_TAB_02.vue' //책갈피

export default {
  name: 'CompoTabContent',
  components: {
    HOME_TEAM_TAB_DASHBOARD,
    HOME_TEAM_TAB01,
    HOME_TEAM_TAB02,
    HOME_TEAM_TAB03,
    HOME_TEAM_TAB031,
    HOME_TEAM_TAB04,
    HOME_TEAM_TAB05,
    HOME_TEAM_TAB06,
    HOME_TEAM_TAB07,
    HOME_TEAM_TAB08,
    HOME_TEAM_TAB09,
    HOME_TEAM_TAB010,
    HOME_TEAM_TAB011,
    HOME_MANAGER_TAB_DASHBOARD,
    HOME_MANAGER_TAB01,
    HOME_MANAGER_TAB02,
    HOME_MANAGER_TAB03,
    HOME_MANAGER_TAB04,
    HOME_MANAGER_TAB05,
    HOME_MANAGER_TAB06,
    HOME_MANAGER_TAB07,
    CompoRealTalkTab01,
    CompoRealTalkTab02,
    CompoRealTalkTab03,
    CompoRealTalkTab04,
    CompoRealTalkTab05,
    CHATPANEL_TAB_01,
    CHATPANEL_TAB_02,

  },
  props: {
    TabsList: {
      type: Array,
      required: true,
    },
    StyleProp: {
      type: String,
    },
    DataProp: {
      type: Object,
    },
    SelectedProp: {
      type: String,
      default: ''
    },
    KeywordProp: {
      type: Number,
    }
  },
  methods:{
    //문서뷰어 탭 이동
    chageView(){
      this.$emit('ChageView')

    }
  }
};
</script>
<style>
.fill-height .v-window-item.v-window-item--active{
  height: 100%;
}
</style>
