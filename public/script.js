fetch('/csrf-token')
.then(response => response.json())
.then(data => {
    document.getElementById('csrfToken').value = data.csrfToken;
    document.getElementById('editCsrfToken').value = data.csrfToken;
});

document.getElementById('show').addEventListener('click', function() {
    fetch('/utilisateurs')
        .then(response => response.json())
        .then(users => {
            const userListDiv = document.getElementById('userList');
            userListDiv.innerHTML = ''; // Efface le contenu précédent

            users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.classList.add('user');
                userDiv.innerHTML = `
                    <strong>${user.nom}</strong> - ${user.prenom} - ${user.date}
                    <button class="edit-btn" data-id="${user.id}">Modifier</button>
                    <button class="delete-btn" data-id="${user.id}">Supprimer</button>
                `; // Adapter selon les propriétés de ton utilisateur
                
                // Ajoute les boutons d'édition et de suppression
                const editBtn = userDiv.querySelector('.edit-btn');
                const deleteBtn = userDiv.querySelector('.delete-btn');

                editBtn.addEventListener('click', function() {
                    // Action de modification ici (à implémenter)
                    const userId = user.id;
                    const newNom = prompt('Nouveau nom :', user.nom);
                    const newPrenom = prompt('Nouveau prénom :', user.prenom);
                    const newDate = prompt('Nouvelle date :', user.date);
                    

                    fetch(`/utilisateurs/${userId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ nom: newNom, prenom: newPrenom, date: newDate })
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        document.getElementById('show').click();
                    })
                    .catch(error => {
                        console.error('Erreur lors de la modification de l\'utilisateur:', error);
                        alert('Erreur lors de la modification de l\'utilisateur');
                    });
                    // alert(`Modifier l'utilisateur avec ID ${user.id}`);
                });

                deleteBtn.addEventListener('click', function() {
                    // Action de suppression ici (à implémenter)
                    if (confirm(`Voulez-vous vraiment supprimer l'utilisateur avec l'ID ${user.id} ?`)) {
                        const userId = user.id;
                        
                        fetch(`/utilisateurs/${userId}`, {
                            method: 'DELETE'
                        })
                        .then(response => response.json())
                        .then(data => {
                            alert(data.message);
                            document.getElementById('show').click();
                        })
                        .catch(error => {
                            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
                            alert('Erreur lors de la suppression de l\'utilisateur');
                        });
                    }
                    // alert(`Supprimer l'utilisateur avec ID ${user.id}`);
                });

                userListDiv.appendChild(userDiv);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            alert('Erreur lors de la récupération des utilisateurs');
        });
});
