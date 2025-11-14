<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- case: 바로처리 -->
      <template v-if="modeInstatnt">
        <!-- sub top -->
        <compo-sub-layout-top>
          <template slot="search">
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <span class="pl-label">
                  조회기간
                </span>
                <div class="pl-desc">
                  <compo-date-range-picker
                    :StartDayProp.sync="srchParam.srchStartDt"
                    :EndDayProp.sync="srchParam.srchEndDt"
                    :IsViewDropPickerProp="false"
                    :selectTermProp="true"
                    @startDayChange="()=>{ }"
                    @endDayChange="()=>{ }"
                    ParentStyleProp="width: 370px"
                  />
                </div>
              </div>

              <div class="pl-form-inline">
                <span class="pl-label">
                  접수채널
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle is-md"
                    :items="[]"
                    v-model="srchParam.model01"
                    placeholder="전체"
                  ></v-select>
                </div>
              </div>

              <div class="pl-form-inline">
                <span class="pl-label">
                  상담유형
                </span>

                <div class="pl-desc">
                  <compo-cutt-type-combo
                    :FormSeProp="'SRCH'"
                    :CustcoProp="mixin_isEmpty(srchParam.srchCustcoId)? computedUserCenter : srchParam.srchCustcoId"
                    :DisabledProp="false"
                    @EMIT_CUTT_TYPE=""
                  />
                </div>
              </div>


            </div>
            <div class="pl-form-inline-wrap is-mt-s" style="width: 100%">
              <div class="pl-form-inline">
                <span class="pl-label" >
                  부서/상담사
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle is-md"
                    :items="[]"
                    v-model="srchParam.model02"
                    placeholder="전체"
                  ></v-select>
                  <v-select
                    class="pl-form type-middle is-md"
                    :items="[]"
                    v-model="srchParam.model03"
                    placeholder="전체"
                  ></v-select>
                </div>
              </div>

              <div class="pl-form-inline flex-grow-1">
                <span class="pl-label">
                  상담메모
                </span>
                <div class="pl--desc flex-grow-1">
                  <v-text-field
                    class="pl-form type-middle is-auto"
                    placeholder="" />
                </div>
              </div>

              <div>
                <v-btn
                  class="pl-btn is-icon"
                  @click=""
                  >
                  <span class="pl-icon20 search"></span>
                  조회
                </v-btn>
                <compo-tooltip-btn
                  TitleProp="새로고침침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                ></compo-tooltip-btn>
              </div>

            </div>
          </template>
        </compo-sub-layout-top>
        <!-- sub content -->
        <div class="pl-card-body">
          <!-- 휴가구분 -->
          <!-- grid top -->
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left spacing-wrap sp-16 ">
              <ul class="pl-list-info mt-0">
                <li>
                  <strong>사용방법!</strong> 최대 1년을 초과하여 조회하지 않도록 해주세요.
                  <strong class="ml-2">주의!</strong> 엑셀다운로드 시 시스템 부하를 최소화 하기 위해 최소한의 자원으로 생성하므로 다소 시간이 오래 걸릴 수 있으니 기다리시면 안정적으로 다운로드 할 수 있습니다.
                </li>

              </ul>
            </div>
            <div class="pl-grid-top-utils">
              <!-- 엑셀 다운로드 버튼 -->
              <compo-excel
                TypeProp="Download"
                :DataHeaderProp="headers"
                :DataBodyProp="items"
                :DataNumProp="SEL_DATA_NUM"
                FileNameProp="엑셀 다운로드"
                SheetNameProp="sheetDown"
              />
            </div>
          </div>
          <!-- grid -->
          <v-data-table
            class="pl-grid is-mt-s "
            :headers="headers"
            :items="items"
            fixed-header
            item-key="index"
            width="calc(100vw - 355px)"
            height="calc(-288px + 100vh)"
            :items-per-page="items.length"
            hide-default-footer
            :loading="isLoading"
            no-data-text="등록된 데이터가 없습니다."
            >
          </v-data-table>

        </div>
      </template>
      <!-- case: 센터장 -->
      <template v-else>
        <!-- sub top -->
        <compo-sub-layout-top>
          <template slot="search">
            <div class="pl-form-inline-wrap">
              <div class="pl-form-inline">
                <span class="pl-label">
                  조회기간
                </span>
                <div class="pl-desc">
                  <compo-date-range-picker
                    :StartDayProp.sync="srchParam.srchStartDt"
                    :EndDayProp.sync="srchParam.srchEndDt"
                    :IsViewDropPickerProp="false"
                    :selectTermProp="true"
                    @startDayChange="()=>{ }"
                    @endDayChange="()=>{ }"
                    ParentStyleProp="width: 370px"
                  />
                </div>
              </div>
              <div class="pl-form-inline flex-grow-1">
                <span class="pl-label">
                  상담메모
                </span>
                <div class="pl--desc flex-grow-1">
                  <v-text-field
                    class="pl-form type-middle is-auto"
                    placeholder="" />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  접속정보
                </span>
                <div class="pl--desc flex-grow-1">
                  <v-text-field
                    class="pl-form type-middle is-auto"
                    placeholder="" />
                </div>
              </div>
            </div>

            <div class="pl-form-inline-wrap is-mt-s" style="width: 100%">
              <div class="pl-form-inline">
                <span class="pl-label">
                  상담지역
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle is-md"
                    :items="[]"
                    v-model="srchParam.model01"
                    placeholder="전체"
                  ></v-select>
                  <v-select
                    class="pl-form type-middle is-md"
                    :items="[]"
                    v-model="srchParam.model02"
                    placeholder="전체"
                  ></v-select>
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  접수채널
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle is-md"
                    :items="[]"
                    v-model="srchParam.model03"
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
                    class="pl-form type-middle is-md"
                    :items="[]"
                    v-model="srchParam.model04"
                    placeholder="전체"
                  ></v-select>
                </div>
              </div>

              <div class="pl-form-inline">
                <span class="pl-label">
                  I/O
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle is-md"
                    :items="[]"
                    v-model="srchParam.model05"
                    placeholder="전체"
                  ></v-select>
                  <v-checkbox
                    class="pl-check"
                    label="담당자이관여부"
                  ></v-checkbox>

                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label">
                  인입번호
                </span>
                <div class="pl--desc flex-grow-1">
                  <v-text-field
                    class="pl-form type-middle is-auto"
                    placeholder="" />
                </div>
              </div>

            </div>

            <div class="pl-form-inline-wrap is-mt-s" style="width: 100%">
              <div class="pl-form-inline">
                <span class="pl-label">
                  상담유형
                </span>
                <div class="pl-desc">
                  <compo-cutt-type-combo
                    :FormSeProp="'SRCH'"
                    :CustcoProp="mixin_isEmpty(srchParam.srchCustcoId)? computedUserCenter : srchParam.srchCustcoId"
                    :DisabledProp="false"
                    @EMIT_CUTT_TYPE=""
                  />
                </div>
              </div>
              <div class="pl-form-inline">
                <span class="pl-label" >
                  부서/상담사
                </span>
                <div class="pl-desc">
                  <v-select
                    class="pl-form type-middle is-md"
                    :items="[]"
                    v-model="srchParam.model02"
                    placeholder="전체"
                  ></v-select>
                  <v-select
                    class="pl-form type-middle is-md"
                    :items="[]"
                    v-model="srchParam.model03"
                    placeholder="전체"
                  ></v-select>
                </div>
              </div>
              <div>
                <v-btn
                  class="pl-btn is-icon"
                  @click=""
                  >
                  <span class="pl-icon20 search"></span>
                  조회
                </v-btn>
                <compo-tooltip-btn
                  TitleProp="새로고침침"
                  ClassProp="pl-tooltip-btn"
                  IconProp="pl-icon20 refresh"
                  TooltipPositionProp="bottom"
                ></compo-tooltip-btn>
              </div>

            </div>
          </template>
        </compo-sub-layout-top>
        <!-- sub content -->
        <div class="pl-card-body">
          <!-- 휴가구분 -->
          <!-- grid top -->
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left spacing-wrap sp-16 ">
              <ul class="pl-list-info mt-0">
                <li>
                  <strong>사용방법!</strong> 최대 1년을 초과하여 조회하지 않도록 해주세요.
                  <strong class="ml-2">주의!</strong> 엑셀다운로드 시 시스템 부하를 최소화 하기 위해 최소한의 자원으로 생성하므로 다소 시간이 오래 걸릴 수 있으니 기다리시면 안정적으로 다운로드 할 수 있습니다.
                </li>

              </ul>
            </div>
            <div class="pl-grid-top-utils">
              <!-- 엑셀 다운로드 버튼 -->
              <compo-excel
                TypeProp="Download"
                :DataHeaderProp="headers"
                :DataBodyProp="items"
                :DataNumProp="SEL_DATA_NUM"
                FileNameProp="엑셀 다운로드"
                SheetNameProp="sheetDown"
              />
            </div>
          </div>
          <!-- grid -->
          <v-data-table
            class="pl-grid is-mt-s "
            :headers="headers2"
            :items="items2"
            fixed-header
            item-key="index"
            width="calc(100vw - 355px)"
            height="calc(-338px + 100vh)"
            :items-per-page="items2.length"
            hide-default-footer
            :loading="isLoading"
            no-data-text="등록된 데이터가 없습니다."
            >
            <!-- 중분류 툴팁 -->
            <template v-slot:item.type07="{ item }">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on">
                  {{ item.type07 }}</span>
                </template>
                <span>{{ item.type07 }}</span>
              </v-tooltip>
            </template>
            <!-- 소분류 툴팁 -->
            <template v-slot:item.type08="{ item }">
              <v-tooltip content-class="pl-tooltip " bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on">
                  {{ item.type08 }}</span>
                </template>
                <span>{{ item.type08 }}</span>
              </v-tooltip>
            </template>

            <!-- 녹취 -->
            <template v-slot:item.type15="{ item }">
              <compo-tooltip-btn
                TitleProp="녹취 듣기"
                ClassProp="pl-tooltip-btn ml-auto"
                IconProp="pl-icon20 audioControl"
                TooltipPositionProp="bottom"
                :MinWidthProp=20
                :HeightProp=20
                @btnClick=""
              ></compo-tooltip-btn>
            </template>
            <!-- 코칭 -->
            <template v-slot:item.type16="{ item }">
              <compo-tooltip-btn
                TitleProp="코칭"
                ClassProp="pl-tooltip-btn ml-1"
                IconProp="pl-icon20 coaching-guide"
                TooltipPositionProp="bottom"
                :MinWidthProp=20
                :HeightProp=20
                @btnClick=""
              ></compo-tooltip-btn>
            </template>
          </v-data-table>

        </div>

      </template>
    </div>
  </div>
