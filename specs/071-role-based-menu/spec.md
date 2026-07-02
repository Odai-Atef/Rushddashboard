# Feature Specification: Role-Based Navigation Menu

**Feature Branch**: `071-role-based-menu`  
**Created**: 2026-07-02  
**Status**: Draft  
**Input**: User description: "now lets implement the roles on the menu depending on the role slug for slug project-managers they can see the following menu items and access the pages of it 'قاعدة الجهات المانحة' 'إدارة المشاريع' 'التطابق الذكي مع المانحين' for the slug of entity-managers they can see and access only 'معلوماتي' 'تقييم الجاهزية' 'إدارة المشاريع'"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Project Manager Sees Relevant Menu (Priority: P1)

As a user assigned the `project-managers` role, I want the navigation menu to show only the items relevant to my work so that I can quickly access donor data, project management, and donor matching without distraction.

**Why this priority**: Project managers are a core user group, and directing them to their primary tools is the highest-value part of this feature.

**Independent Test**: A user with the `project-managers` role can log in and confirm that the menu contains only the three expected items and that each item leads to its page.

**Acceptance Scenarios**:

1. **Given** a user has the role slug `project-managers`, **When** they open the application menu, **Then** they see exactly the items 'قاعدة الجهات المانحة', 'إدارة المشاريع', and 'التطابق الذكي مع المانحين'.
2. **Given** a `project-managers` user sees a visible menu item, **When** they select it, **Then** they can access the corresponding page without receiving an access-denied message.
3. **Given** a `project-managers` user, **When** they inspect the menu, **Then** they do not see any menu item outside the three listed above.

---

### User Story 2 - Entity Manager Sees Relevant Menu (Priority: P2)

As a user assigned the `entity-managers` role, I want the navigation menu to show only my permitted items so that I can manage my entity information, readiness assessment, and projects without seeing unrelated options.

**Why this priority**: Entity managers are the second defined role in this feature; giving them a focused menu reduces confusion and protects unrelated functionality.

**Independent Test**: A user with the `entity-managers` role can log in and confirm that the menu contains only 'معلوماتي', 'تقييم الجاهزية', and 'إدارة المشاريع', and that each item opens its page.

**Acceptance Scenarios**:

1. **Given** a user has the role slug `entity-managers`, **When** they open the application menu, **Then** they see exactly the items 'معلوماتي', 'تقييم الجاهزية', and 'إدارة المشاريع'.
2. **Given** an `entity-managers` user sees a visible menu item, **When** they select it, **Then** they can access the corresponding page without receiving an access-denied message.
3. **Given** an `entity-managers` user, **When** they inspect the menu, **Then** they do not see any menu item outside the three listed above.

---

### User Story 3 - Menu Adapts When Role Changes (Priority: P3)

As an administrator or system process, when a user's role changes between `project-managers` and `entity-managers`, the navigation menu must update to reflect the new role's allowed items so that the user always has the correct access.

**Why this priority**: While important for correctness, this scenario occurs less frequently than daily navigation and can be verified independently.

**Independent Test**: Change a user's role slug and verify that the menu contents immediately reflect the new role after the next menu render.

**Acceptance Scenarios**:

1. **Given** a user initially has the `entity-managers` role, **When** their role is changed to `project-managers`, **Then** the menu updates to show the `project-managers` items and hides the `entity-managers`-only items.
2. **Given** a user initially has the `project-managers` role, **When** their role is changed to `entity-managers`, **Then** the menu updates to show the `entity-managers` items and hides the `project-managers`-only items.

---

### Edge Cases

- What happens when a user has no recognized role slug?  
  The system should fall back to a safe default, such as showing no menu items or showing only items explicitly allowed for all roles, and should not expose restricted pages.
- How does the system handle a user with multiple role slugs?  
  The system should combine the allowed items of all recognized role slugs without duplicates, unless business rules require using the highest-privilege or primary role only.
- What happens when a user tries to access a page directly via URL but the role slug does not include the corresponding menu item?  
  The system should deny access or redirect the user, ensuring that page access is consistent with menu visibility.
- What happens if a role slug is misspelled or not yet configured?  
  The system should treat it as unrecognized and apply the default fallback rather than crash or display all items.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST determine the current user's role slug before rendering the navigation menu.
- **FR-002**: For a user with the `project-managers` role slug, the system MUST display only the menu items 'قاعدة الجهات المانحة', 'إدارة المشاريع', and 'التطابق الذكي مع المانحين'.
- **FR-003**: For a user with the `entity-managers` role slug, the system MUST display only the menu items 'معلوماتي', 'تقييم الجاهزية', and 'إدارة المشاريع'.
- **FR-004**: Each visible menu item MUST allow the user to navigate to and access its corresponding page without an access-denied message.
- **FR-005**: Menu items not allowed for the current role slug MUST be hidden from the navigation menu.
- **FR-006**: If a user's role slug changes, the system MUST update the visible menu items to match the new role on the next menu render or session refresh.
- **FR-007**: The system MUST prevent direct URL access to pages that are not allowed for the current role slug, matching the menu visibility rules.

### Key Entities *(include if feature involves data)*

- **User Role**: Represents the role assigned to a user, identified by a `role slug` such as `project-managers` or `entity-managers`. A user may have one or more role slugs.
- **Menu Item**: Represents a single entry in the navigation menu. Each item has a display label (in Arabic) and an associated page or route that it points to.
- **Role-Menu Mapping**: Defines which menu items are visible and accessible for each role slug.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users see only menu items permitted by their role slug, with 100% accuracy for both `project-managers` and `entity-managers` roles.
- **SC-002**: Users can access each visible menu item's page successfully on the first attempt, measured by a successful navigation rate of at least 99%.
- **SC-003**: Users without a recognized role slug encounter no restricted pages or unauthorized menu items, achieving a 0% error rate for unauthorized menu exposure.
- **SC-004**: When a role slug changes, the menu reflects the new permissions within 5 seconds or by the next application interaction, whichever comes first.
- **SC-005**: Direct URL access to pages outside the user's role is blocked in 100% of tested cases.

## Assumptions

- The user's role slug is already available in the session or user profile by the time the menu is rendered.
- The two role slugs mentioned (`project-managers` and `entity-managers`) are the only roles requiring custom menu configuration for this feature.
- The Arabic labels provided by the user are the final display labels and do not need translation or localization changes for this release.
- A page is considered "accessible" if both the menu item is visible and the user can open the corresponding route without receiving an access-denied message.
- If a user has multiple role slugs, the union of allowed menu items is displayed by default.
