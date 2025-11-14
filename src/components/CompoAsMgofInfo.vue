<template>
  <div :class="isPopup ? 'pl-quick-layer-body pb-0' : ''">
    <!-- tabs -->
    <div class="is-border-bottom">
      <v-tabs
        v-model="tabs1"
        class="pl-tabs is-noborder">
        <CompoTabItems :TabsList=tabsList1 class="mt-0" />
      </v-tabs>
    </div>
    <!-- content -->
    <div style="height: 100%" >
      <v-tabs-items
        v-model="tabs1"
        class="fill-height"
        style="background: transparent"
        >
          <v-tab-item>
            <div
              class="fill-height tab-contents mt-2 TAB_NAME_CompoAsMgofInfo_TAB01">
              <CompoAsMgofInfo_TAB01
                :TabProp="tabs1"
                :DataProp="{MGOF_CD: MGOF_CD}"
              />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div
              class="fill-height tab-contents mt-2 TAB_NAME_CompoAsMgofInfo_TAB02">
              <CompoAsMgofInfo_TAB02
                :TabProp="tabs1"
                :DataProp="{MGOF_CD: MGOF_CD}"
              />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div
              class="fill-height tab-contents mt-2 TAB_NAME_CompoAsMgofInfo_TAB03">
              <CompoAsMgofInfo_TAB03
                :TabProp="tabs1"
                :DataProp="{ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, MGOF_NM: MGOF_NM}"
              />
            </div>
          </v-tab-item>
          <v-tab-item>
            <div
              class="fill-height tab-contents mt-2 TAB_NAME_CompoAsMgofInfo_TAB04">
              <CompoAsMgofInfo_TAB04
                :TabProp="tabs1"
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
import CompoAsMgofInfo_TAB01 from '@/components/CompoAsMgofInfo_TAB01.vue'; //단지 특이사항'
import CompoAsMgofInfo_TAB02 from '@/components/CompoAsMgofInfo_TAB02.vue'; //단지정보'
import CompoAsMgofInfo_TAB03 from '@/components/CompoAsMgofInfo_TAB03.vue'; //보증정보'
import CompoAsMgofInfo_TAB04 from '@/components/CompoAsMgofInfo_TAB04.vue'; //평면도'


export default {
  name: 'CompoAsMgofInfo',
  components: {
    CompoTabItems,
    CompoAsMgofInfo_TAB01, //단지 특이사항'
    CompoAsMgofInfo_TAB02, //단지정보'
    CompoAsMgofInfo_TAB03, //보증정보'
    CompoAsMgofInfo_TAB04, //평면도'
  },
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tabs1: 0,
      // tabsList1
      tabsList1: [
        { title: '단지 특이사항', content: 'CompoAsMgofInfo_TAB01', badge: false},
        { title: '단지정보', content: 'CompoAsMgofInfo_TAB02', badge: false},
        { title: '보증정보', content: 'CompoAsMgofInfo_TAB03', badge: false},
        { title: '평면도', content: 'CompoAsMgofInfo_TAB04', badge: false},
      ],

      ARA_HDQ_CD: '', //지역본부코드
      MGOF_CD: '',  //단지코드
      MGOF_NM: '',  //단지명
      BLDG_NO: '',  //동
      HS_NO: '',  //호


    }
  },
  mounted() {
  },
  created() {
    this.ARA_HDQ_CD = this.DataProp && this.DataProp.ARA_HDQ_CD ? this.DataProp.ARA_HDQ_CD : '';  //지역본부코드
    this.MGOF_CD = this.DataProp && this.DataProp.MGOF_CD ? this.DataProp.MGOF_CD : '';  //단지코드
    this.MGOF_NM = this.DataProp && this.DataProp.MGOF_NM ? this.DataProp.MGOF_NM : '';  //단지명
    this.BLDG_NO = this.DataProp && this.DataProp.BLDG_NO ? this.DataProp.BLDG_NO : ''; //동
    this.HS_NO = this.DataProp && this.DataProp.HS_NO ? this.DataProp.HS_NO : '';  //호

  },
  computed: {
  },
  watch: {
    tabs1() {
      console.log("watch tabs1", this.tabs1)
    }
  },
  methods: {
    
  },
};
</script>

<style lang="scss" scoped>

</style>