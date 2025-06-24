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
import NodeSidebar from '../components/NodeSidebar';
import { useReactFlow } from 'reactflow';
import { ReactFlowProvider } from 'reactflow';

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

const npcTemplates = [
  { label: '🧙 Чаклунка', type: 'npc', description: 'Таємнича чаклунка з темного лісу' },
  { label: '🛡️ Лицар', type: 'npc', description: 'Шляхетний лицар, який шукає істину' },
  { label: '🧪 Алхімік', type: 'npc', description: 'Дивакуватий алхімік, що торгує зіллям' },
  { label: '🧝 Ельф-лучник', type: 'npc', description: 'Мовчазний снайпер із лісів' },
  { label: '💰 Торговець', type: 'npc', description: 'Гном, що торгує дивними артефактами' },
  { label: '🕵️ Шпигун', type: 'npc', description: 'Зрадник, який працює на обидві сторони' },
  { label: '🪓 Варвар', type: 'npc', description: 'Сильний, але прямолінійний воїн' },
];

const sceneTemplates = [
  { label: '🏰 Таверна', type: 'scene', description: 'Місце, де починаються пригоди' },
  { label: '🕍 Храм', type: 'scene', description: 'Священне місце з таємницями' },
  { label: '🕸️ Підземелля', type: 'scene', description: 'Темний лабіринт із пастками' },
  { label: '🏞️ Ринок', type: 'scene', description: 'Жваве місце з NPC та товаром' },
  { label: '🗼 Вежа мага', type: 'scene', description: 'Локація з магічними головоломками' },
  { label: '⛺ Лісова галявина', type: 'scene', description: 'Мирне місце... або ні?' },
  { label: '🏚️ Покинута хата', type: 'scene', description: 'Щось тут не так...' },
];

