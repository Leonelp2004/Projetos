import re
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_path = "."

tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto",
    local_files_only=True
)

# Protocolo específico de triagem de quedas
protocolo_quedas = """
PROTOCOLO DE TRIAGEM DE QUEDAS - MANCHESTER

PULSEIRA VERMELHA (Emergência):
• Hipotensão (TA<90/60mmHg) + taquicardia (FC>100bpm) + palidez cutânea = CHOQUE
• Hipotensão (TA<90/60mmHg) + taquicardia (FC>100bpm) + sudorese = CHOQUE  
• Hipotensão (TA<90/60mmHg) + taquicardia (FC>100bpm) + diminuição consciência (ECG≤12) = CHOQUE
• Crise epilética tónica/clónica generalizada = CONVULSIONANDO
• Glicemia capilar <70 mg/dL = HIPOGLICEMIA

PULSEIRA LARANJA (Muito Urgente):
• Queda de altura >1m ou >5 escadas = MECANISMO TRAUMA SIGNIFICATIVO
• Hipotermia (T<35°C) = HIPOTERMIA
• Dor intensa (>7/10 numérica ou >3 fácies) = DOR INTENSA

PULSEIRA AMARELA (Urgente):
• História de perda de consciência após evento = HISTÓRIA INCONSCIÊNCIA
• Distúrbio coagulação conhecido = DISTÚRBIO COAGULAÇÃO
• História discordante (factos não explicam lesões) = HISTÓRIA DISCORDANTE  
• Fratura exposta/deformidade importante = FRATURA EXPOSTA
• Dor moderada (4-7/10 numérica ou 2-3 fácies) = DOR MODERADA

PULSEIRA VERDE (Pouco Urgente):
• Dor ligeira (<3/10 numérica ou <2 fácies) = DOR LIGEIRA
• Edema localizado/deformidade = EDEMA/DEFORMIDADE

PULSEIRA AZUL (Não Urgente):
• Queda sem sintomas ou sinais relevantes = QUEDA SEM SINTOMAS
"""

# Prompt de sistema para o LLM principal
system_prompt = f"""Eu sou um assistente de triagem de quedas baseado no protocolo de Manchester. Respondo apenas a questões acerca de quedas, triagem, sintomas, sinais, avaliação de gravidade (pulseira Vermelha, Laranja, Amarela, Verde) ou conduta após queda em humanos. Se a pergunta for sobre outro tema, recuse com: 'Desculpe, só posso responder questões relacionadas com triagem de quedas em humanos segundo o protocolo de Manchester.'

{protocolo_quedas}

Use o protocolo acima para determinar pulseiras e seja preciso citando os critérios específicos.
"""

# Prompt específico para validação pelo LLM
prompt_validacao = """Você é um filtro especializado em identificar se perguntas são sobre triagem médica de quedas em humanos.

ACEITE apenas perguntas sobre:
- Avaliação médica após queda em pessoas
- Atribuição de pulseiras de triagem (Vermelha/Laranja/Amarela/Verde/Azul)
- Sintomas, sinais vitais ou condições após queda
- Aplicação do protocolo de Manchester para quedas
- Cenários clínicos envolvendo quedas em humanos

REJEITE perguntas sobre:
- Animais (cães, gatos, etc.)
- Objetos 
- Quedas não-médicas (preços, cabelo, sistemas, etc.)
- Prevenção de quedas (foco deve ser triagem/avaliação)
- Outros protocolos não relacionados a quedas
- Assuntos gerais não relacionados a triagem médica

Responda apenas "ACEITAR" ou "REJEITAR":"""

def valida_com_llm(pergunta):
    """Usa o LLM para determinar se a pergunta é válida"""
    input_validacao = f"{prompt_validacao}\n\nPergunta: \"{pergunta}\"\n\nResposta:"
    
    inputs = tokenizer(input_validacao, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=10,
            temperature=0.1,
            do_sample=False,
            pad_token_id=tokenizer.eos_token_id
        )
    
    resposta = tokenizer.decode(outputs[0], skip_special_tokens=True)
    resposta_limpa = resposta.replace(input_validacao, "").strip().upper()
    
    # Verifica se a resposta contém "ACEITAR"
    return "ACEITAR" in resposta_limpa[:20]

def processar_resposta_principal(pergunta):
    """Processa a pergunta com o LLM principal de triagem"""
    input_text = f"{system_prompt}\n\nUsuário: {pergunta}\nAssistente:"
    inputs = tokenizer(input_text, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=200,
            temperature=0.3,
            do_sample=True,
            top_p=0.9,
            pad_token_id=tokenizer.eos_token_id,
            repetition_penalty=1.1
        )
    
    resposta_completa = tokenizer.decode(outputs[0], skip_special_tokens=True)
    resposta_limpa = resposta_completa.replace(input_text, "").strip()
    
    # Limpa a resposta
    if "Assistente:" in resposta_limpa:
        resposta_limpa = resposta_limpa.split("Assistente:")[-1].strip()
    
    # Remove linhas que possam conter partes do prompt
    linhas = resposta_limpa.split('\n')
    resposta_final = []
    
    for linha in linhas:
        linha = linha.strip()
        if linha and not any(palavra in linha.lower() for palavra in ['usuário:', 'sistema:', 'prompt:', 'instruções:']):
            resposta_final.append(linha)
    
    return '\n'.join(resposta_final).strip()

# Loop principal - SIMPLES e focado no LLM
print("=" * 60)
print("🏥 SISTEMA DE TRIAGEM DE QUEDAS - PROTOCOLO MANCHESTER 🏥")
print("\nSou um assistente de enfermagem especializado no processo de triagem de quedas baseado no protocolo de Manchester. \n \nRespondo apenas a questões relacionadas com o procedimento de triagem de quedas. \n \nEsta análise é totalemte realizada por IA")
print("=" * 60)
print("Digite a sua questão ou escreva 'sair' para encerrar.")
print("\n" + "-"*60)

while True:
    pergunta = input("\n💬 Questão: ").strip()
    
    if pergunta.lower() in ['sair', 'exit', 'quit', 'q']:
        print("\n👋 Encerrando o sistema. Até logo!")
        break

    if not pergunta:
        print("⚠️  Por favor, digite a sua questão.")
        continue

    print("🤖 A sua questão encontra-se em processo de análise, por favor aguarde.")
    
    # O LLM decide se aceita ou rejeita
    if valida_com_llm(pergunta):
        print("✅ Questão válida, prosseguindo com a triagem...")
        
        try:
            resposta = processar_resposta_principal(pergunta)
            
            print("\n" + "="*50)
            print("🩺 RESPOSTA DA TRIAGEM:")
            print("="*50)
            print(resposta)
            print("="*50)
            
        except Exception as e:
            print(f"⚠️ Erro ao processar: {e}")
        
    else:
        print("\n❌ A questão colocada não se encontra relacionada com a triagem de quedas.")
        print("Desculpe, só posso responder questões relacionadas com triagem de quedas em humanos segundo o protocolo de Manchester. \nGrato pela compreensão!")