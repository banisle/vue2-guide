<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div >
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
                  회사구분
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
              </th>
              <td colspan="3">
                <div class="spacing-wrap sp-4">
                  <v-select
                    :items="dropItems"
                    class="pl-form is-auto"
                    item-text="title"
                    placeholder="선택하세요"
                  ></v-select>
                  <v-select
                    :items="dropItems"
                    class="pl-form is-auto"
                    item-text="title"
                    placeholder="선택하세요"
                  ></v-select>
                  <v-select
                    :items="dropItems"
                    class="pl-form is-auto"
                    item-text="title"
                    placeholder="선택하세요"
                  ></v-select>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  사용자ID
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
              </th>
              <td>
                <v-text-field
                  class="pl-form is-auto"
                  value="HKcloud"
                >
                </v-text-field>
              </td>
              <th scope="row">
                <span class="pl-label">
                  사용자명
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
              </th>
              <td>
                <v-text-field
                  class="pl-form is-auto"
                  value="한국클라우드"
                >
                </v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  변경 불가 텍스트
                </span>
              </th>
              <td>
                <span class="pl-value-txt">
                  이것은 불러온 값입니다.
                </span>
              </td>
              <th scope="row">
                <span class="pl-label">
                  Disabled
                </span>
              </th>
              <td>
                <v-text-field
                  class="pl-form is-auto"
                  value="이것은 diasbled 처리값 입니다"
                  disabled
                >
                </v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  닉네임
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
              </th>
              <td colspan="3">
                <v-text-field
                  class="pl-form is-auto"
                  value="팔레트"
                >
                </v-text-field>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  소속
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
              </th>
              <td colspan="3" class="has-textarea">
                <v-textarea
                  class="pl-form is-noresize"
                  :spellcheck="false"
                  value="텍스트 에리어 영역"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  textarea 불러온 값
                  <v-icon class="pl-icon20 required"></v-icon>
                </span>
              </th>
              <td colspan="3">
                <div class="pl-txt-area">
                  세계를 향한 대화, 유니코드로 하십시오. 제10회 유니코드 국제 회의가 1997년 3월 10일부터 12일까지 독일의 마인즈에서 열립니다. 지금 등록하십시오. 이 회의에서는 업계 전반의 전문가들이 함께 모여 다음과 같은 분야를 다룹니다. - 인터넷과 유니코드, 국제화와 지역화, 운영 체제와 응용 프로그램에서 유니코드의 구현, 글꼴, 문자 배열, 다국어 컴퓨팅.
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  카테고리
                </span>
              </th>
              <td colspan="3">
                <div class="pl-selection-row pl-2">
                  <v-checkbox
                    v-model="chk01.selected"
                    v-for="(chk01, index) in chkTypes"
                    :key="index"
                    :label="chk01.text"
                    class="pl-check "
                  ></v-checkbox>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="pl-label">
                  범위
                </span>
              </th>
              <td colspan="3">
                <v-radio-group
                  v-model="radioGroupSelected"
                  row
                  class="pl-radio-group pl-2"
                >
                  <v-radio
                    v-for="(rad01, index) in radioGroup"
                    :key="radioGroup[index].text"
                    :label="rad01.text"
                    :value="rad01.text"
                    class="pl-radio"
                  >
                  </v-radio>
                </v-radio-group>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Header Table -->
    <!-- <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <table class="pl-tbl-inner">
        <colgroup>
          <col width="50%" />
          <col width="" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">항목1</th>
            <th scope="col">항목2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>내용1</td>
            <td>내용2</td>
          </tr>
        </tbody>
      </table>
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" /> -->

  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideTable",

  props:{
    SelectedProp: {
      type: String,
    }
  },
  components: {
  },
  data() {
    return {
      toplink: [
        'Default',
        // 'Inner Table',
      ],
      source01: null,
      source02: null,
      source03: null,
      dropItems: [
        'itme A',
        'itme B',
        'itme C',
        'itme D',
        'itme E',
      ],
      chkTypes: [
        {
          text: "A팀",
          selected: true,
        },
        {
          text: "B팀",
          selected: true,
        },
        {
          text: "C팀",
          selected: false,
        },
      ],
      radioGroupSelected: "radio02",
      radioGroup: [
        {
          text: "radio01",
        },
        {
          text: "radio02",
        },
        {
          text: "radio03",
        },
      ],

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<table class="pl-tbl-detail">
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
          회사구분
          <v-icon class="pl-icon20 required"></v-icon>
        </span>
      </th>
      <td colspan="3">
        <div class="spacing-wrap sp-4">
          <v-select
            :items="dropItems"
            class="pl-form is-auto"
            item-text="title"
            placeholder="선택하세요"
          ></v-select>
          <v-select
            :items="dropItems"
            class="pl-form is-auto"
            item-text="title"
            placeholder="선택하세요"
          ></v-select>
          <v-select
            :items="dropItems"
            class="pl-form is-auto"
            item-text="title"
            placeholder="선택하세요"
          ></v-select>
        </div>
      </td>
    </tr>
    <tr>
      <th scope="row">
        <span class="pl-label">
          사용자ID
          <v-icon class="pl-icon20 required"></v-icon>
        </span>
      </th>
      <td>
        <v-text-field
          class="pl-form is-auto"
          value="HKcloud"
        >
        </v-text-field>
      </td>
      <th scope="row">
        <span class="pl-label">
          사용자명
          <v-icon class="pl-icon20 required"></v-icon>
        </span>
      </th>
      <td>
        <v-text-field
          class="pl-form is-auto"
          value="한국클라우드"
        >
        </v-text-field>
      </td>
    </tr>
    <tr>
      <th scope="row">
        <span class="pl-label">
          변경 불가 텍스트
        </span>
      </th>
      <td>
        <span class="pl-value-txt">
          이것은 불러온 값입니다.
        </span>
      </td>
      <th scope="row">
        <span class="pl-label">
          Disabled
        </span>
      </th>
      <td>
        <v-text-field
          class="pl-form is-auto"
          value="이것은 diasbled 처리값 입니다"
          disabled
        >
        </v-text-field>
      </td>
    </tr>
    <tr>
      <th scope="row">
        <span class="pl-label">
          닉네임
          <v-icon class="pl-icon20 required"></v-icon>
        </span>
      </th>
      <td colspan="3">
        <v-text-field
          class="pl-form is-auto"
          value="팔레트"
        >
        </v-text-field>
      </td>
    </tr>
    <tr>
      <th scope="row">
        <span class="pl-label">
          소속
          <v-icon class="pl-icon20 required"></v-icon>
        </span>
      </th>
      <td colspan="3" class="has-textarea">
        <v-textarea
          class="pl-form is-noresize"
          :spellcheck="false"
          value="텍스트 에리어 영역"
        />
      </td>
    </tr>
    <tr>
      <th scope="row">
        <span class="pl-label">
          textarea 불러온 값
          <v-icon class="pl-icon20 required"></v-icon>
        </span>
      </th>
      <td colspan="3">
        <div class="pl-txt-area">
          세계를 향한 대화, 유니코드로 하십시오. 제10회 유니코드 국제 회의가 1997년 3월 10일부터 12일까지 독일의 마인즈에서 열립니다. 지금 등록하십시오. 이 회의에서는 업계 전반의 전문가들이 함께 모여 다음과 같은 분야를 다룹니다. - 인터넷과 유니코드, 국제화와 지역화, 운영 체제와 응용 프로그램에서 유니코드의 구현, 글꼴, 문자 배열, 다국어 컴퓨팅.
        </div>
      </td>
    </tr>
    <tr>
      <th scope="row">
        <span class="pl-label">
          카테고리
        </span>
      </th>
      <td colspan="3">
        <div class="pl-selection-row pl-2">
          <v-checkbox
            v-model="chk01.selected"
            v-for="(chk01, index) in chkTypes"
            :key="index"
            :label="chk01.text"
            class="pl-check "
          ></v-checkbox>
        </div>
      </td>
    </tr>
    <tr>
      <th scope="row">
        <span class="pl-label">
          범위
        </span>
      </th>
      <td colspan="3">
        <v-radio-group
          v-model="radioGroupSelected"
          row
          class="pl-radio-group pl-2"
        >
          <v-radio
            v-for="(rad01, index) in radioGroup"
            :key="radioGroup[index].text"
            :label="rad01.text"
            :value="rad01.text"
            class="pl-radio"
          >
          </v-radio>
        </v-radio-group>
      </td>
    </tr>
  </tbody>
</table>`
          },
          { tab: "script", content:
`dropItems: [
  'itme A',
  'itme B',
  'itme C',
  'itme D',
  'itme E',
],` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
``
          },
          { tab: "script", content:
`` },
        ],

      },
    }
  },
  methods: {
  },
  computed: {
  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>