// useMapEvents.js

import { useEffect } from "react";

export function useMapEvents(mapId, setSelectedNodeId, setNodes) {
  // clear selection if another map opened a sidebar
  useEffect(() => {
    const clearSelection = (e) => {
      const emitterId = e?.detail?.emitterId;
      if (emitterId && emitterId !== mapId) {
        // clear selection on this map
        setSelectedNodeId(null);
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            style: {
              ...(n.style || {}),
              border: "1px solid rgba(15,23,42,0.06)",
              boxShadow: "0 6px 16px rgba(15,23,42,0.06)",
            },
            className: (n.className || "").replace("selected", "").trim(),
          }))
        );
      }
    };
    window.addEventListener("miniwordmap:clear-selection", clearSelection);
    return () => window.removeEventListener("miniwordmap:clear-selection", clearSelection);
  }, [mapId, setNodes, setSelectedNodeId]);

  // clear selection when sidebar closed
  useEffect(() => {
    const onSidebarClosed = () => {
      setSelectedNodeId(null);
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          style: {
            ...(n.style || {}),
            border: "1px solid rgba(15,23,42,0.06)",
            boxShadow: "0 6px 16px rgba(15,23,42,0.06)",
          },
          className: (n.className || "").replace("selected", "").trim(),
        }))
      );
    };
    window.addEventListener("miniwordmap:sidebar-closed", onSidebarClosed);
    return () => window.removeEventListener("miniwordmap:sidebar-closed", onSidebarClosed);
  }, [setNodes, setSelectedNodeId]);
}
