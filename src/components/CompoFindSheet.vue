<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            평가지명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle is-lg"
              v-model="PAPER_NM"
              placeholder="평가지명 입력"
              >
            </v-text-field>

            <v-btn
              class="pl-btn is-icon flex-grow-0"
              @click="selectQaPaperList"
              >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <!-- temp grid -->
    <v-data-table
      class="pl-grid is-mt-s has-control"
      :headers="gridheaders"
      :items="qaPaperList"
      v-model="checkedQaPaperList"
      show-select
      fixed-header
      item-key="ROW_NUM"
      height="360px"
      disable-pagination
      hide-default-footer
      :loading="loading"
      loading-text="조회중입니다."
      no-data-text="등록된 데이터가 없습니다."
      >
      <template v-slot:item.PAPER_ID={item}>
        <compo-tooltip-btn
          TitleProp="미리보기"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 board-docu"
          TooltipPositionProp="bottom"
          @btnClick="openQaPaperPreview(item)"
        ></compo-tooltip-btn>
      </template>
    </v-data-table>

    <!-- 평가지 -->
    <v-slide-x-reverse-transition>
      <div v-if=" dialogResult === true "
        class="pl-quick-layer"
        :style="tempCenterStyle"
        style="width: 800px"
              >
        <QAM_M0500_CS_DETAIL
          @Close="closeSlide()"
          :propsQaBaseData="propsQaBaseData"
          :isPreview="true"
        />
      </div>
    </v-slide-x-reverse-transition>

  </div>
</template>

<script>
import QAM_M0500_CS_DETAIL from '@/views/page/QAM_M0500_CS_DETAIL';

export default {
  name: 'CompoFindSheet', //평가지 찾기
  components: {
    QAM_M0500_CS_DETAIL,
  },
  props: {
    qaBaseData:{
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      gridheaders: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '10%',sortable: true },
        { text: '평가지명', value: 'PAPER_NM', align: '', width: '',sortable: true },
        { text: '문항수', value: 'QSTN_CNT', align: 'center', width: '13%',sortable: true },
        { text: '총점', value: 'TOT_SCORE', align: 'center', width: '13%', sortable: true },
        { text: '평가지', value: 'PAPER_ID', align: 'center', width: '13%', sortable: false },
      ],

      dialogResult:false,
      propsQaBaseData: {},

      qaPaperList: [],
      checkedQaPaperList: [],
      PAPER_NM: "",

      loading: false,

      MESSAGE: {
        ALERT:{
          FAIL: { alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '평가지를 선택해주세요.' },
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {
    async selectQaPaperList(){
      // 초기화
      this.checkedQaPaperList = [];

      // let sUrl = '/phone-api/qa/selectQaPaperList';
      let sUrl = '/api/biz/common/select/selectQaPaperList';

      let postParam = {
        CENTER_ID: this.qaBaseData.CENTER_ID,
        PAPER_NM: this.PAPER_NM,
        PAPER_TYPE: 'OPTION',
        USE_YN: "Y",
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaPaperManageMapper'
        , sn : 'selectQaPaperList'
      }};

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaPaperList = response.DATA;
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading = false;
    },

    // 평가지 추가
    addQaPlanPaper(){
      if(this.checkedQaPaperList.length <= 0){
        this.showAlert(this.MESSAGE.ALERT.FAIL);
        return;
      }

      this.$emit("Add", this.checkedQaPaperList);
    },

    // 평가지 미리보기
    openQaPaperPreview(item){
      // 평가지 팝업 변수 정보 셋팅
      this.propsQaBaseData = item;

      // 평가실행 평가지 팝업 열기
      this.dialogResult = true;
    },

    closeSlide(){
      this.dialogResult = false
    },
  },
  mounted() {
    this.selectQaPaperList();
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