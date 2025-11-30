use pyo3::prelude::*;
use numpy::PyReadonlyArray2;

/// Calcula a "Frente de Pareto" usando Fast Non-Dominated Sort.
/// Entrada: Matriz de Fitness (N indivíduos x M objetivos)
/// Saída: Lista de Listas (cada lista contém os índices dos indivíduos daquela frente)
/// 
/// Lógica: MAXIMIZAÇÃO (Maior valor é melhor)
#[pyfunction]
fn fast_non_dominated_sort(_py: Python, fitness: PyReadonlyArray2<f64>) -> PyResult<Vec<Vec<usize>>> {
    let fitness = fitness.as_array();
    let n_individuals = fitness.shape()[0];
    let n_objectives = fitness.shape()[1];

    let mut fronts: Vec<Vec<usize>> = Vec::new();
    let mut domination_counts = vec![0; n_individuals];
    let mut dominated_sets: Vec<Vec<usize>> = vec![Vec::new(); n_individuals];
    let mut current_front: Vec<usize> = Vec::new();

    // 1. Comparar todos contra todos
    for i in 0..n_individuals {
        for j in 0..n_individuals {
            if i == j { continue; }

            // Verificar dominância (MAXIMIZAÇÃO: MAIOR é melhor)
            // i domina j se:
            // - i é >= j em todos os objetivos
            // - i é > j em pelo menos um objetivo
            
            let mut i_better_or_equal_in_all = true;
            let mut i_strictly_better_in_one = false;

            for m in 0..n_objectives {
                let val_i = fitness[[i, m]];
                let val_j = fitness[[j, m]];

                if val_i < val_j {
                    i_better_or_equal_in_all = false;
                    break; // i não pode dominar j
                }
                if val_i > val_j {
                    i_strictly_better_in_one = true;
                }
            }

            if i_better_or_equal_in_all && i_strictly_better_in_one {
                // i domina j
                dominated_sets[i].push(j);
            } else {
                // Checar se j domina i
                let mut j_better_or_equal_in_all = true;
                let mut j_strictly_better_in_one = false;

                for m in 0..n_objectives {
                    let val_i = fitness[[i, m]];
                    let val_j = fitness[[j, m]];

                    if val_j < val_i {
                        j_better_or_equal_in_all = false;
                        break;
                    }
                    if val_j > val_i {
                        j_strictly_better_in_one = true;
                    }
                }

                if j_better_or_equal_in_all && j_strictly_better_in_one {
                    domination_counts[i] += 1;
                }
            }
        }

        if domination_counts[i] == 0 {
            current_front.push(i);
        }
    }

    fronts.push(current_front.clone());

    // 2. Construir frentes subsequentes
    let mut i = 0;
    while i < fronts.len() {
        let mut next_front: Vec<usize> = Vec::new();
        
        for &p in &fronts[i] {
            for &q in &dominated_sets[p] {
                domination_counts[q] -= 1;
                if domination_counts[q] == 0 {
                    next_front.push(q);
                }
            }
        }

        if next_front.is_empty() {
            break;
        }
        
        fronts.push(next_front);
        i += 1;
    }

    Ok(fronts)
}

#[pymodule]
fn synphytica_rust(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(fast_non_dominated_sort, m)?)?;
    Ok(())
}
