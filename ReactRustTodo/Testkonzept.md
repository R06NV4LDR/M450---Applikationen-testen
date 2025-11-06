# Testkonzept ReactRustTodo

*Nach IEEE 829 Standard*

## Einleitung

ReactRustTodo ist eine einfache Todo-Anwendung mit einem **Rust Backend** (Actix-Web Framework) und einem **React Frontend** (TypeScript, Vite). Die Anwendung ermöglicht es Benutzern, Todo-Einträge zu erstellen, anzuzeigen, zu bearbeiten und zu löschen. Das Backend stellt eine REST-API bereit, die mit einer MySQL-Datenbank über Diesel ORM kommuniziert. Das Frontend nutzt Material-UI Komponenten und Zustand-Management für die Benutzeroberfläche.

## Test Items

Die folgenden Komponenten und Module werden getestet:

### Backend (Rust/Actix-Web)
- **API-Endpunkte** (`/api/todos/*`, `/health`)
- **Datenmodelle** (`Todo`, `NewTodo`)
- **Datenbankschicht** (Diesel ORM, MySQL-Verbindung)
- **HTTP-Server** (Actix-Web, CORS-Konfiguration)
- **Repository-Pattern** (Database-Abstraktion)

### Frontend (React/TypeScript)
- **React-Komponenten** (App, Todos, CreateTodoModal, EditModal)
- **HTTP-Client** (Axios für API-Kommunikation)
- **State Management** (Zustand Store)
- **UI-Bibliotheken** (Material-UI Integration)

### Integration
- **Frontend-Backend Kommunikation** (HTTP REST API)
- **Datenbank-Integration** (Diesel Migrations)
- **CORS-Konfiguration** (Cross-Origin Requests)

## Features to be tested

### Backend Features
1. **Health Check** - `/health` Endpunkt Verfügbarkeit
2. **CRUD Operationen für Todos**:
   - `POST /api/todos` - Todo erstellen
   - `GET /api/todos` - Alle Todos abrufen
   - `GET /api/todos/{id}` - Einzelnes Todo abrufen
   - `PUT /api/todos/{id}` - Todo aktualisieren
   - `DELETE /api/todos/{id}` - Todo löschen
3. **Datenbankoperationen** - CRUD mit MySQL über Diesel
4. **Fehlerbehandlung** - 404 für unbekannte Endpunkte
5. **CORS-Unterstützung** - Cross-Origin Requests von Frontend

### Frontend Features
1. **Komponentenrendering** - Korrekte Anzeige aller UI-Komponenten
2. **API-Integration** - HTTP-Requests an Backend-Endpunkte
3. **State Management** - Todo-Zustand über Zustand Store
4. **Formularvalidierung** - Eingabevalidierung für Todo-Erstellung/-Bearbeitung
5. **Benutzerinteraktionen** - CRUD-Operationen über UI

### End-to-End Features
1. **Vollständiger Todo-Workflow** - Erstellen, Anzeigen, Bearbeiten, Löschen
2. **Error Handling** - Frontend-Reaktion auf Backend-Fehler
3. **Datenbank-Persistierung** - Daten bleiben nach Server-Neustart erhalten

## Features not to be tested

- **Performance/Load Testing** - Nicht im Scope dieses Projekts
- **Security Testing** - Keine Authentifizierung/Autorisierung implementiert
- **Browser-Kompatibilität** - Entwicklung nur für moderne Browser
- **Mobile Responsiveness** - Desktop-fokussierte Anwendung
- **Deployment-Prozesse** - Nur lokale Entwicklungsumgebung

## Approach

### Testmethoden

1. **Unit Tests (Backend)**
   - Rust-native `#[cfg(test)]` Module für Modelle und Repository-Funktionen
   - Mockable Database-Layer für isolierte Tests

2. **Integration Tests (Backend)**
   - HTTP-Endpunkt Tests mit Testdatenbank
   - Diesel Migration Tests

3. **Unit Tests (Frontend)**
   - React Testing Library für Komponententests
   - Jest für JavaScript/TypeScript Unit Tests

