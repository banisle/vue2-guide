<template>
  <div class="pl-cols fill-height">
    <!-- left -->
    <div class="is-col-fix is-vrt" style="width: 70%">
      <!-- sub top -->
      <div class="pl-form-inline-wrap pl-card-body py-3">
        <div class="pl-form-inline">
          <span class="pl-label">
            가감점 구분
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="전체"
              :items= "mixin_common_code_get(this.COMM_CD_DROP_LIST, 'ADSB_CL','전체')"
              v-model="SRCH_ADSB_CL"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            사용 여부
          </span>
          <div class="pl-desc">
            <v-select
              class="pl-form type-middle"
              placeholder="전체"
              :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'USE_WT','전체')"
              v-model="SRCH_USE_YN"
            ></v-select>
          </div>
        </div>
        <div>
          <v-btn
            class="pl-btn is-icon"
            @click="srch_adsb"
          >
            <span class="pl-icon20 search"></span>
            조회
          </v-btn>
        </div>

      </div>
      <!-- sub content -->
      <div class="is-border-top pl-card-body">
        <!-- grid top -->
        <div class="pl-grid-top pt-2">
          <div class="pl-grid-top-left">
            <v-btn
              class="pl-btn is-icon is-trans"
              @click="click_strg()"
            >
              <span class="pl-icon20 circle-plus"></span>
              등록
            </v-btn>
            <v-btn
              class="pl-btn is-icon is-trans"
              @click="clickDel()"
            >
              <span class="pl-icon20 trash"></span>
              삭제
            </v-btn>
          </div>
          <div class="pl-grid-top-utils">
            <span class="pl-counter">전체 <em class="pl-1 is-txt-blue">({{ items.length }})</em> 건</span>
          </div>
        </div>
        <!-- grid -->
        <v-data-table
          v-model="CHC_ADSB_LIST"
          class="pl-grid is-mt-s is-hover has-control"
          :headers="headers"
          :items="reversedItems"
          :item-class="isActiveRow"
          show-select
          fixed-header
          item-key="ADORSUB_ARTCL_CD"
          height="calc(-318px + 100vh)"
          :items-per-page="ROW_PER_PAGE"
          hide-default-footer
	  no-data-text="등록된 데이터가 없습니다."
          @click:row="select_adsb"
          :page.sync="page"
          @page-count="pageCount = $event">
           <!-- 사용 여부 -->
          <template v-slot:item.USE_YN="{ item }">
            <span
              :class="`pl-badge is-${mixin_displayStatus(item.USE_YN, 'STAT_LIST')}`"
              style="width: 60px;"
              >
              {{ item.USE_YN === 'Y' ? '사용' : '사용안함 '}}
            </span>
          </template>
           <!-- 점수 -->
          <template v-slot:item.SCR="{ item }">
            <!-- {{ mixin_formatNumber(item.SCR) }} -->
            {{ item.SCR }}
          </template>
           <!-- 가감점 구분 -->
          <template v-slot:item.STRT_YN="{ item }">
            {{ item.STRT_YN === 'Y' ? '감점' : '가점' }}
          </template>
           <!-- 평가반영 -->
          <template v-slot:item.EVL_APLCN_YN="{ item }">
            {{ item.EVL_APLCN_YN === 'Y' ? '반영' : '반영안함' }}
          </template>
        </v-data-table>
      </div>
    </div>
    <!-- detail -->
    <div class="d-flex flex-column">
      <div class="pl-card flex-grow-1 pl-scroll-body">
        <div class="pl-subtit">가감점 상세 정보 </div>
        <div class="pl-subdesc">
          <p>필수 항목을 입력하신 후 [저장] 버튼을 클릭하십시오.</p>
        </div>
        <!-- form -->
        <div class="pl-form-inline-wrap vertical label-80 is-mt-m">
          <div class="pl-form-inline">
            <span class="pl-label">
              가감점 유형
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form type-middle flex-grow-0"
                placeholder="선택"
                :items= "mixin_common_code_get(this.COMM_CD_DROP_LIST, 'ADSB_CL')"
                v-model="ADSB_CL"
              ></v-select>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              가감점 코드
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form type-middle flex-grow-1"
                placeholder="코드 입력"
                v-model="ADSB_CD"
              ></v-text-field>
              <v-btn
                class="pl-btn is-esp flex-grow-0"
                @click="adsbDpcnCheck"
              >중복체크</v-btn>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              가감점 코드명
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form type-middle flex-grow-1"
                placeholder="코드명 입력"
                v-model="ADSB_NM"
              ></v-text-field>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              점수
            </span>
            <div class="pl-desc">
              <v-text-field
                class="pl-form type-middle flex-grow-1"
                placeholder=""
                v-model="SCR"
              ></v-text-field>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              평가 반영여부
            </span>
            <div class="pl-desc">
              <v-select
                class="pl-form type-middle flex-grow-0"
                placeholder="선택"
                :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'USE_WT')"
                v-model="EVL_APLCN_YN"
              ></v-select>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              정렬 순서
            </span>
            <div class="pl-desc">
              <v-text-field
                v-model="SORT_ORD"
                class="pl-form type-middle flex-grow-1"
                placeholder=""
              ></v-text-field>
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              코드 설명
            </span>
            <div class="pl-desc">
              <v-textarea
                class="pl-form is-noresize"
                placeholder="설명 입력 "
                height="200"
                v-model="ADSB_EXPLN"
              />
            </div>
          </div>
          <div class="pl-form-inline">
            <span class="pl-label">
              사용 여부
            </span>
            <div class="pl-desc">
              <v-select
                :items="mixin_common_code_get(COMM_CD_DROP_LIST, 'USE_WT')"
                v-model="USE_YN"
                class="pl-form type-middle flex-grow-0"
                placeholder="선택"
              ></v-select>
            </div>
          </div>
        </div>
      </div>
        <!-- bottom -->
        <div class="pl-card is-border text-right">
          <v-btn class="pl-btn" @click="strg_adsb" :disabled="REG_MDFCN == 'MDFCN' ? (SEL_ADSB.ADORSUB_ARTCL_CD == ADSB_CD ? false : DPCN_CHK) : DPCN_CHK">저장</v-btn>
        </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SYS_M0101_TAB_03', //가감점 코드
  components: {
  },
  data() {
    return {
      COMM_CD_USE_LIST:[],                //사용할 공통코드 리스트 ==> 변수명 이미 사용중이기 떄문에 변경해주었음 (COMM_CD_LIST->COMM_CD_USE_LIST)
      COMM_CD_DROP_LIST:[],               //공통코드로 생성된 드롭박스 리스트

      ADSB_CL_LIST:[],                    //가감점유형 리스트
      SRCH_ADSB_CL: '',                   //검색 가감점유형
      SRCH_USE_YN: '',                    //검색 사용여부

      CHC_ADSB_LIST:[],                   //가감점코드 다중선택

      ADSB_CL:'',
      ADSB_CD:'',
      ADSB_NM:'',
      SCR:'0',
      EVL_APLCN_YN:'',
      SORT_ORD:'',
      ADSB_EXPLN:'',
      USE_YN:'Y',

      // grid
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: 50,
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: true },
        { text: '가감점 구분', value: 'STRT_YN', align: 'left', width: '10%',sortable: true },
        { text: '가감점 코드', value: 'ADORSUB_ARTCL_CD', align: 'left', width: '14%',sortable: true },
        { text: '가감점 코드명', value: 'ARTCL_NM', align: 'left', width: '', sortable: true },
        { text: '점수', value: 'SCR', align: 'center', width: '7%', sortable: true },
        { text: '평가반영', value: 'EVL_APLCN_YN', align: 'center', width: '7%', sortable: true },
        { text: '순서', value: 'SORT_ORD', align: 'center', width: '6%', sortable: true },
        { text: '사용 여부', value: 'USE_YN', align: 'center', width: '8%', sortable: true },
        { text: '등록자', value: 'MDFR_NM', align: 'left', width: '8%', sortable: true },
        { text: '등록일', value: 'NEW_MDFCN_DT', align: 'left', width: '9%', sortable: true },
      ],
      items: [],
      // 상태 컬러
      STAT_LIST: [
        { code: '사용', value: 'blue'},
        { code: '사용안함', value: 'yellow'},
      ],

      // detail
      SEL_ADSB:{},          //선택가감점코드

      REG_MDFCN:'',         //등록 또는수정 여부
      DPCN_CHK : true,      //중복체크여부

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          DEL : { alertDialogToggle: true, msg: '정말 삭제하시겠습니까?', iconClass: 'is-info', type: 'confirm', callYes: this.del_yes, callNo: this.closeMsg, }
        },
        ALERT : {
          REG_SUCCESS : { alertDialogToggle: true, msg: '가감점코드가 등록되었습니다', iconClass: 'is-done', type: 'default' }
          , DEL_SUCCESS : { alertDialogToggle: true, msg: '삭제가 완료되었습니다', iconClass: 'is-done', type: 'default' }
          , SORT_ORD_ERR : {alertDialogToggle: true, msg: '정렬순서는 <br>마이너스(-,음수)가 될 수 없습니다', iconClass: 'is-info', type: 'default'}
          , VALID : {alertDialogToggle: true, msg: '필수항목 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
          , DUPL_CD : {alertDialogToggle: true, msg: '상위 분류코드와 다른 분류코드를 입력해주세요', iconClass: 'is-info', type: 'default'}
          , REG_Y : {alertDialogToggle: true, msg: '사용가능한 코드입니다', iconClass: 'is-done', type: 'default'}
          , REG_N : {alertDialogToggle: true, msg: '이미 사용중인 코드입니다', iconClass: 'is-caution', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
          , DEL_ONLY_ONE : { alertDialogToggle: true, msg: '하나의 코드만 삭제할 수 있습니다', iconClass: 'is-caution', type: 'default' }
        },
        TOAST : {
          REG_SUCCESS: {  msg: '가감점코드가 등록되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
          , DEL_SUCCESS: {  msg: '삭제가 완료되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
      },

    }
  },
  methods: {
    //가감점코드 조회
    async srch_adsb(){
      let sUrl = '/api/biz/common/select';
      let postParam = {
        SRCH_ADSB_CL : this.SRCH_ADSB_CL == '' ? '' : (this.SRCH_ADSB_CL == 'ADNL' ? 'N' : 'Y'),
        SRCH_USE_YN : this.SRCH_USE_YN,
      }
      let headParam = {
        head: {
          ns : 'palette3.setting.system.dao.SettingSystemCommonCodeManageMapper'
          , sn : 'srchAdsb'
        }
      }

      let resData = await this.common_postCall(sUrl,postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.items = [];
        for(let k in resData.DATA){
          resData.DATA[k].NEW_MDFCN_DT = this.mixin_convertDate(resData.DATA[k].MDFCN_DT, 'yyyy-MM-dd');
        }
        this.items = resData.DATA;
      }
    },

    //가감점 코드 등록버튼 클릭
    click_strg(){
      this.SEL_ADSB = {ADSB_CD:''};
      this.ADSB_CL = this.ADSB_CL_LIST[0].value;
      this.ADSB_CD = '';
      this.ADSB_NM = '';
      this.SCR = '0';
      this.EVL_APLCN_YN = '';
      this.SORT_ORD = '';
      this.ADSB_EXPLN = '';
      this.USE_YN = 'Y';
      this.REG_MDFCN = '';
      this.DPCN_CHK = true;
    },

    //가감점코드 중복체크
    async adsbDpcnCheck(){
      let sUrl = '/api/biz/common/select';
      let postParam = {
        ADSB_CD : this.ADSB_CD,
      }
      let headParam = {
        head: {
          ns : 'palette3.setting.system.dao.SettingSystemCommonCodeManageMapper'
          , sn : 'adsbDpcnCheck'
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        //중복이 없을때
        if(resData.DATA[0].CNT == '0'){
          this.showAlert(this.MESSAGE.ALERT.REG_Y);
          this.DPCN_CHK = false;
        } else {
          this.showAlert(this.MESSAGE.ALERT.REG_N);
        }
      }
    },

    //가감점코드 클릭
    select_adsb(item){
      this.SEL_ADSB = item;
      this.ADSB_CL = item.STRT_YN == 'Y' ? 'SBAT' : 'ADNL';
      this.ADSB_CD = item.ADORSUB_ARTCL_CD;
      this.ADSB_NM = item.ARTCL_NM;
      this.SCR = item.SCR;
      this.EVL_APLCN_YN = item.EVL_APLCN_YN;
      this.SORT_ORD = item.SORT_ORD;
      this.ADSB_EXPLN = item.EXPLN;
      this.USE_YN = item.USE_YN;
      this.REG_MDFCN = 'MDFCN';
      this.DPCN_CHK = true;
    },

    //row클릭 색상변경
    isActiveRow(item){
      return item.ADORSUB_ARTCL_CD== this.SEL_ADSB.ADORSUB_ARTCL_CD? 'active':'';
    },

    //가감점코드 등록,수정
    async strg_adsb(){
      let sUrl = this.SEL_ADSB.ADSB_CD == '' ? '/api/biz/common/insert' : '/api/biz/common/update';
      let postParam = {
        ADSB_CL : this.ADSB_CL == 'SBAT' ? 'Y' : 'N',
        ADSB_CD : this.ADSB_CD,
        ADSB_NM : this.ADSB_NM,
        SCR : this.SCR,
        EVL_APLCN_YN : this.EVL_APLCN_YN,
        SORT_ORD : this.SORT_ORD,
        ADSB_EXPLN : this.ADSB_EXPLN,
        USE_YN : this.USE_YN
      }
      let headParam = {
        head: {
          ns : 'palette3.setting.system.dao.SettingSystemCommonCodeManageMapper'
          , sn : this.SEL_ADSB.ADSB_CD == '' ? 'insertAdsb' : 'updateAdsb'
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS); //등록완료 알림창
        //리스트 재조회
        this.srch_adsb();
      }
    },

    //삭제버튼 클릭
    clickDel(){
      if(this.CHC_ADSB_LIST.length > 1){
        this.showAlert(this.MESSAGE.ERROR.DEL_ONLY_ONE)
      } else if(this.CHC_ADSB_LIST.length == 1) {
        this.showAlert(this.MESSAGE.CONFIRM.DEL)
      }
    },

    //삭제확인 클릭
    async del_yes(){
      let sUrl = '/api/biz/common/update';
      let postParam = {
        ADSB_CD : this.CHC_ADSB_LIST[0].ADORSUB_ARTCL_CD,
      }
      let headParam = {
        head: {
          ns : 'palette3.setting.system.dao.SettingSystemCommonCodeManageMapper'
          , sn : 'deleteAdsb'
        }
      }

      let resData = await this.common_postCall(sUrl, postParam, headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS); //등록완료 알림창
        //리스트 재조회
        this.srch_adsb();
        this.closeMsg();
      }
    },

    //삭제취소
    closeMsg() {
      this.$store.commit("alertStore/hideAlert");
    },
  },
  mounted() {
  },
  async created() {
    //공통코드 목록 => 사용할 공통코드 리스트에 넣기
    this.COMM_CD_USE_LIST = [
      "USE_WT"      //사용여부
      , "ADSB_CL"     //코드유형
    ];
    //공통코드별 드롭박스 만들기
    this.COMM_CD_DROP_LIST = await this.mixin_common_code_get_all(this.COMM_CD_USE_LIST);

    this.ADSB_CL_LIST = this.mixin_common_code_get(this.COMM_CD_DROP_LIST, 'ADSB_CL');
    this.ADSB_CL = this.ADSB_CL_LIST[0].value;

    this.srch_adsb();
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>