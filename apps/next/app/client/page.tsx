"use client";

import { Button } from "@d5ng/react";
import { useState } from "react";

// 쓰는 쪽이 클라이언트 컴포넌트 안에서 쓰는 경우예요. 서버에서는 넘길 수 없는 onClick을 여기서 넘겨요.
export default function ClientPage() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <Button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        {`누른 횟수 ${String(count)}`}
      </Button>
    </main>
  );
}
