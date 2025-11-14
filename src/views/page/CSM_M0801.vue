<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
            <span class="pl-label">
              배정모드
            </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle is-xs"
                    placeholder="전체"
                    :items="ASSGN_MODE"
                    v-model="autoDistParam.autoDistKey"
                    disabled
                />
                <v-select
                    class="pl-form type-middle is-mid"
                    placeholder="전체"
                    :items="mixin_common_code_get(common_code, 'AUTO_DIST', '선택')"
                    v-model="autoDistParam.isAutoDist"
                />
                <v-select
                    v-show="!mixin_isEmpty(autoDistParam.isAutoDist) && autoDistParam.isAutoDist !== 'N'"
                    class="pl-form type-middle is-mid"
                    placeholder="전체"
                    :items="mixin_common_code_get(common_code, 'DIST_RULE_CD', '선택')"
                    v-model="autoDistParam.autoDistRule"
                />
                <div>
                  <v-btn
                      class="pl-btn is-esp2 type-middle"
                      :disabled="mixin_isEmpty(autoDistParam.isAutoDist)"
                      @click="beforeSetDist"
                  >
                    변경
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
            <span class="pl-label">
              상담일자
            </span>
              <div class="pl-desc">
                <compo-date-range-picker
                    :StartDayProp.sync="srchParam.srchStartDt"
                    :EndDayProp.sync="srchParam.srchEndDt"
                    @startDayChange="dayChange('start')"
                    @endDayChange="dayChange('end')"
                    ParentStyleProp="width: 306px"
                />
              </div>
            </div>

            <div class="pl-form-inline">
            <span class="pl-label">
              분배상태
            </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle is-sm"
                    placeholder="전체"
                    :items="mixin_common_code_get(common_code, 'CLLBCKSTAT', '전체')"
                    v-model="srchParam.srchAssgnCd"
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
                    v-model="srchParam.srchProcYn"
                    :items="procYnList"
                    item-value="vl"
                    placeholder="전체"/>
              </div>
            </div>
            <div class="pl-form-inline">
            <span class="pl-label">
              분배 상담사
            </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form is-search type-middle"
                    placeholder="검색어 입력"
                    v-model="srchParam.srchToUserNm"
                    @keydown.enter="openFindMngDialog('TO',srchParam.srchToUserNm)"
                    :disabled="!mixin_isEmpty(this.srchParam.srchToUserObj)"
                >
                  <template v-slot:append>
                    <v-btn
                        @click="openFindMngDialog('TO',srchParam.srchToUserNm)"
                        class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
            <span class="pl-label">
              IVR 유형
            </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle is-sm"
                    placeholder="전체"
                    :items="mixin_common_code_get(common_code, 'IVR_CD', '전체')"
                    v-model="srchParam.srchIvrCd"
                />
              </div>
            </div>
            <div>
              <v-btn
                  class="pl-btn is-icon"
                  @click="getInbdTransAssgnList(false)"
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
            <div class="pl-grid-top-left spacing-wrap sp-16 ">
              <strong class="pl-bullet-txt is-blue">배정대상 고객 현황 </strong>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ totAssgnCnt }})</em> 건</span>
              <!-- 엑셀 다운로드 버튼 -->
              <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="excelHeaders"
                  :DataBodyProp="inbdTransAssgnList"
                  :FileNameProp="'콜백_관리_'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                  HeaderColorProp="00B0F0"
              ></compo-excel>
            </div>
          </div>
          <!-- grid -->
          <v-data-table
              class="pl-grid is-mt-s has-control"
              :headers="headers"
              :items="inbdTransAssgnList"
              v-model="chkAssgnTrgtItems"
              :loading="isLoading"
              show-select
              fixed-header
              item-key="ROW_NUMBER"
              height="calc(-350px + 100vh)"
              :items-per-page="ROW_PER_PAGE"
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
              :page.sync="page"
              @page-count="pageCount = $event">
            <!-- 스크립트명 툴팁 -->
            <template v-slot:item.SCH_REQ_CNTNT="{ item }">
              <v-tooltip content-class="pl-tooltip " bottom v-if="item.SCH_REQ_CNTNT.length > 40">
                <template v-slot:activator="{ on, attrs }">
                <span
                    v-bind="attrs"
                    v-on="on">
                {{ item.SCH_REQ_CNTNT }}</span>
                </template>
                <span>{{ item.SCH_REQ_CNTNT }}</span>
              </v-tooltip>
              <span v-else>{{ item.SCH_REQ_CNTNT }}</span>
            </template>
            <template v-slot:item.CUST_NM="{ item }">
              <v-tooltip content-class="pl-tooltip " bottom v-if="item.CUST_NM.length > 4">
                <template v-slot:activator="{ on, attrs }">
                 <span
                     v-bind="attrs"
                     v-on="on">
                {{ item.CUST_NM }}</span>
                </template>
                <span>{{ item.CUST_NM }}</span>
              </v-tooltip>
              <span v-else>{{ item.CUST_NM }}</span>
            </template>
            <!--          <template v-slot:item.PROC_YN="{ item }">-->
            <!--              <span-->
            <!--                  :class="`pl-badge is-${mixin_displayStatus(item.PROC_YN, 'procYnList')}`"-->
            <!--                  style="width: 60px;"-->
            <!--              >-->
            <!--              {{ item.PROC_YN_NM }}</span>-->
            <!--          </template>-->
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
            보기 {{ mixin_getPagePeriod(inbdTransAssgnList, page) }} / {{ inbdTransAssgnList.length }}
            <compo-tooltip-btn
                TitleProp="다음 검색"
                ClassProp="pl-tooltip-btn is-line"
                IconProp="pl-icon20 arrow-next-paging"
                TooltipPositionProp="bottom"
                :DisabledProp="nextDisabled"
            ></compo-tooltip-btn>
          </span>
          </div>
        </div>
        <!-- right -->
        <div class="">
          <div class="pl-card">
            <h2 class="pl-subtit">배정 대상 상담사</h2>
            <!--          <div class="pl-subdesc">-->
            <!--            <p>콜백 그룹내 상담사 또는 소속을 선택 하신 후 인바운드 이관 배분 대상자를  조회할 수 있습니다.</p>-->
            <!--          </div>-->
            <!-- 검색 -->
            <div class="pl-rounded-box  is-mt-m">
              <div class="pl-form-inline-wrap pa-3">
                <div class="pl-form-inline">
                <span class="pl-label">
                  소속
                </span>
                  <div class="pl-desc">
                    <v-select
                        :items="ognzGroupList"
                        class="pl-form type-middle"
                        v-model="srchUserParam.srchDeptId"
                        @change="getUserList"
                        placeholder="전체"
                    />
                  </div>
                </div>
                <div class="pl-form-inline">
                <span class="pl-label">
                  상담사
                </span>
                  <v-text-field
                      class="pl-form is-search type-middle"
                      placeholder="검색어 입력"
                      v-model="srchUserParam.srchUserNm"
                      @keydown.enter="getUserList"
                      oninput="javascript: this.value = this.value.replace(/[^a-z|A-Z|0-9|가-힣|ㄱ-ㅎ|ㅏ-ㅣ]/g, '' );"
                  >
                  </v-text-field>
                </div>
              </div>
              <div class="d-flex align-center pa-3 is-border-top">
                <div class="">
                  <v-checkbox
                      class="pl-check"
                      label="콜백 그룹내 사용자만"
                      v-model="srchUserParam.srchClbkYn"
                  ></v-checkbox>
                </div>
                  <div class="ml-1">
                    <div class="pl-desc">
                      <v-select
                          v-if="srchUserParam.srchClbkYn"
                          :items="mixin_common_code_get(common_code, 'CALLBACK_GROUP', '선택')"
                          v-model="clbkGroupCd"
                          class="pl-form type-small"
                          @change="getUserList"
                          placeholder="전체"
                      />
                    </div>
                  </div>
