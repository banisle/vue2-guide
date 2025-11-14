<template>
  <div class="px-6">
    <!-- search -->
    <div class="pl-search-form is-mt-m">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            평가연도
          </span>
          <div class="pl-desc">
            <v-select
              v-model="modelDateY"
              :items="['2024년']"
              class="pl-form type-middle is-sm"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            평가월
          </span>
          <div class="pl-desc">
            <v-select
              v-model="modelDateM"
              :items="['6월']"
              class="pl-form type-middle is-sm"
              placeholder="전체"
            ></v-select>
          </div>
        </div>
        <v-btn class="pl-btn is-icon">
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
      </div>
    </div>

    <div class="is-border-top pt-2">
      <div>
        <!-- grid top -->
        <div class="pl-grid-top ">
          <div class="pl-grid-top-left">
            <span class="pl-bullet-txt is-blue">2024년 <strong>(전체)월</strong> 실적표</span>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ items.length }})</em> 건</span>
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
          class="pl-grid is-mt-s"
          :headers="headers"
          :items="items"
          item-class="cellClass"
          fixed-header
          item-key="index"
          height="calc(-288px + 100vh)"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
	  no-data-text="등록된 데이터가 없습니다."
          >
          <template v-slot:item.type011 = {item}>
            <v-btn
              @click="showDetail()"
              :disabled="!item.type011"
              class="pl-btn is-sm is-sub">보기</v-btn>
          </template>

        </v-data-table>
      </div>

    </div>
    <!-- side panel : 상담 상세정보-->
    <v-slide-x-reverse-transition>
      <div v-if=" dialogDetail === true "
        class="pl-quick-layer"
        style="width: 800px"
              >
        <HOME_RESULT_DETAIL
          @Close="closeSlide()"
        />
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import HOME_RESULT_DETAIL from '@/views/page/Home/HOME_RESULT_DETAIL'

export default {
  name: "HOME_MANAGER_TAB07", //name은 'MENU_' + 파일명 조합
  components: {
    HOME_RESULT_DETAIL
  },
  data() {
    return {
      // search
      modelDateY: '2024년',
      modelDateM: null,

      // dialog
      dialogDetail: false,

      // grid
      ROW_PER_PAGE: 20,
      headers: [
        { text: '번호', value: 'index', align: 'center', width: '50px', sortable: false },
        { text: '연도', value: 'type01', align: 'center', width: '9%', sortable: false },
        { text: '평가월', value: 'type02', align: 'center', width: '5%', sortable: false },
        { text: '상담실적(55)', value: 'type03', align: 'center', width: '12%', sortable: false },
        { text: '상담기량(45)', value: 'type04', align: 'center', width: '12%', sortable: false },
        { text: '관리자 평가', value: 'type05', align: 'center', width: '12%', sortable: false },
        { text: '가/감점', value: 'type06', align: 'center', width: '12%', sortable: false },
        { text: '총점', value: 'type07', align: 'center', width: '12%', sortable: false },
        { text: '순위', value: 'type08', align: 'center', width: '12%', sortable: false },
        { text: '등급', value: 'type09', align: 'center', width: '12%', sortable: false },
        { text: '실적표', value: 'type011', align: 'center', width: '90px', sortable: false },
      ],
      items: [
        { index: '1', type01: '2024-06-20', type02: '12월', type03: '52.0', type04: '43.0', type05: '0.0', type06: '3.0', type07: 98, type08: 71 , type09: 'B등급', type011: true },
        { index: '2', type01: '2024-06-20', type02: '11월', type03: '52.0', type04: '43.0', type05: '0.0', type06: '3.0', type07: 98, type08: 71 , type09: 'B등급', type011: true },
        { index: '3', type01: '2024-06-20', type02: '10월', type03: '52.0', type04: '43.0', type05: '0.0', type06: '3.0', type07: 98, type08: 71 , type09: 'B등급', type011: true },
        { index: '4', type01: '2024-06-20', type02: '9월', type03: '52.0', type04: '43.0', type05: '0.0', type06: '3.0', type07: 98, type08: 71 , type09: 'B등급', type011: true },
        { index: '5', type01: '2024-06-20', type02: '8월', type03: '52.0', type04: '43.0', type05: '0.0', type06: '3.0', type07: 98, type08: 71 , type09: 'B등급', type011: true },
        { index: '6', type01: '2024-06-20', type02: '7월', type03: '52.0', type04: '43.0', type05: '0.0', type06: '3.0', type07: 98, type08: 71 , type09: 'B등급', type011: true },
        { index: '7', type01: '2024-06-20', type02: '6월', type03: '52.0', type04: '43.0', type05: '0.0', type06: '3.0', type07: 98, type08: 71 , type09: 'B등급', type011: true },
        { index: '8', type01: '2024-06-20', type02: '5월', type03: '52.0', type04: '43.0', type05: '0.0', type06: '3.0', type07: 98, type08: 71 , type09: 'B등급', type011: true },
        { index: '9', type01: '2024-06-20', type02: '4월', type03: '52.0', type04: '43.0', type05: '0.0', type06: '3.0', type07: 98, type08: 71 , type09: 'B등급', type011: true },
        { index: '10', type01: '2024-06-20', type02: '3월', type03: '52.0', type04: '43.0', type05: '0.0', type06: '3.0', type07: 98, type08: 71 , type09: 'B등급', type011: true },
        { index: '11', type01: '2024-06-20', type02: '2월', type03: '52.0', type04: '43.0', type05: '0.0', type06: '3.0', type07: 98, type08: 71 , type09: 'B등급', type011: true },
        { index: '12', type01: '2024-06-20', type02: '1월', type03: '52.0', type04: '43.0', type05: '0.0', type06: '3.0', type07: 98, type08: 71 , type09: 'B등급', type011: true },
      ],

    }
  },
  methods: {
    showDetail(){
      this.dialogDetail = true
    },
    closeSlide(){
      this.dialogDetail = false
    }
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