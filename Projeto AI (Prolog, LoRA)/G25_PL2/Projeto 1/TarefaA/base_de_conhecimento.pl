/*================================================================
   PROTOCOLO DE TRIAGEM
================================================================*/
:- encoding(utf8).

:- discontiguous perguntar/2.
:- multifile perguntar/2.
:- multifile perguntar/1.
:- multifile atribuir_pulseira/2.
:- multifile sintoma/1.
:- multifile ja_atribuida/0.

/****************************************************************
    * 3) QUESTÕES DO SISTEMA DE TRIAGEM  (NÃO ALTERAR)
    ****************************************************************/
   
   % --- Fluxo Circulação (C) ---
   perguntar(hemorragia_visivel, 'O doente apresenta hemorragia visível ou refere perdas hemáticas significativas? (s/n)').
   perguntar(fluxo_abundante, 'A hemorragia é de grande volume? (s/n)').
   perguntar(nao_controlavel, 'A hemorragia não é controlável com compressão? (s/n)').
   perguntar(hipotensao, 'O doente apresenta hipotensão (TA<90/60 mmHg)? (s/n)').
   perguntar(taquicardia, 'O doente apresenta taquicardia (FC>100 bpm)? (s/n)').
   perguntar(palidez_cutanea, 'O doente apresenta palidez cutânea? (s/n)').
   perguntar(sudorese, 'O doente apresenta sudorese? (s/n)').
   perguntar(diminuicao_estado_consciencia, 'O doente apresenta diminuição do estado de consciência? (s/n)').
   perguntar(fluxo_moderado, 'A hemorragia é de volume moderado? (s/n)').
   perguntar(fluxo_ligeiro, 'A hemorragia é de volume ligeiro? (s/n)').
   perguntar(persistente, 'A hemorragia é persistente? (s/n)').
   perguntar(dificil_controlo, 'A hemorragia é de difícil controlo? (s/n)').
   
   % --- Fluxo A+B (Airway + Breathing) ---
   perguntar(dificuldade_respiratoria, 'O doente apresenta queixas ou sinais de dificuldade respiratória? (s/n)').
   perguntar(aspiracao_corpo_estranho, 'Há suspeita de aspiração de corpo estranho? (s/n)').
   perguntar(estridor, 'O doente apresenta estridor? (s/n)').
   perguntar(cianose, 'O doente apresenta cianose? (s/n)').
   perguntar(ausencia_sons_respiratorios, 'O doente apresenta ausência de sons respiratórios? (s/n)').
   perguntar(incapacidade_verbalizar, 'O doente apresenta incapacidade de verbalizar? (s/n)').
   perguntar(congestao_facial, 'O doente apresenta congestão facial? (s/n)').
   perguntar(spo2_baixa_90, 'SpO₂ <90 % em ar ambiente? (s/n)').
   perguntar(bradipneia,            'Odoenteencontra-sebradipneico(FR<12cpm)?(s/n)').
   perguntar(taquipneia, 'O doente encontra-se taquipneico (FR>20 cpm)? (s/n)').
   perguntar(polipneia, 'O doente encontra-se polipneico? (s/n)').
   perguntar(padrao_cheyne_stokes, 'O doente apresenta padrão respiratório de Cheyne-Stokes? (s/n)').
   perguntar(padrao_kussmaul, 'O doente apresenta padrão respiratório de Kussmaul? (s/n)').
   perguntar(padrao_biot, 'O doente apresenta padrão respiratório de Biot? (s/n)').
   perguntar(padrao_paradoxal, 'O doente apresenta padrão respiratório paradoxal? (s/n)').
   perguntar(dispneia, 'O doente apresenta dispneia? (s/n)').
   perguntar(tiragem, 'O doente apresenta apresenta tiragem? (s/n)').
   perguntar(musculos_acessorios, 'O doente apresenta recruta músculos respiratórios acessórios na ventilação? (s/n)').
   perguntar(ruidos_respiratorios, 'O doente apresenta respiração ruidosa (sibilos, crepitações ou outro)? (s/n)').
   
   % --- Fluxo D (Disability) ---
   perguntar(alteracao_estado_consciencia, 'O doente apresenta alteração súbita do estado de consciência? (s/n)').
   perguntar(ecg_baixo, 'O doente apresenta diminuição do estado de consciência (ECG (≤13) ou -2)? (s/n)').
   perguntar(menor_idade, 'O doente apresenta idade <18 anos? (s/n)').
   perguntar(defice_neurologico, 'O doente apresenta evidência de défice neurológico? (s/n)').
   perguntar(defice_motor_novo, 'O doente apresenta défice motor de novo? (s/n)').
   perguntar(defice_sensitivo_novo, 'O doente apresenta défice sensitivo de novo? (s/n)').
   perguntar(alteracao_fala, 'O doente apresenta alteração da fala? (s/n)').
   perguntar(desvio_ocular, 'O doente apresenta anisocoria? (s/n)').
   perguntar(desvio_comissura_labial, 'O doente apresenta desvio da comissura labial? (s/n)').
   perguntar(agitacao, 'O doente apresenta agitação? (s/n)').
   perguntar(verborreico, 'O doente apresenta verborreia? (s/n)').
   perguntar(historia_de_inconsciencia, 'O doente apresenta história recente de perda de consciência? (s/n)').
   
   % --- Fluxo Dor Torácica (DT) ---
   perguntar(dor_toracica, 'O doente apresenta dor torácica não traumática? (s/n)').
   perguntar(hipotensao_cardiogenico, 'O doente apresenta hipotensão (TA<90/60 mmHg)? (s/n)').
   perguntar(taquicardia_cardiogenico, 'O doente apresenta taquicardia (FC>100 bpm)? (s/n)').
   perguntar(palidez_cutanea_cardiogenico, 'O doente apresenta palidez cutânea? (s/n)').
   perguntar(sudorese_cardiogenico, 'O doente apresenta sudorese? (s/n)').
   perguntar(diminuicao_estado_consciencia_cardiogenico, 'O doente apresenta diminuição do estado de consciência? (s/n)').
   perguntar(bradicardia, 'O doente apresenta bradicardia (FC <60 bpm)? (s/n)').
   perguntar(taquicardia_cardio, 'O doente apresenta taquicardia (FC >100 bpm)? (s/n)').
   perguntar(pulso_arritmico, 'O doente apresenta pulso arrítmico? (s/n)').
   perguntar(historia_cardiaca_importante, 'O doente apresenta história cardíaca importante (angina, enfarte agudo do miocárdio ou insuficiência cardíaca ou outro)? (s/n)').
   perguntar(dor_pleuritica, 'O doente apresenta dor pleurítica (agravamento com movimentos expiratórios? (s/n)').
   perguntar(dor_moderada, 'O doente apresenta dor moderada (Score <=7/10 e >=4/10 na escala numérica ou <=3 e >2 na escala fácies)? (s/n)').
   perguntar(dor_intensa, 'O doente apresenta dor intensa (Score >7/10 ou >3 na escala fácies)? (s/n)').
   perguntar(vomitos, 'Apresenta história atual de vómitos? (s/n)').
   perguntar(vomitos_persistentes, 'Apresenta vómitos persistentes (>2)? (s/n)').
   perguntar(dor_ligeira, 'O doente apresenta dor ligeira (Score <3 na escala numérica ou <2 na escala fácies  <2 dias)? (s/n)').
   perguntar(evento_recente, 'O evento decorreu, no máximo, há dois dias? (s/n)').
   
   % --- Fluxo Exposure : Overdose ---
   perguntar(ingestao_substancias, 'Há evidência de ingestão (voluntária/acidental) de substâncias tóxicas? (s/n)').
   perguntar(hipotensao_exp, 'O doente apresenta hipotensão (TA<90/60 mmHg)? (s/n)').
   perguntar(taquicardia_exp, 'O doente apresenta taquicardia (FC>100 bpm)? (s/n)').
   perguntar(palidez_cutanea_exp, 'O doente apresenta palidez cutânea? (s/n)').
   perguntar(sudorese_exp, 'O doente apresenta sudorese? (s/n)').
   perguntar(diminuicao_estado_consciencia_exp, 'O doente apresenta diminuição do estado de consciência? (s/n)').
   perguntar(convulsionando, 'Apresenta crise epilética generalizada ou pós-ictal? (s/n)').
   perguntar(glicemia_baixa, 'Apresenta glicemia <70 mg/dL? (s/n)').
   perguntar(risco_nova_autoagressao, 'Há risco de autoagressão? (s/n)').
   perguntar(mortalidade_alta, 'A substância ingerida apresenta suspeita ou risco alto de mortalidade? (s/n)').
   perguntar(mortalidade_moderada, 'A substância ingerida apresenta suspeita ou risco moderado de mortalidade? (s/n)').
   perguntar(spo2_baixa_92, 'O doente apresenta SpO₂ <92% em ar ambiente? (s/n)').
   perguntar(historia_discordante,  'Ahistóriadedoençaatualédiscordante?(s/n)').
   perguntar(historia_psiquiatrica_importante, 'Apresenta antecedente pessoal de foro psiquiátrico? (s/n)').
   perguntar(agitacao_psicomotora, 'Apresenta agitação psicomotora? (s/n)').
   perguntar(ideacao_suicida, 'Há evidência de ideação suicida? (s/n)').
   perguntar(vontade_viver_comprometida, 'A vontade de viver está comprometida? (s/n)').
   perguntar(vontade_de_infligir_dor, 'Há evidência de vontade de infligir dor? (s/n)').
   perguntar(confusao, 'Confusão? (s/n)').
   
   % --- Fluxo Exposure : Queda ---
   perguntar(queda, 'Há evidência de evento de queda? (s/n)').
   perguntar(hipotensao_queda, 'O doente apresenta hipotensão (TA<90/60)? (s/n)').
   perguntar(taquicardia_queda, 'O doente apresenta taquicardia (FC>100)? (s/n)').
   perguntar(palidez_cutanea_queda, 'O doente apresenta palidez cutânea? (s/n)').
   perguntar(sudorese_queda, 'O doente apresenta sudorese? (s/n)').
   perguntar(diminuicao_estado_consciencia_queda, 'O doente apresenta diminuição do estado de consciência? (s/n)').
   perguntar(convulsionando_queda, 'Existe suspeita ou evidência de crise epilética? (s/n)').
   perguntar(glicemia_baixa_queda, 'Apresneta glicemia <70mg/dL? (s/n)').
   perguntar(queda_sup_1m, 'Apresentou queda de altura >1m? (s/n)').
   perguntar(queda_sup_5escadas, 'Apresentou queda de escadas >5 degraus? (s/n)').
   perguntar(hipotermia, 'Apresenta taur <35 °C? (s/n)').
   perguntar(disturbio_da_coagulacao, 'Apresenta distúrbio da coagulação? (s/n)').
   perguntar(fratura_exposta, 'Apresenta fratura exposta ou deformidade importante? (s/n)').
   perguntar(edema, 'Apresenta edema localizado? (s/n)').
   
   % --- Fluxo Exposure : Trauma ---
   perguntar(trauma, 'Existe evidência de envolvimento em evento acidental com risco de lesão? (s/n)').
   perguntar(hipotensao_trauma, 'O doente apresenta hipotensão (TA<90/60)? (s/n)').
   perguntar(taquicardia_trauma, 'O doente apresenta taquicardia (FC>100)? (s/n)').
   perguntar(palidez_cutanea_trauma, 'O doente apresenta palidez cutânea? (s/n)').
   perguntar(sudorese_trauma, 'O doente apresenta sudorese? (s/n)').
   perguntar(diminuicao_estado_consciencia_trauma, 'O doente apresenta diminuição do estado de consciência? (s/n)').
   perguntar(acidente_viacao, 'Houve envolvimento em acidente de viação? (s/n)').
   perguntar(projecao, 'Há história de evento de projeção? (s/n)').
   perguntar(ejecao, 'Há história de evento de ejeção? (s/n)').
   perguntar(agressao, 'Há história ou suspeita de agressão? (s/n)').
   perguntar(patologia_cardiaca, 'Apresenta patologia cardíaca? (s/n)').
   perguntar(patologia_renal, 'Apresenta patologia renal? (s/n)').
   perguntar(patologia_hepatica, 'Apresenta patologia hepática? (s/n)').
   perguntar(diabetes, 'Apresenta antecedente pessoal de diabetes mellitus? (s/n)').
   perguntar(cirurgia_recente, 'Apresenta antecedente pessoal de cirurgia recente? (s/n)').
   
   % --- Fluxo Exposure : TCE ---
   perguntar(lesao_cefalica, 'O doente apresenta hematoma, equimose visível ou lesão na região cefálica? (s/n)').
   perguntar(convulsionando_tce, 'O doente apresenta crise epilética tónico-clónica generalizada ou pós ictal? (s/n)').
   perguntar(hipotensao_tce, 'O doente apresenta hipotensão (TA<90/60)? (s/n)').
   perguntar(taquicardia_tce, 'O doente apresenta taquicardia (FC>100)? (s/n)').
   perguntar(palidez_cutanea_tce, 'O doente apresenta palidez cutânea? (s/n)').
   perguntar(sudorese_tce, 'O doente apresenta sudorese? (s/n)').
   perguntar(diminuicao_estado_consciencia_tce, 'O doente apresenta diminuição do estado de consciência? (s/n)').
   perguntar(glicemia_baixa_tce, 'Apresenta glicemia <70 mg/dL? (s/n)').
   perguntar(acidente_viacao_tce, 'Existe evidência de envolvimento em acidente de viação? (s/n)').
   perguntar(projecao_tce, 'Há história de evento de Projeção? (s/n)').
   perguntar(ejecao_tce, 'Há história de evento de ejeção? (s/n)').
   perguntar(agressao_tce, 'Há história ou suspeita de agressão? (s/n)').
   perguntar(hematoma_couro_cabeludo, 'Apresenta hematoma do couro cabeludo? (s/n)').
   perguntar(dor_moderada_tce, 'Apresenta dor moderada (Score <=7/10 e >=4/10 na escala numérica ou <=3 e >2 na escala fácies)? (s/n)').
   perguntar(dor_intensa_tce, 'Apresenta dor intensa (Score >7/10 ou >3 na escala fácies)? (s/n)').
   perguntar(dor_ligeira_tce, 'Apresenta dor ligeira (Score <3 na escala numérica ou <2 na escala fácies  <2 dias)? (s/n)').
   perguntar(perda_estado_consciencia_tce, 'Apresenta história de perda de consciência ? (s/n)').
   perguntar(historia_discordante, 'A história de doença atual é discordante? (s/n)').
   perguntar(disturbio_da_coagulacao_tce, 'Apresenta distúrbio da coagulação? (s/n)').


