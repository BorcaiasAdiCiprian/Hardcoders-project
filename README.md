# Hardcoders-project

## 🛠️ Backend REST API

Această secțiune descrie funcționalitățile serverului Node.js, structura API-ului și instrucțiunile de utilizare.

### 📋 Status Actual
* **Structura Proiectului:** Configurată (MVC - Models, Views/Routes, Controllers).
* **Baza de Date:** Configurată cu SQLite + Sequelize ORM.
* **Autentificare:** Implementată folosind JWT (JSON Web Tokens).
* **Upload Fișiere:** Configurat folosind Multer.
* **Modele:** Implementate (`User`, `SesiuneInscriere`, `CerereDisertatie`) cu relațiile aferente.
* **Controllere:** Validări pentru sesiuni, flux aprobare cereri, gestionare fișiere.
* **Rute API:** Funcționale și protejate.

### 🚀 Cum pornești Backend-ul (Ghid pentru echipă)

După ce ai dat `git clone` la proiect, urmează pașii de mai jos pentru a avea backend-ul funcțional local:

1.  **Navighează în folderul backend:**
    ```bash
    cd backend
    ```

2.  **Instalează dependențele:**
    ```bash
    npm install
    ```

3.  **Pornește Serverul:**
    *Notă: La pornire, baza de date este resetată automat dacă (`force: true`), deci datele vechi se pierd. Pentru testarea eficientă a rutelor, asigurați-vă că (`force: false`). Este false by default acum, dar am zis să menționez*
    ```bash
    npm start
    ```
    Sau (Mai Recomandat)
    ```bash
    npx nodemon src/index.js
    ```
    Serverul va rula pe portul **3000**.

4.  **Populează Baza de Date (FOARTE IMPORTANT!!!):**
    Deoarece baza se golește la start, deschide un **terminal nou** (în timp ce serverul rulează) și execută:
    ```bash
    npm run seed
    ```
     Această comandă creează fișierul `database.sqlite` și îl populează cu date de test (profesori, studenți, sesiuni).
     *Atenție: pentru a vedea conținutul fișierului `database.sqlite`, aveți nevoie de extensia SQLite Viewer de pe VSCode*

5.  **Intră pe localhost**
    Dacă la intrarea pe "http://localhost:3000/" apare mesajul "Serverul functioneaza!" atunci felicitări, serverul merge!

---

###  Testare Rute

Printre fisierele proiectului se află și **ValidariDisertatie.postman_collection.json**, care este un pachet plin de teste pentru fiecare rută.
Tot ce trebuie să faceți este să intrați în postman și aveți opțiune de import în stânga sus, unde puteți să adăugați .json-ul menționat anterior!

---

### 📡 Documentație API (Endpoints)

Toate rutele sunt prefixate cu `/api`. Rutele protejate necesită header-ul `Authorization: Bearer Token <token>`. O să luăm pe rând rutele, în ordinea fișierelor de test din pachetul de Postman!

 **Folder 1: Auth**
* `POST /auth/login` - Autentificare utilizator (returnează token JWT). 
Sunt două teste: **Autentificare cu date de profesor** și **Autentificare cu date de student**.
La rularea fiecăruia se va genera în partea de jos un token. Copiați-le pe ambele într-un .txt file sau undeva la îndemână (fără ghilimele!), deoarece acestea verifică dacă profesorul sau studentul logat apelează celelalte rute.


 **Folder 2:  Sesiuni**

