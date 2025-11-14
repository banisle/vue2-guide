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
import STA_M1800_TAB01 from '@/views/page/STA_M1800_TAB01';
import STA_M1800_TAB02 from '@/views/page/STA_M1800_TAB02';
import STA_M1800_TAB03 from '@/views/page/STA_M1800_TAB03';

export default {
name:"MENU_STA_M1800", //지역본부별/ VOC
components: {
  CompoTabItems,
  STA_M1800_TAB01,
  STA_M1800_TAB02,
  STA_M1800_TAB03,
},
data() {
   return {
    tabs1: null,
    // tabsList1
    TabsList: [
      { title: 'VOC 상세', content: 'STA_M1800_TAB01', badge: false },
      { title: '지역본부별집계', content: 'STA_M1800_TAB02', badge: false },
      { title: '공급유형별TOP5', content: 'STA_M1800_TAB03', badge: false },
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