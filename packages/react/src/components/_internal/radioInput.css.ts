import { style } from "@vanilla-extract/css";

// Radix RadioGroup(1.5.1 RadioBubbleInput)은 form 안에서 숨은 input을 버튼 바로 뒤에 absolute로 두고
// translateX(-100%)로 버튼 위에 겹쳐요. 버튼과 input이 한 칸 안에 나란히 있어야 겹쳐요.
// 칸이 없으면 flex 줄의 absolute 요소가 줄 처음으로 가서, required 말풍선이 엉뚱한 자리를 가리켜요.
// RadioGroup·ChipRadioGroup이 함께 써요. Radix가 input을 버튼 안이나 같은 자리에 두게 바뀌면 지워요.
// 바뀌었는지는 두 컴포넌트의 "숨은 input은 … 같은 자리에 겹쳐요" 테스트가 알려요.
// https://github.com/radix-ui/primitives/blob/main/packages/react/radio-group/src/radio.tsx

// 버튼을 감싸는 칸이에요. 줄 높이를 없애서 칸이 버튼 높이와 같아요.
export const radioInputSlot = style({
  position: "relative",
  display: "block",
  lineHeight: 0,
});

// 칸 안의 버튼은 inline이에요. 줄 위에 맞춰서 칸 높이가 글꼴 기준선과 상관없이 버튼 높이를 따라요.
export const radioInputControl = style({
  verticalAlign: "top",
});
