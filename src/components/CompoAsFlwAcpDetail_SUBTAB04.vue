<template>
  <div>
    <!-- header -->
    <div class="d-flex align-center">
      <div class="pl-header is-no-boredr">
        <v-icon class="pl-icon20 square-title" style="margin-top: 2px;"></v-icon>
        <div class="pl-subtit ml-1">접촉이력 현황</div>
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s"
      :headers="headers"
      :items="CNTCT_HIST"
      fixed-header
      item-key="index"
      height="331px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다.">
      <template v-slot:item.CUTT_CN="{ item }" >
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <div
              class="is-ellips"
              v-on="on"
              v-bind="attrs"
              v-html="item.CUTT_CN"></div>
          </template>
          <div v-html="item.CUTT_CN" ></div>
        </v-tooltip>
      </template>
    </v-data-table>

  </div>
</template>

<script>
export default {
  name: "CompoAsFlwAcpDetail_SUBTAB04", //접촉이력
  components: {
  },
  props: {
    TabProp: {
      type: Number,
      default: null,
    },
    DataProp: {
      type: Object,
    },
  },
  data() {
    return {
        FLW_DTL_FULL_SN: '',

        //selectCntctHist
        CNTCT_HIST: [],

        // grid
        ROW_PER_PAGE: -1,
        headers: [
          { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false},
          { text: '상담원', value: 'EMP_NM', align: '', width: '60px', sortable: false },
          { text: '접촉일시', value: 'REG_DT', align: '', width: '130px', sortable: false },
          { text: '경로', value: 'RCPT_CHN_NM', align: '', width: '60px', sortable: false },
          { text: '접촉채널 ', value: 'CNTCT_CHNL_NM', align: '', width: '100px', sortable: false },
          { text: '대분류', value: 'CUTT_TYPE_NM_1', align: '', width: '80px', sortable: false },
          { text: '중분류', value: 'CUTT_TYPE_NM_2', align: '', width: '80px', sortable: false },
          { text: '소분류', value: 'CUTT_TYPE_NM_3', align: '', width: '80px', sortable: false },
          { text: '접촉내용', value: 'CUTT_CN', align: '', width: '230px', sortable: false },
          { text: '상담번호', value: 'PHN_CUTT_ID', align: '', width: '90px', sortable: false },
        ],
        items: [
          { index: 1, type01: '우성아', type02: '2024-06-16 10:02:45', type03: '전화', type04: '수급업체담당자', type05: '해피콜', type06: '기타', type07: '기타', type08: `1차 무응, 문자전송 2차 무응`, type09: '500033312', },
          { index: 2, type01: '우성아', type02: '2024-06-16 10:02:45', type03: '전화', type04: '접수고객', type05: '스케줄러', type06: '고객요청', type07: '통화실패', type08: `- 업체 방문하여 배관누수 범위 탐색하였으나, 확인 불가하여 내일 재방문 안내 받음
          - 추후 점검여부 확인차 연락 드림 안내`, type09: '500033312', },
          { index: 3, type01: '우성아', type02: '2024-06-16 10:02:45', type03: '전화', type04: '접수고객', type05: '스케줄러', type06: '고객요청', type07: '통화실패', type08: `- 업체 방문하여 배관누수 범위 탐색하였으나, 확인 불가하여 내일 재방문 안내 받음
          - 추후 점검여부 확인차 연락 드림 안내`, type09: '500033312', },
          { index: 4, type01: '우성아', type02: '2024-06-16 10:02:45', type03: '전화', type04: '접수고객', type05: '스케줄러', type06: '고객요청', type07: '통화실패', type08: `- 업체 방문하여 배관누수 범위 탐색하였으나, 확인 불가하여 내일 재방문 안내 받음
          - 추후 점검여부 확인차 연락 드림 안내`, type09: '500033312', },
          { index: 5, type01: '우성아', type02: '2024-06-16 10:02:45', type03: '전화', type04: '수급업체담당자', type05: '스케줄러', type06: '고객요청', type07: '통화실패', type08: `- 업체 방문하여 배관누수 범위 탐색하였으나, 확인 불가하여 내일 재방문 안내 받음
          - 추후 점검여부 확인차 연락 드림 안내`, type09: '500033312', },
        ],

    }
  },
  mounted() {
  },
  created() {
    if(this.DataProp && this.DataProp.FLW_DTL_FULL_SN) {
      this.FLW_DTL_FULL_SN = this.DataProp.FLW_DTL_FULL_SN;
      this.getCntctHist();
    }
  },
  computed: {
    
  },
  watch: {
    DataProp() {
      if(this.DataProp && this.DataProp.FLW_DTL_FULL_SN && this.FLW_DTL_FULL_SN != this.DataProp.FLW_DTL_FULL_SN) {
        this.FLW_DTL_FULL_SN = this.DataProp.FLW_DTL_FULL_SN;
        this.getCntctHist();
      }
    }
  },
  methods: {
    async getCntctHist() {
        const postParam = {
          FLW_DTL_FULL_SN: this.FLW_DTL_FULL_SN
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsFlwAcpMapper'
        }};
        const response = await this.common_postCall("/api/biz/common/select/selectCntctHist", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          this.CNTCT_HIST = response.DATA;
        }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>