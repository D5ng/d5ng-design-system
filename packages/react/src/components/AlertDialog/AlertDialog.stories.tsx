import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "../Button";
import {
  AlertDialog,
  AlertDialogAction,
  type AlertDialogActionProps,
  AlertDialogActions,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogErrorMessage,
  AlertDialogTitle,
  AlertDialogTrigger,
} from ".";

const variants = ["neutral", "primary", "critical"] as const;

type DemoProps = {
  trigger: string;
  title: string;
  description: string;
  cancel?: string;
} & AlertDialogActionProps;

// 스토리는 모두 트리거로 열어요. 문서 페이지에서 여러 모달이 한꺼번에 열리지 않게 하고, 열린 화면은 play가 보여 줘요.
function Demo({
  trigger,
  title,
  description,
  cancel,
  ...actionProps
}: DemoProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>{trigger}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <AlertDialogActions>
          {cancel === undefined ? null : (
            <AlertDialogCancel>{cancel}</AlertDialogCancel>
          )}
          <AlertDialogAction {...actionProps} />
        </AlertDialogActions>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const meta = {
  title: "Components/AlertDialog",
  component: AlertDialogAction,
  subcomponents: {
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogErrorMessage,
    AlertDialogCancel,
  },
  tags: ["autodocs"],
  args: { children: "계속", variant: "neutral" },
  argTypes: {
    children: { control: "text" },
    variant: { control: "inline-radio", options: variants },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    prefixIcon: { control: false },
    suffixIcon: { control: false },
  },
  render: (args) => (
    <Demo
      trigger="대화상자 열기"
      title="작업을 계속할까요?"
      description="내용을 확인해 주세요."
      cancel="취소"
      {...args}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button"));
  },
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/5e7PW74E0sWvXqhHC1fpqz/d5ng?node-id=239-167291",
    },
  },
} satisfies Meta<typeof AlertDialogAction>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 중요한 안내를 확인받을 때 써요. 실행 버튼은 기본 `neutral`이에요. */
export const Default: Story = {};

/** 삭제·초기화·변경사항 폐기처럼 되돌릴 수 없는 실행에만 써요. 취소는 빨갛게 하지 않아요. */
export const Critical: Story = {
  args: { variant: "critical", children: "삭제" },
  render: (args) => (
    <Demo
      trigger="항목 삭제"
      title="항목을 삭제할까요?"
      description="삭제한 항목은 복구할 수 없어요."
      cancel="취소"
      {...args}
    />
  ),
};

/** 확인만 받으면 될 때 버튼 하나로 둬요. 열리면 그 버튼에 포커스가 가고, Escape도 같은 닫기예요. */
export const OneAction: Story = {
  args: { children: "확인" },
  render: (args) => (
    <Demo
      trigger="안내 보기"
      title="저장 공간이 거의 찼어요"
      description="사용하지 않는 파일을 정리해 주세요."
      {...args}
    />
  ),
};

/** 라벨이 반 폭에 안 들어가면 세로로 쌓여요. 글자를 줄이거나 말줄임하지 않아요. */
export const LongLabels: Story = {
  args: { variant: "critical", children: "저장하지 않고 나가기" },
  render: (args) => (
    <Demo
      trigger="편집 닫기"
      title="변경사항을 버릴까요?"
      description="저장하지 않은 내용이 사라져요."
      cancel="계속 편집하기"
      {...args}
    />
  ),
};

/** 취소를 더 눈에 띄지 않게 해야 할 때 Cancel을 `ghost`로 둬요. */
export const GhostCancel: Story = {
  render: (args) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>대화상자 열기</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>작업을 계속할까요?</AlertDialogTitle>
        <AlertDialogDescription>내용을 확인해 주세요.</AlertDialogDescription>
        <AlertDialogActions>
          <AlertDialogCancel variant="ghost">나중에</AlertDialogCancel>
          <AlertDialogAction {...args} />
        </AlertDialogActions>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/** 메시지만으로 뜻이 충분하면 제목을 숨겨요. 스크린리더는 숨긴 제목을 이름으로 읽어요. */
export const HiddenTitle: Story = {
  render: (args) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>대화상자 열기</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle visuallyHidden>작업 계속 확인</AlertDialogTitle>
        <AlertDialogDescription>
          작업을 계속하면 지금 화면을 떠나요.
        </AlertDialogDescription>
        <AlertDialogActions>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction {...args} />
        </AlertDialogActions>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/** 실행이 실패하면 닫지 않고 오류를 알린 뒤 다시 시도하게 해요. */
export const WithError: Story = {
  args: { variant: "critical", children: "다시 시도" },
  render: (args) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>항목 삭제</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>항목을 삭제할까요?</AlertDialogTitle>
        <AlertDialogDescription>
          삭제한 항목은 복구할 수 없어요.
        </AlertDialogDescription>
        <AlertDialogErrorMessage>
          삭제하지 못했어요. 다시 시도해 주세요.
        </AlertDialogErrorMessage>
        <AlertDialogActions>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            {...args}
            onClick={(event) => {
              event.preventDefault();
            }}
          />
        </AlertDialogActions>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

function AsyncExample() {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [failedOnce, setFailedOnce] = useState(false);
  const [error, setError] = useState(false);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        setError(false);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button>항목 삭제</Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        onEscapeKeyDown={(event) => {
          // 요청 중에는 Cancel처럼 Escape로도 닫지 않아요.
          if (deleting) {
            event.preventDefault();
          }
        }}
      >
        <AlertDialogTitle>항목을 삭제할까요?</AlertDialogTitle>
        <AlertDialogDescription>
          삭제한 항목은 복구할 수 없어요.
        </AlertDialogDescription>
        {error ? (
          <AlertDialogErrorMessage>
            삭제하지 못했어요. 다시 시도해 주세요.
          </AlertDialogErrorMessage>
        ) : null}
        <AlertDialogActions>
          <AlertDialogCancel disabled={deleting}>취소</AlertDialogCancel>
          <AlertDialogAction
            variant="critical"
            loading={deleting}
            onClick={(event) => {
              // 요청이 끝날 때까지 열어 두고, 결과를 보고 직접 닫아요.
              event.preventDefault();
              setDeleting(true);
              setError(false);
              // 시연용 요청이에요. 처음은 실패하고 다시 시도하면 성공해요.
              window.setTimeout(() => {
                setDeleting(false);
                if (failedOnce) {
                  setOpen(false);
                  return;
                }
                setFailedOnce(true);
                setError(true);
              }, 1000);
            }}
          >
            {error ? "다시 시도" : "삭제"}
          </AlertDialogAction>
        </AlertDialogActions>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** 요청이 끝날 때까지 열어 두는 방법이에요. `onClick`에서 닫기를 막고 `open`을 직접 제어해요. 요청 중에는 Cancel과 Escape를 함께 막아요. */
export const Async: Story = {
  render: () => <AsyncExample />,
};
