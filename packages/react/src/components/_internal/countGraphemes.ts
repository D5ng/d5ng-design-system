// 글자는 화면에 보이는 단위(grapheme)로 세요. length는 UTF-16 단위라 이모지 하나가 2 이상이 돼요.
// 브라우저·Node 기본 기능이라 의존성이 늘지 않아요.
const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

/**
 * 화면에 보이는 글자 수를 세요. 이모지와 조합된 한글은 한 글자예요.
 */
export function countGraphemes(text: string) {
  return Array.from(segmenter.segment(text)).length;
}