/*----------------------------------------------------------------
  5) FLUXOS E SUB-FLUXOS
----------------------------------------------------------------*/

% ---------- CIRCULAÇÃO -----------------------------------------
fluxo_circulacao :-
	perguntar(hemorragia_visivel),
	(sintoma(hemorragia_visivel) ->
	perguntar(fluxo_abundante),
		perguntar(nao_controlavel),
		(sintoma(fluxo_abundante),
			sintoma(nao_controlavel) ->
	atribuir_pulseira(vermelha, hemorragia_exanguinante);
	true),
		\+ ja_atribuida,
		perguntar(hipotensao),
		(sintoma(hipotensao),
			perguntar(taquicardia),
			sintoma(taquicardia),
			perguntar(palidez_cutanea),
			%se tiver estes 3 + um dos proximos
			(sintoma(palidez_cutanea),
				perguntar(sudorese),
				sintoma(sudorese);
	perguntar(diminuicao_estado_consciencia),
				sintoma(diminuicao_estado_consciencia)) ->
	atribuir_pulseira(vermelha, choque);
	%atribui esta pulseira
	true),
		\+ ja_atribuida,
		perguntar(fluxo_moderado),
		(sintoma(fluxo_moderado) ->
	atribuir_pulseira(laranja, hemorragia_maior_incontrolavel);
	true),
		\+ ja_atribuida,
		perguntar(fluxo_ligeiro),
		(sintoma(fluxo_ligeiro),
			perguntar(persistente),
			perguntar(dificil_controlo),
			(sintoma(persistente);
	sintoma(dificil_controlo)) ->
	atribuir_pulseira(amarela, hemorragia_menor_incontrolavel);
	true);
	true).

