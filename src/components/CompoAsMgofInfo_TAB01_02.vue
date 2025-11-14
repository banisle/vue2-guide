<template>
  <div>
    <v-data-table
      class="pl-grid"
      :headers="headers"
      :items="MGOF_INFO_HIST"
      fixed-header
      item-key="index"
      height="640px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :page.sync="page"
      @page-count="pageCount = $event">
      <template v-slot:item.MGOF_MEMO="{item}">
        <div style="white-space: pre;" class="py-1">
          {{ item.MGOF_MEMO }}
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'CompoAsMgofInfo_TAB01_02', //이력보기
  components: {
  },
  props: {
    TabProp: {
      type: Number,
      default: null,
    },
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      MGOF_CD: '',

      MGOF_INFO_HIST: [],

      
      page: 1,
      ROW_PER_PAGE: 15,
      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '현장 단지 명', value: 'FIELD_MGOF_NM', align: '', width: '150px', sortable: false },
        { text: '등록자', value: 'UPD_EMP_NM', align: '', width: '80px', sortable: false },
        { text: '등록일', value: 'UPD_DT', align: '', width: '140px', sortable: false },
        { text: '특이사항', value: 'MGOF_MEMO', align: '', width: '', sortable: false },
      ],
      items: [
        {
          index: 1,
          type01: '물향기마을 1단지',
          type02: '우성아',
          type03: '2024-06-18 15:25:21',
          type04: `■ AL창호 접수건 시공사(코오롱글로벌 주식회사) 반려 내용에 "금성창호 이관"이라고 되어 있는 경우 업무 진행 방법(재접수 불필요)
   → 금성창호 010-5337-2776(대표) 또는 010-2029-6640(팀장)으로 처리독촉

■ 영구임대에는 에어컨 설치되어 있음(삼성에어컨)
    - 국민임대+영구임대 단지로 공급유형으로 확인 가능

■ 신우전자 : 안정권 기사 010-8933-3119 (코티스 등록된 031-321-0786, 010-4983-0786 파주권 담당자 아님_수정요청 중)

■ 환기시스템 코오롱글로벌 주식회사(시공사) 접수 후 진행 사항 참고
- 환기시스템 접수 후 시공사에서 코티스상 완료 또는 반려처리로 등록 → 내용에 "LH직발주건-정민 콜센타접수 0/0" 기재 함(통보처리, 입주자 안내 불필요)
- 처리독촉 할 경우 : 주식회사 정민(032-876-9454)으로 독촉하시면 됩니다.`,
        },
        {
          index: 2,
          type01: '물향기마을 1단지',
          type02: '우성아',
          type03: '2024-06-18 15:25:21',
          type04: `■ AL창호 접수건 시공사(코오롱글로벌 주식회사) 반려 내용에 "금성창호 이관"이라고 되어 있는 경우 업무 진행 방법(재접수 불필요)
   → 금성창호 010-5337-2776(대표) 또는 010-2029-6640(팀장)으로 처리독촉

■ 영구임대에는 에어컨 설치되어 있음(삼성에어컨)
    - 국민임대+영구임대 단지로 공급유형으로 확인 가능

■ 신우전자 : 안정권 기사 010-8933-3119 (코티스 등록된 031-321-0786, 010-4983-0786 파주권 담당자 아님_수정요청 중)`,
        },
        {
          index: 3,
          type01: '물향기마을 1단지',
          type02: '우성아',
          type03: '2024-06-18 15:25:21',
          type04: `■ AL창호 접수건 시공사(코오롱글로벌 주식회사) 반려 내용에 "금성창호 이관"이라고 되어 있는 경우 업무 진행 방법(재접수 불필요)
   → 금성창호 010-5337-2776(대표) 또는 010-2029-6640(팀장)으로 처리독촉

■ 영구임대에는 에어컨 설치되어 있음(삼성에어컨)
    - 국민임대+영구임대 단지로 공급유형으로 확인 가능

■ 신우전자 : 안정권 기사 010-8933-3119 (코티스 등록된 031-321-0786, 010-4983-0786 파주권 담당자 아님_수정요청 중)`,
        },
        {
          index: 4,
          type01: '물향기마을 1단지',
          type02: '우성아',
          type03: '2024-06-18 15:25:21',
          type04: `■ AL창호 접수건 시공사(코오롱글로벌 주식회사) 반려 내용에 "금성창호 이관"이라고 되어 있는 경우 업무 진행 방법(재접수 불필요)
   → 금성창호 010-5337-2776(대표) 또는 010-2029-6640(팀장)으로 처리독촉

■ 영구임대에는 에어컨 설치되어 있음(삼성에어컨)
    - 국민임대+영구임대 단지로 공급유형으로 확인 가능

■ 신우전자 : 안정권 기사 010-8933-3119 (코티스 등록된 031-321-0786, 010-4983-0786 파주권 담당자 아님_수정요청 중)`,
        },
      ],
    }
  },
  methods: {
  },
  mounted() {
  },
  created() {
    this.MGOF_CD = this.DataProp && this.DataProp.MGOF_CD ? this.DataProp.MGOF_CD : '';  //단지코드
    if(this.MGOF_CD != '') {
      this.getMgofMemoHst();
    }
  },
  computed: {
  },
  watch: {
    // TabProp() {
    //   if(this.TabProp == 1 ) {
    //     this.getMgofMemoHst();
    //   }
    // }
  },
  methods: {
    async getMgofMemoHst() {
        const postParam = {
            MGOF_CD: this.MGOF_CD
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper'
        }};
        const response = await this.common_postCall("/api/biz/common/select/selectMgofMemoHst", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          this.MGOF_INFO_HIST = response.DATA;
        }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>