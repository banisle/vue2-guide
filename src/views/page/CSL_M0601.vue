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
import CSL_M0601_TAB_01 from '@/views/page/CSL_M0601_TAB_01'
import CSL_M0601_TAB_02 from '@/views/page/CSL_M0601_TAB_02'

export default {
  name: "MENU_CSL_M0601", // SMS발송이력
  components: {
    CompoTabItems,
    CSL_M0601_TAB_01,
    CSL_M0601_TAB_02
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
        { title: '문자 발송 이력', content: 'CSL_M0601_TAB_01', badge: false},
        { title: '문자 대량 발송', content: 'CSL_M0601_TAB_02', badge: false},
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