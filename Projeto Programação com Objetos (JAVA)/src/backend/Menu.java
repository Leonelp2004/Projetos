/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package backend;
import java.util.Scanner;

public class Menu {
    private static Scanner scanner = new Scanner(System.in);
    
    public static void main(String[] args) {
        
        Utilizador utilizador = fazerLogin();

        if (utilizador != null) {
            System.out.println("Login bem-sucedido como " + utilizador.getNome() + " - " + utilizador.getCargo());

            switch (utilizador.getCargo()) {
                case ADMINISTRADOR:
                    menuAdministrador(utilizador);
                    break;
                case PROFESSOR:
                    menuProfessor();
                    break;
                case REGENTE_UC:
                    menuRegenteUC();
                    break;
                case DIRETOR_CURSO:
                    menuDiretorCurso();
                    break;
                default:
                    System.out.println("Opção inválida.");
            }
        } else {
            System.out.println("Login falhou.");
        }
    }

   private static Utilizador fazerLogin() {
    System.out.println("Digite o nome de usuário:");
    String nomeUsuario = scanner.nextLine();
    System.out.println("Digite a senha:");
    String senha = scanner.nextLine();

    System.out.println("Escolha o tipo de cargo:");
    System.out.println("1. Administrador");
    System.out.println("2. Professor");
    System.out.println("3. Regente de UC");
    System.out.println("4. Diretor de Curso");
    int escolhaCargo = scanner.nextInt();
    scanner.nextLine(); // Consumir a quebra de linha pendente

    TipoCargo tipoCargo = null;

    switch (escolhaCargo) {
        case 1:
            tipoCargo = TipoCargo.ADMINISTRADOR;
            break;
        case 2:
            tipoCargo = TipoCargo.PROFESSOR;
            break;
        case 3:
            tipoCargo = TipoCargo.REGENTE_UC;
            break;
        case 4:
            tipoCargo = TipoCargo.DIRETOR_CURSO;
            break;
        default:
            System.out.println("Escolha inválida.");
            return null;
    }

    // Substitua com a lógica de autenticação real usando a classe Utilizador
    // (esta é uma versão simplificada apenas para ilustração)
    return new Utilizador(nomeUsuario, senha, tipoCargo);
}


    private static void menuAdministrador(Utilizador utilizador) {
        Administrador adm = new Administrador(utilizador.getNome(),utilizador.getPassword(),utilizador.getCargo());
        System.out.println("Opções do Administrador:");
        System.out.println("1. Autenticar-se como Administrador.");
        System.out.println("2. Adicionar, apagar ou alterar informação dos professores.");
        System.out.println("3. Gerenciar Cursos e Unidades Curriculares.");
        System.out.println("4. Listar cursos, UCs, alunos ou professores registados no sistema.");
        System.out.println("5. Atribuir direção de curso ou regência de UC a professor.");

        int opcao = scanner.nextInt();
        scanner.nextLine(); // Consumir a quebra de linha pendente

        switch (opcao) {
            case 1:
                
                break;
            case 2:
                int opcao2;
                opcao2 = scanner.nextInt();
                switch (opcao2){
                    case 1:
                        adm.setCargo(TipoCargo.PROFESSOR);
                        break;
                     case 2:
                        String nome = scanner.next();
                        adm.setNome(nome);
                        break;
                     case 3:
                        String password = scanner.next();
                        adm.setPassword(password);
                        break;   
                }
                break;
            case 3:
                menuGerenciarCursosEUC();
                
                break;
            case 4:
                menuGerenciarCursosEUC();
                break;
            case 5:
                menuGerenciarCursosEUC();
                break;
            // Adicione outras opções conforme necessário
            default:
                System.out.println("Opção inválida.");
        }
    }
    
     private static void menuProfessor() {
        System.out.println("Opções do Professor:");
        System.out.println("1. Criar sumário.");
        System.out.println("2. Consultar lista de sumários por UC e por tipo de aula.");
        System.out.println("3. Consultar serviço docente.");
    }

    private static void menuRegenteUC() {
        System.out.println("Opções do Regente de UC:");
        System.out.println("1. Adicionar/remover alunos ao/do curso.");
        System.out.println("2. Consulta assiduidade de determinado aluno.");
    }

    private static void menuDiretorCurso() {
        System.out.println("Opções do Diretor de Curso:");
        System.out.println("1. Alterar designação do Curso.");
        System.out.println("2. Listar número de professores ou alunos por curso.");
    }

    private static void menuGerenciarCursosEUC() {
        System.out.println("Opções para Gerenciar Cursos e Unidades Curriculares:");
        System.out.println("1. Criar Curso.");
        System.out.println("2. Alterar Designação do Curso.");
        System.out.println("3. Criar Nova Unidade Curricular.");

        int opcao = scanner.nextInt();
        scanner.nextLine(); // Consumir a quebra de linha pendente

        switch (opcao) {
            case 1:
                criarNovoCurso();
                break;
            case 2:
                alterarDesignacaoCurso();
                break;
            case 3:
                criarNovaUnidadeCurricular();
                break;
            // Adicione outras opções conforme necessário
            default:
                System.out.println("Opção inválida.");
        }
    }

    private static void criarNovoCurso() {
        // Implemente a lógica para criar um novo curso
        System.out.println("Lógica para criar um novo curso aqui.");
    }

    private static void alterarDesignacaoCurso() {
        // Implemente a lógica para alterar a designação de um curso
        System.out.println("Lógica para alterar a designação do curso aqui.");
    }

    private static void criarNovaUnidadeCurricular() {
        System.out.println("Digite a designação da nova Unidade Curricular:");
        String designacao = scanner.nextLine();

        // Crie um novo objeto UnidadeCurricular e adicione ao curso
        Curso curso = obterCurso(); // Implemente a lógica para obter o curso relevante
        if (curso != null) {
            curso.criarNovaUnidadeCurricular(designacao);
        } else {
            System.out.println("Curso não encontrado.");
        }
    }

    // Métodos adicionais conforme necessário

    private static Curso obterCurso() {
        // Implemente a lógica para obter o curso relevante
        // (por exemplo, a partir de uma lista de cursos, interação com o usuário, etc.)
        return null; // A ser substituído pela lógica real
    }
}
