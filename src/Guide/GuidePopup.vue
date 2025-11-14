<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <compo-tooltip-btn
        TitleProp="윈도우 팝업 열기"
        ClassProp="pl-tooltip-btn"
        IconProp="pl-icon20 openPop"
        TooltipPositionProp="bottom"
        @btnClick="mixin_openWindow( 'LayoutPopup', '675', '720', send_item)"
      ></compo-tooltip-btn>
      <v-btn
        color="success"
        @click="mixin_openWindow( 'LayoutPopup', '1750', '820', send_item2)"
      >스케줄러이관 목록</v-btn>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />
  </div>
</template>



<script>
import guideJs from '@/Guide/guide.js'
export default {
  name: "VuePopup",
  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: {
  },
  data() {
    return {
      toplink: [
        'Default',
      ],

      send_item: {
        compo_name: 'CSL_M0100_CS_TAB01_DETAIL'
      },
      send_item2: {
        title: '스케줄러이관 목록',
        compo_name: 'CompoAsTransSchedulerManager'
      },

      source01: null,
      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<compo-tooltip-btn
  TitleProp="윈도우 팝업 열기"
  ClassProp="pl-tooltip-btn"
  IconProp="pl-icon20 openPop"
  TooltipPositionProp="bottom"
  @btnClick="mixin_openWindow( 'LayoutPopup', '675', '720', send_item)"
></compo-tooltip-btn>`
          },
          { tab: "script", content:
`send_item: {
  compo_name: 'CSL_M0100_CS_TAB01_DETAIL'
},` },
        ],
      }
    }
  },
  methods: {

  },
  computed: {
  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>