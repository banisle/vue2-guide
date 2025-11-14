<template>
  <div class="is-mt-s" >
    <v-data-table
      class="pl-grid"
      :headers="headers"
      :items="items"
      fixed-header
      item-key="RNUM"
      height="89px"
      :items-per-page="-1"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :loading="loading"
      loading-text="조회중입니다."
      >
        <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
          <template v-if="header.value === 'RNUM'">
            <th class="is-bg-th text-center" style="width: 50px">
              {{ item[header.value] }}
            </th>
          </template>
          <template v-else-if="header.value === 'REG_DT'">
            {{ mixin_convertDate(item[header.value], 'yyyy-MM-dd') }}
          </template>
          <template v-else-if="header.value === 'EXCPTN_CN'">
            <td style="width: 450px;">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on">
                  {{ item[header.value] }}</span>
                </template>
                <span>{{ item[header.value] }}</span>
              </v-tooltip>
            </td>
          </template>
          <template v-else>{{ item[header.value] }}</template>
        </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'CompoInfoAsContract_TAB02', //특이사항
  props: {
    CUST_INFO : {
      type: Object,
    },
    RESET_ABLE: {
      type: Boolean,
      default : false
    },
  },
  components: {
  },
  data() {
    return {
      loading : false,
      headers: [
        { text: '번호', value: 'RNUM', align: 'center', width: '50px', sortable: false },
        { text: '제목', value: 'EXCPTN_CN', align: '', sortable: false},
        { text: '등록자', value: 'CUSL_NM', width: '80px', sortable: false},
        { text: '등록일', value: 'REG_DT', align: 'center', width: '140px' , sortable: false},
      ],
      items: [],
    }
  },
  computed: {
  },
  watch: {
    CUST_INFO(){
      if(this.CUST_INFO.CUST_ID){
        this.getCustExcptnList();
      }
    },
    RESET_ABLE(){
      this.items = [];
      this.$eventBus.$emit('expctnBdgView', false);
    }
  },
  mounted() {
  },
  beforeDestroy(){
    this.$eventBus.$off("reloadCustExcptnList"); //eventBus 중복방지를 위해 off
  },
  async created() {
    if(this.CUST_INFO.CUST_ID){
      this.getCustExcptnList();
    }

    //고객 특이사항 목록 조회
    this.$eventBus.$on("reloadCustExcptnList", () => {
      this.getCustExcptnList();
    });
  },
  methods: {
    async getCustExcptnList() {
      if(this.CUST_INFO.CUST_ID){
        this.items = [];
        let postParam = {
          CUST_ID : this.CUST_INFO.CUST_ID
          , SCH_STTS_CD : JSON.stringify([{STTS_CD : 'RCAP1'}]) //승인
        };

        let headParam = {
          head: {
          }
        };

        this.loading = true;
        const response = await this.common_postCall("/api/cust/custExcptnList", postParam, headParam);
        
        if (!response.HEADER.ERROR_FLAG){
          this.items = response.DATA;
        }

        this.$eventBus.$emit('expctnBdgView', this.items.length > 0 ? true : false);
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>