import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ReactFlow, Panel, useKeyPress, useStore, type Node } from '@xyflow/react';

const nodes: Node[] = [
  { id: '1', position: { x: 100, y: 150 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 350, y: 150 }, data: { label: 'Node 2' } },
  { id: '3', position: { x: 100, y: 300 }, data: { label: 'Node 3' } },
];
const multiSelectionKeyCode = ['Control', 'Meta'];

function SelectionState() {
  const active = useStore((state) => state.multiSelectionActive);

  return <output data-testid="multi-selection-active">{String(active)}</output>;
}

function KeyPressProbe({ target }: { target: Document | HTMLElement | null }) {
  const pressed = useKeyPress('x', { target });

  return <output data-testid="key-pressed">{String(pressed)}</output>;
}

function Flow({ ownerDocument, name }: { ownerDocument: Document; name: string }) {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const [restricted, setRestricted] = useState(false);
  const [probeMounted, setProbeMounted] = useState(true);

  return (
    <div data-testid={name} style={{ width: '100%', height: 550 }}>
      <ReactFlow
        defaultNodes={nodes}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomActivationKeyCode="z"
        multiSelectionKeyCode={multiSelectionKeyCode}
      >
        <Panel position="top-left">
          <SelectionState />
          <input aria-label="Node name" defaultValue="Keep me" />
          <div contentEditable suppressContentEditableWarning role="textbox" aria-label="Node notes">
            Keep notes
          </div>
          <button onClick={() => setRestricted((value) => !value)}>Toggle key target</button>
          <button onClick={() => setProbeMounted((value) => !value)}>Toggle key probe</button>
          {probeMounted && <KeyPressProbe target={restricted ? target : ownerDocument} />}
          <div ref={setTarget} tabIndex={0} data-testid="key-target">
            Custom keyboard target
          </div>
          <div tabIndex={0} data-testid="other-target">
            Outside keyboard target
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function Popout() {
  const [popup, setPopup] = useState<Window | null>(null);

  useEffect(() => {
    return () => popup?.close();
  }, [popup]);

  const openPopup = () => {
    const nextPopup = window.open('', 'react-flow-popout', 'width=900,height=650');

    if (!nextPopup) {
      return;
    }

    nextPopup.document.title = 'React Flow popout';
    nextPopup.document.body.style.margin = '0';
    // Portals retain the opener's React context, but styles belong to the new document.
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach((style) => {
      nextPopup.document.head.appendChild(style.cloneNode(true));
    });
    setPopup(nextPopup);
  };

  return (
    <>
      <button onClick={openPopup}>Open popout</button>
      <Flow ownerDocument={document} name="inline-flow" />
      {popup && createPortal(<Flow ownerDocument={popup.document} name="popout-flow" />, popup.document.body)}
    </>
  );
}
