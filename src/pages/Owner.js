import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Compile from '../contract/compile';
import './styles.css';
import api from '../services/api';

// Página de controle dos dados pessoais
function Owner() {
    const [state, setState] = useState({
        web3: undefined,
        walletAddr: '',
        contractAddr: '',
        contract: '',
        name: '',
        age: '',
        weight: '',
        height: '',
        requesterAddr: '',
        loaded: false
    });

    useEffect(() => {
        async function start() {
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
                
                // Acesso ao DB
                await api.get(`/wallet/getWallet?walletAddr=${walletAddr}`)
                    .then(res => {
                        if (res.data === "") {
                            setState({...state, web3: web3, walletAddr: walletAddr});
                        }
                        else {
                            const data = res.data.wallet;
                            const contract = new web3.eth.Contract(data.abi, data.contractAddr);
                            setState({...state, web3: web3, walletAddr: walletAddr, age: data.age, height: data.height, name: data.name, weight: data.weight, contractAddr: data.contractAddr, contract: contract, loaded: true});
                        }
                    })
                    .catch(error => console.log(error));
            });
        }
        start();
    }, []);

    // Função para realizar deploy do contrato e cadastrar dados no DB
    function deploy() {
        let contractAddr = '';

        // Obter abi e bytecode do contrato compilado
        const contractFile = Compile();
        const abi = contractFile.abi;
        const bytecode = "0x" + contractFile.bytecode.object;

        // Realizar deploy do contrato
        const accessContract = new state.web3.eth.Contract(abi);
        accessContract.deploy({
            data: bytecode
        }).send({
            from: state.walletAddr
        }).then((deployment) => {
            contractAddr = deployment.options.address;
            const contract = new state.web3.eth.Contract(abi, contractAddr);

            // Definir dono pelo método defineOwner
            contract.methods.defineOwner().send({from: state.walletAddr}).then(async () => {
                setState({...state, contractAddr: contractAddr, contract: contract, loaded: true});

                alert("Foi realizado deploy do contrato no endereço " + contractAddr.toString());

                // Chamada para cadastrar dados no db
                const data = {
                    walletAddr: state.walletAddr,
                    contractAddr: contractAddr,
                    name: state.name,
                    age: state.age,
                    weight: state.weight,
                    height: state.height,
                    abi: abi
                };

                await api.post('/wallet/createWallet',
                    JSON.stringify(data), { headers: {'Content-Type': 'application/json'} });
            })
        }).catch((err) => {
            alert(err);
        });
    }

    // Função para atualizar dados no DB
    async function update() {
        // Chamar rota para atualização no DB
        console.log(state);
        const data = {
            myWalletAddr: state.walletAddr,
            walletAddr: state.walletAddr,
            name: state.name,
            age: state.age,
            weight: state.weight,
            height: state.height
        };

        await api.put('/wallet/updateWallet',
            JSON.stringify(data), { headers: {'Content-Type': 'application/json'} });
    }

    // Função para autorizar acesso aos dados
    function authorize() {
        // Conceder acesso pelo método grantAccess
        state.contract.methods.grantAccess(state.requesterAddr)
            .send({from: state.walletAddr})
            .then(() => alert("Acesso concedido com sucesso!"))
            .catch(err => alert(err));
    }

    // Função para negar acesso aos dados
    function deny() {
        // Negar acesso pelo método denyAccess
        state.contract.methods.denyAccess(state.requesterAddr)
            .send({from: state.walletAddr})
            .then(() => alert("Acesso negado com sucesso!"))
            .catch(err => alert(err));
    }

    return (
        <div>
            <h1>Controle de dados</h1>

            <h2>Dados cadastrados</h2>

            <h3>Nome:</h3>
            <input 
                type="text" id="name" placeholder={state.name}
                onChange={e => setState({...state, name: e.target.value})}
            />
            <br />

            <h3>Idade:</h3>
            <input
                type="number" id="age" placeholder={state.age}
                onChange={e => setState({...state, age: e.target.value})}
            />  
            <br />

            <h3>Peso:</h3>
            <input
                type="number" id="weight" placeholder={state.weight}
                onChange={e => setState({...state, weight: e.target.value})}
            />  
            <br />

            <h3>Altura:</h3>
            <input
                type="number" id="height" placeholder={state.height}
                onChange={e => setState({...state, height: e.target.value})}
            />  
            <br /><br />

            {state.loaded ?
            <button onClick={() => update()}>Atualizar</button> :
            <button onClick={() => deploy()}>Cadastrar</button>}

            {state.loaded ? 
            <><h2>Controlar acesso</h2>

            <h3>Endereço da carteira:</h3>
            <input
                type="text" id="address"
                onChange={e => setState({...state, requesterAddr: e.target.value})}
            />
            <br /><br />

            <button onClick={() => authorize()}>Autorizar acesso</button>
            <button onClick={() => deny()}>Negar acesso</button></>
            : <></>}
        </div>
    );
}

export default Owner;