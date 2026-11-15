import { textStyles, vars } from "@d5ng/tokens";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type SubmitEvent, useId, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogActions,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../AlertDialog";
import { Button } from "../Button";
import { RadioGroup, RadioGroupItem } from "../RadioGroup";
import { TextField } from "../TextField";
import {
  Dialog,
  DialogBody,
  DialogCancel,
  DialogCloseButton,
  DialogContent,
  type DialogContentProps,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogSubmit,
  DialogTitle,
  DialogTrigger,
} from ".";

const sizes = ["medium", "large"] as const;

// 입력·설정 변경 Dialog는 배경을 눌러도 닫히지 않게 막아요. 빠뜨리면 실수로 누른 배경에 입력이 사라져요.
const keepOpenOnOutside: DialogContentProps["onInteractOutside"] = (event) => {
  event.preventDefault();
};

const errorTextStyle = {
  ...textStyles.bodySmall,
  margin: 0,
  color: vars.color.fg.critical,
};

const terms = Array.from({ length: 12 }, (_, index) => (
  <p key={index}>
    제{index + 1}조. 서비스를 이용하는 동안 지켜야 할 내용이에요. 바뀐 내용은
    시행 7일 전에 알림으로 알려 드려요.
  </p>
));

// 스토리는 모두 트리거로 열어요. 문서 페이지에서 여러 모달이 한꺼번에 열리지 않게 하고, 열린 화면은 play가 보여 줘요.
function SettingsDemo(contentProps: DialogContentProps) {
  const formId = useId();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>표시 설정 변경</Button>
      </DialogTrigger>
      <DialogContent {...contentProps} onInteractOutside={keepOpenOnOutside}>
        <DialogHeader>
          <DialogTitle>표시 설정 변경</DialogTitle>
          <DialogDescription>
            설정은 저장한 뒤 화면에 반영돼요.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form
            id={formId}
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <RadioGroup label="글자 크기" name="fontSize" defaultValue="medium">
              <RadioGroupItem value="small" label="작게" />
              <RadioGroupItem value="medium" label="보통" />
              <RadioGroupItem value="large" label="크게" />
            </RadioGroup>
          </form>
        </DialogBody>
        <DialogFooter>
          <DialogCancel>취소</DialogCancel>
          <DialogSubmit form={formId}>저장</DialogSubmit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: "Components/Dialog",
  component: DialogContent,
  subcomponents: {
    DialogBody,
    DialogCloseButton,
    DialogCancel,
    DialogSubmit,
  },
  tags: ["autodocs"],
  args: { size: "medium" },
  argTypes: {
    size: { control: "inline-radio", options: sizes },
  },
  render: (args) => <SettingsDemo {...args} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button"));
  },
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=236-152922",
    },
  },
} satisfies Meta<typeof DialogContent>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 입력·설정을 바꿀 때 써요. Footer 취소와 Escape로 닫고, 배경 클릭은 `onInteractOutside`에서 막아요. */
export const Default: Story = {};

/** 항목이 많거나 넓은 설정에만 `large`를 써요. */
export const Large: Story = {
  args: { size: "large" },
};

/** 정보만 보여 줄 때 써요. Header 닫기 버튼·배경 클릭·Escape로 닫고, Footer를 두지 않아요. */
export const Information: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>요금 안내 보기</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>요금 안내</DialogTitle>
          <DialogDescription>2026년 1월부터 적용돼요.</DialogDescription>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <p>
            기본 요금은 월 9,900원이고, 팀원을 더하면 한 명마다 3,000원이
            붙어요.
          </p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  ),
};

/** 제목만으로 뜻이 충분하면 설명을 빼요. 설명이 없으면 대화상자에 설명을 연결하지 않아요. */
export const WithoutDescription: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>이름 바꾸기</Button>
      </DialogTrigger>
      <DialogContent {...args} onInteractOutside={keepOpenOnOutside}>
        <DialogHeader>
          <DialogTitle>이름 바꾸기</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <TextField label="프로젝트 이름" defaultValue="디자인 시스템" />
        </DialogBody>
        <DialogFooter>
          <DialogCancel>취소</DialogCancel>
          <DialogSubmit>저장</DialogSubmit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** 본문이 넘치면 본문만 스크롤돼요. 위로 가려진 내용이 있으면 구분선이, 아래로 남은 내용이 있으면 흐림이 보여요. */