% ---------- AIRWAY + BREATHING ---------------------------------

fluxo_ab :-
	 \+ ja_atribuida,
	perguntar(dificuldade_respiratoria),
	(sintoma(dificuldade_respiratoria) ->
		(perguntar(aspiracao_corpo_estranho),
			(sintoma(aspiracao_corpo_estranho) ->
		atribuir_pulseira(vermelha, obstrucao_via_aerea);
		true),
			 \+ ja_atribuida,
			perguntar(incapacidade_verbalizar),
			perguntar(cianose),
			perguntar(congestao_facial),
			(sintoma(incapacidade_verbalizar),
				(sintoma(cianose);
		sintoma(congestao_facial)) ->
		atribuir_pulseira(vermelha, obstrucao_via_aerea);
		true),
			 \+ ja_atribuida,
			perguntar(estridor),
			perguntar(cianose),
			perguntar(congestao_facial),
			(sintoma(estridor),
				(sintoma(cianose);
		sintoma(congestao_facial)) ->
		atribuir_pulseira(vermelha, obstrucao_via_aerea);
		true),
			 \+ ja_atribuida,
			perguntar(ausencia_sons_respiratorios),
			(sintoma(ausencia_sons_respiratorios) ->
		atribuir_pulseira(vermelha, obstrucao_via_aerea);
		true),
			 \+ ja_atribuida,
			perguntar(spo2_baixa_90),
			(sintoma(spo2_baixa_90) ->
		atribuir_pulseira(vermelha, respiracao_inadequada);
		true),
			 \+ ja_atribuida,
			perguntar(bradipneia),
			(sintoma(bradipneia) ->
		atribuir_pulseira(vermelha, respiracao_inadequada);
		true),
			 \+ ja_atribuida,
			perguntar(taquipneia),
			(sintoma(taquipneia) ->
		atribuir_pulseira(vermelha, respiracao_inadequada);
		true),
			 \+ ja_atribuida,
			perguntar(polipneia),
			(sintoma(polipneia) ->
		atribuir_pulseira(vermelha, respiracao_inadequada);
		true),
			 \+ ja_atribuida,
			perguntar(padrao_cheyne_stokes),
			(sintoma(padrao_cheyne_stokes) ->
		atribuir_pulseira(vermelha, respiracao_inadequada);
		true),
			 \+ ja_atribuida,
			perguntar(padrao_biot),
			(sintoma(padrao_biot) ->
		atribuir_pulseira(vermelha, respiracao_inadequada);
		true),
			 \+ ja_atribuida,
			perguntar(padrao_kussmaul),
			(sintoma(padrao_kussmaul) ->
		atribuir_pulseira(vermelha, respiracao_inadequada);
		true),
			 \+ ja_atribuida,
			perguntar(padrao_paradoxal),
			(sintoma(padrao_paradoxal) ->
		atribuir_pulseira(vermelha, respiracao_inadequada);
		true),
			 \+ ja_atribuida,
			perguntar(dispneia),
			(sintoma(dispneia) ->
		(perguntar(tiragem),
					(sintoma(tiragem) ->
		atribuir_pulseira(vermelha, respiracao_inadequada);
		true),
					 \+ ja_atribuida,
					perguntar(musculos_acessorios),
					(sintoma(musculos_acessorios) ->
		atribuir_pulseira(vermelha, respiracao_inadequada);
		true),
					 \+ ja_atribuida,
					perguntar(ruidos_respiratorios),
					(sintoma(ruidos_respiratorios) ->
		atribuir_pulseira(vermelha, respiracao_inadequada);
		true));
		true));
		true% <- Se NÃO tiver dificuldade respiratória, simplesmente termina o fluxo_ab aqui e passa para o fluxo_d
		).

