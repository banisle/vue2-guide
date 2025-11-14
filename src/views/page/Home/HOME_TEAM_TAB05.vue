<template>
  <div class="px-6">
    <!-- search -->
    <div class="pl-search-form is-mt-m">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline" v-if="computedUserType === 'ETC_ADMIN'">
          <span class="pl-label">
            센터
          </span>
          <div class="pl-desc">
            <v-select
                class="pl-form type-middle is-md"
                placeholder="선택"
                v-model="SRCH_PARAMS_TOP.SRCH_CENTER"
                return-object
                :items="mixin_ognz_list_center(common_ognz_list, 'CUSL', '' )"
                @change="SRCH_PARAMS_TOP.SRCH_DEPT={}"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline" v-if="computedUserType === 'ETC_ADMIN' || computedUserType === 'LEADER'">
          <span class="pl-label">
            소속
          </span>
          <div class="pl-desc">
            <v-autocomplete
                class="pl-form type-middle is-md"
                v-model="SRCH_PARAMS_TOP.SRCH_DEPT"
                :items="mixin_ognz_list_detail(common_ognz_list, SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID, '전체', 'Y'/*콜센터여부,없으면전체*/ )"
                placeholder="조직을 검색하세요"
                return-object
                no-data-text="결과 없음"
                :disabled="SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            기준
          </span>
          <div class="pl-desc">
            <v-select
                v-model="modelBaseDate"
                :items="['조회기간','평가기준']"
                class="pl-form type-middle is-sm"
                placeholder="조회기간"
            ></v-select>
            <template v-if="modelBaseDate === '평가기준'">
              <v-select
                  v-model="modelDateY"
                  :items="mixin_evl_crtr_list_combo(evl_crtr_code, 'year',null,undefined)"
                  class="pl-form type-middle is-sm"/>
              <v-select
                  v-model="modelDateM"
                  :items="mixin_evl_crtr_list_combo(evl_crtr_code, 'month',modelDateY,undefined)"
                  class="pl-form type-middle is-sm"
                  @change="changeCrtrListCombo"
                  return-object/>
            </template>
            <compo-date-range-picker
              ParentStyleProp="width: 300px"
              :StartDayProp.sync="SRCH_PARAMS_TOP.SRCH_ST"
              :EndDayProp.sync="SRCH_PARAMS_TOP.SRCH_END"
              @startDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_ST)"
              @endDayChange="mixin_testLog(SRCH_PARAMS_TOP.SRCH_END)"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            성명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle"
              v-model="SRCH_PARAMS_TOP.SRCH_USER_NM"
              @keydown.enter="selectGridList"
              placeholder="성명입력" />
          </div>
        </div>
        <!-- 버튼 -->
        <div>
          <v-btn class="pl-btn is-icon" @click="selectGridList">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
        </div>
      </div>
      <v-btn
        class="pl-btn is-esp ml-auto is-icon"
        @click="dialogBatchHrCrtn">
        <v-icon class="pl-icon20 peoples" ></v-icon>
        일괄 보정
      </v-btn>
    </div>
    <!-- grid top -->
    <div class="pl-grid-top is-border-top pt-2">
      <div class="pl-grid-top-left">
        <span class="pl-bullet-txt is-blue">{{modelBaseDate}} 근무 일수 <strong class="ml-1">({{ WORK_DAY_COUNT }}일)</strong></span>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ GRID.ITEMS_TOT_CNT }})</em> 명</span>
        <!-- 엑셀 다운로드 버튼
        <compo-tooltip-btn
          TitleProp="엑셀 다운로드"
          ClassProp="pl-tooltip-btn "
          IconProp="pl-icon20 exceldown"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('엑셀 다운로드')"
        ></compo-tooltip-btn>-->
        <compo-excel
            ref="compoExcel"
            TypeProp="Download"
            :DataHeaderProp="GRID.HEADERS"
            :DataBodyProp="GRID.ITEMS"
            :FileNameProp="fileName"
            SheetNameProp="보정시간 관리 현황"
            style="display: none;"
          />

        <CompoExceldownOpt
            ref="CompoExceldownOpt"
            @downloadSelected="(data)=>{downloadSelected(data)}"
        />
      </div>
    </div>
    <v-data-table
        class="pl-grid has-img is-mt-s is-header-lg has-control"
        :headers="GRID.HEADERS"
        :items="GRID.ITEMS"
        show-select
        v-model="GRID.BATCH_ITEMS"
        fixed-header
        item-key="ROW_NUMBER"
        height="calc(100vh - 288px)"
        width="calc(100vw - 403px)"
        hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
        :items-per-page="-1"
        :loading="mixin_loadding">
      <template v-slot:item.USER_NM="{ item }">
        <img :src="item.IMG" :alt="item.USER_NM" class="pl-grid-portrait" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
        <strong class="ml-1">{{ item.USER_NM }}</strong>
      </template>
      <template v-slot:item.WHOL_MNT_TOTAL="{ item }">
        <td
          style="box-shadow: inset 1px 0px 0 0px var(--primary-color), inset -1px 0px 0 0px var(--primary-color) !important;"
          :style="GRID.ITEMS.length == item.ROW_NUMBER && 'box-shadow: inset 1px 0px 0 0px var(--primary-color), inset -1px -1px 0 0px var(--primary-color) !important'"
          @dblclick="dialogTotalHrCrtnDetail(item)" class="text-center is-hover" >
          {{item.WHOL_MNT_TOTAL}}
        </td>
      </template>
      <template v-slot:[`item.${header.value}`]="{ item }" v-for="(header, idx) in mixin_common_code_get(this.common_code,'TAM','')">
        <td @dblclick="dialogHrCrtnDetail(header, item)" class="text-center is-hover">
          {{item[`${header.value}`]}}
        </td>
      </template>
    </v-data-table>

    <!-- dialog detail -->
    <v-dialog
        persistent
        v-model="dialogTotalDetail"
        content-class="pl-top-profile-dialog type-center is-nopadding dialog-draggable"
        width="600">
      <div class="draggable-area">drag area</div>
      <compo-dialog
          header-title="상세 정보"
          @hide="mixin_hideDialog('TotalDetail')"
      >
        <template slot="body">
          <!-- 데이터 있을때 -->
          <template >
            <div style="height:480px">
              <!-- top -->
              <div class="d-flex px-6 py-4">
                <div class="">
                  <img
                      :src="GRID.CLICK_DATA.IMG"
                      :alt="GRID.CLICK_DATA.USER_NM"
                      style="width: 35px; max-height: 40px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}" />
                </div>
                <div class="pl-top-profile-dialog-desc-wrap ml-3">
                  <strong style="font-size: 15px">{{ GRID.CLICK_DATA.USER_NM }}</strong><span class="is-txt-sub">({{ GRID.CLICK_DATA.USER_ID }})</span>
                  <span class="is-txt-sub ml-1">{{GRID.CLICK_DATA.JBPS_CD_NM}}</span>
                  <div>
                    {{GRID.CLICK_DATA.CUSTCO_NM}} - {{GRID.CLICK_DATA.DEPT_NM}}
                  </div>
                </div>
                <v-btn
                    @click="mixin_hideDialog('TotalDetail')"
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
              <!-- grid -->
              <div class="px-6 pb-4">
                <div class="pl-grid-top">
                  <div class="pl-grid-top-left">
                    <span class="pl-subtit d-flex align-center">
                      <span class="pl-badge is-bg-blueGray ml-2 mt-1 px-2">총 {{dialogTotalItemsTotWholMnt}}</span>
                    </span>
                  </div>
                  <div class="pl-grid-top-utils">
                    {{SRCH_PARAMS_TOP.SRCH_ST}} ~ {{SRCH_PARAMS_TOP.SRCH_END}} ,
                    <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ dialogTotalItems.length }})</em> 건</span>
                  </div>
                </div>
                <v-data-table
                    class="pl-grid is-mt-s"
                    :headers="dialogTotalHeaders"
                    :items="dialogTotalItems"
                    fixed-header
                    item-key="ROW_NUMBER"
                    height="350px"
                    :items-per-page="-1"
                    hide-default-footer
                    no-data-text="등록된 데이터가 없습니다."
                >
                  <template v-slot:item.RSN="{item}">
                    <v-tooltip content-class="pl-tooltip " bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                          {{ item.RSN }}
                        </span>
                      </template>
                      <span>{{ item.RSN }}</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </div>
            </div>
          </template>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('TotalDetail')">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <v-dialog
        persistent
        v-model="dialogDetail"
        content-class="pl-top-profile-dialog type-center is-nopadding dialog-draggable"
        width="600">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="상세 정보"
        @hide="mixin_hideDialog('Detail')"
      >
        <template slot="body">
          <!-- 데이터 있을때 -->
          <template >
            <div class="">
              <!-- top -->
              <div class="d-flex px-6 py-4">
                <div class="">
                  <img
                      :src="GRID.CLICK_DATA.IMG"
                      :alt="GRID.CLICK_DATA.USER_NM"
                      style="width: 35px; max-height: 40px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}" />
                </div>
                <div class="pl-top-profile-dialog-desc-wrap ml-3">
                  <strong style="font-size: 15px">{{ GRID.CLICK_DATA.USER_NM }}</strong><span class="is-txt-sub">({{ GRID.CLICK_DATA.USER_ID }})</span>
                  <span class="is-txt-sub ml-1">{{GRID.CLICK_DATA.JBPS_CD_NM}}</span>
                  <div>
                    {{GRID.CLICK_DATA.CUSTCO_NM}} - {{GRID.CLICK_DATA.DEPT_NM}}
                  </div>
                </div>
                <v-btn
                  @click="mixin_hideDialog('Detail')"
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
              <!-- grid -->
              <div class="px-6 pb-4">
                <div class="pl-grid-top">
                  <div class="pl-grid-top-left">
                    <span class="pl-subtit d-flex align-center">
                      <v-icon class="pl-icon20 document"></v-icon>
                      <span class="ml-1">시간 보정 <span class="is-txt-cyan">({{GRID.CLICK_DATA.CRTN_ARTCL_CD_NM}})</span></span>
                      <span class="pl-badge is-bg-blueGray ml-2 mt-1 px-2">총 {{dialogItemsTotWholMnt}}</span>
                    </span>
                  </div>
                  <div class="pl-grid-top-utils">
                    {{SRCH_PARAMS_TOP.SRCH_ST}} ~ {{SRCH_PARAMS_TOP.SRCH_END}} ,
                    <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ dialogItems.length }})</em> 건</span>
                  </div>
                </div>
                <v-data-table
                  class="pl-grid is-mt-s"
                  :headers="dialogHeaders"
                  :items="dialogItems"
                  fixed-header
                  item-key="ROW_NUMBER"
                  height="140px"
                  :item-class="isDialogActiveRow"
                  @click:row="selectDialogRow"
                  :items-per-page="-1"
                  hide-default-footer
		              no-data-text="등록된 데이터가 없습니다."
                  >
                  <template v-slot:item.RSN="{item}">
                    <v-tooltip content-class="pl-tooltip " bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                          {{ item.RSN }}
                        </span>
                      </template>
                      <span>{{ item.RSN }}</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
                <template >
                  <div class="pt-3">
                    <div class="d-flex align-center">
                      <span class="pl-subtit">시간보정 상세 내용</span>
                      <div class="ml-auto">
                        <compo-tooltip-btn
                          TitleProp="추가"
                          ClassProp="pl-tooltip-btn"
                          IconProp="pl-icon20 circle-plus"
                          TooltipPositionProp="bottom"
                          @btnClick="addHrCrtnHstry"
                        />
                        <compo-tooltip-btn
                          TitleProp="삭제"
                          ClassProp="pl-tooltip-btn ml-1"
                          IconProp="pl-icon20 trash"
                          TooltipPositionProp="bottom"
                          @btnClick="deleteHrCrtnHstry"
                        />
                      </div>
                    </div>
                    <!-- form -->
                    <div class="pl-form-inline-wrap vertical label-120 gap-8 is-mt-s pt-3 is-border-sub-top">
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <v-icon class="pl-icon20 parts-date"></v-icon>
                          <span class="ml-1">등록일</span>
                        </span>
                        <div class="pl-desc">
                          <v-text-field v-if="dialogDetailMode==='edit'"
                              class="pl-form type-middle is-sm"
                              v-model="dialogItemsClickData.APLCN_YMD"
                              disabled
                          />
                          <compo-date-picker v-if="dialogDetailMode==='add'"
                              StyleProp="flex: 0 0 115px"
                              DateType="dateInput"
                              :DateProp.sync="dialogItemsClickData.APLCN_YMD"/>
                          <v-text-field
                            class="pl-form type-middle is-sm"
                            v-model="GRID.CLICK_DATA.DEPT_NM"
                            disabled
                          />
                          <v-text-field
                            class="pl-form type-middle is-sm"
                            v-model="GRID.CLICK_DATA.USER_NM"
                            disabled
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <v-icon class="pl-icon20 tit-paragraph"></v-icon>
                          <span class="ml-1">보정 항목/내용</span>
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                              class="pl-form type-middle is-sm"
                              v-model="GRID.CLICK_DATA.CRTN_ARTCL_CD_NM"
                              disabled
                          />
                          <v-text-field
                            class="pl-form type-middle"
                            v-model="dialogItemsClickData.RSN"
                            placeholder="내용 입력"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <v-icon class="pl-icon20 date-simple"></v-icon>
                          <span class="ml-1">보정 시간</span>
                        </span>
                        <div class="pl-desc">
                          <div class="spacing-wrap sp-4 justify-space-between">
                            <div class="d-flex align-center">
                              <strong class="is-txt-black">시작</strong>
                              <v-text-field
                                  class="pl-form type-middle is-xss ml-2"
                                  placeholder="09:00"
                                  v-model="dialogItemsClickData.BGNG_HR"
                                  oninput="this.value=(this.value.replace(/\D/g, '')).replace(/(\d{2})(\d{2})/g, '$1:$2');"
                                  @blur="timeDiff_HR_CRTN_WHOL_MNT(dialogItemsClickData)"
                                  maxlength="5"
                              />
                            </div>
                            <div class="d-flex align-center">
                              <strong class="is-txt-black">종료</strong>
                              <v-text-field
                                  class="pl-form type-middle is-xss ml-2"
                                  placeholder="18:00"
                                  v-model="dialogItemsClickData.END_HR"
                                  oninput="this.value=(this.value.replace(/\D/g, '')).replace(/(\d{2})(\d{2})/g, '$1:$2');"
                                  @blur="timeDiff_HR_CRTN_WHOL_MNT(dialogItemsClickData)"
                                  maxlength="5"
                              />
                            </div>
                            <div class="d-flex align-center">
                              <strong class="is-txt-black">점심</strong>
                              <v-text-field
                                  class="pl-form type-middle is-xss ml-2"
                                  placeholder="01:00"
                                  v-model="dialogItemsClickData.LUNCH_HR"
                                  oninput="this.value=(this.value.replace(/\D/g, '')).replace(/(\d{2})(\d{2})/g, '$1:$2');"
                                  @blur="timeDiff_HR_CRTN_WHOL_MNT(dialogItemsClickData)"
                                  maxlength="5"
                              />
                            </div>
                            <div class="d-flex align-center">
                              <strong class="is-txt-black">총 시간</strong>
                              <v-text-field
                                  disabled
                                  class="pl-form type-middle is-xss ml-2"
                                  placeholder="00:00"
                                  v-model="dialogItemsClickData.WHOL_MNT"
                                  oninput="this.value=(this.value.replace(/\D/g, '')).replace(/(\d{2})(\d{2})/g, '$1:$2');"
                                  maxlength="5"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('Detail')">닫기</v-btn>
          <v-btn class="pl-btn" @click="saveHrCrtnInfo">{{ mixin_isEmpty(dialogItemsClickData.HR_CRTN_HSTRY_ID) ? '저장' : '수정' }}</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- dialog: 일괄보정 -->
    <v-dialog
      v-model="dialogDetail2"
      content-class="pl-top-profile-dialog type-center is-nopadding dialog-draggable"
      width="600"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="보정시간 일괄 등록"
        @hide="closeModal2"
      >
        <template slot="body">
          <template >
            <div class="d-flex px-6 py-4">
              <span style="font-size: 16px; font-weight: 700;">보정시간 일괄 등록</span>
              <div class="ml-auto">
                <v-btn
                  @click="closeModal2"
                  plain
                  min-width="30"
                  height="30"
                  class="pl-tooltip-btn pl-dialog-header-close"
                  >
                  <v-icon
                    small
                    class="pl-icon20 dialog-close-black">
                  </v-icon>
                </v-btn>
              </div>
            </div>
            <div class="is-border-top">
              <!-- grid -->
              <div class="px-6 py-4">
                <div class="pl-grid-top">
                  <div class="pl-grid-top-left">
                    <span class="pl-subtit d-flex align-center">
                      <v-icon class="pl-icon20 document"></v-icon>
                      <span class="ml-1">일괄 적용 대상자 </span>
                    </span>
                  </div>
                  <div class="pl-grid-top-utils">
                    <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ GRID.BATCH_ITEMS.length }})</em> 건</span>
                  </div>
                </div>
                <v-data-table
                  class="pl-grid is-mt-s"
                  :headers="dialogHeaders2"
                  :items="GRID.BATCH_ITEMS"
                  fixed-header
                  height="180px"
                  :items-per-page="-1"
                  hide-default-footer
		              no-data-text="등록된 데이터가 없습니다."
                  >
                </v-data-table>
                <template >
                  <div class="pt-3">
                    <div class="d-flex align-center" style="height: 30px;">
                      <span class="pl-subtit">일괄 적용할 시간보정 내용 </span>
                    </div>
                    <!-- form -->
                    <div class="pl-form-inline-wrap vertical label-120 gap-8 is-mt-s pt-3 is-border-sub-top">
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <v-icon class="pl-icon20 parts-date"></v-icon>
                          <span class="ml-1">등록일</span>
                        </span>
                        <div class="pl-desc">
                          <compo-date-picker
                              StyleProp="flex: 0 0 115px"
                              DateType="dateInput"
                              :DateProp.sync="GRID.BATCH_DATA.APLCN_YMD"/>
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <v-icon class="pl-icon20 tit-paragraph"></v-icon>
                          <span class="ml-1">보정 항목/내용</span>
                        </span>
                        <div class="pl-desc">
                          <v-select
                            class="pl-form type-middle"
                            :items="mixin_common_code_get(common_code,'TAM','선택')"
                            v-model="GRID.BATCH_DATA.CRTN_ARTCL_CD"
                            placeholder="선택"
                          ></v-select>
                          <v-text-field
                              class="pl-form type-middle"
                              v-model="GRID.BATCH_DATA.RSN"
                              placeholder="내용 입력"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          <v-icon class="pl-icon20 date-simple"></v-icon>
                          <span class="ml-1">보정 시간</span>
                        </span>
                        <div class="pl-desc">
                          <div class="spacing-wrap sp-4 justify-space-between">
                            <div class="d-flex align-center">
                              <strong class="is-txt-black">시작</strong>
                              <v-text-field
                                  class="pl-form type-middle is-xss ml-2"
                                  placeholder="09:00"
                                  v-model="GRID.BATCH_DATA.BGNG_HR"
                                  oninput="this.value=(this.value.replace(/\D/g, '')).replace(/(\d{2})(\d{2})/g, '$1:$2');"
                                  @blur="timeDiff_HR_CRTN_WHOL_MNT(GRID.BATCH_DATA)"
                                  maxlength="5"
                              />
                            </div>
                            <div class="d-flex align-center">
                              <strong class="is-txt-black">종료</strong>
                              <v-text-field
                                  class="pl-form type-middle is-xss ml-2"
                                  placeholder="18:00"
                                  v-model="GRID.BATCH_DATA.END_HR"
                                  oninput="this.value=(this.value.replace(/\D/g, '')).replace(/(\d{2})(\d{2})/g, '$1:$2');"
                                  @blur="timeDiff_HR_CRTN_WHOL_MNT(GRID.BATCH_DATA)"
                                  maxlength="5"
                              />
                            </div>
                            <div class="d-flex align-center">
                              <strong class="is-txt-black">점심</strong>
                              <v-text-field
                                  class="pl-form type-middle is-xss ml-2"
                                  placeholder="01:00"
                                  v-model="GRID.BATCH_DATA.LUNCH_HR"
                                  oninput="this.value=(this.value.replace(/\D/g, '')).replace(/(\d{2})(\d{2})/g, '$1:$2');"
                                  @blur="timeDiff_HR_CRTN_WHOL_MNT(GRID.BATCH_DATA)"
                                  maxlength="5"
                              />
                            </div>
                            <div class="d-flex align-center">
                              <strong class="is-txt-black">총 시간</strong>
                              <v-text-field
                                  disabled
                                  class="pl-form type-middle is-xss ml-2"
                                  placeholder="00:00"
                                  v-model="GRID.BATCH_DATA.WHOL_MNT"
                                  oninput="this.value=(this.value.replace(/\D/g, '')).replace(/(\d{2})(\d{2})/g, '$1:$2');"
                                  maxlength="5"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="closeModal2">닫기</v-btn>
          <v-btn class="pl-btn" @click="saveHrCrtnBatchInfo">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
