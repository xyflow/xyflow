import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Define workflow node types
interface WorkflowNodeType {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: 'trigger' | 'action' | 'condition' | 'output';
  description: string;
}

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    icon: string;
    status?: 'idle' | 'running' | 'success' | 'error';
    config?: any;
  };
  style?: any;
  selected?: boolean;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: any;
  label?: string;
}

@Component({
  selector: 'app-workflow-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workflow-demo.component.html',
  styleUrls: ['./workflow-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowDemoComponent implements OnInit, OnDestroy {
  // Signals for reactive state
  workflowNodes = signal<WorkflowNode[]>([]);
  workflowEdges = signal<WorkflowEdge[]>([]);
  selectedNode = signal<WorkflowNode | null>(null);
  isExecuting = signal(false);
  workflowStatus = signal<string>('Ready');
  sidebarCollapsed = signal(false);

  // Computed signal for edges with calculated paths
  edgesWithPaths = computed(() => {
    const nodes = this.workflowNodes();
    const edges = this.workflowEdges();

    return edges.map(edge => ({
      ...edge,
      path: this.calculateEdgePath(edge, nodes)
    }));
  });

  // Canvas dimensions
  canvasWidth = 2000;
  canvasHeight = 1500;

  // Node type definitions
  triggerNodes: WorkflowNodeType[] = [
    {
      id: 'webhook',
      name: 'Webhook',
      icon: '🌐',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      category: 'trigger',
      description: 'Trigger workflow when webhook is called'
    },
    {
      id: 'schedule',
      name: 'Schedule',
      icon: '⏰',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      category: 'trigger',
      description: 'Run workflow on a schedule'
    },
    {
      id: 'manual',
      name: 'Manual',
      icon: '👆',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      category: 'trigger',
      description: 'Manually trigger workflow'
    }
  ];

  actionNodes: WorkflowNodeType[] = [
    {
      id: 'http',
      name: 'HTTP Request',
      icon: '🌍',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      category: 'action',
      description: 'Make HTTP requests to external APIs'
    },
    {
      id: 'email',
      name: 'Send Email',
      icon: '📧',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      category: 'action',
      description: 'Send email notifications'
    },
    {
      id: 'database',
      name: 'Database',
      icon: '🗄️',
      color: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      category: 'action',
      description: 'Query or update database'
    },
    {
      id: 'transform',
      name: 'Transform Data',
      icon: '🔄',
      color: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      category: 'action',
      description: 'Transform and process data'
    }
  ];

  conditionNodes: WorkflowNodeType[] = [
    {
      id: 'condition',
      name: 'If/Then',
      icon: '🔀',
      color: 'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)',
      category: 'condition',
      description: 'Add conditional logic to workflow'
    },
    {
      id: 'switch',
      name: 'Switch',
      icon: '🎯',
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      category: 'condition',
      description: 'Route data based on multiple conditions'
    },
    {
      id: 'filter',
      name: 'Filter',
      icon: '🔍',
      color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      category: 'condition',
      description: 'Filter data based on criteria'
    }
  ];

  outputNodes: WorkflowNodeType[] = [
    {
      id: 'notification',
      name: 'Notification',
      icon: '🔔',
      color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      category: 'output',
      description: 'Send notifications'
    },
    {
      id: 'file',
      name: 'Save File',
      icon: '💾',
      color: 'linear-gradient(135deg, #e3ffe7 0%, #d9e7ff 100%)',
      category: 'output',
      description: 'Save data to file'
    },
    {
      id: 'webhook-response',
      name: 'Webhook Response',
      icon: '📤',
      color: 'linear-gradient(135deg, #ffd3a5 0%, #fd9853 100%)',
      category: 'output',
      description: 'Return response to webhook'
    }
  ];

  // Drag state
  private dragNode: WorkflowNode | null = null;
  private dragOffset = { x: 0, y: 0 };

  // Connection state
  private connectingFrom: { node: WorkflowNode, type: 'input' | 'output' } | null = null;
  tempConnection = signal<{ from: { x: number, y: number }, to: { x: number, y: number } } | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    console.log('✅ N8N-style workflow builder loaded successfully!');
  }

  ngOnInit() {
    this.loadSampleWorkflow();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Only add event listeners in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Add mouse move and up listeners for dragging
      document.addEventListener('mousemove', this.onMouseMove.bind(this));
      document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }
  }

  ngOnDestroy() {
    // Clean up event listeners in browser environment
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('mousemove', this.onMouseMove.bind(this));
      document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    }
  }

  addNodeToCanvas(nodeType: WorkflowNodeType) {
    const newNode: WorkflowNode = {
      id: `${nodeType.id}-${Date.now()}`,
      type: nodeType.id,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100
      },
      data: {
        label: nodeType.name,
        icon: nodeType.icon,
        status: 'idle'
      },
      style: {
        background: nodeType.color
      }
    };

    this.workflowNodes.update(nodes => [...nodes, newNode]);
  }

  selectNode(node: WorkflowNode) {
    // Deselect all nodes
    this.workflowNodes.update(nodes =>
      nodes.map(n => ({ ...n, selected: false }))
    );

    // Select clicked node
    this.workflowNodes.update(nodes =>
      nodes.map(n => n.id === node.id ? { ...n, selected: true } : n)
    );

    this.selectedNode.set(node);
  }

  startDrag(node: WorkflowNode, event: MouseEvent) {
    // Don't start drag if clicking on a handle
    const target = event.target as HTMLElement;
    if (target.classList.contains('handle')) {
      return;
    }

    event.preventDefault();
    this.dragNode = node;
    this.dragOffset = {
      x: event.clientX - node.position.x,
      y: event.clientY - node.position.y
    };
  }

  private onMouseMove(event: MouseEvent) {
    if (this.dragNode) {
      const newPosition = {
        x: event.clientX - this.dragOffset.x,
        y: event.clientY - this.dragOffset.y
      };

      this.workflowNodes.update(nodes =>
        nodes.map(n =>
          n.id === this.dragNode!.id
            ? { ...n, position: newPosition }
            : n
        )
      );
    } else if (this.connectingFrom) {
      // Update temporary connection line to follow mouse
      const rect = (event.target as HTMLElement).closest('.workflow-canvas')?.getBoundingClientRect();
      if (rect) {
        const fromPos = this.getHandlePosition(this.connectingFrom.node, this.connectingFrom.type);
        this.tempConnection.set({
          from: fromPos,
          to: { x: event.clientX - rect.left, y: event.clientY - rect.top }
        });
      }
    }
  }

  private onMouseUp(event: MouseEvent) {
    this.dragNode = null;

    // Handle connection completion
    if (this.connectingFrom) {
      const target = event.target as HTMLElement;

      // Check if target is an input handle or within an input handle
      const inputHandle = target.closest('.handle-input');
      if (inputHandle) {
        const targetNodeId = inputHandle.getAttribute('data-node-id');
        const targetNode = this.workflowNodes().find(n => n.id === targetNodeId);

        if (targetNode && targetNode.id !== this.connectingFrom.node.id) {
          this.createConnection(this.connectingFrom.node, targetNode);
        }
      }

      // Always clear connection state
      this.connectingFrom = null;
      this.tempConnection.set(null);
    }
  }  private createConnection(sourceNode: WorkflowNode, targetNode: WorkflowNode) {
    const newEdge: WorkflowEdge = {
      id: `edge-${sourceNode.id}-${targetNode.id}`,
      source: sourceNode.id,
      target: targetNode.id,
      animated: false
    };

    // Check if connection already exists
    const existingEdge = this.workflowEdges().find(
      e => e.source === newEdge.source && e.target === newEdge.target
    );

    if (!existingEdge) {
      this.workflowEdges.update(edges => [...edges, newEdge]);
    }
  }  // Connection methods
  startConnection(node: WorkflowNode, type: 'input' | 'output', event: MouseEvent) {
    event.stopPropagation(); // Prevent node drag
    event.preventDefault();

    // Only allow starting connections from output handles
    if (type === 'output') {
      this.connectingFrom = { node, type };
      const fromPos = this.getHandlePosition(node, type);
      this.tempConnection.set({
        from: fromPos,
        to: fromPos
      });
    }
  }

  endConnection(node: WorkflowNode, type: 'input' | 'output', event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (this.connectingFrom && type === 'input' && this.connectingFrom.node.id !== node.id) {
      this.createConnection(this.connectingFrom.node, node);
    }

    // Clear connection state
    this.connectingFrom = null;
    this.tempConnection.set(null);
  }

  getHandlePosition(node: WorkflowNode, type: 'input' | 'output'): { x: number, y: number } {
    const nodeWidth = 200; // Node width
    const nodeHeight = 60; // Node height

    // Based on visual inspection, we need to add a 34px offset only to output handles (origination)
    // Input handles (termination) should use the original calculation
    const outputHandleOffset = 34;

    const position = {
      x: node.position.x + (type === 'input' ? 0 : nodeWidth + outputHandleOffset),
      y: node.position.y + nodeHeight / 2
    };

    console.log(`Handle position for ${node.id} (${type}):`, position, 'Node position:', node.position);

    return position;
  }

  getTempConnectionPath(): string {
    const temp = this.tempConnection();
    if (!temp) return '';

    const sourceX = temp.from.x;
    const sourceY = temp.from.y;
    const targetX = temp.to.x;
    const targetY = temp.to.y;

    // Create a smooth curve for temporary connection
    const dx = Math.abs(targetX - sourceX);
    const controlPointOffset = Math.min(dx * 0.3, 80);

    const controlX1 = sourceX + controlPointOffset;
    const controlY1 = sourceY;
    const controlX2 = targetX - controlPointOffset;
    const controlY2 = targetY;

    return `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;
  }

  deleteNode(nodeId: string) {
    this.workflowNodes.update(nodes => nodes.filter(n => n.id !== nodeId));
    this.workflowEdges.update(edges =>
      edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    );

    if (this.selectedNode()?.id === nodeId) {
      this.selectedNode.set(null);
    }
  }

  deleteSelectedNode() {
    const selected = this.selectedNode();
    if (selected) {
      this.deleteNode(selected.id);
    }
  }

  duplicateNode() {
    const selected = this.selectedNode();
    if (selected) {
      const duplicate: WorkflowNode = {
        ...selected,
        id: `${selected.type}-${Date.now()}`,
        position: {
          x: selected.position.x + 20,
          y: selected.position.y + 20
        },
        selected: false
      };

      this.workflowNodes.update(nodes => [...nodes, duplicate]);
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  canHaveInput(node: WorkflowNode): boolean {
    return node.type !== 'webhook' && node.type !== 'schedule' && node.type !== 'manual';
  }

  canHaveOutput(node: WorkflowNode): boolean {
    return node.type !== 'notification' && node.type !== 'file' && node.type !== 'webhook-response';
  }

  calculateEdgePath(edge: WorkflowEdge, nodes: WorkflowNode[]): string {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) return '';

    // Get exact handle positions
    const sourcePos = this.getHandlePosition(sourceNode, 'output');
    const targetPos = this.getHandlePosition(targetNode, 'input');

    const sourceX = sourcePos.x;
    const sourceY = sourcePos.y;
    const targetX = targetPos.x;
    const targetY = targetPos.y;

    // Create a smooth curved path
    const dx = Math.abs(targetX - sourceX);
    const controlPointOffset = Math.min(dx * 0.5, 100); // Curve intensity

    const controlX1 = sourceX + controlPointOffset;
    const controlY1 = sourceY;
    const controlX2 = targetX - controlPointOffset;
    const controlY2 = targetY;

    // Cubic Bezier curve for smooth flow
    return `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;
  }

  getEdgePath(edge: WorkflowEdge): string {
    // Use the computed path for better performance
    const edgeWithPath = this.edgesWithPaths().find(e => e.id === edge.id);
    return edgeWithPath?.path || '';
  }

  trackNode(index: number, node: WorkflowNode): string {
    return node.id;
  }

  trackEdge(index: number, edge: WorkflowEdge): string {
    return edge.id;
  }

  async executeWorkflow() {
    this.isExecuting.set(true);
    this.workflowStatus.set('Executing...');

    const nodes = this.workflowNodes();

    // Simulate workflow execution
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      // Set node to running
      this.workflowNodes.update(currentNodes =>
        currentNodes.map(n =>
          n.id === node.id
            ? { ...n, data: { ...n.data, status: 'running' } }
            : n
        )
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Set node to success (90% chance) or error (10% chance)
      const success = Math.random() > 0.1;
      this.workflowNodes.update(currentNodes =>
        currentNodes.map(n =>
          n.id === node.id
            ? { ...n, data: { ...n.data, status: success ? 'success' : 'error' } }
            : n
        )
      );

      if (!success) {
        this.workflowStatus.set('Execution failed');
        break;
      }
    }

    if (this.workflowStatus() !== 'Execution failed') {
      this.workflowStatus.set('Execution completed');
    }

    this.isExecuting.set(false);

    // Reset status after 3 seconds
    setTimeout(() => {
      this.workflowStatus.set('Ready');
      this.workflowNodes.update(nodes =>
        nodes.map(n => ({ ...n, data: { ...n.data, status: 'idle' } }))
      );
    }, 3000);
  }

  loadSampleWorkflow() {
    const sampleNodes: WorkflowNode[] = [
      {
        id: 'webhook-1',
        type: 'webhook',
        position: { x: 50, y: 150 },
        data: { label: 'Webhook Trigger', icon: '🌐', status: 'idle' },
        style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
      },
      {
        id: 'transform-1',
        type: 'transform',
        position: { x: 300, y: 150 },
        data: { label: 'Transform Data', icon: '🔄', status: 'idle' },
        style: { background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' }
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 550, y: 100 },
        data: { label: 'Check Condition', icon: '🔀', status: 'idle' },
        style: { background: 'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)' }
      },
      {
        id: 'email-1',
        type: 'email',
        position: { x: 800, y: 50 },
        data: { label: 'Send Email', icon: '📧', status: 'idle' },
        style: { background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
      },
      {
        id: 'database-1',
        type: 'database',
        position: { x: 800, y: 200 },
        data: { label: 'Save to DB', icon: '🗄️', status: 'idle' },
        style: { background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)' }
      }
    ];

    const sampleEdges: WorkflowEdge[] = [
      {
        id: 'e1',
        source: 'webhook-1',
        target: 'transform-1',
        animated: true
      },
      {
        id: 'e2',
        source: 'transform-1',
        target: 'condition-1',
        animated: false
      },
      {
        id: 'e3',
        source: 'condition-1',
        target: 'email-1',
        animated: false,
        label: 'Yes'
      },
      {
        id: 'e4',
        source: 'condition-1',
        target: 'database-1',
        animated: false,
        label: 'No'
      }
    ];

    this.workflowNodes.set(sampleNodes);
    this.workflowEdges.set(sampleEdges);
  }

  clearWorkflow() {
    this.workflowNodes.set([]);
    this.workflowEdges.set([]);
    this.selectedNode.set(null);
    this.workflowStatus.set('Ready');
  }

  saveWorkflow() {
    const workflow = {
      nodes: this.workflowNodes(),
      edges: this.workflowEdges(),
      timestamp: new Date().toISOString()
    };

    // In a real app, this would save to backend
    localStorage.setItem('n8n-workflow', JSON.stringify(workflow));
    this.workflowStatus.set('Workflow saved');

    setTimeout(() => {
      this.workflowStatus.set('Ready');
    }, 2000);
  }
}
