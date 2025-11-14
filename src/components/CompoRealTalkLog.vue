<template>
  <div style="display: contents">
    <div class="pl-quick-layer-body px-0 pt-0" style="overflow-y: hidden;">
      <div class="is-border-bottom">
        <v-tabs class="pl-tabs is-noborder px-5" v-model="tabs2">
          <v-tab>
            <v-badge
              :value="false"
              color="#0073ce"
              bordered
              offset-x="-1"
              offset-y="9"
              dot
            >
              실시간 대화록
            </v-badge>
          </v-tab>
          <v-tab>문서뷰어</v-tab>
          <v-tab>공고문 검색</v-tab>
        </v-tabs>
      </div>
      <v-tabs-items v-model="tabs2" class="fill-height">
        <!-- 실시간 대화록 -->
        <v-tab-item>
          <div class="pl-cols " style="height: 410px">
            <div class="is-vrt is-col-fix" style="height: 100%; width: 70%">
              <CompoTalkHistory
                  :isRealtimeScroll="isRealtimeScroll"
              />
            </div>
            <div class="pl-card pl-scroll-body">
              <h3 class="pl-subtit" >
                <span @click="isVisibleKeywordHistory = 1">키워드 히스토리</span>
                <div @click="isVisibleKeywordHistory = 2" class="ml-auto" style="width: 80px; height: 20px; cursor: pointer;"></div>
              </h3>
              <div class="is-mt-m">
                <div class="is-mt-s" >
                  <div
                    class="spacing-wrap sp-8 mt-1 flex-wrap">
                    <template v-for="item in TALK_DATA_SEARCH_KEYWORD">
                      <span class="pl-single-tag" v-if="item.tp !== 'as'"> {{ item.text }} </span>
                      <span class="pl-single-tag hover-bg" @click="selectedAsKeyword(item)" style="cursor: pointer" v-if="item.tp === 'as'"> {{ item.text }} <span class="ml-1 is-txt-yellow">: {{ item.sub_text }}</span></span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 정보 탭 -->
          <div class="is-border-top">
            <v-tabs v-model="tabs3" hide-slider class="pl-tabs type-sub px-3 mt-2 is-noborder">
              <CompoTabItems :TabsList=computedTempTabs />
            </v-tabs>
          </div>
          <v-tabs-items v-model="tabs3" class="fill-height">
            <CompoTabContent
              :TabsList=computedTempTabs
              :SelectedProp="selectedTag"
              :KeywordProp="isVisibleKeywordHistory"
              @ChageView="chageTab()"
              @ChangeTabView="chageTab2($event)"
              @Hide="hideRealTalk"
              StyleProp="margin-top: 0 !important" />
          </v-tabs-items>
        </v-tab-item>
        <!-- 문서뷰어 -->
        <v-tab-item>
          <div>
            <CompoVuePdf
              :DataProp="computedPdfData"
              :vuePdfHeight="'760px'"
            />

          </div>
        </v-tab-item>
        <!-- 공고문검색 -->
        <v-tab-item>
          <CompoRealTalkLogSearch @ChangeTabView="chageTab2($event)"/>
        </v-tab-item>
      </v-tabs-items>

    </div>

  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CompoTabContent from '@/components/CompoTabContent.vue';

import CompoVuePdf from '@/components/CompoVuePdf'
import CompoTalkHistory from '@/components/CompoTalkHistory'
import CompoRealTalkLogSearch from '@/components/CompoRealTalkLogSearch'
import VuePdfApp from "vue-pdf-app";

export default {
  name: "CompoRealTalkLog", //name은 'MENU_' + 파일명 조합
  components: {
    CompoTabItems,
    CompoTabContent,
    CompoTalkHistory,
    CompoVuePdf,
    VuePdfApp,
    CompoRealTalkLogSearch

  },
  props: {
    DataProp: Array,
    isRealtimeScroll: {
      type:Boolean,
      default: () => false,
    }
  },
  data() {
    return {
      tabs2: null,
      tabs3: null,
      tabsList3: [
        // temp 시연
        { title: '상담 어드바이저', content: 'CompoRealTalkTab01', badge: false},
        { title: '상담업무 지식', content: 'CompoRealTalkTab02', badge: false},
        { title: '대화태깅', content: 'CompoRealTalkTab03', badge: false},
        { title: '상담요약', content: 'CompoRealTalkTab05', badge: false},
      ],
      temp_tabsList3: [
        // temp 시연
        { title: '상담업무 지식', content: 'CompoRealTalkTab02', badge: false},
        { title: '대화태깅', content: 'CompoRealTalkTab03', badge: false},
        { title: '상담요약', content: 'CompoRealTalkTab05', badge: false},
      ],
      KEYWORD_HISTORY: [
        { text: '경기도'},
        { text: '국민임대'},
        { text: '화성비봉'},
      ],
      KEYWORD_HISTORY2: [
        { text: '공용욕실', sub_text: '공간', color: 'yellow'},
        { text: '부부욕실', sub_text: '공간', color: 'yellow'},
        { text: '욕실', sub_text: '공간', color: 'yellow'},
        { text: '천장', sub_text: '부위자재', color: 'light-green'},
        { text: '누수', sub_text: 'AS 유형', color: 'org'},
      ],
      randomBg: '#5A6375',
      pdf_data: '',
      pdf_data2: '',

      selectedTag: '',
      isPdfNotice: false,

      // 시연
      isVisibleKeywordHistory: 0,
    }
  },
  methods: {
    openHandler(pdfApp) {
      window._pdfApp = pdfApp;
    },
    // 랜덤 bg
    getRandomDarkColor() {
      // 어두운 색을 생성하기 위해 RGB 값의 상한선을 낮게 설정합니다.
      // 여기서는 0부터 128까지의 값을 랜덤으로 생성합니다.
      //
      //const r = Math.floor(Math.random() * 128);
      //const g = Math.floor(Math.random() * 128);
      //const b = Math.floor(Math.random() * 128);

      const array = new Uint8Array(3);
      window.crypto.getRandomValues(array);
      const r = Math.floor((array[0] / 255) * 128);
      const g = Math.floor((array[1] / 255) * 128);
      const b = Math.floor((array[2] / 255) * 128);

      // 16진수로 변환하여 색상 문자열을 생성합니다.
      const color = `rgb(${r}, ${g}, ${b})`;
      return color
      // this.randomBg = color
    },
    // 키워드 선택
    selectedKeyword(item){
      this.selectedTag = item.text
    },

    //바로처리, 공간, 공종 세팅 이벤트
    selectedAsKeyword(item) {
      if(item.sub_text == '공간') {
        this.$eventBus.$emit("setSpceCdKeyword", item.text)
      } else {
        this.$eventBus.$emit("setMntnFlwCsCdKeyword", item.text)
      }
    },
    //문서뷰어 탭 이동
    chageTab(){
      this.isPdfNotice = false
      this.tabs2 = 1
    },
    //공고문 문서뷰어 탭 이동
    chageTab2(f){
      console.log( "chageTab2>>>>>>>>>>>>>>>>" ,  f );
      this.pdf_data2 = f;
      this.isPdfNotice = true
      this.tabs2 = 1
    },
    hideRealTalk() {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> hideRealTalk")
      this.$emit("RealTalkHide");
    }
  },
  mounted() {
  },
  created() {
  },
  computed: {
    computedPdfData() {
      return this.isPdfNotice ? this.pdf_data2 : this.pdf_data
    },
    computedTempTabs() {
      return this.computedUserCenter != 4 ? this.tabsList3 : this.temp_tabsList3
      //return this.tabsList3;
    }
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>