<template>
  <div class="pl-card pl-scroll-body" style="height: 740px;">
    <div>
      <strong class="pl-bullet-txt is-blue">인원 현황</strong>
      <!-- table -->

      <!-- grid -->
      <!-- <v-data-table
        class="pl-grid is-mt-s is-no-hover"
        :headers="gridDataHeaders1"
        :items="EMP_CNT_LIST"
        fixed-header
        item-key="ROW_NUM"
        height="210PX"
        disable-pagination
        hide-default-header
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다.">
        <template v-slot:header="{ props }">
          <thead class="v-data-table-header multi-row">
            <tr>
              <th colspan="5" class="text-center" width="35%">관리자</th>
              <th colspan="7" class="text-center" width="65%">상담직원</th>
            </tr>
            <tr>
              <th class="text-center">현원</th>
              <th class="text-center">휴직인원</th>
              <th class="text-center">재직인원</th>
              <th class="text-center">휴가인원</th>
              <th class="text-center">근무인원</th>
              <th class="text-center">구분</th>
              <th class="text-center">현원</th>
              <th class="text-center">휴직인원</th>
              <th class="text-center">재직인원</th>
              <th class="text-center">휴가인원</th>
              <th class="text-center">근무인원</th>
              <th class="text-center">총인원</th>
            </tr>
          </thead>
        </template>
        <template v-slot:item="{ item, index }">
          <tr v-if="index == 0">
            <td class="text-center is-bg-light" :rowspan="EMP_CNT_LIST.length"><strong>{{ item.MGR_TOT_EMP_CNT }}</strong></td>
            <td class="text-center" :rowspan="EMP_CNT_LIST.length">{{ item.MGR_LOA_EMP_CNT }}</td>
            <td class="text-center" :rowspan="EMP_CNT_LIST.length">{{ item.MGR_WORK_EMP_CNT }}</td>
            <td class="text-center" :rowspan="EMP_CNT_LIST.length">{{ item.MGR_HLDY_EMP_CNT }}</td>
            <td class="text-center" :rowspan="EMP_CNT_LIST.length">{{ item.MGR_WORKING_EMP_CNT }}</td>
            <td class="text-center"><strong>{{ item.DUTY_GROUP_CD_NM }}</strong></td>
            <td class="text-center is-bg-light"><strong>{{ item.TOT_EMP_CNT }}</strong></td>
            <td class="text-center"><strong>{{ item.LOA_EMP_CNT }}</strong></td>
            <td class="text-center"><strong>{{ item.WORK_EMP_CNT }}</strong></td>
            <td class="text-center"><strong>{{ item.HLDY_EMP_CNT }}</strong></td>
            <td class="text-center is-bg-light"><strong>{{ item.WORKING_EMP_CNT }}</strong></td>
            <td class="text-center":rowspan="EMP_CNT_LIST.length"><strong>{{ item.TOT_CNT }}</strong></td>
          </tr>
          <tr v-else>
            <td class="text-center">{{ item.DUTY_GROUP_CD_NM }}</td>
            <td class="text-center is-bg-light">{{ item.TOT_EMP_CNT }}</td>
            <td class="text-center">{{ item.LOA_EMP_CNT }}</td>
            <td class="text-center">{{ item.WORK_EMP_CNT }}</td>
            <td class="text-center">{{ item.HLDY_EMP_CNT }}</td>
            <td class="text-center is-bg-light">{{ item.WORKING_EMP_CNT }}</td>
          </tr>
        </template>
      </v-data-table> -->
      <table class="pl-tbl-detail is-mt-s">
        <thead>
          <tr>
            <th colspan="5">관리자</th>
            <th colspan="7">상담직원</th>
          </tr>
          <tr>
            <th>현원</th>
            <th>휴직인원</th>
            <th>재직인원</th>
            <th>휴가인원</th>
            <th>근무인원</th>
            <th>구분</th>
            <th>현원</th>
            <th>휴직인원</th>
            <th>재직인원</th>
            <th>휴가인원</th>
            <th>근무인원</th>
            <th>총인원</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in EMP_CNT_LIST">
            <tr v-if="index == 0">
              <td class="text-center is-bg-light" :rowspan="EMP_CNT_LIST.length"><strong>{{ item.MGR_TOT_EMP_CNT }}</strong></td>
              <td class="text-center" :rowspan="EMP_CNT_LIST.length">{{ item.MGR_LOA_EMP_CNT }}</td>
              <td class="text-center" :rowspan="EMP_CNT_LIST.length">{{ item.MGR_WORK_EMP_CNT }}</td>
              <td class="text-center" :rowspan="EMP_CNT_LIST.length">{{ item.MGR_HLDY_EMP_CNT }}</td>
              <td class="text-center" :rowspan="EMP_CNT_LIST.length">{{ item.MGR_WORKING_EMP_CNT }}</td>
              <td class="text-center"><strong>{{ item.DUTY_GROUP_CD_NM }}</strong></td>
              <td class="text-center is-bg-light"><strong>{{ item.TOT_EMP_CNT }}</strong></td>
              <td class="text-center"><strong>{{ item.LOA_EMP_CNT }}</strong></td>
              <td class="text-center"><strong>{{ item.WORK_EMP_CNT }}</strong></td>
              <td class="text-center"><strong>{{ item.HLDY_EMP_CNT }}</strong></td>
              <td class="text-center is-bg-light"><strong>{{ item.WORKING_EMP_CNT }}</strong></td>
              <td class="text-center":rowspan="EMP_CNT_LIST.length"><strong>{{ item.TOT_CNT }}</strong></td>
            </tr>
            <tr v-else>
              <td class="text-center">{{ item.DUTY_GROUP_CD_NM }}</td>
              <td class="text-center is-bg-light">{{ item.TOT_EMP_CNT }}</td>
              <td class="text-center">{{ item.LOA_EMP_CNT }}</td>
              <td class="text-center">{{ item.WORK_EMP_CNT }}</td>
              <td class="text-center">{{ item.HLDY_EMP_CNT }}</td>
              <td class="text-center is-bg-light">{{ item.WORKING_EMP_CNT }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="is-mt-l">
      <strong class="pl-bullet-txt is-blue">휴/복직 및 단축근무 현황</strong>
      
      <!-- <v-data-table
        class="pl-grid is-mt-s is-no-hover"
        :headers="gridDataHeaders2"
        :items="EMP_WORK_LIST"
        fixed-header
        item-key="ROW_NUM"
        height="240PX"
        disable-pagination
        hide-default-header
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다.">
        <template v-slot:header="{ props }">
          <thead class="v-data-table-header multi-row">
            <tr>
              <th colspan="5" class="text-center" width="40%">휴직 현황</th>
              <th colspan="7" class="text-center" width="60%">단축근무 현황</th>
            </tr>
            <tr>
              <th class="text-center">구분</th>
              <th class="text-center">성명</th>
              <th class="text-center">소속</th>
              <th class="text-center">시작일</th>
              <th class="text-center">종료일</th>
              <th class="text-center">구분</th>
              <th class="text-center">성명</th>
              <th class="text-center">소속</th>
              <th class="text-center">시작일</th>
              <th class="text-center">종료일</th>
              <th class="text-center">근무시간</th>
              <th class="text-center">비고</th>
            </tr>
          </thead>
        </template>
      </v-data-table> -->
      
      <!-- table -->
      <table class="pl-tbl-detail is-mt-s">
        <thead>
          <tr>
            <th colspan="5">휴직 현황</th>
            <th colspan="7">단축근무 현황</th>
          </tr>
          <tr>
            <th>구분</th>
            <th>성명</th>
            <th>소속</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>구분</th>
            <th>성명</th>
            <th>소속</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>근무시간</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="EMP_WORK_LIST.length > 0">
            <template v-for="(item, index) in EMP_WORK_LIST" >
              <tr>
                <td class="text-center ">{{item.WKATTD_ARTCL_NM}}</td>
                <td class="text-center ">{{item.HLDY_USER_NM}}</td>
                <td class="text-center ">{{item.HLDY_DEPT_NM}}</td>
                <td class="text-center ">{{item.HLDY_BGNG_YMD}}</td>
                <td class="text-center ">{{item.HLDY_END_YMD}}</td>
                <td class="text-center ">{{item.SHORT_WORK_TYPE_CD_NM}}</td>
                <td class="text-center ">{{item.SW_USER_NM}}</td>
                <td class="text-center ">{{item.SW_DEPT_NM}}</td>
                <td class="text-center ">{{item.WORK_BGNG_YMD}}</td>
                <td class="text-center ">{{item.WORK_END_YMD}}</td>
                <td class="text-center ">{{item.ATDC_LVWK_HR}}</td>
                <td class="text-center ">{{item.SHORT_WORK_HR_CD_NM}}</td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="12">
                <div class="pl-list-nodata">
                  <span>등록된 데이터가 없습니다.</span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="is-mt-l">
      <strong class="pl-bullet-txt is-blue">근무인원 이슈 및 참고사항</strong>
      <!-- table -->
      <div class="is-mt-s">
        <v-textarea
          class="pl-form is-noresize"
          v-model="DAY_TASK.WKATTD_EXCPTNMTTR"
          v-byte-counter="4000"
          :spellcheck="false"
          :readonly="DAY_TASK.LAST_RPT_YN == 'Y' || isPreview"
        />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CSM_M0200_DIALOG_TAB_01', //근무 현황
  components: {
  },
  props:{
    DAY_TASK:{ 
      type: Object,
      default: {}
    },

    EMP_CNT_LIST:{ 
      type: Array,
      default: () => []
    },

    EMP_WORK_LIST:{ 
      type: Array,
      default: () => []
    },

    isPreview:{
      type:Boolean,
      default: false,
    },
  },
  data() {
    return {
      gridDataHeaders1: [
        { text: '현원', value: 'MGR_TOT_EMP_CNT', align: 'center', width: '', sortable: false },
        { text: '휴직인원', value: 'MGR_LOA_EMP_CNT', align: 'center', width: '', sortable: false },
        { text: '재직인원', value: 'MGR_WORK_EMP_CNT', align: 'center', width: '', sortable: false },
        { text: '휴가인원', value: 'MGR_HLDY_EMP_CNT', align: 'center', width: '', sortable: false },
        { text: '근무인원', value: 'MGR_WORKING_EMP_CNT', align: 'center', width: '', sortable: false },
        { text: '구분', value: 'DUTY_GROUP_CD_NM', align: 'center', width: '', sortable: false },
        { text: '현원', value: 'TOT_EMP_CNT', align: 'center', width: '', sortable: false },
        { text: '휴직인원', value: 'LOA_EMP_CNT', align: 'center', width: '', sortable: false },
        { text: '재직인원', value: 'WORK_EMP_CNT', align: 'center', width: '', sortable: false },
        { text: '휴가인원', value: 'HLDY_EMP_CNT', align: 'center', width: '', sortable: false },
        { text: '근무인원', value: 'WORKING_EMP_CNT', align: 'center', width: '', sortable: false },
        { text: '총인원', value: 'WORKING_EMP_CNT', align: 'center', width: '', sortable: false },
      ],

      gridDataHeaders2: [
        { text: '구분', value: 'WKATTD_ARTCL_NM', align: 'center', width: '', sortable: false },
        { text: '성명', value: 'HLDY_USER_NM', align: 'center', width: '', sortable: false },
        { text: '소속', value: 'HLDY_DEPT_NM', align: 'center', width: '', sortable: false },
        { text: '시작일', value: 'HLDY_BGNG_YMD', align: 'center', width: '', sortable: false },
        { text: '종료일', value: 'HLDY_END_YMD', align: 'center', width: '', sortable: false },
        { text: '구분', value: 'SHORT_WORK_TYPE_CD_NM', align: 'center', width: '', sortable: false },
        { text: '성명', value: 'SW_USER_NM', align: 'center', width: '', sortable: false },
        { text: '소속', value: 'SW_DEPT_NM', align: 'center', width: '', sortable: false },
        { text: '시작일', value: 'WORK_BGNG_YMD', align: 'center', width: '', sortable: false },
        { text: '종료일', value: 'WORK_END_YMD', align: 'center', width: '', sortable: false },
        { text: '근무시간', value: 'ATDC_LVWK_HR', align: 'center', width: '', sortable: false },
        { text: '비고', value: 'SHORT_WORK_HR_CD_NM', align: 'center', width: '', sortable: false },
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