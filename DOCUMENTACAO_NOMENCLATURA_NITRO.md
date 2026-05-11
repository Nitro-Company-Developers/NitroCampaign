# Documentação de Nomenclatura — Nitro Company

> Sistema de padronização de nomes para **Campanhas** e **Anúncios** nas plataformas de tráfego pago.

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Regras Gerais](#regras-gerais)
3. [Nomenclatura de Campanhas](#nomenclatura-de-campanhas)
   - [Template por Rede](#template-por-rede)
   - [Campos e Descrições](#campos-das-campanhas)
   - [Lógica de Geração](#lógica-de-geração-de-campanhas)
   - [Validação de Campanhas](#validação-de-campanhas)
4. [Nomenclatura de Anúncios](#nomenclatura-de-anúncios)
   - [Template de Anúncios](#template-de-anúncios)
   - [Campos e Descrições](#campos-dos-anúncios)
   - [Lógica de Geração](#lógica-de-geração-de-anúncios)
   - [Validação de Anúncios](#validação-de-anúncios)
5. [Mapeamento de Siglas](#mapeamento-de-siglas)
6. [Sanitização e Tratamento de Dados](#sanitização-e-tratamento-de-dados)
7. [Exemplos Completos](#exemplos-completos)

---

## Visão Geral

O NitroCampaign é um gerador de nomenclatura padronizada para campanhas e anúncios de tráfego pago. O objetivo é garantir **consistência**, **rastreabilidade** e **filtragem confiável** nos sistemas de dados, eliminando erros manuais da equipe de tráfego.

Cada nome gerado segue um formato de **tokens entre colchetes** (`[TOKEN]`) concatenados sem espaço:

```
[TOKEN1][TOKEN2][TOKEN3]...[TOKENN]
```

---

## Regras Gerais

### Caracteres Proibidos

Os seguintes caracteres são **bloqueados** em qualquer campo de entrada:

| Caractere | Símbolo |
|-----------|---------|
| Pipe      | `\|`    |
| Ponto-e-vírgula | `;` |
| Dois-pontos | `:` |
| Barra     | `/`     |
| Contrabarra | `\`   |
| Colchetes | `[` `]` |
| Chaves    | `{` `}` |

**Regex utilizada:** `/[|;:\/\\[\]{}]/g`

### Tratamento Automático

- Todos os valores são convertidos para **UPPERCASE** automaticamente.
- **Espaços** e **hífens** são removidos automaticamente antes da geração do nome final (exceto no campo Estrutura, que preserva hífens).
- **Colchetes** são aplicados automaticamente ao redor de cada token.

---

## Nomenclatura de Campanhas

### Template por Rede

O template de campanha varia conforme a **rede de tráfego** selecionada. A diferença principal está no 3º token (BM vs Posicionamento):

#### Facebook

```
[GESTOR][FB][BM][CA][OFERTA][PAÍS][AD][ESTRUTURA][NOME DA CAMPANHA][DATA DO DIA 1]
```

**Exemplo:** `[RL][FB][DIDA][CA01][BP03][US][AD12][1-1-1][ASHE01][17/09/2024]`

#### Google

```
[GESTOR][GOOGLE][POSICIONAMENTO][CA][OFERTA][PAÍS][AD][ESTRUTURA][NOME DA CAMPANHA][DATA DO DIA 1]
```

**Exemplo:** `[ZO][GOOGLE][YT][NEXUS][BP03][US][AD12][1-1-1][ASHE01][17/09/2024]`

#### TikTok

```
[GESTOR][TTK][N/A][CA][OFERTA][PAÍS][AD][ESTRUTURA][NOME DA CAMPANHA][DATA DO DIA 1]
```

**Exemplo:** `[RL][TTK][N/A][CA01][BD04][USA][AD01][1-3-1][CAMP01][01/03/2026]`

> **Nota:** No TikTok, o posicionamento é sempre fixo como `N/A`.

---

### Campos das Campanhas

| # | Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|-------|------|-------------|-----------|---------|
| 1 | **Gestor** | Select (lista fixa) | Sim | Sigla do gestor responsável pela campanha | `ZO`, `RL`, `FS` |
| 2 | **Rede** | Select | Sim | Plataforma de tráfego | `Google`, `Facebook`, `TikTok` |
| 3a | **BM** (Facebook) | Texto livre | Sim (se Facebook) | Business Manager da conta de negócios | `DIDA` |
| 3b | **Posicionamento** (Google) | Select | Sim (se Google) | Tipo de posicionamento no Google | `YT`, `Display`, `Search` |
| 4 | **País** | Select | Sim | País de destino da campanha | `USA`, `BR` |
| 5 | **Estrutura** | Select | Sim | Estrutura da campanha (preserva hífens) | `1-1-1`, `1-3-1`, `1-5-1`, `1-1-4`, `1-1-5` |
| 6 | **Data do Dia 1** | Date | Sim | Data do primeiro dia da campanha | `17/09/2024` |
| 7 | **Oferta** | Texto (max 8 chars) | Sim | Código da oferta promocionada | `BD04`, `BP02`, `BP03` |
| 8 | **CA** | Texto (max 10 chars) | Sim | Conta de anúncio responsável | `CA01`, `NEXUS` |
| 9 | **Nome da Campanha** | Texto (max 30 chars) | Sim | Identificador da campanha | `ASHE01`, `CAMPAIGN02` |
| 10 | **AD** | Texto (max 20 chars) | Sim | Código do anúncio na campanha | `AD1`, `AD11`, `ADFB76` |

---

### Lógica de Geração de Campanhas

A montagem do nome segue esta lógica (pseudocódigo):

```
função gerarNomeCampanha(form):
    limparValor(valor) → remove espaços e hífens, converte para UPPERCASE
    limparPreservandoHifens(valor) → remove apenas espaços, converte para UPPERCASE
    
    token(valor) → "[" + limparValor(valor) + "]"
    tokenHifen(valor) → "[" + limparPreservandoHifens(valor) + "]"
    
    SE rede == "Facebook":
        redeToken = "FB"
        terceiroToken = token(BM)    ← Business Manager
        
    SE rede == "Google":
        redeToken = "GOOGLE"
        terceiroToken = token(posicionamento)    ← YT / Display / Search
        
    SE rede == "TikTok":
        redeToken = "TTK"
        terceiroToken = token("N/A")    ← fixo
    
    resultado = token(gestor) 
              + token(redeToken) 
              + terceiroToken 
              + token(CA) 
              + token(oferta) 
              + token(país) 
              + token(AD) 
              + tokenHifen(estrutura)    ← preserva hífens
              + token(nomeCampanha) 
              + token(formatarData(dataDia1))    ← dd/mm/yyyy
```

#### Formatação de Data

A data é inserida pelo usuário no formato ISO (`yyyy-mm-dd`) via input date e convertida para `dd/mm/yyyy`:

```
"2024-09-17" → "17/09/2024"
```

#### Mapeamento de Rede para Token

| Rede selecionada | Token gerado |
|------------------|--------------|
| Facebook         | `FB`         |
| Google           | `GOOGLE`     |
| TikTok           | `TTK`        |

---

### Validação de Campanhas

A campanha é considerada **válida** quando:

1. **Campos obrigatórios preenchidos** (variam por rede):
   - **Todas as redes:** Gestor, Rede, CA, Oferta, País, Nome da Campanha, Data do Dia 1, AD
   - **Facebook:** + BM (obrigatório)
   - **Google:** + Posicionamento (obrigatório)
   - **TikTok:** Sem campo adicional (posicionamento fixo N/A)

2. **Nenhum caractere proibido** presente nos campos combinados.

3. **Campo AD** preenchido com pelo menos 1 caractere (após trim).

---

## Nomenclatura de Anúncios

### Template de Anúncios

```
[NÚMERO SEQUENCIAL][COPY][REDE][OFERTA][AD][V][H][AVATAR.TIPO][EDITOR]
```

**Exemplo:** `[325][AN][FB][BP03][AD11][V1][H01][A02.S][MB]`

---

### Campos dos Anúncios

| # | Campo | Tipo | Obrigatório | Descrição | Exemplo |
|---|-------|------|-------------|-----------|---------|
| 1 | **Sequência** | Numérico (qualquer) | Sim | Número sequencial do anúncio | `1`, `325`, `100000.12345` |
| 2 | **Copy** | Select | Sim | Copywriter responsável | `MG`, `AN`, `AC`, `MC`, `XX` |
| 3 | **Rede de Tráfego** | Select | Sim | Plataforma do anúncio | `FB`, `Google`→`YT`, `TTK` |
| 4 | **Oferta** | Texto (max 12 chars) | Sim | Código da oferta | `BP02`, `BD04` |
| 5 | **AD** | Texto (max 20 chars) | Sim | Código do anúncio (alfanumérico) | `AD1`, `AD11`, `ADFB76` |
| 6 | **Variação** | Texto (max 10 chars) | Sim | Variação do anúncio | `V1`, `V2`, `V3` |
| 7 | **Hook** | Texto (max 10 chars) | Sim | Hook do anúncio | `H01`, `H02`, `H03` |
| 8 | **Avatar** | Texto (max 10 chars) | Sim | Avatar do anúncio | `A01`, `A02`, `A03` |
| 9 | **Tipo de Avatar** | Select | Sim | Famoso (F) ou Não Famoso (S) | `S`, `F` |
| 10 | **Editor** | Select | Não | Editor responsável (padrão: `XX`) | `AH`, `CB`, `LA`, `XX` |

---

### Lógica de Geração de Anúncios

```
função gerarNomeAnuncio(form):
    limparValor(valor) → remove espaços e hífens, converte para UPPERCASE
    token(valor) → "[" + limparValor(valor) + "]"
    
    sequenciaToken = token(String(sequencia))
    
    copyToken = SE copy == "NAO_INFORMADO" ENTÃO "XX" SENÃO copy
    
    redeDisplay = SE redeTrafego == "Google" ENTÃO "YT" SENÃO redeTrafego
    
    avatarCompleto = limparValor(avatar) + "." + tipoAvatar
    // Exemplo: "A02" + "." + "S" → "A02.S"
    
    editorValor = SE editor está vazio ENTÃO "XX" SENÃO limparValor(editor)
    
    resultado = token(sequencia)
              + token(copyToken)
              + token(redeDisplay)
              + token(oferta)
              + token(AD)
              + token(variação)
              + token(hook)
              + token(avatarCompleto)
              + token(editorValor)
```

#### Mapeamento de Rede (Anúncios)

| Rede selecionada | Token gerado |
|------------------|--------------|
| Facebook         | `FB`         |
| Google           | `YT`         |
| TikTok           | `TTK`        |

> **Diferença importante:** Nos anúncios, quando a rede é `Google`, o token exibido é `YT` (YouTube), diferente das campanhas onde aparece `GOOGLE`.

#### Composição do Avatar

O campo Avatar é composto por dois subcampos concatenados com ponto (`.`):

```
[AVATAR.TIPO_AVATAR]
```

| Tipo | Significado |
|------|-------------|
| `.S` | Avatar **Não Famoso** |
| `.F` | Avatar **Famoso** |

**Exemplo:** `[A02.S]` = Avatar A02, não famoso.

#### Valor Padrão do Editor

Se o editor **não for informado**, o sistema usa automaticamente `XX`:

```
Editor não selecionado → [XX]
Editor selecionado (ex: MB) → [MB]
```

#### Valor Padrão do Copy

Se o copy for marcado como "Não informado", o sistema usa `XX`:

```
Copy "Não informado" → [XX]
Copy selecionado (ex: AN) → [AN]
```

---

### Validação de Anúncios

O anúncio é considerado **válido** quando:

1. **Todos os campos obrigatórios preenchidos:** Sequência, Copy, Rede de Tráfego, Oferta, AD, Variação, Hook, Avatar.
2. **Sequência** é um número válido (`!isNaN(Number(sequencia))`).
3. **Campo AD** preenchido com pelo menos 1 caractere (após trim).
4. **Nenhum caractere proibido** nos campos combinados.

---

## Mapeamento de Siglas

### Gestores (Campanhas)

| Sigla | Nome Completo |
|-------|---------------|
| `ZO`  | Zoio |
| `RL`  | Rafael Lima |
| `FS`  | Fernando Bandeira |
| `LP`  | Lucas Petersen |
| `EP`  | Edvaldo Paletta |
| `RB`  | Rhuan Briolli |
| `AT`  | Adrian Trigueiro |
| `JC`  | Julio Cesar |

### Copywriters (Anúncios)

| Sigla | Nome Completo |
|-------|---------------|
| `MG`  | Matheus Ganguilhet |
| `AN`  | Antônio |
| `AC`  | André Victor |
| `MC`  | Maria Candida |
| `XX`  | Não informado |

### Editores (Anúncios)

| Sigla | Nome Completo |
|-------|---------------|
| `AH`  | Alexandre Husky |
| `CB`  | Cris Berriel |
| `LA`  | Lucas Andreli |
| `IC`  | Isabela Barreto |
| `DM`  | Douglas Marcelino |
| `MB`  | Matheus Boturi |
| `AM`  | Antonio Mike |
| `XX`  | Não informado |

### Redes de Tráfego

| Rede | Token (Campanhas) | Token (Anúncios) |
|------|-------------------|-------------------|
| Facebook | `FB` | `FB` |
| Google | `GOOGLE` | `YT` |
| TikTok | `TTK` | `TTK` |

### Posicionamentos (Google)

| Valor | Descrição |
|-------|-----------|
| `YT` | YouTube |
| `Display` | Google Display Network |
| `Search` | Google Search |

### Estruturas de Campanha

| Valor | Formato |
|-------|---------|
| `1-1-1` | 1 campanha, 1 conjunto, 1 anúncio |
| `1-3-1` | 1 campanha, 3 conjuntos, 1 anúncio |
| `1-5-1` | 1 campanha, 5 conjuntos, 1 anúncio |
| `1-1-4` | 1 campanha, 1 conjunto, 4 anúncios |
| `1-1-5` | 1 campanha, 1 conjunto, 5 anúncios |

### Países

| Sigla | País |
|-------|------|
| `USA` | Estados Unidos |
| `BR`  | Brasil |

---

## Sanitização e Tratamento de Dados

### Função `cleanValue` (padrão)

Remove espaços e hífens, converte para uppercase:

```javascript
cleanValue(valor) → String(valor).replace(/[\s-]/g, "").toUpperCase()
```

**Exemplo:** `"ca 01"` → `"CA01"`, `"ashe-01"` → `"ASHE01"`

### Função `cleanValueKeepHyphens` (para Estrutura)

Remove apenas espaços, preserva hífens, converte para uppercase:

```javascript
cleanValueKeepHyphens(valor) → String(valor).replace(/\s/g, "").toUpperCase()
```

**Exemplo:** `"1-1-1"` → `"1-1-1"` (mantém hífens)

### Função `enforceUpper` (input em tempo real)

Remove espaços e caracteres proibidos em tempo real enquanto o usuário digita:

```javascript
enforceUpper(campo) → remove espaços → remove caracteres proibidos → toUpperCase()
```

### Função `enforceUpperKeepSpaces` (para BM e CA)

Remove apenas caracteres proibidos, mantém espaços:

```javascript
enforceUpperKeepSpaces(campo) → remove proibidos → toUpperCase()
```

### Função `withToken` (encapsulamento)

Encapsula um valor limpo em colchetes. Retorna string vazia se o valor estiver vazio:

```javascript
withToken(valor):
    val = cleanValue(valor)
    SE val não vazio: retorna "[" + val + "]"
    SENÃO: retorna ""
```

---

## Exemplos Completos

### Campanha Facebook

| Campo | Valor |
|-------|-------|
| Gestor | RL |
| Rede | Facebook |
| BM | DIDA |
| CA | CA01 |
| Oferta | BP03 |
| País | US |
| AD | AD12 |
| Estrutura | 1-1-1 |
| Nome da Campanha | ASHE01 |
| Data do Dia 1 | 17/09/2024 |

**Resultado:** `[RL][FB][DIDA][CA01][BP03][US][AD12][1-1-1][ASHE01][17/09/2024]`

---

### Campanha Google

| Campo | Valor |
|-------|-------|
| Gestor | ZO |
| Rede | Google |
| Posicionamento | YT |
| CA | NEXUS |
| Oferta | BP03 |
| País | US |
| AD | AD12 |
| Estrutura | 1-1-1 |
| Nome da Campanha | ASHE01 |
| Data do Dia 1 | 17/09/2024 |

**Resultado:** `[ZO][GOOGLE][YT][NEXUS][BP03][US][AD12][1-1-1][ASHE01][17/09/2024]`

---

### Campanha TikTok

| Campo | Valor |
|-------|-------|
| Gestor | FS |
| Rede | TikTok |
| CA | CA01 |
| Oferta | BD04 |
| País | USA |
| AD | AD01 |
| Estrutura | 1-3-1 |
| Nome da Campanha | CAMP01 |
| Data do Dia 1 | 01/03/2026 |

**Resultado:** `[FS][TTK][N/A][CA01][BD04][USA][AD01][1-3-1][CAMP01][01/03/2026]`

---

### Anúncio (Exemplo Completo)

| Campo | Valor |
|-------|-------|
| Sequência | 325 |
| Copy | AN (Antônio) |
| Rede de Tráfego | FB (Facebook) |
| Oferta | BP03 |
| AD | AD11 |
| Variação | V1 |
| Hook | H01 |
| Avatar | A02 |
| Tipo de Avatar | S (Não Famoso) |
| Editor | MB (Matheus Boturi) |

**Resultado:** `[325][AN][FB][BP03][AD11][V1][H01][A02.S][MB]`

---

### Anúncio (Sem Editor e Copy)

| Campo | Valor |
|-------|-------|
| Sequência | 1000 |
| Copy | Não informado |
| Rede de Tráfego | Google |
| Oferta | BD04 |
| AD | ADFB76 |
| Variação | V2 |
| Hook | H03 |
| Avatar | A01 |
| Tipo de Avatar | F (Famoso) |
| Editor | Não informado |

**Resultado:** `[1000][XX][YT][BD04][ADFB76][V2][H03][A01.F][XX]`

---

### Diagrama de Posição dos Tokens

#### Campanhas (10 tokens)

```
Posição:  1        2       3            4     5       6      7     8          9              10
Token:  [GESTOR] [REDE]  [BM/POS]     [CA]  [OFERTA][PAÍS] [AD]  [ESTRUTURA][NOME_CAMPANHA][DATA]
                          ↑
                 Facebook → BM
                 Google   → Posicionamento
                 TikTok   → N/A (fixo)
```

#### Anúncios (9 tokens)

```
Posição:  1       2      3      4        5     6    7     8            9
Token:  [SEQ]   [COPY] [REDE] [OFERTA] [AD]  [V]  [H]  [AVATAR.TIPO][EDITOR]
```

---

### Parsing (Extração de Dados)

Para extrair os componentes de um nome já gerado, use regex para capturar os valores entre colchetes:

```python
import re
elementos = re.findall(r'\[([^\]]*)\]', nomenclatura)
```

- **9 elementos** → Anúncio
- **10 elementos** → Campanha

---

*Documentação gerada automaticamente a partir do código-fonte do NitroCampaign.*
