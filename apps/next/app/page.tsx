import { Button, IconButton, Link } from "@d5ng/react";
import NextLink from "next/link";

// "use client"가 없는 서버 컴포넌트라서, 서버에서 못 쓰는 export가 있으면 프리렌더 단계에서 next build가 실패해요.
// 새 export는 여기에 렌더해요. 핸들러가 달라지는 prop(loading, asChild)도 따로 렌더해요.
export default function Page() {
  return (
    <main>
      <Button>저장</Button>
      <Button loading>저장 중</Button>
      <Button asChild variant="secondary">
        <NextLink href="/client">클라이언트 페이지</NextLink>
      </Button>
      <IconButton aria-label="닫기">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </IconButton>
      <IconButton aria-label="닫는 중" loading>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </IconButton>
      <p>
        <Link href="https://github.com/D5ng/d5ng-design-system">저장소</Link>와{" "}
        <Link asChild>
          <NextLink href="/client">클라이언트 페이지</NextLink>
        </Link>
      </p>
    </main>
  );
}