4. **End-to-End Tests**
   - Manuelle Tests der kompletten User Journeys
   - API-Tests mit Tools wie Postman/curl

### Testvorgehen

#### Test-Later Development (TLD) für ReactRustTodo
Für dieses bestehende Projekt wurden Tests nach der Code-Implementierung geschrieben, da die Codebasis bereits vollständig vorhanden war.
1. Minimale Implementierung 
2. Refactoring 
3. Testing

**Begründung:** ReactRustTodo dient als Referenzprojekt zur Demonstration verschiedener Testarten und -techniken. Eine nachträgliche Implementierung der Tests war hier sinnvoll.

#### Test Driven Development (TDD) - Separates Lernprojekt
Um TDD-Praktiken zu erlernen und anzuwenden, wurde ein **separates kleineres Projekt** durchgeführt, bei dem der klassische TDD-Zyklus konsequent eingehalten wurde:

1. **Red** - Test schreiben (schlägt zunächst fehl)
2. **Green** - Minimale Implementierung für erfolgreichen Test
3. **Refactor** - Code verbessern bei grünen Tests

**Grund für separates Projekt:** Um die bestehende, funktionierende Codebasis von ReactRustTodo nicht zu gefährden und TDD in einem kontrollierten Umfeld zu üben.

**Dokumentation TDD-Projekt:** [TDD Projekt Referenz](./TDD_Projekt_Referenz.md)

### Code Reviews und Qualitätssicherung

#### Vier-Augen-Prinzip mit Pull Requests

Alle wesentlichen Code-Änderungen wurden im Team nach dem **Vier-Augen-Prinzip** durchgeführt:

