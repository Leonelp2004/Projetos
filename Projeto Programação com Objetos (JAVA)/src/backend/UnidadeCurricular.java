/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package backend;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Classe UnidadeCurricular
public class UnidadeCurricular {
    private String designacao;
    private Map<Professor, String> regentesPorUC; // Chave: Professor, Valor: Nome da UC
    private List<Sumario> sumarios; 
    // Construtor
    public UnidadeCurricular(String designacao) {
        this.designacao = designacao;
        this.regentesPorUC = new HashMap<>();
        this.sumarios = new ArrayList<>();
    }
    public UnidadeCurricular() {
        this.sumarios = new ArrayList<>();
    }

    // Método para adicionar REGENTE_UC para uma UC
    public void adicionarRegente(Professor regente) {
        if (regente.getCargo() == TipoCargo.REGENTE_UC) {
            regentesPorUC.put(regente, designacao);
            System.out.println("Professor " + regente.getNome() + " designado como REGENTE_UC para a UC " + designacao);
        } else {
            System.out.println("Apenas professores do tipo REGENTE_UC podem ser designados para UCs.");
        }
    }
    public void add(Sumario sumario) {
        sumarios.add(sumario);
    }

   
}
