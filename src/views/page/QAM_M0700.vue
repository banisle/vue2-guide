<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  NoBorderProp></compo-sub-layout-top>
      <!-- sub content -->
      <!-- tab -->
      <div class="is-border-bottom">
        <v-tabs v-model="tabs2" slider-size="2" class="pl-tabs px-5 is-noborder">
          <CompoTabItems :TabsList=tabsList2 >
          </CompoTabItems>
        </v-tabs>
      </div>
      <v-tabs-items v-model="tabs2">
        <div class="fill-height" style="height: calc(100vh - 191px)">
          <template v-for="(item, index) in tabsList2" >
            <v-tab-item :key="index">
              <div
                :class="`fill-height tab-contents`">
                <component :is="item.content"></component>
              </div>
            </v-tab-item>
          </template>
        </div>
      </v-tabs-items>
    </div>
 </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import QAM_M0700_TAB_01 from '@/views/page/QAM_M0700_TAB_01'
import QAM_M0700_TAB_02 from '@/views/page/QAM_M0700_TAB_02'
import QAM_M0700_TAB_03 from '@/views/page/QAM_M0700_TAB_03'
import QAM_M0700_TAB_04 from '@/views/page/QAM_M0700_TAB_04'
import QAM_M0700_TAB_05 from '@/views/page/QAM_M0700_TAB_05'

export default {
  name: 'MENU_QAM_M0700', //평가 보고서
  components: {
    CompoTabItems,
    QAM_M0700_TAB_01,
    QAM_M0700_TAB_02,
    QAM_M0700_TAB_03,
    QAM_M0700_TAB_04,
    QAM_M0700_TAB_05,
  },
  data() {
    return {
      // top

      // tab
      tabs2: null,
      tabsList2: [
        { title: '상담품질 결과', content: 'QAM_M0700_TAB_01', badge: false},
        { title: '월별현황', content: 'QAM_M0700_TAB_02', badge: false},
        { title: '순위별', content: 'QAM_M0700_TAB_03', badge: false},
        { title: '상세결과', content: 'QAM_M0700_TAB_04', badge: false},
        { title: '점수대별 분포', content: 'QAM_M0700_TAB_05', badge: false},
      ],

    }
  },
  methods: {
  },
  mounted() {
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>'