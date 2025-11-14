<template>
  <div>
    <!-- search form -->
    <div class="pl-grid-top">
      <div class="pl-form-inline-wrap">
        <div class="pl-form-inline">
          <span class="pl-label">
            센터(팀)
          </span>
          <div class="pl-desc">
            <v-select
              v-model="TGT_DEPT_ID"
              :items="TGT_DEPT_LIST"
              class="pl-form type-middle is-md"
              @change="getTgtEmpList()"
              placeholder="선택"
            ></v-select>
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">
            상담사
          </span>
          <div class="pl-desc">
            <v-select
              v-model="TGT_EMP_NO"
              :items="TGT_EMP_LIST"
              class="pl-form type-middle is-sm"
              placeholder="선택"
              @change="setTgtEmpNm()"
            ></v-select>
          </div>
        </div>
        <div class="align-center spacing-wrap sp-4">
          <v-btn
            class="pl-btn flex-grow-0" 
            @click="transSchedule('N')">
            스케줄러 이관
          </v-btn>
          <v-btn
            class="pl-btn is-esp3 flex-grow-0"
            @click="transSchedule('Y')">
            스케줄러 이관(긴급)
          </v-btn>
          <!-- 툴팁 버튼 -->
          <compo-tooltip-btn
            TitleProp="보수처리중, 보수독촉1, 보수독촉2, 완료신청, 관리소확인요청, 완료확인 본부이관, 공사완료"
            ClassProp="pl-tooltip-btn flex-grow-0"
            IconProp="pl-icon20 question"
            TooltipPositionProp="bottom"
          ></compo-tooltip-btn>
          <span >이관가능 처리상태</span>

        </div>
      </div>
    </div>
    <!-- temp grid -->
    <v-data-table
      v-model="selectedHistFlwAcp"
      class="pl-grid is-mt-s has-control"
      show-select
      :headers="headers"
      :items="HIST_FLW_ACP"
      fixed-header
      item-key="ROW_NUMBER"
      height="360px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-header
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      >
      <!-- custom thead -->
      <template v-slot:header="{ props }">
        <thead>
          <tr>
            <!-- 커스텀 헤더 정의 -->
            <th
              v-for="header in props.headers"
              :class="`text-${header.align}`"
              :width="header.width"
              :key="header.text">
              {{ header.text }}
            </th>
          </tr>
        </thead>
      </template>

      <!-- 공종 -->
      <template v-slot:item.MNTN_FLW_CS_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.MNTN_FLW_CS_NM }}</span>
          </template>
          <span>{{ item.MNTN_FLW_CS_NM }}</span>
        </v-tooltip>
      </template>

      <!-- 처리결과 -->
      <template v-slot:item.FLW_PGRS_SS_NM="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              :class="mixin_displayStatus(item.FLW_PGRS_SS_NM, 'STAT_LIST')"
              v-bind="attrs"
              v-on="on">
            {{ item.FLW_PGRS_SS_NM }}</span>
          </template>
          <span>{{ item.FLW_PGRS_SS_NM }}</span>
        </v-tooltip>
      </template>

      <!-- AS 접수내용 -->
      <template v-slot:item.FLW_CTS="{ item }">
        <v-tooltip content-class="pl-tooltip " bottom>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on">
            {{ item.FLW_CTS }}</span>
          </template>
          <span>{{ item.FLW_CTS }}</span>
        </v-tooltip>
      </template>

    </v-data-table>

  </div>
</template>

