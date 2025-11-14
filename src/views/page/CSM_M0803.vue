<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-search-form is-mt-m flex-column align-start pb-0">
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
              <span class="pl-label">
                지시일자
              </span>
                <div class="pl-desc">
                  <compo-date-range-picker
                      :StartDayProp.sync="srchParam.srchStartDt"
                      :EndDayProp.sync="srchParam.srchEndDt"
                      @startDayChange="mixin_testLog(date2)"
                      @endDayChange="mixin_testLog(date3)"
                      ParentStyleProp="width: 306px"
                  />
                </div>
              </div>

              <div class="pl-form-inline">
              <span class="pl-label">
                분배여부
              </span>
                <div class="pl-desc">
                  <v-select
                      class="pl-form type-middle is-sm"
                      v-model="srchParam.srchAssgnCd"
                      :items="mixin_common_code_get(common_code, 'CLLBCKSTAT', '전체')"
                      placeholder="전체"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
              <span class="pl-label">
                완료유형
              </span>
                <div class="pl-desc">
                  <v-combobox
                      v-model="srchParam.srchCmplCd"
                      class="pl-form is-lg type-middle"
                      :items="sstCd"
                      item-value="value"
                      item-text="text"
                      multiple
                      clearable
                      placeholder="선택안함"
                  />
                  <!--                      @change="setCmplCd"-->
                </div>
              </div>
              <div class="pl-form-inline">
              <span class="pl-label">
                처리결과
              </span>
                <div class="pl-desc">
                  <v-combobox
                      v-model="srchParam.srchProcCd"
                      class="pl-form is-lg type-middle"
                      :items="flwPgrsSsCd"
                      multiple
                      clearable
                      placeholder="선택안함"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  지역본부
                </span>
                <div class="pl-desc">
                  <v-combobox
                      v-model="srchParam.srchAraHdqCd"
                      class="pl-form is-lg type-middle"
                      @change="[srchParam.srchFlwNum = '', srchParam.arrFlwNum = []]"
                      :items="ARA_HDQ_CD_LIST"
                      placeholder="선택"
                  />
                </div>
              </div>

            </div>
            <div class="pl-form-inline-wrap is-mt-s" style="width: 100%">
              <div class="pl-form-inline">
              <span class="pl-label" style=" width: 59px; ">
                상담사
              </span>
                <div class="pl-desc">
                  <v-text-field
                      :disabled="!mixin_isEmpty(srchParam.srchUserId)"
                      class="pl-form is-search type-middle"
                      placeholder="검색어 입력"
                      v-model="srchParam.srchUserNm"
                      @keydown.enter="mixin_testLog('search btn')"

                  >
                  >
