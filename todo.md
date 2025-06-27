# ORG WEBSITE

NJSIG's website is a great resource for information about the organization, including its mission, values, and history. The website also provides information about upcoming events, training opportunities, and resources for educators. You can find the website at [NJSIG](https://www.njsig.org/).

### TASKS

- [ ] Access Controls
  - [ ] Add Authenticated and Role (TBD) Control
- [ ] Add fields to User Collection
- [ ] Customize Admin Panel
  - [ ] Add Logo
  - [ ] Add Favicon
  - [ ] Customize Colors
- [ ] Customize Login Page
- [ ] Main Nav Click Trigger Bug (see @globals/Header/components/navigation-menu.tsx)
- [ ] Main nav icon FOUC (Flash of Unstyled Content) (see @globals/Header/components/navigation-menu.tsx)
- [ ] Review how open graph generation functions interact with meta information from the SEO plugin (like the site name appended to the title)
- [ ] Previews for global elements
- [ ] Slug field unlock button styles
- [ ] Update hero spinner markup/styles for very large screens (max content width for buttons and text?)
- [ ] Revisit actions for build and deploy on multiple environments
- [ ] Revisit breakpoints for section padding and column visibility, there is a disconnect between the two

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
