<template>
  <div class="pl-instant-form-wrap" :style="">
    <template >
      <div class="pl-instant-form-wrap--header">
        <div class="pl-instant-form-wrap--lh-logo">
          <img src="@/assets/img/lhcs_white.png" alt="LH 주거복지정보">
        </div>
        <div class="text-center">
          <img
            src="@/assets/img/lh_logo_instant.svg"
            width="70%"
            class="mt-8"
            alt="LH 바로처리센터">
        </div>
        <div class="text-center is-txt-white pt-1">HOUSING WELFARE INFORMATION</div>
      </div>

      <template v-if="CHAT_STAT == 'ING'">
        <div class="pl-instant-form-wrap--content">
          <p>
            안녕하십니까. 바로처리센터 입니다.<br> 고객님과 상담 진행을 위해 고객님의 전화번호와 이름을 필요합니다. 아래에서 <strong>전화번호와 이름을 입력하신 후, [제출하기] 버튼을 눌러 주십시오.</strong><br>감사합니다.
          </p>
          <div class="pl-form-inline-wrap vertical is-mt-m is-border-sub-top pt-3 label-80">
            <div class="pl-form-inline">
              <span class="pl-label">
                이름
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="CUST_NM"
                  class="pl-form type-middle"
                  placeholder="이름 입력"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                주소
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="CUST_ADDR"
                  class="pl-form type-middle flex-grow-1"
                  placeholder="주소 입력"
                />
                <p class="pl-form-hint">(예시 - 경기도 하남시 아리수로 589 미사강변신도시 신동아 파밀리에 OOOO동 OOOO호)</p>
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                전화번호
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="PHONE_NO"
                  class="pl-form type-middle"
                  placeholder="전화번호 입력"
                />
              </div>
            </div>

          </div>
          <div class="pl-subdesc">
            <p class="font-weight-bold">추후 고객님 문의사항에 대한 답변방식 참고를 위해 청각장애 여부 확인을 부탁드립니다.</p>
          </div>
          <div class="is-mt-m">
            <div>
              <v-checkbox
                class="pl-check"
                label="청각장애인 여부 확인"
              ></v-checkbox>
            </div>
            <div class="d-flex align-center">
              <v-checkbox
                class="pl-check mt-1"
                label=""
                >
                <template v-slot:label>
                  <span class="is-txt-blue">개인정보 수집 및 활용에 동의합니다.</span>
                </template>
              </v-checkbox>
              <compo-tooltip-btn
                TitleProp="상세 검색"
                ClassProp="pl-tooltip-btn ml-auto"
                :IconProp=computedSearchToggleClass
                TooltipPositionProp="bottom"
                @btnClick="toggleTerms()"
              ></compo-tooltip-btn>
            </div>
            <div v-if="toggleText" class="is-mt-s">
              <div class="pl-textarea-wrap pl-scroll-body">{{ dummy_text }}</div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="CHAT_STAT == 'INPUT_CMPL'">
        <div class="pl-instant-form-wrap--content text-center">
          정보입력이 완료되었습니다
        </div>
      </template>

      <template v-else>
        <div class="pl-instant-form-wrap--content text-center">
          고객님은 현재 상담을 진행중이지 않습니다.<br>
          상담중이라면 페이지를 새로고침해주세요.
        </div>
      </template>

      <div class="pl-instant-form-wrap--footer">
        <template v-if="CHAT_STAT == 'ING' || CHAT_STAT == 'WAIT' || CHAT_STAT == 'ALTMNT_WAIT' || CHAT_STAT == 'TRAN_WAIT' || CHAT_STAT == 'CLBK_WAIT'">
          <v-btn
            class="pl-btn flex-grow-1 is-lg"
            @click="inputCustInfo">
            제출 하기
          </v-btn>
        </template>
        <template v-else>
          <v-btn
            class="pl-btn flex-grow-1 is-lg"
            @click="closeBrowser">
            창닫기
          </v-btn>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import axios from "axios";

