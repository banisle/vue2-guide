<template>
  <div class="is-mt-s">
    <table class="pl-tbl-detail">
      <colgroup>
        <col width="77px" />
        <col width="77px" />
        <col width="77px" />
        <col width="" />
        <col width="77px" />
        <col width="130px" />
        <col width="77px" />
        <col width="" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">
            <span class="pl-label">
              상담사
            </span>
          </th>
          <td >
          <v-text-field
            v-model="RCV_SCHEDULER_STATUS.EMP_NM"
              disabled
              class="pl-form is-auto"
              placeholder="" />
          </td>
          <th scope="row">
            <span class="pl-label">
              통화예약
            </span>
          </th>
          <td >
          <v-text-field
            v-model="RCV_SCHEDULER_STATUS.RSRV_YMD"
              disabled
              class="pl-form is-auto"
              placeholder="" />
          </td>
          <th scope="row">
            <span class="pl-label">
              방문확정일
            </span>
          </th>
          <td >
          <v-text-field
            v-model="RCV_SCHEDULER_STATUS.LST_VISIT_SCH_DT"
              disabled
              class="pl-form is-auto"
              placeholder="" />
          </td>
          <th scope="row">
            <span class="pl-label">
              완료유형
            </span>
          </th>
          <td >
          <v-text-field
            v-model="RCV_SCHEDULER_STATUS.SCH_STAT_TYPE_NM"
              disabled
              class="pl-form is-auto"
              placeholder="" />
          </td>
        </tr>
        <tr>
          <th scope="row">
            <span class="pl-label">
              제외유형
            </span>
          </th>
          <td >
          <v-text-field
            v-model="RCV_SCHEDULER_STATUS.WORK_TYPE_NM"
              disabled
              class="pl-form is-auto"
              placeholder="" />
          </td>
          <th scope="row">
            <span class="pl-label">
              메모
            </span>
          </th>
          <td colspan="5">
          <v-text-field
          v-model="RCV_SCHEDULER_STATUS.RSRV_CNTNT"
            disabled
            class="pl-form is-auto"
            placeholder="" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "CompoAsFlwAcpDetail_SCHEDULE", //스케줄러 현황
  components: {
  },
  props: {
    TabProp: {
      type: Number,
      default: null,
    },
    DataProp: {
      type: Object,
    }
  },
  data() {
    return {
      FLW_DTL_FULL_SN: '',
      
      RCV_SCHEDULER_STATUS: {},

    }
  },
  mounted() {
  },
  created() {
    if(this.DataProp && this.DataProp.FLW_DTL_FULL_SN) {
      this.FLW_DTL_FULL_SN = this.DataProp.FLW_DTL_FULL_SN;
      this.getRcvSchedulerStatus();
    }
  },
  computed: {
    
  },
  watch: {
    DataProp() {
      if(this.DataProp && this.DataProp.FLW_DTL_FULL_SN && this.FLW_DTL_FULL_SN != this.DataProp.FLW_DTL_FULL_SN) {
        this.FLW_DTL_FULL_SN = this.DataProp.FLW_DTL_FULL_SN;
        this.getRcvSchedulerStatus();
      }
    }
  },
  methods: {
    async getRcvSchedulerStatus() {
        const postParam = {
          FLW_DTL_FULL_SN: this.FLW_DTL_FULL_SN
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsFlwAcpMapper'
        }};
        const response = await this.common_postCall("/api/biz/common/select/selectRcvSchedulerStatus", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          this.RCV_SCHEDULER_STATUS = response.DATA[0] ? response.DATA[0] : {};

          this.$emit("setRcvSchedulerStatus", this.RCV_SCHEDULER_STATUS);
        }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>