/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package backend;

/**
 *
 * @author leone
 */
// Enumeração para representar os tipos de cargo
enum TipoCargo {
    ADMINISTRADOR,
    PROFESSOR,
    REGENTE_UC,
    DIRETOR_CURSO,
    ALUNO 
}

// Classe Utilizador
public class Utilizador {
    String nome;
    private String password;
    private TipoCargo cargo;

    // Construtor para Utilizador
    public Utilizador(String nome, String password, TipoCargo cargo) {
        this.nome = nome;
        this.password = password;
        this.cargo = cargo;
    }

    // Método para autenticar o utilizador
    public boolean autenticar(String nomeUsuario, String senha) {
        return this.nome.equals(nomeUsuario) && this.password.equals(senha);
    }

    // Métodos getter e setter para o nome
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    // Métodos getter e setter para a senha
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Métodos getter e setter para o cargo
    public TipoCargo getCargo() {
        return cargo;
    }

    public void setCargo(TipoCargo cargo) {
        this.cargo = cargo;
    }

    // Método para exibir informações do utilizador
    public void exibirInformacoes() {
        System.out.println("Nome: " + nome);
        System.out.println("Cargo: " + cargo);
    }
}
