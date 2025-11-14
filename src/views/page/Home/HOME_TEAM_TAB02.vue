<template>
  <div :class="layoutSub ? '' : 'px-6'" :style="layoutSub ? 'margin-top: -14px': ''">
    <!-- search -->
    <div class="pl-search-form is-mt-m flex-column align-start " :style="layoutSub ? 'padding: 0 26px 14px': ''">
      <div class="pl-form-inline-wrap flex-wrap">
        <div class="pl-form-inline">
<!--          <div class="pl-desc">-->
<!--            <v-radio-group v-model="SCH_DATE_TYPE" class="ml-2" >-->
<!--              <v-radio label="접수기준" value="REG_DT" class="pl-radio" style="font-size:9px; margin-bottom:0px"></v-radio>-->
<!--              <v-radio label="처리기준" value="PRCS_DT" class="pl-radio" style="font-size:9px; margin-bottom:0px"></v-radio>-->
<!--            </v-radio-group>-->
            <span class="pl-label">
              조회기간
            </span>
            <compo-date-range-picker
                :StartDayProp.sync="SCH_CUTT_ST_DTS"
                :EndDayProp.sync="SCH_CUTT_END_DTS"
                :IsViewDropPickerProp="false"
                :selectTermProp2="true"
                @startDayChange="()=>{ }"
                @endDayChange="()=>{ }"
                ParentStyleProp="width: 370px"
            />
          </div>
        <div class="pl-form-inline">
          <template v-if="computedUserType === 'ETC_ADMIN'"><!--운영 관리자인 경우만 센터 선택 노출-->
            <span class="pl-label">
              센터
            </span>
            <div class="pl-desc">
              <v-select
                v-model="SCH_DEPT_ID1"
                return-object
                class="pl-form type-middle"
                :items="mixin_ognz_list_center(common_ognz_list, 'CUSL', '' )"
                placeholder="전체"
                @change="SCH_DEPT_ID2.DEPT_ID = ''"
              ></v-select>
            </div>
          </template>
          <span class="pl-label">
            소속/상담사
          </span>
          <div class="pl-desc">
            <v-select
              v-model="SCH_DEPT_ID2"
              class="pl-form type-middle"
              :items="mixin_ognz_list_detail(common_ognz_list, SCH_DEPT_ID1.DEPT_ID, '전체' ,'Y'/*콜센터여부,없으면전체*/)"
              return-object
              placeholder="전체"
              :disabled="computedUserDetailType === 'MANAGER'?true:false"
            ></v-select>
            <v-autocomplete
              v-model="SCH_CUSL_ID"
              :items="userList"
              item-text="USER_NM"
              item-value="USER_ID"
              class="pl-form type-middle"
              placeholder="전체"
              :disabled="computedUserDetailType === 'MANAGER'"
              auto-select-first
            ></v-autocomplete>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            상담채널
          </span>
          <div class="pl-desc">
            <v-select
              v-model="SCH_DRWI_TYPE_CD"
              :items="[{text:'전체', value : ''}, {text:'IN', value : 'IN'}, {text:'OB', value : 'OUT'}]"
              class="pl-form type-middle is-sm"
              placeholder="전체"
            ></v-select>
            <v-select
              v-model="SCH_RCPT_CHN_CD"
              :items="mixin_common_code_get_global(this.list_common_code, 'CVC', SCH_DEPT_ID1.CUSTCO_ID, '전체')"
              class="pl-form type-middle"
              placeholder="전체"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            처리방법
          </span>
          <div class="pl-desc">
            <v-select
              v-model="SCH_PRCS_CHN_CD"
              :items="mixin_common_code_get_global(this.list_common_code, 'PCMC', SCH_DEPT_ID1.CUSTCO_ID, '전체')"
              class="pl-form type-middle"
              placeholder="전체"
            ></v-select>
          </div>
        </div>
      </div>
      <div class="pl-form-inline-wrap flex-wrap is-mt-s" style="width: 100%">
        <div class="pl-form-inline">
          <span class="pl-label">
            상담유형
          </span>
          <compo-cutt-type-combo
              :FormSeProp="'SRCH'"
              :CustcoProp="SCH_DEPT_ID1.CUSTCO_ID"
              :DisabledProp="false"
              :DataProp="SCH_CUTT_TYPE"
              @EMIT_CUTT_TYPE="setCuttType"
          />
        </div>
        <div class="pl-form-inline flex-grow-1">
          <span class="pl-label">
            상담번호
          </span>
          <div class="pl-desc">
            <v-text-field
                style="width: 100px"
                v-model="SCH_PHN_CUTT_ID"
                class="pl-form type-middle"
                placeholder="상담번호 입력"
                @keydown.enter="getHistCutt()"
            />
          </div>
        </div>
        <div class="pl-form-inline flex-grow-1" v-if="SCH_DEPT_ID1.CUSTCO_ID !== '4'">
          <span class="pl-label">
            상담메모
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="SCH_CUTT_CN"
              class="pl-form type-middle flex-grow-1"
              placeholder="메모내용 입력"
              @keydown.enter="getHistCutt()"
              />
          </div>
        </div>
        <div class="pl-form-inline flex-grow-1" v-if="SCH_DEPT_ID1.CUSTCO_ID === '4'">
          <span class="pl-label">
            단지/동명
          </span>
          <div class="pl-desc">
            <v-text-field
              v-model="SCH_MGOF_NM"
              class="pl-form is-search type-middle"
              disabled
              @keydown.enter="getHistCutt()"
              >
              <template v-slot:append>
                <v-btn
                  @click="mixin_openSearchWindow( 'LayoutSearchPopup', '1140', '569', {compo_name : 'CompoFindAsBldgAdr', callback : 'setBldgAdr', title: '단지/동주소', popData: {}})"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 in-search"></span>
                </v-btn>
              </template>
            </v-text-field>
          </div>
        </div>
        <!-- 버튼 -->
        <div>
          <v-btn class="pl-btn is-icon" @click="getHistCutt()">
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
                          전화번호(인입)
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="SCH_CUST_PHN_NO"
                            class="pl-form type-middle"
                            placeholder="전화번호 입력"
                            maxlength="14"
                            hide-spin-buttons
                            type="text"
                            @keyup="setPhoneNo(CUST_PHN_NO)"
                            oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                          />
                        </div>
                      </div>
                      <div class="pl-form-inline">
                        <span class="pl-label">
                          고객 ID
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="SCH_CUST_IDNTF_NO"
                            class="pl-form type-middle"
                            placeholder="고객 ID 입력"
                          />
                        </div>
                      </div>
                      <!-- <div class="pl-form-inline">
                        <span class="pl-label">
                          상담번호
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="SCH_PHN_CUTT_ID"
                            class="pl-form type-middle"
                            placeholder="상담번호 입력"
                            oninput="javascript: this.value = this.value.replace(/[^0-9]/g, '' );"
                          />
                        </div>
                      </div> -->
                      <div class="pl-form-inline ">
                        <span class="pl-label">
                          티켓 ID
                        </span>
                        <div class="pl-desc">
                          <v-text-field
                            v-model="SCH_KAKAO_CHT_ID"
                            class="pl-form type-middle"
                            placeholder="티켓 ID 입력"
                          />
                        </div>
                      </div>

                      <div class="pl-form-inline is-border-sub-top pt-3 is-mt-s" v-if="SCH_DEPT_ID1.CUSTCO_ID !== '4'">
                        <span class="pl-label">
                          상담지역
                        </span>
                        <compo-cutt-zone-combo
                            :FormSeProp="'SRCH_V'"
                            :DataProp="SCH_CUTT_ZONE"
                            @EMIT_CUTT_ZONE="setCuttZone"
                        />
                      </div>
                      <div class="pl-form-inline is-border-sub-top pt-3 is-mt-s" v-if="SCH_DEPT_ID1.CUSTCO_ID !== '4'">
                        <span class="pl-label">
                          접속정보
                        </span>
                        <div class="pl-desc flex-column">
                          <v-text-field
                            v-model="SCH_ARS_INFO"
                            class="pl-form type-middle is-auto"
                            placeholder="선택"
                          />
                          <v-checkbox
                            v-model="SCH_TRANS_YN"
                            class="pl-check align-self-start"
                            label="담당자 이관 여부"
                          ></v-checkbox>
                        </div>
                      </div>

                    </div>
                  </div>
                  <!-- footer -->
                  <div class="is-border-top pl-btn-wrap pl-card ">
                    <v-btn class="pl-btn is-trans ml-auto" @click="dropDetail = false">닫기</v-btn>
                    <v-btn class="pl-btn" @click="getHistCutt()">검색</v-btn>
                  </div>

                </div>
              </v-menu>
            </template>
            <span>상세</span>
          </v-tooltip>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="clickClearBtn"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>

    <!-- grid top -->
    <div class="pl-grid-top is-border-top pt-2" :style="layoutSub ? 'padding: 0 26px': ''">
      <div class="pl-grid-top-left spacing-wrap sp-16">
        <span class="pl-bullet-txt is-green">상담 건수 (<strong class="ml-1 mr-1">{{ mixin_convertNumToComma(gridTotalCnt) }}</strong>)</span>
        <!-- <span class="pl-bullet-txt is-blue">총 통화 시간(<strong class="ml-1">566:01:41</strong>)</span> -->
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ mixin_convertNumToComma(gridTotalCnt) }})</em> 건</span>
        <compo-tooltip-btn
          TitleProp="엑셀 다운로드"
          ClassProp="pl-tooltip-btn "
          IconProp="pl-icon20 exceldown"
          TooltipPositionProp="bottom"
          @btnClick="downloadExcel"
        ></compo-tooltip-btn>
      </div>
    </div>

    <div :style="layoutSub ? 'padding: 0 26px': ''">
      <!-- grid -->
      <v-data-table
        class="pl-grid is-mt-s is-header-lg is-hover pl-form-inline-wrap"
        :headers="headers"
        :items="items"
        fixed-header
        item-key="index"
        width="calc(100vw - 355px)"
        :height="gridHeightProp"
        :items-per-page="ROW_PER_PAGE"
        hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
        :item-class="isActiveRow"
        @click:row="rowClick"
        @dblclick:row="showCuttDtl"
        :page.sync="page"
        :loading="loading"
        loading-text="조회중입니다."
        >
        <template v-slot:[`item.${header.value}`]="{ item }" v-for="header in headers">
          <template v-if="header.telYn">
            <template v-if="item[header.value]">{{ mixin_setPhoneNo(item[header.value].replace(/[^0-9]/g, "")) }}</template>
          </template>
          <template v-else>
            <template v-if="header.value === 'FULL_CUTT_TYPE_NM'">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" v-html="item[header.value]" />
                </template>
                <div v-html="item[header.value]"></div>
              </v-tooltip>
            </template>
            <template v-else-if="header.value === 'CUTT_CN'">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div
                    class="my-2"
                    style=" display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3;"
                    v-on="on"
                    v-bind="attrs"
                    v-html="item[header.value].split('\n').length > 2 ? item[header.value].split('\n')[0]+'<br>'+item[header.value].split('\n')[1] + '<br>' + item[header.value].split('\n')[2] : item[header.value]"></div>
                </template>
                <div v-html="item[header.value]" ></div>
              </v-tooltip>
            </template>
            <template v-else-if="header.value === 'CUSL_DEPT_NM'">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" v-html="item[header.value]" />
                </template>
                <div v-html="item[header.value]"></div>
              </v-tooltip>
            </template>
            <template v-else-if="header.value === 'MGOF_NM'">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" v-html="item[header.value]" />
                </template>
                <div v-html="item[header.value]"></div>
              </v-tooltip>
            </template>
            <template v-else-if="header.value === 'CUST_NM'">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" v-html="item[header.value]" />
                </template>
                <div v-html="item[header.value]"></div>
              </v-tooltip>
            </template>
            <template v-else-if="header.value === 'ARS_INFO'">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" v-html="item[header.value]" />
                </template>
                <div v-html="item[header.value]"></div>
              </v-tooltip>
            </template>
            <template v-else-if="header.value === 'CUTT_ZONE'">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" v-html="item[header.value]" />
                </template>
                <div v-html="item[header.value]"></div>
              </v-tooltip>
            </template>
            <template v-else-if="header.value === 'PRCS_CHN_NM'">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-on="on" v-bind="attrs" v-html="item[header.value]" />
                </template>
                <div v-html="item[header.value]"></div>
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
                  :DisabledProp="computedUserDetailType === 'MANAGER' ? (item['CUSL_ID'] === user_id ? false : true) : false"
                  @btnClick="mixin_showListenAudio(item)"
                ></compo-tooltip-btn>
                <compo-tooltip-btn
                  v-if="item['STT_YN'] === 'Y'"
                  TitleProp="대화록 보기"
                  ClassProp="pl-tooltip-btn ml-1"
                  IconProp="pl-icon20 sts"
                  TooltipPositionProp="bottom"
                  :MinWidthProp=20
                  :HeightProp=20
                  :DisabledProp="computedUserDetailType === 'MANAGER' ? (item['CUSL_ID'] === user_id ? false : true) : false"
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
                    :DisabledProp="computedUserDetailType === 'MANAGER' ? (item['CUSL_ID'] === user_id ? false : true) : false"
                    @btnClick="mixin_showListenAudio(item)"
                ></compo-tooltip-btn>
              </template>
            </template>
            <template v-else-if="header.value === 'COACHING'">
              <compo-tooltip-btn
                TitleProp="코칭"
                ClassProp="pl-tooltip-btn ml-1"
                :IconProp="`pl-icon20 ${ item['CUTT_COACHING_ID'] ? 'coaching-guide-fill' : 'coaching-guide'}`"
                TooltipPositionProp="bottom"
                :MinWidthProp=20
                :HeightProp=20
                @btnClick="mixin_showCoach(item.PHN_CUTT_ID, item.CUSTCO_ID)"
              ></compo-tooltip-btn>
            </template>
            <template v-else>{{ item[header.value] }}</template>
          </template>
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
            @change="ROW_PER_PAGE = parseInt($event, 10); getHistCutt();"
          ></v-select>
        </div>
        <v-pagination
          v-model="page"
          :length="pageCount"
          circle
          @input="handlePage"
          :total-visible="7">
        </v-pagination>

        <!-- 더보기 다음 있을때만 노출 -->
        <span class="pl-pager-period">
          보기 {{ mixin_getPagePeriod(items, page) }} / {{ mixin_convertNumToComma(gridTotalCnt) }}
