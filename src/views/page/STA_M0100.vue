<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
    <!-- sub top -->
    <compo-sub-layout-top  NoBorderProp>
    </compo-sub-layout-top>
    <!-- content -->
    <div class="is-border-bottom">
      <v-tabs
        v-model="tabs1"
        slider-size="2"
        class="pl-tabs px-5 is-noborder">
        <CompoTabItems :TabsList=TabsList />
      </v-tabs>
    </div>
    <v-tabs-items v-model="tabs1">
      <div class="fill-height" style="height: calc(100vh - 191px)">
        <template v-for="(item, index) in TabsList" >
          <v-tab-item :key="index">
            <div
              class="fill-height tab-contents">
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
import STA_M0100_HOURLY_STATS from '@/views/page/STA_M0100_HOURLY_STATS.vue';
import STA_M0100_DAILY_STATS from '@/views/page/STA_M0100_DAILY_STATS.vue';
import STA_M0100_MONTHLY_STATS from '@/views/page/STA_M0100_MONTHLY_STATS.vue';

export default {
name:"MENU_STA_M0100", //상담유형별 통계
components: {
  CompoTabItems,
  STA_M0100_HOURLY_STATS,
  STA_M0100_DAILY_STATS,
  STA_M0100_MONTHLY_STATS,
},
data() {
   return {
    tabs1: null,
    // tabsList1
    TabsList: [
      { title: '시간별 통계', content: 'STA_M0100_HOURLY_STATS', badge: false },
      { title: '일별 통계', content: 'STA_M0100_DAILY_STATS', badge: false },
      { title: '월별 통계', content: 'STA_M0100_MONTHLY_STATS', badge: false },
    ],
   }
 },

  watch: {

  },

  computed: {

  },

  created() {

  },

  mounted() {

  },

  methods: {

  },
}
</script>

<style lang="scss" scoped>

</style>