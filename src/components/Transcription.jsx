import React from "react";

const Transcription = (props) => {
	const { TextElement } = props;

	return (
		<div className="text-xl mb-5 text-justify whitespace-normal subpixel-antialiased tracking-wide">
			{TextElement}
		</div>
	);
};

export default Transcription;
