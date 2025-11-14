<template>
  <div class="">
    <!-- top -->
    <div class="d-flex px-6 py-4">
      <div class="">
        <img
          :src="USER_INFO.IMG"
          :alt="USER_INFO.USER_NM"
          style="width: 35px; max-height: 40px; border-radius: 50%;" @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}" />
      </div>
      <div class="pl-top-profile-dialog-desc-wrap ml-3">
        <strong style="font-size: 15px">{{USER_INFO.USER_NM}}</strong>
        <span class="is-txt-sub ml-1"> {{USER_INFO.JBPS_CD_NM}} </span>
        <div>
          {{USER_INFO.CUSTCO_NM}} - {{USER_INFO.DEPT_NM}}
        </div>
      </div>
      <v-btn
        @click="eventCloseModal()"
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
    <v-tabs class="pl-tabs type-subtab px-4 is-noborder is-border-bottom" v-model="selectedTabIndex">
      <v-tab>
        <v-badge
          :value="false"
          color="#0073ce"
          bordered
          offset-x="-1"
          offset-y="9"
          dot
        >
          기본설정 <strong v-if="isChangesInfo" class="is-txt-red">(변경)</strong>
        </v-badge>
      </v-tab>
      <v-tab>단축근무</v-tab>
      <v-tab>시간보정일정</v-tab>
      <v-tab>부서이동이력</v-tab>
    </v-tabs>
    <v-tabs-items v-model="selectedTabIndex">
      <!-- tab: 기본설정 -->
      <v-tab-item>
        <div class="px-6 py-4" style="height: 550px;">
          <div>
            <span class="pl-subtit">기본 정보</span>
            <p class="is-mt-s">시스템에서 관리되는 직원의 기본정보로, 정보의 수정 및 관리는 시스템 관리자가 할 수 있습니다. </p>

            <table class="pl-tbl-detail is-mt-s">
              <colgroup>
                <col width="90px" />
                <col width="" />
                <col width="90px" />
                <col width="" />
                <col width="90px" />
                <col width="" />
              </colgroup>
              <tbody>
                <tr>
                  <th scope="row">
                    <span class="pl-label">
                      아이디
                    </span>
                  </th>
                  <td >
                    <span class="pl-value-txt">{{USER_INFO.LGN_ID}}</span>
                  </td>
                  <th scope="row">
                    <span class="pl-label">
                      내선번호
                    </span>
                  </th>
                  <td >
                    <span class="pl-value-txt">{{USER_INFO.EXT_NO}}</span>
                  </td>
                  <th scope="row">
                    <span class="pl-label">
                      Agent ID
                    </span>
                  </th>
                  <td >
                    <span class="pl-value-txt">{{USER_INFO.AGENT_ID}}</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <span class="pl-label">
                      호 전환 여부
                    </span>
                  </th>
                  <td >
                    <span class="pl-value-txt" v-if="USER_INFO.TRANSPHN_USE_YN === 'Y'">허용</span>
                    <span class="pl-value-txt" v-if="USER_INFO.TRANSPHN_USE_YN !== 'Y'">불가</span>
                  </td>
                  <th scope="row">
                    <span class="pl-label">
                      소프트 폰 사용
                    </span>
                  </th>
                  <td >
                    <span class="pl-value-txt" v-if="USER_INFO.SOFT_PHN_USE_YN === 'Y'">사용</span>
                    <span class="pl-value-txt" v-if="USER_INFO.SOFT_PHN_USE_YN !== 'Y'">미사용</span>
                  </td>
                  <th scope="row">
                    <span class="pl-label">
                      권한그룹
                    </span>
                  </th>
                  <td >
                    <span class="pl-value-txt">{{ USER_INFO.AUTHOR_GROUP_NM_LIST }}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <span class="pl-subtit is-mt-l">부가 정보</span>
            <p class="is-mt-s">센터에서 관리하는 직원의 부가정보로, 평가집계, 근태 등과 연관되어 집니다.</p>

            <div class="pl-form-inline-wrap label-100 is-mt-m gap-8 is-border-sub-top pt-3">
              <div class="pl-form-inline" style="width: 245px;gap: 24px;">
                <span class="pl-label">
                  직무 그룹
                </span>
                <div class="pl-desc">
                  <div class="d-flex flex-column">
                    <v-select
                      v-model="USER_INFO.DUTY_GROUP_CD"
                      :items="mixin_common_code_get_global(common_code_global, 'JOB_CL', USER_INFO.CUSTCO_ID, '전체' )"
                      class="pl-form type-middle "
                      style="flex: 0; width: 120px"
                      placeholder="선택"
                    ></v-select>
                  </div>
                </div>
              </div>
              <div class="pl-form-inline-wrap label-100">
                <span class="pl-label">
                  그룹내 순서
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form type-middle is-xs"
                    v-model="USER_INFO.DUTY_GROUP_SORT_ORD"
                  ></v-text-field>
                </div>
              </div>
            </div>
