import React from "react";
import { withRouter } from 'next/router'
import { useRouter } from 'next/router';
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import {
  AlurakutMenu,
  OrkutNostalgicIconSet,
  AlurakutProfileSidebarMenuDefault,
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${propriedades.githubUser}.png`}
        style={{ borderRadius: "8px" }}
      />
      <hr />
      <p>
        <a
          className="boxLink"
          href={`https://github.com/${propriedades.githubUser}`}
        >
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {propriedades.items.slice(0, 6).map((item) => {
          return (
            <li key={item.login}>
              <a href={item.html_url}>
                <img src={item.avatar_url} />
                <span>{item.login}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home(props) {
  const router = useRouter();
  const usuarioAleatorio = router.query.githubUser;
  const [comunidades, setComunidades] = React.useState([]);
  const pessoasFavoritas = [
    "torvalds",
    "Pim3nta",
    "peas",
    "rafaballerini",
    "laurati",
    "jpbadan",
    "omariosouto",
  ];

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function () {
    // fetch('/api/usuario', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(comunidade)
    // })
    // .then(async (response) => {
    //   const dados = await response.json();
    //   console.log(dados.registroCriado);
    //   const comunidade = dados.registroCriado;
    //   const comunidadesAtualizadas = [...comunidades, comunidade];
    //   setComunidades(comunidadesAtualizadas)
    // })

    fetch(`https://api.github.com/users/${usuarioAleatorio}/followers`)
      .then(async(respostaDoServidor) => await respostaDoServidor.json())
      .then((respostaCompleta) => {
        setSeguidores(respostaCompleta);
      });

    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '09634ecb64d6577f3c92634ceffa83',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          id 
          title
          imageUrl
          creatorSlug
        }
      }` })
    })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      console.log(comunidadesVindasDoDato)
      setComunidades(comunidadesVindasDoDato)
    })
    // .then(function (response) {
    //   return response.json()
    // })
  }, [usuarioAleatorio]);

  return (
    <>
   
      <AlurakutMenu githubUser={usuarioAleatorio} />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCriaComunidade(e) {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);

                console.log("Campo: ", dadosDoForm.get("title"));
                console.log("Campo: ", dadosDoForm.get("image"));

                const comunidade = {
                  title: dadosDoForm.get("title"),
                  imageUrl: dadosDoForm.get("image"),
                  creatorSlug: usuarioAleatorio,
                };

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade)
                })
                .then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas)
                })
              }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>Criar comunidade</button>
            </form>
          </Box>
          <Box>
            <h2 className="subTitle">Deixe aqui seu depoimento &#128512;</h2>
            <form
              onSubmit={function handleDepoimento(e){
                e.preventDefault();
                const dadosDoDepoimento = new FormData(e.target);
                const depoimento = {
                  text: dadosDoDepoimento.get("text"),
                  creatorSlug: usuarioAleatorio,
                };

                fetch('/api/depoimentos', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(depoimento)
                })
                .then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const depoimento = dados.registroCriado;
                  const depoimentosAtualizados = [...depoimentos, depoimento];
                  setDepoimentos(depoimentosAtualizados);
                })
              }}
            >
              <div>
                <input
                    placeholder="Escreva seu depoimento"
                    name="depoimento"
                    aria-label="Escreva seu depoimento"
                    type="text"
                  />
              </div>
              <button>Enviar</button>
            </form>
          </Box>
          <Box>
            <h2 className="subTitle">Depoimentos</h2>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
        </div>
      </MainGrid>
    </>
  );
}

// export async function getServerSideProps(context) {
//   const cookies = nookies.get(context)
//   const token = cookies.USER_TOKEN;
//   const { isAuthenticated } =  await fetch('https://alurakut.vercel.app/api/auth', {
//     headers: {
//         Authorization: token
//       }
//   })
//   .then(async (resposta) => await resposta.json())

//   // if(!isAuthenticated) {
//   //   return {
//   //     redirect: {
//   //       destination: '/login',
//   //       permanent: false,
//   //     }
//   //   }
//   // }
//   const token_wait = jwt.decode(token);
//   const githubUser = token_wait.githubUser;
 
//   return {
//     props: {
//       githubUser: githubUser
//     }, // will be passed to the page component as props
//   }
// } 


