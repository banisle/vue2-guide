<template>
  <div>
    <!-- tabs -->
    <div class="is-border-bottom">
      <v-tabs
        v-model="tabs1"
        class="pl-tabs is-noborder px-5">
        <CompoTabItems :TabsList=tabsList1 class="mt-0" />
      </v-tabs>
    </div>
    <!-- content -->
    <div style="height: 722px" >
      <v-tabs-items
        v-model="tabs1"
        class="fill-height"
        style="background: transparent"
        >
        <template v-for="(item, index) in tabsList1" >
          <v-tab-item :key="index">
            <div
              :class="`fill-height tab-contents pl-card`">
              <component :is="item.content"></component>
            </div>
          </v-tab-item>
        </template>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';

import RightRentalManage_TAB01 from '@/views/page/RightRentalManage_TAB01';
import RightRentalManage_TAB02 from '@/views/page/RightRentalManage_TAB02';
import RightRentalManage_TAB03 from '@/views/page/RightRentalManage_TAB03';

export default {
  name: 'RightRentalManage', //임대주택 관리 현황
  components: {
    CompoTabItems,
    RightRentalManage_TAB01,
    RightRentalManage_TAB02,
    RightRentalManage_TAB03,
  },
  props:{
    injectionObj: {
      type: Object,
      default:null
    }
  },
  data() {
    return {

      tabs1: 0,
      // tabsList1
      tabsList1: [
        { title: '임대주택 관리 현황', content: 'RightRentalManage_TAB01', badge: false},
        { title: '분양아파트 관리사무소 전화번호', content: 'RightRentalManage_TAB02', badge: false},
        { title: '서울지역 임대아파트 현황', content: 'RightRentalManage_TAB03', badge: false},
      ],



    }
  },
  methods: {
  },
  mounted() {
    console.log("this.injectionObj",this.injectionObj);

    setTimeout(() => {
      this.$eventBus.openRightRentalManage(this.injectionObj);
    }, 1000);
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