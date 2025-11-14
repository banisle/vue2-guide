<template>
  <div>
    <div class="pl-header is-no-boredr">
      <v-icon class="pl-icon20 square-title" style="margin-top: 2px;"></v-icon>
      <div class="pl-subtit ml-1">작업내용 상세 정보</div>
    </div>
    <div class="is-mt-s">
      <table class="pl-tbl-detail">
        <colgroup>
          <col width="127px" />
          <col width="" />
          <col width="127px" />
          <col width="" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">
              <span class="pl-label">
                접수자
              </span>
            </th>
            <td >
            <v-text-field
                disabled
                class="pl-form is-auto"
                value="우성아"
                placeholder="" />
            </td>
            <th scope="row">
              <span class="pl-label">
                업체명
              </span>
            </th>
            <td >
            <v-text-field
                disabled
                class="pl-form is-auto"
                value="코오롱를로벌 주식회사"
                placeholder="" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <span class="pl-label">
                처리자
              </span>
            </th>
            <td >
            <v-text-field
                disabled
                class="pl-form is-auto"
                value="나처리"
                placeholder="" />
            </td>
            <th scope="row">
              <span class="pl-label">
                처리자 연락처
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
              </span>
            </th>
            <td >
            <v-text-field
                disabled
                class="pl-form is-auto"
                placeholder=""
                value="010-1004-1004" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <span class="pl-label">
                본부 이관일
              </span>
            </th>
            <td >
            <v-text-field
                disabled
                class="pl-form is-auto"
                value="2024-06-20"
                placeholder="" />
            </td>
            <th scope="row">
              <span class="pl-label">
                보수 지시일
              </span>
            </th>
            <td >
            <v-text-field
                disabled
                class="pl-form is-auto"
                value="2024-06-20"
                placeholder="" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <span class="pl-label">
                방문 예정일
              </span>
            </th>
            <td colspan="3">
            <v-text-field
                disabled
                class="pl-form is-auto"
                value="/ /"
                placeholder="" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <span class="pl-label">
                최초 등록일
              </span>
            </th>
            <td >
              <v-text-field
                disabled
                class="pl-form is-auto"
                value=""
                placeholder="" />
            </td>
            <th scope="row">
              <span class="pl-label">
                반려일자
              </span>
            </th>
            <td >
              <v-text-field
                disabled
                class="pl-form is-auto"
                value=""
                placeholder="" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <span class="pl-label">
                반려 사유
              </span>
            </th>
            <td colspan="3" class="has-textarea">
              <v-textarea
                height="60"
                disabled
                class="pl-form is-noresize"
                :spellcheck="false"
              />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <span class="pl-label">
                감독 사유
              </span>
            </th>
            <td colspan="3" class="has-textarea">
              <v-textarea
                height="60"
                disabled
                class="pl-form is-noresize"
                :spellcheck="false"
              />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <span class="pl-label">
                처리기한
              </span>
            </th>
            <td >
              <v-text-field
                disabled
                class="pl-form is-auto"
                value="2024-06-28"
                placeholder="" />
            </td>
            <th scope="row">
              <span class="pl-label">
                완료보고
              </span>
            </th>
            <td >
              <v-text-field
                disabled
                class="pl-form is-auto"
                value="2024-06-20"
                placeholder="" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <span class="pl-label">
                AS 처리내용
              </span>
            </th>
            <td colspan="3">
            <v-text-field
                disabled
                class="pl-form is-auto"
                value="콜센터 접수(06/17)"
                placeholder="" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              <span class="pl-label">
                보수완료
              </span>
            </th>
            <td >
              <v-text-field
                disabled
                class="pl-form is-auto"
                value=""
                placeholder="" />
            </td>
            <th scope="row">
              <span class="pl-label">
                최종 수정일
              </span>
            </th>
            <td >
              <v-text-field
                disabled
                class="pl-form is-auto"
                value="2024-06-20 10:01:40 (나수정)"
                placeholder="" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- SMS 발송 -->
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
  </div>
</template>

<script>
import CompoSendSms from '@/components/CompoSendSms'

export default {
  name: "CompoAsFlwAcpDetail_SUBTAB02", //AS 작업내용
  components: {
    CompoSendSms
  },
  data() {
    return {
      dialogSendSMS: false,


    }
  },
  methods: {
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