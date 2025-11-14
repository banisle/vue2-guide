<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Default -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <v-textarea
        class="pl-form"
        :rules="textareaRules"
        :value="textareaValue"
      />
      <v-textarea
        disabled
        class="pl-form is-mt-m"
        :rules="textareaRules"
        value="disabled"
      />
      <v-textarea
        readonly
        class="pl-form is-mt-m"
        :rules="textareaRules"
        value="readonly"
      />
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Auto grow -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <v-textarea
        class="pl-form"
        :rules="textareaRules"
        :value="textareaValue"
        :spellcheck="false"
        auto-grow
      />
    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: No resize -->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <v-textarea
        class="pl-form is-noresize"
        :rules="textareaRules"
        :value="textareaValue"
        :spellcheck="false"
      />
    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

    <!-- //mark: fake textarea -->
    <h2>{{ toplink[3] }}</h2>
    <div class="guide-card">
      <div class="pl-textarea-wrap pl-scroll-body">{{ dummy_text }}</div>
    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />

  </div>
</template>

<script>
import guideJs from '@/Guide/guide.js'
export default {
  name: "GuideTextarea",
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
        'Auto grow',
        'No resize',
        'fake textarea',
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      textareaRules: [v => v.length <= 200 || 'Max 200 characters'],
      textareaValue: '200자 제한!',
      dummy_text: `한 회계연도를 넘어 계속하여 지출할 필요가 있을 때에는 정부는 연한을 정하여 계속비로서 국회의 의결을 얻어야 한다. 국정감사 및 조사에 관한 절차 기타 필요한 사항은 법률로 정한다. 헌법개정은 국회재적의원 과반수 또는 대통령의 발의로 제안된다. 전직대통령의 신분과 예우에 관하여는 법률로 정한다. 대한민국의 영토는 한반도와 그 부속도서로 한다. 의원을 제명하려면 국회재적의원 3분의 2 이상의 찬성이 있어야 한다. 근로조건의 기준은 인간의 존엄성을 보장하도록 법률로 정한다. 대통령은 국가의 독립·영토의 보전·국가의 계속성과 헌법을 수호할 책무를 진다. 누구든지 체포 또는 구속의 이유와 변호인의 조력을 받을 권리가 있음을 고지받지 아니하고는 체포 또는 구속을 당하지 아니한다. 체포 또는 구속을 당한 자의 가족등 법률이 정하는 자에게는 그 이유와 일시·장소가 지체없이 통지되어야 한다.

각급 선거관리위원회의 조직·직무범위 기타 필요한 사항은 법률로 정한다. 군인은 현역을 면한 후가 아니면 국무위원으로 임명될 수 없다. 피고인의 자백이 고문·폭행·협박·구속의 부당한 장기화 또는 기망 기타의 방법에 의하여 자의로 진술된 것이 아니라고 인정될 때 또는 정식재판에 있어서 피고인의 자백이 그에게 불리한 유일한 증거일 때에는 이를 유죄의 증거로 삼거나 이를 이유로 처벌할 수 없다. 원장은 국회의 동의를 얻어 대통령이 임명하고, 그 임기는 4년으로 하며, 1차에 한하여 중임할 수 있다. 대한민국의 국민이 되는 요건은 법률로 정한다. 헌법개정안은 국회가 의결한 후 30일 이내에 국민투표에 붙여 국회의원선거권자 과반수의 투표와 투표자 과반수의 찬성을 얻어야 한다.`,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content:
`<v-textarea
  class="pl-form"
  :rules="textareaRules"
  :value="textareaValue"
  :spellcheck="false"
/>
<v-textarea
  disabled
  class="pl-form is-mt-m"
  :rules="textareaRules"
  value="disabled"
/>
<v-textarea
  readonly
  class="pl-form is-mt-m"
  :rules="textareaRules"
  value="readonly"
/>`
          },
          { tab: "script", content:
`textareaRules: [v => v.length <= 200 || 'Max 200 characters'],
textareaValue: '200자 제한!',`, },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<v-textarea
  class="pl-form"
  :rules="textareaRules"
  :value="textareaValue"
  :spellcheck="false"
  auto-grow
/>`
          },
          { tab: "script", content:
`textareaRules: [v => v.length <= 200 || 'Max 200 characters'],
textareaValue: '200자 제한!',`, },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<v-textarea
  class="pl-form is-noresize"
  :rules="textareaRules"
  :value="textareaValue"
  :spellcheck="false"
/>`
          },
          { tab: "script", content:
`textareaRules: [v => v.length <= 200 || 'Max 200 characters'],
textareaValue: '200자 제한!',`, },
        ],
        srcInput_04: [
          {
            tab: "html",
            content:
`<div class="pl-textarea-wrap pl-scroll-body">{{ dummy_text }}</div>`
          },
          { tab: "script", content:
`dummy_text: \`한 회계연도를 넘어 계속하여 지출할 필요가 있을 때에는 정부는 연한을 정하여 계속비로서 국회의...\``, },
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