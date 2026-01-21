import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <>
            <div className="flex items-center gap-3">
            {/* Logo */}
            <AppLogoIcon className="h-16 w-16 text-white" />

            {/* Brand name */}
            <span className="hidden sm:block text-xl font-bold text-emerald-100">
                EduFit
            </span>
        </div>

            </>


        </>
    );
}
