import { createRef, type ReactNode, type SubmitEvent, useId } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../AlertDialog";
import { Button } from "../Button";
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
import * as styles from "./Dialog.css";

type SettingsDialogProps = Pick<DialogContentProps, "onInteractOutside"> & {
  description?: ReactNode;
  onSubmit?: (event: SubmitEvent<HTMLFormElement>) => void;
};

// 가이드의 기본 예시(설정 변경)예요. 트리거로 열어야 처음 포커스와 포커스 복귀를 확인할 수 있어요.
function SettingsDialog({
  description = (
    <DialogDescription>설정은 저장한 뒤 화면에 반영돼요.</DialogDescription>
  ),
  onSubmit,
  onInteractOutside,
}: SettingsDialogProps) {
  const formId = useId();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>표시 설정 변경</Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={onInteractOutside}>
        <DialogHeader>
          <DialogTitle>표시 설정 변경</DialogTitle>
          {description}
        </DialogHeader>
        <DialogBody>
          <form id={formId} onSubmit={onSubmit}>
            <TextField label="표시 이름" name="displayName" />
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

type InformationDialogProps = { children: ReactNode };

// 정보 조회 예시예요. 닫기 버튼이 있고 Footer가 없어요.
function InformationDialog({ children }: InformationDialogProps) {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>요금 안내</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody data-testid="body">{children}</DialogBody>
      </DialogContent>
    </Dialog>
  );
}

const paragraphs = (count: number) =>
  Array.from({ length: count }, (_, index) => (
    <p key={index}>{index + 1}번째 안내 문단이에요.</p>
  ));

const open = async () => {
  await page.getByRole("button", { name: "표시 설정 변경" }).click();
  await expect.element(page.getByRole("dialog")).toBeInTheDocument();
};

const clickOverlay = async () => {
  const overlay = document.querySelector(`.${styles.overlay}`);
  expect(overlay).toBeInstanceOf(HTMLElement);
  // 가운데는 표면이 덮고 있어서 배경의 모서리를 눌러요.
  await userEvent.click(overlay as HTMLElement, { position: { x: 4, y: 4 } });
};

// 구분선과 흐림은 스크롤 영역을 감싼 요소의 ::before에 배경 두 겹(구분선, 흐림)으로 그려요. 없는 겹은 none이에요.
const scrollEdges = () => {
  const viewport = page.getByTestId("body").element();
  const root = viewport.parentElement as HTMLElement;
  const layers = getComputedStyle(root, "::before").backgroundImage;
  return {
    divider: !layers.startsWith("none"),
    fog: !layers.endsWith("none"),
  };
};

