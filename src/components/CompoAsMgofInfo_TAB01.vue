<template>
  <div>
    <!-- tabs -->
    <div class="d-flex is-mt-m">
      <v-tabs
        v-model="tabsSub"
        hide-slider
        class="pl-tabs is-noborder type-fill type-middle flex-grow-1">
        <CompoTabItems :TabsList=tabsListSub class="mt-0" />
      </v-tabs>
      <div v-if="tabsSub == 0"
        class="ml-auto">
        <v-btn
          class="pl-btn"
          @click="saveBtn()"
          v-if="computedUserDetailType!=='MANAGER'"
          >저장</v-btn>
      </div>
    </div>
    <!-- content -->
    <div style="height: 100%" >
      <v-tabs-items
        v-model="tabsSub"
        class="fill-height"
        style="background: transparent"
        >
        <v-tab-item>
          <div
            class="fill-height tab-contents mt-2 TAB_NAME_CompoAsMgofInfo_TAB01_01">
            <CompoAsMgofInfo_TAB01_01
              :TabProp="tabsSub"
              :DataProp="{MGOF_CD: MGOF_CD}"
              :SaveRequestProp="saveRequest"
              @saveComplete="saveComplete"
            />
          </div>
        </v-tab-item>
        <v-tab-item>
          <div
            class="fill-height tab-contents mt-2 TAB_NAME_CompoAsMgofInfo_TAB01_01">
            <CompoAsMgofInfo_TAB01_02
              v-if="saveRequest == 'N'"
              :TabProp="tabsSub"
              :DataProp="{MGOF_CD: MGOF_CD}"
            />
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CompoAsMgofInfo_TAB01_01 from '@/components/CompoAsMgofInfo_TAB01_01.vue'; //단지 특이사항'
import CompoAsMgofInfo_TAB01_02 from '@/components/CompoAsMgofInfo_TAB01_02.vue'; //이력보기

export default {
  name: 'CompoAsMgofInfo_TAB01', //단지 특이사항
  components: {
    CompoTabItems,
    CompoAsMgofInfo_TAB01_01,
    CompoAsMgofInfo_TAB01_02,

  },
  props: {
    TabProp: {
      type: Number,
      default: null,
    },
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      tabsSub: 0,
      // tabsListSub
      tabsListSub: [
        { title: '단지 특이사항', content: 'CompoAsMgofInfo_TAB01_01', badge: false},
        { title: '이력 보기', content: 'CompoAsMgofInfo_TAB01_02', badge: false},
      ],

      MGOF_CD: '',
      saveRequest: "N"

    }
  },
  
  mounted() {
  },
  created() {
    this.MGOF_CD = this.DataProp && this.DataProp.MGOF_CD ? this.DataProp.MGOF_CD : '';  //단지코드
  },
  computed: {
  },
  watch: {
  },
  methods: {
    saveBtn() {
      this.saveRequest = "Y";
    },
    saveComplete() {
      this.saveRequest = "N";
    }

  },
};
</script>

<style lang="scss" scoped>

</style>