const Header = () => {
	return (
		<header className="w-full flex items-center justify-between md:gap-4 md:p-4">
			<a href="/">
				<h1 className="text-md md:text-xl font-semibold tracking-wider">
					Transcribe & <span className="">Translate</span>
				</h1>
			</a>
			<h1 className=" text-md md:text-xl font-semibold tracking-wider">
				transformers.js
			</h1>
		</header>
	);
};

export default Header;
