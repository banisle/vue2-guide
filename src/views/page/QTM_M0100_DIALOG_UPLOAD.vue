<template>
  <div>
    <div class="pl-form-inline-wrap">
      <div class="pl-form-inline">
        <span class="pl-label">
          업로드 파일
        </span>
        <div class="pl-desc">
          <!-- 버튼 형식 -->
          <input ref="fileUpload" type="file" multiple accept=".xlsx,.xls" @change="handleFileUpload" style="display: none" />
          <!-- 파일 목록 -->
          <div
            class="d-flex align-center pl-rounded-box px-3 py-1 is-bg-light"
            style="width: 600px;"
            >
            <span v-for="(file, index) in uploadedFiles" :key="index" class="">
              <template v-if="uploadedFiles.length !== 0">
                {{ getFileExtension(file.name)[0] }}<strong>.{{ getFileExtension(file.name)[1] }}</strong>
                <v-icon x-small class="pl-icon tab-close ml-1" @click="removeFile(index)"></v-icon>
              </template>
            </span>
            <span v-if="uploadedFiles.length === 0" class="is-txt-sub">일괄 업로드 파일 선택</span>
            <compo-tooltip-btn
              TitleProp="일괄 업로드"
              :MinWidthProp="22"
              :HeightProp="22"
              ClassProp="pl-tooltip-btn ml-auto"
              IconProp="pl-icon20 upload-all"
              TooltipPositionProp="bottom"
              @btnClick="clickAddFiles"
            ></compo-tooltip-btn>
            
          </div>
          <span class="ml-1">1개의 파일만 업로드 할 수 있으며, 확장자는 “xlsx”, “xls”만 업로드 할 수 있습니다.</span>
        </div>
      </div>
    </div>
    <!-- grid -->
    <v-data-table
      class="pl-grid is-mt-m"
      :headers="dynamicHeaders"
      :items="items"
      fixed-header
      item-key="index"
      height="562px"
      :items-per-page="ROW_PER_PAGE"
      hide-default-footer
      no-data-text="등록된 데이터가 없습니다."
      >
      <template v-slot:item.VALID_MSG="{ item }">
        <div style="white-space: normal;" v-html="item.VALID_MSG">
        </div>
      </template>
      <template v-slot:item.type06="{ item }">
        <div style="white-space: normal;">
          {{ item.type06 }}
        </div>
      </template>
      <!--
      <template v-slot:item.type09="{ item }">
        <div style="white-space: normal;">
          {{ item.type09 }}
        </div>
      </template>
      <template v-slot:item.type10="{ item }">
        <div style="white-space: normal;">
          {{ item.type10 }}
        </div>
      </template>
      <template v-slot:item.type11="{ item }">
        <div style="white-space: normal;">
          {{ item.type11 }}
        </div>
      </template>
      <template v-slot:item.type12="{ item }">
        <div style="white-space: normal;">
          {{ item.type12 }}
        </div>
      </template>-->

      
      <!-- 각 보기에 대한 슬롯을 개별적으로 정의 -->
      <template v-for="n in maxBogiCount">
        <template :slot="`item.type${n+13}`" slot-scope="{ item }">
          <div :key="n" style="white-space: normal;">
            {{ Number(item.type13) >= n ? item[`type${n+13}`] : '' }}
          </div>
        </template>
      </template>
    </v-data-table>
  </div>
</template>

<script>

import * as XLSX from 'xlsx';

