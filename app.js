
const API_URL = './api.php';

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
        const text = await response.text();

        if (!response.ok) {
            console.error('API error response:', response.status, response.statusText, text);
            showAlert(`Error del servidor: ${response.status} ${response.statusText}`, 'danger');
            return;
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error('Invalid JSON received from API:', text);
            showAlert('Respuesta inválida del servidor. Revisa la consola para más detalles.', 'danger');
            return;
        }

        if (data.success) {
            renderBanks(data.banks);
        } else {
            showAlert(data.message || data.error, 'danger');
        }
    } catch (error) {
        console.error('Error cargando datos desde API:', error);
        showAlert('No se pudo conectar al servidor PHP. Revisa la configuración y logs.', 'danger');
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
    const name = document.getElementById('name').value;
    const country = document.getElementById('country').value;
    const clients = document.getElementById('clients').value;
    const owner = document.getElementById('owner').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const dollarValue = document.getElementById('dollarValue').value;
    const creationDate = document.getElementById('creationDate').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'create_bank',
                name,
                country,
                clients,
                owner,
                phoneNumber,
                dollarValue,
                creationDate
            })
        });

        const text = await response.text();
        let data;

        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error('Invalid JSON received from createBank:', text);
            showAlert('Respuesta inválida del servidor al crear banco.', 'danger');
            return;
        }

        if (data.success) {
            showAlert('Banco registrado correctamente');
            document.getElementById('formBank').reset();
            loadData();
        } else {
            showAlert('Error: ' + (data.error || 'No se pudo crear el banco'), 'danger');
        }
    } catch (error) {
        console.error('Error de conexión al crear banco:', error);
        showAlert('Error de conexión al crear banco', 'danger');
    }
}


window.deleteBank = async function(id) {
    if (!confirm('¿Estás seguro de eliminar este banco?')) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete_bank', id })
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error('Invalid JSON received from deleteBank:', text);
            showAlert('Respuesta inválida del servidor al eliminar banco.', 'danger');
            return;
        }

        if (data.success) {
            showAlert('Banco eliminado');
            loadData();
        } else {
            showAlert('Error al eliminar: ' + (data.error || 'No se pudo eliminar el banco'), 'danger');
        }
    } catch (error) {
        console.error('Error de conexión al eliminar banco:', error);
        showAlert('Error de conexión', 'danger');
    }
}


