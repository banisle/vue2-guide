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

        <template v-slot:item.EVAL_ST_DD="{ item }">
          <span>{{ item.EVAL_ST_DD }} ~ {{ item.EVAL_EN_DD }}</span>
        </template>
        <!-- 응시율 -->
        <template v-slot:item.EXAM_RATE="{ item }">
            {{ mixin_formatNumber(parseInt(item.EXAM_RATE)) }}%
        </template>

        <!-- 미응시 -->
        <template v-slot:item.FAIL_CUST="{ item }">
            {{ parseInt(item.TOT_CUST) - parseInt(item.PROC_CUST) }}
        </template>

        <!-- 상태 뱃지 -->
        <template v-slot:item.STATE="{ item }">
          <span
            :class="`pl-badge is-${mixin_displayStatus(item.STATE, 'STAT_LIST')}`"
            style="width: 60px;"
            >
          {{ item.STATE }}</span>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeAdminWorkTest_TAB03', //전세임대센터
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
      //grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      headers: [
        { text: '평가 연월', value: 'EVAL_ST_MM', align: 'center font-weight-bold', width: '8%', sortable: true, },
        { text: '평가지', value: 'EVAL_TITLE', align: '', width: '', sortable: true},
        { text: '평가 시간', value: 'EVAL_ST_DD', align: 'center', width: '30%' , sortable: true},
        { text: '진행상태', value: 'STATE', align: 'center', width: '8%' , sortable: true},
        { text: '대상자', value: 'TOT_CUST', align: 'center', width: '8%' , sortable: true},
        { text: '응시', value: 'PROC_CUST', align: 'center', width: '8%' , sortable: true},
        { text: '미응시', value: 'FAIL_CUST', align: 'center is-txt-red', width: '8%' , sortable: true},
        { text: '응시율', value: 'EXAM_RATE', align: 'center', width: '8%' , sortable: true},
      ],
      items: [],
      STAT_LIST: [
        { code: '진행중', value: 'green'},
        { code: '평가전', value: 'blue'},
        { code: '평가종료', value: 'red'},
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