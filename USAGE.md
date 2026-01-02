# 🚀 CGP - Controle de Gastos Pessoais

## Guia de Uso Rápido

### Abrir o Aplicativo

1. Abra `index.html` no navegador (Chrome, Firefox, Safari, Edge)
2. Nenhuma instalação, nenhuma conexão de internet necessária
3. Dados são salvos automaticamente no seu computador (localStorage)

### Navegação

- **Dashboard** - Visualize gastos, rendas e reserve-lazer do mês
- **Gastos** - Cadastre gastos fixos, variáveis e parcelados
- **Rendas** - Registre salários e rendas extras
- **Alocações** - Defina poupança e limite de lazer

### Usar o Dashboard

1. Use os botões "← Anterior" e "Próximo →" para navegar entre meses
2. Ou selecione um mês diretamente no campo de entrada
3. Veja os 3 indicadores principais:
   - **Total de Gastos**: com comparativo do mês anterior
   - **Poupança**: valor alocado e comparativo
   - **Reserva-Lazer**: saldo e status (Disponível/Negativa)
4. Clique em ✏️ para editar um lançamento ou 🗑️ para deletar

### Cadastrar um Gasto

1. Vá para **Gastos**
2. Preencha:
   - **Data**: quando o gasto ocorreu
   - **Tipo**: 
     - Fixo: assinaturas, contas recorrentes
     - Variável: compras do dia a dia (escolha forma: débito, dinheiro, pix)
     - Crédito à Vista: compra no cartão (pagamento único)
     - Crédito Parcelado: compra parcelada (define número de parcelas)
   - **Descrição**: o que foi gasto
   - **Valor**: em reais
   - **Categoria**: opcional
   - **Lazer**: marque se é gasto de lazer (reduz reserva-lazer)
3. Clique em **Registrar Gasto**

**Dica Parcelamentos**: Se você compra algo em 3x no crédito, cada parcela é lançada automaticamente nos 3 meses seguintes!

### Cadastrar uma Renda

1. Vá para **Rendas**
2. Preencha:
   - **Data**: quando recebeu
   - **Tipo**: Mensal (salário) ou Extra (freelance, bônus)
   - **Descrição**: fonte da renda
   - **Valor**: em reais
3. Clique em **Registrar Renda**

### Configurar Alocações

1. Vá para **Alocações**
2. Selecione o mês a configurar (ou deixe no atual)
3. Defina:
   - **Poupança**: quanto você quer economizar este mês
   - **Reserva-Lazer**: limite de gastos com diversão
4. Clique em **Salvar Alocações**

O app mostra em tempo real quanto da sua reserva-lazer já foi gasto!

### Editar um Lançamento

1. Na **Tabela** (Dashboard, Gastos, Rendas), clique no ✏️ ao lado do lançamento
2. Edite os campos que desejar
3. Clique em **✓ Salvar**

**Nota**: Se for uma parcela de um parcelamento, apenas essa parcela é modificada

### Deletar um Lançamento

1. Na **Tabela**, clique no 🗑️ ao lado do lançamento
2. Confirme a exclusão
3. Pronto! O lançamento é removido

### Filtrar Lançamentos

Nas páginas de **Gastos** e **Rendas**, use os filtros:
- **Mês**: ver gastos/rendas de um período específico
- **Tipo/Categoria**: filtrar por tipo de gasto ou renda

## 💾 Dados e Segurança

- **Offline**: funciona 100% sem internet
- **Persistência**: tudo é salvo no navegador (localStorage)
- **Privacidade**: seus dados não saem do seu computador
- **Sincronização**: abra de qualquer aba/janela - usa o mesmo localStorage
- **Backup**: se limpar o cache do navegador, perderá os dados
  - Dica: Exporte seus dados regularmente (função em desenvolvimento)

## 🎯 Funcionalidades

✅ Gastos fixos e variáveis
✅ Compras parceladas (auto-expansão por mês)
✅ Formas de pagamento: débito, dinheiro, pix
✅ Rendas mensais e extras
✅ Poupança com comparativo mensal
✅ Reserva-lazer com status dinâmico
✅ Edição/exclusão de lançamentos
✅ Filtros e busca
✅ Dashboard intuitivo
✅ 100% offline
✅ 100% responsivo (funciona no celular)

## 📊 Dashboard Detalhado

### Indicadores Principais

**Total de Gastos**
- Soma de TODOS os gastos do mês (fixos, variáveis, crédito)
- Compara com mês anterior (% de aumento/redução)
- Cor verde: redução | Cor vermelha: aumento

**Poupança**
- Valor que você alocou para economizar
- Compara com mês anterior
- Apenas para referência (não afeta cálculos finais)

**Reserva-Lazer**
- Limite mensal para gastos de lazer
- Mostra: Reserva / Já Gasto
- Status: 
  - **Disponível**: ainda tem saldo
  - **Negativa**: ultrapassou o limite

### Como Funciona Reserva-Lazer

1. Você defina R$ 200 de limite em Alocações
2. Registra um almoço (R$ 50) e marca como "Lazer"
3. Reserva diminui: R$ 200 - R$ 50 = R$ 150 (Disponível)
4. Continua gastando com lazer até exaurir
5. Se gastar R$ 250 em lazer, fica -R$ 50 (Negativa)

## ⚡ Dicas Importantes

### Para Parcelamentos

```
Compra: R$ 600 em 3x
Você registra: Crédito Parcelado, 3 parcelas, R$ 600 total
Resultado:
  - Janeiro: R$ 200
  - Fevereiro: R$ 200
  - Março: R$ 200
```

### Para Diferentes Formas de Pagamento

- **Débito**: sai da conta no mesmo dia
- **Dinheiro**: você controla
- **PIX**: instantâneo
- **Crédito**: paga depois (na fatura)

### Diferença: Gastos vs Rendas

- **Gastos**: reduzem seu saldo (aparecem no total)
- **Rendas**: informacional (não afetam poupança/reserva-lazer)
- Use rendas para saber quanto você tem disponível

## 🐛 Troubleshooting

**Dados desapareceram**
→ Você limpou o cache? localStorage foi apagado. Crie novamente.

**Editar não funciona**
→ Recarregue a página (F5)

**Parcelamentos não aparecem**
→ Vá ao Dashboard e mude de mês. Elas estarão lá.

**Modal não fecha**
→ Clique fora do modal ou no botão "Cancelar"

## 📱 Compatibilidade

✅ Chrome, Firefox, Safari, Edge
✅ Desktop, Tablet, Celular
✅ Sem plugins ou extensões
✅ Sem banco de dados
✅ Sem internet obrigatória

---

**Desenvolvido com:** HTML5, CSS3, JavaScript ES6+
**Abordagem:** Frontend-only, localStorage, modular, offline-first
