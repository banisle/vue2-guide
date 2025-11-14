<template>
  <div>
    <!-- search -->
    <div class="pl-search-form">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            공급유형
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="전체"
              :items="mixin_common_code_get(common_code, 'SEOUL_RENT_TP','전체')"
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
            />
          </div>
        </div>
        <!-- 버튼 -->
        <div>
          <v-btn
            class="pl-btn is-icon"
            @click="srchRentalAptCrtstat(false)"
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
    <v-data-table
      class="pl-grid is-rowspan is-mt-s"
      :headers="headersRowSpan"
      :items="itemsRowSpan"
      :sort-by="['ROW_NUM']"
      fixed-header
      item-key="index"
      height="562px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :page.sync="page"
      @page-count="pageCount = $event">

      <template v-slot:item="{ item, index }">
        <tr
          :key="index">
          <td
            v-if="index === 0 || item.SPLY_TYPE_NM !== itemsRowSpan[index - 1].SPLY_TYPE_NM"
            :rowspan="mixin_getRowCount(index, 'SPLY_TYPE_NM')"
            :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.SPLY_TYPE_NM }}</td>
          <td
            v-if="index === 0 || item.SIGUN_NM !== itemsRowSpan[index - 1].SIGUN_NM"
            :rowspan="mixin_getRowCount(index, 'SIGUN_NM')"
            :class="mixin_getHeaderClass(headersRowSpan[1].align)">{{ item.SIGUN_NM }}</td>
          <td
            v-if="index === 0 || item.SIGUNGU_NM !== itemsRowSpan[index - 1].SIGUNGU_NM"
            :rowspan="mixin_getRowCount(index, 'SIGUNGU_NM')"
            :class="mixin_getHeaderClass(headersRowSpan[2].align)">{{ item.SIGUNGU_NM }}</td>
          <td
            v-if="index === 0 || item.DANJI_NM !== itemsRowSpan[index - 1].DANJI_NM"
            :rowspan="mixin_getRowCount(index, 'DANJI_NM')"
            :class="mixin_getHeaderClass(headersRowSpan[3].align)">
              {{ item.DANJI_NM }}
          </td>
          <td :class="mixin_getHeaderClass(headersRowSpan[4].align)">
            {{ item.HH_CNT }}
          </td>
          <td :class="mixin_getHeaderClass(headersRowSpan[5].align)">
            {{ item.EXCLSV_AREA }}
          </td>
          <td :class="mixin_getHeaderClass(headersRowSpan[6].align)">
            {{ item.RMRK }}
          </td>
          <!-- 비고 -->
          <td class="px-0 text-center">
            <v-tooltip content-class="pl-tooltip bottom" bottom>
              <template 
                v-if="REG_AUTH"
                v-slot:activator="{ on, attrs }">
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
        </tr>
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
          @btnClick="srchRentalAptCrtstat(true)"
        ></compo-tooltip-btn>
      </span>
    </div>

    <!-- dialog: 등록 -->
    <v-dialog
      v-model="dialogEdit"
      content-class="dialog-draggable "
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="서울지역 임대아파트 현황"
        @hide="mixin_hideDialog('Edit')"
        @submit="submitDialog('Edit')"
      >
        <template slot="body">
          <RightRentalManage_TAB03_DIALOG
            ref="dialog"
            @srchRentalAptCrtstat="srchRentalAptCrtstat(false)"
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
import RightRentalManage_TAB03_DIALOG from '@/views/page/RightRentalManage_TAB03_DIALOG'

export default {
  name: 'RightRentalManage_TAB03', //서울지역 임대아파트 현황
  components: {
    RightRentalManage_TAB03_DIALOG
  },
  data() {
    return {
      common_code: [],

      // dialog
      dialogEdit: false,

      SPLY_TYPE_CD:'',  //공급유형
      DSTRCT_NM:'',     //지구 명
      DANJI_NM:'',      //단지 명

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
        { text: '공급유형', value: 'SPLY_TYPE_NM', align: 'left', width: '10%', sortable: false },
        { text: '해당 시도', value: 'SIGUN_NM', align: 'left', width: '8%', sortable: false },
        { text: '해당 군구', value: 'SIGUNGU_NM', align: 'left', width: '12%', sortable: false },
        { text: '단지명', value: 'DANJI_NM', align: 'left', width: '', sortable: false },
        { text: '가구수', value: 'HH_CNT', align: 'center', width: '7%', sortable: false },
        { text: '전용면적', value: 'EXCLSV_AREA', align: 'left', width: '18%', sortable: false },
        { text: '비고', value: 'RMRK', align: 'left', width: '', sortable: false },
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
        RENTAL_APT_CRTSTAT_ID: item.RENTAL_APT_CRTSTAT_ID,       //본부
      }
      let headParam = {
        head: {
          ns : 'lhcs.rentalHusMng.rentalAptCrtstat.dao.rentalAptCrtstatMapper'
          , sn : 'deleteRentalAptCrtstat'
        }
      }

      let resData = await this.common_postCall(sUrl,postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.srchRentalAptCrtstat(false);
      }
    },

    //임대주택관리현황 조회
    async srchRentalAptCrtstat(next){
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
          ns : 'lhcs.rentalHusMng.rentalAptCrtstat.dao.rentalAptCrtstatMapper'
          , sn : 'srchRentalAptCrtstat'
          , ROW_CNT : this.pagination.rowsPerPage
          , PAGES_CNT : this.pagination.page
          , PAGING : "Y"
        }
      }

      let resData = await this.common_postCall(sUrl,postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.totCnt = resData.HEADER.TOT_COUNT;
        this.itemsRowSpan = [...this.itemsRowSpan, ...resData.DATA];

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
      this.$refs.dialog.stngRentalAptCrtstat();
      this.mixin_hideDialog('Edit');
    },

    //등록버튼 클릭
    initDialog(){
      if(this.$refs.dialog){
        this.$refs.dialog.initRentalAptCrtstat();
      } else {
        setTimeout(() => {
          this.$refs.dialog.initRentalAptCrtstat();
        }, 100);
      }
    },

    //수정 버튼 클릭
    openDialog(item){
      if(this.$refs.dialog){
        this.$refs.dialog.setRentalAptCrtstat(item);
      } else {
        setTimeout(() => {
          this.$refs.dialog.setRentalAptCrtstat(item);
        }, 100);
      }
    },

    //초기화 버튼 클릭
    initSrch(){
      this.SPLY_TYPE_CD='';  //공급유형
      this.DSTRCT_NM='';     //지구 명
      this.DANJI_NM='';      //단지 명
    },
  },
  mounted() {
  },
  async created() {
    //공통코드설정
    let codeName = ['SEOUL_RENT_TP'];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    this.srchRentalAptCrtstat(false);

    if(this.$store.getters['userStore/GE_USER_ROLE'].atrtGroupId != '6'){
      this.REG_AUTH = true;
    } else {
      this.REG_AUTH = false;
    }
  },
  computed: {
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>

</style>