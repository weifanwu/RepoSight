"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "./index.css";

interface AppProps {
  hierarchy?: HierarchyNode;
}

const App: React.FC<AppProps> = ({ hierarchy }) => {
  const treeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hierarchy || !treeRef.current) return;

    // Clear previous tree (if any)
    treeRef.current.innerHTML = "";

    const width = 928;
    const marginTop = 10;
    const marginRight = 10;
    const marginBottom = 10;
    const marginLeft = 40;

    const root = d3.hierarchy(hierarchy);
    const dx = 10;
    const dy = (width - marginRight - marginLeft) / (1 + root.height);

    const tree = d3.tree().nodeSize([dx, dy]);
    const diagonal = d3
      .linkHorizontal<d3.HierarchyPointLink<HierarchyNode>, HierarchyNode>()
      .x((d) => d.y)
      .y((d) => d.x);

    const svg = d3
      .select(treeRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", dx)
      .attr("viewBox", [-marginLeft, -marginTop, width, dx])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif; user-select: none;");

    const gLink = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = svg.append("g").attr("cursor", "pointer").attr("pointer-events", "all");

    function update(event: any, source: any) {
      const duration = event?.altKey ? 2500 : 250;
      const nodes = root.descendants().reverse();
      const links = root.links();

      tree(root);

      let left = root;
      let right = root;
      root.eachBefore((node) => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + marginTop + marginBottom;

      const transition = svg
        .transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", [-marginLeft, left.x - marginTop, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

      const node = gNode.selectAll("g").data(nodes, (d: any) => d.id);

      const nodeEnter = node
        .enter()
        .append("g")
        .attr("transform", (d: any) => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event: any, d: any) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        });

      nodeEnter
        .append("circle")
        .attr("r", 2.5)
        .attr("fill", (d: any) => (d._children ? "#555" : "#999"))
        .attr("stroke-width", 10);

      nodeEnter
        .append("text")
        .attr("dy", "0.31em")
        .attr("x", (d: any) => (d._children ? -6 : 6))
        .attr("text-anchor", (d: any) => (d._children ? "end" : "start"))
        .text((d: any) => d.data.name)
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white")
        .attr("paint-order", "stroke");

      const nodeUpdate = node
        .merge(nodeEnter)
        .transition(transition)
        .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      const nodeExit = node
        .exit()
        .transition(transition)
        .remove()
        .attr("transform", (d: any) => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      const link = gLink.selectAll("path").data(links, (d: any) => d.target.id);

      const linkEnter = link
        .enter()
        .append("path")
        .attr("d", (d: any) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      link.merge(linkEnter).transition(transition).attr("d", diagonal);

      link
        .exit()
        .transition(transition)
        .remove()
        .attr("d", (d: any) => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      root.eachBefore((d: any) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d: any, i: number) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name.length !== 7) d.children = null;
    });
    
    update(null, root);
    
  }, [hierarchy]);

  return <div ref={treeRef} style={{ height: "800px" }} />;
};

export default App;
