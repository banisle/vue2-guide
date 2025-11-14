<template>
  <div style="display: contents">
    <div class="pl-quick-layer-header flex-column pb-0">
      <div class="d-flex" style="position: relative; width: 100%">
        <div style="flex: 0 0 40px">
          <img :src="mixin_isEmpty(qaTgtData.IMG) ? require('@/assets/img/@manager_profile_default.png') : qaTgtData.IMG" :alt="qaTgtData.TGT_EMP_NM"  style="width: 100%; height: 40px; border-radius: 50%;"  @error="function(e){e.target.src=require('@/assets/img/@manager_profile_default.png')}">
        </div>
        <div class="ml-4">
          <div >
            <strong style="font-size: 14px">{{ qaTgtData.TGT_EMP_NM }}</strong>
            <span class="ml-2 is-txt-sub">{{ qaTgtData.FULL_DEPT_NM }}</span>
            <compo-tooltip-btn
              TitleProp="상담내용 보기"
              ClassProp="pl-tooltip-btn flex-grow-0"
              IconProp="pl-icon20 board-docu"
              TooltipPositionProp="bottom"
              @btnClick="clickCsDetailBtn"
            ></compo-tooltip-btn>
          </div>
          <div class="spacing-wrap sp-16">
            <div>
              <strong>평가월</strong>
              <span class="ml-2">{{ qaTgtData.FULL_STD_MT }}</span>
            </div>
            <div>
              <strong class="ml-1">평가상태</strong>
              <span class="ml-2 pl-badge is-bg-blue">{{ qaTgtData.COMPLETE_YN_NM }}</span>
            </div>
            <div>
              <strong class="ml-1">결과공개</strong>
              <span class="ml-2 pl-badge is-bg-org">{{ qaTgtData.APPLY_YN_NM }}</span>
            </div>
          </div>
        </div>
        <compo-tooltip-btn
          TitleProp="닫기"
          ClassProp="pl-tooltip-btn ml-auto"
          IconProp="pl-icon20 dialog-close"
          StyleProp="position: absolute; right: 0; top: 0;"
          TooltipPositionProp="bottom"
          @btnClick="close()"
        ></compo-tooltip-btn>
      </div>
      <!-- tab -->
      <v-tabs class="pl-tabs is-noborder is-mt-s" v-model="tabKey">
        <div style="display: contents;">
          <v-tab>평가결과</v-tab>
          <v-tab>상담내용</v-tab>
          <v-tab>
            <v-badge
              color="#0073ce"
              bordered
              offset-x="-1"
              offset-y="9"
              dot
              :value="isObjt"
            >
            이의제기
            </v-badge>
          </v-tab>
        </div>
      </v-tabs>
    </div>
    <!-- <div class="pl-quick-layer-body pb-0" style="flex: 0 0 calc(100% - 190px);"> -->
      <!-- tab content -->
      <v-tabs-items v-model="tabKey">
        <div class="fill-height">
          <!-- 평가결과 -->
          <v-tab-item>
            <div class="pl-quick-layer-body pb-0" style="height: calc(100vh - 190px)">
              <div class="pl-grid-top">
                <div class="pl-grid-top-left">
                  <!-- <span class="pl-subtit"><span class="is-txt-blue">({{qaTgtData.STD_MT_ORD}}차)</span> 상담품질 평가 결과표</span> -->
                  <span class="pl-subtit">{{ qaTgtData.PAPER_NM }}</span>
                </div>
                <div class="pl-grid-top-utils">
                  <CompoAudioWave
                    :AudioProp="qaTgtData"
                    :popData="qaTgtData"
                    :WidthProp=230
                  />
                </div>
              </div>
              <!-- grid -->
              <v-data-table
                class="pl-grid is-rowspan is-mt-s is-no-hover"
                :headers="headersRowSpan"
                :items="itemsRowSpan"
                fixed-header
                item-key="ROW_NUM"
                disable-pagination
                height="637px"
                hide-default-footer
                no-data-text="등록된 데이터가 없습니다."
              >
                <template v-slot:item="{ item, index }">
                  <tr
                    @mouseover="mixin_hoverItem(item,'itemsRowSpan')"
                    @mouseleave="mixin_leaveItem(item,'itemsRowSpan')"
                    :class="mixin_getItemClass(item)"
                    :key="index">
                    <td
                      v-if="index === 0 || item.QA_LCD !== itemsRowSpan[index - 1].QA_LCD"
                      style="white-space: pre-line"
                      :rowspan="mixin_getRowCount(index, 'QA_LCD')"
                      :class="mixin_getHeaderClass(headersRowSpan[0].align)">{{ item.QA_LCD_NM }} ({{ item.QA_LCD_SCORE }})</td>
                    <td
                      v-if="index === 0 || item.QA_LMCD !== itemsRowSpan[index - 1].QA_LMCD"
                      v-html=item.QA_MCD_NM
                      style="white-space: pre-line"
                      :rowspan="mixin_getRowCount(index, 'QA_LMCD')"
                      :class="mixin_getHeaderClass(headersRowSpan[1].align)"></td>
                    <!-- <td
                      v-html=item.QSTN_NM
                      style="white-space: pre-line"
                      :class="mixin_getHeaderClass(headersRowSpan[2].align)">
                    </td> -->
                    <td
                      :class="mixin_getHeaderClass(headersRowSpan[2].align)">
                      <strong>
                        <div
                          v-html="item.QSTN_NM"
                          style="white-space: pre-line"
                          class=""
                        ></div>
                      </strong>
                      <div
                        v-html="'</br>설명) '+item.QSTN_DESC"
                        style="white-space: pre-line"
                      ></div>
                    </td>
                    <td width="" class="text-center">
                      <template v-if="item.QSTN_SCORE">
                        {{ item.QSTN_SCORE }}
                      </template>
                    </td>
                    <td width="" class="text-center">
                      <template v-if="item.SCORE">
                        <strong>{{ item.SCORE }}</strong>
                      </template>
                    </td>
                    <td
                      v-html=item.MGR_COMT
                      style="white-space: pre-line">
                    </td>
                    <!-- <td>
                      <v-textarea
                        v-model="item.MGR_COMT"
                        class="pl-form is-noresize is-trans"
                        :spellcheck="false"
                        readonly
                        style="height: 100%;"
                      ></v-textarea>
                    </td> -->
                  </tr>
                </template>
                <!-- 합계 -->
                <template slot="footer">
                  <div class="pl-grid-sum">
                    <table >
                      <colgroup>
                        <col v-for="(col, index) in headersRowSpan" :key="index" :width=col.width />
                      </colgroup>
                      <tbody >
                        <tr >
                          <td
                            colspan="3"
                            class="pl-grid-sum-head text-center">평가
                            점수</td>
                          <td class="text-center">
                            {{ mixin_sum_field(this.itemsRowSpan, "QSTN_SCORE") }}
                          </td>
                          <td class="text-center" >
                            <strong>{{ getSumScore("SCORE") }}</strong>
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
              </v-data-table>

            </div>
          </v-tab-item>

          <!-- 상담이력정보 -->
          <v-tab-item>
            <div>
              <component
                :is="'QAM_M0500_CS_DETAIL_02'"
                ref="QAM_M0500_CS_DETAIL_02"
                :qaBaseData="qaTgtData"></component>
            </div>
          </v-tab-item>
          <!-- 이의제기 -->
          <v-tab-item>
            <div class="pl-quick-layer-body pa-0" >
              <CompoObjectionRequest :propsData="propsData" @close="close"/>
            </div>
          </v-tab-item>
        </div>
        </v-tabs-items>
    <!-- </div> -->
  </div>
