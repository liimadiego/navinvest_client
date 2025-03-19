import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/global-config';
import { NewsView } from 'src/sections/news/view/news-view';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Page() {
  const { news_id } = useParams();
  const [news, setNews] = useState(null);
  const [otherNews, setOtherNews] = useState([]);

  useEffect(() => {
    setNews({
      id: 1,
      title: "Petrobras (PETR4) recebe indicados para novo conselho com Pietro Mendes como chairman",
      content: "<p><strong>SÃO PAULO (Reuters)</strong> - A <strong>Petrobras</strong> (<a target='_blank' href='https://www.petrobras.com.br'>PETR3</a>; <a target='_blank' href='https://www.petrobras.com.br'>PETR4</a>) informou nesta quinta-feira que recebeu os nomes de indicados pela União e acionistas minoritários para a formação do novo conselho de administração, com <strong>Pietro Mendes</strong>, atual presidente do colegiado, seguindo na posição.</p>  <p>A eleição dos indicados, que incluirá integrantes do conselho fiscal, ocorrerá na <strong>Assembleia Geral Ordinária (AGO)</strong> da companhia, agendada para o dia <strong>16 de abril</strong>.</p>  <p><strong>A lista dos indicados é a seguinte:</strong></p> <ul> <li><strong>Pietro Mendes</strong></li> <li><strong>Magda Chambriard</strong></li> <li><strong>Renato Campos Galuppo</strong></li> <li><strong>José Fernando Coura</strong></li> <li><strong>Rafael Ramalho Dubeux</strong></li> <li><strong>Bruno Moretti</strong></li> <li><strong>Benjamin Alves Rabello Filho</strong></li> <li><strong>Ivanyra Maura de Medeiros Correia</strong></li> </ul>  <p>Além de <strong>Mendes</strong>, a CEO <strong>Chambriard</strong>, <strong>Galuppo</strong>, <strong>Dubeux</strong> e <strong>Moretti</strong> já integram o conselho atualmente.</p>  <p>Fonte: <a target='_blank' href='https://www.reuters.com'>Reuters</a></p>",
      coverUrl: "https://www.moneytimes.com.br/uploads/2025/02/petrobras-petr4-dividendos.jpg",
      buttonText: "Ver mais",
      newsUrl: "/dashboard/news/1"
    })

    setOtherNews([
      {
        id: 2,
        title: "Não é a Taesa (TAEE11) e nem a Engie (EGIE3): A elétrica com maior retorno de dividendos da Ágora",
        coverUrl: "https://www.moneytimes.com.br/uploads/2024/09/setor-eletrico-2.jpg",
        summary: "A Ágora Investimentos divulgou sua carteira recomendada de dividendos para o mês de abril, com a inclusão de uma nova ação. A corretora optou por retirar a Taesa (TAEE11) e a Engie (EGIE3) e incluir a elétrica com maior retorno de dividendos do mês.",
        newsUrl: "/dashboard/news/2"
      },
      {
        id: 3,
        title: "Banco do Brasil (BBAS3): BBA vê dividendos em xeque",
        coverUrl: "https://www.infomoney.com.br/wp-content/uploads/2023/08/Ed-Sede-BB-Brasilia-2022-Giovanni-Nobile-Assessoria-de-Imprensa-BB-6.jpg?quality=70",
        summary: "O Banco do Brasil (BBAS3) divulgou na última sexta-feira (1) o seu resultado do quarto trimestre de 2022. O banco registrou um lucro líquido de R$ 4,2 bilhões, um crescimento de 10,8% em relação ao mesmo período de 2021.",
        newsUrl: "/dashboard/news/3"
      }
    ]);
  }, []);

  const metadata = { title: `${news?.title ?? ""} | ${CONFIG.appName.toUpperCase()}` };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <NewsView news={news} otherNews={otherNews} />
    </>
  );
}
