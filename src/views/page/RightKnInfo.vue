<template>
  <div>
    <!-- tab -->
    <div class="is-border-bottom">
      <v-tabs v-model="rigthKmsTab" slider-size="2" class="pl-tabs px-4 is-noborder"
      >
        <CompoTabItems :TabsList=tabsList2
        >
        </CompoTabItems>
      </v-tabs>
    </div>
    <v-tabs-items v-model="rigthKmsTab"
    >
      <div class="fill-height">
        <template v-for="(item, index) in tabsList2">
          <v-tab-item :key="index">
            <div
                :class="`fill-height tab-contents`">
              <component :is="item.content"
                         :DataProp="preSetData"
                         @loadComplete="loadComplete"
                         @updateBadge="updateBadge"
                         @refresh="refresh"
                         @setTab="setTab"
                         :RefreshProp="rigthKmsTab === index ? refreshFlag : null"
              ></component>
            </div>
          </v-tab-item>
        </template>
      </div>
    </v-tabs-items>
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import RIGHT_SIDE_KN_TAB_01 from '@/views/page/RIGHT_SIDE_KN_TAB_01'
import RIGHT_SIDE_KN_TAB_02 from '@/views/page/RIGHT_SIDE_KN_TAB_02'
import RIGHT_SIDE_KN_TAB_03 from '@/views/page/RIGHT_SIDE_KN_TAB_03'
import RIGHT_SIDE_KN_TAB_04 from '@/views/page/RIGHT_SIDE_KN_TAB_04'
import RIGHT_SIDE_KN_TAB_05 from '@/views/page/RIGHT_SIDE_KN_TAB_05'

export default {
  name: 'RightKnInfo', //side 지식정보
  components: {
    CompoTabItems,
    RIGHT_SIDE_KN_TAB_01,
    RIGHT_SIDE_KN_TAB_02,
    RIGHT_SIDE_KN_TAB_03,
    RIGHT_SIDE_KN_TAB_04,
    RIGHT_SIDE_KN_TAB_05,
  },
  props: {
    TabProp: {
      type: Number,
      default: null,
    }
  },
  data() {
    return {
      // tab
      rigthKmsTab: this.TabProp,
      tabsList2: [
        {idx: 1, title: '상담 매크로 ', content: 'RIGHT_SIDE_KN_TAB_01', badge: false},
        {idx: 2, title: '지식 콘텐츠 ', content: 'RIGHT_SIDE_KN_TAB_02', badge: false},
        {idx: 3, title: '상담자료 ', content: 'RIGHT_SIDE_KN_TAB_03', badge: false},
        {idx: 4, title: '새로운 지식 ', content: 'RIGHT_SIDE_KN_TAB_04', badge: false},
        {idx: 5, title: '즐겨찾기 ', content: 'RIGHT_SIDE_KN_TAB_05', badge: false},
      ],
      refreshFlag: false,
      preSetData: {},
    }
  },
  methods: {
    updateBadge(name, flag) {
      let idx = this.tabsList2.findIndex(item => item.content === name)
      this.tabsList2[idx]["badge"] = flag;
    },
    // 최초 로드 시 뱃지 업데이트를 위해 Tabs2 를 변경 했다가 0번으로 다시 세팅
    loadComplete() {
      // this.rigthKmsTab = 0;
    },
    refresh() {
      this.refreshFlag = !this.refreshFlag
    },
    setTab(item) {
      this.rigthKmsTab = Number(item);
    }
  },
  mounted() {
  },
  created() {
    // 지식 컨텐츠 바로가기
    this.$eventBus.$on('openKnowledgeSlide', async (contentId) => {
      if (this.rigthKmsTab !== 1) this.rigthKmsTab = 1;
      this.$emit('showKmsSlide') // 슬라이드 오픈
      this.preSetData = {}; // props 데이터 초기화
      this.preSetData.KMS_SCRIPT_VIEW = 'list'; // 리스트 형태 view
      this.preSetData.KMS_CONTS_ID = contentId; // 컨텐츠 아이디 설정
    })

    if(this.computedUserDetailType === 'MANAGER') {
      this.tabsList2 = [
        {idx: 1, title: '상담 매크로 ', content: 'RIGHT_SIDE_KN_TAB_01', badge: false},
        {idx: 2, title: '지식 콘텐츠 ', content: 'RIGHT_SIDE_KN_TAB_02', badge: false},
        {idx: 3, title: '새로운 지식 ', content: 'RIGHT_SIDE_KN_TAB_04', badge: false},
        {idx: 4, title: '즐겨찾기 ', content: 'RIGHT_SIDE_KN_TAB_05', badge: false},
      ]
    }
  },
  computed: {},
  watch: {
    rigthKmsTab() {
      this.refresh()
    },
  },
  beforeDestroy() {
    this.$eventBus.$off("openKnowledgeSlide"); //eventBus 중복방지를 위해 off
  }
};
</script>

<style lang="scss" scoped>

</style>