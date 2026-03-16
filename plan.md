preciso que você desenvolva um gerador/gerenciador de nomenclatura para padronizar os nomes das campanhas em todas as redes de tráfego (Google/YouTube, Facebook e Taboola). A ideia é que o usuário selecione/preencha campos específicos e o sistema gere automaticamente a nomenclatura correta, seguindo as regras e templates definidos. Isso vai garantir padronização, consistência e filtragem confiável no sistema de rastreamento, além de reduzir erros manuais da equipe de tráfego.
O gerador deve:
Ter campos flexíveis (preferência por texto/inputs livres, mas com validação).
Concatenar os valores no formato correto de cada rede.
Exibir uma pré-visualização do nome final da campanha.
Permitir manutenção futura (novos gestores, ofertas, redes, dispositivos).
Bloquear caracteres proibidos (| ; : / \ [ ] { }).
Templates por Rede
Google / YouTube
Separador: -
 Template: [SiglaGestor] - [Rede] - [Posicionamento] - [Oferta] - [NomeDaConta] - [Presell] - [VersaoVSL]
 Exemplo: LP - Google - YT - BD04 - MOLHO - PS01 - VSL01.ML01.L01
Campos:
SiglaGestor (texto curto)
Rede (enum: Google / YouTube)
Posicionamento (enum: YT, GS, DS, PMAX)
Oferta (código: BD04, BP02, PZ01 etc.)
NomeDaConta (texto livre)
Presell (código: PS01, PREL03)
Versão VSL (subcampos: VSL##, ML##, L## → output VSL01.ML01.L01)
Checklist de Desenvolvimento
 Criar estrutura para seleção de rede → aplicar template correspondente.
 Implementar os campos obrigatórios e opcionais listados acima.
 Garantir concatenamento no formato correto (separadores por rede).
 Incluir validações (UPPERCASE para códigos, bloqueio de caracteres proibidos).
 Criar pré-visualização dinâmica do nome gerado.
 Incluir toggle para exibir tokens com [ ] ou sem colchetes.
 Documentar o funcionamento e criar um manual simples de uso.
 Teste