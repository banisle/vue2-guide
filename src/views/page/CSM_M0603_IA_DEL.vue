<template>
  <div style="display: contents;">
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          조회기간(삭제일)
        </span>
        <div class="pl-desc">
          <compo-date-range-picker
            :StartDayProp.sync="srchParam.srchStartDt"
            :EndDayProp.sync="srchParam.srchEndDt"
            @startDayChange="mixin_testLog(srchParam.srchStartDt)"
            @endDayChange="mixin_testLog(srchParam.srchEndDt)"
            ParentStyleProp="width: 306px"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          삭제자
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle is-sm"
            placeholder="전체"
            :items="DataProp.delUserType"
            v-model="srchParam.srchDelType"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline" v-if="srchParam.srchDelType ==='M'">
        <span class="pl-label">
          상담사
        </span>
        <div class="pl-desc">
          <v-text-field
              class="pl-form is-search type-middle"
              placeholder="검색어 입력"
              v-model="srchParam.srchDelUserNm"
              @keydown.enter="[$eventBus.$emit('findCusl', srchParam.srchDelUserNm), mixin_showDialog('FindCusl')]"
          >
            <template v-slot:append>
              <v-btn
                  @click="mixin_showDialog('FindCusl')"
                  class="pl-btn has-icon-only">
                <span class="pl-icon20 in-search"></span>
              </v-btn>
            </template>
          </v-text-field>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          유형
        </span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            placeholder="선택"
            :items="mixin_common_code_get(DataProp.commonCode,'IAT', '전체')"
            v-model="srchParam.srchDivCd"
          ></v-select>
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">
          지역
        </span>
        <compo-cutt-zone-combo
            :FormSeProp="'SRCH'"
            :ClearProp="clearProp"
            @EMIT_CUTT_ZONE="setCuttZone"
        />
      </div>

      <div>
        <v-btn class="pl-btn is-icon"
               @click="getIaDelList(false)"
        >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
        <compo-tooltip-btn
          TitleProp="초기화"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
        ></compo-tooltip-btn>
      </div>

    </div>
    <!-- sub content -->
    <div class="pl-cols fill-height is-border-top">
      <!-- 관심지역 삭제 현황 -->
      <div class="pl-card-body is-col-fix is-vrt" style="width: 50%;">
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left ">
            <strong class="pl-bullet-txt is-blue">관심지역 삭제 현황</strong>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ totCnt }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
                TypeProp="Download"
                :DataHeaderProp="excelHeaders"
                :DataBodyProp="gridIaDelList"
                :FileNameProp="'관심지역_삭제현황_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                HeaderColorProp="00B0F0"
            ></compo-excel>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s "
          :headers="headers"
          :items="gridIaDelList"
          fixed-header
          item-key="index"
          height="calc(-360px + 100vh)"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
	  no-data-text="등록된 데이터가 없습니다."
          @click:row="getIaDelDtlList"
          :loading="isLoading"
          :page.sync="page"
          @page-count="pageCount = $event">
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
            보기 {{ mixin_getPagePeriod(gridIaDelList, page) }} / {{ gridIaDelList.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              :DisabledProp="pagination.nextDisabled"
              @btnClick="getIaDelList(true)"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>

      <!-- 관심지역 삭제 상세 -->
      <div class="pl-card-body">
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left ">
            <strong class="pl-bullet-txt is-blue">관심지역 삭제 상세</strong>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ totDtlCnt }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
                TypeProp="Download"
                :DataHeaderProp="excelHeaders2"
                :DataBodyProp="gridIaDelDtlList"
                :FileNameProp="'관심지역_삭제_상세_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                HeaderColorProp="00B0F0"
            ></compo-excel>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s "
          :headers="headers2"
          :items="gridIaDelDtlList"
          :loading="isDtlLoading"
          fixed-header
          item-key="index"
          height="628px"
          :items-per-page="gridIaDelDtlList.length"
          hide-default-footer
	  no-data-text="등록된 데이터가 없습니다."
          @dblclick:row="showDetail()"
          :page.sync="page"
          @page-count="pageCount = $event">
        </v-data-table>

      </div>
    </div>
    <!-- dialog: 상담사 조회 -->
    <v-dialog
        v-if="dialogFindCusl"
        v-model="dialogFindCusl"
        content-class="dialog-draggable is-lg"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="직원 찾기"
          @hide="mixin_hideDialog('FindCusl')"
          @submit="submitDialog('FindCusl')"
      >
        <template slot="body">
          <CompoFindCusl
              ref="CompoFindCusl"
              :PAGING_PROP="true"
              :CHK_YN_PROP="false"
              @hideDialog="mixin_hideDialog('FindCusl')"
          />
          <!-- PAGING_PROP(Boolean)         : 페이징 사용여부 -->
          <!-- chkYnProp(Boolean)           : 체크박스 사용여부 / true : array , false : object 리턴-->
          <!-- USER_PROP(Array)             : 사용자 목록 PROP - array형태로 보내면 컴포넌트의 userList에서 USER_ID를 찾아 체크  -->
          <!-- SEARCH_INPUT_PROP(Object)    : 검색할 직원/상담사(USER_NM 필수)  -->
          <!-- CUSTCO_ID_PROP(String)       : 선택 고객사ID - 해당 되는 고객사만 조회(센터) -->
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="[mixin_hideDialog('FindCusl'), initFindMng()]">닫기</v-btn>
          <v-btn class="pl-btn" v-if="false" @click="submitDialog">선택</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>


import CompoCuttZoneCombo from "@/components/CompoCuttZoneCombo.vue";
import CompoFindCusl from "@/components/CompoFindCusl.vue";

export default {
  name: 'CSM_M0603_IA_DEL', //삭제 내역
  components: {
    CompoFindCusl,
    CompoCuttZoneCombo
  },
  props : {
    DataProp : {
      type : Object,
      default : ()=>{
        return {}
      }
    }
  },
  data() {
    return {
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      // grid
      page: 1,
      pageCount: 0,
      perPage: [20,40,60,80,100],
      ROW_PER_PAGE: 20,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '유형', value: 'TYPE_NM', align: 'left', width: '',sortable: true },
        { text: '검색기간', value: 'SEARCH_DT', align: 'center', width: '15%',sortable: false },
        { text: '삭제건수', value: 'CNT', align: 'center', width: '10%', sortable: false },
        { text: '날짜', value: 'DEL_DT', align: 'center', width: '12%', sortable: false },
        { text: '시간', value: 'DEL_TIME', align: 'center', width: '10%', sortable: false },
        { text: '삭제자', value: 'DEL_USER_NAME', align: 'center', width: '10%', sortable: false },
      ],
      excelHeaders: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '유형', value: 'TYPE_NM', align: 'left', width: '300px',sortable: true },
        { text: '검색기간', value: 'SEARCH_DT', align: 'center', width: '150px',sortable: false },
        { text: '삭제건수', value: 'CNT', align: 'center', width: '100px', sortable: false },
        { text: '날짜', value: 'DEL_DT', align: 'center', width: '120px', sortable: false },
        { text: '시간', value: 'DEL_TIME', align: 'center', width: '100px', sortable: false },
        { text: '삭제자', value: 'DEL_USER_NAME', align: 'center', width: '100px', sortable: false },
      ],
      items: [
        { index: 344, type00: '매입임대 - 신혼부부|울산|남구|전체', type01: '', type02: 0, type03: '2024-06-20', type04: '15:00:00', type05: '우성아',},
        { index: 345, type00: '매입임대 - 신혼부부|충북|청주시|전체', type01: '', type02: 1, type03: '2024-06-20', type04: '15:00:00', type05: '김경림',},
        { index: 346, type00: '매입임대 - 신혼부부|충북|청주시|전체', type01: '', type02: 0, type03: '2024-06-20', type04: '15:00:00', type05: '우성아',},
        { index: 347, type00: '매입임대 - 신혼부부|울산|남구|전체', type01: '', type02: 1, type03: '2024-06-20', type04: '15:00:00', type05: '김경림',},
        { index: 348, type00: '매입임대 - 신혼부부|울산|남구|전체', type01: '', type02: 0, type03: '2024-06-20', type04: '15:00:00', type05: '우성아',},
      ],
      headers2: [
        { text: '번호', value: 'NUM', align: 'center', width: '50px', sortable: false },
        { text: '삭제일시', value: 'DEL_DT', align: 'left', width: '20%',sortable: true },
        { text: '유형', value: 'INTEREST_DIV_NM', align: '', width: '10%',sortable: false },
        { text: '고객명', value: 'CUST_NM', align: 'center', width: '18%', sortable: false },
        { text: '전화번호', value: 'MOBILE', align: 'center', width: '18%', sortable: false },
        { text: '관심지역', value: 'INTERESTAREA', align: '', width: '', sortable: false },
      ],
      excelHeaders2: [
        { text: '번호', value: 'NUM', align: 'center', width: '50px', sortable: false },
        { text: '삭제일시', value: 'DEL_DT', align: 'left', width: '200px',sortable: true },
        { text: '유형', value: 'INTEREST_DIV_NM', align: '', width: '100px',sortable: false },
        { text: '고객명', value: 'CUST_NM', align: 'center', width: '180px', sortable: false },
        { text: '전화번호', value: 'MOBILE', align: 'center', width: '180px', sortable: false },
        { text: '관심지역', value: 'INTERESTAREA', align: '', width: '200px', sortable: false },
      ],
      items2: [
        { index: 1, type00: '2024-06-20- 13:45:21', type01: '공공임대', type02: '2017C11594357', type03: '010-1004-1004', type04: '서울>강남구>선택안함',},
        { index: 2, type00: '2024-06-20- 13:45:21', type01: '공공임대', type02: '2017C11594357', type03: '010-1004-1004', type04: '서울>강남구>선택안함',},
        { index: 3, type00: '2024-06-20- 13:45:21', type01: '공공임대', type02: '2017C11594357', type03: '010-1004-1004', type04: '서울>강남구>선택안함',},
        { index: 4, type00: '2024-06-20- 13:45:21', type01: '공공임대', type02: '2017C11594357', type03: '010-1004-1004', type04: '서울>강남구>선택안함',},
        { index: 5, type00: '2024-06-20- 13:45:21', type01: '공공임대', type02: '2017C11594357', type03: '010-1004-1004', type04: '서울>강남구>선택안함',},
      ],

      dialogFindCusl : false,
      isLoading : false,
      isDtlLoading : false,
      totCnt : 0,
      totDtlCnt : 0,
      clearProp : false,
      srchParam: {
        srchStartDt:  this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchDivCd: '',
        srchCntrCd: '',
        srchZone : new Array(3),
        srchAllZone: '',
        srchDelUserCenter: '',
        srchDelUserTeam: '',
        srchDelUser: '',
        srchDelUserNm: '',
        srchDelType: '',
      },
      pagination: {
        PAGES_CNT : 1,
        ROW_CNT : 500,
        nextDisabled : false
      },
      gridIaDelList : [],
      gridIaDelDtlList : [],
    }
  },
  created() {
    this.$eventBus.$on('setCuslInfo', (cuslInfo) => {
        this.srchParam.srchDelUser = cuslInfo.USER_ID;
        this.srchParam.srchDelUserNm = cuslInfo.USER_NM;
    });
    this.getIaDelList(false)
  },
  mounted() {
  },
  methods: {
    showDetail(){
      this.dialogSmsDetail = true
    },
    setCuttZone(data){
      this.srchParam.srchZone = []
      this.srchParam.srchZone = data;
    },
    async getIaDelList(next){
      this.isLoading = true;
      if (!next){
        this.gridIaDelList = [];
        this.gridIaDelDtlList = [];
        this.pagination.PAGES_CNT = 1
        this.pagination.nextDisabled = false
      }
      let sUrl = '/api/biz/common/select/selectIaGroupDelHst'
      let postParam = {
        SRCH_START_DT : this.srchParam.srchStartDt.replaceAll('-','')+'000000',
        SRCH_END_DT : this.srchParam.srchEndDt.replaceAll('-','')+'235959',
        INTEREST_DIV_CD : this.srchParam.srchDivCd,
        SIDO_ID : this.mixin_isEmpty(this.srchParam.srchZone) ? '': this.srchParam.srchZone[0],
        SIGUNGU_ID : this.mixin_isEmpty(this.srchParam.srchZone) ? '': this.srchParam.srchZone[1],
        JIGU_ID : this.mixin_isEmpty(this.srchParam.srchZone) ? '': this.srchParam.srchZone[2],
        SRCH_DEL_TYPE : this.srchParam.srchDelType,
        SRCH_CENTER_CD : this.srchParam.srchDelType === 'M' ? this.srchParam.srchDelUserCenter : '',
        SRCH_TEAM_CD : this.srchParam.srchDelType === 'M' ? this.srchParam.srchDelUserTeam : '',
        SRCH_DEL_USER : this.srchParam.srchDelType === 'M' ? this.srchParam.srchDelUser : '',
      }
      let headParam = {
        head : {
          ns : 'lhcs.phone.cuttMng.interestAreaMng.dao.xml.InterestAreaNotiMngMapper',
          sn : 'selectIaGroupDelHst',
          ROW_CNT : this.pagination.ROW_CNT,
          PAGES_CNT : this.pagination.PAGES_CNT,
          PAGING : "Y",
        }
      }
      const response = await this.common_postCall(sUrl,postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        this.totCnt = response.HEADER.TOT_COUNT
        response.DATA.map(item=>{
          let TYPE_NM = [item.INTEREST_DIV_NM, item.SIDO_NM, item.SIGUNGU_NM, item.JIGU_NM].join(' | ')
          this.$set(item, "TYPE_NM", TYPE_NM)
          this.gridIaDelList.push(item)
        })
          this.pagination.PAGES_CNT++
      }else{
        this.showAlertCaution({msg : '조회 중 문제가 발생했습니다.'})
      }
      if(response.HEADER.next !== null && response.HEADER.next !== undefined){
        if(response.HEADER.next === true){
          this.pagination.nextDisabled = false //버튼 활성화
        }else{
          this.pagination.nextDisabled = true  //버튼 비활성화
        }
      }
      this.isLoading = false;
    },
    async getIaDelDtlList(item){
      this.isDtlLoading = true;
      this.gridIaDelDtlList=[];
      let sUrl = '/api/biz/common/select/selectIaGroupDelHstDtl'
      let postParam = {
        CENTER_CD : item.CENTER_CD,
        DEL_GROUP_HIST_ID : item.DEL_GROUP_HIST_ID,
      }
      let headParam = {
        head : {
          ns : 'lhcs.phone.cuttMng.interestAreaMng.dao.xml.InterestAreaNotiMngMapper',
          sn : 'selectIaGroupDelHstDtl',
        }
      }
      const response = await this.common_postCall(sUrl,postParam, headParam)
      if( !response.HEADER.ERROR_FLAG ){
        this.totDtlCnt = response.HEADER.TOT_COUNT
        response.DATA.map(item=>{
          let INTERESTAREA = [item.SIDO_NM, item.SIGUNGU_NM, item.JIGU_NM].join(' > ')
          this.$set(item, "INTERESTAREA", INTERESTAREA)
          item.MOBILE = this.mixin_setPhoneNo(item.MOBILE)
          item.DEL_DT = this.mixin_convertDate(item.DEL_DT, 'yyyy-MM-dd HH:mm:ss')
          this.gridIaDelDtlList.push(item)
        })
      }else{
        this.showAlertCaution({msg : '조회 중 문제가 발생했습니다.'})
      }
      this.isDtlLoading = false;
    }
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
    reversedItems2() {
      return this.items2.slice().reverse();
    },
  },
  watch : {
    "srchParam.srchDelType" : {
      handler(newValue, oldValue) {
        this.srchParam.srchDelUser = '';
        this.srchParam.srchDelUserNm = '';
        this.srchParam.srchDelUserCenter = '';
        this.srchParam.srchDelUserTeam = '';
      },
      immediate: true,
    }
  }
};
</script>

<style lang="scss" scoped>

</style>