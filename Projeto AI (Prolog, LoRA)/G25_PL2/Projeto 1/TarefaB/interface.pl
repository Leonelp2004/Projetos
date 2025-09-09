
%  interface.pl 

:- set_prolog_flag(encoding, utf8).
:- consult('sistema_inferencia.pl').
:- consult('base_conhecimento.pl').
:- consult('casos.pl').
:- consult('aprendizagem.pl').
:- learn_all.


/* Exemplos de teste q1 … q7 (chame ?- qN(Cor). )*/
q1(C) :- classify([hipotensao_ticardia_palidez_sudorose, convulsionando_queda], C),
         format('q1 - Hipotensao+Ticardia+Palidez+Sudorese e com convulsões pós queda. → ~w~n', [C]).
q2(C) :- classify([hipotensao_ticardia_palidez_consciencia], C),
         format('q2 - Hipotensao+Ticardia+Palidez+Consciência   → ~w~n', [C]).
q3(C) :- classify([convulsionando_queda], C),
         format('q3 - Convulsão pós‑queda        → ~w~n', [C]).
q4(C) :- classify([queda_sup_1m], C),
         format('q4 - Queda > 1 metro           → ~w~n', [C]).
q5(C) :- classify([fratura_exposta, dor_ligeira], C),
         format('q5 - Fratura exposta e dor ligeira            → ~w~n', [C]).
q6(C) :- classify([dor_intensa], C),
         format('q6 - Dor intensa                → ~w~n', [C]).
q7(C) :- classify([dor_ligeira, edema], C),
         format('q7 - Dor ligeira e edema isolado              → ~w~n', [C]).

/* ==============================================================
   Perguntas interativas (TODAS as originais, sem alterações)
============================================================== */
pergunta(hipotensao_ticardia_palidez_sudorose,
  'Houve queda e verificou-se hipotensão, taquicardia, palidez e sudorese?').
pergunta(hipotensao_ticardia_palidez_consciencia,
  'Houve queda e verificou-se hipotensão, taquicardia, palidez e diminuição do estado de consciência?').
pergunta(convulsionando_queda,
  'Está convulsionando após a queda?').
pergunta(glicemia_baixa_queda,
  'Está com glicemia baixa (<70 mg/dL) após a queda?').
pergunta(queda_sup_1m,
  'A queda foi de mais de 1 metro?').
pergunta(queda_sup_5escadas,
  'A queda foi de mais de 5 escadas/metros?').
pergunta(hipotermia,
  'Está hipotérmico (<35 °C) após a queda?').
pergunta(dor_intensa,
  'A dor é intensa (score > 7/10 ou > 3 na escala faces)?').
pergunta(historia_de_inconsciencia,
  'Houve história de inconsciência?').
pergunta(disturbio_da_coagulacao,
  'Tem distúrbio de coagulação conhecido?').
pergunta(historia_discordante,
  'A história é discordante?').
pergunta(fratura_exposta,
  'Existe fratura exposta?').
pergunta(dor_moderada,
  'A dor é moderada?').
pergunta(dor_ligeira,
  'A dor é ligeira?').
pergunta(edema,
  'Há apenas edema leve, sem outros sinais de gravidade?').

listar_perguntas(L) :- findall(Id, pergunta(Id,_), L).

/* ---------- utilitário "sim"/"nao" ---------- */
positivo(sim).  positivo(s).  positivo(y).  positivo(yes).
negativo(no). negativo(n).  negativo(nao).  negativo(não).

le_bool(Texto, Bool) :-
    repeat,
    format('~w (sim/nao): ', [Texto]),
    read(In), downcase_atom(In, Lc),
    ( positivo(Lc) -> Bool = true,  !
    ; negativo(Lc) -> Bool = false, !
    ; writeln('Responda "sim" ou "nao".'), fail ).

/* ---------- diálogo completo (com aprendizagem automática por defeito) ---------- */
triagem_queda :-
  nl, writeln('--- Triagem Queda---'),
  retractall(regra(_,_)),                 % Limpa regras anteriores
  consult('base_conhecimento.pl'),       % Recarrega regras manuais
  consult('casos.pl'),                   % Recarrega exemplos
  learn_all,                             % Executa aprendizagem automática
  listar_perguntas(L), perguntar_ate_sim(L, SintomaOuVazio),
  ( SintomaOuVazio == [] -> Pos=[] ; Pos=[SintomaOuVazio] ),
  classify(Pos, Cor),
format('\n>> Pulseira atribuída: ~w', [Cor]), nl,
( default(Cor) -> writeln('(Regra default atribuída)') ; true ), nl.


/* perguntar_ate_sim*/
perguntar_ate_sim([], []).
perguntar_ate_sim([S|R], Res) :-
  pergunta(S, Txt), le_bool(Txt, Bool),
  ( Bool == true  -> Res = S                      % primeiro sim
  ; Bool == false -> perguntar_ate_sim(R, Res) ). % avança sem repetir

/* ---------- menu ---------- */
menu :-
    writeln(' TRIAGEM QUEDA '),
    writeln('Exemplos:  q1(C)…q7(C).'),
    writeln('Questões:  triagem_queda.').
