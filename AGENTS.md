<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:
specs/071-role-based-menu/plan.md
<!-- SPECKIT END -->

## UI Policy

Avoid native browser dialogs (`window.confirm`, `window.alert`, `window.prompt`)
 anywhere in the application. Use the platform's custom `useConfirm` hook and
 `ConfirmDialog` component so confirmations match the design system and RTL
 Arabic UI.
