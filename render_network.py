import graphviz
from pathlib import Path

def render_neural_network():
    # Read the DOT file
    dot_file = Path('graphviz/neural_networks.dot').read_text()
    
    # Create a Graphviz object from the DOT file
    graph = graphviz.Source(dot_file)
    
    # Render the graph to a PDF file
    # The 'view=True' parameter will automatically open the generated file
    graph.render('neural_networks_visualization', format='pdf', cleanup=True, view=True)

if __name__ == '__main__':
    render_neural_network() 