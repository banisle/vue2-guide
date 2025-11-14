<template>
  <div>
    <h3 class="pl-subtit">기본 정보</h3>
    <div class="pl-form-inline-wrap vertical label-80 gap-8 is-mt-m">
      <div class="pl-form-inline">
        <span class="pl-label">본부</span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            placeholder="선택"
            :items="mixin_common_code_get(common_code, 'HEAD_OFFICE')"
            v-model="HDQT_CD"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">지구 명</span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
            v-model="DSTRCT_NM"
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
        <span class="pl-label">입주일</span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
            v-model="HUSIN_DAY"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">관리소 번호</span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
              v-model="MNGOFC_PHN_NO"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">세대 수</span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
            v-model="HH_CNT"
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
  name: 'RightRentalManage_TAB02_DIALOG', // 분양아파트 관리사무소 상세 정보
  components: {
  },
  data() {
    return {
      common_code: [],

      MNGOFC_PHN_NO_ID:'',

      HDQT_CD:'',       //본부
      DSTRCT_NM:'',     //지구 명
      DANJI_NM:'',      //단지 명
      HUSIN_DAY:'',     //입주일
      MNGOFC_PHN_NO:'', //관리소 전화번호
      HH_CNT:'',        //세대 수
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
    async stngMngofcPhnNo(){
      let sUrl = this.MNGOFC_PHN_NO_ID ? '/api/biz/common/update' : '/api/biz/common/insert';
      let postParam = {
        MNGOFC_PHN_NO_ID: this.MNGOFC_PHN_NO_ID,
        HDQT_CD: this.HDQT_CD,       //본부
        DSTRCT_NM:this.DSTRCT_NM,     //지구 명
        DANJI_NM:this.DANJI_NM,      //단지 명
        HUSIN_DAY:this.HUSIN_DAY,     //입주일
        HH_CNT:this.HH_CNT,        //세대 수
        MNGOFC_PHN_NO:this.MNGOFC_PHN_NO, //관리소 전화번호
        RMRK:this.RMRK,          //기타 특이사항
        SORT_ORD:this.SORT_ORD,      //정렬 순서
      }
      let headParam = {
        head: {
          ns : 'lhcs.rentalHusMng.MngofcPhnNo.dao.MngofcPhnNoMapper'
          , sn : this.MNGOFC_PHN_NO_ID ? 'updateMngofcPhnNo' : 'insertMngofcPhnNo'
          , seq_key: this.MNGOFC_PHN_NO_ID ? '' : 'MNGOFC_PHN_NO_ID'
        }
      }

      let resData = await this.common_postCall(sUrl,postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.$emit('srchMngofcPhnNo');
      }
    },

    initMngofcPhnNo(){
      this.MNGOFC_PHN_NO_ID='';

      this.HDQT_CD='';       //본부
      this.DSTRCT_NM='';     //지구 명
      this.DANJI_NM='';      //단지 명
      this.HUSIN_DAY='';     //입주일
      this.MNGOFC_PHN_NO=''; //관리소 전화번호
      this.HH_CNT='';        //세대수
      this.RMRK='';          //기타 특이사항
      this.SORT_ORD='';      //정렬 순서
    },

    setMngofcPhnNo(item){
      this.MNGOFC_PHN_NO_ID=item.MNGOFC_PHN_NO_ID;

      this.HDQT_CD=item.HDQT_CD;       //본부
      this.DSTRCT_NM=item.DSTRCT_NM;     //지구 명
      this.DANJI_NM=item.DANJI_NM;      //단지 명
      this.HUSIN_DAY=item.HUSIN_DAY;     //입주일
      this.MNGOFC_PHN_NO=item.MNGOFC_PHN_NO; //관리소 전화번호
      this.HH_CNT=item.HH_CNT;        //세대수
      this.RMRK=item.RMRK;          //기타 특이사항
      this.SORT_ORD=item.SORT_ORD;      //정렬 순서
    }
  },
  mounted() {
  },
  async created() {
    //공통코드설정
    let codeName = ['HEAD_OFFICE'];
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