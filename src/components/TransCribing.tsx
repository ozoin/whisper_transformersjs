import React from "react";

const TransCribing = (props) => {
	const { downloading } = props;
	return (
		<div className="flex items-center flex-col justify-center flex-1 gap-10 md:gap-14 pb-24 p-4 text-center">
			<div className="flex flex-col gap-2 sm:gap-4">
				<h1 className="font-semibold text-2xl sm:text-3xl md:text-3xl">
					Transcribing
				</h1>
				<p>{!downloading ? "warming up" : "success"}</p>
			</div>
			<div className="flex flex-col gap-2 max-w-[400px] mx-auto w-full">
				{[0, 1, 2].map((val) => {
					return (
						<div
							key={val}
							className={
								"rounded-full h-2 sm:h-3 bg-slate-400 loading " +
								`loading${val}`
							}
						></div>
					);
				})}
			</div>
		</div>
	);
};

export default TransCribing;
