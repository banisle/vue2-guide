<template>
  <div>
    <h3 class="pl-subtit">기본 정보</h3>
    <div class="pl-form-inline-wrap vertical label-80 gap-8 is-mt-m">
      <div class="pl-form-inline">
        <span class="pl-label">공급유형</span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            placeholder="선택"
            :items="mixin_common_code_get(common_code, 'SEOUL_RENT_TP')"
            v-model="SPLY_TYPE_CD"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">시도</span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            placeholder="선택"
            :items="SIGUN_LIST"
            item-text="ZONENAME"
            item-value="ZONEID"
            v-model="SIGUN_CD"
            @change="chgSigun()"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">시군구</span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            placeholder="선택"
            :items="SIGUNGU_LIST"
            item-text="ZONENAME"
            item-value="ZONEID"
            v-model="SIGUNGU_CD"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">단지 명</span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
            v-model="DANJI_NM"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">가구수</span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
            v-model="HH_CNT"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">전용 면적</span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
            v-model="EXCLSV_AREA"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">비고</span>
        <div class="pl-desc">
          <v-textarea
            class="pl-form is-noresize"
            :spellcheck="false"
            placeholder="기타 내용 입력"
            v-model="RMRK"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">정렬 순서</span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle is-sm flex-grow-0"
            v-model="SORT_ORD"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RightRentalManage_TAB03_DIALOG', // 서울지역 임대아파트 상세 정보
  components: {
  },
  data() {
    return {
      common_code: [],

      RENTAL_APT_CRTSTAT_ID:'',

      SIGUN_LIST:[],
      SIGUN_CD:'',      //시군
      SIGUNGU_LIST:[],
      SIGUNGU_CD:'',      //시군구
      DANJI_NM:'',      //단지 명
      SPLY_TYPE_CD:'',  //공급유형
      HH_CNT:'',        //세대 수
      EXCLSV_AREA:'',   //전용면적
      RMRK:'',          //기타 특이사항
      SORT_ORD:'',      //정렬 순서

      MESSAGE: {
        CONFIRM: {
          REGIST: {
            alertDialogToggle: true,
            msg: '임대주택 관리현황을 저장 하시겠습니까?',
            iconClass: 'is-info',
            type: 'confirm',
            callYes: this.saveConfirm,
            callNo: this.closeMsg
          },
        },
        
        ALERT: {
          ALREADY_EXIST: {alertDialogToggle: true, msg: '이미 사용중인 ID 입니다.', iconClass: 'is-caution', type: 'default'},
        },
        ERROR: {
          GET_USER_INFO_FAIL: {
            alertDialogToggle: true,
            msg: '사용자 정보를 가져올 수 없습니다.',
            iconClass: 'is-caution',
            type: 'default'
          },
        },
        TOAST : {
          SUCCESS : {  msg: '처리 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 3000 }
        }
      }
    }
  },
  methods: {
    async stngRentalAptCrtstat(){
      let sUrl = this.RENTAL_APT_CRTSTAT_ID ? '/api/biz/common/update' : '/api/biz/common/insert';
      let postParam = {
        RENTAL_APT_CRTSTAT_ID: this.RENTAL_APT_CRTSTAT_ID,
        SIGUN_CD:this.SIGUNGU_CD ? this.SIGUNGU_CD : this.SIGUN_CD,         //시군구
        SPLY_TYPE_CD:this.SPLY_TYPE_CD,  //공급유형
        DSTRCT_NM:this.DSTRCT_NM,     //지구 명
        DANJI_NM:this.DANJI_NM,      //단지 명
        SPLY_TYPE_CD:this.SPLY_TYPE_CD,  //공급유형
        HH_CNT:this.HH_CNT,        //세대 수
        EXCLSV_AREA:this.EXCLSV_AREA,   //전용면적
        RMRK:this.RMRK,          //기타 특이사항
        SORT_ORD:this.SORT_ORD,      //정렬 순서
      }
      let headParam = {
        head: {
          ns : 'lhcs.rentalHusMng.rentalAptCrtstat.dao.rentalAptCrtstatMapper'
          , sn : this.RENTAL_APT_CRTSTAT_ID ? 'updateRentalAptCrtstat' : 'insertRentalAptCrtstat'
          , seq_key: this.RENTAL_APT_CRTSTAT_ID ? '' : 'RENTAL_APT_CRTSTAT_ID'
        }
      }

      let resData = await this.common_postCall(sUrl,postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.$emit('srchRentalAptCrtstat');
      }
    },
    
    //임대주택관리현황 조회
    async srchCommZoneex(parentId){
      let sUrl = '/api/biz/common/select';
      let postParam = {
        PARENTID: parentId,       //본부
      }
      let headParam = {
        head: {
          ns : 'lhcs.rentalHusMng.rentalAptCrtstat.dao.rentalAptCrtstatMapper'
          , sn : 'srchCommZoneex'
        }
      }

      let resData = await this.common_postCall(sUrl,postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){
        return resData.DATA;
      }

    },

    async chgSigun(){
      this.SIGUNGU_LIST = await this.srchCommZoneex(this.SIGUN_CD);
    },

    async initRentalAptCrtstat(){
      this.RENTAL_APT_CRTSTAT_ID='';

      this.SIGUN_CD='';      //시군
      this.SIGUNGU_CD='';    //시군구
      this.DANJI_NM='';      //단지 명
      this.SPLY_TYPE_CD='';  //공급유형
      this.HH_CNT='';        //세대 수
      this.EXCLSV_AREA='';   //전용면적
      this.RMRK='';          //기타 특이사항
      this.SORT_ORD='';      //정렬 순서

      this.SIGUN_LIST = await this.srchCommZoneex(0);
    },

    async setRentalAptCrtstat(item){
      this.RENTAL_APT_CRTSTAT_ID=item.RENTAL_APT_CRTSTAT_ID;

      this.SIGUN_LIST = await this.srchCommZoneex(0);
      this.SIGUN_CD=item.SIGUN_CD;      //단지 명
      this.SIGUNGU_LIST = await this.srchCommZoneex(item.SIGUN_CD);
      this.SIGUNGU_CD=item.SIGUNGU_CD;      //단지 명
      this.DANJI_NM=item.DANJI_NM;      //단지 명
      this.HUSIN_DAY=item.HUSIN_DAY;     //입주일
      this.SPLY_TYPE_CD=item.SPLY_TYPE_CD;  //공급유형
      this.HH_CNT=item.HH_CNT;        //세대 수
      this.EXCLSV_AREA=item.EXCLSV_AREA;   //전용면적
      this.RMRK=item.RMRK;          //기타 특이사항
      this.SORT_ORD=item.SORT_ORD;      //정렬 순서
    }
  },
  mounted() {
  },
  async created() {
    //공통코드설정
    let codeName = ['SEOUL_RENT_TP'];
    this.common_code = await this.mixin_common_code_get_all(codeName);
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>