describe("Dialog", () => {
  it("열면 제목을 이름으로, 설명을 설명으로 읽어요", async () => {
    await render(<SettingsDialog />);
    await open();

    const dialog = page.getByRole("dialog", { name: "표시 설정 변경" });
    await expect
      .element(dialog)
      .toHaveAccessibleDescription("설정은 저장한 뒤 화면에 반영돼요.");
  });

  it("설명이 없으면 설명을 연결하지 않아요", async () => {
    await render(<SettingsDialog description={null} />);
    await open();

    await expect
      .element(page.getByRole("dialog"))
      .not.toHaveAttribute("aria-describedby");
  });

  it("모달임을 알려요", async () => {
    await render(<SettingsDialog />);
    await open();

    await expect
      .element(page.getByRole("dialog"))
      .toHaveAttribute("aria-modal", "true");
  });

  it("바깥을 누르면 닫혀요", async () => {
    await render(<SettingsDialog />);
    await open();

    await clickOverlay();

    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
  });

  it("onInteractOutside에서 막으면 바깥을 눌러도 닫히지 않아요", async () => {
    // 입력·설정 변경 Dialog가 실수로 닫혀 입력을 잃지 않게 하는 방법이에요.
    await render(
      <SettingsDialog
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      />,
    );
    await open();

    await clickOverlay();

    await expect.element(page.getByRole("dialog")).toBeInTheDocument();
  });

  it("Escape로 닫혀요", async () => {
    await render(<SettingsDialog />);
    await open();

    await userEvent.keyboard("{Escape}");

    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
  });

  it("안에서 연 대화상자가 있으면 Escape가 그것부터 닫아요", async () => {
    await render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>표시 설정 변경</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>닫기</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>변경사항을 버릴까요?</AlertDialogTitle>
                <AlertDialogCancel>계속 편집하기</AlertDialogCancel>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );
    await page.getByRole("button", { name: "닫기" }).click();
    await expect.element(page.getByRole("alertdialog")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");

    await expect.element(page.getByRole("alertdialog")).not.toBeInTheDocument();
    await expect.element(page.getByRole("dialog")).toBeInTheDocument();
  });

  it("열리면 첫 번째 입력에 포커스가 가요", async () => {
    await render(<SettingsDialog />);
    await open();

    await expect
      .element(page.getByRole("textbox", { name: "표시 이름" }))
      .toHaveFocus();
  });

  it("닫기 버튼 없는 긴 본문은 열릴 때 본문에 포커스가 가요", async () => {
    // 넘치는 본문이 첫 번째 조작 요소라서, 아래 취소 버튼보다 먼저 받아요.
    await render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>이용 약관 보기</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이용 약관</DialogTitle>
          </DialogHeader>
          <DialogBody data-testid="body">{paragraphs(40)}</DialogBody>
          <DialogFooter>
            <DialogCancel>닫기</DialogCancel>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    await page.getByRole("button", { name: "이용 약관 보기" }).click();

    await expect.element(page.getByTestId("body")).toHaveFocus();
  });

  it("Tab이 대화상자 안에서만 돌아요", async () => {
    await render(<SettingsDialog />);
    await open();
    const input = page.getByRole("textbox", { name: "표시 이름" });
    const cancel = page.getByRole("button", { name: "취소" });
    const submit = page.getByRole("button", { name: "저장" });
    await expect.element(input).toHaveFocus();

    await userEvent.tab();
    await expect.element(cancel).toHaveFocus();
    await userEvent.tab();
    await expect.element(submit).toHaveFocus();
    await userEvent.tab();
    await expect.element(input).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect.element(submit).toHaveFocus();
  });

  it("닫히면 연 버튼으로 포커스가 돌아가요", async () => {
    await render(<SettingsDialog />);
    await open();

    await page.getByRole("button", { name: "취소" }).click();

    await expect
      .element(page.getByRole("button", { name: "표시 설정 변경" }))
      .toHaveFocus();
  });

  it("열려 있으면 배경 페이지가 스크롤되지 않아요", async () => {
    await render(<SettingsDialog />);
    await open();

    expect(getComputedStyle(document.body).overflow).toBe("hidden");
  });

  it('닫기 버튼은 "닫기"로 읽히고 누르면 닫혀요', async () => {
    await render(<InformationDialog>{paragraphs(1)}</InformationDialog>);

    await page.getByRole("button", { name: "닫기" }).click();

    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
  });

  it("취소 버튼을 누르면 닫혀요", async () => {
    await render(<SettingsDialog />);
    await open();

    await page.getByRole("button", { name: "취소" }).click();

    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
  });

  it("실행 버튼은 눌러도 닫히지 않아요", async () => {
    // 저장이 끝날 때까지 기다리거나 실패를 보여 줘야 해요.
    const onSubmit = vi.fn((event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
    });
    await render(<SettingsDialog onSubmit={onSubmit} />);
    await open();

    await page.getByRole("button", { name: "저장" }).click();

    await expect.element(page.getByRole("dialog")).toBeInTheDocument();
  });

  it("실행 버튼은 form으로 이어진 폼을 제출해요", async () => {
    const onSubmit = vi.fn((event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
    });
    await render(<SettingsDialog onSubmit={onSubmit} />);
    await open();

    await page.getByRole("button", { name: "저장" }).click();
    await page.getByRole("textbox", { name: "표시 이름" }).fill("디자인팀");
    await userEvent.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it("본문이 넘치지 않으면 구분선과 흐림이 없어요", async () => {
    await render(<InformationDialog>{paragraphs(1)}</InformationDialog>);
    await expect.element(page.getByRole("dialog")).toBeInTheDocument();

    expect(scrollEdges()).toEqual({ divider: false, fog: false });
  });

  it("본문이 넘치면 아래 흐림이 보이고, 내리면 위 구분선이 보여요", async () => {
    await render(<InformationDialog>{paragraphs(40)}</InformationDialog>);
    await expect.poll(scrollEdges).toEqual({ divider: false, fog: true });

    page.getByTestId("body").element().scrollTop = 100;

    await expect.poll(scrollEdges).toEqual({ divider: true, fog: true });
  });

  it("맨 아래까지 내리면 흐림이 내용을 가리지 않아요", async () => {
    await render(<InformationDialog>{paragraphs(40)}</InformationDialog>);
    // 넘침을 잰 뒤 아래 여백이 늘어나요. 그 전에 내리면 늘어난 만큼 끝에서 멀어져요.
    await expect.poll(scrollEdges).toEqual({ divider: false, fog: true });
    const viewport = page.getByTestId("body").element();

    viewport.scrollTop = viewport.scrollHeight;

    await expect.poll(scrollEdges).toEqual({ divider: true, fog: false });
    const last = page.getByText("40번째 안내 문단이에요.").element();
    expect(last.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      viewport.getBoundingClientRect().bottom,
    );
  });

  it("본문이 넘치면 Tab으로 들어가 방향키로 스크롤해요", async () => {
    // Safari는 스크롤 영역에 스스로 포커스를 주지 않아요. Chromium에서는 tabIndex가 없어도 통과해서 속성도 봐요.
    await render(<InformationDialog>{paragraphs(40)}</InformationDialog>);
    const body = page.getByTestId("body");
    await expect.element(body).toHaveAttribute("tabindex", "0");
    await expect
      .element(page.getByRole("button", { name: "닫기" }))
      .toHaveFocus();

    await userEvent.tab();
    await expect.element(body).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");

    await expect.poll(() => body.element().scrollTop).toBeGreaterThan(0);
  });

  it("본문이 넘치지 않으면 Tab이 본문에 멈추지 않아요", async () => {
    await render(<InformationDialog>{paragraphs(1)}</InformationDialog>);

    await expect
      .element(page.getByTestId("body"))
      .not.toHaveAttribute("tabindex");
  });

  it("본문 내용이 늘어나 넘치기 시작하면 흐림이 생겨요", async () => {
    const { rerender } = await render(
      <InformationDialog>{paragraphs(1)}</InformationDialog>,
    );
    await expect.poll(scrollEdges).toEqual({ divider: false, fog: false });

    await rerender(<InformationDialog>{paragraphs(40)}</InformationDialog>);

    await expect.poll(scrollEdges).toEqual({ divider: false, fog: true });
  });

  describe("너비", () => {
    // vitest 브라우저 모드의 기본 화면 크기로 되돌려요.
    afterEach(async () => {
      await page.viewport(414, 896);
    });

    it("크기마다 최대 너비가 달라요", async () => {
      await page.viewport(1280, 800);
      const { rerender } = await render(
        <Dialog defaultOpen>
          <DialogContent size="medium">
            <DialogTitle>표시 설정 변경</DialogTitle>
          </DialogContent>
        </Dialog>,
      );
      const widthOfDialog = () =>
        page.getByRole("dialog").element().getBoundingClientRect().width;
      expect(widthOfDialog()).toBe(480);

      await rerender(
        <Dialog defaultOpen>
          <DialogContent size="large">
            <DialogTitle>표시 설정 변경</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      expect(widthOfDialog()).toBe(800);
    });

    it("좁은 화면에서는 화면 너비의 90%예요", async () => {
      await page.viewport(390, 844);
      await render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>표시 설정 변경</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const { width } = page
        .getByRole("dialog")
        .element()
        .getBoundingClientRect();
      expect(width).toBeCloseTo(390 * 0.9);
    });
  });

  it("className을 넘겨도 원래 스타일이 남아요", async () => {
    await render(
      <Dialog defaultOpen>
        <DialogContent className="custom">
          <DialogTitle>표시 설정 변경</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const dialog = page.getByRole("dialog");
    await expect.element(dialog).toHaveClass("custom");
    await expect
      .element(dialog)
      .toHaveClass(...styles.content({ size: "medium" }).split(" "));
  });

  it("ref를 전달해요", async () => {
    const contentRef = createRef<HTMLDivElement>();
    const bodyRef = createRef<HTMLDivElement>();
    await render(
      <Dialog defaultOpen>
        <DialogContent ref={contentRef}>
          <DialogTitle>표시 설정 변경</DialogTitle>
          <DialogBody ref={bodyRef} data-testid="body">
            {paragraphs(1)}
          </DialogBody>
        </DialogContent>
      </Dialog>,
    );

    await expect.element(page.getByRole("dialog")).toBeInTheDocument();
    expect(contentRef.current).toBe(page.getByRole("dialog").element());
    expect(bodyRef.current).toBe(page.getByTestId("body").element());
  });
});
