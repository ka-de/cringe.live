---
weight: 1
bookFlatSection: false
bookToC: true
title: "ComfyUI_frontend プログレスバー"
description: "ComfyUIのフロントエンド拡張機能で、ワークフローとノードの実行を追跡する2つのスタイリッシュなプログレスバーを追加します。バーは最小限の高さと自動テーマ適応を備え、処理中にリアルタイムの視覚的フィードバックを提供する非侵襲的なデザインになっています。"
---

<!--markdownlint-disable MD025 MD033 MD038 -->

# ComfyUIのプログレスバー

---

## はじめに

これは[ComfyUIフロントエンド](https://github.com/Comfy-Org/ComfyUI_frontend)の`GraphCanvasMenu`へのパッチと、UIに2つのプログレスバーを追加する`ProgressBars`の実装です。

<div style="text-align: center;">
    <video style="width: 100%;" autoplay loop muted playsinline>
        <source src="https://huggingface.co/k4d3/yiff_toolkit6/resolve/main/static/comfyui/progressbars.mp4" type="video/mp4">
        お使いのブラウザはビデオタグをサポートしていません。
    </video>
</div>

## 機能

この実装は、ComfyUIインターフェースに2つの異なるプログレスバーを追加します。1つ目は全体的なワークフローの実行進捗を表示する*ワークフロープログレスバー*で、2つ目は現在実行中のノードの進捗を表示する*ノードプログレスバー*です。

これらのプログレスバーは、ユーザーエクスペリエンスを考慮して慎重に設計されています - それぞれ2pxと1pxという最小限の高さで非侵襲的な存在感を維持し、ライトテーマとダークテーマの両方にシームレスに適応し、システムがアイドル状態のときは自動的に非表示になってインターフェースをクリーンで整然とした状態に保ちます。

## 実装の詳細

---

### コンポーネント構造

プログレスバーは、メインキャンバスと一緒にマウントされるVueコンポーネント（`GraphProgressBars.vue`）として実装されています。このコンポーネントは、UIでプログレスインジケーターを表示および管理するために必要な基本構造を提供します。

コンポーネントは、両方のプログレスバーとそれぞれの塗りつぶしインジケーターを収容するコンテナdivで構築され、実行ストアへのリアクティブバインディングを利用してワークフロー実行中のリアルタイムな進捗追跡を可能にします。

### プログレスバーの状態

プログレスバーは、実行ストアからの3つの主要な状態に応答します：

- `executionProgress`：全体的なワークフローの進捗（0-100%）
- `executingNodeProgress`：現在のノードの進捗（0-100%）
- `isIdle`：処理が行われているかどうか

### ビジュアルデザイン

プログレスバーは0.2秒のイーズアウトアニメーションによるスムーズな遷移を組み込み、ワークフローバーが2px、ノードバーが1pxという異なる高さによる視覚的階層を特徴としています。また、目的を区別するために異なる色を使用し、ワークフローの進捗は青色（#3498db）、ノードの進捗は緑色（#2ecc71）で表示されます。

プログレスバーはテーマに応じて適応するように設計されており、UIテーマに基づいて背景が変化します - ライトテーマでは半透明の黒、ダークテーマでは半透明の白を使用します。これにより、ユーザーのテーマ設定に関係なく最適な視認性が確保されます。

## インストール

---

プログレスバーをComfyUIインストールに追加するには：

1. `GraphCanvas.vue`にパッチを適用します：

    ```bash
    patch -p1 < GraphCanvasMenu_progressbars.patch
    ```

2. `GraphProgressBars.vue`コンポーネントをプロジェクトのcomponentsディレクトリに追加します：
`src/components/graph/GraphProgressBars.vue`

3. フロントエンドを再ビルドします。

## 使用方法

プログレスバーは以下の場合に自動的に表示されます：

- ワークフローが実行中（上部バー）
- 個々のノードが処理中（下部バー）

システムがアイドル状態に戻ると自動的に非表示になり、必要のないときはインターフェースをクリーンに保ちます。

## 技術的な注意点

---

コンポーネントは、状態管理のために`executionStore`を通じてPiniaを活用しています。プログレスバーが他のインターフェース要素の上に表示され続けるようにするため、`z-index`が1000の絶対位置に配置されています。実装では、プログレスバーが下に配置されたUI要素と干渉しないように、pointer-events-noneを使用しています。

## コード

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
        <!-- ワークフロープログレスバー -->
        <div class="progress-bar workflow-progress">
        <div class="progress-fill" :style="{ width: executionProgress + '%' }" />
        </div>
        <!-- ノードプログレスバー -->
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
    /* ダークテーマのサポート */
    :root[data-theme='dark'] .progress-bar {
    background: rgba(255, 255, 255, 0.1);
    }
    :root[data-theme='dark'] .progress-bar.node-progress {
    background: rgba(255, 255, 255, 0.05);
    }
    </style>
    ```

---

---

{{< related-posts related="docs/yiff_toolkit/comfyui/Custom-ComfyUI-Workflow-with-the-Krita-AI-Plugin/ | docs/yiff_toolkit/comfyui/Experimental-Stuff/ | docs/yiff_toolkit/comfyui/custom_nodes/ComfyUI-Custom-Scripts/" >}}
