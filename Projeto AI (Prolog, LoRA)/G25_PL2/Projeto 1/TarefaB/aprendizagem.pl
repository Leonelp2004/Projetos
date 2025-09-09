% aprendizagem.pl – Indução automática de regras “if … then …”
:- set_prolog_flag(encoding, utf8).
:- consult('casos.pl').

:- op(300, xfx, <==).

:- dynamic regra/2.

% learn_all/0 – induz regras para todas as pulseiras em example/2
learn_all :-
    findall(Pulseira, example(Pulseira, _), PsDup),
    sort(PsDup, Pulseiras),
    forall(member(P, Pulseiras),
           (learn(P) -> true ; format('>> [ERRO] Falha ao aprender regra para ~w~n', [P]))).

% learn(+Pulseira) – gera e asserta descrição para Pulseira
learn(Pulseira) :-
    findall(example(C, O), example(C, O), Examples),
    induce(Examples, Pulseira, Regras),
    Regras \== [],
    assertz(regra(Pulseira, Regras)),
    format('>> [APRENDEU] ~w <== ~w~n', [Pulseira, Regras]).

/*** NÚCLEO DE INDUÇÃO ***/

induce(Exs, Pulseira, []) :-
    \+ member(example(Pulseira, _), Exs), !.
induce(Exs, Pulseira, [Conj | Cs]) :-
    build_conj(Exs, Pulseira, Conj),
    remove_covered(Exs, Pulseira, Conj, Rest),
    induce(Rest, Pulseira, Cs).

% Corrigido: não termina prematuramente
build_conj(Exs, Pulseira, [Sym | Conj]) :-
    choose_symptom(Exs, Pulseira, Sym),
    include(has_sym(Sym), Exs, Exs1),
    Exs1 \== [],
    build_conj(Exs1, Pulseira, Conj).
build_conj(_, _, []).  % Termina quando não consegue mais sintomas

has_sym(S, example(_, Obj)) :- member(S, Obj).

choose_symptom(Exs, Pulseira, Best) :-
    setof(S, candidate(Exs, Pulseira, S), Syms),
    maplist(score_sym(Exs, Pulseira), Syms, Pairs),
    keysort(Pairs, Sorted),
    reverse(Sorted, [_-Best | _]).

candidate(Exs, Pulseira, S) :-
    member(example(C1, Obj), Exs),
    C1 == Pulseira,
    member(S, Obj), \+ S = not(_),
    member(example(C2, Obj2), Exs),
    C2 \== Pulseira,
    \+ member(S, Obj2), !.

score_sym(Exs, Pulseira, S, Score-S) :-
    include(has_sym(S), Exs, Inc), length(Inc, N),
    include({Pulseira}/[example(Cls, _)]>>(Cls == Pulseira), Inc, Pos), length(Pos, NP),
    Score is (NP + 1) / (N + 2).

remove_covered([], _, _, []).
remove_covered([example(P, Obj) | Es], Pulseira, Conj, Rest) :-
    P == Pulseira,
    satisfy_aprend(Obj, Conj), !,
    remove_covered(Es, Pulseira, Conj, Rest).
remove_covered([E | Es], Pulseira, Conj, [E | Rest]) :-
    remove_covered(Es, Pulseira, Conj, Rest).

satisfy_aprend(Obj, Conj) :-
    forall(member(S, Conj), member(S, Obj)).
