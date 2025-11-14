
<template>
  <div>
    <textarea :id="id" v-model="innerValue"></textarea>
  </div>
</template>

<script>
  var ___uuid = new Date().getTime(); 

  export default {
    name: 'CompoCrossEditor',
    props: {
      id: {
        type: String,
        'default': function() {
          return 'namose-'+ (++___uuid);
        }
      },
      value : {
        type : String,
      },
      editorHeight : {
        type: String,
        default: '250px'
      },
      editorWidth : {
        type: String,
        default: '1050px'
      },
      CreateTab : {
        type: String,
        default: '0'
      }
    },
    data() {
      return {
        innerValue : this.value,
      }
    },

    watch: {
    },

    computed :{
    },

    async created() {
      
    },

    mounted() {
      this.create();
    },

    methods: {
      create() {
        let locationHref = window.location.href;
        let locationHrefSplit = locationHref.split('/');
        var baseURL = process.env.VUE_APP_ENV == 'production' ? locationHref.includes('172.30.115.22') ? (locationHrefSplit.length > 3 ? locationHrefSplit.slice(0, 3).join('/').replace('http:', 'https:') : locationHref.replace('http:', 'https:')) : process.env.VUE_APP_EDITOR_URL  : process.env.VUE_APP_EDITOR_URL
        var CE = this.CrossEditor = new NamoSE(this.id);
        var me = this;

        var params = {
          NoSpellCheck: true, /*맞춤법검사 끄기*/
          AllowContentScript: false,  /* XSS(Cross-site scripting) 취약점 관련 script 태그를 이용한 악성 script 삽입을 차단 설정 */
          AllowContentIframe: false,  /* XSS(Cross-site scripting) 취약점 관련 iframe 태그를 이용한 악성 iframe 삽입을 차단 설정 */
          AttributeBlockList : ["onclick", "onerror", "onload", "onmouseover", "onblur"],
          Width : this.editorWidth,
          Height : this.editorHeight,
          UserLang : "auto",
          IconColor : "default",
          FullScreen : false,
          ParentEditor : this.$el,
          // 에디터를 실행하기 전, 에디터의 웹 경로를 지정 해야만 필수 파일 import 및 서버 로직 처리가 가능합니다.
          // (개발/운영환경간 상이한 도메인에 대한 수정 처리가 필요한 부분)
          // EditorBaseURL: process.env.VUE_APP_EDITOR_URL+'/crosseditor/',
          EditorBaseURL: baseURL + '/crosseditor/',
          event: {
            OnInitCompleted : function(e) {
              console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> OnInitCompleted ");
              //처음 에디터 로드될때 발생되는 이벤트
              if( me.CreateTab === '0') {
                e.editorTarget.ShowTab(false);  //탭 표시 여부
              }
              me.update()
              me.initEditorCompleted();
            }
          },
          PluginModeExecutePath: process.env.VUE_APP_API_URL + '/api/editor/imageUpload.do?command=QuickUpload&type=Images',   //파일 업로드 api url
          UploadFileExecutePath: process.env.VUE_APP_API_URL + '/api/editor/imageUpload.do?command=QuickUpload&type=Images',   //파일 업로드 api url
          UploadEtcFileExecutePath: process.env.VUE_APP_API_URL + '/api/editor/imageUpload.do?command=QuickUpload&type=Images',  //파일 업로드 api url
          ImageSrcBase64:true,
          UserToolbar:true,    //툴바 커스텀 여부
          CreateToolbar:"iconmenu|spacebar|"
            +"fontname|fontsize|lineheight|spacebar|"
            +"word_style|word_color|"
            + (this.editorWidth < 550 ? "enter|" : "spacebar|")
            +"image|tableinsert|spacebar|"
            +"word_justify|word_indentset|spacebar|"
            +"paste|pastetext", //툴바 커스텀 목록
          Menu:false,     //메뉴 사용여부
          NewToolbar:true,  //신규버전 툴바 아이콘 사용여부
          ResizeBar:false,  //높이조절 사용여부
          Skin: "blue",     //툴바 스킨 (newtoolbar에서는 적용안됨)
          ThemeBgColor: "#FFFFFF", //툴바 배경색상(newtoolbar에서 적용)
          ThemeBorderColor: "#CCCCCC",  //툴바 외곽선(newtoolbar에서 적용)
          ThemeButtonHoverColor: "#CCCCCC",  //툴바 오버레이시 배경색상(newtoolbar에서 적용)
          ThemeButtonSelectColor: "#B6B6B6", //선택된 툴바 배경색상(newtoolbar에서 적용)
          ThemeButtonSelectIconColor: "#666666", //선택된 툴바 색상(newtoolbar에서 적용)
          ThemeButtonSize: "25", //툴바 크기 (25~40)
          ThemeIconColor: "#666666",  //툴바 색상
          ThemeOutlineColor: "#CCCCCC",  //에디터의 바깥 외곽선 색상
          CreateTab: this.CreateTab, //에디터 하단 편집/HTML/미리보기 탭 표시여부
          AutoInstall:false,    //에디터 플러그인 설치 표시여부
          DefaultFont:"맑은 고딕", //에디터 기본 폰트
          DefaultFontSize: "12pt",   //에디터 기본 폰트사이즈
          LineHeight:"130%"    //에디터 기본 줄간격
        };
        CE.params = params;
        CE.EditorStart();
  
      },
      //다른탭(메뉴) 이동 후 다시 현재 탭 이동 시 에디터 사라짐 현상 발생, 에디터를 새로 생성하여 출력시킴.
      reCreate() {
        this.CrossEditor.destroyEditor();
        this.$el.innerHTML = "";
        this.create();
      },
      update(val) {
        val = val || this.innerValue;
        this.CrossEditor.SetBodyValue(val);
      },
      getValue() {
        return this.CrossEditor.GetBodyValue();
      },
      getTextValue(){
        return this.CrossEditor.GetTextValue();
      },
      setValue: function(e) {
          return this.CrossEditor.SetBodyValue(e);
      },
      initEditorCompleted() {
        try{ this.$emit('initEditorCompleted'); } catch(e) {}
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>