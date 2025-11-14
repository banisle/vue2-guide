<template>
  <div style="display: contents;">
    <div class="pl-card pl-scroll-body" style="height: calc(100vh - 120px);">
      <!-- 전세임대 임대료 계산기 -->
      <div>
        <!-- title -->
        <div class="pl-grid-top">
          <div class="pl-grid-top-left ">
            <strong class="pl-bullet-txt is-blue">전세임대 임대료 계산기</strong>
          </div>
          <div class="pl-grid-top-utils">
            <em class="is-txt-error">*총 금액으로 입력</em>
          </div>
        </div>
        <!-- table -->
        <table class="pl-tbl-detail is-mt-s">
          <colgroup>
            <col width="20%" />
            <col width="20%" />
            <col width="20%" />

            <col width="13%" />
            <col width="13%" />
            <col width="14%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" class="py-1">전세임대유형 선택</th>
              <th scope="col" class="py-1">우대금리 선택</th>
              <th scope="col" class="py-1">최종자격</th>
              <th scope="col" class="py-1">지원지역 선택</th>
              <th scope="col" class="py-1">총 전세금 입력</th>
              <th scope="col" class="py-1">월세 주택의 경우<br>월세 입력</th>
            </tr>
          </thead>
          <tbody class="pl-tbl-outline border-blue">
            <tr>
              <td>
                <v-select
                  class="pl-form is-auto"
                  :items="RENT_SEL_LIST"
                  placeholder="선택"
                  v-model="RENT_SEL"
                ></v-select>
              </td>
              <td>
                <v-select
                  class="pl-form is-auto"
                  :items="RENT_RATE_LIST"
                  placeholder="선택"
                  v-model="RENT_RATE"
                ></v-select>
              </td>
              <td class="is-ellips">
                <span class="pl-value-txt">
                  <v-tooltip content-class="pl-tooltip " bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">{{ RENT_SEL_LABEL }}{{ RENT_RATE_LABEL }}</span>
                    </template>
                    <span>{{ RENT_SEL_LABEL }}{{ RENT_RATE_LABEL }}</span>
                  </v-tooltip>

                </span>
              </td>
              <td>
                <v-select
                  class="pl-form is-auto"
                  :items="mixin_common_code_get(common_code, 'RENT_LOC')"
                  placeholder="선택"
                  v-model="RENT_LOC"
                ></v-select>
              </td>
              <td>
                <v-text-field
                  class="pl-form is-auto is-txt-blue text-end "
                  prefix="₩"
                  placeholder="-"
                  v-model="DEPOSIT"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                />
              </td>
              <td>
                <v-text-field
                  class="pl-form is-auto is-txt-blue text-end"
                  prefix="₩"
                  placeholder="-"
                  v-model="RENT"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                />
              </td>
            </tr>
          </tbody>

        </table>
        <!-- table -->
        <table class="pl-tbl-detail is-mt-s">
          <colgroup>
            <col width="20%" />
            <col width="20%" />
            <col width="20%" />

            <col width="13%" />
            <col width="13%" />
            <col width="14%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" class="py-1">공사지원금</th>
              <th scope="col" class="py-1">입주자 기본 부담금</th>
              <th scope="col" class="py-1">입주자 추가 부담금</th>
              <th scope="col" class="py-1">월 임대료</th>
              <th scope="col" class="py-1">월세 추가부담금<br>(월세 주택의 경우)</th>
              <th scope="col" class="py-1">입주자 추가 부담금</th>
            </tr>
          </thead>
          <tbody >
            <tr>
              <td class="pl-tbl-outline border-red no-right">
                <v-text-field
                  class="pl-form is-auto is-txt-red text-end is-trans"
                  readonly
                  prefix="₩"
                  v-model="TI"
                />
              </td>
              <td class="pl-tbl-outline border-red no-right no-left">
                <v-text-field
                  class="pl-form is-auto is-txt-red text-end is-trans"
                  readonly
                  prefix="₩"
                  v-model="BASE_COST"
                />
              </td>
              <td class="pl-tbl-outline border-red no-right no-left">
                <v-text-field
                  class="pl-form is-auto is-txt-red text-end is-trans"
                  readonly
                  prefix="₩"
                  placeholder="-"
                  v-model="ADD_COST"
                />
              </td>
              <td class="pl-tbl-outline border-red no-right no-left">
                <v-text-field
                  class="pl-form is-auto is-txt-red text-end is-trans"
                  readonly
                  prefix="₩"
                  v-model="MO_DEPOSIT"
                />
              </td>
              <td class="pl-tbl-outline border-green no-right">
                <v-text-field
                  class="pl-form is-auto is-txt-green text-end is-trans"
                  readonly
                  prefix="₩"
                  placeholder="-"
                  v-model="ADD_RENT"
                />
              </td>
              <td class="pl-tbl-outline border-green no-left">
                <v-text-field
                  class="pl-form is-auto is-txt-green text-end is-trans"
                  readonly
                  prefix="₩"
                  value="-"
                  v-model="ADD_COST"
                />
              </td>
            </tr>
          </tbody>

        </table>

        <div class="is-mt-s">
          <span class="pl-label is-md">[전세임대 임대료 계산기 사용방법]</span>
          <ul class="is-mt-s">
            <li>
              ① 계산기 순서대로 파란 선 안에 "전세임대 유형 - 우대금리 - 지원지역 - 총전세금 - 월세" 를 입력합니다. <span class="is-txt-blue">(금액은 총 금액으로 입력)</span>
            </li>
            <li>
              ② 우대금리는 우대금리가 없다면 "해당 없음" 으로 선택합니다.
            </li>
            <li>
              ③ 공사지원금 등 월 임대료가 계산되어 확인됩니다. <span class="is-txt-blue">(추가부담금과 월세가 있는 경우 "합계액" 주의 필요)</span><br>
              <strong class="pl-4 is-txt-error">※ 계산결과는 참고사항으로만 활용해 주시기 바랍니다.</strong>
            </li>
          </ul>
        </div>
      </div>

      <!-- 기존보증금ㆍ월차임 대비 변경할 보증금ㆍ월차임 입력시 증액율 계산기 -->
      <div class="is-mt-m">
        <!-- title -->
        <div class="pl-grid-top">
          <div class="pl-grid-top-left ">
            <strong class="pl-bullet-txt is-blue">기존보증금ㆍ월차임 대비 변경할 보증금ㆍ월차임 입력시 증액율 계산기</strong>
          </div>
          <div class="pl-grid-top-utils">
            <em class="is-txt-error">*총 금액으로 입력</em>
          </div>
        </div>
        <!-- table -->
        <table class="pl-tbl-detail is-mt-s">
          <colgroup>
            <col width="25%" span="4" />
          </colgroup>
          <tbody class="pl-tbl-outline blue">
            <tr>
              <th scope="row" class="text-center"><strong>기존 보증금 입력</strong></th>
              <td class="pl-tbl-outline border-blue no-bottom">
                <v-text-field
                  class="pl-form is-auto is-txt-blue text-end"
                  prefix="₩"
                  placeholder="-"
                  v-model="BF_DEPOSIT"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                />
              </td>
              <th scope="row" class="text-center"><strong>변경 할 보증금 입력</strong></th>
              <td class="pl-tbl-outline border-blue no-bottom">
                <v-text-field
                  class="pl-form is-auto is-txt-blue text-end"
                  prefix="₩"
                  placeholder="-"
                  v-model="AF_DEPOSIT"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                />
              </td>
            </tr>
            <tr>
              <th scope="row" class="text-center"><strong>기존 월차임(월세) 입력</strong></th>
              <td class="pl-tbl-outline border-blue no-top">
                <v-text-field
                  class="pl-form is-auto is-txt-blue text-end"
                  prefix="₩"
                  placeholder="-"
                  v-model="BF_RENT"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                />
              </td>
              <th scope="row" class="text-center"><strong>변경 할 임차임(월세) 입력</strong></th>
              <td class="pl-tbl-outline border-blue no-top no-bottom">
                <v-text-field
                  class="pl-form is-auto is-txt-blue text-end"
                  prefix="₩"
                  placeholder="-"
                  v-model="AF_RENT"
                  oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                />
              </td>
            </tr>
            <tr>
              <td colspan="3" class="text-center is-bg-th py-4"> ※ 기존보증금ㆍ월차임(월세) 입력 대비 변경할 보증금ㆍ월차임(월세) 입력시 증액율(%)</td>
              <td class="text-center pl-tbl-outline border-red">
                <strong class="is-txt-error" style="font-size: 20px;">
                  {{ isNaN(INC_RATE) ? '' : INC_RATE }}%
                </strong>
              </td>
            </tr>
          </tbody>

        </table>
        <div class="is-mt-s">
          <span class="pl-label is-md"> [기존보증금&bull;월차임 대비 변경할 보증금&bull;월차임 입력시 증액율 계산기 사용방법]</span>
          <ul class="is-mt-s">
            <li>
              ① 기존 보증금 및 기존 월차임(월세)를 입력합니다. <span class="is-txt-blue">(금액은 총 금액으로 입력)</span>
            </li>
            <li>
              ② 변경 할 보증금 및 변경할 월차임(월세)를 입력합니다.
            </li>
            <li>
              ③ 기존금액 대비 변경 시 증액율이 확인됩니다. 단, 계산기 사용에 주의하실 점이 있습니다. <br>
              <div class="pl-4">
                <strong class="is-txt-error">현재 보증금을 월차임(월세)로 계산하는 방식은 "주택임대차보호법" 에 표기되어 있으며 현재 5.50% 가 적용됩니다.</strong><br>
                <span>(월차임 전환 시 산정율 2% + 한국은행 기준금리 3.50% (23.01.13 기준))</span><br>
                <span class="is-txt-blue">그러나 월차임(월세)를 보증금으로 전환하는 방식은 법령에 표기 되어있지 않아, 렌트홈 홈페이지 계산기를 토대로 5.50%를 적용하여
                  증액율 %를 계산하도록 했습니다.<br> 만약, 월차임(월세)을 보증금으로 전환하는 방식을 다르게 적용한다면 증액율이 달라질 수 있으므로</span><br>
                <strong class="is-txt-error">계산결과는 참고사항으로만 활용하여 주시기 바랍니다.</strong>
                <span class="is-txt-blue">(렌트홈 계산기를 사용하는 경우에도 참고사항으로만 활용)</span>
              </div>

            </li>
          </ul>
        </div>
      </div>

      <!-- 주거지원 시급가구 걔산기 -->
      <div class="is-mt-m">
        <div class="d-flex">
          <div class="is-col-fix" style="width: calc(100% - 200px);">
            <!-- title -->
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <strong class="pl-bullet-txt is-blue">주거지원 시급가구 계산기</strong>
              </div>
              <div class="pl-grid-top-utils">
                <em class="is-txt-error">* 가구 총 소득의 30% 금액  ≦  환산된 월세(임차료) </em>
              </div>
            </div>
            <!-- table -->
            <table class="pl-tbl-detail is-mt-s">
              <colgroup>
                <col width="25%" span="4" />
              </colgroup>
              <thead >
                <tr>
                  <th scope="col" colspan="2" class="text-center"><strong>전세임대유형 선택</strong></th>
                  <th colspan="2"> </th>
                </tr>
                <tr>
                  <th scope="col" colspan="2" class="text-center"><strong>소득</strong><br><span class="font-weight-thin">(가구의 총 소득 입력)</span></th>
                  <th scope="col" class="py-1 text-center"><strong>보증금</strong><br><span class="font-weight-thin">(임대차계약서의 보증금 입력)</span></th>
                  <th scope="col" class="py-1 text-center"><strong>임차료 (월세)</strong><br><span class="font-weight-thin">(임대차계약서의 월세 입력)</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="2">
                    <v-text-field
                      class="pl-form is-auto text-end"
                      prefix="₩"
                      placeholder="-"
                      v-model="HS_INCOME"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                    />
                  </td>
                  <td>
                    <v-text-field
                      class="pl-form is-auto text-end"
                      prefix="₩"
                      placeholder="-"
                      v-model="HS_DEPOSIT"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                    />
                  </td>
                  <td>
                    <v-text-field
                      class="pl-form is-auto text-end"
                      prefix="₩"
                      placeholder="-"
                      v-model="HS_RENT"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row" class="is-bg-light pl-tbl-outline border-red no-right">
                    <strong>소득 30%</strong>
                  </th>
                  <td class="pl-tbl-outline border-red no-left">
                    <v-text-field
                      class="pl-form is-auto is-txt-error text-end"
                      prefix="₩"
                      placeholder="-"
                      v-model="INCOME_30"
                      readonly
                    />
                  </td>
                  <th scope="row" class="is-bg-light pl-tbl-outline border-blue no-right">
                    <strong>환산된 임차료 (월세)</strong>
                  </th>
                  <td class="pl-tbl-outline border-blue no-left">
                    <v-text-field
                      class="pl-form is-auto is-txt-blue text-end"
                      prefix="₩"
                      placeholder="-"
                      v-model="HS_CONVERT_RENT"
                      readonly
                    />
                  </td>
                </tr>
              </tbody>

            </table>
            <div class="is-mt-s">
              <span class="pl-label is-md">[주거지원 시급가구 계산기 사용법]</span>
              <ul class="is-mt-s">
                <li>
                  ① 가구의 총 소득을 입력합니다 → 하단 소득 30%가 자동 계산되어 확인됩니다.
                </li>
                <li>
                  ② 가구의 임대차계약서의 총 보증금을 입력합니다.
                </li>
                <li>③ 가구의 임대차계약서의 임차료(월세) 를 입력합니다 → 환산된 임차료(월세) 가 확인됩니다.</li>
                <li>
                  ④ 최종 신청가능 여부가 확인됩니다.
                  <div class="pl-4">
                    단,신청가능 여부 판단은 신청자가 알려준 소득ㆍ보증금ㆍ월세를 바탕으로 계산한 내용이므로,  변동이 있을 수 있으니 참고만 해주시라  안내해주시고 정확한 내용은 청약 신청하여 결과를 확인해 보셔야함을 안내해 주시기 바랍니다.
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="ml-4 d-flex flex-column flex-grow-1">
            <div class="py-2 is-bg-darkred text-center is-txt-white font-weight-bold" style="font-size: 18px;">신청 가능여부</div>
            <div class="py-2 text-center font-weight-bold is-border-all" style="font-size: 18px;">{{ POSSIBLE }}</div>
          </div>
        </div>
      </div>

      <!-- 기존주택 전세임대 배점표 5번 소득대비 임차료 비율 계산기 -->
      <div class="is-mt-m">
        <div class="d-flex">
          <div class="is-col-fix" style="width: calc(100% - 200px);">
            <!-- title -->
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <strong class="pl-bullet-txt is-blue">기존주택 전세임대 배점표 5번 소득대비 임차료 비율 계산기</strong>
              </div>
              <div class="pl-grid-top-utils" style="width: 40%;">
                <div class="flex-grow-1" style="display: grid; gap: 0px 32px; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr);" >
                  <em class="d-flex is-txt-error">가. 80% 이상 <span class="ml-auto">-5점</span></em>
                  <em class="d-flex is-txt-error">다. 50% 이상 65% 미만 <span class="ml-auto">- 3점</span></em>
                  <em class="d-flex is-txt-error">나. 65% 이상 80% 미만 <span class="ml-auto">- 4점</span></em>
                  <em class="d-flex is-txt-error">라. 30% 이상 50% 미만 <span class="ml-auto">- 2점</span></em>
                </div>
              </div>
            </div>
            <!-- table -->
            <table class="pl-tbl-detail is-mt-s">
              <colgroup>
                <col width="25%" span="4" />
              </colgroup>
              <thead >
                <tr>
                  <th scope="col" colspan="2" class="text-center"><strong>소득대비 임차료 비율</strong></th>
                  <th colspan="2"> </th>
                </tr>
                <tr>
                  <th scope="col" colspan="2" class="text-center"><strong>소득</strong><br><span class="font-weight-thin">(가구의 총 소득 입력)</span></th>
                  <th scope="col" class="py-1 text-center"><strong>보증금</strong><br><span class="font-weight-thin">(임대차계약서의 보증금 입력)</span></th>
                  <th scope="col" class="py-1 text-center"><strong>임차료 (월세)</strong><br><span class="font-weight-thin">(임대차계약서의 월세 입력)</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="2">
                    <v-text-field
                      class="pl-form is-auto text-end"
                      prefix="₩"
                      placeholder="-"
                      v-model="RR_INCOME"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                    />
                  </td>
                  <td>
                    <v-text-field
                      class="pl-form is-auto text-end"
                      prefix="₩"
                      placeholder="-"
                      v-model="RR_DEPOSIT"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                    />
                  </td>
                  <td>
                    <v-text-field
                      class="pl-form is-auto text-end"
                      prefix="₩"
                      placeholder="-"
                      v-model="RR_RENT"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row" class="is-bg-light pl-tbl-outline border-red no-right">
                    <strong>주거급여 수급비</strong>
                  </th>
                  <td class="pl-tbl-outline border-red no-left">
                    <v-text-field
                      class="pl-form is-auto is-txt-error text-end"
                      prefix="₩"
                      placeholder="-"
                      v-model="HOUSE_COST"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                    />
                  </td>
                  <th scope="row" class="is-bg-light pl-tbl-outline border-blue no-right">
                    <strong>환산된 임차료 (월세)</strong>
                  </th>
                  <td class="pl-tbl-outline border-blue no-left">
                    <v-text-field
                      class="pl-form is-auto is-txt-blue text-end"
                      prefix="₩"
                      placeholder="-"
                      v-model="RR_CONVERT_RENT"
                      readonly
                    />
                  </td>
                </tr>
              </tbody>

            </table>
            <div class="is-mt-s">
              <span class="pl-label is-md">[기존주택 전세임대 배점표 6번 계산기 사용법]</span>
              <ul class="is-mt-s">
                <li>
                  ① 가구의 총 소득을 입력합니다
                </li>
                <li>
                  ② 가구의 임대차계약서의 총 보증금을 입력합니다.
                </li>
                <li>
                  ③ 가구의 임대차계약서의 임차료(월세) 를 입력합니다
                </li>
                <li>
                  ④ 주거급여 수급가구는 주거급여액을 입력 합니다.
                </li>
                <li>
                  ⑤ 임차료 비율이 확인 됩니다.
                  <div class="pl-4">
                    단,신청가능 여부 판단은 신청자가 알려준 소득ㆍ보증금ㆍ월세를 바탕으로 계산한 내용이므로,<br>변동이 있을 수 있으니 참고만 해주시라 안내해 주시기 바랍니다.
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="ml-4 d-flex flex-column flex-grow-1">
            <div class="py-2 is-bg-darkred text-center is-txt-white font-weight-bold" style="font-size: 18px;">소득대비 임차료 비율</div>
            <div class="py-2 text-center font-weight-bold is-border-all" style="font-size: 18px;">{{ isNaN(EARN_RENT_RATE) ? '' : EARN_RENT_RATE }}%</div>
          </div>
        </div>
      </div>

      <!-- 전세임대 임대료 할증 계산기 -->
      <div class="is-mt-m">
        <div class="d-flex">
          <div class="is-col-fix" style="width: calc(100% - 500px);">
            <!-- title -->
            <div class="pl-grid-top">
              <div class="pl-grid-top-left">
                <strong class="pl-bullet-txt is-blue">전세임대 임대료 할증 계산기</strong>
              </div>
            </div>
            <!-- table -->
            <table class="pl-tbl-detail is-mt-s">
              <colgroup>
                <col width="30%" span="2" />
                <col width="" />
              </colgroup>
              <thead >
                <tr>
                  <th scope="col" colspan="2" class="text-center"><strong>재계약 할증 금액 계산기</strong></th>
                  <th> </th>
                </tr>
                <tr>
                  <th scope="col" class="text-center"><strong>우대금리 포함 임대료 입력</strong></th>
                  <th scope="col" class="text-center"><strong>할증 % 입력</strong></th>
                  <th scope="col" class="text-center"><strong>할증된 월 임대료</strong></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td >
                    <v-text-field
                      class="pl-form is-auto text-end is-txt-org"
                      prefix="₩"
                      v-model="INTEREST_DEPOSIT"
                      oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z]/g, '' );"
                    />
                  </td>
                  <td>
                    <v-select
                      :items="mixin_common_code_get(common_code, 'RENT_CUT')"
                      class="pl-form is-auto"
                      v-model="SURCHARGE"
                    ></v-select>
                  </td>
                  <td rowspan="2" class="pl-tbl-outline border-red">
                    <v-text-field
                      class="pl-form is-auto is-txt-red text-end is-trans"
                      readonly
                      prefix="₩"
                      placeholder="-"
                      v-model="SURCHARGE_DEPOSIT"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="text-center pl-tbl-outline border-blue no-right">
                    할증 가산될 금액
                  </td>
                  <td class="pl-tbl-outline border-blue no-left">
                    <v-text-field
                      class="pl-form is-auto is-txt-blue text-end"
                      prefix="₩"
                      placeholder="-"
                      v-model="SURCHARGE_COST"
                      readonly
                    />
                  </td>
                </tr>
              </tbody>

            </table>
            <div class="is-mt-s">
              <span class="pl-label is-md">[재계약 할증 금액 계산기 사용방법]</span>
              <ul class="is-mt-s">
                <li>
                  ① <strong class="is-txt-blue">현재 납부하고 있는 우대금리를 포함한 임대료를 입력합니다. </strong>
                </li>
                <li>
                  ② 할증 %를 선택합니다.
                </li>
                <li>
                  ③ 할증된 월 임대료가 확인됩니다.
                  <div class="pl-4">
                    <strong class="is-txt-error">※ 계산결과는 참고사항으로만 활용해 주시기 바랍니다.</strong>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>


    </div>

    <!-- footer -->
     <div class="pl-quick-layer-footer pl-btn-wrap" >
       <v-btn class="pl-btn is-trans ml-auto" @click="close">닫기</v-btn>
     </div>

  </div>
