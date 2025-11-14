<template>
  <div>
    <div class="pl-grid-top">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue" v-if="isCusl">귀책민원 누적 현황 상세</strong>
        <strong class="pl-bullet-txt is-blue" v-else>대내외 민원 누적 현황 상세</strong>
      </div>
    </div>
    <div class="pl-cols is-border-sub-top" v-if="isCusl">
      <div class="is-col-fix" style="width: 33%;">
        <v-data-table
          class="pl-grid is-mt-s"
          :headers="headers2"
          :items="userList"
          @click:row="clickCuslRow"
          :item-class="isActiveRow"
          fixed-header
          item-key="ROW_NUM"
          height="362px"
          disable-pagination
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다.">
        </v-data-table>
      </div>
      <div class="ml-2">
        <v-data-table
          class="pl-grid is-mt-s"
          :headers="headers3"
          :items="cvlcptList"
          @dblclick:row="dblClickRow"
          fixed-header
          item-key="ROW_NUM"
          height="362px"
          disable-pagination
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다.">
          <!-- 민원구분 -->
          <template v-slot:item.CVLCPT_SE_CD_NM="{ item }">
            <span :class="item.CVLCPT_SE_CD != 'IVOC' ? 'is-txt-org' : ''">{{ item.CVLCPT_SE_CD_NM }}</span>
          </template>
          <!-- 민원분류2 -->
          <template v-slot:item.CVLCPT_CLSF_NM2="{ item }">
            <v-tooltip content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs" v-html="item['CVLCPT_CLSF_NM2']" />
              </template>
              <div v-html="item['CVLCPT_CLSF_NM2']"></div>
            </v-tooltip>
          </template>
          <!-- 민원분류3 -->
          <template v-slot:item.CVLCPT_CLSF_NM3="{ item }">
            <v-tooltip content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs" v-html="item['CVLCPT_CLSF_NM3']" />
              </template>
              <div v-html="item['CVLCPT_CLSF_NM3']"></div>
            </v-tooltip>
          </template>
        </v-data-table>
      </div>
    </div>
    <div v-else>
      <v-data-table
          class="pl-grid is-mt-s"
          :headers="headers"
          :items="items"
          @dblclick:row="dblClickRow"
          fixed-header
          item-key="ROW_NUM"
          height="362px"
          disable-pagination
          hide-default-footer
          no-data-text="등록된 데이터가 없습니다.">
          <!-- 민원구분 -->
          <template v-slot:item.CVLCPT_SE_CD_NM="{ item }">
            <span :class="item.CVLCPT_SE_CD != 'IVOC' ? 'is-txt-org' : ''">{{ item.CVLCPT_SE_CD_NM }}</span>
          </template>
          <!-- 민원분류2 -->
          <template v-slot:item.CVLCPT_CLSF_NM2="{ item }">
            <v-tooltip content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs" v-html="item['CVLCPT_CLSF_NM2']" />
              </template>
              <div v-html="item['CVLCPT_CLSF_NM2']"></div>
            </v-tooltip>
          </template>
          <!-- 민원분류3 -->
          <template v-slot:item.CVLCPT_CLSF_NM3="{ item }">
            <v-tooltip content-class="pl-tooltip " bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-on="on" v-bind="attrs" v-html="item['CVLCPT_CLSF_NM3']" />
              </template>
              <div v-html="item['CVLCPT_CLSF_NM3']"></div>
            </v-tooltip>
          </template>
        </v-data-table>
    </div>

    <v-slide-x-reverse-transition>
      <div
        class="pl-quick-layer "
        style="width: 550px"
        :style="tempCenterStyle"
        v-if="dialogDetail">
        <div class="pl-quick-layer-header"><h1>민원 상세 정보</h1>
          <!-- <compo-tooltip-btn
            TitleProp="윈도우 팝업 열기"
            ClassProp="pl-tooltip-btn"
            IconProp="pl-icon20 openPop"
            TooltipPositionProp="bottom"
            @btnClick="clickOpenBtn"
          ></compo-tooltip-btn> -->
          <compo-tooltip-btn
            TitleProp="닫기"
            ClassProp="pl-tooltip-btn ml-1"
            IconProp="pl-icon20 dialog-close"
            TooltipPositionProp="bottom"
            @btnClick="dialogDetail = false"
          ></compo-tooltip-btn>
        </div>
        <!-- component -->
        <CTM_M0300_TAB_02_DETAIL refs="CTM_M0300_TAB_02_DETAIL" :popData="popData" @Close="dialogDetail = false"/>
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import _ from 'lodash';
import CTM_M0300_TAB_02_DETAIL from '@/views/page/CTM_M0300_TAB_02_DETAIL';