export default {
  name: "MenuCustInfo",
  data: () => ({
    CUST_NM:"",       //고객명
    CUST_ADDR:"",     //주소소
    PHONE_NO:"",      //고객전화번호
    CHAT_STAT: 'ING',  //고객 채팅상태

    //개인정보 약관
    toggleText: false,
    dummy_text: `1.개인정보 수집하는 자 및 제공받는 자 : 한국토지주택공사

      2.개인정보 수집 항목 : 성명 , 연락처 , 주소

      3.개인정보의 수집. 이용목적 및 보유 이용 기간
      한국토지주택공사는 다음의 사항에 대한 관련업무 수행을 목적으로 개인정보를 수집합니다.
      가.하자접수 및 보수일정 , 하자처리 및 해피콜 등의 상담에 따른 본인 식별 고객 상담. 고객불만 접수 및 처리 기록 보존
      나. 개인정보 보유 및 이용 기간 : 개인정보 수집 및 이용 동의 철회요청 시 즉시 파기

      4. 개인정보 처리방침 위탁에 대한 안내
      회사는 서비스 향상을 위해서 아래와 같이 개인정보를 위탁하고 있으며,
      관계 법령에 따라 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한사항을 규정하고 있습니다.
      회사의 개인정보 위탁처리 기관 : ㈜ LH상담센터, 스펙트라, 하자접수와 관련 된 보수업체

      5. 개인정보 수집 및 이용 동의를 거부 할 권리가 있으며 필수적인 정보 수집에 미 동의 시 카카오톡을 통한 상담에 제한 됩니다.
      ※ 한국토지주택공사는 동의받은 목적 내에서 이용합니다. 동의없이 개인정보를 수집하거나 활용하지 않습니다.

      6. 위 항목에 명시되어 있지 않은 사항은 LH홈페이지(www.lh.or.kr)내 개인정보수집 및 활용을 참고 하여 주시기 바랍니다.`
  }),

  computed: {
  },

  created(){
  },

  mounted() {
    this.setScreenSize()
    this.custChatStat();
  },
  watch: {
  },
  methods: {
    toggleTerms(){
      this.toggleText = !this.toggleText
      this.mixin_searchDetailToggle()
    },

    // 브라우저  높이 계산
    setScreenSize() {
      let vh = window.innerHeight * 0.01;

      document.documentElement.style.setProperty('--vh', `${vh}px`);
    },

    //현재 고객이 상담중인지
    //상담중이지 않을때도 고객정보 입력받을 수 있는지 확인
    async custChatStat(){
      let custcoId = this.$route.params.custcoId;
      let sndrKey = this.$route.params.sndrKey;
      let custId = this.$route.params.custId;

      let sUrl = "/chat-api/custInfo/custChatStat"
      let postParam = {
        CUSTCO_ID: custcoId
        , SNDR_KEY: sndrKey
        , CUST_ID: custId
      }
      let headParam = {
      }

      let resData = await this.chat_postCall(sUrl, postParam, headParam)
      if(resData.code == '0'){
        this.CHAT_STAT = resData.data[0].CUTT_STTS_CD;
      } else {
        this.CHAT_STAT = 'ERROR'
      }
    },

    //창닫기 버튼
    closeBrowser(){
      window.close();
    },

    inputCustInfo(){
      let custcoId = this.$route.params.custcoId;
      let sndrKey = this.$route.params.sndrKey;
      let custId = this.$route.params.custId;
      let sUrl = process.env.VUE_APP_API_URL + '/message';
      let bodyJson = {
        "user_key":""
        , "sender_key":""
        , "type" : "custInfo"
        , "content":"고객님이 개인정보를 입력하셨습니다"
        , "custcoId":custcoId
        , "sndrKey":sndrKey
        , "custId":custId
        , "custNm":this.CUST_NM
        , "phnNo":this.PHONE_NO
        , "addr":this.CUST_ADDR
      }

      axios.post(sUrl, bodyJson)
        .then((res) => {
          console.log(res);
          if(res.status == '200'){
            this.CHAT_STAT = 'INPUT_CMPL'
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          console.log("항상 마지막에 실행");
        });
    },
  },
};

</script>

<style scoped></style>
