const Header = () => {
    return (
        <div className="flex justify-between items-center py-2 px-4 md:px-[100px] shadow">
            <div className="flex items-center">
                <img src="/public/vite.svg" alt="logo" className="h-12" />
                <span className="ml-2 text-lg">一刻问卷星</span>
            </div>
            <div className="w-[40px] h-[40px] bg-green-200 rounded-full"></div>
        </div>
    )
}

export default Header;
