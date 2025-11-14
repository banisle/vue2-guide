<template>
  <div class="fill-height parent" >
    <!-- 버튼 -->
    <div class="div1 px-5 py-3 is-border-bottom is-border-right">
      <div class="pl-btn-wrap">
        <!-- 추가 -->
        <compo-tooltip-btn
          TitleProp="문항 추가"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 circle-plus"
          TooltipPositionProp="bottom"
        ></compo-tooltip-btn>
        <!-- 삭제 -->
        <compo-tooltip-btn
          TitleProp="선택문항 삭제"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 trash"
          TooltipPositionProp="bottom"
        ></compo-tooltip-btn>
        <!-- list up 버튼 -->
        <compo-tooltip-btn
          TitleProp="위로"
          ClassProp="pl-tooltip-btn ml-auto"
          IconProp="pl-icon20 is-list-up"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('list up ')"
        ></compo-tooltip-btn>
        <!-- list down 버튼 -->
        <compo-tooltip-btn
          TitleProp="아래로"
          ClassProp="pl-tooltip-btn"
          IconProp="pl-icon20 is-list-down"
          TooltipPositionProp="bottom"
          @btnClick="mixin_testLog('list down')"
        ></compo-tooltip-btn>
      </div>
    </div>
    <!-- 타이틀 -->
    <div class="div2 px-5 py-3 d-flex is-border-bottom">
      <h3 class="pl-subtit is-lg">2024년 06월 업무테스트(일반)</h3>
      <v-btn class="pl-btn is-icon is-trans ml-auto" @click="showPreviewSheet()">
        <span class="pl-icon20 board-docu"></span>
        평가지 미리보기
      </v-btn>
    </div>
    <!-- 문항 -->
    <div class="div3 px-5 py-5 is-border-right pl-scroll-body" style="height: calc(100vh - 255px);">
      <div class="spacing-wrap sp-8 flex-column">
        <div
          :class="`pl-rounded-box pa-3 hover-outline ${ selectedIndex === index ? 'selected-q' : ''}`"
          @click="selecteList(q, index)"
          v-for="q, index in Q_LIST"
          :key="q.id">
          <strong style="font-size: 16px;">{{ q.index }}번</strong>
          <div class="spacing-wrap sp-4 pt-1">
            <span>{{ q.type }}</span>
            <span>{{ q.select_type }}</span>
            <span>{{ q.point }}</span>점
          </div>
        </div>
      </div>
    </div>
    <!-- 문항 상세 : 에디터-->
    <div class="div4 is-border-right">
      <!-- editor -->
      <div class="px-5 pt-5">
        <crosseditor
          v-model="crosseditor_initial_value"
          id="ne-crosseditor-001"
          ref="crossEditor"
          editorHeight="300"
          editorWidth="860"
        ></crosseditor>
      </div>
      <!-- 보기/해설 -->
      <div class="div5 py-3 is-border-right">
        <!-- tab -->
        <div class="is-border-bottom">
          <v-tabs
            v-model="tabs2"
            @change="tabChange(tabs2)"
            slider-size="2"
            class="pl-tabs px-4 is-noborder">
            <CompoTabItems :TabsList=tabsList2 >
            </CompoTabItems>
            <v-btn class="pl-btn is-icon is-trans ml-auto align-self-center">
              <span class="pl-icon20 circle-plus"></span>
              보기 추가 
            </v-btn>
          </v-tabs>
        </div>
        <v-tabs-items v-model="tabs2">
          <div class="fill-height">
            <template v-for="(item, index) in tabsList2" >
              <v-tab-item :key="index">
                <div
                  :class="`fill-height tab-contents`">
                  <component :is="item.content" :DataProp="selectedItem" :TypeProp="SendProp"></component>
                </div>
              </v-tab-item>
            </template>
          </div>
        </v-tabs-items>
      </div>
    </div>
    <!-- 문항 정보 / 출제자 정보 -->
    <div class="div6 px-5 py-5">
      <div>
        <h3 class="pl-subtit is-lg">문항 정보</h3>
        <div class="is-mt-m">
          <div class="pl-form-inline-wrap vertical label-80">
            <div class="pl-form-inline">
              <span class="pl-label">
                문제 형식
              </span>
              <div class="pl-desc">
                <v-select
                  @change="sendQinfo()"
                  v-model="modelQtype"
                  :items="itemsQtype"
                  class="pl-form type-middle"
                  value="pl-form"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                답변 형식
              </span>
              <div class="pl-desc">
                <!-- 객관식 -->
                <template v-if="modelQtype === '객관식'">
                  <v-select
                    @change="sendQinfo()"
                    v-model="modelAtype"
                    :items="itemsAtype"
                    class="pl-form type-middle"
                    value="pl-form"
                    />
                </template>
                <!-- 주관식 -->
                <template v-if="modelQtype === '주관식'">
                  <v-select
                    @change="sendQinfo()"
                    v-model="modelAtype2"
                    :items="itemsAtype2"
                    class="pl-form type-middle"
                    value="pl-form"
                    />
                </template>
                </div>
              </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                난이도
              </span>
              <div class="pl-desc">
                <v-select
                  v-model="modelDiffculty"
                  :items="itemsDiffculty"
                  class="pl-form type-middle"
                  value="pl-form"
                />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                배점
              </span>
              <div class="pl-desc">
                <v-text-field
                  v-model="modelPoint"
                  class="pl-form type-middle"
                  type="number" />
              </div>
            </div>
            <div class="pl-form-inline">
              <span class="pl-label">
                범주
              </span>
              <div class="pl-desc">
                <v-select
                  class="pl-form type-middle"
                  value="pl-form"
                  placeholder="선택"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 is-border-sub-top pt-6">
        <h3 class="pl-subtit is-lg">출제자 정보</h3>
        <div class="is-mt-m">
          <div class="pl-form-inline-wrap vertical label-80" style="gap: 0">
            <div
              class="pl-form-inline"
              v-for="item in WRITER_INFO_LIST"
              :key="item.id">
              <span class="pl-label">
                {{ item.key }}
              </span>
              <div class="pl-desc">
                <span class="pl-value-txt">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- dialog:평가지 미리보기 -->
    <template v-if="dialogPreviewSheet">
      <CompoPreviewSheet @ConfirmTest="dialogPreviewSheet = false"/>
    </template>
  </div>