% ---------- DISABILITY -----------------------------------------
fluxo_d :-
	 \+ ja_atribuida,
	perguntar(alteracao_estado_consciencia),
	(sintoma(alteracao_estado_consciencia) ->
		perguntar(ecg_baixo),
		perguntar(menor_idade),
		(sintoma(ecg_baixo),
			sintoma(menor_idade) ->
		atribuir_pulseira(vermelha, crianca_nao_reativa);
		true),
		 \+ ja_atribuida,
		perguntar(defice_neurologico),
		(sintoma(defice_neurologico) ->
		perguntar(defice_motor_novo),
			(sintoma(defice_motor_novo) ->
		atribuir_pulseira(laranja, defice_neurologico_agudo);
		perguntar(defice_sensitivo_novo),
				(sintoma(defice_sensitivo_novo) ->
		atribuir_pulseira(laranja, defice_neurologico_agudo);
		perguntar(alteracao_fala),
					(sintoma(alteracao_fala) ->
		atribuir_pulseira(laranja, defice_neurologico_agudo);
		perguntar(desvio_ocular),
						(sintoma(desvio_ocular) ->
		atribuir_pulseira(laranja, defice_neurologico_agudo);
		perguntar(desvio_comissura_labial),
							(sintoma(desvio_comissura_labial) ->
		atribuir_pulseira(laranja, defice_neurologico_agudo);
		true)))))),
		 \+ ja_atribuida,
		perguntar(agitacao),
		perguntar(verborreico),
		(sintoma(agitacao);
		sintoma(verborreico) ->
		atribuir_pulseira(amarela, agitacao_psicomotora);
		true),
		 \+ ja_atribuida,
		perguntar(historia_de_inconsciencia),
		(sintoma(historia_de_inconsciencia) ->
		atribuir_pulseira(amarela, historia_de_inconsciencia);
		true);
		true).

