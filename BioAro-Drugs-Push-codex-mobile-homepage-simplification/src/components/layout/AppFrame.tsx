import { Outlet } from "react-router-dom";

/*
 * The application frame: no footer, no corner assistant, no page gutter.
 *
 * A surface using this owns the viewport below the header and scrolls its own regions.
 * The footer is not hidden here so much as never rendered — the alternative was a
 * route test inside `Layout`, and that file still carries the commented-out remains of
 * exactly that pattern from when it was removed for making the layout know about
 * routes.
 */
export default function AppFrame() {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <Outlet />
    </main>
  );
}
