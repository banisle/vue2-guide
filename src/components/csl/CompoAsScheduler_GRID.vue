<template>
  <div :class="!IsPopupProp ? 'is-mt-l' : ''" :style="`display: ${IsHideSchInfoProp ? 'none' : 'block'}`">
    <div 
      class="pl-grid-top">
      <div class="pl-grid-top-left">
        <!-- <div class="pl-header--title">스케줄러 목록</div> -->
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">건수 <em class="pl-1 is-txt-blue">({{ totalCount }})</em></span>
      </div>
    </div>
    <div 
      v-if="!IsPopupProp"
      class="pl-grid-top">
      <div class="pl-grid-top-left">
        <!-- 태그 지정 -->
        <v-menu
          min-width="280"
          max-width="280"
          bottom
          right
          offset-y
          offset-x
          :close-on-content-click=false
          content-class="pl-menu-drop pa-2"
          v-model="DropTags"
          >
          <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
            <v-btn
              v-bind="menuAttrs"
              v-on="menuOn"
              class="pl-btn is-icon is-sub is-sm">
              <span class="pl-icon20 tags"></span>
              태그 지정
            </v-btn>
          </template>
          <div class="px-3 py-2">
            <div class="d-flex">
              <h3 style="font-size: 16px">태그 지정</h3>
              <v-btn
                @click="DropTags = false"
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
            <!-- 리스트 -->
            <div class="is-mt-m">
              <!-- <div class="d-flex align-center">
                <compo-tooltip-btn
                  TitleProp="추가"
                  ClassProp="pl-tooltip-btn ml-auto"
                  IconProp="pl-icon20 circle-plus"
                  TooltipPositionProp="bottom"
                  @btnClick="addTag('addTagWrap')"
                ></compo-tooltip-btn>
              </div> -->
              <!-- drag list -->
              <div class="spacing-wrap sp-8 flex-column is-mt-s" >
                <draggable
                  ghost-class="drag-ghost-box"
                  :options="{ draggable: '.draggable-unit' }"
                  v-model="TAG_LIST">
                  <div
                    v-for="item in TAG_LIST"
                    :key="item.TAG_CD"
                    :class="item.draggable ? 'draggable-unit' : ''"
                    >
                    <div
                      style="cursor: pointer;"
                      class="d-flex align-center pr-1 py-1 hover-light-bg rounded-lg">
                      <span
                        class="pl-circle-tag"
                        :style="`background-color: ${item.TAG_COLOR}; flex: 0 0 22px`"
                        >
                      </span>
                      <template v-if="item.edit || !mixin_isEmpty(SCH_USER.USER_ID)">
                        <v-text-field
                          v-model="item.TAG_NM"
                          class="pl-form type-middle is-auto ml-2 is-trans"
                        ></v-text-field>
                      </template>
                      <template v-else>
                        <span
                          class="pl-value-txt ml-2 d-flex align-center"
                          style="width: 100%; padding-left: 9px; line-height: 1"
                          @click="btnUpdateTag(item)">{{ item.TAG_NM }}</span>
                      </template>
                      <div class="d-flex" v-if="!item.disabled && mixin_isEmpty(SCH_USER.USER_ID)">
                        <!-- 수정 버튼 -->
                        <compo-tooltip-btn
                          v-if="!item.edit"
                          TitleProp="수정"
                          ClassProp="pl-tooltip-btn"
                          IconProp="pl-icon20 edit"
                          TooltipPositionProp="bottom"
                          @btnClick="item.edit = true"
                        ></compo-tooltip-btn>
                        <compo-tooltip-btn
                          v-else
                          TitleProp="확인"
                          ClassProp="pl-tooltip-btn"
                          IconProp="pl-icon20 is-drag-icon-check"
                          TooltipPositionProp="bottom"
                          @btnClick="updateUserTagName(item)"
                        ></compo-tooltip-btn>
                      </div>
                    </div>
                  </div>
                </draggable>
              </div>
            </div>
          </div>
        </v-menu>
        <!-- 태그 해제 -->
        <v-btn class="pl-btn is-sm is-sub" @click="btnUpdateTag(disableTag)">
          태그 해제
        </v-btn>
        <div class="spacing-wrap sp-16 align-center ml-2">
          <div
            class="d-flex align-center"
            style="cursor: pointer;"
            v-for="item in filteredCircleTag"
            :key="item.TAG_CD"
            @click="tagSearch(item)"
            >
            <span
              class="pl-circle-tag"
              :style="{ backgroundColor: item.TAG_COLOR }"
              :title="item.TAG_NM"
            ></span>
            <span class="ml-1">{{ item.TAG_CNT }}건</span>
          </div>
        </div>
        <!-- 리사이즈 토글 -->
        <compo-tooltip-btn
          :TitleProp=computedResizeText
          ClassProp="pl-tooltip-btn ml-2"
          :IconProp=computedResizeClass
          TooltipPositionProp="bottom"
          @btnClick="resizeClass = !resizeClass"
        ></compo-tooltip-btn>

      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">건수 <em class="pl-1 is-txt-blue">({{ totalCount }})</em></span>
        <v-btn class="pl-btn is-sub is-sm" @click="btnAllApply">일괄적용</v-btn>
        <!-- 일괄적용 레이어 -->
        <div
          v-if="dropAllApply"
          class="pl-drop-layer"
          style="position: absolute; transform: translate(-360px, 160px); width: 550px;"
          >
          <CompoAsSchedulerAllApply 
            :DataProp="SELECTED_ITEMS"
            @afterAllApply="afterAllApply"
            @close="dropAllApply = false"
          />
        </div>
        <v-btn class="pl-btn is-sub is-sm" @click="btnUpdateUncomplete">완료해제</v-btn>
        <v-btn class="pl-btn is-sub is-sm" @click="excelDown">엑셀저장</v-btn>
        <v-btn class="pl-btn is-sub is-sm" @click="openPopCalender">캘린더로 보기</v-btn>
        <v-btn class="pl-btn is-sub is-sm" @click="openPopScheduler">팝업으로 보기</v-btn>
      </div>
    </div>
    <v-data-table
      v-model="SELECTED_ITEMS"
      class="pl-grid is-mt-s has-control"
      :item-class="isActiveRow"
      :item-style="setItemStyle"
      :headers="headers"
      :items="SCHEDULER_LIST"
      :show-select="!IsPopupProp ? true : false"
      fixed-header
      item-key="ROW_NUM"
      :height="IsPopupProp ? '630px' : IsExpandSchListProp ? '508px' : '179px'"
      :items-per-page="ROW_PER_PAGE"
      @click:row="rowClick"
      @dblclick:row="rowDblClick"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :loading="isLoading"
      loading-text="조회중입니다."
      :page.sync="page"
    >
      <!-- 업체명 -->
      <template v-slot:item.FRM_NM="{ item }">
        <div>
          <v-tooltip content-class="pl-tooltip " bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                {{ item.FRM_NM }}
              </span>
            </template>
            <span>{{ item.FRM_NM }}</span>
          </v-tooltip>
        </div>
      </template>

      <!-- 단지/동주소 -->
      <template v-slot:item.MGOF_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              {{ item.MGOF_NM }}
            </span>
          </template>
          <span>{{ item.MGOF_NM }}</span>
        </v-tooltip>
      </template>

      <!-- 방문예정일 -->
      <template v-slot:item.VST_DT="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              {{ item.VST_DT }}
            </span>
          </template>
          <span>{{ item.VST_DT }}</span>
        </v-tooltip>
      </template>

      <!-- 메모 -->
      <template v-slot:item.RSRV_CNTNT="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              {{ item.RSRV_CNTNT }}
            </span>
          </template>
          <span>{{ item.RSRV_CNTNT }}</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <div
      class="pl-pager">
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
        @input="handlePage"
        :total-visible="10">
      </v-pagination>

      <!-- 더보기 다음 있을때만 노출 -->
      <span class="pl-pager-period">
        보기 {{ mixin_getPagePeriod(SCHEDULER_LIST, page) }} / {{ totalCount }}
        <!-- <compo-tooltip-btn
          TitleProp="다음 검색"
          ClassProp="pl-tooltip-btn is-line"
          IconProp="pl-icon20 arrow-next-paging"
          TooltipPositionProp="bottom"
          :DisabledProp = "nextDisabled"
          @btnClick="searchSchedulerListPaging('next')"
        ></compo-tooltip-btn> -->
      </span>
    </div>
  </div>
