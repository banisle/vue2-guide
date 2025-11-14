<template>
  <div class="pl-cols is-mt-s is-border-lightMain rounded-lg" style="border: 1px solid">
    <!-- 고객정보/AS정보/작업내용 -->
    <div class="pt-2 pr-1 pl-3 pb-3">
      <div class="pl-header type-white">
        <div div class="pl-header--title ">고객정보/AS정보/작업내용</div>
        <div class="spacing-wrap sp-4 ml-auto align-center">
          <span
            class="pl-badge type-light is-red"
            :disabled="FLW_ACP_INFO.ATCH_CNT && parseInt(FLW_ACP_INFO.ATCH_CNT) > 0 ? true : false"
            >첨부파일 있음</span>
          <v-btn
            class="pl-btn is-sub is-sm"
            @click="mixin_showDialog('AsMgofInfo')">단지정보</v-btn>
          <v-btn
            class="pl-btn is-sub is-sm"
            @click="mixin_showDialog('AsInitHist')">공용부 이력</v-btn>
          <v-btn class="pl-btn is-sub is-sm"
            @click="copyCustInfo">정보복사</v-btn>
        </div>
      </div>
      <!-- 고객정보 -->
      <div class="is-mt-s">
        <table class="pl-tbl-detail ">
          <colgroup>
            <col width="127px" />
            <col width="25%" />
            <col width="127px" />
            <col width="" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  접수자
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="CUST_INFO.EMP_NM"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  접수채널
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="FLW_ACP_INFO.ACP_CHNL_NM"
                  disabled
                  class="pl-form is-auto"
                  value="관리사무소"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  민원인
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="FLW_ACP_INFO.CVPR_NM"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  연락처
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="FLW_ACP_INFO.MBL_NO"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  배려고객
                </span>
              </th>
              <td colspan="3">
                <div class="spacing-wrap sp-4">
                  <v-icon
                    v-if="CUST_CAUTION_INFO.CAUTION_CUST_STTS_CD && CUST_CAUTION_INFO.CAUTION_CUST_STATE == 'B2'"
                    class="pl-icon20 cs-black"></v-icon>
                  <v-icon
                    v-if="CUST_CAUTION_INFO.CAUTION_CUST_STTS_CD && CUST_CAUTION_INFO.CAUTION_CUST_STATE == 'B1'"
                    class="pl-icon20 cs-black-fill"
                    :title="FLW_ACP_INFO.FLW_RMK"></v-icon>
                  <v-text-field
                    :value="CUST_CAUTION_INFO.CAUTION_CUST_STTS_CD && CUST_CAUTION_INFO.CAUTION_CUST_STATE == 'B2' ? CUST_CAUTION_INFO.CAUTION_DT : ''"
                    disabled
                    class="pl-form is-auto"
                  ></v-text-field>
                  <v-btn
                    v-if="true || CUST_CAUTION_INFO.CAUTION_CUST_HIST_YN && CUST_CAUTION_INFO.CAUTION_CUST_HIST_YN == 'Y'"
                    class="pl-btn is-sub is-sm">이력 </v-btn>
                </div>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- AS정보 -->
      <div class="is-mt-s">
        <table class="pl-tbl-detail ">
          <colgroup>
            <col width="127px" />
            <col width="25%" />
            <col width="127px" />
            <col width="" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  AS 접수번호
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.V_FLW_ACP_SN"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  처리상태
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="FLW_ACP_INFO.FLW_PGRS_SS_NM"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  시설구분
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="FLW_ACP_INFO.LCLS_NM"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  단지/동주소
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="FLW_ACP_INFO.MGOF_NM"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  동/시설
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.BLDG_NO"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  호/시설물
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.HS_NO"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  도로명 주소
                </span>
              </th>
              <td colspan="3">
                <v-text-field
                  v-model="FLW_ACP_INFO.BLDG_ADR"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  AS 구분
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.FLW_DS_NM"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  보수구분
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.FLW_DTL_DS_NM"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  공간
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.SPCE_NM"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  공종
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.CLS_NM"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  AS 접수내용
                </span>
              </th>
              <td colspan="3" class="has-textarea">
                <v-textarea
                  v-model="FLW_ACP_INFO.FLW_CTS"
                  disabled
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  height=80
                />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  비고
                </span>
              </th>
              <td colspan="3">
                <v-text-field
                  v-model="FLW_ACP_INFO.FLW_RMK"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 작업내용 -->
      <div class="is-mt-s">
        <table class="pl-tbl-detail ">
          <colgroup>
            <col width="127px" />
            <col width="25%" />
            <col width="127px" />
            <col width="" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  담당자
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.ICPR_EMPNM"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  업체명
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="FLW_ACP_INFO.FRM_NM"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  처리자
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="FLW_ACP_INFO.PRCR_NM"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  처리자 연락처
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="FLW_ACP_INFO.PRCR_TLNO"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  보수지시
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.RPR_NSTC_DT"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  반려일자
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.TDN_DT"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  방문 예정일
                </span>
              </th>
              <td colspan="3" >
                <v-text-field
                  v-model="FLW_ACP_INFO.VISITABLE_DT"
                  disabled
                  class="pl-form is-auto text-center"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  최초 등록일시
                </span>
              </th>
              <td colspan="3" >
                <v-text-field
                  v-model="FLW_ACP_INFO.FST_VST_RGS_DTTM"
                  disabled
                  class="pl-form is-auto "
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  반려사유
                </span>
              </th>
              <td colspan="3" >
                <v-text-field
                  v-model="FLW_ACP_INFO.TDN_RSN"
                  disabled
                  class="pl-form is-auto "
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  감독사유
                </span>
              </th>
              <td colspan="3" >
                <v-text-field
                  v-model="FLW_ACP_INFO.ARA_HDQ_RSN"
                  disabled
                  class="pl-form is-auto "
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  처리기한
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.RPR_XPC_DT"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  완료보고
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.RPR_CMPL_RPT_DT"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  AS 처리내용
                </span>
              </th>
              <td colspan="3">
                <v-text-field
                  v-model="FLW_ACP_INFO.CTS"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  보수완료
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.RPR_CMPL_DT"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  최종 수정일시
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="FLW_ACP_INFO.LST_CHG_DT"
                  disabled
                  class="pl-form is-auto"
                ></v-text-field>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>

    <!-- 접촉정보 등록/ 진행현황/ 세대 특이사항 -->
    <div class="pt-2 pr-3 pl-2 pb-3">
      <!-- 접촉정보 등록 -->
      <div>
        <v-form ref="cntctInfoForm">
          <div class="pl-header type-white">
            <div div class="pl-header--title ">접촉정보 등록</div>
            <template v-if="mixin_getCustcoSrvcStat('CNSLT_TOOL_YN')">
              <v-select
                v-model="CUTT_TOOL_CN"
                :items="CUTT_TOOL_LIST"
                item-text="TITLE"
                item-value="CONTENTS"
                return-object
                class="pl-form is-sm ml-4"
                placeholder="상담도구"
                @change="changeCuttToolCn"
              ></v-select>
              <v-btn
                class="pl-btn is-icon is-sub is-sm ml-2"
                :disabled="Number(CTI_CALL_STAT.replace('stat', '')) > 1 ? false : true"
                @click="mixin_showDialog('BalckArs')">
                <v-icon class="pl-icon20 userBlackARS"></v-icon>
                배려고객 ARS</v-btn>
            </template>
            <div class="spacing-wrap sp-4 ml-auto">
              <span
                v-if="AS_CNTCT_INFO.SURVEY_DSTN_NO && AS_CNTCT_INFO.SURVEY_DSTN_NO != ''"
                 class="pl-label">※ 해피콜 설문 완료됨</span>
              <span>
                <v-text-field
                  v-if="CUTT_TIME == '00:00:00'"
                  class="pl-form "
                  style="width:60px"
                  placeholder="통화시간"
                  disabled
                >
                </v-text-field>
                <v-text-field
                  v-else
                  v-model="CUTT_TIME"
                  class="pl-form "
                  style="width:60px"
                  placeholder="통화시간"
                  disabled
                >
                </v-text-field>
              </span>
              <v-btn class="pl-btn is-sm"
                @click="btnSaveAsCntctInfo">저장</v-btn>
            </div>
          </div>
          <div class="is-mt-s">
            <table class="pl-tbl-detail ">
              <colgroup>
                <col width="17%" />
                <col width="30%" />
                <col width="17%" />
                <col width="" />
              </colgroup>
              <tbody>
                <tr>
                  <th scope="row">
                    <span class="pl-label">
                      상담유형
                    </span>
                  </th>
                  <td colspan="3">
                    <compo-cutt-type-combo
                      :DataProp="AS_CNTCT_INFO.SCH_CUTT_TYPE"
                      :FormSeProp="'CUTT'"
                      :DisabledProp="false"
                      :ValidRuleProp="true"
                      @EMIT_CUTT_TYPE="setCuttType"
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
                      v-model="AS_CNTCT_INFO.CUTT_CN"
                      class="pl-form is-noresize"
                      :spellcheck="false"
                      height=""
                      :rules="validateRules.CUTT_CN" />
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <span class="pl-label">
                      인바운드 이관
                    </span>
                  </th>
                  <td >
                    <div class="spacing-wrap sp-4">
                      <div class="pl-selection-row">
                        <v-checkbox
                          v-model="AS_CNTCT_INFO.INBOUND_TRAN_YN"
                          class="pl-check"
                          @change="changeInboundTranYn"
                        ></v-checkbox>
                      </div>
                      <!-- 인바운드 이관 요청 내용 등록 v-menu -->
                      <div
                        v-if="dialogInboundReq"
                        style=" position: absolute; transform: translate(20px, 0px); width: 300px"
                        class="pl-drop-layer">
                        <v-form ref="cntctInboundReqForm">
                          <!-- header -->
                          <div class="d-flex">
                            <h3 style="font-size: 16px">요청내용</h3>
                            <v-btn
                              @click="btnCancelInboundReq"
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
                          <!-- form -->
                          <v-textarea
                            v-model="INBOUND_REQ_CNTNT"
                            height="120"
                            class="pl-form is-noresize is-mt-s"
                            :spellcheck="false"
                            placeholder="요청내용을 적어주세요."
                            :rules="validateInboundRules.INBOUND_REQ_CNTNT"
                          />
                          <div class="pl-btn-wrap is-mt-m">
                            <v-btn
                              class="pl-btn is-trans ml-auto"
                              @click="btnCancelInboundReq">취소</v-btn>
                            <v-btn class="pl-btn" @click="btnSaveInboundReq">저장</v-btn>
                          </div>
                        </v-form>
                      </div>
                      <span>{{AS_CNTCT_INFO.INBOUND_REQ_CNTNT}}</span>
                    </div>
                  </td>
                  <th scope="row">
                    <span class="pl-label">
                      제보
                    </span>
                  </th>
                  <td>
                    <div class="spacing-wrap sp-4">
                      <v-combobox
                        v-model="AS_CNTCT_INFO.modelChkRequest"
                        class="pl-form is-sm"
                        :items="mixin_common_code_get(this.common_code, 'RECM', '')"
                        multiple
                      />
                      <v-text-field
                        v-model="AS_CNTCT_INFO.modelChkRequestTime"
                        class="pl-form "
                        style="width:45px"
                        :disabled="AS_CNTCT_INFO.modelChkRequest.length > 0?false:true"
                      />
                      <v-text-field
                        v-model="AS_CNTCT_INFO.modelChkReason"
                        class="pl-form "
                        :disabled="AS_CNTCT_INFO.modelChkRequest.length > 0?false:true"
                      />


                    </div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <span class="pl-label">
                      접촉대상
                    </span>
                  </th>
                  <td >
                    <v-text-field
                      v-model="AS_CNTCT_INFO.ICPR_EMP_NM"
                      disabled
                      class="pl-form is-search is-auto"
                      placeholder="검색어 입력"
                      @click="mixin_showDialog('FindAsIcpr')">
                      <template v-slot:append>
                        <v-btn
                          @click="mixin_showDialog('FindAsIcpr')"
                          class="pl-btn has-icon-only">
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
                  <td>
                    <v-text-field
                      v-model="AS_CNTCT_INFO.ICPR_INFO"
                      disabled
                      class="pl-form is-auto"
                    ></v-text-field>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <span class="pl-label">
                      통화자
                    </span>
                  </th>
                  <td >
                    <v-text-field
                      v-model="AS_CNTCT_INFO.CALLER_NM"
                      class="pl-form is-auto"
                    ></v-text-field>
                  </td>
                  <th scope="row">
                    <div class="d-flex align-center">
                      <span class="pl-label">
                        연락처
                      </span>
                      <div class="pl-btn-wrap ml-auto">
                        <!-- 문자 버튼 -->
                        <compo-tooltip-btn
                          TitleProp="문자 보내기"
                          ClassProp="pl-tooltip-btn ml-auto"
                          IconProp="pl-icon20 td-in-sms"
                          TooltipPositionProp="bottom"
                          :MinWidthProp=22
                          :HeightProp=22
                          @btnClick="showSidePanel('SendSms')"
                        ></compo-tooltip-btn>
                        <!-- 전화 버튼 -->
                        <compo-tooltip-btn
                          TitleProp="전화 걸기"
                          ClassProp="pl-tooltip-btn ml-auto"
                          IconProp="pl-icon20 td-in-call"
                          TooltipPositionProp="bottom"
                          :MinWidthProp=22
                          :HeightProp=22
                          @btnClick="custPhnNoOutCall(AS_CNTCT_INFO.CALLER_TEL)"
                        ></compo-tooltip-btn>
                      </div>
                    </div>
                  </th>
                  <td>
                    <v-text-field
                      v-model="AS_CNTCT_INFO.CALLER_TEL"
                      class="pl-form is-auto"
                    ></v-text-field>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <span class="pl-label">
                      다건저장
                    </span>
                  </th>
                  <td >
                    <v-text-field
                      :value="MULTI_SAVE_LIST.length > 0 ? MULTI_SAVE_LIST.length + '건 선택됨' : ''"
                      readonly
                      class="pl-form is-search is-auto"
                      placeholder="검색어 입력"
                      @click="openMultiSaveDialog">
                      <template v-slot:append>
                        <v-btn
                          @click="openMultiSaveDialog"
                          class="pl-btn has-icon-only">
                          <span class="pl-icon20 in-search"></span>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </td>
                  <th scope="row">
                    <span class="pl-label">
                    </span>
                  </th>
                  <td>
                    <div class="spacing-wrap sp-4">

                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </v-form>
      </div>
      <!-- 진행현황 -->
      <div class="is-mt-m">
        <div class="pl-header type-white">
          <div div class="pl-header--title ">진행현황</div>
          <div class="spacing-wrap sp-4 ml-auto">
            <v-btn class="pl-btn is-sub is-sm"
              @click="mixin_showDialog('AsFlwAcpDetailHistory')">이력보기</v-btn>
            <v-btn class="pl-btn is-sm"
              @click="btnSaveRcvSchedulerStatus">저장</v-btn>
          </div>
        </div>
        <div class="is-mt-s">
          <table class="pl-tbl-detail ">
            <colgroup>
              <col width="17%" />
              <col width="18%" />
              <col width="17%" />
              <col width="" />
            </colgroup>
            <tbody>
              <tr>
                <th scope="row">
                  <v-checkbox
                    v-model="RCV_SCHEDULER_STATUS.RSRV_YMD_YN"
                    disabled
                    class="pl-check"
                    input-value="true"
                    >
                    <template v-slot:label>
                      <span class="pl-label">통화예약</span>
                    </template>
                  </v-checkbox>
                </th>
                <td>
                  <compo-date-picker
                    ClassProp=" "
                    DateType="dateInput"
                    @dateChange="changeRsrvYmd"
                    :DateProp.sync="RCV_SCHEDULER_STATUS.RSRV_YMD"/>
                </td>
                <th scope="row">
                  <v-checkbox
                    v-model="RCV_SCHEDULER_STATUS.VISIT_YMD_YN"
                    disabled
                    class="pl-check"
                    input-value="true"
                    >
                    <template v-slot:label>
                      <span class="pl-label">방문 확정일</span>
                    </template>
                  </v-checkbox>
                </th>
                <td>
                  <div class="spacing-wrap sp-4">
                    <compo-date-picker
                      ClassProp=""
                      StyleProp="flex: 0 0 120px"
                      DateType="dateInput"
                      @dateChange="changeVisitYmd"
                      :DateProp.sync="RCV_SCHEDULER_STATUS.VISIT_YMD"
                      :DisabledProp="RCV_SCHEDULER_STATUS.DEL_YN ? true : false"/>
                    <v-select
                      v-model="RCV_SCHEDULER_STATUS.VISIT_S_H"
                      :items="HOUR_LIST"
                      style="flex: 0 0 70px"
                      class="pl-form"
                      :disabled="RCV_SCHEDULER_STATUS.DEL_YN ? true : false"
                      placeholder="선택"
                    ></v-select>
                    <span class="pl-unit">~</span>
                    <v-select
                      v-model="RCV_SCHEDULER_STATUS.VISIT_E_H"
                      :items="HOUR_LIST"
                      style="flex: 0 0 70px"
                      class="pl-form"
                      :disabled="RCV_SCHEDULER_STATUS.DEL_YN ? true : false"
                      placeholder="선택"
                    ></v-select>
                    <v-checkbox
                      v-model="RCV_SCHEDULER_STATUS.DEL_YN"
                      class="pl-check"
                      label="삭제"
                      input-value=""
                      @change="changeSchedulerStatusDelYn"
                    ></v-checkbox>

                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <v-checkbox
                    v-model="RCV_SCHEDULER_STATUS.SCH_STAT_TYPE_YN"
                    class="pl-check"
                    disabled
                    >
                    <template v-slot:label>
                      <span class="pl-label">완료유형</span>
                    </template>
                  </v-checkbox>
                </th>
                <td>
                  <v-select
                    v-model="RCV_SCHEDULER_STATUS.SCH_STAT_TYPE"
                    :items="SCH_STAT_TYPE_LIST"
                    class="pl-form"
                    placeholder="선택"
                    @change="changeSchStatType"
                  ></v-select>
                </td>
                <th scope="row">
                  <v-checkbox
                    v-model="RCV_SCHEDULER_STATUS.WORK_TYPE_YN"
                    class="pl-check"
                    disabled

                    >
                    <template v-slot:label>
                      <span class="pl-label">제외유형</span>
                    </template>
                  </v-checkbox>
                </th>
                <td>
                  <v-select
                    v-model="RCV_SCHEDULER_STATUS.WORK_TYPE"
                    :items="WORK_TYPE_LIST"
                    class="pl-form"
                    placeholder="선택"
                    :disabled="disabledWorkType"
                    @change="changeWorkType"
                  ></v-select>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <v-checkbox
                    v-model="RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN"
                    class="pl-check"
                    >
                    <template v-slot:label>
                      <span class="pl-label">메모</span>
                    </template>
                  </v-checkbox>
                </th>
                <td colspan="3">
                  <v-text-field
                    v-model="RCV_SCHEDULER_STATUS.RSRV_CNTNT"
                    class="pl-form is-auto"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 세대 특이사항 -->
      <div class="is-mt-m">
        <div class="pl-header type-white">
          <div div class="pl-header--title ">세대 특이사항 </div>
        </div>
        <div class="is-mt-s">
          <v-data-table
            class="pl-grid"
            :headers="headers"
            :items="HSH_MMO_LIST"
            fixed-header
            item-key="ROW_NUMBER"
            height="247px"
            no-data-text="등록된 데이터가 없습니다."
            :items-per-page="ROW_PER_PAGE"
            hide-default-footer
            :page.sync="page"
            @page-count="pageCount = $event">
          </v-data-table>
        </div>
      </div>

    </div>
    <!-- mark:// dialog: 전화걸기 -->
    <v-dialog
      v-if="dialogOutCall"
      v-model="dialogOutCall"
      content-class="dialog-draggable is-call"
      persistent
      no-click-animation
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="전화 걸기"
        @hide="mixin_hideDialog('OutCall')"
      >
        <template slot="body">
          <!-- component -->
          <compo-out-call
            :DataProp="OUT_CALL_DATA"
          />
        </template>
        <template slot="footer">
          <ul class="pl-list-info mt-0">
            <li>고객 조회 후 연락처가 있는 경우 수신번호는 변경할 수 없습니다.</li>
          </ul>
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- SMS 발송 -->
    <v-dialog
      v-if="dialogSendSMS"
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
    <!-- dialog: 단지정보 -->
    <v-dialog
      v-if="dialogAsMgofInfo"
      v-model="dialogAsMgofInfo"
      width="1400"
      content-class="dialog-draggable is-lg is-maxHeight"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="단지 정보 "
        BodyStyleProp="height: 785px; min-height: 785px; flex:0; padding-top: 4px"
        @hide="mixin_hideDialog('AsMgofInfo')"
        @submit="submitDialog('AsMgofInfo')"
        >
        <template slot="body">
          <CompoAsMgofInfo
            :DataProp="{ARA_HDQ_CD: selectedItem.ARA_HDQ_CD, MGOF_CD: selectedItem.MGOF_CD, MGOF_NM: selectedItem.MGOF_NM, BLDG_NO: FLW_ACP_INFO.BLDG_NO, HS_NO: FLW_ACP_INFO.HS_NO}"
          />
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: 공용부 이력 -->
    <v-dialog
      v-if="dialogAsInitHist"
      v-model="dialogAsInitHist"
      width="1600"
      content-class="dialog-draggable is-lg "
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="공용부 이력"
        BodyStyleProp="height: 666px; min-height: 666px; flex:0;"
        @hide="mixin_hideDialog('AsInitHist')"
        @submit="submitDialog('AsInitHist')"
        :FooterProp=false
        >
        <template slot="body">
          <CompoAsInitHist
            :DataProp="{ARA_HDQ_CD: selectedItem.ARA_HDQ_CD, MGOF_CD: selectedItem.MGOF_CD, MGOF_NM: selectedItem.MGOF_NM, BLDG_NO: FLW_ACP_INFO.BLDG_NO}"
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
        @submit="submitDialog('FindAsIcpr')"
        >
        <template slot="body">
          <CompoFindAsIcpr
            :DataProp="{ARA_HDQ_CD: selectedItem.ARA_HDQ_CD, MGOF_CD: selectedItem.MGOF_CD, MGOF_NM: selectedItem.MGOF_NM, MNTN_USR_DS_CD: selectedItem.MNTN_USR_DS_CD}"
            @setItem="setIcpr"
            @closeDialog="mixin_hideDialog('FindAsIcpr')"
          />
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: 다건 저장 -->
    <v-dialog
      v-if="dialogFindAsMultiSave"
      v-model="dialogFindAsMultiSave"
      width="1410"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="다건저장 대상 조회"
        @hide="mixin_hideDialog('FindAsMultiSave')"
        @submit="submitDialog('FindAsMultiSave')"
        >
        <template slot="body">
          <CompoFindAsMultiSave
            ref="multiSave"
            :DataProp="{MGOF_CD: FLW_ACP_INFO.MGOF_CD, MGOF_NM: FLW_ACP_INFO.MGOF_NM,
              FRM_CD: FLW_ACP_INFO.FRM_CD, FRM_NM: FLW_ACP_INFO.FRM_NM,
              SEL_FLW_DTL_FULL_SN: FLW_ACP_INFO.FLW_DTL_FULL_SN, EMP_NO: selectedItem.EMP_NO}"
            @setItem="setMultiSave"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('FindAsMultiSave')">닫기</v-btn>
          <v-btn class="pl-btn" @click="$refs.multiSave.setItem()">적용</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!--진행현황 이력보기-->
    <v-dialog
      v-if="dialogAsFlwAcpDetailHistory"
      v-model="dialogAsFlwAcpDetailHistory"
      width="1410"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="진행현황 이력조회"
        @hide="mixin_hideDialog('AsFlwAcpDetailHistory')"
        @submit="submitDialog('AsFlwAcpDetailHistory')"
        >
        <template slot="body">
          <CompoAsFlwAcpDetail_HISTORY
            :DataProp="{FLW_DTL_FULL_SN: FLW_ACP_INFO.FLW_DTL_FULL_SN}"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('AsFlwAcpDetailHistory')">닫기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- dialog: 해피콜 -->
    <v-dialog
      v-if="dialogHappyCallSurvey"
      v-model="dialogHappyCallSurvey"
      content-class="dialog-draggable is-lg is-maxHeight"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        :header-title="`만족도 조사(${happycallDialogTitle})`"
        @hide="mixin_hideDialog('HappyCallSurvey')"
      >
        <template slot="body">
          <CompoAsHappyCallSurvey
            ref="happycall"
            :DataProp="{CUST_ID: CUST_INFO.CUST_ID, FLW_DTL_FULL_SN: selectedItem.FLW_DTL_FULL_SN, SURVEY_DSTN_NO: selectedItem.SURVEY_DSTN_NO}"
            @setDialogTitle="setHappycallDialogTitle"
            @disableSaveBtn="disableHappycallSaveBtn"
            @closeDialog="closeDialogHappycall"
          />
        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('HappyCallSurvey')">닫기</v-btn>
          <v-btn
            class="pl-btn"
            @click="$refs.happycall.btnSave()"
            :disabled="isDisableHappycallSaveBtn">저장</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>


    <!-- dialog: 배려고객ARS -->
    <v-dialog
      v-id="dialogBalckArs"
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
import CompoSendSms from '@/components/CompoSendSms'
import CompoAsMgofInfo from '@/components/CompoAsMgofInfo.vue';
import CompoAsInitHist from '@/components/CompoAsInitHist.vue';
import CompoFindAsIcpr from '@/components/CompoFindAsIcpr.vue';
import CompoFindAsMultiSave from '@/components/CompoFindAsMultiSave.vue';
import CompoAsFlwAcpDetail_HISTORY from '@/components/CompoAsFlwAcpDetail_HISTORY.vue';
import CompoCuttTypeCombo from '@/components/CompoCuttTypeCombo.vue'
import CompoAsHappyCallSurvey from '@/components/CompoAsHappyCallSurvey.vue'
import CompoBlackArs from '@/components/CompoBlackArs.vue'

