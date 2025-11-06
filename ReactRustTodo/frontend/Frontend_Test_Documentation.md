# Frontend Test Documentation

**Autor: Ronny Bruhin**

## Applikationsbeschreibung

Dies ist die Frontend-Applikation für die Todo-App. Sie wurde mit **React** und **TypeScript** umgesetzt und verwendet folgende Technologien:

- [React](https://react.dev/) - UI-Framework
- [TypeScript](https://www.typescriptlang.org/) - Type-Safe JavaScript
- [Vite](https://vitejs.dev/) - Build-Tool und Dev-Server
- [Material-UI](https://mui.com/) - UI-Komponenten-Bibliothek
- [Axios](https://axios-http.com/) - HTTP-Client

## Aufsetzen der Testumgebung

Die Testumgebung wurde mit folgenden Tools konfiguriert:

### Jest (Unit & Component Tests)
- **Jest** als Test-Runner mit jsdom für DOM-Simulation
- **React Testing Library** für Komponententests
- **@testing-library/jest-dom** für erweiterte DOM-Assertions

**Konfiguration:** `jest.config.cjs`, `jest.setup.ts`

### Playwright (E2E Tests)
- **Playwright** für End-to-End Tests in echten Browsern
- Tests laufen in Chromium, Firefox und WebKit
- Backend wird für E2E-Tests automatisch gestartet

**Konfiguration:** `playwright.config.ts`

## Zusammenfassung der Tests

### Unit Tests (Controller)
**Datei:** `tests/jest/unit/Controller.test.ts`
- HTTP-Request-Funktionen mit gemocktem Axios
- Korrekte URL-Bildung und Request-Bodies
- Fehlerbehandlung und Error-Propagation

### Unit Tests (Components)
**Datei:** `tests/jest/unit/BoxProvider.test.tsx`
- Rendering und Props von Wrapper-Komponenten

### Component Tests
**Dateien:** `tests/jest/component/*.test.tsx`

#### App.test.tsx
- Health-Check erfolg und Fehlerszenarien
- Unerwartete JSON-Responses
- Initialer Fehlerzustand

#### Todos.test.tsx
- Rendering der Todo-Liste
- Leerzustand bei 0 Todos
- Löschen-Funktion
- Status-Wechsel (completed/uncompleted)
- Pagination mit First/Last Buttons
- Edge Cases: genau 1 Seite, mehrere Seiten

#### CreateTodoModal.test.tsx
- Öffnen und Schließen des Modals
- Submit-Funktion
- Loading-State während Request
- Fehlerbehandlung
- Reset nach erfolgreichem Submit

#### EditModal.test.tsx
- Vorausgefüllte Felder
- Update-Funktion inkl. unveränderlicher Felder
- Loading-State
- Reset nach Update

### Integration Tests (Jest)
**Datei:** `tests/jest/integration/todos.flow.test.tsx`
- Platzhalter für komplette User-Flow Tests
- Kann zu realistischem Flow-Test ausgebaut werden

### End-to-End Tests (Playwright)
**Datei:** `tests/playwright/tests/todos.spec.ts`
- Vollständige User-Journeys mit Backend-Integration
- Erstellen, Anzeigen, Editieren, Löschen von Todos
- Tests in Chromium, Firefox und WebKit

## Test-Strategie

### Mocking
- **Axios:** Jest-Mock für HTTP-Requests in Unit/Component Tests
- **Backend:** Playwright startet echtes Backend für E2E-Tests
- **Komponenten:** Selektives Mocking von Child-Components bei Bedarf

### Test-Daten
- Fixtures in `tests/jest/fixtures/` für realistische Test-Szenarien
- Verschiedene Datenmengen: 0, 2, 15, 25 Todos
- Edge Cases: Unicode, Sonderzeichen, lange Texte

### Coverage-Ziel
- **Ziel:** ≥80% Code Coverage (konfiguriert in `codecov.yml`)
- **Messung:** Jest Coverage Report → Codecov mit Flag `frontend`
- **CI/CD:** Automatische Coverage-Upload bei jedem Push/PR

## CI/CD Integration

### GitHub Actions Workflow
**Datei:** `.github/workflows/frontend.yml`

#### Jest Job
1. Backend kompilieren und starten
2. Frontend Dependencies installieren
3. Jest Tests mit Coverage ausführen
4. Coverage zu Codecov hochladen (Flag: `frontend`)
5. Backend stoppen

#### Playwright Job
1. Backend und Frontend starten
2. Playwright installieren (mit Browser-Dependencies)
3. E2E-Tests in allen Browsern ausführen
4. Beide Prozesse beenden

## Test-Ausführung

### Lokal

```bash
# Unit & Component Tests (Jest)
npm test

# Mit Coverage
npm run test:cov

# E2E Tests (Playwright)
npm run playwright

# Playwright UI Mode
npx playwright test --ui
```

### CI/CD
Tests werden automatisch bei jedem Push und Pull Request ausgeführt.

## Erkenntnisse und Best Practices

### Was gut funktioniert
- **React Testing Library:** Fokus auf Benutzerinteraktionen statt Implementation-Details
- **Playwright:** Zuverlässige E2E-Tests über mehrere Browser
- **Coverage-Tracking:** Codecov-Integration zeigt Trends und kritische Bereiche
- **Mock-Strategie:** Klare Trennung zwischen Unit (gemockt) und E2E (real)

### Lessons Learned
- **Semantic Queries bevorzugen:** `getByRole`, `getByLabelText` statt `getByTestId`
- **Fixtures nutzen:** Wiederverwendbare Testdaten reduzieren Duplikation
- **Loading States testen:** Wichtig für UX, oft vergessen
- **Error Paths wichtig:** Fehlerszenarien sind kritisch für Robustheit

## Wartung

Bei neuen Features:
1. **Component Tests:** Render, Events, Error Paths
2. **Controller Tests:** Falls neue API-Calls hinzukommen
3. **E2E Tests:** Für kritische User-Journeys
4. **Coverage prüfen:** Ziel 80% einhalten