<!--                    <template v-slot:append>-->
<!--                      <v-btn-->
<!--                          @click="mixin_showDialog('FindCusl')"-->
<!--                          class="pl-btn has-icon-only">-->
<!--                        <span class="pl-icon20 in-search"></span>-->
<!--                      </v-btn>-->
<!--                    </template>-->
                  </v-text-field>
                </div>
              </div>
              <div class="pl-form-inline">
              <span class="pl-label">
                업체
              </span>
                <div class="pl-desc">
                  <v-text-field
                      style="width: 271px;"
                      :disabled="!mixin_isEmpty(srchParam.srchFrmCd)"
                      class="pl-form is-search type-middle"
                      placeholder="검색어 입력"
                      clearable
                      v-model="srchParam.srchFrmNm"
                      @keydown.enter="mixin_testLog('search btn')"
                  >
                    <template v-slot:append>
                      <v-btn
                          @click="mixin_showDialog('FindAsIcpr')"
                          class="pl-btn has-icon-only">
                        <span class="pl-icon20 in-search"></span>
                      </v-btn>
                    </template>
                  </v-text-field>
                </div>
              </div>
              <div class="pl-form-inline">
              <span class="pl-label">
                단지
              </span>
                <div class="pl-desc">
                  <v-text-field
                      style="width: 281px;"
                      clearable
                      v-model="srchParam.srchMgofNm"
                      class="pl-form is-search type-middle flex-grow-1"
                      placeholder="검색어 입력"
                  >
                  </v-text-field>
                </div>
              </div>
              <div class="pl-form-inline">
              <span class="pl-label">
                하자 접수번호
              </span>
                <div class="pl-desc">
                  <v-text-field
                      ref="srchParam.srchFlwNum"
                      style="width: 236px"
                      class="pl-form type-middle flex-grow-1"
                      v-model="srchParam.srchFlwNum"
                      @input="setFlwNum"
                      maxlength="15"
                      oninput="javascript: this.value = this.value.replace(/[^0-9]/g,'')"
                      placeholder="하자접수번호 입력"
                      @keydown.enter="beforeSrch(false)"
                  />
                </div>
              </div>
              <!-- 버튼 -->
              <div>
                <v-btn class="pl-btn is-icon"
                       @click="beforeSrch(false)"
                >
                  <span class="pl-icon20 search"></span>
                  조회
                </v-btn>
                <compo-tooltip-btn
                    TitleProp="초기화"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 refresh"
                    TooltipPositionProp="bottom"
                    @btnClick="initSrchParam"
                ></compo-tooltip-btn>
              </div>
            </div>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols fill-height">
        <!-- left -->
        <div class="pl-card-body is-col-fix is-vrt" style="width: 70%;">
          <!-- grid top -->
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left spacing-wrap sp-16 ">
              <strong class="pl-bullet-txt is-blue">배정대상 고객 현황</strong>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ schedAssgnTotCnt }})</em> 건</span>
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
              class="pl-grid is-mt-s has-control"
              :headers="headers"
              :items="schedAssgnList"
              v-model="chkSchedAssgnTrgt"
              show-select
              fixed-header
              item-key="FLW_DTL_FULL_SN"
              height="calc(-350px + 100vh)"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
	            no-data-text="등록된 데이터가 없습니다."
              :page.sync="page"
              @page-count="pageCount = $event"
              :loading="isLoading"
              loading-text="조회중입니다.">
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
            <!-- 업체 -->
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
            보기 {{ mixin_getPagePeriod(schedAssgnList, page) }} / {{ schedAssgnList.length }}
            <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
                @btnClick="beforeSrch(true)"
                :DisabledProp="nextDisabled"
            ></compo-tooltip-btn>
          </span>
          </div>
        </div>
        <!-- right -->
        <div class="">
          <div class="pl-card">
            <h2 class="pl-subtit">배정 대상 상담사</h2>
            <div class="pl-subdesc">
<!--              <p>소속을 선택 하신 후 스케줄러 배분 대상자를 조회할 수 있습니다. </p>-->
            </div>
            <!-- 검색 -->
            <div class="pl-rounded-box pa-3 is-mt-m">
              <div class="pl-form-inline-wrap">
                <div class="pl-form-inline">
                <span class="pl-label">
                  소속
                </span>
                  <div class="pl-desc">
                    <v-select
                        :items="AS_DEPT_CD"
                        v-model="srchUserParam.srchDeptId"
                        class="pl-form type-middle"
                        placeholder="전체"
                        @change="getUserList"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                <span class="pl-label">
                  상담사
                </span>
                  <div class="pl-desc">
                    <v-text-field
                        class="pl-form is-search type-middle is-auto"
                        placeholder="검색어 입력"
                        v-model="srchUserParam.srchUserNm"
                        oninput="javascript: this.value = this.value.replace(/[^a-z|A-Z|0-9|가-힣|ㄱ-ㅎ|ㅏ-ㅣ]/g, '' );"
                        @keydown.enter="getUserList"
                    />
                  </div>
                </div>
                <div>
                  <v-btn class="pl-btn is-esp"
                         @click="getUserList"
                  >
                    조회
                  </v-btn>
                </div>
              </div>
            </div>

            <!-- grid -->
            <div class="pl-grid-top is-mt-m">
              <div class="pl-grid-top-left spacing-wrap sp-16 ">
                <strong class="pl-bullet-txt is-blue">배정 대상</strong>
              </div>
              <div class="pl-grid-top-utils">
