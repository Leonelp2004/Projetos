:- encoding(utf8).

:- consult('interface.pl').
:- consult('base_de_conhecimento.pl').

:- dynamic sintoma/1, pulseira_atribuida/1.
:- discontiguous iniciar/0.

limpar_sintomas :-
	retractall(sintoma(_)).
ja_atribuida :-
	pulseira_atribuida(_).

atribuir_pulseira(Cor, Motivo) :-
	 \+ pulseira_atribuida(_),
	asserta(pulseira_atribuida(Cor)),
	format('~n>> PULSEIRA ~w  —  motivo: ~w~n', [Cor, Motivo]),
	!.

iniciar :-
	limpar_sintomas,
	retractall(pulseira_atribuida(_)),
	format('=== INÍCIO DA TRIAGEM ===~n', []),
	fluxo_circulacao,
	(ja_atribuida ->
	!;
	true),
	fluxo_ab,
	(ja_atribuida ->
	!;
	true),
	fluxo_d,
	(ja_atribuida ->
	!;
	true),
	fluxo_dor_toracica,
	(ja_atribuida ->
	!;
	true),
	fluxo_exposure,
	(ja_atribuida ->
	!;
	true),
	( \+ pulseira_atribuida(_) ->
	atribuir_pulseira(azul, sem_criterio);
	true).
