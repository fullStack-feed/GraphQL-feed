interface Body<TVariables> {
  query: string;
  // 这里的变量我们也不确定是什么类型
  // 因此给来一个泛型，由调用方确定
  variables?: TVariables;
}

interface Error {
  message: string;
}

export const server = {
  // 如果Body想用参数泛型来约束接口，需要在函数前面加上泛型定义
  fetch: async <TData = any, TVariables = any>(body: Body<TVariables>) => {
    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error("failed to fetch from server");
    }
    return res.json() as Promise<{ data: TData; errors: Error[] }>;
  },
};
