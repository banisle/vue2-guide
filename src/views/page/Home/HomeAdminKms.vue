<template>
  <div>
    <div class="d-flex align-center">
      <strong class="pl-card-intop--title">지식정보</strong>
      <div class="d-flex align-center ml-auto">
        <compo-tooltip-btn
          TitleProp="더보기"
          ClassProp="pl-tooltip-btn ml-1"
          IconProp="pl-icon20 plus"
          TooltipPositionProp="bottom"
          :MinWidthProp=22
          :HeightProp=22
          @btnClick="navTab"
        ></compo-tooltip-btn>
      </div>
    </div>
    <div
      class="pl-rounded-box is-mt-s pr-5 pl-3 py-3"
      :style=" computedUserDetailType === 'SYS_HUMAN' ? 'height: 319px' : computedUserDetailType === 'SYS_MANAGER' ? 'height: 367px' : 'height:367px' ">
      <ul class="pl-list-dot is-no-border spacing-wrap sp-8 flex-column mt-0">
        <li
          @click="slideDaily = true"
          v-for="item in CONTS_LIST"
          class="d-flex align-center hover-bold"
          :key="item.KMS_CONTS_ID">
          <span class="is-ellips" style="width: auto;"
          >{{ item.KMS_CONTS_NM }}</span>
          <span
            v-if="item.IS_NEW"
            class="pl-badge is-new">N</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  name: 'HomeAdminKms', //지식정보
  components: {
  },
  data() {
    return {
      CONTS_LIST: [],

    }
  },
  methods: {
    async getContsList(){

      this.CONTS_LIST = []
      let sUrl = '/api/km/right/rightContsList';

      let postParam = {
        SE_CD : 'KNOWLEDGE'
        , SRCH_CENTER_PARTIAL: this.computedUserCenter === "-1" ? "N" : "Y"
      };

      let headParam = {
        head : {
          ROW_CNT : 5,
          PAGES_CNT : 1,
          PAGING : "Y",
        }
      };
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA){
          response.DATA.map((item, idx)=>{
            item.IS_NEW = item.MDFCN_DT > this.$moment().subtract(7,'days').format('YYYYMMDD')+'000000' ? true : false
            this.CONTS_LIST.push(item)
          })
        }
      }
    },
    async navTab(){
      await this.mixin_set_active_tab({ PATH_NM : "/KMS_M0300", NODE_TITLE :"지식 콘텐츠 관리"})
    },
  },
  mounted() {
  },
  created() {
    this.getContsList()
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>