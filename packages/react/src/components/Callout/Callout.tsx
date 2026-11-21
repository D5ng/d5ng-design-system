import { clsx } from "clsx";
import {
  Check,
  CircleAlert,
  Info,
  type LucideIcon,
  TriangleAlert,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import * as styles from "./Callout.css";

// Figma Prefix의 톤별 기본값과 같아요. 바꾸면 Figma도 같이 바꿔요.
const TONE_ICONS: Record<CalloutTone, LucideIcon> = {
  neutral: Info,
  informative: Info,
  positive: Check,
  warning: TriangleAlert,
  critical: CircleAlert,
};

// Figma는 제목과 설명 사이를 두 칸 띄워요. 공백 하나는 접히지 않게 NBSP로 둬요.
// CSS 여백이 아니라 글자라서 복사하거나 스크린리더가 읽어도 "안내변경한"처럼 붙지 않아요.
const TITLE_GAP = "  ";

type CalloutTone = NonNullable<styles.RootVariants["tone"]>;

/** 세 Callout이 같이 쓰는 props예요. */
export type CalloutBaseProps = {
  /**
   * 배경과 앞 아이콘의 색이에요. 글자 색은 톤과 상관없이 같아요.
   * @default neutral
   */
  tone?: CalloutTone;
  /** 짧은 제목이에요(예: `안내`). 설명과 한 문단으로 이어져요. */
  title?: ReactNode;
  /** 설명이에요. 문장 안에 `Link`를 넣을 수 있어요. */
  children: ReactNode;
  /**
   * 톤 기본 아이콘 대신 그릴 아이콘이에요. 스크린리더는 읽지 않아요.
   *
   * 없거나 `null`이면 톤 기본 아이콘을 그려요. 숨기려면 `hidePrefixIcon`을 써요.
   */
  prefixIcon?: ReactNode;
  /**
   * 앞 아이콘을 그리지 않아요.
   * @default false
   */
  hidePrefixIcon?: boolean;
};

// HTML title(툴팁 속성)은 제목 prop과 이름이 같아서 빼요.
export type CalloutProps = Omit<ComponentProps<"div">, keyof CalloutBaseProps> &
  CalloutBaseProps;

type CalloutContentProps = Omit<CalloutBaseProps, "tone" | "hidePrefixIcon"> & {
  tone: CalloutTone;
  hidePrefixIcon: boolean;
};

// ---- Callout

/**
 * 화면 안에 머무는 짧은 안내예요. 작업 결과를 잠깐 알리는 피드백에는 쓰지 않아요.
 *
 * `role`은 붙이지 않아요. 나중에 나타나는 중요한 안내만 쓰는 쪽이 `role="status"`나 `role="alert"`를 붙여요.
 */
export function Callout({
  tone = "neutral",
  title,
  prefixIcon,
  hidePrefixIcon = false,
  className,
  children,
  ...divProps
}: CalloutProps) {
  return (
    <div {...divProps} className={clsx(styles.root({ tone }), className)}>
      <CalloutContent
        tone={tone}
        title={title}
        prefixIcon={prefixIcon}
        hidePrefixIcon={hidePrefixIcon}
      >
        {children}
      </CalloutContent>
    </div>
  );
}

// ---- CalloutContent

// 세 Callout이 같이 그리는 앞 아이콘과 메시지예요. button 안에도 들어가서 span만 써요.
export function CalloutContent({
  tone,
  title,
  prefixIcon,
  hidePrefixIcon,
  children,
}: CalloutContentProps) {
  const ToneIcon = TONE_ICONS[tone];

  return (
    <span className={styles.content}>
      {hidePrefixIcon ? null : (
        <span className={styles.prefixIcon} aria-hidden>
          {prefixIcon ?? <ToneIcon />}
        </span>
      )}
      <span className={styles.message}>
        {title ? (
          <>
            <span className={styles.title}>{title}</span>
            {TITLE_GAP}
          </>
        ) : null}
        {children}
      </span>
    </span>
  );
}
