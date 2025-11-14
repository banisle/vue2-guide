<template>
  <div style="flex: 1 1 calc(55% - 24px)">
    <div class="pl-header">
      <div class="pl-header--title">상담정보{{ detailYn && this.PHN_CUTT_ID ?' (상담번호 : '+this.PHN_CUTT_ID+')': '' }}</div>
      <template v-if="mixin_getCustcoSrvcStat('CNSLT_TOOL_YN')">
        <v-select
          v-if="cuttMode != 'READY'"
          v-model="CUTT_TOOL_CN"
          :items="CUTT_TOOL_LIST"
          item-text="TITLE"
          item-value="CONTENTS"
          return-object
          class="pl-form is-sm ml-4"
          placeholder="상담도구"
          @change="changeCuttToolCn"
          :disabled="detailYn && !detailUpdateYn"
        ></v-select>
      </template>
      <div class="spacing-wrap sp-4 ml-auto justify-end">

        <!-- 통화예약 -->
        <!-- <v-menu
          v-if="cuttMode != 'READY'"
          v-model="modelCallReserve"
          min-width="350"
          bottom
          left
          content-class="pl-menu-drop"
          :close-on-content-click=false
          offset-y
        >
          <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
            <v-btn
              v-bind="menuAttrs"
              v-on="menuOn"
              class="pl-btn is-icon is-sub is-sm">
              <v-icon class="pl-icon20 phone"></v-icon>
              통화예약</v-btn>
          </template>
          !-- 통화예약 v-menu --
          <div class="px-3 py-2">
            !-- header --
            <div class="d-flex">
              <h3 style="font-size: 16px">통화예약</h3>
              <v-btn
                @click="modelCallReserve = false"
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
            !-- form --
            <div class="pl-form-inline-wrap vertical is-mt-s gap-8">
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 60px">
                  고객명
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form is-search type-middle is-auto"
                    placeholder="고객명 입력"
                    value="나고객"
                    @keydown.enter="mixin_testLog('search btn')"
                  >
                  <template v-slot:append>
                    <v-btn
                      @click="mixin_testLog('search btn')"
                      class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 60px">
                  전화번호
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form type-middle is-auto"
                    value="010-1004-1004"
                  ></v-text-field>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 60px">
                  예약일시
                </span>
                <div class="pl-desc">
                  <compo-date-picker
                    DateType="dateTime"
                    :DateProp.sync="date2"
                    :TimesProp.sync='timeStep2'
                    :AmpmProp.sync='timeAmpm'
                    />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 60px">
                  예약내용
                </span>
                <div class="pl-desc">
                  <v-textarea
                    height="90"
                    class="pl-form is-noresize"
                    :spellcheck="false"
                    placeholder="예약내용 입력"
                  />
                </div>
              </div>
            </div>
            <div class="pl-btn-wrap is-mt-m">
              <v-btn
                class="pl-btn is-trans ml-auto"
                @click="modelCallReserve = false">닫기</v-btn>
              <v-btn class="pl-btn">저장</v-btn>
            </div>
          </div>
        </v-menu> -->

        <!-- <v-btn
          v-if="cuttMode != 'READY'"
          class="pl-btn is-icon is-sub is-sm">
          <v-icon class="pl-icon20 userBlackARS"></v-icon>
          배려고객 ARS</v-btn> -->
        <!-- 저장 후 cti 상태 선택
        <v-select
          v-if="cuttMode != 'READY'"
          v-model="modelSave"
          :items="saveDropItems"
          class="pl-form"
          style="flex: 0 0 120px"
          placeholder="선택"
        ></v-select> -->
        <template v-if="!detailYn">
          <v-btn
            class="pl-btn is-sm"
            @click="btnSaveCutt"
            :disabled=" isRunSave || cuttMode == 'SAVED' || cuttMode == 'READY' ">상담저장</v-btn>
          <v-btn
            v-if="cuttMode == 'READY'"
            class="pl-btn is-sm is-esp ml-2"
            @click="handleNewCutt(true)">새 상담</v-btn>
          
          <v-tooltip
            v-if="cuttMode != 'READY' && cuttMode != 'SAVED'"
            content-class="pl-tooltip bottom"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-menu
                min-width="190"
                bottom
                left
                offset-y
                content-class="pl-menu-drop"
                :disabled="cuttMode == 'SAVED' || cuttMoreList.length == 0"
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
                  <li
                    v-for="(item, index) in cuttMoreList"
                    :key="index"
                    @click="item.code == 'newCutt' ? handleNewCutt(true) : handleCancelCutt()"
                  >
                    <v-icon :class="`pl-icon20 ${ item.icon }`"></v-icon>
                    <span class="ml-1">{{ item.title }}</span>
                  </li>
                </ul>
              </v-menu>
            </template>
            <span>상세</span>
          </v-tooltip>
        </template>
        <template v-else>
          <!-- 상담상세 조회 시 상담 수정 버튼 출력-->
          <v-btn
            v-if="detailUpdateYn"
            class="pl-btn is-sm"
            @click="btnUpdateCuttDetail">상담수정</v-btn>
        </template>
      </div>
    </div>
    <div class="is-mt-s">
      <v-form ref="cuttForm">
        <table class="pl-tbl-detail">
          <colgroup>
            <col width="17%" />
            <col width="35%" />
            <col width="17%" />
            <col width="" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  상담채널
                </span>
              </th>
              <td>
                <div class="spacing-wrap sp-4">
                  <!-- 상담사는 IN/OUT 선택 할수없음 -->
                  <v-select
                    v-model="DRWI_TYPE_CD"
                    :items="DRWI_TYPE_LIST"
                    class="pl-form "
                    style="flex: 0 0 92px"
                    placeholder="선택"
                    :disabled="cuttMode == 'READY' || (this.MON_Q_TASK != '' ? true : false) || (cuttMode != 'READY' && !computedIsContainAdminGroup) || detailYn"/>
                  <v-select
                    v-model="RCPT_CHN_CD"
                    :items="RCPT_CHN_LIST"
                    class="pl-form "
                    style="flex: 1 0 92px"
                    placeholder="선택"
                    :rules="validateRules.RCPT_CHN_CD"
                    :disabled="cuttMode == 'READY' || (this.MON_Q_TASK != '' ? true : false) || (detailYn && !detailUpdateYn)"/>
                  <!-- 상담채널 : 카카오톡일때  -->
                  <template v-if="RCPT_CHN_CD === 'CVCK' || RCPT_CHN_CD === 'CVCS' || RCPT_CHN_CD === 'CVCE'">
                    <v-text-field
                      class="pl-form "
                      placeholder="티켓 아이디 입력"
                      v-model="KAKAO_CHT_ID"
                      :disabled="detailYn"
                    ></v-text-field>
                  </template>
                </div>
              </td>
              <th scope="row">
                <span class="pl-label">
                  개인정보수집
                </span>
              </th>
              <td>
                <v-radio-group
                  v-model="PRVC_CLCT_AGRE_YN"
                  row
                  class="pl-radio-group"
                  :disabled="cuttMode == 'READY' || (detailYn && !computedIsContainAdminGroup && !detailUpdateYn)">
                  <v-radio
                    v-for="(item, index) in PRVC_CLCT_AGRE_LIST"
                    :key="'PRVC_CLCT_AGRE_YN-'+PRVC_CLCT_AGRE_LIST[index].value"
                    :label="item.text"
                    :value="item.value"
                    @click="setPrvcClctAgreYn"
                    class="pl-radio">
                  </v-radio>
                  <template v-if="PRVC_CLCT_AGRE_YN === 'N'">
                    <v-icon class="pl-icon20 terms-ani"></v-icon>
                    <strong class="is-txt-red pl-value-txt">미동의 고객</strong>
                  </template>
                </v-radio-group>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  접속정보
                </span>
              </th>
              <td>
                <span class="pl-value-txt">
                  {{ARS_INFO}}
                </span>
              </td>
              <th scope="row">
                <span class="pl-label">
                  인입번호
                </span>
              </th>
              <td>
                <span class="pl-value-txt">
                  {{LAST_PHN_NO}}
                </span>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  상담유형
                </span>
              </th>
              <td colspan="3">
                <div class="spacing-wrap sp-4">
                  <v-autocomplete
                    v-model="SCH_CUTT_TYPE[0]"
                    style="flex: 0 0 120px"
                    class="pl-form is-sm"
                    :items="getChildCuttTypeItems(0, '')"
                    item-text = "CUTT_TYPE_NM"
                    item-value = "CUTT_TYPE_ID"
                    placeholder="선택"
                    v-on:change="changeCuttTypeItems(0)"
                    no-data-text="결과 없음"
                    :rules="validateRules.SCH_CUTT_TYPE_0"
                    :disabled="cuttMode == 'READY' || (detailYn && !detailUpdateYn)"
                  />
                  <v-autocomplete
                    v-model="SCH_CUTT_TYPE[1]"
                    style="flex: 0 0 120px"
                    class="pl-form is-auto"
                    :items="getChildCuttTypeItems(1, SCH_CUTT_TYPE[0])"
                    item-text = "CUTT_TYPE_NM"
                    item-value = "CUTT_TYPE_ID"
                    placeholder="선택"
                    v-on:change="changeCuttTypeItems(1)"
                    no-data-text="결과 없음"
                    :rules="validateRules.SCH_CUTT_TYPE_1"
                    :disabled="cuttMode == 'READY' || (detailYn && !detailUpdateYn)"
                  />
                  <v-autocomplete
                    v-model="SCH_CUTT_TYPE[2]"
                    style="flex: 0 0 200px"
                    class="pl-form is-auto"
                    :items="getChildCuttTypeItems(2, SCH_CUTT_TYPE[1])"
                    item-text = "CUTT_TYPE_NM"
                    item-value = "CUTT_TYPE_ID"
                    placeholder="선택"
                    v-on:change="changeCuttTypeItems(2)"
                    no-data-text="결과 없음"
                    :rules="validateRules.SCH_CUTT_TYPE_2"
                    :disabled="cuttMode == 'READY' || (detailYn && !detailUpdateYn)"
                  />
                  <v-autocomplete
                    v-model="SCH_ALL_CUTT_TYPE"
                    style="width: 190px"
                    class="pl-form is-auto"
                    :items="CUTT_TYPE_ITEMS"
                    v-on:change="changeCuttTypeSch"
                    placeholder="상담유형 검색"
                    clearable
                    no-data-text="결과 없음"
                    :disabled="cuttMode == 'READY' || (detailYn && !detailUpdateYn)"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  처리방법
                </span>
              </th>
              <td colspan="3">
                <!-- test : 라디오 버튼 이벤트 클릭 -->
                <!-- <v-btn color="success" @click="clickPrcsChn(PRCS_CHN_LIST[PRCS_INDEX])">{{PRCS_INDEX}}</v-btn> -->
                <div class="d-flex">
                  <v-radio-group
                    v-model="PRCS_CHN_CD"
                    row
                    class="pl-radio-group"
                    :disabled="cuttMode == 'READY' || detailYn"
                    :rules="validateRules.PRCS_CHN_CD">
                    <v-radio
                      v-for="(item, index) in PRCS_CHN_LIST"
                      :key="'PRCS_CHN_CD-'+PRCS_CHN_LIST[index].value"
                      :label="item.text"
                      :value="item.value"
                      @click="clickPrcsChn(item, index)"
                      class="pl-radio"
                      :disabled="(Number(CTI_CALL_STAT.replace('stat', '')) > 1 ? false : (item.value === 'ISMAPCMC007' || item.value === 'ISMAPCMC010') ? true : false) || detailYn">
                      </v-radio>
                  </v-radio-group>
                </div>
              </td>
            </tr>
            <!-- 처리방법 - 자체사후처리(ISMAPCMC011) 선택 시, 긴급여부, 노트 출력 -->
            <template v-if="!detailYn && PRCS_CHN_CD === 'ISMAPCMC011'">
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    긴급여부
                  </span>
                </th>
                <td>
                  <v-select
                    v-model="PROC_TYPE"
                    :items="PROC_LIST"
                    class="pl-form is-auto"
                    placeholder="선택"
                  ></v-select>
                </td>
                <th scope="row">
                  <span class="pl-label">
                    노트
                  </span>
                </th>
                <td>
                  <v-text-field
                    v-model="SHARE_CNTNT"
                    class="pl-form is-auto"
                    />
                </td>
              </tr>
            </template>
            <!-- 처리방법 - 협업사후처리(ISMAPCMC012) 선택 시, 협업사유, 전달내용 출력 -->
            <template v-if="!detailYn && PRCS_CHN_CD === 'ISMAPCMC012'">
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    협업사유
                  </span>
                </th>
                <td>
                  <v-select
                    v-model="SHARE_RSN_CD"
                    :items="SHARE_RSN_LIST"
                    class="pl-form is-auto"
                    placeholder="선택"
                  ></v-select>
                </td>
                <th scope="row">
                  <span class="pl-label">
                    전달내용
                  </span>
                </th>
                <td>
                  <v-text-field
                    v-model="SHARE_CNTNT"
                    class="pl-form is-auto"
                    />
                </td>
              </tr>
            </template>
            <!-- 처리방법 - 스케줄러이관(ISMAPCMC006) 선택 시, AS 접수번호, 전달내용 출력 -->
            <template v-if="!detailYn && PRCS_CHN_CD === 'ISMAPCMC006'">
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    AS 접수번호
                  </span>
                </th>
                <td>
                  <v-text-field
                    v-model="FLW_ACPT_NO"
                    disabled
                    class="pl-form is-auto"
                    />
                </td>
                <th scope="row">
                  <span class="pl-label">
                    전달내용
                  </span>
                </th>
                <td>
                  <v-text-field
                    v-model="REQ_CNTNT"
                    class="pl-form is-auto"
                    />
                </td>
              </tr>
            </template>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  처리부서
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="PRCS_DEPT_NM"
                  disabled
                  class="pl-form is-auto"
                  :rules="validateRules.PRCS_DEPT_NM"
                  />

              </td>
              <th scope="row">
                <span class="pl-label">
                  처리자
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="PRCR_EMP_NM"
                  disabled
                  class="pl-form is-auto"
                  :rules="validateRules.PRCR_EMP_NM"
                  />
              </td>
            </tr>
            <tr v-if="DRWI_TYPE_CD == 'OUT'">
              <th scope="row">
                <span class="pl-label">
                  접촉대상
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="ICPR_EMP_NM"
                  class="pl-form is-search is-auto"
                  @click="mixin_showDialog('FindAsIcpr')"
                  readonly
                  :disabled="cuttMode == 'READY' || (detailYn && !detailUpdateYn)"
                >
                  <template v-slot:append>
                    <v-btn
                      @click="mixin_showDialog('FindAsIcpr')"
                      class="pl-btn has-icon-only"
                      :disabled="cuttMode == 'READY' || (detailYn && !detailUpdateYn)">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>

              </td>
              <th scope="row">
                <span class="pl-label">
                  소속
                </span>
              </th>
              <td >
                <div class="spacing-wrap sp-4">
                  <v-text-field
                    v-model="ICPR_INFO"
                    disabled
                    class="pl-form is-auto"
                    />

                    <!-- 툴팁 버튼 -->
                    <compo-tooltip-btn
                      TitleProp="접수고객으로 전환"
                      ClassProp="pl-tooltip-btn flex-grow-0"
                      :MinWidthProp="22"
                      :HeightProp="22"
                      IconProp="pl-icon20 refresh"
                      TooltipPositionProp="bottom"
                      @btnClick="refreshIcpr()"
                      :disabled="(detailYn && !detailUpdateYn)"
                    ></compo-tooltip-btn>
                  </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  통화자/관계
                </span>
              </th>
              <td >
                <div class="d-flex spacing-wrap sp-4">
                  <v-text-field
                    v-model="CALLER_NM"
                    class="pl-form "
                    :disabled="cuttMode == 'READY' || (detailYn && !detailUpdateYn)"
                    />
                  <v-select
                    v-model="RELATION_CD"
                    :items="RELATION_LIST"
                    class="pl-form"
                    placeholder="선택"
                    :disabled="cuttMode == 'READY' || (detailYn && !detailUpdateYn)"
                  ></v-select>
                </div>
              </td>
              <th scope="row">
                <div class="d-flex align-center">
                  <span class="pl-label">
                    연락처
                  </span>
                  <div class="pl-btn-wrap ml-auto">
                    
                    <template v-if="DRWI_TYPE_CD == 'OUT'">
                      <compo-tooltip-btn
                        TitleProp="전화 걸기"
                        ClassProp="pl-tooltip-btn ml-auto"
                        IconProp="pl-icon20 td-in-call"
                        TooltipPositionProp="bottom"
                        :MinWidthProp=20
                        :HeightProp=20
                        @btnClick="custPhnNoOutCall(CALLER_TEL)"
                      ></compo-tooltip-btn>
                    </template>
                    <!-- 문자 버튼 -->
                    <compo-tooltip-btn
                      TitleProp="문자 보내기"
                      ClassProp="pl-tooltip-btn ml-auto"
                      IconProp="pl-icon20 td-in-sms"
                      TooltipPositionProp="bottom"
                      :MinWidthProp=22
                      :HeightProp=22
                      @btnClick="showSidePanel('SendSms')"
                      :disabled="cuttMode == 'READY'"
                    ></compo-tooltip-btn>
                  </div>
                </div>
              </th>
              <td >
                <v-text-field
                  v-model="CALLER_TEL"
                  class="pl-form is-auto"
                  :maxlength="13"
                  :disabled="cuttMode == 'READY' || (detailYn && !detailUpdateYn)"
                  :rules="validateRules.CALLER_TEL"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  주소
                </span>
              </th>
              <td colspan="3" >
                <v-text-field
                  v-model="HNO_ADDR"
                  disabled
                  class="pl-form is-auto"
                  />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  상담내용
                </span>
              </th>
              <td colspan="3" class="has-textarea">
                <v-textarea
                  ref="CUTT_CN"
                  v-model="CUTT_CN"
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  :height="CS_INFO.textareaH"
                  :disabled="cuttMode == 'READY' || (detailYn && !detailUpdateYn)"/>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  제보 요청
                </span>
              </th>
              <td >
                <div class="spacing-wrap sp-4 align-center">
                  <v-combobox
                    v-model="modelChkRequest"
                    class="pl-form is-sm"
                    :items="GVIFMT_HSTRY_LIST"
                    multiple
                    :disabled="cuttMode == 'READY' || cuttMode == 'MOD' || detailYn"
                  />
                  <v-text-field
                    v-model="modelChkRequestTime"
                    class="pl-form "
                    style="width:49px"
                    :disabled="(modelChkRequest.length > 0?false:true) || detailYn"
                    />
                    <v-text-field
                    v-model="modelChkReason"
                    class="pl-form "
                    :disabled="(modelChkRequest.length > 0?false:true) || detailYn"
                    />
                </div>
              </td>
              <th scope="row">
                <span class="pl-label" @click="openPhnCvlcptPopup">
                  민원 접수
                </span>
              </th>
              <td>
                <div class="spacing-wrap sp-4 align-center">
                  <div>
                    <v-checkbox
                      v-model="VOC_CHK"
                      class="pl-check flex-grow-0"
                      :disabled="cuttMode == 'READY' || cuttMode == 'MOD' || detailYn"
                    ></v-checkbox>
                  </div>
                  <v-select
                    v-model="VOC_DV"
                    class="pl-form flex-grow-1"
                    :items="VOC_LIST"
                    :disabled="(CVLCPT_RCPT_MNG_ID? true : (cuttMode == 'REG' ? (VOC_CHK ? false : true) : true)) || detailYn"
                    @change="openPhnCvlcptPopup"
                  />
                </div>
              </td>
            </tr>
            <tr v-if="MON_Q_TASK == 'NTBC'">
              <th scope="row">
                <span class="pl-label">
                  통보완료
                </span>
              </th>
              <td colspan="3" class="has-textarea">
                <v-checkbox
                  v-model="CNTCT_NOTICE_YN"
                  class="pl-check ml-4"
                ></v-checkbox>
              </td>
            </tr>
          </tbody>
        </table>
      </v-form>
    </div>
    <!-- //mark: SMS 발송 -->
    <v-dialog
      v-model="dialogSendSMS"
      content-class="dialog-draggable is-lg is-scroll"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="SMS 발송"
        @hide="mixin_hideDialog('SendSMS')"
      >
        <template slot="body">
          <!-- component -->
           <CompoSendSms />

        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('SendSMS')">닫기</v-btn>
          <v-btn class="pl-btn is-icon" >
            <span class="pl-icon20 chat-send-white"></span>
            메시지 보내기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- //mark: AS 접수 스케줄러 이관 -->
    <v-dialog
      v-if="dialogTransSchedule"
      v-model="dialogTransSchedule"
      width="1410"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="AS 접수 스케줄러 이관"
        @hide="mixin_hideDialog('TransSchedule')"
      >
        <template slot="body">
          <!-- component -->
          <CompoTransSchedule
            :DataProp="{HNO: CUST_INFO.HO_ADM_NO, MGOF_CD: CUST_INFO.MGOF_CD, BLDG_ID: CUST_INFO.BLDG_ID}"
            @setTransScheduleInfo="setTransScheduleInfo"
            @closeDialog="mixin_hideDialog('TransSchedule')"
          />
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- dialog: 담당자 정보 -->
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
        >
        <template slot="body">
          <CompoFindAsIcpr
            :DataProp="{ARA_HDQ_CD: LEASE_INFO.ARA_HDQ_CD, MGOF_CD: LEASE_INFO.MGOF_CD, MGOF_NM: LEASE_INFO.MGOF_NM}"
            @setItem="setIcpr"
            @closeDialog="mixin_hideDialog('FindAsIcpr')"
          />
        </template>
      </compo-dialog>
    </v-dialog>


    <!-- side panel : 상담 상세정보-->
    <!-- <v-slide-x-reverse-transition>
      <div v-if=" dialogCsDetail === true "
        style="width: 1100px"
        :style="tempCenterStyle"
        class="pl-quick-layer" >
        <div class="pl-quick-layer-header"><h1>AS 접수 상세 </h1>
          <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick="mixin_openWindow( 'LayoutPopup', '1040', '885', {compo_name : 'CompoAsFlwAcpDetail', callback : 'getPopData', title: 'AS 접수 상세', popData: {histType: 'NEW', ARA_HDQ_CD: MON_Q_ITEM.ARA_HDQ_CD, FLW_RGS_DT: MON_Q_ITEM.FLW_RGS_DT, FLW_ACP_SN: MON_Q_ITEM.FLW_ACP_SN, FLW_DTL_SN: MON_Q_ITEM.FLW_DTL_SN, MGOF_CD: MON_Q_ITEM.MGOF_CD, HNO: MON_Q_ITEM.HNO}})"
          ></compo-tooltip-btn>
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogCsDetail = false"
          ></compo-tooltip-btn>
        </div>
        <CompoAsFlwAcpDetail
          :DataProp="{histType: 'NEW', ARA_HDQ_CD: MON_Q_ITEM.ARA_HDQ_CD, FLW_RGS_DT: MON_Q_ITEM.FLW_RGS_DT, FLW_ACP_SN: MON_Q_ITEM.FLW_ACP_SN, FLW_DTL_SN: MON_Q_ITEM.FLW_DTL_SN, MGOF_CD: MON_Q_ITEM.MGOF_CD, HNO: MON_Q_ITEM.HNO}"
        />
      </div>
    </v-slide-x-reverse-transition> -->

    <!-- dialog: 호전환 -->
    <v-dialog
      v-model="dialogTransCenter"
      content-class="dialog-draggable is-lg"
      hide-overlay
      :width="computedUserCenter !== '5'?computedUserCenter !== '3'?480:550:1000">
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="호전환"
        @hide="mixin_hideDialog('TransCenter')"
        @submit="submitDialog('TransCenter')"
        >
        <template slot="body">
          <CompoTransCenter @setTransPhnNo="setTransPhnNo" @transPhnNoClear="TRANS_EXT_NO = ''"/>
        </template>
        <template slot="footer" v-if="computedUserCenter === '5'"><!--주택지원센터(렌트홈)인 경우만 사용-->
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                <v-icon class="pl-icon20 swap"></v-icon>
                <strong class="ml-1">전환</strong>
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="TRANS_EXT_NO"
                  class="pl-form type-middle ml-1"
                  :readonly="true"
                ></v-text-field>
              </div>
            </div>
          </div>
          <div class="pl-btn-wrap ml-1">
            <v-btn class="pl-btn" @click="tryTrans">전환시도</v-btn>
            <v-btn class="pl-btn is-sub" @click="transExtNo">전환</v-btn>
            <v-btn class="pl-btn is-sub" @click="transCancel">전환 취소</v-btn>
          </div>
          <div class="pl-btn-wrap ml-auto">
            <v-btn
              @click="mixin_hideDialog('TransCenter')"
              class="pl-btn is-trans">닫기</v-btn>
          </div>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: 통화예약 -->
    <v-dialog
      v-model="dialogCallReserve"
      content-class="dialog-draggable"
      hide-overlay
      width=350>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="통화예약"
        @hide="mixin_hideDialog('CallReserve')"
        @submit="submitDialog('CallReserve')"
        >
        <template slot="body">
          <div class="pl-form-inline-wrap vertical is-mt-s gap-8">
            <div class="pl-form-inline">
              <span class="pl-label" style="flex: 0 0 60px">
                고객명
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="RSRV_CUST_NM"
                  class="pl-form type-middle is-auto"
                  placeholder="고객명 입력"
                >
              </v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label" style="flex: 0 0 60px">
                전화번호
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="RSRV_TEL_NO"
                  class="pl-form type-middle is-auto"
                  maxlength="14"
                  hide-spin-buttons
                  type="text"
                  @keyup="setPhoneNo(RSRV_TEL_NO)"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                ></v-text-field>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label" style="flex: 0 0 60px">
                예약일시
              </span>
              <div class="pl-desc">
                <compo-date-picker
                  DateType="dateTime"
                  :DateProp.sync="RSRV_DT"
                  :TimesProp.sync='RSRV_TIME'
                  :AmpmProp.sync='timeAmpm'
                  />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label" style="flex: 0 0 60px">
                예약내용
              </span>
              <div class="pl-desc">
                <v-textarea
                  v-model="RSRV_CNTNT"
                  height="90"
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  placeholder="예약내용 입력"
                />
              </div>
            </div>
            <div class=" is-mt-s pt-3 is-border-sub-top">
              <p class="">※ 통화예약 후 상담저장 버튼을 클릭하셔야 예약이 완료 됩니다.</p>
            </div>
          </div>
        </template>
        <template slot="footer">
          <v-btn class="pl-btn" @click="mixin_hideDialog('CallReserve')">확인</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: 배려고객ARS -->
    <v-dialog
      v-model="dialogBalckArs"
      content-class="dialog-draggable is-esp-border"
      hide-overlay
      persistent
      width=700>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="배려고객ARS"
        @hide="mixin_hideDialog('BalckArs')"
        @submit="submitDialog('BalckArs')"
        >
        <template slot="body">
          <CompoBlackArs :CUST_INFO="CUST_INFO" :CUTT_EXEC_CAUTION_LIST="EXEC_CAUTION_LIST"/>
        </template>
      </compo-dialog>
    </v-dialog>

  </div>
