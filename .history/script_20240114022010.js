'use strict'

let contadorRegistros = 0;

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

const updateCounter = () => {
    const counterElement = document.getElementById('contadorRegistros');
    counterElement.textContent = `${contadorRegistros} recitativos adicionados`;
};

// CRUD - create read update delete
// Modificação na função deleteClient para decrementar o contador local
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
    contadorRegistros--;
    updateCounter(); // Chama a função para atualizar o contador
};


// Modificação na função updateClient para chamar a função updateCounter
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
    updateCounter(); // Chama a função para atualizar o contador
};

const readClient = () => getLocalStorage()

// Modificação na função createClient para incrementar o contador local
const createClient = (client) => {
    const dbClient = getLocalStorage();
    dbClient.push(client);
    setLocalStorage(dbClient);
    contadorRegistros++;
    updateCounter(); // Chama a função para atualizar o contador
};


const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Novo Recitativo'
}

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            auxiliar: document.getElementById('auxiliar').value,
            nome: document.getElementById('nome').value,
            livro: document.getElementById('livro').value,
            capitulo: document.getElementById('capitulo').value,
            versiculo: document.getElementById('versiculo').value,
            data: document.getElementById('data').value
        }
        const index = document.getElementById('nome').dataset.index;
        if (index == 'new') {
            createClient(client);
            updateTable();
            closeModal();
        } else {
            updateClient(index, client);
            updateTable();
            closeModal();
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `

        <td>${client.nome}</td>
        <td>${client.livro}</td>
        <td>${client.capitulo}</td>
        <td>${client.data}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('auxiliar').value = client.auxiliar
    document.getElementById('nome').value = client.nome
    document.getElementById('livro').value = client.livro
    document.getElementById('capitulo').value = client.capitulo
    document.getElementById('versiculo').value = client.versiculo
    document.getElementById('data').value = client.data
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${client.nome}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)