<!--                <div class="ml-auto">-->
<!--                  <div class="pl-desc">-->
<!--                  </div>-->
<!--                </div>-->
                <div class="ml-auto">
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
              <!--              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ items2.length }})</em> 건</span>-->
              <!--              &lt;!&ndash; 엑셀 다운로드 버튼 &ndash;&gt;-->
              <!--              <compo-tooltip-btn-->
              <!--                TitleProp="엑셀 다운로드"-->
              <!--                ClassProp="pl-tooltip-btn "-->
              <!--                IconProp="pl-icon20 exceldown"-->
              <!--                TooltipPositionProp="bottom"-->
              <!--                @btnClick="mixin_testLog('엑셀 다운로드')"-->
              <!--              ></compo-tooltip-btn>-->
                            <v-btn class="pl-btn is-icon is-trans"
                                   :disabled="!srchUserParam.srchClbkYn || mixin_isEmpty(clbkGroupCd)"
                                   @click="mixin_showDialog('FindCuslClbk')"
                            >
                              <span class="pl-icon20 circle-plus"></span>
                              콜백그룹 사용자등록
                            </v-btn>
                            <v-btn class="pl-btn is-icon is-trans"
                                   :disabled="mixin_isEmpty(chkuserItem)"
                                   @click="beforeDel"
                            >
                              <span class="pl-icon20 trash"></span>
                              삭제
                            </v-btn>
                          </div>
            </div>
            <v-data-table
                class="pl-grid is-mt-s has-control"
                :headers="headers2"
                :items="assgnUserList"
                v-model="chkuserItem"
                :loading="isLoading2"
                show-select
                single-select
                fixed-header
                item-key="ROW_NUMBER"
                :items-per-page="assgnUserList.length"
                height="415px"
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
                  @click="beforeAssgn"
                  :disabled="mixin_isEmpty(chkAssgnTrgtItems) || mixin_isEmpty(chkuserItem) || disabledDist"
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
    <v-dialog
        v-model="dialogFindCuslClbk"
        content-class="dialog-draggable is-lg"
        hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="상담원 찾기"
          @hide="initFindMng"
          @submit="submitDialog('FindCuslClbk')"
      >
        <template slot="body">
          <CompoFindCusl
              ref="dialogFindCuslClbk"
              :PAGING_PROP="true"
              :CHK_YN_PROP="true"
              :CUSTCO_ID_PROP="store.getters['userStore/GE_USER_ROLE'].company.CD"
              @hideDialog="mixin_hideDialog('FindCuslClbk')"
          />
          <!-- PAGING_PROP(Boolean)         : 페이징 사용여부 -->
          <!-- chkYnProp(Boolean)           : 체크박스 사용여부 / true : array , false : object 리턴-->
          <!-- USER_PROP(Array)             : 사용자 목록 PROP - array형태로 보내면 컴포넌트의 userList에서 USER_ID를 찾아 체크  -->
          <!-- SEARCH_INPUT_PROP(Object)    : 검색할 직원/상담사(USER_NM 필수)  -->
          <!-- CUSTCO_ID_PROP(String)       : 선택 고객사ID - 해당 되는 고객사만 조회(센터) -->
        </template>
        <template slot="footer">
          <v-btn class="pl-btn" @click="$refs.dialogFindCuslClbk.submitData()">선택</v-btn>
          <v-btn class="pl-btn is-trans" @click="initFindMng">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>

