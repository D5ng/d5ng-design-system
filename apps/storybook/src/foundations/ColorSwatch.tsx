import { useEffect, useId, useRef, useState } from "react";

import type { ColorToken } from "./colorGroups";
import * as styles from "./Colors.css";

type Detail = { mode: string; hex: string; rgba: string };

type Props = { token: ColorToken };
type AliasProps = { mode: string; alias: string };

export function ColorSwatch({ token }: Props) {
  const popoverId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [copied, setCopied] = useState(false);
  const variableName = cssVariableName(token.value);

  // 팝오버가 열릴 때 지금 테마에서 실제로 칠해진 색을 읽고, 버튼 아래로 위치를 맞춰요.
  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) {
      return undefined;
    }
    const handleToggle = (event: Event) => {
      const button = buttonRef.current;
      const fill = fillRef.current;
      if (!(event instanceof ToggleEvent) || event.newState !== "open") {
        setCopied(false);
        return;
      }
      if (!button || !fill) {
        return;
      }
      // 화면 오른쪽 끝을 넘지 않게 왼쪽으로 당겨요.
      const rect = button.getBoundingClientRect();
      const gutter = 16;
      const maxLeft =
        document.documentElement.clientWidth - popover.offsetWidth - gutter;
      const left = Math.max(gutter, Math.min(rect.left, maxLeft));
      popover.style.top = `${String(rect.bottom + window.scrollY + 8)}px`;
      popover.style.left = `${String(left + window.scrollX)}px`;
      setDetail({
        mode:
          document.documentElement.dataset.theme === "dark" ? "Dark" : "Light",
        ...readColor(fill),
      });
    };
    popover.addEventListener("toggle", handleToggle);
    return () => {
      popover.removeEventListener("toggle", handleToggle);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(variableName);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <li className={styles.segment}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.swatchButton}
        popoverTarget={popoverId}
        aria-label={token.name}
      >
        <span className={styles.swatchColor}>
          <span
            ref={fillRef}
            className={styles.swatchFill}
            style={{ background: token.value }}
          />
        </span>
        <span className={styles.swatchLabel}>{token.label}</span>
      </button>
      <div
        ref={popoverRef}
        id={popoverId}
        popover="auto"
        role="dialog"
        aria-label={token.name}
        className={styles.popover}
      >
        <div className={styles.popoverHeader}>
          <p className={styles.popoverTitle}>{token.name}</p>
          <button
            type="button"
            className={styles.copyButton}
            onClick={() => void copy()}
          >
            {copied ? "복사됨" : "변수 복사"}
          </button>
        </div>
        <dl className={styles.details}>
          <dt className={styles.detailTerm}>Hex</dt>
          <dd className={styles.detailValue}>
            <span
              className={styles.modeDot}
              style={{ background: token.value }}
            />
            {detail?.hex}
            {detail ? ` (${detail.mode})` : null}
          </dd>
          <dt className={styles.detailTerm}>RGBA</dt>
          <dd className={styles.detailValue}>{detail?.rgba}</dd>
          <dt className={styles.detailTerm}>CSS</dt>
          <dd className={styles.detailValue}>{variableName}</dd>
          <dt className={styles.detailTerm}>TS</dt>
          <dd className={styles.detailValue}>{token.path}</dd>
          {Object.entries(token.aliases).map(([mode, alias]) => (
            <Alias key={mode} mode={mode} alias={alias} />
          ))}
        </dl>
      </div>
    </li>
  );
}

function Alias({ mode, alias }: AliasProps) {
  return (
    <>
      <dt className={styles.detailTerm}>{mode}</dt>
      <dd className={styles.detailValue}>{alias}</dd>
    </>
  );
}

// getComputedStyle은 "rgb(25, 31, 40)"이나 "rgba(0, 0, 0, 0.08)"을 돌려줘요.
function readColor(element: Element): Pick<Detail, "hex" | "rgba"> {
  const computed = getComputedStyle(element).backgroundColor;
  const [r = 0, g = 0, b = 0, a = 1] = (computed.match(/[\d.]+/g) ?? []).map(
    Number,
  );
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  const alpha = a < 1 ? toHex(a * 255) : "";
  return {
    hex: `#${toHex(r)}${toHex(g)}${toHex(b)}${alpha}`.toUpperCase(),
    rgba: `${String(r)}, ${String(g)}, ${String(b)}, ${String(Math.round(a * 100) / 100)}`,
  };
}

function cssVariableName(value: string) {
  return value.slice("var(".length, -")".length);
}
