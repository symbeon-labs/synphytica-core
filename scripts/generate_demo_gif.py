import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from matplotlib.patches import Circle
import os

def generate_synphytica_gif(output_path='docs/articles/images/synphytica_demo.gif'):
    # Configurações do GIF
    n_frames = 150
    n_compounds = 20
    
    # Configurar o plot
    fig, ax = plt.subplots(figsize=(8, 4), facecolor='#0a0e27')
    ax.set_facecolor('#0a0e27')
    ax.set_xlim(-2, 2)
    ax.set_ylim(-1, 1)
    ax.axis('off')
    
    # Cores
    color_compound = '#00ffc8'
    color_optimal = '#ffd700'
    
    # Inicializar partículas
    particles = []
    for _ in range(n_compounds):
        # Posições iniciais aleatórias
        circle = Circle((0, 0), 0.04, color=color_compound, alpha=0.8)
        ax.add_patch(circle)
        particles.append({
            'obj': circle,
            'x': np.random.uniform(-1.8, 1.8),
            'y': np.random.uniform(-0.8, 0.8),
            'target_x': 0, 
            'target_y': 0
        })
        
    # Elementos de texto
    title_text = ax.text(0, 0.8, "SYNPHYTICA OPTIMIZATION ENGINE", 
                        color='#00ffc8', ha='center', fontsize=12, fontweight='bold', fontfamily='monospace')
    status_text = ax.text(0, -0.9, "INITIALIZING...", 
                         color='white', ha='center', fontsize=10, fontfamily='monospace', alpha=0.7)
    
    def update(frame):
        phase = ""
        
        # Fase 1: Exploração Aleatória (Frames 0-50)
        if frame < 50:
            phase = "PHASE 1: EXPLORATION (NSGA-II)"
            for p in particles:
                # Movimento browniano suave
                p['target_x'] = p['x'] + np.random.uniform(-0.2, 0.2)
                p['target_y'] = p['y'] + np.random.uniform(-0.2, 0.2)
                # Manter limites
                p['target_x'] = np.clip(p['target_x'], -1.8, 1.8)
                p['target_y'] = np.clip(p['target_y'], -0.8, 0.8)
                p['obj'].set_color(color_compound)
                
        # Fase 2: Convergência / Clustering (Frames 50-100)
        elif frame < 100:
            phase = "PHASE 2: CONVERGENCE"
            t = (frame - 50) / 50.0  # Progresso da fase
            for i, p in enumerate(particles):
                # Formar um círculo
                angle = 2 * np.pi * i / n_compounds
                radius = 0.6
                target_x = radius * np.cos(angle)
                target_y = radius * np.sin(angle)
                
                # Interpolar para o alvo
                p['target_x'] = target_x
                p['target_y'] = target_y
                p['obj'].set_color(color_compound)

        # Fase 3: Solução Ótima (Targeting) (Frames 100-150)
        else:
            phase = "PHASE 3: PARETO OPTIMAL"
            for i, p in enumerate(particles):
                # Espiral de Fibonacci (Golden Ratio)
                golden_angle = np.pi * (3 - np.sqrt(5))
                theta = i * golden_angle
                r = 0.1 * np.sqrt(i)
                target_x = r * np.cos(theta)
                target_y = r * np.sin(theta)
                
                p['target_x'] = target_x
                p['target_y'] = target_y
                
                # Transição para dourado
                if frame > 110:
                    p['obj'].set_color(color_optimal)

        # Atualizar posições (suavização/lerp)
        for p in particles:
            p['x'] += (p['target_x'] - p['x']) * 0.1
            p['y'] += (p['target_y'] - p['y']) * 0.1
            p['obj'].center = (p['x'], p['y'])
            
        status_text.set_text(phase)
        
        # Piscar texto de status
        status_text.set_alpha(0.5 + 0.5 * np.sin(frame * 0.2))
        
        return [p['obj'] for p in particles] + [status_text]

    print(f"Generating GIF at {output_path}...")
    ani = animation.FuncAnimation(fig, update, frames=n_frames, interval=50, blit=True)
    
    # Salvar
    try:
        ani.save(output_path, writer='pillow', fps=20)
        print("Success! GIF generated.")
    except Exception as e:
        print(f"Error generating GIF: {e}")

if __name__ == "__main__":
    if not os.path.exists('docs/articles/images'):
        os.makedirs('docs/articles/images')
    generate_synphytica_gif()
