<template>
  <div>
    <!-- sub top -->
    <div class="pl-form-inline-wrap pl-card-body py-3">
      <div class="pl-form-inline">
        <span class="pl-label">
          조회 연도
        </span>
        <div class="pl-desc">
          <v-select
            v-model="SRCH_YEAR"
            :items="DROP_YEAR_LIST"
            class="pl-form type-middle is-sm"
          ></v-select>
          <v-select
            v-model="SRCH_MONTH"
            :items="DROP_MONTH_LIST"
            class="pl-form type-middle is-xs"
          ></v-select>
        </div>
      </div>
      <div>
        <v-btn
          class="pl-btn is-icon"
          @click="clickSearchBtn"
          >
          <span class="pl-icon20 search"></span>
          조회
        </v-btn>
        <compo-tooltip-btn
          TitleProp="새로고침"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 refresh"
          TooltipPositionProp="bottom"
          @btnClick="clickResetBtn"
        ></compo-tooltip-btn>
      </div>
    </div>
      <div class="is-border-top "></div>
      <div class="pl-card-body pl-scroll-body pb-4" style="height: calc(100vh - 248px)">
        <!-- sub content -->
        <template v-for="(key, index) in items">
          <!-- grid 1 -->
          <div :class="index > 0 ? 'is-mt-m' : ''">
            <!-- grid top -->
            <div class="pl-grid-top pt-2">
              <div class="pl-grid-top-left spacing-wrap sp-16">
                <strong class="pl-bullet-txt is-blue">({{ key }}) 귀책민원 누적</strong>
              </div>
              <div class="pl-grid-top-utils">
                <!-- 엑셀 다운로드 버튼 -->
                <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="excelHeaders"
                  :DataBodyProp="list"
                  FileNameProp="귀책민원 누적"
                  SheetNameProp="귀책민원 누적"
                  :isMulti="true"
                  v-if="index == 0"
                />
              </div>
            </div>
            <!-- grid -->
            <v-data-table
              class="pl-grid is-mt-s "
              :headers="headers"
              :items="itemsObjt[key]"
              fixed-header
              item-key="ROW_NUM"
              height="270px"
              disable-pagination
              hide-default-header
              hide-default-footer
              no-data-text="등록된 데이터가 없습니다."
              >
              <template v-slot:header>
                <thead class="v-data-table-header multi-row">
                  <tr>
                    <th rowspan="2" width="10%" class="text-center"><span>구분</span></th>
                    <th colspan="7" width="" class="text-center"><span>일반귀책 누적현황 </span></th>
                    <th rowspan="2" width="10%" class="text-center"><span>합계</span></th>
                  </tr>
                  <tr>
                    <th class="text-center"><span>1회</span></th>
                    <th class="text-center"><span>2회</span></th>
                    <th class="text-center"><span>3회</span></th>
                    <th class="text-center"><span>4회</span></th>
                    <th class="text-center"><span>5회</span></th>
                    <th class="text-center"><span>6회</span></th>
                    <th class="text-center"><span>6회 초과</span></th>
                  </tr>
                </thead>
              </template>
              <template v-slot:item="{ item, index }">
                <tr :class="mixin_getItemClass(item)">
                  <td :class="`${item.cellClass || ''} text-center`">{{ item.CENTER_NM }}</td>
                  <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'CNT1')">{{ item.CNT1 }}</td>
                  <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'CNT2')">{{ item.CNT2 }}</td>
                  <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'CNT3')">{{ item.CNT3 }}</td>
                  <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'CNT4')">{{ item.CNT4 }}</td>
                  <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'CNT5')">{{ item.CNT5 }}</td>
                  <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'CNT6')">{{ item.CNT6 }}</td>
                  <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'CNT7')">{{ item.CNT7 }}</td>
                  <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'TOT_CNT')">{{ item.TOT_CNT }}</td>
                </tr>
              </template>
            </v-data-table>
          </div>
        </template>
      </div>
      <!-- dialog: 상세 -->
      <v-dialog
        v-if="dialogDetail"
        v-model="dialogDetail"
        content-class="dialog-draggable"
        overlay-color="rgba(0,0,0,0)"
        width="800px"
        >
        <div class="draggable-area">drag area</div>
        <compo-dialog
          header-title="귀책민원 누적 현황 상세"
          @hide="mixin_hideDialog('Detail')"
          @submit="submitDialog('Detail')"
        >
          <template slot="body">
            <CTM_M0300_TAB_02_DIALOG :propsData="propsData"/>
          </template>
        </compo-dialog>
      </v-dialog>
  </div>
