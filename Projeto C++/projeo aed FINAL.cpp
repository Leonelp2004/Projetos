#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <locale.h>
#define MAX_MOEDAS_REGULARES 100
#define MAX_MOEDAS_COMEMORATIVAS 100  
#define MAX_PAISES 10 
#define MAX_MOEDAS_PERMITIDAS 100

typedef struct {
    char nome[50];
    char acronimo[10];
    int anoAdesaoEuro;
} Pais;

typedef struct {
    double valor;
    char descricaoMetal[50];
    int anoEmissao;
    Pais pais;
    int quantidade;
    int totalQuantidade;
} MoedaRegular;

typedef struct {
    double valor;
    char descricaoMetal[50];
    int anoEmissao;
    char evento[100];
    Pais pais;
    int quantidade;
    int totalQuantidade;
} MoedaComemorativa;

typedef struct {
    char nome[50];
    MoedaRegular moedasRegularesColecionadas[100];
    MoedaComemorativa moedasComemorativasColecionadas[100];
    int numMoedasRegularesColecionadas;
    int numMoedasComemorativasColecionadas;
} Colecionador;

float moedasPermitidas[MAX_MOEDAS_PERMITIDAS] = {2.0, 1.0, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01};

void adicionarPais(Pais *paises, int *numPaises) {
    printf("Nome do país: ");
    scanf("%s", paises[*numPaises].nome);
    printf("Acrônimo do país: ");
    scanf("%s", paises[*numPaises].acronimo);
    printf("Ano de adesão ao Euro: ");
    scanf("%d", &paises[*numPaises].anoAdesaoEuro);
    (*numPaises)++;
}
// procura um país dentro de um array de países a partir de um acrônimo fornecido.
int encontrarIndicePaisPorAcronimo(Pais *paises, int numPaises, const char *acronimo) {
    for (int i = 0; i < numPaises; i++) {
        if (strcmp(paises[i].acronimo, acronimo) == 0) {
            return i;
        }
    }
    return -1;
}
int moedaPermitida(double valor) {
    for (int i = 0; i < MAX_MOEDAS_PERMITIDAS; i++) {
        if (moedasPermitidas[i] == valor) {
            return 1; 
        }
    }
    return 0; 
}
void adicionarMoedaRegular(MoedaRegular *moedasRegulares, int *numMoedasRegulares, Pais *paises, int numPaises) {
    if (numPaises > 0 && *numMoedasRegulares < MAX_MOEDAS_REGULARES ) {
        char acronimo[10];
        printf("Acrônimo do país: ");
        scanf("%s", acronimo);

        int indicePais = encontrarIndicePaisPorAcronimo(paises, numPaises, acronimo);
        if (indicePais != -1) {
            printf("Valor da moeda regular: ");
            scanf("%lf", &moedasRegulares[*numMoedasRegulares].valor);
            
			while (!moedaPermitida(moedasRegulares[*numMoedasRegulares].valor)) {
            printf("Erro, insira novamente o valor da moeda regular: ");	
            scanf("%lf", &moedasRegulares[*numMoedasRegulares].valor);
            }
            
            printf("Descrição do metal: ");
            scanf("%s", moedasRegulares[*numMoedasRegulares].descricaoMetal);
            printf("Ano de emissão: ");
            scanf("%d", &moedasRegulares[*numMoedasRegulares].anoEmissao);
			
			// Verificacao se o ano de emissão é válido em relação ao ano de adesão do país
            if (paises[indicePais].anoAdesaoEuro > 0 && paises[indicePais].anoAdesaoEuro <= moedasRegulares[*numMoedasRegulares].anoEmissao) {
                printf("Quantidade total de moedas emitidas: ");
                scanf("%d", &moedasRegulares[*numMoedasRegulares].totalQuantidade);
                moedasRegulares[*numMoedasRegulares].pais = paises[indicePais];
			    moedasRegulares[*numMoedasRegulares].quantidade = 0;
                (*numMoedasRegulares)++;
            } else {
                printf("Ano de adesão ao Euro inválido para a moeda emitida.\n");
            }
        } else {
            printf("Acrônimo de país inválido.\n");
        }
    } else {
        if (numPaises <= 0) {
            printf("Nenhum país encontrado.\n");
        } else {
            printf("Limite máximo de moedas regulares atingido.\n");
        }
    }
}
void adicionarMoedaComemorativa(MoedaComemorativa *moedasComemorativas, int *numMoedasComemorativas, Pais *paises, int numPaises) {
    if (numPaises > 0) {
        char acronimo[10];
        printf("Acrônimo do país: ");
        scanf("%s", acronimo);

        int indicePais = encontrarIndicePaisPorAcronimo(paises, numPaises, acronimo);
        if (indicePais != -1) {
            printf("Valor da moeda comemorativa: ");
            scanf("%lf", &moedasComemorativas[*numMoedasComemorativas].valor);
        	while (!moedaPermitida(moedasComemorativas[*numMoedasComemorativas].valor)) {
            printf("Erro, insira novamente o valor da moeda regular: ");	
            scanf("%lf", &moedasComemorativas[*numMoedasComemorativas].valor);
            }
            printf("Descrição do metal: ");
            scanf("%s", moedasComemorativas[*numMoedasComemorativas].descricaoMetal);
            printf("Ano de emissão: ");
            scanf("%d", &moedasComemorativas[*numMoedasComemorativas].anoEmissao);

            // Verificacao se o ano de emissão é válido em relação ao ano de adesão do país
            if (moedasComemorativas[*numMoedasComemorativas].anoEmissao >= paises[indicePais].anoAdesaoEuro) {
                printf("Evento comemorativo: ");
                scanf("%s", moedasComemorativas[*numMoedasComemorativas].evento);
                printf("Quantidade total de moedas emitidas: ");
                scanf("%d", &moedasComemorativas[*numMoedasComemorativas].totalQuantidade);
                moedasComemorativas[*numMoedasComemorativas].pais = paises[indicePais];
                moedasComemorativas[*numMoedasComemorativas].quantidade = 0;
                (*numMoedasComemorativas)++;
            } else {
                printf("Ano de emissão inválido em relação ao ano de adesão ao Euro do país.\n");
            }
        } else {
            printf("Acrônimo de país inválido.\n");
        }
    } else {
        printf("Nenhum país inserido. Insira um país antes de adicionar moedas.\n");
    }
}

