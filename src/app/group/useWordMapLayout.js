// useWordMapLayout.js

import { useState, useLayoutEffect, useCallback } from "react";
import ELK from "elkjs/lib/elk.bundled.js";
import { toast } from "react-toastify";

const elk = new ELK();

// Node and layout constants defined in the original file
const NODE_SIZE = 88;
const GRID_SPACING = 240;

const capitalizeLabel = (raw) =>
  (raw || "")
    .toString()
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

const normalizeNodes = (list) =>
  (list || []).map((n, idx) => {
    const rawLabel = n.data?.label ?? n.data?.title ?? n.label ?? n.title ?? n.id ?? `node-${idx}`;
    const slug = n.data?.slug ?? n.slug ?? rawLabel.toString().toLowerCase().replace(/\s+/g, "-");
    return {
      ...n,
      id: n.id ?? `n-${idx}`,
      type: n.type ?? "wordNode",
      data: { ...(n.data || {}), label: capitalizeLabel(rawLabel), slug },
      draggable: true,
      selectable: true,
      width: n.width ?? NODE_SIZE,
      height: n.height ?? NODE_SIZE,
      style: {
        ...(n.style || {}),
        width: `${NODE_SIZE}px`,
        height: `${NODE_SIZE}px`,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: n.style?.background ?? "var(--primary-50, #fff5f8)",
        boxShadow: n.style?.boxShadow ?? "0 6px 16px rgba(15,23,42,0.06)",
        border: n.style?.border ?? "1px solid rgba(15,23,42,0.06)",
        padding: 0,
        cursor: "grab",
        pointerEvents: "auto",
        touchAction: "none",
      },
      className: `${n.className || ""} word-node-circle`.trim(),
    };
  });

const getLayoutedElements = async (nodes, edges) => {
  if (!nodes || nodes.length === 0) return { nodes: [], edges: [] };
  try {
    const graph = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "force",
        "elk.force.quality": "quality",
        // TIGHTER SPACING for shorter lines
        "elk.spacing.nodeNode": "20",
        "elk.spacing.edgeNode": "10",
        "elk.force.desiredEdgeLength": "100",
      },
      children: nodes.map((n) => ({
        id: n.id,
        width: n.width ?? NODE_SIZE,
        height: n.height ?? NODE_SIZE,
      })),
      edges: edges.map((e, i) => ({ id: e.id ?? `e${i}`, source: e.source, target: e.target })),
    };
    const layouted = await elk.layout(graph);
    const layoutedNodes = layouted.children.map((ln) => {
      const sourceNode = nodes.find((n) => n.id === ln.id) || {};
      return { ...sourceNode, position: { x: ln.x ?? 0, y: ln.y ?? 0 } };
    });
    return { nodes: layoutedNodes, edges };
  } catch (err) {
    const fallback = nodes.map((node, i) => ({
      ...node,
      position: { x: (i % 3) * GRID_SPACING + 40, y: Math.floor(i / 3) * GRID_SPACING + 40 },
    }));
    toast.warn("ELK layout failed, using fallback grid.");
    return { nodes: fallback, edges };
  }
};

export function useWordMapLayout(initialData, rfRef) {
  const { nodes: initialNodes = [], edges: initialEdges = [] } = initialData;
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    setIsReady(false);
    setError(null);
    const normNodes = normalizeNodes(initialNodes);
    if (!normNodes || normNodes.length === 0) {
      setNodes([]);
      setEdges([]);
      setIsReady(true);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const { nodes: ln, edges: le } = await getLayoutedElements(normNodes, initialEdges || []);
        if (!mounted) return;
        const finalNodes = (ln || []).map((n) => ({
          ...n,
          width: NODE_SIZE,
          height: NODE_SIZE,
          style: {
            ...(n.style || {}),
            width: `${NODE_SIZE}px`,
            height: `${NODE_SIZE}px`,
            borderRadius: "50%",
          },
          draggable: true,
          className: `${n.className || ""} word-node-circle`.trim(),
        }));
        setNodes(finalNodes);
        setEdges(le || []);
        setIsReady(true);
        setTimeout(() => rfRef.current?.fitView?.({ padding: 0.1 }), 80);
      } catch (err) {
        toast.error("Word map layout failed, displaying unarranged nodes.");
        setError(err?.message || "Layout failed");
        setNodes(normNodes);
        setEdges(initialEdges || []);
        setIsReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
    // The hook now relies on initialData (from the group prop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData.nodes.length, initialData.edges.length]);

  const markSelectedNode = useCallback(
    (nodeId) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            const s = { ...(n.style || {}) };
            s.border = "3px solid var(--primary-600)";
            s.boxShadow = "0 8px 30px rgba(219,39,119,0.18)";
            return { ...n, style: s, className: `${n.className || ""} selected`.trim() };
          }
          const cleaned = { ...(n.style || {}) };
          if (cleaned.border === "3px solid var(--primary-600)") {
            cleaned.border = "1px solid rgba(15,23,42,0.06)";
            cleaned.boxShadow = "0 6px 16px rgba(15,23,42,0.06)";
          }
          return {
            ...n,
            style: cleaned,
            className: (n.className || "").replace("selected", "").trim(),
          };
        })
      );
    },
    [setNodes]
  );

  return { nodes, setNodes, edges, setEdges, isReady, error, markSelectedNode };
}
