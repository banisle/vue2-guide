<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            시/도
          </span>
          <div class="pl-desc">
            <v-select
              v-model="depthId"
              :items="zone_1DeptData"
              item-text="ZONENAME"       
              item-value="ZONEID" 
              class="pl-form type-middle is-sm"
              placeholder="선택"
              @change="changeZone"
            />
            <v-select
              v-model="depth2Id"
              :items="zone_2DeptData"
              item-text="ZONENAME"       
              item-value="ZONEID" 
              class="pl-form type-middle is-sm"
              placeholder="선택"              
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            법무법인 명
          </span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle is-md"
              v-model="SRCH_LAWCORP_NM"
              placeholder="" >
            </v-text-field>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            위탁업무
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="선택"
              :items="mixin_common_code_get(this.allCodeList, 'LAW_TP', '전체')"
              v-model="CSGMTTASK_TYPE_CD"              
            />           
          </div>
        </div>
        <div class="is-right spacing-wrap sp-4">
          <v-btn class="pl-btn is-icon flex-grow-0" @click="clickSearchBtn()">
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="초기화"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 refresh"
            TooltipPositionProp="bottom"
            @btnClick="searchParamsReset()"
          ></compo-tooltip-btn>
        </div>
      </div>
    </div>
    <!-- grid top -->
    <div class="pl-grid-top is-border-sub-top mt-2 pt-2">
      <div class="pl-grid-top-left">
        <strong class="pl-bullet-txt is-blue">지역별 법무법인 현황</strong>
      </div>
      <div class="pl-grid-top-utils">
        <!--
        <compo-tooltip-btn
          TitleProp="등록"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 circle-plus"
          TooltipPositionProp="bottom"
        ></compo-tooltip-btn>-->
        <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ goLawTrustList.length }})</em> 건</span>
        <!-- 엑셀 다운로드 버튼 -->
        <compo-excel
              TypeProp="Download"
              :DataHeaderProp="headers"
              :DataBodyProp="goLawTrustList"
              :FileNameProp="fileName"
              SheetNameProp="지역별 법무법인 현황"
            />
      </div>
    </div>
    <!--  grid -->
    <v-data-table
      class="pl-grid is-mt-s is-hover"
      :headers="headers"
      :items="goLawTrustList"
      fixed-header
      item-key="ROW_NUM"
      height="480px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      :loading="isLoading"
      loading-text="조회중입니다."
      disable-pagination
      >             
      <template v-slot:item="{ item, index }">
        <tr
          :class="mixin_getItemClass(item)"
          :key="index">
          <td class="text-center"> {{ item.ROW_NUM }} </td>        
          
          <td
            v-if="index === 0 || (index > 0 && goLawTrustList[index - 1] && item.PARENTID !== goLawTrustList[index - 1].PARENTID)"
            :rowspan="mixin_getRowCount(index, 'PARENTID', 'goLawTrustList')"
            style="white-space: pre-line"
            :class="mixin_getHeaderClass(headers[0].align)">{{ item.UP_ZONENAME }}</td>          
          <td
            v-if="index === 0 || (index > 0 && goLawTrustList[index - 1] && item.ZONEID !== goLawTrustList[index - 1].ZONEID)"
            :rowspan="mixin_getRowCount(index, 'ZONEID', 'goLawTrustList')"
            style="white-space: pre-line"
            :class="mixin_getHeaderClass(headers[0].align)">{{ item.ZONENAME }}</td>
          <td
            v-if="index === 0 || (index > 0 && goLawTrustList[index - 1] && item.LAWCORP_ID !== goLawTrustList[index - 1].LAWCORP_ID)"
            :rowspan="mixin_getRowCount(index, 'LAWCORP_ID', 'goLawTrustList')"
            style="white-space: pre-line"
            :class="mixin_getHeaderClass(headers[0].align)">{{ item.LAWCORP_NM }}</td>
          
          <td class="text-left"> {{ item.CSGMTTASK_TYPE_CD_NM }} </td>
          <td class="text-left"> {{ item.TELNO }} </td>
          <td class="text-left"> {{ item.FXNO }} </td>
          <!--
          <td class="text-center"> {{mixin_setPhoneNo(item.TELNO.replace(/[^0-9]/g, ""))}} </td>
          <td class="text-center"> {{mixin_setPhoneNo(item.FXNO.replace(/[^0-9]/g, ""))}} </td>
          -->
        </tr>
      </template>       
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'RightLocalLawGuide', //지역별 법무법인 안내
  components: {
  },
  data() {
    return {
      isLoading: false,

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: -1,
      headers: [
        { text: '번호', value: 'ROW_NUM', align: 'center', width: '50px',sortable: false },
        { text: '시도', value: 'UP_ZONENAME', align: 'center', width: '10%', sortable: true },
        { text: '시/군/구', value: 'ZONENAME', align: 'center', width: '11%' , sortable: false},
        { text: '법무법인 명', value: 'LAWCORP_NM', align: 'center', width: '17%' , sortable: false},
        { text: '위탁업무', value: 'CSGMTTASK_TYPE_CD_NM', align: 'center', width: '' , sortable: false},
        { text: '대표 전화번호', value: 'TELNO', align: 'center', width: '20%' , sortable: false},
        { text: '대표 팩스번호', value: 'FXNO', align: 'center', width: '20%' , sortable: false},
      ],
      items: [],

      allCodeList: [],
    
      goLawTrustList: [],

      zone_1DeptData: [],
      zone_2DeptData: [],

      depthId: '',
      depth2Id: '',
      depth: 1,

      SRCH_LAWCORP_NM:'',
      CSGMTTASK_TYPE_CD:'',

      fileName : '지역별 법무법인 현황',

    }
  },
  methods: {

    searchParamsReset(){      
      this.SRCH_LAWCORP_NM = '';
      this.CSGMTTASK_TYPE_CD= '';
      this.depthId= '';
      this.depth2Id= '';
      this.zone_2DeptData= [];              
    },

    // 조회버튼 클릭
    clickSearchBtn(){
      this.selectLawItemList();
    },

    changeZone(){
      this.depth = 2;
      this.depth2Id = ''; // 시/군/구 초기화
      this.selectZoneInfo();
    },

    // 법인별 위탁업무 내용 검색
    async selectLawItemList(){
      // 초기화
      this.goLawTrustList = [];
      let sUrl = '/phone-api/lawcorp/selectLawCorpTrustList_Home';
      let postParam = {
        CSGMTTASK_TYPE_CD: this.CSGMTTASK_TYPE_CD,
        SRCH_LAWCORP_NM: this.SRCH_LAWCORP_NM,
        PARENTID: this.depthId,
        ZONEID: this.depth2Id
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        this.goLawTrustList = response.DATA;
        console.log(this.goLawTrustList);
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },

    // 지역정보 내용 검색
    async selectZoneInfo(){
      this.zone_2DeptData = [];      
      let sUrl = '/phone-api/lawcorp/selectZoneInfo';
      let postParam = {
        DEPTH : this.depth,
        PARENTID: this.depthId,
      };
      let headParam = {}
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      if(!response.HEADER.ERROR_FLAG) {
        if(this.depth == 1){
          this.zone_1DeptData = [];
          this.zone_1DeptData = response.DATA;
          this.zone_1DeptData.unshift({ ZONEID: "",  ZONENAME: "전체",})
        }else{
          
          this.zone_2DeptData = response.DATA;
        }
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }
    },    

  },
  async mounted() {

    let codeList = ['LAW_TP'];
    this.allCodeList = await this.mixin_common_code_get_all(codeList);

    this.depth= 1;
    this.selectZoneInfo();

    this.selectLawItemList();
  },
  created() {
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
    depthId(newVal) {
      if (newVal) {
        this.changeZone();
      }
    }
  },
};
</script>

<style lang="scss" scoped>

</style>