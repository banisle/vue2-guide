<template>
  <div class="pl-quick-layer-body pb-0" style="flex: 0 0 calc(100% - 190px);">
    <div class="pl-grid-top">
      <div class="pl-grid-top-left">
        <h2 class="pl-subtit">{{ this.qaBaseData.PAPER_NM }}</h2>
      </div>
    </div>
    <v-data-table
      class="pl-grid is-mt-s"
      :headers="headers"
      :items="qaExecHistList"
      fixed-header
      item-key="VERSION_NO"
      height="660px"
      disable-pagination
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다.">
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'QAM_M0500_CS_DETAIL_03', //평가실행관리 - 평가이력
  components: {
  },
  props:{
    qaBaseData:{
      type: Object,
      default: ()=>{}
    },
    qaExecHistList:{
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '20%', sortable: false },
        { text: '평가자', value: 'MGR_EMP_NM', align: 'center', width: '20%', sortable: false  },
        { text: '평가상태', value: 'COMPLETE_YN_NM', align: 'center', width: '20%', sortable: false  },
        { text: '결과공개', value: 'APPLY_YN_NM', align: 'center', width: '20%', sortable: false  },
        { text: '수정일자', value: 'REG_DT', align: 'center', width: '20%', sortable: false  },
      ],

      currentHist:{},
    }
  },
  methods: {
    isActiveRow(item) {
      const activeClass = item === this.currentHist ? "active" : "";
      return activeClass;
    },
  },
  mounted() {
    if(this.qaExecHistList.length > 0) this.currentHist = this.qaExecHistList[0];
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