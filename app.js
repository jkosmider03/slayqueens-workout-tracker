// --- Ustawienia ---
// !!! WAŻNE: Wklej tutaj swój adres URL wdrożonego Apps Script (Krok 7) !!!
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwsMW-wiQSSpNm2IBh77eUJbl5tkz1sIFspwjnLO8pbXuif4xleLqnmLWID85wOl_7lSw/exec'; 

// --- Dane Treningowe (Twój plan) ---
// WAŻNE: Dodaj poprawny link YouTube EMBED dla każdego ćwiczenia (zaczyna się od https://www.youtube.com/embed/)
const WEEKLY_PLAN = {
    "MON": [
        { name: "Rozgrzewka", sets: 1, reps: "5-10 min", isDataEntry: false },
        { name: "Hip Thrusty", sets: 4, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/cNJdUkA3ycw?si=jAqIkwOsIBO8tpBp" }, 
        { name: "Hamstring Curls (maszyna)", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/O8s87E60c_U" }, 
        { name: "Przysiady ze skokiem", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/XlK4n44e6jU" }, 
        { name: "Schodki", sets: 1, reps: "15 min", isDataEntry: false },
    ],
    "TUES": [{ name: "Odpoczynek", sets: 0, reps: "Full Day Off", isDataEntry: false }],
    "WED": [
        { name: "Rozgrzewka", sets: 1, reps: "5-10 min", isDataEntry: false },
        { name: "Drążek do cycków (maszyna)", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/G5k-xWq-9a8" }, 
        { name: "Wyciskanie barki", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/B-aVd-exU9o" }, 
        { name: "Bent-Over Row (podparcie na pieska)", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/rP1jG66e9iU" }, 
        { name: "Prostowanie przedramion (maszyna)", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/tM1lV4kGv9Y" }, 
        { name: "Rozpiętki", sets: 1, reps: "5 min", isDataEntry: false },
        { name: "Bieżnia pod górkę", sets: 1, reps: "20 min", isDataEntry: false },
    ],
    "THU": [{ name: "Odpoczynek", sets: 0, reps: "Full Day Off", isDataEntry: false }],
    "FRI": [
        { name: "Full Wszystko (Rozgrzewka)", sets: 1, reps: "5-10 min", isDataEntry: false },
        { name: "RDL", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/Q0P9iQf7D1Q" }, 
        { name: "Chest Press (maszyna)", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/Y0rQ1J6lK08" }, 
        { name: "Wiosłowanie na wyciągu", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/j3ftE2Jd74Y" }, 
        { name: "Zakroki w dół", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/7XjF0rYwO3w" }, 
        { name: "Wznosy ramion w bok", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/39YwW1k31uM" }, 
        { name: "Wypychanie nóg na maszynie", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/n4sL-B09W2w" }, 
        { name: "Schodki", sets: 1, reps: "15 min", isDataEntry: false },
    ],
    "SAT": [{ name: "Aktywny Wypoczynek", sets: 0, reps: "Spacer/Yoga", isDataEntry: false }],
    "SUN": [{ name: "Odpoczynek", sets: 0, reps: "Rest", isDataEntry: false }],
};

let currentUser = null; 
const todayKey = new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase(); 
const todayDate = new Date().toLocaleDateString('pl-PL'); 


// --- 1. Funkcja Wyświetlania Planu Treningowego ---
function renderWorkout() {
    const trainingContent = document.getElementById('training-content');
    const todayWorkout = WEEKLY_PLAN[todayKey];
    
    document.getElementById('current-day-display').textContent = `Dziś jest ${todayKey}, ${todayDate}`;

    let html = '<table><tbody>';
    todayWorkout.forEach((exercise, index) => {
        html += `<tr data-exercise-id="${index}">
            <td class="ex-name">`;
        
        // Sprawdzamy, czy ćwiczenie ma link i czynimy je klikalnym
        if (exercise.link) {
            html += `<span class="clickable-ex-name" data-link="${exercise.link}" data-title="${exercise.name}">
                        ${exercise.name} <span class="info-icon">ⓘ</span>
                    </span>`;
        } else {
            html += exercise.name;
        }

        html += `</td>
            <td class="ex-sets">${exercise.sets} x ${exercise.reps}</td>`;

        if (exercise.isDataEntry) {
            // Interaktywne pola do wprowadzania danych
            html += `<td class="input-cell">
                <input type="number" class="weight-input" placeholder="Waga (kg)" data-ex-name="${exercise.name}" data-sets="${exercise.sets}" required>
            </td>
            <td class="input-cell">
                <input type="number" class="reps-input" placeholder="Powt. (max)" data-ex-name="${exercise.name}" data-sets="${exercise.sets}" required>
            </td>`;
        } else {
            // Puste pola dla Rozgrzewki/Schłodzenia/Odpoczynku
            html += `<td colspan="2" class="no-data-cell"></td>`;
        }
        html += `</tr>`;
    });
    html += '</tbody></table>';

    trainingContent.innerHTML = html;
    document.getElementById('save-button').disabled = false;
}


// --- 2. Obsługa Wyboru Użytkownika ---
document.querySelectorAll('.user-button').forEach(button => {
    button.addEventListener('click', (e) => {
        currentUser = e.target.getAttribute('data-user');
        
        document.getElementById('user-selection').classList.add('hidden');
        document.getElementById('workout-schedule').classList.remove('hidden');
        
        document.getElementById('current-user-display').textContent = currentUser;
        
        renderWorkout();

        console.log(`Wybrano użytkownika: ${currentUser}`);
    });
});


// --- 3. Obsługa Zapisu Danych do Arkusza Google ---
document.getElementById('save-button').addEventListener('click', async () => {
    
    if (GAS_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
        alert("BŁĄD: Musisz ustawić adres URL wdrożenia Apps Script w pliku app.js!");
        return;
    }
    
    const trainingContent = document.getElementById('training-content');
    const weightInputs = trainingContent.querySelectorAll('.weight-input');
    
    // Walidacja - sprawdzenie czy wszystkie wymagane pola są wypełnione
    let allInputsFilled = true;
    weightInputs.forEach(input => {
        const repsInput = trainingContent.querySelector(`.reps-input[data-ex-name="${input.getAttribute('data-ex-name')}"]`);
        if (!input.value || !repsInput.value) {
            allInputsFilled = false;
            // Dodajemy klasę, aby pole się podświetliło
            if (!input.value) input.style.border = '2px solid red';
            if (!repsInput.value) repsInput.style.border = '2px solid red';
        } else {
            input.style.border = '1px solid var(--color-beige)';
            repsInput.style.border = '1px solid var(--color-beige)';
        }
    });

    if (!allInputsFilled) {
        alert("Proszę wypełnić wszystkie pola Wagi i Powtórzeń dla ćwiczeń.");
        return;
    }

    const saveButton = document.getElementById('save-button');
    saveButton.textContent = "Zapisywanie...";
    saveButton.disabled = true;

    // Wysyłanie danych
    let successCount = 0;
    for (const input of weightInputs) {
        const exName = input.getAttribute('data-ex-name');
        const totalSets = parseInt(input.getAttribute('data-sets'));
        const repsInput = trainingContent.querySelector(`.reps-input[data-ex-name="${exName}"]`);
        
        const seriesData = {
            Uzytkownik: currentUser,
            DataTreningu: todayDate,
            DzienTygodnia: todayKey,
            Cwiczenie: exName,
            Seria: totalSets, 
            Obciazenie: input.value,
            Powtorzenia: repsInput.value
        };

        const formData = new FormData();
        for (const key in seriesData) {
            formData.append(key, seriesData[key]);
        }
        
        try {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                body: formData 
            });
            const result = await response.json();
            
            if (result.result !== 'success') {
                throw new Error(result.message || 'Nieznany błąd zapisu.');
            }
            successCount++;
        } catch (error) {
            console.error("Błąd zapisu danych:", error);
            alert(`Wystąpił błąd podczas zapisywania danych dla ćwiczenia ${exName}. Sprawdź konsolę.`);
            saveButton.textContent = "Spróbuj ponownie";
            saveButton.disabled = false;
            return; 
        }
    }
    
    // Końcowy komunikat
    saveButton.textContent = `Zapisano ${successCount} ćwiczeń! ✅`;
    setTimeout(() => {
         // Resetujemy przycisk po 3 sekundach
        saveButton.textContent = "Zapisz Dzień Treningowy";
        saveButton.disabled = false;
    }, 3000);
});


// --- 4. Obsługa Modala Instruktażowego ---
const modal = document.getElementById('instructionModal');
const closeModalButton = document.querySelector('.close-button');
const modalBody = document.getElementById('modal-body');

// Funkcja otwierająca modal
function showInstruction(title, link) {
    document.getElementById('modal-title').textContent = title;
    
    // Tworzenie elementu iframe dla wideo z YouTube (z embed linku)
    const iframeHtml = `<iframe 
                        src="${link}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>`;
    
    modalBody.innerHTML = iframeHtml; 
    modal.style.display = "block";
}

// Funkcja zamykająca modal
function closeInstruction() {
    modal.style.display = "none";
    // Oczyszczamy modal i stopujemy wideo, by nie grało w tle
    modalBody.innerHTML = '<p>Ładowanie instrukcji...</p>';
}

// Zdarzenie: Kliknięcie "x" zamyka modal
closeModalButton.addEventListener('click', closeInstruction);

// Zdarzenie: Kliknięcie poza modalem zamyka modal
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeInstruction();
    }
});

// Zdarzenie: Delegacja kliknięcia na nazwach ćwiczeń
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('clickable-ex-name') || e.target.classList.contains('info-icon')) {
        // Jeśli kliknięto w ikonę, użyjemy jej rodzica do pobrania danych
        const target = e.target.classList.contains('info-icon') ? e.target.parentElement : e.target;
        
        const link = target.getAttribute('data-link');
        const title = target.getAttribute('data-title');
        showInstruction(title, link);
    }
});

// --- Inicjalizacja i Dodatkowa Stylizacja Tabeli ---
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.innerHTML = `
        /* Stylizacja Tabela Treningowa */
        #training-content table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 0.95rem;
            text-align: left;
        }
        #training-content table tbody tr:last-child td {
            border-bottom: none;
        }
        #training-content td {
            padding: 12px 10px;
            border-bottom: 1px solid var(--color-beige);
            vertical-align: middle;
        }
        .ex-name {
            font-weight: 600;
            width: 40%;
            padding-right: 5px;
        }
        .ex-sets {
            color: var(--color-accent);
            width: 15%;
            font-size: 0.85rem;
        }
        .input-cell {
            width: 20%;
        }
        .input-cell input {
            width: 90%;
            padding: 8px;
            border: 1px solid var(--color-beige);
            border-radius: 4px;
            font-family: var(--font-body);
            transition: border-color 0.2s;
        }
        .input-cell input:focus {
            border-color: var(--color-accent);
            outline: none;
        }
        .no-data-cell {
            background-color: #f7f3ed;
            color: #8c8c8c;
            text-align: center;
            font-size: 0.85rem;
        }

        /* Stylizacja Klikalnej Nazwy i Ikony */
        .clickable-ex-name {
            cursor: pointer;
            text-decoration: underline;
            text-decoration-style: dotted;
            color: var(--color-primary);
        }
        .info-icon {
            font-weight: 800;
            margin-left: 5px;
            color: var(--color-accent);
            cursor: pointer;
        }
        /* Responsywność dla małych ekranów */
        @media (max-width: 450px) {
            #training-content td {
                padding: 8px 5px;
            }
            .ex-sets, .no-data-cell {
                font-size: 0.75rem;
            }
            .input-cell input {
                padding: 6px;
                font-size: 0.8rem;
            }
        }
    `;
    document.head.appendChild(style);
});