:- discontiguous perguntar/2.

perguntar(Sintoma) :-
    perguntar(Sintoma, Texto),
    format('~w ', [Texto]),
    read(R),
    (R == s -> asserta(sintoma(Sintoma)); true).



















































