interface Body<TVariables> {
  query: string;
  variables?: TVariables;
}
export const server = {
  /**
   * 对于一个mutations是可以传递参数的，
   *
   * 因此在需要定义第二个泛型来约定我们的参数
   *
   *
   */
  fetch: async <TData = any, TVariables = any>(body: Body<TVariables>) => {
    /**
     * 第二个参数用于格式化body内容
     */
    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.json() as Promise<{ data: TData }>;
  },
};