<script>
export default {
  name: 'CompoTransSchedule', //AS 접수 스케줄러 이관
  components: {
  },
  props: {
    DataProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      CUSTCO_ID: this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,

      //센터 부서 ID
      CENTER_DEPT_ID: this.$store.getters['userStore/GE_USER_ROLE'].CENTER_DEPT_ID,
      
      //기본 상담사 정보
      DEFAULT_TGT: {},

      HNO: '',  //주택번호
      MGOF_CD: '', //단지코드
      BLDG_ID: '', //동아이디
      HIST_FLW_ACP: [],
      selectedHistFlwAcp: [], //선택된 접수

      //스케줄러 분배 상담사 정보.
      TGT_DEPT_ID: '',
      TGT_DEPT_NM: '',
      TGT_DEPT_LIST: [],
			TGT_EMP_NO: '',
      TGT_EMP_NM: '',
      TGT_EMP_LIST: [],


      // search
      modelCenter: '바로처리6팀',
      dropItems: ['바로처리6팀'],
      modelManager: '우성아',
      dropItems2: ['우성아'],

      ROW_PER_PAGE: -1, //페이징 없이 전체 화면 뿌릴때
      // ROW_PER_PAGE: 14, //페이징 없이 전체 화면 뿌릴때
      headers: [
        { text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false },
        { text: '접수채널', value: 'ACP_CHNL_NM',  width: '80px', sortable: false },
        { text: 'AS 접수번호', value: 'V_FLW_ACP_SN', align: 'center', width: '120px', sortable: false },
        { text: '공종', value: 'MNTN_FLW_CS_NM',  width: '14%',sortable: false },
        { text: 'AS 구분', value: 'FLW_DS_NM',  width: '90px', sortable: false },
        { text: '보수구분', value: 'FLW_DTL_DS_NM', align: 'center', width: '90px' , sortable: false},
        { text: '업체', value: 'FRM_NM', align: '', width: '15%', sortable: false },
        { text: '처리결과', value: 'FLW_PGRS_SS_NM', align: 'center', width: '80px', sortable: false },
        { text: '경과일수', value: 'CLOSE_DATE', align: 'center', width: '65px', sortable: false },
        { text: 'AS 접수내용', value: 'FLW_CTS',  width: '', sortable: false },
      ],
      items: [
        {
          index: 1,
          type1: '콜센터',
          type2: '240610-47-04567',
          type3: '타일-균열-건축-타일공사',
          type4: '유지보수',
          type5: '일상보수',
          type6: '주식회사거륜에너택',
          type7: '보수처리중',
          type8: '',
          type9: '부부 욕실 바닥 및 벽면 타일 7개 균열',
        },
        { index: 2, type1: '관리사무소', type2: '240610-47-04567', type3: '렌지후드-작동불량-기계', type4: '유지보수', type5: '일상보수', type6: '코오롱글로벌주식회사', type7: '대금지급요청', type8: '', type9: '후드 자동 작동 안됨', },
        { index: 3, type1: '관리사무소', type2: '240610-47-04567', type3: '렌지후드-작동불량-기계', type4: '유지보수', type5: '일상보수', type6: '코오롱글로벌주식회사', type7: '대금지급요청', type8: '', type9: '후드 자동 작동 안됨', },
        { index: 4, type1: '관리사무소', type2: '240610-47-04567', type3: '렌지후드-작동불량-기계', type4: '유지보수', type5: '일상보수', type6: '코오롱글로벌주식회사', type7: '대금지급요청', type8: '', type9: '후드 자동 작동 안됨', },
        { index: 5, type1: '관리사무소', type2: '240610-47-04567', type3: '렌지후드-작동불량-기계', type4: '유지보수', type5: '일상보수', type6: '코오롱글로벌주식회사', type7: '대금지급요청', type8: '', type9: '후드 자동 작동 안됨', },
        { index: 6, type1: '관리사무소', type2: '240610-47-04567', type3: '렌지후드-작동불량-기계', type4: '유지보수', type5: '일상보수', type6: '코오롱글로벌주식회사', type7: '대금지급요청', type8: '', type9: '후드 자동 작동 안됨', },
        { index: 7, type1: '관리사무소', type2: '240610-47-04567', type3: '렌지후드-작동불량-기계', type4: '유지보수', type5: '일상보수', type6: '코오롱글로벌주식회사', type7: '완료확인본부요청', type8: '', type9: '후드 자동 작동 안됨', },
        { index: 8, type1: '관리사무소', type2: '240610-47-04567', type3: '렌지후드-작동불량-기계', type4: '유지보수', type5: '일상보수', type6: '코오롱글로벌주식회사', type7: '대금지급요청', type8: '', type9: '후드 자동 작동 안됨', },
        { index: 9, type1: '관리사무소', type2: '240610-47-04567', type3: '렌지후드-작동불량-기계', type4: '유지보수', type5: '일상보수', type6: '코오롱글로벌주식회사', type7: '대금지급요청', type8: '', type9: '후드 자동 작동 안됨', },
        { index: 10, type1: '관리사무소', type2: '240610-47-04567', type3: '렌지후드-작동불량-기계', type4: '유지보수', type5: '일상보수', type6: '코오롱글로벌주식회사', type7: '공사완료', type8: '54', type9: '후드 자동 작동 안됨', },
        { index: 11, type1: '관리사무소', type2: '240610-47-04567', type3: '렌지후드-작동불량-기계', type4: '유지보수', type5: '일상보수', type6: '코오롱글로벌주식회사', type7: '대금지급요청', type8: '', type9: '후드 자동 작동 안됨', },
        { index: 12, type1: '관리사무소', type2: '240610-47-04567', type3: '렌지후드-작동불량-기계', type4: '유지보수', type5: '일상보수', type6: '코오롱글로벌주식회사', type7: '대금지급요청', type8: '', type9: '후드 자동 작동 안됨', },
        { index: 13, type1: '관리사무소', type2: '240610-47-04567', type3: '렌지후드-작동불량-기계', type4: '유지보수', type5: '일상보수', type6: '코오롱글로벌주식회사', type7: '보수처리중', type8: '', type9: '부부 욕실 바닥 및 벽면 타일 7개 균열', },
      ],
      // 상태 컬러
      STAT_LIST: [
        { code: '보수처리중', value: 'is-txt-green'},
        { code: '완료확인본부요청', value: 'is-txt-green'},
        { code: '공사완료', value: 'is-txt-green'},
      ],
    }
  },
  async created() {
    this.HNO = this.DataProp.HNO;
    this.MGOF_CD = this.DataProp.MGOF_CD;
    this.BLDG_ID = this.DataProp.BLDG_ID;

    this.getHistAsFlwAcp();
    

    //스케줄러 이관 배분상담사 조회
    await this.getScheduleTgtEmp();
    await this.getTgtDeptList();
    await this.getTgtEmpList(this.DEFAULT_TGT);
  },
  async mounted() {
    
  },
  computed: {
    reversedItems() {
      return this.items.slice().reverse();
    },
  },
  watch: {
    DataProp() {
        const hno = this.DataProp.HNO;
        if(this.HNO != hno) {
          this.HNO = hno;
          this.getHistAsFlwAcp();
        }
      },
  },
  methods: {
    //스케줄러 이관 배분상담사 조회
    async getScheduleTgtEmp() {
      this.TGT_DEPT_ID = '';
      this.TGT_DEPT_NM = '';
      this.TGT_EMP_NO = '';
      this.TGT_EMP_NM = '';
      
      let postParam = {
        MGOF_CD: this.MGOF_CD,
        BLDG_ID: this.BLDG_ID
      };
      let headParam = {head: {
        ns: 'lhcs.phone.as.dao.PhoneAsCuttMapper'
      }};
      const response = await this.common_postCall("/api/biz/common/select/selectScheduleTgtEmp", postParam, headParam);
      
      if(response && !response.HEADER.ERROR_FLAG && response.DATA.length > 0) {
        this.DEFAULT_TGT = response.DATA[0];
        this.TGT_DEPT_ID = response.DATA[0].TGT_DEPT_ID;
        this.TGT_DEPT_NM = response.DATA[0].TGT_DEPT_NM;
				this.TGT_EMP_NO = response.DATA[0].TGT_EMP_NO;
        this.TGT_EMP_NM = response.DATA[0].TGT_EMP_NM;
      }
    },

    //팀 목록 조회
    async getTgtDeptList() {
      this.TGT_DEPT_LIST = [];
      
      let postParam = {
        SRCH_TYPE : 'CUSL',
        SRCH_CUSTCO_ID: this.CUSTCO_ID
      };
      let headParam = {head: {
        ns: 'palette3.setting.ognz.dao.OgnzMapper'
      }};
      const response = await this.common_postCall("/api/biz/common/select/selectOgnzByRole", postParam, headParam);
      
      if(response && !response.HEADER.ERROR_FLAG) {
        response.DATA.map(item => {
          if(item.UP_DEPT_ID != '1') {
            this.TGT_DEPT_LIST.push({
              value: item.DEPT_ID,
              text: item.DEPT_NM
            })
          }
        })
      }
    },

    //팀 상담사 목록 조회
    async getTgtEmpList(defaultTgt = null) {
      
      //팀이 선택되었을때만 조회.
      if(this.TGT_DEPT_ID =='') {
        return;
      }

      this.TGT_EMP_LIST = [];
      this.TGT_EMP_NO = '';
      this.TGT_EMP_NM = '';

      this.TGT_DEPT_NM = this.TGT_DEPT_LIST.filter(item => item.value == this.TGT_DEPT_ID)[0].text;
      
      let postParam = {
        USER_STTS_CD : 'WORK',
        SRCH_TYPE : 'CUSL',
        SRCH_DEPT_ID: this.TGT_DEPT_ID
      };
      let headParam = {head: {
        ns: 'lhcs.system.user.dao.UserMapper'
      }};
      const response = await this.common_postCall("/api/biz/common/select/selectUserList", postParam, headParam);
      
      if(response && !response.HEADER.ERROR_FLAG) {
        response.DATA.map(item => {
          this.TGT_EMP_LIST.push({
            value: item.USER_ID,
            text: item.USER_NM
          })
        })
      }
      if(defaultTgt) {
        this.TGT_EMP_NO = defaultTgt.TGT_EMP_NO;
        this.TGT_EMP_NM = defaultTgt.TGT_EMP_NM;
      }
    },

    //상담사 변경 시 상당사명 세팅
    setTgtEmpNm() {
      this.TGT_EMP_NM = this.TGT_EMP_LIST.filter(item => item.value == this.TGT_EMP_NO)[0].text;
    },


    //AS 접수 목록 조회. - 처리상태가 '보수처리중, 보수독촉1, 보수독촉2, 완료신청, 관리소확인요청, 완료확인본부이관, 공사완료'인 경우만 이관 가능.
    async getHistAsFlwAcp() {
      this.HIST_FLW_ACP = [];
      this.FLW_CTS = '';
      
      let postParam = {
          HNO: this.HNO,
          PRCS_CHN_CD: 'ISMAPCMC006', //스케줄러 이관 - where 조건이 추가됨.
      };
      let headParam = {head: {}};
      //(신)AS 접수이력 조회
      const response = await this.common_postCall("/phone-api/as/cutt/selectCotisFlwAcpNewHist", postParam, headParam);
      
      if(response && !response.HEADER.ERROR_FLAG) {
        this.HIST_FLW_ACP = response.DATA;
      }
    },

    //스케줄러 이관
    transSchedule(emerYn) {//tgtEmpId, tgtEmpNo, tgtDeptId, tgtDeptNm,
      if(this.selectedHistFlwAcp.length == 0){
        this.showAlertInfo({msg:"이관할 접수이력을 체크 해주세요."});
        return;
      }else if(this.TGT_EMP_NO == ""){
        this.showAlertInfo({msg:"상담사를 선택해주세요."});
        return;
      }
      
      // console.log("this.TGT_EMP_NM, this.TGT_DEPT_ID, this.TGT_DEPT_NM", this.TGT_EMP_NM, this.TGT_DEPT_ID, this.TGT_DEPT_NM)
      this.$emit('setTransScheduleInfo', this.TGT_EMP_NO, this.TGT_EMP_NM, this.TGT_DEPT_ID, this.TGT_DEPT_NM, this.selectedHistFlwAcp, emerYn)
      this.closeDialog()
    },

    closeDialog() {
      this.$emit("closeDialog");
    }
  },
};
</script>

<style lang="scss" scoped>

</style>