<!--            <div class="pl-form-inline-wrap label-100 vertical" v-if="computedUserCenter === '4'">-->
            <div class="pl-form-inline-wrap label-100 vertical" v-if="USER_INFO.CUSTCO_ID === '4'">
              <div class="pl-form-inline" style="width: 100%;">
                <span class="pl-label">
                  사용가능 업무
                </span>
                <div class="pl-desc">
                  <div class="pl-selection-row">
                    <v-checkbox
                      v-model="USE_CUTT_TASK_LIST"
                      v-for="(item, index) in CUTT_TASK_LIST"
                      :key="index"
                      :label="item.text"
                      :value="item"
                      class="pl-check "
                      @click="setDefaultCuttTask"
                    ></v-checkbox>
                    <v-select
                      v-model="DEFAULT_CUTT_TASK"
                      :items="USE_CUTT_TASK_LIST"
                      class="pl-form type-middle is-md"
                      placeholder="기본 상담업무 선택"
                    ></v-select>
                  </div>
                </div>
              </div>
            </div>
            <div class="pl-form-inline-wrap label-100 vertical">
              <div class="pl-form-inline">
                <span class="pl-label">
                  담당 지역
                </span>
                <div class="pl-desc">
                  <div class="d-flex flex-column">
                    <v-select
                      v-model="USER_INFO.TKCG_RGN_CD"
                      :items="common_charge_area"
                      class="pl-form type-middle "
                      style="flex: 0; width: 326px"
                      placeholder="선택"
                    ></v-select>
                  </div>
                </div>
              </div>
            </div>

            <div class="pl-form-inline-wrap vertical label-100 mt-3 gap-8 is-border-sub-top pt-3">
              <div class="pl-form-inline">
                <span class="pl-label">
                  단축 근무
                </span>
                <div class="pl-desc">
                  <v-radio-group
                    v-model="USER_INFO.SHORT_WORK_YN"
                    row
                    class="pl-radio-group"
                    style="width: 140px;"
                  >
                    <v-radio
                      v-for="(rad01, index) in radioGroupYN"
                      :key="radioGroupYN[index].value"
                      :label="rad01.text"
                      :value="rad01.value"
                      class="pl-radio"
                    >
                    </v-radio>
                  </v-radio-group>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  업무능력평가 여부
                </span>
                <div class="pl-desc">
                  <v-radio-group
                    v-model="USER_INFO.TASKEVL_TRGT_YN"
                    row
                    class="pl-radio-group"
                    style="width: 140px;"
                  >
                    <v-radio
                      v-for="(rad01, index) in radioGroupYN"
                      :key="radioGroupYN[index].value"
                      :label="rad01.text"
                      :value="rad01.value"
                      class="pl-radio"
                    >
                    </v-radio>
                  </v-radio-group>
                  <v-text-field
                      class="pl-form type-middle"
                      :disabled="USER_INFO.TASKEVL_TRGT_YN==='Y'?true:false"
                      v-model="USER_INFO.TASKEVL_TRGT_EXL_RSN"
                      placeholder="미대상 사유를 입력하세요."
                  ></v-text-field>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  상담품질평가 여부
                </span>
                <div class="pl-desc">
                  <v-radio-group
                      v-model="USER_INFO.EVL_TRGT_YN"
                      row
                      class="pl-radio-group"
                      style="width: 140px;"
                  >
                    <v-radio
                        v-for="(rad01, index) in radioGroupTRGT"
                        :key="radioGroupTRGT[index].value"
                        :label="rad01.text"
                        :value="rad01.value"
                        class="pl-radio"
                    >
                    </v-radio>
                  </v-radio-group>
                  <v-text-field
                      class="pl-form type-middle"
                      :disabled="USER_INFO.EVL_TRGT_YN==='Y'?true:false"
                      v-model="USER_INFO.EVL_TRGT_EXL_RSN"
                      placeholder="미대상 사유를 입력하세요."
                  ></v-text-field>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  고정 평가 대상
                </span>
                <div class="pl-desc">
                  <v-radio-group
                      v-model="USER_INFO.FIX_EVL_TRGT_YN"
                      row
                      class="pl-radio-group"
                      style="width: 140px;"
                  >
                    <v-radio
                        v-for="(rad01, index) in radioGroupTRGT"
                        :key="radioGroupTRGT[index].value"
                        :label="rad01.text"
                        :value="rad01.value"
                        class="pl-radio"
                    >
                    </v-radio>
                  </v-radio-group>
                  <v-text-field
                      class="pl-form type-middle"
                      :disabled="USER_INFO.FIX_EVL_TRGT_YN==='Y'?true:false"
                      v-model="USER_INFO.FIX_EVL_TRGT_EXL_RSN"
                      placeholder="미대상 사유를 입력하세요."
                  ></v-text-field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-tab-item>
      <!-- 단축근무 -->
      <v-tab-item>
        <v-form ref="SHORT_WORK">
        <div class="px-6 py-4" style="height: 550px;">
          <div class="pl-grid-top">
            <div class="pl-grid-top-left">
              <span class="pl-subtit d-flex align-center">
                <v-icon class="pl-icon20 document"></v-icon>
                <span class="ml-1">단축 근무 현황</span>
              </span>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ SHORT_WORK.ITEMS.length }})</em> 건</span>
            </div>
          </div>
          <v-data-table
            class="pl-grid is-mt-s"
            :headers="SHORT_WORK.HEADERS"
            :items="SHORT_WORK.ITEMS"
            fixed-header
            item-key="ROW_NUMBER"
            height="140px"
            :item-class="isActiveShortWorkRow"
            @click:row="selectShortWorkRow"
            :loading="mixin_loadding"
            hide-default-footer
	    no-data-text="등록된 데이터가 없습니다.">
          </v-data-table>
          <div class="pt-3">
            <div class="d-flex align-center">
              <span class="pl-subtit">단축근무 상세 내용</span>
              <div class="ml-auto">
                <compo-tooltip-btn
                    v-if="USER_INFO.SHORT_WORK_YN === 'Y'"
                  TitleProp="추가"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 circle-plus"
                  TooltipPositionProp="bottom"
                  @btnClick="initShortWorkForm"
                ></compo-tooltip-btn>
                <strong :class="`is-txt-red`" v-if="USER_INFO.SHORT_WORK_YN !== 'Y'">단축근무 미대상</strong>
                <compo-tooltip-btn
                  TitleProp="삭제"
                  ClassProp="pl-tooltip-btn ml-1"
                  IconProp="pl-icon20 trash"
                  TooltipPositionProp="bottom"
                  @btnClick="deleteShortWork"
                ></compo-tooltip-btn>
              </div>
            </div>
            <!-- 단축근무 상세 내용 -->
            <div class=" is-mt-s pt-3 is-border-sub-top">
              <p class="">※ 직원 중 단축근무자를 대상으로 단축근무 기간과 출/퇴근시간을 설정 합니다.</p>
              <p class="">※ <strong :class="`is-txt-blue`">해당 기간동안 시스템에서 자동으로 근태정보가 보정</strong>됩니다. (주의, 설정한 출근시간에 따라 지각 여부가 결정됩니다.) </p>
              <p class="">※ <strong> 기본설정 > 단축근무</strong> 여부에 따라 등록된 항목이 적용됩니다.</p>

