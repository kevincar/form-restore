# AGENTS.md

## Setup commands
- Install deps: `npm install`
- Start dev server: `npm dev`
- Run tests: `npm test`

## Code style
- TypeScript strict mode
- Double quotes, all semicolons
- Use functional patterns where possible

## Development
- All functions and classes should be paired with a test to validate
  expectations and assumptions

## Project Overview

Web browser extension for both Microsoft Edge and Google Chrome aimed
a creating temporary saved information when filling out modals. Ideally, this
should create browser icon extension that when clicked shows recently saved
data relevant to the current page and modal. The extension should log all
changes on the website and save the data locally in a JSON format. The The
level of keys can be the current URL, the second level of keys can be the name
of the Modal, then the objects deep to that can be simply any form data, where
the keys relate to form ID. This way, when the icon extension is clicked, the
pop up can show if there is any saved data. A "Show Restored Data" button
within the popup window will initialize a "restore" state, during which
form fields with restorable data are highlighted. When a specific form is
clicked on, it will restore the data. The button in the pop up, during the
restored state, will read "cancel" in order to return to the normal state. 