const eventTemplates = [
  { label: '⚔️ Засідка', type: 'event', description: 'Несподівана атака бандитів' },
  { label: '❓ Зникнення', type: 'event', description: 'NPC зникає без сліду' },
  { label: '🩸 Зрада', type: 'event', description: 'Союзник переходить на інший бік' },
  { label: '🧪 Хвороба', type: 'event', description: 'Починається епідемія в місті' },
  { label: '🔥 Вибух', type: 'event', description: 'Вибух руйнує локацію або портал' },
  { label: '🌒 Ритуал', type: 'event', description: 'Темна магія починає діяти' },
  { label: '🎭 Двійник', type: 'event', description: 'Хтось прикидається іншим' },
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
  const [selectedNode, setSelectedNode] = useState(null);

  const [showTemplateList, setShowTemplateList] = useState(false);

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const restoreNodeCallbacks = (nodeList) =>
    nodeList.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onChange: onNodeLabelChange,
        onFocus: () => setIsEditingLabel(true),
        onBlur: () => setIsEditingLabel(false),
      },
    }));


    const handleAddTemplate = (template) => {
      const newNode = {
        id: getId(),
        type: 'editable',
        position: { x: 250, y: 250 },
        data: {
          label: template.label,
          type: template.type,
          details: {
            description: template.description,
          },
          onChange: onNodeLabelChange,
          onFocus: () => setIsEditingLabel(true),
          onBlur: () => setIsEditingLabel(false),
        },
      };
      pushToHistory();
      setNodes((nds) => [...nds, newNode]);
      setShowTemplateList(false);
    };

  const pushToHistory = (currentNodes = nodes, currentEdges = edges) => {
    const snapshot = {
      nodes: deepClone(currentNodes),
      edges: deepClone(currentEdges),
    };

    if (snapshot.nodes.length === 0 && snapshot.edges.length === 0) {
      console.log('⛔ Пропущено: порожній граф');
      return;
    }

    console.log('✅ Додано в історію:', snapshot);
    setHistory((prev) => [...prev, snapshot]);
    setRedoStack([]);
  };

  const onNodeLabelChange = useCallback((id, newLabel) => {
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
  }, [setNodes]);

  const addNode = useCallback((typeLabel) => {
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

    setNodes((nds) => {
      const updated = [...nds, newNode];
      pushToHistory(updated, edges);
      return updated;
    });
  }, [setNodes, edges, onNodeLabelChange]);

  const onConnect = useCallback((params) => {
    pushToHistory();
    setEdges((eds) =>
      addEdge({
        ...params,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#636e72',
        },
      }, eds)
    );
  }, [setEdges]);

  const onEdgesDelete = useCallback((edgesToRemove) => {
    pushToHistory();
    setEdges((eds) => eds.filter((e) => !edgesToRemove.some((r) => r.id === e.id)));
  }, [setEdges]);

  const onNodeDataChange = (id, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...newData,
                onChange: onNodeLabelChange,
                onFocus: () => setIsEditingLabel(true),
                onBlur: () => setIsEditingLabel(false),
              },
            }
          : node
      )
    );
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setRedoStack((prev) => [...prev, { nodes: deepClone(nodes), edges: deepClone(edges) }]);
    setNodes(restoreNodeCallbacks(last.nodes));
    setEdges(last.edges);
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((prev) => [...prev, { nodes: deepClone(nodes), edges: deepClone(edges) }]);
    setNodes(restoreNodeCallbacks(next.nodes));
    setEdges(next.edges);
    setRedoStack((prev) => prev.slice(0, -1));
  };

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

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        setArcTitle(imported.title || '');
        setNewTitle(imported.title || '');
        setNodes(imported.nodes || []);
        setEdges(imported.edges || []);
      } catch (error) {
        console.error('Помилка імпорту JSON:', error);
        alert('❌ Некоректний файл JSON');
      }
    };
    reader.readAsText(file);
  };

  const handleExportJSON = () => {
  const data = {
    title: arcTitle,
    author: 'unknown',
    nodes,
    edges,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${arcTitle || 'story-arc'}.json`;
  link.click();

  URL.revokeObjectURL(url);
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
      const activeTag = document.activeElement?.tagName;
      const isTyping = ['INPUT', 'TEXTAREA'].includes(activeTag);
      if (isTyping || isEditingLabel) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        pushToHistory();

        if (selectedEdges.length > 0) {
          setEdges((eds) =>
            eds.filter((e) => !selectedEdges.some((sel) => sel.id === e.id))
          );
        }

        if (selectedNodes.length > 0) {
          const nodeIds = selectedNodes.map((n) => n.id);
          setNodes((nds) => nds.filter((n) => !nodeIds.includes(n.id)));
          setEdges((eds) =>
            eds.filter((e) => !nodeIds.includes(e.source) && !nodeIds.includes(e.target))
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodes, selectedEdges, isEditingLabel]);


  useEffect(() => {
  if (!selectedNode) return;

  const exists = nodes.some((n) => n.id === selectedNode.id);
  if (!exists) {
    setSelectedNode(null);
  }
}, [nodes, selectedNode]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={toolbarStyle}>
        <button onClick={() => navigate('/story-arcs')} style={backButtonStyle}>← Назад</button>
        <button style={historyButton} onClick={handleUndo} disabled={history.length === 0}>↩️ Undo</button>
        <button style={historyButton} onClick={handleRedo} disabled={redoStack.length === 0}>↪️ Redo</button>
        <button style={creationButton } onClick={() => addNode('Сцена')}>📘 Сцена</button>
        <button style={creationButton} onClick={() => addNode('NPC')}>🧙 NPC</button>
        <button style={creationButton} onClick={() => addNode('Подія')}>🎲 Подія</button>
        <button style={templateButton} onClick={() => setShowTemplateList((prev) => !prev)}>➕ З шаблону</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button style={actionButton } onClick={saveGraph}>💾 Зберегти граф</button>
          <button style={exportButtonStyle } onClick={handleExportJSON}>📥 Експорт у JSON</button>
          <label htmlFor="jsonUpload" style={importButtonStyle}>
            📤 Імпорт з JSON
          </label>
          <input
            id="jsonUpload"
            type="file"
            accept="application/json"
            onChange={handleImportJSON}
            style={{ display: 'none' }}
          />
        </div>
        <div style={arcInfoStyle}>
          {isEditingTitle ? (
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
              autoFocus
              style={titleInputStyle}
            />
          ) : (
            <span onClick={() => setIsEditingTitle(true)} style={{ cursor: 'pointer' }}>
              🎯 {arcTitle || 'Без назви'}
            </span>
          )}
        </div>
      </div>
      {showTemplateList && (
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '1rem',
          background: '#fff',
          border: '1px solid #ccc',
          padding: '0.5rem',
          zIndex: 10,
          maxHeight: '300px',
          overflowY: 'auto',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
        }}>
          <strong>🧙‍♂️ NPC</strong>
          {npcTemplates.map((tpl, idx) => (
            <div key={`npc-${idx}`} style={{ cursor: 'pointer', padding: '4px 8px' }} onClick={() => handleAddTemplate(tpl)}>
              {tpl.label} — {tpl.description}
            </div>
          ))}
          <strong>🏞️ Сцени</strong>
          {sceneTemplates.map((tpl, idx) => (
            <div key={`scene-${idx}`} style={{ cursor: 'pointer', padding: '4px 8px' }} onClick={() => handleAddTemplate(tpl)}>
              {tpl.label} — {tpl.description}
            </div>
          ))}
          <strong>🔥 Події</strong>
          {eventTemplates.map((tpl, idx) => (
            <div key={`event-${idx}`} style={{ cursor: 'pointer', padding: '4px 8px' }} onClick={() => handleAddTemplate(tpl)}>
              {tpl.label} — {tpl.description}
            </div>
          ))}
        </div>
      )}
      <ReactFlowProvider>
        <div style={{ flex: 1, position: 'relative' }} tabIndex={0}>
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
            onNodeClick={(event, node) => {
              setSelectedNode(node);
            }}
            onSelectionChange={({ nodes, edges }) => {
              setSelectedNodes(nodes);
              setSelectedEdges(edges);
            }}
          >
            <Controls />
            <MiniMap />
            <Background />
          </ReactFlow>
          <NodeSidebar
            node={selectedNode}
            onChange={onNodeDataChange}
            onClose={() => setSelectedNode(null)}
            onAnyFieldFocus={() => setSelectedNodes([])}
          />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

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
  backgroundColor: '#b2bec3',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '6px 12px',
  cursor: 'pointer',
  fontWeight: 'bold'
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

const exportButtonStyle = {
  backgroundColor: '#b39a98',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '6px 12px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const creationButton = {
  backgroundColor: '#6c5ce7',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '6px 12px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const historyButton = {
  backgroundColor: '#9fc6ed',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '6px 12px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const actionButton = {
  backgroundColor: '#4fab69',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '6px 12px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const templateButton = {
  backgroundColor: '#b099e8',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '6px 12px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const importButtonStyle = {
  backgroundColor: '#b39a98',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '4px 10px',
  cursor: 'pointer',
  fontWeight: 'bold'
};