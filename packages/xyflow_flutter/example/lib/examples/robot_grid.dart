import 'dart:math';
import 'dart:js_interop';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:xyflow_flutter/xyflow_flutter.dart' hide Transform;

// ═══════════════════════════════════════════════════════════════════════════════
// JS interop for Web Audio sound effects
// ═══════════════════════════════════════════════════════════════════════════════

@JS('eval')
external JSAny? _jsEval(JSString code);

abstract final class _Sound {
  static bool _enabled = true;

  static void playConnect() {
    if (!kIsWeb || !_enabled) return;
    try {
      _jsEval(
        "(function(){var c=new AudioContext(),o=c.createOscillator(),g=c.createGain();"
        "o.type='sine';o.frequency.setValueAtTime(600,c.currentTime);"
        "o.frequency.exponentialRampToValueAtTime(1200,c.currentTime+0.1);"
        "g.gain.setValueAtTime(0.08,c.currentTime);"
        "g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.15);"
        "o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+0.15)})()"
            .toJS,
      );
    } catch (_) {}
  }

  static void playBounce(double intensity) {
    if (!kIsWeb || !_enabled) return;
    try {
      // Louder and deeper for harder impacts
      final vol = (0.03 + intensity * 0.25).clamp(0.03, 0.28);
      final freq = (100 + intensity * 80).round(); // higher pitch for harder hits
      final dur = (0.12 + intensity * 0.15).toStringAsFixed(2);
      _jsEval(
        "(function(){var c=new AudioContext(),o=c.createOscillator(),n=c.createOscillator(),g=c.createGain();"
        "o.type='sine';n.type='triangle';"
        "o.frequency.setValueAtTime($freq,c.currentTime);"
        "o.frequency.exponentialRampToValueAtTime(40,c.currentTime+$dur);"
        "n.frequency.setValueAtTime(${freq * 2},c.currentTime);"
        "n.frequency.exponentialRampToValueAtTime(30,c.currentTime+${(double.parse(dur) * 0.8).toStringAsFixed(2)});"
        "g.gain.setValueAtTime($vol,c.currentTime);"
        "g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+$dur);"
        "o.connect(g);n.connect(g);g.connect(c.destination);"
        "o.start();n.start();o.stop(c.currentTime+$dur);n.stop(c.currentTime+$dur)})()"
            .toJS,
      );
    } catch (_) {}
  }

  static void playCut() {
    if (!kIsWeb || !_enabled) return;
    try {
      _jsEval(
        "(function(){var c=new AudioContext(),o=c.createOscillator(),g=c.createGain();"
        "o.type='sawtooth';o.frequency.setValueAtTime(800,c.currentTime);"
        "o.frequency.exponentialRampToValueAtTime(200,c.currentTime+0.1);"
        "g.gain.setValueAtTime(0.06,c.currentTime);"
        "g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.12);"
        "o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+0.12)})()"
            .toJS,
      );
    } catch (_) {}
  }

  /// Soft pop when spawning a node
  static void playSpawn() {
    if (!kIsWeb || !_enabled) return;
    try {
      _jsEval(
        "(function(){var c=new AudioContext(),o=c.createOscillator(),g=c.createGain();"
        "o.type='sine';o.frequency.setValueAtTime(300,c.currentTime);"
        "o.frequency.exponentialRampToValueAtTime(500,c.currentTime+0.06);"
        "o.frequency.exponentialRampToValueAtTime(250,c.currentTime+0.12);"
        "g.gain.setValueAtTime(0.06,c.currentTime);"
        "g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.15);"
        "o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+0.15)})()"
            .toJS,
      );
    } catch (_) {}
  }

  /// Subtle pickup sound when starting a drag
  static void playPickup() {
    if (!kIsWeb || !_enabled) return;
    try {
      _jsEval(
        "(function(){var c=new AudioContext(),o=c.createOscillator(),g=c.createGain();"
        "o.type='sine';o.frequency.setValueAtTime(400,c.currentTime);"
        "o.frequency.exponentialRampToValueAtTime(600,c.currentTime+0.05);"
        "g.gain.setValueAtTime(0.04,c.currentTime);"
        "g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.08);"
        "o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+0.08)})()"
            .toJS,
      );
    } catch (_) {}
  }

  /// Soft thud when dropping a node (no momentum)
  static void playDrop() {
    if (!kIsWeb || !_enabled) return;
    try {
      _jsEval(
        "(function(){var c=new AudioContext(),o=c.createOscillator(),g=c.createGain();"
        "o.type='sine';o.frequency.setValueAtTime(200,c.currentTime);"
        "o.frequency.exponentialRampToValueAtTime(100,c.currentTime+0.08);"
        "g.gain.setValueAtTime(0.05,c.currentTime);"
        "g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.1);"
        "o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+0.1)})()"
            .toJS,
      );
    } catch (_) {}
  }

