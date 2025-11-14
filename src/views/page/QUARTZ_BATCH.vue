<template>
  <div class="pl-container">
   <div class="pl-card-wrap">
     <!-- sub top -->
     <compo-sub-layout-top NoBorderProp></compo-sub-layout-top>
     <div class="is-border-bottom">
        <v-tabs class="pl-tabs px-5 is-noborder" v-model="selectedTabIndex">
          <v-tab>스케줄러 관리</v-tab>
          <v-tab>스케줄러 로그</v-tab>
        </v-tabs>
     </div>
     <div class="fill-height">
      <v-tabs-items v-model="selectedTabIndex" class="fill-height">
        <v-tab-item><quartzBatchTab1Scheduler :selectedTabIndex="selectedTabIndex" /></v-tab-item>
        <v-tab-item><quartzBatchTab2Log /></v-tab-item>
      </v-tabs-items>
    </div>
   </div>
 </div>
</template>

<script>
import quartzBatchTab1Scheduler from '@/views/page/QUARTZ_BATCH_TAB1_SCHEDULER.vue';
import quartzBatchTab2Log from '@/views/page/QUARTZ_BATCH_TAB2_LOG.vue';
export default {
   name:"MENU_QUARTZ_BATCH", //name은 'MENU_' + 파일명 조합

components: {
  quartzBatchTab1Scheduler,
  quartzBatchTab2Log
 },
data() {
  return {
    selectedTabIndex:0
  }
 },

  watch: {
  },

  computed: {
  },

  beforeDestroy(){
  },

  async created(){
  },

  mounted() {
  },

  methods: {
  },
}
</script>