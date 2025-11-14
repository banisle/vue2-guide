<template>
  <div style="display: contents">
    <div class="pl-quick-layer-body" style="flex: 0 0 calc(100% - 217px);">
     <CompoManagerInfo
      :DataProp="data"
     />
    <!-- 상담 상세내역 -->
    <div class="is-mt-m pt-4 is-border-sub-top">
      <h3 class="pl-subtit">상담 상세내역</h3>
      <div class="d-flex align-center is-mt-m">
        <CompoAudioWave
          :AudioProp=data.CS_INFO
          :WidthProp=340
          :diabled="true"
        />
      </div>
      <!-- table -->
      <div class="is-mt-m">
        <table class="pl-tbl-detail">
          <colgroup>
            <col width="17%" />
            <col width="35%" />
            <col width="17%" />
            <col width="" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  상담채널
                </span>
              </th>
              <td>
                <div class="spacing-wrap sp-4">
                  <v-select
                    v-model="data.CS_INFO.chn_category01"
                    :items="['IN']"
                    class="pl-form "
                    item-text="title"
                    style="flex: 0 0 120px"
                    placeholder="선택"
                    disabled></v-select>
                  <v-select
                    v-model="data.CS_INFO.chn_category02"
                    :items="['전화','SNS']"
                    class="pl-form is-auto"
                    item-text="title"
                    placeholder="선택"
                    disabled></v-select>
                </div>
              </td>
              <th scope="row">
                <span class="pl-label">
                  개인정보수집
                </span>
              </th>
              <td>
                <v-radio-group
                  v-model="data.CS_INFO.radioGroupSelected"
                  row
                  class="pl-radio-group">
                  <v-radio
                    v-for="(rad01, index) in data.CS_INFO.radioGroup"
                    :key="data.CS_INFO.radioGroup[index].text"
                    :label="rad01.text"
                    :value="rad01.text"
                    class="pl-radio">
                  </v-radio>
                  <template v-if="data.CS_INFO.radioGroupSelected === '미동의'">
                    <v-icon class="pl-icon20 terms-ani"></v-icon>
                    <strong class="is-txt-red pl-value-txt">미동의 고객</strong>
                  </template>
                </v-radio-group>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  접속정보
                </span>
              </th>
              <td>
                <span class="pl-value-txt">
                  하자보수
                </span>
              </td>
              <th scope="row">
                <span class="pl-label">
                  인입번호
                </span>
              </th>
              <td>
                <span class="pl-value-txt">
                  010-5303-4545
                </span>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  상담유형
                </span>
              </th>
              <td colspan="3">
                <div class="spacing-wrap sp-4">
                  <v-select
                    v-model="data.CS_INFO.category01"
                    class="pl-form is-sm"
                    :items="['국민임대']"
                    item-text="title"
                    placeholder="선택"></v-select>
                  <v-select
                    v-model="data.CS_INFO.category02"
                    :items="['예비자 모집공고']"
                    class="pl-form is-auto"
                    item-text="title"
                    placeholder="선택"></v-select>
                  <v-select
                    v-model="data.CS_INFO.category03"
                    :items="['서류/접수방법']"
                    class="pl-form is-auto"
                    item-text="title"
                    placeholder="선택"></v-select>
                  <v-select
                    class="pl-form is-auto"
                    item-text="title"
                    placeholder="상담유형 검색"></v-select>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  처리방법
                </span>
              </th>
              <td colspan="3">
                <div class="d-flex">
                  <v-radio-group
                    v-model="data.CS_INFO.radioGroupSelected2"
                    row
                    class="pl-radio-group">
                    <v-radio
                      v-for="(rad01, index) in data.CS_INFO.radioGroup2"
                      :key="data.CS_INFO.radioGroup2[index].text"
                      :label="rad01.text"
                      :value="rad01.text"
                      @change="rad01.text === '스케줄러이관' ? mixin_showDialog('TransSchedule') : ''"
                      class="pl-radio">
                      </v-radio>
                  </v-radio-group>
                </div>
              </td>
            </tr>
            <template v-if="data.CS_INFO.radioGroupSelected2 === '자체사후처리'">
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    긴급여부
                  </span>
                </th>
                <td>
                  <v-select
                    class="pl-form is-auto"
                    placeholder="선택"
                  ></v-select>
                </td>
                <th scope="row">
                  <span class="pl-label">
                    노트
                  </span>
                </th>
                <td>
                  <v-text-field
                    value=""
                    class="pl-form is-auto"
                    />
                </td>
              </tr>
            </template>
            <template v-if="data.CS_INFO.radioGroupSelected2 === '협업사후처리'">
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    협업사유
                  </span>
                </th>
                <td>
                  <v-select
                    class="pl-form is-auto"
                    placeholder="선택"
                  ></v-select>
                </td>
                <th scope="row">
                  <span class="pl-label">
                    전달내용
                  </span>
                </th>
                <td>
                  <v-text-field
                    value=""
                    class="pl-form is-auto"
                    />
                </td>
              </tr>
            </template>
            <template v-if="data.CS_INFO.radioGroupSelected2 === '스케줄러이관'">
              <tr>
                <th scope="row">
                  <span class="pl-label">
                    AS 접수번호
                  </span>
                </th>
                <td>
                  <v-text-field
                    disabled
                    value=""
                    class="pl-form is-auto"
                    />
                </td>
                <th scope="row">
                  <span class="pl-label">
                    전달내용
                  </span>
                </th>
                <td>
                  <v-text-field
                    value=""
                    class="pl-form is-auto"
                    />
                </td>
              </tr>
            </template>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  처리부서
                </span>
              </th>
              <td >
                <v-text-field
                  disabled
                  :value="DEPT_NM"
                  class="pl-form is-auto"
                  />
              </td>
              <th scope="row">
                <span class="pl-label">
                  처리자
                </span>
              </th>
              <td >
                <v-text-field
                  disabled
                  :value="USER_NM"
                  class="pl-form is-auto"
                  />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  통화관계자
                </span>
              </th>
              <td >
                <div class="d-flex spacing-wrap sp-4">
                  <v-text-field
                    class="pl-form "
                    />
                  <v-select
                    class="pl-form"
                    placeholder="선택"
                  ></v-select>
                </div>
              </td>
              <th scope="row">
                <div class="d-flex align-center">
                  <span class="pl-label">
                    연락처
                  </span>
                  <div class="pl-btn-wrap ml-auto">
                    <!-- 문자 버튼 -->
                    <compo-tooltip-btn
                      TitleProp="문자 보내기"
                      ClassProp="pl-tooltip-btn ml-auto"
                      IconProp="pl-icon20 td-in-sms"
                      TooltipPositionProp="bottom"
                      :MinWidthProp=22
                      :HeightProp=22
                      @btnClick="mixin_showDialog('SendSMS')"
                    ></compo-tooltip-btn>
                  </div>
                </div>
              </th>
              <td >
                <v-text-field
                  class="pl-form is-auto"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  주소
                </span>
              </th>
              <td colspan="3" >
                <v-text-field
                  v-model="AS_ADDR"
                  disabled
                  class="pl-form is-auto"
                  />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  상담내용
                </span>
              </th>
              <td colspan="3" class="has-textarea">
                <v-textarea
                  :value="data.CS_INFO.textarea"
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  :height="data.CS_INFO.textareaH" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- info -->
      <ul class="pl-list-info is-mt-s">
        <li>당일 상담 내역만 수정할 수 있습니다.</li>
      </ul>
    </div>
    </div>
    <div class="pl-quick-layer-footer">
      <div class="pl-btn-wrap ml-auto">
        <!-- <v-btn v-if="popData" class="pl-btn" @click="$emit('sendDataToParent')">부모창 Call</v-btn> -->
        <v-btn class="pl-btn is-trans" @click="close()">닫기</v-btn>
        <v-btn class="pl-btn">저장</v-btn>
      </div>
    </div>
    <!-- //mark: SMS 발송 -->
    <v-dialog
      v-model="dialogSendSMS"
      content-class="dialog-draggable is-lg is-scroll"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="SMS 발송"
        @hide="mixin_hideDialog('SendSMS')"
      >
        <template slot="body">
          <!-- component -->
           <CompoSendSms />

        </template>
        <template slot="footer">
          <v-btn class="pl-btn is-trans" @click="mixin_hideDialog('SendSMS')">닫기</v-btn>
          <v-btn class="pl-btn is-icon" >
            <span class="pl-icon20 chat-send-white"></span>
            메시지 보내기</v-btn>
        </template>
      </compo-dialog>
    </v-dialog>

    <!-- //mark: AS 접수 스케줄러 이관 -->
    <v-dialog
      v-model="dialogTransSchedule"
      content-class="dialog-draggable is-lg"
      hide-overlay>
      <div class="draggable-area">drag area</div>
      <compo-dialog
        header-title="AS 접수 스케줄러 이관"
        @hide="mixin_hideDialog('TransSchedule')"
      >
        <template slot="body">
          <!-- component -->
           <CompoTransSchedule />

        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
