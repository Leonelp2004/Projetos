package backend;

// Classe Aluno
public class Aluno extends Utilizador {
    private String numero;
    private Curso curso;

    // Construtor
    public Aluno(String numero, String nome, Curso curso) {
        super(nome, "", TipoCargo.ALUNO); // Adicionei uma senha vazia para corresponder à assinatura do construtor
        this.numero = numero;
        this.curso = curso;
    }

    // Métodos getter e setter para o número
    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    // Métodos getter e setter para o curso
    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }
}
