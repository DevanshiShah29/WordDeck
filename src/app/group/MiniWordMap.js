// MiniWordMap.jsx

"use client";

import React, { useCallback, useRef, useEffect, useState } from "react";
import ReactFlow, { Background } from "reactflow";
import { transformSingleGroup } from "./utils";
import * as CustomWordNodeModule from "./CustomWordNode";
import * as CustomRelationshipEdgeModule from "./CustomRelationshipEdge";
import { useWordMapLayout } from "./useWordMapLayout";
import { useMapEvents } from "./useMapEvents";
import "reactflow/dist/style.css";

const CustomWordNode =
  CustomWordNodeModule.default ?? CustomWordNodeModule.CustomWordNode ?? CustomWordNodeModule;
const CustomRelationshipEdge =
  CustomRelationshipEdgeModule.default ??
  CustomRelationshipEdgeModule.CustomRelationshipEdge ??
  CustomRelationshipEdgeModule;

const nodeTypes = { wordNode: CustomWordNode };
const edgeTypes = { similar: CustomRelationshipEdge, opposite: CustomRelationshipEdge };

export default function MiniWordMap({ group = [], onNodeSelect = () => {} }) {
  // --- 1. Map ID and Refs ---
  const mapIdRef = useRef(`map-${Math.random().toString(36).slice(2, 9)}`);
  const mapId = mapIdRef.current;
  const rfRef = useRef(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // DRAG HOOKS (Moved back inside the component) ---
  const dragRafRef = useRef(null);
  const pendingPositionsRef = useRef(new Map());

  // Custom Hooks ---
  const initialData = transformSingleGroup(group || []);
  const { nodes, setNodes, edges, isReady, error, markSelectedNode } = useWordMapLayout(
    initialData,
    rfRef
  );
  useMapEvents(mapId, setSelectedNodeId, setNodes);

  //  DRAG HANDLERS (Now correctly defined using useCallback) ---

  const onNodeDragStart = useCallback(
    (_, node) => {
      setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, dragging: true } : n)));
    },
    [setNodes]
  );

  const onNodeDrag = useCallback(
    (_, node) => {
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
    },
    [setNodes]
  );

  const onNodeDragStop = useCallback(
    (_, node) => {
      if (dragRafRef.current) {
        cancelAnimationFrame(dragRafRef.current);
        dragRafRef.current = null;
      }
      pendingPositionsRef.current.delete(node.id);
      setNodes((nds) =>
        nds.map((n) => (n.id === node.id ? { ...n, position: node.position, dragging: false } : n))
      );
    },
    [setNodes]
  );

  // Clean up drag RAF on unmount
  useEffect(() => {
    return () => {
      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
    };
  }, []);

  const handleNodeClickInternal = useCallback(
    (evt, node) => {
      try {
        const nodeId = node?.id;
        const slug = node?.data?.slug ?? nodeId;
        const label = node?.data?.label ?? node?.data?.title;

        window.dispatchEvent(
          new CustomEvent("miniwordmap:clear-selection", { detail: { emitterId: mapId } })
        );
        markSelectedNode(nodeId);

        window.dispatchEvent(
          new CustomEvent("miniwordmap:open", { detail: { emitterId: mapId, nodeId, slug, label } })
        );
        onNodeSelect(label);
      } catch (err) {
        console.warn(err);
      }
    },
    [markSelectedNode, mapId, onNodeSelect]
  );

  const onInit = useCallback((instance) => {
    rfRef.current = instance;
  }, []);

  // Toolbar controls...
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
            // Pass the corrected useCallback handlers directly
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