export default {
  name: 'CTM_M0300_TAB_02_DIALOG', //대내외 민원누적 상세
  components: {
    CTM_M0300_TAB_02_DETAIL,
  },
  props:{
    propsData:{ 
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      headers: [
        { text: '접수일', value: 'REG_DT', align: 'center', width: '18%' },
        { text: '상담일', value: 'CUTT_DT', align: 'center', width: '18%'},
        { text: '센터', value: 'RCPT_CUSTCO_NM', align: '', width: '' },
        { text: '소속', value: 'RCPT_DEPT_NM', align: '', width: '25%' },
        { text: '상담사', value: 'CUSL_NM', align: '', width: '18%' },
      ],

      headers2: [
        { text: '센터', value: 'RCPT_CUSTCO_NM', align: 'center', width: '' },
        { text: '소속', value: 'RCPT_DEPT_NM', align: 'center', width: '30%' },
        { text: '상담사', value: 'CUSL_NM', align: 'center', width: '30%' },
      ],

      headers3: [
        { text: '접수일', value: 'REG_DT', align: 'center', width: '80px' },
        { text: '상담일', value: 'CUTT_DT', align: 'center', width: '80px'},
        { text: '민원구분', value: 'CVLCPT_SE_CD_NM', align: 'center', width: '75px'},
        { text: '민원분류1', value: 'CVLCPT_CLSF_NM1', align: 'center', width: '75px'},
        { text: '민원분류2', value: 'CVLCPT_CLSF_NM2', align: 'center', width: '75px'},
        { text: '민원분류3', value: 'CVLCPT_CLSF_NM3', align: 'center', width: '85px'},
      ],

      items: [],
      userList: [],
      cvlcptList:[],
      dialogDetail: false,
      popData:{},

      isCusl: false,
      selectedCusl: {},
    }
  },
  methods: {
    async selectStatsCvlcptDetail(){
      let sUrl = this.propsData.SRCH_TYPE === "CUSL"? "/api/biz/common/select/selectStatsCvlcptCuslDetail" : "/api/biz/common/select/selectStatsCvlcptDetail"
      let postParam = this.propsData;

      let headParam = {
        head: {
          ns: "lhcs.phone.cuttMng.cvlcpt.dao.xml.PhoneCvlcptManageMapper"
          , sn : this.propsData.SRCH_TYPE === "CUSL"? "selectStatsCvlcptCuslDetail" : "selectStatsCvlcptDetail"
        }
      };

      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.items = response.DATA;

        if(this.isCusl){
          this.userList = _.uniqBy(this.items, "CUSL_ID");
          this.cvlcptList = [];
        }
      }
    },

    clickCuslRow(item){
      this.selectedCusl = item;
      this.cvlcptList = this.items.filter(row=>{return row.CUSL_ID == item.CUSL_ID});
    },

    dblClickRow(e, {item}){
      this.dialogDetail = false;
      this.$eventBus.$emit('clearVSlideXreverse');

      this.$nextTick(() => {
        this.popData = item;
        this.popData.isWindow = false;
        this.dialogDetail = true;
      });
    },

    isActiveRow(item) {
      const activeClass = item === this.selectedCusl ? "active" : "";
      return activeClass;
    },
  },
  mounted() {
    // console.log(this.propsData);
    this.isCusl = this.propsData.SRCH_TYPE == "CUSL" ? true : false;
    this.selectStatsCvlcptDetail();
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