</template>

<script>
import CompoSendSms from '@/components/CompoSendSms.vue'
import CompoTransSchedule from '@/components/CompoTransSchedule.vue'
import CompoFindAsIcpr from '@/components/CompoFindAsIcpr.vue';
import CompoAsFlwAcpDetail from '@/components/CompoAsFlwAcpDetail.vue'
import CompoTransCenter from '@/components/CompoTransCenter.vue';
import CompoBlackArs from '@/components/CompoBlackArs.vue'

import { ipronCallUtil } from "@/store/ipronCallUtil.js";

export default {
  name: "CompoInfoAsCutt", //상담 - 바로처리 상담정보 영역
  components: {
    CompoSendSms,
    CompoTransSchedule,
    CompoFindAsIcpr,
    CompoAsFlwAcpDetail,
    CompoTransCenter,
    CompoBlackArs
  },
  props: {
    RESET_ABLE: {
      type: Boolean,
      default : false
    },
    //상담상세 조회 시 데이터.
    DataProp: {
      type: Object,
      default : null
    },
    //상담상세 조회 여부
    detailYn: {
      type: Boolean,
      default : false
    },
  },
  data() {
    return {
      //고객사 ID : 바로처리 : '4'
      SCH_CUSTCO_ID: "4", //this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,
      MON_Q_ITEM: '', //모니터링에서 조회 시 조회 유형.
      MON_Q_TASK: '',
      MON_Q_CUTT_INFO: {},  //모니터링에서 조회한 상담 정보

      cuttMode: 'READY',//READY, REG, MOD, SAVED
      detailUpdateYn : false, //상세모드에서 상담수정 권한 여부
      transCuttYn: false, //상세모드에서 스케줄러이관 여부
      isRunSave: false,

      //접수부서, 접수자
      RCPT_DEPT_ID: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].DEPT_ID,
      RCPT_DEPT_NM: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].DEPT_NM,
      RCPT_CUSL_ID: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].USER_ID,
      RCPT_CUSL_NM: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].USER_NM,

      //처리부서, 처리자 - 스케줄러이관 시 담당자 지정하면 바뀜.
      PRCS_DEPT_ID: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].DEPT_ID, //처리부서
      PRCS_DEPT_NM: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].DEPT_NM, //처리부서
      PRCR_EMP_NO: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].USER_ID, //처리자 ID
      PRCR_EMP_NM: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].USER_NM, //처리자


      SAVE_AFTER_ACTION: {text: '저장 후 대기', value: 'stat5', evt: 'Ready', active : false, disabled : false},
      // SAVE_IB_AFTER_ACTION: {text: '저장 후 IB후처리', value: 'stat3', evt: 'InAftCall', active : false, disabled : false},
      // SAVE_OB_AFTER_ACTION: {text: '저장 후 OB후처리', value: 'stat4', evt: 'OBAftCall', active : false, disabled : false},
      SAVE_AFTER_ACTION_LIST: [],

      CUTT_TOOL_CN : '', //상담도구 문구구
      CUTT_TOOL_LIST : [], //상담도구


      //고객정보
      CUST_INFO: {},
      //계약정보
      LEASE_INFO: {},
      CTI_INFO : {
        ARS_INFO : ''
        , PHN_NO : ''
        , CALL_ID : ''
        , CALL_TYPE : ''
      }, //CTI 받아온 값

      //상담정보 상세 내역
      //공통코드
      common_code: [],

      PHN_CUTT_ID: '',  //상담 ID
      OUT_PHN_CUTT_ID: '', //아웃바운드 시 최상위상담번호

      forcCuttAble : false,
      CPI_ID : '', //캠페인 ID
      CPI_CNT : false,   //캠페인 시도횟수
      CLBK_ID : '', //콜백 ID
      RSVT_ID : '', //상담예약 ID
      CUTT_BGNG_DT: '',
      CUTT_END_DT: '',
      FORCE_CUTT_BGNG_DT: '',
      FORCE_CUTT_BGNG_TIME: '',
      FORCE_CUTT_END_DT: '',
      FORCE_CUTT_END_TIME: '',

      CALL_ING: false, //상담 중 여부

      DRWI_TYPE_CD: 'IN',//인입유형
      DRWI_TYPE_LIST: [], //인입유형 select items
      RCPT_CHN_CD: 'CVCT', //상담채널
      RCPT_CHN_LIST: [], //상담채널 select items
      KAKAO_CHT_ID:'',       //카카오 티켓ID = CHT_USER_KEY
      CHT_CUTT_ID:'',     //채팅상담ID
      PRVC_CLCT_AGRE_YN: '', //개인정보_수집_동의_여부
      PRVC_CLCT_AGRE_LIST: [ {text: '동의', value: 'Y'}, {text: '미동의', value: 'N'}],//개인정보수집 radio group
      ARS_INFO: '', //접속정보 - PLT_CALL_RCV_TEL.ARS_INFO
      LAST_PHN_NO: '', //인입번호 = 최종_전화_번호
      PRCS_CHN_CD: 'ISMAPCMC001',
      PRCS_INDEX: 0,
      PRCS_CHN_LIST: [
        // {text: '완료', value: 'ISMAPCMC001'},
        // {text: '자체사후처리', value: 'ISMAPCMC011'},
        // {text: '협업사후처리', value: 'ISMAPCMC012'},
        // {text: '스케줄러이관', value: 'ISMAPCMC006'},
        // {text: '호전환', value: 'ISMAPCMC008'},
      ], //처리 방법 radio group
      CNTCT_RSLT_CD: 'ISMACTRT005', //접촉결과 - 콜백일 때만 선택할 수 있도록!!

      //처리 방법 - 자체사후처리 시 긴급여부, 노트 출력
      PROC_TYPE: '',//긴급여부
      PROC_LIST: [],//긴급여부 select items

      //처리 방법 - 협업사후처리 시 협업사유, 전달내용 출력
      SHARE_RSN_CD: '', //협업사유
      SHARE_RSN_LIST: [],//협업사유 SELECT ITEMS
      SHARE_CNTNT: '',//노트, 전달내용

      //처리 방법 - 스케줄러이관 선택 시, AS접수번호, 전달내용 출력
      FLW_ACPT_NO: '',
      FLW_DTL_FULL_SN: '',
      REQ_CNTNT: '',//PLT_CALL_RCV_TRANSFER.REQ_CNTNT(rt.trans_no = pc.rcv_data_no AND pc.rcv_chnl_cd = 'ISMARCMC006' )
      EMER_YN : '',//스케줄러이관 시 긴급 여부, PLT_CALL_RCV_TRANSFER_FLW_INFO.EMER_YN


      CALLER_NM: '', //통화자, TB_AS_CALL_CNSLT.CALLER_NM
      RELATION_CD: '',  //통화관계자 - 관계, TB_AS_CALL_CNSLT.RELATION_CD
      RELATION_LIST: [], //통화관계자 - 관계 select items
      CALLER_TEL: '', //연락처

      HNO_ADDR: '', //주소 - 계약정보 조회 시 주소 정보를 'setCuttLeaseInfo' eventBus로 넘겨줌.
      CUTT_CN: '', //상담내용

      PRCS_STTS_CD: 'ISMACNST009', //처리 상태
      LAST_RSLT_CD: 'ISMACTRT005',//최종_결과_코드 - 콜백일 때만 선택할 수 있도록!!


      //CAUTION_CUST_STTS_CD: '', //배려고객 선택 항목
      //CAUTION_CUST_STTS_LIST: [], //배려고객 목록 - ETC1 == 'N' 인 것만 출력.

      SCH_CUTT_TYPE : new Array(3), //상담유형
      SCH_ALL_CUTT_TYPE : '', //상담유형(검색)

      CUTT_ITEMS : [],
      CUTT_TYPE_ITEMS : [],

      CUTT_BGNG_DT : '', //상담 시작 일시
      CUTT_END_DT : '', //상담 종료 일시
      AFTPRCS_HR_TIMER : '', //후처리 시간 타이머
      DRWI_SE_NM : '', //IVR 명
      REC_FILE_NM : '', //녹취 파일명
      CUTT_RSVT_ID : '', //예약 콜 ID
      CPLMT_CL_YN : 'N', //칭찬콜 여부
      AUTO_CL_YN : 'N', //오토콜 여부
      DSPTCH_NO : '', //대표번호(고객 -> 상담사)
      SRC_CD: 'FW1',
      REL_RSN_CD: "", // 재귀사유
      CHILD_PRCS_STTS_CD: '', //자식 상담 처리 상태 코드

      ICPR_INFO : '/접수고객',
      ICPR_EMP_NO: '',
      ICPR_EMP_NM: '',
      MNTN_USR_DS_CD: '',
      CNTCT_CHNL_CD: '999',
      CNTCT_NOTICE_YN: false, //통보완료
      UNTARGET_FULL_SN: '',
      RCPT_REG_DT: '', //접수시간 (일반 아웃바운드의 경우)
      RCPT_PHN_ID: '',
      RCPT_CLBK_ID: '',
      RCPT_ETC_ID: '',
      RCPT_TRNSF_ID: '',

      // 제보요청
      modelChkRequest: [],
      modelChkRequestTime: '00:00',
      modelChkReason: '',
      GVIFMT_HSTRY_LIST : [],
      GVIFMT_STTS_CD: '',
      // REC_FILE_PSTN_HR : '00:00:00', //제보 요청 시간

      //민원접수 여부
      VOC_CHK: false,
      VOC_LIST: [], //민원 접수 유형 목록
      VOC_DV: '', //민원 접수 유형
      CVLCPT_RCPT_MNG_ID : '', //민원 접수 ID
      PHN_CVLCPT_ID: '',       // 종합 민원 ID

      //배려 고객
      EXEC_CAUTION_LIST : [], //경고 구사 이력
      TEMP_CUST_BLOCK_YN : false, //임시 차단 여부

      

      // 통화예약
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      timeStep2: '05:50',
      timeAmpm: '오후',
      modelCallReserve: false,

      modelSave: '저장 후 대기',
      saveDropItems: [
        '저장 후 대기',
        '저장후 휴식',
        '저장후 식사',
        '저장후 지원',
      ],
      // 상담정보
      CS_INFO: {
        radioGroupSelected2: '완료',

        chn_category01: 'IN',
        chn_category02: 'SNS',
        chn_category03: '카카오톡',
        category01: null,
        category02: null,
        category03: null,
        textarea: `주방 수전사용시 헤드부분 누수`,
        textareaH: 74,
      },
      // 상세
      cuttMoreList: [
        // { title: '새 상담', code: 'newCutt', icon: 'selectPart'},
        
      ],
      // SMS발송
      dialogSendSMS: false,

      // 스케쥴러이관 팝업
      dialogTransSchedule: false,

      //접촉대상 팝업
      dialogFindAsIcpr: false,

      // dialog
      dialogCsDetail : false,

      //호전환 센터 dialog
      dialogTransCenter: false,
      TRANS_EXT_NO : '', //호전환 대상 내선번호

      // 통화예약
      dialogCallReserve: false,
      RSRV_CUST_NM : '', //통화예약 고객명
      RSRV_TEL_NO : '', //통화예약 고객 전화번호
      RSRV_CNTNT : '', //예약내용
      RSRV_DT: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      RSRV_TIME: '09:00',
      timeAmpm: '오후',

      // 배려고객 ARS
      dialogBalckArs: false,

      //상담상세정보
      AS_CUTT_DETAIL_INFO: {},


      // valid : true,
      validateRules: {
        PRCS_CHN_CD: [
          v => !!v || '처리방법은 필수 선택 항목 입니다.',
        ],
        RCPT_CHN_CD: [
          v => !!v || '상담채널은 필수 선택 항목 입니다.',
        ],
        SCH_CUTT_TYPE_0: [
          v => !!v || '상담유형은 필수 선택 항목 입니다.',
        ],
        SCH_CUTT_TYPE_1: [
          v => !!v || '상담유형은 필수 선택 항목 입니다.',
        ],
        SCH_CUTT_TYPE_2: [
          v => !!v || '상담유형은 필수 선택 항목 입니다.',
        ],
        PRCS_DEPT_NM: [
          v => !!v || '처리부서는 필수 항목 입니다.',
        ],
        PRCR_EMP_NM: [
          v => !!v || '처리자는 필수 항목 입니다.',
        ],
        CALLER_TEL: [
          v => !!v || '연락처는 필수 항목 입니다.',
        ],
      },

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.phoneCuttSave, callNo: this.closeMsg}
          , MOD : {alertDialogToggle: true, msg: '저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.phoneCuttSave, callNo: this.closeMsg}
        },
        ALERT : {
          SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
          , PRVC_CLCT_AGRE_YN: {alertDialogToggle: true, msg: '개인정보 수집 여부를 선택하지 않았습니다.', iconClass: 'is-info', type: 'default'}
          , CHECK_CUST_INFO : {alertDialogToggle: true, msg: '고객정보 중 최소 1가지 이상의 정보를 입력해 주세요.', iconClass: 'is-info', type: 'default'}
          , SCHEDULER_FLW_ACPT_NO : {alertDialogToggle: true, msg: "스케쥴러이관 AS접수번호를 선택하세요.", iconClass: 'is-info', type: 'default'}
          , SCHEDULER_REQ_CNTNT : {alertDialogToggle: true, msg: "전달내용을 입력해주세요.", iconClass: 'is-info', type: 'default'}
        },
      },

      TRANS_DATA : {}, //호전환 데이터
    }
  },

  async created() {
    console.log("computedAsCuttAddRowCnt", this.computedAsCuttAddRowCnt);
    //고객 조회 고객정보(CompoInfoCust.vue)에서 고객정보 세팅.
    this.$eventBus.$on("setCuttCustInfo", (custInfo, monQItem = {}) => {
        console.log("setCuttCustInfo", custInfo, monQItem, custInfo.CUST_SAVE_TO_CS_SAVE)
        this.CUST_INFO = custInfo;
        this.MON_Q_ITEM = monQItem;
        if(this.CUST_INFO.CUST_SAVE_TO_CS_SAVE){//고객 정보 저장 이후 상담 저장
          this.cuttRegValid();
        }
        else if(this.MON_Q_ITEM && this.MON_Q_ITEM.MON_Q_TASK != '') {
          this.MON_Q_TASK = this.MON_Q_ITEM.MON_Q_TASK;
          this.getMonQCuttInfo();
        }
      
    });

    //호전환시 상담메모 추가
    this.$eventBus.$on("addTrnsfInfoCuttCn", (item) => {
      this.addTrnsfInfoCuttCn(item);
    });

    //AS 접수 정보로부터 '상담상세내역 - 주소' 정보를 세팅한다.
    this.$eventBus.$on("setCuttLeaseInfo", (asAddr) => {
      //상담 상세에서는 상담 저장 정보로부터 주소를 조회한다.
      if(!this.detailYn) {
        this.setLeaseInfo(asAddr);
      }
    });


    //채팅에서 고객정보 조회 -> 새상담,카카오톡,티켓id 넣어준다
    this.$eventBus.$on("searchCustInfoNewCutt_4", (chtUserKey,chnl,chtCuttId) => {
      this.handleNewCutt();
      if(chnl == 'KAKAO'){
        this.RCPT_CHN_CD = 'CVCK';
      } else if (chnl == 'MO'){
        this.RCPT_CHN_CD = 'CVCS';
      } else if (chnl == 'EMAIL'){
        this.RCPT_CHN_CD = 'CVCE';
      }
      this.KAKAO_CHT_ID = chtUserKey;
      this.CHT_CUTT_ID = chtCuttId;
    });

    //접수 ID 셋
    this.$eventBus.$on("setRcvId", (DATA) => {
      //outbound에서는 rcv_id 안넘어옴.(inbound만 넘어옴)
      if(DATA.RCV_TP === 'RCPT_PHN_ID' && DATA.RCV_ID){ //전화
        this.RCPT_PHN_ID = DATA.RCV_ID;
        this.RCPT_CHN_CD = 'CVCT';
      }else if(DATA.RCV_TP === 'RCPT_CLBK_ID' && DATA.RCV_ID){ //콜백
        this.RCPT_CLBK_ID = DATA.RCV_ID;
        this.RCPT_CHN_CD = 'CVCT';
      }else if(DATA.RCV_TP === 'RCPT_ETC_ID' && DATA.RCV_ID){ //기타
        this.RCPT_ETC_ID = DATA.RCV_ID;
        this.RCPT_CHN_CD = 'CVCZ';
      }
    });

    this.$eventBus.$on('chatMessagePaste' , (type, message) => {
      //상담중 상태에서만 붙여넣기 처리.
      if(this.cuttMode == 'READY') {
        this.showToastInfo({msg : '상담 중일 때 사용가능합니다.'})
      } else {
        message = message.replace(/(?:\r\n|\r|\n)/g, "\n")
        if(type === "NEW") {
          //새로 붙이기
          this.CUTT_CN = message;
        } else {
          //이어 붙이기
          this.CUTT_CN += message;
        }
        this.setFocus('CUTT_CN');
      }
    })

    //인바운드 혹은 아웃바운드 전화 받은 경우 상담 상태로 변경
    this.$eventBus.$on("setForceCuttIngFlag", (flag) => {
      this.handleNewCutt();
    });

    this.$eventBus.$on("CUST_CAUTION_HIST", (EXEC_CAUTION_LIST) => {
      this.EXEC_CAUTION_LIST = EXEC_CAUTION_LIST;
    });

    this.$eventBus.$on("pasteCustPhnNo", (custPhnNo) => {
      this.CALLER_TEL = custPhnNo;
    });

    //배려고객ARS 닫기
    this.$eventBus.$on("CloseBalckArs", () => {
      this.mixin_hideDialog('BalckArs');
      this.TEMP_CUST_BLOCK_YN = true;
    });

    //전화걸기(OUTBOUND) 클릭 이벤트
    this.$eventBus.$on("setCallId", (data) => {
      //아웃바운드일때에만 새상담 생성.
      if(data.CALL_TYPE === 3) {
        this.handleNewCutt();
        setTimeout(() => {
          this.CTI_INFO = {
            CALL_ID : data.CALL_ID ? data.CALL_ID : '' //CALL_ID
            , CALL_TYPE : data.CALL_TYPE ? data.CALL_TYPE : '' //CALL_TYPE
          };
          this.$store.dispatch("statusStore/AC_CUTT_ING", true);
          //아웃바운드 전화는 무조건 OUT으로 잡는다.
          this.DRWI_TYPE_CD = "OUT";
        }, 1000);
      }
    });

    //처리방법 배려고객 ARS 비활성화 처리
    this.$eventBus.$on("setCuttPrcsList", () => {
      this.PRCS_CHN_LIST.forEach((item, idx) => {
        if(item.value === 'ISMAPCMC010'){
          item.disabled = true;
        }
      });
    });

    //STT 추천 상담 유형 및 상담내용
    this.$eventBus.$on("setSttAutoCuttInfo", (autoData) => {
      if( !this.mixin_isEmpty(autoData.ALL_CUTT_TYPE) ) {
        this.SCH_CUTT_TYPE = autoData.ALL_CUTT_TYPE;
        this.SCH_ALL_CUTT_TYPE = autoData.ALL_CUTT_TYPE.join(",");

        setTimeout(() => {
          this.$eventBus.$emit('setCuttTypeTxt');
        }, 500);
      }
      if( !this.mixin_isEmpty(autoData.CUTT_CN) ) {
        this.CUTT_CN = this.CUTT_CN + '\n' + autoData.CUTT_CN;
      }
    });


    //상담문구
    this.getCuttToolList();


    this.getCuttTypeList();//상담 유형
    //공통코드설정
    let codeName = [
      'CALL_TP', //인입유형
      'CVC', //상담채널
      'PCMC', //상담유형
      'T120', //통화관계자 - 관계
      'PPT', //긴급여부
      'CTC', //협업사유
      'RECM', //제보유형
      'VOC_DV'  //민원유형
      //'BLR', //배려고객
    ];
    
    //상담상세에서는 타센터상담이력에서 호출되는 케이스가 있어 SCH_CUSTCO_ID 로 조회하기 위해 nocache 쿼리를 사용하지 않는다.
    // if(this.detailYn) {
    //   codeName = [
    //   'CALL_TP_NOCACHE', //인입유형
    //   'CVC_NOCACHE', //상담채널
    //   'PCMC_NOCACHE', //상담유형
    //   'T120_NOCACHE', //통화관계자 - 관계
    //   'PPT_NOCACHE', //긴급여부
    //   'CTC_NOCACHE', //협업사유
    //   'RECM_NOCACHE', //제보유형
    //   'VOC_DV_NOCACHE'  //민원유형
    //   //'BLR', //배려고객
    // ];
    // }
    this.common_code = await this.mixin_common_code_get_all_global(codeName, 'Y');
    this.DRWI_TYPE_LIST = this.mixin_common_code_get_global(this.common_code, 'CALL_TP', this.SCH_CUSTCO_ID, ''); //인입유형 select items
    this.RCPT_CHN_LIST = this.mixin_common_code_get_global(this.common_code, 'CVC', this.SCH_CUSTCO_ID, ''); //상담채널 select items
    this.PRCS_CHN_LIST = this.mixin_common_code_get_global(this.common_code, 'PCMC', this.SCH_CUSTCO_ID, ''); //처리방법 radio group
    this.RELATION_LIST = this.mixin_common_code_get_global(this.common_code, 'T120', this.SCH_CUSTCO_ID, ''); //관계 select items
    this.PROC_LIST = this.mixin_common_code_get_global(this.common_code, 'PPT', this.SCH_CUSTCO_ID, ''); //긴급여부 select items
    this.SHARE_RSN_LIST = this.mixin_common_code_get_global(this.common_code, 'CTC', this.SCH_CUSTCO_ID, ''); //협업사유 select items
    this.GVIFMT_HSTRY_LIST = this.mixin_common_code_get_global(this.common_code, 'RECM', this.SCH_CUSTCO_ID, '')
    //this.CAUTION_CUST_STTS_LIST = this.mixin_common_code_get(this.common_code, 'BLR', ''); //배려고객 select items

    let vocList = this.mixin_common_code_get_global(this.common_code, 'VOC_DV', this.SCH_CUSTCO_ID, '');

    this.VOC_LIST = [];
    vocList.forEach((item, idx) => {
      if(item.cd_vl1 === 'Y') this.VOC_LIST.push({text:item.text, value: item.value});
    });


    //상담상세 조회 여부
    console.log("this.detailYn", this.detailYn)
    if(this.detailYn) {
      this.setAsDetail();
    }

  },
  mounted() {
  },
  computed: {
  },
  watch: {
    CUST_INFO() {
      this.RSRV_CUST_NM = this.CUST_INFO.CUST_NM;
      this.RSRV_TEL_NO = this.CUST_INFO.CUST_PHN_NO;
      if(!this.CUST_INFO.CUST_SAVE_TO_CS_SAVE){//고객 정보 저장 이후 상담 저장
        this.phnCuttFormReset();
      }
    },
    RESET_ABLE() {
      this.CUST_INFO = {};
      this.LEASE_INFO = {};
      this.HNO_ADDR = '';
      this.handleCancelCutt();
    },
    SAVE_AFTER_ACTION() {
      console.log('SAVE_AFTER_ACTION : ', this.SAVE_AFTER_ACTION);
    },
    CTI_CALL_STAT() {
      console.log('CTI_CALL_STAT : ', this.CTI_CALL_STAT);
    },
    //상담상세정보 변경(목록에서 다른 row 더블 클릭 시)
    DataProp() {
      this.setAsDetail();
    },

    //제보요청 시간
    modelChkRequest(){
      if(!this.detailYn) {
        if(this.modelChkRequest.length > 0){
          if(this.CUTT_TIME !== '00:00:00'){
            let HHMMSS = this.mixin_seconds_toHHMMSS(this.mixin_timeToSec(this.CUTT_TIME));
            if(Number(HHMMSS.split(':')[0]) > 0){
              let sMM = (Number(HHMMSS.split(':')[0]) * 60) + HHMMSS.split(':')[1];
              this.modelChkRequestTime = sMM+':'+HHMMSS.split(':')[2];
            }else{
              this.modelChkRequestTime = HHMMSS.split(':')[1]+':'+HHMMSS.split(':')[2];
            }
          }else{
            this.modelChkRequestTime = '00:00';
          }
        }else if(this.modelChkRequest.length === 0){
          this.modelChkRequestTime = '00:00';
          this.modelChkReason = '';
        }
      }
      
    },
    DRWI_TYPE_CD() {
      this.calcAsCuttAddRowCnt()
    },
    PRCS_CHN_CD() {
      this.calcAsCuttAddRowCnt()
    },
    MON_Q_TASK() {
      this.calcAsCuttAddRowCnt()
    },

    VOC_CHK(){
      if(!this.VOC_CHK){
        this.VOC_DV = '';
      }
    },
    CALLER_NM() {
      //AS접수 접수자명 동기화
      console.log("watch CALLER_NM", this.CALLER_NM)
      this.$eventBus.$emit("setFlwAcpCvprNm", this.CALLER_NM)
    },
    CALLER_TEL() {
      //AS접수 연락처 동기화
      console.log("watch CALLER_TEL", this.CALLER_TEL)
      this.$eventBus.$emit("setFlwAcpMblNo", this.CALLER_TEL)
    }
    
  },
  methods: {
    //AS 접수 정보로부터 '상담상세내역 - 주소' 정보를 세팅한다.(eventBus - setLeaseInfo)
    setLeaseInfo(leaseInfo) {
      this.LEASE_INFO = leaseInfo;
      if(this.LEASE_INFO && this.LEASE_INFO.MGOF_NM) {
        this.HNO_ADDR = this.LEASE_INFO.MGOF_NM + " " + this.LEASE_INFO.BLDG_NO + "동 " + this.LEASE_INFO.HS_NO + "호";
      } else {
        this.HNO_ADDR = '';
      }

    },

    //개인정보 동의 여부를 고객정보 컴포넌트에 전달
    setPrvcClctAgreYn() {
      this.$eventBus.$emit('setAgreeYn', this.PRVC_CLCT_AGRE_YN);
      if(this.PRVC_CLCT_AGRE_YN == 'Y') {
        if(this.CUTT_CN.indexOf('[개인정보동의]') == -1) {
          this.CUTT_CN = '[개인정보동의]\n' + this.CUTT_CN;
        }
      } else {
        this.CUTT_CN = this.CUTT_CN.replace('[개인정보동의]\n','')
      }
    },

    //새 상담
    handleNewCutt(forceYn = false) {
      //이미 상담중일 때에는 return 
      //전화 시 eventBus로 여러번 호출되어 mon_q_task 값 사라지는 현상땜에 추가함.
      if(this.cuttMode == "REG" || this.cuttMode == "MOD") {
        return
      }
      const ctiNum = Number(this.CTI_CALL_STAT.replace('stat', ''));
      console.log("ctiNum", ctiNum)
      if(ctiNum > 1 && ctiNum === 5 && ctiNum !== 6){
        this.showAlertInfo({msg : 'CTI 대기중인 경우 사용 할 수 없습니다.'});
        return;
      }else{
        if(this.mixin_isEmpty(this.MON_Q_TASK)) {
          this.$store.dispatch("statusStore/AC_CUTT_ING", true);
        }
        let mode = "REG";
        if(!this.mixin_isEmpty(this.PHN_CUTT_ID)) {
          mode = 'MOD';
        }
        if(!this.mixin_isEmpty(this.MON_Q_TASK) && (this.MON_Q_TASK == "STMT" || this.MON_Q_TASK == "TTMT" || this.MON_Q_TASK == "NTBC" ||  this.MON_Q_TASK == "OB")) {
          mode = 'REG';
        }
        this.cuttMode = mode;
        this.cuttMoreList = [
          { title: '상담 취소', code: 'cancelCutt', icon: 'in-erase'},
        ],
        this.phnCuttFormReset();
        this.forcCuttCreateFrom(forceYn); //상담 시간 초기화
      }
      console.log("handleNewCutt", this.cuttMode, this.PHN_CUTT_ID)
    },

    //상담 취소
    handleCancelCutt() {
      this.$eventBus.$emit('setSaveEvtReset');
      this.$store.dispatch("statusStore/AC_CUTT_ING", false);
      this.cuttMode = 'READY';
      this.isRunSave = false;
      this.cuttMoreList = [],
      this.phnCuttFormReset();
      this.reSetCuttTime();
      this.MON_Q_ITEM = {};
      this.MON_Q_TASK = '';
      this.closeAlert();
    },


    async forcCuttCreateFrom(forcYn) {
      this.forcCuttAble = forcYn;
      if(forcYn){
        let svrDate = await this.mixin_getSvrDate("YYYY-MM-DD HH24:MI:SS");

        let yyyymmdd = svrDate.split(' ')[0];
        let time = svrDate.split(' ')[1];
        let date = new Date(yyyymmdd.split('-')[0].toString(), (Number(yyyymmdd.split('-')[1])-1).toString(), yyyymmdd.split('-')[2].toString(), time.split(':')[0].toString(), time.split(':')[1].toString(), time.split(':')[2].toString());

        this.FORCE_CUTT_BGNG_DT = '' + date.getFullYear() + '-' + this.mixin_rpad((date.getMonth()+1).toString(), 2, '0') + '-' + this.mixin_rpad(date.getDate(), 2, '0');
        this.FORCE_CUTT_BGNG_TIME = '' + this.mixin_rpad(date.getHours(), 2, '0') + ':' + this.mixin_rpad(date.getMinutes(), 2, '0') + ':' + this.mixin_rpad(date.getSeconds(), 2, '0');
        // this.FORCE_CUTT_BGNG_TIME = '' + this.mixin_rpad(date.getHours(), 2, '0') + ':' + this.mixin_rpad(date.getMinutes(), 2, '0');

        date.setSeconds(date.getSeconds() + 1);
        this.FORCE_CUTT_END_DT = '' + date.getFullYear() + '-' + this.mixin_rpad((date.getMonth()+1).toString(), 2, '0') + '-' + this.mixin_rpad(date.getDate(), 2, '0');
        this.FORCE_CUTT_END_TIME = '' + this.mixin_rpad(date.getHours(), 2, '0') + ':' + this.mixin_rpad(date.getMinutes(), 2, '0') + ':' + this.mixin_rpad(date.getSeconds(), 2, '0');
        // this.FORCE_CUTT_END_TIME = '' + this.mixin_rpad(date.getHours(), 2, '0') + ':' + this.mixin_rpad(date.getMinutes(), 2, '0');
      }else{
        this.FORCE_CUTT_BGNG_DT = '';
        this.FORCE_CUTT_BGNG_TIME = '';
        this.FORCE_CUTT_END_DT = '';
        this.FORCE_CUTT_END_TIME = '';
      }
    },

    //상담 초기화
    cuttReset() {
      // if(this.forcCuttAble){
      //   this.$eventBus.$emit("busCuttEvt", {evt : 'cuttForceSave'}); //상단 CTI 버튼 제어
      // }else{
      //   this.$eventBus.$emit("busCuttEvt", {evt : 'cuttSave'}); //상단 CTI 버튼 제어
      // }

      this.forcCuttAble = false; //강제 생성 초기화
      this.CUTT_RSVT_ID = ''; //예약 콜 ID 초기화
      this.PHN_CUTT_ID = ''; //전화 상담 ID 초기화
      this.OUT_PHN_CUTT_ID = '';
      this.CHT_CUTT_ID = '';
      this.KAKAO_CHT_ID = '';
      this.CPI_ID = ''; //캠페인 ID 초기화
      this.CPI_CNT = false;
      this.CLBK_ID = ''; //콜백 ID 초기화
      this.RSVT_ID = ''; //상담예약 ID 초기화

      //상담 저장 후 고객 유지 여부
      // if(this.$store.getters["userConfigStore/GE_SAVE_AFTR_CUST_MAINTAIN"]){ //유지
      //   this.$refs.MainchatAllLog.getSearch('cutt', ''); //통합 접촉 이력 조회
      //   if(this.mixin_getCustcoSrvcStat('AS_ALTMNT')){
      //     this.$refs.MainchatAllLog.getSearch('vstRsvt', ''); //방문 예약 이력 조회
      //   }
      // }else{ //고객 초기화
      //   this.custReset(); //고객정보 초기화
      // }

      this.phnCuttFormReset(); //상담내용 등록 폼 초기화

      // this.getExpsnAttrList(); //확장속성 초기화

      this.CALL_ING = false; //상담 종료

      // eventBus.getCtiBtnStat('getCtiBtnStat'); //CTI 버튼 상태 가져오기

      // this.cuttTypeIntgeSchVal = ''; //상담 유형 검색 초기화

      // this.$refs.mydesk.getMyDeskData(); //MyDesk 리로드

      // this.ctiCuttTimerEnd(); //후처리 시간 타이머 초기화
    },

    //상담 시간 초기화
    reSetCuttTime() {
      // this.CHAT_TOP_INFO.status = 'main'; //상담대기
      this.CUTT_BGNG_DT = ''; //상담 시작 일시 초기화
      this.CUTT_END_DT = ''; //상담 종료 일시 초기화

      this.forcCuttCreateFrom(this.forcCuttAble); //상담 시간 초기화

    },

    //고객정보 초기화
    custReset() {
      //고객 정보 초기화
      this.CUST_INFO.CUST_ID = -1;
      this.CUST_INFO.CUST_NM = '성명미상';
      this.CUST_INFO.CUST_PHN_NO = '';
      this.CUST_INFO.CAUTION_CUST_YN = 'N';
      this.CUST_INFO.portrait = require('@/assets/img/@profile_customer.png');

      //콜 데이터 초기화
      const OUT_CALL_DATA = this.OUT_CALL_DATA;
      Object.keys(OUT_CALL_DATA).forEach(function(key) {
        OUT_CALL_DATA[key] = '';
      });
      this.OUT_CALL_DATA = OUT_CALL_DATA;
      this.DSPTCH_NO = ''; //대표번호 초기화
    },

    //전화 상담 Form 초기화
    phnCuttFormReset(){
      this.$store.commit("statusStore/MU_AS_SAVED_PHN_CUTT_ID", '');

      this.$refs.cuttForm.resetValidation()
      this.reSetCuttTime(); //상담 시간 초기화

      this.REC_FILE_NM = ''; //녹취 파일명 초기화
      // if(this.CUST_INFO.CUST_ID === -1) this.CL_TYPE_CD = 'IN'; //상담 채널

      this.PHN_CUTT_ID = '';
      this.OUT_PHN_CUTT_ID = '';
      this.CHT_CUTT_ID = '';
      this.KAKAO_CHT_ID = '';

      this.DRWI_SE_NM = ''; //IVR 명
      this.CPLMT_CL_YN = 'N'; //칭찬콜 여부 초기화
      this.AUTO_CL_YN = 'N'; //오토콜 여부 초기화

      this.DRWI_TYPE_CD = 'IN';
      //아래 CALL_DATA 없을 때 초기화.
      //this.RCPT_CHN_CD = 'CVCT';
      this.PRVC_CLCT_AGRE_YN = '';
      this.ARS_INFO = '';
      this.LAST_PHN_NO = '';
      this.PRCS_CHN_CD = 'ISMAPCMC001';
      this.CNTCT_RSLT_CD = 'ISMACTRT005';
      this.PROC_TYPE = '';
      this.PRCS_STTS_CD = '';
      this.SHARE_RSN_CD = '';
      this.SHARE_CNTNT = '';
      this.FLW_ACPT_NO = '';
      this.FLW_DTL_FULL_SN = '';
      this.REQ_CNTNT = '';
      this.EMER_YN = '';
      this.CALLER_NM = '';
      this.RELATION_CD = '';
      this.CALLER_TEL = '';
      this.SCH_CUTT_TYPE = new Array(3);
      this.SCH_ALL_CUTT_TYPE = '';
      this.CUTT_CN = '';
      this.PRCS_STTS_CD = 'ISMACNST009';
      this.LAST_RSLT_CD = 'ISMACTRT005';
      this.PRCS_DEPT_ID = this.RCPT_DEPT_ID; //처리부서
      this.PRCS_DEPT_NM = this.RCPT_DEPT_NM; //처리부서
      this.PRCR_EMP_NO = this.RCPT_CUSL_ID; //처리자 ID
      this.PRCR_EMP_NM = this.RCPT_CUSL_NM; //처리자
      this.ICPR_INFO = '/접수고객';
      this.ICPR_EMP_NO = '';
      this.ICPR_EMP_NM = '';
      this.MNTN_USR_DS_CD = '';
      this.CNTCT_CHNL_CD = '999';
      this.CNTCT_NOTICE_YN = false;
      this.UNTARGET_FULL_SN = '';
      this.RCPT_REG_DT = ''; //접수시간 (일반 아웃바운드의 경우)
      //아래 CALL_DATA 없을 때 초기화.
      // this.RCPT_PHN_ID = '';
      // this.RCPT_CLBK_ID = '';
      // this.RCPT_ETC_ID = '';
      this.RCPT_TRNSF_ID = '';

      //제보요청
      this.modelChkRequest = [];
      this.modelChkRequestTime = '00:00';
      this.modelChkReason = '';

      //민원접수 여부
      this.VOC_CHK = false;
      this.VOC_DV = ''; //민원 접수 유형
      this.CVLCPT_RCPT_MNG_ID = ''; //민원 접수 ID
      this.PHN_CVLCPT_ID = '';      //종합 민원 ID

      this.EXEC_CAUTION_LIST = []; //경고 구사 이력
      this.TEMP_CUST_BLOCK_YN = false; //임시 차단 여부

      this.CTI_INFO = {
        ARS_INFO : ''
        , PHN_NO : ''
        , CALL_ID : ''
        , CALL_TYPE : ''
      }; //CTI 받아온 값

      if(this.CUST_INFO.CALL_DATA) {
        this.CTI_INFO = {
          ARS_INFO : this.CUST_INFO.CALL_DATA.extensiondata ? this.CUST_INFO.CALL_DATA.extensiondata.UEI20[0] : '' //접속정보
          , PHN_NO : this.CUST_INFO.CALL_DATA.ani //인입번호
          , CALL_ID : this.CUST_INFO.CALL_DATA.CALL_ID ? this.CUST_INFO.CALL_DATA.CALL_ID : '' //CALL_ID
          , CALL_TYPE : this.CUST_INFO.CALL_DATA.CALL_TYPE ? this.CUST_INFO.CALL_DATA.CALL_TYPE : '' //CALL_TYPE
        };
        this.LAST_PHN_NO = this.CTI_INFO.PHN_NO;
        this.CALLER_TEL = this.CTI_INFO.PHN_NO;
        if(this.CTI_INFO.CALL_TYPE) this.DRWI_TYPE_CD = this.CTI_INFO.CALL_TYPE === 2 ? 'IN':'OUT';
        this.PRVC_CLCT_AGRE_YN = this.CUST_INFO.CALL_DATA.extensiondata ? this.CUST_INFO.CALL_DATA.extensiondata.UEI22[0] : 'N'; //개인정보수집 동의여부
        if(this.PRVC_CLCT_AGRE_YN == "Y") {
          this.CUTT_CN = "[개인정보동의]";
        }
        this.ARS_INFO = this.CTI_INFO.ARS_INFO;
        if(this.CUST_INFO.CALL_DATA.CVLCPT_RCPT_MNG_ID) this.CVLCPT_RCPT_MNG_ID = this.CUST_INFO.CALL_DATA.CVLCPT_RCPT_MNG_ID; //민원 접수 ID
        //1회 세팅 후 지운다.(상담 취소 시 CALL_DATA 있을 시 이전 정보를 세팅해버림.)
        this.CUST_INFO.CALL_DATA = null;
      } else {
        //CALL_DATA 가 있으면 접수 번호를 초기화 하지 않는다.
        this.RCPT_CHN_CD = 'CVCT';
        this.RCPT_PHN_ID = '';
        this.RCPT_CLBK_ID = '';
        this.RCPT_ETC_ID = '';
      }

      // this.cuttTypeIntgeSchVal = ''; //상담유형 검색 초기화

      // this.closeMsg(); //confirm 창 닫기
    },

    initCutt() {

    },

    //상담유형 목록 조회
    async getCuttTypeList() {
      let sUrl = '/api/biz/common/select/cuttTypeList';
      let postParam = {
        SCH_CUSTCO_ID: this.SCH_CUSTCO_ID
      }

      let headParam = {
        head : {
          ns: "lhcs.phone.cutt.dao.PhoneCuttMapper",
          sn: "cuttTypeList"
        }
      }

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.CUTT_ITEMS = response.DATA;

        let arrCuttItems = await this.mixin_makeOrgTreeData(response.DATA);

        if(arrCuttItems) this.cuttTypeIntgeSchData(arrCuttItems); //상담 유형 검색 데이터 Set
      }
    },

    //상담 유형 검색 Data Set
    cuttTypeIntgeSchData(cuttType) {
      if(cuttType){
        cuttType.forEach(item => {
          if (item.UP_KEY) {
            let reFullPath = '';
            item.FULL_PATH.split('>').forEach((txt, idx) => {if(idx>0) reFullPath += ((idx>1)?'>':'')+txt});
            let reFullVal = '';
            item.FULL_CUTT_TYPE_ID.split(',').forEach((val, idx) => {if(idx>0) reFullVal += ((idx>1)?',':'')+val});
            this.CUTT_TYPE_ITEMS.push({ value: reFullVal, text: reFullPath, LVL: item.LVL });
          }
          if (item.children) {
            this.cuttTypeIntgeSchData(item.children);
          }
        });
      }
    },

    //상담유형 하위 item 가져오기
    getChildCuttTypeItems(idx, parentItem) {
      let arrCuttType = [];

      if(idx === 0){
        if(this.CUTT_ITEMS.length > 0){
          parentItem = this.CUTT_ITEMS[0].CUTT_TYPE_ID;
          this.CUTT_ITEMS.map(function(row){
            if(row.UP_CUTT_TYPE_ID === parentItem)
              if(row) arrCuttType.push(row);
          });
        }
      }else{
        if(parentItem){
          this.CUTT_ITEMS.map(function(row){
            if(row.UP_CUTT_TYPE_ID === parentItem)
              if(row) arrCuttType.push(row);
          });
        }
      }

      return arrCuttType || [];
    },

    //상담유형 변경 이벤트
    changeCuttTypeItems(idx){
      this.SCH_CUTT_TYPE.forEach((cutt, seq) => {
        if(seq > idx) this.SCH_CUTT_TYPE[seq] = ''; //초기화
      });

      let selCuttType = '';
      for(let k=0; k<this.SCH_CUTT_TYPE.length; k++){
        if(k > idx) this.SCH_CUTT_TYPE[k] = '';//초기화

        if(this.SCH_CUTT_TYPE[k]) selCuttType += (selCuttType?',':'') + this.SCH_CUTT_TYPE[k];
      }

      this.SCH_ALL_CUTT_TYPE = selCuttType;
    },

    //상담유형 검색 데이터 변경 이벤트
    changeCuttTypeSch(){
      this.SCH_CUTT_TYPE.forEach((cutt, idx) => {
        this.SCH_CUTT_TYPE[idx] = ''; //초기화
      });

      if(this.SCH_ALL_CUTT_TYPE){
        this.SCH_ALL_CUTT_TYPE.split(',').forEach((cuttType, idx) => {
          for(let k=0; k<this.SCH_CUTT_TYPE.length; k++){
            if(k === idx){
              this.SCH_CUTT_TYPE[k] = cuttType;
            }
          }
        });
      }
    },

    //처리방법 변경 시 이벤트
    clickPrcsChn(item, index) {
      this.PRCS_INDEX = index
      //처리방법 관련 항목 값 초기화
      this.PROC_TYPE = '';
      this.SHARE_CNTNT = '';
      this.SHARE_RSN_CD = '';
      this.FLW_ACPT_NO = '';
      this.REQ_CNTNT = '';
      this.REL_RSN_CD = ''; // 재귀사유
      this.CHILD_PRCS_STTS_CD = ''; //자식 상담 처리 상태 코드

      this.PRCS_DEPT_ID = this.RCPT_DEPT_ID; //처리부서
      this.PRCS_DEPT_NM = this.RCPT_DEPT_NM; //처리부서
      this.PRCR_EMP_NO = this.RCPT_CUSL_ID; //처리자 ID
      this.PRCR_EMP_NM = this.RCPT_CUSL_NM; //처리자

      if(item.value !== 'ISMAPCMC007'){ //통화예약이 아닌 경우
        this.RSRV_CUST_NM = this.CUST_INFO.CUST_NM;
        this.RSRV_TEL_NO = this.CUST_INFO.CUST_PHN_NO;
        this.RSRV_DT = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
        this.RSRV_TIME = '09:00';
        this.timeAmpm = '오후';
        this.RSRV_CNTNT = '';
        this.RSRV_YN = 'N';

      }

      //처리방법별 처리 상태 코드 설정 - PRCS_STTS_CD
      //자체사후처리, 협업사후처리 시, TB_CALL_CNSLT_PRC_SHARE.SHARE_TYPE 설정을 위한 PRCS_STTS_CD 값 세팅.
      if(item.value === 'ISMAPCMC001' || item.value === 'ISMAPCMC008') {//완료, 호전환 시
        this.PRCS_STTS_CD = 'ISMACNST009';
      } else if(item.value === 'ISMAPCMC011') {//자체사후처리 시
        this.PRCS_STTS_CD = 'ISMACNST031';
      } else if(item.value === 'ISMAPCMC012') {//협업사후처리 시
        this.PRCS_STTS_CD = 'ISMACNST041';
      } else if(item.value === 'ISMAPCMC006') {//스케줄러이관 시
        this.PRCS_STTS_CD = 'ISMACNST003';
        this.REL_RSN_CD = "ISMARCRN001"; // 재귀사유-이첩.
        this.CHILD_PRCS_STTS_CD = "ISMACNST016"; // 스케쥴러이관미확인.
      } else if(item.value === 'ISMAPCMC007') {//통화예약 시
        this.PRCS_STTS_CD = 'ISMACNST006';//예약완료
        this.REL_RSN_CD = "ISMARCRN002"; // 예약
        this.CHILD_PRCS_STTS_CD = "ISMACNST007"; // 통화예약
      } else {
        this.PRCS_STTS_CD =  "ISMACNST009"; //처리 상태 코드 (상담완료)
      }

      //처리방법 - 스케줄러 이관(ISMAPCMC006) 선택 시, AS접수 스케줄러 이관 다이얼로그 오픈
      if(item.value === 'ISMAPCMC006') {
        this.dialogTransSchedule = true;
      }
      //호전환 시, 다이얼로그 오픈
      else if(item.value === 'ISMAPCMC008') {
        this.$eventBus.$emit('reSetTrnsfInfo'); //호전환 초기화
        this.dialogTransCenter = true;
      }
      //통화예약 시, 다이얼로그 오픈
      else if(item.value === 'ISMAPCMC007') {
        this.dialogCallReserve = true;
      }
      //배려고객ARS 시, 다이얼로그 오픈
      else if(item.value === 'ISMAPCMC010') {
        this.$eventBus.$emit('reSetCautionCustInfo'); //배려고객 초기화
        this.dialogBalckArs = true;
      }
    },


    //HJH AS접수 스케줄러이관 다이얼로그에서 스케줄러이관 시 호출
	  setTransScheduleInfo(tgtEmpNo, tgtEmpNm, tgtDeptId, tgtDeptNm, selectedItems, emerYn) {
      let flwAcptNo = [];
      let flwDtlFullSn = [];

      selectedItems.map(item => {
        flwAcptNo.push(item.FLW_RGS_DT.substring(2,8) + "-" + item.ARA_HDQ_CD + "-" + item.FLW_ACP_DTL_SN.padStart(5, '0'));
        flwDtlFullSn.push(item.ARA_HDQ_CD + "-" + item.FLW_RGS_DT + "-" + item.FLW_ACP_SN + "-" + item.FLW_DTL_SN)
      })
      this.PRCR_EMP_NO = tgtEmpNo;
      this.PRCR_EMP_NM = tgtEmpNm;
      this.PRCS_DEPT_ID = tgtDeptId;
      this.PRCS_DEPT_NM = tgtDeptNm;
      this.FLW_ACPT_NO = flwAcptNo.join(",");
      this.FLW_DTL_FULL_SN = flwDtlFullSn.join(",");
      this.EMER_YN = emerYn;
    },

    //상담저장 버튼 클릭
    btnSaveCutt() {
      if(this.CTI_CALL_STAT === 'stat6') {
        this.showAlertInfo({msg : '고객과의 <font color="red">통화중</font>에는 상담저장을 하실 수 없습니다.'});
        return;
      }

      //개인정보 수집 여부 validate
      if(this.PRVC_CLCT_AGRE_YN == '') {
        this.showAlert(this.MESSAGE.ALERT.PRVC_CLCT_AGRE_YN);
        return;
      }

      if(!this.SCH_CUTT_TYPE[0] || !this.SCH_CUTT_TYPE[1] || !this.SCH_CUTT_TYPE[2]){
        this.showAlertInfo({msg: '상담유형을 소분류까지 선택하세요.'});
        return;
      }
      if(!this.PRCS_CHN_CD){
        this.showAlertInfo({msg: '처리방법을 선택해 주세요.'});
        return;
      }
      if(!this.CUTT_CN){
        this.showAlertInfo({msg: '상담메모를 입력해 주세요.'});
        return;
      }

      if(this.modelChkRequest.length > 0){
        if(!this.modelChkRequestTime){
          this.showAlertInfo({msg: '제보 요청 시간을 입력해 주세요.'});
          return;
        }else{
          if(this.modelChkRequestTime.indexOf(':') > -1){
            if(this.modelChkRequestTime.split(':').length !== 2){
              this.showAlertInfo({msg: '제보 요청 시간 입력 유형은 "00:00" 형태로 입력해 주세요.'});
              return;
            }else{
              if(isNaN(this.mixin_timeToSec(this.modelChkRequestTime))){
                this.showAlertInfo({msg: '제보 요청 시간은 숫자와 ":" 문자만 입력 가능 합니다.'});
                return;
              }else{
                //칭찬콜은 제보 사유 필수 입력 제외 
                const isRecm2Call = this.modelChkRequest.length == 1 && this.modelChkRequest[0].value == "RECM2" ? true : false;
                if(!isRecm2Call && !this.modelChkReason.trim()){
                  this.showAlertInfo({msg: '제보 요청 사유를 입력해 주세요.'});
                  return;
                }
              }
            }
          }else{
            this.showAlertInfo({msg: '제보 요청 시간 입력 유형은 "00:00" 형태로 입력해 주세요.'});
            return;
          }
        }
      }

      if(this.VOC_CHK){ //민원 접수 인 경우
        if(!this.VOC_DV){
          this.showAlertInfo({msg: '민원 접수 유형을 선택해 주세요.'});
          return;
        }
      }

      //validation check
      if(!this.validateDetail()) {
        return;
      }

      this.$eventBus.$emit('custValid', {CUST_ID : this.CUST_INFO.CUST_ID, SAVE_AFTER_ACTION : this.SAVE_AFTER_ACTION});

    },


    cuttRegValid() {
      this.showAlert(this.cuttMode == 'REG' ? this.MESSAGE.CONFIRM.REG : this.MESSAGE.CONFIRM.MOD);
    },


    //validate check
    validateDetail () {
      //스케줄러이관반려, 스케줄러이관회수일때는 체크 안함.
      if(this.PRCS_STTS_CD != 'ISMACNST005' && this.PRCS_STTS_CD != 'ISMACNST015') {

        if(!this.custValidCheck()){
          return false;
        }

        //상담상세내역 필수값 체크.
        if(!this.$refs.cuttForm.validate()) {
          return false;
        }



       //통화예약 체크.
       // if(rsrv_view){
       //   // if(jQuery('#cntct_btn_action').val() != "ISMACNST010"){
       //     var idx = ["rsrv_ymd", "rsrv_h", "rsrv_m", "rsrv_tel_no"];	//rsrv_cntnt

       //     for(var inx=0; inx<idx.length; inx++){
       //       if( !fn_cnslt_detail_checkForm(idx[inx]) ){
       //         com_alarm_dialog("alarm_dialog", "알림창", msg_com_code_002, 250, 120);
       //         return rtnVal;
       //       }
       //     }
       //   // }
       // }

        //처리방법 - 스케쥴러이관 등록 시 체크.
        if(this.cuttMode == "REG" && this.PRCS_CHN_CD == 'ISMAPCMC006') {
          if(this.FLW_ACPT_NO == "") {
            this.showAlert(this.MESSAGE.ALERT.SCHEDULER_FLW_ACPT_NO);
            return false;
          }

          if(this.REQ_CNTNT == ""){
            console.log("this.REQ_CNTNT", this.REQ_CNTNT )
            this.showAlert(this.MESSAGE.ALERT.SCHEDULER_REQ_CNTNT);
            return false;
          }
        }
      }
     return true;
    },


    //고객 valid 체크
    custValidCheck() {
      //고객정보 필수값 체크.
      if(this.CUST_INFO.CUST_ID == "") {//고객 ID가 없을때만
        if(this.CUST_INFO.CUST_PHN_NO == '' && this.CUST_INFO.CUST_PHN_NO1 == '' && this.CUST_INFO.CUST_PHN_NO2 == '' && this.CUST_INFO.CUST_PHN_NO3 == '' && this.CUST_INFO.EML == '') {
          this.showAlert(this.MESSAGE.ALERT.CHECK_CUST_INFO);
          return false;
        }
        //  else {
        //   jQuery('#black_dt').val(jQuery('#org_eval_dt').val());
        //   return true;
        // }
      } else {
        return true;
      }
    },


    //바로처리 상담 저장.
    //상담내용 저장
    async phoneCuttSave() {
      //this.$store.commit("alertStore/btnYisLoading");

      ///////////////////////////////// LHCS 처리 로직 시작 /////////////////////////////////////////////////////

      // var lineStat = null;
      // var callStatusDialog = null;
      // if(iframeYn){
      //   lineStat = jQuery("#line_stat", top.document).attr("src");
      //   callStatusDialog = jQuery("#call_status_dialog", top.document);
      // }
      // else{
      //   lineStat = jQuery("#line_stat").attr("src");
      //   callStatusDialog = jQuery("#call_status_dialog");
      // }

      // //통화중일경우 저장되면 안됨
      // if( lineStat.indexOf("128") > -1 && callStatusDialog.css("display") == "none")
      // {
      //   com_alarm_dialog("alarm_dialog", "알림창", "통화가 종료된 후에 상담을 저장할 수 있습니다.<br>통화종료후에 저장해주세요", 250, 120);
      //   return false;
      // }


      //통화자 체크
      // if(this.CALLER_NM == "") {
      //   if(!confirm("통화자 등록 없이 상담저장 하시겠습니까?")) {
      //     return false;
      //   }
      // }


      // 처리매체 - 이메일 관련
      // if(jQuery("#proc_chnl_cd").val() ==  "ISMAPCMC003" )
      // {
      //   jsRequestContent("cnslt_detail_form");
      // }

      //처리매체 - 기타
      // if(jQuery("#proc_chnl_cd").val() ==  "ISMAPCMC999")
      // {
      //   cnslt_detail_oEditors.getById["answer_cntnt"].exec("UPDATE_CONTENTS_FIELD", []);
      // }

      //var rec_info = getRecInfo();

      // let custChangeYn = this.custChangeCheck() == true ? "Y" : "N";

      // console.log("★custChangeYn : " + custChangeYn);

      // try{
      //   const talktime = jQuery('#talktime').val();
      //   const talktimes = talktime.split(':');
      //   const callTime = (parseInt(talktimes[0]) * 60) + parseInt(talktimes[1]);
      //   jQuery('#call_time').val(callTime ? callTime : '');
      // }catch(e){}
      // try{
      //   const acwtime = jQuery('#acwtime').val();
      //   const acwtimes = acwtime.split(':');
      //   const acwTime = (parseInt(acwtimes[0]) * 60) + parseInt(acwtimes[1]);
      //   jQuery('#acw_time').val(acwTime ? acwTime : '');
      // }catch(e){}

      //상담저장 버튼 비활성화
      //this.isRunSave = true;
      ///////////////////////////////// LHCS 처리 로직 끝 /////////////////////////////////////////////////////


      //sw DB에 UPDATE를 위한 상담예약결과 코드값
      let rsvtValue = '';


      if(this.forcCuttAble){ //강제 생성인 경우 상담 시간 셋팅
        this.CUTT_BGNG_DT = this.FORCE_CUTT_BGNG_DT.replace(/-/gi, '') + this.FORCE_CUTT_BGNG_TIME.replace(/:/gi, '')+(this.FORCE_CUTT_BGNG_TIME.split(':').length > 1?'':'00');
        this.CUTT_END_DT = this.FORCE_CUTT_END_DT.replace(/-/gi, '') + this.FORCE_CUTT_END_TIME.replace(/:/gi, '')+(this.FORCE_CUTT_END_TIME.split(':').length > 1?'':'00');
      }

      let cuttTypeFullPath = '';

      this.CUTT_TYPE_ITEMS.forEach((type, idx) => {
        if(type.value === this.SCH_ALL_CUTT_TYPE) cuttTypeFullPath = type.text;
      });

      //VOC평가코드
      let vocQltEvalCd = "QE01";
			if("070101" == this.SCH_CUTT_TYPE[1]){			//직원불친절
				vocQltEvalCd = "QE02";
			}
			else if("070103" == this.SCH_CUTT_TYPE[1]){		//고객시설/환경
				vocQltEvalCd = "QE03";
			}
			else if("070102" == this.SCH_CUTT_TYPE[1]){		//직원친절
				vocQltEvalCd = "QE04";
			}

      let postParam = {
        PHN_CUTT_ID : this.PHN_CUTT_ID
        , OUT_PHN_CUTT_ID : this.OUT_PHN_CUTT_ID
        , DRWI_TYPE_CD : this.DRWI_TYPE_CD //콜 유형(IN, OUT)
        , CUST_ID : this.CUST_INFO.CUST_ID //고객 ID
        , HNO : this.CUST_INFO.HO_ADM_NO
        , MGOF_CD: this.LEASE_INFO.MGOF_CD
        , CLBK_ID : this.CLBK_ID //콜백 ID
        , CPI_ID : this.CPI_ID //캠페인 ID
        , RSVT_ID : this.RSVT_ID //상담예약 ID
        , CUTT_BGNG_DT : this.CUTT_BGNG_DT //상담 시작 일시
        , CUTT_END_DT : this.CUTT_END_DT //상담 종료 일시
        , AFTPRCS_HR : this.AFTPRCS_HR //후처리 시간
        , DRWI_SE_NM : this.DRWI_SE_NM //IVR 명
        , REC_FILE_NM : this.REC_FILE_NM //녹취파일명
        , CUTT_RSVT_ID : this.CUTT_RSVT_ID //예약 콜 ID
        , CPLMT_CL_YN : '' //칭찬콜 여부
        , FORC_CRT_YN : this.forcCuttAble ? 'Y' : 'N' //강제 등록 여부
        , AUTO_CL_YN : '' //오토콜 여부

        //
        , RCPT_CHN_CD : this.RCPT_CHN_CD
        , PRVC_CLCT_AGRE_YN : this.PRVC_CLCT_AGRE_YN
        , ARS_INFO : this.ARS_INFO //접속정보(CTI에서 넘어온 값)
        , CALL_ID : this.CTI_INFO.CALL_ID //CALL ID
        , LAST_PHN_NO: this.LAST_PHN_NO !== '' ? this.LAST_PHN_NO.replace(/-/gi, '') : this.CUST_INFO.CUST_PHN_NO.replace(/-/gi, '')
        , PRCS_CHN_CD : this.PRCS_CHN_CD
        , CNTCT_RSLT_CD : this.CNTCT_RSLT_CD
        , PROC_TYPE : this.PROC_TYPE
        , PRCS_STTS_CD: this.PRCS_STTS_CD  //clickPrcsChn 에서 자체사후처리, 협업사후처리 시, TB_CALL_CNSLT_PRC_SHARE.SHARE_TYPE 설정을 위한 코드 값 세팅함.
        , SHARE_RSN_CD : this.SHARE_RSN_CD
        , SHARE_CNTNT : this.SHARE_CNTNT
        , FLW_ACPT_NO : this.FLW_ACPT_NO
        , FLW_DTL_FULL_SN : this.FLW_DTL_FULL_SN
        , REQ_CNTNT : this.REQ_CNTNT
        , EMER_YN : this.EMER_YN
        , CALLER_NM : this.CALLER_NM
        , RELATION_CD : this.RELATION_CD
        , CALLER_TEL : this.CALLER_TEL.replace(/-/gi, '')
        // , SCH_CUTT_TYPE : this.SCH_CUTT_TYPE
        , SCH_ALL_CUTT_TYPE : this.SCH_ALL_CUTT_TYPE
        , CNSLT_DIV_CD_1 : this.SCH_CUTT_TYPE[0] //상담유형 1Dept 코드
        , CNSLT_DIV_CD_2 : this.SCH_CUTT_TYPE[1] //상담유형 2Dept 코드
        , CNSLT_DIV_CD_3 : this.SCH_CUTT_TYPE[2] //상담유형 3Dept 코드
        , CUTT_TYPE_ID : this.SCH_CUTT_TYPE[2] //상담유형 3Dept 코드
        , CNSLT_DIV_PATH_NM : cuttTypeFullPath.replace(/\>/g, ' -> ') //상담유형 FULL_PATH
        , GVIFMT_TYPE_CD: vocQltEvalCd
        , CUTT_CN : this.CUTT_CN
        , PRCS_STTS_CD : this.PRCS_STTS_CD
        , LAST_RSLT_CD : this.LAST_RSLT_CD
        , SRC_CD : this.SRC_CD
        , REL_RSN_CD: this.REL_RSN_CD //재귀사유
        , CHILD_PRCS_STTS_CD: this.CHILD_PRCS_STTS_CD //자식 상담 처리 상태

        , HNO_ADDR : this.HNO_ADDR
        , ICPR_INFO : this.ICPR_INFO
        , ICPR_EMP_NO: this.ICPR_EMP_NO
        , CNTCT_CHNL_CD: this.CNTCT_CHNL_CD
        , RCPT_DEPT_ID: this.RCPT_DEPT_ID //접수_부서_ID
        , PRCS_DEPT_ID: this.PRCS_DEPT_ID //처리_부서_ID
        , PRCR_EMP_NO: this.PRCR_EMP_NO //처리자_사원_번호
        , CNTCT_NOTICE_YN: this.CNTCT_NOTICE_YN ? "Y" : "N"
        , UNTARGET_FULL_SN: this.UNTARGET_FULL_SN
        , RCPT_REG_DT: this.RCPT_REG_DT //접수시간 (일반 아웃바운드의 경우)
        , RCPT_PHN_ID: this.RCPT_PHN_ID
        , RCPT_CLBK_ID: this.RCPT_CLBK_ID
        , RCPT_ETC_ID: this.RCPT_ETC_ID
        , RCPT_TRNSF_ID: this.RCPT_TRNSF_ID
        , PHN_HR : this.mixin_timeToSec(this.CUTT_TIME) //상담 시간
        , AFTPRCS_HR : this.mixin_timeToSec(this.AFT_PROC_TIME) //후처리 시간
        , MON_Q_TASK: this.MON_Q_TASK
        , CVLCPT_RCPT_MNG_ID : this.CVLCPT_RCPT_MNG_ID //민원 접수 ID
        , PHN_CVLCPT_ID : this.PHN_CVLCPT_ID           //종합 민원 ID

        , CHT_CUTT_ID: this.RCPT_CHN_CD == 'CVCK' || this.RCPT_CHN_CD == 'CVCS' || this.RCPT_CHN_CD == 'CVCE' ? this.CHT_CUTT_ID : ''
        , KAKAO_CHT_ID: this.RCPT_CHN_CD == 'CVCK' || this.RCPT_CHN_CD == 'CVCS' || this.RCPT_CHN_CD == 'CVCE' ? this.KAKAO_CHT_ID : ''
      }

      if(this.PRCS_CHN_CD === 'ISMAPCMC007'){ //통화예약
        postParam.RSRV_CUST_NM = this.RSRV_CUST_NM; //통화예약 고객명
        postParam.RSRV_TEL_NO = this.RSRV_TEL_NO.replace(/[^0-9]/g, ''); //통화예약 고객 전화번호
        postParam.RSRV_DT = (this.RSRV_DT + this.RSRV_TIME).replace(/[^0-9]/g, '') + '00'; //통화예약 일시
        postParam.RSRV_CNTNT = this.RSRV_CNTNT; //예약내용
        postParam.RSRV_YN = 'Y'; //예약여부
      }

      if(this.modelChkRequest.length > 0){ //제보 요청이 있는 경우
        postParam.CUTT_GVIFMT = JSON.stringify(this.modelChkRequest);
        postParam.GVIFMT_CN = this.modelChkRequestTime + '/' + this.modelChkReason;
      }

      if(!this.CVLCPT_RCPT_MNG_ID){ //민원 접수를 통한 상담이 아닌 경우
        if(this.VOC_CHK){ //민원 접수인 경우
          postParam.CVLCPT_SE_CD = this.VOC_DV;
          postParam.CVLCPT_RCPT_PATH_CD = 'WIRED'; //접수 경로(유선)
        }
      }

      if(this.PRCS_CHN_CD === 'ISMAPCMC010'){ //배려고객 ARS
        postParam.EXEC_CAUTION_LIST = JSON.stringify(this.EXEC_CAUTION_LIST);
        postParam.CAUTION_CUST_STTS_CD = this.TEMP_CUST_BLOCK_YN?'REQ01':''; //임시차단인 경우 상태값 임시차단(REQ01)
      }

      let headParam = {head : {}}

      console.log("postParam", postParam)
      let response  = await this.common_postCall('/phone-api/cutt/cuttProc', postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {

        if (this.PRCS_STTS_CD == "ISMACNST010" || this.PRCS_STTS_CD == "ISMACNST002")  {
          this.PHN_CUTT_ID = response.DATA[0].PHN_CUTT_ID;
        }
        this.cuttMode = "SAVED";
        this.SAVED_CUTT_INFO = postParam;
        this.SAVED_CUTT_INFO.PHN_CUTT_ID = response.DATA[0].PHN_CUTT_ID;

        //상담 저장 정보를 AS 접수 컴포넌트(CompoInfoAsFlwAcp)에 전달
        this.$emit("setSavedAsCuttInfo", this.SAVED_CUTT_INFO);

        //고객정보 컴포넌트에 CUST_SAVE_TO_CS_SAVE 값 false로 지정
        this.$eventBus.$emit('setSaveEvtReset');
        //상담 저장 ID statusStore에 저장, 현재 상담저장건이 있다는걸 체크하기 위함.(바로처리는 AS접수 프로세스가 있어 상담 완료라는 개념이 없으므로 상담사 판단임.)
        this.$store.commit("statusStore/MU_AS_SAVED_PHN_CUTT_ID", response.DATA[0].PHN_CUTT_ID);
        //상담이력 탭으로 이동 및 새로고침
        this.$eventBus.$emit('setCuttHistInfo', {TAB_IDX: "0", CUST_INFO: this.CUST_INFO, CUTT_HIST_RELOAD:true});


        //CALL_ID가 있는 경우 녹취 서버에 고객 정보 전달
        if(this.CTI_INFO.CALL_ID){
          this.$eventBus.$emit('callCuttAftSendVeloce', {CTI_INFO:this.CTI_INFO, CUST_INFO: this.CUST_INFO, CUTT_TYPE_PATH_NM:this.SCH_CUTT_TYPE_PATH_NM});
          // try{this.callCuttAftSendVeloce();}catch(e){}
        }

        //채팅상담일 경우 상담 저장 후 채팅목록 새로고침
        if(this.$route.path === '/CSL_M0200'){
          this.$eventBus.chtListSrch();
        }

        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.closeMsg();
      }

      this.$store.dispatch("statusStore/AC_CUTT_ING", false); //상담중 아님
      this.mixin_reloadCuttStat('CUTT_MONITOR_STAT'); //상담 모니터링 카운트 리로드
      this.mixin_reloadCuttStat('CUTT_MONITOR_INBD_AFTER_PROC_STAT');//상담 모니터링 - 사후처리  리로드

      //상담저장 시 IN후처리 이거나 OUT후처리인 경우 저장 후 CTI 상태 지정
      //!!! 상담 저장 후 AS접수 과정이 있어 대기 상태로 바꾸지 않음. !!!
      // if(this.CTI_CALL_STAT === 'stat3' || this.CTI_CALL_STAT === 'stat4'){
      //   this.$eventBus.$emit('setCtiBtnEvt', this.SAVE_AFTER_ACTION);
      // }


      // //처리결과는 상담사가 직접 update
      // if(this.RSVT_ID){
      //   //상담예약건 저장할 때
      //   let sUrl = '/api/rsvt/updateRsvtRs';
      //   let postParam = {
      //     API_URL : 'updateRsvtRs',
      //     RSVT_ID : this.RSVT_ID,
      //     RSVT_VALUE : rsvtValue
      //   }

      //   let headParam = {
      //     head : {
      //     }
      //   }

      //   let response  = await this.common_postCall(sUrl, postParam, headParam);

      //   if (!response.HEADER.ERROR_FLAG){
      //     console.log("response.DATA",response.DATA);
      //   }
      // }
    },



    // async saveCutt() {




    //   var _url = '/call/cnslt_hist/action/as/cnslt_hist.jspx?cmd=createConsultBld';
    //   jQuery.ajax( {
    //       url: _url,
    //       type: "POST",
    //     data : jQuery('#cnslt_detail_form').serialize(true) + "&"+ var_mon_q + '&phone_number='+cf_getPhone_number()+"&cust_change_yn="+cust_change_yn+"&"+jQuery('#cust_form').serialize(true)+serializeJsonPostData(rec_info),
    //       async : false,
    //       error 	: function(xhr)
    //       {
    //       alert(xhr.status);
    //     },
    //     success: function(json)
    //     {
    //       var code = json.result.code;
    //       var msg = json.result.msg;
    //       var item = json.result.data;

    //       try
    //       {
    //         cnslt_seq_no = item.cnslt_seq_no;
    //         move_proc_url = item.move_proc_url;
    //         jQuery("#cnslt_detail_form #cnslt_seq_no").val(cnslt_seq_no);
    //       }catch(e){console.log(e);}

    //       if(code == '200')
    //       {
    //         try{
    //           //fn_mon_q_init_all();
    //           if_mon_q_getMonQCnt();
    //           setCnsltReadyBtnCtl(true);
    //           fn_cnslt_hist_getCnsltHst_table();
    //           initRecInfo();

    //         }catch(e){
    //           console.log("ERROR1");
    //         }

    //         try{
    //           if(auto_ready_on === 'true'){
    //             setTimeout(function(){
    //               jQuery("#"+$btns.status["available"].UIID).click();
    //               //wskReadySend();
    //             },500);
    //           }
    //         }catch(e){
    //           console.error("* ERROR - auto_ready_on");
    //         }

    //         if(move_proc_url.replaceAll(" ", "") != ""){
    //           // com_alarm_dialog("alarm_dialog", "알림창", "상담이관 URL입니다. \"<br><br> "+move_proc_url+"<br><br>", 800, 120);
    //           jQuery('#tmp_move_proc_url').val(move_proc_url);
    //           // jQuery('#review_url_btn').show();
    //         }
    //       } else
    //       {
    //         msgStart(msg_com_code_010+"\n("+msg+")");
    //       }
    //     }
    //   });



    // },


    /* 고객정보 변경여부 체크 2017-03-06*/
    custChangeCheck() {
      const length = this.CUST_INFO.length;
      let change_yn = false;

      // jQuery('#cust_div #divCustInfo input, #cust_div #divCustInfo select').each(function(idx){
      //   nowData.push(this.value);
      // });

      // for(var i=0; i<length; i++) {
      //   if(custData[i] != nowData[i]) {
      //     change_yn = true;
      //   }
      // }
      // console.log("cust_change_yn ====> " + change_yn);
      return change_yn;
    },

    setIcpr(item) {
      this.ICPR_EMP_NO = item.USR_ID;
      this.ICPR_EMP_NM = item.USR_NM;
      this.MNTN_USR_DS_CD = item.MNTN_USR_DS_CD;
      this.CNTCT_CHNL_CD = item.MNTN_USR_DS_CD;

      if (item.FRM_NM != "") {
        this.ICPR_INFO = item.FRM_NM + "/" + item.MNTN_USR_DS_NM; //소속
      } else {
        this.ICPR_INFO = item.DEP_NM + "/" + item.MNTN_USR_DS_NM; //소속
      }
      this.CALLER_NM = this.ICPR_INFO
      this.CALLER_TEL = item.SEL_CALLER_TEL
      this.mixin_hideDialog('FindAsIcpr')
    },

    refreshIcpr() {
      this.ICPR_EMP_NO = '';
      this.ICPR_EMP_NM = '';
      this.ICPR_INFO = "/접수고객";
      this.CNTCT_CHNL_CD = "999";
    },

    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },



    async getMonQCuttInfo() {
      console.log("getMonQCuttInfo", this.MON_Q_ITEM, this.MON_Q_TASK)
      this.handleNewCutt();

      if(this.MON_Q_TASK == "OB") {
        //다른 작업에 의해 덮어씌여지는 케이스 발생하여 timeout 줌.
        setTimeout(() => {
          console.log("ob detail setting", this.MON_Q_TASK, this.MON_Q_ITEM)
          this.CALLER_NM = this.MON_Q_ITEM.CALLER_NM
          this.CALLER_TEL = this.MON_Q_ITEM.CALLER_TEL
          //모니터링에서 하는 경우 무조건 OUT으로 잡는다.
          this.DRWI_TYPE_CD = "OUT";
          if(this.MON_Q_ITEM.LAST_PRVC_CLCT_AGRE_YN) {
            this.PRVC_CLCT_AGRE_YN = this.MON_Q_ITEM.LAST_PRVC_CLCT_AGRE_YN;
          }
        }, 1500);
      } else {
        let headParam = {head : {} }
        const postParam = this.MON_Q_ITEM

        console.log("getMonQCuttInfo postParam", postParam)
        let response  = await this.common_postCall('/phone-api/system/monitor/selectMonitorCuttInfo', postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          this.MON_Q_CUTT_INFO = response.DATA[0];
        }
        this.setDetailCuttInfo(this.MON_Q_CUTT_INFO);

        if(this.MON_Q_TASK == "NTBC") {
          // this.dialogCsDetail = true
          this.mixin_openWindow( 'LayoutPopup', '1040', '885', {compo_name : 'CompoAsFlwAcpDetail', callback : 'getPopData', title: 'AS 접수 상세', popData: {histType: 'NEW', ARA_HDQ_CD: this.MON_Q_ITEM.ARA_HDQ_CD, FLW_RGS_DT: this.MON_Q_ITEM.FLW_RGS_DT, FLW_ACP_SN: this.MON_Q_ITEM.FLW_ACP_SN, FLW_DTL_SN: this.MON_Q_ITEM.FLW_DTL_SN, MGOF_CD: this.MON_Q_ITEM.MGOF_CD, HNO: this.MON_Q_ITEM.HNO}})

          ///통보완료일 경우 미대상 처리완료시에 필요.
          this.UNTARGET_FULL_SN = this.MON_Q_ITEM.FLW_DTL_FULL_SN

          headParam = {head : {
            ns: 'lhcs.system.monitor.dao.MonitorStatMapper'
          } }
          response  = await this.common_postCall('/api/biz/common/select/selectAsFlwAcpCustInfo', postParam, headParam);
          if (!response.HEADER.ERROR_FLAG){
            console.log("selectAsFlwAcpCustInfo response.DATA[0]", response.DATA[0])
            this.CALLER_NM = response.DATA[0].CVPR_NM
            this.CALLER_TEL = response.DATA[0].MBL_NO
          }
        }
      }
    },

    //상담 상세 정보 조회 - 모니터링에서 조회 시,
    async setDetailCuttInfo(cuttInfo) {
      console.log("setDetailCuttInfo", cuttInfo)
      this.PHN_CUTT_ID = cuttInfo.PHN_CUTT_ID;
      if(cuttInfo.ORG_CNSLT_SEQ_NO && parseInt(cuttInfo.ORG_CNSLT_SEQ_NO) > 0) {
        this.OUT_PHN_CUTT_ID - cuttInfo.ORG_CNSLT_SEQ_NO;
      }

      this.RCPT_CHN_CD = cuttInfo.RCPT_CHN_CD;
      this.RCPT_PHN_ID = cuttInfo.RCPT_PHN_ID;
      this.RCPT_CLBK_ID = cuttInfo.RCPT_CLBK_ID;
      this.RCPT_ETC_ID = cuttInfo.RCPT_ETC_ID;
      this.RCPT_TRNSF_ID = cuttInfo.RCPT_TRNSF_ID;
      this.LAST_PHN_NO = this.mixin_setPhoneNo(cuttInfo.LAST_PHN_NO);
      this.LAST_RSLT_CD = cuttInfo.LAST_RSLT_CD;
      //jQuery("#cnslt_detail_form #io").val(cnslt_info.io); //TODO ::: 잘 모르겠음, io와 cnsltFormType 차이!!!
      this.CALLER_TEL = cuttInfo.LAST_PHN_NO

      if(cuttInfo.PRCS_CHN_CD && cuttInfo.PRCS_CHN_CD != "ISMAPCMC011" && cuttInfo.PRCS_CHN_CD != "ISMAPCMC012") {
        this.CUTT_CN = cuttInfo.CUTT_CN;
      }

      this.RCPT_REG_DT = cuttInfo.REG_DT;

      this.SRC_CD = cuttInfo.SRC_CD
      this.RELATION_CD = cuttInfo.RELATION_CD
      this.HNO_ADDR = cuttInfo.HNO_ADDR
      this.ICPR_INFO = cuttInfo.ICPR_INFO
      this.ICPR_EMP_NO = cuttInfo.ICPR_EMP_NO
      // this.ARA_HDQ_CD = cuttInfo.ARA_HDQ_CD
      // this.TRANSFER_EMP_NM = cuttInfo.TRANSFER_EMP_NM

      this.REQ_CNTNT = cuttInfo.REQ_CNTNT
      this.PROC_TYPE = cuttInfo.PROC_TYPE
      this.SHARE_RSN_CD = cuttInfo.SHARE_RSN_CD
      this.SHARE_CNTNT = cuttInfo.SHARE_CNTNT
      this.CALLER_NM = cuttInfo.CALLER_NM
      if(cuttInfo.CALLER_TEL) {
        this.CALLER_TEL = cuttInfo.CALLER_TEL
      }


      //제보 요청
      this.modelChkRequest = [];
      this.modelChkRequestTime = '00:00';
      this.modelChkReason = '';
      this.GVIFMT_STTS_CD = '';
      if(!this.mixin_isEmpty(cuttInfo.GVIFMT_HSTRY_LIST)){
          let arrGvifmtHstryList = cuttInfo.GVIFMT_HSTRY_LIST.split('||');
          this.GVIFMT_HSTRY_LIST.forEach((item, idx) => {
            arrGvifmtHstryList.forEach((gvifmt, seq) => {
              if(gvifmt.split(',')[0] === item.value){
                this.modelChkRequest.push(item);
              }

              if(seq === 0){
                let sTimeRs = gvifmt.split(',')[1];
                this.modelChkRequestTime = sTimeRs.split('/')[0];
                this.modelChkReason = sTimeRs.split('/')[1];
                this.GVIFMT_STTS_CD = gvifmt.split(',')[2];
              }
            });
          });
      }




      //모니터링에서 하는 경우 무조건 OUT으로 잡는다.
      this.DRWI_TYPE_CD = "OUT";
      if(cuttInfo.LAST_PRVC_CLCT_AGRE_YN) {
        this.PRVC_CLCT_AGRE_YN = cuttInfo.LAST_PRVC_CLCT_AGRE_YN;
      }
    },

    //호전화시 상담메모에 추가
    addTrnsfInfoCuttCn(item){
      //호전환 구분(1:호전환,2:그룹 전환,3:호전환(현업))
      if(item.TRNSF_GB === 1){
        this.CUTT_CN = this.CUTT_CN + '\n' + '*'+item.DEPT_NM+' [' + item.USER_NM +']_호전환';
      }else if(item.TRNSF_GB === 2){
        this.CUTT_CN = this.CUTT_CN + '\n' + '*'+item.GROUP_NM+' 그룹 전환';
      }else if(item.TRNSF_GB === 3){
        this.CUTT_CN = this.CUTT_CN + '\n' + '*'+(this.mixin_isEmpty(item.DEPT_WHOL_PATH)?'':item.DEPT_WHOL_PATH)+' [' + (this.mixin_isEmpty(item.USER_NM)?'':item.USER_NM) +'('+ item.TRANS_TEL_NO+')]_호전환(현업)';
      }
    },

    //호전환 전화번호 Set
    setTransPhnNo(item){
      this.TRANS_DATA = item;
      this.TRANS_EXT_NO = item.EXT_NO;
    },

    //호전환 전환시도
    tryTrans() {
      if(this.TRANS_EXT_NO){

        this.PREV_CONN_ID = ipronCallUtil.ConnId;

        ipronCallUtil.holdCall();
        ipronCallUtil.obCall(this.TRANS_EXT_NO);
      }else{
        this.showAlertInfo({msg: '호전환할 내선번호가 존재하지 않습니다.'});
        return;
      }
    },

    //호전환
    transExtNo() {
      if(this.TRANS_EXT_NO){
        ipronCallUtil.transferMuteCall(this.TRANS_EXT_NO, this.PREV_CONN_ID);

        this.TRANS_DATA.TRNSF_GB = 1;//호전환 구분(1:호전환,2:그룹전환,3:호전환(현업))
        this.addTrnsfInfoCuttCn(this.TRANS_DATA);

        this.mixin_hideDialog('TransCenter');
      }else{
        this.showAlertInfo({msg: '호전환할 내선번호가 존재하지 않습니다.'});
        return;
      }
    },

    //전환 취소
    transCancel() {
      ipronCallUtil.retrieveCall(this.PREV_CONN_ID); //보류해제
      ipronCallUtil.clearCall();//호전환 취소
    },

    //상담정보 추가 행 갯수 계산
    calcAsCuttAddRowCnt() {
      let rowCnt = 0;
      //아웃바운드 시시 1행 추가.
      if(this.DRWI_TYPE_CD == "OUT") {
        rowCnt ++;
      }
      //처리방법 - 자체사후처리, 협업사후처리, 스케줄러이관 시 1행 추가
      if(this.PRCS_CHN_CD == "ISMAPCMC011" || this.PRCS_CHN_CD == "ISMAPCMC012" || this.PRCS_CHN_CD == "ISMAPCMC006") {
        rowCnt ++;
      }
      //미대상 조회 시 1행 추가.
      if(this.MON_Q_TASK == "NTBC") {
        rowCnt ++;
      }
      this.$store.dispatch("statusStore/AC_AS_CUTT_ADD_ROW_CNT", rowCnt);
      console.log("computedAsCuttAddRowCnt", this.computedAsCuttAddRowCnt)
    },

    //고객 전화번호 전화걸기 버튼 이벤트
    custPhnNoOutCall(custPhnNo) {
      //아웃바운드일 때 버튼 활성화.
      //상담 화면에 나타나므로 상담중 여부 체크 안함.
      this.$eventBus.$emit('topOutCall', {CUST_PHN_NO : custPhnNo});
    },

    //상담도구 선택 시 
    changeCuttToolCn(item){
      this.SCH_ALL_CUTT_TYPE = '';
      this.SCH_CUTT_TYPE = new Array(3);

      this.SCH_CUTT_TYPE[0] = item.CUTT_LCD;
      this.SCH_CUTT_TYPE[1] = item.CUTT_MCD;
      this.SCH_CUTT_TYPE[2] = item.CUTT_SCD;

      this.SCH_ALL_CUTT_TYPE = this.SCH_CUTT_TYPE.join(",");
      
      this.CUTT_CN = item.CONTENTS;
    },

    //상담도구
    async getCuttToolList() {
      this.CUTT_TOOL_LIST = [{TITLE:'선택', CONTENTS : ''}];

      let postParam = {}
      let headParam = {
        head: {
          ns: 'lhcs.phone.cuttMng.dao.PhoneCuttToolMngMapper',
        }
      }

      const response = await this.common_postCall('/api/biz/common/select/selectCuttToolList', postParam, headParam);
      
      if (!response.HEADER.ERROR_FLAG) {
        response.DATA.forEach((item, idx) => {
          item.CONTENTS = this.mixin_decode(item.CONTENTS);
          this.CUTT_TOOL_LIST.push(item);
        });
      }
    },

    showSidePanel(name){
      const smsInfo = {
        CUST_ID: this.CUST_INFO.CUST_ID ? this.CUST_INFO.CUST_ID : '',
        CUST_IDNTF_NO: this.CUST_INFO.CUST_IDNTF_NO ? this.CUST_INFO.CUST_IDNTF_NO : '',
        CUST_PHN_NO: this.CALLER_TEL,
      }
      this.$eventBus.$emit('setSidePanelCustInfo', smsInfo);
      if(name.includes('slide')){
        this.$eventBus.$emit('clearVSlideXreverse');
        this.$eventBus.$emit('showRightSlide', {ACT_NM: 'slideEmailSend', active:false});
      }else{
          this.$eventBus.$emit('showRightDialog', {dialogNm : name})
      }
    },


    //상담 상세 호출 시 상담정보 설정 및 상담수정 권한 설정
    async setAsDetail() {
      this.cuttMode = "DETAIL";
      if(this.DataProp != null) {
        //상담 상세 정보 조회.
        await this.getAsCuttDetail();
        //상담수정 권한 설정
        let checkAdmin = this.computedIsContainAdminGroup;
				let checkCnsltStaff = this.computedUserGroupCd.indexOf("CNSLT_STAFF") > -1 ? true : false;  //바로처리팀장 = 팀장(부팀장)
        let workingdayYn = false;

        let currentDate = await this.mixin_getSvrDate("YYYYMMDD");
        if(checkAdmin) {
          //workingdayYn = true;
          //관리자는 3일 이내 상담건에 대해서만 수정 가능
          if(currentDate <= this.$moment(this.mixin_convertDate(this.AS_CUTT_DETAIL_INFO.REG_DT.replace(/[^0-9]/g, ''), 'yyyyMMdd')).add(3,'days').format('YYYYMMDD')){
            workingdayYn = true;
          }
        } else {
          // if(currentDate <= this.$moment(this.mixin_convertDate(this.AS_CUTT_DETAIL_INFO.REG_DT.replace(/[^0-9]/g, ''), 'yyyyMMdd')).add(3,'days').format('YYYYMMDD')){
          //   workingdayYn = true;
          // }
          //상담사인경우 당일 상담건에 대해서만 수정 가능
          if(currentDate === this.mixin_convertDate(this.AS_CUTT_DETAIL_INFO.REG_DT, 'yyyyMMdd')){
            workingdayYn = true;
          }
        }


        this.detailUpdateYn = false;
        //로그인 사용자가 바로처리센터 소속이 아니면 수정 권한 없음.
        if(this.computedUserCenter != this.SCH_CUSTCO_ID) {
          this.detailUpdateYn = false;
        }
        else if (((checkAdmin && !checkCnsltStaff) || checkCnsltStaff) && workingdayYn) {	// 2022.08.11 팀장은 본인의 부서 팀이 아니더라도 수정 가능하도록
					//관리자 or 해당 부서 팀장
					this.detailUpdateYn = true;
				} else {
          
					// 팀이동후 수정하는 경우가 있어 부서조건 제외 시킴 21.8.4
					if (!checkAdmin && !checkCnsltStaff && (this.AS_CUTT_DETAIL_INFO.CUSL_ID == this.user_id) && workingdayYn && (this.AS_CUTT_DETAIL_INFO.RETRANS_YN == "Y")) {
						this.detailUpdateYn = true;
					} else {
						this.detailUpdateYn = false;
					}
				}

        if(this.detailUpdateYn && this.PRCS_CHN_CD == "ISMAPCMC006"){
          this.transCuttYn = true;
        }else{
          this.transCuttYn = false;
        }
      }
    },
    
    //상담 상세 정보 세팅.
    async getAsCuttDetail() {
      let postParam = {PHN_CUTT_ID : this.DataProp.PHN_CUTT_ID, SCH_CUSTCO_ID: this.SCH_CUSTCO_ID };
      let headParam = {};
      const response = await this.common_postCall("/phone-api/cutt/selectCuttHistDetail", postParam, headParam);
      if(response && !response.HEADER.ERROR_FLAG) {
        this.AS_CUTT_DETAIL_INFO = response.DATA[0];

        //계약정보
        this.LEASE_INFO = {
          MGOF_CD: this.AS_CUTT_DETAIL_INFO.MGOF_CD,
          MGOF_NM: this.AS_CUTT_DETAIL_INFO.MGOF_NM,
          ARA_HDQ_CD: this.AS_CUTT_DETAIL_INFO.ARA_HDQ_CD
        }
        
        //상담 상세 정보
        this.PHN_CUTT_ID = this.AS_CUTT_DETAIL_INFO.PHN_CUTT_ID;
        this.CHT_CUTT_ID = this.AS_CUTT_DETAIL_INFO.CHT_CUTT_ID;

        this.DRWI_TYPE_CD = this.AS_CUTT_DETAIL_INFO.DRWI_TYPE_CD;
        this.RCPT_CHN_CD = this.AS_CUTT_DETAIL_INFO.RCPT_CHN_CD;
        this.KAKAO_CHT_ID = this.AS_CUTT_DETAIL_INFO.KAKAO_CHT_ID;
        this.PRVC_CLCT_AGRE_YN = this.AS_CUTT_DETAIL_INFO.PRVC_CLCT_AGRE_YN;
        this.ARS_INFO = this.AS_CUTT_DETAIL_INFO.ARS_INFO;
        this.LAST_PHN_NO = this.AS_CUTT_DETAIL_INFO.LAST_PHN_NO;
        this.SCH_CUTT_TYPE = this.AS_CUTT_DETAIL_INFO.FULL_CUTT_TYPE_ID.split(',');
        this.SCH_ALL_CUTT_TYPE = this.AS_CUTT_DETAIL_INFO.FULL_CUTT_TYPE_ID;
        this.PRCS_CHN_CD = this.AS_CUTT_DETAIL_INFO.PRCS_CHN_CD;
        this.PROC_TYPE = this.AS_CUTT_DETAIL_INFO.PROC_TYPE;
        

        // 처리부서/처리자
        this.PRCS_DEPT_NM = this.AS_CUTT_DETAIL_INFO.PRCS_DEPT_NM;
        this.PRCS_DEPT_ID = this.AS_CUTT_DETAIL_INFO.PRCS_DEPT_ID;
        this.PRCR_EMP_NO = this.AS_CUTT_DETAIL_INFO.PRCR_EMP_NO;
        this.PRCR_EMP_NM = this.AS_CUTT_DETAIL_INFO.PRCR_EMP_NM;
        //주소
        this.HNO_ADDR = this.AS_CUTT_DETAIL_INFO.HNO_ADDR;

        this.ICPR_EMP_NO = this.AS_CUTT_DETAIL_INFO.ICPR_EMP_NO;
        if(!this.mixin_isEmpty(this.ICPR_EMP_NO)) {
          this.getIcprEmpNm();
        }
        this.ICPR_INFO = this.AS_CUTT_DETAIL_INFO.ICPR_INFO;
        this.CALLER_NM = this.AS_CUTT_DETAIL_INFO.CALLER_NM;
        this.CALLER_TEL = this.AS_CUTT_DETAIL_INFO.CALLER_TEL;
        this.RELATION_CD = this.AS_CUTT_DETAIL_INFO.RELATION_CD;
        this.CNTCT_CHNL_CD = this.AS_CUTT_DETAIL_INFO.CNTCT_CHNL_CD;

        this.CUTT_CN = this.AS_CUTT_DETAIL_INFO.CUTT_CN;

        

        //제보 요청
        this.modelChkRequest = [];
        this.modelChkRequestTime = '00:00';
        this.modelChkReason = '';
        this.GVIFMT_STTS_CD = '';
        if(!this.mixin_isEmpty(this.AS_CUTT_DETAIL_INFO.GVIFMT_HSTRY_LIST)){
            let arrGvifmtHstryList = this.AS_CUTT_DETAIL_INFO.GVIFMT_HSTRY_LIST.split('||');
            this.GVIFMT_HSTRY_LIST.forEach((item, idx) => {
              arrGvifmtHstryList.forEach((gvifmt, seq) => {
                if(gvifmt.split(',')[0] === item.value){
                  this.modelChkRequest.push(item);
                }

                if(seq === 0){
                  let sTimeRs = gvifmt.split(',')[1];
                  this.modelChkRequestTime = sTimeRs.split('/')[0];
                  this.modelChkReason = sTimeRs.split('/')[1];
                  this.GVIFMT_STTS_CD = gvifmt.split(',')[2];
                }
              });
            });
        }

        //민원접수
        this.VOC_CHK = false;
        this.VOC_DV = '';
        if(!this.mixin_isEmpty(this.AS_CUTT_DETAIL_INFO.CVLCPT_SE_CD)){
          this.VOC_CHK = true;
          this.VOC_DV = this.AS_CUTT_DETAIL_INFO.CVLCPT_SE_CD.split(',')[1];
        }

        
      }
    },

    //담당자명 조회
    async getIcprEmpNm() {
      let postParam = {
        USR_ID : this.ICPR_EMP_NO,
      };
      const response = await this.common_postCall("/phone-api/as/common/selectCotisIcprList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0) {
          this.ICPR_EMP_NM = response.DATA[0].USR_NM;
        }
      }
    },

    //상담수정 버튼
    btnUpdateCuttDetail() {
      this.showConfirmInfo({
        msg: "상담을 수정하시겠습니까?"
        , callYes: () => {
          this.updateCuttDetail();
          this.closeAlert();
        }
        , callNo: this.closeAlert
      })
    },

    //상담상세 - 상담수정
    async updateCuttDetail() {
      //validation check
      if(!this.validateDetail()) {
        return;
      }


      let cuttTypeFullPath = '';

      this.CUTT_TYPE_ITEMS.forEach((type, idx) => {
        if(type.value === this.SCH_ALL_CUTT_TYPE) cuttTypeFullPath = type.text;
      });

      //VOC평가코드
      let vocQltEvalCd = "QE01";
			if("070101" == this.SCH_CUTT_TYPE[1]){			//직원불친절
				vocQltEvalCd = "QE02";
			}
			else if("070103" == this.SCH_CUTT_TYPE[1]){		//고객시설/환경
				vocQltEvalCd = "QE03";
			}
			else if("070102" == this.SCH_CUTT_TYPE[1]){		//직원친절
				vocQltEvalCd = "QE04";
			}

      let postParam = {
        //이관건 여부
        TRANS_CUTT_YN : this.transCuttYn ? "Y" : "N"
        , PHN_CUTT_ID : this.PHN_CUTT_ID
        , DRWI_TYPE_CD : this.DRWI_TYPE_CD //콜 유형(IN, OUT)
        , CUST_ID : this.CUST_INFO.CUST_ID //고객 ID
        , HNO : this.CUST_INFO.HO_ADM_NO
        , MGOF_CD: this.LEASE_INFO.MGOF_CD
        , CLBK_ID : this.CLBK_ID //콜백 ID
        , CPI_ID : this.CPI_ID //캠페인 ID
        , RSVT_ID : this.RSVT_ID //상담예약 ID
        , CUTT_BGNG_DT : this.CUTT_BGNG_DT //상담 시작 일시
        , CUTT_END_DT : this.CUTT_END_DT //상담 종료 일시
        , AFTPRCS_HR : this.AFTPRCS_HR //후처리 시간
        , DRWI_SE_NM : this.DRWI_SE_NM //IVR 명
        , REC_FILE_NM : this.REC_FILE_NM //녹취파일명
        , CUTT_RSVT_ID : this.CUTT_RSVT_ID //예약 콜 ID
        , CPLMT_CL_YN : '' //칭찬콜 여부
        , FORC_CRT_YN : this.forcCuttAble ? 'Y' : 'N' //강제 등록 여부
        , AUTO_CL_YN : '' //오토콜 여부

        //
        , RCPT_CHN_CD : this.RCPT_CHN_CD
        , PRVC_CLCT_AGRE_YN : this.PRVC_CLCT_AGRE_YN
        , ARS_INFO : this.ARS_INFO //접속정보(CTI에서 넘어온 값)
        , CALL_ID : this.CTI_INFO.CALL_ID //CALL ID
        , LAST_PHN_NO: this.LAST_PHN_NO !== '' ? this.LAST_PHN_NO.replace(/-/gi, '') : this.CUST_INFO.CUST_PHN_NO.replace(/-/gi, '')
        , PRCS_CHN_CD : this.PRCS_CHN_CD
        , CNTCT_RSLT_CD : this.CNTCT_RSLT_CD
        , PROC_TYPE : this.PROC_TYPE
        , PRCS_STTS_CD: this.PRCS_STTS_CD  //clickPrcsChn 에서 자체사후처리, 협업사후처리 시, TB_CALL_CNSLT_PRC_SHARE.SHARE_TYPE 설정을 위한 코드 값 세팅함.
        , SHARE_RSN_CD : this.SHARE_RSN_CD
        , SHARE_CNTNT : this.SHARE_CNTNT
        , FLW_ACPT_NO : this.FLW_ACPT_NO
        , FLW_DTL_FULL_SN : this.FLW_DTL_FULL_SN
        , REQ_CNTNT : this.REQ_CNTNT
        , EMER_YN : this.EMER_YN
        , CALLER_NM : this.CALLER_NM
        , RELATION_CD : this.RELATION_CD
        , CALLER_TEL : this.CALLER_TEL.replace(/-/gi, '')
        // , SCH_CUTT_TYPE : this.SCH_CUTT_TYPE
        , SCH_ALL_CUTT_TYPE : this.SCH_ALL_CUTT_TYPE
        , CNSLT_DIV_CD_1 : this.SCH_CUTT_TYPE[0] //상담유형 1Dept 코드
        , CNSLT_DIV_CD_2 : this.SCH_CUTT_TYPE[1] //상담유형 2Dept 코드
        , CNSLT_DIV_CD_3 : this.SCH_CUTT_TYPE[2] //상담유형 3Dept 코드
        , CUTT_TYPE_ID : this.SCH_CUTT_TYPE[2] //상담유형 3Dept 코드
        , CNSLT_DIV_PATH_NM : cuttTypeFullPath.replace(/\>/g, ' -> ') //상담유형 FULL_PATH
        , GVIFMT_TYPE_CD: vocQltEvalCd
        , CUTT_CN : this.CUTT_CN
        , PRCS_STTS_CD : this.PRCS_STTS_CD
        , LAST_RSLT_CD : this.LAST_RSLT_CD
        , SRC_CD : this.SRC_CD
        , REL_RSN_CD: this.REL_RSN_CD //재귀사유
        , CHILD_PRCS_STTS_CD: this.CHILD_PRCS_STTS_CD //자식 상담 처리 상태

        , HNO_ADDR : this.HNO_ADDR
        , ICPR_INFO : this.ICPR_INFO
        , ICPR_EMP_NO: this.ICPR_EMP_NO
        , CNTCT_CHNL_CD: this.CNTCT_CHNL_CD
        , RCPT_DEPT_ID: this.RCPT_DEPT_ID //접수_부서_ID
        , PRCS_DEPT_ID: this.PRCS_DEPT_ID //처리_부서_ID
        , PRCR_EMP_NO: this.PRCR_EMP_NO //처리자_사원_번호
        , CNTCT_NOTICE_YN: this.CNTCT_NOTICE_YN ? "Y" : "N"
        , UNTARGET_FULL_SN: this.UNTARGET_FULL_SN
        , RCPT_REG_DT: this.RCPT_REG_DT //접수시간 (일반 아웃바운드의 경우)
        , RCPT_PHN_ID: this.RCPT_PHN_ID
        , RCPT_CLBK_ID: this.RCPT_CLBK_ID
        , RCPT_ETC_ID: this.RCPT_ETC_ID
        , RCPT_TRNSF_ID: this.RCPT_TRNSF_ID
        // , PHN_HR : this.mixin_timeToSec(this.CUTT_TIME) //상담 시간
        // , AFTPRCS_HR : this.mixin_timeToSec(this.AFT_PROC_TIME) //후처리 시간
        // , MON_Q_TASK: this.MON_Q_TASK
        // , CVLCPT_RCPT_MNG_ID : this.CVLCPT_RCPT_MNG_ID //민원 접수 ID

        , CHT_CUTT_ID: this.RCPT_CHN_CD == 'CVCK' || this.RCPT_CHN_CD == 'CVCS' || this.RCPT_CHN_CD == 'CVCE' ? this.CHT_CUTT_ID : ''
        , KAKAO_CHT_ID: this.RCPT_CHN_CD == 'CVCK' || this.RCPT_CHN_CD == 'CVCS' || this.RCPT_CHN_CD == 'CVCE' ? this.KAKAO_CHT_ID : ''
      }

      // if(this.PRCS_CHN_CD === 'ISMAPCMC007'){ //통화예약
      //   postParam.RSRV_CUST_NM = this.RSRV_CUST_NM; //통화예약 고객명
      //   postParam.RSRV_TEL_NO = this.RSRV_TEL_NO.replace(/[^0-9]/g, ''); //통화예약 고객 전화번호
      //   postParam.RSRV_DT = (this.RSRV_DT + this.RSRV_TIME).replace(/[^0-9]/g, '') + '00'; //통화예약 일시
      //   postParam.RSRV_CNTNT = this.RSRV_CNTNT; //예약내용
      //   postParam.RSRV_YN = 'Y'; //예약여부
      // }

      // if(this.modelChkRequest.length > 0){ //제보 요청이 있는 경우
      //   postParam.CUTT_GVIFMT = JSON.stringify(this.modelChkRequest);
      //   postParam.GVIFMT_CN = this.modelChkRequestTime + '/' + this.modelChkReason;
      // }

      // if(!this.CVLCPT_RCPT_MNG_ID){ //민원 접수를 통한 상담이 아닌 경우
      //   if(this.VOC_CHK){ //민원 접수인 경우
      //     postParam.CVLCPT_SE_CD = this.VOC_DV;
      //     postParam.CVLCPT_RCPT_PATH_CD = 'WIRED'; //접수 경로(유선)
      //   }
      // }

      // if(this.PRCS_CHN_CD === 'ISMAPCMC010'){ //배려고객 ARS
      //   postParam.EXEC_CAUTION_LIST = JSON.stringify(this.EXEC_CAUTION_LIST);
      //   postParam.CAUTION_CUST_STTS_CD = this.TEMP_CUST_BLOCK_YN?'REQ01':''; //임시차단인 경우 상태값 임시차단(REQ01)
      // }

      let headParam = {head : {}}

      console.log("postParam", postParam)
      let response  = await this.common_postCall('/phone-api/as/cutt/updateAsCuttDetail', postParam, headParam);
      if (!response.HEADER.ERROR_FLAG){
        this.showToastInfo({msg: "정상 처리되었습니다."})

        //부모창의 상담이력을 새로고침하여 상담 수정 사항 새로고침.
        this.refreshHistAsCutt();
      }
    },

    // 종합민원 이송 팝업 호출
    openPhnCvlcptPopup(){
      if(this.VOC_DV != "CALLVOC") return false;
      this.mixin_openWindow('LayoutPopup', '850', '815', {compo_name: 'CSM_M1600_POP', title: '종합민원 이송 접수', popData:{PHN_CVLCPT_ID: this.PHN_CVLCPT_ID}, callback : 'savePhnCvlcptCallBack'});
    },

    // 종합민원 이송 접수 콜백함수
    savePhnCvlcptCallBack(data){
      if(!this.mixin_isEmpty(data.PHN_CVLCPT_ID)) this.PHN_CVLCPT_ID = data.PHN_CVLCPT_ID;
    },


    refreshHistAsCutt() {
      
      const eventBusName = "refreshHistAsCutt";
      let parentInstance;
      
      if (window.opener && window.opener.parentVueInstance) {
        window.opener.parentVueInstance.mixin_parentSessionStorage(); //부모창 sessionStorage 변경 값 확인을 위해 재주입
        parentInstance = window.opener.parentVueInstance;
        //부모창의 이벤트 버스 호출
        if (typeof parentInstance["mixin_setParentEventBus"] === 'function') {
          parentInstance["mixin_setParentEventBus"](eventBusName);
        } else {
          this.showAlert({alertDialogToggle: true, msg: '팝업을 새로 호출 후 이용해 주시기 바랍니다.', iconClass: 'is-info', type: 'default'});
          return;
        }
      } else {
        this.showAlert({alertDialogToggle: true, msg: '팝업을 새로 호출 후 이용해 주시기 바랍니다.', iconClass: 'is-info', type: 'default'});
        return;
      }
    },

  },
  beforeDestroy() {
    this.$eventBus.$off("setCuttCustInfo");
    this.$eventBus.$off("setCuttLeaseInfo");
    this.$eventBus.$off("searchCustInfoNewCutt_4");
    this.$eventBus.$off("setRcvId"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("chatMessagePaste");
    this.$eventBus.$off("setForceCuttIngFlag"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("CUST_CAUTION_HIST"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("pasteCustPhnNo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("CloseBalckArs");////배려고객ARS 닫기
    this.$eventBus.$off("setCallId");
    this.$eventBus.$off("setSttAutoCuttInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("setCuttPrcsList"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("addTrnsfInfoCuttCn"); //eventBus 중복방지를 위해 off
  }
};
</script>

<style lang="scss" scoped>

</style>