</template>

<script>
import CompoCuttZoneCombo from "@/components/CompoCuttZoneCombo.vue";
import CompoCuttTypeCombo from "@/components/CompoCuttTypeCombo.vue";

export default {
  name: 'MENU_STA_M2600', //상담사별 상담메모 현황
  components: {
    CompoCuttTypeCombo,
    CompoCuttZoneCombo
  },
  data() {
    return {
      // mode
      modeInstatnt: false,

      // ******** 바로처리
      // search
      srchParam : {
        srchStartDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchEndDt : this.$moment(new Date()).format('YYYY-MM-DD'),
        srchCustcoId: '',
        model01: '',
        model02: '',
        model03: '',
        model04: '',
        model05: '',
      },
      SEL_DATA_NUM: '',

      // grid
      headers: [
        { text: '지역본부', value: 'type01', align: 'center', width: '8%', sortable: false },
        { text: '단지', value: 'type02', align: 'center', width: '10%', sortable: false },
        { text: '동', value: 'type03', align: 'center', width: '3%', sortable: false },
        { text: '호', value: 'type04', align: 'center', width: '3%', sortable: false },
        { text: '고객명', value: 'type05', align: 'center', width: '4%', sortable: false },
        { text: '상담사', value: 'type06', align: 'center', width: '4%', sortable: false },
        { text: '대분류', value: 'type07', align: 'center', width: '6%', sortable: false },
        { text: '중분류', value: 'type08', align: 'center', width: '6%', sortable: false },
        { text: '소분류', value: 'type09', align: 'center', width: '6%', sortable: false },
        { text: '상담번호', value: 'type10', align: 'center', width: '6%', sortable: false },
        { text: '접속정보', value: 'type11', align: 'center', width: '6%', sortable: false },
        { text: '상담메모', value: 'type12', align: 'center text-left-important pl-text-pre-wrap py-1', width: '', sortable: false },
        { text: '수/발신번호', value: 'type13', align: 'center', width: '7%', sortable: false },
        { text: '상담일', value: 'type14', align: 'center', width: '7%', sortable: false },
        { text: '상담시각', value: 'type15', align: 'center', width: '5%', sortable: false },
        { text: '통화시간', value: 'type16', align: 'center', width: '5%', sortable: false },
      ],
      items: [
        {
          index: 0,
          type01: '경기분부지역본부',
          type02: '매입다가구(광주남구)',
          type03: '1607',
          type04: '1702',
          type05: '오의석',
          type06: '김윤정',
          type07: '미대상통보',
          type08: '고객요청',
          type09: '통화성공',
          type10: '518399992',
          type11: '하자 보수',
          type12: '발코니 결로 곰팡이 제거하고 도장 보수만 가능\n-고객 직접 청소, 환기하고 관리해야 함\n-보수방법 확인 차',
          type13: '010-9778-0000',
          type14: '2025-03-07',
          type15: '00:00:00',
          type16: '00:00:00',
        },
      ],
      isLoading : false,

      // ******** 센터장
      headers2: [
        { text: '부서', value: 'type01', align: 'center', width: '5%', sortable: false },
        { text: '상담사', value: 'type02', align: 'center', width: '4%', sortable: false },
        { text: '시도', value: 'type03', align: 'center', width: '5%', sortable: false },
        { text: '시군구', value: 'type04', align: 'center', width: '5%', sortable: false },
        { text: '지구명', value: 'type05', align: 'center', width: '5%', sortable: false },
        { text: '대분류', value: 'type06', align: 'center', width: '6%', sortable: false },
        { text: '중분류', value: 'type07', align: 'center', width: '6%', sortable: false },
        { text: '소분류', value: 'type08', align: 'center', width: '6%', sortable: false },
        { text: '상담번호', value: 'type09', align: 'center', width: '6%', sortable: false },
        { text: '접속정보', value: 'type10', align: 'center', width: '6%', sortable: false },
        { text: '상담메모', value: 'type11', align: 'center text-left-important pl-text-pre-wrap py-1', width: '', sortable: false },
        { text: '인입번호', value: 'type12', align: 'center', width: '7%', sortable: false },
        { text: '처리방법', value: 'type13', align: 'center', width: '4.8%', sortable: false },
        { text: 'I/O', value: 'type14', align: 'center', width: '3%', sortable: false },
        { text: '녹취', value: 'type15', align: 'center', width: '3%', sortable: false },
        { text: '코칭', value: 'type16', align: 'center', width: '3%', sortable: false },
        { text: '상담일', value: 'type17', align: 'center', width: '6%', sortable: false },
        { text: '상담시각', value: 'type18', align: 'center', width: '4.5%', sortable: false },
        { text: '통화시간', value: 'type19', align: 'center', width: '4.5%', sortable: false },
      ],
      items2: [
        {
          index: 0,
          type01: '마이홈1팀',
          type02: '박미진',
          type03: '지역없음',
          type04: '선택안함',
          type05: '의정부민락',
          type06: '아파트임대',
          type07: '공공임대(분납임대)',
          type08: '임대조건(임대료 등)',
          type09: '518402961',
          type10: '기타 문의',
          type11: '지역없음-\n문) 이자 이중납부됨 \n답) \n*전세임대 그룹 [5555]_그룹인관 \n[고객응대-콜센터-상담원이관]',
          type12: '010-0000-0000',
          type13: '호전환',
          type14: 'I',
          type15: true,
          type16: true,
          type17: '2025-00-00',
          type18: '00:00:00',
          type19: '00:00:00',
        },
      ],



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