
const API_URL = 'api.php';

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    document.getElementById('formBank').addEventListener('submit', createBank);
});

function showAlert(message, type = 'success') {
    const alertsDiv = document.getElementById('alerts');
    alertsDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    setTimeout(() => {
        alertsDiv.innerHTML = '';
    }, 4000);
}

async function loadData() {
    try {
        const response = await fetch(`${API_URL}?action=get_all`);
        const data = await response.json();
        
        if (data.success) {
            renderBanks(data.banks);
            populateBankSelect(data.banks);
        } else {
            showAlert(data.message || data.error, 'danger');
        }
    } catch (error) {
        console.error('Error cargando datos. ¿Está PHP corriendo en localhost:8000?', error);
        showAlert('No se pudo conectar al servidor PHP. ¿Aseguraste de ejecutar "php -S localhost:8000"?', 'danger');
    }
}

function renderBanks(banks) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    if(banks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No hay usuarios</td></tr>';
        return;
    }

    banks.forEach(bank => {
        tbody.innerHTML += `
            <tr>
                <td>${bank.id}</td>
                <td>${bank.name}</td>
                <td>${bank.country}</td>
                <td>${bank.clients}</td>
                <td>${bank.owner}</td>
                <td>${bank.phoneNumber}</td>
                <td>${bank.dollarValue}</td>
            </tr>
        `;
    });
}

async function createBank(e) {
    e.preventDefault();
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const country = document.getElementById('country').value;
    const clients = document.getElementById('clients').value;
    const owner = document.getElementById('owner').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const dollarValue = document.getElementById('dollarValue').value;
    

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create_bank', name, email })
        });
        const data = await response.json();
        
        if (data.success) {
            showAlert('Usuario registrado correctamente');
            document.getElementById('formUser').reset();
            loadData();
        } else {
            showAlert('Error: ' + (data.error || 'No se pudo crear'), 'danger');
        }
    } catch (error) {
        showAlert('Error de conexión', 'danger');
    }
}


window.deleteBank = async function(id) {
    if(!confirm('¿Estás seguro de eliminar este usuario? Sus posts también se eliminarán.')) return;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete_user', id })
        });
        const data = await response.json();
        
        if (data.success) {
            showAlert('Usuario eliminado');
            loadData();
        }
    } catch (error) {
        showAlert('Error de conexión', 'danger');
    }
}


