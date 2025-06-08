import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import EditableNode from '../components/EditableNode';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStoryArc, updateStoryArc } from '../api/storyarc';

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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedEdges, setSelectedEdges] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);

  const [isEditingLabel, setIsEditingLabel] = useState(false);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  
  const onNodeLabelChange = useCallback(
  (id, newLabel) => {
    pushToHistory();
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                label: newLabel,
                onChange: onNodeLabelChange,
                onFocus: () => setIsEditingLabel(true),
                onBlur: () => setIsEditingLabel(false),
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
      pushToHistory(); // 💾 Зберігаємо перед зміною
      const type = typeLabel === 'Сцена' ? 'scene' : typeLabel === 'NPC' ? 'npc' : 'event';
      const newNode = {
        id: getId(),
        position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
        data: {
          label: typeLabel,
          type,
          onChange: onNodeLabelChange,
          onFocus: () => setIsEditingLabel(true),
          onBlur: () => setIsEditingLabel(false),
        },
        type: 'editable',
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, onNodeLabelChange]
  );

  const onConnect = useCallback(
    (params) => {
      pushToHistory();
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#636e72',
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onEdgesDelete = useCallback(
    (edgesToRemove) => {
      pushToHistory();
      setEdges((eds) =>
        eds.filter((e) => !edgesToRemove.some((r) => r.id === e.id))
      );
    },
    [setEdges]
  );

  const saveTitle = async () => {
    try {
      if (newTitle.trim() && newTitle !== arcTitle) {
        await updateStoryArc(arcId, { title: newTitle });
        setArcTitle(newTitle);
      }
    } catch (error) {
      console.error('Помилка оновлення назви арки:', error);
    } finally {
      setIsEditingTitle(false);
    }
  };

  const saveGraph = async () => {
    try {
      await updateStoryArc(arcId, { graph_json: { nodes, edges } });
      alert('Граф збережено ✅');
    } catch (error) {
      console.error('Помилка збереження графа:', error);
      alert('❌ Не вдалося зберегти граф');
    }
  };

  const pushToHistory = () => {
    setHistory((prev) => [...prev, { nodes, edges }]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const last = history[history.length - 1];
    setRedoStack((prev) => [...prev, { nodes, edges }]); // 💾 поточне в redo

    setNodes(last.nodes);
    setEdges(last.edges);
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const next = redoStack[redoStack.length - 1];
    setHistory((prev) => [...prev, { nodes, edges }]); // поточне в history

    setNodes(next.nodes);
    setEdges(next.edges);
    setRedoStack((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    const loadArc = async () => {
      try {
        const data = await fetchStoryArc(arcId);
        setArcTitle(data.title);
        setNewTitle(data.title);

        if (data.graph_json) {
          setNodes(data.graph_json.nodes || []);
          setEdges(data.graph_json.edges || []);
        } else {
          setNodes(initialNodes);
          setEdges([]);
        }
      } catch (error) {
        console.error('Помилка завантаження арки:', error);
      }
    };

    loadArc();
  }, [arcId]);

  useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && !isEditingLabel) {
      pushToHistory();
      // Видалення стрілок
      if (selectedEdges.length > 0) {
        setEdges((eds) =>
          eds.filter((e) => !selectedEdges.some((sel) => sel.id === e.id))
        );
      }

      // Видалення вузлів
      if (selectedNodes.length > 0) {
        const nodeIds = selectedNodes.map((n) => n.id);
        setNodes((nds) => nds.filter((n) => !nodeIds.includes(n.id)));
        setEdges((eds) =>
          eds.filter(
            (e) => !nodeIds.includes(e.source) && !nodeIds.includes(e.target)
          )
        );
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [selectedNodes, selectedEdges, setNodes, setEdges]);

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Delete' && selectedEdges.length > 0) {
      setEdges((eds) =>
        eds.filter((e) => !selectedEdges.some((sel) => sel.id === e.id))
      );
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [selectedEdges, setEdges]);


  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={toolbarStyle}>
        <button onClick={() => navigate('/story-arcs')} style={backButtonStyle}>
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

        <button style={toolbarButton} onClick={handleUndo} disabled={history.length === 0}>
          ↩️ Undo
        </button>

        <button style={toolbarButton} onClick={handleRedo} disabled={redoStack.length === 0}>
          ↪️ Redo
        </button>

        <button style={toolbarButton} onClick={saveGraph}>
          💾 Зберегти граф
        </button>

        <div style={arcInfoStyle}>
          {isEditingTitle ? (
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveTitle();
              }}
              autoFocus
              style={titleInputStyle}
            />
          ) : (
            <span
              onClick={() => setIsEditingTitle(true)}
              style={{ cursor: 'pointer' }}
            >
              🎯 {arcTitle || 'Без назви'}
            </span>
          )}
        </div>
      </div>

      <div style={{ flex: 1 }} tabIndex={0}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgesDelete={onEdgesDelete}
          onConnect={onConnect}
          fitView
          selectNodesOnDrag={true}
          nodesDraggable={true}
          edgesUpdatable={true}
          onSelectionChange={({ nodes, edges }) => {
            setSelectedNodes(nodes);
            setSelectedEdges(edges);
          }}

        >
          <Controls />
          <MiniMap />
          <Background />
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
};

const backButtonStyle = {
  ...toolbarButton,
  background: '#b2bec3',
};

const arcInfoStyle = {
  marginLeft: 'auto',
  fontSize: '1rem',
  color: '#636e72',
};

const titleInputStyle = {
  fontSize: '1rem',
  padding: '0.25rem 0.5rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
  width: '200px',
};