import CompoExceldownOpt from '@/components/CompoExceldownOpt'
import axios from "axios";
export default {
  name: "HOME_TEAM_TAB05", //name은 'MENU_' + 파일명 조합
  components: {
    CompoExceldownOpt,
  },
  data() {
    return {

      common_ognz_list:[], //조직
      common_code:[], //공통코드
      common_code_global:[], //공통코드
      evl_crtr_code:[], //평가기준 년월

      SRCH_PARAMS_TOP:{
        SRCH_CENTER: {},  //센터
        SRCH_DEPT: {},
        SRCH_DEPT_DISABLED:false,
        SRCH_ST: this.$moment(new Date()).subtract(14,'days').format('YYYY-MM-DD'),
        SRCH_END: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_TODAY: this.$moment(new Date()).format('YYYY-MM-DD'),
        SRCH_USER_NM:'',
        SRCH_STRT_YN:'',  /* 감점여부 */
      },
      WORK_DAY_COUNT:0, /* 조회기간 근무일수 */
      GRID : {
        INIT_HEADERS:[
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false, cellClass: 'is-no-click' },
          { text: '성명', value: 'USER_NM', align: 'center', width: '8%', cellClass: 'is-no-click' },
          { text: '소속', value: 'DEPT_NM', align: 'center', width: '15%', sortable: false, cellClass: 'is-no-click' },
          { text: '직무', value: 'DUTY_GROUP_NM', align: 'center', width: '8%', sortable: false, cellClass: 'is-no-click' },
          { text: '보정시간', value: 'WHOL_MNT_TOTAL', align: 'center type-border', width: '10%', sortable: false, cellClass: 'is-no-click' },
        ],
        HEADERS:[],
        ITEMS:[],
        ITEMS_TOT_CNT:0,
        CLICK_DATA:[],

        // 일괄보정용도.
        BATCH_ITEMS:[],
        BATCH_DATA:{
          APLCN_YMD: this.$moment(new Date()).format('YYYY-MM-DD'),
          CRTN_ARTCL_CD : '',
          RSN : '',
          BGNG_HR : '',
          END_HR : '',
          LUNCH_HR: '00:00', //점심시간
          WHOL_MNT: '00:00',
        }
      },

      // search
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      modelBaseDate: '조회기간',
      modelDateY: this.$moment(new Date()).format('YYYY'),
      modelDateM: {},

      // dialgo sample
      dialogTotalDetail: false,
      dialogTotalItems: [],
      dialogTotalItemsTotWholMnt : 0,
      dialogTotalHeaders: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '등록일', value: 'APLCN_YMD', align: 'center', width: '90px', sortable: false },
        { text: '등록자', value: 'MDFR_ID_NM', align: 'center', width: '70px', sortable: false },
        { text: '내용', value: 'RSN', align: '', width: '', sortable: false },
        { text: '시작', value: 'BGNG_HR', align: 'center', width: '50px', sortable: false },
        { text: '종료', value: 'END_HR', align: 'center', width: '50px', sortable: false },
        { text: '점심', value: 'LUNCH_HR', align: 'center', width: '50px', sortable: false },
        { text: '총시간', value: 'WHOL_MNT', align: 'center', width: '60px', sortable: false },
      ],

      dialogDetailMode: 'edit',
      dialogDetail: false,
      dialogHeaders: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '등록일', value: 'APLCN_YMD', align: 'center', width: '90px', sortable: false },
        { text: '등록자', value: 'MDFR_ID_NM', align: 'center', width: '70px', sortable: false },
        { text: '내용', value: 'RSN', align: '', width: '', sortable: false },
        { text: '시작', value: 'BGNG_HR', align: 'center', width: '50px', sortable: false },
        { text: '종료', value: 'END_HR', align: 'center', width: '50px', sortable: false },
        { text: '점심', value: 'LUNCH_HR', align: 'center', width: '50px', sortable: false },
        { text: '총시간', value: 'WHOL_MNT', align: 'center', width: '60px', sortable: false },
      ],
      dialogItems: [],
      dialogItemsClickData:{
        APLCN_YMD: this.$moment(new Date()).format('YYYY-MM-DD'),
        LUNCH_HR: '00:00', //점심시간
        WHOL_MNT: '00:00',
      },
      dialogItemsClickDataBefore:{},
      dialogItemsTotWholMnt:'',

      modelDialog01: '교육',

      // 일괄보정
      dialogDetail2: false,
      dialogHeaders2: [
        { text: '성명', value: 'USER_NM', align: 'center', width: '80px', cellClass: 'is-no-click' },
        { text: '소속', value: 'DEPT_NM', align: 'center', width: '120px', sortable: false, cellClass: 'is-no-click' },
        { text: '직무', value: 'DUTY_GROUP_NM', align: 'center', width: '90px', sortable: false, cellClass: 'is-no-click' },
        { text: '급수', value: 'DUTY_CD_NM', align: 'center', width: '60px', sortable: false, cellClass: 'is-no-click' },
      ],

      selectedDownloadOption: null,
      fileName: '보정시간 현황',
    }
  },
  methods: {
    closeModal2(){
      this.$store.commit("alertStore/hideAlert");
      this.mixin_hideDialog('Detail2');
      this.GRID.BATCH_ITEMS = [];
      this.GRID.BATCH_DATA = {
        APLCN_YMD: this.$moment(new Date()).format('YYYY-MM-DD'),
        CRTN_ARTCL_CD : '',
        RSN : '',
        BGNG_HR : '',
        END_HR : '',
        LUNCH_HR: '00:00', //점심시간
        WHOL_MNT: '00:00',
      };
    },

    closeModal(){
      this.$store.commit("alertStore/hideAlert");
      this.mixin_hideDialog('Detail');
      this.GRID.CLICK_DATA = {};
    },
    //조회기간에따른 헤더 업데이트
    async updateGridHeaders() {

      this.GRID.HEADERS = Object.assign([], this.GRID.INIT_HEADERS);
      this.mixin_common_code_get(this.common_code,'TAM','').map(data => {
        this.GRID.HEADERS.push({text: data.text, value: data.value, align: 'center', width: '6%', sortable: false, cellClass: "is-hover"});
      });
    },

    async selectGridList() {
      if( (this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === '')
          && (this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === '') ) {
        return;
      }
      this.GRID.ITEMS = [];
      this.mixin_loadding = true;
      this.updateGridHeaders(); //조회기간에따른 헤더 업데이트

      let sURL = '/api/lhcs/system/user/hrctrn/selectHrCrtnUserList';
      let postParam = {};
      if(this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== undefined && this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== '') {
        postParam.SRCH_DEPT_ID = this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID;
      }else {
        postParam.SRCH_GROUP_ID = this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID;
      }
      postParam.SRCH_USER_NM = this.SRCH_PARAMS_TOP.SRCH_USER_NM;
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");

      let headParam = {};
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG){
        let responseData = response.DATA;
        this.WORK_DAY_COUNT = responseData[0].WORK_DAY_COUNT;  //조회기간근무일수
        let i = 0;
        responseData.map(item => {
          if( item.ICON_IMG_URI !== '/' ) {
            responseData[i]["IMG"] = '/upload/' + item.ICON_IMG_URI;
          }else {
            responseData[i]["IMG"] = require('@/assets/img/@manager_profile_default.png');
          }
          return i++;
        });
        this.GRID.ITEMS = [...this.GRID.ITEMS, ...responseData];
        this.GRID.ITEMS_TOT_CNT = response.HEADER.TOT_COUNT;
      }else {
        this.GRID.ITEMS = [];
      }
      this.mixin_loadding = false;
    },

    initDialogItemsClickData() {
      this.dialogDetailMode = 'edit';
      this.dialogItems= [];
      this.dialogItemsClickData = {
        APLCN_YMD: this.$moment(new Date()).format('YYYY-MM-DD')
        , LUNCH_HR: '00:00' //점심시간
        , WHOL_MNT: '00:00'
      };
      this.dialogItemsClickDataBefore={};
      this.dialogItemsTotWholMnt = '';

      this.dialogTotalItems = [];
      this.dialogTotalItemsTotWholMnt = 0;
    },
    async dialogTotalHrCrtnDetail(itemObj) {
      this.GRID.CLICK_DATA = {};
      this.GRID.CLICK_DATA = JSON.parse(JSON.stringify(itemObj))/*DeepCopy*/;
      this.mixin_showDialog('TotalDetail');
      this.dialogTotalHrCrtnList();
    },
    async dialogTotalHrCrtnList() {
      this.initDialogItemsClickData();
      let sURL = '/api/biz/common/select/selectHrCrtnDetailList';
      let postParam = {};
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");
      postParam.SRCH_USER_ID = this.GRID.CLICK_DATA.USER_ID;

      let headParam = {head: {"ns": 'lhcs.system.user.dao.HrCrtnMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (response.HEADER.COUNT > 0) {
        this.dialogTotalItems = response.DATA;
        this.dialogTotalItemsTotWholMnt = response.DATA[0].WHOL_MNT_TOTAL;
      }
    },

    async dialogHrCrtnDetail(headerObj, itemObj) {

      this.GRID.CLICK_DATA = {};
      this.GRID.CLICK_DATA = JSON.parse(JSON.stringify(itemObj))/*DeepCopy*/;
      this.GRID.CLICK_DATA.CRTN_ARTCL_CD_NM = headerObj.text; /* 항목명 */
      this.GRID.CLICK_DATA.CRTN_ARTCL_CD = headerObj.value;
      this.mixin_showDialog('Detail');
      this.dialogHrCrtnList();
    },
    async dialogHrCrtnList() {
      this.initDialogItemsClickData();
      let sURL = '/api/biz/common/select/selectHrCrtnDetailList';
      let postParam = {};
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");
      postParam.SRCH_CRTN_ARTCL_CD = this.GRID.CLICK_DATA.CRTN_ARTCL_CD;
      postParam.SRCH_USER_ID = this.GRID.CLICK_DATA.USER_ID;

      let headParam = {head: {"ns": 'lhcs.system.user.dao.HrCrtnMapper'}};
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (response.HEADER.COUNT > 0) {
        this.dialogItems = response.DATA;
        this.dialogItemsTotWholMnt = response.DATA[0].WHOL_MNT_TOTAL;
      }
    },
    isDialogActiveRow(item) {
      const activeClass = item.HR_CRTN_HSTRY_ID === this.dialogItemsClickData.HR_CRTN_HSTRY_ID ? "active" : "";
      return activeClass;
    },
    async selectDialogRow( item ) {
      this.dialogDetailMode = 'edit';
      this.dialogItemsClickData = JSON.parse(JSON.stringify(item))/*DeepCopy*/;
      this.dialogItemsClickDataBefore = JSON.parse(JSON.stringify(this.dialogItemsClickData))/*DeepCopy*/;
    },
    async addHrCrtnHstry() {
      this.dialogDetailMode = 'add';
      this.dialogItemsClickData = {
        APLCN_YMD: this.$moment(new Date()).format('YYYY-MM-DD')
        , LUNCH_HR: '00:00' //점심시간
        , WHOL_MNT: '00:00'
      };
      this.dialogItemsClickDataBefore={};
    },
    async deleteHrCrtnHstry() {
      if( this.mixin_isEmpty( this.dialogItemsClickData.HR_CRTN_HSTRY_ID) ) {
        this.showAlertCaution({msg: '삭제하고자 하는 목록을 선택하세요.'});
        return;
      }

      this.showConfirmInfo({
        msg: '선택한 항목을 삭제하시겠습니까?'
        , callYes: this.deleteHrCrtnHstryProcess
        , callNo: () => {
          this.$store.commit("alertStore/hideAlert")
        }
      })
    },

    async deleteHrCrtnHstryProcess() {
      let sURL = '/api/biz/common/delete/deleteHrCrtnHstryProcess';
      let postParam = {};
      postParam.EXEC_USER_ID = this.user_id;
      postParam.SRCH_HR_CRTN_HSTRY_ID = this.dialogItemsClickData.HR_CRTN_HSTRY_ID;
      let headParam = {head: {"ns": 'lhcs.system.user.dao.HrCrtnMapper',}}
      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.showToastInfo({msg:'삭제 처리 되었습니다.', callAfter:()=>{
            this.dialogHrCrtnList();
            this.selectGridList();
          }}
        );
      }
      this.$store.commit("alertStore/hideAlert");
    },
    //시간보정 시간계산
    timeChk(s){
      let stTime = this.dialogItemsClickData.BGNG_HR;
      let endTime = this.dialogItemsClickData.END_HR;
      let runchTime = this.dialogItemsClickData.LUNCH_HR;

      if( stTime === '00:00' || endTime === '00:00') return;

      let stTimeMnt = parseInt(stTime.split(":")[0]) * 60 + parseInt(stTime.split(":")[1]);
      let endTimeMnt = parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);
      let runchTimeMnt = parseInt(runchTime.split(":")[0]) * 60 + parseInt(runchTime.split(":")[1]);

      let wholMnt = endTimeMnt - stTimeMnt - runchTimeMnt;
      let wholHr = Math.floor(wholMnt / 60);
      let wholMin = wholMnt % 60;

      if(wholHr < 0 || wholMin < 0){
        return false;
      }else{
        return true;
      }
    },
    //보정시간 총시간 계산.
    async timeDiff_HR_CRTN_WHOL_MNT(obj) {
      if( !this.mixin_isEmpty(obj.BGNG_HR) && !this.mixin_isEmpty(obj.END_HR) && !this.mixin_isEmpty(obj.LUNCH_HR) ) {
        let start_min = parseInt(obj.BGNG_HR.substring(0, 3), 10) * 60
            + parseInt(obj.BGNG_HR.substring(3, 5), 10);
        let end_min = parseInt(obj.END_HR.substring(0, 3), 10) * 60
            + parseInt(obj.END_HR.substring(3, 5), 10);
        let lunch_min = parseInt(obj.LUNCH_HR.substring(0, 3), 10) * 60
            + parseInt(obj.LUNCH_HR.substring(3, 5), 10);

        if( !isNaN(lunch_min) && lunch_min > 60 ) {
          this.showAlertInfo({msg:'점심시간은 최대 1시간 입니다. 1시간으로 초기화 합니다. '} );
          obj.LUNCH_HR = "01:00";
          lunch_min = 60;
        }

        if( !isNaN(start_min) && !isNaN(end_min) && !isNaN(lunch_min) ) {
          let total_mm = end_min - start_min - lunch_min; //디비에 저장할때는 분으로
          let hours = Math.floor(total_mm / 60);
          let minutes = Math.floor(total_mm % 60);

          if (hours < 10) {
            hours = "0" + hours;
          }
          if (minutes < 10) {
            minutes = "0" + minutes;
          }
          obj.WHOL_MNT = hours + ":" + minutes; //보여주는 것은 시:분으로
        }
      }
    },
    async saveHrCrtnInfo() {

      if (this.mixin_isEmpty(this.dialogItemsClickData.RSN) ) {
        this.showAlertCaution({msg: '사유를 입력하세요.'});
        return;
      }
      if (this.mixin_isEmpty(this.dialogItemsClickData.RSN) ) {
        this.showAlertCaution({msg: '사유를 입력하세요.'});
        return;
      }

      if ( this.mixin_isEmpty(this.dialogItemsClickData.BGNG_HR) ) {
        this.showAlertCaution({msg: '시작시간을 확인하세요.'});
        return;
      }
      if ( this.mixin_isEmpty(this.dialogItemsClickData.END_HR) ) {
        this.showAlertCaution({msg: '종료시간을 확인하세요.'});
        return;
      }
      if ( this.mixin_isEmpty(this.dialogItemsClickData.LUNCH_HR) ) {
        this.showAlertCaution({msg: '점심시간을 확인하세요.'});
        return;
      }
      if ( this.mixin_isEmpty(this.dialogItemsClickData.WHOL_MNT) ) {
        this.showAlertCaution({msg: '총 시간을 확인하세요.'});
        return;
      }else{
        if( this.dialogItemsClickData.WHOL_MNT == '00:00') {
          this.showAlertCaution({msg: '총 시간이 00:00 입니다. 시간을 확인해주세요.'});
          return;
        }else{
          if(!this.timeChk()){
            this.showAlertCaution({msg: '유효하지 않은 시간설정입니다.<br>입력한 시간을 다시 확인해주세요.'});
            return;
          }
        }
      }

      if( this.dialogItemsClickData.WHOL_MNT.indexOf("-")  > -1) {
        this.showAlertCaution({msg: '총 시간이 올바른 형식이 아닙니다. 시작, 종료, 점심 시간을 확인하세요.'});
        return;
      }

      let defaultMsg = "입력한 정보를 저장하시겠습니까?";
      if( !this.mixin_isEmpty( this.dialogItemsClickData.HR_CRTN_HSTRY_ID) ) {
        defaultMsg = "입력한 정보를 수정하시겠습니까?";
      }
      this.showConfirmInfo({
        msg: defaultMsg, callYes: this.saveHrCrtnInfoProcess, callNo: () => {
          this.$store.commit("alertStore/hideAlert")
        }
      })
    },
    async saveHrCrtnInfoProcess() {

      let sURL = '/api/biz/common/update/updateUserHrCrtnHstry';
      if( this.mixin_isEmpty( this.dialogItemsClickData.HR_CRTN_HSTRY_ID ) ) {
        sURL = '/api/biz/common/insert/insertUserHrCrtnHstry';
      }
      let headParam = {head:{ns : 'lhcs.system.user.dao.HrCrtnMapper',seq_key : 'HR_CRTN_HSTRY_ID'}};
      let postParam = {};
      postParam.SRCH_HR_CRTN_HSTRY_ID = this.dialogItemsClickData.HR_CRTN_HSTRY_ID;
      postParam.SRCH_USER_ID = this.GRID.CLICK_DATA.USER_ID;
      postParam.EXEC_USER_ID = this.user_id;
      postParam.CRTN_ARTCL_CD = this.GRID.CLICK_DATA.CRTN_ARTCL_CD;
      postParam.APLCN_YMD = this.dialogItemsClickData.APLCN_YMD.replaceAll("-","");
      postParam.RSN = this.dialogItemsClickData.RSN;
      postParam.BGNG_HR = this.dialogItemsClickData.BGNG_HR;
      postParam.END_HR = this.dialogItemsClickData.END_HR;
      postParam.LUNCH_HR = this.dialogItemsClickData.LUNCH_HR;
      postParam.WHOL_MNT = this.dialogItemsClickData.WHOL_MNT;

      let response  = await this.common_postCall(sURL, postParam, headParam);
      console.log('response.HEADER : ', response.HEADER);
      if (!response.HEADER.ERROR_FLAG){
        this.dialogHrCrtnList();
        this.selectGridList();
      }
      this.$store.commit("alertStore/hideAlert");
    },

    dialogBatchHrCrtn() {
      if( this.GRID.BATCH_ITEMS.length > 0 ) {
        this.mixin_showDialog('Detail2');
      }else {
        this.showAlertCaution({msg: '일괄보정할 직원을 선택하세요.'});
      }
    },

    async saveHrCrtnBatchInfo() {
      if( this.GRID.BATCH_ITEMS.length === 0 ) {
        this.showAlertCaution({msg: '일괄보정할 직원을 선택하세요.', callAfter:()=>{
            this.closeModal2();
          }}
        );
        return;
      }

      if (this.mixin_isEmpty(this.GRID.BATCH_DATA.CRTN_ARTCL_CD) ) {
        this.showAlertCaution({msg: '보정항목을 선택하세요.'});
        return;
      }

      if (this.mixin_isEmpty(this.GRID.BATCH_DATA.RSN) ) {
        this.showAlertCaution({msg: '사유를 입력하세요.'});
        return;
      }

      if ( this.mixin_isEmpty(this.GRID.BATCH_DATA.BGNG_HR) ) {
        this.showAlertCaution({msg: '시작시간을 확인하세요.'});
        return;
      }
      if ( this.mixin_isEmpty(this.GRID.BATCH_DATA.END_HR) ) {
        this.showAlertCaution({msg: '종료시간을 확인하세요.'});
        return;
      }
      if ( this.mixin_isEmpty(this.GRID.BATCH_DATA.LUNCH_HR) ) {
        this.showAlertCaution({msg: '점심시간을 확인하세요.'});
        return;
      }
      if ( this.mixin_isEmpty(this.GRID.BATCH_DATA.WHOL_MNT) ) {
        this.showAlertCaution({msg: '총 시간을 확인하세요.'});
        return;
      }

      if( this.GRID.BATCH_DATA.WHOL_MNT.indexOf("-")  > -1) {
        this.showAlertCaution({msg: '총 시간이 올바른 형식이 아닙니다. 시작, 종료, 점심 시간을 확인하세요.'});
        return;
      }

      let defaultMsg = "선택한 "+ this.GRID.BATCH_ITEMS.length + "명의 인원에 보정정보를 등록 하시겠습니까?";
      this.showConfirmInfo({
        msg: defaultMsg, callYes: this.saveHrCrtnBatchInfoProcess, callNo: () => {
          this.$store.commit("alertStore/hideAlert")
        }
      })
    },
    async saveHrCrtnBatchInfoProcess() {

      let sURL = '/api/lhcs/system/user/hrctrn/insertUserHrCrtnBatchHstry';
      let headParam = {};
      let postParam = {};

      postParam.SRCH_USER_IDS = '';
      this.GRID.BATCH_ITEMS.forEach((data, idx) => {
        postParam.SRCH_USER_IDS += ","+ data.USER_ID;
      });
      postParam.SRCH_USER_IDS = postParam.SRCH_USER_IDS.substring(1);
      postParam.EXEC_USER_ID = this.user_id;
      postParam.CRTN_ARTCL_CD = this.GRID.BATCH_DATA.CRTN_ARTCL_CD;
      postParam.APLCN_YMD = this.GRID.BATCH_DATA.APLCN_YMD.replaceAll("-","");
      postParam.RSN = this.GRID.BATCH_DATA.RSN;
      postParam.BGNG_HR = this.GRID.BATCH_DATA.BGNG_HR;
      postParam.END_HR = this.GRID.BATCH_DATA.END_HR;
      postParam.LUNCH_HR = this.GRID.BATCH_DATA.LUNCH_HR;
      postParam.WHOL_MNT = this.GRID.BATCH_DATA.WHOL_MNT;

      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.showToastInfo({msg:'일괄 처리 되었습니다.', callAfter:()=>{
            this.dialogHrCrtnList();
            this.selectGridList();
            this.closeModal2();
          }}
        );
      }else {
        this.closeModal2();
      }
    },
    changeCrtrListCombo() {
      console.log("changeCrtrListCombo");
      console.log( this.modelDateM );
      if( typeof this.modelDateM === "object") {
        this.SRCH_PARAMS_TOP.SRCH_ST = this.modelDateM.EVL_BGNG_DAY_DD;
        this.SRCH_PARAMS_TOP.SRCH_END = this.modelDateM.EVL_END_DAY_DD;
        this.selectGridList();
      }else {
        this.showToastCaution({msg : '평가기준정보가 없습니다.'})
      }
    },


    // 커스컴 요청 엑셀형식으로 다운로드 한다
    async customExcelDown() {

      let sUrl = '/phone-api/qt/selectHrCrtnUserList_CustomExcelDown';
      const postParam = {};

      if( (this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID === '')
          && (this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === undefined || this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID === '') ) {
        return;
      }
      this.mixin_loadding = true;
      if(this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== undefined && this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID !== '') {
        postParam.SRCH_DEPT_ID = this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID;
      }else {
        postParam.SRCH_GROUP_ID = this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID;
      }
      postParam.SRCH_USER_NM = this.SRCH_PARAMS_TOP.SRCH_USER_NM;
      postParam.SRCH_ST = this.SRCH_PARAMS_TOP.SRCH_ST.replaceAll("-","");
      postParam.SRCH_END = this.SRCH_PARAMS_TOP.SRCH_END.replaceAll("-","");

      try {
        const response = await axios.post(sUrl, postParam, {
          responseType: "blob", // 파일 데이터 수신 설정
        });
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // 다운로드 링크 생성 및 클릭
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "보정시간 관리 대장.xlsx"; // 파일명 설정
        link.click();

        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Excel download failed:", error);
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }

      this.mixin_loadding = false;
    },

    handleDownloadOption(option) {
      switch (option) {
        case 'C':
          // 현재 기준 다운로드 처리 로직
          console.log('현재 기준 다운로드를 선택했습니다.');
          const downloadButton = this.$refs.compoExcel.$el.querySelector('button'); // 다운로드 버튼 선택
          if (downloadButton) {
            downloadButton.click(); // 버튼 클릭
          } else {
            console.error('다운로드 버튼을 찾을 수 없습니다.');
          }
          break;
        case 'D':
          // 상세 기준 다운로드 처리 로직
          console.log('상세 기준 다운로드를 선택했습니다.');
          this.customExcelDown();
          break;
        default:
          console.log('알 수 없는 옵션입니다.');
          break;
      }
    },

    downloadSelected(selected){
      this.selectedDownloadOption = selected;
      this.handleDownloadOption(selected);
    }
  },
  mounted() {
  },
  async created() {
    this.common_ognz_list = await this.mixin_ognz_list();//조직

    let codeName = ['TAM'/* 시간보정 */];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    //평가기준년월 콤보용
    this.evl_crtr_code = await this.mixin_evl_crtr_list();
    //현재년월 세팅.
    let modelDateMObj = await this.evl_crtr_code.find((item) => (item.YR === this.$moment(new Date()).format('YYYY') && item.MM === this.$moment(new Date()).format('MM') ));
    if( modelDateMObj ) {
      this.modelDateM = {
        text: modelDateMObj.MM_TEXT,
        value: modelDateMObj.MM,
        MM: modelDateMObj.MM,
        EVL_BGNG_DAY: modelDateMObj.EVL_BGNG_DAY,
        EVL_END_DAY: modelDateMObj.EVL_END_DAY,
        EVL_BGNG_DAY_DD: modelDateMObj.EVL_BGNG_DAY_DD,
        EVL_END_DAY_DD: modelDateMObj.EVL_END_DAY_DD,
        WORK_DAY: modelDateMObj.WORK_DAY,
      };
    }

    if( this.computedUserType === 'LEADER' ) {
      this.SRCH_PARAMS_TOP.SRCH_CENTER.CUSTCO_ID = this.computedUserCenter;
      this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = this.computedUserCenterDeptId;
      if( this.computedUserDetailType.indexOf("CENTER_LEADER") === -1) {  //센터장이 아닌경우 자기자신부서만.
        this.SRCH_PARAMS_TOP.SRCH_DEPT.value = this.computedUserDeptId;
        this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = this.computedUserDeptId;
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = true;
      }else {
        let first_obj = this.mixin_ognz_list_detail_first(this.common_ognz_list, this.computedUserCenterDeptId);
        if( first_obj ) { //첫번째 부서세팅.
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = first_obj.DEPT_ID;
          this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = first_obj.DEPT_ID;
        }else {
          this.SRCH_PARAMS_TOP.SRCH_DEPT.value = '';
        }
        this.SRCH_PARAMS_TOP.SRCH_DEPT_DISABLED = false;
      }
    }else if( this.computedUserType === 'ETC_ADMIN' ) {
      this.SRCH_PARAMS_TOP.SRCH_CENTER.value = "1000";
      this.SRCH_PARAMS_TOP.SRCH_CENTER.DEPT_ID = "1000";
      this.SRCH_PARAMS_TOP.SRCH_DEPT.value = '10004'; //마이홈1팀
      this.SRCH_PARAMS_TOP.SRCH_DEPT.DEPT_ID = '10004';
    }

    //목록조회
    await this.selectGridList();
  },

  beforeDestroy() {

  },
  computed: {
  },
  watch: {
    modelBaseDate() {
      if( this.modelBaseDate === '조회기간') {
        this.GRID.ITEMS = [];
        this.GRID.ITEMS_TOT_CNT = 0;
        this.SRCH_PARAMS_TOP.SRCH_ST = this.$moment(new Date()).subtract(14,'days').format('YYYY-MM-DD');
        this.SRCH_PARAMS_TOP.SRCH_END = this.$moment(new Date()).format('YYYY-MM-DD');
        this.selectGridList();
      }else if( this.modelBaseDate === '평가기준') {
        this.GRID.ITEMS = [];
        this.GRID.ITEMS_TOT_CNT = 0;
        this.changeCrtrListCombo();
      }
    },
  },
};
</script>

<style lang="scss">
th.type-border{
  box-shadow: inset 1px 0px 0 0px var(--primary-color), inset 0px 1px 0 0px var(--primary-color), inset -1px 1px 0 0px var(--primary-color) !important;
}
</style>