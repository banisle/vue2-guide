<template>
  <div class="pl-container">
    <div class="pl-card-wrap">
      <!-- sub top -->
      <compo-sub-layout-top>
        <template slot="search">
          <div class="pl-form-inline-wrap">
            <div class="pl-form-inline">
              <span class="pl-label">
                구분
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    placeholder="전체"
                    :items="tmplSeCd"
                    v-model="srchParams.srchTmplSeCd"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                메시지 유형
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    placeholder="전체"
                    :items="mixin_common_code_get(common_code, 'T113', '전체')"
                    v-model="srchParams.srchMsgType"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                사용 대상
                <v-icon class="pl-icon20 required"></v-icon>
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    placeholder="전체"
                    :items="useTargetList"
                    v-model="srchParams.srchTrgtType"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline" v-if="srchParams.srchTrgtType ==='D'">
              <span class="pl-label">
                대상 부서
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    placeholder="전체"
                    :items="mixin_ognz_list_detail(common_ognz_list, computedUserCenterDeptId, '전체' )"
                    v-model="srchParams.srchTrgtDept"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                즐겨찾기 여부
              </span>
              <div class="pl-desc">
                <v-select
                    class="pl-form type-middle"
                    placeholder="전체"
                    :items="favYn"
                    v-model="srchParams.srchFavYn"
                ></v-select>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                제목
              </span>
              <div class="pl-desc">
                <v-text-field
                    class="pl-form type-middle"
                    placeholder=""
                    v-model="srchParams.srchTtl"
                ></v-text-field>
              </div>
            </div>
            <v-btn class="pl-btn is-icon"
                   @click="getSmsTmplList"
            >
              <span class="pl-icon20 search"></span>
              조회
            </v-btn>
          </div>
        </template>
      </compo-sub-layout-top>
      <!-- sub content -->
      <div class=" pl-cols fill-height">
        <!-- 그리드 -->
        <div class="is-vrt pl-card-body">
          <div class="pl-grid-top pt-2">
            <div class="pl-grid-top-left">
<!--              <v-btn class="pl-btn is-icon is-trans"-->
<!--              @click="setRegist"-->
<!--              >-->
<!--                <span class="pl-icon20 circle-plus"></span>-->
<!--                등록-->
<!--              </v-btn>-->
<!--              <v-btn class="pl-btn is-icon is-trans"-->
<!--                     @click="beforeDel"-->
<!--              >-->
<!--                <span class="pl-icon20 trash"></span>-->
<!--                삭제-->
<!--              </v-btn>-->
            </div>
            <div class="pl-grid-top-utils">
              <span class="pl-counter">전체 <em class="pl-1">({{ smsTmplList.length }})</em> 건</span>
              <!-- 엑셀 다운로드 버튼 -->
              <compo-excel
                  TypeProp="Download"
                  :DataHeaderProp="excelHeaders"
                  :DataBodyProp="smsTmplList"
                  :FileNameProp="'상용구목록'+this.$moment(new Date()).format('YYYYMMDDHHmmss')"
                  HeaderColorProp="00B0F0"
              ></compo-excel>
              <!--                :DataBodyProp=""-->
            </div>
          </div>
          <v-data-table
              class="pl-grid is-mt-s has-control"
              :headers="headers"
              :items="smsTmplList"
              show-select
              fixed-header
              item-key="TMPL_CONTENTS_ID"
              :loading="isLoading"
              height="calc(-262px + 100vh)"
              :items-per-page="smsTmplList.length"
              :item-class="isActiveRow"
              hide-default-footer
              :page.sync="page"
              v-model="chkTmplItemList"
              @click:row="selectRow"
              no-data-text="등록된 데이터가 없습니다.">
            <template v-slot:item.favorite="{ item }">
              <v-icon
                    class="pl-icon20"
                    :class="item.favorite ? 'favorite-on' : 'favorite'">
              </v-icon>
            </template>
            </v-data-table>
        </div>
        <!-- detail -->
        <div class="is-col-fix d-flex flex-column" style="width: 40%">
          <v-form ref="form">
            <div class="pl-card pl-scroll-body" style="height: calc(100vh - 258px);">
              <div class="pl-subtit">상용구 상세 정보</div>
              <div class="pl-subdesc">
                <p>메시지유형과 내용을 입력 후 [저장]버튼을 클릭 하십시오.</p>
              </div>
              <!-- form -->
              <div class="pl-form-inline-wrap vertical label-80 is-mt-m">
                <div class="pl-form-inline">
                <span class="pl-label">
                  메시지 유형
                </span>
                  <div class="pl-desc">
                    <v-select
                        class="pl-form type-middle flex-grow-0"
                        placeholder="선택"
                        :items="mixin_common_code_get(common_code, 'T113', '')"
                        :rules="validateRules.TYPE_CD"
                        v-model="saveParam.msgType"
                        :disabled="true"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
              <span class="pl-label">
                사용 대상
              </span>
                  <div class="pl-desc">
                    <v-select
                        class="pl-form type-middle flex-grow-0"
                        placeholder="전체"
                        :items="useTargetList"
                        :rules="validateRules.TARGET"
                        v-model="saveParam.trgtType"
                        :disabled="true"
                    ></v-select>
                    <v-select
                        v-if="saveParam.trgtType ==='D'"
                        class="pl-form type-middle flex-grow-0"
                        placeholder="전체"
                        :items="mixin_ognz_list_detail(common_ognz_list, $store.getters['userStore/GE_USER_ROLE'].company.CD, '전체')"
                        v-model="saveParam.trgtDept"
                        :disabled="true"
                    ></v-select>
                  </div>
                </div>
                <div class="pl-form-inline">
                <span class="pl-label">
                  제목
                </span>
                  <div class="pl-desc">
                    <v-text-field
                        class="pl-form type-middle flex-grow-1"
                        placeholder="제목 입력"
                        :rules="validateRules.TTL"
                        v-model="saveParam.ttl"
                        :disabled="true"
                    ></v-text-field>
                  </div>
                </div>
                <div class="pl-form-inline">
                <span class="pl-label">
                  내용
                </span>
                  <div class="pl-desc">
                    <v-textarea
                        ref="CNTNT"
                        class="pl-form is-noresize"
                        placeholder="상용구 내용 입력 "
                        height="450"
                        v-byte-counter="4000"
                        @mousedown="setCursorPosition"
                        :rules="validateRules.CNTNT"
                        v-model="saveParam.cntnt"
                        :disabled="true"
                    />
                  </div>
                </div>
              </div>
              <!-- 특수문자 -->
