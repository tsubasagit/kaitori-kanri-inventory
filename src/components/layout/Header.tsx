"use client";

import { usePathname } from "next/navigation";

type HeaderProps = {
  onMenuToggle: () => void;
  onLogout: () => void;
  user: {
    displayName: string;
  };
};

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "ダッシュボード",
  "/items": "在庫管理",
  "/items/new": "在庫登録",
  "/customers": "顧客管理",
  "/customers/new": "顧客登録",
  "/purchase": "買取",
  "/sales/new": "販売（レジ）",
  "/transactions": "取引履歴",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/items/")) return "在庫詳細";
  if (pathname.startsWith("/customers/")) return "顧客詳細";
  if (pathname.startsWith("/transactions/")) return "取引詳細";
  return "";
}

export function Header({ onMenuToggle, onLogout, user }: HeaderProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex items-center justify-center rounded-lg p-2 text-secondary hover:bg-muted hover:text-foreground transition-colors lg:hidden"
          aria-label="メニューを開く"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        {pageTitle && (
          <h2 className="text-sm font-semibold text-foreground">{pageTitle}</h2>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-medium text-primary">
            {user.displayName.charAt(0)}
          </div>
          <span className="hidden text-sm font-medium text-foreground sm:inline-block">
            {user.displayName}
          </span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-secondary hover:bg-muted hover:text-foreground transition-colors"
          aria-label="ログアウト"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="hidden sm:inline-block">ログアウト</span>
        </button>
      </div>
    </header>
  );
}
