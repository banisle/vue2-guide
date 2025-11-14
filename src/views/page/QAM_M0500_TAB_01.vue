<template>
  <div class="pl-cols fill-height">
    <!-- left -->
    <div class="pl-card-body is-col-fix is-vrt" style="width: 40%;">
      <!-- 평가 실행 현황  grid-->
      <div class="">
        <!-- 평가 실행 현황 -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left">
            <strong class="pl-bullet-txt is-blue">평가 실행 현황 </strong>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaExecPaperList.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="gridheaders1"
              :DataBodyProp="qaExecPaperList"
              FileNameProp="평가 실행 현황"
              SheetNameProp="sheetDown"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s "
          :headers="gridheaders1"
          :items="qaExecPaperList"
          :item-class="isActiveRow1"
          fixed-header
          item-key="ROW_NUM"
          height="180px"
          disable-pagination
          hide-default-footer
          @click:row="clickPaperRow"
          :loading="loading01"
          loading-text="조회중입니다."
          no-data-text="등록된 데이터가 없습니다.">
          <!-- 진행상태 -->
          <template v-slot:item.PROC_STAT_NM="{ item }">
            <span
              :class="`pl-badge is-${mixin_displayStatus(item.PROC_STAT, 'STAT_LIST')}`"
              style="width: 40px;"
              >
            {{ item.PROC_STAT_NM }}</span>
          </template>

        </v-data-table>
      </div>

      <!-- 2024-06 (2차) 상담품질 통합평가_변경(24.06)_마이홈센터  -->
      <div class="is-mt-m">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <strong class="pl-bullet-txt is-blue">{{ this.selectedPaper.PAPER_NM }}</strong>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s "
          :headers="gridheaders2"
          :items="qaExecTgtList"
          :item-class="isActiveRow2"
          fixed-header
          item-key="ROW_NUM"
          height="400px"
          disable-pagination
          hide-default-footer
          @click:row="clickTgtRow"
          :loading="loading02"
          loading-text="조회중입니다."
          no-data-text="등록된 데이터가 없습니다.">
          <!-- 대상자 -->
          <template v-slot:item.TGT_EMP_NM="{ item }">
            <img :src="item.IMG" :alt="item.TGT_EMP_NM" class="pl-grid-portrait" style="width: 20px; height: 20px;" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
            <span class="ml-1">{{ item.TGT_EMP_NM }}</span>
          </template>
        </v-data-table>

      </div>

    </div>

    <!-- right -->
    <div class="pl-card-body">
      <!-- 상단 -->
      <div class="pt-3">
        <div class="d-flex" style="position: relative;">
          <div style="flex: 0 0 40px">
            <img :src="tgtProfile.IMG" :alt="tgtProfile.TGT_EMP_NM" style="width: 100%; height: 40px; border-radius: 50%;"  @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
          </div>
          <div class="ml-4">
            <div >
              <strong style="font-size: 14px">{{ this.tgtProfile.TGT_EMP_NM }}</strong>
              <span class="ml-2 is-txt-sub">{{ this.tgtProfile.FULL_DEPT_NM }}</span></div>
            <div class="spacing-wrap sp-16">
              <div>
                <strong>평가월</strong>
                <span class="ml-2">{{ this.tgtProfile.FULL_STD_MT }}</span>
              </div>
              <div>
                <strong>평가상태</strong>
                <span class="ml-2 pl-badge is-bg-blue">{{ this.tgtProfile.COMPLETE_YN_NM }}</span>
              </div>
              <div>
                <strong>결과공개</strong>
                <span class="ml-2 pl-badge is-bg-yellow">{{ this.tgtProfile.APPLY_YN_NM }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 검색 -->
        <div class="pl-rounded-box is-mt-s">
          <div class="px-5 py-3">
            <div class="pl-form-inline-wrap ">
              <div class="pl-form-inline">
                <span class="pl-label">
                  상담채널
                </span>
                <div class="pl-desc">
                  <v-select
                    v-model="cnsltSearchParams.DRWI_TYPE_CD"
                    :items="DROP_DRWI_TYPE_CD"
                    class="pl-form type-middle is-sm"
                    placeholder="전체"
                  />
                  <v-select
                    v-model="cnsltSearchParams.RCPT_CHN_CD"
                    :items="mixin_common_code_get_global(this.list_common_code, 'CVC', propsSearchParams.CENTER_ID, '전체')"
                    class="pl-form type-middle"
                    placeholder="전체"
                  />
                </div>
              </div>
              <div class="pl-form-inline" style="width: 398px;">
                <span class="pl-label">
                  기간
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle is-sm"
                    placeholder="선택"
                    :items="DROP_DATE_TYPE"
                    v-model="cnsltSearchParams.DATE_TYPE"
                  />
                  <compo-date-range-picker
                    :StartDayProp.sync="cnsltSearchParams.FROM_DT"
                    :EndDayProp.sync="cnsltSearchParams.TO_DT"
                    ParentStyleProp="width: 200px"
                  />
                </div>
              </div>
            </div>
            <div class="pl-form-inline-wrap mt-2">
              <div class="pl-form-inline flex-grow-1">
                <span class="pl-label">
                  상담유형
                </span>
                <div class="pl-desc">
                  <compo-cutt-type-combo
                    FormSeProp="SRCH"
                    :CustcoProp="propsSearchParams.CENTER_ID"
                    :DisabledProp="false"
                    @EMIT_CUTT_TYPE="(data)=>{cnsltSearchParams.CUTT_TYPE_ID = data}"
                    :VisbleSearchProp="false"
                  />
                </div>
              </div>
              <div class="pl-form-inline flex-grow-1">
                <span class="pl-label">
                  상담메모
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form type-middle"
                    placeholder="메모내용 입력"
                    v-model="cnsltSearchParams.CUTT_CN"
                    clearable
                    @keyup.enter="clickSearchBtn"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class=" px-5 py-3 is-border-top">
            <div class="pl-form-inline-wrap ">
              <div class="pl-form-inline flex-grow-1">
                <span class="pl-label">
                  통화시간
                </span>
                <div class="pl-desc">
                  <div class="d-flex">
                    <v-text-field
                      class="pl-form type-middle"
                      placeholder="최소 통화시간(분)"
                      v-model="cnsltSearchParams.MIN_PHN_HR"
                      oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                      clearable
                    />
                    <span class="pl-unit">~</span>
                    <v-text-field
                      class="pl-form type-middle"
                      placeholder="최대 통화시간(분)"
                      v-model="cnsltSearchParams.MAX_PHN_HR"
                      oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                      clearable
                    />
                  </div>
                  <v-radio-group
                    v-model="cnsltSearchParams.ORDER_BY_TYPE"
                    row
                    class="pl-radio-group ml-2"
                  >
                    <v-radio
                      v-for="(rad01, index) in radioGroup1"
                      :key="radioGroup1[index].value"
                      :label="rad01.text"
                      :value="rad01.value"
                      class="pl-radio"
                    >
                    </v-radio>
                  </v-radio-group>
                </div>
              </div>
              <!-- 버튼 -->
              <div>
                <v-btn class="pl-btn is-icon" @click="clickSearchBtn">
                  <span class="pl-icon20 search"></span>
                  조회
                </v-btn>
                <!-- 상세  -->
                <v-tooltip content-class="pl-tooltip bottom" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-menu
                      min-width="450"
                      bottom
                      left
                      offset-y
                      :close-on-content-click=false
                      content-class="pl-menu-drop pa-0"
                      v-model="dropDetail"
                    >
                      <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                        <v-btn
                          v-bind="menuAttrs"
                          v-on="menuOn"
                          class="pl-tooltip-btn ml-1"
                          min-width="30"
                          height="30"
                          plain
                          >
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                            class="pl-icon20 detail"></v-icon>
                        </v-btn>
                      </template>
                      <div class="">
                        <!-- header -->
                        <div class="d-flex align-center pl-card">
                          <div class="pl-subtit">상세 검색</div>
                          <v-btn
                            @click="dropDetail = false"
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
                        <!-- content -->
                        <div class="pl-card">
                          <div class="pl-form-inline-wrap vertical gap-8 label-80">
                            <div class="pl-form-inline">
                              <span class="pl-label">
                                인입번호
                              </span>
                              <div class="pl-desc">
                                <v-text-field
                                  class="pl-form type-middle"
                                  placeholder="전화번호 입력"
                                  v-model="cnsltSearchParams.CUST_PHN_NO"
                                  clearable
                                />
                              </div>
                            </div>
                            <div class="pl-form-inline">
                              <span class="pl-label">
                                고객 ID
                              </span>
                              <div class="pl-desc">
                                <v-text-field
                                  class="pl-form type-middle"
                                  placeholder="고객 ID 입력"
                                  v-model="cnsltSearchParams.CUST_ID"
                                  oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                                  clearable
                                />
                              </div>
                            </div>
                            <div class="pl-form-inline">
                              <span class="pl-label">
                                상담번호
                              </span>
                              <div class="pl-desc">
                                <v-text-field
                                  class="pl-form type-middle"
                                  placeholder="상담번호 입력"
                                  v-model="cnsltSearchParams.PHN_CUTT_ID"
                                  oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                                  clearable
                                ></v-text-field>
                              </div>
                            </div>
                            <div class="pl-form-inline ">
                              <span class="pl-label">
                                티켓 ID
                              </span>
                              <div class="pl-desc">
                                <v-text-field
                                  class="pl-form type-middle"
                                  placeholder="티켓 ID 입력"
                                  v-model="cnsltSearchParams.KAKAO_CHT_ID"
                                  clearable
                                ></v-text-field>
                              </div>
                            </div>

                            <div class="pl-form-inline is-border-sub-top pt-3 is-mt-s" v-if="propsSearchParams.CENTER_ID != '4'">
                              <span class="pl-label">
                                상담지역
                              </span>
                              <div class="pl-desc">
                                <compo-cutt-zone-combo
                                  :FormSeProp="'SRCH_V'"
                                  :CustcoProp="propsSearchParams.CENTER_ID"
                                  @EMIT_CUTT_ZONE="(data)=>{ cnsltSearchParams.CUTT_ZONE = data}"
                                />
                              </div>
                            </div>

                            <div class="pl-form-inline is-border-sub-top pt-3 is-mt-s" v-if="propsSearchParams.CENTER_ID != '4'">
                              <span class="pl-label">
                                접속정보
                              </span>
                              <div class="pl-desc flex-column">
                                <v-text-field
                                  class="pl-form type-middle is-auto"
                                  v-model="cnsltSearchParams.ARS_INFO"
                                  clearable
                                ></v-text-field>
                                <v-checkbox
                                  class="pl-check align-self-start"
                                  label="담당자 이관 여부"
                                  v-model="cnsltSearchParams.TRANS_YN"
                                ></v-checkbox>
                              </div>
                            </div>

                          </div>
                        </div>
                        <!-- footer -->
                        <div class="is-border-top pl-btn-wrap pl-card ">
                          <v-btn class="pl-btn is-trans ml-auto" @click="dropDetail = false">닫기</v-btn>
                          <v-btn class="pl-btn" @click="clickSearchBtn">검색</v-btn>
                        </div>
                      </div>
                    </v-menu>
                  </template>
                  <span>상세</span>
                </v-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 상담이력현황 grid -->
      <div class="is-mt-m">
        <div class="pl-grid-top">
          <div class="pl-grid-top-left">
            <strong class="pl-bullet-txt is-blue">상담이력 현황</strong>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ qaExecCnsltList.length }})</em> 건</span>
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="gridheaders3"
              :DataBodyProp="qaExecCnsltList"
              FileNameProp="상담이력 현황"
              SheetNameProp="sheetDown"
            />
          </div>
        </div>
        <v-data-table
          ref="cnslHistGird"
          class="pl-grid is-mt-s is-hover"
          :headers="gridheaders3"
          :items="qaExecCnsltList"
          :item-class="isActiveRow3"
          fixed-header
          height="366px"
          item-key="ROW_NUM"
          @click:row="clickCnsltRow"
          hide-default-footer
          :items-per-page="ROW_PER_PAGE"
          :page.sync="page"
          @page-count="pageCount = $event"
          :loading="loading03"
          loading-text="조회중입니다."
          no-data-text="등록된 데이터가 없습니다.">
          <!-- <template v-slot:item.FULL_CUTT_TYPE_NM={item}>
            <v-tooltip content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs" v-html="item.FULL_CUTT_TYPE_NM" />
              </template>
              <div v-html="item.FULL_CUTT_TYPE_NM"></div>
            </v-tooltip>
          </template> -->
          <!-- <template v-slot:item.CALL_BTN={item}>
            <template v-if="item.CALL_ID && (item.CALL_ID.startsWith('CO') === false) ">
              <compo-tooltip-btn
                TitleProp="녹취 듣기"
                ClassProp="pl-tooltip-btn ml-auto"
                IconProp="pl-icon20 audioControl"
                TooltipPositionProp="bottom"
                :MinWidthProp=20
                :HeightProp=20
                @btnClick="showListenAudio(item)"
              ></compo-tooltip-btn>
              <compo-tooltip-btn
                TitleProp="대화록 보기"
                ClassProp="pl-tooltip-btn ml-1"
                IconProp="pl-icon20 sts"
                TooltipPositionProp="bottom"
                :MinWidthProp=20
                :HeightProp=20
                @btnClick="mixin_showTalkLog(item)"
              ></compo-tooltip-btn>
            </template>
            <template v-if="item.CALL_ID && (item.CALL_ID.startsWith('CO') === true) && !mixin_isEmpty(item.RECORD_KEY) ">
              <compo-tooltip-btn
                TitleProp="녹취 듣기"
                ClassProp="pl-tooltip-btn ml-auto"
                IconProp="pl-icon20 audioControl"
                TooltipPositionProp="bottom"
                :MinWidthProp=20
                :HeightProp=20
                @btnClick="showListenAudio(item)"
              ></compo-tooltip-btn>
            </template>
          </template> -->
          <!-- 평가 -->
          <!-- <template v-slot:item.STD_BTN="{item}">
            <compo-tooltip-btn
              :TitleProp="mixin_isEmpty(item.STD_ID) ? '평가하기' : item.STD_MT_ORD+'차 평가'"
              ClassProp="pl-tooltip-btn"
              IconProp="pl-icon20 manager_test"
              TooltipPositionProp="bottom"
              @btnClick="clickExecuteBtn(item)"
            ></compo-tooltip-btn>
          </template> -->
          <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in gridheaders3">
            <template v-if="header.value === 'FULL_CUTT_TYPE_NM'">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" v-html="item['FULL_CUTT_TYPE_NM']" />
                </template>
                <div v-html="item['FULL_CUTT_TYPE_NM']"></div>
              </v-tooltip>
            </template>
            <template v-else-if="header.value === 'CUTT_CN'">
              <v-tooltip content-class="pl-tooltip " bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="my-2"
                      v-bind="attrs"
                      v-on="on"
                      style="white-space: pre-line;"
                      v-html="item[header.value]"></div>
                  </template>
                  <div style="white-space: pre-line;" v-html="item[header.value]"></div>
                </v-tooltip>
            </template>
            <template v-else-if="header.value === 'REC_YN'">
              <template v-if="item['CALL_ID'] && (item['CALL_ID'].startsWith('CO') === false) "><!-- 콜아이디가 신형인경우만. 추후 마이그레이션 데이터에 대한 처리 필요함.  -->
                <compo-tooltip-btn
                  TitleProp="녹취 듣기"
                  ClassProp="pl-tooltip-btn ml-auto"
                  IconProp="pl-icon20 audioControl"
                  TooltipPositionProp="bottom"
                  :MinWidthProp=20
                  :HeightProp=20
                  @btnClick="showListenAudio(item)"
                ></compo-tooltip-btn>
                <compo-tooltip-btn
                  v-if="item['STT_YN'] === 'Y'"
                  TitleProp="대화록 보기"
                  ClassProp="pl-tooltip-btn ml-1"
                  IconProp="pl-icon20 sts"
                  TooltipPositionProp="bottom"
                  :MinWidthProp=20
                  :HeightProp=20
                  @btnClick="mixin_showTalkLog(item)"
                ></compo-tooltip-btn>
              </template>
              <template v-if="item['CALL_ID'] && (item['CALL_ID'].startsWith('CO') === true) && !mixin_isEmpty(item['RECORD_KEY']) ">
                <compo-tooltip-btn
                  TitleProp="녹취 듣기"
                  ClassProp="pl-tooltip-btn ml-auto"
                  IconProp="pl-icon20 audioControl"
                  TooltipPositionProp="bottom"
                  :MinWidthProp=20
                  :HeightProp=20
                  @btnClick="showListenAudio(item)"
                ></compo-tooltip-btn>
              </template>
            </template>
            <template v-else-if="header.value === 'STD_BTN'">
              <compo-tooltip-btn
                :TitleProp="mixin_isEmpty(item['STD_ID']) ? '평가하기' : item['STD_MT_ORD']+'차 평가'"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 manager_test"
                TooltipPositionProp="bottom"
                @btnClick="clickExecuteBtn(item)"
              ></compo-tooltip-btn>
            </template>
            <template v-else>{{ item[header.value] }}</template>
          </template>
        </v-data-table>
        <div class="pl-pager">
          <div class="pl-pager-row">
            <span>페이지당 항목 수</span>
            <v-select
              class="pl-form"
              v-model="ROW_PER_PAGE"
              :items="perPage"
              :item-text="toString(ROW_PER_PAGE)"
              @change="ROW_PER_PAGE = parseInt(ROW_PER_PAGE);"
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
            보기 {{ mixin_getPagePeriod(qaExecCnsltList, page) }} / {{ qaExecCnsltList.length }}
            <compo-tooltip-btn
              TitleProp="다음 검색"
              ClassProp="pl-tooltip-btn is-line"
              IconProp="pl-icon20 arrow-next-paging"
              TooltipPositionProp="bottom"
              @btnClick="selectQaExecuteCnsltList(true)"
              :DisabledProp = "nextDisabled"
            ></compo-tooltip-btn>
          </span>
        </div>
      </div>

    </div>

    <!-- side panel : 상담 상세정보-->
    <v-slide-x-reverse-transition>
      <div v-if=" dialogResult === true "
        class="pl-quick-layer"
        :style="tempCenterStyle"
        style="width: 800px"
              >
        <QAM_M0500_CS_DETAIL
          @Close="closeSlide()"
          @Refresh="refreshQaExecute"
          :propsQaBaseData="propsQaBaseData"
        />
      </div>
    </v-slide-x-reverse-transition>

  </div>
