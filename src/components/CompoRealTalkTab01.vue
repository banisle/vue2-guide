<template>
  <div class="flex-grow-1 fill-height">
    <!-- 결과 -->
    <div class="is-vrt is-col-fix pb-3" >
      <div class=" pl-scroll-body py-1 list-fade-effect" style="height: 315px;">
        <!-- list -->
        <template v-if="TALK_DATA_SEARCH_CLCN.length > 0">
          <div class="is-mt-s pb-6">
            <div
              :class="`${ index !== 0 ? 'is-border-sub-top' : ''} pa-3 hover-light-bg ${ selectedIndex === index ? 'active' : ''}` "
              style="display: grid; gap: 16px; grid-template-columns: 150px 1fr 120px 80px 80px"
              v-for="item, index in TALK_DATA_SEARCH_CLCN"
              :key="item.pan_id">
              <div class="text-center pl-text-pre-wrap flex-grow-0" >
                <span v-if="item.pan_kd_cd === '01'">토지</span>
                <span v-if="item.pan_kd_cd === '02'">분양주택</span>
                <span v-if="item.pan_kd_cd === '03'">임대주택</span>
                <span v-if="item.pan_kd_cd === '04'">상가</span>
                <span v-if="item.pan_kd_cd === '1076'">주택매입</span>
              </div>
              <div>
                <div class="is-ellips pl-text-pre-wrap">
                  {{ item.pan_nm }}
                  <div class="d-flex align-center is-txt-sub mt-1" style="font-size: 13px; gap: 4px">
                    <span>종류:{{ item.pan_kd_cd_nm }}, 유형:{{ item.ais_tp_cd_nm }}</span>
                  </div>
                  <div class="d-flex align-center is-txt-sub mt-1" style="font-size: 13px; gap: 4px">
                    <span>게시일:{{ mixin_convertDate(item.pan_nt_st_dttm, 'yyyy.MM.dd HH:mm') }} &bull; 마감일:{{ mixin_convertDate(item.clsg_dt, 'yyyy.MM.dd') }}</span>
                  </div>
                </div>
              </div>

              <div class="text-center pl-text-pre-wrap" >{{ item.ara_nm }}</div>
              <div
                :class="`text-center ${ item.pan_ss === '공고중' ? 'is-txt-green' : 'is-txt-red' }`"
                >{{ item.pan_ss }}<!-- 공고상태 -->
              </div>
              <div class="spacing-wrap sp-4 justify-center ">
                <div v-if=" item.ATTACH_NMS_ARR.length > 0 && !mixin_isEmpty(item.ATTACH_NMS_ARR[0]) " >
                  <v-tooltip content-class="pl-tooltip " bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <span
                          v-bind="attrs"
                          v-on="on"
                          @click="openViewer(item.ATTACH_IDS_ARR[0], item.ATTACH_NMS_ARR[0], item.ATTACH_EXTS_ARR[0])"
                          class="d-flex align-center justify-center"
                          :style="`cursor: pointer; width: 20px; height: 20px; background-color: ${ getExtColor(item.ATTACH_EXTS_ARR[0]) }; overflow: hidden; border-radius: 6px;`">
                        <v-icon :class="`pl-icon30 file-${ item.ATTACH_EXTS_ARR[0]  }`" style="background-size: contain;"></v-icon>
                      </span>
                    </template>
                    <span v-if="item.ATTACH_EXTS_ARR[0] === 'pdf'">{{ item.ATTACH_NMS_ARR[0] }}</span>
                    <span v-if="item.ATTACH_EXTS_ARR[0] !== 'pdf'">{{ item.ATTACH_NMS_ARR[0] }}</span>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="pl-list-nodata">
            <span>검색 결과가 없습니다.</span>
          </div>
        </template>
      </div>
    </div>
    <v-dialog
        v-model="dialogFileDownload"
        width="420"
        content-class="pl-top-profile-dialog type-center"
        persistent>
      <compo-dialog
          header-title="개인 정보"
          @hide="mixin_hideDialog('FileDownload')"
      >
        <template slot="body">

          <div v-for="(file, fi) in selectedFiles" >
                <span class="d-flex align-center is-txt-sub mt-2" @click="openViewer(file.ID,file.EXT);">
                  <a href="#"  ><img width="20px" height="20px" :src="`/image/file_ext_icon/${ file.EXT.toUpperCase() }.png`" @error="function(e){e.target.src='/image/file_ext_icon/Default.png'}" style="background-size: contain;">
                  <strong class="ml-1" style="flex: 0 0 80px">{{ file.NM }}</strong></a>
                </span>
          </div>
        </template>
      </compo-dialog>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "CompoRealTalkTab01", //name은 'MENU_' + 파일명 조합
  components: {
  },
  props: {
    SelectedProp: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      TALK_DATA_SEARCH_CLCN_TMP : [{
          "ara_nm": "경기도",
          "pan_kd_cd": "01",
          "pan_nt_st_dttm": "20241004165500",/** 공고게시일 **/
          "ais_tp_cd_nm": "행복주택(신혼희망)",
          "pan_id": "2015122300016992",
          "pan_ss": "접수마감",
          "attach_ids": "2024100458936938.hwp",
          "pan_kd_cd_nm": "일반공고",
          "tp": "SLPA",
          "attach_nms": "20241004과천신혼희망타운행복예비.hwp",
          "pan_dt": "20241004", /* 공고일 */
          "seq_id": "4660",
          "clsg_dt": "20241016",  /* 공고마감일 */
          "cnp_cd_list_cts": "41|",
          "pan_nm": "과천지식정보타운 S-3·7·8블록 신혼희망타운 행복주택 입주자격완화 예비입주자 모집",
          ATTACH_NMS_ARR:["20241004과천신혼희망타운행복예비.hwp"],
          ATTACH_EXTS_ARR:["hwp"],
          ATTACH_IDS_ARR:["20241004과천신혼희망타운행복예비.hwp"]

        },{
          "ara_nm": "경기도",
          "pan_kd_cd": "01",
          "pan_nt_st_dttm": "20240528175000",
          "ais_tp_cd_nm": "가정어린이집",
          "pan_id": "2015122300016032",
          "pan_ss": "접수마감",
          "attach_ids": "2024052857427200.hwp",
          "pan_kd_cd_nm": "일반공고",
          "tp": "SLPA",
          "attach_nms": "(240528)가정어린이집운영예정자모집공고문(과천지식S-3BL및의왕고천A-2BL).hwp",
          "pan_dt": "20240528",
          "seq_id": "2807",
          "clsg_dt": "20240614",
          "cnp_cd_list_cts": "41|",
          "pan_nm": "과천지식정보타운 S-3BL 및 의왕고천 A-2BL 가정어린이집 운영자 모집",
          ATTACH_NMS_ARR:["20241004과천신혼희망타운행복예비.hwp"],
          ATTACH_EXTS_ARR:["hwp"],
          ATTACH_IDS_ARR:["20241004과천신혼희망타운행복예비.hwp"]
        },
        {
          "ara_nm": "경기도",
          "pan_kd_cd": "01",
          "pan_nt_st_dttm": "20231201100000",
          "ais_tp_cd_nm": "가정어린이집",
          "pan_id": "2015122300015072",
          "pan_ss": "접수마감",
          "attach_ids": "2023120155336789.hwp",
          "pan_kd_cd_nm": "일반공고",
          "tp": "SLPA",
          "attach_nms": "붙임1_가정어린이집운영예정자모집공고문(과천지식S7)5차.hwp",
          "pan_dt": "20231201",
          "seq_id": "4026",
          "clsg_dt": "20231221",
          "cnp_cd_list_cts": "41|",
          "pan_nm": "과천지식정보타운S-7BL 행복주택 가정어린이집 운영자 모집(5차)",
          ATTACH_NMS_ARR:["20241004과천신혼희망타운행복예비.hwp"],
          ATTACH_EXTS_ARR:["hwp"],
          ATTACH_IDS_ARR:["20241004과천신혼희망타운행복예비.hwp"]
        },{
      "ara_nm": "경기도",
          "pan_kd_cd": "01",
          "pan_nt_st_dttm": "20231103141000",
          "ais_tp_cd_nm": "임대상가(공모ㆍ심사)",
          "pan_id": "2015122300014830",
          "pan_ss": "접수마감",
          "attach_ids": "2023103154931158.hwp",
          "pan_kd_cd_nm": "일반공고",
          "tp": "SLPA",
          "attach_nms": "과천지식정보타운S10BL(과천포레드림단지)희망상가입점자모집공고문(안)_공공지원형(1103).hwp",
          "pan_dt": "20231103",
          "seq_id": "6656",
          "clsg_dt": "20231124",
          "cnp_cd_list_cts": "41",
          "pan_nm": "과천지식정보타운 S10블록 LH 희망상가 (공공지원형) 입점자 모집공고",
          ATTACH_NMS_ARR:["20241004과천신혼희망타운행복예비.hwp"],
          ATTACH_EXTS_ARR:["hwp"],
          ATTACH_IDS_ARR:["20241004과천신혼희망타운행복예비.hwp"]
      },{
      "ara_nm": "경기도",
          "pan_kd_cd": "01",
          "pan_nt_st_dttm": "20230705160000",
          "ais_tp_cd_nm": "행복주택(신혼희망)",
          "pan_id": "2015122300014075",
          "pan_ss": "접수마감",
          "attach_ids": "2023080854060201.hwp",
          "pan_kd_cd_nm": "일반공고",
          "tp": "SLPA",
          "attach_nms": "과천지식정보타운S-8블록(행복)_입주자추가모집공고문.hwp",
          "pan_dt": "20230705",
          "seq_id": "3046",
          "clsg_dt": "20230720",
          "cnp_cd_list_cts": "41|",
          "pan_nm": "과천지식정보타운 S-8블록 신혼희망타운 행복주택 입주자 추가모집",
          ATTACH_NMS_ARR:["20241004과천신혼희망타운행복예비.hwp"],
          ATTACH_EXTS_ARR:["hwp"],
          ATTACH_IDS_ARR:["2023080854060201.hwp"]
    } ],

      SEARCH_LIST: [
        { keyword: '화성비봉', type: '영구임대', text: '화성비봉지구내 공공임대(국민, 영구) (449호) 입주자격완화 대기자 모집-영구(2-2)', area: '경기도', stat: '공고중', ext: 'pdf' },
        { keyword: '화성비봉', type: '국민임대', text: `화성비봉지구내 공공임대(국민, 영구) (449호) 입주자격완화 대기자 모집-영구(2-1)`, area: '경기도' , stat: '공고중', ext: 'pdf'},
        { type: '국민임대', text: '파주운정3 A24BL 국민임대주택 추가(예비)입주자 모집공고', area: '경기도' , stat: '공고중', ext: 'pdf'},
        { type: '행복주택(신혼희망)', text: '고양장항 A-2블록 신혼희망타운 행복주택 입주자모집 공고 ', area: '경기도' , stat: '공고중', ext: 'pdf'},
        { type: '공공임대', text: '수원역푸르지오자이 5년 공공임대주택 예비입주자 모집공고(2024.11.08)', area: '경기도' , stat: '접수중', ext: 'pdf'},
        { type: '국민임대', text: `[정정공고]남양주시 지역 국민임대주택 예비입주자 모집`, area: '경기도' , stat: '공고중', ext: 'pdf'},
      ],
      RESULT_LIST: [
        {
          title: '공급 정보',
          data_list: [
            { type: 'text_em', content: '화성비봉 A-4블록 국민임대주택' },
            { type: 'key_value', key:'공고상태', value: '공고중' },
            { type: 'key_value', key:'유형', value: '국민임대' },
            { type: 'key_value', key:'공고일', value: '2024.07.05' },
            { type: 'key_value', key:'소재지', value: '경기도 화성시 비봉면 새비봉남로 40' },
          ],
        },
        {
          title: '공급 일정',
          data_list: [
            { type: 'key_value', key:'접수기간', value: '2024.07.22 ~ 2024.07.29' },
            { type: 'key_value', key:'서류제출대상자 발표일', value: '2024.07.31' },
            { type: 'key_value', key:'서류접수기간', value: '2024.08.01 ~ 2024.08.07' },
            { type: 'key_value', key:'당첨자발표일', value: '경기도 화성시 비봉면 새비봉남로 40' },
            { type: 'key_value', key:'계약기간', value: '2024.12.04 ~ 2024.12.06' },
          ],
        },
        {
          title: '접수처 정보',
          data_list: [
            { type: 'key_value', key:'소재지', value: '경기도 성남시 분당구 성남대로54번길 3(구미동) 한국토지주택공사 경기남부지역본부' },
            { type: 'key_value', key:'전화번호', value: '1670-0003,1600-1004' },
            { type: 'key_value', key:'운영기간', value: '2024.07.22 ~ 2024.07.24' },
            { type: 'key_value', key:'당첨자발표일', value: '경기도 화성시 비봉면 새비봉남로 40' },
            { type: 'key_box', key:'안내사항',
              box: [
                { content: '(현장접수) 인터넷 신청이 어려운 65세 이상 고령자 및 장애인 등에 한하여 아래의 장소에서 청약신청을 도와드립니다.'},
                { content: '장소: LH경기남부지역본부 1층 대강당(경기도 성남시 분당구 성남대로 54번길 3, 수인분당선 오리역 1번 출구)'},
              ]
            },
          ],
        },
        {
          title: '기타 사항',
          data_list: [
            { type: 'text', content: '청약신청은 인터넷 PC(LH청약플러스 접속) 또는 인터넷 모바일(“LH 청약플러스” 앱(App) 설치)로 가능합니다.' },
            { type: 'text', content: '신청서를 잘못 작성하여 불이익을 받는 일이 발생하지 않도록 신청자께서는 모집공고문을 반드시 숙지하신 후 신청자격, 서류 등을 사전에 확인하고 신청하시기 바랍니다. ' },
            { type: 'text', content: '해당 추가모집 당첨자의 입주 예정월은 2025년 1월입니다. 이점 양지하시고 청약신청 하시기 바랍니다.' },
          ],
        },
        {
          title: '공고문',
          data_list: [
            { type: 'file', filename: '(입주자격완화)화성비봉A-4블록국민임대_입주자', ext: 'pdf'},
          ],
        },
      ],
      selectedIndex: null,
      result_view: false,
      fileExtList: [
        { name: 'file-pdf', color: '#AE0C00'},
        { name: 'file-hwp', color: '#35AEE7'},
        { name: 'file-xlsx', color: '#017338'},
      ],

      dialogFileDownload: false,
      selectedFiles:[],

    }
  },
  methods: {
    selectSearch(index){
      this.selectedIndex = index;
      this.result_view = true;
    },
    getExtName(ext){
      let extList = this.fileExtList

      for (let i = 0; i < extList.length; i++) {
        if (extList[i].name.split('-')[1] === ext) {
          return extList[i].name;
        }
      }
    },
    getExtColor(ext){
      let extList = this.fileExtList

      for (let i = 0; i < extList.length; i++) {
        if (extList[i].name.split('-')[1] === ext) {
          return extList[i].color;
        }
      }
    },

    openViewer(id, orgnm, ext){
      if (ext === 'pdf') {
        this.$emit('ChangeTabView', "/upload/eai_panfile/" + id)
      } else {
          const link = document.createElement("a");
          link.href = "/upload/eai_panfile/" + id;
          link.download = orgnm; // 파일명을 지정
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
    },
    clickFileDown(ids, nms, exts) {
      this.selectedFiles = [];
      ids.map((item,idx) => {
        let obj = {"ID": item, "NM": nms[idx], "EXT":exts[idx] };
        this.selectedFiles.push( obj );
      });

      this.dialogFileDownload = true;
    }
  },
  mounted() {
  },
  created() {
  },
  computed: {
    filteredList() {
      // 태그에 따른 필터링
      return this.SEARCH_LIST.filter(item => {
        if (this.SelectedProp === '경기도') {
          return item.area === '경기도';
        } else if (this.SelectedProp === '국민임대') {
          return item.type === '국민임대';
        } else if (this.SelectedProp === '화성비봉') {
          return item.keyword === '화성비봉';
        }
        return false;
      });
    }
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>
.active{
  background-color: color-mix(in srgb,var(--primary-color),#fff 95%);
}
</style>