% ---------- DOR TORÁCICA ---------------------------------------
fluxo_dor_toracica :-
	 \+ ja_atribuida,
	perguntar(dor_toracica),
	(sintoma(dor_toracica) ->
		% Verificar suspeita de choque cardiogênico
		perguntar(hipotensao_cardiogenico),
		perguntar(taquicardia_cardiogenico),
		perguntar(palidez_cutanea_cardiogenico),
		% Caso 1: Com sudorese
		(sintoma(hipotensao_cardiogenico),
			sintoma(taquicardia_cardiogenico),
			sintoma(palidez_cutanea_cardiogenico) ->
		perguntar(sudorese_cardiogenico),
			(sintoma(sudorese_cardiogenico) ->
		atribuir_pulseira(vermelha, choque_cardiogenico);
		true);
		true),
		 \+ ja_atribuida,
		% Caso 2: Com diminuição do estado de consciência
		(sintoma(hipotensao_cardiogenico),
			sintoma(taquicardia_cardiogenico),
			sintoma(palidez_cutanea_cardiogenico) ->
		perguntar(diminuicao_estado_consciencia_cardiogenico),
			(sintoma(diminuicao_estado_consciencia_cardiogenico) ->
		atribuir_pulseira(vermelha, choque_cardiogenico);
		true);
		true),
		 \+ ja_atribuida,
		% A. Frequência cardíaca alterada - avaliação individual
		perguntar(bradicardia),
		(sintoma(bradicardia) ->
		atribuir_pulseira(laranja, pulso_anormal);
		true),
		 \+ ja_atribuida,
		perguntar(taquicardia_cardio),
		(sintoma(taquicardia_cardio) ->
		atribuir_pulseira(laranja, pulso_anormal);
		true),
		 \+ ja_atribuida,
		perguntar(pulso_arritmico),
		(sintoma(pulso_arritmico) ->
		atribuir_pulseira(laranja, pulso_anormal);
		true),
		 \+ ja_atribuida,
		% B. Dor intensa
		perguntar(dor_intensa),
		(sintoma(dor_intensa) ->
		atribuir_pulseira(laranja, dor_intensa);
		true),
		 \+ ja_atribuida,
		% C. História cardíaca importante
		perguntar(historia_cardiaca_importante),
		(sintoma(historia_cardiaca_importante) ->
		atribuir_pulseira(amarela, historia_cardiaca_importante);
		true),
		 \+ ja_atribuida,
		% D. Dor pleurítica
		perguntar(dor_pleuritica),
		(sintoma(dor_pleuritica) ->
		atribuir_pulseira(amarela, dor_pleuritica);
		true),
		 \+ ja_atribuida,
		% E. Dor moderada
		perguntar(dor_moderada),
		(sintoma(dor_moderada) ->
		atribuir_pulseira(amarela, dor_moderada);
		true),
		 \+ ja_atribuida,
		% F e G. Vômitos
		perguntar(vomitos),
		(sintoma(vomitos) ->
		perguntar(vomitos_persistentes),
			(sintoma(vomitos_persistentes) ->
		atribuir_pulseira(amarela, vomitos_persistentes);
		atribuir_pulseira(verde, vomitos));
		% Verifica dor leve quando não tem vômitos
		 \+ ja_atribuida,
			perguntar(dor_ligeira),
			(sintoma(dor_ligeira) ->
		atribuir_pulseira(verde, dor_ligeira);
		true)),
		 \+ ja_atribuida,
		% H. Verifica evento recente
		perguntar(evento_recente),
		(sintoma(evento_recente) ->
		atribuir_pulseira(verde, evento_recente);
		% Se não for evento recente e não tiver outros critérios
		( \+ ja_atribuida ->
		atribuir_pulseira(azul, sem_criterio);
		true));
		true).

