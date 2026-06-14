import { useState } from 'react'

interface Secao {
  icon: string
  titulo: string
  conteudo: JSX.Element
}

function Tag({ children }: { children: string }) {
  return (
    <span className="bg-[#1e2535] text-slate-300 text-[10px] font-mono px-1.5 py-0.5 rounded">{children}</span>
  )
}

function Info({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 text-[11px] text-blue-300 mb-3">
      {children}
    </div>
  )
}

function Tabela({ colunas, linhas }: { colunas: string[]; linhas: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#1e2535] mb-3">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-[#1e2535]">
            {colunas.map((c) => (
              <th key={c} className="text-left text-[9px] text-slate-500 uppercase tracking-wider px-3 py-2">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha, i) => (
            <tr key={i} className="border-b border-[#1a2030] last:border-b-0">
              {linha.map((cel, j) => (
                <td key={j} className="px-3 py-2 text-slate-300">{cel}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const secoes: Secao[] = [
  {
    icon: '🚀',
    titulo: 'Primeiros Passos',
    conteudo: (
      <div className="space-y-3 text-[12px] text-slate-300">
        <Info>O Controle de Gastos salva tudo automaticamente no seu navegador. Nenhum cadastro ou servidor necessário.</Info>
        <p>Para começar, siga esta ordem:</p>
        <ol className="list-decimal list-inside space-y-2 text-slate-300">
          <li>Selecione o <strong className="text-slate-100">mês e ano</strong> desejado nos botões <Tag>‹</Tag> e <Tag>›</Tag> na barra superior</li>
          <li>Clique em <strong className="text-green-400">+ Lançamento</strong> para adicionar receitas, despesas ou investimentos</li>
          <li>Para compras parceladas, acesse <strong className="text-slate-100">🔄 Parcelamentos</strong> no menu</li>
          <li>Se você já tem um arquivo CSV com parcelamentos, use <strong className="text-slate-100">📥 Importar CSV</strong></li>
          <li>Acompanhe o resumo completo no <strong className="text-slate-100">📊 Dashboard</strong></li>
        </ol>
      </div>
    ),
  },
  {
    icon: '📊',
    titulo: 'Dashboard',
    conteudo: (
      <div className="space-y-3 text-[12px] text-slate-300">
        <p>A tela inicial apresenta um resumo visual do mês selecionado.</p>
        <Tabela
          colunas={['Card', 'O que mostra', 'Cor']}
          linhas={[
            ['Receitas', 'Soma de todas as entradas do mês', 'Verde'],
            ['Despesas', 'Despesas + parcelamentos fora do cartão', 'Vermelho'],
            ['Investimentos', 'Total investido + % da receita', 'Azul'],
            ['Saldo', 'Receitas − Despesas − Investimentos', 'Verde ou Vermelho'],
          ]}
        />
        <p><strong className="text-slate-100">Gráfico de barras</strong> — Evolução de Receitas vs Despesas nos 12 meses do ano.</p>
        <p><strong className="text-slate-100">Gráfico de rosca</strong> — Distribuição das despesas por categoria no mês.</p>
        <p><strong className="text-slate-100">Tabela de parcelamentos</strong> — Lista os parcelamentos ativos no mês, com o valor de cada parcela, forma de pagamento e número da parcela atual.</p>
        <Info>Passe o mouse sobre os gráficos para ver os valores exatos em tooltip.</Info>
      </div>
    ),
  },
  {
    icon: '💸',
    titulo: 'Despesas e Receitas',
    conteudo: (
      <div className="space-y-3 text-[12px] text-slate-300">
        <p>Ambas as telas funcionam da mesma forma. Para adicionar um lançamento:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Clique em <strong className="text-red-400">+ Nova Despesa</strong> ou <strong className="text-green-400">+ Nova Receita</strong></li>
          <li>Preencha a descrição e o valor</li>
          <li>Selecione a categoria e forma de pagamento</li>
          <li>Clique em <strong className="text-slate-100">Salvar</strong></li>
        </ol>
        <Tabela
          colunas={['Categorias de Despesa']}
          linhas={[
            ['Moradia'], ['Alimentação'], ['Transporte'], ['Saúde'],
            ['Educação'], ['Lazer'], ['Roupas'], ['Streaming'], ['Academia'], ['Internet'], ['Outros'],
          ]}
        />
        <Tabela
          colunas={['Categorias de Receita']}
          linhas={[['Salário'], ['Freelance'], ['Investimentos'], ['Aluguel recebido'], ['Outros']]}
        />
        <p>Para <strong className="text-slate-100">editar ou excluir</strong>, passe o mouse sobre a linha na tabela — os botões ✏️ e 🗑️ aparecem.</p>
      </div>
    ),
  },
  {
    icon: '📈',
    titulo: 'Investimentos',
    conteudo: (
      <div className="space-y-3 text-[12px] text-slate-300">
        <p>Registre seus aportes mensais em investimentos:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Clique em <strong className="text-blue-400">+ Novo Investimento</strong></li>
          <li>Descreva o investimento (ex: <em>"CDB Nubank 120% CDI"</em>)</li>
          <li>Informe o valor e escolha a categoria</li>
        </ol>
        <Tabela
          colunas={['Categorias']}
          linhas={[['Renda Fixa'], ['Ações'], ['FIIs'], ['Criptomoedas'], ['Poupança'], ['Outros']]}
        />
        <Info>O total investido no mês é descontado automaticamente do Saldo no Dashboard.</Info>
      </div>
    ),
  },
  {
    icon: '🔄',
    titulo: 'Parcelamentos',
    conteudo: (
      <div className="space-y-3 text-[12px] text-slate-300">
        <p>Gerencie compras parceladas. O app calcula e distribui as parcelas automaticamente nos meses corretos.</p>
        <p><strong className="text-slate-100">Como cadastrar:</strong></p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Clique em <strong className="text-green-400">+ Novo parcelamento</strong></li>
          <li>Informe a descrição e o <strong>valor total</strong> da compra</li>
          <li>Informe o <strong>número de parcelas</strong> — o valor por parcela é calculado automaticamente</li>
          <li>Selecione o <strong>mês e ano da 1ª parcela</strong></li>
          <li>Escolha a forma de pagamento</li>
        </ol>
        <Info>Exemplo: Compra de R$ 1.200,00 em 12x → cada parcela vale R$ 100,00, distribuída de Janeiro a Dezembro.</Info>
        <p><strong className="text-slate-100">Pills de meses</strong> — Os 12 quadradinhos (J F M A M J J A S O N D) mostram em quais meses o parcelamento está ativo. O mês atual fica destacado com borda verde.</p>
        <p><strong className="text-slate-100">Filtros:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Todos</strong> — Exibe todos os parcelamentos</li>
          <li><strong>Ativos neste mês</strong> — Apenas os que têm parcelas no mês atual</li>
          <li><strong>Cartão</strong> — Santander e Nubank</li>
          <li><strong>Pix / Boleto</strong> — Pagamentos fora do cartão</li>
        </ul>
        <p><strong className="text-slate-100">Cartão vs Fora do Cartão:</strong></p>
        <p>Parcelamentos em Santander/Nubank são marcados como "Cartão" (já constam na fatura). Pix, Boleto e Dinheiro são "Fora do cartão" e são somados às Despesas no saldo.</p>
      </div>
    ),
  },
  {
    icon: '📋',
    titulo: 'Relatórios',
    conteudo: (
      <div className="space-y-3 text-[12px] text-slate-300">
        <p>A tela de Relatórios exibe uma tabela consolidada com todos os dados do ano.</p>
        <Tabela
          colunas={['Linha', 'O que representa', 'Cor']}
          linhas={[
            ['Receitas', 'Total de entradas por mês', 'Verde'],
            ['Despesas', 'Total de saídas + parcelamentos fora cartão', 'Vermelho'],
            ['↳ Cartão (parcelas)', 'Sub-total de parcelamentos em cartão', 'Azul'],
            ['↳ Fora cartão', 'Sub-total de parcelamentos em Pix/Boleto', 'Amarelo'],
            ['Investimentos', 'Total investido por mês', 'Azul'],
            ['Saldo', 'Resultado final do mês', 'Verde ou Vermelho'],
          ]}
        />
        <p>A última coluna mostra o <strong className="text-slate-100">total acumulado do ano</strong> para cada linha.</p>
        <Info>Role horizontalmente para ver todos os meses em telas menores.</Info>
      </div>
    ),
  },
  {
    icon: '📥',
    titulo: 'Importar CSV',
    conteudo: (
      <div className="space-y-3 text-[12px] text-slate-300">
        <p>Importe seus parcelamentos de um arquivo CSV existente (como a planilha <em>"Controle de gastos - Parcelamentos.csv"</em>).</p>
        <p><strong className="text-slate-100">Como importar:</strong></p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Clique em <strong className="text-slate-100">📥 Importar CSV</strong> no menu lateral</li>
          <li>Informe o ano dos parcelamentos</li>
          <li>Clique na área tracejada e selecione o arquivo <Tag>.csv</Tag></li>
          <li>Uma mensagem de confirmação indicará quantos parcelamentos foram importados</li>
        </ol>
        <Info>⚠️ A importação substitui todos os parcelamentos existentes. Faça isso apenas uma vez ou quando quiser atualizar tudo.</Info>
        <p><strong className="text-slate-100">Formato esperado do CSV:</strong></p>
        <p>O arquivo deve ter as colunas nesta ordem:</p>
        <Tabela
          colunas={['Coluna', 'Exemplo']}
          linhas={[
            ['Descrição', 'HBO Max'],
            ['Valor Total (R$)', '"358,80"'],
            ['Nº Parcelas', '12'],
            ['1ª Parcela (mês)', '1'],
            ['Valor/Parcela', '(calculado)'],
            ['Forma de Pagamento', 'Santander'],
            ['Janeiro … Dezembro', '29,90'],
          ]}
        />
      </div>
    ),
  },
  {
    icon: '💾',
    titulo: 'Dados e Backup',
    conteudo: (
      <div className="space-y-3 text-[12px] text-slate-300">
        <p>Todos os dados são salvos automaticamente no <strong className="text-slate-100">armazenamento local do navegador</strong> (localStorage). Isso significa:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>✅ Seus dados ficam no seu dispositivo, sem servidor</li>
          <li>✅ Salvamento automático a cada ação</li>
          <li>✅ Os dados persistem ao fechar e reabrir o navegador</li>
          <li>⚠️ Limpar os dados do navegador apaga os dados do app</li>
          <li>⚠️ Os dados não sincronizam entre dispositivos diferentes</li>
        </ul>
        <Info>Para não perder seus dados, evite limpar o histórico/cache do navegador neste site. Em caso de troca de dispositivo, será necessário redigitar os lançamentos.</Info>
      </div>
    ),
  },
  {
    icon: '📱',
    titulo: 'Uso no Celular',
    conteudo: (
      <div className="space-y-3 text-[12px] text-slate-300">
        <p>O app é totalmente responsivo e funciona no celular com algumas adaptações:</p>
        <Tabela
          colunas={['Elemento', 'Desktop', 'Mobile']}
          linhas={[
            ['Navegação', 'Menu lateral à esquerda', 'Barra de ícones na parte inferior'],
            ['KPI cards', '4 colunas', '2 colunas'],
            ['Gráficos', 'Lado a lado', 'Empilhados'],
            ['Tabelas', 'Largura total', 'Scroll horizontal'],
          ]}
        />
        <p>A barra inferior no celular contém os 5 itens principais: Dashboard, Despesas, Receitas, Investimentos e Parcelamentos.</p>
        <Info>O botão <strong>+ Lançamento</strong> na barra superior está sempre disponível em qualquer tela.</Info>
      </div>
    ),
  },
]

export default function Ajuda() {
  const [aberta, setAberta] = useState<number | null>(0)

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-5">
      {/* Cabeçalho */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">💡</span>
          <h1 className="text-base font-bold text-slate-100">Manual de Utilização</h1>
        </div>
        <p className="text-[11px] text-slate-500">Clique em uma seção para expandir e ver as instruções.</p>
      </div>

      {/* Accordion */}
      <div className="space-y-2">
        {secoes.map((secao, i) => {
          const estaAberta = aberta === i
          return (
            <div
              key={i}
              className="bg-[#161b27] border border-[#1e2535] rounded-xl overflow-hidden"
            >
              {/* Cabeçalho da seção */}
              <button
                onClick={() => setAberta(estaAberta ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#1a2030] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{secao.icon}</span>
                  <span className={`text-[13px] font-semibold ${estaAberta ? 'text-blue-400' : 'text-slate-200'}`}>
                    {secao.titulo}
                  </span>
                </div>
                <span className={`text-slate-500 text-sm transition-transform ${estaAberta ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>

              {/* Conteúdo */}
              {estaAberta && (
                <div className="px-4 pb-4 pt-1 border-t border-[#1e2535]">
                  {secao.conteudo}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Rodapé */}
      <div className="mt-6 text-center text-[10px] text-slate-600">
        Controle de Gastos — desenvolvido com 💚
      </div>
    </div>
  )
}
