<template>
  <div>
    <v-data-table
      class="pl-grid has-control"
      :headers="headers"
      :items="items"
      fixed-header
      item-key="index"
      height="149px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :page.sync="page"
      @page-count="pageCount = $event"
      :loading="loading"
      loading-text="조회중입니다."
      >

      <template v-slot:[`item.${header.value}`]="{ item }" v-for="(header, idx) in headers">
        <div v-if="header.telYn">
          <span v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</span>
        </div>
        <div v-else>
          <span v-if="header.value === 'ACTION_DT'">
            {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}
          </span>
          <span v-else-if="header.value === 'FAVOR_ZONE'">{{ item['SIDO_NM'] + '>' + item['SIGUNGU_NM'] + '>' + item['JIGU_NM']}}</span>
          <span v-else>{{ item[header.value] }}</span>
        </div>
      </template>

    </v-data-table>
  </div>
</template>

<script>
  export default {
    props: {
      items : {
        type: Array
      },
      loading : {
        type: Boolean
        , default: false
      }
    },
    data(){
      return{
        page: 1,
        pageCount: 0,
        perPage: [15,30,50,100],
        ROW_PER_PAGE: -1,
        headers: [
          { text: '번호', value: 'DATA_KEY', align: 'center', width: '3%', sortable: false },
          { text: '유형', value: 'INTEREST_DIV_NM', align: 'left', width: '8%', sortable: false },
          { text: '관심 지역', value: 'FAVOR_ZONE', align: 'left', width: '', sortable: false  },
          { text: '휴대전화 번호', value: 'MOBILE', align: 'left', width: '7%', sortable: false, telYn: true  },
          { text: '상태', value: 'ACTION', align: 'left', width: '5%', sortable: false  },
          { text: '등록자', value: 'ACTION_EMP_NM', align: 'left', width: '6%', sortable: false  },
          { text: '등록일시', value: 'ACTION_DT', align: 'left', width: '10%', sortable: false  },
          { text: '센터', value: 'CENTER_NM', align: 'left', width: '10%', sortable: false  },
          { text: '등록요청 고객 휴대폰', value: 'MOBILE2', align: 'left', width: '10%', sortable: false, telYn: true  },
          { text: '등록요청 고객 ID', value: 'CUST_ID', align: 'left', width: '14%', sortable: false  },
        ],
      }
    },
    watch: {
    },
    computed: {
    },
    beforeDestroy(){
    },
    created() {
    },
    methods: {
    },
  }
</script>

<style lang="scss" scoped>

</style>