# DocuMind — Your Smart Document Companion

A modern web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**, extracting and implementing all components from the provided **Warranty Manager / DocuMind** design specification.

---

## 🚀 Live Local URL

The development server is running and accessible at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🎨 Extracted Components from Reference Image

1. **All Components Board (`AllComponentsBoard.tsx`)**
   - High-fidelity visual artboard presenting all 10 component groups simultaneously matching the reference image layout.
   - Interactive toggles to open each component in full interactive mode.

2. **Authentication Screen (`AuthScreen.tsx` - Top-Left)**
   - Dark hero brand panel featuring device showcase, value propositions, and shield logo.
   - White "Welcome Back!" login card with email, password visibility toggle, "Remember me", "Forgot password?", "Login", "Continue with Google", and "Sign up".

3. **Dashboard Overview (`DashboardScreen.tsx` - Top-Right)**
   - "Good Morning, Mohan! 👋" greeting with summary cards:
     - **Total Products**: `5` (`+1 added this month`)
     - **Active Warranties**: `4` (`1 expiring soon`)
     - **Expiring Soon**: `2` (`Within 30 days`)
     - **Total Documents**: `8` (`Invoices, cards, etc.`)
   - **Your Products** cards (HP Victus Gaming Laptop, iPhone 15, Samsung 55" TV) with color-coded expiry badges (`2y left`, `11m left`).
   - **Upcoming Expiries** ranked timeline with dynamic urgency badges (`11 days left`, `21 days left`, `4 months left`).

4. **Add New Product / Warranty Wizard (`AddProductScreen.tsx` - Row 2, Left)**
   - 3-step interactive progress stepper (`Product Details` ➔ `Warranty Details` ➔ `Documents`).
   - Form fields: Product Name, Brand, Category, Model/Serial Number, Purchase Date, Purchase Price.
   - **Popular Categories Quick-Picker**: Mobile Phones, Laptops, TV & Home Appliances, Audio Devices, Smart Watches, Others.

5. **Product Details View (`ProductDetailsScreen.tsx` - Row 2, Right)**
   - Back navigation, hero device picture, title, brand/model/serial, and green `Warranty Active` badge.
   - Multi-tab navigation: `Details`, `Warranty`, `Documents`, `Reminders`.
   - Specifications grid and **Quick Actions** card (`Edit Details`, `Add Document`, `Set Reminder`, `Delete Product`).

6. **All Documents Library (`DocumentsScreen.tsx` - Row 3, Left)**
   - Category filter pills: `All`, `Invoices`, `Warranty Cards`, `Insurance`, `Vouchers`, `Gift Cards`.
   - Document table list with filetype badges, file sizes, upload dates, and action menus.

7. **Expiry Reminders Tracker (`RemindersScreen.tsx` - Row 3, Middle)**
   - Segmented toggle: `Upcoming` / `All`.
   - Dynamic timeline cards with countdown badges.

8. **DocuMind AI Assistant (`AIAssistantScreen.tsx` - Row 3, Right)**
   - Grounded RAG chat interface with bot greeting and suggested questions.
   - Answers grounded in registered documents with document citations and coverage/exclusion breakdowns.

9. **Settings & Profile (`SettingsScreen.tsx` - Row 4, Left)**
   - Sub-navigation: `Profile`, `Notifications`, `Privacy & Security`, `Appearance`, `Help & Support`.
   - Profile editor: Avatar upload, Full Name, Email, Phone Number, Student ID, and Save Changes feedback.

10. **Mobile Device Mockup (`MobileViewMockup.tsx` - Row 4, Middle)**
    - Realistic mobile phone frame with bezel and camera notch displaying the responsive layout and bottom navigation bar.

11. **Design System Specification (`DesignSystemSpec.tsx` - Row 4, Right)**
    - Official color swatches (`#4263EB`, `#7657F6`, `#8B5CF6`, `#22C55E`, `#F59E0B`, `#EF4444`, `#1E293B`, `#F8FAFC`).
    - Typography hierarchy (Heading 1, 2, 3, Body, Small, Caption).
    - Sample iconography and brand logo specimen.

---

## 🛠️ How to Run Locally

If you need to start the server again in the future:

```bash
# 1. Install dependencies (already completed)
npm install

# 2. Run the development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