export default {
  name: "CompoAsScheduler_DETAIL", //스케쥴러 정보
  components: {
    CompoSendSms,
    CompoAsMgofInfo,
    CompoAsInitHist,
    CompoFindAsIcpr,
    CompoFindAsMultiSave,
    CompoAsFlwAcpDetail_HISTORY,
    CompoCuttTypeCombo,
    CompoAsHappyCallSurvey,
    CompoBlackArs
  },
  data() {
    return {
      //dialog
      dialogFindAsIcpr: false,
      dialogFindAsMultiSave: false,

      //인바운드 이관 요청 다이얼로그
      dialogInboundReq: false,
      //해피콜 다이얼로그
      dialogHappyCallSurvey: false,
      happycallDialogTitle: '',
      isDisableHappycallSaveBtn : false,

      common_code: [],

      CUTT_TOOL_CN : '', //상담도구 문구구
      CUTT_TOOL_LIST : [], //상담도구

      //접수부서, 접수자
      USER_DEPT_ID: this.$store.getters["authStore/GE_AUTH_LOGIN_DATA"].DEPT_ID,


      //스케줄러 목록에서 선택된 항목
      selectedItem: {},
      FLW_DTL_FULL_SN: '',
      NEW_YN: '',
      HNO: '',
      SCH_STAT_CD: '',


      //상세 정보
      CUST_INFO: {},  //고객 정보
      CUST_CAUTION_INFO: {},  //배려고객 정보
      FLW_ACP_INFO: {}, //AS접수/ 작업내용 조회
      RCV_SCHEDULER_STATUS: {}, //스케줄러 현황 조회

      //RCV_SCHEDULER_HIST: [], //진행현황 이력보기 - 다이얼로그
      AS_CNTCT_INFO: {
        modelChkRequest: [],
        modelChkRequestTime: '00:00',
        modelChkReason: '',
      }, //접촉정보등록 정보

      // 제보요청


      //인바운드 이관 다이얼로그 - 요청 내용.
      INBOUND_REQ_CNTNT: '',

      //다건 저장 정보
      MULTI_SAVE_LIST: [],

      // 선택된 상담유형(마지막 단계까지 선태됨.)
      SELECTED_CUTT_TYPE: {},


      //시간 목록
      HOUR_LIST: [{text: "선택", value: ""},
        {text: "1시", value: "01"}, {text: "2시", value: "02"}, {text: "3시", value: "03"}, {text: "4시", value: "04"}, {text: "5시", value: "05"}, {text: "6시", value: "06"},
        {text: "7시", value: "07"}, {text: "8시", value: "08"}, {text: "9시", value: "09"}, {text: "10시", value: "10"}, {text: "11시", value: "11"}, {text: "12시", value: "12"},
        {text: "13시", value: "13"}, {text: "14시", value: "14"}, {text: "15시", value: "15"}, {text: "16시", value: "16"}, {text: "17시", value: "17"}, {text: "18시", value: "18"},
        {text: "19시", value: "19"}, {text: "20시", value: "20"}, {text: "21시", value: "21"}, {text: "22시", value: "22"},  {text: "23시", value: "23"},
      ],



      SCH_STAT_TYPE_LIST: [],
      WORK_TYPE_LIST: [],
      disabledWorkType: true,


      //콜아이디
      CALL_ID: '',
      //통화시간
      CL_WHOL_HR: '',
      SAVE_AFTER_ACTION: {text: '저장 후 대기', value: 'stat5', evt: 'Ready', active : false, disabled : false},
      //SAVE_AFTER_ACTION: {text: '저장 후 OB후처리', value: 'stat4', evt: 'OBAftCall', active : false, disabled : false},

      userInfo : {},

      // 세대 특이사항
      HSH_MMO_LIST: [],
      page: 1,
      ROW_PER_PAGE: -1,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '세대 특이사항', value: 'CTS', align: '',sortable: false},
        { text: '작성자', value: 'RGPR',  width: '120px' , sortable: false},
        { text: '작성일', value: 'WOU_DT', align: '', width: '120px' , sortable: false},
      ],
      items: [
      ],

      // 전화 걸기
      dialogOutCall: false,
      OUT_CALL_DATA: {
        dropItems: ['마이홈센터'],
        dropItems2: [],
        CUST_PHN_NO: '010-5303-0000',
      },

      // SMS발송
      dialogSendSMS: false,

      // 단지정보, 공용부 이력
      dialogAsMgofInfo : false,
      dialogAsInitHist: false,
      //진행현황 이력보기 다이얼로그
      dialogAsFlwAcpDetailHistory: false,
      // 배려고객 ARS
      dialogBalckArs: false,

      //문자 발송자명
      SMS_DIST_EMP_NM: '',

      //이전
      PREV_CNSLT_DIV_CD_1: '',

      //배려 고객
      EXEC_CAUTION_LIST : [], //경고 구사 이력
      TEMP_CUST_BLOCK_YN : false, //임시 차단 여부


      validateRules: {
        CUTT_CN : [
          v => !!v || '필수 입력 항목 입니다.',
        ],
        NO_RULE : [
          v => true,
        ],
      },
      validateInboundRules: {
        INBOUND_REQ_CNTNT : [
          v => !!v || '필수 입력 항목 입니다.',
        ],
      }
    }
  },
  methods: {

    async getCommonCodeList() {
      const codeName = ['RECM', 'SST9', 'WP'];
      this.common_code = await this.mixin_common_code_get_all(codeName);
      this.SCH_STAT_TYPE_LIST = this.mixin_common_code_get(this.common_code, 'SST9', '선택');
      this.WORK_TYPE_LIST = this.mixin_common_code_get(this.common_code, 'WP', '선택');
    },


    //스케줄러 상세 초기화
    initSchedulerDetail() {
      this.$refs.cntctInfoForm.resetValidation()
      this.CUST_INFO = {};
      this.FLW_ACP_INFO = {};
      this.RCV_SCHEDULER_STATUS = {

      };
      this.HSH_MMO_LIST = [];
      this.SMS_DIST_EMP_NM = '';
      //접촉정보 초기화
      this.initCntctInfo();
    },

    //스케줄러 목록에서 더블 클릭 시, eventBus 통해서 실행됨.
    async setSchedulerDetail(item) {
      this.selectedItem = item;

      this.initSchedulerDetail();
      this.$eventBus.$emit('setCuttHistInfo', {TAB_IDX: "0", CUST_INFO: {}});

      if(this.selectedItem && this.selectedItem.FLW_DTL_FULL_SN) {
        //스케줄러 진행현황 조회
        this.getRcvSchedulerStatus();
        //진행현황영역 내용 세팅
        this.setRcvSchedulerStatus();

        //고객정보 조회
        await this.getFlwAcpCust();

        //AS 접수 상세 조회
        await this.getNewFlwAcpDetail();


        //세대특이사항 목록 조회
        this.getHshMmoList();

        //배려고객 정보 조회
        this.getCustCaution();

        //상담 이력 조회
        //상담 - 이력 정보의 (신)AS 접수이력 세팅.
        this.$eventBus.$emit('setCuttHistInfo', {TAB_IDX: "0", CUST_INFO: this.CUST_INFO});
      }


    },

    //접촉정보등록, 진행현황 초기화.
    initCntctInfo() {
      this.$refs.cntctInfoForm.resetValidation()
      this.CALL_ID = '';
      this.CUTT_TOOL_CN = '';
      this.AS_CNTCT_INFO = {
        modelChkRequest: [],
        modelChkRequestTime: '00:00',
        modelChkReason: ''
      };
      this.MULTI_SAVE_LIST = [];
      this.SELECTED_CUTT_TYPE = {};

      this.AS_CNTCT_INFO.SCH_CUTT_TYPE = ['','',''];
      this.PREV_CNSLT_DIV_CD_1 = '';


      //배려고객 정보
      this.EXEC_CAUTION_LIST = []; //경고 구사 이력
      this.TEMP_CUST_BLOCK_YN = false; //임시 차단 여부

      //접촉정보 설정
      this.AS_CNTCT_INFO.CALLER_NM = this.FLW_ACP_INFO.CVPR_NM
      this.AS_CNTCT_INFO.CALLER_TEL = this.FLW_ACP_INFO.MBL_NO
      this.AS_CNTCT_INFO.ICPR_INFO = "/접수고객";
      this.AS_CNTCT_INFO.CNTCT_CHNL_CD = "999";
      this.AS_CNTCT_INFO.RECMD_CNTNT = '';
      this.disabledWorkType = true;
    },

    //진행현황 초기화.
    initRcvSchedulerStatus(schStatCd = '') {
      this.RCV_SCHEDULER_STATUS = {
        WORK_TYPE: '', // 제외유형
        RSRV_YMD_YN: false,
        RSRV_YMD: '',
        VISIT_YMD_YN: false,
        VISIT_YMD: '',
        VISIT_S_H: '',
        VISIT_E_H: '',
        RSRV_CNTNT_YN: false,
        RSRV_CNTNT: '',
        SCH_STAT_TYPE_YN: false,
        SCH_STAT_TYPE: '',
      };
      this.RCV_SCHEDULER_STATUS.H_SCH_STAT_CD = schStatCd;
      this.disabledWorkType = true;
    },

    //고객정보 조회
    async getFlwAcpCust() {
      const postParam = {
        ARA_HDQ_CD : this.selectedItem.ARA_HDQ_CD ? this.selectedItem.ARA_HDQ_CD : '',
        FLW_RGS_DT : this.selectedItem.FLW_RGS_DT ? this.selectedItem.FLW_RGS_DT : '',
        FLW_ACP_SN : this.selectedItem.FLW_ACP_SN ? this.selectedItem.FLW_ACP_SN : '',
        FLW_DTL_SN : this.selectedItem.FLW_DTL_SN ? this.selectedItem.FLW_DTL_SN : '',
        HNO : this.selectedItem.HNO ? this.selectedItem.HNO : '',
      };
      const headParam = {head: {}};
      const response = await this.common_postCall("/phone-api/as/flwacp/selectFlwAcpCust", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.CUST_INFO = response.DATA[0] ? response.DATA[0] : {};
        this.CUST_INFO.HO_ADM_NO = this.selectedItem.HNO;
      }
    },

    //배려고객 조회
    async getCustCaution() {
      const postParam = {
        PHN_NO : this.FLW_ACP_INFO.MBL_NO ? this.FLW_ACP_INFO.MBL_NO : '',
        HNO : this.selectedItem.HNO ? this.selectedItem.HNO : '',
      };
      const headParam = {
          head: {
              ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper'
          }
      };
      const response = await this.common_postCall("/api/biz/common/select/selectAsCustCaution", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.CUST_CAUTION_INFO = response.DATA[0] ? response.DATA[0] : {};

        if(this.CUST_CAUTION_INFO.CAUTION_CUST_STTS_CD && this.CUST_CAUTION_INFO.CAUTION_CUST_STATE == 'B1') {
          this.FLW_ACP_INFO.FLW_RMK += "/ 배려고객(" + this.CUST_CAUTION_INFO.CAUTION_CUST_STTS_NM + ")";
        }
      }
    },


    //스케줄러 진행현황 조회
    async getRcvSchedulerStatus() {
      const postParam = {
        FLW_DTL_FULL_SN: this.selectedItem.FLW_DTL_FULL_SN,
      };
      const headParam = {
          head: {
              ns: 'lhcs.phone.as.dao.PhoneAsSchedulerMapper'
          }
      };
      const response = await this.common_postCall("/api/biz/common/select/selectCallRcvSchedulerStatus", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0) {
          this.SMS_DIST_EMP_NM = response.DATA[0].EMP_NM;
        } else {
          this.SMS_DIST_EMP_NM = '';
        }
      }
    },

    //진행현황 세팅 - 선택된 row에 정보가 다 있음.
    setRcvSchedulerStatus() {
      this.initRcvSchedulerStatus();
      this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN = this.selectedItem.WORK_TYPE && this.selectedItem.WORK_TYPE != '' ? true : false; // 제외유형 체크박스
      this.RCV_SCHEDULER_STATUS.WORK_TYPE = this.selectedItem.WORK_TYPE ? this.selectedItem.WORK_TYPE : ''; // 제외유형
      this.RCV_SCHEDULER_STATUS.RSRV_YMD_YN = this.selectedItem.RSRV_YMD && this.selectedItem.RSRV_YMD != '' ? true : false; // 통화예정일 체크박스
      this.RCV_SCHEDULER_STATUS.RSRV_YMD = this.selectedItem.RSRV_YMD ? this.selectedItem.RSRV_YMD : ''; // 통화예정일
      this.RCV_SCHEDULER_STATUS.VISIT_YMD_YN = this.selectedItem.VISIT_YMD && this.selectedItem.VISIT_YMD != '' ? true : false; // 방문확정일 체크박스
      this.RCV_SCHEDULER_STATUS.VISIT_YMD = this.selectedItem.VISIT_YMD ? this.selectedItem.VISIT_YMD : ''; // 방문확정일
      this.RCV_SCHEDULER_STATUS.VISIT_S_H = this.selectedItem.VISIT_S_H ? this.selectedItem.VISIT_S_H : ''; // 방문확정시작시간
      this.RCV_SCHEDULER_STATUS.VISIT_E_H = this.selectedItem.VISIT_E_H ? this.selectedItem.VISIT_E_H : '';// 방문확정종료시간
      this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN = this.selectedItem.RSRV_CNTNT && this.selectedItem.RSRV_CNTNT != '' ? true : false; // 메모 체크박스
      this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = this.selectedItem.RSRV_CNTNT ? this.selectedItem.RSRV_CNTNT : ''; // 메모
      this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE_YN = this.selectedItem.SCH_STAT_TYPE && this.selectedItem.SCH_STAT_TYPE != '' ? true : false; // 완료유형 체크박스
      this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE = this.selectedItem.SCH_STAT_TYPE ? this.selectedItem.SCH_STAT_TYPE : ''; // 완료유형
    },

    //AS 접수 상세 조회
    async getNewFlwAcpDetail() {
      const postParam = {
        HIST_TYPE: this.selectedItem.NEW_YN,
        ARA_HDQ_CD : this.selectedItem.ARA_HDQ_CD ? this.selectedItem.ARA_HDQ_CD : '',
        FLW_RGS_DT : this.selectedItem.FLW_RGS_DT ? this.selectedItem.FLW_RGS_DT : '',
        FLW_ACP_SN : this.selectedItem.FLW_ACP_SN ? this.selectedItem.FLW_ACP_SN : '',
        FLW_DTL_SN : this.selectedItem.FLW_DTL_SN ? this.selectedItem.FLW_DTL_SN : '',
        MGOF_CD : this.selectedItem.MGOF_CD ? this.selectedItem.MGOF_CD : '',
        HNO : this.selectedItem.HNO ? this.selectedItem.HNO : '',
      };
      console.log("CompoAsScheduler_DETAIL selectCotisFlwAcpDetail", postParam)
      if(postParam.ARA_HDQ_CD == '') {
        //this.showAlertInfo({msg: "상세 조회를 위한 필수 정보가 없습니다. 관리자에게 문의 바랍니다.(" + postParam.ARA_HDQ_CD + "," + postParam.FLW_RGS_DT + "," + postParam.FLW_ACP_SN + "," + postParam.FLW_DTL_SN + ")"})
        return false;
      }

      const headParam = {head: {}};
      const response = await this.common_postCall("/phone-api/as/flwacp/selectCotisFlwAcpDetail", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        let tempItem = response.DATA[0];
        tempItem.FLW_DTL_FULL_SN = tempItem.ARA_HDQ_CD + "-" + tempItem.FLW_RGS_DT + "-" + tempItem.FLW_ACP_SN + "-" + tempItem.FLW_DTL_SN;

        tempItem.BLDG_NO = tempItem.BLDG_NO ? tempItem.BLDG_NO.replace(/\D/g, "") : '';
        tempItem.HS_NO = tempItem.HS_NO ? tempItem.HS_NO.replace(/\D/g, "") : '';

        tempItem.FLW_RGS_DT = this.mixin_convertDate(tempItem.FLW_RGS_DT, 'yyyy-MM-dd')
        tempItem.MBL_NO = this.mixin_setPhoneNo(tempItem.MBL_NO);
        tempItem.PRCR_TLNO = this.mixin_setPhoneNo(tempItem.PRCR_TLNO);

        tempItem.JOB_ICPR_EMPNM = tempItem.ICPR_EMPNM
        tempItem.JOB_FRM_NM = tempItem.FRM_NM
        tempItem.TDN_DT = this.mixin_convertDate(tempItem.TDN_DT, 'yyyy-MM-dd')
        tempItem.TDN_RSN = tempItem.TDN_RSN && tempItem.TDN_RSN.trim() != "" ?  tempItem.TDN_RSN : tempItem.AGR_MPBL_RSN;
        tempItem.TRAN_HDQ_DT = this.mixin_convertDate(tempItem.TRAN_HDQ_DT, 'yyyy-MM-dd')
        tempItem.RPR_NSTC_DT = this.mixin_convertDate(tempItem.RPR_NSTC_DT, 'yyyy-MM-dd')
        tempItem.VST_DT = this.mixin_convertDate(tempItem.VST_FIR_DT, 'yyyy-MM-dd') + " / " + this.mixin_convertDate(tempItem.VST_SEC_DT, 'yyyy-MM-dd') + " / " + this.mixin_convertDate(tempItem.VST_THI_DT, 'yyyy-MM-dd') + (tempItem.VST_RMK && tempItem.VST_RMK != "" ? " (" + tempItem.VST_RMK + ")" : "" )

        tempItem.RPR_XPC_DT = this.mixin_convertDate(tempItem.RPR_XPC_DT, 'yyyy-MM-dd')
        tempItem.RPR_CMPL_RPT_DT = this.mixin_convertDate(tempItem.RPR_CMPL_RPT_DT, 'yyyy-MM-dd')
        tempItem.RPR_CMPL_DT = this.mixin_convertDate(tempItem.RPR_CMPL_DT, 'yyyy-MM-dd')

        tempItem.LST_CHG_DT = (tempItem.LST_CHG_DT ? tempItem.LST_CHG_DT : '') + (tempItem.LST_CHG_NM && tempItem.LST_CHG_NM != "" ? " (" + tempItem.LST_CHG_NM + ")" : "");
        tempItem.LAST_RPR_DATE = (new Date(Date.now() - (15 * 24 * 60 * 60 * 1000) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)// 현재일 기준 15일 이전 날짜 계산
        tempItem.MGOF_CD = this.selectedItem.MGOF_CD;
        tempItem.MGOF_NM = this.selectedItem.MGOF_NM;
        this.FLW_ACP_INFO = tempItem;

        //접촉정보 설정
        this.AS_CNTCT_INFO.CALLER_NM = this.FLW_ACP_INFO.CVPR_NM
        this.AS_CNTCT_INFO.CALLER_TEL = this.FLW_ACP_INFO.MBL_NO
        this.AS_CNTCT_INFO.ICPR_INFO = "/접수고객";
        this.AS_CNTCT_INFO.CNTCT_CHNL_CD = "999";
        this.AS_CNTCT_INFO.SURVEY_DSTN_NO = this.selectedItem.SURVEY_DSTN_NO;

        this.CUST_INFO.CUST_PHN_NO = this.FLW_ACP_INFO.MBL_NO;

      }
    },

    //세대특이사항
    async getHshMmoList() {
        const postParam = {
          ARA_HDQ_CD: this.selectedItem.ARA_HDQ_CD,
          MGOF_CD: this.selectedItem.MGOF_CD,
          HNO: this.selectedItem.HNO
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsFlwAcpMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectHshMmoList", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          this.HSH_MMO_LIST = response.DATA;
        }
    },

    //상담유형 설정.
    setCuttType(data, selectedData) {
      if((this.PREV_CNSLT_DIV_CD_1 == '' || this.PREV_CNSLT_DIV_CD_1 != data[0]) && data[0] == "0801") {
        this.openHappyCallSurvey();
      }
      this.AS_CNTCT_INFO.SCH_CUTT_TYPE = data;
      this.SELECTED_CUTT_TYPE = selectedData;
      this.PREV_CNSLT_DIV_CD_1 = data[0];

    },

    //접촉정보 저장 버튼
    btnSaveAsCntctInfo() {

      //validation check
      if(!this.validateDetail()) return;


      let confirmMsg = "저장하시겠습니까";
      //통화자 체크
   		if (!this.AS_CNTCT_INFO.CALLER_NM || this.AS_CNTCT_INFO.CALLER_NM == "") {
        confirmMsg = "통화자 등록 없이 상담저장 하시겠습니까?";
   		}

      this.showConfirmInfo({
        msg: confirmMsg
        , callYes: () => {
          this.asCntctSave();
        }
        , callNo: this.closeAlert
      })

    },

    validateDetail () {
      //상담상세내역 필수값 체크.
      if(!this.$refs.cntctInfoForm.validate()) {
        return false;
      }
      return true;
    },

    //접촉정보 저장
    async asCntctSave() {

      const postParam = {
        RCPT_DEPT_ID: this.USER_DEPT_ID, //접수_부서_ID
        PRCS_DEPT_ID: this.USER_DEPT_ID, //처리_부서_ID
        CUST_ID : this.CUST_INFO.CUST_ID, //고객번호
        HNO : this.selectedItem.HNO, //세대번호
        CALL_ID: this.CALL_ID,  //콜아이디
        // CL_WHOL_HR: '', //콜_전체_시간
        PHN_HR : this.mixin_timeToSec(this.CUTT_TIME), //상담 시간
        AFTPRCS_HR : this.mixin_timeToSec(this.AFT_PROC_TIME), //후처리 시간

        FLW_DTL_FULL_SN : this.FLW_ACP_INFO.FLW_DTL_FULL_SN, //AS접수풀번호
        MGOF_CD : this.selectedItem.MGOF_CD, //단지코드

        CNSLT_DIV_CD_1 : this.AS_CNTCT_INFO.SCH_CUTT_TYPE[0], //상담유형 1Dept 코드
        CNSLT_DIV_CD_2 : this.AS_CNTCT_INFO.SCH_CUTT_TYPE[1], //상담유형 2Dept 코드
        CNSLT_DIV_CD_3 : this.AS_CNTCT_INFO.SCH_CUTT_TYPE[2], //상담유형 3Dept 코드
        CUTT_TYPE_ID : this.AS_CNTCT_INFO.SCH_CUTT_TYPE[2], //상담유형 3Dept 코드
        CNSLT_DIV_PATH_NM : this.SELECTED_CUTT_TYPE.text ? this.SELECTED_CUTT_TYPE.text.replace(/\>/g, ' -> ') : '', //상담유형 FULL_PATH
        CNTCT_CHNL_CD : this.AS_CNTCT_INFO.CNTCT_CHNL_CD, //접촉채널
        ICPR_EMP_NO : this.AS_CNTCT_INFO.ICPR_EMP_NO, //접촉대상
        ICPR_INFO : this.AS_CNTCT_INFO.ICPR_INFO, //소속정보
        CALLER_TEL : this.AS_CNTCT_INFO.CALLER_TEL ? this.AS_CNTCT_INFO.CALLER_TEL.replace(/-/gi, '') : '', //연락처
        CALLER_NM : this.AS_CNTCT_INFO.CALLER_NM, //이름
        CUTT_CN : this.AS_CNTCT_INFO.CUTT_CN, //상담내용

        // 인바운드이관 ----
   			CHK_INBOUND : this.AS_CNTCT_INFO.INBOUND_TRAN_YN ? "T" : "F",
   			INBOUND_REQ_CNTNT : this.AS_CNTCT_INFO.INBOUND_REQ_CNTNT ?  this.AS_CNTCT_INFO.INBOUND_REQ_CNTNT : '', //요청내용,


        SURVEY_DSTN_NO : this.AS_CNTCT_INFO.SURVEY_DSTN_NO,
        // RECPATH : JQUERY("#RECPATH").VAL(),


        // 다건저장-------------------------------------------------------------
        FLW_DTL_FULL_SN_LIST : this.MULTI_SAVE_LIST.length > 0 ? this.MULTI_SAVE_LIST.map(item => item.FLW_DTL_FULL_SN).join(",") : '',
        MGOF_CD_LIST : this.MULTI_SAVE_LIST.length > 0 ? this.MULTI_SAVE_LIST.map(item => item.MGOF_CD).join(",") : '',
        HNO_LIST : this.MULTI_SAVE_LIST.length > 0 ? this.MULTI_SAVE_LIST.map(item => item.HNO).join(",") : '',
        CUST_ID_LIST : this.MULTI_SAVE_LIST.length > 0 ? this.MULTI_SAVE_LIST.map(item => item.CUST_ID).join(",") : '',

        //배려고객
        EXEC_CAUTION_LIST: this.EXEC_CAUTION_LIST.length > 0 ? JSON.stringify(this.EXEC_CAUTION_LIST): '',
        CAUTION_CUST_STTS_CD:  this.TEMP_CUST_BLOCK_YN?'REQ01':'', //임시차단인 경우 상태값 임시차단(REQ01)

        // RCPT_PHN_ID: this.AS_CNTCT_INFO.RCPT_PHN_ID ? this.AS_CNTCT_INFO.RCPT_PHN_ID : '',
        // RCPT_CLBK_ID: this.AS_CNTCT_INFO.RCPT_CLBK_ID ? this.AS_CNTCT_INFO.RCPT_CLBK_ID : '',
        // RCPT_ETC_ID: this.AS_CNTCT_INFO.RCPT_ETC_ID ? this.AS_CNTCT_INFO.RCPT_ETC_ID : '',
        // RCPT_CHN_CD: this.AS_CNTCT_INFO.RCPT_CHN_CD ? this.AS_CNTCT_INFO.RCPT_CHN_CD : '',

        //진행현황
        // RSRV_YMD : this.RCV_SCHEDULER_STATUS.RSRV_YMD ? this.RCV_SCHEDULER_STATUS.RSRV_YMD.replace(/-/gi, '') : '', //통화예정일
        // VISIT_YMD : this.RCV_SCHEDULER_STATUS.VISIT_YMD, //방문확정일
        // VISIT_S_H : this.RCV_SCHEDULER_STATUS.VISIT_S_H, //시작일
        // VISIT_E_H : this.RCV_SCHEDULER_STATUS.VISIT_E_H, //종료일
        // RSRV_CNTNT : this.RCV_SCHEDULER_STATUS.RSRV_CNTNT, //메모
        // SCH_STAT_TYPE : this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE, // 완료유형

      }

      if(this.AS_CNTCT_INFO.modelChkRequest.length > 0){ //제보 요청이 있는 경우
        postParam.CUTT_GVIFMT = JSON.stringify(this.AS_CNTCT_INFO.modelChkRequest);
        postParam.GVIFMT_CN = this.AS_CNTCT_INFO.modelChkRequestTime + '/' + this.AS_CNTCT_INFO.modelChkReason;
      }

      let headParam = {head : {}}

      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let response  = await this.common_postCall('/phone-api/as/scheduler/registCntct', postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        //접촉정보등록 정보 초기화
        this.initCntctInfo();

        //스케줄러 목록 초기화(재로딩).
        this.$eventBus.$emit('searchSchedulerListPaging');


        //상담 - 이력 정보의 상담이력 조회.
        this.$eventBus.$emit('setCuttHistInfo', {TAB_IDX: "2", CUST_INFO: this.CUST_INFO});

        this.closeAlert();
        this.$store.dispatch("statusStore/AC_CUTT_ING", false); //상담중 아님
        this.mixin_reloadCuttStat('CUTT_MONITOR_STAT'); //상담 모니터링 카운트 리로드

        //상담저장 시 IN후처리 이거나 OUT후처리인 경우 저장 후 CTI 상태 지정
        if(this.CTI_CALL_STAT === 'stat3' || this.CTI_CALL_STAT === 'stat4'){
          this.$eventBus.$emit('setCtiBtnEvt', this.SAVE_AFTER_ACTION);
        }
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
      }

    },


    //담당자 검색 다이얼로그 - 더블클릭으로 선택 시
    setIcpr(item) {
      this.AS_CNTCT_INFO.ICPR_EMP_NO = item.USR_ID;
      this.AS_CNTCT_INFO.ICPR_EMP_NM = item.USR_NM;

      this.AS_CNTCT_INFO.CNTCT_CHNL_CD = item.MNTN_USR_DS_CD;

      if(item.FRM_NM) {
        this.AS_CNTCT_INFO.ICPR_INFO = item.FRM_NM + "/" + item.MNTN_USR_DS_NM;
      } else {
        this.AS_CNTCT_INFO.ICPR_INFO = item.DEP_NM + "/" + item.MNTN_USR_DS_NM;
      }
      this.mixin_hideDialog('FindAsIcpr')
    },

    openMultiSaveDialog() {

      if(this.FLW_ACP_INFO && this.FLW_ACP_INFO.MGOF_CD) {
        if(this.MULTI_SAVE_LIST.length > 0) {
          this.showConfirmInfo({
            msg:'다건 선택을 초기화 하시겠습니까?'
            , callYes: () => {
              this.MULTI_SAVE_LIST = [];
              this.closeAlert();
              this.mixin_showDialog('FindAsMultiSave')
            }
            , callNo: this.closeAlert
          })
        } else {
          this.mixin_showDialog('FindAsMultiSave')
        }

      } else {
        this.showAlertInfo({msg: "단지 정보가 없습니다."});
        return;
      }
    },

    //다건 저장 다이얼로그 - 적용 이벤트
    setMultiSave(items) {
      this.MULTI_SAVE_LIST = items;
      //console.log("this.MULTI_SAVE_LIST.map(item => item.FLW_DTL_FULL_SN).join(',')",  this.MULTI_SAVE_LIST.map(item => item.FLW_DTL_FULL_SN).join(","));
      this.mixin_hideDialog('FindAsMultiSave')
    },



    //인바운드 이관 체크박스 변경 이벤트.
    changeInboundTranYn() {
      this.$set(this.AS_CNTCT_INFO, 'INBOUND_REQ_CNTNT', '');
      if(this.AS_CNTCT_INFO.INBOUND_TRAN_YN) {
        this.INBOUND_REQ_CNTNT = '';
        this.dialogInboundReq = true;
      } else {
        this.dialogInboundReq = false;
      }

    },

    //인바운드 이관 요청 다이얼로그 저장 버튼
    btnSaveInboundReq() {
      if(!this.$refs.cntctInboundReqForm.validate()) {
        return false;
      }
      this.AS_CNTCT_INFO.INBOUND_REQ_CNTNT = this.INBOUND_REQ_CNTNT;
      this.INBOUND_REQ_CNTNT = '';
      this.dialogInboundReq = false;
     },

     //인바운드 이관 요청 다이얼로그 취소 버튼
     btnCancelInboundReq() {
      this.AS_CNTCT_INFO.INBOUND_TRAN_YN = false;
      this.dialogInboundReq = false;
     },

    //진행현황 - 방문예정익 삭제 체크박스 변경 이벤트
    changeSchedulerStatusDelYn() {
      if(this.RCV_SCHEDULER_STATUS.DEL_YN) {
        this.RCV_SCHEDULER_STATUS.VISIT_YMD = '';
        this.RCV_SCHEDULER_STATUS.VISIT_S_H = '';
        this.RCV_SCHEDULER_STATUS.VISIT_E_H = '';
        this.RCV_SCHEDULER_STATUS.VISIT_YMD_YN = false;
      }
    },

    //통화예약일 변경 이벤트
    changeRsrvYmd() {
      if(this.RCV_SCHEDULER_STATUS.RSRV_YMD && this.RCV_SCHEDULER_STATUS.RSRV_YMD != '') {
        //통화예약과 완료유형은 함께 설정할 수 없다. 통화예약 설정 시 완료유형 초기화
        this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE = '';
        this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE_YN = false;
        this.$set(this.RCV_SCHEDULER_STATUS, 'WORK_TYPE', '');
        this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN = false;
        this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN = false;
        this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = "";
        this.disabledWorkType = true;

        //통화예약 체크박스 활성화
        this.RCV_SCHEDULER_STATUS.RSRV_YMD_YN = true;

      } else {
        this.RCV_SCHEDULER_STATUS.RSRV_YMD_YN = false;
      }
    },

    //방문확정일 변경 이벤트
    changeVisitYmd() {
      if(this.RCV_SCHEDULER_STATUS.VISIT_YMD && this.RCV_SCHEDULER_STATUS.VISIT_YMD != '') {
        this.RCV_SCHEDULER_STATUS.VISIT_YMD_YN = true;
      } else {
        this.RCV_SCHEDULER_STATUS.VISIT_YMD_YN = false;
      }
    },

    //완료유형 변경 이벤트
    changeSchStatType() {
      if(this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE && this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE != '') {
        //통화예약과 완료유형은 함께 설정할 수 없다. 완료유형 설정 시 통화예약 초기화
        this.RCV_SCHEDULER_STATUS.RSRV_YMD = '';
        this.RCV_SCHEDULER_STATUS.RSRV_YMD_YN = false;

        this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE_YN = true;
        //완류유형이 '제외'일 경우만 제외유형 활성화.
        if(this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE == "SST93") {
          this.disabledWorkType = false;
          this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = "";
        } else {
          //this.RCV_SCHEDULER_STATUS.WORK_TYPE = '';
          this.$set(this.RCV_SCHEDULER_STATUS, 'WORK_TYPE', '');
          this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN = false;
          this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN = true;
          this.disabledWorkType = true;
          this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = '';
          if(this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE == "SST91") {
            this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = "해피콜완료";
          } else if(this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE == "SST92") {
            this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = "60일 이상 종결";
          } else if(this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE == "SST94") {
            this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = "일정비협조";
          }
        }
      } else {
        this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE_YN = false;
        this.$set(this.RCV_SCHEDULER_STATUS, 'WORK_TYPE', '');
        this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN = false;
        this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN = false;
        this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = "";
        this.disabledWorkType = true;
      }
    },


    //제외유형 변경 이벤트
    changeWorkType() {
      if(this.RCV_SCHEDULER_STATUS.WORK_TYPE && this.RCV_SCHEDULER_STATUS.WORK_TYPE != '') {
        this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN = true;
        this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN = true;
        const selectedWorkType = this.WORK_TYPE_LIST.filter(item => { return item.value == this.RCV_SCHEDULER_STATUS.WORK_TYPE })[0].text;
        this.$set(this.RCV_SCHEDULER_STATUS, 'RSRV_CNTNT', selectedWorkType);
      } else {
        this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN = false;
        this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN = false;
        this.RCV_SCHEDULER_STATUS.RSRV_CNTNT = '';
      }
    },


    //진행현황 저장 버튼 이벤트
    btnSaveRcvSchedulerStatus() {

      /* AS접수 항목 선택 체크 */
   		const flwDtlFullSn = this.FLW_ACP_INFO.FLW_DTL_FULL_SN ? this.FLW_ACP_INFO.FLW_DTL_FULL_SN : ""; // AS접수풀번호

   		if (flwDtlFullSn == "") {
        this.showAlertInfo({msg: "AS접수 항목을 선택해주세요."})
   			return;
   		}

   		if (this.RCV_SCHEDULER_STATUS.H_SCH_STAT_CD && this.RCV_SCHEDULER_STATUS.H_SCH_STAT_CD != "") {
        this.showAlertInfo({msg: "이미 완료 처리된 건입니다."})
   			return;
   		}

   		const rsrvYmd = this.RCV_SCHEDULER_STATUS.RSRV_YMD ? this.RCV_SCHEDULER_STATUS.RSRV_YMD : ''; // 통화예약
   		const visitYmd = this.RCV_SCHEDULER_STATUS.VISIT_YMD ? this.RCV_SCHEDULER_STATUS.VISIT_YMD : ''; // 방문확정일
   		const visitSH = (visitYmd != "" && this.RCV_SCHEDULER_STATUS.VISIT_S_H) ? this.RCV_SCHEDULER_STATUS.VISIT_S_H : ""; // 방문확정시작시간
   		const visitEH = (visitYmd != "" && this.RCV_SCHEDULER_STATUS.VISIT_E_H) ? this.RCV_SCHEDULER_STATUS.VISIT_E_H : ""; // 방문확정종료시간
   		const visitYmdDelYn = this.RCV_SCHEDULER_STATUS.DEL_YN ? "Y" : "N"; // 방문확정일 삭제 체크박스
   		const rsrvCntntYn = this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN ? "Y" : "N"; // 메모 등록 여부
   		const schStatType = this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE ? this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE : ''; // 완료유형 (SST91:완료, SST93:제외, SST92:종결)
   		const workTypeYn = this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN ? "Y" : "N"; // 제외유형 등록 여부
   		const workType = this.RCV_SCHEDULER_STATUS.WORK_TYPE ? this.RCV_SCHEDULER_STATUS.WORK_TYPE : ''; // 제외유형

   		// 통화예약/완료유형 중복 체크
   		if (rsrvYmd != "" && schStatType != "") {
        this.showAlertInfo({msg: "통화예약과 완료유형을 중복 선택할 수 없습니다."})
   			return;
   		}
   		// 방문확정일 입력 시 시작시간 종료시간 입력 여부 체크
   		if (visitYmd.trim() != "" && (visitSH == "" || visitEH == "")) {
        this.showAlertInfo({msg: "방문확정일 입력 시 시작/종료 시간은 필수입니다."})
   			return;
   		}
   		// 방문확정일 입력 시 시작시간 종료시간 유효성 체크
   		if (visitYmd.trim() != "" && parseInt(visitSH) > parseInt(visitEH)) {
        this.showAlertInfo({msg: "방문확정 시작/종료 시간을 확인해주세요."})
   			return;
   		}
   		// 방문확정일이 없으면 시작시간, 종료시간도 초기화
   		if (visitYmd == "") {
        this.RCV_SCHEDULER_STATUS.VISIT_S_H = "";
        this.RCV_SCHEDULER_STATUS.VISIT_E_H = "";
   		}
   		// 방문확정일 삭제 체크했을 경우 통화예약/완료유형 둘중 하나는 선택
   		if (visitYmdDelYn == "Y" && (rsrvYmd == "" && schStatType == "")) {
        this.showAlertInfo({msg: "방문확정일 삭제 시 통화예약이나 완료유형 중 하나를 선택하셔야 합니다."})
   			return;
   		}
   		// 모든 항목을 입력 안했을 경우
   		if (workTypeYn == "N" && rsrvYmd == "" && visitYmd == "" && visitYmdDelYn == "N" && rsrvCntntYn == "N" && schStatType == "") {
        this.showAlertInfo({msg: "진행현황 정보가 없습니다."})
   			return;
   		}

   		// 완료유형 제외 선택 시 제외유형 필수 선택 ('SST91' => 완료, 'SST92' => 종결, 'SST93' => 제외) 2020-12-12
   		if (schStatType == "SST93" && workType == "") {
        this.showAlertInfo({msg: "완료유형 제외 선택 시 제외유형은 필수 선택 입니다."})
   			return;
   		}

      this.showConfirmInfo({
        msg: '진행현황을 등록하시겠습니까?'
        , callYes: () => {
          this.rcvSchedulerStatusSave();
        }
        , callNo: this.closeAlert
      })
    },

    //진행현황 저장
    async rcvSchedulerStatusSave() {

      const rsrvYmdYn = this.RCV_SCHEDULER_STATUS.RSRV_YMD_YN ? "Y" : "N"; // 통화예약 체크박스
      const rsrvYmd = this.RCV_SCHEDULER_STATUS.RSRV_YMD ? this.RCV_SCHEDULER_STATUS.RSRV_YMD.replace(/-/gi, '') : ''; //통화예정일
   		const visitYmd = this.RCV_SCHEDULER_STATUS.VISIT_YMD ? this.RCV_SCHEDULER_STATUS.VISIT_YMD.replace(/-/gi, '') : ''; // 방문확정일
   		const visitSH = (visitYmd != "" && this.RCV_SCHEDULER_STATUS.VISIT_S_H) ? this.RCV_SCHEDULER_STATUS.VISIT_S_H : ""; // 방문확정시작시간
   		const visitEH = (visitYmd != "" && this.RCV_SCHEDULER_STATUS.VISIT_E_H) ? this.RCV_SCHEDULER_STATUS.VISIT_E_H : ""; // 방문확정종료시간

   		const schStatTypeYn = this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE_YN ? "Y" : "N"; // 완료유형 체크박스
   		const schStatType = this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE ? this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE : ''; // 완료유형 (SST91:완료, SST93:제외, SST92:종결)
      const schStatCd = (schStatType != "") ? "SST9" : ""; // 완료여부
   		const schStatNm = (schStatType != "") ? "완료" : ""; // 완료여부
   		const rsrvDelYn = (schStatTypeYn == "Y" && rsrvYmdYn == "N") ? "Y": "N"; // 통화예약일 삭제 여부 (완료유형이 선택되고 통화예약 정보가 없으면 삭제)

      const postParam = {

        FLW_DTL_FULL_SN: this.FLW_ACP_INFO.FLW_DTL_FULL_SN, //AS접수풀번호
        ARA_HDQ_CD: this.selectedItem.ARA_HDQ_CD ? this.selectedItem.ARA_HDQ_CD : '',
        FLW_RGS_DT: this.selectedItem.FLW_RGS_DT ? this.selectedItem.FLW_RGS_DT : '',
        FLW_ACP_SN: this.selectedItem.FLW_ACP_SN ? this.selectedItem.FLW_ACP_SN : '',
        FLW_DTL_SN: this.selectedItem.FLW_DTL_SN ? this.selectedItem.FLW_DTL_SN : '',

   			NEW_YN: this.selectedItem.NEW_YN,
   			RSRV_YMD: rsrvYmd,
   			RSRV_DEL_YN: rsrvDelYn,
   			VISIT_YMD: visitYmd, //방문확정일
        VISIT_S_H: visitSH, //시작일
        VISIT_E_H: visitEH, //종료일
   			DEL_VISIT_YMD_YN: this.RCV_SCHEDULER_STATUS.DEL_YN ? "Y" : "N",
        RSRV_CNTNT_YN: this.RCV_SCHEDULER_STATUS.RSRV_CNTNT_YN ? "Y" : "N",
        RSRV_CNTNT: this.RCV_SCHEDULER_STATUS.RSRV_CNTNT ? this.RCV_SCHEDULER_STATUS.RSRV_CNTNT : '', //메모
        SCH_STAT_TYPE: this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE ? this.RCV_SCHEDULER_STATUS.SCH_STAT_TYPE : '', // 완료유형
   			SCH_STAT_CD: schStatCd,
   			WORK_TYPE_YN: this.RCV_SCHEDULER_STATUS.WORK_TYPE_YN ? "Y" : "N",
   			WORK_TYPE: this.RCV_SCHEDULER_STATUS.WORK_TYPE ? this.RCV_SCHEDULER_STATUS.WORK_TYPE : '',

      }

      let headParam = {head : {}}

      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let response  = await this.common_postCall('/phone-api/as/scheduler/registRcvSchedulerStatus', postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {

        //후처리 - 검색결과 ROW 정보를 수정
        const cloneRsrv = _.cloneDeep(this.RCV_SCHEDULER_STATUS)
        this.selectedItem.RSRV_YMD =  cloneRsrv.RSRV_YMD
        this.selectedItem.VISIT_YMD = cloneRsrv.VISIT_YMD;
        this.selectedItem.VISIT_S_H = cloneRsrv.VISIT_S_H;
        this.selectedItem.VISIT_E_H = cloneRsrv.VISIT_E_H;
   			if (cloneRsrv.RSRV_CNTNT_YN) {
          this.selectedItem.RSRV_CNTNT = cloneRsrv.RSRV_CNTNT;
   			}
        this.selectedItem.SCH_STAT_CD = cloneRsrv.SCH_STAT_CD;
        this.selectedItem.SCH_STAT_NM =  _.cloneDeep(schStatNm);
        this.selectedItem.SCH_STAT_TYPE = cloneRsrv.SCH_STAT_TYPE;

        //접촉정보등록 정보 초기화
        this.initRcvSchedulerStatus(schStatCd);

        this.closeAlert();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.mixin_reloadCuttStat('CUTT_MONITOR_STAT'); //상담 모니터링 카운트 리로드
      }
    },

    copyCustInfo() {
      let copy_cntnt = '';
      copy_cntnt = '고객명 : ' + this.FLW_ACP_INFO.CVPR_NM + '\n';
      copy_cntnt += '휴대폰 : ' + this.FLW_ACP_INFO.MBL_NO + '\n';
      copy_cntnt += '주소(코티스) : ' + this.FLW_ACP_INFO.MGOF_NM + this.FLW_ACP_INFO.BLDG_NO + "동 "+ this.FLW_ACP_INFO.HS_NO + "호" + '\n';
      copy_cntnt += '주소(동주소) : ' + this.FLW_ACP_INFO.BLDG_ADR;

      navigator.clipboard.writeText(copy_cntnt);

      this.showToastSuccess({msg: '복사되었습니다.'});
    },

    //고객 전화번호 전화걸기 버튼 이벤트
    custPhnNoOutCall(custPhnNo){
      if(this.CUTT_ING){
        this.showAlertInfo({msg : '상담 중에는 통화를 할 수 없습니다.<br>상담을 먼저 저장하세요.'});
        return;
      }else{
        this.$eventBus.$emit('topOutCall', {CUST_PHN_NO : custPhnNo});
      }
    },

    //상담유형 해피콜 dialog
    openHappyCallSurvey(){
        this.mixin_showDialog('HappyCallSurvey')

    },
    setHappycallDialogTitle(title) {
      this.happycallDialogTitle = title;
    },

    disableHappycallSaveBtn(val) {
      this.isDisableHappycallSaveBtn = val;
    },

    closeDialogHappycall(surveyDstnNo) {
      this.AS_CNTCT_INFO.SURVEY_DSTN_NO = surveyDstnNo;
      this.mixin_hideDialog('HappyCallSurvey')
    },

    //상담도구 선택 시
    changeCuttToolCn(item){
      this.AS_CNTCT_INFO.SCH_CUTT_TYPE = new Array(3);
      this.AS_CNTCT_INFO.SCH_CUTT_TYPE[0] = item.CUTT_LCD;
      this.AS_CNTCT_INFO.SCH_CUTT_TYPE[1] = item.CUTT_MCD;
      this.AS_CNTCT_INFO.SCH_CUTT_TYPE[2] = item.CUTT_SCD;
      this.AS_CNTCT_INFO.CUTT_CN = item.CONTENTS;
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

      let smsInfo = {
        CUST_ID: this.CUST_INFO.CUST_ID ? this.CUST_INFO.CUST_ID : '',
        CUST_PHN_NO: this.AS_CNTCT_INFO.CALLER_TEL,
        SRC: 'FLAW_DETAIL',

      };
      if(this.FLW_ACP_INFO && this.FLW_ACP_INFO.V_FLW_ACP_SN) {
        const mgofTpCd = this.FLW_ACP_INFO.MGOF_TP_CD;
        const smsFlwInfo = {
          V_FLW_ACP_SN: this.FLW_ACP_INFO.V_FLW_ACP_SN,
          CVPR_NM: this.FLW_ACP_INFO.CVPR_NM,
          MBL_NO: this.FLW_ACP_INFO.MBL_NO,
          MGOF_NM: (mgofTpCd == '16' || mgofTpCd == '17' || mgofTpCd == '18' || mgofTpCd == '16,29') ? this.FLW_ACP_INFO.BLDG_ADR : this.FLW_ACP_INFO.MGOF_NM,
          BLDG_NO: this.FLW_ACP_INFO.BLDG_NO,
          HS_NO: this.FLW_ACP_INFO.HS_NO,
          FLW_CTS: this.FLW_ACP_INFO.FLW_CTS,
          JOB_FRM_NM: this.FLW_ACP_INFO.JOB_FRM_NM,
          BLDG_ADR: this.FLW_ACP_INFO.BLDG_ADR,
          DIST_EMP_NM: this.SMS_DIST_EMP_NM,
        }
        smsInfo = {...smsInfo, ...smsFlwInfo};
      }

      this.$eventBus.$emit('setSidePanelCustInfo', smsInfo);
      if(name.includes('slide')){
        this.$eventBus.$emit('clearVSlideXreverse');
        this.$eventBus.$emit('showRightSlide', {ACT_NM: 'slideEmailSend', active:false});
      }else{
          this.$eventBus.$emit('showRightDialog', {dialogNm : name})
      }
    }
  },
  mounted() {
  },
  created() {
    //
    this.$eventBus.$on('setSchedulerDetail',(item)=> {
      this.setSchedulerDetail(item);
    });

    //배려고객ARS 닫기
    this.$eventBus.$on("CloseBalckArs", () => {
      this.mixin_hideDialog('BalckArs');
      this.TEMP_CUST_BLOCK_YN = true;
    });

    this.$eventBus.$on("CUST_CAUTION_HIST", (EXEC_CAUTION_LIST) => {
      this.EXEC_CAUTION_LIST = EXEC_CAUTION_LIST;
    });

    //전화걸기(OUTBOUND) 클릭 이벤트
    this.$eventBus.$on("setCallId", (data) => {
      this.CALL_ID = data.CALL_ID;
      this.$store.dispatch("statusStore/AC_CUTT_ING", true);
    });


    this.getCommonCodeList();
    this.getCuttToolList();
  },
  beforeDestroy() {
    this.$eventBus.$off("setSchedulerDetail"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("CloseBalckArs"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("CUST_CAUTION_HIST"); //eventBus 중복방지를 위해 off
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>