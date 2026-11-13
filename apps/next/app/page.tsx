import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogActions,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogErrorMessage,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Field,
  IconButton,
  Link,
  Switch,
  SwitchRow,
  TextField,
} from "@d5ng/react";
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="critical">글 삭제</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>글을 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            삭제하면 되돌릴 수 없어요.
          </AlertDialogDescription>
          <AlertDialogErrorMessage>삭제하지 못했어요.</AlertDialogErrorMessage>
          <AlertDialogActions>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction variant="critical">삭제</AlertDialogAction>
          </AlertDialogActions>
        </AlertDialogContent>
      </AlertDialog>
      <Field
        label="별명"
        description="다른 사람에게 보이는 이름이에요."
        required
        requirementIndicator
        characterCount={{ current: 0, max: 20 }}
      >
        {(control) => <input {...control} />}
      </Field>
      {/* hideLabel은 라벨을 VisuallyHidden으로 한 번 더 감싸서 따로 렌더해요. */}
      <Field
        label="검색어"
        hideLabel
        invalid
        errorMessage="검색어를 입력해 주세요."
      >
        {(control) => <input type="search" {...control} />}
      </Field>
      {/* group은 라벨을 Radix Label 대신 span으로 그려서 따로 렌더해요. */}
      <Field label="받는 방법" group>
        {(control) => <div role="radiogroup" {...control} />}
      </Field>
      {/* 서버의 form에서도 숨은 input으로 값이 제출돼요. loading은 클릭을 막는 핸들러가 달라져서 따로 렌더해요. */}
      <form>
        <Switch label="알림 받기" name="notify" defaultChecked />
        <Switch label="저장 중" loading />
        <SwitchRow
          label="댓글 알림"
          description="내 글에 새 댓글이 달리면 알려 드려요."
        />
      </form>
      <TextField label="이름" name="name" />
      <TextField label="아이디" readOnly defaultValue="d5ng" />
      {/* 앞뒤 글자는 useId로 만든 id를 입력의 설명에 이어서 따로 렌더해요. */}
      <TextField
        label="가격"
        prefixText="약"
        suffixText="원"
        inputMode="numeric"
      />
    </main>
  );
}