<!--              <div class="is-mt-m">-->
<!--                <v-tabs-->
<!--                    v-model="tabs2"-->
<!--                    class="pl-tabs"-->
<!--                >-->
<!--                  <v-tab v-if="CUSTCO_ID == 4">예약문자</v-tab>-->
<!--                  <v-tab>특수문자1</v-tab>-->
<!--                  <v-tab>특수문자2</v-tab>-->
<!--                  <v-tab>특수문자3</v-tab>-->

<!--                </v-tabs>-->
<!--              </div>-->
<!--              <v-tabs-items v-model="tabs2">-->
<!--                &lt;!&ndash; 특수문자1 &ndash;&gt;-->
<!--                <v-tab-item v-if="CUSTCO_ID == 4">-->
<!--                  <ul-->
<!--                      class="is-mt-m"-->
<!--                      style="display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, 80px); grid-auto-rows: 40px">-->
<!--                    <li-->
<!--                        class="d-flex align-center justify-center hover-light-bg"-->
<!--                        v-for="(char, index) in keywords"-->
<!--                        :key="char.value"-->
<!--                        @click="addValue(char.value)"-->
<!--                    >{{ char.text }}-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </v-tab-item>-->
<!--                <v-tab-item>-->
<!--                  <ul-->
<!--                      class="is-mt-m"-->
<!--                      style="display: grid; gap: 8px 16px; grid-template-columns: repeat(auto-fill, 30px); grid-auto-rows: 30px">-->
<!--                    <li-->
<!--                        class="d-flex align-center justify-center hover-light-bg"-->
<!--                        v-for="(char, index) in basicSymbols"-->
<!--                        :key="`basic-${index}`"-->
<!--                        @click="addValue(char)"-->
<!--                    >{{ char }}-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </v-tab-item>-->
<!--                &lt;!&ndash; 특수문자2 &ndash;&gt;-->
<!--                <v-tab-item>-->
<!--                  <ul-->
<!--                      class="is-mt-m"-->
<!--                      style="display: grid; gap: 8px 16px; grid-template-columns: repeat(auto-fill, 40px); grid-auto-rows: 40px">-->
<!--                    <li-->
<!--                        class="d-flex align-center justify-center hover-light-bg"-->
<!--                        v-for="(char, index) in linesAndBrackets"-->
<!--                        :key="`line-${index}`"-->
<!--                        @click="addValue(char)"-->
<!--                    >{{ char }}-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </v-tab-item>-->
<!--                &lt;!&ndash; 특수문자3 &ndash;&gt;-->
<!--                <v-tab-item>-->
<!--                  <ul-->
<!--                      class="is-mt-m"-->
<!--                      style="display: grid; gap: 8px 16px; grid-template-columns: repeat(auto-fill, 40px); grid-auto-rows: 40px">-->
<!--                    <li-->
<!--                        class="d-flex align-center justify-center hover-light-bg"-->
<!--                        v-for="(char, index) in enclosedChars"-->
<!--                        :key="`enclosed-${index}`"-->
<!--                        @click="addValue(char)"-->
<!--                    >{{ char }}-->
<!--                    </li>-->
<!--                  </ul>-->
<!--                </v-tab-item>-->

