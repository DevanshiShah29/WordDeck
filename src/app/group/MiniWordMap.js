// MiniWordMap.jsx

"use client";

import React, { useCallback, useRef, useEffect, useState } from "react";

// Library Imports
import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";
import { ZoomIn, ZoomOut, RefreshCcw, LockIcon, UnlockIcon } from "lucide-react";

// Helper function
import { transformSingleGroup } from "./utils";

// Component Imports
import * as CustomWordNodeModule from "./CustomWordNode";
import * as CustomRelationshipEdgeModule from "./CustomRelationshipEdge";
import { useWordMapLayout } from "./useWordMapLayout";
import { useMapEvents } from "./useMapEvents";
import Button from "@/components/buttons/Button";

const CustomWordNode =
  CustomWordNodeModule.default ?? CustomWordNodeModule.CustomWordNode ?? CustomWordNodeModule;
const CustomRelationshipEdge =
  CustomRelationshipEdgeModule.default ??
  CustomRelationshipEdgeModule.CustomRelationshipEdge ??
  CustomRelationshipEdgeModule;

const nodeTypes = { wordNode: CustomWordNode };
const edgeTypes = { similar: CustomRelationshipEdge, opposite: CustomRelationshipEdge };

export default function MiniWordMap({ group = [], onNodeSelect = () => {}, description = "" }) {
  const mapIdRef = useRef(`map-${Math.random().toString(36).slice(2, 9)}`);
  const mapId = mapIdRef.current;
  const rfRef = useRef(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [locked, setLocked] = useState(true);

  // DRAG HOOKS
  const dragRafRef = useRef(null);
  const pendingPositionsRef = useRef(new Map());

  // Custom Hooks
  const initialData = transformSingleGroup(group || []);
  const { nodes, setNodes, edges, isReady, error, markSelectedNode } = useWordMapLayout(
    initialData,
    rfRef
  );
  useMapEvents(mapId, setSelectedNodeId, setNodes);

  // DRAG HANDLERS
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

  const toggleLock = () => setLocked((s) => !s);

  const groupTitle = Array.isArray(group) && group.length > 0 ? group[0] : "Group";

  return (
    <div className="mini-map-container relative">
      <div className="mini-map-header flex flex-col md:flex-row items-start md:items-center justify-between mb-3">
        <h3 className="mini-map-title text-sm font-semibold mb-2 md:mb-0">
          {groupTitle} : {description}
        </h3>

        <div className="mini-map-toolbar inline-flex items-center gap-2 flex-wrap w-full md:w-auto md:justify-start justify-between">
          <Button
            varient="transparent"
            onClick={zoomIn}
            className="mini-map-btn w-1/5 md:w-auto"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            varient="transparent"
            onClick={zoomOut}
            className="mini-map-btn w-1/5 md:w-auto"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <Button
            varient="transparent"
            onClick={resetView}
            className="mini-map-btn w-1/5 md:w-auto"
            aria-label="Reset"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>

          <Button
            varient="transparent"
            onClick={toggleLock}
            className="mini-map-btn w-1/5 md:w-auto"
            aria-pressed={locked}
            title={locked ? "Unlock canvas" : "Lock canvas"}
          >
            {locked ? <LockIcon className="h-4 w-4" /> : <UnlockIcon className="h-4 w-4" />}
          </Button>
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
            zoomOnScroll={!locked}
            panOnScroll={!locked}
            zoomOnPinch={!locked}
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
            {error ? <span>Error: {error}</span> : <span>Calculating layout...</span>}{" "}
          </div>
        )}

        {locked && (
          <div
            className="absolute inset-0 z-40 bg-[var(--primary-50)] opacity-20"
            aria-hidden="true"
          />
        )}

        <div className="map-status absolute bottom-2 left-2 text-xs text-slate-600 bg-white/80 rounded-md px-2 py-1 shadow-sm">
          {isReady ? `Nodes: ${nodes.length}` : "Loading..."}
        </div>
      </div>
    </div>
  );
}
