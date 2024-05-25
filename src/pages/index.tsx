import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";

export default function Home() {
  const [productId, setProductId] = useState<string>("");
  const [isEnableCache, setIsEnableCache] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("enable-cache") || "false")
      : false
  );

  const productState: any = useFetch(productId, { enableCache: isEnableCache });

  const leftSide = {
    tag: productState.tag,
    products: productState.products,
    errorMessage: productState.errorMessage,
  };

  return (
    <div className="flex items-center gap-3">
      <div className=" px-5 mt-10 overflow-scroll w-1/2 h-[600px]">
        <div className="flex items-center gap-3 mb-3">
          <input
            className="bg-zinc-600"
            onChange={(e) => setProductId(e.target.value)}
            value={productId}
            placeholder="Insert product id 🐠"
          />
          <button
            type="submit"
            disabled={productState.tag === "loading"}
            className="border-[1px] text-sm border-zinc-400 py-[2px] px-2"
            onClick={() => {
              if (productState.tag !== "loading") {
                productState.mutate();
              }
            }}
          >
            {productState.tag === "loading" ? "Searching" : "Search"}
          </button>
          <input
            onChange={(e) => {
              setIsEnableCache(e.target.checked);
              localStorage.setItem(
                "enable-cache",
                JSON.stringify(e.target.checked)
              );
            }}
            checked={isEnableCache}
            type="checkbox"
          />
          <span>Enable caching</span>
        </div>

        <pre>{JSON.stringify(leftSide, undefined, 2)}</pre>
      </div>

      <div className=" px-5 mt-10 overflow-scroll w-1/2  h-[600px]">
        <div className="flex items-center mb-3 justify-between">
          <h1>Cache datas</h1>

          {/* <button>Clear cache</button> */}
        </div>

        {isEnableCache !== "false" && (
          <pre>{JSON.stringify(productState?.cache, undefined, 2)}</pre>
        )}
      </div>
    </div>
  );
}