export const LongContent: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>이용 약관 보기</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>이용 약관</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>{terms}</DialogBody>
      </DialogContent>
    </Dialog>
  ),
};

function SavingExample(contentProps: DialogContentProps) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failedOnce, setFailedOnce] = useState(false);
  const [error, setError] = useState(false);

  const save = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(false);
    // 시연용 요청이에요. 처음은 실패하고 다시 저장하면 성공해요.
    window.setTimeout(() => {
      setSaving(false);
      if (failedOnce) {
        setOpen(false);
        return;
      }
      setFailedOnce(true);
      setError(true);
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        setError(false);
      }}
    >
      <DialogTrigger asChild>
        <Button>알림 설정</Button>
      </DialogTrigger>
      <DialogContent
        {...contentProps}
        onInteractOutside={keepOpenOnOutside}
        onEscapeKeyDown={(event) => {
          // 저장 중에는 취소처럼 Escape로도 닫지 않아요.
          if (saving) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>알림 설정</DialogTitle>
          <DialogDescription>받을 방법을 골라 주세요.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form id={formId} onSubmit={save}>
            <RadioGroup label="받는 방법" name="channel" defaultValue="email">
              <RadioGroupItem value="email" label="이메일" />
              <RadioGroupItem value="push" label="앱 알림" />
            </RadioGroup>
          </form>
          {error ? (
            <p role="alert" style={errorTextStyle}>
              저장하지 못했어요. 다시 시도해 주세요.
            </p>
          ) : null}
        </DialogBody>
        <DialogFooter>
          <DialogCancel disabled={saving}>취소</DialogCancel>
          <DialogSubmit form={formId} loading={saving}>
            {error ? "다시 저장" : "저장"}
          </DialogSubmit>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** 저장이 끝날 때까지 열어 두는 방법이에요. 실패하면 입력을 남기고 본문에 오류를 보여요. 저장 중에는 취소와 Escape를 함께 막아요. */
export const Saving: Story = {
  render: (args) => <SavingExample {...args} />,
};

function UnsavedChangesExample(contentProps: DialogContentProps) {
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [confirming, setConfirming] = useState(false);
  // 확인창을 닫고 계속 편집할 때 포커스를 돌려줄 곳이에요.
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const close = () => {
    setOpen(false);
    setDirty(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        // 취소·Escape로 닫으려 할 때 바꾼 값이 있으면 먼저 물어요.
        if (!nextOpen && dirty) {
          returnFocusRef.current =
            document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null;
          setConfirming(true);
          return;
        }
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button>프로필 편집</Button>
      </DialogTrigger>
      <DialogContent {...contentProps} onInteractOutside={keepOpenOnOutside}>
        <DialogHeader>
          <DialogTitle>프로필 편집</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <TextField
            label="표시 이름"
            defaultValue="하늘"
            onChange={() => {
              setDirty(true);
            }}
          />
        </DialogBody>
        <DialogFooter>
          <DialogCancel>취소</DialogCancel>
          <DialogSubmit onClick={close}>저장</DialogSubmit>
        </DialogFooter>

        <AlertDialog open={confirming} onOpenChange={setConfirming}>
          <AlertDialogContent
            onCloseAutoFocus={(event) => {
              // Trigger가 없어서 직접 정해요. 버리면 Dialog가 자기 Trigger로 돌려줘요.
              event.preventDefault();
              returnFocusRef.current?.focus();
            }}
          >
            <AlertDialogTitle>변경사항을 버릴까요?</AlertDialogTitle>
            <AlertDialogDescription>
              저장하지 않은 내용이 사라져요.
            </AlertDialogDescription>
            <AlertDialogActions>
              <AlertDialogCancel>계속 편집하기</AlertDialogCancel>
              <AlertDialogAction variant="critical" onClick={close}>
                버리기
              </AlertDialogAction>
            </AlertDialogActions>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}

/** 바꾼 값이 있는데 닫으려 하면 `AlertDialog`로 버릴지 물어요. `open`을 제어해 닫기를 한 번 멈춰요. */
export const UnsavedChanges: Story = {
  render: (args) => <UnsavedChangesExample {...args} />,
};
