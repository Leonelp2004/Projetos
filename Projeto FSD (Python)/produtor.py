import socket
import threading
import json
import os
import time
import requests
from flask import Flask, jsonify, request
import logging


# Importações para criptografia
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography import x509

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Produtor:
    def __init__(self, ip='', porta_socket=5001, porta_rest=5002):
        self.app = Flask(__name__)
        self.produtos = self.carregar_stock() or self.criar_stock_inicial()
        self.ip = ip
        self.porta_socket = porta_socket
        self.porta_rest = porta_rest
        self.lock = threading.Lock()
        self.gestor_url = "http://193.136.11.170:5001"  # URL do Gestor
        self.heartbeat_interval = 300  # Intervalo de 5 minutos em segundos

        # Geração das chaves RSA
        self.private_key = None
        self.public_key = None
        self.certificate = None

        self.gerar_chaves()

        # Carregar o certificado do produtor se existir
        if os.path.exists('producer_cert.pem'):
            with open('producer_cert.pem', 'r') as f:
                self.certificate = f.read().strip()
        else:
            self.certificate = None

        # Solicitar o certificado ao Gestor
        #self.registar_produtor()
        self.registar_produtor_com_certificado()

        # Configurar as rotas da API REST
        self.configurar_rotas()

        # Criar stock inicial se não houver stock salvo
        if not self.produtos:
            self.produtos = self.criar_stock_inicial()
            self.salvar_stock()  # Guardar o stock inicial no ficheiro

        self.mostrar_stock_inicial()  # Exibir o stock inicial

        # Iniciar a thread para atualizar o stock automaticamente a cada 30 segundos
        threading.Thread(target=self.atualizar_stock, daemon=True).start()

        # Iniciar a thread para registar o Produtor no Gestor periodicamente
        threading.Thread(target=self.registar_periodicamente, daemon=True).start()

    # Geração das chaves RSA
    def gerar_chaves(self):
        # Verifica se as chaves já existem
        if os.path.exists('private_key.pem') and os.path.exists('public_key.pem'):
            with open('private_key.pem', 'rb') as f:
                self.private_key = serialization.load_pem_private_key(
                    f.read(),
                    password=None,
                )
            with open('public_key.pem', 'rb') as f:
                self.public_key = serialization.load_pem_public_key(f.read())
        else:
            # Gera novas chaves se não existirem
            self.private_key = rsa.generate_private_key(
                public_exponent=65537,
                key_size=2048,
            )
            self.public_key = self.private_key.public_key()

            # Salva as chaves em arquivos
            with open('private_key.pem', 'wb') as f:
                f.write(self.private_key.private_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PrivateFormat.PKCS8,
                    encryption_algorithm=serialization.NoEncryption()
                ))
            with open('public_key.pem', 'wb') as f:
                f.write(self.public_key.public_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PublicFormat.SubjectPublicKeyInfo
                ))

    # Função para validar o certificado
    def validar_certificado(self, certificado_pem):
        try:
            if not os.path.exists('manager_public_key.pem'):
                raise FileNotFoundError("Chave pública do gestor não encontrada.")

            # Carregar a chave pública do gestor
            with open('manager_public_key.pem', 'rb') as f:
                gestor_public_key = serialization.load_pem_public_key(f.read())

            certificado = x509.load_pem_x509_certificate(certificado_pem.encode('utf-8'))

            # Verificar a assinatura do certificado usando a chave pública do gestor
            gestor_public_key.verify(
                certificado.signature,
                certificado.tbs_certificate_bytes,
                padding.PKCS1v15(),
                certificado.signature_hash_algorithm,
            )

            logger.info("Certificado validado com sucesso.")
            return True
        except FileNotFoundError as e:
            logger.error(f"Erro ao validar o certificado: {e}")
            return False
        except Exception as e:
            logger.error(f"Erro ao validar o certificado: {e}")
            return False

    # Função para registar o Produtor no Gestor
    def registar_produtor(self):
        try:
            dados = {
                "ip": self.ip,
                "porta": self.porta_rest,
                "nome": "ProdutorTop",
            }
            logger.info(f"Registando Produtor {self.ip} com o seguinte stock: {self.produtos}")
            resposta = requests.post(f"{self.gestor_url}/produtor", json=dados)

            if resposta.status_code == 200:
                logger.info("Produtor atualizado com sucesso no Gestor.")
            elif resposta.status_code == 201:
                logger.warning(f"Produtor registado com sucesso.")
            else:
                logger.warning(f"Erro ao registar produtor")
        except requests.exceptions.RequestException as e:
            logger.error(f"Erro ao tentar registar o Produtor no Gestor: {e}")

    # Função para registar o Produtor no Gestor com Certificado
    def registar_produtor_com_certificado(self):
        try:
            pem_pub = self.public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            ).decode('utf-8')

            dados = {
                "ip": self.ip,
                "porta": self.porta_rest,
                "nome": "ProdutorTop Seguro",
                "pubKey": pem_pub
            }

            logger.info(f"Registando produtor com certificado: {dados}")
            resposta = requests.post(f"{self.gestor_url}/produtor_certificado", json=dados)

            # Adicionar log da resposta
            logger.info(f"Resposta do gestor: Status Code: {resposta.status_code}, Conteúdo: {resposta.text}")

            if resposta.status_code in [200, 201]:
                try:
                    self.certificate = resposta.text.strip()  # Certificado como string PEM
                    if "-----BEGIN CERTIFICATE-----" in self.certificate:
                        with open('producer_cert.pem', 'w') as f:
                            f.write(self.certificate)
                        logger.info("Certificado recebido e salvo com sucesso.")
                    else:
                        logger.error("Certificado com formato inesperado.")
                except Exception as e:
                    logger.error(f"Erro ao salvar o certificado: {e}")
                    self.certificate = None
            else:
                logger.error(f"Erro ao registar produtor: {resposta.status_code} - {resposta.text}")
                self.certificate = None
        except requests.exceptions.RequestException as e:
            logger.error(f"Erro na conexão ao registar produtor: {e}")
            self.certificate = None

    # Função para manter o registo atualizado
    def registar_periodicamente(self):
        while True:
            time.sleep(self.heartbeat_interval)
            #self.registar_produtor()
            self.registar_produtor_com_certificado()
            

    # Criação de stock inicial
    def criar_stock_inicial(self):
        return {
            "computador": {"categoria": "eletrônicos", "quantidade": 1015, "preco": 1000.0},
            "livro": {"categoria": "livros", "quantidade": 1069, "preco": 20.0},
            "melancia": {"categoria": "alimentos", "quantidade": 1105, "preco": 5.0},
            "rato": {"categoria": "eletrônicos", "quantidade": 1065, "preco": 30.0},
            "livro2": {"categoria": "livros", "quantidade": 1070, "preco": 40.0},
            "maçã": {"categoria": "alimentos", "quantidade": 1105, "preco": 8.0},
            "telemovel": {"categoria": "eletrônicos", "quantidade": 1065, "preco": 500.0},
            "livro3": {"categoria": "livros", "quantidade": 1070, "preco": 15.0},
            "pera": {"categoria": "alimentos", "quantidade": 1105, "preco": 2.0}
        }

    # Guardar o stock atual num ficheiro JSON
    def salvar_stock(self):
        with open('stock_produtor1.json', 'w', encoding='utf-8') as ficheiro:
            json.dump(self.produtos, ficheiro, indent=4, ensure_ascii=False)

    # Exibir o stock inicial
    def mostrar_stock_inicial(self):
        print("Stock inicial de produtos do Produtor 1:")
        for nome, detalhes in self.produtos.items():
            print(f"- {nome}: Categoria: {detalhes['categoria']}, "
                  f"Quantidade: {detalhes['quantidade']}, "
                  f"Preço: {detalhes['preco']}")

    # Carregar o stock salvo a partir de um ficheiro JSON
    def carregar_stock(self):
        if os.path.exists('stock_produtor1.json'):
            with open('stock_produtor1.json', 'r', encoding='utf-8') as ficheiro:
                return json.load(ficheiro)
        return None

    # Função para iniciar o servidor socket
    def iniciar_servidor_socket(self):
        servidor = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        servidor.bind(('', self.porta_socket))
        servidor.listen(5)
        print(f"Servidor do Produtor 1 (Socket) iniciado: {self.ip}:{self.porta_socket}")

        while True:
            cliente_socket, cliente_endereco = servidor.accept()
            print(f"Marketplace conectado: {cliente_endereco}")
            thread = threading.Thread(target=self.conexao_socket, args=(cliente_socket,))
            thread.start()

    # Lidar com a conexão de um cliente (marketplace) via socket
    def conexao_socket(self, cliente_socket):
        try:
            while True:
                mensagem = cliente_socket.recv(1024).decode()
                if not mensagem:
                    break
                print(f"Mensagem recebida do Marketplace: {mensagem}")
                resposta = self.processar_pedido(mensagem)  # Processar o pedido do cliente
                cliente_socket.send(resposta.encode())  # Enviar resposta
        except Exception as erro:
            print(f"Ocorreu um erro: {erro}")
        finally:
            cliente_socket.close()

    # Processar os pedidos de Marketplace (socket)
    def processar_pedido(self, mensagem):
        partes = mensagem.split()
        comando = partes[0].upper()

        if comando == "LISTAR":
            resultado = self.listar_produtos()
            print(f"Produtos foram listados")
            return resultado
        elif comando == "COMPRAR":
            if len(partes) == 3:
                nome_produto = partes[1]
                try:
                    quantidade = int(partes[2])
                    if nome_produto not in self.produtos:
                        return f"ERRO: O produto {nome_produto} não existe no stock."
                    if quantidade <= 0:
                        return "ERRO: Quantidade inválida."
                    if quantidade > self.produtos[nome_produto]["quantidade"]:
                        return f"ERRO: Quantidade de {quantidade} para {nome_produto} ultrapassa a quantidade disponível."
                    resultado = self.comprar_produto(nome_produto, quantidade)
                    print(f"O Marketplace comprou {quantidade} unidade(s) de {nome_produto}")
                    return resultado
                except ValueError:
                    return "ERRO: Quantidade inválida"
            else:
                return "ERRO: Formato do pedido inválido"
        elif comando == "ADICIONAR":
            if len(partes) == 5:
                nome_produto = partes[1]
                categoria = partes[2]
                try:
                    quantidade = int(partes[3])
                    preco = float(partes[4])
                    if quantidade < 0 or preco < 0:
                        return "ERRO: A quantidade e o preço devem ser maiores ou iguais a zero."
                    if nome_produto in self.produtos:
                        return f"ERRO: O produto '{nome_produto}' já existe no stock."
                    resultado = self.adicionar_produto(nome_produto, categoria, quantidade, preco)
                    print(f"O Marketplace adicionou o produto {nome_produto} com {quantidade} unidade(s) a {preco:.2f}")
                    return resultado
                except ValueError:
                    return "ERRO: Quantidade ou preço inválidos"
            else:
                return "ERRO: Formato do pedido ADICIONAR inválido"
        else:
            return "ERRO: Comando não reconhecido"

    # Listar produtos disponíveis
    def listar_produtos(self):
        produtos_encontrados = []
        with self.lock:
            for nome, detalhes in self.produtos.items():
                if detalhes["quantidade"] > 0:
                    produtos_encontrados.append(f"{nome}: {detalhes['categoria']}, "
                                                f"Quantidade: {detalhes['quantidade']}, "
                                                f"Preço: {detalhes['preco']}")
        return "\n".join(produtos_encontrados) if produtos_encontrados else "Nenhum produto disponível."

    # Comprar produto e atualizar stock
    def comprar_produto(self, nome_produto, quantidade):
        with self.lock:
            if nome_produto in self.produtos and self.produtos[nome_produto]["quantidade"] >= quantidade:
                self.produtos[nome_produto]["quantidade"] -= quantidade
                self.salvar_stock()  # Atualizar o stock no ficheiro
                return f"Compra realizada: {quantidade} {nome_produto}(s)."
            else:
                return "ERRO: Quantidade insuficiente no stock."

    # Adicionar novo produto ao stock
    def adicionar_produto(self, nome_produto, categoria, quantidade, preco):
        with self.lock:
            if nome_produto in self.produtos:
                return f"ERRO: O produto '{nome_produto}' já existe no stock."
            self.produtos[nome_produto] = {
                "categoria": categoria,
                "quantidade": quantidade,
                "preco": preco
            }
            self.salvar_stock()  # Guardar o novo produto no stock
            return f"Produto {nome_produto} adicionado com sucesso."

    # Atualizar stock a cada 30 segundos
    def atualizar_stock(self):
        while True:
            time.sleep(30)
            with self.lock:
                for produto in self.produtos.values():
                    produto["quantidade"] += 5  # Adicionar 5 unidades a cada produto
                self.salvar_stock()  # Guardar stock atualizado
            print("Stock atualizado: +5 unidades em cada produto.")

    # Início da API REST 
    def configurar_rotas(self):

        @self.app.route('/categorias', methods=['GET'])
        def listar_categorias():
            # Lista todas as categorias únicas dos produtos
            categorias = list(set(produto['categoria'] for produto in self.produtos.values()))
            return jsonify(categorias), 200

        @self.app.route('/produtos', methods=['GET'])
        def listar_produtos_por_categoria():
            # Obter os produtos de uma categoria
            categoria = request.args.get('categoria')
            if not categoria:
                return jsonify({"erro": "Categoria não especificada"}), 400

            # Filtrar produtos que pertencem à categoria fornecida
            produtos_filtrados = [
                {
                    "categoria": detalhes["categoria"],
                    "produto": nome,
                    "quantidade": detalhes["quantidade"],
                    "preco": detalhes["preco"]
                }
                for nome, detalhes in self.produtos.items()
                if detalhes["categoria"].lower() == categoria.lower()
            ]

            # Verificar se há produtos na categoria especificada
            if produtos_filtrados:
                return jsonify(produtos_filtrados), 200
            else:
                return jsonify({"erro": "1: Categoria Inexistente"}), 404

        @self.app.route('/comprar/<produto>/<int:quantidade>', methods=['GET'])
        def comprar_produto_endpoint(produto, quantidade):
            # Endpoint para comprar produtos com a quantidade especificada na URL
            if quantidade <= 0:
                return jsonify({"erro": "Quantidade inválida"}), 400

            if produto not in self.produtos:
                return jsonify({"erro": "Produto inexistente"}), 404

            if quantidade > self.produtos[produto]["quantidade"]:
                return jsonify({"erro": "Quantidade insuficiente"}), 404

            mensagem = self.comprar_produto(produto, quantidade)
            return jsonify({"mensagem": mensagem}), 200

        # Endpoints seguros
        @self.app.route('/secure/categorias', methods=['GET'])
        def listar_categorias_seguro():
            try:
                logger.info("Pedido recebido no endpoint /secure/categorias")
                categorias = list(set(produto['categoria'] for produto in self.produtos.values()))
                mensagem = categorias
                logger.info(f"Categorias encontradas: {mensagem}")

                if not self.certificate:
                    if os.path.exists('producer_cert.pem'):
                        with open('producer_cert.pem', 'r') as f:
                            self.certificate = f.read()
                    else:
                        logger.error("Certificado não encontrado.")
                        return jsonify({"erro": "Certificado não encontrado"}), 500

                assinatura = self.assinar_mensagem(mensagem)
                logger.info("Assinatura gerada com sucesso.")

                resposta = {
                    "assinatura": assinatura,
                    "certificado": self.certificate,
                    "mensagem": mensagem
                }
                return jsonify(resposta), 200
            except Exception as e:
                logger.error(f"Erro no endpoint /secure/categorias: {e}")
                return jsonify({"erro": "Erro interno no servidor"}), 500

        @self.app.route('/secure/produtos', methods=['GET'])
        def listar_produtos_por_categoria_seguro():
            try:
                categoria = request.args.get('categoria')
                logger.info(f"Pedido de categoria recebido: {categoria}")

                if not self.certificate:
                    if os.path.exists('producer_cert.pem'):
                        with open('producer_cert.pem', 'r') as f:
                            self.certificate = f.read()
                    else:
                        logger.error("Certificado não encontrado.")
                        return jsonify({"erro": "Certificado não encontrado"}), 500

                produtos_filtrados = [
                    {
                        "categoria": detalhes["categoria"],
                        "produto": nome,
                        "quantidade": detalhes["quantidade"],
                        "preco": detalhes["preco"]
                    }
                    for nome, detalhes in self.produtos.items()
                    if detalhes["categoria"].lower() == categoria.lower()
                ]
                logger.info(f"Produtos filtrados: {produtos_filtrados}")

                if produtos_filtrados:
                    assinatura = self.assinar_mensagem(produtos_filtrados)
                    resposta = {
                        "assinatura": assinatura,
                        "certificado": self.certificate,
                        "mensagem": produtos_filtrados
                    }
                    return jsonify(resposta), 200
                else:
                    mensagem = "Categoria inexistente"
                    assinatura = self.assinar_mensagem(mensagem)
                    resposta = {
                        "assinatura": assinatura,
                        "certificado": self.certificate,
                        "mensagem": mensagem
                    }
                    return jsonify(resposta), 404
            except Exception as e:
                logger.error(f"Erro no endpoint /secure/produtos: {e}", exc_info=True)
                return jsonify({"erro": "Erro interno no servidor"}), 500

        @self.app.route('/secure/comprar/<produto>/<int:quantidade>', methods=['POST'])
        def comprar_produto_seguro(produto, quantidade):
            if not self.certificate:
                if os.path.exists('producer_cert.pem'):
                    with open('producer_cert.pem', 'r') as f:
                        self.certificate = f.read()
                else:
                    logger.error("Certificado não encontrado.")
                    return jsonify({"erro": "Certificado não encontrado"}), 500

            if quantidade <= 0:
                mensagem = "Pedido Inválido"
                assinatura = self.assinar_mensagem(mensagem)
                resposta = {
                    "assinatura": assinatura,
                    "certificado": self.certificate,
                    "mensagem": mensagem
                }
                return jsonify(resposta), 400

            if produto not in self.produtos:
                mensagem = "Produto inexistente"
                assinatura = self.assinar_mensagem(mensagem)
                resposta = {
                    "assinatura": assinatura,
                    "certificado": self.certificate,
                    "mensagem": mensagem
                }
                return jsonify(resposta), 404

            if quantidade > self.produtos[produto]["quantidade"]:
                mensagem = "Quantidade indisponível"
                assinatura = self.assinar_mensagem(mensagem)
                resposta = {
                    "assinatura": assinatura,
                    "certificado": self.certificate,
                    "mensagem": mensagem
                }
                return jsonify(resposta), 404

            # Processar a compra
            mensagem_compra = self.comprar_produto(produto, quantidade)
            assinatura = self.assinar_mensagem(mensagem_compra)
            resposta = {
                "assinatura": assinatura,
                "certificado": self.certificate,
                "mensagem": mensagem_compra
            }
            return jsonify(resposta), 200

        @self.app.route('/produtor', methods=['GET'])
        def obter_produtor():
            # Retornar informações sobre o produtor
            dados = {
                "ip": self.ip,
                "porta": self.porta_rest,
                "nome": "ProdutorTop",
                "certificado": self.certificate
            }
            return jsonify(dados), 200

        @self.app.route('/produtor_certificado', methods=['POST'])
        def registar_produtor_route():
            # Permitir que outros serviços registem o produtor via endpoint
            dados_recebidos = request.get_json()
            return jsonify({"mensagem": "Produtor registado via endpoint."}), 200

    # Método para assinar mensagens
    def assinar_mensagem(self, mensagem):
        try:
            # Serializar a mensagem para bytes
            if isinstance(mensagem, (dict, list)):
                mensagem_bytes = json.dumps(mensagem, sort_keys=True).encode('utf-8')
            elif isinstance(mensagem, str):
                mensagem_bytes = mensagem.encode('utf-8')
            else:
                raise TypeError("Tipo de mensagem não suportado para assinatura.")

            # Assinar a mensagem com a chave privada usando PSS e SHA256
            assinatura = self.private_key.sign(
                mensagem_bytes,
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )

            # Codificar a assinatura usando cp437
            assinatura_str = assinatura.decode('cp437')
            return assinatura_str
        except Exception as e:
            logger.error(f"Erro ao assinar mensagem: {e}", exc_info=True)
            raise

    # Iniciar a API REST
    def iniciar_api_rest(self):
        self.app.run(host=self.ip, port=self.porta_rest)

if __name__ == '__main__':
    ip = '10.8.0.27'
    produtor = Produtor(ip=ip)

    # Iniciar o servidor socket numa thread separada
    threading.Thread(target=produtor.iniciar_servidor_socket, daemon=True).start()

    # Iniciar a API REST na thread principal
    produtor.iniciar_api_rest()

