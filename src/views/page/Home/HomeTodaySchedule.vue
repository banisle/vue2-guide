<template>
  <div class="">
    <!-- search -->
    <div class="pl-search-form">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            년도
          </span>
          <div class="pl-desc">
            <v-select
              v-model="modelY"
              :items="['2024년']"
              class="pl-form type-middle is-sm"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            지역
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle is-sm"
              placeholder="전국"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            시/군/구
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            공급유형
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle is-sm"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            공고명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle"
              placeholder="공고명 입력" />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            단지명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle"
              placeholder="단지명 입력" />
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
      <div class="pl-grid-top-left spacing-wrap sp-16">
        <span class="pl-subtit">오늘의 일정</span>
        <span class="pl-bullet-txt is-green">오늘 <strong>(3)</strong></span>
        <span class="pl-bullet-txt is-red">어제 <strong>(2)</strong></span>
        <span class="pl-bullet-txt is-blue">최근 3일 <strong>(12)</strong></span>
        <span class="pl-bullet-txt is-yellow">최근 일주일 <strong>(21)</strong></span>
      </div>
      <div class="pl-grid-top-utils">
        <!-- 등록 버튼 -->
        <compo-tooltip-btn
          TitleProp="등록"
          ClassProp="pl-tooltip-btn "
          IconProp="pl-icon20 circle-plus"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('등록')"
        ></compo-tooltip-btn>

        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ itemsRowSpan.length }})</em> 건</span>

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
      class="pl-grid is-mt-s is-rowspan type-hover-func"
      :headers="headersRowSpan"
      :items="itemsRowSpan"
      fixed-header
      item-key="index"
      height="672px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-header
      hide-default-footer
      :page.sync="page"
      @page-count="pageCount = $event"
      no-data-text="등록된 데이터가 없습니다."
    >
      <template v-slot:header>
        <thead class="v-data-table-header multi-row">
          <tr>
            <th rowspan="2" width="50px" class="text-center"><span>번호</span></th>
            <th rowspan="2" width="80px" class="text-left"><span>지역</span></th>
            <th rowspan="2" width="80px" class="text-left"><span>시/군/구</span></th>
            <th rowspan="2" width="100px" class="text-left"><span>공급유형</span></th>
            <th rowspan="2" width="350px" class="text-left"><span>공고명</span></th>
            <th rowspan="2" width="250px" class="text-left"><span>단지명</span></th>
            <th rowspan="2" width="80px" class="text-center"><span>공고일</span></th>

            <th colspan="2" width="160px" class="text-center"><span>접수기간</span></th>
            <th colspan="2" width="160px" class="text-center"><span>서류제출 대상자 발표</span></th>
            <th colspan="2" width="160px" class="text-center"><span>서류접수 기간</span></th>

            <th rowspan="2" width="140px" class="text-center" >
              <span style="line-height: 1.4">당첨자<br>발표일</span>
            </th>
            <th rowspan="2" width="100px" class="text-left"><span>비고</span></th>
          </tr>
          <tr>
            <th class="text-center"><span >시작일</span></th>
            <th class="text-center"><span >종료일</span></th>
            <th class="text-center"><span >시작일</span></th>
            <th class="text-center"><span >종료일</span></th>
            <th class="text-center"><span >시작일</span></th>
            <th class="text-center"><span >종료일</span></th>

          </tr>
        </thead>
      </template>
      <template v-slot:item="{ item, index }">
        <tr
          :class="mixin_getItemClass(item)"
          :key="index">
          <td>{{ item.index }}</td>
          <td
            v-if="index === 0 || item.type01 !== itemsRowSpan[index - 1].type01"
            :rowspan="mixin_getRowCount(index, 'type01')"
            :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.type01 }}</td>
          <td
            v-if="index === 0 || item.type02 !== itemsRowSpan[index - 1].type02"
            :rowspan="mixin_getRowCount(index, 'type02')"
            :class="mixin_getHeaderClass(headersRowSpan[1].align)">{{ item.type02 }}</td>
          <td
            v-if="index === 0 || item.type03 !== itemsRowSpan[index - 1].type03"
            :rowspan="mixin_getRowCount(index, 'type03')"
            :class="mixin_getHeaderClass(headersRowSpan[2].align)">
            {{ item.type03 }}
          </td>
          <td
            v-if="index === 0 || item.type04 !== itemsRowSpan[index - 1].type04"
            :rowspan="mixin_getRowCount(index, 'type04')"
            :class="mixin_getHeaderClass(headersRowSpan[2].align)">
            {{ item.type04 }}
          </td>
          <td
            v-if="index === 0 || item.type05 !== itemsRowSpan[index - 1].type05"
            :rowspan="mixin_getRowCount(index, 'type05')"
            :class="mixin_getHeaderClass(headersRowSpan[2].align)">
            {{ item.type05 }}
          </td>
          <td>{{ item.type06 }}</td>
          <td>{{ item.type07 }}</td>
          <td>{{ item.type08 }}</td>
          <td>{{ item.type09 }}</td>
          <td>{{ item.type010 }}</td>
          <td>{{ item.type011 }}</td>
          <td>{{ item.type012 }}</td>
          <td>{{ item.type013 }}</td>
          <td>
            <v-menu
              v-model="item.dropIssue"
              max-width="450"
              bottom
              left
              offset-y
              offset-x
              :close-on-content-click=false
              content-class="pl-menu-drop"
            >
              <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                <strong
                  v-bind="menuAttrs"
                  v-on="menuOn"
                  style="cursor: pointer;"
                  :class="mixin_displayStatus(item.type014, 'STAT_LIST')">{{ item.type014 }}
                </strong>
              </template>
              <!-- dialog -->
              <div class="px-3 py-2">
                <div class="d-flex">
                  <h3 style="font-size: 16px">특이사항</h3>
                  <v-btn
                    @click="item.dropIssue = false"
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
                <!-- list -->
                <div class="spacing-wrap sp-8 flex-column is-mt-m">
                  <div class="d-flex align-center">
                    <strong class="" style="flex: 0 0 100px">구분</strong>
                    <div class="spacing-wrap sp-4">
                      취소공고
                    </div>
                  </div>
                  <div class="d-flex ">
                    <strong class="" style="flex: 0 0 100px">일취소공고시</strong>
                    <p>공공주택특별법 시행규칙 별표4의 제3항 바목 7에 의거하여 면적완화를 위한 지자체 협의 후 재 공고를 진행할 예정입니다.</p>
                  </div>
                  <div class="is-border-sub-top is-mt-s pt-3">
                    <div class="spacing-wrap sp-8 flex-column">
                      <div class="d-flex align-center">
                        <strong class="" style="flex: 0 0 100px">수정일</strong>
                        <span class="">2024-05-07 15:30:45</span>
                      </div>
                      <div class="d-flex ">
                        <strong style="flex: 0 0 100px;">수정자</strong>
                        윤지영(마이홈센터 – 마이홈1팀)
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </v-menu>
            <template v-if="item.type014">
              <v-tooltip content-class="pl-tooltip bottom" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-menu
                    min-width="120"
                    bottom
                    right
                    offset-y
                    content-class="pl-menu-drop"
                  >
                    <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
                      <v-btn
                        v-bind="menuAttrs"
                        v-on="menuOn"
                        class="pl-tooltip-btn ml-1"
                        min-width="22"
                        height="22"
                        plain
                        >
                        <v-icon
                          v-bind="attrs"
                          v-on="on"
                          class="pl-icon20 detail"></v-icon>
                      </v-btn>
                    </template>
                    <ul class="pl-drop-layer-list">
                      <li
                        v-for="(item, index) in detailList"
                        :key="index"
                        >
                        <v-icon :class="`pl-icon20 ${ item.icon }`"></v-icon>
                        <span class="ml-1">{{ item.title }}</span>
                      </li>
                    </ul>
                  </v-menu>
                </template>
                <span>상세</span>
              </v-tooltip>
            </template>
          </td>

        </tr>
      </template>
    </v-data-table>



  </div>