</template>

<script>
import CompoTabItems from '@/components/CompoTabItems.vue';
import CompoPreviewSheet from '@/components/CompoPreviewSheet.vue';
import QTM_M0100_DIALOG_MANAGE_TAB_01 from '@/views/page/QTM_M0100_DIALOG_MANAGE_TAB_01.vue';
import QTM_M0100_DIALOG_MANAGE_TAB_02 from '@/views/page/QTM_M0100_DIALOG_MANAGE_TAB_02.vue';

export default {
  name: 'QTM_M0100_DIALOG_MANAGE', //평가지 문항 관리
  components: {
    CompoTabItems,
    CompoPreviewSheet,
    QTM_M0100_DIALOG_MANAGE_TAB_01,
    QTM_M0100_DIALOG_MANAGE_TAB_02,
  },
  data() {
    return {

      // 문항
      Q_LIST: [
        { index: 1, type: '객관식', select_type: '단일선택', point: 10, },
        { index: 2, type: '객관식', select_type: '복수선택', point: 10, },
        { index: 3, type: '주관식', select_type: '단일선택', point: 10,
          correctA: '행복주택',
          answer_list: [
            { title: '거주의무 유예는 주택법 개정(’24.3.19) 이후 입주자 모집 공고의 입주자에게만 적용된다.'},
            { title: '개정일 전 사용검사를 받아 이미 입주한 거주의무자의 “거주의무기간의 종료시점”을 최대 3년간 유예할 수 있으며, 횟수 관계없이 퇴거 후 재입주 가능하다. '},
            { title: '개정일 이후 사용검사를 받는 주택도 “거주의무기간의 종료시점”을 최대 3년간 유예할 수 있으며, 2회에 한하여 퇴거 후 재입주 가능하다. '},
            { title: '개정일 이후 사용검사를 받은 주택의 경우는 최초 입주한 이후에는 계속하여 거주의무를 이행하여야 한다.'},
          ],
          editor_val: '통합공공임대주택 갱신계약 관련 내용으로 맞으면 ○, 틀리면 X를 “보기”에서 선택하세요.<br><br>천년 및 혼인 중이 아닌 경우로서 단독세대주로 입주한 고령자는 청약신청 당시 무주택세대구성원이 아닌 신청자 본인의 무주택 여부만을 판단하나, 입주 이후 갱신계약 시에는 “무주택세대구성원”을 대산으로 주택 소유 여부를 검증한다.'
        },
        { index: 4, type: '객관식', select_type: '단일선택', point: 10, },
        { index: 5, type: '객관식', select_type: '단일선택', point: 10, },
        { index: 6, type: '객관식', select_type: '단일선택', point: 10, },
        { index: 7, type: '객관식', select_type: '단일선택', point: 10, },
        { index: 8, type: '객관식', select_type: '단일선택', point: 10, },
        { index: 9, type: '객관식', select_type: '단일선택', point: 10, },
        { index: 10, type: '객관식', select_type: '단일선택', point: 10, },
      ],
      selectedIndex: null,
      selectedItem: {},
      crosseditor_initial_value: '',

      // 에디터

       // tab
      tabs2: null,
      tabsList2: [
        { title: '보기/답란', content: 'QTM_M0100_DIALOG_MANAGE_TAB_01', badge: false},
        { title: '해설', content: 'QTM_M0100_DIALOG_MANAGE_TAB_02', badge: false},
      ],

      // 문항 정보 / 출제자 정보
      modelQtype: '객관식',
      itemsQtype: ['객관식','주관식'],

      modelAtype: '단일선택',
      itemsAtype: ['단일선택','다중선택'],

      modelAtype2: '단답형',
      itemsAtype2: ['단답형','서술형'],

      modelDiffculty: '중',
      itemsDiffculty: ['중'],
      SendProp: {},

      modelPoint: 10,
      WRITER_INFO_LIST: [
        { key: '출제자', value: '나 출제' },
        { key: '출제일', value: '2024-06-18 13:25:45' },
        { key: '수정자', value: '나수정' },
        { key: '수정일', value: '2024-06-19 11:32:45' },
      ],

      // dialog: 평가지 미리보기
      dialogPreviewSheet: false,

    }
  },
  methods: {
    showPreviewSheet(){
      this.dialogPreviewSheet = true
      this.mixin_fullscreen()
    },
    selecteList(item,index){
      this.selectedIndex = index
      this.selectedItem = item
      this.$refs.crossEditor.update(this.selectedItem.editor_val);
    },
    tabChange(tab){
      this.$emit('Tabchange',tab)
    },
    sendQinfo(){
      this.SendProp = {
        q_type: this.modelQtype,
        a_type2: this.modelAtype2,
      }
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
.parent {
display: grid;
grid-template-columns: 250px 900px 1fr;
grid-template-rows: 55px repeat(2, 1fr);
grid-column-gap: 0px;
grid-row-gap: 0px;
}

.div1 { grid-area: 1 / 1 / 2 / 2; }
.div2 { grid-area: 1 / 2 / 2 / 4; }
.div3 { grid-area: 2 / 1 / 4 / 2; }
.div4 { grid-area: 2 / 2 / 4 / 3; }
.div5 { grid-area: 3 / 2 / 4 / 3; }
.div6 { grid-area: 2 / 3 / 4 / 4; }
.selected-q{
  border-color: var(--primary-color);
}
</style>'