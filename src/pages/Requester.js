import React, { useState } from 'react';
import './styles.css';

// Página de requisição de acesso e visualização aos dados
function Requester() {
    const [state, setState] = useState({
        name: '',
        age: '',
        weight: '',
        height: '',
        requestedAddr: '',
        // auth = 0 -> Nenhuma requisição feita
        // auth = 1 -> Acesso permitido
        // auth = 2 -> Acesso negado
        auth: 0
    })

    // Função para solicitar acesso aos dados e carregá-los
    function display() {
        setState({...state, auth: 2});
    }

    return (
        <div>
            <h1>Visualização de dados</h1>

            <h2>Seleção do usuário</h2>

            <h3>Endereço da carteira:</h3>
            <input
                type="text" id="requestedAddr" placeholder={state.requestedAddr}
                onChange={e => setState({...state, requestedAddr: e.target.value})}
            />
            <br /><br />

            <button onClick={() => display()}>Visualizar</button>

            {state.auth === 0 ? <></> : <>
            
            <h2>Visualização dos dados</h2>

            {state.auth === 1 ? <>
            
            <h3>Nome: <span>{state.name}</span></h3>
            <h3>Idade: <span>{state.age}</span></h3>
            <h3>Peso: <span>{state.weight}</span></h3>
            <h3>Altura: <span>{state.height}</span></h3>
            
            </> : <>
            
            <h4>Acesso negado. Entre em contato com o usuário dono dos dados para solicitar acesso.</h4>

            </>}
            
            </>}
        </div>
    );
}

export default Requester;