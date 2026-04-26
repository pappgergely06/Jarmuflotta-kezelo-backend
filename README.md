# Flottakezelő API Fejlesztői Dokumentáció

## 1. Projekt Áttekintése
A projekt egy Node.js (Express) alapú RESTful API, amely a "Flottakezelő" adatbázis mögött lát el CRUD (Létrehozás, Olvasás, Frissítés, Törlés) funkciókat. Az alkalmazás relációs (MySQL/MariaDB) adatbázist használ a gépjárművek, sofőrök, útvonalak, tankolások és szerviz információk kezelésére, illetve tartalmaz egy jogosultságkezelő modul (auth) is.

## 2. Technológiai Stack
- **Node.js**: Futtatókörnyezet.
- **Express.js**: Backend web keretrendszer az útvonalak és kérések kezelésére (v5.x).
- **MariaDB Driver**: MySQL/MariaDB adatbázissal való aszinkron (promise alapú) kapcsolódáshoz (`mariadb`).
- **JWT (JSON Web Token)**: Autentikációra és jogosultság ellenőrzésre.
- **Bcrypt**: A jelszavak biztonságos hasheléséhez (v6.x).
- **Jest & Supertest**: Egységtesztek (Unit Test) a végpontok elszigetelt, adatbázisfüggetlen tesztelésére.

## 3. Alkalmazás Architektúrája
Az alkalmazás egy szétválasztott (layered) architektúrára épül:
- **`app.js`**: Itt kerül konfigurálásra az Express.js alkalmazás, middleware-ek és itt kapcsoljuk be a különböző route-okat. Ennek a fájlnak a szétválasztásával biztosítjuk a tesztelhetőséget is (elkerülve portütközéseket).
- **`server.js`**: Az alkalmazás belépési pontja. Betölti az `app.js`-t, valamint elindítja a webszervert az aktív porton (`5001`), és egy próbát hajt végre (`testQuery()`) az adatbázis kapcsolattal.
- **`db.js`**: Az adatbázis kapcsolatot kezeli Connection Poolon keresztül.
- **`routes/`**: Modulárisan külön fájlokba lettek választva az egyes entitás végpontok (`vehicles.js`, `drivers.js`, stb.), hogy a rendszer struktúrált maradjon.
- **`middleware/auth.js`**: Az egyedi kérések hitelesítési mechanizmusa, token ellenőrzése.
- **`tests/`**: Szeparált mappa az egységtesztek számára (`vehicles.test.js`, `auth.test.js`). Itt mock adatbázisokat használunk (`__mocks__/db.js`), ezáltal elkerülve a valós relációs adatbázis interakcióit.

## 4. Telepítés és Futtatás (Setup)

### 4.1. Környezeti Változók (.env)
A root (fő) mappában el kell helyezni egy `.env` fájlt az adatbázis kapcsolatához és a titkosításhoz. Minta:
```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=titkos_jelszo
DB_NAME=flottakezelo_db
JWT_SECRET=super_secret_jwt_key
```

### 4.2. Adatbázis Importálása
A munka megkezdése előtt elengedhetetlen, hogy az adatbázis struktúra rendelkezésre álljon. A mappában található `flottakezelo_db_v2.sql` fájlt be kell importálni egy szabad MySQL serveren (pl. XAMPP vagy MySQL Workbench használata):
1. Hozd létre az adatbázist a szerveren: `CREATE DATABASE flottakezelo_db;`
2. Importáld az SQL parancsok tartalmát a futtatóba.

### 4.3. Csomagok Telepítése
A terminálban a mappa gyökerén futtatva telepíthető minden komponens:
```bash
npm install
```

### 4.4. A Szerver Indítása
Indítsd el a backend szervert:
```bash
node server.js
```
Sikeres kapcsolódás esetén ez a válasz fog feltűnni a konzolon:
> `Sikeres csatlakozás az adatbázishoz!`
> `A szerver fut az 5001 porton!`

## 5. API Végpontok

**Hitelesítés szükséges a legtöbbhöz!** (Bearer token a Header Authorization mezejében)
Az alábbi fő útvonalak érhetőek el CRUD operációkkal (GET, GET /:id, POST, PUT, DELETE):

* **`/api/auth`**: `POST /register`, `POST /login`, `GET /profile`
* **`/api/vehicles`**: Gépjárművek adatai (rendszám, típus, vizsgák lejárata)
* **`/api/drivers`**: Sofőr adatok (kibocsátási információk)
* **`/api/driver-assignments`**: Összerendelő tábla (melyik sofőr hajthatja az adott járműveket)
* **`/api/travel-logs`**: Menetlevelek / utazások (km óra állások kezelésével)
* **`/api/fuelings`**: Tankolások nyilvántartása
* **`/api/services`**: A szerelések fix ideje és a kapcsolódó jármű tábla
* **`/api/services-list`**: Szervíz specifikusan az elvégzett javítások listái 
* **`/api/users`**: Felhasználók (admin és driver role) kezelése

👉 *Ezek végpontos leírásai pontosan megtalálhatók a Postman fájlban.*

## 6. Postman Tesztelés
A kiadott `flottakezelo.postman_collection.json` fájl beimportálható a Postman rendszerébe:
1. Kattints felül az `Import` funkcióra a Postman kliensben.
2. Jelöld ki a JSON fájlt.
3. Importálás után az "Auth" -> "Login" híváson teszteld először a kapcsolódást adminként.
4. Ha sikeresen generál a belépés, a kliens környezet (Environment) automatikusan lementi a JSON-ből generálódó tokent `jwt_token` változóba, aminek hála automatikausk megkapod az összes többi Route jogosultságát.
5. Végpont paramétereit (pl base_url) a Postman Collection bal oldali fülén lévő, `Variables` rovatban tudod szerkeszteni.

## 7. Egységtesztek (Unit Tests) futtatása
A modul elszigetelt, belső tesztjei futtathatók az alábbi módon a konzolban:
```bash
npm test
```
Ez a folyamat lefuttatja a Jest-bázisú teszteket a `tests/` mappában, garantálva, hogy a belső logika megfelelően működjön. A futtató egy összegzést is listáz a teszt suite-ok lefutása után, amely kiterjed a várható 40x vagy 50x-es status hibák előlátó kezelésére vagy adatbázis hibaemulálására (ER_DUP_ENTRY handling mockolás).
