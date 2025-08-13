# ORG WEBSITE

NJSIG's website is a great resource for information about the organization, including its mission, values, and history. The website also provides information about upcoming events, training opportunities, and resources for educators. You can find the website at [NJSIG](https://www.njsig.org/).

### TASKS

- [ ] Main Nav Click Trigger Bug (see @globals/Header/components/navigation-menu.tsx)
- [ ] Main nav icon FOUC (Flash of Unstyled Content) (see @globals/Header/components/navigation-menu.tsx)
- [ ] Review how open graph generation functions interact with meta information from the SEO plugin (like the site name appended to the title)
- [ ] Update hero spinner markup/styles for very large screens (max content width for buttons and text?)
- [ ] Revisit actions for build and deploy on multiple environments
- [ ] Revisit breakpoints for section padding and column visibility, there is a disconnect between the two
- [ ] Tracking an issue with polymorphic join fields, see https://github.com/payloadcms/payload/issues/12913
- [ ] Lint `:root` styles in `styles.css` to remove unused variables from Shadcn UI
- [ ] Deep dive into `overrideAccess` and why it was causing issues loading events in the event cards block

### Post MVP Features

- [ ] Customize Admin Panel
  - [ ] Add Logo
  - [ ] Add Favicon
  - [ ] Customize Colors
- [ ] Customize Login Page
- [ ] Previews for global elements
- [ ] Add to calendar functionality for events
- [ ] Event mailing lists

### COMPLETED TASKS ✔

- [x] Dynamic Page Routes
- [x] Icon Picker Component
- [x] Global Elements
  - [x] Header
  - [x] Footer
- [x] Base Layout
- [x] Conditional Blocks (https://github.com/payloadcms/payload/discussions/7064#discussioncomment-11829476)
- [x] Expecting change to how folders are enabled on collections, keep an eye on release notes and update when available
- [x] Revisit blur hash creation and decoding, see blurred.dev
- [x] Changing templates hides unavailable blocks but they remain in the data, unavailable blocks should be removed by a hook when the template change is saved.
- [x] Access Controls
  - [x] Add Authenticated and Role (TBD) Control
- [x] Add fields to User Collection
- [x] Slug field unlock button styles
- [x] Rework pattern field to match style of other custom fields
- [x] Revisit the `uiMap` field, getting data from the location relationship field is not working as expected, we may need to query the location by ID either using a server component and the local API or with the REST API
- [x] Add a generate title hook for the documents collection
- [x] Add a documents section to events, documents may be relationships to the documents collection, media collection, or an external link
- [x] Update slug creation to account for `-` characters
