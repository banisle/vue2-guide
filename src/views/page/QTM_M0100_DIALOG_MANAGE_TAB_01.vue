<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="px-3 py-3 pl-scroll-body" style="height: 300px;">
    <template v-if="TypeProp.q_type === 'D'">  <!-- 주관식 -->
      <template v-if="TypeProp.a_type2 === 'ISMHEVANSD001'"> <!-- 단답형' -->
        <table class="pl-tbl-detail">
          <colgroup>
            <col width="100px" />
            <col width="" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row" class="font-weight-bold text-center">정답</th>
              <td>
                <v-text-field
                  v-model="DataProp[0].QSTN_ANSW"
                  class="pl-form "
                  style="width: 100%"
                  />
              </td>
            </tr>
            <tr>
              <th scope="row" class="font-weight-bold text-center">설정</th>
              <td class="py-2">
                <div class="pl-form-inline-wrap vertical type-auto gap-8 ml-1">
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      정답 옵션
                    </span>
                    <div class="pl-desc">
                      <div class="pl-selection-row">
                        <!-- 
                        <v-checkbox
                          v-model="chk01.selected"
                          v-for="(chk01, index) in chkTypes"
                          :key="index"
                          :label="chk01.text"
                          class="pl-check "
                        ></v-checkbox>-->

                        <!--chkTypes: [
                          { text: "공백 무시", selected: true, },
                          { text: "대소문자 무시", selected: false, },
                        ],-->

                        <v-checkbox v-model="DataProp[0].SPACE_YN" label="공백무시" class="pl-check" true-value="Y" false-value="N"></v-checkbox>
                        <v-checkbox v-model="DataProp[0].CASE_YN"  label="대소문자무시" class="pl-check" true-value="Y" false-value="N"></v-checkbox>

                      </div>
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label">
                      삭제 문자
                    </span>
                    <div class="pl-desc">
                      <v-text-field
                        v-model="DataProp[0].DEL_CHK_STR"
                        class="pl-form "
                        style="width: 100%"
                        />
                    </div>
                  </div>
                  <div class="pl-form-inline">
                    <span class="pl-label pt-0">
                      동일 답안
                    </span>
                    <div class="pl-desc">
                      <div class="d-flex flex-column">
                        <v-text-field
                          v-model="DataProp[0].REPLACE_STR"
                          class="pl-form"
                          style="width: 100%; flex: 0"
                          />
                        <ul class="pl-list-info mt-2">
                          <li>동일 답안은 콤마(“,”)로 구분 하여야 합니다.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-if="TypeProp.a_type2 === 'ISMHEVANSD002'">  <!-- 서술형 -->
        <ul class="pl-list-info mt-2">
          <li>주관식 서술형은 문제만 입력하시고, 필요에 따라 해설을 입력하시고 문항을 저작하십시오.</li>
        </ul>
      </template>
    </template>
    <!-- 객관식  <tr v-for="item,index in DataProp.answer_list" :key="item.id"> -->
    <template v-else>
      <table class="pl-tbl-detail">
        <colgroup>
          <col width="100px" />
          <col width="" />
        </colgroup>
        <tbody>
          <tr v-for="item, index in DataProp" :key="item.EXMP_SEQ_NO">
            <th scope="row">
              <div
                style="position: relative; height: 100%;"
                class="d-flex pl-hover-wrap pt-2 fill-height">
                <!-- 객관식 보기 영역 :disabled="TypeProp.a_type2 === 'ISMHEVANSS001' && localAnswList.length >= 1"  -->
                <v-checkbox
                  class="pl-check"
                  v-model="AnswList"
                  :value="index + 1"
                  @click="handleCheckboxClick(index)"                  
                  >
                  <template v-slot:label>
                    <span>보기</span>
                    <span                       
                      class="ml-1"
                      style="flex: 0 0 16px; border-radius: 50%; border: 1px solid rgb(110 110 110); 
                      display: inline-flex; width: 16px; height: 16px; text-align: center; 
                      justify-content: center; font-size: 12px; align-items: center;" >
                      {{ index + 1}}
                    </span>
                  </template>
                </v-checkbox>
                <div class="pl-hover-func spacing-wrap sp-4" style="position: absolute; left: 0; bottom: 4px; ">
                  <!-- list up 버튼 @btnClick="mixin_testLog('list up ')" -->
                  <compo-tooltip-btn
                    TitleProp="위로"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 is-list-up2"
                    :MinWidthProp=22
                    :HeightProp=22
                    TooltipPositionProp="bottom"
                    @btnClick="exmpUp(index)"
                  ></compo-tooltip-btn>
                  <!-- list down 버튼 -->
                  <compo-tooltip-btn
                    TitleProp="아래로"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 is-list-down2"
                    :MinWidthProp=22
                    :HeightProp=22
                    TooltipPositionProp="bottom"
                    @btnClick="exmpDown(index)"
                  ></compo-tooltip-btn>
                  <!-- 삭제 버튼 @btnClick="mixin_testLog('list down')" -->
                  <compo-tooltip-btn
                    TitleProp="보기 삭제"
                    ClassProp="pl-tooltip-btn"
                    IconProp="pl-icon20 red-close"
                    :MinWidthProp=22
                    :HeightProp=22
                    TooltipPositionProp="bottom"
                    v-model="item.EXMP_SEQ_NO"
                    @btnClick="delQtExmpDataFn(index)"
                  ></compo-tooltip-btn>
                </div>
              </div>
            </th>
            <td class="has-textarea">
              <v-textarea
                class="pl-form is-noresize"
                :value="item.EXMP_WORD"
                v-model="item.EXMP_WORD"
                :spellcheck="false"
                height="60"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'QTM_M0100_DIALOG_MANAGE_TAB_01', //평가지 문항 관리 - 보기/답란
  props:{    
    DataProp: {
      type: Object,
      required: true
    },
    TypeProp: {
      type: Object
    },
    AnswList:{  // AnswList 같은 이름으로 props를 받겠다고 명시
      type: Array
    }
  },
  
  components: {
  },
  data() {
    return {

      chkTypes: [
        { text: "공백 무시", selected: true, },
        { text: "대소문자 무시", selected: false, },
      ],

      selectedExmpIndex: 0,
      selectedExmpItem: [], 
      pop_answ_list: [],

      QSTN_LEVEL: '',

      localAnswList: this.AnswList || [],

      //알림창 메시지
      MESSAGE : {
        CONFIRM :{          
          DELETE : { alertDialogToggle : true, msg : '선택한 보기를 삭제 하시겠습니까?', iconClass:'is-info', type :'confirm', callYes: this.delQtExmpData, callNo:this.closeMsg},             
        },
        ALERT : {
          SPOINT : {alertDialogToggle: true, msg: '첫 번째 보기입니다.', iconClass: 'is-info', type: 'default'}
          , EPOINT : {alertDialogToggle: true, msg: '마지막 번째 보기입니다.', iconClass: 'is-info', type: 'default'}    
          , SAVE_FAIL02:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '보기 정보는 필수 등록 항목입니다.' }      
          , SAVE_FAIL03:{ alertDialogToggle: true, iconClass: 'is-info', type: 'default', msg: '보기 정답 정보는 필수 선택 항목입니다.' }
        },
        TOAST : {          
          DEL_SUCCESS: {  msg: '보기 정보가 삭제 되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },

        ERROR: {
          ERROR:
            { alertDialogToggle: true, iconClass: 'is-caution', type: 'default', msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', },
        }
      }
    }
  },
  methods: {    
    
    handleCheckboxClick(index) {      

      if (this.TypeProp.a_type2 === 'ISMHEVANSS001' && ( this.AnswList.length > 1 || this.pop_answ_list.length > 1 )) {        
        //this.localAnswList = this.localAnswList.filter(item => item !== index + 1);
        this.pop_answ_list = this.pop_answ_list.filter(item => item !== index + 1);
        this.AnswList = this.AnswList.filter(item => item !== index + 1);
        /*
        this.showAlert({
          alertDialogToggle: true,
          msg: '단일 선택시 보기 정답은 1개만 가능합니다.',
          iconClass: 'is-caution',
          type: 'default'
        });    
        */       
        this.showToastInfo({msg : '단일 선택시 보기 정답은 1개만 가능합니다.'});
        return;
      }else{        
        this.$emit('onChangeAnswList', this.pop_answ_list);
      }            
    },

    // 선택 삭제 
    delQtExmpDataFn(index){      
      this.selectedExmpIndex = index;      
      this.selectedExmpItem = this.DataProp;
      if(this.selectedExmpItem.length == 1){
        this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL02);
        return;
      }else{
        this.showAlert(this.MESSAGE.CONFIRM.DELETE);
      }      
    },

    delQtExmpData(){ 
      if(this.pop_answ_list.length <= 1 && this.DataProp.length <= 1 ){
        this.showAlert(this.MESSAGE.ALERT.SAVE_FAIL03);
      }else{               
        this.qtEmpDel();
      }
    },

    async qtEmpDel(){
      this.selectedExmpItem.splice(this.selectedExmpIndex,1);
      let sUrl = '/phone-api/qt/evalQstnExmpDelProc';
      let postParam = {
        DEL_EXMP_SEQ_NO: this.selectedExmpIndex+1,
        QSTN_ANSW : this.pop_answ_list.join(","),
        QSTN_NO: this.selectedExmpItem[0].QSTN_NO,        
        addExmpList:  this.selectedExmpItem    
      };      
      let headParam = { head : {
        DATA_OBJECT: "addExmpList"
      }};
      let response  = await this.common_postCall(sUrl, postParam, headParam);

      if(!response.HEADER.ERROR_FLAG) {
        this.showToast(this.MESSAGE.TOAST.DEL_SUCCESS);   

      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }      
      this.closeAlert();
    },   

    //보기 위로 올림    
    exmpUp(index) { 
      // 첫 번째 위로 올림 예외처리
      if (index === 0) {
        this.showAlert(this.MESSAGE.ALERT.SPOINT);        
        return;
      }
      this.$emit("onChangeIndex", false, index);           
    },

    // 보기 아래로 내림
    exmpDown(index) {
      // 마지막 아래로 내림 예외처리
      if (index === this.DataProp.length - 1) {          
          this.showAlert(this.MESSAGE.ALERT.EPOINT);
          return;
      }
      this.$emit("onChangeIndex", true, index);
    },
    closeMsg(){     
      this.$store.commit("alertStore/hideAlert");
    },
    
    initData(){
      this.$props.DataProp = [];
    }

  },
  mounted() {    
    //this.selectedExmpItem. ;
    
  },
  created() {
  },
  computed: {    
    //this.DataProp = this.DataProp
  },
  watch: {    
    AnswList:function(val){       
      val = val === null ? [] : val;
      this.pop_answ_list = val;
      this.$emit('onChangeAnswList', val);          
    }
  },
};
</script>

<style lang="scss" scoped>

</style>