</template>

<script>
import CTM_M0300_TAB_02_DIALOG from '@/views/page/CTM_M0300_TAB_02_DIALOG';

export default {
  name: 'CTM_M0300_TAB_04', //귀책민원 누적
  components: {
    CTM_M0300_TAB_02_DIALOG,
  },
  data() {
    return {
      // grid
      headers: [
        { text: '센터', value: 'CENTER_NM', align: 'center', width: '150px', sortable: false },
        { text: '1회', value: 'CNT1', align: 'center', width: '70px',sortable: false },
        { text: '2회', value: 'CNT2', align: 'center', width: '70px',sortable: false },
        { text: '3회', value: 'CNT3', align: 'center', width: '70px',sortable: false },
        { text: '4회', value: 'CNT4', align: 'center', width: '70px',sortable: false },
        { text: '5회', value: 'CNT5', align: 'center', width: '70px',sortable: false },
        { text: '6회', value: 'CNT6', align: 'center', width: '70px',sortable: false },
        { text: '6회 초과', value: 'CNT7', align: 'center', width: '70px',sortable: false },
        { text: '합계', value: 'TOT_CNT', align: 'center', width: '90px', sortable: true },
      ],
      items: [],
      list:[],
      itemsObjt:{},
      loading: false,

      excelHeaders:[
        [
          { text: '구분', value: 'REG_YM_TEXT', align: 'center', width: '100px', rowspan: 1},
          { text: '센터', value: 'CENTER_NM', align: 'center', rowspan: 1},
          { text: '일반귀책 누적현황', value: 'CNT1', align: 'center', colspan: 6},
          { text: '', value: 'CNT2', align: 'center'},
          { text: '', value: 'CNT3', align: 'center'},
          { text: '', value: 'CNT4', align: 'center'},
          { text: '', value: 'CNT5', align: 'center'},
          { text: '', value: 'CNT6', align: 'center'},
          { text: '', value: 'CNT7', align: 'center'},
          { text: '합계', value: 'TOT_CNT', align: 'center', rowspan: 1},
        ],
        [
          { text: '구분', value: 'REG_YM_TEXT', align: 'center', width: '100px'},
          { text: '센터', value: 'CENTER_NM', align: 'center', width: '170px'},
          { text: '1회', value: 'CNT1', align: 'center', width: '80px',sortable: false },
          { text: '2회', value: 'CNT2', align: 'center', width: '80px',sortable: false },
          { text: '3회', value: 'CNT3', align: 'center', width: '80px',sortable: false },
          { text: '4회', value: 'CNT4', align: 'center', width: '80px',sortable: false },
          { text: '5회', value: 'CNT5', align: 'center', width: '80px',sortable: false },
          { text: '6회', value: 'CNT6', align: 'center', width: '80px',sortable: false },
          { text: '6회 초과', value: 'CNT7', align: 'center', width: '80px',sortable: false },
          { text: '합계', value: 'TOT_CNT', align: 'center', width: '80px', sortable: true },
        ]
      ],

      DROP_YEAR_LIST: [],
      DROP_MONTH_LIST:[
        {text:"전체", value:""}
        , { text: "1월", value: "01"}
        , { text: "2월", value: "02"}
        , { text: "3월", value: "03"}
        , { text: "4월", value: "04"}
        , { text: "5월", value: "05"}
        , { text: "6월", value: "06"}
        , { text: "7월", value: "07"}
        , { text: "8월", value: "08"}
        , { text: "9월", value: "09"}
        , { text: "10월", value: "10"}
        , { text: "11월", value: "11"}
        , { text: "12월", value: "12"}
      ],
      SRCH_YEAR: this.$moment().format("YYYY"),
      SRCH_MONTH: "",

      dialogDetail: false,
      propsData:{},
    }
  },
  methods: {
    clickSearchBtn(){
      if(this.mixin_isEmpty(this.SRCH_YEAR)){
        this.showAlertInfo({msg:"조회 연도를 선택해주세요."});
        return;
      }

      this.items = [];
      this.itemsObjt = {};
      this.selectStatsCvlcptCusl();
    },

    clickResetBtn(){
      this.SRCH_YEAR = this.$moment().format("YYYY");
      this.SRCH_MONTH = "";
      this.clickSearchBtn();
    },

    async selectStatsCvlcptCusl(){
      this.list = [];

      let sUrl = '/api/biz/common/select/selectStatsCvlcptCusl'
      let postParam = {
        SRCH_YEAR: this.SRCH_YEAR
        , SRCH_MONTH: this.SRCH_MONTH
      };

      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper"
          , sn : "selectStatsCvlcptCusl"
        }
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.list = response.DATA.map(row=>{
          if(row.STATS_TYPE == "MID") row.cellClass = 'is-bg-th font-weight-bold ';
          else if(row.STATS_TYPE == "SUB") row.cellClass = 'is-bg-light font-weight-bold';
          for(let key in row){
            // 0을 공백을 치환
            if(key.indexOf("CNT") > -1) row[key] = (row[key]+" 명");
          }

          row.REG_YM_TEXT = this.$moment(row.REG_YM, 'YYYYMM').format("YYYY-MM");
          return row;
        });

        if(this.mixin_isEmpty(this.SRCH_MONTH)){
          for(let i in this.DROP_MONTH_LIST){
            if(this.DROP_MONTH_LIST[i].value != ""){
              this.itemsObjt[this.SRCH_YEAR+"년 "+this.DROP_MONTH_LIST[i].text] = this.list.filter(row=>{return row.REG_YM  == (this.SRCH_YEAR+this.DROP_MONTH_LIST[i].value)});
            }
          }
        }else{
          this.itemsObjt[this.SRCH_YEAR+"년 "+this.SRCH_MONTH+"월"] = this.list;
        }

        this.$nextTick(() => {
          this.items = Object.keys(this.itemsObjt);
        });
      }
    },

    async selectCvlcptYear(){
      let sUrl = '/api/biz/common/select/selectCvlcptYear'
      let postParam = {};

      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper"
          , sn : "selectCvlcptYear"
        }
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.DROP_YEAR_LIST = response.DATA.map(row=>{
          row.value = row.YR;
          row.text = row.YR_TEXT;
          return row;
        });
      }

      if(this.DROP_YEAR_LIST.length <= 0){
        this.DROP_YEAR_LIST = [{text: this.$moment().format("YYYY")+"년", value:this.$moment().format("YYYY")}];
      }
    },

    showDetail(item, key){
      // console.log("item ::: ", item);
      if(item.STATS_TYPE != "NORMAL") return;
      if(this.mixin_isEmpty(item[key]) || item[key] == "0") return;
      this.propsData = {
        SRCH_CUSTCO_ID: item.CUSTCO_ID
        , SRCH_REG_YM: item.REG_YM
        , SRCH_TYPE: "CUSL"
        , SRCH_KEY: key
      }

      this.dialogDetail = true;
    },
  },
  async mounted() {
    this.selectCvlcptYear();
    this.clickSearchBtn();
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