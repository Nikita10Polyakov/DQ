import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import EditableNode from '../components/EditableNode';
import { ReactFlowProvider } from 'reactflow';

const nodeTypes = { editable: EditableNode };
let id = 2; // Починаємо з 2, бо 1 — вже є
const getId = () => (id++).toString();

const initialNodes = [
  {
    id: '1',
    position: { x: 100, y: 100 },
    data: { label: 'Початкова сцена' },
    type: 'default',
  },
];

export default function StoryArcEditorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onNodeLabelChange = useCallback((id, newLabel) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: newLabel, onChange: onNodeLabelChange } }
          : node
      )
    );
  }, [setNodes]);

  const addNode = useCallback(
    (typeLabel) => {
      const newNode = {
        id: getId(),
        position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
        data: { label: typeLabel, onChange: onNodeLabelChange },
        type: 'editable',
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, onNodeLabelChange]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ padding: 10 }}>
        <button onClick={() => addNode('Сцена')}>+ Сцена</button>
        <button onClick={() => addNode('NPC')}>+ NPC</button>
        <button onClick={() => addNode('Подія')}>+ Подія</button>
      </div>

      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
  );
}
