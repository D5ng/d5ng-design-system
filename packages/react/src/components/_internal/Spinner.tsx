import { LoaderCircle } from "lucide-react";

import * as buttonBase from "./buttonBase.css";

/** 버튼이 처리 중일 때 가운데에 그려요. 스크린리더는 읽지 않고 버튼의 `aria-busy`가 알려요. */
export function Spinner() {
  return <LoaderCircle className={buttonBase.spinner} aria-hidden />;
}
