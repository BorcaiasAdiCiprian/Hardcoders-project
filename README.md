# Hardcoders-project

## 🛠️ Backend Setup & Database

Această secțiune descrie configurarea serverului Node.js și a bazei de date SQLite.

### 📋 Status Actual
* **Structura Proiectului:** Configurată (MVC - Models, Views/Routes, Controllers).
* **Baza de Date:** Configurată cu SQLite + Sequelize ORM.
* **Modele:** Create (`User`, `SesiuneInscriere`, `CerereDisertatie`) cu relațiile aferente.
* **Date de Test:** Script de seeding implementat.

### 🚀 Cum pornești Backend-ul (Ghid pentru echipă)

După ce ai dat `git clone` la proiect, urmează pașii de mai jos pentru a avea backend-ul funcțional local:

1.  **Navighează în folderul backend:**
    ```bash
    cd backend
    ```

2.  **Instalează dependențele:**
    (Acest pas descarcă librăriile necesare, inclusiv Sequelize și driverul SQLite)
    ```bash
    npm install
    ```

3.  **Populează Baza de Date (Foarte Important!):**
    Rulează această comandă pentru a crea fișierul `database.sqlite` și a-l popula cu date de test (profesori, studenți, sesiuni).
    *Atenție: Această comandă șterge datele vechi și recreează tabelele!*
    ```bash
    npm run seed
    ```

4.  **Pornește Serverul:**
    ```bash
    npm start
    ```
    Serverul va rula pe portul definit (default: 3000).

---

### 📂 Ghid Structură Backend

* `src/config/` - Configurarea conexiunii la baza de date (DONE).
* `src/models/` - Definiția tabelelor și a relațiilor (DONE).
* `src/controllers/` - Aici se va scrie logica pentru endpoint-uri (TODO ADI).
* `src/routes/` - Aici se vor defini rutele API (TODO ADI).
* `database.sqlite` - Baza de date locală (nu o ștergeți, dar nici nu o urcați pe git).