<template>
  <div class="is-mt-s" >
    <table class="pl-tbl-detail">
      <colgroup>
        <col width="20%" />
        <col width="33%" />
        <col width="20%" />
        <col width="" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">
            <span class="pl-label">
              주소
            </span>
          </th>
          <td colspan="3">
            <span class="pl-value-txt">
              {{ CONTRACT_ADDR }}
            </span>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              공급유형
            </span>
          </th>
          <td >
            <div >
              <span class="pl-value-txt">
                {{ SPL_TP_NM }}
              </span>
            </div>
          </td>
          <th scope="row">
            <span class="pl-label">
              전용면적
            </span>
          </th>
          <td>
            <div class="d-flex align-center">
              <span class="pl-value-txt">
                {{ DDO_AR }}
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              계약일
            </span>
          </th>
          <td >
            <span class="pl-value-txt">
              {{CTR_ST_DT}}
            </span>
          </td>
          <th scope="row">
            <span class="pl-label">
              입주일
            </span>
          </th>
          <td>
            <div class="d-flex align-center">
              <span class="pl-value-txt">
                {{MVIN_ST_DT}}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CompoInfoAsContract_TAB01', //계약정보
  components: {
  },
  props: {
    RESET_ABLE: {
      type: Boolean,
      default : false
    },
    SCH_CUSTCO_ID: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      CONTRACT_ADDR: '',//주소
      SPL_TP_NM: '',//공급유형
      DDO_AR: '',//전용면적(㎡)
      CTR_ST_DT: '',//계약일(YYYY-MM-DD)
      MVIN_ST_DT: '',//입주일(YYYY-MM-DD)
    }
  },
  methods: {
     // 상담(바로처리) - 계약정보 세팅
     setCuttContractInfo(contractInfo) {
      console.log("CompoInfoAsContract setCuttContractInfo", contractInfo)
      this.CONTRACT_ADDR = contractInfo.CONTRACT_ADDR;//주소
      this.SPL_TP_NM = contractInfo.SPL_TP_NM;//공급유형
      this.DDO_AR = contractInfo.DDO_AR ? contractInfo.DDO_AR + ' ㎡' : '';//전용면적(㎡)
      this.CTR_ST_DT = contractInfo.CTR_ST_DT ? this.mixin_convertDate(contractInfo.CTR_ST_DT, 'yyyy-MM-dd') : '';//계약일(YYYY-MM-DD)
      this.MVIN_ST_DT = contractInfo.MVIN_ST_DT ? this.mixin_convertDate(contractInfo.MVIN_ST_DT, 'yyyy-MM-dd') : '';//입주일(YYYY-MM-DD)
    },

    //초기화
    contractInit() {
      this.CONTRACT_ADDR = '';//주소
      this.SPL_TP_NM = '';//공급유형
      this.DDO_AR = '';//전용면적(㎡)
      this.CTR_ST_DT = '';//계약일(YYYY-MM-DD)
      this.MVIN_ST_DT = '';//입주일(YYYY-MM-DD)
    }
  },
  mounted() {
  },
  created() {
    this.$eventBus.$off("setCuttContractInfo");
    this.$eventBus.$on("setCuttContractInfo", (contractInfo) => {
      this.setCuttContractInfo(contractInfo);
    });
  },
  computed: {
  },
  watch: {
    RESET_ABLE() {
      // if(this.RESET_ABLE){
        this.contractInit();
      // }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>