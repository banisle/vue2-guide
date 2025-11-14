<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  :NoBorderProp="true" >

      </compo-sub-layout-top>
      <!-- sub content -->
      <!-- tab -->
      <div class="tab-fill-height">
        <div class="is-border-bottom">
          <v-tabs v-model="tabs2" slider-size="2" class="pl-tabs px-4 is-noborder">
            <CompoTabItems :TabsList=tabsList2 >
            </CompoTabItems>
          </v-tabs>
        </div>
        <v-tabs-items
          v-model="tabs2">
          <div class="fill-height">
            <v-tab-item >
              <div
              :class="`fill-height tab-contents`">
                <CSL_M0504_TAB_01
                  :TabProp="tabs2"
                />
              </div>
            </v-tab-item>
            <v-tab-item >
              <div
              :class="`fill-height tab-contents`">
                <CSL_M0504_TAB_02
                  :TabProp="tabs2"
                />
              </div>
            </v-tab-item>
          </div>
        </v-tabs-items>
      </div>
    </div>
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CSL_M0504_TAB_01 from '@/views/page/CSL_M0504_TAB_01'
import CSL_M0504_TAB_02 from '@/views/page/CSL_M0504_TAB_02'

export default {
  name: 'MENU_CSL_M0504', // 미대상 조회
  components: {
    CompoTabItems,
    CSL_M0504_TAB_01,
    CSL_M0504_TAB_02,
  },
  data() {
    return {
      // 검색
      modelRejectDate: '반려일자',
      itemsRejectDate: ['반려일자'],
      dropDetail: false,
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      radioGroupSelected: "상담번호",
      radioGroup: [
        {
          text: "통화시간↑",
        },
        {
          text: "통화시간↓",
        },
        {
          text: "상담번호",
        },
      ],

      // tab
      tabs2: null,
      tabsList2: [
        { title: '(신)미대상조회', content: 'CSL_M0504_TAB_01', badge: false},
        { title: '(구)미대상조회', content: 'CSL_M0504_TAB_02', badge: false},
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