De aici încolo, toate testele o să aibă la finalul denumirii (stud) sau (prof). Acestea arată ce token trebuie copiat la `Authorization: Bearer Token` astfel încât să meargă apelul!
* `POST /sesiuni/` - Creare sesiune nouă (Profesor). Testul se numește **Creare Sesiuni(Prof)** *Validează suprapunerea intervalelor.* Pentru mai mult testing la rutele de POST sau PUT, se pot modifica valorile din `Body: Raw JSON`
* `GET /sesiuni/` - Listare sesiuni active (Student). Testul se numește **Vezi Sesiuni(Stud)**.
* `PUT /sesiuni/:id` - Modifică o sesiune proprie (Profesor). Testul se numește **Modificare Sesiune(Prof)**. *Trebuie specificat ID-ul sesiunii în URL și noile date în Body.*
* `DELETE /sesiuni/:id` - Șterge o sesiune proprie (Profesor). Testul se numește **Sterge Sesiune(Prof)**. *Atenție: Ștergerea unei sesiuni poate afecta cererile asociate.*

 **Folder 3: Cereri**

Acest folder conține logica principală de business (Fluxul de aprobare). Atenție la ID-urile folosite în URL (trebuie să fie ID-uri reale din baza de date).
* `POST /cereri/` - Studentul aplică la o sesiune. Testul se numește **Aplica La Sesiune(Stud)**. *Necesită `sesiuneId` în Body.*
* `PUT /cereri/:id/actiune-preliminara` - Profesorul aprobă cererea. Testul se numește **Aprobare Cerere(Prof)**. *În Body se trimite `{ "actiune": "aproba" }`.*
* `PUT /cereri/:id/actiune-preliminara` - Profesorul respinge cererea. Testul se numește **Respingere Cerere(Prof)**. *În Body se trimite `{ "actiune": "respinge", "justificare": "..." }`.*
* `POST /cereri/:id/upload-student` - Studentul încarcă cererea semnată. Testul se numește **Incarca Fisier(Stud)**. *Aici Body-ul este de tip `form-data`, cu cheia `fisier` setată pe File.* Încărcarea unui fișier .pdf, .doc sau .docx de maxim 10MB se face apăsând în dreptul cheii `fisier`, la value!
* `POST /cereri/:id/raspuns-profesor` - Profesorul aprobă final. Testul se numește **Aprobare Finala(Prof)**. *Body `form-data`: `actiune`="aproba_final" și `fisier`=PDF semnat.*
* `POST /cereri/:id/raspuns-profesor` - Profesorul respinge fișierul. Testul se numește **Respingere Document(Prof)**. *Body JSON sau form-data: `actiune`="respinge_fisier" și `justificare`.*

 **Folder 4: Fisiere**
* `GET /fisiere/:cerereId/:tip` - Descarcă fișierul asociat cererii. Testul se numește **Descarcare Fisier(Prof sau Stud)**. 
*:tip* poate fi `student` (pentru fișierul încărcat de student) sau `profesor` (pentru răspunsul final). Funcționează cu oricare dintre tokeni, atâta timp cât utilizatorul este implicat în acea cerere.

 **Folder 5: Listari**

Aceste rute vor fi folosite pentru a popula dashboard-ul din Frontend. (TO DO pentru faza finală a proiectului)
* `GET /auth/me` - Verifică cine este logat. Testul se numește **Verificare Tip Cont(Prof sau Stud)**. Returnează datele utilizatorului și rolul acestuia.
* `GET /sesiuni/personale` - Returnează sesiunile create de profesor. Testul se numește **Sesiunile Profului Logat(Prof)**.
* `GET /cereri/student` - Istoricul cererilor studentului. Testul se numește **Cererile Studentului Logat(Stud)**.
* `GET /cereri/profesor` - Inbox-ul profesorului cu cererile primite. Testul se numește **Cererile Catre Proful Logat(Prof)**.

---

### 📂 Ghid Structură Backend

* `src/config/` - Configurarea DB și configurarea Multer (DONE).
* `src/models/` - Definiția tabelelor și a relațiilor (DONE).
* `src/controllers/` - Logica de business (DONE).
* `src/routes/` - Definirea endpoint-urilor (DONE).
* `src/middlewares/` - Verificarea token-ului JWT (DONE).
* `uploads/` - Folder creat automat unde se stochează fișierele încărcate (ignorat de git).