<!--          <compo-tooltip-btn-->
<!--            TitleProp="다음 검색"-->
<!--            ClassProp="pl-tooltip-btn is-line"-->
<!--            IconProp="pl-icon20 arrow-next-paging"-->
<!--            TooltipPositionProp="bottom"-->
<!--            :DisabledProp = "nextDisabled"-->
<!--            @btnClick="getHistCutt('next')"-->
<!--          ></compo-tooltip-btn>-->
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import CompoInfoAsFlwAcp from '@/components/csl/CompoInfoAsFlwAcp.vue'
import CompoCuttTypeCombo from "@/components/CompoCuttTypeCombo.vue";
import CompoCuttZoneCombo from "@/components/CompoCuttZoneCombo.vue";

export default {
  name: "HOME_TEAM_TAB02", //name은 'MENU_' + 파일명 조합
  components: {
    CompoCuttZoneCombo,
    CompoCuttTypeCombo,
    CompoInfoAsFlwAcp,
  },
  props: {
    gridHeightProp:{
      type: String,
      default: 'calc(100vh - 368px)'
    },
    layoutSub: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      SCH_DATE_TYPE : "REG_DT", /*접수기준*/
      common_ognz_list:[], //조직정보
      list_common_code : [],

      // search
      dropDetail: false,
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      // grid
      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '접수일시', value: 'REG_DT', align: 'left', width: '8%', sortable: false },
        { text: '처리일시', value: 'PRCS_DT', align: 'left', width: '8%', sortable: false },
        { text: '상담시간', value: 'CALL_TIME', align: 'left', width: '5%', sortable: false },
        { text: '상담채널', value: 'RE_RCPT_CHN_NM', align: 'left', width: '6%', sortable: false },
        { text: '접수자', value: 'CUSL_NM', align: 'left', width: '5%', sortable: false },
        { text: '소속', value: 'CUSL_DEPT_NM', align: 'left', width: '10%', sortable: false },
        { text: '인입번호', value: 'LAST_PHN_NO', align: 'left', width: '10%', sortable: false, telYn : true },
        { text: '접속정보', value: 'ARS_INFO', align: 'left', width: '9%', sortable: false },
        { text: '상담지역', value: 'CUTT_ZONE', align: 'left', width: '11%', sortable: false },
        { text: '상담유형', value: 'FULL_CUTT_TYPE_NM', align: 'left', width: '', sortable: false },
        { text: '상담메모', value: 'CUTT_CN', align: 'left', width: '10%', sortable: false },
        { text: '처리방법', value: 'PRCS_CHN_NM', align: 'left', width: '7%', sortable: false },
        { text: '녹취', value: 'REC_YN', align: 'center', width: '7%', sortable: false },
      ],
      items: [
      ],

      data: {
        PROFILE: {
          name: '김한나',
          img: require('@/assets/img/@manager_profile4.png'),
          part: '바로처리센터 - 마이홈1팀',
          rcv_date: '2024-06-20 09:30:25',
          exc_date: '2024-06-20 09:38:05',
          excuter: '김한나',
          status: '상담완료',
          statusColor: 'is-bg-green',
        },
        CUS_INFO: [
          { title:'인입번호', icon: 'cs-phone', val: '010-5303-4545' },
          { title:'휴대전화', val: '010-5303-4545' },
          { title:'전화번호1', val: '02-1234-8975' },
          { title:'전화번호2', val: '02-9876-2826' },
          { title:'전화번호3', val: '02-1234-8975' },
          { title:'이메일', val: 'Heons@hkcloud.co.kr' },
          { title:'고객 ID', icon: 'cs-black', val: 'CT169776487781660258' },
          { title:'고객명', val: '나고객' },
        ],
        CS_INFO: {
          audio: { audioSrc: require('@/assets/file_example_MP3_700KB.mp3'), } ,
        },
      },

      talk_data: [
        {
          img: require('@/assets/img/@leader_portrait.png'),
          name: '우성아',
          date: '2024-06-10 13:20:45',
          text: '안녕하십니까. 바로처리센터 우성아입니다. 무엇을 도와드릴까요?',
          type: 'manager'
        },
        {
          img: require('@/assets/img/@manager_profile_default.png'),
          name: '고객',
          date: '2024-06-10 13:20:58',
          text: '네 국민임대주택에 대해 문의 드립니다.',
          type: 'cs'
        },
        {
          img: require('@/assets/img/@leader_portrait.png'),
          name: '우성아',
          date: '2024-06-10 13:21:02',
          text: '네, 그러시군요. 그럼 어느 지역의 국민임대 주택을 안내해 드릴까요?',
          type: 'manager'
        },
        {
          img: require('@/assets/img/@manager_profile_default.png'),
          name: '고객',
          date: '2024-06-10 13:21:05',
          text: '음... 화성시 비봉이요.',
          type: 'cs'
        },
        {
          img: require('@/assets/img/@leader_portrait.png'),
          name: '우성아',
          date: '2024-06-10 13:21:09',
          text: '네에, 그러 시군요 잠시만 기다려 주시면 해당 지역 공고 확인 후 곧바로 안내해 드리겠습니다.',
          type: 'manager'
        },
        {
          img: require('@/assets/img/@leader_portrait.png'),
          name: '우성아',
          date: '2024-06-10 13:21:17',
          text: '기다려 주셔서 감사합니다. 조금전에 문의 주신 화성시 비봉 국민임대주택에 대해 안내 드리기에 앞서 죄송 하오나, 안내전에 몇가지 질문 후 도와드리도록 하겠습니다.',
          type: 'manager'
        },
      ],

      loading : false,
      gridTotalCnt : 0,
      page: 1,
      pageCount: 0,
      perPage: [20,30,50,100],
      ROW_PER_PAGE: 20,
      pagination: {
        page: 1,
        rowsPerPage: 20,
        sortBy: "",
        descending: ""
      },
      nextDisabled : false,

      //검색
      SCH_DEPT_ID1 : {}, //센터
      SCH_DEPT_ID2 : {}, //소속
      SCH_CUSL_ID : '', //상담사
      SCH_DRWI_TYPE_CD : '', //IN, OUT
      SCH_RCPT_CHN_CD : '', //상담채널
      SCH_PRCS_CHN_CD : '', //처리채널
      SCH_CUTT_ST_DTS : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), //통화 시작 일자
      SCH_CUTT_END_DTS : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10), //통화 시작 일자
      SCH_CUTT_TYPE : new Array(3), //상담유형
      SCH_ALL_CUTT_TYPE : '', //상담유형(검색)
      SCH_CUTT_ZONE : new Array(3), //상담지역
      SCH_ALL_CUTT_ZONE : '', //상담지역(검색)
      SCH_CUTT_CN : '', //상담 메모
      SCH_CUST_PHN_NO : '', //인입번호
      SCH_CUST_IDNTF_NO : '', //고객ID
      SCH_PHN_CUTT_ID : '', //상담 ID
      SCH_KAKAO_CHT_ID : '', //티켓 ID
      SCH_ARS_INFO : '', //접속정보
      SCH_TRANS_YN : false, //담당자 이관 여부
      SCH_MGOF_CD : '', //단지/동명 코드
      SCH_MGOF_NM : '', //단지/동명

      CUTT_ITEMS : [],
      CUTT_TYPE_ITEMS : [],

      CUTT_ORG_ITEMS : [],
      CUTT_ZONE_ITEMS : [],

      selectedRow: {},
      userList : [], //사용자 목록
      fileName: '상담 현황',
    }
  },
  computed: {

  },
  watch: {
    SCH_DEPT_ID1() {
      // if(this.SCH_DEPT_ID1.CUSTCO_ID) this.getCuttTypeList();//상담 유형

      this.items = [];
      this.gridTotalCnt = 0;
      this.userList = [];
      this.SCH_CUSL_ID = '';
      if(this.SCH_DEPT_ID1.CUSTCO_ID === '4'){
        this.SCH_CUTT_ZONE[0] = '';
        this.SCH_CUTT_ZONE[1] = '';
        this.SCH_CUTT_ZONE[2] = '';

        this.headers = [
          { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
          { text: '접수일시', value: 'REG_DT', align: 'center', width: '8%', sortable: false },
          { text: '처리일시', value: 'PRCS_DT', align: 'center', width: '8%', sortable: false },
          { text: '고객명', value: 'CUST_NM', align: 'center', width: '5%', sortable: false },
          { text: '지역본부', value: 'ARA_HDQ_NM', align: 'center', width: '10%', sortable: false },
          { text: '단지명', value: 'MGOF_NM', align: 'center text-left-important', width: '10%', sortable: false },
          { text: '상담사', value: 'CUSL_NM', align: 'center', width: '5%', sortable: false },
          { text: '경로', value: 'DRWI_TYPE_CD', align: 'center', width: '5%', sortable: false },
          { text: '채널', value: 'RCPT_CHN_NM', align: 'center', width: '5%', sortable: false },
          { text: '상담유형', value: 'FULL_CUTT_TYPE_NM', align: 'center text-left-important', width: '', sortable: false },
          { text: 'AS정보', value: 'FLAW_CNT', align: 'center', width: '5%', sortable: false },
          { text: '접촉횟수', value: 'CONTACT_CNT', align: 'center', width: '3%', sortable: false },
          { text: '녹취', value: 'REC_YN', align: 'center', width: '5%', sortable: false },
        ];
      }else{
        this.SCH_MGOF_CD = '';
        this.SCH_MGOF_NM = '';
        this.SCH_ARS_INFO = '';

        // this.getCuttZoneList();//상담 지역

        this.headers = [
          { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
          { text: '접수일시', value: 'REG_DT', align: 'center', width: '8%', sortable: false },
          { text: '처리일시', value: 'PRCS_DT', align: 'center', width: '8%', sortable: false },
          { text: '상담시간', value: 'CALL_TIME', align: 'left', width: '65px', sortable: false },
          { text: '상담채널', value: 'RE_RCPT_CHN_NM', align: 'left', width: '75px', sortable: false },
          { text: '접수자', value: 'CUSL_NM', align: 'left', width: '5%', sortable: false },
          { text: '소속', value: 'CUSL_DEPT_NM', align: 'left', width: '8%', sortable: false },
          { text: '인입번호', value: 'LAST_PHN_NO', align: 'left', width: '8%', sortable: false, telYn : true },
          { text: '접속정보', value: 'ARS_INFO', align: 'left', width: '6%', sortable: false },
          { text: '상담지역', value: 'CUTT_ZONE', align: 'left', width: '10%', sortable: false },
          { text: '상담유형', value: 'FULL_CUTT_TYPE_NM', align: 'left', width: '', sortable: false },
          { text: '상담메모', value: 'CUTT_CN', align: 'left', width: '10%', sortable: false },
          { text: '처리방법', value: 'PRCS_CHN_NM', align: 'left', width: '5%', sortable: false },
          { text: '녹취', value: 'REC_YN', align: 'center', width: '5%', sortable: false },
        ];
      }

      if(this.computedUserDetailType !== 'MANAGER'){
        this.headers.push({ text: '코칭', value: 'COACHING', align: 'center', width: '50px', sortable: false });
      }
    },
    SCH_DEPT_ID2() {
      this.SCH_CUSL_ID = '';
      if(this.SCH_DEPT_ID2.DEPT_ID) this.getUserList();
      else this.getUserList();
    }
  },
  mounted() {
    let _this = this;
    let tabs = this.$store.getters["commonStore/GE_COMMON_TAB"];
    if(tabs.length > 0){
      for(let tab of tabs){
        console.log('tab.AUTO_SRCH : ', tab.AUTO_SRCH);
        if(tab.id === 'CSL_M0501' && tab.AUTO_SRCH) {
          setTimeout(function (){_this.getHistCutt();}, 1000);
        }
      }
    }

    // var tables = document.querySelectorAll(".pl-grid.colResizing table");
    // for (var i = 0; i < tables.length; i++) {
    //   this.mixin_resizableGrid(tables[0]);
    // }

  },
  beforeDestroy(){
    this.$eventBus.$off("autoHistCuttSrch"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("refreshCoachingGridList"); //eventBus 중복방지를 위해 off
  },
  async created() {
    if(this.computedUserCenter === '4'){
      this.headers = [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '접수일시', value: 'REG_DT', align: 'center', width: '8%', sortable: false },
        { text: '처리일시', value: 'PRCS_DT', align: 'center', width: '8%', sortable: false  },
        { text: '고객명', value: 'CUST_NM', align: 'center', width: '5%', sortable: false },
        { text: '지역본부', value: 'ARA_HDQ_NM', align: 'center', width: '10%', sortable: false },
        { text: '단지명', value: 'MGOF_NM', align: 'center text-left-important', width: '10%', sortable: false },
        { text: '상담사', value: 'CUSL_NM', align: 'center', width: '5%', sortable: false },
        { text: '경로', value: 'DRWI_TYPE_CD', align: 'center', width: '5%', sortable: false },
        { text: '채널', value: 'RCPT_CHN_NM', align: 'center', width: '5%', sortable: false },
        { text: '상담유형', value: 'FULL_CUTT_TYPE_NM', align: 'center text-left-important', width: '200px', sortable: false },
        { text: 'AS정보', value: 'FLAW_CNT', align: 'center', width: '5%', sortable: false },
        { text: '접촉횟수', value: 'CONTACT_CNT', align: 'center', width: '3%', sortable: false },
        { text: '녹취', value: 'REC_YN', align: 'center', width: '5%', sortable: false },
      ];
    }else{
      this.headers = [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false },
        { text: '접수일시', value: 'REG_DT', align: 'center', width: '8%', sortable: false },
        { text: '처리일시', value: 'PRCS_DT', align: 'center', width: '8%', sortable: false },
        { text: '상담시간', value: 'CALL_TIME', align: 'left', width: '65px', sortable: false },
        { text: '상담채널', value: 'RE_RCPT_CHN_NM', align: 'left', width: '75px', sortable: false },
        { text: '접수자', value: 'CUSL_NM', align: 'left', width: '5%', sortable: false },
        { text: '소속', value: 'CUSL_DEPT_NM', align: 'left', width: '8%', sortable: false },
        { text: '인입번호', value: 'LAST_PHN_NO', align: 'left', width: '8%', sortable: false, telYn : true },
        { text: '접속정보', value: 'ARS_INFO', align: 'left', width: '6%', sortable: false },
        { text: '상담지역', value: 'CUTT_ZONE', align: 'left', width: '10%', sortable: false },
        { text: '상담유형', value: 'FULL_CUTT_TYPE_NM', align: 'left', width: '', sortable: false },
        { text: '상담메모', value: 'CUTT_CN', align: 'left', width: '10%', sortable: false },
        { text: '처리방법', value: 'PRCS_CHN_NM', align: 'left', width: '5%', sortable: false },
        { text: '녹취', value: 'REC_YN', align: 'center', width: '5%', sortable: false },
      ];
    }

    //모니터링 상태 클릭 후 해당 페이지 이동 시 자동 검색 처리
    this.$eventBus.$on("autoHistCuttSrch", (e) => {
      this.getHistCutt();
    });

    //코칭슬라이드에서 등록되는경우
    this.$eventBus.$on("refreshCoachingGridList", (item) => {
      let obj = this.items.filter(row=>{return row.PHN_CUTT_ID === item.PHN_CUTT_ID});
      if( obj ) {
        obj[0]["CUTT_COACHING_ID"] = item.CUTT_COACHING_ID;
      }
    });

    //공통코드설정
    let codeName = ['CVC', 'PCMC']; //상담채널, 처리방법
    this.list_common_code = await this.mixin_common_code_get_all_global(codeName);

    this.common_ognz_list =  await this.mixin_ognz_list();

    // this.getCuttTypeList();//상담 유형
    // this.getCuttZoneList();//상담 지역

    if(this.computedUserType !== 'ETC_ADMIN'){ //운영관리자가 아닌 경우
      this.SCH_DEPT_ID1.DEPT_ID = this.computedUserCenterDeptId;
      this.SCH_DEPT_ID1.CUSTCO_ID = this.$store.getters['userStore/GE_USER_ROLE'].company.CD;

      if(this.computedUserDetailType === 'TEAM_LEADER' || this.computedUserDetailType === 'MANAGER'){ //팀장(부팀장), 상담사
        this.SCH_DEPT_ID2.DEPT_ID = this.computedUserDeptId;
        this.SCH_DEPT_ID2.value = this.computedUserDeptId;
        this.getUserList();
      }
    }else{
      this.SCH_DEPT_ID1.DEPT_ID = this.computedUserCenter === '-1' ? '1000' : this.computedUserDeptId;
      this.SCH_DEPT_ID1.CUSTCO_ID = this.computedUserCenter === '-1' ? '1' : this.computedUserCenter;
      this.SCH_DEPT_ID1.value= this.computedUserCenter === '-1' ? '1000' : this.computedUserDeptId;
    }

    console.log('this.SCH_DEPT_ID1 : ', this.SCH_DEPT_ID1);

    if(this.computedUserDetailType !== 'MANAGER'){
      this.headers.push({ text: '코칭', value: 'COACHING', align: 'center', width: '50px', sortable: false });
    }

    // this.getHistCutt(); //상담 이력
  },
  methods: {
    //전화번호 하이픈 추가
    setPhoneNo(val){
      let res = this.mixin_setPhoneNo(val.replace(/[^0-9]/g, ""));
      this.CUST_PHN_NO = res;
    },

    //사용자 목록 조회
    async getUserList() {
      this.userList = [];

      let postParam = {
        SRCH_TYPE : 'CUSL',
        SRCH_GROUP_ID : this.SCH_DEPT_ID1.DEPT_ID,
        SRCH_DEPT_ID : this.SCH_DEPT_ID2.DEPT_ID,
      };
      let headParam = {
        head: {
          ns: "lhcs.system.user.dao.UserMapper",
          sn: "selectUserList"
        }
      };

      const response = await this.common_postCall("/api/biz/common/select/selectUserList", postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        this.userList = response.DATA;
        if(this.computedUserDetailType === 'MANAGER'){ //상담사 경우
          this.SCH_CUSL_ID = this.$store.getters['userStore/GE_USER_ROLE'].userId;
        }
      }
    },

    handlePage( p ) {
      this.pagination.page = p;
      this.getHistCutt("next");

    },

    //상담 이력 조회
    async getHistCutt(next) {
      //마우스 광클릭 방지.
      if(this.loading) {
        return;
      }

      if(!this.SCH_DEPT_ID1.CUSTCO_ID){
        this.showAlert({alertDialogToggle: true, msg: '센터를 선택해 주세요.', iconClass: 'is-info', type: 'default'});
        return;
      }

      //다음버튼 클릭 유무
      if (next == 'next'){
        this.items = [];
      } else {
        this.items = [];
        this.pagination.page = 1; //페이징 처리 초기화
        this.nextDisabled = true;  //버튼 비활성화

        this.page = 1;
        this.pageCount = 0;
        this.gridTotalCnt = 0;
      }

      let postParam = {
          SCH_DATE_TYPE : this.SCH_DATE_TYPE
        , SCH_CUTT_ST_DTS : this.SCH_CUTT_ST_DTS.replace(/[^0-9]/g, '') //접수 시작 일자
        , SCH_CUTT_END_DTS : this.SCH_CUTT_END_DTS.replace(/[^0-9]/g, '') //접수 종료 일자
        , SCH_CUSTCO_ID : this.SCH_DEPT_ID1.CUSTCO_ID //센터 ID
        , RCPT_DEPT_ID : this.SCH_DEPT_ID2.DEPT_ID //부서 ID
        , CUSL_ID : this.SCH_CUSL_ID //상담사 ID
        , DRWI_TYPE_CD : this.SCH_DRWI_TYPE_CD //인입 유형 코드
        , RCPT_CHN_CD : this.SCH_RCPT_CHN_CD //접수 채널 코드
        , PRCS_CHN_CD : this.SCH_PRCS_CHN_CD //처리 채널 코드
        , CNSLT_DIV_CD_1 : this.SCH_CUTT_TYPE[0] //상담 유형(대)
        , CNSLT_DIV_CD_2 : this.SCH_CUTT_TYPE[1] //상담 유형(중)
        , CNSLT_DIV_CD_3 : this.SCH_CUTT_TYPE[2] //상담 유형(소)
        , CUTT_CN : this.SCH_CUTT_CN //상담 메모
        , CUST_PHN_NO : this.SCH_CUST_PHN_NO.replace(/[^0-9]/g, '') //인입번호(전화번호)
        , CUST_IDNTF_NO : this.SCH_CUST_IDNTF_NO //고객 ID
        , PHN_CUTT_ID : this.SCH_PHN_CUTT_ID //상담 ID
        , KAKAO_CHT_ID : this.SCH_KAKAO_CHT_ID //티켓 ID
        , CTPV_CD : this.SCH_CUTT_ZONE[0] //상담지역(시도)
        , SGG_CD : this.SCH_CUTT_ZONE[1] //상담지역(시군구)
        , DSTRCT_CD : this.SCH_CUTT_ZONE[2] //상담지역(지구)
        , ARS_INFO : this.SCH_ARS_INFO //접속정보
        , TRANS_YN : (this.SCH_TRANS_YN?'Y':'N') //담당자 이관 여부
        , MGOF_CD : this.SCH_MGOF_CD //단지/동명 코드
      };

      let headParam = {
        head: {
          ROW_CNT : this.ROW_PER_PAGE
          , PAGES_CNT : this.pagination.page
          , PAGING : 'Y'
        }
      };

      this.loading = true;
      const response = await this.common_postCall("/phone-api/cutt/selectCuttHist", postParam, headParam);

      if(response && !response.HEADER.ERROR_FLAG) {
        let tempDataText = response.DATA;
        tempDataText.map(item => {
          item.FULL_CUTT_TYPE_NM = item.FULL_CUTT_TYPE_NM.replaceAll("&gt;","");
          // item.REG_DT = this.mixin_convertDate(item.REG_DT, 'yyyy.MM.dd HH:mm');
          // item.PRCS_DT = this.mixin_convertDate(item.PRCS_DT, 'yyyy.MM.dd HH:mm');
          // item.CALL_TIME = !this.mixin_isEmpty(item.CALL_TIME)?this.mixin_seconds_toHHMMSS(item.CALL_TIME): '';
          // item.DRWI_TYPE_CD = item.DRWI_TYPE_CD === 'OUT'?'OB': item.DRWI_TYPE_CD;
          // item.RE_RCPT_CHN_NM = (item.DRWI_TYPE_CD ==='OUT'?'OB':item.DRWI_TYPE_CD) + ' > ' + item.RCPT_CHN_NM;
          // item.CUTT_ZONE = item.CTPV_NM?item.CTPV_NM + '>' + item.SGG_NM + '>' + item.DSTRCT_NM:'-'
          return item;
        });

        this.items = [...this.items, ...tempDataText];

        if(response.HEADER.next !== null && response.HEADER.next !== undefined){
          if(response.HEADER.next === true){
            this.nextDisabled = false //버튼 활성화
          }else{
            this.nextDisabled = true  //버튼 비활성화
          }
        }
        if(this.items.length > 0) this.gridTotalCnt = response.HEADER.TOT_COUNT;

        //총 페이지 수 = Math.ceil(전체 컨텐츠 개수 / 한 페이지에 보여주고자 하는 컨텐츠의 개수)
        this.pageCount = Math.ceil((this.gridTotalCnt + this.ROW_PER_PAGE) / this.ROW_PER_PAGE) - 1;

        this.pagination.page += 1;
      }

      this.loading = false;
    },

    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },

    rowClick(item) {
      this.selectedRow = item;
    },

    //동주소 검색 다이얼로그 - 단지/동주소 선택 시,
    setBldgAdr(item) {
      this.SCH_MGOF_CD = item.MGOF_CD;
      this.SCH_MGOF_NM = item.MGOF_NM;
    },
    setCuttType(data){
      this.SCH_CUTT_TYPE = data;
    },
    setCuttZone(data){
      this.SCH_CUTT_ZONE = data;
    },

    showCuttDtl(){
      this.mixin_openWindow( 'LayoutPopup', '1600', '850', {compo_name : 'CSL_M0100_DETAIL', callback : 'getPopData', title: '상담이력 상세보기', popData: this.selectedRow, CUSTCO_ID: this.selectedRow.CUSTCO_ID});
    },

    async downloadExcel(){
      if(Number(this.gridTotalCnt) <= 0) return;

      let sHeaderData = '';
      let makeHeader = []

      this.headers.map((item)=>{
        let str = `${item.value}^${item.text}`
        makeHeader.push(str)
      })
      sHeaderData = makeHeader.join(',');

      let sURL = '/api/biz/common/cmmExcelDwnld';
      let postParams = {
        SCH_DATE_TYPE : this.SCH_DATE_TYPE
        , SCH_CUTT_ST_DTS : this.SCH_CUTT_ST_DTS.replace(/[^0-9]/g, '') //접수 시작 일자
        , SCH_CUTT_END_DTS : this.SCH_CUTT_END_DTS.replace(/[^0-9]/g, '') //접수 종료 일자
        , SCH_CUSTCO_ID : this.SCH_DEPT_ID1.CUSTCO_ID //센터 ID
        , RCPT_DEPT_ID : this.mixin_nvl(this.SCH_DEPT_ID2.DEPT_ID, "") //부서 ID
        , CUSL_ID : this.SCH_CUSL_ID //상담사 ID
        , DRWI_TYPE_CD : this.SCH_DRWI_TYPE_CD //인입 유형 코드
        , RCPT_CHN_CD : this.SCH_RCPT_CHN_CD //접수 채널 코드
        , PRCS_CHN_CD : this.SCH_PRCS_CHN_CD //처리 채널 코드
        , CNSLT_DIV_CD_1 : this.mixin_nvl(this.SCH_CUTT_TYPE[0], "") //상담 유형(대)
        , CNSLT_DIV_CD_2 : this.mixin_nvl(this.SCH_CUTT_TYPE[1], "") //상담 유형(중)
        , CNSLT_DIV_CD_3 : this.mixin_nvl(this.SCH_CUTT_TYPE[2], "") //상담 유형(소)
        , CUTT_CN : this.SCH_CUTT_CN //상담 메모
        , CUST_PHN_NO : this.SCH_CUST_PHN_NO.replace(/[^0-9]/g, '') //인입번호(전화번호)
        , CUST_IDNTF_NO : this.SCH_CUST_IDNTF_NO //고객 ID
        , PHN_CUTT_ID : this.SCH_PHN_CUTT_ID //상담 ID
        , KAKAO_CHT_ID : this.SCH_KAKAO_CHT_ID //티켓 ID
        , CTPV_CD : this.mixin_nvl(this.SCH_CUTT_ZONE[0], "") //상담지역(시도)
        , SGG_CD : this.mixin_nvl(this.SCH_CUTT_ZONE[1], "") //상담지역(시군구)
        , DSTRCT_CD : this.mixin_nvl(this.SCH_CUTT_ZONE[2], "") //상담지역(지구)
        , ARS_INFO : this.SCH_ARS_INFO //접속정보
        , TRANS_YN : (this.SCH_TRANS_YN?'Y':'N') //담당자 이관 여부
        , MGOF_CD : this.SCH_MGOF_CD //단지/동명 코드
        , sFileName: this.fileName
        , sTitleName: '상담현황'
        , iExcelLimitRowCnt: 100000
        , serviceNm: 'kr.co.hkcloud.lhcs.phone.cutt.dao.PhoneCuttMapper'
        , sqlId: 'selectCuttHist'
        , sHeaderData: sHeaderData
      };

      let headParams = {
        head: '',
      }
      this.$store.dispatch("commonStore/AC_COMMON_PROGRESS_BAR", true);
      this.requestServerExcelDownloadApi({
        url: sURL, // required
        headers: {
          // required
          Authorization: "",
        },
        callback: (data) => {
          this.$store.commit("alertStore/hideAlert");
        },
        data: postParams,
      }, '상담현황_'+this.$moment(new Date()).format('YYYYMMDDHHmmss'));
    },

    // 초기화 버튼 클릭 이벤트
    clickClearBtn(){
      //검색
      this.SCH_DEPT_ID1 = {};
      this.SCH_DEPT_ID2 = {};
      this.SCH_CUSL_ID = '';
      this.SCH_DRWI_TYPE_CD = '';
      this.SCH_RCPT_CHN_CD = '';
      this.SCH_PRCS_CHN_CD = '';
      this.SCH_CUTT_ST_DTS = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      this.SCH_CUTT_END_DTS = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
      this.SCH_CUTT_TYPE = new Array(3);
      this.SCH_ALL_CUTT_TYPE = '';
      this.SCH_CUTT_ZONE = new Array(3);
      this.SCH_ALL_CUTT_ZONE = '';
      this.SCH_CUTT_CN = '';
      this.SCH_CUST_PHN_NO = '';
      this.SCH_CUST_IDNTF_NO = '';
      this.SCH_PHN_CUTT_ID = '';
      this.SCH_KAKAO_CHT_ID = '';
      this.SCH_ARS_INFO = '';
      this.SCH_TRANS_YN = false;
      this.SCH_MGOF_CD = '';
      this.SCH_MGOF_NM = '';

      if(this.computedUserType !== 'ETC_ADMIN'){ //운영관리자가 아닌 경우
        this.SCH_DEPT_ID1.DEPT_ID = this.computedUserCenterDeptId;
        this.SCH_DEPT_ID1.CUSTCO_ID = this.$store.getters['userStore/GE_USER_ROLE'].company.CD;

        if(this.computedUserDetailType === 'TEAM_LEADER' || this.computedUserDetailType === 'MANAGER'){ //팀장(부팀장), 상담사
          this.SCH_DEPT_ID2.DEPT_ID = this.computedUserDeptId;
          this.SCH_DEPT_ID2.value = this.computedUserDeptId;
          this.getUserList();
        }
      }else{
        this.SCH_DEPT_ID1.DEPT_ID = this.computedUserCenter === '-1' ? '1000' : this.computedUserDeptId;
        this.SCH_DEPT_ID1.CUSTCO_ID = this.computedUserCenter === '-1' ? '1' : this.computedUserCenter;
        this.SCH_DEPT_ID1.value= this.computedUserCenter === '-1' ? '1000' : this.computedUserDeptId;
      }
    },
  },


};
</script>

<style lang="scss" scoped>

</style>