% ---------- EXPOSURE -------------------------------------------
fluxo_exposure :-
	 \+ ja_atribuida,
	subfluxo_overdose,
	 \+ ja_atribuida,
	subfluxo_queda,
	 \+ ja_atribuida,
	subfluxo_trauma_maior,
	 \+ ja_atribuida,
	subfluxo_tce.

/*--------------------------------------------------------------
   SUB-FLUXO 1 : OVERDOSE / INTOXICAÇÃO
----------------------------------------------------------------*/
subfluxo_overdose :-
	 \+ ja_atribuida,
	perguntar(ingestao_substancias),
	(sintoma(ingestao_substancias) ->
		/* ­--- Choque ----------------------------------------- */
		 \+ ja_atribuida,
		perguntar(hipotensao_exp),
		(sintoma(hipotensao_exp),
			perguntar(taquicardia_exp),
			sintoma(taquicardia_exp),
			perguntar(palidez_cutanea_exp),
			%se tiver estes 3 + um dos proximos
			(sintoma(palidez_cutanea_exp),
				perguntar(sudorese_exp),
				sintoma(sudorese_exp);
		perguntar(diminuicao_estado_consciencia_exp),
				sintoma(diminuicao_estado_consciencia_exp)) ->
		atribuir_pulseira(vermelha, choque_exp);
		%atribui esta pulseira
		true),
		/* ­--- Convulsões / hipoglicemia ----------------------- */
		 \+ ja_atribuida,
		perguntar(convulsionando),
		(sintoma(convulsionando) ->
		atribuir_pulseira(vermelha, convulsionando);
		true),
		 \+ ja_atribuida,
		perguntar(glicemia_baixa),
		(sintoma(glicemia_baixa) ->
		atribuir_pulseira(vermelha, hipoglicemia_grave);
		true),
		/* ­--- Pulso anómalo ----------------------------------- */
		 \+ ja_atribuida,
		perguntar(bradicardia),
		(sintoma(bradicardia) ->
		atribuir_pulseira(laranja, pulso_anormal);
		true),
		 \+ ja_atribuida,
		perguntar(taquicardia_cardio),
		(sintoma(taquicardia_cardio) ->
		atribuir_pulseira(laranja, pulso_anormal);
		true),
		 \+ ja_atribuida,
		perguntar(pulso_arritmico),
		(sintoma(pulso_arritmico) ->
		atribuir_pulseira(laranja, pulso_anormal);
		true),
		/* ­--- Auto-agressão / risco mortalidade --------------- */
		 \+ ja_atribuida,
		perguntar(risco_nova_autoagressao),
		(sintoma(risco_nova_autoagressao) ->
		atribuir_pulseira(laranja, alto_risco_de_nova_autoagressao);
		true),
		 \+ ja_atribuida,
		perguntar(mortalidade_alta),
		(sintoma(mortalidade_alta) ->
		atribuir_pulseira(laranja, mortalidade_alta); \+ ja_atribuida,
			perguntar(mortalidade_moderada),
			(sintoma(mortalidade_moderada) ->
		atribuir_pulseira(amarela, mortalidade_moderada);
		true)),
		/* ­--- Critérios dispersos de gravidade moderada -------- */
		 \+ ja_atribuida,
		perguntar(spo2_baixa_92),
		(sintoma(spo2_baixa_92) ->
		atribuir_pulseira(amarela, spo2_baixa_92);
		true),
		 \+ ja_atribuida,
		perguntar(historia_discordante),
		(sintoma(historia_discordante) ->
		atribuir_pulseira(amarela, historia_discordante);
		true),
		 \+ ja_atribuida,
		perguntar(historia_psiquiatrica_importante),
		(sintoma(historia_psiquiatrica_importante) ->
		atribuir_pulseira(amarela, historia_psiquiatrica_importante);
		true),
		 \+ ja_atribuida,
		perguntar(agitacao_psicomotora),
		(sintoma(agitacao_psicomotora) ->
		atribuir_pulseira(amarela, agitacao_psicomotora);
		true),
		 \+ ja_atribuida,
		perguntar(historia_de_inconsciencia),
		(sintoma(historia_de_inconsciencia) ->
		atribuir_pulseira(amarela, historia_de_inconsciencia);
		true);
		true).

