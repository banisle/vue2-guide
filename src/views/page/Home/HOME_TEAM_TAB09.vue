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
          ></v-select>
          </div>
        </div>
        <!-- 버튼 -->
        <div>
          <v-btn class="pl-btn is-icon">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
        </div>
      </div>
    </div>
    <!-- grid top -->
    <div class="pl-grid-top is-border-top pt-2">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">2024년 <span class="is-txt-blue">(06월)</span> 평가 결과표</strong>
      </div>
      <div class="pl-grid-top-utils">
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ 0 }})</em> 명</span>
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
      class="pl-grid has-img is-hover is-mt-s is-header-lg"
      :headers="headers"
      :items="[]"
      fixed-header
      item-key="index"
      :style="`${computedUserType !== 'ETC_ADMIN' ? 'max-width: calc(100vw - 410px)' : 'max-width: calc(100vw - 290px)'}`"
      height="calc(-288px + 100vh)"
      :items-per-page="ROW_PER_PAGE"
      hide-default-header
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      @dblclick:row="showDetail()"
      >
      <template v-slot:header>
        <thead class="v-data-table-header multi-row">
          <tr>
            <th rowspan="2" width="50px" class="text-center"><span>번호</span></th>
            <th rowspan="2" width="100px" class="text-center"><span>성명</span></th>
            <th rowspan="2" width="70px" class="text-center"><span>사번</span></th>
            <th rowspan="2" width="60px" class="text-center"><span>급수</span></th>
            <th rowspan="2" width="80px" class="text-center"><span>구분</span></th>
            <th rowspan="2" width="80px" class="text-center"><span>입사일</span></th>
            <th rowspan="2" width="70px" class="text-center"><span>근무비율</span></th>

            <th colspan="5" width="320px" class="text-center"><span>상담실적(55%) </span></th>

            <th colspan="5" width="320px" class="text-center"><span>상담기량(45%) </span></th>

            <th rowspan="2" width="60px" class="text-center">가감점 </th>
            <th rowspan="2" width="70px" class="text-center">총점 </th>
            <th rowspan="2" width="50px" class="text-center">순위 </th>
            <th rowspan="2" width="50px" class="text-center">등급 </th>
            <th rowspan="2" width="80px" class="text-center">실적수당 </th>

            <th rowspan="2" width="80px" class="text-center"><span>프로모션</span></th>
            <th rowspan="2" width="80px" class="text-center"><span>비고</span></th>
          </tr>
          <tr>
            <th width="60px" class="text-center">일평균 통화콜수 </th>
            <th width="60px" class="text-center">일평균 통화시간 </th>
            <th width="50px" class="text-center">낫레디 </th>
            <th width="50px" class="text-center">합계 </th>
            <th width="50px" class="text-center">순위 </th>

            <th width="50px" class="text-center">상담품질 1차 </th>
            <th width="50px" class="text-center">상담품질 2차 </th>
            <th width="50px" class="text-center">업무평가 </th>
            <th width="50px" class="text-center">합계 </th>
            <th width="50px" class="text-center">순위 </th>


          </tr>
        </thead>
      </template>
      <template v-slot:item.type01="{ item }">
        <img :src="item.img" :alt="item.type01" class="pl-grid-portrait" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}">
        <strong class="ml-1">{{ item.type01 }}</strong>
      </template>
      <!-- 가감점 -->
      <template v-slot:item.type017="{ item }">
        <td class="text-center">
          <span :class="`is-txt-${item.type017[1]}`">{{item.type017[0]}}</span>
        </td>
      </template>
      <!-- 비고 -->
      <template v-slot:item.type023="{ item }">
        <td class="text-center">
          <span :class="`is-txt-${item.type023[1]}`">{{item.type023[0]}}</span>
        </td>
      </template>

    </v-data-table>

    <!-- side panel : 상담 상세정보-->
    <v-slide-x-reverse-transition>
      <div v-if=" dialogDetail === true "
        class="pl-quick-layer"
        :style="tempCenterStyle"
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
  name: "HOME_TEAM_TAB09", //name은 'MENU_' + 파일명 조합
  components: {
    HOME_RESULT_DETAIL
  },
  data() {
    return {
      modelDateY: '2024년',
      modelDateM: '6월',

      // dialog
      dialogDetail: false,

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 15,
      headers: [
        { text: '번호', value: 'index', align: 'center', width: '70px', sortable: false },
        { text: '성명', value: 'type01', align: 'center', width: '130px' },
        { text: '사번', value: 'type02', align: 'center', width: '90px', sortable: false },
        { text: '급수', value: 'type03', align: 'center', width: '90px', sortable: false },
        { text: '구분', value: 'type04', align: 'center', width: '60px', sortable: false },
        { text: '입사일', value: 'type05', align: 'center', width: '80px', sortable: false },
        { text: '근무비율', value: 'type06', align: 'center', width: '50px', sortable: false },
        { text: '일평균 통화콜수', value: 'type07', align: 'center', width: '70px', sortable: false},
        { text: '일평균 통화시간',value: 'type08', align: 'center', width: '70px', sortable: false },
        { text: '낫레디',value: 'type09', align: 'center', width: '70px', sortable: false },
        { text: '합계',value: 'type010', align: 'center', width: '70px', sortable: false },
        { text: '순위',value: 'type011', align: 'center', width: '70px', sortable: false },
        { text: '상담품질 1차',value: 'type012', align: 'center', width: '70px', sortable: false },
        { text: '상담품질 2차',value: 'type013', align: 'center', width: '70px', sortable: false },
        { text: '업무평가',value: 'type014', align: 'center', width: '70px', sortable: false },
        { text: '합계',value: 'type015', align: 'center', width: '70px', sortable: false },
        { text: '순위',value: 'type016', align: 'center', width: '70px', sortable: false },
        { text: '가감점',value: 'type017', align: 'center', width: '70px', sortable: false },
        { text: '총점',value: 'type018', align: 'center', width: '70px', sortable: false },
        { text: '순위',value: 'type019', align: 'center', width: '70px', sortable: false },
        { text: '등급',value: 'type020', align: 'center', width: '70px', sortable: false },
        { text: '실적수당',value: 'type021', align: 'center', width: '150px', sortable: false },
        { text: '프로모션',value: 'type022', align: 'center', width: '70px', sortable: false },
        { text: '비고',value: 'type023', align: 'center', width: '5%', sortable: false },

      ],
      items: [
        { index: 1, img: require('@/assets/img/@manager_profile.png'), type01: '김경미', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '1', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '1', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 2, img: require('@/assets/img/@manager_profile2.png'), type01: '김승은', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '1', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '2', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 3, img: require('@/assets/img/@manager_profile3.png'), type01: '김재갑', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '15', type08: '208', type09: '20', type010: '55', type011: '1', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '3', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 4, img: require('@/assets/img/@manager_profile_default.png'), type01: '김효주', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '100%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '60', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: ['(0.4)','red'], type018: '104.20', type019: '4', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 5, img: require('@/assets/img/@manager_profile4.png'), type01: '박훈빈', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98.5%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '60', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '5', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 6, img: require('@/assets/img/@manager_profile5.png'), type01: '방소형', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '1', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '6', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 7, img: require('@/assets/img/@manager_profile6.png'), type01: '백주일', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '1', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '7', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 8, img: require('@/assets/img/@manager_profile3.png'), type01: '신미옥', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '1', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '8', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 9, img: require('@/assets/img/@manager_profile2.png'), type01: '윤미영', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '1', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '9', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 10, img: require('@/assets/img/@manager_profile3.png'), type01: '임정아', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '84', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '10', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 11, img: require('@/assets/img/@manager_profile4.png'), type01: '조지혜', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '158', type08: '20', type09: '20', type010: '558', type011: '1', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '11', type020: 'A등급', type021: '100,000', type022: '', type023: ['평가제외','red'], },
        { index: 12, img: require('@/assets/img/@manager_profile5.png'), type01: '진선미', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '1', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '12', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 13, img: require('@/assets/img/@manager_profile6.png'), type01: '최윤미', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '1', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '13', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 14, img: require('@/assets/img/@manager_profile.png'), type01: '하현정', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '1', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '14', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 15, img: require('@/assets/img/@manager_profile2.png'), type01: '양지혜', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '1', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '15', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
        { index: 16, img: require('@/assets/img/@manager_profile3.png'), type01: '이승철', type02: '123456', type03: '6급', type04: '정규직', type05: '2016-07-10', type06: '98%', type07: '15', type08: '20', type09: '20', type010: '55', type011: '1', type012: '17.5', type013: '17.5', type014: '10.0', type015: '45.0', type016: '1', type017: '4.2', type018: '104.20', type019: '16', type020: 'A등급', type021: '100,000', type022: '', type023: '', },
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