import CompoManagerInfo from '@/components/CompoManagerInfo'
import CompoAudioWave from '@/components/CompoAudioWave'
import CompoCsInfoTable from '@/components/CompoCsInfoTable'
import CompoSendSms from '@/components/CompoSendSms.vue'
import CompoTransSchedule from '@/components/CompoTransSchedule.vue'

export default {
  name: "CompoCsDetail", //상담 상세정보
  props: {
    popData : {
      type: Object,
    },
  },
  components: {
    CompoManagerInfo,
    CompoAudioWave,
    CompoCsInfoTable,
    CompoSendSms,
    CompoTransSchedule,
  },
  data() {
    return {
      // SMS발송
      dialogSendSMS: false,

      // 스케쥴러이관 팝업
      dialogTransSchedule: false,

      data: {
        PROFILE: {
          name: '김한나',
          img: require('@/assets/img/@manager_profile4.png'),
          part: '마이홈센터 - 마이홈1팀',
          rcv_date: '2024-06-20 09:30:25',
          exc_date: '2024-06-20 09:38:05',
          excuter: '김한나',
          status: '상담완료',
          statusColor: 'is-bg-green',
        },
        CUS_INFO: [
          { title:'인입번호', icon: 'cs-phone', val: '010-5303-4545' },
          { title:'휴대전화', val: '010-5303-4545' },
          { title:'전화번호1', val: '02-1234-8975' },
          { title:'전화번호2', val: '02-9876-2826' },
          { title:'전화번호3', val: '02-1234-8975' },
          { title:'이메일', val: 'Heons@hkcloud.co.kr' },
          { title:'고객 ID', icon: 'cs-black', val: 'CT169776487781660258' },
          { title:'고객명', val: '나고객' },
        ],
        // 상담정보
        CS_INFO: {
          radioGroupSelected: '동의',
          radioGroup: [
            { text: '동의' },
            { text: '미동의' },
          ],
          radioGroupSelected2: '완료',
          radioGroup2: [
            { text: '완료' },
            { text: '자체사후처리' },
            { text: '협업사후처리' },
            { text: '스케줄러이관' },
            { text: '호전환' },
          ],
          chn_category01: 'IN',
          chn_category02: 'SNS',
          chn_category03: '카카오톡',
          category01: null,
          category02: null,
          category03: null,
          textarea: `주방 수전사용시 헤드부분 누수`,
          textareaH: 74,
        },
      },


    }
  },
  methods: {
    close(){
      this.$emit('Close')
    }
  },
  mounted() {
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>

</style>