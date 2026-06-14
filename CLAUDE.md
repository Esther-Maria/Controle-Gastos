# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal finance / expense tracking application (Controle de Gastos) currently in the **pre-development phase** — no code exists yet. The repository contains source data and design references.

## Repository Contents

### `data/`
- **`Controle de gastos.xlsx`** — Main expense tracking spreadsheet (monthly income, expenses, investments).
- **`Controle de gastos - Parcelamentos.csv`** — Installment (parcelamento) tracker. Columns: `Descrição`, `Valor Total (R$)`, `Nº Parcelas`, `1ª Parcela (mês)`, `Valor/Parcela (R$)`, `Forma de Pagamento`, then one column per month (Janeiro–Dezembro). Footer rows aggregate totals: total per month, card total (already on statement), and out-of-card total (to add manually to expenses).

### `design-system/`
Design reference images for the intended UI:
- **`exemplo.png`** — Desktop dashboard mockup. Dark theme with green accent. Three top-level sections: **Receitas** (income), **Despesas** (expenses), **Investimento** (investments). Shows a monthly summary panel with budget vs. actual, a donut chart for income breakdown, and a line/bar chart for expense categories.
- **`exemplo-2.png`** — Mobile app mockup. Budget tracking per category (Alimentação, Educação, Lazer, etc.) with Meta/Valor Gasto/Previsto and percentage bars. Second screen shows pie chart of despesas por categoria and a balance line chart.
- **`exemplo-3.avif`** — Additional design reference (finance app UI).

## Domain Model (from existing data)

**Expense categories** visible in the CSV: streaming, music, internet, gym (academia), installment purchases from clothing stores and appliances.

**Payment methods** tracked: Santander (card), Nubank (card), Pix, Boleto.

**Key computed fields for installments:**
- `Valor/Parcela = Valor Total / Nº Parcelas`
- Monthly totals split into: card total (feeds statement automatically) and non-card total (added manually to general expenses).

## Design Intent

- Language: **Portuguese (Brazilian)**
- Currency: **BRL (R$)**
- The app covers three financial pillars: Receitas, Despesas, Investimento
- Navigation model: monthly view with forward/backward navigation
- Both desktop (dashboard) and mobile (budget tracker) UIs are referenced
