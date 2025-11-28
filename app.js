// --- Ustawienia ---
// !!! WAŻNE: Zmień na swój adres URL wdrożonego Apps Script (Krok 7) !!!
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwsMW-wiQSSpNm2IBh77eUJbl5tkz1sIFspwjnLO8pbXuif4xleLqnmLWID85wOl_7lSw/exec'; 

// --- Dane Treningowe (Twój plan) ---
// To jest stały plan, który będziemy dynamicznie wyświetlać.
const WEEKLY_PLAN = {
    "MON": [
        { name: "Rozgrzewka", sets: 1, reps: "5-10 min", isDataEntry: false },
        { name: "Hip Thrusty", sets: 4, reps: "8-12", isDataEntry: true },
        { name: "Hamstring Curls (maszyna)", sets: 3, reps: "8-12", isDataEntry: true },
        { name: "Przysiady ze skokiem", sets: 3, reps: "8-12", isDataEntry: true },
        { name: "Schodki", sets: 1, reps: "15 min", isDataEntry: false },
    ],
    "TUES": [{ name: "Odpoczynek", sets: 0, reps: "Full Day Off", isDataEntry: false }],
    "WED": [
        { name: "Rozgrzewka", sets: 1, reps: "5-10 min", isDataEntry: false },
        { name: "Drążek do cycków (maszyna)", sets: 3, reps: "8-12", isDataEntry: true },
        { name: "Wyciskanie barki", sets: 3, reps: "8-12", isDataEntry: true },
        { name: "Bent-Over Row (podparcie na pieska)", sets: 3, reps: "8-12", isDataEntry: true },
        { name: "Prostowanie przedramion (maszyna)", sets: 3, reps: "8-12", isDataEntry: true },
        { name: "Rozpiętki", sets: 1, reps: "5 min", isDataEntry: false },
        { name: "Bieżnia pod górkę", sets: 1, reps: "20 min", isDataEntry: false },
    ],
    "THU": [{ name: "Odpoczynek", sets: 0, reps: "Full Day Off", isDataEntry: false }],
    "FRI": [
        { name: "Full Wszystko (Rozgrzewka)", sets: 1, reps: "5-10 min", isDataEntry: false },
        { name: "RDL", sets: 3, reps: "8-12", isDataEntry: true },
        { name: "Chest Press (maszyna)", sets: 3, reps: "8-12", isDataEntry: true },
        { name: "Wiosłowanie na wyciągu", sets: 3, reps: "8-12", isDataEntry: true },
        { name: "Zakroki w dół", sets: 3, reps: "8-12", isDataEntry: true },
        { name: "Wznosy ramion w bok", sets: 3, reps: "8-12", isDataEntry: true },
        { name: "Wypychanie nóg na maszynie", sets: 3, reps: "8-12", isDataEntry: true },
        { name: "Schodki", sets: 1, reps: "15 min", isDataEntry: false },
    ],
    "SAT": [{ name: "Aktywny Wypoczynek", sets: 0, reps: "Spacer/Yoga", isDataEntry: false }],
    "SUN": [{ name: "Odpoczynek", sets: 0, reps: "Rest", isDataEntry: false }],
};

let currentUser = null; // Zmienna do przechowywania wybranego użytkownika
const todayKey = new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase(); // np. "MON", "WED"
const todayDate = new Date().toLocaleDateString('pl-PL'); 


