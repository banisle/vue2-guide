<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
            <span class="pl-label">
              지역본부
            </span>
              <div class="pl-desc">
                <v-select
                    ref="srchParam.srchAraHdqCd"
                    class="pl-form type-middle"
                    :items="ARA_HDQ_CD_LIST"
                    v-model="srchParam.srchAraHdqCd"
                    placeholder="전체"/>
              </div>
            </div>

            <div class="pl-form-inline">
            <span class="pl-label">
              단지명
            </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form is-search type-middle is-lg"
                    placeholder="검색어 입력"
                    v-model="srchParam.srchMgofNm"
                    @keydown.enter="openSrchMgof"
                >
                  <template v-slot:append>
                    <v-btn
                        @click="openSrchMgof"
                        class="pl-btn has-icon-only"
                    >
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
            <span class="pl-label">
              상담사
            </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form type-middle is-sm"
                    v-model="srchParam.srchUserNm"
                    placeholder=""/>
              </div>
            </div>
            <div class="pl-form-inline">
            <span class="pl-label">
              공급유형
            </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle "
                    placeholder="전체"
                    :items="splTpDsCdList"
                    v-model="srchParam.srchSplTpDsCd"
                />
                <div class="pl-selection-row">
                  <v-checkbox
                      v-for="(chk, index) in chkTypes"
                      v-model="chk.selected"
                      :key="index"
                      :label="chk.text"
                      class="pl-check "
                  ></v-checkbox>
                </div>
              </div>
            </div>
            <div>
              <v-btn
                  class="pl-btn is-icon"
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
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class="pl-cols fill-height">
        <!-- left -->
        <div class="pl-card-body is-col-fix is-vrt" style="width: 70%;">
          <!-- grid top -->
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left ">
              <v-btn
                  @click="mixin_showDialog('MultiUpload')"
                  class="pl-btn is-icon is-trans"
                  :disabled="mixin_isEmpty(srchParam.srchAraHdqCd)"
              >
                <span class="pl-icon20 upload-all"></span>
                일괄 업로드
              </v-btn>
