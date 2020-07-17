import {useState, useEffect, useCallback, useReducer} from "react";
import {server} from "./server";

interface State<TData> {
  data: TData | null;
  loading: boolean;
  error: boolean;
}

type Action<TData> =
  | { type: "FETCH" }
  | { type: "FETCH_SUCCESS"; payload: TData }
  | { type: "FETCH_ERROR" }


interface QueryResult<TData> extends State<TData> {
  refetch: () => void;
}


const reducer = <TData>() => (state: State<TData>, action: Action<TData>): State<TData> => {
  switch (action.type) {
    case "FETCH" :
      return {...state, loading: true}
    case "FETCH_SUCCESS" :
      return {...state, data: action.payload, loading: false, error: false}
    case "FETCH_ERROR" :
      return {...state, loading: false, error: true}
    default:
      throw new Error()
  }
}
export const useQuery = <TData = any>(query: string) => {
  const fetchReducer = reducer<TData>(); // 目的是能够方便的给泛型
  const [state, dispatch] = useReducer(fetchReducer, {
    data: null,
    loading: true,
    error: false,
  })
  const fetch = useCallback(() => {
    const fetchApi = async () => {
      try {
        dispatch({type: "FETCH"})
        const {data, errors} = await server.fetch<TData>({query});
        if (errors && errors.length) {
          // 通过对fetchAPI请求的errors 属性来判断是否出现问题
          // 此时会将错误抛出setState来更改错误状态
          throw new Error(errors[0].message);
        }
        dispatch({type: "FETCH_SUCCESS", payload: data});
      } catch (error) {
        dispatch({type: "FETCH_ERROR"});
        console.error(error);
      }
    };
    fetchApi();
  }, [query]);

  useEffect(() => {
    fetch();
  }, [fetch]);
  return {...state, refetch: fetch};
};