</template>

<script>
export default {
  name: "HomeTodaySchedule", //name은 'MENU_' + 파일명 조합
  components: {
  },
  data() {
    return {
      // search
      modelY: '2024년',

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 20,
      headersRowSpan: [
        { text: '번호', value: 'index', align: 'center', width: '70px', sortable: false },
        { text: '지역', value: 'type01', align: 'left', width: '10%', sortable: false },
        { text: '시/군/구', value: 'type02', align: 'left', width: '10%', sortable: false },
        { text: '공급유형', value: 'type03', align: 'left', width: '10%', sortable: false },
        { text: '공고명', value: 'type04', align: 'left', width: '', sortable: false },
        { text: '단지명', value: 'type05', align: 'left', width: '5%', sortable: false },
        { text: '공고일', value: 'type06', align: 'center', width: '5%', sortable: false },
        { text: '시작일', value: 'type07', align: 'center', width: '5%', sortable: false },
        { text: '종료일', value: 'type08', align: 'center', width: '5%', sortable: false },
        { text: '시작일', value: 'type09', align: 'center', width: '5%', sortable: false },
        { text: '종료일', value: 'type010', align: 'center', width: '5%', sortable: false },
        { text: '시작일', value: 'type011', align: 'center', width: '5%', sortable: false },
        { text: '종료일', value: 'type012', align: 'center', width: '5%', sortable: false },
        { text: '당첨자 발표일', value: 'type013', align: 'center', width: '5%', sortable: false },
        { text: '비고', value: 'type014', align: 'left', width: '5%', sortable: false },
      ],
      itemsRowSpan: [
        { dropIssue: false, index: 5621, type01: '경기', type02: '수원시', type03: '10년공임', type04: '수원지역 10년 공공임대주택 예비입주자 모집 공고', type05: '호매실14단지(B-3BL)', type06: '2024-08-05', type07: '2024-08-19', type08: '2024-08-21', type09: '2024-08-22', type010: '2024-08-22', type011: '2024-07-11', type012: '2024-07-17', type013: '2024-07-10 (17:00)', type014: '', },
        { dropIssue: false, index: 5622, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정한울4', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '', },
        { dropIssue: false, index: 5623, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정한울5', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '취소공고', },
        { dropIssue: false, index: 5624, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정한울6', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '', },
        { dropIssue: false, index: 5625, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정한울7', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '', },
        { dropIssue: false, index: 5626, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정별하람', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '', },
        { dropIssue: false, index: 5627, type01: '경기', type02: '수원시', type03: '신혼희망', type04: '부천원종 B2블록 신혼희망타운(공공분양) 잔여세대', type05: '부천원종 B2블록', type06: '2024-06-18', type07: '2024-06-28', type08: '-', type09: '-', type010: '-', type011: '2024-06-10', type012: '-', type013: '2024-08-04', type014: '', },
        { dropIssue: false, index: 5628, type01: '경기', type02: '오산시', type03: '50년공임 ', type04: '오산운암6단지 50년공공임대주택 예비자 모집', type05: '오산운암6', type06: '2024-04-15', type07: '2024-04-25', type08: '2024-05-22', type09: '2024-05-09', type010: '-', type011: '2024-05-10', type012: '2024-05-14', type013: '2024-06-24', type014: '', },
        { dropIssue: false, index: 5629, type01: '경기', type02: '남양주시', type03: '통합공공임대', type04: '남양주별내 A1-1(별내 별해임)통합공공임대주택 예비입주자', type05: '남양주별내 A1-1BL', type06: '2024-03-14', type07: '2024-03-26', type08: '2024-03-28', type09: '2024-04-01', type010: '-', type011: '2024-04-02', type012: '2024-04-09', type013: '2024-06-28', type014: '변경', },
        { dropIssue: false, index: 5630, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정한울7', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '', },
        { dropIssue: false, index: 5631, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정별하람', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '', },
        { dropIssue: false, index: 5632, type01: '경기', type02: '수원시', type03: '신혼희망', type04: '부천원종 B2블록 신혼희망타운(공공분양) 잔여세대', type05: '부천원종 B2블록', type06: '2024-06-18', type07: '2024-06-28', type08: '-', type09: '-', type010: '-', type011: '2024-06-10', type012: '-', type013: '2024-08-04', type014: '', },
        { dropIssue: false, index: 5633, type01: '경기', type02: '오산시', type03: '50년공임 ', type04: '오산운암6단지 50년공공임대주택 예비자 모집', type05: '오산운암6', type06: '2024-04-15', type07: '2024-04-25', type08: '2024-05-22', type09: '2024-05-09', type010: '-', type011: '2024-05-10', type012: '2024-05-14', type013: '2024-06-24', type014: '', },
        { dropIssue: false, index: 5634, type01: '경기', type02: '남양주시', type03: '통합공공임대', type04: '남양주별내 A1-1(별내 별해임)통합공공임대주택 예비입주자', type05: '남양주별내 A1-1BL', type06: '2024-03-14', type07: '2024-03-26', type08: '2024-03-28', type09: '2024-04-01', type010: '-', type011: '2024-04-02', type012: '2024-04-09', type013: '2024-06-28', type014: '변경', },
        { dropIssue: false, index: 5635, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정한울7', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '', },
        { dropIssue: false, index: 5636, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정별하람', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '', },
        { dropIssue: false, index: 5637, type01: '경기', type02: '수원시', type03: '신혼희망', type04: '부천원종 B2블록 신혼희망타운(공공분양) 잔여세대', type05: '부천원종 B2블록', type06: '2024-06-18', type07: '2024-06-28', type08: '-', type09: '-', type010: '-', type011: '2024-06-10', type012: '-', type013: '2024-08-04', type014: '', },
        { dropIssue: false, index: 5638, type01: '경기', type02: '오산시', type03: '50년공임 ', type04: '오산운암6단지 50년공공임대주택 예비자 모집', type05: '오산운암6', type06: '2024-04-15', type07: '2024-04-25', type08: '2024-05-22', type09: '2024-05-09', type010: '-', type011: '2024-05-10', type012: '2024-05-14', type013: '2024-06-24', type014: '', },
        { dropIssue: false, index: 5639, type01: '경기', type02: '남양주시', type03: '통합공공임대', type04: '남양주별내 A1-1(별내 별해임)통합공공임대주택 예비입주자', type05: '남양주별내 A1-1BL', type06: '2024-03-14', type07: '2024-03-26', type08: '2024-03-28', type09: '2024-04-01', type010: '-', type011: '2024-04-02', type012: '2024-04-09', type013: '2024-06-28', type014: '변경', },
        { dropIssue: false, index: 5650, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정별하람', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '', },
        { dropIssue: false, index: 5651, type01: '경기', type02: '수원시', type03: '신혼희망', type04: '부천원종 B2블록 신혼희망타운(공공분양) 잔여세대', type05: '부천원종 B2블록', type06: '2024-06-18', type07: '2024-06-28', type08: '-', type09: '-', type010: '-', type011: '2024-06-10', type012: '-', type013: '2024-08-04', type014: '', },
        { dropIssue: false, index: 5651, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정별하람', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '', },
        { dropIssue: false, index: 5652, type01: '경기', type02: '수원시', type03: '신혼희망', type04: '부천원종 B2블록 신혼희망타운(공공분양) 잔여세대', type05: '부천원종 B2블록', type06: '2024-06-18', type07: '2024-06-28', type08: '-', type09: '-', type010: '-', type011: '2024-06-10', type012: '-', type013: '2024-08-04', type014: '', },
        { dropIssue: false, index: 5653, type01: '경기', type02: '오산시', type03: '50년공임 ', type04: '오산운암6단지 50년공공임대주택 예비자 모집', type05: '오산운암6', type06: '2024-04-15', type07: '2024-04-25', type08: '2024-05-22', type09: '2024-05-09', type010: '-', type011: '2024-05-10', type012: '2024-05-14', type013: '2024-06-24', type014: '', },
        { dropIssue: false, index: 5654, type01: '경기', type02: '남양주시', type03: '통합공공임대', type04: '남양주별내 A1-1(별내 별해임)통합공공임대주택 예비입주자', type05: '남양주별내 A1-1BL', type06: '2024-03-14', type07: '2024-03-26', type08: '2024-03-28', type09: '2024-04-01', type010: '-', type011: '2024-04-02', type012: '2024-04-09', type013: '2024-06-28', type014: '변경', },
        { dropIssue: false, index: 5655, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정한울7', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '', },
        { dropIssue: false, index: 5656, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정별하람', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '', },
        { dropIssue: false, index: 5657, type01: '경기', type02: '수원시', type03: '신혼희망', type04: '부천원종 B2블록 신혼희망타운(공공분양) 잔여세대', type05: '부천원종 B2블록', type06: '2024-06-18', type07: '2024-06-28', type08: '-', type09: '-', type010: '-', type011: '2024-06-10', type012: '-', type013: '2024-08-04', type014: '', },
        { dropIssue: false, index: 5658, type01: '경기', type02: '오산시', type03: '50년공임 ', type04: '오산운암6단지 50년공공임대주택 예비자 모집', type05: '오산운암6', type06: '2024-04-15', type07: '2024-04-25', type08: '2024-05-22', type09: '2024-05-09', type010: '-', type011: '2024-05-10', type012: '2024-05-14', type013: '2024-06-24', type014: '', },
        { dropIssue: false, index: 5659, type01: '경기', type02: '남양주시', type03: '통합공공임대', type04: '남양주별내 A1-1(별내 별해임)통합공공임대주택 예비입주자', type05: '남양주별내 A1-1BL', type06: '2024-03-14', type07: '2024-03-26', type08: '2024-03-28', type09: '2024-04-01', type010: '-', type011: '2024-04-02', type012: '2024-04-09', type013: '2024-06-28', type014: '변경', },
        { dropIssue: false, index: 5660, type01: '경기', type02: '파주시', type03: '국민임대', type04: '파주시 국민임대 예비입주자 모집', type05: '파주운정별하람', type06: '2024-05-07', type07: '2024-05-28', type08: '2024-05-30', type09: '2024-06-07', type010: '-', type011: '2024-06-10', type012: '2024-06-12', type013: '2024-09-13 (17:50)', type014: '', },
        { dropIssue: false, index: 5661, type01: '경기', type02: '수원시', type03: '신혼희망', type04: '부천원종 B2블록 신혼희망타운(공공분양) 잔여세대', type05: '부천원종 B2블록', type06: '2024-06-18', type07: '2024-06-28', type08: '-', type09: '-', type010: '-', type011: '2024-06-10', type012: '-', type013: '2024-08-04', type014: '', },
      ],
      // 상태 컬러
      STAT_LIST: [
        { code: '취소공고', value: 'is-txt-red'},
        { code: '변경', value: 'is-txt-blue'},
      ],
      detailList: [
        { title: '수정', icon: 'edit'},
        { title: '삭제', icon: 'trash'},
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