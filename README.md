# React Team Project 🚀

## 👥 Team Members

- Abdullah
- Mostafa
- Ghehad
- Rehab
- Heba

---

## 📌 About the Project

This is our collaborative React project as part of the MEARN track.  
The repo is organized so that each team member can contribute without conflicts.

---

## ⚙️ Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/USERNAME/react-team-project.git
   cd react-team-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

---

## 🌿 Branching Rules

- **Never push directly to `main`.**
- Each member works on their own branch:
  - `abd-<feature>` → Abdullah
  - `mos-<feature>` → Mostafa
  - `geh-<feature>` → Ghehad
  - `reh-<feature>` → Rehab
  - `heb-<feature>` → Heba

Example:

```bash
git checkout -b abd-navbar
```

---

## 📌 Daily Workflow (For Everyone)

1. Pull the latest changes from `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Switch to your branch (or create a new one if needed):
   ```bash
   git checkout abd-featureX
   ```
3. Do your coding, then stage & commit changes:
   ```bash
   git add .
   git commit -m "abd: added navbar component"
   ```
4. Push your branch:
   ```bash
   git push origin abd-featureX
   ```
5. Open a **Pull Request (PR)** on GitHub.
6. Wait for review before merging into `main`.

---

## ✅ Commit Message Rules

- Start with your prefix (`abd:`, `mos:`, `geh:`, `reh:`, `heb:`).
- Use short, clear messages.
  - Example:
    - `abd: fixed login bug`
    - `mos: added footer component`

---

## 🎨 CSS & JS Naming Rules

- Use your **3-letter prefix** for any variable, function, or CSS class.
  - Example:
    - CSS: `.abd-navbar`, `.mos-footer`
    - JS: `abd_handleLogin()`, `geh_isValid()`

---

## 🔄 Pull Request & Review

- Always open a PR to merge into `main`.
- At least **1 review** from another teammate before merging.
- If conflict happens → the branch owner fixes it before merge.

---

## 🛑 Important Notes

- `main` branch = always stable & working.
- Do not merge code that is broken or incomplete.
- Communicate with the team before making big changes.

---

Happy Coding 💻✨
