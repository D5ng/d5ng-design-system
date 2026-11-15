import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { DismissibleCallout } from "./DismissibleCallout";

describe("DismissibleCallout", () => {
  it('닫기 버튼 이름은 "안내 닫기"이고 Tab으로 닿아요', async () => {
    await render(<DismissibleCallout title="안내">설명</DismissibleCallout>);

    await userEvent.tab();

    await expect
      .element(page.getByRole("button", { name: "안내 닫기" }))
      .toHaveFocus();
  });

  it("닫기를 누르면 사라지고 onOpenChange(false)가 불려요", async () => {
    const onOpenChange = vi.fn();
    await render(
      <DismissibleCallout onOpenChange={onOpenChange}>설명</DismissibleCallout>,
    );

    await page.getByRole("button", { name: "안내 닫기" }).click();

    await expect.element(page.getByText("설명")).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  it("open을 넘기면 닫기를 눌러도 쓰는 쪽이 바꿀 때까지 남아요", async () => {
    const onOpenChange = vi.fn();
    const { rerender } = await render(
      <DismissibleCallout open onOpenChange={onOpenChange}>
        설명
      </DismissibleCallout>,
    );

    await page.getByRole("button", { name: "안내 닫기" }).click();

    await expect.element(page.getByText("설명")).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);

    await rerender(
      <DismissibleCallout open={false} onOpenChange={onOpenChange}>
        설명
      </DismissibleCallout>,
    );

    await expect.element(page.getByText("설명")).not.toBeInTheDocument();
  });

  it("defaultOpen이 false면 그리지 않아요", async () => {
    const { container } = await render(
      <DismissibleCallout defaultOpen={false}>설명</DismissibleCallout>,
    );

    expect(container.childElementCount).toBe(0);
  });

  it("onOpenChange는 닫기 버튼이 사라지기 전에 불려요", async () => {
    // 그래서 여기서 옮긴 포커스는 body를 거치지 않아요. Radix처럼 effect에서 부르면 버튼이 이미 빠진 뒤예요.
    const closeButton = page.getByRole("button", { name: "안내 닫기" });
    const onOpenChange = vi.fn(() => closeButton.query() !== null);
    await render(
      <DismissibleCallout onOpenChange={onOpenChange}>설명</DismissibleCallout>,
    );

    await closeButton.click();

    expect(onOpenChange).toHaveReturnedWith(true);
  });

  it("onOpenChange에서 옮긴 포커스를 덮지 않아요", async () => {
    // 닫기 버튼이 사라지면 포커스가 body로 가요. 쓰는 쪽이 옮긴 곳에 남아야 해요.
    function Example() {
      const [open, setOpen] = useState(true);
      const reopenRef = useRef<HTMLButtonElement>(null);
      const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        reopenRef.current?.focus();
      };
      return (
        <>
          <DismissibleCallout open={open} onOpenChange={handleOpenChange}>
            설명
          </DismissibleCallout>
          <button ref={reopenRef} type="button">
            다시 보기
          </button>
        </>
      );
    }
    await render(<Example />);

    await page.getByRole("button", { name: "안내 닫기" }).click();

    await expect.element(page.getByText("설명")).not.toBeInTheDocument();
    await expect
      .element(page.getByRole("button", { name: "다시 보기" }))
      .toHaveFocus();
  });
});
