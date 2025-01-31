import { useTheme } from 'next-themes'
import { LuMoon, LuSun } from "react-icons/lu";

interface ThemeSwitchProps {
  sidebarOpen: boolean
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ sidebarOpen }) => {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <div className='w-full'>
      {sidebarOpen ?
        <div className='flex items-center gap-6'>
          <div className='cursor-pointer group h-6 relative w-12 scale-[1.4] ml-2'>
            <label className="switch">
              <input className="switch__input" type="checkbox" role="switch" checked={resolvedTheme === 'dark'} onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')} />
              <svg className="switch__icon switch__icon--light" viewBox="0 0 12 12" width="12px" height="12px" aria-hidden="true">
                <g fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round">
                  <circle cx="6" cy="6" r="2" />
                  <g stroke-dasharray="1.5 1.5">
                    <polyline points="6 10,6 11.5" transform="rotate(0,6,6)" />
                    <polyline points="6 10,6 11.5" transform="rotate(45,6,6)" />
                    <polyline points="6 10,6 11.5" transform="rotate(90,6,6)" />
                    <polyline points="6 10,6 11.5" transform="rotate(135,6,6)" />
                    <polyline points="6 10,6 11.5" transform="rotate(180,6,6)" />
                    <polyline points="6 10,6 11.5" transform="rotate(225,6,6)" />
                    <polyline points="6 10,6 11.5" transform="rotate(270,6,6)" />
                    <polyline points="6 10,6 11.5" transform="rotate(315,6,6)" />
                  </g>
                </g>
              </svg>
              <svg className="switch__icon switch__icon--dark" viewBox="0 0 12 12" width="12px" height="12px" aria-hidden="true">
                <g fill="none" stroke="#fff" stroke-width="1.2" stroke-linejoin="round" transform="rotate(-45,6,6)">
                  <path d="m9,10c-2.209,0-4-1.791-4-4s1.791-4,4-4c.304,0,.598.041.883.105-.995-.992-2.367-1.605-3.883-1.605C2.962.5.5,2.962.5,6s2.462,5.5,5.5,5.5c1.516,0,2.888-.613,3.883-1.605-.285.064-.578.105-.883.105Z" />
                </g>
              </svg>
              <span className="switch__sr">Dark Mode</span>
            </label>
          </div>
          <p className='font-bold capitalize text-nowrap'>{resolvedTheme} mode</p>
        </div>
        : <div className='cursor-pointer group h-full relative w-12 text-[26px]'>
          {resolvedTheme === 'light' ? <LuSun /> : <LuMoon />}
        </div>}
    </div>
  )
}

export default ThemeSwitch
