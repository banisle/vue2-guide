<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <div class="pl-card-body py-3">
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left">
            <div class="pl-form-inline">
              <div class="pl-desc">
                <compo-date-range-picker
                    :StartDayProp.sync="SRCH_LOG_TOP.START_DATE"
                    :EndDayProp.sync="SRCH_LOG_TOP.END_DATE"
                    @startDayChange="mixin_testLog(SRCH_LOG_TOP.START_DATE);SRCH_LOG_TOP.DATA_TYPE_RADIO='C'"
                    @endDayChange="mixin_testLog(SRCH_LOG_TOP.END_DATE);SRCH_LOG_TOP.DATA_TYPE_RADIO='C'"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <v-radio-group row class="pl-radio-group" v-model="SRCH_LOG_TOP.DATA_TYPE_RADIO" @change="chageDataTypeRadio">
                <v-radio class="pl-radio" value="C">
                  <template v-slot:label>지정일</template>
                </v-radio>
                <v-radio class="pl-radio" value="T">
                  <template v-slot:label>당일</template>
                </v-radio>
                <v-radio class="pl-radio" value="B">
                  <template v-slot:label>전일</template>
                </v-radio>
                <v-radio class="pl-radio" value="W">
                  <template v-slot:label>일주일</template>
                </v-radio>
              </v-radio-group>
            </div>
            <div class="pl-form-inline">
              <div class="pl-desc">

                <v-select
                    class="pl-form is-auto type-middle"
                    :items="list_quartz_job"
                    placeholder="선택하세요"
                    v-model="SRCH_LOG_TOP.SRCH_JOB_NAME"
                ></v-select>

              </div>
            </div>
            <div class="pl-form-inline">
              <div>
                <v-btn class="pl-btn is-icon" @click="getQuartzLogList">
                  <span class="pl-icon20 search"></span>조회
                </v-btn>
              </div>
            </div>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1">({{ items.length }})</em> 건</span>
            <compo-tooltip-btn
                TitleProp="새로고침"
                ClassProp="pl-tooltip-btn"
                IconProp="pl-icon20 refresh"
                TooltipPositionProp="bottom"
                @btnClick="getQuartzLogList();">
            </compo-tooltip-btn>
          </div>
        </div>
      </div>
      <!-- sub content -->
      <div class="pl-card-body is-border-top">

        <v-data-table
            class="pl-grid is-mt-s"
            :headers="headers"
            :items="items"
            height="calc(-289px + 100vh)"
            single-select
            fixed-header
            item-key="ROW_NUMBER"
            hide-default-footer
            :items-per-page="-1"
            no-data-text="등록된 데이터가 없습니다."
        >
          <template v-slot:item.IS_ERROR="{item}">
            <span v-if="item.IS_ERROR == 'Y' ? true : false">
              <strong class="is-txt-red pl-value-txt">{{ item.IS_ERROR }}</strong>
            </span>
            <span v-if="item.IS_ERROR == 'N' ? true : false">
              {{ item.IS_ERROR }}
            </span>
          </template>

          <template v-slot:item.OUTPUT="{item}">
            <v-tooltip content-class="pl-tooltip bottom" bottom max-width="40%">
              <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" style="cursor: pointer;" @click="mixin_copyMessage(item.OUTPUT)">
                <span class="pl-icon20 document" v-if="item.OUTPUT != ''"></span>
              </span>
              </template>
              <span>{{ item.OUTPUT }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/store/apiUtil";
import moment from "moment/moment";

export default {
  components: {

  },
  data() {
    return {
      list_quartz_job : [],
      list_common_code : [],

      SRCH_LOG_TOP:{
        START_DATE: moment().format('YYYY-MM-DD'),          // 조회 - 시작일
        END_DATE : moment().format('YYYY-MM-DD'),            // 조회 - 종료일
        DATA_TYPE_RADIO: 'T',
        SRCH_JOB_NAME: '',
        SRCH_IS_ERROR: ''
      },

      nextDisabled:false,  //검색건수가 페이지 제한 건수보다 많을 때 사용하는 다음버튼
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center',  width: '80px',sortable : false },
        { text: '배치 ID', value: 'JOB_NAME', align: 'left', width: '300px',sortable : false},
        { text: '배치 이름', value: 'JOB_DESCRIPTION', align: 'left', sortable : false},
        { text: '차수', value: 'LOG_CNT', align: 'center', width: '60px',sortable : false },
        { text: '에러여부', value: 'IS_ERROR', align: 'center', width: '80px',sortable : false },
        { text: '전체건', value: 'ALL_CNT', align: 'center', width: '80px',sortable : false},
        { text: '경과시간(s)', value: 'PROC_SECONDS', align: 'center', width: '100px' ,sortable : false},
        { text: '비고', value: 'OUTPUT', align: 'center', width: '60px' ,sortable : false},
        { text: '실행일자', value: 'START_DD_DISP', align: 'center', width: '120px' ,sortable : false},
        { text: '조회조건', value: 'NOW_SRCH_DT', align: 'center', width: '140px' ,sortable : false},
        { text: '등록일시', value: 'REG_DT', align: 'center', width: '160px',sortable : false},
      ],
      items: [],
    }
  },

  watch: {
  },

  computed: {
  },

  beforeDestroy(){
  },

  async created() {
    let codeName = ['USE_WT'];
    this.list_common_code = await this.mixin_common_code_get_all(codeName);
    this.list_quartz_job = await this.select_quartz_job();
    this.getQuartzLogList();

  },

  mounted() {
  },

  methods: {
    async chageDataTypeRadio() {
      // C:지정일, T:당일, B:전일, W:일주일전.
      console.log( this.SRCH_LOG_TOP.DATA_TYPE_RADIO );
      if( this.SRCH_LOG_TOP.DATA_TYPE_RADIO == 'T' ) {
        this.SRCH_LOG_TOP.START_DATE = moment().format('YYYY-MM-DD');
        this.SRCH_LOG_TOP.END_DATE = moment().format('YYYY-MM-DD');
      }else if( this.SRCH_LOG_TOP.DATA_TYPE_RADIO == 'B' ) {
        this.SRCH_LOG_TOP.START_DATE = moment().subtract(1,'d').format('YYYY-MM-DD');
        this.SRCH_LOG_TOP.END_DATE = moment().subtract(1,'d').format('YYYY-MM-DD');
      }else if( this.SRCH_LOG_TOP.DATA_TYPE_RADIO == 'W' ) {
        this.SRCH_LOG_TOP.START_DATE = moment().subtract(1,'w').format('YYYY-MM-DD');
        this.SRCH_LOG_TOP.END_DATE = moment().format('YYYY-MM-DD');
      }
    },
    async getQuartzLogList() {

      let sUrl = '/batch-api/quartz/scheduler/selectLogs';
      let postParam = {
          srchStartDate: this.SRCH_LOG_TOP.START_DATE.replaceAll(/-/g, '')+'000000'
        , srchEndDate: this.SRCH_LOG_TOP.END_DATE.replaceAll(/-/g, '')+'235959'
        , srchJobName: this.SRCH_LOG_TOP.SRCH_JOB_NAME
      };

      let response  = await this.common_postCall(process.env.VUE_APP_BATCH_URL + sUrl, postParam, {});

      if (!response.HEADER.ERROR_FLAG){
        this.items = [];
        this.items = [...this.items, ...response.DATA];
      }
    },

    async select_quartz_job() {
      var responseData = [];
      const sUrl = '/batch-api/quartz/scheduler/listComboQuartzJobName';
      const postParam = {}
      const headParam = {}
      let response = await this.common_postCall(process.env.VUE_APP_BATCH_URL + sUrl, postParam, headParam );

      if (!response.HEADER.ERROR_FLAG){
        response.DATA.forEach((data, index) => {
          responseData.push({ text: data.JOB_NAME, value: data.JOB_NAME })
        });
        responseData.unshift({text:"전체",value:""});
      }

      return responseData;
    },
  },
}
</script>