<!--              <v-btn class="pl-btn is-icon is-trans">-->
<!--                <span class="pl-icon20 template"></span>-->
<!--                업로드 템플릿-->
<!--              </v-btn>-->
            </div>
            <div class="pl-grid-top-utils">
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
              class="pl-grid is-mt-s has-control"
              :headers="headers"
              :items="schdlAutoAssgnList"
              v-model="chkSchedAssgnTrgtMgof"
              show-select
              fixed-header
              item-key="ROW_NUMBER"
              height="calc(-306px + 100vh)"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
              @click:row="rowSelect"
              @dblclick:row="showDetail"
              :page.sync="page"
              @page-count="pageCount = $event">
            <!-- 스크립트명 툴팁 -->
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
            <template v-slot:item.MGOF_TP_NM="{ item }">
              <v-tooltip content-class="pl-tooltip " bottom v-if="item.MGOF_TP_NM.length > 11">
                <template v-slot:activator="{ on, attrs }">
                <span
                    v-bind="attrs"
                    v-on="on">
                {{ item.MGOF_TP_NM }}</span>
                </template>
                <span>{{ item.MGOF_TP_NM }}</span>
              </v-tooltip>
              <span v-else> {{ item.MGOF_TP_NM }} </span>
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
            보기 {{ mixin_getPagePeriod(schdlAutoAssgnList, page) }} / {{ totCnt }}
            <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
                :DisableProp="nextDisabled"
                @btnClick="getSchdlAutoAssgnList(true)"
            ></compo-tooltip-btn>
          </span>
          </div>
        </div>
        <!-- right -->
        <div class="">
          <div class="pl-card">
            <h2 class="pl-subtit">상담사 정보 </h2>
            <div class="pl-subdesc">
              <p>왼쪽의 단지 또는 동별 선택 후 상담사를 선택 해 주세요</p>
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
                        class="pl-form type-middle"
                        placeholder="전체"
                        :items="ognzGroupList"
                        v-model="srchUserParam.srchDeptId"
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
                        @keydown.enter="getUserList"
                        oninput="javascript: this.value = this.value.replace(/[^a-z|A-Z|0-9|가-힣|ㄱ-ㅎ|ㅏ-ㅣ]/g, '' );"
                    >
                    </v-text-field>
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
                <strong class="pl-bullet-txt is-blue">스케줄러 자동분배 대상</strong>
              </div>
              <div class="pl-grid-top-utils">
              </div>
            </div>
            <v-data-table
                class="pl-grid is-mt-s has-control"
                :headers="headers2"
                :items="assgnUserList"
                show-select
                single-select
                fixed-header
                item-key="ROW_NUMBER"
                height="490px"
                v-model="chkAssgnUser"
                :items-per-page="assgnUserList.length"
                hide-default-footer
		no-data-text="등록된 데이터가 없습니다."
            >
              <!-- 성명 -->
              <template v-slot:item.USER_NM="{ item }">
                <img :src="item.ICON_IMG_URI" :alt="item.USER_NM" class="pl-grid-portrait"
                     style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
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
                  @click="beforeDist"
                  :disabled="mixin_isEmpty(chkSchedAssgnTrgtMgof) || mixin_isEmpty(chkAssgnUser)"
              >
                <span>배정하기</span>
              </v-btn>
            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- dialog: 일괄 업로드 -->
    <v-dialog
        v-model="dialogMultiUpload"
        content-class="dialog-draggable is-maxHeight"
        width="630px"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="스케쥴러배분 업로드"
          @hide="mixin_hideDialog('MultiUpload')"
          @submit="submitDialog('MultiUpload')"
      >
        <template slot="body">
          <CSM_M0900_DIALOG_UPLOAD
              :DataProp="{ARA_HDQ_CD_LIST : ARA_HDQ_CD_LIST, TGT_HDQ_CD : this.srchParam.srchAraHdqCd }"
              :RegProp="regTrigger"
              :ClearProp="dialogMultiUpload"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn" @click="regFromImport">업로드</v-btn>
          <v-btn class="pl-btn is-sub" @click="mixin_hideDialog('MultiUpload')">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- 동별 상담사 분배-->
    <v-dialog
        v-model="dialogDivManager"
        content-class="dialog-draggable"
        width="650"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="동별 상담사 분배"
          @hide="[mixin_hideDialog('DivManager'), forPropItem={}]"
          @submit="submitDialog('DivManager')"
      >
        <template slot="body">
          <CSM_M0900_DIALOG_DIV_MANAGER
              :DataProp="{MGOF_CD:forPropItem.MGOF_CD}"
              :EmitTriggerProp="emitTrigger"
              @EMIT_ROW_DATA="onRowData"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn" @click="chkChildRow">선택</v-btn>
          <v-btn class="pl-btn is-sub" @click="[mixin_hideDialog('DivManager'), forPropItem={}]">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CSM_M0900_DIALOG_UPLOAD from '@/views/page/CSM_M0900_DIALOG_UPLOAD.vue';
import CSM_M0900_DIALOG_DIV_MANAGER from "@/views/page/CSM_M0900_DIALOG_DIV_MANAGER.vue";

