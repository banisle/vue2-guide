<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top  >
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                근무월
              </span>
              <div class="pl-desc">
                <compo-date-picker
                  NoTitleProp
                  PickerType="month"
                  DateType="dateInput"
                  :DateProp.sync="date2"/>
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                센터
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle is-sm"
                  placeholder="전체"
                ></v-select>
              </div>
            </div>

            <div class="pl-form-inline">
              <span class="pl-label">
                부서/상담사
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle is-md"
                  placeholder="전체"
                ></v-select>
                <v-select
                  class="pl-form type-middle"
                  placeholder="전체"
                ></v-select>
              </div>
            </div>
            <div>
              <v-btn
                class="pl-btn is-icon"
                >
                <span class="pl-icon20 search"></span>
                조회
              </v-btn>
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
            <strong class="pl-bullet-txt is-blue">휴가구분</strong>
          </div>
          <div class="pl-grid-top-utils">
            <!-- 엑셀 다운로드 버튼 -->
            <compo-tooltip-btn
              TitleProp="엑셀 다운로드"
              ClassProp="pl-tooltip-btn "
              IconProp="pl-icon20 exceldown"
              TooltipPositionProp="bottom"
              @btnClick="mixin_testLog('엑셀 다운로드')"
            ></compo-tooltip-btn>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="headers"
          :items="items"
          fixed-header
          item-key="index"
          height="240px"
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다."
          >
        </v-data-table>

        <!-- 상담원 list -->
        <!-- grid top -->
        <div class="pl-grid-top is-mt-l">
          <div class="pl-grid-top-left spacing-wrap sp-16 ">
            <strong class="pl-bullet-txt is-blue">상담사</strong>
          </div>
          <div class="pl-grid-top-utils">
            <!-- 엑셀 다운로드 버튼 -->
            <compo-tooltip-btn
              TitleProp="엑셀 다운로드"
              ClassProp="pl-tooltip-btn "
              IconProp="pl-icon20 exceldown"
              TooltipPositionProp="bottom"
              @btnClick="mixin_testLog('엑셀 다운로드')"
            ></compo-tooltip-btn>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-hover"
          :headers="headers2"
          :items="items2"
          fixed-header
          item-key="index"
          height="376px"
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다."
          >
        </v-data-table>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MENU_STA_M0200', //상담사 근태현황 통계
  components: {
  },
  data() {
    return {
      date2: '2024-11',

      // 휴가구분
      // grid
      ROW_PER_PAGE: -1,
      headers: [
        { text: '구분', value: 'type00', align: ' font-weight-bold', width: '', sortable: false },
        { text: '범례', value: 'type01', align: '', width: '', sortable: false },
        { text: '계', value: 'type02', align: '', width: '', sortable: false },

        { text: '구분', value: 'type03', align: ' font-weight-bold', width: '', sortable: false },
        { text: '범례', value: 'type04', align: '', width: '', sortable: false },
        { text: '계', value: 'type05', align: '', width: '', sortable: false },

        { text: '구분', value: 'type06', align: ' font-weight-bold', width: '', sortable: false },
        { text: '범례', value: 'type07', align: '', width: '', sortable: false },
        { text: '계', value: 'type08',align: '', width: '', sortable: false },

        { text: '구분', value: 'type09', align: ' font-weight-bold', width: '', sortable: false },
        { text: '범례', value: 'type10', align: '', width: '', sortable: false },
        { text: '계', value: 'type11', align: '', width: '', sortable: false },
      ],
      items: [
        { index: 1,
          type00: '정상근무',
          type01: 'O',
          type02: '연차',

          type03: '1시간휴가',
          type04: '1HR',
          type05: 14,

          type06: '경조휴가',
          type07: '경조',
          type08: 8,

          type09: '특별휴가',
          type10: '특휴',
          type11: 14,
        },
        { index: 2,
          type00: '연차휴가',
          type01: 'O',
          type02: '연차',

          type03: '2시간휴가',
          type04: '1HR',
          type05: 14,

          type06: '공가',
          type07: '공가',
          type08: 8,

          type09: '유급병가',
          type10: '유병',
          type11: 14,
        },
        { index: 3,
          type00: '반차',
          type01: '반차',
          type02: 0,

          type03: '3시간휴가',
          type04: '3HR',
          type05: 1,

          type06: '보건휴가',
          type07: '보휴',
          type08: 0,

          type09: '무급병가',
          type10: '무병',
          type11: 0,
        },
        { index: 4,
          type00: '조퇴',
          type01: '조퇴',
          type02: 0,

          type03: '5시간휴가',
          type04: '5HR',
          type05: 1,

          type06: '자녀돌봄',
          type07: '자녀',
          type08: 0,

          type09: '무급휴가',
          type10: '무휴',
          type11: 0,
        },
        { index: 5,
          type00: '조회지각',
          type01: '조지',
          type02: 0,

          type03: '6시간휴가',
          type04: '6HR',
          type05: 1,

          type06: '휴직',
          type07: '휴직',
          type08: 0,
        },
        { index: 6,
          type00: '업무지각',
          type01: '업지',
          type02: 0,

          type03: '7시간휴가',
          type04: '7HR',
          type05: 1,

          type06: '기타',
          type07: '기타',
          type08: 0,
        },
        { index: 7,
          type00: '결근',
          type01: '결근',
          type02: 0,
        },
      ],

      // grid list
      headers2: [
        { text: 'NO', value: 'index', align: 'center', width: '50px', sortable: false },
        { text: '상담사ID', value: 'type01', align: 'center', width: '100px', sortable: false },
        { text: '상담사명', value: 'type02', align: 'center', width: '100px', sortable: false },
        { text: '○ 근무일', value: 'type03', align: 'center', width: '80px', sortable: false },
        { text: '1', value: 'type04', align: 'center pa-0', width: '', sortable: false },
        { text: '2', value: 'type05', align: 'center pa-0', width: '', sortable: false },
        { text: '3', value: 'type06', align: 'center pa-0', width: '', sortable: false },
        { text: '4', value: 'type07', align: 'center pa-0', width: '', sortable: false },
        { text: '5', value: 'type08', align: 'center pa-0', width: '', sortable: false },
        { text: '6', value: 'type09', align: 'center pa-0', width: '', sortable: false },
        { text: '7', value: 'type10', align: 'center pa-0', width: '', sortable: false },
        { text: '8', value: 'type11', align: 'center pa-0', width: '', sortable: false },
        { text: '9', value: 'type12', align: 'center pa-0', width: '', sortable: false },
        { text: '10', value: 'type13', align: 'center pa-0', width: '', sortable: false },
        { text: '11', value: 'type14', align: 'center pa-0', width: '', sortable: false },
        { text: '12', value: 'type15', align: 'center pa-0', width: '', sortable: false },
        { text: '13', value: 'type16', align: 'center pa-0', width: '', sortable: false },
        { text: '14', value: 'type17', align: 'center pa-0', width: '', sortable: false },
        { text: '15', value: 'type18', align: 'center pa-0', width: '', sortable: false },
        { text: '16', value: 'type19', align: 'center pa-0', width: '', sortable: false },
        { text: '17', value: 'type20', align: 'center pa-0', width: '', sortable: false },
        { text: '18', value: 'type21', align: 'center pa-0', width: '', sortable: false },
        { text: '19', value: 'type22', align: 'center pa-0', width: '', sortable: false },
        { text: '20', value: 'type23', align: 'center pa-0', width: '', sortable: false },
        { text: '21', value: 'type24', align: 'center pa-0', width: '', sortable: false },
        { text: '22', value: 'type25', align: 'center pa-0', width: '', sortable: false },
        { text: '23', value: 'type26', align: 'center pa-0', width: '', sortable: false },
        { text: '24', value: 'type27', align: 'center pa-0', width: '', sortable: false },
        { text: '25', value: 'type28', align: 'center pa-0', width: '', sortable: false },
        { text: '26', value: 'type29', align: 'center pa-0', width: '', sortable: false },
        { text: '27', value: 'type30', align: 'center pa-0', width: '', sortable: false },
        { text: '28', value: 'type31', align: 'center pa-0', width: '', sortable: false },
        { text: '29', value: 'type32', align: 'center pa-0', width: '', sortable: false },
        { text: '30', value: 'type33', align: 'center pa-0', width: '', sortable: false },
        { text: '31', value: 'type34', align: 'center pa-0', width: '', sortable: false },
      ],
      items2: [
        {
          index: 1,
          type01: 981234,
          type02: '강귀옥',
          type03: '1/02',
          type04: '○',
          type05: '3HR',
          type06: '충전',
          type07: '',
          type08: '',
          type09: '',
          type10: '',
          type11: '',
          type12: '',
          type13: '',
          type14: '',
          type15: '',
          type16: '',
          type17: '',
          type18: '',
          type19: '',
          type20: '',
          type21: '',
          type22: '',
          type23: '',
          type24: '',
          type25: '',
          type26: '',
          type27: '',
          type28: '',
          type29: '',
          type30: '',
          type31: '',
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