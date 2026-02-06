# Change: Improve web landing page, contact info, and feed UX

## Why
The app no longer charges users for anything (intentions are free, subscriptions are disabled), but the Terms of Use still reference paid features and Mercado Pago. Additionally, there is no contact page or easy way for users to reach support — the `/suporte` link in the footer is a dead link. The feed search bar is hard to find (small, off-center), and there is no way to filter intentions by city/UF despite the backend already supporting it.

## What Changes
- **Update Terms of Use**: Remove all references to payment, Mercado Pago, and paid publication of intentions. Reflect that the platform is currently 100% free.
- **Update Privacy Policy**: Update contact email from `contato@teachei.com.br` to `app.teachei.shop@gmail.com`.
- **Create "Fale Conosco" (Contact) page**: New `/contato` page with direct links:
  - Phone: `11944434123` (WhatsApp link)
  - Email: `app.teachei.shop@gmail.com` (mailto link)
  - Instagram: `teacheiapp` (Instagram profile link)
- **Add contact link in header and footer**: Phone/headset icon in header linking to `/contato`. Add "Fale Conosco" link in footer Legal section. Replace dead `/suporte` links.
- **Update `siteConfig`**: Update WhatsApp number and add email/phone to config.
- **Center search in feed header**: Make search input more prominent and centered in the header on the feed page.
- **Add city/UF filter**: New location filter above vehicle type filter in the filter sidebar. Populate from a new `localizacoes` field returned by the available-filters backend endpoint. Add `cidade` and `estado` params to frontend filter flow.

## Impact
- Affected specs: web-legal-content (new), web-contact (new), web-feed-filters (new), web-header-layout (new)
- Affected code:
  - `teachei-web/app/(main)/termos/page.tsx` - Terms of use text
  - `teachei-web/app/(main)/privacidade/page.tsx` - Privacy policy text
  - `teachei-web/app/(main)/contato/page.tsx` - New contact page
  - `teachei-web/components/landing/landing-page.tsx` - Landing footer links
  - `teachei-web/components/layout/footer.tsx` - Footer links
  - `teachei-web/components/layout/header.tsx` - Contact icon + search centering
  - `teachei-web/components/layout/search-input.tsx` - Search styling/routing
  - `teachei-web/components/intentions/filter-sidebar.tsx` - City/UF filter UI
  - `teachei-web/components/intentions/intention-filters.tsx` - City/UF active filter chips
  - `teachei-web/app/feed/page.tsx` - City/UF URL params
  - `teachei-web/types/index.ts` - IntentionFilters, AvailableFilters types
  - `teachei-web/lib/intentions.ts` - API params for cidade/estado
  - `teachei-web/hooks/use-intentions.ts` - useAvailableFilters
  - `teachei-web/config/site.ts` - Contact config
  - `TeAchei/src/main/java/.../BuscarFiltrosDisponiveisUseCaseImpl.java` - Add location aggregation
  - `TeAchei/src/main/java/.../FiltrosDisponiveisResponse.java` - Add localizacoes field
