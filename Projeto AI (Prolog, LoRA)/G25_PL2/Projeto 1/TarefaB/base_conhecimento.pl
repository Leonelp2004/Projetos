% ==============================================================
%  base_conhecimento.pl
%  • Regras de triagem (RuleModel) no formato “if … then …”
%  • Regra default
% ==============================================================

:- set_prolog_flag(encoding, utf8).

/* --- operadores e expansão para regra/2 --------------------- */
:- op(950,  fx,  if).        % prefixo
:- op(940, xfx, then).       % infixo
:- dynamic   regra/2.
:- multifile user:term_expansion/2.

user:term_expansion((if Cond then Classe), regra(Classe, L)) :-
    ( is_list(Cond) -> L = Cond ; L = [Cond] ).

/* --- RULE MODEL --------------------------------------------- */

if edema                                   then verde.
if queda_sup_5escadas                      then laranja.
if historia_discordante                    then amarela.
if hipotensao_ticardia_palidez_sudorose    then vermelho.
if glicemia_baixa_queda                    then vermelho.
if dor_ligeira                             then verde.
if fratura_exposta                         then amarela.
if dor_intensa                             then laranja.
if [not(hipotensao_ticardia_palidez_consciencia),
    not(historia_de_inconsciencia)]        then verde.
if hipotensao_ticardia_palidez_consciencia then vermelho.

/* --- else ---------------------------------------------------- */
default(amarelo).
