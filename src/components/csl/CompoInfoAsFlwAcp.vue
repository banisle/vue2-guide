<template>
  <div class="">
    <div class="pl-header">
      <div class="pl-header--title">AS 접수</div>
      <div class="spacing-wrap sp-4 ml-8">
        <!-- 단지별 특이사항 마크 -->
        <v-menu
          v-if="emblemId != ''"
          min-width="200"
          top
          left
          offset-y
          offset-x
          :close-on-content-click=false
          content-class="pl-menu-drop pa-2"
          v-model="DropLegend"
          >
          <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
            <span
              v-bind="menuAttrs"
              v-on="menuOn"
              :class="`pl-emblem is-${emblemColor}`">{{emblemCaps}}</span>
          </template>
          <div class="px-3 py-2">
            <div class="d-flex">
              <h3 style="font-size: 16px">단지별 특이사항</h3>
              <v-btn
                @click="DropLegend = false"
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
            <!-- 링크정보 -->
            <div class="is-mt-l">
              <!--  list -->
              <div class="spacing-wrap sp-8 flex-column" >
                <div v-for="item in EMBLEM_LIST" :key="item.id">
                  <span :class="`pl-emblem is-${ item.color }`">{{ item.caps }}</span>
                  <span class="ml-1">{{ item.title }}</span>
                </div>
              </div>
            </div>

          </div>
        </v-menu>
        <v-btn
          class="pl-btn is-sm is-sub"
          @click="mixin_openSearchWindow( 'LayoutSearchPopup', '1400', '540', {compo_name : 'CompoFindAsAdr', callback : 'setAdr', title: '주소검색', popData: {ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, MGOF_NM: MGOF_NM, BLDG_NO: BLDG_NO, HS_NO: HS_NO, PHN_CUTT_ID: SAVED_AS_CUTT_INFO.PHN_CUTT_ID}})"
        >주소검색</v-btn>
        <v-btn
          :class="`pl-btn is-sm ${ isExistMgofMemo ? 'is-esp2' : 'is-sub' }`"
          @click="mixin_openSearchWindow( 'LayoutSearchPopup', '1400', '890', {compo_name : 'CompoAsMgofInfo', title: '단지정보', popData: {ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, MGOF_NM: MGOF_NM, BLDG_NO: BLDG_NO, HS_NO: HS_NO}})"
        >단지정보</v-btn>
        <v-btn
          class="pl-btn is-sm is-sub"
          @click="mixin_openSearchWindow( 'LayoutSearchPopup', '1600', '771', {compo_name : 'CompoAsInitHist', title: '공용부 이력', popData: {ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, MGOF_NM: MGOF_NM, BLDG_NO: BLDG_NO}})"
          >공용부 이력</v-btn>
      </div>
      <div class="d-flex align-center ml-auto">
        <strong>접수건수 ({{FLW_CNT}}건)</strong>
        <v-btn
          class="pl-btn is-sm is-esp ml-2"
          @click="btnFlwAcp">AS 접수</v-btn>
      </div>
    </div>
    <!-- table -->
    <div class="is-mt-s">
      <v-form ref="formFlwAcp">
        <table class="pl-tbl-detail">
          <colgroup>
            <col width="9%" />
            <col width="14.8%%" />
            <col width="9%" />
            <col width="" />
            <col width="9%" />
            <col width="12%" />
            <col width="9%" />
            <col width="12%" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  시설구분
                </span>
              </th>
              <td>
                <v-select
                  v-model="LCLS_CD"
                  :items="LCLS_CD_LIST"
                  @change="changeLclsCd"
                  class="pl-form is-auto"
                  placeholder="선택"
                  :rules="validateRules.LCLS_CD"
                ></v-select>
              </td>
              <th scope="row">
                <span class="pl-label">
                  단지/동주소
                </span>
              </th>
              <td>
                <div class="spacing-wrap sp-4">
                  <v-text-field
                    v-model="MGOF_CD"
                    disabled
                    class="pl-form is-sm"
                  />
                  <v-text-field
                    v-model="MGOF_NM"
                    :class="`pl-form is-search ${mgofNmColor}`"
                    @click="mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '569', {compo_name : 'CompoFindAsBldgAdr', callback : 'setBldgAdr', title: '단지/동주소', popData: {ARA_HDQ_CD: ARA_HDQ_CD}})"
                    readonly
                  >
                    <template v-slot:append>
                      <v-btn
                        @click="mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '569', {compo_name : 'CompoFindAsBldgAdr', callback : 'setBldgAdr', title: '단지/동주소', popData: {ARA_HDQ_CD: ARA_HDQ_CD}})"
                        class="pl-btn has-icon-only">
                        <span class="pl-icon20 in-search"></span>
                      </v-btn>
                    </template>
                  </v-text-field>
                </div>
              </td>
              <th scope="row">
                <span class="pl-label">
                  동
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="BLDG_NO"
                  class="pl-form is-search is-auto"
                  @click="openFindAsBldgNo"
                  readonly
                >
                  <template v-slot:append>
                    <v-btn
                      @click="openFindAsBldgNo"
                      class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  호
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="HS_NO"
                  class="pl-form is-search is-auto"
                  @click="openFindAsHsNo"
                  readonly
                  >
                  <template v-slot:append>
                    <v-btn
                      @click="openFindAsHsNo"
                      class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  AS 내용
                </span>
              </th>
              <td colspan="3">
                <v-text-field
                  v-model="FLW_CTS"
                  ref="flwCtsField"
                  class="pl-form is-auto"
                  @keyup.enter="[searchBigDataMntnFlwCsCd('Y'), $refs['flwCtsField'].blur()]"
                  :rules="validateRules.FLW_CTS"
                ></v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  AS구분
                </span>
              </th>
              <td>
                <div class="spacing-wrap sp-4">
                  <v-select
                    v-model="FLW_DS_CD"
                    :items="FLW_DS_CD_LIST"
                    @change="changeFlwDsCd"
                    class="pl-form"
                    placeholder="선택"
                    :rules="validateRules.FLW_DS_CD"
                  ></v-select>
                  <v-text-field
                    v-model="FRM_NM"  
                    class="pl-form is-xs"
                    disabled
                  />
                </div>
              </td>
              <th scope="row">
                <span class="pl-label">
                  보수구분
                </span>
              </th>
              <td>
                <div class="spacing-wrap sp-4">
                  <v-select
                    
                    v-model="FLW_DTL_DS_CD"
                    :items="FLW_DTL_DS_CD_LIST"
                    class="pl-form is-auto"
                    placeholder="선택"
                    :disabled="FLW_DTL_DS_CD_LIST.length == 0 ? true : false"
                  ></v-select>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  공간
                </span>
              </th>
              <td>
                <div class="spacing-wrap sp-4">
                  <v-select
                    v-model="SPCE_CD"
                    :items="SPCE_CD_LIST"
                    class="pl-form is-auto"
                    placeholder="선택"
                    @change="changeSpceCd"
                    :rules="validateRules.SPCE_CD"
                  ></v-select>
                </div>
              </td>
              <th scope="row">
                <span class="pl-label">
                  공종
                </span>
              </th>
              <td colspan="3">
                <div class="spacing-wrap sp-4">
                  <v-autocomplete
                    v-model="MNTN_FLW_CS_CD"
                    class="pl-form is-auto"
                    :items="MNTN_FLW_CS_CD_LIST"
                    :search-input.sync="searchInput"
                    :filter="filterMntnFlwCsCd"
                    :loading="loadingMntnFlwCsCd"
                    placeholder="선택"
                    no-data-text="결과 없음"
                    @click="clickMntnFlwCsCd"
                    :rules="validateRules.MNTN_FLW_CS_CD"
                  />
                  <!-- 찾기 -->
                  <compo-tooltip-btn
                    TitleProp="찾기"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 in-search"
                    :MinWidthProp=22
                    :HeightProp=22
                    TooltipPositionProp="bottom"
                    @btnClick="mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '627', {compo_name : 'CompoFindAsMntnFlwCs', callback : 'setMntnFlwCs', title: 'AS코드 검색', popData: {LCLS_CD: LCLS_CD, MNTN_SPCE_CD: SPCE_CD}})"
                  ></compo-tooltip-btn>
                  <!-- 빅데이터 AS 유형추천 -->
                  <v-tooltip content-class="pl-tooltip bottom" bottom>
                    <template v-slot:activator="{ }">
                      <v-menu
                        min-width="190"
                        bottom
                        left
                        offset-y
                        v-model="DropBigData"
                        content-class="pl-menu-drop"
                      >
                        <template v-slot:activator="{}">
                          <v-btn
                            class="pl-tooltip-btn is-bg-darkgray"
                            min-width="22"
                            height="22"
                            plain
                            >
                            <v-icon
                              class="pl-icon20 share-white"
                              @click="searchBigDataMntnFlwCsCd('N')"></v-icon>
                          </v-btn>
                        </template>
                        <div class="px-3 py-2">
                          <div class="d-flex">
                            <h3 style="font-size: 16px">빅데이터 추천 검색</h3>
                            <v-btn
                              @click="DropBigData = false"
                              plain
                              min-width="22"
                              height="22"
                              class="pl-tooltip-btn ml-auto "
                              >
                              <v-icon
                                small
                                class="pl-icon20 dialog-close-black">
                              </v-icon>
                            </v-btn>

                          </div>
                          <div class="is-mt-m">
                            <ul class="pl-drop-layer-list">
                              <li
                                v-for="(item, index) in bigDataList"
                                :key="index"
                                >
                                <span class="" @click="setMntnFlwCs(item)">{{ item.BIG_DATA_NM }}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </v-menu>
                    </template>
                    <span>빅데이터 AS 유형추천</span>
                  </v-tooltip>
                </div>
                
              </td>
              <th scope="row">
                <span class="pl-label">
                  담당자정보
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="ICPR_EMPNM"
                  class="pl-form is-search is-auto"
                  @click="openFindAsIcpr()"
                  readonly
                  :rules="validateRules.ICPR_EMPNM"
                >
                  <template v-slot:append>
                    <v-btn
                      @click="openFindAsIcpr()"
                      class="pl-btn has-icon-only">
                      <span class="pl-icon20 in-search"></span>
                    </v-btn>
                  </template>
                </v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  접수자
                </span>
              </th>
              <td>
                <v-text-field
                  v-model="CVPR_NM"
                  class="pl-form is-auto"
                  :rules="validateRules.CVPR_NM"
                />
              </td>
              <th scope="row">
                <span class="pl-label">
                  연락처
                </span>
              </th>
              <td >
                <v-text-field
                  v-model="MBL_NO"
                  class="pl-form is-auto"
                  :rules="validateRules.MBL_NO"
                />
              </td>
              <th scope="row">
                <span class="pl-label">

                </span>
              </th>
              <td colspan="3">
                <div class="">
                  <v-chip-group
                    active-class=""
                    column
                  >
                    <v-chip
                      v-for="(chip, chipIdx) in MNTN_FLW_CS_CD_CHIP"
                      :key="chipIdx"
                      small
                      class="my-0"
                      close
                      @click:close="deleteChip(chip, chipIdx)">
                      {{ chip }}
                    </v-chip>
                  </v-chip-group>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </v-form>
    </div>
    <!-- dialog: 주소검색 -->
    <v-dialog
      v-if="dialogFindAsAdr"
      v-model="dialogFindAsAdr"
      content-class="dialog-draggable is-lg"
      width="1400"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="주소 조회"
        @hide="mixin_hideDialog('FindAsAdr')"
        @submit="submitDialog('FindAsAdr')"
        >
        <template slot="body">
          <CompoFindAsAdr 
            :DataProp="{ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, MGOF_NM: MGOF_NM, BLDG_NO: BLDG_NO, HS_NO: HS_NO, PHN_CUTT_ID: SAVED_AS_CUTT_INFO.PHN_CUTT_ID}"
            @setItem="setAdr"
            @closeDialog="mixin_hideDialog('FindAsAdr')"
          />
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
            :DataProp="{ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, MGOF_NM: MGOF_NM, BLDG_NO: BLDG_NO, HS_NO: HS_NO}"
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
            :DataProp="{ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, MGOF_NM: MGOF_NM, BLDG_NO: BLDG_NO}"
          />
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: 보수 지시 -->
    <v-dialog
      v-if="dialogFindAsAdmFrm"
      v-model="dialogFindAsAdmFrm"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="보수 지시"
        @hide="mixin_hideDialog('FindAsAdmFrm')"
        @submit="submitDialog('FindAsAdmFrm')"
        >
        <template slot="body">
          <CompoFindAsAdmFrm 
            :DataProp="{ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, MGOF_NM: MGOF_NM}"
            @setItem="setAdmFrm"
            @closeDialog="mixin_hideDialog('FindAsAdmFrm')"
          />
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: 동 -->
    <v-dialog
      v-if="dialogFindAsBldgNo"
      v-model="dialogFindAsBldgNo"
      width="710"
      content-class="dialog-draggable"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="동현황 검색"
        @hide="mixin_hideDialog('FindAsBldgNo')"
        @submit="submitDialog('FindAsBldgNo')"
        >
        <template slot="body">
          <CompoFindAsBldgNo 
            :DataProp="{ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, MGOF_NM: MGOF_NM}"
            @setItem="setBldgNo"
            @closeDialog="mixin_hideDialog('FindAsBldgNo')"
          />
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: 호 -->
    <v-dialog
      v-if="dialogFindAsHsNo"
      v-model="dialogFindAsHsNo"
      content-class="dialog-draggable "
      width="840"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="세대현황 검색"
        @hide="mixin_hideDialog('FindAsHsNo')"
        @submit="submitDialog('FindAsHsNo')"
        >
        <template slot="body">
          <CompoFindAsHsNo 
            :DataProp="{ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, MGOF_NM: MGOF_NM, BLDG_NO: BLDG_NO}"
            @setItem="setHsNo"
            @closeDialog="mixin_hideDialog('FindAsHsNo')"
          />
        </template>
      </compo-dialog>
    </v-dialog>
    <!-- dialog: MMA_유지하자분류(공종) 검색 -->
    <v-dialog
      v-if="dialogFindAsMntnFlwCs"
      v-model="dialogFindAsMntnFlwCs"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="AS코드 검색"
        @hide="mixin_hideDialog('FindAsMntnFlwCs')"
      >
        <template slot="body">
          <CompoFindAsMntnFlwCs 
            :DataProp="{LCLS_CD: LCLS_CD, MNTN_SPCE_CD: SPCE_CD}"
            @setItem="setMntnFlwCs"
            @closeDialog="mixin_hideDialog('FindAsMntnFlwCs')"
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
            :DataProp="{ARA_HDQ_CD: ARA_HDQ_CD, MGOF_CD: MGOF_CD, MGOF_NM: MGOF_NM, MNTN_USR_DS_CD: MNTN_USR_DS_CD}"
            @setItem="setIcpr"
            @closeDialog="mixin_hideDialog('FindAsIcpr')"
          />
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoFindAsAdr from '@/components/CompoFindAsAdr.vue';
import CompoAsMgofInfo from '@/components/CompoAsMgofInfo.vue';
import CompoAsInitHist from '@/components/CompoAsInitHist.vue';
import CompoFindAsAdmFrm from '@/components/CompoFindAsAdmFrm.vue';

