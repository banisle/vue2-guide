<template>
  <div class="guide-content">
    <div class="guide-content-header">Components<v-icon class="mdi mdi-chevron-right"></v-icon><span>{{ SelectedProp }}</span>
      <guide-index :LinkProp="toplink"/>
    </div>

    <!-- //mark: Size -->
    <h2>{{ toplink[0] }}</h2>
    <div class="guide-card">
      <div class="pl-tags-wrap">
        <v-chip-group
          active-class="active-tag"
          column
        >
          <template v-for="tag, index in tags" >
            <v-chip
              v-show="tag.active"
              :key="index"
              close
              @click:close="tag.active = false"
            >
              {{ tag.text }}
            </v-chip>
          </template>
          <template>
            <!-- 추가 입력 -->
            <v-text-field
              v-model="addTagValue"
              @keydown.enter="addTag()"
              @input="onInputTag"
              :style="computedTagSize"
              class="pl-form is-tag">
              <template v-slot:append>
                <v-btn
                  @click="addTag()"
                  class="pl-btn has-icon-only">
                  <span class="pl-icon20 edit"></span>
                </v-btn>
              </template>
            </v-text-field>
          </template>
        </v-chip-group>
      </div>
    </div>
    <guide-srcview :ModelProp.sync="source01" :SrcProp="srcAll.srcInput_01" />

    <!-- //mark: Badge -->
    <h2>{{ toplink[1] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <span class="pl-badge is-red">완료</span>
        <span class="pl-badge is-org">완료</span>
        <span class="pl-badge is-yellow">완료</span>
        <span class="pl-badge is-blue">완료</span>
        <span class="pl-badge is-cyan">완료</span>
        <span class="pl-badge is-indigo">완료</span>
        <span class="pl-badge is-blueGray">완료</span>
        <span class="pl-badge is-green">완료</span>
        <span class="pl-badge is-purple">완료</span>
        <span class="pl-badge is-main">완료</span>
        <span class="pl-badge is-black">완료</span>
        <span class="pl-badge is-white">완료</span>
        <span class="pl-badge is-number">000</span>
        <span class="pl-badge is-new">N</span>
        <span class="pl-badge type-light is-red">첨부파일 있음</span>
        <span class="pl-badge type-light is-org">첨부파일 있음</span>
        <span class="pl-badge type-light is-yellow">첨부파일 있음</span>
        <span class="pl-badge type-light is-blue">첨부파일 있음</span>
        <span class="pl-badge type-light is-cyan">첨부파일 있음</span>
      </div>

    </div>
    <guide-srcview :ModelProp.sync="source02" :SrcProp="srcAll.srcInput_02" />

    <!-- //mark: Emblem -->
    <h2>{{ toplink[2] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <span class="pl-emblem">불</span>
        <span class="pl-emblem is-org">주</span>
        <span class="pl-emblem is-blue">혼</span>
        <span class="pl-emblem is-green">신</span>
        <span class="pl-emblem is-purple">소</span>
        <span class="pl-emblem is-yellow">주</span>
        <span class="pl-emblem is-cyan">주</span>
        <span class="pl-emblem is-indigo">주</span>
        <span class="pl-emblem is-blueGray">주</span>
        <span class="pl-emblem is-main">주</span>
        <span class="pl-emblem is-black">주</span>
        <span class="pl-emblem is-white">주</span>
      </div>

    </div>
    <guide-srcview :ModelProp.sync="source03" :SrcProp="srcAll.srcInput_03" />

    <!-- //mark: Bullet -->
    <h2>{{ toplink[3] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <span class="pl-bullet-txt is-green">채팅</span>
        <span class="pl-bullet-txt is-yellow">문자</span>
        <span class="pl-bullet-txt is-red">이메일</span>
        <span class="pl-bullet-txt is-blue">IB</span>
        <span class="pl-bullet-txt is-indigo">OB</span>
      </div>

    </div>
    <guide-srcview :ModelProp.sync="source04" :SrcProp="srcAll.srcInput_04" />

    <!-- //mark: Bullet Text-->
    <h2>{{ toplink[4] }}</h2>
    <div class="guide-card">
      <div class="guide-gap">
        <span class="pl-bullet-txt type-dot is-stat-call">통화중</span>
        <span class="pl-bullet-txt type-dot is-stat-wait">대기</span>
        <span class="pl-bullet-txt type-dot is-stat-work">작업중</span>
        <span class="pl-bullet-txt type-dot is-stat-rest">휴식</span>
        <span class="pl-bullet-txt type-dot is-stat-out">로그아웃</span>
      </div>

    </div>
    <guide-srcview :ModelProp.sync="source05" :SrcProp="srcAll.srcInput_05" />


  </div>
</template>

<script>

import guideJs from '@/Guide/guide.js'

export default {
  name: "GuideChips",

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
        'Tag',
        'Badge',
        'Emblem',
        'Bullet',
        'Bullet Text'
      ],
      source01: null,
      source02: null,
      source03: null,
      source04: null,
      source05: null,

      srcAll: {
        srcInput_01: [
          {
            tab: "html",
            content: `<div class="pl-tags-wrap">
  <v-chip-group
    active-class="active-tag"
    column
  >
    <template v-for="tag, index in tags" >
      <v-chip
        v-show="tag.active"
        :key="index"
        close
        @click:close="tag.active = false"
      >
        {{ tag.text }}
      </v-chip>
    </template>
    <template>
      <!-- 추가 입력 -->
      <v-text-field
        v-model="addTagValue"
        @keydown.enter="addTag()"
        @input="onInputTag"
        :style="computedTagSize"
        class="pl-form is-tag">
        <template v-slot:append>
          <v-btn
            @click="addTag()"
            class="pl-btn has-icon-only">
            <span class="pl-icon20 edit"></span>
          </v-btn>
        </template>
      </v-text-field>
    </template>
  </v-chip-group>
</div>`
          },
          { tab: "script", content:
`data() {
  return {
    addTagValue : '',
    inputTagSize : '',
    tags: [
      { text: '할인', active: true},
      { text: '청약', active: true},
      { text: '청약상품안내', active: true},
      { text: '금리 조정', active: true},
    ],
  }
},
methods: {
  addTag(){
    const addTag = { text: this.addTagValue, active: true };
    let tagVal = this.addTagValue.trim();
    if( tagVal.length !== 0 ) {
      this.tags.push(addTag);
      this.addTagValue = '';
      this.inputTagSize = 0;
    }
  },
  onInputTag(){
    this.inputTagSize = this.addTagValue.length;
  }
},
computed: {
  computedTagSize() {
    return \`flex: 0 0 \${ this.inputTagSize + 12 }ch;\`;
  }
},` },
        ],
        srcInput_02: [
          {
            tab: "html",
            content:
`<div class="guide-gap">
  <span class="pl-badge is-red">주</span>
  <span class="pl-badge is-org">완료</span>
  <span class="pl-badge is-yellow">완료</span>
  <span class="pl-badge is-blue">완료</span>
  <span class="pl-badge is-cyan">완료</span>
  <span class="pl-badge is-indigo">완료</span>
  <span class="pl-badge is-blueGray">완료</span>
  <span class="pl-badge is-green">완료</span>
  <span class="pl-badge is-purple">완료</span>
  <span class="pl-badge is-main">완료</span>
  <span class="pl-badge is-black">완료</span>
  <span class="pl-badge is-white">완료</span>
  <span class="pl-badge is-number">완료</span>
  <span class="pl-badge is-new">N</span>
  <span class="pl-badge type-light is-red">첨부파일 있음</span>
  <span class="pl-badge type-light is-org">첨부파일 있음</span>
  <span class="pl-badge type-light is-yellow">첨부파일 있음</span>
  <span class="pl-badge type-light is-blue">첨부파일 있음</span>
  <span class="pl-badge type-light is-cyan">첨부파일 있음</span>
</div>`
          },
          { tab: "script", content:
`` },
        ],
        srcInput_03: [
          {
            tab: "html",
            content:
`<span class="pl-emblem">불</span>
<span class="pl-emblem is-org">주</span>
<span class="pl-emblem is-blue">혼</span>
<span class="pl-emblem is-green">신</span>
<span class="pl-emblem is-purple">소</span>
<span class="pl-emblem is-yellow">주</span>
<span class="pl-emblem is-cyan">주</span>
<span class="pl-emblem is-indigo">주</span>
<span class="pl-emblem is-blueGray">주</span>
<span class="pl-emblem is-main">주</span>
<span class="pl-emblem is-black">주</span>
<span class="pl-emblem is-white">주</span>`
          },
          { tab: "script", content:
`data() {
  return {

  }
},
methods: {

},
computed: {

},` },],
        srcInput_04: [
          {
            tab: "html",
            content: `<span class="pl-bullet-txt is-green">채팅</span>
<span class="pl-bullet-txt is-yellow">문자</span>
<span class="pl-bullet-txt is-red">이메일</span>
<span class="pl-bullet-txt is-blue">IB</span>
<span class="pl-bullet-txt is-indigo">OB</span>`
          },
          { tab: "script", content:
          `data() {
            return {

            }
          },
          methods: {

          },
          computed: {

          },` }
        ],
        srcInput_05: [
        {
          tab: "html",
          content: `<span class="pl-bullet-txt type-dot is-stat-call">통화중</span>
<span class="pl-bullet-txt type-dot is-stat-wait">대기</span>
<span class="pl-bullet-txt type-dot is-stat-work">작업중</span>
<span class="pl-bullet-txt type-dot is-stat-rest">휴식</span>
<span class="pl-bullet-txt type-dot is-stat-out">로그아웃</span>`
        },
        { tab: "script", content:
        `data() {
          return {

          }
        },
        methods: {

        },
        computed: {

        },` }
      ],
      },


      //tags
      addTagValue : '',
      inputTagSize : '',
      tags: [
        { text: '할인', active: true},
        { text: '청약', active: true},
        { text: '청약상품안내', active: true},
        { text: '금리 조정', active: true},
      ],
    }
  },
  methods: {
    addTag(){
      const addTag = { text: this.addTagValue, active: true };
      let tagVal = this.addTagValue.trim();
      if( tagVal.length !== 0 ) {
        this.tags.push(addTag);
        this.addTagValue = '';
        this.inputTagSize = 0;
      }
    },
    onInputTag(){
      this.inputTagSize = this.addTagValue.length;
    }
  },
  computed: {
    computedTagSize() {
      return `flex: 0 0 ${ this.inputTagSize + 12 }ch;`;
    }
  },
  mounted() {
    guideJs.appendHiddenLink(this.toplink);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>