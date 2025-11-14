<template slot="body">
    <compo-dialog
        header-title="개인 정보"
        :HideCloseProp=false
    >
      <template slot="body">
        <div>
          <div class="d-flex">
            <div class="pl-top-profile-dialog-img-wrap">
              <v-icon small class="pl-icon29 camera" @click="changeProflieImg()" v-if="mixin_isEmpty(computedSrcDlgtUser.USER_ID)/*본인인경우(위임받은자x)*/"></v-icon>
              <input ref="fileUpload" type="file" @change="handleFileUpload()" style="display: none" />
              <img :src="USER_PROFILE.IMG" :alt="USER_PROFILE.USER_NM" @error="function(e){e.target.src=require('@/assets/img/@profile_user.png')}" />
            </div>
            <div class="pl-top-profile-dialog-desc-wrap ml-6">
              <strong style="font-size: 15px">{{ USER_PROFILE.USER_NM }}</strong>
              <span class="is-txt-sub ml-1">{{ (USER_PROFILE.JBPS_CD_NM!= '' && USER_PROFILE.JBPS_CD_NM!= '-')?USER_PROFILE.JBPS_CD_NM:USER_PROFILE.atrtGroupNm }}</span>
              <div>
                {{ USER_PROFILE.DEPT_NM }}
              </div>
              <div>내선({{ USER_PROFILE.EXT_NO}})<span class="pl-unit">&bull;</span>IP {{ USER_PROFILE.CNTN_IP }}</div>
            </div>
            <v-btn
                @click="closeProfile"
                plain
                min-width="22"
                height="22"
                class="pl-tooltip-btn ml-auto"
            >
              <v-icon
                  small
                  class="pl-icon20 dialog-close-black">
              </v-icon>
            </v-btn>
          </div>
          <!-- <div class="is-mt-m pt-3 is-border-sub-top">
            <div class="d-flex flex-column" style="gap: 4px" >
              <div class="d-flex">
                <v-icon class="pl-icon20 calendar-place" style="flex: 0 0 20px"></v-icon>
                <span v-if="USER_PROFILE.OFC_ADDR !== '' && USER_PROFILE.OFC_ADDR !== ' '">
                  <span class="ml-1">{{USER_PROFILE.OFC_ADDR}}</span>
                </span>
              </div>
              <div>
                <v-icon class="pl-icon20 email"></v-icon>
                <span v-if="USER_PROFILE.EML !== ''">
                  <span class="ml-1">{{USER_PROFILE.EML}}</span>
                </span>
              </div>
              <div>
                <v-icon class="pl-icon20 phone-line"></v-icon>
                <span v-if="USER_PROFILE.PHN_NO !== ''">
                  <span class="ml-1">{{USER_PROFILE.PHN_NO}}</span>
                </span>
              </div>
            </div>
          </div> -->
        </div>
      </template>
      <template slot="footer">
        <v-btn class="pl-btn is-sub mr-auto mb-2" @click="[mixin_showDialog('Password'), initPswdVar()]" v-if="mixin_isEmpty(computedSrcDlgtUser.USER_ID)/*본인인경우(위임받은자x)*/">비밀번호 변경</v-btn>
        <span class="pl-badge is-bg-red mr-auto" style="cursor: pointer;" v-if="!mixin_isEmpty(computedSrcDlgtUser.USER_ID)/*위임받은자*/" @click="mixin_loginDlgt(computedSrcDlgtUser.LGN_ID, computedSrcDlgtUser.USER_ID, null, 'N')">위임받은 계정 (나의 계정으로)</span>
        <v-btn class="pl-btn is-icon mb-2" @click="logout()" style="margin-left: 20px;"> <span class="pl-icon20 logout"></span> 로그아웃 </v-btn>
      </template>
    </compo-dialog>
</template>

