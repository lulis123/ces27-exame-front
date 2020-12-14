import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import api from '../services/api';
import './styles.css';

// Página de requisição de acesso e visualização aos dados
function Requester() {
    const [state, setState] = useState({
        name: '',
        age: '',
        weight: '',
        height: '',
        requestedAddr: '',
        web3: '',
        walletAddr: '',
        // auth = 0 -> Nenhuma requisição feita
        // auth = 1 -> Acesso permitido
        // auth = 2 -> Acesso negado
        auth: 0
    })

    useEffect(() => {
        let web3 = undefined;

        // Realizar conexão com a blockchain
        if (typeof web3 !== 'undefined') {
            // Usar provedor MetaMask
            web3 = new Web3(web3.currentProvider);
        }
        else {
            // Usar provedor localhost
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }

        // Salvar endereço da conta
        let walletAddr = '';
        web3.eth.getCoinbase().then(async function(coinbase) {
            walletAddr = coinbase;

            setState({...state, web3: web3, walletAddr: walletAddr});
        });
    }, []);

    // Função para solicitar acesso aos dados e carregá-los
    async function display() {
        await api.get(`/wallet/getWallet?walletAddr=${state.requestedAddr}`)
            .then(res => {
                if (res.data !== "") {
                    const data = res.data.wallet;
                    const contract = new state.web3.eth.Contract(data.abi, data.contractAddr);

                    // Checar acesso no método checkAccess
                    contract.methods.checkAccess(state.walletAddr).call({from: state.walletAddr}).then(access => {
                        console.log(state.walletAddr);

                        if (access) {
                            setState({...state, name: data.name, age: data.age, weight: data.weight, height: data.height, auth: 1});
                        }
                        else {
                            setState({...state, auth: 2});
                        }
                    })
                }
            })
            .catch(error => console.log(error));
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