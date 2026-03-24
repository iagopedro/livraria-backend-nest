import { DataSource } from 'typeorm';
import { Livro } from '../livros/entities/livro.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const livros = [
  {
    codigo: 'BK-2024-0001',
    titulo: 'O Senhor dos Anéis',
    autor: 'J.R.R. Tolkien',
    descricao: 'A épica jornada de Frodo para destruir o Um Anel e salvar a Terra-média das garras de Sauron.',
    ano: 1954,
    paginas: 1178,
  },
  {
    codigo: 'BK-2024-0002',
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    descricao: 'Bentinho narra sua vida e seu amor por Capitu, questionando a fidelidade da esposa numa das obras-primas do Realismo brasileiro.',
    ano: 1899,
    paginas: 256,
  },
  {
    codigo: 'BK-2024-0003',
    titulo: '1984',
    autor: 'George Orwell',
    descricao: 'Em um regime totalitário, Winston Smith tenta resistir ao onipresente Grande Irmão em uma das distopias mais influentes da literatura.',
    ano: 1949,
    paginas: 328,
  },
  {
    codigo: 'BK-2024-0004',
    titulo: 'O Guia do Mochileiro das Galáxias',
    autor: 'Douglas Adams',
    descricao: 'Arthur Dent é arrastado para o espaço momentos antes de a Terra ser demolida para dar lugar a uma via expressa intergaláctica.',
    ano: 1979,
    paginas: 224,
  },
  {
    codigo: 'BK-2024-0005',
    titulo: 'Sapiens: Uma Breve História da Humanidade',
    autor: 'Yuval Noah Harari',
    descricao: 'Um panorama audacioso da história humana desde os primeiros hominídeos até a era das biotecnologias.',
    ano: 2011,
    paginas: 464,
  },
  {
    codigo: 'BK-2024-0006',
    titulo: 'O Código Da Vinci',
    autor: 'Dan Brown',
    descricao: 'O professor Robert Langdon investiga um assassinato no Louvre que leva a uma conspiração que abala os alicerces do Cristianismo.',
    ano: 2003,
    paginas: 480,
  },
  {
    codigo: 'BK-2024-0007',
    titulo: 'Cem Anos de Solidão',
    autor: 'Gabriel García Márquez',
    descricao: 'A saga da família Buendía ao longo de sete gerações na fictícia Macondo, obra central do realismo mágico latino-americano.',
    ano: 1967,
    paginas: 448,
  },
  {
    codigo: 'BK-2024-0008',
    titulo: 'Clean Code',
    autor: 'Robert C. Martin',
    descricao: 'Princípios, padrões e práticas de escrita de código limpo, com exemplos em Java e técnicas atemporais de engenharia de software.',
    ano: 2008,
    paginas: 431,
  },
  {
    codigo: 'BK-2024-0009',
    titulo: 'O Pequeno Príncipe',
    autor: 'Antoine de Saint-Exupéry',
    descricao: 'Um piloto perdido no deserto encontra um pequeno príncipe vindo de outro planeta, em uma fábula poética sobre a essência da vida.',
    ano: 1943,
    paginas: 96,
  },
  {
    codigo: 'BK-2024-0010',
    titulo: 'Harry Potter e a Pedra Filosofal',
    autor: 'J.K. Rowling',
    descricao: 'Harry Potter descobre que é um bruxo e ingressa em Hogwarts, onde enfrenta pela primeira vez o terrível Lord Voldemort.',
    ano: 1997,
    paginas: 264,
  },
  {
    codigo: 'BK-2024-0011',
    titulo: 'O Poder do Hábito',
    autor: 'Charles Duhigg',
    descricao: 'Como os hábitos funcionam na vida das pessoas, das empresas e das sociedades, e como podemos mudá-los.',
    ano: 2012,
    paginas: 408,
  },
  {
    codigo: 'BK-2024-0012',
    titulo: 'A Revolução dos Bichos',
    autor: 'George Orwell',
    descricao: 'Uma fábula política em que animais tomam uma fazenda e constroem uma sociedade igualitária que rapidamente se corrompe.',
    ano: 1945,
    paginas: 128,
  },
  {
    codigo: 'BK-2024-0013',
    titulo: 'Pai Rico, Pai Pobre',
    autor: 'Robert T. Kiyosaki',
    descricao: 'Contrasta as lições financeiras de dois pais — um rico e um pobre — para ensinar como construir riqueza e investir bem.',
    ano: 1997,
    paginas: 336,
  },
  {
    codigo: 'BK-2024-0014',
    titulo: 'Design Patterns',
    autor: 'Gang of Four',
    descricao: 'O livro clássico que cataloga 23 padrões de projeto orientados a objetos, base do desenvolvimento de software moderno.',
    ano: 1994,
    paginas: 395,
  },
  {
    codigo: 'BK-2024-0015',
    titulo: 'O Alquimista',
    autor: 'Paulo Coelho',
    descricao: 'Santiago, um jovem pastor, parte em busca de um tesouro e aprende que o maior é o caminho percorrido e o que descobrimos sobre nós mesmos.',
    ano: 1988,
    paginas: 208,
  },
  {
    codigo: 'BK-2024-0016',
    titulo: 'Mindset: A Nova Psicologia do Sucesso',
    autor: 'Carol S. Dweck',
    descricao: 'Como a mentalidade fixa ou de crescimento determina o sucesso nas carreiras, relacionamentos e esportes.',
    ano: 2006,
    paginas: 288,
  },
  {
    codigo: 'BK-2024-0017',
    titulo: 'Duna',
    autor: 'Frank Herbert',
    descricao: 'Em um futuro distante, Paul Atreides enfrenta as intrigas políticas e o deserto do planeta Arrakis, único produtor da especiaria mais valiosa do universo.',
    ano: 1965,
    paginas: 688,
  },
  {
    codigo: 'BK-2024-0018',
    titulo: 'O Fim da Eternidade',
    autor: 'Isaac Asimov',
    descricao: 'Andrew Harlan é um Eterno que viaja pelo tempo para ajustar a história da humanidade — até que um amor proibido muda tudo.',
    ano: 1955,
    paginas: 256,
  },
  {
    codigo: 'BK-2024-0019',
    titulo: 'Thinking, Fast and Slow',
    autor: 'Daniel Kahneman',
    descricao: 'O nobel de economia explica os dois sistemas de pensamento que guiam nossas decisões: o intuitivo e rápido versus o deliberativo e lento.',
    ano: 2011,
    paginas: 499,
  },
  {
    codigo: 'BK-2024-0020',
    titulo: 'A Menina que Roubava Livros',
    autor: 'Markus Zusak',
    descricao: 'Narrado pela Morte, acompanha Liesel, uma menina que encontra conforto nos livros durante a Segunda Guerra Mundial na Alemanha.',
    ano: 2005,
    paginas: 552,
  },
];

async function seed() {
  const dataSource = new DataSource({
    type: 'mssql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    username: process.env.DB_USERNAME || 'sa',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'livraria',
    entities: [Livro],
    options: {
      encrypt: true,
      trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    },
  });

  await dataSource.initialize();
  const repo = dataSource.getRepository(Livro);

  let inseridos = 0;
  let ignorados = 0;

  for (const dados of livros) {
    const existente = await repo.findOne({ where: { codigo: dados.codigo } });
    if (existente) {
      console.log(`  ⚠  Ignorado (já existe): ${dados.codigo} — ${dados.titulo}`);
      ignorados++;
      continue;
    }
    await repo.save(repo.create(dados));
    console.log(`  ✔  Inserido: ${dados.codigo} — ${dados.titulo}`);
    inseridos++;
  }

  console.log(`\nConcluído: ${inseridos} inseridos, ${ignorados} ignorados.`);
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Erro ao executar seed:', err);
  process.exit(1);
});