<!--                <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ items2.length }})</em> 건</span>-->
<!--                &lt;!&ndash; 엑셀 다운로드 버튼 &ndash;&gt;-->
<!--                <compo-tooltip-btn-->
<!--                    TitleProp="엑셀 다운로드"-->
<!--                    ClassProp="pl-tooltip-btn "-->
<!--                    IconProp="pl-icon20 exceldown"-->
<!--                    TooltipPositionProp="bottom"-->
<!--                    @btnClick="mixin_testLog('엑셀 다운로드')"-->
<!--                ></compo-tooltip-btn>-->
              </div>
            </div>
            <v-data-table
                class="pl-grid is-mt-s has-control"
                :headers="headers2"
                :items="assgnUserList"
                show-select
                single-select
                fixed-header
                v-model="chkUserItem"
                item-key="ROW_NUMBER"
                height="480px"
                :items-per-page="assgnUserList.length"
                hide-default-footer
		            no-data-text="등록된 데이터가 없습니다."
            >
              <!-- 성명 -->
              <template v-slot:item.USER_NM="{ item }">
                <img :src="item.ICON_IMG_URI" :alt="item.USER_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
                <span class="ml-1">{{ item.USER_NM }}</span>
              </template>
              <!-- 로그인 -->
              <template v-slot:item.LOGIN_STTS="{ item }">
                <span
                    :class="`is-txt-${mixin_displayStatus(item.LOGIN_STTS, 'STAT_LIST')}`"
                >
              {{ item.LOGIN_STTS }}</span>
              </template>

            </v-data-table>
            <div class="pl-grid-bottom">
              <v-btn
                  class="pl-btn mt-4 is-lg float-right"
                  @click="beforeAssgn"
                  :disabled="mixin_isEmpty( chkSchedAssgnTrgt) || mixin_isEmpty(chkUserItem)"
              >
                <span>배정하기</span>
              </v-btn>
            </div>
          </div>
        </div>
      </div>

    </div>
    <v-dialog
        v-model="dialogFindCusl"
        content-class="dialog-draggable is-lg"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="상담원 찾기"
          @hide="initFindMng"
          @submit="submitDialog('FindCusl')"
      >
        <template slot="body">
          <CompoFindCusl
              ref="CompoFindCusl"
              :PAGING_PROP="true"
              :CHK_YN_PROP="false"
              :CUSTCO_ID_PROP="store.getters['userStore/GE_USER_ROLE'].company.CD"
              @hideDialog="mixin_hideDialog('FindCusl')"
          />
          <!-- PAGING_PROP(Boolean)         : 페이징 사용여부 -->
          <!-- chkYnProp(Boolean)           : 체크박스 사용여부 / true : array , false : object 리턴-->
          <!-- USER_PROP(Array)             : 사용자 목록 PROP - array형태로 보내면 컴포넌트의 userList에서 USER_ID를 찾아 체크  -->
          <!-- SEARCH_INPUT_PROP(Object)    : 검색할 직원/상담사(USER_NM 필수)  -->
          <!-- CUSTCO_ID_PROP(String)       : 선택 고객사ID - 해당 되는 고객사만 조회(센터) -->
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="initFindMng">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: 업체검색 -->
    <v-dialog
        v-if="dialogFindAsIcpr"
        v-model="dialogFindAsIcpr"
        width="1410"
        content-class="dialog-draggable is-lg"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="담당자 검색"
          @hide="mixin_hideDialog('FindAsIcpr')"
          @="submitDialog('FindAsIcpr')"
      >
        <template slot="body">
          <CompoFindAsIcpr
              :DataProp="{ARA_HDQ_CD : '21'  ,MNTN_USR_DS_CD: '080'}"
              @setItem="setIcpr"
              @closeDialog="mixin_hideDialog('FindAsIcpr')"
          />
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>

import CompoFindCusl from "@/components/CompoFindCusl.vue";
import store from "@/store";
import CompoFindAsIcpr from "@/components/CompoFindAsIcpr.vue";

