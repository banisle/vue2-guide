<template>
  <div :class="isPopup ? 'pl-quick-layer-body pb-0' : ''">
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            지역본부
          </span>
          <div class="pl-desc">
            <v-select
              v-model="ARA_HDQ_CD"
              :items="ARA_HDQ_CD_LIST"
              class="pl-form type-middle is-md"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            단지명
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="MGOF_NM"
              class="pl-form type-middle is-lg"
              placeholder="단지명 입력"
              @keyup.enter="mixin_showDialog('FindAsMgof')">
              <template v-slot:append>
                <v-btn
                  @click="mixin_showDialog('FindAsMgof')"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 in-search"></span>
                </v-btn>
              </template>
            </v-text-field>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            동주소(도로명)
          </span>
          <div class="pl-desc" >
            <v-text-field
              v-model="BLDG_ADR"
              class="pl-form type-middle is-lg dropInclude"
              placeholder="동주소(도로명) 입력"
              @keyup.enter="searchPost(1)">
              <template v-slot:append>
                <v-btn
                  @click="searchPost(1)"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 in-search"></span>
                </v-btn>
              </template>
            </v-text-field>
            <!-- //mark: 동주소 drop -->
            <div
              v-if="dropFindZip"
              v-click-outside="{handler: onClickOutside, include: dropInclude }"
              class="pl-drop-layer"
              style="width: 500px; transform: translate(0px, 210px);"
              >
              <div class="pl-drop-layer-body px-0">
                <v-data-table
                  class="pl-grid is-hover"
                  :headers="headersZip"
                  :items="ZIP_LIST"
                  fixed-header
                  item-key="index"
                  height="300px"
                  :items-per-page="ROW_PER_PAGE_ZIP"
                  hide-default-footer
		  no-data-text="등록된 데이터가 없습니다."
                  @click:row="rowClickZip"
                  @dblclick:row="rowDblClickZip">
                  <template v-slot:item.roadAddrPart1="{ item }">
                    <div class="is-txt-blue pl-subtit is-lg">{{ item.roadAddrPart1 }}</div>
                    <div class="is-txt-bl pt-1">{{ item.jibunAddr }}</div>
                  </template>
                </v-data-table>
                <div class="pl-pager justify-center">
                  <v-pagination
                    v-model="pageZip"
                    :length="pageCountZip"
                    circle
                    :total-visible="10"
                    @input="searchPost">
                  </v-pagination>
                </div>
              </div>
            </div>
            <v-text-field
              v-model="BLDG_NO"
              class="pl-form type-middle is-xss"
              placeholder="동"
              >
            </v-text-field>
            <v-text-field
              v-model="HS_NO"
              class="pl-form type-middle is-xss"
              placeholder="호"
              >
            </v-text-field>
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0"
            @click="searchAdrList()">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="initSrchCondition()"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>
    <!-- temp grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover"
      :headers="headers"
      :items="ADR_LIST"
      fixed-header
      item-key="ROW_NUMBER"
      height="360px"
      :items-per-page="ROW_PER_PAGE"
      @click:row="rowClick"
      @dblclick:row="rowDblClick"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :loading="isLoading"
      loading-text="조회중입니다."
      >
      <!-- 단지 명 -->
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

      <!-- 단지 주소 -->
      <template v-slot:item.BLDG_ADR="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.BLDG_ADR }}</span>
          </template>
          <span>{{ item.BLDG_ADR }}</span>
        </v-tooltip>
      </template>

    </v-data-table>

    <!-- dialog: 단지명 검색 -->
    <v-dialog
      v-model="dialogFindAsMgof"
      content-class="dialog-draggable"
      width="800"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="단지명 검색"
        @hide="mixin_hideDialog('FindAsMgof')"
        @submit="submitDialog('FindAsMgof')"
        >
        <template slot="body">
          <CompoFindAsMgof
            @setItem="setMgof"
            @closeDialog="mixin_hideDialog('FindAsMgof')"
          />
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoFindAsMgof from '@/components/CompoFindAsMgof.vue'
export default {
  name: 'CompoFindAsAdr', //주소 검색
  components: {
    CompoFindAsMgof,
  },
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //지역본부 목록
      ARA_HDQ_CD_LIST: [],

      // search
      ARA_HDQ_CD: '',
      MGOF_NM: '',
      MGOF_CD: '',
      BLDG_ADR: '',
      BLDG_NO: '',
      HS_HO: '',
      PHN_CUTT_ID: '',


      ZIP_LIST: [],
      SEL_ROW_ZIP: {},


      // 동주소 팝업
      dropFindZip: false,
      pageZip: 1,
      pageCountZip: 0,
      totalCountZip: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE_ZIP: 15,
      // paginationZip: {
      //   page: 1,
      //   rowsPerPage: 100,
      //   sortBy: "",
      //   descending: ""
      // },
      nextDisabled:true,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      headersZip: [
        { text: '우편번호', value: 'zipNo', align: 'center', width: '80px', sortable: false },
        { text: '주소', value: 'roadAddrPart1',  width: '', sortable: false, align: ' py-2' },
      ],
      itemsAddress: [
        {
          POST_NUM: '12109',
          ADDRESS: '경기도 남양주시 순화궁로 18',
          ADDRESS_NEW: '경기도 남양주시 별내동 1047 신안안스빌아파트',
        },
        {
          POST_NUM: '12109',
          ADDRESS: '경기도 남양주시 순화궁로 18',
          ADDRESS_NEW: '경기도 남양주시 별내동 1047 신안안스빌아파트',
        },
        {
          POST_NUM: '12109',
          ADDRESS: '경기도 남양주시 순화궁로 18',
          ADDRESS_NEW: '경기도 남양주시 별내동 1047 신안안스빌아파트',
        },
        {
          POST_NUM: '12109',
          ADDRESS: '경기도 남양주시 순화궁로 18',
          ADDRESS_NEW: '경기도 남양주시 별내동 1047 신안안스빌아파트',
        },
        {
          POST_NUM: '12109',
          ADDRESS: '경기도 남양주시 순화궁로 18',
          ADDRESS_NEW: '경기도 남양주시 별내동 1047 신안안스빌아파트',
        },
        {
          POST_NUM: '12109',
          ADDRESS: '경기도 남양주시 순화궁로 18',
          ADDRESS_NEW: '경기도 남양주시 별내동 1047 신안안스빌아파트',
        },
        {
          POST_NUM: '12109',
          ADDRESS: '경기도 남양주시 순화궁로 18',
          ADDRESS_NEW: '경기도 남양주시 별내동 1047 신안안스빌아파트',
        },
        {
          POST_NUM: '12109',
          ADDRESS: '경기도 남양주시 순화궁로 18',
          ADDRESS_NEW: '경기도 남양주시 별내동 1047 신안안스빌아파트',
        },
      ],



      //주소 목록
      ADR_LIST: [],

      SEL_ROW: {},
      isLoading: false,


      // search
      modelCenter: '경기북부지역본부',
      dropItems: ['경기북부지역본부'],
      dialogFindAsMgof: false,

      ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      // ROW_PER_PAGE: 14, //페이징 없이 전체 화면 뿌릴때

      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '지역본부', value: 'ARA_HDQ_NM', align: 'center',  width: '160px', sortable: false },
        { text: '단지코드', value: 'MGOF_CD',  width: '100px', sortable: false },
        { text: '단지명', value: 'MGOF_NM', align: 'center text-left-important',  width: '20%',sortable: false },
        { text: '세부 주소', value: 'BLDG_ADR', align: 'center text-left-important',  width: '', sortable: false },
        { text: '동', value: 'BLDG_NO', align: 'center', width: '70px' , sortable: false},
        { text: '호', value: 'HS_NO', align: 'center', width: '70px', sortable: false },
        { text: '공급 유형', value: 'MGOF_TP_NM', align: 'center text-left-important',  width: '180px', sortable: false },
      ],
      items: [
        {
          index: 14,
          type1: '경기북부지역본부',
          type2: 'C02666',
          type3: '파주운정3 A37BL(물향기1)',
          type4: '경기도 파주시 운정중앙로 200(목동동, 물향기마을 1단지 아파트)',
          type5: '107',
          type6: '1602',
          type7: '국민임대+영구임대+임대상가',
        },
        { index: 13, type1: '', type2: '', type3: '', type4: '', type5: '', type6: '', type7: '', },
        { index: 12, type1: '', type2: '', type3: '', type4: '', type5: '', type6: '', type7: '', },
        { index: 11, type1: '', type2: '', type3: '', type4: '', type5: '', type6: '', type7: '', },
        { index: 10, type1: '', type2: '', type3: '', type4: '', type5: '', type6: '', type7: '', },
        { index: 9, type1: '', type2: '', type3: '', type4: '', type5: '', type6: '', type7: '', },
        { index: 8, type1: '', type2: '', type3: '', type4: '', type5: '', type6: '', type7: '', },
        { index: 7, type1: '', type2: '', type3: '', type4: '', type5: '', type6: '', type7: '', },
        { index: 6, type1: '', type2: '', type3: '', type4: '', type5: '', type6: '', type7: '', },
        { index: 5, type1: '', type2: '', type3: '', type4: '', type5: '', type6: '', type7: '', },
        { index: 4, type1: '', type2: '', type3: '', type4: '', type5: '', type6: '', type7: '', },
        { index: 3, type1: '', type2: '', type3: '', type4: '', type5: '', type6: '', type7: '', },
        { index: 2, type1: '', type2: '', type3: '', type4: '', type5: '', type6: '', type7: '', },
        { index: 1, type1: '', type2: '', type3: '', type4: '', type5: '', type6: '', type7: '', },
      ],


      //알림창 메시지
      MESSAGE : {
        ALERT : {
          REQUIRED_ARA_HDQ_CD: {alertDialogToggle: true, msg: '지역본부를 선택해주세요.', iconClass: 'is-info', type: 'default'}
          , REQUIRED_MGOF_NM_BLDG_ADR: {alertDialogToggle: true, msg: '단지명, 동주소 중 하나 이상 입력하세요.', iconClass: 'is-info', type: 'default'}
          , REQUIRED_HS_NO: {alertDialogToggle: true, msg: '호수를 입력하세요.', iconClass: 'is-info', type: 'default'}
          , WORD_CHECK : {alertDialogToggle: true, msg: '검색어를 입력해 주세요.', iconClass: 'is-caution', type: 'default'}
          , SPECIAL_WORD_CHECK : {alertDialogToggle: true, msg: '특수문자를 입력 할수 없습니다.', iconClass: 'is-caution', type: 'default'}
        },
      }
    }
  },
  mounted() {
  },
  async created() {
    this.ARA_HDQ_CD = this.DataProp.ARA_HDQ_CD ? this.DataProp.ARA_HDQ_CD : '';
    this.MGOF_NM = this.DataProp.MGOF_NM ? this.DataProp.MGOF_NM : '';
    this.MGOF_CD = this.DataProp.MGOF_CD ? this.DataProp.MGOF_CD : '';
    this.BLDG_NO = this.DataProp.BLDG_NO ? this.DataProp.BLDG_NO : '';
    this.HS_NO = this.DataProp.HS_NO ? this.DataProp.HS_NO : '';
    this.PHN_CUTT_ID = this.DataProp.PHN_CUTT_ID ? this.DataProp.PHN_CUTT_ID : '';

    //지역본부 목록 - ARA_HDQ_CD_LIST에 설정함.
    this.mixinAsGetAsAraHdqCdList();

    if(this.ARA_HDQ_CD != '' && (this.MGOF_NM != '' || this.BLDG_ADR != '')) {
      this.searchAdrList();
    }

  },
  computed: {
  },
  watch: {
  },
  methods: {
    onClickOutside(){
      this.dropFindZip = false
    },
    dropInclude () {
      return [document.querySelector('.dropInclude')]
    },
    getResponseData (response, strHeadText = '선택') {
      let responseData = [];
      if(!response.HEADER.ERROR_FLAG) {
          response.DATA.map(item => {
              responseData.push({text: item.CD_NM, value: item.CD})
          });
      }

      //전체, 선택 등 값이 있다면 추가.
      if (strHeadText != "" && strHeadText != undefined) {
          responseData.unshift({ text: strHeadText, value: "" });
      }
      return responseData;
    },


    //지역본부 목록 조회
    async getAsAraHdqCdList() {
        const postParam = {
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectCotisAraHdqCdList", postParam, headParam);
        const responseData = this.getResponseData(response);
        return responseData;
    },

    //동주소 검색
    async searchAdrList() {

      if(this.ARA_HDQ_CD == '') {
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_ARA_HDQ_CD);
        return
      }
      if(this.MGOF_NM == '' && this.BLDG_ADR == '') {
        //단지명, 동주소 중 하나이상 입력하세요.
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_MGOF_NM_BLDG_ADR);
        return
      }
      if(this.HS_NO == '') {
        //호수를 입력하세요.
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_HS_NO);
        return
      }
      this.ADR_LIST = [];
      let postParam = {
        ARA_HDQ_CD: this.ARA_HDQ_CD,
        MGOF_NM: this.MGOF_NM,
        BLDG_ADR: this.BLDG_ADR,
        BLDG_NO: this.BLDG_NO,
        HS_NO: this.HS_NO,
      };
      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
      }};
      this.isLoading = true;
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisAdrList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.ADR_LIST = response.DATA;
      }
      this.isLoading = false;
    },


    checkSearchedWord(searchInput){
      if(searchInput.length >0){
        //특수문자 제거
        var expText = /[%=><]/ ;
        if(expText.test(searchInput) == true){
          this.showAlert(this.MESSAGE.ALERT.SPECIAL_WORD_CHECK);
          this.searchInput = searchInput.split(expText).join("");
          return false;
        }

        //특정문자열(sql예약어의 앞뒤공백포함) 제거
        var sqlArray = new Array(
          //sql 예약어
          "OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE", "DROP", "EXEC",
                    "UNION",  "FETCH", "DECLARE", "TRUNCATE"
        );

        var regex;
        for(var i=0; i<sqlArray.length; i++){
          regex = new RegExp( sqlArray[i] ,"gi") ;

          if (regex.test(searchInput) ) {
              alert("\"" + sqlArray[i]+"\"와(과) 같은 특정문자로 검색할 수 없습니다.");
            this.searchInput = searchInput.replace(regex, "");
            return false;
          }
        }
      }else{
        this.showAlert(this.MESSAGE.ALERT.WORD_CHECK);
        return false;
      }
      return true ;
    },

    async searchPost(page = 1) {
        if (!this.checkSearchedWord(this.BLDG_ADR)) {
        return ;
      }
      // 동주소 팝업 리스트
      this.dropFindZip = true
      this.ZIP_LIST = [];
      this.pageZip = page; //페이징 처리 초기화

      let sUrl = '/api/common/searchZip';
      let postParam = {
        currentPage : this.pageZip
        , countPerPage : this.ROW_PER_PAGE_ZIP
        , resultType : 'json'
        , keyword : this.BLDG_ADR
      }

      let headParam = {
        head : {
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        let postErrorCode = response.DATA[0].POST.results.common.errorCode;
        let postErrorMsg = response.DATA[0].POST.results.common.errorMessage;

        if(postErrorCode === '0'){
          let tempDataText = response.DATA[0].POST.results.juso;
          let idx = 1;
          for(let i in tempDataText){
            tempDataText[i]["index"]= idx++;
          }

          this.ZIP_LIST = tempDataText

          //다음
          //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다

          this.totalCountZip = response.DATA[0].POST.results.common.totalCount;
          this.pageCountZip = parseInt(this.totalCountZip / this.ROW_PER_PAGE_ZIP);
        }else{
          this.showAlert({alertDialogToggle: true, msg: postErrorMsg, iconClass: 'is-caution', type: 'default'});
        }
      }
    },

    rowClick(item) {
      this.SEL_ROW = item;
    },

    //로우 더블클릭
    rowDblClick() {
      if(this.PHN_CUTT_ID != '') {
        this.showConfirmInfo({
          msg : '기존 주소로 상담 저장한 건이 있습니다. 새로운 주소로 상담을 세팅하시겠습니까?'
            , callYes : () => {
              // this.$emit("setItem", this.SEL_ROW);
              this.$emit("sendDataToParent", this.SEL_ROW);
              this.$eventBus.$emit('closeSearchPopup');
              this.closeAlert();
            }
            , callNo : this.closeAlert
        })
      } else {
        // this.$emit("setItem", this.SEL_ROW);
        this.$emit("sendDataToParent", this.SEL_ROW);
        this.$eventBus.$emit('closeSearchPopup');
      }
      
    },

    //검색 조건 초기화.
    initSrchCondition() {
      this.ARA_HDQ_CD = '';
      this.MGOF_NM = '';
      this.MGOF_CD = '';
      this.BLDG_ADR = '';
      this.BLDG_NO = '';
      this.HS_HO = '';
    },

    rowClickZip(item) {
      this.SEL_ROW_ZIP = item;
    },

    //로우 더블클릭
    rowDblClickZip() {
      this.BLDG_ADR = this.SEL_ROW_ZIP.roadAddrPart1
      this.dropFindZip = false;
    },

    //단지명 검색 다이얼로그 - 더블클릭으로 선택 시
    setMgof(item) {
      this.ARA_HDQ_CD = item.ARA_HDQ_CD;
      this.MGOF_CD = item.MGOF_CD;
      this.MGOF_NM = item.COTIS_MGOF_NM;

      this.mixin_hideDialog('FindAsMgof')
    },




  },
};
</script>

<style lang="scss" scoped>

</style>