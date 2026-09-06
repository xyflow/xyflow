![xyflow-header](https://user-images.githubusercontent.com/2857535/279643999-ffda9f91-6b6d-447d-82be-fcbd6103edb6.svg#gh-light-mode-only)
![xyflow-header-dark](https://user-images.githubusercontent.com/2857535/279644026-a01c231c-6c6e-4b41-96e0-a85c75c9acee.svg#gh-dark-mode-only)

<div align="center">

![GitHub License MIT](https://img.shields.io/github/license/wbkd/react-flow?color=%23ff0072)
![npm downloads](https://img.shields.io/npm/dt/reactflow?color=%23FF0072&label=React%20Flow%20downloads)
![npm downloads](https://img.shields.io/npm/dt/@xyflow/svelte?color=%23FF3E00&label=Svelte%20Flow%20downloads)

Powerful open source libraries for building node-based UIs with React or Svelte. Ready out-of-the-box and infinitely customizable.

[React Flow](https://reactflow.dev/) · [Svelte Flow](https://svelteflow.dev/) · [React Flow Pro](https://reactflow.dev/pro) · [Discord](https://discord.gg/Bqt6xrs)
</div>

---

## The xyflow mono repo

The xyflow repository is the home of four packages:
* React Flow 12 `@xyflow/react` [packages/react](./packages/react)
* React Flow 11 `reactflow` [v11 branch](https://github.com/xyflow/xyflow/tree/v11)
* Svelte Flow `@xyflow/svelte` [packages/svelte](./packages/svelte)
* Shared helper library `@xyflow/system` [packages/system](./packages/system)

## Commercial usage

**Are you using React Flow or Svelte Flow for a personal project?** Great! No sponsorship needed, you can support us by reporting any bugs you find, sending us screenshots of your projects, and starring us on Github 🌟

**Are you using React Flow or Svelte Flow at your organization and making money from it?** Awesome! We rely on your support to keep our libraries developed and maintained under an MIT License, just how we like it. For React Flow you can do that on the [React Flow Pro website](https://reactflow.dev/pro) and for both of our libraries you can do it through [Github Sponsors](https://github.com/sponsors/xyflow).

## Getting started

The best way to get started is to check out the [React Flow](https://reactflow.dev/learn) or [Svelte Flow](https://svelteflow.dev/learn) learn section. However if you want to get a sneak peek of how to install and use the libraries you can see it here: 

<details>
  <summary><strong>React Flow</strong> basic usage</summary>

  ### Installation
  
  ```sh
npm install @xyflow/react
  ```

  ### Basic usage
  ```jsx
import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}

export default Flow;
```
</details>

<details>
  <summary><strong>Svelte Flow</strong> basic usage</summary>

  ### Installation
  
  ```sh
npm install @xyflow/svelte
  ```

  ### Basic usage
  ```svelte
<script lang="ts">
  import { writable } from 'svelte/store';
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
  } from '@xyflow/svelte';

  import '@xyflow/svelte/dist/style.css'
  
  const nodes = writable([
    {
      id: '1',
      type: 'input',
      data: { label: 'Input Node' },
      position: { x: 0, y: 0 }
    },
    {
      id: '2',
      type: 'custom',
      data: { label: 'Node' },
      position: { x: 0, y: 150 }
    }
  ]);

  const edges = writable([
    {
      id: '1-2',
      type: 'default',
      source: '1',
      target: '2',
      label: 'Edge Text'
    }
  ]);
</script>

<SvelteFlow
  {nodes}
  {edges}
  fitView
  on:nodeclick={(event) => console.log('on node click', event)}
>
  <Controls />
  <Background variant={BackgroundVariant.Dots} />
  <MiniMap />
</SvelteFlow>
```
</details>

## Releases 

For releasing packages we are using [changesets](https://github.com/changesets/changesets) in combination with the [changeset Github action](https://github.com/changesets/action). The rough idea is:

1. create PRs for new features, updates and fixes (with a changeset if relevant for changelog)
2. merge into main 
3. changeset creates a PR that bumps all packages based on the changesets 
4. merge changeset PR if you want to release to Github and npm

## Built by [xyflow](https://xyflow.com)

React Flow and Svelte Flow are maintained by the [xyflow team](https://xyflow.com/about). If you need help or want to talk to us about a collaboration, reach out through our [contact form](https://xyflow.com/contact) or by joining our [Discord Server](https://discord.gg/Bqt6xrs).

## License

React Flow and Svelte Flow are [MIT licensed](./LICENSE).


## 🌐 Web Resources & Interactive Index
- [CATEGORY MONSTER206](https://quizverses.github.io/category-monster206.html)
- [RIFT OF HELL DEMONS WAR](https://learnquesters.pages.dev/rift-of-hell-demons-war.html)
- [STICKMAN JUMP](https://quizverses-9d2f2.web.app/stickman-jump.html)
- [DRAWER SORT](https://quizverses.github.io/drawer-sort.html)
- [SQUID GAME ORIGINAL](https://quizverses.github.io/squid-game-original.html)
- [CRAFTSMAN 3D GANGSTER](https://quizverses.github.io/craftsman-3d-gangster.html)
- [INDEX30](https://quizverses.github.io/index30.html)
- [LOVE TILE TRIO](https://themindplay.pages.dev/love-tile-trio.html)
- [SLINGSHOT MASTER](https://theskillquest.pages.dev/slingshot-master.html)
- [RAMP CAR JUMPING](https://iskillquest.pages.dev/ramp-car-jumping.html)
- [ROBYBOX SPACE STATION WAREHOUSE](https://thequizzone.pages.dev/robybox-space-station-warehouse.html)
- [COLORWARSIO](https://theskillquest.pages.dev/colorwarsio.html)
- [CATEGORY SURVIVAL](https://themindzone.pages.dev/category-survival.html)
- [BUBBLE POP FAIRYLAND](https://iskillquest.pages.dev/bubble-pop-fairyland.html)
- [CATEGORY ROBOT49](https://learnquester.github.io/category-robot49.html)
- [GEOMETRY VERTICAL](https://thequizzone.pages.dev/geometry-vertical.html)
- [ANIMAL TRANSFORM RACE](https://iskillquest.pages.dev/animal-transform-race.html)
- [K POP HUNTER HALLOWEEN FASHION](https://studyquests.github.io/k-pop-hunter-halloween-fashion.html)
- [DREAM WEDDING PLANNER](https://thelearnquester.web.app/dream-wedding-planner.html)
- [CATEGORY CARE](https://studyplayings.pages.dev/category-care.html)
- [INDEX33](https://quizverses.github.io/index33.html)
- [LABUBU DOLL MUKBANG ASMR UNBLOCKED](https://theskillquest.pages.dev/labubu-doll-mukbang-asmr-unblocked.html)
- [PERFECT CAKE MAKER](https://iskillquest.pages.dev/perfect-cake-maker.html)
- [BALING BUM](https://iskillquest.pages.dev/baling-bum.html)
- [CATEGORY PROXY](https://studyplayings.pages.dev/category-proxy.html)
- [MERGE FOOD PUZZLE](https://iskillquest.pages.dev/merge-food-puzzle.html)
- [CHIBI DOLL COLORING DRESS UP](https://themindzone.pages.dev/chibi-doll-coloring-dress-up.html)
- [CATEGORY WEBGAME](https://iskillquest.pages.dev/category-webgame.html)
- [ICE FISHING 3D](https://thelearnquester.web.app/ice-fishing-3d.html)
- [OBBY PARKOUR RACING](https://quizverses-9d2f2.web.app/obby-parkour-racing.html)
- [HIDDEN OBJECTS](https://themindzone.pages.dev/hidden-objects.html)
- [STREET BALL JAM](https://iskillquest.pages.dev/street-ball-jam.html)
- [CARD MASTER](https://thequizzone.pages.dev/card-master.html)
- [MONSTER MAKEUP 3D](https://quizverses.pages.dev/monster-makeup-3d.html)
- [ART SALON](https://quizverses.pages.dev/art-salon.html)
- [MR RECKLESS CAR CHASE SIMULATOR](https://iskillquest.pages.dev/mr-reckless-car-chase-simulator.html)
- [CATEGORY STICKMAN 2](https://iskillquest.pages.dev/category-stickman-2.html)
- [CATEGORY IBOSS](https://thelearnquester.web.app/category-iboss.html)
- [CAT ESCAPE HIDE AND SEEK](https://themindzone.pages.dev/cat-escape-hide-and-seek.html)
- [INTERIOR DESIGNER DECOR LIFE](https://iskillquest.pages.dev/interior-designer-decor-life.html)
- [HAPPY FRUIT LINK](https://theskillquest.pages.dev/happy-fruit-link.html)
- [STICKMAN ESCAPES FROM PRISON](https://themindzone.pages.dev/stickman-escapes-from-prison.html)
- [CATEGORY PUZZLE 5](https://quizverses-9d2f2.web.app/category-puzzle-5.html)
- [PERFECT TIDY](https://quizverses.pages.dev/perfect-tidy.html)
- [STEAM SORTER](https://studyplaying.github.io/steam-sorter.html)
- [CHILL CLICKER](https://themindzone.pages.dev/chill-clicker.html)
- [MAGIC FLOW](https://themindzone.pages.dev/magic-flow.html)
- [SEA BATTLE ADMIRAL](https://studyplaying.github.io/sea-battle-admiral.html)
- [MY LITTLE CAR WASH](https://themindzone.pages.dev/my-little-car-wash.html)
- [WOOD SCREW PUZZLE](https://iskillquest.pages.dev/wood-screw-puzzle.html)
- [CATEGORY CASUAL969](https://studyplayings.pages.dev/category-casual969.html)
- [CATEGORY SOLITAIRE27](https://studyplayings.web.app/category-solitaire27.html)
- [TOW N GO](https://quizverses.github.io/tow-n-go.html)
- [DRAW BRIDGE BRAIN GAME](https://studyplayings.pages.dev/draw-bridge-brain-game.html)
- [PARK THEM ALL](https://thequizzone.pages.dev/park-them-all.html)
- [BOYFRIEND FOR HIRE](https://quizverses.github.io/boyfriend-for-hire.html)
- [ROYAL REBELLION PUNK MAGIC](https://studyplayings.pages.dev/royal-rebellion-punk-magic.html)
- [OFFROAD JEEP GAME SIMULATOR](https://studyplaying.github.io/offroad-jeep-game-simulator.html)
- [CATEGORY FIGHTING](https://studyplaying.github.io/category-fighting.html)
- [TOWER DEFENSE](https://themindzone.pages.dev/tower-defense.html)
- [PAPER DOLL DIARY CHIBI DOLLS](https://themindzone.pages.dev/paper-doll-diary-chibi-dolls.html)
- [TICTOC BRAIDED HAIRSTYLES](https://studyplayings.pages.dev/tictoc-braided-hairstyles.html)
- [COLLEGE GIRL COLORING DRESS UP](https://studyplayings.pages.dev/college-girl-coloring-dress-up.html)
- [ARROW ESCAPE](https://theskillquest.pages.dev/arrow-escape.html)
- [DIVINEX](https://iskillquest.pages.dev/divinex.html)
- [UNCLE HIT PUNCH THE DUMMY](https://theskillquest.pages.dev/uncle-hit-punch-the-dummy.html)
- [BUBBLE SHOOTER GO](https://iskillquest.pages.dev/bubble-shooter-go.html)
- [CRAZYZOMBIES 3D](https://themindzone.pages.dev/crazyzombies-3d.html)
- [CATEGORY HORROR 2](https://studyquesthub.web.app/category-horror-2.html)
- [VOXIOM IO](https://theskillquest.pages.dev/voxiom-io.html)
- [TIKTOK TRENDS COLORED DENIM](https://thequizzone.pages.dev/tiktok-trends-colored-denim.html)
- [CATEGORY DRESS UP](https://quizverses.github.io/category-dress-up.html)
- [CATEGORY ADVENTURE 2](https://learnquester.github.io/category-adventure-2.html)
- [GUN SHOOTING RANGE](https://theskillquest.pages.dev/gun-shooting-range.html)
- [TIC TAC TOE MERGE](https://themindzone.pages.dev/tic-tac-toe-merge.html)
- [HEXA SORT](https://themindzone.pages.dev/hexa-sort.html)
- [INDEX23](https://theskillquest.pages.dev/index23.html)
- [ASMR TATTOO TREATMENT](https://themindzone.pages.dev/asmr-tattoo-treatment.html)
- [HAPPY FLUFFY CUBES](https://themindzone.pages.dev/happy-fluffy-cubes.html)
- [OFFROAD ISLAND](https://studyplayings.web.app/offroad-island.html)
- [DEAD LAND SURVIVAL](https://quizverses-9d2f2.web.app/dead-land-survival.html)
- [ALIEN INTELLIGENCE TEST](https://quizverses.pages.dev/alien-intelligence-test.html)
- [MERGE PLANETS](https://studyplayings.pages.dev/merge-planets.html)
- [CATEGORY ARENA254](https://studyplayings.web.app/category-arena254.html)
- [CATEGORY STICKMAN](https://studyquesthub.web.app/category-stickman.html)
- [CATEGORY BYPASS](https://iskillquest.pages.dev/category-bypass.html)
- [BREAK BEAT](https://learnquester.github.io/break-beat.html)
- [DOP DRAW ONE PART](https://thelearnquester.web.app/dop-draw-one-part.html)
- [CATEGORY GUN238](https://themindzone.pages.dev/category-gun238.html)
- [TANK STRIKE WASTELAND ROGUE](https://iskillquest.pages.dev/tank-strike-wasteland-rogue.html)
- [CRAFT MAN VS GIANT TNT](https://quizverses.github.io/craft-man-vs-giant-tnt.html)
- [MERGE HEROES TITANS](https://theskillquest.pages.dev/merge-heroes-titans.html)
- [PYRAMID SOLITAIRE ANCIENT EGYPT](https://studyplayings.web.app/pyramid-solitaire-ancient-egypt.html)
- [DIY MAKEUP SALON SPA MAKEOVER STUDIO](https://themindzone.pages.dev/diy-makeup-salon-spa-makeover-studio.html)
- [CATEGORY CASUAL](https://iskillquest.pages.dev/category-casual.html)
- [MATH KING MATH SKILL GAME](https://iskillquest.pages.dev/math-king-math-skill-game.html)
- [WORLD SOLITAIRE TRIPEAKS ](https://theskillquest.pages.dev/world-solitaire-tripeaks-.html)
- [WHEEL OF BINGO](https://thelearnquester.web.app/wheel-of-bingo.html)
- [CAT FROM HELL CAT SIMULATOR](https://thequizzone.pages.dev/cat-from-hell-cat-simulator.html)
- [GUESS THE ITALIAN BRAINROT ANIMALS](https://themindzone.pages.dev/guess-the-italian-brainrot-animals.html)
- [MOTO RACE CITY](https://studyplaying.github.io/moto-race-city.html)
- [HAMSTERCYCLE](https://thequizzone.pages.dev/hamstercycle.html)
- [TRAFFIC TAP SURVIVAL](https://thequizzone.pages.dev/traffic-tap-survival.html)
- [FRUIT CONNECT 3](https://themindzone.pages.dev/fruit-connect-3.html)
- [MONSTER ARENA](https://theskillquest.pages.dev/monster-arena.html)
- [MY LITTLE CAR WASH](https://iskillquest.pages.dev/my-little-car-wash.html)
- [TROPICAL MATCH](https://studyplayings.pages.dev/tropical-match.html)
- [DART HERO](https://theskillquest.pages.dev/dart-hero.html)
- [THRILL ROLLER COASTER](https://thelearnquester.web.app/thrill-roller-coaster.html)
- [PIECE OF CAKE MERGE AND BAKE](https://themindzone.pages.dev/piece-of-cake-merge-and-bake.html)
- [GIRLFRIEND FROM HELL](https://quizverses.github.io/girlfriend-from-hell.html)
- [MERGE HERO SURVIVAL TOWER DEFENSE](https://themindzone.pages.dev/merge-hero-survival-tower-defense.html)
- [TRAVEL WITH ME ASMR EDITION](https://theskillquest.pages.dev/travel-with-me-asmr-edition.html)
- [FRUIT BALLS JUICY FUSION](https://studyquesthub.web.app/fruit-balls-juicy-fusion.html)
- [BLIND BOAT SHOOTING MASTER](https://learnquester.github.io/blind-boat-shooting-master.html)
- [SLENDERMAN BACK TO SCHOOL](https://thequizzone.pages.dev/slenderman-back-to-school.html)
- [MISSION SANTA DELIVER THE GIFTS](https://studyplaying.github.io/mission-santa-deliver-the-gifts.html)
- [TIED UP](https://thequizzone.pages.dev/tied-up.html)
- [BRAIN FIND CAN YOU FIND IT](https://themindzone.pages.dev/brain-find-can-you-find-it.html)
- [DALGONA GAME2](https://studyplaying.github.io/dalgona-game2.html)
- [SCARY BABY YELLOW GAME](https://studyplayings.pages.dev/scary-baby-yellow-game.html)
- [INDEX8](https://learnquester.github.io/index8.html)
- [INDEX12](https://learnquester.github.io/index12.html)
- [CATEGORY MAKEUP51](https://studyquests.pages.dev/category-makeup51.html)
- [INDEX6](https://theskillquest.pages.dev/index6.html)
- [HAPPY BUBBLES](https://thelearnquester.web.app/happy-bubbles.html)
- [CATEGORY DRESS UP](https://iskillquest.pages.dev/category-dress-up.html)
- [DALGONA MASTER](https://studyquests.pages.dev/dalgona-master.html)
- [CATEGORY FPS 2](https://thelearnquester.web.app/category-fps-2.html)
- [CATEGORY FOOD](https://iskillquest.pages.dev/category-food.html)
