## 1. Update legal pages and site config
- [x] 1.1 Update `config/site.ts`: change WhatsApp link to `https://wa.me/5511944434123`, add `email` and `phone` fields
- [x] 1.2 Update Terms of Use (`termos/page.tsx`): remove section 5 (Payments), update section 2 to reflect free service, update contact email to `app.teachei.shop@gmail.com`
- [x] 1.3 Update Privacy Policy (`privacidade/page.tsx`): update contact email to `app.teachei.shop@gmail.com`

## 2. Create contact page and update navigation
- [x] 2.1 Create `/contato` page (`app/(main)/contato/page.tsx`) with direct links for phone (WhatsApp), email (mailto), and Instagram — styled consistently with the site's card/surface pattern
- [x] 2.2 Update Footer component: replace `/suporte` link with `/contato` ("Fale Conosco")
- [x] 2.3 Update Landing page footer: replace `/suporte` link with `/contato` ("Fale Conosco")
- [x] 2.4 Add contact icon link to Header (Headphones icon) next to right actions, linking to `/contato`

## 3. Improve feed search visibility
- [x] 3.1 Update Header component: center the search input in the header with increased `max-w-xl` and `mx-auto` centered layout
- [x] 3.2 Fix SearchInput navigation: change from `/?search=...` to `/feed?search=...` so searches go to the feed

## 4. Add city/UF filter to feed
- [x] 4.1 Backend: Add `localizacoes` (list of `{cidade, estado}`) to `FiltrosDisponiveisResponse`
- [x] 4.2 Backend: Aggregate distinct city/state pairs from active intentions in `BuscarFiltrosDisponiveisUseCaseImpl`
- [x] 4.3 Frontend types: Add `cidade` and `estado` to `IntentionFilters` and add `localizacoes` to `AvailableFilters`
- [x] 4.4 Frontend API: Add `cidade`/`estado` params to `getIntentions()` in `lib/intentions.ts`
- [x] 4.5 Frontend filters: Add city/UF selector to `FilterSidebar` above vehicle type filter
- [x] 4.6 Frontend filters: Add city/UF active filter chips to `IntentionFilters`
- [x] 4.7 Feed page: Parse `cidade`/`estado` from URL search params
- [x] 4.8 Frontend: Update `getAvailableFilters()` response type and display location options
