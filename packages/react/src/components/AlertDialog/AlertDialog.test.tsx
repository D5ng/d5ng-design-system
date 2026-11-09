import { createRef, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { Button } from "../Button";
import { AlertDialog } from ".";
import * as styles from "./AlertDialog.css";

type DeleteDialogProps = {
  actions?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
};

// 가이드의 기본 예시(삭제 확인)예요. 트리거로 열어야 처음 포커스와 포커스 복귀를 확인할 수 있어요.
function DeleteDialog({ actions, title, children }: DeleteDialogProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button>항목 삭제</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        {title ?? <AlertDialog.Title>항목을 삭제할까요?</AlertDialog.Title>}
        <AlertDialog.Description>
          삭제한 항목은 복구할 수 없어요.
        </AlertDialog.Description>
        {children}
        <AlertDialog.Actions>
          {actions ?? (
            <>
              <AlertDialog.Cancel>취소</AlertDialog.Cancel>
              <AlertDialog.Action variant="critical">삭제</AlertDialog.Action>
            </>
          )}
        </AlertDialog.Actions>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

const open = async () => {
  await page.getByRole("button", { name: "항목 삭제" }).click();
  await expect.element(page.getByRole("alertdialog")).toBeInTheDocument();
};

describe("AlertDialog", () => {
  it("열면 제목을 이름으로, 설명을 설명으로 읽어요", async () => {
    await render(<DeleteDialog />);
    await open();

    const dialog = page.getByRole("alertdialog", {
      name: "항목을 삭제할까요?",
    });
    await expect
      .element(dialog)
      .toHaveAccessibleDescription("삭제한 항목은 복구할 수 없어요.");
  });

  it("바깥을 눌러도 닫히지 않아요", async () => {
    await render(<DeleteDialog />);
    await open();

    const overlay = document.querySelector(`.${styles.overlay}`);
    expect(overlay).toBeInstanceOf(HTMLElement);
    // 가운데는 표면이 덮고 있어서 배경의 모서리를 눌러요.
    await userEvent.click(overlay as HTMLElement, {
      position: { x: 4, y: 4 },
    });

    await expect.element(page.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("Escape는 실행하지 않고 닫아요", async () => {
    const onAction = vi.fn();
    await render(
      <DeleteDialog
        actions={
          <>
            <AlertDialog.Cancel>취소</AlertDialog.Cancel>
            <AlertDialog.Action onClick={onAction}>삭제</AlertDialog.Action>
          </>
        }
      />,
    );
    await open();

    await userEvent.keyboard("{Escape}");

    await expect.element(page.getByRole("alertdialog")).not.toBeInTheDocument();
    expect(onAction).not.toHaveBeenCalled();
  });

  it("열리면 취소 버튼에 포커스가 가요", async () => {
    await render(<DeleteDialog />);
    await open();

    await expect
      .element(page.getByRole("button", { name: "취소" }))
      .toHaveFocus();
  });

  it("버튼이 하나면 그 버튼에 포커스가 가요", async () => {
    await render(
      <DeleteDialog actions={<AlertDialog.Action>확인</AlertDialog.Action>} />,
    );
    await open();

    await expect
      .element(page.getByRole("button", { name: "확인" }))
      .toHaveFocus();
  });

  it("Tab이 대화상자 안에서만 돌아요", async () => {
    await render(<DeleteDialog />);
    await open();
    const cancel = page.getByRole("button", { name: "취소" });
    const action = page.getByRole("button", { name: "삭제" });
    await expect.element(cancel).toHaveFocus();

    await userEvent.tab();
    await expect.element(action).toHaveFocus();
    await userEvent.tab();
    await expect.element(cancel).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect.element(action).toHaveFocus();
  });

  it("닫히면 연 버튼으로 포커스가 돌아가요", async () => {
    await render(<DeleteDialog />);
    await open();

    await page.getByRole("button", { name: "취소" }).click();

    await expect
      .element(page.getByRole("button", { name: "항목 삭제" }))
      .toHaveFocus();
  });

  it("실행 버튼은 누르면 실행하고 닫혀요", async () => {
    const onAction = vi.fn();
    await render(
      <DeleteDialog
        actions={
          <AlertDialog.Action onClick={onAction}>삭제</AlertDialog.Action>
        }
      />,
    );
    await open();

    await page.getByRole("button", { name: "삭제" }).click();

    expect(onAction).toHaveBeenCalledOnce();
    await expect.element(page.getByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("실행 버튼에서 preventDefault하면 열린 채로 남아요", async () => {
    // 요청이 끝날 때까지 기다리거나 실패를 보여 줘야 할 때예요.
    await render(
      <DeleteDialog
        actions={
          <AlertDialog.Action
            onClick={(event) => {
              event.preventDefault();
            }}
          >
            삭제
          </AlertDialog.Action>
        }
      />,
    );
    await open();

    await page.getByRole("button", { name: "삭제" }).click();

    await expect.element(page.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("실행 중이면 다시 눌러도 실행하지 않아요", async () => {
    const onAction = vi.fn();
    await render(
      <DeleteDialog
        actions={
          <AlertDialog.Action loading onClick={onAction}>
            삭제
          </AlertDialog.Action>
        }
      />,
    );
    await open();

    await page.getByRole("button", { name: "삭제" }).click({ force: true });

    expect(onAction).not.toHaveBeenCalled();
    await expect.element(page.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("오류 문구를 스크린리더에 알려요", async () => {
    await render(
      <DeleteDialog>
        <AlertDialog.ErrorMessage>
          삭제하지 못했어요. 다시 시도해 주세요.
        </AlertDialog.ErrorMessage>
      </DeleteDialog>,
    );
    await open();

    await expect
      .element(page.getByRole("alert"))
      .toHaveTextContent("삭제하지 못했어요. 다시 시도해 주세요.");
  });

  it("제목을 숨겨도 이름이 남아요", async () => {
    await render(
      <DeleteDialog
        title={
          <AlertDialog.Title visuallyHidden>항목 삭제 확인</AlertDialog.Title>
        }
      />,
    );
    await open();

    await expect
      .element(page.getByRole("alertdialog", { name: "항목 삭제 확인" }))
      .toBeInTheDocument();
  });

  it("두 라벨이 반 폭에 들어가면 가로로, 넘치면 세로로 놓여요", async () => {
    const { rerender } = await render(<DeleteDialog />);
    await open();
    const topOf = (name: string) =>
      page.getByRole("button", { name }).element().getBoundingClientRect().top;
    expect(topOf("취소")).toBe(topOf("삭제"));

    await rerender(
      <DeleteDialog
        actions={
          <>
            <AlertDialog.Cancel>계속 편집하기</AlertDialog.Cancel>
            <AlertDialog.Action variant="critical">
              저장하지 않고 나가기
            </AlertDialog.Action>
          </>
        }
      />,
    );

    expect(topOf("계속 편집하기")).toBeLessThan(topOf("저장하지 않고 나가기"));
  });

  it("className을 넘겨도 원래 스타일이 남아요", async () => {
    await render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Content className="custom">
          <AlertDialog.Title>항목을 삭제할까요?</AlertDialog.Title>
          <AlertDialog.Description>복구할 수 없어요.</AlertDialog.Description>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );

    const dialog = page.getByRole("alertdialog");
    await expect.element(dialog).toHaveClass("custom");
    await expect.element(dialog).toHaveClass(styles.content);
  });

  it("ref를 전달해요", async () => {
    const ref = createRef<HTMLDivElement>();
    await render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Content ref={ref}>
          <AlertDialog.Title>항목을 삭제할까요?</AlertDialog.Title>
          <AlertDialog.Description>복구할 수 없어요.</AlertDialog.Description>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );

    await expect.element(page.getByRole("alertdialog")).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
