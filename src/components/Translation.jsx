import React from "react";
import { LANGUAGES } from "../utils/presets";
import Loading from "./Loading";
const Translation = (props) => {
	const {
		textElement,
		toLanguage,
		translating,
		setToLanguage,
		generateTranslation,
	} = props;

	return (
		<div className="flex flex-col gap-2 max-w-[400px] w-full mx-auto">
			{!translating && (
				<div className="flex items-stretch gap-2">
					<select
						value={toLanguage}
						onChange={(e) => setToLanguage(e.target.value)}
						className="flex-1  outline-none bg-white focus:outline-none border-solid border-transparent shadow-xl duration-200 p-2 rounded text-black"
					>
						<option value={"Select Language"}>Select Language</option>
						{Object.entries(LANGUAGES).map(([key, value]) => {
							return (
								<option value={value} key={key}>
									{key}
								</option>
							);
						})}
					</select>
					<button
						className=" specialBtn px-3 py-2 rounded-lg text-blue-600 "
						onClick={generateTranslation}
					>
						Translate
					</button>
				</div>
			)}

			{textElement && !translating && <p>{textElement}</p>}
			{translating && (
				<div className="grid place-items-center">
					<Loading />
				</div>
			)}
		</div>
	);
};

export default Translation;