import CompoFindAsIcpr from '@/components/CompoFindAsIcpr.vue';
import CompoFindAsBldgNo from '@/components/CompoFindAsBldgNo.vue';
import CompoFindAsMntnFlwCs from '@/components/CompoFindAsMntnFlwCs.vue';
import CompoFindAsHsNo from '@/components/CompoFindAsHsNo.vue';

export default {
  name: "CompoInfoAsFlwAcp", //상담 - 바로처리 AS 접수 영역
  components: {
    CompoFindAsAdr,
    CompoAsMgofInfo,
    CompoAsInitHist,
    CompoFindAsAdmFrm,
    CompoFindAsBldgNo,
    CompoFindAsHsNo,
    CompoFindAsMntnFlwCs,
    CompoFindAsIcpr,
  },
  props: {
    SavedAsCuttInfoProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    RESET_ABLE: {
      type: Boolean,
      default : false
    },
  },
  data() {
    return {
      // dialog
      dialogFindAsBldgAdr: false,
      dialogFindAsBldgNo: false,
      dialogFindAsHsNo: false,
      dialogFindAsMntnFlwCs: false,
      dialogFindAsIcpr: false,

      dialogFindAsAdr: false,
      dialogAsMgofInfo : false,
      dialogAsInitHist: false,


      isRunSave: false, //AS 접수 등록/수정중인지 여부.

      isExistMgofMemo: false, //단지 특이사항이 있는지 여부.

      //고객 정보.
      CUST_INFO: {},

      //상담 저장 정보
      SAVED_AS_CUTT_INFO: {},

      //AS접수 건수
      FLW_CNT: 0,

      //AS 접수 - 임대 정보
      LEASE_INFO: {},
      HNO: '',  //주택번호
      ARA_HDQ_CD: '',
      MGOF_CD: '',  //단지코드
      MGOF_NM: '',  //단지명
      BLDG_NO: '',  //동
      BLDG_ID: '',  //동 ID
      HS_NO: '',    //호


      //시설구분 코드 목록
      LCLS_CD_LIST: [],
      //AS구분 코드 목록
      FLW_DS_CD_LIST: [],
      //보수구분 코드 목록 - AS 구분값에 따라 변경
      FLW_DTL_DS_CD_LIST: [],
      //공간 코드 목록 - 시설구분값에 따라 변경
      SPCE_CD_LIST: [],
      //공종 코드 목록 - 시설구분, 공간값에 따라 변경
      MNTN_FLW_CS_CD_LIST: [],
      searchInput: '',
      

      //시설구분 코드- 초기 값 - 3(세대별)
      LCLS_CD : "3",
      //AS구분 코드
      FLW_DS_CD: '',
      //보수 구분
      FLW_DTL_DS_CD: '',
      //공간 코드
      SPCE_CD: '', 
      //AS 내용
      FLW_CTS: '',

      //공종 코드 - 유지하자분류코드
      MNTN_FLW_CS_CD: '',
      MNTN_FLW_CS_CD_CHIP: [],
      loadingMntnFlwCsCd: false,


      //AS구분 - 시공사하자 - 보수지시 정보
      PRCR_ID: '',
      FRM_NM: '',
      PRCR_TLNO: '',
      SPPB_TLNO: '',
      FRM_CD: '',
      FLW_PGRS_SS_CD: '10', //하자진행상태코드 - 접수(10)
      RPR_XPC_DT: '',
      PCL_DTL: '',  //단지 특이사항 미리보기 말풍선

      //담당자정보
      MNTN_USR_DS_CD: '', //담당자 구분
      ICPR_EMPNO: '', //담당자정보 사원번호
      ICPR_EMPNM: '',
      ICPR_DEP_CD: '',  //담당자정보 부서코드 
      ICPR_MBL_NO: '',  //담당자정보 연락처

      CVPR_NM: '',  //접수자
      MBL_NO: '', //연락처
      URG_FLW_YN: '', //긴급AS여부
      SPPB_TLNO_ORG: '',  //담당자전화번호(숫자만)

      FLW_CMUS_FCL_DS_CD: '', //AS공용시설구분코드

      //기타
      TLNO: '', //전화번호
      EML: '',  //이메일
      ACP_ATCH_SN: '',//첨부파일번호
      MMG_ID: '', //기동보수반아이디
      FLW_RMK: '',  //AS비고
      FLW_TP_CD: '',  //AS유형코드

      //카카오톡 알림
      CUST_NM: '', //고객명
      HP_NO: '', //핸드폰
      TITLE: "AS접수업체발송",
      MESSAGE_TYPE: '', //
      USER_VAR: '', //
      MBL_NO_ONLYNUM: '', //연락처(숫자만)
      MSG_FLW_NM: '', //카카오알림톡 공종이름(공간/부위자재/공사)
      KAKAO_URL_YN: '', //카카오url주소 포함 유무

      

      modelRecover: null,
      DropLegend: false,
      EMBLEM_LIST: [
        { id: 'MIX', title: '혼합단지', color: 'blue', caps: '혼' },
        { id: 'LWS_SBD', title: '소송단지', color: 'purple', caps: '소' },
        { id: 'CAU', title: '주의단지(UBR) ', color: 'org', caps: '주' },
        { id: 'NW', title: '신규단지 ', color: 'green', caps: '신' },
        { id: 'MPBL', title: 'AS 접수 불가 단지 ', color: '', caps: '불' },
      ],
      emblemId: '',
      emblemColor: '',
      emblemCaps: '',
      mgofNmColor: '',

      

      // 빅데이터 AS 유형
      DropBigData: false,
      bigDataList: [],
      detailList: [
        { title: '공용욕실 > 타일 > 균열 > 건축 > 타일공사' },
        { title: '공용욕실 > 타일 > 들뜸 > 건축 > 타일공사' },
        { title: '부부욕실 > 타일 > 균열 > 건축 > 타일공사' },
        { title: '공용욕실 > 타일 > 균열 > 건축 > UBR공사' },
      ],

      // 보수지시
      dialogFindAsAdmFrm: false,



      // valid : true,
      validateRules: {
        CVPR_NM: [
          v => !!v || '접수자는 필수 항목 입니다.',
          v => (v && v.length <=5) || '접수자명이 5자를 초과할 수 없습니다.',
        ],
        MBL_NO: [
          v => !!v || '연락처는 필수 항목 입니다.',
        ],
        FLW_DS_CD: [
          v => !!v || 'AS구분은 필수 선택 항목 입니다.',
        ],
        LCLS_CD: [
          v => !!v || '시설구분은 필수 선택 항목 입니다.',
        ],
        SPCE_CD: [
          v => !!v || '공간은 필수 선택 항목 입니다.',
        ],
        FLW_CTS: [
          v => !!v || 'AS 내용은 필수 항목 입니다.',
        ],
        MNTN_FLW_CS_CD: [
          v => !!v || '공종은 필수 항목 입니다.',
        ],
        ICPR_EMPNM: [
          v => !!v || '담당자는 필수 항목 입니다.',
        ],
      },

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          REG : {alertDialogToggle: true, msg: '저장하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.flwAcpSave, callNo: this.closeMsg}
        },
        ALERT : {
          SUCCESS : {alertDialogToggle: true, msg: '정상 처리 되었습니다.', iconClass: 'is-info', type: 'default'}
          , REQUIRED_LCLS_SPCE_CD: {alertDialogToggle: true, msg: '시설구분과 공간을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , REQUIRED_MGOF_CD: {alertDialogToggle: true, msg: '단지를 선택해 주세요.', iconClass: 'is-info', type: 'default'}
          , REQUIRED_BLDG_NO: {alertDialogToggle: true, msg: '동을 선택해 주세요.', iconClass: 'is-info', type: 'default'}
        },
      }

    }
  },
  beforeDestroy(){
    this.$eventBus.$off("setCuttAsInfo");
    this.$eventBus.$off("setSpceCd");
    this.$eventBus.$off("setMntnFlwCsCdChip");
    this.$eventBus.$off("setFlwAcpCvprNm");
    this.$eventBus.$off("setFlwAcpMblNo");

  },
  async created() {
    //AS 접수 정보 세팅(고객 조회 - 고객 선택 시 호출)
    this.$eventBus.$on("setCuttAsInfo", (custInfo) => {
      this.setCuttAsInfo(custInfo);
    });

    //공간 세팅(실시간 대화록에서 키워드 선택 시)
    this.$eventBus.$on("setSpceCdKeyword", (spceNm) => {
      this.setSpceCdKeyword(spceNm);
    });

    //공종 검색어 세팅(실시간 대화록에서 키워드 선택 시)
    this.$eventBus.$on("setMntnFlwCsCdKeyword", (keyword) => {
      this.setMntnFlwCsCdKeyword(keyword);
    });
    this.$eventBus.$on("setFlwAcpCvprNm", (val) => {
      console.log("setFlwAcpCvprNm", val)
      this.CVPR_NM = val;
    });
    this.$eventBus.$on("setFlwAcpMblNo", (val) => {
      console.log("setFlwAcpMblNo", val)
      this.MBL_NO = val;
    });

    //코드정보 - 시설구분, AS구분, 공간
    //바로처리 시설구분 코드 목록 조회
    this.mixinAsGetLclsCode()
    
    //바로처리 공간 코드 목록 조회 - SPCE_CD_LIST 에 설정함.
    this.mixinAsGetMntnSpceCode(this.LCLS_CD)

    //AS 구분 코드 목록 조회
    this.getFlwDsCdList();
  },
  mounted() {
  },
  computed: {
  },
  watch: {
    SavedAsCuttInfoProp() {
      this.SAVED_AS_CUTT_INFO = this.SavedAsCuttInfoProp;
    },
    RESET_ABLE() {
      this.SAVED_AS_CUTT_INFO = {}
      this.CUST_INFO = {}
      this.LEASE_INFO = {}
      this.initFlwAcp("CHANGE_CUST");
    }
  },
  
  methods: {

    //AS 접수 값 초기화.(고객 검색 후, 저장 후)
    initFlwAcp(initType = 'CHANGE_CUST') {
      this.$refs.formFlwAcp.resetValidation()
      this.isRunSave = false;
      
      //임대정보
      this.HNO = this.LEASE_INFO && this.LEASE_INFO.HNO ? this.LEASE_INFO.HNO : '';
      this.ARA_HDQ_CD = this.LEASE_INFO && this.LEASE_INFO.ARA_HDQ_CD ? this.LEASE_INFO.ARA_HDQ_CD : '';
      this.MGOF_CD = this.LEASE_INFO && this.LEASE_INFO.MGOF_CD ? this.LEASE_INFO.MGOF_CD : '';
      this.MGOF_NM = this.LEASE_INFO && this.LEASE_INFO.MGOF_NM ? this.LEASE_INFO.MGOF_NM : '';
      this.BLDG_NO = this.LEASE_INFO && this.LEASE_INFO.BLDG_NO ? this.LEASE_INFO.BLDG_NO : '';
      this.BLDG_ID = this.LEASE_INFO && this.LEASE_INFO.BLDG_ID ? this.LEASE_INFO.BLDG_ID : '';
      this.HS_NO = this.LEASE_INFO && this.LEASE_INFO.HS_NO ? this.LEASE_INFO.HS_NO : '';


      //시설구분 코드- 초기 값 - 3(세대별)
      this.LCLS_CD = "3";
      //AS구분 코드
      this.FLW_DS_CD = '';
      //보수 구분
      this.FLW_DTL_DS_CD = '';
      //공간 코드
      this.SPCE_CD = '';  
      //AS 내용
      this.FLW_CTS = '';

      //공종 코드 - 유지하자분류코드
      this.MNTN_FLW_CS_CD = '';
      


      //AS구분 - 시공사하자 - 보수지시 정보
      this.PRCR_ID = '';
      this.FRM_NM = '';
      this.PRCR_TLNO = '';
      this.SPPB_TLNO = '';
      this.FRM_CD = '';
      this.FLW_PGRS_SS_CD = '10', //하자진행상태코드 - 접수(10)
      this.RPR_XPC_DT = '';

      //담당자정보
      this.MNTN_USR_DS_CD = ''; //담당자 구분
      this.ICPR_EMPNO = ''; //담당자정보 사원번호
      this.ICPR_EMPNM = '';
      this.ICPR_DEP_CD = '';  //담당자정보 부서코드 
      this.ICPR_MBL_NO = '';  //담당자정보 연락처

      if(initType == "CHANGE_CUST" || this.CVPR_NM == '') {
        this.CVPR_NM = this.CUST_INFO && this.CUST_INFO.CUST_NM ? this.CUST_INFO.CUST_NM : '';  //접수자
      }
      if(initType == "CHANGE_CUST" || this.MBL_NO == '') {
        if(false) {
          //TODO ::: 소프트폰 번호 세팅. by hjh
        } else {
          this.MBL_NO = this.CUST_INFO && this.CUST_INFO.CUST_PHN_NO ? this.CUST_INFO.CUST_PHN_NO : ''; //연락처
        }
        
      }
      this.URG_FLW_YN = ''; //긴급AS여부
      this.SPPB_TLNO_ORG = '';  //담당자전화번호(숫자만)

      this.FLW_CMUS_FCL_DS_CD = ''; //AS공용시설구분코드

      //기타
      this.TLNO = ''; //전화번호
      this.EML = '';  //이메일
      this.ACP_ATCH_SN = '';//첨부파일번호
      this.MMG_ID = ''; //기동보수반아이디
      this.FLW_RMK = '';  //AS비고
      this.FLW_TP_CD = '';  //AS유형코드

      //카카오톡 알림
      this.CUST_NM = ''; //고객명
      this.HP_NO = ''; //핸드폰
      this.TITLE = "AS접수업체발송",
      this.MESSAGE_TYPE = ''; //
      this.USER_VAR = ''; //
      this.MBL_NO_ONLYNUM = ''; //연락처(숫자만)
      this.MSG_FLW_NM = ''; //카카오알림톡 공종이름(공간/부위자재/공사)
      this.KAKAO_URL_YN = ''; //카카오url주소 포함 유무




      // if(initType == "CHANGE_CUST") {
      //   this.getMemoInfo
      // }

      if(initType == "CHANGE_CUST") {
        //단지 메모(특이사항)이 있는지 조회
        this.getMgofMemo();

        //단지 유형 아이콘 조회(혼합, 소송, 주의, 신규, AS 접수 불가)
        this.getMgofType();
        
        //AS 접수 건수 초기화.
        this.FLW_CNT = 0;
      }

      //상담 - 이력 정보의 (신)AS 접수이력 세팅.
      this.$eventBus.$emit('setCuttHistInfo', {TAB_IDX: "0", CUST_INFO: this.CUST_INFO});
    },

    //AS 구분 코드 목록 조회
    async getFlwDsCdList() {
      this.FLW_DS_CD_LIST = await this.mixinAsGetCommonCode("FLW_DS_CD", ['10','20','60']);
    },
    

    // getResponseData (response, strHeadText = "선택") {
    //   let responseData = [];
    //   if(!response.HEADER.ERROR_FLAG) {
    //       response.DATA.map(item => {
    //           responseData.push({text: item.CD_NM, value: item.CD})
    //       });
    //   }
    //
    //   //전체, 선택 등 값이 있다면 추가.
    //   if (strHeadText != "" && strHeadText != undefined) {
    //       responseData.unshift({ text: strHeadText, value: "" });
    //   }
    //   return responseData;
    // },
    // //바로처리 공통 코드 목록 조회
    // async getAsCommonCode(grpCd, cdIn = [], useYn = "Y") {
    //     const postParam = {
    //         GRP_CD: grpCd,
    //         CD_IN: cdIn,
    //         USE_YN: useYn,
    //     };
    //     const headParam = {head: {}};
    //     const response = await this.common_postCall("/phone-api/as/common/selectCotisCmnCdList", postParam, headParam);
    //     const responseData = this.getResponseData(response);
    //     return responseData;
    // },

    //바로처리 시설구분 코드 목록 조회
    // async getAsLclsCode() {
    //     const postParam = {};
    //     const headParam = {head: {}};
    //     const response = await this.common_postCall("/phone-api/as/common/selectCotisLclsCdList", postParam, headParam);
    //     const responseData = this.getResponseData(response);
    //     return responseData;
    // },
    // //바로처리 공간 코드 목록 조회
    // async getAsMntnSpceCode(lclsCd) {
    //     const postParam = {
    //         LCLS_CD: lclsCd
    //     };
    //     const headParam = {head: {
    //       ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
    //     }};
    //     const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnSpceCdList", postParam, headParam);
    //     const responseData = this.getResponseData(response);
    //     return responseData;
    // },

    //단지정보 - 특이사항 조회
    async getMgofMemo() {
      this.isExistMgofMemo = false;
      if(!this.mixin_isEmpty(this.MGOF_CD)) {
        const postParam = {
            MGOF_CD: this.MGOF_CD
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper'
        }};
        const response = await this.common_postCall("/api/biz/common/select/selectMgofMemo", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          this.isExistMgofMemo = response.DATA.length > 0 && response.DATA[0].MGOF_MEMO ? true : false;
        }
      }
    },

    
    //단지정보 - 특이사항 조회
    async getMgofType() {
      this.emblemId = '';
      this.emblemCaps = '';
      this.mgofNmColor = '';
      this.PCL_DTL = '';

      if(!this.mixin_isEmpty(this.MGOF_CD)) {
        const postParam = {
            MGOF_CD: this.MGOF_CD
        };
        const headParam = {head: {
          ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
        }};
        const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMgofType", postParam, headParam);
        if(!response.HEADER.ERROR_FLAG) {
          if(response.DATA[0].NW_YN && response.DATA[0].NW_YN == 'Y') {
            this.emblemId = "NW";
            this.mgofNmColor = "is-txt-green";
          }
          if(response.DATA[0].MIX_YN && response.DATA[0].MIX_YN == 'Y') {
            this.emblemId = "MIX";
            this.mgofNmColor = "is-txt-green";
          }
          if(response.DATA[0].CAU_YN && response.DATA[0].CAU_YN == 'Y') {
            this.emblemId = "CAU";
            this.mgofNmColor = "is-txt-green";
          }
          if(response.DATA[0].LWS_SBD_YN && response.DATA[0].LWS_SBD_YN == 'Y') {
            this.emblemId = "LWS_SBD";
            this.mgofNmColor = "is-txt-red";
          }
          if(response.DATA[0].MPBL_YN && response.DATA[0].MPBL_YN == 'Y') {
            this.emblemId = "MPBL";
            this.mgofNmColor = "is-txt-red";
          }
          if(this.emblemId != '') {
            this.emblemColor = this.EMBLEM_LIST.filter(item => item.id == this.emblemId)[0].color
            this.emblemCaps = this.EMBLEM_LIST.filter(item => item.id == this.emblemId)[0].caps
          }

          // 특이내용 세팅
          this.PCL_DTL = response.DATA[0].PCL_DTL
        }
      }

      
    },


    //AS 접수 정보 세팅
    async setCuttAsInfo(custInfo) {
      this.CUST_INFO = custInfo;
      this.LEASE_INFO = {};
      let hnoAddr = '';
      
      if(!this.mixin_isEmpty(custInfo.HO_ADM_NO)) {
        let postParam = {
            HNO: custInfo.HO_ADM_NO
        };
        let headParam = {head: {}};
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
        //AS 접수 - 임대정보 조회
        const response = await this.common_postCall("/phone-api/as/cutt/selectCotisLease", postParam, headParam);

        if (!response.HEADER.ERROR_FLAG) {
          this.LEASE_INFO = response.DATA[0];

          //시설구분 값 변경
          //fn_lclsChange
        }
      }
      this.$eventBus.$emit('setCuttLeaseInfo', this.LEASE_INFO);
        

      //AS 접수 데이터 초기화
      this.initFlwAcp("CHANGE_CUST");
          
    },


    //AS 접수 등록 버튼
    async btnFlwAcp() {
      if(!this.SAVED_AS_CUTT_INFO.PHN_CUTT_ID || this.SAVED_AS_CUTT_INFO.PHN_CUTT_ID == "") {
        this.showAlert({alertDialogToggle: true, msg: "상담저장 후에 AS접수를 하셔야 합니다.", iconClass: 'is-info', type: 'default'});
        return false;
      }

      //TODO :: 상담 저장 후 '새상담' 을 시작한 상태로 보임. 우린 상담 저장 후 새상담 버튼을 출력안하도록 처리하여 해당 상황을 만들지 않도록 처리. by hjh.
      // if(jQuery('#cnslt_reg_btn').is(':visible') == true) {
      //   msgStart("상담저장 후 새상담을 비활성화하고 AS접수를 하셔야 합니다.");
      //   return false;
      // }

      if(this.LCLS_CD == "3" && this.HNO == "") {
        this.showAlert({alertDialogToggle: true, msg: "해당단지는 cotis에 등록된 단지가 아닙니다.<br/>해당단지는 AS접수가 불가합니다.<br/>cotis에 등록요청해주세요(" + this.MGOF_CD + ")", iconClass: 'is-info', type: 'default'});
        return false;
      }
      if(this.LCLS_CD == "2" && this.BLDG_ID == "") {
        this.showAlert({alertDialogToggle: true, msg: "해당단지는 cotis에 등록된 단지가 아닙니다.<br/>해당단지는 AS접수가 불가합니다.<br/>cotis에 등록요청해주세요(" + this.MGOF_CD + ")", iconClass: 'is-info', type: 'default'});
        return false;
      }
      if(this.LEASE_INFO.UPP_ARA_HDQ_CD == "" && this.LEASE_INFO.MGOF_CD == this.MGOF_CD) {
        this.showAlert({alertDialogToggle: true, msg: "해당지역본부는 cotis에 등록된 지역본부가 아닙니다.<br/>해당지역본부는 AS접수가 불가합니다.<br/>cotis에 등록요청해주세요", iconClass: 'is-info', type: 'default'});
        return false;
      }


      //validation rule check
      if (!this.detailValidateFlwAcp()) {
        if(!this.openValidationMessage(this.validateRules.CVPR_NM, this.CVPR_NM)) {
          return
        }
        return;
      }
      
      // if (jQuery("#flaw_form #cvpr_nm").val() == "" || jQuery("#flaw_form #cvpr_nm").val() == undefined) {
      //   msgStart("접수자명을 입력하셔야 합니다.");
      //   return false;
      // }


      // if (jQuery("#flaw_form #cvpr_nm").val().length > 5) {
      //   msgStart("접수자명이 5자를 초과할 수 없습니다.");
      //   return false;
      // }

      
      // if (jQuery("#flaw_form #mbl_no").val() == "" || jQuery("#flaw_form #mbl_no").val() == undefined) {
      //   msgStart("연락처를 입력하셔야 합니다.");
      //   return false;
      // }
      // if (jQuery("#flaw_form #flw_ds_cd").val() == "" || jQuery("#flaw_form #flw_ds_cd").val() == undefined) {
      //   msgStart("AS구분을 입력하셔야 합니다.");
      //   return false;
      // }
      if((this.FLW_DS_CD == "10" || this.FLW_DS_CD == "20" || this.FLW_DS_CD == "90") && this.FLW_DTL_DS_CD == "") {
        this.showAlert({alertDialogToggle: true, msg:"보수구분을 선택해 주세요.", iconClass: 'is-info', type: 'default'});
        return false;
      }
      // if (jQuery("#flaw_form #lcls_cd").val() == "" || jQuery("#flaw_form #lcls_cd").val() == undefined) {
      //   msgStart("대분류를 입력하셔야 합니다.");
      //   return false;
      // }
      // if (jQuery("#flaw_form #spce_cd").val() == "" || jQuery("#flaw_form #spce_cd").val() == undefined) {
      //   msgStart("공간을 입력하셔야 합니다.");
      //   return false;
      // }
      // if (jQuery('#flaw_form #mntn_flw_cs_cd option:selected').val() == "" || jQuery("#flaw_form #mntn_flw_cs_cd option:selected").val() == undefined) {
      //   msgStart("공종을 입력하셔야 합니다.");
      //   return false;
      // }
      // if (jQuery("#flaw_form #flw_cts").val() == "" || jQuery("#flaw_form #flw_cts").val() == undefined) {
      //   msgStart("AS내용을 입력하셔야 합니다.");
      //   return false;
      // }
      // if (jQuery("#flaw_form #icpr_empnm").val() == "" || jQuery("#flaw_form #icpr_empnm").val() == undefined) {
      //   msgStart("지역본부담당자/관리소담당자정보를 입력하셔야 합니다.");
      //   return false;
      // }
      if(this.FLW_DS_CD == "20" || this.FLW_DS_CD == "90") { // 20:시공사AS  90:만료AS점검
        if(this.FRM_CD == "") {
          this.showAlert({alertDialogToggle: true, msg:"보수지시업체를 선택해 주세요.", iconClass: 'is-info', type: 'default', callAfter: this.openFindAsAdmFrm});
          return false;
        }
      }

      //AS 접수 등록중인지 여부(중복 클릭 방지)
      if(this.isRunSave) {
        this.showAlert({alertDialogToggle: true, msg:"AS 접수가 진행중 입니다.", iconClass: 'is-info', type: 'default'});
        return false;
      }

      this.showAlert(this.MESSAGE.CONFIRM.REG);
      
    },

    //AS 접수 저장
    async flwAcpSave() {
      //AS접수 잠금
      this.isRunSave = true;

      //긴급AS여부
      // 상담유형 : AS(05080000) - AS접수(05080100) - 긴급(05080102)
      if (this.SAVED_AS_CUTT_INFO.CUTT_TYPE_ID == "05080102" && this.FLW_DS_CD == "20") {
        this.URG_FLW_YN = "Y";
      }

      //카카오알림톡 공종이름(공간/부위자재/공사)
      if (this.MNTN_FLW_CS_CD != '') {
        const spceNm = this.SPCE_CD_LIST.filter(item => item.value == this.SPCE_CD)[0].text;
        const mntnFlwCsNm = this.MNTN_FLW_CS_CD_LIST.filter(item => item.value == this.MNTN_FLW_CS_CD)[0].text;
        this.MSG_FLW_NM = spceNm + "/" + mntnFlwCsNm.split(' - ')[0] + "/" + mntnFlwCsNm.split(' - ')[3];
        console.log("카카오알림톡 공종이름(공간/부위자재/공사) ::: ", spceNm, mntnFlwCsNm, this.MSG_FLW_NM)
      }

      let phone_num = ""; // 문자 전송될 업체 담당자 휴대폰번호
      let cust_nm = "";
      
      if(this.FLW_DS_CD == "20" || this.FLW_DS_CD == "90") {
        cust_nm = this.FRM_NM;
        phone_num = this.PRCR_TLNO.replace(/\D/g, "");
      } else {
        cust_nm = this.ICPR_EMPNM;
        phone_num = this.ICPR_MBL_NO.replace(/\D/g, "");
      }
      this.SPPB_TLNO_ORG = this.SPPB_TLNO.replace(/\D/g, "");
      this.MBL_NO_ONLYNUM = this.MBL_NO.replace(/\D/g, "");
      
      // AS접수 번호가 필요하므로 AS접수 후 문자 발송
      this.HP_NO = phone_num;
      this.CUST_NM = cust_nm;

      let postParam = {
        PHN_CUTT_ID : this.SAVED_AS_CUTT_INFO.PHN_CUTT_ID, 

        HNO: this.HNO,  //주택번호
        ARA_HDQ_CD: this.ARA_HDQ_CD,
        MGOF_CD: this.MGOF_CD,  //단지코드
        MGOF_NM: this.MGOF_NM,  //단지명
        BLDG_NO: this.BLDG_NO,  //동
        BLDG_ID: this.BLDG_ID,  //동 ID
        HS_NO: this.HS_NO,    //호
         
        LCLS_CD: this.LCLS_CD,  //시설구분 코드- 초기 값 - 3(세대별)
        FLW_DS_CD: this.FLW_DS_CD,  //AS구분 코드
        FLW_DTL_DS_CD: this.FLW_DTL_DS_CD,  //보수 구분
        SPCE_CD: this.SPCE_CD,  //공간 코드
        FLW_CTS: this.FLW_CTS,  //AS 내용
        MNTN_FLW_CS_CD: this.MNTN_FLW_CS_CD, //공종 코드 - 유지하자분류코드

        //AS구분 - 시공사하자 - 보수지시 정보
        PRCR_ID: this.PRCR_ID,
        FRM_NM: this.FRM_NM,
        PRCR_TLNO: this.PRCR_TLNO,
        SPPB_TLNO: this.SPPB_TLNO,
        FRM_CD: this.FRM_CD,
        FLW_PGRS_SS_CD: this.FLW_PGRS_SS_CD,
        RPR_XPC_DT: this.RPR_XPC_DT,

        //담당자정보
        MNTN_USR_DS_CD: this.MNTN_USR_DS_CD, //담당자 구분
        ICPR_EMPNO: this.ICPR_EMPNO,
        ICPR_EMPNM: this.ICPR_EMPNM,
        ICPR_DEP_CD: this.ICPR_DEP_CD,
        ICPR_MBL_NO: this.ICPR_MBL_NO,

        CVPR_NM: this.CVPR_NM,  //접수자
        MBL_NO: this.MBL_NO, //연락처

        URG_FLW_YN: this.URG_FLW_YN, //긴급AS여부
        SPPB_TLNO_ORG: this.SPPB_TLNO_ORG,  //담당자전화번호(숫자만)

        TLNO: this.TLNO,  //전화번호
        EML: this.EML,  //이메일
        ACP_ATCH_SN: this.ACP_ATCH_SN,  //첨부파일번호
        MMG_ID: this.MMG_ID, //기동보수반아이디
        FLW_RMK: this.FLW_RMK,  //AS비고
        FLW_TP_CD: this.FLW_TP_CD,  //AS유형코드

        FLW_CMUS_FCL_DS_CD: this.FLW_CMUS_FCL_DS_CD,  //AS공용시설구분코드

        //카카오톡 알림
        CUST_NM: this.CUST_NM, //고객명
        HP_NO: this.HP_NO, //핸드폰
        TITLE: this.TITLE,
        MESSAGE_TYPE: this.MESSAGE_TYPE, //
        USER_VAR: this.USER_VAR, //
        MBL_NO_ONLYNUM: this.MBL_NO_ONLYNUM, //연락처(숫자만)
        MSG_FLW_NM: this.MSG_FLW_NM, //카카오알림톡 공종이름(공간/부위자재/공사)
        KAKAO_URL_YN: this.KAKAO_URL_YN, //카카오url주소 포함 유무
      }

      let headParam = {head : {}}
      
      console.log("postParam======================", postParam)

      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let response  = await this.common_postCall('/phone-api/as/flwacp/registFlwAcp', postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.FLW_CNT += 1;

        //this.cuttReset(); //상담 초기화 - 상담 저장 후 AS 접수 진행을 위해 초기화 하지 않음.
        this.closeMsg();
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        
        //AS 접수 데이터 초기화 - 안하기로 함
        //this.initFlwAcp("SAVED");

        
      }

      this.isRunSave = false;

    },

    //validate check
    detailValidateFlwAcp () {
      return this.$refs.formFlwAcp.validate();
    },



    //시설구분 변경 시 공간 코드 조회
    async changeLclsCd(item) {
      this.SPCE_CD = '';
      this.MNTN_FLW_CS_CD = '';
      this.mixinAsGetMntnSpceCode(item)
    },

    //AS구분 변경 시 이벤트(선택 항목별 보수구분 조회, 시공사 하자 선택 시 보수지시 다이얼로그 오픈)
    async changeFlwDsCd(item) {
      console.log("changeFlwDsCd", item)
      
      this.FLW_DTL_DS_CD = '';
      this.FLW_DTL_DS_CD_LIST = [];

      //시공사 하자 정보 초기화
      this.PRCR_ID = '';
      this.FRM_NM = '';
      this.PRCR_TLNO = '';
      this.SPPB_TLNO = '';
      this.FRM_CD = '';
      this.FLW_PGRS_SS_CD = '10'; //접수
      this.RPR_XPC_DT = '';

      if(item === "20" && (this.ARA_HDQ_CD == '' || this.MGOF_CD == '')) {
        this.FLW_DS_CD = '';
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_MGOF_CD);
        return
      }
      
      //보수구분 조회
      if(item == '10' || item == '20' || item == '60' || item == '90') {
        let cdGrp;
        if(item == '10') {
          cdGrp = ["10","20"]
        } else if(item == '20' || item == '60' || item == '90') {
          cdGrp = ["60","70", "80"]
        }
        if(cdGrp && cdGrp.length > 0) {
          this.FLW_DTL_DS_CD_LIST = await this.mixinAsGetCommonCode("FLW_DTL_DS_CD", cdGrp)
        }
      }
      
      //시공사하자 선택 시 보수지시 다이얼로그 오픈
      item === '20' ? this.openFindAsAdmFrm() : ''
    },


    //공간 선택 시, 공종 목록 조회
    async changeSpceCd() {
      this.MNTN_FLW_CS_CD = '';
      this.MNTN_FLW_CS_CD_LIST = [];

      //시설, 공간 필수 항목 조회
      if(this.LCLS_CD == '' || this.SPCE_CD == '') {
        return;
      }
      //시설구분 + 공간 값으로 공종 조회.
      let postParam = {
        LCLS_CD: this.LCLS_CD,
        MNTN_SPCE_CD: this.SPCE_CD
      };
      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCommonMapper_Cotis'
      }};
      this.loadingMntnFlwCsCd = true;
      //MMA_유지하자분류관리(공종) 코드 조회
      const response = await this.common_postCall("/api/biz/common/external/select/selectCotisMntnFlwCsCdList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.MNTN_FLW_CS_CD_LIST = response.DATA;
        this.MNTN_FLW_CS_CD_LIST.map(item => {
          item.text = item.REON_MTRL_NM + ' - ' + item.MNTN_FLW_TP_NM + ' - ' + item.MNTN_CSTP_NM + ' - ' + item.MNTN_CON_NM;
          item.value = item.MNTN_FLW_CS_CD;
        })
      }
      this.loadingMntnFlwCsCd = false;
    },

    clickMntnFlwCsCd() {
      if(this.LCLS_CD == '' || this.SPCE_CD == '') {
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_LCLS_SPCE_CD);
        return;
      }
      //필터 이벤트 발생 시키기 위해 searchInput값 초기화.
      this.searchInput = ' ';
    },

    //담당자 찾기 다이얼로그 오픈
    openFindAsIcpr() {
      if(this.ARA_HDQ_CD == '') {
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_MGOF_CD);
        return
      }
      this.MNTN_USR_DS_CD = "050";
      
      // AS구분이 유지보수인 경우
      if(this.FLW_DS_CD == "10") {  
        this.MNTN_USR_DS_CD = "bothcd";
      }
      // this.mixin_showDialog('FindAsIcpr');
      this.mixin_openSearchWindow( 'LayoutSearchPopup', '1750', '627', {compo_name : 'CompoFindAsIcpr', callback : 'setIcpr', title: '담당자 검색', popData: {ARA_HDQ_CD: this.ARA_HDQ_CD, MGOF_CD: this.MGOF_CD, MGOF_NM: this.MGOF_NM, MNTN_USR_DS_CD: this.MNTN_USR_DS_CD}})
    },

    
    //주소 검색 다이얼로그 - 주소 선택 시
    setAdr(item) {
      this.ARA_HDQ_CD = item.ARA_HDQ_CD;
      this.MGOF_CD = item.MGOF_CD;
      this.MGOF_NM = item.MGOF_NM;
      this.BLDG_ID = item.BLDG_ID;
      //this.BLDG_ADR = item.BLDG_ADR;
      this.BLDG_NO = item.BLDG_NO;
      this.HNO = item.HNO;
      this.HS_NO = item.HS_NO;

      //선택된 주소의 고객 정보 검색 후 세팅(고객정보 영역, 상담정보 영역, 계약정보 영역, AS접수 영역, 이력 영역) - 고객 조회 후 선택하는것과 같은 이벤트!!!
      this.getCustByHno();

      this.mixin_hideDialog('FindAsAdr');
    },

    //동주소 검색 다이얼로그 - 단지/동주소 선택 시, 
    setBldgAdr(item) {
      this.ARA_HDQ_CD = item.ARA_HDQ_CD;
      this.MGOF_CD = item.MGOF_CD;
      if (item.BLDG_ADR && item.BLDG_ADR != '') {
        this.MGOF_NM = item.BLDG_ADR;
        this.BLDG_NO = item.BLDG_NO;
        this.BLDG_ID = item.BLDG_ID;
      } else {
        this.MGOF_NM = item.MGOF_NM;
        this.BLDG_NO = '';
        this.BLDG_ID = '';
      }
      this.HS_NO = '';

      //단지 메모(특이사항)이 있는지 조회
      this.getMgofMemo();

      //단지 유형 아이콘 조회(혼합, 소송, 주의, 신규, AS 접수 불가)
      this.getMgofType();

      this.mixin_hideDialog('FindAsBldgAdr')
    },

    //동 검색 다이얼로그 - row 선택 시
    setBldgNo(item) {
      this.BLDG_NO = item.BLDG_NO;
      this.BLDG_ID = item.BLDG_ID;
      this.HS_NO = '';

      this.mixin_hideDialog('FindAsBldgNo')
    },


    //호 검색 다이얼로그 - row 선택 시
    setHsNo(item) {
      this.HS_NO = item.HS_NO;

      this.mixin_hideDialog('FindAsHsNo')
    },


    //공종 검색 다이얼로그 - 더블클릭으로 선택 시
    async setMntnFlwCs(item) {
      console.log("setMntnFlwCs", item)
      if(this.LCLS_CD != item.LCLS_CD) {
        this.LCLS_CD = item.LCLS_CD;
        this.mixinAsGetMntnSpceCode(this.LCLS_CD);
      }
      if(this.SPCE_CD != item.MNTN_SPCE_CD) {
        this.SPCE_CD = item.MNTN_SPCE_CD;
        this.changeSpceCd();
      }
      this.MNTN_FLW_CS_CD = item.MNTN_FLW_CS_CD;
      this.mixin_hideDialog('FindAsMntnFlwCs')
    },

    //담당자 검색 다이얼로그 - 더블클릭으로 선택 시
    setIcpr(item) {
      this.ICPR_EMPNO = item.USR_ID;
      this.ICPR_EMPNM = item.USR_NM;

      if(item.DEP_CD_D) {
        this.ICPR_DEP_CD = item.DEP_CD_D;
      }
      if(item.MBL_NO) {
        this.ICPR_MBL_NO = item.MBL_NO;
      }

      if(item.SPPB_TLNO) {
        this.SPPB_TLNO = item.SPPB_TLNO;
      }
      if(item.EML) {
        this.EML = item.EML;
      }

      if(item.MNTN_USR_DS_CD && item.MNTN_USR_DS_CD == "050"){ // 담당자구분 050:지역본부담당자
        this.FLW_PGRS_SS_CD = "20"; // 처리상태코드 20 : 접수(이관)
      } else {
         this.FLW_PGRS_SS_CD = "10"; // 처리상태코드 10 : 접수
      }
      
      this.mixin_hideDialog('FindAsIcpr')
    },


    //동 다이얼로그 오픈.
    openFindAsBldgNo() {
      if(this.ARA_HDQ_CD == '' || this.MGOF_CD == '') {
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_MGOF_CD);
        return
      }
      // this.mixin_showDialog('FindAsBldgNo');
      this.mixin_openSearchWindow( 'LayoutSearchPopup', '710', '570', {compo_name : 'CompoFindAsBldgNo', title: '동현황 검색', callback:'setBldgNo', popData: {ARA_HDQ_CD: this.ARA_HDQ_CD, MGOF_CD: this.MGOF_CD, MGOF_NM: this.MGOF_NM}});
    },

    //호 다이얼로그 오픈.
    openFindAsHsNo() {
      if(this.ARA_HDQ_CD == '' || this.MGOF_CD == '') {
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_MGOF_CD);
        return
      }
      if(this.BLDG_NO == '') {
        this.showAlert(this.MESSAGE.ALERT.REQUIRED_BLDG_NO);
        return
      }
      // this.mixin_showDialog('FindAsHsNo');
      this.mixin_openSearchWindow( 'LayoutSearchPopup', '880', '620', {compo_name : 'CompoFindAsHsNo', title: '세대현황 검색', callback:'setHsNo', popData: {ARA_HDQ_CD: this.ARA_HDQ_CD, MGOF_CD: this.MGOF_CD, MGOF_NM: this.MGOF_NM, BLDG_NO: this.BLDG_NO}});
    },

    //보수지시 다이얼로그 오픈.
    openFindAsAdmFrm() {
      this.mixin_showDialog('FindAsAdmFrm')
    },

    //보수지시 다이얼로그 - 더블클릭으로 선택 시
    setAdmFrm(item) {
      this.PRCR_ID = item.USR_ID;
      this.FRM_NM = item.FRM_NM;
      this.PRCR_TLNO = item.MBL_NO;
      this.SPPB_TLNO = item.SPPB_TLNO;
      this.FRM_CD = item.FRM_CD;
      this.FLW_PGRS_SS_CD = "50";
      this.RPR_XPC_DT = this.$moment(new Date()).add(14,'days').format('YYYYMMDD');//보수처리기한 - 14일 후
      this.mixin_hideDialog('FindAsAdmFrm')
    },

    //validateRules의 rule 항목과 값을 받아 해당 항목의 rule이 true가 아닐 시 해당 메세지를 출력한다.
    //Rule을 순서대로 읽어와 먼저 rule을 위반하는 메세지를 showAlert으로 출력한다.
    //필수값 체크 메세지는 출력하지 않는다.(index:0)
    openValidationMessage(validateRulesItem, ruleValue, isShowInx0 = false) {
      try {
        validateRulesItem.map(
          (rule, index) => {
            const validValue = rule(ruleValue);
            if(validValue !== true) {
              //여러 rule 중 하나만 출력하기 위해 throw로 map 벗어남.
              if(index == 0 && isShowInx0 === false) {
                //필수값 메세지는 출력하지 않는다.(index:0)
                throw {isShow:false, message:validValue};
              } else {
                throw {isShow:true, message:validValue};
              }
            }
          }
        )
      } catch(e) {
        if(e.isShow) {
          this.showAlert({alertDialogToggle: true, msg: e.message, iconClass: 'is-caution', type: 'default'});
          return false;
        }
      }
      return true;
    },


    async getCustByHno() {
      this.CUST_LIST = [];
      
      let URLData = "/api/biz/common/select/custList";
      let postParam = {
        HNO: this.HNO
        , SCH_CUSTCO_ID: this.computedUserCenter
      };

      let headParam = {
        head: {
          ns : 'lhcs.cust.dao.CustMapper'
          , sn : 'custList'
        }
      }

      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      let response = await this.common_postCall(URLData, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {

        try{
          response.DATA.forEach((data, idx) => {
            data.CUST_PHN_NO = this.mixin_setPhoneNo(data.CUST_PHN_NO);
            data.REG_DT = this.mixin_convertDate(data.REG_DT, 'yyyy-MM-dd HH:mm:ss');
            data.MDFCN_DT = this.mixin_convertDate(data.MDFCN_DT, 'yyyy-MM-dd HH:mm:ss');
          });
        } catch (e) {
          this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
        }

        const custInfo = response.DATA[0];

        //각 영역에 정보 세팅 요청.
        this.$eventBus.$emit('allReSet')//전체초기화
        setTimeout(() => {
          this.$eventBus.$emit("setCustInfo", custInfo);
        }, 1000);
        
        
      }
    },

    async searchBigDataMntnFlwCsCd(flwCtsEnterKeyYn) {
      console.log("searchBigDataMntnFlwCsCd", this.DropBigData, this.LCLS_CD, this.FLW_CTS)
      this.bigDataList = [];
      if(this.DropBigData) {
        this.DropBigData = false;
        return
      }
      if(this.FLW_CTS == '') {
        this.DropBigData = false;
        if(flwCtsEnterKeyYn == 'N') {
          this.showAlertInfo({msg:'AS내용을 입력 후 엔터키 입력 또는 현재 아이콘을 누르시면 빅데이터 추천검색이 뜹니다.'})
        }
        return
      }

      const postParam = {
        FLW_CTS: this.FLW_CTS,
        LCLS_NM: this.LCLS_CD_LIST.filter(item => item.value == this.LCLS_CD)[0].text,
      };
      console.log("postParam", postParam)

      const headParam = {head: {}};
      const response = await this.common_postCall("/phone-api/as/common/searchBigDataMntnFlwCsCd", postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        if(response.DATA.length > 0) {
          const resultData = JSON.parse(response.DATA[0].BIG_DATA_RESULT);
          console.log("searchBigDataMntnFlwCsCd ::: ", resultData)
          resultData.data.results.map(item => {
            this.bigDataList.push({
              LCLS_CD: this.LCLS_CD,
              MNTN_SPCE_CD: this.SPCE_CD_LIST.filter(sItem => sItem.text == item[1])[0].value,
              MNTN_FLW_CS_CD: item[7],
              BIG_DATA_NM: item[1] + " > " + item[2] + " > " + item[3] + " > " + item[4] + " > " + item[5],
            })
          })
        }
      }

      // const resultStr = '{\"data\":{\"fields\":[{\"name\":\"\\ucd94\\ucc9c\\uc21c\\uc704\",\"type\":\"INTEGER\"},{\"name\":\"\\uacf5\\uac04\\uba85\",\"type\":\"TEXT\"},{\"name\":\"\\ubd80\\uc704\\uc790\\uc7ac\\uba85\",\"type\":\"TEXT\"},{\"name\":\"\\ud558\\uc790\\uc720\\ud615\\uba85\",\"type\":\"TEXT\"},{\"name\":\"\\uacf5\\uc885\\uba85\",\"type\":\"TEXT\"},{\"name\":\"\\uacf5\\uc0ac\\uc720\\ud615\\uba85\",\"type\":\"TEXT\"},{\"name\":\"\\uc720\\uc9c0\\ud558\\uc790\\ubd84\\ub958\\ucf54\\ub4dc\",\"type\":\"TEXT\"},{\"name\":\"\\uc720\\uc9c0\\ud558\\uc790\\uc720\\ud615\\ucf54\\ub4dc\",\"type\":\"TEXT\"}],\"results\":[[1,\"\\uacf5\\uc6a9\\uc695\\uc2e4\",\"\\ucc9c\\uc7a5\",\"\\ub204\\uc218\",\"\\uae30\\uacc4\",\"\\uc624/\\ubc30\\uc218\\ubc30\\uad00\\uacf5\\uc0ac\",\"015\",\"30061400153044\"],[2,\"\\uacf5\\uc6a9\\uc695\\uc2e4\",\"\\ucc9c\\uc7a5\",\"\\ub204\\uc218\",\"\\uac74\\ucd95\",\"\\ubc29\\uc218\\uacf5\\uc0ac\",\"015\",\"30061400151027\"],[3,\"\\uacf5\\uc6a9\\uc695\\uc2e4\",\"\\ucc9c\\uc7a5\",\"\\ub204\\uc218\",\"\\uae30\\uacc4\",\"\\uae09\\uc218/\\uae09\\ud0d5\\ubc30\\uad00\\uacf5\\uc0ac\",\"015\",\"30061400153008\"],[4,\"\\uacf5\\uc6a9\\uc695\\uc2e4\",\"\\uc218\\uc804\",\"\\ub204\\uc218\",\"\\uae30\\uacc4\",\"\\uc624/\\ubc30\\uc218\\ubc30\\uad00\\uacf5\\uc0ac\",\"015\",\"30060920153044\"]]}}\n'

      // const resultData = JSON.parse(resultStr);
      // console.log("searchBigDataMntnFlwCsCd ::: ", resultData, this.SPCE_CD_LIST)
      // resultData.data.results.map(item => {
      //   this.bigDataList.push({
      //     LCLS_CD: this.LCLS_CD,
      //     MNTN_SPCE_CD: this.SPCE_CD_LIST.filter(sItem => sItem.text == item[1])[0].value,
      //     MNTN_FLW_CS_CD: item[7],
      //     BIG_DATA_NM: item[1] + " > " + item[2] + " > " + item[3] + " > " + item[4] + " > " + item[5],
      //   })
      // })
      console.log("this.bigDataList", this.bigDataList)


      this.DropBigData = true;
    },

    //공종 키워드 검색 필터
    filterMntnFlwCsCd(item, queryText, itemText) {
      // console.log("filterMntnFlwCsCd", item, "'" + queryText + "'", ", '" + itemText + "'")
      if(queryText == ' ') {
        this.searchInput = this.MNTN_FLW_CS_CD_CHIP.join(",");
        queryText = this.MNTN_FLW_CS_CD_CHIP.join(",");;
      }
      const querys = queryText.split(",");
      // console.log("querys", querys)
      let retVal = true;
      for(let i = 0; i < querys.length; i++) {
        if(!(itemText.toLowerCase().indexOf(querys[i].trim().toLowerCase()) > -1)) {
          retVal = false;
          break;
        }
      }
      // console.log("item====================", "'" + itemText + "'", ", '" + itemText.toLowerCase() + "'", ", '" + retVal + "'")
      return (
        retVal
      );
    },

    deleteChip(chip, chipIdx) {
      this.MNTN_FLW_CS_CD_CHIP.splice(chipIdx,1);
    },
    addSpceNm(nm) {
      this.$eventBus.$emit("setSpceCd", nm)
    }, 
    addMntnFlwCsKeyword(nm) {
      this.$eventBus.$emit("setMntnFlwCsCdKeyword", nm)
    },

    setSpceCdKeyword(spceNm) {
      this.SPCE_CD = this.SPCE_CD_LIST.filter(item => item.text == spceNm)[0].value;
      this.changeSpceCd();
    },
    setMntnFlwCsCdKeyword(keyword) {
      this.MNTN_FLW_CS_CD_CHIP.push(keyword);
    },

    //메시지창 종료
    closeMsg(){
      this.$store.commit('alertStore/hideAlert');
    },

  },
  
};
</script>

<style lang="scss" scoped>

</style>