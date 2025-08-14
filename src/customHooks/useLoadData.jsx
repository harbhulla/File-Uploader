import { useContext, useEffect } from "react";
import { StateContext } from "../components/StateContext";

export default function useLoadData() {
  const { setNewInformation, hasLoaded, setHasLoaded } =
    useContext(StateContext);
  useEffect(() => {
    if (hasLoaded) return;

    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/upload`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Server error: ${res.status} ${text}`);
        }

        const data = await res.json();
        const parsed = data.flatMap((item) =>
          (item?.files ?? []).map((file) => ({
            filename: file.name,
            uploadTime: file.updatedAt,
            path: file.path,
            size: file.size,
          }))
        );

        setNewInformation(parsed);
        setHasLoaded(true);
      } catch (err) {
        console.error("useLoadData error:", err);
      }
    })();
  }, [hasLoaded, setNewInformation, setHasLoaded]);
}
