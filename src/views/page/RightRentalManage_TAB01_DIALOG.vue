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
            @change="chgHdqt()"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">담당부서</span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            placeholder="선택"
            :items="TKCG_DEPT_LIST"
            v-model="TKCG_DEPT_CD"
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
        <span class="pl-label">공급유형</span>
        <div class="pl-desc">
          <v-select
            class="pl-form type-middle"
            placeholder="선택"
            :items="mixin_common_code_get(common_code, 'RENT_TP')"
            v-model="SPLY_TYPE_CD"
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
        <span class="pl-label">전용면적</span>
        <div class="pl-desc">
          <v-text-field
            class="pl-form type-middle"
            v-model="EXCLSV_AREA"
          />
        </div>
      </div>
      <div class="pl-form-inline">
        <span class="pl-label">부도임대 여부</span>
        <div class="pl-desc">
          <v-checkbox
            class="pl-check"
            label="(부도임대인 경우 체크 하십시오.)"
            input-value="true"
            v-model="BKRC_RENTAL_YN"
          ></v-checkbox>
        </div>
      </div>
    </div>
    <div class="is-border-sub-top pt-3 is-mt-m">
      <h3 class="pl-subtit">연락처 정보</h3>
      <div class="pl-form-inline-wrap vertical label-80 gap-8 is-mt-m">
        <div class="pl-form-inline">
          <span class="pl-label">관리소 전화번호</span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle"
              v-model="MNGOFC_PHN_NO"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">주소</span>
          <div class="pl-desc">
            <v-text-field
              class="pl-form type-middle"
              v-model="ADDR"
            />
          </div>
        </div>
        <div class="pl-form-inline">
          <span class="pl-label">기타 특이사항</span>
          <div class="pl-desc">
            <v-textarea
              class="pl-form is-noresize"
              :spellcheck="false"
              placeholder="기타 내용 입력"
              v-model="RMRK"
            />
          </div>
        </div>

      </div>
    </div>
    <div class="is-border-sub-top pt-3 is-mt-m">
      <div class="pl-form-inline-wrap vertical label-80 gap-8">
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
  </div>
</template>

<script>
export default {
  name: 'RightRentalManage_TAB01_DIALOG', // 임대주택 상세
  components: {
  },
  data() {
    return {
      common_code: [],

      RENTAL_HUS_MNG_ID:'',

      HDQT_CD:'',       //본부
      TKCG_DEPT_CD:'',  //담당부서
      TKCG_DEPT_LIST:[],  //담당부서 리스트
      DSTRCT_NM:'',     //지구 명
      DANJI_NM:'',      //단지 명
      HUSIN_DAY:'',     //입주일
      SPLY_TYPE_CD:'',  //공급유형
      HH_CNT:'',        //세대 수
      EXCLSV_AREA:'',   //전용면적
      BKRC_RENTAL_YN:true,//부도임대 여부
      MNGOFC_PHN_NO:'', //관리소 전화번호
      ADDR:'',          //주소
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
    async chgHdqt(){
      this.TKCG_DEPT_CD = '';
      this.TKCG_DEPT_LIST = [];

      let hdqtCodeNm = [];
      hdqtCodeNm[0] = this.HDQT_CD;
      let hdqtCode = await this.mixin_common_code_get_all(hdqtCodeNm);
      this.TKCG_DEPT_LIST = this.mixin_common_code_get(hdqtCode,this.HDQT_CD);
    },

    async stngRentalHusMng(){
      let sUrl = this.RENTAL_HUS_MNG_ID ? '/api/biz/common/update' : '/api/biz/common/insert';
      let postParam = {
        RENTAL_HUS_MNG_ID: this.RENTAL_HUS_MNG_ID,
        HDQT_CD: this.HDQT_CD,       //본부
        TKCG_DEPT_CD:this.TKCG_DEPT_CD,  //담당부서
        SPLY_TYPE_CD:this.SPLY_TYPE_CD,  //공급유형
        DSTRCT_NM:this.DSTRCT_NM,     //지구 명
        DANJI_NM:this.DANJI_NM,      //단지 명
        HUSIN_DAY:this.HUSIN_DAY,     //입주일
        SPLY_TYPE_CD:this.SPLY_TYPE_CD,  //공급유형
        HH_CNT:this.HH_CNT,        //세대 수
        EXCLSV_AREA:this.EXCLSV_AREA,   //전용면적
        BKRC_RENTAL_YN:this.BKRC_RENTAL_YN == true ? 'Y' : 'N',//부도임대 여부
        MNGOFC_PHN_NO:this.MNGOFC_PHN_NO, //관리소 전화번호
        ADDR:this.ADDR,          //주소
        RMRK:this.RMRK,          //기타 특이사항
        SORT_ORD:this.SORT_ORD,      //정렬 순서
      }
      let headParam = {
        head: {
          ns : 'lhcs.rentalHusMng.rentalHusMng.dao.rentalHusMngMapper'
          , sn : this.RENTAL_HUS_MNG_ID ? 'updateRentalHusMng' : 'insertRentalHusMng'
          , seq_key: this.RENTAL_HUS_MNG_ID ? '' : 'RENTAL_HUS_MNG_ID'
        }
      }

      let resData = await this.common_postCall(sUrl,postParam,headParam)
      if(!resData.HEADER.ERROR_FLAG){
        this.showToast(this.MESSAGE.TOAST.SUCCESS);
        this.$emit('srchRentalHusMng');
      }
    },

    initRentalHusMng(){
      this.RENTAL_HUS_MNG_ID='';

      this.HDQT_CD='';       //본부
      this.TKCG_DEPT_CD='';  //담당부서
      this.TKCG_DEPT_LIST=[];  //담당부서 리스트
      this.DSTRCT_NM='';     //지구 명
      this.DANJI_NM='';      //단지 명
      this.HUSIN_DAY='';     //입주일
      this.SPLY_TYPE_CD='';  //공급유형
      this.HH_CNT='';        //세대 수
      this.EXCLSV_AREA='';   //전용면적
      this.BKRC_RENTAL_YN='';//부도임대 여부
      this.MNGOFC_PHN_NO=''; //관리소 전화번호
      this.ADDR='';          //주소
      this.RMRK='';          //기타 특이사항
      this.SORT_ORD='';      //정렬 순서
    },

    setRentalHusMng(item){
      this.RENTAL_HUS_MNG_ID=item.RENTAL_HUS_MNG_ID;

      this.HDQT_CD=item.HDQT_CD;       //본부
      this.chgHdqt();
      this.TKCG_DEPT_CD=item.TKCG_DEPT_CD;  //담당부서
      this.DSTRCT_NM=item.DSTRCT_NM;     //지구 명
      this.DANJI_NM=item.DANJI_NM;      //단지 명
      this.HUSIN_DAY=item.HUSIN_DAY;     //입주일
      this.SPLY_TYPE_CD=item.SPLY_TYPE_CD;  //공급유형
      this.HH_CNT=item.HH_CNT;        //세대 수
      this.EXCLSV_AREA=item.EXCLSV_AREA;   //전용면적
      this.BKRC_RENTAL_YN=item.BKRC_RENTAL_YN == 'Y' ? true : false ;//부도임대 여부
      this.MNGOFC_PHN_NO=item.MNGOFC_PHN_NO; //관리소 전화번호
      this.ADDR=item.ADDR;          //주소
      this.RMRK=item.RMRK;          //기타 특이사항
      this.SORT_ORD=item.SORT_ORD;      //정렬 순서
    }
  },
  mounted() {
  },
  async created() {
    //공통코드설정
    let codeName = ['HEAD_OFFICE', 'RENT_TP'];
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