**Primäre Methode: GitHub Pull Requests**
- Formeller Review-Prozess über GitHub PRs
- Pull Requests wurden erstellt, reviewt und gemergt
- Review-Kommentare und Diskussionen dokumentiert
- CI/CD automatisch ausgeführt vor Merge
- Nachweis: [GitHub Pull Requests](https://github.com/R06NV4LDR/M450---Applikationen-testen/pulls?q=is%3Apr)

**Ergänzend: Synchrone Code Reviews**
- Direktes Pair-Programming bei komplexen Features
- Gemeinsame Code-Besprechungen für schnelle Iteration

- **Review-Fokus**:
  - Code-Qualität und Clean Code Prinzipien
  - Testabdeckung und Testqualität
  - Fehlerbehandlung und Edge Cases
  - Dokumentation und Kommentare

**Vorgehensweise:**
1. Feature-Branch erstellen und implementieren
2. Pull Request mit Beschreibung erstellen
3. Review durch Teammate (Kommentare, Requested Changes)
4. Anpassungen umsetzen und pushen
5. Approval nach erfolgreichem Review
6. Merge nach grüner CI/CD Pipeline

**Begründung:** Pull Requests bieten Nachvollziehbarkeit und formelle Dokumentation, während synchrone Reviews bei komplexen Themen schnellere Iterationen ermöglichen.

**Dokumentation:** [Detaillierte Code Review Dokumentation](./Code_Review_Dokumentation.md)

## Item pass / fail criteria

### Erfolgskriterien
- **Backend API**: HTTP 200 für erfolgreiche Operationen
- **Frontend**: Komponenten rendern ohne React-Fehler
- **Datenbank**: CRUD-Operationen erfolgreich ausgeführt
- **Integration**: Frontend kann Backend erreichen und Daten austauschen

### Fehlklassifikation

#### Geringfügige Fehler (Minor)
- UI-Styling-Probleme ohne Funktionsverlust
- Kleine Validierungsfehler
- Nicht-kritische Console-Warnings

#### Mittelschwere Fehler (Major)
- API-Endpunkte geben falsche HTTP-Statuscodes zurück
- Formulardaten werden nicht korrekt verarbeitet
- State Management funktioniert inkonsistent

#### Schwerwiegende Fehler (Critical)
- Server startet nicht (Port-Konflikte, DB-Verbindung)
- Frontend rendert nicht (Build-Fehler, JS-Exceptions)
- Datenbank-Migrations schlagen fehl
- Kompletter Funktionsverlust einer Feature

## Test Deliverables

### Artefakte
- **Testkonzept** (dieses Dokument)
- **Test Cases** (siehe "Test Todos.md")
- **Test Reports** - Ergebnisdokumentation pro Testlauf
- **Bug Reports** - Strukturierte Fehlerdokumentation

### Werkzeuge
- **Backend Testing**: Rust `cargo test`,curl für API-Tests
- **Frontend Testing**: Jest, React Testing Library, ESLint
- **Database Testing**: Diesel CLI für Migrations
- **Manual Testing**: Browser DevTools, Postman

## Testing Tasks

### Teststufen

1. **Unit Testing**
   - Backend: Rust Modelle und Repository-Funktionen testen
   - Frontend: React Komponenten isoliert testen

2. **Integration Testing**
   - Backend: API-Endpunkte mit Test-Datenbank
   - Frontend: Komponenten-Integration und API-Calls

3. **System Testing**
   - End-to-End Workflows über komplette Anwendung
   - Cross-Browser Testing (falls erforderlich)

4. **Acceptance Testing**
   - Manuelle Verifikation aller User Stories
   - Performance-Grundlagen (Response-Zeiten)

## Environmental Needs

### Hardware
- **Entwicklungsrechner**: Minimum 8GB RAM, Mehrkern-Prozessor
- **Netzwerk**: Localhost-Verbindung für Frontend-Backend Kommunikation

### Software
- **Backend**:
  - Rust (Edition 2021)
  - MySQL Server
  - Diesel CLI
- **Frontend**:
  - Node.js (LTS Version)
  - NPM/Yarn Package Manager
  - Modern Browser (Chrome/Firefox)

### Test-Datenbank
- **Separate Test-DB**: Isoliert von Entwicklungsdatenbank
- **In-Memory Option**: Für schnelle Unit Tests
- **Migration Reset**: Saubere Datenbank für jeden Testlauf

## Schedule

### Zeitplan

| Phase | Zeitraum | Aktivitäten |
|-------|----------|-------------|
| **Test Setup** | Woche 1 | Test-Infrastruktur einrichten, Test-DB konfigurieren |
| **Unit Tests** | Woche 2 | Backend Modelle/Repository, Frontend Komponenten |
| **Integration Tests** | Woche 3 | API-Endpunkt Tests, Frontend-Backend Integration |
| **System Tests** | Woche 4 | End-to-End Workflows, Bug Fixing |
| **Documentation** | Ende Woche 4 | Test Reports, Final Documentation |

## Frontend Testkonzept (React/TypeScript)

### Zielsetzung und Scope
- Absicherung der UI‑Komponenten, Interaktionen und des HTTP‑Layers gemäss bestehender Implementierung.
- Abdeckung der wichtigsten Nutzerflüsse (CRUD) sowie Fehler‑ und Leerzustände.
- Zielabdeckung: ≥ 80% (Codecov Flag „frontend“), vgl. `codecov.yml`.

### Testumgebung und Werkzeuge
- Test Runner: Jest mit `jsdom` (Konfig: `ReactRustTodo/frontend/jest.config.cjs`).
- UI‑Tests: React Testing Library + `@testing-library/jest-dom` (Setup: `ReactRustTodo/frontend/jest.setup.ts`).
- HTTP‑Mocks: `jest.mock('axios')` für den Controller sowie `global.fetch` für Fetch‑basierte Pfade.
- E2E: Playwright mit Vite Dev‑Server (Konfig: `ReactRustTodo/frontend/playwright.config.ts`).
- CI: `.github/workflows/frontend.yml` führt Jest (inkl. Coverage) und Playwright aus und lädt Coverage zu Codecov (Flag `frontend`).

### Testarten und -ebenen
- Unit (Logik)
  - Controller (Axios‑Layer): Korrekte URLs/Bodies und Fehlerpropagation (`ReactRustTodo/frontend/tests/jest/unit/Controller.test.ts`).
  - Presentational Wrapper: `BoxProvider` Rendering/Props (`ReactRustTodo/frontend/tests/jest/unit/BoxProvider.test.tsx`).
- Component (isoliert)
  - `App`: Health‑Check OK/Fehler/Unexpected JSON, initialer Fehlerzustand (`ReactRustTodo/frontend/tests/jest/component/App.test.tsx`).
  - `Todos`: Rendern, Leerzustand, Löschen, Statuswechsel, Pagination inkl. First/Last (`ReactRustTodo/frontend/tests/jest/component/Todos.test.tsx`).
  - `CreateTodoModal`: Öffnen/Schliessen, Submit, Loading, Fehlerpfad, Reset (`ReactRustTodo/frontend/tests/jest/component/CreateTodoModal.test.tsx`).
  - `EditModal`: Vorausgefüllt, Update inkl. unveränderlicher Felder, Loading, Reset (`ReactRustTodo/frontend/tests/jest/component/EditModal.test.tsx`).
- Integration (Jest)
  - Platzhalter vorhanden (`ReactRustTodo/frontend/tests/jest/integration/todos.flow.test.tsx`) – kann zu realem Flow‑Test ausgebaut werden.
- End‑to‑End (Playwright)
  - Nutzerjourneys mit gemockten Backend‑Routen: Rendern/Erstellen/Edieren/Löschen (`ReactRustTodo/frontend/tests/playwright/tests/todos.spec.ts`).
  - Zusätzliche Smoke/Beispiele (`ReactRustTodo/frontend/tests/playwright/tests/example.spec.ts`).

Hinweis: Ein dedizierter globaler Zustand‑Store (z. B. Zustand) ist im aktuellen Code nicht im Einsatz; getestet wird komponenteninterner React‑State und der HTTP‑Controller.

### Mocking‑ und Testdaten‑Strategie
- Netzwerk
  - Axios wird mittels `jest.mock('axios')` gestubbt; `fetch` wird in Tests als `global.fetch = jest.fn()` ersetzt.
  - Fehlerpfade (HTTP non‑OK, Exceptions, unerwartetes JSON) werden simuliert und UI‑Reaktion verifiziert.
- Komponenten/Module
  - Teure/irrelevante Kind‑Komponenten werden bei Bedarf gemockt (z. B. `Todos` innerhalb `App.test.tsx`).
- Fixtures
  - Realistische Todo‑Objekte/Listen (0, 2, 15, 25 Einträge) für Pagination‑ und Edge‑Cases (`tests/jest/fixtures`).

### Frontend‑spezifische Abnahmekriterien

- UI zeigt konsistente Zustände (Loading/Success/Error) abhängig von API‑Antworten.
- Benutzeraktionen erzeugen erwartete Effekte (CRUD) und passende Aufrufe im Controller.
- Pagination ist deterministisch und zeigt die erwartete Anzahl Einträge pro Seite.
- Keine ungefangenen Exceptions/React‑Fehler im Renderpfad der getesteten Komponenten.

### Metriken und Coverage
- Jest Coverage via `npm run test:cov`, Artefakt: `ReactRustTodo/frontend/coverage/lcov.info`.
- Codecov‑Flag `frontend` mit Zielwert 80% und Toleranz 2% (`codecov.yml`).

### CI/CD‑Integration (Frontend)
- Workflow `frontend.yml`:
  - Job „Jest“: Install, `npm run test:cov`, Upload Coverage (Flag `frontend`).
  - Job „Playwright“: Start Backend/Frontend, führe E2E in Chromium/Firefox/WebKit aus; Prozesse werden anschliessend beendet.

### Wartung und Weiterentwicklung
- Neue Komponenten erhalten Component‑Tests (Render, Events, Fehlerpfade) und ggf. ergänzende Controller‑Unit‑Tests.
- Regressions reproduzierbar machen und als Tests fixieren; Snapshots sparsam einsetzen.
- Testdaten konsolidieren (Fixtures/Factories), semantische Queries (`getByRole`, `getByLabelText`) bevorzugen.