  /// Whoosh when releasing with momentum
  static void playThrow(double intensity) {
    if (!kIsWeb || !_enabled) return;
    try {
      final vol = (intensity * 0.08).clamp(0.02, 0.1);
      final freq = (300 + intensity * 400).clamp(300, 700).round();
      _jsEval(
        "(function(){var c=new AudioContext(),o=c.createOscillator(),n=c.createOscillator(),g=c.createGain();"
        "o.type='sine';n.type='sawtooth';"
        "o.frequency.setValueAtTime($freq,c.currentTime);"
        "o.frequency.exponentialRampToValueAtTime(100,c.currentTime+0.2);"
        "n.frequency.setValueAtTime(${freq ~/ 2},c.currentTime);"
        "n.frequency.exponentialRampToValueAtTime(50,c.currentTime+0.15);"
        "g.gain.setValueAtTime($vol,c.currentTime);"
        "g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.2);"
        "o.connect(g);n.connect(g);g.connect(c.destination);"
        "o.start();n.start();o.stop(c.currentTime+0.2);n.stop(c.currentTime+0.15)})()"
            .toJS,
      );
    } catch (_) {}
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Style constants
// ═══════════════════════════════════════════════════════════════════════════════

abstract final class _S {
  static const Color canvasBg = Color(0xFF171717);
  static const Color surface = Color(0xFF1E1E1E);
  static const Color surfaceLight = Color(0xFF2A2A2A);
  static const Color border = Color(0xFF333333);
  static const Color borderHighlight = Color(0xFF58A6FF);
  static const Color textPrimary = Color(0xFFE5E5E5);
  static const Color textSecondary = Color(0xFF8B949E);
  static const Color edgeColor = Color(0xFF58A6FF);
  static const Color panelBg = Color(0xFF1A1A1A);
  static const Color panelSection = Color(0xFF222222);
  static const double borderRadius = 12.0;
  static const List<Color> accents = [
    Color(0xFF58A6FF), Color(0xFF3FB950), Color(0xFFD2A8FF),
    Color(0xFFF78166), Color(0xFFFF7B72), Color(0xFF79C0FF),
    Color(0xFFF0883E), Color(0xFF56D364),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// Simulation config – mutable, driven by debug panel sliders
// ═══════════════════════════════════════════════════════════════════════════════

class _SimConfig {
  // Physics
  double maxVelocity = 40;
  double baseFriction = 0.975;
  double highSpeedFriction = 0.94;
  double bounceDamping = 0.45;
  double bounceFriction = 0.85;
  double minVelocity = 0.15;
  double momentumThreshold = 1.5;
  int velocitySamples = 9;
  int sampleWindowMs = 80;

  // Visual
  double boundaryMargin = 18;
  double dragScale = 1.018;
  double panelSize = 160;

  // Shadows
  double idleYOffset = 24;
  double idleBlur = 24;
  double idleSpread = -12;
  double idleOpacity = 0.25;
  double dragYOffset = 32;
  double dragBlur = 40;
  double dragSpread = -8;
  double dragOpacity = 0.55;

  // Particles
  bool particlesEnabled = true;
  int particleCount = 14;
  double particleLifespan = 2.5;
  double particleGravity = 120;
  double pulseDuration = 2.0;
  double pulseSpeed = 400;

  // Grid (spring displacement)
  double gridSize = 40;
  double gridMaxDist = 400;
  double gridPushStrength = 25;
  double gridSpringStiffness = 0.08;
  double gridDamping = 0.75;
  double gridHoverRadius = 120;
  double gridBaseOpacity = 0.06;
  double gridBrightnessRadius = 110;

  // Sound
  bool soundEnabled = true;

  double get maxVelPxS => maxVelocity * 1000;
  double get minVelPxS => minVelocity * 1000;
  double get thresholdPxS => momentumThreshold * 1000;

  void reset() {
    maxVelocity = 40; baseFriction = 0.975; highSpeedFriction = 0.94;
    bounceDamping = 0.45; bounceFriction = 0.85; minVelocity = 0.15;
    momentumThreshold = 1.5; velocitySamples = 9; sampleWindowMs = 80;
    boundaryMargin = 18; dragScale = 1.018; panelSize = 160;
    idleYOffset = 24; idleBlur = 24; idleSpread = -12; idleOpacity = 0.25;
    dragYOffset = 32; dragBlur = 40; dragSpread = -8; dragOpacity = 0.55;
    particlesEnabled = true; particleCount = 14;
    particleLifespan = 2.5; particleGravity = 120;
    pulseDuration = 2.0; pulseSpeed = 400;
    gridSize = 40; gridMaxDist = 400; gridPushStrength = 25;
    gridSpringStiffness = 0.08; gridDamping = 0.75; gridHoverRadius = 120;
    gridBaseOpacity = 0.06; gridBrightnessRadius = 110;
    soundEnabled = true;
  }

  void applyPreset(String name) {
    reset();
    switch (name) {
      case 'zero_g':
        particleGravity = 0; baseFriction = 0.995; bounceDamping = 0.9;
      case 'bouncy':
        bounceDamping = 0.85; bounceFriction = 0.95; baseFriction = 0.99;
        particleCount = 24;
      case 'floaty':
        baseFriction = 0.998; highSpeedFriction = 0.99; bounceDamping = 0.3;
        dragScale = 1.04; particleGravity = 30;
      case 'chaos':
        maxVelocity = 80; bounceDamping = 0.95; bounceFriction = 0.99;
        baseFriction = 0.995; particleCount = 30; particleGravity = 200;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Data classes
// ═══════════════════════════════════════════════════════════════════════════════

class RobotNodeData {
  const RobotNodeData({required this.label, required this.accentColor, required this.index});
  final String label;
  final Color accentColor;
  final int index;
  RobotNodeData copyWith({String? label, Color? accentColor, int? index}) =>
      RobotNodeData(label: label ?? this.label, accentColor: accentColor ?? this.accentColor, index: index ?? this.index);
}

class _VelocitySample {
  const _VelocitySample(this.position, this.timestamp);
  final Offset position;
  final int timestamp;
}

class _MomentumState {
  _MomentumState({required this.velocity, required this.position});
  Offset velocity;
  Offset position;
}

class _PulseEvent {
  _PulseEvent({required this.center, required this.startTime, required this.color});
  final Offset center;
  final double startTime;
  final Color color;
}

class _Particle {
  _Particle({required this.position, required this.velocity, required this.size,
    required this.color, required this.createdAt, required this.lifespan, this.shape = 0});
  Offset position;
  Offset velocity;
  final double size;
  final Color color;
  final double createdAt;
  final double lifespan;
  final int shape;
}

class _CutAnimation {
  _CutAnimation({required this.sourcePos, required this.targetPos,
    required this.cutPoint, required this.startTime, required this.color});
  final Offset sourcePos, targetPos, cutPoint;
  final double startTime;
  final Color color;
}

class _GridDot {
  _GridDot({required this.ix, required this.iy, required double gridSize})
      : baseX = ix * gridSize, baseY = iy * gridSize,
        x = ix * gridSize, y = iy * gridSize;
  final int ix, iy;
  final double baseX, baseY;
  double x, y;
  double vx = 0, vy = 0;
  double size = 1;
  double targetSize = 1;
  double brightness = 0;
}

class _ConnPath {
  _ConnPath({required this.points});
  final List<Offset> points;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main widget
// ═══════════════════════════════════════════════════════════════════════════════

class RobotGridExample extends StatefulWidget {
  const RobotGridExample({super.key});
  @override
  State<RobotGridExample> createState() => _RobotGridExampleState();
}

class _RobotGridExampleState extends State<RobotGridExample>
    with TickerProviderStateMixin {
  List<Node<RobotNodeData>> _nodes = [];
  List<Edge<void>> _edges = [];
  XYFlowController<RobotNodeData, void>? _controller;
  int _nextIndex = 0;
  final GlobalKey _xyflowKey = GlobalKey();

  final _SimConfig _cfg = _SimConfig();
  bool _showDebugPanel = false;

  // Click-to-spawn
  Offset? _pointerDownPos;
  int? _pointerDownTime;

  // Velocity sampling + momentum
  final Map<String, List<_VelocitySample>> _velocitySamples = {};
  final Map<String, _MomentumState> _activeMomentum = {};
  Ticker? _physicsTicker;
  Duration _lastTickerElapsed = Duration.zero;
  double _tickerSeconds = 0;

  // Visual effects
  final List<_PulseEvent> _activePulses = [];
  final List<_Particle> _particles = [];
  final List<_CutAnimation> _cutAnimations = [];
  final Map<String, double> _bounceScales = {};
  final Map<String, double> _spawnTimes = {};
  String? _draggingNodeId;

  // Slice mode
  bool _sliceMode = false;
  List<Offset> _sliceTrail = [];

  // Dynamic grid
  List<_GridDot> _gridDots = [];
  Map<String, _GridDot> _gridMap = {};
  Size? _gridViewportSize;
  Offset? _mousePos;
  List<_ConnPath> _connectionPaths = [];

  // Repaint notifier — triggers CustomPainter repaints without rebuilding XYFlow/nodes
  final ValueNotifier<int> _effectsRepaint = ValueNotifier<int>(0);

  @override
  void initState() {
    super.initState();
    _Sound._enabled = _cfg.soundEnabled;
    _physicsTicker = createTicker(_onPhysicsTick)..start();
  }

  @override
  void dispose() {
    _physicsTicker?.dispose();
    _effectsRepaint.dispose();
    super.dispose();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Grid management
  // ════════════════════════════════════════════════════════════════════════════

  void _initGrid(Size viewportSize) {
    _gridDots.clear();
    _gridMap.clear();
    final gs = _cfg.gridSize;
    final cols = (viewportSize.width / gs).ceil() + 4;
    final rows = (viewportSize.height / gs).ceil() + 4;
    for (var ix = -2; ix <= cols; ix++) {
      for (var iy = -2; iy <= rows; iy++) {
        final dot = _GridDot(ix: ix, iy: iy, gridSize: gs);
        _gridDots.add(dot);
        _gridMap['$ix,$iy'] = dot;
      }
    }
    _gridViewportSize = viewportSize;
  }

  void _stepGrid() {
    final controller = _controller;
    if (controller == null || _gridDots.isEmpty) return;

    // Get panel screen-space bounds
    final zoom = controller.getZoom();
    final panelBounds = <Rect>[];
    for (final node in _nodes) {
      final screenPos = controller.flowToScreen(Offset(node.position.x, node.position.y));
      final w = (node.width ?? _cfg.panelSize) * zoom;
      final h = (node.height ?? _cfg.panelSize) * zoom;
      panelBounds.add(Rect.fromLTWH(screenPos.dx, screenPos.dy, w, h));
    }

    final maxDist = _cfg.gridMaxDist;
    final pushStr = _cfg.gridPushStrength;
    final stiffness = _cfg.gridSpringStiffness;
    final damping = _cfg.gridDamping;
    final brightR = _cfg.gridBrightnessRadius;

    for (final dot in _gridDots) {
      var totalPushX = 0.0;
      var totalPushY = 0.0;
      var minDist = double.infinity;

      for (final bounds in panelBounds) {
        final closestX = dot.baseX.clamp(bounds.left, bounds.right);
        final closestY = dot.baseY.clamp(bounds.top, bounds.bottom);
        final dx = dot.baseX - closestX;
        final dy = dot.baseY - closestY;
        final dist = sqrt(dx * dx + dy * dy);

        if (dist > 0 && dist < maxDist) {
          final norm = dist / maxDist;
          final push = pow(1 - norm, 2) * pushStr;
          totalPushX += (dx / dist) * push;
          totalPushY += (dy / dist) * push;
        }
        minDist = min(minDist, dist);
      }

      final targetX = dot.baseX + totalPushX;
      final targetY = dot.baseY + totalPushY;

      // Spring physics
      final forceX = (targetX - dot.x) * stiffness;
      final forceY = (targetY - dot.y) * stiffness;
      dot.vx = (dot.vx + forceX) * damping;
      dot.vy = (dot.vy + forceY) * damping;
      dot.x += dot.vx;
      dot.y += dot.vy;

      // Size ripple based on distance to nearest panel
      final normDist = (minDist / maxDist).clamp(0.0, 1.0);
      final ripple = sin(normDist * pi);
      dot.targetSize = 0.8 + ripple * 2;
      dot.size += (dot.targetSize - dot.size) * 0.15;

      // Brightness (proximity glow)
      final bDist = (minDist / brightR).clamp(0.0, 1.0);
      dot.brightness = pow(1 - bDist, 2).toDouble();
    }
  }

  List<_ConnPath> _buildConnectionPaths() {
    final controller = _controller;
    if (controller == null || _gridMap.isEmpty || _edges.isEmpty) return [];

    final paths = <_ConnPath>[];
    final gs = _cfg.gridSize;

    for (final edge in _edges) {
      final srcNode = _nodes.where((n) => n.id == edge.source).firstOrNull;
      final tgtNode = _nodes.where((n) => n.id == edge.target).firstOrNull;
      if (srcNode == null || tgtNode == null) continue;

      final zoom = controller.getZoom();
      final sw = (srcNode.width ?? _cfg.panelSize) * zoom;
      final sh = (srcNode.height ?? _cfg.panelSize) * zoom;
      final th = (tgtNode.height ?? _cfg.panelSize) * zoom;

      final srcScreen = controller.flowToScreen(Offset(srcNode.position.x, srcNode.position.y));
      final tgtScreen = controller.flowToScreen(Offset(tgtNode.position.x, tgtNode.position.y));

      // Handle positions: source=right center, target=left center
      final from = Offset(srcScreen.dx + sw, srcScreen.dy + sh / 2);
      final to = Offset(tgtScreen.dx, tgtScreen.dy + th / 2);

      // Snap to grid indices
      final startIx = (from.dx / gs).round();
      final startIy = (from.dy / gs).round();
      final endIx = (to.dx / gs).round();
      final endIy = (to.dy / gs).round();

      // Build L-path (horizontal first)
      final indices = <({int ix, int iy})>[];
      final xStep = startIx <= endIx ? 1 : -1;
      for (var ix = startIx; ix != endIx + xStep; ix += xStep) {
        indices.add((ix: ix, iy: startIy));
      }
      final yStep = startIy <= endIy ? 1 : -1;
      for (var iy = startIy + yStep; yStep > 0 ? iy <= endIy : iy >= endIy; iy += yStep) {
        indices.add((ix: endIx, iy: iy));
      }

      // Look up displaced positions
      final points = <Offset>[from];
      for (final p in indices) {
        final dot = _gridMap['${p.ix},${p.iy}'];
        points.add(dot != null ? Offset(dot.x, dot.y) : Offset(p.ix * gs, p.iy * gs));
      }
      points.add(to);

      paths.add(_ConnPath(points: points));
    }
    return paths;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Flow callbacks
  // ════════════════════════════════════════════════════════════════════════════

  void _onNodesChange(List<NodeChange> changes) {
    // Clean up physics/effects state for removed nodes
    for (final change in changes) {
      if (change is NodeRemoveChange) {
        _activeMomentum.remove(change.id);
        _velocitySamples.remove(change.id);
        _bounceScales.remove(change.id);
        _spawnTimes.remove(change.id);
        if (_draggingNodeId == change.id) _draggingNodeId = null;
      }
    }
    setState(() => _nodes = applyNodeChanges(changes, _nodes));
  }

  void _onEdgesChange(List<EdgeChange> changes) {
    setState(() => _edges = applyEdgeChanges(changes, _edges));
  }

  void _onConnect(Connection connection) {
    if (connection.source == connection.target) return;
    if (_edges.any((e) => e.source == connection.source && e.target == connection.target)) return;
    _Sound.playConnect();
    setState(() {
      _edges = [
        ..._edges,
        Edge<void>(
          id: 'e-${connection.source}-${connection.target}-${DateTime.now().millisecondsSinceEpoch}',
          source: connection.source, target: connection.target,
          sourceHandle: connection.sourceHandle, targetHandle: connection.targetHandle,
          type: EdgeTypes.smoothStep,
          style: {'stroke': 0x05FFFFFF, 'strokeWidth': 0.5}, // Nearly invisible; custom rendering handles visuals
        ),
      ];
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Click-to-spawn
  // ════════════════════════════════════════════════════════════════════════════

  void _onPointerDown(PointerDownEvent event) {
    _pointerDownPos = event.localPosition;
    _pointerDownTime = DateTime.now().millisecondsSinceEpoch;
  }

  void _onPointerUp(PointerUpEvent event) {
    if (_sliceMode) return;
    final downPos = _pointerDownPos;
    final downTime = _pointerDownTime;
    if (downPos == null || downTime == null) return;
    if ((event.localPosition - downPos).distance < 5 &&
        DateTime.now().millisecondsSinceEpoch - downTime < 300) {
      _trySpawnNode(event.localPosition);
    }
    _pointerDownPos = null;
    _pointerDownTime = null;
  }

  void _trySpawnNode(Offset screenPos) {
    final controller = _controller;
    if (controller == null) return;
    final flowPos = controller.screenToFlow(screenPos);
    final half = _cfg.panelSize / 2;
    final hitRect = XYRect(x: flowPos.dx - half, y: flowPos.dy - half, width: _cfg.panelSize, height: _cfg.panelSize);
    if (controller.getIntersectingNodes(hitRect).isNotEmpty) return;

    final accent = _S.accents[_nextIndex % _S.accents.length];
    final index = _nextIndex++;
    final id = 'robot-$index';
    _spawnTimes[id] = _tickerSeconds;
    _Sound.playSpawn();

    setState(() {
      _nodes = [
        ..._nodes,
        Node<RobotNodeData>(
          id: id, type: 'robot_panel',
          position: XYPosition(x: flowPos.dx - half, y: flowPos.dy - half),
          data: RobotNodeData(label: 'Panel', accentColor: accent, index: index),
          sourcePosition: Position.right, targetPosition: Position.left,
          width: _cfg.panelSize, height: _cfg.panelSize,
        ),
      ];
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Drag + velocity sampling
  // ════════════════════════════════════════════════════════════════════════════

  void _onNodeDragStart(Node<RobotNodeData> node) {
    _activeMomentum.remove(node.id);
    _velocitySamples[node.id] = [];
    _Sound.playPickup();
    setState(() => _draggingNodeId = node.id);
  }

  void _onNodeDrag(Node<RobotNodeData> node, XYPosition pos) {
    final now = DateTime.now().millisecondsSinceEpoch;
    final samples = _velocitySamples[node.id] ??= [];
    samples.add(_VelocitySample(Offset(pos.x, pos.y), now));
    final cutoff = now - _cfg.sampleWindowMs;
    samples.removeWhere((s) => s.timestamp < cutoff);
    while (samples.length > _cfg.velocitySamples) {
      samples.removeAt(0);
    }
  }

  void _onNodeDragStop(Node<RobotNodeData> node) {
    setState(() => _draggingNodeId = null);
    final samples = _velocitySamples.remove(node.id);
    if (samples == null || samples.length < 2) return;

    double vx = 0, vy = 0, totalWeight = 0;
    for (var i = 1; i < samples.length; i++) {
      final dtMs = (samples[i].timestamp - samples[i - 1].timestamp).toDouble();
      if (dtMs < 8 || dtMs > 100) continue;
      final dt = dtMs / 1000.0;
      final weight = i / samples.length;
      vx += ((samples[i].position.dx - samples[i - 1].position.dx) / dt) * weight;
      vy += ((samples[i].position.dy - samples[i - 1].position.dy) / dt) * weight;
      totalWeight += weight;
    }
    if (totalWeight == 0) return;
    vx /= totalWeight;
    vy /= totalWeight;

    final speed = sqrt(vx * vx + vy * vy);
    if (speed > _cfg.maxVelPxS) {
      final scale = _cfg.maxVelPxS / speed;
      vx *= scale;
      vy *= scale;
    }
    if (speed < _cfg.thresholdPxS) {
      _Sound.playDrop();
      return;
    }

    _Sound.playThrow((speed / _cfg.maxVelPxS).clamp(0.0, 1.0));
    _activeMomentum[node.id] = _MomentumState(
      velocity: Offset(vx, vy), position: Offset(node.position.x, node.position.y),
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Physics ticker
  // ════════════════════════════════════════════════════════════════════════════

  void _onPhysicsTick(Duration elapsed) {
    final dt = (elapsed - _lastTickerElapsed).inMicroseconds / 1e6;
    _lastTickerElapsed = elapsed;
    _tickerSeconds = elapsed.inMicroseconds / 1e6;
    if (dt <= 0 || dt > 0.1) return;

    // Init/resize grid
    final rb = _xyflowKey.currentContext?.findRenderObject() as RenderBox?;
    if (rb != null && rb.hasSize) {
      final s = rb.size;
      if (_gridViewportSize == null || (_gridViewportSize!.width - s.width).abs() > 10 ||
          (_gridViewportSize!.height - s.height).abs() > 10) {
        _initGrid(s);
      }
    }

    // Clean up expired effects
    _activePulses.removeWhere((p) => (_tickerSeconds - p.startTime) > _cfg.pulseDuration);
    _cutAnimations.removeWhere((c) => (_tickerSeconds - c.startTime) > 0.4);
    _spawnTimes.removeWhere((_, t) => (_tickerSeconds - t) > 0.3);

    // Decay bounce scales
    final bounceToRemove = <String>[];
    for (final entry in _bounceScales.entries) {
      _bounceScales[entry.key] = 1.0 + (entry.value - 1.0) * 0.85;
      if ((entry.value - 1.0).abs() < 0.001) bounceToRemove.add(entry.key);
    }
    for (final id in bounceToRemove) _bounceScales.remove(id);

    _stepParticles(dt);
    _stepGrid();
    _connectionPaths = _buildConnectionPaths();

    if (_activeMomentum.isNotEmpty) {
      _stepMomentum(dt); // calls setState for node position updates
    } else if (_bounceScales.isNotEmpty || _spawnTimes.isNotEmpty) {
      // Only rebuild tree when node visual state changes (bounce/spawn animation)
      setState(() {});
    }

    // Always notify effects painters to repaint (grid, pulses, particles)
    // This does NOT rebuild the widget tree — only the CustomPaint layers repaint
    _effectsRepaint.value++;
  }

  void _stepParticles(double dt) {
    final toRemove = <int>[];
    for (var i = 0; i < _particles.length; i++) {
      final p = _particles[i];
      if (_tickerSeconds - p.createdAt > p.lifespan) { toRemove.add(i); continue; }
      p.velocity = Offset(p.velocity.dx, p.velocity.dy + _cfg.particleGravity * dt);
      p.velocity = p.velocity * 0.99;
      p.position = p.position + p.velocity * dt;
    }
    for (var i = toRemove.length - 1; i >= 0; i--) _particles.removeAt(toRemove[i]);
  }

  void _stepMomentum(double dt) {
    final controller = _controller;
    if (controller == null) return;
    final renderBox = _xyflowKey.currentContext?.findRenderObject() as RenderBox?;
    if (renderBox == null) return;
    final size = renderBox.size;

    final topLeft = controller.screenToFlow(Offset.zero);
    final bottomRight = controller.screenToFlow(Offset(size.width, size.height));
    final margin = _cfg.boundaryMargin / controller.getZoom();

    final toRemove = <String>[];
    final positionUpdates = <String, Offset>{};

    for (final entry in _activeMomentum.entries) {
      final id = entry.key;
      final state = entry.value;
      final node = _nodes.firstWhere((n) => n.id == id, orElse: () => _nodes.first);
      final nw = node.width ?? _cfg.panelSize;
      final nh = node.height ?? _cfg.panelSize;
      final minX = topLeft.dx + margin, minY = topLeft.dy + margin;
      final maxX = bottomRight.dx - margin - nw, maxY = bottomRight.dy - margin - nh;

      final speed = state.velocity.distance;
      final speedRatio = min(speed / _cfg.maxVelPxS, 1.0);
      final friction = _cfg.baseFriction - (speedRatio * (_cfg.baseFriction - _cfg.highSpeedFriction));
      state.velocity = state.velocity * friction;

      var newX = state.position.dx + state.velocity.dx * dt;
      var newY = state.position.dy + state.velocity.dy * dt;
      var vx = state.velocity.dx, vy = state.velocity.dy;
      bool bounced = false;

      if (newX < minX) { newX = minX; vx = -vx * _cfg.bounceDamping; bounced = true; _emitBounce(id, Offset(newX, newY + nh / 2)); }
      else if (newX > maxX) { newX = maxX; vx = -vx * _cfg.bounceDamping; bounced = true; _emitBounce(id, Offset(newX + nw, newY + nh / 2)); }
      if (newY < minY) { newY = minY; vy = -vy * _cfg.bounceDamping; bounced = true; _emitBounce(id, Offset(newX + nw / 2, newY)); }
      else if (newY > maxY) { newY = maxY; vy = -vy * _cfg.bounceDamping; bounced = true; _emitBounce(id, Offset(newX + nw / 2, newY + nh)); }

      if (bounced) { vx *= _cfg.bounceFriction; vy *= _cfg.bounceFriction; _bounceScales[id] = 1.015; }
      state.velocity = Offset(vx, vy);
      state.position = Offset(newX, newY);
      positionUpdates[id] = state.position;
      if (state.velocity.distance < _cfg.minVelPxS) toRemove.add(id);
    }
    for (final id in toRemove) _activeMomentum.remove(id);

    setState(() {
      _nodes = _nodes.map((node) {
        final pos = positionUpdates[node.id];
        return pos == null ? node : node.copyWith(position: XYPosition(x: pos.dx, y: pos.dy));
      }).toList();
    });
  }

  void _emitBounce(String nodeId, Offset flowPos) {
    final controller = _controller;
    if (controller == null) return;
    final screenPos = controller.flowToScreen(flowPos);
    final node = _nodes.firstWhere((n) => n.id == nodeId, orElse: () => _nodes.first);
    final color = node.data.accentColor;
    final speed = _activeMomentum[nodeId]?.velocity.distance ?? 0;

    _activePulses.add(_PulseEvent(center: screenPos, startTime: _tickerSeconds, color: color));
    _Sound.playBounce((speed / _cfg.maxVelPxS).clamp(0.0, 1.0));

    if (_cfg.particlesEnabled) {
      final rng = Random();
      for (var i = 0; i < _cfg.particleCount; i++) {
        final angle = rng.nextDouble() * 2 * pi;
        final spd = 60 + rng.nextDouble() * 200;
        _particles.add(_Particle(
          position: screenPos,
          velocity: Offset(cos(angle) * spd, sin(angle) * spd - 60),
          size: 2 + rng.nextDouble() * 4,
          color: rng.nextDouble() < 0.4 ? const Color(0xFF60A5FA) : color,
          createdAt: _tickerSeconds,
          lifespan: _cfg.particleLifespan * (0.5 + rng.nextDouble() * 0.5),
          shape: rng.nextInt(2),
        ));
      }
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Slice gesture
  // ════════════════════════════════════════════════════════════════════════════

  void _onSliceStart(DragStartDetails details) { _sliceTrail = [details.localPosition]; }

  void _onSliceUpdate(DragUpdateDetails details) {
    final point = details.localPosition;
    setState(() => _sliceTrail = [..._sliceTrail, point]);
    if (_sliceTrail.length < 2) return;
    final p1 = _sliceTrail[_sliceTrail.length - 2];
    final p2 = _sliceTrail.last;
    final edgesToRemove = <String>[];

    for (final edge in _edges) {
      final sourceNode = _controller?.getInternalNode(edge.source);
      final targetNode = _controller?.getInternalNode(edge.target);
      if (sourceNode == null || targetNode == null) continue;
      final sPos = sourceNode.internals.positionAbsolute;
      final tPos = targetNode.internals.positionAbsolute;
      final sw = sourceNode.internals.measured?.width ?? _cfg.panelSize;
      final sh = sourceNode.internals.measured?.height ?? _cfg.panelSize;
      final th = targetNode.internals.measured?.height ?? _cfg.panelSize;
      final sx = sPos.x + sw; final sy = sPos.y + sh / 2;
      final tx = tPos.x; final ty = tPos.y + th / 2;
      final midX = (sx + tx) / 2;
      final c = _controller!;
      final a = c.flowToScreen(Offset(sx, sy));
      final b = c.flowToScreen(Offset(midX, sy));
      final cc = c.flowToScreen(Offset(midX, ty));
      final d = c.flowToScreen(Offset(tx, ty));

      if (_segIntersect(p1, p2, a, b) || _segIntersect(p1, p2, b, cc) || _segIntersect(p1, p2, cc, d)) {
        edgesToRemove.add(edge.id);
        _cutAnimations.add(_CutAnimation(
          sourcePos: a, targetPos: d,
          cutPoint: Offset((p1.dx + p2.dx) / 2, (p1.dy + p2.dy) / 2),
          startTime: _tickerSeconds, color: _S.edgeColor,
        ));
        _Sound.playCut();
      }
    }
    if (edgesToRemove.isNotEmpty) {
      setState(() => _edges = _edges.where((e) => !edgesToRemove.contains(e.id)).toList());
    }
  }

  void _onSliceEnd(DragEndDetails details) { setState(() => _sliceTrail = []); }

  bool _segIntersect(Offset a1, Offset a2, Offset b1, Offset b2) {
    final d1 = _cross(b2 - b1, a1 - b1), d2 = _cross(b2 - b1, a2 - b1);
    final d3 = _cross(a2 - a1, b1 - a1), d4 = _cross(a2 - a1, b2 - a1);
    if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true;
    return false;
  }

  double _cross(Offset a, Offset b) => a.dx * b.dy - a.dy * b.dx;

  // ════════════════════════════════════════════════════════════════════════════
  // Actions
  // ════════════════════════════════════════════════════════════════════════════

  void _onNodeResize(String nodeId, double deltaW, double deltaH) {
    setState(() {
      _nodes = _nodes.map((node) {
        if (node.id != nodeId) return node;
        final minSize = 80.0;
        final maxSize = 600.0;
        final newW = ((node.width ?? _cfg.panelSize) + deltaW).clamp(minSize, maxSize);
        final newH = ((node.height ?? _cfg.panelSize) + deltaH).clamp(minSize, maxSize);
        return node.copyWith(width: newW, height: newH);
      }).toList();
    });
  }

  void _clearAll() {
    _activeMomentum.clear(); _activePulses.clear(); _velocitySamples.clear();
    _particles.clear(); _cutAnimations.clear(); _bounceScales.clear();
    _spawnTimes.clear(); _sliceTrail = []; _connectionPaths = [];
    setState(() { _nodes = []; _edges = []; _nextIndex = 0; });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Build
  // ════════════════════════════════════════════════════════════════════════════

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: _S.canvasBg,
        canvasColor: Colors.transparent,
      ),
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: _S.surface,
          foregroundColor: _S.textPrimary,
          title: Row(children: [
            const Text('Robot Grid'),
            if (_nodes.isNotEmpty) ...[
              const SizedBox(width: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: _S.edgeColor.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text('${_nodes.length}',
                    style: const TextStyle(fontSize: 12, color: _S.edgeColor, fontWeight: FontWeight.w600)),
              ),
            ],
          ]),
          actions: [
            IconButton(
              icon: Icon(Icons.tune, color: _showDebugPanel ? _S.edgeColor : _S.textSecondary),
              tooltip: 'Physics Controls',
              onPressed: () => setState(() => _showDebugPanel = !_showDebugPanel),
            ),
            IconButton(
              icon: Icon(Icons.content_cut, color: _sliceMode ? const Color(0xFFFF7B72) : _S.textSecondary),
              tooltip: _sliceMode ? 'Exit slice mode' : 'Slice edges',
              onPressed: () => setState(() => _sliceMode = !_sliceMode),
            ),
            IconButton(
              icon: const Icon(Icons.delete_sweep, color: _S.textSecondary),
              tooltip: 'Clear all',
              onPressed: _nodes.isEmpty ? null : _clearAll,
            ),
            const SizedBox(width: 8),
          ],
        ),
        body: Row(children: [
          Expanded(child: Stack(children: [
            // Layer 1: Dynamic warping grid + glowing connections (behind everything)
            // Uses ListenableBuilder so grid repaints independently without rebuilding XYFlow
            Positioned.fill(child: ListenableBuilder(
              listenable: _effectsRepaint,
              builder: (context, _) => CustomPaint(
                painter: _DynamicGridPainter(
                  dots: _gridDots, dotMap: _gridMap, gridSize: _cfg.gridSize,
                  connections: _connectionPaths, mousePos: _mousePos,
                  cfg: _cfg, currentTime: _tickerSeconds,
                ),
              ),
            )),

            // Layer 2: XYFlow (nodes only, no background — grid paints underneath)
            Listener(
              onPointerDown: _onPointerDown,
              onPointerUp: _onPointerUp,
              onPointerHover: (e) => _mousePos = e.localPosition,
              onPointerMove: (e) => _mousePos = e.localPosition,
              child: XYFlow<RobotNodeData, void>(
                key: _xyflowKey,
                nodes: _nodes, edges: _edges,
                onNodesChange: _onNodesChange,
                onEdgesChange: _onEdgesChange,
                onConnect: _onConnect,
                onInit: (c) => _controller = c,
                onNodeDragStart: _onNodeDragStart,
                onNodeDrag: _onNodeDrag,
                onNodeDragStop: _onNodeDragStop,
                nodeTypes: {
                  'robot_panel': (props) => _RobotPanelNode(
                    props: props, cfg: _cfg,
                    isDragging: _draggingNodeId == props.id,
                    bounceScale: _bounceScales[props.id] ?? 1.0,
                    spawnProgress: _spawnProgress(props.id),
                    onResize: (dw, dh) => _onNodeResize(props.id, dw, dh),
                  ),
                },
                connectionLineType: ConnectionLineType.smoothStep,
                connectionMode: ConnectionMode.loose,
                defaultEdgeOptions: Edge<void>(
                  id: '', source: '', target: '',
                  type: EdgeTypes.smoothStep,
                  style: {'stroke': 0xFF58A6FF, 'strokeWidth': 2.0},
                ),
                deleteKeyCode: LogicalKeyboardKey.delete,
                fitView: false, minZoom: 0.2, maxZoom: 3.0,
                panOnDrag: !_sliceMode,
                children: [
                  Controls(
                    position: PanelPosition.bottomRight,
                    backgroundColor: _S.surface,
                    iconColor: _S.textSecondary,
                    borderColor: _S.border,
                  ),
                ],
              ),
            ),

            // Layer 3: Slice overlay
            if (_sliceMode)
              Positioned.fill(child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onPanStart: _onSliceStart,
                onPanUpdate: _onSliceUpdate,
                onPanEnd: _onSliceEnd,
                child: const SizedBox.expand(),
              )),

            // Layer 4: Effects overlay (particles, pulses, cut retraction, slice trail)
            // Uses ListenableBuilder so effects repaint independently
            Positioned.fill(child: IgnorePointer(child: ListenableBuilder(
              listenable: _effectsRepaint,
              builder: (context, _) => CustomPaint(
                painter: _EffectsPainter(
                  pulses: _activePulses, currentTime: _tickerSeconds,
                  sliceTrail: _sliceTrail, sliceMode: _sliceMode,
                  particles: _particles, cutAnimations: _cutAnimations, cfg: _cfg,
                ),
              ),
            ))),

            // Layer 5: Instructions
            Positioned(left: 16, bottom: 16, child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: _S.surface.withValues(alpha: 0.9),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: _S.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  _hint(Icons.touch_app, 'Click to spawn'),
                  const SizedBox(height: 4),
                  _hint(Icons.swipe, 'Drag to throw'),
                  const SizedBox(height: 4),
                  _hint(Icons.link, 'Connect handles'),
                  if (_sliceMode) ...[
                    const SizedBox(height: 4),
                    _hint(Icons.content_cut, 'Drag across edges to cut', color: const Color(0xFFFF7B72)),
                  ],
                ],
              ),
            )),
          ])),

          if (_showDebugPanel)
            _DebugPanel(cfg: _cfg, onChanged: () => setState(() {
              _Sound._enabled = _cfg.soundEnabled;
            })),
        ]),
      ),
    );
  }

  double _spawnProgress(String id) {
    final t = _spawnTimes[id];
    if (t == null) return 1.0;
    return min(1.0, (_tickerSeconds - t) / 0.3);
  }

  Widget _hint(IconData icon, String text, {Color? color}) => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Icon(icon, size: 14, color: color ?? _S.textSecondary),
      const SizedBox(width: 6),
      Text(text, style: TextStyle(fontSize: 11, color: color ?? _S.textSecondary)),
    ],
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Node widget
// ═══════════════════════════════════════════════════════════════════════════════

class _RobotPanelNode extends StatelessWidget {
  const _RobotPanelNode({
    required this.props, required this.cfg,
    required this.isDragging, required this.bounceScale, required this.spawnProgress,
    required this.onResize,
  });
  final NodeProps<RobotNodeData> props;
  final _SimConfig cfg;
  final bool isDragging;
  final double bounceScale;
  final double spawnProgress;
  final void Function(double deltaW, double deltaH) onResize;

  @override
  Widget build(BuildContext context) {
    final data = props.data;
    final selected = props.selected;
    final accent = data.accentColor;
    final nodeW = props.width ?? cfg.panelSize;
    final nodeH = props.height ?? cfg.panelSize;
    final yOff = isDragging ? cfg.dragYOffset : cfg.idleYOffset;
    final blur = isDragging ? cfg.dragBlur : cfg.idleBlur;
    final spread = isDragging ? cfg.dragSpread : cfg.idleSpread;
    final opacity = isDragging ? cfg.dragOpacity : cfg.idleOpacity;
    final scale = (isDragging ? cfg.dragScale : 1.0) * bounceScale *
        (0.8 + 0.2 * Curves.easeOut.transform(spawnProgress));
    final spawnOpacity = Curves.easeIn.transform(min(1.0, spawnProgress / 0.5));

    final handleStyle = HandleStyle(
      size: 14, color: accent.withValues(alpha: 0.6),
      hoverColor: accent, activeColor: const Color(0xFF00E5FF),
      borderColor: _S.border, borderWidth: 2,
    );

    const handleSize = 14.0;
    // Widen node so connection handles sit at the true edges
    final totalWidth = nodeW + handleSize;

    return Opacity(
      opacity: spawnOpacity,
      child: Transform.scale(
        scale: scale,
        child: SizedBox(
          width: totalWidth, height: nodeH,
          child: Stack(
            children: [
              // Panel body — inset by half-handle on each side
              Positioned(
                left: handleSize / 2, right: handleSize / 2,
                top: 0, bottom: 0,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 150),
                  curve: Curves.easeOut,
                  decoration: BoxDecoration(
                    color: _S.surfaceLight,
                    borderRadius: BorderRadius.circular(_S.borderRadius),
                    border: Border.all(
                      color: selected ? _S.borderHighlight : _S.border.withValues(alpha: isDragging ? 0.16 : 0.1),
                      width: selected ? 2 : 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: (selected ? accent : Colors.black).withValues(alpha: opacity),
                        blurRadius: blur, spreadRadius: spread, offset: Offset(0, yOff),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(_S.borderRadius - 1),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Container(height: 6, color: accent),
                        Expanded(child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                            Icon(Icons.grid_view_rounded, color: accent.withValues(alpha: 0.7), size: 32),
                            const SizedBox(height: 8),
                            Text(data.label, style: const TextStyle(color: _S.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
                            const SizedBox(height: 2),
                            Text('#${data.index}', style: const TextStyle(color: _S.textSecondary, fontSize: 11)),
                          ]),
                        )),
                      ],
                    ),
                  ),
                ),
              ),
              // Left handle (target) — centered on left edge of panel body
              Positioned(
                left: 0, top: nodeH / 2 - handleSize / 2,
                child: HandleWidget(type: HandleType.target, position: Position.left, style: handleStyle),
              ),
              // Right handle (source) — centered on right edge of panel body
              Positioned(
                right: 0, top: nodeH / 2 - handleSize / 2,
                child: HandleWidget(type: HandleType.source, position: Position.right, style: handleStyle),
              ),
              // Bottom-right resize handle
              Positioned(
                right: handleSize / 2, bottom: 0,
                child: MouseRegion(
                  cursor: SystemMouseCursors.resizeUpLeftDownRight,
                  child: GestureDetector(
                    onPanUpdate: (details) => onResize(details.delta.dx, details.delta.dy),
                    child: Container(
                      width: 18, height: 18,
                      decoration: BoxDecoration(
                        color: accent.withValues(alpha: 0.3),
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(4),
                          bottomRight: Radius.circular(_S.borderRadius),
                        ),
                      ),
                      child: Icon(Icons.open_in_full, size: 10,
                          color: accent.withValues(alpha: 0.7)),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Dynamic grid painter – dots, lines, glowing connections
// ═══════════════════════════════════════════════════════════════════════════════

class _DynamicGridPainter extends CustomPainter {
  _DynamicGridPainter({
    required this.dots, required this.dotMap, required this.gridSize,
    required this.connections, required this.mousePos,
    required this.cfg, required this.currentTime,
  });
  final List<_GridDot> dots;
  final Map<String, _GridDot> dotMap;
  final double gridSize;
  final List<_ConnPath> connections;
  final Offset? mousePos;
  final _SimConfig cfg;
  final double currentTime;

  @override
  void paint(Canvas canvas, Size size) {
    // Clip to viewport
    canvas.clipRect(Offset.zero & size);
    _drawGridLines(canvas);
    _drawGridDots(canvas);
    _drawConnections(canvas);
  }

  double _hoverGlow(double x, double y) {
    if (mousePos == null) return 0;
    final dx = x - mousePos!.dx, dy = y - mousePos!.dy;
    final dist = sqrt(dx * dx + dy * dy);
    if (dist > cfg.gridHoverRadius) return 0;
    return pow(1 - dist / cfg.gridHoverRadius, 2).toDouble() * 0.6;
  }

  void _drawGridLines(Canvas canvas) {
    for (final dot in dots) {
      final right = dotMap['${dot.ix + 1},${dot.iy}'];
      if (right != null) _drawLine(canvas, dot, right);
      final bottom = dotMap['${dot.ix},${dot.iy + 1}'];
      if (bottom != null) _drawLine(canvas, dot, bottom);
    }
  }

  void _drawLine(Canvas canvas, _GridDot a, _GridDot b) {
    final avgBright = (a.brightness + b.brightness) / 2;
    final hg = max(_hoverGlow(a.x, a.y), _hoverGlow(b.x, b.y));
    final effect = max(avgBright * 0.5, hg);
    final opacity = (cfg.gridBaseOpacity + effect * 0.7).clamp(0.0, 1.0);
    // Blend from grey to blue based on hover intensity
    final r = (130 + effect * (88 - 130)).round().clamp(88, 200);
    final g = (130 + effect * (166 - 130)).round().clamp(130, 220);
    final bv = (130 + effect * (255 - 130)).round().clamp(130, 255);
    canvas.drawLine(
      Offset(a.x, a.y), Offset(b.x, b.y),
      Paint()
        ..color = Color.fromRGBO(r, g, bv, opacity)
        ..strokeWidth = 0.5 + effect * 1.5
        ..strokeCap = StrokeCap.round,
    );
  }

  void _drawGridDots(Canvas canvas) {
    for (final dot in dots) {
      final hg = _hoverGlow(dot.x, dot.y);
      final effect = max(dot.brightness, hg);
      final baseOp = 0.12;
      final boost = effect * 0.8;
      final opacity = (baseOp + boost).clamp(0.0, 1.0);
      // Blend from grey to blue based on hover/proximity
      final r = (130 + effect * (88 - 130)).round().clamp(88, 200);
      final g = (130 + effect * (166 - 130)).round().clamp(130, 220);
      final bv = (130 + effect * (255 - 130)).round().clamp(130, 255);
      canvas.drawCircle(
        Offset(dot.x, dot.y), dot.size,
        Paint()..color = Color.fromRGBO(r, g, bv, opacity),
      );
      // Add blue glow halo for strong hover
      if (hg > 0.3) {
        canvas.drawCircle(
          Offset(dot.x, dot.y), dot.size + 2,
          Paint()..color = Color.fromRGBO(88, 166, 255, (hg - 0.3) * 0.4),
        );
      }
    }
  }

  void _drawConnections(Canvas canvas) {
    for (final conn in connections) {
      if (conn.points.length < 2) continue;

      // Build smooth path through displaced grid points
      final path = Path();
      final pts = conn.points;
      path.moveTo(pts[0].dx, pts[0].dy);

      if (pts.length == 2) {
        path.lineTo(pts[1].dx, pts[1].dy);
      } else {
        for (var i = 1; i < pts.length - 1; i++) {
          final curr = pts[i];
          final next = pts[i + 1];
          final midX = (curr.dx + next.dx) / 2;
          final midY = (curr.dy + next.dy) / 2;
          path.quadraticBezierTo(curr.dx, curr.dy, midX, midY);
        }
        path.lineTo(pts.last.dx, pts.last.dy);
      }

      // Base connection line
      canvas.drawPath(path, Paint()
        ..color = const Color(0xFF3B82F6).withValues(alpha: 0.7)
        ..strokeWidth = 2
        ..strokeCap = StrokeCap.round
        ..style = PaintingStyle.stroke);

      // Flowing glow pulses along the path
      _drawGlowPulses(canvas, pts);
    }
  }

  void _drawGlowPulses(Canvas canvas, List<Offset> pts) {
    if (pts.length < 2) return;

    // Calculate cumulative distances
    final cumDist = [0.0];
    for (var i = 1; i < pts.length; i++) {
      cumDist.add(cumDist.last + (pts[i] - pts[i - 1]).distance);
    }
    final totalLen = cumDist.last;
    if (totalLen < 1) return;

    const speed = 120.0; // px/s
    const pulseSpacing = 100.0;
    const pulseWidth = 60.0;

    for (var i = 0; i < pts.length - 1; i++) {
      final segMid = (cumDist[i] + cumDist[i + 1]) / 2;
      var brightness = 0.0;
      final flowPos = (currentTime * speed) % pulseSpacing;

      for (var offset = -pulseSpacing; offset <= totalLen + pulseSpacing; offset += pulseSpacing) {
        final pulseCenter = flowPos + offset;
        final dist = (segMid - pulseCenter).abs();
        if (dist < pulseWidth) {
          final intensity = (cos(dist / pulseWidth * pi) + 1) / 2;
          brightness = max(brightness, intensity);
        }
      }

      if (brightness > 0.02) {
        canvas.drawLine(pts[i], pts[i + 1], Paint()
          ..color = Color.fromRGBO(0, 200, 255, brightness * 0.9)
          ..strokeWidth = 2 + brightness * 1.5
          ..strokeCap = StrokeCap.round
          ..style = PaintingStyle.stroke);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _DynamicGridPainter old) => true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Effects painter – particles, pulses, cut retraction, slice trail
// ═══════════════════════════════════════════════════════════════════════════════

class _EffectsPainter extends CustomPainter {
  _EffectsPainter({
    required this.pulses, required this.currentTime,
    required this.sliceTrail, required this.sliceMode,
    required this.particles, required this.cutAnimations, required this.cfg,
  });
  final List<_PulseEvent> pulses;
  final double currentTime;
  final List<Offset> sliceTrail;
  final bool sliceMode;
  final List<_Particle> particles;
  final List<_CutAnimation> cutAnimations;
  final _SimConfig cfg;

  @override
  void paint(Canvas canvas, Size size) {
    _drawPulses(canvas);
    _drawParticles(canvas);
    _drawCutAnimations(canvas);
    _drawSliceTrail(canvas);
  }

  void _drawPulses(Canvas canvas) {
    for (final pulse in pulses) {
      final elapsed = currentTime - pulse.startTime;
      if (elapsed < 0 || elapsed > cfg.pulseDuration) continue;
      final t = elapsed / cfg.pulseDuration;
      final radius = elapsed * cfg.pulseSpeed;
      final opacity = (1.0 - t) * 0.4;
      if (opacity <= 0) continue;
      canvas.drawCircle(pulse.center, radius, Paint()
        ..color = pulse.color.withValues(alpha: opacity)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.0 * (1.0 - t * 0.5));
      if (elapsed > 0.1) {
        final r2 = (elapsed - 0.1) * cfg.pulseSpeed;
        final o2 = (1.0 - t) * 0.2;
        if (o2 > 0) {
          canvas.drawCircle(pulse.center, r2, Paint()
            ..color = pulse.color.withValues(alpha: o2)
            ..style = PaintingStyle.stroke
            ..strokeWidth = 1.5 * (1.0 - t * 0.5));
        }
      }
    }
  }

  void _drawParticles(Canvas canvas) {
    for (final p in particles) {
      final age = currentTime - p.createdAt;
      if (age > p.lifespan) continue;
      final t = age / p.lifespan;
      final opacity = (1.0 - t).clamp(0.0, 1.0);
      if (opacity <= 0) continue;
      final paint = Paint()..color = p.color.withValues(alpha: opacity * 0.8);
      if (p.shape == 0) {
        canvas.drawCircle(p.position, p.size * (1.0 - t * 0.3), paint);
      } else {
        final s = p.size * (1.0 - t * 0.3);
        canvas.drawRRect(
          RRect.fromRectAndRadius(Rect.fromCenter(center: p.position, width: s * 1.6, height: s * 1.6), Radius.circular(s * 0.2)),
          paint,
        );
      }
    }
  }

  void _drawCutAnimations(Canvas canvas) {
    for (final cut in cutAnimations) {
      final elapsed = currentTime - cut.startTime;
      if (elapsed > 0.4) continue;
      final t = (elapsed / 0.4).clamp(0.0, 1.0);
      final opacity = 1.0 - t;
      final srcStart = Offset.lerp(cut.sourcePos, cut.cutPoint, t)!;
      final tgtStart = Offset.lerp(cut.targetPos, cut.cutPoint, t)!;
      final paint = Paint()
        ..color = cut.color.withValues(alpha: opacity * 0.7)
        ..style = PaintingStyle.stroke ..strokeWidth = 2.0 ..strokeCap = StrokeCap.round;
      canvas.drawLine(srcStart, cut.cutPoint, paint);
      canvas.drawLine(tgtStart, cut.cutPoint, paint);
    }
  }

  void _drawSliceTrail(Canvas canvas) {
    if (!sliceMode || sliceTrail.length < 2) return;
    final path = Path()..moveTo(sliceTrail.first.dx, sliceTrail.first.dy);
    for (var i = 1; i < sliceTrail.length; i++) path.lineTo(sliceTrail[i].dx, sliceTrail[i].dy);
    canvas.drawPath(path, Paint()
      ..color = const Color(0xFFFF7B72).withValues(alpha: 0.7)
      ..style = PaintingStyle.stroke ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round ..strokeJoin = StrokeJoin.round);
    canvas.drawPath(path, Paint()
      ..color = const Color(0xFFFF7B72).withValues(alpha: 0.2)
      ..style = PaintingStyle.stroke ..strokeWidth = 6.0
      ..strokeCap = StrokeCap.round ..strokeJoin = StrokeJoin.round
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4));
  }

  @override
  bool shouldRepaint(covariant _EffectsPainter old) =>
      pulses.isNotEmpty || old.pulses.isNotEmpty || particles.isNotEmpty || old.particles.isNotEmpty ||
      cutAnimations.isNotEmpty || old.cutAnimations.isNotEmpty || sliceTrail.isNotEmpty || old.sliceTrail.isNotEmpty;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Debug panel
// ═══════════════════════════════════════════════════════════════════════════════

class _DebugPanel extends StatefulWidget {
  const _DebugPanel({required this.cfg, required this.onChanged});
  final _SimConfig cfg;
  final VoidCallback onChanged;
  @override
  State<_DebugPanel> createState() => _DebugPanelState();
}

class _DebugPanelState extends State<_DebugPanel> {
  final Map<String, bool> _expanded = {
    'physics': true, 'visual': false, 'shadows': false,
    'grid': true, 'particles': false, 'presets': true, 'sound': false,
  };
  _SimConfig get c => widget.cfg;

  void _set(VoidCallback fn) { setState(() => fn()); widget.onChanged(); }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 280, color: _S.panelBg,
      child: Column(children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: _S.border, width: 1))),
          child: const Row(children: [
            Expanded(child: Text('Node Grid Controls',
                style: TextStyle(color: _S.textSecondary, fontSize: 12, fontWeight: FontWeight.w500),
                textAlign: TextAlign.center)),
          ]),
        ),
        Expanded(child: ListView(padding: EdgeInsets.zero, children: [
          _section('physics', 'Physics', [
            _slider('Max Velocity', c.maxVelocity, 5, 100, (v) => c.maxVelocity = v),
            _slider('Base Friction', c.baseFriction, 0.9, 0.999, (v) => c.baseFriction = v, decimals: 3),
            _slider('Hi-Spd Friction', c.highSpeedFriction, 0.8, 0.999, (v) => c.highSpeedFriction = v, decimals: 2),
            _slider('Bounce Damping', c.bounceDamping, 0.1, 0.99, (v) => c.bounceDamping = v, decimals: 2),
            _slider('Bounce Friction', c.bounceFriction, 0.5, 0.99, (v) => c.bounceFriction = v, decimals: 2),
            _slider('Min Velocity', c.minVelocity, 0.01, 1.0, (v) => c.minVelocity = v, decimals: 2),
            _slider('Mom Threshold', c.momentumThreshold, 0.1, 10.0, (v) => c.momentumThreshold = v, decimals: 1),
            _slider('Vel Samples', c.velocitySamples.toDouble(), 2, 20, (v) => c.velocitySamples = v.round(), decimals: 0),
          ]),
          _section('grid', 'Grid', [
            _slider('Push Strength', c.gridPushStrength, 0, 60, (v) => c.gridPushStrength = v, decimals: 0),
            _slider('Max Distance', c.gridMaxDist, 100, 800, (v) => c.gridMaxDist = v, decimals: 0),
            _slider('Spring Stiff', c.gridSpringStiffness, 0.01, 0.3, (v) => c.gridSpringStiffness = v, decimals: 3),
            _slider('Damping', c.gridDamping, 0.5, 0.95, (v) => c.gridDamping = v, decimals: 2),
            _slider('Hover Radius', c.gridHoverRadius, 40, 300, (v) => c.gridHoverRadius = v, decimals: 0),
            _slider('Base Opacity', c.gridBaseOpacity, 0, 0.2, (v) => c.gridBaseOpacity = v, decimals: 3),
            _slider('Bright Radius', c.gridBrightnessRadius, 30, 300, (v) => c.gridBrightnessRadius = v, decimals: 0),
          ]),
          _section('visual', 'Visual', [
            _slider('Boundary Margin', c.boundaryMargin, 0, 60, (v) => c.boundaryMargin = v, decimals: 0),
            _slider('Drag Scale', c.dragScale, 1.0, 1.1, (v) => c.dragScale = v, decimals: 3),
            _slider('Panel Size', c.panelSize, 80, 320, (v) => c.panelSize = v, decimals: 0),
          ]),
          _section('shadows', 'Shadows', [
            _slider('Idle Y', c.idleYOffset, 0, 60, (v) => c.idleYOffset = v, decimals: 0),
            _slider('Idle Blur', c.idleBlur, 0, 80, (v) => c.idleBlur = v, decimals: 0),
            _slider('Idle Spread', c.idleSpread, -30, 10, (v) => c.idleSpread = v, decimals: 0),
            _slider('Idle Opacity', c.idleOpacity, 0, 1, (v) => c.idleOpacity = v, decimals: 2),
            _slider('Drag Y', c.dragYOffset, 0, 60, (v) => c.dragYOffset = v, decimals: 0),
            _slider('Drag Blur', c.dragBlur, 0, 80, (v) => c.dragBlur = v, decimals: 0),
            _slider('Drag Spread', c.dragSpread, -30, 10, (v) => c.dragSpread = v, decimals: 0),
            _slider('Drag Opacity', c.dragOpacity, 0, 1, (v) => c.dragOpacity = v, decimals: 2),
          ]),
          _section('particles', 'Particles', [
            _toggle('Enabled', c.particlesEnabled, (v) => c.particlesEnabled = v),
            _slider('Count', c.particleCount.toDouble(), 0, 40, (v) => c.particleCount = v.round(), decimals: 0),
            _slider('Lifespan', c.particleLifespan, 0.5, 5, (v) => c.particleLifespan = v, decimals: 1),
            _slider('Gravity', c.particleGravity, 0, 400, (v) => c.particleGravity = v, decimals: 0),
            _slider('Pulse Speed', c.pulseSpeed, 100, 800, (v) => c.pulseSpeed = v, decimals: 0),
            _slider('Pulse Duration', c.pulseDuration, 0.5, 5, (v) => c.pulseDuration = v, decimals: 1),
          ]),
          _section('sound', 'Sound', [
            _toggle('Enabled', c.soundEnabled, (v) => c.soundEnabled = v),
          ]),
          _section('presets', 'Presets', [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              child: Wrap(spacing: 6, runSpacing: 6, children: [
                _presetBtn('Default', () => _set(() => c.reset())),
                _presetBtn('Zero G', () => _set(() => c.applyPreset('zero_g'))),
                _presetBtn('Bouncy', () => _set(() => c.applyPreset('bouncy'))),
                _presetBtn('Floaty', () => _set(() => c.applyPreset('floaty'))),
                _presetBtn('Chaos', () => _set(() => c.applyPreset('chaos'))),
              ]),
            ),
          ]),
        ])),
      ]),
    );
  }

  Widget _section(String key, String title, List<Widget> children) {
    final expanded = _expanded[key] ?? true;
    return Column(mainAxisSize: MainAxisSize.min, children: [
      InkWell(
        onTap: () => setState(() => _expanded[key] = !expanded),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: const BoxDecoration(
            color: _S.panelSection,
            border: Border(bottom: BorderSide(color: _S.border, width: 0.5)),
          ),
          child: Row(children: [
            Expanded(child: Text(title,
                style: const TextStyle(color: _S.textSecondary, fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 0.5))),
            Icon(expanded ? Icons.unfold_less : Icons.unfold_more, size: 14, color: _S.textSecondary),
          ]),
        ),
      ),
      if (expanded) ...children,
    ]);
  }

  Widget _slider(String label, double value, double mn, double mx,
      ValueChanged<double> onChanged, {int decimals = 1}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
      child: Row(children: [
        SizedBox(width: 90, child: Text(label, style: const TextStyle(color: _S.textSecondary, fontSize: 11))),
        Expanded(child: SliderTheme(
          data: SliderThemeData(
            trackHeight: 2,
            thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 5),
            activeTrackColor: _S.textSecondary.withValues(alpha: 0.4),
            inactiveTrackColor: _S.border,
            thumbColor: _S.textSecondary,
            overlayShape: const RoundSliderOverlayShape(overlayRadius: 12),
          ),
          child: Slider(value: value.clamp(mn, mx), min: mn, max: mx, onChanged: (v) => _set(() => onChanged(v))),
        )),
        SizedBox(width: 45, child: Text(
          decimals == 0 ? value.round().toString() : value.toStringAsFixed(decimals),
          style: const TextStyle(color: _S.textSecondary, fontSize: 11), textAlign: TextAlign.right,
        )),
      ]),
    );
  }

  Widget _toggle(String label, bool value, ValueChanged<bool> onChanged) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      child: Row(children: [
        SizedBox(width: 90, child: Text(label, style: const TextStyle(color: _S.textSecondary, fontSize: 11))),
        SizedBox(width: 20, height: 20, child: Checkbox(
          value: value, onChanged: (v) => _set(() => onChanged(v ?? false)),
          activeColor: _S.edgeColor, side: const BorderSide(color: _S.textSecondary),
          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
        )),
      ]),
    );
  }

  Widget _presetBtn(String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(color: _S.surfaceLight, borderRadius: BorderRadius.circular(4), border: Border.all(color: _S.border)),
        child: Text(label, style: const TextStyle(color: _S.textSecondary, fontSize: 11)),
      ),
    );
  }
}
