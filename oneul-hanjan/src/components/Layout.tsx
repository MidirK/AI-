import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: '홈' },
  { to: '/pick-drink', label: '술부터 고르기' },
  { to: '/pick-snack', label: '안주부터 고르기' },
  { to: '/saved', label: '저장한 조합' },
];

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-bar-border/70 sticky top-0 z-20 bg-bar-bg/95 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <NavLink to="/" className="font-display text-xl sm:text-2xl text-bar-amber tracking-wide">
            오늘 한잔
          </NavLink>
          <nav className="flex flex-wrap gap-1 sm:gap-2 justify-end">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                    'px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm transition-colors',
                    isActive
                      ? 'bg-bar-amber/15 text-bar-amber border border-bar-amber/40'
                      : 'text-bar-ivorydim hover:text-bar-ivory border border-transparent',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 py-8 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-bar-border/70 mt-auto">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 text-xs sm:text-sm text-bar-ivorydim/80 space-y-2">
          <p>
            <span className="text-bar-gold font-medium">성인 대상 서비스</span> · 만 19세 미만은 이용할 수
            없어요.
          </p>
          <p>지나친 음주는 건강에 해롭습니다. 즐기는 만큼, 스스로의 속도를 지켜주세요.</p>
          <p className="text-bar-ivorydim/50">
            오늘 한잔은 초기 프로토타입이에요. 소개된 안주 가격·조리 시간은 예시이며, 실제 매장 재고나
            제휴 정보와는 관련이 없습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
