import { Lancamento } from '../types'

const CATEGORIAS_KEYWORDS: Array<{ categoria: string; keywords: string[] }> = [
  {
    categoria: 'Alimentação',
    keywords: [
      'ifood', 'rappi', 'uber eats', 'mcdonalds', 'mc donalds', 'burger king',
      'subway', 'pizza', 'pizzaria', 'lanchonete', 'padaria', 'panificadora',
      'restaurante', 'sushi', 'churrascaria', 'supermercado', 'mercado', 'mercearia',
      'hortifruti', 'extra', 'carrefour', 'pao de acucar', 'assai', 'atacadao',
      'atacado', 'hipermercado', 'minimercado', 'acougue', 'peixaria', 'rotisserie',
      'cafe', 'cafeteria', 'starbucks', 'bob\'s', 'habib', 'outback', 'coxinha',
      'pastelaria', 'sorvete', 'acai', 'tapioca',
    ],
  },
  {
    categoria: 'Transporte',
    keywords: [
      'uber', '99pop', '99 pop', 'cabify', 'taxi', 'táxi', 'onibus', 'ônibus',
      'metro', 'metrô', 'bilhete unico', 'bilhete único', 'combustivel', 'combustível',
      'gasolina', 'etanol', 'posto', 'shell', 'petrobras', 'ipiranga', 'br distribuidora',
      'estacionamento', 'parking', 'pedagio', 'pedágio', 'autoestrada', 'autopista',
      'transfer', 'buser', 'flixbus', 'latam', 'gol', 'azul', 'tam',
    ],
  },
  {
    categoria: 'Saúde',
    keywords: [
      'farmacia', 'farmácia', 'drogaria', 'droga', 'ultrafarma', 'panvel', 'raia',
      'drogasil', 'nissei', 'medico', 'médico', 'clinica', 'clínica', 'hospital',
      'laboratorio', 'laboratório', 'exame', 'consulta', 'dentista', 'odonto',
      'psicolog', 'nutricion', 'fisioterapia', 'plano de saude', 'unimed', 'amil',
      'bradesco saude', 'sulamerica saude', 'hapvida', 'notre dame', 'optometria',
      'otica', 'ótica', 'vacina', 'cvs',
    ],
  },
  {
    categoria: 'Educação',
    keywords: [
      'escola', 'colegio', 'colégio', 'faculdade', 'universidade', 'udemy', 'alura',
      'coursera', 'hotmart', 'eduzz', 'kiwify', 'descomplica', 'estacio', 'anhanguera',
      'kroton', 'pearson', 'livro', 'livraria', 'amazon livro', 'saraiva', 'cultura',
      'papelaria', 'material escolar', 'curso', 'aula', 'mentoria', 'coaching',
      'idioma', 'ingles', 'inglês', 'wizard', 'ccaa', 'fisk',
    ],
  },
  {
    categoria: 'Streaming',
    keywords: [
      'netflix', 'spotify', 'amazon prime', 'prime video', 'disney', 'hbo', 'max',
      'apple tv', 'paramount', 'globoplay', 'telecine', 'mubi', 'crunchyroll',
      'deezer', 'youtube premium', 'twitch', 'apple music', 'tidal',
    ],
  },
  {
    categoria: 'Internet',
    keywords: [
      'claro', 'vivo', 'tim', 'oi ', 'net ', 'internet', 'fibra', 'banda larga',
      'celular', 'telefone', 'recarga', 'plano movel', 'plano móvel', 'sky', 'directv',
      'starlink',
    ],
  },
  {
    categoria: 'Academia',
    keywords: [
      'academia', 'smartfit', 'smart fit', 'bodytech', 'bluefit', 'crossfit',
      'natacao', 'natação', 'pilates', 'yoga', 'spinning', 'personal', 'gym',
      'fitness', 'musculacao', 'musculação',
    ],
  },
  {
    categoria: 'Lazer',
    keywords: [
      'cinema', 'teatro', 'show', 'ingresso', 'tickets', 'ticketmaster', 'eventim',
      'sympla', 'blue man', 'parque', 'zoologico', 'zoológico', 'museu', 'exposicao',
      'bar ', 'balada', 'boliche', 'karting', 'escape room', 'xbox', 'playstation',
      'steam', 'nintendo', 'google play', 'apple store', 'app store', 'jogo',
      'viagem', 'hotel', 'airbnb', 'booking', 'hostel', 'pousada',
    ],
  },
  {
    categoria: 'Roupas',
    keywords: [
      'renner', 'riachuelo', 'c&a', 'marisa', 'zara', 'hm ', 'h&m', 'forever 21',
      'shein', 'amaro', 'shoulder', 'farm ', 'arezzo', 'schutz', 'havaianas',
      'nike', 'adidas', 'puma', 'mizuno', 'centauro', 'decathlon', 'netshoes',
      'dafiti', 'roupa', 'vestuario', 'vestuário', 'calcado', 'calçado', 'tenis', 'tênis',
    ],
  },
  {
    categoria: 'Moradia',
    keywords: [
      'aluguel', 'condominio', 'condomínio', 'iptu', 'energia', 'luz ', 'enel',
      'cemig', 'copel', 'cosern', 'celpe', 'agua ', 'água ', 'sabesp', 'sanepar',
      'gas ', 'gás ', 'comgas', 'copagaz', 'ultragaz', 'seguro residencial',
      'leroy merlin', 'madeirense', 'telhanorte', 'c&c', 'casa e construcao',
      'tok stok', 'mobly', 'americanas casa',
    ],
  },
]

function detectarCategoria(descricao: string): string {
  const lower = descricao.toLowerCase()
  for (const { categoria, keywords } of CATEGORIAS_KEYWORDS) {
    if (keywords.some((kw) => lower.includes(kw))) return categoria
  }
  return 'Outros'
}

export function importarExtratoNubank(csvText: string): Omit<Lancamento, 'id'>[] {
  const linhas = csvText.split('\n').map((l) => l.trim()).filter(Boolean)
  if (linhas.length < 2) return []

  const sep = linhas[0].includes(';') ? ';' : ','

  const resultado: Omit<Lancamento, 'id'>[] = []

  for (const linha of linhas.slice(1)) {
    const cols = linha.split(sep).map((c) => c.replace(/^"|"$/g, '').trim())
    if (cols.length < 3) continue

    const dataStr = cols[0]
    const valorStr = cols[1]
    const descricao = cols[3] || cols[2] || ''

    if (!dataStr || !valorStr || !descricao) continue

    let mes = 0
    let ano = 0
    if (dataStr.includes('-')) {
      const partes = dataStr.split('-')
      ano = parseInt(partes[0])
      mes = parseInt(partes[1])
    } else if (dataStr.includes('/')) {
      const partes = dataStr.split('/')
      mes = parseInt(partes[1])
      ano = parseInt(partes[2])
    }

    if (!mes || !ano) continue

    const valorLimpo = valorStr.replace(/[R$\s]/g, '').replace(',', '.')
    const valor = parseFloat(valorLimpo)
    if (isNaN(valor) || valor === 0) continue

    resultado.push({
      tipo: valor < 0 ? 'despesa' : 'receita',
      descricao,
      categoria: detectarCategoria(descricao),
      valor: Math.abs(valor),
      mes,
      ano,
      formaPagamento: 'cartao',
    })
  }

  return resultado
}
