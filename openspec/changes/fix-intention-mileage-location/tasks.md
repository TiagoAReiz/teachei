## 1. Fix Location Selector Bug
- [x] 1.1 Update `onEstadoChange` callback in `teachei-web/app/create/review/page.tsx` to clear city when state changes
- [x] 1.2 Test location selector by changing state and verifying city clears properly

## 2. Add Mileage to Intention Detail Screen
- [x] 2.1 Add mileage (quilometragem) to the specs array in `teachei-web/app/intention/[id]/client.tsx`
- [x] 2.2 Format mileage display as range (e.g., "10.000 - 50.000 km" or "Até 50.000 km")

## 3. Add Mileage to Web Intention Card
- [x] 3.1 Update `teachei-web/components/intentions/intention-card.tsx` to display mileage
- [x] 3.2 Use Gauge icon and format mileage consistently

## 4. Add Mileage to Mobile Intention Card
- [x] 4.1 Update `teachei-mobile/components/intentions/intention-card.tsx` to display mileage
- [x] 4.2 Use consistent formatting with web version

## 5. Verification
- [ ] 5.1 Test intention creation with city/state selector
- [ ] 5.2 Verify mileage appears on grid/feed cards
- [ ] 5.3 Verify mileage appears on intention detail page
