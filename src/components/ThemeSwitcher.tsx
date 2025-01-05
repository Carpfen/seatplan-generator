import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../state/store";
import { toggleTheme } from "../state/slices/appSlice";
import { MoonIcon, SunIcon } from "./icons/Icons";

const ThemeSwitcher = () => {
    const theme = useSelector((state: RootState) => state.app.theme);
    const dispatch = useDispatch();

    return (
        <button onClick={() => dispatch(toggleTheme())} className="p-2 shadow-md rounded-full border-2 border-default hover:bg-card h-10 aspect-square transition-colors">
            {theme === 'dark' ? (
                <MoonIcon />

            ) : (
                <SunIcon />
            )}
        </button>
    )
}
export default ThemeSwitcher