void registarQuantidadeMoedaRegularColecionador(Colecionador *colecionador, MoedaRegular *moedasRegulares) {
    double valor;
    char descricaoMetal[50];
    int anoEmissao;
    int quantidade;

    printf("Digite o valor da moeda regular que possui: ");
    scanf("%lf", &valor);
    printf("Digite a descrição do metal: ");
    scanf("%s", descricaoMetal);
    printf("Digite o ano de emissão: ");
    scanf("%d", &anoEmissao);

    int encontrado = 0;
    for (int i = 0; i < colecionador->numMoedasRegularesColecionadas; i++) {
        if (colecionador->moedasRegularesColecionadas[i].valor == valor &&
            strcmp(colecionador->moedasRegularesColecionadas[i].descricaoMetal, descricaoMetal) == 0 &&
            colecionador->moedasRegularesColecionadas[i].anoEmissao == anoEmissao) {
            encontrado = 1;
            printf("Digite a quantidade: ");
            scanf("%d", &quantidade);

            // Verificar se a quantidade não ultrapassa o total de moedas emitidas
            if (quantidade <= colecionador->moedasRegularesColecionadas[i].totalQuantidade) {
                colecionador->moedasRegularesColecionadas[i].quantidade += quantidade;
                printf("Quantidade registada com sucesso.\n");
            } else {
                printf("Quantidade excede o limite de moedas emitidas.\n");
            }
            break;
        }
    }

    if (!encontrado) {
        printf("Moeda regular não encontrada na coleção.\n");
    }
}
void registarQuantidadeMoedaComemorativaColecionador(Colecionador *colecionador, MoedaComemorativa *moedasComemorativas) {
    double valor;
    char descricaoMetal[50];
    int anoEmissao;
    char evento[100];
    int quantidade;

    printf("Digite o valor da moeda comemorativa que possui: ");
    scanf("%lf", &valor);
    printf("Digite a descrição do metal: ");
    scanf("%s", descricaoMetal);
    printf("Digite o ano de emissão: ");
    scanf("%d", &anoEmissao);
    printf("Digite o evento comemorativo: ");
    scanf("%s", evento);

    int encontrado = 0;
    for (int i = 0; i < colecionador->numMoedasComemorativasColecionadas; i++) {
        if (colecionador->moedasComemorativasColecionadas[i].valor == valor &&
            strcmp(colecionador->moedasComemorativasColecionadas[i].descricaoMetal, descricaoMetal) == 0 &&
            colecionador->moedasComemorativasColecionadas[i].anoEmissao == anoEmissao &&
            strcmp(colecionador->moedasComemorativasColecionadas[i].evento, evento) == 0) {
            encontrado = 1;
            printf("Digite a quantidade: ");
            scanf("%d", &quantidade);

            // Verificar se a quantidade não ultrapassa o total de moedas emitidas
            if (quantidade <= colecionador->moedasComemorativasColecionadas[i].totalQuantidade) {
                colecionador->moedasComemorativasColecionadas[i].quantidade += quantidade;
                printf("Quantidade registada com sucesso.\n");
            } else {
                printf("Quantidade excede o limite de moedas emitidas.\n");
            }
            break;
        }
    }

    if (!encontrado) {
        printf("Moeda comemorativa não encontrada na coleção.\n");
    }
}