/*--------------------------------------------------------------
 SUB-FLUXO 2 : QUEDA
----------------------------------------------------------------*/
subfluxo_queda :-
	 \+ ja_atribuida,
	perguntar(queda),
	(sintoma(queda) ->
		/* Choque por queda ------------------------------------ */
		 \+ ja_atribuida,
		perguntar(hipotensao_queda),
		(sintoma(hipotensao_queda),
			perguntar(taquicardia_queda),
			sintoma(taquicardia_queda),
			perguntar(palidez_cutanea_queda),
			%se tiver estes 3 + um dos proximos
			(sintoma(palidez_cutanea_queda),
				perguntar(sudorese_queda),
				sintoma(sudorese_queda);
		perguntar(diminuicao_estado_consciencia_queda),
				sintoma(diminuicao_estado_consciencia_queda)) ->
		atribuir_pulseira(vermelha, choque_queda);
		%atribui esta pulseira
		true),
		/* Convulsões / hipoglicemia --------------------------- */
		 \+ ja_atribuida,
		perguntar(convulsionando_queda),
		(sintoma(convulsionando_queda) ->
		atribuir_pulseira(vermelha, convulsionando_queda);
		true),
		 \+ ja_atribuida,
		perguntar(glicemia_baixa_queda),
		(sintoma(glicemia_baixa_queda) ->
		atribuir_pulseira(vermelha, hipoglicemia_grave);
		true),
		/* Mecanismo de alto impacto --------------------------- */
		 \+ ja_atribuida,
		perguntar(queda_sup_1m),
		(sintoma(queda_sup_1m) ->
		atribuir_pulseira(laranja, mecanismo_trauma_significativo);
		( \+ ja_atribuida,
				perguntar(queda_sup_5escadas),
				(sintoma(queda_sup_5escadas) ->
		atribuir_pulseira(laranja, mecanismo_trauma_significativo);
		true))),
		 \+ ja_atribuida,
		perguntar(hipotermia),
		(sintoma(hipotermia) ->
		atribuir_pulseira(laranja, hipotermia);
		true),
		 \+ ja_atribuida,
		perguntar(dor_intensa),
		(sintoma(dor_intensa) ->
		atribuir_pulseira(laranja, dor_intensa);
		true),
		/* Critérios amarelos ---------------------------------- */
		 \+ ja_atribuida,
		perguntar(historia_de_inconsciencia),
		perguntar(disturbio_da_coagulacao),
		perguntar(historia_discordante),
		((sintoma(historia_de_inconsciencia);
		sintoma(disturbio_da_coagulacao);
		sintoma(historia_discordante)) ->
		atribuir_pulseira(amarela, historia_inconsistencia_coagulacao);
		true),
		 \+ ja_atribuida,
		perguntar(fratura_exposta),
		(sintoma(fratura_exposta) ->
		atribuir_pulseira(amarela, fratura_exposta);
		true),
		 \+ ja_atribuida,
		perguntar(dor_moderada),
		(sintoma(dor_moderada) ->
		atribuir_pulseira(amarela, dor_moderada);
		true),
		/* Verde ------------------------------------------------ */
		 \+ ja_atribuida,
		perguntar(dor_ligeira),
		perguntar(edema),
		(sintoma(dor_ligeira);
		sintoma(edema) ->
		atribuir_pulseira(verde, dor_ligeira_edema);
		true);
		true).

/*--------------------------------------------------------------
 SUB-FLUXO 3 : TRAUMA MAIOR
----------------------------------------------------------------*/
subfluxo_trauma_maior :-
	 \+ ja_atribuida,
	perguntar(trauma),
	(sintoma(trauma) ->
		/* Choque ---------------------------------------------- */
		 \+ ja_atribuida,
		perguntar(hipotensao_trauma),
		(sintoma(hipotensao_trauma),
			perguntar(taquicardia_trauma),
			sintoma(taquicardia_trauma),
			perguntar(palidez_cutanea_trauma),
			%se tiver estes 3 + um dos proximos
			(sintoma(palidez_cutanea_trauma),
				perguntar(sudorese_trauma),
				sintoma(sudorese_trauma);
		perguntar(diminuicao_estado_consciencia_trauma),
				sintoma(diminuicao_estado_consciencia_trauma)) ->
		atribuir_pulseira(vermelha, choque_trauma);
		%atribui esta pulseira
		true),
		/* Mecanismo trauma significativo ------------------------------ */
		 \+ ja_atribuida,
		perguntar(acidente_viacao),
		(sintoma(acidente_viacao) ->
		atribuir_pulseira(laranja, mecanismo_trauma_significativo);
		( \+ ja_atribuida,
				perguntar(projecao),
				(sintoma(projecao) ->
		atribuir_pulseira(laranja, mecanismo_trauma_significativo);
		( \+ ja_atribuida,
						perguntar(ejecao),
						(sintoma(ejecao) ->
		atribuir_pulseira(laranja, mecanismo_trauma_significativo);
		( \+ ja_atribuida,
								perguntar(agressao),
								(sintoma(agressao) ->
		atribuir_pulseira(laranja, mecanismo_trauma_significativo);
		true))))))),
		 \+ ja_atribuida,
		perguntar(dor_intensa),
		(sintoma(dor_intensa) ->
		atribuir_pulseira(laranja, dor_intensa);
		true),
		/* Amarelos --------------------------------------------- */
		 \+ ja_atribuida,
		perguntar(historia_de_inconsciencia),
		(sintoma(historia_de_inconsciencia) ->
		atribuir_pulseira(amarela, comorbilidades);
		( \+ ja_atribuida,
				perguntar(disturbio_da_coagulacao),
				(sintoma(disturbio_da_coagulacao) ->
		atribuir_pulseira(amarela, comorbilidades);
		( \+ ja_atribuida,
						perguntar(patologia_cardiaca),
						(sintoma(patologia_cardiaca) ->
		atribuir_pulseira(amarela, comorbilidades);
		( \+ ja_atribuida,
								perguntar(patologia_renal),
								(sintoma(patologia_renal) ->
		atribuir_pulseira(amarela, comorbilidades);
		( \+ ja_atribuida,
										perguntar(patologia_hepatica),
										(sintoma(patologia_hepatica) ->
		atribuir_pulseira(amarela, comorbilidades);
		( \+ ja_atribuida,
												perguntar(diabetes),
												(sintoma(diabetes) ->
		atribuir_pulseira(amarela, comorbilidades);
		( \+ ja_atribuida,
														perguntar(cirurgia_recente),
														(sintoma(cirurgia_recente) ->
		atribuir_pulseira(amarela, comorbilidades);
		true))))))))))))),
		 \+ ja_atribuida,
		perguntar(dor_moderada),
		(sintoma(dor_moderada) ->
		atribuir_pulseira(amarela, dor_moderada);
		true);
		true).

