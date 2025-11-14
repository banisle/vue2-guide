<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                상담유형
              </span>
                <compo-cutt-type-combo
                    :FormSeProp="'SRCH'"
                    :DisabledProp="false"
                    @EMIT_CUTT_TYPE="setCuttType"
                />
            </div>
            <!--                :DataProp="[]"-->
            <!--            <compo-cutt-type-combo-->
            <!--                :FormSeProp="'CUTT'"-->
            <!--                :DisabledProp="false"-->
            <!--                :StrHeadTextProp="'전체'"-->
            <!--                :DataProp="arrSrch"-->
            <!--                @EMIT_CUTT_TYPE="setCuttType"-->
            <!--            />-->
            <div class="pl-form-inline">
              <span class="pl-label">
                상단 노출 여부
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    placeholder="전체"
                    :items="TOP_YN"
                    item-text="code"
                    item-value="vl"
                    v-model="srchParams.srchTopYn"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                제목
              </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form type-middle is-lg"
                    v-model="srchParams.srchTitle"
                />
              </div>
            </div>
            <div>
              <v-btn
                  class="pl-btn is-icon"
                  @click="getCuttToolList(false)"
              >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>

            </div>

          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-card-body ">
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left">
            <v-btn class="pl-btn is-icon is-trans" @click="openReg">
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn class="pl-btn is-icon is-trans"
                   @click="beforeDel"
            >
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ cuttToolList.length }})</em> 건</span>
          </div>
        </div>
        <v-data-table
            class="pl-grid is-mt-s has-control"
            v-model="chkToolListItem"
            :headers="headers"
            :items="cuttToolList"
            show-select
            fixed-header
            item-key="ROW_NUMBER"
            height="calc(-306px + 100vh)"
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            no-data-text="등록된 데이터가 없습니다."
            :item-class="isActiveRow"
            @click:row="rowClick"
            @dblclick:row="mixin_showDialog('Reg')"
        >
          <template v-slot:item.TOP_YN="{ item }">
              <span
                  :class="`pl-badge is-${mixin_displayStatus(item.TOP_YN_NM, 'TOP_YN')}`"
                  style="width: 60px;"
              >
              {{ item.TOP_YN_NM }}</span>
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
            보기 {{ mixin_getPagePeriod(cuttToolList, page) }} / {{ cuttToolList.length }}
            <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <v-dialog
        v-model="dialogReg"
        content-class="dialog-draggable"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          :header-title="mixin_isEmpty(selectedRow.CUTT_TOOL_ID) ? '상담도구 등록' :  '상담도구 상세'"
          @hide="hideReg"
          @submit="submitDialog('Reg')"
      >
        <template slot="body">
          <CSM_M0500_DIALOG_DETAIL
              ref="toolDetail"
              :TOOL_PROPS="selectedRow"
              :SAVE_TRIGGER_PROPS="saveTrigger"
              :RESET_TRIGGER_PROPS="resetTrigger"
              :SORT_ORD_PROP="sort"
              @hideReg="hideReg"
              @getCuttToolList="getCuttToolList"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="hideReg">닫기</v-btn>
<!--          <v-btn class="pl-btn" @click="saveTrigger = !saveTrigger">-->
          <v-btn class="pl-btn" @click="()=>{this.$refs.toolDetail.beforeSave()}">
            {{ mixin_isEmpty(selectedRow.CUTT_TOOL_ID) ? '저장' : '수정' }}
          </v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CSM_M0500_DIALOG_DETAIL from '@/views/page/CSM_M0500_DIALOG_DETAIL'
import CompoCuttTypeCombo from '@/components/CompoCuttTypeCombo'