void listarMoedasColecionador(Colecionador *colecionador) {
    printf("Moedas Regulares:\n");
    for (int i = 0; i < colecionador->numMoedasRegularesColecionadas; i++) {
        if (colecionador->moedasRegularesColecionadas[i].quantidade > 0) {
            printf("Valor: %.2f€ | Quantidade: %d | Descricao do Metal: %s | Ano de emissao: %d\n",
                   colecionador->moedasRegularesColecionadas[i].valor,
                   colecionador->moedasRegularesColecionadas[i].quantidade,
                   colecionador->moedasRegularesColecionadas[i].descricaoMetal,
                   colecionador->moedasRegularesColecionadas[i].anoEmissao);
        }
    }

    printf("\nMoedas Comemorativas:\n ");
    for (int i = 0; i < colecionador->numMoedasComemorativasColecionadas; i++) {
        if (colecionador->moedasComemorativasColecionadas[i].quantidade > 0) {
            printf("Valor: %.2f€ | Quantidade: %d | Descricao do Metal: %s | Ano de emissao: %d | Nome do evento %s\n",
                   colecionador->moedasComemorativasColecionadas[i].valor,
                   colecionador->moedasComemorativasColecionadas[i].quantidade,
                   colecionador->moedasComemorativasColecionadas[i].descricaoMetal,
                   colecionador->moedasComemorativasColecionadas[i].anoEmissao,
                   colecionador->moedasComemorativasColecionadas[i].evento);
        }
    }
}

void listarMoedasEmFaltaColecionador(Colecionador *colecionador, MoedaRegular *moedasRegulares, MoedaComemorativa *moedasComemorativas, int numMoedasRegulares, int numMoedasComemorativas) {
    printf("Moedas Regulares em Falta:\n");
    for (int i = 0; i < numMoedasRegulares; i++) {
        int encontrada = 0;
        
        for (int j = 0; j < colecionador->numMoedasRegularesColecionadas; j++) {
           if (colecionador->moedasRegularesColecionadas[j].quantidade > 0 &&
                colecionador->moedasRegularesColecionadas[j].valor == moedasRegulares[i].valor &&
                colecionador->moedasRegularesColecionadas[j].anoEmissao == moedasRegulares[i].anoEmissao &&
                strcmp(colecionador->moedasRegularesColecionadas[j].descricaoMetal, moedasRegulares[i].descricaoMetal) == 0) {
                encontrada = 1;
                break;
            }
        }
        if (!encontrada) {
            printf("Valor: %.2f€ | Descricao do Metal: %s | Ano de emissao: %d\n", moedasRegulares[i].valor, moedasRegulares[i].descricaoMetal, moedasRegulares[i].anoEmissao);
        }
    }

    printf("\nMoedas Comemorativas em Falta:\n");
    for (int i = 0; i < numMoedasComemorativas; i++) {
        int encontrada = 0;
        for (int j = 0; j < colecionador->numMoedasComemorativasColecionadas; j++) {
            if (colecionador->moedasComemorativasColecionadas[j].quantidade > 0 &&
                colecionador->moedasComemorativasColecionadas[j].valor == moedasComemorativas[i].valor &&
                colecionador->moedasComemorativasColecionadas[j].anoEmissao == moedasComemorativas[i].anoEmissao &&
                strcmp(colecionador->moedasComemorativasColecionadas[j].descricaoMetal, moedasComemorativas[i].descricaoMetal) == 0 &&
                strcmp(colecionador->moedasComemorativasColecionadas[j].evento, moedasComemorativas[i].evento) == 0) {
                encontrada = 1;
                break;
            }
        }
        if (!encontrada) {
            printf("Valor: %.2f€ | Descricao do Metal: %s | Ano de emissao: %d | Nome do evento: %s\n", moedasComemorativas[i].valor, moedasComemorativas[i].descricaoMetal, moedasComemorativas[i].anoEmissao, moedasComemorativas[i].evento);
        }
    }
}

