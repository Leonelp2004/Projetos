package backend;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Administrador extends Utilizador {
    private final Map<String, String> informacoesProfessores;
    private final List<String> cursos;
    private final List<String> ucs;
    private final Map<String, String> regencias;
    private final Map<String, String> direcoes;

    // Construtor
    public Administrador(String nome,String password, TipoCargo tipoCargo) {
        super(nome,password, tipoCargo);
        this.informacoesProfessores = new HashMap<>();
        this.cursos = new ArrayList<>();
        this.ucs = new ArrayList<>();
        this.regencias = new HashMap<>();
        this.direcoes = new HashMap<>();
    }

    // Métodos específicos do Administrador

    // Adicionar, apagar ou alterar informação dos professores
    public void adicionarInformacaoProfessor(String nomeProfessor, String informacao) {
        informacoesProfessores.put(nomeProfessor, informacao);
    }

    public void apagarInformacaoProfessor(String nomeProfessor) {
        informacoesProfessores.remove(nomeProfessor);
    }

    public void alterarInformacaoProfessor(String nomeProfessor, String novaInformacao) {
        informacoesProfessores.put(nomeProfessor, novaInformacao);
    }

    // Registar ou alterar informação de cursos e UCs
    public void registarCurso(String curso) {
        cursos.add(curso);
    }

    public void alterarInformacaoCurso(String cursoAntigo, String novoCurso) {
        cursos.remove(cursoAntigo);
        cursos.add(novoCurso);
    }

    public void registarUC(String uc) {
        ucs.add(uc);
    }

    public void alterarInformacaoUC(String ucAntiga, String novaUC) {
        ucs.remove(ucAntiga);
        ucs.add(novaUC);
    }

    // Listar cursos, UCs, alunos ou professores registados no sistema
    public void listarCursos() {
        System.out.println("Cursos registados:");
        for (String curso : cursos) {
            System.out.println(curso);
        }
    }

    public void listarUCs() {
        System.out.println("UCs registadas:");
        for (String uc : ucs) {
            System.out.println(uc);
        }
    }

    public void listarProfessores() {
        System.out.println("Professores registados:");
        for (String professor : informacoesProfessores.keySet()) {
            System.out.println(professor + ": " + informacoesProfessores.get(professor));
        }
    }

    // Atribuir direção de curso ou regência de UC a professor
    public void atribuirDirecaoDeCurso(String nomeProfessor, String curso) {
        direcoes.put(nomeProfessor, curso);
    }

    public void atribuirRegenciaUC(String nomeProfessor, String uc) {
        regencias.put(nomeProfessor, uc);
    }
}


