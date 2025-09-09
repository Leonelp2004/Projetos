/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package backend;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


// Enumeração para representar os tipos de curso
enum TipoCurso {
    LICENCIATURA,
    MESTRADO,
    DOUTORAMENTO
}

// Classe Curso
public class Curso {
    private String nome;
    private TipoCurso tipo;
    private List<UnidadeCurricular> UcsPorCurso;
  

    // Construtor
    public Curso(String nome, TipoCurso tipo) {
        this.nome = nome;
        this.tipo = tipo;
    }

    // Métodos getter e setter para nome
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    // Métodos getter e setter para tipo
    public TipoCurso getTipo() {
        return tipo;
    }

    public void setTipo(TipoCurso tipo) {
        this.tipo = tipo;
    }
    public void criarNovaUnidadeCurricular(String nome) {
        UnidadeCurricular novaUnidadeCurricular = new UnidadeCurricular(nome);
        UcsPorCurso.add(novaUnidadeCurricular);
        System.out.println("Nova unidade curricular criada: " + nome);
    }
}

   
/*FALTA permita para as classes guardar em ficheiro o estado do sistema num determinado
momento e recuperá-lo quando pretendido e referir que se
-Pretende se que o sistema tenha níveis de robustez adequados, ou seja, que seja capaz de
se comportar adequadamente em situações de erro*/