</template>

<script>
import CompoAudioWave from '@/components/CompoAudioWave';
import CompoObjectionRequest from '@/components/CompoObjectionRequest';
import QAM_M0500_CS_DETAIL_02 from '@/views/page/QAM_M0500_CS_DETAIL_02';

export default {
  name: "HOME_QC_DETAIL", //name은 'MENU_' + 파일명 조합
  props: {
    // qaBaseData :{
    //   type: Object,
    //   default: {}
    // }
  },
  components: {
    CompoAudioWave,
    QAM_M0500_CS_DETAIL_02,
    CompoObjectionRequest

  },
  data() {
    return {
      tabKey: 0,

      audio: { audioSrc: require('@/assets/file_example_MP3_700KB.mp3')} ,

      headersRowSpan: [
        { text: "구분", value: "QA_LCD_NM", align: "left", width: "10%" , sortable: false},
        { text: "문항", value: "QA_MCD_NM", align: "left", width: "25%" , sortable: false},
        { text: "보기", value: "QSTN_NM", align: "left", width: "" , sortable: false},
        { text: "배점", value: "QSTN_SCORE", align: "center", width: "6%" , sortable: false},
        { text: "점수", value: "SCORE", align: "center", width: "6%" , sortable: false},
        { text: "코멘트", value: "MGR_COMT", align: "left", width: "20%" , sortable: false},
      ],
      itemsRowSpan: [],

      isObjt: false,

      qaBaseData:{},
      // 평가대상자 정보
      qaTgtData: {},

      // 이의제기 정보
      propsData:{
        EVL_SE_CD : "ARGUDV01"
        , CENTER_ID : ""
        , STD_ID : ""
        , CUSL_ID : ""
      },
    }
  },
  methods: {
    // 평가자 정보 조회
    async selectQaTgtData(){
      // let sUrl = '/phone-api/qa/selectQaTgtData';
      let sUrl = '/api/biz/common/select/selectQaTgtData';

      let postParam = {
        CENTER_ID: this.qaBaseData.CENTER_ID
        , STD_ID: this.qaBaseData.STD_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaCommMapper'
        , sn : 'selectQaTgtData'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        let temp = response.DATA.map(row=>{
          if( row.ICON_IMG_URI !== '/' ) row.IMG = '/upload/' + row.ICON_IMG_URI;
          else row.IMG = require('@/assets/img/@manager_profile_default.png');
          row.FULL_STD_MT = row.STD_MT.replace(/^(\d{4})(\d{2})$/, '$1-$2')+"("+row.STD_MT_ORD+"회)"
          return row;
        });
        this.qaTgtData = temp[0];

        this.propsData.CENTER_ID = this.qaTgtData.CENTER_ID;
        this.propsData.STD_ID = this.qaTgtData.STD_ID;
        this.propsData.CUSL_ID = this.qaTgtData.TGT_EMP_NO;
        this.propsData.OBJT_ID = this.qaTgtData.OBJT_ID;

        if(!this.mixin_isEmpty(this.qaTgtData.OBJT_ID)) this.isObjt = true;

        this.selectQaTgtRstQstnList();
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 평가대상자 평가결과 목록
    async selectQaTgtRstQstnList(){
      // let sUrl = '/phone-api/qa/selectQaTgtRstQstnList';
      let sUrl = '/api/biz/common/select/selectQaTgtRstQstnList';

      let postParam = {
        CENTER_ID: this.qaBaseData.CENTER_ID
        , STD_ID: this.qaBaseData.STD_ID
      };

      let headParam = { head : {
        ns : 'lhcs.phone.qa.dao.xml.PhoneQaCommMapper'
        , sn : 'selectQaTgtRstQstnList'
      }};

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.itemsRowSpan = response.DATA.map(row=>{
          row.QA_LMCD = row.QA_LCD + row.QA_MCD;
          row.QA_LMSCD = row.QA_LCD + row.QA_MCD + row.QA_LMSCD;
          return row;
        });
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    getSumScore(group){ // 음수 처리를 위해
      let sum = 0;

      for(let i in this.itemsRowSpan){
        if(this.itemsRowSpan[i][group] != "") sum += parseInt(this.itemsRowSpan[i][group]);
      }

      return sum;
    },

    close(){
      this.$emit('Close')
    },

    clickCsDetailBtn(){
      if(this.mixin_isEmpty(this.qaTgtData.PHN_CUTT_ID)){
        this.showAlertInfo({msg:"상담번호가 없습니다."});
        return;
      }

      // 상담이력 상세정보 조회 및 팝업 열기
      this.selectCuttHistDtl(this.qaTgtData.PHN_CUTT_ID);
    },

    // 평가대상자 상담이력 정보 조회
    async selectCuttHistDtl(data) {

      // let sUrl = '/phone-api/cvlcpt/selectCvlcptCuttHist';
      let sUrl = '/api/biz/common/select/selectCvlcptCuttHist';

      let postParam = {
        PHN_CUTT_ID: data
      };

      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper",
          sn: "selectCvlcptCuttHist"
        }
      };

      let response = await this.common_postCall(sUrl, postParam, headParam);

      if (!response.HEADER.ERROR_FLAG){
        if(response.DATA.length > 0) {
          // 윈도우 팝업인 경우
          this.mixin_openWindow( 'LayoutPopup', '1600', '850', {compo_name : 'CSL_M0100_DETAIL', callback : 'getPopData', title: '상담이력 상세보기', popData: response.DATA[0], CUSTCO_ID: response.DATA[0].CUSTCO_ID});
        }
        else this.showAlertInfo({msg:"상담이력이 존재하지 않습니다."});
      }else{
        this.showAlertCaution({msg:"일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오."});
      }
    },
  },
  beforeDestroy(){
    this.$eventBus.$off("setQaDetailInfo"); //eventBus 중복방지를 위해 off
    this.$eventBus.$off("refreshObjtGridList"); //eventBus 중복방지를 위해 off
  },
  async mounted() {
    // await this.selectQaTgtData();
    // await this.selectQaTgtRstQstnList();
  },
  created() {
    this.$eventBus.$on("setQaDetailInfo", (STD_ID, CUSTCO_ID) =>{
      this.qaBaseData.STD_ID = STD_ID;
      this.qaBaseData.CENTER_ID = CUSTCO_ID;
      this.selectQaTgtData();
    });

    // 재조회
    this.$eventBus.$on("refreshObjtGridList", () => {
      this.selectQaTgtData();
      this.selectQaTgtRstQstnList();
    });

  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>