export default {
  name: "MENU_CSM_M0803", //스케줄러 배분
  components: {CompoFindAsIcpr, CompoFindCusl},
  data() {
    return {
      common_code: [],

      flwPgrsSsCd: [], // AS _ 하자접수 처리결과 코드 [FLW_PGRS_SS_CD]
      sstCd: [], // CMM _ 완료/종결_스케쥴 코드 [SST]
      clbkStatCd: [],  // CMM _ 배정상태코드 [CLLBCKSTAT]

      srchParam: {
        srchStartDt: this.$moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchAssgnCd: '',
        srchCmplCd: [],
        srchProcCd: [],
        srchAraHdqCd: '',
        srchUserId: '',
        srchUserNm: '',
        srchFrmCd: '',
        srchFrmNm: '',
        srchMgofCd: '',
        srchMgofNm: '',
        srchFlwNum: '',
        arrFlwNum : [],
      },
      srchUserParam: {
        srchDeptId: '',
        srchUserNm: '',
      },

      dialogFindCusl: false,
      dialogFindAsIcpr: false,
      custco_id: '',

      schedAssgnList: [],
      chkSchedAssgnTrgt: [],
      schedAssgnTotCnt: 0,
      assgnUserList: [],
      chkUserItem: [],
      ARA_HDQ_CD_LIST: [],

      AS_DEPT_CD : [],
      // search
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      modelDoneType: '',
      itemsDoneType: [
        {text: '전체선택'},
        {text: '진행중'},
        {text: '완료'},
        {text: '제외'},
        {text: '종결(60일 초과)'},
        {text: '일정 비협조'},

      ],
      modelDoneResult: '',
      itemsDoneResult: [
        {text: '전체선택',},
        {text: '접수',},
        {text: '접수(이관)',},
        {text: '본부반려',},
        {text: '본부접수',},
        {text: '완료확인 본부이관',},
      ],

      isLoading: false,

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
      headers: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '보수 지시일', value: 'RPR_NSTC_DT', align: 'center', width: '10%', sortable: true},
        {text: '분배상태', value: 'ASSGN_STAT_CD_NM', align: 'center', width: '8%', sortable: false},
        {text: '분배일자', value: 'ASSGN_DT', align: 'center', width: '10%', sortable: false},
        {text: '분배상담사', value: 'USER_NM', align: 'left', width: '9%', sortable: false},
        {text: '하자접수번호', value: 'V_FLW_ACP_SN', align: 'center', width: '13%', sortable: false},
        {text: '단지코드', value: 'MGOF_CD', align: 'center', width: '8%', sortable: false},
        {text: '단지', value: 'MGOF_NM', align: 'left', width: '', sortable: false},
        {text: '업체', value: 'FRM_NM', align: 'left', width: '13%', sortable: false},
      ],

      //detail
      headers2: [
        {text: '상담사', value: 'USER_NM', align: 'left', width: '25%', sortable: false},
        {text: '로그인', value: 'LOGIN_STTS', align: 'left', width: '', sortable: false},
        {text: '당일 배정', value: 'ASSGN_CNT', align: 'center', width: '20%', sortable: false},
        {text: '당일 미접촉', value: 'TODO_CNT', align: 'center', width: '20%', sortable: false},
      ],

      // 상태 컬러
      STAT_LIST: [
        {code: '로그인', value: 'blue'},
        {code: '로그아웃', value: 'red'},
      ],


    }
  },
  async created() {
    let codeList = ['CLLBCKSTAT', 'SST9'];
    this.common_code = await this.mixin_common_code_get_all(codeList);
    this.flwPgrsSsCd = await this.mixinAsGetCommonCode("FLW_PGRS_SS_CD", [], '')
    this.sstCd = this.mixin_common_code_get(this.common_code, 'SST9', '')
    // AS-IS 소스상에 진행중 코드가 하드코딩 되어있음.
    this.sstCd.unshift({text: "진행중", value: "ING", cd_vl: "", cd_vl1: "", cd_vl2: "", cd_vl3: "", cd_vl4: ""})
    this.clbkStatCd = this.mixin_common_code_get(this.common_code, 'CLLBCKSTAT', '전체')
    await this.mixinAsGetSchdlDeptCombo('전체')
    console.log("this.computedUserDeptId",this.computedUserDeptId)
    this.AS_DEPT_CD.map(item =>{
      if(String.valueOf(item.value) === String.valueOf(this.computedUserDeptId)){
        this.srchUserParam.srchDeptId = item.value
      }
    })

    this.getSchedAssgnList(false);
    this.getUserList()

    //지역본부 목록
    this.mixinAsGetAsAraHdqCdList();


    this.$eventBus.$on('setCuslInfo', (cuslInfo) => {
      console.log("setCuslInfo")
      this.srchParam.srchUserId = cuslInfo.USER_ID;
      this.srchParam.srchUserNm = cuslInfo.USER_NM;
    });


  },
  mounted() {
  },
  methods: {
    // 상담원 찾기 초기화 이벤트 송신
    initFindMng() {
      this.mixin_hideDialog('FindCusl')
      this.$eventBus.$emit('initFindMng');
    },
    initSrchParam(){
      this.srchParam = {
            srchStartDt: this.$moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD'),
            srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
            srchAssgnCd: '',
            srchCmplCd: [],
            srchProcCd: [],
            srchAraHdqCd: '',
            srchUserId: '',
            srchUserNm: '',
            srchFrmCd: '',
            srchFrmNm: '',
            srchMgofCd: '',
            srchMgofNm: '',
            srchFlwNum: '',
            arrFlwNum : [],
      }
    },
    // 처리상태 변경 이벤트
    // changeFlwPgrsSsCd(){
    //   let isCheck = this.FLW_PGRS_SS_CD.includes("");
    //
    //   if(!this.isAllCheckFlwPgrsSsCd && isCheck){
    //     this.isAllCheckFlwPgrsSsCd = true;
    //     this.FLW_PGRS_SS_CD = this.FLW_PGRS_SS_CD_LIST.map(row=>{ return row.value});
    //   }else if(this.isAllCheckFlwPgrsSsCd && !isCheck){
    //     this.isAllCheckFlwPgrsSsCd = false;
    //     this.FLW_PGRS_SS_CD = [];
    //   }else if(this.FLW_PGRS_SS_CD.filter(row=>{return row != ""}).length == this.FLW_PGRS_SS_CD_LIST.filter(row=>{return row.value != ""}).length){
    //     this.isAllCheckFlwPgrsSsCd = true;
    //     this.FLW_PGRS_SS_CD = this.FLW_PGRS_SS_CD_LIST.map(row=>{ return row.value});
    //   }else if(this.FLW_PGRS_SS_CD.filter(row=>{return row != ""}).length != this.FLW_PGRS_SS_CD_LIST.filter(row=>{return row.value != ""}).length){
    //     this.isAllCheckFlwPgrsSsCd = false;
    //     this.FLW_PGRS_SS_CD = this.FLW_PGRS_SS_CD.filter(row=>{return row != ""});
    //   }
    // },

    setIcpr(item) {
      this.srchParam.srchFrmCd = item.FRM_CD;
      this.srchParam.srchFrmNm = item.FRM_NM;
      this.mixin_hideDialog('FindAsIcpr')
    },
    setFlwNum() {
      if( this.srchParam.srchFlwNum.length > 15 ){
        this.srchParam.srchFlwNum = '';
        this.srchParam.srchFlwNum =  this.srchParam.arrFlwNum.filter(item => item !== '').join('-');
      }else{
        let arrFlwNum = new Array(3);
        arrFlwNum[0] = this.srchParam.srchFlwNum.replaceAll('-','').slice(0,6)
        arrFlwNum[1] = this.srchParam.srchFlwNum.replaceAll('-','').slice(6,8)
        arrFlwNum[2] = this.srchParam.srchFlwNum.replaceAll('-','').slice(8,13)

        this.srchParam.arrFlwNum = arrFlwNum;
        this.srchParam.srchFlwNum = arrFlwNum.filter(item => item !== '').join('-');
      }
  },
    setBldgAdr(item) {
      // this.ARA_HDQ_CD = item.ARA_HDQ_CD;
      this.srchParam.srchMgofCd = item.MGOF_CD;
      this.srchParam.srchMgofNm = item.MGOF_NM;
      // if (item.BLDG_ADR && item.BLDG_ADR != '') {
      //   this.MGOF_NM = item.BLDG_ADR;
      //   this.BLDG_NO = item.BLDG_NO;
      //   this.BLDG_ID = item.BLDG_ID;
      // } else {
      //   this.MGOF_NM = item.MGOF_NM;
      //   this.BLDG_NO = '';
      //   this.BLDG_ID = '';
      // }
    },
  beforeSrch(next) {
    if (this.mixin_isEmpty(this.srchParam.srchFlwNum)) {
      this.getSchedAssgnList(next);
    } else {
      this.srchParam.srchAraHdqCd = '';
      if (this.srchParam.srchFlwNum.length < 15) {
        this.showToastCaution({msg: '하자접수번호가 유효하지 않습니다.', callAfter:()=>{
            this.setFocus('srchParam.srchFlwNum')
          }})
      } else {
        this.getSchedAssgnList(next);
      }
    }
  },
  async getSchedAssgnList(next) {
    this.chkSchedAssgnTrgt = [];
    this.nextDisabled = true;
    if (!next) {
      this.schedAssgnList = [];
      this.pagination.page = 1;
      this.nextDisabled = false;
    }

    let sUrl = '/phone-api/cutt/mng/assgn/selectSchedAssgnList';
    let postParam = {
      SRCH_START_DT: this.srchParam.srchStartDt.replaceAll('-', ''),
      SRCH_END_DT: this.srchParam.srchEndDt.replaceAll('-', ''),
      SRCH_ASSGN_STAT_CD: this.srchParam.srchAssgnCd,
      SRCH_FRM_CD: this.srchParam.srchFrmCd,
      // SRCH_MGOF_CD: this.srchParam.srchMgofCd,
      SRCH_MGOF_NM: this.srchParam.srchMgofNm,
      // SRCH_USER_ID: this.srchParam.srchUserId,
      SRCH_USER_NM: this.srchParam.srchUserNm,
      SRCH_CMPL_CD_LIST : this.srchParam.srchCmplCd.filter(item=>item.value !== '').map(obj => obj.value),
      SRCH_PROC_CD_LIST : this.srchParam.srchProcCd.filter(item=>item.value !== '').map(obj => obj.value),
      SRCH_FLW_RGS_DT : this.mixin_isEmpty(this.srchParam.arrFlwNum[0]) ? '' : '20'+this.srchParam.arrFlwNum[0],
      SRCH_ARA_HDQ_CD : this.mixin_isEmpty(this.srchParam.arrFlwNum[1]) ? this.srchParam.srchAraHdqCd.value :  this.srchParam.arrFlwNum[1],
      SRCH_FLW_ACP_DTL_SN : this.mixin_isEmpty(this.srchParam.arrFlwNum[2]) ? '' :  Number(this.srchParam.arrFlwNum[2]),
    }
    let headParam = {
      head: {
        ns: 'lhcs.phone.cuttMng.assgn.dao.PhoneCuttAssgnMapper',
        sn: 'selectSchedAssgnList',
        ROW_CNT: this.pagination.rowsPerPage,
        PAGES_CNT: this.pagination.page,
        PAGING: "Y",
      }
    }
    this.isLoading = true;
    const response = await this.common_postCall(sUrl, postParam, headParam);
    if (!response.HEADER.ERROR_FLAG) {
      this.schedAssgnTotCnt = this.mixin_convertNumToComma(response.HEADER.TOT_COUNT);
      response.DATA.map(item => this.schedAssgnList.push({
        FRM_CD: item.FRM_CD,
        ASSGN_DT: this.mixin_convertDate(item.ASSGN_DT, 'yyyy-MM-dd'),
        FRM_NM: item.FRM_NM,
        RPR_NSTC_DT: this.mixin_convertDate(item.RPR_NSTC_DT, 'yyyy-MM-dd'),
        FLW_ACP_SN: item.FLW_ACP_SN,
        ROW_NUMBER: item.ROW_NUMBER,
        USER_ID: item.USER_ID,
        V_FLW_ACP_SN: item.V_FLW_ACP_SN,
        FLW_DTL_FULL_SN: item.FLW_DTL_FULL_SN,
        MGOF_CD: item.MGOF_CD,
        MGOF_NM: item.MGOF_NM,
        FLW_ACP_DTL_SN: item.FLW_ACP_DTL_SN,
        USER_NM: item.USER_NM,
        ARA_HDQ_CD: item.ARA_HDQ_CD,
        ASSGN_STAT_CD: item.ASSGN_STAT_CD,
        ASSGN_STAT_CD_NM: item.ASSGN_STAT_CD_NM,
      }))
    }

    if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
      if (response.HEADER.next) {
        this.nextDisabled = false //버튼 활성화
      } else {
        this.nextDisabled = true  //버튼 비활성화
      }
    }
    this.pagination.page += 1;
    this.isLoading = false;
  },
    async getUserList() {

      this.assgnUserList = [];
      this.chkuserItem = [];

      let postParam = {
        SRCH_DEPT_ID: this.srchUserParam.srchDeptId,
        SRCH_CLBK_YN: '',
        SRCH_USER_NM: this.srchUserParam.srchUserNm,
      };
      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.assgn.dao.PhoneCuttAssgnMapper",
          sn: "selectAssgnUserList"
        }
      };
      // console.log("headParam ", headParam)/
      const response = await this.common_postCall("/api/biz/common/select/selectAssgnUserList", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        // console.log(response.DATA)
        response.DATA.map((item) => {
          this.assgnUserList.push(
              {
                USER_NM: item.USER_NM
                , USER_ID: item.USER_ID
                , ROW_NUMBER: item.ROW_NUMBER
                , DEPT_ID: item.DEPT_ID
                , DEPT_NM: item.DEPT_NM
                , ASSGN_CNT: item.ASSGN_CNT
                , ALL_CNT: item.ALL_CNT
                , TODO_CNT: item.TODO_CNT
                , LOGIN_STTS: item.LOGIN_STTS
                , ICON_IMG_URI : item.ICON_IMG_URI !== '/' ? '/upload/' + item.ICON_IMG_URI : require('@/assets/img/@manager_profile_default.png')
              },
          )
        });
      }
    },
    beforeAssgn() {
      if (this.mixin_isEmpty(this.chkSchedAssgnTrgt)) {
        this.showToastCaution({msg: "배정대상 고객을 선택해 주세요"})

      } else if (this.mixin_isEmpty(this.chkUserItem)) {
        this.showToastCaution({msg: "배정대상을 선택해 주세요"})
        // } else if ( this.chkSchedAssgnTrgt.map(item=>{if(item.PROC_YN ==='Y') return true}) ) {
        //   this.showToastCaution({msg: "처리완료 건은 배정할 수 없습니다."})
        // } else if (this.chkSchedAssgnTrgt.map(item=>{if(item.ASSGN_STAT_CD ==='CLLBCKSTAT08') return true})) {
        //   this.showToastCaution({msg: "배정 완료된 건은 배정할 수 없습니다."})
      } else {
        let msg = new Array(this.chkSchedAssgnTrgt.length);
        this.chkSchedAssgnTrgt.map((item, index) => {
          msg[index] = "[" + item.V_FLW_ACP_SN + "][" + item.ARA_HDQ_CD + " / " + item.MGOF_NM + "] : " + item.USER_NM + " => " + this.chkUserItem[0].USER_NM
        })

        this.showConfirmInfo({msg: "<strong>배정확인</strong>\n\n" + msg.join("\n") + "\n\n해당 상담사에게 배정 하시겠습니까?", callYes: this.assignment, callNo: this.closeAlert})
      }
    },
    async assignment() {
      let sUrl = '/phone-api/cutt/mng/assgn/updateAssgn'

      let postParam = {
          assgnTrgt: this.chkSchedAssgnTrgt.map(row=>{return {
            CNSLT_SCHDL_DIV_CD: 'SCDL',
            SEQ_KEY : 'FLW_DTL_FULL_SN',
            SEQ_ID : row.FLW_DTL_FULL_SN,
          }}),
          TO_USER_ID : this.chkUserItem[0].USER_ID,
          DEPT_ID : this.chkUserItem[0].DEPT_ID,
      }

      let headParam ={
        head: {
          DATA_OBJECT : "assgnTrgt"
          , ns:'lhcs.phone.cuttMng.assgn.dao.PhoneCuttAssgnMapper'
          , sn : 'updateAssgn'
        }}

      const response = await this.common_postCall(sUrl, postParam, headParam);
      if( !response.HEADER.ERROR_FLAG ){
        this.showToastInfo({msg : '정상 처리 되었습니다.', callAfter: ()=>{
            this.closeAlert();
            this.chkUserItem = [];
            this.chkSchedAssgnTrgt = [];
            this.getSchedAssgnList(false);
            this.getUserList();
          }})
      }else{
        this.showToastCaution({msg : '배정 처리중 오류가 발생했습니다.', callAfter : this.closeAlert })
      }
    },


}
,
watch: {
}
,
computed: {
  store() {return store},
  reversedItems() {return this.items.slice().reverse();},
  reversedItems2() {return this.items2.slice().reverse();},
  chkSstCd: {
    get()
    {
      let arrSstCd = [];
      if (this.srchParam.srchCmplCd[0].text === '전체') {
        this.sstCd.map(item => {
          this.srchParam.srchCmplCd.push(item)
        })
      }
      return this.srchParam.srchCmplCd
    }
  ,
    set(value)
    {
      this.srchParam.srchCmplCd = value;
    }
  }
,
}
,
beforeDestroy()
{
  // 직원 정보 수신 이벤트 - eventBus 중복방지를 위해 off
  this.$eventBus.$off("setCuslInfo");
}
,
}
;
</script>

<style lang="scss" scoped>

</style>