export default {
  name: "MENU_CSM_M0900", //스케줄러 자동분배 관리
  components: {
    CSM_M0900_DIALOG_DIV_MANAGER,
    CSM_M0900_DIALOG_UPLOAD
  },
  data() {
    return {
      // search
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dropDetail: false,

      dialogDivManager: false,
      dialogMultiUpload: false,
      ARA_HDQ_CD_LIST: [],

      splTpDsCdList: [],
      schdlAutoAssgnList: [],

      chkSchedAssgnTrgtMgof: [],
      chkSchedAssgnTrgtBldg: [],
      chkAssgnUser: [],
      selectedRow: {},
      forPropItem: {},
      emitTrigger: false,
      regTrigger: false,

      totCnt: 0,

      chkTypes: [
        {text: "단지별 미지정", selected: false,},
        {text: "동별 지정", selected: false,},
      ],

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

      custco_id: this.$store.getters['userStore/GE_USER_ROLE'].company.CD,
      ognzGroupList: [],
      assgnUserList: [],

      headers: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '지역본부', value: 'ARA_HDQ_NM', align: 'left', width: '12%', sortable: false},
        {text: '단지명', value: 'MGOF_NM', align: 'left', width: '', sortable: true},
        {text: '배분 상담사', value: 'USER_NM', align: 'left', width: '9%', sortable: false},
        {text: '공급유형', value: 'MGOF_TP_NM', align: 'left', width: '14%', sortable: false},
        {text: '입주지정 시작일', value: 'MVIN_ASGM_ST_DT', align: 'center', width: '10%', sortable: false},
      ],
      headers2: [

        {text: '상담사', value: 'USER_NM', align: 'left', width: '25%', sortable: false},
        {text: '로그인', value: 'LOGIN_STTS', align: 'left', width: '', sortable: false},
        {text: '소속', value: 'DEPT_NM', align: 'left', width: '', sortable: false},

      ],
      STAT_LIST: [
        {code: '로그인', value: 'blue'},
        {code: '로그아웃', value: 'red'},
      ],

      srchParam: {
        srchAraHdqCd: '',
        srchMgofCd: '',
        srchMgofNm: '',
        srchSplTpDsCd: '',
        srchUserNm: '',
        srchMgofYn: false,
        srchBldgYn: false,
      },
      srchUserParam: {
        srchDeptId: '',
        srchUserNm: '',
      },
    }
  },
  async created() {
    this.mixinAsGetAsAraHdqCdList();
    this.splTpDsCdList = await this.mixinAsGetCommonCode('SPL_TP_DS_CD', [], '전체')
    await this.getDeptList();
    await this.getUserList();
  },
  mounted() {

  },
  methods: {
    chkChildRow(){
      console.log("1. 선택")
      this.forPropItem={}
      this.showConfirmInfo({msg : '동 선택시 해당 동의 단지만 선택 됩니다.', callYes:()=>{
        this.emitTrigger = !this.emitTrigger;
          this.closeAlert();
        }, callNo : this.closeAlert})
    },
    onRowData(item){
      console.log("5. ON DATA")
      this.mixin_hideDialog('DivManager')
      if(!this.mixin_isEmpty(item)){
        this.chkSchedAssgnTrgtBldg = item
        this.chkSchedAssgnTrgtMgof = this.schdlAutoAssgnList.filter(obj=> obj.MGOF_CD === item[0].MGOF_CD)
      }
      console.log("6. chkSchedAssgnTrgtBldg ", this.chkSchedAssgnTrgtBldg)
    },
    regFromImport(){
      console.log("1. 선택")
      this.showConfirmInfo({msg : '선택된 지역본부에 등록된 상담사 정보가 삭제되고,\n 업로드한 엑셀 파일의 상담사로 모두 변경됩니다. \n\n진행하시겠습니까?', callYes:()=>{
          this.regTrigger = !this.regTrigger;
          this.closeAlert();
        }, callNo : this.closeAlert})
    },
    initSrchParam(){
      this.srchParam = {
        srchAraHdqCd: '',
        srchMgofCd: '',
        srchMgofNm: '',
        srchSplTpDsCd: '',
        srchUserNm: '',
        srchMgofYn: false,
        srchBldgYn: false,
      }
    },
    // row 선택
    rowSelect(item) {
      this.selectedRow = item;
      // console.log(this.selectedRow);
    },
    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },
    beforeSrch(next) {
      if (this.mixin_isEmpty(this.srchParam.srchAraHdqCd)) {
        this.showToastCaution({
          msg: '지역본부를 선택하세요.', callAfter: () => {
            // this.setFocus("srchParam.srchAraHdqCd");
            this.setDropDown('srchParam.srchAraHdqCd');
          }
        })
      } else {
        this.getSchdlAutoAssgnList(next);
      }
    },
    openSrchMgof(){
      if( this.mixin_isEmpty(this.srchParam.srchAraHdqCd) ){
        this.setDropDown('srchParam.srchAraHdqCd');
      }else{
        this.mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '569', {compo_name : 'CompoFindAsBldgAdr', callback : 'setBldgAdr', title: '단지/동주소', popData: {ARA_HDQ_CD : this.srchParam.srchAraHdqCd ,MGOF_NM : this.srchParam.srchMgofNm}})
      }
    },
    async getSchdlAutoAssgnList(next) {
      this.chkSchedAssgnTrgtMgof = [];
      this.nextDisabled = true;

      if (!next) {
        this.schdlAutoAssgnList = []
        this.pagination.page = 1;
        this.nextDisabled = false;
      }

      let sUrl = '/api/biz/common/select/selectSchdlAutoAssgnList'
      let postParam = {
        SRCH_ARA_HDQ_CD: this.srchParam.srchAraHdqCd,
        SRCH_MGOF_CD: this.srchParam.srchMgofCd,
        SRCH_SPL_TP_DS_CD: this.srchParam.srchSplTpDsCd,
        SRCH_MGOF_YN: this.chkTypes[0].selected ? 'Y' : 'N',
        SRCH_USER_NM: this.srchParam.srchUserNm,
        SRCH_BLDG_YN: this.chkTypes[1].selected ? 'Y' : 'N',
      }
      let headParam = {
        head: {
          ns: 'lhcs.phone.cuttMng.assgn.dao.PhoneCuttAssgnMapper',
          sn: 'selectSchdlAutoAssgnList',
          ROW_CNT: this.pagination.rowsPerPage,
          PAGES_CNT: this.pagination.page,
          PAGING: "Y",
        }
      }

      const response = await this.common_postCall(sUrl, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        this.totCnt = this.mixin_convertNumToComma(response.HEADER.TOT_COUNT);
        response.DATA.map(item => {
          this.schdlAutoAssgnList.push({
            ROW_NUMBER: item.ROW_NUMBER,
            ARA_HDQ_CD: item.ARA_HDQ_CD,
            ARA_HDQ_NM: item.ARA_HDQ_NM,
            MGOF_CD: item.MGOF_CD,
            MGOF_NM: item.MGOF_NM,
            MGOF_TP_CD: item.MGOF_TP_CD,
            MGOF_TP_NM: item.MGOF_TP_NM,
            TGT_EMP_NO: item.TGT_EMP_NO,
            USER_NM: item.USER_NM,
            BLDG_USER_CNT: item.BLDG_USER_CNT,
            BLDG_EMP_NM: item.BLDG_EMP_NM,
            MVIN_ASGM_ST_DT: this.mixin_convertDate(item.MVIN_ASGM_ST_DT, 'yyyy-MM-dd'),
          })
        })
      }
      if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
        if (response.HEADER.next) {
          this.nextDisabled = false //버튼 활성화
        } else {
          this.nextDisabled = true  //버튼 비활성화
        }
      }
      this.pagination.page += 1;
    },
    setBldgAdr(item) {
      this.srchParam.srchMgofCd = item.MGOF_CD;
      this.srchParam.srchMgofNm = item.MGOF_NM;
    },
    async getDeptList() {
      let postParam = {
        SRCH_TYPE: 'CUSL', // 직원 찾기
        SRCH_CUSTCO_ID: this.custco_id
      };
      let headParam = {
        head: {
          ns: "palette3.setting.ognz.dao.OgnzMapper",
          sn: "selectOgnzByRole",
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/selectOgnzByRole", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {

        this.ognzGroupList = [];
        this.ognzGroupList.push({text: '전체', value: '', CUSTCO_ID: '', KEY: ''})

        // 최상위 부서, 상담센터 부서 제외
        response.DATA.filter(item => {
          if (Number(item.UP_DEPT_ID) !== 1) {
            this.ognzGroupList.push({text: item.DEPT_NM, value: item.DEPT_ID, CUSTCO_ID: item.CUSTCO_ID, KEY: item.KEY})
          }
        });
      }
    },
    async getUserList() {
      this.chkAssgnUser = [];
      this.assgnUserList = [];

      let postParam = {
        SRCH_DEPT_ID: this.srchUserParam.srchDeptId,
        SRCH_CLBK_YN: this.srchUserParam.srchClbkYn ? 'CLBK' : '',
        CUSTCO_ID: this.custco_id,
        SRCH_USER_NM: this.srchUserParam.srchUserNm,
      };
      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.assgn.dao.PhoneCuttAssgnMapper",
          sn: "selectAssgnUserList"
        }
      };
      const response = await this.common_postCall("/api/biz/common/select/selectAssgnUserList", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
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
                , ICON_IMG_URI: item.ICON_IMG_URI !== '/' ? '/upload/' + item.ICON_IMG_URI : require('@/assets/img/@manager_profile_default.png')
              },
          )
        });
      }
    },
    showDetail(item) {
      this.forPropItem = this.selectedRow;
      console.log(item)
      console.log(this.selectedRow)
      this.mixin_showDialog('DivManager');
    },
    beforeDist(){
      if( this.mixin_isEmpty(this.chkSchedAssgnTrgtMgof) ){
        this.showToastCaution({msg : '배정할 단지를 선택해주세요.'})
      }else if( this.mixin_isEmpty(this.chkAssgnUser) ){
        this.showToastCaution({msg : '배정할 상담사를 선택해주세요.'})
      }else{
        this.showConfirmInfo({msg : `선택한 ${this.mixin_isEmpty(this.chkSchedAssgnTrgtBldg)?'단지를':'동(건물)을'} [${this.chkAssgnUser[0].USER_NM}] 상담사에게 배정하시겠습니까?`, callYes : ()=>{
          if(this.mixin_isEmpty(this.chkSchedAssgnTrgtBldg)){
            this.distMgof();
          }else{
            this.distBldg()
          }
          }, callNo : this.closeAlert})
      }
    },
    async distMgof(){
      let sUrl = '/phone-api/cutt/mng/assgn/insertDistMgof'
      let postParam = {
        arrDistMgof: this.chkSchedAssgnTrgtMgof.map(row=>{return {
          MGOF_CD : row.MGOF_CD,
          ARA_HDQ_CD : row.ARA_HDQ_CD
        }}),
        TGT_USER_ID : this.chkAssgnUser[0].USER_ID
      }
      let headParam = {
        head : {
          DATA_OBJECT : 'arrDistMgof'
        }
      }
      const response = await this.common_postCall(sUrl, postParam, headParam);
      if( !response.HEADER.ERROR_FLAG ){
        this.showToastInfo({msg : '정상 처리되었습니다.',callAfter : ()=>{
            this.closeAlert();
            this.getSchdlAutoAssgnList(false);
            this.chkAssgnUser = [];
          }})
      }else{
        this.showToastCaution({msg : '처리 중 오류가 발생했습니다.', callAfter : this.closeAlert })
      }
    },
    async distBldg(){
      let sUrl = '/phone-api/cutt/mng/assgn/insertDistBldg'
      let postParam = {
        arrDistBldg: this.chkSchedAssgnTrgtBldg.map(row=>{return {
          MGOF_CD : row.MGOF_CD,
          BLDG_ID : row.BLDG_ID
        }}),
        TGT_USER_ID : this.chkAssgnUser[0].USER_ID
      }
      let headParam = {
        head : {
          DATA_OBJECT : 'arrDistBldg'
        }
      }
      const response = await this.common_postCall(sUrl, postParam, headParam);
      if( !response.HEADER.ERROR_FLAG ){
        this.showToastInfo({msg : '정상 처리되었습니다.',callAfter : ()=>{
            this.closeAlert();
            this.chkAssgnUser = [];
            this.chkSchedAssgnTrgtBldg=[];
            this.getSchdlAutoAssgnList(false);
            this.forPropItem={MGOF_CD : postParam.arrDistBldg[0].MGOF_CD}
            this.mixin_showDialog('DivManager');
          }})
      }else{
        this.showToastCaution({msg : '처리 중 오류가 발생했습니다.', callAfter : this.closeAlert })
      }
    },
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
    reversedItems2() {
      return this.items2.slice().reverse();
    },
  },
  watch: {
    chkSchedAssgnTrgtMgof(){
      if( this.chkSchedAssgnTrgtMgof.length > 1){
        this.chkSchedAssgnTrgtBldg = [];
      }
    },
    chkSchedAssgnTrgtBldg(){
      console.log("chkSchedAssgnTrgtBldg askdjasodijasd >>> ", this.chkSchedAssgnTrgtBldg)
    },

    "srchParam.srchMgofNm":{
      handler(){
        if(this.mixin_isEmpty(this.srchParam.srchMgofNm)){
          this.srchParam.srchMgofCd = '';
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
