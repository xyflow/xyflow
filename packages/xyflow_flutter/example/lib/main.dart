import 'package:flutter/material.dart';
import 'examples/drag_and_drop.dart';
import 'examples/basic_flow.dart';
import 'examples/custom_nodes.dart';
import 'examples/edge_types.dart';
import 'examples/story_flow.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'XYFlow Flutter Examples',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const ExampleSelector(),
    );
  }
}

/// Example selector home page.
class ExampleSelector extends StatelessWidget {
  const ExampleSelector({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('XYFlow Flutter Examples'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _ExampleCard(
            title: 'Basic Flow',
            description: 'Simple flow with nodes, edges, controls, and minimap.',
            icon: Icons.account_tree,
            color: Colors.blue,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const BasicFlowExample()),
            ),
          ),
          _ExampleCard(
            title: 'Drag & Drop',
            description: 'Drag nodes from sidebar onto the canvas.',
            icon: Icons.drag_indicator,
            color: Colors.green,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const DragAndDropExample()),
            ),
          ),
          _ExampleCard(
            title: 'Custom Nodes',
            description: 'Create custom node types with different styles.',
            icon: Icons.widgets,
            color: Colors.purple,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const CustomNodesExample()),
            ),
          ),
          _ExampleCard(
            title: 'Edge Types',
            description: 'Different edge types: bezier, step, smoothstep, straight.',
            icon: Icons.linear_scale,
            color: Colors.orange,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const EdgeTypesExample()),
            ),
          ),
          _ExampleCard(
            title: 'Story Flow',
            description: 'ComfyUI-style dark theme for branching narratives with images.',
            icon: Icons.auto_stories,
            color: Colors.teal,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const StoryFlowExample()),
            ),
          ),
        ],
      ),
    );
  }
}

class _ExampleCard extends StatelessWidget {
  const _ExampleCard({
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  final String title;
  final String description;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: color),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(description),
        ),
        trailing: Icon(Icons.arrow_forward_ios, color: Colors.grey[400]),
        onTap: onTap,
      ),
    );
  }
}
