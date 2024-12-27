---
weight: 1
bookFlatSection: false
bookToC: true
title: "ComfyUI_frontend Progress Bars"
description: "A frontend enhancement for ComfyUI that adds two sleek progress bars to track workflow and node execution. The bars are designed to be non-intrusive with minimal heights and automatic theme adaptation, providing real-time visual feedback during processing."
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# Progress Bars for ComfyUI

---

## Introduction

This is a patch to `GraphCanvasMenu` and an implementation of `ProgressBars` for the [ComfyUI frontend](https://github.com/Comfy-Org/ComfyUI_frontend) which adds two progress bars to the UI.

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/comfyui/progressbars.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>

## Features

The implementation adds two distinct progress bars to the ComfyUI interface. The first is a *Workflow Progress Bar* that shows the overall workflow execution progress, while the second is a *Node Progress Bar* that displays the progress of the currently executing node.

These progress bars are carefully designed with user experience in mind - they maintain a non-intrusive presence with minimal heights of 2px and 1px respectively, adapt seamlessly to both light and dark themes, and automatically hide themselves when the system is idle to keep the interface clean and uncluttered.

## Implementation Details

---

### Component Structure

The progress bars are implemented as a Vue component (`GraphProgressBars.vue`) that gets mounted alongside the main canvas. This component provides the core structure needed to display and manage the progress indicators in the UI.

The component is built with a container div that houses both progress bars, along with their respective fill indicators, and utilizes reactive bindings to the execution store to enable real-time progress tracking during workflow execution.

### Progress Bar States

The progress bars respond to three main states from the execution store:

- `executionProgress`: Overall workflow progress (0-100%)
- `executingNodeProgress`: Current node progress (0-100%)
- `isIdle`: Whether any processing is happening

### Visual Design

The progress bars incorporate smooth transitions with a 0.2s ease-out animation, and feature a visual hierarchy through different heights - the workflow bar at 2px and the node bar at 1px. They also utilize distinct colors to differentiate their purposes, with the workflow progress shown in blue (#3498db) and node progress displayed in green (#2ecc71).

The progress bars are designed to be theme-sensitive, with backgrounds that adapt based on the UI theme - using semi-transparent black in light theme and semi-transparent white in dark theme. This ensures optimal visibility regardless of the user's theme preference.

## Installation

---

To add the progress bars to your ComfyUI installation:

1. Apply the patch to your `GraphCanvas.vue`:

    ```bash
    patch -p1 < GraphCanvasMenu_progressbars.patch
    ```

2. Add the `GraphProgressBars.vue` component to your project's components directory:
`src/components/graph/GraphProgressBars.vue`

3. Rebuild the frontend.

## Usage

The progress bars will automatically appear when:

- A workflow is executing (top bar)
- Individual nodes are processing (bottom bar)

They automatically hide when the system returns to an idle state, keeping your interface clean when not needed.

## Technical Notes

---

The component leverages Pinia for state management through the `executionStore`. To ensure the progress bars remain visible above other interface elements, they are positioned absolutely with a `z-index` of 1000. The implementation uses pointer-events-none to prevent the progress bars from interfering with any UI elements positioned underneath them.

## The Code

---

- `GraphCanvasMenu_progressbars.patch`

    ```diff
    diff --git a/src/components/graph/GraphCanvas.vue b/src/components/graph/GraphCanvas.vue
    index 127a6b20..7e6a6840 100644
    --- a/src/components/graph/GraphCanvas.vue
    +++ b/src/components/graph/GraphCanvas.vue
    @@ -18,6 +18,7 @@
        </LiteGraphCanvasSplitterOverlay>
        <TitleEditor />
        <GraphCanvasMenu v-if="!betaMenuEnabled && canvasMenuEnabled" />
    +    <GraphProgressBars />
        <canvas ref="canvasRef" id="graph-canvas" tabindex="1" />
    </teleport>
    <NodeSearchboxPopover />
    @@ -33,6 +34,7 @@ import LiteGraphCanvasSplitterOverlay from '@/components/LiteGraphCanvasSplitter
    import NodeSearchboxPopover from '@/components/searchbox/NodeSearchBoxPopover.vue'
    import NodeTooltip from '@/components/graph/NodeTooltip.vue'
    import NodeBadge from '@/components/graph/NodeBadge.vue'
    +import GraphProgressBars from '@/components/graph/GraphProgressBars.vue'
    import { ref, computed, onMounted, watchEffect, watch } from 'vue'
    import { app as comfyApp } from '@/scripts/app'
    import { useSettingStore } from '@/stores/settingStore'
    ```

- `/src/components/graph/GraphProgressBars.vue`

    ```jsx
    <template>
    <div class="graph-progress-bars" v-show="!isIdle">
        <!-- Workflow progress bar -->
        <div class="progress-bar workflow-progress">
        <div class="progress-fill" :style="{ width: executionProgress + '%' }" />
        </div>
        <!-- Node progress bar -->
        <div
        class="progress-bar node-progress"
        v-show="executingNodeProgress !== null"
        >
        <div
            class="progress-fill"
            :style="{ width: executingNodeProgress + '%' }"
        />
        </div>
    </div>
    </template>

    <script setup lang="ts">
    import { useExecutionStore } from '@/stores/executionStore'
    import { storeToRefs } from 'pinia'
    const executionStore = useExecutionStore()
    const { executionProgress, executingNodeProgress, isIdle } =
    storeToRefs(executionStore)
    </script>

    <style scoped>
    .graph-progress-bars {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    pointer-events: none;
    }
    .progress-bar {
    width: 100%;
    height: 2px;
    background: rgba(0, 0, 0, 0.1);
    overflow: hidden;
    }
    .progress-bar.node-progress {
    height: 1px;
    background: rgba(0, 0, 0, 0.05);
    }
    .progress-fill {
    height: 100%;
    background: #3498db;
    transition: width 0.2s ease-out;
    }
    .node-progress .progress-fill {
    background: #2ecc71;
    }
    /* Dark theme support */
    :root[data-theme='dark'] .progress-bar {
    background: rgba(255, 255, 255, 0.1);
    }
    :root[data-theme='dark'] .progress-bar.node-progress {
    background: rgba(255, 255, 255, 0.05);
    }
    </style>
    ```
