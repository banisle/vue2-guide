<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  NoBorderProp>
      </compo-sub-layout-top>
      <!-- sub content -->
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
import SYS_M0101_TAB_01 from '@/views/page/SYS_M0101_TAB_01'
import SYS_M0101_TAB_02 from '@/views/page/SYS_M0101_TAB_02'
import SYS_M0101_TAB_03 from '@/views/page/SYS_M0101_TAB_03'

  export default {
  name: "MENU_SYS_M0101", //name은 'MENU_' + 파일명 조합
  components: {
    CompoTabItems,
    SYS_M0101_TAB_01,
    SYS_M0101_TAB_02,
    SYS_M0101_TAB_03,
  },
  data() {
    return {
      // tab
      tabs2: null,
      tabsList2: [
        { title: '공통 코드', content: 'SYS_M0101_TAB_01', badge: false},
        { title: '근태 코드', content: 'SYS_M0101_TAB_02', badge: false},
        { title: '가감점 코드', content: 'SYS_M0101_TAB_03', badge: false},
      ],


    }
  },

  watch: {

  },

  computed: {

  },



  mounted() {
  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>