// --- 1. Funkcja Wyświetlania Planu Treningowego ---
function renderWorkout() {
    const trainingContent = document.getElementById('training-content');
    const todayWorkout = WEEKLY_PLAN[todayKey];
    
    document.getElementById('current-day-display').textContent = `Dziś jest ${todayKey}, ${todayDate}`;

    // Generowanie HTML dla planu
    let html = '<table>';
    todayWorkout.forEach((exercise, index) => {
        html += `<tr data-exercise-id="${index}">
            <td class="ex-name">${exercise.name}</td>
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
    html += '</table>';

    trainingContent.innerHTML = html;
    document.getElementById('save-button').disabled = false;
}


// --- 2. Obsługa Wyboru Użytkownika ---
document.querySelectorAll('.user-button').forEach(button => {
    button.addEventListener('click', (e) => {

        
        // Ukrycie selekcji i pokazanie planu
        document.getElementById('user-selection').classList.add('hidden');
        document.getElementById('workout-schedule').classList.remove('hidden');
        
        // Wyświetlenie nazwy użytkownika
        document.getElementById('current-user-display').textContent = currentUser;
        
        // Wyświetlenie planu na dzisiaj
        renderWorkout();

        console.log(`Wybrano użytkownika: ${currentUser}`);
    });
});


// --- 3. Obsługa Zapisu Danych do Arkusza Google ---
document.getElementById('save-button').addEventListener('click', async () => {
    
    // Sprawdzenie, czy URL Apps Script jest ustawiony
    if (GAS_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
        alert("BŁĄD: Musisz ustawić adres URL wdrożenia Apps Script w pliku app.js!");
        return;
    }
    
    const saveData = [];
    const trainingContent = document.getElementById('training-content');

    // Znalezienie wszystkich pól do wprowadzania Wagi
    const weightInputs = trainingContent.querySelectorAll('.weight-input');
    
    // Walidacja - czy wszystkie wymagane pola są wypełnione
    let allInputsFilled = true;
    weightInputs.forEach(input => {
        const repsInput = trainingContent.querySelector(`.reps-input[data-ex-name="${input.getAttribute('data-ex-name')}"]`);
        if (!input.value || !repsInput.value) {
            allInputsFilled = false;
        }
    });

    if (!allInputsFilled) {
        alert("Proszę wypełnić wszystkie pola Wagi i Powtórzeń dla ćwiczeń.");
        return;
    }

    document.getElementById('save-button').textContent = "Zapisywanie...";
    document.getElementById('save-button').disabled = true;

    // Przetwarzanie i wysyłanie danych
    for (const input of weightInputs) {
        const exName = input.getAttribute('data-ex-name');
        const totalSets = parseInt(input.getAttribute('data-sets'));
        const repsInput = trainingContent.querySelector(`.reps-input[data-ex-name="${exName}"]`);
        
        // Generujemy jeden wpis dla całej serii (można to rozwinąć na zapisywanie każdej serii osobno)
        const seriesData = {
            Uzytkownik: currentUser,
            DataTreningu: todayDate,
            DzienTygodnia: todayKey,
            Cwiczenie: exName,
            Seria: totalSets, // Na razie zapiszemy łączną liczbę serii
            Obciazenie: input.value,
            Powtorzenia: repsInput.value
        };
        saveData.push(seriesData);

        // Wysyłanie każdego ćwiczenia osobno jako POST request
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
        } catch (error) {
            console.error("Błąd zapisu danych:", error);
            alert(`Wystąpił błąd podczas zapisywania danych dla ćwiczenia ${exName}. Sprawdź konsolę.`);
            break; // Przerywamy pętlę w razie błędu
        }
    }
    
    // Końcowy komunikat
    document.getElementById('save-button').textContent = "Dane Zapisane! ✅";
    alert("Dane treningowe zostały pomyślnie zapisane do Arkusza Google!");
});

// --- Inicjalizacja: Dodatkowa stylizacja tabeli po załadowaniu ---
// Tutaj wkleimy dodatkowe CSS do app.js, aby uprościć proces
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
        #training-content td {
            padding: 12px 10px;
            border-bottom: 1px solid var(--color-beige);
        }
        .ex-name {
            font-weight: 600;
            width: 40%;
        }
        .ex-sets {
            color: var(--color-accent);
            width: 15%;
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
        }
        .input-cell input:focus {
            border-color: var(--color-accent);
            outline: none;
        }
        .no-data-cell {
            background-color: #f7f3ed;
            color: #8c8c8c;
            text-align: center;
        }
    `;
    document.head.appendChild(style);

});
