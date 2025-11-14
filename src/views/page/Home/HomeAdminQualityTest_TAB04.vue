<template>
  <div>
    <!-- grid -->
    <div class="d-flex align-center px-0" >
      <v-data-table
        class="pl-grid has-img is-header-lg theme-simple"
        :headers="headers"
        :items="list"
        item-class="cellClass"
        fixed-header
        item-key="ROW_NUM"
        height="244px"
        disable-pagination
        hide-default-footer
        :loading="loading"
        loading-text="조회중입니다."
        no-data-text="등록된 데이터가 없습니다.">
        <!-- 상태 뱃지 -->
        <template v-slot:item.PROC_STAT_NM="{ item }">
          <span
            :class="`pl-badge is-${mixin_displayStatus(item.PROC_STAT_NM, 'STAT_LIST')}`"
            style="width: 60px;"
            >
          {{ item.PROC_STAT_NM }}</span>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeAdminQualityTest_TAB04', //공가해소센터
  components: {
  },
  props:{
    list:{ 
      type: Array,
      default: () => [],
    },

    loading:{
      type:Boolean,
      default: () => false,
    }
  },
  data() {
    return {
      headers: [
        { text: '평가 연월', value: 'STD_MT', align: 'center font-weight-bold', width: '8%', sortable: false, },
        { text: '회차', value: 'STD_MT_ORD', align: 'center', width: '6%', sortable: false},
        { text: '평가지', value: 'PAPER_NM', align: '', width: '' , sortable: false},
        { text: '평가 기간', value: 'STD_ST_EN_DD', align: 'center', width: '15%' , sortable: false},
        { text: '대상자', value: 'TGT_EMP_CNT', align: 'center', width: '8%' , sortable: false},
        { text: '평가건수', value: 'STD_CNT', align: 'center', width: '8%' , sortable: false},
        { text: '결과공개', value: 'APPLY_CNT', align: 'center', width: '8%' , sortable: false},
        // { text: '마감일', value: 'CLOS_DATE', align: 'center', width: '8%' , sortable: false},
        { text: '진행상태', value: 'PROC_STAT_NM', align: 'center', width: '8%' , sortable: false},
      ],
     
      STAT_LIST: [
        { code: '진행중', value: 'green'},
        { code: '마감', value: 'red'},
      ],
    }
  },
  methods: {
  },
  mounted() {
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