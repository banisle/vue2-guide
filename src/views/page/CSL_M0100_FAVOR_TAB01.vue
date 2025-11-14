<template>
  <div>
    <v-data-table
      class="pl-grid has-control"
      show-select
      :headers="headers"
      :items="items"
      fixed-header
      item-key="RNUM"
      height="149px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      v-model="SEL_CUST_FAVOR_LIST"
      :page.sync="page"
      :item-class="isActiveRow"
      @click:row="rowClick"
      @dblclick:row="selectDetail"
      @page-count="pageCount = $event"
      :loading="loading"
      loading-text="조회중입니다."
      >

      <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
        <div v-if="header.telYn">
          <span v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</span>
        </div>
        <div v-else>
          <span v-if="header.value === 'REG_DT' || header.value === 'UPD_DT'">
            {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd') }}
          </span>
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
        ROW_PER_PAGE: 15,
        headers: [
          { text: '번호', value: 'RNUM', align: 'center', width: '3%', sortable: false },
          { text: '유형', value: 'INTEREST_DIV_CD_NM', align: 'left', width: '14%', sortable: false },
          { text: '시/도', value: 'SIDO_NM', align: 'left', width: '5%', sortable: false  },
          { text: '시/군/구', value: 'SIGUNGU_NM', align: 'left', width: '10%', sortable: false  },
          { text: '지구명', value: 'JIGU_NM', align: 'left', width: '10%', sortable: false  },
          { text: '휴대전화', value: 'MOBILE', align: 'left', width: '9%', sortable: false, telYn: true  },
          { text: '센터명', value: 'CENTER_NM', align: 'left', width: '', sortable: false  },
          { text: '등록자', value: 'REG_EMP_NM', align: 'left', width: '5%', sortable: false  },
          { text: '등록일', value: 'REG_DT', align: 'left', width: '8%', sortable: false  },
          { text: '수정자', value: 'UPD_EMP_NM', align: 'left', width: '5%', sortable: false  },
          { text: '수정일', value: 'UPD_DT', align: 'left', width: '8%', sortable: false  },
        ],

        INTERESTAREA_ID : '',
        selectedRow: {},
        SEL_CUST_FAVOR_LIST : [],
      }
    },
    watch: {
      SEL_CUST_FAVOR_LIST() {
        this.$eventBus.$emit('setSelCustFavorList', this.SEL_CUST_FAVOR_LIST);
      },

      selectedRow() {
        this.$eventBus.$emit('setSelCustFavorInfo', this.selectedRow);
      }
    },
    computed: {
    },
    beforeDestroy(){
      this.$eventBus.$off("inItSelCustFavorList"); //eventBus 중복방지를 위해 off
    },
    async created() {
      this.$eventBus.$on("inItSelCustFavorList", (CUST_INFO) => {
        this.SEL_CUST_FAVOR_LIST = [];
        this.selectedRow = {};
        this.INTERESTAREA_ID = '';
      });
    },
    methods: {
      //row 선택시 색상 변경
      isActiveRow(item) {
        const activeClass = item.INTERESTAREA_ID === this.selectedRow.INTERESTAREA_ID ? "active" : "";
        return activeClass;
      },

      //row 클릭 이벤트
      rowClick(data){
        this.selectedRow = data;
        this.INTERESTAREA_ID = data.INTERESTAREA_ID;
      },

      //관심지역 상세보기(수정)
      selectDetail(){
        this.$emit('custFavorZoneDetail');
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>