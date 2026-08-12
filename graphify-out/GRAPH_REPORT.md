# Graph Report - .  (2026-08-12)

## Corpus Check
- Corpus is ~20,355 words - fits in a single context window. You may not need a graph.

## Summary
- 181 nodes · 273 edges · 15 communities (11 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.56)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13

## God Nodes (most connected - your core abstractions)
1. `getRecommendations()` - 16 edges
2. `compilerOptions` - 16 edges
3. `DiseaseResult` - 10 edges
4. `InferenceService` - 7 edges
5. `HistoryEntry` - 7 edges
6. `include` - 7 edges
7. `scripts` - 5 edges
8. `AnalyzePage()` - 5 edges
9. `getHistory()` - 4 edges
10. `saveToHistory()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Props` --references--> `DiseaseResult`  [EXTRACTED]
  src/components/analysis/ResultCard.tsx → src/types/analysis.ts
- `Props` --references--> `DiseaseResult`  [EXTRACTED]
  src/components/analysis/SeverityPanel.tsx → src/types/analysis.ts
- `Props` --references--> `HistoryEntry`  [EXTRACTED]
  src/components/history/HistoryCard.tsx → src/types/analysis.ts
- `Props` --references--> `HistoryEntry`  [EXTRACTED]
  src/components/history/TrendChart.tsx → src/types/analysis.ts
- `AnalyzePage()` --calls--> `generateThumbnail()`  [EXTRACTED]
  src/app/analyze/page.tsx → src/lib/history.ts

## Import Cycles
- None detected.

## Communities (15 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (20): ACCEPTED_TYPES, AnalyzePage(), computeBlurScore(), PROGRESS_STEPS, Step, HistoryPage(), DisclaimerBanner(), HeatmapPanel() (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (14): Props, SeverityPanel(), getConfidenceLevel(), MOCK_CONDITIONS, MockCondition, MockInferenceService, simulateDelay(), RealInferenceService (+6 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (19): lucide-react, next, dependencies, lucide-react, next, react, react-dom, recharts (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.23
Nodes (15): getRecommendations(), potatoEarlyBlight(), potatoHealthy(), potatoLateBlight(), RecommendationMap, riceBacterialLeafBlight(), riceBrownSpot(), riceHealthy() (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (6): inter, metadata, outfit, BookOpen(), NAV_LINKS, Navbar()

### Community 7 - "Community 7"
Cohesion: 0.21
Nodes (9): CONFIDENCE_CONFIG, Props, ResultCard(), CONFIDENCE_CONFIG, ConditionInfo, CROP_COLORS, CROP_EMOJIS, SUPPORTED_CONDITIONS (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (6): CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS, Props, RecommendationPanel(), Recommendation

## Knowledge Gaps
- **66 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 4` to `Community 2`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `Community 3` to `Community 8`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `DiseaseResult` connect `Community 1` to `Community 0`, `Community 7`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `getRecommendations()` (e.g. with `riceBacterialLeafBlight()` and `riceBrownSpot()`) actually correct?**
  _`getRecommendations()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13538461538461538 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._