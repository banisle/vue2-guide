<template>
  <div>
    
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s"
      :headers="headers"
      :items="NTBC_LIST"
      fixed-header
      item-key="index"
      height="562px"
      :items-per-page="ROW_PER_PAGE"
      @click:row="rowClick"
      @dblclick:row="setCustCuttInfo"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :loading="isLoading"
      loading-text="조회중입니다."
      >
      <!--AS접수번호-->
      <template v-slot:item.V_FLW_ACP_SN="{ item }" >
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span class="ml-1 spacing-wrap sp-8" style="flex-wrap: wrap;">
                <span class="pl-badge is-blueGray hover-line" style="width: auto;"
                  v-on="on"
                  v-attrs="attrs">
                  {{ item.V_FLW_ACP_SN }}
                </span>
            </span>
          </template>
          <div v-html="item.V_FLW_ACP_SN" ></div>
        </v-tooltip>
      </template>
      <!-- 반려사유 -->
      <template v-slot:item.TDN_RSN="{ item }" >
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <div
              class="my-2"
              style="overflow: hidden; display: -webkit-box; white-space: normal; -webkit-box-orient: vertical; -webkit-line-clamp: 3;"
              v-on="on"
              v-attrs="attrs"
              v-html="item.TDN_RSN"></div>
          </template>
          <div v-html="item.TDN_RSN" ></div>
        </v-tooltip>
      </template>
      <!-- 지역본부 -->
      <template v-slot:item.ARA_HDQ_NM="{ item }" >
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <div
              class="my-2"
              style="white-space: normal;"
              v-on="on"
              v-attrs="attrs"
              v-html="item.ARA_HDQ_NM"></div>
          </template>
          <div v-html="item.ARA_HDQ_NM" ></div>
        </v-tooltip>
      </template>
      <!-- 단지 -->
      <template v-slot:item.MGOF_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.MGOF_NM }}</span>
          </template>
          <span>{{ item.MGOF_NM }}</span>
        </v-tooltip>
      </template>
      <!-- 업체명 -->
      <template v-slot:item.FRM_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.FRM_NM }}</span>
          </template>
          <span>{{ item.FRM_NM }}</span>
        </v-tooltip>
      </template>

      <!-- 처리진행 내용 -->
      <template v-slot:item.PROC_CNTNT="{ item }">
        <td class="pa-1">
          <v-textarea
            v-model="item.PROC_CNTNT"
            class="pl-form"
            rows="3"
            row-height="20"
            :spellcheck="false"
            auto-grow
          />
        </td>
      </template>

      <!-- 저장 -->
      <template v-slot:item.PHN_CUTT_ID="{ item }">
        <td class="px-0 text-center">
          <v-btn
            class="pl-btn is-esp is-sm"
            @click="btnSave(item)">저장</v-btn>
        </td>
      </template>


    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'CompoNotarget', //상담 모니터링 - 미대상 다이얼로그
  components: {
  },
  data() {
    return {

      NTBC_LIST: [],
      SEL_ROW: {},

      // grid
      isLoading: false,
      ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      // ROW_PER_PAGE: 14, //페이징 없이 전체 화면 뿌릴때

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: 'AS 접수번호', value: 'V_FLW_ACP_SN', align: 'center', width: '110px', sortable: false },
        { text: '사유', value: 'FLW_PGRS_SS_NM',  width: '60px', sortable: false },
        { text: '반려사유', value: 'TDN_RSN',  width: '14%',sortable: false },
        { text: '지역본부', value: 'ARA_HDQ_NM',  width: '100px', sortable: false },
        { text: '단지', value: 'MGOF_NM', align: '', width: '100px' , sortable: false},
        { text: '업체명', value: 'FRM_NM', align: '', width: '120px', sortable: false },
        { text: '반려일자', value: 'TDN_YMD',  width: '80px', sortable: false },
        { text: '접수자', value: 'FLW_RCPR',  align: 'center', width: '50px', sortable: false },
        { text: '통보여부', value: 'PROC_YN', align: 'center', width: '60px', sortable: false },
        { text: '처리진행 내용', value: 'PROC_CNTNT',  width: '150px', sortable: false },
        { text: '저장', value: 'PHN_CUTT_ID', align: 'center', width: '70px', sortable: false },
      ],
      items: [
        {
          index: 14,
          type1: '240610-47-04567',
          type2: '업체반려',
          type3: '(기타)자동복구 기타사유로 반려합니다. ',
          type4: '경기북부지역본부',
          type5: '파주운정3 A37',
          type6: '주식회사거륜',
          type7: '2024-06-20',
          type8: '우성아',
          type9: 'N',
          type10: '',
          type11: true,
        },
        {
          index: 13,
          type1: '240610-47-04567',
          type2: '업체반려',
          type3: '장마 피해세대로 순차적 작업진행 중 선 작업 완료 후 재 접수 예정. 입주민',
          type4: '서울지역본부',
          type5: '파주운정3 A37',
          type6: '주식회사거륜',
          type7: '2024-06-20',
          type8: '우성아',
          type9: 'N',
          type10: '',
          type11: true,
        },
        
        { index: 5, type1: '240610-47-04567', type2: '본부반려', type3: '장기 접수 건으로 반려합니다. 현재 미처리된 사항은 재 접수 바랍니다.', type4: '서울지역본부', type5: '파주운정3 A37', type6: '주식회사거륜', type7: '2024-06-20', type8: '우성아', type9: 'N', type10: '', type11: true, },
        { index: 4, type1: '240610-47-04567', type2: '본부반려', type3: '장기 접수 건으로 반려합니다. 현재 미처리된 사항은 재 접수 바랍니다.', type4: '서울지역본부', type5: '파주운정3 A37', type6: '주식회사거륜', type7: '2024-06-20', type8: '우성아', type9: 'N', type10: '', type11: true, },
        { index: 3, type1: '240610-47-04567', type2: '본부반려', type3: '장기 접수 건으로 반려합니다. 현재 미처리된 사항은 재 접수 바랍니다.', type4: '서울지역본부', type5: '파주운정3 A37', type6: '주식회사거륜', type7: '2024-06-20', type8: '우성아', type9: 'N', type10: '', type11: true, },
      ],
    }
  },
  methods: {
    
    //상담 모니터링 - 미대상 목록 조회
    async getNtbcList() {
      console.log("getNtbcList");
      this.NTBC_LIST = [];
      const postParam = {
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCuttMapper'
      }};
      this.isLoading = true;
      let response = await this.common_postCall("/api/biz/common/select/selectNtbcList ", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        
        this.NTBC_LIST = response.DATA;
        console.log("this.NTBC_LIST", this.NTBC_LIST)

      }
      this.isLoading = false;
    },

    async btnSave(item) {
      this.showConfirmInfo({
        msg:'처리진행내용을 저장하시겠습니까?'
        , callYes: () => {
          this.save(item);
          this.closeAlert();
        }
        , callNo: this.closeAlert
      });

      
    },

    async save(item) {
      const postParam = {
        FLW_DTL_FULL_SN: item.FLW_DTL_FULL_SN,
				PROC_CNTNT: item.PROC_CNTNT,
      };
      const headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCuttMapper'
      }};
      let response = await this.common_postCall("/api/biz/common/update/updateCallRcvUntarget ", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({msg:'정상 처리 되었습니다.'})
      }
    },

    rowClick(item) {
      this.SEL_ROW = item;
    },

    setCustCuttInfo(){
      if(Number(this.CTI_CALL_STAT.replace('stat', '')) === 5){
        this.showAlertInfo({msg : '대기 중에는 다른 업무를 수행할 수 없습니다.'});
        return;
      }else if(Number(this.CTI_CALL_STAT.replace('stat', '')) === 6){
        this.showAlertInfo({msg : '콜 상담 중에는 다른 업무를 수행할 수 없습니다.<br>상담을 먼저 처리해주세요.'});
        return;
      }else{
        //전화상담탭이 있는지 확인
        let m0100 = false;
        if(this.$store.getters['commonStore/GE_COMMON_ACTIVE_TAB'].id === 'CSL_M0100') m0100 = true;

        if(!m0100) this.mixin_set_active_tab({PATH_NM:'/CSL_M0100', NODE_TITLE:'전화상담'});
        setTimeout(() => {
          this.SEL_ROW.MON_Q_TASK = "NTBC";//미대상
          console.log("setCustCuttInfo", this.SEL_ROW)
          this.$eventBus.$emit('setCuttUnProcCustInfo', this.SEL_ROW);
          this.$emit("close")
        }, !m0100?1000:10);
      }
    }
  },
  mounted() {
  },
  created() {
    this.getNtbcList();
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>