# Ponytail — Referência de Minimalismo

> Essência extraída e adaptada de [ponytail](https://github.com/DietrichGebert/ponytail) por Dietrich Gebert.
> O ponytail faz o agente pensar como o dev sênior mais preguiçoso da sala.
> O melhor código é o código que você nunca escreveu.

---

## A Escada

Antes de escrever qualquer código, pare no primeiro degrau que funciona:

| # | Degrau | Pergunta | Ação |
|---|--------|----------|------|
| 1 | **YAGNI** | Isso precisa existir? | Se for especulativo, pule. Diga em uma linha. |
| 2 | **Stdlib** | A biblioteca padrão já faz isso? | Use. `functools.lru_cache`, `datetime`, `re`. |
| 3 | **Nativo** | A plataforma já cobre? | `<input type="date">` em vez de flatpickr. CSS em vez de JS. |
| 4 | **Dependência existente** | Algo já instalado resolve? | Use o que está lá. Nunca adicione dependência nova por poucas linhas. |
| 5 | **Uma linha** | Dá pra ser uma linha? | Faça. `"@" in email` em vez de classe EmailValidator. |
| 6 | **Mínimo** | Só então: o mínimo que funciona | Escreva. Mas o mínimo absoluto. Sem scaffolds. |

A escada é reflexo, não pesquisa. Dois degraus funcionam → pegue o mais alto e siga em frente.

---

## Regras

- **Nada de abstração não solicitada:** Sem interface com 1 implementação, sem factory com 1 produto, sem config para valor que nunca muda
- **Nada de boilerplate "pro futuro":** O futuro que faça seu próprio scaffold
- **Deleção > Adição:** Apagar código é sempre melhor que adicionar
- **Entediante > Esperto:** Código esperto é o que alguém decifra às 3am com o sistema caído
- **Menos arquivos possível:** O menor diff funcional vence
- **Questione requests complexos:** "Você realmente precisa de X, ou Y já cobre?"
- **Duas opções stdlib do mesmo tamanho?** Pegue a que lida melhor com edge cases. Preguiçoso significa menos código, não algoritmo mais frágil
- **Marque simplificações:** Use comentário `ponytail:` no código. Se o atalho tem um teto conhecido (lock global, scan O(n²), heurística ingênua), nomeie o teto e o caminho de upgrade

---

## O Que NUNCA Simplificar

Estas coisas são inegociáveis — o ponytail nunca sugere removê-las:

- **Validação em fronteiras de confiança:** Input do usuário, dados externos, APIs de terceiros
- **Tratamento de erro que evita perda de dados:** Transações, rollbacks, backups
- **Segurança:** Autenticação, autorização, criptografia, sanitização
- **Acessibilidade:** aria-labels, navegação por teclado, contraste
- **Calibração de hardware:** O mundo real não é ideal. Um clock real deriva, um sensor real lê errado. Deixe o knob de calibração
- **O que foi pedido explicitamente:** Se o usuário pediu X, X é feito. Sem re-argumentar

---

## Exemplos

### Email Validation

```python
# ❌ Over-engineered: 27 linhas, classe, regex, wrapper
# ✅ Ponteiro:
# ponytail: good enough, real validation is sending the mail
"@" in email and "." in email.split("@")[-1]
```

### Caching

```python
# ❌ Over-engineered: 120 linhas, classe TTLCache, thread-safe, stats
# ✅ Ponteiro:
# ponytail: stdlib covers this
from functools import lru_cache

@lru_cache(maxsize=1000)
def fetch(key): ...
```

### Date Picker

```html
<!-- ❌ Over-engineered: instala flatpickr, wrapper component, stylesheet -->
<!-- ✅ Ponteiro: -->
<!-- ponytail: browser has one -->
<input type="date">
```

### API Endpoint

```python
# ❌ Over-engineered: repository pattern, service layer, DTO, factory
# ✅ Ponteiro:
# ponytail: framework covers this
@app.get("/items/{id}")
def get_item(id: int):
    return db.query(Item).filter(Item.id == id).first()
```

### Sorting

```python
# ❌ Over-engineered: implementa quicksort manualmente
# ✅ Ponteiro:
# ponytail: stdlib covers this
items.sort(key=lambda x: x.name)
```

---

## Como o Orquestrador Usa

O Orquestrador do Timovi ativa esta referência como **gate automático** em dois momentos do Pipeline:

### Gate 1 — Pós-Breakdown (Fase 3)

Após o Tech Lead decompor a Feature em Issues, o Orquestrador aplica a Escada em cada Issue:

1. **Essa Issue precisa existir?** → Se for especulativa ou redundante, marca como `cancelled`
2. **Dá pra resolver com stdlib/nativo?** → Simplifica o escopo da Issue
3. **Dá pra juntar com outra Issue?** → Propõe merge
4. **Dá pra ser uma linha?** → Reduz o escopo

**Regras do gate:**
- Issues canceladas ficam com status `cancelled` no `feature.json`
- Issues simplificadas recebem anotação `ponytail:` no título ou `notes`
- **Nunca cancela** Issues que implementam requisitos explícitos do usuário (PRD User Stories)
- Mínimo de 1 Issue permanece ativa
- Ações registradas em `ponytail_actions` no `feature.json`

### Gate 2 — Durante Execute (Fase 4)

Após cada Round de implementação, o Orquestrador revisa o código gerado:

1. **Tem código duplicado?** → Sinaliza para consolidar
2. **Tem abstração não solicitada?** → Sugere remover (interface com 1 impl, factory com 1 produto)
3. **Dependência nova desnecessária?** → Alerta
4. **Arquivos em excesso?** → Sugere consolidar (1 arquivo fazendo trabalho de 3)

**Regras do gate:**
- Sinaliza, **não bloqueia** a execução
- Ações registradas em `ponytail_actions` no `feature.json`
- Se o gate falhar (erro de parsing), pipeline continua com warning

### Schema do `ponytail_actions`

```json
{
  "ponytail_actions": [
    {
      "timestamp": "2026-06-15T18:00:00Z",
      "phase": "breakdown",
      "action": "cancelled",
      "issue_id": "ISSUE-4",
      "reason": "coberto por ISSUE-2 com stdlib",
      "severity": "info"
    },
    {
      "timestamp": "2026-06-15T18:30:00Z",
      "phase": "execute",
      "action": "simplified",
      "issue_id": "ISSUE-3",
      "file": "src/utils/cache.ts",
      "reason": "functools.lru_cache substitui classe customizada de cache",
      "lines_saved": 120
    }
  ]
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `timestamp` | string | ISO 8601 |
| `phase` | string | `"breakdown"` ou `"execute"` |
| `action` | string | `"cancelled"`, `"simplified"`, `"merged"`, `"duplication_flagged"`, `"abstraction_flagged"`, `"dependency_flagged"` |
| `issue_id` | string | ID da Issue afetada |
| `reason` | string | Justificativa da ação |
| `severity` | string | `"info"`, `"warning"` |
| `file` | string\|null | Arquivo afetado (só no gate de Execute) |
| `lines_saved` | number\|null | Linhas economizadas (quando aplicável) |
