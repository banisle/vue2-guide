<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                평가 연도
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  v-model="modelDateY"
                  :items="[]"
                  placeholder="전체"
                ></v-select>
              </div>
            </div>
            <v-btn class="pl-btn is-icon"
              @click="" >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class=" pl-cols fill-height">
        <!-- 그리드 -->
        <div class="is-vrt pl-card-body">
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left">
              <v-btn class="pl-btn is-icon is-trans" @click="">
                <span class="pl-icon20 circle-plus"></span>
                등록
              </v-btn>
              <v-btn class="pl-btn is-icon is-trans" @click="">
                <span class="pl-icon20 trash"></span>
                삭제
              </v-btn>
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
              <!-- 엑셀 다운로드 버튼 -->
              <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="headers"
                  :DataBodyProp="items"
                  :FileNameProp="fileName"
                  SheetNameProp="평가기간 설정"
                />
              <!--                :DataBodyProp=""-->
            </div>
          </div>
          <v-data-table
            class="pl-grid has-control is-mt-s"
            :headers="headers"
            :items="items"
            show-select
            single-select
            fixed-header
            item-key="ROW_NUM"
            height="calc(-288px + 100vh)"
            :items-per-page="-1"
            hide-default-footer
            loading-text="조회중입니다."
            no-data-text="등록된 데이터가 없습니다."
            >
          </v-data-table>
        </div>
        <!-- detail -->
        <div class="is-col-fix d-flex flex-column" style="width: 30%">
          <v-form ref="form">
            <div class="pl-card pl-scroll-body" style="height: calc(100vh - 258px);">
              <div class="pl-subtit">평가 기간 상세정보</div>
              <div class="pl-subdesc">
                <p>필수 항목을 입력하신 후 [저장] 버튼을 클릭 하십시오.</p>
              </div>
              <!-- form -->
              <div class="pl-form-inline-wrap vertical label-80 is-mt-m">
                <div class="pl-form-inline">
                  <span class="pl-label">
                    평가 연도
                  </span>
                  <div class="pl-desc">
                    <v-text-field
                      class="pl-form type-middle flex-grow-0"
                    ></v-text-field>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    평가 월
                  </span>
                  <div class="pl-desc">
                    <v-select
                      class="pl-form type-middle flex-grow-0"
                      placeholder="선택"
                      :items="[]"
                      v-model="model01"
                  ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    평가 시작일
                  </span>
                  <div class="pl-desc">
                    <compo-date-picker
                      DateType="dateInput"
                      :DateProp.sync="date2"/>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    평가 종료일
                  </span>
                  <div class="pl-desc">
                    <compo-date-picker
                      DateType="dateInput"
                      :DateProp.sync="date3"/>
                  </div>
                </div>
                <div class="pl-form-inline">
                  <span class="pl-label">
                    설명
                  </span>
                  <div class="pl-desc">
                    <v-textarea
                      class="pl-form is-noresize"
                      placeholder="설명 입력 "
                      height="250"
                      v-byte-counter="4000"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- bottom -->
            <div class="pl-card is-border text-right">
              <v-btn class="pl-btn" @click="">저장</v-btn>
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MENU_CTE_M0300 ', //실적 평가 집계
  components: {
  },
  data() {
    return {
      // search
      modelYear: '2024년',
      model01: '',

      // grid
      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px', sortable: false},
        { text: '평가 연도', value: 'YR', align: 'center', width: '', sortable: false },
        { text: '평가 월', value: 'MM', align: 'center', width: '11%', sortable: true },
        { text: '평가 시작일', value: 'EVL_BGNG_DAY', align: 'center', width: '13%', sortable: false },
        { text: '평가 종료일', value: 'EVL_END_DAY', align: 'center', width: '13%', sortable: false },
        { text: '근무 일수', value: 'WORK_DAY_COUNT', align: 'center font-weight-bold', width: '13%', sortable: false },
        { text: '등록자', value: 'REG_EMP_NM', align: '', width: '13%', sortable: false },
        { text: '등록일', value: 'REG_DT', align: '', width: '13%', sortable: false },
      ],
      items: [
        {
          index: 1,
          type01: '2024년',
          type02: '01월',
          type03: '2023-12-26',
          type04: '2024-06-20',
          type05: '22일',
          type06: '윤지영',
          type07: '2024-06-20',
        },
      ],

      // detail
      date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      date3: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

    }
  },
  methods: {
  },
  mounted() {
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>