<!--              </v-tabs-items>-->
            </div>
            <!-- bottom -->
            <div class="pl-card is-border text-right">
              <v-btn class="pl-btn is-sub"
                     @click="$copyText(saveParam.cntnt).then(() => { showToastInfo({msg:'클립보드에 복사되었어요'})})"
              >{{ '클립보드로 복사' }}</v-btn>
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "MENU_CSL_M0605", //name은 'MENU_' + 파일명 조합
  components: {},
  data() {
    return {
      CUSTCO_ID: this.$store.getters["userStore/GE_USER_COMPANY"].CUSTCO_ID,

      common_code: [],
      common_ognz_list: [],

      srchParams: {
        srchTmplSeCd: 'S'
        , srchMsgType: ''
        , srchTrgtType: ''
        , srchTrgtUser: ''
        , srchTrgtDept: ''
        , srchTtl: ''
        , srchFavYn : ''
      },
      tmplSeCd: [
        {text: "문자", value: 'S'},
        {text: "이메일", value: 'E'},
      ],
      useTargetList: [
        {text: "전체", value: ''},
        {text: "전체 사용자", value: 'A'},
        {text: "팀", value: 'D'},
        {text: "개인", value: 'U'},
      ],
      favYn: [
        {text: "전체", value: ''},
        {text: "등록", value: 'Y'},
        {text: "미등록", value: 'N'},
      ],
      userId: '',
      saveParam: {
        ttl: '',
        msgType: '',
        cntnt: '',
        tmplContentsId: '',
        trgtType: '',
        trgtDept: '',
        tmplCd: ''
      },

      selectedRow: {},
      chkTmplItemList: [],

      smsTmplList: [],

      editMode : false,
      afterFocus : false,
      isLoading : false,
      validateRules: {
        TTL: [
          v => !!v || '제목을 입력하세요',
          v => (v && v.length <= 100) || '게시판 명은 100자를 넘을 수 없습니다.',
        ],
        CNTNT: [
          v => !!v || '내용은 필수 입력 항목입니다.',
          v => (v && v.length <= 4000) || '',
        ],
        TYPE_CD: [
          v => !!v || '사용 부서는 필수 선택 항목입니다.'
        ],
        TARGET: [
          v => !!v || '사용 대상은 필수 선택 항목입니다.'
        ],
      },
      // grid
      page: 1,
      pageCount: 0,
      perPage: [15, 30, 50, 100],
      ROW_PER_PAGE: 15,
      headers: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '구분', value: 'TMPL_SE_NM', align: '', width: '8%', sortable: false},
        {text: '메시지 유형', value: 'TYPE_CD_NM', align: '', width: '12%', sortable: false},
        {text: '대상', value: 'TARGET_NM', align: '', width: '13%', sortable: false},
        {text: '상용구 제목', value: 'TTL', align: '', width: '', sortable: true},
        {text: '등록자', value: 'USER_NM', align: '', width: '6%', sortable: false},
        {text: '등록일', value: 'REG_DT', align: '', width: '10%', sortable: false},
        {text: '즐겨찾기', value: 'favorite', align: 'center', width: '7%', sortable: false},
      ],
      excelHeaders: [
        {text: '번호', value: 'ROW_NUMBER', align: 'center', width: '50px', sortable: false},
        {text: '구분', value: 'TMPL_SE_NM', align: 'center', width: '80px', sortable: false},
        {text: '메시지 유형', value: 'TYPE_CD_NM', align: '', width: '120px', sortable: false},
        {text: '대상', value: 'TARGET_NM', align: 'left', width: '130px', sortable: false},
        {text: '상용구 제목', value: 'TTL', align: '', width: '250px', sortable: true},
        {text: '내용', value: 'CNTNT', align: 'center', width: '400px', sortable: false},
        {text: '등록자', value: 'USER_NM', align: '', width: '100px', sortable: false},
        {text: '등록일', value: 'REG_DT', align: '', width: '100px', sortable: false},
        {text: '즐겨찾기 여부', value: 'FAV_YN', align: 'center', width: '100px', sortable: false},
      ],

      //문자내용
      tabs2: null,

      // 특수문자
      basicSymbols: [
        '●', '○', '■', '□', '◆', '◇', '★', '☆', '▲', '△', '▼', '▽',
        '♠', '♣', '♥', '♦', '♪', '♫', '☀', '☁', '☂', '☃', '☯', '☮'
      ],
      linesAndBrackets: [
        '─', '━', '│', '┃', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼',
        '╭', '╮', '╯', '╰', '╱', '╲', '╳', '【', '】', '「', '」', '『', '』'
      ],
      enclosedChars: [
        '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩',
        'ⓐ', 'ⓑ', 'ⓒ', 'ⓓ', 'ⓔ', 'ⓕ', 'ⓖ', 'ⓗ', 'ⓘ', 'ⓙ',
        'ⓞ', 'ⓟ', 'ⓠ', 'ⓡ', 'ⓢ', 'ⓣ', 'ⓤ', 'ⓥ', 'ⓦ', 'ⓧ', 'ⓨ', 'ⓩ'
      ],
      keywords: [
        {text : '하자접수번호', value : '#v_flw_acp_sn'},
        {text : '민원인', value : '#cvpr_nm'},
        {text : '연락처', value : '#mbl_no'},
        {text : '단지동주소', value : '#mgof_nm'},

      ]


    }
  },
  async created() {
    let codeList = ["T113"]; // 공통코드 리스트 T113 - 단문메세지유형
    this.common_code = await this.mixin_common_code_get_all(codeList);
    this.common_ognz_list = await this.mixin_ognz_list();

    this.userId = this.$store.getters['userStore/GE_USER_ROLE'].userId;

  },
  mounted() {
    this.getSmsTmplList()
  },
  methods: {
    async getSmsTmplList() {
      this.isLoading = true;
      this.smsTmplList = [];
      this.initParams();
      let sUrl = '/api/biz/common/select/selectSmsTmplList'
      let postParam = {
        SRCH_TMPL_SE_CD : this.srchParams.srchTmplSeCd,
        SRCH_TTL : this.srchParams.srchTtl,
        SRCH_TYPE_CD : this.srchParams.srchMsgType,
        SRCH_TARGET_TYPE : this.srchParams.srchTrgtType,
        // SRCH_DEPT_ID : this.computedUserDetailType === 'MANAGER' ? this.computedUserDeptId : '',
      }
      if(this.srchParams.srchTrgtType ==='D'){
        postParam.SRCH_DEPT_ID = this.srchParams.srchTrgtDept
      }
      let headParam = {
        head : {
          ns : 'lhcs.system.sms.dao.SmsTmplMngMapper',
          sn : 'selectSmsTmplList'
        }
      }

      const response = await this.common_postCall(sUrl, postParam, headParam)
      if (!response.HEADER.ERROR_FLAG) {
        let favList = []
        let notFavList = []
        response.DATA.map((item) => {
            item.TMPL_SE_NM = item.DATA_FLAG =='S' ? '문자' : '이메일'
            item.TTL = this.mixin_decode(item.TTL)
            item.CNTNT = this.mixin_decode(item.CNTNT)
            item.REG_DT = this.mixin_convertDate(item.REG_DT, 'yyyy-MM-dd')
            item.favorite = item.FAV_YN === 'N'? false : true;
                if(item.FAV_YN ==='N' ){
                  notFavList.push(item)
                }else{
                  favList.push(item)
                }
        })
        this.smsTmplList = [...favList, ...notFavList];
      } else {
        this.showToastCaution({msg: response.HEADER.ERROR_MSG});
      }
      this.isLoading = false;
    },
    selectRow(item) {
      this.selectedRow = item;
      this.saveParam = {
        ttl: item.TTL,
        msgType: item.TYPE_CD,
        cntnt: item.CNTNT,
        tmplContentsId: item.TMPL_CONTENTS_ID,
        trgtType: item.TARGET_TYPE,
        trgtDept: item.TARGET_TYPE === 'D' ? item.TARGET : '',
        tmplCd: item.TMPL_CD
      }
      this.editMode = true;
    },
    //row 선택시 색상 변경
    isActiveRow(item) {
      const activeClass = item === this.selectedRow ? "active" : "";
      return activeClass;
    },
    setRegist(){
      this.editMode = true;
      this.resetValidation();
      this.saveParam = {
        ttl:'',
        msgType:'',
        cntnt:'',
        tmplContentsId:'',
        trgtType:'',
        trgtDept:'',
      }
    },
    initParams(){
      this.chkTmplItemList = [];
      this.resetValidation();
      this.editMode = false;
      this.saveParam= {
        ttl: '',
        msgType: '',
        cntnt: '',
        tmplContentsId: '',
        trgtType: '',
        trgtDept: '',
        tmplCd: ''
      }
    },
    beforeSave() {
      if(this.validate()){
        let action = this.mixin_isEmpty(this.saveParam.tmplContentsId) ? '저장' : '수정'
        this.showConfirmInfo({msg: `상용구를 ${action} 하시겠습니까?`
        , callYes : this.saveTmpl
        , callNo : this.closeMsg
      })
      }else{
        this.showToastCaution({msg : '필수 입력 항목을 확인해 주세요.'})
      }
    },
    async saveTmpl(){
      let target = '';

      switch(this.saveParam.trgtType){
        case 'A' :
          target = this.computedUserCenterDeptId
          break;
        case 'D' :
          target = this.saveParam.trgtDept
          break;
        case 'U' :
          target = this.user_id
          break;
      }

      let postParam = {
        TMPL_CONTENTS_ID : this.saveParam.tmplContentsId
        , DATA_FLAG : this.mixin_isEmpty(this.saveParam.tmplSeCd) ? this.srchParams.srchTmplSeCd : this.saveParam.tmplSeCd
        , CNTNT : this.saveParam.cntnt
        , IS_GLOBAL : this.saveParam.trgtType !== 'U' ? 'Y' : 'N'
        , TTL : this.saveParam.ttl
        , TARGET_TYPE : this.saveParam.trgtType
        , TARGET : target
        , TYPE_CD : this.saveParam.msgType
      }
      let action = this.mixin_isEmpty(this.saveParam.tmplContentsId) ? 'insert' : 'update';
      let sn = this.mixin_isEmpty(this.saveParam.tmplContentsId) ? 'insertTmpl' : 'updateTmpl';
      let headParam = {head:{
            ns : 'lhcs.system.sms.dao.SmsTmplMngMapper',
            sn : sn,
            seq_key : 'TMPL_CONTENTS_ID'
        }}

      let sUrl = `/api/biz/common/${action}/${sn}`

      const response = await this.common_postCall(sUrl, postParam, headParam);
      if( !response.HEADER.ERROR_FLAG){
        this.showToastInfo({msg : '정상 처리 되었습니다. ' , callAfter : ()=>{
            this.$store.commit("alertStore/hideAlert")
            this.initParams();
            this.getSmsTmplList();
          }})
      }else{
        this.showToastCaution({msg : '오류가 발생하였습니다.', callAfter : ()=>{
            this.$store.commit("alertStore/hideAlert")
        }})
      }
    },
    closeMsg(){
      this.$store.commit("alertStore/hideAlert")
    },
    beforeDel() {
      let notMyCnt = 0
      let favCnt = 0
      if (this.mixin_isEmpty(this.chkTmplItemList)) {
        this.showToastCaution({msg: '선택된 항목이 없습니다.'});
      } else {

        this.chkTmplItemList.map((item) => {
          if (item.USER_ID !== this.userId) {
            notMyCnt += 1;
          }
          if ( item.FAV_YN !== 'N' ) {
            console.log(item)
            favCnt += 1;
          }
        })

        if( favCnt > 0 ){
          this.showToastCaution({msg : '즐겨찾기에 등록된 상용구는 삭제할 수 없습니다.'})
        }else if( notMyCnt > 0 ){
          this.showToastCaution({msg : `본인이 등록한 상용구만 삭제할 수 있습니다.`})
        }else if( notMyCnt === 0 && favCnt === 0 ){
          this.showConfirmCaution({msg : '선택한 상용구는 영구 삭제 됩니다.\n 계속 하시겠습니까?', callYes:this.deleteTmpl, callNo : this.closeMsg})
        }
      }
    },
    async deleteTmpl(){
      let sUrl = '/system-api/sms/tmplMng/deleteTmpl'
      let postParam = {
        delTmplList: this.chkTmplItemList.map(row=>{return {TMPL_CONTENTS_ID: row.TMPL_CONTENTS_ID}})
      }

      let headParam ={
        head: {
          DATA_OBJECT : "delTmplList"
          , ns:'lhcs.system.sms.dao.SmsTmplMngMapper'
          , sn : 'deleteTmpl'
        }}

      const response = await this.common_postCall(sUrl, postParam, headParam)
      if( !response.HEADER.ERROR_FLAG){
        this.showToastInfo({msg : '정상 처리 되었습니다. ' , callAfter : ()=>{
            this.closeMsg()
            this.initParams();
            this.getSmsTmplList();
          }})
      }else{
        this.showToastCaution({msg : '오류가 발생하였습니다.', callAfter : ()=>{
            this.closeMsg();
          }})
      }
    },
    validate() {
      return this.$refs.form.validate();
    },
    // validation 초기화
    resetValidation() {
      this.$refs.form.reset();
    },
    fnChgFavorite(item) {
      item.favorite = !item.favorite ;

      if( item.favorite ) {
        this.chgFavorite('insert',item);
      } else {
        this.chgFavorite('delete',item);
      }
      // this.aniFavorite(item.favorite, item.TMPL_CONTENTS_ID);
    },
    // favorite animation
    // aniFavorite(flag, id){
    //   const PLAYBACK_RANGE = [30, 119];
    //   let idx = this.smsTmplList.findIndex(item=> item.TMPL_CONTENTS_ID == id)
    //   if (flag) {
    //     this.smsTmplList[idx].lottieFavorite.playSegments(PLAYBACK_RANGE, true);
    //   } else {
    //     this.smsTmplList[idx].lottieFavorite.goToAndStop(0, true);
    //   }
    // },
    async chgFavorite(flag, item){

      let postParam = {
        ADMIN_YN : item.TARGET_TYPE == 'U' ? 'N':'Y',
        TMPL_CONTENTS_ID : item.TMPL_CONTENTS_ID,
      }

      let headParam ={
        head : {
          ns : 'lhcs.system.sms.dao.SmsTmplMngMapper',
          sn : `${flag}TmplFav`,
        }
      }

      if(flag ==='insert') this.$set(headParam.head, 'seq_key' ,'CONTENTS_FAV_ID');
      const response = await this.common_postCall(`/api/biz/common/${flag}/${flag}TmplFav`, postParam, headParam);
      if( response.HEADER.ERROR_FLAG ){
        this.showAlertCaution({msg : '즐겨찾기 설정 중 오류가 발생했습니다.'})
      }

    },
    // addValue(text){
    //   console.log("🌵", text)
    //   if( this.editMode ){
    //     this.saveParam.cntnt = [this.saveParam.cntnt,text].join(' ')
    //     this.$refs.CNTNT.focus();
    //   }
    // }
    setCursorPosition(event){
      this.afterFocus=true;
    },
    addValue(textToInsert) { //
      const textarea = this.$refs.CNTNT.$refs.input;  // textarea의 실제 DOM 요소 참조
      let start = this.afterFocus? textarea.selectionStart : 0
      // console.log("여기서 입력 ", start)
      let end = this.afterFocus? textarea.selectionEnd : 0;
      // console.log("여기가 끝", end)

      // 현재 텍스트에서 커서 위치에 새 텍스트를 삽입
      this.saveParam.cntnt = this.saveParam.cntnt.slice(0, start) + textToInsert + this.saveParam.cntnt.slice(end);

      // 삽입 후 커서 위치 업데이트
      this.$nextTick(() => {
        textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
        textarea.focus();
      });
    }
  },
  watch: {},
  computed: {},
}
</script>

<style lang="scss" scoped>

</style>