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
          <v-radio-group
            v-model="SRCH_TYPE"
            row
            class="pl-radio-group ml-2"
            @change="clickSearchBtn"
          >
            <v-radio class="pl-radio" label="월별" value="MONTH"></v-radio>
            <v-radio class="pl-radio" label="분기별" value="QUARTER"></v-radio>
          </v-radio-group>
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
      </div>

    </div>
    <!-- sub content -->
    <div class="is-border-top pl-card-body">
      <template v-if="SRCH_TYPE === 'MONTH'">
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left ">
            <strong class="pl-bullet-txt is-blue">{{ title }}</strong>
          </div>
          <div class="pl-grid-top-utils">
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="excelHeaders"
              :DataBodyProp="itemsRowSpan"
              :FileNameProp="fileName"
              SheetNameProp="대내외민원 누적"
              :isMulti="true"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-rowspan"
          :headers="headersRowSpan"
          :items="itemsRowSpan"
          fixed-header
          item-key="ROW_NUM"
          height="calc(-379px + 100vh)"
          disable-pagination
          hide-default-footer
          hide-default-header
          :loading="loading"
          loading-text="조회중입니다."
	        no-data-text="등록된 데이터가 없습니다."
        >
          <!-- header -->
          <template v-slot:header>
            <thead class="v-data-table-header multi-row">
              <tr>
                <th rowspan="3" width="80px" class="text-center"><span>구분</span></th>
                <th rowspan="3" width="150px" class="text-center"><span>센터</span></th>
                <th colspan="4" width="" class="text-center"><span>대내 접수 건(상담 센터 내)</span></th>
                <th colspan="6" width="" class="text-center"><span>대외 접수 건(공문 접수)</span></th>
                <th rowspan="3" width="" class="text-center"><span>합계</span></th>
              </tr>
              <tr>
                <th rowspan="2" width="" class="text-center"><span>오안내</span></th>
                <th rowspan="2" width="" class="text-center"><span>미흡안내</span></th>
                <th rowspan="2" width="" class="text-center"><span>불친절</span></th>
                <th rowspan="2" width="" class="text-center"><span>귀책없음</span></th>
                <th colspan="2" width="" class="text-center"><span>정보공개 청구</span></th>
                <th rowspan="2" width="" class="text-center"><span>오안내</span></th>
                <th rowspan="2" width="" class="text-center"><span>미흡안내</span></th>
                <th rowspan="2" width="" class="text-center"><span>불친절</span></th>
                <th rowspan="2" width="" class="text-center"><span>귀책없음</span></th>
              </tr>
              <tr>
                <th width="" class="text-center">귀책 있음</th>
                <th width="" class="text-center">귀책 없음</th>
              </tr>
            </thead>
          </template>
          <!-- rowspan -->
          <template v-slot:item="{ item, index }">
            <template v-if="item.STATS_TYPE != 'TOT'">
              <tr :class="mixin_getItemClass(item)">
                <template v-if="item.STATS_TYPE == 'MID'">
                  <td :class="`${item.cellClass || ''} text-center`" colspan="2">{{ item.DIV_NM }}</td>
                </template>
                <template v-else>
                  <td v-if="index === 0 || item.DIV_NM !== itemsRowSpan[index - 1].DIV_NM"
                    rowspan="6"
                    :class="`${item.cellClass || ''} text-center`">{{ item.DIV_NM }}</td>
                    <td :class="`${item.cellClass || ''} text-center`">{{ item.CENTER_NM }}</td>
                </template>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'IVOC_CNT1')">{{ item.IVOC_CNT1 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'IVOC_CNT2')">{{ item.IVOC_CNT2 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'IVOC_CNT3')">{{ item.IVOC_CNT3 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'IVOC_CNT4')">{{ item.IVOC_CNT4 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'LHVOC_CNT1')">{{ item.LHVOC_CNT1 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'LHVOC_CNT2')">{{ item.LHVOC_CNT2 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'OVOC_CNT1')">{{ item.OVOC_CNT1 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'OVOC_CNT2')">{{ item.OVOC_CNT2 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'OVOC_CNT3')">{{ item.OVOC_CNT3 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'OVOC_CNT4')">{{ item.OVOC_CNT4 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'TOT_CNT')">{{ item.TOT_CNT }}</td>
              </tr>
            </template>
          </template>
          <!-- 합계 -->
          <template slot="footer">
            <div class="pl-grid-sum">
              <table>
                <tbody>
                  <template v-for="item in itemsRowSpan.filter(row=>{return row.STATS_TYPE == 'TOT'})">
                    <tr>
                      <td class="pl-grid-sum-head text-center" colspan="2" style="width: 230px !important">{{ item.DIV_NM }}</td>
                      <td class="text-center" > {{ item.IVOC_CNT1 }} </td>
                      <td class="text-center" > {{ item.IVOC_CNT2 }} </td>
                      <td class="text-center" > {{ item.IVOC_CNT3 }} </td>
                      <td class="text-center" > {{ item.IVOC_CNT4 }} </td>
                      <td class="text-center" > {{ item.LHVOC_CNT1 }} </td>
                      <td class="text-center" > {{ item.LHVOC_CNT2 }} </td>
                      <td class="text-center" > {{ item.OVOC_CNT1 }} </td>
                      <td class="text-center" > {{ item.OVOC_CNT2 }} </td>
                      <td class="text-center" > {{ item.OVOC_CNT3 }} </td>
                      <td class="text-center" > {{ item.OVOC_CNT4 }} </td>
                      <td class="text-center" > {{ item.TOT_CNT }} </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </template>
        </v-data-table>
      </template>
      <template v-else>
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left ">
            <strong class="pl-bullet-txt is-blue">{{ title }}</strong>
          </div>
          <div class="pl-grid-top-utils">
            <!-- 엑셀 다운로드 버튼 -->
            <compo-excel
              TypeProp="Download"
              :DataHeaderProp="excelHeaders"
              :DataBodyProp="itemsRowSpan"
              :FileNameProp="fileName"
              :SheetNameProp="fileName"
              :isMulti="true"
            />
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          class="pl-grid is-mt-s is-rowspan"
          :headers="headersRowSpan"
          :items="itemsRowSpan"
          fixed-header
          item-key="ROW_NUM"
          height="625px"
          disable-pagination
          hide-default-footer
          hide-default-header
          :loading="loading"
          loading-text="조회중입니다."
	        no-data-text="등록된 데이터가 없습니다."
          >
          <!-- header -->
          <template v-slot:header>
            <thead class="v-data-table-header multi-row">
              <tr>
                <th rowspan="3" width="80px" class="text-center"><span>구분</span></th>
                <th rowspan="3" width="150px" class="text-center"><span>센터</span></th>
                <th colspan="4" width="" class="text-center"><span>대내 접수 건(상담 센터 내)</span></th>
                <th colspan="6" width="" class="text-center"><span>대외 접수 건(공문 접수)</span></th>
                <th rowspan="3" width="" class="text-center"><span>합계</span></th>
              </tr>
              <tr>
                <th rowspan="2" class="text-center"><span>오안내</span></th>
                <th rowspan="2" class="text-center"><span>미흡안내</span></th>
                <th rowspan="2" class="text-center"><span>불친절</span></th>
                <th rowspan="2" class="text-center"><span>귀책없음</span></th>
                <th colspan="2" class="text-center"><span>정보공개 청구</span></th>
                <th rowspan="2" class="text-center"><span>오안내</span></th>
                <th rowspan="2" class="text-center"><span>미흡안내</span></th>
                <th rowspan="2" class="text-center"><span>불친절</span></th>
                <th rowspan="2" class="text-center"><span>귀책없음</span></th>
              </tr>
              <tr>
                <th class="text-center">귀책 있음</th>
                <th class="text-center">귀책 없음</th>
              </tr>
            </thead>
          </template>
          <!-- rowspan -->
          <template v-slot:item="{ item, index }">
            <tr :class="mixin_getItemClass(item)">
                <td v-if="index === 0 || item.DIV_NM !== itemsRowSpan[index - 1].DIV_NM"
                  rowspan="6"
                  :class="`${item.cellClass || ''} text-center`">{{ item.DIV_NM }}</td>
                <td :class="`${item.cellClass || ''} text-center`">{{ item.CENTER_NM }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'IVOC_CNT1')">{{ item.IVOC_CNT1 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'IVOC_CNT2')">{{ item.IVOC_CNT2 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'IVOC_CNT3')">{{ item.IVOC_CNT3 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'IVOC_CNT4')">{{ item.IVOC_CNT4 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'LHVOC_CNT1')">{{ item.LHVOC_CNT1 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'LHVOC_CNT2')">{{ item.LHVOC_CNT2 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'OVOC_CNT1')">{{ item.OVOC_CNT1 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'OVOC_CNT2')">{{ item.OVOC_CNT2 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'OVOC_CNT3')">{{ item.OVOC_CNT3 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'OVOC_CNT4')">{{ item.OVOC_CNT4 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'TOT_CNT')">{{ item.TOT_CNT }}</td>
            </tr>
          </template>
        </v-data-table>
      </template>
    </div>
    <!-- dialog: 상세 -->
    <v-dialog
      v-if="dialogDetail"
      v-model="dialogDetail"
      content-class="dialog-draggable"
      overlay-color="rgba(0,0,0,0)"
      >
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="대내외 민원 누적 현황 상세"
        @hide="mixin_hideDialog('Detail')"
        @submit="submitDialog('Detail')"
      >
        <template slot="body">
          <CTM_M0300_TAB_02_DIALOG :propsData="propsData" @open="(data)=>{openCvlcptDetail(data)}"/>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CTM_M0300_TAB_02_DIALOG from '@/views/page/CTM_M0300_TAB_02_DIALOG';

export default {
  name: 'CTM_M0300_TAB_02', //월별 누적 접수 현황
  components: {
    CTM_M0300_TAB_02_DIALOG,
  },
  data() {
    return {
      //dialog
      dialogDetail: false,

      // grid
      loading: false,
      headersRowSpan: [
        { text: '구분', value: 'DIV_NM', align: '', width: '80px', sortable: false },
        { text: '센터', value: 'CENTER_NM', align: '', width: '150px', sortable: false },
        { text: '오안내', value: 'IVOC_CNT1', align: 'center', width: '', sortable: false },
        { text: '미흡안내', value: 'IVOC_CNT2', align: 'center', width: '', sortable: false },
        { text: '불친절', value: 'IVOC_CNT3', align: 'center', width: '', sortable: false },
        { text: '귀책없음', value: 'IVOC_CNT4', align: 'center', width: '', sortable: false },
        { text: '귀책있음', value: 'LHVOC_CNT1', align: 'center', width: '', sortable: false },
        { text: '귀책없음', value: 'LHVOC_CNT2', align: 'center', width: '', sortable: false },
        { text: '오안내', value: 'OVOC_CNT1', align: '', width: '', sortable: false },
        { text: '미흡안내', value: 'OVOC_CNT2', align: '', width: '', sortable: false },
        { text: '불친절', value: 'OVOC_CNT3', align: 'center', width: '', sortable: false },
        { text: '귀책없음', value: 'OVOC_CNT4', align: 'center', width: '', sortable: false },
        { text: '합계', value: 'TOT_CNT', align: 'center', width: '', sortable: false },
      ],
      excelHeaders:[
        [
          { text: '구분', value: 'DIV_NM', align: 'center', width: '100px', rowspan:2},
          { text: '센터', value: 'CENTER_NM', align: 'center', width: '120px', rowspan:2},
          { text: '대내 접수 건(상담 센터 내)', value: 'IVOC_CNT1', align: 'center', width: '100px', colspan:3},
          { text: '', value: 'IVOC_CNT2', align: 'center', width: '100px'},
          { text: '', value: 'IVOC_CNT3', align: 'center', width: '100px'},
          { text: '', value: 'IVOC_CNT4', align: 'center', width: '100px'},
          { text: '대외 접수 건(공문 접수)', value: 'LHVOC_CNT1', align: 'center', width: '100px', colspan:5},
          { text: '', value: 'LHVOC_CNT2', align: 'center', width: '100px'},
          { text: '', value: 'OVOC_CNT1', align: 'center', width: '100px'},
          { text: '', value: 'OVOC_CNT2', align: 'center', width: '100px'},
          { text: '', value: 'OVOC_CNT3', align: 'center', width: '100px'},
          { text: '', value: 'OVOC_CNT4', align: 'center', width: '100px'},
          { text: '합계', value: 'TOT_CNT', align: 'center', width: '100px', rowspan:2},
        ],
        [
          { text: '', value: 'DIV_NM', align: 'center', width: '100px'},
          { text: '', value: 'CENTER_NM', align: 'center', width: '120px'},
          { text: '오안내', value: 'IVOC_CNT1', align: 'center', width: '100px', rowspan:1},
          { text: '미흡안내', value: 'IVOC_CNT2', align: 'center', width: '100px', rowspan:1},
          { text: '불친절', value: 'IVOC_CNT3', align: 'center', width: '100px', rowspan:1},
          { text: '귀책없음', value: 'IVOC_CNT4', align: 'center', width: '100px', rowspan:1},
          { text: '정보공개 청구', value: 'LHVOC_CNT1', align: 'center', width: '100px', colspan:1},
          { text: '', value: 'LHVOC_CNT2', align: 'center', width: '100px'},
          { text: '오안내', value: 'OVOC_CNT1', align: 'center', width: '100px', rowspan:1},
          { text: '미흡안내', value: 'OVOC_CNT2', align: 'center', width: '100px', rowspan:1},
          { text: '불친절', value: 'OVOC_CNT3', align: 'center', width: '100px', rowspan:1},
          { text: '귀책없음', value: 'OVOC_CNT4', align: 'center', width: '100px', rowspan:1},
          { text: '', value: 'TOT_CNT', align: 'center', width: '100px'},
        ],
        [
          { text: '구분', value: 'DIV_NM', align: 'center', width: '100px', mergeYn:true},
          { text: '센터', value: 'CENTER_NM', align: 'center', width: '120px'},
          { text: '오안내', value: 'IVOC_CNT1', align: 'center', width: '100px'},
          { text: '미흡안내', value: 'IVOC_CNT2', align: 'center', width: '100px'},
          { text: '불친절', value: 'IVOC_CNT3', align: 'center', width: '100px'},
          { text: '귀책없음', value: 'IVOC_CNT4', align: 'center', width: '100px'},
          { text: '귀책있음', value: 'LHVOC_CNT1', align: 'center', width: '100px'},
          { text: '귀책없음', value: 'LHVOC_CNT2', align: 'center', width: '100px'},
          { text: '오안내', value: 'OVOC_CNT1', align: 'center', width: '100px'},
          { text: '미흡안내', value: 'OVOC_CNT2', align: 'center', width: '100px'},
          { text: '불친절', value: 'OVOC_CNT3', align: 'center', width: '100px'},
          { text: '귀책없음', value: 'OVOC_CNT4', align: 'center', width: '100px'},
          { text: '합계', value: 'TOT_CNT', align: 'center', width: '100px'},
        ]
      ],
      itemsRowSpan:[],
      merges:[],

      fileName:"월별_대내외_민원_누적_현황",
      title: "("+this.$moment().format("YYYY")+") 월별 대/내외 민원 누적 현황",

      DROP_YEAR_LIST:[],
      SRCH_YEAR: this.$moment().format("YYYY"),
      SRCH_TYPE: "MONTH",

      propsData:{},
    }
  },
  methods: {
    clickSearchBtn(){
      if(this.mixin_isEmpty(this.SRCH_YEAR)){
        this.showAlertInfo({msg:"조회 연도를 선택해주세요."});
        return;
      }
      this.itemsRowSpan = [];
      this.fileName = this.SRCH_YEAR + ( this.SRCH_TYPE == "MONTH" ? "년_월별_대내외_민원_누적_현황" : "년_분기별_대내외_민원_누적_현황");
      this.title = "("+this.SRCH_YEAR+"년) " + ( this.SRCH_TYPE == "MONTH" ? "월별 대/내외 민원 누적 현황" : "분기별 대/내외 민원 누적 현황");

      this.selectStatsCvlcpt();
    },

    async selectStatsCvlcpt() {
      let sUrl = '/api/biz/common/select/selectStatsCvlcpt'
      let postParam = {
        SRCH_YEAR: this.SRCH_YEAR
        , SRCH_TYPE: this.SRCH_TYPE
      };

      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper"
          , sn : "selectStatsCvlcpt"
        }
      };

      this.loading = true;
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.itemsRowSpan = response.DATA.map(row=>{
          if(row.STATS_TYPE == "MID") row.cellClass = 'is-bg-th font-weight-bold ';
          else if(row.STATS_TYPE == "SUB") row.cellClass = 'is-bg-light font-weight-bold';
          else if(row.STATS_TYPE == "NORMAL") {
            for(let key in row){
              // 0을 공백을 치환
              if(key.indexOf("CNT") > -1 && key != 'TOT_CNT') row[key] = ( row[key] == "0" ? "" : row[key]);
            }
          }
          return row;
        });

        // 데이터 영역 merge
        // this.merges = [];
        // let row = this.excelHeaders.length; // 시작 row
        // for(let i=0;i<this.itemsRowSpan.length;i++){
        //   let col = 0;
        //   for(let idx in this.headersRowSpan){
        //     let key = this.headersRowSpan[idx].value;
        //     if(key == "DIV_NM"){
        //       if(i==0 || this.itemsRowSpan[i-1][key] != this.itemsRowSpan[i][key]){
        //         console.log(i)
        //         if(this.itemsRowSpan[i].STATS_TYPE == "NORMAL"){
        //           this.merges.push({ s: { r: (row+i), c: col }, e: { r: (row+i) + this.itemsRowSpan.filter(row=>{return row.DIV_NM == key}).length, c: col}});
        //         }
        //         else if(this.itemsRowSpan[i].STATS_TYPE == "MID" || this.itemsRowSpan[i].STATS_TYPE == "TOT"){
        //           this.merges.push({ s: { r: (row+i), c: col }, e: { r: i + this.mixin_nvl(_.rowspan, 0), c: col+1}});
        //         }
        //       }
        //       break;
        //     }
        //     col++
        //   }
        // }

        // console.log(this.merges);
      }
      this.loading = false;
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
      if(this.SRCH_TYPE == "MONTH"){
        this.propsData = {
          SRCH_CUSTCO_ID: item.CUSTCO_ID
          , SRCH_REG_YEAR: item.REG_YEAR
          , SRCH_REG_YM: item.REG_YM
          , SRCH_TYPE: this.SRCH_TYPE
          , SRCH_KEY: key
        }
      }else{
        //QUARTER, HALF_YEAR
        this.propsData = {
          SRCH_CUSTCO_ID: item.CUSTCO_ID
          , SRCH_REG_YEAR: item.REG_YEAR
          , SRCH_TYPE: this.SRCH_TYPE
          , QUARTER: item.QUARTER
          , HALF_YEAR: item.HALF_YEAR
          , SRCH_KEY: key
        }
      }

      this.dialogDetail = true;
    },
  },
  mounted() {
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