// Importações
import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Checkbox } from "@/components/ui/checkbox"

import { Label } from "@/components/ui/label"

import { Input } from "@/components/ui/input"

import { Skeleton } from "@/components/ui/skeleton"

import { Button } from "@/components/ui/button"

import { useToast } from "@/components/ui/use-toast"

// Interface do usuário
interface User {
  Nome: string;
  Disponivel: boolean;
}

// Interface da resposta da requisição
interface UsersResponse {
  Msg: string;
  Dados: User[];
}

function App() {
  // Estado dos dados
  const [data, setData] = useState<UsersResponse>();
  // Estado dos usuários
  const [users, setUsers] = useState<User[]>();
  // Estados dos filtros
  const [filter, setFilter] = useState({
    name: "",
  });

  // Função para chamar a mensagem no canto da tela
  const { toast } = useToast()

  // Função para pegar os usuários da API
  async function getUsers() {
    // Requisição para o backend
    const usersRaw = await axios.get("https://09441c3d-9208-4fa9-a576-ba237af6b17c.mock.pstmn.io/")

    // Armazenar a resposta da requisição
    const usersData: UsersResponse = usersRaw.data;
    // Coloca o valor da resposta no estado 'data'
    setData(usersData);
    // Coloca o array de usuários no estado 'users'
    setUsers(usersData.Dados);

    // Tratamento de erro
    // Verifica se a mensagem da requisição é positiva e mostra na tela
    if (usersData.Msg == "Sucesso ao Encontrar usuário.") {
      toast({
        variant: "default",
        title: "Usuários encontrados",
        description: "Os usuários foram encontrados com sucesso",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: "Ocorreu um erro ao encontrar os usuários.",
      })
    }
  }

  // Filtro por Nome de Usuário
  function filterByName() {
    // Verifica se a resposta do Backend não é Indefinida
    if (users != undefined && data != undefined) {
      // Cria um array para armazenar usuários
      let newArray: User[] = []

      // Verifica se o filtro está vazio
      if (filter.name == "") {
        // Se estiver vazio mostra todos os usuários na tela
        newArray = [...data.Dados]
      } else {
        // Se não estiver vazio filtra os usuários pela palavra digitada
        for (let i = 0; i < users.length; i++) {
          if (users[i].Nome.toLowerCase().includes(filter.name.toLowerCase())) {
            // Adiciona os usuários no Array
            newArray.push(users[i]);
          }
        }
      }
      // Troca o valor do estado para o valor do Array
      setUsers([...newArray]);
    }
  }

  // Chama a função para filtrar usuários quando um valor é digitado no Input
  useEffect(() => {
    filterByName();
  }, [filter.name])

  // Chama a função para pegar usuários do Backend quando inicializa a página
  useEffect(() => {
    getUsers();
  }, [])

  return (
    <section className='flex items-center justify-start flex-col gap-[40px] min-h-screen p-[20px]'>
      <div className='w-full max-w-[750px]'>
        <h2 className='text-[36px] font-medium'>Usuários</h2>
      </div>
      <div className='flex items-start- justify-start w-full max-w-[750px] gap-[20px]'>
        {/* SEÇÃO COM OS FILTROS */}
        <aside className='flex flex-col gap-[20px]'>
          <div>
            <h3 className='text-[20px] font-medium'>Filtros</h3>
          </div>
          <div className='w-full'>
            <Label htmlFor="name">Nome:</Label>
            <Input
              name="name"
              value={filter.name}
              onChange={(e) => setFilter({ ...filter, name: e.target.value })}
              className='w-[300px]'
            />
          </div>

          <div>
            <Button variant="outline" onClick={() => setFilter({
              ...filter,
              name: "",
            })}>Limpar filtro</Button>
          </div>
        </aside>

        {/* SEÇÃO COM A TABELA DE USUÁRIOS */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>Posição</TableHead>
              <TableHead className=''>Nome</TableHead>
              <TableHead className='w-[50px]'>Disponível</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users !== undefined ? users?.map((u, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell className="font-medium">{u.Nome}</TableCell>
                <TableCell className='text-center'>
                  <Checkbox disabled checked={u.Disponivel} />
                </TableCell>
              </TableRow>
            )) :
              <TableRow>
                {Array.from({ length: 3 }, (_, k) => k).map((i) => (
                  <TableCell key={i}>
                    <Skeleton className="w-full h-[20px] rounded-full" />
                  </TableCell>
                ))}
              </TableRow>
            }

          </TableBody>

        </Table>
      </div>
    </section>
  )
}

export default App
