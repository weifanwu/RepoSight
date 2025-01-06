"use client";
import React, { useRef, useEffect, useState } from "react";
import { useFileTree } from "@/context/treeContext";
import * as d3 from "d3";
import "./index.css";

interface AppProps {
  hierarchy?: HierarchyNode;
}

// React component for rendering a collapsible tree diagram using D3
const App: React.FC<AppProps> = ({ hierarchy }) => {
  const treeRef = useRef<HTMLDivElement>(null);

  const [popupData, setPopupData] = useState<{ x: number; y: number } | null>(null);
  const [popupSummary, setPopupSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [closePopup, setClosePopup] = useState<boolean>(false);
  const { readme, fileTree } = useFileTree();

  useEffect(() => {
    if (!hierarchy || !treeRef.current) return;

    d3.select(treeRef.current).selectAll("*").remove();

    const width = 928;
    const marginTop = 70;
    const marginRight = 10;
    const marginBottom = 10;
    const marginLeft = 40;

    const dx = 10;
    const root = d3.hierarchy(hierarchy);

    const dy = (width - marginRight - marginLeft) / (1 + root.height);

    const tree = d3.tree<HierarchyNode>().nodeSize([dx, dy]);
    const diagonal = d3.linkHorizontal<d3.HierarchyPointLink<HierarchyNode>, d3.HierarchyPointNode<HierarchyNode>>()
      .x(d => d.y)
      .y(d => d.x);

    const svg = d3.select(treeRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", dx)
      .attr("viewBox", [-marginLeft, -marginTop, width, dx])
      .style("max-width", "100%")
      .style("height", "auto")
      .style("font", "10px sans-serif")
      .style("user-select", "none");

    const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    root.x0 = dy / 2;
    root.y0 = 0;

    const update = (source: d3.HierarchyPointNode<HierarchyNode>) => {
      const duration = 250;

      const nodes = root.descendants().reverse();
      const links = root.links();

      tree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + marginTop + marginBottom;

      svg.transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", [-marginLeft, left.x - marginTop, width, height]);

      const node = gNode.selectAll("g").data(nodes, d => d.id);

      const nodeEnter = node.enter()
        .append("g")
        .attr("transform", () => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          const svgRect = (event.target as SVGElement).getBoundingClientRect();
          const x = svgRect.left;
          const y = svgRect.top + window.scrollY;
          const fileName = d.data.name || "No text available";
          setLoading(true);
          setPopupData({ x, y });
          const children = [...(fileTree.get(fileName) || [])].join(" ");
          const prompt = JSON.stringify({
            prompt: `you are a repo reader use below information to summary what does this folder called: "${fileName}" do in one paragraph, limited to 100 words. Readme file: ${readme}, children files and folder names: ${children}.`,
          });

          fetch("/api/ai/reader", {
            method: "POST",
            body: prompt,
          })
            .then(response => {
              if (!response.ok) {
                throw new Error("Failed to fetch data from /api/ai/reader");
              }
              return response.json();
            })
            .then(data => {
              const message = data.message;
              setLoading(false);
              setClosePopup(true);
              setPopupSummary(message);
            })
            .catch(error => {
              console.error("Error in onNodeClick:", error);
              setLoading(false);
            });
        });

      nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => (d._children ? "#555" : "#999"));

      nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => (d._children ? -6 : 6))
        .attr("text-anchor", d => (d._children ? "end" : "start"))
        .text(d => d.data.name)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node.exit().transition()
        .duration(duration)
        .remove()
        .attr("transform", () => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      const link = gLink.selectAll("path").data(links, d => d.target.id);

      const linkEnter = link.enter().append("path")
        .attr("d", () => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      link.merge(linkEnter).transition()
        .duration(duration)
        .attr("d", diagonal);

      link.exit().transition()
        .duration(duration)
        .remove()
        .attr("d", () => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      root.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    };

    update(root);

  }, [hierarchy]);

  return (
    <div ref={treeRef} style={{ width: "100%", height: "100%", border: "1px solid #ccc", position: "relative" }}>
      {popupData && closePopup && (
        <div
          style={{
            position: "absolute",
            top: popupData.y + 430,
            left: popupData.x,
            transform: "translate(-50%, -100%)",
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "15px",
            zIndex: 1000,
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
            maxWidth: "280px",
            wordWrap: "break-word",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>{popupSummary}</p>
          <button onClick={() => setClosePopup(false)} style={{ marginTop: "12px", width: "100%", backgroundColor: "#007bff", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "6px" }}>
            Close
          </button>
        </div>
      )}
      {loading && popupData && (
        <div style={{ position: "absolute", top: popupData.y, left: popupData.x, transform: "translate(-50%, -50%)", zIndex: 1000 }}>
          <div>Loading...</div>
        </div>
      )}
    </div>
  );
};

export default App;