void exportarMoedasRepetidas(Colecionador *colecionador, FILE *arquivo) {
    fprintf(arquivo, "Moedas Regulares Repetidas:\n");
    for (int i = 0; i < colecionador->numMoedasRegularesColecionadas; i++) {
        if (colecionador->moedasRegularesColecionadas[i].quantidade > 0) {
            fprintf(arquivo, "Valor: %.2f€ | Quantidade: %d | Descricao do Metal: %s | Ano de emissao: %d\n",
                   colecionador->moedasRegularesColecionadas[i].valor,
                   colecionador->moedasRegularesColecionadas[i].quantidade,
                   colecionador->moedasRegularesColecionadas[i].descricaoMetal,
                   colecionador->moedasRegularesColecionadas[i].anoEmissao);
        }
    }

    fprintf(arquivo, "\nMoedas Comemorativas Repetidas:\n");
    for (int i = 0; i < colecionador->numMoedasComemorativasColecionadas; i++) {
        if (colecionador->moedasComemorativasColecionadas[i].quantidade > 0) {
            fprintf(arquivo, "Valor: %.2f€ | Quantidade: %d | Descricao do Metal: %s | Ano de emissao: %d | Nome do evento %s\n",
                   colecionador->moedasComemorativasColecionadas[i].valor,
                   colecionador->moedasComemorativasColecionadas[i].quantidade,
                   colecionador->moedasComemorativasColecionadas[i].descricaoMetal,
                   colecionador->moedasComemorativasColecionadas[i].anoEmissao,
                   colecionador->moedasComemorativasColecionadas[i].evento);
        }
    }
}


void importarMoedasRepetidasDeOutroColecionador(Colecionador *colecionador, MoedaRegular *moedasRegulares, MoedaComemorativa *moedasComemorativas, int *numMoedasRegulares, int *numMoedasComemorativas, const char *nomeArquivo) {
    FILE *arquivoImportacao = fopen(nomeArquivo, "r");
    if (arquivoImportacao == NULL) {
        printf("Erro ao abrir o arquivo.\n");
        return;
    }
    
    
    double valor;
    int quantidade, anoEmissao;
    char descricaoMetal[20], evento[100]; 

    while (fscanf(arquivoImportacao, "Tipo: %s | Valor: %lf | Quantidade: %d | Ano de Emissao: %d | Nome do evento: %s\n", descricaoMetal, &valor, &quantidade, &anoEmissao, evento) >= 4) {
        int encontrado = 0;
        
    	if (evento[0] == '\0') {
	        // Verifica se a moeda já existe na coleção de moedas regulares do colecionador
	        for (int i = 0; i < *numMoedasRegulares; i++) {
	            if (moedasRegulares[i].valor == valor && moedasRegulares[i].anoEmissao == anoEmissao && strcmp(moedasRegulares[i].descricaoMetal, descricaoMetal) == 0) {
	                encontrado = 1;
	                moedasRegulares[i].quantidade += quantidade;
	                printf("Moeda Regular %.2f€ | Ano: %d importada com sucesso.\n", valor, anoEmissao);
	                break;
	            }
	        }
	
	        // Se a moeda não existir, pode adicionar à coleção de moedas regulares do colecionador
	        if (!encontrado) {
	            if (*numMoedasRegulares < MAX_MOEDAS_REGULARES) {
	                moedasRegulares[*numMoedasRegulares].valor = valor;
	                moedasRegulares[*numMoedasRegulares].quantidade = quantidade;
	                moedasRegulares[*numMoedasRegulares].anoEmissao = anoEmissao;
	                (*numMoedasRegulares)++;
	                printf("Moeda Regular %.2f€ | Ano: %d adicionada à coleção.\n", valor, anoEmissao);
	            } else {
	                printf("Limite máximo de moedas regulares atingido na coleção.\n");
	            }
	        }
        	
		} else {
			
	        // Verifica se a moeda já existe na coleção de moedas comemorativas do colecionador
	        encontrado = 0;
	        for (int i = 0; i < *numMoedasComemorativas; i++) {
	            if (moedasComemorativas[i].valor == valor && moedasComemorativas[i].anoEmissao == anoEmissao && strcmp(moedasComemorativas[i].descricaoMetal, descricaoMetal) == 0 && strcmp(moedasComemorativas[i].evento, evento) == 0) {
	                encontrado = 1;
	                moedasComemorativas[i].quantidade += quantidade;
	                printf("Moeda Comemorativa %.2f€ | Ano: %d | Evento: %s importada com sucesso.\n", valor, anoEmissao, evento);
	                break;
	            }
	        }
	
	        // Se a moeda não existir, pode adicionar à coleção de moedas comemorativas do colecionador
	        if (!encontrado) {
	            if (*numMoedasComemorativas < MAX_MOEDAS_COMEMORATIVAS) {
	                moedasComemorativas[*numMoedasComemorativas].valor = valor;
	                moedasComemorativas[*numMoedasComemorativas].quantidade = quantidade;
	                moedasComemorativas[*numMoedasComemorativas].anoEmissao = anoEmissao;
	                strcpy(moedasComemorativas[*numMoedasComemorativas].evento, evento);
	                (*numMoedasComemorativas)++;
	                printf("Moeda Comemorativa %.2f€ | Ano: %d adicionada à coleção.\n", valor, anoEmissao);
	            } else {
	                printf("Limite máximo de moedas comemorativas atingido na coleção.\n");
	            }
	        }
		}

    }

    fclose(arquivoImportacao);
    printf("Moedas importadas com sucesso do arquivo %s\n", nomeArquivo);
}



