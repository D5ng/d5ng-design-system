import clsx from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

import type { ClassValue } from "clsx"

// NOTE: @theme에 정의 폰트 사이즈가 누락되는 문제로 인해 Custom Tailwind Merge 함수를 사용합니다.
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "heading-1",
            "heading-2",
            "heading-3",
            "heading-4",
            "heading-5",
            "body-xl",
            "body-lg",
            "body-md",
            "body-sm",
            "body-xs",
            "action-lg",
            "action-md",
            "action-sm",
            "caption-md",
          ],
        },
      ],
    },
  },
})

export function cn(...classes: ClassValue[]) {
  return customTwMerge(clsx(...classes))
}
