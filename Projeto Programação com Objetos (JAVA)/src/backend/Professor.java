/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */package backend;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


// Classe Professor
public class Professor extends Utilizador {
    private final Map<String, List<Sumario>> sumariosPorUC;

    // Construtor
    public Professor(String nome) {
        super(nome, "", TipoCargo.PROFESSOR); // Adicionei uma senha vazia para corresponder à assinatura do construtor
        this.sumariosPorUC = new HashMap<>();
    }

    // Métodos específicos do Professor

    // Criar sumário
    public void criarSumario(String uc, TipoAula tipoAula, String titulo, String texto) {
        String chave = uc + "_" + tipoAula.toString();

        if (!sumariosPorUC.containsKey(chave)) {
            sumariosPorUC.put(chave, new ArrayList<>());
        }

        List<Sumario> sumarios = sumariosPorUC.get(chave);
        Sumario sumario = new Sumario(tipoAula, titulo, texto);
        sumarios.add(sumario);
        System.out.println("Sumário criado para " + uc + ", Tipo de Aula: " + tipoAula);
    }

    // Consultar sumários
    public List<Sumario> consultarSumarios(String uc, TipoAula tipoAula) {
        String chave = uc + "_" + tipoAula.toString();

        return sumariosPorUC.getOrDefault(chave, new ArrayList<>());
    }

    // Exibir informações de todos os sumários do professor
    public void exibirInformacoesSumarios() {
        System.out.println("Informações de Sumários do Professor " + getNome() + ":");
        for (Map.Entry<String, List<Sumario>> entry : sumariosPorUC.entrySet()) {
            String chave = entry.getKey();
            List<Sumario> sumarios = entry.getValue();

            System.out.println("UC: " + chave.split("_")[0] + ", Tipo de Aula: " + chave.split("_")[1]);
            for (Sumario sumario : sumarios) {
                System.out.println("   - Título: " + sumario.getTitulo());
                System.out.println("     Sumário: " + sumario.getSumario());
                System.out.println("     Data e Hora: " + sumario.getDataHora());
                System.out.println("     Presenças: " + sumario.getPresencas());
            }
        }
    }
}