int main() {
	setlocale(LC_ALL, "Portuguese");
    Pais paises[10];
    int numPaises = 0;   
    Colecionador meuColecionador;
    printf("Nome do colecionador: ");
	scanf("%s", meuColecionador.nome);
	meuColecionador.numMoedasRegularesColecionadas = 0;
	meuColecionador.numMoedasComemorativasColecionadas = 0;
	
	FILE *arquivoExportacao = NULL;

int opcao;
int continuar = 1;
    MoedaRegular moedasRegulares[MAX_MOEDAS_REGULARES];
	MoedaComemorativa moedasComemorativas[MAX_MOEDAS_COMEMORATIVAS];
    int numMoedasRegulares = 0;
    int numMoedasComemorativas = 0;
    char nomeArquivo[50];

do {
	printf("\n===== MENU =====\n");
    printf("1. Adicionar país\n");
    printf("2. Adicionar moeda regular\n");
    printf("3. Adicionar moeda comemorativa\n");
    printf("4. Registar quantidade de moeda regular no colecionador\n");
    printf("5. Registar quantidade de moeda comemorativa no colecionador\n");
    printf("6. Listar moedas do colecionador\n");
    printf("7. Listar moedas em falta no colecionador\n");
    printf("8. Exportar moedas repetidas para arquivo\n");
    printf("9. Importar moedas repetidas de outro colecionador\n");
    printf("0. Sair\n");
    printf("Escolha a opção: ");
    scanf("%d", &opcao);

    switch (opcao) {
        case 1:
            adicionarPais(paises, &numPaises);
            break;
        case 2:
            adicionarMoedaRegular(meuColecionador.moedasRegularesColecionadas, &meuColecionador.numMoedasRegularesColecionadas, paises, numPaises);
            break;
        case 3:
            adicionarMoedaComemorativa(meuColecionador.moedasComemorativasColecionadas, &meuColecionador.numMoedasComemorativasColecionadas, paises, numPaises);
            break;
        case 4:
            registarQuantidadeMoedaRegularColecionador(&meuColecionador, meuColecionador.moedasRegularesColecionadas);
            break;
        case 5:
            registarQuantidadeMoedaComemorativaColecionador(&meuColecionador, meuColecionador.moedasComemorativasColecionadas);
            break;
        case 6:
            listarMoedasColecionador(&meuColecionador);
            break;
        case 7:
            listarMoedasEmFaltaColecionador(&meuColecionador, meuColecionador.moedasRegularesColecionadas, meuColecionador.moedasComemorativasColecionadas, meuColecionador.numMoedasRegularesColecionadas, meuColecionador.numMoedasComemorativasColecionadas);
            break;
        case 8:
            arquivoExportacao = fopen("moedas_repetidas.txt", "w");
            if (arquivoExportacao == NULL) {
                printf("Erro ao abrir o arquivo de exportação.\n");
                break;
            }
            exportarMoedasRepetidas(&meuColecionador, arquivoExportacao);
            fclose(arquivoExportacao);
            printf("Moedas repetidas exportadas para moedas_repetidas.txt\n");
            break;
       case 9:
    		printf("Digite o nome do arquivo a ser importado: ");
    		char nomeArquivoImportacao[50];
    		scanf("%s", nomeArquivoImportacao);
    		importarMoedasRepetidasDeOutroColecionador(&meuColecionador, moedasRegulares, moedasComemorativas, &numMoedasRegulares, &numMoedasComemorativas, nomeArquivoImportacao);
    		break;

        case 0:
            continuar = 0;
            break;
        default:
            printf("Opção inválida. Tente novamente.\n");
            break;
    }

} while (continuar);

return 0;

} 