<!--              <p class=""> 직원 중 단축근무자를 대상으로 단축근무 기간과 출/퇴근시간을 설정 하시면 <strong>해당 기간동안 시스템에서 자동으로 근태정보를 보정</strong>합니다. (단, 설정한 출근시간에 따라 지각 여부가 경정되므로 유의 하시기 바랍니다.)</p>-->
              <!-- form -->
              <div
                style="display: grid; gap: 8px 0; grid-template-columns: 1fr 2fr 1fr 2fr; "
                class="is-mt-m">
                <span class="pl-label is-md">구분</span>
                <v-select
                  class="pl-form type-middle"
                  ref="SHORT_WORK.DATA.SHORT_WORK_TYPE_CD"
                  v-model="SHORT_WORK.DATA.SHORT_WORK_TYPE_CD"
                  :items="mixin_common_code_get(common_code,'SHWK_DV','')"
                  placeholder="선택"
                ></v-select>
                <span class="pl-label is-md">단축근무 시간</span>
                <v-select
                  class="pl-form type-middle"
                  ref="SHORT_WORK.DATA.SHORT_WORK_HR_CD"
                  v-model="SHORT_WORK.DATA.SHORT_WORK_HR_CD"
                  :items="mixin_common_code_get(common_code,'SHWK_TM','')"
                  placeholder="선택"
                ></v-select>
                <span class="pl-label is-md">단축근무 시작일 </span>
                <compo-date-picker DateType="dateInput" :DateProp.sync="SHORT_WORK.DATA.WORK_BGNG_YMD_DD"/>
                <span class="pl-label is-md">단축근무 종료일</span>
                <compo-date-picker DateType="dateInput" :DateProp.sync="SHORT_WORK.DATA.WORK_END_YMD_DD"/>

                <span class="pl-label is-md">출근 시간 </span>
                <compo-date-picker DateType="time" :TimesProp.sync='SHORT_WORK.DATA.ATDC_HR'/>
                <span class="pl-label is-md">퇴근 시간</span>
                <compo-date-picker DateType="time" :TimesProp.sync='SHORT_WORK.DATA.LVWK_HR' />
              </div>
            </div>
          </div>
        </div>
        </v-form>
      </v-tab-item>

      <!-- 시간보정 -->
      <v-tab-item>
        <div class="px-6 py-4" style="height: 550px;">
          <div class="pl-grid-top">
            <div class="pl-grid-top-left">
              <span class="pl-subtit d-flex align-center">
                <v-icon class="pl-icon20 document"></v-icon>
                <span class="ml-1">시간보정일정 등록현황 </span>
              </span>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ HR_CRTN.ITEMS.length }})</em> 건</span>
            </div>
          </div>
          <v-data-table
            class="pl-grid is-mt-s is-hover"
            :headers="HR_CRTN.HEADERS"
            :items="HR_CRTN.ITEMS"
            fixed-header
            item-key="ROW_NUMBER"
            height="140px"
            :item-class="isActiveHrCrtnRow"
            @click:row="selectHrCrtnRow"
            hide-default-footer
	    no-data-text="등록된 데이터가 없습니다.">
          </v-data-table>
          <div class="pt-3">
            <div class="d-flex align-center">
              <span class="pl-subtit">시간보정일정 상세 내용 </span>
              <div class="ml-auto">
                <compo-tooltip-btn
                  TitleProp="추가"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 circle-plus"
                  TooltipPositionProp="bottom"
                  @btnClick="initHrCrtnSchdForm"
                ></compo-tooltip-btn>
                <compo-tooltip-btn
                  TitleProp="삭제"
                  ClassProp="pl-tooltip-btn ml-1"
                  IconProp="pl-icon20 trash"
                  TooltipPositionProp="bottom"
                  @btnClick="deleteHrCrtnSchd"
                ></compo-tooltip-btn>
              </div>
            </div>
            <!-- 시간보정 상세 내용 -->
            <div class=" is-mt-s pt-3 is-border-sub-top">
              <p class="">※ 특정 상황(노조활동 등) 으로 <strong :class="`is-txt-blue`">설정한 보정기간 동안 시스템에서 배치를 통하여 자동으로 시간보정 정보가 등록</strong>됩니다.</p>
              <p class="">※ 필요시 보정기간을 수정하거나 일정을 삭제하시기 바랍니다. </p>
              <p class="">※ 타 팀으로 부서이동시 등록된 일정은 부서이동일로 종료 됩니다. </p>
              <!-- form -->
              <div class="pl-form-inline-wrap vertical label-80 is-mt-s gap-8">
                <div class="pl-form-inline ">
                  <span class="pl-label">
                    보정 기간
                  </span>
                  <div class="pl-desc">
                    <compo-date-range-picker
                      :StartDayProp.sync="HR_CRTN.DATA.APLCN_YMD_ST"
                      :EndDayProp.sync="HR_CRTN.DATA.APLCN_YMD_END"
                      :IsViewDropPickerProp="false"
                      @startDayChange="mixin_testLog(HR_CRTN.DATA.APLCN_YMD_ST)"
                      @endDayChange="mixin_testLog(HR_CRTN.DATA.APLCN_YMD_END)"
                    />
                  </div>
                </div>
                <div class="pl-form-inline ">
                  <span class="pl-label">
                    보정 항목
                  </span>
                  <div class="pl-desc" style="width: auto;">
                    <v-select
                      class="pl-form type-middle flex-grow-0"
                      ref="HR_CRTN.DATA.CRTN_ARTCL_CD"
                      v-model="HR_CRTN.DATA.CRTN_ARTCL_CD"
                      :items="mixin_common_code_get(common_code,'TAM','전체')"
                      placeholder="선택"
                    ></v-select>
                  </div>
                  <span class="pl-label" style="margin-left: -19px; flex: 0 0 30px !important">
                    사유
                  </span>
                  <div class="pl-desc" style="margin-left: -8px;">
                    <v-text-field
                      style="flex: 0 0 346px"
                      class="pl-form type-middle"
                      v-model="HR_CRTN.DATA.RSN"
                      placeholder="사유 입력"
                      />
                  </div>
                </div>
                <div class="pl-form-inline ">
                  <span class="pl-label">
                    보정 시간
                  </span>
                  <div class="pl-desc">
                    <div class="spacing-wrap sp-4 ">
                      <div class="d-flex align-center">
                        <strong class="is-txt-black">시작시간</strong>
                        <v-text-field
                          class="pl-form type-middle is-xss ml-2"
                          placeholder="09:00"
                          v-model="HR_CRTN.DATA.BGNG_HR"
                          oninput="this.value=(this.value.replace(/\D/g, '')).replace(/(\d{2})(\d{2})/g, '$1:$2');"
                          maxlength="5"
                          @blur="timeDiff_HR_CRTN_WHOL_MNT"
                          @focus="$event.target.select()"
                        />
                      </div>
                      <div class="d-flex align-center ml-10">
                        <strong class="is-txt-black">종료시간</strong>
                        <v-text-field
                          class="pl-form type-middle is-xss ml-2"
                          placeholder="18:00"
                          v-model="HR_CRTN.DATA.END_HR"
                          oninput="this.value=(this.value.replace(/\D/g, '')).replace(/(\d{2})(\d{2})/g, '$1:$2');"
                          @blur="timeDiff_HR_CRTN_WHOL_MNT"
                          @focus="$event.target.select()"
                          maxlength="5"
                        />
                      </div>
                      <div class="d-flex align-center ml-10">
                        <strong class="is-txt-black">점심시간</strong>
                        <v-text-field
                          class="pl-form type-middle is-xss ml-2"
                          placeholder="01:00"
                          v-model="HR_CRTN.DATA.LUNCH_HR"
                          oninput="this.value=(this.value.replace(/\D/g, '')).replace(/(\d{2})(\d{2})/g, '$1:$2');"
                          @blur="timeDiff_HR_CRTN_WHOL_MNT"
                          @focus="$event.target.select()"
                          maxlength="5"
                        />
                      </div>
                      <div class="d-flex align-center ml-10">
                        <strong class="is-txt-black">총 시간</strong>
                        <v-text-field
                          disabled
                          class="pl-form type-middle is-xss ml-2"
                          placeholder="00:00"
                          v-model="HR_CRTN.DATA.WHOL_MNT"
                          oninput="this.value=(this.value.replace(/\D/g, '')).replace(/(\d{2})(\d{2})/g, '$1:$2');"
                          maxlength="5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p class="is-txt-sub mt-1">※ 보정시간 입력 예시 : 시작시간 - 09:00 , 종료시간 - 18:00 , 점심시간(1시간) - 01:00 </p>
              </div>
            </div>
          </div>
        </div>
      </v-tab-item>

      <!-- tab: 부서이동 현황 -->
      <v-tab-item>
        <div class="px-6 py-4" style="height: 550px;">
          <div class="pl-grid-top">
            <div class="pl-grid-top-left">
              <span class="pl-subtit">부서이동 이력</span>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ MOVE_HIST.ITEMS.length }})</em> 건</span>
            </div>
          </div>
          <v-data-table
            class="pl-grid is-mt-s"
            :headers="MOVE_HIST.HEADERS"
            :items="MOVE_HIST.ITEMS"
            fixed-header
            item-key="index"
            height="430px"
            :items-per-page="-1"
            :loading="mixin_loadding"
            hide-default-footer
	    no-data-text="등록된 데이터가 없습니다.">
          </v-data-table>
        </div>
      </v-tab-item>

    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: 'HOME_TEAM_TAB01_DETAIL',
  props: {
    PROPS_USER_INFO: {
      type: Object,
    },
    PROPS_TAB_INDEX: {
      type: Number,
    }
  },
  components: {
  },
  data() {
    return {
      common_code:[], //공통코드
      common_code_global:[], //공통코드
      common_charge_area:[], //담당지역

      INIT_USER_INFO:{},
      USER_INFO:{},
      USE_CUTT_TASK_LIST : [],

      selectedTabIndex: this.PROPS_TAB_INDEX, //탭 선택
      isChangesInfo: false, //변경여부

      // 기본설정
      radioGroupTRGT: [
        { text: "대상", value:'Y' }, { text: "미대상", value:'N' },
      ],
      radioGroupYN: [
        { text: "대상", value:'Y' }, { text: "미대상", value:'N' },
      ],

      // 단축근무
      SHORT_WORK: {
        HEADERS: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
          { text: '구분', value: 'SHORT_WORK_TYPE_CD_NM', align: 'center', width: '70px', sortable: false },
          { text: '시작일', value: 'WORK_BGNG_YMD_DD', align: 'center', width: '100px', sortable: false },
          { text: '종료일', value: 'WORK_END_YMD_DD', align: 'center', width: '100px', sortable: false },
          { text: '근무시간', value: 'WORK_HR', align: 'center', width: '70px', sortable: false },
          { text: '단축근무', value: 'SHORT_WORK_HR_CD_NM', align: 'center', width: '70px', sortable: false },
          { text: '최종수정', value: 'MDFR_ID_NM', align: 'center', width: '70px', sortable: false },
        ],
        ITEMS:[],
        DATA: {
          ATDC_HR: '00:00', //출근시간
          LVWK_HR: '00:00', //퇴근시간
          WORK_BGNG_YMD_DD: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          WORK_END_YMD_DD: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        },
        rules: {
          SHORT_WORK_TYPE_CD: [
            v => !!v || '구분은(는) 필수 선택 항목입니다.'
          ],
          SHWK_TM: [
            v => !!v || '시작일자 은(는) 필수 입력 항목입니다.'
          ]
        },
      },

      // 시간보정일정
      HR_CRTN: {
        HEADERS: [
          {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
          {text: '시작일', value: 'BGNG_YMD_DD', align: 'center', width: '90px', sortable: false},
          {text: '종료일', value: 'END_YMD_DD', align: 'center', width: '90px', sortable: false},
          {text: '최종수정', value: 'MDFR_ID_NM', align: 'center', width: '70px', sortable: false},
          {text: '보정 항목', value: 'CRTN_ARTCL_CD_NM', align: '', width: '80px', sortable: false},
          {text: '내용', value: 'RSN', align: '', width: '', sortable: false},
          {text: '시작', value: 'BGNG_HR', align: 'center', width: '50px', sortable: false},
          {text: '종료', value: 'END_HR', align: 'center', width: '50px', sortable: false},
          {text: '점심', value: 'LUNCH_HR', align: 'center', width: '50px', sortable: false},
        ],
        ITEMS: [],
        DATA: {
          LUNCH_HR: '00:00', //점심시간
          WHOL_MNT: '00:00', //전체시간
          APLCN_YMD: '',
          APLCN_YMD_ST: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          APLCN_YMD_END: this.$moment().format('yyyy-MM-DD'),
        },
      },

      MOVE_HIST : {
        HEADERS: [
          { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
          { text: '시작일', value: 'WORK_BGNG_YMD_DD', align: 'center', width: '20%', sortable: false },
          { text: '종료일', value: 'WORK_END_YMD_DD', align: 'center', width: '20%', sortable: false },
          { text: '센터', value: 'CUSTCO_NM', align: '', width: '25%', sortable: false },
          { text: '팀', value: 'DEPT_NM', align: '', width: '', sortable: false },
        ],
        ITEMS: []

      },

      CUTT_TASK_LIST:[], //바로처리 업무구분 목록
      DEFAULT_CUTT_TASK:'', //기본 바로처리 업무구분
    }
  },
  methods: {
    //validate check
    validate (f) {
      return this.$refs[f].validate();
    },
    closeModal(){
      this.initHrCrtnSchdForm();
      this.$store.commit("alertStore/hideAlert");
      this.$emit('Close');
    },
    parentRefresh(){
      this.$emit('Refresh');
    },
    eventCloseModal() {
      if( this.checkChangesInfo() ) {
        this.showConfirmInfo({msg: '변경된 정보가 있습니다. 정말 닫겠습니까?', callYes:this.closeModal, callNo:()=>{this.$store.commit("alertStore/hideAlert")}})
      }else {
        this.closeModal();
      }
    },
    isActiveHrCrtnRow(item) {
      const activeClass = item === this.HR_CRTN.DATA ? "active" : "";
      return activeClass;
    },
    isActiveShortWorkRow(item) {
      const activeClass = item === this.SHORT_WORK.DATA ? "active" : "";
      return activeClass;
    },

    //시간보정 시간계산
    timeChk(s){
      let stTime = this.HR_CRTN.DATA.BGNG_HR;
      let endTime = this.HR_CRTN.DATA.END_HR;
      let runchTime = this.HR_CRTN.DATA.LUNCH_HR;

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

    async saveTaskInfo() {
      console.log( "saveTaskInfo :: "  + this.selectedTabIndex );
      if( this.selectedTabIndex === 0 ) { //기본설정

        if (this.USER_INFO.TASKEVL_TRGT_YN === 'N' && this.mixin_isEmpty(this.USER_INFO.TASKEVL_TRGT_EXL_RSN)) {
          this.showAlertCaution({msg: '평가 미대상인경우 사유를 입력하세요.'});
          return;
        }
        if (this.USER_INFO.TASKEVL_TRGT_YN === 'Y"') this.USER_INFO.TASKEVL_TRGT_EXL_RSN = ''; //평가대상인경우는 사유 제거.


        if (this.USER_INFO.EVL_TRGT_YN === 'N' && this.mixin_isEmpty(this.USER_INFO.EVL_TRGT_EXL_RSN)) {
          this.showAlertCaution({msg: '평가 미대상인경우 사유를 입력하세요.'});
          return;
        }
        if (this.USER_INFO.EVL_TRGT_YN === 'Y"') this.USER_INFO.EVL_TRGT_EXL_RSN = ''; //평가대상인경우는 사유 제거.

        // if (this.USER_INFO.FIX_EVL_TRGT_YN === 'N' && this.mixin_isEmpty(this.USER_INFO.FIX_EVL_TRGT_EXL_RSN)) {
        //   this.showAlertCaution({msg: '고정 평가 미대상인경우 사유를 입력하세요.'});
        //   return;
        // }
        if (this.USER_INFO.FIX_EVL_TRGT_YN === 'Y"') this.USER_INFO.FIX_EVL_TRGT_EXL_RSN = ''; //평가대상인경우는 사유 제거.

        //바로처리인 경우 사용가능 업무 선택
        // if(this.computedUserCenter === '4'){
        if(this.USER_INFO.CUSTCO_ID === '4'){
          if(this.USE_CUTT_TASK_LIST.length === 0){
            this.showAlertCaution({msg: '사용가능 업무를 선택하세요.'});
            return;
          }else{
            if(this.mixin_isEmpty(this.DEFAULT_CUTT_TASK)){
              this.showAlertCaution({msg: '기본 상담업무를 선택하세요.'});
              return;
            }
          }
        }

        this.showConfirmInfo({
          msg: '변경된 정보를 저장하시겠습니까?', callYes: this.saveUserInfoProcess, callNo: () => {
            this.$store.commit("alertStore/hideAlert")
          }
        })
      }else if( this.selectedTabIndex === 1 ) { //단축근무
        if( this.USER_INFO.SHORT_WORK_YN === 'Y') {
          if (this.mixin_isEmpty(this.SHORT_WORK.DATA.SHORT_WORK_TYPE_CD)) {
            this.showAlertCaution({
              msg: '단축근무 구분을 선택하세요.', callAfter: () => {
                this.setFocus('SHORT_WORK.DATA.SHORT_WORK_TYPE_CD');
              }
            });
            return;
          }
          if (this.mixin_isEmpty(this.SHORT_WORK.DATA.SHORT_WORK_HR_CD)) {
            this.showAlertCaution({
              msg: '단축근무 시간을 선택하세요.', callAfter: () => {
                this.setFocus('SHORT_WORK.DATA.SHORT_WORK_HR_CD');
              }
            });
            return;
          }

          if ( this.SHORT_WORK.DATA.ATDC_HR === '00:00' || this.SHORT_WORK.DATA.LVWK_HR === '00:00' ) {
            this.showAlertCaution({msg: '출근시간 또는 퇴근시간 선택하세요.'});
            return;
          }

          if( this.SHORT_WORK.ITEMS.length > 0 ) {
            for (let item of this.SHORT_WORK.ITEMS){
              let regBgngYmd = this.SHORT_WORK.DATA.WORK_BGNG_YMD_DD.replaceAll("-","");
              let regEndYmd = this.SHORT_WORK.DATA.WORK_END_YMD_DD.replaceAll("-","");

              if( (item.WORK_BGNG_YMD <= regBgngYmd && regBgngYmd <= item.WORK_END_YMD) ) {
                this.showAlertCaution({msg: '이미 등록된 단축근무 기간입니다.'});
                return;
              }
              if( (item.WORK_BGNG_YMD <= regEndYmd && regEndYmd <= item.WORK_END_YMD) ) {
                this.showAlertCaution({msg: '이미 등록된 단축근무 기간입니다.'});
                return;
              }
            }
          }

          console.log( this.SHORT_WORK.DATA );
          console.log( this.SHORT_WORK.ITEMS );


          this.showConfirmInfo({
            msg: '정보를 저장하시겠습니까?', callYes: this.saveShortWorkProcess, callNo: () => {
              this.$store.commit("alertStore/hideAlert")
            }
          })
        }else {
          this.showAlertCaution({
            msg: '기본설정 > 단축근무 설정이후에 등록하시기 바랍니다.'
          });
          return;
        }

      }else if( this.selectedTabIndex === 2 ) { //시간보정

        if (this.mixin_isEmpty(this.HR_CRTN.DATA.APLCN_YMD_ST)) {
          this.showAlertCaution({msg: '보정기간 시작일을 선택하세요.'});
          return;
        }

        if (this.mixin_isEmpty(this.HR_CRTN.DATA.APLCN_YMD_END)) {
          this.showAlertCaution({msg: '보정기간 종료일을 선택하세요.'});
          return;
        }

        if (this.mixin_isEmpty(this.HR_CRTN.DATA.CRTN_ARTCL_CD)) {
          this.showAlertCaution({msg: '보정 항목을 선택하세요.'});
          return;
        }
        if (this.mixin_isEmpty(this.HR_CRTN.DATA.RSN)) {
          this.showAlertCaution({msg: '보정 사유를 입력하세요.'});
          return;
        }

        if (this.mixin_isEmpty(this.HR_CRTN.DATA.BGNG_HR)) {
          this.showAlertCaution({msg: '보정 시작시간을 입력하세요.'});
          return;
        }

        if (this.mixin_isEmpty(this.HR_CRTN.DATA.END_HR)) {
          this.showAlertCaution({msg: '보정 종료시간을 입력하세요.'});
          return;
        }

        if (this.mixin_isEmpty(this.HR_CRTN.DATA.LUNCH_HR)) {
          this.showAlertCaution({msg: '보정 점심시간을 입력하세요.'});
          return;
        }

        if( this.HR_CRTN.DATA.WHOL_MNT == '00:00') {
          this.showAlertCaution({msg: '총 시간이 00:00 입니다. 시간을 확인해주세요.'});
          return;
        }else{
          if(!this.timeChk()){
            this.showAlertCaution({msg: '유효하지 않은 시간설정입니다.<br>입력한 시간을 다시 확인해주세요.'});
            return;
          }
        }

        this.showConfirmInfo({
          msg: '정보를 저장하시겠습니까?', callYes: this.saveHrCrtnSchdProcess, callNo: () => {
            this.$store.commit("alertStore/hideAlert")
          }
        })
      }
    },

    async saveUserInfoProcess() {
      this.mixin_loadding = true;
      let sURL = '/api/lhcs/system/user/emp/updateEmpInfo';
      let postParam = this.USER_INFO;
      postParam.SRCH_USER_ID = this.USER_INFO.USER_ID;
      let headParam = {
        head: {
        }
      }

      //바로처리인 경우 사용가능 업무 선택
      // if(this.computedUserCenter === '4'){
      if(this.USER_INFO.CUSTCO_ID === '4'){
        this.USE_CUTT_TASK_LIST.forEach((task, idx) => {
          if(task.value === this.DEFAULT_CUTT_TASK) task.DEFAULT_YN = 'Y';
          else task.DEFAULT_YN = 'N';
        });
        postParam.USE_CUTT_TASK_LIST = JSON.stringify(this.USE_CUTT_TASK_LIST);
      }

      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.selectUserInfo();
        this.parentRefresh();
      }
      this.mixin_loadding = false;
      this.$store.commit("alertStore/hideAlert");
    },
    async selectUserInfo() {
      this.mixin_loadding = true;
      let sURL = '/api/biz/common/select/selectUserList';
      let headParam = {head: {"ns": 'lhcs.system.user.dao.UserMapper'}};
      let postParam = {};
      postParam.SRCH_TYPE = 'CUSL';
      postParam.SRCH_USER_ID = this.USER_INFO.USER_ID;
      let response = await this.common_postCall(sURL, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG){
        let responseData = response.DATA[0];
        if( responseData.ICON_IMG_URI !== '/' ) {
          responseData.IMG = '/upload/' + responseData.ICON_IMG_URI;
        }else {
          responseData.IMG = require('@/assets/img/@manager_profile_default.png');
        }
        this.INIT_USER_INFO = responseData;

      }
      this.mixin_loadding = false;
    },
    // 기본설정 변경유무
    checkChangesInfo() {
      if( JSON.stringify(this.USER_INFO ) != JSON.stringify(this.INIT_USER_INFO) ) {
        this.isChangesInfo = true;
      }else {
        this.isChangesInfo = false;
      }
      return this.isChangesInfo;
    },

    //////////////////////////////////////////////
    // 단축근무설정
    //////////////////////////////////////////////
    async initShortWorkForm() {
      this.SHORT_WORK.DATA= {
        ATDC_HR: '00:00', //출근시간
        LVWK_HR: '00:00', //퇴근시간
        WORK_BGNG_YMD_DD: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        WORK_END_YMD_DD: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      }
      this.setFocus('SHORT_WORK.DATA.SHORT_WORK_TYPE_CD');
    },
    async selectShortWorkList() {
      this.mixin_loadding = true;
      let sURL = '/api/biz/common/select/selectShortWorkList';
      let headParam = {head: {"ns": 'lhcs.system.user.dao.ShortWorkMapper'}};
      let postParam = {};
      postParam.SRCH_USER_ID = this.USER_INFO.USER_ID;
      let response = await this.common_postCall(sURL, postParam, headParam);
      this.SHORT_WORK.ITEMS = [];
      if (!response.HEADER.ERROR_FLAG){
        this.SHORT_WORK.ITEMS = response.DATA;
      }
      this.mixin_loadding = false;
      this.initShortWorkForm();
    },
    async selectShortWorkRow( item ) {
      this.SHORT_WORK.DATA = item;
    },
    async saveShortWorkProcess() {
      this.mixin_loadding = true;
      let sURL = '/api/biz/common/update/updateShortWork';
      if( this.mixin_isEmpty( this.SHORT_WORK.DATA.USER_SHORT_WORK_ID ) ) {
        sURL = '/api/lhcs/system/user/shortwork/insertShortWork';
      }
      let postParam = this.SHORT_WORK.DATA;
      postParam.SRCH_USER_ID = this.USER_INFO.USER_ID;
      postParam.WORK_BGNG_YMD = this.SHORT_WORK.DATA.WORK_BGNG_YMD_DD.replaceAll("-","");
      postParam.WORK_END_YMD = this.SHORT_WORK.DATA.WORK_END_YMD_DD.replaceAll("-","");

      let headParam = {
        head: {
          "ns": 'lhcs.system.user.dao.ShortWorkMapper'
        }
      }
      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.showToastInfo({msg:'정상 처리 되었습니다.', callAfter:()=>{
            this.selectShortWorkList();
            this.parentRefresh();
            this.mixin_loadding = false;
            this.$store.commit("alertStore/hideAlert");
          }}
        );

      }else {
        this.showAlertCaution({msg: response.HEADER.ERROR_MSG, callAfter:()=>{
            this.mixin_loadding = false;
            this.$store.commit("alertStore/hideAlert");
          }}
        );
      }
    },
    deleteShortWork() {
      if( this.mixin_isEmpty( this.SHORT_WORK.DATA.USER_SHORT_WORK_ID ) ) {
        this.showAlertCaution({msg: '삭제하고자 하는 단축근무를 선택하세요.'});
        return;
      }

      this.showConfirmInfo({
        msg: '선택한 항목(번호'+ this.SHORT_WORK.DATA.ROW_NUMBER + " , " + this.SHORT_WORK.DATA.WORK_BGNG_YMD_DD + ' ~ ' + this.SHORT_WORK.DATA.WORK_END_YMD_DD +')을 삭제하시겠습니까?'
        , callYes: this.deleteShortWorkProcess
        , callNo: () => {
          this.$store.commit("alertStore/hideAlert")
        }
      })
    },
    async deleteShortWorkProcess() {
      this.mixin_loadding = true;
      let sURL = '/api/biz/common/delete/deleteShortWork';
      let postParam = {};
      postParam.USER_SHORT_WORK_ID = this.SHORT_WORK.DATA.USER_SHORT_WORK_ID;
      let headParam = {
        head: {
          "ns": 'lhcs.system.user.dao.ShortWorkMapper',
        }
      }
      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.showToastInfo({msg:'삭제 처리 되었습니다.', callAfter:()=>{
            this.parentRefresh();
            this.selectShortWorkList();
          }}
        );
      }
      this.mixin_loadding = false;
      this.$store.commit("alertStore/hideAlert");
    },

    //////////////////////////////////////////////
    // 시간보정일정
    //////////////////////////////////////////////
    async initHrCrtnSchdForm() {
      this.HR_CRTN.DATA= {
        LUNCH_HR: '00:00', //점심시간
        WHOL_MNT: '00:00', //전체시간
        APLCN_YMD: '',
        APLCN_YMD_ST: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        APLCN_YMD_END: this.$moment().format('yyyy-MM-DD'),
      }
      this.setFocus('HR_CRTN.DATA.CRTN_ARTCL_CD');
    },
    async selectHrCrtnSchdList() {
      this.mixin_loadding = true;
      let sURL = '/api/biz/common/select/selectHrCrtnSchdList';
      let headParam = {head: {"ns": 'lhcs.system.user.dao.HrCrtnMapper'}};
      let postParam = {};
      postParam.SRCH_USER_ID = this.USER_INFO.USER_ID;
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.HR_CRTN.ITEMS = response.DATA;
      }
      this.mixin_loadding = false;
      this.initHrCrtnSchdForm();
    },
    async selectHrCrtnRow( item ) {
      this.HR_CRTN.DATA = item;
      this.HR_CRTN.DATA.APLCN_YMD_ST = item.BGNG_YMD_DD;
      this.HR_CRTN.DATA.APLCN_YMD_END = item.END_YMD_DD;
    },
    // 시간보정일정 저장처리
    async saveHrCrtnSchdProcess() {
      this.mixin_loadding = true;
      let sURL = '/api/biz/common/update/updateHrCrtnSchd';
      if( this.mixin_isEmpty( this.HR_CRTN.DATA.HR_CRTN_SCHDL_ID ) ) {
        sURL = '/api/biz/common/insert/insertHrCrtnSchd';
      }
      let postParam = this.HR_CRTN.DATA;
      postParam.SRCH_USER_ID = this.USER_INFO.USER_ID;
      postParam.BGNG_YMD = this.HR_CRTN.DATA.APLCN_YMD_ST.replaceAll("-","");
      postParam.END_YMD = this.HR_CRTN.DATA.APLCN_YMD_END.replaceAll("-","");

      let headParam = {
        head: {
          "ns": 'lhcs.system.user.dao.HrCrtnMapper',
          "seq_key": "HR_CRTN_SCHDL_ID"
        }
      }
      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        console.log( sURL.indexOf("insertHrCrtnSchd") );
        if( sURL.indexOf("insertHrCrtnSchd") > -1){
          //시간보정 배치실행(사용자)
          this.executeSP_QZ_CALL_HR_CRTN_SCHDL_USER();
        }
        this.selectHrCrtnSchdList();
        this.parentRefresh();
      }
      this.mixin_loadding = false;
      this.$store.commit("alertStore/hideAlert");
    },
    //시간보정 배치실행
    async executeSP_QZ_CALL_HR_CRTN_SCHDL_USER() {
      let postParam = {};
      postParam.SRCH_USER_ID = this.USER_INFO.USER_ID;
      postParam.YYYYMMDD = await this.mixin_getSvrDate("YYYYMMDD");
      let headParam = {
        head: {
          "ns": 'lhcs.system.user.dao.HrCrtnMapper',
        }
      }
      await this.common_postCall("/api/biz/common/update/executeSP_QZ_CALL_HR_CRTN_SCHDL_USER", postParam, headParam);
    },
    deleteHrCrtnSchd() {
      if( this.mixin_isEmpty( this.HR_CRTN.DATA.HR_CRTN_SCHDL_ID ) ) {
        this.showAlertCaution({msg: '삭제하고자 하는 시간보정일정을 선택하세요.'});
        return;
      }

      this.showConfirmInfo({
        msg: '선택한 일정( 번호'+ this.HR_CRTN.DATA.ROW_NUMBER + " , " + this.HR_CRTN.DATA.APLCN_YMD_ST + ' ~ ' + this.HR_CRTN.DATA.APLCN_YMD_END +')을 삭제하시겠습니까?'
          , callYes: this.deleteHrCrtnSchdProcess
          , callNo: () => {
          this.$store.commit("alertStore/hideAlert")
        }
      })
    },
    async deleteHrCrtnSchdProcess() {
      this.mixin_loadding = true;
      let sURL = '/api/biz/common/delete/deleteHrCrtnSchd';
      let postParam = {};
      postParam.HR_CRTN_SCHDL_ID = this.HR_CRTN.DATA.HR_CRTN_SCHDL_ID;

      let headParam = {
        head: {
          "ns": 'lhcs.system.user.dao.HrCrtnMapper',
        }
      }
      let response  = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.showToastInfo({msg:'삭제 처리 되었습니다.', callAfter:()=>{
            if( this.HR_CRTN.DATA.APLCN_YMD_ST === this.$moment().format('yyyy-MM-DD')) {
              postParam.DEL_USER_ID = this.USER_INFO.USER_ID;
              postParam.DEL_YMD = this.HR_CRTN.DATA.APLCN_YMD_ST.replaceAll("-","");
              postParam.DEL_CRTN_ARTCL_CD = this.HR_CRTN.DATA.CRTN_ARTCL_CD;
              this.deleteTodayHrCrtnHstryProcess(postParam);
            }
            this.selectHrCrtnSchdList();
          }}
        );
      }
      this.mixin_loadding = false;
      this.$store.commit("alertStore/hideAlert");
    },

    async deleteTodayHrCrtnHstryProcess(postParam) {
      let sURL = '/api/biz/common/delete/deleteTodayHrCrtnHstryProcess';
      let headParam = {
        head: {
          "ns": 'lhcs.system.user.dao.HrCrtnMapper',
        }
      }
      await this.common_postCall(sURL, postParam, headParam);
    },

    //보정시간 총시간 계산.
    async timeDiff_HR_CRTN_WHOL_MNT() {
      if( !this.mixin_isEmpty(this.HR_CRTN.DATA.BGNG_HR) && !this.mixin_isEmpty(this.HR_CRTN.DATA.END_HR) && !this.mixin_isEmpty(this.HR_CRTN.DATA.LUNCH_HR) ) {
        let start_min = parseInt(this.HR_CRTN.DATA.BGNG_HR.substring(0, 3), 10) * 60
            + parseInt(this.HR_CRTN.DATA.BGNG_HR.substring(3, 5), 10);
        let end_min = parseInt(this.HR_CRTN.DATA.END_HR.substring(0, 3), 10) * 60
            + parseInt(this.HR_CRTN.DATA.END_HR.substring(3, 5), 10);
        let lunch_min = parseInt(this.HR_CRTN.DATA.LUNCH_HR.substring(0, 3), 10) * 60
            + parseInt(this.HR_CRTN.DATA.LUNCH_HR.substring(3, 5), 10);

        if( !isNaN(lunch_min) && lunch_min > 60 ) {
          this.showAlertInfo({msg:'점심시간은 최대 1시간 입니다. 1시간으로 초기화 합니다. '} );
          this.HR_CRTN.DATA.LUNCH_HR = "01:00";
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
          this.HR_CRTN.DATA.WHOL_MNT = hours + ":" + minutes; //보여주는 것은 시:분으로
        }
      }
    },

    //////////////////////////////////////////////
    // 부서이동이력
    //////////////////////////////////////////////
    async selectMoveHistory() {
      this.mixin_loadding = true;
      let sURL = '/api/biz/common/select/selectEmpMoveHistory';
      let headParam = {head: {"ns": 'lhcs.system.user.dao.UserMapper'}};
      let postParam = {};
      postParam.SRCH_USER_ID = this.USER_INFO.USER_ID;
      let response = await this.common_postCall(sURL, postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
         this.MOVE_HIST.ITEMS = response.DATA;
      }
      this.mixin_loadding = false;
    },

    setDefaultCuttTask(){
      this.DEFAULT_CUTT_TASK = '';
    },

    //사용가능 업무설정
    async setCuttTask(){
      //공통코드설정
      let codeName = ['TAM'/*시간보정관리*/, 'SHWK_DV'/* 단축근무 구분 */, 'SHWK_TM'/*단축근무시간*/, 'CUTT_TASK_TP'/*바로처리 업무구분*/];
      this.common_code = await this.mixin_common_code_get_all(codeName, 'Y', '-1');

      if(this.USER_INFO.USER_CUTT_TASK){
        this.USE_CUTT_TASK_LIST = [];
        this.CUTT_TASK_LIST = this.mixin_common_code_get(this.common_code,'CUTT_TASK_TP','');
        this.CUTT_TASK_LIST.forEach((task, idx) => {
          this.USER_INFO.USER_CUTT_TASK.split('_##_').forEach((userTask, idx) => {
            if(task.value === userTask.split(',')[0] && userTask.split(',')[1] === 'Y'){
              this.USE_CUTT_TASK_LIST.push(task);
            }
          });
        });
      }

      if(this.USER_INFO.DEFAULT_CUTT_TASK){
        this.DEFAULT_CUTT_TASK = this.USER_INFO.DEFAULT_CUTT_TASK;
      }
    }

  },
  mounted() {

  },
  async created() {

    this.INIT_USER_INFO = JSON.parse(JSON.stringify(this.PROPS_USER_INFO))/*DeepCopy*/;
    this.USER_INFO = this.INIT_USER_INFO;

    //공통코드설정
    let codeName = ['TAM'/*시간보정관리*/, 'SHWK_DV'/* 단축근무 구분 */, 'SHWK_TM'/*단축근무시간*/, 'CUTT_TASK_TP'/*바로처리 업무구분*/];
    this.common_code = await this.mixin_common_code_get_all(codeName);

    // if(this.computedUserCenter === '4'){
    if(this.USER_INFO.CUSTCO_ID === '4'){
      this.setCuttTask();
    }

    let codeNameGloal = ['JOB_CL'/*직무유형(CUSTCO별)*/, 'WT'/*근무유형(CUSTCO별)*/];
    this.common_code_global = await this.mixin_common_code_get_all_global( codeNameGloal );
    this.common_charge_area = await this.mixin_charge_area_combo("선택");  //담당지역 콤보

  },
  computed: {

  },
  watch: {
    selectedTabIndex(newTabIndex, oldTabIndex) {
      console.log("watch::selectedTabIndex : " + this.selectedTabIndex)
      this.checkChangesInfo();
      if( this.selectedTabIndex  === 1 ) {  //단축근무
        this.selectShortWorkList();
      }else if( this.selectedTabIndex  === 2 ) {  //보정이력
        this.selectHrCrtnSchdList();
      }else if( this.selectedTabIndex  === 3 ) {  //부서이동이력
        this.selectMoveHistory();
      }

      this.$eventBus.$emit('detailSaveBtnControl', this.selectedTabIndex);
    },
    PROPS_USER_INFO() {
      console.log( "watch PROPS_USER_INFO" );
      this.INIT_USER_INFO = JSON.parse(JSON.stringify(this.PROPS_USER_INFO))/*DeepCopy*/;
      this.SHORT_WORK.ITEMS = []; //단축근무 초기화
      this.HR_CRTN.ITEMS = [];  //시간보정일정 초기화
      this.MOVE_HIST.ITEMS = [];  //부서이동이력초기화
      this.selectedTabIndex = 0;
      this.isChangesInfo = false;
    },
    INIT_USER_INFO() {
      console.log( "watch INIT_USER_INFO" );
      this.USER_INFO = this.INIT_USER_INFO;
      this.isChangesInfo = false;

      console.log('this.USER_INFO : ', this.USER_INFO);

      // if(this.computedUserCenter === '4'){
      if(this.USER_INFO.CUSTCO_ID === '4'){
        this.setCuttTask();
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>