</template>

<script>
export default {
  name: 'RightRentCalc', //임대료 계산기
  components: {
  },
  data() {
    return {
      //공통코드드
      common_code_list: [],
      common_code : [],
      RENT_SEL_LIST:[],
      RENT_RATE_LIST:[],

      //전세임대 임대료 계산기
      RENT_SEL:'',    //전세임대유형
      RENT_SEL_LABEL:'',  //전세임대유형 라벨
      RENT_RATE:'',   //우대금리
      RENT_RATE_LABEL:'',   //우대금리 라벨
      RENT_LOC:'',    //지원지역역
      DEDUCTIBLE:'',    //자기부담금
      DEPOSIT:'',   //전세금
      RENT:'',    //월세
      TI:'',    //공사지원금(Tenant Improvenment)
      BASE_COST:'',   //입주자 기본 부담금
      ADD_COST:'',    //입주자 추가 부담금
      MO_DEPOSIT:'',    //월 임대료
      ADD_RENT:'',    //월세 추가 부담금


      //증액율 계산기
      BF_DEPOSIT:"", //기존 보증금
      AF_DEPOSIT:"", //변경 보증금
      BF_RENT: "",   //기존 월세
      AF_RENT: "",   //변경 월세
      INC_RATE: "",  //증액율

      //주거지원HS(House Support) 시급가구
      HS_INCOME: "",    //소득
      HS_DEPOSIT: "",   //보증금
      HS_RENT: "",       //월세
      INCOME_30: "",   //소득 30%
      HS_CONVERT_RENT: "",  //환산된 임차료
      POSSIBLE: "-",   //가능여부

      //소득대비 임차료비율RR(Rent Rate)
      RR_INCOME:"",     //소득
      RR_DEPOSIT: "",   //보증금
      RR_RENT: "",       //월세
      HOUSE_COST: "",     //주거급여 수급비
      RR_CONVERT_RENT: "",  //환산된 임차료
      EARN_RENT_RATE: "",      //소득대비 임차료 비율율

      //임대료 할증
      INTEREST_DEPOSIT: "", //우대금리 포함 임대료
      SURCHARGE: "",  //할증
      SURCHARGE_COST: "", //할증가산될 금액
      SURCHARGE_DEPOSIT: "",  //할증된 월 임대료
    }
  },
  methods: {
    // 닫기
    close(){
      this.$emit("Close");
    },

    //본인부담금 계산
    deductible_cal(){
      switch(this.RENT_SEL){
        case '01'://기존주택 5%
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '02'://기존주택 2%
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '03'://신혼부부1
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.05 : 145000000*0.05
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 110000000 ? this.DEPOSIT*0.05 : 110000000*0.05
                this.ADD_COST = this.DEPOSIT > 110000000 ? parseInt(this.DEPOSIT)-110000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 95000000 ? this.DEPOSIT*0.05 : 95000000*0.05
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.05 : 145000000*0.05
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 110000000 ? this.DEPOSIT*0.05 : 110000000*0.05
                this.ADD_COST = this.DEPOSIT > 110000000 ? parseInt(this.DEPOSIT)-110000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 95000000 ? this.DEPOSIT*0.05 : 95000000*0.05
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.05 : 145000000*0.05
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 110000000 ? this.DEPOSIT*0.05 : 110000000*0.05
                this.ADD_COST = this.DEPOSIT > 110000000 ? parseInt(this.DEPOSIT)-110000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 95000000 ? this.DEPOSIT*0.05 : 95000000*0.05
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.05 : 145000000*0.05
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 110000000 ? this.DEPOSIT*0.05 : 110000000*0.05
                this.ADD_COST = this.DEPOSIT > 110000000 ? parseInt(this.DEPOSIT)-110000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 95000000 ? this.DEPOSIT*0.05 : 95000000*0.05
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.05 : 145000000*0.05
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 110000000 ? this.DEPOSIT*0.05 : 110000000*0.05
                this.ADD_COST = this.DEPOSIT > 110000000 ? parseInt(this.DEPOSIT)-110000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 95000000 ? this.DEPOSIT*0.05 : 95000000*0.05
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.05 : 145000000*0.05
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 110000000 ? this.DEPOSIT*0.05 : 110000000*0.05
                this.ADD_COST = this.DEPOSIT > 110000000 ? parseInt(this.DEPOSIT)-110000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 95000000 ? this.DEPOSIT*0.05 : 95000000*0.05
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.05 : 145000000*0.05
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 110000000 ? this.DEPOSIT*0.05 : 110000000*0.05
                this.ADD_COST = this.DEPOSIT > 110000000 ? parseInt(this.DEPOSIT)-110000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 95000000 ? this.DEPOSIT*0.05 : 95000000*0.05
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.05 : 145000000*0.05
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 110000000 ? this.DEPOSIT*0.05 : 110000000*0.05
                this.ADD_COST = this.DEPOSIT > 110000000 ? parseInt(this.DEPOSIT)-110000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 95000000 ? this.DEPOSIT*0.05 : 95000000*0.05
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '04'://신혼부부2
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.2 : 240000000*0.2
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.2 : 110000000*0.2
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.2 : 130000000*0.2
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.2 : 240000000*0.2
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.2 : 110000000*0.2
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.2 : 130000000*0.2
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.2 : 240000000*0.2
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.2 : 110000000*0.2
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.2 : 130000000*0.2
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.2 : 240000000*0.2
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.2 : 110000000*0.2
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.2 : 130000000*0.2
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.2 : 240000000*0.2
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.2 : 110000000*0.2
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.2 : 130000000*0.2
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.2 : 240000000*0.2
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.2 : 110000000*0.2
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.2 : 130000000*0.2
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.2 : 240000000*0.2
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.2 : 110000000*0.2
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.2 : 130000000*0.2
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.2 : 240000000*0.2
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.2 : 110000000*0.2
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.2 : 130000000*0.2
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '05'://주거취약 5%
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '06'://주거취약 50
          switch(this.RENT_RATE){
            case '01':
              this.BASE_COST = '500000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              this.BASE_COST = '500000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              this.BASE_COST = '500000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              this.BASE_COST = '500000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              this.BASE_COST = '500000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              this.BASE_COST = '500000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              this.BASE_COST = '500000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              this.BASE_COST = '500000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '07'://긴급주거 5%
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.05 : 130000000*0.05
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.05 : 90000000*0.05
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.05 : 70000000*0.05
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '08'://긴급주거 2%
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 130000000 ? this.DEPOSIT*0.02 : 130000000*0.02
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 90000000 ? this.DEPOSIT*0.02 : 90000000*0.02
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 70000000 ? this.DEPOSIT*0.02 : 70000000*0.02
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '09'://청년 100
          switch(this.RENT_RATE){
            case '01':
              this.BASE_COST = '1000000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 85000000 ? parseInt(this.DEPOSIT)-85000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.005/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            // case '02':
            //   this.BASE_COST = '1000000'
            //   break;
            // case '03':
            //   this.BASE_COST = '1000000'
            //   break;
            // case '04':
            //   this.BASE_COST = '1000000'
            //   break;
            // case '05':
            //   this.BASE_COST = '1000000'
            //   break;
            // case '06':
            //   this.BASE_COST = '1000000'
            //   break;
            // case '07':
            //   this.BASE_COST = '1000000'
            //   break;
            // case '08':
            //   this.BASE_COST = '1000000'
            //   break;
            case '09':
              this.BASE_COST = '1000000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 85000000 ? parseInt(this.DEPOSIT)-85000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '10':
              this.BASE_COST = '1000000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 85000000 ? parseInt(this.DEPOSIT)-85000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.005/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.0075/12) : Math.floor(this.TI*0.01/12))
              break;
          }
          break;
        case '10'://청년 200
          switch(this.RENT_RATE){
            case '01':
              this.BASE_COST = '2000000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 85000000 ? parseInt(this.DEPOSIT)-85000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            // case '02':
            //   this.BASE_COST = '2000000'
            //   break;
            case '03':
              this.BASE_COST = '2000000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 85000000 ? parseInt(this.DEPOSIT)-85000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              this.BASE_COST = '2000000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 85000000 ? parseInt(this.DEPOSIT)-85000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              this.BASE_COST = '2000000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 85000000 ? parseInt(this.DEPOSIT)-85000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            // case '06':
            //   this.BASE_COST = '2000000'
            //   break;
            // case '07':
            //   this.BASE_COST = '2000000'
            //   break;
            // case '08':
            //   this.BASE_COST = '2000000'
            //   break;
            case '09':
              this.BASE_COST = '2000000'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 95000000 ? parseInt(this.DEPOSIT)-95000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 85000000 ? parseInt(this.DEPOSIT)-85000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.005/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            // case '10':
            //   this.BASE_COST = '2000000'
            //   break;
          }
          break;
        case '11'://다자녀 2인
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 155000000 ? this.DEPOSIT*0.02 : 155000000*0.02
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 120000000 ? this.DEPOSIT*0.02 : 120000000*0.02
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 105000000 ? this.DEPOSIT*0.02 : 105000000*0.02
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 155000000 ? this.DEPOSIT*0.02 : 155000000*0.02
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 120000000 ? this.DEPOSIT*0.02 : 120000000*0.02
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 105000000 ? this.DEPOSIT*0.02 : 105000000*0.02
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 155000000 ? this.DEPOSIT*0.02 : 155000000*0.02
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 120000000 ? this.DEPOSIT*0.02 : 120000000*0.02
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 105000000 ? this.DEPOSIT*0.02 : 105000000*0.02
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 155000000 ? this.DEPOSIT*0.02 : 155000000*0.02
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 120000000 ? this.DEPOSIT*0.02 : 120000000*0.02
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 105000000 ? this.DEPOSIT*0.02 : 105000000*0.02
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 155000000 ? this.DEPOSIT*0.02 : 155000000*0.02
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 120000000 ? this.DEPOSIT*0.02 : 120000000*0.02
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 105000000 ? this.DEPOSIT*0.02 : 105000000*0.02
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 155000000 ? this.DEPOSIT*0.02 : 155000000*0.02
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 120000000 ? this.DEPOSIT*0.02 : 120000000*0.02
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 105000000 ? this.DEPOSIT*0.02 : 105000000*0.02
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 155000000 ? this.DEPOSIT*0.02 : 155000000*0.02
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 120000000 ? this.DEPOSIT*0.02 : 120000000*0.02
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 105000000 ? this.DEPOSIT*0.02 : 105000000*0.02
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 155000000 ? this.DEPOSIT*0.02 : 155000000*0.02
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 120000000 ? this.DEPOSIT*0.02 : 120000000*0.02
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 105000000 ? this.DEPOSIT*0.02 : 105000000*0.02
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '12'://다자녀3인
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 175000000 ? this.DEPOSIT*0.02 : 175000000*0.02
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 140000000 ? this.DEPOSIT*0.02 : 140000000*0.02
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 125000000 ? this.DEPOSIT*0.02 : 125000000*0.02
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 175000000 ? this.DEPOSIT*0.02 : 175000000*0.02
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 140000000 ? this.DEPOSIT*0.02 : 140000000*0.02
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 125000000 ? this.DEPOSIT*0.02 : 125000000*0.02
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 175000000 ? this.DEPOSIT*0.02 : 175000000*0.02
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 140000000 ? this.DEPOSIT*0.02 : 140000000*0.02
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 125000000 ? this.DEPOSIT*0.02 : 125000000*0.02
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 175000000 ? this.DEPOSIT*0.02 : 175000000*0.02
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 140000000 ? this.DEPOSIT*0.02 : 140000000*0.02
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 125000000 ? this.DEPOSIT*0.02 : 125000000*0.02
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 175000000 ? this.DEPOSIT*0.02 : 175000000*0.02
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 140000000 ? this.DEPOSIT*0.02 : 140000000*0.02
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 125000000 ? this.DEPOSIT*0.02 : 125000000*0.02
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 175000000 ? this.DEPOSIT*0.02 : 175000000*0.02
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 140000000 ? this.DEPOSIT*0.02 : 140000000*0.02
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 125000000 ? this.DEPOSIT*0.02 : 125000000*0.02
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 175000000 ? this.DEPOSIT*0.02 : 175000000*0.02
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 140000000 ? this.DEPOSIT*0.02 : 140000000*0.02
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 125000000 ? this.DEPOSIT*0.02 : 125000000*0.02
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 175000000 ? this.DEPOSIT*0.02 : 175000000*0.02
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 140000000 ? this.DEPOSIT*0.02 : 140000000*0.02
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 125000000 ? this.DEPOSIT*0.02 : 125000000*0.02
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '13'://다자녀 4인
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 195000000 ? this.DEPOSIT*0.02 : 195000000*0.02
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.02 : 160000000*0.02
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.02 : 145000000*0.02
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 195000000 ? this.DEPOSIT*0.02 : 195000000*0.02
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.02 : 160000000*0.02
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.02 : 145000000*0.02
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 195000000 ? this.DEPOSIT*0.02 : 195000000*0.02
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.02 : 160000000*0.02
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.02 : 145000000*0.02
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 195000000 ? this.DEPOSIT*0.02 : 195000000*0.02
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.02 : 160000000*0.02
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.02 : 145000000*0.02
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 195000000 ? this.DEPOSIT*0.02 : 195000000*0.02
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.02 : 160000000*0.02
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.02 : 145000000*0.02
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 195000000 ? this.DEPOSIT*0.02 : 195000000*0.02
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.02 : 160000000*0.02
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.02 : 145000000*0.02
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 195000000 ? this.DEPOSIT*0.02 : 195000000*0.02
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.02 : 160000000*0.02
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.02 : 145000000*0.02
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 195000000 ? this.DEPOSIT*0.02 : 195000000*0.02
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 160000000 ? this.DEPOSIT*0.02 : 160000000*0.02
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 145000000 ? this.DEPOSIT*0.02 : 145000000*0.02
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '14'://다자녀 5인
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 215000000 ? this.DEPOSIT*0.02 : 215000000*0.02
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 180000000 ? this.DEPOSIT*0.02 : 180000000*0.02
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 165000000 ? this.DEPOSIT*0.02 : 165000000*0.02
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 215000000 ? this.DEPOSIT*0.02 : 215000000*0.02
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 180000000 ? this.DEPOSIT*0.02 : 180000000*0.02
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 165000000 ? this.DEPOSIT*0.02 : 165000000*0.02
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 215000000 ? this.DEPOSIT*0.02 : 215000000*0.02
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 180000000 ? this.DEPOSIT*0.02 : 180000000*0.02
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 165000000 ? this.DEPOSIT*0.02 : 165000000*0.02
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 215000000 ? this.DEPOSIT*0.02 : 215000000*0.02
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 180000000 ? this.DEPOSIT*0.02 : 180000000*0.02
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 165000000 ? this.DEPOSIT*0.02 : 165000000*0.02
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 215000000 ? this.DEPOSIT*0.02 : 215000000*0.02
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 180000000 ? this.DEPOSIT*0.02 : 180000000*0.02
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 165000000 ? this.DEPOSIT*0.02 : 165000000*0.02
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 215000000 ? this.DEPOSIT*0.02 : 215000000*0.02
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 180000000 ? this.DEPOSIT*0.02 : 180000000*0.02
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 165000000 ? this.DEPOSIT*0.02 : 165000000*0.02
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 215000000 ? this.DEPOSIT*0.02 : 215000000*0.02
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 180000000 ? this.DEPOSIT*0.02 : 180000000*0.02
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 165000000 ? this.DEPOSIT*0.02 : 165000000*0.02
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 215000000 ? this.DEPOSIT*0.02 : 215000000*0.02
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 180000000 ? this.DEPOSIT*0.02 : 180000000*0.02
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 165000000 ? this.DEPOSIT*0.02 : 165000000*0.02
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '15'://다자녀 6인
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 235000000 ? this.DEPOSIT*0.02 : 235000000*0.02
                this.ADD_COST = this.DEPOSIT > 235000000 ? parseInt(this.DEPOSIT)-235000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 200000000 ? this.DEPOSIT*0.02 : 200000000*0.02
                this.ADD_COST = this.DEPOSIT > 200000000 ? parseInt(this.DEPOSIT)-200000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 185000000 ? this.DEPOSIT*0.02 : 185000000*0.02
                this.ADD_COST = this.DEPOSIT > 185000000 ? parseInt(this.DEPOSIT)-185000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 235000000 ? this.DEPOSIT*0.02 : 235000000*0.02
                this.ADD_COST = this.DEPOSIT > 235000000 ? parseInt(this.DEPOSIT)-235000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 200000000 ? this.DEPOSIT*0.02 : 200000000*0.02
                this.ADD_COST = this.DEPOSIT > 200000000 ? parseInt(this.DEPOSIT)-200000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 185000000 ? this.DEPOSIT*0.02 : 185000000*0.02
                this.ADD_COST = this.DEPOSIT > 185000000 ? parseInt(this.DEPOSIT)-185000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 235000000 ? this.DEPOSIT*0.02 : 235000000*0.02
                this.ADD_COST = this.DEPOSIT > 235000000 ? parseInt(this.DEPOSIT)-235000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 200000000 ? this.DEPOSIT*0.02 : 200000000*0.02
                this.ADD_COST = this.DEPOSIT > 200000000 ? parseInt(this.DEPOSIT)-200000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 185000000 ? this.DEPOSIT*0.02 : 185000000*0.02
                this.ADD_COST = this.DEPOSIT > 185000000 ? parseInt(this.DEPOSIT)-185000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 235000000 ? this.DEPOSIT*0.02 : 235000000*0.02
                this.ADD_COST = this.DEPOSIT > 235000000 ? parseInt(this.DEPOSIT)-235000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 200000000 ? this.DEPOSIT*0.02 : 200000000*0.02
                this.ADD_COST = this.DEPOSIT > 200000000 ? parseInt(this.DEPOSIT)-200000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 185000000 ? this.DEPOSIT*0.02 : 185000000*0.02
                this.ADD_COST = this.DEPOSIT > 185000000 ? parseInt(this.DEPOSIT)-185000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 235000000 ? this.DEPOSIT*0.02 : 235000000*0.02
                this.ADD_COST = this.DEPOSIT > 235000000 ? parseInt(this.DEPOSIT)-235000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 200000000 ? this.DEPOSIT*0.02 : 200000000*0.02
                this.ADD_COST = this.DEPOSIT > 200000000 ? parseInt(this.DEPOSIT)-200000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 185000000 ? this.DEPOSIT*0.02 : 185000000*0.02
                this.ADD_COST = this.DEPOSIT > 185000000 ? parseInt(this.DEPOSIT)-185000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 235000000 ? this.DEPOSIT*0.02 : 235000000*0.02
                this.ADD_COST = this.DEPOSIT > 235000000 ? parseInt(this.DEPOSIT)-235000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 200000000 ? this.DEPOSIT*0.02 : 200000000*0.02
                this.ADD_COST = this.DEPOSIT > 200000000 ? parseInt(this.DEPOSIT)-200000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 185000000 ? this.DEPOSIT*0.02 : 185000000*0.02
                this.ADD_COST = this.DEPOSIT > 185000000 ? parseInt(this.DEPOSIT)-185000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 235000000 ? this.DEPOSIT*0.02 : 235000000*0.02
                this.ADD_COST = this.DEPOSIT > 235000000 ? parseInt(this.DEPOSIT)-235000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 200000000 ? this.DEPOSIT*0.02 : 200000000*0.02
                this.ADD_COST = this.DEPOSIT > 200000000 ? parseInt(this.DEPOSIT)-200000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 185000000 ? this.DEPOSIT*0.02 : 185000000*0.02
                this.ADD_COST = this.DEPOSIT > 185000000 ? parseInt(this.DEPOSIT)-185000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 235000000 ? this.DEPOSIT*0.02 : 235000000*0.02
                this.ADD_COST = this.DEPOSIT > 235000000 ? parseInt(this.DEPOSIT)-235000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 200000000 ? this.DEPOSIT*0.02 : 200000000*0.02
                this.ADD_COST = this.DEPOSIT > 200000000 ? parseInt(this.DEPOSIT)-200000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 185000000 ? this.DEPOSIT*0.02 : 185000000*0.02
                this.ADD_COST = this.DEPOSIT > 185000000 ? parseInt(this.DEPOSIT)-185000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '16'://다자녀 7인
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 255000000 ? this.DEPOSIT*0.02 : 255000000*0.02
                this.ADD_COST = this.DEPOSIT > 255000000 ? parseInt(this.DEPOSIT)-255000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 220000000 ? this.DEPOSIT*0.02 : 220000000*0.02
                this.ADD_COST = this.DEPOSIT > 220000000 ? parseInt(this.DEPOSIT)-220000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 205000000 ? this.DEPOSIT*0.02 : 205000000*0.02
                this.ADD_COST = this.DEPOSIT > 205000000 ? parseInt(this.DEPOSIT)-205000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 255000000 ? this.DEPOSIT*0.02 : 255000000*0.02
                this.ADD_COST = this.DEPOSIT > 255000000 ? parseInt(this.DEPOSIT)-255000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 220000000 ? this.DEPOSIT*0.02 : 220000000*0.02
                this.ADD_COST = this.DEPOSIT > 220000000 ? parseInt(this.DEPOSIT)-220000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 205000000 ? this.DEPOSIT*0.02 : 205000000*0.02
                this.ADD_COST = this.DEPOSIT > 205000000 ? parseInt(this.DEPOSIT)-205000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 255000000 ? this.DEPOSIT*0.02 : 255000000*0.02
                this.ADD_COST = this.DEPOSIT > 255000000 ? parseInt(this.DEPOSIT)-255000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 220000000 ? this.DEPOSIT*0.02 : 220000000*0.02
                this.ADD_COST = this.DEPOSIT > 220000000 ? parseInt(this.DEPOSIT)-220000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 205000000 ? this.DEPOSIT*0.02 : 205000000*0.02
                this.ADD_COST = this.DEPOSIT > 205000000 ? parseInt(this.DEPOSIT)-205000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 255000000 ? this.DEPOSIT*0.02 : 255000000*0.02
                this.ADD_COST = this.DEPOSIT > 255000000 ? parseInt(this.DEPOSIT)-255000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 220000000 ? this.DEPOSIT*0.02 : 220000000*0.02
                this.ADD_COST = this.DEPOSIT > 220000000 ? parseInt(this.DEPOSIT)-220000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 205000000 ? this.DEPOSIT*0.02 : 205000000*0.02
                this.ADD_COST = this.DEPOSIT > 205000000 ? parseInt(this.DEPOSIT)-205000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 255000000 ? this.DEPOSIT*0.02 : 255000000*0.02
                this.ADD_COST = this.DEPOSIT > 255000000 ? parseInt(this.DEPOSIT)-255000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 220000000 ? this.DEPOSIT*0.02 : 220000000*0.02
                this.ADD_COST = this.DEPOSIT > 220000000 ? parseInt(this.DEPOSIT)-220000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 205000000 ? this.DEPOSIT*0.02 : 205000000*0.02
                this.ADD_COST = this.DEPOSIT > 205000000 ? parseInt(this.DEPOSIT)-205000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 255000000 ? this.DEPOSIT*0.02 : 255000000*0.02
                this.ADD_COST = this.DEPOSIT > 255000000 ? parseInt(this.DEPOSIT)-255000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 220000000 ? this.DEPOSIT*0.02 : 220000000*0.02
                this.ADD_COST = this.DEPOSIT > 220000000 ? parseInt(this.DEPOSIT)-220000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 205000000 ? this.DEPOSIT*0.02 : 205000000*0.02
                this.ADD_COST = this.DEPOSIT > 205000000 ? parseInt(this.DEPOSIT)-205000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 255000000 ? this.DEPOSIT*0.02 : 255000000*0.02
                this.ADD_COST = this.DEPOSIT > 255000000 ? parseInt(this.DEPOSIT)-255000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 220000000 ? this.DEPOSIT*0.02 : 220000000*0.02
                this.ADD_COST = this.DEPOSIT > 220000000 ? parseInt(this.DEPOSIT)-220000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 205000000 ? this.DEPOSIT*0.02 : 205000000*0.02
                this.ADD_COST = this.DEPOSIT > 205000000 ? parseInt(this.DEPOSIT)-205000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 255000000 ? this.DEPOSIT*0.02 : 255000000*0.02
                this.ADD_COST = this.DEPOSIT > 255000000 ? parseInt(this.DEPOSIT)-255000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 220000000 ? this.DEPOSIT*0.02 : 220000000*0.02
                this.ADD_COST = this.DEPOSIT > 220000000 ? parseInt(this.DEPOSIT)-220000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 205000000 ? this.DEPOSIT*0.02 : 205000000*0.02
                this.ADD_COST = this.DEPOSIT > 205000000 ? parseInt(this.DEPOSIT)-205000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '17'://다자녀 8인
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 275000000 ? this.DEPOSIT*0.02 : 275000000*0.02
                this.ADD_COST = this.DEPOSIT > 275000000 ? parseInt(this.DEPOSIT)-275000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.02 : 240000000*0.02
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 225000000 ? this.DEPOSIT*0.02 : 225000000*0.02
                this.ADD_COST = this.DEPOSIT > 225000000 ? parseInt(this.DEPOSIT)-225000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 275000000 ? this.DEPOSIT*0.02 : 275000000*0.02
                this.ADD_COST = this.DEPOSIT > 275000000 ? parseInt(this.DEPOSIT)-275000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.02 : 240000000*0.02
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 225000000 ? this.DEPOSIT*0.02 : 225000000*0.02
                this.ADD_COST = this.DEPOSIT > 225000000 ? parseInt(this.DEPOSIT)-225000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 275000000 ? this.DEPOSIT*0.02 : 275000000*0.02
                this.ADD_COST = this.DEPOSIT > 275000000 ? parseInt(this.DEPOSIT)-275000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.02 : 240000000*0.02
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 225000000 ? this.DEPOSIT*0.02 : 225000000*0.02
                this.ADD_COST = this.DEPOSIT > 225000000 ? parseInt(this.DEPOSIT)-225000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 275000000 ? this.DEPOSIT*0.02 : 275000000*0.02
                this.ADD_COST = this.DEPOSIT > 275000000 ? parseInt(this.DEPOSIT)-275000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.02 : 240000000*0.02
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 225000000 ? this.DEPOSIT*0.02 : 225000000*0.02
                this.ADD_COST = this.DEPOSIT > 225000000 ? parseInt(this.DEPOSIT)-225000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 275000000 ? this.DEPOSIT*0.02 : 275000000*0.02
                this.ADD_COST = this.DEPOSIT > 275000000 ? parseInt(this.DEPOSIT)-275000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.02 : 240000000*0.02
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 225000000 ? this.DEPOSIT*0.02 : 225000000*0.02
                this.ADD_COST = this.DEPOSIT > 225000000 ? parseInt(this.DEPOSIT)-225000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 275000000 ? this.DEPOSIT*0.02 : 275000000*0.02
                this.ADD_COST = this.DEPOSIT > 275000000 ? parseInt(this.DEPOSIT)-275000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.02 : 240000000*0.02
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 225000000 ? this.DEPOSIT*0.02 : 225000000*0.02
                this.ADD_COST = this.DEPOSIT > 225000000 ? parseInt(this.DEPOSIT)-225000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 275000000 ? this.DEPOSIT*0.02 : 275000000*0.02
                this.ADD_COST = this.DEPOSIT > 275000000 ? parseInt(this.DEPOSIT)-275000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.02 : 240000000*0.02
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 225000000 ? this.DEPOSIT*0.02 : 225000000*0.02
                this.ADD_COST = this.DEPOSIT > 225000000 ? parseInt(this.DEPOSIT)-225000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 275000000 ? this.DEPOSIT*0.02 : 275000000*0.02
                this.ADD_COST = this.DEPOSIT > 275000000 ? parseInt(this.DEPOSIT)-275000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 240000000 ? this.DEPOSIT*0.02 : 240000000*0.02
                this.ADD_COST = this.DEPOSIT > 240000000 ? parseInt(this.DEPOSIT)-240000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 225000000 ? this.DEPOSIT*0.02 : 225000000*0.02
                this.ADD_COST = this.DEPOSIT > 225000000 ? parseInt(this.DEPOSIT)-225000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '18'://다자녀 9인
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 295000000 ? this.DEPOSIT*0.02 : 295000000*0.02
                this.ADD_COST = this.DEPOSIT > 295000000 ? parseInt(this.DEPOSIT)-295000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 260000000 ? this.DEPOSIT*0.02 : 260000000*0.02
                this.ADD_COST = this.DEPOSIT > 260000000 ? parseInt(this.DEPOSIT)-260000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 245000000 ? this.DEPOSIT*0.02 : 245000000*0.02
                this.ADD_COST = this.DEPOSIT > 245000000 ? parseInt(this.DEPOSIT)-245000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 295000000 ? this.DEPOSIT*0.02 : 295000000*0.02
                this.ADD_COST = this.DEPOSIT > 295000000 ? parseInt(this.DEPOSIT)-295000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 260000000 ? this.DEPOSIT*0.02 : 260000000*0.02
                this.ADD_COST = this.DEPOSIT > 260000000 ? parseInt(this.DEPOSIT)-260000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 245000000 ? this.DEPOSIT*0.02 : 245000000*0.02
                this.ADD_COST = this.DEPOSIT > 245000000 ? parseInt(this.DEPOSIT)-245000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 295000000 ? this.DEPOSIT*0.02 : 295000000*0.02
                this.ADD_COST = this.DEPOSIT > 295000000 ? parseInt(this.DEPOSIT)-295000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 260000000 ? this.DEPOSIT*0.02 : 260000000*0.02
                this.ADD_COST = this.DEPOSIT > 260000000 ? parseInt(this.DEPOSIT)-260000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 245000000 ? this.DEPOSIT*0.02 : 245000000*0.02
                this.ADD_COST = this.DEPOSIT > 245000000 ? parseInt(this.DEPOSIT)-245000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 295000000 ? this.DEPOSIT*0.02 : 295000000*0.02
                this.ADD_COST = this.DEPOSIT > 295000000 ? parseInt(this.DEPOSIT)-295000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 260000000 ? this.DEPOSIT*0.02 : 260000000*0.02
                this.ADD_COST = this.DEPOSIT > 260000000 ? parseInt(this.DEPOSIT)-260000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 245000000 ? this.DEPOSIT*0.02 : 245000000*0.02
                this.ADD_COST = this.DEPOSIT > 245000000 ? parseInt(this.DEPOSIT)-245000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 295000000 ? this.DEPOSIT*0.02 : 295000000*0.02
                this.ADD_COST = this.DEPOSIT > 295000000 ? parseInt(this.DEPOSIT)-295000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 260000000 ? this.DEPOSIT*0.02 : 260000000*0.02
                this.ADD_COST = this.DEPOSIT > 260000000 ? parseInt(this.DEPOSIT)-260000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 245000000 ? this.DEPOSIT*0.02 : 245000000*0.02
                this.ADD_COST = this.DEPOSIT > 245000000 ? parseInt(this.DEPOSIT)-245000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 295000000 ? this.DEPOSIT*0.02 : 295000000*0.02
                this.ADD_COST = this.DEPOSIT > 295000000 ? parseInt(this.DEPOSIT)-295000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 260000000 ? this.DEPOSIT*0.02 : 260000000*0.02
                this.ADD_COST = this.DEPOSIT > 260000000 ? parseInt(this.DEPOSIT)-260000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 245000000 ? this.DEPOSIT*0.02 : 245000000*0.02
                this.ADD_COST = this.DEPOSIT > 245000000 ? parseInt(this.DEPOSIT)-245000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 295000000 ? this.DEPOSIT*0.02 : 295000000*0.02
                this.ADD_COST = this.DEPOSIT > 295000000 ? parseInt(this.DEPOSIT)-295000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 260000000 ? this.DEPOSIT*0.02 : 260000000*0.02
                this.ADD_COST = this.DEPOSIT > 260000000 ? parseInt(this.DEPOSIT)-260000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 245000000 ? this.DEPOSIT*0.02 : 245000000*0.02
                this.ADD_COST = this.DEPOSIT > 245000000 ? parseInt(this.DEPOSIT)-245000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 295000000 ? this.DEPOSIT*0.02 : 295000000*0.02
                this.ADD_COST = this.DEPOSIT > 295000000 ? parseInt(this.DEPOSIT)-295000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 260000000 ? this.DEPOSIT*0.02 : 260000000*0.02
                this.ADD_COST = this.DEPOSIT > 260000000 ? parseInt(this.DEPOSIT)-260000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 245000000 ? this.DEPOSIT*0.02 : 245000000*0.02
                this.ADD_COST = this.DEPOSIT > 245000000 ? parseInt(this.DEPOSIT)-245000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '19'://다자녀 10인
          switch(this.RENT_RATE){
            case '01':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 315000000 ? this.DEPOSIT*0.02 : 315000000*0.02
                this.ADD_COST = this.DEPOSIT > 315000000 ? parseInt(this.DEPOSIT)-315000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 280000000 ? this.DEPOSIT*0.02 : 280000000*0.02
                this.ADD_COST = this.DEPOSIT > 280000000 ? parseInt(this.DEPOSIT)-280000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 265000000 ? this.DEPOSIT*0.02 : 265000000*0.02
                this.ADD_COST = this.DEPOSIT > 265000000 ? parseInt(this.DEPOSIT)-265000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 315000000 ? this.DEPOSIT*0.02 : 315000000*0.02
                this.ADD_COST = this.DEPOSIT > 315000000 ? parseInt(this.DEPOSIT)-315000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 280000000 ? this.DEPOSIT*0.02 : 280000000*0.02
                this.ADD_COST = this.DEPOSIT > 280000000 ? parseInt(this.DEPOSIT)-280000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 265000000 ? this.DEPOSIT*0.02 : 265000000*0.02
                this.ADD_COST = this.DEPOSIT > 265000000 ? parseInt(this.DEPOSIT)-265000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 315000000 ? this.DEPOSIT*0.02 : 315000000*0.02
                this.ADD_COST = this.DEPOSIT > 315000000 ? parseInt(this.DEPOSIT)-315000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 280000000 ? this.DEPOSIT*0.02 : 280000000*0.02
                this.ADD_COST = this.DEPOSIT > 280000000 ? parseInt(this.DEPOSIT)-280000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 265000000 ? this.DEPOSIT*0.02 : 265000000*0.02
                this.ADD_COST = this.DEPOSIT > 265000000 ? parseInt(this.DEPOSIT)-265000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 315000000 ? this.DEPOSIT*0.02 : 315000000*0.02
                this.ADD_COST = this.DEPOSIT > 315000000 ? parseInt(this.DEPOSIT)-315000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 280000000 ? this.DEPOSIT*0.02 : 280000000*0.02
                this.ADD_COST = this.DEPOSIT > 280000000 ? parseInt(this.DEPOSIT)-280000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 265000000 ? this.DEPOSIT*0.02 : 265000000*0.02
                this.ADD_COST = this.DEPOSIT > 265000000 ? parseInt(this.DEPOSIT)-265000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 315000000 ? this.DEPOSIT*0.02 : 315000000*0.02
                this.ADD_COST = this.DEPOSIT > 315000000 ? parseInt(this.DEPOSIT)-315000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 280000000 ? this.DEPOSIT*0.02 : 280000000*0.02
                this.ADD_COST = this.DEPOSIT > 280000000 ? parseInt(this.DEPOSIT)-280000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 265000000 ? this.DEPOSIT*0.02 : 265000000*0.02
                this.ADD_COST = this.DEPOSIT > 265000000 ? parseInt(this.DEPOSIT)-265000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 315000000 ? this.DEPOSIT*0.02 : 315000000*0.02
                this.ADD_COST = this.DEPOSIT > 315000000 ? parseInt(this.DEPOSIT)-315000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 280000000 ? this.DEPOSIT*0.02 : 280000000*0.02
                this.ADD_COST = this.DEPOSIT > 280000000 ? parseInt(this.DEPOSIT)-280000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 265000000 ? this.DEPOSIT*0.02 : 265000000*0.02
                this.ADD_COST = this.DEPOSIT > 265000000 ? parseInt(this.DEPOSIT)-265000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 315000000 ? this.DEPOSIT*0.02 : 315000000*0.02
                this.ADD_COST = this.DEPOSIT > 315000000 ? parseInt(this.DEPOSIT)-315000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 280000000 ? this.DEPOSIT*0.02 : 280000000*0.02
                this.ADD_COST = this.DEPOSIT > 280000000 ? parseInt(this.DEPOSIT)-280000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 265000000 ? this.DEPOSIT*0.02 : 265000000*0.02
                this.ADD_COST = this.DEPOSIT > 265000000 ? parseInt(this.DEPOSIT)-265000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 315000000 ? this.DEPOSIT*0.02 : 315000000*0.02
                this.ADD_COST = this.DEPOSIT > 315000000 ? parseInt(this.DEPOSIT)-315000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 280000000 ? this.DEPOSIT*0.02 : 280000000*0.02
                this.ADD_COST = this.DEPOSIT > 280000000 ? parseInt(this.DEPOSIT)-280000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.BASE_COST = this.DEPOSIT <= 265000000 ? this.DEPOSIT*0.02 : 265000000*0.02
                this.ADD_COST = this.DEPOSIT > 265000000 ? parseInt(this.DEPOSIT)-265000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            // case '10':
            //   this.DEDUCTIBLE = '5%'
            //   break;
          }
          break;
        case '20'://소년소녀 1인
          switch(this.RENT_RATE){
            case '01':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            case '10':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.005/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.0075/12) : Math.floor(this.TI*0.01/12))
              break;
          }
          break;
        case '21'://소년소녀 2인
          switch(this.RENT_RATE){
            case '01':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 155000000 ? parseInt(this.DEPOSIT)-155000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 120000000 ? parseInt(this.DEPOSIT)-120000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 105000000 ? parseInt(this.DEPOSIT)-105000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            case '10':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.005/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.0075/12) : Math.floor(this.TI*0.01/12))
              break;
          }
          break;
        case '22'://소년소녀 3인
          switch(this.RENT_RATE){
            case '01':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 175000000 ? parseInt(this.DEPOSIT)-175000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 140000000 ? parseInt(this.DEPOSIT)-140000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 125000000 ? parseInt(this.DEPOSIT)-125000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            case '10':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.005/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.0075/12) : Math.floor(this.TI*0.01/12))
              break;
          }
          break;
        case '23'://소년소녀 4인
          switch(this.RENT_RATE){
            case '01':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 195000000 ? parseInt(this.DEPOSIT)-195000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 160000000 ? parseInt(this.DEPOSIT)-160000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 145000000 ? parseInt(this.DEPOSIT)-145000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            case '10':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.005/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.0075/12) : Math.floor(this.TI*0.01/12))
              break;
          }
          break;
        case '24'://소년소녀 5인
          switch(this.RENT_RATE){
            case '01':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.015/12) : Math.floor(this.TI*0.02/12))
              break;
            case '02':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '03':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.013/12) : Math.floor(this.TI*0.018/12))
              break;
            case '04':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.012/12) : Math.floor(this.TI*0.017/12))
              break;
            case '05':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '06':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.011/12) : Math.floor(this.TI*0.016/12))
              break;
            case '07':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.015/12))
              break;
            case '08':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 215000000 ? parseInt(this.DEPOSIT)-215000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 180000000 ? parseInt(this.DEPOSIT)-180000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 165000000 ? parseInt(this.DEPOSIT)-165000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.01/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.01/12) : Math.floor(this.TI*0.013/12))
              break;
            // case '09':
            //   this.DEDUCTIBLE = '5%'
            //   break;
            case '10':
              this.BASE_COST = '0'
              if(this.RENT_LOC == '01'){
                this.ADD_RENT = this.RENT > 600000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 130000000 ? parseInt(this.DEPOSIT)-130000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else if(this.RENT_LOC == '02'){
                this.ADD_RENT = this.RENT > 450000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 90000000 ? parseInt(this.DEPOSIT)-90000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              } else {
                this.ADD_RENT = this.RENT > 400000 ? this.RENT*12 : this.RENT*3
                this.ADD_COST = this.DEPOSIT > 70000000 ? parseInt(this.DEPOSIT)-70000000 : 0
                this.TI = this.DEPOSIT-this.ADD_COST-this.BASE_COST;
              }
              this.MO_DEPOSIT = this.TI<=40000000 ? Math.floor(this.TI*0.005/12) : (this.TI <= 60000000 ? Math.floor(this.TI*0.0075/12) : Math.floor(this.TI*0.01/12))
              break;
          }
          break;
      }
    }
  },
  mounted() {
  },
  async created() {
    //공통코드 목록 => 사용할 공통코드 리스트에 넣기
    this.common_code_list = [
      "RENT_SEL"      //전세임대유형
      , "RENT_RATE"   //우대금리
      , "RENT_LOC"    //지원지역
      , "RENT_CUT"    //할증
    ];
    //공통코드별 드롭박스 만들기
    this.common_code = await this.mixin_common_code_get_all(this.common_code_list);

    this.RENT_SEL_LIST = this.mixin_common_code_get(this.common_code, 'RENT_SEL');
    this.RENT_RATE_LIST = this.mixin_common_code_get(this.common_code, 'RENT_RATE');
  },
  computed: {
  },
  watch: {
    //전세임대 임대료 계산기
    RENT_SEL(){
      let selectedItem = this.RENT_SEL_LIST.find(item => item.value === this.RENT_SEL);
      this.RENT_SEL_LABEL = selectedItem ? selectedItem.text : '';
      this.deductible_cal();
    },
    RENT_RATE(){
      let selectedItem = this.RENT_RATE_LIST.find(item => item.value === this.RENT_RATE);
      this.RENT_RATE_LABEL = selectedItem ? selectedItem.text : '';
      this.deductible_cal();
    },
    RENT_LOC(){
      this.deductible_cal();
    },
    DEPOSIT(){
      this.deductible_cal();
    },
    RENT(){
      this.deductible_cal();
    },

    //증액율 계산기
    BF_DEPOSIT(){
      this.INC_RATE = ((((this.AF_DEPOSIT*1+(this.AF_RENT*12/0.055))-(this.BF_DEPOSIT*1+(this.BF_RENT*12/0.055)))/(this.BF_DEPOSIT*1+(this.BF_RENT*12/0.055)))*100).toFixed(1);
    },
    AF_DEPOSIT(){
      this.INC_RATE = ((((this.AF_DEPOSIT*1+(this.AF_RENT*12/0.055))-(this.BF_DEPOSIT*1+(this.BF_RENT*12/0.055)))/(this.BF_DEPOSIT*1+(this.BF_RENT*12/0.055)))*100).toFixed(1);
    },
    BF_RENT(){
      this.INC_RATE = ((((this.AF_DEPOSIT*1+(this.AF_RENT*12/0.055))-(this.BF_DEPOSIT*1+(this.BF_RENT*12/0.055)))/(this.BF_DEPOSIT*1+(this.BF_RENT*12/0.055)))*100).toFixed(1);
    },
    AF_RENT(){
      this.INC_RATE = ((((this.AF_DEPOSIT*1+(this.AF_RENT*12/0.055))-(this.BF_DEPOSIT*1+(this.BF_RENT*12/0.055)))/(this.BF_DEPOSIT*1+(this.BF_RENT*12/0.055)))*100).toFixed(1);
    },

    //주거지원 시급가구
    HS_INCOME(){
      this.INCOME_30 = this.HS_INCOME*0.3;
      this.HS_CONVERT_RENT = Math.floor((this.HS_DEPOSIT*0.04)/12+this.HS_RENT*1);
    },
    HS_DEPOSIT(){
      this.HS_CONVERT_RENT = Math.floor((this.HS_DEPOSIT*0.04)/12+this.HS_RENT*1)
    },
    HS_RENT(){
      this.HS_CONVERT_RENT = Math.floor((this.HS_DEPOSIT*0.04)/12+this.HS_RENT*1);
    },
    INCOME_30(){
      this.POSSIBLE = this.INCOME_30 <= this.HS_CONVERT_RENT ? '가능' : '불가능';
    },
    HS_CONVERT_RENT(){
      this.POSSIBLE = this.INCOME_30 <= this.HS_CONVERT_RENT ? '가능' : '불가능'; 
    },

    //소득대비 임차료 비율
    RR_INCOME(){
      this.RR_CONVERT_RENT = Math.floor((this.RR_DEPOSIT*0.04)/12+this.RR_RENT*1);
      this.EARN_RENT_RATE = ((((this.RR_DEPOSIT*0.04/12)+(this.RR_RENT-this.HOUSE_COST))/this.RR_INCOME).toFixed(3)*100).toFixed(1);
    },
    RR_DEPOSIT(){
      this.RR_CONVERT_RENT = Math.floor((this.RR_DEPOSIT*0.04)/12+this.RR_RENT*1);
    },
    RR_RENT(){
      this.RR_CONVERT_RENT = Math.floor((this.RR_DEPOSIT*0.04)/12+this.RR_RENT*1);
    },
    HOUSE_COST(){
      this.EARN_RENT_RATE = ((((this.RR_DEPOSIT*0.04/12)+(this.RR_RENT-this.HOUSE_COST))/this.RR_INCOME).toFixed(3)*100).toFixed(1);
    },
    RR_CONVERT_RENT(){
      this.EARN_RENT_RATE = ((((this.RR_DEPOSIT*0.04/12)+(this.RR_RENT-this.HOUSE_COST))/this.RR_INCOME).toFixed(3)*100).toFixed(1);
    },
    
    //임대료 할증
    INTEREST_DEPOSIT(){
      switch (this.SURCHARGE){
        case "01":
          this.SURCHARGE_DEPOSIT = this.INTEREST_DEPOSIT + (this.INTEREST_DEPOSIT*0.1);
        case "02":
          this.SURCHARGE_DEPOSIT = this.INTEREST_DEPOSIT + (this.INTEREST_DEPOSIT*0.2);
        case "03":
          this.SURCHARGE_DEPOSIT = this.INTEREST_DEPOSIT + (this.INTEREST_DEPOSIT*0.3);
        case "04":
          this.SURCHARGE_DEPOSIT = this.INTEREST_DEPOSIT + (this.INTEREST_DEPOSIT*0.8);
      }
    },
    SURCHARGE(){
      switch (this.SURCHARGE){
        case "01":
          this.SURCHARGE_DEPOSIT = this.INTEREST_DEPOSIT*1 + (this.INTEREST_DEPOSIT*0.1);
          break;
        case "02":
          this.SURCHARGE_DEPOSIT = this.INTEREST_DEPOSIT*1 + (this.INTEREST_DEPOSIT*0.2);
          break;
        case "03":
          this.SURCHARGE_DEPOSIT = this.INTEREST_DEPOSIT*1 + (this.INTEREST_DEPOSIT*0.3);
          break;
        case "04":
          this.SURCHARGE_DEPOSIT = this.INTEREST_DEPOSIT*1 + (this.INTEREST_DEPOSIT*0.8);
          break;
      }
    },
    // SURCHARGE_COST(){

    // },
    SURCHARGE_DEPOSIT(){
      this.SURCHARGE_COST = this.SURCHARGE_DEPOSIT*1 - this.INTEREST_DEPOSIT*1;
    },
  },
};
</script>

<style lang="scss" scoped>


</style>