/*--------------------------------------------------------------
 SUB-FLUXO 4 : TCE  (Traumatismo Crânio-Encefálico)
----------------------------------------------------------------*/
subfluxo_tce :-
	 \+ ja_atribuida,
	perguntar(lesao_cefalica),
	(sintoma(lesao_cefalica) ->
		% Convulsão
		 \+ ja_atribuida,
		perguntar(convulsionando_tce),
		(sintoma(convulsionando_tce) ->
		atribuir_pulseira(vermelha, convulsionando_tce);
		true),
		% Choque
		 \+ ja_atribuida,
		perguntar(hipotensao_tce),
		(sintoma(hipotensao_tce),
			perguntar(taquicardia_tce),
			sintoma(taquicardia_tce),
			perguntar(palidez_cutanea_tce),
			% Se tiver estes 3 + um dos próximos
			(sintoma(palidez_cutanea_tce),
				perguntar(sudorese_tce),
				sintoma(sudorese_tce);
		perguntar(diminuicao_estado_consciencia_tce),
				sintoma(diminuicao_estado_consciencia_tce)) ->
		atribuir_pulseira(vermelha, choque);
		true),
		% Hipoglicemia
		 \+ ja_atribuida,
		perguntar(glicemia_baixa_tce),
		(sintoma(glicemia_baixa_tce) ->
		atribuir_pulseira(vermelha, hipoglicemia);
		true),
		% Mecanismo de trauma significativo
		 \+ ja_atribuida,
		perguntar(acidente_viacao_tce),
		(sintoma(acidente_viacao_tce) ->
		atribuir_pulseira(laranja, mecanismo_trauma_significativo); \+ ja_atribuida,
			perguntar(projecao_tce),
			(sintoma(projecao_tce) ->
		atribuir_pulseira(laranja, mecanismo_trauma_significativo); \+ ja_atribuida,
				perguntar(ejecao_tce),
				(sintoma(ejecao_tce) ->
		atribuir_pulseira(laranja, mecanismo_trauma_significativo); \+ ja_atribuida,
					perguntar(agressao_tce),
					(sintoma(agressao_tce) ->
		atribuir_pulseira(laranja, mecanismo_trauma_significativo);
		true)))),
		% Dor intensa
		 \+ ja_atribuida,
		perguntar(dor_intensa_tce),
		(sintoma(dor_intensa_tce) ->
		atribuir_pulseira(laranja, dor_intensa);
		true),
		% Critérios para pulseira amarela
		 \+ ja_atribuida,
		perguntar(perda_estado_consciencia_tce),
		(sintoma(perda_estado_consciencia_tce) ->
		atribuir_pulseira(amarela, historia_de_inconsciencia_disturbio_de_coagulacao_comorbilidade);
		true),
		 \+ ja_atribuida,
		perguntar(historia_discordante),
		(sintoma(historia_discordante) ->
		atribuir_pulseira(amarela, historia_de_inconsciencia_disturbio_de_coagulacao_comorbilidade);
		true),
		 \+ ja_atribuida,
		perguntar(disturbio_da_coagulacao_tce),
		(sintoma(disturbio_da_coagulacao_tce) ->
		atribuir_pulseira(amarela, historia_de_inconsciencia_disturbio_de_coagulacao_comorbilidade);
		true),
		 \+ ja_atribuida,
		perguntar(dor_moderada_tce),
		(sintoma(dor_moderada_tce) ->
		atribuir_pulseira(amarela, dor_moderada);
		true),
		% Vômitos e outros critérios verdes - corrigido para evitar o aninhamento incorreto
		 \+ ja_atribuida,
		perguntar(vomitos),
		(sintoma(vomitos) ->
		perguntar(vomitos_persistentes),
			(sintoma(vomitos_persistentes) ->
		atribuir_pulseira(amarela, vomitos_persistentes);
		atribuir_pulseira(verde, vomitos));
		true),
		% Verificações adicionais quando não se atribuiu ainda pulseira
		 \+ ja_atribuida,
		perguntar(hematoma_couro_cabeludo),
		(sintoma(hematoma_couro_cabeludo) ->
		atribuir_pulseira(verde, hematoma_couro_cabeludo);
		true),
		 \+ ja_atribuida,
		perguntar(dor_ligeira_tce),
		(sintoma(dor_ligeira_tce) ->
		atribuir_pulseira(verde, dor_ligeira);
		true),
		% Evento recente
		 \+ ja_atribuida,
		perguntar(evento_recente),
		(sintoma(evento_recente) ->
		atribuir_pulseira(verde, evento_recente);
		% Não adicionamos pulseira azul aqui - será feito na função iniciar/0
		true);
		true).