const FileDisplay = (props) => {
	const { handleFormSubmission, ResetAudio, file, audioStream } = props;
	return (
		<main className="flex-1 p-4 flex flex-col gap:3 sm:gap-4 md:gap-5 justify-center text-center pb-20 w-fit max-w-full mx-auto">
			<h1 className="font-semibold text-2xl sm:text-3xl md:text-3xl">
				Your File
			</h1>
			<div className=" mx-auto flex flex-col text-left mb-4">
				<h4 className="font-semibold ">{file ? file.name : "Custom audio"}</h4>
			</div>
			<div className="flex items-center justify-between gap-4">
				<button
					className="text-slate-400 hover:text-blue-600 duration-200"
					onClick={ResetAudio}
				>
					Reset
				</button>
				<button
					onClick={handleFormSubmission}
					className="specialBtn px-4 py-2 rounded-lg text-blue-400"
				>
					<p>Transcribe</p>
				</button>
			</div>
		</main>
	);
};

export default FileDisplay;
