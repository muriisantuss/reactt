import './Style.css';
import Trash from '../../assets/trash.svg';
import Edit from '../../assets/edit.svg';
import api from '../../services/api';
import { useEffect, useState, useRef } from 'react';

function Home() {
  const [users, setUsers] = useState([]);
  const [buttonText, setButtonText] = useState('Cadastrar');
  const [buttonAction, setButtonAction] = useState(() => createUsers);

  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputAge, setInputAge] = useState('');

  const inputs = {
    name: useRef(),
    email: useRef(),
    age: useRef(),
  };

  function cleanInput() {
    setInputName('');
    setInputEmail('');
    setInputAge('');
  }

  async function getUsers() {
    const usersA = await api.get('usuarios');
    setUsers(usersA.data);
  }

  async function createUsers() {
    await api.post('usuarios', {
      name: inputs.name.current.value,
      age: inputs.age.current.value,
      email: inputs.email.current.value,
    });
    getUsers();
    cleanInput();
  }

  async function deleteUsers(id) {
    await api.delete(`usuarios/${id}`);

    getUsers();
  }

  function getUserInput(user) {
    setInputName(user.name);
    setInputEmail(user.email);
    setInputAge(user.age);
    setButtonText('Editar');
    setButtonAction(() => () => updateUsers(user.id));
  }

  async function updateUsers(id) {
    console.log('Atualizando usuário com ID:', id);

    if (!id) {
      console.error('Erro: ID do usuário não está definido!');
      return;
    }

    await api.put(`usuarios/${id}`, {
      name: inputs.name.current.value,
      age: inputs.age.current.value,
      email: inputs.email.current.value,
    });

    setButtonText('Cadastrar');
    setButtonAction(() => createUsers);
    getUsers();
    cleanInput();
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <main className="container">
      <form>
        <h1>Cadastrar Usuario</h1>
        <input
          name="nome"
          type="text"
          ref={inputs.name}
          placeholder="Nome"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />
        <input
          name="idade"
          type="text"
          ref={inputs.age}
          placeholder="Idade"
          value={inputAge}
          onChange={(e) => setInputAge(e.target.value)}
        />
        <input
          name="email"
          type="text"
          ref={inputs.email}
          placeholder="E-mail"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
        />
        <button type="button" onClick={buttonAction}>
          {buttonText}
        </button>
      </form>
      <article className="areaCard">
        {users.map((user) => (
          <section key={user.id} className="card">
            <div>
              <p>Nome: {user.name}</p>
              <p>Idade: {user.age}</p>
              <p>Email: {user.email} </p>
            </div>
            <article>
              <button onClick={() => deleteUsers(user.id)}>
                <img src={Trash} alt="Trash image" />
              </button>
              <button onClick={() => getUserInput(user)}>
                <img src={Edit} alt="Edit image" />
              </button>
            </article>
          </section>
        ))}
      </article>
    </main>
  );
}

export default Home;