export default {
  name: 'QTM_M0100_DIALOG_UPLOAD', //일괄 업로드
  components: {
  },
  props: {
    propsQstnPaperData:{
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      uploadedFiles: [],
      page: 1,
      pageCount: 0,
      perPage: [15,30,50,100],
      ROW_PER_PAGE: -1,
      headers: [
        { text: '번호',       value: 'type00', align: 'center', width: '50px', sortable: false },
        { text: '문제형식',   value: 'type01', align: 'center', width: '60px' , sortable: false},
        { text: '답변형식',   value: 'type02', align: 'center', width: '70px' , sortable: false},
        { text: '난이도',     value: 'type03', align: 'center', width: '70px' , sortable: false},
        { text: '배점',       value: 'type04', align: 'center', width: '60px' , sortable: false},
        { text: '범주',       value: 'type05', align: 'center', width: '80px' , sortable: false},
        { text: '문제',       value: 'type06', align: '', width: '13%' , sortable: false},        
        { text: '보기 개수',  value: 'type07', align: '', width: '10%' , sortable: false},
        { text: '정답',       value: 'type08', align: 'center', width: '50px' , sortable: false},        
        { text: '공백무시',     value: 'type09', align: '', width: '10%' , sortable: false},
        { text: '대소문자무시', value: 'type10', align: '', width: '10%' , sortable: false},
        { text: '삭제문자',     value: 'type11', align: '', width: '10%' , sortable: false},
        { text: '동일답안',      value: 'type12', align: '', width: '10%' , sortable: false},
        { text: '보기1',        value: 'type13', align: '', width: '10%' , sortable: false},
        { text: '보기2',        value: 'type14', align: '', width: '10%' , sortable: false},
        { text: '보기3',        value: 'type15', align: '', width: '10%' , sortable: false},
        { text: '보기4',        value: 'type16', align: '', width: '10%' , sortable: false},
      ],
      items: [],
      sample_items: [
        {
          type00: '',
          type01: '',
          type01_nm: '',
          type02: '',
          type02_nm: '',
          type03: '',
          type03_nm: '',
          type04: '',
          type05: '',
          type05_nm: '',
          type06: '',
          type07: '',
          type08: '',
          type09: '',
          type10: '',
          type11: '',
          type12: '',
          type13: '',
          type14: '',
          type15: '',
          type16: '',
        },
      ],
      sample_items_x: [        
        {
          type00: 1,
          type01: 'S',
          type01_nm: '객관식',
          type02: 'ISMHEVANSS001',
          type02_nm: '단일선택',
          type03: 'M',
          type03_nm: '중',
          type04: 10,
          type05: 'VC01',
          type05_nm: '분양',
          type06: '매입임대주택 “가점 항목 체계화” 관련 내용으로 바르지 못한 것은?',
          type07: 4,
          type08: '2',
          type09: '',
          type10: '',
          type11: '',
          type12: '',
          type13: '고령자 매입임대주택 – ‘최근 3년간 국가 또는 지방자치단체가 운영하는 자활사업 프로그램에 참여한 기간 ~’ 에 대한 가점은 삭제되었다.',
          type14: '일반 매입임대주택 - 종전 \'현 거주지의 최저주거기준 미달 여부\' 가점은 \'주거취약계층 주거지원 업무처리지침 [별지 5]에 따른 비정상거처거주확인서가 교부된 경우\'로 변경되었다.',
          type15: '청년 매입임대주택 - \'타 지역 출신 여부\' 와 \'현재 민간임대주택 전·월세로 6개월 이상 거주 여부\' 가점은 삭제되었다.',
          type16: '다자녀 매입임대주택 - \'수급자 등 여부\'에서 가점을 받는 자는 생계급여 또는 의료급여 수급자, 차상위계층이다.',
        },
        {
          type00: 2,
          type01: 'S',
          type01_nm: '객관식',
          type02: 'ISMHEVANSS002',
          type02_nm: '다중선택',
          type03: 'M',
          type03_nm: '중',
          type04: 10,
          type05: 'VC02',
          type05_nm: '분양',
          type06: '매입임대주택 “가점 항목 체계화” 관련 내용으로 바르지 못한 것은?',
          type07: 4,
          type08: '2,3',
          type09: '',
          type10: '',
          type11: '',
          type12: '',
          type13: '고령자 매입임대주택 – ‘최근 3년간 국가 또는 지방자치단체가 운영하는 자활사업 프로그램에 참여한 기간 ~’ 에 대한 가점은 삭제되었다.',
          type14: '일반 매입임대주택 - 종전 \'현 거주지의 최저주거기준 미달 여부\' 가점은 \'주거취약계층 주거지원 업무처리지침 [별지 5]에 따른 비정상거처거주확인서가 교부된 경우\'로 변경되었다.',
          type15: '청년 매입임대주택 - \'타 지역 출신 여부\' 와 \'현재 민간임대주택 전·월세로 6개월 이상 거주 여부\' 가점은 삭제되었다.',
          type16: '다자녀 매입임대주택 - \'수급자 등 여부\'에서 가점을 받는 자는 생계급여 또는 의료급여 수급자, 차상위계층이다.',
        },
        {
          type00: 3,
          type01: 'S',
          type01_nm: '객관식',
          type02: 'ISMHEVANSS001',
          type02_nm: '단일선택',
          type03: 'M',
          type03_nm: '중',
          type04: 10,
          type05: 'VC03',
          type05_nm: '상가/용지',
          type06: '(상담지식게시판) 「공공주택 업무처리지침_2024.1.5 일부개정」 재계약 기준 개정사항 관련 내용으로 맞으면 O, 틀리면 X를 "보기"에서 선택하세요.',
          type07: 4,
          type08: '2',
          type09: '',
          type10: '',
          type11: '',
          type12: '',
          type13: '고령자 매입임대주택 – ‘최근 3년간 국가 또는 지방자치단체가 운영하는 자활사업 프로그램에 참여한 기간 ~’ 에 대한 가점은 삭제되었다.',
          type14: '일반 매입임대주택 - 종전 \'현 거주지의 최저주거기준 미달 여부\' 가점은 \'주거취약계층 주거지원 업무처리지침 [별지 5]에 따른 비정상거처거주확인서가 교부된 경우\'로 변경되었다.',
          type15: '청년 매입임대주택 - \'타 지역 출신 여부\' 와 \'현재 민간임대주택 전·월세로 6개월 이상 거주 여부\' 가점은 삭제되었다.',
          type16: '다자녀 매입임대주택 - \'수급자 등 여부\'에서 가점을 받는 자는 생계급여 또는 의료급여 수급자, 차상위계층이다.',
        }, 
        {
          type00: 4,
          type01: 'D',
          type01_nm: '주관식',
          type02: 'ISMHEVANSD001',
          type02_nm: '단답형',
          type03: 'H',
          type03_nm: '상',
          type04: 20,
          type05: 'VC03',
          type05_nm: '상가/용지',
          type06: '이번 문제는 주관식 단답형입니다.',
          type07: 0,
          type08: '스케줄러, 고객요청, 통화성공',
          type09: 'Y',
          type10: 'Y',
          type11: '불만족',
          type12: '불량',
          type13: '',
          type14: '',
          type15: '',
          type16: '',
        },        
      ],

      //알림창 메시지
      MESSAGE : {
        CONFIRM : {
          SAVE_PAPER: { alertDialogToggle: true, iconClass: 'is-info', type: 'confirm', msg: '평가지 내용을 등록하시겠습니까?', callYes: this.uploadSave_act, callNo: this.closeAlert }
        },
        ALERT : {
          REG_SUCCESS : { alertDialogToggle: true, msg: '평가지 정보가 등록되었습니다', iconClass: 'is-done', type: 'default' }
          , VALID : {alertDialogToggle: true, msg: '필수항목 및 정보 확인 후<br>재시도 해주세요', iconClass: 'is-info', type: 'default'}
        },
        ERROR : {
          ERROR : {alertDialogToggle: true, msg: '일시적인 장애이거나 네크워크 문제일 수 있습니다.잠시 후 다시 이용해주세요.<br><br>계속하여 동일 메시지가 발생하면 시스템관리자에게 문의해 주십시오.', iconClass: 'is-caution', type: 'default'}
        },
        TOAST : {          
          REG_SUCCESS: {  msg: '평가지 정보가 등록되었습니다.', class: 'success', hasToastIcon: true, icon: 'mdi-checkbox-marked-circle' , time: 2000 }
        },
      },

      EXAM_CATE_CD:[
        { text: '분양', value: 'VC01'},
        { text: '임대', value: 'VC02'},
        { text: '상가/용지', value: 'VC03'},
        { text: '주거복지', value: 'VC04'},
        { text: '보금자리', value: 'VC05'},
        { text: '기타', value: 'VC06'},
        { text: '기렌트홈타', value: 'VC07'},
      ],

      ANSW_TYPE:[
        { text: '단일선택', value: 'ISMHEVANSS001'},
        { text: '다중선택', value: 'ISMHEVANSS002'},
        { text: '단답형', value: 'ISMHEVANSD001'},
        
      ],
      QSTN_TYPE:[
        { text: '객관식', value: 'S'},
        { text: '주관식', value: 'D'},
      ],

      QSTN_LEVEL:[
        { text: '상', value: 'H'},
        { text: '중', value: 'M'},
        { text: '하', value: 'L'},
      ],

      error_cnt : 0,
      readExcelCom: false,
      qstnPaperData: {},
    }
  },
  methods: {

    excelInit(){
      this.items = this.sample_items;

      this.$refs.fileUpload.value = '';
      this.uploadedFiles = [];  // 업로드된 파일 목록도 초기화      
    },

    uploadSave_VALID(){
      if(this.error_cnt > 0){
        this.showAlert(this.MESSAGE.ALERT.VALID);
        return;
      }

      // 문항 개수 비교
      if(Number(this.qstnPaperData.PAPER_QSTN_CNT) !== Number(this.items.length)){
        this.showAlertInfo({msg:"문항 개수가 일치하지 않습니다<br>"+ "평가지 문항: "+this.qstnPaperData.PAPER_QSTN_CNT+"개 / 업로드 문항: "+this.items.length+"개"});
        return;
      }

      // 총 합 비교 
      let excel_total = this.items.reduce((sum, item) => sum + (Number(item.type04) || 0), 0);
      if(Number(this.qstnPaperData.TOT_SCORE) !== Number(excel_total)){
        this.showAlertInfo({msg:"총점이 일치하지 않습니다.<br>"+ "평가지 총점: "+this.qstnPaperData.TOT_SCORE+"점 / 업로드 총점: "+excel_total+"점"});
        return;
      }

      this.showAlert(this.MESSAGE.CONFIRM.SAVE_PAPER);
    },

    async uploadSave_act(){
      let sUrl = '/phone-api/qt/evalQstnExcelUploadProc';
      let postParam = {
        CENTER_ID : this.qstnPaperData.CENTER_ID,
        PAPER_ID: this.qstnPaperData.PAPER_ID,        
        EXCEL_LIST : this.items
      };

      let headParam = { head : {
        DATA_OBJECT: "EXCEL_LIST"
      }};
      let response  = await this.common_postCall(sUrl, postParam, headParam);
      // console.log("response ::: ", response)
      if(!response.HEADER.ERROR_FLAG) {        
        this.showToast(this.MESSAGE.TOAST.REG_SUCCESS);
        this.$emit('close');
      }else{
        this.showAlert(this.MESSAGE.ERROR.ERROR);
      }   

      this.closeAlert();  

    },

    handleFileUpload(event) {
      const files = event.target.files;
      const allowedExtensions = ['xlsx', 'xls'];      
      
      if (files.length > 1) {
        this.$toast.error('파일은 1개만 업로드 가능합니다.');
        return;
      }
        const file = files[0];
      const fileExtension = this.getFileExtension(file.name)[1].toLowerCase();
      
      if (allowedExtensions.includes(fileExtension)) {
        this.uploadedFiles = [file];
        this.readExcelFile(file);
      } else {
        this.$toast.error('Excel 파일(.xlsx, .xls)만 업로드 가능합니다.');
      }

       event.target.value = '';
    },

    readExcelFile(file) {
      const reader = new FileReader();
 
      reader.onload = (e) => {
        this.error_cnt = 0;
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        const gridData = jsonData.slice(3).map((row, index) => {
          const bogiCount = Number(row[7]) || 0;

          const qstnType_ = this.QSTN_TYPE.find(type => type.value === row[1]);
          const answType_ = this.ANSW_TYPE.find(type1 => type1.value === row[2]);  
          const qstnLevel_ = this.QSTN_LEVEL.find(type2 => type2.value === row[3]);     
          const EXAM_CATE_CD_NM = this.EXAM_CATE_CD.find(type3 => type3.value === row[5]);

          this.readExcelCom = row[4] != '' ? false : true;
          this.readExcelCom = row[8] != '' ? false : true;

          let result = {            
            type00: String(row[0] || ''),  // 문제번호
            type01: String(row[1] || ''),  // 문제형식 코드
            type01_nm: qstnType_ ? qstnType_.text : '',  // 문제형식 명칭
            type02: String(row[2] || ''),  // 답변형식
            type02_nm: answType_ ? answType_.text : '', 
            type03: String(row[3] || ''),  // 난이도
            type03_nm: qstnLevel_ ? qstnLevel_.text : '', 
            type04: Number(row[4]) || 0,   // 배점
            type05: String(row[5] || ''),  // 범주
            type05_nm: EXAM_CATE_CD_NM ? EXAM_CATE_CD_NM.text : '',
            type06: String(row[6] || ''),  // 문제     
            type07: bogiCount,   // 보기개수       
            type08: this.parseAnswer(row[8], row[1]), // 정답
            type09: String(row[9] || ''),  // 공백무시
            type10: String(row[10] || ''),  // 대소문자 무시
            type11: String(row[11] || ''),  // 삭제문자
            type12: String(row[12] || ''),  // 동일답안           
          };

          let errMsg = "";
          if(!qstnType_){
            errMsg = errMsg + "존재하지 않는 문제형식"
            this.error_cnt++;
          }

          if(!answType_){
            if(!this.mixin_isEmpty(errMsg)) errMsg = errMsg + "<br>"
            errMsg = errMsg + "존재하지 않는 답변형식"
            this.error_cnt++;
          }

          if(!qstnLevel_){
            if(!this.mixin_isEmpty(errMsg)) errMsg = errMsg + "<br>"
            errMsg = errMsg + "존재하지 않는 난이도"
            this.error_cnt++;
          }

          if(!EXAM_CATE_CD_NM){
            if(!this.mixin_isEmpty(errMsg)) errMsg = errMsg + "<br>"
            errMsg = errMsg + "존재하지 않는 범주"
            this.error_cnt++;
          }

          if(qstnType_ && answType_){
            // 문제형식, 답변형식 일치 여부
            if((row[1] == "S" && row[2] == "ISMHEVANSD001") || (row[1] == "D" && row[2] != "ISMHEVANSD001")){
              if(!this.mixin_isEmpty(errMsg)) errMsg = errMsg + "<br>"
              errMsg = errMsg + "문제형식과 답변형식 불일치";
              this.error_cnt++;
            }

            let answ = String(result.type08);
            if(this.mixin_isEmpty(answ)){
              if(!this.mixin_isEmpty(errMsg)) errMsg = errMsg + "<br>"
              errMsg = errMsg + "정답 미입력";
              this.error_cnt++;
            }else{
              let temp = answ.split(",");
              if(((row[1] == "S" && row[2] == "ISMHEVANSS001") && temp.length > 1) || ((row[1] == "S" && row[2] == "ISMHEVANSS002") && (temp.length <= 1))){
                if(!this.mixin_isEmpty(errMsg)) errMsg = errMsg + "<br>"
                errMsg = errMsg + "답변형식에 맞지 않는 정답";
                this.error_cnt++;
              }
            }
          }

          for (let i = 1; i <= bogiCount; i++) {
            result[`type${i + 13}`] = String(row[i + 12] || '');
            //객관식 보기 미입력 확인
            if(qstnType_){
              if(this.mixin_isEmpty(String(row[i + 12] || ''))){
                if(!this.mixin_isEmpty(errMsg)) errMsg = errMsg + "<br>"
                errMsg = errMsg + "보기"+i+" 미입력";
              }
            }
          }
          result.VALID_MSG = errMsg;

          return result;
        });

        this.items = gridData;
      };
      reader.readAsArrayBuffer(file);
    },

    parseAnswer(value, type) {
      if (!value) return '';     
      if (type === 'D') {
        return String(value);
      }
      // 콤마로 구분된 문자열이면 배열로 변환 (다중 선택)
      if (String(value).includes(',')) {
        return String(value).split(',').map(num => Number(num.trim())).filter(num => !isNaN(num));
      }
      // 단일 선택인 경우
      return Number(value) || '';
    },

    getFileExtension(filename) {
      return filename.split('.');
    },
    clickAddFiles() {
      this.$refs.fileUpload.click()
    },
  
    removeFile(index) {
      this.uploadedFiles.splice(index, 1);
    },
  },
  async mounted() {
    this.items = this.sample_items;
    this.qstnPaperData = JSON.parse(JSON.stringify(this.propsQstnPaperData));
  },
  created() {
  },
  computed: {
    maxBogiCount() {
      return Math.max(...this.items.map(item => Number(item.type07) || 0));
    },
    dynamicHeaders() {
      const baseHeaders = [
        { text: '번호', value: 'type00', align: 'center', width: '30px', sortable: false },
        { text: '형식오류',  value:'VALID_MSG', align: '', width: '155px' , sortable: false},
        { text: '문제형식', value: 'type01_nm', align: 'center', width: '70px', sortable: false },
        { text: '답변형식', value: 'type02_nm', align: 'center', width: '70px', sortable: false },
        { text: '난이도', value: 'type03_nm', align: 'center', width: '70px', sortable: false },
        { text: '배점', value: 'type04', align: 'center', width: '50px', sortable: false },
        { text: '범주', value: 'type05_nm', align: 'center', width: '70px', sortable: false },
        { text: '문제', value: 'type06', align: '', width: '40%', sortable: false },
        { text: '보기 개수', value: 'type07', align: 'center', width: '50px', sortable: false },
        { text: '정답', value: 'type08', align: 'center', width: '100px', sortable: false },
        { text: '공백무시', value: 'type09', align: 'center', width: '10%', sortable: false },
        { text: '대소문자무시', value: 'type10', align: 'center', width: '10%', sortable: false },
        { text: '삭제문자', value: 'type11', align: 'center', width: '10%', sortable: false },
        { text: '동일답안', value: 'type12', align: 'center', width: '10%', sortable: false },
      ];     
      
      // 동적으로 보기 컬럼 추가
      for (let i = 1; i <= this.maxBogiCount; i++) {
        baseHeaders.push({
          text: `보기${i}`,
          value: `type${i + 13}`,
          align: 'center',
          width: '20%',
          sortable: false
        });
      }
      return baseHeaders;
    }
  },
  watch: {
    propsQstnPaperData: {
      handler(newVal) {
        if (newVal) {
          this.items = this.sample_items;
          this.qstnPaperData = JSON.parse(JSON.stringify(this.propsQstnPaperData));
        }
      },
      deep: true
    },
  },
};
</script>

<style lang="scss" scoped>

</style>