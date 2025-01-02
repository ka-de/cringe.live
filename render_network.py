import graphviz
from pathlib import Path

def render_neural_network():
    # Render English version
    dot_file_en = Path('graphviz/neural_networks_en.dot').read_text()
    graph_en = graphviz.Source(dot_file_en)
    graph_en.render('neural_networks_visualization_en', format='png', cleanup=True, view=True)
    
    # Render Japanese version
    dot_file_ja = Path('graphviz/neural_networks_ja.dot').read_text()
    graph_ja = graphviz.Source(dot_file_ja)
    graph_ja.render('neural_networks_visualization_ja', format='png', cleanup=True, view=True)

if __name__ == '__main__':
    render_neural_network() 