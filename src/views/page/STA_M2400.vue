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
              <component :is="item.content"
                         :SRCH_COMBO_PROP="{'ARA_HDQ_CD_LIST':ARA_HDQ_CD_LIST,'HPC_SURVEY_LIST':HPC_SURVEY_LIST,'HPC_CODE_LIST':HPC_CODE_LIST}"
              ></component>
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
import STA_M2400_TAB01 from '@/views/page/STA_M2400_TAB01.vue';
import STA_M2400_TAB02 from '@/views/page/STA_M2400_TAB02.vue';

export default {
  name: 'MENU_STA_M2400', //해피콜 결과 통계
  components: {
    CompoTabItems,
    STA_M2400_TAB01,
    STA_M2400_TAB02,
  },
  data() {
    return {
      tabs1: null,
      // tabsList1
      TabsList: [
        { title: '업체별', content: 'STA_M2400_TAB01', badge: false },
        { title: '단지별', content: 'STA_M2400_TAB02', badge: false },
      ],

      ARA_HDQ_CD_LIST : [],
      HPC_SURVEY_LIST : [],
      HPC_CODE_LIST : [],
    }
  },
  async created() {
    let codeName = ['HC']; //접수채널, 처리매체코드
    let common_code = await this.mixin_common_code_get_all(codeName);
    this.HPC_CODE_LIST = await this.mixin_common_code_get_global(common_code, 'HC', '4', '전체')
    //지역본부 목록 - ARA_HDQ_CD_LIST에 설정함.
    this.mixinAsGetAsAraHdqCdList();
    this.getHpcSurveyList();
  },
  mounted() {
  },
  methods: {
    async getHpcSurveyList(){
      const response = await this.common_postCall('/api/biz/common/select/selectHpcSurveyList', {SRCH_CUSTCO_ID:4}, {head:{ns:'lhcs.statistics.dao.xml.StatisticsHappyCallMapper'}})
      if( !response.HEADER.ERROR_FLAG ){
        response.DATA.map(item=>{
          item.text = item.PAPER_TITLE
          item.value = item.PAPER_ID
          this.HPC_SURVEY_LIST.push(item)
        })
      }
    }

  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>