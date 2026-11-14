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
  Checkbox,
  CheckboxGroup,
  ChipButton,
  ChipToggle,
  Field,
  IconButton,
  Link,
  RadioGroup,
  RadioGroupItem,
  Switch,
  SwitchRow,
  TextareaField,
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
      <RadioGroup label="받는 방법" defaultValue="email">
        <RadioGroupItem value="email" label="이메일" />
        <RadioGroupItem value="sms" label="문자" />
      </RadioGroup>
      {/* required·description·disabled 항목은 Field 연결과 숨은 input을 거쳐서 따로 렌더해요. */}
      <form>
        <RadioGroup
          label="배송 방법"
          name="delivery"
          required
          requirementIndicator
          description="새벽 배송은 서울에서만 돼요."
          size="large"
          tone="brand"
        >
          <RadioGroupItem value="normal" label="일반 배송" />
          <RadioGroupItem value="dawn" label="새벽 배송" disabled />
        </RadioGroup>
      </form>
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
      {/* 지우기 버튼은 값이 있을 때만 그려서, 서버에서 받은 defaultValue로 첫 화면에 보여요. */}
      <TextField
        label="검색어"
        type="search"
        showClearButton
        defaultValue="TextField"
      />
      <TextField label="별명" maxCharacterCount={10} defaultValue="길동" />
      <TextareaField label="소개" name="bio" />
      {/* maxRows는 인라인 CSS 변수로, 글자 수는 상태로 그려서 따로 렌더해요. */}
      <TextareaField
        label="메모"
        maxRows={8}
        maxCharacterCount={500}
        defaultValue="서버에서 그린 첫 화면부터 글자 수가 보여요."
      />
      <TextareaField label="답장" heightMode="fixed" rows={6} />
      {/* 서버의 form에서도 숨은 input으로 값이 제출돼요. */}
      <form>
        <Checkbox label="알림 받기" name="notify" defaultChecked />
        <Checkbox label="전체 선택" defaultChecked="indeterminate" />
        <Checkbox label="지금은 바꿀 수 없어요" disabled />
      </form>
      <Field label="약관" required errorMessage="약관에 동의해 주세요.">
        {(control) => <Checkbox {...control} label="이용약관에 동의해요" />}
      </Field>
      {/* 고른 항목이 모두 같은 name으로 제출돼요. disabled는 fieldset이 항목을 막아서 따로 렌더해요. */}
      <form>
        <CheckboxGroup
          label="관심 분야"
          required
          requirementIndicator
          description="하나 이상 골라 주세요."
        >
          <Checkbox
            name="topics"
            value="design"
            label="디자인"
            defaultChecked
          />
          <Checkbox name="topics" value="dev" label="개발" />
        </CheckboxGroup>
        <CheckboxGroup label="지난 관심 분야" disabled>
          <Checkbox name="pastTopics" value="pm" label="기획" defaultChecked />
        </CheckboxGroup>
      </form>
      <p>
        <ChipButton variant="solid">인기 검색어</ChipButton>
        <ChipButton variant="outlineStrong">최근 검색어</ChipButton>
        <ChipButton>추천 검색어</ChipButton>
        <ChipButton disabled>지금은 못 눌러요</ChipButton>
      </p>
      {/* 선택 상태는 Radix Toggle이 가져서 defaultPressed로 첫 화면을 따로 렌더해요. */}
      <p>
        <ChipToggle>무료 배송</ChipToggle>
        <ChipToggle defaultPressed>오늘 출발</ChipToggle>
        <ChipToggle variant="solid" defaultPressed disabled>
          품절 제외
        </ChipToggle>
      </p>
    </main>
  );
}
