/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package backend;

import java.util.HashMap;
import java.util.Map;

public class RepositorioProfessor {
    private final Map<String, Professor> professores;

    public RepositorioProfessor() {
        this.professores = new HashMap<>();
    }

    // Adicionar professor ao repositório
    public void adicionarProfessor(Professor professor) {
        professores.put(professor.getNome(), professor);
    }

    // Obter professor por nome
    public Professor obterProfessor(String nomeProfessor) {
        return professores.get(nomeProfessor);
    }

    // Remover professor do repositório
    public void removerProfessor(String nomeProfessor) {
        professores.remove(nomeProfessor);
    }

    // Listar todos os professores no repositório
    public void listarProfessores() {
        System.out.println("Professores no repositório:");
        for (Professor professor : professores.values()) {
            System.out.println(professor.getNome());
        }
    }

}
