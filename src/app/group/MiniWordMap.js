"use client";

import React, { useLayoutEffect, useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, { Background } from "reactflow";
import ELK from "elkjs/lib/elk.bundled.js";
import { transformSingleGroup } from "./utils";
import * as CustomWordNodeModule from "./CustomWordNode";
import * as CustomRelationshipEdgeModule from "./CustomRelationshipEdge";
import "reactflow/dist/style.css";

const elk = new ELK();
const CustomWordNode =
  CustomWordNodeModule.default ?? CustomWordNodeModule.CustomWordNode ?? CustomWordNodeModule;
const CustomRelationshipEdge =
  CustomRelationshipEdgeModule.default ??
  CustomRelationshipEdgeModule.CustomRelationshipEdge ??
  CustomRelationshipEdgeModule;

const nodeTypes = { wordNode: CustomWordNode };
const edgeTypes = { similar: CustomRelationshipEdge, opposite: CustomRelationshipEdge };

const NODE_SIZE = 88;
const GRID_SPACING = 240;

const capitalizeLabel = (raw) =>
  (raw || "")
    .toString()
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

const getLayoutedElements = async (nodes, edges) => {
  if (!nodes || nodes.length === 0) return { nodes: [], edges: [] };
  try {
    const graph = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "force",
        "elk.force.quality": "quality",
        "elk.spacing.nodeNode": "80",
        "elk.spacing.edgeNode": "30",
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
    console.warn("ELK layout failed, using fallback grid:", err);
    return { nodes: fallback, edges };
  }
};

export default function MiniWordMap({ group = [], onNodeSelect = () => {} }) {
  const mapIdRef = useRef(`map-${Math.random().toString(36).slice(2, 9)}`);
  const mapId = mapIdRef.current;

  const { nodes: initialNodes = [], edges: initialEdges = [] } = transformSingleGroup(group || []);

  const normalizeNodes = (list) =>
    (list || []).map((n, idx) => {
      const rawLabel =
        n.data?.label ?? n.data?.title ?? n.label ?? n.title ?? n.id ?? `node-${idx}`;
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

  const [nodes, setNodes] = useState(normalizeNodes(initialNodes));
  const [edges, setEdges] = useState(initialEdges || []);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const rfRef = useRef(null);
  const dragRafRef = useRef(null);
  const pendingPositionsRef = useRef(new Map());
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // drag batching
  const onNodeDragStart = useCallback((_, node) => {
    setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, dragging: true } : n)));
  }, []);

  const onNodeDrag = useCallback((_, node) => {
    pendingPositionsRef.current.set(node.id, node.position);
    if (dragRafRef.current == null) {
      dragRafRef.current = requestAnimationFrame(() => {
        setNodes((nds) =>
          nds.map((n) => {
            const p = pendingPositionsRef.current.get(n.id);
            if (p) {
              pendingPositionsRef.current.delete(n.id);
              return { ...n, position: p };
            }
            return n;
          })
        );
        dragRafRef.current = null;
      });
    }
  }, []);

  const onNodeDragStop = useCallback((_, node) => {
    if (dragRafRef.current) {
      cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
    }
    pendingPositionsRef.current.delete(node.id);
    setNodes((nds) =>
      nds.map((n) => (n.id === node.id ? { ...n, position: node.position, dragging: false } : n))
    );
  }, []);

  useEffect(() => {
    return () => {
      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
    };
  }, []);

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
        setTimeout(() => rfRef.current?.fitView?.({ padding: 0.12 }), 80);
      } catch (err) {
        console.error("MiniWordMap layout error:", err);
        setError(err?.message || "Layout failed");
        setNodes(normNodes);
        setEdges(initialEdges || []);
        setIsReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  const onInit = useCallback((instance) => {
    rfRef.current = instance;
  }, []);

  // clear selection if another map opened a sidebar
  useEffect(() => {
    const handler = (e) => {
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
    window.addEventListener("miniwordmap:clear-selection", handler);
    return () => window.removeEventListener("miniwordmap:clear-selection", handler);
  }, [mapId]);

  // also clear when sidebar closed
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
  }, []);

  const markSelectedNode = useCallback(
    (nodeId) => {
      setSelectedNodeId(nodeId);
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            const s = { ...(n.style || {}) };
            s.border = "3px solid var(--primary-600, #db2777)";
            s.boxShadow = "0 8px 30px rgba(219,39,119,0.18)";
            return { ...n, style: s, className: `${n.className || ""} selected`.trim() };
          }
          const cleaned = { ...(n.style || {}) };
          if (cleaned.border === "3px solid var(--primary-600, #db2777)") {
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

  // node click dispatches open event and clears selection on other maps
  const handleNodeClickInternal = useCallback(
    (evt, node) => {
      try {
        const nodeId = node?.id;
        const slug = node?.data?.slug ?? nodeId;
        const label = node?.data?.label ?? node?.data?.title;
        // notify other maps to clear selection
        window.dispatchEvent(
          new CustomEvent("miniwordmap:clear-selection", { detail: { emitterId: mapId } })
        );
        markSelectedNode(nodeId);
        // debug:
        console.log("dispatching miniwordmap:open", { mapId, nodeId, slug, label });
        window.dispatchEvent(
          new CustomEvent("miniwordmap:open", { detail: { emitterId: mapId, nodeId, slug, label } })
        );
        // external callback
        onNodeSelect(label);
      } catch (err) {
        console.warn(err);
      }
    },
    [markSelectedNode, mapId, onNodeSelect]
  );

  const zoomIn = () => rfRef.current?.zoomIn?.();
  const zoomOut = () => rfRef.current?.zoomOut?.();
  const fitView = () => rfRef.current?.fitView?.();
  const resetView = () => {
    rfRef.current?.setViewport?.({ x: 0, y: 0, zoom: 1 });
    fitView();
  };

  const groupTitle = Array.isArray(group) && group.length > 0 ? group[0] : "Group";

  return (
    <div className="mini-map-container relative">
      <div className="mini-map-header flex items-center justify-between mb-3">
        <h3 className="mini-map-title text-sm font-semibold">{groupTitle}</h3>

        <div className="mini-map-toolbar inline-flex items-center gap-2">
          <button type="button" onClick={zoomIn} className="mini-map-btn" aria-label="Zoom in">
            ＋
          </button>
          <button type="button" onClick={zoomOut} className="mini-map-btn" aria-label="Zoom out">
            −
          </button>
          <button type="button" onClick={fitView} className="mini-map-btn" aria-label="Fit view">
            ⤢
          </button>
          <button type="button" onClick={resetView} className="mini-map-btn" aria-label="Reset">
            ⟲
          </button>
        </div>
      </div>

      <div className="mini-map-canvas" style={{ width: "100%", height: 370, position: "relative" }}>
        {isReady && nodes.length > 0 ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={onInit}
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            onNodeClick={handleNodeClickInternal}
            fitView
            minZoom={0.25}
            maxZoom={2}
            zoomOnScroll
            panOnScroll
            zoomOnPinch
            panOnDrag={false}
            nodesDraggable
            nodesConnectable={false}
            elementsSelectable
            attributionPosition="bottom-left"
            className="reactflow-custom"
            defaultEdgeOptions={{
              type: "smoothstep",
              markerStart: "none",
              markerEnd: "none",
            }}
          >
            <Background gap={8} size={5} color="#eef2ff" />
          </ReactFlow>
        ) : (
          <div className="map-loading">
            {" "}
            {error ? <span>Error: {error}</span> : <span>Calculating layout...</span>}{" "}
          </div>
        )}

        <div className="map-status absolute bottom-2 left-2 text-xs text-slate-600 bg-white/80 rounded-md px-2 py-1 shadow-sm">
          {isReady ? `Nodes: ${nodes.length}` : "pending"}
        </div>
      </div>
    </div>
  );
}
