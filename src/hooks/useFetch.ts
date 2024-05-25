import { useEffect, useState } from "react";

type Tag = "idle" | "loading" | "success" | "empty" | "error";

type ReturnType<T> =
  | { tag: "idle"; mutate: () => void; cache: any }
  | { tag: "loading"; cache: any }
  | { tag: "success"; products: T; mutate: () => void; cache: any }
  | { tag: "empty"; mutate: () => void; cache: any }
  | { tag: "error"; errorMessage: string; mutate: () => void; cache: any };

export function useFetch<T>(
  productId: string,
  { enableCache }: { enableCache?: boolean } = {}
): ReturnType<T | null> {
  const [tag, setTag] = useState<Tag>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [data, setData] = useState<T | null>(null);

  const [cache, setCache] = useState<T | null | any>(null);

  function getData() {
    if (!productId && enableCache && cache?.["all"]) {
      setTag("success");
      setData(cache?.["all"]);
      setErrorMessage("");
      return;
    } else if (cache?.[productId] && enableCache) {
      setTag("success");
      setData(cache[productId]);
      setErrorMessage("");
      return;
    }

    setTag("loading");

    fetcher("https://fakestoreapi.com/products/" + productId + "?limit=2")
      .then((data) => {
        if (data) {
          setTag("success");
          setErrorMessage("");
          setData(data);
          if (enableCache && data?.length > 0) {
            setCache({
              ...cache,
              all: data,
            });
          }

          if (enableCache && !data?.length) {
            setCache({
              ...cache,
              [productId]: data,
            });
          }
        } else {
          setTag("empty");
          setErrorMessage("");
        }
      })
      .catch((error) => {
        setTag("error");
        setErrorMessage(error);
      });
  }

  useEffect(() => {
    if (tag === "loading") return;

    getData();
  }, []);

  switch (tag) {
    case "idle":
      return { tag: "idle", mutate: getData, cache };
    case "loading":
      return { tag: "loading", cache };
    case "success":
      return { tag: "success", products: data, mutate: getData, cache };
    case "empty":
      return { tag: "empty", mutate: getData, cache };
    case "error":
      return { tag: "error", errorMessage, mutate: getData, cache };
    default:
      return { tag, mutate: getData, cache, products: null };
  }
}

async function fetcher(url: string) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}
