import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import AiChatWidget from "../ask/AiChatWidget";

/*
 * The ordinary page frame: a scrolling main, the footer, and the corner assistant.
 *
 * Split out of `Layout` so one route subtree can opt out of it. `Layout` keeps every
 * provider plus the header and the cart drawer, so crossing between frames remounts
 * nothing and resets no session.
 *
 * The widget lives HERE rather than in `Layout`, which is how it disappears on the
 * dedicated AI page with no path matching at all: a launcher onto the surface you are
 * already standing on is a duplicate front door, and at z-30 it would float over that
 * page's protocol pane.
 */
export default function SiteFrame() {
  return (
    <>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AiChatWidget />
    </>
  );
}
