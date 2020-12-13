pragma solidity ^0.4.2;

contract Access {
    // Endereço do indivíduo
    address public personAdd = 0x0;
    // Variável que controla definição do indivíduo
    bool private ownerDefined = false;
    // Conceder/negar acesso a solicitantes
    mapping(address => bool) public requesters;
    
    // Função para definir indivíduo dono dos dados
    function defineOwner() public {
        // Pode ser chamada apenas uma vez
        require(!ownerDefined);
        ownerDefined = true;
        
        // Definir dono
        personAdd = msg.sender;
        requesters[msg.sender] = true;
    }
    
    // Função para conceder acesso aos dados
    function grantAccess(address _requesterAdd) public {
        // Apenas o dono dos dados pode controlar acesso
        require(msg.sender == personAdd);
        
        // Conceder acesso
        requesters[_requesterAdd] = true;
    }
    
    // Função para negar acesso aos dados
    function denyAccess(address _requesterAdd) public {
        // Apenas o dono dos dados pode controlar acesso
        require(msg.sender == personAdd);
        
        // Conceder acesso
        requesters[_requesterAdd] = false;
    }
    
    // Função para conferir permissão
    function checkAccess(address _requesterAdd) view public returns(bool) {
        bool access = requesters[_requesterAdd];
        
        // Retornar nome e permissão
        return access;
    }
}