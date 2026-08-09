import { jsxs, jsx } from "react/jsx-runtime";
import { useRouter } from "@tanstack/react-router";
import { B as Button } from "./router-BDc1MU06.js";
import "react";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
import "lucide-react";
function Header({ title, subTitle }) {
  return /* @__PURE__ */ jsxs("header", { className: "mb-5 border-b border-border pb-5", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold tracking-tight mb-2", children: title }),
    subTitle && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg", children: subTitle })
  ] });
}
const assignments = [
  {
    id: "feature-flag-editor",
    title: "Feature Flag Editor",
    difficulty: "Hard",
    url: "/code-challenge/feature-flag-form",
    status: "Available"
  }
];
const OverviewPage = () => {
  const router = useRouter();
  return /* @__PURE__ */ jsxs("div", { className: "bg-background text-foreground font-sans box-border", children: [
    /* @__PURE__ */ jsx(Header, { title: "Assignment Dashboard" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", children: assignments.map((task) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "group bg-card p-5 rounded-lg border border-border shadow-sm hover:border-primary transition-colors flex flex-col justify-between",
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${task.difficulty === "Hard" ? "border-red-500 text-red-500" : task.difficulty === "Expert" ? "border-purple-500 text-purple-500" : "border-blue-500 text-blue-500"}`,
                  children: task.difficulty
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: task.status })
            ] }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold group-hover:text-primary", children: task.title })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              disabled: task.status !== "Available",
              className: `w-full mt-5 py-2 rounded-md text-sm font-medium transition-all ${task.status === "Available" ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"}`,
              onClick: () => router.navigate({ to: task.url }),
              children: task.status === "Available" ? "Start Assignment" : "Locked"
            }
          )
        ]
      },
      task.id
    )) })
  ] });
};
const SplitComponent = OverviewPage;
export {
  SplitComponent as component
};
