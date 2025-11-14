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
import STA_M1100_TAB01 from '@/views/page/STA_M1100_TAB01';
import STA_M1100_TAB02 from '@/views/page/STA_M1100_TAB02';

export default {
name:"MENU_STA_M1100", //지역본부별/단지별 통계
components: {
  CompoTabItems,
  STA_M1100_TAB01,
  STA_M1100_TAB02,
},
data() {
   return {
    tabs1: null,
    // tabsList1
    TabsList: [
      { title: '일별 통계', content: 'STA_M1100_TAB01', badge: false },
      { title: '월별 통계', content: 'STA_M1100_TAB02', badge: false },
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