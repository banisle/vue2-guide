<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            검색
            <!-- <v-icon class="pl-icon20 required"></v-icon> -->
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="CUST_NM"
              class="pl-form type-middle"
              placeholder="고객명"
              @keyup.enter="search('')">
              <template v-slot:prepend>
                <v-icon class="pl-icon20 cs-black ml-1"></v-icon>
              </template>
            </v-text-field>
            <v-text-field
              v-model="CUST_PHN_NO"
              class="pl-form type-middle"
              placeholder="전화번호"
              @keyup.enter="search('')">
              <template v-slot:prepend>
                <v-icon class="pl-icon20 cs-phone ml-1"></v-icon>
              </template>
            </v-text-field>
            <v-text-field
              v-model="CUST_IDNTF_NO"
              class="pl-form type-middle is-lg"
              placeholder="고객 ID"
              >
            </v-text-field>

            <v-btn
              class="pl-btn is-icon flex-grow-0"
              @click="search('')"
            >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
            <!-- 툴팁 버튼 -->
            <compo-tooltip-btn
              TitleProp="초기화"
              ClassProp="pl-tooltip-btn flex-grow-0"
              IconProp="pl-icon20 refresh"
              TooltipPositionProp="bottom"
              @btnClick="CUST_NM = ''; CUST_PHN_NO = ''; CUST_IDNTF_NO = ''; search('')"
            ></compo-tooltip-btn>
          </div>
        </div>
      </div>
      <!--바로처리센터(인바운드) 버튼-->
      <template v-if="CUSTCO_ID === '4'  && computedUserDefaultCuttTask === 'IBND'">
        <div class="is-right">
          <!-- 고객이관  -->
          <v-menu
            v-model="modelCusTrans"
            min-width="350"
            bottom
            left
            content-class="pl-menu-drop"
            :close-on-click=false
            :close-on-content-click=false
            offset-y
          >
            <template v-slot:activator="{ attrs: menuAttrs }">
              <v-btn
                v-bind="menuAttrs"
                @click="openTransCust"
                class="pl-btn is-sub">
                고객 이관</v-btn>
            </template>
            <!-- 고개정보 이관 v-menu -->
            <div class="px-3 py-2">
              <!-- header -->
              <div class="d-flex">
                <h3 style="font-size: 16px">고개정보 이관</h3>
                <v-btn
                  @click="modelCusTrans = false"
                  plain
                  min-width="22"
                  height="22"
                  class="pl-tooltip-btn ml-auto"
                  >
                  <v-icon
                    small
                    class="pl-icon20 dialog-close-black">
                  </v-icon>
                </v-btn>
              </div>
              <!-- form -->
              <div class="pl-form-inline-wrap vertical is-mt-s gap-8">
                <div class="pl-form-inline">
                  <span class="pl-label" style="flex: 0 0 60px">
                    삭제대상 고객 ID
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      v-model="OLD_SSN_NO"
                      class="pl-form type-middle is-auto"
                    ></v-text-field>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label" style="flex: 0 0 60px">
                    수정대상 고객 ID
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      v-model="NEW_SSN_NO"
                      class="pl-form type-middle is-auto"
                    ></v-text-field>
                  </div>
                </div>
              </div>
              <div class="pl-btn-wrap is-mt-m">
                <v-btn
                  class="pl-btn is-trans ml-auto"
                  @click="modelCusTrans = false">닫기</v-btn>
                <v-btn class="pl-btn" @click="checkTransCustInfo()">수정</v-btn>
              </div>
            </div>
          </v-menu>
        </div>
      </template>
    </div>
    <!-- 바로처리센터(인바운드) 검색 결과 -->
    <template v-if="CUSTCO_ID === '4' && computedUserDefaultCuttTask === 'IBND'">
      <!-- temp grid -->
      <v-data-table
        class="pl-grid is-mt-s"
        :headers="headersAs"
        :items="CUST_LIST"
        :item-class="isActiveRow"
        @dblclick:row="rowDblClick"
        @click:row="rowClick"
        style="cursor:pointer;"
        fixed-header
        item-key="index"
        height="360px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :page.sync="page"
        @page-count="pageCount = $event"
        no-data-text="등록된 데이터가 없습니다."
        >
        <template v-slot:[`item.${header.value}`]="{ item }" v-for="(header, idx) in headersCommon">
          <div v-if="header.telYn">
            <span v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</span>
          </div>
          <div v-else>
            <span v-if="header.value === 'MDFCN_DT'">
              <b>{{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}</b>
            </span>
            <span v-else>{{ item[header.value] }}</span>
          </div>
        </template>

        <!-- 단지 주소 -->
        <template v-slot:item.type4="{ item }">
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on">
              {{ item.type4 }}</span>
            </template>
            <span>{{ item.type4 }}</span>
          </v-tooltip>
        </template>
        <!-- 동 주소 -->
        <template v-slot:item.type5="{ item }">
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on">
              {{ item.type5 }}</span>
            </template>
            <span>{{ item.type5 }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </template>

    <!-- 센터 공통 검색 결과 -->
    <template v-else>
      <!-- temp grid -->
      <v-data-table
        class="pl-grid is-mt-s"
        :headers="headersCommon"
        :items="CUST_LIST"
        :item-class="isActiveRow"
        @dblclick:row="rowDblClick"
        @click:row="rowClick"
        style="cursor:pointer;"
        fixed-header
        item-key="index"
        height="360px"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
        :page.sync="page"
        @page-count="pageCount = $event"
        no-data-text="등록된 데이터가 없습니다."
      >
        <template v-slot:[`item.${header.value}`]="{ item }" v-for="(header, idx) in headersCommon">
          <div v-if="header.telYn">
            <span v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</span>
          </div>
          <div v-else>
            <span v-if="header.value === 'MDFCN_DT'">
              <b>{{ mixin_convertDate(item[header.value], 'yyyy-MM-dd HH:mm:ss') }}</b>
            </span>
            <template v-else-if="header.value === 'CUST_NM'">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" v-html="item['CUST_NM']" />
                </template>
                <div v-html="item['CUST_NM']"></div>
              </v-tooltip>
            </template>
            <span v-else>{{ item[header.value] }}</span>
          </div>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'CompoFindCus',
    props: {
      SearchInputProp: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        //고객사 ID : 바로처리 : '4'
        CUSTCO_ID: this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,

        //검색 조건
        CUST_NM: '',
        CUST_PHN_NO: '',
        CUST_IDNTF_NO: '',
        //고객 검색 결과
        CUST_LIST: [],

        // 바로처리센터 : 고객이관
        modelCusTrans: false,

        page: 1,              //그리드 현재페이지
        pageCount: 0,         //그리드 총페이지
        perPage: [15,30,50,100],  //그리드 페이지당 표시항목
        // ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
        ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때

        pagination: {
          page: 1,
          rowsPerPage: 500,
          sortBy: "",
          descending: ""
        }, //그리드 페이지속성정의

        nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

        SEL_ROW:{},           //선택한 로우 데이터
        FIND_DATA: {},
        WAIT_FIND_DATA: {},

        // temp: 바로처리센터 - 인바운드
        headersAs: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
          { text: '고객 ID', value: 'CUST_IDNTF_NO',  width: '160px', sortable: false },
          { text: '전화번호', value: 'CUST_PHN_NO',  width: '120px', sortable: false, telYn: true },
          { text: '고객명', value: 'CUST_NM',  width: '80px', sortable: false },
          { text: '단지주소', value: 'MGOF_ADR',  width: '20%', sortable: false },
          { text: '동주소', value: 'BLDG_ADR',  width: '' , sortable: false},
          { text: '최종 수정자', value: 'MDFR_NM',  width: '80px', sortable: false },
          { text: '최종 수정일', value: 'MDFCN_DT',  width: '140px', sortable: false },
        ],
        itemsAs: [
          {
            index: 13,
            type1: '3007554579',
            type2: '010-1004-1004',
            type3: '나준영',
            type4: '파주운정3 A37BL(물향기) 107동 1602호',
            type5: '경기도 파주시 운정중앙로 200(목동동, 물향기마을 1단지 아파트) 107동 1602호',
            type6: '우성아',
            type7: '2024-06-10 16:34:54',
          },
          { index: 12, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: '', type5: '', type6: '김경란', type7: '2024-06-10 16:34:54', },
          { index: 11, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: '', type5: '', type6: '김경란', type7: '2024-06-10 16:34:54', },
          { index: 10, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: '', type5: '', type6: '김경란', type7: '2024-06-10 16:34:54', },
          { index: 9, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: '', type5: '', type6: '김경란', type7: '2024-06-10 16:34:54', },
          { index: 8, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: '', type5: '', type6: '김경란', type7: '2024-06-10 16:34:54', },
          { index: 7, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: '', type5: '', type6: '김경란', type7: '2024-06-10 16:34:54', },
          { index: 6, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: '', type5: '', type6: '김경란', type7: '2024-06-10 16:34:54', },
          { index: 5, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: '', type5: '', type6: '김경란', type7: '2024-06-10 16:34:54', },
          { index: 4, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: '', type5: '', type6: '김경란', type7: '2024-06-10 16:34:54', },
          { index: 3, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: '', type5: '', type6: '김경란', type7: '2024-06-10 16:34:54', },
          { index: 2, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: '', type5: '', type6: '김경란', type7: '2024-06-10 16:34:54', },
          { index: 1, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: '', type5: '', type6: '김경란', type7: '2024-06-10 16:34:54', },
        ],



        headersCommon:[
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
          { text: '고객 ID', value: 'CUST_IDNTF_NO',  width: '120px', sortable: false },
          { text: '전화번호', value: 'CUST_PHN_NO',  width: '100px', sortable: false, telYn: true },
          { text: '고객명', value: 'CUST_NM',  width: '80px', sortable: false },
          { text: '이메일', value: 'EML',  width: '120px', sortable: false },
          { text: '최종 수정자', value: 'MDFR_NM',  width: '80px' , sortable: false},
          { text: '최종 수정일', value: 'MDFCN_DT',  width: '120px', sortable: false },
        ],           //그리드 헤더
        itemsCommon:[
          { index: 12, type1: '3007554579', type2: '010-1004-1004', type3: '나준영', type4: 'n1004@hkcloud.co.kr', type5: '우성아', type6: '2024-06-10 16:34:54', },
          { index: 11, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: 'natage@hkcloud.co.kr', type5: '우성아', type6: '2024-06-10 16:34:54', },
          { index: 10, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: 'natage@hkcloud.co.kr', type5: '김경란', type6: '2024-06-10 16:34:54', },
          { index: 9, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: 'natage@hkcloud.co.kr', type5: '우성아', type6: '2024-06-10 16:34:54', },
          { index: 8, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: 'natage@hkcloud.co.kr', type5: '김경란', type6: '2024-06-10 16:34:54', },
          { index: 7, type1: '3007554579', type2: '010-1004-1004', type3: '나준영', type4: 'n1004@hkcloud.co.kr', type5: '우성아', type6: '2024-06-10 16:34:54', },
          { index: 6, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: 'natage@hkcloud.co.kr', type5: '우성아', type6: '2024-06-10 16:34:54', },
          { index: 5, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: 'natage@hkcloud.co.kr', type5: '김경란', type6: '2024-06-10 16:34:54', },
          { index: 4, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: 'natage@hkcloud.co.kr', type5: '우성아', type6: '2024-06-10 16:34:54', },
          { index: 3, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: 'natage@hkcloud.co.kr', type5: '김경란', type6: '2024-06-10 16:34:54', },
          { index: 2, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: 'natage@hkcloud.co.kr', type5: '김경란', type6: '2024-06-10 16:34:54', },
          { index: 1, type1: 'CT169700123456849323', type2: '010-1004-1004', type3: '성명미상', type4: 'natage@hkcloud.co.kr', type5: '김경란', type6: '2024-06-10 16:34:54', },

        ],             //그리드 데이터

        //고객 이관 관련
        OLD_SSN_NO: '',
        NEW_SSN_NO: '',
      }
    },

    watch :{
      // 사용자 또는 고객 이름 검색을 할 때
      SearchInputProp(){
        this.CUST_NM = '';
        this.CUST_IDNTF_NO = '';
        this.CUST_PHN_NO = this.SearchInputProp;
        this.search('');
      },
    },

    computed :{
    },

    created() {
    },

    //공통코드 사용시 async-await 필수 (mixin_common_code_get_all함수로 공통코드 리스트를 가지고 오기 전에 mixin_common_code_get이벤트 발생)
    async mounted() {
      this.CUST_PHN_NO = this.SearchInputProp;
      //부모에서 전화번호 받을 시, 해당 전화번호로 바로 검색.
      if(this.CUST_PHN_NO != ''){
        this.search('');
      }
    },
    beforeDestroy(){
    },

    methods: {
      async search(next){
        this.CUST_LIST = [];
        //다음버튼 클릭 유무
        if (next !== 'next'){
          this.items = [];
          this.pagination.page = 1; //페이징 처리 초기화
          this.nextDisabled = true;  //버튼 비활성화
        }

        let URLData = "/api/biz/common/select/custList";
        let postParam = {
          CUST_NM: this.CUST_NM.replace(/-/g, ''),
          CUST_PHN_NO: this.CUST_PHN_NO.replace(/[^0-9]/g, ''),
          CUST_IDNTF_NO: this.CUST_IDNTF_NO,
          EMPTY_PHN_NO_CHK: "Y",
          CUST_LIKE_SCH_USE_YN: (this.mixin_getCustcoSetting('ENV_CUST_LIKE_SCH_USE_YN')?'Y':'N'), //고객 LIKE 검색 사용 여부
          FIND_CHAT_CUST: this.$route.path === '/CSL_M0200' ? 'Y' : '' //채팅고객검색여부
          , SCH_CUSTCO_ID: this.computedUserCenter
        };

        let headParam = {
          head: {
            ns : 'lhcs.cust.dao.CustMapper'
            , sn : 'custList'
          }
        }

        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
        let response = await this.common_postCall(URLData, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){

          try{
            // response.DATA.forEach((data, idx) => {
            //   data.CUST_PHN_NO = this.mixin_setPhoneNo(data.CUST_PHN_NO);
            //   data.REG_DT = this.mixin_convertDate(data.REG_DT, 'yyyy-MM-dd HH:mm:ss');
            //   data.MDFCN_DT = this.mixin_convertDate(data.MDFCN_DT, 'yyyy-MM-dd HH:mm:ss');
            // });
          } catch (e) {
            this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
          }

          // let tempDataText = response.DATA;
          // let idx = this.items.length + 1;
          // for (let i in tempDataText) {
          //   tempDataText[i]["ROW_NUMBER"] = idx++;
          // }
          //this.items = tempDataText;
          // this.items = [...this.items, ...tempDataText]
          this.CUST_LIST = response.DATA;

          //다음
          //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
          if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
            if (response.HEADER.next === true) {
              this.nextDisabled = false //버튼 활성화
            } else {
              this.nextDisabled = true  //버튼 비활성화
            }
          }

          //이부분은 체크해볼것
          this.pagination.page += 1
          // this.page=1;


          // if (this.items.length === 1) {
          //   this.rowClick(this.items[0]);
          //   this.rowDblClick();
          // }
        }
      },

      //로우 클릭시 색상 변경
      isActiveRow(item){
        const activeClass = item === this.SEL_ROW ? "active" : "";
        return activeClass;
      },

      //로우클릭
      rowClick(item){
        this.SEL_ROW = item;
        //prop데이터를 직접바꿀 수 없지만 내부 요소는 변경 가능
        //부모한테서 받은 prop데이터가 $emit으로 자식에게 전달
        if(!this.$store.getters["statusStore/GE_CUTT_ING"] && !(this.CUSTCO_ID === '4' && this.computedAsSavedPhnCuttId != '')){ //상담중이 아닌 경우
          this.FIND_DATA = item;
        } else {
          this.WAIT_FIND_DATA = item;
        }

        this.hideDialog();
        this.rowDblClick(); //요청사항으로 원클릭으로 변경(25.03.07)
      },

      //로우 더블클릭
      rowDblClick(){
        console.log("rowDblClick============", this.CUSTCO_ID, this.$store.getters["statusStore/GE_CUTT_ING"], this.computedAsSavedPhnCuttId)
        // this.$emit("FIND_DATA", this.FIND_DATA);
        if(!this.$store.getters["statusStore/GE_CUTT_ING"] && !(this.CUSTCO_ID === '4' && this.computedAsSavedPhnCuttId != '')){ //상담중이 아닌 경우
          this.setCustInfo();
          this.hideDialog();
          // this.$emit("setCustInfo", this.FIND_DATA);
        }else{
          // this.showAlert({ alertDialogToggle : true, msg : '상담을 진행중입니다. 그래도 고객정보를 불러오시겠습니까?', iconClass:'is-caution', type :'confirm', callYes: this.forceSetCustInfo, callNo:this.closeMsg});
          console.log("GE_CUTT_ING", this.$store.getters["statusStore/GE_CUTT_ING"], this.computedAsSavedPhnCuttId)
          if(this.CUSTCO_ID === '4' && this.computedAsSavedPhnCuttId != '') {
            this.showConfirmInfo({
              msg: '업무 처리 중 이므로 전체 초기화 후 고객을 조회 합니다.'
                , callYes: () => {
                  this.$eventBus.$emit('allReSet')//전체초기화
                  setTimeout(() => {
                    this.forceSetCustInfo();
                  }, 1000);
                }
                , callNo: this.closeAlert
            })
          } else {
            this.forceSetCustInfo();
          }
        }
      },

      setCustInfo() {
        console.log("고객 변경, 고객 변경, 고객 변경, 고객 변경, 고객 변경, 고객 변경, 고객 변경, 고객 변경", this.FIND_DATA)
        this.$emit("setCustInfo", this.FIND_DATA);
      },

      forceSetCustInfo(){
        this.closeMsg();
        this.FIND_DATA = this.WAIT_FIND_DATA;
        this.setCustInfo();
        //고객정보를 불러왔을때는 상담상태변경 없음
        // this.$store.commit("statusStore/MU_CUTT_ING", false); //상담 진행중을 false로 store 저장 처리
        this.hideDialog();
      },

      //고객 이관 버튼 클릭 시 권한 체크하여 폼 오픈.
      openTransCust() {
        if(!this.computedIsContainAdminGroup) {
          this.showAlertInfo({msg: '수정 권한이 없습니다.'})
          return 
        }
        this.modelCusTrans = true;
      },
      
      //고객 이관 계약 고객 여부 체크
      async checkTransCustInfo() {
        if (this.OLD_SSN_NO == "") {
          this.showAlertInfo({msg: "삭제대상 고객을 입력 바랍니다."});
          return false;
        }
        if (this.NEW_SSN_NO == "") {
          this.showAlertInfo({msg: "수정대상 고객을 입력 바랍니다."});
          return false;
        }

        let postParam = {
          SSN_NO : this.OLD_SSN_NO
        };

        let headParam = {
          head: {
            ns: "lhcs.phone.as.dao.PhoneAsCommonMapper"
          }
        }
        let response = await this.common_postCall("/api/biz/common/select/selectTransCustInfo", postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          if(response.DATA.length > 0) {
            const contractCustYn = response.DATA[0].CONTRACT_CUST_YN;
            if(contractCustYn == "Y") {
              this.showAlertInfo({msg: "계약고객은 삭제할 수 없습니다."});
              return
            } else if(contractCustYn == 'N') {
              this.showConfirmInfo({
                msg: '진행이 맞습니까? 진행 후 다시 되돌릴 순 없습니다!!'
                , callYes: () => {
                  this.transCustInfo();
                }
                , callNo: this.closeAlert
              })
              
            }
          } else {
            this.showAlertInfo({msg: "존재하지 않는 고객입니다."});
          }
        }

      },

      //고객 이관 처리
      async transCustInfo() {
        console.log("transCust")

        let postParam = {
          OLD_SSN_NO : this.OLD_SSN_NO,
          NEW_SSN_NO : this.NEW_SSN_NO
        };

        let headParam = { head: {}}
        let response = await this.common_postCall("/phone-api/as/common/transCustInfo", postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          this.showToastInfo({msg: '정상 처리되었습니다.'})
          this.closeAlert();
          this.modelCusTrans = false;
        } else {
          this.showAlertInfo({msg: response.HEADER.ERROR_MSG})
        }
      },


      closeMsg(){
        this.$store.commit("alertStore/hideAlert");
      },
      hideDialog() {
        this.$emit("hideDialog");
      }


    },
  }
</script>

<style lang="scss" scoped>

</style>