import CompoFindCusl from "@/components/CompoFindCusl.vue";
import store from "@/store";

export default {
  name: "MENU_CSM_M0801", //인바운드 이관 배분
  components: {
    CompoFindCusl
  },
  data() {
    return {
      ASSGN_MODE: [
        {text: '콜백', value: 'ASSGN_MODE_CNSLTSCHDL01'},
        {text: '홈페이지', value: 'ASSGN_MODE_CNSLTSCHDL02'},
        {text: 'SMS', value: 'ASSGN_MODE_CNSLTSCHDL03'},
        {text: '이메일', value: 'ASSGN_MODE_CNSLTSCHDL04'},
      ],
      IS_AUTO_DUST_YN: [],
      AUTO_DIST_RULE_ITEM: [],
      autoDistParam:
          {
            autoDistKey: 'ASSGN_MODE_CNSLTSCHDL01',
            isAutoDist: '',
            autoDistRule: '',
          },

      common_code: [],
      assgnSttsCd: [],
      custco_id: this.$store.getters['userStore/GE_USER_ROLE'].company.CD,
      procYnList: [
        {text: '전체', value: '', vl: '', code: ''},
        {text: '미처리', value: 'red', vl: 'N', code: 'N'},
        {text: '처리완료', value: 'green', vl: 'Y', code: 'Y'},
      ],

      dialogFindCusl: false,
      dialogFindCuslClbk: false,
      dropDetail: false,
      chkTypes: [
        {text: "단지별 미지정", selected: true,},
        {text: "동별 지정", selected: true,},
      ],
      chkuserItem: [],
      chkAssgnTrgtItems: [],

      srchParam: {
        srchStartDt: this.$moment(new Date()).subtract(90, 'days').format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchAssgnCd: '',
        srchProcYn: '',
        srchFromUser: '',
        srchFromUserObj: {},
        srchFromUserNm: '',
        srchToUser: '',
        srchToUserObj: {},
        srchToUserNm: '',
        srchIvrCd: '',
      },
      srchUserType: '',
      srchUserParam: {
        srchDeptId: '',
        srchUserId: '',
        srchClbkYn: true,
        srchUserNm: '',
      },

      clbkGroupCd: '',
      inbdTransAssgnList: [],
      totAssgnCnt: 0,

      ognzGroupList: [],
      assgnUserList: [],
      totCuslCnt: 0,


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
      disabledDist: false,
      isLoading: false,
      isLoading2: false,
      headers: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '등록일시', value: 'REG_DT', align: 'center', width: '15%', sortable: true},
        {text: '유형', value: 'CNSLT_SCHDL_DIV_CD_NM', align: 'left', width: '50px', sortable: false},
        {text: '고객', value: 'CUST_YN', align: 'center', width: '50px', sortable: false},
        {text: '연락처', value: 'TEL_NO', align: '', width: '12%', sortable: false},
        {text: '배정일시', value: 'ASSGN_DT', align: 'center', width: '15%', sortable: false},
        {text: '고객명', value: 'CUST_NM', align: '', width: '8%', sortable: false},
        {text: '분배상태', value: 'ASSGN_STAT_CD_NM', align: '', width: '10%', sortable: false},
        {text: '분배 상담사', value: 'RGTR_NM', align: '', width: '9%', sortable: false},
        {text: '완료여부', value: 'PROC_YN', align: 'center', width: '65px', sortable: false},
        {text: '상담일시', value: 'PRCS_DT', align: 'center', width: '15%', sortable: false},
        {text: '자동여부', value: 'AUTO_ASSGN_YN', align: 'center', width: '65px', sortable: false},
      ],
      excelHeaders: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '등록일시', value: 'REG_DT', align: 'center', width: '170px', sortable: true},
        {text: '유형', value: 'CNSLT_SCHDL_DIV_CD_NM', align: 'left', width: '100px', sortable: false},
        {text: '고객', value: 'CUST_YN', align: 'center', width: '100px', sortable: false},
        {text: '연락처', value: 'TEL_NO', align: '', width: '120px', sortable: false},
        {text: '배정일시', value: 'ASSGN_DT', align: 'center', width: '150px', sortable: false},
        {text: '고객명', value: 'CUST_NM', align: '', width: '80px', sortable: false},
        {text: '분배상태', value: 'ASSGN_STAT_CD_NM', align: '', width: '100px', sortable: false},
        {text: '분배 상담사', value: 'RGTR_NM', align: '', width: '100px', sortable: false},
        {text: '완료여부', value: 'PROC_YN', align: 'center', width: '65px', sortable: false},
        {text: '상담일시', value: 'PRCS_DT', align: 'center', width: '150px', sortable: false},
        {text: '자동여부', value: 'AUTO_ASSGN_YN', align: 'center', width: '65px', sortable: false},
      ],

      //detail
      headers2: [
        {text: '상담사', value: 'USER_NM', align: 'left', width: '25%', sortable: false},
        {text: '로그인', value: 'LOGIN_STTS', align: 'center', width: '25%', sortable: false},
        {text: '금일 배정', value: 'ASSGN_CNT', align: 'center', width: '', sortable: false},
        {text: '금일 미처리', value: 'TODO_CNT', align: 'center', width: '', sortable: false},
      ],
      // 상태 컬러
      STAT_LIST: [
        {code: '로그인', value: 'blue'},
        {code: '로그아웃', value: 'red'},
      ],


    }
  },
  async created() {
    let codeList = ['CLLBCKSTAT', 'IVR_CD', 'DIST_RULE_CD', 'AUTO_DIST','CALLBACK_GROUP'];
    this.common_code = await this.mixin_common_code_get_all(codeList);
    await this.getDistRule();
    await this.getInbdTransAssgnList(false);
    await this.getDeptList();
    await this.getUserList();

    this.$eventBus.$on('setCuslInfo', (cuslInfo) => {
      console.log("setCuslInfo")
          if(this.dialogFindCusl) {
            if (this.srchUserType === 'TO') {
              this.srchParam.srchToUserObj = cuslInfo;
              this.srchParam.srchToUserNm = cuslInfo.USER_NM;
            } else {
              this.srchParam.srchFromUserObj = cuslInfo;
              this.srchParam.srchFromUserNm = cuslInfo.USER_NM;
            }
          }else{
            this.showConfirmInfo({
              msg: '콜백 사용자를 등록하시겠습니까?', callYes: () => {
                this.regClbkGroup(cuslInfo)
                this.closeAlert()
              }, callNo: this.closeAlert
            })
          }
    });
  },
  mounted() {
  },
  methods: {
    dayChange(type) {
      if (new Date(this.srchParam.srchStartDt) > new Date(this.srchParam.srchEndDt)) {
        if (type === 'start') {
          this.showAlertCaution({msg: '시작일자는 종료일자 이후일 수 없습니다. '})
          this.srchParam.srchStartDt = this.srchParam.srchEndDt
        } else {
          this.showAlertCaution({msg: '종료일자는 시작일자 이전일 수 없습니다. '})
          this.srchParam.srchEndDt = this.srchParam.srchStartDt
        }
      }
    },
    initSrchParam() {
      this.srchParam = {
        srchStartDt: this.$moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD'),
        srchEndDt: this.$moment(new Date()).format('YYYY-MM-DD'),
        srchAssgnCd: '',
        srchProcYn: '',
        srchFromUserObj: {},
        srchFromUserNm: '',
        srchToUserObj: {},
        srchToUserNm: '',
        srchIvrCd: '',
      }
    },
    async getInbdTransAssgnList(next) {
      this.isLoading = true;
      this.nextDisabled = true;
      this.chkAssgnTrgtItems = [];
      if (!next) {
        this.totAssgnCnt = 0;
        this.inbdTransAssgnList = [];
        this.pagination.page = 1;
        this.nextDisabled = false;
      }

      let sUrl = '/api/biz/common/select/selectInbdTransAssgnList'

      let postParam = {
        SRCH_START_DT: this.srchParam.srchStartDt.replaceAll('-', '') + '000000',
        SRCH_END_DT: this.srchParam.srchEndDt.replaceAll('-', '') + '235959',
        SRCH_ASSGN_STAT: this.srchParam.srchAssgnCd,
        SRCH_PROC_YN: this.srchParam.srchProcYn,
        SRCH_FROM_USER_ID: this.srchParam.srchFromUserObj.EMP_NO,
        SRCH_TO_USER_ID: this.srchParam.srchToUserObj.EMP_NO,
        SRCH_IVR_CD: this.srchParam.srchIvrCd,
        SCH_CALLBACK_YN: 'N'
      }

      let headParam = {
        head: {
          ns: 'lhcs.phone.cuttMng.assgn.dao.PhoneCuttAssgnMapper',
          sn: 'selectInbdTransAssgnList',
          ROW_CNT: this.pagination.rowsPerPage,
          PAGES_CNT: this.pagination.page,
          PAGING: "Y",
        }
      }

      const response = await this.common_postCall(sUrl, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        this.totAssgnCnt = response.HEADER.TOT_COUNT
        response.DATA.map((item) => {
          this.inbdTransAssgnList.push({
            ROW_NUMBER: item.ROW_NUMBER
            , RCPT_CLBK_ID: item.RCPT_CLBK_ID
            , REG_DT: this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd HH:mm:ss')
            , CUST_ID: item.CUST_ID
            , CUST_YN: this.mixin_isEmpty(item.CUST_ID) || item.CUST_ID == '0' ? 'N' : 'Y'
            , CUST_NM: item.CUST_NM
            , ASSGN_DT: this.mixin_convertDate(item.ASSGN_DT, 'yyyy-MM-dd HH:mm:ss')
            , PRCS_DT: this.mixin_convertDate(item.PRCS_DT, 'yyyy-MM-dd HH:mm:ss')
            , AUTO_ASSGN_YN: item.AUTO_ASSGN_YN
            , PROC_YN: item.PROC_YN
            , PROC_YN_NM: item.PROC_YN === 'Y' ? '처리완료' : '미처리'
            , RGTR_ID: item.RGTR_ID
            , RGTR_NM: item.RGTR_NM
            , FROM_USER_ID: item.FROM_USER_ID
            , FROM_USER_NM: item.FROM_USER_NM
            , TO_USER_ID: item.TO_USER_ID
            , TO_USER_NM: item.TO_USER_NM
            , ASSGN_STAT_CD: item.ASSGN_STAT_CD
            , ASSGN_STAT_CD_NM: item.ASSGN_STAT_CD_NM
            , CNSLT_SCHDL_DIV_CD: item.CNSLT_SCHDL_DIV_CD
            , CNSLT_SCHDL_DIV_CD_NM: item.CNSLT_SCHDL_DIV_CD_NM
            , TEL_NO: this.mixin_setPhoneNo(item.TEL_NO)
            , SCH_REQ_CNTNT: item.SCH_REQ_CNTNT
            , SCH_HNO: item.SCH_HNO
            , SCH_CALLBACK_YN: item.SCH_CALLBACK_YN
            , CALLBACK_FLAG: item.CALLBACK_FLAG
            , ANI: item.ANI
            , IVR_PATH: item.IVR_PATH
          })
        })

        if (response.HEADER.next !== null && response.HEADER.next !== undefined) {
          if (response.HEADER.next) {
            this.nextDisabled = false //버튼 활성화
          } else {
            this.nextDisabled = true  //버튼 비활성화
          }
        }
        this.pagination.page += 1;
        this.isLoading = false
      }
    },

    // 상담원 찾기 초기화 이벤트 송신
    initFindMng() {
      if(this.dialogFindCuslClbk){
        this.mixin_hideDialog('FindCuslClbk')
      }else{
        this.mixin_hideDialog('FindCusl')
      }
      this.$eventBus.$emit('initFindMng');
    },

    openFindMngDialog(type, name) {
      this.srchUserType = type;
      this.$eventBus.$emit('findCusl', name);
      this.mixin_showDialog('FindCusl')
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
    beforeSetDist() {
      this.showConfirmCaution({msg: '자동배분 설정을 변경하시겠습니까?', callYes: this.setDistRule, callNo: this.closeAlert})
    },
    async getDistRule() {
      let sUrl = '/api/biz/common/select/selectConfClbk'
      let postParam = {
        AUTO_DIST_KEY: this.autoDistParam.autoDistKey,
        DIST_RULE_CD: 'DIST_RULE_CALLBACK'
      }
      let headParam = {
        head: {
          ns: 'lhcs.system.conf.dao.confMngMapper',
          sn: 'selectConfClbk'
        }
      }

      const response = await this.common_postCall(sUrl, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        this.autoDistParam.isAutoDist = response.DATA[0].IS_AUTO_DIST
        this.autoDistParam.autoDistRule = response.DATA[0].DIST_RULE
      }
    },
    async setDistRule() {
      let sUrl = '/system-api/conf/mng/insertDistRule'

      let postParam = {
        arrSetConf: [
          {KEY: this.autoDistParam.autoDistKey, VAL: this.autoDistParam.isAutoDist},
          {
            KEY: 'DIST_RULE_CALLBACK',
            VAL: this.autoDistParam.isAutoDist !== 'N' ? this.autoDistParam.autoDistRule : ''
          },
        ],
      }

      let headParam = {
        head: {
          DATA_OBJECT: "arrSetConf"
        }
      }
      const response = await this.common_postCall(sUrl, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({
          msg: '정상 처리 되었습니다.', callAfter: () => {
            this.getDistRule()
            this.closeAlert()
          }
        })
      } else {
        this.showToastCaution({msg: response.HEADER.ERROR_MSG, callAfter: this.closeAlert})
      }
    },

    async getUserList() {
      this.isLoading2 = true;
      this.assgnUserList = [];
      this.chkuserItem = [];
      let postParam = {
        SRCH_DEPT_ID: this.srchUserParam.srchDeptId,
        SRCH_CLBK_YN: this.srchUserParam.srchClbkYn ? 'CLBK' : '',
        CUSTCO_ID: this.custco_id,
        SRCH_USER_NM: this.srchUserParam.srchUserNm,
        SRCH_CLBK_GROUP: this.clbkGroupCd,
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
          item.ICON_IMG_URI = item.ICON_IMG_URI !== '/' ? '/upload/' + item.ICON_IMG_URI : require('@/assets/img/@manager_profile_default.png')
          this.assgnUserList.push(item)
        });
        if (Number(response.HEADER.TOT_COUNT) < 1) {
          this.showAlertInfo({
            msg: '자동할당 받을 콜백그룹에 상담사가 없습니다.', callAfter: () => {
              this.disabledDist = true;
            }
          })
        }else{
          this.disabledDist = false;
        }
      }
      this.isLoading2 = false;
    },
    beforeAssgn() {
      let procYn = false
      let assngYn = false

      this.chkAssgnTrgtItems.map(item=>{
        // 처리상태가 'Y'인 건수
        if(item.PROC_YN ==='Y'){
          procYn = true
        }
        // 배분상태가 '미배분'상태인 건수
        if(item.ASSGN_STAT_CD ==='CLLBCKSTAT08'){
          assngYn = true
        }
      })

      if (this.mixin_isEmpty(this.chkAssgnTrgtItems)) {
        return this.showToastCaution({msg: "배정대상 고객을 선택해 주세요"})
      } else if (this.mixin_isEmpty(this.chkuserItem)) {
        return this.showToastCaution({msg: "배정대상을 선택해 주세요"})
      } else if ( procYn ) {
        return  this.showToastCaution({msg: "처리완료 건은 배정할 수 없습니다."})
      } else if ( assngYn ) {
          return this.showToastCaution({msg: "배정 완료된 건은 배정할 수 없습니다."})
      } else if ( this.chkuserItem[0].LOGIN_STTS === '로그아웃' ) {
          return this.showToastCaution({msg: "로그인한 상담사에게만 배정할 수 있습니다."})
      } else {
        let msg = new Array(this.chkAssgnTrgtItems.length);
        this.chkAssgnTrgtItems.map((item, index) => {
          msg[index] = "[" + item.CNSLT_SCHDL_DIV_CD_NM + "][" + item.TEL_NO + " / " + item.CUST_NM + "] : " + item.FROM_USER_NM + " => " + this.chkuserItem[0].USER_NM
        })

        this.showConfirmInfo({
          msg: "<strong>배정확인</strong>\n\n" + msg.join("\n") + "\n\n해당 상담사에게 배정 하시겠습니까?",
          callYes: this.assignment,
          callNo: this.closeAlert
        })
      }
    },
    async assignment() {
      let sUrl = '/phone-api/cutt/mng/assgn/updateAssgn'

      let postParam = {
        assgnTrgt: this.chkAssgnTrgtItems.map(row => {
          return {
            CNSLT_SCHDL_DIV_CD: row.CNSLT_SCHDL_DIV_CD,
            SEQ_KEY: 'RCPT_CLBK_ID',
            SEQ_ID: row.RCPT_CLBK_ID,
          }
        }),
        TO_USER_ID: this.chkuserItem[0].USER_ID,
      }

      let headParam = {
        head: {
          DATA_OBJECT: "assgnTrgt"
          , ns: 'lhcs.phone.cuttMng.assgn.dao.PhoneCuttAssgnMapper'
          , sn: 'updateAssgn'
        }
      }

      const response = await this.common_postCall(sUrl, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showToastInfo({
          msg: '정상 처리 되었습니다.', callAfter: () => {
            this.closeAlert();
            this.chkuserItem = [];
            this.chkAssgnTrgtItems = [];
            this.getInbdTransAssgnList(false);
            this.getUserList();
          }
        })
      } else {
        this.showToastCaution({msg: '배정 처리중 오류가 발생했습니다.', callAfter: this.closeAlert})
      }
    },
    async regClbkGroup(cuslInfo){
      cuslInfo.map(item=>{
        item.REG_USER_ID = item.USER_ID
      })
      let sUrl = 'phone-api/cutt/mng/clbk/insertClbkGroup'
      let postParam = {
        cuslInfo : cuslInfo,
        CLBK_GROUP_CD : this.clbkGroupCd
      }
      let headParam = {
        head : {
          DATA_OBJECT : 'cuslInfo'
        }
      }
      try{
        const response = await this.common_postCall(sUrl, postParam, headParam)
        if (!response.HEADER.ERROR_FLAG) {
          this.showToastInfo({msg: '정상 처리 되었습니다.'})
          this.getUserList();
        } else {
          this.showToastCaution({msg: '처리 중 문제가 발생했습니다.'})
        }
      }catch(e){
        this.showToastCaution({msg: '처리 중 문제가 발생했습니다.'})
      }

    },
    beforeDel(){
      this.showConfirmCaution({msg : '해당 콜백 사용자를 삭제 하시겠습니까?',  callYes : ()=>{
          this.delClbkGroup()
          this.closeAlert()
        }, callNo : this.closeAlert})
    },
    async delClbkGroup(){
      let sUrl = '/api/biz/common/delete/deleteClbkUser'
      let postParam = {
        CHK_USER_ID : this.chkuserItem[0].USER_ID
      }

      try{
        const response = await this.common_postCall(sUrl, postParam, {head: {ns: 'lhcs.phone.clbk.dao.PhoneCuttClbkMapper'}})
        if (!response.HEADER.ERROR_FLAG) {
          this.showToastInfo({msg: '정상 처리 되었습니다.'})
          this.getUserList();
        } else {
          this.showToastCaution({msg: '처리 중 문제가 발생했습니다.'})
        }
      }catch(e){
          this.showToastCaution({msg: '처리 중 문제가 발생했습니다.'})
      }

    }
  },
  computed: {
    store() {
      return store
    },
  },
  watch: {},
  beforeDestroy() {
    // 직원 정보 수신 이벤트 - eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCuslInfo");
  },
};
</script>

<style lang="scss" scoped>

</style>