<script>
import axios from "axios";
import { ipronCallUtil } from "@/store/ipronCallUtil.js";
export default {
  name: 'TopAreaProfile',
  props: {
  },
  components: {
  },
  data() {
    return {
      USER_PROFILE:this.$store.getters["userStore/GE_USER_ROLE"],
    }
  },
  created() {

  },
  mounted() {

    console.log( this.USER_PROFILE.BLDG_PSTN !== '' );
  },

  methods: {

    // 프로필 이미지
    changeProflieImg() {
      this.$refs.fileUpload.click();
    },
    // 실제 파일을 서버에 업로드 하는 부분
    handleFileUpload(event){

      const file = this.$refs.fileUpload.files;

      console.log( file );

      if (file.length > 0 && this.isValidFiles(file)) {
        // 파일 업로드
        this.PROFILE_FILE = file;
        // console.log("file",file)
        this.showAlert({
          alertDialogToggle: true,
          msg: '프로필 사진을 변경 하시겠습니까?',
          iconClass: 'is-info',
          type: 'confirm',
          callYes: this.uploadProfileYes,
          callNo: this.closeProfileConfirm
        });
      }



    },

    uploadProfileYes(){

      this.uploadFiles(this.PROFILE_FILE);

    },

    isValidFiles(files) {
      // 파일 개수 제한을 설정
      // console.log("file in vlidate",files[0])
      // console.log("file in vlidate",files.length)
      const maxFileCount = 1;
      if (files.length > maxFileCount) {
        alert(`최대 ${maxFileCount}개의 파일까지 업로드할 수 있습니다.`);
        return false;
      }
      // 파일 크기 및 형식을 설정 (대소문자 구분)
      const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // console.log(files[0])
        if (!allowedFileTypes.includes(file.type)) {
          alert('지원하지 않는 파일 형식입니다.');
          return false;
        }
        if (file.size > maxFileSize) {
          alert('파일 크기가 허용 범위를 초과합니다.');
          return false;
        }
      }

      return true;
    },

    //파일 업로드
    uploadFiles(files) {
      let busiType = 'profile';
      let pathType = 'images';
      let uploadUrl = "/api/file/"+ busiType +"/"+ pathType +"/uploads";

      //파일 제한 체크 (빽엔드에서 체크 후 업로드 실패)
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {

        formData.append('action', uploadUrl);
        formData.append('method', "post");
        formData.append('custcoId', this.$store.getters['userStore/GE_USER_ROLE'].company.CD);                 //회사구분 : 1은 시스템(가이드)
        formData.append('userfiles', files[i]);           //파일(바이너리)
        formData.append('userId', this.$store.getters['userStore/GE_USER_ROLE'].userId);                   //사용자 ID : 2는 시스템(가이드)

        for (let key of formData.keys()) {
          // console.log("formData key",key);
        }

        /* value 확인하기 */
        for (let value of formData.values()) {
          // console.log("formData val",value);
        }

        axios
            .post(uploadUrl, formData, {headers:{Authorization: "bearer " + window.sessionStorage.getItem("token")}})
            .then(response => {
              // 파일 업로드 성공 시 처리
              // console.log("response.dataresponse.dataresponse.dataresponse.data",response.data);
              this.uploadProfile(response.data.data[0].fileGroupKey)
              this.PROFILE_FILE = null;

              // response.data.data[0].fileGroupKey
            })
            .catch(error => {
              // 파일 업로드 실패 시 처리
              console.error(error);
              this.$store.commit("alertStore/hideAlert");
            });
      }
      // 서버로 파일 업로드 요청을 보냅니다.
    },


    /* 사용자 테이블의 icon 컬럼에 파일 그룹 키 업로드 */

    async uploadProfile(fileGroupKey){
      let sURL = '/api/setting/agent/profile/updateProfile';
      let postParams ={
        REG_USER_ID : this.$store.getters["userStore/GE_USER_ROLE"].userId,
        ICON : fileGroupKey,
      };
      let headParams = {
        head:{}
      };

      let response = await this.common_postCall(sURL, postParams, headParams);

      if(response.HEADER.ERROR_FLAG){
        this.showAlert(this.MESSAGE.ERROR)
      }else{
        this.closeProfileConfirm();
        this.$emit('getUserInfo');
      }
    },

    /*****************************
     비밀번호 변경
     *****************************/
    initPswdVar(){
      this.mixin_hideDialog('Profile');
      this.$emit('changePswd')
    },
    logout(msg) {

      //Arthur.Kim 2022.05.18
      this.$eventBus.busStompDisconnect();

      if (ipron.IsConnected()) {
        // ipronCallUtil.closeServer();
        const ctiNum = Number(this.CTI_CALL_STAT.replace(/[^0-9]/g, ''));
        if(ctiNum > 1){
          ipronCallUtil.logoutAgent();
        }
        ipron.CloseServer();
      }

      this.$store
          .dispatch("authStore/AC_AUTH_LOGOUT", { id: this.userId })
          .then((response) => {
            if (this.mixin_check_repsonse(response) === true) {
              console.log("######### 로그아웃 성공");
            }

            // this.$store.commit("alertStore/INIT");
            // this.$store.commit("toastStore/INIT");

            //API가 정상처리 되지 않아도 세션 삭제 후 로그인 페이지로 이동 시킨다
            window.sessionStorage.clear();
            if( msg == undefined ) msg = "";
            this.$router.push("/login?m="+msg);
            window.location.reload(true);
          })
          .catch((err) => {
            window.sessionStorage.clear();
            this.$router.push("/login");
            window.location.reload(true);
            console.log("######### 로그아웃 에러");

            // this.errorMessage = err.response.data.errormessage;
          });
    },
    closeProfile(){
      this.$emit('Close');
      this.closeProfileConfirm();
    },
    closeProfileConfirm(){
      this.$refs.fileUpload.value = '';
      this.$store.commit("alertStore/hideAlert");
    },
  },

  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>