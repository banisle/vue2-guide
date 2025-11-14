<template>
  <div class="pl-card pl-scroll-body" style="height: 740px;">
    <div >
      <strong class="pl-bullet-txt is-blue">기타 상담 현황</strong>
      <!-- <v-data-table
        class="pl-grid is-mt-s is-no-hover"
        :headers="gridDataHeaders"
        :items="DAY_TASK_ETC"
        fixed-header
        item-key="ROW_NUM"
        height="240PX"
        disable-pagination
        hide-default-footer
        no-data-text="등록된 데이터가 없습니다.">
        <template v-slot:item="{ item, index }">
          <tr v-if="index == 0">
            <td class="text-center"><strong>{{ item.CUTT_SE_CD_NM }}</strong></td>
            <td class="text-center">
              <v-text-field
                class="pl-form text-center"
                v-model="item.CUTT_CNT"
                v-if="item.USE_YN == 'Y'"
                :readonly="DAY_TASK.LAST_RPT_YN == 'Y' || isPreview"
                oninput="this.value=this.value.replace(/[^0-9]/g,'')"
              />
              <v-text-field
                class="pl-form text-center"
                disabled
                value="해당 없음"
                v-else
              />
            </td>
            <td class="has-textarea py-2" :rowspan="DAY_TASK_ETC.length">
              <v-textarea
                class="pl-form is-noresize"
                style="height: 100%"
                v-model="DAY_TASK.ETC_CUTT_RMRK"
                :spellcheck="false"
                v-byte-counter="4000"
                :readonly="DAY_TASK.LAST_RPT_YN == 'Y' || isPreview"
              />
            </td>
          </tr>
          <tr v-else>
            <td class="text-center"><strong>{{ item.CUTT_SE_CD_NM }}</strong></td>
            <td class="text-center">
              <v-text-field
                class="pl-form text-center"
                v-model="item.CUTT_CNT"
                v-if="item.USE_YN == 'Y'"
                :readonly="DAY_TASK.LAST_RPT_YN == 'Y' || isPreview"
              />
              <v-text-field
                class="pl-form text-center"
                disabled
                value="해당 없음"
                v-else
              />
            </td>
          </tr>
        </template>
      </v-data-table> -->

      <!-- table -->
      <table class="pl-tbl-detail is-mt-s">
        <colgroup>
          <col width="120px">
          <col width="120px">
        </colgroup>
        <thead>
          <tr>
            <th >구분</th>
            <th >상담 건</th>
            <th >비고</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in DAY_TASK_ETC">
            <tr v-if="index == 0">
              <td class="text-center"><strong>{{ item.CUTT_SE_CD_NM }}</strong></td>
              <td class="text-center">
                <v-text-field
                  class="pl-form text-center"
                  v-model="item.CUTT_CNT"
                  v-if="item.USE_YN == 'Y'"
                  :readonly="DAY_TASK.LAST_RPT_YN == 'Y' || isPreview"
                  oninput="this.value=this.value.replace(/[^0-9]/g,'')"
                />
                <v-text-field
                  class="pl-form text-center"
                  disabled
                  value="해당 없음"
                  v-else
                />
              </td>
              <td class="has-textarea" :rowspan="DAY_TASK_ETC.length">
                <v-textarea
                  class="pl-form is-noresize"
                  style="height: 100%"
                  v-model="DAY_TASK.ETC_CUTT_RMRK"
                  :spellcheck="false"
                  v-byte-counter="4000"
                  :readonly="DAY_TASK.LAST_RPT_YN == 'Y' || isPreview"
                />
              </td>
            </tr>
            <tr v-else>
              <td class="text-center"><strong>{{ item.CUTT_SE_CD_NM }}</strong></td>
              <td class="text-center">
                <v-text-field
                  class="pl-form text-center"
                  v-model="item.CUTT_CNT"
                  v-if="item.USE_YN == 'Y'"
                  :readonly="DAY_TASK.LAST_RPT_YN == 'Y' || isPreview"
                />
                <v-text-field
                  class="pl-form text-center"
                  disabled
                  value="해당 없음"
                  v-else
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="is-mt-l">
      <strong class="pl-bullet-txt is-blue">상담 이슈 현황</strong>
      <!-- table -->
      <table class="pl-tbl-detail is-mt-s">
        <colgroup>
        </colgroup>
        <thead>
          <tr>
            <th >이슈 사항</th>
            <th >자체 대응 사항</th>
            <th >익일 또는 차주 상담 이슈 예측 사항</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="has-textarea">
              <v-textarea
                class="pl-form is-noresize"
                style="height: 100%"
                auto-grow
                v-model="DAY_TASK.CUTT_EXCPTNMTTR1"
                :spellcheck="false"
                v-byte-counter="4000"
                :readonly="DAY_TASK.LAST_RPT_YN == 'Y' || isPreview"
              />
            </td>
            <td class="has-textarea">
              <v-textarea
                class="pl-form is-noresize"
                style="height: 100%"
                auto-grow
                v-model="DAY_TASK.CUTT_EXCPTNMTTR2"
                :spellcheck="false"
                v-byte-counter="4000"
                :readonly="DAY_TASK.LAST_RPT_YN == 'Y' || isPreview"
              />
            </td>
            <td class="has-textarea">
              <v-textarea
                class="pl-form is-noresize"
                style="height: 100%"
                auto-grow
                v-model="DAY_TASK.CUTT_EXCPTNMTTR3"
                :spellcheck="false"
                v-byte-counter="4000"
                :readonly="DAY_TASK.LAST_RPT_YN == 'Y' || isPreview"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="is-mt-l">
      <strong class="pl-bullet-txt is-blue">민원(VOC)현황</strong>
      <!-- table -->
      <table class="pl-tbl-detail is-mt-s">
        <colgroup>
          <col width="90px">
          <col width="90px">
          <col width="90px">
          <col width="150px">
          <col width="80px">
          <col width="80px">
          <col width="110px">
        </colgroup>
        <thead>
          <tr>
            <th colspan="5">민원(VOC) 현황</th>
            <th colspan="3">진행 사항 및 처리 결과</th>
          </tr>
          <tr>
            <th class="is-bg-light">민원유형</th>
            <th class="is-bg-light" colspan="3">민원유형</th>
            <th class="is-bg-light">종결여부</th>
            <th class="is-bg-light">통화자</th>
            <th class="is-bg-light">당일 OB 횟수</th>
            <th class="is-bg-light">진행 사항</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="CVLCPT_LIST.length > 0">
            <template v-for="item in CVLCPT_LIST">
              <!-- <tr>
                <th class="is-bg-light is-bold text-center">민원유형</th>
                <th class="is-bg-light is-bold text-center" colspan="3">민원유형</th>
                <th class="is-bg-light is-bold text-center">종결여부</th>
                <th class="is-bg-light is-bold text-center">통화자</th>
                <th class="is-bg-light is-bold text-center">당일 OB 횟수</th>
                <th class="is-bg-light is-bold text-center">진행 사항</th>
              </tr> -->
              <tr>
                <td class="text-center">{{ item.CVLCPT_SE_CD_NM }}</td>
                <td class="text-center">{{ item.CVLCPT_CLSF_NM0 }}</td>
                <td class="text-center">{{ item.CVLCPT_CLSF_NM1 }}</td>
                <td class="text-center">{{ item.CVLCPT_CLSF_NM2 }}</td>
                <td class="text-center">{{ item.PRGRS_STTS_CD_NM }}</td>
                <td class="text-center">부팀장</td>
                <td class="text-center">{{ item.TMLD_OUT_CNT }}</td>
                <td class="text-center" v-html="item.TMLD_CUTT_CN"></td>
              </tr>
              <tr>
                <td
                  class="has-textarea"
                  colspan="5"
                  rowspan="3"
                  style="vertical-align: top;"
                  >
                  <strong>- 민원 접수일 </strong>: {{ item.REG_DT }}<br>
                  <strong>- 민원 상담일</strong> : {{ item.CUTT_DT }}<br>
                  <strong>- 상담사 </strong>: {{item.RCPT_USER_NM}}({{ item.RCPT_DEPT_NM }})<br> 
                  <strong>- 민원인 </strong>: {{item.CUST_NM}}({{ mixin_setPhoneNo(item.CUST_PHN_NO) }})<br> 
                  <strong>[민원 내용]</strong><br> 
                  <div class="has-textarea" style="white-space: pre-line; word-break: break-all;" v-html="item.CVLCPT_CN"></div>
                </td>
                <td class="text-center">팀장</td>
                <td class="text-center">{{ item.AMLD_OUT_CNT }}</td>
                <td class="has-textarea" style="white-space: pre-line; word-break: break-all;" v-html="item.AMLD_CUTT_CN"></td>
              </tr>
              <tr>
                <td class="text-center">센터장</td>
                <td class="text-center">{{ item.MAGR_OUT_CNT }}</td>
                <td class="has-textarea" style="white-space: pre-line; word-break: break-all;" v-html="item.MAGR_CUTT_CN"></td>
              </tr>
              <tr>
                <td class="has-textarea" style="white-space: pre-line; word-break: break-all;" colspan="3" v-html="item.PRCS_RSLT_CN"></td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="8">
                <div class="pl-list-nodata">
                  <span>등록된 데이터가 없습니다.</span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CSM_M0200_DIALOG_TAB_02', //상담이슈 사항
  components: {
  },
  props:{
    DAY_TASK:{ 
      type: Object,
      default: {}
    },

    DAY_TASK_ETC:{ 
      type: Array,
      default: () => []
    },

    CVLCPT_LIST:{
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
      gridDataHeaders: [
        { text: '구분', value: 'CUTT_SE_CD_NM', align: 'center', width: '120px', sortable: false },
        { text: '상담건', value: 'CUTT_CNT', align: 'center', width: '120px', sortable: false },
        { text: '비고', value: 'ETC_CUTT_RMRK', align: 'center', width: '', sortable: false },
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