export default {
  name: 'MENU_CSM_M0500', //상담도구 관리
  components: {
    CSM_M0500_DIALOG_DETAIL,
    CompoCuttTypeCombo
  },
  data() {
    return {
      // dialog
      dialogReg: false,

      srchParams: {
        srchLagreType: '',
        srchMiddleType: '',
        srchSmallType: '',
        srchTopYn: '',
        srchTitle: '',
      },

      saveParams: {
        cuttToolId: '',

        ttl: '',
        topYn: false,
        cntnt: '',
        sortOrd: '',
      },

      cuttToolList: [],
      chkToolListItem: [],
      selectedRow: {},

      saveTrigger: false,
      resetTrigger: false,

      arrSrch: ['0508', '050802', '05080202'],
      headTextProp: ['전체', '전체', '전체', '전체'],

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 30,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: ""
      }, //그리드 페이지속성정의
      nextDisabled: false,

      TOP_YN: [
        {code: '전체', value: '', vl: ''},
        {code: '예', value: 'blue', vl: 'Y'},
        {code: '아니오', value: 'yellow', vl: 'N'},
      ],

      headers: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '대분류', value: 'CUTT_LCD_NM', align: '', width: '10%', sortable: false},
        {text: '중분류', value: 'CUTT_MCD_NM', align: '', width: '10%', sortable: true},
        {text: '소분류', value: 'CUTT_SCD_NM', align: '', width: '10%', sortable: false},
        {text: '제목', value: 'TITLE', align: '', width: '', sortable: false},
        {text: '상단노출', value: 'TOP_YN', align: 'center', width: '5%', sortable: false},
        {text: '순서', value: 'SORT_ORD', align: 'center', width: '5%', sortable: false},
        {text: '등록자', value: 'RGTR_NM', align: '', width: '5%', sortable: false},
        {text: '등록일', value: 'REG_DT', align: '', width: '8%', sortable: false},
        {text: '수정자', value: 'MDFR_NM', align: '', width: '5%', sortable: false},
        {text: '수정일', value: 'MDFCN_DT', align: '', width: '8%', sortable: false},
      ],

      sort : [],
    }
  },
  created() {
    console.log(this.user_id)
  },
  async mounted() {
    this.getCuttToolList(false)
  },
  methods: {
    openReg() {
      this.selectedRow = {};
      this.setSort()
      this.mixin_showDialog('Reg')
      this.resetTrigger = !this.resetTrigger
    },
    hideReg() {
      this.mixin_hideDialog('Reg')
    },
    setCuttType(data) {
      this.srchParams.srchLagreType = this.mixin_isEmpty(data[0]) ? '' : data[0];
      this.srchParams.srchMiddleType = this.mixin_isEmpty(data[1]) ? '' : data[1];
      this.srchParams.srchSmallType = this.mixin_isEmpty(data[2]) ? '' : data[2];

      console.log("👌 >> setCuttType ", this.srchParams);
    },
    initParam() {
      this.chkToolListItem = [];
    },
    async getCuttToolList(next) {
      this.chkToolListItem = [];

      //다음버튼 클릭 유무
      if (next !== 'next') {
        this.cuttToolList = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
      }

      let postParam = {
        SRCH_LCD: this.mixin_isEmpty(this.srchParams.srchLagreType) ? '' : this.srchParams.srchLagreType,
        SRCH_MCD: this.mixin_isEmpty(this.srchParams.srchMiddleType) ? '' : this.srchParams.srchMiddleType,
        SRCH_SCD: this.mixin_isEmpty(this.srchParams.srchSmallType) ? '' : this.srchParams.srchSmallType,
        SRCH_TOP_YN: this.srchParams.srchTopYn,
        SRCH_TITLE: this.srchParams.srchTitle,
        MNG_YN: 'Y',
      }
      let headParam = {
        head: {
          ns: 'lhcs.phone.cuttMng.dao.PhoneCuttToolMngMapper',
          sn: 'selectCuttToolList'
        }
      }

      const response = await this.common_postCall('/api/biz/common/select/selectCuttToolList', postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        response.DATA.map((item) => {
          item.TITLE = this.mixin_decode(item.TITLE);
          item.CONTENTS = this.mixin_decode(item.CONTENTS);
          item.REG_DT = this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd');
          item.MDFCN_DT = this.mixin_convertDate(item.MDFCN_DT, 'yyyy-MM-dd');
          item.TOP_YN_NM = item.TOP_YN === 'Y' ? '예' : '아니오';
          this.cuttToolList.push(item)
        })
      }

      if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
        if (response.HEADER.next === true) {
          this.nextDisabled = false;
        } else {
          this.nextDisabled = true;
        }
      }
      //이부분은 체크해볼것
      this.pagination.page += 1;

    },
    rowClick(item) {
      this.selectedRow = item;
      this.setSort(item)
    },
    setSort(item){
      this.sort = []
      this.sort = this.cuttToolList.map(row =>{return row.SORT_ORD})
      if(item) this.sort = this.sort.filter(sort=> sort !== item.SORT_ORD)
    },
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },
    beforeDel() {

      if (!this.mixin_isEmpty(this.chkToolListItem)) {
        let notMyCnt = 0
        this.chkToolListItem.map(item => {
          if (item.RGTR_ID !== this.user_id) notMyCnt += 1;
        })

        if (notMyCnt > 0) {
          this.showToastCaution({msg: '본인이 등록한 상담 도구만 삭제할 수 있습니다.'})
        } else {
          this.showConfirmCaution({
            msg: '선택한 상담도구는 영구 삭제 됩니다.\n 계속 하시겠습니까?',
            callYes: this.deleteTool,
            callNo: this.closeAlert
          })
        }
      } else {
        this.showToastCaution({msg: '삭제할 상담 도구를 선택하세요.'})
      }
    },
    async deleteTool() {

      let sUrl = '/phone-api/cutt/mng/tool/delete/deleteTool'

      let postParam = {
        delToolList: this.chkToolListItem.map(row => {
          return {CUTT_TOOL_ID: row.CUTT_TOOL_ID}
        })
      }

      let headParam = {
        head: {
          DATA_OBJECT: "delToolList"
          , ns: 'lhcs.phone.cuttMng.dao.PhoneCuttToolMngMapper'
          , sn: 'deleteTool'
        }
      }

      const response = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({
          msg: '정상 처리되었습니다.', callAfter: () => {
            this.$store.commit("alertStore/hideAlert")
            this.getCuttToolList(false);
          }
        })
      } else {
        this.showToastCaution({
          msg: response.HEADER.ERROR_MSG, callAfter: () => {
            this.$store.commit("alertStore/hideAlert")
          }
        });
      }
    }


  },
  computed: {},
  watch: {},
};
</script>

<style lang="scss" scoped>

</style>