import * as buttonBase from "./buttonBase.css";

const SPINNER_RADIUS = 9;
const SPINNER_CIRCUMFERENCE = 2 * Math.PI * SPINNER_RADIUS;
// 원의 3/4만 그려서 도는 게 보이게 해요.
const SPINNER_ARC = SPINNER_CIRCUMFERENCE * 0.75;

/** 버튼이 처리 중일 때 가운데에 그려요. 스크린리더는 읽지 않고 버튼의 `aria-busy`가 알려요. */
export function Spinner() {
  return (
    <svg
      className={buttonBase.spinner}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r={SPINNER_RADIUS}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={[SPINNER_ARC, SPINNER_CIRCUMFERENCE].join(" ")}
      />
    </svg>
  );
}
