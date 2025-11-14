<template>
  <div
    class="pl-quick-layer"
    style="position: fixed; z-index: 2; top: 105px; right: 730px; bottom: 30px; width: 1100px; box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);">
    <div class="d-flex align-center px-5 pt-2">
      <v-tabs class="pl-tabs flex-grow-1" v-model="tab">
        <template v-for="item in tabsTitle" >
          <v-tab :key="item.id">{{ item.title }}
            <v-badge
            v-show="item.badge"
            right
            color="red"
            dot
            class="ml-1"></v-badge></v-tab>
        </template>
      </v-tabs>
      <compo-tooltip-btn
        style="position: absolute; right: 20px; z-index: 1;"
        TitleProp="닫기"
        ClassProp="pl-tooltip-btn"
        IconProp="pl-icon20 dialog-close"
        TooltipPositionProp="bottom"
        @btnClick="$emit('close')"
      ></compo-tooltip-btn>
    </div>
    <div class="pl-quick-layer-body pl-scroll-body">
      <v-tabs-items v-model="tab">
        <v-tab-item >
          <!-- //mark: 고객정보 -->
          <div>
            <!-- 기본정보 -->
            <h2 class="pl-subtit">기본정보</h2>
            <v-divider class="my-2"></v-divider>
            <div class="pl-form-inline-wrap d-grid" style="display: grid; gap: 8px 28px; grid-template-columns: repeat(3, 1fr);">
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 120px">
                  고객 이름
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="BookingDtlProps.CUST_NM"
                    class="pl-form"
                    value="pl-form"
                    disabled
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 120px">
                  연락처
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="BookingDtlProps.CUST_TEL_NO"
                    class="pl-form"
                    value="pl-form"
                    disabled
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 120px">
                  이메일
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="BookingDtlProps.CUST_EAMIL"
                    class="pl-form"
                    value="pl-form"
                    disabled
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 120px">
                  지점
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="BookingDtlProps.BRANCH_NM"
                    class="pl-form"
                    value="pl-form"
                    disabled
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 120px">
                  분석 형태
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="BookingDtlProps.ANALYSIS_TY"
                    class="pl-form"
                    value="pl-form"
                    disabled
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 120px">
                  분석일시
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    :value="BookingDtlProps.DATE + ' ' + BookingDtlProps.TIME"
                    disabled
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 120px">
                  상담 상태
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="BookingDtlProps.CUTT_STAT"
                    class="pl-form"
                    value="pl-form"
                    disabled
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 120px">
                  상담 상태일
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="BookingDtlProps.CUTT_STAT_DT"
                    class="pl-form"
                    value="pl-form"
                    disabled
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 120px">
                  테스트 여부
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    :value="BookingDtlProps.IS_TEST == 'Y' ? '테스트' : '실데이터'"
                    disabled
                  />
                </div>
              </div>

            </div>
            <div class="pl-form-inline-wrap vertical type-2 ">
              <div class="pl-form-inline">
                <span class="pl-label">
                  소분시 특이사항
                </span>
                <div class="pl-desc">
                  <v-text-field
                    v-model="BookingDtlProps.PACK_CN"
                    class="pl-form"
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  상담 전 고객 요청 사항
                </span>
                <div class="pl-desc">
                  <v-textarea
                    v-model="BookingDtlProps.CUST_CN"
                    class="pl-form is-noresize"
                    :spellcheck="false"
                    disabled
                  />
                </div>
              </div>
            </div>
            <!-- 결제 및 배송지 정보 -->
            <h2 class="pl-subtit is-mt-l">결제 및 배송지 정보</h2>
            <v-divider class="my-2"></v-divider>
            <div class="pl-form-inline-wrap d-grid" style="display: grid; gap: 8px 28px; grid-template-columns: repeat(2, 1fr);">
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 120px">
                  결제 방법
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    :value="BookingDtlProps.PG+' ('+BookingDtlProps.PAYMENT_CARD_CUSTCO+'/'+BookingDtlProps.PAYMENT_CARD_NUMBER+')'"
                    disabled
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" style="flex: 0 0 120px">
                  배송지 주소
                </span>
                <div class="pl-desc">
                  <v-text-field
                    class="pl-form"
                    :value="'('+BookingDtlProps.ADDR_ZONE+') '+BookingDtlProps.ADDR_ROAD+' '+BookingDtlProps.ADDR_DETAIL"
                    disabled
                  />
                </div>
              </div>
            </div>
            <!-- 상담시간 변경 이력 -->
            <h2 class="pl-subtit is-mt-l">상담시간 변경 이력</h2>
            <v-data-table
              class="pl-grid is-mt-m"
              :headers="dataTab01.headers"
              :items="dataTab01.items"
              fixed-header
              item-key="index"
              hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
              >
            </v-data-table>
            <!-- 건강 고민 -->
            <div class="d-flex align-center is-mt-l">
              <h2 class="pl-subtit ">건강 고민</h2>
              <div class="pl-btn-wrap ml-auto">
                {{HealthWorryListProps.length > 0 ? (HealthWorryListProps[0].IS_SERIAL ? '간편인증' : '건강설문') : '직접입력'  }}
                <span class="pl-round-chip is-sm chat-stat-done">완료</span>
                <span class="pl-round-chip is-sm chat-stat-after">후처리</span>
                <span class="pl-round-chip is-sm chat-stat-cs">상담중</span>
                <span class="pl-round-chip is-sm chat-stat-wait">대기중</span>
              </div>
            </div>
            <v-data-table
              class="pl-grid is-mt-m"
              :headers="dataTab01.headers2"
              :items="HealthWorryListProps"
              fixed-header
              item-key="index"
              hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
              >
            </v-data-table>
          </div>
        </v-tab-item>
        <v-tab-item >
          <!-- //mark: 추천성분 및 분석결과 -->
          <div>
            <h2 class="pl-subtit">추천 성분</h2>
            <v-divider class="my-2"></v-divider>
            <div
              style="gap: 8px;"
              class="d-flex flex-wrap is-mt-m">
              <div
                class="pl-text-box is-bg-light"
                v-for="item in AnalysisListProps"
                :key="item.id">
                {{ item.NUTRIENT_NM }}({{ item.RECOMMEND_CN }})
                <span class="rounded-pill px-2 ml-1 is-bg-blue is-txt-white">
                  {{ item.NUTRIENT_CNT }} 알
                </span>
              </div>

            </div>
            <h2 class="pl-subtit is-mt-l">분석 결과</h2>
            <v-data-table
              class="pl-grid is-mt-m"
              :headers="dataTab02.headers"
              :items="AnalysisListProps"
              fixed-header
              item-key="index"
              hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
            >
              <template v-slot:item.PRODUCT_NM="{ item }">
                {{ item.PRODUCT_NM }}<br>
                <span 
                  v-for="product,i in item.PRODUCT_NUTRIENT.split('||')"
                >
                  <br>
                  {{ i+1 }}.{{ product }}
                </span>
              </template>
              <template v-slot:item.PRODUCT_WEIGHT="{ item }">
                {{ item.PRODUCT_WEIGHT }}{{ item.PRODUCT_UNIT }}
              </template>
              <template v-slot:item.PRICE="{ item }">
                20일
                <span class="is-txt-blue">({{ item.PRICE*20 }})</span><br>
                30일
                <span class="is-txt-blue">({{ item.PRICE*30 }})</span>
              </template>
              <template slot="footer">
                <div class="pl-grid-sum">
                  <table >
                    <colgroup>
                      <col v-for="(col, index) in dataTab02.headers" :key="index" :width=col.width />
                    </colgroup>
                    <tbody >
                      <tr >
                        <td class="pl-grid-sum-head text-center" colspan="5">합계</td>
                        <td class="text-left" >
                          {{ BookingDtlProps.DAYS }}일
                          <strong class="is-txt-red">({{ BookingDtlProps.PRICE }})</strong><br>
                          20일
                          <strong class="is-txt-blue">({{ mixin_sum_field(AnalysisListProps, "PRICE")*20 }})</strong><br>
                          30일
                          <strong class="is-txt-blue">({{ mixin_sum_field(AnalysisListProps, "PRICE")*30 }})</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </v-data-table>
            <div class="d-flex is-mt-m">
              <span class="ml-auto is-txt-white rounded-pill px-2 is-bg-darkgray">
                {{ 
                  parseInt(BookingDtlProps.PRICE) > 50000 ? '제품금액 5만원이상 배송비 무료 고객'
                  : (parseInt(AnalysisListProps[0]?.SUB_CNT) >= 5 ? '배송비 무료('+AnalysisListProps[0]?.SUB_CNT+'회차 이상)'
                  : (parseInt(AnalysisListProps[0]?.SUB_CNT) == 4 ? '다음 회차부터는 배송비 무료(현재 4회차)'
                  : '배송비 3,000원 지불 필요'))
                }}
              </span>
            </div>
            <h2 class="pl-subtit is-mt-l">영양제 상호작용</h2>
            <v-data-table
              class="pl-grid is-mt-m"
              :headers="dataTab02.headers2"
              :items="dataTab02.items2"
              fixed-header
              item-key="index"
              hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
              >
            </v-data-table>
            <h2 class="pl-subtit is-mt-l">분석 결과 변경 내역</h2>
            <v-data-table
              class="pl-grid is-mt-m"
              :headers="dataTab02.headers3"
              :items="dataTab02.items3"
              fixed-header
              item-key="index"
              hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
              >
            </v-data-table>

          </div>
        </v-tab-item>
        <v-tab-item >
          <!-- //mark: 상담내역 -->
          <div>
            <h2 class="pl-subtit">상담 내역 내용</h2>
            <v-data-table
              class="pl-grid is-mt-m"
              :headers="dataTab03.headers"
              :items="dataTab03.items"
              fixed-header
              item-key="index"
              hide-default-footer
	      no-data-text="등록된 데이터가 없습니다."
              >
            </v-data-table>
            <h2 class="pl-subtit is-mt-l">상담 이력</h2>
            <div class="is-mt-m d-flex flex-column" style="gap: 8px">
              <div
                class=" is-bg-light flex-column rounded-lg is-border-all px-3"
                v-for="item, index in CuttCnListProps"
                :key="index">
                <div
                  class="d-flex align-center justify-start pa-2 "
                  style="height: auto;">
                  <v-icon class="pl-icon20 main-talk mr-2"></v-icon>
                  {{ item.USER_NM }}
                  ({{ item.MDFCN_DT }})
                  <compo-tooltip-btn
                    TitleProp="상세 보기"
                    ClassProp="pl-tooltip-btn ml-auto"
                    :IconProp=toggeleExpandClass(index)
                    TooltipPositionProp="bottom"
                    @btnClick="toggeleExpand(index)"
                  ></compo-tooltip-btn>
                </div>
                <div
                  v-if="item.expand"
                  class="pa-2 is-border-top">
                  <v-textarea
                    v-model="CuttCnListProps[index].CN"
                    class="pl-form is-noresize"
                    value=""
                    :spellcheck="false"
                  />
                  <div class="pl-btn-wrap is-mt-m">
                    <v-btn 
                      class="pl-btn ml-auto"
                      @click="regRsvtCn(index)"
                      >
                      수정
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>

            <h2 class="pl-subtit is-mt-l">상담 이력 등록</h2>
            <div class="is-mt-m">
              <v-textarea
                v-model="dataTab03.log_textarea"
                class="pl-form "
                auto-grow
                :spellcheck="false"
              />
              <div class="pl-btn-wrap is-mt-m">
                <v-btn
                  @click="regRsvtCn()"
                  class="pl-btn ml-auto">등록</v-btn>
              </div>
            </div>


          </div>
        </v-tab-item>
        <v-tab-item >
          <!-- //mark: 문진 및 추천 로직 -->
          <div>
            <h2 class="pl-subtit">문진 & 추천 로직</h2>
            <div class="pl-cols">
              <div class="is-col-fix d-flex flex-column is-mt-m" style="width: 40%; gap: 8px">
                <div
                  class="rounded-lg is-border-all"
                  style="overflow: hidden"
                  v-for="item,i in InterviewListProps"
                  :key="i">
                  <div class="px-3 py-2 is-bg-light"> {{ item.QUESTION }}</div>
                  <div class="px-3 py-2 is-border-top" style="white-space: pre-wrap;"> 
                    {{ item.ANSWER.indexOf('||') == -1 ? item.ANSWER : answerArr(item.ANSWER, i) }}
                  </div>
                </div>
              </div>
              <div class="ml-5 is-mt-m">
                <v-data-table
                  class="pl-grid"
                  :headers="dataTab04.headers"
                  :items="RecommandListProps"
                  fixed-header
                  item-key="index"
                  hide-default-footer
		  no-data-text="등록된 데이터가 없습니다."
                  >
                  <template v-slot:item.RECOMMAND="{ item }">
                    {{ item.RECOMMAND == '1' ? '추천' : '' }}
                  </template>
                </v-data-table>
              </div>
            </div>
          </div>
        </v-tab-item>
        <v-tab-item >
          <!-- //mark: 검색 -->
          <div>
            <div class="pl-search-form">
              <div class="pl-form-inline-wrap">
                <div class="pl-form-inline">
                  <div class="pl-desc">
                    <v-select
                      v-model="SCH"
                      :items="dataTab05.dropItems"
                      class="pl-form is-lg"
                      placeholder=""
                    ></v-select>
                    <v-text-field
                      v-model="SCH_KEYWORD"
                      class="pl-form is-lg"
                      :placeholder="SCH == 'name' ? '제품이름' : '의약품코드' " />
                    <v-btn 
                      class="pl-btn is-icon"
                      @click="searchProduct()"
                      >
                      <span class="pl-icon20 search"></span>
                      조회
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
            <v-divider class="mb-2"></v-divider>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    props: {
      BookInfo:{
        type: Object,
      },
      BookingDtlProps:{
        type: Object,
      },
      AnalysisListProps:{
        type: Array,
      },
      InterviewListProps:{
        type: Array,
      },
      RecommandListProps:{
        type: Array,
      },
      HealthWorryListProps:{
        type: Array,
      },
      CuttCnListProps:{
        type: Array,
      },
    },
    data() {
      return{
        tab: null,
        tabsTitle: [
          { title: '고객정보', badge: false, },
          { title: '추천성분 및 분석결과', badge: true, },
          { title: '상담내역', badge: false, },
          { title: '문진 및 추천 로직', badge: false, },
          { title: '검색', badge: false, },
        ],
        date:'',
        // mark: data tab: 고객정보
        dataTab01: {
          // 상담시간 변경 이력
          headers: [
            { text: '변경 예약 일시', value: 'reserve_date', align: 'left', width: '150px', sortable: false, },
            { text: '변경자', value: 'moder', align: 'left', width: '150px',sortable: false, },
            { text: '변경 일시', value: 'change_date', sortable: false,},
          ],
          items: [
              {
                reserve_date: '2024-06-13 13:30',
                moder: '관리자',
                change_date: '2024-06-13 13:30',
              },
          ],
          // 건강 고민
          headers2: [
            { text: '구분', value: 'WORRY_QUESTION', align: 'left', width: '250px', sortable: false, },
            { text: '내용', value: 'WORRY_ANSWER', align: 'left', sortable: false, },
            { text: '날짜', value: 'WORRY_DT', width: '120px', sortable: false,},
          ],
          items2: [
              { type01: 'y-GTP(GGT) / 감마지티피', type02: '105', type03: '2024-06-13', },
              { type01: 'y-GTP(GGT) / 감마지티피', type02: '105', type03: '2024-06-13', },
              { type01: 'y-GTP(GGT) / 감마지티피', type02: '105', type03: '2024-06-13', },
              { type01: 'y-GTP(GGT) / 감마지티피', type02: '105', type03: '2024-06-13', },
              { type01: 'y-GTP(GGT) / 감마지티피', type02: '105', type03: '2024-06-13', },
              { type01: 'y-GTP(GGT) / 감마지티피', type02: '105', type03: '2024-06-13', },
              { type01: 'y-GTP(GGT) / 감마지티피', type02: '105', type03: '2024-06-13', },
              { type01: 'y-GTP(GGT) / 감마지티피', type02: '105', type03: '2024-06-13', },
          ],
        },
        // mark: data tab: 추천성분 및 분석결과
        dataTab02: {
          recommendData: [
            { name: '생균제제()', number: 1 },
            { name: '아연(면역력)', number: 1 },
            { name: '포스파티딜세린 (뇌 건강) ', number: 1 },
            { name: 'N-아세틸글루코사민 (관절/근육 건강)', number: 1 },
            { name: '생균제제()', number: 1 },
            { name: '포스파티딜세린 (뇌 건강) ', number: 1 },
            { name: 'N-아세틸글루코사민 (관절/근육 건강)', number: 1 },
            { name: '생균제제()', number: 1 },
          ],
          // 분석결과
          headers: [
            { text: '복용시기', value: 'TIME_CD_NM', align: 'left', width: '100px', sortable: false, },
            { text: '추천 성분', value: 'NUTRIENT_NM', align: 'left', width: '160px', sortable: false, },
            { text: '제품명', value: 'PRODUCT_NM', align: 'left', width: '200px', sortable: false, },
            { text: '중량', value: 'PRODUCT_WEIGHT', align: 'left', width: '120px', sortable: false, },
            { text: '수량', value: 'NUTRIENT_CNT', align: 'left', width: '100px', sortable: false, },
            { text: '금액', value: 'PRICE', align: 'left', width: '100px', sortable: false, },
          ],
          items: [
            {
              type01: '오전',
              type02: 'N-아세틸글루코사민',
              type03: '메디콕 100억프로바이오틱스',
              type04: '450mg',
              type05: 1,
              type06: '20일',
              type06_1: 200,
              type07: '30일',
              type07_1: 300,
            },
            { type01: '오전', type02: 'N-아세틸글루코사민', type03: '메디콕 100억프로바이오틱스', type04: '450mg', type05: 1, type06: '20일', type06_1: 200, type07: '30일', type07_1: 300, },
            { type01: '오전', type02: 'N-아세틸글루코사민', type03: '메디콕 100억프로바이오틱스', type04: '450mg', type05: 1, type06: '20일', type06_1: 200, type07: '30일', type07_1: 300, },
            { type01: '오전', type02: 'N-아세틸글루코사민', type03: '메디콕 100억프로바이오틱스', type04: '450mg', type05: 1, type06: '20일', type06_1: 200, type07: '30일', type07_1: 300, },
            { type01: '오전', type02: 'N-아세틸글루코사민', type03: '메디콕 100억프로바이오틱스', type04: '450mg', type05: 1, type06: '20일', type06_1: 200, type07: '30일', type07_1: 300, },
          ],
          // 영양제 상호작용
          headers2: [
            { text: '영양소', value: 'type01', align: 'left', width: '150px', sortable: false, },
            { text: '영양소', value: 'type02', align: 'left', width: '150px', sortable: false, },
            { text: '구분', value: 'type03', align: 'left', width: '150px', sortable: false, },
            { text: '내용', value: 'type04', align: 'left', width: '', sortable: false, },
          ],
          // 분석 결과 변경 내역
          headers3: [
            { text: '복용시기', value: 'type01', align: 'left', width: '120px', sortable: false, },
            { text: '추천 성분', value: 'type02', align: 'left', width: '160px', sortable: false, },
            { text: '제품명', value: 'type03', align: 'left', width: '', sortable: false, },
            { text: '수량', value: 'type04', align: 'left', width: '100px', sortable: false, },
            { text: '일수', value: 'type05', align: 'left', width: '100px', sortable: false, },
            { text: '사유', value: 'type06', align: 'left', width: '130px', sortable: false, },
            { text: '사유일자', value: 'type07', align: 'left', width: '120px', sortable: false, },
          ],
          items3: [
            {
              type01: '오전',
              type02: '밀크씨슬',
              type03: '메디콕 리버투씨슬&비',
              type04: 1,
              type05: '-',
              type06: '장바구니 제거',
              type07: '2024-06-07',
            },
            { type01: '오전', type02: '밀크씨슬', type03: '메디콕 리버투씨슬&비', type04: 1, type05: '-', type06: '장바구니 제거', type07: '2024-06-07', },
            { type01: '오전', type02: '밀크씨슬', type03: '메디콕 리버투씨슬&비', type04: 1, type05: '-', type06: '장바구니 제거', type07: '2024-06-07', },
            { type01: '오전', type02: '밀크씨슬', type03: '메디콕 리버투씨슬&비', type04: 1, type05: '-', type06: '장바구니 제거', type07: '2024-06-07', },
            { type01: '오전', type02: '밀크씨슬', type03: '메디콕 리버투씨슬&비', type04: 1, type05: '-', type06: '장바구니 제거', type07: '2024-06-07', },
            { type01: '오전', type02: '밀크씨슬', type03: '메디콕 리버투씨슬&비', type04: 1, type05: '-', type06: '장바구니 제거', type07: '2024-06-07', },
          ],

        },

        // mark: data tab: 상담내역
        dataTab03: {
          headers: [
            { text: '질문', value: 'type01', align: 'left', width: '50%', sortable: false, },
            { text: '답변', value: 'type02', align: 'left', width: '', sortable: false, },
          ],
          log_list: [
            {
              manager: '나상담',
              date: '2024-06-01 13:50',
              content: '세계를 향한 대화, 유니코드로 하십시오. 제10회 유니코드 국제 회의가 1997년 3월 10일부터 12일까지 독일의 마인즈에서 열립니다. 지금 등록하십시오. 이 회의에서는 업계 전반의 전문가들이 함께 모여 다음과 같은 분야를 다룹니다. - 인터넷과 유니코드, 국제화와 지역화, 운영 체제와 응용 프로그램에서 유니코드의 구현, 글꼴, 문자 배열, 다국어 컴퓨팅.',
              expand: false,
            },
            {
              manager: '나상담',
              date: '2024-06-01 15:50',
              content: '2',
              expand: false,
            },
          ],
          log_textarea: '',
        },

        // mark: data tab: 문진 및 추천 로직
        dataTab04: {
          QA_LIST: [
            {
              q: '마지막으로 이름을 알려주세요! 나만의 한 팩 영양제에 적어드려요.',
              a: '- 이수민 (ISQ0001)'
            },
            { q: '마지막으로 이름을 알려주세요! 나만의 한 팩 영양제에 적어드려요.', a: '- 이수민 (ISQ0001)' },
            { q: '마지막으로 이름을 알려주세요! 나만의 한 팩 영양제에 적어드려요.', a: '- 이수민 (ISQ0001)' },
            { q: '마지막으로 이름을 알려주세요! 나만의 한 팩 영양제에 적어드려요.', a: '- 이수민 (ISQ0001)' },
            { q: '마지막으로 이름을 알려주세요! 나만의 한 팩 영양제에 적어드려요.', a: '- 이수민 (ISQ0001)' },
            { q: '마지막으로 이름을 알려주세요! 나만의 한 팩 영양제에 적어드려요.', a: '- 이수민 (ISQ0001)' },
            { q: '마지막으로 이름을 알려주세요! 나만의 한 팩 영양제에 적어드려요.', a: '- 만성피로(1) (ISQ0161)\n - 두뇌건강(2) (ISQ0202)\n - 눈 건강(3) (ISQ0063)\n - 관절/근육 건강(4) (ISQ0314)\n - 면역력(5) (ISQ0053) ' },
            { q: '마지막으로 이름을 알려주세요! 나만의 한 팩 영양제에 적어드려요.', a: '- 만성피로(1) (ISQ0161)\n - 두뇌건강(2) (ISQ0202)\n - 눈 건강(3) (ISQ0063)\n - 관절/근육 건강(4) (ISQ0314)\n - 면역력(5) (ISQ0053) ' },
            { q: '마지막으로 이름을 알려주세요! 나만의 한 팩 영양제에 적어드려요.', a: '- 만성피로(1) (ISQ0161)\n - 두뇌건강(2) (ISQ0202)\n - 눈 건강(3) (ISQ0063)\n - 관절/근육 건강(4) (ISQ0314)\n - 면역력(5) (ISQ0053) ' },
          ],
          headers: [
            { text: '로직순위', value: 'LOGIC_RANK', align: 'left', width: '90px', sortable: false, },
            { text: '로직', value: 'LOGIC', align: 'left', width: '', sortable: false, },
            { text: '성분순위', value: 'INGREDIENT_RANK', align: 'left', width: '90px', sortable: false, },
            { text: '성분', value: 'INGREDIENT', align: 'left', width: '150px', sortable: false, },
            { text: '추천', value: 'RECOMMAND', align: 'left', width: '90px', sortable: false, },
          ],
          items: [
            { type01: '21', type02: '활력/피로 QNA0173', type03: 1, type04: '멀티비타민', type05: '추천' },
            { type01: '21', type02: '활력/피로 QNA0173', type03: 2, type04: '멀티비타민', type05: '추천' },
            { type01: '21', type02: '활력/피로 QNA0173', type03: 3, type04: '멀티비타민', type05: '추천' },
            { type01: '21', type02: '활력/피로 QNA0173', type03: 4, type04: '멀티비타민', type05: '추천' },
            { type01: '21', type02: '활력/피로 QNA0173', type03: 5, type04: '멀티비타민', type05: '추천' },
          ],
        },

        // mark: data tab: 검색
        dataTab05: {
          dropItems: [
            {
              text: '시판 제품 검색'
              , value: 'name'
            },{
              text: '드럭머거 검색'
              , value: 'code'
            }
          ]
        },

        SCH:'name',
        SCH_KEYWORD:'',

      }
    },

    created() {
      this.getServerDate();
    },
    methods: {
      toggeleExpand(index){
        this.CuttCnListProps[index].expand = !this.CuttCnListProps[index].expand;
      },
      toggeleExpandClass(index){
        return this.CuttCnListProps[index].expand === true ? 'pl-icon20 arrow-down' : 'pl-icon20 arrow-up'
      },

      answerArr(arrStr, i){
        let retStr = '';
        let arr = arrStr.split('||');
        let sortArr = this.InterviewListProps[i].ANSWER_ETC.split('||')
        for (let n=0;n<sortArr.length;n++){
          for(let j=0;j<arr.length;j++){
            if(sortArr[j] == n+1){
              if(n==0){
                retStr = (n+1)+'. '+arr[j];
              } else {
                retStr = retStr+'\n'+(n+1)+'. '+arr[j];
              }
              break;
            }
          }
        }
        return retStr.replaceAll("  ", " ");
      },

      // 서버 시간 가져오기
      async getServerDate() {
        await this.mixin_getSvrDate("YYYYMMDDHH24MISS").then((data) => {
          let cvDate = this.mixin_convertDate(data, 'yyyy-MM-dd HH:mm:ss')
          this.date = cvDate;
        })
      },

      async regRsvtCn(i){
        console.log("i", i);
        console.log("this.CuttCnListProps", this.CuttCnListProps);
        console.log("this.CuttCnListProps", this.CuttCnListProps[i]);
        let sUrl = '/api/rsvt/regRsvtCn';
        let postParam = {
          RSVT_CUTT_GUIDE_ID: i || i == 0 ? this.CuttCnListProps[i].RSVT_CUTT_GUIDE_ID : '0'
          , RSVT_ID: this.BookInfo.RSVT_ID
          , CN: i || i == 0 ? this.CuttCnListProps[i].CN : this.dataTab03.log_textarea
        }

        let headParam = {
          head : {
          }
        }

        let response  = await this.common_postCall(sUrl, postParam, headParam);

        if (!response.HEADER.ERROR_FLAG){
          if(i || i == 0){
            this.CuttCnListProps[i].expand = false;
          } else {
            const newLog = {
              USER_NM: this.$store.getters["userStore/GE_USER_ROLE"].userName,
              MDFCN_DT: this.date,
              CN: this.dataTab03.log_textarea,
              expand: false,
            }
            this.CuttCnListProps.push(newLog)
            this.dataTab03.log_textarea = '';
          }
        }
      },

      searchProduct(){
        let authorization = 'TUVESUNPSzpDQzkzMXhPYmhURUpsczlEcjVqcDVFMV94cEBzanBSZSFFU2szdiM3MFNyYW9kUG54VQ==';
        let url = 'https://pillgram.tobecon.io';
        let urlPath = '';
        if(this.SCH == 'name'){
          urlPath = '/api/biz/market/search?product='
        } else if(this.SCH == 'code') {
          urlPath = '/api/biz/market/search?code='
        }
        let params = {
          method: 'GET',
          url: url + urlPath + this.SCH_KEYWORD,
          headers: { 
            'authorization': 'Basic '+ authorization
          },
        }
        axios.request(params)
        .then(response=>{
          console.log("response", response);
        })
        .catch(error=>{
          console.log("error", error);
        })
      },
    }

  }
</script>

<style lang="scss" scoped>

</style>