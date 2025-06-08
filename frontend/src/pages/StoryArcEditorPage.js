import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import EditableNode from '../components/EditableNode';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStoryArc } from '../api/storyarc';

const nodeTypes = { editable: EditableNode };
let id = 2;
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
  const { id: arcId } = useParams();
  const navigate = useNavigate();
  const [arcTitle, setArcTitle] = useState('');

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onNodeLabelChange = useCallback(
    (id, newLabel) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: newLabel,
                  onChange: onNodeLabelChange,
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  const addNode = useCallback(
    (typeLabel) => {
      const newNode = {
        id: getId(),
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100,
        },
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

  useEffect(() => {
  const loadArc = async () => {
    try {
      const data = await fetchStoryArc(arcId);
      console.log('✅ Отримано арку:', data);
      setArcTitle(data.title);
    } catch (error) {
      console.error('❌ Не вдалося завантажити арку');
    }
  };

  loadArc();
}, [arcId]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={toolbarStyle}>
        <button
          onClick={() => navigate('/story-arcs')}
          style={backButtonStyle}
        >
          ← Назад
        </button>

        <button style={toolbarButton} onClick={() => addNode('Сцена')}>
          + Сцена
        </button>
        <button style={toolbarButton} onClick={() => addNode('NPC')}>
          + NPC
        </button>
        <button style={toolbarButton} onClick={() => addNode('Подія')}>
          + Подія
        </button>

        <span style={arcInfoStyle}>
          🎯 {arcTitle ? arcTitle : 'Завантаження...'}
        </span>
      </div>

      <div style={{ flex: 1 }}>
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
    </div>
  );
}

// === СТИЛІ ===

const toolbarStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 1rem',
  background: '#f8f9fa',
  borderBottom: '1px solid #ccc',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const toolbarButton = {
  padding: '0.5rem 0.9rem',
  background: '#6c5ce7',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
};

const backButtonStyle = {
  ...toolbarButton,
  background: '#b2bec3',
};

const arcInfoStyle = {
  marginLeft: 'auto',
  fontStyle: 'italic',
  color: '#636e72',
  fontSize: '1rem',
};
