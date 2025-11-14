<template>
  <div>
    <!-- search -->
    <div class="pl-search-form">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            지역본부
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="전체"
              :items="mixin_common_code_get(common_code, 'HEAD_OFFICE','전체')"
              v-model="HDQT_CD"
              @change="chgHdqt()"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            담당부서
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="전체"
              :items="TKCG_DEPT_LIST"
              v-model="TKCG_DEPT_CD"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            공급유형
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="전체"
              :items="mixin_common_code_get(common_code, 'RENT_TP','전체')"
              v-model="SPLY_TYPE_CD"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            지구명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle"
              placeholder="지구명 입력"
              v-model="DSTRCT_NM"
              @keydown.enter="srchRentalHusMng(false)"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            단지명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle is-lg"
              placeholder="단지명 입력"
              v-model="DANJI_NM"
              @keydown.enter="srchRentalHusMng(false)"
            />
          </div>
        </div>
        <!-- 버튼 -->
        <div>
          <v-btn
            class="pl-btn is-icon"
            @click="srchRentalHusMng(false)"
            >
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="initSrch"
          ></compo-tooltip-btn>
        </div>
        <div class="d-flex align-center">
          <v-checkbox
            class="pl-check"
            label="부도임대 포함"
            input-value="true"
            v-model="BKRC_RENTAL_YN"
          ></v-checkbox>
        </div>
      </div>
    </div>
    <!-- grid top -->
    <div class="pl-grid-top is-border-top pt-2">
      <div class="pl-grid-top-left spacing-wrap sp-16">
        <strong class="pl-bullet-txt is-blue">{{ nowDate }} 기준</strong>
      </div>
      <div class="pl-grid-top-utils">
        <!-- 등록 버튼 -->
        <compo-tooltip-btn
          v-if="REG_AUTH"
          TitleProp="등록"
          ClassProp="pl-tooltip-btn "
          IconProp="pl-icon20 circle-plus"
          TooltipPositionProp="bottom"
          @btnClick="[mixin_showDialog('Edit'),initDialog()]"
        ></compo-tooltip-btn>

        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ totCnt }})</em> 건</span>

        <!-- 엑셀 다운로드 버튼 -->
        <compo-tooltip-btn
          TitleProp="엑셀 다운로드"
          ClassProp="pl-tooltip-btn "
          IconProp="pl-icon20 exceldown"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('엑셀 다운로드')"
        ></compo-tooltip-btn>
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-s "
      :headers="headersRowSpan"
      :items="reversedItems"
      :sort-by="['ROW_NUM']"
      fixed-header
      item-key="index"
      height="557px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      :page.sync="page"
      @page-count="pageCount = $event"
      no-data-text="등록된 데이터가 없습니다."
    >
      <template v-slot:item.BKRC_RENTAL_YN="{ item }">
        {{ item.BKRC_RENTAL_YN == 'Y' ? 'O' : '' }}
      </template>
      <template 
        v-if="REG_AUTH"
        v-slot:item.EDIT="{ item }">
        <td class="px-0 text-center">
          <v-tooltip content-class="pl-tooltip bottom" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-menu
                min-width="120"
                bottom
                right
                offset-y
                content-class="pl-menu-drop"
              >
                <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                  <v-btn
                    v-bind="menuAttrs"
                    v-on="menuOn"
                    class="pl-tooltip-btn"
                    min-width="22"
                    height="22"
                    plain
                    >
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                      class="pl-icon20 detail"></v-icon>
                  </v-btn>
                </template>
                <ul class="pl-drop-layer-list">
                  <li @click="[openDialog(item),openEdit()]" >
                    <v-icon class="pl-icon20 edit"></v-icon>
                    <span class="ml-1">수정</span>
                  </li>
                  <li @click="openDel(item)" >
                    <v-icon class="pl-icon20 trash"></v-icon>
                    <span class="ml-1">삭제</span>
                  </li>
                </ul>
              </v-menu>
            </template>
            <span>상세</span>
          </v-tooltip>
        </td>
      </template>
      <!-- 담당부서 툴팁 -->
      <template v-slot:item.TKCG_DEPT_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.TKCG_DEPT_NM }}</span>
          </template>
          <span>{{ item.TKCG_DEPT_NM }}</span>
        </v-tooltip>
      </template>
      <!-- 비고 툴팁 -->
      <template v-slot:item.RMRK="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.RMRK }}</span>
          </template>
          <span>{{ item.RMRK }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <div class="pl-pager">
      <div class="pl-pager-row">
        <span>페이지당 항목 수</span>
        <v-select
          class="pl-form"
          :value="ROW_PER_PAGE"
          :items="perPage"
          :item-text="toString(ROW_PER_PAGE)"
          @change="ROW_PER_PAGE = parseInt($event, 10);"
        ></v-select>
      </div>
      <v-pagination
        v-model="page"
        :length="pageCount"
        circle
        :total-visible="7">
      </v-pagination>

      <!-- 더보기 다음 있을때만 노출 -->
      <span class="pl-pager-period">
        보기 {{ mixin_getPagePeriod(itemsRowSpan, page) }} / {{ totCnt }}
        <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          :DisabledProp="nextDisabled"
          @btnClick="srchRentalHusMng(true)"
        ></compo-tooltip-btn>
      </span>
    </div>

    <!-- dialog: 등록 -->
    <v-dialog
      v-model="dialogEdit"
      content-class="dialog-draggable is-scroll is-maxHeight"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="임대주택 상세"
        @hide="mixin_hideDialog('Edit')"
        @submit="submitDialog('Edit')"
      >
        <template slot="body">
          <RightRentalManage_TAB01_DIALOG
            ref="dialog"
            @srchRentalHusMng="srchRentalHusMng(false)"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('Edit')">닫기</v-btn>
          <v-btn class="pl-btn" @click="strg()">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
import RightRentalManage_TAB01_DIALOG from '@/views/page/RightRentalManage_TAB01_DIALOG'
export default {
  name: 'RightRentalManage_TAB01', //임대주택 관리 현황
  components: {
    RightRentalManage_TAB01_DIALOG
  },
  data() {
    return {
      common_code: [],

      // dialog
      dialogEdit: false,

      HDQT_CD:'',       //본부
      TKCG_DEPT_CD:'',  //담당부서
      TKCG_DEPT_LIST:[],  //담당부서 리스트
      SPLY_TYPE_CD:'',  //공급유형
      DSTRCT_NM:'',     //지구 명
      DANJI_NM:'',      //단지 명
      BKRC_RENTAL_YN: true,//부도임대 여부

      REG_AUTH:true,   //등록 권한

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      pagination: {
        page: 1,
        rowsPerPage: 15,
        sortBy: "",
        descending: ""
      },
      nextDisabled : false,
      totCnt:0,
      headersRowSpan: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '본부', value: 'HDQT_NM', align: 'left', width: '3%', sortable: false },
        { text: '담당부서', value: 'TKCG_DEPT_NM', align: 'left', width: '8%', sortable: false },
        { text: '지구명', value: 'DSTRCT_NM', align: 'left', width: '12%', sortable: false },
        { text: '단지명', value: 'DANJI_NM', align: 'left', width: '12%', sortable: false },
        { text: '입주일', value: 'HUSIN_DAY', align: 'left', width: '6%', sortable: false },
        { text: '공급유형', value: 'SPLY_TYPE_NM', align: '', width: '5%', sortable: false },
        { text: '부도임대', value: 'BKRC_RENTAL_YN', align: 'center', width: '4%', sortable: false },
        { text: '세대 수', value: 'HH_CNT', align: 'center', width: '4%', sortable: false },
        { text: '전용면적', value: 'EXCLSV_AREA', align: '', width: '8%', sortable: false },
        { text: '관리소 전화번호', value: 'MNGOFC_PHN_NO', align: 'center', width: '7%', sortable: false },
        { text: '주소', value: 'ADDR', align: '', width: '', sortable: false },
        { text: '비고', value: 'RMRK', align: '', width: '6%', sortable: false },
        { text: '', value: 'EDIT', align: 'center', width: '2%', sortable: false },
      ],
      itemsRowSpan: [],

      nowDate:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      MESSAGE: {
        CONFIRM: {
          REGIST: {
            alertDialogToggle: true,
            msg: '임대주택 관리현황을 저장 하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.saveConfirm,
            callNo: this.closeMsg
          },
        },

        ALERT: {
          ALREADY_EXIST: {alertDialogToggle: true, msg: '이미 사용중인 ID 입니다.', iconClass: 'is-caution', type: 'default'},
        },
        ERROR: {
          GET_USER_INFO_FAIL: {
            alertDialogToggle: true,
            msg: '사용자 정보를 가져올 수 없습니다.',
            iconClass: 'is-caution',
            type: 'default'
          },
        },
        TOAST : {
          SUCCESS : {  msg: '처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        }
      }
    }
  },
  methods: {
    openEdit(){
      this.mixin_showDialog('Edit')
    },

    async openDel(item) {
      let sUrl = '/api/biz/common/delete';
      let postParam = {
        RENTAL_HUS_MNG_ID: item.RENTAL_HUS_MNG_ID,       //본부
      }
      let headParam = {
        head: {
          ns : 'lhcs.rentalHusMng.rentalHusMng.dao.rentalHusMngMapper'
          , sn : 'deleteRentalHusMng'
        }
      }

      let resData = await this.common_postCall(sUrl,postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.srchRentalHusMng(false);
      }
    },

    async chgHdqt(){
      this.TKCG_DEPT_CD = '';
      this.TKCG_DEPT_LIST = [];

      let hdqtCodeNm = [];
      hdqtCodeNm[0] = this.HDQT_CD;
      let hdqtCode = await this.mixin_common_code_get_all(hdqtCodeNm);
      this.TKCG_DEPT_LIST = this.mixin_common_code_get(hdqtCode,this.HDQT_CD,'전체');
    },

    //임대주택관리현황 조회
    async srchRentalHusMng(next){
      if( !next ){
        this.itemsRowSpan = [];
        this.pagination.page = 1;
        this.nextDisabled = false;
      }
      let sUrl = '/api/biz/common/select';
      let postParam = {
        HDQT_CD: this.HDQT_CD,       //본부
        TKCG_DEPT_CD:this.TKCG_DEPT_CD,  //담당부서
        SPLY_TYPE_CD:this.SPLY_TYPE_CD,  //공급유형
        DSTRCT_NM:this.DSTRCT_NM,     //지구 명
        DANJI_NM:this.DANJI_NM,      //단지 명
        BKRC_RENTAL_YN:this.BKRC_RENTAL_YN == true ? 'Y' : 'N',//부도임대 여부
      }
      let headParam = {
        head: {
          ns : 'lhcs.rentalHusMng.rentalHusMng.dao.rentalHusMngMapper'
          , sn : 'srchRentalHusMng'
          , ROW_CNT : this.pagination.rowsPerPage
          , PAGES_CNT : this.pagination.page
          , PAGING : "Y"
        }
      }

      let resData = await this.common_postCall(sUrl,postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.totCnt = resData.HEADER.TOT_COUNT;
        console.log("resData.DATA", resData.DATA);
        this.itemsRowSpan = [...this.itemsRowSpan, ...resData.DATA];
        console.log("this.itemsRowSpan", this.itemsRowSpan);

        if(resData.HEADER.next !== null && resData.HEADER.next !== undefined){
          if(resData.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        this.pagination.page += 1
      }
    },

    //저장버튼 클릭
    strg(){
      this.$refs.dialog.stngRentalHusMng();
      this.mixin_hideDialog('Edit');
    },

    //등록버튼 클릭
    initDialog(){
      if(this.$refs.dialog){
        this.$refs.dialog.initRentalHusMng();
      } else {
        setTimeout(() => {
          this.$refs.dialog.initRentalHusMng();
        }, 100);
      }
    },

    //수정 버튼 클릭
    openDialog(item){
      if(this.$refs.dialog){
        this.$refs.dialog.setRentalHusMng(item);
      } else {
        setTimeout(() => {
          this.$refs.dialog.setRentalHusMng(item);
        }, 100);
      }
    },

    //초기화 버튼 클릭
    initSrch(){
      this.HDQT_CD='';  //공급유형
      this.TKCG_DEPT_CD='';     //지구 명
      this.TKCG_DEPT_LIST='';      //단지 명
      this.SPLY_TYPE_CD='';  //공급유형
      this.DSTRCT_NM='';     //지구 명
      this.DANJI_NM='';      //단지 명
    },
  },
  mounted() {
  },
  beforeDestroy(){
    this.$eventBus.$off("openRightRentalManage"); //eventBus 중복방지를 위해 off
  },
  async created() {
    //공통코드설정
    let codeName = ['HEAD_OFFICE', 'RENT_TP'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    // 임대주택관리현황 윈도우 팝업 오픈 시
    this.$eventBus.$on("openRightRentalManage",(item) =>{
      console.log("item", item);
      if(item.DSTRCT_NM){
        this.DSTRCT_NM = item.DSTRCT_NM;
      }
      if(item.DANJI_NM){
        this.DANJI_NM = item.DANJI_NM;
      }
      this.srchRentalHusMng(false);
    });

    if(this.$store.getters['userStore/GE_USER_ROLE'].atrtGroupId != '6'){
      this.REG_AUTH = true;
    } else {
      this.REG_AUTH = false;
    }
  },
  computed: {
    reversedItems() {
      return this.itemsRowSpan.slice().reverse();
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>