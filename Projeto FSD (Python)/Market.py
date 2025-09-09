import socket
import time
import threading
import requests  
import json
import os
import logging


# Importações para criptografia
from cryptography import x509
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding

class Marketplace:
    def __init__(self):
        self.subscricoes = []  # Lista de subscrições de produtores TCP
        self.produtores_rest = []  # Lista de subscrições de produtores REST
        self.clientes = []
        self.taxa_revenda = 0.1  # Taxa de revenda aplicada sobre o preço do produto
        self.running = True  # Para controlar o loop de execução
        self.gestor_url = "http://193.136.11.170:5001"
        self.produtores_rest_lock = threading.Lock()
        
        # Configurar o logger como atributo da classe
        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        self.logger = logging.getLogger(__name__)  

        # Carregar a chave pública do Gestor
        try:
            with open('manager_public_key.pem', 'rb') as f:
                pem_data = f.read()
                try:
                    # Tenta carregar como chave pública
                    self.gestor_public_key = serialization.load_pem_public_key(pem_data)
                    self.logger.info("Chave pública do gestor carregada com sucesso.")
                except ValueError:
                    # Se falhar tenta carregar como certificado
                    cert = x509.load_pem_x509_certificate(pem_data)
                    self.gestor_public_key = cert.public_key()
                    self.logger.info("Certificado do gestor carregado e chave pública extraída com sucesso.")
        except Exception as e:
            self.logger.error(f"Erro ao carregar a chave pública do gestor: {e}", exc_info=True)
            self.gestor_public_key = None

    # Função para obter a lista de produtores REST ativos a partir do gestor
    def obter_produtores_rest(self):
        try:
            url = f"{self.gestor_url}/produtor"
            resposta = requests.get(url)
            if resposta.status_code == 200:
                produtores_ativos = resposta.json()
                with self.produtores_rest_lock:
                    self.produtores_rest = [
                        {"ip": produtor["ip"], "porta": produtor["porta"], "nome": produtor["nome"]}
                        for produtor in produtores_ativos
                    ]
                print("Lista de produtores REST atualizada com sucesso.")
            else:
                print(f"Erro ao obter lista de produtores do Gestor: {resposta.status_code}")
        except requests.RequestException as e:
            print(f"Erro de conexão com o Gestor: {e}")

    # Função para chamar obter_produtores_rest periodicamente
    def atualizar_lista_produtores_rest(self):
        while self.running:
            self.obter_produtores_rest()
            time.sleep(300)  # Atualizar a cada 5 minutos (300 segundos)

    # Adicionar um produtor TCP (conectado por sockets)
    def adicionar_produtor(self, ip, porta):
        subscricao = {"ip": ip, "porta": porta}
        self.subscricoes.append(subscricao)

    # Adicionar um produtor REST
    def adicionar_produtor_rest(self, ip, porta):
        produtor_rest = {"ip": ip, "porta": porta}
        self.produtores_rest.append(produtor_rest)

    # Conectar aos produtores via TCP (Sockets)
    def conectar_aos_produtores(self):
        for subscricao in self.subscricoes:
            ip = subscricao["ip"]
            porta = subscricao["porta"]
            try:
                cliente_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                cliente_socket.connect((ip, porta))
                print(f"Conectado ao Produtor TCP {ip}:{porta}")
                self.clientes.append({
                    "socket": cliente_socket,
                    "ip": ip,
                    "porta": porta,
                })
            except Exception as erro:
                print(f"Erro ao conectar ao Produtor {ip}:{porta}: {erro}")

    # Função para contactar produtores TCP periodicamente
    def contatar_produtores_periodicamente(self):
        while self.running:
            for cliente in self.clientes:
                try:
                    mensagem = "LISTAR"
                    cliente["socket"].send(mensagem.encode())
                    resposta = cliente["socket"].recv(4096).decode()
                    print(f"Produtos do Produtor TCP {cliente['ip']}:{cliente['porta']} recebidos com sucesso.")
                except Exception as erro:
                    print(f"Erro ao contatar o Produtor TCP {cliente['ip']}:{cliente['porta']}: {erro}")
            time.sleep(100)  # Tempo de espera entre cada contacto (100 segundos)

    # Função para contactar produtores REST periodicamente para obter dados atualizados
    def contatar_produtores_rest_periodicamente(self):
        while self.running:
            for produtor in self.produtores_rest:
                ip = produtor["ip"]
                porta = produtor["porta"]
                try:
                    url = f"http://{ip}:{porta}/produtos"  # Endpoint genérico para os produtos
                    resposta = requests.get(url)  # Fazer a requisição HTTP para outros dados do Produtor
                    if resposta.status_code == 200:
                        produtos = resposta.json()
                finally:
                    continue

            time.sleep(100)  # Tempo de espera entre cada contacto (100 segundos)

    # Função para verificar periodicamente se os Produtores REST ainda estão ativos
    def verificar_produtores_rest_ativos(self):
        while self.running:
            with self.produtores_rest_lock:
                produtores = list(self.produtores_rest)  
            for produtor in produtores:
                ip = produtor["ip"]
                porta = produtor["porta"]

                try:
                    url = f"http://{ip}:{porta}"
                    resposta = requests.get(url, timeout=5)

                    if resposta.status_code == 200:
                        produtor["last_seen"] = time.time()
                except requests.RequestException:
                    with self.produtores_rest_lock:
                        if produtor in self.produtores_rest:
                            self.produtores_rest.remove(produtor)

            time.sleep(100)

    # Exibir o menu para o utilizador
    def exibir_menu(self):
        while True:
            print("\nEscolha uma opção:")
            print("1. Listar produtos de um produtor específico")
            print("2. Comprar produto")
            print("3. Adicionar produto ao stock")
            print("4. Obter produtores")
            print("5. Listar categorias de um produtor")
            print("6. Sair")

            opcao = input("Digite o número da opção desejada: ")

            if opcao == "1":
                self.listar_produtos()
            elif opcao == "2":
                self.comprar_produto()
            elif opcao == "3":
                self.adicionar_produto()
            elif opcao == "4":
                self.obter_produtores_rest()
                print("\nLista de produtores REST atualizada:")
                for produtor in self.produtores_rest:
                    print(f"Nome: {produtor['nome']}, IP: {produtor['ip']}, Porta: {produtor['porta']}")
            elif opcao == "5":
                self.listar_categorias_produtor_rest()
            elif opcao == "6":
                print("A sair do Marketplace.")
                break
            else:
                print("Opção inválida, tente novamente.")

    # Função para listar categorias dos produtores REST
    def listar_categorias_produtor_rest(self):
        print("Produtores disponíveis:")
        for i, produtor in enumerate(self.produtores_rest):
            print(f"{i + 1}. Produtor REST {produtor['ip']}:{produtor['porta']}")

        try:
            escolha = int(input("Escolha o número do produtor para listar suas categorias: "))
            if escolha < 1 or escolha > len(self.produtores_rest):
                print("Escolha inválida.")
                return

            produtor = self.produtores_rest[escolha - 1]
            url = f"http://{produtor['ip']}:{produtor['porta']}/secure/categorias"
            resposta = requests.get(url)

            if resposta.status_code == 200:
                resposta_json = resposta.json()
                if self.verificar_mensagem(resposta_json):
                    categorias = resposta_json['mensagem']
                    print(f"Categorias do Produtor {produtor['ip']}:{produtor['porta']}: {categorias}")
                else:
                    print("Falha na verificação da mensagem.")
            else:
                print(f"Erro ao obter categorias do Produtor {produtor['ip']}:{produtor['porta']}: Status Code {resposta.status_code}")

        except ValueError:
            print("Entrada inválida. Por favor, insira um número.")
        except requests.RequestException as erro:
            print(f"Erro ao contactar o Produtor REST {produtor['ip']}:{produtor['porta']}: {erro}")

    # Função para verificar a assinatura e o certificado
    def verificar_mensagem(self, resposta_json):
        try:
            # Decodificar a assinatura de cp437
            assinatura = resposta_json['assinatura'].encode('cp437')
            certificado_pem = resposta_json['certificado']
            mensagem = resposta_json['mensagem']

            # Carregar o certificado do produtor
            certificado = x509.load_pem_x509_certificate(certificado_pem.encode('utf-8'))

            # Verificar o certificado através da chave pública do Gestor
            self.gestor_public_key.verify(
                certificado.signature,
                certificado.tbs_certificate_bytes,
                padding.PKCS1v15(),
                hashes.SHA256(), 
            )

            self.logger.info("Certificado validado com sucesso.")

            # Extrair a chave pública do Produtor
            public_key_produtor = certificado.public_key()

            # Preparar a mensagem para verificação
            if isinstance(mensagem, (dict, list)):
                mensagem_bytes = json.dumps(mensagem, sort_keys=True).encode('utf-8')
            elif isinstance(mensagem, str):
                mensagem_bytes = mensagem.encode('utf-8')
            else:
                self.logger.error("Tipo de mensagem não suportado.")
                return False

            # Verificar a assinatura da mensagem com o PSS
            public_key_produtor.verify(
                assinatura,
                mensagem_bytes,
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            self.logger.info("Mensagem verificada com sucesso.")
            return True
        except Exception as e:
            self.logger.error(f"Erro ao verificar mensagem: {e}", exc_info=True)
            return False



    # Função para listar produtos de um produtor (compatível com Socket e REST)
    def listar_produtos(self):
        if not self.clientes and not self.produtores_rest:
            print("Não há produtores conectados.")
            return

        print("\nEscolha o tipo de produtor para listar os produtos:")
        print("1. Produtor TCP (Socket)")
        print("2. Produtor REST")

        tipo_produtor = input("Digite 1 para TCP ou 2 para REST: ").strip()

        if tipo_produtor == "1":
            self.listar_produtos_tcp()
        elif tipo_produtor == "2":
            self.listar_produtos_rest()
        else:
            print("Opção inválida.")

    # Listar produtos de um produtor TCP (Socket)
    def listar_produtos_tcp(self):
        if not self.clientes:
            print("Produtores inexistentes.")
            return

        print("\nEscolha o produtor para listar os produtos:")
        for numero_produtor, cliente in enumerate(self.clientes):
            print(f"{numero_produtor + 1}. Produtor {cliente['ip']}:{cliente['porta']}")

        try:
            opcao = int(input("Digite o número do produtor: ").strip())
            if 1 <= opcao <= len(self.clientes):
                cliente = self.clientes[opcao - 1]
                mensagem = "LISTAR"
                cliente["socket"].send(mensagem.encode())
                resposta = cliente["socket"].recv(4096).decode()

                produtos = resposta.split("\n")

                print("\nLista completa de produtos disponíveis:")
                for produto in produtos:
                    print(produto)

                categorias_escolhidas = input("\nIndique as categorias desejadas (separadas por vírgula): ").strip().split(",")

                produtos_filtrados = []

                for produto in produtos:
                    partes = produto.split(",")
                    if len(partes) >= 3:
                        nome_produto = partes[0].split(":")[0].strip()
                        categoria = partes[0].split(":")[-1].strip()
                        if categoria in [cat.strip() for cat in categorias_escolhidas]:
                            quantidade = partes[1].split(":")[-1].strip()
                            preco_produto = float(partes[2].split(":")[-1].strip())
                            preco_com_taxa = preco_produto * (1 + self.taxa_revenda)
                            produto_lista = f"Nome: {nome_produto}, Categoria: {categoria}, Quantidade: {quantidade}, Preço (com taxa): {preco_com_taxa:.2f}"
                            produtos_filtrados.append(produto_lista)

                if produtos_filtrados:
                    print(f"\nProdutos do Produtor {cliente['ip']}:{cliente['porta']}:\n" + "\n".join(produtos_filtrados))
                else:
                    print(f"\nNenhum produto disponível nas categorias especificadas do Produtor {cliente['ip']}:{cliente['porta']}.")
            else:
                print("Opção inválida.")
        except ValueError:
            print("Entrada inválida. Indique um número.")

    # Listar produtos de um produtor REST
    def listar_produtos_rest(self):
        if not self.produtores_rest:
            print("Não há produtores REST conectados.")
            return

        print("\nEscolha o produtor REST para listar os produtos:")
        for idx, produtor in enumerate(self.produtores_rest):
            print(f"{idx + 1}. Produtor em {produtor['ip']}:{produtor['porta']}")

        try:
            opcao = int(input("Digite o número do produtor: ").strip())
            if 1 <= opcao <= len(self.produtores_rest):
                produtor = self.produtores_rest[opcao - 1]
                categoriaInput = input("Digite a categoria dos produtos: ").strip()
                url = f"http://{produtor['ip']}:{produtor['porta']}/secure/produtos?categoria={categoriaInput}"
                
                try:
                    resposta = requests.get(url)
                    if resposta.status_code == 200:
                        resposta_json = resposta.json()
                        if self.verificar_mensagem(resposta_json):
                            produtos = resposta_json['mensagem']
                            produtos_filtrados = [p for p in produtos if p['quantidade'] > 0]

                            print(f"\nProdutos do Produtor REST {produtor['ip']}:{produtor['porta']}:\n{produtos_filtrados}")
                        else:
                            print("Falha na verificação da mensagem.")
                    elif resposta.status_code == 404:
                        resposta_json = resposta.json()
                        if self.verificar_mensagem(resposta_json):
                            print(f"Erro: {resposta_json['mensagem']}")
                        else:
                            print("Falha na verificação da mensagem.")
                    else:
                        print(f"Erro ao obter produtos do Produtor REST {produtor['ip']}:{produtor['porta']}: {resposta.status_code}")

                except requests.exceptions.RequestException:
                    print(f"Não foi possível conectar ao Produtor REST {produtor['ip']}:{produtor['porta']}. Voltando ao menu.")

            else:
                print("Opção inválida.")
        except ValueError:
            print("Entrada inválida. Por favor, digite um número.")


    # Comprar produto de um produtor (Compatível com TCP e REST)
    def comprar_produto(self):
        print("Escolha o tipo de produtor para comprar o produto:")
        print("1. Produtor TCP (Socket)")
        print("2. Produtor REST")

        tipo_produtor = input("Digite 1 para TCP ou 2 para REST: ").strip()

        if tipo_produtor == "1":
            self.comprar_produto_tcp()
        elif tipo_produtor == "2":
            self.comprar_produto_rest()
        else:
            print("Opção inválida.")

    def comprar_produto_tcp(self):
        if not self.clientes:
            print("Não há produtores TCP conectados.")
            return

        print("\nEscolha o produtor TCP para comprar o produto:")
        for idx, cliente in enumerate(self.clientes):
            print(f"{idx + 1}. Produtor em {cliente['ip']}:{cliente['porta']}")

        try:
            opcao = int(input("Indique o número do produtor: ").strip())
            if 1 <= opcao <= len(self.clientes):
                cliente = self.clientes[opcao - 1]
                nome_produto = input("Indique o nome do produto que deseja comprar: ").strip()
                quantidade = input("Indique a quantidade que deseja comprar: ").strip()
                mensagem = f"COMPRAR {nome_produto} {quantidade}"

                cliente["socket"].send(mensagem.encode())
                resposta = cliente["socket"].recv(1024).decode()

                print(f"\nResposta do Produtor {cliente['ip']}:{cliente['porta']}:\n{resposta}")
            else:
                print("Opção inválida.")
        except ValueError:
            print("Entrada inválida. Por favor, indique um número.")

    def comprar_produto_rest(self):
        if not self.produtores_rest:
            print("Não há produtores REST conectados.")
            return

        while True:
            print("\nEscolha o produtor REST para comprar o produto:")
            for idx, produtor in enumerate(self.produtores_rest):
                print(f"{idx + 1}. Produtor em {produtor['ip']}:{produtor['porta']}")

            try:
                opcao = int(input("Digite o número do produtor: ").strip())
                if 1 <= opcao <= len(self.produtores_rest):
                    produtor = self.produtores_rest[opcao - 1]
                    produto_nome = input("Digite o nome do produto que deseja comprar: ").strip()
                    quantidade = int(input("Digite a quantidade que deseja comprar: ").strip())

                    url = f"http://{produtor['ip']}:{produtor['porta']}/secure/comprar/{produto_nome}/{quantidade}"

                    try:
                        resposta = requests.post(url)
                        if resposta.status_code == 200:
                            resposta_json = resposta.json()
                            if self.verificar_mensagem(resposta_json):
                                print(resposta_json['mensagem'])
                            else:
                                print("Falha na verificação da mensagem.")
                        else:
                            resposta_json = resposta.json()
                            if self.verificar_mensagem(resposta_json):
                                print(f"Erro: {resposta_json['mensagem']}")
                            else:
                                print("Falha na verificação da mensagem.")
                        break
                    except requests.exceptions.RequestException as e:
                        print(f"Não foi possível conectar ao Produtor REST {produtor['ip']}:{produtor['porta']}.")
                        break
                else:
                    print("Opção inválida.")
            except ValueError:
                print("Entrada inválida. Por favor, digite um número.")

    # Adicionar um novo produto a um determinado produtor
    def adicionar_produto(self):
        if not self.clientes:
            print("Nenhum produtor conectado.")
            return

        print("\nEscolha o produtor para adicionar o produto:")
        for numero_produtor, cliente in enumerate(self.clientes):
            print(f"{numero_produtor + 1}. Produtor {cliente['ip']}:{cliente['porta']}")

        try:
            opcao = int(input("Indique o número do produtor: ").strip())
            if 1 <= opcao <= len(self.clientes):
                cliente = self.clientes[opcao - 1]
                nome = input("Indique o nome do novo produto: ").strip()
                categoria = input("Indique a categoria do novo produto: ").strip()
                try:
                    quantidade = int(input("Indique a quantidade do novo produto: ").strip())
                    preco = float(input("Indique o preço do novo produto: ").strip())

                    mensagem = f"ADICIONAR {nome} {categoria} {quantidade} {preco}"
                    cliente["socket"].send(mensagem.encode())
                    resposta = cliente["socket"].recv(1024).decode()
                    print(f"\nResposta do Produtor {cliente['ip']}:{cliente['porta']}:\n{resposta}")

                except ValueError:
                    print("\nERRO: Quantidade e/ou preço inválidos.")
            else:
                print("Opção inválida.")
        except ValueError:
            print("Entrada inválida. Por favor, escreva um número.")

    # Desconectar de todos os produtores
    def desconectar(self):
        self.running = False  
        for cliente in self.clientes:
            cliente["socket"].close()
        print("Desconectado de todos os Produtores TCP.")

if __name__ == "__main__":
    marketplace = Marketplace()

    # Atualizar a lista de produtores REST no início
    marketplace.obter_produtores_rest()

    # Adicionar produtores (tanto TCP quanto REST)
    marketplace.adicionar_produtor("10.8.0.50", 5001)  # Produtor TCP

    marketplace.conectar_aos_produtores()  # Conectar aos produtores TCP

    # Iniciar a thread para contatar produtores TCP periodicamente
    threading.Thread(target=marketplace.contatar_produtores_periodicamente, daemon=True).start()

    # Iniciar a thread para contatar produtores REST periodicamente
    #threading.Thread(target=marketplace.contatar_produtores_rest_periodicamente, daemon=True).start()

    # Iniciar a thread para verificar se os produtores REST estão ativos
    #threading.Thread(target=marketplace.verificar_produtores_rest_ativos, daemon=True).start()

    # Iniciar a thread para atualização dos Produtores REST
    threading.Thread(target=marketplace.atualizar_lista_produtores_rest, daemon=True).start()  

    marketplace.exibir_menu()  # Iniciar o menu 
    marketplace.desconectar()  # Desconectar ao sair
