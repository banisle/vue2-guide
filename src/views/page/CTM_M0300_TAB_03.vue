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
              SheetNameProp="민원유형별 누적"
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
                <th rowspan="2" width="80px" class="text-center"><span>구분</span></th>
                <th rowspan="2" width="150px" class="text-center"><span>센터</span></th>
                <th colspan="3" width="" class="text-center"><span>오안내</span></th>
                <th colspan="5" width="" class="text-center"><span>미흡안내</span></th>
                <th colspan="3" width="" class="text-center"><span>불친절</span></th>
                <th colspan="2" width="" class="text-center"><span>기타</span></th>
                <th rowspan="2" width="100px" class="text-center"><span>합계</span></th>
              </tr>
              <tr>
                <th class="text-center"><span>공고문/안내문 확인 누락</span></th>
                <th class="text-center"><span>담당자(부서) 오안내</span></th>
                <th class="text-center"><span>업무미숙지<br>(업무프로세스미준수)</span></th>
                <th class="text-center"><span>필수탐색/필수안내 미흡</span></th>
                <th class="text-center"><span>상담자료 활용 미흡</span></th>
                <th class="text-center"><span>시스템 활용 미흡</span></th>
                <th class="text-center"><span>추측성 상담(상담미흡)</span></th>
                <th class="text-center"><span>필요한 부가안내 누락</span></th>
                <th class="text-center"><span>무성의한 태도</span></th>
                <th class="text-center"><span>경청(적극성) 부족</span></th>
                <th class="text-center"><span>정중하지 못한 태도, 맞대응</span></th>
                <th class="text-center"><span>귀책없음</span></th>
                <th class="text-center"><span>정보공개 청구</span></th>
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
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'MISS_CNT1')">{{ item.MISS_CNT1 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'MISS_CNT2')">{{ item.MISS_CNT2 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'MISS_CNT3')">{{ item.MISS_CNT3 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'INSUF_CNT1')">{{ item.INSUF_CNT1 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'INSUF_CNT2')">{{ item.INSUF_CNT2 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'INSUF_CNT3')">{{ item.INSUF_CNT3 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'INSUF_CNT4')">{{ item.INSUF_CNT4 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'INSUF_CNT5')">{{ item.INSUF_CNT5 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'UNKIND_CNT1')">{{ item.UNKIND_CNT1 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'UNKIND_CNT2')">{{ item.UNKIND_CNT2 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'UNKIND_CNT3')">{{ item.UNKIND_CNT3 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'NO_FAULT_CNT')">{{ item.NO_FAULT_CNT }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'LHVOC_CNT')">{{ item.LHVOC_CNT }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'TOT_CNT')">{{ item.TOT_CNT }}</td>
              </tr>
            </template>
          </template>
          <!-- 합계 -->
          <template slot="footer">
            <div class="pl-grid-sum">
              <table >
                <tbody >
                  <template v-for="item in itemsRowSpan.filter(row=>{return row.STATS_TYPE == 'TOT'})">
                    <tr>
                      <td class="pl-grid-sum-head text-center" colspan="2" style="width: 230px !important">{{ item.DIV_NM }}</td>
                      <td :class="`${item.cellClass || ''} text-center`">{{ item.MISS_CNT1 }}</td>
                      <td :class="`${item.cellClass || ''} text-center`">{{ item.MISS_CNT2 }}</td>
                      <td :class="`${item.cellClass || ''} text-center`">{{ item.MISS_CNT3 }}</td>
                      <td :class="`${item.cellClass || ''} text-center`">{{ item.INSUF_CNT1 }}</td>
                      <td :class="`${item.cellClass || ''} text-center`">{{ item.INSUF_CNT2 }}</td>
                      <td :class="`${item.cellClass || ''} text-center`">{{ item.INSUF_CNT3 }}</td>
                      <td :class="`${item.cellClass || ''} text-center`">{{ item.INSUF_CNT4 }}</td>
                      <td :class="`${item.cellClass || ''} text-center`">{{ item.INSUF_CNT5 }}</td>
                      <td :class="`${item.cellClass || ''} text-center`">{{ item.UNKIND_CNT1 }}</td>
                      <td :class="`${item.cellClass || ''} text-center`">{{ item.UNKIND_CNT2 }}</td>
                      <td :class="`${item.cellClass || ''} text-center`">{{ item.UNKIND_CNT3 }}</td>
                      <td :class="`${item.cellClass || ''} text-center`">{{ item.NO_FAULT_CNT }}</td>
                      <td :class="`${item.cellClass || ''} text-center`">{{ item.LHVOC_CNT }}</td>
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
                <th rowspan="2" width="80px" class="text-center"><span>구분</span></th>
                <th rowspan="2" width="150px" class="text-center"><span>센터</span></th>
                <th colspan="3" width="" class="text-center"><span>오안내</span></th>
                <th colspan="5" width="" class="text-center"><span>미흡안내</span></th>
                <th colspan="3" width="" class="text-center"><span>불친절</span></th>
                <th colspan="2" width="" class="text-center"><span>기타</span></th>
                <th rowspan="2" width="100px" class="text-center"><span>합계</span></th>
              </tr>
              <tr>
                <th class="text-center"><span>공고문/안내문 확인 누락</span></th>
                <th class="text-center"><span>담당자(부서) 오안내</span></th>
                <th class="text-center"><span>업무미숙지<br>(업무프로세스미준수)</span></th>
                <th class="text-center"><span>필수탐색/필수안내 미흡</span></th>
                <th class="text-center"><span>상담자료 활용 미흡</span></th>
                <th class="text-center"><span>시스템 활용 미흡</span></th>
                <th class="text-center"><span>추측성 상담(상담미흡)</span></th>
                <th class="text-center"><span>필요한 부가안내 누락</span></th>
                <th class="text-center"><span>무성의한 태도</span></th>
                <th class="text-center"><span>경청(적극성) 부족</span></th>
                <th class="text-center"><span>정중하지 못한 태도, 맞대응</span></th>
                <th class="text-center"><span>귀책없음</span></th>
                <th class="text-center"><span>정보공개 청구</span></th>
              </tr>
            </thead>
          </template>
          <!-- rowspan -->
          <template v-slot:item="{ item, index }">
            <tr :class="mixin_getItemClass(item)">
                <td v-if="index === 0 || item.DIV_NM !== itemsRowSpan[index - 1].DIV_NM"
                  rowspan="6"
                  :class="`${item.cellClass || ''} text-center`">{{ item.DIV_NM }}</td>
                <td :class="`${item.cellClass || ''} text-center`" >{{ item.CENTER_NM }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'MISS_CNT1')">{{ item.MISS_CNT1 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'MISS_CNT2')">{{ item.MISS_CNT2 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'MISS_CNT3')">{{ item.MISS_CNT3 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'INSUF_CNT1')">{{ item.INSUF_CNT1 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'INSUF_CNT2')">{{ item.INSUF_CNT2 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'INSUF_CNT3')">{{ item.INSUF_CNT3 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'INSUF_CNT4')">{{ item.INSUF_CNT4 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'INSUF_CNT5')">{{ item.INSUF_CNT5 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'UNKIND_CNT1')">{{ item.UNKIND_CNT1 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'UNKIND_CNT2')">{{ item.UNKIND_CNT2 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'UNKIND_CNT3')">{{ item.UNKIND_CNT3 }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'NO_FAULT_CNT')">{{ item.NO_FAULT_CNT }}</td>
                <td :class="`${item.cellClass || ''} text-center`" @dblclick="showDetail(item, 'LHVOC_CNT')">{{ item.LHVOC_CNT }}</td>
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
  name: 'CTM_M0300_TAB_03', //민원 귀책 계수

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
        { text: '공고문/안내문 확인 누락', value: 'MISS_CNT1', align: 'center', width: '', sortable: false },
        { text: '담당자(부서) 오안내', value: 'MISS_CNT2', align: 'center', width: '', sortable: false },
        { text: '업무미숙지(업무프로세스미준수)', value: 'MISS_CNT3', align: 'center', width: '', sortable: false },
        { text: '필수탐색/필수안내 미흡', value: 'INSUF_CNT1', align: 'center', width: '', sortable: false },
        { text: '상담자료 활용 미흡', value: 'INSUF_CNT2', align: 'center', width: '', sortable: false },
        { text: '시스템 활용 미흡', value: 'INSUF_CNT3', align: 'center', width: '', sortable: false },
        { text: '추측성 상담(상담미흡)', value: 'INSUF_CNT4', align: 'center', width: '', sortable: false },
        { text: '필요한 부가안내 누락', value: 'INSUF_CNT5', align: '', width: '', sortable: false },
        { text: '무성의한 태도', value: 'UNKIND_CNT1', align: '', width: '14%', sortable: false },
        { text: '경청(적극성) 부족', value: 'UNKIND_CNT2', align: 'center', width: '', sortable: false },
        { text: '정중하지 못한 태도, 맞대응', value: 'UNKIND_CNT3', align: 'center', width: '', sortable: false },
        { text: '귀책없음', value: 'NO_FAULT_CNT', align: 'center', width: '', sortable: false },
        { text: '정보공개 청구', value: 'LHVOC_CNT', align: 'center', width: '', sortable: false },
        { text: '합계', value: 'TOT_CNT', align: 'center', width: '', sortable: false },
      ],

      excelHeaders:[
          [
            { text: '구분', value: 'DIV_NM', align: 'center', rowspan: 1},
            { text: '센터', value: 'CENTER_NM', align: 'center', rowspan: 1},
            { text: '오안내', value: 'MISS_CNT1', align: 'center', colspan: 2},
            { text: '', value: 'MISS_CNT2', align: 'center' },
            { text: '', value: 'MISS_CNT3', align: 'center'},
            { text: '미흡안내', value: 'INSUF_CNT1', align: 'center', colspan: 4 },
            { text: '', value: 'INSUF_CNT2', align: 'center' },
            { text: '', value: 'INSUF_CNT3', align: 'center' },
            { text: '', value: 'INSUF_CNT4', align: 'center' },
            { text: '', value: 'INSUF_CNT5', align: 'center' },
            { text: '불친절', value: 'UNKIND_CNT1', align: 'center', colspan: 2 },
            { text: '', value: 'UNKIND_CNT2', align: 'center' },
            { text: '', value: 'UNKIND_CNT3', align: 'center' },
            { text: '기타', value: 'NO_FAULT_CNT', align: 'center', colspan: 1 },
            { text: '', value: 'LHVOC_CNT', align: 'center' },
            { text: '합계', value: 'TOT_CNT', align: 'center', rowspan: 1},
          ],
          [
            { text: '구분', value: 'DIV_NM', align: 'center', width: '100px', sortable: false },
            { text: '센터', value: 'CENTER_NM', align: 'center', width: '120px', sortable: false },
            { text: '공고문/안내문 확인 누락', value: 'MISS_CNT1', align: 'center', width: '130px', sortable: false },
            { text: '담당자(부서) 오안내', value: 'MISS_CNT2', align: 'center', width: '130px', sortable: false },
            { text: '업무미숙지(업무프로세스미준수)', value: 'MISS_CNT3', align: 'center', width: '130px', sortable: false },
            { text: '필수탐색/필수안내 미흡', value: 'INSUF_CNT1', align: 'center', width: '130px', sortable: false },
            { text: '상담자료 활용 미흡', value: 'INSUF_CNT2', align: 'center', width: '130px', sortable: false },
            { text: '시스템 활용 미흡', value: 'INSUF_CNT3', align: 'center', width: '130px', sortable: false },
            { text: '추측성 상담(상담미흡)', value: 'INSUF_CNT4', align: 'center', width: '130px', sortable: false },
            { text: '필요한 부가안내 누락', value: 'INSUF_CNT5', align: 'center', width: '130px', sortable: false },
            { text: '무성의한 태도', value: 'UNKIND_CNT1', align: 'center', width: '130px', sortable: false },
            { text: '경청(적극성) 부족', value: 'UNKIND_CNT2', align: 'center', width: '130px', sortable: false },
            { text: '정중하지 못한 태도, 맞대응', value: 'UNKIND_CNT3', align: 'center', width: '130px', sortable: false },
            { text: '귀책없음', value: 'NO_FAULT_CNT', align: 'center', width: '130px', sortable: false },
            { text: '정보공개 청구', value: 'LHVOC_CNT', align: 'center', width: '130px', sortable: false },
            { text: '합계', value: 'TOT_CNT', align: 'center', width: '100px', sortable: false },
          ]
      ],
      
      itemsRowSpan:[],

      fileName:"월별_민원유형별_누적_현황",
      title: "("+this.$moment().format("YYYY")+") 월별 민원유형별 누적 현황",

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
      this.fileName = this.SRCH_YEAR + ( this.SRCH_TYPE == "MONTH" ? "년_월별_민원유형별_누적_현황" : "년_분기별_민원유형별_누적_현황");
      this.title = "("+this.SRCH_YEAR+"년) " + ( this.SRCH_TYPE == "MONTH" ? "월별 민원유형별 누적 현황" : "분기별 민원유형별 누적 현황");

      this.selectStatsCvlcptClsf();
    },

    async selectStatsCvlcptClsf(){
      let sUrl = '/api/biz/common/select/selectStatsCvlcptClsf'
      let postParam = {
        SRCH_YEAR: this.SRCH_YEAR
        , SRCH_TYPE: this.SRCH_TYPE
      };

      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper"
          , sn : "selectStatsCvlcptClsf"
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