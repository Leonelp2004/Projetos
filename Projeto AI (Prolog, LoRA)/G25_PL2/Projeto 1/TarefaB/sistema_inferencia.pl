% ==============================================================  
%  sistema_inferencia.pl  
%  • Motor genérico que carrega o RuleModel  
%  • Predicado classify/2 devolve a pulseira  
% ==============================================================  

:- set_prolog_flag(encoding, utf8).  

% Carregar todas as fontes de regras
:- consult('base_conhecimento.pl').        % Regras manuais
:- consult('aprendizagem.pl').             % Módulo de aprendizagem
:- consult('casos.pl').                    % Exemplos históricos

% Declarar que as regras são dinâmicas
:- dynamic regra/2.

% --- alias <== para regra/2 ---------------------------------  
:- op(900, xfx, '<==').  
Classe <== Cond :- regra(Classe, Cond).  

% --- satisfazer condição ------------------------------------  
holds(Atrib, not(S)) :- \+ member(S, Atrib), !.  
holds(Atrib, S)      :-    member(S, Atrib).  

satisfy(Atrib, Cond) :- forall(member(C, Cond), holds(Atrib, C)).  

% --- classificador ------------------------------------------  
% Tenta regras aprendidas (conjunções - lista de listas)
classify(Sintomas, Classe) :-
    regra(Classe, Conds),
    is_list(Conds), Conds \= [],
    [First | _] = Conds, is_list(First), % Verifica se é lista de listas
    member(Conj, Conds),
    satisfy(Sintomas, Conj), !.

% Tenta regras manuais (listas simples)
classify(Sintomas, Classe) :-
    regra(Classe, Cond),
    is_list(Cond), \+ (Cond = [F|_], is_list(F)),
    satisfy(Sintomas, Cond), !.

% Regra default
classify(_, Classe) :-
    default(Classe).



