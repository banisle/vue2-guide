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
import CTM_M0200_TAB_01 from '@/views/page/CTM_M0200_TAB_01'
import CTM_M0200_TAB_02 from '@/views/page/CTM_M0200_TAB_02'
import CTM_M0200_TAB_03 from '@/views/page/CTM_M0200_TAB_03'

export default {
  name: "MENU_CTM_M0200", // 배려고객 관리
  components: {
    CompoTabItems,
    CTM_M0200_TAB_01,
    CTM_M0200_TAB_02,
    CTM_M0200_TAB_03,
  },
  data() {
    return {
      // search
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dropDetail: false,
      modelSelect01: '단순 SMS',

      // tab
      tabs2: null,
      tabsList2: [
        { title: '차단/철회 요청 현황', content: 'CTM_M0200_TAB_01', badge: false},
        { title: '배려고객 관리 대장', content: 'CTM_M0200_TAB_02', badge: false},
        { title: '배려고객 인입 현황', content: 'CTM_M0200_TAB_03', badge: false},
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

</style>