</template>

<script>

import CompoTalkLog from '@/components/CompoTalkLog';
import CompoManagerInfo from '@/components/CompoManagerInfo';
import QAM_M0500_CS_DETAIL from '@/views/page/QAM_M0500_CS_DETAIL';
import CompoCuttTypeCombo from "@/components/CompoCuttTypeCombo.vue";
import CompoCuttZoneCombo from "@/components/CompoCuttZoneCombo.vue";

export default {
  name: 'QAM_M0500_TAB_01', //상담콜 조회
  components: {
    CompoTalkLog,
    CompoManagerInfo,
    QAM_M0500_CS_DETAIL,
    CompoCuttTypeCombo,
    CompoCuttZoneCombo,
  },
  props:{
    propsSearchParams:{
      type: Object,
      default: {}
    }
  }, 
  data() {
    return {
      // 평가 실행 현황 grid
      page: 1,
      pageCount: 0,
      perPage: [20,30,50,100],
      ROW_PER_PAGE: 20,
      nextDisabled: true,
      pagination: {
        page: 1,
        rowsPerPage: 500,
        sortBy: "",
        descending: "",
      },

      loading01 : false,
      loading02 : false,
      loading03 : false,

      gridheaders1: [
        { text: '평가년월', value: 'STD_MT', align: 'center', width: '70px',sortable: true },
        { text: '회차', value: 'STD_MT_ORD', align: 'center', width: '40px',sortable: true },
        { text: '평가지', value: 'PAPER_NM', align: 'left', width: '250px', sortable: true },
        { text: '배정', value: 'TGT_EMP_CNT', align: 'center', width: '40px', sortable: true },
        { text: '완료', value: 'COMPLETE_CNT', align: 'center', width: '40px', sortable: true },
        { text: '진행상태', value: 'PROC_STAT_NM', align: 'center', width: '80px', sortable: true },
      ],

      gridheaders2: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px',sortable: true },
        { text: '센터', value: 'UP_DEPT_NM', align: '', width: '25%',sortable: true },
        { text: '소속', value: 'DEPT_NM', align: '', width: '25%',sortable: true },
        { text: '대상자', value: 'TGT_EMP_NM', align: 'left', width: '17%', sortable: true },
        { text: '평가건수', value: 'STD_CNT', align: 'center', width: '15%', sortable: true },
        { text: '평가일', value: 'STD_DATE', align: '', width: '15%', sortable: true },
      ],

      // 상담이력 현황 grid
      gridheaders3: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: true },
        { text: '접수일시', value: 'REG_DT', align: 'center', width: '130px', sortable: true },
        { text: '상담시간', value: 'CNSLT_TM', align: 'center', width: '75px', sortable: true  },
        { text: '상담채널', value: 'RCPT_CHN_NM', align: 'left', width: '77px', sortable: true  },
        { text: '인입번호', value: 'CUST_PHN_NO', align: 'center', width: '103px', sortable: true  },
        { text: '상담유형', value: 'FULL_CUTT_TYPE_NM', align: 'left', width: '140px', sortable: true  },
        { text: '상담메모', value: 'CUTT_CN', align: 'left', width: '', sortable: true  },
        { text: '상담사', value: 'TGT_EMP_NM', align: 'left', width: '60px', sortable: false  },
        { text: '녹취', value: 'REC_YN', align: 'center pa-0', width: '60px', sortable: false  },
        { text: '평가', value: 'STD_BTN', align: 'center', width: '50px', sortable: false  },
      ],

      STAT_LIST: [
        { code: 'CLOSED', value: 'red'},
        { code: 'PROCEEDING', value: 'green'},
      ],

      STAT_LIST2: [
        { code: 'Y', value: 'is-bg-blue'},
        { code: 'N', value: 'is-bg-yellow'},
      ],

      radioGroup1: [
        {
          text: "통화시간↑",
          value: "PHN_HR_ASC"
        },
        {
          text: "통화시간↓",
          value: "PHN_HR_DESC"
        },
        {
          text: "상담번호",
          value: "PHN_CUTT_ID"
        },
      ],

      DROP_DATE_TYPE: [
        {
          text: "접수일자",
          value: "REG_DT"
        },
        {
          text: "처리일자",
          value: "PRCS_DT"
        },
      ],

      // 인입구분
      DROP_DRWI_TYPE_CD:[
        {text:"전체", value:""}
        , {text:"IN", value:"IN"}
        , {text:"OUT", value:"OUT"}
      ],

      list_common_code : [],

      // 상세검색
      dropDetail: false,

      // 평가실행 평가지 팝업
      dialogResult: false,

      // 조회 조건
      searchParams: {},
      cnsltSearchParams:{
        FROM_DT: this.$moment().format("YYYY-MM-DD"),
        TO_DT: this.$moment().format("YYYY-MM-DD"),
        DATE_TYPE: "REG_DT",
        ORDER_BY_TYPE: "PHN_CUTT_ID",
        MIN_PHN_HR: "",
        MAX_PHN_HR: "",
        CUTT_TYPE_ID: new Array(4), // 상담유형
        DRWI_TYPE_CD: "",           //인입구분
        RCPT_CHN_CD: "",            // 상담채널
        CUST_PHN_NO: "",            // 인입번호
        CUST_ID: "",                // 고객ID
        PHN_CUTT_ID: "",            // 상담번호
        KAKAO_CHT_ID: "",           // 티켓ID
        ARS_INFO: "",               // 접속정보
        TRANS_YN: false,            // 담당자 이관 여부
        CUTT_ZONE: new Array(3),    // 상담지역정보
        CUTT_CN: "",                // 상담메모
      },

      // 평가실행 평가지 목록
      qaExecPaperList:[],
      selectedPaper:{},

      // 평가대상자 목록
      qaExecTgtList:[],
      selectedTgt:{},
      tgtProfile:{
        TGT_EMP_NM: "대상자"
        , FULL_DEPT_NM: "센터-팀명"
        , FULL_STD_MT: this.$moment().format("YYYY-MM")
        , COMPLETE_YN_NM : "평가중"
        , APPLY_YN_NM: "미공개"
        , IMG: require('@/assets/img/@manager_profile_default.png')
      },

      // 상담이력
      qaExecCnsltList:[],
      selectedCnslt:{},

      propsQaBaseData:{},

      MESSAGE: {
        CONFIRM: {
        },
        ALERT:{
        },
        TOAST : {
        },
        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      },
    }
  },
  methods: {
    
    setSearchParams(obj){
      this.searchParams = obj;
      this.propsQaBaseData = {};
      this.selectQaExecutePaperList();
    },

    async selectQaExecutePaperList(){
      // 초기화
      this.qaExecTgtList = [];
      this.selectedPaper = {};
      this.selectedTgt = {};
      this.qaExecCnsltList = [];
      this.selectedCnslt = {};
      this.clearTgtProfile();

      // let sUrl = '/phone-api/qa/selectQaExecutePaperList';
      let sUrl = '/api/biz/common/select/selectQaExecutePaperList';

      let postParam = {
        CENTER_ID: this.searchParams.CENTER_ID
        , STD_MT: this.searchParams.STD_MT.replaceAll("-", "")
        , STD_MT_ORD: this.searchParams.STD_MT_ORD
        , MGR_EMP_NO: this.searchParams.MGR_EMP_NO
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaExecuteManageMapper'
        , sn : 'selectQaExecutePaperList'
      }};

      this.loading01 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaExecPaperList = response.DATA;
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading01 = false;
    },

    async selectQaExecuteTgtList(){
      // 초기화
      this.selectedTgt = {};
      this.qaExecCnsltList = [];
      this.selectedCnslt = {};

      // let sUrl = '/phone-api/qa/selectQaExecutePaperList';
      let sUrl = '/api/biz/common/select/selectQaExecuteTgtList';

      let postParam = {
        CENTER_ID: this.selectedPaper.CENTER_ID
        , STD_MT: this.selectedPaper.STD_MT.replaceAll("-","")
        , STD_MT_ORD: this.selectedPaper.STD_MT_ORD
        , PAPER_ID: this.selectedPaper.PAPER_ID
        , MGR_EMP_NO: this.selectedPaper.MGR_EMP_NO
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaExecuteManageMapper'
        , sn : 'selectQaExecuteTgtList'
      }};

      this.loading02 = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.qaExecTgtList = response.DATA.map(row=>{
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');
          return row;
        });

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.loading02 = false;
    },

    clickSearchBtn(){
      
      // 평가대상자 선택 후 조회 가능
      if(this.mixin_isEmpty(this.selectedTgt)) return;

      let dateType = this.cnsltSearchParams.DATE_TYPE == "REG_DT" ? "접수" : "처리"
      if(this.mixin_isEmpty(this.cnsltSearchParams.FROM_DT) || this.mixin_isEmpty(this.cnsltSearchParams.TO_DT)){
        this.showAlertInfo({msg: dateType+"기간을 입력해주세요."});
        return ;
      }

      // 평가대상자 상담이력 조회
      this.selectQaExecuteCnsltList();
      
    },

    async selectQaExecuteCnsltList(next){

      if(!next){
        this.qaExecCnsltList = [];
        this.pagination.page = 1
        this.nextDisabled = true;
      }

      // 초기화
      this.selectedCnslt = {};

      // let sUrl = '/phone-api/qa/selectQaExecuteCnsltList';
      let sUrl = '/api/biz/common/select/selectQaExecuteCnsltList';

      if(this.selectedTgt.CENTER_ID == "4"){ // 센터가 바로처리인 경우
        this.cnsltSearchParams.CUTT_ZONE[0] = "";
        this.cnsltSearchParams.CUTT_ZONE[1] = "";
        this.cnsltSearchParams.CUTT_ZONE[2] = "";
        this.cnsltSearchParams.ARS_INFO = "";
        this.cnsltSearchParams.TRANS_YN = false;
      }

      let postParam = {
        CENTER_ID: this.selectedTgt.CENTER_ID                           // 센터ID
        , STD_MT: this.selectedTgt.STD_MT.replaceAll("-","")            // 평가월
        , STD_MT_ORD: this.selectedTgt.STD_MT_ORD                       // 평가차수
        , PAPER_ID: this.selectedTgt.PAPER_ID                           // 평가지ID
        , TGT_EMP_NO: this.selectedTgt.TGT_EMP_NO                       // 상담사 사번
        , FROM_DT: this.cnsltSearchParams.FROM_DT.replaceAll("-","")    // 시작일자
        , TO_DT: this.cnsltSearchParams.TO_DT.replaceAll("-","")        // 종료일자
        , DATE_TYPE: this.cnsltSearchParams.DATE_TYPE                   // 기간 조회 기준
        , ORDER_BY_TYPE: this.cnsltSearchParams.ORDER_BY_TYPE           // 정렬기준
        , MIN_PHN_HR: this.cnsltSearchParams.MIN_PHN_HR                 // 최소 통화시간(분)
        , MAX_PHN_HR  : this.cnsltSearchParams.MAX_PHN_HR               // 최대 통화시간(분)
        , CNSLT_DIV_CD_1 : this.cnsltSearchParams.CUTT_TYPE_ID[1]       //상담 유형(대)
        , CNSLT_DIV_CD_2 : this.cnsltSearchParams.CUTT_TYPE_ID[2]       //상담 유형(중)
        , CNSLT_DIV_CD_3 : this.cnsltSearchParams.CUTT_TYPE_ID[3]       //상담 유형(소)
        , DRWI_TYPE_CD : this.cnsltSearchParams.DRWI_TYPE_CD            // 인입구분
        , RCPT_CHN_CD : this.cnsltSearchParams.RCPT_CHN_CD              // 상담채널
        , CUST_PHN_NO: this.cnsltSearchParams.CUST_PHN_NO               // 인입번호
        , CUST_ID: this.cnsltSearchParams.CUST_ID                       // 고객ID
        , PHN_CUTT_ID: this.cnsltSearchParams.PHN_CUTT_ID               // 상담번호
        , KAKAO_CHT_ID: this.cnsltSearchParams.KAKAO_CHT_ID             // 티켓ID
        , CTPV_CD : this.cnsltSearchParams.CUTT_ZONE[0]                 // 상담지역(시도)
        , SGG_CD : this.cnsltSearchParams.CUTT_ZONE[1]                  // 상담지역(시군구)
        , DSTRCT_CD : this.cnsltSearchParams.CUTT_ZONE[2]               // 상담지역(지구)
        , ARS_INFO: this.cnsltSearchParams.ARS_INFO                     // 접속정보
        , TRANS_YN: this.cnsltSearchParams.TRANS_YN ? "Y" : "N"         // 담당자 이관 여부
        , CUTT_CN: this.cnsltSearchParams.CUTT_CN                       // 상담메모
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaExecuteManageMapper'
        , sn : 'selectQaExecuteCnsltList'
        , ROW_CNT: this.pagination.rowsPerPage
        , PAGES_CNT: this.pagination.page
        , PAGING: "Y"
      }};

      this.loading03 = true;

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        let list = response.DATA.map(row=>{
          row.LAST_PHN_NO = this.mixin_setPhoneNo(row.LAST_PHN_NO);
          row.CUST_PHN_NO = this.mixin_setPhoneNo(row.CUST_PHN_NO);
          row.STD_BTN = "";
          row.FULL_CUTT_TYPE_NM = this.mixin_decode(row.FULL_CUTT_TYPE_NM).replace(/>/g, '');
          return row;
        });

        this.qaExecCnsltList = [...this.qaExecCnsltList, ...list];
        
        if (Number(response.HEADER.COUNT) < Number(this.pagination.rowsPerPage)) {
          this.nextDisabled = true  //버튼 비활성화
        }else{
          this.nextDisabled = false //버튼 활성화
        }

        //이부분은 체크해볼것
        this.pagination.page += 1
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
      this.loading03 = false;
    },

    // 평가하기
    clickExecuteBtn(item){
      this.selectedCnslt = item;

      if(item.PROC_STAT == "CLOSED"){
        this.showAlertCaution({msg:"이미 마감된 평가입니다."});
        return;
      }

      if(!(this.selectedTgt.STD_ST_DD <= this.$moment().format("YYYYMMDD") && this.selectedTgt.STD_EN_DD >= this.$moment().format("YYYYMMDD"))){
        this.showAlertCaution({msg:"평가기간이 아닙니다."});
        return;
      }
      
      if(parseInt(this.selectedTgt.STD_CNT) == 2 && this.mixin_isEmpty(item.STD_ID)){
        this.showAlertCaution({msg:"평가는 최대 2건 까지 가능합니다."});
        return;
      }

      // 평가지 팝업 변수 정보 셋팅
      Object.assign(this.propsQaBaseData, item);

      for(let key in this.selectedTgt){
        if(key == "APPLY_YN" || key == "APPLY_YN_NM") continue;
        this.propsQaBaseData[key] = this.selectedTgt[key];
      }

      // 평가실행 평가지 팝업 열기
      this.dialogResult = true;
    },

    async refreshQaExecute(){
      
      // 평가지 닫기
      this.dialogResult = false;

      // 실행 평가지 재조회
      await this.selectQaExecutePaperList();
      let paper = this.qaExecPaperList.filter(e=>{return e.CENTER_ID == this.propsQaBaseData.CENTER_ID 
                                                        && e.STD_MT.replaceAll("-","") == this.propsQaBaseData.STD_MT
                                                        && e.STD_MT_ORD == this.propsQaBaseData.STD_MT_ORD
                                                        && e.PAPER_ID == this.propsQaBaseData.PAPER_ID});

      // 선택처리
      if(paper.length > 0) this.clickPaperRow(paper[0], this.propsQaBaseData.TGT_EMP_NO);
    },

    async clearTgtProfile(){
      let centerList = await this.mixin_getCenterCombo();
      let centerInfo = centerList.filter(row=>{return row.value == this.searchParams.CENTER_ID});

      this.tgtProfile = {
        TGT_EMP_NM: "대상자"
        , FULL_DEPT_NM : (centerInfo.length > 0 ? centerInfo[0].text : "센터") + "-팀명"
        , IMG: require('@/assets/img/@manager_profile_default.png')
        , FULL_STD_MT: this.searchParams.STD_MT+"("+this.mixin_nvl(this.selectedPaper.STD_MT_ORD, "0")+"차)"
        , COMPLETE_YN_NM: "평가중"
        , APPLY_YN_NM: "미공개" 
      }
    },

    async clickPaperRow(item, tgtEmpNo){
      this.selectedPaper = item;
      this.clearTgtProfile();
      await this.selectQaExecuteTgtList();
      if(!this.mixin_isEmpty(tgtEmpNo)){
        let tgtEmp = this.qaExecTgtList.filter(row=>{return row.TGT_EMP_NO == tgtEmpNo});
        if(tgtEmp.length > 0) this.clickTgtRow(tgtEmp[0]);
      }
    },

    clickTgtRow(item){
      this.selectedTgt = item;
      this.tgtProfile = {
        TGT_EMP_NM: item.TGT_EMP_NM
        , FULL_DEPT_NM: item.FULL_DEPT_NM
        , FULL_STD_MT: item.FULL_STD_MT
        , COMPLETE_YN_NM : item.COMPLETE_YN_NM
        , APPLY_YN_NM: item.APPLY_YN_NM
        , IMG: item.IMG
      };
      this.selectQaExecuteCnsltList();
    },

    // 녹취 듣기
    showListenAudio(item){
      item.REG_DT = item.REG_DATE;
      item.IMG = this.selectedTgt.IMG;
      item.USER_NM = this.selectedTgt.TGT_EMP_NM;
      item.CUSL_NM = this.selectedTgt.TGT_EMP_NM;
      item.CUSL_CUSTCO_NM = this.selectedTgt.UP_DEPT_NM;
      item.CUSL_DEPT_NM = this.selectedTgt.DEPT_NM;

      this.mixin_showListenAudio(item);
    },

    clickCnsltRow(item){
      this.selectedCnslt = item;
    },

    showDetail(){
      this.dialogResult = true
    },

    closeSlide(){
      this.dialogResult = false
    },

    isActiveRow1(item) {
      const activeClass = item === this.selectedPaper ? "active" : "";
      return activeClass;
    },

    isActiveRow2(item) {
      const activeClass = item === this.selectedTgt ? "active" : "";
      return activeClass;
    },

    isActiveRow3(item) {
      const activeClass = item === this.selectedCnslt ? "active" : "";
      return activeClass;
    },
  },
  async mounted() {
    //공통코드설정
    let codeName = ['CVC', 'PCMC']; //상담채널, 처리방법
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);

    this.setSearchParams(this.propsSearchParams);
  },
  created() {
  },
  computed: {

  },
  watch: {
    // page(){
    //   this.$vuetify.goTo(0, { container : this.$refs.cnslHistGird.$el.querySelector("div.v-data-table__wrapper"), duration: 0});
    // }
  },
};
</script>

<style lang="scss" scoped>
</style>