/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package backend;
import java.util.HashMap;
import java.util.Map;

public class RepositorioUtilizador {
    private final Map<String, Utilizador> utilizadores;

    public RepositorioUtilizador() {
        this.utilizadores = new HashMap<>();
    }

    // Adicionar utilizador ao repositório
    public void adicionarUtilizador(Utilizador utilizador) {
        utilizadores.put(utilizador.getNome(), utilizador);
    }

    // Obter utilizador por nome
    public Utilizador obterUtilizador(String nomeUtilizador) {
        return utilizadores.get(nomeUtilizador);
    }

    // Remover utilizador do repositório
    public void removerUtilizador(String nomeUtilizador) {
        utilizadores.remove(nomeUtilizador);
    }

    // Listar todos os utilizadores no repositório
    public void listarUtilizadores() {
        System.out.println("Utilizadores no repositório:");
        for (Utilizador utilizador : utilizadores.values()) {
            utilizador.exibirInformacoes();
        }
    }
}

