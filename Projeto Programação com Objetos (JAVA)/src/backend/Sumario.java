/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package backend;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Enumeração para representar os tipos de aula
enum TipoAula {
    TEORICA,
    PRATICA,
    LABORATORIAL
}

// Classe Sumario
public class Sumario {
    private TipoAula tipo;
    private String titulo;
    private String sumario;
    private LocalDateTime dataHora;
    private List<Aluno> presencas;

    // Construtor
    public Sumario(TipoAula tipo, String titulo, String sumario) {
        this.tipo = tipo;
        this.titulo = titulo;
        this.sumario = sumario;
        this.dataHora = LocalDateTime.now();
        this.presencas = new ArrayList<>();
    }

    // Métodos getter e setter para tipo
    public TipoAula getTipo() {
        return tipo;
    }

    public void setTipo(TipoAula tipo) {
        this.tipo = tipo;
    }

    // Métodos getter e setter para título
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    // Métodos getter e setter para sumário
    public String getSumario() {
        return sumario;
    }

    public void setSumario(String sumario) {
        this.sumario = sumario;
    }

    // Métodos getter e setter para data e hora
    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }
      public List<Aluno> getPresencas() {
        return presencas;
    }

    // Método para adicionar presença de um aluno
    public void adicionarPresenca(Aluno aluno) {
        presencas.add(aluno);
    }

    // Método para exibir informações do sumário
    public void exibirInformacoes() {
        System.out.println("Tipo de Aula: " + tipo);
        System.out.println("Título: " + titulo);
        System.out.println("Sumário: " + sumario);
        System.out.println("Data e Hora: " + dataHora);
        System.out.println("Presenças: ");
        for (Aluno aluno : presencas) {
            System.out.println("- " + aluno.getNome() + " (" + aluno.getNumero() + ")");
        }
    }
}

