# Flottakezelő API - Tesztelési Dokumentáció

Ez a dokumentum bemutatja az alkalmazáshoz használt tesztelési stratégiát, az egységtesztek felépítését és a manuális AP tesztelés mikéntjét a Postman használatával.

## 1. Tesztelési Stratégiák
A flottakezelő rendszernél kétlépcsős tesztelést alkalmazunk:
1. **Egység- és API Végpont Tesztek (Unit Tests):** A logikai kód (keresés, iterálás) és az Express útvonalak működésének tesztelése, izoláltan, mock adatbázis használatával.
2. **Kézi Integritási Teszt (Postman):** Élő szerver esetén a tényleges adatok validálása és szerver válaszok kézi tesztelése az előre definiált *Postman Collection* segítségével.

---

## 2. Egységtesztek (Unit / Integration Tests) - `src/tests`

Az egységtesztekhez az alábbi könyvtárakat használjuk:
- **Jest**: A tesztek futtatására, ellenőrzésre (expect) és függőségek (db.js, bcrypt) mockolására.
- **Supertest**: Az Express szerver (app.js) virtuális indítására hálózati port foglalása nélkül.

### A tesztek felépítése
A tesztfájlok a projekt gyökérmappában a `tests/` könyvtárban helyezkednek el, véghozzárendelésük `.test.js` kiterjesztésű (pl.: `vehicles.test.js`). 

#### Függőségek izzítása (Mocking)
Hogy az élő MariaDB/MySQL adatbázist megvédjük a szemeteléstől, a lekérdezéseket ideiglenes felülírási sémákra cseréljük:
> Ennek helye: `__mocks__/db.js` és `__mocks__/middleware/auth.js`

Gyakorlatban a tesztek elindításánál a `db.query` sose ér el egy valós szervert. Ehelyett így szimuláljuk az adatbázis kimenetét a jest-ben:
```javascript
jest.mock('../db');
const db = require('../db');

// Például egy GET kérés sikeres visszaadására:
db.query.mockResolvedValue([ [ { id: 1, name: "Teszt Jármű" } ] ]);
```

### Tesztek Futtatása
A tesztek futtatásához ki kell adni a következő parancsot a terminálban:
```bash
npm test
```
**Amit ez a keretrendszer vizsgál a futás alatt:**
1. Helyes státuszkódokat adnak-e a végpontok `(200 OK, 201 Created, 404 Not Found, 401 Unauthorized stb.)`.
2. A belépés gátló (JWT middleware) megfelelően engedi, vagy tiltja-e a forgalmat.
3. Helyesek-e azok a formázott kivételek (try/catch handling), amikor az adatbázis hibát ad vissza pl. DUPLICATE ENTRY a felhasználó regisztrációjakor.

---

## 3. Manuális Rendszertesztelés (Postman)

Ha a szerver valós időben fut (`node server.js`), szükség van manuális interakciós tesztelésre is.
A projekt tartalmaz egy **`flottakezelo.postman_collection.json`** nevű fájlt, amit kifejezetten erre a célra generáltunk.

### Beállítás Lépései:
1. **Importálás Postman-be**: Fogd meg a `flottakezelo.postman_collection.json` fájlt, és húzd be a Postman alkalmazásba (vagy File -> Import).
2. **Környezet (Variables)**: Az importálás után létrejön a bal oldalon egy `Flottakezelő API` című mappa. Ennek a mappának a `Variables` fülére kattintva látszódik a `base_url`, mely default-ként `http://localhost:5001`-re mutat.
3. **Bejelentkezés Automatizációja**:
    - Nyisd le az `Auth` > `Login` kérést, majd kattints a `Send` gombra.
    - Ha a bejelentkezés végbement, egy háttér script *(Tests script a Postmanben)* **automatikusan kitölti a JWT Token változót**, így ezt soha többé nem kell neked másolgatni és beilleszteni fejlécekbe manuálisan!
    - Ezt az öröklést megtekintheted, ha rákattintasz a fő Collection "Auth" fülére, ott a Type: Bearer Token, a mezőbe pedig a `{{jwt_token}}` változó van illesztve.

### Végpontokat érintő tesztek
Kész teszt testek (Test Requests) lettek beírva minden adatbázis táblához (Sofőrök, Járművek, Szervizek, Tankolás). A `POST` / `PUT` kéréseket hajtva azonnal megfigyelhető az adatbázis változás.

### Hibakeresés
Bármelyik 500-as API hiba esetén mindig tekintsd meg a projektkonzolt (Terminal log), ahol a `console.error` kimenete pontos okot formáz ("Hiba a tankolás hozzáadásakor...").