</template>

<script>
import CompoAsSchedulerAllApply from '@/components/csl/CompoAsSchedulerAllApply.vue';

export default {
  name: "CompoAsScheduler_GRID", //스케쥴러 정보
  components: {
    CompoAsSchedulerAllApply
  },
  props: {
    IsExpandSchListProp: {
      type: Boolean,
      default: false
    },
    IsHideSchInfoProp: {
      type: Boolean,
      default: false
    },
    IsPopupProp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 태그지정
      DropTags: false,
      addTagWrap: false,
      newTagTxt: '',
      editingIndex: null,
      tagPicker: null,
      dropChgClr: false,
      newTagClr: '#333',

      common_code: [],
      //태그 목록
      TAG_LIST: [],

      //태그 해제 아이템(TAG_CD : stc4)
      disableTag: {
        TAG_CD: 'stc4',
        TAG_NM: '태그해제'
      },

      //팀장(부팀장), 센터장 권한이 상담 모니터링 영역의 팀/상담사 선택 시 해당 상담사 정보보
      SCH_USER: {
        DEPT_ID : "", //선택된 부서
        USER_ID : "" //선택된 사용자 ID
      },

      //검색 조건
      searchCondition: {},

      SCHEDULER_LIST: [],
      //체크박스 선택된 아이템
      SELECTED_ITEMS: [],
      SEL_ROW: {},

      isLoading: false,

      totalCount: 0,
      page: 1,
      pageCount: 0,
      perPage: [15,20,30,50,100],
      // ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      ROW_PER_PAGE: 15, //페이징 없이 전체 화면 뿌릴때
      pagination: {
        page: 1,
        rowsPerPage: 500,
      },
      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼

      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '처리상태', value: 'FLW_PGRS_SS_NM', align: 'left', width: '6%', sortable: true },
        { text: '업체명', value: 'FRM_NM', width: '7%', sortable: true},
        { text: '시설구분', value: 'LCLS_NM', align: 'left', width: '5%', sortable: true },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: 'left', width: '5%', sortable: true },
        { text: '단지/동주소', value: 'MGOF_NM', align: 'left', width: '7%', sortable: true },
        { text: '동', value: 'BLDG_NO', align: 'left', width: '4%', sortable: true },
        { text: '호', value: 'HS_NO', align: 'left', width: '4%', sortable: true },
        { text: 'AS접수번호', value: 'V_FLW_ACP_SN', align: 'left', width: '120px', sortable: true },
        { text: '분배일자', value: 'ASSGN_YMD', align: 'left', width: '6%', sortable: true },
        { text: '방문예정일', value: 'VST_DT', align: 'center', width: '8%', sortable: true },
        { text: '통화예정일', value: 'RSRV_YMD', align: 'left', width: '6%', sortable: true },
        { text: '배분상담사', value: 'EMP_NM', align: 'left', width: '6%', sortable: true },
        { text: '업체', value: 'FRM_CNT', align: 'center', width: '3.5%', sortable: true },
        { text: '고객', value: 'CUST_CNT', align: 'center', width: '3.5%', sortable: true },
        { text: '관리소', value: 'MGOF_CNT', align: 'center', width: '3.5%', sortable: true },
        { text: '최종접촉일', value: 'REG_DT', align: 'left', width: '6%', sortable: true },
        { text: '완료', value: 'SCH_STAT_NM', align: 'left', width: '6%', sortable: true },
        { text: '메모', value: 'RSRV_CNTNT', align: 'left', width: '5%', sortable: true },
      ],
      items: [
        { chk: false, index: 4001, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '오산세교 3단지(A-3블록 죽미) ', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', },
        { chk: false, index: 4002, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '오산세교 3단지(A-3블록 죽미) ', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '일정비협조', type018: '방문예정일 확인 예정', cellBg: '#FFFFCC' },
        { chk: false, index: 4003, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '오산세교 3단지(A-3블록 죽미) ', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '#FFE7FF' },
        { chk: false, index: 4004, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '오산세교 3단지(A-3블록 죽미) ', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', },
        { chk: false, index: 4005, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '오산세교 3단지(A-3블록 죽미) ', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4006, type01: '보수처리중', type02: '하나정보통신 주식회사', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '//', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '0', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4007, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1901', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4008, type01: '보수처리중', type02: '하나정보통신 주식회사', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '202', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4009, type01: '보수처리중', type02: '하나정보통신 주식회사', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '202', type07: '1707', type08: '240606-41-00002', type09: '2024-06-20', type010: '//', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4010, type01: '보수처리중', type02: '하나정보통신 주식회사', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '202', type07: '703', type08: '240606-41-00002', type09: '2024-06-20', type010: '//', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '#AFD7FF' },
        { chk: false, index: 4011, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '703', type08: '240606-41-00002', type09: '2024-06-20', type010: '//', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4012, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '703', type08: '240606-41-00002', type09: '2024-06-20', type010: '//', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4013, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '703', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4014, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4015, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4016, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4017, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4018, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4019, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4020, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4021, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '#AFD7FF' },
        { chk: false, index: 4022, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4023, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4024, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4025, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
        { chk: false, index: 4026, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '#FFFFCC' },
        { chk: false, index: 4027, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '일정비협조', type018: '방문예정일 확인 예정',},
        { chk: false, index: 4028, type01: '보수처리중', type02: '주식회사 한별', type03: '세대별', type04: '일상보수', type05: '청주율량2', type06: '206', type07: '1801', type08: '240606-41-00002', type09: '2024-06-20', type010: '2024-06-21 / 2024-06-22 / 2024-06-24 ', type011: '2024-06-22', type012: '우성아', type013: '0', type014: '2', type015: '0', type016: '2024-06-21', type017: '', type018: '방문예정일 확인 예정', cellBg: '' },
      ],

      // //TAGS
      // CIRCLE_TAG: [
      //   { color: '#FFE7FF', cnt: 0,  name: '팀장 협업요청', disabled: true , draggable: false, edit: false},
      //   { color: '#AFD7FF', cnt: 0,  name: '팀장 협업완료' ,disabled: true, draggable: false, edit: false},
      //   { color: '#FFFFCC', cnt: 0,  name: '사용자 지정1' ,disabled: false, draggable: false, edit: false},
      //   { color: '#cef6f3', cnt: 0,  name: '사용자 지정2' ,disabled: false, draggable: false, edit: false},
      //   { color: '#dbfedb', cnt: 0,  name: '사용자 지정3' ,disabled: false, draggable: false, edit: false},
      //   { color: '#d6efff', cnt: 0,  name: '사용자 지정4' ,disabled: false, draggable: false, edit: false},
      //   { color: '#d3e6ff', cnt: 0,  name: '사용자 지정5' ,disabled: false, draggable: false, edit: false},
      //   { color: '#ece1ff', cnt: 0,  name: '사용자 지정6' ,disabled: false, draggable: false, edit: false},
      //   { color: '#ffeeee', cnt: 0,  name: '사용자 지정7' ,disabled: false, draggable: false, edit: false},
      //   { color: '#fff4eb', cnt: 0,  name: '사용자 지정8' ,disabled: false, draggable: false, edit: false},
      // ],
      resizeClass: false,


      //엑셀 다운로드 관련
      table_head: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50', sortable: false },
        { text: '처리상태', value: 'FLW_PGRS_SS_NM', align: 'left', width: '150', sortable: true },
        { text: '업체명', value: 'FRM_NM', align: 'left', width: '200', sortable: true},
        { text: '시설구분', value: 'LCLS_NM', align: 'left', width: '90', sortable: true },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: 'left', width: '100', sortable: true },
        { text: '단지/동주소', value: 'MGOF_NM', align: 'left', width: '240', sortable: true },
        { text: '동', value: 'BLDG_NO', align: 'left', width: '75', sortable: true },
        { text: '호', value: 'HS_NO', align: 'left', width: '75', sortable: true },
        { text: 'AS접수번호', value: 'V_FLW_ACP_SN', align: 'left', width: '160', sortable: true },
        { text: '분배일자', value: 'ASSGN_YMD', align: 'left', width: '120', sortable: true },
        { text: '방문예정일', value: 'VST_DT', align: 'center', width: '240', sortable: true },
        { text: '통화예정일', value: 'RSRV_YMD', align: 'left', width: '120', sortable: true },
        { text: '배분상담사', value: 'EMP_NM', align: 'left', width: '110', sortable: true },
        { text: '업체', value: 'FRM_CNT', align: 'center', width: '60', sortable: true },
        { text: '고객', value: 'CUST_CNT', align: 'center', width: '60', sortable: true },
        { text: '관리소', value: 'MGOF_CNT', align: 'center', width: '60', sortable: true },
        { text: '최종접촉일', value: 'REG_DT', align: 'left', width: '120', sortable: true },
        { text: '완료', value: 'SCH_STAT_NM', align: 'left', width: '110', sortable: true },
        { text: '메모', value: 'RSRV_CNTNT', align: 'left', width: '300', sortable: true },
      ],
      table_body: [],
      file_name: '',
      sheet_name: "스케줄러 목록",
      header_color: "EFF5FC",


      //일괄적용.
      dropAllApply: false,
    }
  },

  
  created() {
    console.log("CompoAsScheduler_GRID created", this.IsPopupProp)

    
    if(!this.IsPopupProp) {
      // 스케줄러 목록 
      this.$eventBus.$on('searchSchedulerListPaging',(searchCondition = null)=> {
        console.log("searchCondition", searchCondition)
        if(searchCondition != null) {
          this.searchCondition = searchCondition;
        }
        this.searchSchedulerListPaging()
      });

      //기본 검색 조건 설정 - 팝업으로보기 시 필요.
      this.$eventBus.$on('setAsSchedulerSearchCondition',(searchCondition)=> {
        console.log("searchCondition", searchCondition)
        this.searchCondition = searchCondition;
      });

      //팝업으로보기에서 현재 검색 조건으로 검색을 하기 위해 호출함.
      this.$eventBus.$on('callAsSchedulerSearch',()=> {
        console.log("callAsSchedulerSearch", this.searchCondition)
        this.$eventBus.$emit("searchAsPopSchedulerList", this.searchCondition)
      });

      //캘린더보기에서 클릭 시 검색.
      this.$eventBus.$on('rowDblClickPop',(event)=> {
        console.log("rowDblClickPop", event)
        this.rowDblClickPop(event);
      });

      //팀장(부팀장), 센터장 권한이 상담 모니터링 영역의 팀/상담사 선택 시 해당 상담사 설정 및 태그 건수 조회
      this.$eventBus.$on('setAsSchedulerSchUserData',(schUserData)=> {
        this.SCH_USER = schUserData;
        this.getTagList();
      });

      this.getTagList();
    } else {
      //팝업으로보기에서 검색하기 위함.
      this.$eventBus.$on('searchAsPopSchedulerList',(searchCondition)=> {
        console.log("searchAsPopSchedulerList", searchCondition)
        this.searchCondition = searchCondition;
        this.searchSchedulerListPaging()
      });
    }
  },
  beforeDestroy() {
    if(!this.IsPopupProp) {
      // 스케줄러 목록 검색(페이징) - eventBus 중복방지를 위해 off
      this.$eventBus.$off("searchSchedulerListPaging");
      this.$eventBus.$off('setAsSchedulerSearchCondition');
      this.$eventBus.$off("callAsSchedulerSearch");
      this.$eventBus.$off('rowDblClickPop');
    } else {
      // 팝업으로보기 검색 - eventBus 중복방지를 위해 off
      this.$eventBus.$off("searchAsPopSchedulerList");
    }
  },
  mounted() {
    if(this.IsPopupProp) {
      if(window.opener) {
        this.ROW_PER_PAGE = 20
        this.searchCondition = JSON.parse(window.opener.localStorage.getItem('asSchedulerSearchCondition'));
        console.log("CompoAsScheduler_GRID mounted", this.searchCondition)
        this.searchSchedulerListPaging()
      }
      
    }
  },
  watch: {
  },
  computed: {
    computedResizeClass() {
      return this.resizeClass === true ? 'pl-icon20 arrow-prev-paging' : 'pl-icon20 arrow-next-paging'
    },
    computedResizeText() {
      return this.resizeClass === true ? '축소' : '전체 보기'
    },
    filteredCircleTag() {
      return this.resizeClass ? this.TAG_LIST : this.TAG_LIST.slice(0,3);
    },
  },
  methods: {
    getSearchCondition() {
      console.log("getSearchCondition", this.searchCondition)
      return this.searchCondition;
    },
    //태그 목록 및 건수 조회
    async getTagList() {
      const postParam = {
        SCH_USER_ID: this.SCH_USER.USER_ID
      };
      const headParam = {
          head: {
              ns: 'lhcs.phone.as.dao.PhoneAsSchedulerMapper'
          }
      };
      let response = await this.common_postCall("/api/biz/common/select/selectTagList", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        response.DATA.map(item => {
          if(item.TAG_CD == 'stc2' || item.TAG_CD == 'stc3') {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
          item.edit = false;
        })
        this.TAG_LIST = response.DATA
      }
    },

    // 태그 지정
    addTag(type){
      this[`${type}`] = true
      this.newTagTxt = ''
    },

    //사용자 태그 명 수정
    async updateUserTagName(item) {
      const postParam = {
        TAG_CD: item.TAG_CD,
        TAG_NM: item.TAG_NM
      };
      const headParam = {
          head: {
              ns: 'lhcs.phone.as.dao.PhoneAsSchedulerMapper'
          }
      };
      let response = await this.common_postCall("/api/biz/common/update/mergeUserTagName", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        item.edit = false
      }
    },

    editTag(index, type){
      this[`${type}`] = index
    },

    swatchStyle(color) {
      return {
        backgroundColor: color,
        cursor: 'pointer',
        height: '22px',
        width: '22px',
        border: '1px solid #dbdbdb',
        borderRadius: '50%',
        transition: 'border-radius 200ms ease-in-out'
      }
    },

    // 캘린더로 보기
    openPopCalender(){
      window.parentVueInstance = this;
      let width = 1260,
          height = 800,
          left = (screen.width - width) / 2,
          top = (screen.height - height) / 4;
          const url = '/CompoPopCalendar/'

          this.windowPopup = window.open(url, 'CompoPopCalendar', 'width='+width+',height='+height+',left='+left+',top='+top+',resizable=true,toolbar=no,menubar=no,status=no,location=no,directories=no');
          // 팝업이 로드되었을 때 sessionStorage에 토큰을 설정
          this.windowPopup.onload = () => {
            this.windowPopup.sessionStorage.setItem('token', sessionStorage.getItem('token'));

            // 부모 창에서 팝업 창으로 데이터 전송
            //windowPopup.postMessage({ item }, '*');
          };

          const interval = setInterval(() => {
            if (this.windowPopup.closed) {
              clearInterval(interval);
              this.windowPopup = null;
            }
          }, 1000);
    },

    //팝업으로 보기
    openPopScheduler() {
      if(this.SCHEDULER_LIST.length == 0) {
        this.showAlertInfo({msg:"스케줄러 목록 조회 후 이용해 주세요."})
        return
      }
      window.localStorage.setItem('asSchedulerSearchCondition', JSON.stringify(this.searchCondition));
      let width = 1600,
      height = 730,
      left = (screen.width - width) / 2,
      top = (screen.height - height) / 4;
      const url = '/CompoAsPopScheduler/'

      const popScheduler = window.open(url, 'CompoAsPopScheduler', 'width='+width+',height='+height+',left='+left+',top='+top+',resizable=true,toolbar=no,menubar=no,status=no,location=no,directories=no');
      window.removeEventListener('message', this.rowDblClickPop);
      window.addEventListener('message', this.rowDblClickPop);
    },

    //태그 검색.
    tagSearch(item) {
      this.searchCondition = {
        SRCH_FROM: "TAG",
        TGT_TAG_CD: item.TAG_CD,
        SCH_USER_ID: this.SCH_USER.USER_ID
      }
      this.$eventBus.$emit('setSchedulerSrchFrom', "TAG");
      this.searchSchedulerListPaging();
    },

    //기타 검색 - 팝업으로 보기, 캘린더로 보기 등.
    otherSearch(searchCondition) {
      this.searchCondition = searchCondition;
      this.$eventBus.$emit('setSchedulerSrchFrom', "OTHER");
      this.searchSchedulerListPaging();
    },
    
    //페이지 클릭
    handlePage( p ) {
      this.pagination.page = p;
      this.searchSchedulerListPaging("next");
    },

    // 스케줄러 목록 검색(페이징)
    async searchSchedulerListPaging(next = '') {
      let headParam = {head: {}};

      
      //다음버튼 클릭 유무
      if (next == 'next'){
        this.SCHEDULER_LIST = [];
        this.SELECTED_ITEMS = [];
      } else {
        this.page = 1;
        this.totalCount = 0;
        this.pageCount = 0;
        this.SCHEDULER_LIST = [];
        this.SELECTED_ITEMS = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화
        this.$eventBus.$emit('setSchedulerDetail', null);
      }

      headParam = {head: {
        "ROW_CNT" : this.ROW_PER_PAGE,
        "PAGES_CNT" : this.pagination.page,
        "PAGING" : "Y",
      }};
      

      //FLW_DTL_FULL_SN_LIST 가 0건이면 전체 검색을 하게 되므로 검색하지 않고 return
      if(this.searchCondition.SRCH_FROM == "OTHER" && this.searchCondition.FLW_DTL_FULL_SN_LIST.length == 0) {
        return
      }

      let postParam = this.searchCondition;
      
      this.isLoading = true;
      const response = await this.common_postCall("/phone-api/as/scheduler/selectSchedulerList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.SCHEDULER_LIST = [...this.SCHEDULER_LIST, ...response.DATA];
        if(this.searchCondition.SELECT_ROW_DBL_YN && this.searchCondition.SELECT_ROW_DBL_YN == "Y" && this.SCHEDULER_LIST.length > 0) {
          this.SEL_ROW = this.SCHEDULER_LIST[0];
          this.$eventBus.$emit('setSchedulerDetail', this.SEL_ROW);
        }
        this.totalCount = response.HEADER.TOT_COUNT;

        //다음
        //request에 보낸 head.PAGES_CNT와 head.ROW_CNT을 곱한값과 response.data.HEADER의 HEADER.TOT_COUNT와 비교하여 다음 조회건이 있는지 확인한다
        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }

        //총 페이지 수 = Math.ceil(전체 컨텐츠 개수 / 한 페이지에 보여주고자 하는 컨텐츠의 개수)
        this.pageCount = Math.ceil((this.totalCount + this.ROW_PER_PAGE) / this.ROW_PER_PAGE) - 1;

        //this.pagination.page += 1;
      }
      this.isLoading = false;

    },

    setItemStyle(item) {
      console.log("setItemStyle", item.EMP_NO , this.user_id, item.EMP_NO == this.user_id)
      //팀장협업요청(stc2), 팀장협업완료(stc3)를 제외한 태그는 상담사 본인만 tag_color 적용.
      if((item.TAG_COLOR_CD == 'stc2' || item.TAG_COLOR_CD == 'stc3') || item.EMP_NO == this.user_id || item.EMP_NO == this.SCH_USER.USER_ID) {
        return item.TAG_COLOR ? 'background-color: ' + item.TAG_COLOR : '';
      }
      return '';

    },

    //로우 클릭시 색상 변경
    isActiveRow(item){
      const activeClass = item === this.SEL_ROW ? "active" : "";
      return activeClass;
    },

    rowClick(item) {
      this.SEL_ROW = item;
    },

    //로우 더블클릭
    rowDblClick() {
      if(!this.IsPopupProp) {
        console.log("rowDblClick", this.SEL_ROW)
        this.$eventBus.$emit('setSchedulerDetail', this.SEL_ROW);
      } else {
        const searchCondition = {SRCH_FROM:"OTHER", SELECT_ROW_YN: 'N', SELECT_ROW_DBL_YN: 'Y', FLW_DTL_FULL_SN_LIST: [this.SEL_ROW.FLW_DTL_FULL_SN]};
        window.opener.postMessage({message: JSON.stringify(searchCondition)})
      }
    },

    //팝업에서 더블 클릭 시 이벤트.
    rowDblClickPop(event) {
      console.log('새 창에서 보낸 메시지:', event.data);
      if(event.data) {
        this.searchCondition = JSON.parse(event.data.message);
        this.searchSchedulerListPaging();
        this.$eventBus.$emit('setSchedulerSrchFrom', "OTHER");
      }
    },

    btnUpdateTag(item) {

      if(this.SELECTED_ITEMS.length == 0) {
        this.showAlertInfo({msg:"태그 지정할 항목을 선택해 주세요."})
        return
      }

      const confirmMsg = this.SELECTED_ITEMS.length + "개의 항목을 '" + item.TAG_NM + (item.TAG_CD == "stc4" ? " 하시겠습니까?" : "' (으)로 지정하시겠습니까?")
      this.showConfirmInfo({msg: confirmMsg
        , callYes : ()=>{  this.updateTag(item); }
        , callNo : this.closeAlert
      })

    },

    //태그 지정
    async updateTag(item) {
      let flwDtlFullSnList = '';
      this.SELECTED_ITEMS.map((item, index) => {
        if(index > 0) {
          flwDtlFullSnList += ','
        }
        flwDtlFullSnList += item.FLW_DTL_FULL_SN;
      })
      const postParam = {
        TAG_COLOR_CD: item.TAG_CD,
        FLW_DTL_FULL_SN_LIST: flwDtlFullSnList
      };
      const headParam = {head: {}};

      console.log("updateTag", flwDtlFullSnList, postParam)

      const response = await this.common_postCall("/phone-api/as/scheduler/updateTag", postParam, headParam);
      if (!response.HEADER.ERROR_FLAG) {
        this.showAlertInfo({msg: '정상 처리되었습니다.'})
        this.SELECTED_ITEMS.map(selectedItem => {
          selectedItem.TAG_COLOR_CD = item.TAG_CD;
          selectedItem.TAG_COLOR = item.TAG_COLOR;
        })
        this.getTagList();
        this.SELECTED_ITEMS = [];
        this.DropTags = false;
        this.closeAlert();
      }
    },

    // 엑셀형식으로 다운로드 한다 
    async excelDown() {   

      let headParam = {head: {}};

      //FLW_DTL_FULL_SN_LIST 가 0건이면 전체 검색을 하게 되므로 검색하지 않고 return
      if(this.searchCondition.SRCH_FROM == "OTHER" && this.searchCondition.FLW_DTL_FULL_SN_LIST.length == 0) {
        return
      }

      let postParam = this.searchCondition;
      
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      const response = await this.common_postCall("/phone-api/as/scheduler/selectSchedulerList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
        const table_b = response.DATA;
        const table_h = this.table_head;
        this.sheet_name = "스케줄러 목록";//mixin_common_exportExcel_all 에서 초기화 하여 다시 선언.
        this.file_name = this.sheet_name + "-" + this.$moment(new Date()).format('YYYYMMDDHHmmss');
        const isMulti = false;


        // 헤더에 없는 body filter
        let tempBodyObj = [];
        tempBodyObj = table_b.map(row=>{
          let tempBodyJson = {};
          if(isMulti){
            let headerKey = table_h[table_h.length-1].map(el=> {return el.value});
            for(let i in headerKey){
              tempBodyJson[headerKey[i]] = this.mixin_nvl(row[headerKey[i]], "");
            }
          }else{
          let headerKey = table_h.map(el=> {return el.value});
            for(let i in headerKey){
              tempBodyJson[headerKey[i]] = this.mixin_nvl(row[headerKey[i]], "");
            }
          }
          return tempBodyJson
        });

        this.table_body = tempBodyObj;

        this.mixin_common_exportExcel_all(this.table_head, this.table_body, this.file_name, this.sheet_name, this.header_color);
      }
    },

    
    //일괄적용 버튼
    btnAllApply() {
      var isValid = true; // 완료여부 체크
      
      // 체크된 체크박스 조회
      this.SELECTED_ITEMS.map(item => {
        // 완료 건이면 조회 중지
        if (item.SCH_STAT_CD != "") {
          isValid = false;
        }
      })

      if (!isValid) {
        this.showAlertInfo({msg: "완료건이 포함되어 있습니다."});
        return false;
      }
      if (this.SELECTED_ITEMS.length == 0) {
        this.showAlertInfo({msg: "선택된 건이 없습니다."});
        return false;
      }

      this.dropAllApply = true;
    },

    //일괄적용 후처리
    afterAllApply(RCV_SCHEDULER_STATUS, tmpSchStatNm) {
        //후처리 - 검색결과 ROW 정보를 수정
        const cloneRsrv = _.cloneDeep(RCV_SCHEDULER_STATUS)
        const schStatNm = _.cloneDeep(tmpSchStatNm);
        this.SELECTED_ITEMS.map(item => {
          item.RSRV_YMD =  cloneRsrv.RSRV_YMD
          item.VISIT_YMD = cloneRsrv.VISIT_YMD;
          item.VISIT_S_H = cloneRsrv.VISIT_S_H;
          item.VISIT_E_H = cloneRsrv.VISIT_E_H;
          if (cloneRsrv.RSRV_CNTNT_YN) {
            item.RSRV_CNTNT = cloneRsrv.RSRV_CNTNT;
          }
          item.SCH_STAT_CD = cloneRsrv.SCH_STAT_CD;
          item.SCH_STAT_NM =  schStatNm;
          item.SCH_STAT_TYPE = cloneRsrv.SCH_STAT_TYPE;
        })
        
        //체크박스 해제
        this.SELECTED_ITEMS = [];
        this.mixin_reloadCuttStat('CUTT_MONITOR_STAT'); //상담 모니터링 카운트 리로드
    },


    //완료해제 버튼
    btnUpdateUncomplete() {
      let flwDtlFullSnList = [];
      let isValid = true; // 완료 여부 체크

      console.log("btnUpdateUncomplete this.SELECTED_ITEMS", this.SELECTED_ITEMS)
      // 체크된 체크박스 조회
      this.SELECTED_ITEMS.map(item => {
        // 완료 건이 아니면 조회 중지
        if (item.SCH_STAT_CD == "") {
          isValid = false;
        }
        // 체크한 항목을 배열로 저장
        flwDtlFullSnList.push(item.FLW_DTL_FULL_SN);
      })

      if (!isValid) {
        this.showAlertInfo({msg: "완료 상태가 아닌 건이 포함되어 있습니다."});
        return false;
      }

      if (flwDtlFullSnList.length == 0) {
        this.showAlertInfo({msg: "선택된 건이 없습니다."});
        return false;
      }

      this.showConfirmInfo({
        msg: '선택된 건을 완료해제 하시겠습니까?'
        , callYes : ()=>{  this.updateUncomplete(flwDtlFullSnList); }
        , callNo : this.closeAlert
      })
    },
    //완료해제 처리.
    async updateUncomplete(flwDtlFullSnList) {
      let headParam = {head: {}};

      let postParam = {
        FLW_DTL_FULL_SN_LIST : flwDtlFullSnList.join(",")
      }

      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      const response = await this.common_postCall("/phone-api/as/scheduler/updateUncomplete", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG) {
        this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", false);
        // DataTables의 내부 ROW 정보를 수정
        this.SELECTED_ITEMS.map(item => {
          item.SCH_STAT_NM = "";
          item.RSRV_CNTNT = "완료 해제함";
          item.SCH_STAT_CD = "";
          item.SCH_STAT_TYPE = "";
          item.WORK_TYPE = "";
        })
        this.mixin_reloadCuttStat('CUTT_MONITOR_STAT'); //상담 모니터링 카운트 리로드
        //체크박스 해제
        this.SELECTED_ITEMS = [];
        this.showAlertInfo({msg: "정상 처리되었습니다."});
      }
    }
    
  },
};
</script>

<style lang="scss" scoped>

</style>